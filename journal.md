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
| `#001` → `#012` | pièce de projet `claude/sauvetage-journal-001-012-verbatim.md` | **revenues à l'identique**, et laissées là — `#057` |
| `#013` → `#042` | nulle part | **perdues**, perte actée par `#049` |
| `#043` → `#049` | document de projet `claude/journal.md` | **gelé**, ne sera plus réécrit |
| `#050` → … | **ce fichier** | vivant, empreinté, versionné |
| run 1 (19 entrées) | `claude/archive/v2-run1-journal.md` | archive d'une lignée close |

La numérotation ne se réattribue pas. **Trois sorts, pas deux** : douze entrées
sont revenues mot pour mot et restent hors du journal parce qu'une copie qui a
traversé une perte est une pièce, pas une entrée vivante (`#057`) ; trente sont
perdues ; sept sont gelées. Le trou de `#013` à `#042` est la trace, et il vaut
mieux qu'un journal sans trou qui donnerait à croire qu'il n'a rien perdu.

---

## #066 — Un composant peut rétrécir ; sa zone de clic ne rétrécit pas avec lui

*2026-08-12 · Statut : 🟢 Verrouillé (décision d'Auteur rendue sur mesure)*

**Contexte** — Exercice sur une carte d'actualité de Google News, relevée au
pixel sur capture. Premier constat : la carte a **50** de marge horizontale et
**27** en haut — la même carte, deux marges. Corrigée à 50 partout, elle a fait
apparaître le défaut que ce 27 masquait : **la rangée du haut est haute comme le
bouton**, 137 à l'échelle de la capture, alors que les lettres du logo font 59.
Le logo flotte au milieu, et l'œil voit 83 de blanc au-dessus de lui là où la
marge en annonce 50.

Deux issues montées et mesurées sur rendu. *Agrandir le logo* : 83 → 76, presque
rien — une police garde du blanc au-dessus de ses capitales, et ce blanc grandit
avec elle. *Réduire le bouton* : 83 → 58, soit la marge à huit près, et la carte
entière remonte de 49. Remis dans la comparaison, l'original de Google donne 60 :
**le même résultat que la réduction du bouton.** Sa marge courte n'était donc pas
une négligence, c'était un **rattrapage** du trou laissé par un bouton trop haut.

**Décision** — Les deux compositions sont justes, sous une condition qui devient
une règle. **Un composant peut être dessiné plus petit que la cible de confort ;
sa zone d'atteinte, elle, ne descend jamais.** La classe `atteinte-confort`
étend la zone qui réagit jusqu'au jeton de cible, sans rien peindre et sans
pousser les voisins. Rétrécir un composant sans elle est une faute, pas un choix.
Elle ne dispense pas de l'écart minimal entre deux cibles voisines.

**Sens produit / UX** — **Ce que la composition demande et ce que le doigt exige
ne sont pas la même mesure, et on les avait confondues.** Tant que la taille
dessinée *est* la cible, toute exigence tactile devient une contrainte de mise en
page : un bouton de 44 impose une rangée de 44, même à côté d'un logo qui fait la
moitié. En séparant le contour de l'atteinte, la contrainte tactile cesse de
commander la composition — et elle est mieux tenue, parce qu'elle est désormais
écrite quelque part.

**Un pansement bien posé cache le défaut sans le soigner.** Le 27 de Google
donne le bon résultat visuel pour la mauvaise raison : il compense un trou en
cassant l'égalité des marges, ce qui déplace le défaut au lieu de le retirer. On
n'aurait pas trouvé la cause sans avoir d'abord corrigé le symptôme — c'est
l'égalisation des marges qui a rendu le trou visible.

**Une règle trouvée en mesurant, pas en raisonnant.** L'option « agrandir le
logo » était la plus intuitive des deux, et le rendu la tue : sept pixels gagnés.
Le blanc d'une police n'est pas de l'espace qu'on récupère.

**Alternatives écartées** — *Agrandir le logo* (mesuré : 83 → 76, et la marque
prend un poids qui n'a pas été demandé) ; *laisser le bouton grand et rogner la
marge du haut*, c'est-à-dire la solution de Google (elle soigne la trace, et elle
défait l'égalité des marges qu'on venait de poser) ; *interdire tout composant
sous la cible* (interdire une composition juste au nom d'une contrainte qui a une
sortie connue et bon marché).

**Conséquences** — Le fichier de règles gagne « La taille au doigt ». La classe
entre au CSS, écrite en CSS et non en utilitaires : centrer une zone hors flux
n'a pas de jeton, et les seules valeurs employées sont celles que le fichier de
règles tolère — 0, 50 %, 100 % —, la mesure venant du jeton de cible.
**Une dette est nommée** : aucune assertion ne vérifie encore la règle, le
Gardien ne sait pas mesurer une hauteur rendue. Et **aucun composant du système
n'est aujourd'hui sous la cible** : la règle attend son premier cas, elle est
posée avant d'être utile — ce qui est l'ordre voulu.

**Impact carte** — `REGLES.md` régénéré (§4, « La taille au doigt »).
`src/index.css` gagne l'unique classe de composant du dépôt. Charge ouverte sur
le corpus d'assertions, consignée, non traitée ici.

---

## #065 — Un signal qui se répète n'est plus un signal : l'icône quitte les listes, et l'alerte perd sa barre

*2026-08-11 · Statut : 🟢 Verrouillé (décisions d'Auteur rendues sur essais)*

**Contexte** — La règle en vigueur disait qu'un état se déclare **trois fois** :
par sa forme, son libellé et sa teinte. Montée sur les écrans réels, elle produit
une liste de cinq lignes où la même icône revient cinq fois, et une alerte qui
porte quatre marques du même état — barre latérale, contour, fond teinté, titre
coloré. L'Auteur l'a dit sur l'écran : la forme est moche, et la règle n'est pas
« combien de signaux » mais **« combien de fois »**.

**Décision** — Deux.

**(1) Pas d'icône sur ce qui se répète.** Un jeton posé dans une liste, un
tableau, ou toute suite d'éléments de même nature perd sa forme et garde son
libellé et sa teinte. Seul, il la conserve. C'est ce qui le contient qui le
déclare.

**(2) L'alerte garde le fond teinté et perd la barre latérale.** Le trait
redevient un contour ordinaire, de la même famille que celui du jeton.

**Sens produit / UX** — **Le nombre de fois est lisible, le nombre de signaux
demandait un jugement.** « Ai-je trop de signaux ? » ne se vérifie pas : il faut
un œil. « Suis-je dans une liste ? » se lit dans la structure — donc un robot
peut le voir. La règle change de nature en changeant de formulation, et c'est le
même déplacement que pour l'espace : on ne choisit plus, on constate.

**Un signal qui apparaît vingt fois n'informe plus, il texture.** L'icône était
là pour dire « ceci est un refus » avant qu'on lise. Répétée à chaque ligne, elle
ne distingue plus rien : elle devient du grain, et elle vole de la place au seul
élément qui varie, le libellé.

**Le contraste de l'état ne baisse pas pour autant.** L'accessibilité exige que
l'état ne se lise pas à la couleur seule ; le libellé reste, et il porte. La
forme était un troisième porteur, pas le second.

**Alternatives écartées** — *Compter les signaux par élément et plafonner à
deux* (le compte se fait par élément, or le défaut se produit par écran :
la mauvaise unité de mesure) ; *garder l'icône et l'atténuer dans les listes*
(atténuer un signal, c'est le payer sans le recevoir) ; *retirer aussi le fond
teinté de l'alerte* (essayé à l'écran, jugé plus faible : la teinte est ce qui
fait reconnaître l'alerte avant lecture, la barre ne faisait que la doubler).

**Impact carte** — `Jeton` gagne une déclaration de répétition ; `Alerte` perd
la barre latérale. Le fichier de règles est régénéré : le §3 ne dit plus « une
forme » sans condition.

---

## #064 — L'arrondi redevient un réglage à part, la taille d'un composant ne bouge pas, et l'air est large

*2026-08-11 · Statut : 🟢 Verrouillé (décisions d'Auteur rendues sur essais) · **Révise `#058`** sur un point*

**Contexte** — Le travail sur le rayon des composants a fait remonter deux choses que la géométrie du dépôt interdisait. L'Auteur voulait retrouver ses six intentions — *Éditorial · luxe* est large et vif, *Technique* est serré et carré — impossibles depuis que le rayon descendait de la marge. Et il a observé de longue date que **les boutons ronds sont plus larges que les boutons carrés**, sans règle pour le dire.

**Décision** — Trois, prises dans cet ordre.

**(1) L'arrondi redevient un réglage à part.** Il cesse de descendre de la marge. On repasse de sept décisions d'entrée à huit. **Ceci révise `#058`**, prise le matin même.

**(2) La taille d'un composant ne bouge pas ; c'est l'arrondi qui se rabat sur elle.** Un bouton et un champ gardent la même hauteur, parce que c'est elle qui aligne la lecture. L'arrondi d'un composant ne dépasse donc jamais les deux tiers de sa marge verticale ; au-delà, le produit emploie la pastille.

**(3) L'air horizontal est large par défaut** — un peu plus de la moitié de la hauteur. Le serré n'est pas une taille mais un **rôle**, et il n'a que deux cas : un bouton sans texte, et des boutons groupés. Jamais sur une pastille.

**Sens produit / UX** — Quatre choses, dont deux ont été trouvées en essayant l'inverse.

**Une loi qui interdit les intentions de l'Auteur est une loi trop courte.** *« Le rayon descend de la marge »* était juste, économe, et elle supprimait une décision. Elle rendait aussi impossible tout système large et vif, ou serré et rond — c'est-à-dire quatre des six intentions. Une simplification qui coûte l'expressivité entière du réglage n'est pas une simplification, c'est une amputation. Le réglage revient, et le journal porte les deux entrées : celle qui l'a retiré et celle qui le rend.

**La voie séduisante était l'autre, et l'essai l'a tuée.** Si la marge doit valoir une fois et demie l'arrondi, alors l'arrondi commande la taille — et cela expliquait d'un coup l'observation de l'Auteur sur les boutons ronds. Monté sur un écran entier, le résultat casse : **la barre d'actions déborde sur téléphone** dès que le bouton passe à cinquante-neuf, le bouton d'icône devient un pavé carré, une liste de vingt lignes perd un demi-écran, et les hauteurs — quarante-sept, cinquante-neuf — ne retombent sur aucun cran de l'échelle. La causalité est donc l'inverse : **la taille tient, l'arrondi cède.** Trouvé en montrant, pas en raisonnant.

**Le plafond a été mesuré à l'œil, sur deux tailles d'objet.** Une échelle du carré à la pastille, cran par cran : bon jusqu'au sixième de la hauteur, mauvais dès le quart, bon de nouveau en pastille. **Il existe une zone morte** — ni un coin voulu, ni une forme —, et le plafond des deux tiers de la marge verticale la ferme. Sur les composants d'aujourd'hui, il tombe exactement sur huit : la valeur en place. Rien ne change à l'écran, et pourtant la valeur cesse d'être un choix.

**Et l'observation de départ trouve sa règle.** Les boutons ronds sont plus larges parce qu'**un composant doit de l'air à son texte, indépendamment de sa forme** — et que l'air moyen, jugé limite, était celui du dépôt. L'air passe donc de dix-sept à vingt-quatre. Le serré ne disparaît pas : il devient déclarable, pour les deux cas où il a un sens. *« Serré n'est pas une taille, c'est un rôle »* — la phrase est de l'Auteur, et elle empêche que le serré redevienne un moyen de gagner de la place.

**Alternatives écartées** — *Garder « le rayon descend de la marge »* (elle supprime une décision et quatre intentions sur six) ; *faire grandir le composant avec son arrondi* (cohérent, séduisant, et il casse la barre d'actions sur mobile — mesuré sur un écran entier avant d'être écarté) ; *plafonner l'arrondi à la marge entière plutôt qu'aux deux tiers* (le principe est de l'Auteur, mais son œil s'est arrêté avant : sur un objet de trente-sept de haut, il a refusé neuf là où la marge en autorisait douze) ; *poser un seuil de bascule vers la pastille sur les petits objets* (l'Auteur a jugé les deux formes également bonnes selon le contexte — un seuil aurait tranché à sa place ce qu'aucune mesure ne tranche) ; *élargir tous les composants* (l'air large vaut pour ce qui porte un libellé ; un champ et une liste de choix ont leur propre inset, il n'y avait pas de motif de les toucher).

**Conséquences** — Entrées : sept → **huit**. Le rayon de contrôle est plafonné et la pièce générée déclare si le plafond est atteint. L'air du bouton passe de la marge de carte à celle de coque, et une variante d'air déclarable apparaît. La planche porte les deux règles ; le fichier de règles les annonce dans ses propres mots. **Batterie 100 %, contrastes, types, lint au vert.** Aucun contrat rouvert.

**Ce qui reste ouvert** — Les deux garde-fous ne sont pas mécaniques : rien ne vérifie qu'un arrondi respecte son plafond, ni qu'un serré est bien dans l'un de ses deux cas. Ce sont deux contrôles d'audit à écrire, et ils sont au plan.

**Impact carte** — Aucun jalon, aucun contrat. Registre : le rayon racine revient comme entrée. `#058` est révisée sur ce point et sur celui-là seulement.

---

## #063 — Le rayon d'un composant descend du ton, pas de la profondeur — et la pastille est une promesse

*2026-08-11 · Statut : 🟢 Verrouillé (décision d'Auteur, rendue sur essais) · Deuxième point du plan*

**Contexte** — Une source extérieure de l'Auteur porte une exception que le dépôt n'avait pas : *« les composants ont un rayon intrinsèque, hors chaîne et hors theming — il serait contre-productif qu'un bouton change d'arrondi »*. Chez Fili, bouton, champ, liste de choix et jeton prenaient le dernier cran de la chaîne : leur coin changeait donc avec la profondeur, et avec la base.

**Décision** — **Le rayon d'un composant descend du ton du système — le tiers du rayon racine — et jamais de sa profondeur.** Deux garde-fous l'accompagnent : un composant plus rond que sa carte passe en **pastille** ; et **une pastille n'est légitime que sur une ligne**.

**Sens produit / UX** — Quatre choses, dont trois viennent de l'œil de l'Auteur et pas du raisonnement.

**Un bouton doit se reconnaître partout.** C'est tout l'objet de l'exception : une pièce qu'on manipule ne change pas de forme selon l'endroit où elle tombe. Elle sort donc de la chaîne — mais **elle ne sort pas du système** : elle descend du ton, ce qui la rend nulle quand le ton est à angle droit. Une première version posait 8 px en dur ; l'Auteur l'a corrigée en une phrase — *« si les bords sont droits sur les cartes alors les boutons par défaut doivent l'être »*. Un rayon déclaré aurait produit des boutons arrondis dans un système carré : le contraire d'un système.

**Le tiers, et pas la moitié — et c'est l'œil qui a tranché.** L'essai montrait un bouton au rayon de sa carte, présenté comme *la limite*. Verdict : *« c'est quand même limite limite »*. La raison est perceptive et vaut règle : **un arrondi se lit par rapport à la taille de l'objet.** Douze sur une carte de quatre cents de haut est discret ; douze sur un bouton de quarante-six est beaucoup. Le tiers du ton place donc le composant sous le rayon de sa carte **par construction** — un tiers contre un demi — et la question du rabattement ne se pose jamais.

**La pastille n'est pas un rayon, c'est une sortie.** Quand un composant serait plus rond que sa carte, ou quand son rayon dépasse la moitié de sa hauteur — auquel cas il s'écrase, et deux valeurs différentes rendent à l'identique —, on ne rend pas un entre-deux mou. On passe à une forme, qui ne se compare plus à un arrondi.

**Et la pastille est une promesse, que l'Auteur a nommée avant qu'elle soit vue.** *« Le composant ne doit être que sur une ligne, jamais plus. »* L'essai l'a confirmé sur pièce : à deux lignes, l'arrondi devient énorme et le texte entre dans la courbe. Un composant dont le libellé peut se replier ne devient donc jamais une pastille — il garde son rayon. C'est la règle de dégagement de la v1, retrouvée par le bas.

**Alternatives écartées** — *Déclarer 8 px en dur, hors du système* (fidèle à la lettre de l'exception, et il produit des boutons ronds dans un système carré) ; *plafonner le composant au rayon de sa carte* (le plafond est atteint dès qu'on égalise, et l'œil a jugé cette égalité déjà trop ronde — le tiers rend le plafond inatteignable) ; *rabattre au rayon de la carte plutôt que passer en pastille* (un rectangle rabattu reste un rectangle qui a échoué à être rond ; une forme, non) ; *laisser la pastille disponible partout* (elle casse dès que le libellé se replie, et un libellé se replie sur un téléphone).

**Conséquences** — Le moteur produit **30 jetons** : `radius-controle` s'ajoute, dérivé comme les autres. Quatre pièces sortent de la chaîne — bouton, champ, liste de choix, jeton — les surfaces y restent. La planche porte la règle en trois temps et le motif de la saturation. Le fichier de règles l'annonce dans ses propres mots. **Batterie 100 %, contrastes, types, lint au vert.** Aucune valeur d'espace n'a bougé ; à réglage égal, le rayon de contrôle vaut toujours 8.

**Ce qui reste ouvert** — Les deux garde-fous ne sont pas mécaniques : rien ne vérifie encore qu'un composant ne dépasse pas sa carte, ni qu'une pastille tient sur une ligne. Le premier est un contrôle d'audit déjà nommé au plan ; le second demande de savoir si un libellé peut se replier, ce que le code ne dit pas encore.

**Impact carte** — Aucun jalon, aucun contrat. Registre : un rayon de plus, dérivé. Deuxième point du plan fait.

---

## #062 — La profondeur se lit au contraste : la page recule, le contenu avance, et l'encre gagne un rang

*2026-08-11 · Statut : 🟢 Verrouillé (décision d'Auteur : « oui, fond de page gris clair et cartes blanches », puis « c'est bon » sur l'avant/après) · Premier point du plan*

**Contexte** — Une source extérieure écrite par l'Auteur portait une règle absente du dépôt : *« une surface qui contient d'autres surfaces est grise, une surface qui contient du contenu est blanche »*. L'Auteur a refusé le mot : **« gris » est un effet dans un thème clair, pas une loi.** Le vocabulaire juste est celui de la profondeur, de la surface, de la luminosité et du contraste, et la loi est celle que Material formule pour l'emphase — plus une information est utile, plus elle s'écarte de ce sur quoi elle est posée.

**Décision** — **La profondeur se lit au contraste.** La page recule ; ce qui porte du contenu avance. Et l'encre porte trois rangs — la donnée, le cadrage, la reformulation — au lieu de deux.

**Sens produit / UX** — Trois choses.

**La reformulation vaut mieux que l'original, et pas seulement en style.** *« Le gris regroupe »* ne survit ni au thème sombre, ni à l'impression, ni à un écran mal réglé. *« La profondeur se lit au contraste »* survit aux trois, parce qu'elle ne nomme aucune couleur. Et surtout : **un contraste est un nombre.** La règle devient donc opposable — *une information déclarée secondaire ne peut pas être plus contrastée que la principale* — là où la version en couleurs n'aurait jamais pu entrer au corpus.

**Le fond de Fili était à l'envers, et la règle ne pouvait pas s'y déployer.** La page était blanche : une surface qui porte n'avait nulle part où aller sauf vers le sombre, donc des cartes grises sur une page blanche — l'inverse de l'intention. Le constat a été posé avant d'écrire une ligne, et l'arbitrage rendu : la page devient la surface en retrait. La conséquence est mécanique — une section ne peint plus rien par défaut, et celle qui porte du contenu se déclare. La propriété change de nom avec son sens : `fond` devient `porte`.

**Trois rangs d'encre ne tenaient pas sans en déplacer un.** Le cadrage et la reformulation partageaient la même valeur, à 6,3 — deux rôles pour un seul ton, donc un rôle de moins qu'annoncé. Et il n'y avait pas de place en dessous : 6,3 était déjà calculé sur le plancher lisible. Le cadrage est donc **remonté à 7**, et la reformulation posée **au plancher, 4,5**. Mesuré sur la nouvelle page : **10,9 · 8,8 · 5,7**. Les trois sont lisibles, aucun n'est un choix, tous descendent d'un seuil déclaré.

**Alternatives écartées** — *Garder « le gris regroupe »* (une règle qui nomme une couleur ne se vérifie pas et meurt au premier thème sombre) ; *poser la reformulation sous le plancher pour ne pas toucher au cadrage* (un rang de plus ne vaut jamais une ligne illisible) ; *garder la page blanche et assombrir ce qui porte* (des cartes grises sur fond blanc, l'inverse exact de la règle) ; *appliquer la règle sans le dire à l'Auteur* (elle change l'aspect des sept écrans — l'apparence se soumet à son œil, pas à un raisonnement).

**Conséquences** — Le fond de page passe en retrait. L'état vide reçoit une surface : il portait du contenu sans en avoir. Une encre de plus au registre, calculée comme les autres. **Batterie 100 %, contrastes, types et linter au vert** ; aucune valeur d'espace n'a bougé, aucun contrat n'est rouvert. Les sept écrans sont regénérés, et l'avant/après a été soumis à l'œil avant enregistrement.

**Ce qui reste ouvert** — L'écart entre la page et une surface qui porte est de **1,10**. C'est volontairement discret — une distinction de surface, pas de texte — mais c'est le seul réglage que l'œil peut vouloir corriger. Et la forme opposable de la règle n'est pas encore mécanique : le robot ne vérifie pas encore qu'une information secondaire ne dépasse pas la principale, faute que les éléments déclarent leur rang.

**Impact carte** — Aucun jalon, aucun contrat. Registre : une encre de plus. Premier point du plan fait ; le reste du temps 1 suit.

---

## #061 — Le protocole de jugement est arrêté : on garde la machine, on abandonne l'appareil de preuve

*2026-08-11 · Statut : 🟢 Verrouillé (décision d'Auteur : « on garde la v2, on arrête le protocole »)*

**Contexte** — L'Auteur a posé la question franchement : repartir sur une v3, ou s'appuyer sur la v2. Elle venait après une journée où il a dit, dans l'ordre, qu'il ne comprenait plus les intentions, qu'il voulait un outil et se retrouvait dans une thèse, et que la seule chose dont il ait vu l'usage était le rythme sémantique. Une source extérieure, écrite par lui, a par ailleurs révélé une dizaine de règles déjà rédigées qui n'ont jamais franchi la porte du dépôt.

**Décision** — **La v2 est conservée. Le protocole de jugement est arrêté.**

Ce qui reste vivant : le robot et ses trente règles, la chaîne de génération, les couleurs calculées, le fichier de règles, les sept écrans comme terrain d'essai.

Ce qui s'arrête : le protocole de référence et ses neuf points de passage, les séances, les témoins datés à chaque génération, et les trois épreuves qui restaient. Rien n'est supprimé — tout reste au dépôt et se rouvre par une entrée de journal.

**Sens produit / UX** — La coupe ne passe pas entre le bon et le mauvais travail, mais entre **deux natures**. Ce qui manque au système, ce sont des règles ; ce qui existe est une machine à faire respecter des règles. Refaire la machine pour y verser des règles serait démolir l'usine parce qu'il manque des pièces sur l'étagère.

Et l'appareil de preuve avait un coût qu'on n'avait jamais chiffré : il existe pour démontrer à un tiers que les règles tiennent. **Il n'y a pas de tiers.** Un seul utilisateur, un seul poste. On payait une démonstration que personne n'attendait, et c'est elle — pas les règles — qui a noyé la journée du 11 août.

**Alternatives écartées** — *Repartir sur une v3* (on jetterait le robot, ses quarante-six sabotages et la chaîne de génération pour ajouter des règles qui s'ajoutent en une soirée chacune) ; *tout garder et avancer quand même* (c'est ce qu'on faisait, et le coût est mesuré : une journée entière d'entretien pour zéro valeur produite) ; *supprimer le protocole au lieu de l'arrêter* (une décision qui s'efface ne se rouvre pas, elle se refait de zéro).

**Conséquences** — Les jalons qui dépendaient des séances passent **en sommeil**, pas en échec. La suite est une liste de règles à verser, une par une, chacune avec son test — dans l'ordre écrit au fil suivant. Aucun contrat n'est rouvert, aucune règle du corpus n'est touchée.

**Ce que cette décision ne règle pas** — La question du produit reste ouverte : si le besoin devient « un outil que j'emmène ailleurs », le moteur et le robot partiraient seuls dans un petit dépôt et les sept écrans s'endormiraient. Elle n'est pas tranchée ici.

**Impact carte** — Section 4 : l'instrument de la Voie B passe **arrêté**. Jalons suivants : **en sommeil**. Le reste ne bouge pas.

---

## #060 — La géométrie est confrontée à sa source, et la journée montre que la mémoire du projet ne vivait pas là où on la lisait

*2026-08-11 · Statut : 🟢 Verrouillé (arbitrages d'Auteur rendus dans la journée) · Complète `#058` et `#059`*

**Contexte** — `#058` a fait entrer l'Échelle Semantic Rhythm dans le dépôt et `#059` l'a exécutée, mais elle y est entrée **reconstruite** : le fichier d'origine n'était pas accessible, et le moteur portait en tête l'aveu de ce qu'il avait déduit plutôt que lu. La pièce se déclarait elle-même *« pas vérifiée contre la source »*. L'Auteur a fourni la source dans la journée. Elle a été lue ligne à ligne.

**Décision** — Six arbitrages, rendus dans l'ordre où ils se sont posés.

**(1) La source fait foi, et la confrontation est écrite.** Le moteur passe de trois axes à **cinq** : s'ajoutent **le texte** (0,96 → 1,07) et **les contrôles** (1 → 1,06), relevés à l'identique. Le **bord structurel** devient un jeton au lieu d'une valeur dérivée sans nom.

**(2) Les titres cessent d'être des tailles écrites pour devenir des pas.** Le corps est l'origine, un titre de niveau 2 est à un pas de l'intervalle, un titre de niveau 1 à deux pas. La planche cesse de les déclarer et pointe sur le calcul.

**(3) Le corps est 16, la base commune partout.** L'écart à 17 que la planche portait comme une décision de lecture est retiré, sur arbitrage d'Auteur. Le titre de niveau 3 rejoint le corps — zéro pas — au lieu de traîner un 17 orphelin.

**(4) Le rayon descend de la marge.** *« Le rayon EST le padding, qui est la source. »* Il n'y a plus de rayon de départ à choisir : la loi de l'octave est conservée, mais son origine est la marge du premier niveau. Un dénominateur disparaît sans qu'aucune valeur bouge — les rayons restent 12, 6, 3.

**(5) Deux écarts à la source ne sont PAS corrigés.** La source ne porte qu'un écart — base ÷ 2 — quand le dépôt en dérive un par profondeur ; et elle s'arrête à trois profondeurs quand le dépôt en porte cinq. Ils touchent **56 emplois dans les sept écrans** : les corriger serait une refonte visuelle, pas une correction. Ils sont déclarés dans la pièce générée.

**(6) Les noms de jetons de Fili restent la référence ; ceux de l'outil sont des alias.** Un lexique de 15 correspondances et 7 intraduisibles est produit, avec un fichier d'alias qui permet d'écrire dans la langue de l'outil sans réécrire quoi que ce soit.

**Sens produit / UX** — Cinq choses, dont trois n'étaient pas cherchées.

**Ce qui manquait n'était pas une valeur, c'était une dimension.** Les deux axes écartés par `#058` l'avaient été sur un motif d'ordre — *la typographie et les cibles sont arbitrées à la planche, on ne rouvre pas*. Le motif était juste sur le périmètre et faux sur la nature : la planche déclare **quelles tailles existent**, l'axe déclare **comment elles respirent quand la largeur change**. Deux questions différentes, et écarter la seconde laissait le texte immobile pendant que tout bougeait autour.

**Un titre écrit est un titre arbitraire.** La planche portait `clamp(28px, 4vw, 42px)` : trois nombres, aucune raison. C'est ce que `#050` avait établi pour l'espace — *on ne demande plus quel écart, mais à quelle profondeur* — appliqué au texte, où personne n'avait vu que la même faute s'y trouvait.

**Une loi ne se juge pas sur un préréglage, mais sur tous.** L'Auteur a relevé que 24 vaut 16 × 1,5, et proposé d'en faire une loi. La vérification l'a écartée : sur les six intentions de l'outil, les bases valent 16, 20, 24, 24, 28, 32, soit des rapports de 1 à 2 qui ne se répètent jamais. Ce qui se répète, c'est un **pas de 4**. Ce n'est donc pas une filiation, c'est une grille commune. À l'inverse, la loi du rayon tenait dans les six, et elle a été retenue. **Le test d'une loi, c'est qu'elle survive à tous les réglages, pas au réglage courant.**

**Et quand l'œil ne départage pas, la question change de juridiction.** Un banc d'essai a été monté — base, intervalle, écart unique ou par profondeur, trois lois de rayon — et le verdict de l'Auteur a été : *« visuellement toutes les combinaisons sont correctes »*. Ce n'est pas un échec de l'essai, c'est son résultat. Le critère cesse d'être *laquelle est la plus belle* et devient **laquelle supprime une décision sans supprimer un pouvoir**. Appliqué : l'écart par profondeur est conservé parce qu'un écart unique rendrait la règle de proximité insatisfiable — on perdrait une règle sur trente pour ne rien gagner de visible. La configuration du dépôt était déjà la bonne ; ce qui manquait, c'était le motif.

**Le vrai enseignement de la journée n'est pas géométrique.** La séance a commencé par des heures perdues à reconstruire des cartes et des états des lieux qui existaient déjà, à jour, dans le dépôt. La cause est nette : **les documents du projet étaient périmés — arrêtés à `#050` — et ils ont été lus comme s'ils faisaient foi.** `#051` avait fait descendre le journal au dépôt et `#057` avait clos l'archive du projet, mais rien n'empêche une session d'ouvrir l'ancienne copie et de la croire. C'est la panne de `#049` sous une autre forme : là elle effaçait la mémoire, ici elle la duplique. Une mémoire dupliquée n'est pas une sauvegarde, c'est une source concurrente.

**Alternatives écartées** — *Réaligner les cinq profondeurs sur les trois de la source dans le même geste* (fidèle à la lettre, et il aurait changé l'aspect des sept écrans sans que personne les regarde — le geste que le protocole de référence existe pour empêcher) ; *ramener l'écart à une valeur unique* (même motif, plus une conséquence propre : R3.7 perdrait son objet le jour même où `#058` vient de l'aligner sur le ratio) ; *garder le corps à 17 pour ne pas toucher aux écrans* (c'eût été préférer le confort d'une surface à une base commune tenue de bout en bout, et l'Auteur a tranché l'inverse) ; *faire de 24 = 16 × 1,5 une loi* (elle ne tient que dans un préréglage sur six) ; *renommer les jetons sur ceux de l'outil* (ils se lisent mieux, c'est reconnu — mais le nom du jeton est la prise de la règle des espaces, qui se déclenche sur `inline-` et `block-` : ce serait réécrire une règle verrouillée, son registre, la configuration et 56 emplois pour un gain de confort) ; *ajouter les noms de l'outil comme classes en plus* (deux façons légales d'écrire la même valeur, ce que ce système interdit partout ailleurs) ; *écrire la loi des titres dans la planche* (la planche déclare des valeurs permises ; une valeur qui se calcule n'a rien à y faire, et l'y mettre ferait deux sources pour un même nombre).

**Conséquences** — Le moteur produit **29 jetons** au lieu de 23. La pièce générée porte `$verifie` à la place de `$reconstruit`, plus un `$ecartsDeclares` qui nomme les deux points restants et leur coût. **Sept dénominateurs** au lieu de huit. **Batterie à 100 %, intégrité 30/30, types et lint sans erreur, contrastes au vert, journal scellé** : aucun contrat rouvert, aucune règle touchée.

**Trois pièces nouvelles.** `public/systeme/index.html` — la page unique du système, générée depuis les sources du dépôt, qui porte en tête une **cartographie** : sept décisions, 65 valeurs qui en descendent, 76 encore posées une par une, et les sept qui retombent déjà sur un nombre connu. `fili/lexique.json` et `src/lexique.genere.css` — la correspondance avec l'outil de l'Auteur, qui **refuse de statuer** si un jeton cité manque. Et deux générateurs : `tools/fili/systeme/` et `tools/fili/lexique/`.

**Deux bugs trouvés et corrigés.** Le générateur de la planche plantait depuis `#058` : il appelait deux rayons — `doux` et `controle` — supprimés par la migration. Il ne produisait plus rien, et personne ne l'avait vu.

**Le dépôt est rangé.** Les huit pièces `fili.*.json` vivent dans `fili/`, les preuves de K1 dans `archive/`, les anciens aperçus et le dossier de compilation sont sortis. La racine passe de 30 lignes à 24.

**Ce que cette entrée ne règle pas** — Les deux écarts à la source restent ouverts et se jugeront à l'œil, sur un écran entier et non sur une carte. Les 76 valeurs choisies une par une restent choisies, dont **cinq provisionnées sans aucun emploi** — une troisième police, un rail, une bascule bureau, deux niveaux d'ombre — qui peuvent disparaître sans rien casser. Et rien n'empêche encore une session d'ouvrir les documents périmés du projet et de les croire.

**Impact carte** — Aucun jalon ne bouge, aucun contrat ne bouge. La géométrie passe de **reconstruite** à **vérifiée contre la source**, avec deux écarts déclarés et chiffrés. Ajout de `fili/lexique.json` et de `public/systeme/index.html` aux documents vivants.

---

## #059 — La géométrie du dépôt passe à l'Échelle : l'espace cesse d'être un nombre qu'on choisit
*2026-08-11 · Statut : 🟢 Verrouillé mécaniquement, 🟡 non jugé par l'œil · Exécute `#058` · Ferme le chantier « Migration de la géométrie vers l'Échelle Semantic Rhythm »*

**Contexte** — `#058` a instruit le chantier et tranché quatre points ; rien
n'avait été écrit. L'Auteur a donné son feu vert le même jour. Ce qui suit est
l'exécution, et elle n'a rouvert aucun contrat.

**Décision** — La géométrie du dépôt est celle de l'Échelle, et elle l'est
partout à la fois : registre, planche, configuration, composants, épreuves,
gardien.

**(1) L'espace n'a plus de nombre.** L'échelle déclarée était une liste de
quatorze crans en pas de quatre ; elle est désormais une liste de **noms de
profondeur** — `large`, `page`, `coque`, `carte`, `detail`. Les nombres vivent
dans une pièce générée que personne n'écrit à la main, et chaque utilitaire
pointe sur une variable, jamais sur une valeur.
**(2) Les deux axes se séparent.** Le nom d'un jeton porte son axe. Un jeton
horizontal posé sur une propriété verticale n'appartient pas à l'échelle de
cette propriété, et une propriété qui porte les deux axes à la fois — `p-…`,
`gap-…` — n'a plus aucun jeton valide. **Cela n'a demandé aucune assertion
nouvelle** : c'est R3.1 qui le voit, parce que sa mécanique de lecture a changé,
pas sa règle.
**(3) Le facteur de proximité suit le ratio.** Trois devient 1,414. La règle
garde sa forme — un plancher entre l'écart d'un groupe et celui de ses enfants.
**(4) Le rayon suit la profondeur.** Les quatre rayons de la planche, qui
n'avaient aucune valeur commune avec la loi du ÷2, deviennent les trois rayons
de la loi, plus « net » et « pastille » qui n'en sont pas.
**(5) Tout est fluide.** Vingt-trois jetons bougent avec la largeur d'écran, et
les deux axes ne bougent pas ensemble.

**Sens produit / UX** — Trois choses, et la troisième est un aveu.

**Ce que la migration ferme.** On ne demande plus à qui écrit un écran de
choisir un écart, on lui demande **à quelle profondeur il se trouve** — un fait
lisible dans la structure, pas un arbitrage. C'est le critère d'admission de
`#027`, *décidable sans contexte*, appliqué à l'espace. La conséquence
mécanique est là : la table de correspondance a fait tomber cinq anciens crans
sur un seul, sans qu'aucune décision d'écran ait à être reprise.

**Ce qu'elle coûte, et qui se voit.** Les sections respirent moitié moins — 64
devient 34, 96 devient 48. Les boutons s'arrondissent trois fois moins. Les
pastilles épaississent. **Aucune de ces valeurs n'a été choisie** : elles
descendent toutes de la base 24 et du ratio √2, et une seule ligne les refait
toutes. C'est exactement ce que l'Échelle promet, et c'est aussi ce qui rend
l'objection possible : la séance ne discutera pas d'un écran, elle discutera de
la base et du ratio.

**Ce que le vert ne dit pas.** Trente assertions portées, quatre-vingts épreuves
au vert, quarante-six sabotages détectés sur quarante-six. Cela dit **que rien
n'a été inventé**. Cela ne dit **pas** que le produit est mieux réglé qu'hier —
le thread du kit l'a établi sur pièce, un écran peut être conforme à cent pour
cent et moins bon à l'œil. C'est pourquoi les sept témoins n'ont pas été
remplacés : chacun existe dans ses deux états, et la planche de comparaison les
met côte à côte, rendus, à largeur réglable. **La migration est verrouillée
mécaniquement ; elle n'est pas jugée.**

**Alternatives écartées** — *Traduire les nombres des deux pièges de proximité*
(leur piège est un rapport, pas un nombre : traduits, ils seraient passés au
vert — ils sont donc réécrits dans leur intention, deux groupes emboîtés au même
rang, et échouent toujours pour la même règle) ; *laisser R3.1 masquer
l'interdiction des marges* (le sabotage « désactiver R3.2 » ne faisait plus
virer qu'une épreuve sur quatre au lieu de quatre — il restait « détecté » sans
plus rien démontrer ; les marges portent donc leur axe elles aussi, et le
sabotage retrouve toute sa portée) ; *laisser les mesures du squelette écrites
dans le composant* (elles y étaient sans provenance ; elles descendent à la
planche **sans changer d'un pixel**) ; *ajouter G7, la règle qui interdit de
mélanger les axes, au corpus* (ce serait ouvrir S3, et l'interdit tient : R3.1
suffit).

**Conséquences** — **Aucun contrat rouvert** : S3 garde ses sept assertions,
R3.7 a changé de valeur et pas de forme, l'intégrité exige toujours les trente.
**Aucune épreuve ni aucun seuil corrigé en silence** : les libellés de la
batterie ont été remis en accord avec ce qu'ils décrivent, et les deux
réécritures sont nommées ci-dessus. **Deux dettes nouvelles, écrites plutôt que
découvertes** : la partie responsive du moteur n'a pas de preuve contre la
source tant que le générateur n'est pas revenu au dépôt ; et les deux hauteurs
de témoin de la planche se justifiaient par « multiples de l'échelle
d'espacement » — la phrase n'a plus d'objet, les valeurs restent justes, leur
provenance est à réécrire. **Une dette ancienne s'est manifestée sur pièce** :
le script de mutation, interrompu par la limite de durée de l'environnement, a
laissé une règle éteinte et une épreuve mutée ; le contrôle d'intégrité l'a vu,
la remise en état a été faite à la main, et le script tourne désormais par
salves. **Un verrou git périmé du 7 août** bloquait toute opération sur le
dépôt ; il a été écarté.

**Impact carte** — Dernière décision au journal : `#059`. Les sept gabarits
restent 🟡 : leurs témoins existent maintenant en deux états, et aucun n'est
jugé. Dettes nouvelles : la partie responsive sans preuve contre la source, la
provenance des hauteurs de témoin. Pièces nouvelles : `fili.geometrie.json`,
`src/geometrie.genere.css`, `tools/fili/geometrie/`, la planche de comparaison
avant/après.

---

## #058 — L'Échelle Semantic Rhythm devient la loi du dépôt, et c'est le facteur de proximité qui cède
*2026-08-11 · Statut : 🟡 En cours (chantier instruit, aucune ligne écrite) · Décision d'Auteur : « L'Échelle Semantic Rhythm fait loi » · Prolonge `#050` au dépôt*

**Contexte** — `#050` a aligné la dérivation du kit de création sur le
générateur de l'Auteur. La décision d'aujourd'hui étend cette loi au **dépôt**,
et non plus au seul kit. L'état a été relevé sur pièce le 11 août, avant toute
écriture. Le registre porte une échelle de quatorze crans en pas de quatre, sa
table de pixels, et un facteur de proximité de trois. La planche porte quatre
rayons — zéro, deux, huit, pastille — qui n'ont **aucune valeur commune** avec
la loi du rayon divisé par deux. La configuration lit les deux fichiers. Dans le
produit, **dix fichiers** portent l'échelle : neuf composants et la table des
écarts. Les sept écrans, eux, n'en portent **aucune** — la règle qui interdit à
une page d'écrire son espace a tenu, et c'est elle qui rend la migration
faisable. Côté épreuves, **dix-sept sur quatre-vingts** portent une valeur
d'espacement et **huit sabotages sur quarante-six** visent la discipline
spatiale. Enfin, sur les quatre rayons déclarés, **deux seulement** sont posés
dans le produit.

**Décision** — Quatre, et la première tranche une contradiction rouverte par
l'Auteur.

**(1) Le facteur de proximité suit désormais le ratio.** La règle garde
exactement sa forme — un plancher à ne pas passer entre l'écart d'un groupe et
celui de ses enfants — et ne change que de valeur : trois devient le ratio de
l'Échelle.
**(2) La migration va jusqu'au bout, fluidité comprise.** L'échelle déclarée
cesse d'être une liste de nombres pour devenir une liste de noms, et l'axe
unique se sépare en deux, horizontal et vertical.
**(3) Le moteur est reconstruit d'après la note de dérivation**, le fichier
d'origine n'étant plus accessible depuis le dépôt.
**(4) Les sept témoins ne tombent pas** : chacun sera produit dans ses deux
états, avant et après, pour que la séance juge la migration au lieu de la subir.

**Sens produit / UX** — Quatre raisons, une par décision.

**Le facteur cède parce qu'il n'est atteignable sous aucun réglage.** Ce n'est
pas un cas limite ni un désaccord de tempérament : l'Échelle sépare deux
profondeurs par son ratio, et ce ratio est borné à 2,2. Trois n'est pas
accessible, même en poussant l'Échelle à son maximum. Or les deux nombres
servent la même intention — empêcher deux niveaux d'emboîtement de se
ressembler — sauf que le facteur trois l'obtenait par un seuil posé de
l'extérieur, quand le ratio l'obtient **par construction**. Garder le trois
imposerait de choisir l'octave et de sauter un niveau à chaque emboîtement :
on tordrait la respiration de sept écrans pour sauver un nombre dont le rôle
est déjà tenu. C'est une correction de valeurs, pas une réouverture de S3 : la
règle continue d'énoncer exactement ce qu'elle énonçait.

**La fluidité entre maintenant parce qu'à moitié, on paierait deux fois.**
Migrer le seul socle serait la voie la plus sûre à prouver, mais elle figerait
le rythme à une largeur d'écran et laisserait une seconde migration — celle de
la mécanique, pas des valeurs — à faire plus tard sur un dépôt déjà déplacé.
Ce que l'Échelle apporte au-delà des nombres est justement ce qu'un socle figé
ne porte pas : on ne demande plus de **choisir** un écart, on demande **à quelle
profondeur on se trouve**, et cela ne se décide pas au cas par cas.

**La reconstruction sans source est déclarée, jamais présentée comme vérifiée.**
La loi du socle est écrite noir sur blanc dans la note et sera exacte. La partie
responsive, elle, sera reconstruite de mémoire : elle portera cette mention
partout où elle apparaît. Une valeur reconstruite qu'on laisserait passer pour
une valeur vérifiée serait la faute que le projet nomme depuis son origine.

**L'avant/après existe parce que le vert du gardien ne dit pas que c'est bien
réglé.** Le thread du kit l'a établi sur pièce : un écran peut être conforme à
cent pour cent et **moins bon à l'œil**. Le gardien dit « rien n'a été inventé »,
il ne dit jamais « le bon rôle a été employé ». Migrer sans montrer les deux
états, ce serait demander à la séance de juger un résultat sans point de
comparaison — et lui faire porter, sans le dire, une régression qu'elle ne
pourrait pas nommer.

**Alternatives écartées** — *Monter le ratio à l'octave pour sauver le facteur
trois* (le nombre survivrait, la respiration des sept écrans changerait
beaucoup, et exiger deux niveaux d'écart à chaque emboîtement contredit le
modèle en trois profondeurs) ; *séparer les écarts et les marges en deux
mécaniques distinctes* (invérifiable sans le fichier source, et rétablir deux
lois d'espacement est précisément ce que la migration défait) ; *migrer le socle
seul* (voir ci-dessus : deux migrations au lieu d'une) ; *déclarer les sept
témoins caducs et les régénérer après coup* (simple, mais la séance repartirait
sans comparaison) ; *tenir la séance avant de migrer* (on verrouillerait sept
gabarits sur une échelle qu'on sait condamnée le jour même).

**Conséquences** — **Aucun contrat n'est rouvert.** S3 garde ses sept
assertions portées et actives ; R3.7 change de valeur, pas de forme ; le
contrôle d'intégrité continue d'exiger les vingt-neuf. **Une dette nouvelle
s'ouvre et elle est écrite plutôt que découverte** : la partie responsive du
moteur n'aura pas de preuve contre la source tant que le générateur n'est pas
revenu au dépôt. **Une charge pèse sur le gardien** : il juge aujourd'hui
l'appartenance d'un nombre à une liste, il devra juger l'appartenance d'un nom —
c'est sa mécanique de lecture qui change, pas sa règle. **Les sept gabarits
restent 🟡**, mais leurs témoins du 7 août cessent d'être l'unique état de
référence. **Rien n'est écrit à cette heure** : ni valeur, ni épreuve, ni seuil.

**Impact carte** — Dernière décision au journal : `#058`. Dette nouvelle : la
partie responsive du moteur sans preuve contre la source, 🔴 ouverte. Chantier
« Migration de la géométrie vers l'Échelle Semantic Rhythm » : ⚪ → 🟡 instruit.

---

## #057 — Le journal est tranché : les douze entrées revenues ne rentrent pas, et ce qui doit survivre ne vit plus dans un document de projet
*2026-08-07 · Statut : 🟢 Verrouillé (arbitrage rendu sur demande d'Auteur : « Tranche le journal ») · Clôt `claude/incident-journal-2026-08-07.md` et `claude/cause-seconde-perte-journal.md`*

**Contexte** — `#049` a acté la perte de quarante-deux entrées et adopté trois
règles. `#051` a fait descendre le journal vivant au dépôt, sous empreinte.
Restaient deux questions ouvertes, écrites en toutes lettres au bas de
`claude/cause-seconde-perte-journal.md` et jamais tranchées : **les douze
entrées récupérées à l'identique réintègrent-elles le journal**, et **la
quatrième règle entre-t-elle au cadre**. Une troisième s'était ajoutée sans que
personne l'écrive : le tableau d'orientation du journal déclare `#001` à `#042`
« nulle part », ce qui est **faux depuis 15h15** pour douze d'entre elles.

**Décision** — Trois choses, et la première est un refus.

**(1) Les douze entrées revenues ne réintègrent pas le journal.** Elles restent
à leur propre chemin, `claude/sauvetage-journal-001-012-verbatim.md`, avec leur
provenance, et le tableau d'orientation les désigne.
**(2) La quatrième règle entre au cadre, doublée d'une règle de structure** qui
la rend inutile partout où celle-ci s'applique.
**(3) Le tableau d'orientation porte désormais trois sorts, et non deux.**

**Sens produit / UX** — Quatre arguments, dont trois sont des refus.

**Deux sorts différents doivent rester lisibles ; les fondre les rendrait
indistincts.** `#001`–`#012` sont revenues **à l'identique** — une copie
authentique, pas une reconstruction. `#013`–`#042` sont perdues. Rangées
ensemble dans le journal, elles produiraient un document qui se lit comme un
journal à **un seul trou**, alors qu'il y a **trois sorts distincts** : revenues,
perdues, gelées. Le tableau d'orientation existe exactement pour porter cette
distinction. S'en servir, c'est l'honorer ; le contourner pour faire plus joli,
c'est le vider.

**Et la réintégration demanderait le geste même qui a coûté quarante-deux
entrées.** Écrire douze entrées dans le journal, c'est réécrire le fichier
entier. On paierait ce risque-là pour un gain de confort de lecture. Ce n'est
pas de la prudence : c'est la règle *(1)* de `#049` appliquée à celui qui
prétend réparer, et `#049` avait déjà nommé le piège — la première consigne de
récupération demandait de réécrire le journal en entier, c'est-à-dire de refaire
le geste en plus grand.

**Une copie qui a traversé une perte est une pièce, pas une entrée vivante.**
La ranger parmi les entrées que rien n'a jamais atteintes la rendrait
indiscernable d'elles, et le fait qu'elle soit revenue disparaîtrait avec la
distinction. C'est la faute que `#016` interdit sur les témoins — juger une
transposition au lieu de l'original — transposée à la mémoire du projet.

**Une règle de discipline ne vaut rien seule ; celle-ci est donc doublée.** La
quatrième règle dit : *une lecture ne vaut que pour l'instant où elle a eu lieu ;
toute écriture sur un document vivant est précédée d'une relecture immédiate, et
se construit sur elle — jamais sur un instantané pris plus tôt dans la session.*
Elle est juste, et `#020` a établi ce que vaut une garantie qui repose sur
l'attention de quelqu'un au bon moment. Elle entre donc accompagnée d'une règle
de structure : **ce qui doit survivre vit au dépôt, sous empreinte ; un document
de projet est une pièce, jamais de la mémoire vivante.** Là où la seconde
s'applique, la première n'a plus à être tenue par personne — c'est déjà fait
depuis `#051`, et c'est pourquoi la perte ne peut plus se reproduire sur le
journal.

**Ce qui reste non couvert, et qui est écrit plutôt que découvert** — Un
document de projet est remplacé **en entier** à chaque mise à jour, et rien ne
le voit. Aucune empreinte n'est possible sur cette matière. Le cadre y répond
par la seule garantie disponible : **le gel**. Un document clos ne se perd pas
par réécriture, parce que personne ne le réécrit. Sont clos par cette entrée :
`claude/journal.md` (entrées `#043`–`#049`), les deux documents d'incident, et
la pièce de sauvetage.

**Alternatives écartées** — *Réintégrer les douze entrées dans le journal* (le
document redeviendrait presque continu, et on paierait ce confort par le geste
qui a coûté quarante-deux entrées, en fondant au passage deux sorts qui doivent
rester lisibles) ; *renuméroter pour supprimer le trou* (déjà écarté par `#049`,
rappelé ici parce que le retour des douze rend la tentation plus vive — un
journal qui court de `#001` à `#012` puis reprend à `#043` ressemble presque à un
journal, et cette ressemblance est précisément le mensonge) ; *reconstruire les
trente entrées restantes à partir de la synthèse de treize entrées consignée au
§4 du document d'incident* (le faux indétectable ; `#049` tient, et la synthèse
n'est pas le journal) ; *rouvrir la voie de récupération n°1 — demander son texte
à la session qui a réécrit le fichier* (`claude/cause-seconde-perte-journal.md`
a établi qu'elle n'avait jamais lu `#013`–`#042` : la voie était morte avant
d'être ouverte, et l'écrire évite qu'on y revienne) ; *sceller le journal du
projet comme celui du dépôt* (rien ne peut le sceller — la plateforme ne porte
pas d'empreinte par entrée ; le geler est la seule garantie disponible, et elle
est mécanique par absence d'écriture, pas par vigilance).

**Conséquences** — Le tableau d'orientation du journal porte **trois sorts**.
La dette des entrées perdues porte sur **trente** entrées, et non plus
quarante-deux. **Deux règles entrent au cadre**, opposables à tous les threads :
la relecture immédiate avant écriture, et le partage entre ce qui vit au dépôt
et ce qui est une pièce close. Quatre documents de projet sont **clos** : aucune
session ne les réécrit. Le sceau du dépôt couvre `#050` et au-delà, et il ne
sera jamais étendu en arrière : l'étendre reviendrait à enregistrer comme passé
de référence un état qui ne l'est pas — le blanchiment que `#049` avait déjà
refusé. Aucun contrat rouvert, aucune ligne de code.

**Ce que cette entrée ne répare pas** — **Trente entrées.** Elles ne
reviendront pas, et rien de ce qui précède ne compense leur perte : il organise
seulement ce qui reste pour qu'on ne le perde pas aussi.

**Impact carte** — Dette *Les entrées `#001` à `#042`* : reformulée — trente
entrées perdues, douze revenues à l'identique et rangées hors du journal.
§6 : ajout de `claude/sauvetage-journal-001-012-verbatim.md` comme pièce close.

---

## #056 — É1 rendait quatre états sur cinq : le succès manquait, et c'est l'annonce qui manquait avec lui
*2026-08-07 · Statut : 🟢 Posée (les cinq états de É1 sont rendus) · Débloque la séance É1 annulée le même jour*

**Contexte** — La première séance du protocole de référence, ouverte sur É1 · Le
verdict, a été **annulée avant tout regard** : K2 §6 déclare cinq états pour ce
gabarit, le témoin du 7 août en rendait quatre. L'état **Succès — « Run
consigné, daté »** n'existait pas. Le protocole a arrêté la séance sur un
critère binaire, sans qu'un œil se dépense — ce qui est exactement ce qu'on lui
demandait de savoir faire, et la première chose qu'il ait jamais faite.

**Décision** — **Le cinquième état de É1 est construit et rendu.** Le
vocabulaire du succès était écrit et arbitré au catalogue ; ce qui manquait
était **la situation dans laquelle l'écran le dit**, et **le fait qu'il le dise
à quelqu'un**.

**Sens produit / UX** — Trois choses, et la deuxième est la seule qui compte.

**Le succès de É1 n'est pas un autre écran : c'est le même écran juste après le
geste.** Les cinq sources portent exactement ce que porte le nominal. Cela a été
choisi contre la solution qui aurait mieux « montré » : fabriquer un écart de
données entre les deux états aurait fait juger, en séance, une différence que le
produit ne produit pas. Un témoin qui exagère ce qu'il montre ne témoigne plus.

**Un succès qui ne s'annonce pas n'est pas un état, c'est une nuance.** L'écran
savait déjà dire « Run consigné » — mais il le disait en changeant **trois mots
d'intitulé**, et **rien du tout** pour quelqu'un qui écoute la page. Un opérateur
au lecteur d'écran appuyait sur *Consigner ce run* et n'entendait pas que son
acte avait abouti. C'est la **perte n°1 du run de K1** qui revenait par l'autre
bout : là elle portait sur le refus, ici sur la réussite. Le succès prend donc un
**rôle d'annonce** — « statut » et non « alerte » : un acte réussi rend compte,
il n'interrompt pas.

**L'annonce reste à l'endroit du geste, et le contrat de lecture de É1 n'est pas
touché.** Ce qui compte d'abord sur É1 est **l'intégrité du juge**, avant le
verdict. Faire remonter le run tout juste consigné en tête de page aurait été
plus spectaculaire, et aurait déplacé la primauté déclarée — un arbitrage de
K2 §5 rouvert en douce par une commodité d'affichage. L'annonce vit dans la
section de l'acte, une seule fois dans la page, conforme à la sixième règle de
ton du catalogue.

**Alternatives écartées** — *Ne rien changer à l'écran et se contenter de
brancher la situation manquante* (le plus petit geste possible : le cinquième
fichier existait, la condition d'admission était remplie, la séance pouvait
s'ouvrir — écarté parce qu'on aurait présenté au jugement un état qui se
distingue à peine du nominal et qui reste muet à l'oreille, c'est-à-dire acheté
l'admissibilité en fabriquant un refus probable) ; *faire remonter le run
consigné en tête de page* (la primauté de É1 n'est pas une préférence
d'affichage) ; *fermer l'acte après consignation, bouton retiré ou indisponible
avec motif* (un poste de gouvernance se rouvre chaque jour, et consigner un
nouveau run n'est pas une exception à traiter mais le geste normal ; rendre le
bouton indisponible aurait de plus demandé un libellé absent du catalogue, donc
un arbitrage de vocabulaire pour un cas qui n'est pas un problème).

**Ce que la construction a trouvé et qui n'était pas cherché** — Le signal de
succès de É1 était **posé sur l'état vide**. Le témoin « vide » portait donc un
acte réussi que rien ne pouvait rendre — il n'y avait aucun run à montrer — et
l'état de succès, lui, n'était jamais demandé. Le cinquième témoin manquait par
là, et non par oubli d'écriture. Le défaut était **invisible au Gardien** : rien
dans le corpus ne vérifie qu'un état déclaré au contrat est effectivement
atteignable. C'est écrit ici pour que personne ne le redécouvre, et c'est un
candidat pour **S6**.

**Ce qui entre au système** — Le composant d'annonce porte désormais **trois
registres** au lieu de deux : le refus, l'attente, et **ce qui vient d'être
acquis**. Le troisième n'invente aucune couleur — il reprend le couple déjà
calculé pour le succès et la forme déjà déclarée à la planche, sous **le même
nom de ton que le jeton**, pour qu'un état n'ait pas deux noms selon l'endroit
où on le lit. Mesuré : **5,58:1** pour le texte de l'annonce sur son fond.

**Ce qui entre à l'outillage** — Une lignée de témoins peut désormais se
réimprimer **seule**. Avant, compléter un gabarit obligeait à réécrire les six
autres, que rien ne mettait en cause. Le filtre choisit **quelles lignées**
repartent ; il ne choisit jamais **quels états** d'une lignée sortent — les
états d'un gabarit doivent sortir du même geste, le même jour, depuis la même
source vérifiée, sinon deux états du même témoin ne montrent plus tout à fait le
même écran.

**Conséquences** — La lignée É1 du 7 août porte **cinq états**, et les quatre
déjà rendus sont réimprimés **identiques au corps près**. La troisième condition
d'admission du protocole est remplie pour É1. **La séance annulée peut se
rouvrir.** Elle ne se rouvre pas d'elle-même : c'est un acte d'Auteur. Mesuré
sur les cinq états : aucun débordement de 320 à 2560 px, batterie à 100 %,
intégrité 29/29.

**Ce que cette entrée ne prouve pas** — Rien du témoin. Il n'a pas été regardé.
Il est **admissible**, ce qui est un fait de fabrication et non un verdict
d'œil. Et la primauté déclarée de É1 à É4 reste **hors du froid** depuis le
7 août : ce fait consigné par la séance annulée n'est pas effacé.

**Impact carte** — É1 passe à **cinq états**. La ligne « aucune séance tenue »
reste vraie. Aucun statut ne passe au 🟢.

---

## #055 — É7 · L'acte ferme la construction : sept gabarits, trois parcours, et le produit n'écrit pas dans sa propre mémoire
*2026-08-07 · Statut : 🟡 En cours (les sept écrans existent et tiennent ; aucun n'est jugé) · Achève la construction de K5*

**Contexte** — Six gabarits tenaient debout. Restait É7, le seul écran qui
**produit** quelque chose, et le seul dont K2 §10.3 exigeait qu'il rende
**mécanique** l'interdiction de retoucher une entrée passée. Deux arbitrages ont
été rendus avant écriture : le formulaire **s'ouvre sur ce que la décision
ferme**, et le brouillon porte **l'entrée et le déplacement de statut
ensemble**.

**Décision** — **É7 · L'acte est construit**, avec les **cinq états** que K2 §6
déclare pour lui. **La construction de K5 est achevée : sept gabarits, trois
parcours, trente et un témoins.** Un quinzième composant entre au système,
`Selection`. Le numéro d'entrée est **calculé**, le garde-fou du verrou est
**mécanique**, et Fili **ne touche jamais au journal**.

**Sens produit / UX** — Quatre choses, dont trois découlent de vos arbitrages
plutôt que de la technique.

**L'ordre du formulaire est une mesure, pas une commodité.** L'écran s'ouvre sur
une seule question — *qu'est-ce que cette décision ferme ?* — et le récit vient
après. Écrites en dernier, dans l'ordre du fichier, les conséquences se rédigent
quand la décision est déjà racontée, donc **déjà défendue** : on décrit alors le
coût d'une chose qu'on a fini de justifier, et le coût s'allège tout seul. C'est
la même mécanique que la mesure d'ouverture du protocole, où la primauté perçue
se prononce avant toute déclaration : **ce qui est demandé en premier est la
seule chose qu'on ne peut pas rattraper.**

**Le verrou ne se déclare plus, il se mérite — et c'est le dépôt qui le dit.**
Le passage à « Verrouillé » est **refusé** tant que la batterie et le contrôle
d'intégrité ne sont pas au vert. Ce n'est pas une case à cocher ni un avertissement :
l'option existe dans la liste, elle est **montrée et indisponible**, et le motif
se lit à côté. La distinction compte — une option retirée de la liste laisse
croire qu'elle n'existe pas, alors qu'elle existe et qu'elle n'est pas ouverte
maintenant. K2 §10.3 demandait que ce garde-fou cesse d'être de la discipline ;
il l'a cessé.

**Fili n'écrit pas dans le journal, et c'est ce qui protège le journal.** Votre
arbitrage — *Fili prépare, vous validez au dépôt* — a une conséquence qui n'était
pas son motif : **une entrée passée reste hors de portée du produit, parce que
le produit n'a jamais la main dessus.** L'absence de geste d'édition n'est donc
pas seulement l'absence d'un bouton, c'est l'absence de la capacité. C'est la
forme la plus forte que pouvait prendre l'exigence de K2 §10.3, et elle a été
obtenue en retirant du pouvoir au produit plutôt qu'en lui ajoutant une règle.

**Et le numéro se calcule.** Le saisir à la main est la façon la plus simple
d'écrire deux fois le même, et un journal à numéros dupliqués ne se relit plus.
Si le journal ou la carte devient illisible, la composition **refuse** : un
numéro déduit d'une lecture partielle serait un faux, et c'est exactement le
mécanisme qui a coûté quarante-deux entrées le 7 août au matin.

**Le Gardien a de nouveau corrigé la composition, trois fois.** Trois rapports
de proximité étaient faux — un groupe de champs imbriqué dans un écart
identique au sien, une liste de brouillons dont l'écart extérieur ne valait que
deux fois l'intérieur, et le même défaut une strate plus haut. Aucune valeur
n'était hors de l'échelle ; **c'est le rapport qui était faux**, et c'est
précisément ce que R3.7 existe pour voir. Trois fois sur trois, la correction a
consisté à écarter les groupes, jamais à resserrer leur contenu.

**Précisions d'implémentation — tracées plutôt que prises en silence :**

*(a)* **`Selection` est ajouté aux exportations du registre**, quinzième
composant. Un choix dans une liste fermée est une mécanique de système : c'est
elle qui garantit qu'on ne désigne que ce qui existe. On ne déplace pas le
statut d'une ligne de carte saisie de mémoire.
*(b)* **L'état d'erreur ne vide pas le formulaire.** K2 §6 écrit *« écriture
refusée — le fichier reste intact »* : ce qui a échoué est le dépôt, pas la
saisie. Un écran qui viderait la composition ferait perdre à l'Auteur ce que la
panne n'avait pas touché.
*(c)* **Les cibles déplaçables sont les lignes que la carte déclare**, groupées
par section — trente-quatre à ce jour. Elles ne sont pas listées à la main : la
carte est la source.
*(d)* La **date de l'état est fixable par argument**. Sans cela, deux
productions le même jour auraient pu différer et le témoin de É7 aurait montré
un écart qui n'est que l'heure.

**Alternatives écartées** — *Ouvrir le formulaire dans l'ordre du journal*
(plus naturel à remplir, et il fait écrire le coût en dernier, quand il ne coûte
plus rien) ; *retirer « Verrouillé » de la liste quand le dépôt n'est pas au
vert* (une option absente se lit comme une option inexistante ; montrée et
désactivée, elle dit qu'elle existe et qu'elle attend) ; *déposer l'entrée sans
le déplacement de statut* (c'est rouvrir le trou que K2 voulait fermer : une
décision écrite dont l'effet sur la carte dépend de la mémoire de quelqu'un) ;
*laisser Fili écrire directement dans le journal* (arbitrage d'Auteur, et il
protège mieux que n'importe quelle règle — ce qu'on ne peut pas atteindre, on
ne peut pas l'abîmer) ; *saisir le numéro d'entrée* (deux entrées du même numéro
rendent un journal illisible, et rien ne l'attraperait) ; *resserrer les groupes
plutôt que les écarter pour corriger les rapports de proximité* (on aurait
obtenu le vert en tassant le contenu, c'est-à-dire en produisant le défaut que
la règle décrit).

**Conséquences** — **La construction de K5 est achevée.** Sept gabarits, trois
parcours, **trente et un témoins** en sept lignées, **quinze composants**.
Corpus **inchangé** — vingt-neuf assertions, aucune ajoutée, aucune levée,
**aucune rupture déclarée dans tout le produit**. Toute la chaîne au vert :
intégrité 29/29, cinq Sujets à 100 %, sept contrôles S2 sur sept, aucun couple
de contraste en défaut. **Ce qui reste à K5 n'est plus de la construction : ce
sont les séances.** Sept témoins sont admissibles ; aucun n'est jugé. Le jalon
ne se verrouille pas parce que les écrans existent — il se verrouille quand
l'œil a parlé.

**Ce que cette entrée ne prouve pas** — que le produit est bon. Vingt-neuf
assertions au vert signifient qu'aucune des fautes nommées n'est présente ;
elles ne disent rien du parti visuel, de la hiérarchie perçue ni du ton. **La
Voie B n'a pas encore parlé une seule fois**, et c'est elle que tout le chapitre
attend.

**Impact carte** — Jalon K5 : gabarits **6/7 → 7/7**, parcours **2,5/3 → 3/3** ;
ce qui le bloque devient *« sept témoins admissibles, aucune séance tenue »*.
Registre : `components.exports` 14 → **15** (`Selection`). Témoins : **26 →
31**, sept lignées. Ajout de `/acte` aux sources lues. Première séance : sept
témoins prêts, gabarit de départ non choisi.

---

## #054 — La carte et le journal sont construits, et la carte redevient une pièce vivante après avoir été perdue
*2026-08-07 · Statut : 🟡 En cours (les écrans existent et tiennent ; leur parti visuel n'est pas jugé) · Poursuit K5*

**Contexte** — Quatre gabarits sur sept tenaient debout, le protocole était gelé
et la première séance attendait. Restait P3 · Acter une décision — le parcours
qui **écrit** dans le dépôt, et le seul dont K2 §10.3 exige qu'il rende
**mécanique** l'interdiction de retoucher une entrée passée. Quatre arbitrages
ont été rendus avant qu'une ligne soit écrite : **Fili prépare, l'Auteur valide
au dépôt** ; la carte est **une pièce structurée dérivée du document humain** ;
le journal montre **la dernière décision en entier, les autres repliées** ; et
l'ordre est **lecture d'abord, acte ensuite**.

**Décision** — **É5 · La carte et É6 · Le journal sont construits**, avec les
états que K2 §6 déclare pour eux et pas un de plus : **trois pour É5** — le vide
et le succès y sont marqués « — », donc non exigibles de son témoin — et
**quatre pour É6**, dont un vide que K2 qualifiait lui-même d'inatteignable en
pratique et prévoyait quand même. **`system-map.md` est réécrite** : elle décrit
le présent, elle ne se restaure pas. Deux lecteurs entrent au dépôt, et un
quatorzième composant au système.

**Sens produit / UX** — Quatre choses, dont trois n'étaient pas cherchées.

**La carte perdue le 7 août au matin redevient une pièce vivante — et par
réécriture, jamais par restauration.** `#049` avait acté que son état antérieur
n'était plus lisible et que sa reprise restait une tâche ouverte. Une carte
décrit le présent : la reconstituer aurait été fabriquer un passé, exactement ce
que le refus de reconstruire les quarante-deux entrées avait interdit. Elle est
donc écrite depuis ce qui est vrai aujourd'hui — six jalons, six contrats, sept
gabarits, cinq pièces d'instrument, huit dettes dont quatre fermées — et elle
descend au dépôt, où le journal l'a précédée en `#051`. **La dernière tâche
ouverte de l'incident est close.**

**Un lecteur qui « fait au mieux » est un lecteur qui ment.** Dériver une pièce
structurée d'un document markdown expose à une panne précise : au premier titre
reformulé, l'analyseur ne trouve plus rien et l'écran montre une carte vide —
que personne ne distingue d'un système vide. Le lecteur **refuse donc de
statuer** : il vérifie que les cinq tableaux existent et que leur en-tête est
exactement celle déclarée, et il nomme ce qui a changé. C'est le geste de « pas
de registre, pas de verdict », appliqué à un document. **L'en-tête des tableaux
devient un contrat**, et la carte le dit en toutes lettres pour que personne ne
la reformule en croyant faire de la mise en forme.

**Le journal ne se résume pas, et c'est une règle avant d'être un choix
d'écran.** É6 montre la dernière décision **en entier** et replie les autres. Ce
qui est replié n'est pas raccourci : une entrée s'ouvre complète ou reste
fermée. Un journal résumé par la machine qui l'affiche est un journal réécrit
par elle, et la règle 3 — *on n'édite jamais une entrée passée* — vaut aussi
pour celui qui la donne à voir. **Et le produit n'offre aucun geste d'édition** :
ce n'est pas une omission, c'est la règle rendue mécanique par l'absence du
bouton, ce que K2 §10.3 exigeait de K5.

**Le Gardien a de nouveau trouvé ce que la relecture n'aurait pas vu.** Une
fonction d'aide écrite dans l'écran du journal a été lue par R5.1 comme **une
page sans arbitrage de lecture** — parce qu'elle en était une, au sens de la
règle. Le défaut n'était pas cosmétique : le rythme d'un texte suivi, l'écart
entre deux paragraphes, la largeur de mesure, sont des décisions de composition.
Laissées dans l'écran, elles auraient été reprises autant de fois qu'il y a de
pages, et jamais deux fois pareil. Elles sont donc remontées au système sous le
nom **`Prose`**, quatorzième composant.

**Une perte est déclarée, et elle est visible à l'écran.** Le journal est écrit
en markdown ; É6 ne rend que du texte, parce qu'aucun composant du registre ne
fabrique du balisage à partir d'une chaîne — et qu'un composant qui le ferait
serait la porte ouverte hors du système que R1.6 ferme. **L'emphase que l'Auteur
met dans une entrée ne se voit donc pas sur É6.** Le texte est entier, son
relief ne l'est pas. Montrer les astérisques aurait été montrer le fichier au
lieu du texte ; les interpréter demandait un composant que la doctrine interdit.

**Précisions d'implémentation — tracées plutôt que prises en silence :**

*(a)* **`Prose` est ajouté aux exportations du registre**, quatorzième
composant, pour la même raison que `Rendu` en `#052` : un écran en a besoin, et
le registre est la liste de ce que le système offre — le laisser grossir en
silence est précisément ce que le projet surveille.
*(b)* Le **prochain jalon se calcule**, il ne se déclare pas. Un jalon désigné à
la main dans la carte resterait juste jusqu'au jour où il ne le serait plus, et
personne ne verrait le décalage.
*(c)* **É5 ne rend ni vide ni succès.** K2 §6 les marque « — » : ils ne sont pas
exigibles de son témoin. Le conteneur d'états porte quand même ses quatre slots
— c'est le contrat d'état qui l'exige, pas le témoin.
*(d)* Les **numéros d'entrée ne s'écrivent pas avec leur dièse dans les
libellés** : la chaîne de contrôle lit une référence à trois chiffres comme une
couleur littérale. Faux positif de l'outil, contourné **par la formulation** et
non par une exception à la règle — la règle reste entière, c'est le texte qui
s'écarte de l'ambiguïté. Troisième occurrence du même cas, et la formulation y
gagne : « les quarante-deux premières entrées » se lit mieux qu'une plage de
numéros.

**Alternatives écartées** — *Faire écrire Fili directement dans le dépôt par un
service local* (le plus fidèle à K2 — l'acte a lieu là où la lecture a lieu —
mais cela introduit un service qui écrit sur le disque, qu'il faut lancer, et
qui devient une pièce du système à gouverner comme les autres ; l'arbitrage
d'Auteur a tranché autrement, et l'immuabilité reste garantie par le dépôt, qui
la garantit déjà) ; *analyser la carte markdown avec tolérance* (un analyseur
tolérant casse en silence, et un écran qui montre le vide comme s'il était
l'état du système est pire qu'un écran qui refuse) ; *écrire la pièce
structurée à la main et générer le markdown depuis elle* (deux vérités dont
l'une se tairait en dérivant ; le document humain reste la source) ; *résumer
les entrées repliées* (résumer une décision passée, c'est la réécrire) ;
*restaurer l'ancienne carte* (elle décrivait un passé, et fabriquer un passé est
l'interdit posé par `#049`) ; *inscrire les paragraphes directement dans
l'écran plutôt que de remonter `Prose` au système* (chaque page aurait décidé de
son propre rythme de lecture).

**Conséquences** — **Six gabarits sur sept** sont construits ; il reste **É7 ·
L'acte**. Registre : treize composants → **quatorze**. Corpus **inchangé** —
vingt-neuf assertions, aucune ajoutée, aucune levée, **aucune rupture déclarée
dans tout le produit**. Vingt-six témoins rendus, six lignées. La carte du dépôt
devient la pièce vivante ; celle du projet reste une archive. **La dette « la
carte est à reprendre » ouverte par `#049` est fermée.** Ce qui reste à K5 : É7,
et il porte deux exigences propres — composer une entrée au format du journal
avec son numéro juste, et déplacer un statut de la carte sans jamais toucher aux
entrées passées.

**Ce que cette entrée ne prouve pas** — que les deux écrans sont bons. Ils
tiennent sous les assertions ; aucune assertion ne regarde un parti visuel. La
primauté déclarée par É5 — le prochain jalon avant l'inventaire — et par É6 — la
dernière décision avant l'historique — sont des **promesses de composition**,
et c'est l'œil de l'Auteur qui les tranche en B-1 et B-2.

**Impact carte** — Jalon K5 : gabarits **4/7 → 6/7**, parcours **2/3 → 2,5/3**.
Registre : `components.exports` 13 → **14** (`Prose`). Ajout de
`tools/fili/carte/produire.mjs` et `tools/fili/journal/lire.mjs` au dépôt.
`system-map.md` : réécrite, et **devient la carte vivante**. Témoins : **19 →
26**, six lignées. Ajout de `/carte`, `/journal` et `/brouillons` aux sources
lues. Dette « la carte est à reprendre » (`#049`) : 🔴 → 🟢 **fermée**.

---

## #053 — Le protocole est gelé définitivement, et le gel fait passer la séance de sept points de passage à neuf
*2026-08-07 · Statut : 🟢 Verrouillé (décision d'Auteur : « ok on gèle ») · Ferme le §10.4 de `claude/protocole-reference-k4.md`*

**Contexte** — K4 avait tranché un gel **en deux temps** (`#045`, arbitrage 1),
pour tenir ensemble deux exigences contraires : le verrou de la roadmap demandait
un protocole gelé en K4, et `#034` avait posé qu'*un protocole gelé de loin est
gelé mal informé*. Ce qui décide était donc gelé depuis `#046` ; quatre réglages
restaient ouverts jusqu'à la première séance — la hauteur de référence, la forme
de la planche des registres, celle du catalogue de libellés, et l'ordre interne
des points de passage à l'intérieur d'un même temps. Le §10.4 exigeait que le gel
définitif soit prononcé **avant** la première séance, jamais après. Les quatre
premiers témoins existent depuis `#052` ; la condition est remplie.

**Décision** — **Le gel est prononcé.** Les quatre réglages sont arrêtés et
consignés dans `claude/gel-protocole-k5.md`, qui fait foi sur ces points sans
réécrire le protocole. La hauteur de référence reste à **568 px**. La planche et
le catalogue sont **des pages datées, générées depuis le dépôt, jamais écrites à
la main**. L'ordre interne des points de passage est celui du §4, tel qu'écrit.
Le dossier de séance est une liste de fichiers nommés, ouverts dans l'ordre des
quatre temps.

**Sens produit / UX** — Quatre choses, dont deux n'étaient pas acquises.

**Le gel fait passer la séance de sept points de passage à neuf, et c'est le seul
gain qu'il produit.** K4 avait écrit noir sur blanc que *« les premières séances
de K5 porteront sept points de passage sur neuf »* — B-4 et B-5 restaient sans
objet faute de planche et de catalogue. Les deux pièces existent : la planche
depuis la construction de l'expression, le catalogue depuis ce gel. **Le rapport
de un à neuf sur le coût de l'œil — sept séances par génération au lieu de
soixante-trois passages — porte donc désormais sur la forme pleine**, et non plus
sur une forme dégradée qu'on aurait pu confondre avec elle.

**Et la dernière charge a été levée par une distinction, pas par du travail.** Le
catalogue de libellés existait déjà comme fichier de données ; le protocole
exigeait qu'il soit **lisible d'un bloc**. Un fichier de données ne l'est pas. La
charge paraissait levée et ne l'était pas — c'est exactement la différence entre
*la matière existe* et *la pièce de séance existe*, et elle vaut d'être nommée
parce qu'elle est le genre de trou qui se referme tout seul dans un compte rendu.
Cent seize formulations sont désormais lisibles d'un bloc, groupées par écran,
avec les règles de ton en tête et les variables laissées visibles — elles font
partie de la formulation.

**Garder 568 px est le geste prudent, pas le geste paresseux.** Le §5.3 interdit
de monter la hauteur de référence en suite d'un B-8 non accepté, parce que ce
serait ajuster l'instrument au résultat. La déplacer la veille de la première
séance produirait le même effet **sans même avoir l'excuse d'un résultat à
corriger** : on réglerait l'instrument sur ce qu'on s'attend à mesurer. Elle
reste révisable au journal, hors séance, avec son motif propre.

**Le gel ferme l'instrument ; il ne fabrique pas ce qui manque.** Trois gabarits
sur sept n'ont pas de témoin — É5 la carte, É6 le journal, É7 l'acte —, donc pas
de séance possible. Et aucune lignée n'a de prédécesseur : le contrôle de
régression sera **déclaré sans objet aux quatre premières séances**, écrit à
chaque fois plutôt que constaté à la fin.

**Alternatives écartées** — *Descendre la hauteur de référence maintenant que les
écrans existent* (c'est régler l'instrument sur ce qu'on s'apprête à mesurer, et
la faute est plus grave avant la mesure qu'après) ; *déclarer B-5 levé parce que
le fichier de libellés existe* (la charge aurait été comptée levée sans l'être,
et le premier à s'en apercevoir aurait été l'Auteur en pleine séance, sans pièce
à regarder) ; *écrire la planche et le catalogue à la main pour les rendre plus
lisibles* (une pièce tenue à la main dérive de ce que le produit emploie
réellement, et l'étalon jugerait alors une intention au lieu d'un état — c'est
la faute de la maquette de `#016`, déplacée sur l'instrument) ; *réécrire
`claude/protocole-reference-k4.md` pour y intégrer le gel* (réécrire un document
vivant en entier est le geste interdit depuis `#049` ; un document de gel qui
fait foi sur ses quatre points coûte un renvoi et ne risque rien) ; *repousser le
gel après la première séance* (le §10.4 l'interdit, et pour une raison : un
protocole figé après la première mesure est un protocole figé sur elle) ;
*prononcer le gel sans arrêter les quatre réglages* (un gel qui laisse ouvert ce
qu'il devait fermer n'est pas un gel, c'est une formule).

**Conséquences** — **La première séance peut s'ouvrir.** Elle se tiendra hors de
Fili, sur les fichiers rendus, puisque É3 et É4 sont à la fois le dispositif de
jugement et son objet — l'auto-référence déclarée au §8.2 de K4, devenue
matérielle. Les conditions d'admission sont remplies : vingt-neuf assertions
portées et actives, les cinq Sujets à cent pour cent, dix-sept témoins rendus
depuis la source vérifiée, aucune rupture déclarée. **Une seule chose reste avant
d'ouvrir : décider par quel gabarit commencer** — et ce n'est pas un réglage du
protocole, qui ne dit pas dans quel ordre les gabarits passent et n'a pas à le
dire. Aucun contrat rouvert, aucune assertion touchée.

**Ce que ce gel ne prouve pas** — que le protocole est bon. **Il n'a toujours
jamais été exécuté.** Tout ce qu'il vaut reste une hypothèse sur ce qui rend un
écran jugeable, et la première chose que les séances mesureront est le protocole
lui-même : sept séances par génération est un pari sur l'attention, pas une
mesure. Si le rythme se révèle intenable, ce sera un résultat écrit ici, et le
groupement se révisera comme se révisent le seuil de 2 et le facteur 3.

**Impact carte** — Protocole de référence : 🟡 gelé en structure → 🟢 **GELÉ
DÉFINITIVEMENT**. Points de passage par séance : **7/9 → 9/9**. Charges
d'instrument : la planche des registres et le catalogue de libellés passent de
🔴 manquantes à 🟢 **levées** — les six charges de K4 sont désormais toutes
traitées. Ajout de `claude/gel-protocole-k5.md` à la documentation vivante et de
`tools/fili/expression/catalogue.mjs` au dépôt. Séances possibles : **quatre**,
sur É1, É2, É3 et É4.

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
