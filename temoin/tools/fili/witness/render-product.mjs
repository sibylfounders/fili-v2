/* Le rendu des témoins du produit.
 *
 * Même chaîne que celle de #016, et c'est le point : le témoin est rendu
 * DEPUIS LE FICHIER MÊME que le Gardien a contrôlé — transpilé par le loader,
 * rendu par le runtime. Ni transposition à la main, ni capture, ni image de
 * secours. Un témoin qui viendrait d'ailleurs ne témoignerait de rien.
 *
 * Une séance regarde un témoin daté dans les états que K2 §6 déclare pour son
 * gabarit. Ce script produit donc un fichier par état déclaré, et rien d'autre :
 * un état que K2 marque « — » n'est pas exigible, et n'est pas fabriqué.
 */
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
register(pathToFileURL(path.join(ROOT, 'tools/fili/witness/loader.mjs')))

const arg = (name, defaults) => {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : defaults
}
const DATE = arg('date', new Date().toISOString().slice(0, 10))
/* Une lignée se réimprime entière, ou pas du tout : les états d'un gabarit
   doivent sortir du même geste, le même jour, depuis la même source vérifiée —
   sinon deux états du même témoin ne montrent plus tout à fait le même écran.
   Ce filtre choisit QUELLES lignées repartent ; il ne choisit jamais quels
   états d'une lignée sortent. Sans lui, on ne pouvait compléter une lignée
   qu'en réécrivant les six autres, que rien ne mettait en cause. */
const ONLY = arg('template', null)

/* ── La feuille de style du produit, produite depuis ses sources ─────────── */
const CSS = path.join(ROOT, 'temoins/.style.css')
mkdirSync(path.dirname(CSS), { recursive: true })
execFileSync('npx', ['tailwindcss', '-i', 'src/index.css', '-o', CSS, '--minify'],
  { cwd: ROOT, stdio: 'pipe' })
const style = readFileSync(CSS, 'utf8')

/* ── Les fichiers de fonte, déposés à côté des témoins ───────────────────── */
/* Une feuille de style ne peut pas porter un fichier de fonte, seulement le
   désigner. Sans ce dépôt, chaque témoin désignait un dossier absent et
   retombait en silence sur la fonte système — il montrait donc autre chose
   que le produit, ce qui est exactement ce qu'un témoin existe pour empêcher. */
const { dropFonts, bringPaths } = await import(
  pathToFileURL(path.join(ROOT, 'tools/fili/witness/fonts.mjs')).href)
console.log(`  ✅ ${String(dropFonts())} fichiers de fonte dans temoins/files/`)

const { toRender } = await import(pathToFileURL(path.join(ROOT, 'tools/fili/witness/runtime.mjs')).href)
const { installSource } = await import(pathToFileURL(path.join(ROOT, 'src/system/data/source.ts')).href)
const { installMutation } = await import(pathToFileURL(path.join(ROOT, 'src/system/data/useRequest.ts')).href)
const { resetId } = await import(pathToFileURL(path.join(ROOT, 'tools/fili/witness/react-witness.mjs')).href)
const { scenariosVerdict, scenariosFinding, scenariosFamily, scenariosFaceAFace, scenariosCard, scenariosJournal, scenariosAct } = await import(pathToFileURL(path.join(ROOT, 'tools/fili/state/scenarios.mjs')).href)

/* ── L'état réel, produit par le Gardien ─────────────────────────────────── */
const pathState = path.join(ROOT, 'public/state.json')
if (!existsSync(pathState)) throw new Error('public/state.json absent — lancez tools/fili/state/produce.mjs')
const stateReal = JSON.parse(readFileSync(pathState, 'utf8'))
const data = (c) => stateReal[c]?.data ?? null

const realVerdict = {
  integrity: data('/integrite'),
  battery: data('/batterie'),
  findings: data('/constats') ?? [],
  runs: [{ date: DATE, verdict: 'aucun écart' }]
}
/* Le constat mis sous les yeux est une assertion réelle du corpus, avec sa
   raison d'être écrite au contrat — pas un exemple inventé pour la démonstration. */
const realFinding = {
  assertion: {
    id: 'R5.1',
    contract: 'S5 · Arbitrage de lecture',
    statement: "Au moins une section de la page déclare porter ce qui compte d'abord.",
    reason:
      "Une page sans tête n'est pas un parti pris minimaliste : c'est une décision qui n'a pas été prise, et elle ne se voit sur aucune ligne — seulement sur la page, et seulement pour un œil qui sait quoi chercher. Le Gardien n'arbitre rien ; il refuse qu'on livre une page sur laquelle personne n'a tranché.",
    ruptureLiftable: false
  },
  occurrences: [
    { id: 'o1', file: 'crash-tests/pages/KO-S5-1-sans-tete.tsx', line: 9 },
    { id: 'o2', file: 'crash-tests/pages/KO-S5-5-rupture-sur-absence.tsx', line: 12 },
    { id: 'o3', file: 'crash-tests/pages/KO-S5-8-tete-imbriquee.tsx', line: 14 }
  ]
}

/* La famille et le face-à-face ne s'inventent pas non plus : ils viennent de
   l'état que le Gardien a produit en regardant le dossier des témoins. Le
   témoin de É3 montre donc les vraies générations, y compris la sienne. */
