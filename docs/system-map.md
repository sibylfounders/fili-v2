# system-map.md — Carte du système FILI V2

> Document vivant. **Il décrit le présent** — il ne raconte pas comment on y est
> arrivé, c'est le rôle de `journal.md`. Toute décision qui déplace un statut de
> cette carte porte un numéro d'entrée au journal.
>
> **Réécrite le 2026-08-07.** L'état antérieur avait été écrasé par une session
> concurrente le 7 août à 08h37 ; une carte décrit le présent, elle se réécrit
> donc plutôt qu'elle ne se restaure. L'incident est tracé en `#049`.
>
> **Dernière décision au journal** : `#144` — 95 entrées au journal, **84 scellées** ;
> `#134` → `#144` attendent le sceau, et `#050` et `#112` sont signalées réécrites
> par `immutable.mjs` (atteinte antérieure, non traitée).

**Légende des statuts**

| Statut | Signification |
|---|---|
| ⚪ | **Idée** — formulée, non instruite. Aucun engagement. |
| 🟡 | **En cours** — instruite, en discussion ou en construction. Réversible. |
| 🟢 | **Verrouillé** — épreuve déterministe passée à 100 %. Ne se rouvre que par une décision explicite tracée au journal. |
| 🔴 | **Ouverte** — pour une dette : constatée, non traitée. |
| 💤 | **En sommeil** — arrêté volontairement. Rien n'est supprimé ; se rouvre par une entrée de journal. |

