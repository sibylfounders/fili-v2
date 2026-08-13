# Inventaire des cas d'usage — Overlay (la couche au-dessus du flux)

> Checklist de couverture pour `OVERLAY-UX.md`. Sert à vérifier que la fondation nomme bien chaque superposé et chaque mécanique, pas de contenu à lire en soi.

---

## 1. Par famille de superposé

| Cas d'usage | Description | Statut |
|---|---|---|
| Drawer / off-canvas | Panneau ancré à un bord (nav mobile, réglages) — modal | Couvert (premier consommateur, lot C) |
| Modale / dialog | Boîte centrée bloquante (confirmation, formulaire court) | Couvert (mécanique posée) ; composant différé |
| Popover | Contenu ancré non-modal (détail, aide) | Couvert (contrat non-modal) ; composant différé |
| Dropdown / menu | Liste d'actions ou d'options ancrée — non-modal | Couvert (socle du Select) |
| Tooltip | Libellé au survol/focus, non interactif — non-modal | Couvert (couche la plus haute) ; composant différé |
| Toast | Notification éphémère empilée — non-modal | Déjà couvert (RULES-toast) ; reçoit z-index.toast |

## 2. Par mécanique partagée

| Cas d'usage | Description | Statut |
|---|---|---|
| Ordre d'empilement | Cinq crans z-index nommés (sticky→tooltip) | Couvert |
| Voile (scrim) | Plan sombre sous un superposé modal, clic = fermer | Couvert |
| Piège de focus | Focus qui boucle dans un modal, Échap en sort | Couvert |
| Retour du focus | Le focus revient au déclencheur à la fermeture | Couvert |
| Verrouillage du défilement | Le fond ne défile pas sous un modal | Couvert |
| Inertie du fond | Fond non focalisable / invisible au lecteur d'écran | Couvert (approché sans `inert` côté v1 DS-UI) |
| Light-dismiss | Fermeture d'un non-modal (Échap ou clic dehors) | Couvert |

## 3. Frontières

| Cas d'usage | Description | Statut |
|---|---|---|
| Ombre d'un superposé | Relief de la surface flottante | hors périmètre — appartient à `elevation` (overlay la consomme) |
| Anneau de focus interne | Focus d'un contrôle dans le superposé | hors périmètre — appartient à `border` |
| Ordre de focus général | Séquence de tabulation de la page | hors périmètre — appartient à `accessibility` |
