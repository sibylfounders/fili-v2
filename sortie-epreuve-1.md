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
