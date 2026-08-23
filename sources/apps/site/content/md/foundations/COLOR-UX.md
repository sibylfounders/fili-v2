---
component: color
layer: ux
type: foundation
version: 2.0.0 # 2.0.0 : REPRISE AU MOULE V2 — le 4e paquet de la reprise des lois de l'étude entre au corpus (thread « la couleur entre au kit », 2026-08-23 ; paquet rédigé le 2026-08-13, claude/reprise-couleur-regles.md). Les 25 lois du fonds deviennent : un principe de tête (« par rôle, jamais par valeur » — verdict du ménage), seize règles C1–C16 (énoncé + mesure décidable + test + dépendance + verdict), trois mesures de rendu M1–M3 pour le futur instrument, trois pièces de référence. L'arbitrage d'Auteur du texte pâle (2026-08-13) ferme la contradiction S14 par le haut : la norme ne connaît pas d'exception « métadonnées », aucun jeton de texte ne descend sous le seuil (C9) — l'ex-R12 est renversée en le disant, la dette « liste fermée » du ménage est dissoute. La famille entre au kit avec ses valeurs résolues en clair ET en sombre (kit/app/tokens.css), gris pâle remonté d'emblée. Le CRITERE de la 1.4.0 est conservé à l'identique (porté par M1). Historique antérieur : voir 1.5.0 dans l'historique git.
last_updated: 2026-08-23
companion: COLOR-UI.md
confidence: mixed # les registres, les seuils et la mécanique des thèmes sont établis (WCAG, convergence des grands systèmes) ; le sur-test du survol (C8), l'attente du désactivé (C11) et l'interdit du panneau sombre sont des partis pris datés, dits comme tels
---

# Couleur — Couche UX (fondation) · moule V2

> Ce fichier contient les règles : rôles, registres, redondance, contraste,
> theming. Les **valeurs** (hex) vivent dans le fichier de valeurs unique du
> registre — dans le kit : `kit/app/tokens.css` (sortie jumelle
> `tokens.tailwind.mjs`) — et n'en bougent pas : cette fondation ne déplace
> pas la source de vérité, elle documente comment s'en servir.

## 0 · Ce que la reprise couvre

Le fonds (1.5.0) comptait 25 lois. Après le ménage des lois douteuses : la
note d'ouverture (R01) est **jetée**, la recette de teintage (R20) est
**fusionnée** dans la loi qu'elle mettait en œuvre (C15), le principe de
clôture (R25) devient le **principe de tête**. Restent **22 lois vivantes** :
16 se vérifient dans le code (§2), 3 seulement sur la page affichée (§3),
3 sont des principes ou garde-fous d'usage (§4).

## 1 · Le principe de tête *(provenance : COLOR-R25, verdict du ménage)*

**La couleur s'applique par rôle, jamais par valeur — et un rôle ne porte
jamais deux sens.** Chaque fois qu'une valeur est choisie « parce qu'elle est
jolie ici », c'est le signe qu'un rôle manque ou qu'un registre fuit. Tout ce
que ce principe exige est porté par les règles ci-dessous.

## 2 · Les seize règles (vérifiables dans le code)

### C1 — La valeur vit dans un seul fichier *(provenance : COLOR-R02)*

**Énoncé** : le rôle d'une couleur et sa valeur sont deux décisions
distinctes ; les composants référencent le rôle, la valeur vit dans une
source unique et peut changer entièrement sans qu'aucune règle bouge.
**Mesure** : aucune valeur de couleur en dur hors du fichier de valeurs
unique.
**Test** : piégée — un code couleur écrit dans un composant → rouge.
**Dépendance** : le fichier de valeurs.
**Verdict** : ✅ actée (paquet du 2026-08-13, entrée au corpus le 2026-08-23).

### C2 — Trois registres étanches *(provenance : COLOR-R03)*

**Énoncé** : la palette se répartit en trois registres — marque, sémantique,
neutres — et chaque jeton appartient à exactement un.
**Mesure** : chaque jeton de couleur est rattaché à exactement un registre.
**Test** : piégée — un jeton déclaré dans deux registres → rouge.
**Dépendance** : le registre des jetons.
**Verdict** : ✅ actée.

### C3 — Une couleur ne change jamais de registre *(provenance : COLOR-R04)*

