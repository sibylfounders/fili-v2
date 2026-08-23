/* La planche des registres, rendue depuis la planche elle-même.
   Pièce du Temps ③ de la séance, et étalon de B-4. Elle ne montre AUCUN écran
   du produit : le froid de la séance appartient à l'Auteur, et il ne se dépense
   pas pour un arbitrage de valeurs. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/expression.json'), 'utf8'))
const L = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/libelles.json'), 'utf8'))
const R = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/registry.json'), 'utf8'))
const JEU = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/icones.json'), 'utf8'))
const PAL = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/palette.json'), 'utf8'))
const DATE = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : '2026-08-07'

const items = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'))
const t = (n) => PAL.neutres[n]
const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

/* Cette page compose son style à la main : elle ne passe pas par la chaîne
   Tailwind, et rien ne lui apportait donc les déclarations de fonte. Elle
   nommait les trois voix de la charte et n'en affichait aucune. */
const { deposerPolices, blocPolices } = await import(
  new URL('../temoin/polices.mjs', import.meta.url).href)
deposerPolices()
const POLICES = blocPolices('../files/')

const canal = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const lum = (h) => { const n = h.replace('#',''); const [r,g,b]=[0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255); return 0.2126*canal(r)+0.7152*canal(g)+0.0722*canal(b) }
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return ((x+0.05)/(y+0.05)).toFixed(2) }
const contraste = ratio

const attribut = (f) => Object.entries(f).filter(([k]) => k !== 't').map(([k, x]) => `${k}="${String(x)}"`).join(' ')
const dessin = (nom, px) => `<svg viewBox="0 0 ${String(JEU.$grille)} ${String(JEU.$grille)}" width="${String(px)}" height="${String(px)}" fill="none" stroke="${t('encre')}" stroke-width="${String(JEU.$trait)}" stroke-linecap="round" stroke-linejoin="round">${
  (JEU.formes[nom] || []).map((f) => `<${f.t} ${attribut(f)} />`).join('')}</svg>`

const carte = (corps, cle) => `<div class="carte">${cle ? `<div class="apercu">${cle}</div>` : ''}<div class="corps">${corps}</div></div>`
const legende = (nom, val, emploi, plus = '') =>
  `<p class="nom">${e(nom)}</p>${val !== null ? `<p class="val">${e(val)}</p>` : ''}<p class="emploi">${e(emploi)}</p>${plus}`

