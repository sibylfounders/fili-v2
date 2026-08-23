---
sujet: radius
type: fondation
resume: "Deux axes : conteneur ou contrôle, puis la taille ; imbrication concentrique ; pill en liste fermée"
requires: []
selon-contexte: ["border (focus ring : rayon du composant + offset)"]
---
# RULES — Radius (compilé, condensé)

> Généré depuis `foundations/radius/RADIUS-UX.md` (v1.3.0) et `RADIUS-UI.md` (v1.2.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- La plus petite fondation. **Règle cardinale : DEUX AXES, et rien d'autre — d'abord le TYPE, ensuite la TAILLE.** Ni l'importance, ni l'état, ni le goût de l'écran.

## Choix du cran — dans cet ordre
1. **Forme intrinsèquement pilule ?** Liste **fermée** : badge/tag, avatar, piste de switch, piste de la variante `pill` des tabs → `radius.pill`. Un composant qui n'y figure pas ne la rejoint pas localement : **STOP, remonter**.
2. **Conteneur ou contrôle ?** **Conteneur → `radius.lg`, quelle que soit sa taille** — card, alert, **modale**, **liste flottante d'un select**, **toast**.
3. **Contrôle → sa taille décide** : `scale.compact` → `radius.sm` ; standard (bouton/input md-lg) → `radius.md`.

- Le **déclencheur** d'un select est un contrôle (`radius.md`), sa **liste** est un conteneur (`radius.lg`) : un même composant résout deux crans, et c'est correct.
- Un contrôle mono-ligne ordinaire (bouton, input) ne prend **jamais** `pill` — mono-ligne n'est pas *intrinsèquement pilule*. Jamais sur du multiligne (effet stade).
- Pas de cran 0 (rien n'est carré par défaut — décision) ; pas de rayon en % de la hauteur (pill accidentel).
- **Cohérence par taille entre contrôles voisins** : un input md à côté d'un bouton md partagent `radius.md`.
- **Aucun état ne change le rayon.**

## Imbrication (concentricité)
- Coin interne collé → épouse le rayon externe (media de carte).
- Élément concentrique interne → rayon externe − écart. **Jamais interne plus rond qu'externe ("oreille")** — c'est ce qu'un conteneur au cran d'un contrôle produit mécaniquement : une card `lg` (12px) dans une modale `md` (8px) était exactement ce cas jusqu'au 2026-08-03.
- Anneau externe (focus ring) → rayon du composant **+ offset** (cf. RULES-border).

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Conteneur au cran d'un contrôle | Imbrication non concentrique garantie avec toute card posée dedans | Moyenne-élevée |
| Rayons dépareillés dans un groupe | Formulaire perçu cassé | Moyenne |
| Imbrication non concentrique | "Oreilles" dans les coins | Moyenne |
| Pill hors liste fermée | La liste cesse d'être une règle | Moyenne |
| Pill multiligne | Contour illisible | Moyenne |

CONFIANCE : échelle croissante avec la taille + pill-valeur-géante = établi (Atlassian, Material, Polaris). Échelle à 4 crans (sm/md/lg/pill) et **partage en deux axes** (conteneur/contrôle, arbitrage 2026-08-03) = choix interne ; si un besoin sort des crans ou de la liste fermée du pill : STOP, remonter.
