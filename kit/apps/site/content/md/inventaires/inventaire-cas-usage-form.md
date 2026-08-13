# Inventaire des cas d'usage — Form (pattern de composition)

> Miroir des inventaires bouton, input, card et alert — établi tardivement : le pattern form avait sauté l'étape 2 de la méthode (seul sujet sans inventaire jusqu'au 2026-07-11). Sert de checklist de couverture pour `FORM-UX.md` 2.0.0, pas de contenu à lire en soi. Conformément au prédicteur "état transitoire" (5 occurrences journalisées), la famille "cycle de soumission" — l'état transitoire du pattern — a été écrite d'office, avant le test de couverture. Pour les messages (famille 4), chaque cas nomme son **propriétaire** (input / form / alert / produit-serveur) : c'est la matérialisation de la table d'autorité de FORM-UX.md.

---

## 1. Par structure et forme

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Formulaire court | Contact, login — peu de champs, une vue | Couvert — focus après échec : premier champ en erreur |
| Formulaire long | Toutes les erreurs possibles ne tiennent pas dans le viewport | Couvert — résumé d'erreurs + focus sur le résumé ; critère "long" défini sans seuil chiffré |
| Formulaire en plusieurs étapes | Checkout, souscription — validation par étape, retour sans perte, récapitulation | Couvert après rédaction 2.0.0 — section dédiée (progression, ask-once 3.3.7, check answers 3.3.4) ; était le "À approfondir" de la v1 |
| Groupes de champs / fieldset | Bloc adresse, bloc contact | Couvert — fieldset+legend obligatoires (sémantique + visuel ensemble), `fieldset_gap` côté UI |
| Formulaire dans une page | Le cas de référence | Couvert |
| Formulaire dans une modale | Saisie courte dans un dialogue | Couvert — réservé aux saisies courtes ; conteneur régi par BUTTON-UX (Entrée réflexe) et ALERT-UX (pas de pleine page en modale) |
| Édition inline (table) | Une cellule éditable, soumission unitaire | Couvert négativement — c'est un champ, INPUT-UX fait autorité ; le pattern commence quand plusieurs champs se soumettent ensemble |
| Champs conditionnels | Un champ apparaît selon une réponse | Couvert — apparition sans vol de focus, sort des valeurs masquées (mémorisées, non soumises), erreurs de l'invisible retirées du résumé |
| Groupes répétables | "Ajouter un bénéficiaire" | Couvert — focus après ajout/suppression, legend numérotée, bouton d'ajout jamais primary |
| Brouillon explicite | "Enregistrer comme brouillon" | Couvert — l'alternative à l'autosave quand l'utilisateur doit contrôler la persistance |
| Autosave | Persistance automatique d'un état inachevé | Couvert — statut `role="status"`, échec = warning, jamais pendant submitting, restauration annoncée |
| Un seul bouton de soumission | Cardinalité du submit | Couvert — règle portée par BUTTON-UX, orchestrée ici |

## 2. Par convention obligatoire/optionnel

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Tous les champs obligatoires | Login, paiement | Couvert — rien champ par champ, annonce unique en tête ("Tous les champs sont obligatoires") |
| Majorité de champs obligatoires | Inscription typique | Couvert — marquer la minorité : mention "(optionnel)" sur les seuls optionnels |
| Majorité de champs optionnels | Profil enrichi, préférences | Couvert — marquer les seuls obligatoires |
| Formulaire réellement mixte | Ni majorité nette ni convention produit | Couvert — marquer les obligatoires (convention la plus comprise) |
| Convention globale annoncée | "Les champs marqués * sont obligatoires" en tête | Couvert — l'annonce accompagne toujours l'indicateur, jamais l'astérisque seul |
| Astérisques répétés sur tous les champs | Le marqueur sur la norme au lieu de l'exception | Couvert négativement — bruit qui n'informe plus ; benchmark divergent documenté (GOV.UK interdit, Material impose) |
| Mention "(optionnel)" | L'équivalent textuel | Couvert — dans le label ; l'indicateur lui-même reste INPUT-UX |
| Attribut `required` / `aria-required` | La couche technique | Couvert — combiné à l'indicateur visuel sur tout champ obligatoire, quelle que soit la convention visuelle |
| Annonce aux technologies d'assistance | Ce que le lecteur d'écran entend | Couvert — required annoncé par l'attribut ; la convention de tête est du texte ordinaire lu en séquence |
| Cohérence inter-formulaires | La convention vaut pour le produit entier | Couvert — table de risque (confusion cumulative) |

