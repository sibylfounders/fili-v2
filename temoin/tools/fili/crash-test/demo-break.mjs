import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const ESLINT = path.join(ROOT, 'node_modules/.bin/eslint')
const TRAP = path.join(ROOT, 'src/app/ScreenTrap.tsx')

const portail = () => {
  try { execFileSync(ESLINT, ['src'], { cwd: ROOT, stdio: 'pipe' }); return { code: 0, output: '' } }
  catch (e) { return { code: e.status ?? 1, output: (e.stdout?.toString() ?? '') + (e.stderr?.toString() ?? '') } }
}

console.log('\nLE PORTAIL DE BUILD — `npm run build` = `fili:check && vite build`\n')

console.log('1. Projet conforme, on franchit le portail :')
const a = portail()
console.log(a.code === 0 ? '   🟢 code de sortie 0 — le build peut continuer\n'
                         : `   🔴 code ${a.code} alors que le projet est conforme\n`)

fs.writeFileSync(TRAP, "export function ScreenTrap() {\n  return <button onClick={() => {}}>Supprimer</button>\n}\n")
console.log('2. On glisse un <button> natif dans un écran, on retente :')
const b = portail()
if (b.code === 0) console.log('   🔴 le portail a laissé passer — le tuyau ne tient pas\n')
else {
  console.log(`   🟢 code de sortie ${b.code} — le build s'arrête ici. Message rendu au développeur :`)
  b.output.split('\n').filter((l) => l.includes('FILI') || l.includes('ScreenTrap')).forEach((l) => console.log('     ' + l.trim()))
  console.log('')
}
fs.unlinkSync(TRAP)
process.exit(a.code === 0 && b.code !== 0 ? 0 : 1)
