/* LE BANC DES CRASH-TESTS DE PAGE — kit/tests/bench.mjs
   Le moteur (derivation.mjs) prédit ; le navigateur (Chromium, par
   Playwright) calcule la mise en page réelle ; on compare au dixième de
   pixel. Rien ici ne regarde un pixel à l'œil : on lit ce que le moteur
   de rendu a décidé (getComputedStyle), à trois largeurs d'écran et dans
   les trois densités.

   Lancer : npm run test:pages  (construit le site, puis node --test tests/*.test.mjs)
   Le site construit (.next) est servi par « next start » sur un port à part. */
import { spawn } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { chain, tokens, derived, PRIMARY_DEFAULTS, REGISTRY, ROOT_BROWSER, DENSITIES, INTENTS, OFF_CHAIN } from '../derivation.mjs'

export const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const WIDTHS = [320, 768, 1440]
export const DENSITIES_SITE = ['compact', 'comfortable', 'airy']
export const TOL = 0.06 /* au dixième de pixel, avec l'arrondi du navigateur */

/* ── Le serveur du site construit ── */
const portFree = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)) }) })
export async function openSite(port) {
  port ??= await portFree()
  const proc = spawn(process.execPath, [path.join(KIT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port)], { cwd: KIT, stdio: ['ignore', 'pipe', 'pipe'] })
  const url = `http://127.0.0.1:${port}`
  process.on('exit', () => proc.kill()) /* jamais un serveur orphelin */
  const start = Date.now()
  let output = ''
  proc.stdout.on('data', (d) => { output += d })
  proc.stderr.on('data', (d) => { output += d })
  while (Date.now() - start < 30000) {
    try { const r = await fetch(url + '/rythme', { method: 'HEAD' }); if (r.ok) break } catch {}
    if (proc.exitCode !== null) throw new Error(`refus de statuer — le site ne démarre pas (a-t-on construit ? npm run build)\n${output}`)
    await new Promise((r) => setTimeout(r, 250))
  }
  return { url, close: () => { proc.kill() } }
}

/* ── Le navigateur ── */
export async function openBrowser() {
  const browser = await chromium.launch()
  return {
    browser,
    /* Une page à une largeur, une densité, un thème — les réglages sont posés
       comme le site les lit (localStorage, relu au chargement par layout.tsx). */
    async page(url, { width = 1440, density = 'comfortable', theme = 'light', height = 900 } = {}) {
      const ctx = await browser.newContext({ viewport: { width: width, height: height }, reducedMotion: 'reduce' })
      await ctx.addInitScript(({ density, theme }) => {
        try {
          localStorage.clear()
          if (density !== 'comfortable') localStorage.setItem('kit-density', density)
          localStorage.setItem('kit-theme', theme)
        } catch {}
      }, { density, theme })
      const p = await ctx.newPage()
      const errors = []
      p.on('pageerror', (e) => errors.push(String(e)))
      p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
      await p.goto(url, { waitUntil: 'networkidle' })
      await p.evaluate(() => document.fonts.ready)
      return { p, errors, close: () => ctx.close() }
    },
    close: () => browser.close(),
  }
}

/* ── Ce que le moteur prédit, à une largeur d'écran ──
   Le CSS interpole DROIT entre les deux bornes (clamp), là où la pièce
   d'Auteur affiche une courbe adoucie : on prédit ce que le navigateur
   calcule, c'est-à-dire la valeur de clamp(). Un jeton fixe vaut sa valeur. */
const evalCss = (expr, W) => {
  const src = expr
    .replace(/(-?[\d.]+)rem/g, (_, v) => String(parseFloat(v) * ROOT_BROWSER))
    .replace(/(-?[\d.]+)vw/g, (_, v) => String((parseFloat(v) * W) / 100))
    .replace(/(-?[\d.]+)px/g, '$1')
  if (!/^[\d\s.,+\-*/()a-z]+$/i.test(src)) throw new Error(`refus de statuer — expression CSS non lue : ${expr}`)
  return Function('clamp', 'min', 'max', `return (${src})`)((a, b, c) => Math.min(Math.max(a, b), c), Math.min, Math.max)
}
/* Le registre à une base (la densité) — mis en cache. */
const registries = new Map()
export const registry = (base = DENSITIES.comfortable) => {
  if (!registries.has(base)) registries.set(base, tokens(chain({ base })))
  return registries.get(base)
}
/* La valeur d'un jeton (nom sans « -- ») à la largeur W, pour une base ; les
   alias var(--x) se résolvent dans le registre, puis dans le gabarit. */
