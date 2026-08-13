# Inventaire des cas d'usage — Couleur (fondation)

> Miroir des inventaires de composants, adapté à une fondation (précédent : typographie) : on inventorie les *usages de la couleur* chez les consommateurs, pas les variantes d'un atome. Sert de checklist au test de couverture de COLOR-UX.md. Les valeurs réelles vivent dans DESIGN.md, qui reste la seule source de vérité — cette fondation documente les *rôles* et les *règles d'usage*.

---

## 1. Par rôle de couleur

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Action de marque (primary) | Fond des actions principales, bordure de sélection | Couvert — rôle documenté, guardrail "jamais pour un état sémantique" |
| Focus (anneau) | Focus ring partagé par bouton/input/card | Couvert — rôles `control.focus-*` depuis le focus v2 (2026-07-29) ; l'ancienne teinte de marque `accent` est sortie (DESIGN 1.34.0) |
| États sémantiques (danger/success/warning/info) | Tones de l'alert, bordures de l'input, tones du bouton | Couvert — familles texte + fond subtil, seuils testés |
| Neutres de texte (primary/secondary/muted) | Hiérarchie du texte courant | Couvert — avec la frontière text-muted (métadonnées, jamais du texte fonctionnel — cf. F01 compteur) |
| Surfaces (background/surface/surface-hover/surface-contrast) | Fonds de page, de zone, de state layer, de mise en avant | Couvert — rôle de chaque surface documenté |
| Bordures (border/border-strong) | Séparation décorative vs délimitation | Couvert — guardrail délimitante/décorative (1.4.1 du journal) |
| Couleur désactivée (disabled) | Bouton/input désactivés | **Non couvert actuellement** — dette assumée dans BUTTON-UI ("tant qu'un besoin réel ne l'a pas fait émerger") ; la fondation en hérite et le signale |
| Lien dans le texte courant | Couleur de lien, état visité | **Couvert par Link** — primary/primary-hover, soulignement et état visité selon le contexte |
| Scrim / voile de superposition | Fond assombri derrière une modale | **Non couvert actuellement** — provisionné le jour où un composant superposé naît (avec elevation.overlay) |
| Couleur de sélection (texte surligné, item sélectionné) | ::selection, item de liste actif | **Non couvert actuellement** — aucun consommateur ne l'a demandé ; card selected utilise primary (couvert) |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton (16 combinaisons style × tone) | Fonds pleins, textes, bordures, hovers | Couvert — mapping dans BUTTON-UI, contrastes testés (repos + hover) |
| Input (4 tones de bordure) | Bordure délimitante, messages | Couvert |
| Alert (4 tones en couple texte/fond) | Premier composant à exiger les couples complets | Couvert |
| Card (fond vs zone de collection) | Distinction background/surface (1.10:1, volontairement subtile) | Couvert |
| Panneau sombre (surface-contrast) | Mise en avant type console/dashboard | Couvert — texte dessus : background/on-primary uniquement, hors text-muted |
| Texte sur photo/media | Texte posé sur une image imprévisible | **Non couvert actuellement** — aucun consommateur (la card interdit le texte dans le media) ; à couvrir si un hero avec image naît |
| Dataviz / graphiques | Palette catégorielle, échelles | **Non couvert actuellement** — hors périmètre produit à ce jour, signalé |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Hover (state layers) | Fond assombri d'un cran ou remplissage apparaissant | Couvert — famille *-hover complète depuis 1.3.0 |
| Focus | Ring `control.focus-*`, jamais supprimé | Couvert |
| Transition entre états | Le passage repos → hover → focus est-il instantané ? | Couvert par renvoi — la fondation motion fait autorité sur les transitions ; la couleur fournit les deux bornes |
| Selected | Bordure primary + indicateur non chromatique | Couvert (card) |
| Chargement / skeleton | Fond surface en attente de contenu | Couvert (card skeleton) |

## 4. Par plateforme / environnement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Écran standard sRGB | Cas de référence des valeurs hex | Couvert |
| Mode sombre (dark mode) | Inversion des surfaces et du texte | **Non couvert actuellement** — décision produit non prise ; l'architecture par rôles le permet (c'est le rebranding-test), signalé en "À approfondir" |
| Contraste élevé forcé (forced-colors / high contrast) | L'OS remplace les couleurs des tokens | **Non couvert actuellement** — déjà signalé par l'inventaire typographie, concerne d'abord les bordures et le focus |
| Daltonisme (deutéranopie/protanopie) | Couleur seule insuffisante | Couvert — WCAG 1.4.1 appliqué partout (icônes par tone, mot "Erreur", coche de sélection) |
| Impression | Couleurs sur blanc, encre | **Non couvert actuellement** — probablement hors périmètre, même statut que pour la typographie |

## 5. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Information portée par la couleur seule | Exclusion daltonisme (1.4.1) | Couvert — canal redondant systématique |
| Contraste texte insuffisant | Échec 1.4.3 (4.5:1) | Couvert — seuils auto-imposés, testés par test-rendu.js |
| Contraste non textuel insuffisant | Échec 1.4.11 (3:1 : bordures, focus, états) | Couvert |
| Marque utilisée comme sémantique | Un "bouton bleu de succès" — confusion des registres | Couvert — guardrail fondateur |
| Valeur brute hors DESIGN.md | Dérive de palette, rebranding impossible | Couvert — guardrail + valide-dossier.js |
| Multiplication des tokens de même valeur | Deux noms pour un même rôle (cas card-padding évité) | Couvert — précédent 1.7.0 documenté |
| Sémantique divergente entre produits (rouge = danger vs solde négatif) | Registre culturel/métier | **Non couvert actuellement** — un seul produit à ce jour ; à traiter si la charte est adoptée ailleurs |

---

## Bilan du test de couverture

Sur **31 cas recensés**, **9 étaient non couverts après la première rédaction** de COLOR-UX.md — ratio conforme à la série (8/33, 11/30, 9/41, 8/39, 10/33).

**Comblés en 1.0.0 (avant livraison, marqués dans COLOR-UX.md)** : disabled (règle posée : dette assumée *documentée* + conditions de sortie), mode sombre (position explicite : non couvert par décision, architecture par rôles prête), contraste élevé forcé (règle minimale : ne jamais neutraliser `forced-colors`, s'appuyer sur les vrais éléments sémantiques), texte sur media (règle-frontière : voile obligatoire ou texte hors du media).

**Comblé depuis l'inventaire initial** : le lien dans le texte possède désormais son composant Link, sa frontière avec Button et son canal redondant par soulignement ; il réutilise les tokens de marque existants.

**Restent non couverts, par ordre de priorité suggérée** : scrim de superposition (naîtra avec la modale, comme elevation.overlay), couleur de sélection ::selection, dataviz, sémantique multi-produits, impression. Aucun n'est critique en risque immédiat, tous sont signalés.

**Ce que ce test ajoute sur la méthode** : le biais "état transitoire" a été traité d'office (section transitions → renvoi vers la fondation motion) ; les trous restants sont tous des cas *sans consommateur actuel* — sur une fondation, le trou type n'est pas l'état oublié mais le **contexte pas encore né** (dark mode, modale, dataviz). À vérifier sur les fondations suivantes.
