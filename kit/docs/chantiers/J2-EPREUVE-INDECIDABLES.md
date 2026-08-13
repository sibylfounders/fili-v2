# J2 — L'épreuve des indécidables

> **statut : relevé + hypothèse. Aucun arbitrage n'est rendu ici.**
> Rédigé le 2026-08-03. Addendum au fil « Fili Audit · doctrine » (J2 de la roadmap de fermeture).
> Origine : une mission de modélisation des « niveaux d'abstraction de la doctrine Fili » (prompt externe,
> 18 concepts, 8 livrables) a été **fermée** le 03/08 au profit de ce qui suit. Voir § 5.

---

## 1. Ce qui a été trouvé

Le lot 0 a déjà fait l'expérience que la mission proposait de monter de zéro — sur du matériau réel,
arbitré à la main, et il en reste la trace.

`_to_delete_rangement/pilote/lot0-verdicts.csv` — 835 mesures, une ligne par règle, avec le **motif**
écrit de chaque verdict. Comptage refait le 03/08 (`awk -F',' 'NR>1{print $3}' | sort | uniq -c`) :

| verdict | n |
|---|---|
| machine | 781 |
| assiste | 32 |
| doute | 22 |
| **total** | **835** |

Les **54** non-machine sont le majorant que le cahier § 11.3 annonce (« au plus 54 mesures sur 835 sont
hors de portée d'une machine »). Chacune porte un motif rédigé, c'est-à-dire **la raison écrite pour
laquelle un programme ne peut pas trancher**.

C'est exactement le corpus qu'il fallait : réel, non auto-généré, déjà arbitré par un humain, avec les
raisons dans le fichier. Rien n'était à fabriquer.

## 2. Le constat du cahier, et ce qu'il manque

Le cahier § 11.3 note déjà, comme « découverte qualitative, plus importante que le chiffre » :

> Les 32 « assisté » ont tous la même forme : chacun contient un mot qui nomme une **intention produit**
> et non une chose observable […] c'est **la frontière entre le design et le produit**, et elle est nette.

Vrai, mais trop gros grain. « Intention produit » recouvre au moins six choses différentes, dont trois
seulement se règlent par une déclaration du client. La loi 4.18 (« la plupart deviennent mesurables le
jour où le client déclare la donnée ») est donc **trop optimiste sur une partie du lot** — et
inutilement pessimiste sur une autre.

## 3. Hypothèse — les 54 se répartissent en six familles

**Ceci est ma lecture des 54 motifs, faite en une passe. Elle n'est pas mesurée : environ six lignes
sont limites et se rangeraient ailleurs sous un autre regard. À vérifier ligne à ligne avant d'en tirer
quoi que ce soit.**

| # | famille | ce qui manque | n |
|---|---|---|---|
| **F1** | **identité sémantique des objets** | savoir lesquels *sont la même chose* ou *vont ensemble* | 18 |
| **F2** | **enjeu de l'action** | ce que coûte l'action, ce qu'elle engage, ce qu'elle risque | 10 |
| **F3** | **structure du parcours** | où commence et finit une séquence, quelles étapes sont requises | 4 |
| F4 | jugement de langue | rien : c'est une appréciation rédactionnelle | 8 |
| F5 | instrument manquant | ni une donnée ni un jugement — un scénario scripté ou un accès serveur | 8 |
| F6 | la règle est mal écrite | rien : elle est permissive, procédurale, ou pas resserrée en critère | 6 |

Total 54.

**F1 — identité sémantique** (ALERT-R66, BUTTON-R88, CARD-R44, CHOICE-R07/R18, INPUT-R15, LINK-R18,
TYPOGRAPHY-R09/R17, GESTURE-U02/R07/R14, FORM-R04/R52, ELEVATION-R19, SURFACE-U06, VOICE-U05/U08).
La machine voit des éléments ; elle ne sait pas lesquels portent « un même statut », « une question
commune », « la même nature de destination », « les champs liés par le sens », « le texte courant ».
C'est la famille la plus nombreuse, et de loin.

**F2 — enjeu de l'action** (BUTTON-R46, INPUT-R20/R21/R24/R58, ADAPTIVE-R11,
COGNITIVE-LOAD-R08/R10/R14/R17). « Action à enjeu réel », « engage juridiquement », « forte friction
perçue », « selon le risque d'erreur du champ », « information requise pour agir ». La machine voit un
bouton ; elle ne sait pas ce que coûte de l'appuyer.

**F3 — structure du parcours** (BUTTON-R13, CREATION-COMPTE-R05, TOAST-R11, LAWS-R15). « Séquence
utilisateur », « moment » du parcours, « nombre d'étapes réellement requises ». Quatre lignes
seulement — mais elles ne se réduisent ni à F1 ni à F2.

**F4 — jugement de langue** (ALERT-R29, CHOICE-R09, INPUT-R23/R57, CREATION-COMPTE-R61, VOICE-U15,
FORM-R12/R19). « Compréhensible lu seul », « le message indique la cause et l'action », « nomme la
relation », la portée juridique d'une phrase. **Aucune déclaration client ne les rendra mesurables.**
Ce sont des jugements de rédaction — humain, ou modèle de langue employé comme juge, jamais instrument.
La loi 4.18 ne s'applique pas à ces huit-là.

**F5 — instrument manquant** (CREATION-COMPTE-R42/R43/R50/R51, FORM-R33/R41, COGNITIVE-LOAD-R15,
VALIDATION-R09). Lien expiré, désaccord client/serveur, succès partiel, blocklist serveur, 20 h
d'inactivité. Il ne manque **aucune information** : il manque un scénario scripté ou un accès hors page.
Recoupe la famille « parcours » que le cahier renvoie à un lot ultérieur. **Ne pas les mélanger aux
déclarations : elles ne se débloquent pas de la même façon.**

