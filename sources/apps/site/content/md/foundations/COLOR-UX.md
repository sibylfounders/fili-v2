---
component: color
layer: ux
type: foundation
version: 1.5.0 # 1.5.0 : R16 cesse de mentir — le mode sombre était déclaré « non couvert » alors que tokens.source.mjs livre un thème sombre complet, activé sur `prefers-color-scheme`, et qu'ELEVATION-UX en légifère déjà le relief. R15 corrigée dans la foulée (« ce système n'a qu'un thème » était faux). Deux manques nommés à la place : la table des paires garanties en sombre, et le passage de theme-gate sur le thème sombre. Arbitrage Aurélien 2026-08-03. 1.4.0 : `CRITERE` posé sur R09 — le contraste texte/fond devient exécutable (2026-07-31). 1.3.0 : 1.3.0 : le registre marque passe à DEUX rôles (primary, secondary) — retrait d'`accent` (focus v2 1.34.0 : l'anneau = cran subtil control.focus-* accordé à la bordure/état ; arbitrage Aurélien 2026-07-29 soir, cf. DECISIONS.md) ; R04/R05/R13 reformulées, R05 gagne le précédent « la règle vaut à la sortie ». 1.2.0 : # 1.2.0 : le composant Link ferme la dette « lien dans le texte » en réutilisant primary/primary-hover et un soulignement ; aucun token ajouté. 1.1.1 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 1.1.0 : passe stress-test 2026-07-17 — quatre règles dérivées ajoutées (contrainte dark mode primary-clair, teinte des neutres à luminance constante, méthode de voile sur image, identités multi-teintes décoratives hors périmètre). Aucun token couleur changé. 1.0.0 : première rédaction — inventaire et benchmark faits AVANT livraison (leçon typographie appliquée) ; audit des tokens existants : aucun manque pour les consommateurs actuels, cf. § Audit
last_updated: 2026-07-20
companion: COLOR-UI.md
confidence: mixed # la structure par rôles, 1.4.1 et les seuils de contraste sont établis ; les positions dark mode / forced-colors sont des décisions internes datées, marquées comme telles
---

# Couleur — Couche UX (fondation)

