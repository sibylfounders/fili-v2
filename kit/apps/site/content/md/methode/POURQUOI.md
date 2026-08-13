# Pourquoi ce projet

> La porte d'entrée du projet — la promesse, le mode d'emploi, la thèse et l'architecture.

## L’essentiel

**Le point de départ**

Comment obtenir une interface juste — pas seulement plausible ?

Une IA sait appliquer une règle. Le vrai enjeu est de lui dire quelles règles croire, quand les appliquer, et à quel moment rendre la main à un humain.

Ce projet transforme une documentation de design en **contexte de décision** : lisible par les humains, consommable par les IA, et assez explicite pour ne pas confondre une règle avec une préférence.

**01 / FIABILITÉ**

### Savoir ce qui est sûr

Chaque arbitrage fragile, divergent ou encore émergent porte un niveau de confiance explicite.

**02 / CONTEXTE**

### Savoir où l’appliquer

Le périmètre, les dépendances et les conditions de chargement accompagnent la règle.

**03 / JUGEMENT**

### Savoir quand s’arrêter

La frontière entre exécution automatique et décision humaine fait partie de la documentation.

**La promesse :** moins de décisions inventées, moins de contexte inutile, et une IA qui sait reconnaître ce qu’elle ne sait pas.

Voir comment ça marche →

## Lire la doc

**02 · Mode d’emploi**

### Comment lire cette documentation

Vous n’avez pas besoin de tout lire. Commencez par votre sujet, puis descendez du sens vers la preuve et l’implémentation.

**L’essentiel**

La décision de fond, les règles structurantes et ce que le sujet cherche à résoudre.

**Cas d’usage**

Les situations concrètes qui éprouvent la couverture et rendent les limites visibles.

**Spécifications**

Les états, les tokens, les spécimens et les contraintes d’implémentation.

**Évolution**

Les arbitrages datés : ancienne règle, nouvelle règle, et raison du changement.

**Pour un humain**

#### Partez d’une question de design

Choisissez une fondation, un composant ou un pattern dans la navigation. Lisez d’abord l’essentiel ; ouvrez les autres volets seulement quand vous avez besoin de vérifier, comparer ou implémenter.

Explorer une fiche complète →

**Pour une IA**

#### Partez d’une intention

Le routeur charge le protocole commun, les tokens et uniquement les règles nécessaires à la tâche. Les dépendances s’ajoutent ; un sujet hors périmètre provoque un arrêt, pas une improvisation.

Voir la distribution IA →

## La réponse

**03 · La thèse**

### Ce que le projet documente vraiment

Pas seulement des valeurs et des composants : les conditions qui permettent de prendre — ou de ne pas prendre — une décision.

#### Un degré de confiance

Établi, convergence, cas isolé ou non formalisé : le lecteur sait à quel point l’arbitrage tient.

#### Un périmètre d’application

Une règle vraie hors de son contexte devient fausse ; chaque bundle décrit donc ses limites et ses dépendances.

#### Une frontière de décision

Quand la règle dicte la réponse, l’IA applique. Quand un choix de design se pose, elle remonte les options.

### Pas un design system — une couche d’intelligence

Depuis le 2026-07-21, la conclusion de la vision fondatrice est assumée jusqu'au bout : **ce projet n'est pas un design system**. C'est une couche d'intelligence de conception qui se greffe au-dessus de n'importe quel design system hôte — Material, Carbon, ou le vôtre. Elle décrit les **propriétés** et les **décisions** qu'une bonne interface doit posséder (le pourquoi, le quand) ; l'hôte garde l'**implémentation** (le comment : composants, tokens, API). La règle de frontière tient en un exemple : ❌ « utiliser un bouton Filled » · ✅ « l'action principale doit être clairement dominante ». Et le système se livre d'abord comme un **moteur d'audit** : des écrans et des parcours réels confrontés à un référentiel versionné — l'implémentation de référence (DS-UI) reste disponible comme chemin de refonte, jamais comme condition.

Ce positionnement n'est pas déclaratif, il est mesuré : le dépouillement des huit études d'audit menées en juillet 2026 montre que 95 % des constats reposent sur des propriétés transposables à tout hôte (WCAG, standards, séquence, friction, wording) — mesure M2, journalisée dans DECISIONS.md. Dernière vérification en date : un agent qui ne connaissait rien du projet, armé du seul paquet compilé, a audité un parcours réel et retrouvé l'ensemble des constats d'une étude experte sur le périmètre observable — en citant ses règles, en mesurant ses contrastes, et en remontant ce qu'aucune règle ne couvrait au lieu de l'improviser.

### Le problème n’est pas d’appliquer des règles

Une IA sait appliquer une règle. La difficulté est ailleurs : déterminer **quelles règles sont fiables**, **dans quel contexte** elles s'appliquent, et **quelles décisions doivent rester humaines**. Un catalogue de tokens ou une liste de consignes ne répond à aucune de ces trois questions — il suppose le problème déjà résolu. Ce projet documente précisément ce qui reste, d'habitude, tacite : le degré de confiance d'une règle, son périmètre, et la frontière entre ce qu'une machine peut trancher et ce qu'elle doit remonter à un humain.

### Dire à quel point une règle est sûre

Les arbitrages structurants — ceux qui divergent entre systèmes majeurs, reposent sur un cas isolé ou restent fragiles — portent un niveau de confiance explicite : **établi**, **convergence**, **cas isolé**, **non formalisé**. Le dimensionnement typographique fluide au zoom extrême, par exemple, est marqué « émergent/débattu » : la première règle du système assumée comme non consensuelle. Les autres règles s'appuient sur le tableau de sources qui clôt chaque fiche, ou, à défaut, sur un raisonnement de mécanisme assumé. Moins d'une règle sur dix porte une confiance inline, et la couverture règle par règle n'est pas encore vérifiée mécaniquement — c'est une dette identifiée, pas une propriété acquise. C'est ce gradient qui indique à une IA quand trancher seule et quand s'arrêter.

### Savoir où une règle s’applique

Une règle vraie hors de son périmètre devient fausse. Chaque fichier de règles porte donc son contexte : son périmètre, ses dépendances dures (`requires`) et ses règles conditionnelles (`selon-contexte`), chargées seulement si la situation décrite se présente. Une IA ne charge que le bundle correspondant à l'intention reconnue ; un sujet hors périmètre — une modale, un tooltip non documentés — fait s'arrêter la génération au lieu de deviner par analogie.

### Ce qui se tranche seul, ce qui remonte à un humain

Quand une règle dicte la réponse, l'IA applique. Quand une **décision de design** se pose — un choix de style, de tone, de wording, un cas absent — elle s'arrête et expose les options plutôt que d'improviser depuis les règles voisines ; les niveaux de confiance calibrent la vitesse de cette remontée. Certains sujets vont plus loin : le catalogue de lois UX — un principe de référence — est marqué `audience: humans`, non compilé, jamais chargé par la machine — il éclaire des décisions humaines, il n'en dicte aucune. La frontière entre sujet « machine » et sujet « humain » est elle-même documentée.
