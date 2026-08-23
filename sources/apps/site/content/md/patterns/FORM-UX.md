---
component: form
layer: ux
type: pattern # distinct de "component" — une composition, pas un atome
version: 2.6.0 # 2.6.0 : `SCENE` + `CRITERE` sur R20 et R24 — premières règles mesurées dans un état, pas au repos (2026-08-01). 2.5.0 : 2.5.0 : `CRITERE` posé sur R05 — premier critère du pattern FORM (2026-07-31). 2.4.0 : 2.4.0 : FORM-R06 requalifié en note de méthode — pointeur non normatif vers BUTTON-R60 (BUTTON-UX.md), propriétaire de la cardinalité du bouton de soumission ; ÉNONCÉ et MESURE normatifs retirés du pointeur, aucune règle métier modifiée (2026-07-28, cf. DECISIONS.md). 2.3.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 2.3.0 : statut de frontière de la règle du bouton actif (pivot 2026-07-21) — noyau universel (jamais de désactivation silencieuse, jamais l'état du bouton comme seul canal d'erreur) distingué du parti pris d'identité « jamais de disabled comme validation », paramétrable, lu en audit d'hôte comme divergence de position et non comme défaut. 2.2.0 : orchestration nommée des 4 Languages (Interaction/Motion/Voice/E-motion) au niveau pattern — « un événement, un porteur » pour le succès (alert productif consultable / toast illustré injecté / SubmitButton en place, jamais deux) ; mapping cycle de soumission → ton ; crans et reduced-motion des apparitions orchestrées (2026-07-21). 2.1.3 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 2.1.2 : désambiguïsation du consentement dans la table de risque — autorité creation-compte-consentement (inscription) vs form-sensitive-data (consentement lié à données sensibles/paiement) ; trou révélé par le pilote externe du 2026-07-16, cf. DECISIONS.md. Aucune règle de fond modifiée. 2.1.1 : 2.2.1 rectifié — trois mécanismes et exceptions normatives distingués de la conservation des données, règle interne renforcée. 2.1.0 : limites de temps imposées à l'utilisateur (WCAG 2.2.1) — contrôle, avertissement et conservation des données ; trou P1 de l'inventaire transversal accessibilité comblé chez son propriétaire (2026-07-14, cf. DECISIONS.md). 2.0.0 : cycle de soumission formalisé (machine à états — 6e occurrence du biais "état transitoire", au niveau du pattern) ; autorité sur la stratégie de timing de validation reçue d'INPUT-UX (4e dédoublonnage) ; convention requis/optionnel arbitrée ("marquer la minorité") ; structure/fieldset, conservation des données, titre de page, multi-étapes, validation asynchrone/croisée, champs conditionnels, autosave, erreurs serveur, succès partiel, risque par contexte. Cf. DECISIONS.md 2026-07-11. 1.1.2 : balisage RÈGLE/CONFIANCE. 1.1.1 : narration migrée vers DECISIONS.md. 1.1.0 : conteneur du résumé d'erreurs → components/alert/
last_updated: 2026-07-28
companion: FORM-UI.md
confidence: mixed
---

# Formulaire — Couche UX (pattern de composition)

> Ce fichier n'est pas un composant au sens de BUTTON-UX.md ou INPUT-UX.md — c'est un **pattern**, une règle qui n'émerge que quand plusieurs champs et un bouton sont assemblés. Vit dans `content/md/patterns/`, pas `content/md/components/`, pour que la distinction reste visible dans la structure elle-même.

## Note de transposition

RÈGLE [FORM-R01] : le modèle à 3 axes (style/tone/size) ne s'applique pas ici — un formulaire n'a pas de variante visuelle au sens où un bouton ou un input en a. Un formulaire est une séquence et une coordination, pas un objet avec des états visuels propres.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise que le formulaire n'a pas de variantes visuelles de style/tone/size, car c'est un pattern d'orchestration, non un composant atomique.

> **Pourquoi** : c'est cohérent avec ce qu'on a déjà observé sur l'input — le nombre et la nature des axes dépendent de ce que l'objet *est*.

RÈGLE [FORM-R02] : les états du cycle de soumission (cf. section dédiée) ne sont **pas** des variantes visuelles du pattern — ce sont des moments d'une orchestration, rendus visibles par les composants qu'elle coordonne (bouton en loading, alert danger, erreurs inline). Le formulaire n'a toujours aucun token d'état propre.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise que les états du cycle de soumission ne sont pas des variantes visuelles du pattern mais des moments rendus par les composants coordonnés.

## But
Un formulaire coordonne plusieurs champs vers une soumission cohérente. Sa fonction n'est ni celle du bouton (déclencher), ni celle de l'input (capturer) — c'est d'orchestrer les deux ensemble, avec des règles qui n'existent qu'au niveau de l'ensemble : la convention requis/optionnel, le timing des validations, le résumé d'erreurs, le déplacement du focus, le cycle complet entre la soumission et son résultat. Un formulaire n'est pas un objet statique — c'est un **orchestrateur dans le temps**.

## Frontières d'autorité (la table de référence)

RÈGLE [FORM-R03] : chaque règle du domaine formulaire a exactement un propriétaire. Table de référence — en cas de doute, elle tranche :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document fournit une table attribuant à chaque règle du domaine formulaire un propriétaire unique, à consulter en cas de doute.

