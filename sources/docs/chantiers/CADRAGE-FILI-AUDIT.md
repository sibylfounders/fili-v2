# CADRAGE — Fili Audit, offre « audit d'expérience »

> Version 0.3.1 — 3 août 2026
> Complète `CAHIER-FILI-AUDIT.md` (**v0.10.0**), qui reste le document de référence **pour la doctrine** (lois, lots, MVP).
> Ce cadrage règle ce que le cahier laissait ouvert : **quand entre le contexte, dans quel ordre on audite, pour qui on écrit, sous quelle forme on livre.**
> Conforme au MISSING-COMPONENT-PROTOCOL : rien n'est improvisé, les arbitrages non tranchés sont listés au § 11 et bloquent ce qu'ils bloquent.
>
> **Réconciliation du 03/08/2026 (jalon J2).** Les deux documents ont été relus intégralement et confrontés. Quinze écarts relevés ; les cinq structurants ont été **arbitrés par Aurélien** : C-3 (statut) · C-7 (nature du produit, et rapport de l'offre A au lot 1) · C-5 (registres) · C-11 (épreuve de reproductibilité) · **C-10 (le décompte des constats du site de référence — resté OUVERT)**. Détail au § 14.
>
> **Jalon J3, même jour.** Trois arbitrages rendus : **11.1** (le `type` des cinq nouveaux sujets, § 3.3) · **cahier § 10 #1** (où vit l'exécuteur) · **le versionnement du corpus** (entré au cahier § 10 sous le #8, il ne figurait dans aucune des deux listes — écart C-14).

---

## 1. Ce qui a déclenché ce cadrage

Le 31/07/2026, un audit complet a été mené à la main sur **le site de référence** (e-commerce PrestaShop, 4 langues, 340 produits) et livré en 34 constats.

> **Convention d'anonymat — posée le 03/08.** Le site qui sert d'épreuve à cette chaîne est désigné ici par **« le site de référence »**. Son nom et son adresse ne figurent dans aucun document versionné : ce dépôt est **public**, et l'adresse en question est celle d'un **environnement de recette** dont ce cadrage relève lui-même qu'il est ouvert aux moteurs. Le nom réel vit hors dépôt. **Aucune mesure n'est perdue** — ce sont les mesures qui fondent les six familles et les lois C2, C3, E1 et P1 ; le nom du site ne fonde aucune règle. Aurélien l'a validé comme le niveau d'exigence attendu : « C'est ÇA que j'attends de Fili Audit. Rien de moins. »

**Ce cadrage a un seul but : rendre ce rapport reproductible sans l'humain qui l'a corrigé trois fois.**

Car il faut le dire franchement — le rapport de référence ne doit pas sa qualité aux sondes. Il la doit à trois reprises d'Aurélien en cours de route :

1. « Tu n'as pas répondu à la question » — l'audit était resté au niveau du mesurable au lieu d'atteindre le vécu.
2. « L'UX est à chier, tu as oublié l'UI » — une couche entière manquait.
3. « Je pensais pas qu'il n'y ait que 3 problèmes » — la restitution masquait la gravité derrière l'urgence.

Ces trois reprises ne sont **pas des observations** — elles ne disent pas quoi chercher. Ce sont des **exigences de forme**, et c'est à ce titre qu'elles deviennent des passes obligatoires (§ 6). Un agent ne se souvient pas d'être exigeant ; une passe qui refuse de se clore, si.

---

## 2. Nature et non-périmètre

**Nature.** Une prestation d'audit qui part d'une URL et rend un dossier transmissible. Elle mesure ce que le site fait subir à ses visiteurs, ce qui l'empêche d'être trouvé, et l'état de son système visuel.

**URL → dossier et stack → branche sont deux états du même produit, pas deux produits — arbitré le 03/08 (écart C-7).** Le cahier § 1 décrit un outil qui « se branche sur la stack […] livre une branche » : c'est l'état du **lot 5 et au-delà**, et le cahier le range déjà là sans le dire (§ 11.2 : `panier → aperçu → branche` en lot 5 ; § 11.4 : « ni panier, ni aperçu, ni branche » exclus du lot 1). **URL → dossier est l'état des lots 1 à 4.** Les lois **4.6, 4.7, 4.8 et 4.10 du cahier ne sont pas abrogées** : elles n'entrent en vigueur qu'au lot 5.

**Deux offres distinctes — arbitré le 31/07.**

| Offre | Périmètre | Descend jusqu'à |
|---|---|---|
| **A — Audit d'expérience** *(objet de ce cadrage)* | principes · langages · fondations · flows | le **système** : échelles d'espacement et de titres, traitements de boutons, palette, parcours |
| **B — Audit de design system** *(cadrage distinct, à venir)* | la chaîne atomique | chaque composant confronté **règle par règle** à sa fiche RULES |

L'offre A ne descend **jamais** à la confrontation composant par composant. C'est ce qui a produit le rapport de référence, et c'est ce qui le rend tenable en quelques jours.

**L'offre A n'est pas le MVP du lot 1 — arbitré le 03/08 (écart C-7).** Le lot 1 du cahier (§ 11.4) livre *une URL → un rapport sur les deux axes de registres, JSON + rapport lisible*. L'offre A y ajoute la **passe 1** (déclaration produit du client, corpus de concurrents), la **passe 4** (3 à 5 concurrents mesurés le même jour), la **passe 5** (les six familles du coût d'expérience) et la **passe 7** (les quatre projections), plus les formats **HTML + PDF**.

