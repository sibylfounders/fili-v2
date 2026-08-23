---
component: switch
layer: ux
type: component
version: 1.0.0 # 1.0.0 : première rédaction — besoin réel : interrupteurs de theming et réglages du rail d'outils du shell (2026-07-24). Distinct de la « bascule d'affichage » du mot de passe (INPUT) et de la checkbox : un switch a un EFFET IMMÉDIAT. Périmètre arbitré : basique (on/off, disabled) ; l'état asynchrone (bascule qui appelle le serveur) est une extension différée. role=switch (ARIA). Cf. DECISIONS.md 2026-07-24.
last_updated: 2026-07-24
companion: SWITCH-UI.md
confidence: mixed # role=switch et son clavier sont établis (ARIA/WCAG) ; la frontière switch vs checkbox est un consensus UX convergent.
---

# Switch — Couche UX (composant)

> Activer ou désactiver **une fonction, tout de suite**. Le switch bascule un état booléen à **effet
> immédiat** — c'est ce qui le sépare de la checkbox.

## Switch ou checkbox — la ligne de partage

RÈGLE [SWITCH-R01] : **switch** = l'action prend effet **immédiatement** (un réglage, le mode sombre, une notification
STATUT : propriété universelle
SOURCE : S2, S4, S5
ÉNONCÉ : Un switch est réservé aux bascules binaires dont l'effet est immédiat et n'appelle aucune validation ; une sélection binaire qui n'est appliquée qu'à la soumission d'un formulaire est une case à cocher, et l'un ne se substitue jamais à l'autre.
MESURE : aucun switch n'est accompagné d'un bouton d'application ou d'enregistrement de son propre état
qu'on coupe) — pas de bouton « appliquer ». **Checkbox** = une **sélection** intégrée à un formulaire,
**validée à la soumission** (choisir des options, un consentement). Ne jamais utiliser l'un pour l'autre :
un switch qui n'agit qu'après un « enregistrer » ment sur l'immédiateté ; une checkbox qui agit au clic
surprend.

RÈGLE [SWITCH-R02] : l'effet immédiat implique qu'il n'y a **rien à soumettre** — le switch n'attend pas un envoi. Si la
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le switch n'a rien à soumettre ; le cas d'une bascule qui déclenche un appel distant et peut échouer est hors du périmètre de cette version du composant et se remonte au lieu de s'improviser.
bascule peut **échouer** (elle déclenche un appel serveur), c'est le cas asynchrone : **hors périmètre de
cette version** (extension différée), à remonter plutôt qu'à improviser.

## État — jamais la seule couleur

RÈGLE [SWITCH-R03] : l'état on/off se lit d'abord à la **position** du pouce (gauche/droite), pas seulement à la couleur
STATUT : propriété universelle
SOURCE : S3, S9
ÉNONCÉ : L'état d'un switch se lit à un canal non chromatique — la position du pouce sur la piste — en plus de toute variation de couleur, et un libellé d'état accompagne la bascule quand la conséquence de l'état n'est pas évidente.
MESURE : l'état activé se distingue de l'état désactivé autrement que par la seule couleur
(renvoi ACCESSIBILITY, COLOR : jamais un seul canal). Quand la conséquence n'est pas évidente, un **libellé
d'état** (« Activé / Désactivé ») accompagne — le mot reste le canal fiable (VOICE).

RÈGLE [SWITCH-R04] : le switch porte un **libellé** qui dit ce qu'il gouverne ; ce libellé est cliquable et fait partie
STATUT : propriété universelle
SOURCE : S7, S8
ÉNONCÉ : Un switch porte un libellé qui nomme ce qu'il gouverne ; ce libellé est cliquable, il est contenu dans le nom accessible du contrôle, et les états désactivé et focalisé restent perceptibles.
MESURE : le nom accessible du switch contient le texte du libellé visible ; un clic sur le libellé bascule le switch
du **nom accessible**. États **désactivé** (non focalisable, contraste réduit assumé) et **focus** visibles.

## Rôle et clavier

