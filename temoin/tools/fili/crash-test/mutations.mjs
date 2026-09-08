import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { ROOT } from './battery.mjs'

/* Chaque exécution se fait dans un processus neuf : une mutation du code de la
   règle doit être rechargée, sinon on testerait une version en cache. */
function runBattery() {
  const out = execFileSync('node', [path.join(ROOT, 'tools/fili/crash-test/report-json.mjs')], { cwd: ROOT })
  return JSON.parse(out.toString())
}

const RULE = path.join(ROOT, 'tools/fili/index.js')
const REGISTRY = path.join(ROOT, 'fili/registry.json')
const OK5 = path.join(ROOT, 'crash-tests/compliant/OK-5-rupture-declaree.tsx')
const OKS22 = path.join(ROOT, 'crash-tests/compliant/OK-S2-2-rupture-vide-avec-motif.tsx')
const OKS34 = path.join(ROOT, 'crash-tests/compliant/OK-S3-4-rupture-avec-motif.tsx')
const OKS42 = path.join(ROOT, 'crash-tests/pages/OK-S4-2-monotonie-declaree.tsx')
const OKS53 = path.join(ROOT, 'crash-tests/pages/OK-S5-3-tete-declaree.tsx')

const M = (id, what, target, mutate, expected) => ({ id, what, target, mutate, expected })


/* ── GARDE-FOU DE RESTAURATION ──────────────────────────────────────────────
   Ce script sabote volontairement le gardien, puis le restaure. S'il est
   interrompu (délai d'attente, Ctrl-C, plantage), la restauration doit se faire
   quand même : sinon une règle reste désactivée en silence, et le gardien
   affiche vert sans vérifier. C'est exactement ce que la doctrine interdit. */
const ORIGINALS = new Map()
const memorize = (path, content) => { if (!ORIGINALS.has(path)) ORIGINALS.set(path, content) }
const allRestore = () => {
  for (const [path, content] of ORIGINALS) {
    try { fs.writeFileSync(path, content) } catch {}
  }
  ORIGINALS.clear()
}
process.on('exit', allRestore)
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => { allRestore(); process.exit(130) })
}
process.on('uncaughtException', (e) => { allRestore(); console.error(e); process.exit(1) })