> **Offre A = lot 1 + passes 1, 4, 5, 7.** C'est la liste exacte de ce qui manque au MVP pour être **vendable** — pas de ce qu'il doit livrer. Aucune de ces quatre passes ne se rediscute pendant le lot 1 (cahier § 11.4).

**Hors périmètre de l'offre A :** la chaîne atomique · le rendu au lecteur d'écran · le parcours clavier de bout en bout · les espaces authentifiés · le code source du dépôt (seul le rendu est observé) · toute appréciation du travail fourni au regard de ce qui a été commandé et payé (§ 9.4).

---

## 3. Le corpus — décision structurante

**Arbitré le 31/07 : le référencement, la fabrication serveur et le budget d'images sont AJOUTÉS au corpus Fili.** Pas un corpus parallèle : une extension du référentiel, avec la même cérémonie de sourçage.

### 3.1 Pourquoi c'était nécessaire

Sur les cinq constats qui portent le rapport de référence, **un seul** touchait un principe Fili existant (la recherche sans état vide → charge cognitive + voix). Les quatre autres — site de développement ouvert aux moteurs, prix publiés dans les données structurées, pages de marque en `noindex`, produits rattachés à la mauvaise catégorie — étaient **hors référentiel**. Auditer « tous les principes de Fili » les aurait manqués.

### 3.2 Les cinq sujets à créer

| Sujet | Périmètre | Sources |
|---|---|---|
| `indexation` | directives d'exploration, `noindex`, adresse canonique, plan de site, environnements de recette exposés | Google Search Central |
| `donnees-structurees` | balisage, cohérence entre le balisé et le visible, éligibilité aux résultats enrichis | `schema.org`, Google Search Central |
| `multilingue` | `hreflang`, `x-default`, cohérence des déclarations de région | Google Search Central |
| `budget-image` | rapport entre pixels servis et pixels affichés, format, dimensions déclarées, priorité de chargement | web.dev, Core Web Vitals |
| `fabrication-serveur` | temps de génération, cache, regroupement des ressources, versions en fin de support | web.dev, RFC 9111 |

### 3.3 Conséquence à ne pas manquer

**Le corpus Fili sert aussi au mode build.** Ces cinq fiches seront chargées quand on *génère* de l'UI, pas seulement quand on audite. C'est cohérent — un composant généré devrait déjà déclarer ses dimensions d'image — mais c'est une extension du système, pas un module d'audit.

**Arbitré le 03/08 (§ 11.1) : leur `type` est `principle`** — le type existant, pas un nouveau. Motif : le § 10.1 les range **déjà** sous « Principes » dans l'ordre d'examen, et `principle` est le seul type sans couche visuelle (`companion: none`, comme `ACCESSIBILITY-UX`). Rien à modifier dans la compilation ni dans le routeur.

> **Deux conséquences à traiter au moment de l'écriture, pas maintenant.**
> 1. La couche `principles` passe de **7 à 12 fiches** : sa part de propriétés universelles — **53 %** dans la table de la loi 4.20 du cahier, qui fonde l'ordre d'audit — est à **recalculer après** écriture, jamais avant.
> 2. `ACCESSIBILITY-UX` écrit qu'un principe est « chargé d'office par le routeur » : les cinq fiches de référencement seraient donc chargées **à chaque génération d'UI**, y compris pour un bouton. Si c'est indésirable, ce n'est pas le `type` qu'il faut changer — c'est la règle de chargement du routeur, et c'est un autre arbitrage.

---

## 4. Le contexte — quand il entre

**Arbitré le 31/07 : corpus avant, confrontation après.**

### 4.1 Deux natures de contexte, à ne jamais confondre

- **Contexte marché** — le secteur, les concurrents. *Fourni par l'auditeur*, selon une règle.
- **Contexte produit** — la cible, les personas du site audité, ce que le site doit faire. *Déclaré par l'audité*. C'est un intrant, jamais une orientation de la recherche.

> **Attention au faux ami** : les personas du § 4.1 sont ceux du *site audité*. Les personas du § 5 sont ceux du *rapport*. Rien à voir.

### 4.2 Le moment

| Étape | Ce qui est connu |
|---|---|
| **Avant le relevé** | le secteur, la liste des concurrents à mesurer, la déclaration produit du client |
| **Pendant le relevé** | **rien d'autre.** Les sondes tournent à l'aveugle sur le site audité et sur chaque concurrent, avec les mêmes instruments |
| **Après le relevé** | la confrontation. C'est seulement là que les chiffres deviennent des écarts |

