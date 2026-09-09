/**
 * eslint-plugin-fili — Leviathan v1 (jalon J3)
 * Implémente les six assertions du contrat S1 « Composants Typés ».
 * Déterministe, 0 % IA, sans dépendance externe.
 */
import fs from 'node:fs'
import path from 'node:path'

/* ── Interrupteurs d'assertion : cibles des tests de mutation ────────────── */
const ACTIVE_R11 = true
const ACTIVE_R12 = true
const ACTIVE_R13 = true
const ACTIVE_R15 = true
const ACTIVE_R16 = true
const ACTIVE_R21 = true
const ACTIVE_R22 = true
const ACTIVE_R23 = true
const ACTIVE_R24 = true
const ACTIVE_R25 = true
const ACTIVE_R27 = true
const ACTIVE_R31 = true
const ACTIVE_R32 = true
const ACTIVE_R33 = true
const ACTIVE_R34 = true
const ACTIVE_R35 = true
const ACTIVE_R37 = true
const ACTIVE_R41 = true
const ACTIVE_R42 = true
const ACTIVE_R43 = true
const ACTIVE_R44 = true
const ACTIVE_R45 = true
const ACTIVE_R51 = true
const ACTIVE_R52 = true
const ACTIVE_R53 = true
/* La rupture déclarée ne lève ni R5.1 ni R5.2 : une page sans tête n'est pas une
   intention d'auteur, c'est l'absence d'arbitrage. Ces deux drapeaux existent
   pour être retournés par les tests de mutation, jamais par une configuration. */
const RUPTURE_RAISED_R51 = false
const RUPTURE_RAISED_R52 = false
/* La marque de tête ne se lit qu'au premier niveau de la page. */
const HEAD_FIRST_LEVEL_SINGLE = true
const REQUIRE_REASON = true

/* Liste fermée, propriété du contrat S1 §R1.1. Ne s'étend pas en silence. */
const ELEMENTS_INTERACTIVE = [
  'button', 'a', 'input', 'select', 'textarea', 'form',
  'label', 'dialog', 'details', 'summary', 'option', 'fieldset'
]

/* Contrat S1 §R1.2 */
const HANDLERS_INTERACTIVE = [
  'onClick', 'onKeyDown', 'onKeyUp', 'onKeyPress', 'onMouseDown', 'onMouseUp'
]
const ROLES_INTERACTIVE = ['button', 'link', 'checkbox', 'tab', 'menuitem', 'switch']

/* ── Glob minimal : ** (traverse), * (un segment), ? (un caractère) ──────── */
function globToRegex(glob) {
  let out = '^'
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]
    if (c === '*' && glob[i + 1] === '*') {
      if (glob[i + 2] === '/') { out += '(?:.*/)?'; i += 2 } else { out += '.*'; i += 1 }
    } else if (c === '*') out += '[^/]*'
    else if (c === '?') out += '[^/]'
    else out += c.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp(out + '$')
}
const matches = (globs, rel) => globs.some((g) => globToRegex(g).test(rel))

/* ── Registre déclaré ────────────────────────────────────────────────────── */
function loadRegistry(cwd) {
  const p = path.join(cwd, 'fili/registry.json')
  if (!fs.existsSync(p)) return { ok: false, reason: 'fichier fili/registry.json introuvable' }
  let raw
  try { raw = JSON.parse(fs.readFileSync(p, 'utf8')) }
  catch { return { ok: false, reason: 'registre illisible (JSON invalide)' } }
  const c = raw?.components, z = raw?.zones
  if (!Array.isArray(c?.sources) || c.sources.length === 0)
    return { ok: false, reason: 'aucune source de composants déclarée' }
  if (!Array.isArray(c?.exports) || c.exports.length === 0)
    return { ok: false, reason: 'aucun composant exporté déclaré' }
  if (!z || !Array.isArray(z.system) || !Array.isArray(z.applicative) || !Array.isArray(z.offScope))
    return { ok: false, reason: 'zones non déclarées' }
  const e = raw?.spacing
  if (!e || !Array.isArray(e.scale) || e.scale.length === 0)
    return { ok: false, reason: "aucune échelle d'espacement déclarée" }
  const ry = raw?.rhythm
  if (!ry || !ry.section || !Array.isArray(ry.densities) || ry.densities.length === 0)
    return { ok: false, reason: "aucune échelle de densités déclarée" }
  const read = raw?.reading
  if (!read || !read.propHead || typeof read.thresholdRank !== 'number')
    return { ok: false, reason: "aucune marque de tête ni seuil de rang déclarés" }
  const a = raw?.async
  if (!a || !Array.isArray(a.readings) || a.readings.length === 0)
    return { ok: false, reason: 'aucune source asynchrone déclarée' }
  if (!Array.isArray(a.containers) || a.containers.length === 0)
    return { ok: false, reason: "aucun conteneur d'état déclaré" }
  return { ok: true, registry: raw }
}

function zoneOf(rel, z) {
  if (matches(z.offScope, rel)) return 'off-scope'
  if (matches(z.system, rel)) return 'system'
  if (matches(z.applicative, rel)) return 'applicative'
  return 'off-scope'
}

