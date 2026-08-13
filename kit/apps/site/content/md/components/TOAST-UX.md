---
component: toast
layer: ux
version: 1.0.1 # 1.0.1 : mention de marque Sibyl → Fili en prose (migration 2026-07-29), aucune règle modifiée. 1.0.0 : première rédaction, adoptée — issue de l'arbitrage utilisateur du 2026-07-20 (tone/actions/empilement/position/instrument illustration tranchés en conversation, cf. § Sources). Composant nommé « candidat naturel de prochaine documentation » par ALERT-UX.md § À approfondir.
last_updated: 2026-07-20
companion: TOAST-UI.md
confidence: mixed
---

# Toast (snackbar) — Couche UX

> Ce fichier contient le raisonnement : tone, timing, actions, empilement, position, instrument
> E-motion. Tokens et technique (animation d'entrée/sortie, valeurs exactes) vivront dans
> `TOAST-UI.md`, à écrire une fois ce fichier validé.

## Note de transposition (à lire en premier)

RÈGLE [TOAST-R01] : les axes du toast sont **tone** uniquement — pas de **persistance** (le toast est temporaire
STATUT : note de méthode
SOURCE : S1, interne
ÉNONCÉ : Le toast n'expose qu'un seul axe, le tone : ni persistance (le caractère temporaire est constitutif du composant), ni style (le contraste suit la gravité), ni size (la largeur est dictée par le contenu et par le conteneur hôte).
MESURE : le composant expose exactement un axe nommé tone
par nature, c'est ce qui le distingue de l'alert), pas de **style** (même raisonnement que l'alert :
le contraste suit la gravité, pas un choix par instance), pas de **size** (largeur dictée par le
contenu et le conteneur qui l'héberge, cf. § Position).

> **Pourquoi** : `ALERT-UX.md` § Note de transposition a déjà posé la frontière — « le toast vit
> au-dessus du flux et dans le temps (superposé, empilable, chronométré, placé par le système et
> non par la page) ». Ce fichier hérite cette frontière, il ne la retranche pas.

## Frontière avec Alert (héritée, formalisée ici en miroir)

RÈGLE [TOAST-R02] : l'alert vit *dans le flux* de la page ; le toast vit *au-dessus*, injecté par le système,
STATUT : note de méthode
SOURCE : S1
ÉNONCÉ : La frontière entre alert et toast est celle déjà posée par ALERT-UX : l'alert vit dans le flux de la page, le toast est injecté par le système au-dessus du flux et toujours de façon réactive ; ce fichier hérite cette frontière sans la redéfinir.
MESURE : aucun toast n'est présent dans le DOM au chargement initial de la page
toujours réactif (jamais chargé avec la page).

RÈGLE [TOAST-R03] : le toast est le territoire du feedback immédiat d'une action qui vient de réussir
STATUT : note de méthode
SOURCE : S2
ÉNONCÉ : Le feedback immédiat d'une action qui vient de réussir relève du toast : ALERT-UX exclut explicitement ce registre de l'alert.
(« Enregistré ✓ ») — le registre qu'`ALERT-UX.md` exclut explicitement de lui-même.

RÈGLE [TOAST-R04] : échelle d'interruption héritée — **alert < toast < modale**. Le toast interrompt
STATUT : note de méthode
SOURCE : S1
ÉNONCÉ : L'échelle d'interruption alert < toast < modale est celle d'ALERT-UX : le toast interrompt l'attention quelques secondes et n'interrompt jamais le geste en cours.
l'attention quelques secondes, jamais le geste en cours.

## But

Un toast confirme qu'une action vient de produire un effet, sans exiger que l'utilisateur s'arrête
pour le lire. Contrairement à l'alert (qui documente une condition qui dure), le toast documente un
**événement qui vient de se produire** — il a une naissance et une mort programmées dès son
apparition.

## Quand l'utiliser / ne pas l'utiliser

RÈGLE [TOAST-R05] : utiliser pour confirmer l'issue immédiate d'une action déclenchée par l'utilisateur
STATUT : propriété universelle
SOURCE : S14, S15, S16
ÉNONCÉ : Le toast confirme l'issue immédiate d'une action déclenchée par l'utilisateur lorsque cette confirmation n'a pas besoin de rester consultable.
(sauvegarde, envoi, suppression, changement de statut) quand cette confirmation n'a pas besoin de
*rester consultable*.

RÈGLE [TOAST-R06] : ne pas utiliser pour une condition qui dure (→ alert) ni pour une décision qui doit bloquer
STATUT : propriété universelle
SOURCE : S14, S15, S16
ÉNONCÉ : Le toast n'est employé ni pour une condition qui dure, ni pour une décision qui doit bloquer l'utilisateur, ni pour du contenu promotionnel.
MESURE : aucun toast n'est émis sans être la conséquence directe d'une action de l'utilisateur
l'utilisateur (→ modale) ni pour du contenu promotionnel.

RÈGLE [TOAST-R07] : cas limite — si la confirmation doit rester visible après que l'utilisateur a quitté des
STATUT : note de méthode
SOURCE : S1, S15
ÉNONCÉ : Une confirmation qui doit rester consultable après que l'utilisateur a quitté l'écran des yeux relève de l'alert success dismissible et non du toast, qui ne conserve aucune trace après sa disparition.
yeux l'écran (ex. un paiement validé, consultable plus tard dans un récapitulatif), c'est un alert
success dismissible, pas un toast : le toast n'a pas de mémoire, une fois parti il est parti.

## Tone

RÈGLE [TOAST-R08] : les 4 tones d'`ALERT-UX.md` sont repris à l'identique — **info / success / warning /
STATUT : parti pris d'identité
SOURCE : S6, T1
ÉNONCÉ : Le toast porte l'un des quatre tones info, success, warning ou danger, identiques à ceux de l'alert ; il n'existe pas de tone neutre.
MESURE : l'énumération des tones vaut exactement info, success, warning, danger
danger**, pas de `neutral` (arbitrage utilisateur 2026-07-20 ; option étudiée de restreindre à
info/success a été écartée).

RÈGLE [TOAST-R09] : **avertissement documenté — danger/warning en toast portent un risque spécifique que
STATUT : parti pris d'identité
SOURCE : S6, S14, S15, S18
ÉNONCÉ : Les tones warning et danger sont autorisés sur un toast à la seule condition que la condition grave dispose d'un répondant durable ailleurs dans l'interface ; un toast n'est jamais l'unique porteur d'un état qui persiste.
MESURE : tout toast de tone danger ou warning s'accompagne d'un changement d'état visible ou d'un alert de relais
l'alert n'a pas.** `ALERT-UX.md` § Risque signale déjà : « Danger dismissible sur condition active →
condition critique masquée, perte de données ou d'échéance → Élevée ». Un toast danger aggrave ce
risque : il ne se ferme pas sur décision de l'utilisateur, il disparaît **de lui-même**, sans qu'un
changement d'état ne le remplace. Ce fichier accepte ce risque par arbitrage explicite (2026-07-20)
plutôt que de l'exclure — charge à chaque consommateur de vérifier qu'une condition grave a un
répondant durable ailleurs (l'objet concerné change visiblement d'état, ou un alert prend le relais)
avant d'utiliser un toast danger comme seul porteur du message.

> **Pourquoi accepter plutôt qu'exclure** : certains événements sont bien des échecs ponctuels
> plutôt que des conditions durables (« L'envoi a échoué, réessayez ») — les cantonner à l'alert
> forcerait un composant plus lourd que l'événement ne le justifie. Le risque n'est pas dans le
> tone, il est dans l'usage d'un toast danger comme *unique* trace d'un état qui, lui, dure.

## Timing (le point le plus sensible du composant)

RÈGLE [TOAST-R10] : un toast qui disparaît après un délai fixe relève de WCAG 2.2.1 (Timing Adjustable) — le
STATUT : propriété universelle
SOURCE : S14, S18, S19, S25
ÉNONCÉ : Le minuteur d'un toast se suspend intégralement au survol du pointeur et au focus clavier, et ne reprend son décompte qu'à leur sortie.
MESURE : le temps restant est identique avant et après une période de survol ou de focus
délai doit être **suspendu au survol et au focus clavier**, et ne reprendre qu'à leur sortie.

RÈGLE [TOAST-R11] : **contrat de repli, décliné du contrat E-motion** — le toast n'est jamais le seul porteur
STATUT : propriété universelle
SOURCE : S9, S14, S15, S18
ÉNONCÉ : Un toast n'est jamais le seul porteur d'une information : l'état qu'il confirme reste lisible dans l'écran sous-jacent après sa disparition.
MESURE : l'information portée par le toast reste atteignable dans l'interface après son expiration
d'une information : sa disparition ne doit jamais effacer une donnée que l'interface ne montre nulle
part ailleurs (l'état qu'il confirme doit rester lisible dans l'écran sous-jacent, même sans le
toast).

RÈGLE [TOAST-R12] : durée de base — pas de valeur nouvelle inventée ici : `BUTTON-UX.md` § Bouton d'annulation
STATUT : parti pris d'identité
SOURCE : S3, S16, S17, S18
ÉNONCÉ : La durée d'affichage d'un toast ne descend jamais sous cinq secondes, qu'il porte une action ou non.
MESURE : durée d'affichage >= 5000 ms
a déjà établi **5-8 secondes minimum** pour une fenêtre de décision réfléchie (pattern undo, IBM
Carbon). Ce fichier reprend cette valeur comme plancher pour tout toast, avec ou sans action —
`TOAST-UI.md` tranchera l'ajustement fin (ex. prolonger selon la longueur du texte).

CONFIANCE : établi pour le principe (WCAG 2.2.1) et pour la valeur plancher (BUTTON-UX.md, IBM
Carbon) ; la formule exacte de prolongation reste à instruire dans `TOAST-UI.md`.

## Actions

RÈGLE [TOAST-R13] : **une action tolérée, jamais deux** (arbitrage utilisateur 2026-07-20 — pattern undo :
STATUT : parti pris d'identité
SOURCE : S6, S15
ÉNONCÉ : Un toast porte au plus une action ; il n'expose jamais une seconde sortie ni un second lien.
MESURE : nombre d'éléments interactifs d'action par toast <= 1
« Élément supprimé — Annuler »). Pas de second lien discret comme sur l'alert : le toast est trop
éphémère pour arbitrer entre deux sorties.

RÈGLE [TOAST-R14] : l'action est soumise à la même suspension de timing que le texte (§ Timing) — sans ça, la
STATUT : parti pris d'identité
SOURCE : S6, S25
ÉNONCÉ : L'action d'un toast est soumise à la même suspension de minuteur que son texte, afin que la fenêtre de décision annoncée reste effective au survol comme au focus clavier.
MESURE : le focus sur l'action suspend le minuteur du toast qui la porte
fenêtre de décision promise par `BUTTON-UX.md` (5-8s) n'est pas fiable au clavier ni au survol.

RÈGLE [TOAST-R15] : cohérence de tone héritée d'`ALERT-UX.md` — l'action décrit ce qu'elle fait
STATUT : note de méthode
SOURCE : S2
ÉNONCÉ : Le libellé de l'action d'un toast décrit l'effet de l'action et non la gravité du message, conformément à la règle de wording déjà posée par ALERT-UX.
(« Annuler »), pas la gravité du toast qui la porte.

## Empilement

RÈGLE [TOAST-R16] : **jusqu'à 2-3 toasts simultanés** (arbitrage utilisateur 2026-07-20 — écarte l'option « 1
STATUT : parti pris d'identité
SOURCE : S6, S14
ÉNONCÉ : Au plus trois toasts sont affichés simultanément.
MESURE : nombre de toasts simultanément visibles <= 3
seul, le nouveau remplace »).

RÈGLE [TOAST-R17] : **ordre d'arrivée, pas gravité décroissante** — divergence assumée avec `ALERT-UX.md`
STATUT : parti pris d'identité
SOURCE : S7, S16
ÉNONCÉ : Une pile de toasts s'ordonne par ordre chronologique d'arrivée et non par gravité décroissante, contrairement à une pile d'alerts qui empile des conditions simultanément vraies.
MESURE : l'ordre d'affichage reproduit l'ordre d'émission
§ Empilement. L'alert empile des *conditions simultanément vraies* (l'ordre par gravité a du sens,
rien ne les rend séquentiels) ; le toast empile des *événements survenus dans le temps* — inverser
un succès et un échec qui viennent de se produire dans le désordre chronologique désorienterait plus
qu'il n'aiderait.

> **Pourquoi une règle différente plutôt qu'un copier-coller** : la nature de ce qui est empilé
> diffère (état vs événement) — le raisonnement d'`ALERT-UX.md` s'applique à la lettre, pas la
> conclusion.

RÈGLE [TOAST-R18] : au-delà de 2-3, le plus ancien sort (FIFO) plutôt que d'agréger — contrairement à l'alert
STATUT : parti pris d'identité
SOURCE : S7
ÉNONCÉ : Lorsque le plafond d'empilement est atteint, le toast le plus ancien sort ; les toasts ne sont jamais agrégés en un message de synthèse.
MESURE : aucun toast ne résume plusieurs événements
(où l'agrégation est toujours préférable), agréger des événements hétérogènes (« 3 actions
récentes ») perdrait le contenu spécifique que chaque toast porte.

CONFIANCE : non formalisé — raisonnement de mécanisme, pas de règle chiffrée publiée trouvée
(même statut que l'empilement de l'alert).

## Position

RÈGLE [TOAST-R19] : **pilotée par Adaptive, pas un ancrage fixe à la fenêtre** (arbitrage utilisateur
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : La position et la largeur d'un toast sont déterminées par l'espace du conteneur qui l'héberge et non par un ancrage fixe à un coin du viewport.
MESURE : aucune valeur de position exprimée en unités de viewport dans la région de toasts
2026-07-20 — cohérent avec `ADAPTIVE-UX.md` : « la fenêtre définit la page, le conteneur définit le
composant »). Le toast adapte position et largeur à l'espace du conteneur qui l'héberge plutôt qu'à
un coin fixe de viewport.

RÈGLE [TOAST-R20] : reste au-dessus du contenu (superposé, jamais dans le flux — cf. § Frontière), l'ancrage
STATUT : note de méthode
SOURCE : interne, S21
ÉNONCÉ : Le toast est superposé au contenu et n'entre jamais dans le flux ; la détermination de l'ancrage précis relève de TOAST-UI et non de cette couche.
précis (quel coin, pleine largeur en état compact) est une décision `TOAST-UI.md`, pas de cette
couche.

## Instrument E-motion — illustration/forme

RÈGLE [TOAST-R21] : le toast est le foyer naturel du moment catalogué **« réussite d'un envoi / d'une
STATUT : parti pris d'identité
SOURCE : S8
ÉNONCÉ : Le moment E-motion « réussite d'un envoi ou d'une soumission » s'incarne dans le toast et non dans l'alert.
soumission »** — c'est exactement l'endroit qu'`ALERT-UX.md` désigne en creux en excluant le
success réactif de lui-même.

RÈGLE [TOAST-R22] : **l'instrument illustration ne s'active que si le toast est seul à l'écran** (arbitrage
STATUT : parti pris d'identité
SOURCE : S6, S8
ÉNONCÉ : L'instrument illustration ne s'active que sur un toast seul à l'écran, jamais sur un toast qui rejoint une pile existante.
MESURE : aucune animation d'instrument déclenchée lorsque le nombre de toasts visibles est supérieur à un
utilisateur 2026-07-20) — jamais sur un toast qui rejoint une pile déjà existante. Cohérent avec le
budget de rareté E-motion (« un moment qui se répète cesse d'être expressif ») : un empilement de
2-3 toasts est par nature une séquence qui se répète, l'exact opposé d'un moment mérité.

RÈGLE [TOAST-R23] : sur un toast danger/warning, l'instrument reste dans le registre productif (icône `◈`
STATUT : note de méthode
SOURCE : S8
ÉNONCÉ : L'exception chaleureuse ne s'applique jamais à un toast danger ou warning, qui reste dans le registre productif ; le moment de récupération s'incarne dans le toast de confirmation qui suit, conformément à la règle « un événement, un porteur » d'ALERT-UX.
standard, pas d'illustration) — l'exception chaleureuse de `VOICE-UX.md`/`EMOTION-UX.md` ne
s'applique jamais à une erreur ou une action destructive, quel que soit le composant qui la porte.
Le moment catalogué « sortie d'une erreur / récupération » ne s'incarne donc pas dans le toast
danger lui-même, mais dans le toast success/info qui **confirme la résolution après coup** — la
distinction déjà faite entre le problème et son soulagement.

## États et comportement

RÈGLE [TOAST-R24] : toujours réactif par nature (jamais chargé avec la page) — doit être annoncé :
STATUT : note de méthode
SOURCE : S5, S11
ÉNONCÉ : Le mapping des rôles live — role="alert" pour danger et warning, role="status" pour info et success — est celui d'ALERT-UX et s'applique au toast sans modification, le toast étant toujours réactif.
MESURE : tout toast porte role=alert ou role=status selon son tone
`role="alert"` pour danger/warning, `role="status"` pour info/success, en miroir exact
d'`ALERT-UX.md`.

RÈGLE [TOAST-R25] : hérite du contrat d'accessibilité motion/E-motion pour son animation d'entrée/sortie — pas
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'animation d'entrée et de sortie du toast est régie par le contrat motion et E-motion déjà établi : pas de clignotement au-delà de trois par seconde, transform et opacity uniquement, dégradation vers une apparition instantanée sous prefers-reduced-motion sans perte d'information.
de flash > 3/s, `transform`/`opacity` uniquement, `prefers-reduced-motion` dégrade vers une
apparition/disparition instantanée sans perte d'information.

RÈGLE [TOAST-R26] : pas d'état hover/focus propre au conteneur — seuls l'action et la fermeture explicite (si
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le conteneur du toast n'expose pas d'état hover ou focus propre, conformément à ALERT-UX ; seuls l'action et la fermeture explicite en exposent.
`TOAST-UI.md` en prévoit une) le sont, en miroir d'`ALERT-UX.md`.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Toast danger seul porteur d'une condition durable | Condition grave disparaît sans successeur, perte silencieuse | Élevée (acceptée, documentée — cf. § Tone) |
| Timing non suspendu au survol/focus | Fenêtre de décision (undo) non fiable, WCAG 2.2.1 non respecté | Élevée |
| Instrument illustration actif sur une pile | Répétition qui banalise le moment, décor gratuit (anti-usage E-motion) | Moyenne |
| Empilement agrégé au lieu de FIFO | Perte du contenu spécifique de chaque événement | Moyenne |
| Toast réactif injecté sans rôle live | Lecteur d'écran jamais informé | Critique |

## Règle transversale

RÈGLE [TOAST-R27] : **le toast confirme un événement passé, il ne doit jamais être le seul endroit où vit une
STATUT : propriété universelle
SOURCE : S9, S14, S18
ÉNONCÉ : Un toast confirme un événement passé et ne peut jamais être le seul endroit où vit une information qui compte encore.
information qui compte encore** — c'est la déclinaison, pour un composant chronométré, du principe
alert (« l'interruption suit l'urgence réelle ») et du contrat de repli E-motion (« jamais le seul
canal »).

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Frontière alert/toast (flux vs superposé/chronométré) | `ALERT-UX.md` § Note de transposition | Établi — déjà tranché |
| S2 | Toast = territoire du feedback immédiat, exclu de l'alert | `ALERT-UX.md` § Tone/Success | Établi — déjà tranché |
| S3 | Durée plancher undo 5-8s | `BUTTON-UX.md` § Bouton d'annulation (IBM Carbon) | Établi — transposition interne |
| S4 | Timing suspendu au survol/focus | WCAG 2.2.1 (Timing Adjustable) | Établi, standard d'accessibilité |
| S5 | `role="alert"` vs `role="status"` par tone | `ALERT-UX.md` § États et comportement (Polaris, WCAG/ARIA) | Établi — transposition interne |
| S6 | Tone 4 valeurs, actions tolérées, position Adaptive | Arbitrage utilisateur, conversation 2026-07-20 | Décision d'identité interne, non re-sourcée en externe |
| S7 | Empilement ordre d'arrivée (pas gravité) | Raisonnement de mécanisme (nature événement vs état) | Déduction argumentée — pas de règle chiffrée publiée trouvée |
| S8 | Instrument illustration réservé au toast seul | Cohérence avec budget de rareté E-motion (`EMOTION-UX.md`) | Déduction argumentée, cohérente avec une règle établie |
| S9 | Le document Understanding de WCAG 2.2.1 traite explicitement le cas du toast : « a web application such as an email client provides notification of new email arriving with a temporary message (such as a 'toast' message) in the lower right-hand side of the interface, and the message disappears after 5 seconds. Users are able to identify the arrival of email through other means, such as viewing the Inbox, so the disappearance of the message does not set a time limit on the their ability to determine if new mail has arrived. » — la disparition automatique n'est PAS une limite de temps au sens de 2.2.1 dès lors que l'information reste atteignable autrement. Le critère lui-même n'offre que trois issues (Turn off / Adjust sur une plage d'au moins dix fois la valeur par défaut / Extend avec avertissement d'au moins 20 s et dix prolongations) : la suspension au survol n'en est aucune. La section Intent précise par ailleurs que « the expiration of a window of opportunity for a user to react to a request for input » est bien une limite de temps. | [WCAG 2.2 — 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | Établi, standard (A) — **corrige S4** : TOAST-R10 et TOAST-U04 attribuent à 2.2.1 une exigence de pause au survol/focus qui n'y figure pas. Fonde en revanche pleinement R11 et R27 (le repli est la condition même de l'exemption). **Contredit R13/R14** : un toast dont l'action (undo) n'existe nulle part ailleurs ouvre une fenêtre de réaction, donc une limite de temps réelle, que la pause au survol ne suffit pas à satisfaire. |
| S10 | Le pattern Alert de l'APG énonce : « It is also important to avoid designing alerts that disappear automatically. An alert that disappears too quickly can lead to failure to meet WCAG 2.0 success criterion 2.2.3. » Il ajoute que « Frequent interruptions inhibit usability for people with visual and cognitive disabilities, which makes meeting the requirements of WCAG 2.0 success criterion 2.2.4 more difficult. » | [ARIA Authoring Practices Guide — Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) | Établi — pattern normatif W3C. Objection de principe au composant toast lui-même, mais ancrée sur 2.2.3 (No Timing), critère **AAA** : elle ne bloque pas une conformité AA. À lire avec S9, qui neutralise l'objection quand le repli est garanti. |
| S11 | « In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. » Situation A (succès / résultat d'une action) → role="status" ; Situation B (avertissement / erreur) → role="alert". | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard (AA) — fonde le mapping de TOAST-R24, déjà tranché dans ALERT. |
| S12 | « The alert role should only be used for text content, not interactive elements such as links or buttons. » ; « If the user is expected to close the alert, then the alertdialog role should be used instead. » ; le conteneur doit préexister dans le DOM, un élément role="alert" injecté déjà peuplé n'est généralement pas annoncé. | [MDN — ARIA alert role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role) | Établi — **contredit la combinaison R13 + R24** : un toast danger/warning porteur d'une action « Annuler » place un bouton dans un conteneur que R24 fait porter role="alert". Même contradiction que celle déjà relevée sur ALERT (S16 vs R36/R47). |
| S13 | role="status" implique aria-live="polite" et aria-atomic="true" ; « Do not give focus to the status when its content updates. » | [MDN — ARIA status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role) | Établi — documentation de référence. |
| S14 | Fluent 2 (Toast) : « If there is no action to take, toast will time out after seven seconds. » ; « People who navigate via mouse can pause the timer by hovering over the toast. » ; « Don't show more than four toasts in a toaster » ; « Include the Close button to allow people to expressly dismiss toasts only if they can find that information again elsewhere. » ; « For critical messages, try a modal Dialog, Field error, or Message bar instead. » ; position « usually the top-right or bottom-right », « where they are least likely to block the main content ». | [Fluent 2 — Toast, usage](https://fluent2.microsoft.design/components/web/react/core/toast/usage) | Établi — design system public vérifié. Soutient R05, R06, R10, R11, R27 ; **diverge** de R16 (3 vs 4) et de U02 (croix présente). |
| S15 | Shopify Polaris (Toast) : « Toast with action should persist for at least 10,000 milliseconds. » ; « Only include an action in toast if the same action is available elsewhere on the page. » ; « Not have actions, like [Cancel], for dismissing toast. The [X] to dismiss is already included in the component. » ; « Avoid using toast for error messages. Always try to use a banner to prominently inform merchants about persistent errors. » | [Shopify Polaris — Toast](https://polaris-react.shopify.com/components/deprecated/toast) | Établi — design system public vérifié (composant marqué deprecated dans Polaris, guidance conservée). Soutient R05, R06, R11, R13. **Contredit U03** (8 000 ms pour un toast avec action, contre un plancher de 10 000 ms annoncé comme exigence d'accessibilité) et **U02** (croix incluse par défaut). |
| S16 | IBM Carbon (toast notification) : « Toast notifications persist by default, but they can timeout and be coded to dismiss automatically after five seconds on the screen. » ; « They can also include a close button so users can dismiss them sooner. » ; « toast notifications cover content on the screen so they should always be easily dismissed. » ; « Toast notifications slide in and out from the top right of the screen. » ; « New toast notifications should appear at the top of the list, with older notifications being pushed down until they are dismissed. » | [IBM Carbon — Notification, usage](https://carbondesignsystem.com/components/notification/usage/) | Établi — design system public vérifié. Soutient R05, R06, R12, R17 (ordre chronologique). **Contredit U02** (« should always be easily dismissed ») et **U10** (Carbon ancre en haut à droite, non en bas au centre — la note de TOAST-UI affirmant que « Carbon/Polaris/Material proposent tous bas-droit » est inexacte pour Carbon comme pour Polaris). |
| S17 | Atlassian Design System (Flag) : la variante auto-dismiss est décrite comme « A flag that is dismissed automatically after eight seconds. » | [Atlassian Design System — Auto dismiss flag](https://atlassian.design/components/flag/auto-dismiss-flag/) | Établi — design system public vérifié, mais documentation succincte : ne dit rien de la pause au survol ni des tones autorisés à s'auto-fermer. |
| S18 | React Aria (Adobe, Toast) : « Timers automatically pause when the user focuses or hovers over a toast. » ; « Only auto-dismiss toasts when the information is not critical, or may be found elsewhere. Some users may require additional time to read toasts, and screen zoom users may miss them entirely. » ; timeout minimum recommandé de 5 secondes ; la région de toasts est une landmark region dotée d'une navigation clavier dédiée. | [React Aria — Toast](https://react-aria.adobe.com/Toast) | Établi — implémentation de référence accessible, vérifiée. Fonde R10 (pause survol **et** focus), R11, R12, R27. **Signale un manque** : ni TOAST-UX ni TOAST-UI ne prévoient de chemin clavier permettant d'atteindre la région de toasts, sans lequel la pause au focus et l'action de R13 sont inatteignables au clavier. |
| S19 | Radix Primitives (Toast) : « Pauses closing on hover, focus and window blur » ; durée par défaut du Provider : 5000 ms ; un sous-composant Toast.Close permet de « dismiss the toast before its duration has elapsed » ; fermeture par geste de balayage supportée. | [Radix Primitives — Toast](https://www.radix-ui.com/primitives/docs/components/toast) | Établi — primitive accessible de référence, vérifiée. Confirme la convergence de R10 (troisième système à énoncer la pause au survol ET au focus) ; **contredit U02** (affordance de fermeture explicite fournie). |
| S20 | Nord Design System (Toast) : « Don't place interactive content in toasts. Assistive technology like screen readers will not convey any semantics when announcing toast messages. » ; timeout par défaut 10 000 ms ; « Toasts are complicated from an accessibility perspective ». | [Nord Design System — Toast](https://nordhealth.design/components/toast/) | Établi — design system public vérifié. Corrobore S12 : **contredit R13** (action tolérée à l'intérieur d'un conteneur live). |
| S21 | « When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content. » La section Intent précise : « Typical types of content that can overlap focused items are sticky footers, sticky headers, and non-modal dialogs » et « A notification implemented as sticky content, such as a cookie banner, will fail this success criterion if it entirely obscures a component receiving focus. » | [WCAG 2.2 — 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Établi, standard (AA) — **norme absente des deux fichiers**. Une région de toasts en position fixe ancrée en bas au centre (U10, position: fixed + inset-block-end) peut masquer entièrement un composant qui reçoit le focus : c'est exactement le cas de figure que 2.4.11 sanctionne. Point à instruire, non couvert par R20. |
| S22 | « Timing is not an essential part of the event or activity presented by the content, except for non-interactive synchronized media and real-time events. » Niveau AAA. | [WCAG 2.2 — 2.2.3 No Timing](https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html) | Établi, standard (AAA) — critère sur lequel l'APG (S10) fonde son objection à la disparition automatique. Son niveau AAA explique pourquoi le toast reste un composant licite en visée AA. |
| S23 | « The size of the target for pointer inputs is at least 24 by 24 CSS pixels », sauf exceptions (Spacing, Equivalent, Inline, User Agent Control, Essential). Niveau AA. | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Établi, standard (AA) — la section Accessibilité de TOAST-UI exige 44 px pour la cible de l'action. L'exigence AA est de 24 px ; 44 px relève de 2.5.5 Target Size (Enhanced, AAA) et des HIG Apple. L'écart va dans le sens de la sécurité mais le fichier attribue à l'AA une valeur qui n'y figure pas. |
| S24 | Pour l'information mise à jour automatiquement : « there is a mechanism for the user to pause, stop, or hide it or to control the frequency of the update unless the auto-updating is part of an activity where it is essential ». Niveau A ; l'auto-updating ne bénéficie d'aucune exception de cinq secondes. | [WCAG 2.2 — 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Établi, standard (A) — piste d'ancrage plus solide que 2.2.1 pour une région de toasts qui se renouvelle : une pile FIFO qui pousse dehors un toast à l'arrivée d'un autre (U06) est de l'information qui se met à jour toute seule, et « pause, stop or hide » est précisément ce qu'un contrôle de fermeture fournirait. |
| S25 | Intelligence Community Design System (Toast, accessibilité) : composant testé contre WCAG 2.2 AA ; « A user can also hover over the toast with their mouse to pause the timer. » ; « If any actions are included within a toast, then it can't be set to auto-dismiss. » ; un toast auto-fermant porte role="alert", un toast persistant porte role="dialog" et reçoit le focus. | [ICDS — Toast, accessibility](https://design.sis.gov.uk/components/feedback-progress/toast/accessibility) | Établi — design system public vérifié. **Contredit frontalement R13/R14/U03** : ce système interdit purement et simplement l'auto-fermeture dès qu'une action est présente, là où Fili se contente d'ajouter 2 000 ms et une pause au survol. |

## À approfondir

- **Valeur exacte de prolongation de durée** (au-delà du plancher 5-8s) selon longueur du texte —
  à trancher dans `TOAST-UI.md`.
- **Ancrage précis à l'écran** (quel coin, comportement en état compact/regular/expanded) — décision
  `TOAST-UI.md`, dépend du travail Adaptive déjà en cours côté DS-UI (curseur de largeur de
  conteneur dans `atelier.html`).
- **RTL et reduced motion** — position miroir en lecture droite-gauche, chorégraphie d'entrée/sortie
  sans mouvement : signalés, non couverts ici (même statut que le point ouvert d'`ALERT-UX.md`).
- **Fermeture manuelle explicite** (croix, comme l'alert dismissible) — non tranché : le toast a
  une fin de vie programmée, une fermeture manuelle est un raccourci, pas une nécessité. À trancher
  dans `TOAST-UI.md` si le besoin se confirme à l'usage.
