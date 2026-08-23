# Sortie — épreuve 2 : Figma Make

*Mesuré le 2026-08-12, sur un écran de gestion de dossiers produit par Figma Make,
même demande banale qu'à Gemini. **La liste des contrôles autorisés et le seuil de
succès n'ont pas bougé** — ils sont ceux figés avant l'épreuve 1. C'est ce qui rend
les deux mesures comparables.*

*Réserve déclarée : le jeu de données de démonstration a été raccourci de dix
lignes à cinq pour la mesure. Aucune classe, aucune couleur, aucun espacement n'a
été touché.*

---

## Les contrôles qui ont parlé — 7 sur 13

| Contrôle | Ce qu'il a trouvé | Réel ? |
|---|---|---|
| T5 — espacement hors échelle | **78 fois**, 33 valeurs différentes | oui |
| T13 — couleur hors palette | **18 fois**, 17 couleurs différentes | oui |
| balise nue | 10 boutons natifs | oui |
| espace posé par l'enfant | 8 marges extérieures | oui |
| T4 — valeur inventée entre crochets | 3 — dont un facteur d'écrasement au clic | oui (1 sur 3) |
| titre surchargé | 2 | oui |
| style posé sur l'élément | 1 — la fonte, écrite dans l'attribut | oui |

## Les contrôles muets — 6 sur 13

Aucune couleur en dur, aucune longueur en dur, aucune durée en dur, cinq tailles
de texte, aucun mouvement interdit, aucune donnée cherchée par la fenêtre.

## Le verdict

**Succès**, au même seuil que l'épreuve 1 : sept contrôles trouvent du réel (seuil
six), deux refus injustes (seuil cinq).

---

# Ce que la comparaison montre, et c'est le vrai résultat

## 1. Quand l'IA a un cadre, elle le tient

Figma Make écrit **78 couleurs sémantiques** — `bg-card`, `text-foreground`,
`bg-primary`, `text-muted-foreground` — 23 noms distincts. Il ne nomme presque
jamais une couleur : il nomme un **rôle**. C'est exactement la discipline que Fili
demande.

| | Gemini | Figma Make |
|---|---|---|
| Couleurs nommées « en clair » | **121** | **18** |
| Couleurs nommées par leur rôle | 0 | **78** |
| Espacements hors échelle | 119 | 78 |

**Le nombre de refus de fond passe de 240 à 96.** Un outil qui a un système de
jetons produit trois fois moins de désordre, sans qu'on lui ait rien demandé.

## 2. Il sort du système exactement là où il faut dire un sens

Les dix-sept couleurs en clair qui restent sont **toutes** dans deux endroits : le
jeton de statut (ouvert, en cours, résolu, fermé) et le jeton de priorité (haute,
normale, basse). Partout ailleurs, le rôle suffit ; dès qu'il faut dire *ce que ça
veut dire*, l'outil retombe sur le bleu, l'ambre, le vert, le rouge.

**C'est précisément le trou que Fili prétend combler.** Notre doctrine dit qu'un
état s'emploie par couple déclaré — une surface et ce qui s'écrit dessus — et que
le sens ne se lit jamais à la couleur seule. Le meilleur outil du marché n'a pas
cette pièce.

## 3. Notre contrôle de couleur est aveugle à un autre vocabulaire

`bg-card` et `text-foreground` ne viennent pas de notre palette, et **T13 ne les
voit pas** : il ne connaît que les familles livrées par défaut avec l'outil. Chez
nous ces classes ne compileraient pas — la porte est fermée — mais **aucun message
ne nommerait la faute**. Un écran écrit dans un autre vocabulaire de jetons
traverserait notre contrôle en silence. Charge ouverte.

## 4. Le mur d'espacement, lui, n'a pas bougé

78 espacements hors échelle, 33 valeurs différentes. Aucun outil ne résout ça tout
seul, parce qu'aucun n'a d'échelle nommée. **La conclusion de l'épreuve 1 tient :
sans outil de traduction, le cadre reste inadoptable sur du code existant.**

---

## Deux trouvailles hors liste — signalées, non comptées

- **Un bloc non interactif qui porte un clic.** Invisible au clavier, muet au
  lecteur d'écran. Faute d'accessibilité réelle, et la plus grave des deux
  épreuves.
- **Sept classes d'espacement construites par assemblage.** Même faute que chez
  Gemini, et c'est ce qui rend une partie du désordre invisible aux contrôles.
