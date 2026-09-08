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

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const SOURCE = path.join(ROOT, '..', 'docs', 'journal.md')

const HEAD = /^## (#\d{3}) — (.+)$/
const SUB = /^\*(\d{4}-\d{2}-\d{2}) · Statut : (.+?)\*$/

/* Le statut d'une entrée s'écrit en toutes lettres avec sa pastille. On garde
   la pastille pour l'œil et le reste pour la lecture : les deux disent la même
   chose, et supprimer l'un des deux ferait lire un état à la couleur seule. */
const DOT = /^(🟢|🟡|⚪|⛔|🔴)/

export function readJournal(text) {
  const lines = text.split('\n')
  const entries = []
  let current = null

  for (let i = 0; i < lines.length; i++) {
    const t = HEAD.exec(lines[i])
    if (t) {
      if (current) entries.push(current)
      const s = SUB.exec((lines[i + 1] ?? '').trim())
      const status = s ? s[2] : ''
      current = {
        number: t[1],
        heading: t[2],
        date: s ? s[1] : '',
        dot: DOT.exec(status)?.[1] ?? '⚪',
        status: status.replace(DOT, '').trim(),
        body: [],
      }
      if (s) i += 1
      continue
    }
    if (current && lines[i].trim() === '---') { entries.push(current); current = null; continue }
    if (current) current.body.push(lines[i])
  }
  if (current) entries.push(current)

  return entries.map((e) => ({
    number: e.number,
    heading: e.heading,
    date: e.date,
    dot: e.dot,
    status: e.status,
    /* Le journal est écrit en markdown ; l'écran ne rend que du texte, parce
       qu'aucun composant du registre ne produit du balisage à partir d'une
       chaîne — et qu'un composant qui le ferait serait une porte ouverte hors
       du système (R1.6). Les marqueurs d'emphase sont donc RETIRÉS, pas rendus.
       CE QUE CELA COÛTE, ET C'EST ÉCRIT : l'emphase que l'Auteur a mise dans
       une entrée ne se voit pas sur É6. Le texte est entier, son relief ne
       l'est pas. Montrer les astérisques aurait été montrer le fichier au lieu
       du texte ; les interpréter demandait un composant que la doctrine
       interdit. La perte est déclarée plutôt que maquillée. */
    body: e.body.join('\n').trim().replace(/\*\*/g, '').replace(/`/g, ''),
  }))
}

export function produce() {
  if (!fs.existsSync(SOURCE)) return { error: 'journal.md est introuvable' }
  const entries = readJournal(fs.readFileSync(SOURCE, 'utf8'))
  /* Un journal sans entrée lisible n'est pas un journal vide : c'est un journal
     qu'on n'a pas su lire, et le dire est plus utile que montrer le vide. */
  if (entries.length === 0) return { error: "aucune entrée lisible dans journal.md — la forme des entrées a changé" }
  return { data: entries }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = produce()
  if (r.error) { console.error('🔴 REFUS DE STATUER —', r.error); process.exit(1) }
  console.log(`journal lu — ${String(r.data.length)} entrées`)
  for (const e of r.data)
    console.log(`  ${e.dot} ${e.number} · ${e.date} · ${e.heading.slice(0, 60)}… (${String(e.body.length)} car.)`)
}
