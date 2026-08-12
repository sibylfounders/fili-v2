#!/usr/bin/env node
/**
 * qpm-s2.mjs — Crash-test du Sujet S2 « Rythme & échelle » de la QPM.
 *
 * Zéro dépendance : ce script tourne avec le seul Node, avant même un
 * `npm install`. C'est délibéré — le crash-test qui garde le cadre ne doit pas
 * dépendre de la production qu'il contrôle.
 *
 * Usage :
 *   node scripts/qpm-s2.mjs            # exécute la batterie
 *   node scripts/qpm-s2.mjs --mutate   # S2-T9 : injecte un défaut, exige un FAIL
 *
 * Sortie : code 0 si 100 % PASS, code 1 dès le premier FAIL.
 * Un test BLOQUÉ (non exécutable ici) n'est jamais compté comme PASS.
 */

import { readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')

/* -------------------------------------------------------------------------- */
/* Périmètre — déclaré avant exécution, gelé pendant (contrat de verrouillage)  */
/* -------------------------------------------------------------------------- */

/** Seuls lieux autorisés à contenir des valeurs littérales. */
const TOKEN_SOURCES = ['src/index.css', 'tailwind.config.js']

const SRC_DIR = join(ROOT, 'src')
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx'])

/** L'échelle d'espacement. Elle N'EST PLUS celle de Tailwind : depuis la
 *  migration vers l'Échelle Semantic Rhythm (journal #058, #059), un espace
 *  porte le nom de sa profondeur et de son axe, jamais un nombre.
 *
 *  Elle est LUE dans fili/registry.json — la pièce que le Gardien lit pour
 *  statuer — et non recopiée ici : deux listes qui divergent, c'est la faute
 *  que ce test existe pour attraper. Registre absent : refus de statuer.
 *
 *  Corrigé le 2026-08-11 (journal #060). Ce test rougissait depuis la migration
 *  parce qu'il comparait des noms à une liste de nombres, et le garde-fou a
 *  bloqué tous les enregistrements pendant quatre jours. */
const REGISTRE = JSON.parse(readFileSync(join(ROOT, 'fili/registry.json'), 'utf8'))
const ECHELLE = REGISTRE?.espacement?.echelle
if (!Array.isArray(ECHELLE) || !ECHELLE.length) {
  console.error("\n  🔴 REFUS DE STATUER — l'échelle d'espacement est absente de fili/registry.json\n")
  process.exit(2)
}
/** Les seules valeurs hors échelle admises : le zéro, le pixel de trait, et les
 *  deux mots-clés qui ne sont pas des espaces mais des comportements. */
const HORS_ECHELLE_ADMIS = ['0', 'px', 'auto', 'full']
const SPACING_SCALE = new Set([...ECHELLE, ...HORS_ECHELLE_ADMIS])

/** Tailles typographiques Tailwind — sert à distinguer text-lg de text-ink. */
const TYPE_SCALE = new Set([
  'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl',
  '8xl', '9xl',
])

const MAX_TYPE_SIZES = 6

/* -------------------------------------------------------------------------- */
/* Collecte                                                                    */
/* -------------------------------------------------------------------------- */

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

function inScope(file) {
  const rel = relative(ROOT, file).split('\\').join('/')
  if (TOKEN_SOURCES.includes(rel)) return false
  return CODE_EXT.has(extname(file))
}

const files = walk(SRC_DIR)
  .filter(inScope)
  .map((f) => ({ path: relative(ROOT, f), body: readFileSync(f, 'utf8') }))

/** Toutes les valeurs de className="..." / class="..." du périmètre. */
function classNames() {
  const found = []
  for (const { path, body } of files) {
    for (const m of body.matchAll(/class(?:Name)?\s*=\s*"([^"]*)"/g)) {
      for (const cls of m[1].split(/\s+/).filter(Boolean)) {
        found.push({ path, cls: cls.replace(/^[a-z-]+:/, '') }) // retire sm: / dark: / hover:
      }
    }
  }
  return found
}

/* -------------------------------------------------------------------------- */
/* Moteur de test — binaire, aucune nuance                                     */
/* -------------------------------------------------------------------------- */

const results = []

function test(id, assertion, run) {
  let hits = []
  let blocked = null
  try {
    const r = run()
    if (r && r.blocked) blocked = r.blocked
    else hits = r ?? []
  } catch (err) {
    hits = [{ path: '(runner)', detail: String(err && err.message) }]
  }
  results.push({ id, assertion, hits, blocked })
}

/** Cherche un motif ligne à ligne, hors lignes de commentaire. */
function scan(regex, filter = () => true) {
  const hits = []
  for (const { path, body } of files) {
    body.split('\n').forEach((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return
      for (const m of line.matchAll(regex)) {
        if (!filter(m, line)) continue
        hits.push({ path: `${path}:${i + 1}`, detail: m[0] })
      }
    })
  }
  return hits
}