export function expected(name, W, base = DENSITIES.comfortable) {
  const j = registry(base)
  let css = j[name]?.css ?? REGISTRY.doc[name]
  /* les colonnes ne suivent pas la densité ; la marge de page change de cran avec le régime du rail */
  if (css === undefined && REGISTRY.docColumns[name]) {
    const source = W >= OFF_CHAIN.thresholdRail * ROOT_BROWSER && REGISTRY.docColumnsDesktop[name] ? REGISTRY.docColumnsDesktop[name] : REGISTRY.docColumns[name]
    css = registry(DENSITIES.comfortable)[source].css
  }
  if (css === undefined) throw new Error(`refus de statuer — jeton inconnu : ${name}`)
  css = css.replace(/var\(--([a-z0-9-]+)\)/g, (_, n) => String(expected(n, W, base)))
  return evalCss(css, W)
}
/* Les valeurs que le moteur peut produire à cette largeur — pour le balayage « rien en dur ». */
export function admissible(W, base = DENSITIES.comfortable) {
  const v = new Set([0])
  /* la chaîne à la base du site, et aux deux autres bases : une démo peut porter sa propre densité (data-density) */
  for (const b of new Set([base, ...Object.values(DENSITIES)])) {
    for (const n of Object.keys(registry(b))) if (/^(pad|gap|edge|page)-|^r-|^control-height/.test(n)) v.add(expected(n, W, b))
    for (const n of Object.keys(REGISTRY.doc)) v.add(expected(n, W, b))
  }
  for (const n of Object.keys(REGISTRY.docColumns)) v.add(expected(n, W))
  /* le laboratoire : les six intentions, en px calculés par le moteur */
  for (const i of INTENTS) { const s = chain(i); for (const x of [...s.pad, ...s.gap, ...s.r, s.rCtl]) v.add(x) }
  return [...v]
}
export const near = (a, b, tol = TOL) => Math.abs(a - b) <= tol
export const insideTheset = (x, set, tol = TOL) => set.some((v) => near(x, v, tol))

/* Les encres, par thème — pour l'épreuve C17. */
export const inks = (theme) => derived(PRIMARY_DEFAULTS)[theme]
export const rgb = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return `rgb(${r}, ${g}, ${b})` }

/* Les nombres écrits « à la française » sur une page (« 17,1 ») → nombres. */
export const numbers = (text) => [...text.matchAll(/-?\d+(?:,\d+)?/g)].map((m) => parseFloat(m[0].replace(',', '.')))
/* L'écriture des pages : un chiffre après la virgule. */
export const px = (v) => String(Math.round(v * 10) / 10).replace('.', ',')

/* ── Les mesures dans la page ── */
export const calc = (p, sel, prop, index = 0) => p.evaluate(([sel, prop, i]) => {
  const el = document.querySelectorAll(sel)[i]
  if (!el) return null
  return getComputedStyle(el)[prop]
}, [sel, prop, index])
export const calcPx = async (p, sel, prop, index = 0) => { const v = await calc(p, sel, prop, index); return v === null ? null : parseFloat(v) }
export const text = (p, sel, index = 0) => p.evaluate(([sel, i]) => document.querySelectorAll(sel)[i]?.textContent ?? null, [sel, index])
export const texts = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => e.textContent), sel)

/* ── Les crans de texte que le moteur produit à cette largeur (le texte ne suit pas la densité). ── */
export function sizesAdmissible(W) {
  const v = new Set()
  for (const n of Object.keys(registry())) if (/^font-size-/.test(n)) v.add(expected(n, W))
  for (const n of ['doc-cover', 'doc-section']) v.add(expected(n, W))
  return [...v]
}
/* Lire une feuille bloc par bloc : pour chaque ligne, le sélecteur du bloc où elle vit
   (un bloc peut s'ouvrir sur une ligne et se déclarer sur les suivantes). */
