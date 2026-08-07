/* La planche des registres, rendue depuis la planche elle-même.
   Pièce du Temps ③ de la séance, et étalon de B-4. Elle ne montre AUCUN écran
   du produit : le froid de la séance appartient à l'Auteur, et il ne se dépense
   pas pour un arbitrage de valeurs. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.expression.json'), 'utf8'))
const L = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.libelles.json'), 'utf8'))
const R = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.registry.json'), 'utf8'))
const DATE = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : '2026-08-07'

const items = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'))
const t = (n) => P.tons[n].valeur
const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const canal = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const lum = (h) => { const n = h.replace('#',''); const [r,g,b]=[0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255); return 0.2126*canal(r)+0.7152*canal(g)+0.0722*canal(b) }
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return ((x+0.05)/(y+0.05)).toFixed(2) }

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
    `<p class="nom">${n} · ${e(v.valeur)} / ${e(v.interligne)}</p><p style="font-size:${v.valeur};line-height:${v.interligne};${v.chasse?`letter-spacing:${v.chasse};text-transform:uppercase;`:''}margin:0 0 8px;font-family:${n.startsWith('niveau')?P.familles.titrage.valeur:P.familles.courante.valeur}">Ce qui compte d'abord</p><p class="emploi">${e(v.emploi)}</p>`),
  icones: ([n, v]) => carte(
    `<svg viewBox="0 0 16 16" width="28" height="28" fill="none" stroke="${t('encre')}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${v.trace}"/></svg><p class="nom">${n}</p><p class="emploi">${e(v.emploi)}</p>`),
  taillesIcone: ([n, v]) => carte(
    `<svg viewBox="0 0 16 16" width="${parseInt(v.valeur)}" height="${parseInt(v.valeur)}" fill="none" stroke="${t('encre')}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${P.icones.constat.trace}"/></svg><p class="nom">${n} · ${e(v.valeur)}</p><p class="emploi">${e(v.emploi)}</p>`),
  rayons: ([n, v]) => carte(
    `<div style="width:72px;height:40px;background:${t('papierCreux')};border:1px solid ${t('traitNet')};border-radius:${v.valeur};margin-bottom:10px"></div>${legende(n, v.valeur, v.emploi)}`),
  traits: ([n, v]) => carte(
    `<div style="width:100%;height:0;border-top:${/px/.test(v.valeur)?v.valeur:'1px'} ${/px/.test(v.valeur)?'solid':v.valeur} ${t('traitNet')};margin-bottom:12px"></div>${legende(n, v.valeur, v.emploi)}`),
  elevations: ([n, v]) => carte(
    `<div style="width:100%;height:44px;background:${t('papier')};border-radius:${P.rayons.controle.valeur};box-shadow:${v.valeur};margin-bottom:12px"></div>${legende(n, v.valeur, v.emploi)}`),
  opacites: ([n, v]) => carte(
    `<div style="height:44px;background:${t('signal')};opacity:${v.valeur};margin-bottom:12px;border-radius:${P.rayons.doux.valeur}"></div>${legende(n, String(v.valeur), v.emploi)}`),
  cibles: ([n, v]) => carte(
    `<div style="width:${v.valeur};height:${v.valeur};max-width:100%;background:${t('papierSelection')};border:1px solid ${t('traitNet')};border-radius:${P.rayons.doux.valeur};margin-bottom:12px"></div>${legende(n, v.valeur, v.emploi)}`),
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
  const extras = [b.$source ? `<p class="source">Provenance — ${e(b.$source)}</p>` : '',
                  b.$ecart ? `<p class="source">Écart déclaré — ${e(b.$ecart)}</p>` : '',
                  b.$regime ? `<p class="source">Régime — ${e(b.$regime)}</p>` : '',
                  b.$forme ? `<p class="source">${e(b.$forme)}</p>` : '',
                  b.$interligne ? `<p class="source">${e(b.$interligne)}</p>` : '',
                  b.$interdit ? `<p class="interdit">Interdit — ${e(b.$interdit)}</p>` : ''].join('')
  return `<section><h2>${TITRES[cle] || cle}</h2>
  <p class="intention">${e(b.$intention || '')}</p>${extras}
  <div class="grille">${items(b).map(rendu).join('')}</div></section>`
}

const regles = Object.entries(L.$ton).map(([k, v]) => `<li><b>${k.replace('regle', 'Règle ')}</b> — ${e(v)}</li>`).join('')
const corrections = P.$corrections.map((c) =>
  `<li><b>${e(c.quoi)}</b> — ${e(c.avant)} → <b>${e(c.apres)}</b><br><span class="emploi">${e(c.motif)}</span></li>`).join('')
const limites = P.$limites.map((l) => `<li>${e(l)}</li>`).join('')

const ORDRE = ['tons','familles','graisses','tailles','mesures','bascules','grille','opacites','traits','focus','cibles','icones','taillesIcone','rayons','elevations','plans','voile','durees','courbes','attentes']

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fili · la planche des registres · ${DATE}</title>
<style>
:root{--papier:${t('papier')};--creux:${t('papierCreux')};--encre:${t('encre')};--douce:${t('encreDouce')};--trait:${t('trait')};--net:${t('traitNet')};--signal:${t('signal')};--info:${t('information')}}
*{box-sizing:border-box}
body{margin:0;background:var(--papier);color:var(--encre);font:17px/1.6 ${P.familles.courante.valeur};padding:48px 20px 96px}
main{max-width:1024px;margin:0 auto}
h1{font-family:${P.familles.titrage.valeur};font-size:clamp(28px,4vw,42px);line-height:1.1;font-weight:600;margin:0 0 12px}
h2{font-family:${P.familles.titrage.valeur};font-size:clamp(22px,3vw,30px);line-height:1.2;font-weight:600;margin:0 0 8px}
h3{font-family:${P.familles.titrage.valeur};font-size:17px;font-weight:500;margin:0 0 8px}
.menu{font-family:${P.familles.mecanique.valeur};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--douce);margin:0 0 12px}
.chapeau{color:var(--douce);font-size:19px;max-width:62ch;margin:0 0 8px}
.encart{border-left:2px solid var(--signal);background:color-mix(in srgb, var(--signal) 5%, transparent);padding:16px 20px;border-radius:8px;margin:32px 0 0}
.encart.info{border-color:var(--info);background:color-mix(in srgb, var(--info) 5%, transparent)}
.encart p{margin:0 0 8px;font-size:14px}
.encart .titre{font-weight:600;font-family:${P.familles.titrage.valeur};font-size:17px}
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

<div class="encart info">
  <p class="titre">Couleur de marque — ${e(P.$marque.valeur)}</p>
  <p>${e(P.$marque.motif)}</p>
</div>

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
  <ul>${regles}</ul>
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
