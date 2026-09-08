/* Produit l'état que Fili affiche, depuis le Gardien lui-même.
   Fili ne fabrique aucun chiffre : il montre ce que le Gardien a mesuré. Si
   le contrôle d'intégrité refuse de statuer, l'état produit porte ce refus —
   il ne le remplace pas par un zéro. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runBattery, ROOT } from '../crash-test/battery.mjs'
import { verifyIntegrity } from '../crash-test/integrity.mjs'
import { produce as produceCard } from '../map/produce.mjs'
import { produce as produceJournal } from '../journal/read.mjs'

const OUTPUT = path.join(ROOT, 'public/state.json')
/* La date du jour est passée par argument ou lue à l'exécution : un état
   produit deux fois le même jour doit être identique, sinon le témoin de É7
   montrerait un écart qui n'est que l'heure. */
const DATE_DAY = process.argv.includes('--date')
  ? process.argv[process.argv.indexOf('--date') + 1]
  : new Date().toISOString().slice(0, 10)

const integrity = await verifyIntegrity(ROOT)

let state
if (integrity.lacks.length > 0) {
  const reason = integrity.lacks.join(' · ')
  state = Object.fromEntries(
    ['/integrite', '/batterie', '/progression', '/constats', '/runs', '/temoins', '/faceAFace', '/verdicts', '/carte', '/journal', '/brouillons', '/acte'].map((c) => [
      c, { data: null, loading: false, error: reason }
    ])
  )
} else {
  const r = await runBattery()
  const trapped = r.filter((x) => x.expected === 'BLOQUE')
  const compliant = r.filter((x) => x.expected === 'PASSE')
  const gaps = r.filter((x) => !x.compliant)
  /* Le compte des mutations ne se déduit pas du manifeste : il se mesure en
     jouant les sabotages. Tant qu'un run de mutation n'a pas été versé, Fili
     dit qu'il ne l'a pas mesuré — il ne montre pas un nombre qu'il a inventé.
     C'est la leçon de #020 : un dispositif qui surestime ses propres garanties
     est le pire des dispositifs. */
  const pathMut = path.join(ROOT, 'public/mutations.json')
  const mutations = fs.existsSync(pathMut)
    ? JSON.parse(fs.readFileSync(pathMut, 'utf8'))
    : null

  /* Les constats : une ligne par écart, l'assertion et son contrat d'abord. */
  const findings = gaps.map((x) => ({
    id: x.id,
    assertion: x.id,
    contract: x.what,
    occurrences: 1,
    files: 1
  }))

  state = {
    '/integrite': { data: { total: integrity.total, reaches: integrity.total }, loading: false, error: null },
    '/batterie': { data: { trapped: trapped.length, compliant: compliant.length, mutations, gaps: gaps.length }, loading: false, error: null },
    '/progression': { data: { made: r.length, total: r.length }, loading: false, error: null },
    '/constats': { data: findings, loading: false, error: null },
    '/runs': { data: [], loading: false, error: null }
  }
}

/* ── La famille des témoins, lue sur le disque et non déclarée ───────────── */
/* Fili ne tient pas une liste de ses témoins : il regarde ce que la chaîne de
   rendu a réellement produit. Une famille déclarée à la main dériverait du
   dossier sans que rien ne le dise, et É3 montrerait une génération qui
   n'existe plus. */
const NAMES = {
  'e1-verdict': 'É1 · Le verdict',
  'e2-finding': 'É2 · Le constat',
  'e3-family': 'É3 · La famille des témoins',
  'e4-face-a-face': 'É4 · Le face-à-face'
}
const FOLDER = path.join(ROOT, 'witnesses')
const MIRROR = path.join(ROOT, 'public/witnesses')

