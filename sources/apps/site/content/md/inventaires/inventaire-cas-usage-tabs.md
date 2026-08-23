# Inventaire des cas d'usage — Tabs (vues exclusives)

> Checklist de couverture pour `TABS-UX.md`.

---

## 1. Par usage légitime (vues du même objet)

| Cas d'usage | Description | Statut |
|---|---|---|
| Fiche de doctrine | Volets « essentiel / cas d'usage / spécifications » d'un même composant | Couvert (usage moteur) |
| Réglages d'un compte | Général / sécurité / facturation d'un même compte | Couvert |
| Détail produit | Description / caractéristiques / avis d'un même produit | Couvert |
| Dossier client | Résumé / documents / historique d'un même dossier | Couvert |
| Bascule courte d'atelier | Aperçu / code d'un même composant | Couvert |
| Comparateur de plans tarifaires | Deux offres à regarder en même temps, pas l'une après l'autre | Non couvert (renvoi frontière : comparaison, pas Tabs) |

## 2. Par cas où les onglets mentent (anti-patterns)

| Cas d'usage | Description | Statut |
|---|---|---|
| Formulaire long découpé en onglets | Champs d'une même soumission répartis en volets exclusifs | Non couvert (hors périmètre, cf. TABS-UX § Nature) |
| Deux volets à comparer côte à côte | Le contenu masqué est précisément ce qu'on veut voir en même temps | Non couvert |
| Contenu cherché au Cmd+F | Le volet non monté ou masqué échappe à la recherche de page | Non couvert |
| Un seul volet disponible | Un onglet unique n'est pas un choix — habillage inutile | Non couvert |
| Étapes d'un parcours imposé | Ordre contraint, pas de bascule libre — c'est un stepper | Non couvert (hors périmètre) |
| Sujets sans rapport logés côte à côte | Les volets ne décrivent pas le même objet | Non couvert |

## 3. Par activation et clavier

| Cas d'usage | Description | Statut |
|---|---|---|
| Volets déjà en mémoire | Contenu statique, bon marché à afficher → activation `auto` | Couvert (défaut) |
| Volet coûteux à monter | Requête réseau ou calcul lourd déclenché à l'affichage → activation `manual` | Couvert |
| Balayage aux flèches | ← → circulent entre onglets, retour au premier après le dernier | Couvert |
| Origine / Fin | Sauter directement au premier ou au dernier onglet | Couvert |
| Un seul onglet tabbable | Tab entre et sort de la tablist en une seule étape | Couvert |
| Volet focalisable même vide | `tabindex="0"` sur le panneau, atteignable après l'onglet | Couvert |
| Onglet désactivé | Fonctionnalité verrouillée (plan, permission) rendue non activable | En attente — pas de token `text-disabled` formalisé (cf. TABS-UI § désactivé) |

## 4. Par contenu du volet (état, saisie, coût)

| Cas d'usage | Description | Statut |
|---|---|---|
| Formulaire en cours de saisie | La bascule ne doit pas effacer un brouillon → `keepMounted` | Couvert |
| Contenu statique texte | Aucun état à préserver → démonté par défaut | Couvert |
| Widget avec scroll interne à préserver | Position de défilement à conserver entre deux visites du volet | En attente — non tranché (garder monté ou restaurer la position ?) |
| Contenu lourd (vidéo, graphique) | Montage à la demande, pas au chargement de la page | Couvert |
| Filtre de recherche par onglet | État de filtre propre à chaque volet | Couvert |
| Badge de compteur sur un onglet | Ex. « Messages (3) » — affichage d'un nombre sur le libellé | Non couvert — absent de l'API actuelle (`Tabs.Tab` ne prend pas de slot dédié) |

## 5. Par frontière avec d'autres composants

| Cas d'usage | Description | Statut |
|---|---|---|
| Regroupement multi-ouvert | Plusieurs sections ouvertes à la fois | Non couvert ici — c'est `Accordion`, pas Tabs |
| Deep-link à l'ouverture | Un paramètre d'URL lu au montage positionne l'onglet initial | Couvert |
| Bascule qui doit être partageable par URL à chaque clic | Historique poussé à chaque changement de volet | Non couvert — c'est `navigation`, pas Tabs (renvoi frontière) |
| Superposé qui recouvre et piège | Contenu qui masque le reste de l'écran | Hors périmètre — c'est `overlay` |
| Onglets qui retombent sur deux lignes | Jeu d'onglets trop nombreux pour la largeur | Couvert — interdit, défilement horizontal imposé |
| Jeu d'onglets qui déborde | Plus d'onglets que la largeur ne peut afficher sur une ligne | Couvert (`overflow-x-auto`) ; seuil numérique non formalisé |
