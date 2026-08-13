---
name: "Documentation contextuelle UX/UI"
version: "1.35.0" # 1.35.0 : groupe `control` — les six crans `control.focus-*` du focus v2 sont enfin TOKENISÉS ici (arbitrage Aurélien 2026-08-03). Ils étaient référencés par huit fiches RULES et implémentés en color-mix dans le CSS, mais absents de cette source : `tokens.yaml` ne les définissait pas, et theme-gate.mjs testait encore `accent` (retiré en 1.34.0) — le gate refusait donc le thème par défaut de Fili. Ajout aussi de `control` aux deux listes de groupes de genere-tokens.js (GROUPS et GROUPES) : un groupe absent de ces listes est silencieusement supprimé de la sortie, c'est exactement le mécanisme qui a produit le trou. 1.34.0 : RETRAIT du rôle `accent` et de la gamme fuchsia (arbitrage Aurélien 2026-07-29 soir) — créé en 1.33.0 pour le focus ring, libéré le jour même par le focus v2 (anneau = cran subtil accordé à la bordure/état, control.focus-*, défaut primary éclairci ; cf. BORDER 1.4.0) : « un token naît d'un besoin réel » vaut aussi à la sortie — un token sans propriétaire n'a pas de place. Le calibrage fuchsia (règle des 30°, 4.71:1) reste journalisé ici et dans DECISIONS.md pour un éventuel retour. Guardrail marque/sémantique reformulé sur primary/secondary. 1.33.0 : refonte couleur (arbitrage Aurélien 2026-07-29) — `secondary` devient une VRAIE 2e couleur de marque (teal #0F766E, famille complète) ; l'ex-secondary (lavis indigo) est renommé `primary-subtle`/`primary-subtle-hover`/`on-primary-subtle` (la convention {nom}-subtle s'applique enfin à primary) ; `info` passe de #1D4ED8 à #0369A1 (sky — la règle des 30° le sépare de primary, Δ12,6° avant) ; `accent` passe de #0891B2 à #C026D3 (fuchsia, 4.71:1) ; la famille NEUTRAL est actée (neutral-strong[-hover] = son solide ; subtil = surface ; contour = border-strong). Nouvelle règle : « différenciation des teintes » (≥ 30° OKLCh entre rôles cohabitants, dérogations documentées). Cf. DECISIONS.md 2026-07-29. 1.32.0 : token `grid.overlay` (640) — largeur de la surface d'un superposé modal centré, né du composant Modal (premier consommateur réel). Aucun autre token modifié. Cf. DECISIONS.md 2026-07-26. 1.31.0 : 1.31.0 : tokens de la fondation TOUCH — target-min (24, plancher AA WCAG 2.5.8), target-comfortable (44, WCAG 2.5.5 AAA + Apple HIG 44 pt), target-spacing (8, Material). Nomme enfin le « 44px tactile » que scale.desktop-min citait sans le tokeniser ; le langage voisin gesture (comportemental) ne crée aucun token. Cf. TOUCH-UX/UI + GESTURE-UX/UI 1.0.0, DECISIONS.md 2026-07-25. 1.30.0 : tokens de la fondation OVERLAY — groupe `z-index` (sticky 100 · overlay 1000 · popover 1100 · toast 1200 · tooltip 1300, ordre par convergence) et `overlay.scrim` (voile modal, hors paires de contraste). Premier consommateur de la case réservée par ELEVATION (« échelle z-index et scrim ») et déléguée par ACCESSIBILITY (focus du « futur composant modal »). Cf. OVERLAY-UX/UI 1.0.0, DECISIONS.md 2026-07-24. 1.29.0 : tokens du shell applicatif — breakpoint.tablet (1024, off-canvas du rail de nav), breakpoint.desktop (1280, repli du rail d'outils), grid.rail-nav (280) et grid.rail-tools (320). Extension de la fondation grid (« Grille & layout ») au cadre multi-régions ; les DEUX régimes de contenu sont préservés, les paliers supplémentaires sont un fait de shell, pas de grille de contenu. Arbitrage Aurélien 2026-07-24 (breakpoint.tablet + priorité de repli) ; largeurs et 1280 proposés. Cf. GRID-UX/UI 1.2.0, DECISIONS.md 2026-07-24. 1.28.0 : index des principes étendu à performance (contrat des attentes, socle universel — cf. DECISIONS.md 2026-07-21). Aucun token modifié. 1.27.0 : token grid.item-min ajouté (pattern collection — largeur minimale d'un item de grille intrinsèque ; la grille de colonnes a trouvé son propriétaire, cf. DECISIONS.md 2026-07-21). 1.26.0 : index des principes étendu à cognitive-load (principe transversal compilé, chargé au socle universel du routeur — cf. DECISIONS.md 2026-07-21). Aucun token modifié. 1.25.1 : correction terminologique — le commentaire du cran motion.expressive/spring/celebration référençait encore « fondation E-motion », résidu antérieur à la reclassification 1.24.0 (E-motion est un langage). Aucun token modifié. 1.25.0 : équilibre Foundations / Languages / Principles ; Motion rejoint les langages, Accessibility / Adaptive / Laws deviennent des principes. Aucun token modifié. 1.24.0 : séparation structurelle Foundations / Languages ; Interaction, E-motion et Voice deviennent des langages de premier niveau. 1.23.0 : index étendu au Link et à Interaction / Adaptive Architecture. Historique complet : cf. DECISIONS.md
description: "Design system de référence pour la base de documentation contextuelle des composants UI. Sert de source de vérité aux tokens abstraits utilisés dans les fichiers *-UI.md (BUTTON-UI.md, INPUT-UI.md, et les suivants)."
colors:
  primary: "#4F46E5"
  primary-hover: "#4338CA" # état hover du fond primary — un cran plus sombre, même teinte
  on-primary: "#FFFFFF"
  primary-subtle: "#E0E7FF" # renommé en 1.33.0 (était « secondary », ajouté en 1.12.0) — lavis de la famille primary : fond doux pour actions et insignes secondaires. La convention {nom}-subtle s'applique enfin à primary ; le nom secondary est rendu à la 2e couleur de marque. Jamais un état sémantique (guardrail COLOR), ne délimite jamais seul (1.23:1 sur blanc)
  primary-subtle-hover: "#C7D2FE" # renommé en 1.33.0 (était secondary-hover) — hover du lavis primary, un cran plus soutenu, même teinte
  on-primary-subtle: "#3730A3" # renommé en 1.33.0 (était on-secondary) : 8.06:1 sur primary-subtle, 6.66:1 sur primary-subtle-hover — ≥ 4.5:1 partout où il porte du texte
  secondary: "#0F766E" # 1.33.0 — 2e couleur de MARQUE (teal-700), à 91° OKLCh de primary et loin de tous les statuts (règle des 30°) : 5.47:1 sur blanc, 4.86:1 sur secondary-subtle. Marque, jamais un état sémantique (même guardrail que primary/accent)
  secondary-hover: "#115E59" # 1.33.0 — hover du fond secondary plein : un cran plus sombre (teal-800), blanc dessus à 7.58:1
  secondary-subtle: "#CCFBF1" # 1.33.0 — lavis secondary (teal-100), sur le modèle danger-subtle
  secondary-subtle-hover: "#99F6E4" # 1.33.0 — hover du lavis secondary (teal-200) : secondary-hover dessus à 6.02:1
  on-secondary: "#FFFFFF" # 1.33.0 — texte/icône sur secondary plein : 5.47:1
  danger: "#B91C1C" # recalibré (était #DC2626) : 5.30:1 sur danger-subtle, 6.47:1 sur blanc — ≥ 4.5:1 partout où il porte du texte
  danger-hover: "#991B1B" # état hover du fond destructive plein (style filled)
  danger-subtle: "#FEE2E2"
  danger-subtle-hover: "#FBCFCF" # ajouté en 1.21.0 — hover du fond destructive subtil (style lighter) : danger reste ≥ 4.5:1 (4.60:1). Calibré (un #FECACA « red-200 » naïf tombait à 4.47:1, sous le seuil)
  success: "#15803D" # recalibré en 1.4.0 (était #16A34A) : 5.02:1 sur blanc, 4.57:1 sur success-subtle — success devient un token de texte avec l'alert, l'ancienne valeur était à 3.30:1 sur blanc
  success-subtle: "#DCFCE7" # ajouté en 1.4.0 — fond de l'alert success, sur le modèle danger-subtle/warning-subtle
  info: "#0369A1" # 1.33.0 (était #1D4ED8 blue) : sky-700 — la règle des 30° l'écarte de primary (Δ12,6° avant, indiscernables en périphérie) tout en restant le « bleu information » conventionnel : 5.93:1 sur blanc, 5.17:1 sur info-subtle
  info-subtle: "#E0F2FE" # 1.33.0 (était #DBEAFE) — fond de l'alert info, suit la teinte sky
  warning: "#92400E" # recalibré (était #D97706) : 6.37:1 sur warning-subtle, 7.09:1 sur blanc, 7.09:1 en blanc dessus quand il devient fond plein (style filled) — ambre profond qui se comporte comme un texte ET tient comme fond
  warning-hover: "#78350F" # ajouté en 1.21.0 — hover du fond warning plein (style filled) : un cran plus sombre, blanc dessus à 9.07:1
  warning-subtle: "#FEF3C7"
  warning-subtle-hover: "#FDE68A" # état hover du fond warning subtil (style lighter)
  background: "#FFFFFF"
  surface: "#F3F4F6" # recalibré (était #F9FAFB) : distinction zone de collection / carte doublée (1.05:1 → 1.10:1), cf. F11
  surface-hover: "#E5E7EB" # remplissage hover des styles sans fond au repos (stroke, ghost) — ~10% de teinte, l'équivalent d'un state layer
  surface-contrast: "#1C1C1E" # ajouté en 1.7.0 — panneau sombre de MISE EN AVANT (encart console/dashboard flottant sur fond clair, panneau central d'un stepper) ; jamais la surface de repos par défaut (rôle de `surface`, inchangée). Texte dessus : `background` ou `on-primary`. Provenance : cf. DECISIONS.md
  text-primary: "#111827"
  text-secondary: "#4B5563"
  text-muted: "#9CA3AF"
  border: "#E5E7EB"
  border-strong: "#6B7280" # recalibré (était #D1D5DB) : 4.83:1 sur blanc — une bordure qui délimite seule un composant doit tenir 3:1 (WCAG 1.4.11)
  neutral-strong: "#111827" # ajouté en 1.21.0 — fond plein du tone NEUTRE en action (bouton « noir », style filled) : blanc dessus à 17.74:1. Même valeur que text-primary (le neutre le plus soutenu de la palette), mais rôle distinct : un aplat d'action, pas du texte
  neutral-strong-hover: "#1F2937" # ajouté en 1.21.0 — hover du fond neutre plein (style filled) : un cran plus clair, blanc dessus à 14.68:1