/* ── Contexte partagé : registre + zone du fichier ───────────────────────── */
function contextFili(context) {
  const cwd = context.cwd ?? process.cwd()
  const loading = loadRegistry(cwd)
  if (!loading.ok) return { decide: false, loading }
  const rel = path.relative(cwd, context.filename ?? context.getFilename()).split(path.sep).join('/')
  const zone = zoneOf(rel, loading.registry.zones)
  const page = Array.isArray(loading.registry.zones.page) &&
               matches(loading.registry.zones.page, rel) && zone === 'applicative'
  return { decide: zone === 'applicative', page, zone, registry: loading.registry, loading }
}

const attribute = (n, name) =>
  n.attributes.find((a) => a.type === 'JSXAttribute' && a.name?.type === 'JSXIdentifier' && a.name.name === name)

function valueText(attr) {
  if (!attr || !attr.value) return null
  if (attr.value.type === 'Literal') return String(attr.value.value)
  if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression?.type === 'Literal')
    return String(attr.value.expression.value)
  return null
}

const isDeclared = (n) => valueText(attribute(n, 'data-intent')) === 'statement'
const reasonOf = (n) => valueText(attribute(n, 'data-intent-reason'))
const isBare = (s) => !s.startsWith('.') && !s.startsWith('/')
const sourceDeclared = (src, sources) => sources.some((d) => src === d || src.startsWith(d + '/'))

/* ── R1.1 ────────────────────────────────────────────────────────────────── */
const r11 = {
  meta: { type: 'problem', schema: [], messages: {
    raw: "FILI R1.1 — <{{el}}> est un élément interactif natif. En zone applicative, l'interface passe par un composant du registre déclaré.",
    withoutReason: "FILI R1.1 — rupture déclarée sans motif sur <{{el}}>. Ajoutez data-intent-reason=\"…\" : sans motif, c'est une négligence maquillée en intention."
  } },
  create(context) {
    const f = contextFili(context)
    if (!ACTIVE_R11 || !f.decide) return {}
    return { JSXOpeningElement(node) {
      if (node.name?.type !== 'JSXIdentifier') return
      const el = node.name.name
      if (!ELEMENTS_INTERACTIVE.includes(el)) return
      if (!isDeclared(node)) return context.report({ node, messageId: 'raw', data: { el } })
      const m = reasonOf(node)
      if (REQUIRE_REASON && (!m || !m.trim())) context.report({ node, messageId: 'withoutReason', data: { el } })
    } }
  }
}

/* ── R1.2 — jamais levable par une rupture déclarée ──────────────────────── */
const r12 = {
  meta: { type: 'problem', schema: [], messages: {
    graft: "FILI R1.2 — <{{el}}> n'est pas interactif mais porte {{quoi}}. Invisible au clavier, muet au lecteur d'écran. Une rupture déclarée ne lève jamais cette règle."
  } },
  create(context) {
    const f = contextFili(context)
    if (!ACTIVE_R12 || !f.decide) return {}
    return { JSXOpeningElement(node) {
      if (node.name?.type !== 'JSXIdentifier') return
      const el = node.name.name
      if (el[0] === el[0].toUpperCase()) return
      if (ELEMENTS_INTERACTIVE.includes(el)) return
      const h = HANDLERS_INTERACTIVE.find((x) => attribute(node, x))
      if (h) return context.report({ node, messageId: 'graft', data: { el, what: h } })
      const role = valueText(attribute(node, 'role'))
      if (role && ROLES_INTERACTIVE.includes(role))
        return context.report({ node, messageId: 'graft', data: { el, what: `role="${role}"` } })
      if (attribute(node, 'tabIndex')) context.report({ node, messageId: 'graft', data: { el, what: 'tabIndex' } })
    } }
  }
}

/* ── R1.3 / R1.5 — appartenance au registre, pas de fork silencieux ──────── */
const r13r15 = {
  meta: { type: 'problem', schema: [], messages: {
    offRegistry: "FILI R1.3 — <{{nom}}> vient de « {{src}} », qui n'est pas une source déclarée du registre. Un composant qui ressemble au système sans en venir ment sur son origine.",
    forkImported: "FILI R1.5 — « {{nom}} » est un nom du registre importé depuis « {{src}} ». Deux composants du même nom, un seul porte les décisions approuvées.",
    forkLocal: "FILI R1.5 — « {{nom}} » redéfinit localement un nom du registre. C'est le premier geste du fork silencieux."
  } },
  create(context) {
    const f = contextFili(context)
    if (!f.decide) return {}
    const sources = f.registry.components.sources
    const exports_ = f.registry.components.exports
    const imports = new Map()
    return {
      ImportDeclaration(node) {
        for (const s of node.specifiers) imports.set(s.local.name, node.source.value)
      },
      'FunctionDeclaration, ClassDeclaration, VariableDeclarator'(node) {
        if (!ACTIVE_R15) return
        const name = node.id?.name
        if (name && exports_.includes(name)) context.report({ node, messageId: 'forkLocal', data: { name } })
      },
      'Program:exit'() {
        for (const [name, src] of imports) {
          if (name[0] !== name[0].toUpperCase()) continue
          const declared = sourceDeclared(src, sources)
          if (ACTIVE_R15 && exports_.includes(name) && !declared) {
            context.report({ node: context.sourceCode.ast, messageId: 'forkImported', data: { name, src } })
          } else if (ACTIVE_R13 && !declared && isBare(src)) {
            context.report({ node: context.sourceCode.ast, messageId: 'offRegistry', data: { name, src } })
          }
        }
      }
    }
  }
}

