# La page « réglez et téléchargez » — à reconstruire ici

Perdue le 11 août 2026 avec la session qui l'avait construite (jamais
versionnée, jamais téléchargée). Ce dossier est son futur emplacement.

## Ce qu'elle contenait (d'après les docs du projet Claude)

- Un fichier autonome, ouvrable dans le navigateur.
- Trois réglages (unité de base, diviseur, loi de rayons).
- Un aperçu qui rebâtit sa géométrie à chaque clic, à largeur variable.
- Le tableau de la chaîne complète.
- Trois téléchargements générés par le même calcul :
  `tokens.css` (socle + 22 jetons responsives en clamp()),
  `tailwind.fili.js` (utilitaires pointant sur les variables),
  `fili.tokens.json` (jetons Figma figés à 768 px, bornes en description).
- Le moteur de dérivation injecté depuis le même fichier source que les
  téléchargements : la page et les fichiers ne peuvent pas diverger.

## Les sources pour la reconstruire

- `etalon/semantic-rhythm.html` — le générateur de l'Auteur, qui fait foi.
- Docs du projet Claude : `kit-creation-derivation.md` (la dérivation
  complète et les valeurs prouvées), `migration-echelle-correspondance.md`,
  `kit-creation-resultat.md` (ce que les épreuves ont appris).
- Le crash-test décrit dans les docs : 24 assertions contre les valeurs
  lues dans le générateur de l'Auteur — à rejouer avant de déclarer la
  page reconstruite.
