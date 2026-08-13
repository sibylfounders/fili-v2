# Chaîne de validation — journal du chantier

> Ouvert et mené le 2026-07-30, **par-dessus** le chantier Stabilisation 0.2 (lui aussi non
> commité). Aucun commit créé, aucune branche poussée. Le diagnostic d'entrée vit dans
> `VALIDATION-DIAGNOSTIC.md` ; la doctrine née de ce chantier vit dans
> `content/md/principles/VALIDATION-UX.md` ; les arbitrages sont journalisés dans
> `DECISIONS.md` (entrée du 2026-07-30, « VALIDATION »).

---

## 1. La décision d'architecture, en cinq lignes

1. **Un contrat atomique unique**, `packages/react/src/lib/validation.ts` — sans React, sans
   DOM, sans couleur. Il produit le verdict ; tout le reste en dérive.
2. **Une seule prise** sur les contrôles : la prop `verdict`. Aucun composant nouveau.
3. **Le bloc champ devient partageable** (`lib/field.tsx`) pour que `Select` le consomme au
   lieu d'en avoir un second. `Input.Field` reste le nom public.
4. **`status` et `error` survivent, requalifiés** : modes de présentation, pour les fixtures.
   Une garde structurelle refuse leur usage sans verdict dans une page réelle.
5. **Aucune API d'orchestration publique.** L'orchestration est prouvée dans la tranche
   pilote de l'Atelier ; sa promotion relève d'un arbitrage, pas de ce chantier.

---

## 2. Fichiers touchés

### Créés (8)

| Fichier | Rôle |
|---|---|
| `packages/react/src/lib/validation.ts` | le contrat — types, normalisation, priorité, obsolescence, projections, agrégation |
| `packages/react/src/lib/field.tsx` | le bloc champ partagé + le message de verdict (écrit une fois pour quatre consommateurs) |
| `apps/site/content/md/principles/VALIDATION-UX.md` | le principe « Validation et récupération » (17 règles) |
| `apps/site/content/md/inventaires/inventaire-cas-usage-validation.md` | la carte de couverture, frontières comprises |
| `apps/site/app/ui/formulaire-pilote.tsx` | la tranche verticale, jouable dans l'Atelier |
| `packages/react/src/components/__tests__/validation-contrat.test.tsx` | le contrat pur |
| `packages/react/src/components/__tests__/validation-controles.test.tsx` | par contrôle + accessibilité |
| `packages/react/src/components/__tests__/validation-pilote.test.tsx` | intégration, scénario complet |
| `tools/plugin/rules/RULES-validation.md` | la fiche condensée embarquée par le paquet |
| `docs/chantiers/VALIDATION-DIAGNOSTIC.md` + ce fichier | diagnostic et journal |

### Modifiés (14)

`packages/react/src/index.ts` (export `Validation` + types) · `components/input/input.tsx` ·
`components/select/select.tsx` · `components/checkbox/checkbox.tsx` ·
`components/radio/radio.tsx` · `manifest/schema.ts` (`DeclarationValidation`) ·
`manifest/pilote.ts` (Input) · `manifest/catalogue.ts` (Select, Checkbox, Radio, Switch,
ThemeToggle) · `manifest.json` (régénéré) · `apps/site/app/ui/registry.tsx` (pilote + textes
par nature de donnée + fixtures déclarées) · `apps/site/lib/md.ts` (inventaire) ·
`apps/site/content/md/core/DECISIONS.md` · `tools/fili-check.mjs` ·
`tools/verifie-manifeste.mjs` · `tools/verifie-rendu.mjs` + `tools/teste-verifie-rendu.mjs` +
ses deux fixtures · `tools/plugin/config-intentions.js`.

---

## 3. Matrice de couverture par contrôle

