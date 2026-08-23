/**
 * VALIDATION ET RÉCUPÉRATION — le greffon.
 *
 * Point d'entrée séparé : `import { Validation, messagesFR } from "@fili/react/validation";`
 *
 * POURQUOI À PART (arbitrage Aurélien, 2026-07-30) : la chaîne de validation est un PLUS,
 * pas une condition d'usage du kit. Une page de contenu, un tableau de bord, un cadre
 * applicatif n'ont rien à valider — ils n'ont pas à charger le contrat, encore moins un jeu
 * de messages français. Le noyau (`@fili/react`) garde donc seulement la PRISE : la prop
 * `verdict` de `Input.Field`, `Select`, `Checkbox`, `Checkbox.Group` et `Radio.Group`, plus
 * les TYPES qui permettent de la déclarer. Ce qui la remplit vit ici.
 *
 * Conséquence assumée : deux chemins d'import pour un même domaine. C'est le prix d'une
 * frontière réelle — et c'est la même mécanique que `@fili/react/manifest`, qui n'entre pas
 * non plus dans le baril.
 */

// Le contrat lui-même — types, normalisation, priorité, obsolescence, projections, agrégation.
export * from "../lib/validation";

// Le wording de référence, en français. Aucune obligation de l'utiliser.
export { messagesFR, type MessagePack, type CleMessagesFR } from "./messages-fr";
