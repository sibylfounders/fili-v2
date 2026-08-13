---
sujet: collection
type: pattern
resume: "Orchestration d'une grille d'items et de ses outils : grille intrinsèque (colonnes émergentes via grid.item-min, jamais fixées par appareil), régime composé du dashboard, gouttières spacing par densité, tri/filtre par défaut annoncés, croissance (charger-plus > pagination > scroll infini jamais seul), squelettes stables, état restauré au retour"
requires: ["card", "button"]
selon-contexte: ["grid", "spacing", "adaptive", "cognitive-load", "motion", "voice", "form (échec d'une page suivante : même logique que le succès partiel)", "toast (jamais porteur de l'état vide/erreur d'une collection)"]
---
# RULES — Collection (compilé, condensé)

> Généré depuis `patterns/collection/COLLECTION-UX.md` (v1.0.0) et `COLLECTION-UI.md` (v1.0.0).
> La source fait autorité. Ne pas éditer à la main. La carte reste l'atome (`RULES-card`) ; la collection est la phrase. C'est ce pattern qui possède la grille de colonnes (clause de naissance de `RULES-grid` levée le 2026-07-21).

## Frontières d'autorité
- Contenu, modes, densité, ratio, troncature, empty states, squelette **d'une carte** → `RULES-card`.
- Colonnes, gouttières, régimes de grille, croissance, outils de collection → ce fichier.
- Cadre de page (max-width, centrage) → `RULES-grid` ; valeurs d'espace → `RULES-spacing` ; bascules et ordre DOM → `RULES-adaptive` ; défauts annoncés et budget de décision → `RULES-cognitive-load`.

## Les deux régimes
- **Items homogènes** (référence — résultats, catalogue, galerie) : grille **intrinsèque**, colonnes émergentes.
- **Composé** (dashboard) : grille explicite à colonnes égales, hiérarchie par la **taille** des widgets (RULES-card), spans en **cellules entières**, mêmes gouttières. Nombre de colonnes choisi par le contenu — pas de 12 canonique.
- Jamais de mélange ; un dashboard peut contenir une grille homogène (widget-liste), pas l'inverse.

## Grille intrinsèque
```css
.collection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-item-min)), 1fr));
  gap: var(--collection-gap);
}
```
- `--grid-item-min` ← `grid.item-min` (256px). Le nombre de colonnes ÉMERGE de l'item et de l'espace réel — **jamais « 4 desktop / 2 tablette / 1 mobile »** (un viewport large ne garantit pas un conteneur large).
- **`auto-fill`, jamais `auto-fit`** : la dernière rangée incomplète garde la largeur d'item, rien ne s'étire.
- `min(100%, …)` : en conteneur étroit (sidebar, split), une colonne — jamais de scroll horizontal accidentel.
- Sous `breakpoint.mobile` : colonne unique pleine largeur (moins la marge de page RULES-grid).
- Le reflux **ne réordonne jamais** (ordre DOM = ordre de lecture, RULES-adaptive) ; aucune propriété `order`.
- Une collection d'un ou deux items garde sa grille — pas de mise en scène du petit nombre.

## Gouttières et zone
- Une seule gouttière par collection (colonnes ET rangées), token `spacing` apparié à la densité RULES-card : `comfortable` → `spacing.lg`, `compact` → `spacing.md`. Jamais de token gouttière propre.
- Cadre de page : `grid.container-wide`. La grille remplit ce cadre, elle ne se re-borne pas.
- Zone de collection (grille + outils + compteur) : fond `surface` possible (calibré pour cette distinction), padding `spacing.lg` ; les cartes gardent `background`.

## Outils de la collection
- Tri, filtres, recherche, compteur : **au-dessus de la grille**, position constante, portée = toute la collection (une action d'item vit dans sa carte).
- **Tri par défaut annoncé** (« Récents d'abord ») — jamais silencieux. **Filtre actif d'office déclaré** — un sous-ensemble non déclaré est une information cachée (frontière RULES-cognitive-load).
- Filtres actifs visibles et retirables d'un geste ; compteur mis à jour avec eux (formulation RULES-voice).
- **Mécanique des contrôles absente du système** (select, chips) : STOP — remonter, ne pas improviser.

## Croissance
- **« Charger plus »** par défaut : bouton secondary centré sous la grille, dans le flux ; suit le cycle de soumission (état en cours, anti-double-clic).
- **Pagination** quand la position est adressable (citer, retrouver, comparer « page 3 »).
- **Scroll infini jamais seul** : toujours doublé d'un chemin fini ; jamais sur un écran dont le footer doit rester atteignable. Flux de découverte oui, recherche orientée but non.
- **Retour à la collection = état restauré** (position, tri, filtres).
- **Échec de la page suivante** : l'acquis reste affiché, l'erreur est locale et réessayable.

## Chargement et changement
- Squelettes (anatomie RULES-card) en **nombre de cellules stable** — la grille ne saute pas ; rien n'anime au chargement.
- Tri/filtre : réorganisation sobre (motion.base, registre productif) ; sous `prefers-reduced-motion`, remplacement sans transition.
- Changement de résultats **annoncé** : le compteur est l'unique région live polie (`aria-live="polite"`) — jamais la grille entière.
- Vide / sans résultat / erreur : empty states RULES-card + ton RULES-voice, à la place de la grille — jamais portés par un toast (RULES-toast).
- Balisage **liste** sur la grille (`ul/li` ou `role="list"`).

## Règle cardinale
**La grille est un contrat, pas une décoration.** La promesse d'une collection est la prédictibilité — même largeur, même rythme, même ordre, mêmes règles par item. La mise en avant passe par l'ordre, la taille dans la grille (composé) ou le contenu — jamais en cassant le contrat (une carte plus large « juste ici », un ratio différent « pour voir »).

## Hors périmètre — STOP et remonter
Kanban complet (réordonnancement fin, live region de drag — extension `collection-kanban` à naître), virtualisation, table de données, contrôles de barre d'outils (select, chips).

CONFIANCE : grille intrinsèque établie (technique standard web.dev/MDN + cohérence avec le principe adaptatif) ; hiérarchie de croissance convergente (NN/g) mais position produit, arbitrée 2026-07-21 ; refus du N-colonnes canonique = divergence interne assumée vs Carbon/Material ; `grid.item-min` (256px) non formalisé — ajustable sur besoin réel. Décision non tranchée par une règle (colonnes d'un dashboard précis, contrôle d'outils manquant, virtualisation, kanban) : STOP — remonter.
