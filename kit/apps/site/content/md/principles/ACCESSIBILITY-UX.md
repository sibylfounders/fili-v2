---
component: accessibility
layer: ux
type: principle
version: 1.2.0 # 1.2.0 : deux règles neuves nées de l'inventaire du moteur (2026-07-31) — R17 (une relation ARIA désigne un élément existant) et R18 (aria-invalid n'est jamais seul). Le code de verifie-rendu.mjs contrôlait les deux depuis le 30/07 sans qu'aucune règle ne les porte : le contrôle précédait la doctrine. Sources S8 (WCAG 4.1.2 + ARIA 1.2) et S9 (WCAG 3.3.1) ajoutées. 1.1.1 # 1.1.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.1.0 : Accessibility devient un principe de premier niveau ; son contrat universel, sa compilation et son chargement automatique restent inchangés. 1.0.1 : attributions WCAG précisées (2.5.6 AAA, ordre de focus, portée de 1.4.2, mécanismes/exceptions de 2.2.1) + 2.5.8 AA ajouté ; première rédaction : fondation transversale UX-only (companion: none) compilée vers dist/ et chargée d'office par le routeur, née des trous P1 de l'inventaire transversal du 2026-07-14
last_updated: 2026-07-20
companion: none # principe UX-only : aucune couche visuelle (ni token, ni lexique) — le « concret » vit chez les propriétaires nommés. Distinct de laws : celui-ci EST compilé (l'IA de build le charge à chaque intention), cf. note de transposition
confidence: mixed # les critères WCAG 2.2 cités sont établis (principalement A/AA ; 2.5.6 est AAA) ; le choix d'un socle universel compact plutôt qu'une duplication par composant est une décision d'architecture interne datée 2026-07-14
---

# Accessibilité — Couche UX (principe transversal)

> Ce fichier pose les **obligations universelles** d'accessibilité que tout composant, pattern, fondation et langage doit respecter — le contrat minimal, pas le détail. Il **ne porte aucune valeur visuelle ni token** et ne duplique pas le raisonnement de ses propriétaires : les contrastes vivent dans `COLOR`, le focus ring dans `BORDER`, le mouvement dans `MOTION`, la redondance icône dans `ICONOGRAPHY`, le mot dans `VOICE`, et chaque règle propre à un composant dans ce composant. Il **renvoie** vers eux, il ne les remplace pas. Source du besoin : `content/md/inventaires/inventaire-cas-usage-accessibilite.md` (audit transversal du 2026-07-14).

## Note de transposition (à lire en premier)

RÈGLE [ACCESSIBILITY-R01] : l'accessibilité est un **principe transversal** — comme les lois, elle n'a ni variantes (composant), ni assemblage (pattern), ni token ; le modèle à axes ne s'applique pas. Contrairement aux lois, elle **est compilée vers `dist/`** (`RULES-accessibility`) et **chargée d'office par le routeur pour toute intention** : c'est un contrat que le build consomme réellement à chaque génération d'UI, pas une lecture théorique réservée à l'humain. Précédent du système : `companion: none` **sans** `audience: humans`.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise que l'accessibilité est un principe transversal sans variantes ni tokens, mais compilé et chargé automatiquement pour toute génération d'interface.

RÈGLE [ACCESSIBILITY-R02] : ce principe **ne fait pas autorité sur un comportement précis** — il pose l'obligation, le propriétaire pose la mécanique. En cas de divergence, le fichier propriétaire (`COLOR`, `BORDER`, `MOTION`, `BUTTON`, `FORM`…) a raison. Il n'est donc **pas** une source normative de substitution — même clause que l'inventaire transversal dont il est issu.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce principe pose l'obligation générale mais ne fait pas autorité sur le détail : en cas de divergence, le composant propriétaire prévaut.

