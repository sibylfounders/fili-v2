# Inventaire des cas d'usage — Architecture adaptative

> Checklist de couverture de `ADAPTIVE-UX.md` : distinguer les décisions de page, de composant et
> d'environnement.

## 1. Par niveau

| Cas | Propriétaire | Mécanisme |
|---|---|---|
| Sidebar devient drawer | page | Media Query / logique applicative |
| Page deux régions devient une | page | layout fluide ou Media Query |
| Card change de disposition dans une sidebar | Card | Container Query |
| Groupe d'actions se compacte | composant composite | Container Query |
| Mouvement réduit | environnement | Media Query |
| Contraste forcé | environnement | Media Query |

## 2. Par adaptation de contenu

| Cas | Verdict |
|---|---|
| Réorganiser des métadonnées secondaires | Autorisé |
| Regrouper des actions secondaires dans un menu | Autorisé si toutes restent accessibles |
| Masquer l'erreur ou la contrainte nécessaire | Interdit |
| Transformer un Link en Button | Interdit |
| Icône seule avec nom accessible | Autorisé si l'icône est établie |
| Changer l'ordre DOM pour un rendu visuel | Interdit si l'ordre de lecture se dégrade |

## 3. Par test

| Cas | Attendu |
|---|---|
| même viewport, conteneur étroit puis large | états différents quand nécessaire |
| texte traduit long | aucune perte de fonction |
| zoom / texte agrandi | reflow sans défilement bidimensionnel indu |
| juste avant/après le seuil | bascule stable |
| Container Query absente | état compact viable |
| conteneurs imbriqués | bon `container-name` ciblé |

## Bilan

Le contrat est complet au niveau fondation. Son adoption commence avec Button, Input et Card ; les
patterns composites devront déclarer leurs propres états et seuils à partir de contenus réels.
