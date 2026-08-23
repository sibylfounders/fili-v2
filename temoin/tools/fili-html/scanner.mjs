/* Contrôleur de la seconde cible : HTML/CSS sans framework.
   Ce n'est PAS un portage de l'outil ESLint — c'est un scanner dédié, écrit
   pour cette cible. Ce qui doit se porter, c'est la doctrine, pas le code.

   Limite déclarée : ce scanner ne construit pas d'arbre DOM. Il travaille sur
   des fichiers non imbriqués, ce qui suffit à l'épreuve et n'irait pas au-delà. */
import fs from 'node:fs'
import path from 'node:path'

const INTERACTIFS = ['button', 'a', 'input', 'select', 'textarea', 'form', 'label', 'dialog', 'details', 'summary', 'option', 'fieldset']

const attributs = (brut) => {
  const out = {}
  for (const m of brut.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

export function scanner(racine, fichierHtml, fichierCss, registre) {
  const html = fs.readFileSync(path.join(racine, fichierHtml), 'utf8')
  const css = fichierCss ? fs.readFileSync(path.join(racine, fichierCss), 'utf8') : ''
  const classes = new Set(registre.html.classesSysteme)
  const seuil = registre.rythme.seuilAlternance
  const fautes = []

  /* ── R1.1 · un élément interactif porte une classe du système déclaré ── */
  for (const m of html.matchAll(/<([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const balise = m[1].toLowerCase()
    if (!INTERACTIFS.includes(balise)) continue
    const a = attributs(m[2])
    const portees = (a.class || '').split(/\s+/).filter(Boolean)
    if (a['data-intent'] === 'statement' && (a['data-intent-reason'] || '').trim()) continue
    if (!portees.some((c) => classes.has(c)))
      fautes.push({ regle: 'R1.1', quoi: `<${balise}> sans classe du système` })
  }

  /* ── R2.5 · un bloc d'état déclaré n'est pas vide ── */
  for (const m of html.matchAll(/<([a-zA-Z][\w-]*)([^>]*\bdata-etat="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g)) {
    const etat = m[3]
    const dedans = m[4].replace(/<[^>]*>/g, '').trim()
    if (!dedans) fautes.push({ regle: 'R2.5', quoi: `bloc d'état « ${etat} » vide` })
  }

  /* ── R3.2 · aucune marge dans la feuille applicative ── */
  for (const m of css.matchAll(/(^|[;{\s])(margin(?:-top|-right|-bottom|-left)?)\s*:/g))
    fautes.push({ regle: 'R3.2', quoi: `« ${m[2]} » dans la feuille applicative` })

  /* ── R4.3 · pas plus de N sections consécutives de même densité ── */
  const suite = [...html.matchAll(/data-density="([^"]+)"/g)].map((m) => m[1])
  let serie = 1
  for (let i = 1; i < suite.length; i++) {
    if (suite[i] !== suite[i - 1]) { serie = 1; continue }
    serie++
    if (serie > seuil) fautes.push({ regle: 'R4.3', quoi: `${serie} sections « ${suite[i]} » à la suite` })
  }

  return fautes
}