typography:
  display:
    fontFamily: "Geist"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: "1.1"
  body:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.6"
  body-small: # ajouté en 1.19.0 — texte fonctionnel PLUS PETIT que le corps (helper, message d'erreur, compteur, légende) : le cran ~14 px manquant entre label (12 px, interface) et body (16 px). Réservé aux textes qui NE SONT PAS des champs de saisie (la règle « jamais sous 16 px » vise l'input, pas son helper). Révélé par le pilote externe 2026-07-16. Cf. DECISIONS.md.
    fontFamily: "Geist"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"
  label-mono:
    fontFamily: "JetBrains Mono"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "1.2"
    note: "Réservé aux DONNÉES techniques : blocs de tokens, code, attributions de fichiers, niveaux de confiance — plus aux étiquettes d'interface depuis 1.8.0 (cf. typography.label)"
  label: # ajouté en 1.8.0 — étiquette d'INTERFACE (pastilles, badges, kickers, étiquettes de cellules) : une linéale dédiée, lisible en capitales, là où le mono ne l'était pas (retour d'usage, cf. DECISIONS.md)
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "1.2"
  headings: # ajouté en 1.6.0 (fondation typographie) — tailles FLUIDES : clamp(min, fixe-rem + pente-vw, max), rem partout (jamais px seul), ratio max/min ≤ 2.5 par échelon (garde-fou WCAG 1.4.4, cf. TYPOGRAPHY-UX.md — point débattu)
    h1: "clamp(2rem, 1.67rem + 1.67vw, 3rem)" # 32→48px : le max rejoint display
    h2: "clamp(1.5rem, 1.33rem + 0.83vw, 2rem)" # 24→32px
    h3: "clamp(1.25rem, 1.17rem + 0.42vw, 1.5rem)" # 20→24px
    h4: "clamp(1.125rem, 1.08rem + 0.21vw, 1.25rem)" # 18→20px
    h5: "clamp(1rem, 0.96rem + 0.21vw, 1.125rem)" # 16→18px
    h6: "clamp(0.875rem, 0.83rem + 0.21vw, 1rem)" # 14→16px
  fallback: # ajouté en 1.6.0 — piles de secours : la page doit rester composée si Geist / JetBrains Mono ne chargent pas (polices non embarquées)
    sans: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    mono: "ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace"
