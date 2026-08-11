/* GÉNÉRÉ depuis fili/icones.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-expression.mjs
   Source du jeu : lucide-static 1.30.0 (ISC) */

export const GRILLE = 24
export const TRAIT = 2

export const ICONES = {
  "verrou": [
    {
      "t": "rect",
      "width": 18,
      "height": 11,
      "x": 3,
      "y": 11,
      "rx": 2,
      "ry": 2
    },
    {
      "t": "path",
      "d": "M7 11V7a5 5 0 0 1 10 0v4"
    }
  ],
  "attente": [
    {
      "t": "circle",
      "cx": 12,
      "cy": 12,
      "r": 10
    },
    {
      "t": "path",
      "d": "M12 6v6l4 2"
    }
  ],
  "idee": [
    {
      "t": "circle",
      "cx": 12,
      "cy": 12,
      "r": 10
    }
  ],
  "refus": [
    {
      "t": "path",
      "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
    },
    {
      "t": "path",
      "d": "M12 9v4"
    },
    {
      "t": "path",
      "d": "M12 17h.01"
    }
  ],
  "information": [
    {
      "t": "circle",
      "cx": 12,
      "cy": 12,
      "r": 10
    },
    {
      "t": "path",
      "d": "M12 16v-4"
    },
    {
      "t": "path",
      "d": "M12 8h.01"
    }
  ],
  "constat": [
    {
      "t": "path",
      "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
    },
    {
      "t": "path",
      "d": "M14 2v5a1 1 0 0 0 1 1h5"
    },
    {
      "t": "path",
      "d": "M10 9H8"
    },
    {
      "t": "path",
      "d": "M16 13H8"
    },
    {
      "t": "path",
      "d": "M16 17H8"
    }
  ],
  "mesure": [
    {
      "t": "path",
      "d": "M3 3v16a2 2 0 0 0 2 2h16"
    },
    {
      "t": "path",
      "d": "M18 17V9"
    },
    {
      "t": "path",
      "d": "M13 17V5"
    },
    {
      "t": "path",
      "d": "M8 17v-3"
    }
  ]
} as const

export type NomIcone = keyof typeof ICONES
