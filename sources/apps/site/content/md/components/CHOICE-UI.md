---
component: choice
layer: ui
type: component
version: 1.0.0 # 1.0.0 : première rédaction — mapping tokens de CHOICE-UX.md. AUCUN token neuf : la marque de choix est dimensionnée sur l'échelle `icon` (dont la raison d'être est justement d'apparier des crans au corps de texte), la case prend `radius.sm`, le radio `radius.pill`, la bordure au repos `color.border-strong` (délimitante 3:1, même argument que le champ), l'état coché `color.primary`, l'anneau `control.focus-*`, l'apparition de la marque `motion.fast`. Point ouvert de la fiche de manque tranché ici. Cf. CHOICE-UX.md.
last_updated: 2026-07-30
companion: CHOICE-UX.md
confidence: mixed # la géométrie relationnelle et les rôles consommés sont fermes ; la facture (marque pleine sur fond primary) est un parti pris d'identité, alignée sur le reste du kit.
---

# Choice — Couche UI (tokens)

> Mapping des contextes de `CHOICE-UX.md` sur les tokens. Aucune valeur brute : la marque est
> dimensionnée sur une échelle existante, les couleurs et le mouvement viennent des fondations,
> et la cible tactile est celle du système.

```yaml
axes:
  size: [sm, md]          # deux crans seulement — un choix n'a pas la latitude dimensionnelle d'un bouton
  status: [default, error] # le statut est SUBI (validation), jamais décoratif — même règle que le champ
typography:
  label_font: typography.body        # le libellé est du corps de texte, jamais plus petit — il est lu, pas décoré
  helper_font: typography.body-small # aide d'option et message d'erreur : texte fonctionnel, sous le corps
geometry:
  mark_size: icon.sm (size=sm) | icon.md (size=md)
  # POINT OUVERT DE LA FICHE, TRANCHÉ : la marque n'est pas un icône, mais elle en partage
  # exactement la contrainte — c'est un signe posé sur la ligne de texte, qui doit s'apparier au
  # corps. C'est la raison d'être déclarée de l'échelle `icon` (« crans appariés au corps de
  # texte »). La réutiliser est un emploi conforme, pas un détournement : créer un rôle
  # `choice.mark-size` dupliquerait une échelle pour la même raison. Si un jour la marque cesse de
  # suivre le corps, elle gagnera son rôle propre — pas avant.
  checkbox_radius: radius.sm   # la case est un carré adouci, du cran des petits contrôles
  radio_radius: radius.pill    # le radio est un disque — sa forme EST son sens (exclusif)
  gap: spacing.sm              # entre la marque et son libellé
  group_gap: spacing.sm        # entre deux options d'un même groupe
colors:
  rest_border: color.border-strong  # au repos, la marque n'est identifiée que par sa bordure : délimitante, 3:1 (WCAG 1.4.11) — même arbitrage que le champ
  checked_fill: color.primary
  checked_mark: color.on-primary    # la coche et le point, sur le fond coché
  label_text: color.text-primary
  helper_text: color.text-secondary
  error_border: color.danger
  error_text: color.danger
  disabled: opacité du système + color.text-disabled sur le libellé
focus_ring:
  width: border.focus-width
  offset: border.focus-offset
  color: control.focus-color        # anneau unique du système ; en statut error, cran danger
motion:
  mark_in: { duration: motion.fast, easing: motion.ease-out } # l'apparition de la marque, jamais un rebond
touch:
  target: touch.target-min          # sur l'ensemble marque + libellé (CHOICE-R16)
states: [default, hover, focus-visible, checked, indeterminate, error, disabled]
```

## La marque au repos — pourquoi `border-strong`

Une case décochée n'est **que** sa bordure : rien d'autre ne la signale. C'est exactement la situation
du champ de saisie au repos, et le même arbitrage s'applique — bordure **délimitante**, donc contraste
3:1 obligatoire (WCAG 1.4.11), `color.border-strong` et non `color.border`. La subtilité visuelle y
perd un peu ; une case qu'on ne voit pas est une case qu'on ne coche pas.

## La forme porte le sens

Le carré et le disque ne sont pas deux habillages du même contrôle : **la forme dit la cardinalité**.
Un carré annonce qu'on peut en cocher plusieurs, un disque qu'on doit en choisir un. C'est une
convention si ancrée qu'en la brisant on ment sur le comportement avant même que l'utilisateur
n'essaie. Aucun axe ne permet donc d'arrondir une case ni d'équarrir un radio.

## L'indéterminé

L'état mixte se rend par un **trait** (et non une coche partielle ou une case grisée) : il dit
« quelque chose, pas tout », et se distingue au premier coup d'œil des deux autres états sans recourir
à la couleur. Il n'est jamais atteignable au clic — `CHOICE-R11` : il se calcule.

## Adaptation au conteneur

- L'option ne change pas de disposition selon la largeur : la marque reste à gauche du libellé, qui
  passe à la ligne. Un libellé long **s'enroule** sous lui-même, il ne tronque pas — une option
  tronquée est une option qu'on ne peut pas évaluer.
- Le groupe empile ses options en colonne. Une disposition en ligne n'est licite que si toutes les
  options tiennent sans enroulement, et elle repasse en colonne sinon — c'est une décision de la
  page, jamais un axe du composant.
- Aucune Container Query ne masque un libellé, une aide nécessaire ou un message d'erreur.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Bordure seule identifiant un contrôle au repos = bordure délimitante, contraste 3:1 | WCAG 1.4.11 (renvoi BORDER, même arbitrage qu'INPUT-UI) | Établi, standard |
| T2 | Cible tactile minimale sur l'ensemble marque + libellé | WCAG 2.5.8 (renvoi TOUCH) | Établi, standard |
| T3 | L'échelle `icon` existe pour apparier des crans au corps de texte | `foundations/ICONOGRAPHY` (fondation interne) | Établi en interne — cohérence de système |
| T4 | Anneau de focus unique, géométrie et couleur tokenisées | `foundations/BORDER-UI.md` (focus v2, 2026-07-29) | Établi en interne |
