#!/usr/bin/env node
/* L'ÉPREUVE D'UN FICHIER — kit/tests/verify.mjs (11 septembre 2026)

   node kit/tests/verify.mjs <fichier.html | URL> [--width 1440] [--json] [--prove]

   Une seule commande, sur n'importe quel HTML — pas seulement les pages du kit. Elle rend :
   · les quatre cas des voisins (loi 16, le solde) : a se fermer · b se solder · c contrôle
     jamais étiré · d filet à égale distance — mesurés SUR LE CONTENU, jamais sur la boîte ;
   · « pas de nombre » au rendu : chaque espace, taille et rayon calculé est une valeur du
     moteur à cette largeur ;
   · le contraste de chaque texte contre le fond qu'il a réellement ;
   · les débords aux treize situations (la matrice N2 de tests/situations.mjs).

   RIEN N'EST VERT TANT QUE LA CAPACITÉ À ÉCHOUER N'EST PAS PROUVÉE : avant de juger le
   fichier, l'épreuve rejoue ses fixtures piégées et leurs mutations (tests/fixtures/voisins/).
   Une mutation qui ne fait pas rougir le cas qu'elle vise → refus de statuer, code 2.
   Une mutation qui le rougit de moins de MARGE lignes → refus de statuer aussi : elle tient
   à un cheveu, donc au rendu du texte de la machine, et elle repassera au vert ailleurs sans
   que personne le voie (12 septembre 2026 : c'est exactement ce qui était arrivé au cas a).
   Un cas rouge sur le fichier → code 1. Tout vert → code 0.

   Ce que l'épreuve ne juge pas : si le seuil 1,5 et la tolérance d'une ligne sont les bons
   (⚪, réglages à valider à l'œil) ; la forme des items (chantier à part) ; l'échelle des
   images (absente du kit). */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { ROOT_BROWSER } from '../derivation.mjs'
import { admissible, sizesAdmissible, registry, expected, TOL } from './bench.mjs'
import { MATRIX, openIn } from './situations.mjs'
import { SETTINGS, inspect, judge, inspectContrast, inspectNumbers } from './neighbors.mjs'
import { MUTATIONS } from './fixtures/voisins/mutations.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(HERE, 'fixtures', 'voisins')
const CASES = { close: 'a · se fermer', balance: 'b · se solder', control: 'c · contrôle', separator: 'd · filet' }
const MARGE = 3 /* lignes : la marge minimale qu'une mutation doit prendre sur son seuil */

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const target = args.find((a) => !a.startsWith('--') && a !== opt('--width'))
const WIDTH = parseInt(opt('--width', '1440'), 10)
const asJson = flag('--json')
const onlyProve = flag('--prove')

if (!target && !onlyProve) { console.error('usage : node kit/tests/verify.mjs <fichier.html | URL> [--width 1440] [--json] [--prove]'); process.exit(2) }
const toUrl = (t) => (/^https?:\/\//.test(t) ? t : pathToFileURL(path.resolve(t)).href)

const browser = await chromium.launch()
process.on('exit', () => browser.close())

/* ── Les quatre cas, sur une page ouverte ── */
async function neighbors(p) {
  const facts = await p.evaluate(inspect, SETTINGS)
  return { facts, verdict: judge(facts, SETTINGS) }
}

/* ── 1 · La preuve : les fixtures piégées passent, leurs mutations rougissent le cas visé ── */
async function prove() {
  const results = []
  for (const m of MUTATIONS) {
    const url = pathToFileURL(path.join(FIXTURES, m.file)).href
    const { p, close } = await openIn(browser, url, { name: 'preuve', w: WIDTH, h: 900 })
    if (m.css) await p.addStyleTag({ content: m.css })
    await p.waitForTimeout(30)
    const { verdict } = await neighbors(p)
    await close()
    const red = Object.keys(CASES).filter((k) => verdict[k].length > 0)
    const aimed = m.expect.length === 0 ? red.length === 0 : m.expect.every((k) => red.includes(k)) && red.every((k) => m.expect.includes(k))
    /* la marge d'une mutation : la plus courte des marges des fautes qu'elle vise */
    const margins = m.expect.flatMap((k) => verdict[k].map((f) => f.marginLines)).filter((x) => Number.isFinite(x))
    const margin = margins.length ? Math.min(...margins) : null
    const thin = aimed && m.expect.length > 0 && margin !== null && margin < MARGE
    results.push({ file: m.file, mutation: m.name, expect: m.expect, red, margin, thin, ok: aimed && !thin, detail: red.map((k) => verdict[k].map((f) => f.detail).join(' ; ')).join(' | ') })
  }
  return results
}

/* ── 2 · Le fichier, à la largeur de référence ── */
async function judgeFile(url) {
  const s = { name: `référence · ${WIDTH}`, w: WIDTH, h: 900 }
  const { p, errors, close } = await openIn(browser, url, s)
  const { facts, verdict } = await neighbors(p)
  const contrast = await p.evaluate(inspectContrast)
  const r = registry()
  const spaces = admissible(WIDTH)
  const radii = Object.keys(r).filter((n) => /^r-/.test(n)).map((n) => expected(n, WIDTH))
  const numbers = await p.evaluate(inspectNumbers, { spaces, sizes: sizesAdmissible(WIDTH), radii, tolerated: [0, 1, 2], tol: TOL })
  await close()
  const resources = errors.filter((e) => /Failed to load resource/.test(e))
  return { facts, verdict, contrast, numbers, errors: errors.filter((e) => !resources.includes(e)), resources }
}

/* ── 3 · Les débords, treize fois ── */
async function overflows(url) {
  const out = []
  for (const s of MATRIX) {
    const { p, close } = await openIn(browser, url, s)
    const px = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth))
    await close()
    out.push({ situation: s.name, w: s.w, h: s.h, overflow: px })
  }
  return out
}

