/* LA COURSE DE NUIT — le banc se lance tout seul.
 *
 * Le banc de crash-tests ne tombait pas en panne : on oubliait de le lancer.
 * Entre le 26 août et le 1er septembre 2026, les pages ont bougé quatre fois et
 * l'instrument est resté au repos ; quand on l'a relancé, douze épreuves étaient
 * rouges et quatre pages portaient un vert qui ne voulait plus rien dire.
 *
 * Cette pièce retire le geste. Une fois par nuit : le site est construit, les
 * épreuves passent, le verdict s'écrit en français dans docs/banc-du-jour.md,
 * et la carte du système est remise au vrai.
 *
 * Elle ne corrige rien et ne juge rien. Elle mesure, elle écrit, elle se tait.
 *
 * Ce qu'elle lance, depuis le 12 septembre 2026 (`#144`) — elle n'en lançait que
 * la moitié, et quatre pages sur six pointaient vers un fichier qui n'existait
 * pas, si bien que la course annonçait un verdict qu'elle n'avait pas mesuré :
 *
 *   1 · le moteur (derivation.test.mjs) — cinq secondes, aucune dépendance ;
 *   2 · la preuve de l'épreuve d'un fichier (verify.mjs --prove) — AVANT tout le
 *       reste : un instrument qui ne peut plus échouer rendrait tous les verts
 *       suivants décoratifs, et c'est exactement ce qui est arrivé le 11 ;
 *   3 · le site construit une fois, pour tout ce qui suit ;
 *   4 · chaque page sur son épreuve, séparément, par son nom de fichier (TEST_OF) ;
 *   5 · les épreuves qui traversent le site (postures, weight, frontiere) ;
 *   6 · le relevé du plomb, sur le site debout.
 *
 *   node kit/tests/night-run.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { PAGES, TEST_OF, CROSSING, state, writeThereCard } from './bench-state.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const KIT = path.join(ROOT, 'kit')
const JOURNAL_RAW = path.join(KIT, 'tests', 'last-run.log')
const RUN = path.join(KIT, 'tests', 'last-run.json')
/* le bulletin s'écrit où la console dit qu'il s'écrit, et où la carte le cherche :
   un renommage l'avait envoyé dans bench-of-day.md pendant que tout le reste
   annonçait banc-du-jour.md (12 septembre 2026) */
const BULLETIN = path.join(ROOT, 'docs', 'banc-du-jour.md')

const env = { ...process.env, KIT_DIST: '.next-tests', CI: '1' }
let raw = ''
const note = (heading, text) => { raw += `\n\n══ ${heading} ══\n${text}` }

function launch(heading, command, args) {
  const r = spawnSync(command, args, { cwd: KIT, env, encoding: 'utf8' })
  note(heading, (r.stdout ?? '') + (r.stderr ?? '') + (r.error ? String(r.error) : ''))
  return { ok: r.status === 0, output: (r.stdout ?? '') + (r.stderr ?? '') }
}

/* Les noms des épreuves tombées, tels que le banc les prononce. On demande le TAP
   explicitement (--test-reporter=tap) : sans lui, node choisit son format selon qu'il
   parle à un terminal ou à un tuyau, et ici il parlait à un tuyau — le bulletin ne
   savait plus nommer ce qui était tombé et renvoyait chaque fois au log brut
   (12 septembre 2026). Un bulletin qu'il faut quitter pour savoir n'est pas un bulletin. */
const TAP = ['--test', '--test-reporter=tap']
const fallen = (output) =>
  output.split('\n').filter((l) => /^not ok /.test(l.trim())).map((l) => l.trim().replace(/^not ok \d+\s*-?\s*/, ''))

const start = new Date()

/* 1 · Le moteur d'abord : cinq secondes, aucune dépendance. S'il est rouge,
      les pages n'ont plus de référence à laquelle se comparer. */
const engine = launch('engine', 'npm', ['test', '--silent'])

/* 2 · La preuve avant la mesure : l'épreuve d'un fichier rejoue ses fixtures piégées
      et leurs mutations. Si elle ne peut plus échouer, elle ne prouve plus rien, et
      un vert qui la suivrait ne vaudrait rien non plus. Elle n'a besoin ni du site
      ni d'une construction : elle passe en premier, et pour quelques secondes. */
const proof = launch('preuve', 'node', ['tests/verify.mjs', '--prove'])

/* 3 · Le site construit à part, une seule fois pour toutes les pages. */
const construction = launch('construction', 'npm', ['run', 'build', '--silent'])

/* 4 · Chaque page sur son épreuve, séparément : une page rouge n'emporte pas
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
  const r = launch(`épreuve ${page}`, 'node', [...TAP, `tests/${TEST_OF[page]}.test.mjs`])
  pages[page] = { green: r.ok, date: new Date().toISOString(), fallen: r.ok ? [] : fallen(r.output) }
}

/* 5 · Les épreuves qui ne sont d'aucune page : elles traversent le site entier
      (les postures dans la matrice N2, la graisse sur toutes les pages en deux
      thèmes, la frontière). Elles ne rabattent aucune pastille — elles n'ont pas
      de page à rabattre — mais une rouge refuse la nuit. */
const crossing = { ...(previous.crossing ?? {}) }
for (const name of CROSSING) {
  if (!construction.ok) continue
  const r = launch(`épreuve ${name}`, 'node', [...TAP, `tests/${name}.test.mjs`])
  crossing[name] = { green: r.ok, date: new Date().toISOString(), fallen: r.ok ? [] : fallen(r.output) }
}

/* 6 · Le relevé du plomb : c'est le seul qui demande le site DEBOUT, une fois,
      pour les six Fondations. On le monte ici et on le referme derrière soi. */