test('S2-T1', 'Aucune couleur littérale', () =>
  scan(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g),
)

test('S2-T2', 'Aucune dimension littérale', () =>
  scan(/\b\d+(?:\.\d+)?(?:px|rem|em)\b/g),
)

test('S2-T3', 'Aucune durée littérale', () =>
  scan(/\b\d+(?:\.\d+)?(?:ms|s)\b/g, (m, line) => !/aria-|role=/.test(line)),
)

test('S2-T4', 'Aucune valeur arbitraire Tailwind', () =>
  classNames()
    .filter(({ cls }) => /\[[^\]]+\]/.test(cls))
    .map(({ path, cls }) => ({ path, detail: cls })),
)

/*
 * Préfixe d'utilitaire d'espacement. Les deux formes coexistent en Tailwind :
 *   - axe collé      : px-6, mt-4        → p + x + '-'
 *   - axe détaché    : gap-x-8, space-y-3 → gap + '-x' + '-'
 * Une regex qui ne gère que la première découpe « gap-x-8 » en « x-8 » et
 * produit un faux positif. Corrigé le 2026-08-06, cf. journal #005.
 */
const SPACING_PREFIX = /^-?(?:p|m|gap|space)(?:-?[xytrbl])?-/

test('S2-T5', "Échelle d'espacement fermée", () =>
  classNames()
    .filter(({ cls }) => SPACING_PREFIX.test(cls))
    .filter(({ cls }) => !SPACING_SCALE.has(cls.replace(SPACING_PREFIX, '')))
    .map(({ path, cls }) => ({ path, detail: cls })),
)

test('S2-T6', `Échelle typographique fermée (≤ ${MAX_TYPE_SIZES} tailles)`, () => {
  const sizes = new Set(
    classNames()
      .map(({ cls }) => /^text-(.+)$/.exec(cls)?.[1])
      .filter((s) => s && TYPE_SCALE.has(s)),
  )
  return sizes.size <= MAX_TYPE_SIZES
    ? []
    : [{ path: 'src/**', detail: `${sizes.size} tailles : ${[...sizes].join(', ')}` }]
})

