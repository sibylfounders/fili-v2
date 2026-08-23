---
sujet: rapport-audit-fili
type: rapport
version: 0.1.0 # 0.1.0 : neuf règles du corpus exécutées sur les 90 pages de Fili — clôture de l'annexe A.2 (2026-07-31)
---

# Audit Fili — par Fili

> L'annexe A.2 du cahier avait produit six constats à la main. **Cinq mesuraient la feuille de
> style de la démo, pas le système.** Ce passage-ci refait le travail à la machine, et il tranche
> la question que le passage à la main ne pouvait pas trancher : *le constat porte-t-il sur le
> kit, ou sur ce qui l'entoure ?*

## Empreinte de passage

| | |
|---|---|
| **Date** | 2026-07-31 |
| **Cible** | `apps/site/out` — **90 pages** |
| **Corpus** | 1 040 règles qualifiées · 9 règles exécutables |
| **Instruments** | DOM rendu · feuille de style (CSSOM) · contraste WCAG |
| **Navigateur** | Chromium 141.0.7390.37 |

---

## Le résultat qui compte

### Aucun constat ne porte sur un composant du kit

643 écarts de contraste relevés sur les 90 pages. **Zéro** sur un élément portant `data-slot` —
la marque que les composants de `@fili/react` posent sur leur racine.

C'est la première fois que cette distinction est **prouvée** plutôt que supposée. À la main, le
31/07 au matin, elle avait été manquée cinq fois sur six : la feuille de la démo avait été lue
comme le système. La machine peut la faire parce que le kit se signe.

> **Ce que ça ne dit pas** : que le kit est conforme. Il dit que **sur les nuances mesurées, sur
> ces pages, aucun composant du kit n'a été pris en défaut**. Neuf règles sur 1 040.

---

## À corriger — le site de documentation, pas le kit

### 1. Contraste — 4 paires fautives distinctes

| Couleur / fond | Ratio | Occurrences | Ce que c'est |
|---|---|---|---|
| `#9ca3af` sur `#f3f4f6` | **2.31:1** | 355 | `text-muted` sur fond gris — étiquettes et badges |
| `#9ca3af` sur `#ffffff` | **2.54:1** | 223 | `text-muted` sur fond blanc — horodatages, compteurs |
| `#0f766e` sur `#111827` | **3.24:1** | 37 | `.dm-kicker` — surtitre teal sur fond sombre |
| blanc sur blanc | **1:1** | 6 | libellés du nuancier (`« 950 »`) — **invisibles** |

Le blanc sur blanc est un défaut franc : les libellés de nuance des teintes claires ne se voient
pas. Onze autres libellés de nuancier (8 px, blanc sur pastille) sont entre 2.15:1 et 4.47:1.

### 2. Rayons hors échelle — 16 couples distincts

`.icell` 10px · `.dm-icone` 36px · `.ch-sw` / `.ch-tip-sw` / `.sbar` 3px · `.gbar` / `.mdot` /
`.sw-state` / `.ch-spark-chip` 5px · `.mtrack` 6px · `.dm-orbite` et trois autres en `50%`.

**Tous dans la feuille du site de documentation** (`.doctrine-demo`, `.ch-*`, `.dm-*`, `.sw-*`),
aucun dans le kit. Le système s'impose une échelle fermée de rayons et son propre site
d'exposition ne la respecte pas.

### 3. Espacements hors échelle — 101 couples distincts

| Origine | Couples | Exemples |
|---|---|---|
| **Utilitaires Tailwind** | 24 | `.p-3`, `.gap-1\.5`, `.mt-px`, `.py-0\.5`, `.px-1\.5` |
| CSS du site de documentation | 77 | `.blk-title` 10px, `.doc-prose h1` 12px, `.chiprow` 10px |

Les 24 utilitaires Tailwind sont le constat sérieux : **ce sont les crans de Tailwind, pas ceux
de Fili.** C'est la même famille que le seul constat de A.2 qui avait tenu — « palette = défauts
Tailwind, 5 tokens sur 5 ». Le grief se répète sur l'espacement : le système déclare une échelle
fermée, et la couche utilitaire en expose une autre à côté.

---

## Une tension du corpus, révélée par la machine

**578 des 643 écarts de contraste sont `text-muted`.** Or `COLOR-R12` déclare ce token à 2.54:1
et le **réserve aux métadonnées accessoires** — avec un précédent journalisé (F01).

- `COLOR-R09` — *propriété universelle* — pose 4,5:1 pour tout texte.
- `COLOR-R12` — déclare un token à 2,54:1 et en autorise l'emploi.
- **WCAG 1.4.3 ne connaît pas d'exception « métadonnée accessoire. »** Ses seules exceptions sont
  le texte incident, les logotypes et le grand texte.

Les deux règles ne peuvent pas être vraies ensemble. Soit R09 n'est pas universelle et R12 en est
une **exception nommée** (relation `exception-de`, précédent F01 à ré-instruire), soit R12 est un
écart assumé qu'il faut cesser d'appeler un emploi légitime.

**Le moteur n'a pas tranché** — il a produit la contradiction et s'arrête là. Une partie des 355
occurrences sont d'ailleurs des libellés de navigation (« Layout », « Theming ») : du texte
fonctionnel, pas une métadonnée. C'est exactement le cas F01, reproduit à l'échelle du site.

---

## Deux limites de l'instrument, nommées

**Le statique compte ce qui est écrit, pas ce qui est employé.** Une déclaration présente dans la
feuille compilée n'est pas nécessairement rendue quelque part. Tailwind purge l'inutilisé, donc
les 24 utilitaires sont bien consommés — mais l'instrument ne le démontre pas, il l'infère.

**Le statique ne sait pas séparer le kit du site.** La distinction `data-slot` ne vaut que côté
DOM. Sur la feuille de style, l'attribution repose sur la lecture des sélecteurs — faite ici à la
main, donc à outiller.

---

## Ce qui n'a pas été regardé

`SPACING-R05` a d'abord répondu *en attente de déclaration* sur Fili lui-même : la fiche écrit
`spacing.base`, le thème émet `--space-base`. **Le vocabulaire de la doctrine et celui des tokens
divergent.** Le critère suit désormais le nom émis — seul observable — et l'écart de nommage est
relevé dans la fiche.
