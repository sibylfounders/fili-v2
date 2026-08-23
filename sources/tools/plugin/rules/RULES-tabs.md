---
sujet: tabs
type: composant
resume: "Vues exclusives d'un même objet dans une tablist (ARIA APG tablist/tab/tabpanel), un seul volet monté, jamais deux lignes, activation automatique par défaut sauf coût de montage réel, onglet courant signalé par poids + trait/fond non chromatiques jamais la seule couleur, volet démonté sauf saisie à préserver, frontière stricte avec accordion et avec un changement de destination porteur d'historique"
requires: []
selon-contexte: ["radius (la piste de la variante pill figure dans la liste fermée du pill)", "voice (libellé nominal, jamais un verbe d'action)", "form (formulaire dans un volet : garder monté pour ne pas perdre la saisie)", "motion (transitions courtes de l'onglet courant ; focus jamais animé)"]
---
# RULES — Tabs (compilé, condensé)

> Généré depuis `components/TABS-UX.md` (v1.0.0) et `TABS-UI.md` (v1.1.1). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Découpe un **même objet** en **vues exclusives** (un seul volet visible), jamais des sujets distincts. Test : « le même [X] vu sous l'angle A, B, C » ?
- Illégitime si : comparaison côte à côte ; contenu à chercher au Ctrl+F (volet masqué invisible) ; un seul volet ; « volets » qui sont en fait des étapes (stepper).
- Erreur fréquente : formulaire long découpé en onglets — masque une erreur de validation sur un champ requis. Préférer sections empilées ou accordion.

## Frontière accordion / destination
- Un seul volet monté (exclusif) contre plusieurs sections ouvrables ensemble ; un usage réel qui converge vers « tout ouvrir » signale le mauvais choix.
- Change de **vue**, pas de destination : même URL, pas d'historique, Retour ignore la bascule. Deep-link = paramètre d'URL lu au montage, jamais une entrée d'historique par bascule.

## Débordement, libellé
- Jeu restreint sur **une seule ligne** ; jamais deux (casse l'exclusivité visuelle et les flèches clavier). Au-delà : défilement horizontal ou refonte. CONFIANCE : seuil numérique non formalisé.
- Libellé court, nominal — un nom, jamais un verbe d'action (« Général », pas « Voir la facturation »).

## Clavier / rôle (ARIA APG)
- `tablist` (nom accessible requis) > `tab` > `tabpanel`. Un seul `tab` dans l'ordre de tabulation (`tabindex="0"` courant, `-1` autres). Flèches gauche/droite déplacent le focus (boucle) ; Origine/Fin aux extrêmes. Volet focalisable (`tabindex="0"`), `aria-labelledby`/`aria-controls` croisés.
- Activation **auto** par défaut (le volet suit le focus) si montage bon marché ; **manuelle** (Entrée/Espace active, flèches déplacent seulement le focus) si montage coûteux (requête, calcul) — évite une rafale au balayage clavier.

## Courant, volet démonté
- Courant : canal non chromatique en plus de la couleur (poids + trait/fond porteur), jamais la couleur seule (WCAG 1.4.1) ; `aria-selected` redondant.
- Volet non courant démonté par défaut ; reste monté et masqué (`keepMounted`, `hidden`) si le volet porte une saisie à préserver.
- Sans valeur initiale, le premier onglet monté prend la main — toujours un volet visible (≠ accordion, où tout peut être fermé).

## UI (tokens)
- Tablist : `overflow-x-auto` ; `line` : séparateur `color.border`, écart `spacing.lg` ; `pill` : piste `color.background`, bordure `color.border`, `radius.pill` (liste fermée de RULES-radius — la variante est nommée d'après sa forme), écart `spacing.xs`.
- Onglet : texte `typography.body` ; repos `color.text-secondary` ; survol `color.text-primary` + trait `color.border-strong` ; courant `color.text-primary` + `typography.display.fontWeight` + trait `color.primary` (`line`) ou fond `color.surface` + `elevation.raised` (`pill`). Focus : `border.focus-width`/`border.focus-offset` en `control.focus-color` (focus v2), jamais animé ; transitions `motion.fast`/`motion.ease-out`.
- `Tabs.Root` : `value`/`onValueChange` ou `defaultValue` (jamais mélangés) ; `variant` `line`/`pill` ; `activation` `auto`/`manual`.

## Frontières
- Couleur/poids/trait → color/typography/border ; anneau de focus → border ; durées → motion ; libellé → voice ; superposé qui recouvre et piège → overlay, pas un onglet ; regroupement multi-ouvert → accordion.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Onglets sur deux lignes | Lisibilité perdue, flèches clavier cassées | Moyenne-élevée |
| Courant signalé par la seule couleur | Illisible sans perception des couleurs (WCAG 1.4.1) | Élevée |
| Formulaire long découpé en onglets | Champ requis masqué, erreur invisible | Élevée |
| Volet démonté alors qu'il porte une saisie en cours | Perte silencieuse de saisie | Moyenne-élevée |
| Historique poussé à chaque bascule | Retour cassé, attente ARIA trahie | Moyenne |

CONFIANCE : motif tablist/tab/tabpanel et clavier = établi (ARIA APG). Activation auto/manuelle et canal non chromatique = établi par convergence. Seuil de débordement = non formalisé.