spacing:
  base: "4px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px" # sert aussi de padding interne des cartes/panneaux — un "card-padding" externe de 24px recoupe ce token, ne pas en créer un second (constat 1.7.0, cf. DECISIONS.md)
  xl: "40px"
  section: "80px" # ajouté en 1.7.0 — rythme vertical des sections de page (20 × base = 2 × xl) — provisionné pour les pages/gabarits consommateurs de la charte. Provenance : cf. DECISIONS.md
scale:
  compact: "32px"
  base: "40px"
  expanded: "48px"
  desktop-min: "36px" # ajouté en 1.5.0 — hauteur interactive minimale sur desktop (cf. BUTTON-UI responsive) ; le pendant desktop du 44px tactile
breakpoint:
  mobile: "480px" # ajouté en 1.5.0 — bascule mobile/desktop partagée (grille de cartes → 1 colonne, boutons primaires full-width)
  tablet: "1024px" # ajouté en 1.29.0 (shell) — seuil du shell applicatif : sous ce point, le rail de navigation passe en off-canvas (mobile ET tablette). Palier de SHELL, pas de contenu : la colonne de contenu garde ses deux régimes (borné/plein). Cf. GRID-UX « Shell applicatif — régions ». Arbitrage Aurélien 2026-07-24.
  desktop: "1280px" # ajouté en 1.29.0 (shell) — seuil d'apparition du rail d'outils (région secondaire) : il cède AVANT le rail de nav quand la largeur manque. Entre tablet et desktop, seuls nav + contenu tiennent ; le rail d'outils se replie en panneau invocable. Valeur calée sur rail-nav(280) + contenu utile(~680) + rail-tools(320). Proposé — ajustable.
measure: # ajouté en 1.6.0 (fondation typographie)
  reading-max: "70ch" # mesure de lecture maximale du texte courant — dans la fourchette classique ~45-75 caractères/ligne ; un texte fluide sans max-width casse cette mesure sur grand écran (cf. TYPOGRAPHY-UX.md)
radius: # renommé depuis "rounded" en 1.3.0 — les *-UI.md (et la prose de ce fichier) référencaient déjà radius.*, c'est le frontmatter qui était en décalage (F01)
  sm: "4px"
  md: "8px"
  lg: "12px" # ajouté en 1.20.0 — cran CONTENEUR : sépare le rayon des conteneurs (card, alert) de celui des contrôles (bouton/input à radius.sm/md). Révélé par le stress-test 2026-07-17 (une maquette déclarait carte 16 / contrôle 8 — intention inexprimable sans un cran conteneur, un thème ne créant pas de nom). Convergence Atlassian (conteneurs/modales ~12px). L'imbrication reste concentrique (contrôle md 8px dans une carte lg 12px : interne < externe). Cf. DECISIONS.md.
  pill: "9999px"
elevation:
  none: "none"
  raised: "0 1px 3px rgba(17, 24, 39, 0.10)"
  overlay: "0 4px 12px rgba(17, 24, 39, 0.14)"
media_ratio:
  landscape: "16 / 9"
  square: "1 / 1"
z-index: # ajouté en 1.30.0 (fondation overlay) — ordre d'empilement des couches ; aucun z-index codé en dur, tout superposé référence un cran. Ordre établi par convergence (Bootstrap/Material/Microsoft) ; nombre de crans = arbitrage interne compact. Le scrim partage la couche `overlay` (rendu DERRIÈRE la surface par ordre DOM), pas un cran de plus.
  sticky: "100" # couche collante DANS le flux : en-tête, rails sticky du shell
  overlay: "1000" # superposé MODAL : scrim + surface (drawer, modale)
  popover: "1100" # superposés NON-MODAUX ancrés (dropdown, menu, popover) — au-dessus d'un modal (menu ouvert depuis une modale)
  toast: "1200" # notifications éphémères (toast) — au-dessus du contenu applicatif
  tooltip: "1300" # libellé au survol/focus, jamais masqué — la couche la plus haute
overlay: # ajouté en 1.30.0 (fondation overlay) — le voile d'un superposé modal. Ce N'EST PAS un rôle de COLOR (il ne porte pas de texte, n'entre dans aucune paire de contraste) : token fonctionnel propre à la fondation overlay.
  scrim: "rgba(17, 24, 39, 0.5)" # voile neutre sombre (base text-primary #111827) à 50 %. Le consommateur peut densifier ce voile en mode sombre.