export function linesAlongSelector(cssSrc) {
  const out = []
  let current = null
  for (const l of cssSrc.split('\n')) {
    const opening = l.match(/^\s*([^{}/][^{]*?)\s*\{/)
    const sel = opening ? opening[1].trim() : current
    if (sel) out.push([sel, l])
    if (opening && !/\}/.test(l.slice(l.indexOf('{')))) current = opening[1].trim()
    if (/\}/.test(l) && !opening) current = null
    if (opening && /\}/.test(l.slice(l.indexOf('{')))) current = null
  }
  return out
}
/* Les sélecteurs d'une feuille dont la ligne pose la propriété ET la dit « hors chaîne » ou « casse » :
   ce sont les seules exceptions admises au balayage. */
export function selectorsDeclaredAll(cssSrc, prop) {
  const rx = new RegExp(`(^|[\\s;{])${prop}\\s*:`)
  return [...new Set(linesAlongSelector(cssSrc).filter(([, l]) => rx.test(l) && /hors chaîne|casse/.test(l)).map(([s]) => s))]
}
/* Les sélecteurs dont la propriété est une proportion en em (un point sous un titre, l'unité d'un
   chiffre, l'espace d'une flèche) : une proportion typographique, pas un cran — admise par le vérificateur du site. */
export function selectorsInEm(cssSrc, prop = 'font-size') {
  const rx = new RegExp(`(^|[\\s;{])${prop}\\s*:\\s*[\\d.]+em\\b`)
  return [...new Set(linesAlongSelector(cssSrc).filter(([, l]) => rx.test(l)).map(([s]) => s))]
}
/* ── « Rien en dur » pour les tailles de texte : dans les corps de sections, chaque
   corps calculé est un cran du moteur à cette largeur, sauf déclaré (sélecteurs dits
   « hors chaîne » / « casse » dans la feuille, casses data-intent, valeurs passées). ── */
export async function faultsSizes(p, W, { exclusions = [], allowed = [], root = 'main .gdoc-body' } = {}) {
  const set = [...sizesAdmissible(W), ...allowed]
  return p.evaluate(([root, set, exclusions, tol]) => {
    const faults = []
    for (const el of document.querySelectorAll(`${root} *`)) {
      const excluded = exclusions.some((s) => { try { return el.matches(s) } catch { return false } })
      if (el.closest('[data-intent="statement"]') || excluded) continue
      if (!el.textContent.trim()) continue
      const v = parseFloat(getComputedStyle(el).fontSize)
      if (!set.some((x) => Math.abs(x - v) <= tol)) faults.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} font-size: ${v}px`)
    }
    return [...new Set(faults)]
  }, [root, set, exclusions, TOL])
}

/* ── Zéro débord : la page ne dépasse jamais la largeur de l'écran (invariant d'audit, règle 15). ── */
export const overflow = (p) => p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth))

/* ── C17, mesuré : tout élément dont l'encre calculée est le tertiaire porte
   600 au moins, ne descend pas sous le cran étiquette, et n'est pas un
   paragraphe de texte lu. ── */
export async function faultsC17(p, theme, W) {
  const tertiary = rgb(inks(theme)['text-tertiary'])
  const label = expected('font-size-label', W)
  return p.evaluate(([tertiary, label, tol]) => {
    const faults = []
    for (const el of document.querySelectorAll('main *')) {
      const cs = getComputedStyle(el)
      if (cs.color !== tertiary || !el.textContent.trim()) continue
      const describe = () => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} « ${el.textContent.trim().slice(0, 40)} »`
      if (parseInt(cs.fontWeight) < 600) faults.push(`${describe()} — graisse ${cs.fontWeight} (600 au moins)`)
      if (parseFloat(cs.fontSize) < label - tol) faults.push(`${describe()} — corps ${cs.fontSize} sous le cran étiquette`)
      if (el.tagName === 'P' && el.textContent.trim().length > 160) faults.push(`${describe()} — un paragraphe lu en tertiaire`)
    }
    return faults
  }, [tertiary, label, TOL])
}

/* ── « Rien en dur », mesuré : dans les corps de sections, chaque marge,
   espace ou coin calculé appartient aux valeurs que le moteur produit à
   cette largeur — sauf casse déclarée (data-intent="statement") et sauf les
   blocs d'espace eux-mêmes, qui SONT des jetons rendus visibles. ── */