RÈGLE [SWITCH-R05] : `role="switch"` + `aria-checked` (true/false) ; **Espace** (et Entrée) **basculent** ; le nom
STATUT : propriété universelle
SOURCE : S1, S7, S8
ÉNONCÉ : Un switch expose role=switch et aria-checked, bascule à la barre d'espace, et notifie son changement d'état par aria-checked plutôt que par le seul déplacement visuel du pouce.
MESURE : le contrôle porte role=switch et aria-checked ; la barre d'espace bascule l'état ; aria-checked change à chaque bascule
accessible contient le libellé visible (WCAG 2.5.3). Le changement d'état est annoncé par `aria-checked`,
pas seulement par le déplacement visuel.

## Frontières

RÈGLE [SWITCH-R06] : la **couleur** des états relève de `color` ; le **mouvement** du pouce relève de `motion` ; l'**anneau
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le switch ne redéfinit pas ce qui appartient à ses voisins : la couleur de ses états relève de la couleur, le mouvement du pouce du mouvement, l'anneau de focus de la bordure, le mot du libellé du langage, et une sélection validée à la soumission de la case à cocher et du formulaire.
de focus** de `border` ; le **mot** du libellé de `voice` ; une **sélection validée à la soumission** relève
de la **checkbox** et de `form`, pas du switch.

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | role="switch", aria-checked, Espace bascule | [ARIA APG — Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) | Établi |
| S2 | Switch = effet immédiat ; checkbox = sélection validée à la soumission | [NN/g — Toggle-Switch Guidelines](https://www.nngroup.com/articles/toggle-switch-guidelines/) | Convergent |
| S3 | État jamais porté par la seule couleur (position + mot) | WCAG 1.4.1, 1.3.3 (renvoi ACCESSIBILITY) | Établi |
| S4 | Les toggles ne servent qu'à des actions binaires « qui interviennent immédiatement après que l'utilisateur a actionné l'interrupteur » ; pour un réglage qui n'est pas binaire ou ne s'applique pas instantanément, utiliser une case à cocher associée à un bouton ; le toggle par défaut exige un libellé et un texte d'état | [Carbon Design System — Toggle](https://carbondesignsystem.com/components/toggle/usage/) | Établi par convergence — système public vérifié (1/2) |
| S5 | « Le résultat du changement d'état du toggle est immédiatement effectif et aucune action supplémentaire n'est nécessaire pour appliquer ou enregistrer le changement » ; la case à cocher est préférée quand la sélection doit être enregistrée ou soumise | [GitLab Pajamas — Toggle](https://design.gitlab.com/components/toggle/) | Établi par convergence — système public vérifié (2/2) ; avec S2 (NN/g), fait de l'effet immédiat une propriété convergente et non un parti pris |
| S6 | Changer le réglage d'un composant ne provoque pas automatiquement de changement de contexte non annoncé ; changer un réglage n'est pas activer un contrôle, et l'application immédiate d'un état n'est pas en soi un changement de contexte | [WCAG 2.2 — 3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | Établi, standard (niveau A) — autorise l'effet immédiat du switch tant qu'il ne réagence pas la page ni ne déplace le focus ; ne prescrit pas l'immédiateté |
| S7 | Pour les composants dont l'étiquette contient du texte, le nom accessible contient le texte présenté visuellement | [WCAG 2.2 — 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) | Établi, standard (niveau A) — le corpus cite 2.5.3 sans lien ; il exige que le nom contienne le libellé, pas qu'il s'y réduise |
| S8 | Nom et rôle programmatiquement déterminables, états et valeurs programmatiquement définissables, et notification de leurs changements aux technologies d'assistance | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (niveau A) — fonde la notification du changement d'état par aria-checked |
| S9 | La couleur n'est jamais le seul moyen visuel de véhiculer une information, d'indiquer une action, d'appeler une réponse ou de distinguer un élément visuel | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (niveau A) — donne son URL à S3 ; le second canal est exigé, le choix de la position du pouce comme second canal reste interne |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence interne, ergonomie).*
