import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { RACINE } from './battery.mjs'

/* Chaque exécution se fait dans un processus neuf : une mutation du code de la
   règle doit être rechargée, sinon on testerait une version en cache. */
function executerBatterie() {
  const out = execFileSync('node', [path.join(RACINE, 'tools/fili/crash-test/report-json.mjs')], { cwd: RACINE })
  return JSON.parse(out.toString())
}

const REGLE = path.join(RACINE, 'tools/fili/index.js')
const REGISTRE = path.join(RACINE, 'fili.registry.json')
const OK5 = path.join(RACINE, 'crash-tests/conformes/OK-5-rupture-declaree.tsx')
const OKS22 = path.join(RACINE, 'crash-tests/conformes/OK-S2-2-rupture-vide-avec-motif.tsx')
const OKS34 = path.join(RACINE, 'crash-tests/conformes/OK-S3-4-rupture-avec-motif.tsx')
const OKS42 = path.join(RACINE, 'crash-tests/pages/OK-S4-2-monotonie-declaree.tsx')
const OKS53 = path.join(RACINE, 'crash-tests/pages/OK-S5-3-tete-declaree.tsx')

const M = (id, quoi, cible, muter, attendu) => ({ id, quoi, cible, muter, attendu })


/* ── GARDE-FOU DE RESTAURATION ──────────────────────────────────────────────
   Ce script sabote volontairement le gardien, puis le restaure. S'il est
   interrompu (délai d'attente, Ctrl-C, plantage), la restauration doit se faire
   quand même : sinon une règle reste désactivée en silence, et le gardien
   affiche vert sans vérifier. C'est exactement ce que la doctrine interdit. */
const ORIGINAUX = new Map()
const memoriser = (chemin, contenu) => { if (!ORIGINAUX.has(chemin)) ORIGINAUX.set(chemin, contenu) }
const toutRestaurer = () => {
  for (const [chemin, contenu] of ORIGINAUX) {
    try { fs.writeFileSync(chemin, contenu) } catch {}
  }
  ORIGINAUX.clear()
}
process.on('exit', toutRestaurer)
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => { toutRestaurer(); process.exit(130) })
}
process.on('uncaughtException', (e) => { toutRestaurer(); console.error(e); process.exit(1) })

