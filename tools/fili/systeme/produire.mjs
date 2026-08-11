/* Produit LA page unique du système : tout ce que Fili sait de son apparence,
   au même endroit. PIÈCE GÉNÉRÉE — elle ne déclare aucune valeur, elle lit les
   sources du dépôt et les met en page. Si une source change, on regénère.

   node tools/fili/systeme/produire.mjs   →   public/systeme/index.html          */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))
const DEPOT = resolve(ICI, '../../..')
const lire = (n) => JSON.parse(readFileSync(resolve(DEPOT, n), 'utf8'))
const texte = (n) => { try { return readFileSync(resolve(DEPOT, n), 'utf8') } catch { return '' } }

const geo = lire('fili/geometrie.json')
const pal = lire('fili/palette.json')
const exp = lire('fili/expression.json')
const lib = (() => { try { return lire('fili/libelles.json') } catch { return null } })()
const ass = (() => { try { return lire('fili/assertions.json') } catch { return null } })()
const lex = (() => { try { return lire('fili/lexique.json') } catch { return null } })()

/* ── petits outils ─────────────────────────────────────────────────────── */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const crans = (o) => Object.entries(o || {}).filter(([k]) => !k.startsWith('$'))
const valeur = (v) => {
  if (v && typeof v === 'object') {
    const brut = 'valeur' in v ? v.valeur : (v.lucide ?? v.nom ?? '')
    return Array.isArray(brut) ? brut.join(' · ') : brut
  }
  return v
}
const emploi = (v) => (v && typeof v === 'object' ? v.emploi || '' : '')
const nb = (n) => (Math.round(n * 100) / 100).toString().replace('.', ',')

/* ── briques de page ───────────────────────────────────────────────────── */
function section(id, numero, titre, chapeau, corps, note) {
  return `<section id="${id}">
  <p class="menu">${numero}</p>
  <h2>${esc(titre)}</h2>
  ${chapeau ? `<p class="chapeau">${esc(chapeau)}</p>` : ''}
  ${corps}
  ${note ? `<p class="note">${esc(note)}</p>` : ''}
</section>`
}

const carte = (haut, nom, val, emp, mesure) => `<div class="carte">
  ${haut || ''}
  <div class="corps">
    <p class="nom">${esc(nom)}</p>
    ${val !== undefined && val !== '' ? `<p class="val">${esc(val)}</p>` : ''}
    ${emp ? `<p class="emploi">${esc(emp)}</p>` : ''}
    ${mesure ? `<p class="mesure">${esc(mesure)}</p>` : ''}
  </div>
</div>`

const grille = (html) => `<div class="grille">${html}</div>`


/* ── 0 · la cartographie : d'où vient tout ─────────────────────────────── */
const px = (v) => {
  const m = /(-?[\d.]+)\s*px/.exec(String(v))
  return m ? Math.round(parseFloat(m[1]) * 1000) / 1000 : null
}
/* Les décisions d'entrée. Rien au-dessus d'elles : ce sont les seuls nombres
   que quelqu'un a choisis, et tout le calcul en descend. */
const ent = geo.entrees || {}
const DENOMINATEURS = [
  { cle: 'base', valeur: `${nb(ent.base)} px`, quoi: "la marge intérieure du premier niveau", famille: 'géométrie' },
  { cle: 'intervalle', valeur: nb(ent.ratio), quoi: "le rapport entre deux profondeurs", famille: 'géométrie' },
  { cle: 'corps', valeur: `${nb(ent.corps)} px`, quoi: "la base commune du texte, partout", famille: 'texte' },
  { cle: 'intervalle des titres', valeur: nb(ent.intervalleTitres), quoi: "un pas de titre au-dessus du corps", famille: 'texte' },
  { cle: 'cible', valeur: `${nb(ent.cible)} px`, quoi: "ce qu'un doigt doit pouvoir viser", famille: 'contrôles' },
  { cle: 'couleur primaire', valeur: pal.$primaire, quoi: "la seule couleur choisie — les 32 autres en descendent", famille: 'couleur' },
  { cle: 'amplitudes', valeur: `${crans(geo.axes).length} axes`, quoi: "de combien chaque famille grandit entre 320 et 1440 px", famille: 'respiration' },
]

