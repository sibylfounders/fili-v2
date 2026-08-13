# Inventaire des cas d'usage — Composant Bouton

> Cet inventaire recense les familles de cas d'usage du bouton, pas chaque exemple individuel (qui serait infini). Il sert de carte de couverture : chaque ligne peut devenir une fiche détaillée suivant le gabarit à 5 catégories + risque.

---

## 1. Par intention (le rôle du bouton dans la décision)

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Action primaire | L'action principale attendue sur l'écran | Un seul par écran/section, poids visuel maximal |
| Action secondaire | Alternative à l'action primaire | Poids visuel réduit, ne doit jamais concurrencer le primaire |
| Action destructive | Suppression, annulation irréversible | Nécessite souvent une double confirmation, code couleur distinct |
| Action tertiaire / lien-bouton | Action mineure, faible engagement | Souvent stylée comme un lien, pas un bouton plein |
| Toggle / bouton d'état | Bascule on/off (ex: suivre/ne plus suivre) | L'état visuel doit refléter l'état actuel, pas l'action à venir |
| Bouton de confirmation | Valide une action déjà engagée ailleurs (modale, étape) | Souvent couplé à un bouton d'annulation |
| Bouton d'annulation / retour arrière | Permet de revenir sur une action ("Annuler", "Undo") | Fenêtre de temps limitée, feedback temporaire (ex: toast) |

## 2. Par conteneur / contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton dans un formulaire | Soumission, validation d'étape | Un seul bouton de soumission, aligné à la grille du formulaire |
| Bouton dans une modale | Confirmer/annuler une action contextuelle | Ordre gauche/droite culturellement variable (à documenter) |
| Bouton dans une carte (card) | Action liée à un item (ex: "Ajouter au panier") | Doit rester lisible même en grille dense, taille contrainte |
| Bouton dans une table/liste | Action rapide sur une ligne (éditer, supprimer) | Souvent réduit à une icône, accessibilité critique |
| Bouton dans une barre de navigation | CTA principal du header | Doit rester visible au scroll ou reposition (sticky) |
| Bouton flottant (FAB) | Action principale mobile, superposée au contenu | Zone d'exclusion pour ne pas masquer du contenu clé |
| Bouton dans une bannière (cookies, promo) | Acceptation, fermeture, action liée à la bannière | Enjeux de dark pattern à éviter (ex: bouton "refuser" minimisé) |
| Bouton de pagination | Navigation entre pages/étapes | États actif/inactif clairs, notion de progression |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton avec chargement asynchrone | Attente d'une réponse serveur | Doit éviter le double-clic, feedback de progression |
| Bouton avec validation conditionnelle | Activé seulement si des conditions sont remplies | Le "pourquoi désactivé" est ici critique |
| Bouton avec compte à rebours | Action différée (ex: "Renvoyer le code dans 30s") | Feedback temporel visible, éviter la frustration |
| Bouton à usage unique | Ne peut être déclenché qu'une fois (ex: paiement) | Risque de double soumission à anticiper explicitement |
| Bouton avec confirmation différée | Nécessite une 2e interaction pour valider | Utilisé pour les actions à fort risque (suppression de compte) |

## 4. Par plateforme / device

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton desktop (souris/clavier) | Interaction précise, hover disponible | Le hover comme signal d'affordance |
| Bouton mobile tactile | Pas de hover, zone de touch minimale | Taille minimale de la cible (44px), feedback haptique |
| Bouton en contexte vocal/accessibilité | Navigation clavier, lecteur d'écran | Focus visible, ordre de tabulation, label explicite |
| Bouton en contexte multi-device (responsive) | Même composant, comportement adapté | Full-width en mobile vs largeur contrainte en desktop |

## 5. Par contenu / forme visuelle

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton texte seul | Label uniquement | Cas le plus simple, wording critique |
| Bouton icône seule | Aucun texte visible | Aria-label obligatoire, ambiguïté à éviter |
| Bouton icône + texte | Combinaison des deux | Ordre icône/texte selon sens de lecture et intention |
| Bouton avec badge/compteur | Ex: "Panier (3)" | Le badge ne doit pas nuire à la lisibilité du label |
| Bouton avec avatar/image | Ex: bouton de connexion sociale | Contraintes de proportion et cohérence de marque tierce |

## 6. Par enjeu business / risque associé

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton de conversion critique | CTA principal du funnel (achat, inscription) | Le plus documenté dans la littérature (cf. cas "$300M button") |
| Bouton lié à un engagement financier | Paiement, abonnement | Enjeux de confiance, double confirmation fréquente |
| Bouton lié à la confidentialité/consentement | Cookies, partage de données | Enjeux légaux (RGPD), risque de dark pattern |
| Bouton d'action irréversible | Suppression de compte, envoi définitif | Risque maximal, nécessite le plus de garde-fous UX |

---

## Comment utiliser cet inventaire

Chaque ligne de ce tableau est un **candidat à une fiche détaillée** suivant le gabarit établi (5 catégories + dimension risque transversale). Tu n'as pas à toutes les documenter — certaines se recoupent largement avec la fiche déjà faite sur le bouton générique (Phase 2 de ton plan).

**Suggestion de priorisation pour la suite** :
1. Les cas où le risque est le plus élevé et le moins documenté ailleurs (action irréversible, consentement) — c'est là que ta valeur ajoutée sera la plus forte
2. Les cas les plus fréquents en usage réel (formulaire, carte, table) — c'est là que l'impact pratique sera le plus large
3. Les cas les plus spécifiques ou exotiques (FAB, compte à rebours) — à traiter en dernier, une fois la méthode bien rodée

Veux-tu qu'on choisisse ensemble 2-3 cas prioritaires à documenter en détail, ou tu préfères garder cet inventaire comme simple carte pour l'instant et avancer sur autre chose ?