border: # ajouté en 1.9.0 (fondation border) — le focus ring de bouton/input/card n'avait que sa couleur (color.accent) : largeur et écart étaient des déductions silencieuses
  focus-width: "2px" # largeur de l'anneau de focus — implémenté en outline, jamais en border (pas de layout shift) ; convention Atlassian (border.width.focused)
  focus-offset: "2px" # écart entre le composant et l'anneau — le ring s'AJOUTE à la bordure d'état, il ne la remplace pas (cf. BORDER-UX.md)
control: # ajouté en 1.35.0 — les SIX CRANS DE COULEUR de l'anneau de focus (focus v2, arbitré le 2026-07-29). Le focus v2 avait retiré `accent` (1.34.0) et posé `control.focus-*` dans la prose (BORDER, BUTTON, CARD, CHIP, COLOR, INPUT, LINK, TABS) et dans le CSS (packages/tokens/src/tokens.source.mjs, en color-mix), sans jamais NOMMER les crans ici : huit fiches RULES référençaient un token que la distribution ne définissait pas, et theme-gate.mjs testait toujours `accent` — il refusait donc le thème par défaut de Fili (constat exécuté le 2026-08-03, exit 1 sur nos propres tokens). Les valeurs ci-dessous sont la RÉSOLUTION en thème clair du mélange défini dans tokens.source.mjs ; le CSS garde la formule comme implémentation (elle suit le thème), ces hex sont ce que le gate peut tester. Les deux doivent rester d'accord — c'est theme-gate qui l'objective, chaque cran étant vérifié ≥ 3:1 sur `background` (WCAG 1.4.11).
  focus-primary: "#807AEC" # DÉFAUT de l'anneau — mix(primary #4F46E5, blanc 28 %) : 3.55:1 sur background
  focus-neutral: "#7C8088" # mix(neutral #111827, blanc 45 %) : 3.96:1
  focus-danger: "#C74949" # mix(danger #B91C1C, blanc 20 %) : 4.69:1 — input en erreur, bouton destructive
  focus-success: "#449964" # mix(success #15803D, blanc 20 %) : 3.51:1
  focus-warning: "#A8663E" # mix(warning #92400E, blanc 20 %) : 4.53:1
  focus-info: "#3587B4" # mix(info #0369A1, blanc 20 %) : 3.98:1
icon: # ajouté en 1.10.0 (fondation iconography) — les tailles d'icônes étaient déduites silencieusement par 4 composants
  sm: "16px" # dense, inline, chevrons
  md: "20px" # défaut — apparié au corps typography.body 16px (modèle Carbon : 20 ↔ 16)
  lg: "24px" # icon-only lg, media fallback, zones aérées
  stroke: "1.5px" # trait constant de toute la bibliothèque d'icônes — décision d'identité fixée ici, comme les polices (convergence Atlassian/Polaris)
motion: # ajouté en 1.11.0 (fondation motion) — durées et courbes des micro-interactions ; tout le système reste sous ~400ms (au-delà : perçu lent, cf. MOTION-UX.md)
  fast: "100ms" # feedback : hover, press, changements de couleur/bordure — au seuil du perçu-instantané (~100ms, Nielsen)
  base: "200ms" # continuité locale : chevron, apparition, dépliage
  slow: "300ms" # grandes surfaces — provisionné (panneaux, futurs superposés)
  ease-out: "cubic-bezier(0, 0, 0.2, 1)" # ce qui entre décélère
  ease-in: "cubic-bezier(0.4, 0, 1, 1)" # ce qui sort accélère — et prend le cran de durée inférieur de son entrée
  ease-in-out: "cubic-bezier(0.4, 0, 0.2, 1)" # ce qui bouge sur place (chevron, dépliage)
  # Cran EXPRESSIF (ajouté en 1.22.0, langage E-motion) — le « chemin sanctionné » que MOTION-UX déclare paramétrable.
  # RÉSERVÉ aux moments MÉRITÉS, sous budget de rareté (cf. EMOTION-UX.md). Les contraintes WCAG de motion tiennent (reduced-motion, transform/opacity, pas de flash) : seul le parti pris « productif seulement » est relevé.
  expressive: "700ms" # beat d'un moment expressif — volontairement au-delà de la borne ~400ms du registre productif
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" # courbe à léger DÉPASSEMENT (overshoot) — le « caractère » d'E-motion ; interdite hors moment mérité
  celebration: "1200ms" # plafond DUR d'une séquence chorégraphiée complète (set-piece signature, ex : l'avion en papier). Au-delà, perçu comme un blocage
grid: # ajouté en 1.18.0 (fondation grid/layout) — largeurs de conteneur structurelles ; le pilote externe 2026-07-16 a montré (2 occurrences) qu'un écran mono-colonne n'avait aucun token de largeur et détournait breakpoint.mobile. Distinct de measure.reading-max (mesure de lecture du texte) et de breakpoint (points de bascule) : ici, la max-width d'un conteneur de page. La grille de colonnes vit désormais dans le pattern collection (COLLECTION-UX/UI, 2026-07-21) — item-min ci-dessous est sa seule valeur. Cf. DECISIONS.md 2026-07-16.
  container-narrow: "480px" # formulaire, auth, création de compte — mono-colonne focalisée. Même valeur numérique que breakpoint.mobile, rôle distinct (max-width d'un conteneur, pas point de bascule) — deux tokens car deux rôles.
  container-default: "1024px" # page de contenu ou d'app standard (convergence GOV.UK ~1020, Material window size classes)
  container-wide: "1440px" # dashboard, collection dense, tableau large (Carbon borne à 1584 en 16 colonnes)
  item-min: "256px" # ajouté en 1.27.0 (pattern collection) — largeur MINIMALE d'un item de grille intrinsèque (64 × la grille de base de 4px) : les colonnes émergent de repeat(auto-fill, minmax(min(100%, item-min), 1fr)), jamais d'un nombre par appareil. Cf. COLLECTION-UI.md, DECISIONS.md 2026-07-21.
  rail-nav: "280px" # ajouté en 1.29.0 (shell) — largeur du rail de navigation (début) : logo + sélecteur de site + accordéons de liens. 70 × 4px. Proposé — ajustable.
  rail-tools: "320px" # ajouté en 1.29.0 (shell) — largeur du rail d'outils (fin) : theming/playground + table des matières « sur cette page ». 80 × 4px. Proposé — ajustable.
  overlay: "640px" # ajouté en 1.32.0 (composant modal) — largeur maximale de la surface d'un superposé modal CENTRÉ. Ni un conteneur de page (une modale n'est pas une page) ni un rail (elle n'est pas ancrée à un bord) : troisième rôle de largeur, d'où un token et pas un réemploi. 160 × 4px. UN seul cran : la modale de confirmation reste sur container-narrow (480), et au-delà de 640 le contenu appelle une page. Cf. MODAL-UX/UI, DECISIONS.md 2026-07-26.
