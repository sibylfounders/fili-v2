# Inventaire transversal — Accessibilité, modalités et capacités

> Audit horizontal du système entier. Ce fichier **audite** — il ne fait pas autorité sur les composants et n'est pas une source normative de substitution. Il a désormais un aboutissement (2026-07-14) : les trous transversaux **P1** qu'il a révélés ont donné naissance au principe `accessibility` (`content/md/principles/ACCESSIBILITY-UX.md` — contrat universel compact, `companion: none`, chargé pour toute intention) et à des règles placées **chez leurs propriétaires** (MOTION : flash ; BORDER : focus non masqué ; BUTTON : annulation du pointeur et haptique ; CARD : glisser-déposer ; FORM : limites de temps ; ALERT : signal sonore ; INPUT : dictée et label-in-name). Un cas encore marqué **absent** ou **en attente** désigne toujours le futur propriétaire de la règle — jamais un trou à combler ici.

---

## Mode d'emploi

| Statut | Signification |
|---|---|
| **Couvert** | Une règle explicite existe dans une source normative actuelle. |
| **Partiel** | Une règle existe pour certains consommateurs ou une partie du besoin, sans contrat transversal. |
| **Absent** | Aucune règle normative trouvée ; le système ne doit pas prétendre couvrir ce cas. |
| **En attente** | Aucun consommateur actuel n'exerce encore le besoin ; une position devra être prise avant d'en créer un. |

Le statut mesure la **documentation du système**, pas la conformité d'un produit construit avec lui. Les vérifications automatiques actuelles prouvent la résolution des tokens et certains contrastes ; elles ne simulent ni clavier, ni lecteur d'écran, ni commande vocale, ni usage moteur.

## 1. Perception visuelle

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Contraste du texte | Lire le texte courant et les grands caractères | **Couvert** — COLOR-UX/UI ; couples vérifiés par `test-rendu.js` |
| Contraste des composants | Distinguer bordures, états et focus | **Couvert** — COLOR, BORDER, INPUT, BUTTON ; seuil 3:1 explicite |
| Information sans couleur | Comprendre erreur, succès, sélection et gravité sans distinguer les couleurs | **Couvert** — COLOR, ICONOGRAPHY, INPUT, CARD, ALERT |
| Daltonisme | Distinguer les tones par mot, forme et icône | **Couvert** — COLOR et ICONOGRAPHY ; ALERT conserve une silhouette par tone |
| Zoom du texte à 200 % | Agrandir sans perte de contenu ni fonction | **Partiel** — TYPOGRAPHY documente le zoom ; absence de test de reflow d'un écran assemblé |
| Reflow à forte magnification | Lire à faible largeur sans défilement bidimensionnel injustifié | **Absent** — pas encore de fondation layout/grid ni de règle transversale WCAG 1.4.10 |
| Espacement de texte personnalisé | Supporter les préférences d'interligne, paragraphes, mots et lettres | **Partiel** — TYPOGRAPHY fixe des valeurs lisibles mais ne teste pas les overrides WCAG 1.4.12 |
| Contraste élevé forcé | Conserver les limites, états et focus sous `forced-colors` | **Partiel** — COLOR, BORDER et ELEVATION prennent position ; couverture non vérifiée sur une interface réelle |
| Images et médias informatifs | Fournir une alternative textuelle qui porte la même information | **Partiel** — VOICE et ICONOGRAPHY posent le principe ; pas de composant media ni de test d'alternative |
| Orientation portrait/paysage | Ne pas imposer une orientation sans nécessité | **Absent** — aucun contrat actuel |
| Mode sombre | Maintenir les contrastes et la hiérarchie | **En attente** — explicitement non couvert par décision dans COLOR/ELEVATION |

