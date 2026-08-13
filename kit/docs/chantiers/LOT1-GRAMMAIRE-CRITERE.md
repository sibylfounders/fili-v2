---
sujet: lot1-grammaire-critere
type: specification
version: 0.3.0 # 0.3.0 : R07 passée au corpus ; deux rattachements corrigés (U04/U03 → U06/U02) ; trois mécanismes manquants nommés (2026-07-31). 0.2.0 # 0.2.0 : le moteur existe et tourne — résultat du test de non-régression, une divergence instruite (2026-07-31). 0.1.0 # 0.1.0 : grammaire minimale + correspondance des 12 contrôles de verifie-rendu (2026-07-31)
statut: en cours — trois règles ont quitté le code ; un prédicat manquant bloque la quatrième
---

# Lot 1 — la grammaire `CRITERE`

> Le champ `MESURE:` garde sa prose : c'est elle qui apparaît dans le constat livré au client.
> Le champ `CRITERE:` s'ajoute à côté : c'est ce que la machine exécute.
> Une règle sans `CRITERE` reste vraie, elle n'est simplement pas automatisable — et le rapport
> le dit (loi 4.18, *en attente de déclaration* ou *assisté*).

---

## 1. Ce que le moteur applique déjà, et au nom de quoi

Les 12 contrôles de `tools/verifie-rendu.mjs`, confrontés au corpus.

### 1.1 — Cinq appliquent une règle existante

| Contrôle | Règle | `MESURE` de la fiche |
|---|---|---|
| `titre-duplique` | **TYPOGRAPHY-R06** | un seul élément h1 par page |
| `titre-saute` | **TYPOGRAPHY-R07** | aucun saut de niveau de titre (h2 → h4) |
| `cible-trop-petite` | **TOUCH-R06** | toute cible < 24×24 px CSS relève du cas inline ou du cas essentiel |
| `focus-invisible` | **BORDER-U06** | aucun `outline:none` sur un élément tabulable |
| `focus-hors-systeme` | **BORDER-U02** | anneau en `control.focus-color` (crans `control.focus-*`) |

### 1.2 — Trois révèlent un manque de doctrine — **à arbitrer**

Le code sait des choses que le corpus ne dit pas. On ne les invente pas.

| Contrôle | Ce qu'il vérifie | Pourquoi aucune règle ne le couvre |
|---|---|---|
| `titre-absent` | toute page porte au moins un `h1` | TYPOGRAPHY-R06 dit « **un seul** h1 », jamais « **au moins un** ». Zéro h1 satisfait la règle actuelle. |
| `message-orphelin` | `aria-describedby` / `labelledby` / `errormessage` pointent vers un élément existant | Aucune règle. Or le code le qualifie lui-même de « défaut le plus silencieux de la chaîne » : le message disparaît pour la technologie d'assistance sans rien changer à l'écran. |
| `erreur-sans-message` | `aria-invalid` posé implique un message associé | INPUT-UX parle du message et de son `aria-describedby`, mais jamais de cette implication. |

**Ces trois-là ne reçoivent pas de `CRITERE` tant qu'une règle n'existe pas.** Écrire le critère
avant la règle reviendrait à faire naître de la doctrine par le code — exactement l'inverse de
la Méthode.

### 1.3 — Quatre sont légitimement hors doctrine

`lien-mort` · `lien-hors-basepath` · `erreur-javascript` · `page-injoignable`

Ce sont des **contrôles d'hygiène de build**, pas des constats de design. Un lien mort n'est pas
un écart au référentiel.

> **Conséquence pour le rapport, à verser dans le cahier :** un rapport distingue les **constats
> de doctrine** (qui citent une règle et un statut de frontière) des **contrôles d'hygiène** (qui
> ne citent rien). Les mélanger ferait passer une erreur 404 pour une violation du design system,
> et affaiblirait les vrais constats.

---

## 2. La grammaire — trois formes, rien de plus

L'objectif n'est pas l'expressivité, c'est la **fermeture** : un critère qu'on ne peut pas écrire
est un critère qu'on ne peut pas exécuter, et il faut que ça se voie.

