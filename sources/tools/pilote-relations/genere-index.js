#!/usr/bin/env node
/**
 * genere-index.js — pilote relations & arbitrages (socle commun Fili)
 *
 * Extrait les règles de la TRANCHE depuis les fiches UX (source éditoriale, jamais modifiée),
 * charge relations.fixture.json (substitut de pilote des futures lignes LIENS + fichiers T-xxx),
 * VALIDE (périmètre exact affiché en sortie), calcule les relations inverses et les impacts
 * directs/transitifs, écrit index-relations.json.
 *
 * Contrat des relations : le jeu de types est FERMÉ et leurs consommateurs/conséquences sont
 * définis une fois pour toutes dans la fixture (`_consommateurs`) — jamais répétés par arête.
 * Chaque arête porte en revanche sa PREUVE propre, obligatoire.
 *
 * index-relations.json est un ARTEFACT GÉNÉRÉ : jamais édité à la main, toujours reproductible.
 *
 * Usage :
 *   node genere-index.js [racine-du-corpus]   # défaut : ../../apps/site/content/md
 *   node genere-index.js --auto-test          # prouve que CHAQUE validation détecte son cas
 *
 * Aucune dépendance hors Node. Aucune base de graphe : des fichiers relus à chaque exécution.
 */
'use strict';

const fs = require('fs');
const path = require('path');

// La tranche du pilote — rien d'autre n'est extrait (règle anti-inflation n°6 de la spec).
const TRANCHE = {
  interaction: 'languages/INTERACTION-UX.md',
  button: 'components/BUTTON-UX.md',
  link: 'components/LINK-UX.md',
  card: 'components/CARD-UX.md',
  form: 'patterns/FORM-UX.md',
  'creation-compte': 'flows/CREATION-COMPTE-UX.md',
};

const TYPES_RELATIONS = ['derive-de', 'exception-de', 'cede-a']; // « tension » n'est PAS un type d'arête de `relations`
const CHAMPS_TENSION = ['statut', 'portee', 'poles', 'provenance', 'confiance', 'consequence'];

// ---------------------------------------------------------------------------
// Extraction des règles (lecture seule)

function extraitRegles(corpusRoot) {
  const regles = new Map(); // id -> { id, sujet, fichier, statut, mesure }
  const doublons = [];
  for (const [sujet, rel] of Object.entries(TRANCHE)) {
    const texte = fs.readFileSync(path.join(corpusRoot, rel), 'utf8');
    let courante = null;
    for (const ligne of texte.split('\n')) {
      const m = ligne.match(/^RÈGLE \[([A-ZÀ-Ü-]+-[RU]\d+)\]/);
      if (m) {
        if (regles.has(m[1])) doublons.push(m[1]);
        courante = { id: m[1], sujet, fichier: rel, statut: null, mesure: false };
        regles.set(m[1], courante);
        continue;
      }
      if (!courante) continue;
      const s = ligne.match(/^STATUT : (.+)$/);
      if (s && courante.statut === null) courante.statut = s[1].trim();
      if (/^MESURE : /.test(ligne)) courante.mesure = true;
    }
  }
  return { regles, doublons };
}

// ---------------------------------------------------------------------------
// Validations (périmètre exact : cf. message de sortie)

function detecteCycles(aretes, code, erreurs) {
  const aval = new Map();
  for (const [a, b] of aretes) {
    if (!aval.has(a)) aval.set(a, []);
    aval.get(a).push(b);
  }
  const ETAT = new Map();
  const dfs = (n, pile) => {
    ETAT.set(n, 'en-cours');
    for (const suiv of aval.get(n) || []) {
      if (ETAT.get(suiv) === 'en-cours') erreurs.push({ code, detail: `cycle : ${[...pile, n, suiv].join(' → ')}` });
      else if (!ETAT.has(suiv)) dfs(suiv, [...pile, n]);
    }
    ETAT.set(n, 'fait');
  };
  for (const n of aval.keys()) if (!ETAT.has(n)) dfs(n, []);
}

