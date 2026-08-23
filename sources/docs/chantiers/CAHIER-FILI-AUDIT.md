---
sujet: fili-audit
type: cahier-des-charges
version: 0.11.1 # 0.11.1 : anonymat — le site d'épreuve devient « le site de référence », son nom et son adresse de recette sortent des documents versionnés (le dépôt est public ; arbitrage Aurélien 2026-08-03, cf. CADRAGE § 1). Aucune mesure modifiée. 0.11.0 : jalon J3 — trois arbitrages rendus : § 10 #1, l'exécuteur vit dans le monorepo (§ 6.1) ; le versionnement du corpus entre au § 10 sous le #8 (écart C-14) et réemploie tools/plugin/etat-publication.json, à étendre (§ 11.5) ; CADRAGE 11.1, les cinq nouveaux sujets sont de type `principle`. C-15 reste ouvert (2026-08-03). 0.10.0 : jalon J2 — réconciliation avec CADRAGE-FILI-AUDIT v0.2.0 : statut levé (C-3) ; lots 1–4 « URL → dossier » / lot 5+ « stack → branche », aucune loi abrogée (C-7) ; offre A = lot 1 + passes 1, 4, 5, 7 (C-7) ; deux axes de registres, quatre états de constat (C-5) ; deux épreuves aux rôles nommés, corrigé de référence à repasser à la machine (C-11). C-10 — le décompte des constats du site de référence — reste OUVERT (2026-08-03). 0.9.0 : loi 4.20 — l'audit suit le statut de frontière, pas la facilité de mesure ; UX + accessibilité d'abord (2026-07-31). 0.8.0 : A.2 refaite à la machine — lot 1, critère ATTEINT ; tension COLOR-R09/R12 à arbitrer (2026-07-31). 0.7.0 : prédicat contraste() — A.1 close, 9 règles exécutables, quatrième issue « non concluant » (2026-07-31). 0.6.0 : instrument statique (CSSOM) — A.1 réconciliée chiffre par chiffre ; 8 règles exécutables (2026-07-31). 0.5.0 : premier passage machine sur Passion Courtage — annexe A.1 corrigée par la mesure, une erreur franche et trois flous de portée (2026-07-31). 0.4.0 : loi 4.19 (doctrine / hygiène) ; lot 1 exécuté — quatre règles pilotées par le corpus (2026-07-31). 0.3.0 : lot 0 CLOS — 201 lignes arbitrées une à une, au plus 54 mesures sur 835 hors portée machine ; loi 4.18 (deux « à trancher ») ; § 11.3 récrit. 0.2.0 # 0.2.0 : lot 0 exécuté (835 MESURE comptées) ; découpage et MVP (§ 11) ; deux lois ajoutées (4.15, 4.16) ; annexe A.2 corrigée — un seul constat sur six tenait. 0.1.0 : consolidation de la session du 2026-07-31
date: 2026-08-03
statut: partiellement arbitré — le Journal de CADRAGE-FILI-AUDIT.md fait foi pour ce qui est décidé
---

# Fili Audit — cahier des charges

> Ce document consolide une session de travail du 31 juillet 2026, puis la **réconciliation du
> 3 août 2026** avec `CADRAGE-FILI-AUDIT.md` (v0.2.0).
>
> **Ce qui est décidé l'est au Journal de `CADRAGE-FILI-AUDIT.md`** — c'est le seul des deux
> documents qui tienne un journal daté, et il fait foi pour les arbitrages. **Ce document fait foi
> pour la doctrine** : les lois, les lots, le MVP. *(Écart C-3, arbitré le 03/08 : ce cahier
> portait « Rien n'y est décidé » pendant que le cadrage écrivait « Arbitré le 31/07 » quatre
> fois. Il ne le porte plus.)*
>
> Il rassemble aussi ce qui a été mesuré et prototypé, pour que la prochaine session reparte de
> là au lieu de tout re-dérouler.
>
> Trois maquettes exécutables l'accompagnent, dans `_to_delete_rangement/pilote/` :
> `navigateur-fili.html` (audit d'un site client), `planche-fili-v2.html` (le banc d'essai
> des ambiances), `fili-audite-par-fili.html` (Fili audité par son propre outil).

---

## 1. Ce que c'est

Un outil qui **se branche sur la stack d'un client, relève des écarts mesurés, propose les
gestes légaux pour les résorber, montre le résultat avant tout engagement, et livre une
branche accompagnée du raisonnement.**

> **Deux états du même produit — arbitré le 03/08 (écart C-7).** La phrase ci-dessus décrit l'état
> du **lot 5 et au-delà**, et ce document le range déjà là : le § 11.2 place
> `panier → aperçu → branche` en lot 5, et le § 11.4 exclut nommément « ni panier, ni aperçu, ni
> branche » du lot 1. **Aux lots 1 à 4, la prestation part d'une URL et rend un dossier
> transmissible** (`CADRAGE-FILI-AUDIT.md` § 2), et le code source du client est hors périmètre —
> seul le rendu est observé. Les lois **4.6, 4.7, 4.8 et 4.10 ne sont pas abrogées** : elles
> n'entrent en vigueur qu'au lot 5.

Fili Audit est déjà nommé dans la Méthode (étape 9, projection « audit » du routeur) et son
mode audit existe dans le paquet. Ce cahier ne crée pas un produit nouveau : il décrit ce
qu'il manque pour que la projection devienne un outil.

### Ce que ce n'est pas

- **Pas un éditeur visuel.** La ligne qui sépare Fili Audit de Claude Design et consorts
  n'est pas l'interface : c'est **la cause**. Tant que chaque geste cite un constat mesuré,
  on est un auditeur. Le jour où l'on offre des gestes sans cause, on devient un éditeur
  visuel de plus, sur un terrain où l'on n'a aucun avantage.
- **Pas un générateur.** Toute proposition sort d'un axe déclaré ou d'un token. Ce qui
  n'en sort pas est une fiche de manque, pas une improvisation.
- **Pas un concurrent d'Impeccable.** Leur détecteur traque les marqueurs de génération IA
  dans du code qu'on possède. Fili Audit mesure la santé du système d'un client, devant son
  équipe. Acheteur différent, moment différent, valeur différente.

---

## 2. Le socle — ce sur quoi ça repose, et qui existe déjà

Ces acquis ne sont pas à construire. Ils expliquent pourquoi ce produit est possible pour
Fili et difficile pour un tiers.

