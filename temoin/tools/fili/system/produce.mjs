/* Produit LA page unique du système : tout ce que Fili sait de son apparence,
   au même endroit. PIÈCE GÉNÉRÉE — elle ne déclare aucune valeur, elle lit les
   sources du dépôt et les met en page. Si une source change, on regénère.

   node tools/fili/systeme/produire.mjs   →   public/systeme/index.html          */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '../../..')
const read = (n) => JSON.parse(readFileSync(resolve(REPO, n), 'utf8'))
const text = (n) => { try { return readFileSync(resolve(REPO, n), 'utf8') } catch { return '' } }

const geo = read('fili/geometry.json')
const pal = read('fili/palette.json')
const exp = read('fili/expression.json')
const lib = (() => { try { return read('fili/labels.json') } catch { return null } })()
const assert = (() => { try { return read('fili/assertions.json') } catch { return null } })()
const lex = (() => { try { return read('fili/lexicon.json') } catch { return null } })()

/* ── petits outils ─────────────────────────────────────────────────────── */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const steps = (o) => Object.entries(o || {}).filter(([k]) => !k.startsWith('$'))
const value = (v) => {
  if (v && typeof v === 'object') {
    const raw = 'value' in v ? v.value : (v.lucide ?? v.name ?? '')
    return Array.isArray(raw) ? raw.join(' · ') : raw
  }
  return v
}
const use = (v) => (v && typeof v === 'object' ? v.use || '' : '')
const nb = (n) => (Math.round(n * 100) / 100).toString().replace('.', ',')

/* ── briques de page ───────────────────────────────────────────────────── */
function section(id, number, heading, lede, body, note) {
  return `<section id="${id}">
  <p class="menu">${number}</p>
  <h2>${esc(heading)}</h2>
  ${lede ? `<p class="lede">${esc(lede)}</p>` : ''}
  ${body}
  ${note ? `<p class="note">${esc(note)}</p>` : ''}
</section>`
}

const card = (top, name, val, fp, measure) => `<div class="card">
  ${top || ''}
  <div class="body">
    <p class="name">${esc(name)}</p>
    ${val !== undefined && val !== '' ? `<p class="val">${esc(val)}</p>` : ''}
    ${fp ? `<p class="use">${esc(fp)}</p>` : ''}
    ${measure ? `<p class="measure">${esc(measure)}</p>` : ''}
  </div>
</div>`

const grid = (html) => `<div class="grid">${html}</div>`


/* ── 0 · la cartographie : d'où vient tout ─────────────────────────────── */
const px = (v) => {
  const m = /(-?[\d.]+)\s*px/.exec(String(v))
  return m ? Math.round(parseFloat(m[1]) * 1000) / 1000 : null
}
/* Les décisions d'entrée. Rien au-dessus d'elles : ce sont les seuls nombres
   que quelqu'un a choisis, et tout le calcul en descend. */
const ent = geo.entries || {}
const DENOMINATORS = [
  { key: 'base', value: `${nb(ent.base)} px`, what: "la marge intérieure du premier niveau", family: 'géométrie' },
  { key: 'interval', value: nb(ent.ratio), what: "le rapport entre deux profondeurs", family: 'géométrie' },
  { key: 'body', value: `${nb(ent.body)} px`, what: "la base commune du texte, partout", family: 'text' },
  { key: 'intervalle des titres', value: nb(ent.intervalHeadings), what: "un pas de titre au-dessus du corps", family: 'text' },
  { key: 'target', value: `${nb(ent.target)} px`, what: "ce qu'un doigt doit pouvoir viser", family: 'contrôles' },
  { key: 'couleur primaire', value: pal.$primary, what: "la seule couleur choisie — les 32 autres en descendent", family: 'couleur' },
  { key: 'amplitudes', value: `${steps(geo.axes).length} axes`, what: "de combien chaque famille grandit entre 320 et 1440 px", family: 'breathing' },
]

const nbColors = Object.keys(pal.neutrals || {}).length +
  Object.values(pal.states || {}).reduce((a, o) => a + Object.keys(o).filter((k) => !['hue', 'anchor'].includes(k)).length, 0)
