# transformations.md — mise en conformité de `crash-tests/epreuve-c/SoigneNonInforme.tsx`

Une ligne par transformation, l'assertion en regard. Aucune ligne n'existe sans
assertion : ce qui ne se rattachait à aucune assertion n'est pas entré.
Aucune rupture déclarée (`intent="statement"` / `data-intent="statement"`) n'a été
posée dans ce run.

**Convention** — « Assertion » = l'assertion qui *impose* la transformation.
« Effet » = les autres assertions que la même transformation solde au passage.

## S1 · Composants typés

| # | Transformation | Assertion | Effet |
|---|---|---|---|
| 1 | Import de `Section, Pile, TextField, Button, EtatAsync, Squelette, Alerte, Vide` depuis `../design-system/index.ts` (source déclarée au registre) | R1.3 | rend possibles 2→29 |
| 2 | `<label>` + `<input>` « Client » → `<TextField id="client" label="Client" />` | R1.1 | R3.4 (`min-h-[44px]`) |
| 3 | `<label>` + `<input>` « Statut » → `<TextField id="statut" label="Statut" />` | R1.1 | R3.4 (`min-h-[44px]`) |
| 4 | `<button type="button" onClick={lancer}>` → `<Button onPress={lancer}>` | R1.1 | R3.4 (`min-h-[44px]`) |

## S2 · Contrat d'état

| # | Transformation | Assertion | Effet |
|---|---|---|---|
| 5 | Retour anticipé `if (factures.chargement) return …` supprimé | R2.4 | R2.1 |
| 6 | Retour anticipé `if (factures.erreur) return …` supprimé | R2.4 | R2.1 |
| 7 | Ternaire `factures.donnees.length === 0 ? … : …` supprimé | R2.4 | R2.1 |
| 8 | `<EtatAsync requete={factures} …>` introduit dans la section « Les factures » | R2.1 | — |
| 9 | Les deux enveloppes `<div className="p-8">` des retours anticipés supprimées | R2.1 | — |
| 10 | Slot `chargement={<Squelette lignes={2} />}` — reprend les deux barres du squelette artisanal | R2.2 · R2.5 | — |
| 11 | Slot `erreur={<Alerte titre="Les factures sont indisponibles">…</Alerte>}` — titre et paragraphe d'origine conservés mot pour mot | R2.2 · R2.5 | R4.5 (`text-lg` du titre) |
| 12 | Slot `vide={<Vide titre="Aucune facture en cours">…</Vide>}` — titre et paragraphe d'origine conservés mot pour mot | R2.2 · R2.5 | R4.5 (`text-base` du titre) |
| 13 | Slot `enfants={(donnees) => …}` portant la liste `<ul>/<li>` d'origine | R2.2 · R2.5 | — |

## S3 · Discipline spatiale

| # | Transformation | Assertion | Effet |
|---|---|---|---|
| 14 | `mt-2` (h1) et `mt-3` (chapeau) → `<Pile espace={3}>` englobant `<Pile espace={2}>` | R3.2 | — |
| 15 | `mb-3` (h2 « Filtrer ») → `<Pile espace={3}>` dans la section | R3.2 | — |
| 16 | `mb-4` (h2 « Les factures ») → `<Pile espace={4}>` dans la section | R3.2 | — |
| 17 | `mb-3` (h2 « Agir ») et `mt-2` (message de relance) → `<Pile espace={3}>` englobant `<Pile espace={2}>` | R3.2 | — |
| 18 | `mt-1` et `mt-3` (carte de facture) → `<Pile espace={3}>` englobant `<Pile espace={1}>` | R3.2 | — |

*R3.7 · proximité — vérifiée, aucune transformation nécessaire :* l'écart de la
grille (`gap-4`, 16 px) ne rencontre aucun groupe de pairs porteur d'écart (les
`<li>` ne portent pas d'écart, l'écart intérieur est porté par la `Pile` à
l'intérieur de la carte). Les `Pile` imbriquées restent au rapport exigé
(12 px ≥ 3 × 4 px).

## S4 · Rythme de composition

| # | Transformation | Assertion | Effet |
|---|---|---|---|
| 19 | `<header className="mb-8">` → `<Section densite="compact">` | R4.1 · R4.2 | R3.2 (`mb-8`) |
| 20 | `<section className="mb-8" aria-labelledby="filtres">` → `<Section densite="normal" aria-labelledby="filtres">` | R4.1 · R4.2 | R3.2 (`mb-8`) |
| 21 | `<section aria-labelledby="liste">` → `<Section densite="compact" aria-labelledby="liste">` | R4.1 · R4.2 | — |
| 22 | `<section className="mt-8" aria-labelledby="agir">` → `<Section densite="compact" aria-labelledby="agir">` | R4.1 · R4.2 | R3.2 (`mt-8`) |
| 23 | `text-3xl` retiré du `<h1>` « Suivi des factures » | R4.5 | — |
| 24 | `text-lg` retiré du `<h2>` « Filtrer » | R4.5 | — |
| 25 | `text-lg` retiré du `<h2>` « Les factures » | R4.5 | — |
| 26 | `text-lg` retiré du `<h2>` « Agir » | R4.5 | — |
| 27 | `text-base` retiré du `<h3>` de carte de facture | R4.5 | — |

*R4.3 · alternance — soldée par les densités posées en 19→22 :*
`compact · normal · compact · compact`, aucune série de trois.
*R4.4 · hiérarchie — vérifiée, aucune transformation nécessaire :* un seul `h1`,
suite `1 → 2 → 2 → 3 → 2`, aucun saut. Les `id` des `h2` sont conservés, donc les
`aria-labelledby` des sections continuent de résoudre.

**Total : 27 transformations.** Aucune n'est orpheline.

---

## Hors fichier gouverné — une seule adaptation d'outillage

`tools/fili/temoin/rendu.mjs` accepte désormais quatre arguments optionnels
(`--page`, `--export`, `--sortie`, `--titre`). Sans argument, il rend l'Écran
Témoin dans `temoin.html` exactement comme avant : le rendu par défaut a été
comparé octet par octet à celui d'avant l'adaptation, il est identique. Le rendu
`k1-pieces/run/apres-k1.html` est produit par ce script depuis le fichier TSX
lui-même, jamais retranscrit à la main.
