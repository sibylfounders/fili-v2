/* Le moteur de l'Échelle Semantic Rhythm, au dépôt.
 *
 * PROVENANCE — reconstruit d'après `claude/kit-creation-derivation.md` (#050),
 * le fichier d'origine de l'Auteur n'étant plus accessible depuis le dépôt.
 * Décision `#058`. Ce qui est EXACT et vérifiable contre la note :
 *   marges [B, B/R, B/R²] · rayons [R0/2, R0/4, R0/8] · écart = base ÷ 2 ·
 *   bord = B · adoucissement x²(3−2x) sur 320→1440 · amplitudes par axe.
 * Ce qui est RECONSTRUIT et ne peut pas être présenté comme vérifié :
 *   1. Le nom et le nombre des crans. La note dénombre vingt-deux tokens ; ce
 *      moteur en produit vingt-trois. L'écart n'est pas comblé par une valeur
 *      inventée : il est déclaré.
 *   2. L'écart pris à chaque profondeur (marge ÷ 2), et non une seule fois au
 *      niveau de la coque. Sans cela deux conteneurs emboîtés porteraient le
 *      même écart, et le rapport que R3.7 juge vaudrait 1 à tous les coups.
 *      La convention « écart = marge ÷ 2 » est celle du moteur d'audit du
 *      projet (i6), qui est une pièce du dépôt et non une supposition.
 *   3. Les deux crans au-dessus de la coque — `page` et `large`. L'Échelle ne
 *      couvre pas le rythme entre deux sections : le manque avait déjà été
 *      nommé en `#050`. Ils prolongent la même raison géométrique vers le haut
 *      plutôt que d'improviser deux nombres.
 */

export const ENTRIES_DEFAULTS = {
  base: 24,
  ratio: Math.SQRT2,
  /* L'arrondi reste un réglage à part — sans cette séparation, un système ne
     peut pas être large et vif à la fois, et quatre des six intentions de
     l'Auteur deviennent impossibles.

     MAIS LA MARGE LE COMMANDE. Décision d'Auteur du 2026-08-12 : l'arrondi de
     départ vaut la marge de base. En dessous, c'est un choix esthétique et il
     est libre ; au-dessus, ce n'est pas possible. Le réglage ne descend donc
     plus d'un nombre en pixels choisi dans le vide : il descend de l'espace,
     et il ne peut que s'en éloigner vers le bas. */
  radiusRoot: 24,
  aligned: false,
  /* L'intervalle des titres. Le corps ne bouge pas : un titre de niveau 2 est
     à un pas, un titre de niveau 1 à deux pas. Source : l'outil de l'Auteur. */
  intervalHeadings: 1.25,
  /* Seize. C'est la base commune, partout — arbitrage d'Auteur du 2026-08-11,
     qui révise le 17 que la planche avait déclaré comme un écart assumé. Une
     base commune ne se négocie pas par surface : c'est ce qui fait qu'un même
     texte a la même taille dans le produit, dans l'outil et dans le navigateur. */
  body: 16,
  target: 44,
  /* Le minimum entre deux zones que le doigt doit distinguer. Déclaré à la
     planche, jamais appliqué jusqu'au 2026-08-12. */
  gapMiniTargets: 8,
  /* LE TEXTE SUIVI. Un article n'est pas un écran d'outil : l'écart entre deux
     paragraphes se juge en multiples du corps, pas en profondeur d'emboîtement.
     La recommandation publique tient entre une et une fois et demie le corps.
     Confronté à l'échelle, un seul niveau y tombe — voir la garantie plus bas.
     Décision d'Auteur du 2026-08-12. */
  proseDepth: 'page',
  /* Le plancher du rapport écart/corps, sous lequel le moteur refuse. Il est à
     un centième sous l'unité : au plus étroit des écrans, « page » vaut 0,99 et
     c'est le meilleur de l'échelle — l'écart est déclaré plutôt que masqué. */
  proseRatioMini: 0.98,
}

/* Une profondeur, un rang. Le rang est l'exposant du ratio : la coque est
   l'origine, on descend en divisant, on monte en multipliant. */
export const DEPTHS = ['wide', 'page', 'container', 'card', 'detail']
export const RANK = { wide: -2, page: -1, container: 0, card: 1, detail: 2 }

/* Les cinq axes de la source, tous les cinq. Relevés dans l'outil de l'Auteur
   (RR_AXES) le 2026-08-11 et repris à l'identique — plus aucun n'est écarté. */
export const AXES = {
  inline: { min: 0.80, max: 1.20 },
  block: { min: 0.90, max: 1.16 },
  type: { min: 0.96, max: 1.07 },
  radius: { min: 0.86, max: 1.12 },
  control: { min: 1.00, max: 1.06 },
}

