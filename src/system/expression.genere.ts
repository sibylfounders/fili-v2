/* GÉNÉRÉ depuis fili.icones.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-expression.mjs
   Source du jeu : dépannage — dessiné à la main faute d'accès au registre de paquets */

export const GRILLE = 16
export const TRAIT = 1.5

export const ICONES = {
  "verrou": [
    {
      "t": "path",
      "d": "M4.5 7V5a3.5 3.5 0 0 1 7 0v2"
    },
    {
      "t": "path",
      "d": "M3.5 7h9v6h-9z"
    }
  ],
  "attente": [
    {
      "t": "path",
      "d": "M8 3.5v4.5l3 2"
    },
    {
      "t": "circle",
      "cx": 8,
      "cy": 8,
      "r": 5.5
    }
  ],
  "idee": [
    {
      "t": "circle",
      "cx": 8,
      "cy": 8,
      "r": 5.5
    }
  ],
  "refus": [
    {
      "t": "path",
      "d": "M8 1.5 14.5 13.5h-13z"
    },
    {
      "t": "path",
      "d": "M8 6v3"
    },
    {
      "t": "path",
      "d": "M8 11.5v.01"
    }
  ],
  "information": [
    {
      "t": "circle",
      "cx": 8,
      "cy": 8,
      "r": 5.5
    },
    {
      "t": "path",
      "d": "M8 7.5v4"
    },
    {
      "t": "path",
      "d": "M8 4.5v.01"
    }
  ],
  "constat": [
    {
      "t": "path",
      "d": "M4 2.5h6l2.5 2.5v8.5h-8.5z"
    },
    {
      "t": "path",
      "d": "M10 2.5V5h2.5"
    },
    {
      "t": "path",
      "d": "M5.5 8h5"
    },
    {
      "t": "path",
      "d": "M5.5 10.5h3"
    }
  ],
  "mesure": [
    {
      "t": "path",
      "d": "M2.5 13.5v-5"
    },
    {
      "t": "path",
      "d": "M6.5 13.5v-8"
    },
    {
      "t": "path",
      "d": "M10.5 13.5v-3"
    },
    {
      "t": "path",
      "d": "M14.5 13.5v-11"
    }
  ]
} as const

export type NomIcone = keyof typeof ICONES
