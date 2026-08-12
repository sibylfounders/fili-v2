import fs from 'node:fs'

/* Les valeurs d'expression ne sont pas écrites ici : elles viennent de la
   planche des registres, pièce du dépôt (fili/expression.json). Ce fichier ne
   fait que la traduire en utilitaires. Une valeur écrite ici et non dans la
   planche serait une valeur sans provenance — exactement ce que S6 devra
   rendre impossible.
   L'espace, lui, ne porte plus de nombre du tout : chaque utilitaire pointe sur
   la variable que la feuille générée pose, et le rythme continue donc de vivre
   après compilation. Ce que le Gardien refuse ne doit pas pouvoir s'écrire. */
const lire = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), 'utf8'))
const planche = lire('./fili/expression.json')
const registre = lire('./fili/registry.json')
const palette = lire('./fili/palette.json')

const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const depuis = (bloc, champ = 'valeur') =>
  Object.fromEntries(
    Object.entries(bloc)
      .filter(([cle]) => !cle.startsWith('$'))
      .map(([cle, v]) => [kebab(cle), v[champ]])
  )

/* Deux axes distincts, et le nom du jeton porte le sien. Une classe verticale
   qui appellerait un jeton horizontal n'existe donc pas : elle ne se compile
   pas, et le Gardien la voit avant même ça. */
const jetons = (famille) =>
  Object.fromEntries(
    registre.espacement.echelle.map((nom) => {
      const [axe, profondeur] = nom.split('-')
      return [nom, `var(--rr-${axe}-${famille}-${profondeur})`]
    })
  )
const marges = jetons('marge')
const ecarts = jetons('ecart')
/* L'ÉCART DE FRONTIÈRE. Deux crans au-dessus de l'écart du niveau, ce qui vaut
   exactement sa marge intérieure : on s'écarte d'un groupe autant qu'on s'écarte
   du bord. Aucun jeton nouveau — ces classes pointent sur les marges, seul leur
   nom change, parce qu'un écart et une marge ne se déclarent pas au même endroit.
   Décision d'Auteur du 2026-08-12. */
const frontieres = Object.fromEntries(
  Object.entries(marges).map(([nom, v]) => {
    const [axe, profondeur] = nom.split('-')
    return [`${axe}-frontiere-${profondeur}`, v]
  })
)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    /* Vide, et c'est voulu : plus aucune taille ni aucun espace ne descend d'une
       échelle de nombres anonyme. Les fractions et « full » restent, ce sont des
       rapports, pas des valeurs. */
    spacing: {},
    padding: marges,
    /* L'espace se pose par le conteneur, jamais par l'enfant — R3.2. La seule
       marge qui subsiste est le centrage, exception déclarée au registre. */
    margin: { auto: 'auto' },
    gap: { ...ecarts, ...frontieres },
    space: { ...ecarts, ...frontieres },
    screens: depuis(planche.bascules),
    extend: {
      /* Aucune couleur n'est écrite ici ni dans la planche : elles sont toutes
         calculées depuis la primaire par tools/fili/expression/palette.mjs.
         Un état expose son couple — surface et ce qui s'écrit dessus. */
      colors: {
        ...Object.fromEntries(Object.entries(palette.neutres).map(([k, v]) => [kebab(k), v])),
        ...Object.fromEntries(
          Object.entries(palette.etats).map(([nom, e]) => [
            kebab(nom),
            { surface: e.surface, sur: e.sur, plein: e.plein, 'sur-plein': e.surPlein, trait: e.trait },
          ])
        ),
      },
      fontFamily: Object.fromEntries(
        Object.entries(depuis(planche.familles)).map(([k, v]) => [k, v.split(',').map((f) => f.trim())])
      ),
      fontWeight: depuis(planche.graisses),
      fontSize: Object.fromEntries(
        Object.entries(planche.tailles)
          .filter(([cle]) => !cle.startsWith('$'))
          .map(([cle, v]) => [
            kebab(cle),
            [v.valeur, { lineHeight: v.interligne, ...(v.chasse ? { letterSpacing: v.chasse } : {}) }],
          ])
      ),
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
      width: { ...depuis(planche.taillesIcone), ...depuis(planche.squelette) },
      height: { ...depuis(planche.taillesIcone), ...depuis(planche.hauteurs), ...depuis(planche.squelette) },
    },
  },
  plugins: [],
}