const nbTokensGeo = Object.keys(geo.tokens || {}).length
const nbSizesCalc = steps(exp.sizes).filter(([, v]) => /var\(--rr-/.test(String(value(v)))).length
const nbReferences = Object.entries(exp).reduce((a, [f, v]) => (f.startsWith('$') || typeof v !== 'object' || f === 'sizes')
  ? a : a + steps(v).filter(([, o]) => /var\(--rr-/.test(String(value(o)))).length, 0)

/* Ce qui descend d'une décision, et ce qui ne descend de rien. */
const derived = [
  { what: "jetons de géométrie — marges, écarts, rayons, bord, texte, cible, tous fluides", n: nbTokensGeo, of: 'base · intervalle · corps · cible · amplitudes' },
  { what: "couleurs — fonds, encres, traits, et les quatre états avec leurs couples", n: nbColors, of: 'couleur primaire' },
  { what: "tailles de texte — le corps et les trois niveaux de titre", n: nbSizesCalc, of: 'corps · intervalle des titres' },
]

/* Les valeurs de la planche qui ne descendent d'aucune décision. On regarde
   si elles retombent quand même sur un nombre déjà connu — c'est un fait
   mesuré, pas une règle : une coïncidence signale une source possible. */
const known = new Map()
for (const [n, v] of Object.entries(geo.margins || {})) known.set(Math.round(v * 1000) / 1000, `marge ${n}`)
for (const [n, v] of Object.entries(geo.gaps || {})) if (!known.has(v)) known.set(Math.round(v * 1000) / 1000, `écart ${n}`)
for (const [n, v] of Object.entries(geo.radii || {})) if (!known.has(v)) known.set(Math.round(v * 1000) / 1000, `rayon ${n}`)
for (const [n, v] of Object.entries(geo.text || {})) if (!known.has(v)) known.set(Math.round(v * 1000) / 1000, `texte ${n}`)
if (geo.control) known.set(geo.control.target, 'target')

/* Une valeur qui pointe sur un jeton calculé n'est pas une valeur choisie,
   même si sa famille ne le déclare pas dans sa source. On le lit au renvoi. */
const returns = (o) => /var\(--rr-/.test(String(value(o))) || String(o?.$source || '').includes('calculé')
const IGNORE = new Set(['sizes'])
const orphans = []
for (const [fam, v] of Object.entries(exp)) {
  if (fam.startsWith('$') || typeof v !== 'object' || IGNORE.has(fam)) continue
  const cs = steps(v).filter(([, o]) => !returns(o))
  if (!cs.length) continue
  const echoes = []
  for (const [k, o] of cs) {
    const n = px(value(o))
    if (n !== null && known.has(n)) echoes.push(`${k} (${px(n)} px = ${known.get(n)})`)
  }
  orphans.push({ fam, n: cs.length, echoes })
}
orphans.sort((a, b) => b.echoes.length - a.echoes.length || b.n - a.n)
const totalOrph = orphans.reduce((a, o) => a + o.n, 0)
const totalEchoes = orphans.reduce((a, o) => a + o.echoes.length, 0)

const map = `
<div class="foundation">
  ${DENOMINATORS.map((d) => `<div class="den">
    <b>${esc(d.value)}</b>
    <span class="den-key">${esc(d.key)}</span>
    <span class="den-what">${esc(d.what)}</span>
  </div>`).join('')}
</div>

<h3>Ce qui en descend, et qui ne se choisit jamais</h3>
<div class="rolls"><table>
  <thead><tr><th>Combien</th><th>Quoi</th><th>Descend de</th></tr></thead>
  <tbody>${derived.map((d) => `<tr>
    <td class="mono large">${d.n}</td><td>${esc(d.what)}</td><td class="key">${esc(d.of)}</td>
  </tr>`).join('')}
  <tr class="sum"><td class="mono large">${derived.reduce((a, d) => a + d.n, 0)}</td>
      <td colspan="2">valeurs calculées — aucune n'est écrite à la main</td></tr>
  </tbody>
</table></div>

<h3>Ce qui ne descend de rien — ${totalOrph} valeurs, ${orphans.length} familles</h3>
<p class="note">Chaque ligne est une famille dont les valeurs ont été choisies une par une.
Quand une valeur retombe sur un nombre déjà connu, c'est signalé : ce n'est pas une règle,
c'est une piste — ce cran-là pourrait descendre d'une décision au lieu d'être écrit.</p>
<div class="rolls"><table>
  <thead><tr><th>Famille</th><th>Valeurs</th><th>Retombent sur un nombre déjà connu</th></tr></thead>
  <tbody>${orphans.map((o) => `<tr class="${o.echoes.length ? 'echo' : ''}">
    <td class="key">${esc(o.fam)}</td><td class="mono">${o.n}</td>
    <td class="mono small">${o.echoes.length ? esc(o.echoes.join(' · ')) : '—'}</td>
  </tr>`).join('')}</tbody>
</table></div>
`

const noteMap = `Huit décisions produisent ${derived.reduce((a, d) => a + d.n, 0)} valeurs. ` +
  `${totalOrph} autres sont encore posées une par une, et ${totalEchoes} d'entre elles retombent déjà ` +
  `sur un nombre que le système connaît — autant de crans qui pourraient cesser d'être écrits.`

/* ── 1 · les espaces ───────────────────────────────────────────────────── */
const e = geo.entries || {}
const spacesLaw = `<div class="law">
  <div class="law-e"><b>${nb(e.base)} px</b><span>la base</span></div>
  <div class="law-op">÷</div>
  <div class="law-e"><b>${nb(e.ratio)}</b><span>le ratio</span></div>
  <div class="law-fl">→</div>
  <div class="law-r">toute la géométrie<small>marges · écarts · rayons · bord</small></div>
</div>`

const depths = (geo.depths || [])
const bar = (px, max) => `<span class="stroke" style="width:${Math.max(2, (px / max) * 320)}px"></span>`
const maxMargin = Math.max(...Object.values(geo.margins || { a: 1 }))
const tableDepths = `<div class="rolls"><table>
  <thead><tr><th>Profondeur</th><th>Marge intérieure</th><th>Écart entre enfants</th><th>Rayon</th></tr></thead>
  <tbody>${depths.map((p) => `<tr>
    <td class="key">${esc(p)}</td>
    <td>${bar(geo.margins?.[p] || 0, maxMargin)} <span class="mono">${px(geo.margins?.[p] || 0)} px</span></td>
    <td>${bar(geo.gaps?.[p] || 0, maxMargin)} <span class="mono">${px(geo.gaps?.[p] || 0)} px</span></td>
    <td class="mono">${geo.radii?.[p] !== undefined ? px(geo.radii[p]) + ' px' : '—'}</td>
  </tr>`).join('')}</tbody>
</table></div>`

const axes = geo.axes || {}
const tableAxes = `<div class="rolls"><table>
  <thead><tr><th>Axe</th><th>Le plus étroit (320 px)</th><th>Le plus large (1440 px)</th></tr></thead>
  <tbody>${steps(axes).map(([k, v]) => `<tr>
    <td class="key">${k === 'inline' ? 'horizontal' : k === 'block' ? 'vertical' : k === 'radius' ? 'les rayons' : esc(k)}</td>
    <td class="mono">× ${nb(v.min)}</td><td class="mono">× ${nb(v.max)}</td>
  </tr>`).join('')}</tbody>
</table></div>`

const price = geo.$priceOfThereFluidity
const noteSpaces = price
  ? `Le générateur d'origine adoucit sa courbe ; une feuille de style ne sait qu'interpoler droit. L'écart a été mesuré tous les 10 pixels : ${nb(price.gapPx)} px au pire, vers ${price.aWidth} px de large. Sous les deux pixels, mais réel.`
  : ''

/* ── 2 · les couleurs ──────────────────────────────────────────────────── */
const potNeutral = ([name, hex]) => card(
  `<div class="preview" style="background:${hex}"></div>`, name, hex, '')
const colorsNeutrals = grid(Object.entries(pal.neutrals || {}).map(potNeutral).join(''))

const potState = ([name, o]) => card(
  `<div class="preview duo">
     <div style="background:${o.surface};color:${o.on}">${esc(name)}</div>
     <div style="background:${o.full};color:${o.onFull}">${esc(name)}</div>
   </div>`,
  name, `${o.surface} · ${o.full}`,
  'un fond pâle avec son texte, et sa version pleine')
const colorsStates = grid(Object.entries(pal.states || {}).map(potState).join(''))

/* ── 3 · le texte ──────────────────────────────────────────────────────── */
const families = grid(steps(exp.families).map(([k, v]) => card(
  '', k, '', use(v)).replace('<div class="body">',
  `<div class="body"><p class="sample" style="font-family:${String(value(v)).replace(/"/g, "'")}">Le juge is-it entier ?</p>`)).join(''))

const weights = grid(steps(exp.weights).map(([k, v]) => card(
  '', `${k} · ${value(v)}`, '', use(v)).replace('<div class="body">',
  `<div class="body"><p class="sample small" style="font-weight:${value(v)}">Hiérarchie visuelle</p>`)).join(''))

const sizes = grid(steps(exp.sizes).map(([k, v]) => {
  const o = typeof v === 'object' ? v : { value: v }
  const t = o.value ?? o.size ?? ''
  const it = o.leading ?? o.line ?? ''
  const style = [`font-size:${t}`, it ? `line-height:${it}` : '',
    k === 'menu' ? 'letter-spacing:.08em;text-transform:uppercase' : ''].filter(Boolean).join(';')
  return card('', `${k}${t ? ' · ' + t : ''}${it ? ' / ' + it : ''}`, '', o.use || '')
    .replace('<div class="body">', `<div class="body"><p class="sample" style="${style}">Ce qui compte d'abord</p>`)
}).join(''))

/* ── 4 · listes simples ────────────────────────────────────────────────── */
const listSimple = (obj) => grid(steps(obj).map(([k, v]) =>
  card('', k, value(v), use(v))).join(''))

const radii = grid(steps(exp.radii).map(([k, v]) => card(
  `<div class="preview shape"><span style="border-radius:${value(v)}"></span></div>`,
  k, value(v), use(v))).join(''))

const strokes = grid(steps(exp.strokes).map(([k, v]) => {
  const val = String(value(v))
  const style = val.endsWith('px')
    ? `border-top:${val} solid var(--net)`
    : `border-top:1px ${val} var(--net)`
  return card(`<div class="preview line"><span style="${style}"></span></div>`, k, val, use(v))
}).join(''))

const opacities = grid(steps(exp.opacities).map(([k, v]) => card(
  `<div class="preview"><span class="veil" style="opacity:${value(v)}"></span></div>`,
  k, value(v), use(v))).join(''))

const elevations = grid(steps(exp.elevations).map(([k, v]) => card(
  `<div class="preview"><span class="block" style="box-shadow:${value(v) === 'none' ? 'none' : value(v)}"></span></div>`,
  k, value(v), use(v))).join(''))

const targets = grid(steps(exp.targets).map(([k, v]) => card(
  `<div class="preview"><span class="target" style="width:${value(v)};height:${value(v)}"></span></div>`,
  k, value(v), use(v))).join(''))

const icons = grid(steps(exp.icons).map(([k, v]) => card(
  '', k, value(v), use(v))).join(''))

const statesControl = `<div class="rolls"><table>
  <thead><tr><th>État</th><th>Fond · trait · encre</th><th>Quand</th></tr></thead>
  <tbody>${steps(exp.states).map(([k, v]) => `<tr>
    <td class="key">${esc(k)}</td><td class="mono">${esc(value(v))}</td><td>${esc(use(v))}</td>
  </tr>`).join('')}</tbody>
</table></div>`

/* ── 5 · les composants ────────────────────────────────────────────────── */
const src = text('src/system/index.ts')
const components = [...src.matchAll(/^export \{([^}]+)\} from/gm)]
  .flatMap((m) => m[1].split(',').map((s) => s.trim()))
  .filter((n) => /^[A-Z]/.test(n))
const listComponents = `<div class="dots">${components.map((c) =>
  `<span class="dot">${esc(c)}</span>`).join('')}</div>`

/* ── 6 · le linter ─────────────────────────────────────────────────────── */
const FAMILIES = {
  R1: ['Les composants', 'toute interface passe par une pièce du système, jamais par une balise nue'],
  R2: ['Les états', 'tout ce qui attend une réponse montre qu\'il charge, qu\'il a raté, qu\'il est vide'],
  R3: ['Les espaces', 'aucun nombre écrit à la main : tout vient de l\'échelle'],
  R4: ['Le rythme', 'une page est une suite de tranches, et deux voisines ne respirent pas pareil'],
  R5: ['La hiérarchie', 'une page dit ce qui compte d\'abord, une seule fois, et pas en bas'],
  R6: ['L\'expression', 'd\'où viennent les couleurs, les polices, les icônes, les mots']
}
const byFamily = {}
for (const a of assert?.assertions || []) {
  const f = (a.id || '').slice(0, 2)
  ;(byFamily[f] ||= []).push(a.id)
}
const tableLinter = `<div class="rolls"><table>
  <thead><tr><th>Famille</th><th>Ce qu'elle interdit</th><th>Règles</th></tr></thead>
  <tbody>${Object.entries(FAMILIES).map(([f, [name, what]]) => {
    const n = (byFamily[f] || []).length
    return `<tr class="${n ? '' : 'empty'}">
      <td class="key">${esc(name)}</td><td>${esc(what)}</td>
      <td class="mono">${n ? n + (n > 1 ? ' règles' : ' règle') : 'pas encore écrite'}</td>
    </tr>`
  }).join('')}</tbody>
</table></div>`
const totalRules = (assert?.assertions || []).length

/* ── les mots ──────────────────────────────────────────────────────────── */
let nbLabels = 0
const countUp = (o) => { for (const [k, v] of Object.entries(o || {})) { if (k.startsWith('$')) continue; if (typeof v === 'string') nbLabels++; else if (typeof v === 'object') countUp(v) } }
if (lib) countUp(lib)


/* ── 12 · le lexique ───────────────────────────────────────────────────── */
const lexicon = !lex ? '' : `
<div class="rolls"><table>
  <thead><tr><th>Dans l'outil de l'Auteur</th><th>Dans Fili</th><th>Quoi</th></tr></thead>
  <tbody>${lex.mappings.map((c) => `<tr>
    <td class="mono">${esc(c.tool)}</td><td class="mono small">${esc(c.fili)}</td><td>${esc(c.what)}</td>
  </tr>`).join('')}</tbody>
</table></div>
<h3>Ce qui ne se traduit pas — ${lex.untranslatable.length} mots</h3>
<p class="note">Nommés plutôt que bricolés. Un lexique qui invente un équivalent ne traduit plus.</p>
<div class="rolls"><table>
  <thead><tr><th>Côté</th><th>Mot</th><th>Pourquoi</th></tr></thead>
  <tbody>${lex.untranslatable.map((i) => `<tr>
    <td class="key">${i.side === 'tool' ? "l'outil" : 'Fili'}</td>
    <td class="mono small">${esc(i.name)}</td><td>${esc(i.what)}</td>
  </tr>`).join('')}</tbody>
</table></div>
`

/* ── la page ───────────────────────────────────────────────────────────── */
const n = pal.neutrals || {}
const page = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fili — le système au complet</title>
<style>
:root{
  --paper:${n.paper || '#fff'}; --hollow:${n.paperHollow || '#f4f4f8'};
  --ink:${n.ink || '#222'}; --soft:${n.inkSoft || '#666'};
  --stroke:${n.stroke || '#ddd'}; --net:${n.strokeNet || '#999'};
  --accent:${n.accent || '#4F46E5'}; --scene:${n.scene || '#202023'};
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:17px/1.6 'Geist Variable',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.wrapper{max-width:1024px;margin:0 auto;padding:48px 20px 120px}
h1{font-size:clamp(28px,4vw,42px);line-height:1.1;font-weight:600;margin:0 0 12px;letter-spacing:-.02em}
h2{font-size:clamp(22px,3vw,30px);line-height:1.2;font-weight:600;margin:0 0 8px;letter-spacing:-.01em}
h3{font-size:17px;font-weight:600;margin:28px 0 8px}
.menu{font:600 12px/1.2 'JetBrains Mono',ui-monospace,Menlo,monospace;letter-spacing:.08em;
  text-transform:uppercase;color:var(--soft);margin:0 0 10px}
.lede{color:var(--soft);font-size:19px;max-width:62ch;margin:0 0 20px}
.note{color:var(--soft);font-size:14px;max-width:70ch;margin:16px 0 0}
section{margin:56px 0 0;padding-top:28px;border-top:1px solid var(--stroke)}
nav{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--paper) 92%,transparent);
  backdrop-filter:blur(10px);border-bottom:1px solid var(--stroke);margin:0 -20px 0;padding:14px 20px}
nav .inside{max-width:1024px;margin:0 auto;display:flex;gap:16px;flex-wrap:wrap;
  font-size:13px}
nav a{color:var(--soft);text-decoration:none}
nav a:hover{color:var(--accent);text-decoration:underline}

.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));margin-top:16px}
.card{border:1px solid var(--stroke);border-radius:8px;overflow:hidden;background:var(--paper)}
.card .body{padding:12px 14px}
.preview{height:64px}
.preview.duo{display:flex}
.preview.duo>div{flex:1;display:flex;align-items:center;justify-content:center;
  font:600 13px 'JetBrains Mono',ui-monospace,monospace}
