# system-map.md — Carte du système FILI V2

> Document vivant. **Il décrit le présent** — il ne raconte pas comment on y est
> arrivé, c'est le rôle de `journal.md`. Toute décision qui déplace un statut de
> cette carte porte un numéro d'entrée au journal.
>
> **Réécrite le 2026-08-07.** L'état antérieur avait été écrasé par une session
> concurrente le 7 août à 08h37 ; une carte décrit le présent, elle se réécrit
> donc plutôt qu'elle ne se restaure. L'incident est tracé en `#049`.
>
> **Dernière décision au journal** : `#133` — 84 entrées scellées

**Légende des statuts**

| Statut | Signification |
|---|---|
| ⚪ | **Idée** — formulée, non instruite. Aucun engagement. |
| 🟡 | **En cours** — instruite, en discussion ou en construction. Réversible. |
| 🟢 | **Verrouillé** — épreuve déterministe passée à 100 %. Ne se rouvre que par une décision explicite tracée au journal. |
| 🔴 | **Ouverte** — pour une dette : constatée, non traitée. |
| 💤 | **En sommeil** — arrêté volontairement. Rien n'est supprimé ; se rouvre par une entrée de journal. |

> **Convention de lecture machine.** Les tableaux des sections **1 à 5** sont
> lus par `tools/fili/carte/produire.mjs`, qui en dérive la pièce que l'écran
> É5 affiche. L'ordre des colonnes de ces cinq tableaux fait partie du contrat :
> le producteur **refuse de statuer** si un tableau attendu est absent ou si son
> en-tête a changé. Il ne devine jamais. Le markdown reste le document humain ;
> la pièce structurée en est dérivée, et il n'y a qu'une source.

---

## 1. Les jalons du chapitre « Échelle de signature »

| Jalon | Statut | Ce qu'il verrouille | Ce qui le bloque |
|---|---|---|---|
| K1 · Épreuve du corpus suffisant | 🟢 | Le verdict **NON** : le corpus seul ne produit pas une signature | — |
| K2 · Déclaration du produit | 🟢 | Fili, trois parcours, sept gabarits, un contrat d'état par écran | — |
| K3 · Routage de la signature | 🟢 | Vingt composantes routées : cinq en Voie A, neuf en Voie B | — |
| K4 · Les instruments | 🟢 | Le protocole de référence, ses neuf points de passage, le contrat S5 | — |
| K5 · Construction du produit | 🟡 | Les sept gabarits construits | **Plus rien** — la condition de séance est levée (`#061`) |
| K6 · Épreuve D · propagation | 💤 | Qu'un durcissement de règle se propage à l'échelle | **En sommeil** (`#061`) — se rouvre par une entrée de journal |

---

## 2. Les contrats du corpus

| Contrat | Statut | Ce qu'il gouverne | Assertions |
|---|---|---|---|
| S1 · Composants typés | 🟢 | L'interface passe par le registre, jamais par une balise native | 6 |
| S2 · Contrat d'état | 🟢 | Toute donnée distante expose ses quatre états | 5 |
| S3 · Discipline spatiale | 🟢 | Tout espacement vient de l'échelle, et les rapports de groupe tiennent | 7 |
| S4 · Rythme de composition | 🟢 | La page est une suite de sections, densités et titres compris | 7 |
| S5 · Arbitrage de lecture | 🟢 | Une page déclare ce qui compte d'abord, une seule fois, en tête | 4 |
| S6 · Provenance de l'expression | ⚪ | D'où viennent couleur, typographie, iconographie, mouvement, libellés | 0 — exigible avant K6 |

**Total porté et actif : 30 assertions.** Batterie : 80 fixtures à 100 %.
Mutations : 46 sabotages sur 46 produisent l'écart attendu, **remesurés le
11 août** après la migration de la géométrie. Contrôle d'intégrité : 30/30.