## 3. Par validation

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Contraintes expliquées avant la saisie | Format attendu, prérequis | Couvert — WCAG 3.3.2 ; le helper text appartient à l'input, la décision de quoi expliquer au formulaire |
| Validation au submit | Le défaut des formulaires courts simples | Couvert — stratégie de formulaire (GOV.UK) |
| Validation au blur | Le défaut des champs à risque de format | Couvert — stratégie de formulaire (Carbon) ; mécanique par champ : INPUT-UX |
| Validation différée pendant la frappe | ~500 ms sur email/mot de passe | Couvert — mécanique INPUT-UX, activée par la stratégie du formulaire ; jamais avant la première saisie complète |
| Validation asynchrone | Disponibilité d'un identifiant, code promo | Couvert — état d'attente, soumission pendant l'attente, verdict périmé jeté |
| Validation croisée entre champs | Chaque champ valide, la combinaison invalide | Couvert — l'erreur appartient au groupe, ancrée au premier champ, message qui nomme la relation |
| Validation serveur | Le serveur re-vérifie tout | Couvert — le serveur fait foi, toujours ; le client est un confort, pas une autorité |
| Erreur devenue obsolète après correction | Le champ corrigé au blur | Couvert — l'inline disparaît à la revalidation ; le résumé reste tel quel jusqu'à resoumission |
| Nouvelle soumission | Re-submit après correction | Couvert — erreurs recalculées de zéro, aucune obsolète ne survit, aucune nouvelle masquée |
| Succès partiel | Une partie de la demande aboutit | Couvert — alert warning, parties réussies figées, reliquat conservé (cf. famille 5) |
| Erreurs contradictoires client/serveur | Le client dit valide, le serveur dit non | Couvert — le serveur remplace le verdict client, jamais d'empilement |

## 4. Par message — moment et propriétaire

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Avant — instructions générales | Ce qu'il faut savoir pour remplir | Couvert — propriétaire : form (texte d'introduction, pas un alert si rien à remarquer) |
| Avant — prérequis | "Munissez-vous de votre numéro fiscal" | Couvert — propriétaire : alert info ou texte courant, selon le besoin d'être remarqué (critère ALERT-UX) |
| Avant — information pour réussir un champ | Format, contrainte | Couvert — propriétaire : input (helper text) |
| Avant — avertissement de conséquence | "Cette action résilie votre abonnement" | Couvert — propriétaire : alert (warning), avant la zone concernée |
| Avant — indisponibilité partielle | "L'export est en maintenance" | Couvert — propriétaire : alert (placement contextuel au-dessus de l'élément, déjà ALERT-UX) |
| Pendant — helper text | Aide persistante sous le label | Couvert — propriétaire : input |
| Pendant — erreur inline | La valeur ne passe pas | Couvert — propriétaire : input (wording, aria-describedby) ; le moment vient de la stratégie du formulaire |
| Pendant — validation asynchrone en cours | Attente d'un verdict distant | Couvert — propriétaire : input (état d'attente) ; l'orchestration au submit : form |
| Pendant — avertissement non bloquant | Valeur acceptée mais risquée | Couvert — propriétaire : input (tone warning) |
| Pendant — modification affectant plusieurs champs | Un choix qui reconfigure la suite | Couvert — propriétaire : form (annonce `aria-live="polite"`, cf. champs conditionnels) |
| Pendant — statut d'autosave | "Enregistré à 14 h 32" | Couvert — propriétaire : form (`role="status"`) ; échec d'autosave : alert warning |
| Après — résumé d'erreurs | N erreurs agrégées en tête | Couvert — conteneur : alert (danger permanent) ; orchestration (moment, liens, focus) : form |
| Après — erreur serveur globale | 5xx, indisponibilité | Couvert — conteneur : alert danger ; chorégraphie : form ; texte exact : produit/serveur |
| Après — succès | Confirmation | Couvert — redirection (page dédiée) ou alert success in-page ; toast exclu du périmètre alert (frontière documentée) |
| Après — succès partiel | Réussi + reliquat | Couvert — propriétaire : alert warning ; orchestration du reliquat : form |
| Après — timeout / perte de connexion | Pas de réponse | Couvert — alert danger + retry, valeurs conservées : form |
| Après — session expirée | L'authentification a lapsé | Couvert — dire ce qui est préservé ; si rien ne peut l'être, c'est le territoire de l'autosave |
| Après — retry | Réessayer sans ressaisir | Couvert — l'action vit dans l'alert (nombre : ALERT-UX ; choix du bouton : BUTTON-UX) ; la reprise des valeurs : form |

