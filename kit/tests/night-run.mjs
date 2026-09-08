/* LA COURSE DE NUIT — le banc se lance tout seul.
 *
 * Le banc de crash-tests ne tombait pas en panne : on oubliait de le lancer.
 * Entre le 26 août et le 1er septembre 2026, les pages ont bougé quatre fois et
 * l'instrument est resté au repos ; quand on l'a relancé, douze épreuves étaient
 * rouges et quatre pages portaient un vert qui ne voulait plus rien dire.
 *
 * Cette pièce retire le geste. Une fois par nuit : le site est construit, les
 * quatre épreuves passent, le verdict s'écrit en français dans
 * docs/banc-du-jour.md, et la carte du système est remise au vrai.
 *
 * Elle ne corrige rien et ne juge rien. Elle mesure, elle écrit, elle se tait.
 *
 *   node kit/tests/night-run.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { PAGES, state, writeThereCard } from './bench-state.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const KIT = path.join(ROOT, 'kit')
const JOURNAL_RAW = path.join(KIT, 'tests', 'last-run.log')
const RUN = path.join(KIT, 'tests', 'last-run.json')
const BULLETIN = path.join(ROOT, 'docs', 'bench-of-day.md')

const env = { ...process.env, KIT_DIST: '.next-tests', CI: '1' }
let raw = ''
const note = (heading, text) => { raw += `\n\n══ ${heading} ══\n${text}` }

function launch(heading, command, args) {
  const r = spawnSync(command, args, { cwd: KIT, env, encoding: 'utf8' })
  note(heading, (r.stdout ?? '') + (r.stderr ?? '') + (r.error ? String(r.error) : ''))
  return { ok: r.status === 0, output: (r.stdout ?? '') + (r.stderr ?? '') }
}

/* Les noms des épreuves tombées, tels que le banc les prononce. */
const fallen = (output) =>
  output.split('\n').filter((l) => /^not ok /.test(l.trim())).map((l) => l.trim().replace(/^not ok \d+\s*-?\s*/, ''))

const start = new Date()

/* 1 · Le moteur d'abord : cinq secondes, aucune dépendance. S'il est rouge,
      les pages n'ont plus de référence à laquelle se comparer. */
const engine = launch('engine', 'npm', ['test', '--silent'])

/* 2 · Le site construit à part, une seule fois pour toutes les pages. */
const construction = launch('construction', 'npm', ['run', 'build', '--silent'])

/* 3 · Chaque page sur son épreuve, séparément : une page rouge n'emporte pas
      les autres dans son verdict.

   Et si le site n'a pas pu être construit, RIEN n'est mesuré : on garde alors
   la dernière mesure connue au lieu d'inventer un refus. Une panne de la nuit
   n'est pas une faute de la page — la faire passer pour telle obligerait à
   reverrouiller toutes les pages à la main pour un incident qui ne les concerne
   pas, et l'alarme cesserait d'être crue. */
const previous = fs.existsSync(RUN) ? JSON.parse(fs.readFileSync(RUN, 'utf8')) : {}
const pages = { ...(previous.pages ?? {}) }
for (const page of PAGES) {
  if (!construction.ok) continue
  const r = launch(`épreuve ${page}`, 'node', ['--test', `tests/${page}.test.mjs`])
  pages[page] = { green: r.ok, date: new Date().toISOString(), fallen: r.ok ? [] : fallen(r.output) }
}

fs.writeFileSync(RUN, JSON.stringify({
  $comment: 'Écrit par kit/tests/night-run.mjs à chaque course. Le détail brut est dans last-run.log.',
  date: start.toISOString(),
  measured: construction.ok,
  engine: engine.ok,
  construction: construction.ok,
  pages,
}, null, 2) + '\n')
fs.writeFileSync(JOURNAL_RAW, raw.trim() + '\n')

/* 4 · La carte remise au vrai — jamais dans le sens du vert. */
const lines = state()
const folded = writeThereCard(lines)

/* 5 · Le bulletin, en français, pour être lu en dix secondes au réveil. */
const reds = construction.ok ? PAGES.filter((p) => !pages[p]?.green) : []
const when = start.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
const bulletin = [
  '# Le banc — dernière course',
  '',
  `*${when}. Écrit par la course de nuit ; ce fichier se réécrit à chaque passage.*`,
  '',
  !construction.ok
    ? '## 🔴 Le site n\'a pas pu être construit — rien n\'a été mesuré cette nuit.\n\nCe n\'est pas un verdict sur les pages : l\'état ci-dessous reste celui de la dernière course qui a abouti. À regarder quand même, une panne qui dure aveugle le banc.'
    : reds.length === 0
      ? `## 🟢 Les ${({ 5: 'cinq', 6: 'six' })[PAGES.length] ?? PAGES.length} pages sont vertes.`
      : `## 🔴 ${reds.length} page(s) refusée(s) : ${reds.map((p) => '`/' + p + '`').join(', ')}`,
  '',
  `Le moteur : ${engine.ok ? '🟢 vert' : '🔴 rouge — c\'est lui qu\'il faut regarder d\'abord'}.`,
  '',
  '| Page | Cette nuit | Ce que dit la carte |',
  '|---|---|---|',
  ...PAGES.map((p) => {
    const l = lines.find((x) => x.page === p)
    const thisNight = !construction.ok ? 'non mesurée' : pages[p]?.green ? '🟢' : '🔴'
    return `| \`/${p}\` | ${thisNight} | ${l ? l.reason : '—'} |`
  }),
  '',
  ...(reds.length
    ? ['## Ce qui est tombé', '', ...reds.flatMap((p) => [
        `**\`/${p}\`**`, '',
        ...(pages[p]?.fallen?.length ? pages[p].fallen.map((t) => `- ${t}`) : ['- voir le détail brut']),
        '',
      ])]
    : []),
  ...(folded.length
    ? [`> La carte a été corrigée : ${folded.map((p) => '`/' + p + '`').join(', ')} — leur vert ne tenait plus.`, '']
    : []),
  '---',
  '',
  'Le détail brut (sortie du banc, ligne à ligne) : `kit/tests/last-run.log`.',
  'Relancer à la main : `cd kit && npm run test:pages`.',
  '',
].join('\n')

fs.mkdirSync(path.dirname(BULLETIN), { recursive: true })
fs.writeFileSync(BULLETIN, bulletin)

console.log(`\nCourse terminée — ${reds.length === 0 && construction.ok ? '🟢 tout est vert' : '🔴 ' + (construction.ok ? reds.length + ' page(s) refusée(s)' : 'construction impossible')}.`)
console.log(`Bulletin : docs/banc-du-jour.md\n`)
