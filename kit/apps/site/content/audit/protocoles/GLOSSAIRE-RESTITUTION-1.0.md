# Glossaire de restitution (v1.0)

> La langue de la couche de lecture — audits, rapports, synthèses remis à un humain.
> Compagnon de `RESTITUTION-1.0.md`. Document vivant : chaque retour de lecteur y ajoute une
> ligne ; toute évolution incrémente la version dans le nom du fichier.

## Les trois règles

1. **Les anglicismes de métier restent en anglais.** Onboarding, landing page, SSO : les traduire créerait de la confusion, pas de la clarté.
2. **Le jargon interne du système se traduit en langue d'usage** dans la couche de lecture (verdict, points à retenir, tables). Il garde son nom exact dans l'annexe de traçabilité et les RULES, où la précision prime.
3. **Aucune métaphore maison sans filet.** Une image inventée pour faire court (« bouton mort ») se remplace par le terme standard (« bouton désactivé »), ou s'accompagne de sa définition à la première occurrence.

## Dire / ne pas dire

| ❌ Ne pas écrire | ✅ Écrire plutôt | Pourquoi |
|---|---|---|
| bouton mort | bouton désactivé | « mort » est une image, pas un état |
| avant la valeur / avant toute valeur | avant même de pouvoir utiliser l'app ; avant la première `<action concrète du produit>` (ex. Strava : la première sortie enregistrée) | « valeur » est un concept interne — le lecteur veut du concret |
| la première valeur | le premier bénéfice concret (nommer lequel) | idem |
| atterrissage | l'arrivée dans l'app après l'inscription | terme interne, réservé à l'annexe |
| impasse | écran sans issue | plus littéral |
| état transitoire | moment d'attente | idem |
| profilage progressif | poser les questions au fil de l'usage | le mécanisme, pas son nom savant |
| contrepartie perçue | bénéfice visible pour l'utilisateur | idem |
| interstitiel | écran intermédiaire / écran promo | selon le cas |
| énumération de comptes | deviner quels e-mails ont un compte (fuite) | définir à la première occurrence, le terme peut suivre entre parenthèses |
| soft gate / hard gate | accès provisoire / accès bloqué jusqu'à vérification | traduire par l'effet |
| ask-once | ne jamais redemander une info déjà donnée | traduire par la règle |
| granularité | niveau de détail | — |
| wording | formulation | — |
| friction *(sans contexte)* | friction — toujours adossée à un exemple concret (« un écran de plus », « un champ de plus ») | le mot est de métier, l'abstraction seule ne parle pas |
| passwordless *(seul)* | inscription sans mot de passe (passwordless) | définir à la première occurrence, l'anglicisme peut suivre |

## Anglicismes de métier à garder tels quels

onboarding · landing page · SSO · feed · leaderboard (si le produit audité l'utilise) ·
dark pattern · CTA · design system · token · checkout · login

## Périmètre

Couche de **lecture** uniquement. L'annexe de traçabilité, les protocoles et les RULES gardent le
vocabulaire exact du système — c'est leur rôle.

---

*v1.0 — 2026-07-21. Premières entrées tirées de l'audit de décisions Strava et du retour de
lecture associé.*