const RENDU = {
  tons: ([n, v]) => carte(
    legende(n, v.valeur, v.emploi,
      ['papier','papierCreux','papierSurvol','papierSelection','encreInverse','trait','encreEteinte'].includes(n)
        ? '' : `<p class="mesure">sur le papier : <b>${ratio(v.valeur, t('papier'))}:1</b></p>`),
    `<div style="height:64px;background:${v.valeur}"></div>`),
  familles: ([n, v]) => carte(
    `<p class="nom">${n}</p><p class="echantillon" style="font-family:${v.valeur}">Le juge est-il entier ?</p><p class="emploi">${e(v.emploi)}</p>`),
  graisses: ([n, v]) => carte(
    `<p class="nom">${n} · ${v.valeur}</p><p class="echantillon petit" style="font-weight:${v.valeur}">Arbitrage de lecture</p><p class="emploi">${e(v.emploi)}</p>`),
  tailles: ([n, v]) => carte(
    `<p class="nom">${n} · ${e(v.valeur)} / ${e(v.interligne)}</p><p style="font-size:${v.valeur};line-height:${v.interligne};${v.chasse?`letter-spacing:${v.chasse};text-transform:uppercase;`:''}margin:0 0 8px;font-family:${P.familles.courante.valeur}">Ce qui compte d'abord</p><p class="emploi">${e(v.emploi)}</p>`),
  icones: ([n, v]) => carte(
    `${dessin(n, 28)}<p class="nom">${n}</p><p class="val">${e(v.lucide)}</p><p class="emploi">${e(v.emploi)}</p>`),
  taillesIcone: ([n, v]) => carte(
    `${dessin('constat', parseInt(v.valeur))}<p class="nom">${n} · ${e(v.valeur)}</p><p class="emploi">${e(v.emploi)}</p>`),
  rayons: ([n, v]) => carte(
    `<div style="width:72px;height:40px;background:${t('papierCreux')};border:1px solid ${t('traitNet')};border-radius:${v.valeur};margin-bottom:10px"></div>${legende(n, v.valeur, v.emploi)}`),
  traits: ([n, v]) => carte(
    `<div style="width:100%;height:0;border-top:${/px/.test(v.valeur)?v.valeur:'1px'} ${/px/.test(v.valeur)?'solid':v.valeur} ${t('traitNet')};margin-bottom:12px"></div>${legende(n, v.valeur, v.emploi)}`),
  elevations: ([n, v]) => carte(
    `<div style="width:100%;height:44px;background:${t('papier')};border-radius:${P.rayons.carte.valeur};box-shadow:${v.valeur};margin-bottom:12px"></div>${legende(n, v.valeur, v.emploi)}`),
  opacites: ([n, v]) => carte(
    `<div style="height:44px;background:${t('encre')};opacity:${v.valeur};margin-bottom:12px;border-radius:${P.rayons.detail.valeur}"></div>${legende(n, String(v.valeur), v.emploi)}`),
  cibles: ([n, v]) => carte(
    `<div style="width:${v.valeur};height:${v.valeur};max-width:100%;background:${t('papierSelection')};border:1px solid ${t('traitNet')};border-radius:${P.rayons.detail.valeur};margin-bottom:12px"></div>${legende(n, v.valeur, v.emploi)}`),
}
const generique = ([n, v]) => carte(legende(n, Array.isArray(v.valeur) ? v.valeur.join(' · ') : String(v.valeur), v.emploi))

const TITRES = {
  tons: 'Les tons', familles: 'Les familles', graisses: 'Les graisses', tailles: 'Les tailles de texte',
  mesures: 'Les mesures', bascules: 'Les points de bascule', grille: 'La grille', opacites: 'Les opacités',
  traits: 'Les traits', focus: "L'anneau de focus", cibles: 'Les cibles', icones: 'Les icônes',
  taillesIcone: 'Les tailles de lecture des icônes', rayons: 'Les rayons', elevations: 'Les élévations',
  plans: 'Les plans de superposition', voile: 'Le voile', durees: 'Les durées', courbes: 'Les courbes',
  attentes: "Les formes d'attente",
}

const bloc = (cle) => {
  const b = P[cle]
  const rendu = RENDU[cle] || generique
  /* Tout champ de méta se montre : une note écrite dans la planche et non rendue
     sur la planche est une note qui n'existe pas pour celui qui la regarde. */
  const ETIQUETTE = {
    $source: 'Provenance', $ecart: 'Écart déclaré', $regime: 'Régime', $forme: 'Forme',
    $interligne: 'Interligne', $regle: 'Règle', $manque: 'Manque signalé',
    $retire: 'Retiré', $statut: 'Statut', $motif: 'Motif',
  }
  const extras = Object.entries(b)
    .filter(([k]) => k.startsWith('$') && k !== '$intention')
    .map(([k, v]) =>
      k === '$dette' || k === '$interdit'
        ? `<p class="interdit">${k === '$dette' ? 'Dette' : 'Interdit'} — ${e(v)}</p>`
        : `<p class="source">${ETIQUETTE[k] ? ETIQUETTE[k] + ' — ' : ''}${e(v)}</p>`
    ).join('')
  return `<section><h2>${TITRES[cle] || cle}</h2>
  <p class="intention">${e(b.$intention || '')}</p>${extras}
  <div class="grille">${items(b).map(rendu).join('')}</div></section>`
}

const famille = (cle, titre) => `<h3>${titre}</h3><p class="intention">${e(L.$ton[cle].$regle)}</p>${L.$ton[cle].$motif ? `<p class="source">${e(L.$ton[cle].$motif)}</p>` : ''}<ul>${
  Object.entries(L.$ton[cle]).filter(([k]) => !k.startsWith('$')).map(([, v]) => `<li>${e(v)}</li>`).join('')}</ul>`