/* ── R1.6 — pas d'échappement ────────────────────────────────────────────── */
const r16 = {
  meta: { type: 'problem', schema: [], messages: {
    escaping: "FILI R1.6 — {{quoi}} permet de produire de l'interactif hors composant. Une règle contournable en une ligne n'est pas une règle."
  } },
  create(context) {
    const f = contextFili(context)
    if (!ACTIVE_R16 || !f.decide) return {}
    return {
      JSXAttribute(node) {
        if (node.name?.name === 'dangerouslySetInnerHTML')
          context.report({ node, messageId: 'escaping', data: { what: 'dangerouslySetInnerHTML' } })
      },
      AssignmentExpression(node) {
        const p = node.left?.property?.name
        if (p === 'innerHTML' || p === 'outerHTML')
          context.report({ node, messageId: 'escaping', data: { what: `l'assignation de ${p}` } })
      },
      CallExpression(node) {
        const c = node.callee
        if (c?.type !== 'MemberExpression' || c.property?.name !== 'createElement') return
        const a = node.arguments[0]
        if (a?.type === 'Literal' && ELEMENTS_INTERACTIVE.includes(String(a.value)))
          context.report({ node, messageId: 'escaping', data: { what: `createElement('${a.value}')` } })
      }
    }
  }
}


/* ── S2 · Contrat d'État — R2.1 → R2.5 ───────────────────────────────────── */
function identifiers(node, acc) {
  if (!node || typeof node !== 'object') return acc
  if (node.type === 'Identifier') acc.add(node.name)
  for (const k of Object.keys(node)) {
    if (k === 'parent' || k === 'loc' || k === 'range') continue
    const v = node[k]
    if (Array.isArray(v)) v.forEach((x) => identifiers(x, acc))
    else if (v && typeof v.type === 'string') identifiers(v, acc)
  }
  return acc
}

const s2 = {
  meta: { type: 'problem', schema: [], messages: {
    offContainer: "FILI R2.1 — ce fichier lit une donnée distante ({{hook}}) sans la rendre à travers un conteneur d'état déclaré. Le cas heureux s'affiche, les trois autres sont laissés au hasard.",
    slotMissing: "FILI R2.2 — <{{el}}> n'expose pas le slot « {{slot}} ». Un état oublié n'apparaît jamais en démo : il apparaît chez l'utilisateur.",
    slotSilent: "FILI R2.5 — le slot « {{slot}} » de <{{el}}> est vide. Un slot rempli de rien coche la case sans rien dire à personne.",
    ruptureReach: "FILI R2.2 — la rupture déclarée ne couvre pas le slot « {{slot}} ». Le réseau échoue toujours et la latence existe toujours : déclarer leur absence n'est pas une intention, c'est un pari perdu d'avance.",
    ruptureWithoutReason: "FILI R2.2 — rupture déclarée sur « {{slot}} » sans motif. Nommez la raison de l'impossibilité.",
    mutationSilent: "FILI R2.3 — cette mutation n'expose pas {{quoi}}. L'utilisateur clique, rien ne bouge, il reclique.",
    flagOffContainer: "FILI R2.4 — « {{nom}} » est un drapeau d'état lu hors du conteneur. Deux mécanismes de feedback qui coexistent, c'est deux comportements qui divergent."
  } },
  create(context) {
    const f = contextFili(context)
    if (!f.decide) return {}
    const a = f.registry.async
    const flagsReading = new Set()
    const mutations = []
    let readingCalled = null
    let containerRender = false
    const idsInsideJSX = new Set()

    const namesOfPattern = (pat) => {
      const out = []
      if (!pat) return out
      if (pat.type === 'ObjectPattern') for (const pr of pat.properties)
        if (pr.value?.type === 'Identifier') out.push([pr.key?.name, pr.value.name])
      return out
    }

    return {
      VariableDeclarator(node) {
        const call = node.init
        if (call?.type !== 'CallExpression' || call.callee?.type !== 'Identifier') return
        const name = call.callee.name
        if (a.readings.includes(name)) {
          readingCalled = { name, node }
          for (const [, local] of namesOfPattern(node.id)) flagsReading.add(local)
        }
        if (a.mutations.includes(name)) {
          mutations.push({ node, fields: new Map(namesOfPattern(node.id)) })
        }
      },
      'JSXExpressionContainer Identifier'(node) { idsInsideJSX.add(node.name) },
      'IfStatement, ConditionalExpression'(node) {
        if (!ACTIVE_R24) return
        for (const name of identifiers(node.test, new Set()))
          if (flagsReading.has(name))
            return context.report({ node, messageId: 'flagOffContainer', data: { name } })
      },
      JSXOpeningElement(node) {
        if (node.name?.type !== 'JSXIdentifier') return
        const el = node.name.name
        if (!a.containers.includes(el)) return
        containerRender = true

        const intent = valueText(attribute(node, 'data-intent')) === 'statement'
        const slotRaised = valueText(attribute(node, 'data-intent-slot'))
        const reason = valueText(attribute(node, 'data-intent-reason'))

        for (const slot of a.slots) {
          const attr = attribute(node, slot)
          if (attr) {
            if (ACTIVE_R25 && isSilent(attr))
              context.report({ node, messageId: 'slotSilent', data: { el, slot } })
            continue
          }
          if (!ACTIVE_R22) continue
          if (intent && slotRaised === slot) {
            if (!a.slotsRupture.includes(slot))
              context.report({ node, messageId: 'ruptureReach', data: { slot } })
            else if (REQUIRE_REASON && (!reason || !reason.trim()))
              context.report({ node, messageId: 'ruptureWithoutReason', data: { slot } })
            continue
          }
          context.report({ node, messageId: 'slotMissing', data: { el, slot } })
        }
      },
      'Program:exit'(prog) {
        if (ACTIVE_R21 && readingCalled && !containerRender)
          context.report({ node: readingCalled.node, messageId: 'offContainer', data: { hook: readingCalled.name } })
        if (!ACTIVE_R23) return
        for (const m of mutations) {
          const waiting = m.fields.get(a.fieldWaiting)
          if (!waiting) { context.report({ node: m.node, messageId: 'mutationSilent', data: { what: `son attente (${a.fieldWaiting})` } }); continue }
          const issue = a.fieldsIssue.map((c) => m.fields.get(c)).find(Boolean)
          if (!issue) { context.report({ node: m.node, messageId: 'mutationSilent', data: { what: `son issue (${a.fieldsIssue.join(' ou ')})` } }); continue }
          if (!idsInsideJSX.has(waiting) || !idsInsideJSX.has(issue))
            context.report({ node: m.node, messageId: 'mutationSilent', data: { what: "son attente et son issue dans le rendu" } })
        }
      }
    }
  }
}

