/**
 * eslint-plugin-fili — Leviathan v1 (jalon J3)
 * Implémente les six assertions du contrat S1 « Composants Typés ».
 * Déterministe, 0 % IA, sans dépendance externe.
 */
import fs from 'node:fs'
import path from 'node:path'

/* ── Interrupteurs d'assertion : cibles des tests de mutation ────────────── */
const ACTIF_R11 = true
const ACTIF_R12 = true
const ACTIF_R13 = true
const ACTIF_R15 = true
const ACTIF_R16 = true
const ACTIF_R21 = true
const ACTIF_R22 = true
const ACTIF_R23 = true
const ACTIF_R24 = true
const ACTIF_R25 = true
const ACTIF_R31 = true
const ACTIF_R32 = true
const ACTIF_R33 = true
const ACTIF_R34 = true
const ACTIF_R35 = true
const ACTIF_R37 = true
const ACTIF_R41 = true
const ACTIF_R42 = true
const ACTIF_R43 = true
const ACTIF_R44 = true
const ACTIF_R45 = true
const ACTIF_R51 = true
const ACTIF_R52 = true
const ACTIF_R53 = true
/* La rupture déclarée ne lève ni R5.1 ni R5.2 : une page sans tête n'est pas une
   intention d'auteur, c'est l'absence d'arbitrage. Ces deux drapeaux existent
   pour être retournés par les tests de mutation, jamais par une configuration. */
const RUPTURE_LEVE_R51 = false
const RUPTURE_LEVE_R52 = false
/* La marque de tête ne se lit qu'au premier niveau de la page. */
const TETE_PREMIER_NIVEAU_SEUL = true
const EXIGER_MOTIF = true

/* Liste fermée, propriété du contrat S1 §R1.1. Ne s'étend pas en silence. */
const ELEMENTS_INTERACTIFS = [
  'button', 'a', 'input', 'select', 'textarea', 'form',
  'label', 'dialog', 'details', 'summary', 'option', 'fieldset'
]

/* Contrat S1 §R1.2 */
const HANDLERS_INTERACTIFS = [
  'onClick', 'onKeyDown', 'onKeyUp', 'onKeyPress', 'onMouseDown', 'onMouseUp'
]
const ROLES_INTERACTIFS = ['button', 'link', 'checkbox', 'tab', 'menuitem', 'switch']

/* ── Glob minimal : ** (traverse), * (un segment), ? (un caractère) ──────── */
function globVersRegex(glob) {
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
const correspond = (globs, rel) => globs.some((g) => globVersRegex(g).test(rel))

/* ── Registre déclaré ────────────────────────────────────────────────────── */
function chargerRegistre(cwd) {
  const p = path.join(cwd, 'fili.registry.json')
  if (!fs.existsSync(p)) return { ok: false, raison: 'fichier fili.registry.json introuvable' }
  let brut
  try { brut = JSON.parse(fs.readFileSync(p, 'utf8')) }
  catch { return { ok: false, raison: 'registre illisible (JSON invalide)' } }
  const c = brut?.components, z = brut?.zones
  if (!Array.isArray(c?.sources) || c.sources.length === 0)
    return { ok: false, raison: 'aucune source de composants déclarée' }
  if (!Array.isArray(c?.exports) || c.exports.length === 0)
    return { ok: false, raison: 'aucun composant exporté déclaré' }
  if (!z || !Array.isArray(z.systeme) || !Array.isArray(z.applicative) || !Array.isArray(z.horsPerimetre))
    return { ok: false, raison: 'zones non déclarées' }
  const e = brut?.espacement
  if (!e || !Array.isArray(e.echelle) || e.echelle.length === 0)
    return { ok: false, raison: "aucune échelle d'espacement déclarée" }
  const ry = brut?.rythme
  if (!ry || !ry.section || !Array.isArray(ry.densites) || ry.densites.length === 0)
    return { ok: false, raison: "aucune échelle de densités déclarée" }
  const lec = brut?.lecture
  if (!lec || !lec.propTete || typeof lec.seuilRang !== 'number')
    return { ok: false, raison: "aucune marque de tête ni seuil de rang déclarés" }
  const a = brut?.async
  if (!a || !Array.isArray(a.lectures) || a.lectures.length === 0)
    return { ok: false, raison: 'aucune source asynchrone déclarée' }
  if (!Array.isArray(a.conteneurs) || a.conteneurs.length === 0)
    return { ok: false, raison: "aucun conteneur d'état déclaré" }
  return { ok: true, registre: brut }
}

function zoneDe(rel, z) {
  if (correspond(z.horsPerimetre, rel)) return 'hors-perimetre'
  if (correspond(z.systeme, rel)) return 'systeme'
  if (correspond(z.applicative, rel)) return 'applicative'
  return 'hors-perimetre'
}

/* ── Contexte partagé : registre + zone du fichier ───────────────────────── */
function contexteFili(context) {
  const cwd = context.cwd ?? process.cwd()
  const chargement = chargerRegistre(cwd)
  if (!chargement.ok) return { statuer: false, chargement }
  const rel = path.relative(cwd, context.filename ?? context.getFilename()).split(path.sep).join('/')
  const zone = zoneDe(rel, chargement.registre.zones)
  const page = Array.isArray(chargement.registre.zones.page) &&
               correspond(chargement.registre.zones.page, rel) && zone === 'applicative'
  return { statuer: zone === 'applicative', page, zone, registre: chargement.registre, chargement }
}

const attribut = (n, nom) =>
  n.attributes.find((a) => a.type === 'JSXAttribute' && a.name?.type === 'JSXIdentifier' && a.name.name === nom)

function valeurTexte(attr) {
  if (!attr || !attr.value) return null
  if (attr.value.type === 'Literal') return String(attr.value.value)
  if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression?.type === 'Literal')
    return String(attr.value.expression.value)
  return null
}

