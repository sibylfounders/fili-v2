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
> 4. Chaque entrée porte le **sens produit et UX**, pas la justification technique
>    seule. « Pourquoi l'utilisateur s'en porte mieux » avant « pourquoi c'est
>    plus propre ».
> 5. Toute alternative sérieusement envisagée puis écartée est nommée, avec le
>    motif du rejet. Une décision sans alternative écartée est une décision non
>    instruite.

**Format d'une entrée**

```markdown
## #00N — <Titre de la décision>
*2026-08-06 · Statut : 🟡 En cours | 🟢 Verrouillé | ⛔ Révisée par #00M*

**Contexte** — ce qui a rendu la décision nécessaire.
**Décision** — ce qui est acté, en une phrase affirmative.
**Sens produit / UX** — ce que l'utilisateur final y gagne.
**Alternatives écartées** — X (motif), Y (motif).
**Conséquences** — ce que ça engage, ce que ça ferme, la dette éventuelle.
**Impact carte** — les nœuds de `system-map.md` que ça déplace.
```

---

## #008 — La CI est le seul lieu où la batterie tourne en entier
*2026-08-06 · Statut : 🟡 En cours · Complète : #007*

**Contexte** — Le hook `pre-commit` de `#007` passe `--no-build` : deux builds
complets à chaque commit rendraient le garde-fou insupportable, donc contourné.
Conséquence assumée mais gênante : **S2-T8 n'était exécuté nulle part**. Un test
qui n'a pas de lieu d'exécution est un test qui n'existe pas.

**Décision** — `.github/workflows/qpm.yml` sur GitHub Actions, déclenché sur
`push` et `pull_request`. La CI exécute la batterie S2 **sans** `--no-build` —
c'est le seul endroit où T8 tourne, donc le seul endroit qui peut verrouiller S2.

**Sens produit / UX** — Le hook et la CI ne font pas le même métier. Le hook
protège l'auteur de lui-même, vite, à chaque sauvegarde ; la CI protège
l'utilisateur final, complètement, avant que le code ne l'atteigne. Séparer les
deux permet que le contrôle quotidien reste rapide sans que le contrôle réel ne
soit jamais sauté. Un garde-fou lent finit contourné ; un garde-fou incomplet
finit inutile — il en faut deux.

