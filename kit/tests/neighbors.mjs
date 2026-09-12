/* L'ÉPREUVE DES VOISINS — kit/tests/neighbors.mjs (11 septembre 2026, loi 16 « le solde »)
   Ce qui se mesure ici se mesure SUR LE CONTENU, jamais sur la boîte : la hauteur d'une
   colonne est la distance entre le haut de sa première chose visible (un texte, une image)
   et le bas de sa dernière — pas la hauteur du rectangle que la mise en page lui a donné.
   Une boîte étirée ne cache rien : elle est vide en bas, et le vide se voit.

   Quatre cas, sur n'importe quel HTML rendu :
   a · une rangée à colonnes qui porte un élément élastique SE FERME — les bas de contenu
       sont alignés à une ligne près ;
   b · une rangée sans élément élastique SE SOLDE — le rapport des hauteurs de contenu
       reste sous le seuil ;
   c · un contrôle n'est jamais étiré à la hauteur d'un bloc ;
   d · un filet a le même espace des deux côtés, à une ligne près.

   Les réglages (⚪, à valider à l'œil) sont ceux de la loi : seuil 1,5, tolérance d'une
   ligne (la hauteur de ligne du texte de la rangée). Ils sont passés à l'inspecteur, jamais
   écrits dedans.

   Chaque faute dit de combien de LIGNES elle franchit son seuil (marginLines) — dans la même
   unité pour les quatre cas, y compris le solde, où l'excès se lit aussi en lignes. Une faute
   n'est pas un booléen : une qui tient à un cheveu ne dit que la police de la machine. C'est
   ce que la preuve de verify.mjs exige des mutations (12 septembre 2026).

   Tout ce fichier s'exécute DANS la page (page.evaluate) : il ne peut rien importer, il ne
   ferme sur rien. Il rend des faits ; le juge est dans verify.mjs. */

export const SETTINGS = {
  ratio: 1.5,        /* b · rapport des hauteurs de contenu admis dans une rangée qui se solde (⚪ provisoire) */
  lines: 1,          /* a · d · tolérance, en lignes de texte */
  minLines: 3,       /* b · une rangée dont la plus haute colonne fait moins de trois lignes n'est pas une rangée qui se solde (badges, boutons, menus) */
  mediaLines: 3,     /* une image plus basse que trois lignes (de la rangée) est un signe, pas une matière élastique — sauf déclarée data-elastic */
  maxScreens: 1.5,   /* une rangée plus haute qu'un écran et demi est une mise en page (rail, colonne, panneau), pas une rangée que l'œil pèse d'un coup */
  controls: 'button, input:not([type=hidden]), select, textarea, [role="button"], a.button, .button, [data-control]',
  media: 'img, video, picture, canvas, svg, iframe, [data-elastic]',
  separators: 'hr, [role="separator"], [data-separator]',
}

