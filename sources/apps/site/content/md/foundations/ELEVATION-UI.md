---
component: elevation
layer: ui
type: foundation
version: 2.0.0 # 2.0.0 : grammaire d'application du registre Relief (posé/creusé/plat, matrice d'états, techniques liseré/enfoncement, dérivations sombres) — implémentation de référence : atelier DS-UI. 1.1.0 : valeurs dépendantes du thème — stress-test 2026-07-17.
last_updated: 2026-07-23
companion: ELEVATION-UX.md
tokens:
  # Aucune valeur nouvelle — les ombres vivent dans DESIGN.md ; le registre Relief DÉRIVE arêtes et
  # liserés des tokens de tone existants (mélange vers noir/blanc), il n'introduit pas de palette.
  niveaux:
    repos_surface: elevation.none
    repos_objet: elevation.raised # registre Relief actif uniquement
    survol: elevation.overlay # objets posés au survol (soulevé) ; superposés (toast) au repos
    enfoncement: "ombre interne — état, pas palier ; candidate à tokenisation (cf. UX/À approfondir)"
confidence: mixed
---

# Élévation & Relief — Couche UI (fondation)

> Grammaire d'application. Le raisonnement (grammaire posé/creusé/plat, physique de la lumière, statut de parti pris débrayable) vit dans ELEVATION-UX.md. Les valeurs sont résolues dans DESIGN.md ou dérivées des tokens de tone.

## Registre plat (défaut historique — registre Relief inactif)

| Niveau | Token | Application autorisée | Interdit |
|---|---|---|---|
| À plat | `elevation.none` | l'état de repos de toute surface | — |
| Soulevé | `elevation.raised` | retour de survol des surfaces **cliquables** uniquement | repos ; surface statique ; cumul avec `surface-contrast` |
| Au-dessus du flux | `elevation.overlay` | composants superposés (toast) | tout usage dans le flux |

## Registre Relief (parti pris débrayable) — application par nature

| Nature | Composants | Recette |
|---|---|---|
| **Posé** (plein) | Button filled, CompactButton filled, DeleteButton, SubmitButton (idle seul — la surface disparaît pendant l'animation) | arête : bordure `mix(tone, noir 38%)` · liseré : dégradé `mix(tone, blanc ~40%)` → transparent vers 85% de hauteur · ombre `elevation.raised` au repos |
| **Posé** (clair) | Button/Compact lighter, stroke | liseré blanc dégradé (lighter) ou aucun (stroke — la bordure de tone reste l'identité) · `elevation.raised` au repos |
| **Posé** (couche) | Toast | `elevation.overlay` (c'est sa couche) + liseré discret ; en sombre, liseré très atténué |
| **Posé au survol** | Card clickable/selectable | l'arête + liseré + `raised` vivent sur la couche de survol pré-rendue — ils apparaissent et disparaissent **avec** le survol ; le repos reste à plat (règle des surfaces) |
| **Creusé** | Input | fond `background` (pas de puits grisé) · ombre interne haute douce · double filet `border` ; états error/success/warning prioritaires sur le filet |
| **Plat** | Alert, ghost, texte, skeleton, surfaces statiques | aucune règle de relief — l'absence est la règle |

## Matrice d'états des objets posés

| État | Ombre | Fond | Liseré |
|---|---|---|---|
| défaut | `elevation.raised` | tone | clair, dégradé haut → bas |
| survol (soulevé) | `elevation.overlay` | **éclairci** : `mix(tone, blanc ~12%)` | plus clair |
| appui (enfoncé) | ombre **interne** haute | **assombri** : `mix(tone, noir ~20%)` — jamais le token de survol | assombri |

- L'appui ajoute une course de 0,5 px (transform) — le seul mouvement de la matrice.
- **Thème sombre** : mêmes directions (soulevé éclaircit, enfoncé assombrit — dérivation vers le noir, le token hover s'éclaircissant en sombre) ; liserés dans la gamme du tone (`mix(tone, blanc 35-40%)`), jamais blanc pur ; ombres internes renforcées (les valeurs claires y sont invisibles — dépendance au thème, 1.1.0).

## Techniques imposées

- **Liseré = anneau dégradé de 1 px**, pas un box-shadow (un box-shadow ne dégrade pas) : pseudo-élément `inset:0; padding:1px` + double masque (`mask: linear-gradient content-box, linear-gradient ; mask-composite: exclude`), fond `linear-gradient(vers le bas, liseré, transparent 85%)`. L'hôte est `position:relative` ; les changements d'état passent par la custom property du liseré (les pseudos héritent).
- **Jamais de box-shadow interpolé** (MOTION-UI fait autorité) : les swaps raised ↔ overlay ↔ interne sont **instantanés** ; seules les couleurs transitionnent. Sous `prefers-reduced-motion` : tout instantané.
- Composants sans bordure structurelle (métrique de crans) : l'arête passe par un box-shadow `inset 0 0 0 1px`, le liseré par un pseudo décalé de 1 px — la hauteur rendue ne change pas.
- La ligne de progression d'un toast non descartable s'anime en `scaleX` (transform), pilotée par le minuteur (gel au survol/focus) — jamais en largeur.

## Consommation par les composants

| Consommateur | Usage | Référence |
|---|---|---|
| Button, CompactButton, Submit/Delete | posé (matrice complète) — registre Relief seulement | BUTTON-UI |
| Input | creusé — registre Relief seulement | INPUT-UI |
| Card | `hover_shadow: elevation.raised` (les deux registres) ; + arête/liseré sur la couche de survol (Relief) ; skeleton et statique à plat | CARD-UI, seul consommateur 1.x conservé |
| Toast | `elevation.overlay` au repos (sa couche) + liseré (Relief) | TOAST-UI |
| Alert | aucun — décision explicite, dans les deux registres | ALERT-UI |

## Vérifiabilité

- `tools/valide-dossier.js` vérifie la résolution des tokens `elevation.*` ; les dérivations par mélange ne sont pas encore outillées (elles ne créent pas de token — limite assumée, cf. UX/À approfondir).
- Garde-fou structurel étendu : au registre Relief, le repos élevé est réservé aux natures **posées** du tableau ci-dessus — toute nouvelle consommation dans un `*-UI.md` doit citer ce fichier et classer sa surface (posé / creusé / plat).
- `test-rendu.js` ne vérifie pas la perception d'une ombre ni d'un liseré (aucun n'est un signal requis — forced-colors, cf. UX) : limite assumée.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Ombre animée via états pré-rendus, jamais box-shadow interpolé | [web.dev — animations guide](https://web.dev/articles/animations-guide) | Établi — littérature performance |
| T2 | Anneau dégradé par mask-composite (technique du liseré) | Technique CSS établie (gradient border), éprouvée dans l'implémentation de référence | Établi — technique ; valeurs = identité |
| T3 | Recettes posé/creusé/plat, matrice d'états, dérivations sombres | Implémentation de référence atelier DS-UI (2026-07-23) | Implémentation de référence — jamais un critère d'audit d'hôte |
| T4 | La technique du liseré par dégradé masqué est annulée en couleurs forcées, les images de fond non-url y étant forcées à néant, tout comme l'ombre. Seule l'arête réalisée en bordure survit | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) ; [W3C — CSS Color Adjust Level 1](https://www.w3.org/TR/css-color-adjust-1/) | Établi — **la section « Techniques imposées » du fichier UI ne mentionne pas cette dégradation** |