RÈGLE [ACCESSIBILITY-R03] : **`VOICE` est la voix éditoriale — la façon dont le produit *écrit*, jamais la commande *vocale*.** L'obligation « service utilisable sans parler » et « nom accessible adressable à la voix » relève de l'interaction (clavier + nom accessible, ci-dessous et chez `INPUT`), pas du langage `VOICE`. Ne jamais lire `VOICE` comme une couverture de la reconnaissance vocale.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise que 'VOICE' désigne la voix éditoriale du produit, jamais la commande vocale, pour éviter toute confusion de lecture.

## Les obligations universelles

### Opérabilité — entrées et modalités concurrentes

RÈGLE [ACCESSIBILITY-R04] : **toute fonction est utilisable au clavier seul** — atteignable et activable sans souris ni tactile (WCAG 2.1.1). Tout nouveau composant hérite de cette obligation avant toute autre.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Toute fonction doit être utilisable au clavier seul, atteignable et activable sans souris ni écran tactile.
MESURE : chaque fonction est atteignable et activable au clavier seul, sans souris ni tactile

RÈGLE INTERNE RENFORCÉE : **les modalités disponibles ne sont pas artificiellement bloquées** — clavier, souris, tactile, contacteur (via le modèle clavier/focus) et commande vocale de la plateforme restent utilisables ensemble ; aucune n'est désactivée au profit d'une seule. Ce contrat adopte WCAG 2.5.6, critère de niveau **AAA**, comme exigence interne au-delà du socle AA.

RÈGLE [ACCESSIBILITY-R06] : **aucune fonction ne dépend uniquement du hover, d'un geste complexe (multipoint ou tracé), du glisser-déposer ou de la parole** — chacun garde une alternative simple à pointeur unique ou clavier (WCAG 2.5.1, 2.5.7 ; contenu au hover : 1.4.13). Les alternatives concrètes vivent chez les propriétaires : glisser-déposer → `CARD`, hover → `BUTTON`/`CARD`, parole → `INPUT`.
STATUT : propriété universelle
SOURCE : S2,S3
ÉNONCÉ : Aucune fonction ne doit dépendre uniquement du survol, d'un geste complexe, du glisser-déposer ou de la parole.
MESURE : aucune fonction ne dépend uniquement du survol, d'un geste complexe, du glisser-déposer ou de la parole — une alternative à pointeur unique ou clavier existe

### Focus

RÈGLE [ACCESSIBILITY-R07] : le focus est **visible, ordonné, non piégé et non masqué** — l'ordre de tabulation préserve le sens et l'opérabilité, sans devoir reproduire littéralement la disposition visuelle ; on sait toujours où l'on agit, on entre et sort de toute zone au clavier, et rien (en-tête collant, élément superposé) ne cache la cible focalisée (WCAG 2.4.7, 2.4.3, 2.1.2, 2.4.11). Le style du ring appartient à `BORDER` (qui porte aussi le contrat « non masqué ») ; l'ordre et l'absence de piège à `FORM` et au futur composant modal.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Le focus clavier doit toujours être visible, suivre un ordre cohérent, ne jamais être piégé ni masqué par un élément superposé.
MESURE : le focus clavier reste visible, suit un ordre cohérent, n'est jamais piégé dans une zone, et n'est jamais masqué par un élément superposé

### Nom, rôle, valeur

RÈGLE [ACCESSIBILITY-R08] : chaque contrôle expose **nom, rôle et valeur** à l'arbre d'accessibilité, et son **nom accessible contient le libellé visible** (WCAG 4.1.2, 2.5.3 « label in name ») — pour que la commande vocale puisse l'adresser par ce qu'on lit à l'écran. La mécanique par champ vit chez `INPUT` ; l'icône seule chez `ICONOGRAPHY` (aria-label) ; le choix des mots chez `VOICE`.
STATUT : propriété universelle
SOURCE : S6,S2
ÉNONCÉ : Chaque contrôle doit exposer nom, rôle et valeur à l'arbre d'accessibilité, et son nom accessible doit contenir le libellé affiché.
MESURE : chaque contrôle expose nom, rôle et valeur à l'arbre d'accessibilité, et son nom accessible contient le libellé visible à l'écran