const estDeclaree = (n) => valeurTexte(attribut(n, 'data-intent')) === 'statement'
const motifDe = (n) => valeurTexte(attribut(n, 'data-intent-reason'))
const estBare = (s) => !s.startsWith('.') && !s.startsWith('/')
const sourceDeclaree = (src, sources) => sources.some((d) => src === d || src.startsWith(d + '/'))

/* ── R1.1 ────────────────────────────────────────────────────────────────── */
const r11 = {
  meta: { type: 'problem', schema: [], messages: {
    brut: "FILI R1.1 — <{{el}}> est un élément interactif natif. En zone applicative, l'interface passe par un composant du registre déclaré.",
    sansMotif: "FILI R1.1 — rupture déclarée sans motif sur <{{el}}>. Ajoutez data-intent-reason=\"…\" : sans motif, c'est une négligence maquillée en intention."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!ACTIF_R11 || !f.statuer) return {}
    return { JSXOpeningElement(node) {
      if (node.name?.type !== 'JSXIdentifier') return
      const el = node.name.name
      if (!ELEMENTS_INTERACTIFS.includes(el)) return
      if (!estDeclaree(node)) return context.report({ node, messageId: 'brut', data: { el } })
      const m = motifDe(node)
      if (EXIGER_MOTIF && (!m || !m.trim())) context.report({ node, messageId: 'sansMotif', data: { el } })
    } }
  }
}

/* ── R1.2 — jamais levable par une rupture déclarée ──────────────────────── */
const r12 = {
  meta: { type: 'problem', schema: [], messages: {
    greffe: "FILI R1.2 — <{{el}}> n'est pas interactif mais porte {{quoi}}. Invisible au clavier, muet au lecteur d'écran. Une rupture déclarée ne lève jamais cette règle."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!ACTIF_R12 || !f.statuer) return {}
    return { JSXOpeningElement(node) {
      if (node.name?.type !== 'JSXIdentifier') return
      const el = node.name.name
      if (el[0] === el[0].toUpperCase()) return
      if (ELEMENTS_INTERACTIFS.includes(el)) return
      const h = HANDLERS_INTERACTIFS.find((x) => attribut(node, x))
      if (h) return context.report({ node, messageId: 'greffe', data: { el, quoi: h } })
      const role = valeurTexte(attribut(node, 'role'))
      if (role && ROLES_INTERACTIFS.includes(role))
        return context.report({ node, messageId: 'greffe', data: { el, quoi: `role="${role}"` } })
      if (attribut(node, 'tabIndex')) context.report({ node, messageId: 'greffe', data: { el, quoi: 'tabIndex' } })
    } }
  }
}

