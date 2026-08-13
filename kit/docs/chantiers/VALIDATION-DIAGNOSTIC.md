# Chaîne de validation — diagnostic avant implémentation

> Phase A du chantier « Validation et récupération ». Ce document est un CONSTAT daté
> (2026-07-30), pas une doctrine. Il dit ce qui existe, ce qui est incomplet, ce qui est
> dupliqué et ce qui manque réellement — avant toute extension.

---

## 1. Ce que le dépôt possède déjà

La doctrine de la chaîne est **écrite, sourcée et complète**. Elle n'est nulle part
**exécutable**.

| Maillon de la chaîne | Doctrine | Outillé par le kit |
|---|---|---|
| Nature de la donnée attendue | `INPUT-R12/R13/R15` (le type natif) | oui (`field_type`) |
| Contraintes déclarées | `INPUT-R15`, `FORM-R18` | partiellement (attributs HTML passés à travers) |
| Déclenchement de la validation | `FORM-R15/R16/R17`, `INPUT-R18/R19` | **non** |
| Validateur | — (frontière produit) | **non** |
| Verdict structuré | — **aucune règle, aucun type** | **non** |
| État du contrôle | `INPUT-R16/R17/R21`, `CHOICE-R17` | oui (`status`, posé à la main) |
| Message local | `INPUT-R23/R25/R26/R31`, `VOICE` | oui (`Input.Error`, `error` du groupe) |
| Agrégation par le formulaire | `FORM-R20…R27` | **non** |
| Focus et annonce | `FORM-R26`, `ACCESSIBILITY` | **non** |
| Correction / revalidation | `FORM-R27/R32/R51` | **non** |
| Soumission ou reprise | `FORM-R28…R41` | **non** (`SubmitButton` est un `type="button"` expressif) |

**Le trou est au milieu.** Le kit sait *présenter* une erreur et la doctrine sait *quand*
il faut en afficher une ; rien ne sait **produire** l'objet qui les relie. `status="error"`
est aujourd'hui une entrée, jamais une sortie.

---

## 2. Inventaire des contrôles

Relevé sur `packages/react/src/components/` au 2026-07-30 (base `fc61f8b` + chantier
Stabilisation 0.2 non commité).

### 2.1 `Input.Input` (+ `Password`, `Search`, `Number`) et `Input.Textarea`

- **Valeur portée** : `string` (`value`/`defaultValue`, natif).
- **Élément** : `<input>` / `<textarea>` natifs — jamais réimplémentés.
- **Contraintes natives** : toutes disponibles, elles traversent par `{...props}`
  (`required`, `type`, `min`, `max`, `step`, `minLength`, `maxLength`, `pattern`).
  **Aucune n'est lue par le kit** — `ValidityState` n'est consulté nulle part.
- **API de statut** : `status` sur `Input.Root` **ou** `Input.Field` (le bloc fournit,
  l'enfant surclasse). Union `default | error | success | warning`.
- **API d'erreur** : `Input.Error`, rendu **seulement** si `status === "error"`.
- **Association** : `Input.Field` génère `fieldId` + `messageId` ; `useChampCable()` pose
  `id`, `aria-describedby` (seulement si un message est monté) et `aria-required`.
- **`required`** : prop de `Input.Field` → astérisque + « (obligatoire) » + `aria-required`.
  Ne pose **pas** l'attribut natif `required` sur le champ.
- **Groupe** : sans objet.
- **Focus en erreur** : aucun mécanisme.
- **Correction** : aucune — `status` ne change que si l'appelant le change.
- **Manifeste** : entrée `Input`, anatomie exhaustive, 3 exemples canoniques.
- **Tests** : `__tests__/input-field.test.tsx` (bloc champ), `pilote.test.tsx`.
- **Usages réels** : atelier (`registry.tsx`, entrée `input`) — **aucun formulaire réel**.

> Constat : `aria-invalid` est déjà **dérivé** (de `InputContext.status`), jamais écrit à la
> main. La chaîne est donc coupée exactement **un cran plus haut** : entre le verdict et le
> `status`.

### 2.2 `Select`

- **Valeur portée** : `string | null`, contrôlée (`value` + `onValueChange`).
- **Élément** : `<button role="combobox">` + `<ul role="listbox">`, ou `<select>` natif
  (`native`).
- **Contraintes natives** : **aucune**, même en mode `native` (pas de `required`).
- **API de statut** : **absente**. Aucun axe `status`.
- **API d'erreur** : **absente**.
- **Association** : `aria-label` / `aria-labelledby` **obligatoires** — pas d'`id`, pas de
  `aria-describedby`, aucune consommation de `FieldContext`.
- **`required`** : absent. Le commentaire de tête le dit : « Requis et validation = affaire
  du formulaire » — mais aucun formulaire ne peut le faire, faute de prise.
- **Focus en erreur** : impossible à cibler depuis l'extérieur (pas de `ref`, pas d'`id`).
- **Placeholder** : `value == null` rend une `<option value="" disabled hidden>` en natif,
  et le libellé grisé sinon. Le placeholder **n'est déjà pas une valeur** — bonne base.