**Loi C1 — le corpus se choisit avant, la confrontation se fait après.** Déclarer le contexte avant le relevé permet de constituer le corpus ; ne confronter qu'après protège du biais de confirmation. Un relevé qui sait déjà ce qu'il doit trouver trouve ce qu'il sait.

### 4.3 Pourquoi le contexte marché n'est pas décoratif

Sur les huit défauts qu'Aurélien avait repérés à l'œil, **six étaient trouvables par sonde seule**. Les deux autres — « la marque ne se présente pas », « il n'y a pas de rappel des catégories » — sont des **absences**. Une sonde compte ce qui est là ; elle ne sait pas ce qui manque.

**Loi C2 — une absence n'existe que comparée.** 214 mots n'est pas un défaut dans l'absolu. C'en est un à côté de 1 500–2 000 chez Beretta et 800–1 000 chez Aigle. Le benchmark est le mécanisme qui remplace l'intuition d'un expert.

**Loi C3 — un benchmark qui confirme tout ce qu'on pensait n'a pas fait son travail.** Sur le site de référence, il a révélé que **trois marques sur quatre n'ont pas de titre principal sur leur accueil** — désarmant un argument qu'on s'apprêtait à vendre. La passe 4 ne se clôt que sur au moins un résultat contre-intuitif, ou sur la déclaration explicite qu'il n'y en a pas.

### 4.4 Règle de sélection des concurrents — *proposée, à arbitrer (§ 11.2)*

Trois à cinq sites, mesurés le même jour, avec les mêmes sondes : **au moins deux de même nature** (marque contre marque, revendeur contre revendeur), **au moins un d'une nature différente** (le plancher du marché), **même langue principale**, **même ordre de grandeur de catalogue**. La liste et le motif de chaque choix sont inscrits dans le dossier de preuve.

---

## 5. Les destinataires — quatre projections d'un seul corpus

**Arbitré le 31/07 : les quatre.**

**Loi D1 — un seul relevé, N projections.** Un persona n'est pas un audit différent : c'est un filtre, un ordre, un vocabulaire et une profondeur de preuve. On n'audite jamais le même site quatre fois.

| Persona | Ce qu'il fait des constats | Ordre | Preuve | Sur le site de référence |
|---|---|---|---|---|
| **Dirigeant de PME** | décide, fait suivre | lecteur | conséquence commerciale d'abord, règle en dernier et en petit | les 34, classés par gravité + « qui porte quoi » |
| **Prestataire technique** | corrige | doctrine | sélecteur exact, règle sourcée, correction prête à coller | 20 constats |
| **Responsable e-commerce / marketing** | écrit, référence, convertit | lecteur | volume, comparaison marché, effet attendu | 6 constats éditoriaux + 10 de référencement |
| **Équipe design / produit** | possède le système | doctrine | mesures brutes, arbitrages ouverts, cas non couverts | la partie interface + les « à trancher » |

**Loi D2 — un constat n'appartient à personne par nature.** Son destinataire se déduit de ce qu'il faut faire pour le corriger : écrire un texte, changer une valeur, régler un serveur, trancher une intention. C'est cette question — et elle seule — qui alimente le § « qui porte quoi ».

---

## 6. Les sept passes

Chaque passe a un **critère de sortie falsifiable**. Une passe qui ne peut pas le satisfaire ne se clôt pas : elle remonte.

| # | Passe | Ce qu'elle fait | Ne se clôt que si… |
|---|---|---|---|
| **1** | **Cadrage** | déclaration produit du client, corpus de concurrents, sélection des gabarits | le contexte produit est déclaré **ou** explicitement porté comme manquant, et le motif de chaque concurrent est écrit |
| **2** | **Relevé** | les sondes, à l'aveugle, sur l'audité **et** les concurrents | chaque mesure porte l'instrument qui l'a produite et son horodatage |
| **3** | **Épreuve** | rejouer chaque constat sur l'élément visé | **zéro constat sans trace d'outil dans ce run** (§ 8) |
| **4** | **Marché** | confrontation aux concurrents | au moins un résultat contre-intuitif, ou déclaration explicite qu'il n'y en a pas (loi C3) |
| **5** | **Coût d'expérience** | les six familles du § 7 | chaque coût est adossé à une mesure de la passe 2 |
| **6** | **Registres** | classer le constat **et** la solution, séparément (§ 9) | aucune « certitude » sans correction écrite et vérifiable par rejeu |
| **7** | **Projection** | produire les documents par persona (§ 5) | l'échelle de gravité couvre **100 %** des constats, et la sortie « ne s'applique pas ici » a été instruite (§ 10) |

**Les passes 3, 5 et 7 sont les trois reprises d'Aurélien, transformées en règles.** La 3 répond à « ne rien inventer », la 5 à « l'expérience d'abord », la 7 à « il n'y a pas que trois problèmes ».

---

## 7. Le coût d'expérience — la charge psychologique par ses causes