/* ── R1.3 / R1.5 — appartenance au registre, pas de fork silencieux ──────── */
const r13r15 = {
  meta: { type: 'problem', schema: [], messages: {
    horsRegistre: "FILI R1.3 — <{{nom}}> vient de « {{src}} », qui n'est pas une source déclarée du registre. Un composant qui ressemble au système sans en venir ment sur son origine.",
    forkImporte: "FILI R1.5 — « {{nom}} » est un nom du registre importé depuis « {{src}} ». Deux composants du même nom, un seul porte les décisions approuvées.",
    forkLocal: "FILI R1.5 — « {{nom}} » redéfinit localement un nom du registre. C'est le premier geste du fork silencieux."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!f.statuer) return {}
    const sources = f.registre.components.sources
    const exports_ = f.registre.components.exports
    const imports = new Map()
    return {
      ImportDeclaration(node) {
        for (const s of node.specifiers) imports.set(s.local.name, node.source.value)
      },
      'FunctionDeclaration, ClassDeclaration, VariableDeclarator'(node) {
        if (!ACTIF_R15) return
        const nom = node.id?.name
        if (nom && exports_.includes(nom)) context.report({ node, messageId: 'forkLocal', data: { nom } })
      },
      'Program:exit'() {
        for (const [nom, src] of imports) {
          if (nom[0] !== nom[0].toUpperCase()) continue
          const declaree = sourceDeclaree(src, sources)
          if (ACTIF_R15 && exports_.includes(nom) && !declaree) {
            context.report({ node: context.sourceCode.ast, messageId: 'forkImporte', data: { nom, src } })
          } else if (ACTIF_R13 && !declaree && estBare(src)) {
            context.report({ node: context.sourceCode.ast, messageId: 'horsRegistre', data: { nom, src } })
          }
        }
      }
    }
  }
}

/* ── R1.6 — pas d'échappement ────────────────────────────────────────────── */
const r16 = {
  meta: { type: 'problem', schema: [], messages: {
    echappement: "FILI R1.6 — {{quoi}} permet de produire de l'interactif hors composant. Une règle contournable en une ligne n'est pas une règle."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!ACTIF_R16 || !f.statuer) return {}
    return {
      JSXAttribute(node) {
        if (node.name?.name === 'dangerouslySetInnerHTML')
          context.report({ node, messageId: 'echappement', data: { quoi: 'dangerouslySetInnerHTML' } })
      },
      AssignmentExpression(node) {
        const p = node.left?.property?.name
        if (p === 'innerHTML' || p === 'outerHTML')
          context.report({ node, messageId: 'echappement', data: { quoi: `l'assignation de ${p}` } })
      },
      CallExpression(node) {
        const c = node.callee
        if (c?.type !== 'MemberExpression' || c.property?.name !== 'createElement') return
        const a = node.arguments[0]
        if (a?.type === 'Literal' && ELEMENTS_INTERACTIFS.includes(String(a.value)))
          context.report({ node, messageId: 'echappement', data: { quoi: `createElement('${a.value}')` } })
      }
    }
  }
}


/* ── S2 · Contrat d'État — R2.1 → R2.5 ───────────────────────────────────── */
function identifiants(node, acc) {
  if (!node || typeof node !== 'object') return acc
  if (node.type === 'Identifier') acc.add(node.name)
  for (const k of Object.keys(node)) {
    if (k === 'parent' || k === 'loc' || k === 'range') continue
    const v = node[k]
    if (Array.isArray(v)) v.forEach((x) => identifiants(x, acc))
    else if (v && typeof v.type === 'string') identifiants(v, acc)
  }
  return acc
}

