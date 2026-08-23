# Sortie — épreuve 1 : du code d'IA, sans le cadre

*Déclaré le 2026-08-12, **avant** d'avoir regardé le code.*

Un écran de tableau de bord fabriqué par une IA qui n'a jamais entendu parler de
Fili, à partir d'une demande banale. On mesure ce que le cadre en dit.

---

## 1. Le tri du corpus — figé avant la mesure

La moitié de nos contrôles suppose nos propres composants. Ils ne peuvent rien
dire d'un code qui ne les connaît pas, et les compter serait tricher dans un sens
comme dans l'autre. La liste ci-dessous est arrêtée maintenant et ne bougera plus.

**Ont le droit de parler — ils jugent n'importe quel code (13)**

| Contrôle | Ce qu'il juge |
|---|---|
| T1 | une couleur écrite à la main |
| T2 | une longueur écrite à la main |
| T3 | une durée écrite à la main |
| T4 | une valeur inventée entre crochets |
| T5 | un espacement hors échelle |
| T6 | plus de six tailles de texte |
| T13 | une couleur hors de la palette calculée |
| T14 | un mouvement autre que la respiration du squelette |
| T17 | une donnée cherchée hors de la couche de données |
| balise nue | un élément interactif natif au lieu d'un composant |
| espace par l'enfant | une marge extérieure qui pousse ses voisins |
| titre surchargé | une taille de titre forcée sur place |
| style sur l'élément | une valeur posée directement dans l'attribut de style |

**N'ont pas le droit de parler — ils supposent nos pièces (9)**

T7 (nos jetons), T8 (notre compilation), T9 (test du test), T10, T11, T12, T15,
T16 (nos composants Pile / Jeton / Texte), plus les règles d'état et d'arbitrage
de lecture qui supposent nos crochets et nos sections.

---

## 2. Les trois chiffres — déclarés avant la mesure

1. **Fautes réelles attrapées.** Ce que le cadre refuse et qui est vraiment un
   défaut. Compté par contrôle, pas par message : un même défaut lève souvent
   plusieurs messages.
2. **Refus injustes.** Ce que le cadre refuse alors que c'est juste, ou
   défendable. C'est le chiffre qui décide si c'est un cadre ou un mur.
3. **Laideurs qui passent.** Ce qui traverse tout et reste laid. **Donné par
   l'Auteur, à l'œil.** Aucune machine ne le produira.

## 3. Ce qui vaut succès — déclaré avant la mesure

- **Succès** : au moins six des treize contrôles trouvent quelque chose de réel,
  et les refus injustes tiennent sur une main.
- **Échec** : plus de refus injustes que de fautes réelles — le cadre serait un
  mur.
- **Non-concluant** : moins de trois contrôles parlent — le corpus ne saurait pas
  juger du code qu'il n'a pas écrit, et c'est une réponse aussi.

**On ne corrige rien pendant la mesure.** Corriger pendant, c'est mesurer autre
chose. Le verdict est écrit même s'il est mauvais.

---

# Le résultat

*Mesuré le 2026-08-12, sur un écran de tableau de bord produit par Gemini.
Le code n'a pas été touché. Rien n'a été corrigé.*

## Les contrôles qui ont parlé — 8 sur 13

| Contrôle | Ce qu'il a trouvé | Réel ? |
|---|---|---|
| T13 — couleur hors palette | **121 fois**, 35 couleurs différentes | oui |
| T5 — espacement hors échelle | **119 fois**, 51 valeurs différentes | oui |
| balise nue | 22 boutons et champs natifs | oui |
| espace posé par l'enfant | 19 marges extérieures | oui |
| T2 — longueur écrite à la main | 2 (10 et 11) | oui |
| T4 — valeur inventée entre crochets | 2 | oui |
| titre surchargé | 3 | oui |
| T14 — mouvement | 1 — l'ouverture de la fenêtre modale | **non** |

## Les contrôles muets — 5 sur 13, et ils ont eu raison de se taire

Aucune couleur écrite en dur. Aucune durée écrite en dur. Aucun style posé sur
l'élément. Cinq tailles de texte, pas plus. Aucune donnée cherchée par la
fenêtre. **La machine qui a écrit cet écran est plus disciplinée que celle qu'on
avait simulée hier.**

## Deux refus injustes

- **L'ouverture de la fenêtre modale.** Notre règle dit « rien ne tourne dans le
  vide » et n'admet qu'une animation, la respiration du squelette. Elle a été
  écrite contre le rond qui tourne pendant une attente ; elle refuse ici une
  animation d'entrée, qui n'est pas la même chose. **La règle est trop large d'un
  cran.**
- **L'import de React.** Un contrôle de provenance refuse une source non déclarée
  au registre. Sur du code étranger, ça ne dit rien de la qualité de l'écran.

## Deux trouvailles hors liste — signalées, non comptées

La liste était figée : ces deux-là ont parlé alors qu'elles n'y étaient pas. On
les note, on ne les compte pas.

- **Quatre classes d'espacement construites par concaténation.** Une règle
  contournable par assemblage de morceaux n'est pas une règle — et c'est
  exactement ce que fait cet écran pour ses états de filtre.
- **Un saut de titre, du niveau 1 au niveau 3.** Faute d'accessibilité réelle.

## Le verdict

**Succès**, selon le seuil déclaré avant la mesure : sept contrôles sur treize
trouvent du réel (le seuil était six), et les refus injustes tiennent sur une
main (deux).

**Mais le chiffre qui compte n'est pas là.** Deux cent quarante refus sur un seul
écran, ce n'est pas deux cent quarante décisions à prendre : c'est **deux**
— adopter la palette, adopter l'échelle. Le reste est de la traduction mécanique.
Tant qu'on n'a pas l'outil qui traduit, le cadre est un mur pour qui arrive avec
du code existant, quelle que soit la justesse de ses refus.

**Ce qui a trouvé, ce n'est pas ce qu'on croyait.** Les contrôles historiques du
projet — la couleur écrite en dur, la durée en dur, le style sur l'élément — n'ont
rien trouvé du tout. Ce qui a trouvé, c'est la fermeture de la palette et
l'échelle d'espacement, toutes deux branchées dans les deux derniers jours.
