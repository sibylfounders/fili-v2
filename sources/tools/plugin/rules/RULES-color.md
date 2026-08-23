---
sujet: color
type: fondation
resume: "Trois registres étanches (marque/sémantique/neutres), paires texte/fond garanties, seuils de contraste testés, états interactifs, positions dark mode & forced-colors"
requires: []
selon-contexte: []
---
# RULES — Color (compilé, condensé)

> Généré depuis `foundations/COLOR-UX.md` (v1.5.0) et `COLOR-UI.md` (v1.3.0). Règles condensées pour le build — la source fait autorité en cas de doute. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation : contrainte transversale, pas d'axes. Les valeurs (hex) vivent dans les tokens — ce fichier régit leur usage.
- **Règle cardinale : la couleur s'applique par rôle, jamais par valeur — et un rôle ne porte jamais deux sens.**

## Les trois registres (étanches)
- **Marque** : `primary` (action), `secondary` (seconde voix). Jamais pour un état sémantique. Le focus n'est pas un rôle de marque : crans `control.focus-*` accordés à la bordure/état (défaut primary éclairci).
- **Sémantique** : `danger`/`success`/`warning`/`info`, chacun en couple texte + fond `-subtle`. Jamais pour décorer. Jamais la marque à leur place.
- **Neutres** : `text-*`, `background`/`surface*`, `border*`. Ni identité ni état.
- Aucune couleur ne change de registre selon le contexte.

## Jamais la couleur seule (WCAG 1.4.1)
- Tout usage sémantique déclare son canal redondant : icône par tone (silhouettes distinctes), mot "Erreur", coche de sélection. Le canal redondant ne se retire pas.
- Le contraste ne remplace pas la redondance : 1.4.3 rend lisible, 1.4.1 rend distinguable — deux exigences indépendantes.

## Contraste — seuils testés
- **4.5:1** texte courant, **3:1** tout état visible et composant (bordures délimitantes, focus ring). Vérifié à chaque build par `tools/test-rendu.js` (mainteneur) ; un consommateur qui re-thématise dispose de `dist/theme-gate.mjs` (mêmes seuils/paires) qui refuse un thème non conforme avant application.
- Le contraste se vérifie **par paire** — paires garanties :

| Texte | Fonds garantis (≥ 4.5:1) |
|---|---|
| `text-primary` | background, surface, surface-hover, fonds *-subtle |
| `text-secondary` | background, surface, fonds *-subtle |
| `text-muted` | AUCUN au seuil texte — métadonnées accessoires uniquement, jamais du texte fonctionnel |
| `on-primary` | primary, primary-hover, neutral-strong, neutral-strong-hover, danger, danger-hover, warning, warning-hover |
| `danger` / `success` / `warning` / `info` | background + leur fond -subtle (+ danger sur danger-subtle-hover ; warning tient AUSSI en fond plein depuis DESIGN 1.21.0 — cf. on-primary) |
| `background` / `on-primary` | surface-contrast (seuls textes admis dessus, + text-muted en métadonnée) |

- Tout texte fonctionnel sur un fond non listé : STOP, remonter (ou re-tester avant usage).

## États interactifs
- Hover : famille `*-hover` (fond assombri d'un cran) ou `surface-hover` (remplissage apparaissant sur les styles sans fond au repos, stroke/ghost). Focus : crans `control.focus-*` accordés (défaut primary éclairci).
- **Disabled : pas de tokens** — dette assumée documentée (WCAG exempte les composants inactifs). Si un vrai besoin naît : STOP, remonter — le couple complet sera créé d'un coup.

## Positions explicites (décisions, pas des oublis)
- **Dark mode : COUVERT et livré** (rectifié le 2026-08-03 — cette ligne disait « non couvert » alors que la distribution livre un thème sombre complet, exposé en `[data-theme="dark"]` ET sous `@media (prefers-color-scheme: dark)` : il s'active donc seul chez un utilisateur en sombre). Les rôles n'ont pas bougé, c'est la table de valeurs qui a doublé. **Restent ouverts** : la table des paires garanties EN SOMBRE, et le passage de `theme-gate` sur le thème sombre. **La table des paires ci-dessous porte encore une hypothèse de thème clair** : `surface-contrast` doit tenir 4.5:1 avec `background` ET `on-primary` à la fois. Règle dérivée (démontrée) : en sombre, `background` devient sombre → `on-primary` aussi → **`primary` doit être clair** ; un primary sombre est insatisfiable (aucun neutre ne tient 4.5:1 à la fois avec un quasi-noir et un blanc). `surface-contrast` n'est PAS un dark mode local — panneau de mise en avant uniquement.
- **forced-colors (contraste élevé)** : ne jamais neutraliser (`forced-color-adjust: none` interdit) — s'appuyer sur ce qui survit : sémantique HTML, bordures, texte.
- **Texte sur image : interdit nu.** Voile de contraste ou texte hors du media. Le voile est un **calcul**, pas un réglage à l'œil : échantillonner le pire pixel derrière le texte, calculer l'alpha pour 4.5:1, revérifier à plusieurs formats (le cadrage déplace le pire pixel).
- **Link** : `color.primary` au repos, `color.primary-hover` au survol ; le soulignement persistant dans le texte courant est le signal non chromatique. Aucun token Link dédié.
- Sans consommateur, donc sans token (ne pas improviser — STOP si le cas se présente) : scrim de modale, ::selection, dataviz.
- **Teinte des neutres : méthode bénie.** Teinter un neutre à **luminance WCAG constante** (OKLCh + recalage de L) n'altère aucun contraste — gratuit côté accessibilité. C'est une transformation de valeurs (DESIGN.md), aucun nom ne bouge.
- **Marque : deux rôles (primary/secondary), pas de slot décoratif.** (`accent`, né pour le focus en 1.33.0, est sorti en 1.34.0 quand le focus v2 lui a repris sa mission — la règle vaut à la sortie.) Une teinte de marque supplémentaire sans rôle fonctionnel n'a pas de place — les identités multi-teintes décoratives sont hors périmètre (un token naît d'un besoin réel).

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Couleur seule porteuse d'information | Exclusion daltonisme (1.4.1) | Critique |
| Texte courant < 4.5:1 | Illisible (1.4.3) | Critique |
| État visible / bordure délimitante < 3:1 | Composant invisible (1.4.11) | Élevée |
| Marque ↔ sémantique confondues | Vocabulaire chromatique détruit | Élevée |
| Hex hors tokens | Rebranding impossible | Élevée |
| text-muted en texte fonctionnel | Information illisible | Moyenne |

CONFIANCE : registres, 1.4.1, seuils = établi (WCAG + convergence Atlassian/Carbon/Polaris/Material/GOV.UK). Dark mode / forced-colors = décisions internes datées 2026-07-11 ; règle dérivée dark mode, méthodes teinte-neutres & voile, marque sans décor = passe stress-test 2026-07-17 (la règle dark mode est démontrée, pas une préférence).
