/* Produit l'état que Fili affiche, depuis le Gardien lui-même.
   Fili ne fabrique aucun chiffre : il montre ce que le Gardien a mesuré. Si
   le contrôle d'intégrité refuse de statuer, l'état produit porte ce refus —
   il ne le remplace pas par un zéro. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { executerBatterie, RACINE } from '../crash-test/battery.mjs'
import { verifierIntegrite } from '../crash-test/integrite.mjs'

const SORTIE = path.join(RACINE, 'public/etat.json')

const integrite = await verifierIntegrite(RACINE)

let etat
if (integrite.manques.length > 0) {
  const raison = integrite.manques.join(' · ')
  etat = Object.fromEntries(
    ['/integrite', '/batterie', '/progression', '/constats', '/runs'].map((c) => [
      c, { donnees: null, chargement: false, erreur: raison }
    ])
  )
} else {
  const r = await executerBatterie()
  const piegees = r.filter((x) => x.attendu === 'BLOQUE')
  const conformes = r.filter((x) => x.attendu === 'PASSE')
  const ecarts = r.filter((x) => !x.conforme)
  /* Le compte des mutations ne se déduit pas du manifeste : il se mesure en
     jouant les sabotages. Tant qu'un run de mutation n'a pas été versé, Fili
     dit qu'il ne l'a pas mesuré — il ne montre pas un nombre qu'il a inventé.
     C'est la leçon de #020 : un dispositif qui surestime ses propres garanties
     est le pire des dispositifs. */
  const cheminMut = path.join(RACINE, 'public/mutations.json')
  const mutations = fs.existsSync(cheminMut)
    ? JSON.parse(fs.readFileSync(cheminMut, 'utf8'))
    : null

  /* Les constats : une ligne par écart, l'assertion et son contrat d'abord. */
  const constats = ecarts.map((x) => ({
    id: x.id,
    assertion: x.id,
    contrat: x.quoi,
    occurrences: 1,
    fichiers: 1
  }))

  etat = {
    '/integrite': { donnees: { total: integrite.total, portees: integrite.total }, chargement: false, erreur: null },
    '/batterie': { donnees: { piegees: piegees.length, conformes: conformes.length, mutations, ecarts: ecarts.length }, chargement: false, erreur: null },
    '/progression': { donnees: { faites: r.length, total: r.length }, chargement: false, erreur: null },
    '/constats': { donnees: constats, chargement: false, erreur: null },
    '/runs': { donnees: [], chargement: false, erreur: null }
  }
}

fs.mkdirSync(path.dirname(SORTIE), { recursive: true })
fs.writeFileSync(SORTIE, JSON.stringify(etat, null, 2))
console.log('état produit →', path.relative(RACINE, SORTIE))
console.log('  intégrité :', integrite.manques.length === 0 ? `${integrite.total}/${integrite.total}` : 'REFUS DE STATUER')
