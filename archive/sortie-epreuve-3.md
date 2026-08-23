# Sortie — épreuve 3 : GPT

*Mesuré le 2026-08-12, sur un écran servi en local. Même demande banale, **même
liste de contrôles et même seuil**, figés avant l'épreuve 1.*

**Réserve déclarée, et elle est lourde** : le dossier du projet n'était pas
accessible. La mesure porte sur **la page rendue** — le document et sa feuille de
style — et non sur le code source. Tout ce qui vit uniquement dans le source
(styles posés dans l'attribut par le programme, branches non affichées, imports)
n'a pas pu être lu.

---

## Le verdict : NON CONCLUANT

C'est le troisième sort déclaré avant l'épreuve 1 : *« moins de trois contrôles
parlent — le corpus ne saurait pas juger du code qu'il n'a pas écrit, et c'est une
réponse aussi. »* Il vient de se produire.

**Un seul des treize contrôles a quelque chose à dire.** Les douze autres lisent
des classes utilitaires. Cet écran n'en contient **aucune** : il est écrit en CSS
ordinaire, avec trente et un noms de classes qui décrivent des rôles —
`topbar`, `matter-row`, `status-en-cours`, `folder-box`.

---

## Ce que ça révèle sur nous, et c'est le vrai résultat

**Notre cadre n'est pas un cadre de design. C'est un cadre Tailwind.**

Les treize contrôles réputés « capables de juger n'importe quel code » jugent en
réalité *une façon d'écrire du code*. Changez d'outil de style — CSS ordinaire,
modules, styled-components — et l'appareil entier devient muet. Ce n'est pas une
faiblesse d'implémentation, c'est une erreur de définition : **on avait rangé ces
treize contrôles du bon côté du tri, et le tri était faux.**

La règle, elle, tient. C'est l'instrument qui regarde au mauvais endroit.

---

## Ce que dit la mesure à la main, hors corpus

Faute d'instrument, voici ce qu'on lit à l'œil et au relevé. **Ces chiffres ne
comptent pas dans le verdict** — ils sont donnés parce qu'ils sont vrais.

| | Gemini | Figma Make | GPT |
|---|---|---|---|
| Couleurs déclarées | 0 | 0 | **7, nommées par rôle** |
| Couleurs empruntées à une librairie | 121 | 18 | **0** |
| Valeurs d'espacement distinctes | 51 | 33 | **38, aucune nommée** |
| Espacements passant par une variable | 0 | — | **0 sur 68** |
| Tailles de texte distinctes | 5 | 5 | **12, dont du 9 et du 10** |

**Sur la couleur, c'est le meilleur des trois, et de loin.** Sept teintes, choisies,
déclarées une fois, nommées par leur rôle — encre, atténué, crème, papier, trait,
sarcelle, terre. Aucune palette de librairie. C'est exactement la doctrine de Fili,
écrite par quelqu'un d'autre.

**Sur le rythme, c'est le pire des trois.** Trente-huit valeurs d'espacement
différentes, soixante-huit déclarations, **et pas une seule qui passe par une
variable**. La couleur a été pensée comme un système ; l'espace a été posé au jugé,
valeur par valeur.

**Sur la typographie, c'est un vrai risque.** Douze tailles là où nous en admettons
six, et deux d'entre elles descendent à neuf et dix. Sous cette taille, un texte en
capitales espacées n'est plus lu : il est deviné.

---

## Et il faut le dire : c'est le plus beau des trois

Titre éditorial en deux temps, italique de rappel, palette crème, bandeau de
chiffres **sans une seule surface**, respiration large. Il y a là une intention
d'auteur que les deux autres n'ont pas.

**Le plus beau des trois est celui que notre cadre ne sait pas juger**, et le seul
des trois qui ait une palette digne de ce nom est celui qui a le rythme le plus
désordonné. Ces deux phrases, mises côte à côte, valent tout le reste de la
journée.