### Canaux sensoriels — jamais un seul

RÈGLE [ACCESSIBILITY-R09] : **aucune information ni instruction ne dépend uniquement d'une caractéristique sensorielle ou de la couleur** (WCAG 1.3.3 et 1.4.1). Le système étend cette exigence au mouvement, au son et à l'haptique : chaque canal non fiable est doublé, et le canal de repli est toujours le mot (`VOICE`). WCAG 1.4.2 porte spécifiquement sur le contrôle d'un son joué automatiquement ; il ne suffit pas, à lui seul, à justifier cette règle de redondance renforcée. Détail par canal : couleur → `COLOR` ; mouvement → `MOTION` ; son et haptique → l'émetteur (`ALERT` pour un futur signal sonore, `BUTTON` pour l'haptique).
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Aucune information ni instruction ne doit reposer uniquement sur une caractéristique sensorielle ou sur la couleur.
MESURE : aucune information ou instruction ne repose uniquement sur une caractéristique sensorielle ou sur la couleur

### Gestes et pointeur

RÈGLE [ACCESSIBILITY-R10] : **une alternative simple existe pour tout geste complexe et tout glisser-déposer**, et **une action grave ne se déclenche jamais au `pointerdown`** (déclenchement à la relâche, annulable) — WCAG 2.5.2, 2.5.7. Propriétaires : `CARD` (glisser-déposer), `BUTTON` (annulation du pointeur).
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Une alternative simple doit exister pour tout geste complexe ou glisser-déposer, et une action grave ne doit jamais se déclencher au pointerdown seul.
MESURE : toute action grave se déclenche au relâchement du pointeur, jamais au pointerdown seul, et reste annulable ; tout geste complexe a une alternative simple

RÈGLE [ACCESSIBILITY-R11] : toute cible interactive respecte au minimum **24 × 24 pixels CSS ou l'espacement équivalent**, sous réserve des exceptions prévues par WCAG 2.5.8 (niveau AA). Le standard interne de **44px** documenté par `ICONOGRAPHY` et les composants reste la cible de confort renforcée : il couvre le minimum WCAG sans confondre taille du glyphe et zone interactive.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Toute cible interactive doit mesurer au moins 24 × 24 pixels CSS ou bénéficier d'un espacement équivalent, sauf exceptions prévues.
MESURE : chaque cible interactive mesure au moins 24 × 24 pixels CSS, ou bénéficie d'un espacement équivalent, sauf exception normative

### Temps

RÈGLE [ACCESSIBILITY-R12] : pour toute limite de temps imposée à l'utilisateur, appliquer l'un des mécanismes prévus par WCAG 2.2.1 : la supprimer, permettre de l'ajuster avant qu'elle ne commence, ou avertir et permettre une prolongation suffisante, sauf exception normative (temps réel ou délai essentiel). **Règle interne renforcée** : lorsqu'une expiration peut interrompre une saisie, l'annoncer et préserver les données déjà fournies dès que cela est techniquement possible. Propriétaire : `FORM`. Hors périmètre : les délais côté serveur qui ne constituent pas une échéance imposée à l'utilisateur.
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Nous appliquons les mécanismes normatifs pour toute limite de temps imposée, et renforçons l'exigence en annonçant et préservant les données déjà saisies.
MESURE : toute limite de temps applique un mécanisme (suppression, ajustement préalable ou prolongation avertie), et un message annonce l'expiration en préservant les données saisies

### Danger physiologique

RÈGLE [ACCESSIBILITY-R13] : **aucun flash dangereux** — pas plus de trois flashs par seconde, seuils de flash général et de flash rouge respectés (WCAG 2.3.1). Propriétaire : `MOTION`.
STATUT : propriété universelle
SOURCE : S5
ÉNONCÉ : Aucun contenu ne doit produire de flash dangereux — au maximum trois flashs par seconde, dans le respect des seuils établis.
MESURE : aucun contenu ne clignote plus de trois fois par seconde, et les seuils de flash général et de flash rouge sont respectés

## Tests minimaux (avant de livrer un sujet)

RÈGLE [ACCESSIBILITY-R14] : éprouver chaque **écran assemblé** — pas seulement les styles isolés — au minimum avec : **clavier seul** (atteindre et activer chaque fonction, focus visible et non masqué), **lecteur d'écran** (nom/rôle/valeur, annonce des changements dynamiques), **zoom 200 % et reflow** (aucune perte de contenu ni de fonction), **tactile imprécis** (cibles atteignables, aucune dépendance au hover) et **mouvement réduit** (aucune information perdue). Ces tests sont **manuels** : l'outillage du projet prouve la résolution des tokens, certains contrastes, le graphe de routage et les liens — il ne simule ni clavier, ni lecteur d'écran, ni commande vocale.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous testons chaque écran assemblé avant livraison avec le clavier seul, un lecteur d'écran, le zoom 200 %, un usage tactile imprécis et le mode mouvement réduit.

## Ce que ce principe ne fait pas encore — statut « En attente »

RÈGLE [ACCESSIBILITY-R15] : en l'absence de composant audio ou vidéo, **aucune règle détaillée n'est écrite sur les sous-titres, les transcriptions ou les audiodescriptions** — le besoin est réel mais sans consommateur ; il reste `En attente` dans l'inventaire transversal, position à prendre avant de créer un tel composant. Même statut pour la reconnaissance vocale complète, les superposés (modale, tiroir) et les raccourcis à une seule touche.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document signale qu'aucune règle détaillée n'existe encore sur les sous-titres, l'audiodescription, la reconnaissance vocale ou les superposés, faute de composant consommateur.

## Renvois vers les propriétaires (aucune valeur ici)

| Besoin | Propriétaire normatif |
|---|---|
| Contraste, information sans couleur, forced-colors, dark mode | `RULES-color` |
| Focus ring, focus non masqué, survie en forced-colors | `RULES-border` |
| Flash, mouvement réduit, information portée par le mouvement | `RULES-motion` |
| Redondance texte/icône, icône seule (aria-label) | `RULES-iconography` |
| Mot comme canal de repli, wording accessible, plain language | `RULES-voice` |
| Annulation du pointeur, haptique jamais indispensable | `BUTTON` |
| Alternative au glisser-déposer, hover non indispensable | `CARD` |
| Limites de temps, focus après échec, résumé d'erreurs | `FORM` |
| Signal sonore toujours doublé d'un message textuel | `ALERT` |
| Dictée, correspondance libellé visible / nom accessible | `INPUT` |

## Règle transversale

RÈGLE [ACCESSIBILITY-R17] : **toute relation programmatique désigne un élément qui existe.** Un `aria-describedby`, `aria-labelledby` ou `aria-errormessage` dont l'identifiant ne correspond à aucun élément du document ne produit **aucune erreur visible** : le message disparaît pour la technologie d'assistance sans que rien ne bouge à l'écran. C'est le défaut le plus silencieux de la chaîne — et seul le rendu peut le voir, puisque les identifiants sont générés à l'exécution.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Tout attribut de relation ARIA désigne un identifiant porté par un élément présent dans le document.
MESURE : aucun identifiant d'aria-describedby, aria-labelledby ou aria-errormessage sans élément correspondant
CRITERE : chaque("[aria-describedby],[aria-labelledby],[aria-errormessage]") pointe_vers_existant(aria-describedby|aria-labelledby|aria-errormessage)

RÈGLE [ACCESSIBILITY-R18] : **`aria-invalid` n'est jamais seul.** Un champ marqué invalide sans message associé annonce l'échec sans dire pourquoi : la personne sait qu'elle s'est trompée, jamais en quoi. L'identification d'une erreur exige que sa cause soit décrite en texte, pas seulement signalée.
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : Tout élément portant aria-invalid="true" expose un message d'erreur en texte, associé par une relation programmatique.
MESURE : aucun élément aria-invalid="true" sans message associé par aria-describedby ou aria-errormessage
CRITERE : chaque("[aria-invalid=true]") porte(aria-describedby) ou porte(aria-errormessage)

RÈGLE [ACCESSIBILITY-R16] : **l'accessibilité n'est pas une couche qu'on ajoute — c'est la condition d'existence de chaque règle.** Ce fichier pose l'obligation universelle et nomme son propriétaire ; il ne réécrit jamais la mécanique là où elle vit déjà.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document rappelle que l'accessibilité est la condition d'existence de chaque règle du système, et que sa mécanique concrète vit toujours chez un seul propriétaire.

> **Pourquoi** : une section « accessibilité » recopiée dans chaque composant diverge dès la première évolution et laisse croire à une couverture qu'aucun propriétaire ne garantit — exactement le travers que l'inventaire transversal a rendu visible. Un contrat unique, chargé partout, plus un renvoi vers le propriétaire réel : la règle ne vit qu'à un seul endroit.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Clavier (2.1.1), pas de piège (2.1.2), ordre du focus (2.4.3), focus visible (2.4.7), focus non masqué (2.4.11) | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Établi — standard (niveaux A/AA) |
| S2 | Modalités concurrentes (2.5.6), pointeur annulable (2.5.2), label in name (2.5.3), gestes (2.5.1), glisser-déposer (2.5.7), taille de cible (2.5.8) | [W3C WAI — Understanding Input Modalities](https://www.w3.org/WAI/WCAG22/Understanding/input-modalities.html) | Établi — 2.5.6 est AAA ; 2.5.8 est AA |
| S3 | Caractéristiques sensorielles (1.3.3), couleur (1.4.1), contrôle du son automatique (1.4.2), contenu au survol/focus (1.4.13) | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Établi — la redondance systématique mouvement/son/haptique est une règle interne renforcée |
| S4 | Limites de temps ajustables (2.2.1) | [W3C — Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | Établi — standard (A) |
| S5 | Flash (2.3.1) : ≤ 3 par seconde, seuils général et rouge | [W3C — Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) | Établi — standard (A) |
| S6 | Nom, rôle, valeur (4.1.2) | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Établi — standard |
| S7 | Taxonomie des capacités (visuel, auditif, moteur, cognitif, parole) | [W3C WAI — Diverse Abilities and Barriers](https://www.w3.org/WAI/people-use-web/abilities-barriers/) | Établi |
| S8 | Un IDREF ARIA qui ne résout pas rompt la relation sans signal visible ; nom, rôle et valeur doivent être exposés à l'arbre d'accessibilité | [WCAG 2.2 — 4.1.2 Nom, rôle et valeur](https://www.w3.org/TR/WCAG22/#name-role-value), [WAI-ARIA 1.2 — IDREF](https://www.w3.org/TR/wai-aria-1.2/#propcharacteristic_value) | Établi — standard (niveau A) |
| S9 | Une erreur détectée automatiquement est identifiée et décrite **en texte** ; le seul marquage ne suffit pas | [WCAG 2.2 — 3.3.1 Identification des erreurs](https://www.w3.org/TR/WCAG22/#error-identification) | Établi — standard (niveau A) |

CONFIANCE : les critères WCAG 2.2 cités sont établis (principalement niveaux A/AA ; 2.5.6 est explicitement AAA). Les exigences qui dépassent ces critères sont identifiées comme **règles internes renforcées**. Le choix d'un **socle universel compact chargé pour toutes les intentions** — plutôt qu'une section accessibilité dupliquée dans chaque composant — est une décision d'architecture interne datée du 2026-07-14 : la règle propre reste chez son propriétaire, ce fichier ne porte que l'obligation et le renvoi.
