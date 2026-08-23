# Où est quoi

> Une page pour ne plus jamais se demander « c'est quoi ce fichier ».
> La règle tient en une phrase : **on n'écrit que dans les fichiers du niveau 1**.
> Tout le reste se régénère.

---

## Niveau 1 — La source de vérité (on écrit ici)

Trois familles de fichiers, et elles seules, sont écrites à la main.

### `apps/site/content/md/<nature>/<SUJET>-UX.md` et `-UI.md`

**Le corpus.** Une paire par sujet : le UX dit *pourquoi et quoi*, le UI dit *avec quels tokens*.
37 sujets, rangés par nature — `principles`, `languages`, `foundations`, `components`,
`patterns`, `flows`. 36 sont compilés : `laws` porte `audience: humans` et reste une
référence de lecture, jamais chargée par une IA au build.

Chaque règle y prend cette forme :

```
RÈGLE [BORDER-R03] : si un élément n'est identifiable que par sa bordure…
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Toute bordure qui identifie seule un élément doit atteindre 3:1.
MESURE : contraste bordure / fond ≥ 3:1
```

et le fichier se termine par sa bibliographie, la table `| Réf. | Affirmation | Source | Confiance |`
où vivent les `S1…Sn` (couche UX) et `T1…Tn` (couche UI).

**C'est le seul endroit où une règle existe vraiment.** Si une règle est fausse, c'est ici qu'on
la corrige.

### `apps/site/content/md/inventaires/inventaire-cas-usage-<sujet>.md`

**La carte de couverture.** La liste des situations que le sujet doit savoir traiter, chacune
marquée « couvert » ou « non couvert ». Ça n'est pas de la doctrine : c'est le tableau de bord qui
dit ce qui manque. Un « non couvert » est une frontière assumée, pas un oubli.

### `apps/site/content/md/core/` et `methode/`

`DESIGN.md` (les valeurs de tokens), `DECISIONS.md` (le journal daté : ancienne règle, nouvelle
règle, pourquoi), `METHODE.md` (le format lui-même), plus `POURQUOI`, `PROCESS`, `VERIFICATION`.

---

## Niveau 2 — Ce qui se régénère (on n'écrit jamais dedans)

### `apps/site/content/doctrine/<sujet>.json`

**Ce que le site affiche.** Une fiche par sujet : l'essentiel, les cartes de cas d'usage, les
tokens, l'historique — et le tableau `decisions[]`.

⚠️ **Attention, c'est le fichier ambigu du projet.** Il est à moitié dérivé :

| Clé | D'où elle vient |
|---|---|
| `decisions[]` | **régénérée** par `tools/extrait-decisions.py` depuis les `.md` |
| `essentiel`, `cas`, `specs`, `evolution` | **écrites une fois**, issues de la migration de l'ancien site |

Donc : relancer l'extraction ne détruit pas les cas d'usage, elle ne réécrit que `decisions[]`.
Mais si tu veux changer le texte d'une carte de cas, c'est bien dans ce JSON — pas dans le markdown.
C'est la seule entorse à la règle « on n'écrit qu'au niveau 1 », et elle est temporaire : ces
champs ont vocation à passer sous un CMS.

### `dist/build/RULES-<sujet>.md` et `dist/audit/RULES-<sujet>.md`

**Ce que le moteur d'audit lit.** Le corpus compressé, compilé par `tools/compile-regles.py`,
avec les statuts traduits en étiquettes utilisables par une IA :

