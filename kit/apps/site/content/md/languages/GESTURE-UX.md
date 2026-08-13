---
component: gesture
layer: ux
type: language
version: 1.0.0 # 1.0.0 : première rédaction — le langage des gestes (glisser, balayer, appui long, multipoint) et de leur contrat non négociable : jamais le seul chemin vers une fonction. Pendant comportemental de la fondation touch. Langage largement anticipatoire (le produit n'a pas encore de surface gestuelle). Inventaire + benchmark faits avant livraison.
last_updated: 2026-07-25
companion: GESTURE-UI.md
confidence: mixed # les obligations d'alternative (WCAG 2.5.1 / 2.5.7 / 2.5.4) sont établies ; le registre « le geste est un raccourci, jamais une porte » est un parti pris d'identité interne
---

# Langage des gestes (gesture) — Couche UX

> Ce langage définit ce qu'un **geste** a le droit de faire. Un geste — balayer, glisser-déposer,
> appuyer longuement, pincer — est rapide et fluide, mais il est **invisible** : pas de libellé, pas
> de bordure, pas d'état au repos. La règle qui fonde tout le reste : un geste est un **raccourci**,
> jamais le **seul** moyen d'accomplir une action. La fondation voisine `TOUCH` porte la taille et
> l'atteinte des cibles ; ce langage porte le mouvement qu'on fait dessus. Les techniques vivent dans
> `GESTURE-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [GESTURE-R01] : un geste n'a **ni forme ni état**. Là où un bouton montre qu'il est cliquable, un balayage
STATUT : propriété universelle
SOURCE : S1, S7, S8
ÉNONCÉ : Un geste ne possède ni forme ni état au repos : il n'est perceptible qu'une fois connu, ce qui impose qu'il soit à la fois annoncé par un indice perceptible et doublé par une alternative simple menant à la même fonction.
ne montre rien — il faut le connaître pour le faire. Deux conséquences fondent le langage : un geste
doit être **découvrable** (annoncé par un affordant visible) et **doublé** (une alternative simple
atteint la même fonction).

RÈGLE [GESTURE-R02] : **le geste est un raccourci, pas un substitut.** Il accélère pour qui le connaît ; il
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Un geste est un raccourci qui accélère une fonction déjà accessible par un autre chemin, et jamais le moyen exclusif de l'atteindre.
MESURE : aucune fonction du système n'est atteignable exclusivement par un geste
n'enlève jamais l'accès à qui ne le connaît pas, ne peut pas le faire, ou ne le découvre pas.

> **Pourquoi** : un geste caché sans alternative est une fonction qui n'existe que pour ceux qui
> l'ont devinée. C'est le défaut structurel du geste — invisible par nature — et la raison pour
> laquelle WCAG en fait une obligation, pas une recommandation.

## L'alternative — la règle cardinale

RÈGLE [GESTURE-R03] : **tout geste à trajectoire (path-based) ou multipoint a une alternative à pointeur unique.**
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Toute fonction opérée par un geste multipoint ou à trajectoire est également opérable par un pointeur unique sans trajectoire, sauf lorsque le geste multipoint ou à trajectoire est essentiel.
MESURE : toute fonction accessible par un geste multipoint ou tracé l'est aussi par une action à pointeur unique sans tracé, hors cas essentiel déclaré
Un balayage, un pincement, une rotation : la même fonction s'atteint par un tap/clic simple
(WCAG 2.5.1, niveau A). Balayer pour supprimer → un bouton « supprimer » existe aussi.

RÈGLE [GESTURE-R04] : **tout glissement (drag) a une alternative sans glisser.** Réordonner, déplacer vers une
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Toute fonction opérée par un glissement est également réalisable par un pointeur unique sans glisser, sauf lorsque le glissement est essentiel ou que la fonction est fournie par l'agent utilisateur sans modification par l'auteur.
MESURE : toute fonction accessible par glissement l'est aussi par une action à pointeur unique sans glisser, hors cas essentiel déclaré
cible : la même action se fait sans maintenir-déplacer — boutons monter/descendre, menu « déplacer
vers », sélection puis destination (WCAG 2.5.7, niveau AA).

RÈGLE [GESTURE-R05] : **une fonction déclenchée par le mouvement de l'appareil** (secouer pour annuler, incliner)
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Toute fonction déclenchée par le mouvement de l'appareil ou de l'utilisateur dispose d'un contrôle d'interface équivalent et d'un moyen de désactiver la réponse au mouvement, sauf lorsque le mouvement passe par une interface prise en charge par l'accessibilité ou qu'il est essentiel à la fonction.
MESURE : toute fonction déclenchée par le mouvement expose un contrôle équivalent à l'écran et un réglage de désactivation
a un contrôle équivalent à l'écran **et** peut être désactivée (WCAG 2.5.4, niveau A).

RÈGLE [GESTURE-R06] : la **seule exception** est le geste **essentiel** — quand le tracé *est* la donnée
STATUT : parti pris d'identité
SOURCE : S1, S2, interne
ÉNONCÉ : La seule dispense d'alternative est le caractère essentiel du geste, quand le tracé constitue lui-même la donnée ; ce caractère se déclare explicitement au cas par cas et ne se présume jamais.
MESURE : toute fonction gestuelle livrée sans alternative porte une déclaration écrite de son caractère essentiel
(signer, dessiner, une carte à exploration libre). L'exception se **déclare** ; elle ne se présume
jamais parce qu'« un bouton serait moins élégant ».

## Découvrabilité

RÈGLE [GESTURE-R07] : un geste utile s'**annonce** — une poignée, un « peek » (un bord de contenu qui dépasse),
STATUT : propriété universelle
SOURCE : S5, S7, S8
ÉNONCÉ : Un geste est annoncé par un indice perceptible au repos — poignée, bord de contenu visible, chevron — ou par une instruction explicite : un geste sans indice ni instruction n'est pas découvrable et sa fonction reste ignorée.
MESURE : tout geste non standard porte un indice visuel persistant à l'état de repos ou une instruction textuelle accessible
une ombre, un chevron. L'affordant visible est la frontière avec `INTERACTION` : le geste sans indice
n'est pas un geste, c'est un secret.

RÈGLE [GESTURE-R08] : on respecte le **geste standard de la plateforme** (balayer-pour-revenir iOS, tirer-pour-
STATUT : propriété universelle
SOURCE : S5, S9
ÉNONCÉ : Les gestes réservés par la plateforme d'accueil sont respectés et jamais redéfinis : aucun geste applicatif ne se place dans une zone ou une direction dont le système d'exploitation ou l'agent utilisateur conserve la maîtrise.
MESURE : aucun geste applicatif défini dans une zone d'exclusion ou une direction réservée déclarée par la plateforme
rafraîchir) plutôt que d'en inventer un concurrent. Un geste maison qui contredit le geste système
attendu est un piège.

RÈGLE [GESTURE-R09] : l'**aide au premier usage** (coach-mark, animation d'amorce) est **ponctuelle** et non
STATUT : parti pris d'identité
SOURCE : S8, interne
ÉNONCÉ : L'aide au premier usage d'un geste est ponctuelle et non bloquante : elle ne se répète pas à chaque venue et ne s'interpose jamais entre la personne et la fonction.
MESURE : l'aide au premier usage s'affiche au plus une fois par utilisateur et se ferme sans conditionner l'accès à la fonction
bloquante — jamais répétée à chaque venue, jamais un mur avant l'accès.

## Seuil, annulation, accident

RÈGLE [GESTURE-R10] : un geste ne se déclenche qu'au-delà d'un **seuil franc** (distance ou durée) — sous le seuil,
STATUT : propriété universelle
SOURCE : S2, S10
ÉNONCÉ : Un geste ne s'engage qu'au-delà d'un seuil franc de distance ou de durée ; en deçà de ce seuil rien ne se produit et le défilement conserve la priorité.
MESURE : sous le seuil, aucun effet n'est déclenché et l'événement est rendu au défilement de l'agent utilisateur
rien ne se passe. Un effleurement en défilant n'est pas un geste d'action : le **défilement prime**.

RÈGLE [GESTURE-R11] : un geste est **annulable avant sa validation** : ramener puis relâcher hors de la zone
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : L'effet d'un geste n'est acté qu'au franchissement du seuil suivi d'un relâchement dans la zone d'effet ; ramener le pointeur hors de cette zone avant de relâcher annule le geste sans conséquence.
MESURE : aucun effet exécuté sur l'événement de contact ; sortie de la zone d'effet avant relâchement = annulation sans effet
d'effet annule ; l'effet n'est acté qu'au franchissement du seuil et au relâchement. C'est la parenté
du geste avec l'annulation du pointeur (`TOUCH`, WCAG 2.5.2).

RÈGLE [GESTURE-R12] : le **retour d'accompagnement** pendant le geste (le contenu qui suit le doigt, un aperçu)
STATUT : implémentation de référence
SOURCE : S11
ÉNONCÉ : Le retour d'accompagnement pendant le geste est porté par des propriétés composables uniquement et se réduit lorsque l'utilisateur demande moins de mouvement, sans que la fonction du geste en soit jamais retirée.
MESURE : sous prefers-reduced-motion: reduce, le suivi animé est supprimé ou remplacé et la fonction du geste reste atteignable
suit `MOTION` — `transform`/`opacity` seuls — et se coupe sous `prefers-reduced-motion` sans jamais
retirer la fonction.

## Accessibilité et robustesse

RÈGLE [GESTURE-R13] : toute fonction gestuelle est atteignable **au clavier** — le geste n'est jamais l'unique
STATUT : propriété universelle
SOURCE : S12
ÉNONCÉ : Toute fonction exposée par un geste est également opérable au clavier, sauf lorsque la fonction sous-jacente exige une entrée dépendant du tracé du mouvement et pas seulement de ses extrémités.
MESURE : toute fonction gestuelle est déclenchable au clavier seul, hors cas de tracé essentiel déclaré
chemin (le contrat clavier complet appartient au principe `accessibility`, ce langage en est un
consommateur explicite).

RÈGLE [GESTURE-R14] : les **technologies d'assistance** capturent leurs propres gestes (lecteur d'écran) ; l'action
STATUT : propriété universelle
SOURCE : S8, S13
ÉNONCÉ : Les technologies d'assistance capturent les gestes tactiles pour leur propre navigation : toute fonction gestuelle reste donc exposée par un contrôle dont le nom et le rôle sont programmatiquement déterminables, et non par le seul geste brut.
MESURE : toute fonction gestuelle est atteignable par un contrôle exposant un nom et un rôle accessibles
reste donc exposée par un **contrôle nommé**, pas par un balayage brut que l'AT ne peut pas relayer.

RÈGLE [GESTURE-R15] : l'alternative à pointeur unique **est** l'accès pour la **motricité réduite** — qui ne peut
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : L'alternative à pointeur unique et l'alternative sans glisser constituent l'accès principal des personnes à motricité réduite, qui ne peuvent ni tracer un chemin précis ni maintenir un appui : ce ne sont pas des compléments de confort.
ni tracer un chemin précis ni maintenir un appui. Ce n'est pas une faveur, c'est la porte principale
pour une partie des utilisateurs.

## Test du geste

RÈGLE [GESTURE-R16] : tout nouveau geste passe ces quatre questions :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Tout nouveau geste est soumis aux quatre questions du test du geste — alternative par tap simple, affordant visible, seuil et annulation, atteignabilité clavier et exposition à l'assistance — et un « non » à la première question interdit la livraison hors cas essentiel déclaré.

1. La même fonction est-elle atteignable par un **tap/clic simple** (pas de trajectoire, pas de
   maintien) ?
2. Le geste est-il **annoncé** par un affordant visible, ou est-il un secret ?
3. A-t-il un **seuil** qui le distingue du défilement et une **annulation** avant validation ?
4. Est-il atteignable au **clavier** et exposé à l'**AT** par un contrôle nommé ?

Un « non » à la question 1 n'est pas négociable hors du cas *essentiel* déclaré.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Geste path-based/multipoint sans alternative | Fonction inaccessible (WCAG 2.5.1) | Critique |
| Drag sans alternative sans glisser | Fonction inaccessible en motricité réduite (WCAG 2.5.7) | Critique |
| Motion actuation sans équivalent ni désactivation | Déclenchement involontaire, inaccessible (WCAG 2.5.4) | Élevée |
| Geste caché sans affordant | Fonction découverte par personne | Élevée |
| Geste maison contre un geste système | Conflit, action involontaire | Élevée |
| Pas de seuil (confusion avec le scroll) | Action déclenchée en défilant | Moyenne |
| Retour de geste porté par le mouvement seul | Perte sous reduced-motion / AT | Moyenne |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Un geste à trajectoire/multipoint a une alternative à pointeur unique (sauf essentiel) | [WCAG 2.2 — 2.5.1 Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html) | Établi, standard d'accessibilité (niveau A) |
| S2 | Un glissement a une alternative sans glisser (sauf essentiel) | [WCAG 2.2 — 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | Établi, standard d'accessibilité (niveau AA) |
| S3 | Une fonction par mouvement de l'appareil a un équivalent et se désactive | [WCAG 2.1 — 2.5.4 Motion Actuation](https://www.w3.org/WAI/WCAG21/Understanding/motion-actuation.html) | Établi, standard d'accessibilité (niveau A) |
| S4 | Annulation au relâchement (parenté) | [WCAG 2.2 — 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | Établi |
| S5 | Découvrabilité et respect des gestes de plateforme | [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) ; [Material — Gestures](https://m2.material.io/design/interaction/gestures.html) | Établi par convergence |
| S6 | « Le geste est un raccourci, jamais une porte » (registre) | Décision d'identité interne, 2026-07-25 | Parti pris interne, aligné sur les obligations WCAG |
| S7 | Les interfaces gestuelles régressent en découvrabilité : un geste ne peut pas figurer dans un menu et rien n'informe la personne des alternatives disponibles ; la visibilité des contrôles a disparu, et la récupération après une action accidentelle y est très difficile | [Norman & Nielsen — Gestural Interfaces: A Step Backwards In Usability (JND.org)](https://jnd.org/gestural-interfaces-a-step-backwards-in-usability/) | Établi comme texte de référence en design d'interaction — argumentation d'auteurs faisant autorité, pas une norme opposable |
| S8 | Les gestes personnalisés sont difficiles à découvrir, à exécuter et à mémoriser, et des instructions doivent être fournies pour expliquer quels gestes sont utilisables ; les widgets exigeant des gestes complexes sont difficiles ou impossibles à utiliser au lecteur d'écran, dont le mode d'interaction remplace la manipulation directe par un cycle de focalisation puis d'activation ; des alternatives tactiles et clavier restent nécessaires quand le mouvement de l'appareil pilote une fonction | [W3C — Mobile Accessibility: How WCAG 2.0 and Other W3C/WAI Guidelines Apply to Mobile](https://www.w3.org/TR/mobile-accessibility-mapping/) | Établi — note de groupe de travail W3C (WAI) |
| S9 | Le balayage entrant depuis les bords (retour) et les balayages du bas de l'écran (accueil, bascule rapide) sont réservés au système ; une application ne peut pas se soustraire aux gestes d'accueil et de bascule, et doit déclarer des zones d'exclusion pour lever les conflits avec le geste de retour | [Android — Gesture navigation](https://developer.android.com/develop/ui/views/touch-and-input/gestures/gesturenav) | Établi, documentation constructeur — converge avec Apple HIG (S5) sur l'interdit de concurrencer un geste système |
| S10 | Par défaut, le défilement et le pincement sont pris en charge exclusivement par le navigateur ; une application utilisant les événements pointeur reçoit un pointercancel dès que le navigateur décide d'interpréter l'interaction comme un pan ou un zoom | [MDN — touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) | Établi — spécification CSS documentée par MDN ; fonde la priorité du défilement sur le geste applicatif |
| S11 | prefers-reduced-motion signale que l'utilisateur préfère une interface qui supprime, réduit ou remplace les animations fondées sur le mouvement ; l'intention est d'atténuer le mouvement, pas de retirer l'interaction | [MDN — @media/prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — spécification CSS documentée par MDN |
| S12 | Toute fonctionnalité du contenu doit être opérable au clavier sans exiger de synchronisation particulière des frappes, sauf lorsque la fonction sous-jacente requiert une entrée dépendant du tracé du mouvement et pas seulement de ses extrémités | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard d'accessibilité (niveau A). **Nuance absente du fichier** : GESTURE-R13 pose l'obligation clavier sans réserve alors que le critère exempte explicitement l'entrée dépendante du tracé — la même exception que le cas « essentiel » de GESTURE-R06 |
| S13 | Pour tout composant d'interface, y compris généré par script, le nom et le rôle doivent être programmatiquement déterminables, les états et valeurs modifiables par l'utilisateur programmatiquement définissables, et les changements notifiés aux technologies d'assistance | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard d'accessibilité (niveau A) |

## À approfondir

- **Surface gestuelle réelle** : le produit n'en a pas encore — ce langage est *anticipatoire*. Le
  premier drag-and-drop (réordonner une collection) ou swipe-to-dismiss (fermer un toast) arrivera
  avec son contrat déjà posé. À rouvrir avec des cas concrets.
- **Seuils chiffrés** (distance de swipe, durée d'appui long) : non tokenisés — ils dépendent du
  contexte et de la plateforme. Candidats à des valeurs de référence le jour d'une vraie surface, en
  lien avec `MOTION` (durées) et `TOUCH` (tailles).
- **Gestes multi-doigts avancés** (pincer-pivoter simultané) : hors périmètre tant qu'aucune vue
  (carte, éditeur) ne les exige ; l'exception « essentiel » leur est réservée quand ils arriveront.