const regles = famille('humains', 'Aux humains') + famille('machines', 'Aux machines')
const corrections = P.$corrections.map((c) =>
  `<li><b>${e(c.quoi)}</b> — ${e(c.avant)} → <b>${e(c.apres)}</b><br><span class="emploi">${e(c.motif)}</span></li>`).join('')
const limites = P.$limites.map((l) => `<li>${e(l)}</li>`).join('')


const carteTon = (nom, hex, emploi, mesure) => carte(
  `<p class="nom">${e(nom)}</p><p class="val">${e(hex)}</p><p class="emploi">${e(emploi)}</p>${mesure ? `<p class="mesure">${e(mesure)}</p>` : ''}`,
  `<div style="height:64px;background:${hex}"></div>`)

const EMPLOI_NEUTRE = {
  papier: 'le fond de la page', papierCreux: 'une section en retrait',
  papierSurvol: 'sous le pointeur', papierSelection: 'une surface choisie',
  scene: 'le bloc plein qui porte ce qui pèse le plus', encre: 'le texte qui porte',
  encreDouce: 'le texte qui accompagne', encreEteinte: 'un contrôle désactivé — hors seuil par exception WCAG 1.4.3',
  encreInverse: 'le texte posé sur une scène', trait: 'séparer deux zones — décoratif',
  traitNet: "délimiter un contrôle", accent: "la primaire elle-même : le focus et le lien, jamais un contenu",
}

const blocPalette = () => `<section>
  <h2>La palette — calculée, pas déclarée</h2>
  <p class="intention">Une seule couleur est saisie dans tout le système : la primaire de la charte partagée. Tout le reste en découle — les gris à sa teinte et à très faible chroma, les états par harmonisation bornée, chaque partenaire par recherche de la clarté qui fait tenir le seuil. Ces hexadécimaux sont des <b>résultats</b>.</p>
  <p class="source">Primaire ${PAL.$primaire} · teinte ${String(PAL.$teinte)}° · espace ${PAL.$espace} · chroma des neutres ${String(P.$generation.neutres.chroma)}</p>
  <h3>Les surfaces et les encres</h3>
  <div class="grille">${Object.entries(PAL.neutres).map(([n, v]) =>
    carteTon(n, v, EMPLOI_NEUTRE[n] || '', n === 'papier' || n === 'trait' || n === 'encreEteinte' ? '' : `sur le papier : ${contraste(v, PAL.neutres.papier)}:1`)).join('')}</div>
  <h3>Les états — teinte conventionnelle, tirée vers la primaire, bornée</h3>
  <p class="intention">${e(P.$generation.harmonisation.lecture)}</p>
  <p class="source">Attraction ${String(P.$generation.harmonisation.attraction)} · bande ±${String(P.$generation.harmonisation.bande)}°. ${e(P.$generation.harmonisation.alternative)}</p>
  <div class="grille">${Object.entries(PAL.etats).map(([nom, x]) => carte(
    `<p class="nom">${nom}</p><p class="val">ancre ${String(x.ancre)}° → ${String(x.teinte)}°</p>
     <p class="emploi">surface ${x.surface} · sur ${x.sur} · plein ${x.plein}</p>
     <p class="mesure">couple surface : ${contraste(x.sur, x.surface)}:1 · couple plein : ${contraste(x.surPlein, x.plein)}:1</p>`,
    `<div style="display:flex;height:64px"><div style="flex:1;background:${x.surface};color:${x.sur};font:600 13px ${P.familles.mecanique.valeur};display:flex;align-items:center;justify-content:center">${nom}</div><div style="flex:1;background:${x.plein};color:${x.surPlein};font:600 13px ${P.familles.mecanique.valeur};display:flex;align-items:center;justify-content:center">${nom}</div></div>`)).join('')}</div>
</section>`

