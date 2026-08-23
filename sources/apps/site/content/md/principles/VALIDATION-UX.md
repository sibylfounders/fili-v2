---
component: validation
layer: ux
type: principle
version: 1.1.0 # 1.1.0 : R13 rectifiée (un verdict caduc cesse de faire AUTORITÉ, pas de s'AFFICHER — arbitrage 2026-07-30) et R18 ajoutée (le moment de la validation se déclare, le protocole l'outille sans l'imposer). 1.0.0 : première rédaction : protocole transversal « Validation et récupération » — la chaîne universelle du verdict, née du constat que la doctrine décrivait entièrement la chaîne sans qu'aucune pièce ne la rende exécutable (docs/chantiers/VALIDATION-DIAGNOSTIC.md, 2026-07-30)
last_updated: 2026-07-30
companion: none # principe UX-only : aucune couche visuelle, aucun token — la teinte d'un état appartient à son composant (INPUT-UI, CHOICE-UI), le mot à VOICE
confidence: mixed # les critères WCAG 3.3.x et l'API de validation de contrainte HTML sont établis ; la taxonomie du verdict et l'ordre de priorité d'affichage sont une décision d'architecture interne datée 2026-07-30
---

# Validation et récupération — Couche UX (principe transversal)

> Ce fichier possède **la chaîne**, pas ses maillons. Il dit ce qu'est un verdict, ce qui le rend opposable, et dans quel ordre il traverse le système. Il ne dit ni comment un champ s'habille (`INPUT`), ni quand un formulaire déclenche sa validation (`FORM`), ni comment un message se formule (`VOICE`), ni comment il s'annonce (`ACCESSIBILITY`). Source du besoin : `docs/chantiers/VALIDATION-DIAGNOSTIC.md` — un état d'erreur pouvait être posé à la main, sans qu'aucune donnée ne le justifie.

## Note de transposition (à lire en premier)

RÈGLE [VALIDATION-R01] : ce document est un **protocole transversal**, pas un composant : ni variantes, ni tokens, ni assemblage. Il est compilé vers `dist/` parce que toute génération d'un contrôle de formulaire le consomme — au même titre qu'`ACCESSIBILITY`.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document décrit un protocole transversal de validation, sans variantes ni tokens, compilé et consommé à chaque génération d'un contrôle de formulaire.

RÈGLE [VALIDATION-R02] : il **ne fait autorité que sur la chaîne** et sur la taxonomie du verdict. Tout ce qui relève d'un maillon appartient à son propriétaire — la table d'autorité ci-dessous tranche. En cas de divergence, le propriétaire du maillon a raison.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce principe fait autorité sur la chaîne de validation et la taxonomie du verdict, jamais sur la mécanique d'un maillon, qui appartient à son propriétaire.

## La chaîne

RÈGLE [VALIDATION-R03] : **la chaîne est une, et elle est ordonnée.** Nature de la donnée attendue → contraintes déclarées → valeur saisie ou sélectionnée → déclenchement → validateur → **verdict** → état du contrôle → message local → agrégation par le formulaire → focus et annonce → correction → revalidation → soumission ou reprise. Aucun maillon ne se saute : un état affiché sans verdict est un mensonge, un verdict sans message est muet, un message sans agrégation est introuvable sur un formulaire long.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'affichage d'une erreur suit une chaîne ordonnée et complète, de la contrainte déclarée jusqu'à la reprise après correction, sans qu'aucun maillon soit sauté.
MESURE : pour tout état d'erreur affiché, on peut nommer la contrainte, le validateur, le verdict, le message et l'entrée de résumé correspondants

RÈGLE [VALIDATION-R04] : **le verdict est l'unité, et il existe indépendamment du rendu.** Il porte au minimum un code stable, le champ ou groupe concerné, sa source, sa gravité et son message. Un statut visuel en DÉCOULE ; il n'en tient jamais lieu.
STATUT : propriété universelle
SOURCE : S1,S6
ÉNONCÉ : L'état de validation d'un contrôle est porté par un objet structuré — code, champ, source, gravité, message — dont l'apparence n'est qu'une projection.
MESURE : l'état d'erreur d'un contrôle est calculable sans lire aucune couleur, classe ou attribut de présentation