```
CRITERE : compte(<sélecteur>) <op> <n>
CRITERE : chaque(<sélecteur>) <prédicat>
CRITERE : aucun(<sélecteur>) <prédicat>
```

`<op>` : `==` `!=` `<` `<=` `>` `>=`

### Prédicats — liste FERMÉE et déclarée

| Prédicat | Ce qu'il évalue | Instrument |
|---|---|---|
| `porte(attr)` / `porte(attr=valeur)` | présence / valeur d'un attribut | statique |
| `mesure(propriété) <op> <valeur>` | style calculé ou géométrie | rendu |
| `contraste(avant, arrière) <op> <n>` | ratio WCAG après cascade | rendu |
| `pointe_vers_existant(attr)` | la cible d'un IDREF existe | rendu |
| `dans(<jeu de tokens>)` | la valeur calculée appartient à un jeu déclaré | rendu |
| `suite(propriété) sans_saut` | monotonie sans trou dans l'ordre du DOM | rendu |
| `declare_exception(<nom>)` | une exception nommée est déclarée pour ce cas | statique |

**Un `CRITERE` qui aurait besoin d'un prédicat absent de cette table ne s'écrit pas.** Il remonte
comme *prédicat manquant* — même mécanique que le `MISSING-COMPONENT-PROTOCOL`, appliquée au
moteur : on n'improvise pas un prédicat, on l'arbitre et on l'ajoute d'un coup.

---

## 3. Les cinq `CRITERE` prêts à poser

À ajouter sous le `MESURE:` existant, sans y toucher.

```
# TYPOGRAPHY-R06
MESURE  : un seul élément h1 par page
CRITERE : compte("h1") == 1

# TYPOGRAPHY-R07
MESURE  : aucun saut de niveau de titre (h2 → h4)
CRITERE : suite("h1,h2,h3,h4,h5,h6") sans_saut

# TOUCH-R06
MESURE  : toute cible < 24×24 px CSS relève du cas inline ou du cas essentiel
CRITERE : chaque("a[href],button,input,select,textarea,[role=button],[tabindex]")
          mesure(largeur) >= 24 et mesure(hauteur) >= 24
          ou declare_exception("inline|essentiel")

# BORDER-U04
MESURE  : aucun outline:none sur un élément tabulable
CRITERE : aucun("a[href],button,input,select,textarea,[tabindex]")
          mesure(outline-style) == "none"

# BORDER-U03
MESURE  : sélecteur :focus-visible présent
CRITERE : chaque(":focus-visible") mesure(outline-color) dans(control.focus-*)
```

---

## 4. Le test de non-régression — critère de réussite du premier pas

Le moteur piloté par le corpus tourne sur les mêmes pages construites que
`tools/verifie-rendu.mjs`, et sa sortie JSON doit être **identique** pour ces cinq règles :
mêmes pages, mêmes motifs, mêmes occurrences.

- **Identique** → la grammaire tient, la règle a quitté le code pour le corpus. On généralise.
- **Divergente** → soit le `CRITERE` dit autre chose que le code, soit le code disait autre
  chose que la règle. Les deux cas sont des trouvailles, pas des échecs.

Les sept autres contrôles restent dans `verifie-rendu.mjs` : quatre définitivement (hygiène),
trois en attente d'arbitrage doctrinal (§ 1.2).

---

## 5. Ce qui est demandé à Aurélien

1. **Trois manques de doctrine** (§ 1.2) : écrire les règles, ou déclarer que les contrôles
   correspondants restent de l'hygiène. Tant que ce n'est pas tranché, le moteur les exécute
   sans pouvoir les justifier.
2. **La table des prédicats** (§ 2) : elle est fermée par construction. La valider maintenant,
   c'est décider de ce que le moteur saura faire — et de ce qu'il devra remonter comme manque.
3. **La distinction doctrine / hygiène dans le rapport** (§ 1.3) : à verser dans le cahier
   comme loi, si elle te va.

---

## 6. Ce qui a été fait — et ce que le test a trouvé

### 6.1 La chaîne est complète

Le champ `CRITERE:` traverse maintenant tout le circuit, sans qu'aucun maillon ne le devine :

