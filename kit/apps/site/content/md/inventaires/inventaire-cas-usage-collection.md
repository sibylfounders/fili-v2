# Inventaire des cas d'usage — collection (pattern)

> Inventaire de sujet du pattern `collection` (grille d'items, dashboard, résultats). Construit AVANT la rédaction (étape 2 de la méthode). Beaucoup de cas sont **déjà couverts par CARD** — le pattern ne les réécrit pas, il les orchestre ; cet inventaire trace la frontière. Statuts recalculés APRÈS l'intégration de `COLLECTION-UX/UI` 1.0.0 (2026-07-21).

## Mode d'emploi

- **Couvert** : une règle existe (propriétaire en majuscules) — chez CARD/GRID/SPACING/ADAPTIVE pour l'existant, chez COLLECTION pour ce que le draft apporte.
- **Partiel** : l'obligation est posée mais la mécanique attend un composant ou une épreuve du réel.
- **Absent / En attente** : position à prendre avant d'improviser — listé dans les questions d'arbitrage du draft.
- L'état transitoire (le trou-type) : ici le **chargement, la croissance et le changement de résultats** — section 4 dédiée.

## 1. Régimes et grille

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Grille d'items homogènes | Résultats, galerie, catalogue : mêmes cartes, même poids, grille intrinsèque | Couvert — COLLECTION (régime de référence : colonnes émergentes, jamais fixées par appareil) |
| Nombre de colonnes selon l'espace | Les colonnes naissent de la largeur minimale d'item et de l'espace réel, pas d'un chiffre par appareil | Couvert — COLLECTION (grille intrinsèque) + ADAPTIVE (seuils dérivés du contenu) |
| Une colonne sous le régime mobile | Sous breakpoint.mobile, la grille passe en colonne unique pleine largeur | Couvert — COLLECTION (aligne la règle déjà notée sur breakpoint.mobile dans DESIGN.md) |
| Dernière rangée incomplète | 7 items sur une grille de 3 : la dernière rangée reste alignée au flux, rien ne s'étire | Couvert — COLLECTION (auto-fill, jamais auto-fit qui déforme) |
| Dashboard composé | Widgets de tailles différentes : hiérarchie par la taille dans une grille explicite, spans en cellules entières | Partiel — CARD (hiérarchie par la taille) + COLLECTION (spans, gouttières communes) ; colonnes choisies par le contenu (arbitré 2026-07-21) ; à éprouver au premier dashboard réel |
| Gouttières de la grille | L'espace inter-items est un token spacing, jamais une valeur propre | Couvert — SPACING (cadrage) + COLLECTION (mapping par densité) ; autorité du gap transférée de CARD-UI au pattern (journalisé 2026-07-21) |
| Cadre de page de la collection | La collection vit dans grid.container-wide, centrée | Couvert — GRID (largeurs de conteneur) |
| Ordre préservé au reflux | 3→2→1 colonnes ne change jamais l'ordre de lecture ni le DOM | Couvert — ADAPTIVE (ordre DOM) + COLLECTION (l'applique à la grille) |
| Item unique ou rare | Une collection d'un ou deux items garde sa grille — pas de mise en scène spéciale | Couvert — COLLECTION (la grille est un contrat, pas une décoration) |
| Élément sans cible dans une collection interactive | Une règle sans détail, une ligne sans fiche, une option indisponible | Couvert — R33 (carte, liste, tableau, menu) |

## 2. Contenu et uniformité (autorité CARD — le pattern renvoie)

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Un seul mode d'interaction par collection | Jamais mélanger cartes cliquables, sélectionnables, statiques | Couvert — CARD (règle de groupe) |
| Une seule densité par collection | comfortable/compact se décide pour toute la collection | Couvert — CARD (densité) |
| Ratio d'image unique | Un ratio fixe pour toute la collection, l'alignement est la promesse | Couvert — CARD (ratio, media_ratio) |
| Troncature constante | Nombre de lignes constant, texte complet accessible | Couvert — CARD + VOICE (longueur/troncature) |
| Même niveau de titre partout | Toutes les cartes d'une grille au même niveau sémantique | Couvert — CARD |
| Balisage liste de la collection | La collection est une liste pour les technologies d'assistance | Couvert — CARD (sources a11y) ; COLLECTION l'applique au conteneur de grille |