> Ce fichier contient le raisonnement : rôles, registres, redondance, contraste, theming. Les **valeurs** (hex) vivent dans `DESIGN.md` et n'en bougent pas — cette fondation ne déplace pas la source de vérité, elle documente comment s'en servir. Les mappings par composant vivent dans `COLOR-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [COLOR-R01] : la couleur est une **fondation** — pas de variantes propres, pas d'assemblage : une contrainte transversale que tous les composants consomment. Le modèle à axes ne s'applique pas.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La couleur est une fondation transversale consommée par tous les composants : elle n'a ni variantes ni assemblage, et le modèle à axes ne lui est pas applicable.

RÈGLE [COLOR-R02] : la fondation sépare deux choses qui ne doivent jamais se confondre — c'est la structure de ce fichier :
STATUT : propriété universelle
SOURCE : S3, S4
ÉNONCÉ : Le rôle d'une couleur et sa valeur sont deux décisions distinctes : les composants référencent le rôle, et la valeur vit dans une source unique dont elle peut changer entièrement sans qu'aucune règle d'usage bouge.
MESURE : aucune valeur hexadécimale hors du fichier de valeurs unique
  1. **Le rôle** — à quoi cette couleur sert (porter la marque, porter un état, structurer la page). Une décision de *système*, stable.
  2. **La valeur** — quel hex derrière le rôle. Une décision d'*identité*, qui vit dans DESIGN.md et peut changer entièrement (rebranding) sans qu'aucune règle de ce fichier ne bouge.

> **Pourquoi** : c'est la déclinaison couleur du principe fondateur (niveau ≠ taille chez la typographie) : les systèmes majeurs nomment leurs tokens par usage, jamais par teinte — "on-primary plutôt que on-blue" (Material). Un composant qui référence un rôle survit au rebranding ; un composant qui référence un bleu meurt avec lui.

**Particularité de cadrage** : contrairement aux autres fondations, la moitié de celle-ci existait déjà — éparpillée dans la prose et les guardrails de DESIGN.md (registres, seuils, bordures, recalibrages). Cette fondation la **consolide et la développe** ; DESIGN.md garde les valeurs et les guardrails courts, ce fichier porte le raisonnement long. En cas de divergence, DESIGN.md (valeurs) et ce fichier (règles d'usage) font autorité chacun sur leur moitié.

## Les trois registres

RÈGLE [COLOR-R03] : la palette se lit en **trois registres étanches** :
STATUT : propriété universelle
SOURCE : S7, S5, S3
ÉNONCÉ : La palette se répartit en trois registres étanches — marque, sémantique, neutres — et chaque token appartient à un seul d'entre eux.
MESURE : chaque token couleur est rattaché à exactement un registre
  1. **Marque** — `primary` (l'action) et `secondary` (la seconde voix). Porte l'identité, jamais un état. (Le focus n'est plus un rôle de marque : focus v2 1.34.0 : l'anneau est un cran subtil accordé à la bordure/état (control.focus-*, défaut primary éclairci).)
  2. **Sémantique** — `danger`, `success`, `warning`, `info`, chacun en couple texte/`-subtle`. Porte un état, jamais l'identité.
  3. **Neutres** — textes (`text-*`), surfaces (`background`, `surface*`), bordures (`border*`). Structure la page, ne porte ni identité ni état.

RÈGLE [COLOR-R04] : **aucune couleur ne change de registre selon le contexte.** Jamais `primary` ou `secondary` pour un état sémantique (guardrail fondateur de DESIGN.md) ; jamais `danger` pour "du rouge décoratif" ; l'inverse aussi — le tone info de l'alert a reçu son propre `info` plutôt que d'emprunter la marque, alors que primary et info étaient deux bleus.
STATUT : propriété universelle
SOURCE : S5, S7
ÉNONCÉ : Une couleur ne change jamais de registre selon le contexte : un token de marque ne porte jamais un état, un token sémantique ne sert jamais de décor.
MESURE : aucun token de marque employé pour un tone sémantique, et réciproquement

RÈGLE [COLOR-R05] : **le registre marque tient en deux rôles fonctionnels — `primary`, `secondary` — et pas un de plus par simple envie de décor.** (La règle a été APPLIQUÉE à la sortie autant qu'à l'entrée : `accent`, né en 1.33.0 pour le focus ring, est sorti en 1.34.0 le jour où le focus v2 lui a repris sa mission — un rôle sans consommateur ne reste pas.) Une identité traversée d'une teinte supplémentaire purement décorative (le magenta d'une maquette, sans rôle d'action ni de focus) n'a **pas** de slot, et n'en reçoit pas un : un token naît d'un besoin réel, jamais d'une couleur « à caser » (ce serait la porte ouverte au « primary partout » que le système s'interdit). **Position (1.1.0) : les identités multi-teintes décoratives sortent du périmètre.** Le jour où une teinte de marque supplémentaire porte un vrai rôle fonctionnel récurrent, elle entrera comme rôle nommé (avec son couple on-*), pas comme aplat libre.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le registre marque se limite aux rôles fonctionnels existants : une teinte purement décorative ne reçoit pas de token.
MESURE : tout token de marque est référencé par au moins un rôle fonctionnel documenté

CONFIANCE : décision interne datée (2026-07-17) — cohérente avec « un token naît d'un besoin réel » et l'interdit du décor par token de marque.

> **Pourquoi** : un utilisateur apprend le vocabulaire chromatique du produit en quelques écrans. Un bleu qui signifie tantôt "action de marque" tantôt "information" détruit cet apprentissage — c'est la même inflation que le primary partout (BUTTON-UX) : si une couleur dit deux choses, elle ne dit plus rien.

RÈGLE [COLOR-R06] : chaque registre a son niveau d'expression — les sémantiques existent en **couple** texte/fond subtil (`danger`/`danger-subtle`), les neutres en **échelle** (primary > secondary > muted pour le texte). Toute nouvelle valeur sémantique fournit son couple complet d'emblée (règle héritée de BUTTON-UI : `_bg`/`_text`/`_fg` dès la création).
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Chaque registre a son niveau d'expression — les couleurs sémantiques existent en couple texte/fond subtil, les neutres en échelle — et toute nouvelle valeur sémantique fournit son couple complet dès sa création.
MESURE : tout token sémantique possède son couple texte/fond dès son introduction

## Jamais la couleur seule

RÈGLE [COLOR-R07] : l'information ne repose **jamais sur la couleur seule** — WCAG 1.4.1, la règle d'accessibilité cardinale de cette fondation.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Aucune information ne repose sur la couleur seule.
MESURE : aucune information portée par la couleur seule

RÈGLE [COLOR-R08] : chaque usage sémantique de la couleur déclare son **canal redondant** : l'icône par tone de l'alert (silhouettes distinctes), le mot "Erreur" de l'input, la coche de l'état sélectionné de la card. Le canal redondant ne se retire pas pour alléger.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Chaque usage sémantique de la couleur déclare un canal redondant non chromatique — icône, mot ou forme — qui ne peut être retiré pour alléger.
MESURE : chaque tone sémantique porte au moins un signal non chromatique déclaré

> **Pourquoi** : ~8 % des hommes ont une déficience rouge-vert — et `warning` (ambre profond) et `danger` (rouge sombre) de cette palette sont chromatiquement proches (distance RGB 55, cas documenté par le F03 du RAPPORT-TEST). La forme fait le travail que la couleur ne peut pas garantir.
> **Erreur fréquente** : croire qu'un contraste suffisant règle le problème — le contraste rend le texte *lisible*, il ne distingue pas un rouge d'un vert pour qui ne voit pas la différence. Contraste et redondance sont deux exigences indépendantes (1.4.3 vs 1.4.1).

## Contraste — les seuils que le système s'impose

RÈGLE [COLOR-R09] : **4.5:1** pour le texte courant (WCAG 1.4.3), **3:1** pour tout état visible et composant d'interface (WCAG 1.4.11) — seuils déjà inscrits dans DESIGN.md, appliqués par quatre recalibrages successifs (accent, danger, warning, border-strong en 1.3.0 ; success en 1.4.0), vérifiés par `tools/test-rendu.js` à chaque régénération.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Le texte courant atteint 4,5:1 avec son fond, et tout composant d'interface ou état requis pour l'identifier atteint 3:1 avec les couleurs adjacentes.
MESURE : contraste texte / fond ≥ 4,5:1 ; contraste composant ou état / fond ≥ 3:1
CRITERE : chaque("body *") contraste(color) >= 4.5
          ou mesure(font-size) >= 24 et contraste(color) >= 3
          ou mesure(font-size) >= 18.66 et mesure(font-weight) >= 700 et contraste(color) >= 3

> **Portée du critère** : il n'automatise que la **première** clause (texte / fond). La seconde —
> « composant ou état requis pour l'identifier » — suppose de savoir ce qui *identifie* un contrôle,
> jugement que `BORDER-U09` déclare explicitement non décidable par un script. R09 est donc
> **partiellement automatisée**, et le rapport ne prétend pas au reste.

RÈGLE [COLOR-R10] : le contraste se vérifie **par paire** — un token de texte n'est pas "conforme" dans l'absolu, il l'est *sur un fond donné*. Chaque token de texte de ce système déclare ses fonds d'usage (le mapping vit dans COLOR-UI.md).
STATUT : propriété universelle
SOURCE : S2, S8
ÉNONCÉ : La conformité au contraste s'établit par paire et non par token isolé : chaque couleur de texte déclare les fonds sur lesquels elle est vérifiée.
MESURE : chaque token de texte déclare la liste des fonds vérifiés ; tout fond non déclaré est interdit

> **Erreur fréquente** : poser un token de texte conforme sur blanc sur un fond subtil sans revérifier — c'est exactement l'histoire de `success` (5.02:1 sur blanc, mais il a fallu le recalibrer pour tenir 4.57:1 sur `success-subtle`).

RÈGLE [COLOR-R11] : nuance sourcée — WCAG 1.4.11 **exempte le hover** ("l'état hover n'est pas requis pour identifier le composant") ; ce système teste quand même ses couples au hover, par choix : un hover illisible reste un hover raté, même conforme.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Les couples texte/fond des états de survol sont vérifiés au même seuil que l'état de repos, bien que la norme en exempte le survol.
MESURE : contraste texte / fond ≥ 4,5:1 également à l'état hover

CONFIANCE : établi (seuils WCAG) ; le sur-test du hover est une exigence interne, pas une obligation normative.

RÈGLE [COLOR-R12] : `text-muted` (2.54:1 sur blanc) est **réservé aux métadonnées accessoires** — jamais du texte fonctionnel courant. Précédent journalisé : le compteur de caractères de l'input a dû quitter text-muted (F01).
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Le token de texte le plus faible est réservé aux métadonnées accessoires et n'est jamais employé pour du texte fonctionnel.
MESURE : aucun texte fonctionnel ne consomme un token de texte sous 4,5:1

## États interactifs

RÈGLE [COLOR-R13] : les états interactifs sont **tokenisés, pas improvisés** : famille `*-hover` (fond assombri d'un cran pour les fonds pleins, `surface-hover` apparaissant pour les styles sans fond au repos, stroke et ghost), `accent` pour le focus ring — mapping par composant dans les `*-UI.md`.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Les états interactifs sont portés par des tokens dédiés et jamais calculés à la volée dans les composants.
MESURE : aucune couleur d'état produite hors token (ni filtre, ni assombrissement calculé en feuille de style)

RÈGLE [COLOR-R14] : l'état **disabled n'a pas de tokens** — dette assumée, désormais documentée *ici* plutôt qu'en marge de BUTTON-UI : WCAG exempte les composants inactifs du contraste minimum (exception explicite de 1.4.3), et aucun consommateur n'a encore de vrai besoin (FORM-UX a même retiré le disabled de la validation). Conditions de sortie de la dette : le jour où un composant documente un état désactivé légitime (traitement asynchrone), créer le couple complet (fond, texte, bordure) en une fois.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : L'état désactivé n'a pas de tokens dédiés tant qu'aucun composant ne documente un état désactivé légitime ; le jour venu, le couple complet fond/texte/bordure est créé en une seule fois.
MESURE : aucun token disabled dans la table de valeurs

## Theming et rebranding — ce que l'architecture par rôles achète

RÈGLE [COLOR-R15] : un token = potentiellement N valeurs (une par thème) — c'est la mécanique standard des systèmes à thèmes (Atlassian, Carbon : "impossible d'implémenter un dark mode sans tokens partout"). **Ce système a DEUX thèmes** : clair (défaut) et sombre, tous deux résolus dans `packages/tokens/src/tokens.source.mjs`.
STATUT : propriété universelle
SOURCE : S6, S11
ÉNONCÉ : Dans un système à thèmes, un token de couleur résout une valeur par thème : l'architecture par tokens est la condition d'existence d'un second thème.
MESURE : chaque token couleur résout une valeur pour chaque thème déclaré

RÈGLE [COLOR-R16] : **le mode sombre EST couvert — il est livré et il s'active tout seul.** `tokens.source.mjs` résout une valeur sombre pour chaque rôle, exposée en `[data-theme="dark"]` **et** sous `@media (prefers-color-scheme: dark)` : un utilisateur dont le système est en sombre obtient le thème sombre sans que le produit ait rien demandé. Comme prévu, les rôles n'ont pas bougé — c'est la table de valeurs qui a doublé. Ce qui reste vrai de l'ancienne rédaction : les seuils se re-vérifient intégralement par thème (`theme-gate` / `validate-contrast`), et le relief se repense (ELEVATION-UX pose déjà les directions du sombre : l'enfoncé dérive vers le noir, jamais via le token de survol).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le mode sombre est couvert : chaque rôle résout une valeur par thème, le thème sombre s'active sur préférence système, et les seuils de contraste sont vérifiés thème par thème.
MESURE : chaque rôle couleur résout une valeur en clair et en sombre ; les paires garanties passent leurs seuils dans les deux thèmes

> **Pourquoi cette réécriture (arbitrage Aurélien 2026-08-03)** : jusqu'à cette version, cette règle disait « non couvert — par décision, pas par oubli » pendant que la distribution livrait un thème sombre complet (~45 rôles) et qu'ELEVATION-UX en légiférait le relief en détail. Trois états d'un même sujet dans trois fichiers : un agent qui lisait COLOR s'arrêtait (STOP, remonter), un agent qui lisait ELEVATION construisait, et le CSS basculait de lui-même. La doctrine était le seul des trois à mentir : c'est elle qui a bougé. **Reste à écrire** — la table des paires garanties en sombre, section par section, et le passage de `theme-gate` sur le thème sombre (il ne teste aujourd'hui que le fichier qu'on lui donne).

RÈGLE [COLOR-R17] : `surface-contrast` n'est **pas** un début de dark mode — c'est un panneau de mise en avant sur page claire (cf. DESIGN.md 1.7.0). Ne pas généraliser son usage en "thème sombre local".
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La surface sombre de mise en avant est un panneau local sur page claire et ne constitue pas l'amorce d'un thème sombre ; son usage ne se généralise pas.

RÈGLE [COLOR-R18] : **contrainte dérivée (dark mode) — un thème sombre ne peut pas avoir un primary sombre.** Les deux seuls textes admis sur `surface-contrast` sont `background` et `on-primary` (paires garanties). Pour qu'un même fond les porte tous deux à 4.5:1, ils doivent tomber du même côté de l'échelle de luminance. En thème clair c'est trivial (les deux valent ~blanc). En thème sombre, `background` devient sombre → `on-primary` doit l'être aussi → **`primary` doit être clair** (un `on-primary` sombre suppose un fond d'action clair). Corollaire démontré : avec un primary sombre, aucun neutre représentable ne tient 4.5:1 à la fois avec un fond quasi-noir et avec le blanc — la fenêtre théorique fait ~8 % d'un cran 8-bit (le meilleur compromis plafonne à 4.50:1 des deux côtés). `surface-contrast` devient alors un panneau *clair* de mise en avant. La table des paires (COLOR-UI) n'est « prête pour N thèmes » qu'assortie de cette règle dérivée — sinon chaque consommateur la redécouvre par l'échec.
STATUT : propriété universelle
SOURCE : S2, S8
ÉNONCÉ : Deux textes garantis sur un même fond ne peuvent tous deux atteindre 4,5:1 que s'ils tombent du même côté de l'échelle de luminance.
MESURE : contraste ≥ 4,5:1 vérifié simultanément pour les deux textes garantis sur un même fond

CONFIANCE : contrainte dérivée, démontrée par calcul WCAG (rapport stress-test 2026-07-17) — établie, pas une préférence.

CONFIANCE : décision interne datée (2026-07-11) — à réviser si le produit exige un thème sombre.

## Teinte des neutres — méthode bénie (1.1.0)

RÈGLE [COLOR-R19] : une identité peut vouloir des neutres **teintés** (gris chauds, gris bleutés) accordés à sa marque plutôt que des gris purs. Le système bénit une méthode sûre : **teinter un neutre à luminance WCAG constante**. Le contraste ne dépendant que de la luminance relative, déplacer uniquement la teinte (et la saturation) en gardant la luminance identique ne change **aucun** rapport de contraste — l'opération est gratuite côté accessibilité, et la barrière reste verte par construction.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Le rapport de contraste ne dépendant que de la luminance relative, teinter un neutre en conservant sa luminance ne modifie aucun rapport de contraste et reste sûr par construction.
MESURE : rapport de contraste identique avant et après teinte, à luminance relative inchangée

RÈGLE [COLOR-R20] : mise en œuvre — convertir en OKLCh, fixer L, poser la teinte cible (reprise d'une couleur du thème : surface, accent), puis **recaler L par dichotomie** jusqu'à retrouver la luminance WCAG d'origine (l'aller-retour d'espace introduit une dérive infime, à corriger). C'est une transformation des **valeurs** dans DESIGN.md — aucun nom, aucune règle ne bouge. Vérifiée sur le stress-test 2026-07-17 : les trois thèmes restent conformes après teinte.
STATUT : implémentation de référence
SOURCE : S13, S8
ÉNONCÉ : Le teintage d'un neutre s'opère en espace OKLCh — lightness figée, teinte cible posée — puis la luminance relative d'origine est recalée par dichotomie pour absorber la dérive de conversion.
MESURE : luminance relative recalculée identique à l'originale après conversion aller-retour

CONFIANCE : établi — le contraste WCAG est fonction de la seule luminance relative ; l'invariance est mathématique, pas empirique.

## Contraste élevé forcé (forced-colors)

RÈGLE [COLOR-R21] : quand l'OS force ses couleurs (mode contraste élevé Windows), les tokens sont **remplacés d'office** — fonds subtils aplatis, la palette disparaît. Règle minimale de ce système : ne jamais neutraliser ce mode (`forced-color-adjust: none` interdit par défaut), et s'appuyer sur ce qui **survit** — la sémantique HTML, les bordures, le texte. C'est une raison de plus pour les canaux redondants : l'icône et le mot restent quand la couleur tombe.
STATUT : propriété universelle
SOURCE : S9, S10
ÉNONCÉ : En mode de couleurs forcées par le système, la palette est remplacée d'office et les fonds et ombres disparaissent : ce mode n'est jamais neutralisé, et l'interface s'appuie sur ce qui survit — sémantique, bordures, texte.
MESURE : aucune déclaration forced-color-adjust: none hors correctif d'accessibilité justifié

CONFIANCE : convergence (comportement plateforme documenté) ; la règle d'interdiction est une décision interne.

## Texte sur media

RÈGLE [COLOR-R22] : règle-frontière, aucun consommateur à ce jour (la card interdit le texte dans le media) : du texte posé sur une image **imprévisible** ne peut garantir aucun contraste. Deux issues admises le jour venu : un voile de contraste entre l'image et le texte, ou le texte hors du media. Jamais de texte nu sur image libre.
STATUT : propriété universelle
SOURCE : S12, S2
ÉNONCÉ : Du texte posé sur une image imprévisible ne garantit aucun contraste : il est soit adossé à un voile de contraste, soit sorti du média, jamais laissé nu.
MESURE : contraste texte / pixel de fond le plus défavorable ≥ 4,5:1

RÈGLE [COLOR-R23] : **le voile n'est pas un effet, c'est un calcul (méthode bénie, 1.1.0).** L'obligation « voile de contraste » ne se règle pas à l'œil (trop de voile tue l'image, trop peu casse le texte à certains formats seulement). Méthode : (1) échantillonner le **pire pixel** derrière chaque zone de texte (canvas) ; (2) calculer l'alpha de voile minimal pour que le texte tienne 4.5:1 sur ce pixel ; (3) **revérifier à plusieurs formats de viewport** — le cadrage (`background-position`, recadrage responsive) déplace le pire pixel et peut faire passer le voile requis du simple au double. Le cadrage, pas le voile, est souvent le vrai problème : un viewport court peut recadrer une crête claire pile derrière le titre.
STATUT : implémentation de référence
SOURCE : S12, S2
ÉNONCÉ : Le voile de contraste se calcule et ne s'ajuste pas à l'œil : le pixel le plus défavorable est échantillonné derrière chaque zone de texte, l'opacité minimale nécessaire est calculée pour atteindre 4,5:1, et le résultat est revérifié à plusieurs formats de viewport.
MESURE : opacité du voile calculée sur le pixel le plus défavorable et revérifiée à chaque point de rupture

CONFIANCE : décision interne datée (2026-07-17, stress-test) ; le calcul d'alpha découle directement du seuil WCAG 1.4.3.

## Audit des tokens existants (2026-07-11)

Réponse à la question "il en manque ou pas" : **pour les consommateurs actuels, il n'en manque pas.** Les 23 tokens couleur couvrent les 9 combinaisons du bouton, les 4 tones × (bordure, texte, fond) de l'input et de l'alert, les surfaces de la card, le Link et les états hover/focus — vérifié par la résolution complète de `test-rendu.js`. Le Link ferme la dette « lien dans le texte » sans créer de token : `color.primary` et `color.primary-hover` portent la marque, tandis que le soulignement garantit que la couleur n'est pas le seul signal. Les manques restants sont des **contextes sans consommateur** : scrim de superposition, ::selection et dataviz ; disabled et dark mode restent des décisions explicites. Conformément au principe "un token naît d'un besoin réel", ils ne sont pas provisionnés.

## Risque

RÈGLE [COLOR-R24] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La fondation tient une table des risques associant chaque cas de mauvais usage de la couleur à son risque principal et à sa sévérité.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Information portée par la couleur seule | Exclusion daltonisme — danger/success indistinguables (WCAG 1.4.1) | Critique |
| Texte courant sous 4.5:1 | Illisible pour basse vision (WCAG 1.4.3) | Critique |
| État visible / bordure délimitante sous 3:1 | Composant invisible (WCAG 1.4.11) — cas border-strong vécu | Élevée |
| Marque utilisée en sémantique (ou l'inverse) | Vocabulaire chromatique incohérent, apprentissage détruit | Élevée |
| Valeur hex hors DESIGN.md | Rebranding impossible, dérive de palette | Élevée |
| Token de texte posé sur un fond non déclaré | Contraste non garanti (cas success avant recalibrage) | Moyenne à élevée |
| text-muted sur du texte fonctionnel | Métadonnée illisible promue au rang d'information (cas F01) | Moyenne |
| forced-colors neutralisé | Mode d'accessibilité système cassé | Moyenne |
| Texte nu sur image | Contraste imprévisible | Moyenne |

## Règle transversale

RÈGLE [COLOR-R25] : **la couleur s'applique par rôle, jamais par valeur — et un rôle ne porte jamais deux sens.**
STATUT : propriété universelle
SOURCE : S3, S5, S7
ÉNONCÉ : La couleur s'applique par rôle et jamais par valeur, et un rôle ne porte jamais deux sens.
MESURE : aucune valeur hexadécimale hors du fichier de valeurs unique ; un rôle correspond à un sens unique

> **Pourquoi** : c'est la déclinaison couleur du principe du système : comme le niveau d'un titre ne dit rien de sa taille, la teinte d'une couleur ne dit rien de son rôle. Chaque fois qu'une valeur est choisie "parce qu'elle est jolie ici", c'est le signe qu'un rôle manque ou qu'un registre fuit.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Jamais la couleur seule comme signal | [WCAG 2.1 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html) ; repris tel quel par [Polaris](https://polaris.shopify.com/design/colors) | Établi, standard d'accessibilité |
| S2 | Seuils 4.5:1 texte / 3:1 non-texte, y compris les états ; exemption du hover ; exemption des composants inactifs | [WCAG — 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) et [1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | Établi |
| S3 | Tokens de rôle plutôt que valeurs ("on-primary rather than on-blue") | [Material 3 — color roles](https://developer.android.com/design/ui/mobile/guides/styles/color), [Atlassian — color foundations](https://atlassian.design/foundations/color), [Carbon — color usage](https://carbondesignsystem.com/elements/color/usage/), [GOV.UK — colour](https://design-system.service.gov.uk/styles/colour/) (couleurs fonctionnelles) | Établi — convergence des quatre systèmes |
| S4 | Interdiction outillée des hex en dur | [Polaris — stylelint color-no-hex](https://polaris.shopify.com/tools/stylelint-polaris/rules/color-color-no-hex), [GOV.UK brand](https://brand.design-system.service.gov.uk/colour/web/) ("do not copy the hex values") | Établi — deux systèmes l'imposent par l'outil, comme valide-dossier.js ici |
| S5 | Sémantique ≠ accent, chaque couleur un sens fixe | [Atlassian](https://atlassian.design/foundations/color) ("don't use an accent when the color has semantic meaning"), [Polaris](https://polaris.shopify.com/design/colors) (rouge=critique, vert=succès, fond neutre) | Établi par convergence |
| S6 | Un token = N valeurs par thème ; pas de dark mode sans tokens partout | [Atlassian](https://atlassian.design/foundations/color), [Carbon — themes](https://carbondesignsystem.com/elements/themes/overview/) | Établi chez les systèmes à thèmes ; l'absence de thème sombre ici est une décision interne |
| S7 | Registres étanches marque/sémantique/neutres | Structure convergente (Atlassian brand/semantic/neutral/accent, Polaris sens fixes sur fond neutre) + guardrail interne préexistant | Établi par convergence, formalisation propre à ce système |
| S8 | Le rapport de contraste vaut (L1 + 0,05) / (L2 + 0,05) où L1 et L2 sont les luminances relatives : il ne dépend que de la luminance, ni de la teinte ni de la saturation prises isolément | [WCAG 2.2 — définitions « contrast ratio » et « relative luminance »](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio) | Établi, définition normative — fonde R10, R18, R19 et R20, qui s'appuyaient dessus sans la citer |
| S9 | En mode de couleurs forcées, l'agent utilisateur impose ses couleurs système : box-shadow et text-shadow forcés à none, background-image non-url à none, couleurs d'auteur ignorées — les fonds subtils sont aplatis, les traits et le texte survivent | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi, comportement plateforme documenté |
| S10 | forced-color-adjust: none ne doit servir qu'à améliorer l'expérience en contraste forcé, jamais à empêcher le respect des choix de l'utilisateur | [MDN — forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust) | Établi — transforme l'interdiction de R21, donnée comme décision interne, en application d'une recommandation documentée |
| S11 | Le système d'exploitation expose une préférence de thème clair/sombre que la page peut lire (prefers-color-scheme) et à laquelle elle déclare les schémas qu'elle sait rendre (color-scheme) | [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) ; [MDN — color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) | Établi, mécanisme plateforme — le non-support du thème sombre reste une décision interne |
| S12 | Sur fond non uniforme, le contraste se mesure contre les pixels immédiatement derrière chaque lettre ; la technique admise consiste à assombrir, ombrer ou poser un voile localisé pour maintenir 4,5:1 | [WCAG — Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18) | Établi, technique référencée — fonde R22 et R23, jusque-là données comme décisions internes |
| S13 | oklch() spécifie une couleur par lightness perceptuelle, chroma et teinte dans un espace indépendant du périphérique — l'espace de travail du teintage à luminance constante | [CSS Color Module Level 4 — oklch()](https://www.w3.org/TR/css-color-4/) | Établi, spécification W3C |
| S14 | **Contradiction relevée le 2026-07-27.** WCAG 1.4.3 ne connaît que trois exceptions au seuil de 4,5:1 — grand texte, logotype, texte « incidental » (décoration pure, composant inactif, invisible, ou inclus dans une image porteuse d'autre contenu). Aucune ne couvre les métadonnées accessoires : un token de texte sous 4,5:1 employé sur des métadonnées visibles et informatives est non conforme, pas un parti pris | [WCAG 2.2 — 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Établi, standard (AA) — **contredit R12**, laissée en parti pris dans l'attente d'un arbitrage |

*Toute règle sans source explicite repose sur un précédent interne journalisé (DECISIONS.md : recalibrages 1.3.0/1.4.0, F01, F02, F03) — c'est la fondation du système la plus adossée à des cas vécus.*

## À approfondir

- **Lien dans le texte courant — résolu par Link (2026-07-20)** : `color.primary` au repos, `color.primary-hover` au survol et soulignement persistant dans le texte courant. Le composant Link porte désormais l'autorité ; aucun token dédié n'est nécessaire.
- **Scrim / voile de superposition** : naîtra avec la modale, en même temps que le vrai consommateur d'`elevation.overlay`.
- **::selection et couleur de surlignage** : aucun consommateur ; défaut navigateur acceptable en attendant.
- **Dark mode — couvert et livré (2026-08-03)** ; ce qui reste ouvert : la table des paires garanties **en sombre** (COLOR-UI ne la décline pas encore) et le passage de `theme-gate` sur le thème sombre.
- **Dataviz** : palette catégorielle, échelles séquentielles — hors périmètre produit à ce jour.
- **Sémantique multi-produits** : si la charte est adoptée ailleurs, vérifier que les registres tiennent (un rouge "solde négatif" n'est pas un rouge "danger").
