#!/usr/bin/env node
'use strict';
/**
 * tools/plugin/publie.js — décide s'il y a une nouvelle version du paquet à livrer, et la construit.
 *
 * Usage :
 *   npm run plugin              # ou : node tools/plugin/publie.js
 *   npm run plugin -- --minor   # nouveau sujet, nouvelle intention → 1.7.x devient 1.8.0
 *   npm run plugin -- --majeur  # rupture pour le consommateur    → 2.0.0
 *   npm run plugin -- --version=2.1.0
 *   npm run plugin -- --sans-bump   # reconstruire à la version actuelle (mise au point)
 *
 * Ce que fait le script :
 *   1. calcule l'empreinte des sources QUI ENTRENT DANS LE PAQUET (fiches, frontmatter de
 *      DESIGN.md, générateurs, README embarqué, manifeste hors version) ;
 *   2. la compare à tools/plugin/etat-publication.json — identique : il s'arrête et le dit ;
 *   3. sinon il énumère ce qui a bougé, incrémente la version (patch par défaut), reconstruit
 *      le paquet et enregistre le nouvel état.
 *
 * Le numéro de version est ce qui distingue deux paquets pour un consommateur : on ne le
 * bouge que quand le contenu livré a réellement changé, et jamais deux fois pour le même
 * contenu. `etat-publication.json` est versionné : c'est la mémoire de ce qui a été livré.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..', '..');
const PLUGIN_SRC = __dirname;
const MANIFESTE = path.join(PLUGIN_SRC, 'plugin.json');
const ETAT = path.join(PLUGIN_SRC, 'etat-publication.json');
const DESIGN = path.join(RACINE, 'apps', 'site', 'content', 'md', 'core', 'DESIGN.md');

const args = process.argv.slice(2);
const aOption = (n) => args.includes(n);
const versionImposee = (args.find((a) => a.startsWith('--version=')) || '').split('=')[1];

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

// --- empreinte des sources ---------------------------------------------------
// DESIGN.md n'entre dans le paquet QUE par son frontmatter (les tokens) : la prose du corps
// peut changer sans nouvelle version. Le manifeste entre sans son champ `version`, sinon
// chaque bump changerait l'empreinte et justifierait le bump suivant.
function empreintes() {
  const e = {};
  for (const f of fs.readdirSync(path.join(PLUGIN_SRC, 'rules')).filter((f) => f.endsWith('.md')).sort()) {
    e[`rules/${f}`] = sha(fs.readFileSync(path.join(PLUGIN_SRC, 'rules', f)));
  }
  const design = fs.readFileSync(DESIGN, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!design) { console.error('✗ frontmatter introuvable dans DESIGN.md'); process.exit(1); }
  e['DESIGN.md (tokens)'] = sha(design[1]);
  for (const f of ['build-plugin.js', 'genere-routeur.js', 'genere-tokens.js', 'config-intentions.js', 'README-paquet.md', 'theme-gate.mjs', 'zip.js']) {
    const c = path.join(PLUGIN_SRC, f);
    if (fs.existsSync(c)) e[f] = sha(fs.readFileSync(c));
  }
  const m = JSON.parse(fs.readFileSync(MANIFESTE, 'utf8'));
  const { version, ...manifesteHorsVersion } = m;
  e['plugin.json (hors version)'] = sha(JSON.stringify(manifesteHorsVersion));
  return e;
}

function bump(v, niveau) {
  const [ma, mi, pa] = v.split('.').map(Number);
  if (niveau === 'majeur') return `${ma + 1}.0.0`;
  if (niveau === 'mineur') return `${ma}.${mi + 1}.0`;
  return `${ma}.${mi}.${pa + 1}`;
}

// --- comparaison -------------------------------------------------------------
const manifeste = JSON.parse(fs.readFileSync(MANIFESTE, 'utf8'));
const courant = empreintes();
const etat = fs.existsSync(ETAT) ? JSON.parse(fs.readFileSync(ETAT, 'utf8')) : null;

if (!etat) {
  console.log(`Premier passage : la version ${manifeste.version} est prise comme référence (aucun bump).`);
} else {
  const avant = etat.empreintes || {};
  const modifies = Object.keys(courant).filter((k) => avant[k] && avant[k] !== courant[k]);
  const ajoutes = Object.keys(courant).filter((k) => !avant[k]);
  const retires = Object.keys(avant).filter((k) => !courant[k]);
  // Seul un sujet qui entre ou sort du corpus fait une version mineure : l'apparition d'une
  // nouvelle entrée d'empreinte (un générateur ajouté à la liste) n'est pas un fait de contenu.
  const sujetsBouges = [...ajoutes, ...retires].filter((k) => k.startsWith('rules/')).length;

  if (!modifies.length && !ajoutes.length && !retires.length && !aOption('--sans-bump') && !versionImposee) {
    console.log(`Rien de neuf : le paquet ${etat.version} est déjà identique aux sources.`);
    console.log(`  (livré le ${etat.date}, ${Object.keys(courant).filter((k) => k.startsWith('rules/')).length} fiches)`);
    process.exit(0);
  }

  for (const f of ajoutes) console.log(`  + ${f}`);
  for (const f of modifies) console.log(`  ~ ${f}`);
  for (const f of retires) console.log(`  − ${f}`);

  if (!aOption('--sans-bump')) {
    const niveau = versionImposee ? null
      : aOption('--majeur') || aOption('--major') ? 'majeur'
      : aOption('--minor') || aOption('--mineur') || sujetsBouges ? 'mineur'
      : 'patch';
    const nouvelle = versionImposee || bump(etat.version, niveau);
    if (!versionImposee && sujetsBouges && !aOption('--minor') && !aOption('--mineur')) {
      console.log(`  (un sujet entre ou sort du corpus → version mineure)`);
    }
    manifeste.version = nouvelle;
    fs.writeFileSync(MANIFESTE, JSON.stringify(manifeste, null, 2) + '\n');
    console.log(`Version ${etat.version} → ${nouvelle}`);
  }
}

// --- build -------------------------------------------------------------------
try {
  execFileSync(process.execPath, [path.join(PLUGIN_SRC, 'build-plugin.js')], { stdio: 'inherit' });
} catch (e) {
  console.error('✗ build en échec — état de publication inchangé.');
  process.exit(1);
}

fs.writeFileSync(ETAT, JSON.stringify({
  version: JSON.parse(fs.readFileSync(MANIFESTE, 'utf8')).version,
  date: new Date().toISOString().slice(0, 10),
  fiches: Object.keys(courant).filter((k) => k.startsWith('rules/')).length,
  empreintes: courant,
}, null, 2) + '\n');

console.log('\nÀ faire pour que ton espace passe à cette version : glisser build/design-system-md.plugin');
console.log('dans une conversation Cowork et accepter la carte (l\'installation demande toujours un geste).');