/* La racine du navigateur. Elle appartient à l'utilisateur : c'est la taille
   de texte qu'il a réglée, seize par défaut. Toute la géométrie s'exprime en
   multiples d'elle. */
export const ROOT_BROWSER = 16

/* LE DÉGAGEMENT DU COIN. Sur un coin de rayon R, le point le plus creux de
   l'arc est à (1 − 1/√2) × R du bord, en diagonale. Tout ce qui entre dans ce
   carré sort de la surface. C'est de la géométrie, pas un réglage : la valeur ne
   se décide pas, elle se démontre. Décision d'Auteur du 2026-08-12 — la seule des
   trois « règles de coin » du plan qui ait un objet. */
export const CLEARANCE_CORNER = 1 - 1 / Math.SQRT2

export const WIDTH_MIN = 320
export const WIDTH_MAX = 1440

export const softened = (x) => x * x * (3 - 2 * x)

export function factor(axis, width) {
  const a = AXES[axis]
  if (!a) throw new Error(`refus de statuer — axe inconnu : ${axis}`)
  const t = Math.min(1, Math.max(0, (width - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN)))
  return a.min + (a.max - a.min) * softened(t)
}

const align = (v, aligned) => (aligned ? Math.max(4, Math.round(v / 4) * 4) : v)
const r4 = (v) => Math.round(v * 10000) / 10000

/* Le socle. Trois décisions entrent, toute la chaîne sort. Hors plage, on
   refuse de statuer plutôt que de rendre une valeur bricolée. */