| Contrôle | Rôle déclaré | Contraintes prises en charge | Message | Focus | Prouvé par |
|---|---|---|---|---|---|
| `Input.Input` (text) | `field` | requis, longueurs, pattern, verdict externe | `Input.Error` du bloc | l'élément natif, par `controlId` | contrat + contrôles |
| `Input.Input` (email) | `field` | `typeMismatch`, requis, serveur | idem | idem | contrat + contrôles + **pilote** |
| `Input.Input` (tel) | `field` | requis, verdict EXTERNE seulement — `tel` n'est pas un validateur | idem | idem | doctrine + inventaire (frontière) |
| `Input.Input` (url) | `field` | `typeMismatch`, requis | idem | idem | contrat |
| `Input.Number` | `field` | `badInput`, min, max, step, requis | idem | idem | contrat |
| `Input.Password` | `field` | requis + politique EXTERNE (aucune complexité imposée) | idem | idem | doctrine (frontière) |
| `Input.Search` | `field` (aucune contrainte par défaut) | aucune — une requête vide s'accepte ou s'ignore | idem | idem | doctrine + inventaire |
| `Input.Textarea` | `field` | requis, longueurs, verdict externe | idem | idem | contrat |
| `Select` | `field` | requis (natif en mode `native`), option indisponible, métier, serveur | bloc champ, ou message autonome | le déclencheur, par son `id` | contrôles + **pilote** |
| `Checkbox` (isolée) | `group` (prise `verdict` sur l'option) | requis / consentement obligatoire | sous l'option, associé | la case | contrôles |
| `Checkbox.Group` | `group` | requis, min, max, combinaison métier | rattaché au `fieldset` | première option (`id`) | contrôles + **pilote** |
| `Radio.Group` | `group` | requis, valeur indisponible, métier | rattaché au `fieldset` | option cochée, sinon la première | contrôles + **pilote** |
| `Switch` | `none` **justifié** | — effet immédiat, aucune soumission à bloquer | — | — | manifeste + garde |
| `ThemeToggle` | `none` **justifié** | — préférence d'affichage | — | — | manifeste + garde |

Aucun contrôle de formulaire du dépôt ne reste sans décision explicite : la garde du
manifeste le vérifie structurellement (AST), et elle a été **éprouvée en la faisant échouer**.

---

## 4. Ce que les gardes garantissent — et ce qu'elles ne garantissent pas

| Garde | Ce qu'elle prouve | Ce qu'elle NE prouve pas |
|---|---|---|
| `verifie-manifeste` (rôle de validation) | tout composant qui rend réellement un élément de formulaire déclare son rôle, et un rôle `field`/`group` est complet et testé | que la déclaration est *juste* — elle est lue, pas confrontée au comportement |
| `fili-check` `statut-sans-verdict` | aucune page réelle ne pose un statut ou un message d'erreur sans verdict | que le verdict posé est le bon ; ni les fixtures, déclarées à la ligne |
| `fili-check` `aria-invalid-manuel` | l'attribut n'est jamais écrit à la main dans une page | rien sur le kit lui-même, où il est légitimement dérivé |
| `verifie-rendu` `message-orphelin` | aucun `aria-describedby` / `labelledby` / `errormessage` ne pointe dans le vide, **identifiants générés compris** | seulement sur les pages construites et visitées |
| `verifie-rendu` `erreur-sans-message` | aucun `aria-invalid="true"` sans message associé | que le message dit *pourquoi* et *comment corriger* — cela reste une lecture humaine |
| `verifie-exemples` | les exemples canoniques compilent | qu'ils sont pédagogiquement justes |
| tests + harnais de fumée | la chaîne s'exécute réellement, du `ValidityState` au succès de soumission | le rendu visuel, les tailles, les contrastes |

**« Zéro erreur technique » ne dit rien des règles métier.** Aucune de ces gardes ne sait si
« au moins un centre d'intérêt » est la bonne contrainte : elle sait seulement que si le
produit la déclare, l'interface la tient.

---

## 5. Limites restantes, nommées

1. **Aucune API d'orchestration.** Un seul consommateur (le pilote) ; la primitive commune
   n'est pas démontrée par l'usage. À rouvrir au deuxième formulaire réel.
2. **Le résumé d'erreurs n'est pas un composant** — `Alert` + liens, composés dans le pilote.
   Même raison, même moment pour trancher.
3. **La famille du choix n'a pas de teinte d'avertissement.** Un `warning` sur une case ou un
   groupe de radios reste `default` et n'est porté que par son message. Décision UI à prendre
   dans `CHOICE-UI`, pas une astuce d'implémentation.
4. **`CHOICE` n'a pas de fiche condensée dans le paquet** (`tools/plugin/rules/`) — antérieur
   à ce chantier ; `RULES-validation` renvoie donc à `choice` sans pouvoir le charger.
5. **La stratégie de timing** (blur, différé, submit) n'est pas outillée : le pilote valide au
   submit. `FORM-R16` laisse le choix au formulaire ; la chaîne le permet, rien ne le facilite.
6. **Validation croisée** entre champs : le contrat sait porter le verdict, il ne le calcule
   pas. C'est une frontière (règle produit), pas un trou.
7. **`Input.Field required` ne pose pas l'attribut natif `required`** — l'appelant le passe au
   champ. Le pilote le fait ; rien ne l'y oblige.

---

## 6. Ce qui a été prouvé au Terminal, et ce qui reste

**`npm test` PASSE** (2026-07-30, après correctif) — 10 fichiers, 212 tests. Deux enseignements y sont journalisés :

1. `Select` appelait `scrollIntoView` sans garde ; jsdom ne l implémente pas, et une exception dans un effet passif fait démonter TOUT l arbre React. Défaut antérieur au chantier, corrigé dans le composant (`?.scrollIntoView?.()`, aussi dans `SkipLink`) — même convention que `ResizeObserver` ailleurs.
2. Six échecs venaient de mes propres tests : après un échec de soumission, chaque message existe **deux fois** (résumé + inline), et c est le contrat (FORM-R24). `getByText` lève sur ce que la doctrine EXIGE — les tests comptent désormais les occurrences. Au passage, un vrai défaut corrigé : le succès était annoncé deux fois (l alert de réussite est déjà `role="status"`).

## 6bis. Ce qui reste NON PROUVÉ depuis une session Cowork

Trois commandes ne s'exécutent ni dans le conteneur cloud ni sur la VM du pont. Elles ne sont
pas « vertes » : elles sont **non exécutées**, et c'est différent.

| Commande | Pourquoi | Palliatif exécuté ici |
|---|---|---|
| ~~`npm test`~~ **PASSE au Terminal** | vitest 4 → rolldown : bindings natifs `darwin-arm64` seulement — donc non exécutable *depuis Cowork* | harnais de fumée jsdom `_to_delete_rangement/_smoke-validation.mjs` — **62/62**, et éprouvé par réinjection de défaut (56/62 quand le verdict cesse de commander le statut). **Le harnais avait un angle mort** : il bouchait `scrollIntoView` au lieu de laisser le composant s en passer — `npm test` au Terminal l a révélé (7 échecs, une seule cause). Le bouchon a été retiré et la garde posée dans `Select` (et `SkipLink`), au même titre que `ResizeObserver` dans CardGroup. |
| `npm run build --workspace @fili/site` | `device_bash` plafonne à 45 s | `tsc --noEmit` du site passe |
| `npm run verifie:rendu` (site réel) | exige le build Next | l'auto-test des fixtures passe en cloud — **7 détections, 0 faux positif** |

## 6ter. La porte a rendu 0 — ce que ça prouve, et ce que ça ne prouve pas (2026-08-01)

```
npm run verifie   →  code de sortie 0        (HEAD af3f023)
```

La chaîne est commitée dans **`9a4b425`** — « La chaîne de validation est un GREFFON : une
erreur cesse d'être un style choisi, elle devient la conséquence d'un verdict », 38 fichiers.

### Ce qui est VÉRIFIÉ AUTOMATIQUEMENT, à chaque passage de la porte

| Garde | Ce qu'elle empêche | Résultat |
|---|---|---|
| `npm test` | qu'un comportement de la chaîne change sans qu'on le voie | **10 fichiers, 226 tests réussis** |
| `verifie:manifeste` | qu'un contrôle de formulaire naisse sans déclarer son `validation.role` — détection STRUCTURELLE en AST, pas textuelle | **30 composants, 0 incohérence** |
| `verifie:consommation` (`fili-check`) | `statut-sans-verdict` : un état d'erreur choisi à la main plutôt que descendu d'un verdict · `aria-invalid-manuel` : l'attribut écrit dans une page alors que le kit le DÉRIVE | conforme, constat à **0** |
| `verifie:rendu` (strict) | `message-orphelin` : un contrôle qui désigne un message inexistant · `erreur-sans-message` : un `aria-invalid` qui dit « refusé » sans dire pourquoi | **93 pages, 0 nouveau constat** |
| `verifie:tsc` | qu'un verdict soit passé là où le type ne l'admet pas | propre |

Les deux gardes de rendu existent parce que les identifiants sont **générés** (`React.useId`) :
aucune lecture de source ne peut confronter un `aria-describedby` à sa cible. Seul le rendu
voit l'identifiant final.

### Les limites TOUJOURS DÉCLARÉES — elles n'ont pas été levées

- **`ACCESSIBILITY-R18` n'est que partiellement automatisée.** Le critère vérifie qu'un message
  est *associé*, pas qu'il *décrit* la cause. La pertinence du texte reste un constat assisté.
- **Le plafond de vérification du focus est de 14 éléments par page** (`--focus <n>` pour le
  lever). Sur une page qui en porte davantage, la liste des écarts est un **plancher**, pas un
  inventaire : des éléments restent non éprouvés, et le rapport l'annonce.
- **Le bruit `HTMLCanvasElement.getContext`** vient d'axe-core sous jsdom, qui n'a pas de moteur
  de rendu. Il n'est pas supprimé, il est connu.
- **Le harnais de fumée `_to_delete_rangement/_smoke-validation.mjs` reste un palliatif**, pas
  une garde. Il avait un angle mort — il bouchait `scrollIntoView` — et c'est `npm test` qui l'a
  révélé. Un harnais qui polyfille une API absente ne prouve plus ce qu'il prétend.
- **Trois divergences de tokens sont déclarées** et le restent, dont l'écart de nommage entre
  la doctrine (`spacing.base`) et le thème émis (`--space-base`).

### Ce qui reste VOLONTAIREMENT HORS PÉRIMÈTRE

Aucune de ces lignes n'est une dette à résorber : ce sont des frontières choisies.

- **Pas d'orchestration en API publique** — un seul consommateur ne fait pas une API.
- **La validation croisée est une frontière produit**, pas une affaire de kit.
- **Une seule locale (`fr`).** Le contrat, lui, ne contient aucun texte : c'est le greffon qui
  porte `messagesFR`, et un jeu se surcharge au lieu de se recopier.
- **Le DÉLAI d'un `deferred` appartient au consommateur** — le contrat ne connaît pas le temps.
- **La famille du choix n'a pas de teinte d'avertissement** ; la décision revient à `CHOICE-UI`.
- **`CHOICE` n'a pas de fiche condensée dans le paquet.**
- **Le résumé d'erreurs reste composé** (`Alert` + liens), il n'est pas un composant.

---

## 7. Arbitrage du 2026-07-30 au soir — la démo cède la place à la table

La tranche pilote était **jouable** dans l'Atelier, et c'était son défaut : un formulaire au
repos ne montre rien. Ce qui se lit d'une chaîne de validation, ce n'est pas l'objet — c'est
ce que le système **dit** quand une valeur ne convient pas. Aurélien a tranché : retirer la
démo, mettre à sa place **la table des messages**.

- **Nouvelle entrée d'Atelier** « Messages de validation » (groupe Formulaire) : pour chaque
  contrainte de chaque contrôle — quand elle se déclenche, son **code stable**, sa source,
  et le **message de référence**. Trois familles : Saisie · Choix · Serveur. Le panneau de
  code donne l'objet prêt à coller dans un produit.
- **Les données vivent dans `apps/site/app/ui/messages-validation.ts`**, à un seul endroit.
  Elles appliquent une doctrine déjà écrite, elles n'en inventent aucune : `INPUT-R23` (dire
  *pourquoi* et *comment corriger*), `VOICE` (s'adresser, ne pas accuser), `INPUT-R31` (la
  qualification « Erreur : » est posée par le composant, jamais par le texte), `VALIDATION-R11`
  (un message écrit pour être lu SEUL, jamais empilé).