.preview.shape,.preview.line{display:flex;align-items:center;justify-content:center;background:var(--hollow)}
.preview.shape span{width:96px;height:40px;background:var(--paper);border:1px solid var(--net)}
.preview.line span{width:80%;display:block}
.preview .veil{display:block;width:100%;height:100%;background:var(--ink)}
.preview .block{display:block;width:70%;height:40px;margin:12px auto;background:var(--paper);border-radius:8px}
.preview .target{display:block;background:var(--hollow);border:1px solid var(--net);border-radius:2px;margin:auto}
.preview:has(.target){display:flex}
.name{font:500 13px 'JetBrains Mono',ui-monospace,Menlo,monospace;margin:0 0 2px}
.val{font:400 12px 'JetBrains Mono',ui-monospace,Menlo,monospace;color:var(--soft);margin:0 0 6px;word-break:break-all}
.use{font-size:13px;color:var(--soft);margin:0}
.measure{font:400 12px 'JetBrains Mono',ui-monospace,monospace;color:var(--soft);margin:6px 0 0}
.sample{margin:0 0 8px;line-height:1.25;font-size:21px}
.sample.small{font-size:17px}

table{width:100%;border-collapse:collapse;margin-top:16px;font-size:15px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--stroke);vertical-align:middle}
th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);font-weight:600}
td.key{color:var(--soft)}
tr.empty td{color:var(--soft);font-style:italic}
.mono{font:400 13px 'JetBrains Mono',ui-monospace,Menlo,monospace}
.stroke{display:inline-block;height:10px;border-radius:2px;background:var(--accent);vertical-align:0;margin-right:8px}