| Acquis | Ce qu'il apporte à l'audit |
|---|---|
| Corpus de règles **sourcées**, avec `MESURE` | Chaque constat cite une autorité, pas un goût |
| **Statut de frontière** (universel / parti pris / implémentation) | Décide mécaniquement du registre du constat |
| **Deux axes de registres** — constat (*avéré · signalé · non couvert · en attente de déclaration*) × solution (*certitude · suggestion · à trancher*) | Sépare l'opposable du discutable du non-décidé, **et le constat de sa solution**. *Écart C-5, arbitré le 03/08 : l'ancien libellé « trois registres » en un seul axe ne tenait pas la loi 4.18. Loi R1 et détail au cadrage § 9.* |
| **Tensions** `T-xxx` (règle contre règle) | Machinerie de détection des conflits, réutilisable telle quelle |
| **Manifeste** vérifié par TypeScript contre l'API réelle | Les gestes proposés ne peuvent pas mentir |
| **Tokens en rôles** (`--control-*`, `--field-*`…), `fili-check` interdit le dur | Un nouveau kit **est** un nouveau `tokens.yaml` |
| **Variabilisation du thème** (31/07) | Sept axes traversent en `var()`, pas seulement la couleur |
| **Chaîne SSR** (31/07) | N'importe quel écran rendu en HTML réel en ~3 s, hors Next |
| `MISSING-COMPONENT-PROTOCOL` | Empêche l'outil d'improviser quand il ne sait pas |

---

## 3. Le parcours

```
scan → constat → panier → aperçu → livraison → re-scan
```

**Scan.** Sur la stack du client, à N largeurs. Produit des constats mesurés, chacun portant
sa règle, sa source, son statut de frontière, sa mesure et les largeurs où il existe.

**Constat.** Navigation un par un (`‹ ›`). Le canevas se place à la largeur où le constat se
voit. Le panneau n'affiche que les actions pertinentes pour ce constat, rangées par portée.

**Panier.** Les actions choisies s'accumulent. Le panier **ordonne** (tokens → composition →
props), **détecte les conflits** (même machinerie que les tensions) et **sépare** ce qui est
applicable tel quel de ce qui exige une relecture humaine.

**Aperçu.** La page réellement modifiée. Quatre comparatifs. Chaque changement décochable.
Le re-scan projeté (`7 → 5`) est le chiffre sur lequel un décideur tranche — pas un nombre
de fichiers.

**Livraison.** Une branche, jamais la production. Trois sorties : le patch, le dossier de
décision, et le prompt **en repli**.

**Re-scan.** Sur la branche. Un constat passe à *résolu* quand le scan ne le trouve plus.
C'est la seule preuve que le changement a fait ce qu'il annonçait.

---

## 4. Les lois

Ce sont les invariants. Les enfreindre transforme le produit en autre chose.

### 4.1 — Le niveau d'une action est déterminé par ce qu'elle écrit

| Portée | Ce que ça écrit | Effet |
|---|---|---|
| **Thème** | un token | descend sur toutes les pages, tous les composants |
| **Page** | une composition | cette vue seulement |
| **Composant** | une prop d'axe déclaré | cette occurrence, vérifiée par `tsc` |

Ce n'est pas un rangement éditorial, c'est la portée réelle. Trié ainsi, chaque verbe tombe
au bon endroit tout seul, et l'utilisateur sait toujours ce qu'il engage.

### 4.2 — Local ou systémique n'est pas un choix, c'est un calcul

Le discriminant existe déjà : le **statut de frontière**. Une norme universelle enfreinte à
un endroit se corrige à cet endroit. Un parti pris d'identité ne se corrige jamais
localement — c'est un token, par définition. Ajouter la **récurrence** rend le tri
mécanique : *« ce constat apparaît 34 fois sur 7 écrans → ce n'est pas une correction, c'est
une valeur »*. L'outil propose le bon périmètre au lieu de le demander.

### 4.3 — Le registre est un mécanisme de confinement

Une règle empruntée à un tiers ne peut **structurellement jamais** atteindre « à corriger » :
ce registre exige une norme opposable et une source primaire. Elle entre en *suggestion* ou
reste *à trancher*, et elle y reste. C'est ce qui rend l'emprunt sûr — on peut absorber
soixante règles étrangères sans diluer d'un gramme l'autorité du corpus.

*Vocabulaire, depuis le 03/08 (écart C-5).* Sur l'axe du **constat**, « à corriger » se lit
désormais **avéré**, et « à trancher » se scinde en **non couvert** et **en attente de
déclaration** (loi 4.18). *Suggestion* et *à trancher* restent les noms de l'axe de la
**solution**. Le mécanisme de confinement décrit ici est **inchangé** — seuls les noms le sont.
`CADRAGE-FILI-AUDIT.md` § 9.1 porte la correspondance dans l'autre sens.

### 4.4 — Trois choix sortent d'un axe ou d'un token, jamais d'une génération

Si les propositions ne sortent ni d'un axe déclaré ni d'un token, ce n'est pas une variante :
c'est une **fiche de manque**. C'est la garde qui empêche l'outil de dériver vers la
génération libre le jour où il ne sait pas.

### 4.5 — Ne jamais simuler ce qu'on ne peut pas garantir

Chaque changement porte son exactitude :

- **exact** — le correctif *est* un delta CSS, ou tout passe par `var()`. L'aperçu est la production.
- **partiel** — la part représentable est montrée, le reste est nommé.
- **visible après build** — l'outil se tait plutôt que de faire semblant.

Le jour où l'aperçu ment une fois, plus rien du reste ne vaut. *(Vérifié à la dure pendant la
session : un aperçu forcé affichait un menu compact sans ses propres styles — un trait au lieu
d'un burger.)*

### 4.6 — L'aperçu précède la branche

Le bouton dit « **Voir l'aperçu** ». La branche est la conséquence de l'approbation, pas
l'approbation. Un décideur ne lit pas un diff : il regarde la page.

### 4.7 — Jamais « appliquer en production »

« Ouvrir une branche », jamais `main`. Git est déjà le mécanisme de revue du client, sa CI
tourne, son dev relit. C'est la seule version qu'un responsable technique acceptera.

### 4.8 — Le livrable est le raisonnement, pas seulement le correctif

Chaque action retenue produit une entrée de `DECISIONS-locales.md` : constat, règle, source,
statut de frontière, arbitrage, date. **C'est ce qui empêche le système du client de
repourrir dans six mois**, et c'est ce qu'aucun outil concurrent ne donne.

### 4.9 — Un client ne modifie jamais le kit Fili

Il reçoit un `tokens.yaml` et un `DECISIONS-locales.md` — les deux surfaces que le cadrage
lui attribue déjà. « Modifier tout le kit » se lit **« instancier un kit pour ce client »**.
Sinon, au troisième client, Fili est une bouillie de compromis.

### 4.10 — Le prompt est un repli

