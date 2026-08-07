/* Runtime minimal : rend un arbre JSX en HTML, sans dépendance.
   Il ne sert qu'au rendu du témoin — il ne fait pas partie du système. */
export const Fragment = Symbol('Fragment')
export function h(type, props, ...enfants) {
  return { type, props: props || {}, enfants: enfants.flat(Infinity) }
}

const VIDES = new Set(['area','base','br','col','hr','img','input','link','meta','source'])
/* Les attributs SVG s'écrivent en camelCase dans le JSX et en kebab dans le
   document : sans cette table, un tracé rendu par le témoin ne porterait ni
   épaisseur ni extrémités, et le témoin mentirait sur ce que le navigateur
   affiche. Ajoutée en K5, avec l'entrée des icônes au registre d'expression. */
const ATTR = {
  className: 'class', htmlFor: 'for',
  strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin', strokeDasharray: 'stroke-dasharray',
  strokeOpacity: 'stroke-opacity', fillRule: 'fill-rule', clipRule: 'clip-rule',
  fillOpacity: 'fill-opacity', stopColor: 'stop-color'
}
const echapper = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

function attributs(props) {
  return Object.entries(props)
    .filter(([k, v]) => k !== 'children' && k !== 'key' && !k.startsWith('on') &&
                        v !== false && v !== null && v !== undefined)
    .map(([k, v]) => `${ATTR[k] || k}="${echapper(v === true ? '' : v)}"`)
    .map((s) => ' ' + s).join('')
}

export function rendre(noeud) {
  if (noeud === null || noeud === undefined || noeud === false || noeud === true) return ''
  if (Array.isArray(noeud)) return noeud.map(rendre).join('')
  if (typeof noeud === 'string' || typeof noeud === 'number') return echapper(noeud)
  const { type, props, enfants } = noeud
  const tous = props.children !== undefined ? [].concat(props.children) : enfants
  if (type === Fragment) return rendre(tous)
  if (typeof type === 'function') return rendre(type({ ...props, children: enfants.length ? (enfants.length === 1 ? enfants[0] : enfants) : props.children }))
  if (VIDES.has(type)) return `<${type}${attributs(props)} />`
  return `<${type}${attributs(props)}>${rendre(tous)}</${type}>`
}
