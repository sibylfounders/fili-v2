#!/usr/bin/env node
'use strict';
/**
 * tools/plugin/build-plugin.js — construit le paquet Cowork « design-system-md » depuis le monorepo.
 *
 * Usage :  node tools/plugin/build-plugin.js
 *
 * Chaîne (arrêt à la première erreur) :
 *   1. nettoie build/plugin/
 *   2. copie tools/plugin/rules/RULES-*.md            → skills/design-system-md/
 *   3. genere-tokens.js : DESIGN.md → tokens.css + tokens.yaml + theme-gate.mjs
 *   4. genere-routeur.js : frontmatters → CLAUDE.md + AGENTS.md + SKILL.md (valide le graphe)
 *   5. écrit .claude-plugin/plugin.json + README.md
 *   6. empaquette build/design-system-md.plugin (zip)
 *
 * Source de vérité : apps/site/content/md/ (prose et tokens) ; tools/plugin/rules/ (compilations).
 * Une fiche RULES-* n'est PAS dérivable par script : c'est une condensation éditoriale d'une paire
 * <SUJET>-UX.md / <SUJET>-UI.md. Ajouter un sujet = compiler sa fiche à la main dans rules/, puis
 * relancer ce build (cf. tools/plugin/README.md).
 *
 * Node sans aucune dépendance externe : l'archive est écrite par tools/plugin/zip.js (zlib).
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..', '..');
const PLUGIN_SRC = __dirname;
const BUILD = path.join(RACINE, 'build', 'plugin');
const SKILL_DIR = path.join(BUILD, 'skills', 'design-system-md');

const manifeste = JSON.parse(fs.readFileSync(path.join(PLUGIN_SRC, 'plugin.json'), 'utf8'));

console.log(`Paquet ${manifeste.name} v${manifeste.version}`);

// 1. nettoyage ---------------------------------------------------------------
// Certains bacs à sable (device_bash de Cowork) interdisent unlink : on avertit et on continue,
// le build se fait alors en place — des fichiers d'un sujet supprimé peuvent y survivre.
try {
  fs.rmSync(BUILD, { recursive: true, force: true });
} catch (e) {
  console.warn(`  ! nettoyage de build/plugin impossible (${e.code}) — build en place, des fichiers obsolètes peuvent subsister`);
}
fs.mkdirSync(SKILL_DIR, { recursive: true });
fs.mkdirSync(path.join(BUILD, '.claude-plugin'), { recursive: true });

// 2. corpus compilé ----------------------------------------------------------
const rules = fs.readdirSync(path.join(PLUGIN_SRC, 'rules')).filter((f) => /^RULES-[a-z-]+\.md$/.test(f)).sort();
if (!rules.length) { console.error('✗ tools/plugin/rules/ ne contient aucune fiche RULES-*.md'); process.exit(1); }
for (const f of rules) fs.copyFileSync(path.join(PLUGIN_SRC, 'rules', f), path.join(SKILL_DIR, f));
console.log(`  ${rules.length} fiches RULES-* copiées`);

// 2a. GARDE DE FRAÎCHEUR (arbitrage 2026-07-29) : une fiche condensée cite sa source
// (« Généré depuis `…-UX.md` (vX) et `…-UI.md` (vY) ») ; si la source doctrine porte
// aujourd'hui une autre version, le condensé est périmé et le paquet NE PART PAS —
// sauf dérive PRÉCISE assumée dans fraicheur.derives.json (fiche+source+versions+
// justification+vague). Une entrée dont la source a encore bougé depuis échoue aussi :
// une dérive ne grandit jamais en silence.
{
  const CONTENU_MD = path.join(RACINE, 'apps', 'site', 'content', 'md');
  const versionsSources = {}; // basename → version frontmatter
  (function indexe(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { indexe(p); continue; }
      if (!/-U[XI]\.md$/.test(f)) continue;
      const m = fs.readFileSync(p, 'utf8').match(/^version:\s*([\d.]+)/m);
      if (m) versionsSources[f] = m[1];
    }
  })(CONTENU_MD);

  const derivesFichier = path.join(PLUGIN_SRC, 'fraicheur.derives.json');
  const derives = fs.existsSync(derivesFichier)
    ? JSON.parse(fs.readFileSync(derivesFichier, 'utf8')).derives
    : [];
  const deriveDe = (fiche, source) => derives.find((d) => d.fiche === fiche && d.source === source);

  let citations = 0, aJour = 0, assumees = 0;
  const erreurs = [];
  for (const f of rules) {
    // Les citations vivent dans le chapeau (elles peuvent se replier sur 2 lignes).
    const tete = fs.readFileSync(path.join(PLUGIN_SRC, 'rules', f), 'utf8').split('\n').slice(0, 15).join('\n');
    for (const m of tete.matchAll(/`(?:[\w./-]*\/)?([A-Z][A-Z0-9-]*-U[XI])\.md`\s*\(v([\d.]+)\)/g)) {
      const source = `${m[1]}.md`, citee = m[2];
      citations++;
      const actuelle = versionsSources[source];
      if (!actuelle) { erreurs.push(`${f} cite ${source}, introuvable dans content/md/`); continue; }
      if (actuelle === citee) { aJour++; continue; }
      const d = deriveDe(f, source);
      if (!d) { erreurs.push(`${f} cite ${source} v${citee}, la source est en v${actuelle} — condensé périmé (resynchroniser, ou assumer la dérive dans fraicheur.derives.json)`); continue; }
      if (d.citee !== citee) { erreurs.push(`${f} / ${source} : la dérive assumée part de v${d.citee}, la fiche cite v${citee} — mettre fraicheur.derives.json en cohérence`); continue; }
      if (d.actuelle !== actuelle) { erreurs.push(`${f} / ${source} : dérive assumée jusqu'à v${d.actuelle}, la source est en v${actuelle} — la dérive a GRANDI, resynchroniser (ou requalifier l'entrée)`); continue; }
      assumees++;
    }
  }
  if (erreurs.length) {
    for (const e of erreurs) console.error(`✗ fraîcheur : ${e}`);
    console.error(`✗ ${erreurs.length} condensé(s) périmé(s) — paquet NON produit`);
    process.exit(1);
  }
  console.log(`  garde de fraîcheur : ${citations} citations vérifiées — ${aJour} à jour, ${assumees} dérive(s) assumée(s) (fraicheur.derives.json, résorption vague 5)`);
}

// 2bis. contrat d'implémentation @fili/react (KIT-*, généré du manifeste) ----
const { genere: genereCatalogue } = require('./genere-catalogue.js');
const cat = genereCatalogue(SKILL_DIR);
console.log(`  KIT-socle + ${cat.fichiers - 1} contrats d'intention @fili/react (${cat.composants} composants du manifeste)`);

// 2ter. livrables du contrat : tout ce que les KIT référencent DOIT être dans le paquet
const LIVRABLES = [
  [path.join(RACINE, 'FILI-COMPONENT-CONTRACT.md'), path.join(SKILL_DIR, 'FILI-COMPONENT-CONTRACT.md')],
  [path.join(RACINE, 'MISSING-COMPONENT-PROTOCOL.md'), path.join(SKILL_DIR, 'MISSING-COMPONENT-PROTOCOL.md')],
  [path.join(RACINE, 'tools', 'fili-check.mjs'), path.join(BUILD, 'fili-check.mjs')],
  [path.join(PLUGIN_SRC, 'fili-check.config.example.json'), path.join(BUILD, 'fili-check.config.example.json')],
  [path.join(PLUGIN_SRC, 'modele-fiche-manque.md'), path.join(BUILD, 'modele-fiche-manque.md')],
  [path.join(RACINE, 'packages', 'react', 'manifest.json'), path.join(BUILD, 'manifest.json')],
];
for (const [src, dst] of LIVRABLES) {
  if (!fs.existsSync(src)) { console.error(`✗ livrable manquant : ${path.relative(RACINE, src)}`); process.exit(1); }
  fs.copyFileSync(src, dst);
}
console.log(`  ${LIVRABLES.length} livrables du contrat (Contract, Protocol, fili-check + config, modèle de fiche, manifest.json)`);

// 2quater. AUTO-TEST du validateur livré : le paquet ne part jamais avec un
// fili-check qui ne détecte plus ses cas de référence (fixtures ±).
try {
  execFileSync(process.execPath, [path.join(RACINE, 'tools', 'teste-fili-check.mjs')], { stdio: 'inherit' });
} catch (e) {
  console.error('✗ auto-test de fili-check en échec — paquet NON produit');
  process.exit(1);
}

// 2quinquies. LIENS : tout fichier référencé par un KIT-* doit exister dans le paquet.
const inventaireBuild = new Set();
(function liste(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) liste(p); else inventaireBuild.add(f);
  }
})(BUILD);
let liensMorts = 0;
for (const kit of fs.readdirSync(SKILL_DIR).filter((f) => f.startsWith('KIT-'))) {
  const corps = fs.readFileSync(path.join(SKILL_DIR, kit), 'utf8');
  for (const m of corps.matchAll(/([\w][\w.-]*\.(?:md|mjs|json))\b/g)) {
    const ref = m[1];
    if (/^(tokens\.yaml|tokens\.css|package\.json)$/.test(ref)) continue; // génériques
    if (ref.endsWith('.md') && ref.startsWith('RULES-')) { if (!inventaireBuild.has(ref)) { console.error(`✗ ${kit} référence ${ref}, absent du paquet`); liensMorts++; } continue; }
    if (['FILI-COMPONENT-CONTRACT.md','MISSING-COMPONENT-PROTOCOL.md','fili-check.mjs','fili-check.config.example.json','modele-fiche-manque.md','manifest.json','KIT-socle.md'].includes(ref) || ref.startsWith('KIT-')) {
      if (!inventaireBuild.has(ref)) { console.error(`✗ ${kit} référence ${ref}, absent du paquet`); liensMorts++; }
    }
  }
}
if (liensMorts) { console.error(`✗ ${liensMorts} lien(s) documentaire(s) mort(s) — paquet NON produit`); process.exit(1); }
console.log('  liens documentaires des KIT vérifiés (0 mort)');

// 3. tokens ------------------------------------------------------------------
const { version: versionDesign } = require('./genere-tokens.js');

// 4. routeur (valide le graphe : sortie non nulle = build interrompu) --------
try {
  execFileSync(process.execPath, [path.join(PLUGIN_SRC, 'genere-routeur.js'), SKILL_DIR], {
    stdio: 'inherit',
    env: { ...process.env, DSMD_VERSION_PAQUET: manifeste.version, DSMD_VERSION_DESIGN: versionDesign },
  });
} catch (e) {
  console.error('✗ routeur en erreur — paquet NON produit (voir tools/plugin/reports/RAPPORT-ROUTEUR.md)');
  process.exit(1);
}

// 5. manifeste + README ------------------------------------------------------
fs.writeFileSync(path.join(BUILD, '.claude-plugin', 'plugin.json'), JSON.stringify(manifeste, null, 2) + '\n');
const readme = path.join(PLUGIN_SRC, 'README-paquet.md');
if (fs.existsSync(readme)) {
  fs.writeFileSync(
    path.join(BUILD, 'README.md'),
    fs.readFileSync(readme, 'utf8')
      .replace(/\{\{VERSION\}\}/g, manifeste.version)
      .replace(/\{\{VERSION_DESIGN\}\}/g, versionDesign)
      .replace(/\{\{NB_FICHES\}\}/g, String(rules.length)),
  );
}

// 6. empaquetage -------------------------------------------------------------
const { ecritZip, entreesDuDossier } = require('./zip.js');
const paquet = path.join(RACINE, 'build', `${manifeste.name}.plugin`);
try { fs.rmSync(paquet, { force: true }); } catch (e) { /* réécrit en place juste après */ }
const entrees = entreesDuDossier(BUILD);
ecritZip(paquet, entrees);
const ko = Math.round(fs.statSync(paquet).size / 1024);
console.log(`✓ ${path.relative(RACINE, paquet)} — ${entrees.length} fichiers, ${ko} Ko. Glisser dans Cowork pour installer.`);
