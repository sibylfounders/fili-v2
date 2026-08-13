---
sujet: voice
type: langage
resume: "Voix constante / ton variable selon l'état de l'utilisateur, ne jamais blâmer, le mot comme canal fiable ; sentence case, ponctuation FR, chiffres/dates, gabarits de messages"
requires: []
selon-contexte: ["emotion"]
---
# RULES — Voix & ton (compilé, condensé)

> Généré depuis `languages/voice/VOICE-UX.md` (v1.3.0) et `VOICE-UI.md` (v1.2.0). Langage de contenu — aucun token propre (référence `typography.label`, `measure.reading-max`). Ne pas éditer à la main. La source fait autorité.

## Nature
- Langage de contenu. Registre **productif, pas expressif** : clair, précis, sobre — pas d'humour d'apparat, pas de superlatif, pas de sur-célébration.
- **Contrainte ≠ parti pris** : ne jamais blâmer, texte de lien signifiant (2.4.4), jamais l'info par le style seul, plain language = contraintes non négociables ; le registre « productif » est un **parti pris d'identité paramétrable** (surface marketing assumée) — sans jamais toucher aux contraintes. **Lecture d'audit** : chez un hôte tiers, le registre = paramètre relevable → *divergence de registre* signalée à part, jamais une non-conformité.
- **Règle cardinale : le mot est le canal d'information fiable.** Il survit à la couleur coupée, au mouvement coupé, à l'icône incomprise, au lecteur d'écran. Quand color/motion/iconography disent « jamais ce canal seul », le canal de repli qu'ils invoquent tous est le mot.
- Le wording exact de chaque composant vit dans sa fiche (bouton, input, alert, form) — ce langage fournit le **cadre commun** (ton + mécaniques), pas les libellés.
- **Exception E-motion (unique)** : sur les moments mérités du catalogue `RULES-emotion.md` — et seulement eux — le microcopy de résolution se réchauffe d'un cran (émoji ponctuel, « ! » autorisé, ex. « C'est parti ✈️ »). Jamais sur une erreur, une action destructive ou une action fréquente ; hors catalogue, le registre productif fait seul autorité.

## Voix constante, ton variable (le quasi-axe)
- La **voix** ne change pas d'un écran à l'autre ; le **ton** s'ajuste à l'état de l'utilisateur :
  - Routine → clair, direct, discret. Succès (routinier) → bref, factuel, pas de « ! ». Succès (moment E-motion catalogué) → seule exception, cf. ci-dessus.
  - Erreur *utilisateur* → calme, **sans blâme**, orienté correction (dire quoi corriger, jamais « saisie invalide »).
  - Erreur *système* → le produit assume (« Nous n'avons pas pu… ») + une issue.
  - Destructif → direct, conséquence nommée. Attente → présent progressif (« Enregistrement… »).
- **Ne jamais blâmer l'utilisateur** (règle cardinale du ton). Soigner particulièrement l'erreur et la clôture (Peak-End).

## Clarté & accessibilité
- Plain language : phrases courtes, voix active, mot courant, pas de jargon exposé (codes/sigles → logs, pas l'écran).
- Texte de lien/bouton **signifiant hors contexte** (WCAG 2.4.4) — jamais « cliquez ici », « OK », « en savoir plus ».
- Un concept = un mot, partout (cohérence lexicale). Ne pas concaténer de fragments ni coder la longueur en dur (i18n).

## Mécaniques (couche UI)
- **Casse** : sentence case partout (pas de Title Case) ; CAPITALES réservées aux étiquettes `typography.label`.
- **Ponctuation** : pas de point sur un libellé court ; « … » pour une action différée ; ponctuation FR (espace insécable avant `: ; ! ?`, guillemets `« »`) ; pas de « ! » (registre productif).
- **Nombres** : chiffres pour les données ; format localisé (espace insécable milliers, virgule décimale, insécable avant `% €`) — jamais codé en dur.
- **Dates** : format non ambigu (« 12 juillet 2026 » / `12/07/2026`), relatif borné (~24-48 h) et doublé de l'absolu.
- **Longueur** : prose ≤ `measure.reading-max` (70ch) ; troncature qui ne masque jamais une info décisive (nom complet en `title`).

## Gabarits
- **Erreur** = ce qui s'est passé + pourquoi + comment corriger, sans blâme.
- **Succès (routinier)** = confirmation brève au passé accompli, sans félicitation ni « ! ». **Succès (moment E-motion catalogué)** = seule exception (cf. § Nature) — pas de valeur par défaut.
- **Vide** = situation + première action (distinguer « rien encore » de « rien trouvé »).
- **Confirmation destructive** = conséquence nommée + bouton qui dit l'action (« Supprimer », pas « OK ») ; jamais de registre E-motion sur ce cas.
- **Attente** = ce qui se passe, au présent progressif ; double l'indicateur visuel (motion), ne le remplace pas.
- **Bannis** : « Oups », emoji et « ! » dans une erreur, une action destructive ou une action fréquente ; « cliquez ici » ; guillemets droits en contenu. Seule dérogation : la résolution d'un moment E-motion catalogué.

## Vérifiabilité
- La voix ne se teste pas automatiquement (comme la redondance couleur) : exigence de **revue**. Un lint de contenu (mots bannis, point final sur libellé court, guillemets droits) reste à ajouter.

CONFIANCE : plain language, texte de lien signifiant, « ne jamais blâmer », sentence case, chiffres = établi (Nielsen, GOV.UK, Polaris, WCAG). Registre « productif seul » = décision d'identité interne. Lexique exact = noyau extensible. Toute décision de wording non tranchée par un gabarit : STOP, remonter.
