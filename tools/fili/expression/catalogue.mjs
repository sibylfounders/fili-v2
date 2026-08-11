/* Le catalogue de libellés, rendu depuis le catalogue lui-même.
   Pièce du Temps ③ de la séance, et étalon de B-5. Le protocole exige qu'il
   soit « lisible d'un bloc » : un fichier de données ne l'est pas, et tant
   qu'il ne l'était pas, B-5 restait sans objet.
   Il ne montre AUCUN écran du produit : le froid de la séance appartient à
   l'Auteur, et il ne se dépense pas pour un arbitrage de formulation. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const L = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/libelles.json'), 'utf8'))
const P = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/expression.json'), 'utf8'))
const PAL = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/palette.json'), 'utf8'))
const DATE = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : '2026-08-07'

const t = (n) => PAL.neutres[n]
const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const items = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'))

/* Cette page compose son style à la main : elle ne passe pas par la chaîne
   Tailwind, et rien ne lui apportait donc les déclarations de fonte. Elle
   nommait les trois voix de la charte et n'en affichait aucune. */
const { deposerPolices, blocPolices } = await import(
  new URL('../temoin/polices.mjs', import.meta.url).href)
deposerPolices()
const POLICES = blocPolices('../files/')

/* Un libellé se lit avec ses variables visibles : « {raison} » dans le texte est
   une part de la formulation, pas un détail d'implémentation. */
const marquer = (s) => e(s).replace(/\{(\w+)\}/g, '<span class="var">{$1}</span>')

let compte = 0
const ligne = ([cle, val], prefixe = '') => {
  if (typeof val === 'string') {
    compte += 1
    return `<tr><td class="cle">${e(prefixe + cle)}</td><td class="txt">${marquer(val)}</td></tr>`
  }
  return items(val).map((x) => ligne(x, `${prefixe + cle}.`)).join('')
}

const bloc = (titre, note, corps) =>
  `<section><h2>${e(titre)}</h2>${note ? `<p class="note">${e(note)}</p>` : ''}<table>${corps}</table></section>`

const regles = (o) =>
  items(o).map(([k, v]) => `<li><b>${e(k)}</b> — ${e(v)}</li>`).join('')

const page = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Catalogue de libellés · ${DATE}</title>
<style>
${POLICES}
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body { margin:0; padding:48px 32px 96px; background:${t('papierCreux')}; color:${t('encre')};
         font-family:${P.familles.courante.valeur}; font-size:${P.tailles.corps.valeur};
         line-height:${P.tailles.corps.interligne} }
  .cadre { max-width:${P.mesures.page.valeur}; margin:0 auto }
  h1 { font-size:${P.tailles.niveau1.valeur}; line-height:${P.tailles.niveau1.interligne};
       font-weight:${P.graisses.appuyee.valeur}; margin:0 0 12px; text-wrap:balance }
  h2 { font-size:${P.tailles.niveau2.valeur}; line-height:${P.tailles.niveau2.interligne};
       font-weight:${P.graisses.appuyee.valeur}; margin:56px 0 8px }
  .surtitre { font-family:${P.familles.mecanique.valeur}; font-size:${P.tailles.menu.valeur};
              letter-spacing:${P.tailles.menu.chasse}; text-transform:uppercase;
              color:${t('encreDouce')}; margin:0 0 8px }
  .chapeau { font-size:${P.tailles.chapeau.valeur}; line-height:${P.tailles.chapeau.interligne};
             color:${t('encreDouce')}; max-width:${P.mesures.lecture.valeur}; margin:0 0 8px }
  .note { font-size:${P.tailles.fin.valeur}; line-height:${P.tailles.fin.interligne};
          color:${t('encreDouce')}; max-width:${P.mesures.lecture.valeur}; margin:0 0 20px }
  ul { max-width:${P.mesures.lecture.valeur}; padding-left:20px; color:${t('encre')};
       font-size:${P.tailles.fin.valeur}; line-height:${P.tailles.fin.interligne} }
  li { margin-bottom:10px }
  table { width:100%; border-collapse:collapse; background:${t('papier')};
          border:1px solid ${t('trait')}; border-radius:${P.rayons.controle.valeur}; overflow:hidden }
  td { border-top:1px solid ${t('trait')}; padding:12px 16px; vertical-align:top }
  tr:first-child td { border-top:0 }
  .cle { font-family:${P.familles.mecanique.valeur}; font-size:${P.tailles.menu.valeur};
         color:${t('encreDouce')}; white-space:nowrap; width:34% }
  .txt { font-size:${P.tailles.fin.valeur}; line-height:${P.tailles.fin.interligne} }
  .var { font-family:${P.familles.mecanique.valeur}; background:${t('papierCreux')};
         border:1px solid ${t('trait')}; border-radius:${P.rayons.doux.valeur};
         padding:1px 5px; color:${t('encreDouce')} }
  footer { margin-top:64px; font-size:${P.tailles.fin.valeur}; color:${t('encreDouce')};
           max-width:${P.mesures.lecture.valeur} }
</style></head>
<body><div class="cadre">
  <p class="surtitre">Fili · pièce du Temps ③ · étalon de B-5</p>
  <h1>Le catalogue de libellés</h1>
  <p class="chapeau">Toute la parole du produit, d'un bloc. Ce que la séance juge ici n'est pas
  un libellé isolé mais une voix : le produit parle-t-il d'une seule, et est-ce la vôtre ?</p>
  <p class="note">Généré depuis <b>fili/libelles.json</b> le ${DATE}. Aucune formulation n'est
  écrite dans cette page : elle montre ce que le dépôt déclare, et rien d'autre.
  Les variables sont laissées visibles — elles font partie de la formulation.</p>

  <section><h2>Les destinataires</h2>
  <p class="note">${e(L.$ton.$destinataires)}</p></section>

  <section><h2>La règle, pour les humains</h2>
  <p class="note">${e(L.$ton.humains.$regle)}</p>
  <ul>${regles(L.$ton.humains)}</ul></section>

  ${L.$ton.machines ? `<section><h2>La règle, pour les machines</h2>
  <p class="note">${e(L.$ton.machines.$regle ?? '')}</p>
  <ul>${regles(L.$ton.machines)}</ul></section>` : ''}

  ${bloc('Le produit', null, items(L.produit).map((x) => ligne(x)).join(''))}
  ${bloc('Le commun — actions, statuts, mesures', "Ce qui se dit partout. Une formulation qui vit ici ne se réécrit jamais dans un écran.", items(L.commun).map((x) => ligne(x)).join(''))}
  ${items(L.ecrans).map(([cle, v]) => bloc(
      `${v.$ecran ?? cle}`,
      v.$primaute ? `Ce qui compte d'abord — ${v.$primaute}` : null,
      items(v).map((x) => ligne(x)).join('')
    )).join('')}

  <footer>${e(L.$limites ? (typeof L.$limites === 'string' ? L.$limites : JSON.stringify(L.$limites)) : '')}
  <p><b>${String(compte)}</b> formulations déclarées.</p></footer>
</div></body></html>
`

const SORTIE = path.join(RACINE, 'temoins/catalogue', `${DATE}.html`)
fs.mkdirSync(path.dirname(SORTIE), { recursive: true })
fs.writeFileSync(SORTIE, page)
console.log('catalogue rendu →', path.relative(RACINE, SORTIE), `(${String(page.length)} octets · ${String(compte)} formulations)`)
