---
sujet: rapport-audit-passion-courtage
type: rapport
version: 0.3.0 # 0.3.0 : prédicat contraste() — 9 règles exécutables ; A.1 confirmée sur le contraste, 65 mesures non concluantes nommées (2026-07-31). 0.2.0 # 0.2.0 : instrument statique branché — 8 règles exécutables, l'annexe A.1 réconciliée chiffre par chiffre (2026-07-31). 0.1.0 : premier passage machine
---

# Audit Fili — Passion Courtage

## Empreinte de passage

> Deux audits ne se comparent que si leurs empreintes correspondent.

| | |
|---|---|
| **Date** | 2026-07-31 |
| **Cible** | `site-v3` — 6 pages HTML *(hors `_avant-corrections-0722/`, sauvegarde)* |
| **Corpus** | 1 040 règles qualifiées · **9 règles exécutables** (`CRITERE` posés) |
| **Instruments** | DOM rendu (apparitions posées) · feuille de style (CSSOM) · **contraste WCAG** |
| **Navigateur** | Chromium 141.0.7390.37, sans tête, `reducedMotion: reduce` |
| **Largeurs balayées** | 320 · 390 · 600 · 721 · 768 · 834 · 900 · 1280 px |

**Couverture réelle : 9 règles sur 1 040.** Ce rapport ne dit rien des 1 031 autres. Il ne dit
pas qu'elles sont respectées — il dit qu'elles n'ont pas été regardées.

---

## À corriger — 2 constats

Ce registre ne contient que des **propriétés universelles** : des normes, opposables.

### 1. Saut de niveau de titre — les 6 pages

**Règle** `TYPOGRAPHY-R07` · propriété universelle · WCAG 1.3.1
**Critère** `suite("h1,h2,h3,h4,h5,h6") sans_saut` → **h2 → h4**, une fois par page

Le pied de page ouvre ses trois blocs (*Navigation*, *Contact*, *Horaires*) en `h4`, alors que
le dernier titre du corps est un `h2`. Le niveau 3 n'existe nulle part entre les deux.

> Un utilisateur de lecteur d'écran qui navigue par titres conclut à du contenu manquant. Le
> trou est invisible à l'œil : les `h4` du pied sont stylés comme il faut.

**Correctif** — `h4` → `h3` dans le pied de page. Le niveau suit la structure, la taille suit le
design : le style des trois blocs n'a pas à changer.

### 2. Débordement horizontal à 320 px — `/contact.html`

**Règle** `GRID-R10` · propriété universelle · WCAG 1.4.10
**Mesure** `aucun défilement horizontal à 320 px CSS de large` → **+11 px**

Élément le plus à droite : `div.choice-row`, dans `div.field.col-span-full`.

> **Loi 4.15** — l'élément nommé est celui qui *dépasse*, pas nécessairement celui qui *cause*.

---

## Suggestion — 1 constat

Un parti pris du système, pas une norme. Refusable sans conséquence de conformité.

### `clamp()` de taille sans composante `rem` dans la partie fixe

**Règle** `TYPOGRAPHY-R12` · implémentation de référence · WCAG 1.4.4
**Critère** `chaque_valeur("font-size") clamp_avec_rem()` → **3 déclarations sur 3**

| Valeur | Où |
|---|---|
| `clamp(2.7rem, 5.6vw, 4.6rem)` | `h1` |
| `clamp(2rem, 3.6vw, 3rem)` | `h2` |
| `clamp(1.3rem, 2vw, 1.7rem)` | `.row-item .r-title` |

Le terme préféré est du `vw` pur. Le zoom navigateur n'agit pas sur les unités viewport : entre
les deux bornes, le texte ne grandit pas quand l'utilisateur zoome. La forme attendue est
`clamp(2.7rem, 2.1rem + 1.7vw, 4.6rem)` — une composante `rem` dans la partie fixe porte le
zoom, la composante `vw` porte la fluidité.

---

## En attente de déclaration — 2 mesures

Ni conformes, ni en écart. Le référentiel sait mesurer, il lui manque une donnée qui appartient
au client. **La réponse débloque mécaniquement la règle au prochain scan.**

| Règle | Ce qui manque | Volume concerné |
|---|---|---|
| `SPACING-R05` · universelle | aucun token `--spacing-*` déclaré à la racine — il n'y a pas d'échelle d'espacement à laquelle confronter les valeurs | **375 déclarations** examinées, 58 valeurs distinctes (36 en `padding`, 22 en `gap`) |
| `RADIUS-R03` · identité | aucun token `--radius-*` déclaré à la racine | **104 déclarations**, 8 valeurs distinctes : `0`, `2px`, `3px`, `10px`, `12px`, `14px`, `32px`, `50%` |