- **Manifeste** : entrée `Select`. **Usages réels** : atelier seulement.

> **Le trou le plus profond de l'inventaire.** Un `Select` obligatoire est aujourd'hui
> impossible à câbler sans écrire du HTML à côté du kit. C'est le même motif que
> `INPUT-R38` avant le bloc champ : *une règle édictée que le kit ne permet pas de tenir*.

### 2.3 `Checkbox` (simple)

- **Valeur portée** : booléen (`checked` / `onCheckedChange`) ; `value` seulement en groupe.
- **Élément** : `<input type="checkbox">` natif conservé, superposé à la marque.
- **Contraintes natives** : traversent par `{...props}` ; non lues.
- **API de statut** : `status: "default" | "error"` (`ChoiceStatus`), héritée du groupe.
- **API d'erreur** : **aucune sur la case seule** — seul le groupe porte un message.
- **Association** : `aria-describedby` → `helper` de l'option uniquement.
- **`required`** : aucun traitement (pas d'indicateur, pas d'`aria-required`).
- **`indeterminate`** : propriété DOM, jamais une valeur soumise (CHOICE-R11) — donc
  jamais un état validé.
- **Manifeste / tests** : entrée `Checkbox` ; `__tests__/choice.test.tsx`.

> **Trou** : la case de consentement obligatoire (`CONSENTEMENT`, `CREATION-COMPTE`) est un
> cas de flow documenté et n'a **ni indicateur de requis ni message local**.

### 2.4 `Checkbox.Group`

- **Valeur portée** : `string[]` (`value` / `onValueChange`).
- **Élément** : `<fieldset>` + `<legend>`.
- **API de statut** : `status`, ou **dérivé** de la présence de `error`
  (`status ?? (error ? "error" : "default")`).
- **API d'erreur** : `error?: React.ReactNode` — un message **libre**, sans code, sans
  origine, sans lien avec une contrainte.
- **Association** : `aria-describedby` sur le `fieldset` → `msgId`.
- **Cardinalités** (min / max / combinaison interdite) : **aucune**. Le registre
  `exclusives` gère la seule règle de cardinalité existante (CHOICE-R18, exclusivité).
- **Focus du groupe** : aucun mécanisme.

### 2.5 `Radio.Group` / `Radio`

- Identique à `Checkbox.Group` pour le statut, l'erreur et l'association.
- `Radio` nu hors groupe = défaut de conception assumé (CHOICE-R05) — l'atelier ne le montre
  pas.
- **`required`** : absent. Aucun moyen de dire « une réponse est obligatoire ».

### 2.6 `Switch`

- `role="switch"`, effet **immédiat**, pas de soumission (CHOICE-R01).
- Aucun `status`, aucun message, aucun `required` — et c'est **conforme** : le switch n'est
  pas un porteur de validation. Ce qui manque, c'est la **déclaration explicite** de ce
  choix, aujourd'hui seulement présente en commentaire de code.

### 2.7 `Input.Search`

- `type="search"` + effacement. Aucune contrainte par défaut, et c'est correct
  (INPUT-R14/R42). Là encore : choix non déclaré.

### 2.8 `SubmitButton`

- `type="button"` + `onSubmit?: () => Promise<unknown> | unknown`. Anti double-activation
  par `busy.current`. **Ne consulte aucune validation** : il joue la célébration dès que la
  promesse résout. Rien ne peut aujourd'hui l'empêcher de partir.

---