**F6 — la règle est mal écrite** (BUTTON-R20 « règle permissive : elle autorise, elle n'interdit rien »,
GRID-R15 et ADAPTIVE-R16 « règle de procédé, pas d'artefact », MOTION-R13 et ADAPTIVE-R18 « à resserrer
en critère », CREATION-COMPTE-R09). **Ces six ne sont pas indécidables — elles sont défectueuses.**
Une règle qui n'interdit rien n'est pas une mesure. Elles se corrigent dans le corpus, elles ne se
déclarent pas. **Conséquence directe : le majorant « au plus 54 » du cahier § 11.3 est lui-même trop
haut.** À vérifier, puis à corriger dans le cahier.

## 4. Ce que ça donne, si l'hypothèse tient

**Trois déclarations, pas dix-huit niveaux.** F1 + F2 + F3 = 32 des 54, soit les seules à se débloquer
par une donnée que le client peut fournir :

1. **l'identité sémantique des objets** — quels éléments sont le même concept, le même statut, la même
   nature de destination, le même groupe ;
2. **l'enjeu d'une action** — ce qu'elle engage, ce qu'elle coûte, ce qu'elle détruit, son risque ;
3. **la structure du parcours** — les séquences, leurs frontières, les étapes requises.

Et le même triplet sert dans les deux sens : c'est ce qu'il manque à l'auditeur pour **juger** un écran,
et c'est ce qu'il manque au constructeur pour **décider** d'un écran. Un seul schéma d'entrée, deux
directions de parcours. C'est le point où l'audit et la fabrique se rejoignent.

**Ce que ça règle du prompt fermé.** La mission demandait si la « force de l'intention » est une
dimension, une propriété ou une classe. Réponse tirée du matériau : c'est **F2**, dix mesures réelles la
réclament, et ce n'est ni un niveau d'abstraction ni une propriété inférée — c'est **une donnée d'entrée
déclarée**. Elle ne se déduit pas de l'interface, justement parce que c'est ce que l'interface ne dit pas.

## 5. Pourquoi la mission de modélisation a été fermée

Elle proposait 18 concepts, une chaîne à dix étages, dix verbes × trois contextes **inventés**, huit
livrables, et un protocole d'évaluation en **sixième** position — donc écrit après cinq documents que
personne n'aurait supprimés. Corpus auto-généré, décision produite par le modèle, justification produite
par le modèle, évaluation rendue par le modèle : le test ne pouvait pas échouer.

Elle bâtissait aussi sur **loi**, **intention**, **niveau**, **registre** — les collisions V13, V10, V7,
V14 de `docs/VOCABULAIRE.md`, ouvertes et non tranchées — et aurait produit un cinquième document
doctrinal co-autoritaire, c'est-à-dire le mécanisme même qui a fabriqué les quinze contradictions
cadrage ↔ cahier.

Deux choses en ont été gardées : l'axe de force épistémique (loi / jurisprudence / usage), et la
conclusion en quatre parties — solide / hypothèse / à abandonner / prochaine expérience.

## 6. Ce qui reste à faire, et ce qui reste à trancher

**À vérifier (mécanique, sans arbitrage) :**

- reprendre les 54 lignes du CSV une par une et confirmer ou corriger la répartition en six familles ;
- isoler F6 et vérifier qu'il s'agit bien de défauts de rédaction — si oui, corriger le majorant du
  cahier § 11.3 et les six règles ;
- vérifier que F4 est bien hors de portée de la loi 4.18, et l'écrire dans le cahier.

**À trancher par Aurélien — ne pas fermer sans lui :**

- **A1.** Les trois déclarations F1/F2/F3 deviennent-elles un artefact du produit (un formulaire de
  déclaration client, entrée de l'audit **et** de la fabrique) — ou restent-elles une note d'analyse ?
- **A2.** F6 : corriger les six règles dans le corpus, ou les laisser en l'état et assumer le majorant ?
- **A3.** La loi 4.18 est à amender (elle promet trop pour F4 et F5). Amendement ou note ?

**Condition d'abandon, à énoncer avant de commencer.** Si la vérification ligne à ligne montre que les
54 motifs **ne se regroupent pas** — que chacun réclame sa propre déclaration sur mesure — alors il n'y
a pas de modèle à écrire : Fili a besoin d'un fichier de configuration par mesure, pas d'un schéma
d'interaction située. Dans ce cas le sujet se ferme définitivement, avec cette raison-là.

---

## Annexe — deux relevés faits en passant, hors sujet mais à traiter en J0

**Le fichier des verdicts vit dans `_to_delete_rangement/`.** C'est-à-dire dans un dossier de rebut —
le mécanisme de suppression via le pont Cowork. Le cahier § 11.3 le cite comme source. La seule trace
écrite du raisonnement du lot 0 est rangée pour la corbeille.

**Neuf fichiers privés sont suivis par git dans `apps/site/public/docs/test/`** — vérifié par
`git ls-files` : `fili-roadmap.html`, `fili-fils.md`, `fili-modele.html`, `fili-charte.html`,
`nav-carte-proto.html` et quatre archives `.tar.gz`. Ils ne sont pas ignorés (`git check-ignore` ne
renvoie rien). `public/` est servi tel quel par Next.js : ces documents — la roadmap, les briefs de fils,
les arbitrages — seraient exposés sous `/docs/test/…`. Je n'ai pas vérifié si le déploiement courant les
publie effectivement. La mémoire projet décrit `fili-roadmap.html` comme « page privée hors dépôt » :
c'est faux, elle est dans le dépôt et dans `public/`.
