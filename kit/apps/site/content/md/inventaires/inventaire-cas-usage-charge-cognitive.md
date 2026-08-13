# Inventaire des cas d'usage — charge cognitive (audit transversal)

> **Inventaire transversal** (deuxième du genre, après l'accessibilité) : il audite une contrainte qui traverse plusieurs propriétaires, cartographie couvert / partiel / absent, et **ne devient pas une source normative de substitution**. Un trou se comble chez son propriétaire — ou, pour une obligation sans propriétaire possible parce qu'elle porte sur l'écran assemblé, dans le principe transversal `COGNITIVE-LOAD-UX.md` que cet inventaire a fait naître (2026-07-21). Statuts recalculés APRÈS l'écriture du principe.

## Mode d'emploi

- **Couvert** : une règle existante tranche le cas — le propriétaire est nommé en majuscules.
- **Partiel** : une mécanique existe chez un propriétaire, mais l'obligation transversale manquait avant le principe, ou un morceau reste sans règle.
- **Absent / En attente** : aucun propriétaire ne peut porter le cas aujourd'hui — position à prendre avant d'improviser.
- L'état transitoire (le trou-type des premières rédactions) est ici l'**écran intermédiaire** : ce qui se passe entre deux décisions (progression, autosave, mémoire) — section 5 dédiée.

## 1. Budget de décision

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Écran avec une action dominante | Une vue déclare sa décision principale ; le primary est unique et tout le reste se subordonne | Couvert — BUTTON (primary unique) + COGNITIVE-LOAD (obligation d'écran) |
| Étape de formulaire mono-décision | Chaque étape d'un parcours porte une décision, pas un empilement de sujets | Couvert — FORM (multi-step) + COGNITIVE-LOAD (« un écran par décision, pas par champ ») |
| Dashboard dense multi-widgets | Une collection montre beaucoup sans faire décider partout ; cardinalité des actions par carte bornée | Partiel — CARD (cardinalité) ; la hiérarchie de l'écran assemblé relève de COGNITIVE-LOAD |
| Page marketing multi-CTA | Plusieurs appels à l'action en concurrence sur une même vue | Couvert — COGNITIVE-LOAD (une décision principale) + BUTTON (inflation du primary) |
| Densité justifiée par l'espace | Un conteneur large qui « profite » de la place pour ajouter des choix | Couvert — ADAPTIVE (l'espace ne change pas la priorité) + COGNITIVE-LOAD (le besoin justifie, pas l'espace) |

## 2. Divulgation progressive

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Détail avancé sur demande | Réglages avancés, options rares ou détail technique repliés derrière une demande explicite | Couvert — COGNITIVE-LOAD (l'essentiel d'abord) ; divulgation spatiale chez ADAPTIVE |
| Coût visible avant l'engagement | Prix, obligation, risque ou portée d'une action affichés AVANT le geste qui engage | Couvert — COGNITIVE-LOAD (frontière dure « jamais un coût caché ») |
| Fonction essentielle découvrable | Réduire les choix sans enfouir une fonction dont l'utilisateur a besoin | Partiel — tension Hick ↔ découvrabilité rendue visible (COGNITIVE-LOAD + catalogue des lois) ; l'arbitrage remonte au cas par cas |
| Information nécessaire jamais retardée | Ce qu'il faut savoir pour décider n'apparaît pas après la décision | Couvert — ADAPTIVE (spatial) + COGNITIVE-LOAD (transversal) |

## 3. Défauts intelligents

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Choix avec réponse majoritaire | Un champ ou un réglage qui admet une valeur sensée pour la plupart des cas la propose d'office | Couvert — COGNITIVE-LOAD (obligation) ; mécanique par champ chez INPUT |
| Consentement jamais pré-coché | Aucune case d'engagement (consentement, achat, partage) cochée d'avance | Couvert — FORM (données sensibles) + flow de création de compte (consentement) ; obligation transversale chez COGNITIVE-LOAD |
| Défaut distinct d'une valeur saisie | L'utilisateur distingue ce qu'il a choisi de ce qui a été proposé pour lui | Couvert — INPUT (placeholder ≠ valeur, pré-remplissage annoncé) |
| Tri / filtre par défaut d'une collection | Une collection arrive déjà triée ou filtrée de façon sensée et annoncée | En attente — aucun propriétaire (CARD candidate le jour d'une collection réelle) ; position à prendre avant d'improviser |

## 4. Réversibilité

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Action destructive déclarée avant | Ce que l'action détruit, sa portée et le non-retour sont dits avant l'exécution | Couvert — BUTTON (mécanique destructive ; DeleteButton reste ouvert au journal) |
| Action réversible exécutée sans friction | Le réversible part immédiatement, avec un chemin d'annulation visible | Partiel — COGNITIVE-LOAD (doctrine undo > confirmation) ; l'incarnation concrète attend le TOAST porteur d'une annulation |
| Confirmation réservée à l'irréversible | Pas de « êtes-vous sûr ? » sur les gestes anodins — la fatigue de confirmation désarme le garde-fou | Couvert — COGNITIVE-LOAD ; friction proportionnelle chez BUTTON |
| Saisie qui survit à l'interruption | Quitter, être interrompu ou expirer ne détruit pas le travail accompli | Couvert — FORM (autosave) + ACCESSIBILITY (limites de temps) |
| Anti-double-soumission | Un envoi ne part jamais deux fois par impatience | Couvert — FORM / BUTTON (état de soumission) |

## 5. Reconnaissance plutôt que rappel — l'écran intermédiaire

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Ne jamais redemander (ask-once) | Une information déjà fournie n'est pas redemandée à l'écran suivant | Couvert — FORM (multi-step, ask-once) |
| Récapitulation avant l'engagement | Le contexte de la décision finale est re-présenté au moment de s'engager | Couvert — FORM (récapitulation) + COGNITIVE-LOAD (obligation transversale) |
| Aide persistante plutôt qu'éphémère | L'aide reste visible pendant la saisie, elle ne disparaît pas quand on en a besoin | Couvert — INPUT (helper persistant) |
| Progression visible | Où j'en suis, ce qui est fait, ce qui reste — montré, jamais à mémoriser | Couvert — FORM (progression, statut d'autosave) |
| État système visible hors formulaire | Un traitement en cours, une synchronisation, un mode actif restent perceptibles | Partiel — ALERT/TOAST portent le feedback ponctuel ; l'obligation générale « montrer l'état » vit chez COGNITIVE-LOAD, la mécanique par surface reste à éprouver |

