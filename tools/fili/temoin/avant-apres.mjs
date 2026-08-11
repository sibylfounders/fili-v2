/* La planche de comparaison d'une séance.
 *
 * Le thread du kit a établi qu'un écran peut être conforme à cent pour cent et
 * MOINS BON à l'œil : le vert du Gardien dit « rien n'a été inventé », jamais
 * « c'est bien réglé ». Une migration qui change tous les nombres d'un produit
 * ne peut donc pas se juger sur son verdict mécanique.
 *
 * Cette page ne juge rien. Elle met les deux états du même écran côte à côte,
 * rendus, à la même largeur, et laisse l'œil trancher. Les deux témoins sont
 * les fichiers eux-mêmes — ni capture, ni transposition (#016).
 */
import { readdirSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const TEMOINS = path.join(RACINE, 'temoins')

const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}
const AVANT = arg('avant', '2026-08-08')
const APRES = arg('apres', '2026-08-11')

const TITRES = {
  'e1-verdict': 'É1 · Le verdict', 'e2-constat': 'É2 · Le constat',
  'e3-famille': 'É3 · La famille des témoins', 'e4-face-a-face': 'É4 · Le face-à-face',
  'e5-carte': 'É5 · La carte', 'e6-journal': 'É6 · Le journal', 'e7-acte': 'É7 · L’acte',
}

const lignees = Object.keys(TITRES).filter((g) => existsSync(path.join(TEMOINS, g, APRES)))
let couples = 0
const sections = lignees.map((g) => {
  const etats = readdirSync(path.join(TEMOINS, g, APRES)).filter((f) => f.endsWith('.html')).sort()
  const blocs = etats.map((e) => {
    const avant = path.join(TEMOINS, g, AVANT, e)
    const dispo = existsSync(avant)
    if (dispo) couples += 1
    return `<section class="etat">
      <h3>${e.replace('.html', '')}${dispo ? '' : ' — aucun état comparable avant'}</h3>
      <div class="duo">
        <figure><figcaption>avant · ${AVANT}</figcaption>${
          dispo ? `<iframe loading="lazy" src="${g}/${AVANT}/${e}" title="${g} ${e} avant"></iframe>`
                : '<div class="absent">rien à comparer</div>'}</figure>
        <figure><figcaption>après · ${APRES}</figcaption><iframe loading="lazy" src="${g}/${APRES}/${e}" title="${g} ${e} après"></iframe></figure>
      </div>
    </section>`
  }).join('\n')
  return `<article class="gabarit"><h2>${TITRES[g]}</h2>${blocs}</article>`
}).join('\n')

const page = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Avant / après — migration vers l'Échelle Semantic Rhythm</title>
<style>
:root{--encre:#16161a;--douce:#6b6b76;--trait:#e2e2e8;--fond:#f6f6f9}
*{box-sizing:border-box}
body{margin:0;background:var(--fond);color:var(--encre);
  font:400 16px/1.55 ui-sans-serif,system-ui,-apple-system,sans-serif}
header{padding:40px 32px 24px;border-bottom:1px solid var(--trait);background:#fff}
h1{margin:0 0 8px;font-size:24px;letter-spacing:-.01em}
header p{margin:0 0 10px;max-width:62ch;color:var(--douce);font-size:15px}
.reserve{border-left:3px solid #d9b310;padding-left:12px}
.barre{display:flex;gap:12px;align-items:center;padding:16px 32px;position:sticky;top:0;
  background:#fffffff2;backdrop-filter:blur(8px);border-bottom:1px solid var(--trait);z-index:9}
.barre label{font-size:13px;color:var(--douce)}
.barre input{width:220px}
.gabarit{padding:32px}
.gabarit h2{font-size:19px;margin:0 0 4px;padding-bottom:8px;border-bottom:1px solid var(--trait)}
.etat h3{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;
  color:var(--douce);margin:28px 0 10px}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
figure{margin:0}
figcaption{font-size:12px;color:var(--douce);margin-bottom:6px}
iframe,.absent{width:var(--largeur,100%);max-width:100%;height:760px;border:1px solid var(--trait);
  background:#fff;display:block}
.absent{display:grid;place-items:center;color:var(--douce);font-size:13px}
@media (max-width:1100px){.duo{grid-template-columns:1fr}}
</style></head><body>
<header>
  <h1>Avant / après — la géométrie passe à l'Échelle Semantic Rhythm</h1>
  <p>Même écran, mêmes textes, mêmes couleurs, mêmes composants. Seuls changent les
  nombres d'espacement et de rayon : ils ne sont plus choisis, ils descendent de la
  profondeur d'emboîtement. ${couples} couples d'états, sept gabarits.
  Le verdict mécanique est vert des deux côtés — il dit que rien n'a été inventé,
  il ne dit pas que c'est mieux. C'est ce que cette page laisse à l'œil.</p>
  <p class="reserve"><strong>Une réserve, et elle est écrite plutôt que découverte.</strong>
  Cinq gabarits sur sept montrent exactement le même contenu des deux côtés : leurs
  scénarios sont figés. <strong>É5 · La carte</strong> et <strong>É6 · Le journal</strong>
  lisent la mémoire du projet, et cette mémoire a grossi depuis le 8 août — deux
  décisions de plus. Leur contenu diffère donc aussi, et sur ces deux-là seule la
  géométrie est comparable.</p>
</header>
<div class="barre">
  <label for="l">Largeur de rendu</label>
  <input id="l" type="range" min="320" max="1440" value="1024" step="10">
  <output id="v">1024 px</output>
</div>
${sections}
<script>
const l = document.getElementById('l'), v = document.getElementById('v')
l.addEventListener('input', () => {
  document.documentElement.style.setProperty('--largeur', l.value + 'px')
  v.textContent = l.value + ' px'
})
document.documentElement.style.setProperty('--largeur', '1024px')
</script>
</body></html>`

const sortie = path.join(TEMOINS, `avant-apres-${APRES}.html`)
writeFileSync(sortie, page)
console.log(`  ✅ temoins/avant-apres-${APRES}.html — ${lignees.length} gabarits, ${couples} couples d'états`)
