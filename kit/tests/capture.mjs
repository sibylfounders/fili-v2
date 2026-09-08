/* CAPTURER UNE PAGE — kit/tests/capture.mjs
   La pièce à montrer après le verrou : la page entière, à 1440 et à 320,
   dans les deux thèmes. Pas un test — un témoin.
   Lancer : KIT_DIST=.next-epreuves node tests/capture.mjs rythme [dossier] */
import path from 'node:path'
import fs from 'node:fs'
import { openSite, openBrowser } from './bench.mjs'

const page = process.argv[2] ?? 'rythme'
const folder = process.argv[3] ?? path.join(process.cwd(), '..', '_to_delete', 'captures')
fs.mkdirSync(folder, { recursive: true })
const site = await openSite(), nav = await openBrowser()
for (const [width, theme] of [[1440, 'light'], [1440, 'dark'], [320, 'light']]) {
  const { p, close } = await nav.page(`${site.url}/${page}`, { width, theme })
  await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = false }))
  const f = path.join(folder, `${page}-${width}-${theme}.png`)
  await p.screenshot({ path: f, fullPage: true })
  console.log(f)
  await close()
}
await nav.close(); site.close()