const nbCouleurs = Object.keys(pal.neutres || {}).length +
  Object.values(pal.etats || {}).reduce((a, o) => a + Object.keys(o).filter((k) => !['teinte', 'ancre'].includes(k)).length, 0)
const nbJetonsGeo = Object.keys(geo.jetons || {}).length
const nbTaillesCalc = crans(exp.tailles).filter(([, v]) => /var\(--rr-/.test(String(valeur(v)))).length
const nbRenvois = Object.entries(exp).reduce((a, [f, v]) => (f.startsWith('$') || typeof v !== 'object' || f === 'tailles')
  ? a : a + crans(v).filter(([, o]) => /var\(--rr-/.test(String(valeur(o)))).length, 0)

/* Ce qui descend d'une décision, et ce qui ne descend de rien. */
const derives = [
  { quoi: "jetons de géométrie — marges, écarts, rayons, bord, texte, cible, tous fluides", n: nbJetonsGeo, de: 'base · intervalle · corps · cible · amplitudes' },
  { quoi: "couleurs — fonds, encres, traits, et les quatre états avec leurs couples", n: nbCouleurs, de: 'couleur primaire' },
  { quoi: "tailles de texte — le corps et les trois niveaux de titre", n: nbTaillesCalc, de: 'corps · intervalle des titres' },
]

/* Les valeurs de la planche qui ne descendent d'aucune décision. On regarde
   si elles retombent quand même sur un nombre déjà connu — c'est un fait
   mesuré, pas une règle : une coïncidence signale une source possible. */
const connus = new Map()
for (const [n, v] of Object.entries(geo.marges || {})) connus.set(Math.round(v * 1000) / 1000, `marge ${n}`)
for (const [n, v] of Object.entries(geo.ecarts || {})) if (!connus.has(v)) connus.set(Math.round(v * 1000) / 1000, `écart ${n}`)
for (const [n, v] of Object.entries(geo.rayons || {})) if (!connus.has(v)) connus.set(Math.round(v * 1000) / 1000, `rayon ${n}`)
for (const [n, v] of Object.entries(geo.texte || {})) if (!connus.has(v)) connus.set(Math.round(v * 1000) / 1000, `texte ${n}`)
if (geo.controle) connus.set(geo.controle.cible, 'cible')

/* Une valeur qui pointe sur un jeton calculé n'est pas une valeur choisie,
   même si sa famille ne le déclare pas dans sa source. On le lit au renvoi. */
const renvoie = (o) => /var\(--rr-/.test(String(valeur(o))) || String(o?.$source || '').includes('calculé')
const IGNORE = new Set(['tailles'])
const orphelines = []
for (const [fam, v] of Object.entries(exp)) {
  if (fam.startsWith('$') || typeof v !== 'object' || IGNORE.has(fam)) continue
  const cs = crans(v).filter(([, o]) => !renvoie(o))
  if (!cs.length) continue
  const echos = []
  for (const [k, o] of cs) {
    const n = px(valeur(o))
    if (n !== null && connus.has(n)) echos.push(`${k} (${nb(n)} px = ${connus.get(n)})`)
  }
  orphelines.push({ fam, n: cs.length, echos })
}
orphelines.sort((a, b) => b.echos.length - a.echos.length || b.n - a.n)
const totalOrph = orphelines.reduce((a, o) => a + o.n, 0)
const totalEchos = orphelines.reduce((a, o) => a + o.echos.length, 0)

const carto = `
<div class="socle">
  ${DENOMINATEURS.map((d) => `<div class="den">
    <b>${esc(d.valeur)}</b>
    <span class="den-cle">${esc(d.cle)}</span>
    <span class="den-quoi">${esc(d.quoi)}</span>
  </div>`).join('')}
</div>

<h3>Ce qui en descend, et qui ne se choisit jamais</h3>
<div class="roule"><table>
  <thead><tr><th>Combien</th><th>Quoi</th><th>Descend de</th></tr></thead>
  <tbody>${derives.map((d) => `<tr>
    <td class="mono grand">${d.n}</td><td>${esc(d.quoi)}</td><td class="cle">${esc(d.de)}</td>
  </tr>`).join('')}
  <tr class="somme"><td class="mono grand">${derives.reduce((a, d) => a + d.n, 0)}</td>
      <td colspan="2">valeurs calculées — aucune n'est écrite à la main</td></tr>
  </tbody>
</table></div>

<h3>Ce qui ne descend de rien — ${totalOrph} valeurs, ${orphelines.length} familles</h3>
<p class="note">Chaque ligne est une famille dont les valeurs ont été choisies une par une.
Quand une valeur retombe sur un nombre déjà connu, c'est signalé : ce n'est pas une règle,
c'est une piste — ce cran-là pourrait descendre d'une décision au lieu d'être écrit.</p>
<div class="roule"><table>
  <thead><tr><th>Famille</th><th>Valeurs</th><th>Retombent sur un nombre déjà connu</th></tr></thead>
  <tbody>${orphelines.map((o) => `<tr class="${o.echos.length ? 'echo' : ''}">
    <td class="cle">${esc(o.fam)}</td><td class="mono">${o.n}</td>
    <td class="mono petit">${o.echos.length ? esc(o.echos.join(' · ')) : '—'}</td>
  </tr>`).join('')}</tbody>
</table></div>
`

const noteCarto = `Huit décisions produisent ${derives.reduce((a, d) => a + d.n, 0)} valeurs. ` +
  `${totalOrph} autres sont encore posées une par une, et ${totalEchos} d'entre elles retombent déjà ` +
  `sur un nombre que le système connaît — autant de crans qui pourraient cesser d'être écrits.`

/* ── 1 · les espaces ───────────────────────────────────────────────────── */
const e = geo.entrees || {}
const espacesLoi = `<div class="loi">
  <div class="loi-e"><b>${nb(e.base)} px</b><span>la base</span></div>
  <div class="loi-op">÷</div>
  <div class="loi-e"><b>${nb(e.ratio)}</b><span>le ratio</span></div>
  <div class="loi-fl">→</div>
  <div class="loi-r">toute la géométrie<small>marges · écarts · rayons · bord</small></div>
</div>`

const profondeurs = (geo.profondeurs || [])
const barre = (px, max) => `<span class="trait" style="width:${Math.max(2, (px / max) * 320)}px"></span>`
const maxMarge = Math.max(...Object.values(geo.marges || { a: 1 }))
const tableProfondeurs = `<div class="roule"><table>
  <thead><tr><th>Profondeur</th><th>Marge intérieure</th><th>Écart entre enfants</th><th>Rayon</th></tr></thead>
  <tbody>${profondeurs.map((p) => `<tr>
    <td class="cle">${esc(p)}</td>
    <td>${barre(geo.marges?.[p] || 0, maxMarge)} <span class="mono">${nb(geo.marges?.[p] || 0)} px</span></td>
    <td>${barre(geo.ecarts?.[p] || 0, maxMarge)} <span class="mono">${nb(geo.ecarts?.[p] || 0)} px</span></td>
    <td class="mono">${geo.rayons?.[p] !== undefined ? nb(geo.rayons[p]) + ' px' : '—'}</td>
  </tr>`).join('')}</tbody>
</table></div>`

const axes = geo.axes || {}
const tableAxes = `<div class="roule"><table>
  <thead><tr><th>Axe</th><th>Le plus étroit (320 px)</th><th>Le plus large (1440 px)</th></tr></thead>
  <tbody>${crans(axes).map(([k, v]) => `<tr>
    <td class="cle">${k === 'inline' ? 'horizontal' : k === 'block' ? 'vertical' : k === 'radius' ? 'les rayons' : esc(k)}</td>
    <td class="mono">× ${nb(v.min)}</td><td class="mono">× ${nb(v.max)}</td>
  </tr>`).join('')}</tbody>
</table></div>`

const prix = geo.$prixDeLaFluidite
const noteEspaces = prix
  ? `Le générateur d'origine adoucit sa courbe ; une feuille de style ne sait qu'interpoler droit. L'écart a été mesuré tous les 10 pixels : ${nb(prix.ecartPx)} px au pire, vers ${prix.aLargeur} px de large. Sous les deux pixels, mais réel.`
  : ''

/* ── 2 · les couleurs ──────────────────────────────────────────────────── */
const potNeutre = ([nom, hex]) => carte(
  `<div class="apercu" style="background:${hex}"></div>`, nom, hex, '')
const couleursNeutres = grille(Object.entries(pal.neutres || {}).map(potNeutre).join(''))

const potEtat = ([nom, o]) => carte(
  `<div class="apercu duo">
     <div style="background:${o.surface};color:${o.sur}">${esc(nom)}</div>
     <div style="background:${o.plein};color:${o.surPlein}">${esc(nom)}</div>
   </div>`,
  nom, `${o.surface} · ${o.plein}`,
  'un fond pâle avec son texte, et sa version pleine')
const couleursEtats = grille(Object.entries(pal.etats || {}).map(potEtat).join(''))

/* ── 3 · le texte ──────────────────────────────────────────────────────── */
const familles = grille(crans(exp.familles).map(([k, v]) => carte(
  '', k, '', emploi(v)).replace('<div class="corps">',
  `<div class="corps"><p class="echantillon" style="font-family:${String(valeur(v)).replace(/"/g, "'")}">Le juge est-il entier ?</p>`)).join(''))

const graisses = grille(crans(exp.graisses).map(([k, v]) => carte(
  '', `${k} · ${valeur(v)}`, '', emploi(v)).replace('<div class="corps">',
  `<div class="corps"><p class="echantillon petit" style="font-weight:${valeur(v)}">Hiérarchie visuelle</p>`)).join(''))

const tailles = grille(crans(exp.tailles).map(([k, v]) => {
  const o = typeof v === 'object' ? v : { valeur: v }
  const t = o.valeur ?? o.taille ?? ''
  const il = o.interligne ?? o.ligne ?? ''
  const style = [`font-size:${t}`, il ? `line-height:${il}` : '',
    k === 'menu' ? 'letter-spacing:.08em;text-transform:uppercase' : ''].filter(Boolean).join(';')
  return carte('', `${k}${t ? ' · ' + t : ''}${il ? ' / ' + il : ''}`, '', o.emploi || '')
    .replace('<div class="corps">', `<div class="corps"><p class="echantillon" style="${style}">Ce qui compte d'abord</p>`)
}).join(''))

/* ── 4 · listes simples ────────────────────────────────────────────────── */
const listeSimple = (obj) => grille(crans(obj).map(([k, v]) =>
  carte('', k, valeur(v), emploi(v))).join(''))

const rayons = grille(crans(exp.rayons).map(([k, v]) => carte(
  `<div class="apercu forme"><span style="border-radius:${valeur(v)}"></span></div>`,
  k, valeur(v), emploi(v))).join(''))

const traits = grille(crans(exp.traits).map(([k, v]) => {
  const val = String(valeur(v))
  const style = val.endsWith('px')
    ? `border-top:${val} solid var(--net)`
    : `border-top:1px ${val} var(--net)`
  return carte(`<div class="apercu ligne"><span style="${style}"></span></div>`, k, val, emploi(v))
}).join(''))

const opacites = grille(crans(exp.opacites).map(([k, v]) => carte(
  `<div class="apercu"><span class="voile" style="opacity:${valeur(v)}"></span></div>`,
  k, valeur(v), emploi(v))).join(''))

const elevations = grille(crans(exp.elevations).map(([k, v]) => carte(
  `<div class="apercu"><span class="bloc" style="box-shadow:${valeur(v) === 'none' ? 'none' : valeur(v)}"></span></div>`,
  k, valeur(v), emploi(v))).join(''))

const cibles = grille(crans(exp.cibles).map(([k, v]) => carte(
  `<div class="apercu"><span class="cible" style="width:${valeur(v)};height:${valeur(v)}"></span></div>`,
  k, valeur(v), emploi(v))).join(''))

const icones = grille(crans(exp.icones).map(([k, v]) => carte(
  '', k, valeur(v), emploi(v))).join(''))

const etatsControle = `<div class="roule"><table>
  <thead><tr><th>État</th><th>Fond · trait · encre</th><th>Quand</th></tr></thead>
  <tbody>${crans(exp.etats).map(([k, v]) => `<tr>
    <td class="cle">${esc(k)}</td><td class="mono">${esc(valeur(v))}</td><td>${esc(emploi(v))}</td>
  </tr>`).join('')}</tbody>
</table></div>`

/* ── 5 · les composants ────────────────────────────────────────────────── */
const src = texte('src/system/index.ts')
const composants = [...src.matchAll(/^export \{([^}]+)\} from/gm)]
  .flatMap((m) => m[1].split(',').map((s) => s.trim()))
  .filter((n) => /^[A-Z]/.test(n))
const listeComposants = `<div class="pastilles">${composants.map((c) =>
  `<span class="pastille">${esc(c)}</span>`).join('')}</div>`

/* ── 6 · le linter ─────────────────────────────────────────────────────── */
const FAMILLES = {
  R1: ['Les composants', 'toute interface passe par une pièce du système, jamais par une balise nue'],
  R2: ['Les états', 'tout ce qui attend une réponse montre qu\'il charge, qu\'il a raté, qu\'il est vide'],
  R3: ['Les espaces', 'aucun nombre écrit à la main : tout vient de l\'échelle'],
  R4: ['Le rythme', 'une page est une suite de tranches, et deux voisines ne respirent pas pareil'],
  R5: ['La hiérarchie', 'une page dit ce qui compte d\'abord, une seule fois, et pas en bas'],
  R6: ['L\'expression', 'd\'où viennent les couleurs, les polices, les icônes, les mots']
}
const parFamille = {}
for (const a of ass?.assertions || []) {
  const f = (a.id || '').slice(0, 2)
  ;(parFamille[f] ||= []).push(a.id)
}
const tableLinter = `<div class="roule"><table>
  <thead><tr><th>Famille</th><th>Ce qu'elle interdit</th><th>Règles</th></tr></thead>
  <tbody>${Object.entries(FAMILLES).map(([f, [nom, quoi]]) => {
    const n = (parFamille[f] || []).length
    return `<tr class="${n ? '' : 'vide'}">
      <td class="cle">${esc(nom)}</td><td>${esc(quoi)}</td>
      <td class="mono">${n ? n + (n > 1 ? ' règles' : ' règle') : 'pas encore écrite'}</td>
    </tr>`
  }).join('')}</tbody>
</table></div>`
const totalRegles = (ass?.assertions || []).length

/* ── les mots ──────────────────────────────────────────────────────────── */
let nbLibelles = 0
const compter = (o) => { for (const [k, v] of Object.entries(o || {})) { if (k.startsWith('$')) continue; if (typeof v === 'string') nbLibelles++; else if (typeof v === 'object') compter(v) } }
if (lib) compter(lib)


/* ── 12 · le lexique ───────────────────────────────────────────────────── */
const lexique = !lex ? '' : `
<div class="roule"><table>
  <thead><tr><th>Dans l'outil de l'Auteur</th><th>Dans Fili</th><th>Quoi</th></tr></thead>
  <tbody>${lex.correspondances.map((c) => `<tr>
    <td class="mono">${esc(c.outil)}</td><td class="mono petit">${esc(c.fili)}</td><td>${esc(c.quoi)}</td>
  </tr>`).join('')}</tbody>
</table></div>
<h3>Ce qui ne se traduit pas — ${lex.intraduisibles.length} mots</h3>
<p class="note">Nommés plutôt que bricolés. Un lexique qui invente un équivalent ne traduit plus.</p>
<div class="roule"><table>
  <thead><tr><th>Côté</th><th>Mot</th><th>Pourquoi</th></tr></thead>
  <tbody>${lex.intraduisibles.map((i) => `<tr>
    <td class="cle">${i.cote === 'outil' ? "l'outil" : 'Fili'}</td>
    <td class="mono petit">${esc(i.nom)}</td><td>${esc(i.quoi)}</td>
  </tr>`).join('')}</tbody>
</table></div>
`

/* ── la page ───────────────────────────────────────────────────────────── */
const n = pal.neutres || {}
const page = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fili — le système au complet</title>
<style>
:root{
  --papier:${n.papier || '#fff'}; --creux:${n.papierCreux || '#f4f4f8'};
  --encre:${n.encre || '#222'}; --douce:${n.encreDouce || '#666'};
  --trait:${n.trait || '#ddd'}; --net:${n.traitNet || '#999'};
  --accent:${n.accent || '#4F46E5'}; --scene:${n.scene || '#202023'};
}
*{box-sizing:border-box}
body{margin:0;background:var(--papier);color:var(--encre);
  font:17px/1.6 'Geist Variable',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.enveloppe{max-width:1024px;margin:0 auto;padding:48px 20px 120px}
h1{font-size:clamp(28px,4vw,42px);line-height:1.1;font-weight:600;margin:0 0 12px;letter-spacing:-.02em}
h2{font-size:clamp(22px,3vw,30px);line-height:1.2;font-weight:600;margin:0 0 8px;letter-spacing:-.01em}
h3{font-size:17px;font-weight:600;margin:28px 0 8px}
.menu{font:600 12px/1.2 'JetBrains Mono',ui-monospace,Menlo,monospace;letter-spacing:.08em;
  text-transform:uppercase;color:var(--douce);margin:0 0 10px}
.chapeau{color:var(--douce);font-size:19px;max-width:62ch;margin:0 0 20px}
.note{color:var(--douce);font-size:14px;max-width:70ch;margin:16px 0 0}
section{margin:56px 0 0;padding-top:28px;border-top:1px solid var(--trait)}
nav{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--papier) 92%,transparent);
  backdrop-filter:blur(10px);border-bottom:1px solid var(--trait);margin:0 -20px 0;padding:14px 20px}
nav .dedans{max-width:1024px;margin:0 auto;display:flex;gap:16px;flex-wrap:wrap;
  font-size:13px}
nav a{color:var(--douce);text-decoration:none}
nav a:hover{color:var(--accent);text-decoration:underline}

.grille{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));margin-top:16px}
.carte{border:1px solid var(--trait);border-radius:8px;overflow:hidden;background:var(--papier)}
.carte .corps{padding:12px 14px}
.apercu{height:64px}
.apercu.duo{display:flex}
.apercu.duo>div{flex:1;display:flex;align-items:center;justify-content:center;
  font:600 13px 'JetBrains Mono',ui-monospace,monospace}
