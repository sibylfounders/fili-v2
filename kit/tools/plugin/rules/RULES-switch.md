---
sujet: switch
type: composant
resume: "Bascule d'un état booléen à EFFET IMMÉDIAT (≠ checkbox validée à la soumission) : role=switch, aria-checked, Espace bascule ; état lu à la position du pouce (jamais la seule couleur), piste pilule, glissement en motion.base"
requires: []
selon-contexte: ["radius (la piste pilule figure dans la liste fermée du pill)", "color (couleur des états on/off)", "motion (glissement du pouce, sur place)", "form (frontière : une sélection validée à la soumission est une checkbox, pas un switch)"]
---
# RULES — Switch (compilé, condensé)

> Généré depuis `components/switch/SWITCH-UX.md` (v1.0.0) et `SWITCH-UI.md` (v1.0.1). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Activer/désactiver **une fonction, tout de suite** — état booléen à **effet immédiat**.

## Switch ou checkbox
- **switch** = effet **immédiat**, rien à soumettre (réglage, mode sombre, couper une notification). **checkbox** = **sélection validée à la soumission** (options, consentement). Jamais l'un pour l'autre.
- Bascule qui peut **échouer** (appel serveur) = cas **asynchrone**, hors périmètre de cette version → remonter, ne pas improviser.

## État — jamais la seule couleur
- L'état on/off se lit d'abord à la **position** du pouce ; un **libellé d'état** (Activé/Désactivé) accompagne quand la conséquence n'est pas évidente. Le switch porte un **libellé** cliquable, partie du nom accessible.

## Rôle / clavier
- `role="switch"` + `aria-checked` ; **Espace** (et Entrée) basculent ; nom accessible = libellé visible.

## UI (tokens)
- Piste `radius.pill` (consommateur nommé dans la liste fermée de RULES-radius depuis le 2026-08-03) ; **off** : `surface` bordée `border-strong` (3:1), pouce `background` ; **on** : `primary`, pouce `on-primary`. Glissement `motion.base` / `motion.ease-in-out`, focus ring `border`, `prefers-reduced-motion` respecté. Cible tactile 44px.

## Frontières
- Couleur → `color` ; mouvement → `motion` ; focus ring → `border` ; wording → `voice` ; sélection soumise → checkbox + `form`.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Switch qui n'agit qu'après « enregistrer » | Ment sur l'immédiateté ; l'utilisateur croit avoir agi | Élevée |
| Checkbox utilisée pour un effet immédiat (ou l'inverse) | Attente trahie | Moyenne |
| État porté par la seule couleur | Illisible sans perception des couleurs (WCAG 1.4.1) | Élevée |
| Bascule asynchrone traitée comme synchrone | Échec serveur invisible, état incohérent | Élevée |

CONFIANCE : role=switch + clavier = établi (ARIA APG). Frontière switch/checkbox = consensus convergent (NN/g). Basique (on/off) ; asynchrone différé.