const ORDRE = ['familles','graisses','tailles','mesures','bascules','grille','opacites','traits','focus','cibles','icones','taillesIcone','rayons','elevations','plans','voile','durees','courbes','attentes','etats','medias']

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fili · la planche des registres · ${DATE}</title>
<style>
${POLICES}
:root{--papier:${t('papier')};--creux:${t('papierCreux')};--encre:${t('encre')};--douce:${t('encreDouce')};--trait:${t('trait')};--net:${t('traitNet')};--accent:${t('accent')};--scene:${t('scene')}}
*{box-sizing:border-box}
body{margin:0;background:var(--papier);color:var(--encre);font:17px/1.6 ${P.familles.courante.valeur};padding:48px 20px 96px}
main{max-width:1024px;margin:0 auto}
h1{font-family:${P.familles.courante.valeur};font-size:clamp(28px,4vw,42px);line-height:1.1;font-weight:600;margin:0 0 12px}
h2{font-family:${P.familles.courante.valeur};font-size:clamp(22px,3vw,30px);line-height:1.2;font-weight:600;margin:0 0 8px}
h3{font-family:${P.familles.courante.valeur};font-size:17px;font-weight:500;margin:0 0 8px}
.menu{font-family:${P.familles.mecanique.valeur};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--douce);margin:0 0 12px}
.chapeau{color:var(--douce);font-size:19px;max-width:62ch;margin:0 0 8px}
.encart{border-left:2px solid var(--encre);background:var(--creux);padding:16px 20px;border-radius:8px;margin:32px 0 0}
.encart.info{border-color:var(--net);background:var(--papier)}
.encart p{margin:0 0 8px;font-size:14px}
.encart .titre{font-weight:600;font-family:${P.familles.courante.valeur};font-size:17px}
section{margin:56px 0 0;padding-top:28px;border-top:1px solid var(--trait)}
.intention{color:var(--douce);font-size:14px;max-width:62ch;margin:0 0 12px}
.source{color:var(--douce);font-size:12px;font-family:${P.familles.mecanique.valeur};max-width:70ch;margin:0 0 8px}
.interdit{color:var(--signal);font-size:14px;max-width:62ch;margin:0 0 12px}
.grille{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));margin-top:16px}
.carte{border:1px solid var(--trait);border-radius:8px;overflow:hidden;background:var(--papier)}
.corps{padding:12px 14px}
.nom{font-family:${P.familles.mecanique.valeur};font-size:13px;font-weight:500;margin:0 0 2px}
.val{font-family:${P.familles.mecanique.valeur};font-size:12px;color:var(--douce);margin:0 0 6px;word-break:break-all}
.emploi{font-size:13px;color:var(--douce);margin:0}
.mesure{font-size:12px;color:var(--douce);margin:6px 0 0;font-family:${P.familles.mecanique.valeur}}
.echantillon{font-size:21px;margin:0 0 8px;line-height:1.25}
.echantillon.petit{font-size:17px}
ul{padding-left:20px;max-width:74ch}li{margin:0 0 12px;font-size:15px}
.pied{margin-top:56px;padding-top:24px;border-top:1px solid var(--trait);color:var(--douce);font-size:14px;max-width:74ch}
</style></head>
<body><main>
<p class="menu">Fili · pièce du dépôt · ${DATE} · version ${e(P.$version.split('—')[0].trim())}</p>
<h1>La planche des registres d'expression</h1>
<p class="chapeau">Ce que vous arbitrez ici, ce sont des valeurs — pas des écrans. Chaque registre porte son intention, sa provenance et son emploi déclaré.</p>

<div class="encart">
  <p class="titre">Aucun écran du produit ne figure sur cette planche, et c'est voulu.</p>
  <p>Le protocole fait prononcer la primauté perçue et le parti visuel <b>à froid</b>, au premier acte de la séance, sur un témoin que vous n'avez jamais vu. Regarder un écran de Fili maintenant dépenserait ce froid : B-2 et B-3 ne mesureraient plus rien, ils confirmeraient.</p>
</div>

<div class="encart info">
  <p class="titre">Une seule autorité</p>
  <p>${e(P.$autorite.regle)}</p>
  <p>${e(P.$autorite.coupe)}</p>
  <p>${e(P.$autorite.fonds)}</p>
  <p>${e(P.$autorite.invention)}</p>
