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

**Mise à jour du 2026-08-13 — la lignée du projet est rapatriée.** La lignée du
projet a continué après `#049` sans voir `#051` ni `#057` (kit de création,
test KYB, séance É1 et ses suites, déclaration du produit). Ses huit entrées
postérieures à `#049` sont **reprises ici sous `#087` à `#094`**, textes
d'origine, avec une note chacune. Correspondance : projet `#058`→`#087` ·
`#059`→`#088` · `#060`→`#089` · `#050`→`#090` · `#051`→`#091` · `#061`→`#092` ·
`#062`→`#093` · `#063`→`#094`. `claude/journal.md` est de nouveau **gelé comme
pièce**, à 15 entrées (`#043`–`#051`, `#058`–`#063`). Plan et inventaire :
`claude/plan-reconciliation-journaux-2026-08-13.md` et
`claude/inventaire-versement-journal-2026-08-13.md`.


---

## #133 — Le focus est un halo : la famille de l'objet, deux régimes, et la forme posée une fois
*2026-08-31 · Statut : 🟢 décidé sur pièce · Révise : la forme de C18 (`#131` n'est pas rouvert : le focus reste hors de l'accent) · Thread « l'anneau de focus — la forme et les familles »*

**Contexte** — C18 (26 août) fixait un anneau détaché de 2 px, écart de
1 px sur un plein et de 2 px sur un bordé, et la famille de l'objet ; seule
la couleur avait été exécutée (`#131`). Le thread devait exécuter la forme
et les familles, avec une question d'Auteur en suspens : 1 px sur les
bordés. Trois pièces, trois verdicts successifs. Première pièce
(`anneau-focus.html`) : A « 2 px partout » contre B « 1 px sur les
bordés », taille réelle et loupe, clair et sombre — verdict B, avec la
demande d'essayer une couleur plus discrète. Deuxième pièce
(`anneau-discret.html`, puis le banc interactif `anneau-banc.html`) : les
crans 300, 200, 100 de la gamme font 2,0 / 1,5 / 1,2:1 sur le fond clair —
sous le minimum légal pour un indicateur de focus, pas seulement sous
l'exigence propre du kit ; en sombre tout tient. L'Auteur a alors dessiné
dans Figma et tranché : « on va faire plutôt ça » — un **halo**.

**Décision** — Le focus est un **halo collé à l'objet** : une bande pâle,
3 px, dans le **fond doux de la famille** de l'objet (`primary-subtle`,
`danger-subtle`, `surface`), fermée par un **trait fin** de 1 px ; pas de
fente ; le halo part du bord extérieur de la bordure et ne la touche
jamais ; il dessine la boîte des objets texte seul. **Trois familles** :
neutre par défaut, marque pour ce que la marque colore, rouge pour le
danger et l'erreur. **Deux régimes**, verdict d'Auteur sur la dernière
pièce (`anneau-halo.html`) : au clavier, le trait est **calé** — le cran le
moins soutenu de la famille qui tient encore 3:1 sur bg et surface ; au
clic et au doigt, le trait est **pâle, tel que dessiné** (cran 200 en
clair, 800 en sombre). La forme est **posée une fois** (`--focus-band`,
`--focus-line` : 4 px en tout = le coin du composant) et les coins du halo
suivent la chaîne des arrondis (coin de l'objet + bande, + bande + trait).

**Sens produit / UX** — La norme ne regarde que le focus clavier : c'est
lui l'indicateur, c'est lui qui porte le contrat (3:1, dans les paires
déclarées). Le retour de clic est un geste, pas un signal d'orientation ;
il peut être discret, et il l'est — hors contrat, et dit. Le halo prend la
famille de l'objet parce qu'il n'introduit jamais une couleur nouvelle dans
l'écran ; sa bande réutilise le fond doux qui existe déjà : la décision ne
crée que les six traits. Deux leçons de pièce entrent au code comme
règles : le halo est dessiné comme deux calques creux, jamais comme une
ombre (Safari ne gonfle pas le coin d'une ombre étalée — vu sur l'iPhone
de l'Auteur), et il commence au bord extérieur de la bordure (le premier
rendu la recouvrait d'un pixel — vu aussi).

**Alternatives écartées** — A, 2 px partout (le dessin unique, mais lourd
sur les bordés) ; B, 1 px sur les bordés (retenue un temps, dissoute par le
halo) ; les crans 100–300 comme trait unique (sous le minimum légal en
clair) ; « le plus discret qui tient » comme trait unique (retenu pour le
clavier seulement) ; le halo tel que dessiné pour les deux régimes (aurait
mis l'indicateur clavier sous 3:1 en clair) ; les ombres étalées pour le
dessiner (Safari) ; une classe ajoutée sur chaque objet (le halo se pose
par les sélecteurs des consommateurs existants — seuls les champs reçoivent
une enveloppe, un champ natif n'ayant pas de pseudo-éléments).

**Conséquences** — moteur : `focus-ring` change de recette (le moins
soutenu qui tient, au lieu de primary calé), naissance de
`focus-ring-danger`, `focus-ring-neutral` (= border-strong) et des trois
`…-soft` ; six paires déclarées ; `HORS_CHAINE.focus` (bande 3, trait 1)
émis dans tokens.css et Figma ; épreuve neuve, crash-test 26/26 ; jetons
régénérés (seules lignes changées : les six traits, `--focus-band`,
`--focus-line`). Feuilles : les huit règles de focus de `globals.css` et
`arrondis.css` remplacées par une section « halo » unique — familles par
sélecteur, deux régimes (`:focus-visible` / `:focus`, `:active`), porteurs
à deux calques, à un calque (dépliant, poignée, interrupteur : l'autre
pseudo-élément est pris) et sans pseudo-élément (le curseur natif : ombre +
contour, sur une pilule) ; les mosaïques fermées dessinent le halo dedans ;
deux champs enveloppés (`.champ-boite`). Page Couleur : six paires, le texte
de C4. Preuve de rendu : les quatorze porteurs capturés au clavier et au
clic, clair et sombre (`claude/livrables/preuve/`). Corpus : COLOR-UX passe
en 2.10.0 (C18 réécrite, S19, grille des risques, limites). Limite dite :
le banc de crash-tests de page (`test:pages`) n'a pas pu tourner dans la
session de rédaction (registre npm inaccessible) — à lancer sur la machine
de l'Auteur après application du patch.

---

## #132 — L'adaptation légère des états est portée au moteur
*2026-08-30 · Statut : 🟢 exécution d'une décision déjà prise · Révise l'exécution de `#130` (la décision elle-même a été révisée sur pièce le 30 août, COLOR-UX 2.8.0)*

**Contexte** — Le 27 août, `#130` faisait suivre aux états la moitié du
déplacement de la marque, plafonnée à 30°. Le 30 août, l'atelier interactif
a montré qu'à ce régime les couleurs système ne jouent plus leur rôle (sur
un rouge pur, l'avertissement passait la frontière jaune-vert, le succès
virait turquoise) : l'Auteur a révisé — l'adaptation est **légère, pas
plus** : un quart du déplacement, plafonné à 12°, dans l'esprit des gris
teintés. La révision était inscrite au corpus (2.8.0) mais pas encore
portée au moteur.

**Décision** — Les deux constantes du moteur reviennent à un quart / 12°.
La correction d'arc de `#130` (les marques chaudes tournaient du mauvais
côté) reste acquise. Le crash-test rejoue les mêmes marques aux nouvelles
attentes ; les jetons de la charte régénérés sont inchangés au bit près (le
déplacement y est nul).

**Sens produit / UX** — L'adaptation rend la famille cohérente, elle ne
déplace jamais le vocabulaire : un avertissement vert n'avertit plus.

**Conséquences** — deux constantes et trois commentaires dans
`kit/derivation.mjs` ; les attentes d'une épreuve dans
`kit/derivation.test.mjs` (25/25) ; jetons identiques ; C3 porte déjà la
note d'exécution au corpus.

---

## #131 — L'accent est un choix d'auteur, et l'anneau de focus passe à primary
*2026-08-30 · Statut : 🟢 décidé sur pièce · Révise : le métier de l'accent (#110 n'est pas rouvert) · Exécute C18 (2026-08-26) · Thread « la recette de l'accent »*

**Contexte** — Trois recettes calculées ont été essayées pour l'accent :
l'écart de charte (−55°), la complémentaire repoussée (retirée le jour
même, COLOR-UX 2.7.0 → 2.8.0), puis quatre familles rendues sur planche
(écarts fixes, voisin adaptatif, port d'attache, ton sur ton). Devant la
planche, l'Auteur tranche la question de fond : une grande agence ne
calcule pas une palette, elle la choisit — un générateur comme Coolors
propose et vérifie, il ne décide jamais.

**Décision** — L'accent est un CHOIX D'AUTEUR, pas une dérivation. La
valeur choisie entre souveraine : jamais calée, jamais recalée, la même
dans les deux thèmes. L'accent de la charte est **#75E242**, choisi à la
main. Doctrine dite par l'Auteur : « marketing contre fonctionnel » — la
voix graphique (illustrations, animations complexes, blocs marketing,
graphiques, liste fermée de COLOR-UX 2.6.0) et les couleurs système ne
vivent jamais au même endroit, donc **pas de garde de distance** entre
l'accent et un ton sémantique (le vert choisi est à 12° du succès, vu sur
pièce, assumé). Sans choix d'auteur — theming par primary seule — le
moteur replie sur l'écart de charte (−55°), calé 3:1, garde achromatique.

**Conséquence obligée, exécutée dans le même geste** — l'anneau de focus
utilisait encore `--accent` dans le code : avec le vert d'auteur (1,7:1
sur blanc), tous les anneaux devenaient illisibles. C18 (décidée le
26 août, jamais exécutée) entre donc au code : nouveau jeton
**`focus-ring`** — primary, calé 3:1 sur bg et surface, par thème — et
les huit règles de focus du site basculent dessus. Le focus est
fonctionnel : il reste sous contrat ; l'accent n'y touche plus.

**Sens produit / UX** — Le moteur calcule ce qui est fonctionnel et
garde ce qui est d'auteur : il vérifie, il ne choisit pas. L'accent sort
des paires déclarées (il n'est plus un contrat, c'est une signature) ;
le focus-ring y entre à sa place. Ce que ça coûte est dit : un graphique
en accent sur fond clair peut descendre sous 3:1 — territoire marketing,
la faute ne sera plus corrigée en silence ni comptée comme fonctionnelle.

**Alternatives écartées** — les quatre familles de recettes (planche du
30 août) ; caler le vert d'auteur (le calage le fonçait nettement : la
valeur cessait d'être le choix) ; garder la garde des 30° (contredite
par la doctrine des territoires).

**Conséquences** — moteur : `ACCENT_AUTEUR`, `derive(primaire, accent)`,
repli conservé, jeton `focus-ring`, paires accent → focus-ring ; jetons
régénérés (seules lignes changées : accent, focus-ring) ; huit règles de
focus dans deux feuilles ; page Couleur : deux paires renommées, le texte
de C4 et un mot de C14 ; crash-test moteur : 25/25 avec l'épreuve neuve.
Corpus : COLOR-UX passe en 2.9.0 (C4 soldée, exception dite au test des
30° de C17). Pièces : `claude/livrables/planche-familles-accent.html`,
`claude/livrables/verdict-accent-75E242.html`.

---

## #130 — Les états suivent la marque de moitié, plafonné à 30° — et l'arc du moteur tournait du mauvais côté
*2026-08-27 · Statut : 🟢 décidé sur pièce · Révise : `#110` (un seul de ses seuils) · Thread « les états et la marque »*

**Contexte** — Sur la page Couleur, l'Auteur observe que les couleurs
d'état (danger, succès, avertissement, info) ne changent quasiment pas
quand la primaire change. C'est exact et c'était voulu : chaque état garde
sa teinte de charte, tirée d'un quart du déplacement de la marque,
plafonné à 12° — un des seuils verrouillés le 24 août (`#110`). Rouvert
sur pièce : une page statique (lisible sur mobile, aucun script) a rendu
le même petit écran d'états sous six marques (indigo de la charte, orange
vif, vert Spotify, rose pastel, marine, noir) et quatre réglages, dans les
deux thèmes — A tel quel ; B la teinte suit la moitié du déplacement,
plafond 30° ; C la vivacité des états suit celle de la marque ; D les
deux. Vingt-quatre familles, 1 248 paires, toutes au seuil.

**Décision** — **B.** Les états suivent la moitié du déplacement de la
marque, plafonnée à 30°. Leur vivacité ne suit pas : « C et D trop
terne » (Auteur). La règle « la marque n'est jamais un état » ne bouge
pas ; seule sa note d'exécution change (quart / 12° → moitié / 30°).

**Sens produit / UX** — Un rouge reste un rouge, mais il appartient
désormais nettement à la famille de la marque : un système qui se
rebrande ne garde pas quatre couleurs d'état étrangères à tout le reste.
Le prix est dit : sur une marque chaude ou pastel, à 30° le danger tire
vers le brun-orange, l'avertissement vers le citron, l'info vers le
violet — ce sont les icônes et les phrases (le canal redondant, C6) qui
portent le sens là où la couleur seule hésite. À la charte, rien ne
change : le déplacement y est nul, `tokens.css` régénéré est identique au
bit près.

**Trouvé au passage, corrigé** — l'arc le plus court entre la teinte de
la charte et celle de la marque était mal replié : en JavaScript le reste
d'un nombre négatif reste négatif, et pour toute marque de teinte
inférieure à 97° (rouges, oranges, jaunes) le moteur rendait −229° au
lieu de +131°. Le déplacement des états partait du mauvais côté — sur un
orange, le rouge du danger tirait vers le rose au lieu de l'orange. Ce
n'était pas un réglage, c'était une faute ; elle est corrigée avec la
décision, et le crash-test du moteur la rejoue (orange +30, Spotify −30,
rose +30, marine −5,7, charte et noir 0).

**Alternatives écartées** — tel quel (A : « ça ne change quasiment
pas ») ; la vivacité suivant la marque (C, D : ternes — sur une marque
pastel ou noire, le rouge se lit moins vite comme une erreur) ; un
plafond intermédiaire (20°), non rendu — l'Auteur a tranché sur B.

**Conséquences** — `kit/derivation.mjs` : deux constantes exportées
(`PART_ETATS` 0,5, `PLAFOND_ETATS` 30), l'arc corrigé, l'en-tête mis à
jour ; `kit/derivation.test.mjs` : une épreuve de plus (24) ;
`kit/epreuves/couleur.test.mjs` : la borne « un rouge reste un rouge »
lit le plafond du moteur (plus un degré d'arrondi) ; `couleur/vue.tsx` :
un commentaire. Jetons régénérés, identiques. Pièce :
`claude/livrables/test-etats-marque.html` ; note :
`claude/test-etats-marque-2026-08-27.md`. Carte : le moteur de couleur
reste 🟢, un seuil de `#110` amendé.

---

## #129 — La page Arrondis est verrouillée : neuf épreuves, un coin ne se choisit pas
*2026-08-26 · Statut : 🟢 verrouillé par crash-test de page · Thread « Les quatre pages passent au vert » · Suite de #128*

**Contexte** — La page Arrondis était jugée sur pièce depuis le 26 août ;
il lui manquait son crash-test. Sa terre, c'est le coin et la racine dont
tout descend : la fiche d'arrêt de Navette (situation), le labo du coin
(variation), la liste fermée de la pilule (vocabulaire).

**Décision** — Neuf épreuves, mesurées par le navigateur. La légende de
la fiche suit la racine du curseur chiffre par chiffre, aux quatre racines
(charte 16, 0, 24, borne 38) ; panneau, carte, ligne, marque et boutons
rendent coin ÷ 2 par profondeur, la marge et l'espace de profondeur, la
cible au doigt ; les deux invariants sont mesurés sur le rendu — aucun
enfant plus rond que son parent, aucune marge sous son coin, la marge du
panneau relevée à 38. Le labo dessine ce qu'il dit (rayons lus dans le
dessin) et sa légende dit √2 ; la pilule compte quatre membres au rayon
plein, ses deux recalés déclarés, la gélule passe à la ligne ; la table
du répertoire dit chaque intention et ses vignettes portent son coin. À
racine 0 tout est carré, bouton compris. Les coins ne bougent ni avec
l'écran ni avec la densité — la fiche vit sur la charte, la scène suit la
base. C17 dans les deux thèmes, rien en dur, zéro débord.