export async function faultsInHard(p, W, base, { root = 'main .gdoc-body', exclusions = [] } = {}) {
  const set = admissible(W, base)
  return p.evaluate(([root, set, exclusions, tol]) => {
    const ok = (x) => x === 0 || set.some((v) => Math.abs(v - x) <= tol)
    const faults = []
    const props = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap', 'borderTopLeftRadius']
    for (const el of document.querySelectorAll(`${root} *`)) {
      if (el.closest('[data-intent="statement"]') || el.classList.contains('space')) continue
      if (exclusions.some((s) => { try { return el.matches(s) } catch { return false } })) continue
      const cs = getComputedStyle(el)
      for (const prop of props) {
        const v = cs[prop]
        if (v === 'normal' || v === '' || v === undefined) continue
        const n = parseFloat(v)
        if (Number.isNaN(n) || v.endsWith('%')) continue
        if (n >= 9999) continue /* la pilule */
        if (!ok(n)) faults.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${prop}: ${v}`)
      }
    }
    return [...new Set(faults)]
  }, [root, set, exclusions, TOL])
}

/* ── L'écriture d'une page (8 septembre 2026, instructions d'Auteur) ──
   Le texte porte la connaissance ; l'interface rend le geste évident. Donc :
   aucun mot qui commande le lecteur ou décrit l'écran ; pas d'histoire de
   page devant le lecteur (« ce qui remplace l'extrait ») ; pas de pied qui
   commente la page ; UN répertoire par page, sous un titre à elle — plus la
   queue en trois sections aux titres copiés d'une page à l'autre ; et l'arbre
   des titres ne saute jamais un niveau (la page Typo l'exige des autres). */
export const HEADINGS_OF_THERE_TAIL = [
  /Voyez ce qui se passe quand la règle saute/, /Elles se vérifient ailleurs/, /Le même système, dans votre stack/,
]
export async function faultsWriting(p) {
  const faults = []
  const body = await text(p, 'main')
  const words = /Regardez|Observez|Voyez|Essayez|Cliquez|Appuyez|Faites glisser|Tirez|Cassez|Tournez|Serrez|Posez|Pâlissez|Retirez|Divisez|Comme vous pouvez|Vous voyez|vous voyez|Cette démonstration|À gauche vous/g
  for (const m of body.match(words) ?? []) faults.push(`un mot qui commande ou décrit : « ${m} »`)
  for (const m of body.match(/Ce qui remplace l.extrait|Ce qui a quitté cette page/g) ?? []) faults.push(`de l'histoire de page devant le lecteur : « ${m} »`)
  if (await p.locator('main .gd-foot').count()) faults.push('un pied qui commente la page')
  const h2 = await texts(p, 'main .gdoc-sec h2')
  for (const t of h2) for (const q of HEADINGS_OF_THERE_TAIL) if (q.test(t)) faults.push(`un titre de la queue commune : « ${t} »`)
  if (await p.locator('main #registry').count() !== 1) faults.push('pas un répertoire — exactement un, #registry')
  /* L'ordre des pièces est une convention commune aux six pages (verdict d'Auteur,
     8 septembre) : ce qui se casse, puis les règles en liste, puis les valeurs et le
     code — jamais le code au milieu. */
  const pieces = await p.$$eval('main #registry .doc-piece', (es) => es.map((e) => e.id))
  const rank = (id) => (/^(wreck|bands)$/.test(id) ? 0 : /^(invisibles|list)$/.test(id) ? 1 : 2)
  for (let i = 1; i < pieces.length; i++) if (rank(pieces[i]) < rank(pieces[i - 1])) faults.push(`les pièces du répertoire dans le désordre : ${pieces.join(' → ')}`)
  if (pieces.length && rank(pieces[pieces.length - 1]) !== 2) faults.push(`le répertoire ne finit pas sur les valeurs et le code : ${pieces.join(' → ')}`)
  const levels = await p.$$eval('main h1, main h2, main h3, main h4, main h5, main h6', (es) => es.map((e) => +e.tagName[1]))
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) faults.push(`un saut de niveau de titre : h${levels[i - 1]} → h${levels[i]} (titre nº ${i + 1})`)
  return faults
}
