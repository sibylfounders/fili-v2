---
sujet: validation
type: principe
resume: "Protocole transversal de la chaîne verdict → état → message → résumé → focus → soumission : taxonomie du verdict, priorité, obsolescence, rôle de validation par contrôle — pose les invariants et renvoie au propriétaire de chaque maillon"
requires: []
selon-contexte: ["input", "select", "form", "alert", "voice", "accessibility", "interaction"]
---
# RULES — Validation et récupération (compilé, condensé)

> Généré depuis `principles/VALIDATION-UX.md` (v1.1.0). **Chargé par les intentions qui portent des contrôles de formulaire** (Formulaire, Création de compte, Consentement) — pas par le socle universel : une page de contenu n'a rien à valider. Il possède **la chaîne**, jamais ses maillons. Ne pas éditer à la main. La source fait autorité.

## Nature
- Protocole transversal : **sans variantes, sans token, sans valeur visuelle**. Il pose les invariants du verdict et **renvoie au propriétaire** de chaque maillon. En cas de divergence, le propriétaire a raison.
- **Règle cardinale** : le composant PRÉSENTE un verdict · le formulaire ORCHESTRE les verdicts · le produit DÉFINIT les contraintes · le serveur REND le verdict final. Quatre responsabilités, aucun recouvrement.

## La chaîne (ordonnée, aucun maillon ne se saute)
`nature de la donnée → contraintes déclarées → valeur → déclenchement → validateur → VERDICT → état du contrôle → message local → agrégation → focus et annonce → correction → revalidation → soumission ou reprise`

- Un état affiché **sans verdict** est un mensonge ; un verdict sans message est muet ; un message sans agrégation est introuvable sur un formulaire long.
- **Une erreur n'est jamais un style choisi.** Seule exception : une **fixture de présentation** (documentation, démonstration d'un état isolé), qui doit se déclarer comme telle.

