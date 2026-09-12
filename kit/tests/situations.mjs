/* LES TREIZE SITUATIONS — kit/tests/situations.mjs (11 septembre 2026)
   La matrice N2 : des surfaces, jamais des tailles d'écran à viser. Elle vivait dans
   postures.test.mjs ; elle en sort pour que l'épreuve des voisins (verify.mjs) passe le
   même chemin — n'importe quel HTML, treize fois, débords compris.

   Le pliable est le livre de /adaptation : 400 × 571 par panneau, charnière de 4 px ;
   0° fermé (écran extérieur), 125° largement ouvert (deux segments, Livre ; tourné,
   Laptop), 180° à plat (une surface). */
import { SURFACES } from '../derivation.mjs'

export const FOLD = { side: 400, long: 571, mask: 4 }
const M = SURFACES.mobile, T = SURFACES.tablet, D = SURFACES.desktop /* les trois surfaces du moteur, celles de la bande d'atelier */

export const MATRIX = [
  { name: 'Mobile · portrait', w: M.w, h: M.h },
  { name: 'Mobile · paysage', w: M.h, h: M.w },
  { name: 'Tablette · portrait', w: T.w, h: T.h },
  { name: 'Tablette · paysage', w: T.h, h: T.w },
  { name: 'Desktop · 1440', w: D.w, h: D.h },
  { name: 'Desktop · 1024', w: 1024, h: 720 },
  { name: 'Desktop · 720', w: 720, h: 900 },
  { name: 'Pliable · 0° fermé', w: FOLD.side, h: FOLD.long },
  { name: 'Pliable · 0° fermé · tourné', w: FOLD.long, h: FOLD.side },
  { name: 'Pliable · 125° Livre', w: 2 * FOLD.side, h: FOLD.long, feature: { orientation: 'vertical', offset: FOLD.side - FOLD.mask / 2, maskLength: FOLD.mask } },
  { name: 'Pliable · 125° Laptop', w: FOLD.long, h: 2 * FOLD.side, feature: { orientation: 'horizontal', offset: FOLD.side - FOLD.mask / 2, maskLength: FOLD.mask } },
  { name: 'Pliable · 180° à plat', w: 2 * FOLD.side, h: FOLD.long },
  { name: 'Pliable · 180° à plat · tourné', w: FOLD.long, h: 2 * FOLD.side },
]

/* la géométrie des segments d'une situation, calculée ici — pas lue sur la page */
export function segmentsOf(s) {
  if (!s.feature) return [{ x: 0, y: 0, w: s.w, h: s.h }]
  const { orientation, offset, maskLength } = s.feature
  return orientation === 'vertical'
    ? [{ x: 0, y: 0, w: offset, h: s.h }, { x: offset + maskLength, y: 0, w: s.w - offset - maskLength, h: s.h }]
    : [{ x: 0, y: 0, w: s.w, h: offset }, { x: 0, y: offset + maskLength, w: s.w, h: s.h - offset - maskLength }]
}
export const hingeOf = (s) => (s.feature ? (s.feature.orientation === 'vertical' ? 'vertical' : 'horizontal') : null)

/* Ouvrir une page dans une situation : la surface et la pliure sont imposées au navigateur
   par l'émulation (ce que DevTools fait avec un Galaxy Fold en « écran double »), AVANT le
   chargement — la page compose dès son premier rendu, comme sur l'appareil. */
export async function openIn(browser, url, s, { init } = {}) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, reducedMotion: 'reduce' })
  if (init) await ctx.addInitScript(init.fn, init.arg)
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(String(e)))
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  const cdp = await ctx.newCDPSession(p)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: s.w, height: s.h, deviceScaleFactor: 1, mobile: false, ...(s.feature ? { displayFeature: s.feature } : {}) })
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(120) /* une couche qui lit après le premier rendu a le temps de le faire */
  return { p, errors, close: () => ctx.close() }
}