## 3. Recherches transversales exigées par le cadrage

| Recherche | Résultat |
|---|---|
| `status="error"` écrits à la main | **1 seul en dehors du kit** : `registry.tsx:665`, et c'est une **chaîne de code affichée** (l'extrait que l'atelier montre), pilotée par la case « Erreur » du playground. Aucun dans une page de produit. |
| `aria-invalid` écrit dans une page | **0**. L'attribut est toujours dérivé par le kit. |
| Messages d'erreur ad hoc | 4, tous dans l'atelier (`registry.tsx`), tous en tant que **fixtures de présentation** d'un état isolé. |
| Formulaires qui soumettent sans validation | **0 formulaire réel** dans le dépôt : aucun `<form>`, aucun `onSubmit` hors la démo `SubmitButton`. |
| Champs affichant une erreur sans bloquer | sans objet (voir ci-dessus). |
| Validation existante non reliée au message | sans objet : **aucune validation n'existe**. |
| Pages recréant label / helper / erreur sans le kit | **0** depuis la livraison du bloc champ (2026-07-30) ; `verifie:consommation` le garde (`input-natif`, baseline vide). |

**Conclusion de la recherche transversale** : le dépôt n'a pas de dette de *mauvais usage*.
Il a une dette d'**absence**. Rien à nettoyer ; tout à construire — et un endroit exact où
le prouver, l'Atelier.

---

## 4. Les quatre catégories demandées

**1. Ce qui existe déjà et qu'il ne faut pas refaire**
- La présentation d'un état (`status`, `Input.Error`, `error` de groupe, icône + « Erreur »
  pour l'AT, remplacement helper→erreur).
- L'association technique (`for`/`id`, `aria-describedby` conditionnel, `fieldset`/`legend`).
- `aria-invalid` dérivé, jamais écrit.
- La doctrine complète de l'orchestration (`FORM-UX`, 60 règles) et du wording (`VOICE`).

**2. Ce qui est incomplet**
- `Checkbox` simple : pas d'erreur locale, pas de requis.
- `Checkbox.Group` : message libre sans code ni origine ; aucune cardinalité.
- `Radio.Group` : pas de requis.
- `Input.Field` : `required` visuel sans contrainte native ni verdict.
- `SubmitButton` : aucune porte de validation.

**3. Ce qui est dupliqué**
- Le bloc « icône + `sr-only` “Erreur :” + texte » est écrit **trois fois** :
  `input.tsx` (`InputError`), `checkbox.tsx` (`CheckboxGroup`), `radio.tsx` (`RadioGroup`).
  Trois copies du même SVG et de la même structure.
- La dérivation `status ?? (error ? "error" : "default")` est écrite **deux fois**
  (checkbox, radio).

**4. Ce qui manque réellement**
- **Le verdict** : aucun type, aucune normalisation, aucune priorité, aucune projection.
- **La lecture des contraintes natives** (`ValidityState`) — jamais consultée.
- **Toute prise de validation sur `Select`** (statut, message, association, requis).
- **La déclaration de rôle de validation** dans le manifeste (`validationRole`).
- **Une orchestration exécutable** au niveau formulaire (agrégation, résumé, focus, porte de
  soumission, réconciliation serveur).
- **Une garde** qui refuse un statut posé sans verdict dans une page réelle.

---

## 5. Ce que le diagnostic impose à la suite

1. Le contrat de verdict est **une seule implémentation**, sans React et sans CSS.
2. Les composants ne gagnent **aucun composant nouveau** : une seule prise (`verdict`),
   branchée sur le contrat, sur les contrôles qui en portent un.
3. Le bloc « icône + Erreur : + texte », déjà écrit trois fois, devient **une** primitive
   interne partagée — sinon la chaîne ajouterait une quatrième copie.
4. `Select` doit rejoindre le bloc champ (`FieldContext`) : c'est de la **réutilisation**,
   pas un composant de plus.
5. L'orchestration formulaire est **prouvée avant d'être promue** : la tranche pilote vit
   dans l'Atelier ; sa promotion en API publique relève d'un arbitrage
   (`MISSING-COMPONENT-PROTOCOL`), pas de ce chantier.
6. Les démos d'état isolé de l'Atelier restent légitimes, mais doivent être **nommées**
   fixtures de présentation.