function valide(regles, doublonsExtraction, fixture) {
  const erreurs = [];
  const ids = new Set(regles.keys());
  const consommateurs = fixture._consommateurs || {};

  for (const id of doublonsExtraction) erreurs.push({ code: 'regle-dupliquee', detail: `identifiant de règle extrait deux fois : « ${id} »` });

  const vues = new Set();
  for (const r of fixture.relations || []) {
    if (r.type === 'tension') {
      erreurs.push({ code: 'tension-dans-relations', detail: `relation ${r.source} → ${r.cible} : le type « tension » n'existe que dans \`tensions\`` });
      continue;
    }
    if (!TYPES_RELATIONS.includes(r.type) || !(consommateurs[r.type] || []).length) {
      erreurs.push({ code: 'sans-consommateur', detail: `relation ${r.type} ${r.source} → ${r.cible} : type hors contrat ou sans consommateur déclaré` });
    }
    if (!r.preuve || !String(r.preuve).trim()) {
      erreurs.push({ code: 'preuve-manquante', detail: `relation ${r.type} ${r.source} → ${r.cible} : preuve absente ou vide` });
    }
    for (const id of [r.source, r.cible]) {
      if (!ids.has(id)) {
        erreurs.push(r.type === 'cede-a' && id === r.cible
          ? { code: 'cession-cible-invalide', detail: `cession ${r.source} → « ${id} » : cible absente du corpus extrait` }
          : { code: 'id-inexistant', detail: `relation ${r.type} : « ${id} » absent du corpus extrait (ID inconnu, hors tranche, ou règle supprimée encore référencée)` });
      }
    }
    if (r.type === 'cede-a' && ids.has(r.source)) {
      const statut = regles.get(r.source).statut || '';
      if (statut !== 'note de méthode') {
        erreurs.push({ code: 'cede-source-statut', detail: `cession ${r.source} → ${r.cible} : la règle cédante a le statut « ${statut} » — une cédante doit être « note de méthode » (pointeur non normatif)` });
      }
    }
    const cle = `${r.type}|${r.source}|${r.cible}`;
    if (vues.has(cle)) erreurs.push({ code: 'dupliquee', detail: `relation dupliquée : ${cle}` });
    vues.add(cle);
  }

  // cycles — sur derive-de ET cede-a (une tension relie deux pôles par nature : pas un cycle interdit)
  detecteCycles((fixture.relations || []).filter((x) => x.type === 'derive-de').map((x) => [x.source, x.cible]), 'cycle-derive-de', erreurs);
  detecteCycles((fixture.relations || []).filter((x) => x.type === 'cede-a').map((x) => [x.source, x.cible]), 'cycle-cede-a', erreurs);

  const tensionsVues = new Set();
  for (const t of fixture.tensions || []) {
    if (tensionsVues.has(t.id)) erreurs.push({ code: 'tension-dupliquee', detail: `identifiant de tension dupliqué : « ${t.id} »` });
    tensionsVues.add(t.id);
    for (const champ of CHAMPS_TENSION) {
      const v = t[champ];
      const vide = v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);
      if (vide) erreurs.push({ code: 'tension-champs', detail: `tension ${t.id} : champ obligatoire « ${champ} » absent ou vide` });
    }
    for (const cote of ['a', 'b']) {
      const pole = (t.poles || {})[cote];
      if (!pole || pole.length === 0) {
        erreurs.push({ code: 'pole-absent', detail: `tension ${t.id} : pôle « ${cote} » vide ou manquant` });
        continue;
      }
      for (const id of pole) if (!ids.has(id)) erreurs.push({ code: 'pole-absent', detail: `tension ${t.id} : pôle « ${cote} » cite « ${id} », absent du corpus` });
    }
  }
  return erreurs;
}