export function derive(entries = ENTRIES_DEFAULTS) {
  const e = { ...ENTRIES_DEFAULTS, ...entries }
  if (!(e.base >= 16 && e.base <= 32)) throw new Error('refus de statuer — base hors plage 16 → 32')
  if (!(e.ratio >= 1.2 && e.ratio <= 2.2)) throw new Error('refus de statuer — ratio hors plage 1,2 → 2,2')
  /* Le plafond n'est plus un nombre fixe : il descend de la marge de base.
     DEUX FOIS elle, et non elle-même — corrigé le 2026-08-12 après essai sur les
     six intentions de l'Auteur, dont deux se faisaient refuser à tort. La règle
     porte sur les arrondis QU'ON VOIT, et le premier d'entre eux vaut déjà la
     moitié du réglage de départ : à deux fois la base, la coque touche
     exactement sa marge, jamais plus. Un dépassement est refusé, jamais rabattu
     en silence — une correction non tracée est la faute nommée depuis #002. */
  if (!(e.radiusRoot >= 0 && e.radiusRoot <= 2 * e.base))
    throw new Error(`refus de statuer — l'arrondi de départ (${e.radiusRoot}) donnerait à la coque un arrondi de ${e.radiusRoot / 2} pour une marge de ${e.base} ; aucun arrondi ne dépasse la marge qui le porte`)
  const radiusRoot = e.radiusRoot

  const margins = {}
  const gaps = {}
  for (const p of DEPTHS) {
    const m = align(e.base / Math.pow(e.ratio, RANK[p]), e.aligned)
    margins[p] = r4(m)
    gaps[p] = r4(align(m / 2, e.aligned))
  }
  const radii = {
    container: r4(align(radiusRoot / 2, e.aligned)),
    card: r4(align(radiusRoot / 4, e.aligned)),
    detail: r4(align(radiusRoot / 8, e.aligned)),
    /* Le composant. Il descend du TON du système, jamais de sa profondeur : un
       bouton doit se reconnaître partout, et à ton nul il est à angle droit.
       MAIS sa taille ne bouge pas — un bouton et un champ gardent la même
       hauteur, c'est ce qui aligne la lecture. C'est donc l'arrondi qui se
       rabat sur elle : il ne dépasse jamais les DEUX TIERS de la marge
       verticale du composant. Au-delà, ce n'est plus un arrondi mais une
       forme, et le composant passe en pastille. Décision d'Auteur du
       2026-08-11, rendue sur essai : la taille qui suivait l'arrondi cassait
       la barre d'actions sur téléphone. */
    control: r4(align(Math.min(radiusRoot / 3, (2 / 3) * margins.detail), e.aligned)),
  }
  /* La garantie, à chaque niveau : aucun arrondi ne dépasse la marge qui le
     porte. Elle tient d'elle-même tant que l'arrondi de départ reste sous la
     marge de base — mais elle est vérifiée plutôt que supposée, parce que la
     descente des arrondis (÷2) et celle des marges (÷ratio) ne suivent pas le
     même pas et pourraient se croiser sur des réglages extrêmes. */
  for (const p of ['container', 'card', 'detail']) {
    if (radii[p] > margins[p])
      throw new Error(`refus de statuer — l'arrondi de ${p} (${radii[p]}) dépasse sa marge (${margins[p]})`)
  }

  /* LE COIN. Deux choses, et elles ne se ressemblent pas.

     Sur une SURFACE, la garantie est démontrable : le plafond de l'arrondi
     (deux fois la marge de base) rend le dégagement structurellement inatteignable
     — vérifié sur tous les réglages admis, la marge reste au-dessus dans le pire
     cas. La vérification ci-dessous ne se déclenchera donc jamais tant que ce
     plafond tient. Elle est écrite pour le jour où il bougerait.

     Sur une PASTILLE, il n'y a aucune garantie : son rayon ne descend pas de la
     chaîne, il vaut la moitié de sa hauteur. Plus une pastille est haute, plus son
     coin mange — et à partir d'une certaine hauteur, la marge horizontale ne suffit
     plus. On calcule donc la hauteur au-delà de laquelle une pastille n'est plus
     tenable, par air. C'est le seul endroit du système où cette règle a un objet. */
  for (const p of ['container', 'card', 'detail']) {
    const required = CLEARANCE_CORNER * radii[p]
    if (margins[p] < required)
      throw new Error(`refus de statuer — la marge de ${p} (${r4(margins[p])}) est inférieure au dégagement de son coin (${r4(required)}) ; le contenu entrerait dans l'arc`)
  }
  /* L'ÉCART ENTRE DEUX CIBLES. La planche déclare un minimum de huit entre deux
     zones que le doigt doit distinguer. Or l'écart d'une profondeur fine tombe
     sous ce minimum — et personne ne l'avait vu, parce que rien ne le vérifiait.
     On calcule donc la profondeur la plus fine dont l'écart tient le minimum À
     TOUTES LES LARGEURS d'écran, y compris la plus étroite où l'axe vertical se
     resserre. En dessous, une pile ne peut pas contenir de cibles. */
  let depthMiniTargets = null
  for (const p of [...DEPTHS].reverse()) {
    const atPlusNarrow = gaps[p] * factor('block', WIDTH_MIN)
    if (atPlusNarrow >= e.gapMiniTargets) { depthMiniTargets = p; break }
  }
  if (!depthMiniTargets)
    throw new Error(`refus de statuer — aucune profondeur ne tient l'écart minimal de ${e.gapMiniTargets} entre deux cibles`)

  const text0 = r4(e.body)
  /* LE TEXTE SUIVI. On vérifie que la profondeur déclarée pour la prose tient
     son rapport au corps À TOUTES LES LARGEURS. Le rapport se calcule contre le
     corps DE LA MÊME LARGEUR : les deux respirent, et comparer un écart d'un
     bout de la plage à un corps de l'autre ne voudrait rien dire. */
  const proseRatios = [WIDTH_MIN, WIDTH_MAX].map(
    (w) => (gaps[e.proseDepth] * factor('block', w)) / (text0 * factor('type', w))
  )
  const proseWorst = Math.min(...proseRatios)
  if (proseWorst < e.proseRatioMini)
    throw new Error(`refus de statuer — au niveau « ${e.proseDepth} », deux paragraphes ne sont séparés que de ${r4(proseWorst)} fois le corps ; le plancher déclaré est ${e.proseRatioMini}`)

  const corner = {
    clearance: r4(CLEARANCE_CORNER),
    dotHeightMax: {
      wide: r4((2 * margins.container) / CLEARANCE_CORNER),
      tight: r4((2 * margins.card) / CLEARANCE_CORNER),
    },
  }

  /* Le texte. Le corps est l'origine, les titres sont des PAS — jamais des
     tailles écrites. Deux pas au-dessus du corps, pas un de plus. */
  const T = e.intervalHeadings
  const text = {
    body: r4(e.body),
    heading2: r4(e.body * T),
    heading1: r4(e.body * T * T),
  }
  /* La cible tactile. Elle a son axe propre : elle grandit à peine. */
  const control = { target: r4(e.target) }

  /* Le composant sature quand le ton demanderait plus que ce que sa marge
     autorise. Ce n'est pas une valeur, c'est un fait : le produit doit alors
     employer la pastille, jamais un entre-deux. */
  const dotRequired = radiusRoot / 3 > (2 / 3) * margins.detail

  return { entries: e, radiusRoot, margins, gaps, radii, edge: margins.container, text, control, dotRequired, corner, depthMiniTargets, prose: { depth: e.proseDepth, ratioWorst: r4(proseWorst) } }
}

