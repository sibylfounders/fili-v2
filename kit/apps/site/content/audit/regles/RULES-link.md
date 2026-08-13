---
sujet: link
type: composant
resume: "Navigation : lien inline, autonome ou de navigation ; destination explicite, états, téléchargements et changement de contexte"
requires: ["interaction"]
selon-contexte: ["card (si le lien étend une carte cliquable)", "iconography (si icône)", "voice (texte de lien signifiant = cadre unificateur)", "motion (feedback d'état, focus ring non animé)"]
---
# RULES — Link (compilé, condensé)

> Généré depuis `components/link/LINK-UX.md` (v1.0.0) et `LINK-UI.md` (v1.0.0).
> La source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Usage

- **Un Link dit “aller”, un Button dit “faire”.**
- Link = autre page, ressource, section ou URL. Button = modifier l'état, soumettre, créer, supprimer,
  ouvrir une action ou déclencher un traitement.
- Une SPA ne change pas la frontière : le résultat perçu décide.
- Navigation = `<a href>` réel. JavaScript peut enrichir, pas remplacer la destination native.

## Contextes

- **Inline** : souligné au repos ; identifiable sans couleur.
- **Standalone** : texte + éventuelle icône directionnelle ; plus léger qu'un Button adjacent.
- **Navigation** : destination courante signalée sans couleur seule + `aria-current`.
- **Téléchargement** : annoncer le type et, si utile, la taille.
- **Nouvel onglet** : exceptionnel et annoncé dans le libellé ou l'indication accessible cohérente.
- **Card cliquable** : vrai Link dont le texte accessible est le titre ; actions internes hors du lien.

## Wording

- Décrire la destination ou la ressource : « Voir les factures », « Documentation de l'API », pas
  « En savoir plus » répété ni URL brute quand un nom humain existe.
- Le but du lien reste compréhensible depuis son texte ou son contexte accessible.

## États

- default : `color.primary` + soulignement selon contexte ;
- hover : `color.primary-hover`, soulignement maintenu ;
- focus : `color.accent` + `border.focus-width` + `border.focus-offset` ;
- active : feedback immédiat sans déplacement du layout ;
- visited : `color.text-secondary` seulement quand l'historique aide (collections de contenu).
- Pas de Link disabled : retirer la cible ou expliquer l'indisponibilité.

## Icônes et cible

- Inline : `icon.sm` ; standalone : `icon.md`.
- Icône seule : nom accessible obligatoire + zone tactile commune de 44px.
- Une icône externe/directionnelle complète le texte ; elle ne porte pas seule un changement de
  contexte non établi.

## Risques

| Cas | Risque | Sévérité |
|---|---|---|
| Link utilisé pour une action | attente, clavier et sémantique incohérents | Élevée |
| Button utilisé pour naviguer | comportements natifs du lien perdus | Élevée |
| couleur seule / soulignement hover-only | lien invisible | Élevée |
| nouvel onglet non annoncé | changement de contexte inattendu | Moyenne |

## Application des Languages

- **Interaction** : **un Link dit « aller », un Button dit « faire »** — Link = expression de la navigation dans `INTERACTION-UX` ; c'est le résultat perçu qui décide, pas la technique (SPA incluse).
- **Voice** : le wording est la déclinaison locale de `VOICE-UX` (cadre unificateur) — texte de lien **signifiant hors contexte** (WCAG 2.4.4), un concept = un mot ; pas d'« En savoir plus » répété ni d'URL brute quand un nom humain existe.
- **Motion** : la transition d'état (couleur) est du **feedback** (`motion.fast`/`ease-out`, `MOTION-UX`), supprimable sans perte sous `prefers-reduced-motion` ; le **focus ring n'est jamais animé** (information de position clavier, pas un effet).
- **E-motion** : **aucun instrument** — un clic de navigation est une action à haute fréquence, hors du catalogue des moments mérités (`EMOTION-UX` § budget de rareté) ; son seul besoin temporel est le feedback d'état.