const s2 = {
  meta: { type: 'problem', schema: [], messages: {
    horsConteneur: "FILI R2.1 — ce fichier lit une donnée distante ({{hook}}) sans la rendre à travers un conteneur d'état déclaré. Le cas heureux s'affiche, les trois autres sont laissés au hasard.",
    slotManquant: "FILI R2.2 — <{{el}}> n'expose pas le slot « {{slot}} ». Un état oublié n'apparaît jamais en démo : il apparaît chez l'utilisateur.",
    slotMuet: "FILI R2.5 — le slot « {{slot}} » de <{{el}}> est vide. Un slot rempli de rien coche la case sans rien dire à personne.",
    rupturePortee: "FILI R2.2 — la rupture déclarée ne couvre pas le slot « {{slot}} ». Le réseau échoue toujours et la latence existe toujours : déclarer leur absence n'est pas une intention, c'est un pari perdu d'avance.",
    ruptureSansMotif: "FILI R2.2 — rupture déclarée sur « {{slot}} » sans motif. Nommez la raison de l'impossibilité.",
    mutationMuette: "FILI R2.3 — cette mutation n'expose pas {{quoi}}. L'utilisateur clique, rien ne bouge, il reclique.",
    drapeauHorsConteneur: "FILI R2.4 — « {{nom}} » est un drapeau d'état lu hors du conteneur. Deux mécanismes de feedback qui coexistent, c'est deux comportements qui divergent."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!f.statuer) return {}
    const a = f.registre.async
    const drapeauxLecture = new Set()
    const mutations = []
    let lectureAppelee = null
    let conteneurRendu = false
    const idsDansJSX = new Set()

    const nomsDuPattern = (pat) => {
      const out = []
      if (!pat) return out
      if (pat.type === 'ObjectPattern') for (const pr of pat.properties)
        if (pr.value?.type === 'Identifier') out.push([pr.key?.name, pr.value.name])
      return out
    }

    return {
      VariableDeclarator(node) {
        const appel = node.init
        if (appel?.type !== 'CallExpression' || appel.callee?.type !== 'Identifier') return
        const nom = appel.callee.name
        if (a.lectures.includes(nom)) {
          lectureAppelee = { nom, node }
          for (const [, local] of nomsDuPattern(node.id)) drapeauxLecture.add(local)
        }
        if (a.mutations.includes(nom)) {
          mutations.push({ node, champs: new Map(nomsDuPattern(node.id)) })
        }
      },
      'JSXExpressionContainer Identifier'(node) { idsDansJSX.add(node.name) },
      'IfStatement, ConditionalExpression'(node) {
        if (!ACTIF_R24) return
        for (const nom of identifiants(node.test, new Set()))
          if (drapeauxLecture.has(nom))
            return context.report({ node, messageId: 'drapeauHorsConteneur', data: { nom } })
      },
      JSXOpeningElement(node) {
        if (node.name?.type !== 'JSXIdentifier') return
        const el = node.name.name
        if (!a.conteneurs.includes(el)) return
        conteneurRendu = true

        const intent = valeurTexte(attribut(node, 'data-intent')) === 'statement'
        const slotLeve = valeurTexte(attribut(node, 'data-intent-slot'))
        const motif = valeurTexte(attribut(node, 'data-intent-reason'))

        for (const slot of a.slots) {
          const attr = attribut(node, slot)
          if (attr) {
            if (ACTIF_R25 && estMuet(attr))
              context.report({ node, messageId: 'slotMuet', data: { el, slot } })
            continue
          }
          if (!ACTIF_R22) continue
          if (intent && slotLeve === slot) {
            if (!a.slotsRupture.includes(slot))
              context.report({ node, messageId: 'rupturePortee', data: { slot } })
            else if (EXIGER_MOTIF && (!motif || !motif.trim()))
              context.report({ node, messageId: 'ruptureSansMotif', data: { slot } })
            continue
          }
          context.report({ node, messageId: 'slotManquant', data: { el, slot } })
        }
      },
      'Program:exit'(prog) {
        if (ACTIF_R21 && lectureAppelee && !conteneurRendu)
          context.report({ node: lectureAppelee.node, messageId: 'horsConteneur', data: { hook: lectureAppelee.nom } })
        if (!ACTIF_R23) return
        for (const m of mutations) {
          const attente = m.champs.get(a.champAttente)
          if (!attente) { context.report({ node: m.node, messageId: 'mutationMuette', data: { quoi: `son attente (${a.champAttente})` } }); continue }
          const issue = a.champsIssue.map((c) => m.champs.get(c)).find(Boolean)
          if (!issue) { context.report({ node: m.node, messageId: 'mutationMuette', data: { quoi: `son issue (${a.champsIssue.join(' ou ')})` } }); continue }
          if (!idsDansJSX.has(attente) || !idsDansJSX.has(issue))
            context.report({ node: m.node, messageId: 'mutationMuette', data: { quoi: "son attente et son issue dans le rendu" } })
        }
      }
    }
  }
}