| Étape | Fichier | Rôle |
|---|---|---|
| Source | `content/md/**/*-UX.md` | le `CRITERE:` est écrit à côté du `MESURE:`, qui ne bouge pas |
| Projection | `tools/extrait-decisions.py` | le porte dans `content/doctrine/<slug>.json` |
| Distribution | `tools/compile-regles.py` | l'émet dans `dist/audit/RULES-*.md` (`- critère : …`) |
| Grammaire | `tools/criteres-grammaire.mjs` | compile les trois formes, **table de prédicats fermée** |
| Moteur | `tools/execute-criteres.mjs` | exécute sous Chromium — `npm run criteres` |
| Épreuve | `tools/teste-criteres.mjs` | confronte code et corpus sous jsdom — `npm run verifie:criteres` |

Le moteur **ne connaît aucune règle**. Il lit le corpus. Retirer un `CRITERE:` d'une fiche le
retire du moteur ; en ajouter un l'y met. C'est le point entier du lot.

### 6.2 Le test de non-régression : 90 pages + 12 cas d'épreuve

Les 90 pages construites du site ne déclenchent qu'**une seule** occurrence : elles prouvent que
les deux moteurs se taisent ensemble, pas qu'ils disent la même chose. Douze cas d'épreuve forcent
donc chaque branche (0 / 1 / 2 / 3 `h1` ; IDREF valide, mort, doublement mort, mixte ;
`aria-invalid` nu, décrit sur lui-même, avec `aria-errormessage`, décrit sur son `fieldset`).

> Les fixtures ne jugent aucun verdict — elles comparent deux implémentations sur la même entrée.
> Le juge reste la règle du corpus (loi 4.16).

**Résultat : 10 occurrences côté code, 11 côté corpus. Une divergence, réelle.**

Deux écarts intermédiaires ont été corrigés en cours de route, tous deux du côté du moteur :

1. `pointe_vers_existant` s'arrêtait au premier identifiant mort d'un élément qui en désignait
   deux — un rapport incomplet se lit comme un rapport propre. Il les remonte tous.
2. L'identité d'une occurrence était comparée sur la prose du motif. Elle l'est désormais sur
   `(page, règle, élément, rang dans le DOM)`, avec la normalisation écrite en clair dans le test.

### 6.3 La divergence qui reste — **elle demande un arbitrage**

Cas `/épreuve/invalide-groupe` :

```html
<fieldset aria-describedby="e"><input aria-invalid="true"></fieldset>
<p id="e">Requis</p>
```

- **Le code** ne signale rien : `el.closest("[aria-describedby],[aria-errormessage]")` remonte
  jusqu'au `fieldset`. Son commentaire le dit : *« Un groupe porte le sien sur son fieldset : on
  remonte. »*
- **Le corpus** signale une faute : `porte(aria-describedby)` n'interroge que l'élément lui-même.

Le code a raison, et `ACCESSIBILITY-R18` avec lui — la règle dit « associé par une relation
programmatique », pas « porté par l'élément ». C'est le `CRITERE` qui est trop strict.

**Le corriger demande un prédicat qui n'existe pas dans la table** : quelque chose comme
`porte_ou_ascendant(attr)`. Conformément au § 2, on ne l'improvise pas — un prédicat absent
remonte comme manque et s'arbitre. La règle R18 reste donc **partiellement automatisée** : son
`CRITERE` couvre le cas simple et sur-signale le cas de groupe, ce que le test dit à chaque
exécution plutôt que de le taire.

### 6.4 Bilan de couverture, sans arrondi

| Contrôle de `verifie-rendu` | État |
|---|---|
| `titre-absent`, `titre-duplique` | **passés au corpus** (TYPOGRAPHY-R06, `compte("h1") == 1`) |
| `message-orphelin` | **passé au corpus** (ACCESSIBILITY-R17) |
| `erreur-sans-message` | **passé au corpus** (ACCESSIBILITY-R18) — au prédicat manquant près |
| `titre-saute`, `cible-trop-petite`, `focus-invisible`, `focus-hors-systeme` | en dur — leur `CRITERE` demande `suite/sans_saut`, `mesure`, `dans`, `declare_exception`, tous non arbitrés (§ 2) |
| `lien-mort`, `lien-hors-basepath`, `erreur-javascript`, `page-injoignable` | hygiène de build — restent hors doctrine (§ 1.3) |

