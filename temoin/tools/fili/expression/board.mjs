/* La planche des registres, rendue depuis la planche elle-même.
   Pièce du Temps ③ de la séance, et étalon de B-4. Elle ne montre AUCUN écran
   du produit : le froid de la séance appartient à l'Auteur, et il ne se dépense
   pas pour un arbitrage de valeurs. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/expression.json'), 'utf8'))
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/labels.json'), 'utf8'))
const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/registry.json'), 'utf8'))
const DECK = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/icons.json'), 'utf8'))
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/palette.json'), 'utf8'))
const DATE = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : '2026-08-07'

const items = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'))
const t = (n) => PAL.neutrals[n]
const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

/* Cette page compose son style à la main : elle ne passe pas par la chaîne
   Tailwind, et rien ne lui apportait donc les déclarations de fonte. Elle
   nommait les trois voix de la charte et n'en affichait aucune. */
const { dropFonts, blockFonts } = await import(
  new URL('../witness/fonts.mjs', import.meta.url).href)
dropFonts()
const FONTS = blockFonts('../files/')

const channel = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const lum = (h) => { const n = h.replace('#',''); const [r,g,b]=[0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255); return 0.2126*channel(r)+0.7152*channel(g)+0.0722*channel(b) }
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return ((x+0.05)/(y+0.05)).toFixed(2) }
const contrast = ratio

const attribute = (f) => Object.entries(f).filter(([k]) => k !== 't').map(([k, x]) => `${k}="${String(x)}"`).join(' ')
const drawing = (name, px) => `<svg viewBox="0 0 ${String(DECK.$grid)} ${String(DECK.$grid)}" width="${String(px)}" height="${String(px)}" fill="none" stroke="${t('ink')}" stroke-width="${String(DECK.$stroke)}" stroke-linecap="round" stroke-linejoin="round">${
  (DECK.shapes[name] || []).map((f) => `<${f.t} ${attribute(f)} />`).join('')}</svg>`

const card = (body, key) => `<div class="card">${key ? `<div class="preview">${key}</div>` : ''}<div class="body">${body}</div></div>`
const caption = (name, val, use, plus = '') =>
  `<p class="name">${e(name)}</p>${val !== null ? `<p class="val">${e(val)}</p>` : ''}<p class="use">${e(use)}</p>${plus}`

const RENDER = {
  tones: ([n, v]) => card(
    caption(n, v.value, v.use,
      ['paper','paperHollow','paperHover','paperSelection','inkInverse','stroke','inkOff'].includes(n)
        ? '' : `<p class="measure">sur le papier : <b>${ratio(v.value, t('paper'))}:1</b></p>`),
    `<div style="height:64px;background:${v.value}"></div>`),
  families: ([n, v]) => card(
    `<p class="name">${n}</p><p class="sample" style="font-family:${v.value}">Le juge est-il entier ?</p><p class="use">${e(v.use)}</p>`),
  weights: ([n, v]) => card(
    `<p class="name">${n} · ${v.value}</p><p class="sample small" style="font-weight:${v.value}">Arbitrage de lecture</p><p class="use">${e(v.use)}</p>`),
  sizes: ([n, v]) => card(
    `<p class="name">${n} · ${e(v.value)} / ${e(v.leading)}</p><p style="font-size:${v.value};line-height:${v.leading};${v.advance?`letter-spacing:${v.advance};text-transform:uppercase;`:''}margin:0 0 8px;font-family:${P.families.current.value}">Ce qui compte d'abord</p><p class="use">${e(v.use)}</p>`),
  icons: ([n, v]) => card(
    `${drawing(n, 28)}<p class="name">${n}</p><p class="val">${e(v.lucide)}</p><p class="use">${e(v.use)}</p>`),
  sizesIcon: ([n, v]) => card(
    `${drawing('finding', parseInt(v.value))}<p class="name">${n} · ${e(v.value)}</p><p class="use">${e(v.use)}</p>`),
  radii: ([n, v]) => card(
    `<div style="width:72px;height:40px;background:${t('paperHollow')};border:1px solid ${t('strokeNet')};border-radius:${v.value};margin-bottom:10px"></div>${caption(n, v.value, v.use)}`),
  strokes: ([n, v]) => card(
    `<div style="width:100%;height:0;border-top:${/px/.test(v.value)?v.value:'1px'} ${/px/.test(v.value)?'solid':v.value} ${t('strokeNet')};margin-bottom:12px"></div>${caption(n, v.value, v.use)}`),
  elevations: ([n, v]) => card(
    `<div style="width:100%;height:44px;background:${t('paper')};border-radius:${P.radii.card.value};box-shadow:${v.value};margin-bottom:12px"></div>${caption(n, v.value, v.use)}`),
  opacities: ([n, v]) => card(
    `<div style="height:44px;background:${t('ink')};opacity:${v.value};margin-bottom:12px;border-radius:${P.radii.detail.value}"></div>${caption(n, String(v.value), v.use)}`),
  targets: ([n, v]) => card(
    `<div style="width:${v.value};height:${v.value};max-width:100%;background:${t('paperSelection')};border:1px solid ${t('strokeNet')};border-radius:${P.radii.detail.value};margin-bottom:12px"></div>${caption(n, v.value, v.use)}`),
}
const generic = ([n, v]) => card(caption(n, Array.isArray(v.value) ? v.value.join(' · ') : String(v.value), v.use))