## 2. Navigation clavier et dispositifs assimilés

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Toute fonction au clavier | Actionner sans souris ni écran tactile | **Couvert** — obligation universelle posée dans ACCESSIBILITY-UX (2.1.1) ; BUTTON, CARD et FORM l'exercent |
| Activation native | Entrée pour lien/bouton, Espace pour bouton | **Couvert** — BUTTON exige la sémantique native |
| Ordre de focus | Préserver la logique, le sens et l'opérabilité | **Couvert** — ACCESSIBILITY pose 2.4.3 ; FORM impose un DOM cohérent et interdit le `tabindex` positif |
| Focus visible | Savoir en permanence où l'on agit | **Couvert** — BORDER fait autorité ; BUTTON, INPUT et CARD le consomment |
| Focus non masqué | Ne pas cacher la cible par un sticky, panneau ou superposé | **Couvert** — contrat WCAG 2.4.11 posé dans BORDER-UX (en avance ; consommateur superposé à naître) |
| Aucun piège clavier | Pouvoir entrer et sortir d'une zone au clavier | **Couvert** — obligation universelle (ACCESSIBILITY-UX, 2.1.2) ; FORM l'exerce ; composant modal à naître |
| Raccourcis à une touche | Désactiver, remapper ou limiter les raccourcis par caractère | **En attente** — aucun raccourci produit actuel, aucune position écrite |
| Focus après changement majeur | Retrouver un point de lecture après erreur, succès, ajout ou suppression | **Couvert pour FORM** — orchestration détaillée ; **partiel** à l'échelle du système |
| Navigation par contacteur | Utiliser un switch via le modèle clavier/focus | **Couvert** — nommé dans ACCESSIBILITY-UX (modalités concurrentes) via le modèle clavier/focus ; test réel restant |

## 3. Technologies d'assistance et restitution non visuelle

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Nom, rôle, valeur | Exposer chaque contrôle dans l'arbre d'accessibilité | **Couvert sur les composants actuels** — sémantique native et ARIA dans BUTTON, INPUT, CARD, ALERT |
| Hiérarchie de titres | Naviguer par structure plutôt que par apparence | **Couvert** — TYPOGRAPHY sépare niveau sémantique et style |
| Label de champ | Entendre le nom et le contexte du champ | **Couvert** — INPUT + FORM (`label`, `fieldset`, `legend`) |
| Description et erreur liées | Entendre aide, contrainte et erreur avec le champ | **Couvert** — INPUT (`aria-describedby`) et FORM |
| Changement dynamique | Entendre statut, erreur et résultat injectés | **Couvert** — ALERT + FORM (`role="alert"`, `role="status"`, `aria-live`) |
| Icône décorative/informative | Cacher le bruit, nommer l'action | **Couvert** — ICONOGRAPHY (`aria-hidden`, `aria-label`) |
| Collection et carte | Entendre liste, sujet et cible réelle | **Couvert** — CARD impose balisage de liste et lien/bouton natif |
| Plage braille | Recevoir une structure et des libellés exploitables en braille | **Partiel** — bénéficie de la sémantique, mais aucun test ni règle spécifique |
| Annonce d'une disparition | Ne pas perdre silencieusement un état résolu | **Couvert pour ALERT** — le mécanisme successeur doit annoncer la résolution |
| Tests avec technologies réelles | Vérifier NVDA, JAWS, VoiceOver ou TalkBack | **Absent** — aucune matrice de test ni preuve de compatibilité actuelle |

## 4. Pointer, tactile et capacités motrices

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Taille des cibles | Activer malgré tremblements ou faible précision | **Couvert contractuellement** — ACCESSIBILITY pose 24 × 24 px CSS ou espacement équivalent (2.5.8 AA) ; BUTTON/ICONOGRAPHY appliquent le standard interne renforcé de 44px |
| Espacement entre cibles | Éviter l'activation voisine accidentelle | **Couvert contractuellement** — l'option d'espacement équivalent et les exceptions de 2.5.8 sont explicites ; test tactile réel restant |
| Hover non indispensable | Accéder à toutes les actions sans survol | **Couvert** — obligation universelle (ACCESSIBILITY-UX, 1.4.13) ; CARD et BUTTON l'exercent |
| Annulation du pointer | Éviter qu'une action grave parte au simple `pointerdown` | **Couvert** — BUTTON-UX : action grave à la relâche, annulable (WCAG 2.5.2) |
| Geste multipoint ou tracé | Fournir une alternative à un pinch, swipe complexe ou dessin | **Couvert** — obligation d'alternative posée dans ACCESSIBILITY-UX (WCAG 2.5.1) ; aucun consommateur gestuel encore |
| Glisser-déposer | Déplacer aussi sans maintenir et traîner | **Couvert** — CARD-UX impose une alternative à pointeur unique (WCAG 2.5.7) ; affordance visuelle du Kanban restante |
| Mouvements fins ou prolongés | Ne pas exiger maintien, précision ou répétition fatigante | **Partiel** — gestes complexes et glisser-déposer couverts (alternatives) ; le maintien prolongé/la précision générale restent sans contrat |
| Plusieurs modalités simultanées | Ne pas bloquer clavier, tactile, souris ou parole disponible sur la plateforme | **Couvert par règle interne renforcée** — ACCESSIBILITY-UX adopte WCAG 2.5.6, niveau AAA |
| Mouvement de l'appareil | Offrir une alternative au secouement ou à l'inclinaison | **En attente** — aucun consommateur ; aucune position WCAG 2.5.4 |
| Retour haptique | Ne jamais faire de la vibration le seul feedback | **Couvert** — BUTTON-UX : l'haptique est un supplément, jamais l'unique feedback |
| Temps limité pour agir | Pouvoir supprimer, ajuster ou prolonger une échéance, sauf exception normative | **Couvert** — FORM-UX applique les mécanismes de 2.2.1 ; annonce et conservation des données sont des règles internes renforcées |