/* L'inspecteur : une fonction pure, sérialisée vers la page. */
export function inspect(S) {
  const doc = document
  const cs = (el) => getComputedStyle(el)
  const rect = (el) => el.getBoundingClientRect()
  const visible = (el) => {
    if (!(el instanceof Element)) return false
    const c = cs(el)
    if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) === 0) return false
    const r = rect(el)
    return r.width > 0 && r.height > 0
  }
  const name = (el) => {
    let s = el.tagName.toLowerCase()
    if (el.id) s += '#' + el.id
    else if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.')
    return s
  }
  const lineOf = (el) => {
    const c = cs(el)
    const lh = parseFloat(c.lineHeight)
    return Number.isFinite(lh) ? lh : 1.2 * parseFloat(c.fontSize)
  }
  const isControl = (el) => { try { return el.matches(S.controls) } catch { return false } }
  const isMedia = (el) => { try { return el.matches(S.media) } catch { return false } }
  const isSeparator = (el) => { try { return el.matches(S.separators) } catch { return false } }

  /* ── Le rectangle du contenu : l'union des textes rendus et des objets remplacés ── */
  function contentRect(el) {
    let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity, any = false
    const add = (r) => { if (r.width <= 0 || r.height <= 0) return; any = true; top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom); left = Math.min(left, r.left); right = Math.max(right, r.right) }
    const seeText = (node) => {
      if (!node.textContent.trim()) return
      const p = node.parentElement
      if (!p || !visible(p)) return
      const range = doc.createRange(); range.selectNodeContents(node)
      for (const r of range.getClientRects()) add(r)
    }
    const seeElement = (node) => {
      if (!visible(node)) return
      if (isMedia(node)) { add(rect(node)); return }
      const c = cs(node)
      if (node.children.length === 0 && c.backgroundImage !== 'none') add(rect(node))
      if (isControl(node) && node.children.length === 0 && !node.textContent.trim()) add(rect(node)) /* un champ vide a une hauteur : la sienne */
    }
    seeElement(el)
    const walker = doc.createTreeWalker(el, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
    let n
    while ((n = walker.nextNode())) {
      if (n.nodeType === 3) seeText(n)
      else if (n !== el) seeElement(n)
    }
    return any ? { top, bottom, left, right, height: bottom - top, width: right - left } : null
  }

  /* ── Les rangées : un parent dont plusieurs enfants visibles sont côte à côte ── */
  function linesOf(children) {
    /* on groupe les enfants par recouvrement vertical : une grille qui replie donne plusieurs lignes */
    const items = children.map((el) => ({ el, r: rect(el) })).sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)
    const lines = []
    for (const it of items) {
      const L = lines[lines.length - 1]
      if (L && it.r.top < L.bottom - Math.min(it.r.height, L.bottom - L.top) * 0.5) { L.items.push(it); L.bottom = Math.max(L.bottom, it.r.bottom) }
      else lines.push({ top: it.r.top, bottom: it.r.bottom, items: [it] })
    }
    return lines.map((L) => L.items).filter((its) => {
      if (its.length < 2) return false
      /* côte à côte : deux d'entre eux ne se recouvrent pas horizontalement */
      const sorted = its.slice().sort((a, b) => a.r.left - b.r.left)
      for (let i = 1; i < sorted.length; i++) if (sorted[i].r.left >= sorted[i - 1].r.right - 1) return true
      return false
    })
  }

  const rows = []
  for (const parent of doc.body.querySelectorAll('*')) {
    if (!visible(parent)) continue
    const kids = [...parent.children].filter(visible)
    if (kids.length < 2) continue
    const d = cs(parent).display
    if (!/flex|grid|table-row|inline-block|block|flow-root|list-item/.test(d)) continue
    const rowLine = lineOf(parent) /* la ligne de la rangée : celle de son texte courant, une seule pour toutes les colonnes */
    for (const line of linesOf(kids)) {
      const cols = line.map(({ el, r }) => {
        const c = contentRect(el)
        const declared = el.matches('[data-elastic]') || !!el.querySelector('[data-elastic]')
        const tall = (m) => visible(m) && rect(m).height >= S.mediaLines * rowLine
        const elastic = declared || (isMedia(el) ? tall(el) : [...el.querySelectorAll(S.media)].some(tall))
        return { name: name(el), box: { top: r.top, bottom: r.bottom, height: r.height }, content: c, elastic, control: isControl(el) || (el.children.length === 1 && isControl(el.firstElementChild) && !el.textContent.replace(el.firstElementChild.textContent, '').trim()), line: rowLine }
      })
      if (cols.filter((c) => c.content).length < 2) continue
      const tallest = Math.max(...cols.map((c) => c.box.height))
      if (tallest > S.maxScreens * window.innerHeight) continue
      rows.push({ parent: name(parent), display: d, top: line[0].r.top, cols })
    }
  }

  /* ── c · les contrôles : boîte contre contenu ── */
  const controls = []
  for (const el of doc.body.querySelectorAll(S.controls)) {
    if (!visible(el)) continue
    const c = cs(el), r = rect(el), k = contentRect(el)
    if (!k) continue /* rien de mesurable dedans (un signe seul, un champ sans bord) : on ne juge pas ce qu'on ne lit pas */
    const inner = k.height
    const shell = parseFloat(c.paddingTop) + parseFloat(c.paddingBottom) + parseFloat(c.borderTopWidth) + parseFloat(c.borderBottomWidth)
    controls.push({ name: name(el), box: r.height, content: inner, shell, line: lineOf(el), stretched: r.height - (inner + shell) })
  }

  /* ── d · les filets : l'espace de chaque côté, mesuré au contenu des voisins ── */
  const separators = []
  const neighbour = (el, dir) => {
    let n = el
    while ((n = dir < 0 ? n.previousElementSibling : n.nextElementSibling)) if (visible(n)) return n
    return null
  }
  const seps = [...doc.body.querySelectorAll('*')].filter((el) => {
    if (!visible(el)) return false
    if (isSeparator(el)) return true
    const r = rect(el)
    return el.children.length === 0 && !el.textContent.trim() && r.height <= 2 && r.width >= 3 * lineOf(el) && !isMedia(el) && !isControl(el)
  })
  for (const el of seps) {
    const prev = neighbour(el, -1), next = neighbour(el, +1)
    if (!prev || !next) continue
    const a = contentRect(prev), b = contentRect(next)
    if (!a || !b) continue
    const r = rect(el)
    separators.push({ name: name(el), above: r.top - a.bottom, below: b.top - r.bottom, line: lineOf(prev) })
  }

  return { rows, controls, separators, rem: parseFloat(cs(doc.documentElement).fontSize) }
}