touch: # ajouté en 1.31.0 (fondation touch) — taille et atteinte des cibles tactiles ; le « 44px tactile » que scale.desktop-min citait est enfin nommé. Le doigt est imprécis (~9 mm) et masque sa cible : la zone tapable a une taille plancher, une taille confortable et un espacement minimal. Cf. TOUCH-UX/UI 1.0.0, DECISIONS.md 2026-07-25.
  target-min: "24px" # plancher absolu d'une cible tactile — WCAG 2.5.8 (niveau AA). En dessous : exceptions inline/essentiel déclarées seulement.
  target-comfortable: "44px" # cible confortable par défaut au doigt — convergence WCAG 2.5.5 (AAA) + Apple HIG (44 pt). Material vise 48 ; 44 = point de convergence WCAG/HIG. Le pendant tactile de scale.desktop-min (36).
  target-spacing: "8px" # écart minimal entre deux cibles tactiles adjacentes (convergence Material 8dp). Non optionnel quand la densité force le plancher.
components:
  button:
    reference: "BUTTON-UX.md (raisonnement) + BUTTON-UI.md (tokens)"
  input:
    reference: "INPUT-UX.md (raisonnement) + INPUT-UI.md (tokens)"
  card:
    reference: "CARD-UX.md (raisonnement) + CARD-UI.md (tokens)"
  alert:
    reference: "ALERT-UX.md (raisonnement) + ALERT-UI.md (tokens)"
  link:
    reference: "LINK-UX.md (navigation) + LINK-UI.md (tokens et états)"
foundations: # 9 fondations documentées — matières et vocabulaires de construction
  typography:
    reference: "TYPOGRAPHY-UX.md + TYPOGRAPHY-UI.md"
  color:
    reference: "COLOR-UX.md + COLOR-UI.md"
  spacing:
    reference: "SPACING-UX.md + SPACING-UI.md (proximité, densité, régimes ; le cadre de page est passé à la fondation grid)"
  grid:
    reference: "GRID-UX.md + GRID-UI.md (largeurs de conteneur / cadre de page ; grille de colonnes différée)"
  elevation:
    reference: "ELEVATION-UX.md + ELEVATION-UI.md"
  border:
    reference: "BORDER-UX.md + BORDER-UI.md"
  radius:
    reference: "RADIUS-UX.md + RADIUS-UI.md"
  iconography:
    reference: "ICONOGRAPHY-UX.md + ICONOGRAPHY-UI.md"
  touch:
    reference: "TOUCH-UX.md + TOUCH-UI.md (taille et atteinte des cibles tactiles ; crée les tokens touch.* — target-min/comfortable/spacing)"
languages: # 5 langages documentés — canaux par lesquels l'interface exprime du sens
  interaction:
    reference: "INTERACTION-UX.md + INTERACTION-UI.md (affordance : rôle avant style, sans nouveau token)"
  emotion:
    reference: "EMOTION-UX.md + EMOTION-UI.md (expression — extension sanctionnée de motion pour des moments mérités, sous budget de rareté et contrat de repli)"
  motion:
    reference: "MOTION-UX.md + MOTION-UI.md (expression temporelle — feedback et continuité ; tokens résolus dans DESIGN.md)"
  voice:
    reference: "VOICE-UX.md + VOICE-UI.md (voix & ton — aucun token propre : référence typography.label / measure)"
  gesture:
    reference: "GESTURE-UX.md + GESTURE-UI.md (le geste comme raccourci jamais unique ; alternatives WCAG 2.5.1/2.5.7/2.5.4 ; aucun token propre — compose motion.* et touch.*)"
principles: # 5 principes documentés — obligations et raisonnements qui encadrent toute décision
  accessibility:
    reference: "ACCESSIBILITY-UX.md (principe transversal UX-only — companion: none, aucun token ; compilé vers dist/RULES-accessibility.md et chargé par le routeur pour TOUTE intention)"
  adaptive:
    reference: "ADAPTIVE-UX.md + ADAPTIVE-UI.md (le composant répond à son conteneur ; la page et l'environnement répondent au viewport)"
  cognitive-load:
    reference: "COGNITIVE-LOAD-UX.md (principe transversal UX-only — companion: none, aucun token ; pendant opérationnel du catalogue laws ; compilé vers dist/RULES-cognitive-load.md et chargé par le routeur pour TOUTE intention)"
  laws:
    reference: "LAWS-UX.md (principe de RÉFÉRENCE HUMAINE — audience: humans, non compilé vers dist/ ; catalogue des lois UX et de leurs limites)"
  performance:
    reference: "PERFORMANCE-UX.md (principe transversal UX-only — companion: none, aucun token ; le contrat des attentes : seuils de feedback, stabilité, optimisme, honnêteté ; compilé vers dist/RULES-performance.md et chargé par le routeur pour TOUTE intention)"
---
# Documentation contextuelle UX/UI — Design System

