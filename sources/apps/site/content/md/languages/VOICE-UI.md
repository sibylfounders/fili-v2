---
component: voice
layer: ui
type: language
version: 1.2.0 # 1.2.0 : gabarit « succès » et règle « pas de point d'exclamation » assortis de l'exception E-motion (cf. VOICE-UX.md § Exception E-motion, 1.3.0) — sans ce renvoi, la mécanique interdisait toute célébration y compris sur un moment catalogué par EMOTION-UX.md. 1.1.0 : Voice devient un langage de premier niveau, distinct des fondations typographiques qu'il emploie. 1.0.0 : première rédaction — la couche "concrète" de la voix : lexique contrôlé, mécaniques d'écriture (casse, ponctuation, nombres, dates), gabarits de messages. Ne définit AUCUN token de valeur (aucun hex/px) ; référence typography.label, typography.body, measure.reading-max de DESIGN.md — un besoin de valeur nouvelle passerait d'abord par DESIGN.md
last_updated: 2026-07-20
companion: VOICE-UX.md
confidence: mixed # capitalisation sentence-case, chiffres pour les données et texte de lien signifiant sont établis par convergence ; le lexique exact (mots préférés/bannis) est une décision d'identité interne, amenée à s'étendre avec les surfaces
---

# Voix & ton — Couche UI (langage)

> La couche concrète et changeante de la voix : les mots exacts, la casse, la ponctuation, les formats de nombres et de dates, les gabarits de messages. Le raisonnement (voix constante / ton variable, le mot comme canal fiable, ne jamais blâmer) vit dans `VOICE-UX.md`. Cette couche est celle qui **bouge avec la marque ou le produit** — comme les valeurs hex de DESIGN.md, elle peut être remplacée sans toucher aux principes. Aucune valeur nouvelle n'est définie ici : les longueurs et styles référencent `DESIGN.md` par nom de token.

## Ce que cette couche ne fait pas

RÈGLE [VOICE-U01] : **elle ne redéfinit pas le wording des composants.** Les libellés de bouton (BUTTON-UX § Wording), les messages d'erreur de champ (INPUT-UX), les contenus par tone de l'alert (ALERT-UX) restent la propriété de ces fichiers. Cette couche fournit le **cadre mécanique commun** (casse, ponctuation, gabarits) qu'ils appliquent tous. En cas de divergence, le fichier du composant fait autorité sur *son* libellé, ce langage sur la *mécanique*.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le langage fournit la mécanique commune d'écriture — casse, ponctuation, gabarits — sans redéfinir le wording des composants : en cas de divergence, le composant fait autorité sur son libellé et le langage sur la mécanique.

## Mécaniques d'écriture

### Capitalisation

RÈGLE [VOICE-U02] : **sentence case partout par défaut** — une majuscule au premier mot, le reste en minuscules (« Enregistrer les modifications », pas « Enregistrer Les Modifications »). Titres, boutons, labels, menus : sentence case. Le Title Case anglo-saxon n'est pas utilisé (il n'existe pas en français et nuit à la lisibilité).
STATUT : propriété universelle
SOURCE : T1, T9, T10, T18
ÉNONCÉ : Les titres, boutons, labels et menus s'écrivent en sentence case : une majuscule au premier mot, le reste en minuscules hors noms propres.
MESURE : aucun libellé ne porte de majuscule initiale sur un mot autre que le premier, hors nom propre et sigle

RÈGLE [VOICE-U03] : **les CAPITALES sont réservées aux étiquettes** rendues avec `typography.label` (pastilles, badges, kickers) — jamais une phrase, jamais un libellé d'action. Une capitale isolée porte un nom propre ou un sigle, rien d'autre.
STATUT : parti pris d'identité
SOURCE : T10, interne
ÉNONCÉ : Les capitales sont réservées aux étiquettes rendues avec le style de label (pastilles, badges, kickers) et ne portent jamais une phrase ni un libellé d'action.
MESURE : aucune phrase ni libellé d'action rendu en capitales

### Ponctuation

RÈGLE [VOICE-U04] : **pas de point final** sur un libellé court, un label, un titre ou un bouton. Le point revient dès qu'il y a **au moins deux phrases** ou une phrase complète d'aide/d'erreur.
STATUT : propriété universelle
SOURCE : T3, T11, T18
ÉNONCÉ : Un libellé court, un label, un titre ou un bouton ne se termine pas par un point ; la ponctuation finale revient dès qu'il y a une phrase complète d'aide ou d'erreur, ou au moins deux phrases.
MESURE : aucun point final sur un libellé d'une seule phrase courte