Il existe pour les stacks non patchables (CMS, éditeur propriétaire). S'il devient le
livrable normal, tout l'avantage du système est jeté — c'est exactement ce que font ceux qui
n'ont pas de design system dessous.

### 4.11 — Un geste sans cause ne fait pas bouger le re-scan

Le mode « sélection » (cliquer un bloc pour agir dessus sans constat) est **déclassé** : pas
un pair du mode constats, une dérogation. Tout geste né d'une sélection entre au panier
marqué *origine : opérateur*, et sa décision porte « motif : préférence, aucun écart mesuré ».
Le bilan affiche « 4 changements, dont 1 sans écart mesuré ». Ça ne l'interdit pas — un
client demande parfois des choses sans cause — mais la trace le dit, et ça s'auto-régule.

### 4.12 — La largeur est un axe du scan, pas un réglage d'affichage

Les défauts responsive n'existent qu'à une largeur donnée et sont **invisibles en analyse
statique**. Le scan tourne à N largeurs ; chaque constat porte les largeurs où il apparaît ;
naviguer vers un constat place le canevas à la bonne largeur.

### 4.13 — La largeur de rendu est découplée de la place à l'écran

Sans quoi le scan dépend du moniteur de celui qui le lance et deux personnes n'obtiennent pas
le même audit. 1024 rend à 1024 et se **réduit** pour tenir ; il ne se divise jamais.

### 4.14 — Le comparateur est une primitive, pas une fonction de l'audit

Tout ce que produit Fili se présente en deux états : avant/après un correctif, deux ambiances,
deux valeurs d'axe, deux versions du kit. Une seule brique les sert tous — Galerie, atelier,
non-régression, doctrine, boucle de génération. À extraire en module (~200 lignes).

### 4.15 — Le symptôme ne désigne pas le coupable

Une mesure donne un symptôme, jamais un fautif. `2.54:1` est **le même chiffre** dans deux
situations aux corrections opposées : le token est mal valué (→ thème, systémique) ou le token
est bien valué et mal employé (→ page, local). Corriger la valeur pour réparer un emploi fautif
dégrade tous les emplois légitimes.

**Donc : aucune attribution sans domaine d'emploi déclaré.** `COLOR-UI.md` porte déjà une table
« fonds admis » par token et `COLOR-R12` déclare le domaine de `text-muted` en toutes lettres —
mais en prose, illisible par une machine. **Rendre les domaines d'emploi lisibles par la machine
est une brique à part entière** (§ 6.5).

*Précédent : le 31/07, un constat a été porté contre `--text-muted` en citant COLOR-R12 — la
règle même qui dit que le token est correct et que l'emploi est fautif. Cas F01 reproduit à
l'identique.*

### 4.16 — Un corpus de test écrit par l'auditeur mesure l'auditeur

La planche et tout support de test ne contiennent **aucun CSS écrit à la main** : leur mise en
page sort des composants du kit (`Container`, `CardGroup`, `Divider`) et de rien d'autre. Sinon
chaque scan mesure l'échafaudage, et l'outil se donne raison tout seul.

*Précédent : sur les six constats de « Fili audité par Fili », cinq venaient de la feuille de
style de la démo. Un seul tenait.*

### 4.17 — Rien ne progresse sur un composant manquant

Si l'app d'audit a besoin d'un composant ou d'un pattern que le kit n'a pas, le travail
**s'arrête** : fiche de manque → arbitrage → tranche verticale complète → reprise. C'est le
`MISSING-COMPONENT-PROTOCOL` retourné contre le projet lui-même. Corollaire : les maquettes
HTML du 31/07 sont du jetable démonstratif, **jamais une base de code**.

### 4.18 — Il y a deux « à trancher », et le rapport doit les distinguer

