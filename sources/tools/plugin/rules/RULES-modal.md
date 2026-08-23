---
sujet: modal
type: composant
resume: "Dialog modal centré qui hérite entièrement de la mécanique overlay (scrim, piège de focus, Échap, retour au déclencheur, scroll-lock) et se réserve à une interruption courte exigeant une décision dans un contexte préservé, jamais empilée, en deux crans de largeur, toujours titrée en nom accessible, au défilement limité au corps, et dont toute destruction se confirme en nommant l'objet réel"
requires: ["overlay"]
selon-contexte: ["button (bouton destructif et paire d'actions du Footer)", "form (structure d'un formulaire porté par une modale de saisie)"]
---
# RULES — Modal (compilé, condensé)

> Généré depuis `components/MODAL-UX.md` (v1.0.0) et `MODAL-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- `dialog` **modal et centré**, seconde forme de superposé modal après le drawer : partage tout avec overlay (scrim, piège de focus, Échap, retour, scroll-lock) ; ne diverge que sur l'**ancrage**.
- Porte toujours une **conclusion** ; sans fin naturelle, ce n'est pas une modale, c'est une page.

## Légitimité
- Légitime si trois conditions tiennent ensemble : interruption **courte**, **décision** requise, **contexte d'origine** à préserver. Sinon : page (long/partageable), drawer (contextuel volumineux/multi-étapes), saisie en ligne (champ visible), toast/alert (rien à décider), popover (aide ancrée).

## Une seule modale, jamais empilée
- Une seule modale ouverte à la fois ; interdit d'en ouvrir une depuis une modale. Une action qui réclame sa propre confirmation **remplace le contenu en place**, elle ne s'empile pas.

## Familles et largeur
| Famille | Largeur | Actions |
|---|---|---|
| Confirmation d'action | `narrow` (`grid.container-narrow`) | Action + retrait, jamais plus |
| Saisie courte (1-3 champs) | `narrow` (`grid.container-narrow`) | Valider / Annuler |
| Détail / lecture | `default` (`grid.overlay`) | 0 à 1 action |
- La largeur suit la famille, jamais l'inverse.

## Destruction
- Irréversible → famille « confirmation », jamais une alerte inline ni `window.confirm`. Titre/corps **nomment l'objet réel** (« Supprimer le projet Rocket ? »), jamais « Confirmer ». Bouton destructif jamais l'action par défaut au clavier ; enjeu élevé → confirmation différée (délai, ou saisie « SUPPRIMER »).

## Fermeture, titre, focus
- Trois sorties actives : Échap, croix (`Modal.Close`), clic-voile. Le clic-voile seul se **désarme** (`dismissOnScrim={false}`) si une saisie en cours serait perdue ; Échap et la croix restent actifs.
- Titre **obligatoire** (`Header`) = **nom accessible** (`aria-labelledby` auto) ; sans `Header`, `aria-label` explicite. Nomme la tâche, jamais l'objet générique.
- Focus entre à l'ouverture, boucle en piège, revient au déclencheur sans faire défiler (`preventScroll`) ; la croix ne précède jamais le premier champ d'une saisie.

## Contenu long
- Seul le `Body` défile ; jamais la page, jamais toute la surface. `Header`/`Footer` fixes, actions toujours visibles.

## UI (tokens)
- `size="narrow"` → `grid.container-narrow` ; `size="default"` → `grid.overlay` ; `size="wide"` → `grid.container-default` (1024 — modale porteuse d'illustration ou de tableau court, ajouté 2026-07-29). La confirmation reste narrow.
- Voile `overlay.scrim` sous la surface, `z-index.overlay` partagé. Surface : `elevation.overlay` (jamais `elevation.raised`), **`radius.lg`** (cran CONTENEUR — `radius.md` jusqu'au 2026-08-03, un cran de contrôle qui rendait non concentrique toute card `lg` posée dedans), `color.border`. Focus ring `border.focus-width`/`border.focus-offset`, piège manuel.
- Scroll-lock : verrouille `body` **et chaque ancêtre défilant réel** du déclencheur, pas seulement `document.body`. Mouvement `opacity`+`translate-y` sur `motion.slow` (voile idem), `prefers-reduced-motion` respecté.
- Footer : séparateur `color.border` en trait supérieur, `spacing.*` d'abord. Fond non `inert` nativement, approché par scrim + piège manuel + `aria-modal` (identique Drawer).

## Frontières
- Scrim, z-index, piège, scroll-lock restent overlay ; ombre elevation, ring de focus border, durées motion, wording voice. Formulaire porté reste form ; emphase/ordre des boutons du `Footer` reste button.
- Drawer : mécanique identique, seul l'ancrage diverge (centré vs bord). Toast/Alert : n'interrompent jamais, sans décision immédiate = toast/alert, jamais modale.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Modale ouverte depuis une modale | Pièges de focus concurrents, Échap/Tab ambigus | Élevée |
| Bouton destructif par défaut au clavier | Suppression accidentelle par Entrée réflexe | Élevée |
| Verrou de scroll sur `document.body` seul dans un shell | Fond qui glisse, focus mal restitué | Moyenne-élevée |
| Titre « Confirmer » générique | Erreur de clic sur le mauvais élément | Moyenne |

CONFIANCE : mécanique héritée d'overlay (scrim, piège, Échap, retour, scroll-lock) = établie (ARIA APG *Dialog Modal*, WCAG). Seuil de légitimité et règle « une seule modale » = établis par convergence (NN/g, Material, Carbon). Deux crans de largeur et désarmement du clic-voile sans confirmation native = arbitrage interne, non formalisé. Fond non `inert` = cas isolé, écart documenté.
