# Manque : variabilisation du thème (espacement, typographie, élévation, mouvement)
- Statut : résolu
- Arbitrage : 2026-07-31 (Aurélien) — VALIDÉ. « L'ambiance ça n'est justement pas que la couleur » ; « sinon autant ne rien faire et juste changer les variables / tokens ». Une Galerie qui ne produirait que des variantes chromatiques n'aurait pas de raison d'exister : le pont Tailwind s'aligne sur le traitement déjà retenu pour la couleur et le rayon. Tranche livrée le jour même — cf. DECISIONS.md, 2026-07-31.
- Nature : ce n'est PAS un composant. C'est un manque de FONDATION — la fiche suit le modèle du protocole, plusieurs rubriques y sont donc lues au sens du build et non de l'anatomie. Le protocole exige un arbitrage avant toute API publique ; une fondation thémable en est une.
- Besoin rencontré : une ambiance de la Galerie (section 4, ouverte le 2026-07-31) doit pouvoir se distinguer d'une autre autrement que par sa teinte. Aujourd'hui elle ne le peut pas : sur les six axes qui font une ambiance, deux seulement se déplacent à chaud.
- Contexte réel (page, produit, capture) : sonde du 2026-07-31 sur `packages/tokens/dist/tailwind.theme.cjs`, avant toute écriture d'interface. Constat reproductible en lisant le thème généré.

## Le constat, axe par axe

| axe | tokens CSS émis | thème Tailwind | déplaçable à chaud |
|---|---|---|---|
| couleur | 83 rôles sémantiques | `var(--…)` | **oui** |
| rayon | 7 valeurs + 6 alias de composant | `var(--…)` | **oui** |
| espacement | `--space-0…section` | littéraux (`4px`, `8px`, `16px`…) | non |
| typographie | `--font-sans`, `--font-mono`, `--font-label` | littéraux (`Geist`, `JetBrains Mono`, `Inter`) | non |
| élévation | `--elevation-none…scene` | littéraux (`0 1px 3px rgba(…)`…) | non |
| mouvement | `--duration-*`, `--ease-*` | littéraux (`100ms`, `cubic-bezier(…)`) | non |

Les tokens CSS existent pour les **six** axes : `dist/tokens.css` les émet tous. C'est le pont vers Tailwind qui les gèle. Dans `packages/tokens/build/generate.mjs`, les couleurs (l. 93-100) et les rayons (l. 112-122) sont réécrits en `var(--…)` ; l'espacement (l. 111), la typographie (l. 104), l'élévation (l. 124) et le mouvement (l. 125) sont recopiés en clair.

Un seul de ces choix est justifié par écrit — le rayon, l. 112 : « Rayon THÉMABLE de bout en bout : les classes rounded-* pointent vers var(--radius-*) ». Rien n'explique pourquoi les quatre autres axes ne reçoivent pas le même traitement. **C'est une asymétrie, pas un arbitrage** — et c'est précisément ce que le protocole demande de faire remonter au lieu de contourner.

- Fréquence prévisible : à chaque ambiance, donc à chaque itération de la Galerie. Le manque n'est pas ponctuel, il est structurel : il borne l'amplitude de tout ce que la section peut produire.
- Autres consommateurs possibles : un thème client (marque blanche), un mode densité (« compact » global), un mode sobriété (mouvement réduit au-delà de `prefers-reduced-motion`), Fili Audit (comparer deux thèmes sur une même planche).

## Ce qui a été essayé avant de proposer

- **Réutiliser** : `data-theme` (clair/sombre) et `data-relief` existent déjà et fonctionnent — mais ils commutent des jeux de COULEURS. Aucun n'ouvre les quatre autres axes.
- **Composer** : surcharger `--font-sans` sur un conteneur n'a aucun effet, puisque la classe `font-sans` de Tailwind résout un littéral. Même constat pour `shadow-raised`, `duration-base`, `p-md`. La surcharge CSS ne peut pas rattraper une valeur absente du pipeline.
- **Contourner** : écrire du CSS d'ambiance hors tokens. Refusé — c'est exactement ce que la garde de la Galerie doit interdire, et ce qui ferait de la section une doctrine bis.

- Composants proches et pourquoi ils ne suffisent pas : sans objet (fondation).
- Pourquoi la composition existante ne suffit pas : voir ci-dessus — l'axe manquant est en amont de tout composant.
- Responsabilité proposée (une phrase) : rendre les six axes du thème substituables à l'exécution, comme la couleur et le rayon le sont déjà.
- Limites (ce que ça ne fera PAS) : n'ajoute AUCUNE valeur nouvelle à l'échelle (mêmes 4/8/16/24/40/64/80 px, mêmes trois familles, mêmes quatre élévations) ; ne crée aucun axe de composant ; ne rend pas le thème modifiable par un consommateur en production — seulement substituable par un scope déclaré.
- Anatomie : `generate.mjs` émet `var(--space-*)`, `var(--font-*)`, `var(--elevation-*)`, `var(--duration-*)` et `var(--ease-*)` dans le thème Tailwind, comme il le fait déjà pour `colors` et `borderRadius`. Aucune source de token ne change.
- API candidate : aucune API React. La surface publique est le jeu de variables CSS, déjà documenté.
- Tokens nécessaires (rôles existants d'abord) : aucun nouveau token pour la variabilisation elle-même.

## Un second manque, distinct et à arbitrer séparément

Il n'existe **aucune famille sérif** dans `tokens.source.mjs` : `sans` (Geist), `mono` (JetBrains Mono), `label` (Inter). Variabiliser la typographie ne suffira donc pas à produire une ambiance éditoriale — il n'y aura rien à y mettre. À noter : `label` est Inter, la police que la plupart des chartes anti-générique mettent explicitement dans leurs interdits.

Ce manque-là ajoute une VALEUR au socle, pas seulement un pont. Il relève donc d'un arbitrage propre, avec sourçage et paire UX/UI, et n'est pas couvert par cette fiche.

- Langages concernés : aucun (build).
- Règles accessibles : neutre, à une réserve près — un thème qui allongerait les durées doit rester sous `prefers-reduced-motion`. La garde existe déjà côté composants ; à re-vérifier après variabilisation.
- Comportement adaptatif : inchangé. `fontSize` reste en `clamp()`, donc fluide.
- Coût de maintenance estimé : faible en écriture (une dizaine de lignes dans `generate.mjs`), **moyen en vérification**. Le risque réel n'est pas le code, c'est la régression silencieuse : passer `4px` à `var(--space-xs)` déplace la résolution du build vers le navigateur. Tout endroit qui calculait sur la valeur littérale (`calc()`, media query, test de snapshot) doit être re-vérifié. `verifie:tokens` et `verifie:rendu` sont les gardes concernées.
- Risque de doublon : nul.
- Recommandation : **variation de fondation** — aligner les quatre axes gelés sur le traitement déjà retenu pour la couleur et le rayon, en une tranche verticale (générateur + vérification + note de doctrine expliquant pourquoi les six axes sont thémables). Le manque sérif reste ouvert, à part.

## Ce que l'arbitrage décide, en une phrase

Est-ce que Fili s'engage à ce qu'une ambiance puisse changer autre chose que la couleur — ou est-ce que la Galerie assume de ne produire que des variantes chromatiques ?
