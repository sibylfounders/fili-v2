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

/** Échelle d'espacement Tailwind par défaut (theme.extend.spacing est vide). */
const SPACING_SCALE = new Set([
  '0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7',
  '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40',
  '44', '48', '52', '56', '60', '64', '72', '80', '96', 'auto', 'full',
])

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
