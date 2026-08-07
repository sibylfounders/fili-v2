/* Le journal, lu pour être montré — jamais pour être réécrit.
 *
 * É6 donne à lire la mémoire du projet. Ce qui compte d'abord est LA DERNIÈRE
 * DÉCISION ; les précédentes sont consultables et ne s'exposent pas. Ce lecteur
 * rend donc chaque entrée en deux parties : sa tête, toujours montrée, et son
 * corps, que l'écran replie.
 *
 * Il ne coupe rien et ne résume rien. Un journal résumé par la machine qui
 * l'affiche serait un journal réécrit par elle, et la règle 3 — on n'édite
 * jamais une entrée passée — vaut aussi pour celui qui la donne à voir.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const SOURCE = path.join(RACINE, 'journal.md')

const TETE = /^## (#\d{3}) — (.+)$/
const SOUS = /^\*(\d{4}-\d{2}-\d{2}) · Statut : (.+?)\*$/

/* Le statut d'une entrée s'écrit en toutes lettres avec sa pastille. On garde
   la pastille pour l'œil et le reste pour la lecture : les deux disent la même
   chose, et supprimer l'un des deux ferait lire un état à la couleur seule. */
const PASTILLE = /^(🟢|🟡|⚪|⛔|🔴)/

export function lireJournal(texte) {
  const lignes = texte.split('\n')
  const entrees = []
  let courante = null

  for (let i = 0; i < lignes.length; i++) {
    const t = TETE.exec(lignes[i])
    if (t) {
      if (courante) entrees.push(courante)
      const s = SOUS.exec((lignes[i + 1] ?? '').trim())
      const statut = s ? s[2] : ''
      courante = {
        numero: t[1],
        titre: t[2],
        date: s ? s[1] : '',
        pastille: PASTILLE.exec(statut)?.[1] ?? '⚪',
        statut: statut.replace(PASTILLE, '').trim(),
        corps: [],
      }
      if (s) i += 1
      continue
    }
    if (courante && lignes[i].trim() === '---') { entrees.push(courante); courante = null; continue }
    if (courante) courante.corps.push(lignes[i])
  }
  if (courante) entrees.push(courante)

  return entrees.map((e) => ({
    numero: e.numero,
    titre: e.titre,
    date: e.date,
    pastille: e.pastille,
    statut: e.statut,
    /* Le journal est écrit en markdown ; l'écran ne rend que du texte, parce
       qu'aucun composant du registre ne produit du balisage à partir d'une
       chaîne — et qu'un composant qui le ferait serait une porte ouverte hors
       du système (R1.6). Les marqueurs d'emphase sont donc RETIRÉS, pas rendus.
       CE QUE CELA COÛTE, ET C'EST ÉCRIT : l'emphase que l'Auteur a mise dans
       une entrée ne se voit pas sur É6. Le texte est entier, son relief ne
       l'est pas. Montrer les astérisques aurait été montrer le fichier au lieu
       du texte ; les interpréter demandait un composant que la doctrine
       interdit. La perte est déclarée plutôt que maquillée. */
    corps: e.corps.join('\n').trim().replace(/\*\*/g, '').replace(/`/g, ''),
  }))
}

export function produire() {
  if (!fs.existsSync(SOURCE)) return { erreur: 'journal.md est introuvable' }
  const entrees = lireJournal(fs.readFileSync(SOURCE, 'utf8'))
  /* Un journal sans entrée lisible n'est pas un journal vide : c'est un journal
     qu'on n'a pas su lire, et le dire est plus utile que montrer le vide. */
  if (entrees.length === 0) return { erreur: "aucune entrée lisible dans journal.md — la forme des entrées a changé" }
  return { donnees: entrees }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = produire()
  if (r.erreur) { console.error('🔴 REFUS DE STATUER —', r.erreur); process.exit(1) }
  console.log(`journal lu — ${String(r.donnees.length)} entrées`)
  for (const e of r.donnees)
    console.log(`  ${e.pastille} ${e.numero} · ${e.date} · ${e.titre.slice(0, 60)}… (${String(e.corps.length)} car.)`)
}