/* Un témoin est un fichier posé dans temoins/<gabarit>/<date>/. Les chemins
   que l'état porte sont ceux du produit servi (« ./temoins/… ») ; depuis le
   témoin, ils ne résolvent nulle part. On les ramène donc à la position réelle
   du fichier, sans quoi É3 et É4 témoigneraient d'un cadre vide — et c'est
   exactement le défaut qu'ils existent pour attraper. */
const relative = (c) => (typeof c === 'string' ? c.replace(/^\.\/temoins\//, '../../') : c)
const realFamily = {
  families: (data('/temoins') ?? []).map((f) => ({ ...f, preview: relative(f.preview) }))
}
/* La carte et le journal viennent de leurs documents réels, lus par les
   mêmes producteurs que ceux du produit. Le témoin de É6 montre donc le vrai
   journal — y compris l'entrée qui décrit sa propre construction. */
const realCard = { card: data('/carte') }
/* Le brouillon montré est celui que l'écran composerait : son numéro et sa date
   viennent de l'état réel, son titre est celui de la décision en cours. Un
   brouillon inventé de toutes pièces ferait témoigner l'écran d'un cas qui
   n'arrive jamais. */
const realAct = {
  act: data('/acte'),
  drafts: data('/acte')
    ? [{ number: data('/acte').number, date: data('/acte').date, heading: "É7 · L'acte est construit — le dernier gabarit de K5" }]
    : []
}
const realJournal = { entries: data('/journal') ?? [] }
const realFaceAFace = {
  face: (() => {
    const f = data('/faceAFace')
    if (f === null) return null
    return {
      ...f,
      current: { ...f.current, source: relative(f.current.source) },
      previous: f.previous ? { ...f.previous, source: relative(f.previous.source) } : null
    }
  })(),
  verdicts: [{ date: DATE, issue: 'accepted' }]
}

const TEMPLATES = [
  { key: 'e1-verdict', heading: 'É1 · Le verdict', source: 'src/pages/ScreenVerdict.tsx',
    exported: 'ScreenVerdict', scenarios: scenariosVerdict(realVerdict) },
  { key: 'e2-finding', heading: 'É2 · Le constat', source: 'src/pages/ScreenFinding.tsx',
    exported: 'ScreenFinding', scenarios: scenariosFinding(realFinding) },
  { key: 'e3-family', heading: 'É3 · La famille des témoins', source: 'src/pages/ScreenFamily.tsx',
    exported: 'ScreenFamily', scenarios: scenariosFamily(realFamily) },
  { key: 'e4-face-a-face', heading: 'É4 · Le face-à-face', source: 'src/pages/ScreenFaceToFace.tsx',
    exported: 'ScreenFaceToFace', scenarios: scenariosFaceAFace(realFaceAFace) },
  { key: 'e5-card', heading: 'É5 · La carte', source: 'src/pages/ScreenMap.tsx',
    exported: 'ScreenMap', scenarios: scenariosCard(realCard) },
  { key: 'e6-journal', heading: 'É6 · Le journal', source: 'src/pages/ScreenJournal.tsx',
    exported: 'ScreenJournal', scenarios: scenariosJournal(realJournal) },
  { key: 'e7-act', heading: "É7 · L'acte", source: 'src/pages/ScreenAct.tsx',
    exported: 'ScreenAct', scenarios: scenariosAct(realAct) }
]

const page = (heading, body, sheet) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${heading}</title>
<style>${sheet}</style>
</head>
<body>
${body}
</body>
</html>
`

const TORENDER = ONLY === null ? TEMPLATES : TEMPLATES.filter((g) => g.key === ONLY)
if (TORENDER.length === 0) throw new Error(`gabarit « ${ONLY} » inconnu — clés : ${TEMPLATES.map((g) => g.key).join(', ')}`)

for (const g of TORENDER) {
  const mod = await import(pathToFileURL(path.join(ROOT, g.source)).href)
  const Component = mod[g.exported]
  if (typeof Component !== 'function') throw new Error(`export « ${g.exported} » introuvable dans ${g.source}`)

  for (const [state, sources] of Object.entries(g.scenarios)) {
    for (const [path, snapshot] of Object.entries(sources)) installSource(path, snapshot)
    /* Le signal de succès appartient à l'état de succès, et à lui seul. Il était
       posé sur l'état vide : le témoin « vide » portait donc un acte réussi que
       rien ne pouvait rendre — aucun run à montrer —, et l'état de succès, lui,
       n'était jamais demandé. Le cinquième témoin de É1 manquait par là. */
    installMutation('/runs', { launch: () => undefined, inWaiting: false, error: null, success: state === 'success' })
    installMutation('/verdicts', { launch: () => undefined, inWaiting: false, error: null, success: state === 'success' })
    installMutation('/brouillons', { launch: () => undefined, inWaiting: false, error: null, success: state === 'success' })
    /* Deux exécutions doivent produire deux fichiers identiques : sans remise à
       zéro, les identifiants de champ dériveraient d'un état à l'autre et le
       face-à-face montrerait un écart qui n'existe pas. */
    resetId()

    const body = toRender({ type: Component, props: {}, children: [] })
    const target = path.join(ROOT, 'witnesses', g.key, DATE, `${state}.html`)
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, page(`${g.heading} · ${state} · ${DATE}`, body, bringPaths(style, target)))
    console.log('  ✅', path.relative(ROOT, target), `(${String(body.length)} octets)`)
  }
}
console.log(`\n  ${TORENDER.length} lignée(s), témoin daté du ${DATE}.\n`)