RÈGLE [VALIDATION-R05] : **une erreur n'est jamais un style choisi.** Un état d'erreur posé sans verdict est un défaut, y compris s'il est visuellement juste : rien ne garantit qu'une donnée le justifie, et rien ne le fera disparaître à la correction. Seule exception nommée : une **fixture de présentation** — documentation ou démonstration d'un état isolé — qui doit se déclarer comme telle.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un état d'erreur affiché sans verdict correspondant est un défaut, sauf dans une fixture de présentation explicitement déclarée.
MESURE : aucun contrôle de formulaire d'une interface réelle ne reçoit un statut d'erreur non dérivé d'un verdict

## La taxonomie

RÈGLE [VALIDATION-R06] : **cinq états, et ils ne sont pas interchangeables.** `pristine` (rien n'a été vérifié), `validating` (un verdict est attendu), `valid`, `invalid`, `warning`. **`pristine` n'est pas `valid`** : l'absence de verdict ne prouve rien, et traiter un champ jamais vérifié comme correct est la façon la plus courante de laisser passer une soumission fautive.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Un contrôle distingue cinq états de validation, et l'état initial « jamais vérifié » n'est jamais assimilé à « valide ».
MESURE : un contrôle jamais validé se distingue, dans l'état du système, d'un contrôle validé avec succès

RÈGLE [VALIDATION-R07] : **`error` bloque, `warning` non.** `error` signifie que la valeur ne peut pas être acceptée ; `warning` qu'elle reste acceptable mais mérite l'attention. Un avertissement qui empêche d'avancer est une erreur mal nommée — et une erreur présentée comme un avertissement est un piège.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : La gravité d'un verdict détermine son effet : une erreur empêche la soumission, un avertissement ne l'empêche jamais.
MESURE : aucune soumission n'est refusée sur la seule présence d'un verdict d'avertissement

RÈGLE [VALIDATION-R08] : **quatre sources, une seule autorité finale.** Un verdict vient d'une contrainte native, d'un schéma applicatif, d'une règle métier ou du serveur. Le design system NORMALISE et PRÉSENTE ces verdicts ; il n'invente aucune contrainte métier. En cas de contradiction, **le serveur fait foi** et son verdict REMPLACE celui du client — il ne s'empile jamais avec lui.
STATUT : propriété universelle
SOURCE : S2,S5
ÉNONCÉ : Un verdict déclare sa source — native, schéma, métier ou serveur — et le verdict du serveur remplace celui du client en cas de contradiction.
MESURE : chaque verdict porte sa source ; un verdict serveur sur un champ remplace le verdict client au lieu de s'y ajouter

RÈGLE [VALIDATION-R09] : **la validation cliente n'est jamais une garantie de sécurité.** Elle sert la récupération de l'utilisateur, pas la protection du système. Aucune règle de ce document ne dispense d'une validation serveur, et aucune interface ne doit laisser croire le contraire.
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : La validation côté client est une aide à la saisie, jamais un contrôle de sécurité : le serveur valide toujours.
MESURE : toute contrainte appliquée côté client est également appliquée côté serveur

RÈGLE [VALIDATION-R10] : **le message affiché sous le champ et celui du résumé sont le MÊME objet.** Deux textes pour un même problème divergent dès la première correction, et l'utilisateur qui suit un lien de résumé ne retrouve pas ce qu'il a lu.
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Le message local et l'entrée du résumé d'erreurs sont issus du même verdict, jamais rédigés deux fois.
MESURE : le texte du message local et celui de l'entrée de résumé correspondante sont identiques

## Une seule erreur à la fois

RÈGLE [VALIDATION-R11] : **un champ peut violer plusieurs contraintes ; l'interface en montre UNE.** Empiler « Champ requis / Format incorrect / Valeur inconnue / Erreur serveur » ne dit pas quoi faire : ça dit que tout est faux. Le verdict retenu est celui de la contrainte la plus fondamentale — une erreur précise et réparable à la fois.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Un contrôle n'affiche qu'un seul message d'erreur à la fois, celui de la contrainte la plus fondamentale.
MESURE : aucun contrôle n'affiche simultanément plusieurs messages d'erreur

RÈGLE [VALIDATION-R12] : **la priorité est déterministe et documentée**, jamais l'ordre d'arrivée des validateurs. Deux exécutions sur les mêmes données donnent le même message. L'ordre retenu par ce système : gravité (erreur avant avertissement), puis source (serveur → métier → schéma → natif), puis, à source native égale, la contrainte la plus structurelle d'abord — le navigateur n'a pas pu lire la valeur, puis elle est absente, puis sa nature est fausse, puis sa forme, puis sa taille, puis son domaine numérique.
STATUT : implémentation de référence
SOURCE : S2
ÉNONCÉ : L'ordre de priorité entre verdicts concurrents est déclaré et reproductible, et ne dépend jamais de l'ordre d'exécution des validateurs.
MESURE : deux exécutions de la validation sur des données identiques produisent le même message

## La récupération

RÈGLE [VALIDATION-R13] : **un verdict porte sur une valeur ; quand elle change, il cesse de faire autorité — pas de s'afficher.** Un verdict rendu sur une saisie qui n'existe plus ne peut plus rien affirmer : il n'oppose plus rien à la soumission. Mais il **reste lisible** jusqu'à ce que le champ soit re-jugé. Retirer le message au premier caractère retire l'instruction au moment précis où elle sert : quelqu'un qui arrive d'un lien du résumé doit pouvoir lire ce qu'il corrige *pendant* qu'il le corrige.
STATUT : propriété universelle
SOURCE : S5,S6
ÉNONCÉ : Un verdict attaché à une valeur qui a changé cesse de bloquer la soumission, mais son message reste affiché jusqu'à la revalidation du champ.
MESURE : après modification d'une valeur, le verdict antérieur n'entre plus dans la décision de soumettre, et son message reste visible tant que le champ n'a pas été re-jugé

> **Deux propriétés qu'on confond souvent, et qu'il faut séparer** : *faire autorité* (ce verdict décide-t-il ?) et *s'afficher* (ce texte est-il à l'écran ?). Un verdict caduc perd la première et garde la seconde. Ce qui le remplace n'est pas le temps qui passe : c'est une **revalidation** — au blur, ou à la soumission suivante. (Arbitrage daté : cf. DECISIONS.md, 2026-07-30.)

