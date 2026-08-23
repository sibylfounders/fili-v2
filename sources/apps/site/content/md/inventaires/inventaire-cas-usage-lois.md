# Inventaire des cas d'usage — Lois UX (fondation)

> Miroir des inventaires de fondations (précédents : typographie, couleur), adapté à un **catalogue** : on inventorie les *lois* elles-mêmes — chacune est un « cas d'usage » du raisonnement — regroupées par domaine cognitif, et on vérifie pour chacune si le système la met déjà en œuvre quelque part. Sert de checklist au test de couverture de `LAWS-UX.md`. Cette fondation ne porte aucune valeur (pas de token) : elle documente les *principes* que les autres fondations appliquent déjà, et vers lesquels elles renvoient.
>
> Particularité de cette fondation : le « trou » n'est pas un contexte oublié mais **une loi connue non encore reliée au système** (aucun consommateur), ou **une loi appliquée silencieusement** (une règle existe mais ne nomme pas la loi qui la fonde). Le test de couverture les distingue.

---

## 1. Charge cognitive et mémoire

| Loi | Cas d'usage | Particularité de contexte |
|---|---|---|
| **Cognitive Load** (Sweller) | La charge mentale imposée par une interface au-delà de la tâche elle-même | Couvert par convergence — principe fondateur implicite de tout le système (registre productif MOTION, échelles fermées SPACING/RADIUS, « un token naît d'un besoin réel ») ; LAWS-UX le nomme comme la loi-mère |
| **Miller's Law** (7±2) | Nombre d'éléments tenables en mémoire de travail — souvent sur-cité | Couvert avec nuance — la vraie règle est le *chunking*, pas « 7 items » (mythe à corriger) ; appliqué par le découpage FORM-multi-step |
| **Chunking** | Regrouper l'information en unités mémorisables | Couvert par renvoi — FORM (étapes), SPACING (proximité comme regroupement), numéros/dates segmentés (VOICE-UI) |
| **Working Memory** | Mémoire à court terme, volatile, limitée | Couvert par renvoi — ne jamais exiger de retenir une info d'un écran à l'autre (FORM ask-once, récapitulation) |
| **Zeigarnik Effect** | Une tâche inachevée reste plus présente en mémoire | Couvert par renvoi — progression du FORM-multi-step, statut d'autosave ; **frontière** : ne pas l'exploiter en dark pattern (relances culpabilisantes) |
| **Selective Attention** | L'utilisateur ignore activement ce qui ressemble à du bruit (banner blindness) | Couvert avec risque — fonde la sobriété du MOTION (le mouvement capte de force) et la parcimonie de l'alert ; **trou** : pas de règle explicite « ne pas déguiser une info critique en pub » |

## 2. Décision et action

| Loi | Cas d'usage | Particularité de contexte |
|---|---|---|
| **Hick's Law** | Le temps de décision croît avec le nombre et la complexité des choix | Couvert par renvoi — inflation du primary (BUTTON : un seul primary), registres étanches (COLOR), un CTA par section |
| **Choice Overload** | Trop d'options paralyse plus qu'elles n'aident | Couvert par renvoi — corollaire de Hick, appliqué au nombre d'actions par carte (CARD) et par alert (ALERT) |
| **Fitts's Law** | Temps d'atteinte d'une cible ∝ distance / taille | Couvert par renvoi — zone tactile 44px (BUTTON-UI, standard WCAG), cibles proches de leur contexte |
| **Goal-Gradient Effect** | La motivation s'intensifie à l'approche du but | Couvert par renvoi — progression du FORM-multi-step ; **frontière** : pas de fausse progression |
| **Tesler's Law** (conservation de la complexité) | Toute tâche a une complexité irréductible : qui l'absorbe, le système ou l'utilisateur ? | Couvert par renvoi — le système absorbe (autofill INPUT, validation qui diagnostique, valeurs par défaut) plutôt que de la reporter sur l'utilisateur |
| **Postel's Law** (robustesse) | Être tolérant en entrée, strict en sortie | Couvert par renvoi — INPUT accepte les formats variés (espaces dans un IBAN, casse d'un e-mail) et normalise ; ne rejette pas sur la forme |
| **Occam's Razor** | La solution la plus simple qui marche est la meilleure | Couvert par convergence — « pas de fondation grid tant qu'aucun besoin » (SPACING), disabled non tokenisé tant qu'inutile (COLOR) |
| **Parkinson's Law** | Une tâche s'étale jusqu'à remplir le temps disponible | **Non couvert** — aucun consommateur : concerne des mécaniques (limites de temps, autofill accélérateur) que le produit n'a pas encore ; signalé |
| **Paradox of the Active User** | L'utilisateur ne lit pas la doc, il se lance tout de suite | Couvert avec renvoi — fonde « le helper text avant l'erreur » (INPUT), l'onboarding contextuel plutôt que le tutoriel préalable (VOICE) |
| **Flow** (Csíkszentmihályi) | L'état de concentration ininterrompue | Couvert par renvoi — MOTION « ne verrouille jamais l'interaction », pas de déplacement non sollicité (SPACING) |

## 3. Perception et regroupement (lois de Gestalt)

