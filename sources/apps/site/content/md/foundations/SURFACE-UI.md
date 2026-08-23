---
component: surface
layer: ui
type: foundation
version: 1.0.0 # 1.0.0 : première rédaction (2026-07-27) — la notion existait dans les jetons et dans cinq sujets sans avoir de propriétaire.
last_updated: 2026-07-27
companion: SURFACE-UX.md
tokens:
  # Cette couche ne définit AUCUNE valeur — elle organise les rôles de plan existants
  # et fixe la technique d'application. Les valeurs vivent dans DESIGN.md et dans les jetons.
  roles:
    fond_de_page: color.background        # le plan de référence — ce n'est pas une surface
    surface: color.surface                # un plan qui se détache du fond, un seul cran (1,10:1)
    surface_visee: color.surface-hover    # état visé d'un plan, et remplissage qui apparaît sous les styles sans fond au repos
    surface_inversee: color.surface-inverse # rôle inversé — consommé avec color.text-inverse et color.border-inverse
  couples_obliges:
    surface-inverse: [color.text-inverse, color.border-inverse]
confidence: mixed # les paires texte/fond sont vérifiables numériquement (validate-contrast.mjs) ; la technique de la couche dédiée est un constat d'implémentation de référence
---

# Surface — Couche UI (fondation)

> Grammaire d'application du plan. Le raisonnement (ce qu'est une surface, quand elle mérite d'exister, la table d'autorité) vit dans `SURFACE-UX.md`. Les valeurs sont résolues dans `DESIGN.md` et dans les jetons — **aucune n'est définie ici**.
> Les règles de cette couche portent des identifiants `SURFACE-Unn` — ce sont des consignes d'implémentation, pas des arbitrages de design ; leurs sources sont techniques (`T1…T6`).

## Application par rôle

RÈGLE [SURFACE-U01] : chaque plan référence **un** des quatre rôles, et le rôle décide de ce qui est permis dessus.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Tout plan référence l'un des quatre rôles nommés, qui détermine son usage, son seuil et les textes admis dessus.
MESURE : aucun remplissage de plan hors des quatre rôles