const HEADINGS = {
  tones: 'Les tons', families: 'Les familles', weights: 'Les graisses', sizes: 'Les tailles de texte',
  measures: 'Les mesures', toggles: 'Les points de bascule', grid: 'La grille', opacities: 'Les opacités',
  strokes: 'Les traits', focus: "L'anneau de focus", targets: 'Les cibles', icons: 'Les icônes',
  sizesIcon: 'Les tailles de lecture des icônes', radii: 'Les rayons', elevations: 'Les élévations',
  plans: 'Les plans de superposition', veil: 'Le voile', durations: 'Les durées', curves: 'Les courbes',
  expectations: "Les formes d'attente",
}

const block = (key) => {
  const b = P[key]
  const render = RENDER[key] || generic
  /* Tout champ de méta se montre : une note écrite dans la planche et non rendue
     sur la planche est une note qui n'existe pas pour celui qui la regarde. */
  const LABEL = {
    $source: 'Provenance', $gap: 'Écart déclaré', $regime: 'Régime', $shape: 'Shape',
    $leading: 'Interligne', $rule: 'Règle', $lack: 'Manque signalé',
    $removed: 'Retiré', $status: 'Statut', $reason: 'Motif',
  }
  const extras = Object.entries(b)
    .filter(([k]) => k.startsWith('$') && k !== '$intention')
    .map(([k, v]) =>
      k === '$dette' || k === '$interdit'
        ? `<p class="forbidden">${k === '$dette' ? 'Debt' : 'Interdit'} — ${e(v)}</p>`
        : `<p class="source">${LABEL[k] ? LABEL[k] + ' — ' : ''}${e(v)}</p>`
    ).join('')
  return `<section><h2>${HEADINGS[key] || key}</h2>
  <p class="intent">${e(b.$intent || '')}</p>${extras}
  <div class="grid">${items(b).map(render).join('')}</div></section>`
}

const family = (key, heading) => `<h3>${heading}</h3><p class="intent">${e(L.$tone[key].$rule)}</p>${L.$tone[key].$reason ? `<p class="source">${e(L.$tone[key].$reason)}</p>` : ''}<ul>${
  Object.entries(L.$tone[key]).filter(([k]) => !k.startsWith('$')).map(([, v]) => `<li>${e(v)}</li>`).join('')}</ul>`
const rules = family('humans', 'Aux humains') + family('machines', 'Aux machines')
const fixes = P.$fixes.map((c) =>
  `<li><b>${e(c.what)}</b> — ${e(c.before)} → <b>${e(c.after)}</b><br><span class="use">${e(c.reason)}</span></li>`).join('')
const limits = P.$limits.map((l) => `<li>${e(l)}</li>`).join('')


const cardTone = (name, hex, use, measure) => card(
  `<p class="name">${e(name)}</p><p class="val">${e(hex)}</p><p class="use">${e(use)}</p>${measure ? `<p class="measure">${e(measure)}</p>` : ''}`,
  `<div style="height:64px;background:${hex}"></div>`)

const USE_NEUTRAL = {
  paper: 'le fond de la page', paperHollow: 'une section en retrait',
  paperHover: 'sous le pointeur', paperSelection: 'une surface choisie',
  scene: 'le bloc plein qui porte ce qui pèse le plus', ink: 'le texte qui porte',
  inkSoft: 'le texte qui accompagne', inkOff: 'un contrôle désactivé — hors seuil par exception WCAG 1.4.3',
  inkInverse: 'le texte posé sur une scène', stroke: 'séparer deux zones — décoratif',
  strokeNet: "délimiter un contrôle", accent: "la primaire elle-même : le focus et le lien, jamais un contenu",
}

