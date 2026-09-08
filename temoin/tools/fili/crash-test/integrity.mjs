/* Contrôle d'intégrité du gardien.
   Même logique que « pas de registre, pas de verdict », appliquée au juge :
   si une assertion du contrat n'est pas portée et active, la batterie refuse
   de rendre un verdict plutôt que d'afficher un vert qu'elle n'a pas mérité. */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const PATH_RULE = 'tools/fili/index.js'
export const PATH_CONFIG = 'tools/fili/eslint.crash.js'

export async function verifyIntegrity(root) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'fili/assertions.json'), 'utf8'))
  const source = fs.readFileSync(path.join(root, PATH_RULE), 'utf8')
  const plugin = (await import(pathToFileURL(path.join(root, PATH_RULE)).href)).default
  const config = fs.readFileSync(path.join(root, PATH_CONFIG), 'utf8')

  const states = new Map()
  for (const m of source.matchAll(/^const\s+([A-Z][A-Z0-9_]*)\s*=\s*(true|false)/gm))
    states.set(m[1], m[2] === 'true')

  const lacks = []
  for (const a of manifest.assertions) {
    if (!plugin.rules[a.rule]) { lacks.push(`${a.id} — la règle « ${a.rule} » n'existe pas dans le gardien`); continue }
    if (!new RegExp(`'fili/${a.rule}':\\s*'error'`).test(config))
      lacks.push(`${a.id} — la règle « ${a.rule} » n'est pas en erreur dans la configuration`)
    if (a.toggle === null) continue
    if (!states.has(a.toggle)) lacks.push(`${a.id} — interrupteur « ${a.toggle} » introuvable`)
    else if (states.get(a.toggle) !== true) lacks.push(`${a.id} — ÉTEINTE (${a.toggle} = false)`)
  }
  for (const inv of manifest.invariants || [])
    if (states.get(inv.name) !== inv.value) lacks.push(`invariant « ${inv.name} » altéré`)

  return { total: manifest.assertions.length, lacks }
}