- **Le contrat reste sans texte.** Aucune de ces chaînes n'entre dans `@fili/react` : le
  contrat en RÉCLAME, il n'en fournit pas. Promotion possible en paquet de locale
  (`Validation.messagesFR`) — **arbitrage ouvert**, pas une décision d'implémentation.
- **`formulaire-pilote.tsx` n'est plus affiché mais reste en place**, avec un avertissement en
  tête : c'est la preuve exécutée de la chaîne (`validation-pilote.test.tsx` le rend en
  entier), et il vit sous `apps/site/app`, donc sous la garde `statut-sans-verdict`. Le
  déplacer dans `packages/` le retirerait de cette garde.

Effets de bord vérifiés après le remplacement : `tsc` vide, `verifie:consommation --strict`
propre, harnais de fumée **70/70**.

---

## 8. La chaîne devient un greffon (arbitrage Aurélien, 2026-07-30 au soir)

> « La chaîne de validation est un plus. Comme un plugin du kit. »

Ce n'est pas une nuance de rangement : c'est la frontière qui manquait, et elle tranche
d'un coup la contradiction que je traînais depuis le début du chantier — *comment livrer un
jeu de messages français sans mettre de français dans une mécanique portable ?*

| Ce qui vit où | |
|---|---|
| `@fili/react` — le NOYAU | la **prise** : la prop `verdict` de `Input.Field`, `Select`, `Checkbox`, `Checkbox.Group`, `Radio.Group`, et les **types** qui permettent de la déclarer (effacés à la compilation : coût nul pour qui ne valide pas) |
| `@fili/react/validation` — le GREFFON | le **contrat exécutable** (`Validation`) et le **jeu de messages** (`messagesFR`) |

