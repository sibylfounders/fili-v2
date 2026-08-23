---
sujet: motion
type: langage
resume: "Registre productif : 3 durées / 3 courbes, mapping des micro-interactions, interdits absolus, prefers-reduced-motion obligatoire"
requires: []
selon-contexte: []
---
# RULES — Motion (compilé, condensé)

> Généré depuis `languages/motion/MOTION-UX.md` (v1.3.0) et `MOTION-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Langage temporel. Registre **productif seulement** : pas de mouvement décoratif, d'ambiance ou de célébration (pas de bounce, pas de stagger, rien n'anime au chargement de page).
- **Contrainte ≠ parti pris** : les règles WCAG (reduced-motion, flash < 3/s, transform/opacity, jamais l'info par le mouvement seul) sont non négociables ; le registre « productif seulement » est un **parti pris d'identité paramétrable** — un consommateur expressif peut le relever *sans* toucher aux contraintes (chemin sanctionné, pas une dérogation sauvage). **Lecture d'audit** : seules les contraintes fondent une non-conformité chez un hôte tiers ; le registre se signale comme *divergence*, à part.
- **Règle cardinale : le mouvement est un commentaire, jamais le texte** — il confirme, relie, occupe l'attente ; il n'informe jamais seul (l'état vit dans l'ARIA/le statique), ne bloque jamais, ne décore pas.

## Vocabulaire
- Durées : `motion.fast` (feedback : hover, press, couleur/bordure) / `motion.base` (continuité locale : chevron, apparition, dépliage) / `motion.slow` (grandes surfaces — provisionné). Tout le système < ~400ms.
- **La sortie prend le cran inférieur de son entrée** (entrée base → sortie fast).
- Courbes : `motion.ease-out` (ce qui entre) / `motion.ease-in` (ce qui sort) / `motion.ease-in-out` (sur place). **Linéaire interdit sauf rotation continue du spinner.**

## Mapping des micro-interactions
| Interaction | Durée | Courbe | Propriétés |
|---|---|---|---|
| Hover bouton (state layer) | fast | ease-out | background-color |
| Hover carte (élévation) | fast | ease-out | opacité d'un pseudo-élément à ombre pré-rendue — JAMAIS box-shadow interpolé |
| Bordure d'état input | fast | ease-out | border-color (le message d'erreur apparaît sans délai) |
| Chevron / dépliage | base | ease-in-out | transform (rotate ; dépliage : grid-rows 0fr→1fr ou mesure+transform — jamais height:auto naïf) |
| Apparition alert réactif | base | ease-out | opacity — jamais de slide qui pousse le contenu |
| Disparition alert | fast | ease-in | opacity |
| Skeleton | boucle lente | — | opacity seule ; coupé sous reduced-motion (reste visible statique) |
| Spinner | continue | linear | transform: rotate |
| **Focus ring** | **AUCUNE** | — | apparition instantanée, interdit de transition |

## Interdits absolus
- Le mouvement ne verrouille jamais l'interaction (aucune action n'attend une fin d'animation).
- Le contenu ne se déplace jamais sans action utilisateur (réserver l'espace ; insertion sous le point de lecture à défaut).
- N'animer que **transform et opacity** — jamais width/height/top/margin (layout), jamais box-shadow interpolé (paint).
- Toute transition est **interruptible et repart de l'état courant** (transitions CSS pour les états ; keyframes réservées aux boucles).
- Boucle > 5s non arrêtable hors indicateurs de chargement : interdit (WCAG 2.2.2, niveau A).
- **Flash dangereux interdit** : jamais plus de 3 flashs/s, seuils de flash général et rouge respectés (WCAG 2.3.1) — le registre productif ne flashe pas ; contrat verrouillé pour tout futur consommateur.

## prefers-reduced-motion (obligatoire)
- Déplacements/rotations/échelles : coupés (bascule instantanée ou crossfade). Opacité/couleur : conservables.
- Chevron : saute à l'orientation finale. Skeleton : statique, visible. Spinner : indicateur statique ou pulse d'opacité.
- Un bloc média global, hérité par tous — aucun composant ne le redéclare.
- Condition remplie par la règle cardinale : couper le mouvement ne coupe jamais d'information.

## Exception documentée
- Le hack autofill de l'input (`transition: background-color 9999s`) n'est pas une animation — neutralisation technique hors vocabulaire, ne consomme aucun token.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Info portée par le mouvement seul | Perte sous reduced-motion / AT | Critique |
| Flash > 3/s ou seuil rouge franchi | Crise photosensible (2.3.1) | Critique |
| reduced-motion ignoré | Troubles vestibulaires (2.3.3) | Élevée |
| Déplacement non sollicité | Cible mouvante, clics ratés | Élevée |
| Animation de layout | Saccades | Moyenne-élevée |
| Durées > ~400ms | Produit perçu lent | Moyenne |

CONFIANCE : plages 50-400ms, courbes, reduced-motion, transform/opacity = établi (Atlassian, Carbon, Material, Polaris, NN/g, MDN/web.dev, WCAG). Valeurs 100/200/300 et registre productif = décisions internes datées 2026-07-11. Toute animation hors mapping ci-dessus : STOP, remonter.
