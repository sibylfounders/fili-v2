#!/usr/bin/env node
// dist/theme-gate.mjs — barriere de contraste pour re-thematisation.
// GENERE : copie depuis tools/theme-gate.mjs par genere-tokens.js. Ne pas editer a la main.
//
// Valide qu'un theme (des VALEURS mappees sur les noms de tokens du systeme) respecte les
// normes d'accessibilite AVANT de l'appliquer. Un theme qui echoue ne s'applique pas.
// Encode le role-map + les seuils WCAG du systeme (memes seuils que tools/test-rendu.js).
//
// Usage : node theme-gate.mjs [chemin/vers/tokens.yaml|tokens.css]
//   defaut : le tokens.yaml place a cote de ce fichier.
// Code de sortie 1 si une paire echoue OU si un token critique manque.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const arg = process.argv[2];
const candidates = arg ? [resolve(arg)] : [join(here, 'tokens.yaml'), join(here, 'tokens.css')];
const file = candidates.find(existsSync);
if (!file) { console.error('theme-gate : aucun fichier de tokens trouve.'); process.exit(2); }
const src = readFileSync(file, 'utf8');

const colors = {};
if (src.indexOf('--color-') !== -1) {
  for (const m of src.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) colors[m[1]] = m[2];
} else {
  for (const line of src.split('\n')) {
    const mm = line.match(/^\s+([a-z0-9-]+)\s*:\s*"?(#[0-9a-fA-F]{6})"?/);
    if (mm) colors[mm[1]] = mm[2];
  }
}

const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = h => { const c = h.slice(1); return 0.2126*lin(parseInt(c.slice(0,2),16)) + 0.7152*lin(parseInt(c.slice(2,4),16)) + 0.0722*lin(parseInt(c.slice(4,6),16)); };
const ratio = (a, b) => { const la = lum(a), lb = lum(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };

const CHECKS = [
  ['on-primary','primary',4.5,'texte du bouton primaire'],
  ['on-primary','surface-contrast',4.5,'texte sur panneau contraste'],
  ['text-primary','background',4.5,'texte principal / fond'],
  ['text-primary','surface',4.5,'texte principal / surface'],
  ['text-secondary','background',4.5,'texte secondaire / fond'],
  ['text-secondary','surface',4.5,'texte secondaire / surface'],
  ['on-secondary','secondary',4.5,'texte sur secondary'],
  ['border-strong','background',3.0,'bordure delimitante / fond'],
  ['border-strong','surface',3.0,'bordure delimitante / surface'],
  // Anneau de focus (focus v2, 2026-07-29) : SIX crans accordés, plus un seul `accent`.
  // La ligne ['accent','background',...] testait un rôle retiré en DESIGN 1.34.0 : le gate
  // comptait un token critique MANQUANT et refusait tout thème — y compris celui de Fili.
  ['focus-primary','background',3.0,'anneau de focus (defaut) / fond'],
  ['focus-neutral','background',3.0,'anneau de focus neutral / fond'],
  ['focus-danger','background',3.0,'anneau de focus danger / fond'],
  ['focus-success','background',3.0,'anneau de focus success / fond'],
  ['focus-warning','background',3.0,'anneau de focus warning / fond'],
  ['focus-info','background',3.0,'anneau de focus info / fond'],
  ['danger','background',4.5,'danger / fond'],
  ['danger','danger-subtle',4.5,'danger / danger-subtle'],
  ['success','background',4.5,'success / fond'],
  ['success','success-subtle',4.5,'success / success-subtle'],
  ['info','background',4.5,'info / fond'],
  ['info','info-subtle',4.5,'info / info-subtle'],
  ['warning','background',4.5,'warning / fond'],
  ['warning','warning-subtle',4.5,'warning / warning-subtle'],
];

let fails = 0, missing = 0;
const outl = [];
for (const [fg, bg, min, label] of CHECKS) {
  if (!colors[fg] || !colors[bg]) {
    missing++;
    const abs = !colors[fg] ? ('--color-' + fg) : ('--color-' + bg);
    outl.push('  MANQUANT  ' + label + '  (' + abs + ' absent : garde le defaut du systeme, n\'invente pas)');
    continue;
  }
  const r = ratio(colors[fg], colors[bg]);
  const ok = r >= min;
  if (!ok) fails++;
  outl.push('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + r.toFixed(2) + ':1  (min ' + min + ')  ' + label);
}

console.log('theme-gate — ' + file);
console.log(outl.join('\n'));
if (fails || missing) {
  console.log('\n>>> Theme REFUSE : ' + fails + ' paire(s) sous le seuil, ' + missing + ' token(s) critique(s) manquant(s). Ne pas appliquer en l\'etat.');
  process.exit(1);
}
console.log('\n>>> Theme VALIDE : toutes les paires passent les seuils WCAG.');
process.exit(0);
