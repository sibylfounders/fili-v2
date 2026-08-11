/* Les fichiers de fonte, posés à côté des témoins.
 *
 * Un témoin porte sa feuille de style à l'intérieur de lui — c'est ce qui fait
 * qu'il s'ouvre sans serveur, des années après. Mais une feuille de style ne
 * peut pas porter un fichier de fonte : elle ne peut que le désigner. Tant que
 * personne ne déposait ces fichiers sous « temoins/ », chaque témoin désignait
 * un dossier qui n'existait pas, et le navigateur retombait en silence sur la
 * fonte système. Aucune erreur, aucun écart : un témoin qui montrait autre
 * chose que le produit.
 *
 * Les fichiers sont donc déposés une fois, à la racine des témoins, et chaque
 * témoin les désigne par son propre chemin de retour. Une lignée déplacée sans
 * ce dossier reperd sa fonte : c'est le prix arrêté, contre celui de recoudre
 * 380 Ko de fonte dans chacun des fichiers, à chaque génération.
 */
import { readFileSync, mkdirSync, readdirSync, copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const TEMOINS = path.join(RACINE, 'temoins')

/* Les trois voix de la charte. La liste est ici et non déduite du dossier des
   paquets : ce qui est embarqué doit être déclaré, jamais ramassé. */
const PAQUETS = ['geist', 'jetbrains-mono', 'inter']

const paquet = (nom) => path.join(RACINE, 'node_modules', '@fontsource-variable', nom)

/** Dépose les fichiers de fonte sous « temoins/files/ ». Renvoie leur nombre. */
export function deposerPolices() {
  const cible = path.join(TEMOINS, 'files')
  mkdirSync(cible, { recursive: true })
  let n = 0
  for (const nom of PAQUETS) {
    const source = path.join(paquet(nom), 'files')
    const feuille = readFileSync(path.join(paquet(nom), 'index.css'), 'utf8')
    const designes = new Set(
      [...feuille.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map((m) => m[1]))
    if (!existsSync(source)) {
      throw new Error(`fonte « ${nom} » absente du dépôt — lancez npm install avant de rendre un témoin`)
    }
    /* Seuls les fichiers que la feuille du paquet désigne vraiment sont
       déposés. Le dossier du paquet en contient trois fois plus — les italiques
       notamment, qu'aucune déclaration n'appelle. Copier le dossier entier
       poserait 2,8 Mo de fonte que personne ne lit, à côté de chaque lignée. */
    for (const f of readdirSync(source)) {
      if (!f.endsWith('.woff2')) continue
      if (!designes.has(f)) continue
      copyFileSync(path.join(source, f), path.join(cible, f))
      n++
    }
  }
  return n
}

/** Le chemin de retour vers « temoins/files/ » depuis un fichier posé sous « temoins/ ». */
export function remontee(fichier) {
  const rel = path.relative(TEMOINS, path.dirname(path.resolve(fichier)))
  const profondeur = rel === '' ? 0 : rel.split(path.sep).length
  return '../'.repeat(profondeur) + 'files/'
}

/* Les déclarations @font-face telles que les paquets les écrivent, avec les
   chemins ramenés à la position du fichier qui les accueille. Pour les pages
   qui composent leur style à la main — la planche, le catalogue — et qui ne
   passent pas par la chaîne Tailwind. */
export function blocPolices(prefixe) {
  return PAQUETS
    .map((nom) => readFileSync(path.join(paquet(nom), 'index.css'), 'utf8'))
    .join('\n')
    .replace(/url\(\.\/files\//g, `url(${prefixe}`)
}

/* Une feuille produite par Tailwind désigne « files/… » relativement à sa
   propre position, temoins/. Ramenée dans un témoin, elle doit désigner le
   même dossier depuis la profondeur de ce témoin. */
export function ramenerChemins(style, fichier) {
  return style.replace(/url\(files\//g, `url(${remontee(fichier)}`)
}