const blockPalette = () => `<section>
  <h2>La palette — calculée, pas déclarée</h2>
  <p class="intent">Une seule couleur est saisie dans tout le système : la primaire de la charte partagée. Tout le reste en découle — les gris à sa teinte et à très faible chroma, les états par harmonisation bornée, chaque partenaire par recherche de la clarté qui fait tenir le seuil. Ces hexadécimaux sont des <b>résultats</b>.</p>
  <p class="source">Primaire ${PAL.$primary} · teinte ${String(PAL.$hue)}° · espace ${PAL.$space} · chroma des neutres ${String(P.$generation.neutrals.chroma)}</p>
  <h3>Les surfaces et les encres</h3>
  <div class="grid">${Object.entries(PAL.neutrals).map(([n, v]) =>
    cardTone(n, v, USE_NEUTRAL[n] || '', n === 'paper' || n === 'stroke' || n === 'inkOff' ? '' : `sur le papier : ${contrast(v, PAL.neutrals.paper)}:1`)).join('')}</div>
  <h3>Les états — teinte conventionnelle, tirée vers la primaire, bornée</h3>
  <p class="intent">${e(P.$generation.harmonization.reading)}</p>
  <p class="source">Attraction ${String(P.$generation.harmonization.attraction)} · bande ±${String(P.$generation.harmonization.band)}°. ${e(P.$generation.harmonization.alternative)}</p>
  <div class="grid">${Object.entries(PAL.states).map(([name, x]) => card(
    `<p class="name">${name}</p><p class="val">ancre ${String(x.anchor)}° → ${String(x.hue)}°</p>
     <p class="use">surface ${x.surface} · sur ${x.on} · plein ${x.full}</p>
     <p class="measure">couple surface : ${contrast(x.on, x.surface)}:1 · couple plein : ${contrast(x.onFull, x.full)}:1</p>`,
    `<div style="display:flex;height:64px"><div style="flex:1;background:${x.surface};color:${x.on};font:600 13px ${P.families.mechanical.value};display:flex;align-items:center;justify-content:center">${name}</div><div style="flex:1;background:${x.full};color:${x.onFull};font:600 13px ${P.families.mechanical.value};display:flex;align-items:center;justify-content:center">${name}</div></div>`)).join('')}</div>
</section>`

const ORDER = ['families','weights','sizes','measures','toggles','grid','opacities','strokes','focus','targets','icons','sizesIcon','radii','elevations','plans','veil','durations','curves','expectations','states','media']

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fili · la planche des registres · ${DATE}</title>
<style>
${FONTS}
:root{--paper:${t('paper')};--hollow:${t('paperHollow')};--ink:${t('ink')};--soft:${t('inkSoft')};--stroke:${t('stroke')};--net:${t('strokeNet')};--accent:${t('accent')};--scene:${t('scene')}}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.6 ${P.families.current.value};padding:48px 20px 96px}
main{max-width:1024px;margin:0 auto}
h1{font-family:${P.families.current.value};font-size:clamp(28px,4vw,42px);line-height:1.1;font-weight:600;margin:0 0 12px}
h2{font-family:${P.families.current.value};font-size:clamp(22px,3vw,30px);line-height:1.2;font-weight:600;margin:0 0 8px}
h3{font-family:${P.families.current.value};font-size:17px;font-weight:500;margin:0 0 8px}
.menu{font-family:${P.families.mechanical.value};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);margin:0 0 12px}
.lede{color:var(--soft);font-size:19px;max-width:62ch;margin:0 0 8px}
.inset{border-left:2px solid var(--ink);background:var(--hollow);padding:16px 20px;border-radius:8px;margin:32px 0 0}
.inset.info{border-color:var(--net);background:var(--paper)}
.inset p{margin:0 0 8px;font-size:14px}
.inset .heading{font-weight:600;font-family:${P.families.current.value};font-size:17px}
section{margin:56px 0 0;padding-top:28px;border-top:1px solid var(--stroke)}
.intent{color:var(--soft);font-size:14px;max-width:62ch;margin:0 0 12px}
.source{color:var(--soft);font-size:12px;font-family:${P.families.mechanical.value};max-width:70ch;margin:0 0 8px}
.forbidden{color:var(--signal);font-size:14px;max-width:62ch;margin:0 0 12px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));margin-top:16px}
.card{border:1px solid var(--stroke);border-radius:8px;overflow:hidden;background:var(--paper)}
.body{padding:12px 14px}
.name{font-family:${P.families.mechanical.value};font-size:13px;font-weight:500;margin:0 0 2px}
.val{font-family:${P.families.mechanical.value};font-size:12px;color:var(--soft);margin:0 0 6px;word-break:break-all}
.use{font-size:13px;color:var(--soft);margin:0}
.measure{font-size:12px;color:var(--soft);margin:6px 0 0;font-family:${P.families.mechanical.value}}
.sample{font-size:21px;margin:0 0 8px;line-height:1.25}
.sample.small{font-size:17px}
ul{padding-left:20px;max-width:74ch}li{margin:0 0 12px;font-size:15px}
.foot{margin-top:56px;padding-top:24px;border-top:1px solid var(--stroke);color:var(--soft);font-size:14px;max-width:74ch}
</style></head>
<body><main>
<p class="menu">Fili · pièce du dépôt · ${DATE} · version ${e(P.$version.split('—')[0].trim())}</p>
<h1>La planche des registres d'expression</h1>
<p class="lede">Ce que vous arbitrez ici, ce sont des valeurs — pas des écrans. Chaque registre porte son intention, sa provenance et son emploi déclaré.</p>

