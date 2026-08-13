# Inventaire des cas d'usage — Card (carte)

> Miroir des inventaires bouton et input. Sert de checklist de couverture pour `CARD-UX.md`, pas de contenu à lire en soi. Le test de couverture a été fait immédiatement après la première rédaction de CARD-UX.md (contrairement au bouton où il est venu après coup) — les corrections issues du test sont marquées "couvert après test".

---

## 1. Par rôle / type de contenu

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Carte de contenu (article, post) | Aperçu + point d'entrée vers le détail | Cas de référence, le plus documenté |
| Carte produit (e-commerce) | Image, prix, action d'achat | Tension carte cliquable / bouton interne, couvert (mode clickable + zone d'actions) |
| Carte de navigation (dashboard tile) | Toute la surface mène à une section | Couvert (mode clickable) |
| Carte-option (plan tarifaire, configuration) | Sélection simple ou multiple | Couvert (mode selectable) |
| Carte-statistique / KPI | Chiffre + libellé + tendance | Couvert (contexte dashboard) |
| Carte profil / contact | Avatar, nom, métadonnées | Couvert partiellement (slot header/avatar, ratio square) — pas de fiche dédiée |
| Carte promotionnelle / alert | Message mis en avant, dismissable | **Volontairement hors périmètre** — autre composant (alert/banner), cf. note de transposition sur l'absence de tone |
| Carte tâche (kanban) | Déplaçable entre colonnes | **Non couvert actuellement** — signalé dans "À approfondir" |

## 2. Par conteneur / contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Grille uniforme | Cas de référence | Couvert en détail |
| Liste verticale (cartes empilées) | Lecture séquentielle, disposition horizontale possible | Couvert |
| Dashboard (tailles mixtes) | La hiérarchie vient de la taille en grille | Couvert |
| Carrousel horizontal | Défilement latéral, débordement | Couverture partielle — signalé "À approfondir" |
| Masonry (hauteurs variables) | Grille type Pinterest | **Non couvert actuellement** — contredit partiellement la règle d'alignement, la tension mériterait d'être tranchée |
| Carte dans une modale / side panel | Espace contraint | **Non couvert actuellement** — densité compact s'applique probablement, jamais explicité |
| Feed social (flux infini) | Défilement long, chargement progressif | Couvert partiellement (skeleton) — la virtualisation reste hors scope |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Statique | Conteneur d'information | Couvert (mode static) |
| Cliquable entière | Navigation | Couvert (mode clickable) |
| Sélectionnable | Choix d'option | Couvert (mode selectable) |
| Extensible | Révéler du contenu secondaire | Couvert (mode expandable) |
| Loading / skeleton | Chargement de la collection | **Couvert après test** — absent de la première rédaction alors que le loading state du bouton était documenté depuis le début ; même angle mort que la validation asynchrone de l'input |
| Collection vide (empty state) | Première utilisation, sans résultat, erreur | Couvert |
| Carte draggable | Réordonnancement, kanban | **Non couvert actuellement** |
| Carte dismissable | L'utilisateur peut la fermer définitivement | **Non couvert actuellement** — pourtant présent dans le benchmark (Polaris media card exige la dismissabilité) |

## 4. Par plateforme / device

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Desktop (hover) | Élévation au survol comme affordance | Couvert |
| Mobile tactile | Pas de hover, reflow en 1 colonne | Couvert (CARD-UI responsive) |
| Actions révélées au survol | Pattern desktop courant | **Couvert après test** — le piège hover-only était documenté pour la table (bouton) mais pas transposé à la carte |
| Lecteur d'écran | Balisage liste, titre sémantique, lien étendu | Couvert (CARD-UI accessibilité) |
| Swipe actions mobiles | Glisser une carte pour révéler des actions | **Non couvert actuellement** |

## 5. Par contenu / forme visuelle

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Media en tête (vertical) | Cas de référence | Couvert |
| Media latéral (horizontal) | Liste, mobile | Couvert |
| Sans media | Texte seul | Couvert (slots optionnels) |
| Media manquant (donnée incomplète) | L'item n'a pas d'image dans une collection qui en attend | **Couvert après test** — cas réel fréquent, absent de la première rédaction |
| Badge / tag de statut | Sémantique portée par le contenu | Couvert (et lié à la note de transposition) |
| Avatar dans le header | Carte profil, auteur | Couvert partiellement |
| Menu de débordement (overflow) | Regrouper les actions secondaires | Couvert (zone d'actions) |
| Texte tronqué / line clamp | Hauteurs alignées en grille | Couvert |

## 6. Par enjeu business / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Carte cliquable + actions imbriquées | Exclusion accessibilité | Couvert — le risque critique n°1 du composant |
| Carte produit (conversion) | L'essentiel du e-commerce passe par elle | Couvert structurellement ; aucune étude chiffrée trouvée (écart de preuve vs bouton/input, signalé dans les sources) |
| Cartes pour comparer (mauvais choix de composant) | Coût de scannabilité | Couvert (quand ne pas l'utiliser) |
| Performance (images en collection longue) | LCP, layout shift | Couverture partielle (lazy-loading, skeleton) — signalé "À approfondir" |
| Dark pattern de fausse cliquabilité | Style cliquable sur carte publicitaire statique, ou l'inverse | Couvert partiellement (affordance mensongère) — l'angle "publicité déguisée en carte de contenu" n'est pas traité |

---

## Bilan du test de couverture

Sur 41 cas recensés (dont un volontairement hors périmètre — la carte promotionnelle, renvoyée à un futur composant alert), **9 étaient non couverts après la première rédaction** de CARD-UX.md — ratio de trous comparable au bouton (8/33) et à l'input (11/30), ce qui confirme que la première passe d'un fichier laisse toujours des trous du même ordre de grandeur, quelle que soit la méthode d'entrée (gabarit pour le bouton, benchmark pour l'input, transposition pour la carte).

**Les 3 trous jugés prioritaires ont été comblés avant livraison** (marqués "couvert après test" ci-dessus) :
1. **Loading / skeleton** — le plus flagrant : le loading state était documenté sur le bouton depuis la v1, et l'inventaire input avait déjà repéré le même angle mort (validation asynchrone). Troisième fois que le comportement "en attente de données" est le trou par défaut — c'est probablement un biais systématique de la méthode (on documente l'état final, pas l'état transitoire), à noter pour les prochains composants.
2. **Actions visibles uniquement au survol** — la règle existait déjà pour la table dans BUTTON-UX.md mais ne s'était pas transposée à la carte ; risque tactile réel.
3. **Media manquant** — cas de données incomplètes fréquent en production, invisible dans les benchmarks (les systèmes de design documentent des cartes parfaites).

**Restent non couverts, par ordre de priorité suggérée** : carte dismissable (présente dans le benchmark, oubliée), kanban/drag-and-drop, masonry (tension avec la règle d'alignement à trancher), swipe actions, carte en modale, publicité déguisée. Aucun n'est critique en risque immédiat, tous sont signalés soit ici, soit dans "À approfondir" de CARD-UX.md.

**Ce que ce test ajoute sur la méthode** : faire le test de couverture *immédiatement* après rédaction (et non après coup comme pour le bouton) coûte peu et a permis de corriger avant livraison — c'est l'ordre à conserver.
