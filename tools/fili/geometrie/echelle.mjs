/* Le moteur de l'Échelle Semantic Rhythm, au dépôt.
 *
 * PROVENANCE — reconstruit d'après `claude/kit-creation-derivation.md` (#050),
 * le fichier d'origine de l'Auteur n'étant plus accessible depuis le dépôt.
 * Décision `#058`. Ce qui est EXACT et vérifiable contre la note :
 *   marges [B, B/R, B/R²] · rayons [R0/2, R0/4, R0/8] · écart = base ÷ 2 ·
 *   bord = B · adoucissement x²(3−2x) sur 320→1440 · amplitudes par axe.
 * Ce qui est RECONSTRUIT et ne peut pas être présenté comme vérifié :
 *   1. Le nom et le nombre des crans. La note dénombre vingt-deux jetons ; ce
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

export const ENTREES_DEFAUT = {
  base: 24,
  ratio: Math.SQRT2,
  /* L'arrondi est un réglage à part, séparé de l'espace — décision d'Auteur du
     2026-08-11, qui révise « le rayon descend de la marge » du même jour. Sans
     cette séparation, un système ne peut pas être large et vif à la fois, et les
     six intentions de l'Auteur deviennent impossibles. */
  rayonRacine: 24,
  cale: false,
  /* L'intervalle des titres. Le corps ne bouge pas : un titre de niveau 2 est
     à un pas, un titre de niveau 1 à deux pas. Source : l'outil de l'Auteur. */
  intervalleTitres: 1.25,
  /* Seize. C'est la base commune, partout — arbitrage d'Auteur du 2026-08-11,
     qui révise le 17 que la planche avait déclaré comme un écart assumé. Une
     base commune ne se négocie pas par surface : c'est ce qui fait qu'un même
     texte a la même taille dans le produit, dans l'outil et dans le navigateur. */
  corps: 16,
  cible: 44,
}

/* Une profondeur, un rang. Le rang est l'exposant du ratio : la coque est
   l'origine, on descend en divisant, on monte en multipliant. */
export const PROFONDEURS = ['large', 'page', 'coque', 'carte', 'detail']
export const RANG = { large: -2, page: -1, coque: 0, carte: 1, detail: 2 }

/* Les cinq axes de la source, tous les cinq. Relevés dans l'outil de l'Auteur
   (RR_AXES) le 2026-08-11 et repris à l'identique — plus aucun n'est écarté. */
export const AXES = {
  inline: { min: 0.80, max: 1.20 },
  block: { min: 0.90, max: 1.16 },
  type: { min: 0.96, max: 1.07 },
  radius: { min: 0.86, max: 1.12 },
  control: { min: 1.00, max: 1.06 },
}

export const LARGEUR_MIN = 320
export const LARGEUR_MAX = 1440

export const adouci = (x) => x * x * (3 - 2 * x)

export function facteur(axe, largeur) {
  const a = AXES[axe]
  if (!a) throw new Error(`refus de statuer — axe inconnu : ${axe}`)
  const t = Math.min(1, Math.max(0, (largeur - LARGEUR_MIN) / (LARGEUR_MAX - LARGEUR_MIN)))
  return a.min + (a.max - a.min) * adouci(t)
}

const caler = (v, cale) => (cale ? Math.max(4, Math.round(v / 4) * 4) : v)
const r4 = (v) => Math.round(v * 10000) / 10000

/* Le socle. Trois décisions entrent, toute la chaîne sort. Hors plage, on
   refuse de statuer plutôt que de rendre une valeur bricolée. */
export function deriver(entrees = ENTREES_DEFAUT) {
  const e = { ...ENTREES_DEFAUT, ...entrees }
  if (!(e.base >= 16 && e.base <= 32)) throw new Error('refus de statuer — base hors plage 16 → 32')
  if (!(e.ratio >= 1.2 && e.ratio <= 2.2)) throw new Error('refus de statuer — ratio hors plage 1,2 → 2,2')
  if (!(e.rayonRacine >= 0 && e.rayonRacine <= 48)) throw new Error('refus de statuer — rayon racine hors plage 0 → 48')
  const rayonRacine = e.rayonRacine

  const marges = {}
  const ecarts = {}
  for (const p of PROFONDEURS) {
    const m = caler(e.base / Math.pow(e.ratio, RANG[p]), e.cale)
    marges[p] = r4(m)
    ecarts[p] = r4(caler(m / 2, e.cale))
  }
  const rayons = {
    coque: r4(caler(rayonRacine / 2, e.cale)),
    carte: r4(caler(rayonRacine / 4, e.cale)),
    detail: r4(caler(rayonRacine / 8, e.cale)),
    /* Le composant. Il descend du TON du système, jamais de sa profondeur : un
       bouton doit se reconnaître partout, et à ton nul il est à angle droit.
       MAIS sa taille ne bouge pas — un bouton et un champ gardent la même
       hauteur, c'est ce qui aligne la lecture. C'est donc l'arrondi qui se
       rabat sur elle : il ne dépasse jamais les DEUX TIERS de la marge
       verticale du composant. Au-delà, ce n'est plus un arrondi mais une
       forme, et le composant passe en pastille. Décision d'Auteur du
       2026-08-11, rendue sur essai : la taille qui suivait l'arrondi cassait
       la barre d'actions sur téléphone. */
    controle: r4(caler(Math.min(rayonRacine / 3, (2 / 3) * marges.detail), e.cale)),
  }
  /* Le texte. Le corps est l'origine, les titres sont des PAS — jamais des
     tailles écrites. Deux pas au-dessus du corps, pas un de plus. */
  const T = e.intervalleTitres
  const texte = {
    corps: r4(e.corps),
    titre2: r4(e.corps * T),
    titre1: r4(e.corps * T * T),
  }
  /* La cible tactile. Elle a son axe propre : elle grandit à peine. */
  const controle = { cible: r4(e.cible) }

  /* Le composant sature quand le ton demanderait plus que ce que sa marge
     autorise. Ce n'est pas une valeur, c'est un fait : le produit doit alors
     employer la pastille, jamais un entre-deux. */
  const pastilleExigee = rayonRacine / 3 > (2 / 3) * marges.detail

  return { entrees: e, rayonRacine, marges, ecarts, rayons, bord: marges.coque, texte, controle, pastilleExigee }
}

