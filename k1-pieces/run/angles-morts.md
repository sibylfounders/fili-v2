# angles-morts.md — ce que le corpus n'a pas tranché

Le corpus impose ici une contrainte sans trancher le choix qu'elle appelle.
Chaque fois, la règle appliquée est celle du **moindre écart** : l'option la plus
proche de l'existant, jamais la plus belle. Chaque décision est réversible et
n'appartient qu'à l'Auteur.

## 1. Quelle densité pour quelle section

**Ce que le corpus exige** — R4.2 : chaque section déclare une densité de
l'échelle. R4.3 : pas plus de deux sections consécutives de même densité.
**Ce qu'il ne dit pas** — laquelle pour quelle section.
**Choix** — `compact · normal · compact · compact`. Base `compact` parce que la
densité `compact` vaut 32 px de respiration verticale, soit exactement le
`p-8` / `mb-8` / `mt-8` que le fichier portait partout. Une seule substitution
suffit à satisfaire R4.3 ; elle est posée à la première position admissible
(la deuxième section) et vaut `normal`, le pas immédiatement voisin de
`compact`. Aucune section n'est passée en `ample`.

## 2. Le pas de chaque `Pile`

**Ce que le corpus exige** — R3.2 : l'espace est distribué par le conteneur.
**Ce qu'il ne dit pas** — quelle valeur de l'échelle donner au conteneur qui
remplace une marge.
**Choix** — le pas qui reproduit à l'identique la valeur retirée :
`mt-1` → `espace={1}` (4 px), `mt-2` / `mb-2` → `espace={2}` (8 px),
`mt-3` / `mb-3` → `espace={3}` (12 px), `mb-4` → `espace={4}` (16 px).
Deux écarts différents dans un même bloc ont produit deux `Pile` imbriquées
plutôt qu'un écart unique moyenné : niveler aurait déplacé des espaces qu'aucune
assertion ne demandait de déplacer.

## 3. La forme du squelette de chargement

**Ce que le corpus exige** — R2.2 / R2.5 : le slot `chargement` existe et n'est
pas muet.
**Ce qu'il ne dit pas** — combien de lignes, ni si le mouvement est conservé.
**Choix** — `<Squelette lignes={2} />`, deux lignes comme les deux barres du
squelette artisanal d'origine. Conséquence assumée : le `animate-pulse` disparaît,
le composant du registre ne portant pas d'animation. Aucun mouvement n'a été
ajouté ni redéfini ailleurs.

## 4. Les identifiants des champs

**Ce que le corpus exige** — R1.1 : le champ passe par un composant du registre,
lequel réclame un `id` pour lier son `label` à son `input`.
**Ce qu'il ne dit pas** — la valeur de l'`id`.
**Choix** — `id="client"` et `id="statut"`, dérivés des libellés existants
(« Client », « Statut »), qui ne sont pas modifiés.

## 5. Balise de titre native ou composant `Titre`

**Ce que le corpus exige** — R4.5 : aucune taille de titre surchargée localement.
**Ce qu'il ne dit pas** — si le titre doit devenir `<Titre niveau={n}>`. La liste
fermée de R1.1 ne contient aucune balise de titre, et R1.3 ne statue que sur les
composants.
**Choix** — les `h1` / `h2` / `h3` natifs sont conservés, seule la classe de taille
est retirée. Raison : le passage à `<Titre>` aurait fait disparaître les `id` des
`h2`, donc cassé les trois `aria-labelledby` des sections — une régression
d'accessibilité qu'aucune assertion ne demandait. Les classes de couleur et de
graisse sont conservées telles quelles.

## 6. Liste native ou conteneur du registre

**Ce que le corpus exige** — rien sur `<ul>` / `<li>` : aucune assertion ne les
vise.
**Ce qu'il ne dit pas** — s'il faut préférer `Grille` / `Pile`.
**Choix** — `<ul>` et `<li>` conservés, avec leur `gap-4` et leur `p-5` qui sont
déjà de l'échelle. Passer à `Grille` aurait remplacé une liste par des `div` et
retiré la sémantique de liste au lecteur d'écran.

## 7. Ce que les composants d'état emportent avec eux

**Ce que le corpus exige** — R2.5 : un slot rempli rend au moins un composant du
registre.
**Ce qu'il ne dit pas** — ce qu'il advient des attributs et des classes portés par
la boîte artisanale que le composant remplace.
**Choix** — le contenu textuel est conservé mot pour mot ; l'habillage passe au
composant. Trois pertes, notées et non compensées, parce que ni `Alerte` ni `Vide`
n'exposent la prop correspondante : `role="alert"` de la boîte d'erreur devient le
`role="status"` d'`Alerte` ; les couleurs locales de la boîte d'erreur
(`border-red-200 bg-red-50`) et le `text-center` de l'état vide cèdent la place à
celles du système. Aucune classe n'a été ajoutée pour les rattraper.

## 8. Où vivent les états non nominaux

**Ce que le corpus exige** — R2.1 : la donnée distante est rendue à travers le
conteneur d'état déclaré. R2.4 : les drapeaux ne se lisent pas hors du conteneur.
**Ce qu'il ne dit pas** — à quel endroit de la page le conteneur se place.
**Choix** — le conteneur est posé dans la section « Les factures », celle qui lit
la donnée, alors que le fichier d'origine remplaçait la page entière par son
chargement et par son erreur. C'est la position qui déplace le moins de contenu :
l'en-tête, les filtres et l'action restent visibles dans les quatre états.
