---
sujet: button
type: composant
resume: "Actions : axes style/tone/size, combinaisons à risque, wording, comportements (loading, anti double-soumission), relations entre boutons"
requires: ["interaction", "adaptive"]
selon-contexte: ["form (si bouton de soumission d'un formulaire)", "voice (wording de l'action = cadre unificateur)", "motion (feedback hover, spinner)", "emotion (SubmitButton = gabarit du moment d'envoi ; un événement un porteur)"]
---
# RULES — Button (compilé, condensé)

> Généré depuis `components/button/BUTTON-UX.md` (v1.6.0) et `BUTTON-UI.md` (v1.5.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Usage
- Bouton = action qui modifie un état, soumet une donnée, ou déclenche un processus. Navigation simple → lien, pas bouton.
- Ouvrir une modale = bouton (engage un flux), pas lien.
- Le Button exprime **agir** : identifiable comme contrôle avant lecture. Même `ghost`, il ne devient
  pas un Link. Sa présence vient du style, de la limite et des états — aucune ombre de repos.

## Axes de décision
- Deux axes indépendants, pleinement orthogonaux (4 × 4 = 16 combinaisons colorées) : **style** (remplissage : filled/stroke/lighter/ghost) × **tone** (nature de l'action : primary/neutral/destructive/warning).
- Un bouton n'est jamais "juste destructive" — toujours une combinaison des deux axes.
- Le choix style/tone n'est jamais esthétique : c'est une déclaration sur l'enjeu de l'action pour l'utilisateur.
- Le **rang** d'une action (dominante / alternative / mineure) n'est PAS un axe : on l'obtient en combinant style+tone. Correspondance canonique : dominante = `filled`+`primary` (ou +tone de la conséquence) ; alternative = `stroke`/`lighter`+`neutral` ; mineure = `ghost`+tone approprié.

## Style (remplissage)
- **Filled** : aplat plein, le poids visuel maximal. Porte typiquement la dominante d'une vue. Un seul rôle dominant visible par vue (deux `filled`+`primary` côte à côte s'annulent).
  - Exception : CTA de header sticky + dominante de contenu peuvent coexister (deux registres), mais jamais au même poids — l'un domine clairement.
- **Stroke** : bordure + texte colorés, fond de page. Poids moyen — l'alternative légitime, ne concurrence pas la dominante.
- **Lighter** : fond teinté doux + texte de tone. Poids moyen-doux — alternative ou mise en avant discrète d'un tone.
- **Ghost** : texte seul, fond au hover. Poids minimal — action mineure ("Voir plus"). Une action à enjeu fort en ghost est mal classée, sauf si son tone (destructive/warning) compense.

## Tone (couleur / sens)
- **Primary** : couleur de marque, porte l'action que le produit veut voir aboutir. Seul tone tiré de la palette de marque. Habille n'importe quel style (un `stroke`+`primary` ou `lighter`+`primary` est légitime).
- **Neutral** : défaut hors marque, sans charge sémantique. Rendu « noir ». La majorité des boutons (souvent `stroke`/`ghost`).
- **Destructive** : action qui retire/supprime/annule de façon coûteuse à revenir en arrière. Jamais positionné à l'emplacement habituel d'une action fréquente (clic réflexe). Pas pour les actions négatives mais réversibles (ex : "Retirer du panier").
- **Warning** : action à poids réel (conséquente, engage un tiers) qui ne détruit ni ne retire rien. Même isolement visuel que destructive. A désormais les 4 styles (le fond plein warning est autorisé depuis DESIGN 1.21.0). CONFIANCE : non formalisé.

## Combinaisons
Colonne = combinaison réelle (style × tone) ; rang = usage servi.
| Style × Tone | Rang | Exemple |
|---|---|---|
| filled + primary | dominante | "Confirmer la commande" — CTA principal standard |
| filled + destructive | dominante | "Supprimer définitivement mon compte" — confirmation en modale destructive |
| filled + warning | dominante | "Signaler une urgence" — forte portée, non destructive |
| stroke / lighter + neutral | alternative | "Annuler", "Retour" |
| ghost + neutral | mineure | "Voir plus" — action mineure |
| ghost + destructive | mineure | Icône suppression en table/liste — le tone compense le poids faible |
| ghost + warning | mineure | Icône "signaler" discrète en menu contextuel |

## Tailles
- La taille répond à la densité du contexte, pas à l'importance (ne pas confondre avec le style/tone).
- **sm** : contextes denses (tables, toolbars, panneaux compacts) · **md** : défaut (formulaires, standard) · **lg** : forte emphase volontaire (hero, CTA marketing).
- Jamais de tailles mélangées dans un même groupe de boutons, même si les styles diffèrent.

## Comportements
- **Toggle** : bascule entre deux états persistants. L'état visuel reflète l'état *actuel*, jamais l'action à venir ("Suivi ✓", pas "Suivre").
- **Confirmation (hors modale)** : conclut une séquence engagée ; toujours accompagnée d'une option d'annulation visible au même niveau, jamais seule issue.
- **Undo** : toast/notification 5-8 s minimum, sans bloquer l'interface. Un bon undo peut remplacer la confirmation préalable — mais jamais les deux absents sur une action à enjeu réel.
- **Palier de friction** = coût de recréation de la donnée si mal exécuté :
  1. triviale à recréer → suppression directe + undo, pas de confirmation ;
  2. pas facilement récupérable → confirmation simple expliquant la conséquence ;
  3. coûteuse/volumineuse (fil entier, compte) → confirmation différée (délai 2-3 s ou "tapez SUPPRIMER").
  Le palier dépend de la donnée derrière, pas de l'apparence du bouton. CONFIANCE : établi (IBM Carbon).
- **Anti double-soumission** (paiement, envoi définitif) : loading/disabled dès le premier clic, avant la réponse serveur.
- **Confirmation différée** : friction volontaire contre le clic réflexe. CONFIANCE : convergence (GitHub, Stripe).

## Relations entre boutons
- Ordre primary/secondary : pas de règle universelle — la seule règle est la cohérence interne au produit : un ordre choisi par type de paire ne varie jamais d'un écran à l'autre. (Auth en header : secondary précède, primary clôt à droite en LTR.)
- Deux boutons de poids identique juxtaposés : proscrit hors choix binaire équilibré volontaire (ex : consentement).
- Menu à 3+ options parallèles de même nature : égalité de poids correcte — la cardinalité du primary ne s'applique pas.
- Espacement minimum anti mis-clic entre boutons adjacents (valeurs : UI).

## Grille
- Le bouton hérite de la grille du contenu qu'il accompagne — aligné sur elle, jamais centré "parce que c'est plus propre".
- Un seul bouton de soumission par formulaire.

## Contextes
- **Formulaire** : bouton en fin de flux (jamais en milieu de scroll) ; label final = conclusion réelle ("Confirmer mon inscription"), pas "Suivant" ; soumission toujours active, validation au clic — autorité : `RULES-form.md` / FORM-UX.
- **Table/liste** : pas d'icônes d'action hover-only (invisible en tactile) ; destructive en icône = confirmation obligatoire, mais pas pour toutes les icônes ("éditer" n'en a pas besoin).
- **Modale** : position des boutons = convention unique pour tout le produit ; le destructif n'est jamais le bouton par défaut activable par "Entrée".
- **Card** : cardinalité/position des actions régies par CARD-UX ; ce composant garde le choix style/tone/taille. Padding jamais sous le seuil tactile.
- **Header** : CTA visible au scroll ; un seul primary, les autres restent des liens.
- **Pagination** : page courante non cliquable, états actif/inactif sans ambiguïté ; progression explicite si pertinent ("Page 3 sur 12").
- **Bannière consentement** : poids visuel équivalent entre les deux options (l'inverse est un dark pattern). Bannière promo : fermeture facile, sans friction.
- **FAB** : un seul par écran ; zone d'exclusion autour, jamais de contenu critique masqué.

## États
- Disabled silencieux proscrit : toute désactivation expose sa cause (tooltip, inline, ou déductible).
- Loading : le label devient indicateur de progression, pas simplement grisé.
- Mobile : retour haptique léger au tap (pas de hover). Desktop : changement visuel perceptible au hover obligatoire, surtout ghost.
- Haptique = **supplément, jamais l'unique feedback** : un appareil sans vibreur ou dont l'utilisateur l'a coupé ne perd aucune information (principe des canaux).
- **Action grave déclenchée à la relâche** (`click`/`pointerup`), annulable si on relâche hors du bouton — jamais au `pointerdown` (WCAG 2.5.2). Le `<button>` natif le garantit ; un `div`+handler `pointerdown` le casse.
- Action différée : compte à rebours visible en continu sur le bouton.
- CONFIANCE : établi (Stripe, Linear, GitHub).

## Wording
- Verbe d'action décrivant le bénéfice ou la conséquence > label générique ("Créer mon compte" / "Confirmer la commande", pas "Submit" / "OK" / "Valider").
- CONFIANCE : cas isolé (Porter, "Register"→"Continue", +45 % — non généralisable).

## Forme et contenu
- Emplacement de l'icône = axe à 5 valeurs (même logique code + Figma) : **none** (texte seul) · **leading** (tête) · **trailing** (fin) · **both** (une de chaque côté) · **only** (icône seule).
- Icône seule (**only**) : `aria-label` obligatoire sans exception, et bouton **carré** (largeur = hauteur, padding égal). Usage récurrent en espace contraint → CompactButton.
- Icône + texte : leading = navigation/catégorisation ; trailing = progression/ouverture ; ordre cohérent d'un bouton à l'autre. **both** réservé aux cas où les deux directions portent du sens.
- Badge/compteur ("Panier (3)") : information d'état, jamais une seconde action cliquable, ne nuit pas au label.
- Connexion sociale : les contraintes de la marque tierce priment — exception documentée.

## Risque par combinaison
| Style + Tone | Risque principal | Sévérité |
|---|---|---|
| filled + primary (conversion) | Perte de conversion si wording/état mal géré | Élevée |
| filled/ghost + destructive | Perte de données, irréversible par définition | Critique |
| ghost + destructive (icône) | Exclusion accessibilité en plus du destructive | Critique |
| Action grave au pointerdown | Déclenchement accidentel non annulable (2.5.2) | Élevée |
| Désactivé sans cause | Confusion, abandon silencieux, invisible en bug report | Moyenne |
| filled/stroke + neutral (financier) | Double soumission, double débit | Critique |

## Règle transversale
- **La friction est proportionnelle au risque réel de l'action, jamais uniforme.**

## Application des Languages
- **Interaction** : le Button est l'expression canonique de l'intention **agir** (`INTERACTION-UX`) — identifiable comme contrôle avant lecture, jamais confondu avec un Link.
- **Motion** : les mouvements du Button sont du **feedback** (`MOTION-UX`, `motion.fast`/`ease-out`, transition interruptible) ; le spinner est la seule exception au non-linéaire ; repli `prefers-reduced-motion` = indicateur statique, l'état vit dans l'ARIA.
- **Voice** : le § Wording est encadré par `VOICE-UX` (cadre unificateur, source nommée) — verbe orienté conséquence, un concept = un mot (WCAG 2.4.4) ; registre productif hors exception E-motion bornée.
- **E-motion** : le Button est le **gabarit** d'`EMOTION-UX` — le SubmitButton porte le moment « réussite d'un envoi ». **Un événement, un porteur** : le moment s'incarne une seule fois (bouton en place OU toast injecté, jamais les deux) ; contrat de repli + budget de rareté (jamais sur une action réflexe). Le DeleteButton « froissage » reste un point ouvert non tranché.

---

## Règles techniques (UI)

**Frontière (pivot 2026-07-21) : implémentation de référence.** Tout ce qui suit (tokens, tailles, ratios, label = typography.body) décrit *ce* système — jamais un critère d'audit d'une interface tierce. L'universel auditable vit plus haut (usage, hiérarchie, états, wording) et dans les planchers externes (cible 24px WCAG 2.5.8 ; 44px = confort renforcé maison).

- Axes : style [filled, stroke, lighter, ghost] × tone [primary, neutral, destructive, warning] × size [sm, md, lg]. États : [default, hover, focus, active, disabled, loading].

### Mapping des tokens
Chaque tone fournit ses déclinaisons ; le style choisit lesquelles s'appliquent :
- **filled** : `solid` (fond) + `on_solid` (texte) + `solid_hover` (fond au hover, assombri).
- **stroke** : fond de page + `fg` (texte/bordure ; bordure neutral = `border`) + `subtle` (fond au hover apparaissant).
- **lighter** : `subtle` (fond) + `on_subtle` (texte) + `subtle_hover` (fond au hover, soutenu).
- **ghost** : fond de page + `fg` (neutral : `fg_ghost`) + `subtle` (fond au hover apparaissant).
- Tout tone fournit d'emblée les 4 déclinaisons — sinon il ne peut pas porter les 4 styles (le build refuse au token manquant).

```yaml
tones:
  primary:     { solid: color.primary,        on_solid: color.on-primary, solid_hover: color.primary-hover,
                 fg: color.primary,            border: color.primary,
                 subtle: color.secondary,      on_subtle: color.on-secondary, subtle_hover: color.secondary-hover }
  neutral:     { solid: color.neutral-strong,  on_solid: color.on-primary, solid_hover: color.neutral-strong-hover,
                 fg: color.text-primary,        fg_ghost: color.text-secondary, border: color.border-strong,
                 subtle: color.surface,         on_subtle: color.text-primary, subtle_hover: color.surface-hover }
  destructive: { solid: color.danger,          on_solid: color.on-primary, solid_hover: color.danger-hover,
                 fg: color.danger,              border: color.danger,
                 subtle: color.danger-subtle,   on_subtle: color.danger,       subtle_hover: color.danger-subtle-hover }
  warning:     { solid: color.warning,         on_solid: color.on-primary, solid_hover: color.warning-hover,
                 fg: color.warning,             border: color.warning,
                 subtle: color.warning-subtle,  on_subtle: color.warning,      subtle_hover: color.warning-subtle-hover }
focus_ring: per-tone  # = le `fg` du ton (couleur de l'objet) : primary→primary, neutral→text-primary, destructive→danger, warning→warning
sizing:
  sm: { height: scale.compact, padding_x: spacing.sm, padding_y: spacing.xs, radius: radius.sm }
  md: { height: scale.base, padding_x: spacing.md, padding_y: spacing.sm, radius: radius.md }
  lg: { height: scale.expanded, padding_x: spacing.lg, padding_y: spacing.md, radius: radius.md }
label_typography:
  family: typography.body.fontFamily
  fallback: typography.fallback.sans
  size: typography.body.fontSize
  weight: typography.display.fontWeight
min_touch_target: 44px
```

### Hover
- **filled** (tout tone) → `solid_hover` (fond assombri d'un cran) · **lighter** (tout tone) → `subtle_hover` (fond teinté soutenu d'un cran) · **stroke / ghost** (tout tone) → `subtle` apparaît (le fond teinté du tone surgit ; neutral = `surface`).
- Les 16 couples texte/fond, au repos ET au hover, sont ≥ 4.5:1 (vérifié par `tools/test-rendu.js` ; paire la plus tendue `lighter`+destructive au hover = 4.60:1).
- `active`, `disabled`, `loading` : volontairement sans token de couleur (loading est un comportement ; active/disabled = dette assumée).

### Tailles
- sm → `scale.compact` (radius réduit) · md → `scale.base` · lg → `scale.expanded` (même radius que md, sinon effet pilule).
- Aucune valeur px absolue : seule la relation sm < md < lg (~1.2-1.25x) est garantie — mapper sur l'échelle du produit.
- Icône seule : padding proche du carré. Icône + texte : gap interne `spacing.xs`-`spacing.sm` < padding externe.

### Accessibilité
- Contraste ≥ 3:1 sur tous les états visibles.
- Focus visible obligatoire, jamais supprimé sans équivalent. **Anneau accordé au ton** = le `fg` du ton (couleur de l'objet) ; chacun ≥ 3:1 sur le fond, offset 2px.
- Zone tactile ≥ 44px même en `sm` — la zone de clic peut dépasser les limites visuelles.

### Adaptation au conteneur
- Le Button seul garde une largeur au contenu ; le pattern parent décide du full-width.
- Un groupe étroit s'empile ou regroupe ses actions secondaires via Container Query.
- États `compact` / `regular` / `expanded`, seuil dérivé du contenu — pas de
  `breakpoint.mobile` copié.
- Style, tone, label accessible et friction ne changent jamais avec la largeur.
- Cible tactile ≥ 44px si le contexte d'entrée l'exige ; `scale.desktop-min` reste le minimum visuel
  d'un contexte dense à pointeur précis.

### Implémentation
- Toute propriété visuelle liée à un token — jamais de valeur en dur, même pour une exception.
- Parité design/code obligatoire (Figma = production).
- Aucun override local dans le code applicatif : toute exception remonte au design system.
