---
sujet: toast
type: composant
resume: "Feedback réactif et chronométré : tone (info/success/warning/danger/neutral, défaut neutral), une action tolérée (undo), empilement FIFO 2-3 max, position pilotée par Adaptive — jamais le seul porteur d'une information qui compte encore"
requires: []
selon-contexte: ["alert (frontière flux/superposé, tone et rôles hérités)", "interaction (elevation.overlay désigné pour le toast)", "button (l'action undo suit RULES-button)", "emotion (instrument illustration, toast seul, envoi réussi)", "adaptive (position pilotée par conteneur)"]
---
# RULES — Toast (compilé, condensé)

> Généré depuis `components/TOAST-UX.md` (v1.0.1) et `TOAST-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité en cas de doute. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Axes
- Un seul axe : **tone** (info/success/warning/danger/neutral — défaut `neutral`, l'inverse haute-contraste, ex-`reverse` renommé 2026-07-29 ; les quatre autres identiques à alert). **Pas d'axe persistance** : le toast est temporaire par nature, c'est ce qui le distingue de l'alert. Fermeture : `closing` auto/close/timer.
- **Frontière avec Alert** : l'alert vit *dans le flux* ; le toast vit *au-dessus*, injecté par le système, toujours réactif. Le toast est le territoire du feedback immédiat d'une action réussie — le registre qu'Alert exclut explicitement de lui-même.
- Échelle d'interruption héritée : **alert < toast < modale**.

## Usage
- Utiliser pour confirmer l'issue immédiate d'une action déclenchée par l'utilisateur, quand cette confirmation n'a pas besoin de *rester consultable*.
- Ne pas utiliser pour une condition qui dure (→ alert) ni pour une décision bloquante (→ modale).
- Cas limite : si la confirmation doit rester visible après coup, c'est un alert success dismissible, pas un toast — le toast n'a pas de mémoire.

## Tone
- Les 4 tones d'alert repris à l'identique (arbitrage 2026-07-20).
- **Danger/warning acceptés avec risque documenté** : un toast danger aggrave le risque déjà identifié sur l'alert (« condition critique masquée puis oubliée ») — il disparaît de lui-même, sans changement d'état pour le remplacer. Un toast danger ne doit jamais être le seul porteur d'une condition qui dure ; un répondant durable (état visible ailleurs, ou un alert) doit exister à côté.

## Timing (le point le plus sensible)
- Le délai est **toujours suspendu au survol et au focus clavier** (WCAG 2.2.1, Timing Adjustable), reprend à leur sortie, ne redémarre jamais de zéro.
- **Contrat de repli hérité d'E-motion** : le toast n'est jamais le seul porteur d'une information ; sa disparition ne doit jamais effacer une donnée absente ailleurs de l'écran.
- Durée plancher **5-8s**, reprise telle quelle de `RULES-button.md` (pattern undo, IBM Carbon) — aucune valeur nouvelle inventée à ce niveau. Formule exacte de prolongation : proposition non sourcée, cf. TOAST-UI.md.

## Actions
- **Une seule tolérée, jamais deux** (pattern undo : « Élément supprimé — Annuler »).
- Soumise à la même suspension de timing que le texte — sinon la fenêtre de décision n'est pas fiable au clavier ni au survol.
- Cohérence de tone héritée d'alert : l'action décrit ce qu'elle fait, pas la gravité du toast qui la porte.

## Empilement
- **2-3 toasts simultanés max**, **ordre d'arrivée (FIFO)** — divergence assumée avec alert (qui empile par gravité décroissante) : le toast empile des événements séquentiels, pas des conditions simultanées.
- Au-delà, le plus ancien sort (jamais d'agrégation — contrairement à alert, agréger des événements hétérogènes perdrait le contenu spécifique de chacun).
- Chaque toast de la pile a son propre minuteur indépendant.

## Position
- **Pilotée par Adaptive (conteneur), pas un ancrage fixe viewport** — cohérent avec « la fenêtre définit la page, le conteneur définit le composant ».
- État compact : pleine largeur utile, empilement vertical. État regular/expanded : coin ancré. Ancrage exact (quel coin) : proposition non vérifiée, cf. TOAST-UI.md.

## Instrument E-motion — illustration/forme
- Foyer naturel du moment catalogué **« réussite d'un envoi / d'une soumission »**.
- **Actif uniquement si le toast est seul à l'écran** — jamais sur une pile (cohérence avec le budget de rareté E-motion : un empilement est par nature une répétition).
- **Jamais sur danger/warning** — l'exception chaleureuse de Voice/E-motion ne s'applique jamais à une erreur ou une action destructive. Le moment « sortie d'erreur » s'incarne dans le toast success/info qui confirme la résolution, pas dans le toast danger lui-même.
- Technique : glyphe **dessiné** (`stroke-dashoffset`, gabarit SubmitButton, héritage direct d'EMOTION-UI) — jamais une illustration statique importée. L'arbitrage plus large « bibliothèque d'illustration externe » reste NON TRANCHÉ (cf. DECISIONS.md 2026-07-20).

## États et comportement
- Toujours réactif (jamais chargé avec la page) : `role="alert"` (danger/warning), `role="status"` (info/success) — miroir exact d'alert.
- Hérite le contrat d'accessibilité motion/E-motion pour l'animation d'entrée/sortie : `transform`/`opacity` uniquement, pas de flash > 3/s, `prefers-reduced-motion` dégrade vers une apparition/disparition instantanée sans perte d'information.
- Pas d'état hover/focus propre au conteneur — seuls l'action et une éventuelle fermeture explicite le sont.
- **`elevation.overlay` légitime** — déjà désigné dans RULES-interaction.md pour « futur toast » avant même que ce composant existe. Seule différence de relief avec alert, qui n'en porte aucune.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Toast danger seul porteur d'une condition durable | Condition grave disparaît sans successeur, perte silencieuse | Élevée (acceptée, documentée) |
| Timing non suspendu au survol/focus | Fenêtre de décision (undo) non fiable, WCAG 2.2.1 non respecté | Élevée |
| Toast réactif injecté sans rôle live | Lecteur d'écran jamais informé | Critique |
| Instrument illustration actif sur une pile | Répétition qui banalise le moment, décor gratuit (anti-usage E-motion) | Moyenne |
| Empilement agrégé au lieu de FIFO | Perte du contenu spécifique de chaque événement | Moyenne |

## Règle transversale
- **Le toast confirme un événement passé ; il ne doit jamais être le seul endroit où vit une information qui compte encore.**

---

## Règles techniques (UI)

- Rendu identique à alert pour les 4 tones (fond `{tone}-subtle`, bordure `{tone}`, texte et icône `{tone}`), **rayon `radius.lg`** (cran conteneur, identique à alert — présent dans TOAST-UI depuis la 1.1.0, perdu à la compilation jusqu'au 2026-08-03) et silhouettes d'icône normatives héritées (cercle/cercle-coche/triangle/octogone). Seul écart : `elevation.overlay` (alert n'en porte aucune).
- Pas de croix de fermeture par défaut (proposition — le pause-au-survol/focus couvre déjà le besoin).

```yaml
tone: { info: color.info, success: color.success, warning: color.warning, danger: color.danger } # tokens identiques à alert
radius: radius.lg # cran conteneur, identique a alert
elevation: elevation.overlay
empilement: { max: 3, ordre: fifo, comportement_au_dela: le_plus_ancien_sort }
duree: { base_ms: 6000, extension_par_mot_ms: 50, bonus_action_ms: 2000, plafond_ms: 10000 } # proposition, non établi
aria: { reactive_danger_warning: role="alert", reactive_info_success: role="status" }
motion: { apparition: { duration: motion.base, easing: motion.ease-out }, disparition: { duration: motion.fast, easing: motion.ease-in } }
```

### Timing — implémentation
- Un seul `setTimeout` par toast, suspendu/relancé sur entrée-sortie de `:hover`/`:focus-within`, jamais un intervalle recalculé en continu.

### Position — implémentation
- Conteneur de requête (`container-type: inline-size`) sur la région d'accueil des toasts, jamais un ancrage codé en dur au viewport — ancré **bas-centré** (arbitrage utilisateur 2026-07-21). `container-type` exige toujours une largeur EXPLICITE (pas seulement un plafond), sinon la région s'effondre à 0px et devient invisible — piège CSS corrigé le 2026-07-21.

### Accessibilité — spécifications techniques
- Conteneur live présent dans le DOM avant l'injection, comme alert.
- Icône `aria-hidden="true"` si le tone est déjà annoncé par le texte/rôle ; sinon alternative textuelle.
- Zone tactile de l'action : 44px minimum, focusable, libellée explicitement.
- RTL : l'ancrage bas-centré n'a, par construction, aucun miroir à écrire ; seul l'état compact utilise `inset-inline` (logique, pas `left`/`right`).

## Sources et niveau de confiance
| Affirmation | Source | Confiance |
|---|---|---|
| Frontière alert/toast, exclusion du feedback immédiat | RULES-alert.md (déjà tranché) | Établi |
| Durée plancher undo 5-8s | RULES-button.md (IBM Carbon) | Établi — transposition interne |
| Timing suspendu au survol/focus | WCAG 2.2.1 (Timing Adjustable) | Établi, standard d'accessibilité |
| `elevation.overlay` légitime pour le toast | RULES-interaction.md (déjà écrit avant ce composant) | Établi |
| `role="alert"`/`role="status"` par tone | RULES-alert.md (Polaris, WCAG/ARIA) | Établi — transposition interne |
| Tone 4 valeurs, actions tolérées, empilement FIFO, position Adaptive | Arbitrage utilisateur, conversation 2026-07-20 | Décision d'identité interne |
| Formule de durée exacte | Proposition de premier jet, TOAST-UI.md | Non établi — à vérifier à l'usage |
| Ancrage bas-centré | Arbitrage utilisateur, 2026-07-21 | Établi |

CONFIANCE : mixte — le contrat de timing/accessibilité, la frontière avec l'alert et l'ancrage bas-centré sont établis ; seule la formule de durée exacte reste une proposition non vérifiée. Toute décision non tranchée par ce fichier : STOP, remonter.