function isSilent(attr) {
  const v = attr.value
  if (!v) return false
  if (v.type !== 'JSXExpressionContainer') return false
  const e = v.expression
  if (!e) return false
  if (e.type === 'Literal' && (e.value === null || e.value === false)) return true
  if (e.type === 'Identifier' && e.name === 'undefined') return true
  if (e.type === 'JSXFragment' && (e.children || []).every((c) => c.type === 'JSXText' && !c.value.trim())) return true
  return false
}


/* ── S3 · Discipline Spatiale — R3.1 → R3.5 ──────────────────────────────── */
const PREF_SPACE = ['m','mt','mb','ml','mr','mx','my','p','pt','pb','pl','pr','px','py','gap','gap-x','gap-y','space-x','space-y']
const PREF_MARGIN  = ['m','mt','mb','ml','mr','mx','my']
const PREF_SIZE = ['w','h','min-w','min-h','max-w','max-h','top','right','bottom','left','inset','translate-x','translate-y']

const prefixOf = (cls, list) => {
  const bare = cls.replace(/^-/, '')
  return list
    .filter((p) => bare.startsWith(p + '-'))
    .sort((x, y) => y.length - x.length)[0] || null
}
const valueOf = (cls, prefix) => cls.replace(/^-/, '').slice(prefix.length + 1)
/* Un nombre qui se lit. L'Échelle produit des valeurs continues : les afficher
   brutes dans un message rendrait le message illisible. */
const readable = (v) => String(Math.round(v * 100) / 100).replace('.', ',')

