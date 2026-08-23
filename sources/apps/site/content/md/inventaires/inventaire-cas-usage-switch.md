# Inventaire des cas d'usage — Switch (interrupteur à effet immédiat)

> Checklist de couverture pour `SWITCH-UX.md`.

---

## 1. Par usage

| Cas d'usage | Description | Statut |
|---|---|---|
| Thème clair / sombre | Basculer l'apparence tout de suite | Couvert |
| Activer une fonction | Notifications, option d'affichage — effet immédiat | Couvert |
| Réglage du rail d'outils | Grille de debug, animations, préférence | Couvert |

## 2. Frontières (ne pas confondre)

| Cas d'usage | Description | Statut |
|---|---|---|
| vs Checkbox | Sélection validée à la soumission d'un formulaire | hors périmètre — c'est une checkbox, pas un switch |
| vs Radio | Choix exclusif parmi plusieurs | hors périmètre — c'est un radio |
| Bascule qui appelle le serveur (asynchrone) | État d'attente, retour arrière si échec | Non couvert actuellement — extension différée |

## 3. Par état

| Cas d'usage | Description | Statut |
|---|---|---|
| On / Off | État lu à la position du pouce ET à la couleur | Couvert |
| Désactivé | Non focalisable, opacité réduite | Couvert |
| Avec libellé d'état | « Activé / Désactivé » quand la conséquence n'est pas évidente | Couvert |
