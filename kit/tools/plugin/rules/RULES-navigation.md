---
sujet: navigation
type: pattern
resume: "Assemblage d'une navigation : landmarks (nav étiqueté, main), destinations = link (contexte navigation, état courant non chromatique), regroupement = accordion, table des matières « sur cette page » (scrollspy + aria-current), skip-link. Off-canvas délégué à overlay ; fil d'Ariane différé"
requires: ["link", "accordion"]
selon-contexte: ["overlay (off-canvas de la nav latérale sous les seuils du shell)", "motion (scrollspy et défilement vers l'ancre)", "voice (libellés de destinations et d'étiquettes de nav)"]
---
# RULES — Navigation (compilé, condensé)

> Généré depuis `patterns/navigation/NAVIGATION-UX.md` (v1.0.0) et `NAVIGATION-UI.md` (v1.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- **Pattern d'assemblage**, pas un composant neuf : il compose des **destinations** (`link` contexte navigation), les **regroupe** (`accordion`), les place dans des **landmarks** et gère l'**état courant**. Trois surfaces : nav latérale, TOC « sur cette page », skip-link. Fil d'Ariane différé.

## Landmarks
- Toute nav dans un `nav` **étiqueté** (`aria-label`) ; étiquettes distinctes si plusieurs (« principale », « sur cette page »). Contenu principal = `main` (cible du skip-link).

## Nav latérale
- Destinations = `link` (navigation) ; regroupement = `accordion` ; **un seul** lien courant (aria-current + signal **non chromatique**, cf. LINK). Hiérarchie à l'indentation et au regroupement, pas à la couleur seule.
- Sous les seuils du shell, la nav passe **off-canvas** → comportement porté par `overlay` (scrim, focus, dismiss), pas ici.

## Table des matières « sur cette page »
- Liste les sections de la page ; l'entrée **active suit la lecture** (scrollspy), marquée `aria-current` + repère **non chromatique** (trait/gras). Complète la nav principale, ne la remplace pas. Clic = défilement vers l'ancre ; reduced-motion → instantané.

## Skip-link
- **Premier élément focalisable**, « Aller au contenu », **masqué jusqu'au focus** puis visible, déplace le focus vers `main`. Obligatoire dès qu'une nav longue précède le contenu (WCAG 2.4.1).

## Clavier
- Tab traverse dans un ordre qui suit le sens ; **aucun piège** ; accordéons suivent `accordion`, liens suivent `link`.

## Frontières
- Item → `link` ; regroupement → `accordion` ; off-canvas → `overlay` ; focus ring → `border` ; ordre général → `accessibility` ; wording → `voice`. Le pattern **compose**, il ne redéfinit rien.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Pas de skip-link devant une nav longue | Utilisateur clavier/lecteur d'écran forcé de tout traverser (WCAG 2.4.1) | Élevée |
| Plusieurs `aria-current="page"` ou aucun | Repère de position faux ou absent | Moyenne-élevée |
| État courant porté par la seule couleur | Illisible sans perception des couleurs (WCAG 1.4.1) | Élevée |
| `nav` multiples non étiquetés | Repères indistincts au lecteur d'écran | Moyenne |

CONFIANCE : landmarks, aria-current, skip-link = établis (WCAG/APG). Scrollspy du TOC = consensus convergent (docs). Nav latérale + TOC + skip-link ; fil d'Ariane différé.