const s3 = {
  meta: { type: 'problem', schema: [], messages: {
    offScale: "FILI R3.1 — « {{classe}} » n'appartient pas à l'échelle déclarée pour cette propriété. L'échelle porte des noms de profondeur, plus des nombres, et chaque nom porte son axe : un token horizontal ne se pose pas sur une propriété verticale, et une propriété qui porte les deux axes à la fois n'a aucun token valide. Une valeur hors échelle appelle une compensation, qui appelle une exception, qui appelle un correctif.",
    margin: "FILI R3.2 — « {{classe}} » est une marge. En zone applicative, l'espace se pose par le conteneur ({{ok}}), jamais par l'enfant qui pousse ses voisins. Une rupture déclarée ne lève jamais cette règle.",
    styleInLine: "FILI R3.3 — espacement en style inline ({{prop}}). Ni token, ni thème, ni mode sombre, ni surcharge responsive : c'est de la négligence, jamais une intention.",
    proximity: "FILI R3.7 — l'écart entre ces groupes ({{parent}} px) n'atteint pas {{facteur}} fois leur écart intérieur ({{enfant}} px). Deux groupes emboîtés au même rang se ressemblent : c'est le rapport, et lui seul, qui dit à l'œil ce qui va avec quoi. Le facteur est le ratio de l'Échelle — deux profondeurs voisines en sont séparées par construction.",
    magic: "FILI R3.4 — « {{classe}} » est une valeur magique. C'est la trace d'un écran, pas d'une décision : elle meurt au premier changement de contenu.",
    built: "FILI R3.5 — classe d'espacement construite dynamiquement. Une règle contournable par concaténation n'est pas une règle.",
    ruptureWithoutReason: "FILI R3.4 — rupture déclarée sans motif sur « {{classe}} ». Nommez ce que la valeur hors échelle sert."
  } },
  create(context) {
    const f = contextFili(context)
    if (!f.decide) return {}
    const scale = new Set(f.registry.spacing.scale.map(String))
    const exceptions = new Set(f.registry.spacing.exceptions || [])
    /* Deux axes distincts, et le nom du token porte le sien. L'échelle d'une
       propriété horizontale n'est donc pas celle d'une propriété verticale, et
       une propriété qui porte les deux axes à la fois — p-…, gap-… — n'a aucun
       token valide : elle les mélangerait. C'est ce que le modèle d'Auteur rend
       détectable, et qui était impossible avec un axe unique. */
    const AXIS_OF = {}
    for (const [axis, prefixes] of Object.entries(f.registry.spacing.axes || {}))
      for (const pref of prefixes) AXIS_OF[pref] = axis
    const PROPS_SPACE = ['margin','marginTop','marginBottom','marginLeft','marginRight','padding','paddingTop','paddingBottom','paddingLeft','paddingRight','gap','rowGap','columnGap','top','right','bottom','left']

    const checkClasses = (text, node) => {
      const declared = isDeclared(node)
      const reason = reasonOf(node)
      for (const cls of text.split(/\s+/).filter(Boolean)) {
        if (exceptions.has(cls)) continue

        const pMargin = prefixOf(cls, PREF_MARGIN)
        if (ACTIVE_R32 && pMargin) {
          context.report({ node, messageId: 'margin', data: { cls, ok: 'gap · padding · space' } })
          continue
        }
        const arbitrary = /\[[^\]]+\]$/.test(cls)
        const pSize = prefixOf(cls, PREF_SIZE)
        if (pSize && arbitrary) {
          if (!ACTIVE_R34) continue
          if (!declared) { context.report({ node, messageId: 'magic', data: { cls } }); continue }
          if (REQUIRE_REASON && (!reason || !reason.trim()))
            context.report({ node, messageId: 'ruptureWithoutReason', data: { cls } })
          continue
        }
        const pSpace = prefixOf(cls, PREF_SPACE)
        if (!ACTIVE_R31 || !pSpace) continue
        const val = valueOf(cls, pSpace)
        const axis = AXIS_OF[pSpace]
        const onLScale =
          !arbitrary && axis !== undefined && scale.has(val) && val.startsWith(axis + '-')
        if (!onLScale) {
          if (declared && reason && reason.trim()) continue
          if (declared) { context.report({ node, messageId: 'ruptureWithoutReason', data: { cls } }); continue }
          context.report({ node, messageId: 'offScale', data: { cls } })
        }
      }
    }

    return {

      JSXElement(node) {
        if (!ACTIVE_R37) return
        const prox = f.registry.spacing.proximity
        const px = f.registry.spacing.pixels
        if (!prox || !px) return

        const gapOf = (el) => {
          if (!el || el.type !== 'JSXElement') return null
          const open = el.openingElement
          const name = open.name?.type === 'JSXIdentifier' ? open.name.name : null
          /* prop déclarée, sur un conteneur déclaré */
          if (name && prox.containers.includes(name)) {
            const a = attribute(open, prox.propSpace)
            const e = a?.value?.type === 'JSXExpressionContainer' ? a.value.expression : a?.value
            const v = e?.type === 'Literal' ? String(e.value) : null
            if (v && px.gaps[v] !== undefined) return { name, px: px.gaps[v] }
          }
          /* classe utilitaire */
          const cls = attribute(open, 'className')
          const text = cls?.value?.type === 'Literal' ? String(cls.value.value) : null
          if (!text) return null
          for (const c of text.split(/\s+/)) {
            const m = /^(?:gap|gap-x|gap-y|space-x|space-y)-(?:inline|block)-([a-z]+)$/.exec(c)
            if (m && px.gaps[m[1]] !== undefined) return { name: name || 'bloc', px: px.gaps[m[1]] }
          }
          return null
        }

        const parent = gapOf(node)
        if (!parent) return
        /* Une liste rendue par .map() est un groupe de pairs par construction. */
        const jsxOfMap = (c) => {
          if (c.type !== 'JSXExpressionContainer') return null
          const e = c.expression
          if (e?.type !== 'CallExpression' || e.callee?.property?.name !== 'map') return null
          const cb = e.arguments[0]
          const body = cb?.body
          if (body?.type === 'JSXElement') return body
          return null
        }
        const children = []
        for (const c of node.children || []) {
          if (c.type === 'JSXElement') {
            const gap = gapOf(c)
            if (gap) children.push({ name: c.openingElement.name?.name, gap })
            continue
          }
          const rep = jsxOfMap(c)
          if (!rep) continue
          const gap = gapOf(rep)
          if (!gap) continue
          const name = rep.openingElement.name?.name
          children.push({ name, gap }, { name, gap })
        }
        /* On ne juge que des groupes pairs : au moins deux enfants de même type,
           chacun portant son propre écart intérieur. */
        const byType = new Map()
        for (const e of children) byType.set(e.name, [...(byType.get(e.name) || []), e])
        for (const [, group] of byType) {
          if (group.length < 2) continue
          const inner = Math.max(...group.map((g) => g.gap.px))
          /* Le rapport se compare à des réels : sans tolérance, deux profondeurs
             exactement voisines tomberaient du mauvais côté sur une décimale. */
          if (parent.px < prox.factor * inner - (prox.tolerance || 0))
            context.report({ node: node.openingElement, messageId: 'proximity',
              data: { parent: readable(parent.px), child: readable(inner), factor: readable(prox.factor) } })
        }
      },
      JSXAttribute(node) {
        if (node.name?.name === 'className') {
          const v = node.value
          if (v?.type === 'Literal') return checkClasses(String(v.value), node.parent)
          const e = v?.type === 'JSXExpressionContainer' ? v.expression : null
          if (!e) return
          if (e.type === 'Literal') return checkClasses(String(e.value), node.parent)
          if (e.type === 'TemplateLiteral') {
            const raw = e.quasis.map((q) => q.value.cooked).join(' ')
            if (e.expressions.length === 0) return checkClasses(raw, node.parent)
            /* Les fragments d'une classe construite ne sont pas des classes :
               on ne les juge pas à l'échelle, on refuse la construction elle-même. */
            const builtOneSpace = raw.split(/\s+/).some((c) =>
              PREF_SPACE.includes(c.replace(/-$/, '')) || prefixOf(c, PREF_SPACE))
            if (ACTIVE_R35 && builtOneSpace) context.report({ node, messageId: 'built' })
            return
          }
        }
        if (ACTIVE_R33 && node.name?.name === 'style') {
          const e = node.value?.type === 'JSXExpressionContainer' ? node.value.expression : null
          if (e?.type !== 'ObjectExpression') return
          for (const pr of e.properties) {
            const name = pr.key?.name || pr.key?.value
            if (PROPS_SPACE.includes(name))
              context.report({ node, messageId: 'styleInLine', data: { prop: name } })
          }
        }
      }
    }
  }
}