**Loi E1 — la charge psychologique ne se mesure pas ; ses causes, si.** On n'écrit jamais « le site est fatigant ». On écrit ce qui fatigue, avec le chiffre.

| Famille | Ce qu'elle mesure | Relevé de référence |
|---|---|---|
| **Imprévisibilité** | éléments d'apparence identique aux comportements différents | 20 grandes images sur 29 ne réagissent pas, à côté de 9 identiques qui réagissent |
| **Attente non annoncée** | temps au-delà du seuil, sans annonce | filtre à **1,9 s** par clic, en silence — deux fois le seuil |
| **Coût de décision** | cibles concurrentes pour une même intention | **4 liens** par vignette produit |
| **Trahison** | l'interface répond à côté sans le dire | « tondeuse à gazon » → 1 produit ; jamais d'état vide |
| **Saturation** | procédés d'emphase si répandus qu'ils n'emphasent plus | **75 blocs en capitales** sur la seule page d'accueil |
| **Effort de lecture** | longueur de ligne hors de la zone 45–75 caractères | **41** sur l'accueil, **173** sur la fiche produit |

**Loi E2 — l'imprévisibilité contamine.** Le visiteur qui clique une image inerte n'apprend pas « celle-là n'est pas cliquable » : il apprend « ce site ne répond pas ». Un défaut d'imprévisibilité se pondère au-dessus de sa fréquence.

L'agrégat de ces six familles est le **coût d'expérience**. C'est aussi, seul, le contenu de l'audit gratuit (§ 11.3).

---

## 8. L'épreuve — la passe qui a le plus rapporté

**Loi P1 — aucun chiffre n'entre dans un constat sans un appel d'outil qui l'a produit dans ce run.** Pas de mémoire, pas d'ordre de grandeur plausible, pas de comblement d'un outil en échec. Un chiffre sans trace ne s'écrit pas : on le mesure, ou on écrit « non mesuré ».

Quatre écarts réels, tous rattrapés par cette passe le 31/07 :

| Ce qui avait été écrit | Ce que la vérification a donné |
|---|---|
| 99 textes sous le seuil de contraste | entrées d'un mégamenu en `visibility: hidden` dont l'`offsetParent` n'est pas nul. **Zéro constat tenable.** |
| ~30 contrastes « blanc sur blanc, ratio 1,00 » | signature d'un **fond introuvable**, pas d'un défaut. Sans fond opaque dans la chaîne, le contraste est *indécidable*, pas *fautif*. |
| « le plan de site français est vide » | **599 adresses**, enveloppées en `<![CDATA[…]]>` que le motif de lecture ne captait pas. |
| un volume de texte concurrent cité dans un tableau | **jamais mesuré.** Un seul appel avait été lancé, sur un autre site. L'écart réel était de 4 à 9 fois, pas 7 à 14. |

**Loi P2 — trois filtres de visibilité obligatoires.** Toute sonde de rendu remonte la chaîne d'ancêtres sur `display`, `visibility` et `opacity`, et écarte `[aria-hidden]`, `[hidden]`, `[inert]`. `offsetParent` ne suffit pas.

**Loi P3 — un débordement d'élément n'est pas un défaut de recomposition.** Le signal est `scrollWidth > clientWidth`, jamais la position d'un élément pris isolément. Sur le site de référence, 89 éléments « hors cadre » à 320 px — et aucun défaut : c'étaient des diapositives de carrousel.

---

## 9. Les registres — appliqués deux fois

**Loi R1 — les registres du constat et ceux de la solution ne sont pas le même axe.** Un constat certain peut avoir une solution incertaine, et c'est le cas le plus fréquent.

**Arbitré le 03/08 (écart C-5) : ce sont ces deux axes qui font foi, et l'axe du constat porte QUATRE états.** Le cahier annonçait « trois registres » en un seul axe (§ 2, § 11.2, § 11.4) ; il est aligné en v0.10.0. *Indécidable* redevient le **nom de la famille**, pas celui d'un état : la loi 4.18 du cahier distingue deux cas qui ne se traitent pas pareil, et le § 11.3 du cahier écrit que sans *en attente de déclaration*, **54 mesures disparaîtraient silencieusement**.

### 9.1 Registres du constat — quatre états

| Registre | Condition |
|---|---|
| **Avéré** | manquement à une norme opposable, source citée, mesure rejouable |
| **Signalé** | parti pris du référentiel. Ne peut structurellement **jamais** atteindre « avéré ». *C'est la loi 4.3 du cahier, dont le vocabulaire est renommé ici : le « à corriger » du cahier se lit **avéré**. Le mécanisme de confinement est inchangé, seuls les noms le sont.* |
| **Non couvert** *(famille : indécidable)* | le référentiel ne dit rien sur ce cas. Rien n'est proposé, rien n'est attendu de personne (cahier, loi 4.18) |
| **En attente de déclaration** *(famille : indécidable)* | le référentiel dit, mais il manque une donnée qui appartient au client. Se lit comme une question précise ; la réponse **débloque mécaniquement la règle** au scan suivant (cahier, loi 4.18) |