/* ── Le juge : des faits aux fautes. Tout ce qui est écrit ici se lit dans le rapport. ── */
export function judge(facts, S = SETTINGS) {
  const out = { close: [], balance: [], control: [], separator: [], counts: { rowsElastic: 0, rowsPlain: 0, controls: facts.controls.length, separators: facts.separators.length } }
  for (const row of facts.rows) {
    const cols = row.cols.filter((c) => c.content && !c.control)
    if (cols.length < 2) continue
    const line = Math.max(...cols.map((c) => c.line))
    const where = `${row.parent} › ${cols.map((c) => c.name).join(' · ')}`
    if (cols.some((c) => c.elastic)) {
      out.counts.rowsElastic++
      const bottoms = cols.map((c) => c.content.bottom)
      const spread = Math.max(...bottoms) - Math.min(...bottoms)
      if (spread > S.lines * line + 0.5) out.close.push({ where, spread, line, marginLines: (spread - (S.lines * line + 0.5)) / line, detail: cols.map((c) => `${c.name} ${c.elastic ? '(élastique) ' : ''}bas à ${Math.round(c.content.bottom)}`).join(' · ') })
    } else {
      const tallest = Math.max(...cols.map((c) => c.content.height))
      if (tallest < S.minLines * line) continue
      out.counts.rowsPlain++
      const heights = cols.map((c) => c.content.height).filter((h) => h > 0)
      const ratio = Math.max(...heights) / Math.min(...heights)
      if (ratio > S.ratio) out.balance.push({ where, ratio, marginLines: (Math.max(...heights) - Math.min(...heights) * S.ratio) / line, detail: cols.map((c) => `${c.name} ${Math.round(c.content.height)}`).join(' · ') })
    }
  }
  for (const c of facts.controls) {
    if (c.stretched > c.line * 0.5 && c.box > 2 * c.line) out.control.push({ where: c.name, box: c.box, content: c.content + c.shell, marginLines: (c.stretched - c.line * 0.5) / c.line, detail: `boîte ${Math.round(c.box)}, contenu ${Math.round(c.content + c.shell)}` })
  }
  for (const s of facts.separators) {
    if (Math.abs(s.above - s.below) > S.lines * s.line + 0.5) out.separator.push({ where: s.name, above: s.above, below: s.below, marginLines: (Math.abs(s.above - s.below) - (S.lines * s.line + 0.5)) / s.line, detail: `${Math.round(s.above)} au-dessus, ${Math.round(s.below)} au-dessous` })
  }
  return out
}

