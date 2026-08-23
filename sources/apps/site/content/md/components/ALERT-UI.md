---
component: alert
layer: ui
version: 1.4.0 # 1.4.0 : rattachement nommé aux 4 Languages ; contrat reduced-motion — clause `prefers-reduced-motion` nommant MOTION-UI.md (apparition/disparition en opacité conservable, aucune translation à supprimer) ; E-motion délégué au relais (aligné sur ALERT-UX.md 1.4.0), aucune valeur de token ni règle de rendu modifiée. 1.3.2 : renvoi de motion aligné sur sa nature de langage ; aucune règle ni valeur modifiée. 1.3.1 : conteneur en radius.lg (cran conteneur, DESIGN 1.20.0) au lieu de radius.md — stress-test 2026-07-17. 1.3.0 : renommage du composant callout → alert (décision 2026-07-11) — aucune règle modifiée, tous les renvois croisés mis à jour. Ancienne version : 1.2.0.
last_updated: 2026-07-21
companion: ALERT-UX.md
tokens:
  axes:
    tone: [info, success, warning, danger]
    persistance: [permanent, dismissible]
  icon_shape:
    # Silhouettes normatives — le glyphe précis reste une décision d'identité visuelle,
    # mais la FORME de base par tone est fixée ici : c'est elle qui distingue warning de danger
    # quand la couleur ne suffit pas (deuteranopie/protanopie).
    info: circle # cercle (i)
    success: circle-check # cercle + coche
    warning: triangle # triangle (!)
    danger: octagon # octogone (x) — registre "stop", jamais un triangle
  tone:
    info: { background: color.info-subtle, border: color.info, text: color.info, icon: color.info }
    success: { background: color.success-subtle, border: color.success, text: color.success, icon: color.success }
    warning: { background: color.warning-subtle, border: color.warning, text: color.warning, icon: color.warning }
    danger: { background: color.danger-subtle, border: color.danger, text: color.danger, icon: color.danger }
  structure:
    radius: radius.lg
    padding: spacing.md
    icon_gap: spacing.sm
    title_to_body: spacing.xs
    body_to_actions: spacing.sm
  typography: # ajouté en 1.1.3 — relié à la fondation (foundations/typography/)
    body_font: typography.body
    title_weight: typography.display.fontWeight # le titre se détache par la graisse, pas par un heading (cf. Accessibilité : un alert est un aparté, pas une section) — c'est le cas "avoir l'air d'un titre sans en être un" de TYPOGRAPHY-UX.md
    fallback: typography.fallback.sans
  icon_size: icon.md # ajouté en 1.2.0 — relié à la fondation (foundations/iconography/) : vaut pour l'icône de tone et la croix de fermeture
  motion: # ajouté en 1.2.0 — relié au langage (languages/motion/)
    apparition_reactive: { duration: motion.base, easing: motion.ease-out } # en opacité — jamais de slide qui pousse le contenu (cf. Apparition dynamique)
    disparition: { duration: motion.fast, easing: motion.ease-in } # la sortie prend le cran inférieur de l'entrée ; l'annonce AT ne dépend jamais du mouvement (ALERT-UX.md)
    proactif: aucune animation — contenu ordinaire du flux (règle généralisée dans MOTION-UX.md)
  dismiss:
    icon: color.text-secondary
    min_touch_target: 44px # standard externe non négociable, comme partout
  aria:
    reactive_danger_warning: role="alert"
    reactive_info_success: role="status"
    proactive: aucun role live — contenu ordinaire du flux
confidence: mixed
---

# Alert — Couche UI

> Tokens et techniques d'implémentation. Le raisonnement (tones, persistance, empilement, wording, risques) vit dans ALERT-UX.md.

## Les 2 axes, en bref

- **Tone** : info, success, warning, danger — la couleur sémantique, portée par le trio fond subtil / bordure / texte+icône. Le résumé d'erreurs de FORM est rendu avec ces tokens (tone danger — cf. DECISIONS.md pour le déplacement).
- **Persistance** : permanent, dismissible — aucun token de couleur propre ; la seule différence de rendu est la présence de la croix de fermeture.

Pas d'axe de contraste (high/low à la Carbon) : le niveau de contraste suit la gravité, il n'est pas choisi par instance (cf. note de transposition de ALERT-UX.md). Ce design system rend tous les alerts en "low contrast" (fond subtil + texte foncé de la famille) — la gradation de gravité passe par le tone, pas par une inversion de fond.

## Tokens DESIGN.md propres à ce composant

L'alert est le premier composant où **chaque** tone doit fonctionner en couple texte/fond subtil. Il s'appuie sur `color.info` / `color.info-subtle` et `color.success-subtle` (créés pour lui — le tone info ne peut pas emprunter `accent`, guardrail palette de marque ≠ état sémantique) et sur `color.success` recalibré. Tous les couples sont vérifiés au contraste par `tools/test-rendu.js` à chaque régénération. (Origine des tokens et arbitrages de recalibrage : cf. DECISIONS.md.)

## Rendu par tone