## Le verdict
- Objet structuré, indépendant du rendu : **code stable · champ ou groupe · source · gravité · message** (+ paramètres). Le statut visuel en DÉCOULE ; il n'en tient jamais lieu.
- **Cinq états** : `pristine` (rien n'a été vérifié) · `validating` (verdict attendu) · `valid` · `invalid` · `warning`. **`pristine` n'est PAS `valid`** — l'absence de verdict ne prouve rien.
- **`error` bloque, `warning` non.** Un avertissement qui empêche d'avancer est une erreur mal nommée.
- **Quatre sources** : `native` · `schema` · `business` · `server`. Le système normalise et présente ; il n'invente aucune contrainte métier.
- **Le serveur fait foi** : son verdict REMPLACE celui du client, il ne s'empile jamais (cf. `form`).
- **La validation cliente n'est jamais une garantie de sécurité** — elle sert la récupération, pas la protection. Le serveur revalide toujours.
- **Le message local et l'entrée du résumé sortent du MÊME objet.** Jamais deux textes pour un même problème.

## Contraintes natives — codes stables
`badInput · valueMissing · typeMismatch · patternMismatch · tooShort · tooLong · rangeUnderflow · rangeOverflow · stepMismatch · customError`
- **Ne jamais utiliser `validationMessage` du navigateur comme message canonique** : son texte et sa langue dépendent de l'agent. Le message vient du produit.
- Un `type="tel"` **ne valide pas** : il adapte le clavier. Le format admissible vient du produit ou d'une bibliothèque spécialisée — jamais d'une regex mondiale improvisée.
- Un e-mail validé **n'est pas** un e-mail qui existe ni qui reçoit. `type="email"` ne juge que la syntaxe.
- Une quantité numérique seule mérite `number` : code postal, OTP, numéro de carte = `text` + `inputmode`.

## Une seule erreur locale, priorité déclarée
- Un champ peut violer plusieurs contraintes ; **l'interface en montre UNE**. Jamais « Champ requis / Format incorrect / Valeur inconnue » empilés.
- **Ordre déterministe** : gravité (erreur avant avertissement) → source (serveur → métier → schéma → natif) → à source native égale, la contrainte la plus structurelle (le navigateur n'a pas pu lire → absente → nature fausse → forme → taille → domaine numérique).
- Deux exécutions sur les mêmes données donnent le même message.

## Récupération
- **Un verdict porte sur une valeur ; quand elle change, il cesse de FAIRE AUTORITÉ, pas de s'AFFICHER.** Il n'oppose plus rien à la soumission, mais son message reste lisible jusqu'à la REVALIDATION du champ — retirer l'instruction au premier caractère la retire au moment où elle sert. La signature d'une sélection doit être injective (sérialisation, jamais une concaténation).
- **Ce qui remplace un message affiché, c'est une revalidation** : au départ du champ, ou à la soumission suivante. Jamais le temps qui passe, jamais la frappe.
- **La disparition visuelle d'une erreur ne vaut pas validité** : la soumission se décide sur les verdicts, jamais sur l'apparence ni une classe CSS.
- `validating` n'est pas un refus : c'est une attente, et elle se dit.

## QUAND valider — déclaré, jamais imposé
- **Trois partis légitimes** : `submit` (rien avant la soumission) · `blur` (au départ du champ) · `deferred` (aussi pendant la frappe, après une pause). Le secteur DIVERGE réellement (GOV.UK ↔ Carbon) : aucun n'est le bon défaut universel.
- **Le choix se déclare CHAMP PAR CHAMP** et dépend du risque d'erreur de format (une adresse e-mail, oui ; une case à cocher, non). Le système l'outille et le tient ; il n'en impose aucun.
- **Deux bornes non négociables** : jamais de verdict à chaque frappe sans délai, et jamais avant que la première saisie du champ soit terminée.
- **Un champ DÉJÀ en erreur se re-juge au départ du champ**, quelle que soit sa stratégie — et jamais à la frappe.

## Rôle de validation d'un contrôle (déclaration obligatoire)
`field` (porte son verdict) · `group` (le verdict appartient à l'ensemble) · `none` (**justifié**).
Quand le rôle est `field` ou `group`, déclarer aussi : contraintes natives prises en charge, contraintes externes acceptées, cible d'`aria-invalid`, stratégie d'association du message, cible de focus, rôle dans le résumé, comportement requis / en attente / à la correction, un exemple valide et un invalide.
- Un composant livré sans cette déclaration est un composant dont personne ne sait s'il peut être fautif.

## Qui porte quoi (renvois — charger le propriétaire pour le détail)
| Besoin | Propriétaire |
|---|---|
| Habillage d'un état, emplacement du message, indicateur de requis | `input` |
| Erreur d'un ensemble de choix, rattachement au groupe | `choice` (doctrine CHOICE-UX — pas encore de fiche condensée dans ce paquet) |
| État d'erreur d'un select, placeholder jamais une valeur | `select` |
| QUAND valider, validation croisée, résumé, focus, cycle de soumission, reprise | `form` |
| Conteneur du message global (structure, tone, persistance) | `alert` |
| Les mots du message | `voice` |
| Association, annonce, déplacement du focus | `accessibility` |
| Saisie, sélection, action, compréhension d'un état | `interaction` |
| Les contraintes métier, le texte d'une erreur serveur | Le produit / le serveur — hors design system |

## Anti-patterns
- Poser `status="error"` (ou un message d'erreur) sans verdict dans une interface réelle.
- Écrire `aria-invalid` à la main : il se DÉRIVE du verdict.
- Traiter un champ jamais vérifié comme valide.
- Effacer un message d'erreur au premier caractère tapé : l'utilisateur perd l'instruction pendant qu'il corrige.
- Imposer une stratégie de timing unique à tous les champs d'un produit.
- Empiler plusieurs messages sous un champ.
- Faire du message du navigateur le message du produit.
- Désactiver silencieusement le bouton de soumission au lieu de refuser et de dire pourquoi.
- Présenter « zéro erreur technique » comme la preuve que les règles métier sont correctes.