| Domaine | Propriétaire |
|---|---|
| Label, helper text, valeur, état local, erreur locale, ARIA du champ (`aria-describedby`, `for`/`id`) | INPUT-UX / INPUT-UI |
| Mécanique de validation d'un champ isolé (blur, différé pendant la frappe, wording du message) | INPUT-UX |
| Indicateur de champ requis (l'astérisque, le mot, son token) | INPUT-UX / INPUT-UI |
| Affordance, label de l'action, loading, anti double-activation, feedback local du déclenchement | BUTTON-UX |
| Conteneur du message global : structure (icône/titre/corps), tone, icône, persistance, fermeture, tokens | ALERT-UX / ALERT-UI |
| `role="alert"` vs `role="status"` (règle générique d'annonce) | ALERT-UX |
| Convention requis/optionnel du formulaire entier | **FORM-UX** |
| Ordre, groupement, fieldset/legend | **FORM-UX** |
| Stratégie de timing des validations du formulaire assemblé | **FORM-UX** (reçue d'INPUT-UX — cf. DECISIONS.md 2026-07-11) |
| Validation croisée entre champs | **FORM-UX** |
| Apparition du résumé, contenu des liens, coordination inline/global | **FORM-UX** |
| Déplacement du focus (échec, succès, retry, ajout/suppression de groupe) | **FORM-UX** |
| Cycle de soumission, conservation des valeurs, titre de page | **FORM-UX** |
| Contenu métier des messages serveur (le texte exact d'une erreur 500) | Le produit / le serveur — hors design system |

> **Pourquoi cette table existe** : les trois partages d'autorité déjà journalisés (form↔button 2026-07-03, form↔card, form↔alert 2026-07-04) ont tous été découverts en réparant une duplication. La table les rend visibles *avant* la duplication.

## Structure et groupement

RÈGLE [FORM-R04] : les champs liés par le sens sont groupés dans un `fieldset` avec une `legend` qui nomme le groupe ("Adresse de livraison") — le groupement visuel (`fieldset_gap`, cf. FORM-UI.md) et le groupement sémantique vont toujours ensemble.
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : Les champs formant un groupe de sens doivent être réunis dans un fieldset avec une legend, pour que les lecteurs d'écran annoncent le contexte du groupe.
MESURE : chaque groupe de champs liés par le sens est contenu dans un fieldset dont la legend nomme le groupe

> **Pourquoi** : un lecteur d'écran qui entre dans un champ "Ville" sans contexte ne sait pas s'il s'agit de la livraison ou de la facturation — la legend est annoncée avec chaque champ du groupe. (WCAG 1.3.1 ; GOV.UK utilise la legend comme titre de page sur les question pages.)

RÈGLE [FORM-R05] : l'ordre des champs et du focus suit la logique de la tâche (du connu vers le demandé, du général au particulier) et préserve le sens et l'opérabilité. La présentation visuelle ne contredit pas cet ordre ; jamais de `tabindex` positif pour recoudre un DOM ou une mise en page cassés.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : L'ordre des champs et du focus doit suivre la logique de la tâche et ne jamais utiliser de tabindex positif pour corriger un DOM mal ordonné.
MESURE : aucun attribut tabindex positif n'est utilisé sur les champs du formulaire
CRITERE : compte("[tabindex]:not([tabindex='0']):not([tabindex='-1'])") == 0

RÈGLE [FORM-R06] : cardinalité du bouton de soumission — **autorité portée par `BUTTON-UX.md`**. « Un seul bouton de soumission par formulaire », sa position en fin de flux et son label conclusif sont régis par `BUTTON-R60` et sa section « Dans un formulaire ». Le formulaire garde le *quand* : c'est lui qui décide des changements d'état de ce bouton (cf. cycle de soumission).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La règle du bouton de soumission unique appartient à BUTTON-UX (R60) ; ce document décide seulement du moment où ce bouton change d'état.

RÈGLE [FORM-R07] : formulaire court vs long — pas de seuil chiffré universel, mais un critère : dès que l'utilisateur doit scroller pour voir toutes les erreurs possibles, le formulaire est "long" au sens des règles de focus et de résumé d'erreurs de ce fichier.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous définissons un formulaire comme long non par un nombre de champs mais par le besoin de scroller pour voir toutes les erreurs possibles.
MESURE : le formulaire est classé long dès que l'utilisateur doit scroller pour voir toutes les erreurs possibles

RÈGLE [FORM-R08] : formulaire dans une modale — le formulaire suit les règles de la modale pour ce qui est du conteneur (le bouton destructif jamais activable par Entrée réflexe, cf. BUTTON-UX.md ; jamais d'alert pleine page dans une modale, cf. ALERT-UX.md). Réservé aux saisies courtes : un formulaire long dans une modale cumule deux scrolls et perd son résumé d'erreurs hors viewport — le déplacer en page.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Dans une modale, nous réservons le formulaire aux saisies courtes et déplaçons tout formulaire long en page complète.

RÈGLE [FORM-R09] : édition inline (dans une table) — c'est un champ, pas un formulaire : INPUT-UX.md (§ Dans une table) fait autorité. Le pattern form commence quand plusieurs champs se soumettent *ensemble*.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise qu'une édition inline dans une table est un champ isolé, pas un formulaire, tant que plusieurs champs ne se soumettent pas ensemble.

## Convention "champ requis" — décision de formulaire, pas de champ

RÈGLE [FORM-R10] : la vraie décision est *"ce formulaire marque-t-il les champs requis, ou les champs optionnels ?"* — un choix pris une fois pour tout le formulaire, jamais champ par champ. L'indicateur lui-même (astérisque, équivalent textuel) reste décrit dans INPUT-UX.md ; la convention se décide ici. (Historique : cf. DECISIONS.md.)
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Nous décidons une fois pour tout le formulaire s'il marque les champs requis ou les champs optionnels, jamais champ par champ.
MESURE : la convention de marquage requis/optionnel est identique pour tous les champs d'un même formulaire

RÈGLE [FORM-R11] : le critère est la **proportion** — marquer la minorité :
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Nous marquons uniquement la minorité des champs, requis ou optionnels selon la proportion, pour que le marqueur reste informatif.
MESURE : si la majorité des champs sont obligatoires, seuls les optionnels portent la mention (optionnel) ; sinon seuls les obligatoires sont marqués ; si tous sont obligatoires, une mention unique figure en tête
  - majorité de champs obligatoires → marquer les seuls champs **optionnels** (mention "(optionnel)" dans le label) ;
  - majorité de champs optionnels → marquer les seuls champs **obligatoires** ;
  - tous les champs obligatoires → ne rien marquer champ par champ, l'annoncer une fois en tête ("Tous les champs sont obligatoires") ;
  - formulaire réellement mixte (ni majorité nette ni convention produit) → marquer les obligatoires, la convention la plus largement comprise.

> **Pourquoi pas une règle unique** : le benchmark diverge réellement — GOV.UK interdit l'astérisque et ne marque que l'optionnel ; Carbon documente la règle de majorité ; Material marque le requis par astérisque systématique. Répéter un marqueur sur la quasi-totalité des champs est du bruit qui n'informe plus ; le marqueur doit porter l'exception, pas la norme.

CONFIANCE : convergence — GOV.UK et Carbon convergent sur "ne pas marquer ce qui est majoritaire" ; le choix précis (règle de proportion) est une décision interne calibrée sur ce principe, pas un standard unique.

RÈGLE [FORM-R12] : indiquer la convention explicitement en tête de formulaire ("Les champs marqués * sont obligatoires" / "Tous les champs sont obligatoires"), pas seulement via l'indicateur isolé.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous affichons toujours en tête de formulaire une phrase expliquant la convention de marquage retenue, pas seulement l'indicateur visuel isolé.
MESURE : une phrase en tête du formulaire explique la convention retenue (ex. Les champs marqués * sont obligatoires)

> **Pourquoi** : un astérisque seul est une convention visuelle que tout le monde ne comprend pas, et n'apporte rien à un lecteur d'écran sans le texte associé.

RÈGLE [FORM-R13] : combiner l'indicateur visuel et l'attribut `required`/`aria-required="true"` pour que la technologie d'assistance l'annonce — sur les champs obligatoires, quelle que soit la convention de marquage visuel retenue.
STATUT : propriété universelle
SOURCE : S14
ÉNONCÉ : Chaque champ obligatoire doit porter l'attribut required ou aria-required="true" en plus de son indicateur visuel.
MESURE : chaque champ obligatoire porte l'attribut HTML required ou aria-required="true"

RÈGLE [FORM-R14] : la convention retenue vaut pour **tout le produit**, pas seulement pour un formulaire — une convention qui change d'un écran à l'autre est pire que n'importe laquelle des conventions prise seule (cf. table de risque).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous appliquons la même convention requis/optionnel à tous les formulaires du produit, jamais une convention différente d'un écran à l'autre.
MESURE : la même convention de marquage requis/optionnel est appliquée sur tous les formulaires du produit

## Stratégie de validation — décidée au niveau du formulaire

RÈGLE [FORM-R15] : la stratégie de timing (quand les champs d'un formulaire assemblé se valident) est une décision **du formulaire**, pas de chaque champ — même mouvement que la convention requis. INPUT-UX.md garde la *mécanique* d'un champ (comment une erreur inline s'affiche, remplace le helper text, se formule) et le défaut d'un champ isolé hors formulaire (recherche, édition inline). (Transfert d'autorité : cf. DECISIONS.md 2026-07-11.)
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous décidons la stratégie de timing de validation au niveau du formulaire entier, pas champ par champ.

RÈGLE [FORM-R16] : deux stratégies légitimes, à choisir par formulaire selon le risque d'erreur de format :
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : Nous choisissons par formulaire entre valider uniquement à la soumission ou valider au blur avec un délai d'environ 500 ms sur les champs à risque.
MESURE : la validation au blur est différée d'environ 500 ms pendant la frappe, ou le formulaire ne valide qu'au submit
  - **Validation au submit uniquement** — le défaut pour les formulaires courts à champs simples (contact, question unique). Aucune interruption pendant la saisie ; toutes les erreurs au moment de la soumission, avec résumé et focus (cf. sections dédiées).
  - **Validation au blur, différée (~500 ms) pendant la frappe sur les champs à fort risque de format** (email, mot de passe, IBAN) — le défaut pour les formulaires longs ou à champs contraints. La mécanique par champ vit dans INPUT-UX.md.

> **Pourquoi deux stratégies et pas une** : le benchmark diverge frontalement — GOV.UK : "ne validez pas quand l'utilisateur quitte un champ, attendez la soumission" (problèmes documentés pour les utilisateurs qui tapent lentement) ; Carbon : "validez dès que le champ perd le focus". Les deux positions sont argumentées et publiées ; trancher en absolu serait présenter une préférence comme un standard. Le critère interne : la friction de validation suit le risque réel d'erreur du champ (règle transversale d'INPUT-UX.md, élevée ici au formulaire).

CONFIANCE : divergence documentée entre systèmes majeurs (GOV.UK ↔ Carbon) — décision interne : le choix existe et se fait par formulaire, il n'est pas laissé au hasard champ par champ.

RÈGLE [FORM-R17] : jamais de validation à chaque frappe sans délai, et jamais de validation d'un champ **avant** que l'utilisateur ait fini sa première saisie (pas d'erreur "email invalide" à la deuxième lettre tapée).
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : Nous ne validons jamais un champ à chaque frappe sans délai, ni avant que l'utilisateur ait terminé sa première saisie.
MESURE : aucune validation ne se déclenche à chaque frappe sans délai, ni avant que l'utilisateur ait quitté le champ pour la première fois

RÈGLE [FORM-R18] : les contraintes connues d'avance s'expliquent **avant** la saisie (helper text, format attendu, prérequis) — pas seulement en cas d'erreur après coup. Le helper text appartient à l'input ; la décision de ce qui mérite une explication préalable appartient au formulaire. (WCAG 3.3.2 — labels ou instructions, niveau A.)
STATUT : propriété universelle
SOURCE : S6
ÉNONCÉ : Les contraintes de format connues d'avance doivent être expliquées avant la saisie, pas seulement révélées après une erreur.
MESURE : chaque champ à format contraint affiche son format attendu avant la saisie, via un texte d'aide visible

### Validation croisée entre champs

RÈGLE [FORM-R19] : quand chaque champ est valide isolément mais que leur **combinaison** est invalide (date de fin avant la date de début, deux champs mutuellement exclusifs remplis ensemble), l'erreur appartient au *groupe*, pas à un champ arbitraire :
STATUT : parti pris d'identité
SOURCE : S17
ÉNONCÉ : Nous rattachons une erreur de combinaison entre champs à leur groupe entier, jamais à un champ isolé arbitraire.
MESURE : le message d'erreur nomme la relation entre les champs et le lien du résumé mène au premier champ du groupe dans l'ordre de lecture
  - le message nomme la relation ("La date de fin doit être postérieure à la date de début"), jamais un seul des deux champs ;
  - visuellement, l'erreur s'ancre sur le **premier champ du groupe dans l'ordre de lecture** (c'est là que le lien du résumé d'erreurs mène), les autres champs du groupe passent aussi en tone error ;
  - la validation croisée se joue **au submit** (ou au blur du dernier champ du groupe si la stratégie du formulaire est au blur) — jamais pendant la frappe d'un des champs, tant que l'autre n'est pas rempli.

CONFIANCE : non formalisé — aucun des systèmes benchmarkés ne documente la validation croisée ; raisonnement de mécanisme (une erreur de relation signalée sur un champ isolé accuse le mauvais champ).

## Résumé d'erreurs (error summary)

RÈGLE [FORM-R20] : après un échec de soumission, donner une vue d'ensemble de tout ce qui doit être corrigé, avant que l'utilisateur ne redécouvre les erreurs une par une en scrollant.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Après un échec de soumission, une vue d'ensemble de toutes les erreurs doit être donnée avant que l'utilisateur ne les redécouvre en scrollant.
MESURE : un résumé listant toutes les erreurs apparaît après un échec de soumission
SCENE : soumission-vide
CRITERE : compte("[role=alert],[role=alertdialog],[aria-live=assertive]") >= 1

> **Portée du critère** : il vérifie qu'une région d'alerte **visible** apparaît après une
> soumission en échec. Il ne vérifie pas qu'elle liste *toutes* les erreurs — confronter le
> contenu du résumé au nombre de champs fautifs reste à faire.

RÈGLE [FORM-R21] : **le conteneur est un alert** — structurellement, le résumé d'erreurs est un alert `tone: danger`, `persistance: permanent` (non fermable tant que des erreurs subsistent), injecté dynamiquement — donc annoncé (`role="alert"`). Tout ce qui relève du *conteneur* (structure icône/titre/corps, tokens, redondance icône/couleur, comportement d'annonce) vit dans `content/md/components/ALERT-UX.md` (ALERT-UX.md + ALERT-UI.md), qui fait autorité. (Décision : cf. DECISIONS.md.)
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Le résumé d'erreurs doit être structuré comme une alerte de tonalité danger, non fermable, annoncée via role="alert".
MESURE : le résumé d'erreurs est un composant alert de tone danger, non fermable tant que des erreurs subsistent, avec role="alert"

Reste ici ce qui est propre au formulaire — l'orchestration :

RÈGLE [FORM-R22] : le résumé apparaît **après un échec de soumission**, en tête de formulaire, jamais préventivement.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Le résumé d'erreurs ne doit apparaître qu'après un échec de soumission, jamais de façon préventive.
MESURE : le résumé d'erreurs n'est jamais affiché avant une tentative de soumission

RÈGLE [FORM-R23] : son corps est une **liste de liens d'ancre** vers chaque champ en erreur. Chaque lien reprend le message d'erreur exact du champ, pas un intitulé générique ("Email" ne suffit pas, "L'adresse email est requise" oui). Pour une erreur croisée, le lien mène au premier champ du groupe.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Le résumé d'erreurs doit lister des liens d'ancre vers chaque champ en erreur, en reprenant le message d'erreur exact.
MESURE : chaque entrée du résumé est un lien d'ancre vers le champ en erreur reprenant son message d'erreur exact, pas un intitulé générique

RÈGLE [FORM-R24] : ce que ce résumé ne remplace pas — les messages d'erreur inline restent nécessaires à côté de chaque champ : le résumé est un point d'entrée, pas un substitut. Les deux coexistent.
STATUT : propriété universelle
SOURCE : S1,S2
ÉNONCÉ : Le résumé d'erreurs ne doit jamais remplacer les messages d'erreur inline à côté de chaque champ — les deux doivent coexister.
MESURE : chaque champ en erreur affiche un message d'erreur inline en plus de son entrée dans le résumé
SCENE : soumission-vide
CRITERE : chaque("[aria-invalid=true]") porte(aria-describedby) ou porte(aria-errormessage)

RÈGLE [FORM-R25] : le **titre de la page** est préfixé en cas d'échec ("Erreur : Créer un compte" dans `<title>`) — le premier signal qu'un lecteur d'écran reçoit après une soumission server-rendue, et un signal utile dans l'onglet du navigateur dans tous les cas.
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Nous préfixons le titre de la page par « Erreur : » après un échec de soumission d'un formulaire rendu côté serveur.
MESURE : le title de la page est préfixé par 'Erreur :' après un échec de soumission

CONFIANCE : établi — WCAG 3.3.1, techniques G83/G85/G139 ; liens d'ancre et messages exacts : GOV.UK (normatif dans leur système) ; titre de page préfixé : convergence GOV.UK + tutoriel W3C/WAI.

## Gestion du focus après échec de soumission

RÈGLE [FORM-R26] : deux patterns légitimes selon la densité du formulaire, pas un choix universel :
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Nous déplaçons le focus vers le premier champ en erreur pour un formulaire court, ou vers le résumé pour un formulaire long ou à erreurs multiples.
MESURE : après échec, le focus va au premier champ en erreur (formulaire court) ou au résumé d'erreurs (formulaire long ou erreurs multiples)
  - **Formulaire court (peu de champs)** : déplacer le focus clavier directement vers le premier champ en erreur.
  - **Formulaire long ou avec plusieurs erreurs simultanées** : déplacer le focus vers le résumé d'erreurs plutôt que vers le premier champ isolé — donne le contexte global avant de plonger dans la correction.

RÈGLE [FORM-R27] : conservation du contexte après correction — quand l'utilisateur revient d'un lien du résumé vers un champ, le champ garde son message d'erreur inline et sa valeur fautive : il corrige en contexte, il ne repart pas de zéro.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Nous faisons en sorte qu'un champ atteint depuis un lien du résumé conserve son message d'erreur et sa valeur saisie.
MESURE : un champ atteint depuis un lien du résumé conserve son message d'erreur inline et sa valeur fautive

> **Erreur fréquente, en contexte d'app moderne (React/Vue/Angular)** : contrairement à un formulaire server-rendu classique où le rechargement de page donne un point d'ancrage naturel pour l'annonce, une mise à jour d'état côté client peut changer l'interface sans jamais déplacer le focus ni déclencher d'annonce pour un lecteur d'écran — à gérer explicitement, ça ne vient jamais gratuitement dans ces frameworks.

CONFIANCE : établi — convergence Deque, WebAIM, W3C (consensus d'experts accessibilité) ; GOV.UK déplace le focus vers le résumé par défaut dans son implémentation.

## Coordination bouton/champs

RÈGLE [FORM-R28] : garder le bouton de soumission actif en permanence. Au clic, valider l'ensemble du formulaire, afficher les erreurs (inline + résumé) si nécessaire, et déplacer le focus en conséquence (cf. section précédente). Le bouton reste un point d'entrée toujours disponible, jamais un mystère à décoder.
STATUT : parti pris d'identité
SOURCE : S15
ÉNONCÉ : Nous gardons le bouton de soumission actif en permanence avant l'envoi, plutôt que de le désactiver comme validation préalable.
MESURE : le bouton de soumission n'est jamais désactivé avant la soumission, hors traitement asynchrone de l'envoi

> **Pourquoi pas le bouton désactivé** : pratique répandue mais déconseillée — un bouton désactivé n'offre aucune indication de *pourquoi* il l'est pour un utilisateur tactile (pas de tooltip au survol sur mobile), et casse la découvrabilité du formulaire pour un lecteur d'écran qui peut passer dessus sans comprendre ce qui manque. (Révision de l'ancienne règle de BUTTON-UX.md : cf. DECISIONS.md.)

RÈGLE [FORM-R29] : quand désactiver reste justifié — uniquement pendant le traitement asynchrone de la soumission elle-même (cf. anti double-soumission, déjà documenté dans BUTTON-UX.md) — jamais comme mécanisme de validation préalable.
STATUT : parti pris d'identité
SOURCE : S15
ÉNONCÉ : Nous ne désactivons le bouton de soumission que pendant le traitement asynchrone de l'envoi, jamais comme validation préalable.
MESURE : le bouton n'est désactivé que pendant le traitement asynchrone de l'envoi (état submitting)

CONFIANCE : non formalisé (émergent) — tendance récente de l'industrie, pas encore un consensus universel ; Carbon documente encore le bouton désactivé sur formulaire court. Position assumée, documentée comme émergente.

RÈGLE (frontière, pivot 2026-07-21) : **distinguer le noyau universel du parti pris.** Le noyau — auditable chez tout hôte — est double : un état désactivé n'est **jamais silencieux** (sa cause doit être découvrable, au tactile comme au lecteur d'écran), et l'état du bouton n'est **jamais le seul canal** qui signale ce qui manque. La prescription « bouton actif en permanence » est le **parti pris d'identité** de ce système, paramétrable : chez un hôte qui documente le bouton désactivé (Carbon sur formulaire court, conventions iOS), l'audit signale une *divergence de position documentée*, pas un défaut — sauf si le noyau universel est violé.

## Cycle de soumission — la machine à états

Le formulaire est toujours dans exactement un de ces états. Les composants *reflètent* l'état (bouton en loading, alert danger, erreurs inline) — ils ne le portent pas, et aucun état n'est une variante visuelle du pattern.

```text
                   ┌──────────────────────────────────────────────┐
                   ▼                                              │
idle ──submit──▶ validating ──erreurs──▶ invalid ──saisie──▶ correcting
                   │                        ▲                     │
                0 erreur                    │                 resoumission
                   ▼                        │                     │
               submitting ──erreurs de champ renvoyées────────────┘
                   │           par le serveur
                   ├─▶ success           (redirection OU confirmation in-page)
                   ├─▶ server_error ──▶ retrying ──▶ submitting
                   ├─▶ timeout ────────▶ retrying ──▶ submitting
                   └─▶ partial_success   (succès + reliquat à corriger)
```

RÈGLE [FORM-R31] : table des transitions — pour chaque transition : déclencheur, ce qui devient visible, ce qui est annoncé, où va le focus, l'état du bouton, le sort des valeurs saisies, la condition de sortie :
STATUT : parti pris d'identité
SOURCE : S1,S3,S17
ÉNONCÉ : Chaque état du cycle de soumission définit précisément ce qui devient visible, ce qui est annoncé, où va le focus et le sort des valeurs saisies.
MESURE : chaque état du cycle de soumission a un comportement défini pour le focus, l'annonce ARIA, l'état du bouton et la conservation des valeurs

| Transition | Déclencheur | Devient visible | Annoncé (AT) | Focus | Bouton | Valeurs saisies | Sortie |
|---|---|---|---|---|---|---|---|
| idle → validating | Activation du submit (clic, Entrée) | Rien — la validation client synchrone est quasi instantanée | Rien | Inchangé | Actif | Conservées | 0 erreur → submitting ; ≥ 1 erreur → invalid |
| validating → invalid | ≥ 1 erreur client | Résumé d'erreurs (alert danger permanent) + erreurs inline + titre de page préfixé "Erreur :" | `role="alert"` du résumé | Résumé (long / plusieurs erreurs) ou premier champ en erreur (court) | Actif — jamais désactivé | **Toutes conservées** | Saisie dans un champ en erreur → correcting |
| invalid → correcting | Focus ou saisie dans un champ en erreur | L'erreur inline disparaît quand le champ redevient valide (revalidation au blur) ; le résumé reste tel quel jusqu'à la resoumission | Silence — pas de re-annonce à chaque frappe | Suit l'utilisateur | Actif | Conservées | Resoumission → validating |
| correcting → validating | Resoumission | Erreurs **recalculées de zéro** — aucune erreur obsolète ne survit, aucune nouvelle n'est masquée | — | — | Actif | Conservées | Comme idle → validating |
| validating → submitting | 0 erreur client | Bouton en loading (label remplacé par l'indicateur — BUTTON-UX.md) | Traitement long (> ~5 s) : statut `aria-live="polite"` ("Envoi en cours…") — un spinner seul n'annonce rien | Inchangé | **Loading + désactivé** — l'unique désactivation légitime | Conservées, champs non modifiables pendant l'envoi | Réponse serveur, ou timeout |
| submitting → success | Réponse positive | Soit **redirection** vers une page de confirmation (titre propre, focus au titre), soit **confirmation in-page** (alert success — ALERT-UX.md — qui coiffe ou remplace le formulaire) | Nouveau titre de page, ou `role="status"` de l'alert success | Titre de la confirmation, ou l'alert success | — | Vidées si la tâche est conclue ; conservées si le formulaire reste utile (paramètres) | État terminal, ou retour à idle |
| submitting → server_error | Erreur globale (5xx, indisponibilité) | Alert danger en tête — message produit : quoi, pourquoi, comment sortir (gabarit ALERT-UX.md) — **pas** un résumé de champs | `role="alert"` | L'alert | Réactivé | **Toutes conservées** | Retry → retrying ; le serveur renvoie des erreurs de champ → invalid |
| submitting → timeout | Pas de réponse dans le délai | Alert danger "La demande n'a pas abouti" + action Réessayer | `role="alert"` | L'alert | Réactivé | Conservées | Retry → retrying |
| retrying → submitting | Activation de Réessayer | Comme submitting | Comme submitting | — | Loading + désactivé | Conservées — l'utilisateur ne ressaisit rien | Réponse serveur |
| submitting → partial_success | Succès partiel (une partie de la demande a abouti) | Alert warning : ce qui a réussi, ce qui reste à faire | `role="alert"` — il reste une action requise | L'alert | Réactivé sur le reliquat | Parties échouées conservées, parties réussies figées ou retirées | Correction du reliquat → correcting |

RÈGLE [FORM-R32] : conservation des données — après **tout** échec (validation, serveur, timeout), le formulaire réaffiche les champs exactement comme l'utilisateur les avait remplis. La perte des saisies après une erreur est le cas d'échec le plus coûteux du pattern : l'utilisateur paie deux fois.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Nous réaffichons toujours les champs avec exactement les valeurs saisies par l'utilisateur après un échec, quelle qu'en soit la cause.
MESURE : après tout échec (validation, serveur, timeout), tous les champs réaffichent exactement les valeurs saisies par l'utilisateur

CONFIANCE : établi — GOV.UK explicite ("show the page again, with the form fields as the user filled them in").

RÈGLE [FORM-R33] : erreurs contradictoires entre client et serveur — **le serveur fait foi**. Une erreur serveur sur un champ que le client jugeait valide remplace le verdict client (inline + entrée au résumé, mêmes règles que les erreurs client) ; elle ne s'empile jamais avec lui.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous faisons toujours prévaloir le verdict du serveur sur celui du client quand les deux se contredisent sur un champ.
MESURE : en cas de désaccord entre validation client et serveur sur un champ, seule l'erreur serveur est affichée

RÈGLE [FORM-R34] : annulation d'une soumission en cours — si le produit la permet, elle ramène à l'état antérieur avec les valeurs intactes ; si l'envoi est déjà parti, ne pas mentir : ne proposer l'annulation que si elle est réellement possible.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous ne proposons d'annuler une soumission en cours que si l'annulation est réellement possible, sans jamais le simuler faussement.

RÈGLE [FORM-R35] : session expirée / perte de connexion — dire ce qui s'est passé et ce qui est préservé. Si les valeurs ne peuvent pas être conservées (re-authentification qui recharge la page), le dire *avant* que l'utilisateur ne perde son travail relève de l'autosave (cf. section dédiée) ; ne jamais laisser un submit échouer en silence.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : En cas de session expirée ou de perte de connexion, nous informons toujours l'utilisateur de ce qui s'est passé et de ce qui est préservé.

RÈGLE [FORM-R36] : double activation — couverte par BUTTON-UX.md (loading/disabled dès le premier clic, avant la réponse du serveur). Le formulaire décide du *moment* (l'entrée en submitting) ; le bouton porte le mécanisme. Pour un envoi à effet unique (paiement), l'idempotence côté produit reste nécessaire — le design ne suffit pas.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Pour un envoi à effet unique comme un paiement, l'idempotence côté produit reste nécessaire en plus des mécanismes anti double-activation.

CONFIANCE (machine à états) : le squelette (invalid/résumé/focus/conservation) est établi (WCAG 3.3.1, GOV.UK, WAI) ; partial_success, annulation et la formalisation en états sont non formalisés — aucun système benchmarké ne les documente ; raisonnement de mécanisme, structure interne.

## Erreurs serveur et reprise

RÈGLE [FORM-R37] : deux natures d'erreur serveur, deux traitements :
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous distinguons toujours une erreur serveur portant sur un champ précis d'une erreur globale, jamais déguisée en erreur de champ.
MESURE : une erreur de champ renvoyée par le serveur s'affiche inline et dans le résumé ; une erreur globale (5xx) s'affiche en alert danger en tête, jamais rattachée à un champ
  - **erreur de champ renvoyée par le serveur** (email déjà pris, stock épuisé sur une ligne) → mappée comme une erreur de validation : inline sur le champ + entrée au résumé + focus selon les règles d'échec. L'utilisateur la corrige comme n'importe quelle erreur.
  - **erreur globale** (5xx, service indisponible) → un alert danger en tête, qui dit quoi/pourquoi/comment sortir et porte l'action de reprise ("Réessayer") — jamais déguisée en erreur de champ, il n'y a rien à corriger dans les champs.

RÈGLE [FORM-R38] : le retry réutilise les valeurs saisies telles quelles — un bouton Réessayer qui vide le formulaire est une insulte. Si la reprise peut créer un doublon (envoi peut-être passé côté serveur), le produit doit le dire ou le garantir (idempotence).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous faisons en sorte qu'un nouvel essai après erreur réutilise les valeurs déjà saisies, sans jamais vider le formulaire.
MESURE : un bouton Réessayer soumet à nouveau les valeurs déjà saisies sans les vider

RÈGLE [FORM-R39] : le **texte** exact d'une erreur serveur est une décision produit/serveur — hors design system. Le gabarit (quoi, pourquoi, comment sortir — ALERT-UX.md) et la chorégraphie (cet écran-ci) sont, eux, normés.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise que le texte exact d'une erreur serveur est une décision produit, hors périmètre du design system.

## Succès partiel

RÈGLE [FORM-R40] : quand une partie seulement de la demande aboutit (import de 80 lignes sur 100, commande validée mais paiement d'un article refusé), ni un success ni un danger ne dit la vérité — c'est un **alert warning** qui liste ce qui a réussi et ce qui reste à faire, avec le focus dessus.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Quand seule une partie d'une demande aboutit, nous affichons une alerte d'avertissement listant réussites et reliquat, jamais un simple succès ou échec.
MESURE : un succès partiel affiche un alert de tone warning listant ce qui a réussi et ce qui reste à faire, avec le focus dessus

RÈGLE [FORM-R41] : les parties réussies ne sont pas re-soumises au retry (figées ou retirées du formulaire) ; les parties échouées gardent leurs valeurs et redeviennent le périmètre de la soumission suivante.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Après un succès partiel, seules les parties échouées du formulaire restent soumissibles à nouveau.
MESURE : après un succès partiel, seules les parties échouées restent modifiables et resoumises ; les parties réussies sont figées ou retirées

CONFIANCE : non formalisé — cas absent des systèmes benchmarkés ; raisonnement de mécanisme (un success qui ment retire toute valeur au signal success).

## Formulaire en plusieurs étapes

RÈGLE [FORM-R42] : découper quand la longueur ou la charge cognitive le justifie — pas par esthétique. Le point extrême du spectre est documenté par GOV.UK ("one thing per page") ; la plupart des produits s'arrêtent à des étapes thématiques (livraison → paiement → récapitulatif).
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Nous découpons un formulaire en plusieurs étapes seulement quand sa longueur ou sa charge cognitive le justifie, jamais par esthétique.

RÈGLE [FORM-R43] : chaque étape valide **ses propres champs** à sa soumission ("Continuer") — l'utilisateur ne découvre pas à l'étape 4 une erreur de l'étape 1. La validation finale (croisée inter-étapes incluse) se joue à la dernière étape.
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Chaque étape d'un formulaire multi-étapes valide ses propres champs, sans faire découvrir plus tard une erreur d'une étape déjà validée.
MESURE : chaque étape valide uniquement ses propres champs lors de sa propre soumission

RÈGLE [FORM-R44] : le retour en arrière ne perd jamais les données déjà saisies — ni celles de l'étape quittée, ni celles des étapes précédentes. Un lien/bouton retour est toujours présent.
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Le retour en arrière dans un formulaire multi-étapes ne doit jamais perdre les données déjà saisies.
MESURE : un lien ou bouton retour est toujours présent et préserve les données de l'étape quittée et des étapes précédentes

RÈGLE [FORM-R45] : ne jamais redemander une information déjà fournie dans le parcours — la pré-remplir ou la rappeler. (WCAG 2.2 — 3.3.7 Redundant Entry, niveau A ; GOV.UK "ask once".)
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Une information déjà fournie dans le parcours ne doit jamais être redemandée sans être pré-remplie ou rappelée.
MESURE : aucune information déjà fournie dans le parcours n'est redemandée sans être pré-remplie ou rappelée

RÈGLE [FORM-R46] : une étape de **récapitulation** avant la soumission finale ("Vérifiez vos réponses") dès que l'engagement est juridique ou financier — c'est le mécanisme qui satisfait WCAG 3.3.4 (cf. Risque et contexte). Chaque ligne du récapitulatif offre un lien "Modifier" qui ramène à l'étape concernée sans perdre le reste.
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Un engagement juridique ou financier doit passer par une étape de récapitulation vérifiable avant sa soumission finale.
MESURE : une étape de récapitulation avec des liens Modifier vers chaque section précède la soumission finale d'un engagement juridique ou financier

RÈGLE [FORM-R47] : indicateur de progression — utile dès que le nombre d'étapes n'est pas évident, sans être un dogme (GOV.UK recommande de tester sans, d'ajouter si la recherche le montre nécessaire). S'il existe : étapes nommées, position courante explicite ("Étape 2 sur 4"), jamais cliquable vers l'avant.
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Nous ajoutons un indicateur de progression uniquement quand le nombre d'étapes n'est pas évident, jamais cliquable vers l'avant.
MESURE : si un indicateur de progression existe, il nomme les étapes, indique la position courante et n'est jamais cliquable vers l'avant

RÈGLE [FORM-R48] : le label du bouton de la dernière étape reflète la conclusion réelle ("Confirmer ma commande"), jamais "Suivant" — règle de BUTTON-UX.md, appliquée ici à la séquence.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le bouton de la dernière étape d'un formulaire multi-étapes doit refléter l'action réelle, jamais un générique 'Suivant'.
MESURE : le bouton de la dernière étape porte un label reflétant l'action réelle, jamais 'Suivant'

CONFIANCE : établi pour retour-sans-perte, ask-once et check-answers (GOV.UK, recherche documentée ; WCAG 3.3.7) ; convergence pour la progression (GOV.UK prudent, Carbon la recommande) ; le seuil de découpage est une décision produit.

## Validation asynchrone (au niveau du formulaire)

RÈGLE [FORM-R49] : quand la validité d'un champ dépend d'un aller-retour serveur pendant la saisie (disponibilité d'un identifiant, code promo), le champ a un **état d'attente** visible et annoncé — la mécanique du champ (spinner, `aria-live` du résultat) vit dans INPUT-UX.md ; le formulaire décide de ce qui suit :
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Quand la validité d'un champ dépend d'un aller-retour serveur, ce champ doit afficher un état d'attente visible et annoncé.
MESURE : un champ en validation asynchrone affiche un état d'attente visible et annoncé pendant l'aller-retour serveur

RÈGLE [FORM-R50] : une validation asynchrone **en cours** ne bloque pas la soumission silencieusement — si l'utilisateur soumet pendant l'attente, le formulaire attend le verdict et le dit ("Vérification en cours…"), ou re-valide le champ au submit. Jamais un submit qui ne répond rien.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une validation asynchrone en cours ne doit jamais bloquer la soumission en silence.
MESURE : si l'utilisateur soumet pendant une validation asynchrone en cours, le formulaire attend le verdict et l'affiche, ou revalide au submit

RÈGLE [FORM-R51] : résultat périmé — si la valeur du champ change pendant l'aller-retour, le verdict qui revient est jeté, jamais appliqué à la nouvelle valeur. Le verdict asynchrone reste un **verdict client au sens du cycle** : la soumission re-vérifie côté serveur (le serveur fait foi, toujours).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un verdict de validation asynchrone périmé est toujours jeté, et la soumission revérifie côté serveur.
MESURE : si la valeur d'un champ change pendant l'aller-retour, le verdict reçu est ignoré et la soumission revérifie côté serveur

RÈGLE [FORM-R52] : la validation asynchrone est réservée aux champs dont la validité ne peut pas se calculer localement — pas un moyen de "valider en direct" ce qu'une regex ferait sans réseau.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La validation asynchrone est réservée aux champs dont la validité ne peut pas être calculée localement.
MESURE : la validation asynchrone n'est utilisée que pour des champs dont la validité ne peut pas être vérifiée par une règle locale

CONFIANCE : convergence — l'état d'attente et l'annonce recoupent le tutoriel WAI (aria-live pendant la frappe) ; le verdict périmé est un raisonnement de mécanisme, non documenté par les systèmes benchmarkés.

## Champs conditionnels et groupes répétables

RÈGLE [FORM-R53] : un champ ou groupe qui apparaît selon une réponse précédente apparaît **immédiatement après le champ qui le déclenche** dans l'ordre de lecture et de focus — jamais ailleurs dans la page.
STATUT : parti pris d'identité
SOURCE : S17
ÉNONCÉ : Un champ ou groupe conditionnel doit toujours apparaître immédiatement après le champ qui le déclenche.
MESURE : un champ ou groupe conditionnel apparaît immédiatement après le champ qui le déclenche, dans l'ordre de lecture et de focus

RÈGLE [FORM-R54] : l'apparition ne vole pas le focus et ne provoque pas de saut de lecture (même règle d'insertion que l'alert — ALERT-UX.md) ; elle est annoncée si l'utilisateur risque de la manquer (`aria-expanded` sur le déclencheur, ou `aria-live="polite"` si la révélation est distante).
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : L'apparition d'un champ conditionnel ne doit jamais voler le focus, et doit être annoncée si l'utilisateur risque de la manquer.
MESURE : l'apparition d'un champ conditionnel ne déplace pas le focus automatiquement, et déclenche aria-expanded ou aria-live="polite" si la révélation est distante

RÈGLE [FORM-R55] : sort des valeurs masquées — une valeur saisie puis masquée par un changement de condition n'est **pas soumise**, mais reste mémorisée tant que la page vit : l'utilisateur qui re-bascule la condition retrouve sa saisie. À l'inverse, une erreur portée par un champ désormais masqué disparaît du résumé — on ne demande pas de corriger l'invisible.
STATUT : parti pris d'identité
SOURCE : S17
ÉNONCÉ : Une valeur saisie dans un champ ensuite masqué n'est pas soumise mais reste mémorisée pour être restaurée si la condition redevient vraie.
MESURE : une valeur saisie puis masquée n'est pas incluse dans la soumission mais reste restaurée si la condition est réactivée ; l'erreur associée disparaît du résumé

RÈGLE [FORM-R56] : groupes répétables ("ajouter un bénéficiaire") — l'action d'ajout est un bouton secondaire ou ghost (jamais le primary du formulaire) ; après un ajout, le focus va au premier champ du nouveau groupe ; après une suppression, au bouton d'ajout ou au groupe suivant — jamais perdu en tête de page. Chaque groupe est un fieldset numéroté dans sa legend ("Bénéficiaire 2") pour que les erreurs du résumé restent adressables.
STATUT : parti pris d'identité
SOURCE : S17
ÉNONCÉ : Dans un groupe répétable, le bouton d'ajout est toujours secondaire et le focus va au nouveau groupe après ajout.
MESURE : le bouton d'ajout d'un groupe répétable n'est jamais le bouton primary ; après ajout, le focus va au premier champ du nouveau groupe ; chaque groupe est un fieldset numéroté

CONFIANCE : non formalisé — patterns observés (GOV.UK "add another" est un pattern communautaire, pas normatif) ; raisonnement de mécanisme pour le sort des valeurs masquées.

## Brouillon et autosave

RÈGLE [FORM-R57] : l'autosave se justifie quand le coût d'une perte est élevé (saisie longue, session fragile) — pas par défaut sur un formulaire de trois champs, où il complexifie sans protéger grand-chose. Le brouillon explicite ("Enregistrer comme brouillon") est l'alternative quand l'utilisateur doit garder le contrôle de ce qui est persisté (contenus sensibles).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous activons l'autosave seulement quand le coût d'une perte de saisie est élevé, jamais par défaut sur un formulaire court.

RÈGLE [FORM-R58] : le statut d'autosave est visible et sobre — "Enregistré à 14 h 32" / "Enregistrement…" en `role="status"` (annonce polie, pas une interruption). Un échec d'autosave, lui, est un vrai avertissement (alert warning) : l'utilisateur croit être protégé, il ne l'est plus.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le statut d'autosave doit être visible en annonce discrète, et un échec d'autosave doit déclencher un avertissement explicite.
MESURE : le statut d'autosave est affiché en role="status" ; un échec d'autosave déclenche un alert de tone warning

RÈGLE [FORM-R59] : l'autosave ne remplace pas la soumission — il persiste un état *inachevé* sans le valider ni le soumettre. Le cycle de soumission reste inchangé ; l'autosave vit à côté, jamais dedans (pas d'autosave pendant submitting).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'autosave ne remplace jamais la soumission du formulaire et ne se déclenche jamais pendant l'envoi lui-même.
MESURE : l'autosave ne se déclenche jamais pendant l'état submitting du cycle de soumission

RÈGLE [FORM-R60] : à la reprise, dire ce qui a été restauré ("Brouillon du 3 juillet restauré") plutôt que de présenter silencieusement des champs pré-remplis d'origine incertaine.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : À la reprise d'un brouillon, nous annonçons toujours explicitement ce qui a été restauré.
MESURE : un message indique explicitement ce qui a été restauré plutôt que de pré-remplir silencieusement

CONFIANCE : non formalisé — aucun des systèmes benchmarkés ne norme l'autosave ; raisonnement de mécanisme + convergence des implémentations observées (éditeurs de contenu).

## Limites de temps imposées à l'utilisateur

RÈGLE [FORM-R61] : toute **limite de temps que le formulaire impose** à l'utilisateur (expiration de session, jeton à durée de vie, compte à rebours de réservation) suit l'un des mécanismes de WCAG 2.2.1 : elle est supprimable, ajustable avant son démarrage, ou prolongeable après un avertissement suffisant. Les exceptions de temps réel et de délai essentiel sont documentées au cas par cas (WCAG 2.2.1, niveau A).
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : Toute limite de temps imposée à l'utilisateur doit être supprimable, ajustable ou prolongeable après avertissement, sauf exception normative.
MESURE : toute limite de temps imposée par le formulaire est supprimable, ajustable avant son démarrage, ou prolongeable après un avertissement, sauf exception normative

RÈGLE [FORM-R62] : l'expiration est **annoncée avant** de survenir — un avertissement laisse le temps de réagir (prolonger d'un geste simple), il n'apparaît pas au moment où tout est déjà perdu. Il prend la forme d'un alert (conteneur : ALERT-UX.md ; `role="alert"` s'il est réactif).
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : L'expiration d'une limite de temps doit toujours être annoncée à l'avance, laissant le temps de la prolonger.
MESURE : un avertissement d'expiration apparaît avant que la limite de temps ne survienne, avec un moyen de la prolonger

RÈGLE INTERNE RENFORCÉE : à l'expiration, **les données saisies sont conservées dès que cela est techniquement possible** — la reprise après ré-authentification ou renouvellement de session ne repart pas d'un formulaire vide (recoupe la conservation des saisies après échec et l'autosave quand le coût le justifie). Cette conservation améliore la résilience du produit ; elle n'est pas présentée comme une exigence littérale de WCAG 2.2.1.

> **Pourquoi** : distinct du timeout *serveur* déjà traité dans le cycle de soumission (ce que le formulaire fait quand le réseau ne répond pas) — ici c'est une échéance *imposée à l'utilisateur*, la seule que vise WCAG 2.2.1. L'inventaire transversal la marquait absente précisément parce que le cycle ne couvrait que le versant réseau.

CONFIANCE : établi pour les mécanismes et exceptions de 2.2.1 (critère WCAG, niveau A) ; le rattachement de l'avertissement à l'alert et la conservation des données sont des règles internes renforcées.

## Orchestration des quatre Languages (au niveau pattern)

Un pattern **compose** des composants — les quatre Languages transversaux ne se rejouent pas ici, ils s'**orchestrent**. Le formulaire ROUTE les rôles, les apparitions, le ton et le moment vers les composants qui les portent ; il ne les duplique jamais. Chaque Language garde son autorité (cf. son fichier) ; cette section nomme ce que l'assemblage, et lui seul, décide.

### Interaction — orchestration des rôles (langage `INTERACTION-UX.md`)

RÈGLE [FORM-R64] : le formulaire n'invente aucun rôle ; il **assemble** ceux du § « Les six intentions » d'`INTERACTION-UX.md`, un composant par intention :
STATUT : parti pris d'identité
SOURCE : S18
ÉNONCÉ : Nous assemblons le formulaire à partir de rôles fixes : action pour le submit, navigation pour Modifier, action secondaire pour l'ajout, information pour le résumé.
MESURE : le submit est un composant Button, le lien Modifier un Link, l'ajout un bouton secondaire jamais primary, le résumé/message un composant Alert
  - le **submit** est un **Agir** (Button) — déclencher un effet dans le contexte courant, jamais un Link déguisé ;
  - le lien **« Modifier »** de chaque ligne du récapitulatif (§ Formulaire en plusieurs étapes) est un **Naviguer** (Link) — il ramène à l'étape concernée, c'est un déplacement, pas une action ;
  - **« Ajouter un bénéficiaire »** (§ Champs conditionnels et groupes répétables) est un **Agir secondaire** (Button secondaire ou ghost, **jamais le primary** du formulaire) — une action réelle, dont le poids visuel dit qu'elle n'est pas la conclusion ;
  - le **résumé d'erreurs** et tout message global (server_error, partial_success) relèvent de **Comprendre un état** (Alert) — un statut reçu, pas un contrôle à manipuler.

RÈGLE [FORM-R65] : le formulaire assemblé passe le **« Test de reconnaissance »** d'`INTERACTION-UX.md` — en niveaux de gris et sans hover, on distingue le submit (action), les « Modifier » (navigation), les champs (saisie) et le résumé (information). Deux rôles différents ne sont jamais rendus indiscernables : un « Modifier » n'emprunte pas l'aspect du submit, un Link ne soumet pas.
STATUT : parti pris d'identité
SOURCE : S18
ÉNONCÉ : Le formulaire assemblé doit rester lisible en niveaux de gris et sans survol : deux rôles différents ne sont jamais rendus indiscernables.
MESURE : en niveaux de gris et sans hover, le submit, les liens Modifier, les champs et le résumé restent visuellement distinguables par rôle

> **Pourquoi** : l'orchestration d'un formulaire est précisément l'endroit où quatre intentions cohabitent sur un même écran ; les confondre (un lien qui soumet, un bouton qui navigue) casse la lecture avant même que le premier mot soit lu — l'affordance honnête vaut au niveau de l'assemblage comme au niveau du composant.

CONFIANCE : établi — le mapping rôle→composant est normé par `INTERACTION-UX.md` (WCAG 3.2.4, identification cohérente) ; l'orchestration ne fait que l'appliquer à la composition.

### Motion — apparitions orchestrées (langage `MOTION-UX.md`)

RÈGLE [FORM-R66] : les apparitions que le formulaire orchestre suivent `MOTION-UX.md` — **réactives, jamais préventives** : le résumé d'erreurs apparaît en conséquence d'un échec de soumission, jamais chargé avec la page (§ « rien n'anime au chargement initial »), en opacité — jamais un slide qui pousse le contenu sous le point de lecture.
STATUT : parti pris d'identité
SOURCE : S19
ÉNONCÉ : Les apparitions orchestrées par le formulaire sont toujours réactives à une action, jamais préventives, et animées en opacité plutôt qu'en glissement.
MESURE : le résumé d'erreurs apparaît uniquement en réaction à un échec de soumission, en transition d'opacité, jamais au chargement de la page

RÈGLE [FORM-R67] : le champ ou groupe conditionnel qui se déplie (§ Champs conditionnels) est un mouvement de **continuité** au sens de `MOTION-UX.md` (relier deux états, expliquer d'où vient le changement), déclenché par l'action de l'utilisateur — l'exception légitime au non-déplacement, le contenu bouge *parce qu'il l'a demandé*.
STATUT : parti pris d'identité
SOURCE : S19
ÉNONCÉ : Le dépliage d'un champ conditionnel est un mouvement de continuité déclenché par l'action de l'utilisateur.
MESURE : le dépliage d'un champ ou groupe conditionnel est déclenché par l'action de l'utilisateur, jamais automatique

RÈGLE [FORM-R68] : sous `prefers-reduced-motion`, ces apparitions dégradent en **crossfade ou bascule instantanée**, jamais en glissement — les erreurs listées et le champ révélé demeurent, seul le déplacement spatial part.
STATUT : propriété universelle
SOURCE : S19
ÉNONCÉ : Sous la préférence de mouvement réduit, les apparitions du formulaire doivent dégrader en crossfade ou bascule instantanée, sans perte d'information.
MESURE : sous prefers-reduced-motion, les apparitions du formulaire dégradent en crossfade ou bascule instantanée, sans glissement, sans perte d'information

RÈGLE [FORM-R69] : **« le mouvement ne verrouille jamais l'interaction » (`MOTION-UX.md`) — conformité.** L'immobilité des champs pendant `submitting` (table des transitions : « champs non modifiables pendant l'envoi ») est un **verrou métier** — l'anti double-soumission de `BUTTON-UX.md` — **pas** une animation qui retient. Aucune action du formulaire n'attend la fin d'une transition pour redevenir disponible.
STATUT : parti pris d'identité
SOURCE : S19
ÉNONCÉ : Nous distinguons toujours le verrou métier d'un verrou d'animation : aucune interaction n'attend qu'une transition visuelle se termine.
MESURE : aucune action du formulaire n'attend la fin d'une transition visuelle pour redevenir disponible ; seul un verrou métier explicite peut désactiver les champs

> **Pourquoi énoncer la distinction** : c'est la seule ambiguïté possible du pattern. Un formulaire qui gèle « le temps que l'animation finisse » violerait `MOTION-UX.md` ; un formulaire qui gèle « le temps que le serveur réponde » applique l'anti double-activation. Le premier est proscrit, le second requis — les nommer sépare l'un de l'autre.

CONFIANCE : établi — réactif-pas-préventif, continuité et reduced-motion sont normés par `MOTION-UX.md` ; l'orchestration ne fait que nommer les apparitions propres au formulaire (résumé, dépliage).

### Voice — le ton suit le cycle de soumission (langage `VOICE-UX.md`)

RÈGLE [FORM-R70] : chaque état du § « Cycle de soumission » se rattache à une ligne de la table « Le ton suit l'utilisateur » d'`VOICE-UX.md` — le ton n'est pas laissé à l'implémenteur, il découle de l'état émotionnel où le cycle place l'utilisateur :
STATUT : parti pris d'identité
SOURCE : S20
ÉNONCÉ : Nous faisons correspondre chaque état du cycle de soumission à un registre de ton précis, de la routine à la panne assumée.
MESURE : chaque état du cycle de soumission est rédigé dans le registre de ton correspondant défini par la charte éditoriale
  - `idle` → **routine** (clair, direct, discret ; on ne commente pas ce qui va de soi) ;
  - `invalid` → **erreur *de l'utilisateur*** (calme, sans blâme, orienté solution — dire *quoi corriger*, jamais culpabiliser) ;
  - `submitting` → **attente** (rassurant, informatif — « Envoi en cours… ») ;
  - `success` → **bref, factuel par défaut** ; réchauffé **d'un cran** (chaleureux, ponctuel) **si et seulement si** le moment E-motion est catalogué (renvoi § E-motion ci-dessous et § Exception E-motion de `VOICE-UX.md`) ;
  - `server_error` / `timeout` → **panne système assumée** (honnête, responsable, rassurant — le produit prend la faute à son compte, « Nous n'avons pas pu enregistrer », jamais accuser l'utilisateur d'un bug) ;
  - `partial_success` → **avertissement honnête** (dire ce qui a réussi et ce qui reste, sans le maquiller en succès).

> **Pourquoi** : le cycle de soumission est exactement une trajectoire d'états émotionnels — le rattacher à la table de ton ferme le contresens le plus courant (un `server_error` écrit sur le ton d'un `invalid`, qui accuse l'utilisateur d'un bug système ; ou un `success` sur-célébré hors moment mérité).

CONFIANCE : établi — la table de ton est normée par `VOICE-UX.md` (« ne jamais blâmer », NN/g, GOV.UK) ; le mapping état→ton est une transposition interne cohérente.

### E-motion — un événement, un porteur (langage `EMOTION-UX.md`)

RÈGLE [FORM-R71] : l'état `success` du § Cycle de soumission tombe exactement sur le moment #1 du catalogue d'`EMOTION-UX.md` (« réussite d'un envoi / d'une soumission »). Mais le formulaire **route ce moment, il ne le duplique pas** — « un événement, un porteur » (arbitrage utilisateur 2026-07-21) : la réussite d'un envoi ne s'incarne qu'**une seule fois**, dans un seul porteur, choisi selon une question unique — *la confirmation doit-elle rester consultable ?*
STATUT : parti pris d'identité
SOURCE : S21
ÉNONCÉ : Nous incarnons la réussite d'un envoi dans un seul porteur choisi selon sa consultabilité, jamais dans deux canaux simultanés.
MESURE : le succès d'un envoi n'est incarné que par un seul porteur (alert, toast ou bouton) — jamais deux simultanément pour le même événement
  - **oui — elle doit rester consultable** (un récapitulatif à relire plus tard, un paiement à retrouver) → **alert success in-page PRODUCTIF** qui coiffe ou remplace le formulaire : c'est une confirmation durable, **pas un moment E-motion** (registre productif, aucun instrument illustré ni réchauffement) ;
  - **non / la confirmation est injectée et éphémère** → **toast success illustré** — c'est lui qui **porte le moment** (instrument illustration d'`EMOTION-UX.md`, cf. TOAST-UX § Instrument E-motion) ;
  - **le submit se résout EN PLACE** (pas d'injection, le bouton reste à l'écran) → **SubmitButton « avion en papier »** (premier citoyen d'E-motion) — c'est lui qui **porte le moment**.
  Jamais **deux** incarnations pour le même envoi : un SubmitButton qui célèbre *et* un toast illustré *et* un alert chaleureux sur le même succès, c'est trois fois le même signal — il cesse d'en être un.

RÈGLE [FORM-R72] : **Budget de rareté (`EMOTION-UX.md`) : jamais sur une action réflexe ou à haute fréquence ; un seul moment par séquence utile.** Transposé au formulaire : le moment n'est justifié que sur les contextes à **seuil** (cf. § Risque et contexte) — inscription, première fois, cap/accomplissement franchi. **Jamais** sur une recherche, des paramètres sauvés, un autosave ou un envoi répété (un formulaire soumis 40 fois par jour) : sur ceux-là `success` reste au registre productif — ton bref/factuel, aucun instrument E-motion.
STATUT : parti pris d'identité
SOURCE : S21
ÉNONCÉ : Nous réservons tout moment de célébration aux contextes à seuil et ne l'utilisons jamais sur une action répétitive ou réflexe.
MESURE : aucun instrument de célébration n'est utilisé sur une recherche, des paramètres sauvés, un autosave ou un envoi répété plusieurs fois par jour

RÈGLE [FORM-R73] : **Contrat de repli inviolable (hérité d'`EMOTION-UX.md`) : l'animation ne porte jamais l'information ; sous `prefers-reduced-motion` le moment dégrade vers le fait instantané, sans perte.** Quel que soit le porteur choisi, le succès vit d'abord dans l'ARIA et le statique (`role="status"` de l'alert/toast, nouveau titre de page pour une redirection, « Envoyé ✓ » du bouton) — l'utilisateur sensible au mouvement perd la *fête*, jamais le *fait*.
STATUT : propriété universelle
SOURCE : S21
ÉNONCÉ : L'information de succès doit toujours rester disponible par un canal statique et annoncé, que l'animation ne porte jamais seule.
MESURE : le succès reste disponible via ARIA et le texte statique indépendamment de toute animation

> **Pourquoi router plutôt que dupliquer** : chaque porteur est légitime dans son contexte, mais les trois répondent au *même* événement — les cumuler contredit frontalement le budget de rareté (« un moment qui se répète cesse d'être expressif »). Le formulaire est l'orchestrateur du temps : c'est à lui de trancher lequel porte, une fois.

CONFIANCE : établi pour le repli et l'héritage d'accessibilité (WCAG ; `EMOTION-UX.md`/`MOTION-UX.md`) ; « un événement, un porteur » et le routage selon la consultabilité sont un arbitrage d'identité interne (2026-07-21), cohérent avec le budget de rareté et avec TOAST-UX (§ Instrument E-motion).

## Risque et contexte — la friction suit le coût de l'erreur

RÈGLE [FORM-R74] : le niveau de friction (validation, confirmation, récapitulation) se calibre sur le **coût réel d'une erreur** dans ce formulaire, jamais uniformément :
STATUT : parti pris d'identité
SOURCE : S7,S10
ÉNONCÉ : Nous calibrons le niveau de friction sur le coût réel d'une erreur dans le contexte précis du formulaire, jamais uniformément.

| Contexte | Coût d'une erreur | Friction adaptée |
|---|---|---|
| Recherche | Nul (on relance) | Aucune — pas de résumé d'erreurs, submit implicite (Entrée), formulaire dégénéré à un champ |
| Contact, création rapide d'un objet | Faible | Validation au submit, correction simple ; undo plutôt que confirmation (BUTTON-UX.md) |
| Inscription | Moyen | Validation au blur sur les champs de format, indication des contraintes avant saisie |
| Paramètres | Moyen (réversible) | Soumission explicite ou autosave — jamais les deux ambigus sur le même écran |
| Authentification | Moyen + accessibilité critique | Pas de test cognitif (copier-coller autorisé, pas de puzzle) — WCAG 2.2, 3.3.8 AA ; champ mot de passe : INPUT-UX.md |
| Paiement, engagement juridique | Élevé, difficilement réversible | Récapitulation vérifiable + confirmation explicite — WCAG 3.3.4 AA : réversible, vérifié ou confirmé. Champs carte : INPUT-UX.md (iframe PCI) |
| Données sensibles / médicales | Élevé (confidentialité) | Ne collecter que le nécessaire ; pas de validation-espion (pas d'aller-retour serveur sur une donnée sensible avant soumission explicite) ; consentement distinct |
| Consentement | Élevé (légal) | Cases jamais pré-cochées, une case par finalité, options de poids visuel égal (BUTTON-UX.md, bannières). **Autorité selon le contexte** : à l'inscription, l'extension `creation-compte-consentement` fait autorité (CGU/confidentialité/marketing dégroupés) ; `form-sensitive-data` ne couvre le consentement que lorsqu'il est **lié à des données sensibles ou à un paiement** — ne jamais charger les deux extensions pour un même consentement (cf. DECISIONS.md 2026-07-16). |
| Suppression | Critique | Paliers de friction de BUTTON-UX.md (coût de recréation) — le formulaire orchestre, le bouton porte le mécanisme |

RÈGLE [FORM-R75] : WCAG 3.3.4 (niveau AA) n'est pas un conseil de style — pour les engagements juridiques, financiers ou la modification de données contrôlées par l'utilisateur, la soumission doit être réversible, vérifiée ou confirmée. La récapitulation multi-étapes (cf. section dédiée) est le mécanisme standard.
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Pour tout engagement juridique ou financier, la soumission doit être réversible, vérifiée ou confirmée.
MESURE : pour un engagement juridique, financier ou une modification de données contrôlées par l'utilisateur, la soumission est réversible, vérifiée ou confirmée

CONFIANCE : établi pour 3.3.4/3.3.7/3.3.8 (critères WCAG, niveau AA) ; la table de calibrage est une décision interne dans la continuité de la règle transversale du système.

## Risque

RÈGLE [FORM-R76] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce tableau récapitule les principaux risques du pattern formulaire et leur sévérité, sans énoncer de règle de conception supplémentaire.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Focus non géré après échec de soumission (SPA) | Utilisateur lecteur d'écran perdu, aucune annonce | Critique |
| Valeurs perdues après une erreur (validation, serveur ou timeout) | Double saisie punitive, abandon, défiance durable | Critique |
| Limite de temps imposée sans avertissement ni prolongation | Perte de saisie et de la tâche à l'expiration (WCAG 2.2.1) | Élevée |
| Bouton désactivé sans explication comme mécanisme de validation | Confusion, abandon, exclusion accessibilité | Élevée |
| Erreur serveur muette ou déguisée en erreur de champ | Correction impossible, abandon | Élevée |
| Absence de résumé d'erreurs sur formulaire long | Correction fastidieuse, abandon | Moyenne |
| Soumission longue sans annonce (spinner seul) | Lecteur d'écran sans feedback, double soumission tentée | Moyenne |
| Convention "requis" incohérente d'un formulaire à l'autre du produit | Confusion cumulative | Faible à moyenne |
| Erreur obsolète qui survit à la correction (résumé jamais recalculé) | Défiance, formulaire "cassé" aux yeux de l'utilisateur | Moyenne |

## Règle transversale

RÈGLE [FORM-R77] : toujours la même logique que pour le bouton et l'input, appliquée au niveau du formulaire cette fois — **la friction doit informer, jamais bloquer silencieusement.**
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous appliquons au formulaire le même principe qu'au bouton et au champ : la friction doit informer, jamais bloquer silencieusement.
MESURE : aucun blocage d'interaction (bouton désactivé, soumission silencieuse, formulaire vidé) ne se produit sans indication visible de sa cause

> **Pourquoi** : un bouton désactivé sans raison visible, un résumé d'erreurs absent, un submit qui échoue en silence et un formulaire vidé après erreur sont quatre formes du même problème — l'utilisateur est arrêté sans savoir pourquoi, ou puni sans avoir fauté.

## Sources et niveau de confiance
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Résumé d'erreurs avec liens d'ancre, role="alert", messages exacts repris | WCAG 3.3.1, techniques G83/G85/G139 ; GOV.UK error summary (normatif chez eux) | Établi |
| S2 | Message d'erreur associé via aria-describedby | WCAG 3.3.1, 1.3.1 | Établi |
| S3 | Focus déplacé vers le résumé (formulaire long) ou le premier champ (formulaire court) | Convergence Deque, WebAIM, W3C ; GOV.UK (auto-focus du résumé) | Établi par consensus d'experts accessibilité |
| S4 | Titre de page préfixé "Erreur :" après échec | GOV.UK validation pattern + tutoriel W3C/WAI (convergents) | Convergence forte |
| S5 | Conservation des saisies après échec | GOV.UK validation pattern (explicite) | Établi |
| S6 | Contraintes expliquées avant la saisie | WCAG 3.3.2 (niveau A) | Établi |
| S7 | Récapitulation/confirmation pour engagement juridique/financier | WCAG 3.3.4 (niveau AA) ; GOV.UK check answers | Établi — critère, pas un style |
| S8 | Ne pas redemander une info déjà saisie dans le parcours | WCAG 2.2 — 3.3.7 (niveau A) ; GOV.UK "ask once" | Établi |
| S9 | Limites de temps contrôlables, averties, données conservées | WCAG 2.2 — 2.2.1 Timing Adjustable (niveau A) | Établi — critère |
| S10 | Pas de test cognitif à l'authentification | WCAG 2.2 — 3.3.8 (niveau AA) | Établi |
| S11 | Fieldset/legend pour les groupes logiques | WCAG 1.3.1 ; GOV.UK question pages | Établi |
| S12 | Timing de validation : submit-only vs blur | GOV.UK (submit only, problèmes du blur documentés) ↔ Carbon (blur) | Divergence documentée entre systèmes — décision par formulaire, interne |
| S13 | Convention requis/optionnel : marquer la minorité | GOV.UK (jamais d'astérisque, marquer l'optionnel) ↔ Carbon (règle de majorité) ↔ Material (astérisque) | Convergence partielle — décision interne calibrée sur la proportion |
| S14 | Indicateur "requis" combiné visuel + attribut required/aria-required | WCAG, pattern largement documenté | Établi |
| S15 | Déconseiller le bouton désactivé comme mécanisme de validation | Tendance récente de l'industrie ; Carbon documente encore l'inverse sur formulaire court | Émergent — pas un consensus, position assumée |
| S16 | Étapes : retour sans perte, progression testée avant d'être ajoutée | GOV.UK question pages (recherche documentée) | Établi (retour) / convergence (progression) |
| S17 | Machine à états formalisée, partial_success, annulation, autosave, validation croisée, sort des valeurs masquées | Aucun système benchmarké ne les documente | Non formalisé — raisonnement de mécanisme, structure interne |
| S18 | Orchestration des rôles : submit=Agir, « Modifier »=Naviguer, ajout=Agir secondaire, résumé/message=Comprendre un état ; formulaire assemblé passe le Test de reconnaissance | `INTERACTION-UX.md` § Les six intentions (WCAG 3.2.4) | Établi — mapping rôle→composant normé, appliqué au pattern |
| S19 | Apparitions orchestrées : résumé réactif (jamais préventif), dépliage conditionnel = continuité, reduced-motion en crossfade, verrou métier ≠ verrou d'animation | `MOTION-UX.md` (réactif/continuité/reduced-motion/« ne verrouille jamais ») | Établi — langage motion appliqué aux apparitions du formulaire |
| S20 | Cycle de soumission → ton : idle=routine, invalid=erreur utilisateur, submitting=attente, success=factuel ou chaleureux si moment catalogué, server_error=panne assumée, partial_success=warning honnête | `VOICE-UX.md` § Le ton suit l'utilisateur (+ § Exception E-motion) | Établi — table de ton normée, mapping état→ton interne |
| S21 | Un événement, un porteur : le succès porté une seule fois (alert productif si consultable / toast illustré si injecté / SubmitButton si résolu en place), jamais deux ; moment réservé aux contextes à seuil | `EMOTION-UX.md` (catalogue moment #1, budget de rareté, contrat de repli) ; arbitrage utilisateur 2026-07-21 | Repli établi (WCAG) ; routage « un porteur » = décision interne |

## À approfondir
- **Upload de fichier** : progression, annulation, reprise — composant absent du système, signalé hors périmètre dans l'inventaire.
- **Captcha / anti-robot** : tension frontale avec 3.3.8 — à traiter si un consommateur en a besoin, avec les alternatives accessibles.
- **Recherche à facettes** (formulaire permanent à soumission implicite) : recoupe l'intention Collection — frontière à trancher quand le pattern collection existera.