.apercu.forme,.apercu.ligne{display:flex;align-items:center;justify-content:center;background:var(--creux)}
.apercu.forme span{width:96px;height:40px;background:var(--papier);border:1px solid var(--net)}
.apercu.ligne span{width:80%;display:block}
.apercu .voile{display:block;width:100%;height:100%;background:var(--encre)}
.apercu .bloc{display:block;width:70%;height:40px;margin:12px auto;background:var(--papier);border-radius:8px}
.apercu .cible{display:block;background:var(--creux);border:1px solid var(--net);border-radius:2px;margin:auto}
.apercu:has(.cible){display:flex}
.nom{font:500 13px 'JetBrains Mono',ui-monospace,Menlo,monospace;margin:0 0 2px}
.val{font:400 12px 'JetBrains Mono',ui-monospace,Menlo,monospace;color:var(--douce);margin:0 0 6px;word-break:break-all}
.emploi{font-size:13px;color:var(--douce);margin:0}
.mesure{font:400 12px 'JetBrains Mono',ui-monospace,monospace;color:var(--douce);margin:6px 0 0}
.echantillon{margin:0 0 8px;line-height:1.25;font-size:21px}
.echantillon.petit{font-size:17px}

table{width:100%;border-collapse:collapse;margin-top:16px;font-size:15px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--trait);vertical-align:middle}
th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--douce);font-weight:600}
td.cle{color:var(--douce)}
tr.vide td{color:var(--douce);font-style:italic}
.mono{font:400 13px 'JetBrains Mono',ui-monospace,Menlo,monospace}
.trait{display:inline-block;height:10px;border-radius:2px;background:var(--accent);vertical-align:0;margin-right:8px}

