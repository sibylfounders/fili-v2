#!/usr/bin/env node
/**
 * verifie-sortie.js — checklist du test (spec § 7.3), analyse STATIQUE d'un .jsx généré.
 *
 * Périmètre EXACT — ce que ce script sait réellement conclure :
 *
 *  VIOLATIONS (comptées dans nbViolations) :
 *   V1 (semi-déterministe, convention de harnais) : plus d'un rang dominant par vue —
 *       Button style filled + tone primary, DÉFAUTS INCLUS, et SubmitButton.
 *   V2 (déterministe) : action présentée comme un lien — <a>/<Link> porteur d'un onClick avec :
 *       href réellement ABSENT ; ou destination LITTÉRALE factice ("", "#", "javascript:…") ;
 *       ou preventDefault visible DANS LA BALISE (quelle que soit la destination).
 *   V3 (déterministe) : surface statique cliquable — <Card> en mode static (ou défaut) avec
 *       onClick, ou <div> avec onClick.
 *
 *  SIGNAUX (assistés — signalés dans `signaux`, PAS comptés en violation) :
 *   S1 : <a>/<Link> + onClick avec destination littérale RÉELLE, ou avec une EXPRESSION
 *        DYNAMIQUE (href={member.href}, template `…${…}…`) — la destination réelle n'est pas
 *        décidable statiquement : c'est un juge qui tranche, jamais ce script.
 *
 *  NON COUVERT par ce script : le contenu d'un gestionnaire référencé ailleurs (un
 *  preventDefault dans une fonction nommée n'est pas vu) ; navigation portée par un Button
 *  (BUTTON-R02) ; contraste, focus visible, cible tactile ; tout ce qui exige une exécution.
 *
 * Usage : node verifie-sortie.js <fichier.jsx> [...]  → JSON par fichier sur stdout
 *         node verifie-sortie.js --auto-test          → tests de régression (3 V2 + 3 S1 attendus)
 */
'use strict';
const fs = require('fs');

function balises(texte, nom) {
  // Extraction par scanner : un `>` à l'intérieur d'une expression {…} (ex. une fonction
  // fléchée inline) ne termine PAS la balise — on suit la profondeur d'accolades et les chaînes.
  const out = [];
  const re = new RegExp(`<${nom}(?=[\\s/>])`, 'g');
  let m;
  while ((m = re.exec(texte))) {
    let i = m.index + m[0].length;
    let profondeur = 0;
    let chaine = null;
    while (i < texte.length) {
      const c = texte[i];
      if (chaine) {
        if (c === chaine && texte[i - 1] !== '\\') chaine = null;
      } else if (c === '"' || c === "'" || c === '`') chaine = c;
      else if (c === '{') profondeur++;
      else if (c === '}') profondeur--;
      else if (c === '>' && profondeur === 0) break;
      i++;
    }
    out.push(texte.slice(m.index + m[0].length, i).replace(/\/$/, ''));
  }
  return out;
}
const propLitterale = (props, nom) => {
  const m = props.match(new RegExp(`${nom}\\s*=\\s*(?:"([^"]*)"|\\{\\s*[\`'"]([^}]*?)[\`'"]\\s*\\})`));
  if (!m) return undefined;
  const v = m[1] ?? m[2];
  return v !== undefined && v.includes('${') ? undefined : v; // template avec ${…} = dynamique, pas littéral
};
const aAttribut = (props, nom) => new RegExp(`\\b${nom}\\s*=`).test(props);
const litteralFactice = (v) => v === '' || v === '#' || /^javascript:/i.test(v);

function analyseLien(nom, p) {
  // Retourne { violation } ou { signal } ou null (pas d'onClick).
  if (!aAttribut(p, 'onClick')) return null;
  if (/preventDefault/.test(p)) {
    return { violation: `<${nom}> avec onClick annulant la navigation (preventDefault visible dans la balise) — INTERACTION-R07 / LINK-R02` };
  }
  if (!aAttribut(p, 'href')) {
    return { violation: `<${nom}> avec onClick et sans attribut href — INTERACTION-R07 / LINK-R02` };
  }
  const litteral = propLitterale(p, 'href');
  if (litteral !== undefined) {
    if (litteralFactice(litteral)) return { violation: `<${nom}> avec onClick et destination littérale factice (href=${JSON.stringify(litteral)}) — INTERACTION-R07 / LINK-R02` };
    return { signal: `<${nom} href=${JSON.stringify(litteral)}> porte un onClick — analytics légitime ou action déguisée : à trancher par un juge` };
  }
  return { signal: `<${nom}> avec onClick et href dynamique (expression) — destination non décidable statiquement : à trancher par un juge` };
}