## Rôle de ce fichier
Ce fichier ne documente pas de composant — il fournit les valeurs réelles derrière les tokens abstraits utilisés partout ailleurs (`color.primary`, `spacing.md`, `radius.sm`...). Les fichiers `*-UI.md` de chaque composant y renvoient plutôt que de dupliquer ces valeurs. Une re-thématisation des valeurs tokenisées (couleurs, radius, police...) se fait dans ce seul fichier — les fichiers `*-UX.md` de chaque composant restent stables, puisqu'ils ne référencent jamais de valeur brute. Un changement d'identité plus large (iconographie, voix, composition, forme) peut en revanche déborder des tokens : ce fichier ne le couvre pas à lui seul.

## Couleurs
Palette de marque à deux teintes — indigo (`primary`) et teal (`secondary`). `primary` porte les actions principales, `secondary` la seconde voix de marque. Le focus n'est plus un rôle de marque : depuis le focus v2 (1.34.0), l'anneau est un CRAN SUBTIL accordé à la bordure/état du composant (`control.focus-*`, défaut primary éclairci) — l'ex-rôle `accent` (fuchsia, 1.33.0) est retiré, un token sans propriétaire n'ayant pas de place. Les rôles sémantiques (`danger`, `success`, `warning`) restent volontairement distincts des couleurs de marque pour ne jamais confondre "action de marque" et "état sémantique" — le même principe que la séparation variant/tone du bouton.

### Recalibrage de contraste (1.3.0)
Le premier passage de test visuel a montré que quatre valeurs ne tenaient pas les seuils que ce système s'impose lui-même (3:1 sur tout état visible, 4.5:1 sur le texte courant). Les teintes ont été assombries d'un ou deux crans **sans changer de famille** — l'esprit indigo/cyan est conservé, seule la luminosité bouge :
- `accent` #06B6D4 → **#0891B2** : le focus ring passait sous 3:1 sur fond blanc (2.43:1 → 3.68:1). Le cyan reste le cyan.
- `danger` #DC2626 → **#B91C1C** : le texte du résumé d'erreurs sur `danger-subtle` passait sous 4.5:1 (3.95:1 → 5.30:1). Bénéfice collatéral : le blanc sur fond destructive monte à 6.47:1.
- `warning` #D97706 → **#92400E** : illisible sur `warning-subtle` (2.86:1 → 6.37:1). C'est le changement le plus visible — l'ambre clair devient un ambre profond. À l'origine (1.14.0) `warning` était pensé comme un token de **texte et de bordure** uniquement, jamais de fond plein. **Révisé en 1.21.0** : l'ambre profond porte le blanc à 7.09:1, donc il tient AUSSI comme fond plein. Le tone warning cesse d'être l'exception — il a désormais les quatre styles comme les autres tones (cf. modèle style × tone du bouton, DECISIONS.md 2026-07-18). L'ambre clair d'origine, lui, n'aurait jamais tenu en fond plein : c'est l'assombrissement qui a rendu ce style possible.
- `border-strong` #D1D5DB → **#6B7280** : une bordure qui délimite seule un composant (bouton secondary) était à 1.47:1, invisible. `border` (#E5E7EB) reste inchangé pour les séparations décoratives — la distinction entre les deux tokens devient réelle au lieu d'être nominale.
- `surface` #F9FAFB → **#F3F4F6** : la distinction zone de collection / carte exigée par CARD-UI.md était imperceptible (1.05:1). Doublée (1.10:1) tout en restant volontairement subtile — c'est un fond de zone, pas un aplat décoratif.

## Différenciation des teintes (ajoutée en 1.33.0)

