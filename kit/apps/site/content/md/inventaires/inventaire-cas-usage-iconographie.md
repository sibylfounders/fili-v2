# Inventaire des cas d'usage — Iconographie (fondation)

> Inventaire des *usages de l'icône* chez les consommateurs. Sert de checklist au test de couverture de ICONOGRAPHY-UX.md. Particularité de cadrage : ce système ne fournit **pas de bibliothèque d'icônes** (le glyphe précis est une décision d'identité visuelle, précédent icon_shape de l'alert) — la fondation régit tout ce qui ne dépend pas du dessin : rôles, tailles, redondance, accessibilité, cohérence.

---

## 1. Par rôle d'icône

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Icône d'action, seule | Poubelle en table, croix de fermeture, clear de l'input | Couvert — aria-label obligatoire sans exception, zone tactile 44px, jamais hover-only |
| Icône d'action, avec texte | Bouton icône + label (leading/trailing selon l'intention) | Couvert (BUTTON-UX) — l'icône précise, le texte porte |
| Icône sémantique (canal redondant) | Icônes par tone de l'alert, mot "Erreur" de l'input | Couvert — WCAG 1.4.1, silhouettes normatives (cercle/coche/triangle/octogone) |
| Icône d'état/direction | Chevron expandable (rotation 180°), flèches de tri | Couvert — l'orientation porte l'état, jamais un changement de glyphe |
| Icône décorative | Ornement sans information propre | Couvert — aria-hidden="true", et se demander d'abord si elle est nécessaire |
| Icône de remplacement de contenu | Media manquant de la carte (icône ou initiales) | Couvert (CARD-UI) |
| Logo / marque | Logo produit, logos tiers (boutons sociaux) | Couvert par frontière — le logo n'est pas une icône : il appartient à l'identité, exception documentée des boutons sociaux (BUTTON-UI) ; la fondation trace la frontière et s'arrête là |
| Illustration | Visuels d'empty state, pédagogie | Couvert par frontière — hors périmètre : aucun consommateur, et l'illustration relève de l'identité (signalé, même statut que logos) |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Dans un bouton | icon_only (padding carré) vs icon_and_text (gap interne) | Couvert (BUTTON-UI content_spacing) |
| Dans un alert | Alignée sur la première ligne du titre, pas centrée sur le bloc | Couvert (ALERT-UI) |
| Dans un input | Prefix/suffix, clear, œil du password — en couleur text-secondary | Couvert (INPUT-UI content_elements) |
| Dans une card | Chevron au coin du header, actions d'objet en icônes | Couvert (CARD-UI/UX) |
| Dans du texte courant | Icône inline au fil du texte | Couvert après test — centrage vertical sur la ligne (pas d'alignement baseline, cf. Carbon), taille liée au corps, cas rare à ne pas multiplier |
| En étiquette (badge/pastille) | Icône dans un label d'interface | Couvert par renvoi — typography.label fait le texte, l'icône suit sa taille |

## 3. Par propriété visuelle

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Taille | Trois crans mappés sur l'échelle des composants (sm/md/lg) | Couvert — tokens icon.* créés : c'était la déduction silencieuse de 4 composants (la leçon typographie appliquée d'emblée) |
| Style de trait (outline vs filled) | Cohérence du dessin dans tout le produit | Couvert — un seul style par produit (outline par défaut ici), le filled réservé aux états actifs/remplis si le besoin naît |
| Épaisseur de trait | Stroke cohérent entre icônes, lisible en petit | Couvert — décision d'identité, contrainte posée : le trait doit tenir au cran sm |
| Couleur | L'icône hérite de la couleur du texte qu'elle accompagne | Couvert — jamais de couleur propre hors tone sémantique ; contraste 3:1 si informative (1.4.11) |
| Grille de construction | Keylines, zone de sécurité du glyphe | Couvert par frontière — appartient à la bibliothèque d'icônes choisie, pas à cette fondation |

## 4. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Icône en attente (spinner/loading) | Le label du bouton devient indicateur (BUTTON-UX loading) | Couvert — écrit d'office (prédicteur "état transitoire") : le spinner est une icône *animée*, sa rotation appartient à la fondation motion, sa taille et sa place à celle-ci |
| Chargement de la bibliothèque d'icônes | Icon font qui n'arrive pas : caractère fantôme | Couvert après test — SVG inline recommandé (pas d'icon font : échec de chargement illisible, lecteurs d'écran perturbés) |
| Icône qui change avec l'état | Œil barré/non barré du password, chevron tourné | Couvert — rotation/variante du même glyphe, l'état exposé techniquement (aria-expanded, aria-pressed) |

## 5. Par plateforme / enjeu

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Tactile | Zone 44px même pour un glyphe sm | Couvert — standard externe, déjà partout |
| Lecteur d'écran | Décorative cachée, informative nommée | Couvert — la paire aria-hidden/aria-label est la règle cardinale d'accessibilité de la fondation |
| RTL | Chevrons/flèches miroir, icônes directionnelles | **Non couvert actuellement** — même statut que le RTL typographique, signalé |
| Métaphore ambiguë | Icône seule dont le sens n'est pas universel | Couvert — liste courte d'icônes auto-suffisantes (croix, chevron, loupe...), tout le reste exige un label visible ou un usage appris confirmé |
| Un sens = une icône | La même icône pour deux actions différentes | Couvert — registre stable dans tout le produit (précédent : une icône par tone, constante) |
| Contraste de l'icône informative | Icône seule sous 3:1 | Couvert — testé comme tout état visible |

---

## Bilan du test de couverture

Sur **28 cas recensés**, **4 étaient non couverts après la première rédaction** de ICONOGRAPHY-UX.md.

**Comblés en 1.0.0 (avant livraison)** : icône inline dans le texte (alignement + taille au corps), icon font vs SVG (SVG inline recommandé — l'échec de chargement d'une icon font est le layout-shift typographique en pire), et le duo spinner (écrit d'office — prédicteur "état transitoire", 2e fonctionnement en amont après le chargement de police).

**Reste non couvert** : RTL (icônes directionnelles miroir) — 3e signalement RTL du système, toujours sans consommateur. Aucun critique.

**Note de méthode** : le ratio de trous chute (4/28 contre 8-11 sur les composants) — l'effet cumulé du prédicteur "état transitoire" appliqué d'office et des frontières héritées des composants (logos, illustrations, grille de construction tranchés en cadrage). La méthode s'use dans le bon sens : les fondations tardives héritent des leçons payées par les premières.
