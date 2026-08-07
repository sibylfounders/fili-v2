import fs from 'node:fs'

/* Les valeurs d'expression ne sont pas écrites ici : elles viennent de la
   planche des registres, pièce du dépôt (fili.expression.json). Ce fichier
   ne fait que la traduire en utilitaires. Une valeur écrite ici et non dans
   la planche serait une valeur sans provenance — exactement ce que S6 devra
   rendre impossible. */
const planche = JSON.parse(fs.readFileSync(new URL('./fili.expression.json', import.meta.url), 'utf8'))
const registre = JSON.parse(fs.readFileSync(new URL('./fili.registry.json', import.meta.url), 'utf8'))

const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const depuis = (bloc, champ = 'valeur') =>
  Object.fromEntries(
    Object.entries(bloc)
      .filter(([cle]) => !cle.startsWith('$'))
      .map(([cle, v]) => [kebab(cle), v[champ]])
  )

/* L'échelle d'espacement vient du registre, pas de Tailwind : ce que le
   Gardien refuse ne doit pas pouvoir s'écrire. */
const espacement = Object.fromEntries(
  registre.espacement.echelle.map((n) => [String(n), `${n * 4}px`])
)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    spacing: { ...espacement, px: '1px' },
    extend: {
      colors: depuis(planche.tons),
      fontFamily: Object.fromEntries(
        Object.entries(depuis(planche.familles)).map(([k, v]) => [k, v.split(',').map((f) => f.trim())])
      ),
      fontWeight: depuis(planche.graisses),
      borderRadius: depuis(planche.rayons),
      boxShadow: depuis(planche.ombres),
      transitionDuration: depuis(planche.durees),
      transitionTimingFunction: depuis(planche.courbes),

      /* L'échelle typographique n'est pas dans la planche : la taille d'un
         titre découle de son niveau (R4.5), elle n'est pas un choix de lieu.
         Elle vit donc ici, avec le composant qui l'applique. */
      fontSize: {
        menu:    ['0.75rem',  { lineHeight: '1.2',  letterSpacing: '0.08em' }],
        fin:     ['0.875rem', { lineHeight: '1.5' }],
        corps:   ['1.0625rem', { lineHeight: '1.6' }],
        chapeau: ['1.1875rem', { lineHeight: '1.55' }],
        n3:      ['1.0625rem', { lineHeight: '1.35' }],
        n2:      ['clamp(1.375rem, 3vw, 1.875rem)', { lineHeight: '1.2' }],
        n1:      ['clamp(1.75rem, 4vw, 2.6rem)',    { lineHeight: '1.1' }],
      },
      maxWidth: { lecture: '66ch', large: '1120px' },
    },
  },
  plugins: [],
}