### 9.2 Registres de la solution

| Registre | Condition |
|---|---|
| **Certitude** | la correction est **écrite**, et sa réussite se vérifie en **rejouant la même sonde** après coup |
| **Suggestion** | l'effet est attendu mais ne se vérifie pas par rejeu |
| **À trancher** | la solution dépend d'une intention que seul le client connaît |

**Loi R2 — la barre de la certitude est le rejeu, pas la conviction.** « Retirer `outline: none`, ajouter `:focus-visible` » est une certitude : la sonde repassera de 0/40 à 40/40. « Réécrire les fiches produit » est une suggestion, même si personne n'en doute. Une certitude démentie détruit la crédibilité des trente-trois autres constats.

### 9.3 Exemple d'application croisée

Constat 4 du site de référence — le prix publié dans les données structurées d'un site qui n'affiche aucun prix :
**constat avéré** (le balisage est là, c'est vérifiable) · **solution à trancher** (retirer le balisage ou afficher le prix dépend de si c'est le tarif public ou le tarif revendeur — seul le client le sait).

### 9.4 Frontière non négociable

**Loi R3 — un audit mesure un site à un instant donné ; il ne juge pas un prestataire.** Le périmètre du contrat, le budget, le brief et le calendrier ne sont pas connus de l'auditeur. Cette phrase figure dans tous les documents produits, sans exception.

---

## 10. Les deux ordres

**Loi O1 — l'ordre d'examen n'est pas l'ordre de restitution.** Chaque constat porte deux étiquettes : son **sujet de doctrine** et sa **case de restitution**. La projection (passe 7) utilise la seconde.

### 10.1 Ordre d'examen — du plus universel au plus particulier

1. **Principes** — accessibilité, performance perçue, charge cognitive, adaptatif, + les cinq nouveaux sujets du § 3.2
2. **Langages** — interaction, voix, motion, e-motion, geste
3. **Fondations** — couleur, typographie, espacement, grille, bordure, rayon, élévation, iconographie, touch
4. **Flows** — les parcours réels du site audité
5. *Composants — hors offre A (§ 2)*

### 10.2 Ordre de restitution pour le dirigeant — celui qui a fonctionné

I. ce qui empêche d'**être trouvé** · II. ce qui empêche de **comprendre et d'acheter** · III. **l'interface** · IV. **la machine**

Puis : ce qui fonctionne → la comparaison marché → les constats par **gravité** → **qui porte quoi** → par où commencer → les questions qui n'appartiennent qu'au client.

### 10.3 L'échelle de gravité

Elle classe par **ce qu'il en coûte de ne rien faire**, jamais par difficulté de correction.

| Niveau | Définition |
|---|---|
| **1 — Irréversible** | un dommage difficile à réparer si on laisse courir |
| **2 — Grave** | coûte des ventes chaque jour, ou expose juridiquement |
| **3 — À corriger** | dégrade l'expérience et le référencement sans les bloquer |
| **4 — Dette de conception** | ne bloque rien aujourd'hui, rend tout coûteux demain |

**Loi O2 — l'échelle couvre 100 % des constats.** Aucun ne reste hors niveau. C'est le critère de sortie de la passe 7, et la correction directe de la reprise « je pensais pas qu'il n'y ait que 3 problèmes ».

### 10.4 Deux règles d'écriture

**Loi O3 — aucun jugement esthétique.** « Le site est beau » n'est pas vérifiable et dénature l'expertise. La partie interface s'ouvre sur : *« Cette partie ne juge pas le goût. Elle mesure la cohérence. »*

**Loi O4 — le rapport dit d'abord ce qui fonctionne.** Un audit qui ne relève que des défauts n'est pas crédible, et il empêche le client d'entendre le reste.

---

## 11. Arbitrages ouverts — ce qui bloque quoi

| # | Arbitrage | Bloque |
|---|---|---|
| ~~**11.1**~~ | ~~Le `type` des cinq nouveaux sujets (§ 3.2)~~ — **TRANCHÉ le 03/08 : `principle`, le type existant** (§ 3.3) | ~~l'écriture des fiches, donc la passe 2 sur tout le volet référencement~~ — **débloqué.** Restent à traiter à l'écriture : le recalcul de la loi 4.20 et le chargement d'office du routeur |
| **11.2** | La règle de sélection des concurrents (§ 4.4 est une **proposition**) | la passe 1 |
| **11.3** | Le contenu exact de l'audit gratuit. Proposition : le coût d'expérience, ses trois plus gros contributeurs, rien d'autre — **et surtout pas le rapport payant tronqué** | la mise en marché, pas la chaîne |
| **11.4** | La mémoire du rescan. `CADRAGE-CONSTATS-CONSOMMATEUR.md` le signale déjà : les registres n'ont **que l'aller** — pas de statut, pas de destinataire, pas d'historique. Bloquant dès le deuxième scan d'un même client | la deuxième prestation, pas la première |
| **11.5** | Le seuil d'agrégation du coût d'expérience : comment six familles deviennent un chiffre défendable | l'audit gratuit |

