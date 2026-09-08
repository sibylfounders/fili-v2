import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { scanner } from './scanner.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/registry.json'), 'utf8'))

const INSTANCE = [
  { id: 'H-KO-1', html: 'crash-tests/target-html/trapped/button-bare.html',        css: null, expected: 'BLOQUE', what: '<button> sans classe du système (R1.1)' },
  { id: 'H-KO-2', html: 'crash-tests/target-html/trapped/state-empty.html',        css: null, expected: 'BLOQUE', what: "bloc d'état vide (R2.5)" },
  { id: 'H-KO-3', html: 'crash-tests/target-html/trapped/page.html',             css: 'crash-tests/target-html/trapped/applicative.css', expected: 'BLOQUE', what: 'marge dans la feuille applicative (R3.2)' },
  { id: 'H-KO-4', html: 'crash-tests/target-html/trapped/monotony.html',        css: null, expected: 'BLOQUE', what: 'trois sections identiques à la suite (R4.3)' },
  { id: 'H-OK-1', html: 'crash-tests/target-html/compliant/button-system.html', css: null, expected: 'PASSE', what: '<button> avec classe du système' },
  { id: 'H-OK-2', html: 'crash-tests/target-html/compliant/states-full.html',   css: null, expected: 'PASSE', what: 'les quatre blocs d\'état remplis' },
  { id: 'H-OK-3', html: 'crash-tests/target-html/compliant/page.html',           css: 'crash-tests/target-html/compliant/applicative.css', expected: 'PASSE', what: 'feuille sans marge, densités alternées' },
  { id: 'H-OK-4', html: 'crash-tests/target-html/compliant/rupture.html',        css: null, expected: 'PASSE', what: 'rupture déclarée avec motif' }
]

console.log('\nSECONDE CIBLE — HTML/CSS sans framework\n')
let gaps = 0
for (const c of INSTANCE) {
  const faults = scanner(ROOT, c.html, c.css, registry)
  const obtained = faults.length > 0 ? 'BLOQUE' : 'PASSE'
  const ok = obtained === c.expected
  if (!ok) gaps++
  console.log(`  ${ok ? '✅' : '❌'} ${c.id}  ${c.expected.padEnd(7)} → ${obtained.padEnd(7)} ${c.what}`)
  if (faults.length) faults.forEach((f) => console.log(`         ${f.rule} — ${f.what}`))
}
console.log(`\n  VERDICT : ${gaps === 0 ? '🟢 les quatre assertions portées tiennent sur la seconde cible' : `🔴 ${gaps} écart(s)`}\n`)
process.exit(gaps === 0 ? 0 : 1)
