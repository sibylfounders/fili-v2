---
sujet: iconography
type: fondation
resume: "Le texte d'abord : droit d'exister d'une icône, registre stable, crans icon.*, SVG inline currentColor — pas de bibliothèque imposée"
requires: []
selon-contexte: ["motion (spinner : rotation continue linéaire)"]
---
# RULES — Iconography (compilé, condensé)

> Généré depuis `foundations/iconography/ICONOGRAPHY-UX.md` (v1.0.0) et `ICONOGRAPHY-UI.md` (v1.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation. **Pas de bibliothèque d'icônes fournie** : le dessin des glyphes est une décision d'identité (seules les silhouettes des tones de l'alert sont normatives : cercle / cercle-coche / triangle / octogone).
- **Règle cardinale : l'icône accélère la reconnaissance d'un sens que le produit sait déjà dire autrement — jamais le seul dépositaire du sens.**

## Le droit d'exister
- **Le texte d'abord** : label visible partout où c'est possible ; pas d'icône non nécessaire.
- Icône seule = liste fermée : métaphores quasi universelles (loupe, croix, maison, impression) + actions apprises dans CE produit. Le tooltip ne compte pas comme label (invisible au tactile).
- **Icône seule → `aria-label` obligatoire, sans exception.**
- Jamais hover-only (invisible au tactile).

## Registre stable
- Un glyphe = un sens, un sens = un glyphe — constant dans tout le produit. Ne jamais détourner un symbole établi (étoile, corbeille).
- L'icône sémantique est un canal redondant (1.4.1), jamais décorative — elle ne se retire pas pour alléger.

## Forme
- **Tailles = crans fermés** : `icon.sm` (chevrons, inline, dense) / `icon.md` (défaut — boutons, alert, input) / `icon.lg` (icon-only lg, media fallback). Jamais de taille libre — jamais redimensionner.
- Style : **outline**, trait `icon.stroke` constant ; filled réservé aux futurs états actifs/sélectionnés. Pas de 3D/perspective.
- À côté d'un texte : **centrage vertical** (pas baseline), couleur = celle du texte accompagné (`currentColor`) — jamais de couleur propre hors tone sémantique.
- Icône informative : 3:1 (1.4.11). Décorative : `aria-hidden="true"`.
- **Cible ≠ glyphe** : 44px par extension du padding, jamais en gonflant l'icône.

## Implémentation
- **SVG inline + currentColor. Pas d'icon font** (échec de chargement illisible, AT perturbée).
- Label : ne pas décrire l'apparence, ne pas répéter le texte adjacent, jamais le mot "icône".
- Icône d'état = même glyphe transformé (chevron tourné, œil barré) + état exposé (`aria-expanded`/`aria-pressed`) — le dessin confirme, il n'informe pas.
- Spinner : occupe le cran de l'icône remplacée ; rotation continue linéaire (cf. RULES-motion).

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Icône seule sans aria-label | Invisible au lecteur d'écran | Critique |
| Tone sans forme distincte | Exclusion daltonisme (1.4.1) | Élevée |
| Métaphore ambiguë sans label | Action introuvable | Élevée |
| Icon font | Chargement/AT cassés | Moyenne-élevée |
| Cible réduite au glyphe | < 44px tactile | Moyenne-élevée |

CONFIANCE : label-first, aria, 3:1, cibles = établi (NN/g, WCAG, Carbon, Polaris, Atlassian ; contre-position GOV.UK documentée : quasi-zéro icône). Crans 16/20/24 et stroke = décisions d'identité internes. Si une action n'a pas d'icône évidente en 5 secondes : elle n'a pas d'icône — un mot (et en cas de doute : STOP, remonter le wording).