### 11 bis. Arbitrages rouverts le 31/07 — décisions prises par l'agent, non ratifiées

> **Garde 5 — un agent ne ferme jamais un arbitrage.** Les cinq décisions ci-dessous ont été prises en cours de production de l'audit de référence **par l'agent, sans arbitrage humain**. Elles sont rouvertes à la demande d'Aurélien le 31/07/2026. Les livrables du site de référence les portent, et portent la mention qu'elles sont provisoires.
>
> Ce paragraphe existe aussi comme précédent : une chaîne d'audit produit mécaniquement des micro-décisions qui ressemblent à de l'exécution et qui sont des arbitrages. Les repérer est un travail à part entière.

| # | Arbitrage rouvert | État actuel | Bloque |
|---|---|---|---|
| **11.6** | **La gravité de chaque constat** | attribuée par l'agent — N1=3, N2=12, N3=15, N4=7. Aucune règle ne produit le niveau. **⚠ Ces quatre valeurs somment à 37, alors que ce document écrit « 34 » ailleurs — voir § 14.1, écart C-10, OUVERT. Aucune n'est corrigée ici : les baisser refermerait cet arbitrage.** | l'opposabilité du classement, et la conclusion dirigeant qui s'y appuie entièrement |
| **11.7** | **Le destinataire de chaque constat** | attribué par l'agent. C'est lui qui fabrique la section « qui porte quoi ». | la passe 7 (projection par persona) et la crédibilité de la répartition |
| **11.8** | **Les poids des six familles du coût d'expérience** | 3·3·3·2·2·2 sur 15, posés à la main. **Touche directement 11.5** : un poids sur 15 est une invitation à sommer. | l'audit gratuit (§ 11.3) et la fermeture de 11.5 |
| **11.9** | **Le contenu de la vue dirigeant** | 4 risques, 6 coûts cachés, 5 chantiers, 3 décisions — rédigés par l'agent, aucun issu d'une mesure. | la reproductibilité de la projection dirigeant sur un autre client |
| **11.10** | **Les deux constantes de l'instrument de contraste par pixels** | « 18 % de couverture d'encre » et « 5e centile », choisies et non dérivées. | l'opposabilité de UI-09 et de tout constat de contraste sur photo |

**Options relevées pour chacun** (à instruire, pas à trancher ici) :

- **11.6** — (a) table de décision dérivée du registre + du domaine + de l'exposition juridique · (b) attribution humaine systématique · (c) attribution agent avec relecture obligatoire avant livraison.
- **11.7** — (a) dérivé mécaniquement de la **nature de la correction** (écrire un texte / changer une valeur / régler un serveur / trancher une intention) · (b) déclaré au cadrage, une fois, par famille de sujet · (c) au cas par cas.
- **11.8** — (a) supprimer les poids, ordonner les familles par la gravité des constats qu'elles agrègent · (b) garder les poids et écrire explicitement pourquoi ils ne se somment jamais · (c) assumer un agrégat borné, ce qui rouvre 11.5 dans l'autre sens.
- **11.9** — (a) gabarit fixe alimenté par les constats de niveau 1 et 2 · (b) rédaction humaine à chaque audit · (c) gabarit + relecture obligatoire.
- **11.10** — (a) calibrer les deux constantes sur un corpus de cas connus · (b) les déclarer et les versionner **dans le constat lui-même** · (c) remonter les deux valeurs brutes (pire absolu et médiane) sans seuil unique.

---

## 12. L'épreuve de reproductibilité

C'est le critère qui décide si cette chaîne est vendable.

**Arbitré le 03/08 (écart C-11) — deux épreuves, deux rôles.** Le cahier § 11.4 fixe le critère falsifiable du **lot 1** sur les cinq pages de Passion Courtage et sur la planche : c'est l'**épreuve interne**, et c'est elle qui décide de la fermeture du lot 1. L'épreuve ci-dessous est l'**épreuve de vente** ; elle se joue **après**, et elle ne conditionne pas la fermeture du lot 1.

> **Condition préalable, loi 4.16 du cahier** — *un corpus de test écrit par l'auditeur mesure l'auditeur.* Le corrigé de référence a été écrit à la main et n'a **jamais** été repassé à la machine ; celui de Passion Courtage, si (cahier, annexe A.1 bis). Ce traitement y a trouvé, sur **sept lignes** : une erreur franche, une attribution fausse, un sous-comptage et trois flous de portée. **Le corrigé de référence passe au traitement A.1 bis avant de servir de barre** — et le décompte des constats (§ 14.1, C-10) en fait partie.

> **Rejouer la chaîne sur le site de référence en repartant de zéro — une URL, rien d'autre, aucune des observations d'Aurélien.**
> Elle doit **retrouver les 34 constats**, **écarter les quatre faux positifs du § 8**, et **n'en inventer aucun**.

Lecture du résultat :