**Énoncé** : jamais la marque pour un état, jamais un état pour du décor —
dans les deux sens.
**Mesure** : aucun jeton de marque employé pour un ton sémantique, et
réciproquement.
**Test** : piégée — le bleu de marque utilisé comme ton d'information → rouge
(le cas historique du fonds : l'information a reçu son propre bleu).
**Dépendance** : le registre.
**Verdict** : ✅ actée.

### C4 — La marque tient en peu de rôles, tous consommés *(provenance : COLOR-R05)*

**Énoncé** : le registre marque se limite aux rôles fonctionnels existants ;
une teinte purement décorative ne reçoit pas de jeton — un jeton naît d'un
besoin réel, et un rôle sans consommateur ne reste pas (précédent du fonds :
un rôle est sorti le jour où sa mission lui a été reprise).
**Mesure** : tout jeton de marque est référencé par au moins un rôle
fonctionnel documenté.
**Test** : piégée — un jeton de marque sans consommateur documenté → rouge.
**Dépendance** : le registre.
**Verdict** : ✅ actée. *Application au kit : un seul rôle de marque entre
(l'accent, avec son couple) — la seconde voix du registre historique n'a pas
de consommateur dans le kit et n'entre pas tant qu'elle n'en a pas.*

### C5 — Le couple complet dès la naissance *(provenance : COLOR-R06)*

**Énoncé** : toute nouvelle valeur sémantique fournit son couple texte/fond
subtil d'emblée ; les neutres vivent en échelle.
**Mesure** : tout jeton sémantique possède son couple complet dès son
introduction.
**Test** : piégée — un ton d'alerte sans son fond subtil → rouge.
**Dépendance** : le registre.
**Verdict** : ✅ actée.

### C6 — Le canal redondant se déclare *(provenance : COLOR-R08)*

**Énoncé** : chaque usage sémantique de la couleur déclare un canal non
chromatique — icône, mot ou forme — qui ne se retire jamais pour alléger.
C'est la moitié vérifiable du principe « jamais la couleur seule » (§4).
**Mesure** : chaque ton sémantique porte au moins un signal non chromatique
déclaré.
**Test** : piégée — une erreur signalée par la seule couleur du bord → rouge.
**Dépendance** : les composants typés (le canal se déclare chez eux).
**Verdict** : ✅ actée.

### C7 — Le contraste se vérifie par paire *(provenance : COLOR-R10)*

**Énoncé** : un jeton de texte n'est jamais conforme dans l'absolu — il l'est
sur un fond donné. Chaque jeton de texte déclare ses fonds d'usage ; tout
fond non déclaré est interdit.
**Mesure** : la table des paires existe ; chaque paire déclarée passe son
seuil, calculé depuis les valeurs ; tout emploi hors paire déclarée est une
faute.
**Test** : piégée — un texte posé sur un fond non déclaré → rouge (le cas
vécu du fonds : conforme sur blanc, recalibré pour tenir sur fond subtil).
**Dépendance** : la table des paires (fichier de valeurs).
**Verdict** : ✅ actée. *Dans le kit, la table des paires est mesurée sur la
page rendue, dans les deux thèmes (page vivante Couleur).*

### C8 — Le survol testé au même seuil *(provenance : COLOR-R11)*

**Énoncé** : la norme exempte le survol ; ce système le teste quand même — un
survol illisible reste un survol raté. Sur-exigence assumée, dite comme
telle.
**Mesure** : les paires des états de survol passent le même seuil que le
repos.
**Test** : mutation — retirer les paires de survol du calcul, une piégée doit
passer au vert.
**Dépendance** : la table des paires.
**Verdict** : ✅ actée.

### C9 — Aucun jeton de texte sous le seuil *(provenance : COLOR-R12, arbitrée le 2026-08-13)*

**Énoncé** : **aucun jeton de texte du registre ne descend sous le seuil de
lisibilité sur ses fonds déclarés, dans les deux thèmes.** Arbitrage d'Auteur
du 2026-08-13 : la norme ne connaît que trois exceptions (grand texte,
logotype, texte décoratif ou inactif) et « métadonnées accessoires » n'en est
pas une — la contradiction que le fonds gardait ouverte (S14) est fermée par
le haut. L'ex-R12 est renversée en le disant.
**Mesure** : chaque jeton de texte passe le seuil sur chacun de ses fonds
déclarés, dans chaque thème.
**Test** : piégée — un jeton de texte à 2,5:1 dans le registre → rouge.
**Exécution** : faite dans le kit à l'entrée de la famille — la famille naît
sans jeton de texte pâle sous le seuil ; la hiérarchie des métadonnées se
joue par le corps et la graisse, plus par la pâleur. *(Le registre historique
du témoin garde son `text-muted` : hors périmètre de ce thread, dette dite.)*
**Dépendance** : le fichier de valeurs.
**Verdict** : ✅ actée, exécution portée au kit ce jour.

### C10 — Les états sont des jetons, pas des calculs *(provenance : COLOR-R13)*

**Énoncé** : les états interactifs sont portés par des jetons dédiés, jamais
calculés à la volée dans une feuille de style.
**Mesure** : aucune couleur d'état produite hors jeton — ni filtre, ni
assombrissement calculé.
**Test** : piégée — un survol obtenu par un filtre d'assombrissement → rouge.
**Dépendance** : le registre.
**Verdict** : ✅ actée.

### C11 — Le désactivé attend son besoin *(provenance : COLOR-R14)*

**Énoncé** : l'état désactivé n'a pas de jetons tant qu'aucun composant ne
documente un besoin légitime ; le jour venu, le couple complet
fond/texte/bordure naît en une seule fois. Dette assumée, écrite, avec sa
condition de sortie.
**Mesure** : aucun jeton de désactivé dans la table de valeurs (tant que la
condition de sortie n'est pas remplie et journalisée).
**Test** : piégée — un jeton de désactivé glissé sans décision journalisée →
rouge.
**Dépendance** : le registre et le journal.
**Verdict** : ✅ actée.

### C12 — Un jeton, une valeur par thème *(provenance : COLOR-R15)*

**Énoncé** : dans un système à thèmes, chaque jeton de couleur résout une
valeur par thème déclaré — c'est la condition d'existence d'un second thème.
**Mesure** : chaque jeton résout une valeur pour chaque thème déclaré.
**Test** : piégée — un jeton sans valeur sombre dans un système à deux
thèmes → rouge.
**Dépendance** : le fichier de valeurs.
**Verdict** : ✅ actée. *Le kit déclare deux thèmes dès l'entrée de la
famille.*

### C13 — Le sombre est couvert, et vérifié comme le clair *(provenance : COLOR-R16)*

**Énoncé** : chaque rôle résout une valeur en clair et en sombre, le thème
sombre s'active sur la préférence du système, et les seuils se vérifient
thème par thème. (Le fonds consigne l'histoire : cette règle a menti une
fois — la doctrine disait « non couvert » pendant que la distribution livrait
le sombre ; c'est la doctrine qui a bougé.)
**Mesure** : valeur claire et sombre pour chaque rôle ; les paires garanties
passent leurs seuils dans les deux thèmes.
**Test** : piégée — une paire conforme en clair, sous le seuil en sombre →
rouge.
**Restes hérités du fonds, en partie soldés** : la table des paires en sombre
est désormais mesurée sur la page vivante du kit, dans les deux thèmes ; le
passage d'un instrument automatique de seuils sur le sombre reste à
construire (M1).
**Dépendance** : la table des paires, par thème.
**Verdict** : ✅ actée.

### C14 — Les deux textes garantis, du même côté *(provenance : COLOR-R18)*

**Énoncé** : deux textes garantis sur un même fond ne peuvent tous deux
atteindre le seuil que s'ils tombent du même côté de l'échelle de
luminance — d'où la contrainte démontrée : un thème sombre ne peut pas avoir
une couleur d'action sombre.
**Mesure** : le double seuil est vérifié simultanément pour les deux textes
garantis sur chaque fond concerné.
**Test** : piégée — une couleur d'action sombre en thème sombre → rouge par
calcul.
**Dépendance** : la table des paires.
**Verdict** : ✅ actée. *Le kit s'y conforme : l'accent s'éclaircit en thème
sombre.*

### C15 — Teinter un neutre ne coûte rien, à luminance constante *(provenance : COLOR-R19, recette de l'ex-R20 en note)*

**Énoncé** : le rapport de contraste ne dépend que de la luminance relative ;
teinter un neutre en conservant sa luminance ne change aucun rapport —
l'opération est sûre par construction. *(Note d'exécution, héritée de la
recette fusionnée au ménage : conversion dans l'espace perceptif, clarté
figée, teinte posée, puis recalage fin de la luminance d'origine.)*
**Mesure** : rapport de contraste identique avant et après teinte, à
luminance relative inchangée.
**Test** : piégée — un gris teinté dont la luminance a glissé → rouge par
calcul.
**Dépendance** : le fichier de valeurs.
**Verdict** : ✅ actée.

### C16 — Les couleurs forcées ne se neutralisent jamais *(provenance : COLOR-R21)*

**Énoncé** : quand le système d'exploitation force ses couleurs, la palette
disparaît — on ne neutralise jamais ce mode, et l'interface s'appuie sur ce
qui survit : la sémantique, les bordures, le texte.
**Mesure** : aucune déclaration de neutralisation du mode forcé hors
correctif d'accessibilité justifié et déclaré.
**Test** : piégée — la neutralisation posée globalement → rouge.
**Dépendance** : aucune.
**Verdict** : ✅ actée.

## 3 · Les trois mesures de rendu (pour le futur instrument — pas construit ici)

| Mesure | Provenance | Ce que l'instrument vérifiera |
|---|---|---|
| M1 · Le contraste rendu | COLOR-R09 | texte courant au seuil sur la page affichée (le critère du fonds n'automatise que cette clause ; « ce qui identifie un contrôle » reste un jugement, dit au fonds) — l'une des deux lois déjà outillées qui n'ont trouvé aucune faute dans l'étude : là où la discipline existait, elle a tenu |
| M2 · Jamais de texte nu sur image | COLOR-R22 | sur image imprévisible : un voile calculé ou le texte sorti du média ; contraste au pire pixel |
| M3 · Le voile est un calcul | COLOR-R23 | l'opacité du voile calculée sur le pire pixel derrière chaque zone de texte, revérifiée à chaque format — le cadrage déplace le pire pixel |

Le critère exécutable posé en 1.4.0 sur R09 est conservé à l'identique, porté
par M1 :

```
CRITERE : chaque("body *") contraste(color) >= 4.5
          ou mesure(font-size) >= 24 et contraste(color) >= 3
          ou mesure(font-size) >= 18.66 et mesure(font-weight) >= 700 et contraste(color) >= 3
```

> **Portée du critère** : il n'automatise que la clause texte / fond. La
> seconde — « composant ou état requis pour l'identifier » — suppose de
> savoir ce qui *identifie* un contrôle, jugement non décidable par un
> script. M1 est donc partiellement automatisable, et ne prétend pas au
> reste.

## 4 · La référence (hors règles)

- **Jamais la couleur seule** (COLOR-R07, WCAG 1.4.1) : le principe
  cardinal — savoir ce qui porte l'information est un jugement ; sa moitié
  vérifiable est C6. Erreur fréquente : croire qu'un contraste suffisant
  règle le problème — le contraste rend lisible, il ne distingue pas un
  rouge d'un vert pour qui ne voit pas la différence.
- **Le panneau sombre n'est pas un thème** (COLOR-R17) : garde-fou d'usage —
  la surface sombre de mise en avant ne se généralise pas en « thème sombre
  local ».
- **La table de risques** (COLOR-R24) : conservée en grille de relecture ;
  chaque risque renvoie désormais à une règle ou une mesure d'ici.

| Cas | Risque principal | Règle |
|---|---|---|
| Information portée par la couleur seule | Exclusion daltonisme (WCAG 1.4.1) | C6 · réf. |
| Texte courant sous 4,5:1 | Illisible pour basse vision (WCAG 1.4.3) | C7, C9, M1 |
| État visible / bordure délimitante sous 3:1 | Composant invisible (WCAG 1.4.11) | C7, M1 |
| Marque utilisée en sémantique (ou l'inverse) | Vocabulaire chromatique détruit | C3 |
| Valeur hex hors du fichier de valeurs | Rebranding impossible, dérive de palette | C1 |
| Texte posé sur un fond non déclaré | Contraste non garanti | C7 |
| Jeton de texte pâle sur du texte fonctionnel | Métadonnée illisible promue au rang d'information | C9 |
| Couleurs forcées neutralisées | Mode d'accessibilité système cassé | C16 |
| Texte nu sur image | Contraste imprévisible | M2, M3 |

## 5 · Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Jamais la couleur seule comme signal | [WCAG 2.1 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html) ; repris tel quel par [Polaris](https://polaris.shopify.com/design/colors) | Établi, standard d'accessibilité |
| S2 | Seuils 4,5:1 texte / 3:1 non-texte, y compris les états ; exemption du survol ; exemption des composants inactifs | [WCAG — 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) et [1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | Établi |
| S3 | Jetons de rôle plutôt que valeurs (« on-primary rather than on-blue ») | [Material 3 — color roles](https://developer.android.com/design/ui/mobile/guides/styles/color), [Atlassian](https://atlassian.design/foundations/color), [Carbon](https://carbondesignsystem.com/elements/color/usage/), [GOV.UK — colour](https://design-system.service.gov.uk/styles/colour/) | Établi — convergence des quatre systèmes |
| S4 | Interdiction outillée des hex en dur | [Polaris — stylelint color-no-hex](https://polaris.shopify.com/tools/stylelint-polaris/rules/color-color-no-hex), [GOV.UK brand](https://brand.design-system.service.gov.uk/colour/web/) | Établi — deux systèmes l'imposent par l'outil |
| S5 | Sémantique ≠ marque, chaque couleur un sens fixe | [Atlassian](https://atlassian.design/foundations/color), [Polaris](https://polaris.shopify.com/design/colors) | Établi par convergence |
| S6 | Un jeton = N valeurs par thème ; pas de thème sombre sans jetons partout | [Atlassian](https://atlassian.design/foundations/color), [Carbon — themes](https://carbondesignsystem.com/elements/themes/overview/) | Établi chez les systèmes à thèmes |
| S7 | Registres étanches marque/sémantique/neutres | Structure convergente (Atlassian, Polaris) + garde-fou interne préexistant | Établi par convergence, formalisation propre |
| S8 | Le rapport de contraste vaut (L1 + 0,05) / (L2 + 0,05) : il ne dépend que de la luminance relative | [WCAG 2.2 — contrast ratio / relative luminance](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio) | Établi, définition normative — fonde C7, C14, C15 |
| S9 | En couleurs forcées, l'agent utilisateur impose ses couleurs : fonds subtils aplatis, traits et texte survivent | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi, comportement plateforme |
| S10 | forced-color-adjust: none ne sert qu'à améliorer l'expérience du mode, jamais à l'empêcher | [MDN — forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust) | Établi |
| S11 | L'OS expose une préférence clair/sombre lisible par la page | [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) ; [MDN — color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) | Établi, mécanisme plateforme |
| S12 | Sur fond non uniforme, le contraste se mesure contre les pixels derrière chaque lettre ; voile localisé admis | [WCAG — Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18) | Établi — fonde M2 et M3 |
| S13 | oklch() : lightness perceptuelle, chroma, teinte — l'espace de travail du teintage à luminance constante | [CSS Color Module Level 4 — oklch()](https://www.w3.org/TR/css-color-4/) | Établi, spécification W3C |
| S14 | WCAG 1.4.3 ne connaît que trois exceptions au seuil — aucune ne couvre les métadonnées accessoires | [WCAG 2.2 — 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Établi — la contradiction relevée le 2026-07-27 est **fermée par C9** (arbitrage du 2026-08-13) |

*Toute règle sans source explicite repose sur un précédent interne
journalisé — c'est la fondation du système la plus adossée à des cas vécus.*

## 6 · Limites dites

- Seize règles actées ne sont pas seize assertions : chacune peut mourir à la
  batterie le jour où un contrat s'ouvre. Aucun contrat n'est ouvert ni
  rouvert par cette reprise.
- C6 s'appuie sur les composants typés (S1) pour le lieu de déclaration du
  canal redondant.
- Le passage d'un instrument automatique de seuils sur le thème sombre reste
  à construire (M1) ; en attendant, la table des paires du kit est mesurée
  sur la page rendue, dans les deux thèmes.
- La remontée du gris pâle est exécutée dans le registre du kit ; le registre
  historique du témoin n'est pas touché par ce thread.
