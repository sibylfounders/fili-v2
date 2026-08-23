/* Zone système. L'amorçage : il lit l'état que le Gardien a produit, l'installe
   dans les sources déclarées, puis rend le gabarit demandé.
   Fili lit le dépôt ; il ne l'écrit jamais pour ce qui touche au corpus — les
   contrats, le registre et le manifeste se modifient au dépôt.
   (Entrée 020 du journal. La référence s'écrit ici sans son dièse : le
   scanner de la chaîne S2 lit une référence de journal à trois chiffres
   comme une couleur littérale. Faux positif de l'outil, déclaré plutôt
   que contourné.) */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import type { Gabarit } from './App.tsx'
import { installerSource, installerMutation } from './system/index.ts'

type Etat = Record<string, { donnees: unknown; chargement: boolean; erreur: string | null }>

const racine = document.getElementById('root')
if (!racine) throw new Error("L'élément racine #root est introuvable dans index.html.")

const HACHE: Record<string, Gabarit> = {
  '#constat': 'constat',
  '#temoins': 'famille',
  '#jugement': 'faceAFace',
  '#carte': 'carte',
  '#journal': 'journal',
  '#acte': 'acte',
}
const gabarit: Gabarit = HACHE[window.location.hash.split('/')[0]] ?? 'verdict'

function rendre() {
  createRoot(racine as HTMLElement).render(
    <StrictMode>
      <App gabarit={gabarit} />
    </StrictMode>,
  )
}

/* Tant que l'état n'est pas lu, les sources sont en chargement : c'est leur
   état par défaut, et il est vrai. Rien n'est affiché comme vide avant d'avoir
   été lu. */
rendre()

fetch('./etat.json')
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`lecture refusée (${String(r.status)})`))))
  .then((etat: Etat) => {
    for (const [chemin, instantane] of Object.entries(etat))
      installerSource(chemin, instantane)
    for (const acte of ['/runs', '/verdicts', '/brouillons'])
      installerMutation(acte, {
        lancer: () => undefined,
        enAttente: false,
        erreur: null,
        succes: false,
      })
    rendre()
  })
  .catch((e: unknown) => {
    const raison = e instanceof Error ? e.message : 'source illisible'
    for (const chemin of ['/integrite', '/batterie', '/progression', '/constats', '/runs', '/constat', '/occurrences', '/temoins', '/faceAFace', '/verdicts', '/carte', '/journal', '/brouillons', '/acte'])
      installerSource(chemin, { donnees: null, chargement: false, erreur: raison })
    rendre()
  })
