# Inventaire des cas d'usage — Bordure (fondation)

> Inventaire des *usages du trait* chez les consommateurs. Sert de checklist au test de couverture de BORDER-UX.md. Le cœur de cette fondation existe déjà en guardrail dans DESIGN.md (délimitante vs décorative, décision F02) — la fondation développe le raisonnement et récupère les cas que le guardrail ne couvre pas (focus ring, séparateurs, hairline).

---

## 1. Par rôle de bordure

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bordure délimitante | Seul signal d'un composant interactif au repos (input, bouton secondary) | Couvert — border-strong, 3:1 obligatoire (WCAG 1.4.11), critère du "si elle disparaît" |
| Bordure décorative / de groupement | Carte outlined, encadrés | Couvert — border, exemptée du seuil (le contenu identifie le composant) |
| Séparateur (divider) | Trait entre deux zones, lignes de table | Couvert après test — le séparateur est un 3e rôle : ni délimitant ni groupant, candidat au retrait (l'espace suffit souvent) |
| Bordure sémantique | Bordure danger de l'input error, bordures des tones de l'alert | Couvert — la couleur vient du tone, l'épaisseur reste hairline |
| Focus ring | Anneau partagé bouton/input/card (control.focus-* depuis le focus v2) | Couvert — style unifié tokenisé (largeur/écart), c'était la déduction silencieuse de 3 composants |
| Bordure de sélection | selected_border primary de la card | Couvert — toujours accompagnée d'un indicateur non chromatique |

## 2. Par propriété du trait

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Épaisseur standard | 1px hairline partout (exception documentée, pas un token d'échelle) | Couvert — décision journalisée (RAPPORT-VALIDATION), la fondation la motive |
| Épaisseur renforcée | Bordure plus épaisse pour un état (selected, error) ? | Couvert — décision explicite : l'état change la *couleur*, jamais l'épaisseur (pas de layout shift, cf. motion) |
| Style de trait (dashed, dotted) | Zone de dépôt de fichier, placeholder de contenu | **Non couvert actuellement** — aucun consommateur (l'upload de fichier est un futur candidat input) |
| Rayon du trait | Coins arrondis de la bordure | Couvert par renvoi — le rayon appartient à la fondation radius |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Repos → hover | Bordure renforcée au survol (carte cliquable : bordure OU élévation) | Couvert (CARD-UX) — signal d'affordance alternatif à l'ombre |
| Repos → focus | Le ring apparaît, la bordure du composant reste | Couvert — ring séparé du trait (offset), jamais un remplacement de la bordure |
| Repos → error | La bordure change de couleur (border-strong → danger) | Couvert (INPUT-UI) |
| Apparition/disparition du ring | Transition du focus | Couvert par renvoi — fondation motion (le focus apparaît sans délai — jamais retardé par une transition) |

## 4. Par plateforme / environnement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Écran standard | Cas de référence | Couvert |
| Écrans haute densité | Le hairline 1px reste 1px CSS (sous-pixel physique) | Couvert après test — 1px CSS assumé, pas de 0.5px physique (rendu inégal entre navigateurs) |
| Contraste élevé forcé | forced-colors remplace les couleurs de bordure mais préserve les traits | Couvert après test — la bordure est le signal qui *survit* à forced-colors (contrairement à l'ombre et au fond) : raison de plus pour la délimitation par le trait |
| Zoom navigateur | Le trait en px ne grossit pas avec le texte | Couvert — même position que l'espacement : assumé, le trait n'est pas du texte |

## 5. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bordure délimitante sous 3:1 | Composant interactif invisible (cas border-strong 1.3.0, input F02) | Couvert — deux précédents journalisés, testé par test-rendu.js |
| Focus supprimé sans remplacement | outline: none — exclusion clavier | Couvert — "jamais supprimé", règle des 3 composants, la fondation la centralise |
| Ring identique à la bordure d'état | Anneau de focus vs bordure error danger : discernables ? | Couvert après test — le ring s'ajoute *en plus* de la bordure d'état (offset), les deux restent visibles simultanément |
| Sur-bordage | Des traits partout, bruit visuel | Couvert — hiérarchie : espace d'abord, fond ensuite, trait en dernier |
| Épaisseur variable entre états | 1px → 2px au focus/error : le contenu saute | Couvert — layout shift interdit, l'état passe par la couleur ou le ring |

---

## Bilan du test de couverture

Sur **23 cas recensés**, **5 étaient non couverts après la première rédaction** de BORDER-UX.md.

**Comblés en 1.0.0 (avant livraison)** : séparateur comme 3e rôle (le guardrail n'en connaissait que 2), haute densité (1px CSS assumé), forced-colors (la bordure comme signal survivant), discernabilité ring/bordure d'état (règle du cumul par offset).

**Reste non couvert** : style de trait dashed/dotted (zone de dépôt) — naîtra avec le premier consommateur (upload). Aucun critique.

**Note de méthode** : cette fondation est née d'un guardrail (DESIGN.md 1.4.1) plutôt que d'un composant — trajectoire inverse de l'élévation (tokens d'abord, règles ensuite). Le test de couverture a surtout révélé les cas *périphériques* au guardrail (séparateurs, forced-colors), pas son cœur, déjà éprouvé par deux composants.
