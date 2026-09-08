#!/bin/sh
# Après docs/migration-code-en.mjs --write : ce que le codemod ne fait pas lui-même.
set -e
cd "$(dirname "$0")/.."

mvif() { [ -e "$1" ] && mv "$1" "$2" || true; }

# les pièces exclues du codemod suivent leurs voisines
mvif kit/epreuves/derniere-course.json kit/tests/last-run.json
mvif kit/epreuves/derniere-course.log kit/tests/last-run.log
mvif kit/epreuves/banc-de-nuit.launchd.log kit/tests/banc-de-nuit.launchd.log
mvif kit/epreuves/fr.fili.banc-de-nuit.plist kit/tests/fr.fili.banc-de-nuit.plist
mvif kit/epreuves/installer-la-course.sh kit/tests/install-the-run.sh
[ -d kit/epreuves ] && rmdir kit/epreuves || true

find temoin/crash-tests temoin/tools -name .DS_Store -delete 2>/dev/null || true
for d in temoin/crash-tests/cible-html temoin/crash-tests/epreuve-a; do [ -d "$d" ] && rmdir "$d" || true; done
mvif temoin/tools/fili/card temoin/tools/fili/map
mvif temoin/tools/fili/temoin temoin/tools/fili/witness
mvif temoin/temoins temoin/witnesses
mvif temoin/public/temoins temoin/public/witnesses

# chemins dans les commentaires, les gabarits shell/plist, le hook, les scripts npm
perl -pi -e 's#kit/epreuves/#kit/tests/#g; s#epreuves/\$\{#tests/\$\{#g; s#node --test epreuves/#node --test tests/#g; s#node epreuves/capturer\.mjs#node tests/capture.mjs#g; s#mouvement\.test\.mjs#motion.test.mjs#g; s#couleur\.test\.mjs#color.test.mjs#g; s#arrondis\.test\.mjs#rounded.test.mjs#g; s#rythme\.test\.mjs#rhythm.test.mjs#g; s#capturer\.mjs#capture.mjs#g; s#etat-du-banc\.mjs#bench-state.mjs#g; s#banc\.mjs#bench.mjs#g; s#course-de-nuit\.mjs#night-run.mjs#g; s#installer-la-course\.sh#install-the-run.sh#g; s#derniere-course\.(log|json)#last-run.$1#g; s#tokens\.ecrire\.mjs#tokens.write.mjs#g' kit/tests/*.mjs kit/tests/*.sh kit/tests/*.plist kit/*.mjs kit/package.json .githooks/pre-commit
[ -f kit/tests/last-run.json ] && perl -pi -e 's#kit/epreuves/#kit/tests/#g; s#course-de-nuit\.mjs#night-run.mjs#g; s#derniere-course\.log#last-run.log#g' kit/tests/last-run.json || true
perl -pi -e 's#tools/fili/card/produce\.mjs#tools/fili/map/produce.mjs#' docs/system-map.md
perl -pi -e 's#tools/fili/temoin/#tools/fili/witness/#' temoin/tools/fili/README.md
perl -pi -e 's#\.next-epreuves#.next-tests#g' kit/tsconfig.json
# deux attributs devenus jumeaux sur la scène des densités
perl -pi -e 's# data-density=\{d\} data-density=\{d\}# data-density={d}#' kit/app/rythme/view.tsx
# une mutation cite une classe en clair, dans une chaîne à retour à la ligne
perl -pi -e 's#mt-block-carte#mt-block-card#g' temoin/tools/fili/crash-test/mutations.mjs temoin/tools/fili/crash-test/battery.mjs temoin/tools/fili/rules/produce.mjs
# les identifiants SVG internes de l'aurore, coupés par des \${} dans le générateur
perl -pi -e 's#aur-masque#aur-mask#g; s#aur-flou#aur-blur#g; s#aur-couche#aur-layer#g; s#aur-lamelles-glissees#aur-slats-slid#g; s#aur-lamelles#aur-slats#g; s#aur-dessin#aur-drawing#g' kit/aurore/gen-aurore.mjs kit/app/aurore.tsx kit/app/globals.css
# l'aurore est générée : on la régénère depuis son générateur traduit (graine fixe)
( cd kit && node aurore/gen-aurore.mjs >/dev/null 2>&1 ) || echo "gen-aurore : à relancer à la main"
# un chemin normalisé qui portait le même nom que le module path
perl -pi -e 's#^(\s*)const path = (path\.split.*)$#$1const normalized = $2#; s#\(door\) => path\.startsWith\(door\)#(door) => normalized.startsWith(door)#' temoin/scripts/qpm-s2.mjs
# classes citées en clair dans la prose des règles, et deux noms à points sur la carte
perl -pi -e 's#px-inline-coque      py-block-coque#px-inline-container  py-block-container#; s#max-w-lecture#max-w-reading#g' temoin/tools/fili/rules/produce.mjs
perl -pi -e 's#fili\.libelles\.json#fili.labels.json#g; s#fili\.geometrie\.json#fili.geometry.json#g' docs/system-map.md
# les épreuves du kit cherchent « casse » dans le code source : l'identifiant s'appelle maintenant broken
perl -pi -e 's#/casse/#/casse|broken/#g; s#/casse\|étude#/casse|broken|étude#g; s#\|casse\|décor#|casse|broken|décor#g' kit/tests/*.test.mjs
# deux listes de mots affichés à l'écran, que le codemod avait pris pour des valeurs
perl -pi -e 's#const WORDS = \["none", "one", "two", "three", "quatre", "cinq", "six", "seven", "huit", "neuf", "dix", "onze", "douze"\];#const WORDS = ["aucune", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"];#' kit/app/home.tsx
perl -pi -e 's#const WORDS = \["Nouveau", "on", "votre", "line", "of", "ce", "matin"\];#const WORDS = ["Nouveau", "sur", "votre", "ligne", "de", "ce", "matin"];#' kit/app/arrondis/view.tsx
# une paire de classes comparée en clair dans une épreuve
perl -pi -e "s#\['verdict attention', 'verdict bon'\]#['verdict attention', 'verdict good']#" kit/tests/rounded.test.mjs
echo "post-migration : ok"