- **34 retrouvés** → la chaîne tient, on peut vendre.
- **32 retrouvés, les deux manquants étant des absences** → la passe 4 est mal réglée (corpus trop étroit, ou mauvaise nature de concurrents). Ce n'est pas un besoin d'humain.
- **Moins de 30** → le projet n'est pas mûr. Mieux vaut le savoir avant la première facture.
- **Un seul constat inventé** → la passe 3 ne fait pas son travail, et rien d'autre ne compte tant que ce n'est pas corrigé.

> ⚠ **Le nombre 34 est en attente de décompte** (§ 14.1, écart C-10). Les quatre seuils ci-dessus se recalculent une fois le décompte fait sur pièces ; ils ne valent pas tant qu'il ne l'est pas.

**Loi V1 — la chaîne n'a jamais besoin qu'on lui montre où regarder.** Un client paie précisément parce qu'il ne sait pas ce qui ne va pas chez lui. L'humain intervient à l'entrée (la déclaration produit) et à la sortie (les « à trancher »). **Au milieu, personne.**

---

## 13. Ce que ce cadrage ne couvre pas

- L'**offre B** (audit de design system, chaîne atomique) — cadrage distinct.
- Le **modèle économique** : prix, durée, ce qui est inclus.
- L'**implémentation** : quelles sondes, dans quel ordre, avec quel outillage. Le cahier `CAHIER-FILI-AUDIT.md` tient le découpage en **§ 11.2** (les sept lots) et le périmètre du MVP en **§ 11.4** ; ce document ne les remplace pas. *(Renvoi réparé le 03/08 — il pointait « § 11.4 » pour les lots, écart C-2.)*
- La **mémoire inter-scans** (§ 11.4).
- Le **rendu au lecteur d'écran** et le parcours clavier complet, qui restent hors de portée de l'instrumentation actuelle.

---

## 14. Réconciliation avec le cahier — jalon J2 (03/08/2026)

Les deux documents ont été relus **intégralement** le 03/08 et confrontés point par point. Quinze écarts relevés ; les cinq structurants ont été instruits et **arbitrés par Aurélien**. Aucun n'a été fermé par l'agent (garde 5).

| Écart | Ce que disaient les deux documents | Arbitrage rendu le 03/08 | Où c'est écrit |
|---|---|---|---|
| **C-3** | cahier : `statut: proposition — aucune décision engagée`, « Rien n'y est décidé ». Cadrage : « Arbitré le 31/07 » **quatre fois** en corps de texte + un Journal de six entrées datées | **Le cahier lève son statut** et renvoie à ce Journal, seul journal daté des deux. Le cahier garde l'autorité sur la doctrine (lois, lots, MVP) | cahier : frontmatter + bandeau · ici : bandeau, Journal |
| **C-7 (1/2)** | cahier § 1 : *stack → branche* (lois 4.6 / 4.7 / 4.8 / 4.10). Cadrage § 2 : *URL → dossier*, code source hors périmètre | **Deux états d'un même produit** : URL → dossier aux lots 1–4, stack → branche au lot 5+. **Aucune loi abrogée** | § 2 · cahier § 1 |
| **C-7 (2/2)** | aucun des deux ne disait si l'offre A est le MVP du lot 1 | **Non — offre A = lot 1 + passes 1, 4, 5, 7** (+ HTML/PDF) | § 2 · cahier § 11.4 |
| **C-5** | cahier § 2 : trois registres en **un** axe. Cadrage § 9 : **deux** axes de trois | **Les deux axes font foi, et l'axe du constat porte quatre états** — la loi 4.18 est conservée | § 9.1 · cahier § 2, § 4.3, § 11.2, § 11.4 |
| **C-11** | cahier § 11.4 : Passion Courtage + la planche. Cadrage § 12 : le site de référence, 34 constats | **Les deux, avec des rôles nommés** : Passion Courtage = épreuve **interne** du lot 1 ; le site de référence = épreuve **de vente**, jouée après — et son corrigé passe d'abord au traitement A.1 bis (loi 4.16) | § 12 · cahier § 11.4 |

### 14.1 — C-10, le décompte des constats du site de référence : **OUVERT**

**Trois comptes coexistent dans ce document, et aucun n'est vérifié :**

| Où | Ce qui est écrit | Total |
|---|---|---|
| § 1 · § 5 · § 12 (deux fois) · loi R2 (« les trente-trois autres ») | « 34 constats » | **34** |
| § 11.6 | N1=3 · N2=12 · N3=15 · N4=7 | **37** |
| § 5 | prestataire **20** · marketing **6 + 10** | **36** *(hors dirigeant et design/produit)* |

**Arbitrage rendu le 03/08 : recompter sur pièces avant d'écrire un chiffre.** Aucune des trois valeurs n'est retenue, et **aucun nombre n'a été modifié dans ce document**. Deux raisons :

1. La **loi P1** — *aucun chiffre n'entre dans un constat sans un appel d'outil qui l'a produit dans ce run* — vaut aussi contre l'auteur de ce cadrage.
2. Baisser une des quatre valeurs du § 11.6 pour faire tomber la somme à 34 **refermerait l'arbitrage 11.6**, rouvert le 31/07 précisément parce que l'agent l'avait fermé seul.

