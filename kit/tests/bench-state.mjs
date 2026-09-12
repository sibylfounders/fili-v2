/* L'ÉTAT DU BANC — lu, jamais déclaré.
 *
 * Le 1er septembre 2026, quatre pages portaient un 🟢 sur la carte pendant que
 * le banc était rouge depuis cinq jours. Personne n'avait menti : les pages
 * avaient bougé, la carte avait été tenue à jour à la main, et l'instrument qui
 * verrouille n'avait pas été relancé. Le vert était devenu décoratif.
 *
 * Cette pièce répond à une seule question, par page, sans jugement :
 *
 *     la page a-t-elle bougé APRÈS la dernière fois que son épreuve est passée
 *     au vert ?
 *
 * Si oui, le vert de la carte ne veut plus rien dire, et elle le rabat à 🟡.
 * Elle ne fait JAMAIS l'inverse : reverrouiller une page est une décision
 * d'Auteur qui s'écrit au journal (garde-fou 2). Un instrument peut retirer une
 * confiance ; il ne peut pas l'accorder.
 *
 * Elle ne lance pas le banc et n'ouvre aucun navigateur : quelques appels à git,
 * une fraction de seconde. C'est ce qui lui permet de tourner à chaque
 * enregistrement sans jamais peser.
 *
 *   node kit/tests/bench-state.mjs            → dit l'état, ne touche à rien
 *   node kit/tests/bench-state.mjs --ecrire   → dit l'état ET corrige la carte
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const CARD = path.join(ROOT, 'docs', 'system-map.md')
const RUN = path.join(ROOT, 'kit', 'tests', 'last-run.json')

/* Les six pages qui ont une épreuve (Composition et Mouvement depuis le
   7 septembre 2026). `/` n'en a pas : cette pièce ne parle jamais d'elle — son cas est
   écrit sur la carte à la main, et c'est une dette dite, pas un vert qui ment. */
export const PAGES = ['rythme', 'typo', 'arrondis', 'couleur', 'composition', 'mouvement']
const WORD = { 5: 'cinq', 6: 'six', 7: 'seven' }

/* Le socle : ce qui, en bougeant, fait bouger toutes les pages à la fois. */
const FOUNDATION = [
  'kit/app/kit.css',
  'kit/app/app.css',
  'kit/app/demo.css',
  'kit/app/tokens.css',
  'kit/app/preview.tsx',
  'kit/app/layout.tsx',
  'kit/derivation.mjs',
]

const git = (args) => {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim() }
  catch { return '' }
}

/* La dernière écriture d'un ensemble de chemins : le plus récent entre le
   dernier enregistrement qui les touche et une modification encore en cours —
   un fichier ouvert et non enregistré compte comme « écrit à l'instant ». */
function lastOneWriting(paths) {
  let max = 0
  for (const c of paths) {
    const iso = git(['log', '-1', '--format=%cI', '--', c])
    if (iso) max = Math.max(max, Date.parse(iso))
    const dirty = git(['status', '--porcelain', '--', c])
    if (!dirty) continue
    for (const line of dirty.split('\n')) {
      /* « M  chemin », « ?? chemin », « R  ancien -> nouveau » : on retire le code
         d'état, puis on garde le chemin d'arrivée. */
      const relative = line.trim().replace(/^\S+\s+/, '').replace(/^"|"$/g, '').split(' -> ').pop().trim()
      if (!relative) continue
      try { max = Math.max(max, fs.statSync(path.join(ROOT, relative)).mtimeMs) } catch { /* effacé */ }
    }
  }
  return max
}

const day = (t) => {
  if (!t) return '—'
  const d = new Date(t)
  const dayofmonth = d.getDate() === 1 ? '1er' : String(d.getDate())
  return `${dayofmonth} ${d.toLocaleDateString('fr-FR', { month: 'long' })}`
}