RÈGLE [VOICE-U05] : **« … » (points de suspension)** sur une action qui ouvre une étape supplémentaire avant de s'exécuter (« Exporter… » ouvre un choix de format) ; jamais sur une action qui agit immédiatement (« Enregistrer »).
STATUT : propriété universelle
SOURCE : T3, T18
ÉNONCÉ : Les points de suspension signalent une action qui demande une étape supplémentaire avant de s'exécuter et ne figurent jamais sur une action qui agit immédiatement.
MESURE : les points de suspension n'apparaissent que sur les actions différées

RÈGLE [VOICE-U06] : **ponctuation française** — espace insécable avant `: ; ! ?` et à l'intérieur des guillemets français `« … »` ; pas de guillemets droits `"` en contenu. (Frontière : dans les blocs de code/données rendus en `label-mono`, la ponctuation ASCII est conservée telle quelle.)
STATUT : propriété universelle
SOURCE : T4
ÉNONCÉ : La ponctuation suit la norme typographique française — espace insécable avant les deux-points, le point-virgule, le point d'exclamation et le point d'interrogation, guillemets français en contenu — la ponctuation ASCII n'étant conservée que dans les blocs de code et de données.
MESURE : aucun guillemet droit en contenu ; espace insécable avant : ; ! ? hors blocs de code

RÈGLE [VOICE-U07] : **pas de point d'exclamation** dans l'UI produit, sauf rare message de bienvenue — c'est la marque du registre expressif (VOICE-UX : productif, pas expressif). Un succès se ponctue d'un point, pas d'un « ! ». Exception unique : le microcopy de résolution d'un moment E-motion catalogué (VOICE-UX § Exception E-motion) peut porter un « ! » ou un émoji ponctuel — jamais un message d'erreur, jamais une action destructive.
STATUT : parti pris d'identité
SOURCE : T7
ÉNONCÉ : Le point d'exclamation est proscrit dans l'interface produit, hors message de bienvenue rare et hors microcopy de résolution d'un moment E-motion catalogué.
MESURE : aucun point d'exclamation hors des exceptions déclarées

### Nombres

RÈGLE [VOICE-U08] : **chiffres, pas lettres, pour toute donnée** (« 3 résultats », pas « trois résultats ») — un chiffre s'accroche à l'œil qui scanne (GOV.UK). Les lettres restent pour un usage rhétorique en prose, hors data.
STATUT : propriété universelle
SOURCE : T2, T9, T19
ÉNONCÉ : Toute donnée numérique s'écrit en chiffres et non en lettres, les lettres restant réservées à un usage rhétorique hors données.
MESURE : toute valeur de donnée est rendue en chiffres

RÈGLE [VOICE-U09] : **format localisé** — séparateur de milliers par espace insécable (`12 500`), virgule décimale (`3,5 %`), espace insécable avant l'unité et le symbole `%` `€`. Ne jamais coder ces formats en dur dans une chaîne : ils changent de langue en langue (renvoi VOICE-UX : traduisibilité).
STATUT : propriété universelle
SOURCE : T8, T12
ÉNONCÉ : Les nombres suivent le format de la locale — séparateur de milliers par espace insécable, virgule décimale, espace insécable avant l'unité et le symbole — et ce format n'est jamais codé en dur dans une chaîne : il est délégué au formatage sensible à la locale.
MESURE : aucun format de nombre codé en dur dans une chaîne d'interface

### Dates et heures

RÈGLE [VOICE-U10] : **date explicite, jamais ambiguë** — « 12 juillet 2026 » ou « 12/07/2026 » (jamais un format où JJ/MM et MM/JJ se confondent selon la locale). Le format long est préféré partout où la place le permet.
STATUT : propriété universelle
SOURCE : T20
ÉNONCÉ : Une date affichée n'est jamais ambiguë entre les conventions de locale, et le format long avec le mois nommé est préféré partout où la place le permet.

