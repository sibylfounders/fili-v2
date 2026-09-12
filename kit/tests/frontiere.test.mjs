/* LA FRONTIÈRE KIT / COQUE / DÉMOS — kit/tests/frontiere.test.mjs (12 septembre 2026, journal #142).
   Grave dans le marbre la façon d'écrire le CSS du front :
     · kit.css   — LE SOCLE LIVRABLE : primitives, patterns, et le halo de focus. Rien d'autre.
     · app.css   — la coque du site de doc (chargée partout après kit.css). Pas le kit.
     · demo.css  — l'outillage commun des démonstrations, chargé UNIQUEMENT par les pages qui montrent des preuves.
     · <page>.css — le décor propre à une page, chargé par sa seule route.
   Une seule chose peut faire dévier ce contrat sans qu'on le voie : qu'un décor de démo retombe
   dans le socle. Cette épreuve le refuse. */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (f) => fs.readFileSync(path.join(KIT, f), 'utf8')
const FONDATIONS = ['rythme', 'typo', 'arrondis', 'couleur', 'composition', 'mouvement', 'adaptation', 'moteur-essai']

/* les classes de décor : préfixes de page et d'outillage de démo — jamais définies dans le socle */
const DECOR = /\.(bn|cm|cp|co|mk|gm|acc|cl|cb|ad|mv|trace|gaze)-|\.(tiles?|preview|space|bench|panel-code|tr-btn|gd-|demo-|doc-band|doc-panel|etage)\b/
/* ce qui, posé sur un tel sélecteur, serait du DÉCOR (apparence, mise en page) — interdit au socle */
const APPARENCE = /(^|;)\s*(display|grid-template|grid-column|grid-row|grid-area|padding|margin|background|gap|row-gap|column-gap|font-size|width|height|aspect-ratio|flex|justify-|align-|inset:|top:|left:|right:|bottom:|opacity|transform|transition|animation)/

test('le socle ne charge que kit.css et app.css — jamais une démo ni un décor de page', () => {
  const layout = read('app/layout.tsx')
  assert.ok(/import "\.\/kit\.css"/.test(layout), 'layout importe kit.css')
  assert.ok(/import "\.\/app\.css"/.test(layout), 'layout importe app.css')
  assert.ok(!/globals\.css/.test(layout), 'plus de globals.css')
  assert.ok(!/demo\.css/.test(layout), 'le socle ne charge PAS demo.css')
  assert.ok(!/couleur\/color|accueil\.css|composition\.css/.test(layout), 'le socle ne charge aucun décor de page')
})

test('demo.css est chargé par chaque page de Fondations, et par aucune autre', () => {
  for (const r of FONDATIONS) assert.ok(read(`app/${r}/page.tsx`).includes('../demo.css'), `${r} importe demo.css`)
  assert.ok(!read('app/page.tsx').includes('demo.css'), 'l\'accueil ne charge pas l\'outillage des démos')
})

test('kit.css est neutre en mise en page : aucune requête de fenêtre ni de conteneur', () => {
  const kit = read('app/kit.css')
  assert.ok(!/@media[^{]*\b(width|min-width|max-width)\b/.test(kit), 'kit.css : pas de requête média de largeur')
  assert.ok(!/@container/.test(kit), 'kit.css : pas de requête de conteneur')
})

test('kit.css ne style JAMAIS l\'apparence d\'une démo — le halo de focus mis à part', () => {
  const kit = read('app/kit.css')
  const faults = []
  /* on lit règle par règle : sélecteur { corps } */
  for (const m of kit.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim(), body = m[2]
    if (sel.startsWith('@') || sel.startsWith(':root') || sel.startsWith('/*')) continue
    if (!DECOR.test(sel)) continue                 /* le sélecteur ne parle pas d'une démo : rien à vérifier */
    if (sel.startsWith(':is(') || sel.includes(':focus')) continue /* la loi du focus atteint tout ce qui est focusable, démos comprises */
    if (APPARENCE.test(body)) faults.push(`${sel.slice(0, 60)} { ${body.trim().slice(0, 50)}… }`)
  }
  assert.deepEqual(faults, [], `du décor de démo dans le socle (kit.css) — il doit vivre dans demo.css ou le CSS de la page :\n  ${faults.join('\n  ')}`)
})