## 5. Audition, son et médias temporels

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Information portée par un son | Voir ou lire tout signal sonore important | **Couvert** — ACCESSIBILITY-UX : jamais un seul canal (son inclus) ; ALERT-UX pour un futur signal sonore |
| Son automatique | Éviter l'autoplay ou fournir arrêt et volume indépendant | **Absent** — aucun contrat WCAG 1.4.2 |
| Réglage et coupure du son | Contrôler le volume sans modifier tout le système | **En attente** — aucun composant audio actuel |
| Sous-titres préenregistrés | Lire toute parole et information sonore pertinente | **En attente** — aucun composant vidéo ; position requise avant sa création |
| Sous-titres en direct | Lire un flux temps réel | **En attente** — aucun live media actuel |
| Transcription audio | Accéder au contenu audio seul sous forme textuelle | **En attente** — aucun composant audio actuel |
| Audiodescription / alternative média | Comprendre les informations visuelles essentielles d'une vidéo | **En attente** — aucun composant vidéo actuel |
| Qualité de la parole | Distinguer la voix malgré bruit de fond et audition réduite | **En attente** — aucun contenu audio actuel |
| Alerte critique multicanale | Recevoir une alerte par texte/visuel sans dépendre d'un bip | **Couvert** — ALERT-UX : un signal sonore éventuel reste doublé du message textuel (WCAG 1.4.1) |

## 6. Parole, dictée et commande vocale

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Service utilisable sans parler | Offrir une alternative texte/clavier à toute commande vocale | **Couvert** — ACCESSIBILITY-UX : toute fonction au clavier, aucune dépendance à la parole (VOICE reste éditoriale — distinction explicitée) |
| Commande vocale par nom visible | Le nom accessible contient le libellé affiché | **Couvert** — INPUT-UX + ACCESSIBILITY-UX : le nom accessible contient le libellé visible (WCAG 2.5.3) |
| Contrôle sans libellé visible | Pouvoir nommer une icône ou une cible par la voix | **Partiel** — `aria-label` existe, mais découvrabilité vocale non traitée |
| Dictée dans les champs | Saisir sans clavier physique | **Couvert** — INPUT-UX : le champ n'intercepte pas la dictée ni le collage (test réel restant) |
| Parole atypique ou non reconnue | Ne pas rendre la reconnaissance vocale obligatoire | **En attente** — aucun service vocal ; position à écrire avant d'en créer un |
| Canal de contact alternatif | Ne pas imposer le téléphone comme unique recours | **Absent** — hors composants actuels, mais contrainte produit non documentée |

## 7. Compréhension, mémoire et capacités cognitives

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Langage simple | Comprendre sans expertise ni niveau de lecture élevé | **Partiel** — VOICE pose le plain language et vise un niveau collège, sans seuil mesuré |
| Vocabulaire cohérent | Retrouver le même mot pour la même action | **Couvert** — VOICE interdit les synonymes décoratifs |
| Libellé explicite | Comprendre une action hors contexte | **Couvert** — VOICE + BUTTON ; « OK » et « Cliquez ici » exclus |
| Instructions avant l'erreur | Réussir avant d'être corrigé | **Couvert** — INPUT helper text + FORM contraintes préalables |
| Identification et correction d'erreur | Savoir quoi, pourquoi et comment corriger | **Couvert** — INPUT, ALERT et FORM |
| Prévention des erreurs graves | Vérifier, corriger ou annuler une action coûteuse | **Couvert pour formulaires sensibles et actions destructives** — FORM + BUTTON |
| Saisie redondante | Ne pas redemander une information déjà fournie | **Couvert dans FORM multi-step** — WCAG 3.3.7 |
| Authentification accessible | Autoriser copier-coller et gestionnaires, éviter les puzzles cognitifs | **Couvert** — FORM sensitive-data, WCAG 3.3.8 |
| Charge cognitive | Limiter choix, bruit et va-et-vient inutiles | **Partiel** — LAWS, VOICE, FORM et échelles fermées ; pas de test objectif transversal |
| Aide cohérente | Retrouver l'aide au même endroit et dans le même ordre | **Absent** — aucun système d'aide actuel ni position WCAG 3.2.6 |
| Interruption et reprise | Reprendre sans perte après erreur, timeout ou changement de contexte | **Couvert dans FORM** ; **partiel** globalement |
| Personnalisation cognitive | Accepter extensions, simplification ou préférences de présentation | **Absent** — aucun contrat actuel |

