---
component: chip
layer: ux
version: 1.0.0 # 1.0.0 : première rédaction — né du MISSING-COMPONENT-PROTOCOL (fiche chip-renvoi, validée par Aurélien le 2026-07-29) : deux implémentations locales dans les grilles de la Doctrine révélées par fili-check, promues en composant après qualification. Premier composant à entrer par la tranche verticale du protocole.
last_updated: 2026-07-29
companion: CHIP-UI.md
confidence: mixed # usage interne éprouvé (grilles Doctrine) ; conventions externes convergentes sur les "tags/chips" de référence, frontières propres à ce système
---

# Chip — Couche UX

> Une chip est un **renvoi compact** : elle pointe vers une entité du système (une règle,
> un cas d'usage, un constat) depuis un contexte dense où un Button serait trop lourd et
> un Link sans facture serait invisible. Elle promet une **destination ou un déplacement
> de vue**, jamais une mutation.

## Responsabilité et frontières

RÈGLE [CHIP-R01] : la chip porte un renvoi de LECTURE — ouvrir, montrer, faire défiler vers — jamais une action qui modifie l'état.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Chez nous, une chip renvoie vers une entité ou une vue ; toute action qui crée, modifie ou supprime appartient à Button.
MESURE : aucun onClick de chip ne déclenche une mutation de données

RÈGLE [CHIP-R02] : la chip vit en NUÉE — plusieurs renvois côte à côte dans un espace contraint (volet, fiche, tableau) ; isolée et unique, la question « Button ou Link ? » se pose d'abord.
STATUT : parti pris d'identité
SOURCE : S1, S2
ÉNONCÉ : Chez nous, la chip est l'élément des ensembles denses de renvois ; un renvoi isolé de plein rang prend un Link.
MESURE : les usages de chip apparaissent dans des conteneurs flex-wrap d'au moins deux éléments, ou documentent leur exception

RÈGLE [CHIP-R03] : la chip n'est PAS un filtre ni une saisie — le « chip de sélection » (facettes, tags d'input) est un autre besoin, hors périmètre de ce composant, à qualifier par le protocole s'il émerge.
STATUT : note de méthode
SOURCE : S2
ÉNONCÉ : Ce composant couvre le renvoi ; la sélection à facettes n'entre pas par extension silencieuse de son API.

RÈGLE [CHIP-R04] : le libellé dit l'ENTITÉ, pas l'action — « BUTTON-R12 », « Situations qui l'éprouvent », jamais « Cliquer ici ».
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Chez nous, le texte d'une chip nomme ce qu'elle ouvre ; la flèche optionnelle porte seule l'idée de déplacement.
MESURE : aucun libellé de chip n'est un verbe d'injonction

RÈGLE [CHIP-R05] : un identifiant technique (ID de règle, code) s'affiche en mono — la nature « référence » se lit à la forme.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Chez nous, une chip qui porte un identifiant du système l'affiche en chasse fixe.

RÈGLE [CHIP-R06] : la sémantique suit la cible — un `<a>` si la chip navigue, un `<button>` si elle ouvre un volet ou déplace la vue ; jamais un `<div>` cliquable.
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Une commande n'est pas une destination : l'élément natif porte la vraie nature du renvoi.
MESURE : chaque chip rend un a[href] ou un button, vérifié par fili-check

RÈGLE [CHIP-R07] : la densité de la nuée ne sacrifie pas la cible — hauteur de frappe effective ≥ touch.target-min, l'espacement de la nuée complète la zone.
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : Les chips restent actionnables au doigt : la cible effective atteint le plancher tactile même si la facture visuelle est plus basse.
MESURE : cible effective ≥ 24px (touch.target-min), gap de nuée ≥ spacing.sm

## Sources et confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Le renvoi compact en nuée est un besoin distinct de Button (action) et Link (prose) | Usage interne : grilles décisions/cas de la Doctrine Fili (2026-07), fiche de manque chip-renvoi | Cas isolé documenté, promu par le protocole |
| S2 | « Chip » recouvre plusieurs natures (assist, filter, input, suggestion) à séparer | [Material 3 — Chips](https://m3.material.io/components/chips/overview) (quatre types distincts) | Établi |
| S3 | La sémantique native suit la fonction (lien navigue, bouton commande) | HTML Living Standard ; convergence APG | Établi |
| S4 | Plancher de cible tactile 24px (AA) | WCAG 2.5.8 Target Size (Minimum) ; TOUCH-UX | Établi |
