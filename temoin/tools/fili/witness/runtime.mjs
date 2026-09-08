/* Runtime minimal : rend un arbre JSX en HTML, sans dépendance.
   Il ne sert qu'au rendu du témoin — il ne fait pas partie du système. */
export const Fragment = Symbol('Fragment')
export function h(type, props, ...children) {
  return { type, props: props || {}, children: children.flat(Infinity) }
}

const EMPTY = new Set(['area','base','br','col','hr','img','input','link','meta','source'])
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
const escape = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

function attributes(props) {
  return Object.entries(props)
    .filter(([k, v]) => k !== 'children' && k !== 'key' && !k.startsWith('on') &&
                        v !== false && v !== null && v !== undefined)
    .map(([k, v]) => `${ATTR[k] || k}="${escape(v === true ? '' : v)}"`)
    .map((s) => ' ' + s).join('')
}

export function toRender(node) {
  if (node === null || node === undefined || node === false || node === true) return ''
  if (Array.isArray(node)) return node.map(toRender).join('')
  if (typeof node === 'string' || typeof node === 'number') return escape(node)
  const { type, props, children } = node
  const all = props.children !== undefined ? [].concat(props.children) : children
  if (type === Fragment) return toRender(all)
  if (typeof type === 'function') return toRender(type({ ...props, children: children.length ? (children.length === 1 ? children[0] : children) : props.children }))
  if (EMPTY.has(type)) return `<${type}${attributes(props)} />`
  return `<${type}${attributes(props)}>${toRender(all)}</${type}>`
}
