/* Le strict nécessaire de React pour rendre un témoin, et rien de plus.
 *
 * Un témoin est un ARRÊT SUR IMAGE : il montre un état déclaré par K2 §6, pas
 * une session. Les crochets d'état rendent donc toujours la valeur initiale,
 * et leur poseur ne fait rien — ce n'est pas une simplification, c'est la
 * définition d'un témoin. Si un écran n'était lisible qu'après une
 * interaction, l'état qu'il faut voir serait un état déclaré, et il serait
 * rendu comme les autres.
 *
 * L'identifiant est déterministe et remis à zéro avant chaque rendu : deux
 * exécutions de la chaîne doivent produire deux fichiers identiques, sans quoi
 * le face-à-face de deux générations montrerait un écart qui n'existe pas.
 */
let compteur = 0

export function reinitialiserId() {
  compteur = 0
}

export function useId() {
  compteur += 1
  return `t${String(compteur)}`
}

export function useState(initial) {
  return [typeof initial === 'function' ? initial() : initial, () => undefined]
}

export function useMemo(calcul) {
  return calcul()
}

export function useCallback(fn) {
  return fn
}

export function useRef(initial) {
  return { current: initial ?? null }
}

export function useEffect() {
  /* Un témoin ne vit pas : rien à déclencher après un rendu qui n'aura pas
     de suite. Le crochet existe pour que l'import ne casse pas, et il est
     volontairement muet. */
}

export const StrictMode = ({ children }) => children

export default { useId, useState, useMemo, useCallback, useRef, useEffect, StrictMode }
