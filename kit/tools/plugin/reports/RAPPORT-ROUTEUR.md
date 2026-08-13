# RAPPORT — genere-routeur.js

Sujets indexés : 49 — erreurs : 0 — avertissements : 0

## Poids (estimation chars/3,6)

- Socle toujours chargé : routeur ~8,1 k + tokens.yaml ~5,0 k + RULES-accessibility/interaction/adaptive/cognitive-load/performance ~6,0 k
- Totalité du paquet (l'ancien pire cas) : ~88,7 k

- Socle universel : principe d'accessibilité + langage d'interaction + principe adaptatif + principe de charge cognitive + principe de performance perçue (~6,0 k), quelle que soit l'intention.

| Bundle | Fichiers | Poids RULES | Total chargé (avec socle) | vs tout le paquet |
|---|---|---|---|---|
| Formulaire | 19 | ~34,4 k | ~53,5 k | −40 % |
| Collection | 12 | ~21,7 k | ~40,8 k | −54 % |
| Page de contenu | 8 | ~11,1 k | ~30,2 k | −66 % |
| Feedback | 10 | ~16,7 k | ~35,8 k | −60 % |
| Création de compte | 16 | ~38,6 k | ~57,7 k | −35 % |
| Consentement | 16 | ~28,7 k | ~47,8 k | −46 % |
| Cadre applicatif | 14 | ~17,5 k | ~36,6 k | −59 % |
| Superposé modal | 10 | ~14,3 k | ~33,4 k | −62 % |

## Extensions (chargées uniquement si le contexte les exige — hors bundle par défaut)

| Extension | Parent | Poids seul | Total avec parent et socle |
|---|---|---|---|
| creation-compte-consentement | creation-compte | ~0,9 k | ~46,6 k |
| creation-compte-email-deja-utilise | creation-compte | ~0,8 k | ~46,5 k |
| creation-compte-force-mot-de-passe | creation-compte | ~0,6 k | ~46,3 k |
| creation-compte-sso-social | creation-compte | ~0,6 k | ~46,3 k |
| creation-compte-verification-email | creation-compte | ~0,6 k | ~46,4 k |
| form-async-validation | form | ~0,4 k | ~35,8 k |
| form-autosave | form | ~0,4 k | ~35,8 k |
| form-conditional-fields | form | ~0,5 k | ~35,9 k |
| form-multi-step | form | ~0,5 k | ~36,0 k |
| form-partial-success | form | ~0,3 k | ~35,8 k |
| form-sensitive-data | form | ~0,5 k | ~35,9 k |
| form-server-errors | form | ~0,5 k | ~35,9 k |
