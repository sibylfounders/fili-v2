/* LE MOTEUR DU KIT — kit/derivation.mjs
   Deux moteurs dans un fichier, quatre décisions d'entrée en tout :
   · LA COULEUR — primary, et toute la famille se calcule (première moitié).
   · LE RYTHME — base, intervalle, racine des coins (+ l'intervalle des
     titres), et tout le registre se calcule : marges, espaces, coins, bouton,
     texte, cibles, densités, crans de page. Seconde moitié, à partir de
     « LE MOTEUR DU RYTHME ». Les huit décisions du 25 août 2026 y sont les
     lois ; le crash-test kit/derivation.test.mjs les rejoue une à une.

   Régénérer les jetons : node kit/tokens.ecrire.mjs   (tokens.css · Tailwind · Figma)
                          --css, --tailwind, --figma, --rythme : la même chose, à l'écran

   ───────────────────────────────────────────────────────────────────────
   LE MOTEUR DE LA FAMILLE COULEUR
   Une seule décision d'entrée : primary. Tout le reste se calcule.

   Porté du moteur du témoin (temoin/tools/fili/expression/couleur.mjs +
   palette.mjs — déterministe, sans dépendance, OKLCH : le seul espace où
   faire varier la clarté ne fait pas dériver la teinte), et CALIBRÉ SUR LA
   CHARTE DE CONCEPTION FILI (docs/charte/filicharte_6.html) : à la primaire
   de la charte (#4F46E5), la dérivation reproduit ses valeurs.

   Les règles du calcul :
   · NEUTRES — clartés et chromas de la charte, teinte = celle de primary :
     teinter un neutre à luminance quasi constante est gratuit (C15).
   · MARQUE — primary est la décision, et reste ENTIÈRE : l'aplat d'action
     porte la couleur saisie telle quelle, son texte on-primary est CHERCHÉ
     du côté qui tient (noir sur une marque claire, blanc sur une sombre).
     Seul primary-text — le lien, du texte posé sur les fonds — est calé
     AA quand la marque ne tient pas 4,5:1 : on assombrit le lien, jamais
     la marque. hover, subtle et leurs textes sont des ancres de clarté et
     de chroma posées par la charte, à la teinte de primary (C7).
   · ACCENT — un CHOIX D'AUTEUR, pas une dérivation (décision d'Auteur,
     2026-08-30) : la voix graphique de la marque — illustrations, animations
     complexes, blocs marketing, graphiques — se choisit à l'œil (Coolors ou
     autre) et entre SOUVERAINE : jamais calée, jamais recalée, la valeur
     saisie fait foi dans les deux thèmes. Territoire marketing, disjoint du
     fonctionnel : l'accent peut approcher un ton sémantique, ils ne vivent
     jamais au même endroit. À la charte, l'accent d'auteur est ACCENT_AUTEUR
     (#75E242). Sans choix d'auteur (theming par primary seule), repli :
     l'écart de charte (−55°), calé 3:1, garde achromatique — l'ancien calcul.
   · FOCUS — le HALO (décision d'Auteur sur pièce Figma, 2026-08-31, qui
     révise la forme de C18) : une bande pâle de la famille de l'objet,
     collée à lui, fermée par un trait fin. La bande est le fond doux de la
     famille (primary-subtle, danger-subtle, surface) — aucun jeton neuf.
     Le TRAIT est le cran le MOINS SOUTENU de la famille qui tient encore
     3:1 sur bg et surface (le plus clair en clair, le plus sombre en
     sombre) : c'est l'indicateur au sens de la norme, il est sous contrat.
     Le halo ne se montre qu'au clavier — le clic ne montre rien (verdict
     d'Auteur du 31 août, sur le site : essayés puis retirés, les traits
     pâles du clic n'ont plus de consommateur, donc plus de jeton, C4).
     Trois familles de halo : marque (focus-ring), rouge (focus-ring-danger),
     neutre (focus-ring-neutral = border-strong, déjà sous contrat).
     L'accent n'y touche pas.
   · SÉMANTIQUE — chaque état garde sa teinte de charte ; quand primary
     bouge, le déplacement le tire d'UN QUART, borné à ±12° — l'adaptation
     est légère, pas plus (décision d'Auteur du 27 août portée à moitié /
     30°, RÉVISÉE sur pièce le 30 août, COLOR-UX 2.8.0 : à ce régime les
     couleurs système ne jouaient plus leur rôle — un avertissement vert
     n'avertit plus) : un rouge reste un rouge, il devient le rouge de
     cette famille-là (C3). Sa vivacité ne suit pas.
   · CALAGE — toute paire déclarée sous son seuil est recalée par recherche
     de clarté, jamais laissée en dessous (C7, C9) — la règle de la charte
     (« assombries d'un cran ou deux ; aucune n'a changé de famille »),
     mécanisée. La conformité AA n'est pas vérifiée après coup : elle est
     obtenue par construction.

   Régénérer les jetons : node kit/derivation.mjs --css > (bloc tokens.css)
   Vérifier une primaire :  node kit/derivation.mjs "#0E7C5B"            */

const versLineaire = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const versSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

export function hexVersRgb(hex) {
  const n = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
}
export function rgbVersHex([r, g, b]) {
  const q = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')
  return `#${q(r)}${q(g)}${q(b)}`.toUpperCase()
}
export function rgbVersOklab([R, G, B]) {
  const r = versLineaire(R), g = versLineaire(G), b = versLineaire(B)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ]
}
export function oklabVersRgb([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
  return [
    versSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    versSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    versSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ]
}
export const oklabVersLch = ([L, a, b]) => [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360]
export const lchVersOklab = ([L, C, H]) => [L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180)]
export const hexVersLch = (hex) => oklabVersLch(rgbVersOklab(hexVersRgb(hex)))

/* Hors gamut, on réduit la chroma jusqu'à rentrer : la clarté et la teinte
   sont ce qu'on a décidé, la saturation est ce qu'on peut se permettre. */
export function lchVersHex([L, C, H]) {
  let c = C
  for (let i = 0; i < 64; i++) {
    const rgb = oklabVersRgb(lchVersOklab([L, c, H]))
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return rgbVersHex(rgb)
    c *= 0.96
  }
  return rgbVersHex(oklabVersRgb(lchVersOklab([L, 0, H])))
}

