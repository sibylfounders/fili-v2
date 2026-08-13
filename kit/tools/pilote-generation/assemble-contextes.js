#!/usr/bin/env node
/**
 * assemble-contextes.js — harnais du test à quatre conditions (spec § 7)
 *
 * Assemble les connaissances design par condition à partir des artefacts RÉELS :
 *  - contenu : dist/build/RULES-<sujet>.md (compilation adressable — les règles portent leurs IDs) ;
 *  - configuration : tools/plugin/config-intentions.js — la SOURCE UNIQUE partagée avec
 *    genere-routeur.js (aucune table recopiée ici) ;
 *  - graphe de bundle : frontmatters `requires` de tools/plugin/rules (le graphe du routeur).
 *
 * CONTRÔLE D'INTÉGRITÉ : les bundles calculés ici sont comparés MEMBRE À MEMBRE à la
 * composition émise par le routeur lui-même (tools/plugin/reports/bundles.json). Une
 * composition différente — même à nombre de fichiers égal — fait échouer l'assemblage.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', '..');
const PLUGIN = path.join(BASE, 'tools/plugin/rules');
const DIST = path.join(BASE, 'dist/build');
const BUNDLES_ROUTEUR = path.join(BASE, 'tools/plugin/reports/bundles.json');
const OUT = path.join(__dirname, 'contextes');
fs.mkdirSync(OUT, { recursive: true });

// Source unique — la même table que le routeur, sans copie.
const { INTENTIONS, SOCLE_SUJETS } = require(path.join(BASE, 'tools/plugin/config-intentions.js'));
const SOCLE = Object.keys(SOCLE_SUJETS);
const INTENTIONS_DU_TEST = ['Formulaire', 'Collection']; // tâches C / A+B

const requiresDe = (sujet) => {
  const f = path.join(PLUGIN, `RULES-${sujet}.md`);
  if (!fs.existsSync(f)) return [];
  const m = fs.readFileSync(f, 'utf8').match(/^requires:\s*\[([^\]]*)\]/m);
  if (!m) return [];
  return m[1].split(',').map((s) => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
};

// Réplique de fermeture() du routeur (mêmes entrées via la config partagée).
function bundle(it) {
  const dedans = new Set();
  const file = [...it.sujets, ...it.fondations, ...it.langages, ...it.principes];
  while (file.length) {
    const s = file.shift();
    if (dedans.has(s) || !fs.existsSync(path.join(PLUGIN, `RULES-${s}.md`))) continue;
    dedans.add(s);
    file.push(...requiresDe(s).map((x) => x.split(/[\s(]/)[0]));
  }
  return [...dedans].sort();
}

const litDist = (sujet) => {
  const f = path.join(DIST, `RULES-${sujet}.md`);
  if (!fs.existsSync(f)) throw new Error(`dist/build/RULES-${sujet}.md manquant`);
  return fs.readFileSync(f, 'utf8');
};
const concat = (sujets) => sujets.map((s) => litDist(s)).join('\n\n---\n\n');

// --- contrôle d'intégrité : membres exacts vs composition émise par le routeur ---
if (!fs.existsSync(BUNDLES_ROUTEUR)) {
  console.error(`✗ ${BUNDLES_ROUTEUR} introuvable — lancer d'abord node tools/plugin/build-plugin.js (le routeur émet la composition exacte des bundles).`);
  process.exit(1);
}
const attendu = JSON.parse(fs.readFileSync(BUNDLES_ROUTEUR, 'utf8'));
let echec = false;

// C2 : le corpus compilé entier, sans routage
const tous = fs.readdirSync(DIST).filter((f) => f.startsWith('RULES-')).map((f) => f.replace(/^RULES-|\.md$/g, '')).sort();
fs.writeFileSync(path.join(OUT, 'connaissance-C2.md'), concat(tous));

// C3 : bundle routé (socle + bundle de l'intention), vérifié membre à membre
for (const nom of INTENTIONS_DU_TEST) {
  const it = INTENTIONS.find((x) => x.intention === nom);
  if (!it) { console.error(`✗ intention « ${nom} » absente de config-intentions.js`); process.exit(1); }
  const calcule = bundle(it);
  const reference = (attendu.bundles || {})[nom];
  if (!reference) { console.error(`✗ bundle « ${nom} » absent de bundles.json — routeur pas régénéré ?`); echec = true; continue; }
  const manque = reference.filter((s) => !calcule.includes(s));
  const surplus = calcule.filter((s) => !reference.includes(s));
  if (manque.length || surplus.length) {
    console.error(`✗ ${nom} : composition divergente du routeur${manque.length ? ` — absents ici : [${manque.join(', ')}]` : ''}${surplus.length ? ` — en trop ici : [${surplus.join(', ')}]` : ''}`);
    echec = true;
    continue;
  }
  console.log(`${nom} : ${calcule.length} fichiers — composition identique au routeur, membre à membre.`);
  const socleRef = (attendu.socle || []).slice().sort().join(',');
  if (socleRef !== SOCLE.slice().sort().join(',')) { console.error(`✗ socle divergent : config [${SOCLE}] vs routeur [${attendu.socle}]`); echec = true; continue; }
  const manquants = calcule.filter((s) => !fs.existsSync(path.join(DIST, `RULES-${s}.md`)));
  const charge = [...new Set([...SOCLE, ...calcule])].filter((s) => !manquants.includes(s));
  if (manquants.length) console.log(`  (sans version dist : ${manquants.join(', ')})`);
  fs.writeFileSync(path.join(OUT, `connaissance-C3-${nom.toLowerCase()}.md`), concat(charge));
}
if (echec) { console.error('✗ assemblage interrompu — corriger la divergence avant tout test.'); process.exit(1); }
for (const c of ['connaissance-C2.md', 'connaissance-C3-formulaire.md', 'connaissance-C3-collection.md']) {
  console.log(`${c} : ${Math.round(fs.statSync(path.join(OUT, c)).size / 1024)} Ko`);
}