RÈGLE [VALIDATION-R14] : **la disparition visuelle d'une erreur ne vaut pas validité.** Un formulaire se déclare soumissible sur l'état de ses verdicts, jamais sur l'absence de message à l'écran ni sur une classe de présentation. Un verdict `validating` n'est pas un refus : c'est une attente, et elle se dit.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : L'autorisation de soumettre se décide sur l'état des verdicts, jamais sur l'apparence de l'interface.
MESURE : la décision de soumettre est calculable à partir des seuls verdicts, sans lire le DOM rendu

RÈGLE [VALIDATION-R15] : **tout contrôle de formulaire déclare son rôle dans la chaîne** — porteur d'un verdict propre, porteur d'un verdict de groupe, ou hors chaîne. Un contrôle hors chaîne **justifie** son exclusion. Un composant livré sans cette déclaration est un composant dont personne ne sait s'il peut être fautif.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Tout contrôle de formulaire déclare explicitement s'il porte un verdict, un verdict de groupe, ou aucun — et justifie ce dernier cas.
MESURE : chaque composant rendant un élément de formulaire porte une déclaration de rôle de validation

RÈGLE [VALIDATION-R18] : **le moment de la validation se déclare ; aucun protocole ne le décide à la place du formulaire.** Valider à la soumission, au départ du champ, ou après une pause dans la frappe sont trois partis légitimes — le secteur diverge réellement sur ce point, et le bon choix dépend du risque d'erreur de format du champ, pas d'une règle générale. La chaîne doit donc rendre ce choix **déclarable champ par champ** et le tenir ; elle ne doit ni en imposer un, ni le coder en dur. Deux bornes seulement, qui ne se négocient pas : jamais de verdict à chaque frappe sans délai, et jamais avant que la première saisie du champ soit terminée.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La stratégie de déclenchement de la validation est déclarée par le formulaire champ par champ ; le protocole l'outille sans en imposer aucune.
MESURE : la stratégie de validation de chaque champ est lisible dans sa déclaration, et aucun défaut n'est imposé par le système

> **Pourquoi ce n'est pas une lacune** : `FORM-R16` documente la divergence (GOV.UK valide à la soumission, Carbon au départ du champ) et l'assume. Un design system qui trancherait à leur place remplacerait une décision de produit par une préférence de bibliothèque. Ce que le système doit garantir, c'est que le choix soit **écrit quelque part** plutôt que dispersé dans le câblage.

## Frontières d'autorité (la table de référence)

RÈGLE [VALIDATION-R16] : ce protocole ne recopie aucune règle déjà détenue ailleurs. Table de référence — en cas de doute, elle tranche :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document fournit une table attribuant à chaque question de la chaîne de validation un propriétaire unique.