- **non couvert** — le référentiel ne dit rien sur ce cas. Rien n'est proposé, rien n'est
  attendu de personne. *(Ex. le trait pointillé d'une zone de dépôt.)*
- **en attente de déclaration** — le référentiel dit, mais il lui manque une donnée qui
  appartient au client. *(Ex. « action à enjeu réel », « champs liés par le sens »,
  « réponse majoritaire identifiée ».)*

Le second n'est **ni un écart ni une conformité** : c'est un quatrième état de rapport. Il se
lit comme une question précise posée au client, et sa réponse **débloque mécaniquement une
règle** — la déclaration devient une entrée de `DECISIONS-locales.md`, et la règle passe au
périmètre machine au scan suivant.

**Un audit qui tait ce qu'il n'a pas regardé est un audit qui ment par omission.** Les mesures
en attente de déclaration figurent au rapport, nommément.

### 4.19 — Un constat de doctrine et un contrôle d'hygiène ne se mélangent pas

Un audit produit deux natures de résultat, et les confondre abîme la seule qui compte.

- **Constat de doctrine** — il cite une règle, son identifiant, son statut de frontière et sa
  source. Il est opposable : on peut en discuter, le contester, l'accepter.
- **Contrôle d'hygiène** — il ne cite rien parce qu'il n'y a rien à citer. Un lien mort, une
  erreur JavaScript, une page injoignable ne sont pas des écarts au référentiel : ce sont des
  faits de build.

Une 404 rangée parmi les violations du design system fait deux dégâts en un : elle donne à un
défaut d'intendance l'autorité d'une règle, et elle noie les vrais constats dans un inventaire
où le lecteur ne sait plus ce qui se discute. **Le rapport les sépare, et il nomme la
séparation** — l'un renvoie à une fiche, l'autre à un ticket.

Corollaire outillage : un contrôle qui ne peut citer aucune règle n'a rien à faire dans le
moteur piloté par le corpus. Il reste dans les gardes de build, où il est à sa place.

---

### 4.20 — L'ordre d'un audit suit le statut de frontière, pas la facilité de mesure

**Un audit commence par l'UX et l'accessibilité. Les fondations viennent après.** Ce n'est pas
une préférence de présentation, c'est ce que dit notre propre corpus quand on le compte :

| Couche | MESURE | dont propriétés universelles |
|---|---|---|
| `languages` | 94 | **61 %** |
| `flows` | 59 | **58 %** |
| `principles` | 99 | **53 %** |
| `components` | 322 | 40 % |
| `foundations` | 173 | **39 %** |
| `patterns` | 90 | 30 % |

Les couches UX concentrent les normes **opposables** ; les fondations concentrent les partis
pris d'identité, qui partent en *suggestion* par construction. Un audit qui ouvre sur « six
rayons distincts » et enterre « ce formulaire n'associe aucun message d'erreur » a inversé sa
propre échelle de gravité — et se lit comme un linter, pas comme un audit.

**Corollaire, et c'est le vrai argument :** on ne peut pas auditer l'accessibilité depuis la
fiche accessibilité. `ACCESSIBILITY-UX` ne porte que 11 `MESURE` parce qu'elle est conçue pour
*poser l'obligation et renvoyer au propriétaire*. L'accessibilité réelle vit dans `FORM`,
`VALIDATION`, `INTERACTION`, `GESTURE`. **« Accessibilité d'abord » impose donc « UX d'abord » :
ce ne sont pas deux priorités, c'est la même.**

**Le piège que cette loi ferme.** L'ordre naturel de construction d'un outil est l'ordre de la
facilité : on rend exécutable ce que l'instrument voit déjà. C'est ainsi qu'on obtient neuf
règles justes prises dans la moitié la moins opposable du corpus (constat du 2026-07-31). La
règle désigne l'instrument, jamais l'inverse — **si une règle opposable demande un instrument
qui n'existe pas, on construit l'instrument.**

L'objection « les règles UX ne se mesurent pas » est déjà réfutée : le lot 0 a compté au plus
54 `MESURE` sur 835 hors de portée machine. Et pour celles-là, le rapport a ses états —
*non concluant*, *en attente de déclaration*, *assisté*.

---

---

## 5. Le comparateur — spécification

Quatre modes, deux contrôles seulement dans la barre (six boutons se sont révélés
incompréhensibles à l'usage).

| Contrôle | Rôle |
|---|---|
| `⇄ après` | un seul bouton d'état : affiche ce qu'on voit, un clic (ou `B`) montre l'autre |
| `comparer ▾` | menu où **chaque option porte son explication** |

| Mode | Quand | Note |
|---|---|---|
| **Côte à côte** | par défaut ; toujours valable | défilement lié, pages jointes par une gouttière et centrées comme une paire |
| **Glisser l'une sur l'autre** | changements de **thème** | suppose une géométrie identique ; **jamais interdit**, mais averti en nommant le changement qui déplace |
| **Bascule** | repérer un écart | même défilement, même largeur, coût d'espace nul |
| **Différences** | savoir *où* regarder | cadre les éléments dont le rendu change (rectangles + styles calculés comparés) |

**Loi du comparatif** — le contenu doit être **strictement identique des deux côtés** : mêmes
champs, même ordre, aucun texte ajouté ni retiré. Corollaire : un cas du registre *à trancher*
est rendu **à l'identique** dans l'après — on ne corrige pas ce que personne n'a arbitré, et
ça démontre visuellement le troisième registre.

---

## 6. Les briques manquantes, dans l'ordre

### 6.1 — L'exécuteur des `MESURE` — **priorité 1**

Le corpus porte déjà un champ `MESURE`, et `cout-audit.py` compte depuis des mois combien de
règles portent un critère constatable, en disant que c'est *« le seul chiffre qui prédise la
reproductibilité d'un audit »*. **L'entrée d'un détecteur est fabriquée depuis des mois sans
que le détecteur existe.** Aucun greffon ne peut le fournir : un greffon exécuterait les
critères d'un autre.

Forme : déterministe, sans clé d'API, sur la source **et** sur la page rendue, JSON + code de
sortie, constats renvoyés à l'agent **avant** qu'il rende la main.

> **Où il vit — arbitré le 03/08 (§ 10 #1) : dans le monorepo, pas dans un dépôt séparé.** C'est
> l'état de fait, désormais déclaré. `tools/execute-criteres.mjs` (216 l.),
> `tools/criteres-grammaire.mjs`, `tools/instrument-statique.mjs` (90 l.) et
> `tools/instrument-interactif.mjs` (62 l.) y sont déjà, et `npm run criteres` les appelle.
> `execute-criteres.mjs` lit `apps/site/content/doctrine` et sert `apps/site/out` : il est
> **couplé au monorepo par deux chemins en dur**, et rien ne se déplace avant que le lot 1 ait
> prouvé que le corpus tourne. **Coût assumé** : si le § 10 #7 tranche pour un détecteur ouvert à
> corpus fermé, l'extraction reste à faire — mais pas avant le lot 5.

Premier lot : l'exécuteur, plus six ou sept mesures de composition — nombre de valeurs
d'espacement distinctes entre frères, ratio entre niveaux typographiques consécutifs, nombre
d'actions `filled` de même rang, nombre d'arêtes d'alignement, teinte du token primaire
comparée aux palettes standard, part du texte dans une seule famille.

**Première cible : Fili lui-même.** Si le système génère des écrans que son propre audit
signale, la boucle est cassée — et il vaut mieux l'apprendre avant d'aller vendre.

### 6.2 — L'ingestion du référentiel client — **priorité 2**

Sans elle, l'audit ne peut mesurer que l'universel, jamais l'écart au système du client. Le
routeur interdit `tokens.yaml` en mode audit, à raison : il faut charger **le leur**.

Format : ne pas en inventer un. `DESIGN.md` (spécification Google Stitch, celle d'Impeccable)
est ouvert, portable et déjà lu par d'autres outils. **Le produire en livrable** — leur
système lu, confronté au corpus, rendu corrigé — fait de la distribution concurrente un canal
au lieu d'un rival.

### 6.3 — La mémoire des constats — **priorité 3, et bloquante**

`CADRAGE-CONSTATS-CONSOMMATEUR` le signale depuis le 28/07 : *« un constat émis n'a ni statut,
ni destinataire, ni mémoire »*. Ce qui était un inconfort théorique devient **bloquant** ici :
sans identité ni comptage, on ne peut ni décider entre local et systémique (§ 4.2), ni suivre
ce qui a été traité, ni faire passer un constat à *résolu* au re-scan.

### 6.5 — Les domaines d'emploi lisibles par la machine — **condition de la loi 4.15**

Une déclaration par token : rôle, fonds admis, ce qu'il ne doit jamais porter. La matière
existe (`COLOR-UI.md`, `COLOR-R12`), elle est en prose. Sans elle, le détecteur attribue au
hasard et fait corriger une valeur juste pour réparer un usage faux — le pire dégât qu'un
outil d'audit puisse causer, parce qu'il est invisible et qu'il se propage partout.

### 6.4 — Le runner

Rendu à N largeurs, navigateur sans tête, styles calculés, contrastes, mesures de mise en
page. Condition de la loi § 4.12. Pour un site statique, l'injection CSS suffit ; pour une
application cliente, il faut pouvoir la construire.

---

## 7. La doctrine responsive — l'échelle ordonnée

`ADAPTIVE-UX` possède déjà le critère (nécessaire / secondaire) et les gestes autorisés, mais
listés à plat. Ce qui manque est l'**ordre**.

**Le déclencheur, en trois seuils qui ne se valent pas :**

1. **pas la place** — débordement, binaire → **norme** (WCAG 1.4.10 Reflow)
2. **trop serré** — sous le seuil de densité → parti pris
3. **nuit à la lecture** — longueur de ligne, cible tactile, hiérarchie écrasée → parti pris

**Les trois échelons, jamais sautés :**

1. **En dessous** — ça reste, ça se réordonne. Aucune perte.
2. **Caché derrière une commande** — ça reste atteignable. Perte d'immédiateté seulement.
3. **Enlevé** — ça disparaît. Perte réelle.

**Loi :** on ne saute pas un échelon. Passer directement de visible à absent, c'est décider
qu'un contenu est accessoire sans l'avoir jamais dit.

**`MESURE` nouvelle, comptable :** tout élément passant en `display:none` sous un seuil sans
commande équivalente ni report en dessous.

**Le critère n'appartient pas au designer.** L'échelon dépend du **statut du contenu** —
nécessaire, secondaire, **accessoire** — et ce statut appartient au client. Le scan mesure,
énumère les trois gestes légaux, et **s'arrête**. Tant que le statut n'est pas déclaré, c'est
un *à trancher*. Une fois déclaré, il vaut pour cet élément à toutes les largeurs, pour
toujours — une entrée `DECISIONS-locales.md` qui se capitalise.

**« Accessoire » est un troisième statut** que la doctrine actuelle n'a pas, et c'est le seul
qui autorise le retrait.

**Le geste et le seuil sont deux questions distinctes.** Sur Passion Courtage l'échelon était
bon (la nav se cache derrière une commande, échelon 2, légitime) ; c'est le **seuil** qui était
faux — 721 px au lieu de 960. Un outil qui confond les deux fera corriger un geste correct.

---

## 8. Impeccable — quoi en faire

**Absorber le mécanisme, sourcer les jugements, écrire beaucoup moins de règles.**

**Ce qu'on absorbe** — la forme : détecteur déterministe sans clé, source **et** rendu, JSON +
codes de sortie, hooks qui renvoient les constats à l'agent avant qu'il rende la main. Rien
là-dedans ne leur appartient vraiment.

**Ce qu'on n'absorbe pas** — leur liste de règles. Un greffon ferait parler deux référentiels
dans un même constat, sans qu'aucun ne cède à l'autre : exactement la situation que la
relation `cede-a` a été créée pour rendre impossible. Et leurs constats n'ont ni `MESURE`, ni
statut de frontière, ni source : les adapter reviendrait à **inventer** ces champs, ce qui est
pire qu'une reprise assumée.

**« Non sourcé » n'existe pas** dans ce système — l'étape 4 l'interdit. Mais la source, c'est
**eux** : référentiel public, versionné, sous Apache 2.0, adopté. Le citer est exactement ce
que la Méthode appelle un benchmark (étape 5) — ce qui a déjà été fait avec Atlassian sur
`BORDER-R04`.

```
Source     : Impeccable — <identifiant de règle> (v.X) · benchmark · consulté le 2026-07-31
Confiance  : emprunté          ← cran nouveau, distinct de established / emerging
Frontière  : parti pris d'identité
Registre   : suggestion        ← jamais « à corriger » (§ 4.3)
```

**Le travail qui nous revient est la `MESURE`.** Leur règle dit « overused font » — un
jugement, pas un critère. La nôtre doit dire : *une seule famille porte plus de 90 % du texte
ET aucun registre distinct ne porte les métadonnées.* Traduire l'avis en critère constatable,
c'est ce qui rend la règle nôtre. **Ce qui ne se traduit pas en critère comptable ne rentre
pas** — leurs cinq jugements « LLM-only » restent dehors : sans critère, pas de
reproductibilité, donc pas de chaîne de preuve.

Ordre de grandeur : **15 à 20 règles sur 59** passent ce filtre. Le reste vise la détection de
génération IA, un autre problème.

**Effet de bord favorable** : citer un référentiel externe *renforce* la proposition. En
réunion, « c'est notre parti pris » se discute ; « c'est un standard formalisé par un outil
suivi par des dizaines de milliers de dépôts » se discute moins.

**Contrepartie assumée** : on perd leur maintenance, les marqueurs évoluant avec les modèles.
Parade : lancer leur CLI **à côté** deux ou trois fois par an, comme contrôle de couverture —
*« qu'attrapent-ils que nous n'attrapons pas ? »*. C'est l'étape 6 en pratique périodique, pas
un greffon.

---

## 9. Le doute sur la restitution, et ce qu'il révèle

Constat posé pendant la session, et qui dépasse l'audit : **Fili a des références, pas des
mots.** `BORDER-R04` est un identifiant fait pour être stable en machine ; il ne se prononce
pas en réunion. Les huit intentions sont nommées par **contexte** (formulaire, dashboard) ;
personne ne dit « je fais un dashboard », on dit *c'est trop chargé*, *c'est plat*. Une règle
énonce un **état**, un verbe montre un **delta** — et le client n'achète pas un état.

> **Une rigueur qui ne se voit pas est indiscernable d'une absence de rigueur.**

Il manque donc une **couche de verbes** : une dizaine de mots prononçables, chacun résolvant
vers un paquet de règles déjà possédées, chacun démontré par un delta réel. Elle sert Fili DS
avant de servir l'audit. *(À cadrer séparément — hors périmètre de ce cahier.)*

### Les neuf changements d'identité

Sept valeurs, deux primitives. Aucun ne touche au corpus, aux statuts de frontière ni à la
Méthode : ce qui manquait n'a jamais été de la doctrine.

1. Retirer l'aplat de marque du chemin par défaut (une seule occurrence par vue)
2. Un fond chaud plutôt que les gris froids de Tailwind
3. Trois familles, trois métiers — les emplacements existent, `--font-label` est vide
4. Écarter l'échelle typographique ; créer un registre **petit** (mono, capitales, interlettré)
5. Des espacements **sémantiques** (intra / groupe / bloc) et l'interdiction d'employer la même valeur à deux niveaux
6. Un **régime sans surface** pour `CardGroup` — la cellule définie par le filet et le vide, pas par une boîte
7. L'**étiquette éditoriale** (`01`, `REFINE`) — le dispositif le moins cher pour hiérarchiser sans boîte
8. Déplacer le budget de mouvement de l'**expressif** vers les **transitions d'état**
9. Une famille de règles de **composition** (le corpus est entièrement atomique aujourd'hui)

---

## 10. Ce qui reste à arbitrer

| # | Question | Pourquoi ça bloque |
|---|---|---|
| ~~1~~ | ~~Ouvre-t-on un dépôt d'audit séparé, ou une app dans le monorepo ?~~ — **TRANCHÉ le 03/08 : le monorepo** (§ 6.1) | ~~Détermine où vit l'exécuteur~~ — **débloqué** |
| 2 | Le cran de confiance `emprunté` entre-t-il dans le format des fiches ? | Conditionne toute reprise d'Impeccable |
| 3 | « Accessoire » devient-il un troisième statut de contenu ? | Condition de l'échelle responsive (§ 7) |
| 4 | `--font-label` porte quoi ? | Constat *à trancher* ouvert sur notre propre planche |
| 5 | Arbitre-t-on enfin les valeurs d'identité ? | Cinq tokens sur cinq sont les défauts Tailwind |
| 6 | Le mode « sélection » est-il livré, même déclassé ? | Frontière avec les éditeurs visuels (§ 4.11) |
| 7 | Ouvre-t-on le détecteur et garde-t-on le corpus fermé ? | Modèle économique |
| ~~**8**~~ | **Le versionnement du corpus** — que porte la « version du corpus » de l'empreinte de passage (§ 11.5) ? — **TRANCHÉ le 03/08 : on réemploie le mécanisme existant, à étendre** (§ 11.5) | **Le seul arbitrage que le MVP exigeait** (§ 11.6). *Ajouté le 03/08 : il ne figurait dans aucune des deux listes — écart C-14.* |

---

## Annexe A — Ce qui a été mesuré, sur pièces

### A.1 — Passion Courtage (`site-v3/index.html`, 5 pages)

| Constat | Mesure | Registre |
|---|---|---|
| Débordement horizontal | 834 px : +17 · **768 px : +80** · rien à 900, 600, 390 | **à corriger** (WCAG 1.4.10) |
| Verrou de marque scindé | 2 lignes dès 900 px, 3 lignes à 834 px | suggestion |
| Aucune échelle d'espacement | 20 `padding` + 15 `gap` = **35 valeurs en dur** | suggestion |
| Aucune échelle typographique | **17 `clamp()` distincts**, 0 registre de métadonnée | suggestion |
| Six rayons | 2, 3, 10, 12, 14, 32 px | suggestion |
| Taille orpheline | `font-size: 16.5px`, 1 occurrence | suggestion |
| Emphase intra-titre | 8 `<em>` dans `h1`/`h2` | **à trancher** |

~~**Zéro norme enfreinte hors responsive** : contrastes ≥ 4.6:1, `rel="noopener"` sur les 13
liens externes, hiérarchie de titres correcte.~~ **Corrigé le 2026-07-31 par la machine** (voir
A.1 bis). *Un outil capable de dire « rien à signaler ici » est infiniment plus crédible qu'un
outil qui trouve toujours quelque chose — encore faut-il qu'il ait raison de le dire.*

### A.1 bis — Ce que la machine a corrigé du relevé à la main

Premier passage du moteur piloté par le corpus sur les 6 pages, Chromium 141, 8 largeurs
(`docs/rapports/RAPPORT-PASSION-COURTAGE.md`).

| Relevé à la main (A.1) | Machine | Verdict |
|---|---|---|
| « hiérarchie de titres correcte » | **h2 → h4 sur les 6 pages** (le pied de page ouvre en `h4`) | **Faux.** Violation de `TYPOGRAPHY-R07`, propriété universelle. |
| Débordement : 834 → +17, 768 → +80, rien à 900/600/390 | Confirmé. **Plus : +125 px à 721 px, et +11 px à 320 px sur `/contact.html`** | **Incomplet.** Le pire point (721, la bascule elle-même) et le seul régime que le corpus norme (320) n'avaient pas été balayés. |
| 8 `<em>` dans `h1`/`h2` | 8 sur `index.html`, **28 sur le site** | **Portée floue.** Le chiffre valait pour une page, la ligne se lisait comme valant pour cinq. |
| 13 liens externes en `rel="noopener"` | **33 liens externes, tous en `noopener`** | Même flou de portée ; le constat tient. |
| Contrastes ≥ 4.6:1 | **Aucun écart concluant** sur les 6 pages ; **65 mesures non concluantes** (texte sur dégradé) | **Tient, sous réserve nommée.** Le relevé ne disait pas qu'une partie du site n'était pas mesurable — la machine, si. |
| « Aucune échelle d'espacement — 20 `padding` + 15 `gap` = 35 valeurs en dur » | **36 `padding` + 22 `gap` = 58 valeurs distinctes** ; aucun token `--spacing-*` déclaré | **Sous-compté.** Le relevé n'avait vu que les raccourcis, pas les propriétés longues (`padding-top`, `padding-inline-start`…). |
| « Aucune échelle typographique — **17 `clamp()` distincts** » | **17 `clamp()` distincts — mais 3 en `font-size`, 14 en espacement** | **Chiffre juste, attribution fausse.** Loi 4.15 en plein : le symptôme (17 `clamp()`) avait été rangé sous la typographie alors qu'il appartient à 82 % à l'espacement. |
| « Six rayons : 2, 3, 10, 12, 14, 32 px » | **huit** : les six, plus `0` et `50%` | **Presque juste.** Les deux valeurs manquantes sont celles qu'on ne « voit » pas comme des rayons. |
| « Taille orpheline `font-size: 16.5px` » | 42 valeurs de `font-size` distinctes ; aucune règle du corpus ne norme leur nombre | Observation valable, mais **non couverte** : rien à quoi la confronter. |

**Ce que ça enseigne.** Le corrigé de référence contenait **une erreur franche, une attribution
fausse, un sous-comptage et trois flous de portée** — sur sept lignes. C'est la loi 4.16 prise à revers : un corpus de test écrit par l'auditeur mesure
l'auditeur — y compris quand l'auditeur croyait mesurer le client. Le critère falsifiable du
lot 1 a fait exactement ce pour quoi il était écrit.

Bascule réelle : `@media not all and (min-width:45.0625rem)` = **721 px**, compilé en dur.
Fenêtre de casse : 721 → ~870 px. Correctif : un token, `breakpoint.nav → 60rem`.

### A.2 — Fili lui-même (planche du système) — **corrigé**

Le premier passage a produit six constats. **Cinq mesuraient la feuille de style de la démo,
pas le système.** Seul le dernier tient.

| Constat initial | Verdict après vérification |
|---|---|
| `--text-muted` illisible (2.54:1) | **Faux.** COLOR-R12 déclare la valeur et réserve le token aux *métadonnées accessoires*. C'est la démo qui l'a posé sur du texte fonctionnel — cas F01 reproduit. Emplois légitimes dans le kit : placeholders, chevrons, média vide, tête de groupe. |
| `--font-label` rendu à 0 % | **Faux.** `dropdown.tsx:427` l'emploie ; la démo n'ouvrait aucun menu. |
| 6 px et 14 px hors échelle | **Faux.** `gap` écrits à la main dans la feuille de la démo. |
| 10 tailles de texte | **Faux.** `.62rem` / `.65rem` de la démo. |
| Rôle de `--font-label` non couvert | **Faux.** COLOR-UI et Dropdown le documentent. |
| **Palette = défauts Tailwind** | **Tient.** `--primary` = Indigo 600, gris = Gray 900/600/400/200 — **5 tokens sur 5**, dans `tokens.css`. Aucune valeur d'identité n'a jamais été arbitrée. |

**Fili n'a donc aucun « à corriger » sur sa planche**, comme Passion Courtage. Il a un parti
pris d'identité jamais arbitré — ce qui est un tout autre sujet, traité au § 9.

### A.2 bis — Refaite à la machine le 2026-07-31 (`docs/rapports/RAPPORT-FILI-PAR-FILI.md`)

Neuf règles sur les 90 pages construites. **643 écarts de contraste, zéro sur un élément portant
`data-slot`** : aucun ne touche un composant de `@fili/react`. La distinction que le passage à la
main avait ratée cinq fois sur six est désormais *prouvée* — parce que le kit se signe.

| Ce que la machine ajoute | |
|---|---|
| **Tension COLOR-R09 / COLOR-R12** | R09 pose 4,5:1 en propriété universelle ; R12 déclare `text-muted` à 2,54:1 et en autorise l'emploi. WCAG 1.4.3 ne connaît pas d'exception « métadonnée accessoire ». **À arbitrer.** |
| Le grief Tailwind s'étend à l'espacement | 24 utilitaires (`.p-3`, `.gap-1.5`, `.mt-px`) hors de `--space-*` — même famille que « palette = défauts Tailwind ». |
| Le site de documentation ne suit pas l'échelle de rayon | 16 couples hors `radius.*`, tous hors kit. |
| Six libellés de nuancier **blanc sur blanc** | 1:1 — invisibles. |
| Écart de nommage doctrine / tokens | la fiche écrit `spacing.base`, le thème émet `--space-base`. |

### A.3 — Deux défauts du kit trouvés au passage

- `packages/react/src/components/input/input.tsx:313` passe `style="ghost"` à `CompactButton` —
  l'alias **déprécié**. Le kit déclenche son propre avertissement à chaque rendu d'`Input.Password`.
- `Card` n'est pas dans le bundle « Création de compte », et son mode *regular*
  (`@container ds-card (min-width: 24rem)`) bascule la surface en rangée dès 384 px de
  conteneur. L'employer pour un formulaire casse silencieusement la mise en page.

---

## Annexe B — Chaîne de rendu (vérifiée)

Transpiler `packages/react/src` → `.mjs` (`ts.transpileModule`, `jsx: ReactJSX`), SSR avec
`renderToStaticMarkup`, CSS = tokens + `@tailwind` + les 15 `.css` de composants, assemblage en
un fichier autonome. ~3 s de bout en bout, hors Next.

Détail complet, pièges et parades : mémoire projet `recette_rendu_kit_hors_next.md`.

---

## 11. Découpage et MVP

### 11.1 — Le piège nommé

*« C'est l'interface qu'ils verront »* est vrai, et c'est exactement pourquoi il ne faut pas
commencer par elle. **L'interface est le produit vu ; l'exécuteur est le produit vendu.** La
maquette a coûté une journée et se refera vite une fois le moteur là. L'inverse est faux — une
belle interface au-dessus d'un moteur vide est précisément ce qu'on reproche aux concurrents.

### 11.2 — Sept lots, dans cet ordre

| Lot | Livre | Pourquoi à cette place |
|---|---|---|
| **0** ✔ | Le compte des `MESURE` | Décide si le projet existe |
| **1 — MVP** | Une URL → un rapport sur les **deux axes de registres** (§ 4.3) | Prouve que le corpus tourne |
| **2** | Domaines d'emploi lisibles par la machine (§ 6.5) | Sans ça, le lot 1 attribue faux (loi 4.15) |
| **3** | Mémoire des constats : baseline, récurrence, statuts | Condition du **deuxième** scan, donc du modèle |
| **4** | Ingestion du référentiel client | Condition de l'écart au **leur** |
| **5** | La Solution : panier → aperçu → branche | Déjà maquetté, rien d'inconnu |
| **6** | L'app, les rôles, les droits | Le plus visible, le moins risqué, donc le dernier |

Ordre non négociable sur les trois premiers. **Un lot ne s'ouvre pas tant que le précédent n'a
pas passé son critère.**

### 11.3 — Lot 0 — CLOS le 2026-07-31

**835 `MESURE` sont écrites dans la doctrine.** Comptage, pas estimation.

Un premier classement automatique par instrument a laissé 201 lignes indécidables. **Ces 201
ont été arbitrées une par une**, question unique : *un programme peut-il trancher sans
jugement ?* Verdicts et motifs dans `_to_delete_rangement/pilote/lot0-verdicts.csv`.

| Sur les 201 les plus dures | n | % |
|---|---|---|
| machine | 147 | 73 % |
| doute (à resserrer) | 22 | 11 % |
| assisté (hors portée) | 32 | 16 % |

Le classificateur était **pessimiste** : trois quarts de ce qu'il abandonnait sont décidables.

**Le chiffre à retenir — et c'est un majorant vérifié sur l'échantillon le plus défavorable :
au plus 54 mesures sur 835 sont hors de portée d'une machine.** (Les 634 autres n'ont pas été
relues une à une ; elles portent la mention *à recontrôler à l'implémentation*. Ne pas
claironner « 94 % ».)

**Découverte qualitative, plus importante que le chiffre.** Les 32 « assisté » ont tous la même
forme : chacun contient un mot qui nomme une **intention produit** et non une chose observable
— « action à enjeu réel », « forte friction perçue », « champs liés par le sens », « information
requise pour agir », « un même statut », « réponse majoritaire identifiée ». Ce n'est pas un
défaut du corpus : c'est **la frontière entre le design et le produit**, et elle est nette.

D'où la loi 4.18 : la plupart deviennent mesurables **le jour où le client déclare la donnée**.
Les 22 « doute » se scindent pareillement — **13 attendent une déclaration** (taxonomie de
destinations, catégorie de composant, drapeau « action différée ») et rejoignent le périmètre
machine dès le lot 2 ; **9 exigent un parcours scripté** (lien expiré, succès partiel, désaccord
client/serveur) et forment une famille « parcours » pour un lot ultérieur.

**Décision d'Aurélien (31/07) : le MVP inclut les trois instruments machine.** Il devient
présentable comme audit RGAA partiel — l'accessibilité étant le coin d'entrée commercial (EAA
applicable depuis le 28/06/2025, 50 000 € par service non conforme).

**Conséquence pour le lot 1 :** rien à retirer du périmètre, et un état de rapport à ajouter —
*en attente de déclaration* (loi 4.18). Sans lui, 54 mesures disparaîtraient silencieusement.

**Déjà couvert :** `CHIP-R06` est implémenté dans `fili-check`. Un inventaire de ce que
`fili-check` couvre déjà est à faire au début du lot 1 — c'est autant de moteur en moins à écrire.

### 11.4 — Le MVP

> **Donner une URL, obtenir un rapport sur les deux axes de registres, avec les mesures qui les justifient.**

> **Ce que le lot 1 n'est pas — arbitré le 03/08 (écart C-7).** Le lot 1 **n'est pas** l'offre A du
> cadrage. **Offre A = lot 1 + passe 1** (déclaration produit, corpus de concurrents) **+ passe 4**
> (3 à 5 concurrents mesurés le même jour) **+ passe 5** (les six familles du coût d'expérience)
> **+ passe 7** (les quatre projections), **et les formats HTML + PDF**. C'est la liste exacte de
> ce qui manque au MVP pour être **vendable**, pas de ce qu'il doit livrer — et aucune de ces
> quatre passes ne se rediscute pendant le lot 1.

**Il fait** — charge une page à N largeurs, exécute les `MESURE` (statique + rendu + interactif),
qualifie chaque écart par son statut de frontière, remonte en *non couvert* ce que le référentiel
ne tranche pas, sort du JSON et un rapport lisible.

**Il ne fait pas** — ni Figma, ni images, ni app cliente, ni ingestion, ni panier, ni aperçu, ni
branche, ni rôles, ni interface. **Aucune de ces lignes ne se rediscute pendant le lot 1.**

**Critère de réussite, falsifiable** — exécuté sur les cinq pages de Passion Courtage et sur la
planche, il doit retrouver ce qui a été mesuré à la main le 31/07 (annexes A.1 et A.2) — et
**ne rien inventer**. C'est un corrigé, pas une impression.

> **Deux épreuves, deux rôles — arbitré le 03/08 (écart C-11).** Celle-ci est l'**épreuve interne**
> du lot 1, et c'est **elle** qui décide de sa fermeture : son corrigé est le seul des deux à avoir
> été repassé à la machine (annexe A.1 bis). L'épreuve le site de référence du cadrage § 12 est
> l'**épreuve de vente** ; elle se joue **après**, et ne conditionne pas la fermeture du lot 1.
>
> **Condition posée par la loi 4.16** — *un corpus de test écrit par l'auditeur mesure l'auditeur.*
> Le corrigé de référence a été écrit à la main et n'a **jamais** été repassé à la machine : **il passe
> au traitement de l'annexe A.1 bis avant de servir de barre.** Sur sept lignes, ce même traitement
> a trouvé ici une erreur franche, une attribution fausse, un sous-comptage et trois flous de
> portée. Le décompte des constats (cadrage § 14.1, écart C-10) en fait partie, et il est ouvert.

**Il prouve ou réfute** — que le corpus est un moteur exécutable et pas seulement une doctrine.
**Il ne prouve pas** qu'un client l'achète : c'est le lot 5.

### 11.5 — Trois contraintes de conception, dès le lot 1

**Rejeu et unanimité.** Tout constat interactif se rejoue trois fois et n'est retenu qu'à
l'unanimité. Un désaccord entre rejeux devient un **non concluant**, jamais un constat. Un faux
positif intermittent détruit la confiance en une réunion.

**Empreinte de passage.** Chaque rapport porte : version du corpus, version du navigateur,
largeurs balayées. Deux audits ne se comparent que si les empreintes correspondent — sans quoi
le re-scan qui fonde le modèle d'abonnement ne veut rien dire.

> **Ce que porte la « version du corpus » — arbitré le 03/08 (§ 10 #8).** On **réemploie le
> mécanisme qui existe déjà** : `tools/plugin/publie.js` produit une version semver globale et une
> empreinte SHA-256 par fichier dans `tools/plugin/etat-publication.json` — au 03/08, **version
> 1.7.1, 29/07/2026, 47 fiches, 56 empreintes** — avec une règle de bump déjà écrite : *seul un
> sujet qui entre ou sort du corpus fait une version mineure*. Rien à inventer, et la provenance
> est déjà vérifiable.
>
> **Le travail réel est l'extension, et il est nommé.** Relevé par appel d'outil le 03/08 : ce
> mécanisme couvre **47 fiches**, alors que `execute-criteres.mjs` lit `apps/site/content/doctrine`
> (**38 fichiers**) et que les sources de `apps/site/content/md/` en comptent **74**. *Il ne
> versionne donc pas ce que l'exécuteur exécute.* Étendre `etat-publication.json` au corpus
> réellement lu par le moteur est une tâche du **lot 1** — et l'empreinte de passage n'est pas
> opposable avant.

**Trois colonnes, jamais une.** *Vérifié automatiquement* · *Observé* (interactif, rejoué) ·
*À vérifier humainement*. Même avec les trois instruments, une part du RGAA reste hors machine.
L'annoncer est ce qui protège de la déclaration mensongère (25 000 €).

### 11.6 — Ce qui ne se décide pas maintenant

Sur les **huit** arbitrages du § 10, le MVP n'en exigeait qu'**un** : le **versionnement du
corpus** (§ 10 #8), parce qu'il figure dans l'empreinte de passage dès le premier rapport.
**Il est tranché depuis le 03/08** — voir § 11.5 — de même que le § 10 #1 (où vit l'exécuteur).
Les six autres — modèle économique, multilingue, rôles et droits, ligne du public — se tranchent
au lot où ils mordent.

> ✔ **C-14 est réglé le 03/08.** Le **versionnement du corpus** ne figurait dans **aucune** des
> deux listes d'arbitrages — ni au § 10 de ce document, ni au § 11 du cadrage — alors que c'est le
> seul que le MVP exige. Il entre au § 10 sous le **#8**, et il est tranché (§ 11.5).
>
> ⚠ **C-15 reste OUVERT.** Le **compte** tombe juste depuis que #1 et #8 sont tranchés — il reste
> bien six arbitrages au § 10. Mais le **nommage** ne tombe pas : sur les quatre nommés ci-dessus,
> **un seul** figure réellement au § 10 (le modèle économique, #7) ; *multilingue*, *rôles et
> droits* et *ligne du public* n'y sont pas, tandis que #2 (le cran `emprunté`), #3
> (« accessoire »), #4 (`--font-label`), #5 (les valeurs d'identité) et #6 (le mode « sélection »)
> n'y sont pas nommés. Réécrire cette phrase demanderait de **choisir** lesquels sont « les six
> autres » : c'est un arbitrage, pas une correction de rédaction.
