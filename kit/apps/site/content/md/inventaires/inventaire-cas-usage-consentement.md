# Inventaire des cas d'usage — Consentement (l'interruption qu'il faut mériter)

> Checklist de couverture pour `CONSENTEMENT-UX.md`. Sert à vérifier que la doctrine nomme bien chaque
> situation où la question du consentement se pose — pas de contenu à lire en soi. Un cas « non couvert »
> n'est pas un oubli : c'est une frontière déclarée, qui se remonte en audit au registre « à trancher ».

---

## 1. Par ce que le site dépose

| Cas d'usage | Description | Statut |
|---|---|---|
| Aucun stockage | Site strictement statique, aucune préférence mémorisée | Couvert — aucun bandeau (R03) |
| Préférence d'affichage seule | Thème clair/sombre, taille de texte, langue | Couvert — exempté, aucun bandeau (R03, S2) |
| Panier, authentification, session | Traceurs liés au service explicitement demandé | Couvert — exempté (R03, S2) |
| Mémorisation du choix de consentement lui-même | Le traceur qui retient la réponse au bandeau | Couvert — exempté, et ne justifie pas le bandeau qui le crée (R05) |
| Mesure d'audience limitée à l'éditeur | Statistiques anonymisées, non recoupées, non inter-sites | Couvert partiellement — l'exemption dépend de conditions à vérifier au cas par cas, remonté en « à trancher » (R04) |
| Mesure d'audience recoupée ou inter-sites | Identifiant commun à plusieurs domaines, mesure de couverture | Couvert — bandeau complet requis (R07 à R16) |
| Publicité, personnalisation, reciblage | Régie, enchères, profilage | Couvert — bandeau complet requis |
| Boutons de partage et embarqués sociaux | Widgets déposant leurs propres traceurs | Couvert — bandeau complet requis |
| Ressource tierce sans traceur | Police, carte ou vidéo servie par un CDN tiers : aucun cookie, mais transmission d'adresse IP | **Non couvert** — ce n'est pas du consentement au sens ePrivacy. Frontière déclarée, cf. « À approfondir » |

## 2. Par forme d'interruption

| Cas d'usage | Description | Statut |
|---|---|---|
| Bandeau dans le flux | Posé après l'ouverture du corps, non fixé | Couvert — forme de référence (R12, R13) |
| Bandeau fixé en bas d'écran | `position: fixed`, flotte au-dessus du contenu | Couvert — refusé, masque le focus (R12) |
| Modale bloquante | Voile, piège de focus, contenu inaccessible | Couvert — refusé par parti pris (R11), légal en France sous conditions |
| Bandeau différé | Apparaît après quelques secondes ou au défilement | **Non couvert** — aucune règle ; à trancher avec le produit |
| Réaffichage à chaque page | Le choix n'est pas mémorisé | Couvert — refusé (R14) |

## 3. Par forme du choix

| Cas d'usage | Description | Statut |
|---|---|---|
| Deux actions symétriques | Accepter / Refuser, même poids, même niveau | Couvert — forme de référence (R07, R08) |
| Acceptation mise en avant | Refus en lien discret ou en contour | Couvert — refusé (R08) |
| Refus derrière un écran de réglages | Un clic pour accepter, trois pour refuser | Couvert — refusé (R07) |
| Fermeture par croix seule | Aucun bouton de refus, seulement un « × » | Couvert — la fermeture vaut refus, mais ne dispense pas du bouton (R09) |
| Poursuite de navigation valant acceptation | Défilement ou clic ailleurs interprété comme accord | Couvert — refusé (R09) |
| Choix fictif | Aucun dépôt ne change selon la réponse | Couvert — le bandeau est retiré, pas corrigé (R06) |
| Granularité par finalité | Un réglage par finalité, dans une modale ou une page | **Non couvert** — les deux précédents du panel divergent (GOV.UK / DSFR) ; à trancher au premier consommateur ayant plus de deux finalités |
| Consentement par signal navigateur | Préférence exprimée hors du site, lue par lui | **Non couvert** — dépend de l'adoption de l'article 88b proposé (S6) |

## 4. Par moment

| Cas d'usage | Description | Statut |
|---|---|---|
| Première visite | Aucun choix mémorisé | Couvert |
| Visite suivante dans les six mois | Choix mémorisé, aucune sollicitation | Couvert (R14) |
| Après expiration | Nouvelle sollicitation admise | Couvert (R14) |
| Retour sur le choix à l'initiative du visiteur | Depuis n'importe quelle page | Couvert (R16) |
| Changement des finalités du site | Une nouvelle catégorie de traceur apparaît | **Non couvert** — quand redemander ? Aucune règle |

## 5. Par état après le choix

| Cas d'usage | Description | Statut |
|---|---|---|
| Confirmation affichée | Message annoncé, focus déplacé, fermeture possible | Couvert (R15) |
| Disparition silencieuse | Le bandeau s'efface sans retour | Couvert — refusé (R15) |
| Service désactivé après refus | Une carte ou une vidéo ne se charge plus | Couvert partiellement — le DSFR impose un texte de remplacement avec moyen de consentir ; nous n'avons pas de règle propre |

## 6. Frontières avec les sujets voisins

| Cas d'usage | Description | Statut |
|---|---|---|
| Case « j'accepte le traitement de mes données » dans un formulaire | Liée à l'envoi, pas au dépôt de traceur | Hors périmètre — appartient à FORM-UX |
| Acceptation des CGU à l'inscription | Contrat, pas consentement au sens ePrivacy | Hors périmètre — appartient à CREATION-COMPTE-UX |
| Fusion implicite « en créant un compte, vous acceptez… » | Consentement noyé dans une action | Hors périmètre — déjà traité par CREATION-COMPTE-UX |
| Demande d'autorisation navigateur (notifications, géolocalisation) | Interruption de même nature, mécanique différente | **Non couvert** — sujet voisin, non ouvert |