RÈGLE [VOICE-U11] : **le relatif est borné** — « il y a 3 min », « hier » sont admis jusqu'à ~24-48 h ; au-delà, date absolue. Un relatif toujours doublé de l'absolu en `title`/`datetime` pour l'accessibilité et le survol.
STATUT : propriété universelle
SOURCE : T13, T20
ÉNONCÉ : Le temps relatif n'est employé qu'en deçà de 24 à 48 heures, au-delà desquelles la date absolue s'affiche, et tout horodatage relatif est doublé de la date absolue dans sa valeur machine.
MESURE : tout horodatage relatif porte la date absolue en attribut datetime ou title

### Longueur et troncature

RÈGLE [VOICE-U12] : la prose de lecture suit `measure.reading-max` (**70ch**, TYPOGRAPHY) — au-delà, la mesure casse. Les libellés d'action restent courts (verbe + objet) ; une troncature par ellipsis ne masque jamais une information décisive (le nom complet reste accessible en `title`/tooltip).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La prose de lecture ne dépasse pas la mesure de lecture maximale du système, les libellés d'action restent courts, et une troncature ne masque jamais une information décisive, dont la version complète reste accessible.
MESURE : la prose de lecture ne dépasse pas measure.reading-max ; le texte tronqué reste disponible en entier via title ou tooltip

## Lexique contrôlé (noyau)

RÈGLE [VOICE-U13] : **un concept = un mot.** Noyau de départ, à étendre avec les surfaces (VOICE-UX : cohérence). La colonne « on évite » n'est pas une liste de synonymes interdits en soi — c'est l'engagement à ne pas *mélanger* les deux pour la même action.
STATUT : parti pris d'identité
SOURCE : T7
ÉNONCÉ : Le lexique du produit fixe un mot unique par concept, l'engagement portant sur le fait de ne pas mélanger deux désignations pour la même action plutôt que d'interdire des synonymes en soi.

| Concept | On dit | On évite |
|---|---|---|
| Valider/sauver une saisie | **Enregistrer** | Sauvegarder, Soumettre, Valider (ambigu : valider = confirmer ?) |
| Détruire définitivement | **Supprimer** | Effacer, Retirer, Nettoyer |
| Retirer d'une liste sans détruire | **Retirer** | Supprimer (réservé au destructif) |
| Abandonner sans enregistrer | **Annuler** | Quitter, Fermer, Abandonner |
| Confirmer une action | **Confirmer** | OK, Valider, Oui |
| Envoyer un formulaire | verbe de la conséquence (**Créer le compte**, **Payer**) | Soumettre, Envoyer, OK (BUTTON-UX § Wording) |
| Politesse | ton direct, pas d'injonction | « Veuillez… » systématique, « Merci de… » |
| Excuse (erreur système) | « Nous n'avons pas pu… » | « Oups ! », « Aïe », emoji |

RÈGLE [VOICE-U14] : **pas de « Oups », d'emoji, ni d'exclamation** dans les messages d'erreur — un incident se traite avec calme, pas avec une fausse légèreté qui minimise le problème de l'utilisateur (VOICE-UX : ton système honnête).
STATUT : propriété universelle
SOURCE : T6, T16
ÉNONCÉ : Un message d'erreur ne porte ni interjection de fausse légèreté, ni emoji, ni point d'exclamation : un incident se traite avec calme et ne se minimise pas.
MESURE : aucun emoji, interjection (« Oups », « Aïe ») ni point d'exclamation dans un message d'erreur

## Gabarits de messages

RÈGLE [VOICE-U15] : **message d'erreur = ce qui s'est passé + pourquoi + comment corriger.** Gabarit partagé par l'erreur mono-champ (INPUT) et l'erreur globale (ALERT), toujours sans blâme :
STATUT : propriété universelle
SOURCE : T6, T15
ÉNONCÉ : Un message d'erreur énonce ce qui s'est passé, pourquoi et comment corriger, sans attribuer de faute à la personne, et fournit la correction dès qu'elle est connue.
MESURE : tout état d'erreur est décrit en texte et propose la correction attendue quand elle est connue
> *« Le format attendu est JJ/MM/AAAA. »* — dit la correction, pas la faute.
> *« Nous n'avons pas pu enregistrer vos modifications. Vérifiez votre connexion et réessayez. »* — le produit assume + issue.

