---
sujet: border
type: fondation
resume: "Les trois rôles du trait, épaisseur unique, focus ring unifié (outline + offset) pour tout composant focalisable"
requires: []
selon-contexte: ["radius (rayon perçu du focus ring)"]
---
# RULES — Border (compilé, condensé)

> Généré depuis `foundations/BORDER-UX.md` (v1.4.0) et `BORDER-UI.md` (v1.4.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation née du guardrail "délimitante vs décorative" (toujours actif dans les tokens/guardrails).
- **Règle cardinale : le rôle du trait décide de tout** — couleur, seuil, droit au retrait.

## Les trois rôles
| Rôle | Couleur | Seuil | Exemples |
|---|---|---|---|
| **Délimiter** (seul signal d'un composant interactif) | `border-strong` | **3:1 obligatoire** | input au repos, bouton secondary |
| Sémantique (état) | `color.{tone}` | 3:1 | input error, bordures de l'alert |
| **Grouper** (le contenu identifie déjà) | `border` | exempté | carte outlined |
| **Séparer** | `border` | exempté — et en DERNIER recours (espace d'abord, fond ensuite) | aucun à ce jour |

- Critère du rôle délimitant : *"si cette bordure disparaît, l'utilisateur sait-il encore où interagir ?"* Si non → `border-strong`.

## Épaisseur — une seule
- **Hairline 1px partout** (exception documentée, comme 44px). Pas d'échelle d'épaisseurs.
- **L'état change la couleur du trait, JAMAIS son épaisseur** (pas de layout shift, le focus n'est pas un état du trait). Pas de 0.5px physique.

## Focus ring — spécification unifiée (tous composants focalisables)
- `outline` : couleur `control.focus-color` (cran subtil accordé à la bordure/état, défaut primary éclairci — focus v2, 2026-07-29), largeur `border.focus-width`, écart `border.focus-offset` (outline-offset) — **jamais `border`**.
- Le ring **s'ajoute** à la bordure d'état (error focalisé = ring dehors + bordure danger dedans, les deux visibles).
- Rayon perçu du ring = rayon du composant + offset (cf. RULES-radius).
- **Apparition instantanée** — jamais de transition sur le focus. `:focus-visible` de préférence.
- **Jamais `outline: none`** sans remplacement équivalent à 3:1.
- **Jamais masqué** : la cible focalisée reste entièrement visible, jamais cachée par un sticky/superposé (WCAG 2.4.11) — le composant qui superpose réserve la place ou décale le scroll (contrat en avance, superposés à naître).

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Délimitante < 3:1 | Composant invisible (1.4.11) | Critique |
| Focus supprimé | Navigation clavier aveugle | Critique |
| Focus masqué par un superposé | Focus invisible en usage clavier (2.4.11) | Élevée |
| Épaisseur variable à l'état | Layout shift | Moyenne-élevée |
| Sur-bordage | Bruit — l'espace devait suffire | Moyenne |

CONFIANCE : 3:1 et rôles = établi (WCAG 1.4.11, Atlassian, Carbon border-subtle/strong) — éprouvé par deux recalibrages internes. Ring 2px/2px = convention interne sourcée (Atlassian). Épaisseur constante = divergence assumée avec Atlassian (selected 2px), motivée dans la source.
