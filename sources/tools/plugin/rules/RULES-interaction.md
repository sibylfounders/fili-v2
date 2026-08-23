---
sujet: interaction
type: langage
resume: "Langage d'affordance : le rôle se reconnaît avant le style ; action, navigation, saisie, sélection, information et statut restent distincts sans dépendre d'un effet seul"
requires: []
selon-contexte: []
---
# RULES — Langage d'interaction (compilé, condensé)

> Généré depuis `languages/interaction/INTERACTION-UX.md` (v1.1.0) et
> `INTERACTION-UI.md` (v1.1.0). La source fait autorité. Ne pas éditer à la main.

## Premier principe

- **Une interface doit pouvoir être comprise avant d'être lue.** La forme, la structure, la position
  et les états indiquent le rôle ; le mot précise l'intention.
- Ce principe ne remplace jamais le texte accessible : icône seule = nom accessible ; état =
  sémantique programmatique.

## Intentions

| Intention | Composant / expression |
|---|---|
| Agir | Button |
| Naviguer | Link |
| Saisir | Input / contrôle de formulaire |
| Choisir | checkbox, radio, switch, select |
| Consulter | texte, Card statique, Panel |
| Comprendre un état | Alert, badge, message explicite |

- Deux éléments qui se ressemblent et réagissent de la même façon promettent un résultat de même
  nature. Deux rôles différents ne deviennent pas indiscernables.
- Toujours utiliser la sémantique native correspondant à l'intention.

## Lois d'affordance

- **Action** : limite et états perceptibles ; présence modulée par la hiérarchie, jamais effacée.
- **Saisie** : zone réceptive délimitée + label + focus ; jamais élevée comme une action.
- **Surface** : Card statique calme ; Card cliquable avec une cible réelle et des signaux
  supplémentaires.
- **Profondeur** : explique une couche ou un changement d'état, jamais l'importance ni la décoration.
- **Couleur** : renforce le sens, ne le crée jamais seule.
- **États** : repos, hover, focus, active, loading et disabled distincts quand ils existent. Le hover
  confirme une cible déjà reconnaissable ; le focus n'est pas une imitation du hover.

## Matérialité fonctionnelle

- Matérialité = fond, bordure, forme, position, état, mouvement ou profondeur au service d'une
  question fonctionnelle. **Aucune ombre, aucun inset, aucun gradient n'est imposé.**
- Conserver un effet seulement s'il explique : manipulable, réceptif, organisateur, superposé ou
  changement d'état. Sinon, il est décoratif et hors langage.
- Neumorphisme et glassmorphism ne sont pas le langage par défaut : effets fragiles, contrastes et
  performance à démontrer.

## Robustesse

- Le langage reste opérant en niveaux de gris, sans hover, au clavier, au zoom, en contraste forcé et
  avec mouvement réduit.
- Ombre, vibration, couleur ou animation ne sont jamais indispensables.
- Test : distinguer action/navigation/saisie/information en niveaux de gris ; reconnaître les cibles
  sans hover ; voir le focus ; vérifier que des rendus équivalents promettent des résultats équivalents.

## UI

- Actions : limite via tokens du composant, state layers existants, `motion.fast`.
- Saisie : `color.border-strong`, `color.background`, focus de la fondation Border.
- Surface statique : `elevation.none`.
- Profondeur : uniquement selon Elevation ; aucune ombre de repos créée ici.
- Focus : `border.focus-width` + `border.focus-offset`, jamais remplacé par un effet tactile.