> **Convention de lecture machine.** Les tableaux des sections **1 à 5** sont
> lus par `tools/fili/map/produce.mjs`, qui en dérive la pièce que l'écran
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
| S7 · Posture | ⚪ | Une interface s'adapte à la situation d'usage de sa surface, pas simplement à sa taille : état physique → orientation → posture → règles → composition ; le designer écrit les règles qui survivent aux changements de posture, pas une collection d'écrans (principe d'Auteur, 10 septembre 2026 ; `POSTURE` au moteur, page `/adaptation`). Le kit le pratique depuis le 11 septembre : `LAYOUTS` déclare les zones du gabarit, les seuils sont des sommes, `adaptive.tsx` lit et dit, le banc se regarde sur les vraies pages | 6 — `tests/postures.test.mjs`, huit pages dans la matrice N2 (11 septembre, matrice sortie dans `tests/situations.mjs`, partagée avec `verify.mjs`) ; ⚪ tant que les largeurs de travail ne sont pas jugées à l'œil. **Limite dite le 11 septembre (soir) : les postures pliées — Livre, Laptop — ne se mesurent qu'au banc, par l'émulation ; ni une page ni un cadre ne peuvent les jouer** |

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
EtatAsync, Section, Titre, Texte, Pile, Grille, Token, Alerte, Vide, Skeleton,
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
| `/` · La porte | 🟡 | Couverture de charte, l'accès direct aux six familles (7 septembre), le moteur en objet vivant, une carte et un spécimen par page ouverte, la carte du système par famille — tout lu dans la liste unique des pages (`kit/app/pages.ts`) | Rouverte le 7 septembre : réécrite sur la liste unique, rendu vérifié sur capture, en attente de l'œil d'Auteur (`#111`) |
| `/typo` · Typographie | 🟡 | Quatorze règles (T13 une seule taille, T14 deux fonds deux graisses, depuis le 8 septembre ; T12 le calage depuis le 4), huit crans et un seul rapport, la mesure dans son cadre au verdict lu, la gazette, la section Graisse (liste au corps unique, deux fonds à l'écart réglable — l'écart de 20 posé à l'œil par l'Auteur le 9 septembre), six bandes dont la carte calée — passée à la voix et aux quatre étages le 2 septembre | **Rééquilibrée le 8 septembre (nuit) : la queue commune a disparu, un répertoire au titre de la page, l'écriture éprouvée, le banc repassé vert — en attente de l'œil d'Auteur.** **8 septembre : section Graisse, deux épreuves neuves, quatorze vertes sur la machine d'Auteur ; les tokens de graisse (`--weight-*`) ont une valeur claire et une sombre.** **Reverrouillée le 7 septembre : sept épreuves réécrites sur la page d'aujourd'hui (bandes, fonts, mesure lue, calage mesuré), le banc repassé vert de bout en bout.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, douze épreuves (`#127`) ; la carte du zoom s'ouvre au ×2 depuis le 31 août, l'épreuve décrivait encore l'état de repos — remise au niveau le 1er septembre (elle éprouve maintenant les trois états). |
| `/rythme` · Rythme | 🟡 | Le moteur en ouverture (le scénario, douze slides, depuis le 2 septembre) ; la descente : coque, carte, ligne, marge et coin ensemble (chaîne et profondeur fondues le 8 septembre) ; la densité qui change la base ; l'intervalle des titres ; le registre — réécrite sur les huit décisions le 25 août **12 septembre (`#139`) : la chaîne émet son premier cran de page — il a désormais un consommateur, la frontière à trois crans ; trois lignes de `rythme.css` qui redisaient le gabarit sont sorties.** | **Rééquilibrée le 8 septembre (nuit) : la queue commune a disparu, un répertoire au titre de la page, l'écriture éprouvée, le banc repassé vert — en attente de l'œil d'Auteur.** **Reverrouillée le 7 septembre : le film déclare ses valeurs écrites à la main, le couple chiffre-légende est mesuré, le banc repassé vert.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, quinze épreuves (`#126`) ; réglette de la chaîne et quatre couleurs de crans posées le 31 août — vert, bleu, jaune, rouge (rupture déclarée : ici la couleur dit la profondeur, pas la nature ni l'état) — à repasser au crash-test ; le laboratoire remis au niveau le 1er septembre (l'amorce « deux fois le même geste » portée de la pièce libre à la place des pastilles ; chiffres de légende alignés sur la densité du site). Épreuves remises au niveau le 1er septembre : l'amorce, l'anneau de marge, la carte devenue rangée, le menu devenu contrôle, la réglette. Deux fautes corrigées au passage — l'écart de la réglette, qui n'était pas dit, et la réglette qui écrasait l'affiche du bon cran. |
| `/couleur` · Couleur | 🟡 | Dix-sept règles ; la marque rare (palette et situation fondues le 8 septembre : le tableau de bord, la mosaïque), le nuancier en six lignes signées, le moteur ; le registre : les rôles dans les deux thèmes, les six gammes ouvertes, cinq bandes (dont « teinter ne coûte rien ») | **Rééquilibrée le 8 septembre (nuit) : la queue commune a disparu, un répertoire au titre de la page, l'écriture éprouvée, le banc repassé vert — en attente de l'œil d'Auteur.** **Reverrouillée le 7 septembre : cinq épreuves réécrites (un seul panneau mesuré dans les deux thèmes, la casse de la teinte entre à l'épreuve), une faute corrigée (la marque du panneau de code écrite à la main, lue au moteur), le banc repassé vert.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, huit épreuves (`#128`) ; le nuancier est passé en deux groupes et la démo du moteur ne pilote plus la page (31 août) — épreuves remises au niveau le 1er septembre. Une faute corrigée : les 5,5 rem que le fond doux réservait à la lane du ton, écrits à la main, sont maintenant nommés et dits. |
| `/composition` · Composition | 🟡 | **Seize lois depuis le 11 septembre : la 16, le solde, rouverte pour elle seule (journal 11 sept. (3)) — l'œil pèse les masses avant de lire ; une rangée se ferme ou se solde, l'empilement n'est jamais une réponse, un contrôle n'est jamais élastique ; réglages ⚪ seuil 1,5, une ligne ; sa preuve de page est tranchée le 11 septembre au soir (journal 11 sept. (5)) et reste à construire, par le banc : un trio — la même Une et les mêmes onze items trois fois, empiler (la rangée reste ouverte) · cacher, ce que fait le vrai site avec son carrousel (la rangée se ferme en soustrayant sept items) · donner une forme (elle se ferme et tout reste) ; une rangée doit se fermer sans perdre de contenu.** Le regard : l'écran qu'on casse (le vocabulaire EST la légende, relié par filets, 31 août), le chemin de l'œil (F et Z), l'espace blanc mesuré — et, depuis le 7 septembre, les deux étages du bas : quatre paires (le bon et le mauvais côte à côte, le même objet deux fois, une seule chose change — un habit, un trait, un cadre, un bord) et quatre lois en liste ; la table des quinze lois a disparu, les quinze sont toutes là. **La loi de la frontière reçoit sa nuance le 11 septembre (`#138`) : trois crans quand elle bute sur une image, deux entre deux textes — et les blocs de texte d'un item reprennent leur demi-plomb, sans quoi l'écart réglé n'est pas l'écart vu.** **Portée dans les six Fondations le 12 septembre (`#139`) : le gabarit rend son plomb (chaque rôle déclare son interligne en `--lh`), la frontière du corps passe à deux crans et à trois contre une scène, le premier cran de page entre dans la chaîne — relevé `npm run plomb` vert sur les six pages à sept largeurs, et une commande n'est pas une scène.** | **Rouverte le 11 septembre pour une seule loi (la 16, le solde) : rédigée au moule, éprouvée par `tests/verify.mjs`, sa paire attend le verdict d'Auteur avant de s'écrire sur la page ; les quinze autres lois ne bougent pas.** **Rééquilibrée le 8 septembre (nuit) : la queue commune a disparu, un répertoire au titre de la page, l'écriture éprouvée, le banc repassé vert — en attente de l'œil d'Auteur.** **Verrouillée le 7 septembre : dix épreuves écrites au niveau des quatre autres pages, le banc passé vert (course complète), la dette des treize valeurs fermée — quatre sur la chaîne, neuf déclarées réductions de l'objet imité.** Réserve d'Auteur consignée : les textes des paires ne le convainquent pas encore. |
| `/arrondis` · Arrondis | 🟡 | La profondeur choisit le coin ; le coin intérieur ; la pilule ; six pièges révélés par leur curseur (2 septembre) — racine 16, bouton = coin de la ligne ; le répertoire des intentions a quitté la page | **Rééquilibrée le 8 septembre (nuit) : la queue commune a disparu, un répertoire au titre de la page, l'écriture éprouvée, le banc repassé vert — en attente de l'œil d'Auteur.** **Reverrouillée le 7 septembre : deux épreuves réécrites sur les pièges, le banc repassé vert.** Reverrouillée le 1er septembre : le banc est repassé vert de bout en bout.** Verrouillée le 26 août, neuf épreuves (`#129`) ; le bouton en pilule n'est plus un recalé depuis le 31 août — l'épreuve comptait encore deux recalés. Remise au niveau le 1er septembre : elle mesure désormais que les deux boutons de la paire sont le même objet à un fond près. |
| `/mouvement` · Mouvement | 🟡 | Fondation (sous Geste). **Une ouverture sous l'accroche (9 septembre, #137) : une interface qui vit toute seule, sans légende — carte, menu, notification, donnée, tiroir, chacun à son cran ; un bouton l'arrête.** Trois règles en trois comparaisons, le mauvais et le bon côte à côte, un seul bouton joue les deux — la trace (une carte de tâche glisse, ou disparaît et reparaît), la cause (le même menu depuis son bouton ou depuis nulle part), le regard (une carte bouge, ou les huit) — chacune avec son observation, sa légende lue sur le rendu et ses règles-sources (observation / règle / réglage) ; puis le gabarit des autres pages : quatre paires qu'on peut casser — un seul geste joue les deux côtés au même instant, ralenti ×3 écrit (le survol qui poursuit, le menu qui traîne, le néant, tout couper), huit règles en liste, neuf lignes de code lues au moteur | **Alignée le 8 septembre (nuit, 3) sur le verdict « aligne » : la queue en trois sections devient un répertoire au titre de la page (moteur, quatre paires, liste), banc 71/71.** **Verrouillée le 8 septembre (soir) : douze épreuves écrites avec la page, dont l'écriture d'Auteur mesurée ; trois courses vertes, course complète sur la machine d'Auteur — six pages vertes.** |
| `/adaptation` · Adaptation | 🟡 | Principe (sous Principes, depuis le 9 septembre). Six preuves : la visée, le seuil (une somme, 44,5 rem), l'étirement, la hauteur (plancher 34 rem), les segments, les plans — un livre qui s'ouvre, trois positions 0° · 125° · 180° et Retourner, la posture lue au moteur (`POSTURE`, S7). Registre : huit règles, trois grandeurs, les états et postures, les largeurs de travail, onze surfaces ; dix lignes de code. Sources Apple / Android / Samsung / W3C. Huit épreuves vertes (10 septembre). | Aucune règle au banc (⚪) ; la mesure du texte à trois valeurs ; A1–A14 à réaligner |
| Composants & patterns | 💤 | — | Gelés jusqu'au verrou des fondations (`#102`) |