let plomb = previous.plomb ?? null
if (construction.ok) {
  const { openSite } = await import('./bench.mjs')
  let site = null
  try {
    site = await openSite()
    const r = launch('plomb', 'node', ['tests/plomb.mjs', '--url', site.url])
    plomb = { green: r.ok, date: new Date().toISOString() }
  } catch (e) {
    note('plomb', `le site n'a pas pu être monté pour le relevé — ${e.message}`)
    plomb = { green: false, date: new Date().toISOString(), unmounted: true }
  } finally { site?.close() }
}

fs.writeFileSync(RUN, JSON.stringify({
  $comment: 'Écrit par kit/tests/night-run.mjs à chaque course. Le détail brut est dans last-run.log.',
  date: start.toISOString(),
  measured: construction.ok,
  engine: engine.ok,
  proof: proof.ok,
  construction: construction.ok,
  pages,
  crossing,
  plomb,
}, null, 2) + '\n')
fs.writeFileSync(JOURNAL_RAW, raw.trim() + '\n')

/* 7 · La carte remise au vrai — jamais dans le sens du vert. */
const lines = state()
const folded = writeThereCard(lines)

/* 8 · Le bulletin, en français, pour être lu en dix secondes au réveil. */
const reds = construction.ok ? PAGES.filter((p) => !pages[p]?.green) : []
const crossReds = construction.ok ? CROSSING.filter((n) => !crossing[n]?.green) : []
const plombRed = construction.ok && plomb && !plomb.green
/* Une nuit est verte quand TOUT ce qui a été mesuré est vert : les pages, ce qui les
   traverse, le plomb, le moteur et la preuve. Ne compter que les pages, c'est écrire
   « les six pages sont vertes » au-dessus d'un instrument qui ne peut plus échouer. */
const allGreen = construction.ok && !reds.length && !crossReds.length && !plombRed && engine.ok && proof.ok
const when = start.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
const bulletin = [
  '# Le banc — dernière course',
  '',
  `*${when}. Écrit par la course de nuit ; ce fichier se réécrit à chaque passage.*`,
  '',
  !construction.ok
    ? '## 🔴 Le site n\'a pas pu être construit — rien n\'a été mesuré cette nuit.\n\nCe n\'est pas un verdict sur les pages : l\'état ci-dessous reste celui de la dernière course qui a abouti. À regarder quand même, une panne qui dure aveugle le banc.'
    : allGreen
      ? `## 🟢 Tout est vert — les ${({ 5: 'cinq', 6: 'six', 7: 'sept' })[PAGES.length] ?? PAGES.length} pages, ce qui les traverse, le plomb, le moteur et la preuve.`
      : `## 🔴 ${[
          reds.length && `${reds.length} page(s) refusée(s) : ${reds.map((p) => '`/' + p + '`').join(', ')}`,
          crossReds.length && `${crossReds.length} épreuve(s) de traverse : ${crossReds.map((n) => '`' + n + '`').join(', ')}`,
          plombRed && 'le relevé du plomb',
          !engine.ok && 'le moteur',
          !proof.ok && 'la preuve de l\'épreuve',
        ].filter(Boolean).join(' · ')}`,
  '',
  `Le moteur : ${engine.ok ? '🟢 vert' : '🔴 rouge — c\'est lui qu\'il faut regarder d\'abord'}.`,
  `La preuve de l'épreuve d'un fichier : ${proof.ok ? '🟢 elle peut toujours échouer' : '🔴 elle ne prouve plus rien — tout vert qui suit est décoratif'}.`,
  '',
  '| Page | Cette nuit | Ce que dit la carte |',
  '|---|---|---|',
  ...PAGES.map((p) => {
    const l = lines.find((x) => x.page === p)
    const thisNight = !construction.ok ? 'non mesurée' : pages[p]?.green ? '🟢' : '🔴'
    return `| \`/${p}\` | ${thisNight} | ${l ? l.reason : '—'} |`
  }),
  '',
  '| Ce qui traverse le site | Cette nuit | Ce que ça tient |',
  '|---|---|---|',
  ...CROSSING.map((n) => {
    const says = { postures: 'les postures dans la matrice des treize situations',
                   weight: 'la graisse : toute graisse rendue est un rôle, sept pages en deux thèmes',
                   frontiere: 'la frontière : deux crans entre deux textes, trois contre une scène' }[n] ?? '—'
    return `| \`${n}\` | ${!construction.ok ? 'non mesurée' : crossing[n]?.green ? '🟢' : '🔴'} | ${says} |`
  }),
  `| \`plomb\` | ${!construction.ok ? 'non mesuré' : plomb?.green ? '🟢' : '🔴'} | l'espace vu contre l'espace réglé, sur les six Fondations |`,
  '',
  ...(reds.length || crossReds.length
    ? ['## Ce qui est tombé', '', ...[...reds.map((p) => ['/' + p, pages[p]]), ...crossReds.map((n) => [n, crossing[n]])].flatMap(([name, r]) => [
        `**\`${name}\`**`, '',
        ...(r?.fallen?.length ? r.fallen.map((t) => `- ${t}`) : ['- voir le détail brut']),
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

console.log(`\nCourse terminée — ${allGreen ? '🟢 tout est vert' : '🔴 ' + (construction.ok ? [reds.length && reds.length + ' page(s)', crossReds.length && crossReds.length + ' de traverse', plombRed && 'le plomb', !engine.ok && 'le moteur', !proof.ok && 'la preuve'].filter(Boolean).join(', ') + ' à regarder' : 'construction impossible')}.`)
console.log(`Bulletin : docs/banc-du-jour.md\n`)
