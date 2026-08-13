# Exemple de sortie d'audit — écran « Inscription »

> Généré depuis les données réelles de la doctrine (`border`) par `tools/exemple-constat.py`.
> Trois registres, jamais mélangés : ce qui viole une norme, ce qui diverge de notre parti pris, ce que le référentiel ne tranche pas.

### À corriger — BORDER-R03

**Où** — Inscription (`.signup-form input[type=email]`)
**Problème** — La bordure du champ « E-mail » est à 1.9:1 sur son fond (#D9D9D9 sur #FFFFFF). Le champ n'est identifiable que par ce trait.
**Règle** — Si un élément n'est identifiable que par sa bordure, cette bordure doit atteindre un contraste de 3:1 avec son fond.
**Solution** — Amener la mesure à « contraste bordure / fond ≥ 3:1 ». Utiliser `color.border-strong` (valeur résolue #6B7280), qui tient le seuil sur fond clair.
**Source** — [WCAG 2.1 — 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)

```
Dans .signup-form input[type=email], applique la règle BORDER-R03 du design system : Si un élément n'est identifiable que par sa bordure, cette bordure doit atteindre un contraste de 3:1 avec son fond. Critère à respecter : contraste bordure / fond ≥ 3:1. Utiliser `color.border-strong` (valeur résolue #6B7280), qui tient le seuil sur fond clair. Ne modifie aucune autre propriété visuelle et n'introduis pas de nouvelle valeur codée en dur.
```

### Suggestion — BORDER-R04

**Où** — Inscription (`.signup-form input, .signup-card`)
**Problème** — Les bordures des champs et des encadrés sont à 3px.
**Règle** — Nous utilisons une seule épaisseur de trait, 1px, partout.
**Solution** — Amener la mesure à « épaisseur du trait = 1px ». Passer à 1px et signaler les états par la couleur du trait, pas par son épaisseur.
**Source** — [Atlassian — Border](https://atlassian.design/foundations/border)  *(citée en contrepoint : c'est notre choix, pas une norme)*

```
Dans .signup-form input, .signup-card, applique la règle BORDER-R04 du design system : Nous utilisons une seule épaisseur de trait, 1px, partout. Critère à respecter : épaisseur du trait = 1px. Passer à 1px et signaler les états par la couleur du trait, pas par son épaisseur. Ne modifie aucune autre propriété visuelle et n'introduis pas de nouvelle valeur codée en dur.
```

### À trancher — non couvert par le référentiel

**Où** — Inscription (`.signup-upload`)
**Constat** — La zone de dépôt du justificatif utilise un trait pointillé de 2px.
**Ce que dit le référentiel** — rien. Le cas « Style de trait (dashed, dotted) » est cartographié mais explicitement **non couvert** : Une zone de dépôt appelle un trait pointillé.
**Question à trancher** — le trait pointillé doit-il devenir un rôle à part entière (zone de dépôt) ou rester hors périmètre ? Tant que ce n'est pas décidé, aucune correction n'est proposée.

