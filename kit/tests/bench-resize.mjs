/* LE BANC DU REDIMENSIONNEMENT — kit/tests/bench-resize.mjs (12 septembre 2026)
   Question : quand la fenêtre change de largeur, où passe le temps ?
   Chromium (Playwright) ouvre chaque page à 1440 px, balaie la largeur vers
   900 px et retour (pas de 16 px, comme une poignée qu'on tire), et la trace
   du moteur de rendu dit ce qui a coûté : script (et lequel), recalcul de
   style, mise en page (forcée ou non), peinture.

     KIT_DIST=.next-tests node tests/bench-resize.mjs            → site construit (next start)
     node tests/bench-resize.mjs --url=http://localhost:3001     → un serveur déjà ouvert (dev : noms lisibles)
     node tests/bench-resize.mjs --pages=/couleur,/typo          → un sous-ensemble

   Il ne juge pas : il mesure. La lecture se fait en comparant les pages
   entre elles et le même banc avant / après une correction. */
import { openSite, openBrowser } from './bench.mjs'

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=')
const PAGES = (arg('pages') ?? '/,/rythme,/typo,/arrondis,/couleur,/composition,/mouvement,/adaptation').split(',')
const FROM = 1440, TO = 900, STEP = 16, HEIGHT = 900
const steps = []
for (let w = FROM; w >= TO; w -= STEP) steps.push(w)
for (let w = TO + STEP; w <= FROM; w += STEP) steps.push(w)

const CATS = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.stack', 'v8.execute']
const NAMES = { FunctionCall: 'script', EvaluateScript: 'script', TimerFire: 'script', FireAnimationFrame: 'script', EventDispatch: 'script', 'v8.callFunction': 'script',
  UpdateLayoutTree: 'style', Layout: 'layout', PrePaint: 'prépeinture', Paint: 'peinture', Layerize: 'calques', Commit: 'commit', HitTest: 'hit', UpdateLayer: 'calques', PaintImage: 'peinture', 'Decode Image': 'image', RasterTask: 'raster', ImageDecodeTask: 'image' }

function analyse(events) {
  /* temps propre par événement : une pile par fil, les enfants retirés du parent */
  const byThread = new Map()
  for (const e of events) if (e.ph === 'X' && e.dur) { const k = `${e.pid}:${e.tid}`; (byThread.get(k) ?? byThread.set(k, []).get(k)).push(e) }
  const self = new Map(), incl = new Map(), forced = new Map(), fns = new Map()
  let forcedCount = 0, layoutCount = 0, longTasks = 0, longTime = 0, worst = 0
  for (const list of byThread.values()) {
    list.sort((a, b) => a.ts - b.ts || b.dur - a.dur)
    const stack = []
    for (const e of list) {
      while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= e.ts) stack.pop()
      const parent = stack[stack.length - 1]
      e.self = (e.self ?? 0) + e.dur
      if (parent) parent.self = (parent.self ?? 0) - e.dur
      stack.push(e)
    }
    for (const e of list) {
      const n = e.name
      self.set(n, (self.get(n) ?? 0) + e.self)
      incl.set(n, (incl.get(n) ?? 0) + e.dur)
      if (n === 'RunTask' && e.dur > 50000) { longTasks++; longTime += e.dur; worst = Math.max(worst, e.dur) }
      if (n === 'Layout') { layoutCount++; const st = e.args?.beginData?.stackTrace; if (st?.length) { forcedCount++; const f = st[0]; const k = `${f.functionName || '(anonyme)'} ${short(f.url)}:${f.lineNumber}`; forced.set(k, (forced.get(k) ?? 0) + e.dur) } }
      if (n === 'FunctionCall' || n === 'TimerFire' || n === 'FireAnimationFrame' || n === 'EventDispatch') {
        const d = e.args?.data ?? {}
        const k = n === 'EventDispatch' ? `event ${d.type}` : `${n} ${d.functionName || ''} ${short(d.url)}:${d.lineNumber ?? ''}`.trim()
        fns.set(k, (fns.get(k) ?? 0) + e.dur)
      }
    }
  }
  const groups = {}
  for (const [n, t] of self) { const g = NAMES[n]; if (g) groups[g] = (groups[g] ?? 0) + t }
  return { groups, self, incl, forced, fns, forcedCount, layoutCount, longTasks, longTime, worst }
}
const short = (u = '') => u.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '').slice(-48)
const ms = (us) => (us / 1000).toFixed(0).padStart(6) + ' ms'
const top = (m, n = 6) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n)

const url = arg('url')
const site = url ? { url, close() {} } : await openSite()
const b = await openBrowser()
try {
  for (const path of PAGES) {
    const ctx = await b.browser.newContext({ viewport: { width: FROM, height: HEIGHT } })
    const page = await ctx.newPage()
    await page.goto(site.url + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500) /* les chorégraphies d'entrée se jouent, la page se pose */
    const cdp = await ctx.newCDPSession(page)
    const events = []
    cdp.on('Tracing.dataCollected', (d) => events.push(...d.value))
    const done = new Promise((r) => cdp.once('Tracing.tracingComplete', r))
    await cdp.send('Tracing.start', { traceConfig: { includedCategories: CATS, recordMode: 'recordContinuously' }, transferMode: 'ReportEvents' })
    const t0 = performance.now()
    for (const w of steps) await page.setViewportSize({ width: w, height: HEIGHT })
    await page.waitForTimeout(300) /* ce que le redimensionnement laisse derrière lui (rAF, timers) */
    const wall = performance.now() - t0
    await cdp.send('Tracing.end'); await done
    const r = analyse(events)
    console.log(`\n══ ${path}  —  ${steps.length} pas en ${wall.toFixed(0)} ms (${(wall / steps.length).toFixed(1)} ms/pas) · tâches > 50 ms : ${r.longTasks} (${(r.longTime / 1000).toFixed(0)} ms, pire ${(r.worst / 1000).toFixed(0)} ms)`)
    console.log('   ' + Object.entries(r.groups).sort((a, b) => b[1] - a[1]).map(([g, t]) => `${g} ${(t / 1000).toFixed(0)}`).join(' · ') + ' ms')
    console.log(`   mises en page : ${r.layoutCount}, dont forcées par un script : ${r.forcedCount}`)
    for (const [k, t] of top(r.forced, 5)) console.log(`     forcé ${ms(t)}  ${k}`)
    for (const [k, t] of top(r.fns, 8)) console.log(`     ${ms(t)}  ${k}`)
    await ctx.close()
  }
} finally { await b.browser.close(); site.close() }
