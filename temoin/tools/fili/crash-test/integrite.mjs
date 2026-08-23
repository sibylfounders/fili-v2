/* Contrôle d'intégrité du gardien.
   Même logique que « pas de registre, pas de verdict », appliquée au juge :
   si une assertion du contrat n'est pas portée et active, la batterie refuse
   de rendre un verdict plutôt que d'afficher un vert qu'elle n'a pas mérité. */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const CHEMIN_REGLE = 'tools/fili/index.js'
export const CHEMIN_CONFIG = 'tools/fili/eslint.crash.js'

export async function verifierIntegrite(racine) {
  const manifeste = JSON.parse(fs.readFileSync(path.join(racine, 'fili/assertions.json'), 'utf8'))
  const source = fs.readFileSync(path.join(racine, CHEMIN_REGLE), 'utf8')
  const plugin = (await import(pathToFileURL(path.join(racine, CHEMIN_REGLE)).href)).default
  const config = fs.readFileSync(path.join(racine, CHEMIN_CONFIG), 'utf8')

  const etats = new Map()
  for (const m of source.matchAll(/^const\s+([A-Z][A-Z0-9_]*)\s*=\s*(true|false)/gm))
    etats.set(m[1], m[2] === 'true')

  const manques = []
  for (const a of manifeste.assertions) {
    if (!plugin.rules[a.regle]) { manques.push(`${a.id} — la règle « ${a.regle} » n'existe pas dans le gardien`); continue }
    if (!new RegExp(`'fili/${a.regle}':\\s*'error'`).test(config))
      manques.push(`${a.id} — la règle « ${a.regle} » n'est pas en erreur dans la configuration`)
    if (a.interrupteur === null) continue
    if (!etats.has(a.interrupteur)) manques.push(`${a.id} — interrupteur « ${a.interrupteur} » introuvable`)
    else if (etats.get(a.interrupteur) !== true) manques.push(`${a.id} — ÉTEINTE (${a.interrupteur} = false)`)
  }
  for (const inv of manifeste.invariants || [])
    if (etats.get(inv.nom) !== inv.valeur) manques.push(`invariant « ${inv.nom} » altéré`)

  return { total: manifeste.assertions.length, manques }
}