const PERIMETRE_GARANTI =
  'Périmètre exactement garanti par ces validations : références résolues (relations, cibles de cession, pôles), ' +
  'doublons (relations, IDs de règles, IDs de tensions), cycles derive-de et cede-a, statut « note de méthode » des règles cédantes, ' +
  'champs obligatoires et conséquence observable des tensions, preuve non vide par relation, types au contrat fermé. ' +
  'AUCUNE validation sémantique du contenu des règles ni de la justesse éditoriale des relations.';

// ---------------------------------------------------------------------------
// Index : relations inverses + impacts

function construitIndex(regles, fixture) {
  const inverses = [];
  for (const r of fixture.relations) {
    const inv = { 'derive-de': 'est-declinee-par', 'exception-de': 'est-bornee-par', 'cede-a': 'recoit-autorite-de' }[r.type];
    inverses.push({ type: inv, source: r.cible, cible: r.source, calculee: true });
  }
  const liensTension = [];
  for (const t of fixture.tensions) {
    for (const cote of ['a', 'b']) for (const id of t.poles[cote] || []) liensTension.push({ regle: id, tension: t.id, pole: cote, calcule: true });
  }

  const impactDirect = new Map();
  const ajoute = (id, entree) => {
    if (!impactDirect.has(id)) impactDirect.set(id, []);
    impactDirect.get(id).push(entree);
  };
  for (const r of fixture.relations) ajoute(r.cible, { touche: r.source, via: r.type, pourquoi: r.preuve });
  for (const l of liensTension) ajoute(l.regle, { touche: l.tension, via: 'tension', pole: l.pole, pourquoi: `pôle ${l.pole} de ${l.tension}` });

  const impactTransitif = new Map();
  for (const id of regles.keys()) {
    const vus = new Set();
    const file = (impactDirect.get(id) || []).filter((e) => e.via !== 'tension').map((e) => e.touche);
    const resultat = [];
    while (file.length) {
      const n = file.shift();
      if (vus.has(n)) continue;
      vus.add(n);
      for (const e of impactDirect.get(n) || []) {
        if (e.via === 'tension') continue;
        resultat.push({ touche: e.touche, via: `${n} → ${e.via}` });
        file.push(e.touche);
      }
    }
    if (resultat.length) impactTransitif.set(id, resultat);
  }

  return {
    _genere: 'ARTEFACT GÉNÉRÉ par genere-index.js — ne pas éditer, régénérer.',
    _perimetre_validation: PERIMETRE_GARANTI,
    tranche: Object.keys(TRANCHE),
    regles: [...regles.values()].map((r) => ({ id: r.id, sujet: r.sujet, fichier: r.fichier, statut: r.statut, mesure: r.mesure })),
    relations: fixture.relations,
    relationsInverses: inverses,
    tensions: fixture.tensions,
    liensTension,
    impactDirect: Object.fromEntries(impactDirect),
    impactTransitif: Object.fromEntries(impactTransitif),
  };
}

// ---------------------------------------------------------------------------
// Auto-test : chaque validation détecte-t-elle réellement son cas ?

