import { executerBatterie, RACINE } from './battery.mjs'
import { verifierIntegrite } from './integrite.mjs'

const integrite = await verifierIntegrite(RACINE)
if (integrite.manques.length > 0) {
  console.log('\nREFUS DE STATUER — le gardien n\'est pas entier\n')
  integrite.manques.forEach((m) => console.log('  🔴 ' + m))
  console.log('\n  La batterie ne rend pas de verdict sur un juge incomplet.\n')
  process.exit(2)
}
console.log(`\n🛡  Intégrité du gardien : ${integrite.total}/${integrite.total} assertions portées et actives.`)

const r = await executerBatterie()
const ligne = (x) => `  ${x.conforme ? '✅' : '❌'} ${x.id.padEnd(6)} ${x.attendu.padEnd(7)} → ${x.obtenu.padEnd(7)} ${x.quoi}`

console.log('\nBATTERIE DE CRASH-TESTS — les cinq contrats S1 → S5\n')
console.log('  Fixtures piégées (doivent BLOQUER)')
r.filter((x) => x.attendu === 'BLOQUE').forEach((x) => console.log(ligne(x)))
console.log('\n  Fixtures conformes (doivent PASSER)')
r.filter((x) => x.attendu === 'PASSE').forEach((x) => console.log(ligne(x)))

const echecs = r.filter((x) => !x.conforme)
console.log(`\n  VERDICT : ${echecs.length === 0 ? '🟢 100 % — les cinq Sujets tiennent' : `🔴 ${echecs.length} écart(s)`}\n`)
process.exit(echecs.length === 0 ? 0 : 1)