export function state() {
  const run = fs.existsSync(RUN) ? JSON.parse(fs.readFileSync(RUN, 'utf8')) : null
  return PAGES.map((page) => {
    const movesPage = lastOneWriting([`kit/app/${page}`, ...FOUNDATION])
    const movesTest = lastOneWriting([`kit/tests/${page}.test.mjs`, 'kit/tests/bench.mjs'])
    const moves = Math.max(movesPage, movesTest)
    const passage = run?.pages?.[page] ?? null

    if (!passage) {
      /* Aucune course enregistrée : on ne sait pas si le banc est passé. On ne
         peut comparer que les dates d'écriture — c'est moins qu'une mesure, et
         c'est dit comme tel. */
      /* Sans course enregistrée, on compare des JOURS, pas des minutes : dans une
         même journée de travail l'ordre des écritures ne dit rien, et une alarme
         qui crie pour dix minutes d'écart n'est plus écoutée. Le décrochage qu'on
         cherche se compte en jours — celui de fin août en a duré cinq. */
      const dateSingleOne = (t) => new Date(t).toISOString().slice(0, 10)
      const inDelay = movesPage > movesTest && dateSingleOne(movesPage) > dateSingleOne(movesTest)
      return {
        page, measure: false, healthy: !inDelay, moves,
        reason: inDelay
          ? `la page a été retouchée le ${day(movesPage)}, son épreuve date du ${day(movesTest)}`
          : `aucune course enregistrée — l'épreuve est au moins aussi récente que la page`,
      }
    }
    const green = passage.green ? Date.parse(passage.date) : 0
    if (!passage.green) return { page, measure: true, healthy: false, moves, reason: `le banc l'a refusée le ${day(Date.parse(passage.date))}` }
    if (green < moves) return { page, measure: true, healthy: false, moves, reason: `passée au vert le ${day(green)}, retouchée depuis, le ${day(moves)}` }
    return { page, measure: true, healthy: true, moves, reason: `mesurée verte le ${day(green)}, rien n'a bougé depuis` }
  })
}

const BRAND = /\*\*Rabattue par le banc[^*]*\*\*\s*/g

/* Corrige la carte : uniquement la pastille de la page et la première phrase de
   sa dernière colonne. Idempotent, et incapable de faire passer une page au
   vert. */
export function writeThereCard(lines) {
  if (!fs.existsSync(CARD)) return []
  const before = fs.readFileSync(CARD, 'utf8')
  let after = before
  const folded = []

  for (const l of lines) {
    const reason = new RegExp(`^(\\|\\s*\`/${l.page}\`[^|]*\\|\\s*)(🟢|🟡)(\\s*\\|)(.*)$`, 'm')
    const found = reason.exec(after)
    if (!found) continue
    const cells = found[4].split('|')
    const lastOne = cells.length - 2 // la dernière colonne avant le | final
    if (lastOne < 0) continue

    let text = cells[lastOne].replace(BRAND, '').trimStart()
    let dot = found[2]

    if (!l.healthy) {
      if (dot === '🟢') folded.push(l.page)
      dot = '🟡'
      text = `**Rabattue par le banc : ${l.reason}.** ` + text
    } else if (dot === '🟡') {
      /* Une page saine que la carte dit 🟡 : ce n'est pas à un instrument de la
         reverrouiller. On retire seulement la phrase qu'on avait posée. */
      text = text.trimStart()
    }
    cells[lastOne] = ' ' + text.trim() + ' '
    after = after.replace(reason, `$1${dot}$3${cells.join('|')}`)
  }

  if (after !== before) fs.writeFileSync(CARD, after)
  return folded
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const lines = state()
  const sick = lines.filter((l) => !l.healthy)

  console.log(`\nÉTAT DU BANC — ${WORD[PAGES.length] ?? PAGES.length} pages\n`)
  for (const l of lines) console.log(`  ${l.healthy ? '🟢' : '🟡'} /${l.page} — ${l.reason}`)

  if (process.argv.includes('--write')) {
    const folded = writeThereCard(lines)
    if (folded.length) console.log(`\n  ✎ carte corrigée : ${folded.map((p) => '/' + p).join(', ')} — le vert ne tenait plus.`)
  } else if (sick.length) {
    console.log('\n  (la carte n\'a pas été touchée : quelqu\'un d\'autre y écrit en ce moment)')
  }

  if (sick.length) console.log(`\n  ${sick.length} page(s) à repasser au banc : npm run test:pages\n`)
  else console.log(`\n  🟢 les ${WORD[PAGES.length] ?? PAGES.length} pages disent vrai.\n`)
}
