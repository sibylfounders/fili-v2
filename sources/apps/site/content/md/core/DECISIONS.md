# DECISIONS.md — journal des décisions et révisions

> Journal daté des changements de raisonnement du projet : ancienne règle, nouvelle règle, pourquoi.
> Les fichiers `*-UX.md` / `*-UI.md` ne contiennent que les règles **actuelles** — quand un passage
> disait "une version antérieure affirmait...", il vit désormais ici. Les dates sont approximatives
> pour les entrées antérieures au 2026-07-03 (reconstituées depuis les numéros de version).
> Ce fichier n'est pas normatif : en cas de divergence avec un fichier de composant, le fichier de composant a raison.

---

## 2026-08-03 — Le dépôt est public : le site qui sert d'épreuve à l'audit cesse d'y être nommé

**Le constat, établi par appel d'outil.** `raw.githubusercontent.com` sert les fichiers de ce dépôt **anonymement** — ce qui est impossible sur un dépôt privé. **Le dépôt est donc public**, historique compris. Or `CADRAGE-FILI-AUDIT.md` nommait le site qui lui sert d'épreuve, donnait l'adresse de son **environnement de recette**, et énumérait ses défauts — dont, précisément, *« site de développement ouvert aux moteurs »*. Trente occurrences réparties sur six fichiers.

**Décision (arbitrage Aurélien).** Le site est désigné par **« le site de référence »** dans tous les documents versionnés ; son nom et son adresse vivent hors dépôt. Trente-deux remplacements dans `CADRAGE-FILI-AUDIT.md`, `CAHIER-FILI-AUDIT.md` et ce fichier. La convention est écrite au § 1 du cadrage.

**Ce que ça ne coûte pas.** Aucune mesure, aucun chiffre, aucune loi ne bouge. Les six familles du coût d'expérience, les lois C2, C3, E1, P1 et l'épreuve de reproductibilité s'appuient sur des **mesures** — le nom du site ne fonde aucune règle. C'est la vérification qui a décidé : si un seul énoncé avait eu besoin du nom, il aurait fallu arbitrer autrement.

**Ce que ça ne règle pas, et qui est nommé plutôt que masqué.** Les commits déjà poussés gardent le nom. Le retirer de l'historique demanderait une réécriture complète (`git filter-repo`, tous les SHA changent) — jugée disproportionnée tant que la question de la visibilité du dépôt elle-même n'est pas tranchée. **La règle vaut donc pour la suite, pas pour le passé.**

**Le précédent, et il vaut au-delà de ce cas.** La **loi R3** du cadrage dit qu'un audit *mesure un site, il ne juge pas un prestataire*. Elle protégeait le contenu du rapport ; elle ne disait rien de sa **diffusion**. Un audit qui ne juge personne mais qui est lisible par tout le monde produit le même dégât par un autre chemin. **Écrire le nom d'un audité dans un document versionné est une décision de publication, jamais une commodité de rédaction.**

---

## 2026-08-03 — Fili Audit : le cadrage et le cahier ne décrivaient pas le même produit — cinq écarts fermés, un laissé ouvert

**Le constat.** `CADRAGE-FILI-AUDIT.md` (v0.1.1) annonçait en bandeau compléter `CAHIER-FILI-AUDIT.md` **v0.3.0** ; le cahier était en **v0.9.0**. Relecture intégrale des deux le 03/08 : quinze écarts, dont cinq structurants et une erreur arithmétique porteuse. Tant qu'ils tenaient, tout arbitrage rendu sur l'un des deux documents était rendu sur un document faux. Jalon J2 de la roadmap de fermeture.

**Ce qui est décidé — arbitrages d'Aurélien, 03/08.**

1. **C-3, le statut.** Le cahier portait `statut: proposition — aucune décision engagée` et « Rien n'y est décidé » pendant que le cadrage écrivait « Arbitré le 31/07 » **quatre fois** en corps de texte, plus un Journal de six entrées datées. **Le cahier lève son statut** ; le **Journal du cadrage fait foi** pour ce qui est arbitré — c'est le seul des deux à tenir un journal daté. Le cahier reste l'autorité sur la **doctrine** : lois, lots, MVP. Sans cette levée, aucun arbitrage rendu ensuite n'avait d'ancrage.

2. **C-7, la nature du produit.** Le cahier § 1 décrivait « se branche sur la stack […] livre une branche » (lois 4.6 / 4.7 / 4.8 / 4.10) ; le cadrage § 2 « part d'une URL et rend un dossier transmissible », code source hors périmètre. **Ce sont deux états du même produit, pas deux produits** : *URL → dossier* aux **lots 1 à 4**, *stack → branche* au **lot 5 et au-delà**. Le cahier le rangeait déjà là sans le dire — son § 11.2 place `panier → aperçu → branche` en lot 5, son § 11.4 les exclut nommément du lot 1. **Les lois 4.6, 4.7, 4.8 et 4.10 ne sont donc pas abrogées** : elles n'entrent en vigueur qu'au lot 5. C'est la seule lecture qui ne retire rien à aucun des deux documents, et elle était déjà écrite dans l'un d'eux.

