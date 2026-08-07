# journal.md — Journal d'intention FILI V2

> Journal chronologique des décisions. Il répond à **pourquoi**, jamais à **comment**
> (le comment vit dans le code, l'état vit dans `system-map.md`).
>
> **Règles du journal**
>
> 1. Une entrée par décision, jamais par commit.
> 2. Antichronologique : l'entrée la plus récente en haut.
> 3. On n'édite ni ne supprime une entrée passée. Une décision qui change
>    produit une **nouvelle** entrée qui référence l'ancienne (`Révise : #00X`).
> 4. Chaque entrée porte le **sens produit et UX**, pas la justification
>    technique seule.
> 5. Toute alternative sérieusement envisagée puis écartée est nommée, avec le
>    motif du rejet.

---

## Où se trouve quoi — lisez ceci avant de chercher une entrée

Ce fichier est le journal **à partir de `#050`**. Ce qui précède ne s'y trouve
pas, et ce n'est pas un oubli :

| Entrées | Où elles sont | État |
|---|---|---|
| `#001` → `#042` | nulle part | **perdues**, perte actée par `#049` |
| `#043` → `#049` | document de projet `claude/journal.md` | **gelé**, ne sera plus réécrit |
| `#050` → … | **ce fichier** | vivant, empreinté, versionné |
| run 1 (19 entrées) | `claude/archive/v2-run1-journal.md` | archive d'une lignée close |

La numérotation ne se réattribue pas. Le trou de `#001` à `#042` est la trace
de la perte, et il vaut mieux qu'un journal sans trou qui donnerait à croire
qu'il n'a rien perdu.

---

## #052 — P2 est debout : le témoin se juge rendu, par bascule, et le Gardien a trouvé trois fautes dans les écrans écrits pour lui
*2026-08-07 · Statut : 🟡 En cours (les écrans existent et tiennent ; leur parti visuel n'est pas jugé) · Poursuit K5, ouvert par `#046`*

**Contexte** — P1 tenait debout — É1 le verdict, É2 le constat — sous les
vingt-neuf assertions et sans aucune rupture déclarée. K5 restait ouvert sur
cinq gabarits. L'Auteur a rendu quatre arbitrages avant qu'une ligne soit
écrite : **P2 d'abord** ; la comparaison **par bascule** ; le verdict déposé
**dans une pièce datée à côté du témoin** ; et le **gel du protocole après**
avoir vu les écrans, non avant.

**Décision** — **É3 · La famille des témoins et É4 · Le face-à-face sont
construits**, avec les états que K2 §6 déclare pour eux et pas un de plus :
quatre pour É3, **cinq pour É4** — le succès entre, parce que É4 porte un acte.
Deux composants entrent au système : **`TextField`**, déclaré au registre
depuis l'origine et jusque-là sans emploi, et **`Rendu`**, le cadre cloisonné
qui porte un témoin. Le registre passe de douze à **treize composants**.
**Dix-sept témoins** vivent maintenant dans quatre lignées.

**Sens produit / UX** — Quatre choses, dont trois n'étaient pas cherchées.

**La bascule est un choix de mesure, pas de mise en page.** Côte à côte, chaque
génération perd la moitié de la largeur et l'on juge deux vignettes ; à la même
place, l'œil compare de mémoire immédiate — et c'est ce qui rend visible un
écart de rythme ou d'espacement, qui ne se voit jamais par balayage horizontal.
C'est cohérent avec le verdict à froid hérité de K1 : on juge un écran, pas une
planche de comparaison.

**Un témoin ne se juge pas en capture, et cela a coûté un détournement.** La
chaîne de rendu n'a pas de React : elle transpile le fichier vérifié et le rend
sans navigateur. Or É4 pose un crochet d'état pour sa bascule, et `TextField`
en pose un pour lier son libellé à son champ. Sans intervention, **tout écran
posant un crochet devenait intémoignable** — et l'on serait revenu à la capture
que `#016` interdit. Le chargeur détourne donc `react` vers le strict
nécessaire : les crochets rendent la valeur initiale, et leur poseur ne fait
rien. Ce n'est pas une simplification, c'est la **définition d'un témoin** — un
arrêt sur image, jamais une session. Si un écran n'était lisible qu'après une
interaction, l'état qu'il faut voir serait un état déclaré, et il serait rendu
comme les autres.

**Le Gardien a trouvé trois fautes dans les écrans écrits pour lui.** Aucune
n'aurait été vue en relisant. *(1)* É4 posait **quatre titres de premier
niveau** — un par branche d'état — parce que le titre était placé à l'intérieur
du conteneur d'états ; la table des matières qu'annonce un lecteur d'écran
n'aurait plus eu de sommet. *(2)* É3 posait un **saut de niveau 1 vers 3**.
*(3)* É3 groupait ses cartes avec un écart de trente-deux pixels contenant des
groupes de seize : deux valeurs parfaitement issues de l'échelle, et un rapport
de deux là où il en faut trois — **le groupe se lit mal alors qu'aucune valeur
n'est fautive**. C'est précisément la classe de défaut que R3.7 existe pour
attraper, et elle vient d'être attrapée sur du code écrit en connaissance de la
règle. La correction de la première a un effet de composition heureux : le titre
ne récite plus l'identité du témoin, et **l'image passe réellement avant la
métadonnée**, ce que K2 §5 demandait.

**Et un défaut de produit apparaît, qui n'est pas un artefact.** É3 liste les
gabarits qui ont rendu un témoin. Elle en a désormais quatre — dont elle-même.
Sa vignette se contient donc, et un navigateur bloque la récursion en laissant
un cadre vide. Le fait est **écrit plutôt que contourné** : ce n'est pas au
producteur de décider en silence qu'un gabarit ne se montre pas lui-même. Cela
appartient à l'œil, au point de passage B-1.

**Précisions d'implémentation — tracées plutôt que prises en silence**
*(même règle qu'en `#010` et `#046`)* :

*(a)* **`Rendu` est ajouté aux exportations du registre**, treizième composant.
Il n'était pas déclaré en K2 §10.2, mais un témoin se juge rendu : sans cadre,
É4 n'a pas d'objet. Le cloisonnement est total — le témoin est du HTML du
dépôt, mais lui donner la page qui le juge reviendrait à lui donner le pouvoir
de la maquiller, ce qui est la ligne rouge de K2 §8 appliquée au rendu.
*(b)* **`TextField` est construit maintenant et non en É7.** L'ordre de K5 dit
qu'on ne construit que ce que le parcours en cours exige ; É4 l'exige, parce
qu'un refus sans motif écrit ne se relit pas. Le libellé n'est jamais un texte
fantôme : il disparaîtrait au moment où l'on répond à la question.
*(c)* **La famille des témoins est lue sur le disque, jamais déclarée.** Une
liste tenue à la main dériverait du dossier sans que rien ne le dise, et É3
montrerait une génération qui n'existe plus.
*(d)* **Le miroir servi se recouvre, il ne se vide pas.** Les témoins vivent
dans `temoins/` et le serveur ne sert que `public/` ; la copie est un artefact
de service, non versionné. Purger avant de recopier supprimerait des références
pour les réécrire, sans aucun gain : une génération ne disparaît jamais du
dossier source.
*(e)* Les chemins portés par l'état sont ceux du produit servi ; **la chaîne les
ramène à la position réelle du fichier** au moment du rendu. Sans cela, É3 et É4
témoigneraient d'un cadre vide — le défaut exact qu'ils existent pour attraper.
*(f)* Les identifiants de champ sont **remis à zéro avant chaque rendu**, sans
quoi deux exécutions produiraient deux fichiers différents et le face-à-face
montrerait un écart qui n'existe pas.
*(g)* **L'état « vide » de É4 est aujourd'hui identique à son nominal** : aucun
gabarit n'a de génération précédente, donc la bascule n'existe dans aucun des
deux. Le fait est écrit ; il se dissipera à la deuxième génération.

**Alternatives écartées** — *Comparer côte à côte* (plus confortable à lire, et
l'on juge deux moitiés d'écran au lieu d'un écran) ; *déposer le verdict au
journal* (le journal porte le sens produit ; le noyer sous des verdicts de forme
le rendrait illisible — la pièce datée vit là où vit ce qu'elle juge) ; *geler le
protocole avant d'écrire les écrans* (le plus net, et `#034` a posé qu'un
protocole gelé de loin est gelé mal informé ; K4 a prévu le gel en deux temps
pour exactement cette raison) ; *rendre le témoin par capture d'écran plutôt que
de détourner `react`* (c'est la maquette interdite depuis `#016`, et elle aurait
été prise pour un témoin) ; *ne pas construire `TextField` et faire choisir le
motif de refus dans une liste fermée* (plus fidèle au protocole de K4, où un
refus nomme le point de passage qui a échoué — mais la structure du refus fait
partie du protocole, et le protocole se gèle après ces écrans : l'écrire
maintenant serait geler par anticipation) ; *masquer É3 de sa propre liste*
(décider en silence qu'un gabarit ne se montre pas lui-même, alors que c'est un
arbitrage de lecture et donc l'affaire de l'œil) ; *corriger les trois fautes
sans les écrire* (la triche nommée depuis `#002`, et sur les fautes que le
dispositif venait de trouver).

**Conséquences** — **Quatre gabarits sur sept** sont construits, **deux parcours
sur trois** ouverts. Registre : douze composants → **treize**. Le corpus est
**inchangé** — vingt-neuf assertions, aucune ajoutée, aucune levée, **aucune
rupture déclarée dans tout le produit**. Vingt-six fichiers sont gardés, zéro
erreur. Ce qui reste à K5 : **P3 · Acter une décision** — É5 la carte, É6 le
journal, É7 l'acte — et c'est le parcours qui écrit dans le dépôt, donc celui
qui doit rendre **mécanique** l'interdiction de retoucher une entrée passée
(K2 §10.3). Le gel définitif du protocole reste à prononcer, et il est
désormais **prononçable** : ses écrans existent.

**Ce que cette entrée ne prouve pas** — que les deux écrans sont bons. Ils
tiennent sous les assertions ; aucune assertion ne regarde un parti visuel.
La primauté déclarée par É3 et É4 est une **promesse de composition**, et c'est
l'œil de l'Auteur qui la tranche aux points de passage B-1 et B-2. Un fichier
ne peut pas se l'accorder à lui-même.

**Impact carte** — Jalon K5 : gabarits **2/7 → 4/7**, parcours **1/3 → 2/3**.
Registre : `components.exports` 12 → **13** (`Rendu`). Système : ajout de
`TextField` et `Rendu`. Chaîne de rendu : détournement de `react` documenté,
identifiants déterministes. Témoins : **8 → 17**, quatre lignées. Ajout de
`/temoins`, `/faceAFace` et `/verdicts` aux sources lues. Charge ouverte :
l'auto-référence de É3, à trancher par l'œil en B-1.

---

## #051 — Le journal descend au dépôt, et la pièce qui fait foi entre enfin sous la garantie construite pour elle
*2026-08-07 · Statut : 🟢 Verrouillé (arbitrage délégué : « je te laisse décider ») · Suit `#049`*

**Contexte** — `#049` a acté la perte de quarante-deux entrées et adopté trois
règles, dont la première : *on ne réécrit jamais un document vivant en entier*.
La troisième posait que l'immuabilité devait couvrir **le journal du projet**,
et pas seulement celui du dépôt, puisque c'est le premier qui fait foi — et
elle notait que la garantie restait **non scellée** tant qu'il en était ainsi.

Deux jours d'usage ont montré que les deux règles se contredisent. L'outil qui
écrit les documents de projet ne sait pas **ajouter** : il ne sait
qu'**écraser**. Ajouter une entrée au journal du projet impose donc de
réécrire les sept qui existent — c'est-à-dire de refaire exactement le geste
qui a coûté quarante-deux entrées. **La règle adoptée pour protéger le journal
interdisait de le tenir.** Un dispositif qui rend impossible l'acte qu'il
protège n'est pas prudent, il est cassé.

**Décision** — **Le journal descend au dépôt.** Ce fichier devient la pièce qui
fait foi à partir de `#050`. `claude/journal.md` est **gelé en l'état** —
sept entrées, `#043` à `#049` — et ne sera plus jamais réécrit. Aucune ligne
n'est recopiée d'un support à l'autre.

**Sens produit / UX** — Trois choses que ce déplacement obtient, et aucune
n'était accessible autrement.

**La garantie couvre enfin la pièce qu'elle devait couvrir.** L'outil
d'empreinte du dépôt pose une signature par entrée : une entrée passée réécrite
ou disparue est un refus, pas un avertissement. Il existait depuis le 7 août au
matin et il gardait un fichier qui ne faisait pas foi. Il garde maintenant celui
qui fait foi. C'est la condition que `#049` avait posée pour sceller, et elle
est remplie par déplacement de la pièce plutôt que par extension de l'outil.

**Le passé devient récupérable, ce qu'il n'a jamais été.** Un document de projet
n'a qu'un état : le dernier. Un fichier du dépôt les a tous. Si une session
future écrase ce journal, l'état antérieur se relit — c'est précisément ce qui
manquait le 7 août à 08h34, et c'est ce qui a transformé un accident en perte
définitive. La sauvegarde hors machine, décidée le même jour, met ce passé hors
d'atteinte de ce disque.

**Et l'ajout redevient mécanique.** Ajouter une entrée n'exige plus de retoucher
les précédentes. Le geste interdit par `#049` cesse d'être le seul geste
possible. La règle est tenue au lieu d'être contournée.

**Ce que la décision coûte, et pourquoi le coût est accepté** — Le journal est
désormais **réparti sur deux supports**, et il faut ce tableau pour savoir où
chercher. C'est un défaut réel. Il est préféré au seul autre chemin — recopier
les sept entrées ici — parce que cette recopie est une réécriture intégrale
faite de mémoire, c'est-à-dire le geste exact que `#049` interdit, sur les seules
entrées qui restent. **Une répartition déclarée vaut mieux qu'une recopie
risquée**, comme une perte déclarée vaut mieux qu'un faux indétectable. La
doctrine du projet ne dit rien d'autre depuis `#002`.

**Alternatives écartées** — *Réécrire le journal du projet malgré la règle*
(l'Auteur l'avait offert ; c'est refaire le geste qui a coûté quarante-deux
entrées, sur les sept qui survivent, et sans possibilité de revenir en arrière —
le support n'a pas d'historique) ; *recopier `#043`–`#049` ici pour n'avoir
qu'un seul support* (même geste, même risque, déplacé — et il produirait deux
exemplaires dont rien ne dirait lequel fait foi) ; *garder le journal au projet
et étendre l'outil d'empreinte jusqu'à lui* (l'outil verrait la réécriture mais
ne l'empêcherait pas et ne la réparerait pas : constater la perte n'est pas la
prévenir, et `#049` a déjà mesuré ce que vaut un constat sans recours) ;
*maintenir les deux en miroir* (deux vérités, donc aucune ; et la synchronisation
est un geste de réécriture à chaque entrée).

**Conséquences** — Ce fichier est empreinté par l'outil du dépôt à chaque
vérification. `claude/journal.md` passe de vivant à **archive gelée**, au même
titre que `claude/archive/v2-run1-journal.md`. La troisième règle de `#049` est
**tenue**, et la garantie d'immuabilité peut être scellée : elle couvre la pièce
qui fait foi. Aucun contrat rouvert, aucune assertion touchée.

**Impact carte** — Journal du projet : vivant → **gelé à 7 entrées**. Journal du
dépôt : archive de la run 1 → **journal vivant à partir de `#050`**.
Dette « immuabilité non scellée » (`#049`) : 🔴 → 🟢 **fermée**.

---

## #050 — Le périmètre typographique est arbitré par l'œil de l'Auteur, et il accuse une règle déjà verrouillée
*2026-08-07 · Statut : 🟡 Consigné, non contractualisé · Ouvre une charge d'écriture pour un jalon ultérieur*

**Contexte** — La documentation *Knowledge* de Google Fonts a été lue
intégralement : soixante-deux articles, cent quatre-vingt-un termes de
glossaire, soixante candidates Voie A dégagées et classées par décidabilité.
Le résultat central de cette moisson était négatif : **la source ne donne
presque aucun seuil, et jamais comme une exigence.** Sur l'ensemble du fonds,
la colonne « exigence » ne contient que des points de code Unicode, des
définitions d'unités et des limites de format de fichier — jamais une valeur de
mise en page. Soixante candidates sans nombres opposables sont un fonds, pas un
corpus.

**Décision** — **L'Auteur réduit le périmètre à cinq articles plus une source
extérieure** : *How type influences readability*, *Introducing accessibility in
typography*, *Understanding measure / line length*, *The foundations of web
typography*, *Vertical spacing & line-height in design systems*, et le
*leading-trim* de Microsoft Design. Le périmètre est consigné dans
`claude/sources-typographie-arbitrees.md`. **Aucune assertion n'est écrite** :
K5 est le jalon de la construction, et un contrat typographique s'écrirait
contre le périmètre de son thread.

**Sens produit / UX** — Trois choses, dont deux n'étaient pas cherchées.

**Le classement qui fait foi n'est pas celui de la machine.** La moisson avait
trié les candidates par **décidabilité** — ce qu'un juge peut trancher sans
savoir à qui l'on parle. L'Auteur les a triées par **fréquence du défaut** :
*« ce sont des choses que je constate très souvent depuis le début de ma
carrière. »* Les deux classements ne coïncident pas, et c'est le second qui
gouverne. Une assertion parfaitement décidable qui ne bloque jamais rien n'est
pas un garde-fou, c'est du décor.

**Le *leading-trim* n'ajoute pas une règle : il en accuse une.** S3 · Discipline
Spatiale est verrouillée et vérifie que tout espacement provient de l'échelle
déclarée. Mais le demi-interligne hérité de CSS1, plus les métriques que la
fonte réserve pour les diacritiques, gonflent la boîte du texte au-delà des
lettres visibles. Dès qu'un espace borde du texte, **la valeur que S3 vérifie
n'est pas la valeur que l'œil voit** : sur le corps courant, un espace déclaré
à huit pixels se voit à treize. Le Gardien dit vert sur une mesure qui ment.
C'est le premier point du chapitre où une source nouvelle met en cause une
assertion déjà verrouillée au lieu d'en proposer une neuve.

**Et la confrontation a trouvé une faute dans l'échelle du projet.** La source
donne une direction sans seuil : plus le texte est petit, plus il lui faut d'air.
L'échelle de Fili faisait l'inverse sur ses deux tailles de lecture — 14 px à
1,50 puis 17 px à 1,60. Le régime de titre, lui, était déjà juste. La leçon
dépasse la correction : **une assertion de monotonie écrite globalement
bloquerait Fili lui-même**, parce que l'étiquette de menu — 12 px, chasse
élargie — n'est pas du texte suivi et n'entre dans aucune monotonie. La règle
n'a de sens que **par régime déclaré**.

**Deux résultats négatifs sont acquis et opposables.** L'alignement justifié est
**empiriquement indécidable** : la source ne dit pas « ça dépend », elle dit que
les études sont non concluantes et qu'il est difficile d'imaginer une expérience
qui le serait. Toute règle d'alignement serait indéfendable sur cette base.
Et **aucun corpus n'est agnostique d'écriture par défaut** : une assertion qui
calcule depuis la ligne de base ne doit pas « tolérer » le CJK, elle doit
refuser de s'exécuter faute d'objet — le même geste que *pas de registre, pas
de verdict*.

**Alternatives écartées** — *Écrire le contrat typographique dans le thread K5*
(la règle de clôture prime : un thread, un périmètre, et K5 construit) ;
*retenir les soixante candidates et laisser le jalon futur trier* (c'est
déléguer l'arbitrage à celui qui n'a pas les vingt ans d'observation) ;
*importer les plages chiffrées de la source comme si elle les exigeait*
(45–75 et 40–60 ne se recouvrent qu'en partie, et aucune n'est énoncée comme
une règle — le corpus doit porter **ses** nombres et citer la source comme
motif) ; *corriger l'échelle typographique en silence* (une correction de
valeurs non tracée est la faute nommée depuis `#002`).

**Conséquences** — Le périmètre est **borné et opposable** au jalon qui
l'exploitera, sous trois verrous : toute valeur est arbitrée par l'Auteur et
déclarée comme telle ; tout énoncé est borné par régime déclaré quand la source
ne donne qu'une direction ; et rien de ce qui touche aux métriques de fonte ne
s'écrit sans les fichiers au dépôt. **Une dette change de nature** : l'absence
des fichiers de fonte était une dette de rendu, elle devient une **dépendance
d'assertion** — deux des six sources n'ont aucun objet sans elle. **Une charge
s'ouvre sur S3**, qui est verrouillée : la mesure spatiale autour du texte est
faussée tant que le rognage n'est pas déclaré. Elle est écrite, elle n'est pas
traitée ici.

**Impact carte** — Ajout de `claude/sources-typographie-arbitrees.md` et de
`claude/fonds-typographie-google-knowledge.md` à la documentation vivante.
Périmètre typographique : ⚪ → 🟡 **arbitré, non contractualisé**. Charge
ouverte sur S3 (rognage de l'interligne), consignée. Échelle typographique :
corrigée par régime, correction tracée à la planche.

---
