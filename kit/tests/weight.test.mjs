/* LE CRASH-TEST DE LA GRAISSE — kit/tests/weight.test.mjs (9 septembre 2026)
   T13 : une graisse est un rôle — le courant, l'étiquette, le titre — jamais
   un nombre posé à la main. T14 : deux fonds, deux graisses — en sombre chaque
   rôle s'allège du même écart, dit au moteur.
   Ce qui doit être vrai à l'écran, sur les six pages et l'accueil, dans les
   deux thèmes : toute graisse RENDUE est l'un des trois rôles (le rôle allégé
   en sombre), sauf l'élément dont la feuille dit la casse ou le hors chaîne
   sur sa ligne (les objets imités de /composition, à leur graisse).
   Le moteur prédit (WEIGHT) ; le navigateur calcule ; on lit getComputedStyle. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { WEIGHT } from '../derivation.mjs'
import { KIT, openSite, openBrowser, selectorsDeclaredAll } from './bench.mjs'

const PAGES = ['/', '/typo', '/rythme', '/couleur', '/composition', '/arrondis', '/mouvement']
const THEMES = ['light', 'dark']
const ROLES = Object.keys(WEIGHT.roles)
const setOf = (theme) => ROLES.map((r) => (theme === 'dark' ? WEIGHT.dark(r) : WEIGHT.roles[r]))

/* Les feuilles du kit — les sélecteurs dont la ligne pose la graisse et la déclare */
const sheets = () => {
  const read = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? read(path.join(d, f.name)) : f.name.endsWith('.css') ? [path.join(d, f.name)] : []))
  return read(path.join(KIT, 'app')).map((f) => fs.readFileSync(f, 'utf8'))
}
const declared = () => [...new Set(sheets().flatMap((src) => [...selectorsDeclaredAll(src, 'font-weight'), ...selectorsDeclaredAll(src, 'font')]))]

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })

test('le moteur : trois rôles, un seul écart, la sombre jamais plus lourde', () => {
  assert.deepEqual(ROLES, ['body', 'label', 'heading'])
  assert.ok(WEIGHT.gapDark >= 0)
  for (const r of ROLES) assert.equal(WEIGHT.roles[r] - WEIGHT.dark(r), WEIGHT.gapDark)
})

for (const theme of THEMES) {
  test(`${theme} · sur les sept pages, toute graisse rendue est l'un des trois rôles — ${setOf(theme).join(' / ')} — hors les éléments dont la feuille déclare la casse ou le hors chaîne`, async () => {
    const exempt = declared()
    for (const page of PAGES) {
      const { p, errors, close } = await nav.page(site.url + page, { width: 1440, theme })
      const faults = await p.evaluate(({ light, dark, exempt, theme }) => {
        const out = []
        const seen = new Map()
        for (const e of document.body.querySelectorAll('*')) {
          if (/^(script|style|noscript|svg|path|line|circle|rect|g|defs|use)$/i.test(e.tagName)) continue
          if (exempt.some((s) => { try { return e.closest(s) } catch { return false } })) continue
          /* une scène qui déclare son propre thème (les deux fonds de /typo) rend le jeu de ce thème */
          const scene = e.closest('[data-theme]')
          const set = (scene ? scene.getAttribute('data-theme') : theme) === 'dark' ? dark : light
          const w = parseFloat(getComputedStyle(e).fontWeight)
          if (set.includes(w)) continue
          const key = `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''} → ${w}`
          if (!seen.has(key)) { seen.set(key, 1); out.push(key) } else seen.set(key, seen.get(key) + 1)
        }
        return out
      }, { light: setOf('light'), dark: setOf('dark'), exempt, theme })
      assert.deepEqual(faults.slice(0, 30), [], `${page} en ${theme} : ${faults.length} graisse(s) hors rôle`)
      assert.deepEqual(errors, [], `${page} en ${theme} : erreurs de page`)
      await close()
    }
  })
}
