---
sujet: typography
type: fondation
resume: "Le sens (hiérarchie h1-h6, un seul h1, pas de saut) et la lisibilité (échelle fluide, mesure, interligne, graisse, casse, taille minimale)"
requires: []
selon-contexte: []
---
# RULES — Typography (compilé, condensé)

> Généré depuis `foundations/typography/TYPOGRAPHY-UX.md` (v1.4.0) et `TYPOGRAPHY-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité en cas de doute. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation, pas un composant : contrainte transversale consommée par tous les composants. Le modèle à axes ne s'applique pas.
- **Règle cardinale : deux fonctions indépendantes** — le *sens* (hiérarchie h1-h6, décision de contenu) et la *lisibilité* (taille, mesure, échelle responsive, décision de design). Aucune ne se déduit de l'autre.

## Hiérarchie sémantique
- h1-h6 décrivent la structure du contenu (arbre du lecteur d'écran, indexation, sommaire) — jamais le style.
- **Exactement un h1 par page** — ni deux, ni **zéro** (le titre du document, pas le plus gros texte). Une page sans h1 est un arbre sans racine pour la navigation par titres, et un document sans sujet pour l'indexation.
- **Jamais de saut de niveau** (h2 → h4 interdit) : casse la navigation par titres.
- **Niveau ≠ taille** : un h2 peut être stylé plus petit qu'un h3. Le niveau suit la structure, la taille suit le design.
- Texte qui doit *avoir l'air* d'un titre sans en être un (KPI de dashboard, citation) : style voulu sur un élément non-heading — jamais un heading pour le style. Inversement, un hero marketing prend le style display, le h1 reste au vrai titre.

## Typographie fluide
- **`vw` seul interdit** : le zoom navigateur n'affecte pas les unités viewport → échec WCAG 1.4.4, invisible en test standard. Critique.
- Correction : `clamp()` avec `rem` dans le min, le max ET la partie fixe de la valeur préférée — `clamp(2rem, 1.67rem + 1.67vw, 3rem)`, jamais `clamp(2rem, 4vw, 3rem)`.
- Garde-fou : ratio max/min ≤ 2.5 par échelon (l'échelle du système est ≤ 1.5 partout).
- Limite connue au zoom extrême (500 %) même corrigé. CONFIANCE : non formalisé (émergent/débattu) — **tester au zoom réel : à 200 %, le texte doit avoir doublé** (le resize de fenêtre ne teste rien).

## Mesure de lecture
- Texte courant borné à ~45-75 caractères par ligne, exprimé en `ch` via `measure.reading-max` — jamais en px.
- Fluidité + bornage vont ensemble : un texte fluide sans `max-width` casse sa mesure sur grand écran.
- La mesure protège le texte *courant*, pas les titres.

## Interlignage
- Fonction du corps et de l'usage, pas une constante : texte courant 120-145 % (WCAG AAA ≥ 1.5 ; `typography.body` = 1.6), grands corps serrés (`typography.display` = 1.1).
- Jamais d'interligne de corps sur un titre multi-lignes (lignes flottantes), ni l'inverse (paragraphe compacté).

## Graisse et emphase
- La graisse n'est jamais le seul canal de hiérarchie — combinaison corps + graisse + position. Une light plus grande peut dominer une bold.
- Semibold pour les titres, **jamais le texte long**. Aucune light sous le corps standard (contraste du trait).
- Gras avec parcimonie (information critique) ; gras et italique jamais ensemble.

## Casse
- Titres en sentence case — décision produit unique.
- CAPITALES réservées aux étiquettes brèves (`label-mono`), jamais au texte courant, toujours avec 5-12 % d'interlettrage (8 % en usage).
- Capitales via `text-transform` CSS, jamais tapées dans le contenu (lecteurs d'écran, copier-coller).

## Alignement
- Fer à gauche par défaut. **Jamais de justifié en interface** (rivières d'espace, exclu par WCAG 1.4.8).
- Centré : titres courts et moments éditoriaux uniquement, jamais un paragraphe.

## Taille minimale
- Corps 15-25 px d'équivalent ; **jamais sous 16px pour le texte courant** (`typography.body` = 16px).
- Inputs : sous 16px, iOS Safari zoome au focus — comportement de plateforme, pas une décision esthétique.

## Profondeur
- Six niveaux existent, quatre suffisent presque toujours. Des h5/h6 récurrents = structure à réorganiser, pas des styles à ajouter.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Texte en vw seul | Zoom sans effet — échec WCAG 1.4.4 | Critique |
| Saut de niveaux (h2 → h4) | Arbre AT cassé | Élevée |
| Fluid type testé au resize seulement | Échec 1.4.4 invisible | Élevée |
| Light en petit corps | Trait illisible | Élevée |
| Plusieurs h1 / h1 décoratif | Titre réel illisible (AT, SEO) | Moyenne-élevée |
| Texte sans max-width | Mesure > 75 car., fatigue | Moyenne |
| Justifié sans césure | Rivières, exclu WCAG 1.4.8 | Moyenne |
| Capitales sur texte courant | Lecture épelée | Moyenne |
| Police sans pile de secours | Layout shift, rendu imprévisible | Moyenne |
| Input < 16px | Zoom iOS subi | Moyenne |
| Hiérarchie par gras seul | Plus aucun signal | Moyenne |

## Règle transversale
- **La structure appartient au contenu, l'apparence au design — aucun ne se déduit de l'autre.**

---

## Règles techniques (UI)

```yaml
headings: # résolus dans DESIGN.md — clamp(min, fixe-rem + pente-vw, max)
  h1: typography.headings.h1  # 32→48px, ratio 1.50
  h2: typography.headings.h2  # 24→32px, ratio 1.33
  h3: typography.headings.h3  # 20→24px, ratio 1.20
  h4: typography.headings.h4  # 18→20px, ratio 1.11
  h5: typography.headings.h5  # 16→18px, ratio 1.13
  h6: typography.headings.h6  # 14→16px, ratio 1.14
text_styles: { display: typography.display, body: typography.body, label_mono: typography.label-mono }
fallback: { sans: typography.fallback.sans, mono: typography.fallback.mono }
measure: { reading_max: measure.reading-max }
```

### Échelle
- Grammaire : `rem` dans min, max et partie fixe — jamais `px` seul, jamais `vw` seul.
- Le max de h1 rejoint `typography.display` (deux usages, une taille de crête). La pente vw interpole entre `breakpoint.mobile` et sa valeur doublée.

### Piles de secours
- Geist et JetBrains Mono ne sont pas embarquées : toute déclaration écrit `fontFamily` PUIS la pile (`typography.fallback.sans` / `.mono`) — jamais une famille seule.
- Piles à métriques proches (`system-ui`, `ui-monospace`) + `font-display: swap`.

### Mesure — application
- Paragraphes et blocs de lecture bornés par `measure.reading-max` (en `ch`), pas les titres. `max-width`, jamais `width` fixe.

### Consommation par les composants
| Consommateur | Texte | Référence |
|---|---|---|
| Button | label | `typography.body` + graisse `typography.display.fontWeight` |
| Input | valeur, label, messages | `typography.body` — jamais en dessous (zoom iOS) |
| Card | titre | taille `typography.headings.h4` par défaut, niveau selon la page |
| Alert | titre + corps | `typography.body`, titre en graisse — pas un heading |
| Form | hérite via alert et input | — |

### Vérifiabilité
- `clamp()` ne s'évalue qu'en rendu : le test zoom 200 % est manuel — aucune vérification statique ne couvre le point débattu.