function estMuet(attr) {
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
const PREF_ESPACE = ['m','mt','mb','ml','mr','mx','my','p','pt','pb','pl','pr','px','py','gap','gap-x','gap-y','space-x','space-y']
const PREF_MARGE  = ['m','mt','mb','ml','mr','mx','my']
const PREF_TAILLE = ['w','h','min-w','min-h','max-w','max-h','top','right','bottom','left','inset','translate-x','translate-y']

const prefixeDe = (classe, liste) => {
  const nu = classe.replace(/^-/, '')
  return liste
    .filter((p) => nu.startsWith(p + '-'))
    .sort((x, y) => y.length - x.length)[0] || null
}
const valeurDe = (classe, prefixe) => classe.replace(/^-/, '').slice(prefixe.length + 1)

const s3 = {
  meta: { type: 'problem', schema: [], messages: {
    horsEchelle: "FILI R3.1 — « {{classe}} » n'appartient pas à l'échelle déclarée. Une valeur hors échelle appelle une compensation, qui appelle une exception, qui appelle un correctif.",
    marge: "FILI R3.2 — « {{classe}} » est une marge. En zone applicative, l'espace se pose par le conteneur ({{ok}}), jamais par l'enfant qui pousse ses voisins. Une rupture déclarée ne lève jamais cette règle.",
    styleEnLigne: "FILI R3.3 — espacement en style inline ({{prop}}). Ni token, ni thème, ni mode sombre, ni surcharge responsive : c'est de la négligence, jamais une intention.",
    proximite: "FILI R3.7 — l'écart entre ces groupes ({{parent}} px) n'atteint pas {{facteur}} fois leur écart intérieur ({{enfant}} px). Deux valeurs parfaitement issues de l'échelle peuvent produire un groupe illisible : c'est le rapport qui dit à l'œil ce qui va avec quoi.",
    magique: "FILI R3.4 — « {{classe}} » est une valeur magique. C'est la trace d'un écran, pas d'une décision : elle meurt au premier changement de contenu.",
    construite: "FILI R3.5 — classe d'espacement construite dynamiquement. Une règle contournable par concaténation n'est pas une règle.",
    ruptureSansMotif: "FILI R3.4 — rupture déclarée sans motif sur « {{classe}} ». Nommez ce que la valeur hors échelle sert."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!f.statuer) return {}
    const echelle = new Set(f.registre.espacement.echelle.map(String))
    const exceptions = new Set(f.registre.espacement.exceptions || [])
    const PROPS_ESPACE = ['margin','marginTop','marginBottom','marginLeft','marginRight','padding','paddingTop','paddingBottom','paddingLeft','paddingRight','gap','rowGap','columnGap','top','right','bottom','left']

    const controlerClasses = (texte, node) => {
      const declaree = estDeclaree(node)
      const motif = motifDe(node)
      for (const classe of texte.split(/\s+/).filter(Boolean)) {
        if (exceptions.has(classe)) continue

        const pMarge = prefixeDe(classe, PREF_MARGE)
        if (ACTIF_R32 && pMarge) {
          context.report({ node, messageId: 'marge', data: { classe, ok: 'gap · padding · space' } })
          continue
        }
        const arbitraire = /\[[^\]]+\]$/.test(classe)
        const pTaille = prefixeDe(classe, PREF_TAILLE)
        if (pTaille && arbitraire) {
          if (!ACTIF_R34) continue
          if (!declaree) { context.report({ node, messageId: 'magique', data: { classe } }); continue }
          if (EXIGER_MOTIF && (!motif || !motif.trim()))
            context.report({ node, messageId: 'ruptureSansMotif', data: { classe } })
          continue
        }
        const pEspace = prefixeDe(classe, PREF_ESPACE)
        if (!ACTIF_R31 || !pEspace) continue
        const val = valeurDe(classe, pEspace)
        if (arbitraire || !echelle.has(val)) {
          if (declaree && motif && motif.trim()) continue
          if (declaree) { context.report({ node, messageId: 'ruptureSansMotif', data: { classe } }); continue }
          context.report({ node, messageId: 'horsEchelle', data: { classe } })
        }
      }
    }

    return {

      JSXElement(node) {
        if (!ACTIF_R37) return
        const prox = f.registre.espacement.proximite
        const px = f.registre.espacement.pixels
        if (!prox || !px) return

        const ecartDe = (el) => {
          if (!el || el.type !== 'JSXElement') return null
          const ouv = el.openingElement
          const nom = ouv.name?.type === 'JSXIdentifier' ? ouv.name.name : null
          /* prop déclarée, sur un conteneur déclaré */
          if (nom && prox.conteneurs.includes(nom)) {
            const a = attribut(ouv, prox.propEspace)
            const e = a?.value?.type === 'JSXExpressionContainer' ? a.value.expression : a?.value
            const v = e?.type === 'Literal' ? String(e.value) : null
            if (v && px.prop[v] !== undefined) return { nom, px: px.prop[v] }
          }
          /* classe utilitaire */
          const cls = attribut(ouv, 'className')
          const texte = cls?.value?.type === 'Literal' ? String(cls.value.value) : null
          if (!texte) return null
          for (const c of texte.split(/\s+/)) {
            const m = /^(?:gap|gap-x|gap-y|space-x|space-y)-(\d+)$/.exec(c)
            if (m) return { nom: nom || 'bloc', px: Number(m[1]) * px.classeMultiplicateur }
          }
          return null
        }

        const parent = ecartDe(node)
        if (!parent) return
        /* Une liste rendue par .map() est un groupe de pairs par construction. */
        const jsxDuMap = (c) => {
          if (c.type !== 'JSXExpressionContainer') return null
          const e = c.expression
          if (e?.type !== 'CallExpression' || e.callee?.property?.name !== 'map') return null
          const cb = e.arguments[0]
          const corps = cb?.body
          if (corps?.type === 'JSXElement') return corps
          return null
        }
        const enfants = []
        for (const c of node.children || []) {
          if (c.type === 'JSXElement') {
            const ecart = ecartDe(c)
            if (ecart) enfants.push({ nom: c.openingElement.name?.name, ecart })
            continue
          }
          const rep = jsxDuMap(c)
          if (!rep) continue
          const ecart = ecartDe(rep)
          if (!ecart) continue
          const nom = rep.openingElement.name?.name
          enfants.push({ nom, ecart }, { nom, ecart })
        }
        /* On ne juge que des groupes pairs : au moins deux enfants de même type,
           chacun portant son propre écart intérieur. */
        const parType = new Map()
        for (const e of enfants) parType.set(e.nom, [...(parType.get(e.nom) || []), e])
        for (const [, groupe] of parType) {
          if (groupe.length < 2) continue
          const interieur = Math.max(...groupe.map((g) => g.ecart.px))
          if (parent.px < prox.facteur * interieur)
            context.report({ node: node.openingElement, messageId: 'proximite',
              data: { parent: parent.px, enfant: interieur, facteur: prox.facteur } })
        }
      },
      JSXAttribute(node) {
        if (node.name?.name === 'className') {
          const v = node.value
          if (v?.type === 'Literal') return controlerClasses(String(v.value), node.parent)
          const e = v?.type === 'JSXExpressionContainer' ? v.expression : null
          if (!e) return
          if (e.type === 'Literal') return controlerClasses(String(e.value), node.parent)
          if (e.type === 'TemplateLiteral') {
            const brut = e.quasis.map((q) => q.value.cooked).join(' ')
            if (e.expressions.length === 0) return controlerClasses(brut, node.parent)
            /* Les fragments d'une classe construite ne sont pas des classes :
               on ne les juge pas à l'échelle, on refuse la construction elle-même. */
            const construitUnEspace = brut.split(/\s+/).some((c) =>
              PREF_ESPACE.includes(c.replace(/-$/, '')) || prefixeDe(c, PREF_ESPACE))
            if (ACTIF_R35 && construitUnEspace) context.report({ node, messageId: 'construite' })
            return
          }
        }
        if (ACTIF_R33 && node.name?.name === 'style') {
          const e = node.value?.type === 'JSXExpressionContainer' ? node.value.expression : null
          if (e?.type !== 'ObjectExpression') return
          for (const pr of e.properties) {
            const nom = pr.key?.name || pr.key?.value
            if (PROPS_ESPACE.includes(nom))
              context.report({ node, messageId: 'styleEnLigne', data: { prop: nom } })
          }
        }
      }
    }
  }
}