Fond `{tone}-subtle`, bordure `{tone}` en trait de 1px — **exception documentée**, au même titre que le 44px tactile : une épaisseur de hairline constante, pas une valeur d'échelle à tokeniser —, texte et icône `{tone}`, `radius.lg` (cran conteneur) — même rendu pour les 4 tones. Tous les couples texte/fond tiennent ≥ 4.5:1 (danger 5.30:1, warning 6.37:1, info 5.49:1, success 4.57:1) — c'est du texte courant lu en situation d'attention, le seuil AA s'applique sans aménagement.

## Structure et espacement

- Padding `spacing.md`, icône séparée du texte par `icon_gap` (`spacing.sm`), titre/corps resserrés (`spacing.xs`) — le bloc doit se lire comme une seule unité.
- L'icône est alignée sur la première ligne du titre, pas centrée verticalement sur le bloc — un alert long ne doit pas avoir une icône flottant au milieu.
- Largeur : 100 % du conteneur d'accueil (page, section, modale) — jamais de largeur propre.
- Une icône **par tone**, constante dans tout le produit, de **silhouette** fixée (`icon_shape` : cercle / cercle-coche / triangle / octogone) — le dessin précis du glyphe reste une décision d'identité visuelle, mais la forme de base ne se choisit pas : `warning` et `danger` sont chromatiquement proches, et pour une déficience rouge-vert la couleur seule ne les sépare pas. Triangle vs octogone est la distinction standard de l'industrie (signalisation routière, Carbon, GOV.UK) — la forme fait le travail que la couleur ne peut pas garantir. (Origine : cf. DECISIONS.md.)

## Croix de fermeture (dismissible uniquement)

- Vrai `<button>` avec libellé accessible ("Fermer"), icône en `color.text-secondary` (≥ 6:1 sur les 4 fonds subtils, vérifié), zone tactile `min_touch_target` 44px même si le glyphe est petit.
- Positionnée en fin de ligne de titre (coin opposé au sens de lecture) — dans l'ordre du DOM *après* le contenu, pour que le lecteur d'écran lise le message avant l'option de fermeture.

## Accessibilité — spécifications techniques

- **Proactif (chargé avec la page)** : aucun rôle live — c'est du contenu ordinaire, rencontré à sa place dans le flux, placé dans le DOM avant le contenu qu'il conditionne.
- **Réactif (injecté après une action)** : `role="alert"` pour danger/warning, `role="status"` pour info/success — l'élément porteur du rôle doit être présent dans le DOM avant l'injection du message, ou le message inséré d'un bloc avec son conteneur rôlé (les implémentations d'aria-live fragmentées annoncent de façon incohérente).
- Le titre n'est **pas** un élément de heading (`h2`...`h4`) par défaut — un alert est un aparté, pas une section du document ; un heading fantôme pollue la navigation par titres. Texte en graisse forte, sémantique portée par le rôle et l'icône.
- Icône porteuse de sens : `aria-hidden="true"` **si** le tone est déjà annoncé par le texte ou le rôle ; sinon alternative textuelle explicite ("Avertissement :"). Ne jamais compter sur la couleur seule (WCAG 1.4.1) — l'icône est le canal redondant.
- Insertion dynamique sans saut de lecture : réserver l'espace ou insérer sous le point de lecture courant quand c'est possible (cf. ALERT-UX.md, apparition dynamique).
- **`prefers-reduced-motion` (contrat de `MOTION-UI.md`)** : l'apparition et la disparition de l'alert se jouant **en opacité seule** (crans `apparition_reactive` / `disparition` du bloc `motion:` de l'en-tête ci-dessus — aucune translation, aucun slide, cf. ALERT-UX.md § États et comportement), elles sont **conservables telles quelles** sous `prefers-reduced-motion: reduce`. Le contrat de `MOTION-UI.md` désactive le mouvement *spatial* ; or il n'y en a aucun ici — **aucune translation à supprimer**, le fondu reste. La conformité est par construction : rien à dégrader, l'apparition en opacité *est* déjà la version reduced-motion.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | `role="alert"` vs `role="status"` selon la gravité et la réactivité | [Shopify Polaris — Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner), WAI-ARIA | Établi |
| T2 | Conteneur live présent avant injection (fiabilité des annonces) | Littérature accessibilité (comportement documenté des regions aria-live) | Établi par convergence |
| T3 | Zone tactile minimum 44px | WCAG / Apple HIG / Material Design | Établi, standard de l'industrie (seule valeur brute autorisée ici) |
| T4 | Seuil 4.5:1 sur tous les couples texte/fond des 4 tones | WCAG 2.1 — 1.4.3 ; ratios calculés (formule WCAG), re-vérifiés par tools/test-rendu.js | Établi (seuil) ; vérifié numériquement (valeurs) |
| T5 | Fond subtil + bordure + texte de la famille comme rendu d'alerte | Convention convergente (Polaris banner, Carbon low-contrast, GOV.UK) + précédent interne (FORM-UI ≤1.0.1) | Établi comme pattern, valeurs propres à ce système |
| T6 | Apparition/disparition en opacité conservable sous `prefers-reduced-motion` (aucune translation spatiale à supprimer) | `MOTION-UI.md` (contrat prefers-reduced-motion) ; ALERT-UX.md § États et comportement | Établi — rattachement interne au langage |