## 5. Par état du cycle de soumission

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| idle | Saisie en cours, rien soumis | Couvert — machine à états, écrit d'office (prédicteur "état transitoire") |
| validating | Vérification client au submit | Couvert — quasi instantané, aucun théâtre visuel |
| invalid | ≥ 1 erreur client | Couvert — résumé + inline + titre de page + focus |
| correcting | L'utilisateur corrige | Couvert — inline disparaît à la revalidation, résumé stable jusqu'à resoumission |
| submitting | Envoi en cours | Couvert — bouton loading+disabled (l'unique désactivation légitime), champs figés |
| success | Réponse positive | Couvert — redirection ou confirmation in-page, focus déplacé, titre mis à jour |
| server error | Erreur globale | Couvert — alert danger, quoi/pourquoi/comment sortir, valeurs conservées |
| retrying | Nouvel essai | Couvert — valeurs réutilisées telles quelles, idempotence côté produit |
| Double clic | Deux activations rapprochées | Couvert — mécanisme : BUTTON-UX (anti double-soumission) ; moment : form |
| Traitement long | > ~5 s sans réponse | Couvert — statut `aria-live="polite"`, un spinner seul n'annonce rien |
| Annulation d'une soumission | Interrompre un envoi en cours | Couvert — seulement si réellement possible, retour à l'état antérieur intact |
| Timeout | Pas de réponse dans le délai | Couvert — alert danger + Réessayer |
| Conservation des données | Les champs tels que remplis, après tout échec | Couvert — le cas d'échec le plus coûteux du pattern (GOV.UK explicite) |
| Perte de données assumée | Session expirée sans restauration possible | Couvert — le dire, ne jamais échouer en silence |
| Redirection après succès | Page de confirmation | Couvert — titre propre, focus au titre |

## 6. Par risque et contexte

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Contact | Coût d'erreur faible | Couvert — validation au submit, friction minimale |
| Inscription | Champs de format, enjeu de conversion | Couvert — blur sur les champs à risque, contraintes avant saisie |
| Authentification | Login, récupération | Couvert — WCAG 3.3.8 (pas de test cognitif, copier-coller autorisé) ; champ mot de passe : INPUT-UX |
| Recherche | Formulaire dégénéré | Couvert — aucune friction, pas de résumé d'erreurs, submit implicite |
| Paramètres | Modifications réversibles | Couvert — soumission explicite ou autosave, jamais les deux ambigus |
| Paiement | Engagement financier | Couvert — WCAG 3.3.4 (récapitulation), idempotence, champs carte : INPUT-UX (iframe PCI) |
| Données sensibles | Confidentialité | Couvert — minimisation, pas de validation-espion avant soumission explicite |
| Données médicales | Sensible + réglementaire | Couvert — même règle que sensibles, consentement distinct |
| Consentement | Cases, finalités | Couvert — jamais pré-cochées, une case par finalité, poids égal (BUTTON-UX bannières) |
| Suppression | Action destructive | Couvert — paliers de friction BUTTON-UX (coût de recréation), orchestrés par le formulaire |
| Création rapide d'un objet | Ajout à la volée | Couvert — friction minimale, undo plutôt que confirmation |
| Captcha / anti-robot | Tension avec 3.3.8 | **Volontairement hors périmètre** — signalé dans "À approfondir" de FORM-UX.md |
| Upload de fichier | Progression, annulation | **Volontairement hors périmètre** — composant absent du système |

## 7. Par accessibilité

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Ordre du focus | Préserve la logique, le sens et l'opérabilité | Couvert — DOM cohérent, jamais de tabindex positif |
| Focus après soumission échouée | Où atterrit le clavier | Couvert — court : premier champ ; long : résumé |
| Focus : résumé ou champ | Le critère de choix | Couvert — densité et nombre d'erreurs |
| Liens du résumé vers les champs | Ancres fonctionnelles | Couvert — message exact repris, erreur croisée → premier champ du groupe |
| Annonces `aria-live` / `role="alert"` | Ce qui est entendu | Couvert — règle générique : ALERT-UX (alert vs status) ; le moment : form |
| Titre de page préfixé "Erreur :" | Premier signal après submit | Couvert après benchmark — trou de la v1.x, convergence GOV.UK + WAI |
| Erreurs inline liées au champ | aria-describedby | Couvert — INPUT-UI |
| Navigation clavier | Entrée soumet, pas de piège | Couvert |
| Groupement sémantique fieldset/legend | Le contexte annoncé avec chaque champ | Couvert après benchmark — trou de la v1.x (WCAG 1.3.1, GOV.UK) |
| Conservation du contexte après correction | Retour du résumé vers le champ | Couvert — erreur + valeur conservées, correction en contexte |
| SPA : rien ne vient gratuitement | Focus et annonces à gérer explicitement | Couvert — erreur fréquente documentée depuis la v1 |

---

## Bilan du test de couverture

Sur **71 cas recensés** (dont 2 volontairement hors périmètre : captcha, upload de fichier), la v1.1.2 de FORM-UX.md en couvrait **~24** — les 47 restants sont couverts par la réécriture 2.0.0, dont les familles entières "cycle de soumission" (15 cas), "messages par moment et propriétaire" (18 cas) et l'essentiel de "structure" (multi-étapes, conditionnels, répétables, autosave).

**Ce que ce test confirme sur la méthode** :
1. **Le prédicteur "état transitoire" a encore frappé, à sa 6e occurrence** — et à l'échelle d'un pattern entier cette fois : tout ce qui se passe entre `submit` et le résultat (submitting, server_error, timeout, retry, partial_success, conservation des valeurs) était absent de la v1.x. La famille 5 a été écrite d'office avant le test, conformément à la règle établie depuis l'alert.
2. **Sauter l'inventaire se paie** — form était le seul sujet sans inventaire, et c'est le sujet où la première rédaction a laissé le plus de trous (47/71, contre 8-11 ailleurs). Même leçon que la typographie 1.1.0 (benchmark sauté : 10/33), un cran plus loin.
3. **Le benchmark primaire a produit deux trous nets face à des standards établis** : le titre de page préfixé "Erreur :" (GOV.UK + WAI) et fieldset/legend (WCAG 1.3.1) — tous deux comblés en 2.0.0.

**Restent non couverts, signalés dans "À approfondir" de FORM-UX.md** : captcha (tension frontale avec WCAG 3.3.8), upload de fichier (composant absent), recherche à facettes (frontière avec la future intention Collection).
