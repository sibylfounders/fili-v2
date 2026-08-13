# Ce que la qualification a trouvé dans le corpus

> Relevé du 2026-07-27, à l'issue de la passe de sourçage des 36 sujets.
> Objet : répondre à une question précise — le corpus, largement rédigé par une IA suivant
> un pipeline, contient-il des affirmations inventées ?
> Méthode : chaque règle a dû déclarer un statut et une source. Une règle qui affirme un fait
> extérieur sans pouvoir le sourcer est falsifiable ; c'est là, et seulement là, qu'une
> hallucination peut se cacher.

---

## La mesure, d'abord

| | Nombre | Part |
|---|---|---|
| Règles projetées, toutes couches | 1 187 | |
| Sans **aucune** source externe (`interne`) | 394 | 33 % |
| Parmi elles, énonçant un **fait extérieur vérifiable** | **26** | **2,2 %** |

Cette dernière ligne est la seule qui expose au risque d'hallucination. Les 368 autres règles
sans source sont des **préférences** — « chez nous, les deux boutons d'un bandeau sont en style
discret », « notre échelle est délibérément plus courte ». Une préférence ne peut pas être fausse ;
elle peut être discutable, ce qui est autre chose et se règle en la déclarant comme telle.

Sur les 26 restantes, l'examen ligne à ligne donne : 14 sont des **notes de méthode** qui parlent
du document lui-même (« la couleur est une fondation, le modèle à axes ne s'y applique pas ») et
ne portent aucun fait extérieur ; 8 sont des **renvois** vers une règle sourcée ailleurs, dont la
source n'a pas été recopiée dans le champ ; 4 sont des affirmations techniques réelles, toutes
vérifiées exactes lors de cette passe.

**Aucune règle inventée n'a été trouvée.**

Mais ce n'est pas la fin de l'histoire, et le reste de ce document est moins rassurant.

---

## Ce qui a réellement été trouvé : des sources mal lues, pas des faits inventés

Le défaut du corpus n'est pas l'invention. C'est **la citation approximative** : une source réelle,
invoquée pour dire un peu plus, un peu moins, ou autre chose que ce qu'elle dit. C'est un défaut
plus insidieux, parce qu'il résiste à la relecture — la référence est là, elle existe, elle a l'air
juste. Il ne se voit qu'en ouvrant la source.

Vingt-six cas ont été relevés. Les voici, classés.

### A. Faits établis, mais mal rapportés

| Où | Ce que le corpus disait | Ce que la source dit |
|---|---|---|
| `LAWS` — Miller 1956 | Le fichier réfutait le « 7±2 » puis reformulait Miller comme parlant de « la capacité de la mémoire de travail » | Miller sépare explicitement **deux** limites qui partagent le chiffre 7 *par coïncidence* — l'empan du jugement absolu (en bits) et l'empan mnésique (en chunks) — et écrit qu'il s'agit de « limitations tout à fait différentes ». Il ne prescrit aucune limite d'items. Cowan 2001 donne 4 |
| `LAWS` — Hick | Fonde la réduction du nombre d'options | Liu et al. (CHI 2020) : prise au pied de la lettre, la loi suggère d'afficher **le plus d'items possible**. Le caractère logarithmique des menus vient de la recherche visuelle (Landauer & Nachbar 1985), pas de Hick |
| `LAWS` — Zeigarnik | Justifie barre de progression et sauvegarde automatique | Méta-analyse Ghibellini & Meier (2025) : ratio rappel interrompu/achevé = **0,99**. L'effet ne réplique pas. C'est l'effet Ovsiankina (reprise) qui tient |
| `LAWS` — goal-gradient | « Une fausse jauge trahit l'effet » | Kivetz, Urminsky & Zheng (2006) documentent l'**inverse** : la carte à 12 cases dont 2 sont offertes fait accélérer les clients. L'objection à la progression truquée est éthique, pas empirique |
| `LAWS` — choice overload | Effet établi | Scheibehenne, Greifeneder & Todd (2010), 50 études, 5 036 participants : effet moyen quasi nul, aucune condition suffisante identifiée |
| `PERFORMANCE` — seuils 0,1 s / 1 s / 10 s | Attribués à NN/g | NN/g cite lui-même R. B. Miller (1968) et Card et al. (1991). Sources primaires rétablies. Attention : **ce Miller-là n'est pas celui du 7±2** |
| `MOTION` / `PERFORMANCE` — Doherty | « Seuil de 400 ms » | Doherty & Thadhani (1982) est une étude de productivité industrielle, pas une expérience contrôlée. Elle argumente le passage **sous la seconde** en illustrant à 300 ms. Le 400 ms est une lecture postérieure, et son usage comme plafond d'animation est nôtre |
| `TOUCH` — taille du doigt | « ~9 mm » | NN/g relève **16 à 20 mm** pour le bout du doigt, jusqu'à 25 mm pour le pouce |
| `VOICE` — expansion des traductions | « ~30 % » | Le tableau du W3C donne **200 à 300 %** pour une chaîne de 10 caractères ou moins. Le +30 % vaut au-delà de 70 caractères — donc jamais pour un libellé d'interface |
| `TYPOGRAPHY` — capitales | Justifiées par les lecteurs d'écran | MDN ne mentionne que la **charge cognitive** (dyslexie). Aucun effet lecteur d'écran documenté |
| `MOTION-UI` — propriétés animables | `background-color` qualifié de « composite-friendly » | MDN le classe en **repaint** |

### B. Normes réelles, périmètre sur-étendu

| Où | Norme invoquée | Ce qu'elle couvre réellement |
|---|---|---|
| `COLOR-R12` | Texte pâle réservé aux métadonnées | WCAG 1.4.3 n'admet que **trois** exceptions à 4,5:1 — grand texte, logotype, texte purement décoratif. Les métadonnées visibles n'en font pas partie : la règle décrit une **non-conformité**, pas un parti pris |
| `ELEVATION-R16` | WCAG 1.4.1 Use of Color | 1.4.1 « traite spécifiquement de la perception des couleurs ». Il ne couvre pas les ombres et ne peut pas fonder « le relief n'est jamais seul signal ». La vraie source est `forced-colors` (MDN) et 1.4.11 |
| `TOAST-R10` / `U04` | WCAG 2.2.1 exigerait la pause au survol | 2.2.1 n'offre que trois issues : désactiver, ajuster, prolonger. La pause au survol n'en est aucune. La règle tient — par convergence de systèmes, pas par la norme |
| `SPACING`, table de risque | Plancher de 44 px | 2.5.8 fixe **24 px** (AA) ; 44 px est 2.5.5 (AAA) |
| `ALERT`, `CARD`, `LINK`, `SELECT`, `ACCORDION`, `SWITCH` (couches UI) | « 44 px, standard externe non négociable » | **Six fiches** portent la même erreur. Le seuil de conformité est 24 px, et 2.5.8 exempte de surcroît le rendu par défaut du navigateur et les liens en ligne |
| `MOTION-R20` | Exemption des indicateurs de chargement | 2.2.2 exige trois conditions cumulatives dont « présenté en parallèle d'autre contenu ». L'exemption est conditionnelle, pas automatique |
| `VOICE-R15` | WCAG 3.2.4 | Le critère exige une identification **cohérente**, pas identique, et donne « Print receipt » / « Print invoice » comme conformes. « Un concept = un mot » est un durcissement interne |
| `LAWS-R17` — Postel | RFC 760 / 761 | **RFC 9413** (IAB, 2023) retourne le principe de robustesse : tolérer l'inattendu « n'est plus une bonne pratique dans tous les scénarios ». La règle d'interface tient, resourcée sur GOV.UK et ONS |

### C. Convergences proclamées qui n'existent pas

| Où | Ce que le corpus affirmait | Le relevé |
|---|---|---|
| `ELEVATION-S1` | Échelle courte « établie par convergence » | Material 6 niveaux, Fluent 6, Polaris 6, Atlassian 4, Carbon 0 (profondeur par couches de fond). **Aucun système vérifié ne tient trois niveaux** |
| `MODAL-R04` | « Jamais de modale sur modale », établi par convergence | L'argument reposait sur le **silence** de l'ARIA APG. Une absence de motif n'est pas une convergence, et la spécification HTML autorise explicitement l'empilement dans le top layer. Un seul système l'interdit noir sur blanc (Carbon) |
| `TABS-S6` | Convergence Material / Polaris sur le non-retour à la ligne | Les deux pages sont rendues en JavaScript et illisibles en texte : la convergence n'était pas vérifiable. Remplacée par Carbon + GOV.UK + CMS, vérifiés |
| `TOAST-U10` | « Carbon, Polaris et Material proposent tous bas-droit » | Carbon ancre **en haut à droite**, Polaris **en bas**. L'affirmation est fausse |
| `SELECT-R01` | Seuil de 2 à 5 options | USWDS place la frontière à **7**, et le plafond à 15. Seule la direction converge |
| `ACCORDION-R02` | Multi-ouvert par défaut | L'APG autorise **explicitement les deux modèles**. Il ne peut pas fonder le nôtre |
| `GRID`, sources du shell | Trois design systems cités | Les trois liens pointaient des pages d'accueil nues. Remplacés par les vraies pages Carbon, qui montrent un en-tête permanent absent de notre modèle |
| `LINK-S4` | « Sémantique HTML + convergence des design systems majeurs » | Aucune URL vérifiable. Doublée par les sources primaires réelles |

### D. Sources mortes ou dépréciées

- `LAWS-S7` — `articles.uie.com` : redirige, l'article d'origine n'est plus à cette adresse
- `MODAL-S6` — page Carbon « delete-and-remove-pattern » : **404**
- `TOAST-T5` — NN/g Timestamps : **404**, aucun remplacement trouvé chez NN/g
- `VOICE-T1` / `T2` — GOV.UK : redirection 302 vers un autre domaine
- `MODAL-S7` — page Polaris Modal : redirige vers une page **marquée dépréciée**
- Material 3, Spectrum, Atlassian : plusieurs pages rendues en JavaScript, **invérifiables en texte**. Toute citation de ces systèmes reposant sur une lecture non vérifiée est à considérer comme fragile

### E. Contradictions internes

- `CARD-R76` (« l'interactivité est univoque ») **interdit** le cas que `CARD-R23` autorise
- `MODAL-U04` affirme encore que le verrou porte sur le document, alors que `U09` a établi l'inverse
- `TABS-R13` (activation automatique par défaut) contre `TABS-R17` (démontage du volet par défaut) : l'APG conditionne la première au préchargement
- `TABS-U09` interdit les valeurs brutes, `TABS-U04` en écrit trois
- `VOICE-U10` interdit les formats de date ambigus **puis donne `12/07/2026` en exemple acceptable** — l'archétype du cas interdit
- `TOAST-R13` place un bouton dans un conteneur que `R24` fait porter `role="alert"`, que MDN réserve au contenu textuel. Même contradiction que celle déjà relevée sur `ALERT`

---

## Ce qu'il faut en conclure

**Le pipeline a bien tenu sur les faits.** Aucune source inventée, aucune étude fictive, aucune URL
fabriquée n'a été trouvée sur 1 187 règles. Les 26 règles qui affirment un fait sans le sourcer
disent toutes vrai.

**Il a lâché sur la précision de la citation.** Le motif est constant et il est reconnaissable : la
source existe, elle est proche, mais on lui fait dire la version vulgarisée plutôt que la version
exacte. Miller, Hick, Doherty, le 44 px, 2.2.1 : à chaque fois, ce que « tout le monde sait » a
remplacé ce que le texte dit. C'est précisément le mode d'erreur d'un modèle de langage — il
restitue le consensus du web, pas la source primaire.

**C'est réparable, et ça vient de l'être.** Les 26 cas ci-dessus sont corrigés ou documentés dans
les fichiers. Ce qui reste à faire est d'empêcher la récidive.

## Trois garde-fous à inscrire dans la méthode

1. **Une source ne compte que chargée.** Un lien non ouvert n'est pas une source. Les pages rendues
   en JavaScript ne sont pas vérifiables et doivent être déclarées telles quelles, pas citées comme
   si elles l'étaient.
2. **Citer le niveau, pas seulement le critère.** « WCAG 2.5.5 » et « WCAG 2.5.8 » disent 44 et 24 :
   omettre le niveau AA/AAA est ce qui a produit la même erreur dans six fiches.
3. **Une convergence se compte.** Deux systèmes vérifiés, nommés, avec la citation relevée — ou le
   mot « convergence » ne s'écrit pas. Le silence d'une source n'est jamais une convergence.

`tools/extrait-decisions.py` signale déjà les « lois fragiles » — universelles sans norme ni deux
systèmes. C'est le bon endroit pour faire appliquer le troisième garde-fou mécaniquement.
