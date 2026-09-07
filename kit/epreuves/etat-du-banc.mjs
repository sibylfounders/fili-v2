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
 *   node kit/epreuves/etat-du-banc.mjs            → dit l'état, ne touche à rien
 *   node kit/epreuves/etat-du-banc.mjs --ecrire   → dit l'état ET corrige la carte
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const CARTE = path.join(RACINE, 'docs', 'system-map.md')
const COURSE = path.join(RACINE, 'kit', 'epreuves', 'derniere-course.json')

/* Les six pages qui ont une épreuve (Composition et Mouvement depuis le
   7 septembre 2026). `/` n'en a pas : cette pièce ne parle jamais d'elle — son cas est
   écrit sur la carte à la main, et c'est une dette dite, pas un vert qui ment. */
export const PAGES = ['rythme', 'typo', 'arrondis', 'couleur', 'composition', 'mouvement']
const MOT = { 5: 'cinq', 6: 'six', 7: 'sept' }

/* Le socle : ce qui, en bougeant, fait bouger toutes les pages à la fois. */
const SOCLE = [
  'kit/app/globals.css',
  'kit/app/tokens.css',
  'kit/app/apercu.tsx',
  'kit/app/layout.tsx',
  'kit/derivation.mjs',
]

const git = (args) => {
  try { return execFileSync('git', args, { cwd: RACINE, encoding: 'utf8' }).trim() }
  catch { return '' }
}

/* La dernière écriture d'un ensemble de chemins : le plus récent entre le
   dernier enregistrement qui les touche et une modification encore en cours —
   un fichier ouvert et non enregistré compte comme « écrit à l'instant ». */
function derniereEcriture(chemins) {
  let max = 0
  for (const c of chemins) {
    const iso = git(['log', '-1', '--format=%cI', '--', c])
    if (iso) max = Math.max(max, Date.parse(iso))
    const sale = git(['status', '--porcelain', '--', c])
    if (!sale) continue
    for (const ligne of sale.split('\n')) {
      /* « M  chemin », « ?? chemin », « R  ancien -> nouveau » : on retire le code
         d'état, puis on garde le chemin d'arrivée. */
      const relatif = ligne.trim().replace(/^\S+\s+/, '').replace(/^"|"$/g, '').split(' -> ').pop().trim()
      if (!relatif) continue
      try { max = Math.max(max, fs.statSync(path.join(RACINE, relatif)).mtimeMs) } catch { /* effacé */ }
    }
  }
  return max
}

const jour = (t) => {
  if (!t) return '—'
  const d = new Date(t)
  const quantieme = d.getDate() === 1 ? '1er' : String(d.getDate())
  return `${quantieme} ${d.toLocaleDateString('fr-FR', { month: 'long' })}`
}

export function etat() {
  const course = fs.existsSync(COURSE) ? JSON.parse(fs.readFileSync(COURSE, 'utf8')) : null
  return PAGES.map((page) => {
    const bougePage = derniereEcriture([`kit/app/${page}`, ...SOCLE])
    const bougeEpreuve = derniereEcriture([`kit/epreuves/${page}.test.mjs`, 'kit/epreuves/banc.mjs'])
    const bouge = Math.max(bougePage, bougeEpreuve)
    const passage = course?.pages?.[page] ?? null

    if (!passage) {
      /* Aucune course enregistrée : on ne sait pas si le banc est passé. On ne
         peut comparer que les dates d'écriture — c'est moins qu'une mesure, et
         c'est dit comme tel. */
      /* Sans course enregistrée, on compare des JOURS, pas des minutes : dans une
         même journée de travail l'ordre des écritures ne dit rien, et une alarme
         qui crie pour dix minutes d'écart n'est plus écoutée. Le décrochage qu'on
         cherche se compte en jours — celui de fin août en a duré cinq. */
      const dateSeule = (t) => new Date(t).toISOString().slice(0, 10)
      const enRetard = bougePage > bougeEpreuve && dateSeule(bougePage) > dateSeule(bougeEpreuve)
      return {
        page, mesure: false, sain: !enRetard, bouge,
        raison: enRetard
          ? `la page a été retouchée le ${jour(bougePage)}, son épreuve date du ${jour(bougeEpreuve)}`
          : `aucune course enregistrée — l'épreuve est au moins aussi récente que la page`,
      }
    }
    const vert = passage.vert ? Date.parse(passage.date) : 0
    if (!passage.vert) return { page, mesure: true, sain: false, bouge, raison: `le banc l'a refusée le ${jour(Date.parse(passage.date))}` }
    if (vert < bouge) return { page, mesure: true, sain: false, bouge, raison: `passée au vert le ${jour(vert)}, retouchée depuis, le ${jour(bouge)}` }
    return { page, mesure: true, sain: true, bouge, raison: `mesurée verte le ${jour(vert)}, rien n'a bougé depuis` }
  })
}

const MARQUE = /\*\*Rabattue par le banc[^*]*\*\*\s*/g

/* Corrige la carte : uniquement la pastille de la page et la première phrase de
   sa dernière colonne. Idempotent, et incapable de faire passer une page au
   vert. */
export function ecrireLaCarte(lignes) {
  if (!fs.existsSync(CARTE)) return []
  const avant = fs.readFileSync(CARTE, 'utf8')
  let apres = avant
  const rabattues = []

  for (const l of lignes) {
    const motif = new RegExp(`^(\\|\\s*\`/${l.page}\`[^|]*\\|\\s*)(🟢|🟡)(\\s*\\|)(.*)$`, 'm')
    const trouve = motif.exec(apres)
    if (!trouve) continue
    const cellules = trouve[4].split('|')
    const derniere = cellules.length - 2 // la dernière colonne avant le | final
    if (derniere < 0) continue

    let texte = cellules[derniere].replace(MARQUE, '').trimStart()
    let pastille = trouve[2]

    if (!l.sain) {
      if (pastille === '🟢') rabattues.push(l.page)
      pastille = '🟡'
      texte = `**Rabattue par le banc : ${l.raison}.** ` + texte
    } else if (pastille === '🟡') {
      /* Une page saine que la carte dit 🟡 : ce n'est pas à un instrument de la
         reverrouiller. On retire seulement la phrase qu'on avait posée. */
      texte = texte.trimStart()
    }
    cellules[derniere] = ' ' + texte.trim() + ' '
    apres = apres.replace(motif, `$1${pastille}$3${cellules.join('|')}`)
  }

  if (apres !== avant) fs.writeFileSync(CARTE, apres)
  return rabattues
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const lignes = etat()
  const malades = lignes.filter((l) => !l.sain)

  console.log(`\nÉTAT DU BANC — ${MOT[PAGES.length] ?? PAGES.length} pages\n`)
  for (const l of lignes) console.log(`  ${l.sain ? '🟢' : '🟡'} /${l.page} — ${l.raison}`)

  if (process.argv.includes('--ecrire')) {
    const rabattues = ecrireLaCarte(lignes)
    if (rabattues.length) console.log(`\n  ✎ carte corrigée : ${rabattues.map((p) => '/' + p).join(', ')} — le vert ne tenait plus.`)
  } else if (malades.length) {
    console.log('\n  (la carte n\'a pas été touchée : quelqu\'un d\'autre y écrit en ce moment)')
  }

  if (malades.length) console.log(`\n  ${malades.length} page(s) à repasser au banc : npm run test:pages\n`)
  else console.log(`\n  🟢 les ${MOT[PAGES.length] ?? PAGES.length} pages disent vrai.\n`)
}
