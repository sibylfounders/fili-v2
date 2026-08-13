---
component: input
layer: ux
version: 1.7.1 # 1.7.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.7.0 : rattachement nommé Motion/Voice, contrat reduced-motion de la bordure d'état, absence E-motion raisonnée (2026-07-21). 1.6.0 : rattachement au Langage d'interaction (zone réceptive, distincte d'une action) et à l'Architecture adaptative (aide et erreurs essentielles conservées dans tous les états). 1.5.1 : vocabulaire aligné sur le modèle style × tone du bouton.
last_updated: 2026-07-21
companion: INPUT-UI.md
confidence: mixed
---

# Input (champ de saisie) — Couche UX

> Ce fichier contient le raisonnement : quand valider, quel wording, quels risques. Tokens et valeurs techniques dans `INPUT-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [INPUT-R01] : les axes de l'input sont **tone / size / field_type** — pas les 3 axes du bouton.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Note de transposition : l'input est structuré par les axes tone, size et field_type, différents des trois axes du bouton.

RÈGLE [INPUT-R02] : **tone** (neutral/error/success/warning) — transpose directement du bouton : ce sont les états de validation qu'un input a nativement dans tous les frameworks UI (`error` boolean, `helperText`, etc. — cf. Material UI, entre autres).
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : Le tone (neutral/error/success/warning) doit reprendre les états de validation natifs à tous les frameworks UI courants (ex. Material UI).

RÈGLE [INPUT-R03] : **size** (sm/md/lg) — transpose : toujours une question de densité de contexte (tableau éditable vs formulaire vs barre de recherche hero).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Note de transposition : l'axe size (sm/md/lg) est repris du bouton car il traduit la densité du contexte d'usage.

RÈGLE [INPUT-R04] : **l'axe `style` n'existe pas ici** : il n'y a jamais "l'input principal de l'écran" au sens où il y a "le bouton principal". L'axe qui le remplace est le **type de champ** (text/email/password/number/search/textarea) — une nature de contenu, pas un poids visuel.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Note de transposition : l'axe style du bouton n'existe pas ici ; il est remplacé par field_type, une nature de contenu et non un poids visuel.

Le nombre et la nature des axes dépendent de ce que le composant *fait*, pas d'un gabarit universel. (Cheminement du test de transposition : cf. DECISIONS.md.)

## But
Un input reçoit de l'information de l'utilisateur — contrairement au bouton qui déclenche une action, l'input capture une donnée qui sera utilisée ailleurs. Toute règle ci-dessous découle de cette différence : la priorité n'est pas l'engagement dans une décision, c'est la réduction de l'erreur de saisie.

## Application du langage d'interaction

RÈGLE [INPUT-R05] : l'Input est l'expression canonique de l'intention **saisir** dans `INTERACTION-UX.md`. Sa zone
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous définissons l'input comme l'expression canonique de l'intention de saisie : label, bordure et contenu signalent où saisir, même au repos.
MESURE : au repos, le champ affiche un label visible, une bordure délimitée et l'espace de contenu, sans nécessiter d'interaction.
réceptive est visible au repos : label, limite et contenu indiquent où la valeur sera reçue.

RÈGLE [INPUT-R06] : l'Input ne reçoit jamais l'élévation d'un contrôle d'action. Son focus et sa bordure d'état
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous excluons toute élévation de type action sur l'input : le focus et la bordure d'état portent seuls l'expression de la saisie.
MESURE : le champ ne porte aucune élévation de type action ; un inset éventuel n'est jamais l'unique délimitation visible.
expriment la saisie ; un effet d'inset éventuel appartient au thème et ne peut jamais porter seul la
délimitation.

RÈGLE [INPUT-R07] : l'adaptation à l'espace conserve toujours label, valeur, contrainte nécessaire et message
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous imposons que label, valeur, contrainte nécessaire et message d'erreur restent visibles dans toute adaptation d'espace.
MESURE : dans toute adaptation d'espace, le label, la valeur, la contrainte nécessaire et le message d'erreur restent visibles ; seule une aide secondaire non requise peut disparaître.
d'erreur. Une aide secondaire peut changer de disposition, pas disparaître si elle est requise pour
réussir la saisie.

## Application du langage de motion

RÈGLE [INPUT-R08] : la transition de la bordure d'état (repos → error/success/warning) est du **feedback** au sens
STATUT : propriété universelle
SOURCE : S13
ÉNONCÉ : La transition de couleur de la bordure d'état doit rester un feedback qui confirme un changement déjà signalé ailleurs, jamais son unique vecteur d'information.
MESURE : la transition de bordure d'état confirme un changement déjà signalé ailleurs (texte), elle ne le porte jamais seule.
de `MOTION-UX.md` — `motion.fast` / `ease-out` (valeurs dans INPUT-UI.md) : elle confirme qu'un état
vient de changer, elle ne le crée pas et ne le porte pas.

RÈGLE [INPUT-R09] : règle cardinale héritée — **« le mouvement confirme, il n'informe jamais seul »**
STATUT : propriété universelle
SOURCE : S13,S6
ÉNONCÉ : L'information d'erreur ne doit jamais reposer sur la seule couleur ou animation de la bordure : elle doit être portée par un texte lié techniquement au champ.
MESURE : le message d'erreur est signalé par le mot « Erreur » associé via aria-describedby, indépendamment de toute couleur ou animation de bordure.
(`MOTION-UX.md` § « Le mouvement confirme, il n'informe jamais seul »). L'information d'erreur ne vit
jamais dans la couleur ni dans l'animation de la bordure : elle vit dans le mot « Erreur »
(§ Accessibilité du message d'erreur) et dans son association `aria-describedby` (INPUT-UI.md).

> **Pourquoi** : c'est la condition qui rend `prefers-reduced-motion` implémentable sans perte — si la
> bordure portait l'erreur à elle seule, la préférence d'accessibilité deviendrait une dégradation
> fonctionnelle.

RÈGLE [INPUT-R10] : sous `prefers-reduced-motion`, un **changement de couleur peut rester** — `MOTION-UX.md`
STATUT : parti pris d'identité
SOURCE : S14
ÉNONCÉ : Nous choisissons de conserver la transition de couleur de la bordure d'état sous prefers-reduced-motion, cette préférence ciblant le mouvement spatial, pas la couleur.
MESURE : sous prefers-reduced-motion, la transition de couleur de la bordure d'état reste active.
§ prefers-reduced-motion autorise explicitement opacité et couleur (la préférence vise le mouvement
*spatial*, pas le changement visuel). La bordure d'état conserve donc sa transition de couleur : c'est
une position assumée, pas un oubli (contrat technique dans INPUT-UI.md).

RÈGLE [INPUT-R11] : l'insertion du message d'erreur sous le champ relève de `MOTION-UX.md`, règle « le contenu ne
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous n'insérons le message d'erreur qu'à la suite d'une action de l'utilisateur, jamais par un déplacement de contenu non sollicité.
MESURE : le message d'erreur apparaît uniquement après une action utilisateur (blur, soumission), jamais par déplacement spontané du contenu.
se déplace jamais sans action de l'utilisateur » : l'espace est réservé quand c'est possible, sinon
l'insertion se fait sous le point de lecture, et toujours **après** une action de l'utilisateur (blur,
soumission) — jamais par un déplacement non sollicité.

## Quand l'utiliser / ne pas l'utiliser

RÈGLE [INPUT-R12] : utiliser pour toute donnée en texte libre ou semi-libre (nom, email, montant, recherche).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous recommandons l'input pour toute donnée exprimée en texte libre ou semi-libre, comme un nom, un email, un montant ou une recherche.

RÈGLE [INPUT-R13] : ne pas utiliser pour un choix parmi des options prédéfinies et limitées — c'est le rôle du select, radio, ou checkbox.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous déconseillons l'input pour un choix parmi des options prédéfinies et limitées, ce rôle revenant au select, au radio ou à la checkbox.

> **Pourquoi** : un input texte libre sur un choix fermé augmente le risque d'erreur de saisie sans raison.

RÈGLE [INPUT-R14] : cas limite fréquent — un champ de recherche est un input, même s'il déclenche une action au submit : la nature de la donnée saisie prime sur l'action déclenchée en aval.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous classons le champ de recherche comme un input, et non une action, car la nature de la donnée saisie prime sur l'action déclenchée ensuite.

## Type de champ (l'axe qui remplace `style`)

RÈGLE [INPUT-R15] : le type détermine le clavier, la validation native, et le comportement attendu — text, email, password, number, search, textarea.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Le type de champ HTML doit correspondre à la nature réelle de la donnée saisie, car il détermine le clavier, la validation native et le comportement attendu.
MESURE : le type HTML natif utilisé (text/email/password/number/search/textarea) correspond à la nature réelle de la donnée attendue.

> **Erreur fréquente** : styliser un `<input type="text">` pour qu'il *ressemble* à un champ email sans utiliser le vrai type HTML — ça casse des comportements natifs invisibles mais utiles (clavier adapté sur mobile, validation native du navigateur).

## Tone (sens sémantique — transposition directe du bouton)

### Neutral

RÈGLE [INPUT-R16] : le tone par défaut — aucune validation en cours ou déjà passée avec succès sans besoin de le signaler visuellement.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous utilisons le tone neutral par défaut, tant qu'aucune validation en cours ou réussie ne nécessite d'être signalée visuellement.
MESURE : en l'absence de validation active à afficher, le champ est en tone neutral.

### Error

RÈGLE [INPUT-R17] : signaler qu'une valeur ne respecte pas le format ou la contrainte attendue.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous utilisons le tone error pour signaler qu'une valeur ne respecte pas le format ou la contrainte attendue.
MESURE : le tone error s'affiche lorsque la valeur ne respecte pas le format ou la contrainte attendue.

RÈGLE [INPUT-R18] : mécanique de timing du champ — quand la validation inline est retenue, elle se joue au moment où l'utilisateur quitte le champ (on blur), pas à chaque frappe — sauf sur les champs à fort risque d'erreur de format (email, mot de passe), où un léger délai après la fin de la frappe (~500ms) permet une validation quasi temps réel sans interrompre la saisie. Jamais d'erreur avant que l'utilisateur ait terminé sa première saisie du champ.
STATUT : parti pris d'identité
SOURCE : S1,S2
ÉNONCÉ : Nous déclenchons la validation inline au blur, sauf sur les champs à fort risque de format où elle se joue ~500ms après la frappe, jamais avant la première saisie complète.
MESURE : la validation inline se déclenche au blur, ou après environ 500ms sans frappe sur les champs à risque (email, mot de passe) ; jamais avant la fin de la première saisie.

RÈGLE [INPUT-R19] : la **stratégie** — ce formulaire valide-t-il au submit uniquement, ou au blur sur les champs à risque ? — est une décision du formulaire assemblé, pas du champ : voir `content/md/patterns/FORM-UX.md`, qui fait autorité (le benchmark diverge réellement : GOV.UK submit-only ↔ Carbon blur — divergence documentée là-bas). Ce fichier reste le défaut d'un champ isolé hors formulaire (recherche, édition inline). (Transfert d'autorité : cf. DECISIONS.md 2026-07-11.)
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cadrage : la stratégie de validation (submit seul vs blur) relève du formulaire assemblé (FORM-UX.md) ; ce document fixe seulement le défaut d'un champ isolé.

> **Erreur fréquente** : sur un champ à fort risque de format, attendre la soumission complète du formulaire pour signaler la moindre erreur — redécouverte punitive de plusieurs erreurs d'un coup.

### Success

RÈGLE [INPUT-R20] : confirmer qu'une valeur à fort enjeu de confiance est correcte (ex: disponibilité d'un nom d'utilisateur, force d'un mot de passe). Optionnel — à réserver aux champs à forte friction perçue, pas systématique sur chaque champ valide.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous réservons le tone success aux champs à forte friction perçue, comme la disponibilité d'un identifiant, plutôt qu'à toute validation réussie.
MESURE : le tone success n'est utilisé que sur des champs à forte friction perçue, pas systématiquement sur chaque champ valide.

### Warning

RÈGLE [INPUT-R21] : signaler une valeur techniquement acceptée mais qui mérite l'attention (ex: un mot de passe valide mais faible). Moins fréquent que sur le bouton — la plupart des inputs n'ont besoin que de neutral/error.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous utilisons le tone warning pour signaler une valeur acceptée mais qui mérite l'attention, plus rarement que sur le bouton.
MESURE : le tone warning est utilisé sur une valeur acceptée mais signalée comme perfectible.

## Contenu du message (wording — enjeu différent du bouton)

RÈGLE [INPUT-R22] : ce paragraphe est régi par `VOICE-UX.md`, cadre unificateur du wording de tous les composants.
STATUT : propriété universelle
SOURCE : S15
ÉNONCÉ : Un message d'erreur doit décrire l'écart et la correction sans jamais qualifier ou blâmer l'utilisateur.
La règle cardinale **« ne jamais blâmer l'utilisateur »** (`VOICE-UX.md` § « Le ton suit l'utilisateur »,
règle cardinale du ton) s'applique ici sans réserve : une validation en erreur décrit l'écart et la
correction, elle ne qualifie jamais l'utilisateur. Le ton de référence de toute erreur portée par un
champ est la ligne « Erreur *de l'utilisateur* : calme, sans blâme, orienté solution » de la table
VOICE « Le ton suit l'utilisateur ».

> **Renvoi positif** : Voice n'était nommé ici que par exclusion (§ Dictée — « la fondation VOICE ne
> couvre pas la commande vocale ») ; or INPUT est au contraire une **source nommée** de Voice
> (`VOICE-UX.md` § Sources cite « INPUT-UX § Contenu du message, Luke Wroblewski +22 % »). Le cadre est
> commun et ce fichier y contribue — il n'est pas un cas hors champ.

RÈGLE [INPUT-R23] : un bon message fait le travail de diagnostic à la place de l'utilisateur : il dit *pourquoi* et *comment corriger* ("Le format attendu est JJ/MM/AAAA"), pas seulement *que* c'est faux.
STATUT : propriété universelle
SOURCE : S1,S2
ÉNONCÉ : Un message d'erreur doit expliquer pourquoi la valeur est invalide et comment la corriger, pas seulement signaler qu'elle est fausse.
MESURE : chaque message d'erreur indique la cause du problème et l'action de correction, pas seulement l'invalidité (ex: pas seulement « Champ invalide »).

> **Pourquoi** : un message d'erreur générique ("Champ invalide") transfère toute la charge de résolution à l'utilisateur.
> **Cas documenté** — une étude comparative de Luke Wroblewski entre validation inline et validation à la soumission a montré +22% de taux de succès et -22% d'erreurs commises avec la validation inline.

CONFIANCE : cas isolé — étude contrôlée largement citée, méthodologie publique.

> **Benchmarks agrégés** — des données Baymard/Zuko 2026 montrent que la validation inline en temps réel améliore la complétion de +5% sur un formulaire court à +11-13% sur un formulaire de 6 champs ou plus.

CONFIANCE : convergence — benchmark agrégé multi-sites, tendance stable sur plusieurs années — niveau de preuve supérieur au cas isolé du bouton ($300M button).

RÈGLE [INPUT-R24] : nuance à ne pas oublier — la validation inline n'est pas un gain gratuit : à réserver aux champs à fort risque d'erreur, pas à généraliser partout.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Nous réservons la validation inline aux champs à fort risque d'erreur, car la généraliser oblige à un va-et-vient constant entre saisie et correction.
MESURE : la validation inline n'est appliquée que sur les champs à fort risque d'erreur de format, pas sur l'ensemble d'un formulaire.

> **Pourquoi** : une critique documentée (Jessica Enders, *Designing UX: Forms*) souligne qu'elle oblige l'utilisateur à basculer sans cesse entre remplir et corriger.

## Contenu additionnel du champ

RÈGLE [INPUT-R25] : **helper text — distinct du message d'erreur.** C'est une aide contextuelle persistante sous le label, visible dès le focus, indépendante de la validation (ex: "Doit contenir au moins 8 caractères") : le helper text guide *avant* la saisie, l'erreur corrige *après*.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Nous distinguons le helper text, aide persistante visible dès le focus, du message d'erreur qui le remplace temporairement.
MESURE : le helper text apparaît sous le label dès le focus, indépendamment de la validation ; il est remplacé, pas cumulé, par le message d'erreur actif.

RÈGLE [INPUT-R26] : l'erreur remplace temporairement le helper text tant qu'elle est active, plutôt que de s'empiler dessus (convention observée : Carbon, Material).
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Nous faisons en sorte que le message d'erreur remplace temporairement le helper text plutôt que de s'y ajouter.
MESURE : quand l'erreur est active, le helper text n'est pas affiché simultanément.

RÈGLE [INPUT-R27] : **compteur de caractères** — sur un champ à limite (notamment textarea), afficher le compteur *avant* que l'utilisateur commence à taper, pas seulement une fois la limite atteinte. Format observé : ratio "12/280" plutôt qu'un décompte descendant, bien que les deux conventions coexistent selon les systèmes (pas de consensus univoque ici).
STATUT : parti pris d'identité
SOURCE : S9
ÉNONCÉ : Nous affichons le compteur de caractères dès l'apparition du champ à limite, avant que l'utilisateur commence à taper.
MESURE : sur un champ à limite de caractères, le compteur est visible dès l'affichage du champ, avant toute frappe, au format 'saisi/maximum'.

> **Pourquoi** : ça évite la découverte punitive en cours de frappe.

RÈGLE [INPUT-R28] : **prefix / suffix** — symbole monétaire, unité de mesure, ou tout élément de contexte fixe attaché au champ (ex: "€" en préfixe, "kg" en suffixe) : traité comme un élément non éditable à l'intérieur du champ, pas comme un label externe.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous intégrons le prefix ou suffix comme élément non éditable à l'intérieur du champ, jamais comme un label externe séparé.
MESURE : un prefix ou suffix est rendu à l'intérieur du champ, non éditable, et non positionné comme un label externe.

RÈGLE [INPUT-R29] : **bouton d'effacement (clear)** — sur un champ de recherche notamment, une icône de suppression rapide du contenu, activée seulement quand le champ n'est pas vide.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous n'affichons le bouton d'effacement qu'une fois le champ non vide.
MESURE : le bouton d'effacement n'est visible/actif que lorsque le champ contient du texte.

RÈGLE [INPUT-R30] : **indicateur de champ requis** — un astérisque ou équivalent textuel, systématique sur tout champ obligatoire. (Historique de cette règle : cf. DECISIONS.md.)
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous marquons systématiquement tout champ obligatoire par un astérisque ou une mention textuelle équivalente.
MESURE : chaque champ obligatoire porte un astérisque ou une mention textuelle équivalente, indépendante de la couleur.

## Accessibilité du message d'erreur

RÈGLE [INPUT-R31] : au-delà de la règle générale "jamais la couleur seule" déjà posée ailleurs — un message d'erreur doit être précédé du mot "Erreur" (ou d'une icône dédiée), pas seulement stylé en rouge.
STATUT : propriété universelle
SOURCE : S6
ÉNONCÉ : Un message d'erreur doit être précédé du mot « Erreur » ou d'une icône dédiée, jamais signalé par la seule couleur du texte.
MESURE : le message d'erreur est précédé du mot « Erreur » ou d'une icône dédiée, et ne repose pas uniquement sur la couleur rouge.

> **Pourquoi** : sinon un utilisateur daltonien peut manquer le changement d'état si le texte lui-même ne change pas.

## Dictée et correspondance libellé visible / nom accessible

RÈGLE [INPUT-R32] : **le champ accepte la dictée comme n'importe quelle saisie clavier** — un champ natif reçoit la parole convertie en texte sans traitement particulier. Ne jamais intercepter les touches d'une façon qui casse la dictée ou le collage : un masque qui rejette ce qui n'est pas tapé caractère par caractère, un handler qui reconstruit la valeur touche à touche. Le formatage (téléphone, carte) se fait *après coup, sur la valeur*, jamais en bloquant l'entrée.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Le champ doit accepter dictée et collage sans interception bloquante ; tout formatage doit s'appliquer après coup, jamais en empêchant la saisie.
MESURE : le champ n'intercepte aucune touche de façon à bloquer la dictée ou le collage ; tout formatage s'applique après coup sur la valeur.

RÈGLE [INPUT-R33] : **le nom accessible du champ contient son libellé visible** (WCAG 2.5.3 « Label in Name ») — l'utilisateur de commande vocale dit « champ E-mail » parce qu'il lit « E-mail » ; si le `<label>` affiche « E-mail » mais que l'`aria-label` dit « Adresse électronique », la cible devient inadressable à la voix. L'`aria-label` **complète** le libellé visible, il ne le remplace ni ne le contredit.
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Le nom accessible du champ doit contenir le texte de son libellé visible, conformément à WCAG 2.5.3 (Label in Name).
MESURE : le texte du label visible est inclus dans le nom accessible (aria-label ne le contredit ni ne le remplace).

> **Pourquoi** : c'est le pendant vocal de « label toujours lié au champ » — un champ parfaitement étiqueté pour le lecteur d'écran peut rester inadressable à la voix si son nom accessible s'écarte du texte affiché. La fondation VOICE ne couvre pas ce point : elle traite la voix *éditoriale*, pas la commande vocale (cf. ACCESSIBILITY-UX.md).

CONFIANCE : établi — WCAG 2.5.3 (niveau A) ; la non-interception de la dictée est un raisonnement de mécanisme, convergent avec les recommandations d'accessibilité des champs natifs.

## Tailles (transposition directe du bouton)

RÈGLE [INPUT-R34] : **sm** — tableaux éditables, cellules inline, filtres compacts.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous réservons la taille sm de l'input aux tableaux éditables, cellules inline et filtres compacts.

RÈGLE [INPUT-R35] : **md** — la taille par défaut : formulaires standards.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous utilisons la taille md comme taille par défaut de l'input, pour les formulaires standards.

RÈGLE [INPUT-R36] : **lg** — champs de recherche hero, formulaires d'onboarding à fort enjeu de conversion.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous réservons la taille lg aux champs de recherche hero et aux formulaires d'onboarding à fort enjeu de conversion.

RÈGLE [INPUT-R37] : mêmes règles que le bouton — ne jamais mélanger les tailles dans un même groupe de champs liés (ex: adresse), et pas de valeur px absolue fixée ici (cf. INPUT-UI.md).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous interdisons de mélanger les tailles d'input au sein d'un même groupe de champs liés, comme un bloc adresse.
MESURE : tous les champs d'un même groupe logique (ex: adresse) utilisent la même taille, sans mélange.

## Contextes d'intégration

### Dans un formulaire

RÈGLE [INPUT-R38] : label toujours visible, y compris pendant la saisie — jamais seulement en placeholder.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Le label du champ doit rester visible en permanence, y compris pendant la saisie ; il ne doit jamais être porté uniquement par le placeholder.
MESURE : le label reste visible en permanence, y compris pendant la saisie ; il n'est jamais porté uniquement par le placeholder.

> **Pourquoi** : le placeholder disparaît dès que l'utilisateur tape, l'utilisateur perd le repère de ce qu'il remplit.

RÈGLE [INPUT-R39] : champs groupés visuellement quand ils appartiennent au même ensemble logique (ex: bloc adresse).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous groupons visuellement les champs appartenant à un même ensemble logique, comme un bloc adresse.
MESURE : les champs d'un même ensemble logique sont rapprochés visuellement (espacement réduit, bordure ou fond commun).

RÈGLE [INPUT-R40] : indicateur de champ requis — la convention (marquer le requis vs marquer l'optionnel) est une décision de formulaire, pas de champ isolé : voir `content/md/patterns/FORM-UX.md`, qui fait autorité sur ce point.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cadrage : le choix de marquer le champ requis ou le champ optionnel relève du formulaire assemblé (FORM-UX.md), pas de ce document.

### Dans une table (édition inline)

RÈGLE [INPUT-R41] : le passage en mode édition doit être visuellement sans ambiguïté (bordure, fond) — l'utilisateur ne doit jamais se demander s'il modifie une donnée en direct ou consulte une valeur figée.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous exigeons que le passage en mode édition d'un champ inline soit visuellement non ambigu.
MESURE : le mode édition inline se distingue visuellement du mode lecture par au moins un changement de bordure ou de fond.

### Barre de recherche

RÈGLE [INPUT-R42] : le type `search` natif plutôt qu'un `text` stylisé — comportements natifs (bouton d'effacement, historique) perdus sinon.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : La barre de recherche doit utiliser le type HTML natif « search » plutôt qu'un champ texte stylisé, pour conserver les comportements natifs du navigateur.
MESURE : la barre de recherche utilise le type HTML natif 'search', pas un 'text' stylisé pour ressembler à une recherche.

## Risque

RÈGLE [INPUT-R43] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce tableau récapitule, pour chaque risque de conception identifié dans ce document, sa cause et sa sévérité.

| Combinaison | Risque principal | Sévérité |
|---|---|---|
| Validation à la soumission uniquement sur un champ à fort risque de format | Abandon, redécouverte punitive d'erreurs (la stratégie du formulaire assemblé : FORM-UX.md) | Élevée |
| Label en placeholder seul | Perte de repère, erreur de saisie | Moyenne |
| Type HTML non natif (ex: text stylé en email) | Perte de comportements natifs, accessibilité | Moyenne |
| Label non lié techniquement au champ | Exclusion lecteur d'écran | Critique |
| Nom accessible divergent du libellé visible | Champ inadressable en commande vocale (WCAG 2.5.3) | Moyenne |
| Masque de saisie qui rejette dictée/collage | Saisie vocale ou gestionnaire de mots de passe cassés | Moyenne |
| Champ mot de passe sans toggle de visibilité | Erreurs de saisie non détectées, abandon | Moyenne |
| Champ de paiement stylé hors iframe processeur | Non-conformité PCI-DSS | Critique |
| Autofill navigateur non anticipé dans le design | Rupture visuelle du design system | Faible à moyenne |

## Champ de mot de passe

RÈGLE [INPUT-R44] : capturer une donnée sensible, masquée par défaut, tout en restant vérifiable par l'utilisateur avant soumission.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Le champ de mot de passe doit capturer une donnée sensible masquée par défaut, tout en restant vérifiable par l'utilisateur avant soumission.
MESURE : le champ mot de passe est masqué par défaut et propose un moyen de vérifier la valeur avant soumission.

RÈGLE [INPUT-R45] : **un seul champ, pas deux** — un champ unique avec un toggle de visibilité (show/hide) est préférable au champ "confirmer le mot de passe" : il réduit la friction du formulaire sans perdre la fonction de vérification que le second champ apportait.
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : Un formulaire doit utiliser un seul champ de mot de passe avec un toggle de visibilité, plutôt qu'un champ de confirmation séparé.
MESURE : le formulaire ne comporte qu'un seul champ mot de passe, avec un toggle afficher/masquer, sans champ de confirmation.

> **Pourquoi** : le champ "confirmer le mot de passe" a longtemps été la norme, mais des recherches documentées (GOV.UK Design System) ont conclu en faveur du champ unique.

RÈGLE [INPUT-R46] : le champ reste masqué par défaut ; le toggle affiche le texte en clair à la demande, jamais l'inverse.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Le champ de mot de passe doit rester masqué par défaut ; seul un toggle actionné explicitement peut afficher le texte en clair, jamais l'inverse.
MESURE : le champ est masqué par défaut ; seule une action explicite (clic sur le toggle) révèle temporairement le texte en clair.

RÈGLE [INPUT-R47] : au moment de la soumission, le champ doit revenir au type `password` s'il ne l'était pas déjà.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Au moment de la soumission, le champ doit revenir au type « password » s'il ne l'était pas déjà.
MESURE : au moment de la soumission, le champ mot de passe est de type 'password', même s'il avait été affiché en clair juste avant.

> **Pourquoi** : sinon certains navigateurs risquent de mémoriser la valeur comme suggestion d'autofill sur un champ non sécurisé.

RÈGLE [INPUT-R48] : toujours autoriser le copier-coller.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Le champ de mot de passe doit toujours autoriser le copier-coller, car le bloquer casse l'usage des gestionnaires de mots de passe.
MESURE : le champ mot de passe n'intercepte ni ne bloque les actions copier/coller.

> **Pourquoi** : bloquer cette action casse l'usage des gestionnaires de mots de passe, qui reposent dessus.

RÈGLE [INPUT-R49] : désactiver la correction orthographique et la mise en majuscule automatique (`spellcheck="false"`, `autocapitalize="off"`).
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Le champ de mot de passe doit désactiver la correction orthographique et la mise en majuscule automatique.
MESURE : le champ mot de passe porte les attributs spellcheck="false" et autocapitalize="off".

> **Pourquoi** : au-delà de la gêne, certains outils de correction orthographique ont été documentés en train de transmettre le contenu de champs de mot de passe à des services tiers.

RÈGLE [INPUT-R50] : afficher les exigences de format *avant* que l'utilisateur commence à taper, pas seulement en cas d'erreur après coup.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous affichons les exigences de format du mot de passe avant la saisie, sans imposer de règle de complexité sans justification de sécurité réelle.
MESURE : les exigences de format du mot de passe sont affichées avant la saisie, pas seulement en cas d'erreur.

> **Erreur fréquente** : imposer des règles de complexité arbitraires (caractère spécial obligatoire, etc.) sans justification de sécurité réelle — n'améliore pas la sécurité effective, dégrade l'expérience.

CONFIANCE : établi — recommandations issues de GOV.UK Design System (recherche utilisateur documentée) et de patterns UX largement convergents — pas une étude chiffrée unique, mais un consensus stable entre plusieurs sources indépendantes.

## Champ de paiement (carte bancaire)

RÈGLE [INPUT-R51] : capturer une donnée à très haut risque, encadrée par une contrainte externe non négociable — la conformité PCI-DSS.
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : Le champ de carte bancaire doit être traité comme une donnée à très haut risque, encadrée par la contrainte non négociable de conformité PCI-DSS.

RÈGLE [INPUT-R52] : dans la grande majorité des implémentations conformes, le champ de numéro de carte et le CVV ne sont **pas** des champs HTML que ton design system contrôle directement — ils vivent dans un iframe fourni par le processeur de paiement (Stripe Elements, Hosted Fields, etc.). **BUTTON-UI.md et INPUT-UI.md ne peuvent pas s'appliquer tels quels** à ces deux champs précis — seule une styling limitée, exposée via l'API du processeur, est possible (couleur du texte, taille de police, état d'erreur), jamais un contrôle total du DOM.
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : Les champs numéro de carte et CVV doivent être rendus via l'iframe du processeur de paiement, hors du contrôle direct du design system.
MESURE : les champs numéro de carte et CVV sont rendus dans un iframe fourni par le processeur de paiement, pas par les composants input du design system.

RÈGLE [INPUT-R53] : ce qui reste sous ton contrôle — les champs adjacents non sensibles (nom du titulaire, adresse de facturation) suivent le gabarit standard sans restriction. Utiliser les valeurs `autocomplete` dédiées (`cc-name`, `cc-exp`, `cc-csc`).
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Les champs de paiement non sensibles (titulaire, adresse de facturation) doivent utiliser les valeurs autocomplete standard dédiées.
MESURE : les champs adjacents non sensibles utilisent les valeurs autocomplete dédiées (cc-name, cc-exp, cc-csc).

> **Pourquoi** : les valeurs autocomplete aident les navigateurs et gestionnaires à proposer un remplissage correct.
> **Erreur fréquente** : essayer de recréer visuellement un champ de carte bancaire custom "à l'identique du reste du design system" sans passer par la solution du processeur — risque de non-conformité, pas juste un choix esthétique.

CONFIANCE : établi — architecture iframe largement standard chez les processeurs de paiement (Stripe, Pin Payments, solutions "hosted fields"), documentée par leurs propres guides d'intégration.

## Autofill navigateur

RÈGLE [INPUT-R54] : le remplissage automatique par le navigateur ou un gestionnaire de mots de passe est une fonctionnalité native, pas un cas exotique — elle doit être anticipée, pas subie.
STATUT : propriété universelle
SOURCE : S12
ÉNONCÉ : Le remplissage automatique du navigateur ou d'un gestionnaire de mots de passe est un comportement natif qui doit être anticipé, pas subi.

RÈGLE [INPUT-R55] : ne jamais désactiver l'autofill sans raison de sécurité valable (cf. champ mot de passe) — le confort qu'il apporte dépasse largement le risque esthétique, qui a une solution technique connue (cf. INPUT-UI.md).
STATUT : propriété universelle
SOURCE : S12
ÉNONCÉ : L'autofill du navigateur ne doit jamais être désactivé sans raison de sécurité valable et documentée.
MESURE : l'autofill n'est désactivé sur aucun champ, sauf raison de sécurité documentée.

> **Le vrai problème** : les navigateurs appliquent un style de fond forcé (souvent jaune ou bleu pâle) aux champs autofillés, qui ne respecte pas les tokens de couleur du design system et ne peut pas être supprimé par un simple `background-color` en CSS standard — ça casse visuellement la cohérence du champ sans que ce soit un bug du produit.

CONFIANCE : établi — comportement natif documenté des navigateurs, contournement technique connu mais non standardisé entre navigateurs.

## Instrument E-motion — sans objet

RÈGLE [INPUT-R56] : le champ de saisie est le **contre-exemple canonique** du moment mérité d'E-motion. La saisie
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Nous excluons tout instrument E-motion du champ de saisie lui-même, car la saisie est une action réflexe et à haute fréquence.
MESURE : aucun instrument E-motion n'est déclenché par le champ de saisie lui-même.
est une action **réflexe et à haute fréquence** — exactement ce qu'`EMOTION-UX.md` § budget de rareté
exclut (« jamais sur une action réflexe ou à haute fréquence », « pas à chaque frappe »). Aucun
instrument expressif ne s'active donc dans le champ lui-même : l'absence d'E-motion est ici raisonnée,
pas un manque.

RÈGLE [INPUT-R57] : comme le toast (`TOAST-UX.md` § Instrument E-motion), le moment catalogué **« sortie d'une
STATUT : parti pris d'identité
SOURCE : S16,S15
ÉNONCÉ : Nous maintenons le champ en état error dans un registre strictement productif, le soulagement de la résolution restant porté par un composant séparé.
MESURE : un champ en état error reste en registre strictement productif ; le soulagement de la résolution est porté par un autre composant (toast, alert success).
erreur / récupération »** ne s'incarne **pas** dans le champ en état error — un champ en erreur reste
en registre productif strict (`VOICE-UX.md` : l'exception chaleureuse ne s'étend jamais à une erreur).
Le soulagement de la résolution, le cas échéant, est porté ailleurs (confirmation de succès, toast ou
alert success qui suit la correction), jamais par le champ qui vient de sortir d'erreur.

## Règle transversale

RÈGLE [INPUT-R58] : même principe que le bouton, transposé — **la friction de validation doit être proportionnelle au risque réel d'erreur du champ**, pas uniforme.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous calibrons la friction de validation sur le risque réel d'erreur du champ, plutôt que d'appliquer un traitement uniforme.
MESURE : le niveau de validation appliqué varie selon le risque d'erreur du champ, et n'est pas uniforme sur tous les champs.

> **Pourquoi** : un champ email mérite une validation quasi temps réel, un champ "prénom" n'en a pas besoin.

## Sources et niveau de confiance
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Validation inline : +22% succès, -22% erreurs | Luke Wroblewski, étude comparative | Étude contrôlée, largement citée |
| S2 | Validation inline : +5 à +13% complétion selon longueur du formulaire | Benchmarks agrégés Baymard/Zuko 2026 | Benchmark multi-sites, tendance stable |
| S3 | Coût cognitif du va-et-vient remplir/corriger en validation inline | Jessica Enders, *Designing UX: Forms* | Critique documentée, à mettre en balance |
| S4 | Tone (neutral/error/success/warning) transpose directement du bouton | Convergence Material UI et autres frameworks | Établi — pattern natif à tous les frameworks UI courants |
| S5 | Helper text distinct du message d'erreur, l'erreur le remplace temporairement | Carbon, Material Design | Établi par convergence entre systèmes majeurs |
| S6 | Message d'erreur précédé du mot "Erreur" ou d'une icône, pas la couleur seule | Material Design | Établi, exigence d'accessibilité daltonisme |
| S7 | Nom accessible contient le libellé visible (label in name) | WCAG 2.2 — 2.5.3 (niveau A) | Établi, standard d'accessibilité |
| S8 | Champ natif accepte dictée et collage sans interception | Recommandations d'accessibilité des champs natifs ; raisonnement de mécanisme | Convergence |
| S9 | Compteur de caractères affiché avant la saisie, pas seulement à la limite | Carbon, Material Design | Établi par convergence, format exact (ratio vs décompte) non consensuel |
| S10 | Un seul champ mot de passe + toggle plutôt que confirm password | GOV.UK Design System, recherche utilisateur documentée | Établi par recherche, consensus UX convergent |
| S11 | Champ carte bancaire hors du contrôle direct du design system (iframe PCI) | Guides d'intégration Stripe, Pin Payments, solutions "hosted fields" | Établi — architecture standard de l'industrie du paiement |
| S12 | Style d'autofill navigateur non surchargeable en CSS standard | Comportement documenté des navigateurs (Chrome, Safari, Firefox) | Établi, contournement technique connu (cf. INPUT-UI.md) |
| S13 | Transition de bordure d'état = feedback ; l'information d'erreur vit dans le mot, pas la bordure | `MOTION-UX.md` § « Le mouvement confirme, il n'informe jamais seul » | Établi — contrainte d'accessibilité (canaux redondants) |
| S14 | Bordure d'état : changement de couleur conservé sous reduced-motion | `MOTION-UX.md` § prefers-reduced-motion (opacité/couleur conservables) | Établi, standard d'accessibilité |
| S15 | Wording du message unifié par Voice ; ne jamais blâmer l'utilisateur | `VOICE-UX.md` § « Le ton suit l'utilisateur » (INPUT nommé comme source réciproque) | Établi — NN/g, GOV.UK, WCAG |
| S16 | Aucun instrument E-motion dans le champ (action réflexe / haute fréquence) | `EMOTION-UX.md` § budget de rareté ; miroir `TOAST-UX.md` § Instrument E-motion | Déduction argumentée, cohérente avec une règle établie |
