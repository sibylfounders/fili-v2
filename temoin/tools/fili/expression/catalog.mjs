/* Le catalogue de libellés, rendu depuis le catalogue lui-même.
   Pièce du Temps ③ de la séance, et étalon de B-5. Le protocole exige qu'il
   soit « lisible d'un bloc » : un fichier de données ne l'est pas, et tant
   qu'il ne l'était pas, B-5 restait sans objet.
   Il ne montre AUCUN écran du produit : le froid de la séance appartient à
   l'Auteur, et il ne se dépense pas pour un arbitrage de formulation. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/labels.json'), 'utf8'))
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/expression.json'), 'utf8'))
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/palette.json'), 'utf8'))
const DATE = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : '2026-08-07'

const t = (n) => PAL.neutrals[n]
const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const items = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'))

/* Cette page compose son style à la main : elle ne passe pas par la chaîne
   Tailwind, et rien ne lui apportait donc les déclarations de fonte. Elle
   nommait les trois voix de la charte et n'en affichait aucune. */
const { dropFonts, blockFonts } = await import(
  new URL('../witness/fonts.mjs', import.meta.url).href)
dropFonts()
const FONTS = blockFonts('../files/')

/* Un libellé se lit avec ses variables visibles : « {raison} » dans le texte est
   une part de la formulation, pas un détail d'implémentation. */
const markIt = (s) => e(s).replace(/\{(\w+)\}/g, '<span class="var">{$1}</span>')

let count = 0
const line = ([key, val], prefix = '') => {
  if (typeof val === 'string') {
    count += 1
    return `<tr><td class="key">${e(prefix + key)}</td><td class="txt">${markIt(val)}</td></tr>`
  }
  return items(val).map((x) => line(x, `${prefix + key}.`)).join('')
}

const block = (heading, note, body) =>
  `<section><h2>${e(heading)}</h2>${note ? `<p class="note">${e(note)}</p>` : ''}<table>${body}</table></section>`

const rules = (o) =>
  items(o).map(([k, v]) => `<li><b>${e(k)}</b> — ${e(v)}</li>`).join('')

const page = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Catalogue de libellés · ${DATE}</title>
<style>
${FONTS}
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body { margin:0; padding:48px 32px 96px; background:${t('paperHollow')}; color:${t('ink')};
         font-family:${P.families.current.value}; font-size:${P.sizes.body.value};
         line-height:${P.sizes.body.leading} }
  .frame { max-width:${P.measures.page.value}; margin:0 auto }
  h1 { font-size:${P.sizes.level1.value}; line-height:${P.sizes.level1.leading};
       font-weight:${P.weights.pressed.value}; margin:0 0 12px; text-wrap:balance }
  h2 { font-size:${P.sizes.level2.value}; line-height:${P.sizes.level2.leading};
       font-weight:${P.weights.pressed.value}; margin:56px 0 8px }
  .kicker { font-family:${P.families.mechanical.value}; font-size:${P.sizes.menu.value};
              letter-spacing:${P.sizes.menu.advance}; text-transform:uppercase;
              color:${t('inkSoft')}; margin:0 0 8px }
  .lede { font-size:${P.sizes.lede.value}; line-height:${P.sizes.lede.leading};
             color:${t('inkSoft')}; max-width:${P.measures.reading.value}; margin:0 0 8px }
  .note { font-size:${P.sizes.end.value}; line-height:${P.sizes.end.leading};
          color:${t('inkSoft')}; max-width:${P.measures.reading.value}; margin:0 0 20px }
  ul { max-width:${P.measures.reading.value}; padding-left:20px; color:${t('ink')};
       font-size:${P.sizes.end.value}; line-height:${P.sizes.end.leading} }
  li { margin-bottom:10px }
  table { width:100%; border-collapse:collapse; background:${t('paper')};
          border:1px solid ${t('stroke')}; border-radius:${P.radii.control.value}; overflow:hidden }
  td { border-top:1px solid ${t('stroke')}; padding:12px 16px; vertical-align:top }
  tr:first-child td { border-top:0 }
  .key { font-family:${P.families.mechanical.value}; font-size:${P.sizes.menu.value};
         color:${t('inkSoft')}; white-space:nowrap; width:34% }
  .txt { font-size:${P.sizes.end.value}; line-height:${P.sizes.end.leading} }
  .var { font-family:${P.families.mechanical.value}; background:${t('paperHollow')};
         border:1px solid ${t('stroke')}; border-radius:${P.radii.soft.value};
         padding:1px 5px; color:${t('inkSoft')} }
  footer { margin-top:64px; font-size:${P.sizes.end.value}; color:${t('inkSoft')};
           max-width:${P.measures.reading.value} }
</style></head>
<body><div class="frame">
  <p class="kicker">Fili · pièce du Temps ③ · étalon de B-5</p>
  <h1>Le catalogue de libellés</h1>
  <p class="lede">Toute la parole du produit, d'un bloc. Ce que la séance juge ici n'est pas
  un libellé isolé mais une voix : le produit parle-t-il d'une seule, et est-ce la vôtre ?</p>
  <p class="note">Généré depuis <b>fili/libelles.json</b> le ${DATE}. Aucune formulation n'est
  écrite dans cette page : elle montre ce que le dépôt déclare, et rien d'autre.
  Les variables sont laissées visibles — elles font partie de la formulation.</p>

  <section><h2>Les destinataires</h2>
  <p class="note">${e(L.$tone.$recipients)}</p></section>

  <section><h2>La règle, pour les humains</h2>
  <p class="note">${e(L.$tone.humans.$rule)}</p>
  <ul>${rules(L.$tone.humans)}</ul></section>

  ${L.$tone.machines ? `<section><h2>La règle, pour les machines</h2>
  <p class="note">${e(L.$tone.machines.$rule ?? '')}</p>
  <ul>${rules(L.$tone.machines)}</ul></section>` : ''}

  ${block('Le produit', null, items(L.product).map((x) => line(x)).join(''))}
  ${block('Le commun — actions, statuts, mesures', "Ce qui se dit partout. Une formulation qui vit ici ne se réécrit jamais dans un écran.", items(L.common).map((x) => line(x)).join(''))}
  ${items(L.screens).map(([key, v]) => block(
      `${v.$screen ?? key}`,
      v.$primacy ? `Ce qui compte d'abord — ${v.$primacy}` : null,
      items(v).map((x) => line(x)).join('')
    )).join('')}

  <footer>${e(L.$limits ? (typeof L.$limits === 'string' ? L.$limits : JSON.stringify(L.$limits)) : '')}
  <p><b>${String(count)}</b> formulations déclarées.</p></footer>
</div></body></html>
`

const OUTPUT = path.join(ROOT, 'witnesses/catalog', `${DATE}.html`)
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, page)
console.log('catalogue rendu →', path.relative(ROOT, OUTPUT), `(${String(page.length)} octets · ${String(count)} formulations)`)
