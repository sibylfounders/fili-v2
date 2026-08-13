# Inventaire des cas d'usage — Link

> Checklist de couverture de `LINK-UX.md`.

## 1. Par contexte

| Cas | Particularité |
|---|---|
| Lien inline dans un paragraphe | souligné au repos, sens hors couleur |
| Lien autonome | destination explicite, plus léger qu'un Button |
| Navigation principale | destination courante annoncée |
| Ancre dans la page | destination interne et focus cohérent |
| Lien externe | nouvel onglet exceptionnel et annoncé |
| Téléchargement | type et taille annoncés quand utiles |
| Card cliquable | vrai lien étendu portant le titre |
| Icône seule | nom accessible + cible tactile |

## 2. Par état

| État | Couverture |
|---|---|
| Default | identifiable |
| Hover | renforcement, jamais révélation |
| Focus | outline visible |
| Active | feedback immédiat |
| Visited | réservé aux contextes où l'historique aide |
| Disabled | interdit — retirer ou expliquer |

## Bilan

La dette « lien dans le texte » est couverte : intention, wording, états, accessibilité et intégration
dans la Card disposent désormais d'un propriétaire explicite.
