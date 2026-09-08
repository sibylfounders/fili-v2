import fs from 'node:fs'

/* Les valeurs d'expression ne sont pas écrites ici : elles viennent de la
   planche des registres, pièce du dépôt (fili/expression.json). Ce fichier ne
   fait que la traduire en utilitaires. Une valeur écrite ici et non dans la
   planche serait une valeur sans provenance — exactement ce que S6 devra
   rendre impossible.
   L'espace, lui, ne porte plus de nombre du tout : chaque utilitaire pointe sur
   la variable que la feuille générée pose, et le rythme continue donc de vivre
   après compilation. Ce que le Gardien refuse ne doit pas pouvoir s'écrire. */
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), 'utf8'))
const board = read('./fili/expression.json')
const registry = read('./fili/registry.json')
const palette = read('./fili/palette.json')

const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const since = (block, field = 'value') =>
  Object.fromEntries(
    Object.entries(block)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, v]) => [kebab(key), v[field]])
  )

/* Deux axes distincts, et le nom du jeton porte le sien. Une classe verticale
   qui appellerait un jeton horizontal n'existe donc pas : elle ne se compile
   pas, et le Gardien la voit avant même ça. */
const tokens = (family) =>
  Object.fromEntries(
    registry.spacing.scale.map((name) => {
      const [axis, depth] = name.split('-')
      return [name, `var(--rr-${axis}-${family}-${depth})`]
    })
  )
const margins = tokens('margin')
const gaps = tokens('gap')
/* L'ÉCART DE FRONTIÈRE. Deux crans au-dessus de l'écart du niveau, ce qui vaut
   exactement sa marge intérieure : on s'écarte d'un groupe autant qu'on s'écarte
   du bord. Aucun jeton nouveau — ces classes pointent sur les marges, seul leur
   nom change, parce qu'un écart et une marge ne se déclarent pas au même endroit.
   Décision d'Auteur du 2026-08-12. */
const boundaries = Object.fromEntries(
  Object.entries(margins).map(([name, v]) => {
    const [axis, depth] = name.split('-')
    return [`${axis}-boundary-${depth}`, v]
  })
)

/* LA PALETTE FERMÉE. Trois mots-clés qui ne sont pas des couleurs mais des
   comportements, puis les seules couleurs du système. Rien d'autre n'existe. */
const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  inherit: 'inherit',
  ...Object.fromEntries(Object.entries(palette.neutrals).map(([k, v]) => [kebab(k), v])),
  ...Object.fromEntries(
    Object.entries(palette.states).map(([name, e]) => [
      kebab(name),
      { surface: e.surface, on: e.on, full: e.full, 'on-full': e.onFull, stroke: e.stroke },
    ])
  ),
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    /* Vide, et c'est voulu : plus aucune taille ni aucun espace ne descend d'une
       échelle de nombres anonyme. Les fractions et « full » restent, ce sont des
       rapports, pas des valeurs. */
    spacing: {},
    padding: margins,
    /* L'espace se pose par le conteneur, jamais par l'enfant — R3.2. La seule
       marge qui subsiste est le centrage, exception déclarée au registre. */
    margin: { auto: 'auto' },
    gap: { ...gaps, ...boundaries },
    space: { ...gaps, ...boundaries },
    screens: since(board.toggles),
    /* Aucune couleur n'est écrite ici ni dans la planche : elles sont toutes
       calculées depuis la primaire par tools/fili/expression/palette.mjs.
       Un état expose son couple — surface et ce qui s'écrit dessus.
       DÉCLARÉ AU NIVEAU « theme » ET NON « extend », depuis le 2026-08-12 :
       sous « extend », les 242 couleurs par défaut de Tailwind restaient
       accessibles, et « bg-blue-600 » compilait sans que rien ne le voie. La
       palette calculée n'était donc pas une palette, seulement une addition.
       Ici, elle remplace : ce qui n'en vient pas ne compile plus. */
    colors: colors,
    extend: {
      fontFamily: Object.fromEntries(
        Object.entries(since(board.families)).map(([k, v]) => [k, v.split(',').map((f) => f.trim())])
      ),
      fontWeight: since(board.weights),
      fontSize: Object.fromEntries(
        Object.entries(board.sizes)
          .filter(([key]) => !key.startsWith('$'))
          .map(([key, v]) => [
            kebab(key),
            [v.value, { lineHeight: v.leading, ...(v.advance ? { letterSpacing: v.advance } : {}) }],
          ])
      ),
      maxWidth: since(board.measures),
      minWidth: since(board.targets),
      minHeight: since(board.targets),
      borderRadius: since(board.radii),
      /* Seules les deux épaisseurs entrent ici. « plein » et « tireté » sont des
         styles, pas des largeurs : Tailwind les porte en utilitaires statiques. */
      borderWidth: {
        system: board.strokes.system.value,
        marker: board.strokes.marker.value,
      },
      boxShadow: since(board.elevations),
      opacity: Object.fromEntries(
        Object.entries(since(board.opacities)).map(([k, v]) => [k, String(v)])
      ),
      zIndex: since(board.plans),
      transitionDuration: since(board.durations),
      transitionTimingFunction: since(board.curves),
      outlineWidth: { focus: board.focus.thickness.value },
      outlineOffset: { focus: board.focus.gap.value },
      width: { ...since(board.sizesIcon), ...since(board.skeleton) },
      height: { ...since(board.sizesIcon), ...since(board.heights), ...since(board.skeleton) },
    },
  },
  plugins: [],
}