/* ── S4 · Rythme de Composition — R4.1 → R4.5 ────────────────────────────── */
const s4 = {
  meta: { type: 'problem', schema: [], messages: {
    incrementOneSection: "FILI R4.1 — <{{el}}> au premier niveau d'une page. Une page est une suite de <{{section}}> : tant qu'elle est un empilement de blocs anonymes, son rythme n'existe nulle part.",
    densityMissing: "FILI R4.2 — cette section ne déclare pas sa densité. Le rythme cesse d'être une impression le jour où il devient une donnée écrite.",
    densityUnknown: "FILI R4.2 — densité « {{v}} » hors de l'échelle déclarée ({{liste}}).",
    monotony: "FILI R4.3 — {{n}} sections « {{densite}} » à la suite. Une page qui ne change jamais de respiration se lit comme un formulaire, quel que soit son contenu.",
    headingUnique: "FILI R4.4 — deuxième titre de niveau 1 dans la page. La hiérarchie de titres est la table des matières que les lecteurs d'écran annoncent.",
    headingJump: "FILI R4.4 — saut de niveau {{de}} → {{a}}. Un saut n'est jamais un choix esthétique : c'est la conséquence d'un copier-coller.",
    sizeOverloaded: "FILI R4.5 — taille de titre surchargée localement (« {{classe}} »). Un titre doit être grand parce qu'il est important, pas important parce qu'il est grand."
  } },
  create(context) {
    const f = contextFili(context)
    if (!f.decide || !f.page) return {}
    const ry = f.registry.rhythm
    const headings = []

    const densityOf = (open) => {
      const a = attribute(open, ry.propDensity)
      const e = a?.value?.type === 'JSXExpressionContainer' ? a.value.expression : a?.value
      return e?.type === 'Literal' ? String(e.value) : null
    }

    return {
      JSXElement(node) {
        /* racine de page : aucun JSXElement au-dessus */
        let p = node.parent, inside = false
        while (p) { if (p.type === 'JSXElement') { inside = true; break } p = p.parent }
        if (inside) return

        const sections = (node.children || []).filter((c) => c.type === 'JSXElement')
        const next = []
        for (const c of sections) {
          const name = c.openingElement.name?.name
          if (name !== ry.section) {
            if (ACTIVE_R41) context.report({ node: c.openingElement, messageId: 'incrementOneSection', data: { el: name, section: ry.section } })
            next.push(null)
            continue
          }
          const d = densityOf(c.openingElement)
          if (!d) { if (ACTIVE_R42) context.report({ node: c.openingElement, messageId: 'densityMissing' }); next.push(null); continue }
          if (!ry.densities.includes(d)) {
            if (ACTIVE_R42) context.report({ node: c.openingElement, messageId: 'densityUnknown', data: { v: d, list: ry.densities.join(' · ') } })
            next.push(null); continue
          }
          next.push({ d, el: c.openingElement })
        }

        if (!ACTIVE_R43) return
        let series = 1
        for (let i = 1; i < next.length; i++) {
          if (!next[i] || !next[i - 1] || next[i].d !== next[i - 1].d) { series = 1; continue }
          series++
          if (series <= ry.thresholdAlternation) continue
          const open = next[i].el
          if (isDeclared(open) && reasonOf(open) && reasonOf(open).trim()) { series = 1; continue }
          context.report({ node: open, messageId: 'monotony', data: { n: series, density: next[i].d } })
        }
      },
      JSXOpeningElement(node) {
        const name = node.name?.type === 'JSXIdentifier' ? node.name.name : null
        if (!name) return
        let level = null
        if (/^h[1-6]$/.test(name)) level = Number(name[1])
        else if (name === 'Heading') {
          const a = attribute(node, 'level')
          const e = a?.value?.type === 'JSXExpressionContainer' ? a.value.expression : a?.value
          if (e?.type === 'Literal') level = Number(e.value)
        }
        if (level === null) return
        headings.push({ level, node })

        if (!ACTIVE_R45) return
        const cls = attribute(node, 'className')
        const text = cls?.value?.type === 'Literal' ? String(cls.value.value) : null
        if (!text) return
        for (const c of text.split(/\s+/))
          if (/^text-(\[.+\]|xs|sm|base|lg|xl|\d?xl)$/.test(c)) {
            if (isDeclared(node) && reasonOf(node) && reasonOf(node).trim()) continue
            context.report({ node, messageId: 'sizeOverloaded', data: { cls: c } })
          }
      },
      'Program:exit'() {
        if (!ACTIVE_R44) return
        let seenAll = 0
        for (let i = 0; i < headings.length; i++) {
          if (headings[i].level === 1) { seenAll++; if (seenAll > 1) context.report({ node: headings[i].node, messageId: 'headingUnique' }) }
          if (i === 0) continue
          const of = headings[i - 1].level, a = headings[i].level
          if (a - of > 1) context.report({ node: headings[i].node, messageId: 'headingJump', data: { of, a } })
        }
      }
    }
  }
}