/* Un jeton fluide. Le générateur adoucit sa courbe en JavaScript ; le CSS ne
   sait qu'interpoler droit. On pose donc la droite qui joint les deux bornes,
   et on MESURE ce qu'elle coûte au lieu de le supposer. */
export function clampDe(valeur, axe) {
  const a = AXES[axe]
  const bas = valeur * a.min
  const haut = valeur * a.max
  const pente = ((haut - bas) / (LARGEUR_MAX - LARGEUR_MIN)) * 100
  const origine = bas - (LARGEUR_MIN * (haut - bas)) / (LARGEUR_MAX - LARGEUR_MIN)
  const n = (v) => String(Math.round(v * 10000) / 10000)
  return {
    bas: r4(bas),
    haut: r4(haut),
    css: `clamp(${n(bas)}px, ${n(origine)}px + ${n(pente)}vw, ${n(haut)}px)`,
  }
}

/* L'écart entre la courbe d'origine et la droite du CSS, mesuré tous les 10 px
   sur toute la plage. Mesuré, pas supposé. */
export function ecartCourbeDroite(valeur, axe) {
  const { bas, haut } = clampDe(valeur, axe)
  let pire = 0
  let ou = LARGEUR_MIN
  for (let w = LARGEUR_MIN; w <= LARGEUR_MAX; w += 10) {
    const t = (w - LARGEUR_MIN) / (LARGEUR_MAX - LARGEUR_MIN)
    const courbe = valeur * facteur(axe, w)
    const droite = bas + (haut - bas) * t
    const d = Math.abs(courbe - droite)
    if (d > pire) { pire = d; ou = w }
  }
  return { ecart: r4(pire), largeur: ou }
}

/* Les jetons. Deux axes d'espacement, un axe de rayon. */
export function jetons(socle) {
  const sortie = {}
  for (const axe of ['inline', 'block']) {
    for (const p of PROFONDEURS) {
      sortie[`${axe}-marge-${p}`] = { axe, base: socle.marges[p], ...clampDe(socle.marges[p], axe), ...ecartCourbeDroite(socle.marges[p], axe) }
      sortie[`${axe}-ecart-${p}`] = { axe, base: socle.ecarts[p], ...clampDe(socle.ecarts[p], axe), ...ecartCourbeDroite(socle.ecarts[p], axe) }
    }
  }
  for (const p of ['coque', 'carte', 'detail', 'controle']) {
    sortie[`radius-${p}`] = { axe: 'radius', base: socle.rayons[p], ...clampDe(socle.rayons[p], 'radius'), ...ecartCourbeDroite(socle.rayons[p], 'radius') }
  }
  /* Le bord structurel : la marge du niveau 1, posée sur le bord de la page. */
  sortie['inline-bord'] = { axe: 'inline', base: socle.bord, ...clampDe(socle.bord, 'inline'), ...ecartCourbeDroite(socle.bord, 'inline') }
  sortie['block-bord'] = { axe: 'block', base: socle.bord, ...clampDe(socle.bord, 'block'), ...ecartCourbeDroite(socle.bord, 'block') }
  /* Le texte, sur son axe propre. */
  for (const [nom, v] of Object.entries(socle.texte)) {
    sortie[`type-${nom}`] = { axe: 'type', base: v, ...clampDe(v, 'type'), ...ecartCourbeDroite(v, 'type') }
  }
  /* La cible tactile, sur le sien. */
  sortie['control-cible'] = { axe: 'control', base: socle.controle.cible, ...clampDe(socle.controle.cible, 'control'), ...ecartCourbeDroite(socle.controle.cible, 'control') }
  return sortie
}
