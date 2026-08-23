# Inventaire des cas d'usage — Select (choix parmi des options)

> Checklist de couverture pour `SELECT-UX.md`.

---

## 1. Par usage

| Cas d'usage | Description | Statut |
|---|---|---|
| Sélecteur de site | Passer d'un site/espace à un autre (tête du rail de nav) | Couvert |
| Réglage dans le rail d'outils | Densité, thème, préférence à effet immédiat | Couvert |
| Champ de formulaire | Un choix parmi des options, validé à la soumission | Couvert (validation = form) |
| Filtre d'une collection | Restreindre une liste affichée | Couvert |

## 2. Par contenu de la liste

| Cas d'usage | Description | Statut |
|---|---|---|
| Liste courte | Quelques options comparables d'un coup | Couvert ; à peu d'options, préférer des radios |
| Liste longue | Beaucoup d'options à déplier à la demande | Couvert (cas de référence) |
| Options groupées | Regrouper par catégorie | Non couvert actuellement |
| Recherche dans la liste (combobox éditable) | Saisie qui filtre les options | hors périmètre — différé (mono-sélection d'abord) |
| Multi-sélection | Plusieurs valeurs à la fois | hors périmètre — différé |

## 3. Par état

| Cas d'usage | Description | Statut |
|---|---|---|
| Vide (placeholder) | Aucun choix encore fait | Couvert |
| Désactivé | Non focalisable, contraste réduit assumé | Couvert |
| Erreur | Choix requis manquant | Couvert (l'orchestration vit côté form) |
| Option désactivée | Une entrée non sélectionnable dans la liste | Couvert |
