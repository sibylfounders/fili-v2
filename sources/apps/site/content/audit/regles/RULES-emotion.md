---
sujet: emotion
type: langage
resume: "Couche d'EXPRESSION : moments mérités, budget de rareté, cran motion expressif, contrat de repli inviolable (reduced-motion + ARIA), quatre instruments (mouvement/voix/couleur/forme)"
requires: ["motion", "accessibility"]
selon-contexte: ["voice"]
---
# RULES — E‑motion (compilé, condensé)

> Généré depuis `languages/emotion/EMOTION-UX.md` (v1.1.1) et `EMOTION-UI.md` (v1.2.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.
> **Point ouvert (non tranché)** : le DeleteButton de DS-UI (froissage E-motion sur une action destructive, 2026-07-19) n'est couvert par aucune règle ci-dessous — absent du catalogue, non catégorisé. Cf. `EMOTION-UX.md` § À approfondir et `DECISIONS.md` 2026-07-20. Ne pas en déduire une autorisation ou une interdiction.

## Nature
- Langage d'**expression** : la couche mince, rare et gouvernée qui donne une âme au système. E‑motion = émotion portée par le mouvement (instrument principal, pas unique).
- **Extension SANCTIONNÉE de `motion`** : elle relève le parti pris « productif seulement » (durées > ~400ms, courbe à caractère, célébration) que MOTION-UX déclare paramétrable — sans jamais toucher au contrat d'accessibilité.
- **Règle cardinale** : l'expression est proportionnelle au SENS du moment (miroir de « friction ∝ risque »). Jamais esthétique : c'est une déclaration que cet instant compte.

## Budget de rareté (obligatoire)
- Un moment expressif qui se répète cesse d'être expressif (même loi que « un seul primary par vue »). La rigueur du reste rend la note audible.
- **Jamais** sur une action réflexe ou à haute fréquence (hover, navigation, envoi répété 40×/jour). Un même moment ne se déclenche qu'une fois par séquence utile, jamais par item de liste ni par frappe.

## Moments mérités (catalogue)
Réussite d'un envoi/soumission · première fois / onboarding franchi · cap ou accomplissement · sortie d'une erreur (soulagement) · vide et attente avec personnalité (empty state, chargement long assumé). Hors catalogue : ajouter un moment = décision tranchée (DECISIONS.md), pas un réflexe.

## Contrat de repli (INVIOLABLE)
- E‑motion est **toujours une amélioration, jamais un canal d'information** : l'état vit dans l'ARIA et le statique ; l'animation ne fait que le célébrer. Couper l'animation ne coupe jamais l'info.
- `prefers-reduced-motion` : le moment **dégrade proprement** vers sa version instantanée (« Envoyer » → « Envoyé ✓ » sans vol), pas vers rien. On perd la fête, jamais le fait.
- **Hérite tout le contrat WCAG de `motion`** : pas de flash > 3/s (2.3.1), `transform`/`opacity` uniquement, jamais de verrouillage d'action, rien d'informatif par le seul mouvement. Le parti pris d'identité est relevé, la contrainte jamais. Cf. `RULES-motion.md`, `RULES-accessibility.md`.

## Quatre instruments
- **Mouvement** (premier violon) — cran `motion.expressive` / `motion.spring` (overshoot) / plafond `motion.celebration`.
- **Voix** — le microcopy se réchauffe d'un cran sur ces instants (autorité `RULES-voice.md` ; E‑motion en autorise le registre chaleureux, ne le redéfinit pas).
- **Couleur** — puise dans les tokens (succès, marque) ; jamais une couleur nouvelle.
- **Forme / illustration** — un glyphe qui se dessine, une silhouette qui se plie ; au service du moment.
- Un moment réussi **accorde** ses instruments (le mouvement se résout quand la voix change et que le vert s'installe).

## Anatomie d'un moment (trois actes)
1. **Anticipation** (`motion.fast`, `ease-in`) — le départ se ramasse.
2. **Acte** (`motion.expressive`, `motion.spring`) — le geste : l'objet se plie, décolle, la traînée se dessine (`stroke-dashoffset`).
3. **Résolution** (`motion.expressive`, `ease-out`) — le nouvel état s'installe (succès + voix + vert).
La somme ne dépasse jamais `motion.celebration`. Le vol/pliage/traînée : `transform`/`opacity` + `stroke-dashoffset` ; jamais de layout animé.

## Compatibilité & poids (contrat par moment signature)
- Chaque moment publie sa **table de support navigateurs façon caniuse** (complet / dégradé léger avec le détail de ce qui manque / sans animation, versions planchers). Non documenté = non livrable.
- **Repli statique garanti** : sans le socle requis (ex : variables CSS), le composant reste un contrôle statique fonctionnel (action + ARIA) — le moment est un enrichissement progressif, jamais une dépendance.
- **Budget de poids** : zéro dépendance d'animation, quelques Ko, aucune animation au repos, jamais de layout (transform/opacity composités ; clip-path/dashoffset/couleur peints sur la seule surface du composant).

## Gouvernance
- Chaque moment signature = composant/comportement **catalogué, versionné, exception documentée** (comme la connexion sociale), jamais un effet local copié.
- Premier citoyen : le **SubmitButton « avion en papier »** (envoi async → pliage/vol → succès). Sert de gabarit ; tout futur moment suit son anatomie et son repli.
- L'envoi réel (requête) part indépendamment de l'animation ; l'état serveur prime, l'animation ne retient jamais l'utilisateur.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Moment expressif sur action fréquente | L'effet se retourne : ralentit, agace, se banalise | Élevée |
| Info portée par la seule animation | Perte sous reduced-motion / lecteur d'écran | Critique |
| Repli reduced-motion absent | Troubles vestibulaires (2.3.3) ; état illisible | Critique |
| Séquence > `motion.celebration` | Perçue comme un blocage, pas une fête | Moyenne |
| Instruments désaccordés (mouvement ≠ voix ≠ couleur) | Bruit au lieu d'émotion | Moyenne |