/* ── S5 · Arbitrage de Lecture (R5.1 → R5.3) ─────────────────────────────── */
const s5 = {
  meta: { type: 'problem', schema: [], messages: {
    withoutHead: "FILI R5.1 — aucune section de cette page ne déclare porter ce qui compte d'abord. Ce n'est pas un parti pris minimaliste : c'est une décision qui n'a pas été prise, et elle ne se voit sur aucune ligne.",
    twoHeads: "FILI R5.2 — deuxième section déclarée comme portant ce qui compte d'abord. Deux têtes ne sont pas deux priorités : c'est une indécision qui se déclare deux fois.",
    headBuried: "FILI R5.3 — la tête arrive en position {{rang}}, précédée de {{avant}} section(s) (seuil : {{seuil}}). Déclarer une tête puis l'enterrer, c'est le minimum légal."
  } },
  create(context) {
    const f = contextFili(context)
    if (!f.decide || !f.page) return {}
    const ry = f.registry.rhythm
    const read = f.registry.reading

    const doorThereHead = (open) => {
      const a = attribute(open, read.propHead)
      if (!a) return false
      if (a.value === null || a.value === undefined) return true
      const e = a.value.type === 'JSXExpressionContainer' ? a.value.expression : a.value
      if (e?.type === 'Literal') return !(e.value === false || e.value === 'false')
      return true
    }
    const ruptureHeld = (open) => isDeclared(open) && (!REQUIRE_REASON || Boolean(reasonOf(open)?.trim()))

    return {
      JSXElement(node) {
        let p = node.parent, inside = false
        while (p) { if (p.type === 'JSXElement') { inside = true; break } p = p.parent }
        if (inside) return

        const sections = []
        const visit = (n) => {
          for (const c of (n.children || [])) {
            if (c.type !== 'JSXElement') continue
            if (c.openingElement.name?.name === ry.section) sections.push(c.openingElement)
            if (!HEAD_FIRST_LEVEL_SINGLE) visit(c)
          }
        }
        visit(node)

        const marked = sections.filter(doorThereHead)

        /* R5.1 — au moins une. La rupture ne la lève pas. */
        if (ACTIVE_R51 && marked.length === 0) {
          if (!(RUPTURE_RAISED_R51 && sections.some(ruptureHeld)))
            context.report({ node: node.openingElement, messageId: 'withoutHead' })
        }

        /* R5.2 — au plus une. La rupture ne la lève pas. */
        if (ACTIVE_R52 && marked.length > 1) {
          for (const open of marked.slice(1)) {
            if (RUPTURE_RAISED_R52 && ruptureHeld(open)) continue
            context.report({ node: open, messageId: 'twoHeads' })
          }
        }

        /* R5.3 — la première marquée n'est pas enterrée. Vraie par vacuité s'il
           n'y en a aucune : c'est R5.1 qui parle, pas elle. */
        if (ACTIVE_R53 && marked.length >= 1) {
          const firstOne = marked[0]
          const before = sections.indexOf(firstOne)
          if (before > read.thresholdRank && !ruptureHeld(firstOne))
            context.report({ node: firstOne, messageId: 'headBuried',
              data: { rank: before + 1, before, threshold: read.thresholdRank } })
        }
      }
    }
  }
}

/* ── S2 · R2.7 — le skeleton annonce la page qui vient ──────────────────── */
/* Née du point de passage B-6, séance du 2026-08-07 : « les titres et les
   textes ne sont pas traités en skeleton comme le reste ». Le défaut n'est pas
   qu'il manque du gris, c'est qu'il en manque À CÔTÉ du gris : une section qui
   attend s'affiche à moitié lue, et le skeleton dément la page qu'il annonce.
   Arbitrage d'Auteur du 2026-08-08 : la règle ne juge que le chargement, elle
   laisse le haut de page écrit, elle se contrôle sur le fichier, et elle se
   déclare avec un motif quand un écran doit en sortir.
   Ce qu'elle ne voit pas, et qui est su : le Gardien lit un fichier, pas une
   image. Un skeleton de la bonne quantité et de la mauvaise forme passe. */

function nameJSX(n) {
  return n && n.type === 'JSXElement' && n.openingElement &&
         n.openingElement.name && n.openingElement.name.type === 'JSXIdentifier'
    ? n.openingElement.name.name
    : null
}

function walkJSX(node, visit) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) { for (const n of node) walkJSX(n, visit); return }
  if (typeof node.type !== 'string') return
  if (node.type === 'JSXElement' || node.type === 'JSXText') {
    if (visit(node) === false) return
  }
  for (const k of Object.keys(node)) {
    if (k === 'parent' || k === 'loc' || k === 'range') continue
    const v = node[k]
    if (Array.isArray(v)) { for (const x of v) walkJSX(x, visit) }
    else if (v && typeof v.type === 'string') walkJSX(v, visit)
  }
}

const levelOf = (n) => {
  const a = attribute(n.openingElement, 'level')
  if (!a || !a.value) return null
  if (a.value.type === 'Literal') return Number(a.value.value)
  if (a.value.type === 'JSXExpressionContainer' && a.value.expression &&
      a.value.expression.type === 'Literal') return Number(a.value.expression.value)
  return null
}