| Rôle | Usage | Seuil exigé | Textes admis dessus |
|---|---|---|---|
| `color.background` | fond de page ; **et repos des cartes** (le repos n'a pas de plan propre) | — (c'est la référence) | `text-primary`, `text-secondary`, tous les jetons de tone |
| `color.surface` | un plan qui se détache : zone de collection, plan visé, remplissage de repos d'un panneau | **jamais** délimitant — 1,10:1, très en dessous de 3:1 (SURFACE-R08) | `text-primary`, `text-secondary` |
| `color.surface-hover` | état visé d'un plan ; remplissage qui **apparaît** sous les styles sans fond au repos (stroke, ghost) | exempté par WCAG 1.4.11, testé quand même (SURFACE-R05) | `text-primary` **seul garanti** — voir U04 |
| `color.surface-inverse` | plan inversé (remplissage plein d'un contrôle neutral, panneau inversé) | 4,5:1 avec son texte inversé | `color.text-inverse` **exclusivement** |

## La technique — un plan se peint sur sa propre couche

RÈGLE [SURFACE-U02] : un plan se peint sur une **couche dédiée**, jamais sur l'élément qui porte le contenu. L'implémentation de référence utilise un pseudo-élément en `position: absolute; inset: 0; border-radius: inherit`, sous le contenu (`z-index: 0`, le contenu remontant en `z-index: 2`). Trois bénéfices, et ce sont les trois raisons de la règle : le remplissage se transitionne sans repeindre le contenu ; un **plan unique** peut glisser d'un élément à l'autre dans une collection (un seul rectangle animé plutôt qu'un fondu par carte) ; et le relief vit sur **sa propre** couche, ce qui rend la dissociation de SURFACE-R04 littérale dans le code plutôt que déclarative.
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : Le remplissage d'un plan est peint sur une couche dédiée placée sous le contenu, et non sur l'élément porteur.
MESURE : aucun remplissage de plan appliqué directement sur l'élément qui porte le contenu d'une surface à états

> **Constat, pas prescription** : `card-group.css` peint le repos sur `.cg-card::before`, la visée sur un `.cg-hl` unique déplacé en transformation, et le relief sur `.cg-lift`. Trois couches, trois rôles, aucune interférence. Un composant sans état de plan (une surface statique) n'a évidemment pas besoin de cette mécanique.

RÈGLE [SURFACE-U03] : seul le **remplissage** d'un plan se transitionne, sur `motion.fast`. L'**ombre ne se transitionne jamais** (interdit hérité de `ELEVATION-R14` — elle se révèle en opacité sur sa propre couche, elle n'est pas interpolée). Sous `prefers-reduced-motion: reduce`, le **déplacement** d'un plan glissant est supprimé et seule son opacité subsiste ; l'état final, lui, n'est jamais supprimé.
STATUT : implémentation de référence
SOURCE : T1, T2
ÉNONCÉ : Le remplissage d'un plan se transitionne sur le cran rapide, l'ombre ne s'interpole jamais, et la préférence de mouvement réduit supprime le déplacement sans supprimer l'état final.
MESURE : aucune propriété d'ombre dans une transition de plan ; sous mouvement réduit, aucune transformation de plan restante

## Le contraste se revérifie sur chaque plan

RÈGLE [SURFACE-U04] : un couple texte/fond se vérifie **par plan**, pas par jeton — un plan nouveau crée une paire nouvelle. WCAG 1.4.3 mesure le contraste contre « the specified color of content over which the text is to be rendered in normal usage » : un plan de survol qui apparaît sous un texte est ce fond-là, et il doit être testé comme tel. **Trou déclaré** : `COLOR-UI` garantit `text-primary` sur `background`, `surface` et `surface-hover`, mais `text-secondary` seulement sur `background` et `surface` — **pas sur `surface-hover`**. Aucun composant ne franchit ce trou aujourd'hui (le survol des collections peint `surface`, pas `surface-hover`), mais rien ne l'en empêche. Tant que la paire n'est pas déclarée et mesurée, **aucun texte secondaire ne se pose sur `surface-hover`**.
STATUT : implémentation de référence
SOURCE : T3, T4
ÉNONCÉ : Chaque plan crée ses propres paires texte/fond, qui sont mesurées avant usage ; un texte secondaire ne se pose pas sur le plan de survol tant que la paire n'est pas déclarée.
MESURE : toute paire texte / plan consommée figure dans la table des paires garanties de COLOR-UI et passe validate-contrast

RÈGLE [SURFACE-U05] : le **plan inversé ne se consomme jamais seul**. `color.surface-inverse` s'accompagne obligatoirement de `color.text-inverse` et, s'il porte un trait, de `color.border-inverse`. Aucun jeton `text-*` prévu pour fond clair n'y est admis. La paire `text-inverse` / `surface-inverse` est vérifiée à 4,5:1 par `packages/tokens/build/validate-contrast.mjs`, dans les deux modes.
STATUT : implémentation de référence
SOURCE : T5
ÉNONCÉ : Le plan inversé se consomme avec son texte et son trait inversés, jamais avec les jetons prévus pour fond clair.
MESURE : aucune occurrence de surface-inverse sans text-inverse dans le même bloc de style

## Ce qui doit tenir quand le remplissage ne distingue plus

RÈGLE [SURFACE-U06] : toute surface **dont la frontière porte de l'information** déclare un trait sous `@media (forced-colors: active)`. En couleurs forcées, `background-color` reçoit une couleur système : deux plans adjacents deviennent identiques, et la frontière disparaît avec la distinction. Le trait, lui, est recoloré et survit. Le remède est celui que MDN donne en exemple : remplacer le canal perdu par une bordure en mot-clé de couleur système, jamais par une valeur d'auteur.
STATUT : propriété universelle
SOURCE : T6
ÉNONCÉ : Une surface dont la frontière porte de l'information déclare une bordure en couleur système sous le mode de couleurs forcées.
MESURE : chaque surface porteuse de frontière signifiante possède une règle forced-colors déclarant un trait
POURQUOI : c'est le seul canal des quatre dont le mode dégradé annule complètement la fonction. Une collection dont les cartes ne se distinguent que par leur remplissage devient, en contraste forcé, une seule masse de texte.

## Aucun remplissage en dur

RÈGLE [SURFACE-U07] : **aucun remplissage de plan écrit en dur** — pas d'hexadécimal, pas de `rgba()`, pas de dégradé maison à la place d'un rôle. Un thème doit pouvoir inverser la direction du plan (SURFACE-R13) sans code conditionnel ; une valeur en dur le lui interdit. **Exception nommée** : un dégradé de **substitut de média** (le placeholder d'une vignette absente) n'est pas un plan au sens de cette fondation — il ne porte pas de contenu, il tient la place d'une image. Il reste soumis à `SPACING` et `RADIUS`, pas à SURFACE.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Tout remplissage de plan référence un rôle de jeton ; les substituts de média ne sont pas des plans et sortent du périmètre.
MESURE : aucune valeur de couleur littérale en propriété de fond dans une feuille de style de composant

## Vérifiabilité

RÈGLE [SURFACE-U08] : la frontière du calculable est nette, et il faut la dire.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les ratios de paires et l'absence de valeurs en dur sont vérifiables automatiquement ; la légitimité d'un plan et le respect de la table d'autorité relèvent de la revue humaine.

**Calculable** — `packages/tokens/build/validate-contrast.mjs` mesure les paires texte/plan dans les deux modes (dont `text-inverse` / `surface-inverse` à 4,5:1). Une recherche de valeurs littérales en propriété de fond détecte les infractions à U07.

**Non calculable, et assumé comme tel** :
- « Ce plan mérite-t-il d'être une surface ? » (SURFACE-R09) — dépend du contenu porté, pas de la valeur.
- « L'espace aurait-il suffi ? » (SURFACE-R10) — jugement de mise en page.
- « Ce remplissage de survol est-il lu comme une promesse de clic ? » (SURFACE-R04) — se constate en usage, pas en script.
- La frontière avec ELEVATION, COLOR, BORDER, RADIUS et OVERLAY (SURFACE-R15) — la table d'autorité est un instrument de revue, pas un test.

## Consommation par les composants

| Consommateur | Repos | Visée | Notes |
|---|---|---|---|
| Card / Card group (`CARD-UI.md`) | `background` — **aucun plan propre** | `surface` (rectangle unique glissant) + `elevation.raised` sur une couche distincte, uniquement si cliquable ou sélectionnable ; relief désactivé en mode solo | le cas de référence de la fondation, et son fait déclencheur |
| Modal / Drawer (`OVERLAY-UI.md`, `MODAL-UI.md`) | `background` + `elevation.overlay` + `radius.md` | — | la surface d'un superposé se distingue par son **relief et son voile**, pas par son remplissage : elle porte le fond de page au-dessus d'un scrim |
| Bouton (`BUTTON-UI.md`) | `surface-hover` comme remplissage neutre qui **apparaît** (styles stroke, ghost) | — | un remplissage qui apparaît au survol d'un contrôle n'est pas une surface : c'est un état de contrôle qui emprunte le rôle |
| Input (`INPUT-UI.md`) | `background` (pas de puits grisé — ELEVATION-UI) | — | le creux passe par l'ombre interne et le filet, jamais par un plan plus sombre |
| Zones de collection (`COLLECTION-UI.md`) | `background` en mode joint | `surface` | le mode joint peint le fond de la page et sépare par filets internes |

Aucun de ces consommateurs ne crée de rôle de plan : ils consomment les quatre existants.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Technique de la couche dédiée : pseudo-élément `inset: 0` sous le contenu ; plan de visée unique déplacé en transformation ; relief isolé sur sa propre couche et révélé en opacité ; suppression du déplacement sous mouvement réduit | `packages/react/src/components/card-group/card-group.css` (couches `.cg-card::before`, `.cg-hl`, `.cg-lift` ; bloc `@media (prefers-reduced-motion: reduce)`) | Implémentation de référence — lue le 2026-07-27. Constat, pas prescription : un seul composant l'emploie aujourd'hui. |
| T2 | La préférence de mouvement réduit demande de supprimer, réduire ou remplacer les animations non essentielles sans perte d'information | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi, comportement plateforme |
| T3 | Le contraste se mesure contre « the specified color of content over which the text is to be rendered in normal usage », sur les paires que l'auteur prévoit adjacentes en présentation typique | [WCAG 2.2 — Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Établi, standard — page chargée et lue. Fonde la vérification **par plan** plutôt que par jeton. |
| T4 | Trou de paire : `text-primary` garanti sur `background`, `surface` et `surface-hover` ; `text-secondary` garanti sur `background` et `surface` **seulement** | `COLOR-UI.md` § Paires texte/fond garanties | Établi — lu dans le fichier. Trou déclaré, non comblé ici : combler une paire appartient à COLOR. |
| T5 | La paire texte inversé / plan inversé est mesurée à 4,5:1 dans les deux modes | `packages/tokens/build/validate-contrast.mjs` (`text-inverse / surface-inverse`, seuil 4.5) | Vérifié numériquement à la génération |
| T6 | En couleurs forcées, `background-color` et `border-color` reçoivent les couleurs système, `box-shadow` est forcé à `none`, `background-image` non fondé sur `url()` également ; le remède documenté est de déclarer une bordure en mot-clé de couleur système | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) ; [W3C — CSS Color Adjust Level 1](https://www.w3.org/TR/css-color-adjust-1/) | Établi, spécification et comportement plateforme — pages chargées et lues |
