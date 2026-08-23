# Inventaire des cas d'usage — Modal (le superposé qui interrompt)

> Checklist de couverture pour `MODAL-UX.md`. Sert à vérifier que la doctrine nomme bien chaque famille
> d'usage, chaque déclencheur, chaque mode de fermeture, chaque forme de contenu et chaque frontière — pas
> de contenu à lire en soi.

---

## 1. Par famille d'usage

| Cas d'usage | Description | Statut |
|---|---|---|
| Confirmation d'action destructive | Supprimer, révoquer, clôturer — irréversible | Couvert |
| Confirmation d'action non destructive | Publier, envoyer, archiver — engageant mais réversible | Couvert |
| Saisie courte (1 à 3 champs) | Renommer, ajouter un tag, régler une valeur unique | Couvert |
| Détail / lecture (fiche courte) | Aperçu d'un élément, résumé, détail d'un cas d'usage | Couvert |
| Formulaire long multi-champs | Inscription, réglages complets d'un objet | Non couvert — renvoyé à une page dédiée |
| Wizard multi-étapes | Séquence d'écrans vers un but | Non couvert — hors périmètre du composant, relève d'un flow |

## 2. Par déclenchement

| Cas d'usage | Description | Statut |
|---|---|---|
| Depuis un bouton d'action principal | CTA d'écran (« Supprimer », « Ajouter ») | Couvert |
| Depuis une icône d'action de ligne (table/liste) | Action rapide sur un élément | Couvert |
| Depuis un lien « en savoir plus » / « voir le détail » | Ouvre une fiche courte | Couvert |
| Depuis une notification (toast) qui invite à un détail | Le toast reste non-modal, la modale prend le relais sur clic | Couvert |
| Enchaînée depuis une autre modale (étape de confirmation interne) | Remplacement du contenu, jamais un empilement | Couvert |
| À l'arrivée sur une URL profonde (deep link) | Ouverture automatique liée au routage | Non couvert — dépend du routeur hôte, hors périmètre du composant |
| Ouverture automatique sans interaction (ex. onboarding au chargement) | Modale qui s'affiche sans déclencheur explicite | En attente — le coût d'interruption sans consentement n'est pas tranché |

## 3. Par mode de fermeture

| Cas d'usage | Description | Statut |
|---|---|---|
| Touche Échap | Fermeture clavier universelle | Couvert |
| Croix dans le header | `Modal.Close`, fermeture explicite | Couvert |
| Clic sur le voile | Équivalent d'une annulation, actif par défaut | Couvert |
| Clic sur le voile désarmé (saisie en cours) | `dismissOnScrim={false}` pour éviter une perte accidentelle | Couvert |
| Bouton « Annuler » explicite dans le Footer | Sortie nommée, à côté de l'action principale | Couvert |
| Fermeture automatique après succès de l'action | La modale se ferme d'elle-même une fois la tâche conclue | Couvert |
| Confirmation de perte de données avant fermeture (Échap/croix avec saisie non enregistrée) | Un second palier de confirmation avant de perdre une saisie | En attente — non implémenté nativement, à la charge du consommateur |

## 4. Par contenu et structure

| Cas d'usage | Description | Statut |
|---|---|---|
| Titre obligatoire + nom accessible | `Header` pose `aria-labelledby` automatiquement | Couvert |
| Sur-titre (kicker) au-dessus du titre | Contexte court avant le titre principal | Couvert |
| Contenu long avec défilement interne | Seul le `Body` défile, `Header`/`Footer` fixes | Couvert |
| Footer d'actions toujours visible | Jamais relégué en bas d'un contenu qui déborde | Couvert |
| Modale sans Footer (lecture pure) | Aucune action, fermeture par croix/Échap/voile seulement | Couvert |
| Tableau court dans la modale | Contenu tabulaire, cran `size="default"` | Couvert |
| Illustration ou média dans la modale | Image, aperçu visuel, cran `size="default"` | Couvert |

## 5. Frontières

| Cas d'usage | Description | Statut |
|---|---|---|
| Drawer | Même mécanique modale, ancrage à un bord plutôt que centré | hors périmètre — appartient à `overlay`/`drawer`, Modal ne fait que diverger sur l'ancrage |
| Toast | Notification non-modale, éphémère, aucune décision requise | hors périmètre — appartient à `toast` |
| Alert inline | Message dans le flux de la page, non superposé | hors périmètre — appartient à `alert` |
| Popover / dropdown | Superposé non-modal ancré au déclencheur | hors périmètre — appartient à `overlay`/popover |
| Modale sur modale (empilement) | Une seconde modale ouverte depuis une première | proscrit par la doctrine — jamais un cas couvert par conception |
| Page dédiée | Contenu long, autonome, navigable par URL | hors périmètre — au-delà de `grid.overlay` (640), le contenu appelle une page |
| Confirmation native du navigateur (`beforeunload`) | Avertissement natif à la fermeture d'onglet | hors périmètre — mécanisme navigateur, pas un composant du design system |