<div class="inset">
  <p class="heading">Aucun écran du produit ne figure sur cette planche, et c'est voulu.</p>
  <p>Le protocole fait prononcer la primauté perçue et le parti visuel <b>à froid</b>, au premier acte de la séance, sur un témoin que vous n'avez jamais vu. Regarder un écran de Fili maintenant dépenserait ce froid : B-2 et B-3 ne mesureraient plus rien, ils confirmeraient.</p>
</div>

<div class="inset info">
  <p class="heading">Une seule autorité</p>
  <p>${e(P.$authority.rule)}</p>
  <p>${e(P.$authority.cut)}</p>
  <p>${e(P.$authority.backgrounds)}</p>
  <p>${e(P.$authority.invention)}</p>
</div>

<div class="inset info">
  <p class="heading">Thématisation — ${e(P.$theme.value)} seulement</p>
  <p>${e(P.$theme.reason)}</p>
  <p>${e(P.$theme.consequence)}</p>
</div>

<div class="inset">
  <p class="heading">Le parti — monochrome</p>
  <p>${e(P.$stance.rule)}</p>
  <p>${e(P.$stance.reason)}</p>
  <p>${e(P.$stance.consequence)}</p>
  <p>${e(P.$stance.accessibility)}</p>
  <p><b>Ce que ça coûte</b> — ${e(P.$stance.cost)}</p>
</div>

<div class="inset info">
  <p class="heading">Les règles d'emploi — ${e(P.$uses.status)}</p>
  <p>${e(P.$uses.rule)}</p>
</div>

<section>
  <h2>Les règles d'emploi opposables</h2>
  <p class="intent">Une règle d'emploi dit ce qui est INTERDIT, se vérifie, et porte son cas piégé et son cas conforme. Celles-ci sont écrites ; elles n'entrent au corpus qu'avec leur batterie.</p>
  ${P.$uses.rules.map((r) => `<div class="card" style="margin-bottom:16px"><div class="body">
    <p class="name">${e(r.id)}</p>
    <p class="sample small" style="margin-bottom:12px">${e(r.statement)}</p>
    <p class="use"><b>Interdit</b> — ${e(r.forbidden)}</p>
    <p class="use"><b>Pourquoi</b> — ${e(r.why)}</p>
    <p class="measure">piégé : ${e(r.instanceTrap)} · conforme : ${e(r.instanceCompliant)}</p>
    <p class="source">${e(r.status)}</p>
    <p class="source">Décidable — ${e(r.decidable)}</p>
  </div></div>`).join('')}
</section>

${blockPalette()}
${ORDER.map(block).join('\n')}

<section>
  <h2>Ce qui ne vit pas ici</h2>
  <p class="intent">Trois registres sont gouvernés par le registre que le Gardien lit, parce qu'il statue déjà dessus. Les déplacer ici créerait deux sources de vérité.</p>
  <div class="grid">
    ${card(caption("échelle d'espacement", R.spacing.scale.join(' · '), "les seuls pas d'écart admis — le Gardien refuse tout le reste (R3.1)"))}
    ${card(caption('densités de section', R.rhythm.densities.join(' · '), "la respiration déclarée d'une section, et l'alternance qu'elle impose (R4.2, R4.3)"))}
    ${card(caption('proximité', `facteur ${R.spacing.proximity.factor}`, "l'écart d'un groupe vaut au moins trois fois celui de ses enfants (R3.7)"))}
  </div>
</section>

<section>
  <h2>Le catalogue de libellés — les règles de ton</h2>
  <p class="intent">Le catalogue porte la voix du produit écran par écran. Ce qui s'arbitre ici, ce sont les règles qui la gouvernent : c'est sur elles que le point de passage B-5 s'appuiera.</p>
  ${rules}
</section>

<section>
  <h2>Les corrections, déclarées</h2>
  <p class="intent">Cinq valeurs ont changé depuis la première version de cette planche. Aucune n'a été corrigée en silence.</p>
  <ul>${fixes}</ul>
</section>

<section>
  <h2>Ce que cette planche ne prouve pas</h2>
  <ul>${limits}</ul>
</section>

<p class="foot">Trois suites possibles : vous l'acceptez telle quelle, vous nommez ce qui cloche et je corrige des valeurs, ou vous la refusez et vous fournissez la matière. Les valeurs d'expression ne convergent pas (<b>#028</b>) : aucune mesure ne peut trancher à votre place.</p>
</main></body></html>
`
const target = path.join(ROOT, 'witnesses/board', `${DATE}.html`)
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, html)
console.log('planche rendue →', path.relative(ROOT, target), `(${String(html.length)} octets)`)
