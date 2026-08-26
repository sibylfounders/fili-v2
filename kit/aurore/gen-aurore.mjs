/* GÉNÉRATEUR DE L'AURORE — aurore-boreale.svg
   Un script déterministe (graine fixe) écrit le SVG : les lamelles (largeur,
   décalage vertical, opacité) sont tirées une fois pour toutes, le dessin
   est le même à chaque exécution. Aucune valeur de couleur ici : le SVG
   lit --primary, --accent et --bg, et en tire ses crans (voir le <style>).
   Régénérer : node kit/aurore/gen-aurore.mjs — écrit, à côté du script,
   aurore-boreale.svg (le SVG seul) et aurore-boreale.html (la version en
   couches), et dans kit/app/aurore-boreale.ts le fragment que le composant
   <Aurore> (kit/app/aurore.tsx) insère dans les pages. */

const W = 1024, H = 1536 /* espace de travail */
const HV = 1300 /* hauteur visible : le dessin s'arrête au pied des montagnes (plus d'eau) */
const seed = 20260825
let s = seed >>> 0
const rnd = () => { s += 0x6D2B79F5; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const lerp = (a, b, t) => a + (b - a) * t

/* ── Les lamelles : contiguës, 6 à 28 px, sur toute la largeur ── */
const lamelles = []
let x = 0, i = 0
/* deux bruits lents pour la cohérence : des paquets de lamelles se
   ressemblent (comme dans l'image), sans être uniformes */
let dLent = 0, oLent = 0.75
while (x < W) {
  const w = 6 + Math.round(rnd() * 22)
  dLent = lerp(dLent, (rnd() - 0.5) * 2, 0.35)
  oLent = lerp(oLent, 0.45 + rnd() * 0.55, 0.3)
  const d = Math.max(-1, Math.min(1, dLent + (rnd() - 0.5) * 0.7))   /* décalage vertical, -1..1 */
  const o = Math.max(0.12, Math.min(1, oLent + (rnd() - 0.5) * 0.5)) /* opacité de la lamelle */
  lamelles.push({ x, w: Math.min(w, W - x), d, o, g: i % 3 })
  x += w; i++
}

/* ── La carte de déplacement : une image SVG en gris, une lamelle = une
   valeur. Vert = décalage vertical (128 = aucun), rouge/bleu neutres. ── */
const AMPL = 190 /* px de déplacement max (±95) */
const carte = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' shape-rendering='crispEdges'>` +
  lamelles.map((l) => { const g = Math.round(128 + l.d * 120); return `<rect x='${l.x}' width='${l.w}' y='0' height='${H}' fill='rgb(128,${g},128)'/>` }).join('') +
  `</svg>`
const carteUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(carte)

/* ── Le masque d'opacité : trois familles de lamelles, chacune frémit à
   son rythme (voir le CSS) ── */
const rectsFamille = (g) => lamelles.filter((l) => l.g === g).map((l) => `<rect x="${l.x}" y="0" width="${l.w}" height="${H}" fill="#fff" fill-opacity="${l.o.toFixed(2)}"/>`).join('')
const masque = [0, 1, 2].map((g) => `<g class="aur-lam aur-lam-${g + 1}">${rectsFamille(g)}</g>`).join('\n      ')
/* les mêmes lamelles, une famille par masque, sans animation : pour la
   version en couches, c'est la COUCHE entière qui respire */
const masquesFamilles = [0, 1, 2].map((g) =>
  `<mask id="aur-masque-lam-${g + 1}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">${rectsFamille(g)}</mask>`).join('\n    ')

/* ── LE SVG SEUL : un fichier autonome, l'animation vit dans le masque.
   Parfait posé UNE fois ; posé plusieurs fois sur une page, préférer la
   version en couches (aurore-boreale.html) : elle ne recalcule rien. ── */
const svgSeul = `<svg class="aurore" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${HV}" aria-hidden="true" focusable="false">
  <!-- AURORE BORÉALE — illustration du kit, générée par gen-aurore.mjs (graine ${seed}).
       Couleurs : aucune valeur ici. Le dessin lit --primary, --accent et --bg, et
       recalcule les crans de la gamme du kit (mêmes clartés que kit/derivation.mjs). -->
  <style>
    /* LES CRANS DE L'AURORE — posés là où vivent les jetons du thème (la
       racine et tout élément data-theme), pour que l'illustration suive
       le thème le plus proche, exactement comme un rôle du kit. Mêmes
       clartés que la gamme 50–950 de kit/derivation.mjs ; le chroma est
       rapporté à celui du cran d'accueil de la charte (600 pour primary,
       500 pour accent). */
    :root, [data-theme="light"], [data-theme="dark"] {
      --aur-src-p:  var(--primary, #4F46E5);
      --aur-src-a:  var(--accent, #0791B2);
      --aur-src-bg: var(--bg, #FFFFFF);
      --aur-ka: 0.204;
      --aur-p50: oklch(from var(--aur-src-p) 0.962 calc(c * 0.018 / var(--aur-kp)) h);
      --aur-p100: oklch(from var(--aur-src-p) 0.930 calc(c * 0.033 / var(--aur-kp)) h);
      --aur-p200: oklch(from var(--aur-src-p) 0.870 calc(c * 0.062 / var(--aur-kp)) h);
      --aur-p300: oklch(from var(--aur-src-p) 0.785 calc(c * 0.104 / var(--aur-kp)) h);
      --aur-p400: oklch(from var(--aur-src-p) 0.680 calc(c * 0.158 / var(--aur-kp)) h);
      --aur-p500: oklch(from var(--aur-src-p) 0.585 calc(c * 0.204 / var(--aur-kp)) h);
      --aur-p600: oklch(from var(--aur-src-p) 0.511 calc(c * 0.230 / var(--aur-kp)) h);
      --aur-p800: oklch(from var(--aur-src-p) 0.398 calc(c * 0.177 / var(--aur-kp)) h);
      --aur-p900: oklch(from var(--aur-src-p) 0.359 calc(c * 0.135 / var(--aur-kp)) h);
      --aur-p950: oklch(from var(--aur-src-p) 0.257 calc(c * 0.086 / var(--aur-kp)) h);
      --aur-a100: oklch(from var(--aur-src-a) 0.930 calc(c * 0.033 / var(--aur-ka)) h);
      --aur-a200: oklch(from var(--aur-src-a) 0.870 calc(c * 0.062 / var(--aur-ka)) h);
      --aur-a300: oklch(from var(--aur-src-a) 0.785 calc(c * 0.104 / var(--aur-ka)) h);
      --aur-a400: oklch(from var(--aur-src-a) 0.680 calc(c * 0.158 / var(--aur-ka)) h);
      --aur-a500: oklch(from var(--aur-src-a) 0.585 calc(c * 0.204 / var(--aur-ka)) h);
    }
    /* thème clair : jour, pastel sur fond blanc */
    :root, [data-theme="light"] {
      --aur-kp: 0.230; /* le chroma du cran d'accueil : 600 pour primary (charte) */
      --aur-violet:       var(--aur-p400);
      --aur-violet-fort:  var(--aur-p500);
      --aur-bleu:         color-mix(in oklch, var(--aur-p400), var(--aur-a400));
      --aur-bleu-fort:    color-mix(in oklch, var(--aur-p500), var(--aur-a500));
      --aur-teal:         var(--aur-a400);
      --aur-teal-clair:   var(--aur-a300);
      --aur-coeur:        var(--aur-a100);
      --aur-mont:         color-mix(in oklch, var(--aur-p100) 60%, var(--aur-src-bg));
      --aur-mont-ombre:   color-mix(in oklch, var(--aur-p200) 75%, var(--aur-src-bg));
      --aur-mont-ombre-2: color-mix(in oklch, var(--aur-p300) 55%, var(--aur-src-bg));
      --aur-mont-arete:   var(--aur-src-bg);
      --aur-brume:        var(--aur-src-bg);
      --aur-force: 0.92;      /* opacité d'ensemble de l'aurore */
    }
    /* thème sombre : nuit, l'aurore brille, les montagnes s'assombrissent */
    [data-theme="dark"] {
      --aur-kp: 0.158; /* en sombre, primary est posée sur le cran 400 */
      --aur-violet:       var(--aur-p500);
      --aur-violet-fort:  var(--aur-p600);
      --aur-bleu:         color-mix(in oklch, var(--aur-p500), var(--aur-a500));
      --aur-bleu-fort:    color-mix(in oklch, var(--aur-p400), var(--aur-a400));
      --aur-teal:         var(--aur-a400);
      --aur-teal-clair:   var(--aur-a300);
      --aur-coeur:        var(--aur-a200);
      --aur-mont:         var(--aur-p950);
      --aur-mont-ombre:   color-mix(in oklch, var(--aur-p950), var(--aur-src-bg));
      --aur-mont-ombre-2: var(--aur-p900);
      --aur-mont-arete:   var(--aur-p800);
      --aur-brume:        var(--aur-src-bg);
      --aur-force: 1;
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
      --aur-kp: 0.158; /* en sombre, primary est posée sur le cran 400 */
        --aur-violet:       var(--aur-p500);
        --aur-violet-fort:  var(--aur-p600);
        --aur-bleu:         color-mix(in oklch, var(--aur-p500), var(--aur-a500));
        --aur-bleu-fort:    color-mix(in oklch, var(--aur-p400), var(--aur-a400));
        --aur-teal:         var(--aur-a400);
        --aur-teal-clair:   var(--aur-a300);
        --aur-coeur:        var(--aur-a200);
        --aur-mont:         var(--aur-p950);
        --aur-mont-ombre:   color-mix(in oklch, var(--aur-p950), var(--aur-src-bg));
        --aur-mont-ombre-2: var(--aur-p900);
        --aur-mont-arete:   var(--aur-p800);
        --aur-brume:        var(--aur-src-bg);
        --aur-force: 1;
      }
    }
    .aurore .s-violet      { stop-color: var(--aur-violet); }
    .aurore .s-violet-fort { stop-color: var(--aur-violet-fort); }
    .aurore .s-bleu        { stop-color: var(--aur-bleu); }
    .aurore .s-bleu-fort   { stop-color: var(--aur-bleu-fort); }
    .aurore .s-teal        { stop-color: var(--aur-teal); }
    .aurore .s-teal-clair  { stop-color: var(--aur-teal-clair); }
    .aurore .s-coeur       { stop-color: var(--aur-coeur); }
    .aurore .s-brume       { stop-color: var(--aur-brume); }
    .aurore .f-mont        { fill: var(--aur-mont); }
    .aurore .f-mont-ombre  { fill: var(--aur-mont-ombre); }
    .aurore .f-mont-ombre-2{ fill: var(--aur-mont-ombre-2); }
    .aurore .f-mont-arete  { fill: var(--aur-mont-arete); }
    .aurore .aur-corps     { opacity: var(--aur-force); }
    /* le frémissement : trois familles de lamelles respirent à des rythmes
       différents, le cœur pulse, et l'ensemble des lamelles se balance
       lentement — coupé si l'utilisateur a demandé moins d'animations */
    @media (prefers-reduced-motion: no-preference) {
      .aurore .aur-lam-1 { animation: aur-frem 4.2s ease-in-out infinite alternate, aur-balance 13s ease-in-out infinite alternate; }
      .aurore .aur-lam-2 { animation: aur-frem 5.6s ease-in-out -2s infinite alternate, aur-balance 13s ease-in-out -4s infinite alternate; }
      .aurore .aur-lam-3 { animation: aur-frem 7.1s ease-in-out -4s infinite alternate, aur-balance 13s ease-in-out -8s infinite alternate; }
      .aurore .aur-coeur-trait { animation: aur-souffle 5s ease-in-out infinite alternate; }
    }
    @keyframes aur-frem { from { opacity: 0.3; } to { opacity: 1; } }
    @keyframes aur-souffle { from { opacity: 0.45; } to { opacity: 1; } }
    @keyframes aur-balance { from { transform: translateX(-14px); } to { transform: translateX(14px); } }
  </style>
  <defs>
    <!-- dégradés de la bande haute (droite → gauche) et de la bande basse (gauche → droite) -->
    <linearGradient id="aur-g-haut" gradientUnits="userSpaceOnUse" x1="800" y1="150" x2="120" y2="820">
      <stop offset="0"    class="s-violet-fort"/>
      <stop offset="0.30" class="s-violet"/>
      <stop offset="0.55" class="s-bleu"/>
      <stop offset="0.80" class="s-teal"/>
      <stop offset="1"    class="s-teal-clair"/>
    </linearGradient>
    <linearGradient id="aur-g-bas" gradientUnits="userSpaceOnUse" x1="120" y1="820" x2="880" y2="1120">
      <stop offset="0"    class="s-teal-clair"/>
      <stop offset="0.35" class="s-teal"/>
      <stop offset="0.65" class="s-bleu-fort"/>
      <stop offset="1"    class="s-violet"/>
    </linearGradient>
    <!-- piliers verticaux : ils s'éteignent vers le haut -->
    <linearGradient id="aur-g-pilier-teal" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="700">
      <stop offset="0"    class="s-teal-clair" stop-opacity="0"/>
      <stop offset="0.25" class="s-teal-clair" stop-opacity="0.95"/>
      <stop offset="1"    class="s-coeur" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="aur-g-pilier-violet" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="520">
      <stop offset="0"    class="s-violet" stop-opacity="0"/>
      <stop offset="0.4"  class="s-violet-fort" stop-opacity="0.95"/>
      <stop offset="1"    class="s-violet" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="aur-g-pilier-bas" gradientUnits="userSpaceOnUse" x1="0" y1="820" x2="0" y2="1180">
      <stop offset="0"    class="s-violet" stop-opacity="0.9"/>
      <stop offset="0.6"  class="s-violet-fort" stop-opacity="0.7"/>
      <stop offset="1"    class="s-violet" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="aur-g-pilier-gauche" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="960">
      <stop offset="0"    class="s-bleu" stop-opacity="0"/>
      <stop offset="0.5"  class="s-bleu" stop-opacity="0.9"/>
      <stop offset="1"    class="s-violet" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="aur-g-brume" gradientUnits="userSpaceOnUse" x1="0" y1="1170" x2="0" y2="1300">
      <stop offset="0"   class="s-brume" stop-opacity="0"/>
      <stop offset="1"   class="s-brume" stop-opacity="0.85"/>
    </linearGradient>

    <!-- LA MATIÈRE : flou, puis chaque lamelle glisse verticalement de sa
         propre valeur (la carte en gris) — c'est ce qui fait les marches. -->
    <filter id="aur-lamelles-glissees" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="flou"/>
      <feImage href="${carteUri}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none" result="carte"/>
      <feDisplacementMap in="flou" in2="carte" scale="${AMPL}" xChannelSelector="R" yChannelSelector="G" result="net"/>
      <!-- la traîne : chaque lamelle file verticalement, comme dans l'image -->
      <feGaussianBlur in="net" stdDeviation="0 60" result="traine"/>
      <feComponentTransfer in="traine" result="traine-douce"><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
      <feMerge><feMergeNode in="traine-douce"/><feMergeNode in="net"/></feMerge>
    </filter>
    <filter id="aur-flou-doux" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
    <filter id="aur-flou-coeur" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <feGaussianBlur stdDeviation="16"/>
    </filter>

    <!-- LES LAMELLES : une opacité par lamelle, trois familles qui respirent -->
    <mask id="aur-masque-lamelles" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      ${masque}
    </mask>
    ${masquesFamilles}

    <!-- LE DESSIN LISSE — avant flou, glissement et lamelles -->
    <g id="aur-dessin">
      <!-- halo doux derrière tout -->
      <g filter="url(#aur-flou-doux)" opacity="0.55">
        <ellipse cx="640" cy="330" rx="260" ry="240" fill="url(#aur-g-pilier-violet)"/>
        <ellipse cx="230" cy="760" rx="220" ry="200" fill="url(#aur-g-pilier-gauche)"/>
      </g>
      <!-- piliers -->
      <rect x="470" y="80"  width="120" height="560" fill="url(#aur-g-pilier-teal)"/>
      <rect x="690" y="80"  width="200" height="450" fill="url(#aur-g-pilier-violet)"/>
      <rect x="80"  y="560" width="230" height="400" fill="url(#aur-g-pilier-gauche)"/>
      <rect x="690" y="820" width="200" height="360" fill="url(#aur-g-pilier-bas)"/>
      <!-- la bande haute : de la droite vers le bas-gauche -->
      <path d="M 790 130 C 730 380, 580 540, 390 620 C 250 680, 150 760, 140 850"
            fill="none" stroke="url(#aur-g-haut)" stroke-width="290" stroke-linecap="round"/>
      <!-- la bande basse : de la gauche vers le bas-droite -->
      <path d="M 135 800 C 180 910, 360 950, 540 930 C 700 912, 800 980, 850 1100"
            fill="none" stroke="url(#aur-g-bas)" stroke-width="230" stroke-linecap="round"/>
    </g>
    <!-- le cœur clair, sur la courbe intérieure du S — à part : il pulse seul -->
    <g id="aur-coeur" filter="url(#aur-flou-coeur)"><path class="aur-coeur-trait" d="M 610 330 C 550 560, 430 680, 340 770 C 400 860, 570 905, 700 980 C 770 1020, 815 1060, 840 1105"
            fill="none" stroke="var(--aur-coeur)" stroke-width="70" stroke-linecap="round"/></g>

    <!-- LES MONTAGNES — facettes plates, arête claire -->
    <g id="aur-montagnes">
      <!-- massif de gauche : une pente longue, deux sommets, l'arête enneigée -->
      <polygon class="f-mont" points="0,1300 55,1235 115,1172 168,1128 215,1075 250,1112 288,1136 330,1192 372,1160 412,1204 462,1250 522,1300"/>
      <polygon class="f-mont-ombre" points="215,1075 250,1112 288,1136 330,1192 318,1300 232,1300 236,1172"/>
      <polygon class="f-mont-ombre-2" points="250,1112 288,1136 330,1192 322,1300 275,1300"/>
      <polygon class="f-mont-ombre" points="372,1160 412,1204 462,1250 522,1300 430,1300"/>
      <polygon class="f-mont-ombre-2" points="55,1235 115,1172 150,1300 80,1300"/>
      <polygon class="f-mont-arete" points="168,1128 215,1075 236,1172 212,1300 182,1300"/>
      <polygon class="f-mont-arete" points="330,1192 372,1160 384,1300 350,1300"/>
      <!-- chaîne de droite : basse, plus lointaine -->
      <polygon class="f-mont" points="540,1300 615,1255 695,1264 758,1216 820,1198 862,1180 902,1228 960,1282 1000,1300"/>
      <polygon class="f-mont-ombre" points="820,1198 862,1180 902,1228 960,1282 1000,1300 878,1300 848,1252"/>
      <polygon class="f-mont-ombre-2" points="862,1180 902,1228 906,1300 872,1300"/>
      <polygon class="f-mont-ombre" points="615,1255 695,1264 688,1300 642,1300"/>
      <polygon class="f-mont-arete" points="758,1216 820,1198 848,1252 812,1300 778,1300"/>
      <!-- butte du milieu -->
      <polygon class="f-mont" points="560,1300 615,1262 675,1300"/>
      <polygon class="f-mont-ombre" points="615,1262 675,1300 640,1300"/>
    </g>
  </defs>

  <!-- ══ L'AURORE : dessin → flou + glissement par lamelle → masque des lamelles ══ -->
  <g class="aur-corps" mask="url(#aur-masque-lamelles)">
    <g filter="url(#aur-lamelles-glissees)"><use href="#aur-dessin"/><use href="#aur-coeur"/></g>
  </g>

  <!-- ══ LES MONTAGNES, puis la brume à leur pied ══ -->
  <use href="#aur-montagnes"/>
  <rect x="0" y="1170" width="${W}" height="130" fill="url(#aur-g-brume)"/>
</svg>
`

/* ── LA VERSION EN COUCHES : un fragment HTML. Les définitions dans un
   premier <svg> invisible ; puis cinq <svg> empilés —
   trois familles de lamelles, le cœur, les montagnes (plus d'eau ni de reflet : décision d'Auteur, 25 août). Chaque couche est
   filtrée une fois au chargement ; l'animation porte sur les couches. ── */
/* preserveAspectRatio « slice » : posée dans un cadre d'un autre format, la
   couche couvre le cadre comme une image en object-fit: cover */
const couche = (classe, contenu) => `  <svg class="aurore aur-couche ${classe}" viewBox="0 0 ${W} ${HV}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${contenu}</svg>`
const fragment = `<div class="aurore-cadre" aria-hidden="true">
  <!-- AURORE BORÉALE en couches — générée par gen-aurore.mjs (graine ${seed}). Couleurs : aucune valeur ici. -->
  <svg class="aurore aur-defs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${HV}" aria-hidden="true" focusable="false">
  <style>
    /* LES CRANS DE L'AURORE — posés là où vivent les jetons du thème (la
       racine et tout élément data-theme), pour que l'illustration suive
       le thème le plus proche, exactement comme un rôle du kit. Mêmes
       clartés que la gamme 50–950 de kit/derivation.mjs ; le chroma est
       rapporté à celui du cran d'accueil de la charte (600 pour primary,
       500 pour accent). */
    :root, [data-theme="light"], [data-theme="dark"] {
      --aur-src-p:  var(--primary, #4F46E5);
      --aur-src-a:  var(--accent, #0791B2);
      --aur-src-bg: var(--bg, #FFFFFF);
      --aur-ka: 0.204;
      --aur-p50: oklch(from var(--aur-src-p) 0.962 calc(c * 0.018 / var(--aur-kp)) h);
      --aur-p100: oklch(from var(--aur-src-p) 0.930 calc(c * 0.033 / var(--aur-kp)) h);
      --aur-p200: oklch(from var(--aur-src-p) 0.870 calc(c * 0.062 / var(--aur-kp)) h);
      --aur-p300: oklch(from var(--aur-src-p) 0.785 calc(c * 0.104 / var(--aur-kp)) h);
      --aur-p400: oklch(from var(--aur-src-p) 0.680 calc(c * 0.158 / var(--aur-kp)) h);
      --aur-p500: oklch(from var(--aur-src-p) 0.585 calc(c * 0.204 / var(--aur-kp)) h);
      --aur-p600: oklch(from var(--aur-src-p) 0.511 calc(c * 0.230 / var(--aur-kp)) h);
      --aur-p800: oklch(from var(--aur-src-p) 0.398 calc(c * 0.177 / var(--aur-kp)) h);
      --aur-p900: oklch(from var(--aur-src-p) 0.359 calc(c * 0.135 / var(--aur-kp)) h);
      --aur-p950: oklch(from var(--aur-src-p) 0.257 calc(c * 0.086 / var(--aur-kp)) h);
      --aur-a100: oklch(from var(--aur-src-a) 0.930 calc(c * 0.033 / var(--aur-ka)) h);
      --aur-a200: oklch(from var(--aur-src-a) 0.870 calc(c * 0.062 / var(--aur-ka)) h);
      --aur-a300: oklch(from var(--aur-src-a) 0.785 calc(c * 0.104 / var(--aur-ka)) h);
      --aur-a400: oklch(from var(--aur-src-a) 0.680 calc(c * 0.158 / var(--aur-ka)) h);
      --aur-a500: oklch(from var(--aur-src-a) 0.585 calc(c * 0.204 / var(--aur-ka)) h);
    }
    /* thème clair : jour, pastel sur fond blanc */
    :root, [data-theme="light"] {
      --aur-kp: 0.230; /* le chroma du cran d'accueil : 600 pour primary (charte) */
      --aur-violet:       var(--aur-p400);
      --aur-violet-fort:  var(--aur-p500);
      --aur-bleu:         color-mix(in oklch, var(--aur-p400), var(--aur-a400));
      --aur-bleu-fort:    color-mix(in oklch, var(--aur-p500), var(--aur-a500));
      --aur-teal:         var(--aur-a400);
      --aur-teal-clair:   var(--aur-a300);
      --aur-coeur:        var(--aur-a100);
      --aur-mont:         color-mix(in oklch, var(--aur-p100) 60%, var(--aur-src-bg));
      --aur-mont-ombre:   color-mix(in oklch, var(--aur-p200) 75%, var(--aur-src-bg));
      --aur-mont-ombre-2: color-mix(in oklch, var(--aur-p300) 55%, var(--aur-src-bg));
      --aur-mont-arete:   var(--aur-src-bg);
      --aur-brume:        var(--aur-src-bg);
      --aur-force: 0.92;      /* opacité d'ensemble de l'aurore */
    }
    /* thème sombre : nuit, l'aurore brille, les montagnes s'assombrissent */
    [data-theme="dark"] {
      --aur-kp: 0.158; /* en sombre, primary est posée sur le cran 400 */
      --aur-violet:       var(--aur-p500);
      --aur-violet-fort:  var(--aur-p600);
      --aur-bleu:         color-mix(in oklch, var(--aur-p500), var(--aur-a500));
      --aur-bleu-fort:    color-mix(in oklch, var(--aur-p400), var(--aur-a400));
      --aur-teal:         var(--aur-a400);
      --aur-teal-clair:   var(--aur-a300);
      --aur-coeur:        var(--aur-a200);
      --aur-mont:         var(--aur-p950);
      --aur-mont-ombre:   color-mix(in oklch, var(--aur-p950), var(--aur-src-bg));
      --aur-mont-ombre-2: var(--aur-p900);
      --aur-mont-arete:   var(--aur-p800);
      --aur-brume:        var(--aur-src-bg);
      --aur-force: 1;
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
      --aur-kp: 0.158; /* en sombre, primary est posée sur le cran 400 */
        --aur-violet:       var(--aur-p500);
        --aur-violet-fort:  var(--aur-p600);
        --aur-bleu:         color-mix(in oklch, var(--aur-p500), var(--aur-a500));
        --aur-bleu-fort:    color-mix(in oklch, var(--aur-p400), var(--aur-a400));
        --aur-teal:         var(--aur-a400);
        --aur-teal-clair:   var(--aur-a300);
        --aur-coeur:        var(--aur-a200);
        --aur-mont:         var(--aur-p950);
        --aur-mont-ombre:   color-mix(in oklch, var(--aur-p950), var(--aur-src-bg));
        --aur-mont-ombre-2: var(--aur-p900);
        --aur-mont-arete:   var(--aur-p800);
        --aur-brume:        var(--aur-src-bg);
        --aur-force: 1;
      }
    }
    .aurore .s-violet      { stop-color: var(--aur-violet); }
    .aurore .s-violet-fort { stop-color: var(--aur-violet-fort); }
    .aurore .s-bleu        { stop-color: var(--aur-bleu); }
    .aurore .s-bleu-fort   { stop-color: var(--aur-bleu-fort); }
    .aurore .s-teal        { stop-color: var(--aur-teal); }
    .aurore .s-teal-clair  { stop-color: var(--aur-teal-clair); }
    .aurore .s-coeur       { stop-color: var(--aur-coeur); }
    .aurore .s-brume       { stop-color: var(--aur-brume); }
    .aurore .f-mont        { fill: var(--aur-mont); }
    .aurore .f-mont-ombre  { fill: var(--aur-mont-ombre); }
    .aurore .f-mont-ombre-2{ fill: var(--aur-mont-ombre-2); }
    .aurore .f-mont-arete  { fill: var(--aur-mont-arete); }
    .aurore .aur-corps     { opacity: var(--aur-force); }
    /* LA VERSION EN COUCHES : l'animation ne touche qu'à l'opacité et au
       glissement de couches entières (des éléments svg empilés) — le navigateur
       les compose sur la carte graphique sans recalculer les filtres.
       Coupé si l'utilisateur a demandé moins d'animations. */
    .aurore-cadre { position: relative; aspect-ratio: ${W} / ${HV}; overflow: hidden; }
    .aurore-cadre .aur-defs { position: absolute; width: 0; height: 0; overflow: hidden; }
    .aurore-cadre .aur-couche { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
    /* cadrage « ciel » : l'aurore seule, entière, sans les montagnes — pour
       une tuile d'un autre format (le composant pose aussi viewBox et
       preserveAspectRatio « meet » sur les couches) */
    .aurore-ciel .aur-couche-montagnes { display: none; }
    @media (prefers-reduced-motion: no-preference) {
      .aurore-cadre .aur-couche-1 { will-change: opacity, transform; animation: aur-frem 4.2s ease-in-out infinite alternate, aur-balance 13s ease-in-out infinite alternate; }
      .aurore-cadre .aur-couche-2 { will-change: opacity, transform; animation: aur-frem 5.6s ease-in-out -2s infinite alternate, aur-balance 13s ease-in-out -4s infinite alternate; }
      .aurore-cadre .aur-couche-3 { will-change: opacity, transform; animation: aur-frem 7.1s ease-in-out -4s infinite alternate, aur-balance 13s ease-in-out -8s infinite alternate; }
      .aurore-cadre .aur-couche-coeur { will-change: opacity; animation: aur-souffle 5s ease-in-out infinite alternate; }
    }
    @keyframes aur-frem { from { opacity: 0.3; } to { opacity: 1; } }
    @keyframes aur-souffle { from { opacity: 0.45; } to { opacity: 1; } }
    @keyframes aur-balance { from { transform: translateX(-1.4%); } to { transform: translateX(1.4%); } }
  </style>
  <defs>
    <!-- dégradés de la bande haute (droite → gauche) et de la bande basse (gauche → droite) -->
    <linearGradient id="aur-g-haut" gradientUnits="userSpaceOnUse" x1="800" y1="150" x2="120" y2="820">
      <stop offset="0"    class="s-violet-fort"/>
      <stop offset="0.30" class="s-violet"/>
      <stop offset="0.55" class="s-bleu"/>
      <stop offset="0.80" class="s-teal"/>
      <stop offset="1"    class="s-teal-clair"/>
    </linearGradient>
    <linearGradient id="aur-g-bas" gradientUnits="userSpaceOnUse" x1="120" y1="820" x2="880" y2="1120">
      <stop offset="0"    class="s-teal-clair"/>
      <stop offset="0.35" class="s-teal"/>
      <stop offset="0.65" class="s-bleu-fort"/>
      <stop offset="1"    class="s-violet"/>
    </linearGradient>
    <!-- piliers verticaux : ils s'éteignent vers le haut -->
    <linearGradient id="aur-g-pilier-teal" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="700">
      <stop offset="0"    class="s-teal-clair" stop-opacity="0"/>
      <stop offset="0.25" class="s-teal-clair" stop-opacity="0.95"/>
      <stop offset="1"    class="s-coeur" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="aur-g-pilier-violet" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="520">
      <stop offset="0"    class="s-violet" stop-opacity="0"/>
      <stop offset="0.4"  class="s-violet-fort" stop-opacity="0.95"/>
      <stop offset="1"    class="s-violet" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="aur-g-pilier-bas" gradientUnits="userSpaceOnUse" x1="0" y1="820" x2="0" y2="1180">
      <stop offset="0"    class="s-violet" stop-opacity="0.9"/>
      <stop offset="0.6"  class="s-violet-fort" stop-opacity="0.7"/>
      <stop offset="1"    class="s-violet" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="aur-g-pilier-gauche" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="960">
      <stop offset="0"    class="s-bleu" stop-opacity="0"/>
      <stop offset="0.5"  class="s-bleu" stop-opacity="0.9"/>
      <stop offset="1"    class="s-violet" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="aur-g-brume" gradientUnits="userSpaceOnUse" x1="0" y1="1170" x2="0" y2="1300">
      <stop offset="0"   class="s-brume" stop-opacity="0"/>
      <stop offset="1"   class="s-brume" stop-opacity="0.85"/>
    </linearGradient>

    <!-- LA MATIÈRE : flou, puis chaque lamelle glisse verticalement de sa
         propre valeur (la carte en gris) — c'est ce qui fait les marches. -->
    <filter id="aur-lamelles-glissees" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="flou"/>
      <feImage href="${carteUri}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none" result="carte"/>
      <feDisplacementMap in="flou" in2="carte" scale="${AMPL}" xChannelSelector="R" yChannelSelector="G" result="net"/>
      <!-- la traîne : chaque lamelle file verticalement, comme dans l'image -->
      <feGaussianBlur in="net" stdDeviation="0 60" result="traine"/>
      <feComponentTransfer in="traine" result="traine-douce"><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
      <feMerge><feMergeNode in="traine-douce"/><feMergeNode in="net"/></feMerge>
    </filter>
    <filter id="aur-flou-doux" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
    <filter id="aur-flou-coeur" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <feGaussianBlur stdDeviation="16"/>
    </filter>

    <!-- LES LAMELLES : une opacité par lamelle, trois familles qui respirent -->
    <mask id="aur-masque-lamelles" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      ${masque}
    </mask>
    ${masquesFamilles}

    <!-- LE DESSIN LISSE — avant flou, glissement et lamelles -->
    <g id="aur-dessin">
      <!-- halo doux derrière tout -->
      <g filter="url(#aur-flou-doux)" opacity="0.55">
        <ellipse cx="640" cy="330" rx="260" ry="240" fill="url(#aur-g-pilier-violet)"/>
        <ellipse cx="230" cy="760" rx="220" ry="200" fill="url(#aur-g-pilier-gauche)"/>
      </g>
      <!-- piliers -->
      <rect x="470" y="80"  width="120" height="560" fill="url(#aur-g-pilier-teal)"/>
      <rect x="690" y="80"  width="200" height="450" fill="url(#aur-g-pilier-violet)"/>
      <rect x="80"  y="560" width="230" height="400" fill="url(#aur-g-pilier-gauche)"/>
      <rect x="690" y="820" width="200" height="360" fill="url(#aur-g-pilier-bas)"/>
      <!-- la bande haute : de la droite vers le bas-gauche -->
      <path d="M 790 130 C 730 380, 580 540, 390 620 C 250 680, 150 760, 140 850"
            fill="none" stroke="url(#aur-g-haut)" stroke-width="290" stroke-linecap="round"/>
      <!-- la bande basse : de la gauche vers le bas-droite -->
      <path d="M 135 800 C 180 910, 360 950, 540 930 C 700 912, 800 980, 850 1100"
            fill="none" stroke="url(#aur-g-bas)" stroke-width="230" stroke-linecap="round"/>
    </g>
    <!-- le cœur clair, sur la courbe intérieure du S — à part : il pulse seul -->
    <g id="aur-coeur" filter="url(#aur-flou-coeur)"><path class="aur-coeur-trait" d="M 610 330 C 550 560, 430 680, 340 770 C 400 860, 570 905, 700 980 C 770 1020, 815 1060, 840 1105"
            fill="none" stroke="var(--aur-coeur)" stroke-width="70" stroke-linecap="round"/></g>

    <!-- LES MONTAGNES — facettes plates, arête claire -->
    <g id="aur-montagnes">
      <!-- massif de gauche : une pente longue, deux sommets, l'arête enneigée -->
      <polygon class="f-mont" points="0,1300 55,1235 115,1172 168,1128 215,1075 250,1112 288,1136 330,1192 372,1160 412,1204 462,1250 522,1300"/>
      <polygon class="f-mont-ombre" points="215,1075 250,1112 288,1136 330,1192 318,1300 232,1300 236,1172"/>
      <polygon class="f-mont-ombre-2" points="250,1112 288,1136 330,1192 322,1300 275,1300"/>
      <polygon class="f-mont-ombre" points="372,1160 412,1204 462,1250 522,1300 430,1300"/>
      <polygon class="f-mont-ombre-2" points="55,1235 115,1172 150,1300 80,1300"/>
      <polygon class="f-mont-arete" points="168,1128 215,1075 236,1172 212,1300 182,1300"/>
      <polygon class="f-mont-arete" points="330,1192 372,1160 384,1300 350,1300"/>
      <!-- chaîne de droite : basse, plus lointaine -->
      <polygon class="f-mont" points="540,1300 615,1255 695,1264 758,1216 820,1198 862,1180 902,1228 960,1282 1000,1300"/>
      <polygon class="f-mont-ombre" points="820,1198 862,1180 902,1228 960,1282 1000,1300 878,1300 848,1252"/>
      <polygon class="f-mont-ombre-2" points="862,1180 902,1228 906,1300 872,1300"/>
      <polygon class="f-mont-ombre" points="615,1255 695,1264 688,1300 642,1300"/>
      <polygon class="f-mont-arete" points="758,1216 820,1198 848,1252 812,1300 778,1300"/>
      <!-- butte du milieu -->
      <polygon class="f-mont" points="560,1300 615,1262 675,1300"/>
      <polygon class="f-mont-ombre" points="615,1262 675,1300 640,1300"/>
    </g>
  </defs>
  </svg>
${couche('aur-couche-1', `<g class="aur-corps" mask="url(#aur-masque-lam-1)"><use href="#aur-dessin" filter="url(#aur-lamelles-glissees)"/></g>`)}
${couche('aur-couche-2', `<g class="aur-corps" mask="url(#aur-masque-lam-2)"><use href="#aur-dessin" filter="url(#aur-lamelles-glissees)"/></g>`)}
${couche('aur-couche-3', `<g class="aur-corps" mask="url(#aur-masque-lam-3)"><use href="#aur-dessin" filter="url(#aur-lamelles-glissees)"/></g>`)}
${couche('aur-couche-coeur', `<g class="aur-corps" mask="url(#aur-masque-lamelles)"><use href="#aur-coeur" filter="url(#aur-lamelles-glissees)"/></g>`)}
${couche('aur-couche-montagnes', `<use href="#aur-montagnes"/><rect x="0" y="1170" width="${W}" height="130" fill="url(#aur-g-brume)"/>`)}
</div>
`
import('node:fs').then(async ({ writeFileSync, mkdirSync }) => {
  const { dirname, join } = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const ici = dirname(fileURLToPath(import.meta.url))
  writeFileSync(join(ici, 'aurore-boreale.svg'), svgSeul)
  writeFileSync(join(ici, 'aurore-boreale.html'), fragment)
  /* le module consommé par le kit : le fragment, tel quel, dans une chaîne */
  const appDir = join(ici, '..', 'app')
  const versTs = `/* GÉNÉRÉ par kit/aurore/gen-aurore.mjs — ne pas éditer à la main.
   L'aurore en couches (voir kit/aurore/) ; posée par <Aurore> (kit/app/aurore.tsx). */
export const AURORE_HTML = ${JSON.stringify(fragment)}
`
  try { mkdirSync(appDir, { recursive: true }); writeFileSync(join(appDir, 'aurore-boreale.ts'), versTs) } catch (e) { console.error('kit/app/aurore-boreale.ts non écrit :', e.message) }
  console.log('aurore-boreale.svg', svgSeul.length, '· aurore-boreale.html', fragment.length, '· app/aurore-boreale.ts')
})
