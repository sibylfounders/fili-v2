---
sujet: alert
type: composant
resume: "Messages d'état dans le flux : tone (info/success/warning/danger) × persistance (permanent/dismissible) — toast et modale hors périmètre"
requires: []
selon-contexte: ["button (si l'alert porte une action)", "form (résumé d'erreurs : l'orchestration vit côté form)", "input (une erreur mono-champ est un message inline d'input, pas un alert)", "interaction (intention « comprendre un état », lois d'affordance 3/5)", "motion (apparition réactive en opacité, reduced-motion)", "voice (ton par gravité, ne jamais blâmer)", "emotion (moment « sortie d'erreur » délégué au relais)"]
---
# RULES — Alert (compilé, condensé)

> Généré depuis `components/ALERT-UX.md` (v1.4.0) et `ALERT-UI.md` (v1.4.0). Règles condensées pour le build — la source fait autorité en cas de doute. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Axes
- Deux axes : **tone** (info/success/warning/danger) × **persistance** (permanent/dismissible).
- **Pas d'axe style** : le contraste suit la gravité du message, il ne se choisit pas par instance (un danger discret ou un info tapageur = mensonge d'interface). Rendu unique "low contrast" (fond subtil).
- **Pas de neutral** : porter une charge sémantique est la fonction même de l'alert ; sa valeur minimale est info.
- **Pas de size** : largeur dictée par le conteneur, hauteur par le contenu.
- Nommage : `danger` ici = même registre que `destructive` (bouton) et `error` (input) — famille `color.danger`, nom adapté à chaque composant.
- **Frontière** : le toast (temporaire, au-dessus du flux, chronométré) et la modale d'alerte (bloquante) sont d'autres composants. L'alert vit *dans le flux* de la page.

## Usage
- Utiliser pour une information contextuelle qui doit être vue sans être cherchée : condition affectant la page, conséquence d'un état, résumé d'erreurs de formulaire, avertissement avant zone risquée.
- Pas pour le feedback immédiat d'une action réussie ("Enregistré ✓") → toast. Pas pour une décision bloquante → modale. Jamais pour du promotionnel/upsell.
- **Échelle d'interruption** : alert < toast < modale. Le niveau se choisit sur l'urgence *réelle* pour l'utilisateur, jamais sur l'envie de visibilité de l'émetteur.
- Erreur d'un seul champ → message inline de l'input (RULES-input), pas un alert. L'alert entre en scène quand l'information dépasse l'élément (plusieurs erreurs, une section, la page).

