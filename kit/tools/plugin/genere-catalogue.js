#!/usr/bin/env node
'use strict';
/**
 * tools/plugin/genere-catalogue.js — le CONTRAT D'IMPLÉMENTATION @fili/react du paquet.
 *
 * Génère, depuis packages/react/manifest.json (lui-même généré du manifeste TypeScript,
 * vérifié par tsc contre les unions réelles des composants) :
 *   - KIT-socle.md : l'inventaire complet du kit + les règles de consommation ;
 *   - KIT-<slug>.md par intention (config-intentions.js → kit / kitComposants) :
 *     l'API réelle des composants dont l'intention a besoin — imports exacts, axes,
 *     valeurs, défauts, anti-patterns, exemples compilables.
 *
 * Séparation stricte : les RULES-* disent quoi CONCEVOIR (tout produit) ; les KIT-*
 * disent comment l'IMPLÉMENTER avec @fili/react (uniquement si le produit le consomme).
 * Ne jamais éditer un KIT-* à la main : corriger le manifeste, regénérer.
 */

const fs = require('fs');
const path = require('path');
const { INTENTIONS } = require('./config-intentions.js');

const RACINE = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(RACINE, 'packages', 'react', 'manifest.json');

function axeLigne(nom, a) {
  const vals = Object.entries(a.values)
    .map(([v, d]) => `\`${v}\`${a.default === v ? '*' : ''} (${d})`)
    .join(' · ');
  return `- **${nom}** [${a.kind}] : ${vals}${a.default ? ` — défaut \`${a.default}\`` : ''}\n  ${a.description}`;
}

function ficheComposant(e) {
  const L = [];
  L.push(`### ${e.name} — ${e.category} · ${e.status}`);
  L.push('```tsx\n' + e.import + '\n```');
  L.push(e.purpose);
  if (e.anatomy?.length) L.push(`Anatomie : ${e.anatomy.map((a) => `\`${a}\``).join(' › ')}`);
  if (e.axes) {
    L.push('Axes (valeur par défaut marquée *) :');
    L.push(Object.entries(e.axes).map(([n, a]) => axeLigne(n, a)).join('\n'));
  }
  if (e.props) {
    const props = Object.entries(e.props)
      .map(([n, p]) => `\`${n}\`${p.required ? ' (requis)' : ''} : ${p.type}${p.default ? ` = ${p.default}` : ''} — ${p.deprecated ? `DÉPRÉCIÉ, ${p.deprecated}` : p.description}`)
      .join(' · ');
    L.push(`Props : ${props}`);
  }
  if (e.accessibility?.length) L.push(`Accessibilité portée par le composant : ${e.accessibility.join(' ; ')}.`);
  if (e.adaptiveBehavior) L.push(`Adaptatif : ${e.adaptiveBehavior}`);
  if (e.antiPatterns?.length) L.push(`NE JAMAIS : ${e.antiPatterns.join(' ; ')}.`);
  for (const ex of e.canonicalExamples ?? []) {
    // Un exemple qui montre une INTÉGRATION déclare ses imports extérieurs : les rendre ici
    // rend l'extrait autonome pour l'agent qui le lit (même contrat que verifie-exemples).
    const entete = ex.imports?.length ? ex.imports.join('\n') + '\n\n' : '';
    L.push(`Exemple — ${ex.title} :\n\`\`\`tsx\n${entete}${ex.code}\n\`\`\``);
  }
  return L.join('\n\n');
}