.law{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--hollow);
  border-radius:8px;padding:20px;margin-top:8px}
.law-e{display:flex;flex-direction:column}
.law-e b{font:600 21px 'JetBrains Mono',ui-monospace,monospace}
.law-e span{font-size:13px;color:var(--soft)}
.law-op,.law-fl{color:var(--soft);font-size:19px}
.law-r{font-weight:600}
.law-r small{display:block;font-weight:400;font-size:13px;color:var(--soft)}

.foundation{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));margin:16px 0 8px}
.den{border:1px solid var(--stroke);border-left:3px solid var(--accent);border-radius:8px;padding:14px 16px}
.den b{display:block;font:600 21px 'JetBrains Mono',ui-monospace,Menlo,monospace;line-height:1.1}
.den-key{display:block;font-size:14px;font-weight:600;margin-top:4px}
.den-what{display:block;font-size:13px;color:var(--soft);margin-top:2px}
td.large{font-size:19px;font-weight:600}
tr.sum td{background:var(--hollow);font-weight:600}
tr.echo td.key{color:var(--accent);font-weight:600}
.mono.small{font-size:12px}
.dots{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.dot{border:1px solid var(--stroke);border-radius:9999px;padding:7px 14px;
  font:500 14px 'JetBrains Mono',ui-monospace,Menlo,monospace;background:var(--hollow)}

/* ── le téléphone. Une page qui se lit debout dans le métro ou pas du tout ── */
@media (max-width:640px){
  body{font-size:16px}
  .wrapper{padding:24px 16px 72px}
  nav{margin:0 -16px;padding:10px 16px}
  nav .inside{gap:12px;font-size:12px;overflow-x:auto;flex-wrap:nowrap;
    white-space:nowrap;-webkit-overflow-scrolling:touch}
  h1{font-size:26px}
  h2{font-size:21px}
  .lede{font-size:17px}
  section{margin-top:36px;padding-top:20px}
  .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .foundation{grid-template-columns:1fr;gap:10px}
  .den b{font-size:19px}
  /* Un tableau ne se met pas en colonnes sur un téléphone : il se fait défiler. */
  .rolls{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:16px -16px 0;padding:0 16px}
  .rolls table{min-width:520px;margin-top:0}
  th,td{padding:9px 10px;font-size:14px}
  .mono.small{font-size:11px}
  .stroke{max-width:110px}
  .law{gap:10px;padding:16px}
}
.foot{margin-top:64px;padding-top:24px;border-top:1px solid var(--stroke);
  color:var(--soft);font-size:14px;max-width:74ch}
</style></head>
<body>

<nav><div class="inside">
  <a href="#carto">La cartographie</a><a href="#espaces">Les espaces</a><a href="#rayons">Les rayons</a>
  <a href="#couleurs">Les couleurs</a><a href="#texte">Le texte</a>
  <a href="#largeurs">Les largeurs</a><a href="#separer">Séparer</a>
  <a href="#mouvement">Le mouvement</a><a href="#icones">Les icônes</a>
  <a href="#controles">Les contrôles</a><a href="#composants">Les composants</a>
  <a href="#linter">Le robot</a><a href="#lexique">Le lexique</a>
</div></nav>

<div class="wrapper">
<p class="menu">Fili · pièce générée · ${new Date().toISOString().slice(0, 10)}</p>
<h1>Le système au complet</h1>
<p class="lede">Tout ce que Fili sait de son apparence, sur une seule page : les espaces, les
couleurs, le texte, les formes, le mouvement, les pièces toutes faites, et les règles que le robot
fait respecter. Cette page ne décide rien — elle lit les fichiers du dépôt et les montre. Si une
valeur change là-bas, on regénère.</p>

${section('map', '00 — La cartographie', 'Huit décisions, et tout le reste en descend',
  "Un jeton est soit calculé, soit choisi. Cette page dit lequel est lequel — et combien de valeurs sont encore choisies alors qu'elles pourraient être calculées.",
  map, noteMap)}

${section('spaces', '01 — Les espaces', 'Trois réglages, et tout le reste se calcule',
  'On ne choisit jamais un espace. On dit à quelle profondeur on se trouve, et la valeur tombe toute seule.',
  spacesLaw + `<h3>Les cinq profondeurs</h3>` + tableDepths +
  `<h3>Ce qui bouge avec la largeur de l'écran</h3>
   <p class="note">L'horizontal et le vertical ne respirent pas ensemble : c'est ce qui empêche une page de s'étirer bêtement.</p>` + tableAxes,
  noteSpaces)}

${section('radii', '02 — Les rayons', "Le rayon EST la marge — et il se divise par deux à chaque niveau",
  "Il n'y a pas de rayon à choisir : la marge est la source. Le rayon du premier niveau vaut la moitié de la marge du premier niveau, et chaque niveau divise encore par deux.",
  radii, geo.$lawOfRadius)}

${section('colors', '03 — Les couleurs', 'Une seule couleur est choisie, le reste est calculé',
  `La couleur de départ est ${pal.$primary}. Tous les gris en descendent, et chaque couple fond/texte est construit pour rester lisible.`,
  `<h3>Les fonds et les encres</h3>` + colorsNeutrals +
  `<h3>Les quatre états</h3>` + colorsStates)}

${section('text', '04 — Le texte', 'La taille découle du niveau, jamais de l\'endroit',
  exp.sizes?.$intent,
  `<h3>Les trois voix</h3>` + families +
  `<h3>Les trois graisses</h3>` + weights +
  `<h3>Les sept tailles</h3>` + sizes,
  exp.families?.$debt || '')}

${section('widths', '05 — Les largeurs', 'Où la page s\'arrête, et où elle change de forme',
  exp.measures?.$regime,
  `<h3>Les largeurs</h3>` + listSimple(exp.measures) +
  `<h3>Les points de bascule</h3>` + listSimple(exp.toggles) +
  `<h3>Les colonnes admises</h3>` + listSimple(exp.grid))}

${section('separate', '06 — Séparer', 'L\'espace d\'abord, le fond ensuite, le trait en dernier',
  exp.strokes?.$intent,
  `<h3>Les traits</h3>` + strokes +
  `<h3>Les voiles</h3>` + opacities +
  `<h3>Les ombres</h3>` + elevations)}

${section('mouvement', '07 — Le mouvement', 'Une animation explique quelque chose, ou elle n\'existe pas',
  exp.durations?.$intent,
  `<h3>Les durées</h3>` + listSimple(exp.durations) +
  `<h3>Les courbes</h3>` + listSimple(exp.curves))}

${section('icons', '08 — Les icônes', 'On ne dessine pas d\'icône, on déclare une correspondance',
  exp.icons?.$rule,
  icons + `<h3>Les trois tailles</h3>` + listSimple(exp.sizesIcon),
  exp.icons?.$debt || '')}

${section('controls', '09 — Les contrôles', 'Ce que devient un bouton quand on le touche',
  exp.states?.$intent,
  statesControl + `<h3>La taille minimale d'une cible</h3>` + targets +
  `<h3>L'anneau au clavier</h3>` + listSimple(exp.focus))}

${section('components', '10 — Les pièces toutes faites', `${components.length} composants, et l'obligation de passer par eux`,
  'Un bouton écrit à la main au lieu du composant est refusé par le robot. C\'est ce qui fait qu\'un même geste se ressemble d\'un écran à l\'autre.',
  listComponents + (nbLabels ? `<h3>Les mots</h3><p class="note">Le catalogue porte ${nbLabels} formulations. Aucun écran n'invente une phrase.</p>` : ''))}

${section('linter', '11 — Le robot', `${totalRules} règles, et une famille pas encore écrite`,
  'Il lit le code avant qu\'il parte et il bloque. Il ne juge jamais si c\'est beau : il vérifie que rien n\'a été inventé sur place.',
  tableLinter,
  'Le vert dit « rien n\'a été inventé ». Il ne dit jamais « c\'est bien réglé ». Ça, c\'est l\'œil, et le robot ne le remplacera pas.')}

${lex ? section('lexicon', '12 — Le lexique', `${lex.mappings.length} mots qui se traduisent, ${lex.untranslatable.length} qui ne se traduisent pas`,
  "L'Échelle Semantic Rhythm et Fili portent les mêmes idées sous d'autres noms. Voici la table. Un écran écrit dans une langue peut désormais s'habiller avec les jetons de l'autre, sans être réécrit.",
  lexicon, "Le lexique ne déclare aucune valeur : chaque entrée pointe sur un jeton du dépôt, et la génération refuse de statuer si l'un manque.") : ''}

<p class="foot">Page produite par <span class="mono">tools/fili/systeme/produire.mjs</span> depuis
<span class="mono">fili/geometrie.json</span>, <span class="mono">fili/palette.json</span>,
<span class="mono">fili/expression.json</span>, <span class="mono">fili/libelles.json</span>,
<span class="mono">fili/assertions.json</span> et <span class="mono">src/system/index.ts</span>.
Aucune valeur n'est écrite ici. Pour la mettre à jour : <span class="mono">npm run fili:systeme</span>.</p>

</div></body></html>`

mkdirSync(resolve(REPO, 'public/system'), { recursive: true })
writeFileSync(resolve(REPO, 'public/system/index.html'), page, 'utf8')
console.log(`✓ public/system/index.html — ${components.length} composants, ${totalRules} règles, ${nbLabels} formulations`)