Deux rôles sémantiques pouvant cohabiter à l'écran sont séparés d'**au moins 30° de teinte OKLCh**, sauf s'ils se distinguent nettement sur un autre axe (Δchroma ≥ 0,08 ou Δclarté ≥ 0,15) — la dérogation est alors documentée ici. C'est cette règle qui a écarté `info` de `primary` (Δ12,6° avant 1.33.0 : indiscernables en périphérie ou en légende) et choisi le teal pour `secondary` (le fuchsia d'`accent`, calibré par la même règle, est sorti avec le rôle en 1.34.0 — le calibrage reste journalisé). Positions actuelles (clair) : danger 27° · warning 46° · success 150° · secondary 186° · info 249° · primary 277°.

**Dérogation documentée** : danger (27°) ↔ warning (46°) sont à Δ18,7° — admis parce qu'ils se séparent par la chroma et la perception (rouge vif vs brun terreux), et que la paire est héritée des recalibrages de contraste 1.4–1.21. À retester si l'une des deux teintes bouge.

## États interactifs (ajoutés en 1.3.0 ; complétés en 1.21.0)
Le test visuel a montré que l'état hover — "principal signal d'affordance sur desktop" selon BUTTON-UX.md — n'avait aucun token. Cette version ajoute une famille, sur le modèle des *state layers*. Le passage au modèle **style × tone** du bouton (1.21.0) a rendu la famille symétrique : chaque tone possède un hover pour son fond plein (style `filled`) ET un hover pour son fond subtil (style `lighter`).
- **Hover d'un fond plein** (style `filled`) — un cran plus sombre, le texte reste blanc/on-color ≥ 4.5:1 : `primary-hover`, `neutral-strong-hover`, `danger-hover`, `warning-hover`.
- **Hover d'un fond subtil** (style `lighter`) — un cran plus soutenu, le texte garde son token de tone ≥ 4.5:1 : `primary-subtle-hover` (primary — renommé en 1.33.0, ex-secondary-hover), `secondary-subtle-hover` (secondary), `surface-hover` (neutral), `danger-subtle-hover`, `warning-subtle-hover`.
- **Hover sans fond au repos** (style `stroke`, `ghost`) : le hover fait *apparaître* le fond subtil du tone (mêmes valeurs que ci-dessus) au lieu d'assombrir un fond existant — `surface-hover` reste le remplissage neutre par défaut.
- Toutes ces paires texte/fond au hover sont vérifiées ≥ 4.5:1 par `tools/test-rendu.js` à chaque build.

Le mapping combinaison → token vit dans `BUTTON-UI.md` (section hover), pas ici — ce fichier ne connaît que les valeurs.

## Surface de contraste (ajoutée en 1.7.0)
`surface-contrast` (#1C1C1E) est un fond sombre **de mise en avant** : encart "console"/dashboard flottant sur fond clair, panneau central d'un enchaînement d'étapes — les moments où un bloc doit se détacher de la page. Ce n'est **pas** une surface de repos : `surface` (#F3F4F6) garde ce rôle, inchangée, et aucun composant documenté (`*-UI.md`) ne consomme `surface-contrast` à ce jour — il est provisionné pour ces moments de mise en avant. Texte dessus : `background` ou `on-primary` (blanc, contraste large) ; ne pas y poser les tokens `text-*` prévus pour fond clair, hors `text-muted` réservé aux métadonnées discrètes. Un ton neutre presque noir, volontairement distinct d'une simple inversion de `text-primary` (#111827, bleuté) — provenance et arbitrage : cf. DECISIONS.md.

## Typographie
Geist pour les titres et le corps de texte — lisible, neutre, professionnelle. JetBrains Mono réservé aux **données** techniques (les tokens JSON, le code, les attributions de fichiers, les niveaux de confiance) — il signale "ceci est une donnée structurée". Depuis 1.8.0, les **étiquettes d'interface** (pastilles, badges, kickers) ont leur propre style `label` en Inter : le mono en capitales espacées s'est révélé illisible et déplaisant en étiquette (retour d'usage, cf. DECISIONS.md) — la frontière est désormais nette : Inter pour étiqueter, JetBrains Mono pour citer une donnée.

### Échelle de titres et mesure (ajoutées en 1.6.0 — fondation typographie)
Le raisonnement complet vit dans `content/md/foundations/TYPOGRAPHY-UX.md` ; ce fichier ne porte que les valeurs :
- **`typography.headings.h1`–`h6`** : tailles fluides en `clamp()`, avec du `rem` dans le min, le max **et** la partie fixe de la valeur préférée — jamais de `vw` seul (échec WCAG 1.4.4 : le zoom navigateur n'affecte pas les unités viewport). Ratio max/min ≤ 2.5 par échelon — garde-fou communément admis mais **débattu** aux zooms extrêmes (cf. sources).
- **`typography.fallback.sans` / `.mono`** : piles de secours — Geist et JetBrains Mono ne sont pas embarquées, tout consommateur doit déclarer `fontFamily, fallback`.
- **`measure.reading-max`** : la mesure de lecture s'exprime en `ch` (elle suit la police et sa taille), pas en px.

## Spacing et échelle
Grille de base à 4px — c'est la grille que les fichiers `*-UI.md` demandaient explicitement sans jamais la fixer ("ce gabarit ne définit pas de grille de base"). `scale.compact/base/expanded` résout la même réserve côté hauteurs de composants (bouton `sm`/`md`/`lg`).

## Radius (renommé en 1.3.0)
Le groupe s'appelait `rounded:` alors que toutes les fiches `*-UI.md` — et la prose de ce fichier même — référençaient `radius.*`. Le frontmatter s'aligne sur l'usage réel : `rounded` n'existe plus, c'est `radius`. Aucune valeur n'a changé. (Correction F01 du RAPPORT-TEST — un consommateur strict des .md ne pouvait pas résoudre `radius.sm`.)

## Elevation et ratios de media (ajoutés en 1.2.0, pour le composant card)
- `elevation.*` : premières ombres du système — aucun composant n'en avait besoin avant la carte. `raised` est réservé au retour de survol des cartes cliquables (l'élévation comme signal d'affordance, cf. CARD-UI.md) ; `overlay` est provisionné pour les futurs composants superposés (modale, popover) afin de ne pas multiplier les valeurs le jour venu. Teinte basée sur `text-primary` (#111827) plutôt que noir pur, pour rester cohérent avec la palette. **Dépendance au thème (1.20.0)** : ces valeurs supposent un fond clair — une ombre teintée à 10 % est quasi invisible sur un fond sombre. L'élévation est donc dépendante du thème au même titre que les couleurs : un thème sombre doit la redéfinir (convention : éclaircir la surface avec la hauteur), sinon le consommateur croit avoir une ombre qu'il n'a pas. Cf. ELEVATION-UX/RULES.
- `media_ratio.*` : ratios d'image exprimés en fraction CSS (`aspect-ratio`), pas en px — la carte impose un ratio unique par collection (cf. CARD-UX.md), ce token fixe lequel. `landscape` (16/9) par défaut, `square` pour les cas avatar/produit.

## Focus ring, iconographie, motion (ajoutés en 1.9.0–1.11.0 — passe fondations)

Trois groupes nés de la passe fondations du 2026-07-11, tous les trois pour résorber des **déductions silencieuses** (le travers documenté depuis `tone.destructive_text`) :
- **`border.focus-*`** : trois composants déclaraient la *couleur* du focus ring (`color.accent`) et laissaient largeur et écart à l'imagination de l'implémenteur. Le ring est désormais spécifié une fois pour tout le système (`BORDER-UI.md` fait autorité sur son application : outline + offset, jamais border).
- **`icon.*`** : quatre composants rendent des icônes (tones de l'alert, chevron de la card, actions du bouton, services de l'input) sans qu'aucune taille ne soit fixée nulle part. Trois crans fermés + le trait, appariés au corps de texte (`ICONOGRAPHY-UI.md`). Le dessin des glyphes reste une décision d'identité — ce fichier fixe la géométrie, pas le style.
- **`motion.*`** : les micro-interactions existaient (hover "principal signal d'affordance", rotation du chevron, disparition de l'alert, pulse du skeleton) sans vocabulaire commun de durées ni de courbes. Trois durées, trois courbes, bornées sous ~400ms (`MOTION-UI.md` porte le mapping et les techniques ; `prefers-reduced-motion` est traité dans MOTION-UX.md).

Le raisonnement du mouvement vit dans `content/md/languages/` ; les autres vocabulaires tokenisés vivent dans `content/md/foundations/`. Ce fichier ne porte que les valeurs.

## Atmosphère (ajoutée en 1.14.0 — v1, tokens seuls)
Le rebranding d'essai PaperFlow (démonstration par les thèmes, public/pages/tests.html) a montré que tout ce qui fait l'« ambiance » d'une identité — nappes dégradées, halos, anneaux décoratifs, ombres teintées — n'était couvert par aucun token : chaque implémenteur improvisait opacités et positions. Ces effets sont restés **décoratifs et propres au chrome du site** (dérivés des couleurs du thème via `color-mix()`, jamais une couleur nouvelle) : ils **ne font pas partie du corpus distribué** — ni `dist/tokens.css`, ni `dist/tokens.yaml`, ni l'export Figma — et **aucun composant ne les consomme**. Ils n'entreront dans le système comme fondation que le jour où un composant réel les exigera ; à ce moment seulement, un fichier de règles d'usage et une chaîne d'export complète seront écrits. En attendant, ce ne sont pas une promesse du système distribué.

## Guardrails
- Ne jamais utiliser `primary` ou `secondary` pour un état sémantique (erreur, succès, alerte) — ces rôles ont leurs propres tokens, ne pas les improviser à partir de la palette de marque.
- **Bordure délimitante vs décorative (clarifié en 1.4.1)** : une bordure qui est le *seul signal* permettant d'identifier un composant interactif au repos (champ de saisie, bouton secondary) utilise `border-strong` et doit tenir 3:1 (WCAG 1.4.11) — la règle "3:1 sur tout état visible" s'y applique sans exception. `border` est réservé aux séparations et groupements **décoratifs** (bordure de carte outlined, séparateurs), où le composant est identifié par son contenu, pas par son trait. Le critère n'est pas le composant, c'est la question : *"si cette bordure disparaît, l'utilisateur sait-il encore où interagir ?"* Si non → `border-strong`. Le test de rendu (tools/test-rendu.js) applique ce critère identiquement à tous les composants.
- Toute nouvelle fiche composant (`*-UI.md`) doit référencer les tokens de ce fichier par leur nom, jamais introduire une valeur brute (hex, px) sans l'ajouter ici d'abord.
- Une **re-thématisation des valeurs** (couleurs, radius, police...) se fait dans ce seul fichier — sans jamais toucher aux fichiers `*-UX.md`. Le jour où re-thématiser oblige à éditer un `*-UX.md`, c'est le signal que la scission UX/UI a une fuite. Un **changement d'identité plus large** (iconographie, voix, composition, forme) peut en revanche déborder des tokens : ce fichier ne le couvre pas à lui seul.
- **Vérification du contraste — deux outils, deux publics (clarifié en 1.20.0)** : côté **mainteneur**, tout recalibrage de couleur est re-vérifié par `node tools/test-rendu.js` au build (les seuils de ce fichier ne sont pas déclaratifs, ils sont testés). Côté **consommateur** qui re-thématise, la distribution livre `dist/theme-gate.mjs` — mêmes seuils, mêmes paires de rôles — qui refuse un thème non conforme avant qu'il s'applique (`node theme-gate.mjs [tokens]`). Un garde-fou n'est exécutable que s'il est distribué : c'est pourquoi l'outil consommateur voyage dans `dist/`, pas seulement dans `tools/` (copie assurée par `genere-tokens.js`).

## Sources et niveau de confiance
| Affirmation | Source | Confiance |
|---|---|---|
| Seuils 3:1 (états visibles, non-texte) et 4.5:1 (texte courant) appliqués au recalibrage 1.3.0 | WCAG 2.1 — 1.4.3 (contraste texte) et 1.4.11 (contraste non textuel) | Établi, standard d'accessibilité |
| Teintes recalibrées (danger, warning, accent, border-strong, surface) | Décision interne — familles de teintes conservées, luminosité assombrie jusqu'au seuil ; ratios vérifiés par calcul (tools/test-rendu.js) | Décision de conception, vérifiée numériquement, pas une étude empirique |
| Hover en "state layer" : fond assombri d'un cran (styles avec fond — filled, lighter) ou remplissage léger (~10%) apparaissant au survol (styles sans fond — stroke, ghost) | Convention Material Design (state layers), observation production | Établi par convergence, valeurs précises propres à ce système |
| Renommage `rounded` → `radius` (alignement sur l'usage) | Constat d'incohérence interne (RAPPORT-TEST F01) — l'usage unanime des consommateurs prime sur le nom du groupe | N/A — correction de cohérence, pas une affirmation empirique |
| Tailles fluides en clamp(rem + vw), jamais vw seul ; ratio ≤ 2.5 par échelon | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/), d'après [Adrian Roselli](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) | Émergent/débattu — même corrigé, un échec à 200 % de taille reste possible à zoom extrême (détail dans TYPOGRAPHY-UX.md) |
| Focus ring 2px + offset 2px | [Atlassian — Border](https://atlassian.design/foundations/border) (border.width.focused) | Établi chez Atlassian ; adoption interne (BORDER-UX.md) |
| Tailles d'icônes appariées au corps de texte (20 ↔ 16) | [Carbon — Icons usage](https://carbondesignsystem.com/elements/icons/usage/) | Établi chez Carbon, transposé (ICONOGRAPHY-UI.md) |
| Durées 100/200/300ms sous la borne des ~400ms ; courbes ease-out/in/in-out | [Atlassian](https://atlassian.design/foundations/motion), [Carbon](https://carbondesignsystem.com/elements/motion/overview/), [Material](https://m1.material.io/motion/duration-easing.html), [NN/g](https://www.nngroup.com/articles/response-times-3-important-limits/) | Établi par convergence (plages) ; valeurs exactes propres à ce système (MOTION-UX.md) |