3. **C-7 (suite), l'offre A n'est pas le MVP.** Aucun des deux documents ne le disait. **Offre A = lot 1 + passe 1** (déclaration produit, corpus de concurrents) **+ passe 4** (3 à 5 concurrents mesurés le même jour) **+ passe 5** (les six familles du coût d'expérience) **+ passe 7** (les quatre projections), **plus les formats HTML et PDF**. C'est la liste exacte de ce qui manque au MVP pour être **vendable** — pas de ce qu'il doit livrer. Aucune de ces quatre passes ne se rediscute pendant le lot 1.

4. **C-5, les registres.** Le cahier annonçait « trois registres » en un seul axe (*à corriger / suggestion / à trancher*), le cadrage deux axes de trois (loi R1). **Les deux axes font foi, et l'axe du constat porte QUATRE états** : *avéré · signalé · non couvert · en attente de déclaration*. « Indécidable » redevient le **nom de la famille**, pas celui d'un état. Motif : la loi 4.18 distingue deux « à trancher » qui ne se traitent pas pareil, et le § 11.3 du cahier écrit que sans *en attente de déclaration*, **54 mesures disparaîtraient silencieusement**. À relever — le cahier se contredisait **tout seul** ici : son § 2 disait trois registres, sa propre loi 4.18 en ajoutait un quatrième. L'écart n'était pas seulement entre les deux documents.

5. **C-11, l'épreuve de reproductibilité.** Deux épreuves coexistaient sans hiérarchie : le cahier § 11.4 sur les cinq pages de Passion Courtage et la planche, le cadrage § 12 sur le site de référence. **Les deux, avec des rôles nommés** : Passion Courtage + la planche = **épreuve interne**, celle qui décide de la fermeture du lot 1 ; le site de référence = **épreuve de vente**, jouée **après**, ne conditionnant aucun lot. Et une condition posée par la **loi 4.16** (*un corpus de test écrit par l'auditeur mesure l'auditeur*) : le corrigé de référence a été écrit à la main et n'a **jamais** été repassé à la machine — **il passe au traitement de l'annexe A.1 bis avant de servir de barre**. Sur Passion Courtage, ce traitement a trouvé, sur **sept lignes**, une erreur franche, une attribution fausse, un sous-comptage et trois flous de portée. Aucune raison de croire un corrigé de 34 lignes plus sûr.

**Ce qui reste ouvert, et pourquoi il ne fallait pas le fermer — C-10, le décompte des constats du site de référence.** Trois comptes coexistent dans le cadrage : **34** (§ 1, § 5, § 12 deux fois, et « les trente-trois autres » en loi R2), **37** (§ 11.6 : N1=3 · N2=12 · N3=15 · N4=7) et **36** (§ 5 : prestataire 20 + marketing 6 + 10). **Arbitrage : recompter sur pièces avant d'écrire un chiffre — et aucun nombre n'a été modifié.** Deux raisons. La **loi P1** (« aucun chiffre sans un appel d'outil qui l'a produit dans ce run ») vaut contre l'auteur du document autant que contre l'audité. Et surtout : baisser une des quatre valeurs du § 11.6 pour faire tomber la somme à 34, **ce serait refermer l'arbitrage 11.6** — rouvert le 31/07 précisément parce que l'agent l'avait fermé seul. Les livrables du site de référence ne sont accessibles depuis aucun dossier connecté au 03/08. *Hypothèse à tester, pas une conclusion : les trois ne comptent peut-être pas la même chose — la loi 4.19 sépare constats de doctrine et contrôles d'hygiène, et trois contrôles d'hygiène expliqueraient exactement l'écart 37 → 34.*

**Deux renvois faux, réparés.** Le cadrage § 13 pointait « cahier § 11.4 » pour le découpage en lots : c'est le **§ 11.2** (les sept lots), le § 11.4 étant le MVP — le renvoi porte désormais les deux. Le cadrage § 9.1 citait « la loi 4.3 du cahier » pour justifier *Signalé* alors qu'il en avait **renommé le vocabulaire sans le dire** : la table du § 9.1 et la loi 4.3 portent maintenant la correspondance dans les deux sens, et disent explicitement que le mécanisme de confinement est inchangé — seuls les noms le sont.

**Deux défauts relevés, laissés ouverts pour J3.** Le **versionnement du corpus** — seul arbitrage que le MVP exige (cahier § 11.6) — ne figure dans **aucune** des deux listes d'arbitrages, ni au § 10 du cahier ni au § 11 du cadrage. Et « les six autres » du § 11.6 n'en nomme que **quatre**, dont **un seul** (le modèle économique) figure réellement au § 10. Les réécrire demanderait de **choisir** quels arbitrages sont « les six autres » : c'est un arbitrage, pas une correction de rédaction.

**Versions après J2.** `CADRAGE-FILI-AUDIT.md` v0.1.1 → **v0.2.0** (nouveau § 14, réconciliation, et § 14.1 pour C-10 resté ouvert). `CAHIER-FILI-AUDIT.md` v0.9.0 → **v0.10.0**.

---

### Jalon J3, même jour — trois arbitrages rendus

**1. `CADRAGE` 11.1 — le `type` des cinq nouveaux sujets : `principle`, le type existant.** Vérifié dans le dépôt avant de poser la question : six types sont en usage — `foundation` (21 fiches), `component` (12), `language` (10), `principle` (7), `pattern` (4), `flow` (2). Motif retenu : le cadrage § 10.1 rangeait **déjà** `indexation`, `donnees-structurees`, `multilingue`, `budget-image` et `fabrication-serveur` sous « Principes » dans l'ordre d'examen, et `principle` est le seul type sans couche visuelle (`companion: none`, comme `ACCESSIBILITY-UX`). Aucun outil à modifier. **Deux conséquences nommées, à traiter à l'écriture et pas avant** : la couche `principles` passe de 7 à 12 fiches, donc sa part de propriétés universelles — 53 % dans la table de la loi 4.20, qui fonde l'ordre d'audit — est à **recalculer après** ; et un principe étant « chargé d'office par le routeur », les cinq fiches de référencement seraient chargées à chaque génération d'UI, y compris pour un bouton. Si c'est indésirable, c'est la règle de chargement du routeur qu'il faut changer, pas le `type` — et c'est un autre arbitrage.

**2. `CAHIER` § 10 #1 — l'exécuteur vit dans le monorepo.** C'est l'état de fait, désormais déclaré : `tools/execute-criteres.mjs` (216 lignes), `criteres-grammaire.mjs`, `instrument-statique.mjs` (90) et `instrument-interactif.mjs` (62) y sont déjà, non commités, et `npm run criteres` les appelle. Le fait décisif : `execute-criteres.mjs` lit `apps/site/content/doctrine` et sert `apps/site/out` — il est **couplé au monorepo par deux chemins en dur**. Rien ne se déplace avant que le lot 1 ait prouvé que le corpus tourne. Coût assumé : si le § 10 #7 (« ouvre-t-on le détecteur en gardant le corpus fermé ? ») tranche pour l'ouverture, l'extraction reste à faire — pas avant le lot 5.

**3. Le versionnement du corpus — on réemploie le mécanisme existant, à étendre.** Cet arbitrage ne figurait dans **aucune** des deux listes (écart C-14) alors qu'il est le seul que le MVP exige (§ 11.6) : il entre au § 10 du cahier sous le **#8**. Et ce n'était pas une page blanche — trouvé dans le dépôt : `tools/plugin/publie.js` produit déjà une version semver globale et une empreinte SHA-256 par fichier dans `tools/plugin/etat-publication.json` (**1.7.1, 29/07/2026, 47 fiches, 56 empreintes**), avec une règle de bump écrite : *seul un sujet qui entre ou sort du corpus fait une version mineure*. **Le travail réel est l'extension, et il est chiffré** : ce mécanisme couvre 47 fiches, quand le moteur lit `apps/site/content/doctrine` (**38 fichiers**) et que les sources de `content/md/` en comptent **74**. *Il ne versionne pas ce que l'exécuteur exécute.* L'empreinte de passage n'est donc pas opposable tant que l'extension n'est pas faite — c'est une tâche du lot 1.

**Ce qui reste ouvert après J3.** **C-10** (le décompte des constats du site de référence — recompter sur pièces, aucun chiffre modifié) et **C-15** : depuis que #1 et #8 sont tranchés, « les six autres » du § 11.6 tombe juste en **compte**, mais pas en **nommage** — sur les quatre cités, un seul (le modèle économique, #7) figure réellement au § 10. Réécrire la phrase demanderait de choisir lesquels sont « les six autres » : c'est un arbitrage, pas une correction de rédaction.

**Versions après J3.** `CADRAGE-FILI-AUDIT.md` → **v0.3.0**. `CAHIER-FILI-AUDIT.md` → **v0.11.0**. Aucune ligne de code touchée, aucun commit.

---

## 2026-08-03 — LA PHRASE CARDINALE QUI N'A PAS SUIVI : quatre corrections d'une même signature

**Le motif.** Une fondation énonce une règle sur un axe. Plus tard on ajoute un cran, une valeur
ou une implémentation sur **un autre axe**. La phrase cardinale, elle, n'est pas réécrite. Les
composants écrits avant et après divergent, et **personne ne le voit parce que les deux valeurs
vivent dans deux fichiers différents**. Ce n'est pas un défaut de rédaction : c'est ce qui arrive
mécaniquement quand on ajoute par le bas sans relire par le haut.

Quatre occurrences vérifiées le 2026-08-03, arbitrées par Aurélien.

**1. Radius — deux axes, un seul déclaré.** `RADIUS-R12` disait « le rayon suit la taille **et rien
d'autre** » alors que `R03` posait *taille ET type* depuis la 1.1.0. Un agent devant une modale
n'avait aucun critère : il a pris `radius.md`, un cran de contrôle sur le plus grand conteneur du
système. Conséquence non vue : une card `radius.lg` (12 px) dans une modale `radius.md` (8 px) est
un interne plus rond que l'externe — **l'« oreille » que `R06` interdit noir sur blanc**. Le conflit
était écrit dans le système depuis MODAL-UI 1.0.0.
*Décidé* : R12 réécrite en question binaire — **conteneur → `radius.lg` quelle que soit sa taille ;
contrôle → sa taille décide**. MODAL et la liste de SELECT passent en `lg` (le déclencheur du select
reste `md` : c'est un contrôle). La question « conteneur ou contrôle ? » est vérifiable par une
machine ; « quelle taille ça fait ? » demande un jugement, donc diverge dès qu'on parallélise.

**2. Pill — une liste « fermée » que deux composants enfreignaient.** `R08` disait « badge/avatar
uniquement » pendant que SWITCH-UI et TABS-UI consommaient `radius.pill` depuis leur 1.0.0.
*Décidé* : la liste devient **fermée et énumérée** — badge/tag, avatar, piste de switch, piste
tabs-pill. Deux exceptions non déclarées valent une règle fausse : soit on les nomme, soit la règle
ne veut plus rien dire.

**3. Focus v2 — la prose propagée, le token jamais créé.** Le focus v2 du 2026-07-29 a retiré
`accent` (DESIGN 1.34.0) et posé `control.focus-*` dans **huit** fiches RULES et dans le CSS
(`tokens.source.mjs`, en `color-mix`). Mais **le groupe `control` n'a jamais été ajouté à
DESIGN.md** : `tokens.yaml` — le fichier que chaque fiche désigne en tête comme sa source de
tokens — ne définissait pas ce que huit fiches référençaient. Et `theme-gate.mjs` testait toujours
`accent`. Exécuté le 2026-08-03 sur les tokens de Fili : `>>> Theme REFUSE : 0 paire(s) sous le
seuil, 1 token(s) critique(s) manquant(s)`, **exit 1 — le gate refusait notre propre thème**, et la
seule paire qui testait l'anneau de focus ne testait plus rien.
*Décidé* : les six crans sont tokenisés dans DESIGN.md (1.35.0) en hexadécimal — la résolution en
thème clair du mélange défini dans le CSS, qui garde la formule comme implémentation — et
`theme-gate` teste **les six** à 3:1. Valeurs vérifiées : 3.51:1 à 4.69:1 en clair, 8.84:1 à 20.13:1
en sombre. **Cause racine outillée** : `genere-tokens.js` porte deux listes de groupes (`GROUPS`,
`GROUPES`) ; un groupe absent de ces listes est supprimé de la sortie **sans erreur**. Le silence
est commenté sur place — c'est lui qui a laissé le trou ouvert cinq jours.

**4. Dark mode — la doctrine était le seul des trois à mentir.** `COLOR-R16` disait « non couvert,
par décision » ; `ELEVATION-UX` légifère le relief en sombre en détail ; et `tokens.source.mjs`
**livre un thème sombre complet** (~45 rôles), exposé en `[data-theme="dark"]` et sous
`@media (prefers-color-scheme: dark)` — il s'active donc tout seul chez un utilisateur en sombre.
Trois états d'un même sujet : celui qui lisait COLOR s'arrêtait, celui qui lisait ELEVATION
construisait, le CSS basculait sans demander.
*Décidé* : R16 réécrite — **le sombre est couvert et livré**. Deux manques nommés à la place : la
table des paires garanties **en sombre** (COLOR-UI ne la décline pas), et le passage de
`theme-gate` sur le thème sombre.

**5. E-mail déjà utilisé — la table d'états tranchait un arbitrage produit.** La cellule
« → e-mail déjà utilisé » de CREATION-COMPTE-UX écrivait « chemin vers la connexion / lien
connexion » sans conditionnelle : c'est la **posture ouverte**, celle qui confirme à un inconnu
qu'une adresse est enregistrée. L'extension `creation-compte-email-deja-utilise` impose pourtant le
défaut **neutre** tant que le produit n'a pas arbitré — règle née du retour de pilote du
2026-07-16, précisément parce qu'un agent avait choisi la posture ouverte en silence. Et
l'extension est en `selon-contexte` : **l'agent qui construit le parcours nominal ne la charge
pas.** La correction de juillet était contournée par la table d'états elle-même.
*Décidé* : cellule et diagramme d'états conditionnés à la posture, défaut neutre rappelé sur place.

**Ce que ces cinq cas ont en commun, et ce qu'on en tire.** Aucun n'est un désaccord de fond : dans
les cinq, la bonne décision existait déjà quelque part dans le système. Ce qui manquait, c'est
qu'une **phrase de haut niveau** soit relue quand une valeur de bas niveau change. Trois familles
de vérification sont mécanisables et devraient tourner en CI plutôt qu'en audit : (a) chaque cran
revendiqué par un composant est-il autorisé par sa fondation ; (b) les absolus des fondations
(« rien d'autre », « uniquement », « jamais ») sont-ils tenus par leurs consommateurs ; (c) tout
token cité par une fiche existe-t-il dans `tokens.yaml`. La (c) aurait attrapé le focus v2 le jour
même.

---

## 2026-08-01 — LA SCÈNE : mesurer dans un état, et non au repos

**Décision.** Nouveau champ de fiche, `SCENE:`, à côté de `CRITERE:`. Il déclare **l'état dans
lequel la mesure est prise**. Liste **fermée**, comme la table des prédicats : `repos`,
`soumission-vide`, `tabulation`. Une scène absente ne s'improvise pas — elle remonte comme
manque et le paquet n'est pas produit.

**Pourquoi c'est structurant.** `ACCESSIBILITY-R18` (« `aria-invalid` n'est jamais seul ») ne
mesurait **rien** depuis deux jours : sur une page tranquille, aucun champ n'est en erreur.
Le moteur disait « rien à signaler » et c'était vrai au sens le plus creux du terme. La même
règle, dans la scène `soumission-vide`, examine six champs. **Mesurer au repos et conclure
« conforme » est la façon la plus polie de ne pas auditer.**

**Rejeu et unanimité, appliqués (§ 11.5).** Chaque scène est jouée **trois fois**. Un constat
qui ne se reproduit pas à l'identique devient un *non concluant*, jamais un constat. Un faux
positif intermittent détruit la confiance en une réunion.

**Une scène injouable n'est pas une conformité.** Une page sans formulaire ne « passe » pas
`FORM-R20` : la mesure n'a pas eu lieu, et le rapport le dit. Cinq des six pages de Passion
Courtage sont dans ce cas.

**Deux `CRITERE` posés** : `FORM-R20` (un résumé d'alerte visible apparaît après un échec) et
`FORM-R24` (chaque champ en erreur porte un message associé). Portée déclarée pour R20 : il
vérifie qu'un résumé **apparaît**, pas qu'il liste *toutes* les erreurs.

**Résultat, et il est à l'honneur du client.** Le formulaire de contact de Passion Courtage
produit un vrai résumé — `div[role=alert]` : « Votre demande n'a pas été envoyée : 6 champs
sont… » — et passe six champs en `aria-invalid`, chacun avec son message associé. **Trois rejeux
unanimes.** C'est le premier « rien à signaler » du projet obtenu sur une mesure qui aurait pu
échouer.

**Un critère retiré plutôt que livré faux.** `BORDER-U06` avait reçu
`aucun(":focus-visible") mesure(outline-style) == "none"`, et signalait sept contrôles sur la
page de contact. Vérification : la règle dit « jamais `outline: none` **sans remplacement
équivalent au seuil 3:1** », et le site change bien la couleur de bordure au focus. Établir s'il
y a remplacement demande une **mesure différentielle** — comparer l'état focalisé à l'état de
repos — mécanisme qui n'existe pas. Le `CRITERE` a été retiré ; la scène `tabulation` reste
construite et déclarée, en attente d'une règle qu'elle puisse servir honnêtement.

C'est le cinquième constat écarté par vérification en deux jours. Aucun n'a été trouvé par
relecture du code : tous par confrontation à la pièce.

## 2026-08-01 — LA COUCHE UX ENTRE DANS LE MOTEUR (loi 4.20)

**Le reproche, et il est fondé.** Neuf règles rendues exécutables, dont sept en fondations et
zéro dans `languages`, `flows` ou `patterns`. Le mécanisme de l'erreur a un nom : **on a laissé
l'instrument choisir la doctrine** — d'abord les 12 contrôles de `verifie-rendu`, puis « ce que
le CSSOM sait voir ». Le journal du matin appelait ça une découverte (*« le contrôle précédait la
règle »*) ; la journée l'a refait en plus grand.

**Ce que le comptage a montré.** 342 des 837 `MESURE` sont dans les couches UX. Et surtout :
`languages` 61 % de propriétés universelles, `flows` 58 %, `principles` 53 % — contre
`foundations` 39 %. **Les couches UX concentrent les normes opposables**, les fondations
concentrent les partis pris. Le statut de frontière disait l'ordre depuis le début.

**L'argument décisif** : `ACCESSIBILITY-UX` ne porte que 11 `MESURE` parce qu'elle est conçue
pour poser l'obligation et renvoyer au propriétaire. L'accessibilité vit dans `FORM`,
`VALIDATION`, `INTERACTION`, `GESTURE`. « Accessibilité d'abord » **impose** « UX d'abord ».
Versé au cahier comme **loi 4.20**.

**Quatre `CRITERE` posés, choisis dans le corpus avant de savoir comment les mesurer** :
`INTERACTION-R23` (nom accessible), `INTERACTION-R08` (étiquette visible), `INTERACTION-R10`
(surface cliquable = élément natif), `FORM-R05` (aucun tabindex positif). Deux prédicats
nouveaux — `nomme()` et `etiquete_visible()` — qui expriment deux notions **définies par la
norme** (WCAG 4.1.2 et 3.3.2), pas par nous. Deux règles n'ont demandé aucune machinerie.

**Portées partielles déclarées dans les fiches** : `R23` vérifie qu'un nom *existe*, pas qu'il
décrit la fonction (« cliquez ici » passe) ; `R08` n'automatise que l'étiquette visible, la
délimitation à 3:1 relevant d'un jugement que `BORDER-U09` déclare non scriptable.

**Un faux positif, encore, et le même remède.** Le moteur a signalé un `select` sans étiquette
sur Passion Courtage. Vérification : le `select` natif est un **shim** à `opacity:0`,
`aria-hidden="true"`, `tabindex="-1"`, conservé pour la soumission ; le vrai contrôle est un
combobox correctement étiqueté par `aria-labelledby`. **Le site avait raison.**

Cause : `visible()` ne testait que `getClientRects().length`. Corrigé — il remonte la chaîne des
ancêtres (`display`, `visibility`, `opacity`, `content-visibility`) et **exclut tout sous-arbre
`aria-hidden="true"`**, ce qui est normatif : un élément retiré de l'arbre d'accessibilité n'a
rien à faire dans une mesure d'accessibilité. C'est le quatrième faux positif écarté par
vérification en deux jours ; à chaque fois, c'est la lecture de la pièce qui a tranché, pas le
chiffre.

**Le harnais fabriquait sa propre divergence.** Le test de non-régression stubbait
`getClientRects` pour rendre la visibilité neutre — mais le contrôle en dur ne consulte que ça,
là où l'évaluateur du corpus consulte aussi le style calculé. Le talon avantageait un moteur.
Il respecte désormais `display:none`, seul fait de mise en page que jsdom connaisse vraiment.

**17 cas d'épreuve** pour les deux prédicats (`npm run verifie:ux`), dont neuf que le prédicat
doit rejeter — étiquette vide, `placeholder` tenant lieu d'étiquette, `aria-label` sans
étiquette visible, `aria-labelledby` mort, image sans `alt`, `tabindex` positif.

**Résultat sur Passion Courtage** : aucun écart sur les quatre nouvelles règles. Un « rien à
signaler » qui vaut quelque chose, puisque les prédicats sont prouvés mordants.

## 2026-07-31 — FILI AUDITÉ PAR FILI : le kit se signe, et ça change tout

**Fait.** Neuf règles du corpus exécutées sur les 90 pages construites. **643 écarts de contraste
— zéro sur un élément portant `data-slot`**, la marque que les composants de `@fili/react` posent
sur leur racine. Tous sont dans la feuille du site de documentation.

**Pourquoi c'est le résultat qui compte.** L'annexe A.2 avait produit six constats à la main le
matin même ; cinq mesuraient la feuille de la démo, pas le système. La machine fait la
distinction que l'œil avait ratée cinq fois sur six — **parce que le kit se signe**. Un système
qui marque ses composants est un système auditable. C'est un argument de conception, pas une
commodité d'outillage.

**Une tension du corpus, produite par la machine.** 578 des 643 écarts sont `text-muted`.
`COLOR-R09` (propriété universelle) pose 4,5:1 pour tout texte ; `COLOR-R12` déclare `text-muted`
à 2,54:1 et en autorise l'emploi sur les métadonnées accessoires. **WCAG 1.4.3 ne connaît pas
d'exception « métadonnée accessoire »** — ses seules exceptions sont le texte incident, les
logotypes et le grand texte. Les deux règles ne peuvent pas être vraies ensemble : soit R12 est
une **exception nommée** de R09 (relation `exception-de`, précédent F01 à ré-instruire), soit
c'est un écart assumé qu'il faut cesser d'appeler légitime. **Le moteur ne tranche pas** — il
produit la contradiction et s'arrête. À arbitrer.

Une partie des occurrences sont d'ailleurs des libellés de navigation (« Layout », « Theming ») :
du texte fonctionnel, pas de la métadonnée. C'est le cas F01 reproduit à l'échelle du site.

**Le grief Tailwind se répète sur l'espacement.** 24 utilitaires (`.p-3`, `.gap-1.5`, `.mt-px`)
hors de l'échelle `--space-*`. A.2 avait retenu « palette = défauts Tailwind, 5 tokens sur 5 » ;
c'est la même chose sur l'espacement. Le système déclare une échelle fermée et la couche
utilitaire en expose une autre à côté.

**Écart de nommage découvert.** `SPACING-R05` a d'abord répondu *en attente de déclaration* sur
Fili lui-même : la fiche écrit `spacing.base`, le thème émet `--space-base`. Le critère suit
désormais le nom **émis**, seul observable par un moteur, et l'écart est relevé dans la fiche. Il
n'a été visible qu'une fois la règle rendue exécutable.

**Trois corrections d'outillage.** (1) L'évaluateur DOM tentait d'exécuter les critères statiques
— une liste de propriétés CSS passée à `querySelectorAll` : bug livré le matin, corrigé.
(2) `dans()` reconnaît désormais une valeur **dérivée** d'un cran (`calc(var(--radius-lg) - 1px)`),
que `RADIUS-R06` autorise nommément pour le cas concentrique — quatre faux positifs supprimés ;
condamner une règle du corpus au nom d'une autre n'est pas un constat. (3) Deux limites de
l'instrument statique déclarées au rapport : il compte ce qui est **écrit**, pas ce qui est
employé, et il ne sait pas séparer le kit du site (la marque `data-slot` ne vaut que côté DOM).

**Lot 1 — critère atteint.** Le MVP devait « retrouver ce qui a été mesuré à la main aux annexes
A.1 et A.2, et ne rien inventer ». Les sept lignes de A.1 sont traitées : retrouvées, corrigées ou
déclarées hors portée. A.2 est refaite et son verdict est plus net que l'original. Aucun constat
n'a été fabriqué, et trois tentations de fabrication ont été écartées en cours de route
(`text-muted`, le pire arrêt d'un dégradé, le cas concentrique).

## 2026-07-31 — `contraste()` : le prédicat qui a failli livrer des faux positifs

**Décision.** `COLOR-R09` reçoit son `CRITERE`. Il écrit les **trois seuils de la norme en
clair**, dans la grammaire, plutôt que de les cacher dans le prédicat :

```
chaque("body *") contraste(color) >= 4.5
  ou mesure(font-size) >= 24 et contraste(color) >= 3
  ou mesure(font-size) >= 18.66 et mesure(font-weight) >= 700 et contraste(color) >= 3
```

La précédence (`et` lie plus fort que `ou`) suffit à dire WCAG 1.4.3 sans parenthèses. Le
prédicat, lui, ne fait qu'une chose : le rapport de luminance, avec composition alpha du texte
et de son fond effectif remonté d'ancêtre en ancêtre.

**Portée déclarée : R09 n'est que PARTIELLEMENT automatisée.** Sa seconde clause — « composant
ou état requis pour l'identifier atteint 3:1 » — suppose de savoir ce qui *identifie* un
contrôle. `BORDER-U09` déclare ce jugement non décidable par un script. La fiche le dit
maintenant, le rapport ne prétend pas au reste.

**Le faux positif évité.** Première version : sur un fond en dégradé, mesurer contre chaque
arrêt et garder le pire. Résultat sur Passion Courtage : **30 « écarts »**, dont le titre du
héros à 2,27:1. Vérification : le texte est posé sur la **moitié sombre** du dégradé — il est
conforme. Le pire arrêt était à l'autre bout de l'élément. `COLOR-R21` dit « le pixel le plus
défavorable », c'est-à-dire *sous le texte*, pas sur l'élément entier.

Correction : un fond en dégradé est **non concluant** tant que l'échantillonnage de pixels
n'existe pas. Les 30 écarts sont retombés à **zéro écart concluant** et 65 mesures non
concluantes, nommées. C'est la deuxième fois en une journée que la tentation d'un chiffre bat
la lecture de la règle — la première était `text-muted` (loi 4.15, loi 4.16).

**Ce qui empêche que ça recommence.** `tools/teste-contraste.mjs` : **13 cas d'épreuve à
verdict calculé à la main**, dont sept que le prédicat *doit rejeter*. Un prédicat qui ne mord
sur rien passe tous les sites — et « aucun écart » ne veut alors rien dire. Le harnais prouve
qu'il mord avant qu'on lise son silence. `npm run verifie:contraste`.

**Deux corrections d'instrument au passage.** Le runner **déroule la page et attend les
animations** avant de mesurer : un élément saisi à mi-fondu n'a pas la couleur qu'il aura.
Et l'opacité d'un ancêtre intermédiaire est **composée** (calcul exact) au lieu d'être déclarée
indécidable — seule l'opacité du porteur du fond reste non concluante.

**Nouvelle catégorie de sortie.** Le moteur distingue désormais quatre issues, pas trois :
conforme · en écart · **non concluant** (la mesure existe, la valeur n'a pas pu être établie) ·
en attente de déclaration (la donnée appartient au client). Confondre les deux dernières avec
« conforme » est la façon la plus simple de mentir avec un audit.

## 2026-07-31 — L'INSTRUMENT STATIQUE : le corpus lit la feuille de style, pas seulement le DOM

**Décision.** Quatre `MESURE` du corpus ne parlent pas du document rendu mais des **valeurs
déclarées** — « aucune valeur d'espacement en dur hors des crans de l'échelle », « aucune taille
de police en unités viewport seules ». Aucun sélecteur ne les atteint : une valeur écrite dans un
`@media` jamais appliqué reste une valeur écrite. `tools/instrument-statique.mjs` les récolte
via le **CSSOM du navigateur** — pas un analyseur CSS maison, qui divergerait en silence de la
cascade réelle.

La grammaire gagne deux formes, `chaque_valeur()` et `aucune_valeur()`, et deux prédicats,
`unites_seules()` et `clamp_avec_rem()`. Quatre `CRITERE` posés : `SPACING-R05`, `RADIUS-R03`,
`TYPOGRAPHY-R11`, `TYPOGRAPHY-R12`. **Le moteur exécute huit règles du corpus sur 1 040.**

**Un jeu de tokens vide n'est pas une conformité.** Sur Passion Courtage, aucun `--spacing-*` ni
`--radius-*` n'est déclaré : il n'y a pas d'échelle à laquelle confronter les 375 déclarations
d'espacement et les 104 de rayon. L'instrument sort une **troisième issue**, à côté de conforme
et en écart : *en attente de déclaration* (loi 4.18). Le taire ferait lire « rien à signaler » là
où rien n'a pu être regardé. C'est le premier emploi machine de ce quatrième état.

**Ce que l'instrument a corrigé du relevé à la main.** Le cahier disait « aucune échelle
typographique — 17 `clamp()` distincts ». **Les 17 sont exacts ; 3 seulement sont des
`font-size`, 14 sont de l'espacement.** Le chiffre était juste, l'attribution fausse : c'est la
loi 4.15 en plein, appliquée à nous. Idem pour « 20 `padding` + 15 `gap` » — 36 et 22 en réalité,
le relevé n'avait compté que les raccourcis, pas les propriétés longues.

**Le seul écart trouvé est net.** `TYPOGRAPHY-R12` : les trois `clamp()` de taille du site ont un
terme préféré en `vw` pur (`clamp(2.7rem, 5.6vw, 4.6rem)`). Le zoom navigateur n'agit pas sur les
unités viewport — entre les deux bornes, le texte ne grandit pas quand l'utilisateur zoome. C'est
exactement l'anti-patron que la règle nomme.

**Effet de bord.** Trois fiches bumpées (SPACING 1.3.0, RADIUS 1.2.0, TYPOGRAPHY 1.4.0) sans
aucune règle nouvelle ni modifiée : les condensés du paquet ne portent pas les `CRITERE`, la
citation a donc été relevée sans retoucher leur contenu — et c'est vrai.

## 2026-07-31 — LA MACHINE CORRIGE L'AUDITEUR : premier passage sur un site client

**Fait.** Le moteur piloté par le corpus a tourné sous Chromium 141 sur les 6 pages de Passion
Courtage, à 8 largeurs. Quatre règles exécutables sur 1 040 — le rapport le dit en tête plutôt
que de laisser croire à une couverture.

**Il a falsifié le relevé fait à la main le matin même.** L'annexe A.1 du cahier affirmait
« hiérarchie de titres correcte » : **h2 → h4 sur les six pages**, le pied ouvre ses blocs en
`h4` alors que le dernier titre du corps est un `h2`. Violation de `TYPOGRAPHY-R07`, propriété
universelle. Trois autres lignes de A.1 mélangeaient les portées — un chiffre relevé sur
`index.html` se lisait comme valant pour cinq pages (8 `<em>` contre 28 sur le site ; 13 liens
externes contre 33).

**Il a aussi trouvé ce que l'œil n'avait pas cherché.** Le débordement horizontal culmine à
**+125 px à 721 px** — la bascule compilée du site elle-même — et il y a **+11 px à 320 px** sur
`/contact.html`, seul régime que `GRID-R10` norme. Le relevé à la main avait balayé 900, 834,
768, 600 et 390 : ni le pire point, ni le seul point normé.

**Ce qu'il n'a pas fait, et qu'il dit.** Le débordement à 721/768/834 n'est **pas** rangé en « à
corriger » : `GRID-R10` ne norme que 320 px, donc le corpus ne dit rien à ces largeurs. Le
rapport le range en *non couvert* et pose la question au référentiel, pas au client. Un moteur
qui aurait « arrondi » aurait fabriqué une violation à partir d'une observation.

**Ce que ça enseigne.** La loi 4.16 prise à revers : un corpus de test écrit par l'auditeur
mesure l'auditeur — y compris quand l'auditeur croyait mesurer le client. C'est la première
fois qu'une machine du projet corrige une affirmation humaine du projet.

**Manques nommés par ce passage** : le prédicat `contraste()` (déclaré, jamais implémenté) et
surtout **un instrument statique** — lire la feuille de style du client, pas seulement le DOM
rendu. Sans lui, les échelles d'espacement, de typographie et de rayons de A.1 restent hors
d'atteinte.

## 2026-07-31 — QUATRE RÈGLES AU CORPUS, TROIS MÉCANISMES NOMMÉS

**Décision.** `TYPOGRAPHY-R07` reçoit son `CRITERE` : `suite("h1,h2,h3,h4,h5,h6") sans_saut`.
`suite()` parle d'une **séquence**, pas d'un élément : elle ne pouvait pas être un prédicat
élément par élément — c'est une **quatrième forme** de la grammaire, à côté de `compte()`,
`chaque()` et `aucun()`. Le test de non-régression le confirme : six occurrences, identiques des
deux côtés, sur cinq cas d'épreuve construits pour ça.

La grammaire gagne aussi une **précédence** (`et` lie plus fort que `ou`) et le prédicat `dans()`,
qui lit les crans `--control-focus-*` sur la racine — le harnais ne connaît aucune couleur en dur.

**Deux rattachements étaient faux.** `focus-invisible` était rattaché à BORDER-U04 (apparition
instantanée de l'anneau) ; il relève de **BORDER-U06** (jamais `outline: none` sans remplacement).
`focus-hors-systeme` était rattaché à BORDER-U03 (rayon de l'anneau) ; il relève de **BORDER-U02**
(anneau en `control.focus-color`). Deux règles réelles citées à la place des deux bonnes : la loi
4.15 décrit exactement ce piège, et il s'est refermé sur nous.

**Ce qui reste en dur, et pourquoi — nommément.** Trois contrôles ne reçoivent pas de `CRITERE`,
parce qu'en écrire un qui se trompe serait pire que de ne pas en écrire :

- `cible-trop-petite` (TOUCH-R06) : **aucune convention DOM ne permet à un élément de déclarer une
  exception nommée** (`inline`, `essentiel`). `declare_exception` est validé mais inévaluable. Le
  compilateur remonte ce motif exact plutôt que de laisser croire à une conformité.
- `focus-invisible` (BORDER-U06) et `focus-hors-systeme` (BORDER-U02) : demandent le **pilotage du
  focus clavier** et la **remontée d'ancêtres** — le kit pose volontairement l'anneau sur le cadre
  du composant, pas sur le champ.

La remontée d'ancêtres est le **même manque** que la divergence R18 du jour : `porte_ou_ascendant`.
Arbitré : on ne l'ajoute pas. Conséquence assumée — les deux contrôles de focus restent dans
`verifie-rendu.mjs` et R18 reste partielle. Le harnais le dit à chaque exécution.

**Loi versée au cahier Audit (4.19).** Un constat de doctrine (qui cite une règle, un statut, une
source) et un contrôle d'hygiène de build (404, erreur JS, page injoignable) ne se mélangent pas
dans un rapport. Une 404 rangée parmi les violations du design system donne à un défaut
d'intendance l'autorité d'une règle, et noie les vrais constats. Corollaire outillage : un contrôle
qui ne peut citer aucune règle n'a rien à faire dans le moteur piloté par le corpus.

## 2026-07-31 — LE MOTEUR LIT LE CORPUS : trois règles quittent le code, une divergence instruite

**Décision.** Le champ `CRITERE:` est posé et il traverse toute la chaîne : la fiche markdown le
porte à côté de `MESURE:` (qui ne bouge pas — la prose reste le texte du constat livré),
`extrait-decisions.py` le projette dans la fiche de doctrine, `compile-regles.py` l'émet dans
`dist/audit/RULES-*.md`. Deux outils nouveaux le consomment : `tools/criteres-grammaire.mjs`
(compilateur + évaluateur, **table de prédicats fermée**) et `tools/execute-criteres.mjs` (le
moteur, sous Chromium). Le moteur ne connaît **aucune règle en dur** : retirer un `CRITERE:` d'une
fiche le retire du moteur.

**Ce que le test de non-régression a trouvé.** `tools/teste-criteres.mjs` fait tourner sur le même
DOM les contrôles en dur de `verifie-rendu.mjs` et l'évaluateur piloté par le corpus. Les 90 pages
construites ne déclenchent qu'une occurrence — elles prouvent que les deux moteurs se taisent
ensemble, pas qu'ils s'accordent. Douze cas d'épreuve forcent chaque branche. Résultat : **10
occurrences côté code, 11 côté corpus**.

L'écart est réel et il est du côté du corpus. Sur
`<fieldset aria-describedby="e"><input aria-invalid="true"></fieldset>`, le code remonte au
`fieldset` (`closest`) et ne signale rien ; le `CRITERE` de `ACCESSIBILITY-R18`, écrit avec
`porte(...)`, n'interroge que l'élément et signale une faute. **Le code avait raison** — R18 dit
« associé par une relation programmatique », jamais « porté par l'élément ».

**Ce qu'on n'a pas fait.** On n'a pas ajouté le prédicat `porte_ou_ascendant(attr)` qui corrigerait
le critère. La table des prédicats est fermée par construction : un prédicat absent remonte comme
manque et s'arbitre, il ne s'improvise pas — même mécanique que le `MISSING-COMPONENT-PROTOCOL`,
appliquée au moteur. R18 reste donc partiellement automatisée, et le harnais le **dit à chaque
exécution** au lieu de le taire.

**Pourquoi ça compte.** C'est la première fois qu'une règle du corpus est exécutable sans qu'un
outil la connaisse. C'est aussi la première fois qu'un désaccord entre le code et la doctrine est
sorti par une machine plutôt que par une relecture — le cas exact que le § 4 du cahier de lot
annonçait comme « une trouvaille, pas un échec ».

**Effets de bord assumés.** Les condensés `tools/plugin/rules/RULES-accessibility.md` et
`RULES-typography.md` ont été resynchronisés (R17, R18, R06 amendée) et leurs deux entrées de
`fraicheur.derives.json` supprimées : la garde de fraîcheur avait correctement refusé de produire
le paquet, parce que la dérive avait cessé d'être éditoriale pour devenir doctrinale.

**Portée du test.** L'instrument est jsdom — cette machine n'a pas de navigateur. Le test ne vaut
que pour les critères purement structurels. Tout critère géométrique (`mesure`, `contraste`) devra
passer par `execute-criteres.mjs` sous Chromium avant d'être dit éprouvé.

## 2026-07-31 — LE CONTRÔLE PRÉCÉDAIT LA RÈGLE : trois trous ouverts par l'inventaire du moteur

- **Fichiers** : `foundations/TYPOGRAPHY-UX.md` (1.2.0 — `TYPOGRAPHY-R06` amendée, premier `CRITERE` du corpus), `principles/ACCESSIBILITY-UX.md` (1.2.0 — `ACCESSIBILITY-R17`, `ACCESSIBILITY-R18`, sources S8/S9). Aucun token, aucun composant.
- **Origine** : lot 1 du projet Fili Audit — inventaire de ce que le moteur existant contrôle déjà (`docs/chantiers/LOT1-GRAMMAIRE-CRITERE.md`). Sur les douze contrôles de `tools/verifie-rendu.mjs`, **cinq appliquaient une règle du corpus, quatre relevaient de l'hygiène de build, et trois ne s'appuyaient sur rien**. Le code était plus exigeant que la doctrine — c'est l'inverse de la Méthode, et c'est resté invisible tant que personne n'avait confronté les deux listes.
- **`titre-absent`** — `TYPOGRAPHY-R06` disait « **un seul** h1 » : une page sans aucun h1 satisfaisait la lettre de la règle, alors que le vérificateur la signalait depuis le 30/07. La règle passe à « **exactement un** ». Arbitrage d'Aurélien : le motif est le référencement — le h1 est lu comme le sujet de la page, l'absence coûte autant que la duplication.
- **Ce que l'amendement ne dit pas** : rien du graphisme. `TYPOGRAPHY-R08` (le niveau et la taille sont deux décisions indépendantes) était déjà écrit et couvrait exactement la nuance soulevée — un h1 peut légitimement être rendu plus petit qu'un h2. La règle a donc gagné une obligation de **présence**, pas une obligation de **poids**.
- **`ACCESSIBILITY-R17`** — aucune règle n'exigeait qu'un `aria-describedby` désigne un élément existant. Le commentaire de `verifie-rendu.mjs` qualifiait pourtant déjà ce cas de « défaut le plus silencieux de la chaîne » : le message disparaît pour la technologie d'assistance sans que rien ne bouge à l'écran. Seul le rendu peut le voir — les identifiants sont générés par `React.useId`, aucune lecture de source ne les confronte.
- **`ACCESSIBILITY-R18`** — `aria-invalid` posé sans message associé annonce l'échec sans dire pourquoi. `INPUT-UX` parlait du message et de son `aria-describedby`, jamais de cette implication. Placées dans le principe et non chez `INPUT` : elles ne concernent aucun composant en propre, et `ACCESSIBILITY-R02` réserve le détail au propriétaire.
- **Premier `CRITERE` du corpus.** Ces trois règles inaugurent le champ `CRITERE:`, posé **à côté** de `MESURE:` sans le remplacer : la prose reste le texte du constat livré au client, le critère est ce que la machine exécute. Grammaire fermée à trois formes et sept prédicats (`docs/chantiers/LOT1-GRAMMAIRE-CRITERE.md`) — un critère qui aurait besoin d'un prédicat absent ne s'écrit pas, il remonte comme manque, même mécanique que le `MISSING-COMPONENT-PROTOCOL`.
- **Ce qui reste ouvert** : les quatre contrôles d'hygiène (`lien-mort`, `lien-hors-basepath`, `erreur-javascript`, `page-injoignable`) n'entrent pas dans le corpus et n'y entreront pas — un 404 n'est pas un écart au référentiel. Le rapport devra les afficher **séparément** des constats de doctrine, sous peine d'affaiblir ces derniers.

## 2026-07-30 — VALIDATION : une erreur cesse d'être un style choisi, elle devient la conséquence d'un verdict

- **Fichiers** : `packages/react/src/lib/{validation.ts,field.tsx}` (nouveaux), `components/{input,select,checkbox,radio}/*.tsx`, `src/index.ts`, manifeste (`schema.ts` + les six déclarations), `apps/site/content/md/principles/VALIDATION-UX.md` (nouveau) et son inventaire, `apps/site/app/ui/formulaire-pilote.tsx` (nouveau) + `registry.tsx`, `tools/{fili-check.mjs,verifie-manifeste.mjs}`, `tools/plugin/config-intentions.js`, trois fichiers de tests.
- **Ancien état** : la doctrine décrivait la chaîne entière — `INPUT` la mécanique d'un champ, `FORM` les soixante règles de l'orchestration, `VOICE` le mot, `ACCESSIBILITY` l'annonce — et **aucune pièce ne la rendait exécutable**. `<Input.Field status="error">` s'écrivait à la main, sans qu'aucun verdict ne le justifie ; `Select` n'avait aucune prise de validation alors que `SELECT-R07` déclare son état d'erreur depuis toujours ; `Checkbox.Group` acceptait un `error` libre, sans code ni origine, et ignorait toute cardinalité. Le dépôt n'avait pas de dette de mauvais usage : il avait une dette d'**absence** (diagnostic : `docs/chantiers/VALIDATION-DIAGNOSTIC.md`).
- **Nouvel état** : un **contrat atomique unique** — `lib/validation.ts`, sans React, sans DOM, sans couleur — produit le verdict ; tout le reste en dérive. Cinq états (`pristine` · `validating` · `valid` · `invalid` · `warning`), quatre sources (`native` · `schema` · `business` · `server`), une `ValidationIssue` qui alimente **à la fois** le message local et l'entrée du résumé. Les contrôles gagnent **une seule prise** : la prop `verdict`. Le statut visuel, `aria-invalid`, `aria-busy` et le texte du message en descendent.
- **Pourquoi un principe et non un langage** : la chaîne traverse six propriétaires. Sans un document qui possède *la chaîne* — et rien d'autre — chacun aurait fini par écrire sa propre définition du verdict, c'est-à-dire six définitions, donc aucune. `VALIDATION-UX` ne recopie aucune règle : il pose les invariants transversaux et renvoie, table d'autorité à l'appui.
- **`pristine` n'est pas `valid`** : l'absence de verdict ne prouve rien. C'est la distinction qui empêche un formulaire jamais validé de se croire soumissible — et c'est pour ça que la soumission **recalcule** au lieu de lire l'état affiché.
- **Une seule erreur locale, avec une priorité déclarée** : gravité (erreur avant avertissement), puis source (serveur → métier → schéma → natif), puis, à source native égale, la contrainte la plus structurelle. « Le serveur fait foi » n'est donc pas seulement écrit dans `FORM-R33` : c'est le premier critère de tri, et `reconcile` REMPLACE le verdict client au lieu de l'empiler.
- **La correction se calcule, elle ne s'efface pas** : un verdict porte la **signature** de la valeur qu'il a jugée. Il périme dès qu'elle change — et la signature d'une sélection est sérialisée de façon injective (`JSON.stringify`), parce qu'un `join("|")` confond `["a|b"]` et `["a","b"]` (même défaut que celui corrigé sur `Checkbox.Group` le matin même).
- **`Select` rejoint le bloc champ au lieu d'en avoir un second** : le contexte de `Input.Field` sort d'`input.tsx` vers `lib/field`, et le select y consomme `for`/`id`, `aria-describedby`, `aria-required` et le verdict. Un `<button>` est un élément étiquetable : le libellé visible suffit, l'`aria-label` n'est plus obligatoire dans ce cas. Aucun axe `status` décoratif ne lui a été ajouté — **un select n'est pas « rouge », il est en erreur parce qu'un verdict le dit**.
- **Le bloc « icône + “Erreur :” + texte » était écrit trois fois** (Input, Checkbox.Group, Radio.Group). Il est écrit une fois (`FieldMessage`), et il qualifie désormais selon la GRAVITÉ : dire « Erreur » sur un avertissement serait un mensonge poli.
- **`status` et `error` survivent, requalifiés** : ce sont des modes de **présentation**, pour les fixtures qui montrent un état isolé. Dès qu'un verdict existe, il l'emporte. Une nouvelle règle de `fili-check` — `statut-sans-verdict` — refuse un statut posé sans verdict dans une page réelle ; les cinq fixtures de l'atelier sont déclarées comme telles, à la ligne, avec leur raison. La liste des composants concernés n'est écrite nulle part : elle est **lue du manifeste** (`validation.role`), donc un contrôle futur est couvert le jour où il se déclare.
- **Le manifeste exige la déclaration, structurellement** : `verifie-manifeste` lit l'**AST** de chaque composant et repère ceux qui rendent réellement un `input`, `textarea`, `select`, `role="combobox"` ou `role="switch"`. Une recherche textuelle aurait pris le `closest('[role="combobox"]…')` d'`app-layout` pour un contrôle de formulaire. Six composants sont concernés ; `Switch` et `ThemeToggle` déclarent `none` **avec justification** — l'un agit tout de suite, l'autre est une préférence d'affichage.
- **Ce qui n'a PAS été fait, et pourquoi** : aucun `<Form>`, aucun `<ErrorSummary>`, aucun hook d'orchestration public. Un seul consommateur existe (le pilote) : la primitive commune n'est pas démontrée par l'usage, et `MISSING-COMPONENT-PROTOCOL` veut un arbitrage avant une API. L'orchestration vit donc dans la tranche pilote de l'Atelier, écrite une fois, et sa promotion reste une question ouverte — journalisée, pas escamotée.
- **Confirmer un succès reste un choix** : `valid` ne rend pas `success` tout seul (`confirmValid` est explicite et faux par défaut). `INPUT-R16` range « validé sans besoin de le signaler » dans le statut par défaut ; `INPUT-R20` réserve la confirmation aux champs à forte friction.
- **La chaîne est un GREFFON, pas un étage du noyau** (arbitrage Aurélien, 30/07 au soir : « la chaîne de validation est un plus, comme un plugin du kit »). Point d entrée séparé — `@fili/react/validation`, à côté de `@fili/react/manifest` — qui porte le contrat exécutable ET le jeu de messages français. Le baril du noyau ne garde que la **prise** : la prop `verdict` des contrôles, et les TYPES qui permettent de la déclarer — ils s effacent à la compilation, donc ils ne coûtent rien à qui ne valide pas. Une page de contenu ou un cadre applicatif ne chargent ni le contrat ni les textes.
- **Le jeu de messages entre dans le kit, le noyau reste sans texte.** C est la contradiction que le greffon résout : `messagesFR` est livré (14 jeux — texte, e-mail, téléphone, URL, mot de passe, quantité, texte long, select, case, groupe de cases, groupe de radios, serveur/champ, serveur/global, attente), mais **sous le point d entrée du greffon**, jamais dans `@fili/react`. Un jeu se SURCHARGE (`{ ...messagesFR.email, valueMissing: "…" }`), il ne se recopie pas — le `fallback` reste garanti. La table de l Atelier ne stocke aucun texte : elle les LIT dans ce jeu et n ajoute que la pédagogie (quand la contrainte se déclenche, d où vient le verdict, quelle nuance évite le contresens).
- **La démo pilote a cédé la place à cette table.** Un formulaire au repos ne montre rien d une chaîne de validation ; ce qui se lit, c est ce que le système DIT quand une valeur ne convient pas. `formulaire-pilote.tsx` reste sur disque, non affiché : c est la preuve exécutée de la chaîne (tests d intégration) et il vit sous la garde `statut-sans-verdict`.
- **Limite assumée, nommée** : la famille du choix n'a pas de teinte d'avertissement (`CHOICE-UI` ne déclare aucun rôle de token pour ça). Un `warning` sur une case ou un groupe de radios reste `default` et n'est porté que par son message. Inventer une couleur ici aurait été créer un token par commodité d'implémentation.

## 2026-07-31 — BUTTON-U02/U03 : le système cesse de nommer six états et d'en outiller trois

- **Fichiers** : `components/BUTTON-UI.md` (1.9.0 — `BUTTON-U02`, `BUTTON-U03`, fenêtre de motion des états, sources T7–T9), `packages/tokens/src/tokens.source.mjs` (`surface-disabled`, `on-surface-disabled`), `packages/tokens/build/validate-contrast.mjs` (encadrement), `packages/react/src/lib/interaction.css` (`.ds-pressable`, `.ds-inert`), `packages/react/src/components/button/relief.css` (21 gardes `:not(:disabled)`), `button.tsx`, `compact-button.tsx`, `switch.tsx`, `select.tsx`, `lib/choice.css`, fiche `manques/hover-intent.md`.
- **Origine** : note P1 rapportée par Aurélien le 2026-07-31, tirée d'un corpus externe sur les états d'interaction. Quatre demandes ; deux retenues, une déjà satisfaite, une écartée — le détail de l'arbitrage est ci-dessous, parce que refuser proprement fait partie du corpus autant qu'accepter.
- **Ancien état, et il était pire que la note ne le disait.** (1) L'`active` existait, mais **uniquement sous `[data-relief]`** : couleur enfoncée, ombre interne et course de 0,5 px vivaient toutes dans `relief.css`. Le relief est un registre DÉBRAYABLE depuis le panneau Theming ; débrayé, le bouton n'accusait plus réception du clic. Or `INTERACTION-R13` est une **propriété universelle** — elle ne peut pas être suspendue par un réglage d'ambiance. (2) Le `disabled` était `opacity: .5`, une valeur en dur que le § Implémentation de `BUTTON-UI.md` interdit dans la phrase même où il exige que « chaque propriété visuelle soit liée à un token ». (3) Surtout : `relief.css` **ne portait aucune garde `:disabled`**. Registre actif — le défaut — un bouton indisponible gardait son ombre d'objet posé, s'éclaircissait au survol et s'enfonçait au clic. Il mentait sur sa disponibilité, l'exact envers de `BUTTON-R80`.
- **Nouvel état** : deux couches partagées dans `lib/interaction.css`. `.ds-pressable` porte le minimum d'activation indépendant du registre (`scale(--ds-press-scale)`, 0,98) et **une seule** déclaration de transition pour le survol, le focus et la pression ; le relief garde ce qui lui est propre et l'enrichit au lieu de le créer. `.ds-inert` porte l'indisponibilité en deux rôles nommés. Les 21 sélecteurs interactifs de `relief.css` sont gardés : aucun signal de relief ne survit sur un contrôle inerte.
- **Pourquoi une géométrie et pas un cran chromatique** : la note poussait vers une couleur d'`active` tokenisée. `INTERACTION-R14` dit « sensation de **pression** » — une identité tactile. Un cran par tone aurait ajouté 3 valeurs × 4 styles à une grille qui en porte déjà huit, pour dire ce qu'une échelle de 0,98 dit sans ambiguïté. **Zéro token de couleur** est né pour cet état.
- **Pourquoi un ENCADREMENT et pas un plancher** : c'est le seul couple du système dont le ratio doit rester **sous** un plafond. Au-dessus de 4,5:1 l'indisponible se confond avec un contrôle actif (`INTERACTION-R13`) ; sous 1,8:1 il devient le disabled silencieux que `BUTTON-R80` proscrit. `validate-contrast.mjs` gagne donc `addEntre()` et vérifie les deux bornes sur les trois fonds où l'état se pose — 76 paires au total, contre 72.
- **Ce que l'opacité rendait invérifiable, chiffré** : `opacity: .5` donnait 2,29:1 pour un filled posé sur la page, 2,34:1 pour le même posé sur une carte, 3,38:1 pour un ghost. « Disabled » n'était pas un état, c'en était douze, dont aucun n'était atteignable par une chaîne qui raisonne sur des **paires** de tokens. Le couple tokenisé donne 2,05 / 2,54 / 2,31 en clair et 2,13 / 4,16 / 3,04 en sombre — sous le seuil texte à dessein, WCAG 1.4.3 exemptant les contrôles indisponibles.
- **La rampe ne grandit pas** : `surface-disabled` et `on-surface-disabled` reprennent des crans existants (`neutral.200/700`, `neutral.400/500`) sous un nom d'**intention** — même procédé que `neutral`, alias de `surface-inverse`. Aucune montée de version de `DESIGN.md` : ce sont des extensions DS-UI, du même statut que `text-disabled` et `text-inverse`, qui n'y figurent pas non plus.
- **La portée dépasse le bouton, et c'est assumé** : `CompactButton`, `Switch`, `Select` et la marque de la famille du choix consommaient la même opacité en dur. Cinq composants improvisaient là où cinq autres (`Input`, `Tabs`, `Dropdown`, `choice` pour son libellé) consommaient déjà `text-disabled`. Le kit avait deux traitements du même état ; il n'en a plus qu'un.
- **Ce qui a été REFUSÉ, et pourquoi c'est un résultat.** (a) *Les fenêtres de temps par état* : la plainte visait un token « opaque », mais `motion.fast` **vaut 100 ms** et porte son rationale (seuil du perçu-instantané) — c'est déjà dans la fourchette réclamée. Éclater une échelle de trois valeurs en une fenêtre par état aurait importé des nombres sans MESURE et permis aux trois états de se désynchroniser. Corrigé autrement : l'en-tête déclare la fenêtre pour hover, focus ET active, et le code n'a qu'une déclaration de transition — la doctrine et le code disent la même chose. (b) *Le délai anti-déclenchement de 150–200 ms au survol* : refusé **sur le bouton**, où le survol EST l'affordance principale (`BUTTON-R85`) et où 150 ms de latence contrediraient `LAWS-R29`. Le motif est réel, mais il protège l'ouverture d'un SUPERPOSÉ, pas le retour d'état d'un contrôle. Aucun composant du kit ne s'ouvre au survol aujourd'hui (`Dropdown` et `Select` s'ouvrent au clic) : l'écrire maintenant aurait reproduit exactement la faute que la fiche `famille-du-choix` venait de corriger — une règle que le système ne permet à personne de tenir. Déclaré en fiche de manque, à rouvrir avec un Tooltip.
- **Dérogation nommée `amplitude-de-geste`** : `DeleteButton` presse à 0,95 et non 0,98. Sa pression n'est pas un accusé de réception mais un geste de confirmation maintenu — l'amplitude fait partie du message. Écart tracé, pas résorbé de force.
- **Reste ouvert** : la course de 0,5 px du relief a été retirée avec la migration (une longueur en dur n'a pas sa place dans la couche pilote, et le vérificateur de tokens le refuse) ; si le pressé du registre relief paraît trop plat sans elle, elle reviendra sous forme de cran d'espacement, pas de littéral.

## 2026-07-30 — SHELL : un rail hors-champ qui n'est pas découpé n'est pas hors-champ, il est à côté

- **Fichiers** : `packages/react/src/components/app-layout/app-layout.css`, `apps/site/app/components/shell.tsx` (`asideLabel="Réglages"`).
- **Ancien état** : les deux rails du shell (nav à gauche, réglages à droite) étaient sortis du cadre par `transform: translateX(±100%)`, et le commentaire disait « off-canvas ». Il l'était pour celui de gauche seulement : en sens de lecture LTR, un débordement à gauche n'est pas atteignable, le navigateur le jette. À droite, rien ne le jetait — `.sw-shell` n'avait aucune découpe, `html`/`body` non plus. Le document mesurait donc 710 px de large sur un téléphone de 390, le rail de réglages vivait **à côté** du contenu, et le FAB ne commandait rien qui fût réellement caché. Mesuré : `scrollWidth` 710 sans découpe, 390 avec.
- **Nouvel état** : `.sw-shell` gagne `overflow-x: clip`. Le rail sorti est découpé au bord du shell ; le document reprend la largeur de la fenêtre ; le FAB redevient la **seule** porte d'entrée des réglages sous 1280 px de shell, ce qu'il prétendait déjà être.
- **`clip` et non `hidden`** : `hidden` aurait fait du shell un conteneur de défilement — la topbar collante se serait recalée sur lui et l'aperçu plein écran (`position: fixed`) aurait changé de référentiel. `overflow-x: clip` avec `overflow-y: visible` découpe **sans** créer de scrollport : la paire `visible`/`clip` est admise telle quelle. Vérifié : `position` de la topbar reste `sticky`, l'aperçu plein écran reste au cadre.
- **Hors-champ veut aussi dire hors du clavier** : les deux rails prenaient `visibility: hidden` nulle part, donc leurs contrôles (le sélecteur de section, les quatre réglages de theming) restaient dans l'ordre de tabulation et dans l'arbre d'accessibilité d'un écran où ils n'existaient pas. La visibilité est désormais retirée **à la fin** du glissement (`transition: visibility 0s linear var(--duration-base)`) et rendue immédiatement à l'ouverture — l'animation reste entière, l'état fermé est vraiment fermé. Le nœud, lui, ne se démonte toujours jamais : les portails du consommateur (`#section-nav`, `#section-tools`) survivent aux bascules, c'est la mécanique mono-nœud d'origine.
- **Ce que ça ne change pas** : les seuils (sidebar 1024, aside 1280), la nature des bascules (largeur du **shell**, jamais du viewport), ni le nombre de FAB à l'écran (un seul, RULES-button).

## 2026-07-30 — LIENS INTERNES : le site publié pointait hors de lui-même, et la garde de rendu le voyait sans le dire

- **Fichiers** : `apps/site/app/components/{grille-liens.tsx,lien-markdown.tsx}`, `apps/site/app/md/grille-sujets.tsx`, `apps/site/app/page.tsx`, `packages/react/src/components/card/card.tsx` (`Card.TitleLink asChild`), `tools/verifie-rendu.mjs` (règle `lien-hors-basepath`), `tools/teste-verifie-rendu.mjs` + `tools/fixtures/rendu-basepath/`.
- **Constat** : sur GitHub Pages, les trois destinations de la page d'accueil et toute la grille de la Vue d'ensemble menaient hors du site. Le HTML publié portait `href="/md"` — c'est-à-dire `https://sibylfounders.github.io/md`, la racine du **domaine**, pas celle du site, qui est servi sous `/fili`.
- **Cause** : le `basePath` est injecté au build par `actions/configure-pages`, et **`next/link` est le seul à le poser**. Or ces liens étaient des `<a href>` nus — `Card.TitleLink` et le `Link` du kit rendent un `<a>`. Les liens qui passaient déjà par `next/link` (le fil d'Ariane, la navigation latérale, la marque) fonctionnaient : c'est exactement pour cela que le défaut ne se voyait qu'à certains endroits.
- **Correctif** : `Card.TitleLink` gagne `asChild`, la MÊME porte que `Link` a depuis toujours (« `asChild` permet un routeur externe »). Ce n'est pas une capacité nouvelle : elle manquait au seul endroit où la cible est étendue, ce qui ne laissait aux cartes de destination que l'`<a>` nu. Les trois producteurs de liens internes composent désormais `next/link` : `grille-liens`, `grille-sujets`, et `lien-markdown` — ce dernier ne route que les adresses internes, une ancre ou un `mailto:` n'ayant rien à demander au routeur.
- **Pourquoi la garde n'a rien vu** : `verifie-rendu` avait déjà une règle `lien-mort`, née du `/md/chip/` du 2026-07-30. Mais pour comparer une adresse à l'inventaire construit, elle la **normalisait en retirant le basePath** — et acceptait donc indifféremment `/fili/md` et `/md`. La page cible existait, le verdict était vert, et l'adresse écrite ne la servait pas. Une garde qui répond à la mauvaise question.
- **Nouvelle règle `lien-hors-basepath`** : quand le build porte un basePath (déduit du HTML, pas du dépôt), tout lien racine-relatif doit le porter. Elle est **inerte en local**, où le préfixe est vide — et le rapport le DIT désormais en toutes lettres, plutôt que de laisser lire un vert local comme une preuve sur le site publié. C'est la même politique que le plafond `--focus` annoncé : un silence sur ce qui n'a pas été vérifié est un mensonge lent.
- **La règle est éprouvée hors CI** : une fixture dédiée (`fixtures/rendu-basepath/`) sert une racine sous `/fili` avec un lien correct et un lien nu ; l'auto-test exige exactement un constat, sur le mauvais, et aucun sur le bon. Sans elle, une règle qui ne peut se déclencher qu'en CI ne serait jamais éprouvée qu'en production.
- **Au passage** : les trois destinations de l'accueil portent leur barre finale (`/md/` et non `/md`). Le site est construit en `trailingSlash` ; s'en passer coûtait une redirection à chaque entrée.

## 2026-07-30 — CARD-R26 : le régime de sélection appartient au GROUPE, et il devient intypable de le mélanger

- **Fichiers** : `packages/react/src/components/card-group/{card-group.tsx,collection-context.ts}`, `packages/react/src/components/card/card.tsx`, manifeste (`CardGroup` gagne l'axe `selection`, `Card` la prop `value`), atelier (`app/ui/card-group.tsx`, `registry.tsx`), tests (`__tests__/card-group.test.tsx`), fiche `manques/famille-du-choix.md` (→ résolu).
- **Ancien état** : `CARD-R26` — « dans un groupe de cartes sélectionnables, toutes partagent le même mode (single ou multi) » — était écrite et **non tenue**. `mode="selectable"` était implicitement cumulable : chaque carte portait son `selected` et sa bascule, personne ne pouvait dire « une seule à la fois », et le choix exclusif en cartes était tout simplement impossible. Une règle qu'aucun code ne peut violer parce qu'aucun code ne peut l'appliquer.
- **Nouvel état** : `CardGroup` gagne l'axe **`selection="single" | "multiple"`**, avec la valeur retenue. La règle n'est pas seulement vérifiée : elle est **écrite dans le type**. `CardGroupProps` devient une union discriminée — `single` n'accepte qu'une valeur, `multiple` qu'un tableau, et sans `selection` déclaré aucune des deux n'entre. Un groupe mixte ne se tape pas.
- **Pourquoi au GROUPE et pas à la carte** : « une seule à la fois » est une propriété **collective**. Une carte seule ne peut pas la faire respecter, et deux cartes qui la déclareraient chacune de leur côté produiraient exactement le groupe mixte que la règle interdit. La frontière de `COLLECTION-UX` bouge donc d'un cran, et c'est cohérent avec elle : la collection possédait déjà le contexte collectif de mode et de densité ; elle possède maintenant le régime. La **carte garde ce qui lui appartient** — le rendu de son état, sa bascule, son clavier.
- **Ce que le régime change dans l'arbre** : un groupe à choisir n'est plus une liste, c'est une **question**. `role="radiogroup"` (exclusif) ou `role="group"` (cumulable), et les cellules cessent d'être des `listitem` — un `listitem` n'a rien à faire entre un `radiogroup` et ses radios. Chaque carte prend alors le rôle que `CARD-R25` nomme explicitement : `radio` ou `checkbox` avec `aria-checked`, au lieu du `role="button"` + `aria-pressed` de la carte autonome.
- **Le clavier suit l'APG, sans être réinventé** : en régime exclusif, un seul arrêt de tabulation (l'option retenue, à défaut la première), les quatre flèches circulent — une collection est une grille, « suivant » est à droite ou en dessous selon le nombre de colonnes, et l'utilisateur ne sait pas lequel il regarde — et la **sélection suit le focus**. Rechoisir l'option déjà retenue ne la dé-coche pas. En cumulable, chaque carte est un arrêt et Espace bascule : c'est le clavier d'une case à cocher, il était déjà juste.
- **Trois gardes explicites plutôt qu'un régime à moitié appliqué**, dans la même politique que la frontière des enfants directs : un `selection` sans `mode="selectable"` échoue, une carte sans `value` sous régime échoue **en nommant son rang**, et un groupe à choisir sans `label` échoue — la proximité visuelle d'un titre au-dessus ne rattache rien (`CHOICE-R06`, transposé à la collection).
- **Compatibilité** : sans `selection`, rien ne change. `mode="selectable"` + `selected` / `onSelectedChange` par carte continue de produire une liste et des `aria-pressed`, exactement comme avant. Le régime est un ajout, pas un remplacement.
- **Reste ouvert** : `Card.Control`, c'est-à-dire la branche « input réel » de `CARD-R25`. La carte prend aujourd'hui la troisième branche que la règle autorise (le rôle ARIA). L'essai *carded* dira, par l'usage, si un vrai `input` imbriqué est nécessaire — il est prévu après, comme convenu.

## 2026-07-30 — LA FAMILLE DU CHOIX : le système cesse d'édicter des règles qu'il ne permet pas de tenir

- **Fichiers** : `components/CHOICE-UX.md` + `components/CHOICE-UI.md` (1.0.0, nouveaux), `inventaires/inventaire-cas-usage-choice.md` (16 situations), `inventaires/manques/famille-du-choix.md` (validé), `packages/react/src/lib/choice.{ts,css}`, `packages/react/src/components/{checkbox,radio}/`, manifeste (`schema.ts` gagne `SousApi`, `catalogue.ts` gagne deux entrées), atelier (`app/ui/registry.tsx`), tests (`__tests__/choice.test.tsx`).
- **Ancien état** : quatre doctrines déjà écrites renvoyaient à des composants absents. `SWITCH-UX` posait la ligne de partage « switch = effet immédiat, **checkbox** = sélection validée à la soumission » et cédait des règles à une checkbox qui n'existait pas. `SELECT-UX` désignait « des **radios** visibles » comme la bonne réponse sous le seuil. `CARD-R25` exigeait un état sélectionné exposé « par case, **bouton radio** ou attribut ARIA » quand `Card` ne savait faire qu'`aria-pressed`. C'est le symptôme d'`INPUT-R38` avant `Input.Label`, à quatre exemplaires.
- **Nouvel état** : deux composants (`Checkbox`, `Radio`) et leurs groupes, sous **une seule paire de doctrine** `CHOICE-UX`/`CHOICE-UI` (19 règles). Ils partagent frontière, anatomie, états, tokens et règles d'accessibilité — les dédoubler aurait produit deux fichiers à maintenir en miroir, exactement ce que l'étape 10 de la Méthode demande d'éviter.
- **Le libellé est EMBARQUÉ, pas posé au-dessus** : `<Checkbox label="…" />` à la manière de `Switch`, et non le bloc `Input.Field` livré le même jour. Le libellé d'un contrôle de choix est en ligne, à droite de la marque ; celui d'un champ de saisie est au-dessus. Deux anatomies, deux mécaniques — c'est une décision, pas un accident, et elle est inscrite dans la doctrine (CHOICE-R08).
- **L'exclusivité appartient au GROUPE, jamais au bouton** (CHOICE-R05). Conséquence exécutable : `Radio.Group` pose un `name` commun sur des `input[type=radio]` **natifs**, ce qui donne gratuitement l'arrêt de tabulation unique, la circulation par flèches et la sélection qui suit le focus (APG). Un `role="radiogroup"` avec tabindex mobile aurait été plus de code pour moins de justesse.
- **`indeterminate` se calcule, ne se choisit pas** (CHOICE-R11) : c'est une propriété DOM posée par la référence — aucun attribut ne la porte, aucune valeur n'est soumise, et un clic de l'utilisateur la fait disparaître. Le test le verrouille.
- **L'option exclusive est déclarée sur l'OPTION, pas sur le groupe** (CHOICE-R18) : `<Checkbox exclusive />` pour « aucune de ces réponses ». Sans elle, un état contradictoire (« aucune » + « design ») reste saisissable.
- **Point ouvert de la fiche, tranché à la rédaction UI** : la taille de la marque vient de l'échelle **`icon`**, dont la raison d'être déclarée est d'apparier des crans au corps de texte — exactement la contrainte d'un signe posé sur la ligne. Aucun rôle nouveau n'a été créé pour un seul composant.
- **Deux écarts nommés plutôt que masqués** : (1) `TOUCH-UI` nomme `touch.target-min` et `touch.target-comfortable`, mais **le pipeline de tokens ne les émet pas** — aucune `--touch-*` n'existe dans `tokens.css`. Écrire `var(--touch-target-min)` aurait posé une variable inconnue ; la géométrie est donc dérivée de rôles réels (`icon.*` + `space.xs`) et l'écart doctrine ↔ tokens est signalé en commentaire. Il appartient à la fondation TOUCH, pas à ce composant. (2) Le filet de la marque est un `1px` littéral, classé en exception nommée `géométrie-filets` comme les filets de `card-group.css` : le système n'émet aucun token de `border-width`, et en inventer un pour un composant serait une décision de fondation, prise ailleurs.
- **Garde ajoutée au passage** : `anatomie<T>()` est exhaustive sur `keyof T`, ce qui tombait juste tant que les compounds étaient bâtis sur une fonction simple. Sur un `forwardRef`, `keyof` charrie `$$typeof`, `displayName`, `defaultProps` et `propTypes` — du bruit d'implémentation React. `SousApi<T>` retire exactement ces quatre clés et **rien d'autre** : ajouter un sous-composant public sans l'inscrire au manifeste casse toujours `tsc`.
- **Trois trous DÉCLARÉS, aucun découvert plus tard** : sélection de lignes dans un tableau (F4 — engage un composant `Table` que le kit n'a pas), choix multiple au-delà du seuil (F5 — le select multiple n'existe pas non plus), bouton segmenté (F6 — même cardinalité qu'un groupe de radios, autre facture, à qualifier si un besoin réel émerge).
- **Reste ouvert, dans l'ordre arbitré** : l'axe de **sélection** de `CardGroup` (`selection="single" | "multiple"`) qui manque pour honorer `CARD-R26` — la règle est écrite et non tenue aujourd'hui ; puis l'essai *carded*, qui dira par l'usage si `Card.Control` est nécessaire ou si la composition suffit. Ordre voulu : contrôles nus d'abord. Un formulaire à huit cases n'en carde aucune ; construire la version cardée en premier reviendrait à écrire l'exception avant la règle.

## 2026-07-28 — BUTTON-R65 / FORM-R06 : les pointeurs de cession cessent d'être des règles normatives

- **Fichiers** : `components/BUTTON-UX.md` (1.9.0), `patterns/FORM-UX.md` (2.4.0)
- **Ancien état** : la cession du 2026-07-03 (« la règle vit dans FORM-UX.md, qui fait autorité ; BUTTON-UX.md y renvoie ») et la répartition form/button laissaient `BUTTON-R65` et `FORM-R06` au statut `parti pris d'identité`, avec ÉNONCÉ et MESURE — des doublons normatifs des règles de leurs propriétaires réels (`FORM-R28`, `BUTTON-R60`).
- **Nouvel état** : les deux règles passent en `note de méthode` — pointeurs non normatifs vers le propriétaire, sans MESURE, identifiants conservés — même modèle que `BUTTON-R70` → `CARD-R08` et `BUTTON-R76` → `CONSENTEMENT-R08`. Les règles métier des propriétaires (`FORM-R28`, `BUTTON-R60`) ne bougent pas d'une virgule.
- **Pourquoi** : le modèle de propriété du pilote relations/arbitrages (relation `cede-a`) exige qu'une règle cédante ne reste pas normative — deux endroits qui disent la même chose finissent par se contredire, et un audit qui cite le pointeur cite le mauvais propriétaire. Requalification issue de l'audit du 2026-07-28 ; cinquième et sixième requalifications de cession, les deux premières faites a posteriori.

## 2026-07-27 — CONSENTEMENT : un bandeau qui déclarait lui-même n'avoir pas lieu d'être

- **Fichiers** : `patterns/CONSENTEMENT-UX.md` + `patterns/CONSENTEMENT-UI.md` (1.0.0, nouveaux), `inventaires/inventaire-cas-usage-consentement.md` (34 cas), `content/doctrine/consentement.json` (4 familles, 14 cas), `components/BUTTON-UX.md` 1.8.0 (R76 cède son autorité), `lib/md.ts` (branchement de l'inventaire).
- **Contexte** : l'audit externe de la page de contact d'un cabinet de courtage a rencontré un bandeau de consentement dont le texte affirmait, en gras, « ce site utilise uniquement des cookies techniques — strictement nécessaires au fonctionnement, aucun cookie publicitaire ni de traçage », et qui demandait malgré tout l'autorisation de les poser. Vérification du code : **aucun `document.cookie`**, deux entrées de stockage local — la préférence de thème et la mémorisation de la réponse au bandeau lui-même. Les deux appartiennent aux catégories exemptées de consentement. Le bouton « Refuser » ne modifiait aucun dépôt : les deux réponses produisaient exactement le même état.
- **Ancienne règle** : `BUTTON-R76` — « les deux options d'une bannière de consentement doivent porter un poids visuel équivalent », rangée dans le composant bouton, section « Dans une bannière ».
- **Nouvelle règle** : la symétrie est une contrainte du **pattern**, pas du composant. Elle devient `CONSENTEMENT-R08` (UX) et `CONSENTEMENT-UI-R02` (tokens). `BUTTON-R76` conserve son identifiant et devient une note de méthode qui pointe vers son nouveau propriétaire — quatrième cession d'autorité journalisée, après form↔button, form↔card et form↔alert.
- **Pourquoi ce déplacement** : rangée dans BUTTON, la règle n'avait pas de place pour la question qui la précède — *faut-il un bandeau ?*. Un moteur d'audit qui ne dispose que de R76 corrige la couleur d'un bouton sur un bandeau qui n'aurait jamais dû exister. C'est le cas réel rencontré. Une règle rangée au mauvais endroit est une règle qu'on applique mal.
- **La frontière posée, et elle est structurante** : le référentiel **constate**, il ne **qualifie** pas (`CONSENTEMENT-R04`). Un audit rapporte l'inventaire mesuré des stockages et pose la question de la nécessité du bandeau ; il ne conclut jamais « bandeau non requis ». Ce type de constat se remonte au registre **« à trancher »**, jamais à « à corriger ». Deux raisons : la qualification dépend de la finalité réelle des traitements, que le code ne montre pas ; et les textes bougent — la proposition « Digital Omnibus » de la Commission du 12 novembre 2025 réécrit précisément ces exemptions et introduit un consentement par signal navigateur. Une règle de design qui se prononcerait sur le droit serait fausse à la première réforme, et engagerait une responsabilité qui n'est pas la nôtre.
- **Ce que le benchmark a donné** : **2 design systems sur 9** documentent ce pattern — GOV.UK et le DSFR, tous deux publics. NHS (demandé publiquement depuis 2020, jamais publié), Carbon, Material 3, Polaris, Atlassian, Spectrum et Fluent 2 l'ignorent, ce qui se comprend : ils outillent des applications authentifiées, pas des sites soumis à l'ePrivacy. Conséquence assumée : nos règles s'appuient sur deux précédents et sur des textes de régulateurs, pas sur une convergence de neuf systèmes comme pour la bordure. Le niveau de confiance du sujet est `mixte`, et il le restera.
- **Le point où nos deux précédents divergent** : GOV.UK écrit explicitement qu'un service n'utilisant que des cookies essentiels n'a pas besoin de bandeau — une page d'information suffit. Le DSFR décrit le bandeau comme s'affichant toujours à l'arrivée, sans poser la question préalable, parce qu'il outille des sites d'État qui mesurent tous leur audience. `CONSENTEMENT-R03` suit GOV.UK. C'est un choix, il est réversible, et il est écrit comme tel dans la section benchmark.
- **Deux partis pris explicitement non normatifs** : le refus du *cookie wall* (`R11`) — le Conseil d'État a jugé le 19 juin 2020 qu'il n'est pas illégal en soi, et la CNIL l'apprécie au cas par cas : nous le refusons, nous ne prétendons pas qu'il est interdit. Et la durée de six mois (`R14`), là où GOV.UK mémorise un an — six mois est la valeur la plus courte des trois références, donc la plus protectrice, et la seule qui les satisfait toutes.
- **Diversité des sources** : sept références pour dix-sept règles, réparties sur cinq familles distinctes — deux design systems (GOV.UK, DSFR), deux régulateurs (CNIL, CEPD), une norme (WCAG 2.2), une législation en cours (Digital Omnibus) et un relevé interne. Aucune source ne porte plus de quatre règles. C'était l'objectif fixé après le constat de concentration sur `border`.
- **Reste ouvert** : la granularité par finalité (les deux précédents divergent, décision reportée au premier consommateur ayant plus de deux finalités) ; les signaux navigateur (dépend de l'adoption de l'article 88b) ; le réaffichage quand les finalités du site changent ; le texte de remplacement d'un service désactivé après refus, que le DSFR impose et que nous n'avons pas tranché.
- **Sujet voisin identifié, non ouvert** : une ressource tierce sans traceur — police, carte ou vidéo servie par un CDN — transmet l'adresse IP du visiteur sans déposer le moindre cookie. Ce n'est donc pas du consentement au sens de l'ePrivacy, et c'est hors du périmètre de ce sujet. Mais c'est rencontré au même moment, dans le même audit : le site de courtage charge ses deux polices depuis les serveurs de Google. À ouvrir, probablement dans `PERFORMANCE-UX` ou dans un sujet propre.

## 2026-07-26 — PAQUET COWORK : le compilateur du bundle rejoint le monorepo

- **Fichiers** : `tools/plugin/` (nouveau — `build-plugin.js`, `genere-tokens.js`, `genere-routeur.js`, `zip.js`, `plugin.json`, `README.md`, `README-paquet.md`, `rules/RULES-*.md`), `.gitignore` (`build/`).
- **Contexte** : le plugin Cowork installé était figé en **1.6.0 (16/07)**, en retard sur deux niveaux — 16 fiches absentes et 23 modifiées par rapport au dernier build DS-MD, lui-même resté en DESIGN 1.31.0 sans MODAL ni TABS. La chaîne qui fabrique le paquet n'avait jamais été portée : relancer DS-MD aurait produit un paquet déjà périmé.
- **Décision** : **option 1** de l'arbitrage ouvert le matin même (cf. entrée « DS AUDIT ») — le compilateur emménage dans le monorepo. `genere-tokens.js` et `genere-routeur.js` sont portés à l'identique quant à leur mécanique ; seuls changent les chemins (`apps/site/content/md/core/DESIGN.md` comme source de tokens) et la table éditoriale `INTENTIONS`. Sortie : `build/design-system-md.plugin`, archive écrite en Node pur (`zip.js`, zlib) parce que le binaire `zip` n'est pas garanti sur les machines qui lancent le build.
- **Ce qui reste une source, et pourquoi** : les `RULES-<sujet>.md` sont **importées telles quelles** dans `tools/plugin/rules/`, pas dérivées de `content/doctrine/*.json`. Une fiche condensée n'est pas une projection mécanique de la doctrine : c'est une réécriture qui garde les règles normatives et jette la prose et les cas. Aucun script ne sait la produire — la faire dériver du JSON aurait signifié réécrire 46 fiches à l'aveugle. Elles sont donc versionnées comme source, avec le contrat de frontmatter documenté dans `tools/plugin/README.md`.
- **Ce que ce portage ne règle pas** : les identifiants `SUJET-Rnn` et les `SOURCE` n'entrent toujours pas dans le bundle — la promesse « un constat d'audit cite sa base » reste ouverte. Elle est désormais **atteignable sans toucher au dépôt gelé** : le compilateur est ici, il suffira de lui apprendre à propager les identifiants quand le format sera généralisé.
- **Arbitrages éditoriaux pris avec** : (1) `modale` sort du hors-périmètre du routeur (couverte par `RULES-modal`) et `popover` y entre — cité comme frontière par overlay et modal, jamais traité ; (2) une sixième intention, **« Superposé modal »**, entre dans la table (déclencheurs : confirmation de suppression, saisie courte, panneau de détail) — ~31,2 k chargés, `overlay` tiré par les `requires` ; (3) `tabs` n'a **pas** d'intention propre : changer de vue n'est pas une intention de build, la fiche reste accessible par la table des sujets, comme `select`, `switch` et `navigation`. Le rapport du routeur la signale comme orpheline : c'est l'état voulu.
- **Fiches compilées ce jour** : `RULES-modal` et `RULES-tabs`, depuis les paires UX/UI du matin — le corpus passe à 46 fiches, le paquet à **1.7.0**, tokens DESIGN 1.32.0.
- **Non porté** : la génération du site, les audits (`audit-regles`, `garden`, `a11y`, `agnostique`) et le harness restent dans DS-MD. Seul le chemin du paquet a déménagé.

## 2026-07-26 — DS AUDIT : les décisions deviennent adressables et sourcées (pilote `border`)

- **Fichiers** : `METHODE.md` 1.13.0 (le format), `foundations/BORDER-UX.md` 1.2.0 (le pilote), `tools/extrait-decisions.py` (la projection), `apps/site/app/md/[slug]/volet-decisions.tsx` (le rendu), `content/doctrine/border.json` (`decisions[]`).
- **Contexte** : DS Audit promet de **sourcer ses décisions**. Le corpus contenait déjà les quatre ingrédients — problème (les blocs `> **Pourquoi**`), solution (les `RÈGLE :`), cas UX (les cartes de cas), sources (la table de fin de fichier) — mais rien ne les reliait : la bibliographie était une annexe *du fichier*, pas *de la règle*, et une règle n'avait pas d'identifiant. Un constat d'audit ne pouvait donc pas citer sa base.
- **Ancienne règle** : chaque fiche UX se termine par une table « Sources et niveau de confiance » au grain du fichier.
- **Nouvelle règle** : chaque `RÈGLE` porte un identifiant stable (`SUJET-Rnn`), un `STATUT` de frontière, une ou plusieurs `SOURCE` (références `S1…Sn` de la bibliographie, ou `interne`), et un `PROBLÈME` facultatif. La table de fin gagne une colonne `Réf.`. Le format complet est décrit dans METHODE.md.
- **Pourquoi facultatif, le problème** : toutes les règles n'ont pas de douleur à énoncer — « la palette se lit en trois registres étanches » est définitionnelle. Rendre les quatre champs obligatoires produirait du remplissage sur ~700 règles. `SOURCE` reste obligatoire : c'est la promesse.
- **Ce que le pilote a trouvé sur border** : 16 décisions — 7 universelles, 5 partis pris d'identité, 2 implémentations de référence, 2 notes de méthode ; **deux sources manquaient** (R08 s'appuyait sur WCAG 2.4.7 sans le citer, R12 affirmait le comportement de `forced-colors` sans source) — ajoutées en S8 et S9 ; 13 citations de règle dans les cartes de cas ont retrouvé leur ID ; **6 décisions ne sont éprouvées par aucun cas d'usage** (R02, R04, R07, R10, R11, R16) — trou de couverture à traiter, pas un défaut de format.
- **Reste à trancher (bloquant pour la promesse)** : `dist/RULES-*.md`, le bundle que le moteur d'audit consomme réellement, ne porte ni identifiants ni sources, et son compilateur vit dans l'ancien dépôt DS-MD, gelé. Sourcer la fiche sans sourcer le bundle documente la promesse sans la livrer. Deux options : déplacer le compilateur dans le monorepo et le faire compiler depuis les mêmes données que le site, ou régénérer les bundles depuis `content/doctrine/*.json`. Arbitrage à prendre avant de généraliser le format aux 34 autres sujets.

## 2026-07-26 — OVERLAY : le verrou de défilement vise la région, pas le document

- **Fichiers** : `packages/react/src/lib/scroll-lock.ts` (nouveau), `components/modal/modal.tsx`, `components/drawer/drawer.tsx`, `MODAL-UI.md` 1.0.1.
- **Contexte** : remontée d'Aurélien — fermer une modale de cas d'usage en cliquant sur le voile ramenait parfois la page à un autre endroit.
- **Ancienne règle** : « à l'ouverture d'un superposé modal, le défilement du document est verrouillé » (OVERLAY-UI), implémentée par `document.body.style.overflow = "hidden"`.
- **Nouvelle règle** : le verrou porte sur la **région qui défile réellement** — dans un shell applicatif, le body ne défile pas, c'est le `<main>` de l'AppLayout. On verrouille le body **et** chaque ancêtre défilant du déclencheur. Second volet : aucun `focus()` de superposé ne fait défiler (`{ preventScroll: true }`), ni à l'entrée ni au retour au déclencheur.
- **Pourquoi** : les deux défauts se composaient. Le fond continuait de défiler sous la surface ; à la fermeture, le retour du focus au déclencheur faisait « révéler » un élément désormais hors écran, d'où le saut. Le Drawer avait le même bug, hérité de la même ligne de code — corrigé avec.
- **Portée** : la règle d'OVERLAY-UI reste juste dans son intention ; c'est sa formulation (« le document ») qui supposait une page qui défile. À relire quand un troisième superposé arrivera.

## 2026-07-26 — MODAL / TABS : la doctrine rattrape le composant

- **Fichiers** : `components/MODAL-UX.md` + `MODAL-UI.md` 1.0.0, `components/TABS-UX.md` + `TABS-UI.md` 1.0.0, `inventaires/inventaire-cas-usage-modal.md` (34 cas), `inventaires/inventaire-cas-usage-tabs.md` (31 cas), fiches `content/doctrine/{modal,tabs}.json`.
- **Décision** : les deux composants entrés au catalogue le matin même reçoivent leur paire UX/UI, leur inventaire et leur fiche — la dette ouverte par l'entrée précédente est soldée le jour même. `MODAL-UX` ne redit pas la mécanique d'`OVERLAY-UX` : elle la cite et tranche ce qui reste au composant — la légitimité de l'interruption (trois conditions), « une seule modale à la fois, jamais de modale sur modale », les trois familles (confirmation, saisie courte, détail), le désarmement du clic-voile quand une saisie est en cours. `TABS-UX` tranche les deux frontières que le catalogue laissait floues : Tabs/Accordion (exclusif vs multi-ouvert) et Tabs/Navigation (changer de vue vs changer de page, donc d'historique).
- **Pourquoi** : la méthode veut la doctrine **avant** le composant ; l'ordre a été inversé parce que le site de doctrine avait besoin des deux mécaniques pour s'afficher. Inverser l'ordre est acceptable une fois, à condition de solder tout de suite et de le journaliser — sans quoi le catalogue se met à contenir des composants que personne ne peut auditer.
- **Arbitrages laissés ouverts** (marqués `CONFIANCE : non formalisé` dans les fiches) : l'ouverture d'une modale sans interaction de l'utilisateur (onboarding) ; la confirmation de perte de données à la fermeture, laissée au consommateur ; le seuil numérique de débordement d'une tablist ; le style de l'onglet désactivé (même dette que `BUTTON-UI` sur `text-disabled`) ; la conservation du défilement d'un volet gardé monté.

## 2026-07-26 — MODAL / TABS : deux composants naissent du site de doctrine, et un token de largeur avec eux

- **Fichiers** : `packages/react/src/components/modal/`, `packages/react/src/components/tabs/` (nouveaux) ; `packages/tokens/src/tokens.source.mjs` + `build/generate.mjs` (token `grid.overlay`) ; `DESIGN.md` 1.32.0 ; `apps/site/app/md/**` (la fiche de doctrine les consomme).
- **Contexte** : la reprise du site DS-MD dans l'app React demandait deux mécaniques que le catalogue n'avait pas — les quatre volets d'une fiche (onglets) et le détail d'un cas d'usage (modale). L'inventaire d'`overlay` les annonçait toutes deux : « Modale / dialog — couvert (mécanique posée), composant différé ». Le différé s'arrête ici : la doctrine ne peut pas s'afficher avec des composants qu'elle ne documente pas.
- **Décision** : `Modal` (superposé modal centré) et `Tabs` (volets exclusifs) entrent au catalogue. Modal n'invente **aucune** mécanique : il applique OVERLAY-UX/UI à la lettre (scrim, clic-voile = annulation, focus qui entre / piégé / rendu au déclencheur, défilement verrouillé, `z-index.overlay`, `elevation.overlay`, `radius.md`, entrée `motion.slow`, `prefers-reduced-motion`), et le ring interne reste celui de BORDER. Tabs suit le modèle ARIA APG, avec le signal d'onglet courant **non chromatique** (poids + trait porteur), comme Nav.Link.
- **Token créé** : `grid.overlay` = 640px. La largeur d'une surface modale n'avait aucun propriétaire : GRID s'arrêtait aux conteneurs de page (480 / 1024 / 1440) et aux rails du shell (280 / 320). Une modale n'est ni l'un ni l'autre — troisième rôle, donc token, conformément à « un token naît d'un besoin réel ». **Un seul cran** : 480 (`container-narrow`) couvre déjà la modale de confirmation, 640 couvre la modale qui porte une illustration ou un tableau court, et au-delà le contenu appelle une page. La modale des cas d'usage de la doctrine est le premier consommateur.
- **Pourquoi 640** : 160 × 4px, entre les deux crans existants ; convergence des dialogs de référence (Material `md` 560, Carbon `md` 640, Polaris `large` 620) — aucune source n'impose une valeur, le cran est **proposé, ajustable**, et il est tokenisé pour que l'ajustement soit une seule ligne.
- **Réserve** : `Modal` et `Tabs` n'ont pas encore leur paire `*-UX.md` / `*-UI.md` au moment de cette entrée — le composant précède sa doctrine, ce que la méthode interdit normalement. Dette assumée et datée : elle se solde dans la foulée (voir l'entrée « MODAL / TABS : la doctrine rattrape le composant »).

## 2026-07-22 — Accueil refondu : l'audit d'abord, le nom en retrait

- **Fichiers** : `tools/genere-site.js` (hero, `pageAccueil`, `navigation`, méta description par défaut) ; site régénéré.
- **Décision** : la page d'accueil cesse d'ouvrir sur la définition par la négative (« n'est pas un design system ») pour ouvrir sur la preuve : le moteur d'audit montré au travail — verdict et constats réels de l'étude `wanderluxe-creation-compte` (dont un « à préserver »), lien vers l'étude complète sur le site des études. Le catalogue est reframé « le référentiel derrière les verdicts » ; dans la nav, les repères « Core »/« Application » deviennent un unique « Référentiel », un lien « études d'audit ↗ » entre dans la nav (constellation), « tokens » devient « tokens · référence ». La stat « version des tokens » quitte le bandeau de chiffres au profit des parcours audités. Le nom du projet ne porte plus le hero — anticipation du chantier de renommage, ouvert ce jour (la décision du 2026-07-21 « pas de renommage immédiat » est révisée en « chantier ouvert, arbitrage à venir »).
- **Pourquoi** : test à froid du 2026-07-22 sur l'accueil en ligne — le lecteur naïf conclut « encore un design system » : « le déni textuel perd contre la preuve visuelle » (nom, nav-catalogue archétypale, tokens versionnés) ; et « rien sur la page ne montre un audit » alors que le hero en promet un. On montre désormais avant d'expliquer.
- **Réserve** : le nombre de « parcours audités » affiché est éditorial (constante `NB_PARCOURS_AUDITES` — les études vivent dans le dépôt `audit-md`) : à tenir à jour à chaque étude versée.

## 2026-07-22 — Plateforme : le moteur d'audit part dans son dépôt privé « audit-md »

- **Fichiers** : `audit/` retiré du dépôt (déplacé vers le dépôt privé `sibylfounders/audit-md`, copie à l'identique, zéro modification de code, protocoles gelés intouchés) ; `README.md` et `docs/architecture/REPOSITORY.md` révisés (cinq responsabilités, flux d'audit externalisé).
- **Décision** : dans le cadre du plan de plateforme (séparation des produits AVANT tout déploiement — décidée pendant que rien n'était en ligne), le moteur d'audit, ses huit études et leurs preuves quittent le dépôt-vitrine. Le nouveau dépôt embarque un **instantané épinglé de `dist/`** : le moteur d'audit devient un **consommateur officiel de la distribution** (dogfooding). Les preuves privées (`audit/private/`, 71 Mo) et la vue privée (`private-view/`) restent hors git dans le nouveau dépôt aussi.
- **Pourquoi** : (1) confidentialité — `audit/data/` contient des findings détaillés sur des produits réels dont un client ; impubliable dans un dépôt destiné à être public ; (2) le gel par snapshots (2026-07-21) rend les études auto-portées : le moteur n'a plus besoin de vivre à côté des sources ; (3) chaque produit sa nature — le dépôt-vitrine démontre, le dépôt d'audit juge. Vérifié avant retrait : validate 0 erreur, test complet VERT, build public et check-site OK dans le nouveau dépôt.
- **Au même moment** : le site est publié sur GitHub Pages (dépôt public `design-system-md-site`, contenu généré seul) — première URL publique du projet.

## 2026-07-21 — Vitrine alignée sur le pivot : le site public parle la nouvelle langue

- **Fichiers** : `tools/genere-site.js` (hero de l'accueil, méta description par défaut, en-tête consommable), `tools/methode-contenu.js` (page « Pourquoi » : section d'ouverture + distribution à deux modes + première puce du « n'est pas »), `tools/genere-harness.js` (description) ; site régénéré.
- **Décision** : le récit public cesse de se présenter comme « documentation contextuelle UX/UI » et assume le positionnement du pivot — titre du hero « Le raisonnement que les tokens n'ont pas » (le créneau), couche d'intelligence au-dessus d'un hôte, règle de frontière ❌/✅ en pied de hero, moteur d'audit en premier, DS-UI en chemin de refonte jamais imposé. La preuve est citée avec les réserves maison : mesure M2 (95 % de constats universels) et test à froid (périmètre observable explicité).
- **Pourquoi** : la vitrine est la carte de visite du projet ; un positionnement acté dans DECISIONS mais absent du site public est un positionnement qui n'existe pas.

## 2026-07-21 — Consentement : la fusion implicite « vous acceptez CGU et politique de confidentialité » entre dans la règle

- **Fichiers** : `CREATION-COMPTE-UX.md` 1.3.1 (§ Extension consentement) ; `dist/RULES-creation-compte-*` recompilés mécaniquement.
- **Contexte** : le test à froid n°2 du mode audit (agent vierge + dist/ + 5 écrans Cosmos) a retrouvé ~8 findings sur 9 de l'étude gelée — le seul manqué est F08 : la mention « By creating an account, you agree to our Terms of Service and Privacy Policy » a été jugée conforme. La règle existante visait la forme explicite (« j'accepte la politique de confidentialité » avec case) ; le piège implicite — un « vous acceptez » sans case qui englobe la politique de confidentialité — n'était pas nommé.
- **Décision** : la règle nomme désormais le pattern : la politique de confidentialité se **présente**, elle ne s'**accepte** pas (RGPD art. 13 — information due, pas contrat) ; la fusion se signale même sans case à cocher, dès qu'un « vous acceptez » l'englobe.
- **Pourquoi** : une règle qu'un agent à froid ne peut pas appliquer sur le cas réel le plus fréquent ne protège rien — le test à froid sert exactement à trouver ces formulations trop étroites.

## 2026-07-21 — Mode audit : le routeur porte désormais deux protocoles (P2 du pivot)

- **Fichiers** : `tools/genere-routeur.js` (protocole + SKILL), `dist/CLAUDE.md`/`AGENTS.md`/`SKILL.md` régénérés, `METHODE.md` 1.11.0.
- **Décision** : à côté du protocole de build, le routeur porte un **Mode audit** (« audite cet écran / ce parcours ») : bundle de l'intention sous-jacente chargé **sans `tokens.yaml`** (la mesure M2 a prouvé que les annexes de tokens ne fondent aucun finding — l'implémentation de référence n'est jamais un critère d'audit d'une interface tierce) ; confrontation qui cite ses règles et sépare observation / inférence / constat ; **statut de frontière** appliqué (propriété universelle → non-conformité possible ; parti pris d'identité → divergence de registre, à part ; implémentation de référence → hors critères) ; CONFIANCE calibre la force du constat ; non-couvert → remonté tel quel. L'audit ne modifie jamais les règles qu'il évalue. Le protocole outillé complet (baseline, empreintes, preuve) reste dans `audit/`.
- **Correction au passage** : `HORS_PERIMETRE` du routeur listait encore « toast/snackbar » alors que toast est un sujet couvert depuis le 2026-07-21 (intention Feedback) — retiré.
- **Pourquoi** : le pivot fait de l'audit le mode de livraison principal ; le livrable machine ne proposait que le build. Le mode audit transpose au contexte agent la méthode déjà éprouvée par les huit études, sans chaîne de preuve.

## 2026-07-21 — Statut de frontière : les quatre règles désignées par la mesure M2 sont annotées

- **Fichiers** : `METHODE.md` 1.10.0 (la convention), `VOICE-UX.md` 1.3.1, `MOTION-UX.md` 1.3.2, `FORM-UX.md` 2.3.0, `BUTTON-UI.md` 1.6.1, + miroirs `dist/RULES-voice|motion|form|button.md`.
- **Contexte** : le dépouillement des findings des huit études (mesure M2 du pivot) donne 95 % de justifications universelles ; les seules exceptions sont trois contrats de registre (voice « pas de ! », motion « productif seulement », label 16 px) et un parti pris contesté (« jamais de disabled comme validation » — Strava-decisions F09, Carbon/iOS documentent l'inverse).
- **Décision** : généraliser la distinction « contrainte ≠ parti pris » (stress-test 2026-07-17) en **statut de frontière** à trois valeurs — **propriété universelle / parti pris d'identité / implémentation de référence** — avec sa **lecture d'audit** : seule la propriété universelle fonde une non-conformité chez un hôte tiers ; un parti pris se signale comme *divergence de registre*, à part ; l'implémentation de référence n'est jamais un critère. L'annotation est progressive, tirée par l'usage des audits — pas de passe de réécriture.
- **Pourquoi** : sans ce statut, un audit d'interface tierce requalifie en défaut ce qui n'est qu'une identité maison — trois cas réels dans Passion Courtage site-v2 (F06 « pas de ! », F08 registre motion, F09 label 16 px). La crédibilité du moteur d'audit dépend de cette distinction.

## 2026-07-21 — PIVOT : DS-MD devient une couche d'intelligence de conception au-dessus d'un design system hôte

- **Fichiers** : `README.md` (vision), `docs/roadmap/EVOLUTION.md` (re-cadrage des jalons), `docs/architecture/REPOSITORY.md` (carte des quatre produits), README de DS-UI (statut), versionnage git de DS-UI. Aucun contenu de règle modifié.
- **Décision** : DS-MD n'est pas un design system. C'est une **couche d'intelligence de conception** qui se greffe au-dessus de n'importe quel design system hôte (Material, Fluent, Carbon, DS interne…). DS-MD décrit les **propriétés** et les **décisions** qu'une bonne interface doit posséder (le pourquoi, le quand) ; l'hôte garde l'**implémentation** (le comment : composants, tokens, API). DS-MD se livre comme un **moteur d'audit** (écrans, puis parcours). DS-UI devient l'**implémentation de référence** et le laboratoire — jamais imposée à l'audité, toujours proposée comme chemin de refonte.
- **Règle de frontière** : DS-MD décrit les propriétés qu'une interface doit posséder, jamais leur apparence exacte. ❌ « Utiliser un bouton Filled » → ✅ « L'action principale doit être clairement dominante ». En cas d'hésitation principe vs implémentation : le principe reste dans DS-MD, l'implémentation part vers l'hôte ou l'adaptateur, et le raisonnement s'explique.
- **Pourquoi** : (1) la vision fondatrice le disait déjà — « une base de connaissance, pas une bibliothèque de composants » ; une règle UX qui suppose une techno précise était déjà un défaut à corriger : le pivot est un aboutissement, pas un virage. (2) Le produit d'audit le pratique déjà : les études confrontent des interfaces qui n'utilisent pas DS-MD (Cosmos, Strava iOS, Passion Courtage) à un instantané versionné des règles. (3) Le créneau visé — la couche de raisonnement que les tokens n'ont pas — devient littéral.
- **Vision long terme (étoile polaire, pas une to-do)** : l'entonnoir audit → doc contextuelle finie → bascule sur le UI kit re-thématisé à la marque du client. Gouvernance, offres, généralisation « doc dérivée par client » restent hors périmètre immédiat.
- **Ce qui ne change pas** : le pipeline de méthode, les contenus des règles UX/UI, les tokens (qui deviennent le thème de l'implémentation de référence), le protocole de build du routeur (qui devient le mode d'emploi de la bascule ; un protocole d'audit viendra à côté, pas à la place). La reformulation des règles en propriétés hôte-agnostiques se fera par **annotation progressive**, tirée par l'usage d'audit — pas par réécriture en masse.

## 2026-07-21 — Principe « performance » : le contrat des attentes devient le cinquième RULES du socle universel

- **Fichiers** : `atelier/principles/performance/PERFORMANCE-UX.md` (1.0.0, companion: none) ; `atelier/inventaires/inventaire-cas-usage-performance.md` (3e inventaire transversal, 20 cas) ; `dist/RULES-performance.md` (maintenu à la main) ; `DESIGN.md` 1.28.0 (index, aucun token) ; `LAWS-UX.md` 1.3.1 (Doherty → carte) ; `MOTION-UX.md` 1.3.1 (frontière nommée) ; `tools/genere-routeur.js` (socle à 5 RULES) ; contenus éditoriaux du site.
- **Constat** : le système possédait les mécaniques d'attente en pièces détachées (cycle de soumission FORM, loading BUTTON, attente par champ INPUT, squelettes CARD/COLLECTION, bornes d'animation MOTION) mais aucun propriétaire du contrat transversal — quel feedback à quel délai, quand l'optimisme est permis, ce que l'honnêteté interdit. Doherty et les seuils NN/g n'existaient qu'en théorie (catalogue) ou en local (MOTION).
- **Décisions** :
  1. **Frontière motion / performance** (haute) : motion possède les durées et courbes des ANIMATIONS ; performance possède le contrat des ATTENTES. L'indicateur de chargement appartient aux deux — forme et mouvement chez motion, moment d'apparition et sincérité chez performance.
  2. **Socle universel à cinq** (haute, arbitrage délégué) : toute intention charge et attend — RULES-performance rejoint accessibility/interaction/adaptive/cognitive-load ; coût mesuré à chaque build, clause de réouverture déjà journalisée chez cognitive-load.
  3. **Échelle de l'attente** (haute) : rien sous ~100 ms ; local entre ~100 ms et ~1 s ; visible ET annoncé au-delà ; état à part entière (progression honnête, issue, timeout) au-delà de ~10 s ou en durée inconnue. Anti-scintillement : délai d'apparition + durée minimale, non chiffrés jusqu'au premier consommateur outillé (un chiffre sans besoin réel serait le travers que le système interdit).
  4. **UI optimiste sous trois conditions cumulées** (haute) : réversible/rejouable + très probable + échec réparé visiblement ; interdite sur l'irréversible, le paiement, le légal — alignée sur la réversibilité de cognitive-load.
  5. **Honnêteté renforcée** (haute) : jamais de fausse progression (la frontière Goal-Gradient du catalogue devient un interdit opérationnel) et JAMAIS d'attente artificielle — refus assumé d'exploiter la labor illusion (Buell & Norton), documentée puis écartée, cohérent avec le refus des dark patterns.
  6. **Seuils en prose, aucun token** (moyenne) : les bornes 0,1/1/10 s sont de la psychophysique sourcée, pas des valeurs de design à thématiser.
- **Laissé ouvert** : composant de progression déterminée (aucun dans le système — naîtra du besoin, d'ici là remonter) ; chiffrage de l'anti-scintillement ; incarnation de l'optimisme (premier terrain : TOAST porteur d'une annulation) ; valeurs machine des seuils si un harness les consomme un jour.
- **Pourquoi** : troisième et dernière absence prioritaire du fil « quatre axes » (2026-07-21 : cognitive-load, collection, performance) — le tout par la voie complète de la méthode, en un jour, sans casser la promesse d'aucun fichier existant.

## 2026-07-21 — Pattern « collection » : la grille de colonnes naît chez son consommateur, intrinsèque et sans N canonique

- **Fichiers** : `atelier/patterns/collection/COLLECTION-UX.md` + `COLLECTION-UI.md` (1.0.0) ; `atelier/inventaires/inventaire-cas-usage-collection.md` (31 cas) ; `dist/RULES-collection.md` (maintenu à la main) ; `DESIGN.md` 1.27.0 (token `grid.item-min`) ; `GRID-UX.md` 1.1.0 + `GRID-UI.md` 1.1.0 (clause de naissance levée) ; `SPACING-UX.md` 1.2.1 (note de transposition réalisée) ; `CARD-UX.md` 1.4.1 + `CARD-UI.md` 1.5.1 (transfert `grid_gap`) ; `tools/genere-routeur.js` (l'intention Collection charge le pattern) ; contenus éditoriaux du site.
- **Constat** : GRID-UX (2026-07-16) et SPACING-UX avaient écrit une clause de naissance explicite — « la grille de colonnes naîtra avec le pattern collection/grille ». L'intention « Collection » du routeur existait sans pattern propriétaire ; CARD portait un `grid_gap` d'attente et promettait un « pattern collection dédié » pour le Kanban.
- **Décisions** :
  1. **Grille intrinsèque** (haute) : les colonnes émergent de `grid.item-min` (256px, seul token nouveau — 64 × la grille de base) et de l'espace réel via `repeat(auto-fill, minmax(min(100%, item-min), 1fr))` — jamais « 4 desktop / 2 tablette / 1 mobile ». Divergence assumée vs Carbon (16 col) / Material (window classes) : pas de multi-produits qui justifie un N canonique, et un viewport large ne garantit pas un conteneur large (cohérence adaptive). `auto-fill` jamais `auto-fit` (dernière rangée non déformée).
  2. **Régime composé** (moyenne) : dashboard en grille explicite, spans en cellules entières, colonnes choisies par le contenu — pas de 12 copié ; à éprouver au premier dashboard réel.
  3. **Croissance** (haute) : « charger plus » par défaut ; pagination quand la position est adressable ; scroll infini jamais seul (NN/g) ; état restauré au retour ; échec d'une page suivante = erreur locale, l'acquis reste.
  4. **Transfert d'autorité** (moyenne) : `CARD-UI.collection.grid_gap` devient un alias — le gap appartient au pattern (mapping par densité : compact = spacing.md, comfortable = spacing.lg). Même mécanisme que le transfert INPUT→FORM.
  5. **Défauts de collection** (moyenne) : tri par défaut annoncé, filtre d'office déclaré — le cas « En attente » de l'inventaire charge-cognitive trouve son propriétaire le jour même.
- **Laissé ouvert** : extension `collection-kanban` (promise par CARD-UX) ; virtualisation ; contrôles de barre d'outils (select, chips — composants à naître, tout build qui en a besoin remonte) ; N canonique du composé si un dashboard réel le réclame ; mécanique de la région live du compteur à éprouver.
- **Pourquoi** : deuxième absence du fil « quatre axes » intégrée, par la voie complète de la méthode — et la clause écrite le 2026-07-16 est honorée telle quelle : le système a tenu sa propre promesse de ne documenter la grille qu'avec son premier consommateur.

## 2026-07-21 — Principe « cognitive-load » : le pendant opérationnel du catalogue des lois entre au socle universel

- **Fichiers** : `atelier/principles/cognitive-load/COGNITIVE-LOAD-UX.md` (1.0.0, companion: none) ; `atelier/inventaires/inventaire-cas-usage-charge-cognitive.md` (2e inventaire transversal, 23 cas) ; `dist/RULES-cognitive-load.md` (maintenu à la main, comme les RULES historiques) ; `LAWS-UX.md` 1.3.0 (carte d'application + promotion anti-camouflage) ; `DESIGN.md` 1.26.0 (index des principes, aucun token) ; `tools/genere-routeur.js` (socle à 4 RULES) ; contenus éditoriaux du site (`tools/site/data.js`, `tools/genere-site.js`).
- **Constat** : `LAWS-UX.md` déclare Cognitive Load « principe implicite de tout le système » — implicite = invisible au build : aucune règle chargée ne contraignait le nombre de décisions d'un écran, la divulgation, les défauts, la réversibilité ou l'anti-camouflage en tant qu'obligations transversales ; elles existaient en pièces détachées chez les propriétaires.
- **Décisions** :
  1. **Frontière laws / cognitive-load** (haute) : le catalogue garde la théorie (audience: humans, jamais chargé au build) ; le nouveau principe porte les obligations opérationnelles, cite les lois sans les réécrire, et renvoie chaque mécanique à son propriétaire (modèle accessibility). En divergence : le catalogue a raison sur la loi, le principe sur l'obligation, le propriétaire sur la mécanique.
  2. **Socle universel à quatre** (haute, arbitrée avec l'utilisateur) : `RULES-cognitive-load` rejoint accessibility/interaction/adaptive, chargé pour toute intention ; le coût est mesuré à chaque build (RAPPORT-ROUTEUR) et l'arbitrage se rouvre avec les chiffres si le socle enfle.
  3. **Anti-camouflage promu** (moyenne) : le trou signalé par le catalogue (« candidate ») devient une RÈGLE du principe ; le catalogue pointe désormais vers lui.
  4. **Aucun plafond numérique** (moyenne) : le principe contraint la structure (hiérarchie, divulgation, défauts, réversibilité), jamais un nombre — cohérent avec les mythes réfutés du catalogue (Miller « 7 », règle des 3 clics).
- **Laissé ouvert** : tri/filtre par défaut d'une collection (propriétaire à désigner — CARD candidate le jour d'une collection réelle) ; répartition fine undo/confirmation par composant (premier terrain : TOAST porteur d'une annulation) ; épreuve du réel de l'anti-camouflage (attend un composant de contenu marketing) ; DeleteButton toujours OUVERT (non tranché ici).
- **Pourquoi** : première absence identifiée par la relecture « quatre axes » (visuel / technique / psychologique / sensoriel) à entrer au système — et elle entre par la voie complète de la méthode (inventaire transversal → benchmark → couverture → compilation), pas comme une fiche isolée.

## 2026-07-21 — Calibrage outillé, rythme vertical, cadrage white-space

- **Fichiers** : `tools/audit-couverture.js` (nouveau, lancement manuel) + `tools/reports/RAPPORT-COUVERTURE.md` ; `SPACING-UX.md` 1.2.0 + `SPACING-UI.md` 1.2.0 + `dist/RULES-spacing.md` (section Rythme vertical) ; `atelier/inventaires/inventaire-cas-usage-whitespace.md` (cadrage — aucune règle rédigée) ; `tools/README.md`.
- **Constat** : à 742 cas et 764 règles, la question « assez ou trop ? » ne se juge plus au volume. Le croisement outillé montre 374 cas sans règle rattachée et 363 règles UX jamais exercées par un cas (heuristique lexicale du site — elle désigne où regarder, elle ne condamne pas). Les extrêmes sont parlants : button porte 85 règles pour 33 cas (64 orphelines), accessibility 76 cas pour 15 règles (51 muets).
- **Décision 1 — calibrage** : le critère de légitimité est croisé — un cas est légitime s'il force une décision qu'une règle tranche, une règle l'est si au moins un cas l'exerce. Outillé en rapport NON bloquant ; tailler ou renforcer reste une décision d'atelier, sujet par sujet, de préférence après confrontation au réel (pilotes, études).
- **Décision 2 — rythme vertical** : le rythme entre dans SPACING comme **usage de l'échelle existante** (aucun token nouveau — un token naît d'un besoin réel) : monotonie verticale (intra-bloc < frères < groupes < sections), titre plus proche de ce qu'il ouvre que de ce qu'il ferme, hauteurs accrochées à la grille de base. Les interlignes restent en **baseline souple** — aucun n'est conforme aujourd'hui (body 25,6 px, body-small 21, label 14,4, display 52,8) et les recaler toucherait la lisibilité : position assumée, révisable, documentée en « À approfondir ».
- **Décision 3 — white-space** : inventaire de cadrage AVANT rédaction (leçon typographie). Verdict : l'essentiel du sens du vide vit déjà chez SPACING (proximité, et le rythme désormais) ; les trous réels sont transversaux — isolement/poids (Von Restorff appliqué), affordance par la respiration, anti-usages du vide menteur (horror vacui, aérer un danger), registre d'identité (générosité déclarée). Nature pressentie : **langage mince propriétaire du sens du vide** (modèle accessibility — renvoie aux propriétaires, aucun token) ; l'alternative (combler chez SPACING/INTERACTION sans nouveau sujet) reste ouverte. **NON tranché — remonté**, avec table d'autorité proposée dans l'inventaire.
- **Pourquoi** : réponse au constat fondateur de la discussion — les IA composent par mimétisme (copier des pixels) faute de règles de composition raisonnables (des relations). La proximité, l'affordance et le rythme sont précisément les règles qu'une IA peut appliquer à un écran qu'elle n'a jamais vu ; leur donner un propriétaire et une traçabilité croisée est ce qui distingue une documentation qui raisonne d'un catalogue qui imite.

## 2026-07-21 — Application explicite des 4 Languages à tous les composants, patterns et flow

- **Fichiers** : `atelier/components/{alert,button,card,input,link}/*-UX.md` + `*-UI.md`, `atelier/patterns/form/FORM-UX.md` + `FORM-UI.md`, `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (versions bumpées, changelogs datés). Compagnons `dist/RULES-*` de composant/pattern mis à jour à la main ; `RULES-creation-compte*` recompilés depuis la source (flow).
- **Contexte** : les 4 Languages (Interaction, Motion, Voice, E-motion) ont été promus « premier niveau » le 2026-07-20 ; seul Toast, écrit après, les intégrait explicitement (renvois nommés + raisonnement propre + contrat `prefers-reduced-motion` + points ouverts remontés). Les autres artefacts portaient la matière brute mais pas le LIEN nommé. Cette passe les met au niveau Toast.
- **Nature du travail** : surtout rédactionnel — renvois NOMMÉS aux fichiers-Language, règle cardinale « ne jamais blâmer » explicitée (input/card/alert), contrats `prefers-reduced-motion` posés là où ils manquaient. Aucune règle existante retirée ; aucun token nouveau.
- **Décisions de design (arbitrées avec l'utilisateur)** :
  1. **E-motion « un événement, un porteur »** (haute) : le moment « réussite d'un envoi » ne s'incarne qu'UNE fois par événement — porté soit par le bouton de soumission quand il résout EN PLACE (l'avion → « Envoyé ✓ »), soit par un toast success illustré quand la confirmation est INJECTÉE ailleurs — jamais les deux. Form et flows DÉLÈGUENT, ne dupliquent pas ; si la confirmation doit rester consultable, c'est un alert success PRODUCTIF (pas de moment). Principe transversal porté par BUTTON, FORM, ALERT (relais) et CREATION-COMPTE.
  2. **Nouveau moment catalogué — « atterrissage / compte créé »** (haute) : le flow création de compte porte un moment E-motion « première fois / onboarding franchi » à l'écran final, anatomie SOBRE (glyphe qui se dessine, SANS `spring`/overshoot — plus calme que l'avion), UNE fois dans le parcours, porteur = un alert/toast success à l'atterrissage, repli reduced-motion vers le fait instantané. Entrée au catalogue d'`EMOTION-UX.md` par cette décision (gouvernance : les moments passent par DECISIONS.md). Réconcilie le « sobre, jamais exubérant » du flow avec l'exception Voice 1.3.0 (un cran chaleureux sur ce seul moment).
  3. **Card — aucun moment E-motion** (moyenne) : absence documentée et raisonnée (§ « Instrument E-motion — sans objet »). La Card est une surface de consultation calme (Interaction) et le composant-collection par excellence (budget de rareté : tout ce qui se répète par carte est disqualifié) ; le moment catalogué « vide/attente avec personnalité » s'incarne dans le CONTENU injecté (un Toast), pas dans le conteneur ; empty states d'erreur et « sans résultat » restent strictement productifs.
  4. **Input / Link — E-motion sans objet, explicité** (basse) : un champ (réflexe/haute fréquence) et un clic de navigation sont hors du catalogue des moments mérités ; l'absence est désormais raisonnée, plus silencieuse.
- **Laissé ouvert (non tranché)** : le **DeleteButton « froissage »** (label qui se froisse avant la corbeille, signalé par `EMOTION-UX.md` § À approfondir depuis le 2026-07-19) reste un point ouvert — hors périmètre de cette passe ; ni catalogué, ni reclassé, ni retiré. Tension avec Voice (« action destructive : ni euphémisme ni sur-dramatisation ») à trancher plus tard.
- **Pourquoi une entrée** : deux entrées de catalogue E-motion (atterrissage retenu, DeleteButton laissé ouvert) et un principe transversal (« un événement, un porteur ») sont des décisions de gouvernance — retrouvables ici plutôt que dispersées.

## 2026-07-21 — TOAST (DS-UI) : région invisible — piège CSS corrigé, ancrage bas-centré tranché

- **Fichiers** : `atelier/components/toast/TOAST-UI.md` (1.0.0 → 1.1.0), `dist/RULES-toast.md` (régénéré à la main, compagnon). Côté DS-UI (hors périmètre normatif de ce dépôt, mentionné pour traçabilité) : `packages/react/src/components/toast/toast.css`, `atelier.html`.
- **Constat (rapport utilisateur)** : le premier livrable Toast sur DS-UI (2026-07-20) affichait les boutons déclencheurs mais aucun toast visible à l'écran — capture d'écran à l'appui.
- **Root cause** : `.ds-toast-region` déclarait `container-type: inline-size` (Container Query, Adaptive) avec seulement une `max-inline-size` en guise de largeur. `container-type: inline-size` applique un `contain` sur l'axe inline : le conteneur perd sa taille intrinsèque (impossible de la dériver de son contenu). Un plafond (`max-*`) ne fixe rien tant que rien d'autre ne détermine la taille de départ — sans une largeur EXPLICITE, l'élément s'effondre à 0px et devient invisible, avec tout son contenu.
- **Décisions** :
  1. **Correction technique** (haute) : `TOAST-UI.md` § Position — implémentation prescrit désormais une largeur EXPLICITE (`width`, pas seulement un plafond) pour tout conteneur de requête. RÈGLE TRANSVERSALE ajoutée : pertinente pour n'importe quel futur composant de ce système utilisant `container-type`, pas seulement Toast.
  2. **Ancrage** (moyenne) : **bas-centré**, tranché par l'utilisateur en conversation — remplace la proposition « bas-droit » de `TOAST-UI.md` v1.0.0, qui n'avait jamais été qu'une convergence d'usage externe (Carbon/Polaris/Material) non vérifiée. Conséquence directe : la note RTL de `TOAST-UI.md` change de nature — un centrage n'a par construction aucun miroir à écrire, contrairement à un ancrage de coin.
- **Pourquoi une entrée plutôt qu'une simple correction silencieuse** : la cause n'est pas un détail d'implémentation isolé — c'est un piège CSS reproductible par tout futur conteneur de requête de ce système (Toast n'est que le premier concerné). Le documenter dans `TOAST-UI.md` en RÈGLE plutôt que dans le seul historique de DS-UI le rend retrouvable la prochaine fois qu'un composant Adaptive doit gérer une taille contrainte plutôt qu'un flux normal.
- **À approfondir** : vérifier si `Card` (autre conteneur de requête du système) est exposé au même piège — `.ds-card` a une largeur naturelle (`width: 100%` dans un flux normal), donc probablement hors de cause, mais à confirmer plutôt que supposer.

## 2026-07-20 — TOAST : nouveau composant, adopté (candidat qu'ALERT-UX.md appelait déjà)

- **Fichiers** : nouveaux `atelier/components/toast/TOAST-UX.md` (1.0.0), `TOAST-UI.md` (1.0.0). Aucun fichier existant modifié — Toast était déjà anticipé sans être écrit (`ALERT-UX.md` § À approfondir : « composant frère exclu par la frontière de périmètre — candidat naturel de prochaine documentation »).
- **Origine** : remonté depuis une question produit sur l'humanisation de l'UI (Fluent UI Emoji) — l'analyse a montré que le foyer légitime de l'instrument « illustration/forme » d'E-motion pour les moments « envoi réussi » et « sortie d'erreur » n'est pas l'Alert (qui exclut structurellement le feedback immédiat) mais ce composant frère, jusqu'ici non documenté.
- **Décisions (arbitrées en conversation avec l'utilisateur)** :
  1. **Tone** (moyenne) : les 4 tones d'Alert repris à l'identique (info/success/warning/danger) — pas de restriction à info/success malgré le risque identifié.
  2. **Danger en toast** (haute) : accepté avec risque documenté plutôt qu'exclu vers l'alert seul — un toast danger ne doit jamais être le seul porteur d'une condition qui dure (cf. TOAST-UX.md § Tone).
  3. **Actions** (moyenne) : une seule tolérée (pattern undo), timing suspendu au survol/focus obligatoire (WCAG 2.2.1). Durée plancher reprise telle quelle de `BUTTON-UX.md` (5-8s, IBM Carbon) — aucune nouvelle valeur inventée à ce niveau.
  4. **Empilement** (moyenne) : 2-3 max, ordre d'arrivée (FIFO) — divergence assumée avec Alert (qui empile par gravité décroissante) : le toast empile des événements séquentiels, pas des conditions simultanées, le raisonnement d'Alert ne se transpose pas à l'identique.
  5. **Position** (basse) : pilotée par Adaptive (conteneur), pas un ancrage fixe viewport — cohérent avec la décision Adaptive du 2026-07-20 (Interaction Language, Adaptive Architecture et Link).
  6. **Instrument illustration E-motion** (haute) : actif uniquement si le toast est seul à l'écran (jamais sur une pile — cohérence avec le budget de rareté), jamais sur danger/warning. Technique retenue : glyphe dessiné (`stroke-dashoffset`, gabarit SubmitButton, héritage direct d'`EMOTION-UI.md`) — PAS une illustration importée. L'arbitrage plus large « Fluent UI Emoji comme bibliothèque d'illustration » (options A/B/C) reste NON TRANCHÉ ; seule la technique déjà établie est utilisée ici.
- **Valeurs UI proposées, non sourcées** (`TOAST-UI.md` § Sources, marquées « non établi ») : formule de durée (base 6000ms + 50ms/mot au-delà de 8 + bonus 2000ms si action, plafond 10000ms) et ancrage bas-droit par défaut — les deux à vérifier à l'usage avant d'être promues « établi ».
- **Ce qui est repris sans discussion** (déjà établi ailleurs, pas une décision de cette entrée) : silhouettes d'icône par tone, `role="alert"`/`role="status"`, `elevation.overlay` — désigné légitime pour le toast dans `RULES-interaction.md` avant même que ce composant existe.
- **Pourquoi une entrée plutôt qu'un silence** : six décisions de gouvernance et deux valeurs techniques non sourcées méritent chacune d'être retrouvables — même principe que la décision Interaction/Adaptive/Link du même jour : documenter la raison, pas seulement la règle.
- **À approfondir** : cf. `TOAST-UX.md` § À approfondir (RTL, reduced motion, fermeture manuelle explicite) et `TOAST-UI.md` § À approfondir (vérification des deux valeurs proposées).


## 2026-07-20 — README : vision explicitée (base framework-agnostique, philosophie fonctionnelle)

- **Fichiers** : `README.md` (nouvelle section « Vision »). Aucune règle UX/UI modifiée, aucune version de composant/fondation/langage bumpée.
- **Ancienne situation** : deux intentions fondatrices du projet n'existaient qu'à l'oral — dans les échanges avec l'auteur et dans la mémoire de session d'un agent — sans jamais avoir été couchées dans un fichier du dépôt. (1) DS-MD est pensé comme une base de connaissance indépendante du framework, dont DS-UI (React) n'est qu'une implémentation parmi d'autres possibles (SwiftUI, Flutter, plugin Figma, génération directe par IA) ; rien dans `README.md`, `AGENTS.md` ou la page « pourquoi » du site ne le disait. (2) La philosophie visuelle du projet — fonctionnel avant tendance, compréhension avant lecture, registre intemporel plutôt que décoratif — vit déjà, appliquée, dans `INTERACTION-UX.md`, `MOTION-UX.md`, `VOICE-UX.md` et `EMOTION-UX.md`, mais aucun endroit ne la nomme comme intention commune : un lecteur qui n'ouvre qu'un seul de ces fichiers ne voit qu'une application locale, pas le principe qui les relie.
- **Nouvelle règle** : aucune (documentaire). `README.md` porte désormais une section « Vision » qui nomme les deux explicitement, avec renvoi vers les fichiers qui les appliquent déjà — elle ne redéfinit rien, elle rend visible ce qui existait dispersé.
- **Pourquoi** : une intention qui ne vit que dans la mémoire d'une conversation ne survit pas à la conversation. Un dépôt destiné à rester la source de vérité, y compris pour un futur contributeur ou une future IA sans contexte oral, doit porter par écrit les raisons de ses choix, pas seulement les choix eux-mêmes.

## 2026-07-20 — E-MOTION : DeleteButton (DS-UI) hors catalogue — point ouvert, non tranché

- **Constat** : DS-UI a livré le 2026-07-19 un DeleteButton dont le label se froisse en boule (E-motion, cran `motion.spring`) avant de tomber dans la corbeille. Ni le composant ni le moment n'existent dans DS-MD : `BUTTON-UX.md` ne connaît pas de « DeleteButton » distinct du modèle style×tone générique, et le catalogue des moments mérités d'`EMOTION-UX.md` ne couvre que succès / première fois / cap / sortie d'erreur / vide — aucune entrée destructive.
- **Tension identifiée** : VOICE-UX § « Le ton suit l'utilisateur » impose pour toute action destructive un ton « direct, factuel, conséquence nommée ; ni euphémisme ni sur-dramatisation ». Un froissage ludique avant la corbeille peut se lire comme l'équivalent visuel d'un euphémisme — sans que ce soit certain : la question reste ouverte.
- **Décision** : AUCUNE. Conformément au protocole du routeur (une décision de design non tranchée s'expose et se remonte, elle ne s'improvise pas), ce point est documenté comme non résolu — cf. `EMOTION-UX.md` § À approfondir — plutôt que catalogué ou invalidé unilatéralement.
- **Options à trancher** : (1) cataloguer un moment « retrait/suppression » à l'anatomie sobre, distincte de l'avion en papier (sans `spring`/overshoot) ; (2) reclasser le froissage comme signal de transition (Interaction/Motion) plutôt que comme moment E-motion « mérité » ; (3) sobriser ou retirer l'animation.
- **Pourquoi remonté plutôt que résolu ici** : DS-MD est l'autorité UX, DS-UI l'implémentation — un écart de ce type, une fois repéré, se documente et s'arbitre avec l'utilisateur ; il ne se règle pas silencieusement par un agent, quel que soit le sens du règlement.

## 2026-07-20 — VOICE : exception E-motion documentée dans les deux sens

- **Fichiers** : `atelier/languages/voice/VOICE-UX.md` (→ 1.3.0), `VOICE-UI.md` (→ 1.2.0).
- **Ancienne situation** : `EMOTION-UX.md` affirmait unilatéralement (§ Quatre instruments) : « Voix — autorité `RULES-voice.md` ; E-motion en autorise le registre chaleureux ». Ni `VOICE-UX.md` ni `VOICE-UI.md` ne mentionnaient E-motion — un agent chargeant Voice sans E-motion (ou lisant les deux dans cet ordre) n'avait aucun moyen de découvrir l'exception. Pire, le tableau « Le ton suit l'utilisateur » de VOICE-UX affirmait l'inverse pour le cas Succès : « pas de "Bravo !", pas de confettis (écho MOTION : pas de célébration) », sans distinguer succès routinier et moment E-motion catalogué — et VOICE-UI gardait un gabarit « succès » identique, sans exception.
- **Nouvelle règle** : VOICE-UX documente désormais explicitement l'exception (§ Exception E-motion, nouvelle section) et corrige la ligne Succès du tableau de ton en deux cas (routinier / moment E-motion catalogué) ; VOICE-UI assortit la règle « pas de point d'exclamation » et le gabarit « succès » de la même exception, bornée aux seuls moments du catalogue d'EMOTION-UX.md.
- **Pourquoi** : une règle d'autorité doit être lisible depuis les deux fichiers qu'elle relie. Le routeur charge Voice quand E-motion est invoqué (`selon-contexte`), jamais l'inverse — l'exception ne pouvait donc être garantie visible que si elle vivait aussi côté Voice.

## 2026-07-20 — DESIGN.md : résidu terminologique corrigé (E-motion = langage, pas fondation)

- **Fichiers** : `atelier/core/DESIGN.md` (→ 1.25.1). Aucun token modifié.
- **Ancienne situation** : le commentaire du cran `motion.expressive`/`spring`/`celebration` (ajouté en 1.22.0, à l'époque où E-motion était encore une fondation) disait toujours « fondation E-motion », alors que la reclassification 1.24.0 a promu E-motion en langage.
- **Nouvelle règle** : le commentaire dit « langage E-motion ».
- **Pourquoi** : un résidu de nommage après une reclassification peut laisser croire, à tort, qu'une classification reste incertaine ou que deux sources se contredisent.

## 2026-07-20 — Équilibre structurel Foundations / Languages / Principles

- **Fichiers** : création de `atelier/principles/` ; Motion déplacé vers `atelier/languages/` ; Accessibility, Adaptive et Laws déplacés vers `atelier/principles/` ; adaptation de DESIGN, de la méthode, du routeur, des validateurs, de la distribution et du site. Navigation regroupée sous trois repères : Méthode / Core / Application.
- **Ancienne situation** : la séparation Foundations / Languages clarifiait Interaction, Emotion et Voice, mais laissait Motion parmi les fondations alors qu'il exprime les changements dans le temps. Accessibility, Adaptive et Laws étaient regroupés avec les matières visuelles malgré leur rôle d'obligation ou de raisonnement transversal. Créer une catégorie Architecture pour Adaptive seul aurait provisionné une famille sans corpus.
- **Nouvelle règle** : une **Foundation fournit la matière et le vocabulaire de construction** ; un **Language exprime du sens par un canal cohérent** ; un **Principle encadre les décisions indépendamment du rendu**. Répartition : 8 Foundations, 4 Languages, 3 Principles.
- **Pourquoi** : trois tests simples suffisent désormais à classer un sujet : « sert-il à construire ? », « exprime-t-il quelque chose ? », « doit-il guider toute décision ? ». Les catégories restent substantielles sans forcer un sujet dans une case ni créer de groupe solitaire.
- **Navigation** : **Méthode** regroupe pourquoi / process / vérification dans un volet repliable ; **Core** regroupe Foundations / Languages / Principles ; **Application** regroupe Components / Patterns / Flows. Core et Application restent des séparateurs visuels ; les intitulés de catégories portent les accordéons.

## 2026-07-20 — Séparation structurelle Foundations / Languages

- **Fichiers** : création de `atelier/languages/` ; déplacement de Interaction, E-motion et Voice ; adaptation des validateurs, du routeur IA, du site, de l’index DESIGN et de la distribution.
- **Ancienne situation** : Interaction portait déjà le nom de « langage », Voice décrivait une grammaire de contenu et E-motion une couche d’expression, mais les trois vivaient dans `atelier/foundations/` avec `type: foundation`. La structure contredisait leur rôle.
- **Nouvelle règle** : une **fondation** fournit une primitive, une contrainte ou une architecture ; un **langage** compose ces fondations pour produire des signes cohérents. Interaction, E-motion et Voice portent désormais `type: language`. Adaptive reste une fondation architecturale.
- **Pourquoi** : les fondations sont le vocabulaire ; les langages sont la grammaire. Cette séparation permet à une IA de distinguer ce qui constitue l’interface de ce qui lui donne du sens.

## 2026-07-20 — Interaction Language, Adaptive Architecture et Link

- **Fichiers** : nouvelles fondations `interaction` et `adaptive`, nouveau composant `link`, trois
  inventaires de couverture ; Button, Input, Card et Spacing reliés ; index de DESIGN étendu sans
  nouveau token.
- **Constat** : le corpus portait déjà plusieurs fragments justes — Button ≠ Link, Input délimité,
  Card statique sans ombre, elevation comme signal — mais aucun propriétaire ne les réunissait en
  langage. Le responsive des composants restait piloté par `breakpoint.mobile`, donc par la fenêtre,
  même quand leur espace réel venait d'une sidebar, d'une modale ou d'une grille.
- **Décision Interaction** : la reconnaissance du rôle précède le style. Agir, naviguer, saisir,
  choisir, consulter et signaler ont des promesses distinctes. La matérialité est fonctionnelle :
  bordure, fond, forme, état, mouvement ou profondeur peuvent renforcer le rôle, mais aucune ombre,
  inset ou animation n'est imposé. La couleur et le hover ne portent jamais seuls l'information.
- **Décision Adaptive** : « la fenêtre définit la page ; le conteneur définit le composant ».
  Container Queries par défaut quand l'espace disponible du composant cause l'adaptation ; Media
  Queries maintenues pour la structure globale, l'impression, le mouvement réduit, le contraste forcé
  et les capacités d'entrée. Les seuils sont dérivés du contenu et les états se nomment
  compact/regular/expanded, jamais mobile/tablet/desktop.
- **Décision Link** : la dette « lien dans le texte » devient un composant documenté. Un Link promet
  une destination ; un Button promet une action. Le soulignement inline, le but du lien, les
  téléchargements, les nouveaux contextes et le lien étendu d'une Card ont désormais un propriétaire.
- **Pourquoi aucun token** : les besoins visuels se résolvent déjà avec couleur, typographie,
  bordure, icône, motion et élévation. Ajouter des tokens « tactile » aurait transformé une loi
  d'affordance en thème graphique et dupliqué les propriétaires existants.
- **Condition de validation** : éprouver sur un écran réel la coexistence d'un même composant dans
  deux largeurs de conteneur au même viewport, puis tester la reconnaissance en niveaux de gris, sans
  hover et au clavier.

## 2026-07-19 — Propagation du modèle STYLE × TONE dans les renvois croisés

- **Fichiers** : `COLOR-UI.md` (v1.1.0 — paires garanties étendues aux nouveaux fonds pleins, « warning jamais un fond plein » levé aussi ici, table de consommation du bouton réécrite en rôles par tone) et `dist/RULES-color.md` (mêmes tables) ; bumps de vocabulaire sans changement de règle : COLOR-UX 1.1.1, ALERT-UX 1.3.1, CARD-UX 1.2.1, INPUT-UX 1.5.1, INPUT-UI 1.4.2, FORM-UX 2.1.3, CREATION-COMPTE-UX 1.2.2, TYPOGRAPHY-UX 1.1.2, GRID-UX 1.0.1, METHODE 1.8.1, inventaire couleur (9 → 16 combinaisons), RULES-alert/card/input/creation-compte(-sso-social), `tools/genere-site.js` + `tools/methode-contenu.js` (deux textes du site).
- **Ancienne situation** : la décision BUTTON du 2026-07-18 avait renommé l'axe `emphasis` → `style` dans BUTTON-* et DESIGN.md, mais l'ancien nom restait vivant dans les notes de transposition et les renvois des autres sujets — et COLOR-UI garantissait encore « warning : jamais un fond plein » alors que le garde-fou était levé, sans mentionner `neutral-strong(-hover)`, `warning-hover` ni `danger-subtle-hover`.
- **Nouvelle situation** : plus aucune occurrence normative d'`emphasis` ; les mentions restantes sont historiques (ce journal, la note de vocabulaire BUTTON-UX 1.5.0, les récits du site). La formule des notes de transposition devient « l'axe `style` n'existe pas ici ». La table des paires garanties dit les paires réelles : `on-primary` sur `neutral-strong(-hover)` et `warning(-hover)`, `danger` sur `danger-subtle-hover`.
- **Pourquoi** : un renvoi normatif vers un axe qui n'existe plus est un défaut de doc du même ordre qu'un token fantôme ; et la table des paires garanties est le contrat que `test-rendu.js` vérifie — elle doit dire ce qui est vrai, ni plus ni moins.

## 2026-07-18 — E-MOTION : la couche d'EXPRESSION (13e fondation)

- **Fichiers** : `atelier/foundations/emotion/EMOTION-UX.md` + `EMOTION-UI.md` (v1.0.0), `dist/RULES-emotion.md`, `atelier/core/DESIGN.md` (v1.22.0 — cran motion `expressive` 700ms / `spring` overshoot / `celebration` 1200ms), `tools/genere-routeur.js` (emotion rattachée aux intentions Formulaire + Feedback). `dist/tokens.*` régénérés.
- **Ancienne règle** : le système n'avait qu'un registre de mouvement PRODUCTIF (< ~400ms, « pas de célébration, pas de bounce »). MOTION-UX 1.2.0 avait déjà noté que ce « productif seulement » était un parti pris d'identité PARAMÉTRABLE, relevable par un « chemin sanctionné » — mais ce chemin n'existait pas encore.
- **Nouvelle règle** : E-motion EST ce chemin. Une couche d'expression mince, rare et gouvernée — la « couche humaine/émotionnelle » qui différencie le DS. Elle relève le parti pris (durées > 400ms, courbe à dépassement `spring`, plafond `celebration`) pour des moments strictement MÉRITÉS (réussite d'un envoi, première fois, cap franchi, sortie d'erreur, vide avec personnalité), sous **budget de rareté** (un moment qui se répète cesse d'être expressif — miroir de « un seul primary par vue »). Loi cardinale : l'expression est proportionnelle au SENS du moment (miroir de « friction ∝ risque »).
- **Ce qui n'est JAMAIS relevé** : le contrat d'accessibilité. E-motion hérite tout WCAG de motion (reduced-motion → version instantanée ; `transform`/`opacity` seulement ; pas de flash > 3/s ; jamais d'info par le seul mouvement). Contrat de repli INVIOLABLE : E-motion est toujours une amélioration, jamais un canal d'information.
- **Pourquoi** : demande produit explicite (réf. « Paper plane button » d'Aaron Iker) — offrir des moments d'expression qui sortent de la monotonie d'un DS ultra-cadré ; la couche émotionnelle qui différencie. Nom trouvé ensemble : « E-motion » (émotion + motion). Décision de tracer le parti pris DANS le système (fondation gouvernée) plutôt qu'à côté (effet local), pour ne pas introduire de valeur hors-système.
- **Premier citoyen** : le SubmitButton « avion en papier » (envoi async → pliage/vol → succès), gabarit de tout futur moment. Quatre instruments : mouvement (premier violon), voix (registre chaleureux autorisé), couleur (empruntée aux tokens), forme.

## 2026-07-18 — BUTTON : modèle STYLE × TONE (deux axes pleinement orthogonaux)

- **Fichiers** : `atelier/core/DESIGN.md` (v1.21.0 — 4 tokens : `neutral-strong`, `neutral-strong-hover`, `warning-hover`, `danger-subtle-hover`), `atelier/components/button/BUTTON-UI.md` (v1.4.0 — bloc `colors` plat remplacé par un bloc `tones`), `BUTTON-UX.md` (v1.5.0 — vocabulaire des axes), `dist/RULES-button.md` (édition manuelle), `tools/test-rendu.js` (gate `buttonModel` réécrit), `tools/genere-site.js` (spécimens + kitchen-sink). `dist/tokens.*` régénérés au build.
- **Ancienne règle** : axe `emphasis` [primary, secondary, ghost] × `tone` [neutral, destructive, warning] = 9 combinaisons. `emphasis` confondait deux choses — le REMPLISSAGE (primary = plein, secondary/ghost = sans fond) et le RANG de l'action dans la vue. `primary` et `neutral` n'étaient pas des tones ; le warning n'existait qu'en fond subtil (« jamais un fond plein »).
- **Nouvelle règle** : deux axes pleinement orthogonaux — `style` [filled, stroke, lighter, ghost] (le remplissage) × `tone` [primary, neutral, destructive, warning] (la couleur sémantique) = **16 combinaisons**, chacune un token explicite. Chaque tone fournit 4 rôles : `solid`/`on_solid`/`solid_hover` (filled), `fg`/`border` (stroke), `subtle`/`on_subtle`/`subtle_hover` (lighter), le style ghost réutilisant `fg`/`subtle`. Le **rang** (dominante/alternative/mineure) n'est plus un axe : il s'obtient en combinant style+tone (dominante = `filled`+`primary`, alternative = `stroke`/`lighter`+`neutral`, mineure = `ghost`+tone). Le garde-fou « warning jamais en fond plein » est levé.
- **Pourquoi** : demande produit — aligner DS-UI et DS-MD sur un même modèle Style × Tone (réf. Material 3 : filled/tonal/outlined/text). L'ancien `emphasis` mélangeait remplissage et rang, ce qui rendait illégitimes un `stroke`+`primary` (bordé bleu) ou un `lighter`+`primary` (bleu doux). L'ambre profond `warning` #92400E (assombri en 1.14.0 pour la lisibilité) porte le blanc à 7.09:1 : il tient désormais comme fond plein, donc warning a les 4 styles comme les autres.
- **Vérifié** : les 16 combinaisons × (repos + hover) tiennent ≥ 4.5:1 (`tools/test-rendu.js`). Paire la plus tendue : `lighter` + destructive au hover = 4.60:1 — d'où `danger-subtle-hover` calibré à #FBCFCF (un #FECACA « red-200 » naïf tombait à 4.47:1, sous le seuil).

## 2026-07-16 — BORDER/ACCESSIBILITÉ : pas d'anneau sur une cible de focus programmatique

- **Fichiers** : `atelier/foundations/border/BORDER-UI.md` (v1.1.0), `tools/genere-site.js` (émet `[tabindex="-1"]:focus{outline:none}` dans `public/assets/site.css`). `dist/RULES-border.md` reste à resynchroniser (dette de compilation non généralisée).
- **Ancienne règle** : « jamais `outline: none` sans remplacement 3:1 », sans exception — en collision avec la pratique d'accessibilité qui déplace le focus sur le titre/la région au changement de vue (annonce lecteur d'écran).
- **Nouvelle règle** : `outline: none` est autorisé, et seulement, sur une cible de focus programmatique (`tabindex="-1"`, non atteignable au Tab). L'anneau reste obligatoire sur tout contrôle clavier, y compris un panneau d'onglet `tabindex="0"` vide.
- **Pourquoi** : bug visible sur les trois surfaces (démo, doc, audit) — un titre encadré « parfois » au chargement. Le focus programmatique sur un `<h1 tabindex="-1">` affiche son anneau quand la dernière modalité était le clavier (`:focus-visible`), d'où l'intermittence. La règle ne disait rien de cette cible ; le bug l'a révélé.

## 2026-07-17 — Site : gate de complétude du registre des sujets, plutôt qu'une refonte physique du registre

- **Fichiers** : `tools/audit-sujets.js` (nouveau), `tools/build.js` (étape 8/11 insérée), `docs/SITE-CONVENTIONS.md`, `tools/README.md`. Aucun changement de sortie (`public/` identique).
- **Constat** : dans `genere-site.js`, les données d'un sujet sont éclatées dans des structures indépendantes — `ICONES` (emblème), `SUJET_QUESTIONS` (narration), `SUJET_REGLES` (règles), `casVisuel`/`familleVisuel` (illustrations). Rien ne reliait ces morceaux : `grid` a pu être ajouté à moitié illustré, et un clobber de sous-agent a pu réverter son emblème vers `_defaut` **sans qu'aucun contrôle ne le signale**. Le code review proposait de tout consolider en « un objet par sujet ».
- **Option écartée** : la consolidation *physique* des quatre fonctions d'illustration en propriétés par slug. Mesuré sur le terrain : `casVisuel`/`familleVisuel`/`specimen*` dépendent chacune de ~20 closures locales partagées (helpers `bar`, `champ`, `coche`, `svg`…) ; les fondre voudrait dire recâbler ~2500 lignes de générateur SVG — **risque pur pour zéro changement de sortie**. `familleVisuel` s'est de plus révélée pilotée par le *titre* de section (fallback garanti), pas par le slug : « un objet par slug » ne correspond pas à sa vraie mécanique.
- **Décision** : livrer la *garantie* que la refonte cherchait — « impossible d'oublier une pièce » — par un **gate mécanique** (`audit-sujets.js`) au lieu du déplacement de données. Il découvre les sujets depuis `atelier/` (comme le site) et vérifie pour chacun le contrat universel : **emblème dédié ≠ `_defaut`, narration, règles, branche `casVisuel`** (sans elle, la fonction retombe sur `return null` → aucune illustration de cas). `familleVisuel` et le spécimen sont reportés en informatif. Le build passe au rouge, en nommant le sujet et la pièce, dès qu'un morceau manque. Vérifié : les 18 sujets passent aujourd'hui ; une copie cassée (branche retirée + emblème = défaut) est bien détectée.
- **Dans la foulée (a11y, WCAG 1.3.1)** : le gate `audit-a11y` signalait 25 sauts de hiérarchie `h1→h3`. Cause unique et systématique : le titre de section « Trois règles fondamentales » (et le titre du flow-chrono, et les entrées de journal) étaient des `h3` **avant** le premier `h2` de la page, alors qu'ils sont des sections **paires** de « Cas d'usage » (déjà `h2`). Correction : promotion en `h2` avec une classe qui **reproduit au pixel** l'ancien style `h3` (`h2.titre-essentiel`, `h2.flow-chrono-titre`) — sémantique corrigée, **zéro changement visuel**. Résultat final : **25 → 0 avertissement**, les **34 pages** propres. Deux techniques, toutes deux **sans changement visuel** : (a) les titres de section réels promus en `h2` avec une classe qui reproduit au pixel l'ancien style (`h2.titre-essentiel`, `h2.flow-chrono-titre`) ; (b) pour les pages où un titre `h2`/`h1` manquait dans le plan sans manquer visuellement (`decisions`, `pourquoi`, `process`, `tests`, et un titre de page pour `preuve-themes`), un titre `sr-only` (invisible, lu par les seuls lecteurs d'écran). Enfin, les **aperçus décoratifs** de landing (mock répété deux fois par page → `h1` multiples) sont passés `aria-hidden="true" inert` : hors de l'arbre d'accessibilité ET de l'ordre de tabulation (les faux boutons ne sont plus focusables — vrai gain clavier), et `audit-a11y` a appris à **ignorer les sous-arbres cachés** dans le calcul du plan de titres (correction de principe : un titre caché des lecteurs d'écran ne compte pas). Le `h1` de page de `preuve-themes` n'est ajouté qu'en page autonome, pas dans le volet « Thèmes » embarqué de `tests` (sinon double `h1`).
- **Pourquoi** : la fiabilité voulue est une *contrainte vérifiée*, pas une *forme de code*. Un gate déclaratif l'obtient sans toucher au générateur (donc sans risque de régression visuelle), reste dans l'invariant zéro-dépendance et rejoint la famille `audit-regles`/`garden`/`audit-a11y`. La consolidation physique reste possible plus tard si un autre besoin la justifie — elle n'est plus la condition de la garantie. (A aussi corrigé une dette : la liste numérotée du build dans `tools/README.md` avait sauté l'étape a11y.)

## 2026-07-16 — TYPOGRAPHIE : token `body-small` (14 px) pour le texte fonctionnel sous le corps

- **Fichiers** : `atelier/core/DESIGN.md` (v1.19.0, `typography.body-small`), `atelier/components/input/INPUT-UI.md` (v1.4.1), `dist/tokens.css` + `dist/tokens.yaml` régénérés.
- **Ancienne règle** : aucun cran de texte entre `label` (12 px, interface) et `body` (16 px). INPUT-UI mappait le texte saisi, le label **et les messages** sur `typography.body` (16 px), au nom de la règle « jamais sous 16 px » — laquelle vise en réalité le **champ de saisie** (zoom iOS), pas son helper.
- **Nouvelle règle** : `typography.body-small` (Geist 14 px) pour le **texte fonctionnel qui n'est pas un champ** : helper, message d'erreur, compteur, légende. Le texte saisi et le label restent en `body` (16 px, règle iOS maintenue).
- **Pourquoi** : révélé par le pilote externe (agent à froid Claude Code, 2026-07-16) — faute d'un cran ~14 px, l'agent a détourné `headings.h6`, un token de **titre**, pour du helper text (couplage au mauvais rôle). Jumeau du besoin qui a fait naître la fondation `grid` au même pilote. Décision de design assumée : le helper passe de 16 à 14 px.

## 2026-07-16 — Fondation grid : naissance par le besoin de largeur de conteneur

- **Fichiers** : `atelier/foundations/grid/GRID-UX.md` + `GRID-UI.md` (1.0.0), `atelier/inventaires/inventaire-cas-usage-grid.md`, `DESIGN.md` (1.18.0, groupe `grid`), `SPACING-UX.md` (1.1.0), `dist/RULES-grid.md` (condensation) + routeur (grid ajouté aux bundles Formulaire/Collection/Page de contenu/Création de compte), outillage (`genere-tokens`, `valide-dossier`, `garden`).
- **Ancienne règle** : SPACING avait différé la fondation grid *entière* en l'absence de consommateur ; un écran mono-colonne n'avait donc aucun token de largeur (détour de `breakpoint.mobile`).
- **Nouvelle règle** : la fondation `grid` naît avec le **besoin prouvé** — les largeurs de conteneur (`container-narrow` 480 / `-default` 1024 / `-wide` 1440), trou confirmé par deux pilotes indépendants le 2026-07-16. La **grille de colonnes** (12 colonnes, gouttières inter-colonnes) reste différée jusqu'au pattern collection/grille.
- **Pourquoi** : un token de largeur bolté seul aurait été une fondation orpheline ; le faire naître avec sa fiche, son inventaire et son benchmark (Carbon, GOV.UK, Material) respecte la méthode. Frontières posées : `grid` ≠ `measure` (lecture) ≠ `spacing` (proximité) ≠ `media_ratio` (ratio). RULES-spacing mis à jour (le cadre de page a quitté spacing).

## 2026-07-16 — Pilotes externes (login + inscription) : registre de trous, consentement désambiguïsé

- **Contexte** : deux pilotes « consommateur naïf » exécutés sur `dist/` seul (login → intention Formulaire ; inscription → Création de compte), désormais reproductibles via `tools/pilote/PROTOCOLE-PILOTE.md` (résultats : `tools/reports/RAPPORT-PILOTE.md`). Verdict : routage, discipline des extensions et remontées (toast hors-périmètre, garde-fous couleur, soft/hard-gate) tous corrects — le système est consommable par un tiers. La valeur du test est dans les trous ci-dessous.
- **Fait maintenant** : `atelier/patterns/form/FORM-UX.md` (2.1.1 → 2.1.2). *Ancienne* : la table de risque routait « Consentement » sans distinguer l'inscription du consentement lié à des données sensibles, alors que `form-sensitive-data` revendique aussi « consentement » dans son périmètre — les deux pilotes ont noté le risque de charger la mauvaise extension. *Nouvelle* : autorité explicite — `creation-compte-consentement` à l'inscription, `form-sensitive-data` seulement pour un consentement lié à des données sensibles ou à un paiement, jamais les deux. Aucune règle de fond modifiée.
- **Routé à leur propriétaire (à traiter par le cycle méthode, pas en patch)** :
  - **Token de largeur de conteneur** — signal fort (trouvé par les DEUX pilotes) : un écran de formulaire centré n'a aucun token de largeur, l'agent détourne `breakpoint.mobile`. À traiter avec la **fondation grid/layout déjà différée** (cf. entrée 2026-07-11 « SPACING : le grid n'a pas de fondation propre ») — ne pas bolter un token orphelin, ce serait une fondation orpheline.
  - **Bundle `alert` sans `iconography`** — signal fort (deux pilotes) : `alert`, présent dans les bundles Formulaire/Création, impose une icône par tone, mais `iconography` n'est pas chargé par ces intentions. ALERT reste auto-suffisant (silhouettes fixées dans ALERT-UI.md), donc non bloquant ; correctif = ajouter `iconography` au « Charger » de ces intentions dans la table INTENTIONS de `tools/genere-routeur.js`, ou déclarer la dépendance dans ALERT-UX. Reporté (genere-routeur.js en cours de modification dans l'arbre — éviter le clobber).
  - **Checkbox, angle mort** : INPUT-UX énumère ses `field_type` sans la checkbox ; le consentement délègue « le mécanisme » à INPUT/FORM qui ne le spécifient pas (états, couleur de coche, focus). À documenter comme `field_type` d'INPUT via le cycle complet (inventaire + benchmark), pas en patch.
  - **Indicateur de force** : la barre colorée attendue heurte deux garde-fous couleur (`warning` jamais en fond plein, pas de token `on-success`). Ajouter un renvoi explicite dans l'extension force (source `CREATION-COMPTE-UX.md`) : rendre la force par le tone d'input + le mot, pas une barre pleine. Reporté (source en cours de modification dans l'arbre).
  - **Couleur du lien dans le texte** : dette déjà connue (COLOR : « lien dans le texte, sans consommateur donc sans token — STOP si le cas se présente »), re-confirmée par le pilote login. Un consommateur existe désormais (lien « Mot de passe oublié ? ») : décider un token de lien dédié ou réutiliser `text-secondary`/`primary` — décision produit, à journaliser lors de sa prise.
- **Pourquoi** : ces trous ne sont pas des patchs — plusieurs sont liés à une fondation différée (grid) ou demandent le cycle inventaire+benchmark ; les combler à la va-vite contredirait la méthode que le reste du projet applique. Ils sont donc tracés ici (étape 8 du pipeline) pour revenir à leur propriétaire. Corrobore et complète l'entrée « e-mail déjà utilisé » ci-dessous, issue d'un pilote indépendant le même jour — deux pilotes distincts convergent sur la même couture login/flow.

## 2026-07-16 — ROUTEUR : source visuelle externe = thème, pas composant (+ barrière theme-gate)

- **Fichiers** : `tools/genere-routeur.js` (protocole, point 11), `tools/theme-gate.mjs` (nouveau) copié en `dist/theme-gate.mjs` par `tools/genere-tokens.js`, `docs/INSTALLATION.md` (v1.8.0), `dist/CLAUDE.md` + `dist/AGENTS.md` régénérés.
- **Ancienne règle** : le protocole ne disait rien du cas « un design.md externe entre dans le fil de discussion ». Laissé libre, un agent forke un composant parallèle (test WanderLuxe) — il perd la logique UX et réintroduit des bugs d'accessibilité (border-strong ramené à 1,6:1).
- **Nouvelle règle** : une source externe est un **thème** (valeurs mappées sur les noms de tokens), jamais une spec de composant ; tout token manquant garde le défaut du système (jamais d'invention) ; une maquette marketing est signalée et on retombe sur le système ; validation de contraste obligatoire (`theme-gate.mjs`) avant d'appliquer — un thème qui échoue ne s'applique pas.
- **Pourquoi** : retour de deux tests de rebranding (2026-07-16) — le fork casse les normes, le token-swap validé les conserve. La barrière rend la norme **exécutable** au lieu de déclarative.


## 2026-07-16 — FLOW « e-mail déjà utilisé » : défaut sûr + remontée obligatoire (retour de pilote)

- **Fichiers** : `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (v1.2.1), `dist/RULES-creation-compte-email-deja-utilise.md`, `docs/INSTALLATION.md` (v1.7.0).
- **Ancienne règle** : le flow imposait de *choisir explicitement* la posture (ouverte vs neutre) et de la tenir partout, sans dire quoi faire tant que le produit n'a pas tranché.
- **Nouvelle règle** : en l'absence d'arbitrage produit, l'agent **remonte le choix** et applique **par défaut la posture neutre** (ne pas confirmer l'existence d'un compte dans l'interface). Retenir la posture ouverte en silence devient explicitement le défaut à éviter.
- **Pourquoi** : premier pilote à froid (agent Claude Code non briefé, 2026-07-16). Sur un parcours d'inscription complet et par ailleurs très conforme, l'agent a tranché seul la seule question de sécurité de l'écran — en choisissant l'option la moins protectrice, notée comme simple hypothèse. Le signal « lève la main » du système n'était pas assez impératif là où il compte le plus. Corrobore la couture repérée côté login (posture inatteignable depuis l'intention formulaire — à traiter quand le flow connexion sera documenté).

## 2026-07-15 — FLOW : retrait du prototype fictif, la preuve attendra le réel

- **Fichiers** : `tools/genere-site.js`, `docs/architecture/SITE.md` (v1.12.0), `public/sujets/creation-compte.html`.
- **Ancienne présentation** : un film de quatre téléphones puis un second prototype interactif rejouaient une inscription inventée, avec des choix produit spécifiques et des composants encore absents du système.
- **Nouvelle présentation** : la page conserve la lecture temporelle dans « L'essentiel » et la carte des cas d'usage, mais retire l'onglet « Voir en action ». Cet emplacement ne reviendra qu'avec un flow réellement observé, présenté comme une chaîne `faits → règles → risques → arbitrages`.
- **Pourquoi** : une maquette fictive prouve seulement que le site sait dessiner des écrans. Elle ne prouve ni le pouvoir de détection du projet ni sa plus-value face au réel, et peut être confondue avec un template prescriptif.

## 2026-07-15 — FLOW création de compte : règles sensibles recalibrées et première compilation mécanique

- **Fichiers** : `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (v1.2.0), `tools/genere-flow.js`, `dist/RULES-creation-compte*.md`, `tools/genere-routeur.js`, `tools/genere-site.js`, `atelier/core/METHODE.md` (v1.8.0), `docs/INSTALLATION.md` (v1.6.0), `docs/architecture/SITE.md` (v1.11.0).
- **Anciennes règles** : mot de passe résumé à « ≥ 8 » ; rapprochement de comptes suggéré sur l'égalité de l'e-mail ; soft gate présenté comme défaut grand public ; focus et région live prescrits ensemble ; consentement, CGU et information de confidentialité partiellement confondus. Les six RULES du Flow étaient des condensations éditoriales sans preuve mécanique de fraîcheur.
- **Nouvelles règles** : NIST SP 800-63B-4 (15 caractères en facteur unique, 8 avec MFA, au moins 64 acceptés) ; aucune fusion sans preuve de contrôle ; vérification et activation calibrées au risque ; focus réservé au vrai changement de vue et statut live aux mises à jour sans déplacement ; contrat, information et consentement séparés. Le build extrait désormais les six RULES depuis une source unique et inscrit version + SHA-256 dans chaque sortie.
- **Pourquoi** : l'audit du Flow a trouvé des prescriptions devenues fausses ou dangereuses et une promesse de « compilation » que la chaîne ne garantissait pas. La plus-value du projet dépend d'abord de sa capacité à ne pas transformer une vieille synthèse en règle sûre d'elle-même.

## 2026-07-15 — FLOW : une lecture temporelle et des dépendances visibles

- **Fichiers** : `tools/genere-site.js`, `tools/genere-routeur.js`, `docs/architecture/SITE.md` (v1.11.0), `docs/INSTALLATION.md` (v1.6.0).
- **Ancienne présentation** : la page Flow reprenait la galerie générique des sujets et l'installateur ne savait pas expliquer ce qu'un Flow sélectionné seul entraînait. Son empreinte simulait un sous-bundle alors que le téléchargement restait toujours l'archive complète.
- **Nouvelle présentation** : l'essentiel du Flow montre quatre moments, la machine à états et les bifurcations ; l'installateur calcule la fermeture transitive `creation-compte → form → composants → fondations`, distingue sélection, dépendances automatiques et archive complète ; « onboarding » n'est plus un déclencheur de la création de compte.
- **Pourquoi** : un Flow vaut par l'ordre et les sorties de scène, pas par une collection de cartes. Rendre cette structure visible aide l'auditoire humain à comprendre ce que l'outil détecte sans l'obliger à lire quarante cas.

## 2026-07 (début) — BUTTON-UX : liste plate de variantes → deux axes indépendants

- **Fichier** : components/button/BUTTON-UX.md (v1.0.x)
- **Ancienne règle** : une liste plate de 5 variantes (primary / secondary / destructive / warning / ghost).
- **Nouvelle règle** : deux axes indépendants combinables — emphasis (primary/secondary/ghost) × tone (neutral/destructive/warning).
- **Pourquoi** : la liste plate ne permettait pas d'exprimer un cas pourtant déjà documenté dans le fichier lui-même — un destructive à faible emphase (icône de suppression discrète dans une table). Un tour des systèmes majeurs (Material Design, IBM Carbon, Shopify Polaris, Material UI) a confirmé que tous séparent emphasis et tone.

## 2026-07 (début) — BUTTON-UX : retrait de la règle "le primary mène la lecture"

- **Fichier** : components/button/BUTTON-UX.md
- **Ancienne règle** : le primary devait précéder le secondary dans le sens de lecture, par défaut.
- **Nouvelle règle** : pas de règle universelle d'ordre — deux conventions coexistent selon le type de paire ; la seule règle qui tienne est la cohérence interne au produit.
- **Pourquoi** : la règle initiale avait été généralisée à partir d'un seul cas observé ; un second cas réel l'a contredite. Leçon méthodologique : ne pas généraliser depuis un cas unique.

## 2026-07-03 — BUTTON-UX + FORM-UX : le bouton désactivé n'est plus un mécanisme de validation

- **Fichiers** : components/button/BUTTON-UX.md (§ Dans un formulaire), patterns/form/FORM-UX.md (§ Coordination bouton/champs)
- **Ancienne règle** : "bouton désactivé tant que les champs requis ne sont pas valides" (vivait dans BUTTON-UX.md).
- **Nouvelle règle** : bouton de soumission actif en permanence ; validation au clic, erreurs affichées (inline + résumé), focus déplacé. Désactivation uniquement pendant le traitement asynchrone (anti double-soumission). La règle vit dans FORM-UX.md, qui fait autorité ; BUTTON-UX.md y renvoie.
- **Pourquoi** : un bouton désactivé n'explique pas *pourquoi* il l'est (pas de tooltip sur tactile) et casse la découvrabilité pour un lecteur d'écran. Tendance récente de l'industrie, émergente plutôt qu'unanime — documentée comme telle dans les sources de FORM-UX.md. C'est aussi la duplication qui a fait naître `patterns/` : la règle n'appartenait ni au bouton ni à l'input.

## 2026-07-03 — BUTTON-UX → CARD-UX : la cardinalité des actions en carte change de propriétaire

- **Fichiers** : components/button/BUTTON-UX.md (v1.3.0), components/card/CARD-UX.md (§ Zone d'actions)
- **Ancienne règle** : "un seul bouton d'action principal par carte, actions secondaires en icônes" vivait dans BUTTON-UX.md (§ Dans une carte).
- **Nouvelle règle** : la règle vit dans CARD-UX.md, qui fait autorité sur le nombre et la position des actions ; BUTTON-UX.md garde le *choix* de chaque bouton (emphasis/tone/taille) et la contrainte de zone tactile (propriété du bouton).
- **Pourquoi** : c'est une règle de composition de la carte, pas une propriété du bouton — 2e application du principe de dédoublonnage établi avec FORM-UX.md.

## 2026-07-03 — BUTTON-UI 1.1.0 : mapping emphasis × tone complété (corrections F03/F04 — numérotation d'un premier outillage)

- **Fichier** : components/button/BUTTON-UI.md
- **Ancienne règle** : tokens de tone définis uniquement pour les fonds pleins (`tone.destructive_bg`, `tone.warning_bg`) ; `tone.destructive_text` n'existait pas (déduit implicitement par les outils de rendu).
- **Nouvelle règle** : tout tone se décline en `_bg`/`_text` (fonds pleins) et `_fg` (emphasis sans fond) — les 9 combinaisons résolvent des tokens explicites.
- **Pourquoi** : quatre des neuf combinaisons (secondary/ghost × destructive/warning) étaient rendues identiques au neutral, en contradiction directe avec la table de combinaisons de BUTTON-UX.md ("ghost + destructive : tone qui compense par la couleur"). Un premier passage de test de rendu a rendu le trou visible. Une déduction correcte reste une déduction non documentée — cas vécu : l'outil de rendu déduisait la couleur du texte destructive, juste mais silencieusement.

## 2026-07-03 — BUTTON-UI 1.1.0 : tokens hover ajoutés (correction F08 — numérotation historique)

- **Fichier** : components/button/BUTTON-UI.md, DESIGN.md 1.3.0
- **Ancienne règle** : `states` déclarait hover sans lui donner un seul token.
- **Nouvelle règle** : famille hover complète sur le modèle des state layers — fond assombri d'un cran (emphasis avec fond), remplissage léger apparaissant (emphasis sans fond).
- **Pourquoi** : BUTTON-UX.md fait du hover "le principal signal d'affordance sur desktop" — un état déclaré sans token était une promesse sans implémentation.

## 2026-07 (début) — INPUT-UX : l'indicateur de champ requis, deux corrections successives

- **Fichiers** : components/input/INPUT-UX.md, patterns/form/FORM-UX.md
- **Ancienne règle** : (1) d'abord absent de la première version d'INPUT-UX.md — par oubli, pas par choix ; (2) puis ajouté comme propriété du champ.
- **Nouvelle règle** : l'indicateur existe, mais la *convention* (marquer le requis vs marquer l'optionnel) est une décision de formulaire — FORM-UX.md fait autorité.
- **Pourquoi** : "ce formulaire marque-t-il les champs requis ou optionnels ?" se décide une fois pour tout le formulaire, jamais champ par champ. Qualifiée à l'époque d'« erreur structurelle qu'on a laissée traîner » — l'information vivait au mauvais niveau.

## 2026-07 (début) — INPUT-UX : trous comblés après benchmark

- **Fichier** : components/input/INPUT-UX.md (§ Contenu additionnel du champ, § Accessibilité du message d'erreur)
- **Ancienne règle** : première rédaction sans helper text, compteur de caractères, prefix/suffix, bouton d'effacement, ni la précision "message d'erreur précédé du mot Erreur ou d'une icône".
- **Nouvelle règle** : sections présentes (contenu actuel du fichier).
- **Pourquoi** : trous révélés par le benchmark (Carbon, Material) et l'inventaire de cas d'usage — 11 trous sur 30 cas à la première passe, dont la validation asynchrone (2e occurrence du biais "état transitoire", voir plus bas).

## 2026-07-03 — CARD-UX : le test de transposition invalide les 3 axes du bouton pour la carte

- **Fichier** : components/card/CARD-UX.md (note de transposition)
- **Ancienne hypothèse** : le gabarit générique d'un composant serait "3 axes emphasis/tone/size" (issu du bouton, déjà amendé par l'input qui avait substitué field_type à emphasis).
- **Nouvelle règle** : la carte a 2 axes (interaction_mode / density) + des slots de composition ; emphasis n'a pas de sens en collection (régime du "menu à choix parallèles" généralisé), tone disparaît entièrement (la sémantique appartient au contenu — une "carte d'alerte" est un callout), size se réduit à la densité.
- **Pourquoi** : le nombre et la nature des axes dépendent de ce que le composant *fait*. Hypothèse issue de ce test : **plus un composant est un conteneur, moins il a d'axes propres** (form, cas extrême, n'en a aucun). Trois composants, trois configurations d'axes — la leçon de l'input ("les axes dépendent de la fonction") se confirme et se précise.

## 2026-07-03 — CARD-UX ↔ BUTTON-UX : partage d'autorité tranché

- **Fichiers** : components/card/CARD-UX.md, components/button/BUTTON-UX.md
- **Décision** : cardinalité et position des actions → CARD-UX.md ; choix de chaque bouton et seuil de zone tactile → BUTTON-UX.md / BUTTON-UI.md.
- **Pourquoi** : la carte n'a pas à connaître les tokens du bouton ; le bouton n'a pas à connaître la composition de la carte. (Détail dans l'entrée "cardinalité" ci-dessus — même décision vue des deux côtés.)

## 2026-07-03 — CARD-UX 1.1.0 : trois trous comblés après test de couverture

- **Fichier** : components/card/CARD-UX.md
- **Ancien état** : première rédaction sans loading/skeleton, sans la règle anti hover-only pour les actions de carte, sans le cas "media manquant".
- **Nouvelle règle** : les trois sections existent (contenu actuel).
- **Pourquoi** : test de couverture contre l'inventaire (9 trous sur 41 cas), fait *avant* livraison pour la première fois — ordre conservé depuis. Le trou skeleton est la 3e occurrence du biais "état transitoire" (après le loading du bouton et la validation asynchrone de l'input).

## 2026-07-03 — CARD-UI 1.0.0 : premiers tokens d'ombre et de ratio du système

- **Fichiers** : components/card/CARD-UI.md, DESIGN.md 1.2.0
- **Décision** : `elevation.*` et `media_ratio.*` créés dans DESIGN.md à l'occasion de la carte — aucun composant n'en avait eu besoin avant. `overlay` provisionné pour les futurs composants superposés.
- **Pourquoi** : principe "ajouter un token quand un besoin réel le fait émerger", pas par anticipation systématique.

## 2026-07-04 — CALLOUT : création du composant, deux résultats de transposition inédits

- **Fichiers** : components/callout/CALLOUT-UX.md, CALLOUT-UI.md (v1.0.0 → 1.1.0)
- **Décisions structurantes** :
  - **tone garde 4 valeurs mais `neutral` → `info`** : un composant dont la fonction est de porter du sens ne peut pas être neutre ; sa valeur minimale est le degré zéro de gravité. Convergence des 4 systèmes benchmarkés (Carbon, Polaris, Material, Atlassian).
  - **axe `persistance` (permanent/dismissible)** : premier axe de fin de vie du projet — n'émerge que sur un contenu qui se termine.
  - **frontière de périmètre** : le toast (auto-dismiss, au-dessus du flux) et la modale d'alerte (bloquante) sont d'autres composants — critère : dans le flux vs au-dessus du flux.
  - **nommage `danger`** (vs `destructive` bouton, `error` input) : chaque composant nomme le registre de la famille `color.danger` par ce qu'il signifie pour lui — divergence assumée plutôt qu'un terme unique qui mentirait sur au moins un composant.
- **Pourquoi** : 4e test de transposition — les axes ne se contentent pas d'apparaître/disparaître selon la fonction, ils *changent de nature* en transposant. Trous comblés après test de couverture (8/39) : résolution silencieuse d'un permanent (**4e occurrence du biais "état transitoire"** — désormais un prédicteur : écrire la section "sortie de scène" d'office au prochain composant), mémoire de fermeture, empilement/agrégation.

## 2026-07-04 — FORM ↔ CALLOUT : le résumé d'erreurs rend son conteneur au composant

- **Fichiers** : patterns/form/FORM-UX.md 1.1.0, FORM-UI.md 1.1.0, components/callout/*
- **Ancienne règle** : structure et style du résumé d'erreurs (fond danger-subtle, bordure/texte danger, radius) définis dans FORM-UX.md / FORM-UI.md — le composant callout n'existait pas.
- **Nouvelle règle** : le conteneur (structure, tokens, icône, `role="alert"`) vit dans components/callout/ (tone danger, persistance permanent) ; FORM-UX.md garde l'orchestration propre au formulaire (timing d'apparition, liens d'ancre reprenant les messages exacts, focus) ; FORM-UI.md a rendu ses tokens `error_summary`.
- **Pourquoi** : 3e application du principe de dédoublonnage — appliquée pour la première fois dans l'autre sens : c'est le pattern qui rend une règle au composant. Les valeurs n'ont pas changé, la duplication est résorbée.

## 2026-07-04 — DESIGN 1.4.0 : tokens du callout et recalibrage de success

- **Fichier** : DESIGN.md
- **Ancien état** : pas de `info`/`info-subtle` ni `success-subtle` ; `success` à #16A34A (3.30:1 sur blanc).
- **Nouvelle règle** : `info` #1D4ED8 / `info-subtle` #DBEAFE ajoutés (le tone info ne peut pas emprunter `accent` — guardrail palette de marque ≠ état sémantique) ; `success-subtle` #DCFCE7 ajouté ; `success` recalibré → #15803D (5.02:1 sur blanc, 4.57:1 sur success-subtle).
- **Pourquoi** : le callout est le premier composant où chaque tone doit fonctionner en couple texte/fond subtil — success devenait un token de *texte* et ne tenait pas le seuil 4.5:1 que le système s'impose. Même mouvement que danger/warning en 1.3.0 : famille conservée, luminosité descendue jusqu'au seuil.

## 2026-07-04 — RAPPORT-TEST F01 : le compteur de caractères passe sur text-secondary

- **Fichier** : components/input/INPUT-UI.md 1.3.0
- **Ancienne règle** : `character_counter: color.text-muted` (#9CA3AF — 2.54:1 sur blanc).
- **Nouvelle règle** : `character_counter: color.text-secondary` (7.56:1), aligné sur `helper_text`.
- **Pourquoi** : le compteur est du texte fonctionnel courant (seuil 4.5:1), pas une mention accessoire — premier constat critique du nouvel outil de test.

## 2026-07-04 — RAPPORT-TEST F02 : bordure délimitante vs décorative (décision de principe)

- **Fichiers** : components/input/INPUT-UI.md 1.3.0, DESIGN.md 1.4.1 (guardrail), tools/test-rendu.js
- **Ancienne règle** : bordure neutral de l'input sur `color.border` (1.24:1) ; INPUT-UI.md n'exigeait 3:1 qu'en état error — en conflit latent avec la règle globale de DESIGN.md ("3:1 sur tout état visible") ; la carte outlined avait la même valeur avec un autre statut.
- **Nouvelle règle** : la bordure neutral de l'input passe sur `color.border-strong` (4.83:1). Guardrail ajouté à DESIGN.md : une bordure qui est le *seul signal* identifiant un composant interactif au repos → `border-strong`, 3:1 obligatoire ; une bordure de groupement décoratif (carte outlined) → `border`, exemptée. Critère : "si cette bordure disparaît, l'utilisateur sait-il encore où interagir ?". Le test de rendu applique le critère identiquement à tous les composants.
- **Pourquoi** : option "exception" écartée — un champ de saisie au repos est identifié par sa seule bordure, c'est le cas d'école de WCAG 1.4.11, et c'est exactement le raisonnement qui avait fait recalibrer le bouton secondary en DESIGN 1.3.0. Laisser l'input y échapper aurait été deux poids deux mesures. La subtilité visuelle au repos y perd — assumé : un champ qu'on ne voit pas est un champ qu'on ne remplit pas.

## 2026-07-04 — RAPPORT-TEST F03 : silhouettes d'icônes normatives pour le callout

- **Fichiers** : components/callout/CALLOUT-UI.md 1.1.0, CALLOUT-UX.md 1.1.1
- **Ancienne règle** : une icône par tone, glyphes entièrement laissés à l'identité visuelle.
- **Nouvelle règle** : la *forme* de base est fixée par tone (`icon_shape` : cercle / cercle-coche / triangle / octogone) ; seul le dessin précis reste une décision d'identité.
- **Pourquoi** : warning (#92400E) et danger (#B91C1C) sont chromatiquement proches (distance RGB 55 entre les textes) — pour une déficience rouge-vert, la couleur seule ne les sépare pas. Triangle vs octogone est la distinction standard de l'industrie (signalisation, Carbon, GOV.UK).

## 2026-07-04 — RAPPORT-TEST F04 : le chevron du mode expandable est tokenisé

- **Fichier** : components/card/CARD-UI.md 1.1.0
- **Ancienne règle** : le mode `expandable` n'avait aucun token propre — indiscernable de `static` au repos (le chevron n'existait que dans la prose de CARD-UX.md).
- **Nouvelle règle** : `expand_chevron` (`color.text-secondary`, toujours visible) + `expand_chevron_rotation` (180° à l'état déplié).
- **Pourquoi** : un axe déclaré doit résoudre au moins un token qui le rend discernable — sinon la promesse de l'axe n'est pas implémentable depuis les .md seuls.

## 2026-07-04 — RAPPORT-TEST F05 : la couleur du texte saisi de l'input devient explicite

- **Fichier** : components/input/INPUT-UI.md 1.3.0
- **Ancienne règle** : aucune — la couleur du texte saisi était déduite implicitement (`text-primary` supposé).
- **Nouvelle règle** : `value_text: color.text-primary`.
- **Pourquoi** : même famille de "déduction silencieuse" que `tone.destructive_text` sur le bouton — une déduction correcte reste une déduction non documentée.

## 2026-07-04 — RAPPORT-VALIDATION : résorption des 9 constats structurels

- **Fichiers** : DESIGN.md 1.5.0, BUTTON-UI.md 1.2.0, CARD-UI.md 1.2.0, CALLOUT-UI.md 1.1.2, INPUT-UX.md 1.3.2, tools/*
- **Ancien état** : renvoi périmé vers un rapport disparu dans DESIGN.md ; 8 valeurs brutes dans les *-UI.md (480px ×2, 36px, 4px/8px illustratifs, 1px, #15803D) ; numérotation F04 ambiguë (historique vs tools/RAPPORT-TEST.md) ; "À approfondir" périmé dans INPUT-UX.md (autofill déjà documenté côté UI).
- **Nouvelle règle** : `breakpoint.mobile` (480px) et `scale.desktop-min` (36px) créés dans DESIGN.md et référencés par nom ; mentions de grille reformulées en tokens (spacing.*) ; `1px` promu **exception documentée** au même titre que 44px (épaisseur de hairline, pas une valeur d'échelle — documenté dans CALLOUT-UI.md, admis par valide-dossier.js) ; #15803D remplacé par `color.success` ; la source historique de BUTTON-UI est préfixée "F04 (numérotation historique)" ; le "À approfondir" autofill est retiré.
- **Pourquoi** : premier passage complet de l'outil de validation structurelle — les valeurs brutes se traitent par famille (token d'échelle, exception documentée, ou reformulation) plutôt qu'au cas par cas, pour que la règle survive au prochain constat du même type.

## 2026-07-05 — Typographie : création de la couche foundations/

- **Fichiers** : foundations/typography/TYPOGRAPHY-UX.md + TYPOGRAPHY-UI.md (1.0.0), DESIGN.md 1.6.0, tools/*
- **Décision** : 3e nature de fichier — la typographie n'est ni un composant (pas d'instances à décliner) ni un pattern (pas d'assemblage) : une **fondation**, contrainte transversale consommée par tout le reste. Le modèle à axes ne s'y applique pas ; à la place, deux fonctions strictement séparées : le sens (hiérarchie sémantique) et la lisibilité (taille, mesure, échelle responsive). Pas d'inventaire de cas d'usage (une fondation a des consommateurs, pas des situations). DESIGN.md gagne l'échelle typography.headings (h1-h6 fluides en clamp rem+vw, ratio ≤ 2.5 par échelon), typography.fallback (piles de secours — les polices ne sont pas embarquées) et measure.reading-max. Les outils traitent foundations/ comme patterns/ (résolution de tokens, paires UX/UI) et documentent une limite assumée : les tailles fluides ne sont pas vérifiables statiquement, le test au zoom est manuel.
- **Pourquoi** : des besoins typographiques non tokenisés étaient apparus à l'usage (titres intermédiaires dérivés par calc, letter-spacing local) et l'audit historique de portfolio-landing avait laissé un écart assumé (h1 de hero non sémantique) — la règle "niveau ≠ taille" les tranche désormais. Le point fluid type / zoom 500 % est documenté en confiance "émergent/débattu" (Roselli via Smashing Magazine, nov. 2023) — première règle du système explicitement marquée comme non consensuelle.

## 2026-07-05 — Typographie 1.1.0 : benchmark et inventaire rattrapés (écart de méthode corrigé)

- **Fichiers** : foundations/typography/TYPOGRAPHY-UX.md 1.1.0, inventaires/inventaire-cas-usage-typographie.md
- **Ancienne position (v1.0.0)** : pas de benchmark ni d'inventaire pour une fondation — "une fondation n'a pas de situations, elle a des consommateurs". Relevé comme trop léger à la relecture (à raison).
- **Nouvelle règle** : benchmark et inventaire s'appliquent aux fondations comme aux composants. Le test l'a prouvé : 10 trous sur 33 cas en v1.0.0 — exactement le ratio des composants (8/33, 11/30, 9/41, 8/39). Six comblés en 1.1.0 : interlignage (120-145 %, WCAG 1.4.8 ≥ 1.5 — les tokens 1.1/1.6 encodaient déjà la règle sans la dire), graisse (hiérarchie par combinaison, semibold jamais en texte long, gras parcimonieux), casse (sentence case, caps brèves + 5-12 % d'interlettrage — la valeur locale 8 % devient sourcée), alignement (fer à gauche, jamais justifié), taille minimale (≥ 16px, zoom iOS des inputs), profondeur (4 échelons suffisent — GOV.UK).
- **Pourquoi** : les 6 trous venaient tous des sources standard (GOV.UK, Carbon, Polaris, Butterick, WCAG 1.4.8) — sauter le benchmark s'est payé exactement comme la méthode le prévoyait. Note positive : le prédicteur "état transitoire" a fonctionné en amont pour la première fois (chargement de police couvert dès la v1.0).
- **Complément (liaison aux consommateurs)** : un audit a montré que la fondation était **orpheline** — aucun composant ni pattern ne la référençait ; famille, corps et graisse de leurs textes étaient des déductions silencieuses (le travers exact que le système combat, cf. tone.destructive_text). Corrigé dans les deux sens : blocs `typography` ajoutés à BUTTON-UI 1.2.1 (label), INPUT-UI 1.3.2 (valeur — jamais sous l'équivalent 16 px, zoom iOS), CARD-UI 1.2.1 (titre en `headings.h4` par défaut, niveau libre — "niveau ≠ taille" en application), CALLOUT-UI 1.1.3 (titre en graisse, pas un heading), note d'héritage dans FORM-UI ; et table "Consommation par les composants" dans TYPOGRAPHY-UI 1.1.0.

## 2026-07-06 — DESIGN.md 1.7.0 : tokens ajoutés suite à l'étude d'un DESIGN.md externe (Auralis/Neuform)

- **Fichier** : DESIGN.md (1.6.0 → 1.7.0)
- **Contexte** : étude d'un DESIGN.md externe (« Auralis — Neural Audio Engine », template Neuform)
  pour permettre un style de panneau contrasté type dashboard. Des ajouts, **aucun remplacement**.
- **Recoupements constatés avant d'ajouter** (la moitié du fichier externe existait déjà chez nous) :
  `primary` #4F46E5, `background`, `text-primary`, `text-secondary`, `border` — identiques ;
  leur `accent` #06B6D4 est notre **ancienne** valeur, déjà recalibrée #0891B2 en 1.3.0 pour le
  focus ring (3:1) — l'arbitrage tient, on n'y revient pas ; leur `card-padding` 24px **recoupe
  exactement `spacing.lg`** — pas de second nom pour la même valeur (commentaire ajouté sur
  `lg` pour mémoire) ; leurs `rounded.card/control` 8px = notre `radius.md`.
- **Ajouts réels** :
  - `colors.surface-contrast` #1C1C1E — chez Auralis c'est leur `surface` de repos (système
    sombre) ; chez nous la valeur est importée mais **pas le rôle** : panneau sombre de mise
    en avant uniquement (console/dashboard flottant, panneau central d'étapes), `surface`
    claire inchangée. Nom aligné sur la convention rôle-modificateur existante
    (`surface`, `surface-hover` → `surface-contrast`).
  - `spacing.section` 80px (20 × base) — le `section-padding` externe, sans équivalent
    dans l'échelle (xl = 40px) ; provisionné pour le rythme vertical de pages/gabarits
    consommateurs de la charte.
- **Non retenus** : `display-lg` 64px (notre échelle h1-h6 en clamp() couvre le besoin),
  `secondary` #FFFFFF (doublon de `background`/`on-primary`), leur `surface` en rôle de repos.

---

## 2026-07-06 — DESIGN.md 1.8.0 : typography.label (Inter), l'étiquette d'interface

- **Fichier** : DESIGN.md (1.7.0 → 1.8.0)
- **Décision** : nouveau style `typography.label` (Inter 600, 12px) pour les étiquettes
  d'interface (pastilles, badges, kickers) ; `label-mono` (JetBrains Mono) redevient la
  police des **données** techniques (code, tokens, attributions, niveaux de confiance).
- **Pourquoi** : retour d'usage — le mono en capitales espacées est illisible et déplaisant
  en étiquette. La frontière est désormais nette : Inter pour étiqueter, JetBrains Mono pour
  citer une donnée. Ajout pur : aucune valeur existante modifiée.

---

## 2026-07-11 — Fondations : passe complète sur le socle (7 fondations d'un coup)

- **Fichiers** : foundations/{color,spacing,elevation,border,radius,iconography,motion}/ (14 fichiers, v1.0.0), inventaires/ (7 nouveaux), DESIGN.md 1.9.0→1.11.0, tools/*, dist/*
- **Décision** : compléter la couche foundations/ en une passe, sur le modèle du catalogue Atlassian
  (foundations) **passé au test de transposition** — repris : color, spacing, elevation, border,
  radius, iconography, motion ; fondu : grid (dans spacing, cf. entrée dédiée) ; exclu : logos et
  illustrations (décisions d'identité sans consommateur, frontières tracées dans ICONOGRAPHY-UX).
- **Méthode** : inventaire et benchmark faits **avant** livraison pour les 7 (leçon typographie 1.1.0
  appliquée) ; sources vérifiées sur les pages officielles (Atlassian, Carbon, Polaris, Material,
  GOV.UK, WCAG, NN/g, web.dev). Le ratio de trous chute au fil de la passe (9/31 couleur → 3/28
  motion) — les fondations tardives héritent des leçons payées : prédicteur "état transitoire"
  appliqué d'office, frontières héritées des composants.
- **Constat de méthode nouveau** : sur une fondation, le trou type n'est pas l'état oublié mais le
  **contexte pas encore né** (dark mode, modale, dataviz, RTL) — l'inventaire d'une fondation sert
  autant à rendre visibles les provisions (elevation.overlay, radius.pill) et les dettes (disabled,
  lien) qu'à trouver des trous. Les fichiers marquent systématiquement "non couvert par décision"
  plutôt que de laisser des silences.

## 2026-07-11 — SPACING : le grid n'a pas de fondation propre

- **Fichier** : foundations/spacing/SPACING-UX.md (note de transposition)
- **Hypothèse écartée** : suivre le catalogue Atlassian qui documente spacing et grid séparément.
- **Décision** : pas de fondation grid tant qu'aucun consommateur de colonnes n'existe — la seule
  grille du système (collection de cartes) se définit par un gap (token spacing) et un breakpoint,
  pas par 12 colonnes. Argument de fond : chez Atlassian et Carbon eux-mêmes, la grille *dérive* de
  l'échelle d'espacement (gouttières = valeurs spacing, même mini-unit). Une fondation grid naîtra
  avec le pattern collection/grille (candidat README) et héritera de spacing, pas l'inverse.
- **Pourquoi** : même mécanisme que les axes du bouton non transposés à la carte — copier une
  structure externe par défaut est ce que le test de transposition existe pour empêcher.

## 2026-07-11 — DESIGN 1.9.0 : border.focus-* — le focus ring cesse d'être une déduction silencieuse

- **Fichiers** : DESIGN.md 1.9.0, foundations/border/*, BUTTON-UI/INPUT-UI/CARD-UI (consommateurs)
- **Ancien état** : trois composants déclaraient `focus_ring: color.accent` — la couleur seulement ;
  largeur et écart de l'anneau étaient laissés à chaque implémentation.
- **Nouvelle règle** : ring unifié — `border.focus-width` (2px) + `border.focus-offset` (2px),
  implémenté en outline + offset (jamais border : pas de layout shift, coexistence avec la bordure
  d'état). Épaisseur du trait : toujours 1px constante, l'état change la couleur, jamais l'épaisseur
  — divergence assumée avec Atlassian (selected/focused à 2px), motivée dans BORDER-UX.md.
- **Pourquoi** : même famille que tone.destructive_text et value_text — une déduction correcte reste
  une déduction non documentée. La fondation border est née d'un guardrail (1.4.1/F02) : trajectoire
  inverse de l'élévation (tokens d'abord, doctrine ensuite), notée comme telle.

## 2026-07-11 — DESIGN 1.10.0 : icon.* — tailles et trait, liaison aux consommateurs immédiate

- **Fichiers** : DESIGN.md 1.10.0, foundations/iconography/*, BUTTON-UI 1.3.0, INPUT-UI 1.4.0,
  CARD-UI 1.3.0, CALLOUT-UI 1.2.0
- **Ancien état** : quatre composants rendent des icônes (tones, chevron, actions, clear/prefix) sans
  qu'aucune taille ne soit fixée nulle part — déduction silencieuse à l'échelle du système.
- **Nouvelle règle** : trois crans fermés (`icon.sm/md/lg` : 16/20/24px, appariement Carbon 20↔16)
  + `icon.stroke` (1.5px, décision d'identité fixée dans DESIGN.md comme les polices). SVG inline +
  currentColor, jamais d'icon font. Le dessin des glyphes reste libre (précédent icon_shape) — le
  système ne fournit **pas** de bibliothèque d'icônes, la frontière est documentée.
- **Pourquoi la liaison immédiate** : la typographie avait été livrée orpheline (aucun consommateur
  ne la référençait, corrigé en 1.1.0) — leçon appliquée : les quatre `*-UI.md` consommateurs sont
  reliés dans la même passe, pas après coup.

## 2026-07-11 — DESIGN 1.11.0 : motion.* — un vocabulaire pour des micro-interactions qui existaient déjà

- **Fichiers** : DESIGN.md 1.11.0, foundations/motion/*, les 4 `*-UI.md` composants (mapping)
- **Ancien état** : le hover ("principal signal d'affordance"), la rotation du chevron (180°), la
  disparition du callout et le pulse du skeleton existaient dans les fichiers — sans durée, sans
  courbe, sans règle reduced-motion. Chaque implémentation aurait inventé les siennes.
- **Nouvelle règle** : 3 durées (`fast` 100ms / `base` 200ms / `slow` 300ms — tout sous la borne
  ~400ms), 3 courbes (ease-out entrée / ease-in sortie / ease-in-out sur place), sortie au cran
  inférieur de l'entrée, linéaire réservé au spinner. Registre **productif seulement** (dualité
  Carbon) : pas de mouvement décoratif, rien n'anime au chargement, pas de stagger. Règle cardinale :
  le mouvement confirme, il n'informe jamais seul — condition qui rend `prefers-reduced-motion`
  implémentable sans perte (déplacements coupés, opacité/couleur conservées, skeleton statique).
- **Pourquoi** : 5e occurrence du biais "état transitoire", à l'échelle du système cette fois — la
  fondation qui *est* l'état transitoire manquait. Son trou propre (l'interruption : agir pendant la
  transition) a été écrit d'office, le prédicteur ayant désigné l'endroit exact.

## 2026-07-11 — COLOR : audit — rien ne manque pour les consommateurs actuels, les dettes deviennent visibles

- **Fichiers** : foundations/color/*, DESIGN.md (aucun token couleur ajouté ni modifié)
- **Question posée** : "les couleurs sont partiellement dans DESIGN.md — peut-être il en manque."
- **Réponse d'audit** : les 23 tokens couvrent les 9 combinaisons du bouton, les tones input/callout
  en couples complets, les surfaces de la card et les états hover/focus (résolution test-rendu.js).
  Les manques sont tous des **contextes sans consommateur** : lien dans le texte (2e signalement),
  scrim, ::selection, disabled (dette héritée de BUTTON-UI, conditions de sortie désormais écrites),
  dark mode (position explicite : non couvert par décision, architecture par rôles prête). Aucun
  token provisionné — principe "un token naît d'un besoin réel" maintenu.
- **Apport propre** : la fondation consolide en un lieu les règles éparses (registres étanches
  marque/sémantique/neutres, paires texte/fond garanties, canal redondant 1.4.1) que DESIGN.md
  portait en guardrails courts — DESIGN.md garde valeurs et guardrails, COLOR-UX le raisonnement.

## 2026-07-11 — Outillage : les motifs de tokens suivent les nouveaux groupes

- **Fichiers** : tools/valide-dossier.js, tools/test-rendu.js, tools/genere-tokens.js
- **Décision** : TOKEN_RE des deux vérificateurs et GROUPS du générateur étendus aux groupes
  `border`, `icon`, `motion` — sans quoi les références des nouvelles fondations auraient été
  silencieusement ignorées (ni vérifiées, ni générées en CSS).
- **Pourquoi** : tools/README.md le prévoit — "si un fichier change ses règles de mapping, le script
  doit suivre". Un vérificateur qui ignore un groupe donne la pire des assurances : la fausse.

## 2026-07-11 — Consommation : le système devient installable (INSTALLATION.md + page de téléchargement) ; METHODE § 9 et README alignés

- **Fichiers** : INSTALLATION.md (nouveau), tools/genere-site.js (page installation.html + archive design-system-md.zip), tools/genere-routeur.js (wording portable), dist/CLAUDE.md + dist/AGENTS.md (régénérés), METHODE.md 1.1.0 (§ 9 et « Les deux couches »), README.md
- **Décision** : la distribution devient installable par un tiers. Un guide source `INSTALLATION.md` (trois étapes : déposer, brancher l'agent — Claude Code, Cowork, Cursor, Codex, Copilot —, vérifier par le prompt-test « page de login ») est rendu par une page du site avec une archive de `dist/` construite à la génération (zip « store » sans compression ni dépendance — le choix zéro-dépendance des outils tient). Le routeur ne suppose plus qu'il vit dans `dist/` (« le tokens.yaml placé à côté ») : le même fichier fonctionne dans un projet consommateur, quel que soit le nom du dossier ; l'exception consommateur est explicitée (modifier les **valeurs** de tokens.yaml, jamais ses noms). METHODE.md § 9 et README décrivent désormais le routeur — la dette notée dans l'entrée précédente est soldée.
- **Pourquoi** : le système vendait sa consommation par IA sans offrir de chemin d'adoption. La page rend le produit installable et **vérifiable** (trois comportements attendus au prompt-test : chargement minimal, zéro valeur en dur, arbitrages remontés) sans casser les principes du site : aucun contenu écrit pour lui (la page rend INSTALLATION.md), documentation/ toujours généré, jamais édité à la main.

## 2026-07-11 — Site : accueil refondu, visuels de cas dédiés aux fondations, noms de sujets non traduits

- **Fichiers** : tools/genere-site.js, SITE-CONCEPTION.md 1.6.0, documentation/ (sortie régénérée)
- **Décision** : (1) **Accueil** — hero clair sur toute la largeur de la zone de contenu (la nav reste à part), contenu centré, animation d'entrée en cascade, et un fond three.js discret : nuage de points aux couleurs des tokens avec parallaxe légère. C'est la **première ressource externe du site** (three.min.js via cdnjs, `defer`), assumée et bornée : sans réseau le hero garde son gradient CSS pur, et `prefers-reduced-motion` coupe toutes les animations (entrée et fond) conformément à MOTION-UX. Les CTA du hero appliquent RULES-button : un seul primary (« Installer dans votre projet »), un secondary (« Essayer avec le bouton »), llms.txt reste un lien technique. (2) **Panneaux de cas** — le visuel au cas par cas (mots-clés → mini-wireframe aux tokens résolus) est étendu aux 8 fondations (~65 nouveaux gabarits) ; le visuel de famille ne sert plus que de repli. (3) **Vocabulaire** — les noms de sujets ne sont jamais traduits dans la prose du site et reçoivent une distinction visuelle légère (chip monospace), hors blocs de code.
- **Pourquoi** : hiérarchiser la conversion de l'accueil (installer > essayer > index machine) ; le visuel de famille répété dans le modal mentait sur la spécificité de chaque cas ; et « un alert » n'est pas « une alerte » — le vocabulaire du système doit se voir comme tel. La ressource externe est un compromis explicite et réversible (une vendorisation locale de three.min.js suffirait à revenir au site 100 % autonome).

## 2026-07-11 — INPUT-UX → FORM-UX : la stratégie de timing de validation change de propriétaire

- **Fichiers** : components/input/INPUT-UX.md 1.4.0 (§ Error), patterns/form/FORM-UX.md 2.0.0 (§ Stratégie de validation)
- **Ancienne règle** : INPUT-UX portait le timing en absolu ("valider au blur, ~500 ms pendant la frappe sur les champs à risque") — chaque champ décidait de son timing, le formulaire n'avait pas voix au chapitre.
- **Nouvelle règle** : INPUT-UX garde la *mécanique* du champ (comment une erreur inline s'affiche, se formule, remplace le helper text) et le défaut d'un champ isolé hors formulaire (recherche, édition inline) ; FORM-UX fait autorité sur la *stratégie* du formulaire assemblé — submit-only ou blur-sur-champs-à-risque, choisie par formulaire selon le risque d'erreur de format.
- **Pourquoi** : le benchmark primaire a montré une divergence frontale entre systèmes majeurs — GOV.UK interdit la validation au blur ("attendez la soumission", problèmes documentés pour les utilisateurs qui tapent lentement) quand Carbon la recommande. Une divergence de cette taille ne peut pas être tranchée champ par champ : c'est une décision d'ensemble, comme la convention requis/optionnel l'était déjà (même trajectoire exacte : une propriété apparente du champ qui se révèle être une décision de formulaire). 4e application du principe de dédoublonnage.

## 2026-07-11 — FORM-UX 2.0.0 : le cycle de soumission formalisé — le pattern couvre enfin son état transitoire

- **Fichiers** : patterns/form/FORM-UX.md 2.0.0, FORM-UI.md 1.2.0, inventaires/inventaire-cas-usage-form.md (créé)
- **Ancien état** : form était le seul sujet du système **sans inventaire** (étape 2 de la méthode sautée), et FORM-UX 1.x s'arrêtait à l'échec de validation — tout ce qui se passe entre `submit` et le résultat (submitting, erreur serveur, timeout, retry, succès partiel, conservation des valeurs) n'existait nulle part. La page Form du site affichait "Aucun inventaire disponible" et trois espacements comme seul contenu visuel.
- **Nouvelle règle** : machine à états à 9 états (idle → validating → invalid → correcting → submitting → success / server_error / timeout / retrying / partial_success), avec pour chaque transition : déclencheur, visible, annoncé, focus, état du bouton, sort des valeurs, condition de sortie. Les états ne sont **pas** des variantes visuelles — le pattern reste sans axe ni token d'état propre (FORM-UI le verrouille : un état qui exigerait un token propre est une règle au mauvais niveau). S'y ajoutent : structure/fieldset+legend, convention requis "marquer la minorité" (annonce en tête + required/aria-required — divergence GOV.UK/Carbon/Material documentée, décision interne calibrée sur la proportion), validation croisée (l'erreur appartient au groupe, ancrée au premier champ), titre de page préfixé "Erreur :", conservation des données après tout échec, multi-étapes (retour sans perte, ask-once 3.3.7, récapitulation 3.3.4), validation asynchrone (verdict périmé jeté), champs conditionnels (valeurs masquées mémorisées mais non soumises), groupes répétables (focus après ajout/suppression), autosave (`role="status"`, jamais pendant submitting), table de friction par contexte (recherche → paiement).
- **Pourquoi** : 6e occurrence du biais "état transitoire", à l'échelle d'un pattern entier cette fois — et la confirmation la plus nette du coût de sauter l'inventaire : 47 cas non couverts sur 71 recensés (contre 8-11 partout ailleurs). Le benchmark primaire (GOV.UK error summary/validation/question pages, W3C WAI notifications, WCAG 2.2 guideline 3.3, Carbon forms) a produit deux trous face à des standards établis (titre de page, fieldset/legend) et deux divergences réelles à documenter comme telles au lieu de trancher en absolu (timing de validation, marquage requis). Aucune convention observée n'est présentée comme obligation WCAG : les lignes CONFIANCE distinguent établi / convergence / divergence documentée / non formalisé.

## 2026-07-11 — Distribution : RULES-form devient un socle + 7 extensions conditionnelles ; le routeur apprend le type « extension »

- **Fichiers** : dist/RULES-form.md (socle recompilé), dist/RULES-form-{multi-step,async-validation,conditional-fields,autosave,server-errors,sensitive-data,partial-success}.md (créés), tools/genere-routeur.js, dist/CLAUDE.md + AGENTS.md (régénérés)
- **Ancien état** : RULES-form.md ~1,1 k tokens, fidèle à FORM-UX 1.x donc partiel. Avec FORM-UX 2.0.0, la compilation en un seul fichier aurait pesé plusieurs k tokens chargés pour tout formulaire, y compris un contact de trois champs. Le routeur n'indexait que `RULES-[a-z]+.md` — un fichier à tiret aurait été silencieusement ignoré.
- **Nouvelle règle** : trois options comparées (un RULES exhaustif / sections conditionnelles internes / socle + modules). Retenu, sur arbitrage explicite : **socle + les 7 modules nommés dans la mission**, plutôt qu'un sous-ensemble resserré. Le socle garde tout ce qui concerne *n'importe quel* formulaire : structure, labels, convention requis, stratégie de validation, croisée, résumé, focus, cycle de soumission (cas nominal de chaque état, y compris un aperçu de l'échec serveur et du succès partiel — un contact peut timeouter, ce n'est pas un contexte détectable), conservation des valeurs, frontières. Les 7 extensions détaillent chacune un contexte que le routeur peut reconnaître dans la demande avant de lire quoi que ce soit : `form-multi-step` (étapes/wizard), `form-async-validation` (vérification pendant la saisie), `form-conditional-fields` (champs selon une réponse, groupes répétables), `form-autosave` (brouillon), `form-server-errors` (mapping détaillé des erreurs de champ serveur, contradictions client/serveur, idempotence — au-delà du cas nominal déjà au socle), `form-sensitive-data` (paiement/médical/consentement — récapitulation 3.3.4 détaillée), `form-partial-success` (au-delà du cas nominal). Le routeur gagne le type `extension` et le frontmatter `extension-de` : une extension n'entre dans aucun bundle d'intention, ne se charge que via la colonne « Selon contexte » de son parent, hérite du parent par `requires`, et le validateur de graphe vérifie qu'une extension pointe vers un sujet existant qui n'est pas lui-même une extension.
- **Pourquoi** : l'option "un seul fichier" charge multi-étapes + autosave + paiement pour un formulaire de contact ; l'option "sections conditionnelles" n'économise rien en pratique (un fichier chargé est un fichier lu en entier). Le découpage à 7 modules a été choisi en connaissance du risque signalé à la proposition (`form-server-errors` et `form-partial-success` recoupent en partie le socle, dont le cycle de soumission couvre déjà leur cas nominal) — la frontière retenue est donc : le socle porte le cas nominal de tout le cycle, chaque module porte l'approfondissement du cas qui le concerne. Coûts mesurés par RAPPORT-ROUTEUR.md à la régénération.

## 2026-07-12 — Fondations : ajout de `laws` (lois UX) et `voice` (voix & ton) — le test de transposition donne deux structures différentes

- **Fichiers** : foundations/laws/LAWS-UX.md (créé), foundations/voice/VOICE-UX.md + VOICE-UI.md (créés), inventaires/inventaire-cas-usage-{lois,voix}.md (créés), DESIGN.md 1.13.0 (index `foundations:` étendu, aucune valeur ajoutée).
- **Décision** : deux fondations ajoutées, avec un **résultat de transposition différent pour chacune** (le test appliqué sujet par sujet, jamais copié par défaut) :
  - **laws → UX-only.** Un catalogue de lois n'a ni surface visuelle (hex/px) ni lexique concret : c'est la *couche théorique* que les autres fondations citent déjà (Doherty dans motion, Hick dans l'inflation du primary, Gestalt/proximité dans spacing). Pas de `LAWS-UI.md` — le créer dupliquerait ce qui vit dans les autres `*-UI.md`. Sa « couche concrète » est la **carte d'application** en fin de fichier (loi → règle qui l'implémente). Périmètre « catalogue large » (27 lois, aligné lawsofux.com + sources primaires) ; deux mythes réfutés à leur source (Miller « 7 items », règle des 3 clics).
  - **voice → paire UX/UI.** Le split rôle/valeur de la couleur retombe pile : principes de voix *stables* (voix constante, ton variable, ne jamais blâmer, le mot comme canal fiable) en UX ; lexique + mécaniques *changeants avec la marque* (casse, ponctuation FR, nombres, dates, gabarits) en UI. VOICE-UI n'introduit **aucun token** — il référence `typography.label`, `typography.body`, `measure.reading-max`. Consolide le wording déjà écrit dans BUTTON-UX (§ Wording), INPUT-UX (§ Contenu du message) et ALERT-UX **sans en retirer l'autorité** : le composant garde son libellé, la fondation fournit la mécanique (même modèle que COLOR pour les valeurs).
- **Conséquence outillée à trancher (remontée, non tranchée d'office)** : `valide-dossier.js` vérifie la complétude des paires UX/UI ; une fondation délibérément UX-only (laws) est un cas qu'il ne connaît pas. Deux issues admises : (1) le script exempte les fichiers `type: foundation` déclarant `companion: none` ; (2) exception documentée. À confirmer au moment de recompiler `dist/`. Décision explicite : **ne pas** fabriquer un `LAWS-UI.md` factice pour satisfaire le script — ce serait une valeur sans besoin réel (guardrail COLOR/Occam).
- **Pourquoi** : `laws` rend lisible la théorie derrière les règles existantes (résorbe la « déduction silencieuse » conceptuelle : une règle fondée sur une loi qu'on ne nomme pas) ; `voice` fournit le socle des canaux redondants — quand COLOR/MOTION/ICONOGRAPHY disent « jamais ce canal seul », le canal de repli qu'ils invoquent tous est le mot. Inventaire + benchmark faits **avant** livraison pour les deux (leçon typographie) ; ratios de trous conformes à la série (laws 3/27, voice 6/38). Nouveau constat de méthode : sur `voice`, le prédicteur « état transitoire » s'applique enfin *littéralement* (ton d'attente, de résolution, message qui en remplace un autre) — écrit d'office ; sur `laws`, il ne s'applique pas (aucun état), le trou-type devient « la loi connue mais non reliée ».

## 2026-07-12 — LAWS reclassée « référence humaine » : hors de la couche IA, gardée sur le site

- **Fichiers** : foundations/laws/LAWS-UX.md 1.1.0 (`audience: humans`), dist/RULES-laws.md (supprimé → _to_delete/), tools/genere-site.js (badge « référence humaine » + warning RULES exempté pour `audience: humans`), DESIGN.md (index laws), documentation/ régénéré.
- **Ancienne règle** : laws était compilée comme les autres fondations — un `RULES-laws.md` dans `dist/`, indexé par le routeur (mais dans aucun bundle → seul sujet « orphelin »).
- **Nouvelle règle** : laws est une fondation **de référence humaine** — `audience: humans`, **non compilée vers `dist/`**. Plus de `RULES-laws`, absente du routeur, jamais chargée par une IA au build. Elle reste dans l'atelier et **sur le site** (page complète : cas, illustrations, décisions) pour la revue, la formation et l'argumentation.
- **Pourquoi** : laws ne pose **aucune contrainte que le build consomme** — de son propre aveu, ses 27 cas renvoient tous à une règle qui vit ailleurs (motion, color, spacing, button…). Son statut « orphelin » dans le routeur n'était pas un défaut à corriger mais le **symptôme** qu'elle n'a pas le métier des autres fondations : elle éclaire des décisions pour des humains, elle ne contraint pas une génération. La charger à chaque build alourdissait le contexte IA sans rien contraindre. La distinction `audience` est désormais une nature de fondation à part entière — une fondation « humaine » (théorie, éthique, mythes) vs une fondation « machine » (tokens, règles compilées). voice reste, elle, pleinement compilée (RULES-voice, bundles Formulaire/Feedback/Page de contenu) : elle contraint le wording réel.
- **Portée méthode** : nouveau champ de frontmatter `audience: humans`, reconnu par `genere-site.js` (pas d'avertissement « RULES manquant », badge « référence humaine — non chargée par l'IA » sur la page) et ignoré par `genere-routeur.js` (qui n'indexe que les `dist/RULES-*`). Une fondation sans ce champ reste compilée par défaut.

---

## 2026-07-14 — Site : couche éditoriale nommée (methode-contenu.js non normatif)

- **Fichiers** : SITE-CONCEPTION.md (§ Décision fondatrice), tools/methode-contenu.js (en-tête), documentation/ régénéré.
- **Ancienne règle** : « aucun contenu n'est écrit pour le site » (règle absolue) ; l'en-tête de methode-contenu.js prétendait que ce fichier était « une source de l'atelier, jamais écrite pour le site ».
- **Nouvelle règle** : deux niveaux explicites. (1) Sources normatives — `*-UX.md`, `*-UI.md`, `DESIGN.md`, `DECISIONS.md`, `inventaires/`, rapports — font autorité et sont rendues sans réécriture. (2) Couche éditoriale non normative — `methode-contenu.js`, `blog-articles.js` — qui reformule et relie des faits déjà tracés (champ `trace:`), sans créer de règle de design ni de preuve nouvelle ; en cas de divergence, la source de l'atelier a raison.
- **Pourquoi** : methode-contenu.js reformule de fait DECISIONS.md et METHODE.md pour le site — il contredisait donc la règle absolue. Nier ce statut (« jamais écrite pour le site ») était l'esquive ; le nommer honnêtement lève la contradiction sans introduire de norme non sourcée. Reste interdit : créer une règle ou une preuve pour le site.

## 2026-07-14 — Site : recalibrage des promesses publiques sur les capacités réelles

- **Fichiers** : tools/genere-site.js (pages Process, Vérification, Santé, Thèmes ; hero d'accueil), tools/methode-contenu.js, documentation/ régénéré.
- **Ancienne formulation** : « UX + UI testés à chaque build » ; « les seuils sont testés » ; « la preuve que l'identité se rebrande sans toucher au raisonnement » ; « Markdown structuré, versionné » ; page « Tests ».
- **Nouvelle formulation** : « tokens, combinaisons et contrastes vérifiés » (test-rendu.js ne lit pas les `*-UX.md` et n'est pas lancé par le build) ; « seuils de contraste vérifiés par l'outillage » ; « démonstration de re-thématisation / vérification de la séparation valeurs d'identité ↔ règles communes » (les thèmes ne prouvent pas un rebrand complet sans toucher au raisonnement : PaperFlow hérite de la couche sémantique et échoue encore sur 2 paires de contraste) ; « Markdown structuré, sourcé et journalisé (DECISIONS.md) » ; page renommée « Vérification ».
- **Pourquoi** : le site annonçait des capacités que les scripts n'ont pas (UX jamais testé, rien d'automatique au build) et exposait une contradiction visible — « versionné » en accueil vs « pas de dépôt git » en page Santé (le dossier n'est pas un dépôt git ; aucun `git init` n'a été fait). « Testé » réservé au seul contrôle automatique réel (contrastes). Au passage, ordre de Process revu : le jugement (« Comment je décide ») placé avant le déroulé de production.

## 2026-07-14 — atmosphere.* reclassé : vocabulaire décoratif du site, hors du corpus distribué

- **Fichiers** : DESIGN.md 1.14.0 → 1.15.0 (groupe `atmosphere.*` retiré du frontmatter), documentation/ régénéré.
- **Ancienne règle** : `atmosphere.*` (wash/veil/glow/ring/shadow-tint) déclaré comme fondation « atmospnère » dans DESIGN.md, avec une future fondation `EFFECTS-UX.md` annoncée.
- **Nouvelle règle** : `atmosphere.*` est retiré du frontmatter normatif. Ces intensités d'effets d'ambiance sont un **vocabulaire décoratif propre au chrome du site** : non exportées vers `generated/tokens.css`, `dist/tokens.yaml` ni l'export Figma, et **aucun composant, pattern ou fondation ne les consomme**. La référence à une future fondation `EFFECTS-UX.md` est retirée.
- **Pourquoi** : le groupe était né des effets décoratifs du site et de la démonstration PaperFlow, sans consommateur produit réel ni chaîne d'export — le déclarer « fondation » sur-vendait le corpus distribué et laissait un renvoi cassé (`EFFECTS-UX.md`) que la validation signalait. Il redeviendra une fondation le jour où un composant réel l'exigera, avec une vraie chaîne (CSS, YAML, Figma, validation, test, doc).

## 2026-07-14 — Contrat des niveaux de confiance recalibré

- **Fichiers** : README.md, METHODE.md 1.1.0 → 1.2.0, tools/methode-contenu.js, tools/blog-articles.js, documentation/ régénéré.
- **Ancien discours** : « chaque affirmation non triviale porte un niveau de confiance explicite ».
- **Constat** : faux à la lettre — ~46 lignes CONFIANCE pour ~518 RÈGLE (≈ 9 %). La confiance vit à trois niveaux (ligne inline ciblée, tableau de sources par fiche, clause de mécanisme par défaut) et n'est vérifiée par aucun script.
- **Nouvelle formulation** : les arbitrages structurants, divergents ou fragiles portent une confiance explicite ; le reste hérite du tableau de sources de sa fiche ou d'un raisonnement de mécanisme déclaré ; la couverture règle par règle n'est pas encore outillée.
- **Dette ouverte** : identifiants stables par règle + contrôle mécanique de couverture source/confiance dans `valide-dossier.js`.

## 2026-07-14 — Accessibilité : premier inventaire transversal « modalités et capacités »

- **Fichiers** : inventaires/inventaire-cas-usage-accessibilite.md (créé), METHODE.md 1.2.0 → 1.3.0, README.md.
- **Ancien état** : l'accessibilité était répartie dans les sujets — contrastes et daltonisme (color/iconography), clavier et focus (button/card/form/border), lecteur d'écran et annonces (typography/input/alert/form), troubles vestibulaires (motion), cognition (voice/form/laws). Chaque inventaire la vérifiait localement, mais aucun ne pouvait montrer les canaux absents du corpus entier. La fondation `voice` pouvait en outre être lue à tort comme une couverture de la commande vocale alors qu'elle ne traite que la voix éditoriale.
- **Nouvelle règle de méthode** : deux portées d'inventaire. L'inventaire de sujet reste la checklist d'un propriétaire ; l'inventaire transversal audite une contrainte distribuée, nomme le propriétaire de chaque règle et distingue **couvert / partiel / absent / en attente**. Il n'est ni une fondation `accessibility`, ni une règle consommée par le build : les trous se comblent dans BUTTON, FORM, MOTION ou le futur composant concerné, puis l'audit est recalculé.
- **Constat initial** : quatre noyaux réellement couverts (contraste/redondance visuelle, sémantique/annonces, focus des consommateurs actuels, reduced-motion) ; angles morts structurants sur audio/médias, commande vocale, motricité au-delà des cibles, gestes/drag, modalités concurrentes, flash et tests avec technologies d'assistance réelles.
- **Pourquoi** : une somme de règles accessibles par composant ne prouve pas une couverture des capacités humaines. Le clavier était visible parce que plusieurs composants l'exercent ; le son restait invisible précisément parce qu'aucun consommateur n'en a encore. L'audit transversal rend les deux situations distinguables sans fabriquer prématurément une fondation orpheline.

## 2026-07-14 — Resynchronisation éditoriale/technique : sources, site et outils racontent la même histoire

- **Fichiers** : README.md, METHODE.md → 1.4.0, SITE-CONCEPTION.md 1.6.0 → 1.7.0, DESIGN.md, tools/genere-site.js, tools/blog-articles.js, tools/build.js, tools/README.md, documentation/ régénéré.
- **Rebranding — formulation recalibrée partout** : l'ancien absolu (« DESIGN.md, seul fichier à remplacer » / « un rebranding est un bloc à remplacer ») est remplacé par : DESIGN.md centralise les valeurs visuelles tokenisées ; une re-thématisation de ces valeurs se fait sans toucher aux règles UX, mais un changement d'identité plus large peut demander des décisions d'iconographie, de voix, de composition ou de forme qui dépassent les tokens. Le thème externe PaperFlow reste une démonstration de re-thématisation (2 paires de contraste encore hors seuil), pas la preuve d'un rebranding complet.
- **Honnêteté des verbes** : le hero et le schéma « avant/après » passent de « testé » à « vérifiable/vérifié » ; ce qui est réellement vérifié mécaniquement = structure, existence et résolution des tokens, contrastes déclarés, graphe de routage, liens/ancres/ids du site — jamais le comportement UX/navigateur.
- **Onglets accessibles étendus aux pages sujet** : le motif APG Tabs (rôles ARIA, roving tabindex, flèches/Début/Fin/Entrée/Espace, hash, repli sans-JS) déjà posé sur Process et Vérification est désormais appliqué aussi aux pages sujet, sans casser le rail contextuel (scroll-spy) ni les liens profonds. L'ancre du 1er volet sujet passe de #decider à #essentiel (cohérence libellé/ancre).
- **Build unique** : `tools/build.js` enchaîne tokens → validation → rendu → routeur → site → contrôle liens/ancres/ids, et devient le chemin recommandé (README, METHODE, tools/README). Le contrôle de sortie détecte en plus les identifiants HTML dupliqués et les fichiers locaux (`href`/`src`) manquants — ce n'est pas une validation HTML complète.
- **Prochaine étape** : le pilote externe (usage par une personne ou un agent qui n'a pas participé à la conception), pas un nouveau composant.
- **Pourquoi** : « les preuves techniques, les textes publics et le fonctionnement réel doivent raconter exactement la même histoire » — cette passe supprime les derniers écarts entre ce que le site promet et ce que l'outillage garantit.

## 2026-07-14 — Accessibilité : fondation transversale `accessibility` (UX-only, compilée, socle universel) + règles chez leurs propriétaires

- **Fichiers** : foundations/accessibility/ACCESSIBILITY-UX.md (créé), dist/RULES-accessibility.md (créé), MOTION-UX.md 1.0.0→1.1.0, BORDER-UX.md 1.0.0→1.1.0, BUTTON-UX.md 1.3.2→1.4.0, CARD-UX.md 1.1.2→1.2.0, FORM-UX.md 2.0.0→2.1.0, ALERT-UX.md 1.2.0→1.3.0, INPUT-UX.md 1.4.0→1.5.0, dist/RULES-{motion,border,button,card,form,alert,input}, tools/genere-routeur.js, tools/genere-site.js, DESIGN.md 1.15.0→1.16.0, README.md, METHODE.md 1.4.0→1.5.0, inventaires/inventaire-cas-usage-accessibilite.md.
- **Ancien état** : l'inventaire transversal du 2026-07-14 (entrée précédente) avait cartographié l'accessibilité et refusé de fabriquer une fondation orpheline — les trous devaient se combler chez leur propriétaire. Il laissait cinq trous **P1** (modalités concurrentes, focus complet, pointer/motricité, flash, canaux sensoriels) sans contrat consommable par le build, et signalait un risque de lecture : la fondation VOICE pouvait passer pour une couverture de la commande vocale.
- **Nouvelle règle — architecture hybride** : (1) une fondation `accessibility` **UX-only** (`companion: none`, aucun token, aucune valeur visuelle) pose les **obligations universelles** (clavier ; modalités concurrentes non bloquées ; focus visible/ordonné/non piégé/non masqué ; nom accessible = libellé visible ; jamais un seul canal ; alternative aux gestes complexes et au glisser-déposer ; limites de temps contrôlables ; aucun flash dangereux) et **renvoie aux propriétaires** — elle ne duplique jamais COLOR/BORDER/MOTION/ICONOGRAPHY/VOICE. (2) Chaque règle *propre* est placée chez son vrai propriétaire : **MOTION** (flash 2.3.1), **BORDER** (focus non masqué 2.4.11), **BUTTON** (annulation du pointeur 2.5.2 + haptique jamais indispensable), **CARD** (alternative au glisser-déposer 2.5.7), **FORM** (limites de temps 2.2.1), **ALERT** (signal sonore toujours doublé du texte, 1.4.1), **INPUT** (dictée + label in name 2.5.3). **Aucune section « accessibilité » générique recopiée** dans chaque fichier — seulement la règle qui décrit le comportement propre du sujet.
- **Précédent nouveau** : `companion: none` **sans** `audience: humans`. Contrairement à `laws` (référence humaine, non compilée), `accessibility` **est compilée** vers `dist/RULES-accessibility.md` et **intégrée au socle du routeur** (constante `SOCLE_FONDATIONS` dans genere-routeur.js), donc chargée d'office pour **toute** intention. valide-dossier.js reconnaissait déjà le cas UX-only ; genere-routeur.js a reçu la notion de socle universel (poids mesuré, sujet non-orphelin) ; genere-site.js l'expose comme une fondation à part entière.
- **VOICE recadrée explicitement** : VOICE = voix **éditoriale**, jamais commande **vocale**. L'obligation « service utilisable sans parler / nom adressable à la voix » relève de l'interaction (clavier + nom accessible chez INPUT), pas de VOICE. Écrit noir sur blanc dans ACCESSIBILITY-UX et RULES-accessibility.
- **Chargement minimal préservé, poids mesuré** : le socle passe de « routeur + tokens.yaml » à « + RULES-accessibility » (~1,3 k). Chaque bundle augmente uniformément de ~1,3 k — Formulaire ~25,1 k, Collection ~18,4 k, Page de contenu ~11,4 k, Feedback ~13,7 k (cf. tools/RAPPORT-ROUTEUR.md). `accessibility` a `requires: []` (n'entraîne aucune fondation dans la fermeture) et `selon-contexte: [color, border, motion, iconography, voice]` (renvois, non chargés d'office).
- **En attente (inchangé)** : sous-titres, transcriptions, audiodescriptions, reconnaissance vocale complète — aucun composant audio/vidéo ne les exerce ; position à prendre avant d'en créer un. Dette **P3** : aucun test réel (clavier, lecteur d'écran, dictée, tactile imprécis, zoom/reflow) sur écran assemblé — la couverture est **documentaire, pas éprouvée**.
- **Pourquoi** : une somme de règles par composant ne prouve pas une couverture des capacités, et une section accessibilité recopiée partout diverge dès la première évolution. Un contrat unique chargé partout + un renvoi vers le propriétaire réel : la règle ne vit qu'à un seul endroit, et le build la consomme réellement.

## 2026-07-14 — Stabilisation après audit : trois lots séparés et références WCAG rectifiées

- **Fichiers** : `foundations/accessibility/ACCESSIBILITY-UX.md` 1.0.0→1.0.1, `patterns/form/FORM-UX.md` 2.1.0→2.1.1, inventaires accessibilité/form, `DESIGN.md`, `README.md`, `INSTALLATION.md` 1.3.0→1.4.0, `PLAN-EVOLUTION.md`, `.gitignore`, `.github/workflows/build.yml`, `pousser-vers-github.sh` (supprimé), puis sorties générées.
- **Découpage** : les modifications locales sont désormais relues comme trois lots indépendants — (1) stabilisation documentaire et build, (2) changement produit Accessibilité, (3) industrialisation CI/déterminisme/distribution. Ce découpage n'est ni un commit ni une publication ; il empêche de faire passer une extension d'architecture pour une simple correction éditoriale.
- **WCAG — corrections factuelles** : le critère 2.5.6 est identifié comme **AAA** ; l'ordre de focus doit préserver sens et opérabilité sans reproduire nécessairement l'ordre visuel ; les options et exceptions de 2.2.1 sont explicitées ; la redondance mouvement/son/haptique est assumée comme règle interne renforcée et non attribuée abusivement à 1.4.2 ; le minimum AA 2.5.8 est ajouté, le standard interne de 44px restant plus exigeant.
- **Plan** : le diagnostic antérieur (v1.15.0, 10 fondations, absence de CI et de `SKILL.md`) est conservé comme état initial, mais n'est plus présenté comme l'état courant. Le statut actuel indique v1.16.0, 11 fondations et J1 implémenté localement mais encore inactif à distance.
- **Dépôt** : les `_to_delete/` imbriqués et l'archive d'export restent hors versionnement. Le script ponctuel `pousser-vers-github.sh` est supprimé : il recréait le `.gitignore`, gérait lui-même un jeton et réalisait commit/push dans une seule commande ; le flux standard Git/SSH et une publication volontaire le remplacent. Aucun commit ni push n'est déclenché par cette décision.
- **Sécurité** : le remote local actuel est en SSH et sans identifiant intégré. Cela ne prouve pas la révocation d'un éventuel ancien jeton, qui reste à confirmer côté GitHub.

## 2026-07-14 — Site : les trois cartes deviennent le motif commun de toutes les vues « L’essentiel »

- **Fichiers** : `tools/genere-site.js`, `SITE-CONCEPTION.md` 1.7.0→1.8.0, `documentation/` régénéré.
- **Ancien état** : le motif visuel numéroté en trois cartes (accent primaire, accent et succès) n'existait que dans la vue essentielle de « Pourquoi ce projet ». Les fiches sujet présentaient leurs trois règles fondamentales comme une liste de lignes ; Process et Vérification n'avaient pas cette synthèse visuelle.
- **Nouvelle règle de surface** : toute vue nommée **« L'essentiel »** commence par le manifeste, puis présente trois décisions structurantes avec le même motif de cartes. Le composant de génération est factorisé ; le contenu reste propre à chaque page. Les 16 fiches sujet reprennent leurs trois règles éditoriales existantes, Process synthétise inventaire/contradiction/trace, Vérification structure/rendu/limite.
- **Responsive** : trois colonnes sur grand écran, une colonne sous 900px, sans transformer les cartes en éléments interactifs — ce sont des résumés sémantiques en `<article>`.
- **Pourquoi** : une même promesse de lecture doit produire le même repère visuel. Le lecteur reconnaît immédiatement la synthèse, sans uniformiser le fond ni inventer de nouvelles règles normatives.

## 2026-07-14 — Site : format « Quand / Que faire / Exemple » garanti pour tous les cas d’usage

- **Fichiers** : `tools/genere-site.js`, `tools/build.js`, `SITE-CONCEPTION.md` 1.8.0→1.8.1, `documentation/` régénéré.
- **Constat** : 76 cas d'Accessibilité, un cas de Bordure et un cas d'Espacement reposaient encore sur la colonne brute de leur inventaire. Leur carte n'affichait pas le repère « Quand » et leur modale ne contenait pas systématiquement les trois blocs éditoriaux visibles sur Typographie.
- **Nouvelle règle de surface** : chaque carte contient titre + repère **Quand** + situation + action. Chaque modale contient, dans cet ordre, **Quand utiliser cette règle ?**, **Que faire ?**, **Exemple**, puis les règles liées. Les textes éditorialisés à la main restent prioritaires ; un repli complet et honnête est généré depuis l'inventaire pour tout nouveau cas encore non éditorialisé.
- **Garantie mécanique** : le contrôle final du build compte cartes et modales, exige le repère « Quand » sur chaque carte et les trois titres dans chaque gabarit. Une régression devient bloquante au lieu de rester visuelle et silencieuse.
- **Pourquoi** : le statut de couverture peut varier, mais la qualité de lecture ne doit pas dépendre de l'ancienneté d'une fiche. Accessibilité suit désormais exactement le même contrat que les autres sujets.

## 2026-07-14 — Site : huit illustrations distinctes pour les familles Accessibility

- **Fichiers** : `tools/genere-site.js`, `SITE-CONCEPTION.md` 1.8.1→1.8.2, `documentation/` régénéré.
- **Constat** : les huit familles de l’inventaire Accessibility retombaient sur deux illustrations génériques, « catégories » et « contenu ». Le titre changeait, mais le visuel ne portait pas la capacité auditée.
- **Nouvelle règle de surface** : perception visuelle, navigation clavier, technologies d’assistance, capacités motrices, audition, parole, cognition et mouvement disposent chacune d’un SVG dédié, dessiné avec les tokens du site.
- **Garantie mécanique** : le build compare les SVG des familles Accessibility et échoue si deux sections partagent à nouveau la même illustration.
- **Pourquoi** : cette page est une cartographie transversale des capacités. Répéter une vignette de mise en page effaçait précisément la différence que l’inventaire cherche à rendre visible.

## 2026-07-14 — Accueil : le hero met en avant le raisonnement compilé et l’arbitrage humain

- **Fichiers** : `tools/genere-site.js`, `SITE-CONCEPTION.md` 1.8.2→1.8.3, `documentation/` régénéré.
- **Ancien message** : « une documentation UX/UI que les humains lisent et que les IA consomment », structurée en deux couches par composant, avec Button comme seconde porte d’entrée.
- **Constat** : le projet couvre désormais composants, pattern, fondations et contrat Accessibility UX-only. Sa différence n’est plus la simple lisibilité du Markdown, mais la compilation du raisonnement en contexte ciblé, avec autorité, périmètre et arrêt explicites.
- **Nouveau message** : cas d’usage, règles, tokens et décisions deviennent des règles légères chargées selon l’intention ; l’IA applique ce qui est couvert et rend les absences, contradictions et arbitrages à l’humain. Le CTA secondaire conduit à la méthode, vrai livrable stratégique, plutôt qu’au seul pilote Button.
- **Pourquoi** : le hero doit présenter la capacité actuelle sans conserver les simplifications de la phase pilote ni promettre une conformité intégrale encore non éprouvée par un tiers.

## 2026-07-14 — Dépôt : séparation stricte entre atelier, contenus, documentation, prototypes et sorties

- **Fichiers** : arborescence complète, `README.md`, `docs/architecture/REPOSITORY.md`, `atelier/core/METHODE.md` 1.5.0→1.6.0, `docs/architecture/SITE.md` 1.8.3→1.9.0, outils, workflow CI et sorties régénérées.
- **Ancien état** : sources normatives, plans, prototypes HTML, assets et trois familles de sorties partageaient la racine. `_sync/` dupliquait quinze fichiers — dont deux versions périmées — et deux dossiers `_to_delete/` conservaient des sauvegardes et générateurs obsolètes.
- **Nouvelle structure** : `atelier/` contient toutes les sources de connaissance ; `content/` les assets originaux ; `docs/` l'architecture, l'installation, la roadmap et les archives ; `prototypes/` les explorations hors build ; `dist/` le paquet IA ; `public/` le site généré. Dans `public/`, les pages système, sujets, articles, téléchargements et fichiers machine sont séparés. `tokens.css` rejoint `dist/` et les rapports rejoignent `tools/reports/`.
- **Nettoyage** : `_sync/`, les deux dossiers `_to_delete/` et les fichiers `.DS_Store` sont retirés. Le plan initial est conservé explicitement dans `docs/archive/` au lieu de rivaliser avec la roadmap active.
- **Pourquoi** : la séparation source/sortie existait dans le fonctionnement mais pas dans la topologie. Une racine ambiguë permettait d'éditer la mauvaise copie et rendait la chaîne difficile à expliquer. Le nouveau contrat rend visible l'autorité de chaque zone sans modifier les règles UX/UI.

## 2026-07-14 — Flow « création de compte » : inventaire recalibré en statuts francs + complétion des sections de parcours

- **Fichiers** : atelier/flows/creation-compte/CREATION-COMPTE-UX.md (1.0.0 → 1.1.0), atelier/inventaires/inventaire-cas-usage-creation-compte.md, dist/RULES-creation-compte.md (v1.1.0).
- **Constat** : la première version de l'inventaire marquait ses 10 cas « Couvert » sans exception — incompatible avec l'honnêteté de couverture du projet et avec la fonction même d'un inventaire (rendre les trous visibles). La fiche couvrait la décision (méthode, minimum viable, vérification, atterrissage) mais pas les briques proprement « flow » (temporelles).
- **Décision** : (1) inventaire réécrit avec statuts explicites `Couvert / Partiel / Absent / En attente` + propriétaire (~30 cas), séparant le socle, les cas partagés avec un propriétaire hors DS (serveur, contenu d'e-mail) et les cas `En attente` qui relèvent d'une décision produit / juridique / sécurité (âge minimum, création partielle, suppression après erreur, step-up de fraude, i18n / RTL) — le flow nomme la frontière, ne la tranche pas. (2) Ajout de six sections de parcours à la fiche : préconditions et points d'entrée, machine à états **du parcours** (distincte de la machine de soumission d'un écran, qui appartient à `form`), états transitoires, abandon et réentrée, accessibilité **inter-écrans** (focus au changement d'écran, annonce de progression — WCAG 2.4.3 / 4.1.3), instrumentation (des repères, jamais des règles). (3) RULES synchronisée en versions condensées.
- **Pourquoi** : ces briques temporelles distinguent un flow d'un pattern — c'est le cœur de la valeur de la nature Flow, et c'était la zone la plus mince. Un inventaire honnête est aussi la condition pour que la future confrontation au crawl Mobbin ait du sens.
- **Arbitrages ouverts avant l'audit Mobbin** : slug `creation-compte` (FR) vs `creating-account` (spec initiale) non tranché ; les cas `En attente` restent hors périmètre DS ; les cartes du site n'ont pas été étendues aux nouveaux cas d'inventaire (page existante inchangée). Aucune observation Mobbin anticipée.

## 2026-07-17 — Passe « stress-test » : neuf remontées d'un rebranding double (dont un thème sombre) intégrées

- **Fichiers** : `atelier/core/DESIGN.md` (1.19.0 → 1.20.0, token `radius.lg`), `foundations/color/COLOR-UX.md` (→ 1.1.0) + `COLOR-UI.md` (→ 1.0.1), `radius/RADIUS-UX.md` + `RADIUS-UI.md` (→ 1.1.0), `elevation/ELEVATION-UX.md` + `ELEVATION-UI.md` (→ 1.1.0), `motion/MOTION-UX.md` (→ 1.2.0), `voice/VOICE-UX.md` (→ 1.1.0), `components/card/CARD-UI.md` + `alert/ALERT-UI.md` (→ radius.lg), `tools/genere-tokens.js` (copie de theme-gate.mjs + guardrail), `dist/` régénéré.
- **Origine** : rapport de stress-test du 2026-07-17 — un parcours de création de compte construit puis rebrandé deux fois à partir de maquettes marketing externes (WanderLuxe, Nexus UI), dont un thème sombre. Neuf manques relevés, tous non bloquants ; les chiffres du rapport (contrastes, teinte, voile) revérifiés de zéro avant intégration.
- **Décisions** :
  1. **Règle dérivée dark mode** (haute) : la table des paires suppose implicitement un thème clair. `surface-contrast` doit porter `background` ET `on-primary` à 4.5:1 ; en sombre, cela force `primary` clair (un primary sombre est démontré insatisfiable — aucun neutre représentable ne tient 4.5:1 à la fois avec un quasi-noir et un blanc). Ajoutée en dérivée, pas en préférence.
  2. **Outil de vérif livré** (haute) : le garde-fou « re-vérifier par test-rendu.js » n'était pas exécutable côté consommateur (dist/ ne contient pas tools/). `theme-gate.mjs` (mêmes seuils) est désormais **copié dans dist/ par le build** (son en-tête l'annonçait sans que ce soit fait) ; le garde-fou distingue mainteneur (test-rendu) et consommateur (theme-gate).
  3. **Élévation dépendante du thème** (haute) : `elevation.*` encode une ombre pour fond clair, invisible en sombre — déclaré valeur à re-thématiser, pas constante.
  4. **Cran conteneur `radius.lg` (12px)** (moyenne) : sépare le rayon des conteneurs (card, alert, désormais en `lg`) de celui des contrôles (bouton/input en sm/md). Rend exprimable l'intention « carte 16 / contrôle 8 » d'une source externe.
  5. **Contradiction pill tranchée** (moyenne) : `radius.pill` réservé aux badges/avatars (forme intrinsèquement pilule) ; un contrôle mono-ligne (bouton, input) ne prend jamais pill.
  6. **Contrainte ≠ parti pris** (moyenne) : dans motion et voice, le registre « productif seulement » est marqué comme parti pris d'identité **paramétrable** par un consommateur qui l'assume, distinct des contraintes WCAG non négociables — le système encadre la dérogation au lieu de la forcer.
  7. **Teinte des neutres à luminance constante** (basse) : méthode bénie (OKLCh + recalage de L) — le contraste ne dépendant que de la luminance, teinter à luminance constante ne déplace aucun rapport.
  8. **Méthode de voile sur image** (basse) : le voile est un calcul (échantillonner le pire pixel, calculer l'alpha pour 4.5:1, revérifier à plusieurs formats), pas un réglage à l'œil.
  9. **Slot de marque additionnel refusé** (basse) : les identités multi-teintes décoratives sortent du périmètre — un token naît d'un besoin réel, pas d'une couleur à caser. Le registre marque reste à trois rôles.
- **Pourquoi** : le test a montré que l'architecture par rôles tient un rebranding double sans code conditionnel (surface-contrast s'inverse seule en sombre). Les manques étaient concentrés sur l'outillage et sur des angles morts que seul un thème sombre révèle. Intégrer les dérivées (dark mode, élévation) évite à chaque futur consommateur de les redécouvrir par l'échec.
- **Arbitrages assumés** : `radius.lg` change la courbure rendue des cartes/alertes (8 → 12 px) — décision d'identité tranchée ici, trivialement réversible (valeur du token). Le dark mode reste non implémenté (décision produit non prise) ; seule sa contrainte dérivée est documentée.

## 2026-07-23 — Le relief entre dans la fondation élévation : grammaire posé / creusé / plat (registre d'identité débrayable)

- **Fichiers** : `foundations/elevation/ELEVATION-UX.md` (1.1.0 → 2.0.0) + `ELEVATION-UI.md` (1.1.0 → 2.0.0), `dist/RULES-elevation.md` (condensation mise à jour). DESIGN.md inchangé — aucune valeur nouvelle (dérivations par mélange des tokens de tone) ; `elevation.pressed` noté candidat, non créé.
- **Origine** : direction utilisateur (« on a perdu avec le flat la notion d'objet visuel ») + maquettes Figma Sibyl (nœuds 86:129, 128:136) + journée d'implémentation dans l'atelier DS-UI (2026-07-23) où la grammaire a été éprouvée composant par composant, en clair et en sombre, avant d'être remontée ici. Trajectoire inverse de la méthode habituelle — l'implémentation de référence a précédé la doctrine — assumée et datée.
- **Décisions** :
  1. **Grammaire à trois natures** (haute) : à la création de tout composant, chaque surface est classée **posé** (objet actionnable ou couche flottante : boutons, toast), **creusé** (réceptacle : input) ou **plat** (contenu : alert, texte, statique). Le relief suit la fonction, jamais la décoration — le test des 5 questions d'INTERACTION-UX reste le juge.
  2. **« Le repos est à plat » devient la règle des SURFACES** (haute) : les contrôles (objets) gagnent un relief de repos ; les surfaces (card, panels) ne l'obtiennent qu'au survol cliquable (doctrine 1.x conservée pour elles). C'est la ligne qui empêche la grammaire de dégénérer en skeuomorphisme : si tout est posé, rien n'est pressable.
  3. **Physique commune** (haute) : lumière du haut (liseré dégradé clair en haut → couleur de l'objet en bas, jamais un anneau uniforme) ; survol = soulevé (overlay + fond ÉCLAIRCI — inverse de la convention state-layer du registre plat, la métaphore prime) ; appui = enfoncé (ombre interne + fond assombri + course 0,5 px). En sombre : mêmes directions, enfoncé dérivé vers le noir — jamais via le token de survol qui s'éclaircit en sombre (bug de physique documenté : l'objet monterait à l'appui).
  4. **Statut de frontière : parti pris d'identité, paramétrable** (haute) : le registre Relief est débrayable (réglage de thème dans l'implémentation de référence) ; le registre plat 1.x reste documenté et valide. En audit d'hôte, l'absence de relief n'est jamais une non-conformité.
  5. **Aucun niveau d'ombre ajouté** (moyenne) : le relief compose `none/raised/overlay` avec l'arête (border) et le liseré ; l'ombre interne d'enfoncement est un état, pas un palier.
  6. **Techniques imposées** (moyenne) : liseré = anneau 1 px par pseudo + mask-composite (un box-shadow ne dégrade pas) ; swaps d'ombre instantanés (jamais de box-shadow interpolé, MOTION-UI) ; composants sans bordure structurelle : arête en inset shadow, métrique de crans intacte.
- **Pourquoi** : la perte des signifiants du flat est un coût d'utilisabilité documenté (NN/g : les éléments plats attirent moins l'attention et créent de l'incertitude sur le cliquable) ; la grammaire rend au produit trois natures perceptibles avant lecture (Norman) sans rouvrir la porte à l'ombre décorative — le registre est borné (objets seulement), débrayable, et l'ancienne doctrine reste le socle des surfaces.
- **Arbitrages assumés** : le survol qui ÉCLAIRCIT contredit la convention state-layer du registre plat — divergence de registre, documentée comme telle. Deux dérogations connexes actées le même jour côté DS-UI, à remonter à leurs propriétaires lors d'une prochaine passe : indicateurs partagés de collection animant leur géométrie (MOTION — highlight glissant) et icônes multicolores d'identité dans les chips de card (ICONOGRAPHY — écart à currentColor). Les tests utilisateurs de la promesse (reconnaissance plus rapide des rôles) restent à faire.

## 2026-07-29 — Le mode d'interaction quitte Card : axe transversal du langage Interaction + couche partagée `ds-interactive`

- **Fichiers** : `languages/INTERACTION-UX.md` (1.1.0 → 1.2.0, R26–R28) + `INTERACTION-UI.md` (1.1.0 → 1.2.0, U09–U11), `packages/react/src/lib/interaction.ts` + `interaction.css` (nouvelle couche partagée), `components/card/card.tsx` + `card.css` (Card devient consommateur — relief et lien étendu déménagés), règles recompilées.
- **Origine** : question d'Aurélien devant le Playground de Card (2026-07-29) — « Mode ne devrait pas s'appliquer à tout type de surface de ce style ? Pas une interaction destinée uniquement à ces cards-là. » Constat validé : static/clickable/selectable/expandable décrit ce que promet toute surface-conteneur (ligne de liste, tuile, StatCard), pas une propriété de Card ; la doctrine le suggérait déjà (CARD-UX présentait `mode` comme l'axe interaction_mode du langage Interaction, Card en était simplement l'unique consommateur).
- **Décisions** :
  1. **Promotion de l'axe** (haute) : `interaction_mode` devient un axe transversal du langage Interaction (R26). Card n'en est plus propriétaire mais premier consommateur et implémentation de référence.
  2. **Garde-fou anti-dilution** (haute) : le mode appartient aux surfaces-conteneurs, jamais aux contrôles (R27) — un contrôle EST son intention. Si tout devient clickable, le relief redevient du décor : le signal n'est lisible que parce qu'il est rare (même logique que la décision elevation du 2026-07-23, « si tout est posé, rien n'est pressable »).
  3. **Mêmes signaux partout** (haute) : un même mode se reconnaît aux mêmes signaux sur toute surface (R28) — cible réelle + relief hover/focus pour clickable, état non chromatique pour selectable, orientation d'indicateur pour expandable.
  4. **Extraction minimale, pas de composant `Surface`** (moyenne) : couche partagée CSS + helper (`.ds-interactive`, `.ds-interactive-target`, curseurs par mode — U09–U11), PAS de composant générique tant qu'un deuxième consommateur réel ne l'exige pas. Abstraire sur un seul cas figerait la mauvaise API ; StatCard (@sibyl/charts) est le candidat naturel du deuxième pas.
- **Pourquoi** : la duplication guettait — chaque future surface (liste, tuile) aurait réinventé curseur, relief et lien étendu avec des variations involontaires, exactement ce que R04/R24 (cohérence d'identification) interdisent. Remonter l'axe au langage rend la règle vérifiable une fois pour toutes et donne à l'audit un critère transversal (« cette surface déclare-t-elle son mode ? ») au lieu d'un critère par composant.
- **Arbitrages ouverts** : StatCard et CardGroup (`.cg-card`, mécanique propre) pas encore migrés vers la couche partagée ; CARD-UX/CARD-UI à mettre à jour à la passe doctrine du lot 29/07 (renvoyer vers le langage au lieu de définir l'axe localement) ; le pattern « ligne de liste » n'existe pas encore — le jour venu, il naît consommateur de la couche, jamais avec sa propre mécanique.

## 2026-07-29 — Refonte couleur 1.33.0 : secondary devient une marque, neutral devient une famille, la règle des 30° est posée

- **Fichiers** : `core/DESIGN.md` (1.32.0 → 1.33.0 — autorité des valeurs), `packages/tokens/src/tokens.source.mjs` (gammes teal/sky/fuchsia, blue/cyan retirées, familles secondary/neutral, renommage primary-subtle), `ds-md.map.mjs`, `build/validate-contrast.mjs` (58 → 72 paires), codemod `secondary → primary-subtle` sur tout le code, `toast.tsx` (tone reverse → neutral), fondation Couleur du site.
- **Origine** : lecture de la table Couleur par Aurélien (2026-07-29) — trois constats : « secondary est censé être une couleur de plus (branding) », « reverse devrait avoir le même traitement », « primary et info ne sont pas assez différents » (mesuré : Δ12,6° OKLCh). Candidats arbitrés sur comparateur visuel (roue OKLCh + contrastes calculés).
- **Décisions** :
  1. **`secondary` = 2e couleur de marque** (haute) : teal-700 #0F766E, famille complète (hover, subtle, subtle-hover, on-), à 91° de primary. L'ex-secondary (lavis indigo) est renommé **`primary-subtle`** — la convention {nom}-subtle s'applique enfin à primary, l'anomalie de nommage disparaît.
  2. **La famille `neutral`** (haute) : la langue des tones du Button (primary/neutral/destructive) s'applique aux couleurs — « reverse » décrivait un traitement, pas une sémantique. Solide = l'inverse haute-contraste (le neutral-strong que l'autorité nommait déjà), subtil = surface/surface-hover (zéro doublon), contour = border-strong. Le tone Toast `reverse` est renommé `neutral` ; plus aucun rôle nommé reverse.
  3. **Règle de différenciation des teintes** (haute) : ≥ 30° OKLCh entre rôles cohabitants, sauf séparation nette sur un autre axe (Δchroma ≥ 0,08 / Δclarté ≥ 0,15) documentée. Application immédiate : `info` #1D4ED8 → #0369A1 (sky-700, le « bleu information » reste bleu mais s'écarte de primary), `accent` #0891B2 → #C026D3 (fuchsia-600, 4.71:1 — visible même sur fond primary). Dérogation documentée : danger↔warning (Δ18,7°, séparés par chroma/perception).
  4. **Le validateur suit** (moyenne) : secondary rejoint stateFamilies et les boucles subtle/hover ; paires accent (3:1) et neutral ajoutées — 72 paires, clair + sombre.
- **Pourquoi** : les noms doivent dire l'usage (danger, pas rouge ; neutral, pas inversé) et les teintes doivent être discernables sans lecture — c'est INTERACTION-R12 appliqué à la palette elle-même. La règle des 30° transforme un jugement d'œil en critère vérifiable, comme les paires de contraste avant elle.
- **Arbitrages ouverts** : la garde des 30° n'est pas encore MÉCANISÉE dans tokens:build (règle écrite dans DESIGN.md, vérifiée à la main ce jour — script candidat à côté de validate-contrast) ; les fiches COLOR-UX/UI ne connaissent ni secondary-marque ni la règle (passe doctrine du lot 29/07) ; la palette charts (--ch-cat-*, hexes en dur) n'est pas re-dérivée des nouveaux rôles ; surface-inverse/text-inverse restent des alias consommés par les classes existantes (migration douce vers neutral/on-neutral possible).

## 2026-07-29 — Chantier cohérence : le kit devient contractuel (Contract, manifeste, cascade de tokens, focus unique)

**Quatre arbitrages d'Aurélien, actés le même jour :**

1. **Focus : l'anneau UNIQUE de la fondation BORDER fait autorité** — outline `color.accent`, largeur/écart tokenisés, `:focus-visible`. Abroge l'anneau « accordé au ton » de BUTTON-UI 1.4.1 (le code citait une « 1.5.1 » qui ne correspondait à rien dans le changelog — décision mal journalisée, désormais résolue). La table de consommation de BORDER-UI, qui affirmait déjà que Button consommait `accent`, redevient vraie. Implémentation : rôles `control.focus-*` (étage 2) + `lib/focus.css` (`.ds-focus-ring`), consommés par Button, CompactButton, Input, ThemeToggle, CardGroup, DeleteButton, SubmitButton ; Alert/Toast alignés sur `outline-accent`. Les variables fantômes `--border-focus-width/offset` (card-group) sont corrigées.
2. **Le tone `warning` de Button est retiré de la doctrine** (BUTTON-UX 1.10.0, BUTTON-UI 1.7.0) — l'avertissement est un message (Alert/Badge), jamais une action ; le composant avait raison contre sa fiche. Les RULES cessent de proposer une API inexistante. R31/R32 abrogées, IDs conservés.
3. **`style` → `variant`** sur Button/CompactButton (Fili Component Contract 1.0.0) : `variant` est l'API canonique (le reste du kit le disait déjà), `style` reste un alias déprécié (variant l'emporte, avertissement en dev), retrait à la prochaine majeure de @fili/react — l'attribut DOM `style` redeviendra alors utilisable.
4. **Deux registres de tones assumés** : contrôles = intention (primary/neutral/destructive), messages = sémantique (info/success/warning/danger/neutral), avec table de correspondance destructive→danger dans le Contract. Pas d'unification forcée.

**Et le socle qui les rend mécaniques :**

- **Étages 2 et 3 des tokens enfin réels** (tokens.source.mjs `transversal` + `componentTokens`) : `control.*` (focus, radius, relief posé/pressé, ancres color-mix), `field.*` (bordure, creusé), `surface.radius`, `overlay.*` ; alias `button-radius`, `input-*`, `card-radius`. Valeurs = `var(--…)` : changer un rôle maître se propage mécaniquement (vérifié : rayon, focus, pressé). L'ombre pressée unique remplace les trois alphas divergents (relief 0.05 / submit 0.15 / delete 0.2) — normalisation assumée.
- **Manifeste machine-readable** (`packages/react/src/manifest/`, 27 entrées, `manifest.json` généré) : les axes sont vérifiés par tsc contre les unions réelles (`axe<U>()` — un manifeste qui ment ne compile pas). L'atelier dérive désormais ses options du manifeste (Button, CompactButton, Input) au lieu de les retaper.
- **Trois validateurs** : `verifie-tokens.mjs` (vars inconnues, palette par défaut, valeurs en dur — exceptions nommées et classées, périmètre strict = tranche pilote), `verifie-manifeste.mjs` (bijection composants↔manifeste, fraîcheur des RULES vs sources), `verifie-consommation.mjs` (natifs, @sibyl, div cliquables dans les apps — @sibyl toujours bloquant). Plus `verifie-exemples.mjs` : les exemples canoniques du manifeste compilent via le tsc du site.
- **Deux protocoles** : FILI-COMPONENT-CONTRACT.md (grammaire des axes) et MISSING-COMPONENT-PROTOCOL.md (réutiliser → composer → qualifier → proposer → valider → tranche verticale ; marqueur `FILI-MANQUE:` recensé par le validateur).
- **Migration close** : les derniers imports `@sibyl/*` actifs (registry de l'atelier) passent à `@fili/*` ; l'invariant est gardé par le validateur de consommation.

**Ce qui reste ouvert** (rapport du chantier) : propagation du Contract aux autres composants par vagues, doctrine Drawer/Dropdown/Skeleton/ThemeToggle/AppLayout à écrire, fiches INPUT (tone→status), TOAST (neutral), MODAL (wide) à rattraper — le code a raison, les fiches suivent ; card-group.css hors échelle d'espacement ; z-index 40/60 hors échelle ; exemples `code()` de l'atelier non encore compilés un à un.

## 2026-07-29 — Facture unique de la nav (Nav ← AppLayout ← sites) et relief étendu (Alert, CompactButton, Card)

**Nav devient le porteur unique de la facture de navigation** (remontée d'Aurélien : « le menu est bon dans la nav d'AppLayout, pas sur les sites »). `navRowClass` / `navGroupLabelClass` sont définis dans `nav/nav.tsx` et consommés par la nav intégrée d'AppLayout (qui les recopiait), par la nav Doctrine (`app/md/nav.tsx`, qui recopiait les classes de Nav.Link) et par la nav de l'atelier (`app/ui/atelier.tsx`, qui avait sa propre facture bg-surface/text-primary). `Nav.Link` gagne `asChild` (next/link, bouton de sélection) et `icon` ; `Nav.GroupLabel` porte la tête de groupe. Alignements visuels : rangée en rounded-md partout (Nav.Link était en rounded-sm), têtes de groupe en text-muted/tracking-wider partout, état courant = lavis primary-subtle partout (l'atelier disait bg-surface/text-primary).

**Le registre relief couvre ses absents** (remontée d'Aurélien) : CompactButton émet enfin `data-style`/`data-tone` (il restait plat sous [data-relief]) ; Alert est un objet POSÉ (`data-slot="alert"` : liseré haut via l'ancre `--control-mix-light` + `--control-raised-shadow`) ; une Card SÉLECTIONNÉE est posée en permanence ; le survol d'une Card selectable/expandable montre le relief — UNIQUEMENT sous [data-relief] (hors relief, le signal de survol reste réservé au clickable, conformément au langage Interaction). `relief.css` est désormais importé par CompactButton et Alert (il ne chargeait qu'avec Button).

## 2026-07-29 — Focus v2 : géométrie unique, couleur subtile accordée à la bordure (remplace l'essai accent du même matin)

Après essai visuel, l'anneau `accent` unique (arbitrage du matin) ne convient pas. Nouveau modèle (arbitrage Aurélien, après-midi) : la fondation BORDER garde **une seule définition de géométrie** (outline extérieur, `--focus-width`/`--focus-offset` 2px, `:focus-visible`, `.ds-focus-ring`) ; la **couleur** devient un **cran subtil accordé à la bordure/état du composant** — teinte éclaircie « à la Tailwind », tokenisée en étage 2 : `control.focus-primary` (défaut = primary +28% blanc), `-neutral`, `-danger`, `-success`, `-warning`, `-info`. Les composants surchargent `--control-focus-color` : Button/CompactButton par tone, Input par status (retrouve l'esprit de son ancien anneau adapté, désormais tokenisé), Alert/Toast par tone (hérité aux contrôles internes), DeleteButton → danger. Diffère du per-tone historique (BUTTON-UI 1.4.1) par la teinte subtile et par des crans tokenisés — zéro déduction locale, la cascade reste mécanique. BORDER-UX/UI 1.4.0, BUTTON-UI 1.8.0. Le token `accent` reste défini (candidat à d'autres usages ou au retrait — décision ouverte).

## 2026-07-29 — Ronde d'arbitrages de fermeture : sept décisions tranchées une à une (Aurélien, soir)

Méthode : une question à la fois, application immédiate. Les sept, dans l'ordre :

**1. Chip entre au kit (fiche chip-renvoi VALIDÉE — première tranche verticale du MISSING-COMPONENT-PROTOCOL).** Le renvoi compact en nuée, né de deux implémentations locales des grilles Doctrine révélées par fili-check. Tranche complète : doctrine CHIP-UX/UI 1.0.0 (7 règles UX, 4 UI), composant `Chip` (`variant` outline/subtle, `mono`, `asChild` — `<button type=button>` par défaut, PAS de relief), entrée manifeste typée, atelier, condensé RULES-chip (intention « Page de contenu »), tests, grilles cas/décisions migrées dessus (marqueurs FILI-MANQUE retirés), fiche de manque passée `résolu · Promotion : Chip`. Reste éditorial : la fiche site `content/doctrine/chip.json` (vague 5). Au passage, `compile-regles.py` corrigé : un sujet sans fiche site perdait ses règles identifiées (RULES-chip serait sorti VIDE en silence) — les règles `[ID]` non portées par une fiche sont désormais extraites avec leur STATUT.

**2. `accent` est RETIRÉ proprement (DESIGN 1.34.0).** Né en 1.33.0 pour le focus, sa mission lui a été reprise le jour même par le focus v2 : un token sans propriétaire n'a pas de place — la règle « un token naît d'un besoin réel » vaut à la sortie. Primitives fuchsia supprimées, rôle sémantique supprimé, paire de contraste retirée du validateur, mapping ds-md purgé, COLOR-UX/UI 1.3.0 (marque = DEUX rôles), consommateurs site nettoyés. Les références VIVANTES `color.accent` restantes (focus_ring de CARD/INPUT/LINK/TABS-UI, wording Von Restorff de LAWS, inventaires) sont repointées vers `control.focus-*` / reformulées — les historiques et changelogs restent intacts.

**3. Cran micro-typo `2xs` = 11px.** Les `text-[11px]`/`text-[10px]`/`text-[13px]` de nav/app-layout/modal deviennent `text-2xs` (et `card-group.css` 13px → `var(--size-sm)`, décision « 13 → sm ») ; l'exception nav du vérificateur de tokens tombe.

**4. Rôle `overlay.menu-max` = 18rem.** Le plafond de largeur des menus flottants (Select, Dropdown) était un `max-w-[18rem]` dupliqué en dur — il devient un rôle d'étage 2 consommé en `max-w-menu`.

**5. AppShell sort du baril MAINTENANT (@fili/react 0.2.0) ; le retrait de l'alias `style` attendra une majeure.** Le composant interne ne doit pas être consommable par accident ; l'alias déprécié, lui, est un contrat public encore honoré.

**6. Garde de fraîcheur des condensés (build-plugin).** Chaque fiche `RULES-*` cite sa source (« Généré depuis … (vX) ») ; le build du paquet échoue désormais si la source doctrine porte une autre version — sauf dérive PRÉCISE assumée dans `tools/plugin/fraicheur.derives.json` (fiche + source + versions + justification + vague de résorption), et une dérive assumée qui GRANDIT échoue aussi. État initial : 67 citations, 53 à jour (button/card/input/alert/link/toast/border/color/tabs resynchronisés ou re-cités ce jour), 14 dérives assumées (form 2.1.0→2.4.0 la plus large, grid documentée dans sa fiche, le reste en bumps patch) — résorption vague 5.

**7. Le `12px` de CardGroup est renvoyé à la vague 5** (avec la résorption des dérives ci-dessus) plutôt que tranché à chaud.

## 2026-07-30 — Les gardes changent de périmètre : elles protégeaient le kit, elles protègent maintenant ses consommateurs

**Le constat.** Un test de cohérence à vue sur la page d'accueil et la Vue d'ensemble a trouvé ce qu'aucune garde n'avait vu : une page d'accueil entièrement en valeurs dures (`borderRadius: 10` — l'échelle n'a que 8 et 12), deux cartes recréées à la main, l'anneau de focus du navigateur au lieu du focus v2, et huit `text-[10/11/12/13px]` que le cran `2xs` de la veille aurait dû absorber. Deux causes, toutes deux des entorses à la règle que la Méthode applique partout ailleurs — **l'inventaire de ce qui est vérifié se dérive, il ne s'écrit pas** :

1. `verifie-tokens` avait sa racine codée en dur (`packages/react/src`). Le site — premier consommateur du kit et vitrine de la doctrine — n'était pas regardé.
2. `fili-check` couvrait bien `apps/site/app`, mais ses règles lisaient des *classes*. Un `style={{}}` inline n'a aucune classe à lire : une page entière pouvait passer.

**Ce qui change.**

- **Portée déclarée.** `verifie-tokens` prend des RACINES déclarées avec exclusions justifiées une par une (même grammaire que `fili-check.config.monorepo.json`) : `packages/react/src` et `apps/site/app`, moins l'Atelier (les démonstrations posent volontairement des valeurs — montrer un token exige de l'afficher) et les pages de test. Un fichier créé demain sous une racine déclarée est couvert le jour de sa création : c'est là, et nulle part ailleurs, que se joue la propriété « pages à venir ».
- **Deux règles nouvelles.** `style-en-dur` (valeur d'échelle littérale dans un objet `style`) et un `carte-recreee` réécrit : bordure + rayon + espacement intérieur font une carte, **en classes comme en style inline**, sur un conteneur — un `<pre>` bordé reste un bloc de code, un `<span>` arrondi reste une étiquette (une règle bruyante finit désactivée). Au passage, fili-check lit désormais les imports : `<Link>` de `next/link` n'est plus confondu avec le `Link` du kit — il était jusque-là exempté des règles de recréation et ses props étaient vérifiées contre le mauvais manifeste.
- **Adopter sans mentir.** Élargir une garde fait apparaître d'un coup la dette qu'elle ignorait. La refuser en bloc la ferait désactiver, l'accepter en silence la viderait de son sens : on la CONSTATE, datée et détaillée. `verifie-tokens --adopte <racine>` et `verifie-consommation --adopte` sont des gestes UNIQUES qui refusent de se rejouer ; ensuite, tout écart nouveau échoue. Constats : 114 entrées / 238 occurrences côté tokens, 15 entrées / 16 occurrences côté consommation (dont la page d'accueil et les deux cartes locales) — résorption vague 9. Le même mécanisme entre dans le validateur PORTABLE : sans lui, un projet existant n'allume jamais fili-check, et un validateur qu'on n'allume pas ne protège rien.
- **Preuve, pas promesse.** Une page jetable reproduisant exactement les fautes de la page d'accueil a été créée : les deux gardes échouent (4 constats côté tokens, 3 côté consommation), puis repassent au vert une fois la page retirée.
- **Fixtures.** `style-en-dur` et les deux nouvelles formes de carte recréée entrent dans la fixture négative et dans la liste des détections attendues : chaque écart trouvé à la main finit en fixture, sinon la règle qui l'attrape peut disparaître sans que rien ne le dise.

**ESLint écarté, et pourquoi.** L'intention initiale était d'interdire `style={{}}` et les valeurs arbitraires à l'écriture. ESLint n'est installé nulle part dans le monorepo : l'ajouter, c'était trois ou quatre dépendances et surtout un SECOND moteur de règles à tenir synchronisé avec la doctrine — deux vérités pour une seule règle, exactement la panne que ce chantier combat. À la place, un crochet de pré-commit versionné (`tools/hooks/pre-commit`, activé par `npm run gardes:locales`, zéro dépendance) rapproche les gardes existantes du moment où l'on écrit. Il est contournable par `--no-verify` et c'est assumé : **l'autorité reste la CI**.

**Ce que ça ne couvre toujours pas.** Rien de tout ceci ne voit le RENDU : l'anneau de focus manquant de la page d'accueil n'est visible qu'en ouvrant la page. C'est la couche suivante (harnais sur les 91 pages de `out/`, assertions sur le DOM calculé), et elle reste à faire.

## 2026-07-30 (suite) — La couche du RENDU : une garde qui observe au lieu de lire

Les gardes élargies le matin même lisent toutes la SOURCE, c'est-à-dire l'intention. Aucune ne pouvait voir ce que l'audit avait pourtant trouvé à l'œil : la page d'accueil portait l'anneau de focus du navigateur. Rien dans le code ne le dit — c'est le résultat de la cascade, pas une ligne à trouver. D'où `tools/verifie-rendu.mjs`, qui ouvre les pages CONSTRUITES dans un Chromium sans tête et interroge le DOM calculé.

**Ce qu'il vérifie**, et chaque point est invisible en source : l'anneau de focus (obtenu au vrai `Tab`, parce que `:focus-visible` est précisément la pseudo-classe en jeu) doit exister et sa couleur tomber dans les crans `control.focus-*` — que le harnais lit sur la racine du thème plutôt que de connaître une couleur en dur ; la hiérarchie de titres après composition ; les valeurs d'échelle arrivées jusqu'au DOM ; le plancher de cible tactile mesuré après mise en page. Deux exclusions assumées : un attribut `style` qui POSE une variable est de la tokenisation locale, pas de la dette ; les erreurs JavaScript de page sont remontées comme constats.

**L'inventaire se dérive**, encore. Les pages viennent du dossier construit, jamais d'une liste : le site a dix fichiers de route et quatre-vingt-douze pages, et c'est ce chiffre-là qui compte. Une page créée demain est vérifiée le jour où elle est construite.

**Le plafond est annoncé.** Le focus est éprouvé sur au plus quatorze éléments par page (le temps), et le rapport dit combien ne l'ont PAS été. Un plafond silencieux ferait lire « tout est couvert » là où une partie ne l'est pas — c'est la même exigence que « ne masque aucun écart par une exception générique ».

**Fixtures d'abord.** Une page fautive (focus supprimé, anneau du navigateur, h1→h3, `border-radius: 10px` inline, cible 16×16) et une page conforme, avec un auto-test qui échoue si une règle cesse de détecter. Il tourne AVANT le vrai balayage dans `verifie:rendu` : un harnais muet passerait sinon pour un site sain.

**Coût.** Playwright en dépendance de développement, Chromium installé dans la CI (~40 s), plus le balayage lui-même. C'est le prix d'une garde qui voit ce que les autres ne peuvent pas voir ; il est assumé et mesuré, pas caché.

## 2026-07-30 (fin) — Une seule carte : Card. CardGroup redevient un pattern, le site consomme intégralement son kit

**L'arbitrage.** La hiérarchie d'autorité est appliquée partout, code et documentation : les tokens possèdent les valeurs ; les composants possèdent leur anatomie, leur rendu, leurs états et leurs interactions ; les patterns assemblent et orchestrent sans jamais redessiner le contenu ; les pages fournissent le contenu et la composition sans jamais fabriquer un composant visuel local ; les flows ordonnent le tout.

**CardGroup.Card supprimé.** Il restait DEUX anatomies de carte : `Card` (composée) et `CardGroup.Card` (monolithique, axes divergents). Ancienne règle : la collection rend l'intérieur de ses items via `CardGroup.Card`. Nouvelle règle : les enfants de `CardGroup` sont de vraies `Card` ; le pattern ne garde que la grille et ses colonnes intrinsèques, les gouttières, le régime joint/séparé, les filets et coins, le highlight de proximité, le balisage liste + CELLULE (`role="listitem"`, `.cg-cell`), `aria-busy`, et le contexte collectif de mode/densité (`CollectionContext`, interne — les Card descendantes le prennent comme DÉFAUTS, une prop explicite le surclasse). Pourquoi : un pattern qui possède une seconde API de carte finit par diverger d'elle — c'est arrivé (densité à 2 crans contre 3, selectable sans anneau de focus, `role="list"` incohérent) ; et un « voyant vert » qui ne voit pas les sous-APIs laisse vivre la divergence.

**Ce qui remonte dans Card** (autorité composant, transfert depuis l'ex-CardGroup.Card — pas de nouvelle capacité) : la pastille `Card.Icon` (ex-`.cg-chip`, géométrie retokenisée `icon.lg + space.sm`), la cible étendue-commande `Card.TitleCommand` (ex-`.cg-cmd` — un vrai `<button>`, une commande n'est pas une destination), et la bascule selectable (`onSelectedChange` : clic hors cibles internes + Espace/Entrée), qui vivait dans le pattern. Une carte SANS CIBLE dans une collection interactive n'est plus une prop `inactive` : c'est une `Card mode="static"` explicite — le highlight l'ignore.

**Les sous-APIs deviennent vérifiées.** `anatomie<T>()` du manifeste est désormais EXHAUSTIF (une clé publique non listée casse tsc) et `verifie-manifeste` refuse une API compound sans champ `anatomy` complet. `CardGroup.Card` n'aurait pas pu vivre invisible sous cette garde ; au passage : Accordion.Root, Card.Check, Drawer.Root et l'anatomie de Link entrent au manifeste.

**Le site consomme intégralement son kit.** Les exclusions globales de `fili-check` (`app/ui`, `app/test`) sont retirées — plus aucun dossier hors contrôle — et le constat de consommation est VIDÉ : l'ancien contenu est corrigé, pas gelé. Concrètement : les deux dernières cartes recréées (`md/[slug]/page.tsx` → `Preuves` en collection, encart de `cas-grille.tsx` → `Card`), les `next/link` stylés à la main → `Link asChild` (facture et focus Fili, routage Next — `LienRetour`), l'atelier passe entièrement au kit (CompactButton/Button/Switch/Input/Accordion à la place des `<button>`/checkbox/`<input>` restylés ; démos Container/SkipLink/squelettes recomposées), et fili-check apprend le motif `asChild` (un natif rendu PAR un composant du kit via Slot n'est pas une recréation — parent immédiat seulement, fixture à l'appui). Seul reste le `range` du playground, déclaré `FILI-MANQUE: slider` avec sa fiche (statut : proposé) — aucun fallback silencieux.

**Le lien mort `/md/chip/`** venait de deux dérivations divergentes de « la liste des sujets » : `sujets()` (nav + vue d'ensemble) listait chip, `slugsDoctrine()` (pages générées) non. Une seule dérivation désormais : un sujet n'apparaît que si sa fiche doctrine existe — le jour où `chip.json` arrive, le sujet réapparaît seul.

**Le rendu se recentre sur l'observable.** `dur-au-dom` est retiré du harnais (la détection des valeurs source appartient au validateur AST, avec ses exceptions justifiées — la redite signalait `0px` et la géométrie posée par le kit lui-même) ; les pages d'erreur générées par Next (404/500) sortent de l'inventaire. Restent focus, cible tactile, hiérarchie de titres, liens morts, erreurs JavaScript. Le harnais entre dans le VRAI workflow (`.github/workflows/pages.yml`) ; le fichier parallèle `tools/pages.yml.nouveau` disparaît. Aucune baseline de rendu n'est créée : elle doit rester vide.

**Tests.** `card-group.test.tsx` verrouille le contrat : pas de seconde anatomie, enfants = vraies Card, mode/densité par contexte, balisage liste/cellule, sélection clavier, carte sans cible, chargement, joint/séparé, composition Media/Actions/TitleLink/TitleCommand — et l'atelier est testé comme consommateur (l'entrée Card compose `Card.Root`, les extraits sont l'API publique).

**Fermeture (même jour, soir).** Quatre suites au premier balayage réel du rendu (92 pages, 19 constats) : la loi atomique (Tokens → Components → Patterns → Pages → Flows) entre au **Component Contract 1.1.0 comme section normative** avec ses conséquences exécutables — le contrat, pas le journal, fait autorité ; la frontière de CardGroup devient **exécutable** (identité réelle de `Card.Root` exigée des enfants directs, erreur explicite sinon — l'atelier ne passe plus par un composant intermédiaire) ; le **Markdown consomme le kit** (liens → `Link` inline via le mapping de `react-markdown`, `pre` scrollables → anneau de la fondation ; trois `h2→h4` corrigés dans les sources méthode) ; le harnais de rendu apprend le **focus délégué** (l'anneau d'Input vit sur son cadre via `:has` ; une outline transparente n'est pas un indicateur, une ombre de repos non plus — fixtures à l'appui). Aucune baseline de rendu : les 14 vrais constats sont corrigés, les 5 faux positifs l'étaient par le harnais.

## 2026-07-30 (soir) — La zone d'actions est le PIED de la colonne de contenu, pas un troisième bloc de la surface

**Le constat**, à l'œil, dans l'atelier (rapport d'Aurélien) : une carte à icône étalait son contenu en ligne et poussait ses boutons à droite du titre ; avec une image, le texte se retrouvait étranglé entre le média et les actions, trois mots par ligne. Deux défauts distincts, tous deux en contradiction avec la doctrine déjà écrite — donc des bugs, pas des arbitrages.

- **La rangée sans média.** L'état « regular » se déclenchait sur `data-regular-capable`, posé dès que `adaptiveMedia` n'était pas désactivé, sans vérifier qu'il existe un `Card.Media`. Or `CARD-UI` dit « expanded peut placer **le media** à côté du contenu » : pas de média, rien à disposer. Garde rétablie en CSS (`:has(> .ds-card-media)`), au plus près de la condition doctrinale.
- **Les actions en troisième colonne.** Posée en frère de `Card.Body`, la zone d'actions entrait dans le flux de la rangée comme un bloc de plus. `CARD-R07` énumère pourtant les slots « media / header / corps / **zone d'actions** » : les actions font partie du CONTENU. Elles vivent donc désormais dans `Card.Body`, dont elles héritent retrait et gouttière, et `margin-top: auto` les colle au bas — les boutons s'alignent entre cartes voisines d'une collection à hauteurs égales, et rien ne bouge sur une carte isolée (pas d'espace libre, pas de poussée : flexbox neutralise la règle tout seul, aucune exception à écrire). Elles restent des siblings du lien étendu (`CARD-R23`, source T1).

**Le symptôme qui trahissait l'anatomie** : l'appelant devait rendre son retrait à la main (`className="px-md pb-md"`) parce qu'une zone d'actions hors du corps n'en a aucun. Quand le consommateur réécrit la géométrie du composant, ce n'est pas lui qui se trompe. Le kit se contredisait d'ailleurs dans ses propres exemples — actions DANS le corps chez AppLayout, HORS du corps chez Card. Un test le verrouille désormais dans les deux sens (position dans le corps, absence de retrait local).

## 2026-07-30 (clôture) — Le bloc champ : le kit outille enfin le libellé qu'il exigeait

**Le constat.** `INPUT-R38` impose « label toujours visible, jamais seulement en placeholder », `R33` que le nom accessible contienne le libellé visible, et `INPUT-UI` T1 la liaison technique `for`/`id`. Or `Input` n'avait **aucun** sous-composant de libellé : chaque page l'écrivait à la main. Un système qui édicte une règle sans donner le moyen de la tenir la fait violer partout — c'est le cas de figure inverse du composant manquant, et il ne se voyait dans aucune garde.

**La contrainte qui a décidé de l'API.** `Input.Root` **est** le cadre bordé (bordure, rayon, `overflow-hidden`, anneau de focus) : un libellé visible y serait *dans* la boîte. Il fallait un niveau au-dessus. Trois options ont été posées ; l'arbitrage (Aurélien) retient **`Input.Field`, bloc extérieur qui fournit son contexte** — `fieldId`, `messageId`, `size`, `status`, `required` — pendant que `Root` les lit comme **défauts** surclassables. C'est le contrat `CardGroup` → `Card` du matin même, réemployé tel quel : un orchestrateur fournit, l'enfant surclasse. `Input.Root` employé seul reste strictement inchangé — aucune rupture.

**Trois arbitrages secondaires**, tranchés en même temps. *Un seul emplacement de message*, sous le champ : `R26` dit que l'erreur remplace le helper, ce qui n'a de sens que s'ils partagent la même place — `R25` (« sous le label ») mérite la précision « sous le champ » au prochain passage doctrinal. *Pas de double étiquetage* : dans un `Field`, `Wrapper` et `Textarea` cessent d'être des `<label>`, le libellé visible portant seul l'association ; hors `Field`, ils le restent. *Le requis* est déclaré sur `Field` (l'indicateur appartient à INPUT, `R30`), tandis que la **convention** — marquer le requis ou l'optionnel — reste au formulaire entier (`FORM-R10`), hors de cette tranche.

**Zéro doctrine, zéro token.** Les dix règles existaient, sourcées ; les quatre rôles (`required_indicator: color.danger`, `helper_text`, `message_font`, `value_font`) étaient déjà déclarés dans `INPUT-UI`. La tranche n'ajoute donc aucune dette : elle branche l'existant. `aria-describedby` n'est posé que si un message est réellement monté — pointer vers un identifiant absent est un défaut que les validateurs relèvent.

## 2026-07-30 (stabilisation 0.2) — Trois gardes qui disaient rouge : une seule avait raison sur le composant

Tranche de FIABILISATION, sans nouvelle capacité. Trois constats laissés par la semaine de vitesse ; ils n'avaient pas la même nature, et c'est cela qu'il fallait trancher avant de coder.

**1. `Checkbox.Group` — l'exclusivité s'ARBITRE dans le groupe, même si elle se DÉCLARE sur l'option.** Ancien état : la bascule recevait le caractère exclusif de l'option manipulée, et rien d'autre. Elle savait donc « cette option-ci vide les autres », jamais « parmi les valeurs déjà cochées, lesquelles sont exclusives ». Conséquence, exactement le scénario de `CHOICE-R18` pris à l'envers : ordinaire cochée, puis « Aucun de ces sujets », puis une ordinaire — et l'exclusive restait dans le tableau. Nouvel état : le groupe tient le registre de ses propres options exclusives ; chaque `Checkbox` s'y déclare au montage et s'en radie au démontage. Le registre vit dans une **référence portée par l'instance de groupe** — deux groupes sur la même page ne partagent rien. Aucune prop publique n'apparaît : l'anatomie suffisait, il lui manquait un contrat interne. La bascule reste synchrone et pure — elle calcule le tableau suivant à partir du tableau reçu, sans le muter, sans délai ni effet de rattrapage. Aucune valeur (`"none"`, `"aucun"`) n'est codée en dur : l'exclusivité est une propriété déclarée, jamais un nom deviné.

**2. Liens Markdown — le contrat porte sur l'ADRESSE SERVIE, pas sur la chaîne écrite.** Le test attendait `/md/` et recevait `/md` depuis que le lien interne compose `next/link`. La tentation était de corriger l'un des deux ; les deux avaient raison dans leur monde. `next/link` lit la configuration de routage dans `process.env.__NEXT_TRAILING_SLASH` et `__NEXT_ROUTER_BASEPATH`, que le build de Next remplace — et que rien ne pose sous vitest. L'assertion ne mesurait donc pas le composant : elle mesurait un harnais qui ignorait la configuration du site. **Arbitrage** : le contrat est l'adresse finalement servie, soit `basePath` + chemin, barre finale comprise, parce que `next.config.mjs` exporte en `trailingSlash: true` et que la CI publie sous `/fili`. Le harnais reproduit donc la configuration de PUBLICATION — celle où un défaut de routage est observable — et non celle du build local, dont le préfixe vide est précisément ce qui a laissé passer les liens morts du matin. La frontière reste celle de l'ADRESSE : chemin absolu interne (préfixé, barre finale), chemin relatif (laissé relatif — il porte déjà son contexte), ancre, URL absolue, `mailto:`, `tel:` (intacts) ; chacun a son cas de test, et tous gardent la facture visuelle du kit, `next/link` n'apportant que le routage.

**Ce que ce cas de test a fait remonter, et comment c'est tranché — `tel:` est PRIS EN CHARGE.** En écrivant le cas, on découvre que `react-markdown` assainit les URL avec une **allowlist de protocoles** (`^(https?|ircs?|mailto|xmpp)$`) : `tel:` n'y figure pas, l'adresse était donc remplacée par une chaîne vide. Le rendu produisait alors le pire des trois états — un élément qui garde la facture visuelle d'un lien, n'a plus de destination, et perd jusqu'au rôle accessible `link`. L'Interaction Language ne l'admet pas : une navigation doit naviguer. **Décision : le rendu Markdown prend en charge les URI téléphoniques.** `markdown.tsx` passe un `urlTransform` qui laisse passer une forme `tel:` appartenant à un SOUS-ENSEMBLE volontairement strict — préfixe `tel:`, signe `+` facultatif, chiffres et séparateurs visuels simples. Ce n'est **pas** la RFC 3966 et Fili ne prétend pas l'implémenter : extensions (`;ext=`), paramètres et `;phone-context=` n'en font pas partie, et toute forme non reconnue retombe sur `defaultUrlTransform` — donc se retrouve neutralisée. L'élargir sera une décision, le jour où le corpus en aura besoin et délègue **tout le reste** à `defaultUrlTransform`, l'API publique de la version installée. Ce n'est donc pas une allowlist maison qui remplacerait la leur : c'est un cas ajouté devant elle. `javascript:`, `data:`, un protocole inconnu — et jusqu'à un `tel:javascript:` — restent vidés exactement comme avant, et le test le vérifie dans les deux sens. `tel:` ne passe pas par `next/link` : ce n'est pas une page, il n'a ni `basePath` ni barre finale à recevoir.

**3. Les quatre `0s` d'`app-layout.css` — une mécanique CSS, pas une durée de mouvement.** `visibility` est une propriété **discrète** : elle ne s'interpole pas. Le `0s` n'est donc pas une durée, c'est l'idiome qui rend la bascule instantanée ; la seule durée perceptible du rail est portée par le délai tokenisé `var(--duration-base)`, qui retarde le passage à `hidden` jusqu'à la fin du glissement. La fondation motion n'émet que `fast/base/slow` et ne parle que de mouvements perçus : lui ajouter un rôle « zéro » serait une décision de fondation, prise ailleurs, pour une valeur qui n'est pas une durée. **Arbitrage** : exception NOMMÉE (`bascule-discrète`), pas d'entrée en baseline. Et pour qu'une exception ne devienne pas une wildcard, le mécanisme d'exception gagne un champ `contexte` : une expression confrontée à la déclaration où le motif est relevé. Ici `visibility\s+0s$` — toute autre durée nulle du fichier reste un constat, ce qui a été éprouvé en y glissant un `transform 0s` temporaire, bien ressorti. **Ce qui est gardé automatiquement, et ce qui ne l'est pas.** Rejoué à chaque exécution de la chaîne : la STRUCTURE CSS de la bascule (`app-layout-visibilite.test.tsx` — état fermé caché, délai tokenisé, ouverture sans délai, transition coupée en mouvement réduit), le PÉRIMÈTRE de l'exception (elle doit rester bornée à `visibility`), et le contrôle de rendu général sur les pages construites. Vérifié UNE FOIS, à la main, dans Chromium le 2026-07-30 : la séquence DYNAMIQUE — rail fermé réellement invisible et hors tabulation, visible dès la première frame à l'ouverture, caché seulement après le glissement, sans délai résiduel en `prefers-reduced-motion`. Cette seconde liste n'est **pas** une garde : rien ne la rejoue, et le contrôle de rendu n'actionne pas les rails. Un scénario navigateur dynamique dédié reste une dette possible ; il n'est pas créé ici, où le sujet est la fiabilité de l'existant, pas l'outillage.

**4. Une dépendance React sérialisée n'est pas une dépendance — `Checkbox.Group` et `CardGroup`.** Les deux composants représentaient une liste par `join("|")` pour la donner en dépendance à `useMemo`. Une chaîne jointe n'est pas injective : `["a|b"]` et `["a", "b"]` produisent la même. Avec un `onValueChange` stable, plus rien ne bougeait dans les dépendances, le contexte restait figé sur la sélection précédente et l'affichage devenait périmé — reproduit sur les deux composants, ordinaire cochée restant cochée après le changement de valeur. **Correction** : la dépendance redevient la valeur immuable RÉELLE. `Checkbox.Group` prend la sélection reçue telle quelle (avec une constante de module pour le cas non contrôlé, afin qu'un `[]` neuf n'invalide pas le mémo à chaque rendu). `CardGroup` a demandé deux essais. Le premier tenait l'identité de ses listes dérivées dans une **ref comparée pendant le rendu** : les tests passaient, mais l'écriture avait lieu hors du flux de rendu — invisible au rendu concurrent, et survivant à un rendu abandonné. Un test vert obtenu par une impureté reste une impureté. La forme retenue n'emploie donc que des **dérivations pures** : `items` par `useMemo` depuis `children` (validation de la frontière comprise), puis `cles` et `valeurs` depuis `items`, et `retenues` depuis `selection` et `value`. Le contexte dépend de ces listes elles-mêmes. Contrepartie assumée : quand le parent recrée ses enfants à chaque rendu, la collection se recompose plus souvent et ses effets de disposition se rejouent — la justesse passe avant cette micro-optimisation, et une garde vérifie que ces effets suivent bien la taille et l'ordre de la liste. L'API publique ne bouge pas. Deux tests de régression rejouent le scénario de collision ; ils échouent si la sérialisation revient.

**Au passage — ce que le manifeste ne décrit pas encore.** L'entrée `Card` déclare désormais sa dette : le schéma couvre les props du `Root`, pas celles des sous-composants compound. `Card.TitleLink asChild`, qui porte le routage sous `basePath`, vivait donc dans le code et chez le consommateur sans exister dans le contrat publié. Le trou est **relevé, pas comblé** — étendre le schéma est une tranche à part. En attendant, la capacité est tenue par un exemple canonique compilé (l'exemple DÉCLARE ses imports extérieurs dans le champ `imports` d'`ExempleCanonique` ; le vérificateur les agrège et les dédoublonne, il ne reconnaît plus aucun nom de bibliothèque — le format du manifeste reste générique, et le plugin rend ces imports avec l'extrait) et par un test de consommation qui la fait échouer si elle disparaît.

**Bruit de la suite.** Une panne doit être lisible tout de suite. Les erreurs volontaires des gardes de `CardGroup` étaient publiées deux fois : par `console.error` de React, et par l'événement `error` de la fenêtre que jsdom republie en « Uncaught » — que le spy sur la console ne couvre pas. Les deux sont désormais éteintes, **le temps de l'appel seulement**, par un helper local ; rien n'est masqué globalement. L'avertissement de dépréciation de `Button.style` cesse d'être une trace subie : il est capturé et **testé** (une seule occurrence, nommant son remplaçant), tout autre message étant réémis tel quel. Et la double autorité de transformation disparaît de `vitest.config.ts` : sous rolldown-vite, l'option `esbuild` était de toute façon ignorée au profit d'`oxc`, ce que Vite signalait à chaque exécution.

## 2026-07-31 — Le thème traverse Tailwind en `var()`, ou il ne se thème pas : six axes au lieu de deux

**L'ancienne règle, jamais écrite.** Le 2026-07-29, le rayon avait été rendu « THÉMABLE de bout en bout » : les classes `rounded-*` cessaient d'être compilées en pixels durs pour pointer vers `var(--radius-*)`. La couleur l'était déjà. Les quatre autres axes du thème — espacement, typographie, élévation, mouvement — sont restés recopiés en clair dans `tailwind.theme.cjs`, **sans qu'une ligne explique pourquoi**. Ce n'était donc pas un arbitrage : c'était une asymétrie, propagée par le silence.

**Ce que ça coûtait, et qui ne se voyait pas.** Les tokens CSS existaient pour les six axes : `dist/tokens.css` émettait `--space-*`, `--font-*`, `--weight-*`, `--elevation-*`, `--duration-*` et `--ease-*`. Mais surcharger `--font-sans` sur un conteneur ne déplaçait rien, puisque la classe `font-sans` avait déjà été compilée en `Geist, system-ui, sans-serif`. Le socle publiait donc des variables **que seuls les consommateurs CSS pouvaient suivre** — le kit, lui, ne les écoutait pas. Une variable qu'on peut changer sans que rien ne bouge est pire qu'une variable absente : elle promet une prise qui n'existe pas.

**Ce qui l'a révélé.** L'ouverture de la Galerie (section 4), dont l'unité de travail est une *ambiance* : un jeu de tokens appliqué aux composants réels. Une sonde du thème généré, faite **avant** d'écrire la moindre interface, a montré que sur six axes deux seulement se déplaçaient. Cinq ambiances de familles très différentes — papier d'imprimerie, mono tramé, minimalisme cinématique — se seraient réduites à cinq palettes sur un squelette identique. **Arbitrage Aurélien** : « une ambiance, ce n'est justement pas que la couleur » — sinon autant ne pas faire de Galerie et changer les variables directement.

**La nouvelle règle.** Tout axe qui a un token CSS traverse Tailwind en `var(--…)`, jamais en littéral. Sont désormais substituables : couleur · rayon · **espacement** · **famille** · **graisse** · **titrage** · **élévation** · **durée** · **courbe**. La graisse est une addition nette : `fontWeight` était absent du thème, donc `font-medium` et `font-semibold` tombaient sur les défauts de Tailwind pendant que `--weight-*` existait, inutilisé.

**Ce qui NE bascule pas, et pourquoi c'est nommé plutôt que masqué.** Les crans de texte courant (`text-xs/sm/base/lg/xl`) restent sur les défauts de Tailwind : ces défauts portent un **interlignage**, et les remplacer par une simple chaîne le perdrait — or le socle n'a aucun token d'interlignage à mettre à la place. Le sujet appartient à une fiche « tokens d'interlignage », pas à ce pont. `font-bold` non plus : aucun `--weight-bold` n'existe, et deux usages résiduels ne justifient pas un token de commodité — ils sont à résorber. Reste enfin un défaut de nommage à la source : la courbe `spring` s'émet en `--spring` là où ses sœurs s'émettent en `--ease-*`.

**Ce qui garantit que ça tient.** Aucune valeur n'a changé : la substitution est un changement de *résolution*, du build vers le navigateur. Le risque réel est donc la régression silencieuse, là où une valeur littérale était calculée. Vérifié : les utilitaires négatifs, qui étaient le point douteux — `-translate-y-sm` et `-mt-lg` compilent en `calc(var(--space-sm) * -1)`, Tailwind sachant négocier un `var()` par `calc()`. Rejoué en vert : `tokens:build` (70 paires de contraste), `manifeste:check`, `verifie:manifeste`, `verifie:tokens` (strict), `verifie:consommation` (strict), `verifie:exemples` (39), `verifie:tsc`, `plugin:build`.

## Fil rouge méthodologique (transversal, non daté)

- **Le biais "état transitoire"** : loading (bouton) → validation asynchrone (input) → skeleton (card) → résolution/disparition (callout) → et, à l'échelle du système, la fondation motion elle-même (5e occurrence — le vocabulaire des transitions manquait en entier). La première rédaction documente l'état final, jamais la transition. Depuis le callout : écrire la section "sortie de scène / état d'attente" *avant* le test de couverture — le prédicteur a fonctionné en amont sur typographie (chargement de police), iconographie (spinner) et motion (interruption).
- **Le principe de dédoublonnage** : une règle qui semble dupliquée entre deux fichiers appartient à un pattern (form), à un conteneur (card) ou doit être centralisée dans un composant (callout ← form). 3 applications, dans les deux sens.
- **Ratio de trous stable sur les composants, décroissant sur les fondations** : bouton 8/33, input 11/30, carte 9/41, callout 8/39, typographie 10/33 (benchmark sauté) — puis couleur 9/31, spacing 6/24, elevation 5/21, border 5/23, radius 4/17, iconographie 4/28, motion 3/28 (benchmark et inventaire avant livraison). La première passe laisse des trous quelle que soit la méthode d'entrée ; leur nombre baisse quand les leçons précédentes sont appliquées d'office. Le test de couverture n'est pas optionnel.
- **La déduction silencieuse** (transversal, nommé lors de la passe fondations) : tone.destructive_text (bouton) → value_text (input) → styles de texte des 4 composants (typographie 1.1.0) → focus ring, tailles d'icônes, durées/courbes (fondations 2026-07-11). Une déduction correcte reste une déduction non documentée — le motif revient assez souvent pour être cherché activement à chaque nouveau sujet : "qu'est-ce que l'implémenteur devine ici ?"
