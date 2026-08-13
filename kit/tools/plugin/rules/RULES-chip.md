---
sujet: chip
type: composant
resume: "Renvoi compact en nuée : pointe vers une entité du système (règle, cas, constat) depuis un contexte dense ; promet une destination ou un déplacement de vue, jamais une mutation"
requires: ["interaction"]
selon-contexte: ["link (si le renvoi isolé de plein rang relève d'un Link)", "voice (libellé = entité, jamais une injonction)", "touch (cible effective en nuée dense)", "typography (mono des identifiants)"]
---
# RULES — Chip (compilé, condensé)

> Généré depuis `components/CHIP-UX.md` (v1.0.0) et `CHIP-UI.md` (v1.0.0).
> La source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Usage

- **Une chip renvoie, elle ne fait pas.** Renvoi de LECTURE — ouvrir, montrer, faire défiler
  vers — jamais une action qui crée, modifie ou supprime (ça, c'est Button).
- La chip vit en **nuée** : plusieurs renvois côte à côte dans un espace contraint (volet,
  fiche, tableau). Un renvoi isolé de plein rang prend un Link.
- **Pas un filtre, pas une saisie** : le « chip de sélection » (facettes, tags d'input) est un
  autre besoin, hors périmètre — à qualifier par le MISSING-COMPONENT-PROTOCOL s'il émerge,
  jamais par extension silencieuse de cette API.

## Wording

- Le libellé dit l'**entité**, pas l'action : « BUTTON-R12 », « Situations qui l'éprouvent » —
  jamais « Cliquer ici ». La flèche optionnelle (`→`, du texte dans le libellé) porte seule
  l'idée de déplacement et reste dans le nom accessible.
- Un identifiant technique (ID de règle, code) s'affiche en **mono** : la nature « référence »
  se lit à la forme.

## Sémantique et accessibilité

- La sémantique suit la cible : `<a href>` si la chip **navigue**, `<button>` si elle ouvre un
  volet ou déplace la vue — jamais un `<div>` cliquable (fili-check le détecte).
- Cible effective ≥ `touch.target-min` (24px) même si la facture visuelle est plus basse ;
  gap de nuée ≥ `spacing.sm`.

## UI (tokens)

- Deux factures : **outline** (fond `color.background`, filet `color.border` ; survol :
  bordure `color.primary`, texte `color.text-primary`) et **subtle** (fond `color.surface`,
  filet transparent ; survol : `color.surface-hover`).
- Texte `typography.size.xs`, `color.text-secondary` au repos ; `radius.md` ; padding
  `spacing.sm` × 4px vertical ; transitions `motion.fast`/`motion.ease-out` (couleurs
  seulement, aucun mouvement).
- **Pas de relief** : la chip ignore `[data-relief]` — un renvoi, pas un objet qu'on presse.
- Focus : géométrie unique BORDER (`.ds-focus-ring`) en `control.focus-color` (focus v2) —
  jamais un anneau local.

## Risques

| Cas | Risque | Sévérité |
|---|---|---|
| chip qui mute des données | frontière Button/Chip brouillée, attente trahie | Élevée |
| div cliquable stylé en chip | clavier et lecteur d'écran exclus | Élevée |
| chip isolée de plein rang | Link déguisé, facture injustifiée | Moyenne |
| libellé-injonction (« Voir ») | l'entité disparaît, la nuée devient illisible | Moyenne |

## Application des Languages

- **Interaction** : la chip est du côté « aller » de la frontière `INTERACTION-UX` (comme Link),
  mais en facture compacte de nuée ; le résultat perçu décide, pas la technique.
- **Voice** : libellé = nom de l'entité (`VOICE-UX`, un concept = un mot) ; l'ID technique en
  mono est la seule exception de forme admise.
- **Motion** : transition de couleurs en feedback pur (`motion.fast`, `ease-out`), supprimable
  sans perte sous `prefers-reduced-motion` ; le focus ring n'est jamais animé.
- **E-motion** : aucun instrument — un renvoi est une action à haute fréquence, hors du budget
  de rareté (`EMOTION-UX`).
