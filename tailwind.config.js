import fs from 'node:fs'

/* Les valeurs d'expression ne sont pas écrites ici : elles viennent de la
   planche des registres, pièce du dépôt (fili.expression.json). Ce fichier ne
   fait que la traduire en utilitaires. Une valeur écrite ici et non dans la
   planche serait une valeur sans provenance — exactement ce que S6 devra
   rendre impossible.
   L'échelle d'espacement, elle, vient du registre que le Gardien lit : ce
   qu'il refuse ne doit pas pouvoir s'écrire. */
const lire = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), 'utf8'))
const planche = lire('./fili.expression.json')
const registre = lire('./fili.registry.json')

const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const depuis = (bloc, champ = 'valeur') =>
  Object.fromEntries(
    Object.entries(bloc)
      .filter(([cle]) => !cle.startsWith('$'))
      .map(([cle, v]) => [kebab(cle), v[champ]])
  )

const espacement = Object.fromEntries(
  registre.espacement.echelle.map((n) => [String(n), `${n * 4}px`])
)

/* Une taille porte son interligne : les séparer produirait deux listes qui
   divergent au premier oubli. */
const tailles = Object.fromEntries(
  Object.entries(planche.tailles)
    .filter(([cle]) => !cle.startsWith('$'))
    .map(([cle, v]) => [
      kebab(cle),
      [v.valeur, { lineHeight: v.interligne, ...(v.chasse ? { letterSpacing: v.chasse } : {}) }],
    ])
)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    spacing: { ...espacement, px: '1px' },
    screens: depuis(planche.bascules),
    extend: {
      colors: depuis(planche.tons),
      fontFamily: Object.fromEntries(
        Object.entries(depuis(planche.familles)).map(([k, v]) => [k, v.split(',').map((f) => f.trim())])
      ),
      fontWeight: depuis(planche.graisses),
      fontSize: tailles,
      maxWidth: depuis(planche.mesures),
      minWidth: depuis(planche.cibles),
      minHeight: depuis(planche.cibles),
      borderRadius: depuis(planche.rayons),
      /* Seules les deux épaisseurs entrent ici. « plein » et « tireté » sont des
         styles, pas des largeurs : Tailwind les porte en utilitaires statiques. */
      borderWidth: {
        systeme: planche.traits.systeme.valeur,
        marqueur: planche.traits.marqueur.valeur,
      },
      boxShadow: depuis(planche.elevations),
      opacity: Object.fromEntries(
        Object.entries(depuis(planche.opacites)).map(([k, v]) => [k, String(v)])
      ),
      zIndex: depuis(planche.plans),
      transitionDuration: depuis(planche.durees),
      transitionTimingFunction: depuis(planche.courbes),
      outlineWidth: { focus: planche.focus.epaisseur.valeur },
      outlineOffset: { focus: planche.focus.ecart.valeur },
      width: depuis(planche.taillesIcone),
      height: depuis(planche.taillesIcone),
    },
  },
  plugins: [],
}