/* Un token fluide. Le générateur adoucit sa courbe en JavaScript ; le CSS ne
   sait qu'interpoler droit. On pose donc la droite qui joint les deux bornes,
   et on MESURE ce qu'elle coûte au lieu de le supposer. */
export function clampOf(value, axis, unit = 'rem') {
  const a = AXES[axis]
  const bottom = value * a.min
  const top = value * a.max
  const slope = ((top - bottom) / (WIDTH_MAX - WIDTH_MIN)) * 100
  const origin = bottom - (WIDTH_MIN * (top - bottom)) / (WIDTH_MAX - WIDTH_MIN)
  const n = (v) => String(Math.round(v * 10000) / 10000)
  /* L'unité. Tout sort en REM — décision d'Auteur du 2026-08-12 : quand
     quelqu'un agrandit le texte dans son navigateur, un système en pixels
     l'ignore, un système en rem le suit. C'est une exigence d'accessibilité
     (WCAG 1.4.4), pas un goût.

     La conversion emploie SEIZE, qui est la racine du navigateur — pas le corps
     du système, même s'ils valent la même chose aujourd'hui. Si le corps changeait,
     le rem, lui, ne changerait pas : il appartient à l'utilisateur.

     La part en vw reste en vw : c'est une fraction de la largeur de l'écran, pas
     une longueur de texte. Elle ne suit donc pas le zoom, et c'est voulu.

     Le px demeure pour ce qui ne doit PAS grandir avec le texte : la cible au
     doigt (un doigt ne change pas de taille), les traits d'un pixel, et la
     largeur d'écran minimale. */
  const u = unit === 'px' ? (v) => `${n(v)}px` : (v) => `${n(v / ROOT_BROWSER)}rem`
  return {
    bottom: r4(bottom),
    top: r4(top),
    unit,
    css: `clamp(${u(bottom)}, ${u(origin)} + ${n(slope)}vw, ${u(top)})`,
  }
}

/* L'écart entre la courbe d'origine et la droite du CSS, mesuré tous les 10 px
   sur toute la plage. Mesuré, pas supposé. */
export function gapCurveRight(value, axis) {
  const { bottom, top } = clampOf(value, axis)
  let worst = 0
  let or = WIDTH_MIN
  for (let w = WIDTH_MIN; w <= WIDTH_MAX; w += 10) {
    const t = (w - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN)
    const curve = value * factor(axis, w)
    const right = bottom + (top - bottom) * t
    const d = Math.abs(curve - right)
    if (d > worst) { worst = d; or = w }
  }
  return { gap: r4(worst), width: or }
}

/* Les tokens. Deux axes d'espacement, un axe de rayon. */
export function tokens(foundation) {
  const output = {}
  for (const axis of ['inline', 'block']) {
    for (const p of DEPTHS) {
      output[`${axis}-margin-${p}`] = { axis, base: foundation.margins[p], ...clampOf(foundation.margins[p], axis), ...gapCurveRight(foundation.margins[p], axis) }
      output[`${axis}-gap-${p}`] = { axis, base: foundation.gaps[p], ...clampOf(foundation.gaps[p], axis), ...gapCurveRight(foundation.gaps[p], axis) }
    }
  }
  for (const p of ['container', 'card', 'detail', 'control']) {
    output[`radius-${p}`] = { axis: 'radius', base: foundation.radii[p], ...clampOf(foundation.radii[p], 'radius'), ...gapCurveRight(foundation.radii[p], 'radius') }
  }
  /* Le bord structurel : la marge du niveau 1, posée sur le bord de la page. */
  output['inline-edge'] = { axis: 'inline', base: foundation.edge, ...clampOf(foundation.edge, 'inline'), ...gapCurveRight(foundation.edge, 'inline') }
  output['block-edge'] = { axis: 'block', base: foundation.edge, ...clampOf(foundation.edge, 'block'), ...gapCurveRight(foundation.edge, 'block') }
  /* Le texte, sur son axe propre. */
  for (const [name, v] of Object.entries(foundation.text)) {
    output[`type-${name}`] = { axis: 'type', base: v, ...clampOf(v, 'type'), ...gapCurveRight(v, 'type') }
  }
  /* La cible tactile, sur le sien. */
  /* EN PIXELS, et c'est la seule. Un doigt ne grandit pas quand on agrandit le
     texte : une cible exprimée en rem descendrait sous son plancher légal dès
     qu'un utilisateur réduit sa taille de police. */
  output['control-target'] = { axis: 'control', base: foundation.control.target, ...clampOf(foundation.control.target, 'control', 'px'), ...gapCurveRight(foundation.control.target, 'control') }
  return output
}
