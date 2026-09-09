// Balayage de la voix sur les six pages : ce que faultsWriting refuse, page par page.
// node --test tests/voice-scan.mjs  (KIT_DIST=.next-tests)
import test, { before, after } from 'node:test'
import { openSite, openBrowser, faultsWriting } from './bench.mjs'
let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
for (const page of ['rythme', 'composition', 'couleur', 'arrondis', 'typo', 'mouvement']) {
  test(`voix · ${page}`, async () => {
    const { p, close } = await nav.page(site.url + '/' + page, { width: 1440 })
    const f = await faultsWriting(p)
    console.log(`\n== ${page} : ${f.length} faute(s)\n` + f.map((x) => '  - ' + x).join('\n'))
    await close()
  })
}
