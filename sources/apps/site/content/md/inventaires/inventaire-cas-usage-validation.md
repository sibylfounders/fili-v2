# Inventaire des cas d'usage — Validation et récupération (protocole transversal)

> Établi le 2026-07-30 avec le principe `VALIDATION-UX.md`. Il ne recense PAS les cas de saisie (voir `inventaire-cas-usage-input`), ni ceux de l'orchestration (voir `inventaire-cas-usage-form`) : seulement ce que la CHAÎNE doit savoir traiter, du verdict jusqu'à la reprise. Un « non couvert » est une frontière assumée, pas un oubli — chacun nomme ce qu'il faudrait pour le lever.

---

## 1. Par source de verdict

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Contrainte native | `required`, `type=email`, `min`/`max`, `pattern`, `minLength`… | Couvert — `ValidityState` normalisé en codes stables ; le `validationMessage` du navigateur n'est jamais le message canonique (langue et texte dépendent de l'agent) |
| Cardinalité d'un ensemble | « au moins une », « trois maximum » | Couvert — aucune contrainte native n'existe pour un groupe de cases : le contrat la calcule sur la sélection |
| Schéma applicatif | Le produit valide avec son propre schéma | Couvert par frontière — le contrat accepte un verdict de source `schema` ; aucune bibliothèque n'est requise ni supposée |
| Règle métier | Adresse déjà utilisée, date de fin avant date de début, stock insuffisant | Couvert par frontière — la règle appartient au produit ; le système normalise et présente son verdict |
| Verdict serveur attachable à un champ | 422 sur un champ précis | Couvert — même chaîne qu'un verdict client, et il le REMPLACE (FORM-R33) |
| Erreur serveur globale | 500, timeout, session expirée | Couvert par renvoi — `Alert` + pattern `FORM`, hors de la chaîne par champ |
| Verdict asynchrone | Disponibilité d'un identifiant | Couvert — état `validating`, verdict périmé jeté si la valeur change |
| Verdict de sécurité | Force d'un mot de passe, réputation d'une adresse | Couvert par frontière — externe par construction ; la validation cliente n'est jamais une garantie (VALIDATION-R09) |

## 2. Par contrôle

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Champ texte libre | Nom, message | Couvert — requis, longueurs, pattern explicite ; **jamais** de regex arbitraire sur un prénom |
| Champ e-mail | `type="email"` | Couvert — cas pilote : un numéro de téléphone saisi dans le champ e-mail produit `typeMismatch` et refuse la soumission. Ne prétend ni que l'adresse existe, ni qu'elle reçoit du courrier |
| Champ téléphone | `type="tel"` | Couvert par frontière — `tel` adapte le clavier, il ne valide pas. Le format admissible vient du produit ou d'une bibliothèque spécialisée ; espaces, tirets, parenthèses et indicatifs ne sont jamais rejetés d'office |
| Champ URL | `type="url"` | Couvert — `typeMismatch` normalisé ; restrictions de domaine ou de protocole restent externes |
| Quantité numérique | `Input.Number` | Couvert — `badInput`, `min`, `max`, `step`, requis. Un code postal, un OTP, un numéro de carte n'y entrent pas (INPUT-UX) |
| Mot de passe | `Input.Password` | Couvert par frontière — la politique de complexité appartient au produit ; le système présente son verdict sans en imposer un |
| Zone de texte | `Input.Textarea` | Couvert — requis, longueurs, verdict externe. Le compteur de caractères n'est jamais à lui seul un message d'erreur |
| Select | Choix unique | Couvert depuis le 2026-07-30 — le placeholder n'est jamais une valeur ; option devenue indisponible et verdict métier passent par la même prise |
| Case isolée | Consentement, confirmation obligatoire | Couvert — verdict propre à la case ; `indeterminate` n'est jamais une valeur validée |
| Groupe de cases | Sélection multiple | Couvert — requis, minimum, maximum ; l'erreur appartient au groupe (CHOICE-R17). Combinaison interdite : couvert par frontière (règle métier) |
| Groupe de radios | Choix exclusif obligatoire | Couvert — aucune option choisie, valeur devenue indisponible, verdict métier |
| Switch | Réglage à effet immédiat | Couvert négativement, et déclaré — pas un porteur de validation. Un « doit être activé » est une case à cocher |
| Recherche | `Input.Search` | Couvert négativement, et déclaré — aucune contrainte de format par défaut ; une requête vide s'accepte ou s'ignore selon le produit |
| Bascule de thème | Préférence d'affichage | Couvert négativement, et déclaré — rend une case native, mais aucune soumission ne l'attend |

