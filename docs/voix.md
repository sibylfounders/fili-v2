# voix.md — La voix du kit

> Document vivant. Il dit **comment on écrit** tout texte lu par un humain
> sur le kit : titres, chapôs, situations, verdicts, phrases des bandes,
> légendes, prose des dépliants, accueil. Le lexique dit quel mot ; ici, quel
> ton. La règle est éprouvée par le banc (`kit/tests/bench.mjs`,
> `faultsWriting`) pour ce qui se mesure, et par la relecture d'Auteur pour
> le reste.
>
> Retrouvée dans le blog de la v1 le 1er septembre (« Oui, tout le site. Ça
> doit être MA voix. »), calibrée pour le kit le 9 septembre sur six bandes
> de Rythme (« je valide le test de langage »).

## La règle — une voix, deux réglages (🟢 verrouillée le 2026-09-09)

**La voix** est celle de l'Auteur, écrite en tête de
`fili-v1/…/tools/blog-articles.js` : quelqu'un qui explique à un collègue,
pas une doc qui récite. Le concret avant l'abstrait. Une image par idée, pas
trois. Des phrases qui respirent. L'honnêteté visible. Le lecteur traité en
personne capable, jamais sermonné.

**Deux réglages**, parce que le blog et le kit ne font pas le même travail :

| | Le blog (v1) | Le kit |
|---|---|---|
| Cible | « cool, un poil plus sérieux » | « cool, deux crans plus sobre » |
| Le narrateur | « je » : un homme qui apprend | aucun — une règle montrée n'a pas de narrateur |
| Le lecteur | « vous », collègue-café | « vous » possible dans une explication ; jamais dans un verdict, jamais un ordre |
| L'ouverture | une scène de vie | la démonstration est la scène ; le texte commence par la conséquence concrète |
| L'image | une par section, tenue | une par idée, seulement si elle est plus exacte que le mot juste |
| La chaleur | dans le phrasé et le clin d'œil | dans la conséquence dite pour de vrai (« on tape l'adresse dans la case du téléphone ») |

## Ce que ça change, concrètement

1. **La conséquence fait le travail.** Une règle s'écrit par ce qu'elle
   évite : « le lecteur perd une demi-seconde à chercher où commence la
   suite », pas « la hiérarchie est affaiblie ».
2. **Le mot juste avant la métaphore.** « Le dedans et le dehors se règlent
   d'un seul chiffre » vaut mieux qu'une image de banc public quand l'image
   est moins exacte. Une métaphore qui reste doit être plus précise que le
   terme qu'elle remplace.
3. **On ne redit pas la scène.** Si la démonstration montre 24, 20, 16, 12,
   la phrase ne les récite pas.
4. **Une phrase forte peut ouvrir** (« L'œil compare, il ne compte pas »),
   puis le développement apporte ce que la scène ne montre pas : pourquoi,
   quand, la limite.
5. **Le verdict est une observation, au présent, sans personne** : « La
   commande ne remplit pas sa jauge : elle se rate au doigt ». Il commence
   par une majuscule, il tient en une ligne, il ne commande rien.
6. **La situation est une scène en une phrase, sans verbe d'ordre** : « Un
   lecteur agrandit le texte de moitié », « Trois commandes, touchées au
   doigt ».

## Le périmètre

**Se réchauffe** : le titre et le chapô de chaque section, la phrase de
chaque bande (`says`), la situation et les verdicts du cadre, les légendes
sans chiffre, la prose des dépliants « Règles & sources », l'accueil.

**Ne se touche jamais** : l'énoncé d'une règle (un contrat : ce qui est
permis, sans image), les sources et les liens, les cotes et les légendes
chiffrées (des mesures, pas des impressions), l'étage « dans le code », les
tableaux du répertoire.

## Les tics — ce que le banc refuse

Relevés sur les pages d'avant, mesurés par `faultsWriting` :

- un mot qui commande ou décrit l'écran (« Regardez », « Essayez »,
  « Cliquez », « Comme vous pouvez voir », « Cette démonstration ») ;
- « ni plus, ni moins » ; un chapô qui ouvre sur « Ici, » ;
- un narrateur : « je », « j'ai », « mon », « notre » dans une situation, un
  verdict ou la phrase d'une bande ;
- « vous » dans une situation ou un verdict ;
- un verdict ou une situation qui commence par une minuscule, ou qui dépasse
  deux lignes (160 signes) ;
- une phrase de bande sans conséquence : un `says` d'une seule phrase.

## La relecture d'Auteur — cinq questions, cinq oui

1. Ça commence par du concret — la conséquence ou la scène, le concept après.
2. Une image, et une seule — et elle est plus exacte que le mot qu'elle remplace.
3. Les phrases respirent — des longues et des courtes, jamais quatre du même
   calibre à la file.
4. On sourit sans faire le clown — le clin d'œil ne fait pas le numéro.
5. Rien n'est dilué — chiffres, nuances, limites, sources sont intacts.

Toute page nouvelle passe par les deux : le banc avant d'être montrée, la
relecture avant d'être verrouillée. Le banc de voix (l'avant et l'après côte
à côte, bloc par bloc) reste la pièce sur laquelle l'Auteur tranche.