function genere(outDir) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')).entries;
  const parNom = Object.fromEntries(manifest.map((e) => [e.name, e]));

  // ── KIT-socle.md : inventaire + règles de consommation ──
  const stables = manifest.filter((e) => e.status === 'stable' || e.status === 'expressif');
  const internes = manifest.filter((e) => e.status === 'interne');
  const experimentaux = manifest.filter((e) => e.status === 'experimental');
  const socle = `---
sujet: kit-socle
type: contrat-implementation
resume: Contrat d'implémentation @fili/react — inventaire réel du kit et règles de consommation. À charger UNIQUEMENT si le produit construit avec @fili/react.
---
# KIT — socle @fili/react

> GÉNÉRÉ depuis packages/react/manifest.json — ne pas éditer. Les RULES-* disent quoi
> concevoir ; ce fichier dit ce qui EXISTE dans le kit. Le manifeste est vérifié par
> TypeScript contre l'API réelle : cette liste ne peut pas mentir.

## Règles de consommation

1. **Ne recrée jamais ce que le kit fournit** : pas de \`<button>\`/\`<input>\`/\`<select>\`
   natifs stylés à la main, pas de \`<div onClick>\`, pas de carte en div+border+shadow.
   Le validateur LIVRÉ DANS CE PAQUET le détecte (AST TypeScript, fichier complet) :
   \`node fili-check.mjs . --manifest manifest.json\` depuis la racine du projet —
   à brancher avant toute publication. Configuration : copier
   \`fili-check.config.example.json\` vers \`.fili/fili-check.config.json\`.
   Sur un code qui existe déjà, le premier passage sort forcément des écarts : les
   CONSTATER une fois (fichier, règle, motif, occurrences, justification) et exiger
   ensuite que rien n'augmente vaut mieux que de repousser l'adoption — un validateur
   qu'on n'allume jamais ne protège rien. Ce qui compte est que tout écart NOUVEAU
   échoue, y compris dans un fichier créé après le constat.
2. **N'utilise jamais** les composants au statut \`interne\`${internes.length ? ` (${internes.map((e) => e.name).join(', ')})` : ''} ;
   les \`experimental\`${experimentaux.length ? ` (${experimentaux.map((e) => e.name).join(', ')})` : ' (aucun aujourd\'hui)'} ne sont pas proposés par défaut.
3. **Composant manquant** : suis MISSING-COMPONENT-PROTOCOL.md (livré dans ce paquet) —
   réutiliser → composer → qualifier → produire une fiche de manque (modèle :
   \`modele-fiche-manque.md\`, à déposer dans \`.fili/manques/<slug>.md\` de TON projet) →
   faire valider. En attendant, marque l'implémentation locale \`/* FILI-MANQUE: <slug> */\`
   (fili-check la recense au lieu de la sanctionner — sans fiche, il échoue). N'ajoute
   JAMAIS une API publique silencieusement.
4. **Axes** : mêmes mots, mêmes sens partout (FILI-COMPONENT-CONTRACT.md, livré dans ce paquet) — \`variant\`
   (facture), \`tone\` (registre), \`size\` (échelle sm/md/lg), \`status\` (état subi),
   \`mode\` (interaction des surfaces), \`density\`, \`context\`. Largeurs de contenu :
   narrow/default/wide/full. Directions : start/end. Sur Button/CompactButton, \`style\`
   est un alias DÉPRÉCIÉ de \`variant\`.
5. **Tokens** : jamais de valeur en dur si un rôle existe ; les rôles transversaux
   (\`--control-*\`, \`--field-*\`, \`--surface-*\`, \`--overlay-*\`) et les alias de
   composant (\`--button-radius\`…) portent la cascade. Le focus a UNE géométrie
   (\`.ds-focus-ring\`, outline 2px) et une couleur en cran SUBTIL accordé à la
   bordure/état (\`--control-focus-*\`, défaut primary éclairci) — n'invente jamais un anneau.

## Inventaire (${manifest.length} composants)

| Composant | Catégorie | Statut | Rôle |
|---|---|---|---|
${manifest.map((e) => `| ${e.name} | ${e.category} | ${e.status} | ${e.purpose.split('.')[0]}. |`).join('\n')}

> Détail par intention : KIT-formulaire, KIT-collection, KIT-contenu, KIT-feedback,
> KIT-creation-compte, KIT-consentement, KIT-cadre-applicatif, KIT-superpose.
`;
  fs.writeFileSync(path.join(outDir, 'KIT-socle.md'), socle);

  // ── KIT-<slug>.md par intention ──
  let n = 1;
  for (const it of INTENTIONS) {
    if (!it.kit || !it.kitComposants) continue;
    const entrees = it.kitComposants.map((nom) => {
      const e = parNom[nom];
      if (!e) throw new Error(`genere-catalogue : composant « ${nom} » (intention ${it.intention}) absent du manifeste`);
      return e;
    });
    const body = `---
sujet: kit-${it.kit}
type: contrat-implementation
resume: Contrat d'implémentation @fili/react pour l'intention « ${it.intention} » — API réelle de ${entrees.map((e) => e.name).join(', ')}.
---
# KIT — ${it.intention} (@fili/react)

> GÉNÉRÉ depuis packages/react/manifest.json — ne pas éditer. À charger avec le bundle
> de l'intention « ${it.intention} » UNIQUEMENT si le produit construit avec @fili/react.
> Les règles UX/UI restent dans les RULES-* ; ici, l'API réelle et ses exemples.

${entrees.map(ficheComposant).join('\n\n---\n\n')}
`;
    fs.writeFileSync(path.join(outDir, `KIT-${it.kit}.md`), body);
    n++;
  }
  return { fichiers: n, composants: manifest.length };
}

module.exports = { genere };

if (require.main === module) {
  const out = process.argv[2] || path.join(RACINE, 'build', 'plugin', 'skills', 'design-system-md');
  fs.mkdirSync(out, { recursive: true });
  const r = genere(out);
  console.log(`Catalogue @fili/react : KIT-socle + ${r.fichiers - 1} fiches d'intention (${r.composants} composants) → ${out}`);
}