.loi{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--creux);
  border-radius:8px;padding:20px;margin-top:8px}
.loi-e{display:flex;flex-direction:column}
.loi-e b{font:600 21px 'JetBrains Mono',ui-monospace,monospace}
.loi-e span{font-size:13px;color:var(--douce)}
.loi-op,.loi-fl{color:var(--douce);font-size:19px}
.loi-r{font-weight:600}
.loi-r small{display:block;font-weight:400;font-size:13px;color:var(--douce)}

.socle{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));margin:16px 0 8px}
.den{border:1px solid var(--trait);border-left:3px solid var(--accent);border-radius:8px;padding:14px 16px}
.den b{display:block;font:600 21px 'JetBrains Mono',ui-monospace,Menlo,monospace;line-height:1.1}
.den-cle{display:block;font-size:14px;font-weight:600;margin-top:4px}
.den-quoi{display:block;font-size:13px;color:var(--douce);margin-top:2px}
td.grand{font-size:19px;font-weight:600}
tr.somme td{background:var(--creux);font-weight:600}
tr.echo td.cle{color:var(--accent);font-weight:600}
.mono.petit{font-size:12px}
.pastilles{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.pastille{border:1px solid var(--trait);border-radius:9999px;padding:7px 14px;
  font:500 14px 'JetBrains Mono',ui-monospace,Menlo,monospace;background:var(--creux)}

/* ── le téléphone. Une page qui se lit debout dans le métro ou pas du tout ── */
@media (max-width:640px){
  body{font-size:16px}
  .enveloppe{padding:24px 16px 72px}
  nav{margin:0 -16px;padding:10px 16px}
  nav .dedans{gap:12px;font-size:12px;overflow-x:auto;flex-wrap:nowrap;
    white-space:nowrap;-webkit-overflow-scrolling:touch}
  h1{font-size:26px}
  h2{font-size:21px}
  .chapeau{font-size:17px}
  section{margin-top:36px;padding-top:20px}
  .grille{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .socle{grid-template-columns:1fr;gap:10px}
  .den b{font-size:19px}
  /* Un tableau ne se met pas en colonnes sur un téléphone : il se fait défiler. */
  .roule{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:16px -16px 0;padding:0 16px}
  .roule table{min-width:520px;margin-top:0}
  th,td{padding:9px 10px;font-size:14px}
  .mono.petit{font-size:11px}
  .trait{max-width:110px}
  .loi{gap:10px;padding:16px}
}
.pied{margin-top:64px;padding-top:24px;border-top:1px solid var(--trait);
  color:var(--douce);font-size:14px;max-width:74ch}
</style></head>
<body>

<nav><div class="dedans">
  <a href="#carto">La cartographie</a><a href="#espaces">Les espaces</a><a href="#rayons">Les rayons</a>
  <a href="#couleurs">Les couleurs</a><a href="#texte">Le texte</a>
  <a href="#largeurs">Les largeurs</a><a href="#separer">Séparer</a>
  <a href="#mouvement">Le mouvement</a><a href="#icones">Les icônes</a>
  <a href="#controles">Les contrôles</a><a href="#composants">Les composants</a>
  <a href="#linter">Le robot</a><a href="#lexique">Le lexique</a>
</div></nav>

<div class="enveloppe">
<p class="menu">Fili · pièce générée · ${new Date().toISOString().slice(0, 10)}</p>
<h1>Le système au complet</h1>
<p class="chapeau">Tout ce que Fili sait de son apparence, sur une seule page : les espaces, les
couleurs, le texte, les formes, le mouvement, les pièces toutes faites, et les règles que le robot
fait respecter. Cette page ne décide rien — elle lit les fichiers du dépôt et les montre. Si une
valeur change là-bas, on regénère.</p>

${section('carto', '00 — La cartographie', 'Huit décisions, et tout le reste en descend',
  "Un jeton est soit calculé, soit choisi. Cette page dit lequel est lequel — et combien de valeurs sont encore choisies alors qu'elles pourraient être calculées.",
  carto, noteCarto)}

${section('espaces', '01 — Les espaces', 'Trois réglages, et tout le reste se calcule',
  'On ne choisit jamais un espace. On dit à quelle profondeur on se trouve, et la valeur tombe toute seule.',
  espacesLoi + `<h3>Les cinq profondeurs</h3>` + tableProfondeurs +
  `<h3>Ce qui bouge avec la largeur de l'écran</h3>
   <p class="note">L'horizontal et le vertical ne respirent pas ensemble : c'est ce qui empêche une page de s'étirer bêtement.</p>` + tableAxes,
  noteEspaces)}

${section('rayons', '02 — Les rayons', "Le rayon EST la marge — et il se divise par deux à chaque niveau",
  "Il n'y a pas de rayon à choisir : la marge est la source. Le rayon du premier niveau vaut la moitié de la marge du premier niveau, et chaque niveau divise encore par deux.",
  rayons, geo.$loiDuRayon)}

${section('couleurs', '03 — Les couleurs', 'Une seule couleur est choisie, le reste est calculé',
  `La couleur de départ est ${pal.$primaire}. Tous les gris en descendent, et chaque couple fond/texte est construit pour rester lisible.`,
  `<h3>Les fonds et les encres</h3>` + couleursNeutres +
  `<h3>Les quatre états</h3>` + couleursEtats)}

${section('texte', '04 — Le texte', 'La taille découle du niveau, jamais de l\'endroit',
  exp.tailles?.$intention,
  `<h3>Les trois voix</h3>` + familles +
  `<h3>Les trois graisses</h3>` + graisses +
  `<h3>Les sept tailles</h3>` + tailles,
  exp.familles?.$dette || '')}

${section('largeurs', '05 — Les largeurs', 'Où la page s\'arrête, et où elle change de forme',
  exp.mesures?.$regime,
  `<h3>Les largeurs</h3>` + listeSimple(exp.mesures) +
  `<h3>Les points de bascule</h3>` + listeSimple(exp.bascules) +
  `<h3>Les colonnes admises</h3>` + listeSimple(exp.grille))}

${section('separer', '06 — Séparer', 'L\'espace d\'abord, le fond ensuite, le trait en dernier',
  exp.traits?.$intention,
  `<h3>Les traits</h3>` + traits +
  `<h3>Les voiles</h3>` + opacites +
  `<h3>Les ombres</h3>` + elevations)}

${section('mouvement', '07 — Le mouvement', 'Une animation explique quelque chose, ou elle n\'existe pas',
  exp.durees?.$intention,
  `<h3>Les durées</h3>` + listeSimple(exp.durees) +
  `<h3>Les courbes</h3>` + listeSimple(exp.courbes))}

${section('icones', '08 — Les icônes', 'On ne dessine pas d\'icône, on déclare une correspondance',
  exp.icones?.$regle,
  icones + `<h3>Les trois tailles</h3>` + listeSimple(exp.taillesIcone),
  exp.icones?.$dette || '')}

${section('controles', '09 — Les contrôles', 'Ce que devient un bouton quand on le touche',
  exp.etats?.$intention,
  etatsControle + `<h3>La taille minimale d'une cible</h3>` + cibles +
  `<h3>L'anneau au clavier</h3>` + listeSimple(exp.focus))}

${section('composants', '10 — Les pièces toutes faites', `${composants.length} composants, et l'obligation de passer par eux`,
  'Un bouton écrit à la main au lieu du composant est refusé par le robot. C\'est ce qui fait qu\'un même geste se ressemble d\'un écran à l\'autre.',
  listeComposants + (nbLibelles ? `<h3>Les mots</h3><p class="note">Le catalogue porte ${nbLibelles} formulations. Aucun écran n'invente une phrase.</p>` : ''))}

${section('linter', '11 — Le robot', `${totalRegles} règles, et une famille pas encore écrite`,
  'Il lit le code avant qu\'il parte et il bloque. Il ne juge jamais si c\'est beau : il vérifie que rien n\'a été inventé sur place.',
  tableLinter,
  'Le vert dit « rien n\'a été inventé ». Il ne dit jamais « c\'est bien réglé ». Ça, c\'est l\'œil, et le robot ne le remplacera pas.')}

${lex ? section('lexique', '12 — Le lexique', `${lex.correspondances.length} mots qui se traduisent, ${lex.intraduisibles.length} qui ne se traduisent pas`,
  "L'Échelle Semantic Rhythm et Fili portent les mêmes idées sous d'autres noms. Voici la table. Un écran écrit dans une langue peut désormais s'habiller avec les jetons de l'autre, sans être réécrit.",
  lexique, "Le lexique ne déclare aucune valeur : chaque entrée pointe sur un jeton du dépôt, et la génération refuse de statuer si l'un manque.") : ''}

<p class="pied">Page produite par <span class="mono">tools/fili/systeme/produire.mjs</span> depuis
<span class="mono">fili/geometrie.json</span>, <span class="mono">fili/palette.json</span>,
<span class="mono">fili/expression.json</span>, <span class="mono">fili/libelles.json</span>,
<span class="mono">fili/assertions.json</span> et <span class="mono">src/system/index.ts</span>.
Aucune valeur n'est écrite ici. Pour la mettre à jour : <span class="mono">npm run fili:systeme</span>.</p>

</div></body></html>`

mkdirSync(resolve(DEPOT, 'public/systeme'), { recursive: true })
writeFileSync(resolve(DEPOT, 'public/systeme/index.html'), page, 'utf8')
console.log(`✓ public/systeme/index.html — ${composants.length} composants, ${totalRegles} règles, ${nbLibelles} formulations`)
