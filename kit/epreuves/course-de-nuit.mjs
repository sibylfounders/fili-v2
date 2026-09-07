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
 *   node kit/epreuves/course-de-nuit.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { PAGES, etat, ecrireLaCarte } from './etat-du-banc.mjs'

const RACINE = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const KIT = path.join(RACINE, 'kit')
const JOURNAL_BRUT = path.join(KIT, 'epreuves', 'derniere-course.log')
const COURSE = path.join(KIT, 'epreuves', 'derniere-course.json')
const BULLETIN = path.join(RACINE, 'docs', 'banc-du-jour.md')

const env = { ...process.env, KIT_DIST: '.next-epreuves', CI: '1' }
let brut = ''
const noter = (titre, texte) => { brut += `\n\n══ ${titre} ══\n${texte}` }

function lancer(titre, commande, args) {
  const r = spawnSync(commande, args, { cwd: KIT, env, encoding: 'utf8' })
  noter(titre, (r.stdout ?? '') + (r.stderr ?? '') + (r.error ? String(r.error) : ''))
  return { ok: r.status === 0, sortie: (r.stdout ?? '') + (r.stderr ?? '') }
}

/* Les noms des épreuves tombées, tels que le banc les prononce. */
const tombees = (sortie) =>
  sortie.split('\n').filter((l) => /^not ok /.test(l.trim())).map((l) => l.trim().replace(/^not ok \d+\s*-?\s*/, ''))

const debut = new Date()

/* 1 · Le moteur d'abord : cinq secondes, aucune dépendance. S'il est rouge,
      les pages n'ont plus de référence à laquelle se comparer. */
const moteur = lancer('moteur', 'npm', ['test', '--silent'])

/* 2 · Le site construit à part, une seule fois pour toutes les pages. */
const construction = lancer('construction', 'npm', ['run', 'build', '--silent'])

/* 3 · Chaque page sur son épreuve, séparément : une page rouge n'emporte pas
      les autres dans son verdict.

   Et si le site n'a pas pu être construit, RIEN n'est mesuré : on garde alors
   la dernière mesure connue au lieu d'inventer un refus. Une panne de la nuit
   n'est pas une faute de la page — la faire passer pour telle obligerait à
   reverrouiller toutes les pages à la main pour un incident qui ne les concerne
   pas, et l'alarme cesserait d'être crue. */
const precedent = fs.existsSync(COURSE) ? JSON.parse(fs.readFileSync(COURSE, 'utf8')) : {}
const pages = { ...(precedent.pages ?? {}) }
for (const page of PAGES) {
  if (!construction.ok) continue
  const r = lancer(`épreuve ${page}`, 'node', ['--test', `epreuves/${page}.test.mjs`])
  pages[page] = { vert: r.ok, date: new Date().toISOString(), tombees: r.ok ? [] : tombees(r.sortie) }
}

fs.writeFileSync(COURSE, JSON.stringify({
  $commentaire: 'Écrit par kit/epreuves/course-de-nuit.mjs à chaque course. Le détail brut est dans derniere-course.log.',
  date: debut.toISOString(),
  mesuree: construction.ok,
  moteur: moteur.ok,
  construction: construction.ok,
  pages,
}, null, 2) + '\n')
fs.writeFileSync(JOURNAL_BRUT, brut.trim() + '\n')

/* 4 · La carte remise au vrai — jamais dans le sens du vert. */
const lignes = etat()
const rabattues = ecrireLaCarte(lignes)

/* 5 · Le bulletin, en français, pour être lu en dix secondes au réveil. */
const rouges = construction.ok ? PAGES.filter((p) => !pages[p]?.vert) : []
const quand = debut.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
const bulletin = [
  '# Le banc — dernière course',
  '',
  `*${quand}. Écrit par la course de nuit ; ce fichier se réécrit à chaque passage.*`,
  '',
  !construction.ok
    ? '## 🔴 Le site n\'a pas pu être construit — rien n\'a été mesuré cette nuit.\n\nCe n\'est pas un verdict sur les pages : l\'état ci-dessous reste celui de la dernière course qui a abouti. À regarder quand même, une panne qui dure aveugle le banc.'
    : rouges.length === 0
      ? `## 🟢 Les ${({ 5: 'cinq', 6: 'six' })[PAGES.length] ?? PAGES.length} pages sont vertes.`
      : `## 🔴 ${rouges.length} page(s) refusée(s) : ${rouges.map((p) => '`/' + p + '`').join(', ')}`,
  '',
  `Le moteur : ${moteur.ok ? '🟢 vert' : '🔴 rouge — c\'est lui qu\'il faut regarder d\'abord'}.`,
  '',
  '| Page | Cette nuit | Ce que dit la carte |',
  '|---|---|---|',
  ...PAGES.map((p) => {
    const l = lignes.find((x) => x.page === p)
    const cetteNuit = !construction.ok ? 'non mesurée' : pages[p]?.vert ? '🟢' : '🔴'
    return `| \`/${p}\` | ${cetteNuit} | ${l ? l.raison : '—'} |`
  }),
  '',
  ...(rouges.length
    ? ['## Ce qui est tombé', '', ...rouges.flatMap((p) => [
        `**\`/${p}\`**`, '',
        ...(pages[p]?.tombees?.length ? pages[p].tombees.map((t) => `- ${t}`) : ['- voir le détail brut']),
        '',
      ])]
    : []),
  ...(rabattues.length
    ? [`> La carte a été corrigée : ${rabattues.map((p) => '`/' + p + '`').join(', ')} — leur vert ne tenait plus.`, '']
    : []),
  '---',
  '',
  'Le détail brut (sortie du banc, ligne à ligne) : `kit/epreuves/derniere-course.log`.',
  'Relancer à la main : `cd kit && npm run test:pages`.',
  '',
].join('\n')

fs.mkdirSync(path.dirname(BULLETIN), { recursive: true })
fs.writeFileSync(BULLETIN, bulletin)

console.log(`\nCourse terminée — ${rouges.length === 0 && construction.ok ? '🟢 tout est vert' : '🔴 ' + (construction.ok ? rouges.length + ' page(s) refusée(s)' : 'construction impossible')}.`)
console.log(`Bulletin : docs/banc-du-jour.md\n`)