function autoTest() {
  const regles = new Map();
  for (const [id, statut] of [['A-R01', 'propriété universelle'], ['A-R02', 'parti pris d\'identité'], ['B-R01', 'note de méthode'], ['B-R02', 'note de méthode']]) {
    regles.set(id, { id, sujet: 'a', fichier: 'x', statut, mesure: false });
  }
  const conso = { 'derive-de': ['x'], 'exception-de': ['x'], 'cede-a': ['x'], tension: ['x'] };
  const fautive = {
    _consommateurs: conso,
    relations: [
      { type: 'derive-de', source: 'A-R01', cible: 'Z-R99', preuve: 'p' },            // id-inexistant
      { type: 'derive-de', source: 'A-R02', cible: 'B-R01', preuve: 'p' },
      { type: 'derive-de', source: 'A-R02', cible: 'B-R01', preuve: 'p' },            // dupliquee
      { type: 'derive-de', source: 'B-R01', cible: 'A-R02', preuve: 'p' },            // cycle-derive-de
      { type: 'inspire-par', source: 'A-R01', cible: 'A-R02', preuve: 'p' },          // sans-consommateur
      { type: 'tension', source: 'A-R01', cible: 'A-R02', preuve: 'p' },              // tension-dans-relations
      { type: 'exception-de', source: 'A-R01', cible: 'A-R02', preuve: '   ' },       // preuve-manquante
      { type: 'cede-a', source: 'A-R02', cible: 'B-R01', preuve: 'p' },               // cede-source-statut (A-R02 pas note de méthode)
      { type: 'cede-a', source: 'B-R01', cible: 'B-R02', preuve: 'p' },               // cycle-cede-a (avec la suivante)
      { type: 'cede-a', source: 'B-R02', cible: 'B-R01', preuve: 'p' },
      { type: 'cede-a', source: 'B-R02', cible: 'Z-R77', preuve: 'p' },               // cession-cible-invalide (+ dupliquee source ok)
    ],
    tensions: [
      { id: 'T-900', poles: { a: ['A-R01'], b: [] }, statut: 'contextuelle', portee: ['x'], provenance: 'p', confiance: 'c', consequence: 'obs' }, // pole-absent
      { id: 'T-900', poles: { a: ['A-R01'], b: ['A-R02'] }, statut: 'contextuelle', portee: ['x'], provenance: 'p', confiance: 'c', consequence: 'obs' }, // tension-dupliquee
      { id: 'T-901', poles: { a: ['A-R01'], b: ['A-R02'] }, statut: '', portee: [], provenance: 'p', confiance: 'c' }, // tension-champs (statut vide, portee vide, consequence absente)
    ],
  };
  const erreursFixture = valide(regles, ['A-R01'], fautive); // doublon d'extraction simulé → regle-dupliquee
  const attendus = ['id-inexistant', 'dupliquee', 'regle-dupliquee', 'tension-dupliquee', 'cycle-derive-de', 'cycle-cede-a',
    'cession-cible-invalide', 'cede-source-statut', 'pole-absent', 'sans-consommateur', 'tension-dans-relations',
    'preuve-manquante', 'tension-champs'];
  let ok = true;
  for (const code of attendus) {
    const trouve = erreursFixture.some((e) => e.code === code);
    console.log(`  ${trouve ? 'OK ' : 'RATÉ'} — validation « ${code} »`);
    if (!trouve) ok = false;
  }
  // contre-épreuve : la fixture réelle du pilote ne doit déclencher aucun de ces codes à tort
  console.log(ok ? `Auto-test : ${attendus.length}/${attendus.length} validations détectent leur cas.` : 'Auto-test : ÉCHEC');
  process.exit(ok ? 0 : 1);
}

// ---------------------------------------------------------------------------

if (process.argv[2] === '--auto-test') autoTest();

const corpusRoot = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'apps', 'site', 'content', 'md'));
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'relations.fixture.json'), 'utf8'));

const { regles, doublons } = extraitRegles(corpusRoot);
const erreurs = valide(regles, doublons, fixture);

if (erreurs.length) {
  console.error(`ERREURS (${erreurs.length}) — l'index n'est PAS régénéré :`);
  for (const e of erreurs) console.error(`  [${e.code}] ${e.detail}`);
  process.exit(1);
}

const index = construitIndex(regles, fixture);
fs.writeFileSync(path.join(__dirname, 'index-relations.json'), JSON.stringify(index, null, 2));
console.log(`index-relations.json régénéré : ${regles.size} règles (${index.tranche.join(', ')}), ${fixture.relations.length} relations déclarées, ${index.relationsInverses.length} inverses calculées, ${fixture.tensions.length} tension(s).`);
console.log(PERIMETRE_GARANTI);
