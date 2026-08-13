# Inventaire des cas d'usage — Touch / entrée tactile (fondation)

> Inventaire des situations où le **doigt** (ou un pointeur grossier) agit sur l'interface. Sert de checklist au test de couverture de `TOUCH-UX.md`. Particularité : cette fondation ne porte pas une forme mais une **contrainte de taille et d'atteinte** — la cible doit être assez grande et assez isolée pour être touchée sans erreur. Le trou spécifique à chercher : la cible visuellement petite mais dont la *zone tactile* doit rester grande (l'icône n'est pas la cible).

---

## 1. Par type de pointeur

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Pointeur fin (souris, trackpad) | Curseur précis, hover disponible | Couvert — la cible peut être dense ; `touch.target-min` reste le plancher, le confort vient du hover |
| Pointeur grossier (doigt) | Contact ~9 mm, pas de hover fiable | Couvert — la cible vise `touch.target-comfortable`, jamais sous `touch.target-min` ; aucune fonction cachée derrière le survol |
| Stylet | Précis mais sans hover garanti | Couvert — traité comme un pointeur fin pour la précision, comme un pointeur grossier pour le hover |
| Pointeur variable / hybride | Écran tactile + souris sur la même page | Couvert — on dimensionne pour le **moins précis** des pointeurs possibles, jamais pour la souris seule |
| Pointeur assistif (tête, contacteur, oculaire) | Visée lente, coûteuse | Couvert — la marge de `touch.target-comfortable` et l'espacement réduisent le coût de visée (loi de Fitts) |

## 2. Par taille et espacement de la cible

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Cible confortable | Bouton, onglet, ligne d'action | Couvert — vise `touch.target-comfortable` (44) ; c'est la valeur par défaut d'une cible principale au doigt |
| Plancher absolu | Cible dense justifiée | Couvert — jamais sous `touch.target-min` (24, WCAG 2.5.8 AA) ; en dessous, le build s'arrête et remonte |
| Espacement entre cibles | Cibles adjacentes | Couvert — au moins `touch.target-spacing` entre deux zones tactiles ; deux petites cibles collées valent une cible ratée |
| Zone tactile > icône | Icône 16–20 dessinée petite | Couvert — la **cible** (zone cliquable/tapable) atteint le confort par le padding ; l'icône reste petite, la cible non |
| Exception en ligne | Lien dans un paragraphe | Couvert — une cible dans le fil du texte est exemptée du plancher (WCAG 2.5.8 « inline ») ; ne pas gonfler la ligne |
| Exception essentielle | Point d'une carte, poignée précise | Couvert — quand la petitesse est *intrinsèque* à la fonction (essentiel), documentée et remontée, pas improvisée |

## 3. Par zone d'atteinte

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Zone du pouce | Bas et centre de l'écran, à une main | Couvert — les actions primaires fréquentes visent la zone atteignable ; le haut d'écran coûte un repositionnement |
| Haut d'écran / coins | En-tête, fermeture, retour | Couvert — réservé aux actions peu fréquentes ; jamais l'action primaire répétée d'un parcours au doigt |
| Bord et geste système | Zone de swipe OS, encoche, barre | Couvert — on n'y place pas de cible tapable qui entre en conflit avec un geste système (frontière avec `gesture`) |
| Cible plein-largeur | Bouton primaire mobile | Couvert — sous `breakpoint.mobile`, l'action primaire s'étire (déjà posé par button/grid) : plus facile à viser |

## 4. Par état et retour tactile

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Appui (press) | Retour immédiat au contact | Couvert — le `press` remplace le hover comme signal d'affordance au doigt (frontière avec `interaction`/`motion`) |
| Absence de hover | `(hover: none)` | Couvert — aucune information ni action derrière le seul survol ; la règle vit ici et chez `interaction` |
| Annulation du pointeur | Doigt relâché hors de la cible | Couvert — l'action se déclenche au relâchement *sur* la cible ; glisser hors avant de lever annule (WCAG 2.5.2) |
| Retour haptique | Vibration à la confirmation | Couvert — supplément facultatif, jamais le seul canal ; désactivable, absent sur beaucoup d'appareils |
| Cible « morte » au repos | Rien ne bouge avant le contact | Couvert — la présence de la cible ne dépend pas d'un survol qui n'arrive jamais au doigt |

## 5. Par accessibilité et robustesse

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Zoom et agrandissement | 200 %, loupe système | Couvert — la cible reste tapable au zoom ; les tailles en `rem`/tokens, jamais figées en px absolu qui ne suit pas |
| Dextérité réduite | Tremblements, visée imprécise | Couvert — `touch.target-comfortable` + espacement : la marge de sécurité EST l'accessibilité motrice |
| Équivalent clavier | Toute cible tactile | Couvert — une cible n'existe jamais *que* pour le doigt ; clavier et focus obligatoires (renvoi au principe accessibilité) |
| Cible vs libellé accessible | Icône seule tapable | Couvert — la grande zone tactile garde un nom accessible ; la taille ne remplace pas le libellé |
| Densité assumée | Tableau, barre d'outils dense | Couvert — la densité peut descendre à `touch.target-min` **avec** espacement ; jamais sous le plancher, jamais sans marge |

---

## Bilan du test de couverture

Sur **24 cas recensés**, **2 étaient non couverts** à la première rédaction de `TOUCH-UX.md` : l'**exception essentielle** (une cible légitimement petite parce que sa petitesse fait partie de la fonction — distincte de l'exception « inline » déjà connue) et le **pointeur variable** (une même page servie au doigt ET à la souris — on dimensionne pour le moins précis). Les deux comblés avant livraison.

**Reste non couvert** : rien au-delà des surfaces natives à naître — le **retour haptique** n'est documenté ici que comme canal *voisin*, supplément jamais indispensable ; son vocabulaire propre attend une vraie surface native (déjà signalé par `MOTION-UX.md` et `BUTTON-UX.md`).

**Note de méthode** : la fondation touch capitalise sur l'existant — `scale.desktop-min` référençait déjà « le pendant desktop du 44px tactile » sans jamais tokeniser le 44 tactile lui-même. L'inventaire a surtout servi à débusquer les **déductions silencieuses** (taille de cible jamais nommée) plus qu'à cartographier des situations neuves.