| Question | Propriétaire |
|---|---|
| Ce qu'est un verdict, sa taxonomie, ses invariants, la priorité | **VALIDATION-UX** |
| Rôle de validation d'un contrôle, et sa justification s'il n'en a pas | **VALIDATION-UX** |
| Habillage d'un état, emplacement du message, indicateur de requis | `INPUT-UX` / `INPUT-UI` |
| Erreur d'un ensemble de choix, rattachement au groupe | `CHOICE-UX` |
| État d'erreur d'un select et ce qu'il ne prend pas en charge | `SELECT-UX` |
| QUAND valider — le CHOIX de la stratégie, et la validation croisée | `FORM-UX` |
| Que le choix soit déclarable et tenu (l'outillage, pas la préférence) | **VALIDATION-UX** |
| Résumé d'erreurs, liens, focus, cycle de soumission, reprise | `FORM-UX` |
| Conteneur du message global (structure, tone, persistance) | `ALERT-UX` |
| Formulation du message — les mots, le ton, la personne | `VOICE-UX` |
| Association, annonce, déplacement du focus | `ACCESSIBILITY-UX` |
| Saisie, sélection, action, compréhension d'un état | `INTERACTION-UX` |
| Les contraintes métier elles-mêmes, le texte d'une erreur serveur | Le produit / le serveur — hors design system |

> **Pourquoi cette table existe** : la chaîne traverse six propriétaires. Sans elle, chacun aurait fini par écrire sa propre définition du verdict — c'est-à-dire six définitions, donc aucune.

## Règle transversale

RÈGLE [VALIDATION-R17] : **le composant présente un verdict ; le formulaire orchestre les verdicts ; le produit définit les contraintes ; le serveur rend le verdict final.** Quatre responsabilités, quatre propriétaires, aucun recouvrement.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le composant présente, le formulaire orchestre, le produit contraint, le serveur tranche — quatre responsabilités sans recouvrement.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Une erreur de saisie détectée automatiquement est identifiée et décrite à l'utilisateur en texte ; les critères d'erreur couvrent l'identification, la suggestion de correction et la prévention des erreurs sur les engagements | [WCAG 2.2 — 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | Établi, standard (niveau A) |
| S2 | API de validation de contrainte : `ValidityState` expose des drapeaux nommés et stables (valueMissing, typeMismatch, patternMismatch, tooShort, tooLong, rangeUnderflow, rangeOverflow, stepMismatch, badInput, customError) ; `validationMessage` est un texte défini par l'agent utilisateur | [HTML Living Standard — Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#client-side-form-validation) | Normatif — fonde les codes stables ET l'interdiction d'utiliser le message du navigateur comme message canonique |
| S3 | Une suggestion de correction est fournie quand elle est connue ; un message d'erreur dit ce qui ne va pas et comment le réparer, en un seul énoncé par problème | [WCAG 2.2 — 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) | Établi, standard (niveau AA) |
| S4 | `aria-invalid` indique qu'une valeur saisie n'est pas conforme ; il n'est posé que lorsque l'erreur est effective, et le message est associé au contrôle | [WAI-ARIA — aria-invalid](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid) | Normatif |
| S5 | Pour les soumissions à engagement juridique ou financier, les données sont réversibles, vérifiées ou confirmées ; les valeurs saisies survivent à l'erreur | [WCAG 2.2 — 3.3.4 Error Prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) | Établi, standard (niveau AA) |
| S6 | Un message d'erreur nommé et rattaché au champ, un résumé en tête de page pointant vers chaque champ fautif, un seul message par champ | [GOV.UK Design System — Error message / Error summary](https://design-system.service.gov.uk/components/error-message/) | Convergent — convention d'un système public éprouvé, reprise par Carbon et Material sur le principe du message unique |
| S7 | La validation côté client est une aide à la saisie et ne remplace jamais la validation côté serveur ; toute donnée reçue est revalidée | [OWASP — Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | Établi — consensus sécurité |

CONFIANCE : les critères WCAG 3.3.x, l'API de validation de contrainte HTML et `aria-invalid` sont **établis** et normatifs. Sont des **décisions d'architecture internes datées du 2026-07-30**, et identifiées comme telles : la taxonomie à cinq états (dont la distinction `pristine` / `valid`), l'ordre de priorité entre verdicts concurrents (R12), et l'obligation de déclarer un rôle de validation par composant (R15). Aucune de ces trois décisions n'est opposable à un tiers comme une norme ; elles sont opposables **à ce système**.