/* ── S4 · Rythme de Composition — R4.1 → R4.5 ────────────────────────────── */
const s4 = {
  meta: { type: 'problem', schema: [], messages: {
    pasUneSection: "FILI R4.1 — <{{el}}> au premier niveau d'une page. Une page est une suite de <{{section}}> : tant qu'elle est un empilement de blocs anonymes, son rythme n'existe nulle part.",
    densiteManquante: "FILI R4.2 — cette section ne déclare pas sa densité. Le rythme cesse d'être une impression le jour où il devient une donnée écrite.",
    densiteInconnue: "FILI R4.2 — densité « {{v}} » hors de l'échelle déclarée ({{liste}}).",
    monotonie: "FILI R4.3 — {{n}} sections « {{densite}} » à la suite. Une page qui ne change jamais de respiration se lit comme un formulaire, quel que soit son contenu.",
    titreUnique: "FILI R4.4 — deuxième titre de niveau 1 dans la page. La hiérarchie de titres est la table des matières que les lecteurs d'écran annoncent.",
    titreSaut: "FILI R4.4 — saut de niveau {{de}} → {{a}}. Un saut n'est jamais un choix esthétique : c'est la conséquence d'un copier-coller.",
    tailleSurchargee: "FILI R4.5 — taille de titre surchargée localement (« {{classe}} »). Un titre doit être grand parce qu'il est important, pas important parce qu'il est grand."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!f.statuer || !f.page) return {}
    const ry = f.registre.rythme
    const titres = []

    const densiteDe = (ouv) => {
      const a = attribut(ouv, ry.propDensite)
      const e = a?.value?.type === 'JSXExpressionContainer' ? a.value.expression : a?.value
      return e?.type === 'Literal' ? String(e.value) : null
    }

    return {
      JSXElement(node) {
        /* racine de page : aucun JSXElement au-dessus */
        let p = node.parent, dedans = false
        while (p) { if (p.type === 'JSXElement') { dedans = true; break } p = p.parent }
        if (dedans) return

        const sections = (node.children || []).filter((c) => c.type === 'JSXElement')
        const suite = []
        for (const c of sections) {
          const nom = c.openingElement.name?.name
          if (nom !== ry.section) {
            if (ACTIF_R41) context.report({ node: c.openingElement, messageId: 'pasUneSection', data: { el: nom, section: ry.section } })
            suite.push(null)
            continue
          }
          const d = densiteDe(c.openingElement)
          if (!d) { if (ACTIF_R42) context.report({ node: c.openingElement, messageId: 'densiteManquante' }); suite.push(null); continue }
          if (!ry.densites.includes(d)) {
            if (ACTIF_R42) context.report({ node: c.openingElement, messageId: 'densiteInconnue', data: { v: d, liste: ry.densites.join(' · ') } })
            suite.push(null); continue
          }
          suite.push({ d, el: c.openingElement })
        }

        if (!ACTIF_R43) return
        let serie = 1
        for (let i = 1; i < suite.length; i++) {
          if (!suite[i] || !suite[i - 1] || suite[i].d !== suite[i - 1].d) { serie = 1; continue }
          serie++
          if (serie <= ry.seuilAlternance) continue
          const ouv = suite[i].el
          if (estDeclaree(ouv) && motifDe(ouv) && motifDe(ouv).trim()) { serie = 1; continue }
          context.report({ node: ouv, messageId: 'monotonie', data: { n: serie, densite: suite[i].d } })
        }
      },
      JSXOpeningElement(node) {
        const nom = node.name?.type === 'JSXIdentifier' ? node.name.name : null
        if (!nom) return
        let niveau = null
        if (/^h[1-6]$/.test(nom)) niveau = Number(nom[1])
        else if (nom === 'Titre') {
          const a = attribut(node, 'niveau')
          const e = a?.value?.type === 'JSXExpressionContainer' ? a.value.expression : a?.value
          if (e?.type === 'Literal') niveau = Number(e.value)
        }
        if (niveau === null) return
        titres.push({ niveau, node })

        if (!ACTIF_R45) return
        const cls = attribut(node, 'className')
        const texte = cls?.value?.type === 'Literal' ? String(cls.value.value) : null
        if (!texte) return
        for (const c of texte.split(/\s+/))
          if (/^text-(\[.+\]|xs|sm|base|lg|xl|\d?xl)$/.test(c)) {
            if (estDeclaree(node) && motifDe(node) && motifDe(node).trim()) continue
            context.report({ node, messageId: 'tailleSurchargee', data: { classe: c } })
          }
      },
      'Program:exit'() {
        if (!ACTIF_R44) return
        let vus = 0
        for (let i = 0; i < titres.length; i++) {
          if (titres[i].niveau === 1) { vus++; if (vus > 1) context.report({ node: titres[i].node, messageId: 'titreUnique' }) }
          if (i === 0) continue
          const de = titres[i - 1].niveau, a = titres[i].niveau
          if (a - de > 1) context.report({ node: titres[i].node, messageId: 'titreSaut', data: { de, a } })
        }
      }
    }
  }
}