const canal = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
export function luminance(hex) {
  const [r, g, b] = hexVersRgb(hex).map(canal)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contraste(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/* La partenaire : on fait varier la clarté, à teinte et chroma constantes,
   jusqu'au seuil. Une paire n'est pas deux couleurs choisies puis mesurées :
   c'est une couleur choisie et sa partenaire calculée pour elle. */
export function partenaire(fond, [C, H], cible, { versLeBas = true } = {}) {
  let lo = 0, hi = 1, meilleur = versLeBas ? '#000000' : '#FFFFFF'
  for (let i = 0; i < 40; i++) {
    const L = (lo + hi) / 2
    const hex = lchVersHex([L, C, H])
    if (contraste(hex, fond) >= cible) { meilleur = hex; if (versLeBas) lo = L; else hi = L }
    else if (versLeBas) hi = L; else lo = L
  }
  return meilleur
}
/* Le côté le plus lisible : teinté d'abord, pur ensuite, l'autre côté enfin. */
function surCouleur(fond, [C, H], cible, prefere = 'clair') {
  const clairs = [lchVersHex([0.985, Math.min(C, 0.02), H]), '#FFFFFF']
  const sombres = [lchVersHex([0.145, Math.min(C, 0.03), H]), '#000000']
  const ordre = prefere === 'clair' ? [...clairs, ...sombres] : [...sombres, ...clairs]
  /* Une encre teintée n'est retenue que si elle tient la cible AVEC de la
     marge. Au milieu de clarté (cas limite d'Auré, 24 août : ocre, canard,
     olive…), tout passe de justesse — et une encre teintée de la même
     famille se noie dans l'aplat qu'elle doit dominer. Sans marge, l'encre
     devient PURE : le noir ou le blanc franc, le côté qui contraste le
     plus. Le contrat 4,5:1 reste tenu — le pur contraste toujours au moins
     autant que le teinté de son côté. */
  const marge = 1.3
  for (const hex of ordre) if (contraste(hex, fond) >= cible * marge) return hex
  return contraste('#000000', fond) >= contraste('#FFFFFF', fond) ? '#000000' : '#FFFFFF'
}
/* Une valeur ancrée, recalée si une de ses paires ne tient pas son seuil —
   contre TOUS ses fonds : la contrainte la plus dure gagne. */
function cale(hex, fonds, cible, [C, H], { versLeBas = true } = {}) {
  let retenu = hex
  for (let passe = 0; passe < 2; passe++)
    for (const f of fonds)
      if (contraste(retenu, f) < cible) retenu = partenaire(f, [C, H], cible, { versLeBas })
  return retenu
}

export const PRIMAIRE_DEFAUT = '#4F46E5'
/* L'accent d'auteur de la charte — choisi à la main (décision d'Auteur,
   2026-08-30, journal #131). Une valeur souveraine : le moteur ne la
   retouche jamais. */
export const ACCENT_AUTEUR = '#75E242'
/* Les états et le déplacement de la marque — décision du 27 août 2026,
   révisée sur pièce le 30 août (COLOR-UX 2.8.0) : l'adaptation est légère. */
export const PART_ETATS = 0.25
export const PLAFOND_ETATS = 12
const H0 = hexVersLch(PRIMAIRE_DEFAUT)[2] /* la teinte de la charte : l'origine du calibrage */
/* L'arc le plus court, replié sur [−180, +180[. Corrigé le 27 août 2026 :
   en JavaScript le reste d'un nombre négatif reste négatif, et l'écriture
   d'avant (`((vers - de + 180) % 360) - 180`) rendait −229° au lieu de +131°
   pour toute marque de teinte inférieure à 97° — rouges, oranges, jaunes :
   le déplacement des états partait du mauvais côté. */
const ecartCourt = (de, vers) => ((((vers - de + 180) % 360) + 360) % 360) - 180

/* Deux décisions d'entrée : primary, et (optionnel) l'accent d'auteur.
   À la primaire de la charte, l'accent d'auteur s'applique par défaut ;
   passer null force le repli calculé. */
export function derive(primaire = PRIMAIRE_DEFAUT, accent = undefined) {
  const saisiePrimaire = rgbVersHex(hexVersRgb(primaire))
  if (accent === undefined && saisiePrimaire === PRIMAIRE_DEFAUT) accent = ACCENT_AUTEUR
  const [Lp, Cp, H] = hexVersLch(primaire)
  /* CAS LIMITE (question d'Auré, 24 août) : une primaire achromatique —
     noir, blanc, gris — n'a PAS de teinte. Son angle OKLCH retombe sur
     0° (côté rose) par accident d'atan2 : sans garde-fou, les neutres
     « teintés à la marque » rosissent et le déplacement des états tire
     vers nulle part. La présence mesure ce qu'il y a de teinte à suivre :
     nulle sous le gris, pleine dès que la couleur est franche — les
     chromas d'emprunt et le déplacement s'y proportionnent. */
  const presence = Math.min(1, Cp / 0.02)
  const teinte = (c) => c * presence /* un chroma emprunté à la marque */
  /* Les états suivent le DÉPLACEMENT de la primaire : un quart, borné ±12°
     (27 août : moitié / 30° ; révisé le 30 août sur pièce — l'adaptation
     est légère, ou le vocabulaire se déplace).
     À la primaire de la charte, l'écart est nul — reproduction exacte. */
  const suit = (hCharte) => {
    const tire = Math.max(-PLAFOND_ETATS, Math.min(PLAFOND_ETATS, ecartCourt(H0, H) * PART_ETATS)) * presence
    return (hCharte + tire + 360) % 360
  }

  const light = {}
  const dark = {}

  /* ── Neutres — teintés à la marque, clartés de la charte ── */
  light.bg = '#FFFFFF'
  light.surface = lchVersHex([0.967, teinte(0.003), H])
  light['surface-hover'] = lchVersHex([0.928, teinte(0.006), H])
  light.border = light['surface-hover']
  light['text-primary'] = lchVersHex([0.210, teinte(0.028), H])
  light['text-secondary'] = cale(lchVersHex([0.446, teinte(0.024), H]), [light.bg, light.surface], 4.5, [teinte(0.024), H])
  light['border-strong'] = cale(lchVersHex([0.551, teinte(0.022), H]), [light.bg, light.surface], 3, [teinte(0.022), H])
  /* text-tertiary — les petits textes indicatifs (kicker, fiches, légendes, pieds) : le gris le plus
     clair qui tienne encore 3:1 sur le fond le plus dur (le gris posé), cherché au seuil.
     EXCEPTION DÉCLARÉE (Arbitrage d'Auteur, 25 août : « limite côté lisibilité, mais ce sont des
     objets secondaires ») : jamais pour du texte lu, jamais sous le cran label. */
  light['text-tertiary'] = partenaire(light.surface, [teinte(0.022), H], 3, { versLeBas: true })

  dark.bg = lchVersHex([0.130, teinte(0.025), H])
  dark.surface = lchVersHex([0.210, teinte(0.030), H])
  dark['surface-hover'] = lchVersHex([0.278, teinte(0.028), H])
  dark.border = dark['surface-hover']
  dark['text-primary'] = '#FFFFFF'
  dark['text-secondary'] = cale(lchVersHex([0.714, teinte(0.019), H]), [dark.bg, dark.surface], 4.5, [teinte(0.019), H], { versLeBas: false })
  dark['border-strong'] = cale(lchVersHex([0.714, teinte(0.019), H]), [dark.bg, dark.surface], 3, [teinte(0.019), H], { versLeBas: false })
  dark['text-tertiary'] = partenaire(dark.surface, [teinte(0.019), H], 3, { versLeBas: false })

  /* ── Marque — la décision reste entière tant qu'elle porte son encre.
     ZONE MÉDIANE (Arbitrage d'Auteur, 24 août — tranché sur le nuancier
     à deux zones de Figma) : le côté de l'encre se choisit À L'ŒIL, à la
     clarté perceptuelle (OKLab, bascule à 0,67 — calibrée sur les marques témoins : le vert Spotify garde son encre noire, le violet réclame la blanche) — sur un violet moyen,
     l'œil veut du blanc, quoi qu'en dise la formule. Puis, si l'encre
     pure de ce côté ne tient pas 4,5:1 avec marge, l'aplat GLISSE à
     luminosité seule — « assombries d'un cran ou deux ; aucune n'a
     changé de famille », la règle de la charte rendue mécanique — et
     l'ajustement est dit (meta.aplatAjuste), jamais tu. ── */
  const saisie = rgbVersHex(hexVersRgb(primaire))
  const coteOeil = (hex) => (hexVersLch(hex)[0] >= 0.67 ? 'sombre' : 'clair') /* le côté que l'œil attend */
  const glisse = (hex, encreCote, cible = 4.5 * 1.12) => {
    const pur = encreCote === 'clair' ? '#FFFFFF' : '#000000'
    let retenu = hex
    let [La, Ca, Hc] = hexVersLch(hex)
    const pas = encreCote === 'clair' ? -0.008 : 0.008
    for (let i = 0; i < 80 && contraste(pur, retenu) < cible; i++) {
      La += pas
      retenu = lchVersHex([La, Ca, Hc])
    }
    return retenu
  }

  /* Le fond doux reste DOUX face à l'aplat : toujours nettement plus clair
     (à la primaire de la charte, il retombe sur elle) ; et si la marque est
     elle-même pastel, il devient un voile quasi blanc, désaturé — sinon les
     deux se confondent. */
  let Ls = Math.max(0.930, Math.min(0.975, Lp + 0.419))
  let Cs = Math.min(0.033, Cp)
  if (Lp > 0.86) { Ls = 0.978; Cs = Math.min(0.016, Cp * 0.3) }
  light['primary-subtle'] = lchVersHex([Ls, Cs, H])
  /* Côté de l'encre sur l'aplat clair (Arbitrage d'Auteur, 24 août :
     « sur tous les cas limites le blanc fonctionne mieux ») : le blanc
     d'abord. Le noir n'est retenu que s'il est CONFORTABLE (≥ 7,4:1 —
     échelle relevée d'un cran le 24 août, sur un violet clair encore noirci —
     les marques réellement claires : ambre, orange vif, vert Spotify).
     Toute la zone médiane prend l'encre blanche, et l'aplat glisse
     jusqu'à la porter. */
  const coteAplat = (hex) =>
    contraste('#FFFFFF', hex) >= 4.5 * 1.12 ? 'clair'
    : contraste('#000000', hex) >= 7.4 ? 'sombre'
    : 'clair'
  light.primary = glisse(saisie, coteAplat(saisie)) /* l'aplat : la saisie, glissée si l'encre ne tient pas */
  const La = hexVersLch(light.primary)[0]
  light['primary-hover'] = lchVersHex([La - 0.054, Cp, H])
  light['on-primary'] = surCouleur(light.primary, [teinte(0.02), H], 4.5, coteAplat(light.primary))
  light['primary-text'] = cale(saisie, [light.bg, light.surface, light['primary-subtle']], 4.5, [Cp, H])
  const Lt = hexVersLch(light['primary-text'])[0]
  light['primary-text-hover'] = cale(lchVersHex([Lt - 0.05, Cp, H]), [light.bg, light.surface], 4.5, [Cp, H])
  light['on-primary-subtle'] = cale(lchVersHex([0.398, Math.min(0.177, Cp), H]), [light['primary-subtle']], 4.5, [Math.min(0.177, Cp), H])

  dark['primary-subtle'] = lchVersHex([0.257, Math.min(0.086, Cp), H])
  dark.primary = Lp >= 0.62 ? saisie : lchVersHex([0.680, Cp, H]) /* une marque claire vit telle quelle en sombre */
  dark.primary = glisse(dark.primary, coteOeil(dark.primary))
  const Lb = hexVersLch(dark.primary)[0]
  dark['primary-hover'] = lchVersHex([Math.min(Lb + 0.08, 0.92), Cp * 0.66, H])
  dark['on-primary'] = surCouleur(dark.primary, [teinte(0.03), H], 4.5, coteOeil(dark.primary))
  dark['primary-text'] = cale(dark.primary, [dark.bg, dark.surface, dark['primary-subtle']], 4.5, [Cp, H], { versLeBas: false })
  const Ltd = hexVersLch(dark['primary-text'])[0]
  dark['primary-text-hover'] = cale(lchVersHex([Math.min(Ltd + 0.05, 0.95), Cp * 0.66, H]), [dark.bg, dark.surface], 4.5, [Cp * 0.66, H], { versLeBas: false })
  dark['on-primary-subtle'] = cale(lchVersHex([0.870, Math.min(0.062, Cp), H]), [dark['primary-subtle']], 4.5, [Math.min(0.062, Cp), H], { versLeBas: false })

  /* ── Accent — l'anneau de focus : l'écart de la charte, conservé ── */
  /* L'anneau de focus emprunte l'écart de teinte de la charte — mais une
     marque sans teinte n'a rien à prêter : l'anneau devient gris franc. */
  if (accent) {
    /* le choix d'auteur, tel quel — marketing, hors contrat fonctionnel */
    const va = rgbVersHex(hexVersRgb(accent))
    light.accent = va
    dark.accent = va
  } else {
    const Ha = (H - 55.3 + 360) % 360
    light.accent = cale(lchVersHex([0.609, teinte(0.111), Ha]), [light.bg, light.surface], 3, [teinte(0.111), Ha])
    dark.accent = cale(lchVersHex([0.609, teinte(0.111), Ha]), [dark.bg, dark.surface], 3, [teinte(0.111), Ha], { versLeBas: false })
  }

  /* (le focus se calcule après la sémantique : le halo rouge a besoin de danger) */

  /* ── Sémantique — ancres de la charte, tirées par le déplacement ── */
  /* Chaque facette garde SA teinte de charte (le doux du warning est jaune,
     son ton est brun) — toutes tirées par le même déplacement. */
  const ETATS = {
    danger:  { ton: [0.505, 0.190, 27.5],  doux: [0.936, 0.031, 17.7],  dTon: [0.711, 0.166, 22.2], dDoux: [0.258, 0.089, 26.0] },
    success: { ton: [0.527, 0.137, 150.1], doux: [0.962, 0.043, 156.7], dTon: [0.800, 0.182, 151.7], dDoux: [0.266, 0.063, 152.9] },
    warning: { ton: [0.473, 0.125, 46.2],  doux: [0.962, 0.058, 95.6],  dTon: [0.837, 0.164, 84.4], dDoux: [0.279, 0.074, 45.6] },
    info:    { ton: [0.488, 0.217, 264.4], doux: [0.932, 0.032, 255.6], dTon: [0.714, 0.143, 254.6], dDoux: [0.282, 0.087, 267.9] },
  }
  const pose = ([L, C, Hc]) => [L, C, suit(Hc)]
  for (const [nom, e] of Object.entries(ETATS)) {
    const ton = pose(e.ton), doux = pose(e.doux), dTon = pose(e.dTon), dDoux = pose(e.dDoux)
    light[`${nom}-subtle`] = lchVersHex(doux)
    light[nom] = cale(lchVersHex(ton), [light.bg, light[`${nom}-subtle`]], 4.5, [ton[1], ton[2]])
    light[`on-${nom}`] = surCouleur(light[nom], [0.02, ton[2]], 4.5, 'clair')
    dark[`${nom}-subtle`] = lchVersHex(dDoux)
    dark[nom] = cale(lchVersHex(dTon), [dark.surface, dark[`${nom}-subtle`]], 4.5, [dTon[1], dTon[2]], { versLeBas: false })
    dark[`on-${nom}`] = surCouleur(dark[nom], [0.03, dTon[2]], 4.5, 'sombre')
    /* l'encre sur le fond doux — même convention que on-primary-subtle.
       Pour une famille mono-tonale elle vaut le ton calé ; warning,
       bi-tonal, la redéfinit juste dessous. */
    light[`on-${nom}-subtle`] = light[nom]
    dark[`on-${nom}-subtle`] = dark[nom]
  }

  /* ── EXCEPTION DÉCLARÉE (Arbitrage d'Auteur, 24 août) : warning est
     JAUNE. Le calage le brunissait, parce qu'un jaune ne peut pas être
     une encre sur son fond doux jaune. On sépare donc les deux métiers :
     · warning (l'aplat) : le jaune fort — celui que le thème sombre
       porte déjà —, jamais calé : le jaune est l'intention.
     · on-warning : une encre sombre, mesurée sur ce jaune.
     · on-warning-subtle : l'encre brune calée qui ÉCRIT l'avertissement,
       sur le fond doux comme sur le blanc. */
  {
    const e = ETATS.warning
    const jaune = pose(e.dTon), brun = pose(e.ton)
    light['on-warning-subtle'] = cale(lchVersHex(brun), [light.bg, light['warning-subtle']], 4.5, [brun[1], brun[2]])
    light.warning = lchVersHex(jaune)
    light['on-warning'] = surCouleur(light.warning, [0.03, jaune[2]], 4.5, 'sombre')
    dark['on-warning-subtle'] = dark.warning /* en sombre, le jaune tient déjà comme encre */
  }

  /* ── Le halo de focus — trois familles, deux régimes (décision d'Auteur,
     2026-08-31, sur pièce : anneau-halo.html) ── */
  /* Le trait au clavier : le cran le moins soutenu de la famille qui tient
     3:1 sur bg ET surface — cherché en clarté, teinte et chroma de la
     couleur de départ. C'est l'indicateur de focus au sens de la norme. */
  const traitClavier = (depart, fonds, versLeClair) => {
    const [, C, Hd] = hexVersLch(depart)
    let lo = 0, hi = 1, meilleur = depart
    for (let i = 0; i < 40; i++) {
      const L = (lo + hi) / 2
      const hex = lchVersHex([L, C, Hd])
      if (fonds.every((fd) => contraste(hex, fd) >= 3)) { meilleur = hex; if (versLeClair) lo = L; else hi = L }
      else if (versLeClair) hi = L; else lo = L
    }
    return meilleur
  }
  light['focus-ring'] = traitClavier(light.primary, [light.bg, light.surface], true)
  dark['focus-ring'] = traitClavier(dark.primary, [dark.bg, dark.surface], false)
  light['focus-ring-danger'] = traitClavier(light.danger, [light.bg, light.surface], true)
  dark['focus-ring-danger'] = traitClavier(dark.danger, [dark.bg, dark.surface], false)
  light['focus-ring-neutral'] = light['border-strong']
  dark['focus-ring-neutral'] = dark['border-strong']
  /* ── Le panneau de code — jamais inversé (C12). Le fond n'est plus un
     noir posé à la main : c'est le cran 950 de la gamme de la primaire
     (demande d'Auteur, 24 août), le texte son cran 200, et quatre encres
     de syntaxe — commentaire neutre, chaîne (vert de la charte, tiré par
     le déplacement), mot-clé (cran 300), balise (ambre de la charte) —
     toutes calées à 4,5:1 sur ce fond. ── */
  const codeBg = lchVersHex([0.257, Math.min(0.086, Cp), H])
  const codeSur = (depart, Cx, Hx) => cale(depart, [codeBg], 4.5, [Cx, Hx], { versLeBas: false })
  light['code-bg'] = dark['code-bg'] = codeBg
  light['code-text'] = dark['code-text'] = codeSur(lchVersHex([0.870, Math.min(0.062, Cp), H]), Math.min(0.062, Cp), H)
  light['code-com'] = dark['code-com'] = codeSur(lchVersHex([0.714, teinte(0.019), H]), teinte(0.019), H)
  light['code-kw'] = dark['code-kw'] = codeSur(lchVersHex([0.785, Math.min(0.104, Cp), H]), Math.min(0.104, Cp), H)
  light['code-str'] = dark['code-str'] = codeSur(lchVersHex(pose([0.800, 0.182, 151.7])), 0.182, suit(151.7))
  light['code-tag'] = dark['code-tag'] = codeSur(lchVersHex(pose([0.837, 0.164, 84.4])), 0.164, suit(84.4))

  /* La décision d'entrée, et ce que le calage en a fait — dit, jamais tu.
     L'aplat glisse en zone médiane (aplatAjuste), le lien se cale (lienAjuste). */
  const meta = { saisie, aplat: light.primary, aplatAjuste: saisie !== light.primary, lien: light['primary-text'], lienAjuste: saisie !== light['primary-text'], accentAuteur: Boolean(accent) }
  return { light, dark, meta }
}

/* ── LA GAMME 50–950 — la couleur saisie se pose sur son cran (décision
   d'Auteur, 25 août : « la gamme gardait la teinte et jetait la couleur »).
   Onze MARCHES de clarté fixes, les mêmes pour toutes les familles — 50
   très clair, 950 très sombre ; les clartés et le profil de chroma sont
   ceux de l'indigo de la charte, l'origine du calibrage. La couleur
   saisie prend la marche la plus proche de sa clarté et s'y pose TELLE
   QUELLE, au code près ; les autres marches gardent leur clarté, prennent
   sa teinte, et leur chroma suit le sien — mesuré sur la marche d'accueil
   (une couleur vive fait une famille vive, une pastel une famille douce).
   À un bout de l'échelle il n'y a rien au-delà : un jaune posé sur 50 est
   le plus clair de sa famille, un marine sur 950 le plus sombre. À
   l'indigo de la charte, la gamme est celle du registre au code près.
   Une gamme d'ILLUSTRATION : les rôles ne consomment jamais une
   primitive — la page dit seulement sur quel cran chacun se pose. ── */
const GAMME_ANCRES = [
  [50, 0.962, 0.018], [100, 0.930, 0.033], [200, 0.870, 0.062],
  [300, 0.785, 0.104], [400, 0.680, 0.158], [500, 0.585, 0.204],
  [600, 0.511, 0.230], [700, 0.457, 0.215], [800, 0.398, 0.177],
  [900, 0.359, 0.135], [950, 0.257, 0.086],
]
export const CRANS = GAMME_ANCRES.map(([cran]) => cran)
/* Le chroma le plus fort affichable à cette clarté et cette teinte. */
function chromaMax(L, H) {
  let lo = 0, hi = 0.5
  for (let i = 0; i < 40; i++) {
    const c = (lo + hi) / 2
    const rgb = oklabVersRgb(lchVersOklab([L, c, H]))
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) lo = c; else hi = c
  }
  return lo
}
const indexDuCran = (hex) => {
  const [Lp] = hexVersLch(hex)
  let k = 0
  GAMME_ANCRES.forEach(([, L], i) => { if (Math.abs(L - Lp) < Math.abs(GAMME_ANCRES[k][1] - Lp)) k = i })
  return k
}
/* Le cran d'accueil d'une couleur : 50 si elle est très claire, 950 si
   elle est très sombre, 500 au milieu. */
export const cranDe = (hex) => GAMME_ANCRES[indexDuCran(hex)][0]

export function gamme(primaire = PRIMAIRE_DEFAUT) {
  const [, Cp, H] = hexVersLch(primaire)
  const saisie = rgbVersHex(hexVersRgb(primaire))
  const k = indexDuCran(saisie)
  const ratio = Cp / GAMME_ANCRES[k][2] /* le chroma de la saisie, rapporté à celui de sa marche */
  return GAMME_ANCRES.map(([cran, L, C], i) =>
    [cran, i === k ? saisie : lchVersHex([L, Math.min(C * ratio, chromaMax(L, H)), H])])
}

/* Les neutres : les marches elles-mêmes, à peine teintées à la marque —
   elles ne bougent pas avec la couleur saisie : c'est l'échelle qui rend
   un « 300 de marque » et un « 300 neutre » frères (C15). */
export function gammeNeutres(primaire = PRIMAIRE_DEFAUT) {
  const [, Cp, H] = hexVersLch(primaire)
  return GAMME_ANCRES.map(([cran, L]) => [cran, lchVersHex([L, Math.min(0.012, Cp), H])])
}

/* Une famille sémantique a DEUX ancres de charte : son ton et son fond
   doux — dont la teinte n'est pas toujours celle du ton (celui de
   l'avertissement est jaune, son ton est brun). Le doux tient le cran 50,
   le ton se pose sur son cran, et entre les deux la teinte glisse par
   l'arc le plus court ; au-delà du ton, la famille est celle du ton. */
export function gammeFamille(ton, doux) {
  const base = gamme(ton)
  const k = indexDuCran(ton)
  const [, Cd, Hd] = hexVersLch(doux)
  const [, , Ht] = hexVersLch(ton)
  const arc = (a, b, t) => { const d = ((b - a + 540) % 360) - 180; return (a + d * t + 360) % 360 }
  const [, C0] = hexVersLch(base[0][1])
  const boost = C0 > 0 ? Cd / C0 : 1
  return base.map(([cran, hex], i) => {
    if (i >= k) return [cran, hex]
    const [L, C] = hexVersLch(hex)
    const t = i / k
    const Hc = arc(Hd, Ht, t)
    return [cran, lchVersHex([L, Math.min(C * (boost * (1 - t) + t), chromaMax(L, Hc)), Hc])]
  })
}

/* Sur quel cran chaque rôle se pose — par la clarté la plus proche. Un rôle
   dont la valeur EST un cran (la saisie sur le sien) y est posé au code
   près ; les autres s'y lisent comme voisins, jamais comme consommateurs. */
export function poserSurGamme(gammeHex, roles) {
  const poses = {}
  for (const [nom, hex] of Object.entries(roles)) {
    const [L] = hexVersLch(hex)
    let k = 0
    gammeHex.forEach(([, h], i) => { if (Math.abs(hexVersLch(h)[0] - L) < Math.abs(hexVersLch(gammeHex[k][1])[0] - L)) k = i })
    const cran = gammeHex[k][0]
    ;(poses[cran] ??= []).push({ role: nom, exact: hex.toUpperCase() === gammeHex[k][1].toUpperCase() })
  }
  return poses
}

/* Les paires déclarées (C7) — celles que la page mesure. */
export const PAIRES_DECLAREES = [
  ['text-primary', 'bg', 4.5], ['text-primary', 'surface', 4.5],
  ['text-secondary', 'bg', 4.5], ['text-secondary', 'surface', 4.5],
  ['text-tertiary', 'bg', 3], ['text-tertiary', 'surface', 3], /* exception déclarée : objets secondaires, jamais du texte lu */
  ['primary-text', 'bg', 4.5], ['primary-text', 'surface', 4.5], ['primary-text-hover', 'bg', 4.5],
  ['on-primary', 'primary', 4.5],
  ['primary-text', 'primary-subtle', 4.5], ['on-primary-subtle', 'primary-subtle', 4.5],
  ['on-danger-subtle', 'danger-subtle', 4.5], ['on-danger', 'danger', 4.5],
  ['on-success-subtle', 'success-subtle', 4.5], ['on-success', 'success', 4.5],
  ['on-warning-subtle', 'warning-subtle', 4.5], ['on-warning', 'warning', 4.5],
  ['on-info-subtle', 'info-subtle', 4.5], ['on-info', 'info', 4.5],
  ['border-strong', 'bg', 3], ['focus-ring', 'bg', 3], ['focus-ring', 'surface', 3],
  ['focus-ring-danger', 'bg', 3], ['focus-ring-danger', 'surface', 3], ['focus-ring-neutral', 'bg', 3], ['focus-ring-neutral', 'surface', 3],
  ['code-text', 'code-bg', 4.5], ['code-com', 'code-bg', 4.5],
  ['code-str', 'code-bg', 4.5], ['code-kw', 'code-bg', 4.5], ['code-tag', 'code-bg', 4.5],
]
export function verifier(pal) {
  const fautes = []
  for (const theme of ['light', 'dark']) {
    for (const [t, f, seuil] of PAIRES_DECLAREES) {
      const r = contraste(pal[theme][t], pal[theme][f])
      if (r < seuil) fautes.push({ theme, texte: t, fond: f, seuil, rapport: Number(r.toFixed(2)) })
    }
  }
  return fautes
}

/* Sortie CSS — le bloc de tokens.css, prêt à coller. */
export function versCss(pal, primaire = PRIMAIRE_DEFAUT) {
  const ligne = (o, n) => `  --${n}: ${o[n]};`
  const NOMS = ['bg', 'surface', 'surface-hover', 'text-primary', 'text-secondary', 'text-tertiary', 'border', 'border-strong',
    'primary', 'primary-hover', 'on-primary', 'primary-text', 'primary-text-hover', 'primary-subtle', 'on-primary-subtle', 'accent',
    'focus-ring', 'focus-ring-danger', 'focus-ring-neutral',
    'danger', 'danger-subtle', 'on-danger', 'on-danger-subtle',
    'success', 'success-subtle', 'on-success', 'on-success-subtle',
    'warning', 'warning-subtle', 'on-warning', 'on-warning-subtle',
    'info', 'info-subtle', 'on-info', 'on-info-subtle',
    'code-bg', 'code-text', 'code-com', 'code-str', 'code-kw', 'code-tag']
  const bloc = (o) => NOMS.map((n) => ligne(o, n)).join('\n')
  return [
    `/* GÉNÉRÉ par kit/derivation.mjs depuis primary ${primaire} — ne pas éditer`,
    `   à la main : une valeur retouchée serait une valeur sans provenance.`,
    `   Régénérer : node kit/derivation.mjs --css */`,
    `:root, [data-theme="light"] {`, `  color-scheme: light;`, bloc(pal.light), `}`,
    ``, `[data-theme="dark"] {`, `  color-scheme: dark;`, bloc(pal.dark), `}`,
    ``, `@media (prefers-color-scheme: dark) {`, `  :root:not([data-theme="light"]) {`,
    `    color-scheme: dark;`, bloc(pal.dark).replace(/^ {2}/gm, '    '), `  }`, `}`,
  ].join('\n')
}

/* ═══════════════════════════════════════════════════════════════════════
   LE MOTEUR DU RYTHME — les huit décisions du 25 août 2026, en lois

   Trois décisions d'entrée — la base, l'intervalle, la racine des coins —
   et un quatrième réglage, l'intervalle des titres. Tout le registre du
   rythme en descend. Ce qui n'en descend pas est dit (HORS_CHAINE).

   Les lois, une par décision :
   1 · L'espace entre deux frères vaut leur marge. Marges base · base ÷ √2 ·
       base ÷ 2 (24 · 17 · 12) ; espaces 17 · 12 ; bord = marge de la coque.
   2 · La coque est le niveau 1 et porte la racine ; chaque niveau dessous
       divise par deux (r-1 … r-4). La racine est bornée à 38. La marge ne
       descend jamais sous le coin.
   3 · Un composant prend le coin de la ligne (racine ÷ 4) : fixe à l'écran,
       réglé par la racine du produit. La case à cocher reste anguleuse.
   4 · La densité change la base (16 · 24 · 32) ; la chaîne des marges et des
       espaces se recalcule ; coins et composants ne bougent pas.
   5 · Le corps = max(16, 16 × axe type) ; six crans × l'intervalle des
       titres : petit · corps · h3 · h2 · h1 · affiche.
   6 · La cible au doigt = 2,75 rem × axe control ; plancher 24 px absolu.
   7 · Le rythme glisse sans palier de 320 à 1440 (quatre axes, l'axe radius
       retiré) ; un régime est une mise en page (deux, un seuil en em).
   8 · Un seul registre, site compris : les crans de page sont la chaîne
       continuée au-dessus de la coque (× √2, × 2 …) ; les titres du site sont
       l'échelle continuée au-dessus de l'affiche.

   Racine 16 à la charte : planche « avant contre trois racines » du 25 août,
   verdict d'Auteur (« 16 ; 20 et 24 sont très bien aussi »).
   ═══════════════════════════════════════════════════════════════════════ */

export const CHARTE = {
  base: 24,                 /* la marge de la coque, en px */
  intervalle: Math.SQRT2,   /* le pas entre deux profondeurs */
  racine: 16,               /* le coin de la coque, en px */
  intervalleTitres: 1.25,   /* le pas entre deux crans de texte */
}
export const BORNES = {
  racine: [0, 38],          /* décision 2 : au-delà, la marge qui suit le coin change l'écran */
  base: [16, 32],           /* décision 4 : les trois densités, 16 · 24 · 32 */
  intervalle: [1.2, 2.2],
  intervalleTitres: [1.1, 1.5],
}
/* Les six intentions de la pièce d'Auteur — les préréglages du générateur. Une seule
   table, lue par les pages Rythme et Arrondis (deux copies vivaient dans deux fichiers).
   « Ludique » portait une racine de 44 : ramenée à la borne 38 (décision 2). */
export const INTENTIONS = [
  { nom: 'Outil expert', base: 20, intervalle: 4 / 3, racine: 8, note: '4:3' },
  { nom: 'Produit SaaS', base: 24, intervalle: Math.SQRT2, racine: 24, note: '√2' },
  { nom: 'Grand public', base: 24, intervalle: 1.5, racine: 32, note: '3:2' },
  { nom: 'Ludique', base: 28, intervalle: 1.618, racine: 38, note: 'φ · racine à la borne' },
  { nom: 'Éditorial · luxe', base: 32, intervalle: 1.618, racine: 4, note: 'φ' },
  { nom: 'Technique', base: 16, intervalle: 1.25, racine: 0, note: '5:4' },
]
export const DENSITES = { compact: 16, comfortable: 24, airy: 32 }

/* Les axes de la pièce d'Auteur, relevés le 11 août — quatre : l'axe radius
   est retiré (décisions 2 et 7 : les coins suivent la racine, pas l'écran).
   La courbe adoucie x²(3 − 2x) de 320 à 1440 ; le CSS interpole droit. */
export const AXES = {
  inline: { min: 0.80, max: 1.20 },
  block: { min: 0.90, max: 1.16 },
  type: { min: 0.96, max: 1.07 },
  control: { min: 1.00, max: 1.06 },
}
export const LARGEUR_MIN = 320
export const LARGEUR_MAX = 1440
export const LARGEUR_GEL = 768 /* décision 7 : la valeur de gel pour Figma — juste à 768, fausse ailleurs */
export const RACINE_NAVIGATEUR = 16
const adouci = (x) => x * x * (3 - 2 * x)
export function facteur(axe, largeur) {
  const a = AXES[axe]
  if (!a) throw new Error(`refus de statuer — axe inconnu : ${axe}`)
  const t = Math.min(1, Math.max(0, (largeur - LARGEUR_MIN) / (LARGEUR_MAX - LARGEUR_MIN)))
  return a.min + (a.max - a.min) * adouci(t)
}

/* Ce qui ne descend pas de la chaîne — déclaré, pas subi. */
export const HORS_CHAINE = {
  corps: 16,                /* décision 5 : le plancher T10, en px CSS (1 rem) */
  cible: 44,                /* décision 6 : 2,75 rem à 100 % */
  cibleMin: 24,             /* décision 6 : le plancher WCAG 2.5.8, seule valeur en px avec les traits */
  pilule: 9999,
  seuilMiseEnPage: 40,      /* décision 7 : le seuil des deux régimes, en em (640 px à 16) — valeur de registre */
  seuilRail: 69,            /* le palier du gabarit documentaire : sous 69 em le rail cède la colonne (globals.css) — un second seuil, dette dite */
  crans: 6,                 /* décision 8 : l'échelle continuée au-dessus de la coque, six crans de page calculés… */
  cransConsommes: [2, 3, 4, 6], /* …et seuls ceux qu'un consommateur emploie sont émis (pas de jeton sans consommateur) */
  maxPage: '90rem',         /* la largeur maximale du gabarit — une mesure, comme --measure */
  /* LE GABARIT DOCUMENTAIRE, dérivé (décision 8, verdict d'Auteur du 25 août sur la planche
     du gabarit) : le silence entre sections = 4ᵉ cran de page (96 ; compact 64 · aéré 128) ;
     les titres du site = un cran et demi au-dessus de l'affiche (exposants 5,5 et 4,5 :
     le demi-cran est √1,25, comme √2 pour les marges). Les six autres descendent par la loi.
     AMENDEMENT d'Auteur (25 août, sur le site construit, pièce : kittyponu.html, le gabarit nu du
     24 août) : « il faut que ça glisse comme sur le fichier nu ». Les titres du SITE glissent avec
     l'écran bien plus que la chaîne (×1,07) : l'affiche de 44 à 82, la section de 31 à 47.
     INTENTION D'AUTEUR DÉCLARÉE : les bornes sont des crans de la chaîne — affiche : du cran des
     sections (4,5) à sept crans au-dessus du corps ; section : du cran h1 (3) au cran des
     sections (4,5) — seule la PENTE entre les bornes est la sienne (6 % et 3,4 % de la largeur de
     l'écran, les pentes du gabarit nu). Une règle rompue, dite, la même pour les deux titres. */
  titresSite: { coverHaut: 7, section: 4.5, coverPente: '6vw', sectionPente: '3.4vw' },
  /* LE HALO DE FOCUS (décision d'Auteur du 31 août 2026, sur pièce Figma puis anneau-halo.html) :
     une bande de 3 px collée à l'objet, fermée par un trait de 1 px — 4 px en tout, l'épaisseur du
     coin du composant (r-ctl à la charte) : le coin extérieur du halo tombe donc sur le cran
     au-dessus (r-2). En px, comme les traits (B3). Deux calques creux, jamais une ombre. */
  focus: { bande: 3, trait: 1 },
}

const r4 = (v) => Math.round(v * 10000) / 10000

/* LE SOCLE. Les entrées entrent, tout le registre sort — en px, à une seule
   largeur d'écran (les axes viennent après). Hors plage, on refuse de
   statuer plutôt que de rendre une valeur bricolée. */
export function chaine(entrees = {}) {
  const e = { ...CHARTE, ...entrees }
  const dans = (v, [lo, hi]) => v >= lo && v <= hi
  if (!dans(e.racine, BORNES.racine)) throw new Error(`refus de statuer — racine ${e.racine} hors borne 0 → 38 (décision 2)`)
  if (!dans(e.base, BORNES.base)) throw new Error(`refus de statuer — base ${e.base} hors plage 16 → 32 (décision 4)`)
  if (!dans(e.intervalle, BORNES.intervalle)) throw new Error(`refus de statuer — intervalle ${e.intervalle} hors plage`)
  if (!dans(e.intervalleTitres, BORNES.intervalleTitres)) throw new Error(`refus de statuer — intervalle des titres ${e.intervalleTitres} hors plage`)
  const I = e.intervalle

  /* 2 · les coins : la coque porte la racine, ÷ 2 à chaque niveau ; 3 · le bouton = la ligne */
  const r = [1, 2, 4, 8].map((d) => r4(e.racine / d))
  const rCtl = r[2]

  /* 1 · les marges : base, ÷ I, ÷ I² — et la marge ne descend jamais sous le coin (2) */
  const padNu = [e.base, e.base / I, e.base / (I * I)]
  const pad = padNu.map((m, i) => r4(Math.max(m, r[i])))
  /* 1 · l'espace d'une profondeur = la marge de ses enfants : entre deux cartes
     (dans la coque) 17, entre deux lignes (dans la carte) 12, et dans la ligne
     la chaîne continuée d'un cran (8,5) — un cran de plus que les trois marges,
     dit ici parce qu'une ligne a des enfants sans marge (marques, textes). */
  const gap = [pad[1], pad[2], r4(e.base / (I * I * I)), r4(e.base / (I * I * I * I))]
  /* gap-4 (6 = base ÷ 4) : la chaîne continuée d'un cran encore, pour ce qui vit dans une
     ligne — l'intérieur d'un badge, une cellule, un chiffre et son libellé (arbitrage du
     25 août, étape 5 : sept endroits du kit vivaient à 2 ou 3 px sans jeton d'arrivée). */
  const edge = pad[0]

  /* 8 · les crans de page : la chaîne continuée au-dessus de la coque (× I, × I² …) */
  const page = Array.from({ length: HORS_CHAINE.crans }, (_, k) => r4(e.base * Math.pow(I, k + 1)))

  /* 5 · le texte : corps borné, crans × l'intervalle des titres ; 8 · continué pour le site */
  const T = e.intervalleTitres
  const corps = HORS_CHAINE.corps
  const texte = {
    /* label : les étiquettes mono (kicker, fiches, légendes) — un cran et demi sous le corps (11,5 → 12,3),
       la même logique de demi-cran que les titres du site ; retour d'Auteur du 25 août : à 12,8 l'interlettre
       des étiquettes ne tenait plus. small (12,8) reste le petit texte lu : notes, sous-titres, cellules. */
    label: r4(corps / Math.pow(T, 1.5)),
    small: r4(corps / T), body: corps,
    h3: r4(corps * T), h2: r4(corps * T ** 2), h1: r4(corps * T ** 3), display: r4(corps * T ** 4),
    'cover-max': r4(corps * T ** HORS_CHAINE.titresSite.coverHaut),
    section: r4(corps * T ** HORS_CHAINE.titresSite.section),
  }

  return {
    entrees: e,
    r, rCtl, pad, gap, edge, page, texte,
    control: HORS_CHAINE.cible,
    /* la cible des commandes secondaires (tiroir, têtes d'outils) : la cible ÷ √2 = 31, au-dessus du plancher de 24 */
    controlCompact: r4(HORS_CHAINE.cible / Math.SQRT2),
    /* la garantie, vérifiée : aucun enfant plus rond que son parent, aucune marge sous son coin */
    garanties: {
      enfantMoinsRond: r.every((v, i) => i === 0 || v <= r[i - 1]) && rCtl <= r[2],
      margeAuDessusDuCoin: pad.every((m, i) => m >= r[i]),
      margeRelevee: padNu.map((m, i) => m < r[i]), /* où la règle a joué */
    },
  }
}

/* LE RYTHME. Une valeur de socle et un axe → un jeton fluide : la droite qui
   joint les deux bornes, en rem. L'axe type porte le plancher du corps : la
   borne basse de clamp() ne descend jamais sous le corps (décision 5). */
export function fluide(valeur, axe, { plancher = 0, unite = 'rem' } = {}) {
  const a = AXES[axe]
  const bas = Math.max(valeur * a.min, plancher)
  const haut = Math.max(valeur * a.max, plancher)
  const b0 = valeur * a.min, h0 = valeur * a.max
  const pente = ((h0 - b0) / (LARGEUR_MAX - LARGEUR_MIN)) * 100
  const origine = b0 - (LARGEUR_MIN * (h0 - b0)) / (LARGEUR_MAX - LARGEUR_MIN)
  const n = (v) => String(Math.round(v * 10000) / 10000)
  const u = unite === 'px' ? (v) => `${n(v)}px` : (v) => `${n(v / RACINE_NAVIGATEUR)}rem`
  return { bas: r4(bas), haut: r4(haut), gel: r4(Math.max(valeur * facteur(axe, LARGEUR_GEL), plancher)), css: `clamp(${u(bas)}, ${u(origine)} + ${n(pente)}vw, ${u(haut)})` }
}
/* La valeur d'un jeton fluide à une largeur donnée, sur la courbe adoucie
   (ce que la pièce d'Auteur affiche) — pour les pages et le crash-test. */
export function aLargeur(valeur, axe, largeur, plancher = 0) {
  return r4(Math.max(valeur * facteur(axe, largeur), plancher))
}

/* LES JETONS. Le registre complet, nom par nom, pour une base donnée.
   Deux axes d'espacement (G7 : ils ne se mélangent jamais) ; les coins et le
   bouton sans axe (décisions 2, 7) ; le texte sur l'axe type, borné ; la
   cible sur l'axe control. */
export function jetons(socle) {
  const j = {}
  const rem = (v) => `${r4(v / RACINE_NAVIGATEUR)}rem`
  for (const axe of ['inline', 'block']) {
    socle.pad.forEach((v, i) => { j[`pad-${i + 1}-${axe}`] = { axe, base: v, ...fluide(v, axe) } })
    socle.gap.forEach((v, i) => { j[`gap-${i + 1}-${axe}`] = { axe, base: v, ...fluide(v, axe) } })
    j[`edge-${axe}`] = { axe, base: socle.edge, ...fluide(socle.edge, axe) }
    socle.page.forEach((v, i) => { if (HORS_CHAINE.cransConsommes.includes(i + 1)) j[`page-${i + 1}-${axe}`] = { axe, base: v, ...fluide(v, axe) } })
  }
  socle.r.forEach((v, i) => { j[`r-${i + 1}`] = { axe: null, base: v, css: rem(v) } })
  j['r-ctl'] = { axe: null, base: socle.rCtl, css: 'var(--r-3)' }
  j['r-pill'] = { axe: null, base: HORS_CHAINE.pilule, css: `${HORS_CHAINE.pilule}px` }
  /* Décision 5 : le corps = max(16, 16 × axe), et chaque cran est le corps
     BORNÉ × l'intervalle — donc chaque cran est son propre plancher : à 320,
     l'échelle vaut 12,8 · 16 · 20 · 25 · 31 · 39 ; elle ne monte qu'au-dessus
     de 700 px environ. Le petit texte (12,8) est un cran d'étiquette, jamais
     de texte courant (T10). */
  for (const [nom, v] of Object.entries(socle.texte)) {
    j[`font-size-${nom}`] = { axe: 'type', base: v, ...fluide(v, 'type', { plancher: v }) }
  }
  j['control-height'] = { axe: 'control', base: socle.control, ...fluide(socle.control, 'control') }
  j['control-height-compact'] = { axe: 'control', base: socle.controlCompact, ...fluide(socle.controlCompact, 'control') }
  j['target-min'] = { axe: null, base: HORS_CHAINE.cibleMin, css: `${HORS_CHAINE.cibleMin}px` }
  return j
}

/* Ce qui est déclaré au registre sans descendre de la chaîne — les familles
   de caractères, l'interligne, la mesure, l'espacement des capitales, et
   l'adaptation shadcn (géométrie seule). Tout est ici pour que tokens.css
   soit GÉNÉRÉ en entier : plus une ligne écrite à la main. */
export const REGISTRE = {
  fontes: {
    'font-sans': '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif',
    'font-mono': '"JetBrains Mono", "JetBrains Mono Fallback", ui-monospace, Menlo, monospace',
    'font-serif': 'Charter, "Bitstream Charter", "Iowan Old Style", Georgia, "Times New Roman", ui-serif, serif',
  },
  texte: { 'leading-body': '1.6', 'leading-heading': '1.2', measure: '65ch', 'tracking-label': '0.08em' },
  shadcn: { 'r-1': '0.75rem', 'r-2': '0.5rem', 'r-3': '0.375rem', 'r-4': '0.375rem', 'control-height': '2.25rem' },
  /* LE GABARIT DOCUMENTAIRE — chaque cran est un ALIAS d'un jeton de la chaîne (décision 8).
     La marge de page suit le régime de mise en page : le bord sur mobile, le 3ᵉ cran de page
     quand le rail est là. La scène est une coque : sa marge, sur chaque axe. */
  doc: {
    /* l'affiche de page : bornes dérivées, pente d'auteur (déclarée — voir HORS_CHAINE.titresSite) */
    'doc-cover': `clamp(var(--font-size-section), ${HORS_CHAINE.titresSite.coverPente}, var(--font-size-cover-max))`,
    'doc-section': `clamp(var(--font-size-h1), ${HORS_CHAINE.titresSite.sectionPente}, var(--font-size-section))`,
    'doc-silence': 'var(--page-4-block)', 'doc-tete': 'var(--page-2-block)',
    'doc-scene-inline': 'var(--pad-1-inline)', 'doc-scene-block': 'var(--pad-1-block)',
  },
  /* Les COLONNES du gabarit — rail, gouttière, marge de page — descendent de la chaîne à la
     base de la charte et n'y suivent PAS la densité : la densité règle le contenu, jamais les
     colonnes (retour d'Auteur du 25 août : en aéré, la page se resserrait). Le moteur écrit
     leur valeur de la chaîne confortable, pas un alias. */
  docColonnes: { 'doc-gouttiere': 'page-2-inline', 'doc-rail': 'page-6-inline', 'doc-marge': 'edge-inline' },
  docColonnesBureau: { 'doc-marge': 'page-3-inline' },
}


/* ── SORTIE CSS — tokens.css entier, prêt à écrire ── */
export function versCssRythme(entrees = {}) {
  const socle = chaine(entrees)
  const j = jetons(socle)
  const ligne = (n, v) => `  --${n}: ${v};`
  const bloc = (noms) => noms.map((n) => ligne(n, j[n].css)).join('\n')
  const espace = (js) => Object.keys(js).filter((n) => /^(pad|gap|edge|page)-/.test(n))
  const densite = (nom) => {
    const s = chaine({ ...entrees, base: DENSITES[nom] })
    const jj = jetons(s)
    return `[data-density="${nom}"] {\n${espace(jj).map((n) => ligne(n, jj[n].css)).join('\n')}\n}`
  }
  const px = (v) => String(Math.round(v * 10) / 10).replace('.', ',')
  const e = socle.entrees
  return [
    `/* ═══════════════════════════════════════════════════════════════════════`,
    `   LES JETONS DU RYTHME — GÉNÉRÉS par kit/derivation.mjs, ne pas éditer`,
    `   Décisions d'entrée : base ${e.base} · intervalle ${e.intervalle === Math.SQRT2 ? '√2' : e.intervalle} · racine ${e.racine} (bornée à ${BORNES.racine[1]})`,
    `   · intervalle des titres ${e.intervalleTitres}. Les huit décisions du 25 août 2026 sont les lois.`,
    `   À la charte : marges ${socle.pad.map(px).join(' · ')} — espaces ${socle.gap.map(px).join(' · ')} — coins ${socle.r.map(px).join(' · ')}`,
    `   — bouton ${px(socle.rCtl)} — crans de page ${socle.page.map(px).join(' · ')}`,
    `   — texte ${Object.values(socle.texte).slice(0, 6).map(px).join(' · ')}.`,
    `   Tout en rem ; le rythme glisse de ${LARGEUR_MIN} à ${LARGEUR_MAX} px sans palier (inline ${AXES.inline.min}–${AXES.inline.max},`,
    `   block ${AXES.block.min}–${AXES.block.max}, type ${AXES.type.min}–${AXES.type.max}, control ${AXES.control.min}–${AXES.control.max}) ; les coins ne glissent pas.`,
    `   Les deux axes ne se mélangent jamais (G7). Régénérer : node kit/derivation.mjs --css`,
    `   ═══════════════════════════════════════════════════════════════════════ */`,
    `:root {`,
    `  /* profondeurs — la marge d'un niveau, sur chaque axe (1 coque · 2 carte · 3 ligne) */`,
    bloc(Object.keys(j).filter((n) => /^pad-/.test(n))),
    `  /* l'espace entre deux frères : celui de leurs enfants (1 entre cartes · 2 entre lignes · 3 dans la ligne · 4 au plus serré, dans un badge ou une cellule) */`,
    bloc(Object.keys(j).filter((n) => /^gap-/.test(n))),
    `  /* le bord de page = la marge de la coque */`,
    bloc(['edge-inline', 'edge-block']),
    `  /* les crans de page — la chaîne continuée au-dessus de la coque (× √2 à chaque cran) ; seuls les crans consommés sont émis */`,
    bloc(Object.keys(j).filter((n) => /^page-/.test(n))),
    `  /* les coins — la racine sur la coque, ÷ 2 par niveau ; le composant prend le coin de la ligne */`,
    bloc(['r-1', 'r-2', 'r-3', 'r-4', 'r-ctl', 'r-pill']),
    `  /* le texte — corps borné à 1rem, crans × ${e.intervalleTitres} ; label = l'étiquette mono (un cran et demi sous le corps), small = le petit texte lu ; section et cover-max sont les crans des titres du site */`,
    bloc(Object.keys(j).filter((n) => /^font-size-/.test(n))),
    `  /* la cible au doigt — 2,75 rem × axe control ; la cible des commandes secondaires = cible ÷ √2 ; le plancher WCAG en px, seule valeur fixe */`,
    bloc(['control-height', 'control-height-compact', 'target-min']),
    `}`,
    ``,
    `/* La densité change la base (décision 4) : la chaîne se recalcule, coins et composants ne bougent pas. */`,
    densite('compact'),
    densite('airy'),
    ``,
    `/* Hors chaîne — déclaré au registre, jamais dérivé : familles, interligne, mesure, capitales. */`,
    `:root {`,
    ...Object.entries(REGISTRE.fontes).map(([n, v]) => ligne(n, v)),
    ...Object.entries(REGISTRE.texte).map(([n, v]) => ligne(n, v)),
    `}`,
    ``,
    `/* Le châssis du site — navigation à gauche, réglages à droite — garde la densité`,
    `   confortable quel que soit le réglage : la densité règle le contenu, jamais les colonnes. */`,
    `.navigation, .reglages {`,
    bloc(espace(j)),
    `}`,
    ``,
    `/* Adaptation shadcn — géométrie seule, coins md fixes et contrôles h-9 ; la couleur vient de la famille. */`,
    `[data-adaptation="shadcn"] {`,
    ...Object.entries(REGISTRE.shadcn).map(([n, v]) => ligne(n, v)),
    `}`,
    ``,
    `/* Le gabarit documentaire — chaque cran est un alias d'un jeton de la chaîne (décision 8 ; verdict du 25 août :`,
    `   silence = 4ᵉ cran). La marge de page suit le régime : le bord sur mobile, le 3ᵉ cran de page dès que`,
    `   le rail est là. Les titres du site sont une INTENTION D'AUTEUR déclarée (amendement du 25 août) :`,
    `   bornes dérivées (affiche : section → sept crans ; section : h1 → section), pentes du gabarit nu`,
    `   (6 vw, 3,4 vw) — la seule règle rompue, dite. */`,
    `:root {`,
    ...Object.entries(REGISTRE.doc).map(([n, v]) => ligne(n, v)),
    `  /* les colonnes : la chaîne à la base de la charte, sans suivre la densité */`,
    ...Object.entries(REGISTRE.docColonnes).map(([n, v]) => ligne(n, jetons(chaine()).hasOwnProperty(v) ? jetons(chaine())[v].css : `var(--${v})`)),
    `}`,
    `@media (min-width: ${HORS_CHAINE.seuilRail}rem) {`,
    `  :root {`,
    ...Object.entries(REGISTRE.docColonnesBureau).map(([n, v]) => `  ${ligne(n, jetons(chaine())[v].css)}`),
    `  }`,
    `}`,
    ``,
    `/* Le halo de focus — sa forme, posée une fois (décision d'Auteur, 31 août 2026) : une bande collée à`,
    `   l'objet, un trait qui la ferme, en px comme les traits ; 4 px en tout = le coin du composant, donc le`,
    `   coin extérieur du halo tombe sur le cran au-dessus. Chaque calque prend le coin de l'objet + son retrait. */`,
    `:root {`,
    `  --focus-band: ${HORS_CHAINE.focus.bande}px;`,
    `  --focus-line: ${HORS_CHAINE.focus.trait}px;`,
    `}`,
    ``,
  ].join('\n')
}

/* ── tokens.css ENTIER : le rythme, puis la couleur ── */
export function versTokensCss(entrees = {}, primaire = PRIMAIRE_DEFAUT) {
  return versCssRythme(entrees) + '\n\n' + versCss(derive(primaire), primaire) + '\n'
}

/* ── SORTIE FIGMA — jetons gelés à 768 (décision 7), bornes en description ── */
export function versFigma(entrees = {}, primaire = PRIMAIRE_DEFAUT) {
  const socle = chaine(entrees)
  const j = jetons(socle)
  const pal = derive(primaire)
  const px = (v) => Math.round(v * 100) / 100
  const dim = (t, nom) => ({
    $type: 'dimension', $value: `${px(t.gel ?? t.base)}px`,
    $description: t.axe ? `Fluide de ${px(t.bas)} à ${px(t.haut)} px (${LARGEUR_MIN} → ${LARGEUR_MAX}), gelé à ${LARGEUR_GEL} px. Axe ${t.axe}.` : `Fixe — ne suit pas l'écran.`,
  })
  const groupe = (re) => Object.fromEntries(Object.entries(j).filter(([n]) => re.test(n)).map(([n, t]) => [n, dim(t, n)]))
  const couleurs = (o) => Object.fromEntries(Object.entries(o).map(([n, v]) => [n, { $type: 'color', $value: v }]))
  return {
    $description: `Jetons du kit Fili — GÉNÉRÉS par kit/derivation.mjs. Base ${socle.entrees.base} · √2 · racine ${socle.entrees.racine} · titres × ${socle.entrees.intervalleTitres} · primary ${primaire}. Les jetons fluides sont gelés à ${LARGEUR_GEL} px (décision 7) : justes à 768, faux ailleurs — leurs bornes sont en description.`,
    spacing: { ...groupe(/^(pad|gap|edge)-/), density: Object.fromEntries(Object.entries(DENSITES).map(([nom, base]) => [nom, { $type: 'dimension', $value: `${base}px`, $description: 'La densité change la base ; la chaîne se recalcule.' }])) },
    page: groupe(/^page-/),
    radius: { ...groupe(/^r-/), 'r-ctl': { $type: 'dimension', $value: `${px(socle.rCtl)}px`, $description: 'Le composant prend le coin de la ligne (r-3).' } },
    fontSize: groupe(/^font-size-/),
    control: groupe(/^(control-height|target-min)$/),
    focus: { band: { $type: 'dimension', $value: `${HORS_CHAINE.focus.bande}px`, $description: 'Le halo de focus : la bande collée à l’objet, en px.' }, line: { $type: 'dimension', $value: `${HORS_CHAINE.focus.trait}px`, $description: 'Le halo de focus : le trait qui ferme la bande, en px.' } },
    color: { light: couleurs(pal.light), dark: couleurs(pal.dark) },
  }
}

/* ── SORTIE TAILWIND — les utilitaires pointent sur les variables ── */
export function versTailwind(entrees = {}) {
  const socle = chaine(entrees)
  const j = jetons(socle)
  const v = (n) => `var(--${n})`
  const spacing = Object.fromEntries(Object.keys(j).filter((n) => /^(pad|gap|edge|page)-/.test(n)).map((n) => [n, v(n)]))
  const borderRadius = { 1: v('r-1'), 2: v('r-2'), 3: v('r-3'), 4: v('r-4'), ctl: v('r-ctl'), pill: v('r-pill') }
  const fontSize = Object.fromEntries(Object.keys(socle.texte).map((n) => [n, v(`font-size-${n}`)]))
  const literal = Object.fromEntries(Object.entries(j).filter(([n]) => /^(pad|gap|edge|page)-/.test(n)).map(([n, t]) => [n, { min: `${Math.round(t.bas / 4) * 4}px`, max: `${Math.round(t.haut / 4) * 4}px` }]))
  return { spacing, borderRadius, fontSize, height: { control: v('control-height'), 'control-compact': v('control-height-compact') }, minHeight: { target: v('target-min') }, screens: { desktop: `${HORS_CHAINE.seuilMiseEnPage}em` }, literal }
}

/* ── tokens.tailwind.mjs ENTIER — les mêmes exports qu'avant (rhythm,
   typography, color, rhythmLiteral), générés. Les utilitaires pointent sur
   les variables ; le thème littéral arrondit à la grille de 4 (note
   d'Auteur du 23 août : jamais de décimales dans un thème Tailwind). ── */
export function versTailwindFichier(entrees = {}) {
  const tw = versTailwind(entrees)
  const socle = chaine(entrees)
  const j = jetons(socle)
  const q = (o) => JSON.stringify(o, null, 2).replace(/"([a-zA-Z0-9-]+)":/g, (m, k) => (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? `${k}:` : `'${k}':`)).replace(/"/g, "'")
  const literal = Object.fromEntries(Object.entries(tw.literal).map(([n, v]) => [n, { ...v, calcule: `${Math.round(j[n].bas * 10) / 10} → ${Math.round(j[n].haut * 10) / 10} px` }]))
  const NOMS = ['bg', 'surface', 'surface-hover', 'text-primary', 'text-secondary', 'border', 'border-strong']
  return `/**
 * SORTIE JUMELLE TAILWIND — GÉNÉRÉE par kit/derivation.mjs, ne pas éditer.
 * Même source que app/tokens.css, autre cible : les utilitaires pointent sur
 * les variables, jamais sur des valeurs — le rythme continue de vivre après
 * compilation. L'API parle anglais (décision d'Auteur, 23 août 2026).
 *
 * Usage : import { rhythm, typography, color } from './tokens.tailwind.mjs'
 * puis dans tailwind.config : theme.extend.spacing = rhythm.spacing, etc.
 * Régénérer : npm run tokens
 */
export const rhythm = ${q({ spacing: tw.spacing, borderRadius: tw.borderRadius, height: tw.height, minHeight: tw.minHeight, screens: tw.screens })};

/* Sortie jumelle — typographie : le corps borné et les crans dérivés (décision 5). */
export const typography = ${q({ fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)', serif: 'var(--font-serif)' }, fontSize: tw.fontSize, lineHeight: { body: 'var(--leading-body)', heading: 'var(--leading-heading)' }, maxWidth: { measure: 'var(--measure)' }, letterSpacing: { label: 'var(--tracking-label)' } })};

/* Sortie jumelle — couleur (COLOR-UX.md 2.0.0). Les utilitaires pointent
   sur les variables : le thème (clair/sombre) se résout au rendu, jamais
   dans une classe. Les deux rôles de texte suivent la convention
   foreground du marché. */
export const color = ${q({
  colors: {
    background: 'var(--bg)', surface: 'var(--surface)', 'surface-hover': 'var(--surface-hover)',
    foreground: 'var(--text-primary)', 'muted-foreground': 'var(--text-secondary)', 'tertiary-foreground': 'var(--text-tertiary)',
    border: 'var(--border)', 'border-strong': 'var(--border-strong)',
    primary: { DEFAULT: 'var(--primary)', hover: 'var(--primary-hover)', subtle: 'var(--primary-subtle)', text: 'var(--primary-text)', 'text-hover': 'var(--primary-text-hover)' },
    'on-primary': { DEFAULT: 'var(--on-primary)', subtle: 'var(--on-primary-subtle)' },
    danger: { DEFAULT: 'var(--danger)', subtle: 'var(--danger-subtle)' }, 'on-danger': { DEFAULT: 'var(--on-danger)', subtle: 'var(--on-danger-subtle)' },
    success: { DEFAULT: 'var(--success)', subtle: 'var(--success-subtle)' }, 'on-success': { DEFAULT: 'var(--on-success)', subtle: 'var(--on-success-subtle)' },
    warning: { DEFAULT: 'var(--warning)', subtle: 'var(--warning-subtle)' }, 'on-warning': { DEFAULT: 'var(--on-warning)', subtle: 'var(--on-warning-subtle)' },
    info: { DEFAULT: 'var(--info)', subtle: 'var(--info-subtle)' }, 'on-info': { DEFAULT: 'var(--on-info)', subtle: 'var(--on-info-subtle)' },
    accent: 'var(--accent)',
    code: { bg: 'var(--code-bg)', text: 'var(--code-text)', com: 'var(--code-com)', str: 'var(--code-str)', kw: 'var(--code-kw)', tag: 'var(--code-tag)' },
  },
})};

/* Le thème Tailwind LITTÉRAL — deux échelles assumées (décision d'Auteur,
   23 août) : Tailwind garde sa grille de 4, valeurs ARRONDIES au cran le
   plus proche ; le CSS natif garde les décimales via les variables. On ne
   mélange jamais les deux. min = borne 320 px, max = borne 1440 px ; le
   calcul exact est dit à côté. */
export const rhythmLiteral = ${q({ spacing: literal })};
`
}

/* ── Ligne de commande ── */
const estCli = typeof process !== 'undefined' && process.argv?.[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (estCli) {
  const args = process.argv.slice(2)
  const hex = args.find((a) => a.startsWith('#')) ?? PRIMAIRE_DEFAUT
  const pal = derive(hex)
  if (args.includes('--css')) {
    process.stdout.write(versTokensCss({}, hex))
  } else if (args.includes('--figma')) {
    console.log(JSON.stringify(versFigma({}, hex), null, 2))
  } else if (args.includes('--tailwind')) {
    process.stdout.write(versTailwindFichier())
  } else if (args.includes('--rythme')) {
    const s = chaine()
    console.log(`\nLA CHAÎNE — base ${s.entrees.base} · √2 · racine ${s.entrees.racine} · titres × ${s.entrees.intervalleTitres}\n`)
    for (const [n, t] of Object.entries(jetons(s))) console.log(`  ${n.padEnd(22)} ${String(t.base).padStart(8)} px   ${t.css}`)
  } else {
    console.log(`\nFAMILLE DÉRIVÉE — primary ${hex} (teinte ${hexVersLch(hex)[2].toFixed(1)}°)\n`)
    for (const theme of ['light', 'dark']) {
      console.log(`  ${theme}`)
      for (const [n, v] of Object.entries(pal[theme])) console.log(`    ${n.padEnd(18)} ${v}`)
    }
    const fautes = verifier(pal)
    console.log(fautes.length === 0
      ? `\n  ${PAIRES_DECLAREES.length * 2} paires · 2 thèmes — toutes au seuil ✓\n`
      : `\n  ⚠ ${fautes.length} paire(s) sous le seuil :\n` + fautes.map((f) => `    [${f.theme}] ${f.texte} sur ${f.fond} : ${f.rapport}:1 < ${f.seuil}:1`).join('\n') + '\n')
  }
}