const s2skeleton = {
  meta: { type: 'problem', schema: [], messages: {
    headingWritten: "FILI R2.7 — le titre de cette section reste écrit pendant qu'elle attend ses données. Une section qui attend attend en entier : à moitié grise, à moitié lue, elle annonce une page qui n'est pas celle qui arrive.",
    sentenceWritten: "FILI R2.7 — la phrase posée sous ce titre reste écrite pendant que la section attend. Elle explique un contenu que personne ne voit encore.",
    contentOpaque: "FILI R2.7 — un bloc de contenu est rendu à côté du conteneur d'état, sans qu'on puisse lire ce qu'il contient. Écrivez-le à sa place, dans les états du conteneur.",
    loadingSpeaks: "FILI R2.7 — <{{el}}> est rendu pendant le chargement. Le chargement ne montre que du skeleton : un mot vrai à côté du gris fait croire que la page est arrivée.",
    ruptureWithoutReason: "FILI R2.7 — rupture déclarée sans motif. Nommez la raison pour laquelle cet écran sort de la règle."
  } },
  create(context) {
    const f = contextFili(context)
    if (!f.decide || !f.page || !ACTIVE_R27) return {}
    const containers = f.registry.async.containers
    const nameSection = f.registry.rhythm.section
    const allowedInLoading = new Set(['Skeleton'].concat(
      (f.registry.spacing.proximity && f.registry.spacing.proximity.containers) || []
    ).concat(containers))

    /* Enfants structurels d'un élément, sans jamais entrer dans un conteneur. */
    const walk = (children, parent, foundAll, opaque) => {
      for (const c of children || []) {
        if (c.type === 'JSXElement') {
          const n = nameJSX(c)
          if (n && containers.includes(n)) continue
          foundAll.push({ node: c, name: n, parent })
          walk(c.children, c, foundAll, opaque)
        } else if (c.type === 'JSXExpressionContainer') {
          const e = c.expression
          if (!e || e.type === 'JSXEmptyExpression') continue
          if (e.type === 'Identifier') opaque.push(c)
        }
      }
    }

    return {
      /* (a) — ce qui reste écrit à côté d'un conteneur, dans la même section */
      JSXElement(node) {
        if (nameJSX(node) !== nameSection) return
        let aContainer = false
        walkJSX(node.children, (n) => {
          const nn = nameJSX(n)
          if (nn && containers.includes(nn)) { aContainer = true; return false }
        })
        if (!aContainer) return

        const opening = node.openingElement
        if (isDeclared(opening)) {
          const reason = reasonOf(opening)
          if (REQUIRE_REASON && (!reason || !reason.trim()))
            context.report({ node: opening, messageId: 'ruptureWithoutReason' })
          return
        }

        const foundAll = [], opaque = []
        walk(node.children, node, foundAll, opaque)

        /* Le haut de page reste écrit : le groupe qui porte le titre de niveau 1. */
        let groupOfHead = null
        for (const t of foundAll)
          if (t.name === 'Heading' && levelOf(t.node) === 1) { groupOfHead = t.parent; break }

        const parentsFaulty = new Set()
        for (const t of foundAll) {
          if (t.name !== 'Heading') continue
          if (groupOfHead && t.parent === groupOfHead) continue
          parentsFaulty.add(t.parent)
          context.report({ node: t.node, messageId: 'headingWritten' })
        }
        for (const t of foundAll) {
          if (t.name !== 'Text') continue
          if (!parentsFaulty.has(t.parent)) continue
          context.report({ node: t.node, messageId: 'sentenceWritten' })
        }
        for (const o of opaque) context.report({ node: o, messageId: 'contentOpaque' })
      },

      /* (b) — ce que le slot « chargement » a le droit de montrer */
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return
        if (!containers.includes(node.name.name)) return
        const slot = attribute(node, 'loading')
        if (!slot || !slot.value) return

        if (isDeclared(node) && valueText(attribute(node, 'data-intent-slot')) === 'loading') {
          const reason = reasonOf(node)
          if (REQUIRE_REASON && (!reason || !reason.trim()))
            context.report({ node, messageId: 'ruptureWithoutReason' })
          return
        }

        walkJSX(slot.value, (n) => {
          if (n.type === 'JSXText') {
            if (n.value.trim()) context.report({ node: n, messageId: 'loadingSpeaks', data: { el: 'du texte' } })
            return
          }
          const name = nameJSX(n)
          if (!name || !/^[A-Z]/.test(name)) return
          if (allowedInLoading.has(name)) return
          context.report({ node: n, messageId: 'loadingSpeaks', data: { el: name } })
        })
      }
    }
  }
}


/* ── R1.4 — pas de registre, pas de verdict ──────────────────────────────── */
const r14 = {
  meta: { type: 'problem', schema: [], messages: {
    refusal: "FILI — REFUS DE STATUER : {{raison}}. Le Leviathan ne peut pas vérifier ce fichier, il ne dira donc pas qu'il est conforme."
  } },
  create(context) {
    const c = loadRegistry(context.cwd ?? process.cwd())
    if (c.ok) return {}
    return { Program(node) { context.report({ node, messageId: 'refusal', data: { reason: c.reason } }) } }
  }
}

export default {
  meta: { name: 'eslint-plugin-fili', version: '1.0.0' },
  rules: {
    'registry-required': r14,
    'no-raw-interactive': r11,
    'no-fake-interactive': r12,
    'registry-only-components': r13r15,
    'no-escape-hatch': r16,
    'state-declared': s2,
    'skeleton-announces': s2skeleton,
    'discipline-spatiale': s3,
    'rhythm-composition': s4,
    'ruling-reading': s5
  }
}
