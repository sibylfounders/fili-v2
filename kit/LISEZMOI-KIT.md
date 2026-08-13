# Le kit — d'où vient ce dossier

*Versé au dépôt fili-v2 le 2026-08-13, sur décision d'Auteur (thread « le kit avance sous mes yeux »).*

## Ce que c'est

Le code complet de la page **« atelier »** visible à
https://sibylfounders.github.io/fili/ui/ — réglages (thème, framework, rayon,
relief), fondations (couleurs, rôles sémantiques, primitives), registre de
composants. C'est le kit désigné par l'Auteur le 13 août 2026 :
« C'était ces fichiers là. »

La page elle-même est `apps/site/app/ui/` ; elle s'appuie sur les paquets
`packages/tokens`, `packages/react` et `packages/charts`, et sur la coque du
site `apps/site`. Le tout est embarqué pour que rien ne manque.

## D'où ça vient, exactement

- Dépôt d'origine : https://github.com/sibylfounders/fili (la V1, aussi
  archivée sur la machine d'Auteur dans `Claude/Projects/_old/Fili`).
- Commit d'origine : `70e4a99` — « Poids du routeur recalculés après les
  quatre chantiers du 03/08… » — 2026-08-04.
- C'est l'état exact déployé en ligne au moment du versement.

## Ce qui n'est pas embarqué

`node_modules`, `.git`, `.next`, `dist` — tout se refabrique avec
`npm ci` puis `npm run dev`. Aucun fichier source n'a été modifié.

## Pourquoi ce versement

Le code du kit ne vivait dans aucun dépôt vivant (la V1 est archivée) et
avait déjà été perdu une fois. Décision d'Auteur du 13 août 2026 : le kit
vit ici, dans `fili-v2/kit/`, sous git, avant toute itération.