/* ── Le rapport ── */
const G = '🟢', R = '🔴'
function report({ proof, file, over, url }) {
  const lines = []
  const proofOk = proof.every((x) => x.ok)
  lines.push(`Épreuve — ${url}`)
  lines.push(`Largeur de référence : ${WIDTH} px · seuil ${SETTINGS.ratio} · tolérance ${SETTINGS.lines} ligne (réglages ⚪)`)
  lines.push('')
  lines.push(`${proofOk ? G : R} Preuve de la capacité à échouer : ${proof.filter((x) => x.ok).length}/${proof.length} — ${proof.filter((x) => x.ok).length === proof.length ? `chaque mutation rougit le cas qu'elle vise d'au moins ${MARGE} lignes, chaque fixture piégée passe` : 'REFUS DE STATUER'}`)
  for (const x of proof) {
    if (x.ok) continue
    if (x.thin) lines.push(`   ${R} ${x.file} · ${x.mutation} : rougit bien ${x.red.join(',')}, mais de ${x.margin.toFixed(1)} ligne(s) seulement (il en faut ${MARGE}) — cette mutation dit la police de la machine, pas la loi`)
    else lines.push(`   ${R} ${x.file} · ${x.mutation} : attendu ${x.expect.join(',') || 'vert'}, obtenu ${x.red.join(',') || 'vert'}${x.detail ? ' — ' + x.detail : ''}`)
  }
  const thinnest = proof.filter((x) => x.margin !== null && x.margin !== undefined)
  if (proofOk && thinnest.length) lines.push(`   marge la plus courte : ${Math.min(...thinnest.map((x) => x.margin)).toFixed(1)} lignes`)
  if (!proofOk || !file) return { text: lines.join('\n'), red: !proofOk, refused: !proofOk }
  lines.push('')
  const v = file.verdict, c = v.counts
  let red = false
  const say = (k, n, what) => { const f = v[k]; const bad = f.length > 0; red ||= bad; lines.push(`${bad ? R : G} ${CASES[k]} — ${n} ${what}${bad ? `, ${f.length} en faute` : ''}`); for (const x of f.slice(0, 12)) lines.push(`   · ${x.where} — ${x.detail}`); if (f.length > 12) lines.push(`   … et ${f.length - 12} de plus`) }
  say('close', c.rowsElastic, 'rangée(s) à élément élastique')
  say('balance', c.rowsPlain, 'rangée(s) sans élément élastique')
  say('control', c.controls, 'contrôle(s)')
  say('separator', c.separators, 'filet(s)')
  const nb = file.numbers, nbBad = nb.off > 0
  red ||= nbBad
  lines.push(`${nbBad ? R : G} pas de nombre — ${nb.checked} valeurs lues, ${nb.off} hors chaîne`)
  for (const f of nb.faults.slice(0, 10)) lines.push(`   · ${f}`)
  if (nb.faults.length > 10) lines.push(`   … et ${nb.off - 10} de plus`)
  const ct = file.contrast, ctBad = ct.faults.length > 0
  red ||= ctBad
  lines.push(`${ctBad ? R : G} contraste — ${ct.checked} textes mesurés${ct.undecidable ? `, ${ct.undecidable} sur image (non jugés)` : ''}${ctBad ? `, ${ct.faults.length} sous le seuil` : ''}`)
  for (const f of ct.faults.slice(0, 10)) lines.push(`   · ${f.where} ${f.ratio}:1 (il faut ${f.need}) « ${f.text} »`)
  if (ct.faults.length > 10) lines.push(`   … et ${ct.faults.length - 10} de plus`)
  const ovBad = over.filter((o) => o.overflow > 0)
  red ||= ovBad.length > 0
  lines.push(`${ovBad.length ? R : G} débords — ${over.length} situations${ovBad.length ? `, ${ovBad.length} qui débordent` : ', zéro débord'}`)
  for (const o of ovBad) lines.push(`   · ${o.situation} (${o.w} × ${o.h}) : ${o.overflow} px`)
  if (file.errors.length) { lines.push(`${R} erreurs de page — ${file.errors.length}`); for (const e of file.errors.slice(0, 5)) lines.push(`   · ${e.slice(0, 160)}`) ; red = true }
  if (file.resources.length) lines.push(`ℹ ${file.resources.length} ressource(s) non chargée(s) (polices, images distantes) — le rendu mesuré est celui de repli`)
  lines.push('')
  lines.push(red ? `${R} Le fichier ne passe pas.` : `${G} Le fichier passe.`)
  return { text: lines.join('\n'), red, refused: false }
}

try {
  const proof = await prove()
  const proofOk = proof.every((x) => x.ok)
  let file = null, over = []
  if (!onlyProve && proofOk) {
    const url = toUrl(target)
    file = await judgeFile(url)
    over = await overflows(url)
  }
  const out = report({ proof, file, over, url: onlyProve ? '(preuve seule)' : toUrl(target) })
  if (asJson) console.log(JSON.stringify({ proof, file: file && { verdict: file.verdict, contrast: file.contrast, numbers: { ...file.numbers, faults: file.numbers.faults.slice(0, 50) }, errors: file.errors }, over }, null, 1))
  else console.log(out.text)
  await browser.close()
  process.exit(out.refused ? 2 : out.red ? 1 : 0)
} catch (e) {
  console.error(`refus de statuer — ${e.message}`)
  await browser.close()
  process.exit(2)
}
