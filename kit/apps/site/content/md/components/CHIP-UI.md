---
component: chip
layer: ui
version: 1.0.0 # 1.0.0 : première rédaction — implémentation de référence @fili/react (tranche verticale du protocole, 2026-07-29). Aucun token créé : la chip consomme les rôles existants.
last_updated: 2026-07-29
companion: CHIP-UX.md
confidence: mixed
tokens:
  facture:
    radius: radius.md # aligné sur les contrôles compacts ; PAS l'alias --control-radius (la chip n'est pas un contrôle du relief posé)
    padding: "spacing.sm × 4px vertical (py-1)"
    font: "typography.size.xs (12px) · mono via fontFamily.mono quand l'ID l'exige (CHIP-R05)"
  couleurs:
    outline: "background + border ; survol : border→primary, texte→text-primary"
    subtle: "surface + border transparent ; survol : surface-hover"
    texte: "text-secondary (repos) — le renvoi est une métadonnée, pas du contenu"
  focus: "géométrie unique BORDER (.ds-focus-ring) ; couleur control.focus-color (défaut primary éclairci)"
  motion: "transition-colors duration.fast ease-out — feedback pur, aucun mouvement"
---

# Chip — Couche UI

> Implémentation de référence `@fili/react` (`Chip`). Jamais un critère d'audit d'une
> interface tierce (frontière 2026-07-21).

RÈGLE [CHIP-U01] : deux factures — `outline` (fond de page, filet `border`) et `subtle` (fond `surface`, sans filet) ; le survol signale par la bordure/le fond, jamais par un déplacement.
STATUT : parti pris d'identité
SOURCE : T1
ÉNONCÉ : Chez nous, la chip a une facture contenue et calme : outline sur fond clair de page, subtle sur zone déjà bordée.

RÈGLE [CHIP-U02] : le rayon est `radius.md` — la chip n'entre PAS dans la grammaire du relief posé (pas de [data-style], pas d'ombre, pas d'enfoncement) : c'est un renvoi, pas un objet qu'on presse.
STATUT : parti pris d'identité
SOURCE : T1
ÉNONCÉ : Chez nous, la chip reste plate sous [data-relief] — le relief appartient aux contrôles d'action.

RÈGLE [CHIP-U03] : focus visible = la géométrie unique de BORDER (`.ds-focus-ring`, outline + offset tokenisés) en cran `control.focus-color`.
STATUT : propriété universelle
SOURCE : T2
ÉNONCÉ : L'anneau de focus de la chip est celui du système, jamais une recomposition locale.
MESURE : classe .ds-focus-ring présente ; aucun outline local

RÈGLE [CHIP-U04] : la flèche de déplacement (`→`) est du TEXTE dans le libellé chez le consommateur ou l'icône 12px du slot — jamais une image décorative séparée du nom accessible.
STATUT : propriété universelle
SOURCE : T3
ÉNONCÉ : Le nom accessible de la chip contient tout ce que l'œil lit.

## Sources et confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Facture contenue reprise des grilles Doctrine (usage réel avant promotion) | Implémentations locales cas-grille/decisions-grille (2026-07), harmonisées à la promotion | Cas isolé documenté |
| T2 | Focus ring unique du système | BORDER-UI 1.4.0 (focus v2) | Interne, établi |
| T3 | Nom accessible = texte visible | WCAG 2.5.3 Label in Name | Établi |
