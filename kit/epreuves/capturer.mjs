/* CAPTURER UNE PAGE — kit/epreuves/capturer.mjs
   La pièce à montrer après le verrou : la page entière, à 1440 et à 320,
   dans les deux thèmes. Pas un test — un témoin.
   Lancer : KIT_DIST=.next-epreuves node epreuves/capturer.mjs rythme [dossier] */
import path from 'node:path'
import fs from 'node:fs'
import { ouvrirSite, ouvrirNavigateur } from './banc.mjs'

const page = process.argv[2] ?? 'rythme'
const dossier = process.argv[3] ?? path.join(process.cwd(), '..', '_to_delete', 'captures')
fs.mkdirSync(dossier, { recursive: true })
const site = await ouvrirSite(), nav = await ouvrirNavigateur()
for (const [largeur, theme] of [[1440, 'light'], [1440, 'dark'], [320, 'light']]) {
  const { p, fermer } = await nav.page(`${site.url}/${page}`, { largeur, theme })
  await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = false }))
  const f = path.join(dossier, `${page}-${largeur}-${theme}.png`)
  await p.screenshot({ path: f, fullPage: true })
  console.log(f)
  await fermer()
}
await nav.fermer(); site.fermer()