- `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité
- `[préférence]` — notre choix : proposer en le disant, jamais imposer
- `[non qualifié]` — pas encore tranché : traiter comme une préférence et remonter la question

Deux modes parce que les besoins diffèrent : **build** (je fabrique une interface, donne-moi les
règles) et **audit** (j'inspecte une interface existante, donne-moi les règles *et* les critères
de vérification *et* ce qui n'est pas couvert).

Chaque fichier porte l'empreinte SHA-256 de sa source : on peut prouver de quelle version du
corpus un constat d'audit est sorti.

### `tools/plugin/rules/RULES-*.md`

**Ce que le plugin Cowork embarque.** Fiches condensées, versionnées comme source parce qu'aucun
script ne sait les produire : une fiche condensée n'est pas une projection mécanique, c'est une
réécriture qui garde les règles et jette la prose.

---

## Niveau 3 — Les chantiers (temporaire, se jette)

### `tools/annotations/annot-<sujet>.json` et `sources-<sujet>.json`

**Ce ne sont pas une couche du système.** Ce sont des bons de travail, comme une migration de base
de données : ils décrivent ce qu'il faut écrire dans les `.md`, on les applique une fois, et
plus personne ne les relit.

- `annot-<sujet>.json` → statut, source, énoncé, mesure de chaque règle
- `sources-<sujet>.json` → les lignes à ajouter à la bibliographie du fichier

Ils existent pour une seule raison : l'annotation d'un sujet est un gros travail de lecture, confié
à un agent. Passer par un fichier intermédiaire permet de **relire avant d'écrire**, et de
réappliquer sans risque — les deux outils sont idempotents et travaillent ligne à ligne.

Une fois appliqués, ils ne servent plus qu'à retracer ce qui a été décidé et quand.

### `docs/chantiers/*.md`

**Les journaux et cadrages des chantiers passés** (rangés là le 2026-07-29 pour dégager la racine) :
les trois `CADRAGE-*` (spécifications côté consommateur), `MIGRATION-FILI.md` (l'inventaire du
renommage), `PILOTE-RELATIONS-ARBITRAGES.md` (le pilote relations/tensions, démonstrateur dans
`tools/pilote-relations/`) et les deux `RAPPORT-*-COHERENCE.md` (verdicts du chantier cohérence).
On les lit pour retrouver un raisonnement ; on n'y écrit plus une fois le chantier fermé. À la
racine ne restent que `README.md`, cette carte, et les deux contrats que l'outillage embarque dans
le paquet : `FILI-COMPONENT-CONTRACT.md` et `MISSING-COMPONENT-PROTOCOL.md`.

---

## La chaîne, en une image

```
   ON ÉCRIT ICI                    ON RÉGÉNÈRE                     ON CONSOMME
   ─────────────                   ────────────                    ───────────

   SUJET-UX.md   ──┐
   SUJET-UI.md   ──┼──► extrait-decisions.py ──► doctrine/*.json ──► le site
                   │
                   └──► compile-regles.py    ──► dist/build/      ──► l'IA qui fabrique
                                             ──► dist/audit/      ──► l'IA qui audite
                                                                       (DS Audit)

   inventaire-*.md ─────────────────────────────────────────────► la carte des trous

   annotations/*.json ──► applique-annotations.py ──► réécrit les SUJET-UX.md
                     └──► ajoute-sources.py       ──► réécrit leur bibliographie
                          (chantier, une seule fois par sujet)
```

---

## Les commandes, dans l'ordre où on s'en sert

```bash
# 1. préparer un sujet à l'annotation (pose les identifiants, mécanique)
python3 tools/numerote-regles.py <sujet> [--sec]

# 2. appliquer un chantier d'annotation
python3 tools/ajoute-sources.py        <sujet> tools/annotations/sources-<sujet>.json
python3 tools/applique-annotations.py  <sujet> tools/annotations/annot-<sujet>.json

# 3. projeter vers le site, et contrôler
python3 tools/extrait-decisions.py <sujet>
#   → signale : règles sans source, règles sans cas d'usage, « lois fragiles »
#     (déclarées universelles sans norme ni convergence de deux systèmes)

# 4. compiler pour le moteur d'audit
python3 tools/compile-regles.py --tous
#   → dist/build/ et dist/audit/, plus le compte loi / préférence / non qualifié
```

---

## Le seul chiffre à surveiller

`compile-regles.py --tous` finit par une ligne du genre :

```
36 sujets · 993 règles qualifiées · 0 non qualifiée — instantané du 2026-07-28 ;
l'autorité reste la commande elle-même (`python3 tools/compile-regles.py --tous`)
```

**Les « non qualifiées » sont le vrai reste-à-faire.** Chacune est une règle que le moteur d'audit
ne sait pas défendre : il doit la traiter comme une préférence et poser la question au client, au
lieu de constater. C'est ce nombre qui décide de la valeur d'un audit — pas le nombre de sujets.

Il est à zéro depuis le 2026-07-27, et c'est un état à défendre, pas un acquis : toute règle
ajoutée sans `STATUT` le fait remonter au prochain `--tous`.