test('S2-T7', 'Aucun token orphelin ni fantôme', () => {
  const css = readFileSync(join(ROOT, 'src/index.css'), 'utf8')
  const cfg = readFileSync(join(ROOT, 'tailwind.config.js'), 'utf8')
  const consumers = cfg + files.map((f) => f.body).join('\n')

  const declared = new Set([...css.matchAll(/(--fili-[\w-]+)\s*:/g)].map((m) => m[1]))
  const used = new Set([...consumers.matchAll(/var\((--fili-[\w-]+)/g)].map((m) => m[1]))

  const hits = []
  for (const t of declared) if (!used.has(t)) hits.push({ path: 'src/index.css', detail: `orphelin : ${t}` })
  for (const t of used) if (!declared.has(t)) hits.push({ path: 'tailwind.config.js', detail: `fantôme : ${t}` })
  return hits
})

/** S2-T10 — Deux cibles voisines ne sont jamais dans une pile trop fine.
 *
 *  La planche déclare un écart minimal entre deux zones que le doigt doit
 *  distinguer. Le moteur calcule la profondeur la plus fine dont l'écart tient
 *  ce minimum À TOUTES LES LARGEURS, et l'expose. Ce test compare ce que les
 *  écrans emploient à ce que le moteur autorise.
 *
 *  Il existe parce que la faute était là depuis l'origine : la valeur était
 *  déclarée, aucune assertion ne la confrontait aux écarts produits (journal
 *  075). Une règle corrigée mais non gardée revient.
 *
 *  Portée déclarée : on lit le contenu DIRECT d'une pile — ce qu'elle distribue
 *  elle-même. Ce qui tombe dans une pile ou une grille imbriquée appartient à
 *  cette dernière, et sera jugé sur sa propre déclaration. */
const GEO = JSON.parse(readFileSync(join(ROOT, 'fili/geometrie.json'), 'utf8'))
const PROFONDEURS_ORDRE = GEO.profondeurs ?? []
const MINI_CIBLES = GEO.profondeurMiniCibles
/** Les composants que le doigt doit pouvoir distinguer l'un de l'autre. */
const CIBLES = ['Button', 'TextField', 'Selection']

/** Contenu direct d'une pile : son corps, moins celui de ses piles imbriquées. */
function corpsDirect(body, depart) {
  let i = depart
  let niveau = 1
  let sortie = ''
  let profondeurImbriquee = 0
  while (i < body.length && niveau > 0) {
    const ouvre = /^<(Pile|Grille)[\s>]/.exec(body.slice(i))
    const ferme = /^<\/(Pile|Grille)>/.exec(body.slice(i))
    if (ouvre) {
      if (niveau === 1 && profondeurImbriquee === 0) profondeurImbriquee = 1
      else if (profondeurImbriquee > 0) profondeurImbriquee++
      else niveau++
      i += ouvre[0].length
      continue
    }
    if (ferme) {
      if (profondeurImbriquee > 0) profondeurImbriquee--
      else niveau--
      i += ferme[0].length
      continue
    }
    if (profondeurImbriquee === 0) sortie += body[i]
    i++
  }
  return sortie
}

test('S2-T10', `Aucune pile de cibles sous « ${MINI_CIBLES} »`, () => {
  if (!MINI_CIBLES || !PROFONDEURS_ORDRE.length)
    return { blocked: 'la géométrie ne déclare pas de profondeur minimale pour les cibles' }
  const rangMini = PROFONDEURS_ORDRE.indexOf(MINI_CIBLES)
  const hits = []
  for (const { path, body } of files) {
    const re = /<(Pile|Grille)([^>]*)>/g
    let m
    while ((m = re.exec(body))) {
      const espace = /espace=["']([a-z]+)["']/.exec(m[2])?.[1] ?? 'page'
      const rang = PROFONDEURS_ORDRE.indexOf(espace)
      if (rang < 0 || rang <= rangMini) continue
      const direct = corpsDirect(body, m.index + m[0].length)
      /* On compte les CIBLES, pas leurs types : deux boutons sont deux cibles. */
      const trouve = CIBLES.flatMap((c) => direct.match(new RegExp(`<${c}[\\s/>]`, "g")) ?? [])
      if (trouve.length < 2) continue
      const ligne = body.slice(0, m.index).split('\n').length
      hits.push({
        path: `${path}:${ligne}`,
        detail: `<${m[1]} espace="${espace}"> distribue ${trouve.length} cibles — trop fin`,
      })
    }
  }
  return hits
})

/** S2-T11 — Ce qui porte du papier sur du papier porte un contour.
 *
 *  La profondeur se lit au contraste : la page recule, le contenu avance
 *  (journal 062). Mais une surface qui porte du contenu peut se retrouver DANS
 *  une surface qui en porte — un état vide dans une section qui a déjà pris le
 *  blanc, par exemple. Cela arrive neuf fois dans les sept écrans, et ce n'est
 *  pas une faute : le contour y prend le relais du fond.
 *
 *  La règle vérifiée n'est donc pas « jamais deux blancs emboîtés » — elle
 *  condamnerait neuf compositions justes — mais : **une surface qui peint du
 *  papier déclare un contour**, faute de quoi elle disparaîtrait le jour où on
 *  la pose sur du papier. La distinction passe par le fond ou par le trait ;
 *  elle ne passe jamais par rien.
 *
 *  Une seule pièce est exemptée, et elle est nommée : la section, qui EST le
 *  fond sur lequel les autres se posent, et qui ne se pose sur rien.
 */
const SURFACE_SANS_CONTOUR_ADMISE = ['src/system/Section.tsx']

test('S2-T11', 'Toute surface de papier déclare un contour', () => {
  const hits = []
  for (const { path, body } of files) {
    if (SURFACE_SANS_CONTOUR_ADMISE.includes(path)) continue
    body.split('\n').forEach((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return
      if (!/bg-papier(?![\w-])/.test(line)) return
      if (/border-/.test(line)) return
      hits.push({ path: `${path}:${i + 1}`, detail: 'du papier sans contour — invisible sur du papier' })
    })
  }
  return hits
})

/** S2-T12 — Le texte suivi ne se compose pas sous le niveau qu'il lui faut.
 *
 *  Un article n'est pas un écran d'outil. L'écart entre deux paragraphes se juge
 *  en multiples du corps — la recommandation publique tient entre une et une fois
 *  et demie — et confronté à l'échelle, un seul niveau y tombe. Le composant de
 *  prose a composé pendant des mois deux crans trop serré, à 0,70 fois le corps
 *  au lieu de 1 (journal 079).
 *
 *  Angle mort déclaré : ce test ne voit que les textes écrits À LA MAIN, l'un
 *  après l'autre. Un texte rendu par une boucle n'apparaît qu'une fois dans le
 *  source, et lui est gardé ailleurs — le moteur refuse de produire une géométrie
 *  dont la profondeur de prose passe sous son plancher. Deux protections, deux
 *  portées, toutes deux écrites. */
const PROSE_PROFONDEUR = GEO.prose?.profondeur

test('S2-T12', `Aucun texte suivi sous « ${PROSE_PROFONDEUR ?? '?'} »`, () => {
  if (!PROSE_PROFONDEUR) return { blocked: 'la géométrie ne déclare pas de profondeur pour le texte suivi' }
  const rangProse = PROFONDEURS_ORDRE.indexOf(PROSE_PROFONDEUR)
  const hits = []
  for (const { path, body } of files) {
    const re = /<(Pile|Grille)([^>]*)>/g
    let m
    while ((m = re.exec(body))) {
      const espace = /espace=["']([a-z]+)["']/.exec(m[2])?.[1] ?? 'page'
      const rang = PROFONDEURS_ORDRE.indexOf(espace)
      if (rang < 0 || rang <= rangProse) continue
      const direct = corpsDirect(body, m.index + m[0].length)
      const corps = direct.match(/<Texte[^>]*variante=["']corps["']/g) ?? []
      if (corps.length < 2) continue
      const ligne = body.slice(0, m.index).split('\n').length
      hits.push({
        path: `${path}:${ligne}`,
        detail: `<${m[1]} espace="${espace}"> distribue ${corps.length} paragraphes — trop serré pour du texte suivi`,
      })
    }
  }
  return hits
})

test('S2-T8', 'Build reproductible (hash CSS identique)', () => {
  try {
    statSync(join(ROOT, 'node_modules'))
  } catch {
    return { blocked: 'node_modules absent — lancer `npm install` puis relancer' }
  }
  if (process.argv.includes('--no-build')) {
    return { blocked: '--no-build demandé — T8 non exécuté, donc jamais compté comme PASS' }
  }

  /** Hash de l'intégralité du CSS émis, fichiers triés pour être déterministe. */
  const hashEmittedCss = () => {
    const dir = join(ROOT, 'dist', 'assets')
    const css = readdirSync(dir).filter((f) => f.endsWith('.css')).sort()
    if (css.length === 0) throw new Error('aucun CSS émis dans dist/assets')
    const h = createHash('sha256')
    for (const f of css) h.update(readFileSync(join(dir, f)))
    return { hash: h.digest('hex'), count: css.length }
  }

  const buildOnce = () => {
    rmSync(join(ROOT, 'dist'), { recursive: true, force: true })
    execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'pipe' })
    return hashEmittedCss()
  }

  const a = buildOnce()
  const b = buildOnce()

  if (a.hash !== b.hash || a.count !== b.count) {
    return [
      {
        path: 'dist/assets/*.css',
        detail:
          `hash divergents sur deux builds — ${a.count} fichier(s) ${a.hash.slice(0, 16)}… ` +
          `puis ${b.count} fichier(s) ${b.hash.slice(0, 16)}…`,
      },
    ]
  }
  return []
})

/* -------------------------------------------------------------------------- */
/* S2-T9 — test de mutation : une batterie qu'on ne sait pas faire rougir       */
/*          ne prouve rien.                                                    */
/* -------------------------------------------------------------------------- */

if (process.argv.includes('--mutate')) {
  const target = join(ROOT, 'src/App.tsx')
  const original = readFileSync(target, 'utf8')
  const mutated = original.replace('<main className="', '<main style={{ color: "#3B82F6" }} className="')

  if (mutated === original) {
    console.error('S2-T9  FAIL   la mutation n’a pas pu être injectée')
    process.exit(1)
  }

  writeFileSync(target, mutated)
  const detected = /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(target, 'utf8'))
  writeFileSync(target, original) // restauration systématique

  console.log(
    detected
      ? 'S2-T9  PASS   la mutation #3B82F6 est bien détectée par S2-T1'
      : 'S2-T9  FAIL   la mutation est passée inaperçue — S2-T1 ne prouve rien',
  )
  process.exit(detected ? 0 : 1)
}

/* -------------------------------------------------------------------------- */
/* Restitution                                                                 */
/* -------------------------------------------------------------------------- */

console.log(`\nQPM · S2 — Rythme & échelle`)
console.log(`Périmètre : ${files.length} fichiers (${files.map((f) => f.path).join(', ')})\n`)

let failed = 0
let blocked = 0

for (const { id, assertion, hits, blocked: b } of results) {
  if (b) {
    blocked += 1
    console.log(`  ${id}  BLOQUÉ  ${assertion}`)
    console.log(`          ↳ ${b}`)
    continue
  }
  if (hits.length === 0) {
    console.log(`  ${id}  PASS    ${assertion}`)
    continue
  }
  failed += 1
  console.log(`  ${id}  FAIL    ${assertion}`)
  for (const h of hits.slice(0, 10)) console.log(`          ↳ ${h.path} — ${h.detail}`)
}

const passed = results.length - failed - blocked
console.log(
  `\n  ${passed} PASS · ${failed} FAIL · ${blocked} BLOQUÉ  ` +
    `(+ S2-T9 mutation : node scripts/qpm-s2.mjs --mutate)`,
)
console.log(
  failed === 0 && blocked === 0
    ? '  → S2 peut passer 🟢\n'
    : '  → S2 reste 🟡 : le verrouillage exige 100 % de PASS\n',
)

process.exit(failed === 0 ? 0 : 1)