- **Le précédent existait** : `@fili/react/manifest` n'entre pas non plus dans le baril. Le
  greffon suit la même mécanique — une entrée de plus dans `exports`, rien d'exotique.
- **Le noyau reste sans texte**, et le kit livre pourtant son wording. Les deux à la fois,
  parce qu'ils ne sont plus au même endroit.
- **`messagesFR` — 14 jeux** : texte · e-mail · téléphone · URL · mot de passe · quantité ·
  texte long · select · case isolée · groupe de cases · groupe de radios · serveur (champ) ·
  serveur (global) · attente. Chacun garde un `fallback` obligatoire.
- **Un jeu se surcharge, il ne se recopie pas** : `{ ...messagesFR.email, valueMissing: "…" }`.
  Le pilote le fait pour une seule phrase (« …pour créer le compte ») et hérite du reste.
- **La table de l'Atelier ne stocke aucun texte** : elle les lit dans `messagesFR` et
  n'ajoute que ce qu'elle seule possède — quand la contrainte se déclenche, d'où vient le
  verdict, et la nuance sans laquelle le message serait mal employé. La loi atomique vaut
  aussi pour des chaînes de caractères.
- **Conséquence assumée** : deux chemins d'import pour un même domaine. C'est le prix d'une
  frontière réelle.

