---
sujet: input
type: composant
resume: "Champs de saisie : états et validation, wording des messages d'erreur, contenu additionnel, mot de passe, paiement, autofill"
requires: ["interaction", "adaptive"]
selon-contexte: ["form (convention requis et validation décidées au niveau du formulaire)", "motion (feedback de bordure d'état, reduced-motion)", "voice (message d'erreur, ne jamais blâmer)", "emotion (sans objet — champ réflexe/haute fréquence)"]
---
# RULES — Input (compilé, condensé)

> Généré depuis `components/INPUT-UX.md` (v1.7.1) et `INPUT-UI.md` (v1.7.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Axes
- Trois axes : **status** (default/error/success/warning — ex-`tone`, renommé 2026-07-29 : un statut de validation SUBI, jamais décoratif ; aria-invalid auto en error) × **size** (sm/md/lg) × **field_type** (text/email/password/number/search/tel/url/textarea).
- **Pas d'axe style** : il n'y a jamais "l'input principal de l'écran" — le type de champ le remplace (nature de contenu, pas poids visuel).

## Usage
- Utiliser pour toute donnée en texte libre ou semi-libre. Choix fermé parmi options limitées → select/radio/checkbox (le texte libre y augmente l'erreur sans raison).
- Un champ de recherche est un input même s'il déclenche une action au submit — la nature de la donnée prime.
- Toujours le vrai type HTML (email, search…) — un `text` stylisé perd le clavier mobile adapté et la validation native.
- L'Input exprime **saisir** : zone réceptive visible au repos par label, limite et contenu. Il reste
  à `elevation.none` ; aucun inset n'est requis pour prouver sa fonction.

## Tone
- **Neutral** : défaut, aucune validation en cours.
- **Error** : valeur hors format/contrainte. **Timing : valider on blur, pas à chaque frappe** — sauf champs à fort risque de format (email, mot de passe) : délai ~500ms après la fin de frappe. Jamais tout garder pour la soumission (redécouverte punitive).
- **Success** : optionnel — réservé aux champs à fort enjeu de confiance (dispo d'un username, force d'un mot de passe), pas systématique.
- **Warning** : valeur acceptée mais méritant attention (mot de passe faible). La plupart des inputs n'ont besoin que de neutral/error.

## Message d'erreur (wording)
- Le message fait le diagnostic à la place de l'utilisateur : *pourquoi* et *comment corriger* ("Le format attendu est JJ/MM/AAAA"), jamais "Champ invalide".
- CONFIANCE : cas isolé (Wroblewski : inline = +22% succès, −22% erreurs) + convergence (Baymard/Zuko : +5 à +13% complétion).
- Nuance : la validation inline se réserve aux champs à fort risque d'erreur, pas à généraliser (coût cognitif du va-et-vient remplir/corriger).
- Accessibilité : message précédé du mot "Erreur" ou d'une icône dédiée — jamais le rouge seul.

## Contenu additionnel
- **Helper text** ≠ message d'erreur : aide persistante sous le label, visible dès le focus, guide *avant* la saisie. L'erreur le remplace temporairement tant qu'elle est active (jamais d'empilement).
- **Compteur de caractères** : affiché *avant* la saisie, pas à la limite atteinte. Format ratio "12/280" (convention retenue).
- **Prefix/suffix** ("€", "kg") : élément non éditable à l'intérieur du champ, pas un label externe.
- **Clear** (recherche notamment) : visible seulement quand le champ n'est pas vide.
- **Indicateur requis** : astérisque ou équivalent textuel, systématique sur tout champ obligatoire. La convention requis-vs-optionnel se décide au niveau formulaire → RULES-form.

## Tailles
- sm : tableaux éditables, filtres compacts · md : défaut · lg : recherche hero, onboarding à fort enjeu.
- Jamais de tailles mélangées dans un groupe de champs liés (ex : bloc adresse).

## Contextes
- **Formulaire** : label toujours visible, jamais en placeholder seul (il disparaît à la frappe). Champs du même ensemble logique groupés visuellement.
- **Table (édition inline)** : le mode édition est visuellement sans ambiguïté (bordure, fond).
- **Recherche** : type `search` natif, pas un `text` stylisé.

## Champ de mot de passe
- **Un seul champ + toggle show/hide** — pas de "confirmer le mot de passe" (recherche GOV.UK). CONFIANCE : établi.
- Masqué par défaut ; le toggle révèle à la demande, jamais l'inverse. Retour au type `password` à la soumission.
- Copier-coller toujours autorisé (gestionnaires de mots de passe). `spellcheck="false"`, `autocapitalize="off"`.
- Exigences de format affichées *avant* la saisie. Pas de règles de complexité arbitraires sans justification de sécurité réelle.

## Champ de paiement (carte bancaire)
- Numéro de carte et CVV vivent dans l'iframe du processeur (PCI-DSS) — **les tokens de ce design system ne s'y appliquent pas directement** : styling limité via l'API du processeur uniquement. Jamais de champ carte custom hors solution processeur. CONFIANCE : établi.
- Champs adjacents non sensibles (titulaire, adresse) : gabarit standard + `autocomplete` dédiés (`cc-name`, `cc-exp`, `cc-csc`).

## Autofill
- Jamais désactivé sans raison de sécurité valable — le confort dépasse le risque esthétique (contournement CSS connu, cf. technique UI).

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Label non lié techniquement au champ | Exclusion lecteur d'écran | Critique |
| Nom accessible divergent du libellé visible | Inadressable en commande vocale (2.5.3) | Moyenne |
| Champ de paiement stylé hors iframe | Non-conformité PCI-DSS | Critique |
| Validation à la soumission uniquement | Abandon, redécouverte punitive | Élevée |
| Label en placeholder seul | Perte de repère | Moyenne |
| Type HTML non natif | Comportements natifs perdus | Moyenne |
| Mot de passe sans toggle | Erreurs non détectées | Moyenne |
| Autofill non anticipé | Rupture visuelle | Faible-moyenne |

## Règle transversale
- **La friction de validation est proportionnelle au risque réel d'erreur du champ** — email : quasi temps réel ; prénom : rien.

## Application des Languages
- **Interaction** : l'Input est l'expression canonique de l'intention **saisir** (`INTERACTION-UX`) — zone réceptive visible au repos (label, limite, contenu), distincte d'une action, à `elevation.none`.
- **Motion** : la transition de bordure d'état est du **feedback** (`motion.fast`/`ease-out`, `MOTION-UX`) — le mouvement confirme, il n'informe jamais seul : l'erreur vit dans le **mot**, pas la bordure. Sous `prefers-reduced-motion`, le **changement de couleur est conservé** (opacité/couleur autorisées), seul le mouvement spatial part.
- **Voice** : le message d'erreur est régi par `VOICE-UX` (cadre unificateur, Input nommé comme source réciproque) — **ne jamais blâmer**, dire *pourquoi* et *comment corriger*, jamais « champ invalide ».
- **E-motion** : **sans objet** — la saisie est une action **réflexe et à haute fréquence** (budget de rareté d'`EMOTION-UX`) ; le moment « sortie d'erreur » n'est jamais porté par le champ (registre productif strict).

---

## Règles techniques (UI)

```yaml
sizing:
  sm: { height: scale.compact, padding_x: spacing.sm, radius: radius.sm }
  md: { height: scale.base, padding_x: spacing.md, radius: radius.md }
  lg: { height: scale.expanded, padding_x: spacing.lg, radius: radius.md }
typography:
  value_font: typography.body # JAMAIS en dessous : sous l'équivalent 16px, iOS Safari zoome au focus
  fallback: typography.fallback.sans
colors:
  value_text: color.text-primary
  status.default_border: color.border-strong # bordure délimitante : 3:1 obligatoire (WCAG 1.4.11)
  status.error_border: color.danger
  status.error_text: color.danger
  status.success_border: color.success
  status.warning_border: color.warning
  focus_ring: control.focus-color # focus v2 — cran subtil accordé au statut (error → control.focus-danger…)
content_elements:
  helper_text: color.text-secondary
  character_counter: color.text-secondary
  prefix_suffix: color.text-secondary
  clear_button_icon: color.text-secondary
  required_indicator: color.danger
states: [default, focus, filled, error, disabled, readonly]
```

### Bordure au repos
- Bordure neutral = `color.border-strong` : le champ au repos est identifié par sa seule bordure → délimitante, 3:1 obligatoire à **tous** les états (pas seulement error). La carte outlined garde `color.border` (bordure décorative) — critère appliqué identiquement par le test de rendu.

### Accessibilité
- Label lié via `for`/`id` ou `aria-labelledby` — jamais la seule proximité visuelle.
- Message d'erreur associé via `aria-describedby` (annoncé au focus du champ).
- **Nom accessible = libellé visible** (WCAG 2.5.3) : l'`aria-label` complète le `<label>`, jamais un libellé divergent (sinon champ inadressable en commande vocale).
- **Dictée/collage** : champ natif, ne pas intercepter les touches (masque qui reconstruit la valeur touche à touche = dictée cassée) ; formater après coup, sur la valeur.

### Adaptation au conteneur
- Le pattern parent réorganise les colonnes via Container Query ; l'Input ne lit pas
  `breakpoint.mobile` pour deviner sa largeur.
- Label, valeur, contrainte nécessaire et erreur restent visibles dans tous les états.
- Les services trailing peuvent se regrouper uniquement si leur accès et leur nom sont conservés.

### Autofill — contournement
```css
input:-webkit-autofill {
  transition: background-color 9999s ease-in-out 0s;
  -webkit-text-fill-color: var(--text-primary);
}
```
- Non standardisé : tester sur Chrome, Safari et Firefox, pas supposé universel.

### Paiement
- Styling via l'API du processeur (ex : `styles` object Stripe/Hosted Fields) — prévoir un mapping séparé des tokens couleur/typo vers le format attendu par le processeur choisi.