**La géométrie est celle de l'Échelle Semantic Rhythm depuis `#059`, et, dans
le kit, celle des huit décisions du 25 août 2026** (`claude/decisions-serie-2026-08-25.md`).
L'espace ne porte plus de nombre : trois profondeurs d'emboîtement — coque,
carte, ligne —, deux axes horizontal et vertical qui ne bougent pas ensemble,
et tout le registre descend de trois décisions d'entrée : base 24, intervalle
√2, racine des coins 16 (planche du 25 août, verdict d'Auteur), plus l'intervalle
des titres 1,25. L'espace entre deux frères vaut leur marge ; les coins divisent
par deux par niveau et ne glissent pas avec l'écran ; un composant prend le coin
de la ligne ; la densité change la base ; le corps est borné à 16 ; le site du
kit tourne sur le même registre que ses démos. Le facteur de proximité de R3.7
suit le ratio. Aucun contrat n'a été rouvert.

---

## 3. Le produit — les sept gabarits

| Gabarit | Parcours | Statut | Témoin |
|---|---|---|---|
| É1 · Le verdict | P1 · Prononcer le verdict | 🟡 | 2026-08-07 · 5 états · séance non tenue |
| É2 · Le constat | P1 · Prononcer le verdict | 🟡 | 2026-08-07 · 4 états · séance non tenue |
| É3 · La famille des témoins | P2 · Juger un témoin | 🟡 | 2026-08-07 · 4 états · séance non tenue |
| É4 · Le face-à-face | P2 · Juger un témoin | 🟡 | 2026-08-07 · 5 états · séance non tenue |
| É5 · La carte | P3 · Acter une décision | 🟡 | 2026-08-07 · 3 états · séance non tenue |
| É6 · Le journal | P3 · Acter une décision | 🟡 | 2026-08-07 · 4 états · séance non tenue |
| É7 · L'acte | P3 · Acter une décision | 🟡 | 2026-08-07 · 5 états · séance non tenue |

**Un gabarit ne passe 🟢 que lorsque son témoin a été accepté en séance.**
Aucune séance ne s'est tenue : les sept témoins sont admissibles, aucun n'est jugé.
La séance ouverte sur É1 le 2026-08-07 a été annulée sur une condition d'admission
non remplie ; la condition est levée depuis `#056`, la séance est réouvrable.

**Le système** porte **quinze composants** — Button, TextField, Selection,
EtatAsync, Section, Titre, Texte, Pile, Grille, Jeton, Alerte, Vide, Squelette,
Rendu, Prose — plus Icone, interne et non exporté.

---

## 3.7 — Le kit (`kit/`) — 🟡 en construction

> Le kit est la reconstruction par les **notions mères** décidée en `#102` :
> les fondations d'abord, les composants gelés jusqu'à leur verrou. Le dossier
> `kit/` naît en `#104` ; l'existant devient `sources/`. Chaque page se
> reconstruit sur le gabarit « documentaire nu » (`#107`, règles CG1–CG5),
> une page à la fois, verdict d'Auteur entre chaque.

| Page | Statut | Ce qu'elle porte | Ce qui la bloque |
|---|---|---|---|
| `/` · La porte | 🟢 | Couverture de charte, le moteur en objet vivant, trois spécimens de fondation, la carte du système | — (`#111`) |
| `/typo` · Typographie | 🟡 | Douze règles (T12, le calage, depuis le 4 septembre), huit crans et un seul rapport, la mesure dans son cadre au verdict lu, la gazette, six bandes dont la carte calée — passée à la voix et aux quatre étages le 2 septembre | **Reverrouillée le 7 septembre : sept épreuves réécrites sur la page d'aujourd'hui (bandes, fonts, mesure lue, calage mesuré), le banc repassé vert de bout en bout.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, douze épreuves (`#127`) ; la carte du zoom s'ouvre au ×2 depuis le 31 août, l'épreuve décrivait encore l'état de repos — remise au niveau le 1er septembre (elle éprouve maintenant les trois états). |
| `/rythme` · Rythme | 🟡 | Le moteur en ouverture (le scénario, douze slides, depuis le 2 septembre) ; la chaîne : coque, carte, ligne ; la densité qui change la base ; la profondeur — réécrite sur les huit décisions le 25 août | **Reverrouillée le 7 septembre : le film déclare ses valeurs écrites à la main, le couple chiffre-légende est mesuré, le banc repassé vert.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, quinze épreuves (`#126`) ; réglette de la chaîne et quatre couleurs de crans posées le 31 août — vert, bleu, jaune, rouge (rupture déclarée : ici la couleur dit la profondeur, pas la nature ni l'état) — à repasser au crash-test ; le laboratoire remis au niveau le 1er septembre (l'amorce « deux fois le même geste » portée de la pièce libre à la place des pastilles ; chiffres de légende alignés sur la densité du site). Épreuves remises au niveau le 1er septembre : l'amorce, l'anneau de marge, la carte devenue rangée, le menu devenu contrôle, la réglette. Deux fautes corrigées au passage — l'écart de la réglette, qui n'était pas dit, et la réglette qui écrasait l'affiche du bon cran. |
| `/couleur` · Couleur | 🟡 | Dix-sept règles, la palette, le nuancier en six lignes signées, la situation, le moteur, cinq bandes (dont « teinter ne coûte rien ») — passée à la voix et aux quatre étages le 2 septembre | **Reverrouillée le 7 septembre : cinq épreuves réécrites (un seul panneau mesuré dans les deux thèmes, la casse de la teinte entre à l'épreuve), une faute corrigée (la marque du panneau de code écrite à la main, lue au moteur), le banc repassé vert.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, huit épreuves (`#128`) ; le nuancier est passé en deux groupes et la démo du moteur ne pilote plus la page (31 août) — épreuves remises au niveau le 1er septembre. Une faute corrigée : les 5,5 rem que le fond doux réservait à la lane du ton, écrits à la main, sont maintenant nommés et dits. |
| `/composition` · Composition | 🟡 | Le regard : l'écran qu'on casse (le vocabulaire EST la légende, relié par filets, 31 août), le chemin de l'œil (F et Z), l'espace blanc mesuré, les quinze lois | Ses jetons sont rabattus sur la chaîne, ses valeurs propres restent hors chaîne (dette déclarée) |
| `/arrondis` · Arrondis | 🟡 | La profondeur choisit le coin ; le coin intérieur ; la pilule ; six pièges révélés par leur curseur (2 septembre) — racine 16, bouton = coin de la ligne ; le répertoire des intentions a quitté la page | **Reverrouillée le 7 septembre : deux épreuves réécrites sur les pièges, le banc repassé vert.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, neuf épreuves (`#129`) ; le bouton en pilule n'est plus un recalé depuis le 31 août — l'épreuve comptait encore deux recalés. Remise au niveau le 1er septembre : elle mesure désormais que les deux boutons de la paire sont le même objet à un fond près. |
| Composants & patterns | 💤 | — | Gelés jusqu'au verrou des fondations (`#102`) |

**Le moteur du kit** (`kit/derivation.mjs`) — 🟢 pour la couleur, 🟢 pour le
rythme (écrit et éprouvé le 25 août, jugé sur pièce et commité le 26, 23 épreuves vertes). Quatre
décisions d'entrée : primary, base, intervalle, racine des coins (+ l'intervalle
des titres). Il écrit `kit/app/tokens.css` en entier, `kit/tokens.tailwind.mjs`
et `kit/tokens.figma.json` (`npm run tokens`) ; `kit/derivation.test.mjs`
rejoue les huit pages de décision et vérifie le site lui-même : aucun ancien
nom, aucun jeton orphelin, aucun nombre posé hors des lignes qui le disent
(`npm test`). Le gabarit documentaire descend de la chaîne : silence au 4ᵉ cran
de page, titres du site à un cran et demi au-dessus de l'affiche.

**Le menu et le rail** (2 septembre, direction A) — 🟢 posés, mesurés par le
banc. Le rail garde la page : une ligne en tête dit la famille et s'ouvre, la
colonne entière est au sommaire ; le site part dans une feuille à un panneau
(la maison, Système, Produit, Contact, Téléchargements) ; en petit, une barre à
deux boutons sous l'en-tête. La page en cours n'est plus cliquable et la
navigation passe par le routeur. Restent à nommer : les paquets, le contenu de
Contact et Téléchargements.

**Le calage vertical** (4 septembre, verdict du 7 délégué à Claude) — 🟡
acté : les cinq règles sont actées (le calage se déclare ; les deux bords
nommés ; l'ancienne écriture refusée ; on rogne par rôle ; la pile de secours
calée), aucune verrouillée — chacune passera 🟢 avec son test au Gardien. La
règle 4 n'est pas engagée : appliquer le rognage au kit est un chantier à part
(quels rôles, puis la relecture des espaces), le kit reste non rogné, seule la
carte de la démo l'est. S3 ne se rouvre que dans ce chantier-là.

**Le mouvement du kit** (4 septembre, décisions d'Auteur du 3) — 🟡 posé, à
valider à l'œil. Le moteur porte désormais quatre durées avec leur emploi
(100 bouton · survol · appui ; 200 menu · infobulle · dépliant ; 300 tiroir ·
fenêtre · panneau ; 700 arrivée d'une section) et la courbe du kit
(`cubic-bezier(0.23, 1, 0.32, 1)`, proposée, à juger sur le site). Plus une
seule durée écrite à la main dans les feuilles : chaque transition prend son
jeton et dit son emploi, ou dit « chorégraphie » sur sa ligne — trois seulement
(le film de `/rythme`, l'entrée de l'accueil, la boucle du chemin de l'œil sur
`/composition`). Une valeur qu'on fait glisser ne s'anime plus (`/arrondis`, le
film de `/rythme` pendant qu'on tourne sa molette). Les vraies commandes
répondent à l'appui. Sous mouvement réduit, les déplacements partent et les
fondus restent — écrit par construction (un déplacement n'existe que sous son
portillon), vérifié par deux épreuves du moteur. Reste à l'œil de l'Auteur :
la courbe, et la cascade du nuancier de `/couleur` ramenée sur les crans.

**Le banc des crash-tests de page** (`kit/epreuves/`, `npm run test:pages`,
`#125`) — 🟢, repassé vert le 7 septembre (course complète sur la machine
d'Auteur : moteur 29/29, pages 12 · 12 · 9 · 8). Le site construit à part, ouvert dans Chromium à 320 · 768 · 1440,
dans les trois densités et les deux thèmes ; le navigateur mesure, le moteur
prédit, au dixième de pixel. Six épreuves communes — les chiffres affichés, les
preuves par leur jeton, la densité, les titres, C17, rien en dur — et, par page,
ce que sa terre exige : 44 épreuves sur les quatre pages (`#126` → `#129`).
Le 1er septembre, douze d'entre elles étaient rouges — les pages avaient bougé
les 27, 30 et 31 août et le banc n'avait pas été relancé. Neuf disaient une page
qui n'existait plus, trois nommaient de vraies fautes. Les neuf ont été
réécrites sur ce que les pages prouvent aujourd'hui, sans baisser l'exigence,
et les fautes corrigées. Le 7 septembre, dix-sept étaient rouges pour la même
raison — les lots du 2 au 4 n'avaient pas été remis au niveau : quinze
réécrites sur la page d'aujourd'hui, deux vraies fautes corrigées, aucune
relâchée ; le banc tourne vert de bout en bout depuis le 7 au matin.
Une page ne passe 🟢 que par lui. Le gabarit commun ne s'élargit plus au-delà de
la page (zéro débord à 320, règle 15).

**Le banc s'accroche au travail** (1er septembre, décision d'Auteur). Le
décrochage de fin août n'était pas une panne : on oubliait de lancer
l'instrument. Deux pièces retirent l'oubli, sans jamais bloquer la main.
`kit/epreuves/etat-du-banc.mjs` tourne à chaque enregistrement, dans le
garde-fou déjà en place : il compare la date de la dernière écriture d'une page
à celle de son dernier passage au vert, et **rabat lui-même le 🟢 de cette table
à 🟡** quand le vert ne tient plus. Il ne fait jamais l'inverse — reverrouiller
reste une décision d'Auteur, écrite au journal (garde-fou 2).
`kit/epreuves/course-de-nuit.mjs` lance le banc chaque nuit à 3 h 30
(`npm run banc:nuit`), écrit son verdict en clair dans `docs/banc-du-jour.md` et
remet cette table au vrai. Une nuit où le site ne se construit pas ne rabat
rien : rien n'a été mesuré, la dernière mesure connue tient. Le verrou au commit
a été examiné et **écarté** : deux minutes d'attente à chaque enregistrement
pousseraient à grouper les commits, et le journal vit de leur finesse.

**Le moteur de couleur** — 🟢 verrouillé. Le 7 septembre, un jeton
`--code-danger` est né et mort le même jour : la scène qui en avait besoin se
déclare en thème sombre et prend le rouge du système (verdict d'Auteur). Une décision
d'entrée : primary. Il dérive la famille entière pour les deux thèmes ; ses
seuils sont arrêtés le 2026-08-24 et ne se retouchent plus sans nouvel
arbitrage (`#110`) — un seul l'a été depuis, sur pièce : le déplacement des
états (`#130`, 2026-08-27 : moitié / 30°, et l'arc du moteur corrigé — les
marques chaudes tournaient du mauvais côté), révisé sur pièce le 30 août en
**adaptation légère** : un quart / 12° (`#132`, COLOR-UX 2.8.0). Depuis le 2026-08-30 (`#131`), **l'accent est un choix d'auteur** —
#75E242 à la charte, valeur souveraine, hors paires déclarées, repli calculé
(−55°, calé) quand aucun choix n'accompagne la primaire. Depuis le 2026-08-31
(`#133`, C18 révisée sur pièce), **le focus est un halo** collé à l'objet —
bande = le fond doux de la famille, trait fin ; **trois familles** (neutre,
marque, rouge) et **deux régimes** : au clavier le trait calé (`focus-ring`,
`focus-ring-danger`, `focus-ring-neutral` — le cran le moins soutenu qui
tient 3:1, sous contrat), au clic le trait pâle (`…-soft`, cran 200 / 800,
hors contrat, dit) ; forme posée une fois (`--focus-band` 3 px, `--focus-line`
1 px = le coin du composant, le coin du halo suit la chaîne), deux calques
creux, jamais une ombre ; les champs le portent par leur enveloppe
`.champ-boite`. `kit/app/tokens.css` est **généré** — une valeur retouchée
à la main serait une valeur sans provenance. Sa **gamme 50–950** pose la
couleur saisie sur le cran de sa clarté, telle quelle, et déduit les autres
crans d'elle ; les neutres restent les marches fixes ; la page dit sur quel
cran chaque rôle se pose, sans qu'un rôle consomme jamais un cran (`#113`).
Une encre de plus depuis le 25 août, `text-tertiary` (3:1 au seuil sur le
fond le plus dur), tenue par **C17** : une intention dite sur sa ligne, jamais
du texte lu, jamais sous le cran étiquette, et — depuis le 26 août, sur pièce —
un cran de graisse de plus en petit (600 au moins). Le vérificateur éprouve les
trois (`#124`).

---

## 4. L'instrument de la Voie B — 💤 **ARRÊTÉ** (`#061`)

> Le protocole de jugement est arrêté le 2026-08-11. Rien n'est supprimé : les
> pièces restent au dépôt et se rouvrent par une entrée de journal. La suite du
> travail est une liste de règles à verser, une par une, chacune avec son test.

| Pièce | Statut | Ce qu'elle porte | Ce qui la bloque |
|---|---|---|---|
| Le protocole de référence | 💤 arrêté | Neuf points de passage, quatre temps, verdict binaire | — |
| Le gel définitif | 🟢 | Les quatre réglages arrêtés le 7 août | — |
| La planche des registres | 🟢 | Étalon de B-4, page datée générée | — |
| Le catalogue de libellés | 🟢 | Étalon de B-5, 116 formulations lisibles d'un bloc | — |
| La première séance | 💤 abandonnée | Le premier verdict d'œil du chapitre | Sept témoins prêts et admissibles ; la séance É1 du 7 août est réouvrable |

---

## 5. Les dettes ouvertes

| Dette | Statut | Depuis | Ce qu'elle coûte |
|---|---|---|---|
| Les entrées #001 à #042 du journal | 🟢 | `#049` · `#057` | **Trente** perdues, non reconstruites. Douze — `#001` à `#012` — sont revenues à l'identique et restent hors du journal, à leur propre chemin. |
| Le journal du dépôt à l'état run 1 | 🟢 | `#051` | Fermée : le journal vit au dépôt et il est scellé. |
| L'immuabilité non scellée | 🟢 | `#053` | Fermée : la garantie couvre la pièce qui fait foi. |
| La sauvegarde hors machine | 🟢 | `#052` | Fermée : le dépôt est poussé hors du disque. |
| Le rognage de l'interligne | 🔴 | `#052` | S3 vérifie un espacement que l'œil ne voit pas — huit pixels déclarés se voient à treize. |
| L'auto-référence de É3 | 🔴 | `#052` | La famille des témoins se contient elle-même ; à trancher par l'œil en B-1. |
| La restauration du script de mutation | 🔴 | `#046` | Le garde-fou ne survit pas à une terminaison brutale ; le contrôle d'intégrité est le seul filet réel. |
| Le suivi ClickUp | 🔴 | — | Il porte la série J et s'arrête à `#012` ; la série K n'y existe pas. |
| La carte du système à reprendre | 🟢 | `#054` | Fermée : réécrite au dépôt, et dérivée pour l'écran. |
| L'emphase du journal invisible sur É6 | 🔴 | `#054` | Le texte des entrées est entier, son relief ne l'est pas : aucun composant du registre ne rend du balisage. |
| Le moteur de géométrie sans preuve contre la source | 🔴 | `#059` | Le socle est exact ; le découpage en crans et le rythme responsive sont reconstruits. Vingt-trois jetons produits là où la note en dénombrait vingt-deux. Se ferme le jour où le générateur revient au dépôt. |
| La provenance des hauteurs de témoin | 🔴 | `#059` | Elles se disaient « multiples de l'échelle d'espacement, 21 pas de 32 ». La phrase n'a plus d'objet. Les valeurs restent justes, leur justification est à réécrire. |
| Les cinq trous de la promesse mesurée | 🟢 | `#081` → `#083` | Fermée : couleur nommée (`#082`), rond qui tourne, icône répétée, texte suivi hors pile, porte des données (`#083`). |
| Le corpus ne lit qu'une seule façon d'écrire du style | 🔴 | `#086` | Douze des treize contrôles lisent des classes utilitaires. Sur du CSS ordinaire, l'appareil est muet. « Ce cadre juge n'importe quel code » est faux tant que ça dure. |
| Le contrôle de couleur est aveugle aux jetons étrangers | 🔴 | `#085` | Il ne connaît que les familles livrées par défaut. Un écran écrit dans un autre vocabulaire de jetons le traverse en silence — la porte est fermée, mais aucun message ne nomme la faute. |
| La règle du mouvement est trop large d'un cran | 🔴 | `#084` | « Rien ne tourne dans le vide » vise l'attente et refuse toute animation, y compris l'ouverture d'une fenêtre. Constatée en mesure, non corrigée. |
| Rien ne traduit du code existant vers le cadre | 🔴 | `#084` | 240 refus sur un écran étranger pour 2 décisions réelles (palette, échelle). Sans outil de traduction, le cadre a raison et n'est pas adoptable. |
| L'amorçage lit hors de la couche de données | 🔴 | `#083` | Le démarrage lit l'état par la fenêtre et non par la porte. Il n'affiche rien, il ne peut donc oublier aucun état — mais il est exempté par son nom, et une exemption nommée est une dette. |
| Le décompte des sabotages est invalidé | 🔴 | `#083` | La carte annonçait 46 sur 46 alors que le test de mutation ne pouvait plus rien injecter depuis un temps inconnu. À remesurer avant toute lecture de ce chiffre. |
| Les démos du kit n'emploient pas le registre | 🔴 | `#112` | Boutons et champs des démonstrations sont dessinés dans la page, pas tirés du registre du kit. Se ferme quand les composants entrent (phase 4). |
| Le wording des pages du kit | 🔴 | `#112` | Une passe d'affinage est due sur les quatre pages : dite au verrou, non planifiée. |
| Les seuils de mise en page du site | 🔴 | 25 août 2026 | Le site en porte neuf (80 · 69 · 62 · 56 · 48 · 44 · 40 rem, 900 · 560 px) là où la décision 7 en veut un seul par régime. Déclaré dans le moteur (`seuilRail`), à arbitrer dans un thread à part. |
| Les pages Accueil et Composition hors chaîne | 🔴 | 25 août 2026 | Leurs anciens jetons sont rabattus sur la chaîne pour que les pages tiennent ; leurs valeurs propres (`--acc-*`, `.co-*`) restent posées en dur, blocs marqués « dette déclarée » dans globals.css. À dériver quand chaque page sera reprise. |
| Le journal en retard de onze entrées | 🟢 | 25 → 26 août 2026 | Fermée : les huit décisions et les trois entrées du thread « Le kit passe sur la chaîne » sont versées (`#114` → `#124`) et scellées (75 entrées). |
| Les sept témoins non jugés après migration | 🔴 | `#059` | Tous les nombres des sept écrans ont changé. Le verdict mécanique est vert des deux côtés ; l'œil n'a pas parlé. La planche de comparaison existe, la séance non. |

---

## 6. Les documents vivants

| Document | Où | Ce qu'il porte |
|---|---|---|
| `journal.md` | dépôt | Le journal d'intention à partir de `#050`. Scellé par empreinte. |
| `system-map.md` | dépôt | Cette carte. |
| `claude/journal.md` | projet | Archive gelée des entrées `#043` à `#049`. Close (`#057`). |
| `claude/sauvetage-journal-001-012-verbatim.md` | projet | Les entrées `#001` à `#012`, revenues à l'identique. Pièce close (`#057`). |
| `claude/archive/` | projet | Les documents de la run 1, clos. |
| `fili.expression.json` | dépôt | La planche des registres — source, pas valeurs. |
| `fili.libelles.json` | dépôt | Le catalogue de libellés. |
| `fili.registry.json` | dépôt | Ce que le Gardien lit pour statuer. |
| `fili.geometrie.json` | dépôt | La géométrie dérivée de l'Échelle — pièce générée, jamais éditée. |
| `src/geometrie.genere.css` | dépôt | Les vingt-trois jetons fluides — pièce générée, jamais éditée. |
| `temoins/avant-apres-2026-08-11.html` | dépôt | Les sept gabarits dans leurs deux états, côte à côte, pour la séance. |
| `claude/migration-echelle-correspondance.md` | projet | La table de correspondance ligne à ligne de la migration. |
| `fili.assertions.json` | dépôt | Le manifeste des assertions déclarées. |
| `fili/geometrie.json` | dépôt | La géométrie, dérivée de l'Échelle. **Vérifiée contre la source** (`#060`), deux écarts déclarés. |
| `fili/lexique.json` | dépôt | La correspondance avec l'outil de l'Auteur. Refuse de statuer si un jeton cité manque. |
| `public/systeme/index.html` | dépôt | **Le système au complet, sur une page** — cartographie des dénominateurs, espaces, couleurs, texte, composants, règles, lexique. Générée. |

---

## 7. Ce que cette carte ne dit pas

Elle ne dit pas si le produit est **bon**. Vingt-neuf assertions au vert
signifient qu'aucune des fautes nommées n'est présente ; elles ne disent rien du
parti visuel, de la hiérarchie perçue ni du ton. C'est la Voie B qui le dira, et
elle n'a pas encore parlé une seule fois.
