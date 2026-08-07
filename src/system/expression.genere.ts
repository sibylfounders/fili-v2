/* GÉNÉRÉ depuis fili.expression.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-expression.mjs
   La planche est la source ; ce fichier n'en est que la traduction. */

/* Seules les icônes traversent : un tracé est une forme, et une forme se rend.
   Les tons, eux, vont directement de la planche aux utilitaires — les faire
   transiter par un module du produit ferait entrer des couleurs littérales en
   zone applicative, sans qu'aucun composant y gagne quoi que ce soit. */
export const ICONES = {
  "verrou": "M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v6h-9z",
  "attente": "M8 3.5v4.5l3 2M2.5 8a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0z",
  "idee": "M2.5 8a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0z",
  "refus": "M8 4.5v4.5M8 11.5v.5M8 1.5 14.5 13.5h-13z",
  "constat": "M4 2.5h6l2.5 2.5v8.5h-8.5zM10 2.5V5h2.5M5.5 8h5M5.5 10.5h3",
  "mesure": "M2.5 13.5v-5M6.5 13.5v-8M10.5 13.5v-3M14.5 13.5v-11"
} as const

export type NomIcone = keyof typeof ICONES