## 3. Outils de la collection

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Tri par défaut annoncé | La collection arrive triée par un défaut sensé ET visible — jamais silencieux | Couvert — COLLECTION (comble le « En attente » de l'inventaire charge-cognitive) + COGNITIVE-LOAD (défauts) |
| Filtre par défaut déclaré | Un filtre actif d'office ne cache jamais silencieusement des résultats | Couvert — COLLECTION (déclinaison de « jamais un coût caché ») |
| Barre d'outils (tri, filtres, recherche) | Contrôles au-dessus de la grille, position constante | Partiel — COLLECTION pose les obligations ; la mécanique attend des composants inexistants (select, chips de filtre) — remonter, ne pas improviser |
| Compteur de résultats | « 42 résultats », mis à jour avec les filtres | Couvert — COLLECTION (obligation) + VOICE (formulation) |
| Filtres actifs toujours visibles | Ce qui restreint la collection se voit et se retire d'un geste | Partiel — obligation posée (COLLECTION) ; mécanique (chips) attend son composant |

## 4. Chargement, croissance, changement

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Squelettes au chargement initial | Cartes squelettes reproduisant la structure, rien n'anime | Couvert — CARD (skeleton, aucune animation au chargement) + COLLECTION (nombre de squelettes stable, pas de saut de grille) |
| Croissance : « Charger plus » | Le chemin par défaut pour étendre une collection longue | Couvert — COLLECTION (position proposée : charger-plus par défaut, pagination si la position doit être citable, scroll infini jamais seul) (arbitré 2026-07-21) |
| Scroll infini | Footer inatteignable, position perdue au retour | Couvert — COLLECTION (jamais seul porteur ; toujours doublé d'un chemin fini) |
| Retour à la collection | Revenir d'un détail restaure position, tri et filtres | Partiel — obligation posée (COLLECTION) ; mécanique de restauration côté produit |
| Échec de la page suivante | La suite échoue : l'acquis reste affiché, l'erreur est locale et réessayable | Couvert — COLLECTION (même logique que le succès partiel de FORM) |
| Résultats qui changent annoncés | Filtrer/trier s'annonce aux technologies d'assistance (région live polie) | Partiel — obligation posée (COLLECTION + ACCESSIBILITY) ; mécanique à éprouver à la première implémentation |
| Collection vide / sans résultat / erreur | États vides structurés, ton productif, jamais blâmer | Couvert — CARD (empty states) + VOICE |
| Réordonnancement après tri | Le changement d'ordre est perceptible sans être un spectacle | Couvert — COLLECTION + MOTION (registre productif, base) |

## 5. Hors périmètre de cette version

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Kanban (réordonnancement fin, live region de drag) | CARD n'impose que l'alternative au glisser-déposer ; le reste appelle une extension dédiée | En attente — extension `collection-kanban` à faire naître sur besoin réel |
| Virtualisation (listes très longues) | Optimisation de rendu qui casse facilement balisage liste et recherche navigateur | En attente — position à prendre avant tout consommateur |
| Table de données | Sujet exclu du périmètre du système (hors périmètre routeur) | En attente — reste hors périmètre, remonter |

## Bilan

26 cas. Déjà couverts par les propriétaires existants : 10 (CARD 8, GRID 1, dont balisage et états vides). Le draft COLLECTION en couvre 11 de plus (grille intrinsèque, reflux, défauts annoncés, croissance, échec partiel), en laisse 5 en Partiel avec chemin de remontée nommé (barre d'outils et chips sans composant, live region, retour de navigation, colonnes du composé) et 3 En attente (kanban, virtualisation, table). Les Partiel/En attente sont repris dans « À approfondir » du pattern et journalisés.

## Sources

Le sourçage vit dans `COLLECTION-UX.md` / `COLLECTION-UI.md` (tables « Sources et niveau de confiance »). Cet inventaire est un outil de vérification, pas une source normative.