**Le moteur du kit** (`kit/derivation.mjs`) — 🟢 pour la couleur, 🟢 pour le
rythme (écrit et éprouvé le 25 août, jugé sur pièce et commité le 26, 23 épreuves vertes). Quatre
décisions d'entrée : primary, base, intervalle, racine des coins (+ l'intervalle
des titres). Il écrit `kit/app/tokens.css` en entier, `kit/tokens.tailwind.mjs`
et `kit/tokens.figma.json` (`npm run tokens`) ; `kit/derivation.test.mjs`
rejoue les huit pages de décision et vérifie le site lui-même : aucun ancien
nom, aucun token orphelin, aucun nombre posé hors des lignes qui le disent
(`npm test`). Le gabarit documentaire descend de la chaîne : silence au 4ᵉ cran
de page, titres du site à un cran et demi au-dessus de l'affiche.

**Le cadre des démonstrations** (9 septembre, `#135`) — 🟢 `Demo` dans
`kit/app/levels.tsx` : la situation en tête et une seule action qui porte le
verbe ; deux côtés (le faux à gauche, déclaré ; au repos chaque côté montre
son verdict, l'action rejoue) ou une scène (le verdict bascule, « ↺ Réparer ») ;
un choix à positions (`bar` : « Casser », « Montrer », « Densité »…) vit sous
la tête, à la place d'une ligne de verdict ; une molette (`tools`) vit sous la
scène ; la scène ne commente pas, elle mesure. Le banc à poignée (`Preview`)
sait vivre dans le cadre, bord à bord. Posé sur les six pages, plus aucun banc
nu ; `Band` n'a plus de bouton « Casser ». La tête dit l'enjeu, pas le décor.

**La bande d'atelier** (11 septembre, journal 11 sept. (2)) — 🟡 dans l'en-tête,
à droite : la couleur, le fond (clair ↔ sombre) et trois surfaces — Mobile,
Tablette, Bureau (`LAYOUTS.surfaces`, partagées avec l'épreuve des postures) ;
« ⋯ » ouvre le drawer, qui garde le reste. Les appareils ouvrent UNE fenêtre — le
banc — et la reposent à chaud : vraie surface, vraie posture, sans rechargement ;
le pli, lui, n'est pas simulable depuis une page et reste à DevTools. Les
appareils se retirent sous une somme lue sur l'en-tête (30,6 rem, conteneur
`chrome`). Signes d'après Lucide, recopiés (`app/icons.tsx`). Pièce :
`claude/bande-atelier-2026-09-11.md`.

**L'épreuve des voisins** (11 septembre (soir), journal 11 sept. (3)) — 🟡
`node kit/tests/verify.mjs <fichier.html | URL>` (`npm run verify`) : sur
n'importe quel HTML, les quatre cas de la loi 16 — a se fermer, b se solder,
c contrôle jamais étiré, d filet à égale distance — mesurés sur le contenu,
jamais sur la boîte ; plus « pas de nombre » au rendu, le contraste de chaque
texte contre son vrai fond, et les débords aux treize situations
(`tests/situations.mjs`). Elle rejoue ses quatre fixtures piégées et sept
mutations (`tests/fixtures/voisins/`) avant chaque jugement et refuse de
statuer si une mutation ne rougit pas le cas visé : 11/11. Réglages ⚪ (seuil
1,5, tolérance d'une ligne, trois lignes minimum, un écran et demi maximum)
dans `tests/neighbors.mjs`, à valider à l'œil. Passée dans un Chromium hors
de la machine d'Auteur ; à repasser sur le Mac.

**La greffe — Phase 2, adoptabilité** (11 septembre (soir), journal 11 sept.
(4) ; **temps 1 tenu le 12 septembre**) — 🟡 instruite, temps 1 🟢 (64 paires
au seuil sur la primaire de JV ; le moteur reçoit `fontText` / `fontHeading`,
le kit gagne `--font-heading`). **JV était un test : arrêté au temps 1 par
l'Auteur le 12 septembre**, temps 2 et 3 non ouverts — le mécanisme est
construit, pas encore éprouvé sur une page : trois colonnes — ce qu'on garde
d'une identité tierce (primaire, sombre, accent, formes, voix, polices,
contenu), ce que le moteur dérive (`derived(primary, accent)` : la famille
entière, le focus, le rythme, les crans, le mouvement), ce qui reste au kit
quoi qu'il arrive (accessibilité, chaîne, états, lois). Cas d'épreuve JV en
trois temps, aucune page avant le verdict. Le relevé d'identité vient du
script de relevé au rendu (`claude/outils/releve-rendu.js`). Pièce :
`claude/greffe-fili-sur-une-identite-tierce-2026-09-11.md`. Les formes d'item
(une · carte · vignette · ligne · titre) et la règle de densité de contenu
sont en plan (`claude/formes-d-item-et-densite-de-contenu-2026-09-11.md`),
rien ne se code avant le verdict.

**Les postures du kit** (11 septembre, journal 11 sept. (1)) — 🟡 le gabarit
déclare ses zones au moteur (`LAYOUTS` : lecture 17 → 34 rem, rail et repères
sur le cran `doc-rail`, niveau N2 au produit et à la zone). Le palier du rail
est une somme résolue par le moteur (58 rem, écrite dans tokens.css) ; bande,
tables et liste se lisent sur la zone de lecture (`@container reading`) ; les
26 seuils de scène restants sont figés feuille par feuille et l'épreuve refuse
tout seuil de plus. Livre et Laptop en CSS (segments de viewport). La couche
`kit/app/adaptive.tsx` pose sur `<html>` gabarit, zones, segments et posture ;
`data-adaptation` est devenu `data-stack`. Le mode banc (drawer) cerne les
zones et rend le verdict. `tests/postures.test.mjs` : 13 situations × 8 pages,
6 épreuves vertes. Pièce : `claude/strategie-postures-production-2026-09-11.md`.

**Le lexique et la langue du code** (8 septembre, `#134`) — 🟢 `docs/lexique.md`
fait foi : prose française, code anglais. Tout identifiant du kit et du témoin
est en anglais ; le dictionnaire `docs/migration-code-en.json` dit comment
chaque mot s'écrit et un mot nouveau y entre d'abord. Le banc vit dans
`kit/tests/`, le sceau du journal dans `docs/journal.fingerprints.json`.

**La marque de la bande** (8 septembre) — 🟢 « Kit » et sa devise sont un
seul lien vers l'accueil, par le routeur ; inerte sur l'accueil.

**La liste des pages** (7 septembre) — 🟢 une seule, `kit/app/pages.ts` :
deux catégories, six familles dans l'ordre d'Auteur, chaque page avec son
adresse, son état écrit à la main et ses deux phrases. Le menu, le rail, le
drawer et l'accueil la lisent ; créer une page = une ligne.

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

**Le mouvement du kit** (décisions d'Auteur du 3 septembre, posé le 4, jugé et
ouvert le 7) — 🟢. Le moteur porte quatre durées avec leur emploi (100 bouton ·
survol · appui ; 200 menu · infobulle · dépliant ; 300 drawer · fenêtre · panneau ;
700 arrivée d'une section) et la courbe du kit, `cubic-bezier(0.23, 1, 0.32, 1)`,
**validée à l'œil sur le site le 7 septembre** (« courbe OK », jugée contre celle
de Material sur `/couleur`). Plus une seule durée écrite à la main dans les
feuilles : chaque transition prend son token et dit son emploi, ou dit
« chorégraphie » sur sa ligne — trois seulement (le film de `/rythme`, l'entrée
de l'accueil, la boucle du chemin de l'œil sur `/composition`). Une valeur qu'on
fait glisser ne s'anime pas. Les vraies commandes répondent à l'appui. Sous
mouvement réduit, les déplacements partent et les fondus restent — écrit par
construction, vérifié par deux épreuves du moteur. La page `/mouvement` porte la
famille depuis le 7 septembre, verrouillée par le banc ; le mouvement est une
**fondation**, sous Geste. Reste à l'œil de l'Auteur : la cascade du nuancier de
`/couleur`, ramenée sur les crans (300, pas de 100), sans verdict distinct.

**Le banc des crash-tests de page** (`kit/tests/`, `npm run test:pages`,
`#125`) — 🟢, repassé vert le 7 septembre (course complète sur la machine
d'Auteur : moteur 29/29, pages 12 · 12 · 9 · 8 · 10 · 12 — Composition puis Mouvement ont rejoint le banc le 7 septembre). Le site construit à part, ouvert dans Chromium à 320 · 768 · 1440,
dans les trois densités et les deux thèmes ; le navigateur mesure, le moteur
prédit, au dixième de pixel. Six épreuves communes — les chiffres affichés, les
preuves par leur token, la densité, les titres, C17, rien en dur — et, par page,
ce que sa terre exige : 66 épreuves sur les six pages (`#126` → `#129`, Composition et Mouvement le 7 septembre).
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
`kit/tests/bench-state.mjs` tourne à chaque enregistrement, dans le
garde-fou déjà en place : il compare la date de la dernière écriture d'une page
à celle de son dernier passage au vert, et **rabat lui-même le 🟢 de cette table
à 🟡** quand le vert ne tient plus. Il ne fait jamais l'inverse — reverrouiller
reste une décision d'Auteur, écrite au journal (garde-fou 2).
`kit/tests/night-run.mjs` lance le banc chaque nuit à 3 h 30
(`npm run bench:night`), écrit son verdict en clair dans `docs/banc-du-jour.md` et
remet cette table au vrai. Une nuit où le site ne se construit pas ne rabat
rien : rien n'a été mesuré, la dernière mesure connue tient.
**La course mesure tout ce qu'elle annonce depuis le 12 septembre (`#144`).**
Elle n'en lançait que la moitié : sa liste nommait les pages par leur slug
français quand les épreuves portent des noms de fichiers anglais — quatre des
six pointaient vers un fichier absent — `postures`, `adaptive`, `weight` et
`frontiere` n'y figuraient pas, et le bulletin s'écrivait ailleurs que là où
tout le monde le cherchait. La correspondance page → épreuve est désormais
écrite une fois (`TEST_OF`), lue par les deux pièces ; la course passe **sept
pages, trois épreuves de traverse, le relevé du plomb, le moteur et la preuve
de l'épreuve d'un fichier** — celle-ci en second, avant toute mesure, parce
qu'un instrument qui ne peut plus échouer rendrait décoratif tout vert qui le
suit. Une nuit n'est verte que si tout l'est. Vérifiée par sabotage : deux
fautes posées, une dans une page et une dans une traverse, toutes deux nommées
au bulletin et la pastille rabattue ; retirées, la course repasse au vert
(4 min 40). Le verrou au commit
a été examiné et **écarté** : deux minutes d'attente à chaque enregistrement
pousseraient à grouper les commits, et le journal vit de leur finesse.

**L'épreuve d'un fichier prouve d'abord qu'elle peut échouer** (11 septembre,
durcie le 12 — `#143`). `kit/tests/verify.mjs` rejoue ses quatre fixtures
piégées et leurs mutations avant de juger quoi que ce soit. Depuis le 12
septembre, une mutation ne suffit plus à rougir : elle doit prendre **au moins
trois lignes** sur son seuil, et par une quantité qu'elle pose elle-même — les
fautes disent désormais leur marge en lignes (`marginLines`), dans la même unité
pour les quatre cas. Une preuve qui tient à un cheveu dit la police de la
machine, pas la loi : trois mutations sur onze étaient dans ce cas, dont une à
2,5 px, et l'épreuve refusait de statuer sur le Mac tout en passant ailleurs.
11/11 sur deux machines, marge la plus courte 3,6 lignes, posée. **Ce que
l'épreuve dit d'une page du kit reste rouge et non traité** : 27 textes sous le
seuil de contraste (le tertiaire du rail et des kickers à 3,33:1 pour 4,5 exigés)
et une soixantaine de valeurs hors chaîne au rendu — dette de la page, pas du
banc.

**Le kit est jugé par ses propres règles, au commit et au push** (9 septembre,
décision d'Auteur — voie B). Le linter FILI de `temoin/` ne sait pas lire le kit
(classes Tailwind, registre de composants, hooks de données : rien de tout cela
dans le kit) ; lancé à blanc, il refuse de statuer sur ses 33 fichiers. Le
linter du kit, c'est `kit/derivation.test.mjs` — 30 épreuves, moins d'une
seconde, zéro dépendance — qui lit le CSS tel qu'il est écrit : aucun nombre
posé hors des lignes qui le déclarent, aucune durée ni courbe à la main,
mouvement réduit tenu. Il entre dans le hook `pre-commit` et dans la CI, en
**verrou** (une faute volontaire l'a fait rougir, restaurée à l'octet près).
Le banc de pages reste un voyant. **La graisse est un rôle, jamais un nombre**
(9 septembre, T13) : les 198 graisses écrites à la main des feuilles et des vues
sont passées aux trois jetons `--weight-body / -label / -heading` ; seuls les
objets imités de /composition gardent leur 700, dit sur la ligne ; le gras du
navigateur (b, strong, th, h3–h6) prend le rôle titre, les champs héritent, une
scène qui déclare son thème repart du courant de ce thème. Deux épreuves le
tiennent : « pas de graisse à la main » au linter du moteur (32 épreuves), et
`tests/weight.test.mjs` au banc de pages — sept pages, deux thèmes, toute
graisse rendue est un rôle (74 vertes). L'écart en sombre, 20, est posé à l'œil.
Le même jour, la règle « pas de nombre »
s'étend aux styles inline des vues (31e épreuve), avec la grammaire du CSS —
« hors chaîne » ou « casse » sur la ligne ou celle du dessus, bloc de dette
borné — et une exemption propre au kit : un élément qui porte
`data-intent="statement"` montre une faute exprès. Neuf tailles écrites à la
main sont tombées : trois petits textes gris passés à `--font-size-small`, le
spécimen « Aa » de l'accueil devenu les crans du kit eux-mêmes (il suit la
densité), et une casse déclarée reconnue comme telle.

**Le moteur de couleur** — 🟢 verrouillé. Le 7 septembre, un token
`--code-danger` est né et mort le même jour : ce qui a besoin de toute la
famille sombre se déclare en thème sombre et prend le rouge du système
(verdict d'Auteur) — la colonne des cotes de `/rythme`, et le labo du coin de
`/arrondis` sur sa scène de nuit (`banc noir`, une variante déclarée). Une décision
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
`.field-box`. `kit/app/tokens.css` est **généré** — une valeur retouchée
à la main serait une valeur sans provenance. Sa **gamme 50–950** pose la
couleur saisie sur le cran de sa clarté, telle quelle, et déduit les autres
crans d'elle ; les neutres restent les marches fixes ; la page dit sur quel
cran chaque rôle se pose, sans qu'un rôle consomme jamais un cran (`#113`).
Une encre de plus depuis le 25 août, `text-tertiary` (3:1 au seuil sur le
fond le plus dur), tenue par **C17** : une intention dite sur sa ligne, jamais
du texte lu, jamais sous le cran étiquette, et — depuis le 26 août, sur pièce —
un cran de graisse de plus en petit (le rôle titre — 600, 580 en sombre — depuis
le 9 septembre ; « 600 au moins » avant). Le vérificateur éprouve les trois (`#124`).

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
| Le moteur de géométrie sans preuve contre la source | 🔴 | `#059` | Le socle est exact ; le découpage en crans et le rythme responsive sont reconstruits. Vingt-trois tokens produits là où la note en dénombrait vingt-deux. Se ferme le jour où le générateur revient au dépôt. |
| La provenance des hauteurs de témoin | 🔴 | `#059` | Elles se disaient « multiples de l'échelle d'espacement, 21 pas de 32 ». La phrase n'a plus d'objet. Les valeurs restent justes, leur justification est à réécrire. |
| Les cinq trous de la promesse mesurée | 🟢 | `#081` → `#083` | Fermée : couleur nommée (`#082`), rond qui tourne, icône répétée, texte suivi hors pile, porte des données (`#083`). |
| Le corpus ne lit qu'une seule façon d'écrire du style | 🔴 | `#086` | Douze des treize contrôles lisent des classes utilitaires. Sur du CSS ordinaire, l'appareil est muet. « Ce cadre juge n'importe quel code » est faux tant que ça dure. |
| Le contrôle de couleur est aveugle aux tokens étrangers | 🔴 | `#085` | Il ne connaît que les familles livrées par défaut. Un écran écrit dans un autre vocabulaire de tokens le traverse en silence — la porte est fermée, mais aucun message ne nomme la faute. |
| La règle du mouvement est trop large d'un cran | 🔴 | `#084` | « Rien ne tourne dans le vide » vise l'attente et refuse toute animation, y compris l'ouverture d'une fenêtre. Constatée en mesure, non corrigée. |
| Rien ne traduit du code existant vers le cadre | 🔴 | `#084` | 240 refus sur un écran étranger pour 2 décisions réelles (palette, échelle). Sans outil de traduction, le cadre a raison et n'est pas adoptable. |
| L'amorçage lit hors de la couche de données | 🔴 | `#083` | Le démarrage lit l'état par la fenêtre et non par la porte. Il n'affiche rien, il ne peut donc oublier aucun état — mais il est exempté par son nom, et une exemption nommée est une dette. |
| Le décompte des sabotages est invalidé | 🔴 | `#083` | La carte annonçait 46 sur 46 alors que le test de mutation ne pouvait plus rien injecter depuis un temps inconnu. À remesurer avant toute lecture de ce chiffre. |
| Les démos du kit n'emploient pas le registre | 🔴 | `#112` | Boutons et champs des démonstrations sont dessinés dans la page, pas tirés du registre du kit. Se ferme quand les composants entrent (phase 4). |
| Le wording des pages du kit | 🟢 | `#112` → 8 septembre 2026 | Fermée : les cinq pages passées aux règles d'écriture d'Auteur (aucun mot qui commande ou décrit, pas d'histoire de page, un répertoire au titre de la page), éprouvé au banc. Reste à l'œil. |
| Les seuils de mise en page du site | 🔴 | 25 août 2026 | Le site en porte neuf (80 · 69 · 62 · 56 · 48 · 44 · 40 rem, 900 · 560 px) là où la décision 7 en veut un seul par régime. Déclaré dans le moteur (`thresholdRail`), à arbitrer dans un thread à part. |
| La page Composition hors chaîne | 🟢 | 25 août → 7 septembre 2026 | Fermée : ses treize valeurs sont arbitrées — quatre appartiennent au kit (la scène de preuve, les écarts d'un banc, la légende) et descendent de la chaîne ; neuf appartiennent aux objets imités (l'interface, le journal, l'affiche, le magazine) et n'y entrent pas, dit sur chaque ligne (« réduction déclarée ») et exclu par son nom au banc. Au passage : le marqueur de dette exemptait tout ce qui le suivait dans la feuille — vingt-six autres valeurs de la page n'étaient pas lues ; elles le sont, et la dette de l'accueil est bornée (« FIN DE LA DETTE »). |
| La page Accueil hors chaîne | 🔴 | 25 août 2026 | Ses anciens tokens sont rabattus sur la chaîne pour que la page tienne ; ses valeurs propres (`--acc-*`) restent posées en dur, bloc marqué « dette déclarée » et borné dans globals.css. À dériver quand la page sera reprise. |
| Le journal en retard de onze entrées | 🟢 | 25 → 26 août 2026 | Fermée : les huit décisions et les trois entrées du thread « Le kit passe sur la chaîne » sont versées (`#114` → `#124`) et scellées (75 entrées). |
| Les sept témoins non jugés après migration | 🔴 | `#059` | Tous les nombres des sept écrans ont changé. Le verdict mécanique est vert des deux côtés ; l'œil n'a pas parlé. La planche de comparaison existe, la séance non. |
| Les polices Google sur les artefacts | 🔴 | 11 septembre 2026 | Les pages livrées (`claude/livrables/jv-fili/`) chargent une police distante ; hors réseau, le rendu mesuré est celui de repli (`verify.mjs` : une ressource non chargée). Une pièce qui dépend du réseau pour sa typographie n'est pas une pièce. |
| La mesure du texte non arrêtée | 🔴 | 11 septembre 2026 | Trois valeurs en circulation (16/70, 17/62, 65ch), aucune tranchée. La forme « ligne » des items et la tolérance « d'une ligne » de la loi 16 en dépendent. |
| Les postures pliées non mesurables hors banc | 🔴 | 11 septembre 2026 | Les segments de viewport viennent du navigateur ; ni une page (la bande d'atelier) ni un cadre ne peuvent jouer un pliable. Livre et Laptop se voient à DevTools et se mesurent à l'émulation seule (`tests/situations.mjs`). Un défaut de posture pliée ne se verra donc jamais à l'œil sur le site. |
| L'échelle d'images absente | 🔴 | 11 septembre 2026 | Le kit n'a ni rapports (16/9 · 3/2 · 4/3 · 1/1), ni largeurs servies, ni règle de recadrage. Les formes d'item (l'image élastique bornée) et la greffe ne peuvent pas se coder sans : ce serait écrire des nombres d'image à la main. À instruire dans un thread à part. |
| La famille Adaptation ⚪ | 🔴 | 9 septembre 2026 | La doctrine est revenue (six scènes) ; le témoin et la page du kit (`/adaptation`, 🟡, huit épreuves vertes) la portent. Le 10 septembre, la posture est entrée dans l'ADN (S7 ⚪, `POSTURE` au moteur : quatre états physiques, quatre postures, sources Apple / Android / Samsung / W3C sur la page). Aucune règle au banc : les A1–A14 écrites sans la doctrine sont à réaligner sur ses identifiants (I, C, P, V, S). Bloquée sur la mesure du texte à trois valeurs (16/70, 17/62, 65ch). Les seuils du site : le gabarit est passé aux sommes le 11 septembre (rail 58 rem, bande, tables, liste, la tranche de /rythme) ; 26 seuils de scène restent, figés dans `LAYOUTS.sceneThresholds`, à résorber page par page. `data-adaptation` est devenu `data-stack` (11 septembre). |

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
| `fili.labels.json` | dépôt | Le catalogue de libellés. |
| `fili.registry.json` | dépôt | Ce que le Gardien lit pour statuer. |
| `fili.geometry.json` | dépôt | La géométrie dérivée de l'Échelle — pièce générée, jamais éditée. |
| `src/geometry.generated.css` | dépôt | Les vingt-trois tokens fluides — pièce générée, jamais éditée. |
| `witnesses/before-after-2026-08-11.html` | dépôt | Les sept gabarits dans leurs deux états, côte à côte, pour la séance. |
| `claude/migration-echelle-correspondance.md` | projet | La table de correspondance ligne à ligne de la migration. |
| `fili.assertions.json` | dépôt | Le manifeste des assertions déclarées. |
| `fili/geometry.json` | dépôt | La géométrie, dérivée de l'Échelle. **Vérifiée contre la source** (`#060`), deux écarts déclarés. |
| `fili/lexicon.json` | dépôt | La correspondance avec l'outil de l'Auteur. Refuse de statuer si un token cité manque. |
| `public/system/index.html` | dépôt | **Le système au complet, sur une page** — cartographie des dénominateurs, espaces, couleurs, texte, composants, règles, lexique. Générée. |

---

## 7. Ce que cette carte ne dit pas

Elle ne dit pas si le produit est **bon**. Vingt-neuf assertions au vert
signifient qu'aucune des fautes nommées n'est présente ; elles ne disent rien du
parti visuel, de la hiérarchie perçue ni du ton. C'est la Voie B qui le dira, et
elle n'a pas encore parlé une seule fois.