const MUTATIONS = [
  M('M1', 'désactiver R1.2 (interactivité greffée)', REGLE,
    (s) => s.replace('const ACTIF_R12 = true', 'const ACTIF_R12 = false'),
    'KO-4, KO-5, KO-6 et KO-11 doivent virer au vert'),
  M('M2', "retirer le motif de la rupture déclarée OK-5", OK5,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-5 doit virer au rouge'),
  M('M3', 'vider le registre déclaré', REGISTRE,
    (s) => s.replace(/"sources": \[[^\]]*\]/, '"sources": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M4', 'supprimer la zone système du registre', REGISTRE,
    (s) => s.replace(/"systeme": \[[^\]]*\]/, '"systeme": []'),
    'OK-3 doit virer au rouge'),
  M('M5', "retirer 'input' de la liste fermée R1.1", REGLE,
    (s) => s.replace("'input', ", ''),
    'KO-3 doit virer au vert'),
  M('M6', "supprimer l'exigence de motif sur la rupture", REGLE,
    (s) => s.replace('const EXIGER_MOTIF = true', 'const EXIGER_MOTIF = false'),
    'KO-12 doit virer au vert'),
  M('M7', 'désactiver R1.3 (appartenance au registre)', REGLE,
    (s) => s.replace('const ACTIF_R13 = true', 'const ACTIF_R13 = false'),
    'KO-7 doit virer au vert'),
  M('M8', 'désactiver R1.5 (fork silencieux)', REGLE,
    (s) => s.replace('const ACTIF_R15 = true', 'const ACTIF_R15 = false'),
    'KO-7b et KO-8 doivent virer au vert'),
  M('M9', 'désactiver R1.6 (échappements)', REGLE,
    (s) => s.replace('const ACTIF_R16 = true', 'const ACTIF_R16 = false'),
    'KO-9 et KO-10 doivent virer au vert'),

  M('M10', 'désactiver R2.1 (rendu hors conteneur)', REGLE,
    (s) => s.replace('const ACTIF_R21 = true', 'const ACTIF_R21 = false'),
    'KO-S2-1 doit virer au vert'),
  M('M11', 'désactiver R2.2 (slots obligatoires)', REGLE,
    (s) => s.replace('const ACTIF_R22 = true', 'const ACTIF_R22 = false'),
    'KO-S2-2, KO-S2-8 et KO-S2-9 doivent virer au vert'),
  M('M12', "désactiver R2.3 (attente et issue d'une mutation)", REGLE,
    (s) => s.replace('const ACTIF_R23 = true', 'const ACTIF_R23 = false'),
    'KO-S2-6 et KO-S2-7 doivent virer au vert'),
  M('M13', 'désactiver R2.4 (drapeau lu hors conteneur)', REGLE,
    (s) => s.replace('const ACTIF_R24 = true', 'const ACTIF_R24 = false'),
    'KO-S2-5 doit virer au vert'),
  M('M14', 'désactiver R2.5 (slot muet)', REGLE,
    (s) => s.replace('const ACTIF_R25 = true', 'const ACTIF_R25 = false'),
    'KO-S2-3 et KO-S2-4 doivent virer au vert'),
  M('M15', 'autoriser la rupture sur tous les slots', REGISTRE,
    (s) => s.replace(/"slotsRupture": \[[^\]]*\]/, '"slotsRupture": ["vide","succes","chargement","erreur"]'),
    'KO-S2-8 doit virer au vert'),
  M('M16', 'vider la déclaration des sources asynchrones', REGISTRE,
    (s) => s.replace(/"lectures": \[[^\]]*\]/, '"lectures": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M17', "retirer le motif de la rupture OK-S2-2", OKS22,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-S2-2 doit virer au rouge'),

  M('M18', "désactiver R3.1 (échelle unique)", REGLE,
    (s) => s.replace('const ACTIF_R31 = true', 'const ACTIF_R31 = false'),
    'KO-S3-1, KO-S3-2 et KO-S3-2b doivent virer au vert'),
  M('M19', 'désactiver R3.2 (interdiction des marges)', REGLE,
    (s) => s.replace('const ACTIF_R32 = true', 'const ACTIF_R32 = false'),
    'KO-S3-3, KO-S3-4, KO-S3-5 et KO-S3-10 doivent virer au vert'),
  M('M20', 'désactiver R3.3 (style inline)', REGLE,
    (s) => s.replace('const ACTIF_R33 = true', 'const ACTIF_R33 = false'),
    'KO-S3-6 doit virer au vert'),
  M('M21', 'désactiver R3.4 (valeurs magiques)', REGLE,
    (s) => s.replace('const ACTIF_R34 = true', 'const ACTIF_R34 = false'),
    'KO-S3-7, KO-S3-8 et KO-S3-11 doivent virer au vert'),
  M('M22', 'désactiver R3.5 (classe construite)', REGLE,
    (s) => s.replace('const ACTIF_R35 = true', 'const ACTIF_R35 = false'),
    'KO-S3-9 doit virer au vert'),
  M('M23', "ajouter mt-4 aux exceptions de l'échelle", REGISTRE,
    (s) => s.replace('"exceptions": [', '"exceptions": [\n      "mt-4",'),
    'KO-S3-3 et KO-S3-10 doivent virer au vert'),
  M('M24', "retirer mx-auto des exceptions", REGISTRE,
    (s) => s.replace('"mx-auto"', '"mx-rien"'),
    'OK-S3-3 doit virer au rouge'),
  M('M25', "vider l'échelle d'espacement", REGISTRE,
    (s) => s.replace(/"echelle": \[[^\]]*\]/, '"echelle": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M26', "retirer le motif de la rupture OK-S3-4", OKS34,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-S3-4 doit virer au rouge'),

  M('M27', 'désactiver R3.7 (proximité)', REGLE,
    (s) => s.replace('const ACTIF_R37 = true', 'const ACTIF_R37 = false'),
    'KO-S3-12 et KO-S3-13 doivent virer au vert'),
  M('M28', 'porter le facteur de proximité de 3 à 7', REGISTRE,
    (s) => s.replace('"facteur": 3', '"facteur": 7'),
    'OK-S3-7 et le témoin doivent virer au rouge'),

  M('M29', 'désactiver R4.1 (page = suite de sections)', REGLE,
    (s) => s.replace('const ACTIF_R41 = true', 'const ACTIF_R41 = false'),
    'KO-S4-1 doit virer au vert'),
  M('M30', 'désactiver R4.2 (densité déclarée)', REGLE,
    (s) => s.replace('const ACTIF_R42 = true', 'const ACTIF_R42 = false'),
    'KO-S4-2 et KO-S4-2b doivent virer au vert'),
  M('M31', "désactiver R4.3 (alternance)", REGLE,
    (s) => s.replace('const ACTIF_R43 = true', 'const ACTIF_R43 = false'),
    'KO-S4-3 doit virer au vert'),
  M('M32', 'désactiver R4.4 (hiérarchie de titres)', REGLE,
    (s) => s.replace('const ACTIF_R44 = true', 'const ACTIF_R44 = false'),
    'KO-S4-4, KO-S4-5 et KO-S4-7 doivent virer au vert'),
  M('M33', "désactiver R4.5 (taille surchargée)", REGLE,
    (s) => s.replace('const ACTIF_R45 = true', 'const ACTIF_R45 = false'),
    'KO-S4-6 doit virer au vert'),
  M('M34', "porter le seuil d'alternance de 2 à 3", REGISTRE,
    (s) => s.replace('"seuilAlternance": 2', '"seuilAlternance": 3'),
    'KO-S4-3 doit virer au vert'),
  M('M35', "vider l'échelle de densités", REGISTRE,
    (s) => s.replace(/"densites": \[[^\]]*\]/, '"densites": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M36', "retirer le motif de la monotonie déclarée OK-S4-2", OKS42,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-S4-2 doit virer au rouge'),

  M('M37', 'désactiver R5.1 (au moins une tête)', REGLE,
    (s) => s.replace('const ACTIF_R51 = true', 'const ACTIF_R51 = false'),
    'KO-S5-1, KO-S5-5 et KO-S5-8 doivent virer au vert'),
  M('M38', 'désactiver R5.2 (au plus une tête)', REGLE,
    (s) => s.replace('const ACTIF_R52 = true', 'const ACTIF_R52 = false'),
    'KO-S5-2 et KO-S5-6 doivent virer au vert'),
  M('M39', "désactiver R5.3 (la tête n'est pas enterrée)", REGLE,
    (s) => s.replace('const ACTIF_R53 = true', 'const ACTIF_R53 = false'),
    'KO-S5-3, KO-S5-4 et KO-S5-7 doivent virer au vert'),
  M('M40', 'porter le seuil de rang de 1 à 6', REGISTRE,
    (s) => s.replace('"seuilRang": 1', '"seuilRang": 6'),
    'KO-S5-3, KO-S5-4 et KO-S5-7 doivent virer au vert'),
  M('M41', 'étendre la rupture déclarée à R5.1', REGLE,
    (s) => s.replace('const RUPTURE_LEVE_R51 = false', 'const RUPTURE_LEVE_R51 = true'),
    'KO-S5-5 doit virer au vert'),
  M('M42', 'étendre la rupture déclarée à R5.2', REGLE,
    (s) => s.replace('const RUPTURE_LEVE_R52 = false', 'const RUPTURE_LEVE_R52 = true'),
    'KO-S5-6 doit virer au vert'),
  M('M43', "retirer le motif de la tête déclarée OK-S5-3", OKS53,
    (s) => s.replace(/\s*data-intent-reason="[^"]*"/, ''),
    'OK-S5-3 doit virer au rouge'),
  M('M44', 'retirer la marque de tête du registre', REGISTRE,
    (s) => s.replace('"propTete": "tete"', '"propTete": ""'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M45', 'faire compter les sections imbriquées', REGLE,
    (s) => s.replace('const TETE_PREMIER_NIVEAU_SEUL = true', 'const TETE_PREMIER_NIVEAU_SEUL = false'),
    'KO-S5-8 doit virer au vert'),
  M('M46', 'retirer le seuil de rang du registre', REGISTRE,
    (s) => s.replace('"seuilRang": 1', '"seuilRang": null'),
    'refus de statuer partout, aucune fixture au vert')
]

/* Découpage en salves : l'environnement d'exécution plafonne la durée d'une
   commande. Le script peut donc être joué par tranches (MUT_FROM/MUT_TO) sans
   qu'aucune mutation ne soit sautée — le total est vérifié à la dernière salve. */
const FROM = Number(process.env.MUT_FROM || 1)
const TO = Number(process.env.MUT_TO || MUTATIONS.length)
const SELECTION = MUTATIONS.slice(FROM - 1, TO)

const refMap = executerBatterie()

console.log(`\nTESTS DE MUTATION — salve ${FROM} → ${TO} sur ${MUTATIONS.length}\n`)
let invalides = 0

for (const m of SELECTION) {
  const original = fs.readFileSync(m.cible, 'utf8')
  memoriser(m.cible, original)
  const mute = m.muter(original)
  if (mute === original) { console.log(`  ❌ ${m.id} — mutation inopérante (le texte cible n'a pas changé)`); invalides++; continue }
  fs.writeFileSync(m.cible, mute)
  let ecarts = []
  try {
    const apres = executerBatterie()
    ecarts = Object.keys(refMap).filter((id) => apres[id] !== refMap[id]).map((id) => `${id}: ${refMap[id]}→${apres[id]}`)
  } finally {
    fs.writeFileSync(m.cible, original)
  }
  const detecte = ecarts.length > 0
  if (!detecte) invalides++
  console.log(`  ${detecte ? '✅' : '❌'} ${m.id} — ${m.quoi}`)
  console.log(`       attendu : ${m.attendu}`)
  console.log(`       observé : ${detecte ? ecarts.join(' · ') : 'AUCUN ÉCART — la batterie ne testait rien'}`)
}

console.log(`\n  VERDICT : ${invalides === 0 ? `🟢 ${SELECTION.length}/${SELECTION.length} mutations détectées (salve ${FROM}→${TO}) — la batterie teste vraiment quelque chose` : `🔴 ${invalides} mutation(s) non détectée(s)`}\n`)
process.exit(invalides === 0 ? 0 : 1)