Vérifié après le changement : `tsc` vide · manifeste cohérent · **39 exemples canoniques
compilent** (ils importent désormais le greffon) · `verifie:consommation --strict` propre ·
harnais de fumée **70/70** (il sert les deux points d'entrée séparément, comme le fera un
consommateur).

---

## 9. Le moment de la validation (arbitrage Aurélien, 2026-07-30)

Deux questions que j'avais confondues en une, et dont une était tranchée sans l'avoir été.

**Quand une erreur APPARAÎT — « au cas par cas ».** C'est déjà la doctrine (`FORM-R15/R16`) :
le secteur diverge réellement, et le bon choix dépend du risque d'erreur de format du champ.
Ce qui manquait, ce n'est pas une décision : c'est que la chaîne **outille** ce choix au lieu
de le laisser à du câblage dispersé. D'où `VALIDATION-R18` et `Validation.shouldValidate` —
une fonction pure, quinze lignes, qui répond à « faut-il juger maintenant ? » depuis quatre
faits : la stratégie déclarée du champ (`submit` · `blur` · `deferred`), ce qui vient de se
produire, si une erreur est déjà affichée, et si la première saisie est terminée. Le kit
n'impose aucun défaut ; il rend le choix **lisible dans une déclaration**.

**Quand une erreur DISPARAÎT — à la revalidation.** Là, j'avais tranché sans arbitrage, et
mal : `refresh` remettait le verdict à `pristine` dès que la valeur changeait. Conséquence
non voulue — le message s'effaçait au premier caractère, c'est-à-dire au moment précis où
l'utilisateur en a besoin pour corriger, et en contradiction avec `FORM-R27` (revenir d'un
lien du résumé doit laisser lire ce qu'on corrige).

Le contrat sépare donc deux propriétés qu'on confond facilement :

| | faire AUTORITÉ | s'AFFICHER |
|---|---|---|
| verdict frais | oui — il bloque | oui |
| verdict **caduc** | **non** — il ne prouve rien de la valeur courante | **oui** — jusqu'à la revalidation |

- `Validation.stale(v)` / `isObsolete(v)` : la nouvelle dimension. `refresh` marque, il
  n'efface plus.
- `isBlocking` devient faux sur un verdict caduc ; `summary` continue de le lister (rien ne
  bouge avant la resoumission) ; `submissionGate` ne compte que ce qui bloque réellement.
- `VALIDATION-R13` est **rectifiée** dans la doctrine (fiche 1.1.0), pas seulement dans le
  code : une règle fausse qui reste écrite est pire qu'une règle absente.

Le pilote le démontre : l'e-mail est déclaré `timing: "blur"` (fort risque de format), les
trois autres champs `"submit"`. Corriger l'adresse laisse le message ; **quitter le champ**
le remplace.

Vérifié : `tsc` vide · manifeste cohérent · 39 exemples compilent · consommation propre ·
paquet Cowork reconstruit (fiche condensée 1.1.0) · harnais de fumée **80/80** — dont un
piège de plus : **React ≥ 17 délègue `onBlur` à `focusout`**, un événement `blur` synthétique
ne déclenche rien, silencieusement.