const folders = (p) =>
  fs.existsSync(p)
    ? fs.readdirSync(p, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
        .map((e) => e.name)
    : []

const families = folders(FOLDER)
  .filter((key) => key !== 'board')
  .sort()
  .map((key) => {
    const generations = folders(path.join(FOLDER, key))
      .sort()
      .reverse()
      .map((date) => {
        const files = fs.readdirSync(path.join(FOLDER, key, date)).filter((f) => f.endsWith('.html'))
        return { date, states: files.length, unreadable: files.length === 0 }
      })
    const current = generations[0] ?? null
    return {
      template: key,
      name: NAMES[key] ?? key,
      current,
      /* L'aperçu pointe l'état NOMINAL : c'est celui qui porte le parti visuel.
         S'il n'a pas été rendu, on ne montre rien plutôt que n'importe lequel. */
      preview:
        current && fs.existsSync(path.join(FOLDER, key, current.date, 'nominal.html'))
          ? `./witnesses/${key}/${current.date}/nominal.html`
          : null,
      history: generations.slice(1)
    }
  })

/* Le face-à-face s'ouvre sur le premier gabarit qui a de quoi être jugé. Le
   choix du gabarit appartiendra au routage, quand les sept existeront. */
const judgeable = families.find((f) => f.preview !== null) ?? null
const faceAFace = judgeable === null ? null : {
  template: judgeable.template,
  name: judgeable.name,
  current: {
    date: judgeable.current.date,
    source: judgeable.preview,
    states: judgeable.current.states
  },
  previous: judgeable.history[0]
    ? {
        date: judgeable.history[0].date,
        source: `./witnesses/${judgeable.template}/${judgeable.history[0].date}/nominal.html`,
        states: judgeable.history[0].states
      }
    : null,
  battery: integrity.lacks.length === 0 ? 'intégrité entière au rendu' : 'REFUS DE STATUER'
}

/* Le miroir servi. Les témoins vivent dans temoins/ ; le serveur ne sert que
   public/. La copie est un artefact de service — elle n'est pas versionnée, et
   elle se refait à chaque production d'état. Deux lignées de témoins seraient
   une lignée de trop. */
/* Le miroir se recouvre fichier par fichier, il ne se vide pas et il ne
   remplace rien en bloc. Purger d'abord reviendrait à supprimer des témoins
   pour les réécrire — un geste destructeur sur ce qui sert de référence, pour
   un gain nul : une génération ne disparaît jamais du dossier source, elle
   s'y ajoute. Une écriture qui tronque suffit, et elle ne peut pas laisser le
   miroir dans un état intermédiaire où un témoin aurait disparu. */
const recopy = (of, to) => {
  fs.mkdirSync(to, { recursive: true })
  for (const e of fs.readdirSync(of, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue
    const source = path.join(of, e.name)
    const target = path.join(to, e.name)
    if (e.isDirectory()) recopy(source, target)
    else fs.writeFileSync(target, fs.readFileSync(source))
  }
}
if (fs.existsSync(FOLDER)) recopy(FOLDER, MIRROR)

/* Si le juge n'est pas entier, les témoins ne se montrent pas davantage que
   le verdict : l'état produit porte le refus jusqu'au bout. Montrer une
   famille lisible sous un refus de statuer laisserait croire qu'on peut juger
   pendant que le juge est amputé. */
if (integrity.lacks.length === 0) {
  state['/temoins'] = { data: families, loading: false, error: null }
  state['/faceAFace'] = { data: faceAFace, loading: false, error: null }
  /* Aucun verdict n'a encore été déposé, et Fili ne l'invente pas. */
  state['/verdicts'] = { data: [], loading: false, error: null }

  /* La carte et le journal viennent de leurs documents, par un lecteur qui
     REFUSE DE STATUER plutôt que de deviner. Un analyseur tolérant montrerait
     une carte vide au premier titre reformulé, et personne ne saurait que
     l'écran ment. L'erreur remonte donc telle quelle jusqu'à l'écran. */
  const card = produceCard()
  state['/carte'] = card.error
    ? { data: null, loading: false, error: card.error }
    : { data: card.data, loading: false, error: null }

  const journal = produceJournal()
  state['/journal'] = journal.error
    ? { data: null, loading: false, error: journal.error }
    : { data: journal.data, loading: false, error: null }

  /* É7 déposera ses brouillons ici. Aucun n'existe, et Fili ne l'invente pas. */
  state['/brouillons'] = { data: [], loading: false, error: null }

  /* ── L'acte : ce que É7 a besoin de savoir pour composer une entrée ────── */
  /* Le numéro se CALCULE depuis le journal. Le saisir à la main est la façon
     la plus simple d'écrire deux fois le même, et un journal à numéros
     dupliqués ne se relit plus. */
  const last = journal.error ? null : journal.data[0]
  const number = last
    ? `#${String(Number(last.number.slice(1)) + 1).padStart(3, '0')}`
    : null

  /* Le garde-fou de K2 §10.3, rendu mécanique : le passage au 🟢 est refusé
     tant que la batterie et le contrôle d'intégrité ne sont pas au vert. Un
     verrou ne se déclare pas, il se mérite — et c'est l'état lu en P1 qui le
     dit, pas une case à cocher. */
  const gaps = state['/batterie'].data?.gaps ?? null
  const lockGreen = integrity.lacks.length === 0 && gaps === 0
  const reasonLock = lockGreen
    ? null
    : integrity.lacks.length > 0
      ? `le contrôle d'intégrité refuse de statuer : ${integrity.lacks.join(' · ')}`
      : `la batterie porte ${String(gaps ?? 0)} écart(s)`

  /* Les cibles déplaçables sont les lignes de la carte, telles qu'elle les
     déclare. On ne déplace pas le statut d'une ligne qui n'existe pas. */
  const SECTIONS = [
    ['milestones', 'Les jalons'], ['contracts', 'Les contrats'], ['templates', 'Les gabarits'],
    ['instrument', "L'instrument"], ['debts', 'Les dettes'],
  ]
  const targets = card.error ? [] : SECTIONS.flatMap(([key, group]) =>
    (card.data[key] ?? []).map((l) => ({
      id: `${key}/${l.name}`, group, name: l.name, status: l.status,
    })))

  state['/acte'] = (number === null || card.error)
    ? { data: null, loading: false, error: "la composition est impossible : le journal ou la carte est illisible, et un numéro déduit d'une lecture partielle serait un faux" }
    : { data: { number, date: DATE_DAY, lockGreen, reasonLock, targets }, loading: false, error: null }

}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, JSON.stringify(state, null, 2))
console.log('état produit →', path.relative(ROOT, OUTPUT))
console.log('  intégrité :', integrity.lacks.length === 0 ? `${integrity.total}/${integrity.total}` : 'REFUS DE STATUER')