/* ── S5 · Arbitrage de Lecture (R5.1 → R5.3) ─────────────────────────────── */
const s5 = {
  meta: { type: 'problem', schema: [], messages: {
    sansTete: "FILI R5.1 — aucune section de cette page ne déclare porter ce qui compte d'abord. Ce n'est pas un parti pris minimaliste : c'est une décision qui n'a pas été prise, et elle ne se voit sur aucune ligne.",
    deuxTetes: "FILI R5.2 — deuxième section déclarée comme portant ce qui compte d'abord. Deux têtes ne sont pas deux priorités : c'est une indécision qui se déclare deux fois.",
    teteEnterree: "FILI R5.3 — la tête arrive en position {{rang}}, précédée de {{avant}} section(s) (seuil : {{seuil}}). Déclarer une tête puis l'enterrer, c'est le minimum légal."
  } },
  create(context) {
    const f = contexteFili(context)
    if (!f.statuer || !f.page) return {}
    const ry = f.registre.rythme
    const lec = f.registre.lecture

    const porteLaTete = (ouv) => {
      const a = attribut(ouv, lec.propTete)
      if (!a) return false
      if (a.value === null || a.value === undefined) return true
      const e = a.value.type === 'JSXExpressionContainer' ? a.value.expression : a.value
      if (e?.type === 'Literal') return !(e.value === false || e.value === 'false')
      return true
    }
    const ruptureTenue = (ouv) => estDeclaree(ouv) && (!EXIGER_MOTIF || Boolean(motifDe(ouv)?.trim()))

    return {
      JSXElement(node) {
        let p = node.parent, dedans = false
        while (p) { if (p.type === 'JSXElement') { dedans = true; break } p = p.parent }
        if (dedans) return

        const sections = []
        const visiter = (n) => {
          for (const c of (n.children || [])) {
            if (c.type !== 'JSXElement') continue
            if (c.openingElement.name?.name === ry.section) sections.push(c.openingElement)
            if (!TETE_PREMIER_NIVEAU_SEUL) visiter(c)
          }
        }
        visiter(node)

        const marquees = sections.filter(porteLaTete)

        /* R5.1 — au moins une. La rupture ne la lève pas. */
        if (ACTIF_R51 && marquees.length === 0) {
          if (!(RUPTURE_LEVE_R51 && sections.some(ruptureTenue)))
            context.report({ node: node.openingElement, messageId: 'sansTete' })
        }

        /* R5.2 — au plus une. La rupture ne la lève pas. */
        if (ACTIF_R52 && marquees.length > 1) {
          for (const ouv of marquees.slice(1)) {
            if (RUPTURE_LEVE_R52 && ruptureTenue(ouv)) continue
            context.report({ node: ouv, messageId: 'deuxTetes' })
          }
        }

        /* R5.3 — la première marquée n'est pas enterrée. Vraie par vacuité s'il
           n'y en a aucune : c'est R5.1 qui parle, pas elle. */
        if (ACTIF_R53 && marquees.length >= 1) {
          const premiere = marquees[0]
          const avant = sections.indexOf(premiere)
          if (avant > lec.seuilRang && !ruptureTenue(premiere))
            context.report({ node: premiere, messageId: 'teteEnterree',
              data: { rang: avant + 1, avant, seuil: lec.seuilRang } })
        }
      }
    }
  }
}

/* ── R1.4 — pas de registre, pas de verdict ──────────────────────────────── */
const r14 = {
  meta: { type: 'problem', schema: [], messages: {
    refus: "FILI — REFUS DE STATUER : {{raison}}. Le Leviathan ne peut pas vérifier ce fichier, il ne dira donc pas qu'il est conforme."
  } },
  create(context) {
    const c = chargerRegistre(context.cwd ?? process.cwd())
    if (c.ok) return {}
    return { Program(node) { context.report({ node, messageId: 'refus', data: { raison: c.raison } }) } }
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
    'etat-declare': s2,
    'discipline-spatiale': s3,
    'rythme-composition': s4,
    'arbitrage-lecture': s5
  }
}
