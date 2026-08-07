import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { scanner } from './scanner.mjs'

const RACINE = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const registre = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.registry.json'), 'utf8'))

const CAS = [
  { id: 'H-KO-1', html: 'crash-tests/cible-html/piegees/bouton-nu.html',        css: null, attendu: 'BLOQUE', quoi: '<button> sans classe du système (R1.1)' },
  { id: 'H-KO-2', html: 'crash-tests/cible-html/piegees/etat-vide.html',        css: null, attendu: 'BLOQUE', quoi: "bloc d'état vide (R2.5)" },
  { id: 'H-KO-3', html: 'crash-tests/cible-html/piegees/page.html',             css: 'crash-tests/cible-html/piegees/applicative.css', attendu: 'BLOQUE', quoi: 'marge dans la feuille applicative (R3.2)' },
  { id: 'H-KO-4', html: 'crash-tests/cible-html/piegees/monotonie.html',        css: null, attendu: 'BLOQUE', quoi: 'trois sections identiques à la suite (R4.3)' },
  { id: 'H-OK-1', html: 'crash-tests/cible-html/conformes/bouton-systeme.html', css: null, attendu: 'PASSE', quoi: '<button> avec classe du système' },
  { id: 'H-OK-2', html: 'crash-tests/cible-html/conformes/etats-pleins.html',   css: null, attendu: 'PASSE', quoi: 'les quatre blocs d\'état remplis' },
  { id: 'H-OK-3', html: 'crash-tests/cible-html/conformes/page.html',           css: 'crash-tests/cible-html/conformes/applicative.css', attendu: 'PASSE', quoi: 'feuille sans marge, densités alternées' },
  { id: 'H-OK-4', html: 'crash-tests/cible-html/conformes/rupture.html',        css: null, attendu: 'PASSE', quoi: 'rupture déclarée avec motif' }
]

console.log('\nSECONDE CIBLE — HTML/CSS sans framework\n')
let ecarts = 0
for (const c of CAS) {
  const fautes = scanner(RACINE, c.html, c.css, registre)
  const obtenu = fautes.length > 0 ? 'BLOQUE' : 'PASSE'
  const ok = obtenu === c.attendu
  if (!ok) ecarts++
  console.log(`  ${ok ? '✅' : '❌'} ${c.id}  ${c.attendu.padEnd(7)} → ${obtenu.padEnd(7)} ${c.quoi}`)
  if (fautes.length) fautes.forEach((f) => console.log(`         ${f.regle} — ${f.quoi}`))
}
console.log(`\n  VERDICT : ${ecarts === 0 ? '🟢 les quatre assertions portées tiennent sur la seconde cible' : `🔴 ${ecarts} écart(s)`}\n`)
process.exit(ecarts === 0 ? 0 : 1)
