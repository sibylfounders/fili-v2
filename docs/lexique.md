# lexique.md — Les mots de Fili

> Document vivant. Un mot, une notion. Il dit **quel mot on écrit**, ce qu'il
> désigne, et pourquoi ce mot-là. Il ne raconte pas les décisions : c'est le
> rôle de `journal.md`.
>
> Ouvert le 2026-09-08 sur verdict d'Auteur. Fonds de recherche :
> `claude/lexique-conventions-france-2026-09-08.md` (usage en France : DSFR,
> FranceTerme, Alsacréations, Ippon, Usabilis, Hacq, Design Tokens Book).

## La règle — quatre lignes (🟢 verrouillée le 2026-09-08)

1. **Un terme de métier reste en anglais** quand c'est ainsi que la profession
   française l'écrit : token, pattern, prop, slot, viewport, gap, fallback,
   override, easing, plugin, playground.
2. **Un concept perceptif ou typographique s'écrit en français** : espacement,
   graisse, interlignage, arrondi, ombre, survol, thème sombre, durée, courbe.
3. **Un composant se nomme en français si le mot français désigne déjà l'objet**
   (modale, infobulle, carte, menu déroulant), **en anglais sinon** (toast,
   drawer, skeleton, chip, badge, tag). On ne traduit pas pour traduire.
4. **La prose est française, le code est anglais.** Tout identifiant — fichier,
   fonction, variable, type, classe CSS, variable CSS, clé JSON, attribut
   `data-*` — s'écrit en anglais. Le texte lu par un humain — interface,
   commentaires, titres d'épreuves, documents — reste en français.

Ce que la règle 1 entérine : la règle 1 du glossaire de restitution
(« les anglicismes de métier restent en anglais ») vaut désormais pour tout
Fili, pas seulement pour la couche de lecture (V0 du vocabulaire v1, tranché).

## Les termes de métier

| On écrit | Ce que ça désigne | Pourquoi ce mot |
|---|---|---|
| **token** | une valeur nommée du système (couleur, espace, durée, rayon…) | usage France sans exception, DSFR compris ; « jeton » n'existe qu'en glose |
| **token primitif · token sémantique · alias** | les trois étages : la valeur brute, la valeur qui porte un sens, le nom qui pointe sur un autre | usage France (Usabilis, UX France) ; le DSFR dit « options » et « décisions » |
| **composant** | une responsabilité visuelle réutilisable | français sans exception |
| **pattern** | une composition de plusieurs composants | usage France ; le DSFR contourne avec « modèles », on ne le suit pas |
| **variante** (prose) · `variant` (code) | une déclinaison à sémantique constante | règle 4 |
| **prop · slot** | jargon React | jamais traduits |
| **fondation** | la matière : couleur, typo, rythme, composition, arrondis, mouvement | le DSFR dit « fondamentaux » ; « fondation » est le mot de Fili depuis juillet |
| **thème clair · thème sombre** | les deux versants | DSFR ; « dark mode » reste du jargon oral |
| **grille · gouttière · conteneur** | la structure de page | français installé (DSFR) |
| **breakpoint** (code) · **point de rupture** (prose) | une largeur où la mise en page change | la traduction a gagné en prose (DSFR), le code reste anglais |
| **viewport · gap** | la fenêtre d'affichage ; l'espace entre enfants | aucune traduction en usage |
| **package** | un workspace npm | le mot npm ; « paquet » garde son sens de *lot* (voir plus bas) |
| **plugin** | le plugin Cowork `design-system-md` | V11 tranché : *kit* = `@fili/react`, *package* = un workspace npm, *plugin* = le plugin Cowork |
| **kit** | le site du kit et ses composants (`fili-v2/kit`) | mot de Fili |
| **fallback · override** | une valeur de repli ; une surcharge | le DSFR les écrit tels quels |
| **easing** (code) · **courbe** (prose) | la courbe d'accélération d'un mouvement | le kit dit « courbe » depuis août et ça se lit ; `easing` en code |
| **letter-spacing** (code) · **approche** (prose) | l'espace ajouté entre les lettres | typographie française ; `letter-spacing` en code |
| **skeleton** | le composant d'attente qui annonce la page | aucun équivalent installé |
| **drawer** | le panneau qui coulisse depuis un bord | aucun équivalent installé |
| **toast** | la notification brève | idem |
| **chip · badge · tag** | trois petits objets, trois usages | le DSFR garde badge et tag tels quels ; chip n'a pas d'équivalent |
| **modale · infobulle · carte · tuile · menu déroulant** | — | traductions installées (DSFR) |
| **empty state** | l'écran sans donnée | usage France (« état vide » minoritaire) — en prose Fili dit « vide » quand le contexte suffit |
| **playground** | l'espace d'essai d'un composant | usage France ; « bac à sable » désigne autre chose |
| **déprécié · version · notes de version** | — | français installé (DSFR) |

## Les mots de Fili — pas des traductions, des notions

Ils ne traduisent rien : ils nomment des objets que Fili a inventés. Ils restent
en français dans la prose, et prennent un nom anglais **en code** selon la
règle 4 (le dictionnaire de migration fait foi : `docs/migration-code-en.json`).

| Mot | Ce qu'il désigne | En code |
|---|---|---|
| **coque** | le premier niveau de la page, sa marge extérieure | `shell` |
| **socle** | la base d'un calcul du moteur (racine, densité) | `base` |
| **cran** | un pas de l'échelle (espace, taille, rayon) | `step` |
| **chaîne** | la suite des crans dérivés du socle | `chain` |
| **registre** | la table des valeurs qu'une page lit | `registry` |
| **moteur** | `kit/derivation.mjs` : ce qui dérive les tokens du socle | `engine` |
| **épreuve** | un test qui rejoue une règle sur la page rendue | `test` (fichiers `*.test.mjs`) |
| **banc** | la course complète des épreuves, six pages | `bench` |
| **crash-test** | l'épreuve binaire qui verrouille un sujet | `crash-test` |
| **paquet** | un lot — de pages dans l'index, de règles dans une reprise | `batch` |
| **gabarit** | la structure documentaire commune des pages | `template` |
| **rail · tiroir → drawer · marque** | les trois pièces de navigation du gabarit | `rail` · `drawer` · `brand` |
| **atelier** | la couche où l'on écrit à la main | `workshop` |
| **motif** | la raison écrite d'une décision | `reason` |
| **verdict** | ce qu'une épreuve conclut, ou ce que l'Auteur tranche | `verdict` |
| **rôle** | un token sémantique de couleur (`--bg`, `--text-primary`) | `role` |
| **voix** | un registre typographique (courante, mécanique, affiche) | `voice` |

## Ce qui ne bouge pas

Les entrées passées du journal sont scellées : elles gardent leurs mots
d'époque (« jeton », « tiroir »). Un mot d'époque dans une entrée datée n'est
pas une faute, c'est de l'histoire.

## Journal du lexique

- **2026-09-08** — ouverture. La règle en quatre lignes, V0 et V11 tranchés,
  quatre francisés relevés dans le kit (jeton, squelette, tiroir, paquet-npm)
  et la migration du code vers l'anglais décidée.