/* ── Le contraste, mesuré sur le rendu : chaque texte contre le fond qu'il a réellement ── */
export function inspectContrast() {
  const cs = (el) => getComputedStyle(el)
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[\s,\/]+/).map(parseFloat); return { r, g, b, a: Number.isFinite(a) ? a : 1 } }
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 })
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05) }
  const background = (el) => {
    let n = el
    while (n && n !== document.documentElement.parentNode) {
      const c = cs(n)
      if (c.backgroundImage !== 'none') return 'image'
      const bg = parse(c.backgroundColor)
      if (bg && bg.a > 0) return bg.a >= 1 ? bg : blend(bg, background(n.parentElement) || { r: 255, g: 255, b: 255, a: 1 })
      n = n.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }
  const faults = [], seen = new Set()
  let checked = 0, undecidable = 0
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let t
  while ((t = walker.nextNode())) {
    if (!t.textContent.trim()) continue
    const el = t.parentElement
    if (!el || /^(script|style|noscript|template)$/i.test(el.tagName)) continue
    if (el.closest('[aria-hidden="true"]')) continue /* un signe décoratif, caché aux lecteurs d'écran, n'est pas un texte lu */
    const c = cs(el)
    if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) === 0) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (seen.has(el)) continue
    seen.add(el)
    const bg = background(el)
    if (bg === 'image') { undecidable++; continue }
    let fg = parse(c.color)
    if (!fg) continue
    if (fg.a < 1) fg = blend(fg, bg)
    const size = parseFloat(c.fontSize), weight = parseInt(c.fontWeight, 10) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    const got = ratio(fg, bg)
    checked++
    if (got < need) {
      let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; else if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.')
      faults.push({ where: s, ratio: Math.round(got * 100) / 100, need, text: t.textContent.trim().slice(0, 40) })
    }
  }
  return { checked, undecidable, faults }
}

/* ── « Pas de nombre », au rendu : chaque espace, taille et rayon calculé est une valeur que le
   moteur peut produire à cette largeur — ou une valeur tolérée (0, 1, 2 px). ── */
export function inspectNumbers({ spaces, sizes, radii, tolerated, tol }) {
  const cs = (el) => getComputedStyle(el)
  const near = (v, set) => set.some((x) => Math.abs(x - v) <= tol)
  const faults = [], counts = { checked: 0, off: 0 }
  const props = { space: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap', 'marginTop', 'marginBottom'], radius: ['borderTopLeftRadius'], size: ['fontSize'] }
  for (const el of document.body.querySelectorAll('*')) {
    const c = cs(el)
    if (c.display === 'none' || c.visibility === 'hidden') continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (el.closest('[data-intent="statement"]')) continue
    let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; else if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.')
    for (const p of props.space) { const v = parseFloat(c[p]); if (!Number.isFinite(v)) continue; counts.checked++; if (!near(v, spaces) && !near(v, tolerated)) { counts.off++; if (faults.length < 400) faults.push(`${s} ${p} ${Math.round(v * 10) / 10}`) } }
    if (el.children.length === 0 && el.textContent.trim()) for (const p of props.size) { const v = parseFloat(c[p]); counts.checked++; if (!near(v, sizes)) { counts.off++; if (faults.length < 400) faults.push(`${s} ${p} ${Math.round(v * 10) / 10}`) } }
    for (const p of props.radius) { const v = parseFloat(c[p]); if (!Number.isFinite(v) || v === 0) continue; counts.checked++; if (!near(v, radii) && !near(v, tolerated) && v < 999) { counts.off++; if (faults.length < 400) faults.push(`${s} rayon ${Math.round(v * 10) / 10}`) } }
  }
  return { ...counts, faults: [...new Set(faults)] }
}