**Question au client** : ces valeurs sont-elles une échelle non nommée, ou une accumulation ?
Le moteur ne peut pas trancher — et il ne le fera pas à sa place.

---

## Non couvert — 2 questions posées au référentiel

Le corpus ne dit rien de ces cas. Rien n'est attendu du client.

### Le débordement entre 721 et ~870 px

| Largeur | Débordement | Élément le plus à droite |
|---|---|---|
| 721 px | **+125 px** | `button.theme-toggle` |
| 768 px | +80 px | `button.theme-toggle` |
| 834 px | +17 px | `button.theme-toggle` |
| 900 · 600 · 390 px | aucun | — |

`GRID-R10` ne norme que **320 px**. À 721 px le corpus ne dit rien — le moteur ne prétend donc
pas à une violation, alors que c'est le point le plus large de la casse et qu'il tombe
exactement sur la bascule compilée du site (`min-width: 45.0625rem` = 721 px).

**Question au référentiel** : faut-il une règle de débordement à *toute largeur balayée*, ou
seulement au plancher de 320 px ?

### `<em>` à l'intérieur des titres — 28 occurrences

Aucune règle ne se prononce. Procédé cohérent et volontaire (un mot en italique par `h1`/`h2`),
signalé parce qu'il est systématique — pas parce qu'il serait fautif.

---

## Non concluant — 65 mesures de contraste

La mesure existe, la valeur n'a pas pu être établie. **Ce n'est pas une conformité.**

| Empêchement | Occurrences |
|---|---|
| Texte posé sur un **dégradé** (`section.hero--page`, `section.cta-band`, `a.btn--fill`, `button.btn--fill`) | 56 |
| Ancêtre porteur du fond à `opacity: 0` au moment de la mesure | 9 |

`COLOR-R21` dit « contraste texte / **pixel de fond le plus défavorable** ». Sur un dégradé, le
pire pixel est celui qui se trouve *sous le texte*, pas le pire arrêt de l'élément entier : un
titre posé sur la moitié sombre d'un dégradé est conforme, et le condamner sur l'arrêt clair de
l'autre extrémité serait un faux positif. Trancher demande d'**échantillonner les pixels
rendus** — mécanisme qui n'existe pas encore. Tant qu'il n'existe pas, le moteur dit qu'il ne
sait pas.

> Ces 56 mesures concernent les zones les plus visibles du site : le héros de chaque page et la
> bande d'appel à l'action. **Elles méritent une vérification à l'œil, ou un échantillonnage.**

---

## Rien à signaler — ce qui a été regardé et qui tient

- **Contraste texte / fond ≥ 4,5:1** (`COLOR-R09`, WCAG 1.4.3) — **aucun écart** parmi les
  mesures concluantes, sur les 6 pages. Le prédicat applique les trois seuils de la norme
  (4,5:1 ; 3:1 au-delà de 24 px ; 3:1 au-delà de 18,66 px en gras) et il est vérifié par
  **13 cas d'épreuve calculés à la main** (`npm run verifie:contraste`) — dont des cas qu'il
  doit rejeter, pour prouver qu'il mord.
- **Un seul `h1` par page** (`TYPOGRAPHY-R06`) — conforme sur les 6 pages.
- **Aucune taille de police en unités viewport seules** (`TYPOGRAPHY-R11`) — 42 valeurs de
  `font-size` examinées, aucune fautive.
- **Relations ARIA** (`ACCESSIBILITY-R17`) — aucun identifiant mort.
- **États d'erreur** (`ACCESSIBILITY-R18`) — aucun `aria-invalid` sans message.
- **Liens externes** — 33 liens sortants, **tous** en `rel="noopener"`.

> *Un outil capable de dire « rien à signaler ici » est plus crédible qu'un outil qui trouve
> toujours quelque chose.*

---

## Ce que ce rapport n'a pas regardé

| Domaine | Ce qui manque au moteur |
|---|---|
| Contraste sur fond en dégradé ou en image | l'échantillonnage de pixels (`COLOR-R21`) |
| Contraste des composants et des états (2ᵉ clause de `COLOR-R09`) | savoir ce qui *identifie* un contrôle — `BORDER-U09` déclare ce jugement non scriptable |
| Cibles tactiles < 24 px | aucune convention ne permet de déclarer une exception (`inline`, `essentiel`) |
| Visibilité et couleur du focus | pilotage du focus clavier + remontée d'ancêtres |
| 1 031 autres règles | aucun `CRITERE` posé |
