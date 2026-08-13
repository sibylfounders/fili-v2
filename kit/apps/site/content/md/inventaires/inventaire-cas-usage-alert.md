# Inventaire des cas d'usage — Alert (banner / alert / notification inline)

> Miroir des inventaires bouton, input et card. Sert de checklist de couverture pour `ALERT-UX.md`, pas de contenu à lire en soi. Test de couverture fait immédiatement après la première rédaction (l'ordre retenu depuis la carte) — les corrections issues du test sont marquées "couvert après test".

---

## 1. Par rôle / type de message

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Résumé d'erreurs de formulaire | N erreurs agrégées en tête de formulaire | Couvert — le recoupement avec FORM-UX.md est la décision structurante du composant |
| Condition système (maintenance, dégradation) | La page fonctionne mais un service est affecté | Couvert (tone info/warning, permanent) |
| Échéance / quota (abonnement expire, stockage plein) | Condition qui s'aggrave dans le temps | Couvert (warning permanent, réapparition légitime si aggravation) |
| Erreur bloquante de page (paiement refusé, accès coupé) | Condition critique déjà vraie | Couvert (danger permanent) |
| Confirmation durable (paiement validé, migration finie) | Succès qui doit rester consultable | Couvert (success dismissible) |
| Annonce de nouveauté factuelle | "Les exports sont désormais en CSV" | Couvert (info dismissible + mémoire de fermeture) |
| Feedback immédiat d'action ("Enregistré ✓") | Réactif, vie courte | **Volontairement hors périmètre** — toast, frontière documentée en note de transposition |
| Alerte bloquante exigeant une décision | L'utilisateur ne doit pas pouvoir continuer | **Volontairement hors périmètre** — modale (échelle d'interruption) |
| Bannière de consentement (cookies) | Pattern réglementaire, persistance légale | **Volontairement hors périmètre** — signalé dans ALERT-UX.md et BUTTON-UX.md (boutons) |
| Contenu promotionnel / upsell | Marketing dans le flux | Couvert négativement (quand ne pas l'utiliser, cf. Polaris) |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Pleine page (sous le header) | Condition affectant toute la page | Couvert — cas de référence |
| Section / carte | Condition d'une zone précise | Couvert (hérite du conteneur) |
| Dans une modale | Erreur ou avertissement du flux modal | Couvert (jamais de pleine page dans une modale) |
| Au-dessus d'un élément précis (bouton, champ) | Condition d'un geste précis | Couvert (placement contextuel Carbon + frontière avec l'inline input) |
| En tête de formulaire | Résumé d'erreurs | Couvert (orchestré par FORM-UX.md) |
| Bannière globale multi-pages (système entier) | Persiste à travers la navigation | **Non couvert actuellement** — Atlassian le traite comme un composant distinct (banner système) ; la frontière avec l'alert de page mériterait d'être tranchée |
| Dans une collection (alert entre les cartes) | Message inséré dans une grille/liste | **Non couvert actuellement** — tension avec la promesse de prédictibilité de la grille (CARD-UX.md) |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Permanent, chargé avec la page (proactif) | Vit tant que la condition est vraie | Couvert — axe persistance |
| Dismissible, fermé par l'utilisateur | Fin de vie décidée par l'utilisateur | Couvert — axe persistance |
| Réapparition après fermeture | Condition redevenue vraie ou aggravée | **Couvert après test** — la mémoire de fermeture (session vs durable, exception d'aggravation) manquait à la première rédaction |
| Résolution de la condition d'un permanent | L'alert disparaît — mais qui l'annonce ? | **Couvert après test** — 4e occurrence du biais "état transitoire" du projet : la *sortie de scène* était le trou, comme le loading l'avait été pour bouton/input/card |
| Injection dynamique après action (réactif) | Annonce lecteur d'écran, saut de mise en page | Couvert (role alert/status, insertion sans vol de position) |
| Plusieurs alerts simultanés | Empilement, ordre, agrégation | **Couvert après test** — plafond par conteneur, tri par gravité, agrégation ; absent de la première rédaction alors que le résumé d'erreurs EST une agrégation |
| Contenu de l'alert mis à jour en place | Le quota passe de 80% à 95% sans re-création | **Non couvert actuellement** — re-annonce ou silence, jamais explicité |
| Auto-dismiss temporisé | Disparition seule après N secondes | **Volontairement hors périmètre** — définition même du toast |

## 4. Par plateforme / device

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Desktop | Cas de référence | Couvert |
| Mobile (largeur réduite) | Pleine largeur, texte qui replie | Couvert implicitement (largeur = conteneur) — pas de règle mobile spécifique, acceptable car pas de hover ni de dimension propre |
| Lecteur d'écran — proactif | Contenu ordinaire du flux, pas de rôle live | Couvert (ALERT-UI) |
| Lecteur d'écran — réactif | role alert/status, conteneur présent avant injection | Couvert (ALERT-UI) |
| Zone tactile de la croix | 44px même si glyphe petit | Couvert (ALERT-UI) |
| RTL (lecture droite-gauche) | Position icône/croix miroir | **Non couvert actuellement** — signalé dans "À approfondir" |
| Reduced motion | Insertion sans animation | **Non couvert actuellement** — lié à l'apparition dynamique, signalé |

## 5. Par contenu / forme

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Icône + titre seul | Message en une ligne | Couvert (corps optionnel) |
| Icône + titre + corps | Cas complet | Couvert — ordre canonique |
| Avec une action | "Corriger", "Réessayer" | Couvert (1 action mise en avant max, tone du bouton ≠ tone de l'alert) |
| Avec deux actions | Action + lien discret | Couvert (seconde tolérée en lien) |
| Corps = liste de liens d'ancre | Le résumé d'erreurs | Couvert (FORM-UX.md + note liens dans FORM-UI.md) |
| Contenu long (paragraphe+) | Plus de 2 phrases | Couvert négativement (lier plutôt qu'entasser) |
| Sans icône | Tone porté par la couleur seule | Couvert négativement (interdit — canal redondant WCAG 1.4.1) |
| Titre-catégorie ("Erreur") | Wording vide | Couvert (erreur fréquente documentée) |

## 6. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Alert réactif muet pour lecteur d'écran | Erreur affichée jamais annoncée | Couvert — risque critique n°1 |
| Danger fermable sur condition active | Critique masqué puis oublié | Couvert (table tone × persistance) |
| Inflation de alerts | Cécité d'attention apprise | Couvert (budget d'attention, risque différé) |
| Tones indiscernables (daltonisme) | Danger et success confondus | Couvert (icône par tone) + à vérifier en rendu réel (les 4 couleurs de tone doivent rester distinguables entre elles) |
| Warning utilisé comme "danger poli" | Correction retardée | Couvert (erreur fréquente du warning) |
| Success fantôme (confirmation périmée à l'écran) | Méfiance sur la fraîcheur de la page | Couvert |

---

## Bilan du test de couverture

Sur 39 cas recensés (dont 4 volontairement hors périmètre : toast, modale, bannière de consentement, auto-dismiss — tous renvoyés à la frontière documentée en note de transposition), **8 étaient non couverts après la première rédaction** de ALERT-UX.md — ratio de trous stable pour la 4e fois (bouton 8/33, input 11/30, carte 9/41, alert 8/39) : la première passe laisse un ordre de grandeur constant de trous, quelle que soit la méthode d'entrée.

**Les 3 trous jugés prioritaires ont été comblés avant livraison** (marqués "couvert après test" ci-dessus) :
1. **Résolution silencieuse d'un permanent** — le plus significatif : c'est la **4e occurrence** du biais systématique du projet ("l'état transitoire est le trou par défaut" — loading bouton, validation asynchrone input, skeleton card, et maintenant la *disparition* de l'alert). Le biais prédit depuis la carte s'est vérifié à l'endroit prévu : la première rédaction documentait l'apparition et la vie du message, pas sa sortie de scène. La vérification d'office recommandée par le README a fonctionné comme prévu — c'est le test de couverture qui l'a attrapé, pas la rédaction.
2. **Mémoire de fermeture** — fermer est une décision de l'utilisateur ; sa non-persistance transforme le dismissible en harcèlement. Cas réel massif (bannières réaffichées à chaque page), invisible dans les benchmarks.
3. **Empilement / agrégation** — plusieurs conditions vraies en même temps est l'état normal d'un produit mûr ; la première rédaction traitait chaque alert comme seul au monde, alors même que le résumé d'erreurs (le cas fondateur du composant dans ce projet) est précisément une agrégation.

**Restent non couverts, par ordre de priorité suggérée** : bannière globale multi-pages (frontière avec Atlassian banner à trancher), mise à jour en place du contenu (re-annonce ?), alert dans une collection (tension avec la grille de CARD-UX.md), RTL, reduced motion. Aucun n'est critique en risque immédiat, tous sont signalés soit ici, soit dans "À approfondir" de ALERT-UX.md.

**Ce que ce test ajoute sur la méthode** : le biais "état transitoire" est désormais un prédicteur confirmé (4/4) — il ne suffit plus de le noter après coup : pour le prochain composant, écrire la section "disparition / sortie de scène / état d'attente" *avant* le test de couverture, et laisser le test vérifier le reste.
