# Manque : la famille du CHOIX (Checkbox, Radio, et leur groupe)
- Statut : résolu
- Promotion : Checkbox  <!-- tranche verticale livrée le 2026-07-30 : CHOICE-UX/UI 1.0.0, Checkbox + Checkbox.Group, Radio + Radio.Group, manifeste, atelier, tests — et l'axe `selection` de CardGroup, qui rend CARD-R26 tenable -->
- Arbitrage : 2026-07-30 (Aurélien) — validée telle quelle : deux composants (Checkbox, Radio) + leur groupe, UNE paire de doctrine CHOICE-UX/UI, libellé embarqué façon Switch, plus l'axe de sélection sur CardGroup pour honorer CARD-R26. Ordre retenu : contrôles nus → essai carded → arbitrage de Card.Control.
- Besoin rencontré : sélectionner une ou plusieurs options **validées à la soumission** — case à cocher (choix indépendants, consentement) et bouton radio (choix exclusif parmi peu d'options). Le kit n'a que `Switch`, dont la doctrine dit explicitement qu'il est *autre chose*.

## Ce n'est pas un souhait : trois doctrines le prescrivent déjà

| Où | Ce qui est écrit | Ce qui manque |
|---|---|---|
| `SWITCH-UX` (§ « Switch ou checkbox — la ligne de partage », source NN/g, *convergent*) | « Switch = effet immédiat ; **checkbox = sélection validée à la soumission** » — et certaines règles y sont renvoyées « à la **checkbox** et à `form`, pas au switch ». | La checkbox à qui ces règles sont renvoyées. |
| `SELECT-UX` (table de sources, 3 systèmes publics : USWDS, Scottish Government, NN/g — *établi par convergence*) | En dessous de ~5 options, la bonne réponse est **des radios visibles**, pas un select ; une sélection multiple appelle **des cases à cocher**. | Le composant que la doctrine désigne comme la bonne réponse. |
| `CARD-R25` + `CARD-UI` | L'état sélectionné d'une carte doit être exposé programmatiquement par « case, **bouton radio** ou attribut d'état ARIA » / « `aria-pressed` ou input `checkbox`/`radio` **réel selon le cas** ». | La branche « input réel » : `Card` ne sait faire que `aria-pressed`. |
| `CARD-R26` | « Dans un groupe de cartes sélectionnables, toutes partagent le même mode (**single ou multi**) ». | **`CardGroup` n'a pas cette distinction** : `mode="selectable"` est implicitement multi, le choix exclusif est impossible. Règle non tenue aujourd'hui. |
| `CONSENTEMENT-UX` (flow) | Le consentement explicite est un cas d'usage de premier plan. | Sa case à cocher. |

Autrement dit : le même symptôme qu'`INPUT-R38` avant `Input.Label` — **le système édicte des règles qu'il ne permet pas de tenir**. Ici, quatre.

## Qualification (protocole, étapes 1 à 3)

- **Réutiliser ?** Non. `Switch` couvre l'effet immédiat, `Select` la liste au-delà du seuil, `Card mode="selectable"` la surface — aucun ne porte la sélection validée à la soumission.
- **Composer ?** Non. Aucune composition existante ne produit un contrôle de choix accessible (rôle natif, groupe nommé, navigation au clavier entre radios).
- **Nature** : **deux composants** (`Checkbox`, `Radio`) + **une variation** de `CardGroup` (l'axe de sélection exigé par CARD-R26). Une **seule paire de doctrine** pour les deux : ils partagent frontière, anatomie, états, tokens et règles d'accessibilité — comme `Button` et `CompactButton` partagent BUTTON. Les dédoubler produirait deux fichiers à maintenir en miroir (étape 10 de la Méthode, par anticipation).
- **Test de transposition** : la frontière effet-immédiat / validé-à-la-soumission, l'exclusivité du radio et le groupe nommé sont des propriétés **universelles** (opposables à n'importe quel produit). La facture visuelle est un parti pris d'identité.

## Responsabilité proposée

Capturer un choix **validé à la soumission** : indépendant et cumulable (`Checkbox`), ou exclusif dans un ensemble borné (`Radio`).

**Limites (ce que ça ne fera PAS)** : pas d'effet immédiat (c'est `Switch`) ; pas de liste au-delà du seuil de `SELECT-UX` (c'est `Select`) ; pas de filtre à facettes (autre besoin, déjà écarté par `CHIP-R03`) ; le groupe ne porte ni la validation, ni le timing, ni le résumé d'erreurs — ils appartiennent au formulaire (`FORM-UX`).

## API candidate (axes du Contract uniquement)

```tsx
<Checkbox checked={v} onCheckedChange={setV} label="J'accepte les conditions" />

<Radio.Group value={choix} onValueChange={setChoix} label="Formule">
  <Radio value="mensuel" label="Mensuel" />
  <Radio value="annuel" label="Annuel" helper="Deux mois offerts" />
</Radio.Group>
```

- **Libellé embarqué** (`label`), comme `Switch` — et non le bloc `Input.Field` livré ce jour : le libellé d'un contrôle de choix est **en ligne, à droite de la case**, alors que celui d'un champ texte est **au-dessus**. Deux anatomies, deux mécaniques ; c'est une décision, pas un accident. À inscrire dans la doctrine.
- **Axes** : `size` (aligné sur Switch/Button) ; `status` pour l'erreur héritée du groupe. Pas de `tone` — un choix n'a pas de registre chromatique propre.
- **États** : `checked`, `indeterminate` (Checkbox seul — parent d'une liste partiellement cochée), `disabled`, `required`, `error`.
- `Radio.Group` porte l'exclusivité, le nom commun, le `fieldset`/`legend` et la navigation par flèches ; `Checkbox.Group` reste **optionnel** (les cases sont indépendantes) mais utile pour l'étiquetage collectif.

## Impact sur l'existant (à arbitrer avec le reste)

`CardGroup` gagne un axe de **sélection** — `selection="multiple" | "single"` — pour honorer `CARD-R26`, et `Card` la branche « input réel » de `CARD-UI` via le futur `Card.Control`. **Ordre recommandé : contrôles nus d'abord, carte de choix ensuite.** Un formulaire à huit cases n'en carde aucune ; construire la version cardée en premier reviendrait à écrire l'exception avant la règle. L'essai carded dira alors, par l'usage, si `Card.Control` est nécessaire ou si la composition suffit.

## Tokens nécessaires

Rôles existants d'abord : `control-*` (bordure, fond, focus), `--control-focus-*` (anneau unique), `color.primary` (état coché), `color.danger` (erreur), `radius-sm` pour la case, `radius-pill` pour le radio. **Point ouvert** : la taille de la case (16/20 px selon `size`) doit-elle venir d'un cran existant (`icon.*`) ou d'un rôle propre justifié dans `DESIGN.md` ? À trancher à la rédaction UI, sans valeur en dur.

## Règles accessibles

Rôle natif (`input[type=checkbox|radio]`) plutôt que recomposé ; groupe de radios en `fieldset`/`legend` ou `role="radiogroup"` avec nom accessible ; navigation par flèches à l'intérieur du groupe, un seul arrêt de tabulation ; état exposé (`checked`, `aria-checked="mixed"` pour l'indéterminé) ; cible effective ≥ `touch.target-min`, libellé compris ; jamais la couleur seule pour l'état ni pour l'erreur.

## Coût

Élevé mais borné — c'est la première tranche verticale **complète** depuis `Chip` : paire de doctrine à rédiger (une seule), inventaire de cas d'usage, benchmark (les trois systèmes publics déjà cités sont la base), tokens, deux composants + groupe, atelier, exemples canoniques, tests d'API et d'accessibilité, catalogue. La frontière et une partie du sourçage sont **déjà acquises** — c'est autant de moins.

## Risque de doublon

Faible côté kit. Réel côté **usage** : sans ces composants, la première page qui a besoin d'un choix recompose une case à la main — et `CARD-R26` restera une règle que le système énonce sans la tenir.

## Recommandation

**Deux nouveaux composants + une variation de `CardGroup`**, une seule paire de doctrine, dans l'ordre : contrôles nus → essai carded → arbitrage `Card.Control` et axe de sélection. En attente d'arbitrage : aucune implémentation locale n'existe, rien n'a été anticipé dans le code.

---

## Livraison (2026-07-30)

Les trois pièces annoncées sont en place : `Checkbox` et son groupe, `Radio` et son groupe, et
l'axe **`selection="single" | "multiple"`** de `CardGroup` — écrit en union discriminée, de sorte
qu'un groupe mixte n'est plus seulement interdit par `CARD-R26` : il est **intypable**. Le régime
appartient au groupe et non à la carte, parce que « une seule à la fois » ne se décide pas carte
par carte ; la carte garde le rendu de son état, sa bascule et son clavier.

**Point ouvert tranché** : la taille de la marque vient de l'échelle `icon` (dont la raison d'être
déclarée est d'apparier des crans au corps de texte), sans rôle nouveau.

**Ce qui reste explicitement hors de cette fiche** : `Card.Control`, c'est-à-dire la branche
« input réel » de `CARD-R25`. Sous régime, la carte prend aujourd'hui le rôle ARIA que la règle
nomme (`radio` / `checkbox` + `aria-checked`) — la troisième branche qu'elle autorise. L'essai
*carded* dira, par l'usage, si un vrai `input` imbriqué est nécessaire ou si la composition
suffit ; il est prévu APRÈS, comme convenu : un formulaire à huit cases n'en carde aucune.