## 3. Par moment de la chaîne

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Contrôle jamais touché | État initial | Couvert — `pristine` ≠ `valid` ; l'absence de verdict ne prouve rien |
| Verdict en attente | Aller-retour serveur pendant la saisie | Couvert — `validating`, annoncé, non bloquant par lui-même |
| Plusieurs contraintes violées | Requis + format + métier | Couvert — une seule erreur affichée, priorité déterministe et documentée |
| Correction en cours | L'utilisateur retape | Couvert — le verdict est attaché à la valeur jugée : il périme dès qu'elle change |
| Revalidation | Nouvelle soumission | Couvert — les verdicts sont recalculés ; aucun verdict obsolète n'est conservé |
| Soumission refusée | Un verdict bloquant subsiste | Couvert — la porte se décide sur les verdicts, jamais sur l'apparence |
| Soumission pendant une attente | L'utilisateur ne patiente pas | Couvert — l'attente se dit, la soumission ne part pas en silence (FORM-R50) |
| Reprise après erreur serveur | « Réessayer » | Couvert par renvoi — `FORM-UX` ; les valeurs saisies survivent toujours |
| Erreur portée par un champ devenu invisible | Champ conditionnel masqué | Couvert par renvoi — `FORM-R55` : on ne demande pas de corriger l'invisible |

## 4. Par restitution

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Message local | Sous le champ ou le groupe | Couvert — emplacement unique, l'erreur remplace l'aide (INPUT-R26) |
| Résumé après échec | Vue d'ensemble en tête | Couvert — mêmes objets que les messages locaux ; construit à partir des verdicts, dans l'ordre de lecture |
| Avertissement | Valeur acceptable mais douteuse | Couvert **partiellement** — la famille du choix (case, radio) n'a pas de teinte d'avertissement : le message le porte seul. Lever cette limite demanderait un rôle de token dans `CHOICE-UI`, pas une astuce d'implémentation |
| Confirmation d'un succès | Champ passé en `success` | Couvert — jamais automatique : c'est une décision de produit (INPUT-R16/R20) |
| Annonce à la technologie d'assistance | Ce qui est lu | Couvert par renvoi — `ACCESSIBILITY-UX` ; `aria-invalid` seulement pendant une erreur réelle |
| Formulation du message | Les mots choisis | Couvert par renvoi — `VOICE-UX` ; le contrat n'écrit aucun texte et n'en code aucun en dur |
| Message dans une langue autre que le français | Produit multilingue | Couvert — aucune chaîne de langue naturelle n'existe dans le contrat : les messages sont fournis par l'appelant |

## 5. Non couverts (frontières assumées)

| Cas d'usage | Pourquoi il n'est pas couvert | Ce qu'il faudrait pour le lever |
|---|---|---|
| Orchestration de formulaire en API publique | Un seul consommateur existe (le pilote) : la primitive commune n'est pas démontrée par l'usage | Un second formulaire réel, puis un arbitrage (`MISSING-COMPONENT-PROTOCOL`) |
| Résumé d'erreurs en composant | Il se compose aujourd'hui d'`Alert` + liens ; aucun besoin consommateur ne prouve qu'un composant réduirait le câblage | Le même arbitrage, sur la même preuve |
| Validation croisée entre champs comme mécanique | La règle appartient au produit ; le contrat sait porter le verdict, pas le calculer | Rien — c'est une frontière, pas un trou |
| Teinte d'avertissement dans la famille du choix | Aucun rôle de token déclaré dans `CHOICE-UI` | Une décision UI, journalée, dans `CHOICE-UI` |
| Validation d'un champ hors React | Le contrat est déjà sans React ; sa distribution hors du paquet ne l'est pas | Une décision de distribution (`@fili/react` n'est pas publié) |
