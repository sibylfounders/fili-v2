# Inventaire des cas d'usage — Langage d'interaction

> Checklist de couverture de `INTERACTION-UX.md` : vérifier que chaque rôle communique une promesse
> honnête avant d'ajouter des effets.

## 1. Par intention

| Cas d'usage | Signal attendu | Couverture |
|---|---|---|
| Déclencher une action | Button identifiable, états perceptibles | Couvert par BUTTON |
| Naviguer | Link identifiable et destination explicite | Couvert par LINK |
| Saisir une donnée | zone réceptive délimitée + label | Couvert par INPUT |
| Choisir | contrôle de sélection natif | Partiel — composants dédiés à venir |
| Consulter | contenu calme, sans fausse affordance | Couvert par CARD statique |
| Comprendre un état | mot + signal visuel | Couvert par ALERT |

## 2. Par canal

| Canal | Cas limite | Couverture |
|---|---|---|
| Couleur | interface désaturée / daltonisme | Couvert — jamais seule |
| Ombre | forced-colors / faible gamme | Couvert — jamais seule |
| Hover | tactile | Couvert — renforcement seulement |
| Mouvement | reduced-motion | Couvert — information conservée |
| Vibration | indisponible ou désactivée | Couvert — supplément seulement |
| Texte | icône seule | Couvert — nom accessible |

## 3. Par incohérence à détecter

| Cas | Verdict |
|---|---|
| Button visuellement identique à un lien inline | Interdit |
| Card statique avec hover de carte cliquable | Interdit |
| Input élevé comme une action | Interdit |
| Deux composants identiques produisant action et navigation | Interdit |
| Matérialité sobre qui renforce une limite déjà accessible | Autorisé |
| Effet décoratif sans rôle fonctionnel | Hors langage d'interaction |

## Bilan

Le socle couvre Button, Link, Input, Card et Alert. La dette principale porte sur les futurs
sélecteurs (checkbox, radio, switch, segmented control), qui devront reprendre la même grille de test.