function verifie(fichier, texte) {
  const t = texte ?? fs.readFileSync(fichier, 'utf8');
  const violations = [];
  const signaux = [];

  // V1 — rang dominant (convention de harnais : défauts inclus)
  let dominants = 0;
  for (const p of balises(t, 'Button')) {
    const style = propLitterale(p, 'style') ?? 'filled';
    const tone = propLitterale(p, 'tone') ?? 'primary';
    if (style === 'filled' && tone === 'primary') dominants++;
  }
  dominants += balises(t, 'SubmitButton').length;
  if (dominants > 1) violations.push({ code: 'V1-dominants-multiples', classe: 'semi-déterministe', detail: `${dominants} contrôles au rang dominant (convention : filled+primary défauts inclus, SubmitButton compris) — BUTTON-R19` });

  // V2 / S1 — action présentée comme un lien
  for (const nom of ['a', 'Link']) {
    for (const p of balises(t, nom)) {
      const r = analyseLien(nom, p);
      if (!r) continue;
      if (r.violation) violations.push({ code: 'V2-action-en-lien', classe: 'déterministe', detail: r.violation });
      else signaux.push({ code: 'S1-lien-avec-onClick', classe: 'assisté', detail: r.signal });
    }
  }

  // V3 — surface statique cliquable
  for (const p of balises(t, 'Card')) {
    const mode = propLitterale(p, 'mode') ?? 'static';
    if (mode === 'static' && aAttribut(p, 'onClick')) {
      violations.push({ code: 'V3-surface-statique-cliquable', classe: 'déterministe', detail: 'Card en mode static avec onClick — INTERACTION-R10' });
    }
  }
  for (const p of balises(t, 'div')) {
    if (aAttribut(p, 'onClick')) violations.push({ code: 'V3-surface-statique-cliquable', classe: 'déterministe', detail: 'div avec onClick (surface non sémantique) — CARD-R22 / INTERACTION-R10' });
  }

  return { fichier, dominants, violations, nbViolations: violations.length, signaux };
}

// --- tests de régression (audit du 2026-07-28 : faux positif des liens dynamiques) ----------
function autoTest() {
  const cas = [
    { jsx: '<a onClick={handle}>Action</a>', attendu: 'violation', motif: 'href absent' },
    { jsx: '<a href="#" onClick={handle}>Action</a>', attendu: 'violation', motif: 'destination littérale factice' },
    { jsx: '<a href="/members/42" onClick={track}>Profil</a>', attendu: 'signal', motif: 'destination littérale réelle' },
    { jsx: '<a href={member.href} onClick={track}>Profil</a>', attendu: 'signal', motif: 'expression dynamique' },
    { jsx: '<Link href={`/members/${member.id}`} onClick={track}>Profil</Link>', attendu: 'signal', motif: 'template dynamique' },
    { jsx: '<a href={member.href} onClick={(event) => event.preventDefault()}>Action</a>', attendu: 'violation', motif: 'preventDefault visible' },
  ];
  let v = 0, s = 0, ok = true;
  for (const c of cas) {
    const r = verifie('<inline>', `export default () => (${c.jsx});`);
    const estViolation = r.violations.some((x) => x.code === 'V2-action-en-lien');
    const estSignal = r.signaux.length > 0;
    const obtenu = estViolation ? 'violation' : estSignal ? 'signal' : 'rien';
    const bon = obtenu === c.attendu && !(estViolation && estSignal);
    console.log(`  ${bon ? 'OK ' : 'RATÉ'} — ${c.motif} → ${obtenu} (attendu : ${c.attendu})   ${c.jsx}`);
    if (!bon) ok = false;
    if (estViolation) v++; else if (estSignal) s++;
  }
  console.log(`Régression : ${v} violations, ${s} signaux (attendu : 3 et 3).`);
  process.exit(ok && v === 3 && s === 3 ? 0 : 1);
}

if (process.argv[2] === '--auto-test') autoTest();
const resultats = process.argv.slice(2).map((f) => verifie(f));
console.log(JSON.stringify(resultats, null, 2));