RÈGLE [VOICE-U16] : **succès (routinier) = confirmation + libération.** Bref, factuel, au passé accompli : *« Modifications enregistrées. »* Pas de félicitation, pas de « ! ».
STATUT : parti pris d'identité
SOURCE : T7
ÉNONCÉ : Un succès routinier se confirme brièvement et au passé accompli, sans félicitation ni point d'exclamation.

RÈGLE [VOICE-U17] : **succès (moment E-motion catalogué) = seule exception au gabarit ci-dessus.** Le microcopy de résolution peut se réchauffer d'un cran (*« C'est parti ✈️ »* plutôt que *« Envoyé »*) — uniquement sur les moments du catalogue d'EMOTION-UX.md, jamais par défaut (renvoi VOICE-UX § Exception E-motion).
STATUT : parti pris d'identité
SOURCE : T7
ÉNONCÉ : Le microcopy de résolution d'un moment E-motion catalogué est la seule exception au gabarit de succès et peut se réchauffer d'un cran, jamais par défaut.

RÈGLE [VOICE-U18] : **état vide = situation + première action.** Distinguer *« Aucun résultat pour « … ». Essayez d'élargir votre recherche. »* (rien trouvé) de *« Vous n'avez pas encore de projet. Créez le premier. »* (rien encore) — renvoi CARD (empty state).
STATUT : propriété universelle
SOURCE : T14
ÉNONCÉ : Un état vide énonce la situation et pointe la première action qui la comble, en distinguant l'absence de résultat d'une recherche de l'absence de contenu encore créé.

RÈGLE [VOICE-U19] : **confirmation destructive = conséquence nommée + libellé qui dit l'action.** *« Supprimer ce projet ? Cette action est irréversible. »* + bouton **Supprimer** (pas « OK »). La friction se calibre sur le coût réel (renvoi BUTTON destructive / FORM-sensitive-data).
STATUT : propriété universelle
SOURCE : T11, T17
ÉNONCÉ : Une confirmation destructive nomme la conséquence exacte de l'action, et son bouton porte le verbe de cette action plutôt qu'une formule générique.
MESURE : aucun bouton de confirmation destructive libellé « OK » ou « Oui »

RÈGLE [VOICE-U20] : **attente = ce qui se passe, au présent progressif.** *« Enregistrement… »*, *« Vérification du paiement… »* — le mot double l'indicateur visuel (MOTION), il ne le remplace pas.
STATUT : parti pris d'identité
SOURCE : T7
ÉNONCÉ : Un état d'attente énonce au présent progressif ce qui est en train de se passer, le mot doublant l'indicateur visuel sans le remplacer.

## Tokens référencés (aucun défini ici)

| Besoin | Token (DESIGN.md) | Fichier faisant autorité |
|---|---|---|
| Mesure de lecture de la prose | `measure.reading-max` (70ch) | TYPOGRAPHY-UI |
| Style des étiquettes en CAPITALES | `typography.label` (Inter) | TYPOGRAPHY-UI / DESIGN.md |
| Corps de texte courant | `typography.body` | TYPOGRAPHY-UI |
| Données techniques (codes, tokens cités) | `typography.label-mono` | TYPOGRAPHY-UI |

RÈGLE [VOICE-U21] : cette couche n'introduit **aucune valeur brute**. Si un besoin de valeur apparaît (ex. une longueur maximale de libellé chiffrée), il passe d'abord par `DESIGN.md` avec montée de version — guardrail commun à tous les `*-UI.md`.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La couche mécanique du langage n'introduit aucune valeur brute : tout besoin de valeur nouvelle passe d'abord par le fichier de tokens, avec montée de version.
MESURE : aucune valeur brute (hex, px, ch) définie dans ce fichier

## Consommation par les composants

| Consommateur | Ce que le langage lui fournit | Ce qu'il garde en propre |
|---|---|---|
| Bouton (BUTTON-UI/UX) | Casse, ponctuation, « … », lexique des libellés | Le wording exact (verbe + conséquence) |
| Input (INPUT-UX) | Gabarit d'erreur (quoi/pourquoi/comment), ton sans blâme | Les messages par type de champ, le « Erreur » d'accessibilité |
| Alert (ALERT-UX) | Ton par état, gabarits succès/erreur/info | Le contenu par tone, la persistance |
| Form (FORM-UX) | Ton du cycle de soumission, résumé d'erreurs | L'orchestration (timing, focus, ancres) |
| Card (CARD-UX) | Gabarit d'état vide | Le déclenchement de l'empty state / skeleton |

