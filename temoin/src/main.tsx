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
import type { Template } from './App.tsx'
import { installSource, installMutation } from './system/index.ts'

type State = Record<string, { data: unknown; loading: boolean; error: string | null }>

const root = document.getElementById('root')
if (!root) throw new Error("L'élément racine #root est introuvable dans index.html.")

const HASH: Record<string, Template> = {
  '#finding': 'finding',
  '#witnesses': 'family',
  '#jugement': 'faceAFace',
  '#card': 'card',
  '#journal': 'journal',
  '#act': 'act',
}
const template: Template = HASH[window.location.hash.split('/')[0]] ?? 'verdict'

function toRender() {
  createRoot(root as HTMLElement).render(
    <StrictMode>
      <App template={template} />
    </StrictMode>,
  )
}

/* Tant que l'état n'est pas lu, les sources sont en chargement : c'est leur
   état par défaut, et il est vrai. Rien n'est affiché comme vide avant d'avoir
   été lu. */
toRender()

fetch('./state.json')
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`lecture refusée (${String(r.status)})`))))
  .then((state: State) => {
    for (const [path, snapshot] of Object.entries(state))
      installSource(path, snapshot)
    for (const act of ['/runs', '/verdicts', '/brouillons'])
      installMutation(act, {
        launch: () => undefined,
        inWaiting: false,
        error: null,
        success: false,
      })
    toRender()
  })
  .catch((e: unknown) => {
    const reason = e instanceof Error ? e.message : 'source illisible'
    for (const path of ['/integrite', '/batterie', '/progression', '/constats', '/runs', '/constat', '/occurrences', '/temoins', '/faceAFace', '/verdicts', '/carte', '/journal', '/brouillons', '/acte'])
      installSource(path, { data: null, loading: false, error: reason })
    toRender()
  })