</div>

<div class="encart info">
  <p class="titre">Thématisation — ${e(P.$theme.valeur)} seulement</p>
  <p>${e(P.$theme.motif)}</p>
  <p>${e(P.$theme.consequence)}</p>
</div>

<div class="encart">
  <p class="titre">Le parti — monochrome</p>
  <p>${e(P.$parti.regle)}</p>
  <p>${e(P.$parti.motif)}</p>
  <p>${e(P.$parti.consequence)}</p>
  <p>${e(P.$parti.accessibilite)}</p>
  <p><b>Ce que ça coûte</b> — ${e(P.$parti.cout)}</p>
</div>

<div class="encart info">
  <p class="titre">Les règles d'emploi — ${e(P.$emplois.statut)}</p>
  <p>${e(P.$emplois.regle)}</p>
</div>

<section>
  <h2>Les règles d'emploi opposables</h2>
  <p class="intention">Une règle d'emploi dit ce qui est INTERDIT, se vérifie, et porte son cas piégé et son cas conforme. Celles-ci sont écrites ; elles n'entrent au corpus qu'avec leur batterie.</p>
  ${P.$emplois.regles.map((r) => `<div class="carte" style="margin-bottom:16px"><div class="corps">
    <p class="nom">${e(r.id)}</p>
    <p class="echantillon petit" style="margin-bottom:12px">${e(r.enonce)}</p>
    <p class="emploi"><b>Interdit</b> — ${e(r.interdit)}</p>
    <p class="emploi"><b>Pourquoi</b> — ${e(r.pourquoi)}</p>
    <p class="mesure">piégé : ${e(r.casPiege)} · conforme : ${e(r.casConforme)}</p>
    <p class="source">${e(r.statut)}</p>
    <p class="source">Décidable — ${e(r.decidable)}</p>
  </div></div>`).join('')}
</section>

${blocPalette()}
${ORDRE.map(bloc).join('\n')}

<section>
  <h2>Ce qui ne vit pas ici</h2>
  <p class="intention">Trois registres sont gouvernés par le registre que le Gardien lit, parce qu'il statue déjà dessus. Les déplacer ici créerait deux sources de vérité.</p>
  <div class="grille">
    ${carte(legende("échelle d'espacement", R.espacement.echelle.join(' · '), "les seuls pas d'écart admis — le Gardien refuse tout le reste (R3.1)"))}
    ${carte(legende('densités de section', R.rythme.densites.join(' · '), "la respiration déclarée d'une section, et l'alternance qu'elle impose (R4.2, R4.3)"))}
    ${carte(legende('proximité', `facteur ${R.espacement.proximite.facteur}`, "l'écart d'un groupe vaut au moins trois fois celui de ses enfants (R3.7)"))}
  </div>
</section>

<section>
  <h2>Le catalogue de libellés — les règles de ton</h2>
  <p class="intention">Le catalogue porte la voix du produit écran par écran. Ce qui s'arbitre ici, ce sont les règles qui la gouvernent : c'est sur elles que le point de passage B-5 s'appuiera.</p>
  ${regles}
</section>

<section>
  <h2>Les corrections, déclarées</h2>
  <p class="intention">Cinq valeurs ont changé depuis la première version de cette planche. Aucune n'a été corrigée en silence.</p>
  <ul>${corrections}</ul>
</section>

<section>
  <h2>Ce que cette planche ne prouve pas</h2>
  <ul>${limites}</ul>
</section>

<p class="pied">Trois suites possibles : vous l'acceptez telle quelle, vous nommez ce qui cloche et je corrige des valeurs, ou vous la refusez et vous fournissez la matière. Les valeurs d'expression ne convergent pas (<b>#028</b>) : aucune mesure ne peut trancher à votre place.</p>
</main></body></html>
`
const cible = path.join(RACINE, 'temoins/planche', `${DATE}.html`)
fs.mkdirSync(path.dirname(cible), { recursive: true })
fs.writeFileSync(cible, html)
console.log('planche rendue →', path.relative(RACINE, cible), `(${String(html.length)} octets)`)