**État matériel au 03/08 :** les livrables du site de référence ne sont accessibles depuis aucun dossier connecté. Le décompte demande le dossier ou le fichier.

**Hypothèse à tester au décompte — pas une conclusion.** Les trois comptes ne comptent peut-être pas la même chose : la **loi 4.19 du cahier** sépare les *constats de doctrine* des *contrôles d'hygiène*, et trois contrôles d'hygiène expliqueraient exactement l'écart 37 → 34.

**Ce que C-10 bloque tant qu'il est ouvert** : la **loi O2** (« l'échelle couvre 100 % des constats »), l'arbitrage **11.6**, la lecture du **§ 12**, et toute reprise du chiffre « 34 » devant un client.

### 14.2 — Les dix autres écarts, non traités par ce jalon

**Réparés en passant :** C-1 version périmée du renvoi au cahier *(bandeau)* · C-2 renvoi § 13 → « cahier § 11.4 » pour les lots *(corrigé en § 11.2 / § 11.4)* · C-6 les quatre états compressés en un « Indécidable » *(absorbé par C-5)*.

**Relevés, non traités :** C-4 ordre d'examen — ce cadrage ouvre par les Principes, la loi 4.20 du cahier compte `languages` en tête à 61 % de propriétés universelles · C-8 composants hors offre A ici, 322 `MESURE` mesurées au cahier · C-9 mémoire des constats « bloquante » (cahier, lot 3) contre « la deuxième prestation, pas la première » (§ 11.4 ici) · C-12 doctrine contre hygiène (loi 4.19) jamais traitée par ce cadrage · C-13 numérotation du cahier 6.1 → 6.2 → 6.3 → **6.5** → 6.4 · **C-14** le versionnement du corpus, seul arbitrage exigé par le MVP, **absent des deux listes d'arbitrages** *(→ J3)* · **C-15** le cahier § 11.6 annonce « les six autres » et n'en nomme que quatre, dont **un seul** figure réellement à son § 10 *(→ J3)*.

---

## Journal

| Date | Décision |
|---|---|
| 31/07/2026 | Contexte : corpus avant, confrontation après (§ 4.2) |
| 31/07/2026 | Référencement, fabrication serveur et budget d'images **ajoutés au corpus Fili**, pas en corpus parallèle (§ 3) |
| 31/07/2026 | Quatre personas de restitution, un seul relevé (§ 5) |
| 31/07/2026 | Formats livrés : **page HTML persistante** et **PDF**. Le relevé JSON rejouable devient un **artefact interne**, pas un livrable client |
| 31/07/2026 | Deux offres distinctes ; la chaîne atomique des composants sort de l'audit clientèle (§ 2) |
| 31/07/2026 | **Cinq arbitrages rouverts** (§ 11 bis) — décisions prises par l'agent pendant la production de l'audit de référence, non ratifiées. v0.1.1 |
| 03/08/2026 | **C-3** — le cahier lève son statut de proposition ; **ce Journal fait foi** pour ce qui est arbitré, le cahier pour la doctrine (§ 14) |
| 03/08/2026 | **C-7** — *URL → dossier* et *stack → branche* sont **deux états du même produit** : lots 1–4 / lot 5+. Les lois 4.6, 4.7, 4.8 et 4.10 du cahier **ne sont pas abrogées** (§ 2) |
| 03/08/2026 | **C-7** — l'offre A **n'est pas** le MVP du lot 1 : **offre A = lot 1 + passes 1, 4, 5, 7**, plus HTML et PDF (§ 2) |
| 03/08/2026 | **C-5** — les **deux axes** du § 9 font foi ; l'axe du constat porte **quatre** états, la loi 4.18 du cahier est conservée (§ 9.1) |
| 03/08/2026 | **C-11** — Passion Courtage + la planche = **épreuve interne** du lot 1 ; le site de référence = **épreuve de vente**, jouée après, et son corrigé passe d'abord au traitement A.1 bis, loi 4.16 (§ 12) |
| 03/08/2026 | **C-10** — le décompte des constats du site de référence **reste OUVERT** : recompter sur pièces avant d'écrire un chiffre. **Aucun nombre modifié** (§ 14.1). v0.2.0 |
| 03/08/2026 | **J3 · arbitrage 11.1 fermé** — le `type` des cinq nouveaux sujets est **`principle`**, le type existant (§ 3.3) |
| 03/08/2026 | **J3 · cahier § 10 #1 fermé** — l'exécuteur vit **dans le monorepo** ; état de fait déclaré, rien ne se déplace avant que le lot 1 ait tourné (cahier § 6.1) |
| 03/08/2026 | **J3 · le versionnement du corpus fermé** — l'empreinte de passage **réemploie `tools/plugin/etat-publication.json`**, à étendre au corpus que le moteur lit. Entré au cahier § 10 sous le **#8** : il ne figurait dans aucune des deux listes (écart C-14). v0.3.0 |
