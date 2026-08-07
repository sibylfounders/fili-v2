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

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
register(pathToFileURL(path.join(RACINE, 'tools/fili/temoin/loader.mjs')))

const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}
const DATE = arg('date', new Date().toISOString().slice(0, 10))

/* ── La feuille de style du produit, produite depuis ses sources ─────────── */
const CSS = path.join(RACINE, 'temoins/.style.css')
mkdirSync(path.dirname(CSS), { recursive: true })
execFileSync('npx', ['tailwindcss', '-i', 'src/index.css', '-o', CSS, '--minify'],
  { cwd: RACINE, stdio: 'pipe' })
const style = readFileSync(CSS, 'utf8')

const { rendre } = await import(pathToFileURL(path.join(RACINE, 'tools/fili/temoin/runtime.mjs')).href)
const { installerSource } = await import(pathToFileURL(path.join(RACINE, 'src/system/donnees/source.ts')).href)
const { installerMutation } = await import(pathToFileURL(path.join(RACINE, 'src/system/donnees/useRequete.ts')).href)
const { reinitialiserId } = await import(pathToFileURL(path.join(RACINE, 'tools/fili/temoin/react-temoin.mjs')).href)
const { scenariosVerdict, scenariosConstat, scenariosFamille, scenariosFaceAFace } = await import(pathToFileURL(path.join(RACINE, 'tools/fili/etat/scenarios.mjs')).href)

/* ── L'état réel, produit par le Gardien ─────────────────────────────────── */
const cheminEtat = path.join(RACINE, 'public/etat.json')
if (!existsSync(cheminEtat)) throw new Error('public/etat.json absent — lancez tools/fili/etat/produire.mjs')
const etatReel = JSON.parse(readFileSync(cheminEtat, 'utf8'))
const donnees = (c) => etatReel[c]?.donnees ?? null

const reelVerdict = {
  integrite: donnees('/integrite'),
  batterie: donnees('/batterie'),
  constats: donnees('/constats') ?? [],
  runs: [{ date: DATE, verdict: 'aucun écart' }]
}
/* Le constat mis sous les yeux est une assertion réelle du corpus, avec sa
   raison d'être écrite au contrat — pas un exemple inventé pour la démonstration. */
const reelConstat = {
  assertion: {
    id: 'R5.1',
    contrat: 'S5 · Arbitrage de lecture',
    enonce: "Au moins une section de la page déclare porter ce qui compte d'abord.",
    raison:
      "Une page sans tête n'est pas un parti pris minimaliste : c'est une décision qui n'a pas été prise, et elle ne se voit sur aucune ligne — seulement sur la page, et seulement pour un œil qui sait quoi chercher. Le Gardien n'arbitre rien ; il refuse qu'on livre une page sur laquelle personne n'a tranché.",
    ruptureLevable: false
  },
  occurrences: [
    { id: 'o1', fichier: 'crash-tests/pages/KO-S5-1-sans-tete.tsx', ligne: 9 },
    { id: 'o2', fichier: 'crash-tests/pages/KO-S5-5-rupture-sur-absence.tsx', ligne: 12 },
    { id: 'o3', fichier: 'crash-tests/pages/KO-S5-8-tete-imbriquee.tsx', ligne: 14 }
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
const relatif = (c) => (typeof c === 'string' ? c.replace(/^\.\/temoins\//, '../../') : c)
const reelFamille = {
  familles: (donnees('/temoins') ?? []).map((f) => ({ ...f, apercu: relatif(f.apercu) }))
}
const reelFaceAFace = {
  face: (() => {
    const f = donnees('/faceAFace')
    if (f === null) return null
    return {
      ...f,
      courant: { ...f.courant, source: relatif(f.courant.source) },
      precedent: f.precedent ? { ...f.precedent, source: relatif(f.precedent.source) } : null
    }
  })(),
  verdicts: [{ date: DATE, issue: 'accepte' }]
}

const GABARITS = [
  { cle: 'e1-verdict', titre: 'É1 · Le verdict', source: 'src/pages/EcranVerdict.tsx',
    exporte: 'EcranVerdict', scenarios: scenariosVerdict(reelVerdict) },
  { cle: 'e2-constat', titre: 'É2 · Le constat', source: 'src/pages/EcranConstat.tsx',
    exporte: 'EcranConstat', scenarios: scenariosConstat(reelConstat) },
  { cle: 'e3-famille', titre: 'É3 · La famille des témoins', source: 'src/pages/EcranFamille.tsx',
    exporte: 'EcranFamille', scenarios: scenariosFamille(reelFamille) },
  { cle: 'e4-face-a-face', titre: 'É4 · Le face-à-face', source: 'src/pages/EcranFaceAFace.tsx',
    exporte: 'EcranFaceAFace', scenarios: scenariosFaceAFace(reelFaceAFace) }
]

const page = (titre, corps) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${titre}</title>
<style>${style}</style>
</head>
<body>
${corps}
</body>
</html>
`

for (const g of GABARITS) {
  const mod = await import(pathToFileURL(path.join(RACINE, g.source)).href)
  const Composant = mod[g.exporte]
  if (typeof Composant !== 'function') throw new Error(`export « ${g.exporte} » introuvable dans ${g.source}`)

  for (const [etat, sources] of Object.entries(g.scenarios)) {
    for (const [chemin, instantane] of Object.entries(sources)) installerSource(chemin, instantane)
    installerMutation('/runs', { lancer: () => undefined, enAttente: false, erreur: null, succes: etat === 'vide' })
    installerMutation('/verdicts', { lancer: () => undefined, enAttente: false, erreur: null, succes: etat === 'succes' })
    /* Deux exécutions doivent produire deux fichiers identiques : sans remise à
       zéro, les identifiants de champ dériveraient d'un état à l'autre et le
       face-à-face montrerait un écart qui n'existe pas. */
    reinitialiserId()

    const corps = rendre({ type: Composant, props: {}, enfants: [] })
    const cible = path.join(RACINE, 'temoins', g.cle, DATE, `${etat}.html`)
    mkdirSync(path.dirname(cible), { recursive: true })
    writeFileSync(cible, page(`${g.titre} · ${etat} · ${DATE}`, corps))
    console.log('  ✅', path.relative(RACINE, cible), `(${String(corps.length)} octets)`)
  }
}
console.log(`\n  ${GABARITS.length} lignées, témoin daté du ${DATE}.\n`)
