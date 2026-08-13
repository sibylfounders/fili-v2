---
sujet: accessibility
type: principe
resume: "Contrat universel chargé pour TOUTE intention : clavier, modalités concurrentes, focus complet, nom accessible, jamais un seul canal, gestes/pointeur, temps, flash — pose l'obligation et renvoie au propriétaire, ne duplique rien"
requires: []
selon-contexte: ["color", "border", "motion", "iconography", "voice"]
---
# RULES — Accessibilité (compilé, condensé)

> Généré depuis `principles/accessibility/ACCESSIBILITY-UX.md` (v1.2.0). **Socle universel** : ce fichier est chargé d'office avec le routeur pour toute intention. Il pose le contrat minimal et **renvoie au propriétaire** — il ne réécrit ni contraste, ni focus ring, ni mouvement, ni wording. Ne pas éditer à la main. La source fait autorité.

## Nature
- Principe transversal, **sans token, sans valeur visuelle**. Il pose l'obligation ; le propriétaire pose la mécanique. En cas de divergence, le propriétaire a raison (ce n'est pas une source de substitution).
- **`voice` = voix éditoriale (ce que le produit écrit), PAS la commande vocale.** Ne jamais lire `voice` comme une couverture de la reconnaissance vocale.
- **Règle cardinale : l'accessibilité est la condition d'existence de chaque règle, pas une couche ajoutée.** Une seule source par obligation + un renvoi — jamais une section recopiée dans chaque composant.

## Obligations universelles (tout sujet en hérite)
- **Clavier** : toute fonction est atteignable et activable au clavier seul (2.1.1).
- **Modalités concurrentes** : clavier, souris, tactile, contacteur et commande vocale disponibles ne sont jamais bloqués au profit d'un seul (2.5.6).
- **Pas de dépendance unique** : aucune fonction ne repose seulement sur le hover, un geste complexe, le glisser-déposer ou la parole — chacun garde une alternative simple (2.5.1, 2.5.7, 1.4.13).
- **Focus** : visible, ordonné (tab = ordre visuel/logique), non piégé, **non masqué** par un sticky/superposé (2.4.7, 2.4.3, 2.1.2, 2.4.11).
- **Nom/rôle/valeur** exposés ; **le nom accessible contient le libellé visible** (4.1.2, 2.5.3).
- **Toute relation ARIA désigne un élément qui existe** : chaque identifiant cité par `aria-describedby`, `aria-labelledby` ou `aria-errormessage` est porté par un élément présent dans le document. Un identifiant mort supprime le message pour la technologie d'assistance sans rien changer à l'écran (4.1.2).
- **`aria-invalid` n'est jamais seul** : tout élément en `aria-invalid="true"` expose un message d'erreur en texte, associé par `aria-describedby` ou `aria-errormessage`. L'état sans le motif n'est pas une erreur utilisable (3.3.1).
- **Jamais un seul canal** : aucune info portée uniquement par la couleur, le mouvement, le son ou l'haptique — repli = le mot (1.4.1, 1.3.3, 1.4.2).
- **Gestes / pointeur** : alternative simple au geste complexe et au drag ; action grave jamais déclenchée au `pointerdown` (annulable, à la relâche) (2.5.2, 2.5.7).
- **Temps** : toute limite imposée à l'utilisateur est contrôlable, annoncée, avec conservation des données (2.2.1).
- **Flash** : aucune séquence > 3 flashs/s, seuils général et rouge respectés (2.3.1).

## Qui porte quoi (renvois — charger le propriétaire pour le détail)
| Besoin | Propriétaire |
|---|---|
| Contraste, info sans couleur, forced-colors, dark mode | RULES-color |
| Focus ring, focus non masqué, survie forced-colors | RULES-border |
| Flash, mouvement réduit, info par le mouvement | RULES-motion |
| Redondance texte/icône, icône seule (aria-label) | RULES-iconography |
| Mot comme repli, wording accessible, plain language | RULES-voice |
| Annulation pointeur, haptique non indispensable | button |
| Alternative au drag, hover non indispensable | card |
| Limites de temps, focus après échec, résumé d'erreurs | form |
| Signal sonore toujours doublé d'un texte | alert |
| Dictée, libellé visible = nom accessible | input |

## En attente (aucune règle détaillée — aucun consommateur)
- Sous-titres, transcriptions, audiodescriptions (pas de composant audio/vidéo) ; reconnaissance vocale complète ; superposés (modale/tiroir) ; raccourcis à une touche. Position à prendre avant d'en créer un — ne pas improviser.

## Tests minimaux (manuels — l'outillage ne les simule pas)
- Clavier seul, lecteur d'écran, zoom 200 %/reflow, tactile imprécis, mouvement réduit — sur l'écran **assemblé**, pas seulement les styles.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Fonction non atteignable au clavier | Exclusion motrice/AT totale | Critique |
| Info portée par un seul canal (couleur/mouvement/son/haptique) | Perte pour un profil entier | Critique |
| Focus masqué par un superposé | Position clavier perdue (2.4.11) | Élevée |
| Action grave au pointerdown, sans alternative au drag | Déclenchement accidentel, exclusion motrice | Élevée |
| Flash > 3/s | Risque de crise (2.3.1) | Critique |
| Limite de temps non annoncée/non prolongeable | Perte de données, échec de la tâche | Élevée |

CONFIANCE : critères WCAG 2.2 (A/AA) établis. Le socle universel compact chargé pour toutes les intentions est une décision d'architecture interne datée 2026-07-14. Toute obligation qui semble en conflit avec une règle propriétaire : le propriétaire tranche — STOP, remonter si l'ambiguïté persiste.
