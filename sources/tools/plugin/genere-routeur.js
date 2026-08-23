#!/usr/bin/env node
'use strict';
/**
 * genere-routeur.js — compile le routeur de consommation IA (CLAUDE.md + AGENTS.md du paquet)
 *
 * Porté depuis `Design System MD/tools/genere-routeur.js` le 2026-07-26 : seuls les chemins et la
 * table INTENTIONS changent, la mécanique (frontmatters → graphe → poids → routeur) est identique.
 * Appelé par tools/plugin/build-plugin.js ; lançable seul :  node tools/plugin/genere-routeur.js [dossier]
 * Node sans aucune dépendance, comme les autres scripts du dossier.
 *
 * Ce que fait le script :
 *   1. Lit le frontmatter de chaque RULES-*.md du dossier de sortie (sujet, type, resume, requires, selon-contexte,
 *      et pour une extension : extension-de).
 *   2. Valide le graphe : chaque dépendance pointe vers un sujet existant ; chaque mention
 *      « RULES-x » dans le corps d'un fichier est déclarée dans son frontmatter ; chaque
 *      sujet référencé par la table des intentions existe ; chaque extension déclare un
 *      `extension-de` qui pointe vers un sujet non-extension existant.
 *   3. Calcule les poids (~tokens, estimation chars/3,6 — prose française) fichier par fichier
 *      et bundle par bundle (fermeture transitive des `requires` — les extensions n'y entrent
 *      JAMAIS automatiquement : elles ne se chargent que si le contexte du build les exige).
 *   4. Régénère CLAUDE.md (auto-lu par Claude Code) et AGENTS.md (jumeau pour
 *      Cursor, Codex, Copilot…) — jamais édités à la main.
 *
 * → Produit tools/plugin/reports/RAPPORT-ROUTEUR.md. Code de sortie 1 si au moins une erreur.
 *
 * À relancer après : tout ajout/suppression d'un RULES-*, toute modification d'un frontmatter,
 * toute évolution de la table INTENTIONS (config-intentions.js).
 *
 * NOTE ÉDITORIALE : la table INTENTIONS vit dans config-intentions.js (source unique) — c'est la
 * source de la table « Intentions → bundle » du routeur. Les dépendances, poids et périmètres
 * viennent des frontmatters ; ne dupliquez pas cette connaissance ici.
 *
 * NOTE SUR LES EXTENSIONS (2026-07-11) : un sujet `type: extension` porte un frontmatter
 * `extension-de: <sujet parent>` — il hérite des `requires` de son parent, n'entre JAMAIS dans
 * la fermeture d'un bundle d'intention (seul son parent y entre), et n'apparaît que dans la
 * colonne « Selon contexte » de la table des sujets, via le `selon-contexte` du parent. C'est le
 * mécanisme qui permet à `content/md/patterns/form/` de rester exhaustif à la source (7 extensions) sans
 * gonfler le poids chargé pour un formulaire de contact.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// La table INTENTIONS, le SOCLE universel et le HORS_PERIMETRE — la partie éditoriale —
// vivent dans config-intentions.js (source unique, partagée avec le harnais du pilote).
const { INTENTIONS, SOCLE_SUJETS, HORS_PERIMETRE } = require('./config-intentions.js');

// ---------------------------------------------------------------------------

const RACINE = path.resolve(__dirname, '..', '..');
const DIST = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(RACINE, 'build', 'plugin', 'skills', 'design-system-md');
const RAPPORT = path.join(RACINE, 'tools', 'plugin', 'reports', 'RAPPORT-ROUTEUR.md');

const erreurs = [];
const avertissements = [];

function estimeTokens(chars) { return chars / 3.6; }
function fmtK(tokens) { return '~' + (tokens / 1000).toFixed(1).replace('.', ',') + ' k'; }

// --- 1. lecture des frontmatters ------------------------------------------

function parseListe(brut) {
  // ["a", "b (raison)"] → ['a', 'b (raison)'] ; [] → []
  const m = brut.match(/"([^"]*)"/g);
  if (!m) return [];
  return m.map((s) => s.slice(1, -1));
}

function litFrontmatter(fichier, texte) {
  if (!texte.startsWith('---')) {
    erreurs.push(`${fichier} : frontmatter manquant (le routeur ne peut pas l'indexer)`);
    return null;
  }
  const fin = texte.indexOf('\n---', 3);
  if (fin === -1) {
    erreurs.push(`${fichier} : frontmatter non fermé`);
    return null;
  }
  const bloc = texte.slice(3, fin);
  const fm = {};
  for (const ligne of bloc.split('\n')) {
    const m = ligne.match(/^([a-z-]+):\s*(.*)$/);
    if (!m) continue;
    const [, cle, val] = m;
    if (cle === 'requires' || cle === 'selon-contexte') fm[cle] = parseListe(val);
    else fm[cle] = val.replace(/^"|"$/g, '');
  }
  for (const requis of ['sujet', 'type', 'resume']) {
    if (!fm[requis]) erreurs.push(`${fichier} : champ frontmatter « ${requis} » manquant`);
  }
  if (fm.type === 'extension' && !fm['extension-de']) {
    erreurs.push(`${fichier} : type=extension mais champ « extension-de » manquant`);
  }
  return fm;
}

const sujets = new Map(); // sujet → { type, resume, requires, contexte, extensionDe, tokens, fichier }

// Regex élargie aux tirets : les extensions portent des noms composés (form-multi-step).
for (const nom of fs.readdirSync(DIST).filter((f) => /^RULES-[a-z-]+\.md$/.test(f)).sort()) {
  const texte = fs.readFileSync(path.join(DIST, nom), 'utf8');
  const fm = litFrontmatter(nom, texte);
  if (!fm) continue;
  const attendu = nom.replace(/^RULES-|\.md$/g, '');
  if (fm.sujet !== attendu) erreurs.push(`${nom} : frontmatter sujet=« ${fm.sujet} » ≠ nom de fichier`);
  sujets.set(fm.sujet, {
    type: fm.type,
    resume: fm.resume,
    requires: fm.requires || [],
    contexte: fm['selon-contexte'] || [],
    extensionDe: fm['extension-de'] || null,
    tokens: estimeTokens(texte.length),
    fichier: nom,
    corps: texte,
  });
}

fs.mkdirSync(path.dirname(RAPPORT), { recursive: true });
if (!fs.existsSync(path.join(DIST, 'tokens.yaml'))) erreurs.push('tokens.yaml introuvable dans le dossier de sortie (lancer genere-tokens.js avant)');
const tokensYamlPoids = fs.existsSync(path.join(DIST, 'tokens.yaml'))
  ? estimeTokens(fs.readFileSync(path.join(DIST, 'tokens.yaml'), 'utf8').length)
  : 0;

// Poids du socle universel (principes + langage chargés pour toutes les intentions).
const poidsSocle = Object.entries(SOCLE_SUJETS).reduce((s, [su, typeAttendu]) => {
  const f = sujets.get(su);
  if (!f) erreurs.push(`socle universel : « ${su} » introuvable (RULES-${su}.md attendu — chargé pour toute intention)`);
  else if (f.type !== typeAttendu) erreurs.push(`socle universel : « ${su} » doit être de type ${typeAttendu} (type=${f.type})`);
  return s + (f ? f.tokens : 0);
}, 0);

// --- 2. validation du graphe -----------------------------------------------

function sujetDe(entree) { return entree.split(/[\s(]/)[0]; }

for (const [nom, s] of sujets) {
  for (const dep of s.requires) {
    if (!sujets.has(sujetDe(dep))) erreurs.push(`${s.fichier} : requires « ${dep} » ne correspond à aucun RULES-*`);
  }
  for (const dep of s.contexte) {
    const cible = sujets.get(sujetDe(dep));
    if (!cible) erreurs.push(`${s.fichier} : selon-contexte « ${dep} » ne correspond à aucun RULES-*`);
  }
  // toute mention RULES-x dans le corps doit être déclarée dans le frontmatter
  const declares = new Set([nom, ...s.requires.map(sujetDe), ...s.contexte.map(sujetDe)]);
  const mentions = new Set((s.corps.match(/RULES-([a-z-]+)/g) || []).map((m) => m.replace('RULES-', '')));
  for (const m of mentions) {
    if (sujets.has(m) && !declares.has(m)) {
      erreurs.push(`${s.fichier} : le corps renvoie à RULES-${m} mais le frontmatter ne le déclare pas (requires ou selon-contexte)`);
    }
  }
  // une extension déclare son parent, qui doit exister et ne pas être lui-même une extension
  if (s.type === 'extension') {
    const parent = sujets.get(s.extensionDe);
    if (!parent) erreurs.push(`${s.fichier} : extension-de « ${s.extensionDe} » ne correspond à aucun RULES-*`);
    else if (parent.type === 'extension') erreurs.push(`${s.fichier} : extension-de « ${s.extensionDe} » est lui-même une extension (chaînage interdit)`);
    else if (!parent.contexte.map(sujetDe).includes(nom)) {
      avertissements.push(`${s.fichier} : extension-de « ${s.extensionDe} » mais ${parent.fichier} ne la liste pas dans son selon-contexte — inaccessible depuis le protocole`);
    }
  }
}

for (const it of INTENTIONS) {
  for (const su of [...it.sujets, ...it.fondations, ...it.langages, ...it.principes]) {
    if (!sujets.has(su)) erreurs.push(`INTENTIONS « ${it.intention} » : sujet « ${su} » inconnu`);
    else if (sujets.get(su).type === 'extension') erreurs.push(`INTENTIONS « ${it.intention} » : « ${su} » est une extension — ne se déclare jamais dans une intention, seulement via le selon-contexte de son parent`);
  }
}

// sujets orphelins : dans aucune intention, requis par personne → juste un avertissement
const couverts = new Set();
for (const it of INTENTIONS) [...it.sujets, ...it.fondations, ...it.langages, ...it.principes].forEach((su) => couverts.add(su));
for (const s of sujets.values()) [...s.requires, ...s.contexte].forEach((d) => couverts.add(sujetDe(d)));
Object.keys(SOCLE_SUJETS).forEach((su) => couverts.add(su)); // le socle universel n'est jamais orphelin
for (const [nom, s] of sujets) {
  if (!couverts.has(nom)) avertissements.push(`sujet « ${nom} » présent dans aucune intention et référencé par personne — accessible seulement via la table des sujets`);
}

// --- 3. fermeture transitive + poids ---------------------------------------
// Les extensions ne participent JAMAIS à la fermeture d'un bundle d'intention : seul leur
// sujet parent (accédé via `requires`, jamais `selon-contexte`) peut y entrer. C'est ce qui
// garde le bundle « Formulaire » au poids du socle, extensions exclues par construction.

function fermeture(listeSujets) {
  const vus = new Set();
  const pile = [...listeSujets];
  while (pile.length) {
    const su = sujetDe(pile.pop());
    if (vus.has(su) || !sujets.has(su)) continue;
    vus.add(su);
    pile.push(...sujets.get(su).requires);
  }
  return [...vus];
}

function poidsBundle(fichiers) {
  return fichiers.reduce((somme, su) => somme + (sujets.get(su) ? sujets.get(su).tokens : 0), 0);
}

const bundles = INTENTIONS.map((it) => {
  const fichiers = fermeture([...it.sujets, ...it.fondations, ...it.langages, ...it.principes]);
  // tri : composants/patterns d'abord, puis langages, principes et fondations.
  const composants = fichiers.filter((s) => !['fondation', 'langage', 'principe'].includes(sujets.get(s).type));
  const langages = fichiers.filter((s) => sujets.get(s).type === 'langage');
  const principes = fichiers.filter((s) => sujets.get(s).type === 'principe');
  const fondations = fichiers.filter((s) => sujets.get(s).type === 'fondation');
  return { ...it, fichiers: [...composants.sort(), ...langages.sort(), ...principes.sort(), ...fondations.sort()], poids: poidsBundle(fichiers) };
});

// --- 4. génération ----------------------------------------------------------

function tableIntentions() {
  const lignes = [
    '| Intention | Déclencheurs (exemples) | Charger | Poids |',
    '|---|---|---|---|',
  ];
  for (const b of bundles) {
    const kit = b.kit ? ` · si le produit consomme @fili/react : + KIT-${b.kit}` : '';
    const charger = b.fichiers.map((s) => `RULES-${s}`).join(', ') + kit + (b.note ? ` — ${b.note}` : '');
    lignes.push(`| **${b.intention}** | ${b.declencheurs} | ${charger} | ${fmtK(b.poids)} |`);
  }
  return lignes.join('\n');
}

function tableSujets() {
  const lignes = [
    '| Sujet | Type | Périmètre | Charger avec | Selon contexte | Poids |',
    '|---|---|---|---|---|---|',
  ];
  // extension juste après pattern : c'est un raffinement du pattern, pas un registre à part
  const ordre = ['principe', 'langage', 'fondation', 'composant', 'pattern', 'flow', 'extension']; // ordre canonique des familles (Core : principe, langage, fondation ; Application : composant, pattern, flow) ; 'extension' en fin (rattachée à son parent, hors taxonomie — exception explicite).
  const tries = [...sujets.entries()].sort((a, b) =>
    ordre.indexOf(a[1].type) - ordre.indexOf(b[1].type) || a[0].localeCompare(b[0]));
  for (const [nom, s] of tries) {
    const perimetre = s.type === 'extension' ? `↳ extension de **${s.extensionDe}** — ${s.resume}` : s.resume;
    lignes.push(`| **${nom}** | ${s.type} | ${perimetre} | ${s.requires.map(sujetDe).join(', ') || '—'} | ${s.contexte.join(' ; ') || '—'} | ${fmtK(s.tokens)} |`);
  }
  return lignes.join('\n');
}

function genereRouteur(poidsSocle) {
  return `# Design System MD — routeur de consommation IA

> Généré par \`tools/plugin/genere-routeur.js\` (monorepo Fili) — ne pas éditer à la main (frontmatters des RULES-* + table INTENTIONS du script font foi).
> Deux modes : **build** (générer ou modifier de l'UI conforme — § Protocole) et **audit** (confronter une interface existante aux règles — § Mode audit).
> Socle toujours chargé (les deux modes) : ce fichier + RULES-accessibility + RULES-interaction + RULES-adaptive + RULES-cognitive-load + RULES-performance. Tout le reste se charge à la demande, via les deux tables ci-dessous.

## Protocole (mode build)

Pour « audite cet écran / ce parcours » : saute directement au § **Mode audit** plus bas — le protocole ci-dessous décrit le build.

1. Identifie l'intention du build dans la table « Intentions → bundle » et charge **uniquement** les fichiers du bundle, plus \`tokens.yaml\` — le contrat de valeurs du mode build, jamais chargé en mode audit. Plusieurs intentions dans la même demande (ex. un dashboard avec un formulaire de filtre) → union des bundles.
2. Intention absente de la table : décompose la demande en sujets (table « Sujets ») et charge chaque sujet concerné + sa colonne « Charger avec ». La colonne « Selon contexte » dit quoi ajouter si la situation décrite se présente réellement dans le build.
3. Retouche d'un composant isolé (« ajoute un bouton », « corrige ce champ ») : le RULES du composant seul + « Charger avec » — pas de bundle, sauf si la retouche touche explicitement une fondation, un langage ou un principe.
4. Retouche d'une fondation (« resserre les espacements »), d'un langage (« change la manière dont les actions se signalent ») ou d'un principe (« change la stratégie adaptative ») : charge le RULES concerné.
5. Sujet non couvert par le système (${HORS_PERIMETRE}…) : **stoppe et remonte** — ne l'improvise pas à partir des règles voisines.
6. Jamais de valeur codée en dur : toute propriété visuelle référence un token de \`tokens.yaml\`. Token manquant → remonte.
7. Si la couche source (\`apps/site/content/md/\` du dépôt Fili) est présente, ne la lis JAMAIS pendant un build — ce dossier en est la compilation à jour. N'édite jamais les fichiers de ce dossier à la main (exception consommateur : les valeurs de \`tokens.yaml\`, jamais ses noms).
8. Si une décision de design se pose au lieu d'être tranchée par une règle (choix de style ou de tone, niveau de friction, wording d'un label, conflit apparent, cas absent des RULES) : **stoppe et remonte la question en exposant les options** (2 à 4, chacune avec sa conséquence). Les lignes CONFIANCE calibrent la vitesse de remontée (établi > convergence > cas isolé > non formalisé — plus c'est faible, plus tu remontes vite).
9. Une extension (type « extension » dans la table des sujets, ex. \`form-multi-step\`) ne se charge **jamais** par défaut avec son sujet parent — uniquement quand la situation qu'elle nomme se présente réellement dans la demande (étapes, validation asynchrone, champs conditionnels, autosave, erreurs serveur détaillées, données sensibles, succès partiel). Charge le sujet parent en premier, l'extension en complément ciblé.
10. **Socle universel** : \`RULES-accessibility\`, \`RULES-interaction\`, \`RULES-adaptive\`, \`RULES-cognitive-load\` et \`RULES-performance\` sont déjà chargés pour toute intention. Ils posent respectivement le principe d'accessibilité, le langage d'interaction, le principe adaptatif, le contrat de charge cognitive et le contrat des attentes (performance perçue). Ne jamais les retirer.
11. **Si le produit construit avec \`@fili/react\`** : charge aussi \`KIT-socle\` + le \`KIT-<intention>\` de la table (contrat d'implémentation GÉNÉRÉ du manifeste du kit — imports exacts, axes, valeurs, défauts, anti-patterns, exemples compilables). Utilise ces composants tels quels : jamais de \`<button>\`/\`<input>\`/\`<select>\` recréés, jamais un composant \`interne\`. Composant manquant → protocole du manque (KIT-socle §3) : fiche de manque + validation, jamais une API publique improvisée. Si le produit ne consomme PAS @fili/react, ignore les KIT-* — les RULES-* suffisent.

## Mode audit — « audite cet écran / ce parcours »

1. Identifie l'**intention sous-jacente** de l'interface auditée (même table « Intentions → bundle ») et charge son bundle — **sans \`tokens.yaml\`** (il appartient au socle du mode build, pas au tien : ne l'ouvre pas). Les tokens, les sections « Règles techniques (UI) » et les tables de paires sont l'**implémentation de référence** de ce système : jamais des critères d'audit d'une interface tierce.
2. **Confronte, n'invente pas** : chaque constat cite la règle qui le fonde, et sépare l'observation (le fait), l'inférence (la lecture) et le constat (la confrontation). Un écran n'est déclaré « conforme » à un fichier chargé qu'après confrontation à **chaque RÈGLE** de ce fichier, une par une — les conformités se citent règle par règle, comme les écarts (le verdict « conforme » global sans passage en revue est le premier faux négatif).
3. Applique le **statut de frontière** : une **propriété universelle** (contrainte — WCAG, standards, mécanismes établis) peut fonder une non-conformité ; un **parti pris d'identité** (registres productifs de motion/voice, « jamais de disabled comme validation »…) se signale comme *divergence de registre*, à part — jamais comme un défaut ; l'implémentation de référence n'est pas un critère. Les lignes « **Frontière** » et les CONFIANCE « décision interne / non formalisé » des RULES te signalent ces partis pris explicitement — quand une règle en porte une, applique la lecture qu'elle prescrit avant de qualifier le constat.
4. Les lignes **CONFIANCE** calibrent la force du constat : établi → constat ferme ; convergence → constat argumenté ; cas isolé / non formalisé → signal prudent, jamais un verdict.
5. Ce que l'interface fait et qu'aucune règle ne couvre : constat « **non couvert** » remonté tel quel (candidat règle ou sujet) — pas de jugement improvisé. Idem pour les sujets hors périmètre (${HORS_PERIMETRE}…).
6. L'audit **ne modifie jamais** les règles qu'il évalue, et le référentiel ne devient jamais une seconde source de vérité sur l'interface auditée.
7. Le protocole outillé complet (corpus de captures, baseline gelée, empreintes SHA-256, dossier de preuve) vit dans le dépôt d'audit — ce mode couvre l'audit en contexte agent, sans chaîne de preuve.

## Intentions → bundle

${tableIntentions()}

Poids = fichiers RULES du bundle, hors socle (ce fichier + tokens.yaml + les cinq RULES universels ≈ ${fmtK(poidsSocle)} au total). Les extensions ne sont jamais incluses dans ce poids — cf. protocole, point 9. En mode audit, \`tokens.yaml\` ne se charge pas : retrancher son poids du total.

## Sujets

${tableSujets()}
`;
}

const VERSION_PAQUET = process.env.DSMD_VERSION_PAQUET || 'non versionné';
const VERSION_DESIGN = process.env.DSMD_VERSION_DESIGN || '?';

function genereSkill() {
  const declencheurs = INTENTIONS
    .map((it) => `- **${it.intention}** — ${it.declencheurs}.`)
    .join('\n');
  return `---
name: design-system-md
description: À utiliser avant de créer ou modifier de l'UI ou un parcours documenté, ou d'auditer un écran ou un parcours existant (formulaire, création de compte, dashboard/collection, page de contenu, notification/alerte, modale ou superposé, ou retouche d'un composant, d'une fondation, d'un langage ou d'un principe). Charge le contexte minimal du Design System MD via son routeur, applique ses règles UX/UI et ses tokens (build) ou les confronte à l'interface auditée (audit), et remonte les cas non couverts au lieu d'improviser.
---

# Design System MD — compétence de consommation

> Généré par \`tools/plugin/genere-routeur.js\` (monorepo Fili) — ne pas éditer à la main.
> Cette compétence **n'ajoute aucune règle** : elle branche l'agent sur la distribution
> déjà présente dans ce dossier. Le routeur (\`AGENTS.md\`/\`CLAUDE.md\`), les \`RULES-*.md\`
> et \`tokens.yaml\` font foi.

## Quand l'utiliser

${declencheurs}
- Toute **retouche** d'un composant (bouton, champ, carte, alerte), d'un pattern, d'un flow,
  d'une fondation (couleurs, espacements, rayons, typographie), d'un langage (interaction, mouvement, émotion, voix)
  ou d'un principe (accessibilité, adaptation).
- Tout **audit** d'un écran ou d'un parcours existant — le vôtre ou une interface tierce : confrontation
  aux règles via le § « Mode audit » du routeur, sans jamais improviser de critère.

## Protocole de lecture

1. Charge d'abord **\`AGENTS.md\`** (ou \`CLAUDE.md\`, contenu identique) : c'est le routeur.
2. Applique son protocole — identifie l'intention, charge **uniquement** le bundle
   correspondant, résous les \`requires\`, n'ajoute une extension que si son contexte se
   présente réellement dans la demande.
3. Toute valeur visuelle vient de **\`tokens.yaml\`** — jamais de valeur codée en dur.
4. Ne lis **pas** la couche source (\`apps/site/content/md/\` du dépôt Fili : sujets, inventaires et noyau)
   pendant un build : ce paquet en est la compilation à jour.

## Mode audit

Pour « audite cet écran / ce parcours » : suis le § « Mode audit » du routeur — bundle de
l'intention **sans** \`tokens.yaml\` (les tokens sont l'implémentation de référence, jamais un
critère d'audit), confrontation qui **cite ses règles**, statut de frontière appliqué (une
*divergence de registre* n'est pas un défaut), constats « non couverts » remontés tels quels.

## Quand une règle manque

- Sujet hors périmètre (${HORS_PERIMETRE}…) : **stoppe et remonte**, n'improvise pas à partir des règles voisines.
- Décision de design non tranchée (style/tone, niveau de friction, wording, cas absent) :
  **stoppe et remonte la question en exposant les options** (2 à 4, chacune avec sa
  conséquence) — ne tranche pas silencieusement. Les lignes \`CONFIANCE\` des RULES calibrent la vitesse de remontée
  (établi > convergence > cas isolé > non formalisé).

## Structure du paquet

Dossier plat : \`AGENTS.md\` + \`CLAUDE.md\` (le routeur — un seul est chargé selon l'agent),
\`tokens.yaml\`, les \`RULES-<sujet>.md\` de base et leurs extensions contextuelles \`form-*\` et \`creation-compte-*\`, et ce \`SKILL.md\`.
Une surface appartient au consommateur : les **valeurs** de \`tokens.yaml\` (jamais ses noms).
Tout le reste ne se modifie pas.

## Version

Paquet ${VERSION_PAQUET}, tokens DESIGN ${VERSION_DESIGN}. Régénéré par \`node tools/plugin/build-plugin.js\` depuis le monorepo Fili.

## Test d'installation

Demande « **Crée une page de login.** » La compétence est bien branchée si l'agent :
charge le seul bundle **Formulaire** ; utilise les valeurs de \`tokens.yaml\` ; ne crée
aucune couleur ou valeur visuelle arbitraire ; remonte les arbitrages non couverts au lieu
de les prendre silencieusement.

Demande « **Audite cette page de login.** » Le mode audit est bien branché si l'agent :
charge le bundle Formulaire **sans** \`tokens.yaml\` ; cite la règle fondant chaque constat ;
distingue non-conformité (propriété universelle) / divergence de registre (parti pris) /
non couvert ; ne juge jamais l'interface contre les tokens du système.
`;
}

// deux passes : le poids du socle dépend de la taille du routeur lui-même
let routeur = genereRouteur(tokensYamlPoids + poidsSocle + 1000);
routeur = genereRouteur(tokensYamlPoids + poidsSocle + estimeTokens(routeur.length));

// --- 5. rapport + écriture ---------------------------------------------------

const poidsRouteur = estimeTokens(routeur.length);
const poidsTotal = poidsBundle([...sujets.keys()]);

const lignesRapport = [
  '# RAPPORT — genere-routeur.js',
  '',
  `Sujets indexés : ${sujets.size} — erreurs : ${erreurs.length} — avertissements : ${avertissements.length}`,
  '',
  '## Poids (estimation chars/3,6)',
  '',
  `- Socle toujours chargé : routeur ${fmtK(poidsRouteur)} + tokens.yaml ${fmtK(tokensYamlPoids)} + RULES-accessibility/interaction/adaptive/cognitive-load/performance ${fmtK(poidsSocle)}`,
  `- Totalité du paquet (l'ancien pire cas) : ${fmtK(poidsTotal + tokensYamlPoids + poidsRouteur)}`,
  '',
  `- Socle universel : principe d'accessibilité + langage d'interaction + principe adaptatif + principe de charge cognitive + principe de performance perçue (${fmtK(poidsSocle)}), quelle que soit l'intention.`,
  '',
  '| Bundle | Fichiers | Poids RULES | Total chargé (avec socle) | vs tout le paquet |',
  '|---|---|---|---|---|',
];
for (const b of bundles) {
  const total = b.poids + tokensYamlPoids + poidsRouteur + poidsSocle;
  const tout = poidsTotal + tokensYamlPoids + poidsRouteur;
  lignesRapport.push(`| ${b.intention} | ${b.fichiers.length} | ${fmtK(b.poids)} | ${fmtK(total)} | −${Math.round((1 - total / tout) * 100)} % |`);
}
lignesRapport.push('');

// détail du coût de chaque extension, calculé avec SON parent et sa fermeture
const extensions = [...sujets.entries()].filter(([, s]) => s.type === 'extension');
if (extensions.length) {
  lignesRapport.push('## Extensions (chargées uniquement si le contexte les exige — hors bundle par défaut)', '');
  lignesRapport.push('| Extension | Parent | Poids seul | Total avec parent et socle |', '|---|---|---|---|');
  for (const [nom, s] of extensions) {
    const parentFerme = fermeture([s.extensionDe]);
    const totalParent = poidsBundle(parentFerme) + s.tokens + tokensYamlPoids + poidsRouteur + poidsSocle;
    lignesRapport.push(`| ${nom} | ${s.extensionDe} | ${fmtK(s.tokens)} | ${fmtK(totalParent)} |`);
  }
  lignesRapport.push('');
}

if (erreurs.length) {
  lignesRapport.push('## Erreurs', '', ...erreurs.map((e) => `- ${e}`), '');
}
if (avertissements.length) {
  lignesRapport.push('## Avertissements', '', ...avertissements.map((a) => `- ${a}`), '');
}

if (erreurs.length) {
  fs.writeFileSync(RAPPORT, lignesRapport.join('\n'));
  console.error(`✗ ${erreurs.length} erreur(s) — routeur NON régénéré. Détail : tools/plugin/reports/RAPPORT-ROUTEUR.md`);
  erreurs.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}

// Composition EXACTE des bundles — consommée par le harnais du pilote (comparaison des
// membres, pas seulement des comptes). Artefact généré.
fs.writeFileSync(path.join(RACINE, 'tools', 'plugin', 'reports', 'bundles.json'), JSON.stringify({
  _genere: 'ARTEFACT GÉNÉRÉ par genere-routeur.js — ne pas éditer.',
  socle: Object.keys(SOCLE_SUJETS).sort(),
  bundles: Object.fromEntries(bundles.map((b) => [b.intention, [...b.fichiers].sort()])),
}, null, 2));

fs.writeFileSync(path.join(DIST, 'CLAUDE.md'), routeur);
fs.writeFileSync(path.join(DIST, 'AGENTS.md'), routeur);
fs.writeFileSync(path.join(DIST, 'SKILL.md'), genereSkill());
fs.writeFileSync(RAPPORT, lignesRapport.join('\n'));

console.log(`  CLAUDE.md + AGENTS.md + SKILL.md régénérés (${sujets.size} sujets, ${INTENTIONS.length} intentions)`);
console.log(`  socle : routeur ${fmtK(poidsRouteur)} + tokens.yaml ${fmtK(tokensYamlPoids)} + 5 RULES universels ${fmtK(poidsSocle)} — tout le paquet : ${fmtK(poidsTotal + tokensYamlPoids + poidsRouteur)}`);
for (const b of bundles) {
  console.log(`  bundle ${b.intention} : ${fmtK(b.poids + tokensYamlPoids + poidsRouteur + poidsSocle)} chargés`);
}
if (extensions.length) {
  console.log(`  ${extensions.length} extension(s) (form-*, creation-compte-*) — poids détaillé dans tools/plugin/reports/RAPPORT-ROUTEUR.md`);
}
if (avertissements.length) {
  console.log(`  ${avertissements.length} avertissement(s) — voir tools/plugin/reports/RAPPORT-ROUTEUR.md`);
}
