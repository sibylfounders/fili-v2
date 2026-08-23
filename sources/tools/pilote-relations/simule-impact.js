#!/usr/bin/env node
/**
 * simule-impact.js — pilote relations & arbitrages (socle commun Fili)
 *
 * Simule une modification d'une règle et produit le rapport d'impact : qui est touché,
 * directement et transitivement, pourquoi, et quelle action est requise pour chacun.
 *
 * MODE SIMULATION STRICT : aucune fiche n'est lue autrement qu'à travers l'index, aucune
 * source n'est modifiée. Une relation de dépendance ne réécrit JAMAIS une règle aval —
 * le maximum produit ici est une ligne « à réexaminer humainement » dans un rapport.
 *
 * Usage :
 *   node simule-impact.js <ID> <mecanique|semantique>   # ex. INTERACTION-R07 semantique
 *
 * Prérequis : index-relations.json (généré par genere-index.js).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const id = process.argv[2];
const nature = process.argv[3];
if (!id || !['mecanique', 'semantique'].includes(nature)) {
  console.error('Usage : node simule-impact.js <ID> <mecanique|semantique>');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(path.join(__dirname, 'index-relations.json'), 'utf8'));
const regles = new Map(index.regles.map((r) => [r.id, r]));
const regle = regles.get(id);
if (!regle) {
  console.error(`« ${id} » absent de l'index (tranche : ${index.tranche.join(', ')}).`);
  process.exit(1);
}

// Cascade (spec § 4). Une modification MÉCANIQUE ne déclenche que la recompilation des
// artefacts du sujet ; une modification SÉMANTIQUE déclenche l'invalidation et la revue.
const directs = index.impactDirect[id] || [];
const transitifs = index.impactTransitif[id] || [];

const actions = []; // { element, action, pourquoi }
const sujetsTouches = new Set([regle.sujet]);

// Recompilations communes aux deux natures : l'artefact du sujet propriétaire, l'index
// relationnel, et tout artefact généré qui incorpore directement la donnée modifiée.
const recompilations = [
  { element: `RULES-${regle.sujet} (dist/build + dist/audit + paquet)`, action: 'recompiler', pourquoi: 'artefact généré du sujet propriétaire — propagation automatique' },
  { element: 'index-relations.json', action: 'recompiler', pourquoi: 'l\'index relationnel incorpore chaque règle extraite — propagation automatique' },
  { element: `artefacts incorporant directement ${id} (doctrine/${regle.sujet}.json, rapports d'impact le citant)`, action: 'recompiler', pourquoi: 'artefact généré qui incorpore la donnée modifiée — propagation automatique' },
];

if (nature === 'mecanique') {
  actions.push(...recompilations);
  // Rien d'autre : une modification mécanique ne déclenche AUCUNE réécriture ni revue
  // sémantique des règles dépendantes.
} else {
  // La règle elle-même
  if (regle.mesure) actions.push({ element: `MESURE de ${id}`, action: 'retester', pourquoi: 'la règle porte un critère vérifiable : son changement de sens peut changer ce que le contrôle constate' });
  actions.push(...recompilations);

  for (const d of directs) {
    if (d.via === 'derive-de') {
      const aval = regles.get(d.touche);
      sujetsTouches.add(aval.sujet);
      actions.push({ element: d.touche, action: 'réexaminer humainement', pourquoi: `dérive de ${id} (« ${d.pourquoi} ») — jamais réécrite automatiquement` });
      actions.push({ element: `RULES-${aval.sujet}`, action: 'recompiler', pourquoi: `sujet propriétaire de ${d.touche}` });
      if (aval.mesure) actions.push({ element: `MESURE de ${d.touche}`, action: 'retester', pourquoi: 'règle aval porteuse d\'un critère vérifiable' });
      actions.push({ element: `audits citant ${d.touche}`, action: 're-auditer', pourquoi: 'les constats passés s\'appuyaient sur une déclinaison dont l\'amont a changé de sens' });
    }
    if (d.via === 'exception-de') {
      sujetsTouches.add(regles.get(d.touche).sujet);
      actions.push({ element: d.touche, action: 'réexaminer humainement', pourquoi: `exception qui borne ${id} : la borne tient-elle encore ?` });
    }
    if (d.via === 'cede-a') {
      sujetsTouches.add(regles.get(d.touche).sujet);
      actions.push({ element: d.touche, action: 'aucune propagation', pourquoi: `pointeur de cession vers ${id} — se contente de désigner le propriétaire ; vérifier seulement que la cible existe` });
      actions.push({ element: 'routage (bundles citant le pointeur)', action: 'recompiler', pourquoi: 'la cession participe du graphe de routage' });
    }
    if (d.via === 'tension') {
      const t = index.tensions.find((x) => x.id === d.touche);
      actions.push({ element: d.touche, action: 'réexaminer humainement', pourquoi: `${id} est au pôle « ${d.pole} » de cette tension : l'arbitrage peut basculer` });
      for (const ctx of t.portee) actions.push({ element: `audits du contexte « ${ctx} »`, action: 're-auditer', pourquoi: `portée déclarée de ${d.touche}` });
    }
  }
  for (const tr of transitifs) {
    const r = regles.get(tr.touche);
    if (r) sujetsTouches.add(r.sujet);
    actions.push({ element: tr.touche, action: 'réexaminer humainement', pourquoi: `dépendance indirecte : ${tr.via}` });
  }
}

// ---------------------------------------------------------------------------
// Rapport (artefact généré)

const L = [];
L.push(`# RAPPORT D'IMPACT — ${id} (modification ${nature}, SIMULÉE)`);
L.push('');
L.push('> Artefact généré par `simule-impact.js` — la fiche source n\'a pas été modifiée ;');
L.push('> aucune règle dépendante n\'est réécrite automatiquement. Fixture de pilote, tranche :');
L.push(`> ${index.tranche.join(', ')}.`);
L.push('');
L.push(`## La règle`);
L.push('');
L.push(`\`${id}\` — sujet propriétaire : **${regle.sujet}** (\`${regle.fichier}\`), statut : ${regle.statut || 'non extrait'}, MESURE : ${regle.mesure ? 'oui' : 'non'}.`);
L.push('');
L.push('## 1. Dépendants directs');
L.push('');
if (directs.length === 0) L.push('Aucun dans la tranche.');
for (const d of directs) L.push(`- \`${d.touche}\` via \`${d.via}\`${d.pole ? ` (pôle ${d.pole})` : ''} — ${d.pourquoi}`);
L.push('');
L.push('## 2. Dépendants indirects (clôture sur les relations normatives)');
L.push('');
if (transitifs.length === 0) L.push('Aucun dans la tranche — l\'impact indirect passe par les projections (artefacts et audits ci-dessous). La profondeur transitive réelle ne se verra qu\'à mesure que les relations s\'annotent, tirées par l\'usage.');
for (const tr of transitifs) L.push(`- \`${tr.touche}\` — ${tr.via}`);
L.push('');
L.push('## 3. Sujets et composants concernés (projection calculée)');
L.push('');
L.push([...sujetsTouches].map((s) => `\`${s}\``).join(', ') + ' — agrégés depuis les règles touchées ; aucun graphe de composants maintenu à la main.');
L.push('');
L.push('## 4–6. Actions requises');
L.push('');
L.push('| Élément | Action | Pourquoi |');
L.push('|---|---|---|');
const ordre = { recompiler: 1, retester: 2, 're-auditer': 3, 'réexaminer humainement': 4, 'aucune propagation': 5 };
actions.sort((a, b) => (ordre[a.action] || 9) - (ordre[b.action] || 9));
const dejaVu = new Set();
for (const a of actions) {
  const cle = `${a.element}|${a.action}`;
  if (dejaVu.has(cle)) continue;
  dejaVu.add(cle);
  L.push(`| ${a.element} | **${a.action}** | ${a.pourquoi} |`);
}
L.push('');
L.push('Automatisable : `recompiler`, `retester`. Jamais automatisable : `réexaminer humainement`.');
L.push('');
L.push('## 7. Clôture');
L.push('');
L.push('Chaque ligne ci-dessus cite la relation qui la justifie (colonne Pourquoi). La décision prise à l\'issue des réexamens (modifier l\'aval, le confirmer, requalifier la relation) se journalise dans `DECISIONS.md` (Méthode, étape 8).');
L.push('');

const sortie = path.join(__dirname, `RAPPORT-IMPACT-${id}${nature === 'mecanique' ? '-mecanique' : ''}.md`);
fs.writeFileSync(sortie, L.join('\n'));
console.log(`${sortie} généré — ${directs.length} dépendant(s) direct(s), ${transitifs.length} indirect(s), ${dejaVu.size} action(s).`);