## Partage d'autorité
- Le résumé d'erreurs de formulaire = alert danger permanent. Ce fichier régit le conteneur (structure, tokens, role="alert", non-dismissibilité) ; RULES-form régit l'orchestration (déclenchement, contenu, focus, coexistence avec l'inline).
- Les boutons d'une bannière de consentement restent régis par RULES-button ; la bannière elle-même est hors périmètre.

## Tone
- **Info** : informer sans alarmer ; seul tone légitime pour du proactif sans risque. Si l'info n'a pas besoin d'être remarquée → texte courant, pas de alert.
- **Success** : confirmer durablement un état acquis, quand la confirmation doit *rester consultable*. Un simple feedback d'action → toast, jamais un alert.
- **Warning** : condition qui mérite attention avant d'agir, aucune erreur encore commise. Doit dire *quoi faire* ou *quoi surveiller* — jamais d'avertissement sans action possible. Pas un "danger poli" : si c'est déjà bloquant, c'est un danger.
- **Danger** : condition grave *déjà* vraie (erreur bloquante, perte en cours). Rare — plusieurs danger simultanés = problème d'architecture d'information. Dit toujours quoi, pourquoi, comment sortir.

## Persistance
- **Permanent** : vit tant que la condition est vraie, pas de fermeture utilisateur. Réservé à proactif ou bloquant (ignorance = coût réel). Jamais pour du confort d'émetteur.
  - Résolution : l'alert disparaît quand la condition cesse — si c'est suite à une action utilisateur, la confirmation doit être annoncée par le mécanisme qui prend le relais (lecteur d'écran : une disparition n'annonce rien).
- **Dismissible** : le défaut pour tout ce qui n'est ni bloquant ni critique. Croix = vraie cible (44px, focusable, libellée "Fermer"). Fermeture mémorisée au moins pour la session, durablement pour les annonces ponctuelles. Réapparition légitime uniquement si la condition redevient vraie ou s'aggrave.

## Combinaisons tone × persistance
| Tone | Permanent | Dismissible |
|---|---|---|
| Info | Rare (info conditionnant l'usage de la page) | **Cas nominal** |
| Success | À peu près jamais justifié | Bon défaut du success |
| Warning | Condition active à surveiller | OK si le risque est assumable |
| Danger | **Cas nominal** — jamais dismissible si critique | Seulement si gravité passée/assumable (sinon c'était un warning) |

## Composition
- Ordre canonique : **icône → titre → corps → actions**, croix (dismissible uniquement) en coin opposé au sens de lecture. Jamais de croix sur un permanent (affordance mensongère).
- **Icône** : canal redondant du tone, jamais retirée pour alléger (WCAG 1.4.1). Une icône par tone, constante. Silhouettes distinctes par tone, pas seulement des couleurs : cercle / cercle-coche / triangle / octogone. CONFIANCE : établi.
- **Titre** : le message en une ligne — qui ne lit que le titre repart avec l'essentiel. Jamais de titre-catégorie ("Erreur") : le tone porte la catégorie, le titre porte le contenu ("Le paiement n'a pas abouti").
- **Corps** : le pourquoi et le comment-corriger, diagnostic fait pour l'utilisateur. Optionnel si le titre suffit. 1-2 phrases max — au-delà, lier vers une page.
- **Actions** : une seule action mise en avant, une seconde tolérée en lien discret. Emphasis/tone des boutons → RULES-button ; l'alert impose le nombre. Le tone du bouton décrit l'*action*, pas la condition : l'action d'un danger n'est pas forcément destructive ("Corriger" répare).

## Empilement
- Plafond : **un alert par niveau de conteneur** (un page, un par section). Au-delà, agréger (3 warnings de quota → 1 alert qui liste).
- Cohabitation inévitable : gravité décroissante (danger > warning > info), jamais l'ordre d'arrivée.
- L'agrégé est toujours préférable à la pile. CONFIANCE : non formalisé (convergence des "sparingly", pas de règle chiffrée).

## États et comportement
- Proactif (chargé avec la page) : contenu ordinaire — pas d'animation d'entrée, pas de rôle live, placé dans le DOM avant ce qu'il conditionne.
- Réactif (injecté) : doit être annoncé — `role="alert"` (danger/warning), `role="status"` (info/success). CONFIANCE : établi.
- L'insertion ne provoque jamais de saut de mise en page sous le point de lecture.
- Pas d'état hover/focus propre : l'alert n'est pas interactif en surface, seuls ses enfants le sont. Jamais de alert entièrement cliquable.
- **Canal sonore éventuel** : strictement redondant — un futur bip *double* le message (texte + icône + couleur), jamais seul (WCAG 1.4.1). Contrat en avance, aucun son actuel.

## Contextes
- **Pleine page** : en tête du contenu, sous le header, pleine largeur — avant ce qu'il conditionne, jamais après. Réservé aux conditions affectant la page entière.
- **Section/carte/modale** : sous le titre de la section, largeur du conteneur annoté. Dans une modale : au-dessus des éléments concernés, jamais pleine page.
- **Au-dessus d'un élément** : condition portant sur un geste précis. Frontière : valeur d'un champ → input ; disponibilité/contexte du geste → alert.
- **Résumé d'erreurs de formulaire** : orchestration → RULES-form.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Réactif injecté sans annonce (SPA) | Lecteur d'écran jamais informé | Critique |
| Tone par couleur seule | Exclusion daltonisme | Élevée |
| Signal sonore sans équivalent texte/visuel | Exclusion des sourds / son coupé (1.4.1) | Élevée |
| Danger dismissible sur condition active | Condition critique masquée, perte | Élevée |
| Inflation de alerts | Cécité d'attention apprise | Élevée (différée) |
| Fermeture non mémorisée | Réflexe "fermer sans lire" | Moyenne |
| Success qui ne part jamais | Méfiance sur la fraîcheur de la page | Moyenne |
| Insertion avec saut de layout | Perte de position, clic raté | Moyenne |
| Titre-catégorie sans contenu | Diagnostic transféré à l'utilisateur | Moyenne |

## Règle transversale
- **L'interruption est proportionnelle à l'urgence réelle du message, jamais à l'envie de visibilité de l'émetteur.**

## Application des Languages
- **Interaction** : l'alert est l'expression canonique de l'intention **« comprendre un état »** (`INTERACTION-UX`) ; sa non-interactivité de surface applique la **loi d'affordance n°3** (une surface organise sans promettre un clic), la redondance icône/couleur la **loi n°5** (la couleur renforce, ne crée pas seule le sens).
- **Motion** : l'apparition d'un alert *réactif* se joue **en opacité seule** (jamais de slide qui pousse le contenu, `MOTION-UX`) ; **proactif = aucune animation** ; sortie au cran inférieur de l'entrée ; contrat `prefers-reduced-motion` conforme par construction (aucune translation à supprimer, le fondu demeure).
- **Voice** : l'axe de gravité info/success/warning/danger est une **projection de l'axe état-émotionnel** de `VOICE-UX`, pas un axe concurrent ; règle cardinale **ne jamais blâmer** ; « le mot est le canal de dernier recours » (une résolution passe par un relais textuel, jamais la seule disparition visuelle).
- **E-motion** : **sans instrument expressif — position tranchée**, l'alert est productif de bout en bout. **Un événement, un porteur** : le moment « sortie d'erreur / récupération » ne s'incarne pas dans l'alert danger (porteur du problème) mais dans le **success / toast de relais** qui confirme après coup ; l'exception chaleureuse ne touche jamais danger ni warning.

---

## Règles techniques (UI)

- Rendu identique pour les 4 tones : fond `{tone}-subtle`, bordure `{tone}` en 1px (hairline, exception documentée non tokenisée), texte et icône `{tone}`, `radius.lg` (cran conteneur).
- Tous les couples texte/fond ≥ 4.5:1 (AA sans aménagement — danger 5.30, warning 6.37, info 5.49, success 4.57).
- Persistance : aucun token propre — seule différence de rendu, la croix.

```yaml
icon_shape: { info: circle, success: circle-check, warning: triangle, danger: octagon } # forme normative ; danger = octogone "stop", jamais un triangle
tone:
  info: { background: color.info-subtle, border: color.info, text: color.info, icon: color.info }
  success: { background: color.success-subtle, border: color.success, text: color.success, icon: color.success }
  warning: { background: color.warning-subtle, border: color.warning, text: color.warning, icon: color.warning }
  danger: { background: color.danger-subtle, border: color.danger, text: color.danger, icon: color.danger }
structure: { radius: radius.lg, padding: spacing.md, icon_gap: spacing.sm, title_to_body: spacing.xs, body_to_actions: spacing.sm }
typography: { body_font: typography.body, title_weight: typography.display.fontWeight, fallback: typography.fallback.sans }
dismiss: { icon: color.text-secondary, min_touch_target: 44px }
aria: { reactive_danger_warning: role="alert", reactive_info_success: role="status", proactive: aucun role live }
```

### Structure
- Icône alignée sur la première ligne du titre, jamais centrée verticalement sur le bloc.
- Largeur : 100 % du conteneur d'accueil — jamais de largeur propre.
- Le bloc se lit comme une seule unité (titre/corps resserrés `spacing.xs`).

### Croix de fermeture
- Vrai `<button>` libellé "Fermer", icône `color.text-secondary`, zone tactile 44px même si le glyphe est petit.
- Fin de ligne de titre, dans le DOM *après* le contenu (le lecteur d'écran lit le message avant l'option de fermeture).

### Accessibilité
- Titre ≠ heading (`h2`…`h4`) : un alert est un aparté, pas une section — graisse forte, pas de heading fantôme dans la navigation par titres.
- Rôle live : l'élément porteur du rôle est présent dans le DOM *avant* l'injection (ou message inséré d'un bloc avec son conteneur rôlé).
- Icône : `aria-hidden="true"` si le tone est annoncé par le texte/rôle ; sinon alternative textuelle ("Avertissement :"). Jamais la couleur seule.
- Insertion dynamique : réserver l'espace ou insérer sous le point de lecture courant.