## 6. Anti-camouflage

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Information critique jamais déguisée | Erreur, coût, sécurité ou obligation ne prennent jamais une forme décorative ou promotionnelle | Couvert — COGNITIVE-LOAD (règle promue depuis le catalogue des lois, qui la signalait « candidate ») |
| Erreur reconnaissable entre toutes | Une erreur ressemble à une erreur — tone, mot et forme convergent | Couvert — ALERT (tones) + VOICE (ton des moments critiques) ; l'interdit du déguisement chez COGNITIVE-LOAD |
| Contenu promotionnel identifiable | Ce qui est promotionnel se signale comme tel, sans mimer l'interface | En attente — aucun composant de contenu marketing ; à éprouver le jour venu (cf. À approfondir du principe) |

## Bilan

23 cas. Avant le principe : 11 couverts par un propriétaire, 7 partiels, 5 absents. Après `COGNITIVE-LOAD-UX.md` (2026-07-21) : 18 couverts, 3 partiels (dashboard assemblé, découvrabilité au cas par cas, état système hors formulaire — chacun avec son chemin de remontée), 2 en attente (tri/filtre par défaut d'une collection ; contenu promotionnel), journalisés dans le principe (§ À approfondir) — position à prendre avant tout consommateur réel, conformément à la méthode.

## Sources

Le sourçage vit dans `COGNITIVE-LOAD-UX.md` (table « Sources et niveau de confiance ») et, pour les lois citées, dans `LAWS-UX.md`. Cet inventaire est un outil de vérification, pas une source normative.
