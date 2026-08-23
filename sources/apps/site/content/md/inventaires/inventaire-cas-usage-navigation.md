# Inventaire des cas d'usage — Navigation (pattern)

> Checklist de couverture pour `NAVIGATION-UX.md`. Pattern d'assemblage : il compose link + accordion + repères.

---

## 1. Par surface de navigation

| Cas d'usage | Description | Statut |
|---|---|---|
| Nav latérale | Destinations regroupées en accordéons dans le rail gauche | Couvert |
| Table des matières « sur cette page » | Sections de la page, entrée active qui suit la lecture | Couvert |
| Skip-link | « Aller au contenu », premier focalisable, masqué jusqu'au focus | Couvert |
| Fil d'Ariane (breadcrumb) | Chemin dans l'arborescence | Non couvert actuellement — différé |
| Barre de nav horizontale | Onglets de premier niveau en haut | Non couvert actuellement |

## 2. Par état et repère

| Cas d'usage | Description | Statut |
|---|---|---|
| Page courante | Un seul lien courant, signal non chromatique + aria-current | Couvert (délégué à link) |
| Section active (scrollspy) | L'entrée du TOC suit la section lue | Couvert |
| Nav en off-canvas | La nav latérale passe en tiroir sous les seuils du shell | Couvert (comportement délégué à overlay) |

## 3. Landmarks et clavier

| Cas d'usage | Description | Statut |
|---|---|---|
| nav étiqueté | Chaque zone de nav porte une étiquette distincte | Couvert |
| Cible du skip-link | Le contenu principal est un `main` | Couvert |
| Franchissable au clavier | Ordre logique, aucun piège de focus | Couvert (renvoi accessibility) |