## 8. Mouvement, neurologie et attention

| Cas d'usage | Besoin à vérifier | Statut et propriétaire actuel |
|---|---|---|
| Préférence de mouvement réduit | Couper déplacements, rotations et échelles sans perte d'information | **Couvert** — MOTION fait autorité et détaille chaque consommateur actuel |
| Mouvement porteur d'information | Conserver un équivalent statique et sémantique | **Couvert** — règle cardinale de MOTION |
| Mouvement automatique prolongé | Pouvoir mettre en pause, arrêter ou masquer | **Couvert dans le registre actuel** — seules boucles de chargement admises, coupées sous reduced-motion |
| Contenu qui se déplace | Ne pas perdre lecture, focus ou cible | **Couvert** — MOTION interdit le déplacement non sollicité |
| Animation déclenchée par interaction | Pouvoir la désactiver lorsqu'elle n'est pas essentielle | **Couvert** — `prefers-reduced-motion` systématique |
| Flash lumineux | Ne pas dépasser les seuils susceptibles de provoquer une crise | **Couvert** — MOTION-UX : interdit dur du flash dangereux (WCAG 2.3.1/2.3.2) |
| Clignotement pour attirer l'attention | Éviter le stimulus répétitif non contrôlé | **Couvert** — MOTION-UX nomme désormais le flash/clignotement dangereux (WCAG 2.3.1) |
| Notifications interruptives | Éviter et contrôler les interruptions non urgentes | **Partiel** — ALERT règle gravité et persistance ; toast et notifications système sont hors périmètre |

## 9. Matrice des consommateurs actuels

`✓` = règle explicite ; `△` = couverture locale ou indirecte ; `—` = aucun besoin exercé aujourd'hui ; `×` = besoin réel non résolu.

| Sujet | Visuel | Clavier | Lecteur d'écran | Pointer / moteur | Auditif | Cognitif | Mouvement | Voix / dictée |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Button | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | △ |
| Input | ✓ | △ | ✓ | △ | — | ✓ | ✓ | ✓ dictée |
| Card | ✓ | ✓ | ✓ | ✓ alt. drag | — | △ | ✓ | — |
| Alert | ✓ | △ enfants | ✓ | △ fermeture | ✓ son+texte | ✓ | ✓ | — |
| Form | ✓ | ✓ | ✓ | △ | — | ✓ | △ | △ dictée |
| Foundations | ✓ | ✓ focus | ✓ structure | ✓ contrat | ✓ contrat | ✓ | ✓ | ✓ contrat |

Cette matrice ne signifie pas qu'un sujet doit posséder une règle dans chaque colonne. Elle rend visibles les cases où un besoin exercé dépend encore d'une déduction ou d'un futur composant. Depuis le 2026-07-14, les cases autrefois `△`/`×` de motricité, de son et de commande vocale sont adossées au contrat universel d'ACCESSIBILITY-UX (ligne « Foundations » : « contrat » = obligation posée transversalement, propriétaire nommé) — ce qui reste `△` relève d'un test réel non encore fait, pas d'une règle manquante.

## 10. Trous prioritaires révélés

### Priorité 1 — traitée le 2026-07-14 (contrat universel + règles chez les propriétaires)

Les cinq trous P1 ont été comblés : la fondation `accessibility` porte le contrat universel (chargé pour toute intention), chaque règle propre vit chez son propriétaire.

