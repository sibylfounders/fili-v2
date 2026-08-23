---
sujet: radius
type: fondation
resume: "Le rayon suit la taille, imbrication concentrique, pill borné au mono-ligne"
requires: []
selon-contexte: ["border (focus ring : rayon du composant + offset)"]
---
# RULES — Radius (compilé, condensé)

> Généré depuis `foundations/radius/RADIUS-UX.md` (v1.1.0) et `RADIUS-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- La plus petite fondation. **Règle cardinale : le rayon suit la taille et rien d'autre** — ni l'importance, ni l'état, ni le goût de l'écran.

## Application
- `radius.sm` : petites hauteurs (`scale.compact` — bouton/input sm).
- `radius.md` : **contrôles** de taille standard (bouton/input md-lg) — le rayon de croisière des contrôles.
- `radius.lg` : **conteneurs** (card, alert) — cran conteneur (12px), ajouté en 1.1.0 : sépare la courbure d'un conteneur de celle d'un contrôle (une identité peut vouloir carte 12 / contrôle 8). L'imbrication reste concentrique.
- `radius.pill` : badge/avatar uniquement — forme intrinsèquement pilule. **Un contrôle mono-ligne (bouton, input) ne prend jamais pill** (tranché en 1.1.0). Jamais sur du multiligne (effet stade).
- Pas de cran 0 (rien n'est carré par défaut — décision) ; pas de rayon en % de la hauteur (pill accidentel).
- **Cohérence par taille, pas par composant** : les contrôles voisins de même taille partagent le même cran.
- **Aucun état ne change le rayon.**

## Imbrication (concentricité)
- Coin interne collé → épouse le rayon externe (media de carte).
- Élément concentrique interne → rayon externe − écart. Jamais interne plus rond qu'externe ("oreille").
- Anneau externe (focus ring) → rayon du composant **+ offset** (cf. RULES-border).

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Rayons dépareillés dans un groupe | Formulaire perçu cassé | Moyenne |
| Imbrication non concentrique | "Oreilles" dans les coins | Moyenne |
| Pill multiligne | Contour illisible | Moyenne |

CONFIANCE : échelle croissante avec la taille + pill-valeur-géante = établi (Atlassian, Material, Polaris). Échelle à 4 crans (sm/md/lg/pill, cran conteneur `lg` ajouté 2026-07-17) = choix interne ; si un besoin sort des crans : STOP, remonter.
