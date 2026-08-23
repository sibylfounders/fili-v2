# Migration Doctrine — reprise du site DS-MD

Le volet **Doctrine** (`/md`) rejoue le site généré de DS-MD (`Design System MD/public/sujets/*.html`),
pas les fichiers markdown seuls : c'est le site qui portait la structure en quatre volets, les cartes de
cas d'usage et leurs modales.

## Deux sources, deux natures

| Source | Ce qu'on en tire | Où ça atterrit |
|---|---|---|
| `Design System MD/atelier/**.md` | la prose longue (couche UX, couche UI, inventaires, socle) | `apps/site/content/md/` |
| `Design System MD/public/sujets/*.html` | la structure : manifeste, règles, preuves, familles de cas, cas (quand/faire/exemple + règles liées), tokens résolus, journal du sujet, illustrations SVG, spécimens | `apps/site/content/doctrine/*.json` |

Les cas d'usage détaillés **n'existent pas** dans les markdown : ils vivent en dur dans
`tools/genere-site.js` / `tools/site/data.js` de DS-MD. Le site généré est donc la seule source
complète — d'où l'extraction depuis le HTML.

## Rejouer l'extraction

```bash
cd ~/Claude/Projects/"Design System MD"
for f in public/sujets/*.html; do
  python3 ~/Claude/Projects/"Sibyl DS"/tools/extrait-fiches-ds-md.py "$f" \
    ~/Claude/Projects/"Sibyl DS"/apps/site/content/doctrine/$(basename ${f%.html}).json
done
python3 ~/Claude/Projects/"Sibyl DS"/tools/extrait-demos-css.py   # regénère app/doctrine-demo.css
```

## Ce qui est reconstruit en composants Sibyl DS

Onglets (`Tabs`), cartes de cas (`Card` en mode clickable), modales (`Modal`), replis (`Accordion`),
nav latérale (`Nav` + `Accordion`). Aucun chrome du vieux site n'est repris.

## Ce qui est repris tel quel — et pourquoi

Les **illustrations SVG** (emblèmes, visuels de famille, visuels de cas) et les **spécimens générés**
du volet Spécifications : ce sont des images et des preuves visuelles, pas de l'interface. Leur CSS est
re-câblé sur les tokens du monorepo (`app/doctrine-demo.css` + la feuille par sujet dans le JSON), donc
elles suivent le thème. Les couleurs *à l'intérieur* des SVG, elles, restent celles du thème clair.