RÈGLE [VOICE-U22] : chaque composant applique la **mécanique** de cette couche et garde l'**autorité** sur son wording — divergence assumée, sur le modèle exact de COLOR-UI (« chaque composant nomme le registre danger selon ce qu'il signifie pour lui »).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Chaque composant applique la mécanique du langage et conserve l'autorité sur son propre wording.

## Vérifiabilité

RÈGLE [VOICE-U23] : **la voix ne se teste pas automatiquement — c'est une exigence de revue.** Comme la redondance (COLOR 1.4.1) que `test-rendu.js` ne calcule pas, le ton, l'absence de blâme et la cohérence lexicale se vérifient à l'œil. Ce que l'outillage *peut* attraper (candidats, non implémentés à ce jour) : présence de mots bannis (« Oups », « cliquez ici », emoji dans un message d'erreur), point final sur un libellé court, guillemets droits en contenu — un lint de contenu à ajouter à `valide-dossier.js` le jour venu.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La conformité de la voix relève de la revue humaine et non du test automatique ; seuls quelques marqueurs — mots bannis, point final sur libellé court, guillemets droits — sont candidats à un lint de contenu.

RÈGLE [VOICE-U24] : limite assumée — le lexique de cette v1.0.0 est un **noyau** (les concepts déjà consommés par les 4 composants + le form). Il s'étend au fil des surfaces, pas d'avance (principe « un token/un mot naît d'un besoin réel »).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le lexique publié est un noyau limité aux concepts déjà consommés par les surfaces existantes, et il s'étend au fil des besoins réels plutôt que par anticipation.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Sentence case par défaut, pas de Title Case | [Shopify Polaris — Grammar & mechanics](https://polaris.shopify.com/content/grammar-and-mechanics), [GOV.UK — style guide (capitalisation)](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style) | Établi par convergence |
| T2 | Chiffres pour les données, pas les lettres | [GOV.UK — numbers](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#numbers) | Établi — recherche utilisateur |
| T3 | Pas de point sur les libellés courts ; « … » pour action différée | [Apple HIG — Writing](https://developer.apple.com/design/human-interface-guidelines/writing), [Microsoft — Text in UI](https://learn.microsoft.com/style-guide/) | Établi par convergence |
| T4 | Ponctuation française (espaces insécables, guillemets `« »`) | [Lexique des règles typographiques (Imprimerie nationale)](https://fr.wikipedia.org/wiki/Lexique_des_r%C3%A8gles_typographiques_en_usage_%C3%A0_l%27Imprimerie_nationale) | Établi — norme typographique FR |
| T5 | Date non ambiguë, relatif borné et doublé | [NN/g — Timestamps](https://www.nngroup.com/articles/timestamps/) | Établi |
| T6 | Gabarit d'erreur quoi/pourquoi/comment, sans blâme | [NN/g — Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/), INPUT-UX | Établi |
| T7 | Lexique contrôlé (mots exacts) | Décision d'identité interne — noyau extensible | Décision de conception, non empirique |
| T8 | Formats non codés en dur (i18n) | [W3C — Text size in translation](https://www.w3.org/International/articles/article-text-size) | Établi — bonne pratique i18n |
| T9 | « Always use sentence case, even in page titles and service names » ; ne pas employer de capitales en bloc pour de grandes quantités de texte ; écrire les nombres en chiffres ; développer toute abréviation à sa première occurrence | [GOV.UK — A to Z style guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide) | Établi. **Note de maintenance** : l'URL citée en T1 et T2 (www.gov.uk/guidance/style-guide/…) renvoie désormais une redirection 302 vers cette adresse |
| T10 | « Microsoft style uses sentence-style capitalization » — première lettre du premier mot et noms propres seulement, y compris pour un libellé d'interface ; « don't use all uppercase for emphasis » | [Microsoft Writing Style Guide — Capitalization](https://learn.microsoft.com/en-us/style-guide/capitalization) | Établi — guide d'écriture public, converge avec GOV.UK (T9) et GNOME (T18) |
| T11 | « Skip the punctuation (exceptions: questions or text with 2+ sentences) » ; « be direct » et commencer par un verbe pour que le libellé se lise comme une instruction actionnable | [Shopify Polaris — Content fundamentals](https://polaris-react.shopify.com/content/fundamentals) | Établi par convergence — formulation quasi identique à la règle interne sur le point final |
| T12 | Le séparateur de milliers, la virgule décimale, le pourcentage et la devise dépendent de la locale et se délèguent au formatage sensible à la langue plutôt qu'à une chaîne écrite en dur | [MDN — Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) | Établi — API standardisée documentée par MDN |
| T13 | L'attribut datetime de l'élément time porte la valeur machine exacte pendant que l'utilisateur lit une forme humaine ou relative, ce qui la rend exploitable par les technologies d'assistance et les outils | [MDN — <time>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time) | Établi — élément HTML standard documenté par MDN |
| T14 | Un état vide ne reste jamais totalement vide : il dit ce qui pourrait s'y afficher, comment le remplir, et offre un chemin direct vers la tâche qui le comble | [NN/g — Designing Empty States in Complex Applications](https://www.nngroup.com/articles/empty-state-interface-design/) | Établi — recherche appliquée. **Limite** : la source ne distingue pas « rien trouvé » de « rien encore » ; cette distinction est un raffinement interne |
| T15 | L'erreur détectée est identifiée et décrite en texte (3.3.1, A) et la suggestion de correction est fournie quand elle est connue (3.3.3, AA) | [WCAG 2.2 — 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) ; [WCAG 2.2 — 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) | Établi, standards d'accessibilité (A et AA) — adosse le gabarit d'erreur de cette couche |
| T16 | Le ton des messages d'erreur est économique et direct, souvent en phrases courtes plutôt qu'en phrases complètes | [Carbon Design System — Content overview](https://carbondesignsystem.com/guidelines/content/overview/) | Établi par convergence avec NN/g (T6, « avoid humor since it can become stale ») — l'interdiction du calembour et de la fausse légèreté en erreur est partagée ; l'interdiction de l'emoji en propre reste un parti pris interne |
| T17 | Les libellés décrivent le sujet ou la finalité (2.4.6, AA) et le nom accessible contient le texte visible du libellé (2.5.3, A) — un bouton de confirmation doit donc nommer l'action | [WCAG 2.2 — 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) ; [WCAG 2.2 — 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) | Établi, standards d'accessibilité (AA et A) |
| T18 | « Use an ellipsis (…) at the end of a label if further input or confirmation is required from the user before the action can be carried out » ; capitalisation en sentence case ; « text generally shouldn't end with a period » | [GNOME Human Interface Guidelines — Writing style](https://developer.gnome.org/hig/guidelines/writing-style.html) | Établi — troisième guide de plateforme public confirmant simultanément l'ellipse, la sentence case et l'absence de point final (avec T10 et T11) |
| T19 | « In body text, spell out whole numbers from zero through nine, and use numerals for 10 or greater. It's OK to use numerals for zero through nine when you have limited space, such as in tables and UI » | [Microsoft Writing Style Guide — Numbers](https://learn.microsoft.com/en-us/style-guide/numbers) | Établi. **Divergence partielle** : Microsoft écrit zéro à neuf en lettres dans la prose et n'admet les chiffres qu'en interface et en tableau ; GOV.UK (T9) écrit tout en chiffres sauf en début de phrase. La règle interne, restreinte aux données d'interface, tient dans l'intersection des deux |
| T20 | L'ordre jour/mois d'une date tout en chiffres dépend de la locale : la même date rend 12/19/2012 en en-US et 19/12/2012 en en-GB — un format tout-chiffres n'est jamais désambiguïsé par lui-même | [MDN — Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) | Établi — API standardisée documentée par MDN. **Contredit l'exemple de ce fichier** (« 12/07/2026 » donné comme non ambigu) et **remplace T5**, dont l'URL NN/g citée renvoie une erreur 404 |

## À approfondir

- **Lint de contenu** : ajouter à `valide-dossier.js` la détection des mots bannis, du point final sur libellé court, des guillemets droits — le pendant écriture de l'interdiction des hex en dur.
- **Glossaire produit complet** : le lexique ci-dessus est un noyau de 8 concepts ; à étendre avec chaque nouvelle surface.
- **Formats de données avancés** : monnaies multiples, fuseaux horaires, pluriels dépendants de la locale — à traiter si le produit devient multi-régions.
- **Voix hors interface** : e-mails transactionnels, notifications push — mêmes principes, mécaniques propres à définir le jour venu.