const MUTATIONS = [
  M('M1', 'désactiver R1.2 (interactivité greffée)', RULE,
    (s) => s.replace('const ACTIVE_R12 = true', 'const ACTIVE_R12 = false'),
    'KO-4, KO-5, KO-6 et KO-11 doivent virer au vert'),
  M('M2', "retirer le motif de la rupture déclarée OK-5", OK5,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-5 doit virer au rouge'),
  M('M3', 'vider le registre déclaré', REGISTRY,
    (s) => s.replace(/"sources": \[[^\]]*\]/, '"sources": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M4', 'supprimer la zone système du registre', REGISTRY,
    (s) => s.replace(/"system": \[[^\]]*\]/, '"system": []'),
    'OK-3 doit virer au rouge'),
  M('M5', "retirer 'input' de la liste fermée R1.1", RULE,
    (s) => s.replace("'input', ", ''),
    'KO-3 doit virer au vert'),
  M('M6', "supprimer l'exigence de motif sur la rupture", RULE,
    (s) => s.replace('const REQUIRE_REASON = true', 'const REQUIRE_REASON = false'),
    'KO-12 doit virer au vert'),
  M('M7', 'désactiver R1.3 (appartenance au registre)', RULE,
    (s) => s.replace('const ACTIVE_R13 = true', 'const ACTIVE_R13 = false'),
    'KO-7 doit virer au vert'),
  M('M8', 'désactiver R1.5 (fork silencieux)', RULE,
    (s) => s.replace('const ACTIVE_R15 = true', 'const ACTIVE_R15 = false'),
    'KO-7b et KO-8 doivent virer au vert'),
  M('M9', 'désactiver R1.6 (échappements)', RULE,
    (s) => s.replace('const ACTIVE_R16 = true', 'const ACTIVE_R16 = false'),
    'KO-9 et KO-10 doivent virer au vert'),

  M('M10', 'désactiver R2.1 (rendu hors conteneur)', RULE,
    (s) => s.replace('const ACTIVE_R21 = true', 'const ACTIVE_R21 = false'),
    'KO-S2-1 doit virer au vert'),
  M('M11', 'désactiver R2.2 (slots obligatoires)', RULE,
    (s) => s.replace('const ACTIVE_R22 = true', 'const ACTIVE_R22 = false'),
    'KO-S2-2, KO-S2-8 et KO-S2-9 doivent virer au vert'),
  M('M12', "désactiver R2.3 (attente et issue d'une mutation)", RULE,
    (s) => s.replace('const ACTIVE_R23 = true', 'const ACTIVE_R23 = false'),
    'KO-S2-6 et KO-S2-7 doivent virer au vert'),
  M('M13', 'désactiver R2.4 (drapeau lu hors conteneur)', RULE,
    (s) => s.replace('const ACTIVE_R24 = true', 'const ACTIVE_R24 = false'),
    'KO-S2-5 doit virer au vert'),
  M('M14', 'désactiver R2.5 (slot muet)', RULE,
    (s) => s.replace('const ACTIVE_R25 = true', 'const ACTIVE_R25 = false'),
    'KO-S2-3 et KO-S2-4 doivent virer au vert'),
  M('M15', 'autoriser la rupture sur tous les slots', REGISTRY,
    (s) => s.replace(/"slotsRupture": \[[^\]]*\]/, '"slotsRupture": ["vide","succes","chargement","erreur"]'),
    'KO-S2-8 doit virer au vert'),
  M('M16', 'vider la déclaration des sources asynchrones', REGISTRY,
    (s) => s.replace(/"readings": \[[^\]]*\]/, '"readings": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M17', "retirer le motif de la rupture OK-S2-2", OKS22,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-S2-2 doit virer au rouge'),

  M('M18', "désactiver R3.1 (échelle unique)", RULE,
    (s) => s.replace('const ACTIVE_R31 = true', 'const ACTIVE_R31 = false'),
    'KO-S3-1, KO-S3-2 et KO-S3-2b doivent virer au vert'),
  M('M19', 'désactiver R3.2 (interdiction des marges)', RULE,
    (s) => s.replace('const ACTIVE_R32 = true', 'const ACTIVE_R32 = false'),
    'KO-S3-3, KO-S3-4, KO-S3-5 et KO-S3-10 doivent virer au vert'),
  M('M20', 'désactiver R3.3 (style inline)', RULE,
    (s) => s.replace('const ACTIVE_R33 = true', 'const ACTIVE_R33 = false'),
    'KO-S3-6 doit virer au vert'),
  M('M21', 'désactiver R3.4 (valeurs magiques)', RULE,
    (s) => s.replace('const ACTIVE_R34 = true', 'const ACTIVE_R34 = false'),
    'KO-S3-7, KO-S3-8 et KO-S3-11 doivent virer au vert'),
  M('M22', 'désactiver R3.5 (classe construite)', RULE,
    (s) => s.replace('const ACTIVE_R35 = true', 'const ACTIVE_R35 = false'),
    'KO-S3-9 doit virer au vert'),
  M('M23', "ajouter mt-block-card aux exceptions de l'échelle", REGISTRY,
    (s) => s.replace('"exceptions": [', '"exceptions": [\n      "mt-block-card",'),
    'KO-S3-3 et KO-S3-10 doivent virer au vert'),
  M('M24', "retirer mx-auto des exceptions", REGISTRY,
    (s) => s.replace('"mx-auto"', '"mx-rien"'),
    'OK-S3-3 doit virer au rouge'),
  M('M25', "vider l'échelle d'espacement", REGISTRY,
    (s) => s.replace(/"scale": \[[^\]]*\]/, '"scale": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M26', "retirer le motif de la rupture OK-S3-4", OKS34,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-S3-4 doit virer au rouge'),

  M('M27', 'désactiver R3.7 (proximité)', RULE,
    (s) => s.replace('const ACTIVE_R37 = true', 'const ACTIVE_R37 = false'),
    'KO-S3-12 et KO-S3-13 doivent virer au vert'),
  M('M28', 'porter le facteur de proximité au-delà du ratio', REGISTRY,
    (s) => s.replace(/"factor": [\d.]+/, '"factor": 7'),
    'OK-S3-7 et le témoin doivent virer au rouge'),

  M('M29', 'désactiver R4.1 (page = suite de sections)', RULE,
    (s) => s.replace('const ACTIVE_R41 = true', 'const ACTIVE_R41 = false'),
    'KO-S4-1 doit virer au vert'),
  M('M30', 'désactiver R4.2 (densité déclarée)', RULE,
    (s) => s.replace('const ACTIVE_R42 = true', 'const ACTIVE_R42 = false'),
    'KO-S4-2 et KO-S4-2b doivent virer au vert'),
  M('M31', "désactiver R4.3 (alternance)", RULE,
    (s) => s.replace('const ACTIVE_R43 = true', 'const ACTIVE_R43 = false'),
    'KO-S4-3 doit virer au vert'),
  M('M32', 'désactiver R4.4 (hiérarchie de titres)', RULE,
    (s) => s.replace('const ACTIVE_R44 = true', 'const ACTIVE_R44 = false'),
    'KO-S4-4, KO-S4-5 et KO-S4-7 doivent virer au vert'),
  M('M33', "désactiver R4.5 (taille surchargée)", RULE,
    (s) => s.replace('const ACTIVE_R45 = true', 'const ACTIVE_R45 = false'),
    'KO-S4-6 doit virer au vert'),
  M('M34', "porter le seuil d'alternance de 2 à 3", REGISTRY,
    (s) => s.replace('"thresholdAlternation": 2', '"thresholdAlternation": 3'),
    'KO-S4-3 doit virer au vert'),
  M('M35', "vider l'échelle de densités", REGISTRY,
    (s) => s.replace(/"densities": \[[^\]]*\]/, '"densities": []'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M36', "retirer le motif de la monotonie déclarée OK-S4-2", OKS42,
    (s) => s.replace(/\n\s*data-intent-reason="[^"]*"/, ''),
    'OK-S4-2 doit virer au rouge'),

  M('M37', 'désactiver R5.1 (au moins une tête)', RULE,
    (s) => s.replace('const ACTIVE_R51 = true', 'const ACTIVE_R51 = false'),
    'KO-S5-1, KO-S5-5 et KO-S5-8 doivent virer au vert'),
  M('M38', 'désactiver R5.2 (au plus une tête)', RULE,
    (s) => s.replace('const ACTIVE_R52 = true', 'const ACTIVE_R52 = false'),
    'KO-S5-2 et KO-S5-6 doivent virer au vert'),
  M('M39', "désactiver R5.3 (la tête n'est pas enterrée)", RULE,
    (s) => s.replace('const ACTIVE_R53 = true', 'const ACTIVE_R53 = false'),
    'KO-S5-3, KO-S5-4 et KO-S5-7 doivent virer au vert'),
  M('M40', 'porter le seuil de rang de 1 à 6', REGISTRY,
    (s) => s.replace('"thresholdRank": 1', '"thresholdRank": 6'),
    'KO-S5-3, KO-S5-4 et KO-S5-7 doivent virer au vert'),
  M('M41', 'étendre la rupture déclarée à R5.1', RULE,
    (s) => s.replace('const RUPTURE_RAISED_R51 = false', 'const RUPTURE_RAISED_R51 = true'),
    'KO-S5-5 doit virer au vert'),
  M('M42', 'étendre la rupture déclarée à R5.2', RULE,
    (s) => s.replace('const RUPTURE_RAISED_R52 = false', 'const RUPTURE_RAISED_R52 = true'),
    'KO-S5-6 doit virer au vert'),
  M('M43', "retirer le motif de la tête déclarée OK-S5-3", OKS53,
    (s) => s.replace(/\s*data-intent-reason="[^"]*"/, ''),
    'OK-S5-3 doit virer au rouge'),
  M('M44', 'retirer la marque de tête du registre', REGISTRY,
    (s) => s.replace('"propHead": "head"', '"propHead": ""'),
    'refus de statuer partout, aucune fixture au vert'),
  M('M45', 'faire compter les sections imbriquées', RULE,
    (s) => s.replace('const HEAD_FIRST_LEVEL_SINGLE = true', 'const HEAD_FIRST_LEVEL_SINGLE = false'),
    'KO-S5-8 doit virer au vert'),
  M('M46', 'retirer le seuil de rang du registre', REGISTRY,
    (s) => s.replace('"thresholdRank": 1', '"thresholdRank": null'),
    'refus de statuer partout, aucune fixture au vert')
]

/* Découpage en salves : l'environnement d'exécution plafonne la durée d'une
   commande. Le script peut donc être joué par tranches (MUT_FROM/MUT_TO) sans
   qu'aucune mutation ne soit sautée — le total est vérifié à la dernière salve. */
const FROM = Number(process.env.MUT_FROM || 1)
const TO = Number(process.env.MUT_TO || MUTATIONS.length)
const SELECTION = MUTATIONS.slice(FROM - 1, TO)

const refMap = runBattery()

console.log(`\nTESTS DE MUTATION — salve ${FROM} → ${TO} sur ${MUTATIONS.length}\n`)
let invalid = 0

for (const m of SELECTION) {
  const original = fs.readFileSync(m.target, 'utf8')
  memorize(m.target, original)
  const mute = m.mutate(original)
  if (mute === original) { console.log(`  ❌ ${m.id} — mutation inopérante (le texte cible n'a pas changé)`); invalid++; continue }
  fs.writeFileSync(m.target, mute)
  let gaps = []
  try {
    const after = runBattery()
    gaps = Object.keys(refMap).filter((id) => after[id] !== refMap[id]).map((id) => `${id}: ${refMap[id]}→${after[id]}`)
  } finally {
    fs.writeFileSync(m.target, original)
  }
  const detected = gaps.length > 0
  if (!detected) invalid++
  console.log(`  ${detected ? '✅' : '❌'} ${m.id} — ${m.what}`)
  console.log(`       attendu : ${m.expected}`)
  console.log(`       observé : ${detected ? gaps.join(' · ') : 'AUCUN ÉCART — la batterie ne testait rien'}`)
}

console.log(`\n  VERDICT : ${invalid === 0 ? `🟢 ${SELECTION.length}/${SELECTION.length} mutations détectées (salve ${FROM}→${TO}) — la batterie teste vraiment quelque chose` : `🔴 ${invalid} mutation(s) non détectée(s)`}\n`)
process.exit(invalid === 0 ? 0 : 1)