**Ce que l'épreuve a attrapé** — l'interrupteur de la pilule ne prenait
pas la voix du kit : un bouton nu, à la taille du navigateur (13,3 px).
Il hérite désormais (`font: inherit`). Six couleurs et ombres du décor
de scène (piste et bouton des curseurs, relief de l'interrupteur et de
l'onglet) n'étaient pas dites sur leur ligne : elles le sont — dites,
pas changées. La fiche Navette reste peinte de ses propres gris : le
bloc les déclare « décor de scène, hors chaîne ».

**Alternatives écartées** — peindre Navette avec les jetons du kit (elle
passerait en sombre avec le site : ce n'est pas un écran du kit, c'est
un objet posé sur une scène) ; ignorer les couleurs du décor (la règle
dit « hors des lignes qui le disent », pas « hors des couleurs »).

**Conséquences** — `kit/epreuves/arrondis.test.mjs` ; `arrondis.css`
(sept lignes). Carte : `/arrondis` 🟢.

---

## #128 — La page Couleur est verrouillée : huit épreuves, chaque rapport mesuré sur le rendu
*2026-08-26 · Statut : 🟢 verrouillé par crash-test de page · Thread « Les quatre pages passent au vert » · Suite de #127*

**Contexte** — La page Couleur promettait « chaque rapport de contraste
mesuré sur la page que vous lisez ». Le crash-test devait le tenir pour
vrai contre le moteur, dans les deux thèmes, et sous une autre marque.

**Décision** — Huit épreuves. Les codes de la mosaïque et ses
proportions, les trente valeurs de la table des rôles, les fiches du
nuancier, les trois rapports de chaque panneau, les vingt-trois paires de
la table complète, le mini-écran et les gris à luminance constante : tous
recalculés par le moteur, comparés au caractère près, et chaque paire
tient son seuil sur le rendu, en clair et en sombre. Chaque tuile,
languette, barre de gamme (et les rôles posés sur leur cran), l'alerte et
les deux panneaux sont peints par la valeur dérivée ; le voile du bento
dit un pourcentage calculé et tient 4,5. Une marque entre par le rail
(Spotify, Netflix, Slack) : la variable, la mosaïque, la scène, la gamme
et les sémantiques suivent ; un rouge reste un rouge (moins de 30° de
teinte) ; les vingt-huit paires déclarées tiennent sur le rendu ; puis
retour à la charte. Les quatre casses se déclarent, mentent comme prévu
et se réparent. C17, tailles, marges, coins, zéro débord.

**Ce que l'épreuve a attrapé** — deux fautes. La démo « le survol est un
jeton » mentait : le survol gris des boutons d'outil pesait plus lourd
que la règle de la démo, et le bouton plein grisait au survol au lieu de
prendre `primary-hover` ; les deux règles de la démo pèsent désormais
autant et disent leur fond. Et la marque d'essai du moteur était écrite
à la main (`#4F46E5`) au lieu d'être lue dans le moteur (`PRIMAIRE_DEFAUT`)
— la seule valeur recopiée de la page.

**Alternatives écartées** — mesurer les rapports depuis la table du
moteur seule (c'est le rendu qu'on juge, pas la table).

**Conséquences** — `kit/epreuves/couleur.test.mjs` ; `globals.css`
(démo du survol) ; `couleur/vue.tsx` (deux lignes). Carte : `/couleur` 🟢.

---

## #127 — La page Typo est verrouillée : douze épreuves, aucune correction
*2026-08-26 · Statut : 🟢 verrouillé par crash-test de page · Thread « Les quatre pages passent au vert » · Suite de #126*

**Contexte** — La page Typo, jugée sur pièce, devait prouver ses huit
crans, ses deux voix et sa mesure sans l'œil.

**Décision** — Douze épreuves. Les huit fiches de l'échelle et sa légende
disent les bornes, le rapport et le glissement du moteur ; les huit rangs
rendus valent leur cran aux trois largeurs, les six crans de texte
descendent toujours, l'échelle entière à l'écran large — à 320 la section
du site vaut h1, sous l'affiche : conséquence de la pente déclarée en
#123, acceptée et dite. Geist et JetBrains Mono sont réellement chargées,
et chaque fonte déclarée a son fichier au dépôt sous son nom (T11). La
mesure : 28 ch, la mesure du registre, sans borne — et le compteur
recompté sur la ligne rendue. La gazette : fer à gauche, corps 16,
interligne 1,6, capitales espacées par le style ; l'arbre décale d'une
marge de carte ; le champ est au corps. Les huit casses se déclarent et
se réparent ; « vw seul » ne gagne pas un pixel au zoom ×2. La densité
ne touche jamais un corps ; les titres glissent ; C17 ; rien en dur,
tailles de texte comprises.

**Ce que l'épreuve a attrapé** — rien sur la page. Le banc a gagné une
règle : une taille en em (l'unité sous un chiffre) est une proportion
typographique, pas un cran — ce que le vérificateur du site admettait
déjà.

**Conséquences** — `kit/epreuves/typo.test.mjs`. Carte : `/typo` 🟢.

---

## #126 — La page Rythme est verrouillée : quinze épreuves, deux fautes attrapées
*2026-08-26 · Statut : 🟢 verrouillé par crash-test de page · Thread « Les quatre pages passent au vert » · Suite de #125*

**Contexte** — La page Rythme était jugée sur pièce le 26 août. Le
crash-test devait rendre ce jugement mécanique : chaque chiffre affiché
calculé, chaque preuve rendue par son jeton, la densité qui recalcule,
les titres qui glissent, C17, rien en dur.

**Décision** — Quinze épreuves. Les chiffres du laboratoire (six
intentions, onze nombres et les barres), du vocabulaire, des axes, des
douze réponses du bon cran et de la table de correspondance sont ceux du
moteur. Trente-trois mesures sélecteur → propriété → jeton sur la
tranche Coursue, la profondeur, la proximité, la densité et le
vocabulaire, aux trois largeurs ; les casses rendent le jeton menteur,
déclarées, et la ligne cassée fait deux fois le coin de sa carte. Par le
vrai tiroir, la densité change la tranche, le silence (64 · 96 · 128) et
la carte du milieu, jamais les coins ni les colonnes. L'affiche et les
sections valent la règle déclarée et grandissent strictement.

**Ce que l'épreuve a attrapé** — deux fautes. La table des axes écrivait
« × 1,2 » pour une borne de 1,16 : le formateur des pixels (une
décimale) mangeait la seconde ; les facteurs ont le leur. Et à 320 px la
page débordait de 55 pixels : la tranche Coursue élargissait la colonne
du gabarit. L'épreuve « zéro débord » (règle 15) est ajoutée au banc ;
la colonne et la figure du gabarit commun ne s'élargissent plus au-delà
de la page, et les trois cellules de la tranche s'empilent sur téléphone.

**Alternatives écartées** — laisser la scène défiler dans sa colonne (un
écran de 320 qui défile de côté est un écran cassé).

**Conséquences** — `kit/epreuves/rythme.test.mjs` ; `rythme/vue.tsx`,
`rythme.css`, `globals.css` (deux lignes du gabarit, pour les quatre
pages). Carte : `/rythme` 🟢.

---

## #125 — Le banc des crash-tests de page : le navigateur mesure, le moteur prédit
*2026-08-26 · Statut : 🟢 écrit, éprouvé sur les quatre pages · Thread « Les quatre pages passent au vert » · Ouvre les verrous #126 à #129*

**Contexte** — Les pages Rythme, Typo, Couleur et Arrondis tournaient sur
la chaîne (#124) et restaient 🟡 : le vérificateur du moteur lit les
feuilles, il ne voit pas la page rendue. « Chaque chiffre calculé »,
« la densité qui recalcule sous les yeux », « les titres qui glissent »
ne se prouvent qu'avec un moteur de mise en page.

**Décision** — Un banc, `kit/epreuves/banc.mjs`, sur Playwright et
Chromium : le site construit dans un dossier à part (`KIT_DIST`, pour ne
pas corrompre le `.next` du serveur de travail), servi sur un port libre,
ouvert à 320, 768 et 1440, dans les trois densités et les deux thèmes ;
on lit ce que le navigateur a calculé et on compare au dixième de pixel
à ce que le moteur prédit — la droite du `clamp()`, pas la courbe
adoucie de la pièce. Six épreuves communes à toute page : les chiffres
affichés, les preuves par leur jeton, la densité, les titres, C17, rien
en dur (marges, espaces, coins, tailles ; exceptions : les lignes qui
disent « hors chaîne » ou « casse », les casses `data-intent`, les
proportions en em). Lancer : `npm run test:pages`. `npm test` reste le
crash-test du moteur, sans navigateur.

**Sens produit / UX** — Le verrou d'une page n'est plus un verdict d'œil
consigné, c'est une mesure qu'on rejoue. Et le banc attrape ce que l'œil
laisse passer : un débord de 55 pixels, un survol qui ment, une décimale
mangée.

**Alternatives écartées** — rendre les pages côté serveur et lire le
HTML (aucune mise en page : ni densité, ni glissement) ; un navigateur
sans tête sans Playwright (plus de plomberie, pas plus de preuve).

**Conséquences** — `playwright` en dépendance de développement,
`next.config.mjs` (`distDir`), `kit/.gitignore`, `test:pages` dans
`package.json`, `kit/epreuves/capturer.mjs` (les témoins). Note :
`claude/crash-tests-pages-2026-08-26.md`.

---

## #124 — Les quatre pages passent sur la chaîne, et le site se vérifie lui-même
*2026-08-25 · Statut : 🟢 fait, construit, éprouvé, jugé sur pièce le 26 (« je commence à réellement adorer notre travail ») · Thread « Le kit passe sur la chaîne », étape 5*

**Contexte** — Un inventaire ligne à ligne a montré ce que le pont provisoire
cachait : environ 460 emplois d'anciens jetons, dont une centaine rabattus sur
le mauvais rôle (des coques en coin de carte, des marges de coque employées en
gouttière, des espaces fabriqués par multiplicateur, des jetons d'espace posés
en hauteur, des tailles de texte et des rayons en dur par dizaines), et des
pages qui contredisaient les décisions sous les yeux du lecteur : « 12 entre,
24 autour », la densité « décalée d'un cran », les six rôles d'espace, « bouton
6, fixe », « cinq échelons » avec les anciennes tailles.

**Décision** — L'Auteur délègue (« je te laisse gérer »). Trois arbitrages
d'architecte, dits avant d'agir : la chaîne est continuée d'un cran vers le bas
(6) pour ce qui vit dans une ligne ; toutes les étiquettes remontent au cran du
petit texte (12,8) ; les commandes secondaires prennent une cible dérivée, la
cible ÷ √2 (31). Puis : globals.css et les quatre pages passent sur les jetons
dérivés avec le bon nom, les tables et préréglages sont lus dans le moteur (une
seule table d'intentions, « Ludique » ramenée à la borne 38), les contenus sont
réécrits sur les huit décisions sans changer le plan de preuves validé, le pont
est retiré. Le crash-test vérifie désormais le site lui-même : aucun ancien
nom, aucun jeton orphelin, aucun nombre posé pour un espace, une taille ou un
rayon hors des lignes qui le déclarent (« hors chaîne », « casse ») et des deux
blocs de dette.

**Sens produit / UX** — « Pas de nombre » s'applique au site comme aux démos,
et c'est une épreuve, plus une consigne. La page Rythme dit enfin ce que le
moteur fait : le bon cran est calculé, la densité change la base sous les
yeux, le vocabulaire est marge et espace par profondeur et par axe.

**Alternatives écartées** — garder le pont (deux registres sous un seul nom) ;
migrer sans toucher aux contenus (des pages qui montrent des lois qu'elles ne
suivent pas).

**Retours d'Auteur du même soir, sur le site construit** — les étiquettes mono
remontées à 12,8 ne tenaient plus leur interlettre : elles prennent leur propre
cran, un cran et demi sous le corps (`--font-size-label`, 11,5 → 12,3) ; les
colonnes du gabarit (rail, gouttière, marge de page) suivaient la densité et
resserraient la page en aéré : elles descendent de la chaîne à la base de la
charte et n'en bougent plus — la densité règle le contenu, jamais les
colonnes. Et une encre de plus : `text-tertiary`, le gris le plus clair qui
tienne encore 3:1 sur le fond le plus dur, pour les petits textes indicatifs
(kickers, fiches, légendes, pieds, index de menu), avec sa règle, **C17 — le
tertiaire est une intention, jamais un défaut** : jamais sur du texte lu,
jamais sous le cran étiquette, et chaque emploi dit ce qu'il est sur sa ligne
(« tertiaire : … ») ; aucun style en ligne ne le pose. Le vérificateur
l'éprouve. Pièce : `claude/livrables/test-encres.html` (les trois encres sur
six crans, deux thèmes, deux fonds, quatre graisses, six objets réels).

**Complément du 26 août, sur pièce** — idée d'Auteur : « aider le lecteur avec
une fonte légèrement plus grasse pour les éléments petits en tertiaire ». La
pièce a gagné une section (six petits objets du kit aux quatre graisses, un
témoin secondaire, deux cartes côte à côte, une case qui applique l'idée aux
pièces et au tableau). Verdict : « c'est bien mieux ». C17 gagne sa
contrepartie : **en petit, le tertiaire porte un cran de graisse de plus que le
texte qu'il accompagne** (600 au moins, 700 pour un kicker mono) — l'œil
retrouve en épaisseur ce que l'encre a cédé en contraste, sans rapprocher le
tertiaire du secondaire ; c'est le principe même de la norme, qui admet un
contraste moindre dès que le texte est gras. Appliqué : les fiches de la page
Typo (500 → 600), le kicker dit sa graisse (700), et l'index du menu, qui était
un secondaire à demi effacé par une opacité — un tertiaire par défaut, la
négligence que C17 interdit —, devient un vrai tertiaire à 600. Le vérificateur
éprouve aussi la graisse : tout bloc CSS qui pose le tertiaire doit porter 600
ou 700, sinon le test échoue (éprouvé en le cassant exprès). L'exception du
tableau reste à éprouver.

**Conséquences** — `kit/app/globals.css` (1236 → 1062 lignes), `kit/app/rythme/`
(vue, rythme.css), `kit/app/typo/` (vue, typo.css), `kit/app/couleur/vue.tsx`,
`kit/app/arrondis/` (vue, arrondis.css), `densite.tsx`, `apercu.tsx`,
`adaptation.tsx`, `primaire.tsx`, `theme.tsx`, `composition/vue.tsx` (rabattement
mécanique seul). Dettes dites : Accueil et Composition hors chaîne, neuf seuils
de mise en page. Note : `claude/chaine-etape-5-pages-2026-08-25.md`.

---

## #123 — Le gabarit documentaire descend de la chaîne
*2026-08-25 · Statut : 🟢 décidé sur pièce · Rouvre et referme le gabarit du 24 août (`#107`, `#108`) · Thread « Le kit passe sur la chaîne », étape 4*

**Contexte** — La décision 8 disait que les jetons du gabarit documentaire ne
resteraient pas des valeurs à part, et que deux crans manquaient à la chaîne :
le silence entre sections et les grandes marges de page. Une planche a rendu la
vraie page Rythme, construite, avec ses huit crans dérivés : six par la loi
(scène = marge de coque, tête et gouttière = 2ᵉ cran de page, marge de page =
le bord sur mobile et le 3ᵉ cran au bureau, rail = 6ᵉ cran), deux à l'œil — le
silence (4ᵉ ou 5ᵉ cran, chacun en compact · standard · aéré, parce que la
densité change la base et que les crans de page la suivent) et les titres du
site (un, un et demi, ou deux crans au-dessus de l'affiche).

**Décision** — Le silence entre sections est le quatrième cran de page (96 ;
compact 64, aéré 128). Les titres du site sont à un cran et demi au-dessus de
l'affiche (55 → 58 et 44 → 47) : le demi-cran est √1,25, la même idée que √2
pour les marges — dérivé, jamais posé. Chaque `--doc-*` est un alias d'un jeton
de la chaîne ; la marge de page change de cran avec le régime ; la scène prend
sa marge sur ses deux axes.

**Sens produit / UX** — Le site du kit devient sa propre preuve : ses silences
et ses affiches sont la même musique que les cartes qu'il montre, et la densité
règle la page comme elle règle les démos. Le prix est dit : la chaîne glisse
moins que le gabarit d'hier (0,90–1,16 au lieu du simple au double), l'affiche
ne dépasse plus 58, la marge de page sur mobile est le bord de la coque.

**Réserve consignée** — l'Auteur a demandé le cran et demi lui-même
(« c'est possible d'essayer 1,5 ? ») : un demi-cran est admis dans l'échelle
des titres dès lors qu'il est la racine de l'intervalle.

**Amendement, le soir même, sur le site construit** — « j'ai mal compris une
décision, il faut que ça glisse comme sur le fichier nu ». Sur la chaîne, un
titre ne glisse que de ×1,07 avec l'écran ; les titres du gabarit nu du
24 août glissaient du simple au double. Décision : les titres du site gardent
des bornes dérivées de la chaîne — l'affiche du cran des sections (4,5) à
sept crans au-dessus du corps (44 → 82), la section du cran h1 au cran des
sections (31 → 47) — et prennent une pente à eux, celle du gabarit nu
(6 % et 3,4 % de la largeur de l'écran), déclarée comme intention d'auteur
dans le moteur. Une règle rompue, dite, la même pour les deux titres.
L'affiche garde sa graisse (500) ; sections et intertitres descendent d'un
cran de graisse (400, 500) — retour d'Auteur du même soir.

**Alternatives écartées** — 5ᵉ cran (136 : plus proche d'hier, mais l'œil a
tranché) ; un ou deux crans pour les titres.

**Conséquences** — `HORS_CHAINE.titresSite`, `REGISTRE.doc` et `docBureau`
dans le moteur ; `--font-size-cover` et `--font-size-section` ; seuls les crans
de page consommés sont émis. Dette dite : le site porte plusieurs seuils de mise
en page là où la décision 7 en veut un seul. Note :
`claude/chaine-etape-4-gabarit-2026-08-25.md`.

---

## #122 — La racine est 16, et le moteur du kit porte la chaîne
*2026-08-25 · Statut : 🟢 décidé sur pièce (racine), 🟢 moteur écrit, éprouvé et commité le 26 · Thread « Le kit passe sur la chaîne », étapes 1 à 3*

**Contexte** — La décision 8 avait consigné une réserve : sur la tranche
Coursue, l'Auteur préférait « avant » (coins 12 · 8 · 4) à la chaîne à racine 24,
et l'architecte lisait dans cet écart deux réglages d'entrée, pas les lois.
Une planche a rendu la tranche et le tableau de bord entier de Navette quatre
fois — avant, puis la chaîne à racine 16, 20 et 24, base 24 et √2 inchangés —
avec un mode à l'aveugle (écrans mélangés sans nom, on clique, la page révèle).

**Décision** — Racine 16 à la charte (« 20 et 24 sont très bien aussi »).
Coins 16 · 8 · 4 · 2, bouton 4 ; marges 24 · 17 · 12, espaces 17 · 12. Le
moteur `kit/derivation.mjs` gagne la chaîne du rythme à côté de la couleur :
quatre décisions d'entrée, huit lois, tout le registre en sort — marges et
espaces par profondeur sur deux axes, coins, bouton, texte borné, cible,
densités par changement de base, et la chaîne continuée vers le haut pour les
crans de page et vers le bas d'un cran (6, la base ÷ 4) pour ce qui vit dans
une ligne. `tokens.css` devient un fichier écrit de bout en bout par le moteur
(`npm run tokens`) ; Tailwind est régénéré ; Figma naît en JSON, gelé à 768
avec ses bornes en description.

**Sens produit / UX** — Le verdict a été pris à l'œil, à l'aveugle, sur un vrai
écran : la méthode des décisions 1 et 4 poussée d'un cran. Et le kit cesse
d'avoir deux systèmes dans un fichier : un seul moteur, un seul registre.

**Méthode** — Le crash-test `kit/derivation.test.mjs` rejoue chaque page de
décision avec ses propres réglages et compare au dixième de pixel ; il vérifie
aussi que la couleur n'a pas bougé d'un bit et que les jetons de la coque
valent ceux d'avant au dix-millième.

**Alternatives écartées** — racine 24 (la charte de la veille : trop ronde à
l'œil sur l'échantillon) ; garder deux registres.

**Conséquences** — `kit/derivation.mjs`, `kit/derivation.test.mjs`,
`kit/tokens.ecrire.mjs`, `kit/app/tokens.css`, `kit/tokens.tailwind.mjs`,
`kit/tokens.figma.json`. Pièce : `claude/livrables/planche-racines.html`.
Notes : `claude/chaine-etape-2-moteur-2026-08-25.md`,
`claude/chaine-etape-3-sorties-2026-08-25.md`.

---

---

## #121 — Décision 8 : le kit entier, site compris, tourne sur le moteur
*2026-08-25 · Statut : 🟢 décidé sur pièce · Clôt la série des huit décisions · Rouvre le gabarit du 24 août*

**Contexte** — Les pages du kit (Rythme, Typo, Couleur) tournaient sur
l'échelle fixe DESIGN.md 1.31.0 tandis que le moteur, prouvé conforme à la
pièce d'Auteur, vivait dans le même fichier sans être lu ; le gabarit
documentaire avait ses jetons à part. Une page a rendu la tranche Coursue sur
les deux registres et la table des jetons ligne par ligne, décision par
décision.

**Décision** — Un seul registre, dérivé des trois décisions d'entrée et des
sept lois, pour tout le kit — démos et site compris. Les jetons du gabarit
documentaire descendent de la chaîne ; les crans de page (silence entre
sections, grandes marges) sont la chaîne continuée au-dessus de la coque, à
produire puis à juger.

**Sens produit / UX** — « Un design system qui n'adopte pas ses propres outils
n'a pas d'intérêt » (Auteur). Le site du kit devient sa propre preuve. Le prix
est dit : le gabarit verrouillé la veille est à refaire, et deux crans manquent
à la chaîne.

**Réserve consignée** — sur l'échantillon, l'Auteur préfère « avant » de visu.
Lecture : la racine et la base, pas les lois. Une planche « avant contre trois
racines » précède toute régénération ; si aucune ne convainc, la chaîne sera
rediscutée, par écrit.

**Alternatives écartées** — deux régimes (site à part, démos sur le moteur) ;
ne rien brancher.

**Conséquences** — moteur : registre complet ; tokens.css, Tailwind, Figma
régénérés ; DESIGN.md réduit aux entrées et aux valeurs hors chaîne ; gabarit
documentaire reconstruit sur pièce ; vérificateur : `--doc-*` non dérivé =
faute. Pièce : `claude/livrables/decision-8-registre.html`.

---

---

## #120 — Décision 7 : un régime est une mise en page, le rythme n'en a pas — provisoire
*2026-08-25 · Statut : 🟢 décidé sur pièce, provisoire déclaré · Confirme Y7 · Suite des décisions 1 à 6*

**Contexte** — Y7 (deux régimes, un seuil) semblait contredire la pièce
d'Auteur (rythme continu, quatre largeurs nommées, gel à 768 repris par
l'export Figma). Une page a rendu l'écran de 1440 à 320 avec deux jauges (la
mise en page fait un pas, le rythme une pente), puis l'écran vivant contre
l'écran figé à 768 à trois largeurs.

**Décision** — Un régime est une mise en page : deux régimes, un seuil en em
(Y7). Le rythme n'a pas de régime : il glisse sans palier (la pièce, Y8
renversée). Les quatre largeurs nommées sont des repères ; 768 est une valeur
de gel pour Figma, pas un régime. Décision provisoire : un troisième régime
naîtra d'un besoin réel journalisé, comme Y7 le prévoit.

**Sens produit / UX** — Les deux règles ne parlaient pas de la même chose ; les
faire cohabiter ne renverse rien et n'enferme rien. Le gel à 768 est un prix
connu de Figma, dit avec ses bornes, pas une vérité du produit.

**Alternatives écartées** — trois régimes dont une tablette (Y7 renversée pour
une mise en page jamais dessinée) ; aucun régime (plus de seuil comptable, plus
de « mobile » de séance).

**Conséquences** — phrase de tête sur Y7 ; « figer le rythme » rangé en outil
d'export ; l'axe radius de la pièce à retirer (conséquence de la décision 2, à
confirmer) ; le seuil de mise en page à poser au registre. Pièce :
`claude/livrables/decision-7-regimes.html`.

---

## #119 — Décision 6 : la cible au doigt vit en rem et suit l'axe « control » — Y9 amendée
*2026-08-25 · Statut : 🟢 décidé sur pièce · Amende Y9 (#103) et le tactile (#099) · Suite des décisions 1 à 5*

**Contexte** — Y9 gardait la cible au doigt en pixels (« un doigt ne grandit
pas avec le texte ») ; le paquet tactile n'admettait que trois chiffres de
cible ; la pièce d'Auteur émettait la hauteur des contrôles en rem, fluide de 44
à 46,6 px selon la largeur. Une page a rendu l'écran sous un zoom de texte de
100 à 200 % (cible en px contre cible en rem) et deux rangées de boutons de 320
à 1440 (44 fixe contre 44 × axe).

**Décision** — La cible est en rem et suit l'axe « control » (2,75 rem × 1,00 →
1,06). Elle grandit avec le texte du lecteur et, un peu, avec la largeur.

**Sens produit / UX** — Le texte d'un bouton grandit quand le lecteur grossit
son texte ; une cible fixe le coupe. La cible suit son texte. L'axe garde la
même logique que les marges et le corps. Le prix est dit : Y9 perd une
exception, le tactile compte des crans à bornes et non plus des chiffres, et le
plancher WCAG de 24 px reste la seule valeur en pixels.

**Alternatives écartées** — 44 px fixes (Y9 telle quelle ; le texte se coupe
à 200 %) ; rem sans axe (proposé par l'architecte ; la cohérence d'axe l'a
emporté).

**Conséquences** — Y9 : deux exceptions au lieu de trois ; tactile T1/T4/T5 à
réécrire en crans à bornes, plancher 24 px en borne absolue ; kit et pièce :
rien à changer. Pièce : `claude/livrables/decision-6-cible.html`.

---

## #118 — Décision 5 : le corps est borné à 16, les titres descendent de l'intervalle
*2026-08-25 · Statut : 🟢 décidé sur pièce · Suite des décisions 1 à 4 · confirme T10, remplace l'échelle du 23 août*

**Contexte** — L'axe « type » de la pièce d'Auteur faisait descendre le corps à
15,4 px à 320 px, sous le plancher de T10 (votée 11/11 le 23 août) ; le kit
portait ce jeton à côté de son propre corps à 16. La pièce ne connaissait que
deux titres, sa démo « Page » en fabriquait cinq autres par multiplicateurs ;
le kit avait cinq crans arbitrés à la main, sans rapport avec l'intervalle.
Une page a rendu l'écran de 320 à 1440 avec l'axe libre et l'axe borné, puis
un article composé trois fois.

**Décision** — Le corps = max(16, 16 × axe). Cinq crans de titres et un cran de
légende, chacun = le précédent × l'intervalle des titres (1,25) : 12,8 · 16 ·
20 · 25 · 31 · 39 à 320 px, montant avec l'axe. Le régime documentaire du site
garde ses affiches à part.

**Sens produit / UX** — Le plancher est une contrainte de plateforme, pas un
goût. Un seul chiffre règle tous les titres comme un seul règle toutes les
marges : la pièce et le kit parlent la même musique. Le prix : l'affiche
produit est plus petite que celle d'hier, et les jetons du 23 août sont à
régénérer.

**Alternatives écartées** — renverser T10 ; garder les deux titres de la pièce
(insuffisant, prouvé par sa propre démo) ; garder l'échelle du kit telle quelle
(une seconde musique).

**Conséquences** — pièce : axe borné, six crans en sortie, démo « Page » à
refaire ; kit : tokens.css, Tailwind, Figma, page /typo ; T10 : faute
détectable sur la borne basse d'un jeton de corps ; registre : périmètre du
cran « légende ». Pièce : `claude/livrables/decision-5-texte.html`.

---

## #117 — Décision 4 : la densité change la base, coins fixes — Y5 renversée à l'œil
*2026-08-25 · Statut : 🟢 décidé sur pièce · Renverse Y5 (#103) · Suite des décisions 1 à 3*

**Contexte** — Trois réponses à « qu'est-ce que serrer un écran » : la théorie
(multiplier tout, coins compris), Y5 votée le 23 août (décaler d'un cran, jamais
un multiplicateur), la page /rythme (− 8 sur l'échelle fixe), la pièce d'Auteur
(changer la base). Une page a rendu le tableau de bord en trois densités avec
les deux façons de serrer et les coins fixes ou suiveurs.

**Décision** — La densité change la base (16 · 24 · 32) et la chaîne des marges
et des espaces se recalcule ; coins et composants restent fixes.

**Sens produit / UX** — À l'œil, le pas de la base fait des densités qui se
voient ; le cran se voyait moins. Le prix est dit : Y5 est renversée (un
multiplicateur, des chiffres neufs par densité — neuf pour neuf marges au lieu
de six), et l'échelle a deux rythmes, profondeur ÷ √2 et densité × 0,67. Les
coins ne suivent pas : l'aéré aurait crevé la borne 38 et les boutons auraient
changé de coin.

**Méthode** — Deuxième règle renversée à l'œil en une journée (Y8 le 23, Y5 le
25). Une règle sur papier ne vaut pas un écran rendu trois fois : à écrire dans
la méthode des séances.

**Alternatives écartées** — décaler d'un cran, coins fixes (Y5 telle quelle) ;
décaler d'un cran et coins suiveurs (la théorie).

**Conséquences** — Y5 réécrite ; #076 à refaire sur la base ; jeton de densité =
base au kit ; /rythme à refaire (décision 8) ; question ouverte : 20 (« Outil
expert ») est-il un cran de densité ou une intention. Pièce :
`claude/livrables/decision-4-densite.html`.

---

## #116 — Décision 3 : un composant prend le cran de la ligne (racine ÷ 4)
*2026-08-25 · Statut : 🟢 décidé sur pièce · Suite des décisions 1 et 2 · amende
l'arbitrage « contrôle 6 » du matin sans en changer la valeur à la charte*

**Contexte** — Tout le monde disait « un bouton garde son coin à lui », personne
ne disait le même chiffre : 12 dans la pièce d'Auteur, 6 acté le matin sur
/arrondis, 3 dans la migration du 11 août, « suit sa taille » dans la reprise
du 13. Et la couche contexte de la pièce faisait suivre au bouton la racine et
la largeur d'écran, contre sa propre règle. Une page a rendu le même écran à 6
et à 12, puis le bouton aux trois profondeurs pour trois options, racine
réglable de 0 à 38.

**Décision** — Le composant prend le cran de la ligne : racine ÷ 4, fixe à
l'écran, réglé par la racine du produit. 6 à la charte. La case à cocher garde
son exception (anguleuse).

**Sens produit / UX** — Un bouton ne peut jamais être plus rond que ce qui le
contient : la règle « aucun enfant plus rond que son parent » vaut pour tout,
sans exception à écrire. Et le bouton appartient au produit : anguleux dans un
outil brut, rond dans un produit grand public. Le prix : « hors réglage » de la
théorie devient « hors écran, hors densité, mais réglé par la racine ».

**Alternatives écartées** — 6 fixe (fautif sous racine 12, deux intentions sur
six) ; 12 fixe (fautif à la charte même, dans une ligne de 6).

**Conséquences** — pièce d'Auteur : règle 7 et couche contexte à corriger ;
kit : `--r-ctl` = `--r-3`, A10 réécrite, légende de /arrondis ajustée ;
registre : exception des cases à cocher ; vérificateur : plus de clause
d'exception pour les composants. Pièce :
`claude/livrables/decision-3-controles.html`.

---

## #115 — Décision 2 : la coque est le niveau 1 et porte la racine, bornée à 38
*2026-08-25 · Statut : 🟢 décidé sur pièce · Suite de la décision 1*

**Contexte** — La pièce d'Auteur disait deux choses : ses démos et /arrondis
posent la racine (24) sur la coque et divisent ensuite (12, 6, 3) ; le CSS
qu'elle écrit donne au niveau 1 la moitié de la racine (12) avec la marge 24,
et la racine n'y a pas de jeton. Une page a rendu le même tableau de bord avec
les deux numérotages, racine réglable de 0 à 48.

**Décision** — La coque est le niveau 1 et porte la racine ; carte ÷ 2, ligne
÷ 4, marque ÷ 8 ; jetons `--r-1` à `--r-4`. La racine est bornée à 38 px.

**Sens produit / UX** — Le nombre qu'on règle est le coin qu'on voit ; un objet,
un niveau, un jeton. L'autre numérotage était la même chaîne décalée d'un cran,
un curseur qui ment de moitié. La borne à 38 vient de l'œil : au-delà, la marge
qui suit le rayon épaissit la coque au point de changer l'écran.

**Alternatives écartées** — la racine cachée (coque = racine ÷ 2), sortie CSS
actuelle de la pièce.

**Conséquences** — CSS du générateur renuméroté et curseur borné ; préréglage
« Ludique » (44) à ramener sous la borne ; jetons du kit et de Figma en r-1 à
r-4 ; question ouverte : 38 contre la grille de 4 (36 ou 40). Pièce :
`claude/livrables/decision-2-profondeurs.html`.

---

## #114 — Décision 1 : l'espace entre deux frères vaut leur marge
*2026-08-25 · Statut : 🟢 décidé sur pièce, à l'œil · Ouvre la série des huit
décisions (claude/divergences-semanticrhythm-kit-2026-08-25.md)*

**Contexte** — La pièce d'Auteur « Semantic Rhythm » (25 août) calcule la marge
d'une carte en divisant la base par un intervalle (√2 : 17) tandis que l'espace
entre cartes vaut la moitié de la base (12). La règle Y1, votée 9/9 le 23 août,
dit l'inverse : dedans ne dépasse jamais dehors. Une première page a montré le
panneau à manipuler, les six intentions (toutes rouges) et trois issues avec
leur coût ; l'Auteur a pressenti l'octave sur les mots, puis demandé à voir le
même vrai écran en B et en C.

**Décision** — C, « sans contestation » : l'intervalle reste √2 et l'espace
entre deux frères vaut leur marge (24 · 17 · 12 ; espaces 17 · 12 ; bord 24).
Un objet a autour de lui autant d'air qu'il en a dedans. Y1 tient à l'égalité.

**Sens produit / UX** — La nuance des marges est gardée, les cartes ne se collent
plus, et la loi tient en une phrase qu'on n'explique pas deux fois. Le prix est
dit : l'espace n'est plus un seul chiffre par écran, « 12 entre, 24 autour »
tombe, et l'écran gagne un quart de hauteur.

**Méthode** — Le verdict sur les mots (B) a été renversé par le verdict à l'œil
(C). Consigné : une décision de géométrie se prend sur un vrai écran rendu deux
fois, jamais sur un tableau de chiffres.

**Alternatives écartées** — garder √2 et rogner Y1 ; l'octave (trop serré à
l'œil, marges de ligne à 6).

**Conséquences** — moteur et jetons du kit à régénérer (espace = marge de la
profondeur) ; migration du 11 août à refaire sur la colonne écart ; le
générateur d'Auteur à mettre en accord (règle 4, jetons gap/edge) ; densité :
un cran = ÷ √2 (page 4) ; /rythme reste faux jusqu'à la décision 8. Pièces :
`claude/livrables/decision-1-intervalle.html`,
`claude/livrables/decision-1-B-contre-C.html`.

---

## #113 — La couleur saisie se pose sur son cran, et la gamme 50–950 cesse de jeter la couleur
*2026-08-25 · Statut : 🟢 Verrouillé (verdict d'Auteur : « c'est parfait ! ») · Révise la gamme d'illustration de `#109` ; ne rouvre aucun des seuils de `#110`*

Un jaune vif (`#FFF76B`) entrait au panneau Theming, et sa gamme allait du
blanc cassé à l'olive : **la couleur n'y apparaissait nulle part**. Le
constat de l'Auteur était exact et plus large que le jaune — la gamme
copiait l'échelle de l'indigo de la charte et n'y posait jamais la couleur
saisie ; seul l'indigo se retrouvait dans sa propre gamme. La gamme gardait
la teinte et jetait la couleur.

**La règle.** Les onze crans sont des **marches de clarté fixes**, les mêmes
pour toutes les familles — 50 très clair, 950 très sombre, 500 au milieu.
La couleur saisie prend la marche la plus proche de sa clarté et s'y pose
**telle quelle, au code près** : le jaune sur 50, un marine sur 950, un
rouge sur 500, l'indigo de la charte sur 600 — où sa gamme ne bouge pas
d'un cheveu. Les autres crans se déduisent d'elle : ils gardent leur clarté
de marche, prennent sa teinte, et leur saturation suit la sienne — une
couleur vive fait une famille vive, une pastel une famille douce. À un bout
de l'échelle, il n'y a rien au-delà : le jaune posé sur 50 est le plus
clair de sa famille, le marine sur 950 le plus sombre. Noir et blanc y
trouvent aussi leur place, avec une famille grise.

**Ce qui ne bouge pas, et pourquoi.** Les neutres teintés sont les marches
elles-mêmes, à peine colorées à la marque : ils ne suivent pas la saisie —
c'est l'échelle stable qui rend un « 300 de marque » et un « 300 neutre »
frères. `primary` et `primary-subtle` ne changent pas de valeur : primary
était déjà la couleur saisie, elle est désormais *visible* sur son cran ;
le fond doux reste toujours nettement plus clair que l'aplat, et quand la
couleur est déjà tout en haut, il reste le voile presque blanc de `#110`.
La doctrine tient : **un rôle ne consomme jamais un cran**.

**Les rôles se lisent sur les crans.** Sous chaque gamme, au niveau du cran,
le nom du rôle qui s'y pose — en plein quand sa valeur *est* le cran (à la
charte : le fond doux sur 100, primary et le lien sur 600, le fond de code
sur 950), précédé de ≈ quand il n'en est que le voisin de clarté. La ligne
dit où un rôle vit, pas d'où il vient. Le graphisme des gammes est conservé
tel quel ; les quatre gammes de la page (marque, neutres, familles
sémantiques) et les barres d'essai du moteur suivent la même règle, et les
familles sémantiques se lisent désormais dans la palette dérivée, jamais
dans une constante.

**Preuves.** Douze couleurs d'essai (jaune vif, indigo, marine, rose pastel,
rouge, vert Spotify, ocre, violet clair, gris, noir, blanc, blanc cassé) :
la couleur saisie apparaît dans sa gamme à chaque fois, 50 reste très
clair, 950 très sombre, l'ordre des clartés est régulier ; la gamme de la
charte est identique au code près ; `tokens.css` n'a pas bougé d'un bit ;
52 paires au seuil dans les deux thèmes sur chaque couleur ; la page rendue
sur le serveur de l'Auteur, vérifiée avec le jaune posé sur 50.

**Impact carte** — Le moteur de couleur reste 🟢 ; sa gamme 50–950 porte
désormais une règle de placement, dite au §3. Pièces :
`claude/gamme-cran-accueil-2026-08-25.md` ·
`claude/livrables/planche-gamme-cran-2026-08-25.html` · `kit/derivation.mjs`
· `kit/app/couleur/vue.tsx` · `kit/app/globals.css`.

---

## #112 — La page Composition entre au kit, et la séance nomme une faute de méthode : un objet par preuve
*2026-08-24 · Statut : 🟢 Verrouillé (verdict d'Auteur : « oui c'est bon ») · Suit `#108` à `#111`, ferme la série des pages du kit*

Quatrième page passée au gabarit documentaire nu, et la seule dont le sujet
n'est pas une matière : ni des lettres, ni des distances, ni des couleurs —
**le regard**. Trois preuves, trois natures, et surtout **trois objets
différents** : une interface de travail, une page de journal et une affiche,
une page de magazine.

**L'écran qu'on casse.** Au repos, l'interface nomme ses organes — le
dominant, un groupe, l'axe de départ, l'espace blanc qui groupe : quatre
mots suffisent à parler de composition avec quelqu'un d'autre. Cinq casses
disponibles, une à la fois ; les repères se posent **sur le composant**, aux
coordonnées relevées sur le rendu — cadres, cotes chiffrées, fils d'axes,
pastilles — et **le survol répare l'écran sous les yeux**, la faute n'étant
appliquée que tant que le pointeur reste dehors. C'est la mécanique que
l'Auteur a tranchée : « B et de loin, mais avec des indications de ce qui
est faux par dessus le composant ».

**Le chemin de l'œil.** Une page de journal se balaie en F, une affiche se
parcourt en Z : deux objets que tout oppose, choisis pour ça. Le parcours
est tracé en pointillé permanent, et **un segment plein le parcourt en
boucle** — pointillé et dessin progressif se disputant la même propriété
CSS, les deux rôles ont été séparés. Le tracé est calculé en pixels réels :
un SVG étiré fausse la longueur du chemin, et le trait apparaissait par
morceaux au lieu de courir.

**L'espace blanc.** Une page de magazine, dont chaque signe encré se couvre
d'une tache mesurée : **l'encre n'occupe que 29 % de la page**, relevé sur
le rendu. Puis on retire l'espace blanc à surface constante — pas un signe
en moins, et la page cesse de se lire. Le vocabulaire dit « l'espace blanc »,
jamais « le blanc » (verdict d'Auteur).

**La faute de méthode, nommée parce qu'elle se répétera.** Trois versions
de cette page ont été rejetées avant celle-ci. La dernière l'a été sur un
motif qui vaut plus que la page : *« on se tape à nouveau le même composant.
Depuis que je t'ai branché au produit tu as perdu en spontanéité »*.
Travailler **dans** le produit pousse à patcher un fichier plutôt qu'à
composer une page — et le même écran finit par servir toutes les preuves,
ce que la formule de contenu interdit précisément. Le remède appliqué :
revenir à la **pièce HTML libre** pour concevoir, ne transférer au kit
qu'après verdict. Ce détour n'est pas un luxe, c'est la condition pour que
chaque preuve naisse de sa propre nécessité.

**Alternatives écartées** — *la planche des six* (le même écran six fois,
une seule version juste : se juge d'un regard, mais montre les fautes sans
jamais les faire vivre) ; *le test des trois secondes et le squint test*
(spectaculaires, mais il faut comprendre un protocole avant de voir quoi que
ce soit — « c'est bien trop compliqué de comprendre ce qu'on doit juger ») ;
*huit vignettes faux / juste pour les huit règles* (construites, puis
retirées : elles répétaient en petit ce que la casse montre en grand) ;
*un aplat de marque sous le composant* (essayé, retiré — il criait plus fort
que ce qu'il montrait).

**Deux dettes ouvertes, dites par l'Auteur au moment du verrou** — les
composants des démonstrations (boutons, champs) ne viennent pas du registre
du kit ; et le wording des pages demandera une passe d'affinage. Les deux
sont pour plus tard, et elles sont écrites pour ne pas se perdre.

Pièces : `kit/app/composition/vue.tsx` · `kit/app/composition/page.tsx` ·
`kit/app/globals.css` · `kit/app/rail.tsx` · `kit/app/tiroir.tsx` ·
pièce de référence `kit-composition-nu.html`.

## #111 — La porte du kit : l'accueil devient une preuve, et le moteur y est l'objet vivant
*2026-08-24 · Statut : 🟢 Verrouillé (verdict d'Auteur : « on applique au kit ») · Thread « application du gabarit documentaire nu »*

L'ancienne page d'accueil décrivait le kit en trois colonnes de
documentation générique — le défaut nommé en `#108`, à la porte. Elle est
remplacée par une page qui le **prouve**, proposée d'abord en pièce HTML
nue puis appliquée telle quelle. Titre porteur : *« Ce kit ne se décrit
pas. Il se prouve. »*

Deux terres d'emprunt, déclarées dans la page même. **La charte** lui
donne son entrée en scène : couverture pleine hauteur, monogramme Fili,
titre-affiche dévoilé ligne à ligne (les masques de la planche couverture),
point de marque sous le titre — l'apparat est réservé à la porte, les pages
de fondation gardent leur sobriété. **Le générateur Semantic Rhythm** lui
donne son objet vivant : on manipule une entrée, tout recalcule. Ici ce
n'est pas une maquette — c'est le vrai moteur (`kit/derivation.mjs`) : une
puce ou le sélecteur habillent **tout le site**, les rapports de contraste
s'affichent mesurés à l'instant, et l'ajustement d'aplat de `#110` se dit
en clair quand il a lieu.

Puis trois cartes de fondation où **chacune parle sa langue** — l'échelle
typographique en spécimen, les crans du rythme en barres, les couples de
couleur en languettes : aucune ne reprend une preuve d'une page existante,
la faute consignée sur /typo. Et un répertoire compact : la carte du
système en table sobre — sujet, état, ce qu'on y trouve — qui est l'organe
de croissance de la page. Écartés : garder le panneau de réglages permanent
(il est passé au tiroir comme ailleurs), et remplir la porte de vignettes
décoratives (des spécimens, pas des images).

Pièces : `kit/app/accueil.tsx` (nouveau) · `kit/app/page.tsx` ·
`kit/app/globals.css` · `kit/app/tiroir.tsx` (la porte reçoit les réglages)
· pièce de référence `kit-accueil-nu.html`. **Les quatre pages du kit sont
désormais sur le gabarit documentaire nu.**

## #110 — Quatre arbitrages sur le moteur de couleur, et la doctrine « l'aplat n'est jamais touché » est amendée
*2026-08-24 · Statut : 🟢 Verrouillé (décision d'Auteur : « garde ces réglages et on n'y touche plus ») · Amende la scission primary / primary-text sur un seul point : l'intangibilité de l'aplat*

Séance menée sur la page Couleur reconstruite, à coups de cas limites
lancés au sélecteur. Quatre décisions, toutes dans `kit/derivation.mjs`,
jetons régénérés, zéro faute sur les paires déclarées des deux thèmes.

**L'avertissement est jaune — exception déclarée.** Le calage brunissait
son ton clair, parce qu'un jaune ne peut pas être une encre sur son fond
doux jaune. Les deux métiers sont séparés : l'aplat prend le jaune fort que
le thème sombre portait déjà, son encre devient presque noire, et chaque
famille sémantique reçoit son encre sur fond doux — `on-…-subtle`, la
convention qui existait déjà pour la marque. Brune pour l'avertissement,
confondue avec le ton pour les trois autres. Écarté : forcer le jaune sans
séparer les métiers (le texte de la famille serait devenu illisible).

**Garde-fou achromatique.** Une marque sans teinte — noir, blanc, gris —
n'a pas d'angle de couleur, mais le calcul lui en rend un par accident, du
côté rose : les neutres « teintés à la marque » rosissaient. Le moteur
mesure désormais la **présence** de teinte et y proportionne tout ce qui
lui est emprunté, y compris le déplacement des états et l'anneau de focus.
Une marque noire dérive des gris purs.

**Encres pures quand la marge manque.** Une encre teintée n'est retenue que
si elle tient son seuil avec de la marge ; sinon elle devient franche. Une
encre de la même famille se noie dans l'aplat qu'elle doit dominer — le
brun sur l'ocre.

**Zone médiane : le blanc, toujours — et l'aplat glisse.** C'est
l'arbitrage qui amende la doctrine. Sur les couleurs de clarté moyenne,
aucune encre ne dépasse le seuil de beaucoup : la formule de contraste
préfère alors le noir là où l'œil réclame du blanc — constaté par l'Auteur
sur un violet, et confirmé par le nuancier à deux zones de Figma. Décision :
le blanc d'abord, le noir seulement quand il est **confortable** (7,4:1,
seuil relevé d'un cran sur un violet clair encore noirci) ; et quand
l'encre blanche ne tient pas, **l'aplat glisse à luminosité seule** — un
cran ou deux plus sombre, jamais changé de famille, la règle de la charte
rendue mécanique. L'ajustement est **dit** (`meta.aplatAjuste`), comme le
lien l'était déjà. La marque reste donc entière **tant qu'elle porte son
encre** — c'est la nuance qui change. Écartés : abaisser le contrat de
l'aplat à 3:1 avec une règle typographique (le texte courant sur aplat
serait devenu interdit), et déclarer la zone médiane inapte au texte (on
aurait consigné un renoncement là où une correction existe).

Sens produit : un designer pose sa couleur de marque et n'a rien à
vérifier. Ce qui ne peut pas tenir est corrigé au plus près de son
intention, et l'écart lui est annoncé au lieu d'être subi.

Pièces : `kit/derivation.mjs` · `kit/app/tokens.css` (régénéré) ·
`claude/moteur-couleur-2026-08-24.md` §6 (les seuils, verrouillés).

## #109 — La page Couleur passe au gabarit, et sa mesure se faisait une image trop tôt
*2026-08-24 · Statut : 🟢 Verrouillé · Suit `#108`, une page à la fois*

Troisième page recomposée sur le gabarit documentaire nu. Le plan de
preuves tient en trois natures : la **mosaïque de la charte** branchée sur
les jetons vivants (situation), le **tableau des départs** en thème sombre
qu'on casse pour voir la couleur porter seule (objet vivant), le **nuancier
des six rôles** (vocabulaire) — puis un répertoire compact : les
garde-fous en grille, la table complète des rôles, les gammes.

Le nuancier a cherché sa forme en trois passes, sous verdict : cartes
trouées, puis rangées pleine largeur, puis la mosaïque de la charte —
tuiles pleines sans écart, trois par rangée — et enfin **inversée** : le
fond doux fait la grande tuile avec le nom et la fiche mesurée, le ton
plein devient la bande dessous. Le neutre remonte sous la marque,
l'avertissement ferme la grille. Les gammes 50–950 sont réunies dans un
dépliant — la marque, les neutres, et les quatre familles sémantiques,
dont celle de l'avertissement part de **deux ancres** (jaune aux crans
clairs, brun aux foncés) : la famille est bi-tonale, et sa gamme le dit.

**Le défaut le plus instructif était invisible à l'œil nu** : les valeurs
mesurées ne suivaient pas le changement de thème. La page relève les
couleurs sur le rendu, mais elle les lisait **une image avant** que
l'attribut de thème soit posé — donc elle mesurait le thème précédent, et
affichait des chiffres justes pour un écran qui n'existait plus. Le relevé
attend désormais que le thème soit en place. Une page qui prétend mesurer
ce qu'elle affiche doit mesurer **après** l'avoir affiché.

Deux corrections de série, appliquées aux trois pages : le point de marque
vit **sous** le titre, sur sa propre ligne — il était soudé au dernier mot,
et la règle avait été comprise à l'envers ; et le playground de marques
porte le monogramme Fili et le nom de la marque essayée, plus une baseline
générique.

Pièces : `kit/app/couleur/vue.tsx` · `kit/app/globals.css` ·
`kit/app/typo/vue.tsx` · `kit/app/rythme/vue.tsx` · pièce de référence
`kit-couleur-nu.html`.

## #108 — La page Rythme passe au gabarit « documentaire nu », et le verdict est PARFAIT
*2026-08-24 · Statut : 🟢 Verrouillé (verdict d'Auteur : « PARFAIT ») · Thread « application du gabarit documentaire nu »*

La page Rythme du kit est recomposée sur la pièce de référence
`kit-rythme-nu.html` : rails nus portés par l'alignement et le blanc (CG2),
titre-affiche déclaré dans les jetons du gabarit (CG5, crans `--doc-*`),
grands silences entre sections (CG1), un geste de couleur par écran — les
commandes actives passent à l'encre (CG3) —, la tranche Coursue en scène
avec sa cascade de fonds (CG4), et le panneau de réglages replié en tiroir
dans la barre. Rien n'est perdu : les sept démonstrations restent avec
leurs casses, plus les six rôles d'espace en tuiles. Décision d'Auteur en
cours de passe : pas de redimensionnement sur cette page — l'échelle glisse
avec la largeur réelle.

Sept retours d'Auteur incorporés avant le verdict, tous dans le même sens —
l'effet avant la mécanique : la légende sort du bloc de couleur et parle à
un lecteur ordinaire ; les espaces surlignés deviennent neutres, une seule
étiquette par jeton, posée dans l'espace qu'elle nomme ; la faute d'un
écart menteur se mesure d'un trait façon Figma au lieu de se remplir ; la
casse de la profondeur devient visible (la sous-carte grandit, son rayon
cassé vaut deux fois celui de sa mère, le coin se souligne) ; le
bouton-exemple rentre dans le rang ; les figures d'une rangée s'alignent ;
la réponse du « bon cran » s'affiche en grand — et c'est le jeton qui est
grand, pas le rôle. Au passage, des jetons morts (`--rr-*`, `--p-*`)
référencés par la page sont réécrits sur l'échelle vivante.

Pièces : `kit/app/rythme/vue.tsx` · `kit/app/tokens.css` (crans `--doc-*`
du gabarit) · `kit/app/globals.css` · `kit/app/tiroir.tsx`. Typographie et
Couleur suivent, une page à la fois, verdict entre chaque (`#107`).

## #107 — Les gabarits entrent au corpus : cinq règles CG, actées une à une
*2026-08-24 · Statut : 🟢 Verrouillé (verdict d'Auteur sur chaque énoncé) · Thread « application du gabarit documentaire nu »*

Le relevé du 24 août a mesuré ce que les références « tenues » font
vraiment : shadcn et Material structurent tout par le blanc, Coursue tout
par les surfaces — les deux marchent, et ce qui rend une page fade, c'est
de ne pas choisir. Trois tempéraments nommés (éditorial, documentaire nu,
applicatif emboîté), cinq règles candidates validées EN BLOC sur pièce
(`kit-rythme-nu.html`, verdict PARFAIT), puis actées une à une au moule V2,
un verdict d'Auteur par énoncé : un principe porteur unique (CG1), rails
nus (CG2), un geste de couleur par écran (CG3), emboîtement en cascade
(CG4), le titre porte le tempérament (CG5). COMPOSITION-UX passe en 1.1.0.

Alternative écartée : une famille « gabarits » à part — refusée, ces règles
règlent la page comme les CP, elles vivent avec elles. Sans CRITERE, comme
les CP : la condition des assertions reste que le Gardien morde sur le kit.

Pièces : `sources/apps/site/content/md/foundations/COMPOSITION-UX.md` 1.1.0 ·
`claude/releve-gabarits-2026-08-24.md` ·
`claude/brief-application-gabarit-2026-08-24.md`.

## #106 — La composition entre au corpus : huit règles, actées en bloc
*2026-08-23 · Statut : 🟢 Verrouillé (accord d'Auteur explicite) · Thread « le kit avance sous mes yeux »*

Le fonds complet inventorié tient en quinze lois — sept vivaient déjà dans
nos familles, les huit restantes forment COMPOSITION-UX 1.0.0 : un costume
un rôle, la région commune se mérite, un dominant par vue, l'essentiel sur
le chemin de l'œil, la rupture se dépense, peu d'axes, chaque espace porte
un rôle nommé, le blanc d'abord. Nées des planches annotées fournies par
l'Auteur, du vocabulaire de Curtis et de la leçon des vingt retours. Actée
en bloc par accord d'Auteur explicite — pas de séance règle par règle, dit
et assumé. Sans CRITERE : la condition des assertions est que le Gardien
morde sur le kit. Premier consommateur : les espaces visualisés du kit
affichent leur rôle.

Pièces : `sources/apps/site/content/md/foundations/COMPOSITION-UX.md` ·
`claude/inventaire-lois-composition-2026-08-23.md` ·
`claude/pature-composition-2026-08-23.md`.

## #105 — Reprise de la typographie : onze règles gardées sur onze, la fonte déclarée est la fonte livrée
*2026-08-23 · Statut : 🟢 Verrouillé (séance de passage, verdicts d'Auteur) · Thread « le kit avance sous mes yeux »*

Reprise de la typographie — onze règles de code, deux mesures de rendu.
Séance de passage du 23 août : onze règles gardées sur onze, dont T11, née de
la leçon du témoin — la fonte déclarée est la fonte livrée, dépendance ferme
au versement des fichiers de fonte. Le pont du rythme est honoré (T6), le
jumeau de Y8 est écrit (T2). Les tensions sont dites ; les valeurs restent au
registre, arbitrées. Zéro code, zéro contrat ouvert.

**Arbitrage de registre du même jour** — les familles du kit : Geist
(interface) et JetBrains Mono (code), fichiers versés au dépôt du kit,
conformément à T11. Point de départ hérité du témoin, choisi — pas subi.

Pièces : `claude/reprise-typo-regles.md` · corpus
`sources/apps/site/content/md/foundations/TYPOGRAPHY-UX.md` 2.0.0.

## #104 — Le kit se reconstruit à neuf : kit/ naît, l'existant devient sources/
*2026-08-23 · Statut : 🟢 Verrouillé (décisions d'Auteur en séance) · Révise : #102 · Thread « le kit avance sous mes yeux »*

**Contexte** — La première matérialisation, faite dans l'existant, a révélé le
malentendu : l'Auteur voulait un kit neuf ; l'existant — atelier compris —
n'est qu'une source.

**Décision** — Un kit neuf naît dans le dépôt (`kit/`, Next.js, zéro héritage) ;
l'ancien devient `sources/` (git mv, carrière gelée, historique suivi).
Exigences d'Auteur : adaptation multi-stack dès la naissance — React, Angular,
HTML × CSS natif, Tailwind, « c'est ce que demande le marché » — et jetons en
double sortie (variables CSS + jumelle Tailwind). Les jetons du rythme sont
LUS sur l'étalon Semantic Rhythm à 320 et 1440 (méthode du crash-test) puis
interpolés. Le gabarit des pages de famille est arrêté sur retours d'œil
successifs : navigation · contenu 1024 px centré · theming & playground ;
aperçus redimensionnables portés de l'atelier (paliers 320/768/1024, 1024 par
défaut) ; « voir les espaces » dans la box au survol et au focus ; les règles
et leurs sources vivent dans les dépliants « d'où ça vient » de leur
démonstration ; en mode Tailwind, les démos s'accrochent à l'échelle Tailwind
(note d'Auteur : jamais de décimales côté Tailwind).

**Sens produit / UX** — La page de famille EST la documentation : on comprend
en jouant — tirer la poignée fait vivre l'échelle, casser une règle montre la
faute — et chaque affirmation dit d'où elle vient. Écrite pour un lecteur
externe, sans jargon interne.

**Alternatives écartées** — Matérialiser dans le kit existant (fait le matin,
rejeté : ce n'était pas la direction voulue) ; la coupe doc|sources en deux
colonnes au centre (rejetée à l'œil) ; un bloc de règles en bas de page
(rejeté : sans intérêt hors de sa démonstration).

**Conséquences** — `docs/PLAN.md` amendé. La typographie est la prochaine
fondation ; chaque famille jugée naîtra désormais directement en page vivante
du kit neuf.

**Pièces** — `kit/` · `claude/seance-rythme-2026-08-23.md` · `sources/`.

---

## #103 — Reprise du rythme : neuf règles actées en séance, un renversement d'Auteur, la famille au corpus
*2026-08-23 · Statut : 🟢 acté (séance de passage, verdict règle par règle) · Thread « le kit avance sous mes yeux »*

Reprise du rythme — neuf règles de code, une mesure de rendu. La phase 1 du
cap ouvre sur l'espacement : les 22 lois vivantes deviennent neuf règles au
moule V2, jugées une par une (9/9 actées). Y8 est renversée en séance :
l'échelle devient responsive — position GOV.UK adoptée, alignée sur l'Échelle
Semantic Rhythm qui produit déjà des jetons fluides ; la loi du fonds
contredisait l'étalon, et la variation vit désormais dans le jeton, jamais
dans un écran. Y9 consacre le passage en rem (#069) ; le fonds disait
l'inverse et sa propre bibliographie l'avait fissuré. Cinq couvertures
Gardien sont dites avec leurs nuances, la question du facteur (2 contre 3)
est nommée et portée au contrat avec les valeurs, une mesure de rendu est
consignée pour le futur instrument. Le corpus — aujourd'hui sous `sources/` —
porte la famille en 2.0.0, les verdicts inscrits dans chaque règle.
Pièces : `claude/reprise-rythme-regles.md` · `claude/seance-rythme-2026-08-23.md` ·
`sources/apps/site/content/md/foundations/SPACING-UX.md`.

---

## #102 — Le kit change de cap : reconstruction par les notions mères, composants gelés jusqu'au verrou des fondations
*2026-08-23 · Statut : 🟢 Verrouillé (validation d'Auteur du « cap du kit ») · Thread « le kit avance sous mes yeux »*

**Contexte** — Le thread kit rouvre après le rangement du dépôt. La carte des
écarts du 23 août montre que rien des cinq paquets d'août n'est entré au
corpus. L'Auteur pose la question de direction : patcher, ou reconstruire par
les notions mères.

**Décision** — Le kit se reconstruit par les Fondations (avec Principes et
Langages), dans le kit existant. Ordre : typographie & rythme d'abord (seules
familles sans paquet — inventaire puis règles au moule V2, verdict d'Auteur
règle par règle), puis entrée au corpus des quatre paquets écrits, puis les
cinq familles restantes. Composants et patterns gelés jusqu'au verrou des
fondations ; chacun naîtra ensuite avec sa fiche « les lois qui m'ont
construit ». Doctrine d'agnosticisme : le normatif est la règle et le jeton ;
toute implémentation n'est qu'un exemple. L'atelier (theming, playground)
suit chaque phase.

**Sens produit / UX** — Un design system qui montre ses raisons : le visiteur
remonte de chaque élément aux lois qui l'ont construit. C'est l'identité du
kit, et la démonstration vivante de ce que Sibyl vend.

**Alternatives écartées** — Un kit neuf depuis une page blanche (refaire 37
sujets et la chaîne de vérification pour un gain incertain) ; appliquer les
paquets sans rouvrir la direction (aurait laissé la typographie et le rythme,
priorités d'Auteur, en dernier).

**Conséquences** — `docs/PLAN.md` réécrit (commit d8c2858). La phase 1 ouvre
sur la typographie et le rythme. La carte du système devra refléter le gel
des composants à la prochaine tenue.

**Pièces** — `docs/PLAN.md` · `claude/cap-du-kit-2026-08-23.md`.

---

## #101 — Reprise des bordures : douze règles de code, et le rôle du trait se déclare au registre
*2026-08-16, validé le 2026-08-22 · Statut : 🟢 acté (accord d'Auteur du 2026-08-22 ; versé le 2026-08-23 — le thread du 22 août n'avait pas accès au dépôt, texte déposé « à coller » dans `claude/reprise-bordures-regles.md` et versé tel quel) · Thread « reprise des lois de l'étude de mise en page »*

Reprise des bordures — douze règles de code, deux mesures de rendu, quatre
arbitrages, validées une par une. Le cinquième paquet de la reprise des
lois de l'étude est rédigé et accepté : les 24 lois vivantes des
bordures deviennent douze règles au moule V2 — quatre paires disant la
même chose sur les deux couches du fonds sont fusionnées en le disant — et
deux mesures consignées pour le futur instrument de rendu, qui n'est pas
construit. Les quatre arbitrages d'Auteur du 16 août sont confirmés : le
rôle du trait se déclare désormais au registre, ce qui rend vérifiable la
loi que le fonds disait « non décidable par un script » et fait naître une
règle nouvelle ; l'anneau qui s'ajoute à la bordure d'état, que le fonds
avait déclassé en préférence après benchmark, est remis en règle comme
parti pris assumé avec sa tension consignée ; la limite de l'anneau
monochrome sur fond imprévisible reste une dette ouverte avec sa condition
de réouverture nommée ; et les exigences à cheval sur deux familles — le
rayon de l'anneau, déjà chez les arrondis, et le contraste forcé du
système, déjà chez la couleur — sont dites une seule fois dans un
paragraphe de ponts, qui ferme au passage la dette de pont laissée ouverte
par les arrondis. La séance de passage a produit quatre choses que le
document ne portait pas : une réserve d'Auteur sur la clause « un fond
non déclaré est interdit » (B1), à repeser à l'ouverture du contrat ; une
frontière nommée entre l'épaisseur de bordure et la largeur de l'anneau,
sans quoi un anneau de deux pixels ferait rougir la règle de l'épaisseur
unique (B3) ; deux intentions de valeur portées au registre — largeur
d'anneau possible à deux pixels et anneau accordé à l'état du composant,
teinte laissée ouverte parce qu'un cran pâle sur fond clair ne tiendrait
pas le seuil, l'anneau se détachant du fond de la page et non de la
bordure (B5) ; et un arbitrage rendu par l'architecte sur délégation
explicite de l'Auteur, avec son motif et son auteur écrits (B10 — l'anneau
est un signal de clavier, parce que sans elle la règle qui interdit de
supprimer le focus ne tient pas). Un « non » initial sur la lisibilité du
trait est tombé de lui-même : la souplesse demandée sur les bordures
décoratives existait déjà, portée par l'exemption des rôles grouper et
séparer — c'est ce que la déclaration du rôle achète. Trois tensions de
source sont consignées telles quelles : nous sommes le seul système relevé
à tenir une épaisseur de trait unique, minoritaires à ne pas épaissir le
trait à l'état, et sans consensus de marché sur la technique de l'anneau.
Quatre règles sur douze déclarent leur dépendance au registre typé et
refuseront de statuer sans lui. Zéro code, zéro contrat ouvert, aucune
assertion ajoutée au Gardien. Pièce : `claude/reprise-bordures-regles.md`.

---

## #100 — Reprise de la couleur : seize règles de code, et le texte pâle remonte au-dessus du seuil
*2026-08-13 · Statut : 🟢 acté (accord d'Auteur ; arbitrage d'Auteur sur le texte pâle) · Thread « reprise des lois de l'étude de mise en page »*

Reprise de la couleur — seize règles de code, trois mesures de rendu, et
un arbitrage qui ferme une contradiction. Le quatrième paquet de la
reprise des lois de l'étude est rédigé : les 22 lois vivantes de la
couleur deviennent seize règles au moule V2 et trois mesures pour le
futur instrument de rendu. L'arbitrage d'Auteur du texte pâle est
prononcé : le gris remonte au-dessus du seuil de lisibilité dans les deux
thèmes — la norme ne connaît pas d'exception « métadonnées », la
contradiction que le fonds gardait ouverte est fermée par le haut, et la
dette « liste fermée » du ménage est dissoute. La remontée de la valeur
est commandée au registre, pas exécutée ici. Le principe « par rôle,
jamais par valeur » coiffe la famille. Zéro code, zéro contrat ouvert,
aucune assertion ajoutée au Gardien. Pièce :
`claude/reprise-couleur-regles.md`.

---

## #099 — Reprise du tactile : dix règles de code, cinq mesures pour le futur instrument de rendu
*2026-08-13 · Statut : 🟢 acté (accord d'Auteur) · Thread « reprise des lois de l'étude de mise en page »*

Reprise du tactile — dix règles de code, cinq mesures de rendu. Le
troisième paquet de la reprise des lois de l'étude est rédigé : les 23
lois vivantes du tactile (la famille aux 72 violations de l'étude)
deviennent dix règles au moule V2 — trois paires qui disaient la même
chose sur les deux couches du fonds sont fusionnées en le disant — et
cinq mesures consignées pour le futur instrument de rendu, qui n'est pas
construit. La sanction d'arrêt du ménage est intégrée à la règle du
plancher ; les principes (le doigt n'est pas une souris, la zone
d'atteinte, la rampe) partent en référence avec la liste de contrôle.
Une tension de source sur l'empreinte du doigt est consignée, sans effet
sur les seuils. Zéro code, zéro contrat ouvert, aucune assertion ajoutée
au Gardien. Pièce : `claude/reprise-tactile-regles.md`.

---

## #098 — Reprise des arrondis : dix règles sur papier, et la dette des superposés est fermée
*2026-08-13 · Statut : 🟢 acté (accord d'Auteur) · Thread « reprise des lois de l'étude de mise en page »*

Reprise des arrondis — dix règles sur papier. Le deuxième paquet de la
reprise des lois de l'étude est rédigé : les dix lois vivantes des
arrondis sont réécrites au moule V2 (énoncé, mesure décidable sans
contexte, test esquissé), la table de risques passe en référence, et la
dette du ménage est fermée — la loi des superpositions est corrigée dans
sa version consignée : un superposé est un conteneur, grand cran, comme
l'arbitrage du 3 août l'avait déjà tranché côté arrondis. Quatre règles
sur dix déclarent leur dépendance au registre typé et refuseront de
statuer sans lui. Zéro code, zéro contrat ouvert, aucune assertion
ajoutée au Gardien. Pièce : `claude/reprise-arrondis-regles.md`.

---

## #097 — Le ménage des seize douteuses est tranché : le corpus de reprise passe de 260 à 247 lois
*2026-08-13 · Statut : 🟢 acté (seize verdicts d'Auteur) · Thread « reprise des lois de l'étude de mise en page »*

Ménage des 16 lois douteuses de l'étude de mise en page — tranché. Les 16
douteuses de l'inventaire validé ont été présentées une par une et jugées :
6 jetées (les notes d'ouverture historiques), 4 fusionnées dans leur loi
voisine, 2 reclassées principes de tête, 1 reclassée liste de contrôle de
référence, 3 gardées avec exécution (le texte pâle attend sa liste fermée
d'usages ; le récit de la grille de colonnes est résumé à sa décision ; la
contradiction superpositions/arrondis est tranchée en faveur des arrondis —
un superposé est un conteneur). Le corpus de reprise passe de 260 à 247 lois
comptées. Les fichiers sources du fonds ne sont pas modifiés : chaque verdict
s'exécute à la reprise de sa famille. Pièce :
`claude/menage-lois-douteuses-verdicts.md`. Aucune règle écrite, aucun
contrat ouvert.

---

## #096 — L'inventaire des 260 lois de l'étude de mise en page est validé, et le premier paquet est choisi : le ménage
*2026-08-13 · Statut : 🟢 acté (décisions d'Auteur : inventaire validé, premier paquet choisi) · Thread « reprise des lois de l'étude de mise en page »*

Reprise des lois de l'étude de mise en page — inventaire validé. Les 260
lois des 12 fondations V1 sont classées loi par loi : 9 déjà couvertes par
le Gardien, 138 candidates règles lisibles au fichier, 26 vérifiables
seulement au rendu (hors Gardien par construction — un instrument tiers,
dont l'étude a laissé le prototype), 71 affaires d'œil versées à la
référence, 16 douteuses à trancher. Pièces :
`claude/inventaire-lois-etude-mise-en-page.md` et
`claude/paquets-reprise-lois-etude.md`. Le premier paquet choisi est le
ménage des 16 douteuses. Aucune règle écrite, aucun contrat ouvert.

---

## #095 — Les deux journaux sont réconciliés : le dépôt fait foi, la lignée du projet est rapatriée, rien n'est réécrit
*2026-08-13 · Statut : 🟢 Verrouillé (décision d'Auteur : option A du plan de réconciliation) · Exécute `#051` et `#057` · Thread « resynchronisation des deux journaux »*

**Contexte** — Le 7 août, `#051` et `#057` ont fait descendre le journal vivant
au dépôt et gelé `claude/journal.md` à `#043`–`#049`. Les threads suivants —
kit de création, test KYB, suites de la séance É1, déclaration du produit —
n'ont pas vu cette décision et ont continué la lignée du projet. Résultat
constaté le 13 août : deux journaux vivants, 52 décisions distinctes, huit
numéros portant deux entrées différentes (`#050`, `#051`, `#058` à `#063`),
et aucune décision écrite en double. Inventaire et plan :
`claude/inventaire-versement-journal-2026-08-13.md`,
`claude/plan-reconciliation-journaux-2026-08-13.md`.

**Décision** — **Le dépôt fait foi, et la décision du 7 août est exécutée au
lieu d'être révisée.** Les huit entrées du projet postérieures à `#049` sont
reprises ici sous `#087` à `#094`, textes d'origine, chacune avec une note de
provenance ; la correspondance est en tête de fichier. `claude/journal.md`
est de nouveau **gelé comme pièce**, à 15 entrées. Le scellement, en retard
depuis `#064`, est remis à jour : **45 entrées scellées, `#050` à `#094`**,
aucune entrée passée touchée — vérifié par l'outil avant et après.

**Sens produit / UX** — Un projet dont la mémoire vit à deux endroits n'a pas
de mémoire : chaque numéro cité devient une ambiguïté, et chaque écriture un
risque. La réconciliation rend au journal sa propriété première — une seule
suite de décisions, sous une garantie mécanique qui refuse toute réécriture du
passé. Et la cause de la divergence est nommée pour ne pas se reproduire : une
décision d'autorité prise d'un côté et invisible de l'autre.

**Alternatives écartées** — *Le projet fait foi* (37 reprises au lieu de 8, et
au bout : un journal sans empreintes — on réinstallait la fragilité qui a coûté
quarante-deux entrées) ; *deux journaux assumés avec un index* (le moins cher
aujourd'hui, le plus cher pour toujours : chaque numéro devient ambigu, et deux
journaux vivants, c'est deux fois le risque d'écriture concurrente — la cause
de l'incident d'origine) ; *reprendre aussi `#043`–`#049`* (leur sort est déjà
écrit par `#057` : gelées au projet, désignées par la table d'orientation).

**Conséquences** — Une règle de tenue, opposable : **un thread qui n'a pas
accès au dépôt n'écrit pas d'entrée — il dépose son texte « à coller » dans un
document de projet, et un thread de tenue le verse ici.** C'est le protocole
qui a réparé la divergence, écrit en règle. Les numéros `#087` à `#094` ne
suivent pas la chronologie ; leurs notes de provenance en gardent la trace.
Les renvois internes des entrées reprises suivent la numérotation du projet.
Dette restante : la carte du dépôt (`system-map.md` du dépôt) n'est pas mise à
jour par ce thread.

**Impact carte** — Carte du projet : la note « État du journal » dit désormais
que le vivant est au dépôt (45 entrées scellées) et que le journal du projet
est une pièce gelée à 15 entrées. Aucun contrat touché, aucune assertion,
aucun code de produit.

---


## #094 — La phrase fondatrice est retrouvée, et elle coiffe la déclaration
*2026-08-13 · Statut : 🟢 Verrouillé (décision d'Auteur : « ça me semble fondateur ») · Complète `#061` et `#062` du projet (ici `#092` et `#093`), ne les révise pas*

> **Note de reprise (2026-08-13)** — Entrée du journal du projet, reprise ici en
> exécution de `#051` et `#057` : le journal vivant est ce fichier. Texte
> d'origine inchangé ; les renvois `#0NN` du texte suivent la numérotation du
> projet (correspondance en tête de fichier). Au projet, cette entrée porte le
> numéro **`#063`**.

**Contexte** — Après la déclaration (`#061`, `#062`) et deux jours de doute sur
le marché — ce qui existe déjà en morceaux, ce qu'on vend, l'open source —,
l'Auteur écrit : *« Mon but était simple : créer une encyclopédie des bonnes
pratiques et permettre aux IA et aux humains de les maintenir dans le temps. »*
Ce but date de la v1 et n'a jamais bougé ; il était déjà presque mot pour mot
dans `#062` — « la mémoire et le gardien des bonnes pratiques ».

**Décision** — La phrase entre au journal comme **phrase fondatrice**, en tête
de la déclaration :

> **Fili existe pour créer une encyclopédie des bonnes pratiques, et permettre
> aux IA et aux humains de la maintenir dans le temps.**

Tout le reste en descend. **L'encyclopédie**, c'est le savoir : la grille, les
contrats, les registres, le vocabulaire, les décisions écrites. **Le maintien
dans le temps**, c'est la partie dure — le Gardien, les batteries, le journal
immuable — celle qui a coûté deux versions, et celle que le marché n'a pas :
il est plein d'encyclopédies qui pourrissent.

**Sens produit / UX** — Cette phrase donne le critère de tri que la déclaration
cherchait : chaque pièce du projet est soit du **savoir**, soit du **maintien** ;
ce qui n'est ni l'un ni l'autre n'appartient pas à Fili. Elle éclaire aussi les
intuitions des derniers jours sans les trancher : une encyclopédie se **donne**
— l'instinct open source d'hier — et ce qui se vend, c'est celui qui sait
l'installer. Ces deux points restent des questions ouvertes, pas des décisions.

**Alternatives écartées** — *La réécrire en langage produit* (c'est sa
simplicité qui la rend fondatrice ; la reformuler serait la perdre une deuxième
fois) ; *en faire une nouvelle déclaration qui remplace `#061` et `#062`*
(elles ne se contredisent pas : la phrase dit le **but**, la déclaration dit le
**produit** qui le sert).

**Conséquences** — La phrase coiffe la déclaration ; `#061` et `#062` se lisent
désormais comme sa traduction en produit. L'open source et le modèle — que
donner, que vendre — restent **non tranchés**, à instruire dans leur propre
thread.

**Impact carte** — La carte portera la phrase fondatrice en tête ; elle n'est
pas touchée dans ce thread.

---

## #093 — La déclaration se précise : Fili est un facilitateur, et ses trois verbes sont égaux
*2026-08-13 · Statut : 🟢 Verrouillé (paroles d'Auteur, deux arbitrages rendus) · Révise `#061` du projet (ici `#092`) sur un seul point : le rang de l'audit*

> **Note de reprise (2026-08-13)** — Entrée du journal du projet, reprise ici en
> exécution de `#051` et `#057`. Texte d'origine inchangé ; les renvois `#0NN`
> du texte suivent la numérotation du projet. Au projet, cette entrée porte le
> numéro **`#062`**.

**Contexte** — La déclaration de `#061` à peine versée, l'Auteur la reprend dans
ses mots : *« L'idée centrale de Fili est là. Aider à construire, auditer et
corriger des sites et apps qui utilisent des design systems de façon
incohérente. »* Trois choses de cette phrase n'étaient pas dans `#061` : le mot
**facilitateur**, l'ennemi nommé — **l'incohérence** —, et le verbe **corriger**.

**Décision** — Trois précisions entrent dans la déclaration, dont une révise
`#061`.

1. **Fili est un facilitateur.** Il aide le designer à produire, à respecter ses
   propres choix, et à les **propager aux autres** — au-delà de sa connaissance
   personnelle. L'IA et Fili deviennent **la mémoire et le gardien des bonnes
   pratiques**.
2. **L'ennemi est nommé : l'incohérence.** Avoir une librairie d'objets et des
   fondations de charte, tout le monde le fait. Les assembler de manière logique
   et **faire respecter cette logique**, presque personne. Le rythme est le
   **premier étage** de cette logique — on n'en est qu'au début.
3. **Les trois verbes sont égaux : construire, auditer, corriger.** C'est la
   révision de `#061`, qui plaçait l'audit « derrière la création ». L'audit est
   un service plein, au même rang que la construction. Sa **limite** reste
   écrite et ne bouge pas : il dit « rien d'inventé », jamais « bien réglé ».

**Et un horizon déclaré, pas un chantier** — **Corriger l'existant** : remettre
en cohérence des sites et apps déjà construits qui utilisent mal leur design
system. C'est le marché le plus large, et c'est une destination écrite dans la
déclaration. Mais on construit d'abord le geste de création ; la correction
viendra quand le rythme et le sens tiendront. Arbitrage d'Auteur, rendu ce jour.

**Sens produit / UX** — Ce que `#061` promettait — accepter la production d'une
machine sans relire ligne à ligne — reste. S'y ajoute la **propagation** : une
bonne pratique décidée une fois est tenue partout, même là où le designer ne
regarde pas, même par des gens ou des machines qui ne l'ont jamais rencontré.
Ses choix lui survivent au lieu de vivre dans sa seule tête.

**Alternatives écartées** — *Laisser `#061` tel quel et ranger ces phrases en
commentaire* (les mots de l'Auteur sont la déclaration, pas une glose) ;
*garder l'audit derrière la création* (c'était la lecture de la veille,
l'Auteur l'a corrigée : le service a trois verbes) ; *ouvrir le chantier
« corriger l'existant » tout de suite* (le marché est large mais le geste de
création n'est pas fini — un horizon déclaré vaut mieux qu'un chantier de
plus).

**Conséquences** — La déclaration se lit désormais en trois phrases : Fili est
un facilitateur ; son ennemi est l'incohérence ; il aide à construire, auditer
et corriger — les deux premiers verbes maintenant, le troisième à l'horizon.
Rien d'autre de `#061` ne bouge : les jetons de rôle restent mis de côté,
l'utilisateur déclaré reste le designer qui fait produire des IA, et la limite
de l'audit reste écrite.

**Impact carte** — Même note qu'en `#061` : la carte portera la déclaration
précisée ; elle n'est pas touchée dans ce thread.

---

## #092 — Ce que Fili est, après les trois épreuves de sortie : le lien entre un rythme dérivé et un sens déclaré
*2026-08-13 · Statut : 🟢 Verrouillé (quatre réponses d'Auteur aux questions de cadrage) · Révise `#040` sur un seul point : l'utilisateur déclaré · ⛔ Révisée par `#062` du projet (ici `#093`) sur le rang de l'audit*

> **Note de reprise (2026-08-13)** — Entrée du journal du projet, reprise ici en
> exécution de `#051` et `#057`. Texte d'origine inchangé, y compris sa note de
> numérotation d'époque ; les renvois `#0NN` du texte suivent la numérotation du
> projet. Au projet, cette entrée porte le numéro **`#061`**.

> **Note de numérotation** — les entrées `#051` à `#060` vivent dans les documents
> de leurs threads (séances, migration, règle du squelette) et ne sont pas encore
> versées ici. Ce numéro suit le plus haut numéro déjà attribué (`#060`). Le trou
> est la trace, comme celui de `#049`.

**Contexte** — Trois épreuves de sortie ont confronté le système au dehors, et
leur enseignement tient en une phrase de l'Auteur : **le marché sait déjà nommer
une couleur par son rôle ; il ne sait ni poser un rythme, ni dire un sens.**
S'y ajoute le résultat interne le plus dur du chapitre : un écran peut être
conforme à cent pour cent et moins bon qu'avant — la conformité ne dit jamais le
sens. Il fallait trancher ce que Fili garde et ce qu'il abandonne, avant
d'engager quoi que ce soit d'autre.

**Décision — la déclaration.**

> **Fili est ce qui permet à un designer de faire produire des machines sans
> perdre sa main.** Il tient en deux gestes que le marché ne fait pas, et qui ne
> se séparent pas : **poser un rythme** — toute la géométrie descend de quelques
> décisions d'auteur, personne ne choisit plus une valeur une par une — et
> **dire un sens** — une page déclare ce qui compte d'abord, et l'absence
> d'arbitrage devient impossible à ne pas voir. L'un sans l'autre a déjà
> échoué : le rythme seul a produit un écran conforme et moins bon ; le sens
> seul ne se transmet pas à une machine.

**Ce qui est explicitement mis de côté, et pourquoi** —

- **Les jetons de rôle et le nommage sémantique.** Le marché entier sait le
  faire : ce n'est plus une invention, c'est un acquis ambiant. Fili s'y appuie
  et ne le refait pas ; les sorties CSS, Tailwind et Figma restent des
  véhicules, jamais la valeur.
- **L'audit comme promesse.** Le Gardien et le moteur d'invariants sont gardés
  comme **filet** : ils garantissent que rien n'a été inventé, jamais que c'est
  bien réglé. Deux faits l'imposent — l'épreuve corrigée du kit (conforme et
  moins bon), et l'instrument trouvé aveugle pendant le test d'entreprise. Dans
  tout ce que Fili dit de lui-même, le filet passe derrière la création.

**L'utilisateur déclaré change** — de « l'Auteur, seul » (`#040`) à **« le
designer qui fait produire des IA »**, dont l'Auteur est le premier cas. Rien
d'autre de `#040` ne bouge : ni les trois parcours, ni les sept écrans, ni la
ligne rouge.

**Sens produit / UX** — Ce que gagne celui qui s'en sert : il peut accepter ce
qu'une machine a produit **sans relire ligne à ligne**, parce que le rythme est
dérivé (rien à vérifier valeur par valeur) et que le sens est déclaré (rien à
deviner sur ce qui compte). C'est une valeur qui croît avec la qualité des
modèles au lieu de fondre avec elle.

**Alternatives écartées** — *Revendiquer le rythme seul* (la preuve la plus
solide du projet, mais l'épreuve corrigée a montré qu'il peut produire du
conforme moins bon : vendu seul, il promet ce qu'il ne tient pas) ;
*revendiquer le sens seul* (sans mécanique il ne se transmet pas, et le marché
est plein de doctrines sans dents) ; *garder les jetons de rôle comme valeur
propre* (ce serait se comparer là où tout le monde est déjà) ; *garder l'audit
au premier rang* (un dispositif qui surestime ses garanties est le pire des
dispositifs — établi deux fois sur pièce) ; *rester mono-utilisateur* (les
trois épreuves ont précisément testé la transmission à des machines dirigées
par un designer : c'est là que la valeur se joue).

**Conséquences** — Tout chantier se juge désormais à cette aune : sert-il le
rythme, le sens, ou leur lien ? Ce qui ne sert que l'acquis ambiant n'est plus
un chantier de Fili. Aucun contrat n'est rouvert, aucune assertion ajoutée,
aucun code écrit.

**Impact carte** — La carte devra porter cette déclaration en tête et le
changement d'utilisateur déclaré ; elle n'est pas touchée dans ce thread
(règle de `#049` : une seule écriture de document vivant à la fois — ici,
le journal).

---

## #091 — Le système éprouvé sur une US d'entreprise : 11 réponses sur 72, et un instrument aveugle
*2026-08-11 · Statut : 🟢 Verrouillé · Thread « Test grandeur nature US-KYB »*

> **Note de reprise (2026-08-13)** — Entrée du journal du projet, reprise ici en
> exécution de `#051` et `#057`. Texte d'origine inchangé ; les renvois `#0NN`
> du texte suivent la numérotation du projet. Au projet, cette entrée porte le
> numéro **`#051`** (elle s'était numérotée `#049` par erreur à l'écriture, le
> numéro était déjà pris ; corrigé au versement du 13 août, avec note).

**Contexte** — US-KYB-001, formulaire KYB multi-juridictionnel volontairement
monstrueux, passé en trois temps : recensement des questions d'interface,
verdict de couverture, preuve par l'écran sur la tranche Identité + arbre UBO.

**Résultat du recensement et du verdict** — 72 questions d'interface, 11
familles. Le système répond à **11** (15 %), répond à moitié à **16** (22 %),
ne répond pas à **45** (63 %). Les onze réponses pleines sont toutes de la
géométrie ou de l'existence d'un état : c'est la Ligne de Partage de `#027`
mesurée pour la première fois sur un cas réel, et elle tient.

**Trois trous nommés, aucun improvisé** — *(1)* **S2 ne connaît que cinq
états ; l'US en exige onze.** Dégradé, hors ligne, verrouillé, en conflit,
lecture seule, en cours non bloquant : six états décidables, opposables, absents
de tout contrat. C'est `B-ÉTAT`, candidat contrat, priorité 1. *(2)* **La chaîne
géométrique s'épuise au troisième niveau.** Un arbre récursif en demande *n* ;
au quatrième, la loi des rayons tend vers zéro et la chaîne des paddings tape le
plancher. Le trou est dans la dérivation, la pièce que le projet croyait close.
C'est `B-GEO`. *(3)* **R4.3 sur-bloquerait une vue-outil** : exiger un
changement de densité toutes les deux sections n'a pas de sens sur un dossier
réglementaire. Deuxième divergence entre conformité et utilité, après `#025`.

**La contrainte a produit le dessin** — Plutôt que d'inventer une règle de
profondeur, la conséquence de `B-GEO` a été tenue : l'arbre n'emboîte pas de
surfaces, les nœuds sont de même rang et la profondeur se dit par le retrait.
Quatre niveaux, aucune chaîne cassée, lisible à 320 px. Ça ne clôt pas `B-GEO` ;
ça donne un argument au repli d'affichage contre le plancher.

**La mesure** — Pièce construite avec le système : **9/9 aux neuf invariants**,
dans quatre états et à trois largeurs, diviseur unique ÷2, une seule valeur de
frontière par étage, zéro faute. Pièce écrite sans le système, sans sabotage :
**6/9, 107 fautes** (i2 ×3, i6 ×3, i9 ×101), diviseur accidentel ÷1,7, deux
valeurs de frontière sans parenté.

**Et le résultat qui compte plus que les deux écrans** — Les 107 fautes de forme
sont la partie visible. La partie coûteuse est ailleurs : la pièce sans règles
**laisse soumettre un dossier dont une branche n'atteint aucune personne
physique**, et **laisse passer un champ obligatoire vide sans rien dire**. Elle
n'est pas laide, elle est fausse, et elle est fausse là où la géométrie ne
regarde pas.

**L'instrument d'audit était aveugle** — L'invariant 9 a rendu 1 déclaration lue
sur 138. Depuis Chrome 112, une règle de style ordinaire porte une liste de
sous-règles (CSS imbriqué) ; le moteur teste les sous-règles **avant** les
déclarations, la branche des déclarations n'est donc jamais atteinte, et
**aucune feuille de style n'est lue**. Une page entièrement en pixels y passe au
vert. Écart mesuré sur la même pièce : **1 faute contre 101**. Correctif : une
ligne, l'ordre des deux questions. C'est `#020` et `#021` répétés sur l'autre
instrument — *un dispositif qui surestime ses propres garanties est le pire des
dispositifs* — et la cause de fond est nommée : **le moteur des 9 invariants n'a
ni fixtures piégées ni tests de mutation**, là où le Gardien en a depuis `#010`.

**Alternatives écartées** — Élargir la tranche au champ TVA pour démontrer
l'état dégradé (arbitrage d'Auteur : la tranche reste celle qui a été décidée ;
le dégradé se joue sur le numéro d'identification). Rendre contractuels les deux
états supplémentaires au passage (interdit par le brief : les trous se
consignent, ils ne s'improvisent pas). Corriger le moteur d'audit dans la
foulée (hors périmètre du thread).

**Ce que ça ne prouve pas** — La comparaison n'est pas aveugle : la même session
a écrit les deux pièces, limite de l'Épreuve A jamais levée, dont l'Épreuve E
reste le seul correctif. Une seule tranche sur sept ; téléversement, co-édition
et délégation — là où les trous sont les plus nombreux — n'ont pas été éprouvés.
Aucun jugement d'Auteur n'a été rendu sur l'écran.

**Impact carte** — Nouveaux chantiers consignés : `B-ÉTAT` (candidat contrat,
priorité 1) · `B-GEO` (candidat loi, priorité 1) · `B-S4` (l'alternance sur une
vue-outil ; verrou d'épreuve `#048` toujours en place) · `B-S6` (douze questions
chiffrées) · `B-REG` (quatorze composants absents, charge de K5) · `B-A11Y` (six
questions, zéro instrument). Dette d'outillage nouvelle : **le moteur des 9
invariants n'est pas testé par mutation**, et son i9 est inopérant sur Chromium
récent.

**Pièces** — `claude/recensement-questions-kyb.md` · `claude/couverture-kyb.md` ·
`claude/contrat-etat-tranche-kyb.md` · `claude/resultat-test-kyb.md` ·
`kyb-identite-ubo.html` · `kyb-sans-regles.html`.

---

## #090 — Le kit de création est construit, et il est aligné sur l'Échelle Semantic Rhythm de l'Auteur : le modèle que j'avais reconstruit est abandonné
*2026-08-11 · Statut : 🟢 Verrouillé (décision d'Auteur : « La mienne fait foi, aligne ton kit dessus ») · Ouvre et clôt le thread « Kit de création »*

> **Note de reprise (2026-08-13)** — Entrée du journal du projet, reprise ici en
> exécution de `#051` et `#057`. Texte d'origine inchangé ; les renvois `#0NN`
> du texte suivent la numérotation du projet. Au projet, cette entrée porte le
> numéro **`#050`** — le même numéro que l'entrée du dépôt sur le périmètre
> typographique : c'est la collision qui a révélé la divergence des deux
> lignées.

**Contexte** — Le thread « Kit de création » s'ouvre sur `claude/brief-kit-creation.md` : outiller l'**étage 1 de la prévention** — rendre l'erreur inconstructible — avant l'audit, qui n'est que le filet. Les cinq questions de cadrage du §4 sont posées et répondues (`claude/cadrage-kit-creation.md`) : les trois cibles (CSS, Tailwind, Figma), les trois décisions d'entrée seules, la géométrie seule, une page « réglez et téléchargez », un fichier de règles unique éprouvé sur deux IA. L'accord de production est donné.

**Le fait qui a tout décidé, et qui n'a été vu qu'à la fin** — La dérivation géométrique existe déjà chez l'Auteur, dans un générateur nommé *Échelle Semantic Rhythm*. Elle n'était **dans aucun document du projet**, et le dossier qui la contenait n'était pas accessible — une demande d'accès est restée sans réponse. J'ai donc **reconstruit** un modèle : échelle fermée `4 · 8 · 16 · 24 · 40 · 80`, quatre rôles verticaux, un « diviseur » entendu comme rapport minimal entre deux rôles voisins, une loi de rayons où le rayon d'un cadre valait celui de son contenu **plus** la marge. Ce modèle reproduisait à l'identique toutes les valeurs prouvées du corpus — l'échelle de `#017`, la table des trois régimes de `rythme-v0-etude.md`, les hauteurs de SPACING-R14 — et il était **faux quand même**, parce qu'il répondait à une autre question que celle que l'Auteur avait tranchée.

**Décision** — **La mécanique de l'Auteur fait foi.** Le kit est réécrit sur elle, et le modèle reconstruit est abandonné — pas amendé. Ce qui change de nature :

| Ce que j'avais construit | Ce qui fait foi |
|---|---|
| une échelle fermée de six crans | des valeurs continues, dérivées de la base et du ratio |
| quatre **rôles** verticaux | trois **profondeurs** d'emboîtement — la coque, la carte, le détail |
| un « diviseur » entre rôles voisins | un **ratio** entre profondeurs : `B`, `B/R`, `B/R²`, intervalle musical nommé |
| rayon = rayon intérieur **+** marge | rayon **÷ 2** à chaque profondeur — l'octave |
| un seul axe d'espacement | **deux axes distincts**, horizontal et vertical, d'élasticités différentes |
| aucune fluidité | un rythme responsive de 320 à 1440 px, cinq axes, courbe adoucie |

**Sens produit / UX** — Cinq choses, dont quatre n'étaient pas cherchées.

**La profondeur n'est pas un jugement, le rôle en était un.** C'est le résultat qui compte, et il ne vient pas de moi. Mon fichier de règles demandait à l'IA de décider si deux blocs étaient « frères » ou « dans un bloc » — un arbitrage déguisé en règle. Le modèle de l'Auteur ne pose jamais cette question : il demande **à quelle profondeur d'emboîtement on se trouve**, ce qui est un fait lisible dans la structure. Le trou que l'épreuve avait révélé n'existe pas chez lui. C'est le critère d'admission de `#027` — *décidable sans contexte* — appliqué à l'espacement, et j'avais construit exactement ce qu'il interdit.

**Un écran peut être conforme à 100 % et moins bon qu'avant.** C'est le résultat le plus dur du thread, et il tient à l'épreuve corrigée décrite plus bas. Le vérificateur contrôlait que chaque valeur venait de la liste ; il ne contrôlait pas que **le bon rôle** avait été employé. Le vert disait « rien n'a été inventé », il ne disait pas « c'est bien réglé », et je présentais l'un pour l'autre. C'est la faute que `#020` nomme : un dispositif qui surestime ses propres garanties. Le vérificateur a donc **changé de nature** (voir *Conséquences*).

**Deux épreuves à l'aveugle, dont la première ne vaut rien — et c'est l'Auteur qui l'a établi.** Première épreuve : même commande donnée deux fois à une session vierge, avec et sans le fichier de règles. Résultat brut **0 faute contre 33**. L'Auteur l'invalide sur deux motifs, dont le second n'avait pas été vu : *(a)* l'écran équipé était trop nu pour être montré à un client ; *(b)* surtout, **les deux écrans ne portaient pas la même structure d'information** — « Date de naissance » suivi d'une valeur est une paire étiquette-donnée, donc un écart à régler ; « Née le 12 mars 1985 » est une phrase, donc aucun écart. La géométrie n'avait pas le même travail à faire des deux côtés. Le chiffre reste vrai ; il ne démontre pas ce qu'on lui faisait dire. **Ce cas exact est déjà consigné dans `claude/or-du-thread-histoire.md` §3 comme la fixture qui ouvrira S6** : l'Auteur n'a pas relevé un biais de protocole, il a reconnu un cas qu'il avait lui-même nommé.

**La seconde épreuve, correctement montée, a fait échouer le kit — et c'est ce qui l'a sauvé.** Protocole corrigé : **un seul écran**, celui que l'Auteur accepterait de montrer, réespacé avec les règles. Identité vérifiée mécaniquement — 86 balises, 36 textes, 21 couleurs, 11 déclarations de police, identiques des deux côtés ; **40 nombres** changés, rien d'autre. Verdict du vérificateur : vert. Verdict de l'œil : les sections ne se séparaient plus, les cartes respiraient moins, la hiérarchie s'était aplatie. L'épreuve n'a **pas** été rejouée jusqu'à obtenir un résultat flatteur : c'eût été ajuster le critère après avoir vu la sortie, la faute nommée depuis `#002`.

**Une alarme a été levée puis retirée, et le retrait vaut d'être écrit.** Sur le modèle reconstruit, j'avais annoncé une contradiction interne au corpus : *« le diviseur du kit vaut 2, le facteur de proximité de S3-R3.7 vaut 3, un écran conforme à la table des régimes est donc en faute au regard de R3.7 »*. Elle reposait **entièrement sur le sens que j'avais prêté au mot diviseur**. Chez l'Auteur, le ratio est un intervalle entre profondeurs — un autre objet que celui que R3.7 gouverne. **L'alarme est retirée. Le facteur 3 de `#018` n'est pas remis en cause.** Une alarme fausse sur un corpus verrouillé coûte plus cher qu'un silence : elle appelle une réouverture qui n'a pas lieu d'être.

**Alternatives écartées** — *Garder mon modèle au motif qu'il reproduisait toutes les valeurs prouvées* (il les reproduisait, et il posait une autre question ; reproduire les sorties d'un système n'est pas en tenir la logique — c'est exactement le piège de la v1 que `#004` a nommé, une règle écrite avant sa référence) ; *fusionner les deux modèles, garder les rôles pour le vertical et les profondeurs pour l'emboîtement* (deux vocabulaires pour une seule mécanique, et l'IA aurait eu à choisir lequel s'applique — on aurait réintroduit le jugement qu'on venait de supprimer) ; *demander à l'Auteur d'arbitrer entre les deux au lieu de trancher pour le sien* (il a tranché, et l'arbitrage n'était pas symétrique : son modèle est plus complet, responsive, et il supprime un choix — le mien n'apportait rien qu'il n'ait déjà) ; *rejouer l'épreuve corrigée jusqu'à un résultat présentable* (`#002`) ; *taire l'échec de l'épreuve corrigée et livrer le kit sur le résultat de la première* (une épreuve invalide présentée comme preuve, sur un thread dont l'objet est précisément la prévention de la négligence) ; *garder l'alarme R3.7 « au cas où »* (une alarme dont on ne peut plus dire sur quoi elle porte est un bruit qui use le crédit des vraies) ; *écrire le fichier de règles sans les décisions déjà tranchées du registre* (l'exception du parcours plein écran, la rupture déclarée, la règle du drapeau existaient déjà dans `or-du-thread-histoire.md` §5 et §7 ; les omettre aurait fait du fichier une camisole, et c'est ce que le premier passage KYB a déjà payé).

**Conséquences** — **Le kit existe, et il est prouvé contre la source.** Cinq pièces : le moteur de dérivation ; la page « réglez et téléchargez » ; les trois fichiers générés (`tokens.css`, `tailwind.fili.js`, `fili.tokens.json`) ; le fichier de règles `regles.md` ; l'écran de référence `exemple.html`, qui n'écrit aucun nombre et passe les sept règles du vérificateur.

**Le crash-test de conformité — 24 assertions, toutes vertes.** L'étalon n'est pas une opinion : le générateur de l'Auteur est **ouvert dans un navigateur et ses valeurs sont lues**, puis comparées à la sortie du moteur. Socle exact aux réglages par défaut ; rythme responsive à 320, 480, 768, 1024 et 1440 px, 22 jetons à chaque largeur — **110 comparaisons, écart maximal 0,00008 px** ; un second jeu de réglages pour ne pas prouver seulement le cas par défaut ; refus de statuer hors plage plutôt que valeur bricolée.

**Un prix déclaré, mesuré et non supposé.** Le générateur adoucit sa courbe en JavaScript ; le CSS ne sait qu'interpoler droit. L'écart a été mesuré tous les 10 px sur toute la plage : **0,924 px au maximum**, sur la marge de coque autour de 560 px. Sous le pixel, mais réel, et écrit plutôt que tu.

**Le vérificateur a changé de nature.** Il ne compare plus des nombres à une liste — il vérifie qu'**il n'y a pas de nombre** : toute valeur d'espace, de taille ou de rayon doit être un `var(--…)`. Sept règles, lecture de code seule (S3 §2). Tolérés en dur : 0, 1 px, 2 px, 100 %, auto, 9999 px, 50 %. **Une règle nouvelle est rendue possible par le modèle de l'Auteur : G7 — les deux axes ne se mélangent pas**, un jeton horizontal posé sur une propriété verticale étant désormais une faute détectable, ce qui était impossible avec un axe unique. Capacité à échouer prouvée sur fixture piégée : 16 fautes, dont les deux mélanges d'axes.

**Ce que le kit ne fait pas, et qui est l'autre moitié de l'étage 1** — les **composants typés**. Le fichier de règles *demande* à l'IA de bien faire ; un composant ne lui laisse rien à choisir. Le brief les mettait en « éventuellement » ; l'épreuve corrigée a montré que c'est là que se joue le résultat. La charge est nommée, elle n'est pas construite, et elle relève de S1 et de K5 — pas de ce thread.

**Trois trous nommés par les épreuves, aucun improvisé** — l'écart horizontal entre deux contrôles côte à côte (résolu par les deux axes de l'Auteur), le cas du badge (ni contrôle ni composant), la largeur maximale d'une page. Ils partent au registre comme questions, pas comme réponses.

**Deux dettes** — *(1)* la moitié **ChatGPT** de l'épreuve n'a pas été jouée, faute d'accès ; le protocole se rejoue tel quel. *(2)* **Le code du kit ne vit dans aucun dépôt.** Il a déjà été perdu une fois pendant ce thread — l'environnement d'exécution a été réinitialisé et le dossier de travail effacé ; seules les pièces déjà livrées ont survécu. C'est le §6 de `or-du-thread-histoire.md` appliqué au kit lui-même : la mémoire vit dans le dépôt du projet cible, et celui-ci n'y est pas encore.

**Impact carte** — Ajout de la section **3.7 — Le kit de création**. Ajout à la documentation vivante de `claude/brief-kit-creation.md`, `claude/cadrage-kit-creation.md`, `claude/kit-creation-derivation.md`, `claude/kit-creation-resultat.md` et `claude/or-du-thread-histoire.md`. **Aucun contrat n'est rouvert ; aucune assertion n'est ajoutée ; le corpus reste à 29.** L'alarme portée contre R3.7 est **retirée** : le facteur 3 de `#018` reste tel quel. L'étage 1 de la prévention passe ⚪ → 🟡 : **une moitié construite et prouvée (la géométrie dérivée), une moitié nommée et non construite (les composants typés)**. La carte est par ailleurs remise à jour : elle était restée à `#048` depuis l'incident de `#049`.

---

## #089 — Le squelette devient une règle : une section qui attend attend en entier, et le corpus a eu le dernier mot sur la forme
*2026-08-08 · Statut : 🟢 Verrouillé · R2.7 · le Gardien porte 30 assertions*

> **Note de reprise (2026-08-13)** — Entrée écrite le 2026-08-08 dans
> `claude/regle-squelette-b6-2026-08-08.md`, versée au journal du projet le
> 13 août sous le numéro **`#060`**, reprise ici en exécution de `#051` et
> `#057`. Texte d'origine inchangé ; les renvois `#0NN` du texte suivent la
> numérotation du projet.

**Contexte** — Point de passage B-6, refusé à la séance du 2026-08-07 :
*« les titres et les textes ne sont pas traités en squelette comme le reste »*.
Le rangement l'avait classé en réouverture de règle plutôt qu'en correction de
valeurs : corriger l'écran de chargement de É1 seul n'aurait rien dit de É2 à
É7. Trois énoncés de sévérité différente ont été soumis à l'Auteur, avec ce que
chacun laisse passer et ce qu'il bloque à tort. Il a tranché le deuxième.

**Décision** — **Une section qui attend ses données attend en entier : son titre
et la phrase posée sous lui deviennent gris avec le reste.** Le haut de page
reste écrit — il n'attend rien. La règle ne juge que le chargement ; elle se
contrôle sur le fichier ; elle se déclare avec un motif quand un écran doit en
sortir. Elle entre au contrat des états sous le numéro R2.7. Douze sections des
sept écrans y sont repassées ; le rendu nominal ne change pas.

**Sens produit / UX** — Trois choses.

**Le défaut n'était pas qu'il manquait du gris, c'est qu'il en manquait à côté
du gris.** Un écran à moitié lu et à moitié gris ne promet pas une page qui
arrive : il en promet une autre. Le titre écrit dit « voilà ce que vous allez
lire » pendant que le bloc gris dit « je ne sais pas encore ». Les deux ne
peuvent pas être vrais en même temps, et c'est ce désaccord que l'œil attrape
avant de savoir le nommer.

**La règle a rencontré une règle déjà verrouillée, et c'est la seconde qui a dit
comment la première s'écrit.** Descendre le titre dans le conteneur voulait
d'abord dire l'emballer avec le contenu dans un groupe. R3.7 refuse un groupe
dont l'écart intérieur n'est pas trois fois plus serré que l'écart extérieur :
l'emballage aurait forcé à écarter les blocs de 32 à 48 pixels sur les sept
écrans — un changement d'espacement que personne n'avait demandé, deux jours
après un arbitrage sur les espaces. La forme retenue ne pose aucun groupe
nouveau et ne déplace aucun pixel. **Une règle neuve qui déplace ce qu'une règle
ancienne a fixé n'est pas une règle neuve : c'est une régression déguisée.**

**Une seule chose parle encore pendant l'attente, et elle est signée.** Le
compte qui avance sur É1 — « 47 épreuves sur 80 » — sort de la règle avec son
motif écrit dans le code : il ne décrit pas le contenu à venir, il décrit
l'attente elle-même. C'était annoncé comme le coût de cette version avant que
l'Auteur tranche, et c'est le seul. **Un coût annoncé avant l'arbitrage et
retrouvé après n'est pas une dette : c'est une prévision tenue.**

---

## #088 — L'arbitrage de lecture de É1 déclaré par K2 tombe, et le déplacement qui l'applique invente du contenu que personne n'a demandé
*2026-08-08 · Statut : 🟢 Appliqué · La primauté de É1 est réécrite · Une faute de conception assistée est nommée*

> **Note de reprise (2026-08-13)** — Entrée écrite le 2026-08-08 dans
> `claude/suite-temoin-e1-2026-08-08.md` §5, versée au journal du projet le
> 13 août sous le numéro **`#059`**, reprise ici en exécution de `#051` et
> `#057`. Texte d'origine inchangé ; les renvois `#0NN` du texte suivent la
> numérotation du projet.

**Contexte** — K2 §5 déclarait que ce qui compte d'abord sur É1 est l'intégrité
du juge, avant le verdict lui-même — un juge désarmé qui affiche vert étant la
panne de #020. Le protocole avait écrit que chacune des sept propositions
d'arbitrage de lecture pouvait tomber. Au B-1 de la séance du 7 août, l'Auteur a
prononcé non : *« j'aurais mis le résultat en premier. Le besoin immédiat, ce
n'est pas ce qui a été fait, mais si ça marche ou pas et dans quelles
proportions. »*

**Décision** — **La primauté de É1 devient le résultat de la batterie.** Le bloc
du résultat est le premier bloc et porte la marque de tête ; l'intégrité du juge
vient immédiatement après. **Le résultat n'a pas de titre à lui : le grand titre
de la page est son titre.** La respiration suit le B-9 : seule la section du
résultat est ample, les trois autres alternent. Le titre de page, le chapeau et
la déclaration interne de primauté restent ceux du 7 août : ils seront dictés
par l'Auteur, et la contradiction qu'ils portent est laissée visible.

**Sens produit / UX** — Trois choses, et la deuxième n'était pas au programme.

**L'intégrité du juge ne disparaît pas, elle change de rôle.** Elle ne dit plus
ce qu'il faut vérifier avant de regarder ; elle dit ce que le résultat vaut. Un
résultat vert rendu par un juge amputé ne vaut toujours rien, et la page le
montre toujours — comme une garantie, plus comme un préalable. La panne de #020
reste couverte ; c'est l'ordre de lecture qui change, pas la couverture.

**Un déplacement de hiérarchie n'est jamais un geste sans contenu, et la session
qui l'a exécuté l'a prouvé en inventant.** La première version a créé un
quatrième titre de section, réécrit deux phrases d'écran et une phrase de
doctrine, et modifié une valeur d'espacement — sans qu'on lui demande une ligne
de contenu. **Le mécanisme est identifiable et il se répétera : sortir un bloc
d'une section, c'est lui retirer ce qui le titrait ; le trou s'ouvre, et la
machine le bouche au lieu de le montrer.** L'Auteur l'a vu au rythme des titres,
en un regard : trois titres de section avant, quatre après. La réparation a
consisté à retirer l'invention, à remettre les phrases d'origine, et à faire
arbitrer chaque trou plutôt qu'à le remplir. **Ce que Fili doit produire n'est
pas seulement un garde-fou sur le code écrit : c'est un garde-fou sur le contenu
qui apparaît sans avoir été demandé.**

**Le ricochet attendu sur le B-8 n'a pas eu lieu.** Le rangement de la séance
pariait que remonter le résultat rapprocherait le bouton du bas. Mesure en
320 × 568 après correction : il est toujours à la troisième page, très
légèrement plus bas. La tête est ample, et le bloc du résultat y a gagné de
l'air. Le B-8 se remesurera à la génération suivante et il sera toujours
mauvais. **Un rangement de défauts est une hypothèse sur les causes ; celle-ci
était fausse, et elle est consignée fausse plutôt que corrigée en silence.**

---

## #087 — La première séance du protocole se tient, É1 est refusé, et la découverte n'est pas dans le verdict : la typographie du produit ne s'affichait nulle part
*2026-08-07 · Statut : 🔴 Témoin refusé · La lignée É1 n'a pas de référence*

> **Note de reprise (2026-08-13)** — Entrée écrite le 2026-08-08 dans
> `claude/suite-temoin-e1-2026-08-08.md` §5, versée au journal du projet le
> 13 août sous le numéro **`#058`**, reprise ici en exécution de `#051` et
> `#057`. Texte d'origine inchangé ; les renvois `#0NN` du texte suivent la
> numérotation du projet. C'est la première des huit reprises : la
> correspondance complète est en tête de fichier.

**Contexte** — Première séance jamais exécutée du protocole de référence, après
son gel définitif et après l'annulation du même jour. Le contrôle d'admission a
été pris sur pièce et non sur attestation : batterie relancée à 29 assertions
sur 29 et verdict à 100 %, chaîne de rendu relancée et les cinq fichiers
comparés par empreinte avant et après — identiques au bit près, cinq états
rendus. Huit points de passage sur neuf portés ; B-2 déclaré sans objet parce
que la primauté de É1 était hors du froid depuis le cadrage de la séance
annulée.

**Décision** — **Le témoin n'est pas accepté : il ne devient pas la référence de
son gabarit.** Un point tenu sur huit — la matière du système, au B-4. Sept
refusés : pas d'auteur (B-3), contenu utile hors d'atteinte (B-8), états
bouche-trous (B-7), squelette qui n'annonce pas (B-6), mauvais ordre de lecture
(B-1), espaces mal répartis (B-9), mots qui ne sont pas ceux de l'Auteur (B-5).

**Sens produit / UX** — Trois choses, et la plus lourde n'était pas au programme.

**La typographie du produit ne s'affichait nulle part, et rien ne le disait.**
Les fichiers de police embarqués déclarent *Geist Variable*, *Inter Variable*,
*JetBrains Mono Variable* ; le registre d'expression réclamait *Geist*, *Inter*,
*JetBrains Mono*. Le navigateur ne rapproche pas : il retombe en silence sur la
police système. Aucune erreur, aucun écart au Gardien, aucun symptôme — sinon un
produit entier, ses dix-sept témoins et la planche des registres elle-même
affichés dans une police qui n'est pas la sienne, depuis le premier jour. **Ce
n'est pas un défaut du témoin, c'est un défaut du produit** : le témoin montrait
fidèlement ce que l'application montrait, et c'est la condition 2 d'admission qui
tient. Le B-4 a donc été prononcé sur une planche qui ne montrait pas la vraie
matière ; ce oui reste écrit, il ne se corrige pas, et il devra être reposé.

**La correction a trouvé une seconde pièce cassée dans la même chaîne.** Un
témoin porte sa feuille de style à l'intérieur de lui, mais une feuille de style
ne peut que désigner un fichier de police, jamais le porter — et personne
n'avait déposé ces fichiers à côté des témoins. Le bon nom seul n'aurait rien
changé pour eux. Les fichiers sont maintenant déposés une fois à la racine des
témoins, 444 Ko, et chaque témoin les désigne par son chemin de retour. Une
lignée déplacée sans ce dossier reperd sa police : c'est le prix arrêté contre
celui de recoudre la police dans chacun des fichiers, à chaque génération.

**Le contrôle sur pièce vaut mieux que l'attestation, et c'est lui qui a trouvé
le reste.** Il a coûté trois commandes. Il a permis d'affirmer sans croire
personne sur parole que rien n'avait été retouché à la main — et c'est le même
réflexe, appliqué aux polices, qui a mis au jour le défaut le plus large du
chapitre.

---


## #086 — Troisième sortie : non concluant, et c'est le résultat le plus utile des trois

*2026-08-12 · Statut : 🟡 Non concluant, par le sort déclaré d'avance · Le tri du corpus était faux*

**Contexte** — Troisième épreuve, troisième outil : un écran produit par GPT,
servi en local. Même demande, même liste figée, même seuil.

**Verdict : non concluant.** C'est le troisième sort écrit avant l'épreuve 1 —
*« moins de trois contrôles parlent, et c'est une réponse aussi »*. Un seul des
treize a eu quelque chose à dire. **Avoir écrit ce sort d'avance est ce qui permet
aujourd'hui de l'appeler un résultat et non un échec.**

**Pourquoi ils se sont tus** — L'écran ne contient aucune classe utilitaire. Il est
écrit en CSS ordinaire, avec trente et un noms de classes qui décrivent des rôles.
Nos douze contrôles muets lisent tous des classes utilitaires.

**Ce que ça dit, et ça touche la définition du projet** — **Notre cadre n'est pas
un cadre de design, c'est un cadre Tailwind.** Les treize contrôles qu'on avait
rangés du côté « juge n'importe quel code » jugent en réalité *une façon d'écrire
du code*. Ce n'est pas une faiblesse d'implémentation : **le tri fait avant
l'épreuve 1 était faux**, et il a fallu trois épreuves pour s'en apercevoir. La
règle tient ; l'instrument regarde au mauvais endroit.

**Le relevé à la main, hors corpus et déclaré comme tel** — Sur la couleur, c'est
**le meilleur des trois** : sept teintes choisies, déclarées une fois, nommées par
leur rôle, aucune palette de librairie. C'est notre propre doctrine, écrite par
quelqu'un d'autre. Sur le rythme, c'est **le pire des trois** : trente-huit valeurs
d'espacement, soixante-huit déclarations, **pas une seule qui passe par une
variable**. Sur la typographie, douze tailles là où nous en admettons six, dont du
neuf et du dix — sous cette taille, un texte en capitales espacées n'est plus lu,
il est deviné.

**Et il faut l'écrire, même si ça dérange : c'est le plus beau des trois.** Titre
éditorial en deux temps, palette crème, bandeau de chiffres sans une seule surface,
respiration large. **Le plus beau des trois est celui que notre cadre ne sait pas
juger, et le seul qui ait une vraie palette est celui dont le rythme est le plus
désordonné.** Ces deux phrases valent tout le reste de la journée : elles disent où
le cadre sert, et où il ne dit rien de ce qui compte.

**Alternatives écartées** — *Rouvrir le tri pour reclasser les contrôles muets*
(la liste est figée depuis l'épreuve 1 ; la rouvrir en cours de série annule les
trois mesures — le tri se corrigera, après, par une décision datée) ; *compter le
relevé à la main dans le verdict* (il n'est pas passé par le corpus, il n'a pas la
même valeur de preuve) ; *conclure que GPT est « le meilleur »* (il est le plus
beau et le plus désordonné, et ces deux choses sont vraies ensemble).

**Impact carte** — Trois épreuves de sortie faites : deux succès, un non concluant.
**Charge majeure ouverte** : le corpus ne sait lire qu'une seule façon d'écrire du
style. Tant que c'est vrai, « ce cadre juge n'importe quel code » est une phrase
fausse, et elle était écrite dans le tri du 12 août.

---

## #085 — Deuxième sortie : quand l'IA a déjà un cadre, elle le tient — sauf pour dire un sens

*2026-08-12 · Statut : 🟢 Épreuve 2 passée · Le résultat le plus utile depuis l'ouverture du chantier*

**Contexte** — L'épreuve 1 avait mesuré une IA sans rien : Gemini, aucune règle,
aucune bibliothèque. L'épreuve 2 mesure l'inverse : **Figma Make**, qui travaille
avec un système de jetons. Même demande banale, **et surtout la même liste de
contrôles et le même seuil, figés avant l'épreuve 1 et non retouchés**. C'est ce
qui rend les deux mesures comparables ; les rouvrir aurait annulé les deux.

**Résultat brut** — Sept contrôles sur treize trouvent du réel, deux refus
injustes. Succès au même seuil. Mais le score n'est pas le résultat.

**Le résultat, c'est la comparaison.** Le nombre de refus de fond passe de **240 à
96**. Figma Make écrit **soixante-dix-huit couleurs sémantiques** — il ne nomme
presque jamais une couleur, il nomme un **rôle**. Un outil doté d'un système de
jetons produit trois fois moins de désordre, sans qu'on lui ait rien demandé.
**C'est un fait qui touche la raison d'être du projet** : la bouillie visuelle
n'est pas une fatalité de l'IA, c'est une conséquence de l'absence de cadre — et
le marché est en train de combler ce vide tout seul.

**Et voici ce qui reste, et c'est exactement notre place.** Les dix-sept couleurs
en clair qui subsistent sont **toutes** aux deux mêmes endroits : le jeton de
statut et le jeton de priorité. Partout ailleurs le rôle suffit ; **dès qu'il faut
dire un sens, l'outil retombe sur le bleu, l'ambre, le vert, le rouge**. Or c'est
précisément la pièce que Fili porte : un état s'emploie par couple déclaré, et le
sens ne se lit jamais à la couleur seule. Le meilleur outil du marché n'a pas
cette pièce. **Si le projet doit se resserrer sur une chose, c'est celle-là.**

**Un aveuglement découvert au passage** — `bg-card` et `text-foreground` ne
viennent pas de notre palette et **notre contrôle ne les voit pas** : il ne connaît
que les familles livrées par défaut avec l'outil. Chez nous ces classes ne
compileraient pas — la porte est fermée — mais aucun message ne nommerait la
faute. Un écran écrit dans un autre vocabulaire de jetons traverserait le contrôle
en silence. Charge ouverte, non corrigée : on ne corrige pas pendant une mesure.

**Ce qui n'a pas bougé** — Soixante-dix-huit espacements hors échelle, trente-trois
valeurs différentes. Aucun outil du marché n'a d'échelle nommée. La conclusion de
`#084` tient sans une virgule de moins : **sans outil de traduction, le cadre reste
inadoptable sur du code existant**.

**La faute la plus grave des deux épreuves** — Un bloc non interactif qui porte un
clic : invisible au clavier, muet au lecteur d'écran. Trouvée chez l'outil le plus
soigné des deux. Hors liste figée, donc signalée et non comptée.

**Alternatives écartées** — *Rouvrir la liste des contrôles pour tenir compte des
jetons sémantiques* (elle est figée depuis l'épreuve 1 ; la rouvrir en cours de
série annule les deux mesures) ; *conclure que Figma Make est « meilleur »* (on a
mesuré la conformité à notre cadre, pas la qualité perçue — le troisième chiffre,
celui de l'œil, manque toujours) ; *corriger l'aveuglement du contrôle de couleur
dans la foulée* (corriger pendant une mesure, c'est mesurer autre chose).

**Impact carte** — Deux épreuves de sortie faites, deux succès au seuil déclaré.
Une charge nouvelle : le contrôle de couleur est aveugle aux vocabulaires de jetons
étrangers. **Et une orientation produit, qui n'est pas une décision et attend
l'Auteur** : ce que le marché ne fait pas, c'est le sens — l'état, la priorité, ce
qui ne se lit pas à la couleur seule.

---

## #084 — Première sortie : le cadre tient sur du code étranger, et ce n'est pas ce qu'on croyait qui a trouvé

*2026-08-12 · Statut : 🟢 Épreuve 1 passée, deux enseignements qui dérangent*

**Contexte** — Le kit n'avait jamais rien jugé d'autre que du code écrit par ceux
qui connaissent ses règles. La mesure de la veille avait une faiblesse assumée :
les fautes avaient été posées par quelqu'un qui savait lesquelles étaient
attrapables. Première épreuve de sortie : un écran de tableau de bord produit par
**Gemini**, à partir d'une demande volontairement banale, sans aucune consigne de
rigueur — *fais quelque chose de propre et de moderne*.

**Méthode, et c'est elle qui compte** — Avant de regarder le code, deux choses ont
été **écrites et enregistrées** : le tri du corpus en deux — treize contrôles qui
peuvent juger n'importe quel code, neuf qui supposent nos propres pièces et n'ont
pas le droit de parler — et les trois chiffres qu'on allait compter avec leur
seuil de succès. Sans ce gel préalable, on aurait choisi après coup les contrôles
qui donnent le bon résultat. **La discipline de mesure est la mesure.**

**Résultat** — Huit contrôles sur treize ont parlé, sept à raison. Deux refus
injustes. Verdict : **succès**, au seuil déclaré.

**Premier enseignement, et il dérange** — **Ce qui a trouvé n'est pas ce qu'on
croyait.** Les contrôles historiques du projet, ceux qui existent depuis l'origine
et sur lesquels reposait toute la promesse — la couleur écrite en dur, la durée en
dur, le style posé sur l'élément — **n'ont rien trouvé du tout**. Gemini n'écrit
aucune de ces fautes ; il est plus discipliné que l'écran de bouillie qu'on avait
simulé la veille. Ce qui a trouvé, c'est la fermeture de la palette et l'échelle
d'espacement, branchées l'une hier soir et l'autre cette semaine. **Le cadre a
attrapé du réel avec ses deux pièces les plus jeunes, et rien avec ses plus
vieilles.** Il faut le dire ainsi : une partie du corpus se bat contre une bouillie
qui n'existe plus.

**Second enseignement** — Deux cent quarante refus sur un seul écran. Ce n'est pas
deux cent quarante décisions : c'est **deux** — adopter la palette, adopter
l'échelle. Le reste est de la traduction mécanique. Mais tant que l'outil qui
traduit n'existe pas, **le cadre est un mur pour quiconque arrive avec du code
existant**, et la justesse de ses refus n'y change rien. C'est la première fois
qu'on voit la différence entre *avoir raison* et *être adoptable*.

**Un refus injuste qui nomme une vraie faute de règle** — « Rien ne tourne dans le
vide » a été écrite contre le rond qui tourne pendant une attente. Elle refuse ici
l'animation d'ouverture d'une fenêtre modale, qui n'est pas la même chose. **La
règle est trop large d'un cran** : elle parle du mouvement en général là où elle
voulait parler de l'attente. Constaté, non corrigé — on ne corrige pas pendant une
mesure.

**Deux trouvailles hors liste, signalées et non comptées** — Quatre classes
d'espacement construites par concaténation, et un saut de titre du niveau 1 au
niveau 3. Toutes deux réelles. Elles n'étaient pas dans la liste figée : les
compter aurait été élargir le périmètre après avoir vu le résultat.

**Alternatives écartées** — *Compter les messages plutôt que les contrôles* (deux
cent quarante messages pour deux décisions : le chiffre flatterait autant qu'il
tromperait) ; *retirer les deux refus injustes du décompte parce qu'ils
s'expliquent* (un refus qui s'explique reste un refus subi par celui qui écrit) ;
*corriger la règle du mouvement dans la foulée* (corriger pendant la mesure, c'est
mesurer autre chose).

**Impact carte** — Le kit a jugé du code qu'il n'a pas écrit, pour la première
fois. Deux charges nouvelles : la règle du mouvement trop large d'un cran, et
l'absence d'un outil de traduction sans lequel le cadre n'est pas adoptable sur du
code existant.

---

## #083 — Les quatre gestes sont gardés, et le test qui prouvait la batterie ne prouvait plus rien

*2026-08-12 · Statut : 🟢 Quatre contrôles branchés, trois fautes réelles corrigées · Ferme les trous (2) à (5) de `#081`*

**Contexte** — `#082` a fermé le seul trou qui portait sur une valeur. Les quatre
restants portaient tous sur un **geste** : le rond qui tourne, l'icône répétée, le
texte suivi hors d'une pile, l'absence d'états. Tous les quatre étaient **écrits
au fichier de règles et gardés nulle part**. C'est le motif constant de la
semaine, et il finit par être le vrai enseignement : *une règle écrite n'est pas
une règle tenue.*

**Ce qui a été branché** — *Rien ne tourne dans le vide.* Une seule animation est
admise, la respiration du squelette ; tout autre mouvement livré par l'outil est
refusé sans avoir à être nommé, et la feuille de style est lue en plus pour le
mouvement écrit à la main. *Pas de signal sur ce qui se répète.* Un jeton écrit
dans une boucle doit déclarer qu'il se répète — c'est la répétition qui se prouve,
pas celle qui se devine. *Pas de texte suivi hors d'une pile.* Le contrôle de la
veille jugeait le niveau d'une pile qui distribue du texte et ne voyait rien quand
il n'y avait pas de pile ; les deux se complètent — l'un dit « pas trop serré »,
l'autre « pas au hasard ». *Une seule porte pour ce qui vient d'ailleurs.*

**Le cinquième trou n'était pas celui qu'on croyait.** L'écran d'essai n'exposait
aucun état, et le corpus n'a rien dit — **à juste titre** : il se déclenche sur la
lecture d'une donnée distante, et l'écran inventait la sienne sur place. Le vrai
risque n'est pas la page qui fait semblant, c'est celle qui va chercher sa donnée
**par la fenêtre** : un appel réseau écrit à la main contourne le crochet, donc le
conteneur, donc les quatre états, et il ne reste que le cas heureux. La fenêtre est
fermée ; la porte a deux faces, toutes deux nommées.

**Trois fautes réelles, trouvées du premier coup.** Trois jetons produits par une
boucle ne déclaraient pas qu'ils se répétaient — dans l'acte, dans la famille,
dans le verdict. La même icône s'affichait donc sur chaque ligne de trois listes,
exactement ce que la règle du 11 août interdit. Corrigées.

**Et le test qui prouve la batterie ne prouvait plus rien.** Le test de mutation
injecte un défaut et exige que la batterie rougisse ; sa cible était écrite en dur
— un fichier, une balise — et la coquille du produit a changé de forme depuis. Il
échouait donc à chaque appel en disant qu'il ne pouvait pas injecter, **et
personne ne l'appelait**. Il choisit désormais sa cible dans le périmètre réel.
C'est la faute la plus grave de la journée : pendant un temps qu'on ne sait pas
mesurer, **le garde-fou du garde-fou était mort**, et la carte comptait quarante-six
sabotages sur quarante-six.

**Sens produit / UX** — Le cadre passe des valeurs aux gestes. Un rond qui tourne,
une icône de trop sur vingt lignes, deux paragraphes sans écart déclaré : aucun de
ces trois-là n'est une faute qu'on voit en relisant du code. Ils se voient à
l'écran, tard, chez quelqu'un d'autre. **Ce sont exactement les défauts qu'une
relecture humaine laisse passer et qu'une machine attrape** — l'inverse de ce
qu'on attend d'elle d'habitude.

**Alternatives écartées** — *Refuser le rond par liste noire* (il faudrait
énumérer tous les mouvements de l'outil et ceux à venir ; une liste blanche d'une
seule entrée les couvre tous) ; *deviner la répétition en comptant les jetons
voisins* (trois jetons écrits à la main se voient à la relecture, une boucle
jamais — on garde ce qui échappe à l'œil, on laisse ce qui lui saute dessus) ;
*déplacer l'amorçage dans la couche de données* (c'est du code applicatif, il
n'est pas demandé — la face est nommée, la dette est écrite) ; *fusionner les deux
contrôles du texte suivi* (l'un juge un niveau, l'autre une absence ; fusionnés,
le message ne dirait plus quoi corriger).

**Remesuré le soir même** — Le même exercice, refait avec une faute de plus (la
donnée cherchée par la fenêtre) : **dix-huit fautes sur dix-neuf attrapées**,
contre treize sur dix-huit la veille. La seule qui passe encore est l'angle mort
déclaré — trois signaux identiques recopiés à la main. **Effet de bord non
prévu** : depuis que la palette remplace au lieu d'ajouter, une couleur étrangère
est refusée par deux instruments indépendants au lieu d'un. Fermer une porte
proprement fait plus de travail que poser un contrôle.

**Impact carte** — Corpus S2 : **seize assertions actives**. Trous de `#081` :
**les cinq sont fermés**. Deux dettes nouvelles : l'amorçage qui lit hors de la
couche de données, et le décompte des sabotages de la carte, invalidé tant qu'il
n'est pas remesuré.

---

## #082 — Le trou le plus large est fermé à la source : la palette remplace au lieu d'ajouter

*2026-08-12 · Statut : 🟢 Fermé, gardé, saboté · Ferme le trou (1) de `#081`*

**Contexte** — La mesure de la veille au soir a nommé cinq trous, dans l'ordre de
leur coût. Le premier était le plus large : **une couleur hors palette passait si
elle avait un nom**. Écrire un code hexadécimal était refusé depuis l'origine ;
écrire « bleu 600 » traversait la batterie entière sans un mot.

**La cause n'était pas dans les contrôles, elle était dans la configuration.** La
palette calculée était déclarée en **addition** — sous `extend` — et non en
**remplacement**. Les deux cent quarante-deux couleurs livrées par défaut avec
l'outil restaient donc écrivables à côté des nôtres. Autrement dit : ce que nous
appelions « la palette du système » n'était pas une palette, c'était un ajout de
dix-sept couleurs à deux cent quarante-deux autres. Le travail de calcul depuis
une seule teinte était réel, et il ne fermait rien.

**Décision — on ferme d'abord la porte, on met la sonnette ensuite.** La palette
passe au niveau du thème : elle remplace. `bg-blue-600` **ne compile plus**. Puis
une treizième assertion garde la fermeture, parce qu'une classe qui ne compile
plus est silencieuse : celui qui l'écrit ne voit rien, son écran est simplement
faux. Le contrôle nomme la faute en français.

**Deux mesures dans une seule assertion, et c'est voulu.** La première lit la
configuration et exige que la palette soit déclarée hors de `extend` — c'est la
garantie d'exhaustivité, elle vaut pour toute couleur, y compris celles qu'on
n'a pas listées. La seconde lit les fichiers et refuse le nom d'une famille
livrée par défaut — c'est la garantie de lisibilité, elle donne le fichier, la
ligne et le motif. **Angle mort déclaré** : la seconde ne connaît qu'une liste de
familles ; un nom inventé hors liste lui échappe — mais il ne compile pas non
plus, la première s'en charge. Les deux se tiennent, aucune ne suffit seule.

**Sabotée deux fois, elle a dit non deux fois.** Une couleur nommée posée dans un
composant : refusée, avec la ligne. La palette remise en addition dans la
configuration : refusée, avec le motif. Sans ces deux sabotages, on aurait cru le
produit sain — c'est exactement ce qui s'est passé pendant des mois.

**Sens produit / UX** — Ce n'est pas une couleur de plus ou de moins : c'est la
différence entre **une palette et une préférence**. Une palette calculée depuis
une teinte tient ses contrastes par construction ; chaque couleur venue d'ailleurs
casse cette garantie sans prévenir, et le défaut se voit six mois plus tard sur un
écran mal éclairé. La règle écrite disait déjà « ❌ text-red-600 » ; **elle était
juste et personne ne la tenait**. C'est la troisième fois cette semaine qu'une
règle écrite et non gardée revient — le motif est constant.

**Alternatives écartées** — *Garder la liste noire seule* (elle ne connaît que ce
qu'on a pensé à y mettre : une palette fermée se prouve, elle ne s'énumère pas) ;
*fermer la porte sans mettre de contrôle* (la classe devient silencieuse, l'écran
est faux et personne n'est prévenu — un refus muet n'apprend rien) ; *tolérer le
blanc et le noir purs* (ils existent déjà à la palette sous leurs noms de fond et
d'encre ; deux façons d'écrire la même couleur, c'est la porte rouverte).

**Impact carte** — Palette : ⚪ ajoutée → 🟢 **fermée**. Corpus S2 : douze
assertions actives (T13 nouvelle). Trou (1) de `#081` : **fermé**. Restent quatre
trous, tous des gestes : le rond qui tourne, l'icône répétée, le texte suivi hors
d'une pile, l'absence d'états.

---

## #081 — La promesse est mesurée pour la première fois : treize fautes attrapées, cinq passées

*2026-08-12 · Statut : 🟢 Mesure faite, trous nommés*

**Contexte** — Le plan n'a plus de règle en attente : reste **la sortie**, seule
épreuve gardée, dont la question est celle du 11 août — *qu'est-ce que ce système
apporte ?* On ne peut pas y répondre depuis l'intérieur. La première manche
consiste donc à mesurer la promesse fondatrice : **un cadre assez strict pour que
la bouillie visuelle devienne impossible**.

**Méthode** — Un écran a été écrit **comme une IA sans le cadre le produirait** :
couleur en dur, style posé sur l'élément, espacements au jugé, valeur inventée
entre crochets, marges extérieures, balise interactive nue, taille de titre
surchargée, blocs anonymes, deux boutons collés, surface blanche sans contour,
trois jetons identiques avec icône, rond qui tourne, aucun état. **Quinze fautes
posées volontairement.** L'écran a été soumis au corpus complet — assertions,
règles de lecture, typage — puis retiré du dépôt.

**Résultat** — **Treize fautes attrapées, cinq passées.**

**Sens produit / UX** — **Le cadre tient sur les valeurs, pas encore sur les
gestes.** Tout ce qui est un nombre, une couleur écrite, une classe hors échelle
est vu — souvent deux fois, par deux instruments différents. Ce qui est un
*geste* passe : répéter une icône, faire tourner un rond, omettre les états. La
frontière n'est pas celle de la difficulté, c'est celle de la nature : une valeur
est dans le texte, un geste est dans l'intention.

**Il ne refuse pas, il explique.** Chaque message porte la règle **et son motif**,
en français : « un titre doit être grand parce qu'il est important, pas important
parce qu'il est grand » ; « l'espace se pose par le conteneur, jamais par l'enfant
qui pousse ses voisins ». C'est ce qui sépare un garde-fou d'un correcteur —
celui qui se fait bloquer apprend en même temps.

**Les deux contrôles écrits ce matin ont servi dans le test.** Les deux boutons
collés et la surface sans contour ont été attrapés par des assertions qui
n'existaient pas il y a six heures. Une règle écrite le matin a gardé un défaut
le soir même.

**Les cinq trous, nommés dans l'ordre de leur coût** — *(1) une couleur hors
palette passe si elle a un nom.* Écrire un code hexadécimal est refusé, écrire
« bleu 600 » passe. **C'est le trou le plus large** : il annule à lui seul le
travail d'une palette entièrement calculée depuis une seule teinte. *(2) Le rond
qui tourne*, interdit noir sur blanc au fichier de règles, n'est vérifié nulle
part. *(3) L'icône répétée*, règle du matin même, écrite et non gardée. *(4) Le
texte suivi hors d'une pile* — le contrôle d'hier ne regarde que les piles, un
bloc anonyme lui échappe : **angle mort déjà déclaré, désormais démontré**. *(5)
L'absence d'états*, qui relève d'un corpus non branché ici.

**Alternatives écartées** — *Mesurer sur un écran réel du produit* (il est écrit
par quelqu'un qui connaît le cadre : on mesurerait la discipline de l'auteur, pas
la force du cadre) ; *compter les erreurs plutôt que les fautes* (une faute unique
lève souvent deux à quatre messages ; compter les messages flatterait le
résultat) ; *garder l'écran d'essai au dépôt* (il rougirait à chaque contrôle et
finirait par être mis en exception — la meilleure façon de rendre un garde-fou
inoffensif).

**Impact carte** — Première mesure de la promesse. **Treize sur dix-huit.** Les
cinq manques sont écrits ici avec leur coût, dans l'ordre où il vaut la peine de
les fermer.

---

## #080 — Les trois contrôles qui restaient ne sont pas des assertions : ce sont des mesures

*2026-08-12 · Statut : 🟡 Mesuré, non gardé — décision d'architecture à prendre*

**Contexte** — Après avoir branché les deux premiers, il restait au plan trois
contrôles : pas plus de deux positions horizontales dans une carte, icônes et
jauges alignées entre cartes voisines, et zéro débordement horizontal à 390. Tous
trois ont été **exécutés pour de vrai** sur les trente témoins du produit, dans un
navigateur, à plusieurs largeurs.

**Résultat** — **Deux sont verts, le troisième se dérobe.**

*Le débordement horizontal :* **aucun**, ni à 320 ni à 390, sur les trente
témoins. Le contrôle passe.

*Les positions horizontales :* **aucune surface** du produit n'en porte plus de
deux. Le contrôle passe.

*L'alignement des icônes :* la mesure brute signale vingt-cinq écarts, et **aucun
n'est une faute**. Elle compare des icônes qui n'ont pas le même rôle — celle
d'une alerte fait vingt-deux points, celle d'un jeton seize, et l'écart de quatre
points qu'elle relève n'est que cette différence. Le contrôle ne peut pas se
faire : **il exige de savoir quelles icônes doivent se comparer**, et rien dans le
produit ne le déclare.

**Sens produit / UX** — **Ces trois-là n'appartiennent pas au Gardien, et c'est le
vrai résultat de la séance.** Les douze assertions du corpus lisent du texte : un
fichier, une classe, une déclaration. Ces trois-ci demandent de **regarder une
page rendue**. Ce ne sont pas des règles plus difficiles, ce sont des règles d'une
autre nature — et le Gardien, qui tourne sans dépendance avant même une
installation, n'a pas d'yeux.

**Un contrôle de rendu n'est pas une assertion de plus, c'est un second
instrument.** Il lui faut un navigateur, donc une dépendance lourde ; il ne peut
pas tourner avant l'installation ; il est plus lent d'un ordre de grandeur ; et il
mesure la production avec un outil qui appartient à la production — ce que la
doctrine du crash-test refuse depuis l'origine.

**La mesure d'aujourd'hui vaut pour aujourd'hui, et pour rien d'autre.** Trente
témoins, deux largeurs, zéro faute : c'est un état, pas une garantie. Personne ne
saura si le prochain écran déborde.

**Décision** — Aucune, et c'est délibéré. Le constat est écrit, les deux résultats
verts sont datés, le troisième contrôle est **déclaré infaisable en l'état** avec
son motif. **Le choix qui reste appartient à l'Auteur** : donner des yeux au dépôt
— un navigateur en dépendance de développement, un second instrument à côté du
Gardien — ou tenir ces trois-là comme un audit périodique, lancé à la main quand
on veut savoir.

**Alternatives écartées** — *Poser le contrôle d'alignement tel que mesuré*
(vingt-cinq faux positifs : c'est la faute nommée en `#078`, un garde-fou qu'on
apprend à ignorer) ; *approcher le débordement par une lecture statique*, en
interdisant les largeurs fixes supérieures au plancher d'écran (le produit n'en
emploie aucune : le contrôle serait vide, et il donnerait l'illusion de couvrir ce
qu'il ne regarde pas) ; *ajouter le navigateur sans le dire* (une dépendance de
cette taille est une décision d'architecture, pas un détail d'outillage).

**Impact carte** — Les cinq contrôles du plan sont soldés : un est mort avec sa
règle (`#073`), deux sont branchés au Gardien (`#077`, `#078`), deux sont mesurés
verts mais non gardés, et le cinquième est déclaré infaisable sans une déclaration
de rôle qui n'existe pas. **Le plan n'a plus de ligne ouverte avant la sortie.**

---

## #079 — Le texte long se composait deux crans trop serré, et personne ne l'avait lu

*2026-08-12 · Statut : 🟢 Verrouillé (faute relevée et corrigée)*

**Contexte** — L'Auteur observe qu'il aime les gabarits qui tiennent bien le blanc
« quand il y a pas mal de typographies, un article de blog par exemple », et
demande une recherche sur les mises en page **sans surface**. La recherche donne
une valeur que le corpus n'avait jamais confrontée à l'échelle : entre deux
paragraphes, il faut **entre une et une fois et demie la taille du corps**.

**Le composant de prose composait à 0,70.** Il employait le niveau « coque »
depuis son écriture. Rapporté au corps, l'écart entre deux paragraphes valait
entre 0,70 et 0,81 fois le corps selon la largeur d'écran — soit **un tiers de
moins que le plancher recommandé**. Le texte long du produit était un mur, et
aucun contrôle ne regardait de ce côté.

**Décision** — Le texte suivi se compose au niveau `page`, déclaré comme une
entrée du moteur. Le composant de prose est corrigé. Une règle et un contrôle
sont écrits.

**Sens produit / UX** — **Un seul niveau de l'échelle tombe dans la fourchette, et
c'est le résultat le plus intéressant.** Rapporté au corps, l'écart vaut 0,35 en
« détail », 0,50 en « carte », 0,70 en « coque », **0,99 à 1,15 en « page »**, et
1,41 à 1,63 en « large ». Le premier est un mur, le dernier disloque le propos en
blocs. Il n'y avait pas de réglage à inventer : il y avait un niveau à choisir, et
le système savait déjà le produire.

**L'écart d'un centième est déclaré, pas masqué.** Au plus étroit des écrans,
« page » vaut 0,994 fois le corps — un demi pour cent sous la borne. Le plancher
du moteur est posé à 0,98 et le motif est écrit. Arrondir vers le haut pour que
le tableau soit vert aurait été la faute inverse de celle qu'on venait de
corriger.

**Le rythme d'un texte n'est pas le rythme d'un écran.** C'est ce que l'affaire
enseigne. Les profondeurs d'emboîtement décrivent une structure ; le texte suivi,
lui, n'a qu'un seul niveau et se juge contre sa propre taille. Deux systèmes de
mesure cohabitent, et le second n'était pas branché.

**Et l'asymétrie autour des titres n'était pas un manque.** Elle était portée
en creux par la règle de frontière de `#074` : l'espace au-dessus d'un titre est
celui de la frontière, celui d'en dessous celui des frères, et la frontière vaut
deux crans. **Le rapport de 2 tombe à tous les niveaux**, quand la recommandation
en demande 1,5. Une règle bien posée en paie d'autres — et je l'avais annoncée
comme manquante avant de la mesurer.

**Alternatives écartées** — *Composer la prose en « large »* (1,41 à 1,63 : sort
de la fourchette par le haut sur grand écran, et disloque le propos) ; *ajouter un
cran d'échelle taillé pour la prose* (un nombre inventé pour un cas d'usage, quand
un niveau existant fait l'affaire) ; *laisser le choix à celui qui écrit* (c'est
ce qu'on faisait, et le composant du système lui-même s'est trompé).

**Conséquences** — Le moteur porte la profondeur de la prose et **refuse de
statuer** si elle passe sous son plancher. `Prose` compose au bon niveau : les
paragraphes du produit s'écartent de moitié en plus. Le fichier de règles porte
l'énoncé, et une douzième assertion garde le cas écrit à la main. **Angle mort
déclaré** : le contrôle ne voit pas un texte rendu par une boucle — celui-là est
gardé par le refus du moteur, pas par le Gardien.

**Impact carte** — Corpus S2 : dix contrôles au vert. La recherche sur les mises
en page sans surface est consignée comme fonds ; elle a produit une faute
corrigée, une règle, un contrôle, et la confirmation qu'une règle déjà écrite en
couvrait une autre.

---

## #078 — Le deuxième contrôle a fallu être réécrit : le défaut n'était pas là où le plan le disait

*2026-08-12 · Statut : 🟢 Verrouillé*

**Contexte** — Deuxième des contrôles du plan : *aucune surface plus épaisse que
celle qui la contient*. Confronté au produit, il ne trouve rien à vérifier — les
sections ne s'emboîtent pas, elles sont sœurs. Sa formulation voisine — *jamais
deux blancs emboîtés* — trouve, elle, **neuf cas dans les sept écrans** : un état
vide posé dans une section qui a déjà pris le blanc.

**Et ces neuf cas ne sont pas des fautes.** L'état vide porte un contour tireté ;
posé sur du papier, il reste parfaitement distinct. Le contrôle naïf aurait donc
condamné neuf compositions justes.

**Décision** — La règle vérifiée devient : **une surface qui peint du papier
déclare un contour.** Une seule pièce est exemptée, et elle est nommée : la
section, qui *est* le fond sur lequel les autres se posent.

**Sens produit / UX** — **La bonne règle n'était pas la voisine de la mauvaise,
elle était en dessous.** Ce que la règle du contraste protège, ce n'est pas
l'alternance des fonds : c'est que **deux surfaces emboîtées restent
distinguables**. Le fond est un moyen de le faire, le trait en est un autre. Un
contrôle qui n'accepte qu'un des deux moyens confond la règle avec son
implémentation la plus fréquente.

**Un garde-fou avec neuf faux positifs est pire que pas de garde-fou.** On
apprend à l'ignorer, puis on ignore les vrais. C'est la raison pour laquelle
celui-ci a été réécrit plutôt que posé et « à affiner plus tard » : un corpus se
juge à la confiance qu'on lui accorde, et elle ne se répare pas.

**Il ne trouve aucune faute aujourd'hui, et c'est un résultat.** Les sept
composants qui peignent du papier portent tous un contour. Ce qui était une
habitude devient une garantie : le jour où quelqu'un écrit la huitième surface, le
Gardien le lui rappellera.

**Alternatives écartées** — *Le contrôle du plan tel qu'écrit* (rien à vérifier :
les sections ne s'emboîtent pas) ; *interdire deux papiers emboîtés* (neuf faux
positifs, tous sur des compositions correctes) ; *vérifier le contraste calculé
entre les deux fonds* (il vaut 1 par définition — la mesure serait juste et la
conclusion fausse, puisque c'est le trait qui distingue).

**Impact carte** — Corpus S2 : neuf contrôles au vert. Il reste **trois**
contrôles du plan : deux positions horizontales dans une carte, l'alignement entre
cartes voisines, et le débordement à 390 — ce dernier demande un rendu, pas une
lecture.

---

## #077 — Le premier contrôle des règles du jour est branché, et il a trouvé une faute réelle du premier coup

*2026-08-12 · Statut : 🟢 Verrouillé*

**Contexte** — `#075` a corrigé une faute d'accessibilité : deux cibles voisines
étaient trop près. La correction était une règle écrite, gardée par rien. Le plan
prévoyait cinq contrôles à brancher ; celui-ci n'y figurait pas, et il passe
devant — **une règle corrigée le matin et non gardée le soir revient**.

**Décision** — Le corpus gagne une assertion : aucune pile ne distribue deux
cibles avec un écart plus fin que celui que le moteur autorise.

**Sens produit / UX** — **Il a trouvé une faute réelle à sa première exécution.**
Pas seulement le défaut injecté pour l'éprouver : un écran du produit posait deux
boutons dans une pile trop fine. La faute était là depuis l'écriture de l'écran,
personne ne l'avait vue, et elle se sentait au pouce et nulle part ailleurs. C'est
la meilleure démonstration possible de ce que le projet cherche à faire : le
défaut n'était pas laid, il était invisible à l'œil et réel au doigt.

**Le contrôle lit la géométrie, il ne recopie pas son seuil.** La profondeur
minimale vient de la pièce produite par le moteur. Si l'échelle change, le
contrôle change avec elle — c'est la faute nommée en `#060`, où deux listes
divergentes avaient bloqué le dépôt quatre jours.

**Il a fallu le saboter pour découvrir qu'il ne marchait pas.** À sa première
écriture, il comptait les *types* de composants et non leur *nombre* : deux
boutons faisaient un seul type, et le défaut injecté passait. Un contrôle qui
passe ne prouve rien tant qu'on ne l'a pas fait échouer exprès. C'est la doctrine
du dépôt depuis l'origine, et elle vient de servir à quelque chose.

**Sa portée est déclarée, et elle est étroite exprès.** Il ne juge que le contenu
**direct** d'une pile — ce qu'elle distribue elle-même. Ce qui tombe dans une pile
imbriquée appartient à celle-ci et sera jugé sur sa propre déclaration. Un
contrôle large produirait des faux positifs, et un garde-fou qu'on apprend à
ignorer ne garde plus rien.

**Alternatives écartées** — *Commencer par les cinq contrôles du plan* (aucun ne
garde une règle écrite aujourd'hui ; celui-ci garde une faute corrigée il y a une
heure) ; *juger tout le sous-arbre d'une pile* (faux positifs assurés dès qu'une
sous-pile large contient des boutons) ; *recopier le seuil dans le contrôle*
(deux listes finissent toujours par diverger).

**Conséquences** — Une assertion de plus au corpus. **Une faute corrigée dans un
écran du produit.** Le contrôle du plan « aucun enfant plus rond que son parent »
est mort en même temps que sa règle, écartée par `#073` : il en reste quatre.

**Impact carte** — Corpus S2 : huit contrôles au vert, un bloqué faute de pouvoir
construire ici.

---

## #076 — La densité se règle par zone, et elle décale d'un cran au lieu de multiplier

*2026-08-12 · Statut : 🟢 Verrouillé (décision d'Auteur)*

**Contexte** — Dernière règle du plan : *un multiplicateur unique sur les espaces
et les rayons, avec la cible tactile comme plancher absolu*. Deux mesures l'ont
retournée avant qu'elle soit écrite.

**Un curseur global existe déjà, et il s'appelle la base.** Multiplier toutes les
valeurs par trois quarts donne exactement le même système que régler la base de
vingt-quatre à dix-huit — au chiffre près, sur les trois profondeurs. Deux
réglages qui font la même chose sont une garantie de divergence.

**Et le plancher annoncé n'est pas celui qui mord.** Le plan désignait la cible
tactile ; mesuré, le bouton tient jusqu'à une densité de 0,85. C'est **l'écart
entre deux cibles** qui lâche le premier — voir `#075`.

**Décision** — Le curseur est **local**, et il **décale d'un cran dans l'échelle**
au lieu de multiplier. Une zone serrée respire comme le niveau du dessous, une
zone ample comme celui du dessus. Trois valeurs : serré, normal, ample.

**Sens produit / UX** — **Ce qui manquait n'était pas un réglage global, c'était
un réglage local.** Resserrer un tableau, une barre d'outils, un panneau, sans
toucher au reste de la page : le système ne savait pas le faire. C'est
probablement ce que « densité » voulait dire depuis le début, et le plan
l'exprimait mal en parlant d'un multiplicateur unique.

**Le décalage n'invente aucune valeur, le multiplicateur en invente à l'infini.**
Un facteur de 0,75 produit des nombres qui ne sont dans aucune échelle et qui ne
se retrouvent nulle part ailleurs dans le produit. Un décalage d'un cran emploie
des valeurs déjà présentes, déjà fluides, déjà vérifiées — et il **s'arrête tout
seul aux deux bouts** de l'échelle, sans qu'on ait à écrire une borne.

**Une zone serrée reste lisible parce qu'elle reste dans le système.** C'est la
différence entre resserrer et bricoler : après décalage, la zone respire comme
un autre niveau du même rythme, pas comme une exception.

**Alternatives écartées** — *Le multiplicateur global du plan* (redite de la base,
et il produit des valeurs hors échelle) ; *un multiplicateur local* (même défaut
sur les valeurs, sans le défaut de la redite — mais rien n'obligerait alors le
résultat à retomber sur un cran) ; *plusieurs crans de décalage* (deux niveaux
d'écart entre une zone et son voisinage ne se lisent plus comme une variation
mais comme une rupture ; un cran suffit, et l'Auteur pourra en demander deux le
jour où un cas le réclame).

**Conséquences** — `Pile` et `Grille` reçoivent la densité. La fonction de
décalage vit dans la zone système, avec les autres traductions de l'Échelle.
**Aucune valeur ne change tant qu'aucune zone n'est déclarée serrée ou ample.**
Le fichier de règles porte l'énoncé et dit où passe la frontière avec la base :
l'un est local, l'autre est le système.

**Impact carte** — **Le plan n'a plus de règle en attente.** Restent les cinq
contrôles à brancher, puis la sortie.

---

## #075 — Le système enfreignait sa propre règle : deux cibles voisines étaient trop près

*2026-08-12 · Statut : 🟢 Verrouillé (faute relevée et corrigée)*

**Contexte** — En cherchant où le curseur de densité buterait, une mesure a montré
autre chose : **la règle butait déjà, sans curseur**. La planche déclare un écart
minimal de huit entre deux zones que le doigt doit distinguer. L'écart du niveau
le plus fin vaut six. Et sur l'écran le plus étroit, où l'axe vertical se
resserre, le niveau au-dessus tombe lui aussi sous le minimum — sept virgule six.

**Personne ne l'avait vu parce que rien ne le vérifiait** : la valeur était
déclarée à la planche depuis l'origine, et aucune assertion ne la confrontait aux
écarts produits.

**Décision** — Le moteur calcule désormais **la profondeur la plus fine dont
l'écart tient le minimum à toutes les largeurs d'écran** — aujourd'hui la coque —
et l'expose. Une pile qui contient des composants ne descend jamais en dessous.

**Sens produit / UX** — **C'est la seule règle du corpus qu'un utilisateur peut
sentir dans son pouce.** Toutes les autres se jugent à l'œil ; celle-ci se juge à
l'erreur de frappe, sur un téléphone, une main occupée. Elle mérite d'être la plus
dure du système, et elle était la seule à n'être vérifiée nulle part.

**Le calcul porte sur la largeur la plus étroite, pas sur la valeur de base.**
C'est la leçon de la mesure : à taille d'écran normale, deux niveaux tenaient. Une
vérification faite sur les valeurs de base aurait donc conclu que tout allait
bien. Les valeurs de ce système sont fluides — **toute garantie qui ne s'énonce
pas sur toute la plage est une garantie qui ment**.

**Les boutons groupés ne sont pas concernés**, et le dire fait partie de la règle :
ils se touchent franchement, et un contour commun se distingue mieux qu'un
interstice trop court.

**Alternatives écartées** — *Relever les écarts des niveaux fins pour qu'ils
passent le minimum* (ce serait déformer l'échelle entière pour un cas d'usage :
un texte n'est pas une cible et n'a pas besoin de huit) ; *poser un plancher dur
dans le moteur, qui relèverait l'écart quand il est trop court* (une correction
silencieuse, la faute nommée depuis `#002` — et elle ferait mentir la valeur
affichée) ; *laisser la règle à la charge de celui qui écrit* (c'est ce qu'on
faisait, et voilà le résultat).

**Conséquences** — L'écart minimal entre cibles entre dans les décisions d'entrée
du moteur. La pièce de géométrie expose la profondeur minimale admissible. Le
fichier de règles porte l'énoncé. **Aucune valeur ne change** : c'est un emploi
qui est encadré, pas une échelle qui bouge. Le robot ne sait pas encore repérer
une pile de composants trop fine — charge nommée, non traitée.

**Impact carte** — Une faute d'accessibilité corrigée, trouvée par accident en
préparant autre chose. À noter comme telle : **le corpus déclarait une valeur
qu'il n'appliquait pas**, et c'est le genre de dette qu'aucune relecture n'attrape.

---

## #074 — L'écart ne dit pas seulement où l'on est, il dit ce qui va avec quoi — et une frontière est un groupe

*2026-08-12 · Statut : 🟢 Verrouillé (décisions d'Auteur, rendues sur essais)*

**Contexte** — Le plan portait une règle héritée : *l'écart se choisit sur « même
surface ou pas », plus sur la profondeur*. Rendue sur une carte réelle, le défaut
qu'elle vise est net : deux paragraphes du même propos et deux propos différents
sont au même niveau, donc au même écart. **On lit quatre lignes là où il y a deux
blocs.**

**Décision** — Trois, prises dans cet ordre.

**(1) La frontière s'ajoute à la profondeur, elle ne la remplace pas.** Le plan
disait « plus sur la profondeur » ; l'Auteur a tranché pour le cumul. La
profondeur répond à *où suis-je*, la frontière à *qu'est-ce que je franchis* —
deux questions différentes, deux faits.

**(2) L'écart de frontière vaut deux crans au-dessus**, et non un. Les trois
valeurs ont été rendues côte à côte sur le même contenu : un cran (+41 %) ne
sépare pas assez, deux crans (+100 %) séparent sans écarteler.

**(3) Une frontière n'est pas un écart plus grand : c'est un groupe.** Trouvé en
écrivant, et c'est le point qui compte.

**Sens produit / UX** — **La règle a changé de forme au moment de l'écrire, et
c'est le système qui l'a imposé.** Marquer un enfant « ici je saute plus » aurait
demandé une marge extérieure sur cet enfant — précisément ce que le corpus
interdit depuis toujours, parce qu'un élément ne pousse pas son voisin. La seule
forme admissible était donc de **grouper** : ce qui va ensemble entre dans la même
pile, et la pile du dessus porte l'écart de frontière. La contrainte n'a pas
affaibli la règle, elle l'a rendue plus juste — on ne déclare plus une aération,
on déclare une structure. Et une structure se vérifie.

**Deux crans tombent exactement sur la marge du niveau.** Ce n'est pas une
coïncidence : l'écart d'une profondeur vaut la moitié de sa marge, donc son double
est sa marge. La règle se dit alors d'une phrase qui se retient : **on s'écarte
d'un groupe autant qu'on s'écarte du bord.** Aucun jeton nouveau n'entre au
système — les utilitaires de frontière pointent sur les marges qui existent, seul
leur nom change, parce qu'un écart et une marge ne se déclarent pas au même
endroit.

**Les quatre frontières sont des faits, pas des jugements** — entre deux surfaces
sœurs, au bord de la fenêtre, sous une image, avant un titre qui n'ouvre pas le
bloc. Toutes se lisent dans la structure sans savoir de quoi parle l'écran. C'est
la condition d'entrée au corpus, et c'est le même déplacement que pour la
répétition d'un signal en `#065` : la bonne formulation est celle qu'un robot
peut voir.

**Alternatives écartées** — *La frontière remplace la profondeur* (deux valeurs
pour tout le système : plus simple, mais une liste dans une carte et une liste en
pleine page respireraient pareil — on échangerait un manque contre un autre) ;
*un cran au-dessus* (rendu sur essai : +41 %, la séparation ne se lit pas) ;
*marquer l'enfant qui ouvre une frontière* (c'est une marge extérieure, interdite
— et c'est cet interdit qui a produit la bonne règle).

**Conséquences** — `Pile` et `Grille` reçoivent la déclaration de frontière. La
configuration porte les utilitaires correspondants, qui pointent sur les jetons de
marge. Le fichier de règles porte l'énoncé et son exemple. **Aucune valeur ne
change tant qu'une frontière n'est pas déclarée** : les écrans existants sont
identiques. Le robot ne vérifie pas encore qu'une pile hétérogène déclare sa
frontière — charge nommée, non traitée.

**Une trouvaille en passant** — le contrôle « aucune couleur littérale » a refusé
le commentaire qui citait cette entrée : il prend une référence de journal à trois
chiffres pour une couleur hexadécimale. Le commentaire a été reformulé plutôt que
le contrôle relâché — mais le faux positif est réel, et il touchera quiconque
citera le journal dans le code du produit. Charge nommée, non traitée.

**Impact carte** — Il reste **une règle** au plan : le curseur de densité. Puis
les cinq contrôles.

---

## #073 — Des trois règles de coin, une seule en est une — et elle ne vaut que pour la pastille

*2026-08-12 · Statut : 🟢 Verrouillé (décision d'Auteur, rendue sur mesure)*

**Contexte** — Le plan portait trois « règles de coin » héritées d'un travail
antérieur : la bande de tolérance (aucun enfant plus rond que son parent), la
saturation (un rayon plus grand que la moitié de la hauteur s'écrase) et le
dégagement (un padding au moins égal à 0,293 fois le rayon). Confrontées au
système tel qu'il est, avec ses valeurs, deux tombent.

**Décision** — **Une seule règle est écrite : le dégagement du coin.** Les deux
autres sont écartées, pour deux motifs différents.

**Sens produit / UX** — **La bande de tolérance mesurait la mauvaise chose.**
Elle est violée trois fois aujourd'hui, et toujours par le composant : un bouton
d'arrondi huit dans une carte d'arrondi six. Or c'est voulu — `#063` a posé qu'un
bouton garde le même arrondi partout, pour qu'il se reconnaisse. L'appliquer
reviendrait à défaire la décision d'hier et à revenir au système écarté par
`#070`. Mais elle est surtout **fausse en général** : une section à angles droits
qui contient une carte arrondie est une composition ordinaire, et l'enfant y est
infiniment plus rond que son parent. Ce qui compte n'est pas la comparaison de
deux arrondis, c'est **ce qui se passe dans le coin** — et si la marge tient le
coin dégagé, les deux ne se rencontrent jamais.

**La saturation est déjà couverte, trois fois plus strictement.** Elle plafonne
l'arrondi d'un bouton de quarante-huit à vingt-quatre ; `#064` le plafonne déjà à
huit, les deux tiers de sa marge verticale. Un garde-fou derrière un garde-fou
n'ajoute rien qu'une règle de plus à lire.

**Le dégagement, lui, est de la géométrie.** Sur un coin de rayon R, le point le
plus creux de l'arc est à (1 − 1/√2) × R du bord, en diagonale. La valeur ne se
décide pas, elle se démontre — c'est la première règle du corpus dans ce cas.

**Et la mesure a donné le résultat inattendu.** Sur une **surface**, cette règle
**ne peut jamais mordre** : vérifié sur tous les réglages admis — cinq bases,
huit intervalles, cinq arrondis de départ, au pire cas de largeur d'écran — la
marge reste toujours au-dessus du dégagement. Le plafond de l'arrondi posé le
matin même par `#068` la rend structurellement inatteignable. Elle est écrite
quand même, comme garantie : elle protège le jour où ce plafond bougerait.

**Sur une pastille, en revanche, il n'existe aucune garantie**, et c'est le seul
endroit du système où la règle a un objet. L'arrondi d'une pastille ne descend
pas de la chaîne : il vaut la moitié de sa hauteur, donc **il grandit avec elle**.
Au-delà de **cent soixante-quatre** de haut en air large — cent seize en air
serré — la marge horizontale ne tient plus le coin. Le moteur calcule désormais
ces deux plafonds et les expose. La règle produit donc un énoncé net : **une
pastille plus haute que ça n'est plus une pastille, c'est une surface**, et elle
prend un rayon de surface.

**Alternatives écartées** — *Écrire les trois* (deux d'entre elles n'auraient
jamais rien vérifié, et la première aurait contredit une décision verrouillée —
un corpus qui porte des règles mortes perd la confiance de celui qui le lit) ;
*n'écrire aucune des trois puisque aucune ne mord aujourd'hui* (le dégagement
mord sur la pastille, et il est le seul rempart d'un rayon qui ne descend pas de
la chaîne) ; *appliquer la bande de tolérance aux seules surfaces* (elle y est
déjà vraie par construction : elle n'aurait été qu'une redite).

**Conséquences** — Le moteur porte la constante du dégagement, une vérification
par profondeur, et le calcul du plafond de hauteur d'une pastille par air. La
pièce de géométrie l'expose. Le fichier de règles porte l'énoncé. **Aucune valeur
ne change.** Le robot ne sait pas encore vérifier la hauteur d'une pastille — elle
est un fait de rendu, pas de géométrie ; la charge est nommée, non traitée.

**Impact carte** — Deux des cinq règles restantes du plan sont réglées : celle-ci
en est une, et elle en absorbe deux autres. Il en reste trois.

---

## #072 — Le rognage du texte est ajourné : le défaut est réel et chiffré, le remède coûte plus cher que lui

*2026-08-12 · Statut : 🟡 Ajourné (décision d'Auteur) · **Chiffre la charge ouverte par `#050` sur S3***

**Contexte** — L'Auteur revient sur une observation ancienne : selon la fonte
employée, un même bloc paraît porter des marges verticales différentes. Le fonds
Google Fonts Knowledge nomme le mécanisme sans le normer — depuis CSS1, une ligne
est centrée dans sa hauteur totale et le blanc excédentaire est ajouté au-dessus
et au-dessous.

**Le défaut est mesuré, et il est plus gros qu'attendu.** Sur un bouton à marge
verticale déclarée de dix-sept, le blanc réellement vu est de **vingt-deux et
demi** — cinq points et demi de blanc que personne n'a décidés, par bord. À
l'échelle du système, c'est **la moitié d'un cran**. La marge déclarée n'est donc
pas la marge vue sur l'axe vertical, alors qu'elle l'est sur l'axe horizontal.
C'est un défaut de fondation, pas de finition.

**Décision** — **Ajourné.** Rien n'est écrit, rien n'est changé.

**Sens produit / UX** — **Le remède existe et il est propre** : `text-box-trim`
avec `text-box-edge`, qui cale la boîte sur la hauteur des capitales et la ligne
de base. Mesuré : la marge déclarée redevient exactement la marge vue, quel que
soit le libellé. La compensation ne demanderait **aucun jeton nouveau** — le
composant passerait du cran « détail » au cran « carte », soit de douze à
dix-sept, et retomberait à quarante-cinq et demi, au-dessus de la cible au doigt.

**Ce qui le rend trop cher aujourd'hui, ce n'est pas le rognage.** C'est le
**double régime** : un écran sur six ne le prend pas en charge, et à marge égale
ces navigateurs afficheraient un bouton de cinquante-huit là où les autres en
montreraient quarante-cinq et demi. Douze points d'écart, visibles. Deux jeux de
valeurs à tenir et à vérifier, pendant deux à trois ans. S'y ajoutent un
reréglage complet de l'axe vertical — chaque marge a été jugée à l'œil *en
présence* de ce blanc — et la reprise de tous les écrans de contrôle.

**Et le remède ne couvre pas tout le défaut.** Il supprime la part de la fonte,
pas la part du mot : trois points et demi de variation subsistent selon qu'un
libellé porte ou non une descendante, avant comme après. Un remède partiel qui
coûte un double régime ne se prend pas à la légère.

**Deux faits techniques relevés au passage, et qui resserviront** — le rognage
**n'a aucun effet sur nos composants** tels qu'ils sont écrits, parce qu'ils sont
centrés par une boîte souple qui gère sa hauteur elle-même ; il faut le poser sur
un élément intérieur. Et il fait **perdre douze points de hauteur** à chaque
composant, ce qui les fait passer sous la cible au doigt si l'on ne remonte pas
la marge.

**Condition de réouverture, écrite pour n'avoir pas à refaire la mesure** — deux
signaux, l'un ou l'autre. La prise en charge dépasse largement les
quatre-vingt-trois pour cent d'aujourd'hui, ce qui fait tomber le double régime.
Ou bien le relevé du blanc propre à nos trois fontes montre un **écart fort entre
elles** : le sujet devient alors urgent, parce que changer de fonte casserait le
rythme du système — précisément ce que le système promet d'empêcher. **Ce relevé
n'a pas pu être fait** : le pont vers le disque de l'Auteur a perdu son droit de
copier des fichiers.

**Alternatives écartées** — *Adopter le rognage et compenser pour retrouver la
hauteur d'avant* (on remet le blanc qu'on vient de retirer : gain nul, et un
nombre inventé qui ne descend de rien) ; *l'adopter sans repli* (un écran sur six
verrait des composants d'un sixième plus hauts) ; *corriger à la main par des
décalages verticaux* (la faute nommée par la candidate 26 du fonds
typographique : une correction verticale en littéral ne survit pas à un
changement de fonte).

**Impact carte** — Aucun changement au dépôt. La charge ouverte sur S3 par
`#050` — « la mesure spatiale autour du texte est faussée tant que le rognage
n'est pas déclaré » — est désormais **chiffrée** : cinq points et demi par bord,
la moitié d'un cran. Elle reste ouverte.

---

## #071 — Les longueurs s'affichent à l'entier, le calcul garde ses décimales

*2026-08-12 · Statut : 🟢 Verrouillé (arbitrage délégué par l'Auteur)*

**Contexte** — La question de l'Auteur : faut-il arrondir les valeurs de
l'échelle, et à quoi — l'entier, le pair, le multiple de quatre comme Tailwind ?
Mesure faite sur les quatorze valeurs : les décimales en gardent **neuf
distinctes**, l'entier et le pair huit, la grille de quatre sept. Et la grille de
quatre commet une faute que les autres ne commettent pas — elle donne **le même
écart à deux profondeurs d'emboîtement**, huit entre deux lignes d'une carte et
huit à l'intérieur d'une ligne : la hiérarchie qu'on lit disparaît.

S'y ajoute un fait qu'un système fluide rend décisif : **une valeur ronde ne
l'est jamais à l'écran**. La marge de la coque vaut vingt-quatre en référence, et
19,2 sur un téléphone, 22,6 sur une tablette, 28,8 sur un bureau. La grille
n'existerait qu'à une seule largeur, qui n'est celle de personne.

**Décision** — Deux, prises ensemble. **Le calcul garde ses décimales** (décision
d'Auteur). Et **l'affichage arrondit à l'entier** — arbitrage délégué par
l'Auteur, qui a dit mieux lire les nombres pairs.

**Sens produit / UX** — **L'inconfort était réel, il portait sur la lecture, pas
sur le calcul.** Un tableau qui donne 16,9706 fait lire une précision que
personne n'emploie. La réponse n'était donc pas de dégrader le moteur mais de
soigner ce qu'on donne à lire — l'intuition de l'Auteur est servie, pas
combattue, à l'endroit où elle porte.

**L'entier et non le pair, et c'est le point de l'arbitrage.** Afficher seize
pour 16,97 ment d'un point entier ; l'entier ment de trois centièmes et reste
reconnaissable dans le rendu. Un affichage qui flatte l'œil au prix de la
fidélité cesse d'être une documentation. Le confort du pair est d'ailleurs servi
sans rien forcer : onze des quatorze valeurs sont déjà paires.

**Et l'arrondi est déclaré.** Les tableaux portent la mention que ces longueurs
sont arrondies pour la lecture. Un nombre affiché sans son statut se fait prendre
pour une valeur exacte, et quelqu'un finit par la recopier dans du code.

**Alternatives écartées** — *Arrondir le calcul à l'entier* (perd un barreau de
l'échelle pour un gain nul, puisque la fluidité redonne des décimales aussitôt) ;
*au pair* (perd un barreau, et ment d'un point à l'affichage) ; *au multiple de
quatre* (perd deux barreaux dont un qui porte la distinction entre deux
profondeurs — la seule option franchement mauvaise) ; *afficher la valeur
complète et documenter qu'elle bouge* (c'est ce qu'on faisait ; c'est
précisément ce qui a déclenché la question).

**Impact carte** — `REGLES.md` et la page du système affichent les longueurs à
l'entier, avec mention de l'arrondi. Les ratios gardent leurs décimales : 1,41
n'est pas une longueur. Aucune valeur calculée ne change.

---

## #070 — Les composants ne suivront pas leur surface : l'essai est concluant dans l'autre sens

*2026-08-12 · Statut : 🟢 Verrouillé (essai rendu, décision d'Auteur) · **Confirme `#063`**, ne le révise pas*

**Contexte** — L'Auteur a demandé à voir un système où les composants héritent de
la surface qui les accueille : un bouton plus grand et plus rond dans une coque,
plus petit et plus carré dans une ligne de liste. L'idée avait toujours été
écartée pour une raison d'outil — elle imposait une variante de composant par
profondeur, par taille et par état dans la maquette. La question posée était
donc : avec des règles de calcul plutôt que des variantes dessinées, est-ce que
ça redevient possible ?

**Décision** — Non. **Le système ne change pas** : un composant garde sa taille et
son arrondi quel que soit l'endroit où il tombe.

**Sens produit / UX** — **La contrainte d'outil avait disparu, et ce n'était pas
la vraie raison.** L'essai a été monté avec une seule définition de bouton pour
les trois systèmes comparés : la surface transmet ses valeurs, le composant les
lit. Zéro variante, trois lignes de règle. L'objection Figma tombait donc
entièrement — et l'idée reste mauvaise pour une raison qui n'a rien à voir.

**Le mur technique est tombé le matin même, et ça n'a pas suffi.** Un bouton qui
suit sa surface descend à 41 dans une carte et 36 dans une ligne, sous le
plancher du doigt : c'est ce qui condamnait l'idée jusqu'ici. `#066`, prise
quelques heures plus tôt, retire exactement cet obstacle en séparant le contour
de la zone d'atteinte. L'essai a donc pu être jugé **sur son mérite propre**, et
non sur son impossibilité.

**Ce qui le tue, c'est la reconnaissance.** Deux boutons du même rôle, sortis de
leur contexte et posés côte à côte, ne se lisent plus comme le même geste. Et la
hiérarchie qu'on croit gagner, on la perd : un bouton devient gros parce qu'il
est haut placé dans l'emboîtement, pas parce qu'il est important. La taille cesse
de dire quelque chose du sens et se met à dire quelque chose de la structure —
qui est déjà dite par l'espace.

**Alternatives écartées** — *Tout suit la surface, marge et arrondi* (casse la
reconnaissance, et fausse la hiérarchie) ; *seul l'arrondi suit* — le compromis
qui semblait tenir, la taille restant l'ancre de la lecture (écarté par l'Auteur
avec le reste : un demi-changement de doctrine pour un gain qu'on n'a pas su
nommer).

**Conséquences** — Aucune, au dépôt : rien n'a été écrit, l'essai est resté une
maquette. La valeur de l'entrée est de **fermer la question** — elle rouvrait
tous les trois mois faute d'avoir jamais été tranchée devant un rendu.

---

## #069 — Le système passe en rem : la taille de texte de l'utilisateur commande la géométrie

*2026-08-12 · Statut : 🟢 Verrouillé (décision d'Auteur)*

**Contexte** — Toute la géométrie sortait en pixels. La question de l'Auteur :
« on ne devrait pas plutôt parler en rem, hormis pour la valeur de base ? »

**Décision** — Tous les jetons de géométrie s'expriment en **rem**, ainsi que les
trois tailles de texte qui restaient écrites en dur à la planche et deux mesures
de mise en page. **Trois choses restent en pixels**, et pour la même raison :
elles ne doivent pas grandir avec le texte. La **cible au doigt** — un doigt ne
change pas de taille —, les **traits d'un pixel**, et la **largeur d'écran
minimale**, qui décrit un écran et non un contenu. La conversion emploie seize,
qui est la racine du navigateur et non le corps du système, même s'ils valent la
même chose aujourd'hui : le rem appartient à l'utilisateur, pas au produit.

**Sens produit / UX** — **C'est de l'accessibilité, pas du goût.** Quand quelqu'un
agrandit le texte dans son navigateur — parce qu'il voit mal, parce que l'écran
est loin, parce qu'il est fatigué — un système en pixels l'ignore : le texte
grossit et les espaces restent, la mise en page se déséquilibre puis se casse.
En rem, tout suit ensemble et le rythme est préservé. Un système qui se réclame
du RGAA ne pouvait pas rester en pixels.

**Le rythme est conservé exactement.** Mesuré avant/après sur les trente jetons à
trois largeurs : **quatre-vingt-dix mesures, zéro écart** à taille de texte
normale. Rien ne bouge à l'écran pour l'utilisateur qui n'a rien réglé. À taille
agrandie, **quatre-vingt-sept des quatre-vingt-dix suivent**, et les trois qui ne
bougent pas sont la cible au doigt. Le comportement voulu, vérifié plutôt que
supposé.

**La part fluide reste en vw, et c'est voulu.** Chaque jeton est un `clamp` dont
le milieu contient une fraction de la largeur d'écran. Cette part-là ne suit pas
le zoom du texte : elle décrit l'écran, pas le contenu. Le résultat est un
système qui répond à deux commandes indépendantes — la largeur de la fenêtre et
la taille de texte choisie — sans que l'une écrase l'autre.

**Alternatives écartées** — *Tout en rem, cible comprise* (une cible en rem
descend sous son plancher légal dès qu'un utilisateur réduit sa taille de police
— l'accessibilité se retournerait contre elle-même) ; *convertir aussi les
bascules d'écran* (elles décrivent des écrans, et le sujet mérite son propre
examen : laissé en place, non traité ici) ; *garder les pixels et documenter la
conversion* (une documentation ne redimensionne rien).

**Impact carte** — `echelle.mjs` porte l'unité par jeton. `expression.json` :
trois tailles et deux mesures converties. `REGLES.md` régénéré, l'unité est
posée dans la règle qui commande toutes les autres. Aucune valeur rendue ne
change à taille de texte normale.

---

## #068 — Le plafond de l'arrondi est le double de la marge, pas la marge : deux intentions étaient refusées à tort

*2026-08-12 · Statut : 🟢 Verrouillé (corrigé sur essai) · **Révise `#067`** sur sa mise en œuvre*

**Contexte** — `#067` a traduit « la marge commande l'arrondi » par une borne sur
le réglage de départ : il ne pouvait pas dépasser la marge de base. En rendant
les six intentions de l'Auteur pour les lui montrer, **deux se sont fait
refuser** — *Grand public* (départ 32 sur base 24) et *Ludique* (départ 44 sur
base 28).

**Décision** — La règle de l'Auteur ne change pas d'un mot : aucun arrondi ne
dépasse la marge qui le porte. C'est sa traduction qui était fausse. Le plafond
du réglage de départ devient **le double de la marge de base**, parce que le
premier arrondi vaut déjà la moitié de ce réglage : à deux fois la base, la coque
touche exactement sa marge, jamais plus.

**Sens produit / UX** — **La règle porte sur ce qu'on voit, pas sur le réglage.**
Le réglage de départ n'est pas un arrondi posé sur un objet : c'est une entrée
abstraite dont descendent les arrondis réels. Sur *Ludique*, un départ de 44
produit 22, 11 et 5,5 pour des marges de 28, 17 et 11 — aucun ne dépasse la
sienne. Borner l'entrée revenait à interdire des compositions parfaitement
légales au nom d'un nombre que personne ne voit.

**Une règle trop stricte se paie en expressivité, exactement comme une règle trop
lâche se paie en négligence.** `#064` avait déjà été prise après avoir constaté
qu'une loi trop courte rendait quatre intentions sur six inconstructibles. La
même faute a failli se reproduire par excès de prudence, en sens inverse. Le
garde-fou est le même dans les deux cas : **rendre avant d'écrire**.

**Et le mot « plein » devient vrai.** Au plafond, une coque a un arrondi égal à sa
marge — ce que la formulation de l'Auteur décrivait et que la borne précédente
rendait impossible : elle plafonnait la coque à la moitié de sa marge.

**Alternatives écartées** — *Corriger les deux intentions pour qu'elles rentrent
dans la borne* (c'est faire plier l'intention devant une traduction fautive) ;
*supprimer la borne d'entrée et ne garder que la vérification par niveau*
(elle suffirait, mais le message d'erreur ne dirait plus quoi régler — une borne
nommée vaut mieux qu'un refus tardif).

**Impact carte** — `echelle.mjs` : plafond porté au double de la base, message de
refus réécrit pour dire l'arrondi qu'aurait la coque. `REGLES.md` régénéré. Les
six intentions passent toutes.

---

## #067 — La marge commande l'arrondi : point de départ et plafond, la descente ne change pas

*2026-08-12 · Statut : 🟢 Verrouillé (décision d'Auteur, rendue sur essai) · **Révise `#064`** sur un point*

**Contexte** — La carte de restitution du jour montrait deux systèmes de même
marge et d'arrondis différents pour illustrer « l'arrondi est un réglage à
part ». L'exemple était fautif : il portait un arrondi de vingt-quatre sur une
marge de douze, c'est-à-dire un arrondi qui dépasse sa propre marge — ce que le
système interdit déjà sur les composants. L'Auteur a tranché sur cette faute :
**la marge commande.**

**Décision** — L'arrondi reste un réglage séparé de l'espace, mais il n'est plus
libre dans le vide. **Son point de départ vaut la marge de base.** En dessous,
c'est un choix esthétique, et il va jusqu'à l'angle droit. Au-dessus, ce n'est
pas possible — ni au départ, ni à aucun niveau : aucun arrondi ne dépasse la
marge qui le porte. La descente d'un niveau à l'autre ne change pas : l'arrondi
continue de se diviser par deux pendant que la marge se divise par l'intervalle.
**Ceci révise `#064`** sur son premier point, qui rendait le réglage entièrement
indépendant.

**Sens produit / UX** — **Un réglage libre dans le vide n'est pas un réglage,
c'est un trou.** Séparer l'arrondi de la marge rendait les six intentions
constructibles — c'était juste, et c'est conservé. Mais la séparation avait pour
prix un nombre en pixels choisi sans référence : rien ne disait *par rapport à
quoi* vingt-quatre était vingt-quatre. En le rattachant à la marge comme point de
départ, il devient une proportion : « plein », « la moitié », « le quart », «
rien ». On garde l'expressivité et on retire l'arbitraire.

**Le plafond est plus strict que la géométrie, et c'est assumé.** Un coin de
rayon R ne mange que 0,29 fois R dans son angle : le contenu n'est mordu qu'à
partir de trois fois et demie la marge. La règle de l'Auteur s'arrête bien avant.
Elle n'est donc pas une contrainte physique mais **un choix d'auteur**, écrit
comme tel : au-delà de sa marge, un arrondi cesse de border la surface et
commence à la déformer.

**Rien ne bouge à l'écran, et c'est le signe que la règle était déjà là.** Les
trois arrondis en place valent la moitié, le tiers et le quart de leur marge —
aucun ne la dépassait. La règle ne corrige pas le système : elle nomme ce qu'il
faisait sans le dire, et empêche qu'un réglage futur en sorte.

**La correction est un refus, jamais un rabattement.** Si l'arrondi de départ
dépasse la marge de base, le moteur refuse de calculer et le dit. Rabattre la
valeur en silence aurait donné un système qui *paraît* obéir à un réglage qu'il
a modifié — la faute nommée depuis `#002`.

**Alternatives écartées** — *Une seule commande pour tous les niveaux*, où
l'arrondi de chaque profondeur vaut sa marge multipliée par un même
pourcentage (proposé à l'Auteur, écarté : les petits objets deviennent plus
ronds qu'aujourd'hui, et l'écran change alors que rien ne le demande) ;
*revenir à « le rayon descend de la marge »* de `#058`, sans réglage du tout
(c'est ce que `#064` a défait après essai : quatre intentions sur six
deviennent inconstructibles) ; *plafonner à 3,4 fois la marge*, la vraie limite
géométrique (personne ne saurait lire ce nombre, et le résultat est laid bien
avant).

**Conséquences** — Le moteur de l'Échelle borne l'arrondi de départ par la marge
de base et **refuse de statuer** au-delà. Une garantie par niveau vérifie
qu'aucun arrondi dérivé ne dépasse sa marge — elle ne se déclenche sur aucun
réglage courant, elle est posée parce que les deux descentes n'ont pas le même
pas et pourraient se croiser sur des réglages extrêmes. Le fichier de règles
porte la règle en tête de sa section des formes. **Aucun jeton ne change** : la
géométrie régénérée est identique au bit près.

**Impact carte** — `tools/fili/geometrie/echelle.mjs` : borne d'entrée et
garantie par niveau. `REGLES.md` régénéré. Aucun changement de valeur produite.

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