L'instrument du test est **jsdom**, pas Chromium : cette machine n'a pas de navigateur. Le test
ne vaut donc que pour les critères purement structurels — les trois posés. Tout critère
géométrique (`mesure`, `contraste`) devra passer par `execute-criteres.mjs` sous Chromium avant
d'être considéré comme éprouvé. Le harnais le rappelle à chaque exécution.

---

## 7. Deuxième passe — R07 rejoint le corpus, trois mécanismes manquent

### 7.1 Deux rattachements étaient faux (corrigés au § 1.1)

`focus-invisible` était rattaché à **BORDER-U04**, qui parle de l'apparition *instantanée* de
l'anneau ; il relève de **BORDER-U06** (« jamais `outline: none` sans remplacement »).
`focus-hors-systeme` était rattaché à **BORDER-U03**, qui parle du *rayon* de l'anneau ; il
relève de **BORDER-U02** (l'anneau en `control.focus-color`). Deux règles réelles avaient été
citées à la place des deux bonnes — l'erreur est du même genre que celle que la loi 4.15
décrit : le symptôme ne désigne pas le coupable.

### 7.2 TYPOGRAPHY-R07 est passée au corpus

```
MESURE  : aucun saut de niveau de titre (h2 → h4)
CRITERE : suite("h1,h2,h3,h4,h5,h6") sans_saut
```

`suite()` ne parle pas d'un élément mais d'une **séquence** : elle ne pouvait pas être un
prédicat élément par élément, comme le § 2 le supposait. C'est une **quatrième forme**, à côté
de `compte()`, `chaque()` et `aucun()`.

Cinq cas d'épreuve ajoutés (suite propre, saut simple, saut double, deux sauts identiques sur
une page, remontée `h3 → h1` qui n'est pas un saut). **Les deux moteurs donnent exactement les
mêmes six occurrences.**

État du test : 16 occurrences côté code, 17 côté corpus — l'écart unique reste la divergence
R18 du § 6.3, laissée ouverte par arbitrage.

### 7.3 Les trois contrôles restants sont bloqués, chacun par un mécanisme nommé

Ils ne reçoivent pas de `CRITERE` : en écrire un qui se trompe serait pire que de ne pas en
écrire. Chaque blocage est un manque concret, pas une difficulté vague.

| Contrôle | Règle | Ce qui manque |
|---|---|---|
| `cible-trop-petite` | TOUCH-R06 | **Aucune convention DOM ne permet à un élément de déclarer une exception nommée** (`inline`, `essentiel`). `declare_exception` est validé mais inévaluable : il faut d'abord décider comment un code client déclare son exception. Le compilateur remonte ce motif exact, il ne fait pas semblant. |
| `focus-invisible` | BORDER-U06 | **Le pilotage du focus clavier** (`:focus-visible` ne s'applique qu'après une vraie tabulation) **et la remontée d'ancêtres** — le kit pose volontairement l'anneau sur le cadre du composant, pas sur le champ. |
| `focus-hors-systeme` | BORDER-U02 | Les deux mêmes, plus le jeu de crans du thème — celui-là est fait : le prédicat `dans()` lit `--control-focus-*` sur la racine et ne connaît aucune couleur en dur. |

La remontée d'ancêtres est **le même manque que la divergence R18** : `porte_ou_ascendant`.
Arbitré le 2026-07-31 : on ne l'ajoute pas. Conséquence assumée et écrite ici — les deux
contrôles de focus restent dans `verifie-rendu.mjs`, et R18 reste partielle.

### 7.4 Ce que le moteur sait faire aujourd'hui

Formes : `compte()` · `chaque()` · `aucun()` · `suite() sans_saut`.
Prédicats évaluables : `porte` · `pointe_vers_existant` · `mesure` · `dans`.
Prédicats validés mais sans mécanisme : `declare_exception`.
Prédicats absents de la table : `contraste` (déclaré, jamais employé), `porte_ou_ascendant` (refusé).
Précédence : `et` lie plus fort que `ou` ; pas de parenthèses tant qu'aucune règle n'en demande.
