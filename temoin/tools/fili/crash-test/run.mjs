import { runBattery, ROOT } from './battery.mjs'
import { verifyIntegrity } from './integrity.mjs'

const integrity = await verifyIntegrity(ROOT)
if (integrity.lacks.length > 0) {
  console.log('\nREFUS DE STATUER — le gardien n\'est pas entier\n')
  integrity.lacks.forEach((m) => console.log('  🔴 ' + m))
  console.log('\n  La batterie ne rend pas de verdict sur un juge incomplet.\n')
  process.exit(2)
}
console.log(`\n🛡  Intégrité du gardien : ${integrity.total}/${integrity.total} assertions portées et actives.`)

const r = await runBattery()
const line = (x) => `  ${x.compliant ? '✅' : '❌'} ${x.id.padEnd(6)} ${x.expected.padEnd(7)} → ${x.obtained.padEnd(7)} ${x.what}`

console.log('\nBATTERIE DE CRASH-TESTS — les cinq contrats S1 → S5\n')
console.log('  Fixtures piégées (doivent BLOQUER)')
r.filter((x) => x.expected === 'BLOQUE').forEach((x) => console.log(line(x)))
console.log('\n  Fixtures conformes (doivent PASSER)')
r.filter((x) => x.expected === 'PASSE').forEach((x) => console.log(line(x)))

const failures = r.filter((x) => !x.compliant)
console.log(`\n  VERDICT : ${failures.length === 0 ? '🟢 100 % — les cinq Sujets tiennent' : `🔴 ${failures.length} écart(s)`}\n`)
process.exit(failures.length === 0 ? 0 : 1)