| Loi | Cas d'usage | Particularité de contexte |
|---|---|---|
| **Law of Proximity** | Les éléments proches sont perçus comme liés | Couvert par renvoi — SPACING fait de la proximité une *information* (label collé à son champ) ; loi Gestalt la plus adossée au système |
| **Law of Common Region** | Une frontière partagée regroupe (carte, panneau) | Couvert par renvoi — CARD (le conteneur groupe son contenu), BORDER (rôle de regroupement) |
| **Law of Similarity** | Les éléments semblables sont perçus comme d'une même famille | Couvert par renvoi — registres COLOR, cohérence des tones, familles de tokens |
| **Law of Uniform Connectedness** | Ce qui est relié visuellement (trait, fond) est le lien le plus fort | Couvert par renvoi — BORDER (séparateur/regroupement), fonds `*-subtle` de l'alert |
| **Law of Prägnanz / Simplicity** | L'œil réduit le complexe à sa forme la plus simple | Couvert par convergence — iconographie à trait constant (ICONOGRAPHY), formes distinctes des tones |
| **Von Restorff Effect** (isolation) | L'élément qui se distingue est mémorisé | Couvert par renvoi — le primary unique (BUTTON), la marque parcimonieuse (COLOR) ; **frontière** : l'isolation perd son effet si tout crie |
| **Serial Position Effect** | On retient mieux le début et la fin d'une liste | **Partiellement couvert** — implicite dans l'ordre des actions ; **trou** : pas de règle explicite pour la navigation/les listes (composant à naître) |

## 4. Temps, effort perçu et confiance

| Loi | Cas d'usage | Particularité de contexte |
|---|---|---|
| **Doherty Threshold** | Sous ~400 ms de réponse, l'utilisateur reste engagé | Couvert par renvoi — MOTION borne toute l'échelle sous 400 ms ; feedback perçu-instantané < 100 ms |
| **Aesthetic-Usability Effect** | Un design perçu comme beau est jugé plus utilisable | Couvert avec **avertissement** — c'est un *risque* autant qu'un levier : le fini esthétique masque les problèmes d'utilisabilité en test ; règle : ne jamais laisser l'esthétique clore une question d'utilisabilité |
| **Peak-End Rule** | On juge une expérience sur son pic et sa fin | Couvert par renvoi — soigne les moments d'erreur (le pic négatif) et de succès/fin (VOICE : ton du message final) plus que la moyenne |
| **Jakob's Law** | L'utilisateur préfère que ton produit marche comme ceux qu'il connaît déjà | Couvert par convergence — c'est la justification méthodologique du **benchmark** (Carbon, Polaris, Material, GOV.UK) présent dans chaque fiche ; loi la plus structurante pour ce système |

## 5. Par risque de mauvaise application

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Loi invoquée sans source | « Miller = 7 items max » appliqué à des menus | Couvert — LAWS-UX corrige les mythes (Miller, la « règle des 3 clics ») avec leur source |
| Loi retournée en dark pattern | Zeigarnik/Goal-gradient exploités pour culpabiliser ou piéger | Couvert — chaque loi manipulable porte sa frontière éthique explicite |
| Sur-application (une loi contre une autre) | Hick pousse à tout cacher ; Fitts et la découvrabilité s'y opposent | Couvert — LAWS-UX documente les **tensions** entre lois, aucune ne s'applique seule |
| Aesthetic-usability qui clôt un débat d'UX | « C'est joli donc c'est bon » en revue | Couvert — traité comme risque, pas seulement comme effet |
| Loi appliquée mais non nommée | Une règle existe, la loi qui la fonde n'est pas citée (déduction silencieuse conceptuelle) | Couvert — la **carte d'application** de LAWS-UX relie chaque loi à la règle qui l'implémente déjà |

---

## Bilan du test de couverture

Sur **27 lois recensées** (périmètre « catalogue large », aligné sur lawsofux.com + sources primaires), **3 sont non ou partiellement couvertes** par un consommateur du système à ce jour : **Parkinson's Law** (aucune mécanique de temps), **Serial Position Effect** (attend un composant navigation/liste), **Selective Attention** (pas de règle explicite anti-camouflage d'info critique). Aucune n'est bloquante — toutes sont documentées avec leur déclencheur d'activation.

Les **24 autres sont couvertes par renvoi ou par convergence** : elles ne créent pas de règle nouvelle, elles *nomment la loi* derrière une règle déjà écrite dans une autre fondation ou un composant. C'est la nature de cette fondation — une **couche de lisibilité théorique** posée sur l'existant, pas une source de contraintes nouvelles.

**Ce que ce test ajoute sur la méthode** : sur une fondation-catalogue, le prédicteur « état transitoire » ne s'applique pas (aucun état) ; le trou-type devient la **loi connue mais non reliée** — l'équivalent conceptuel de la « déduction silencieuse » des tokens (une règle fondée sur une loi qu'on ne cite pas). La carte d'application de `LAWS-UX.md` est l'outil qui résorbe ce trou, comme le frontmatter `tokens` résorbe les déductions de valeur. Deux mythes (Miller « 7 items », règle des 3 clics) ont été traités *avant* livraison, avec leur réfutation sourcée — l'analogue du « contexte pas encore né » corrigé d'office chez les autres fondations.