1. **Modalités concurrentes** — ✅ ACCESSIBILITY-UX (clavier, pas de dépendance à un seul moyen ; WCAG 2.1.1/2.5.6).
2. **Focus complet** — ✅ visible/ordonné/non piégé (existant) + **non masqué** posé dans BORDER-UX (2.4.11).
3. **Pointer/motricité** — ✅ annulation du pointeur (BUTTON, 2.5.2), alternative au glisser-déposer (CARD, 2.5.7) et aux gestes complexes (ACCESSIBILITY, 2.5.1), taille ou espacement des cibles (ACCESSIBILITY, 2.5.8 AA). Le standard interne de 44px reste plus exigeant pour les composants qui le portent.
4. **Flash** — ✅ interdit dur dans MOTION-UX (2.3.1).
5. **Canaux sensoriels** — ✅ « jamais ce canal seul » généralisé au son et à l'haptique (ACCESSIBILITY ; ALERT pour un futur son, BUTTON pour l'haptique).

### Priorité 2 — positions à prendre avant que le contexte n'apparaisse

1. **Audio/vidéo** : autoplay, volume, sous-titres, transcription, audiodescription — **toujours en attente** (aucun composant média) ; statut explicite dans ACCESSIBILITY-UX.
2. **Commande vocale** — ✅ correspondance nom accessible / libellé visible posée (INPUT, 2.5.3) ; l'alternative sans parole découle du clavier universel. Reconnaissance vocale complète : en attente.
3. **Superposés** : focus non masqué **déjà contractualisé** (BORDER, 2.4.11) ; restent le piège intentionnel et le retour de focus d'une modale/drawer — en attente du composant.
4. **Temps imposé** — ✅ suppression, ajustement ou prolongation avec exceptions posés dans FORM-UX (2.2.1) ; avertissement et conservation sont assumés comme renforcement interne.

### Priorité 3 — dette de vérification

1. Tests manuels clavier sur un écran assemblé, pas seulement sur les styles de focus.
2. Parcours VoiceOver/NVDA au minimum sur Form et Alert dynamique.
3. Zoom/reflow et overrides d'espacement de texte.
4. Essai de dictée et de commande vocale sur les libellés visibles.
5. Vérification tactile avec tremblement simulé ou cible imprécise.

## Bilan de couverture

Le système couvre déjà quatre noyaux solides : **contrastes et redondance visuelle**, **sémantique/annonces**, **focus des consommateurs actuels**, **mouvement réduit**. L'accessibilité cognitive est présente dans le wording et les formulaires, mais reste distribuée.

Depuis le 2026-07-14, les angles morts autrefois structurants — **modalités concurrentes**, **flash**, **glisser-déposer**, **annulation du pointeur**, **taille/espacement des cibles**, **temps imposé**, **son** — sont couverts par le contrat universel et ses propriétaires. Restent : **audio et médias temporels** (en attente, aucun composant), **reconnaissance vocale complète**, **reflow/orientation**, et surtout la **dette de vérification** — aucun test avec technologies d'assistance réelles (clavier, lecteur d'écran, dictée, tactile imprécis) n'a encore été mené sur un écran assemblé. La couverture *documentaire* est désormais large ; la couverture *éprouvée* reste à faire (P3).

## Sources de cadrage

| Référence | Usage dans cet inventaire |
|---|---|
| [W3C WAI — Diverse Abilities and Barriers](https://www.w3.org/WAI/people-use-web/abilities-barriers/) | Taxonomie fonctionnelle : auditif, cognitif, physique, parole, visuel ; inclut limitations temporaires et situationnelles |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Critères cités : clavier, focus, temps, médias, mouvement, modalités d'entrée, compréhension |
| [W3C WAI — Understanding Input Modalities](https://www.w3.org/WAI/WCAG22/Understanding/input-modalities.html) | Souris, tactile, clavier et parole ; gestes, cibles, drag, modalités concurrentes |
| [W3C WAI — Auditory Disabilities](https://www.w3.org/WAI/people-use-web/abilities-barriers/auditory/) | Son clair, contrôle du volume, alternatives aux informations auditives |
| [W3C WAI — Physical Disabilities](https://www.w3.org/WAI/people-use-web/abilities-barriers/physical/) | Tremblements, dextérité, coordination, douleur et technologies d'assistance |
| [W3C WAI — Speech Disabilities](https://www.w3.org/WAI/people-use-web/abilities-barriers/speech/) | Alternative aux services et commandes qui exigent la parole |

**Confiance** : la taxonomie et les critères normatifs sont établis (W3C/WCAG 2.2). Les statuts de couverture sont un audit interne recalculé le 2026-07-14 après la création de la fondation `accessibility` et l'ajout des règles chez leurs propriétaires. Ils mesurent la **documentation** du système, pas la conformité éprouvée : les tests réels avec technologies d'assistance (P3) restent à mener. À recalculer à chaque nouveau composant, pattern ou fondation.
