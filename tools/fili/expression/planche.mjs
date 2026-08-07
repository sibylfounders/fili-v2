/* La planche des registres, rendue depuis la planche elle-même.
   C'est la pièce que le Temps ③ de la séance fait entrer, et l'étalon de B-4.
   Elle ne montre AUCUN écran du produit : le froid de la séance appartient à
   l'Auteur, et il ne se dépense pas pour un arbitrage de valeurs. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.expression.json'), 'utf8'))
const L = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.libelles.json'), 'utf8'))
const DATE = process.argv.includes('--date') ? process.argv[process.argv.indexOf('--date') + 1] : '2026-08-07'

const sansMeta = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'))
const t = (n) => P.tons[n].valeur
const ech = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const canal = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const lum = (hex) => { const n = hex.replace('#',''); const [r,g,b]=[0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255); return 0.2126*canal(r)+0.7152*canal(g)+0.0722*canal(b) }
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return ((x+0.05)/(y+0.05)).toFixed(2) }

const carteTon = ([nom, v]) => `
<div class="carte">
  <div class="pastille" style="background:${v.valeur}"></div>
  <div class="corps">
    <p class="nom">${nom}</p>
    <p class="val">${v.valeur}</p>
    <p class="emploi">${ech(v.emploi)}</p>
    ${['papier','papierCreux','encreInverse','trait'].includes(nom) ? '' :
      `<p class="mesure">contraste sur le papier : <b>${ratio(v.valeur, t('papier'))}:1</b></p>`}
  </div>
</div>`

const carteFamille = ([nom, v]) => `
<div class="carte large">
  <div class="corps">
    <p class="nom">${nom}</p>
    <p class="echantillon" style="font-family:${v.valeur}">Le juge est-il entier, et le dépôt tient-il ?</p>
    <p class="emploi">${ech(v.emploi)}</p>
  </div>
</div>`

const carteGraisse = ([nom, v]) => `
<div class="carte">
  <div class="corps">
    <p class="nom">${nom} · ${String(v.valeur)}</p>
    <p class="echantillon petit" style="font-weight:${String(v.valeur)}">Arbitrage de lecture</p>
    <p class="emploi">${ech(v.emploi)}</p>
  </div>
</div>`

const carteIcone = ([nom, v]) => `
<div class="carte">
  <div class="corps">
    <svg viewBox="0 0 16 16" width="28" height="28" fill="none" stroke="${t('encre')}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${v.trace}"/></svg>
    <p class="nom">${nom}</p>
    <p class="emploi">${ech(v.emploi)}</p>
  </div>
</div>`

const carteRayon = ([nom, v]) => `
<div class="carte">
  <div class="corps">
    <div class="forme" style="border-radius:${v.valeur}"></div>
    <p class="nom">${nom} · ${v.valeur}</p>
    <p class="emploi">${ech(v.emploi)}</p>
  </div>
</div>`

const carteSimple = ([nom, v]) => `
<div class="carte">
  <div class="corps">
    <p class="nom">${nom}</p>
    <p class="val">${ech(v.valeur)}</p>
    <p class="emploi">${ech(v.emploi)}</p>
  </div>
</div>`

const bloc = (titre, intention, contenu, cols = 3) => `
<section>
  <h2>${titre}</h2>
  <p class="intention">${ech(intention)}</p>
  <div class="grille c${String(cols)}">${contenu}</div>
</section>`

const regles = Object.entries(L.$ton).map(([k, v]) => `<li><b>${k.replace('regle', 'Règle ')}</b> — ${ech(v)}</li>`).join('')

const corrections = P.$corrections.map((c) => `
  <li><b>${c.quoi}</b> — ${ech(c.avant)} → <b>${ech(c.apres)}</b><br><span class="emploi">${ech(c.motif)}</span></li>`).join('')

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fili · la planche des registres d'expression · ${DATE}</title>
<style>
:root{--papier:${t('papier')};--creux:${t('papierCreux')};--encre:${t('encre')};--douce:${t('encreDouce')};--trait:${t('trait')};--net:${t('traitNet')}}
*{box-sizing:border-box}
body{margin:0;background:var(--papier);color:var(--encre);font:17px/1.6 ${P.familles.courante.valeur};padding:48px 20px 96px}
main{max-width:1000px;margin:0 auto}
h1{font-family:${P.familles.titrage.valeur};font-size:clamp(1.75rem,4vw,2.6rem);line-height:1.1;font-weight:600;margin:0 0 12px}
h2{font-family:${P.familles.titrage.valeur};font-size:clamp(1.375rem,3vw,1.8rem);line-height:1.2;font-weight:600;margin:0 0 8px}
.menu{font-family:${P.familles.mecanique.valeur};font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--douce);margin:0 0 12px}
.chapeau{color:var(--douce);font-size:1.1875rem;max-width:66ch;margin:0 0 8px}
.avert{border-left:4px solid ${t('signal')};background:${t('signal')}0d;padding:16px 20px;border-radius:6px;margin:32px 0 0;color:${t('signal')}}
.avert p{margin:0 0 8px;color:var(--encre);font-size:.875rem}
.avert .titre{color:${t('signal')};font-weight:600;font-family:${P.familles.titrage.valeur}}
section{margin:64px 0 0;padding-top:32px;border-top:1px solid var(--trait)}
.intention{color:var(--douce);font-size:.875rem;max-width:66ch;margin:0 0 24px}
.grille{display:grid;gap:16px}
.c3{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.c2{grid-template-columns:repeat(auto-fill,minmax(380px,1fr))}
.carte{border:1px solid var(--trait);border-radius:6px;overflow:hidden;background:var(--papier)}
.pastille{height:64px}
.corps{padding:12px 14px}
.nom{font-family:${P.familles.mecanique.valeur};font-size:.8125rem;font-weight:500;margin:0 0 2px}
.val{font-family:${P.familles.mecanique.valeur};font-size:.75rem;color:var(--douce);margin:0 0 6px}
.emploi{font-size:.8125rem;color:var(--douce);margin:0}
.mesure{font-size:.75rem;color:var(--douce);margin:6px 0 0;font-family:${P.familles.mecanique.valeur}}
.echantillon{font-size:1.3rem;margin:0 0 8px;line-height:1.25}
.echantillon.petit{font-size:1.05rem}
.forme{width:64px;height:40px;background:var(--creux);border:1px solid var(--net);margin-bottom:10px}
ul{padding-left:20px;max-width:74ch}
li{margin:0 0 12px;font-size:.9375rem}
.pied{margin-top:64px;padding-top:24px;border-top:1px solid var(--trait);color:var(--douce);font-size:.875rem;max-width:74ch}
</style></head>
<body><main>
<p class="menu">Fili · pièce du dépôt · ${DATE}</p>
<h1>La planche des registres d'expression</h1>
<p class="chapeau">Ce que vous arbitrez ici, ce sont des valeurs — pas des écrans. Chaque registre porte son intention, son emploi déclaré et, pour les tons, son contraste mesuré.</p>

<div class="avert">
  <p class="titre">⚠ Aucun écran du produit ne figure sur cette planche, et c'est voulu.</p>
  <p>Le protocole de référence fait prononcer la primauté perçue et le parti visuel <b>à froid</b>, au premier acte de la séance, sur un témoin que vous n'avez encore jamais vu. Regarder un écran de Fili maintenant dépenserait ce froid, et B-2 comme B-3 ne mesureraient plus rien : ils confirmeraient.</p>
  <p>Cette planche est la pièce du Temps ③. Elle s'arbitre seule. L'emploi de ses jetons sur un écran réel se juge en séance, à B-4, après le gel.</p>
</div>

${bloc('Les tons', P.tons.$intention, sansMeta(P.tons).map(carteTon).join(''))}
${bloc('Les familles', P.familles.$intention, sansMeta(P.familles).map(carteFamille).join(''), 2)}
${bloc('Les graisses', P.graisses.$intention, sansMeta(P.graisses).map(carteGraisse).join(''))}
${bloc('Les icônes', P.icones.$intention + ' ' + P.icones.$forme, sansMeta(P.icones).map(carteIcone).join(''))}
${bloc('Les rayons', P.rayons.$intention, sansMeta(P.rayons).map(carteRayon).join(''))}
${bloc('Les ombres', P.ombres.$intention, sansMeta(P.ombres).map(carteSimple).join(''))}
${bloc('Les durées', P.durees.$intention, sansMeta(P.durees).map(carteSimple).join(''))}
${bloc('Les courbes', P.courbes.$intention, sansMeta(P.courbes).map(carteSimple).join(''))}

<section>
  <h2>Le catalogue de libellés — les six règles de ton</h2>
  <p class="intention">Le catalogue lui-même porte la voix du produit écran par écran. Ce qui s'arbitre ici, ce sont les six règles qui la gouvernent : c'est sur elles que le point de passage B-5 s'appuiera.</p>
  <ul>${regles}</ul>
</section>

<section>
  <h2>Les deux corrections, déclarées</h2>
  <p class="intention">Deux valeurs de l'Écran Témoin accepté le 6 août ne tenaient pas leur seuil d'accessibilité. Elles sont corrigées dans le produit, et le témoin garde les siennes.</p>
  <ul>${corrections}</ul>
</section>

<p class="pied">Ce que cette planche ne dit pas : si elle est juste. C'est votre arbitrage, et il ne se déduit d'aucune mesure — les valeurs d'expression ne convergent pas (<b>#028</b>). Trois suites possibles : vous l'acceptez telle quelle, vous nommez ce qui cloche et je corrige des valeurs, ou vous la refusez et vous fournissez la matière.</p>
</main></body></html>
`
const cible = path.join(RACINE, 'temoins/planche', `${DATE}.html`)
fs.mkdirSync(path.dirname(cible), { recursive: true })
fs.writeFileSync(cible, html)
console.log('planche rendue →', path.relative(RACINE, cible), `(${String(html.length)} octets)`)