**Choix de conception** — `npm ci` et non `npm install` : une CI qui résout ses
versions à chaud ne prouve rien sur ce qui tournera en production.
`permissions: contents: read` (doctrine R3, moindre privilège). `concurrency`
avec annulation : les runs obsolètes ne se mélangent pas aux nouveaux. Un step
vérifie que le test de mutation a bien **restauré** le fichier qu'il a muté —
un test qui salit l'arbre de travail est un test qui finira désactivé. Un step
final publie le périmètre et le coût mesurés (règle d'or n°5).

**Alternatives écartées** — Faire tourner la batterie complète dans le hook
(deux builds par commit → `--no-verify` deviendrait l'habitude, et le garde-fou
mourrait de sa propre sévérité) ; un job par test pour un statut granulaire
(quatre `npm ci` au lieu d'un, pour un gain de lisibilité qui ne change aucune
décision) ; `continue-on-error` sur le lint le temps de la mise en place
(rouvre le « PASS avec réserve » par la porte de service).

**Ce qui reste non protégé** — Le fichier de CI ne bloque rien par lui-même :
sans **branch ruleset** côté GitHub, une PR rouge reste fusionnable. Les
réglages exacts sont dans le `README`, dont le plus important : *Do not allow
bypassing*. Une protection contournable par son auteur n'est pas une protection.
Dette **D10**.

**Impact carte** — `Intégration continue` passe 🟡 ; dette **D10** ouverte.

---

## #007 — Le garde-fou est branché à git, sans dépendance
*2026-08-06 · Statut : 🟡 En cours*

**Contexte** — Depuis `#005`, les crash-tests existent et passent. Mais rien ne
les déclenchait : `npm run qpm` ne s'exécutait que si quelqu'un y pensait. Et le
journal affirmait « on n'édite jamais une entrée passée » sans qu'aucun
mécanisme ne le garantisse — le dépôt n'était pas versionné.

**Décision** — `git init`, premier commit du socle, et un hook `pre-commit` dans
`.githooks/` activé par `git config core.hooksPath .githooks`. Il lance S2
(toujours), puis `tsc` et `eslint` si `node_modules` existe.

**Sens produit / UX** — Un contrôle qualité qui repose sur la discipline cède au
moment exact où il servirait : sous pression, la veille d'une livraison. Le
brancher sur le commit le rend structurel plutôt que volontaire. Et versionner
le journal transforme sa règle d'immuabilité d'une promesse en un fait
vérifiable : une entrée réécrite se voit dans le diff.

**Alternatives écartées** — `husky` + `lint-staged` (le garde-fou dépendrait
alors d'un `npm ci` réussi — un install raté le ferait disparaître en silence,
et un garde-fou qui s'évapore sans bruit est pire que pas de garde-fou) ;
CI seule (arrive trop tard, après le push, quand le contexte est déjà perdu).

**Arbitrage assumé** — Le hook passe `--no-build` : deux builds complets à chaque
commit rendraient le hook insupportable, donc contourné. S2-T8 y reste **BLOQUÉ**,
jamais PASS. Le build reproductible se vérifie en intégration, pas à chaque
sauvegarde. `--no-verify` reste possible : un contournement se déclare ici, il ne
se cache pas.

**Conséquences** — Ajout de `.nvmrc` (Node 22), `engines`, `.editorconfig`.
Le `git init` exécuté depuis le pont a laissé ~30 fichiers `.lock` et
`tmp_obj_*` résiduels dans `.git/` : le pont interdit `unlink`. Le commit est
valide, mais `.git/index.lock` bloquera le prochain commit tant qu'il n'est pas
supprimé à la main. Dette **D8**.

**Impact carte** — Nouveau bloc `Gouvernance du dépôt` 🟡 ; dette **D8** ouverte.

---

## #006 — Première exécution de la chaîne de preuve sur machine réelle
*2026-08-06 · Statut : 🟡 En cours · Complète : #005*

**Contexte** — Le socle a été installé sur la machine d'Aurélien
(`~/Claude/Projects/Fili/fili-v2`), `npm install` a abouti. Pour la première
fois, l'outillage déclaré depuis `#004` pouvait réellement tourner.

**Décision** — S2-T8 n'est plus un test « BLOQUÉ » de principe : il est
**implémenté** — deux `npm run build` successifs, hash SHA-256 de l'intégralité
du CSS émis, comparaison stricte. Un drapeau `--no-build` permet de le sauter
explicitement, et dans ce cas il reste BLOQUÉ, jamais PASS.

**Sens produit / UX** — Un build non reproductible signifie que ce que voit
l'utilisateur dépend de la machine qui a compilé. C'est le point où la qualité
perçue cesse d'être gouvernable : on ne peut pas garantir un rythme spatial ou
un contraste qu'on ne sait pas reproduire à l'identique.

**Résultats mesurés** — `eslint .` : **0 erreur, 0 warning** à sa première
exécution, avec toutes les règles a11y et les trois interdits durs en `error`.
`tsc -b --noEmit` : **0 erreur**. S2-T1 à T7 : PASS. S2-T9 mutation : PASS.

**Ce qui n'est pas prouvé** — S2-T8 n'a **pas** été confirmé par moi. Mon canal
d'accès au disque (pont device) interdit `unlink` sur les dossiers montés, donc
le `rmSync(dist)` du test échoue avec `EPERM` **chez moi et pas chez lui**. Le
FAIL que j'observe est un artefact d'outil, pas un défaut du code — mais je ne
peux pas le déclarer PASS à sa place. **S2 reste 🟡** jusqu'à une exécution dans
un terminal natif. Requalifier un FAIL en PASS sur la foi d'un raisonnement,
c'est exactement ce que le contrat de verrouillage interdit.

**Alternatives écartées** — Marquer T8 « PASS (artefact d'environnement) »
(rouvre la porte au « PASS avec réserve », qui vide le contrat de sa substance) ;
neutraliser `rmSync` pour contourner l'EPERM (rétrécirait le test pour le faire
passer — interdit par le point 5 du contrat).

**Impact carte** — Dette **D1** levée. Dette **D4** levée : la chaîne de preuve
a11y a tourné. S2 : 8/9 tests verts, verrouillage suspendu à T8.

---

## #005 — La batterie S2 est exécutable sans dépendances, et elle a d'abord accusé à tort
*2026-08-06 · Statut : 🟡 En cours*

**Contexte** — Les 4 batteries écrites en `#004` risquaient de rester des
intentions : toutes supposaient un outillage installé, et le registre npm est
hors allowlist du bac à sable. Une batterie qui n'a jamais tourné ne garde rien.

**Décision** — S2 est implémenté en **Node pur, zéro dépendance**
(`scripts/qpm-s2.mjs`). Le crash-test qui garde le cadre ne dépend pas de la
production qu'il contrôle : il tourne avant même `npm install`.

**Sens produit / UX** — Un garde-fou qui s'installe est un garde-fou qu'on
désinstalle. En le rendant exécutable à froid, on retire le seul argument qui
fait sauter les contrôles qualité en fin de projet : « on n'a pas le temps de
mettre en place l'outillage ». La qualité perçue survit aux fins de sprint
seulement si sa vérification coûte une commande.

**Alternatives écartées** — Attendre `npm install` (repousse indéfiniment la
première exécution, et une batterie non exécutée n'est pas une batterie) ;
brancher S2 sur `eslint-plugin-tailwindcss` seul (couvre T4, pas T1/T5/T6/T7,
et introduit une dépendance dans le garde-fou lui-même).

**Le fait marquant** — À la première exécution, **S2-T5 a produit un FAIL sur
`gap-x-8` et `gap-y-3`**. Le code était conforme : c'est la regex du test qui
découpait mal la forme à axe détaché (`gap-x-8` → `x-8`). J'ai corrigé **le
test**, pas le produit. C'est la distinction qui décide de la crédibilité d'un
crash-test : on ne rétrécit jamais le périmètre pour faire passer un test, mais
on corrige un faux positif — et on le trace, sinon la correction devient
indistinguable de la triche.

**Résultat d'exécution** — 7 PASS · 0 FAIL · 1 BLOQUÉ (S2-T8, `npm install`
requis) · S2-T9 mutation PASS : l'injection de `#3B82F6` est bien détectée.
**S2 reste donc 🟡** : le contrat exige 100 % de PASS, et un BLOQUÉ n'est pas un
PASS. Sept tests verts ne verrouillent rien tant que le huitième n'a pas tourné.

**Impact carte** — S2 documenté avec son résultat d'exécution daté ; dette
**D1** devient bloquante pour le verrouillage de S2, pas seulement pour le dev.

---

## #004 — La Qualité Perçue Minimale se découpe en 4 Sujets, chacun gardé par une batterie déterministe
*2026-08-06 · Statut : 🟡 En cours*

**Contexte** — Le garde-fou n°2 interdit d'avancer tant que la QPM n'est pas
verrouillée à 100 %. Encore fallait-il savoir ce qu'on verrouille, et contre
quoi. Une QPM formulée en intentions (« que ce soit propre ») n'est pas
verrouillable : elle se re-discute à chaque écran, elle se négocie sous pression
de planning, et elle finit par céder.

**Décision** — La QPM se découpe en 4 Sujets — **S1 Contrat d'états**,
**S2 Rythme &amp; échelle**, **S3 Latence perçue**, **S4 Accessibilité perçue** —
et chacun est gardé par une batterie de tests **binaires, mesurés et
reproductibles**. Un sujet ne passe 🟢 qu'à 100 % de PASS sur 100 % du périmètre.
Un seul FAIL laisse la porte fermée. Il n'existe pas de « PASS avec réserve ».

**Sens produit / UX** — Ces 4 sujets ne sont pas 4 exigences techniques : ce sont
les 4 façons dont un utilisateur décide, en deux secondes et sans vocabulaire
pour le dire, qu'un produit est bâclé. Un écran qui saute pendant le chargement,
un cadre vide sans explication, un focus invisible, un espacement qui change de
règle d'une carte à l'autre — chacun coûte une fraction de confiance, et la
confiance ne se regagne pas au même prix qu'elle se perd. Chiffrer ces 4 sujets,
c'est retirer la qualité perçue du terrain du goût, où elle perd toujours
l'arbitrage, pour la mettre sur celui de la conformité, où elle le gagne.

**Alternatives écartées** — Une checklist qualitative relue en revue de design
(non déterministe : deux relecteurs, deux verdicts ; et elle cède la veille d'une
livraison) ; un score composite pondéré type « 85/100 » (permet de compenser une
accessibilité absente par un joli rythme spatial — exactement ce que le
garde-fou n°2 interdit) ; s'en remettre au seul `axe-core` (couvre ~30 % des
non-conformités, produirait un faux verrou sur S4).

**Conséquences** — Les 4 sujets passent ⚪ → 🟡 : instruits et gardés, pas
verrouillés. Ils ne peuvent pas passer 🟢 aujourd'hui, pour deux raisons
déclarées : l'outillage de preuve n'est pas installé (**D4**) et il n'existe
aucun composant à soumettre au périmètre (**D5**). Les seuils chiffrés — CLS
≤ 0,02, ≤ 6 tailles typographiques, INP ≤ 200 ms — sont posés par défaut et non
encore éprouvés (**D6**) ; ils se révisent par une entrée au journal, jamais en
silence pendant une exécution. Chaque batterie embarque un **test de mutation** :
une batterie qu'on ne sait pas faire passer au rouge ne prouve rien.

**Impact carte** — S1 à S4 passent 🟡 ; nouvelle section `2 bis. Crash-tests de
verrouillage` ; dettes **D5** et **D6** ouvertes.

---

## #003 — Tokens sémantiques en custom properties, pas encore Style Dictionary
*2026-08-06 · Statut : 🟡 En cours*

**Contexte** — La règle d'or n°1 interdit les valeurs en dur dans les composants.
Mais l'échelle typographique et spatiale n'est pas arrêtée : c'est précisément
l'objet du Sujet S2 de la Qualité Perçue Minimale.

**Décision** — Les tokens sont déclarés comme custom properties CSS dans
`src/index.css` et exposés à Tailwind sous des noms **sémantiques**
(`surface`, `ink`, `border`, `accent`), jamais littéraux (`blue-600`).

**Sens produit / UX** — Un nom sémantique force la question « à quoi ça sert »
avant « de quelle couleur c'est ». Le thème sombre devient une conséquence
mécanique et non une seconde interface à maintenir — donc une interface qui ne
trahit jamais l'utilisateur qui a choisi le mode sombre de son système.

**Alternatives écartées** — Style Dictionary tout de suite (outil de build à
maintenir avant même de savoir quelle échelle on génère) ; classes Tailwind
littérales (`bg-white`, `text-neutral-900`) (rend le thème sombre manuel et
duplique la décision à chaque composant).

**Conséquences** — Dette **D3** : migration vers Style Dictionary une fois S2
verrouillé. Le contrat de nommage ne changera pas, seule la source changera.

**Impact carte** — `Socle technique › Tokens` passe 🟡.

---

## #002 — Page d'accueil d'attente en HTML brut, écart déclaré
*2026-08-06 · Statut : 🟡 En cours*

**Contexte** — Il faut un point d'entrée qui prouve que la chaîne de build
fonctionne, sans qu'aucun Design System n'existe encore.

**Décision** — `src/App.tsx` est une page statique en HTML sémantique, sans
interaction ni donnée. L'écart à la règle d'or n°1 (HTML brut) est **déclaré**
en tête de fichier et daté, pas subi.

**Sens produit / UX** — Une page d'attente honnête vaut mieux qu'un faux
dashboard : elle dit où en est le projet plutôt que de simuler un produit.
Elle sert aussi de premier test de contraste et de lisibilité à 320 px.

**Alternatives écartées** — Conserver la démo Vite (bruit visuel, logos tiers,
compteur sans finalité — de la négligence au sens du garde-fou n°3) ; page vide
(ne prouve rien, ne teste ni le CSS ni les tokens).

**Conséquences** — Dette **D2** : l'écart se referme à la création des premiers
composants typés. Aucun état asynchrone ici, donc la règle d'or n°4 n'a rien à
honorer sur cet écran — ce sera à documenter dès le premier composant réel.

**Impact carte** — `Socle technique` passe 🟡, dette D2 ouverte.

---

## #001 — Socle Vite + React + TypeScript strict + Tailwind
*2026-08-06 · Statut : 🟡 En cours*

**Contexte** — Le projet FILI V2 a besoin d'un environnement d'exécution pour
que les règles de gouvernance aient quelque chose à gouverner. Le socle doit
être lisible par un designer, pas seulement par un développeur.

**Décision** — Vite (build), React 19 + TypeScript en mode `strict` (contrat de
types), Tailwind CSS 3.4 avec `tailwind.config.js` (échelle centralisée).

**Sens produit / UX** — Le rechargement instantané de Vite raccourcit la boucle
« je change / je vois », ce qui est la condition matérielle d'un travail de
qualité perçue : on ne règle pas un rythme spatial en 30 s d'attente par
itération. TypeScript strict rend les états impossibles détectables à
l'écriture, ce qui sert directement la règle d'or n°4.

**Alternatives écartées** — Next.js (SSR et routage non nécessaires à ce stade,
surface de configuration disproportionnée) ; Tailwind v4 (`@import "tailwindcss"`,
plus de `tailwind.config.js` — écarté car la config JS explicite est demandée et
reste plus lisible comme point de convergence des tokens) ; CSS Modules (échelle
non centralisée, chaque fichier redevient un lieu de décision).

**Conséquences** — Dette **D1** : les dépendances ne sont pas installées, le
registre npm étant hors allowlist du bac à sable cloud. `npm install` en local
suffit à lever la dette.

**Impact carte** — Création du bloc `Socle technique`.
