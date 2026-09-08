/* Contrôleur de la seconde cible : HTML/CSS sans framework.
   Ce n'est PAS un portage de l'outil ESLint — c'est un scanner dédié, écrit
   pour cette cible. Ce qui doit se porter, c'est la doctrine, pas le code.

   Limite déclarée : ce scanner ne construit pas d'arbre DOM. Il travaille sur
   des fichiers non imbriqués, ce qui suffit à l'épreuve et n'irait pas au-delà. */
import fs from 'node:fs'
import path from 'node:path'

const INTERACTIVE = ['button', 'a', 'input', 'select', 'textarea', 'form', 'label', 'dialog', 'details', 'summary', 'option', 'fieldset']

const attributes = (raw) => {
  const out = {}
  for (const m of raw.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

export function scanner(root, fileHtml, fileCss, registry) {
  const html = fs.readFileSync(path.join(root, fileHtml), 'utf8')
  const css = fileCss ? fs.readFileSync(path.join(root, fileCss), 'utf8') : ''
  const classes = new Set(registry.html.classesSystem)
  const threshold = registry.rhythm.thresholdAlternation
  const faults = []

  /* ── R1.1 · un élément interactif porte une classe du système déclaré ── */
  for (const m of html.matchAll(/<([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const tag = m[1].toLowerCase()
    if (!INTERACTIVE.includes(tag)) continue
    const a = attributes(m[2])
    const reaches = (a.class || '').split(/\s+/).filter(Boolean)
    if (a['data-intent'] === 'statement' && (a['data-intent-reason'] || '').trim()) continue
    if (!reaches.some((c) => classes.has(c)))
      faults.push({ rule: 'R1.1', what: `<${tag}> sans classe du système` })
  }

  /* ── R2.5 · un bloc d'état déclaré n'est pas vide ── */
  for (const m of html.matchAll(/<([a-zA-Z][\w-]*)([^>]*\bdata-state="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g)) {
    const state = m[3]
    const inside = m[4].replace(/<[^>]*>/g, '').trim()
    if (!inside) faults.push({ rule: 'R2.5', what: `bloc d'état « ${state} » vide` })
  }

  /* ── R3.2 · aucune marge dans la feuille applicative ── */
  for (const m of css.matchAll(/(^|[;{\s])(margin(?:-top|-right|-bottom|-left)?)\s*:/g))
    faults.push({ rule: 'R3.2', what: `« ${m[2]} » dans la feuille applicative` })

  /* ── R4.3 · pas plus de N sections consécutives de même densité ── */
  const next = [...html.matchAll(/data-density="([^"]+)"/g)].map((m) => m[1])
  let series = 1
  for (let i = 1; i < next.length; i++) {
    if (next[i] !== next[i - 1]) { series = 1; continue }
    series++
    if (series > threshold) faults.push({ rule: 'R4.3', what: `${series} sections « ${next[i]} » à la suite` })
  }

  return faults
}
