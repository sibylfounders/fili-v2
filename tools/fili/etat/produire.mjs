/* Produit l'état que Fili affiche, depuis le Gardien lui-même.
   Fili ne fabrique aucun chiffre : il montre ce que le Gardien a mesuré. Si
   le contrôle d'intégrité refuse de statuer, l'état produit porte ce refus —
   il ne le remplace pas par un zéro. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { executerBatterie, RACINE } from '../crash-test/battery.mjs'
import { verifierIntegrite } from '../crash-test/integrite.mjs'
import { produire as produireCarte } from '../carte/produire.mjs'
import { produire as produireJournal } from '../journal/lire.mjs'

const SORTIE = path.join(RACINE, 'public/etat.json')
/* La date du jour est passée par argument ou lue à l'exécution : un état
   produit deux fois le même jour doit être identique, sinon le témoin de É7
   montrerait un écart qui n'est que l'heure. */
const DATE_JOUR = process.argv.includes('--date')
  ? process.argv[process.argv.indexOf('--date') + 1]
  : new Date().toISOString().slice(0, 10)

const integrite = await verifierIntegrite(RACINE)

let etat
if (integrite.manques.length > 0) {
  const raison = integrite.manques.join(' · ')
  etat = Object.fromEntries(
    ['/integrite', '/batterie', '/progression', '/constats', '/runs', '/temoins', '/faceAFace', '/verdicts', '/carte', '/journal', '/brouillons', '/acte'].map((c) => [
      c, { donnees: null, chargement: false, erreur: raison }
    ])
  )
} else {
  const r = await executerBatterie()
  const piegees = r.filter((x) => x.attendu === 'BLOQUE')
  const conformes = r.filter((x) => x.attendu === 'PASSE')
  const ecarts = r.filter((x) => !x.conforme)
  /* Le compte des mutations ne se déduit pas du manifeste : il se mesure en
     jouant les sabotages. Tant qu'un run de mutation n'a pas été versé, Fili
     dit qu'il ne l'a pas mesuré — il ne montre pas un nombre qu'il a inventé.
     C'est la leçon de #020 : un dispositif qui surestime ses propres garanties
     est le pire des dispositifs. */
  const cheminMut = path.join(RACINE, 'public/mutations.json')
  const mutations = fs.existsSync(cheminMut)
    ? JSON.parse(fs.readFileSync(cheminMut, 'utf8'))
    : null

  /* Les constats : une ligne par écart, l'assertion et son contrat d'abord. */
  const constats = ecarts.map((x) => ({
    id: x.id,
    assertion: x.id,
    contrat: x.quoi,
    occurrences: 1,
    fichiers: 1
  }))

  etat = {
    '/integrite': { donnees: { total: integrite.total, portees: integrite.total }, chargement: false, erreur: null },
    '/batterie': { donnees: { piegees: piegees.length, conformes: conformes.length, mutations, ecarts: ecarts.length }, chargement: false, erreur: null },
    '/progression': { donnees: { faites: r.length, total: r.length }, chargement: false, erreur: null },
    '/constats': { donnees: constats, chargement: false, erreur: null },
    '/runs': { donnees: [], chargement: false, erreur: null }
  }
}

/* ── La famille des témoins, lue sur le disque et non déclarée ───────────── */
/* Fili ne tient pas une liste de ses témoins : il regarde ce que la chaîne de
   rendu a réellement produit. Une famille déclarée à la main dériverait du
   dossier sans que rien ne le dise, et É3 montrerait une génération qui
   n'existe plus. */
const NOMS = {
  'e1-verdict': 'É1 · Le verdict',
  'e2-constat': 'É2 · Le constat',
  'e3-famille': 'É3 · La famille des témoins',
  'e4-face-a-face': 'É4 · Le face-à-face'
}
const DOSSIER = path.join(RACINE, 'temoins')
const MIROIR = path.join(RACINE, 'public/temoins')

const dossiers = (p) =>
  fs.existsSync(p)
    ? fs.readdirSync(p, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
        .map((e) => e.name)
    : []

const familles = dossiers(DOSSIER)
  .filter((cle) => cle !== 'planche')
  .sort()
  .map((cle) => {
    const generations = dossiers(path.join(DOSSIER, cle))
      .sort()
      .reverse()
      .map((date) => {
        const fichiers = fs.readdirSync(path.join(DOSSIER, cle, date)).filter((f) => f.endsWith('.html'))
        return { date, etats: fichiers.length, illisible: fichiers.length === 0 }
      })
    const courant = generations[0] ?? null
    return {
      gabarit: cle,
      nom: NOMS[cle] ?? cle,
      courant,
      /* L'aperçu pointe l'état NOMINAL : c'est celui qui porte le parti visuel.
         S'il n'a pas été rendu, on ne montre rien plutôt que n'importe lequel. */
      apercu:
        courant && fs.existsSync(path.join(DOSSIER, cle, courant.date, 'nominal.html'))
          ? `./temoins/${cle}/${courant.date}/nominal.html`
          : null,
      historique: generations.slice(1)
    }
  })

/* Le face-à-face s'ouvre sur le premier gabarit qui a de quoi être jugé. Le
   choix du gabarit appartiendra au routage, quand les sept existeront. */
const jugeable = familles.find((f) => f.apercu !== null) ?? null
const faceAFace = jugeable === null ? null : {
  gabarit: jugeable.gabarit,
  nom: jugeable.nom,
  courant: {
    date: jugeable.courant.date,
    source: jugeable.apercu,
    etats: jugeable.courant.etats
  },
  precedent: jugeable.historique[0]
    ? {
        date: jugeable.historique[0].date,
        source: `./temoins/${jugeable.gabarit}/${jugeable.historique[0].date}/nominal.html`,
        etats: jugeable.historique[0].etats
      }
    : null,
  batterie: integrite.manques.length === 0 ? 'intégrité entière au rendu' : 'REFUS DE STATUER'
}

/* Le miroir servi. Les témoins vivent dans temoins/ ; le serveur ne sert que
   public/. La copie est un artefact de service — elle n'est pas versionnée, et
   elle se refait à chaque production d'état. Deux lignées de témoins seraient
   une lignée de trop. */
/* Le miroir se recouvre fichier par fichier, il ne se vide pas et il ne
   remplace rien en bloc. Purger d'abord reviendrait à supprimer des témoins
   pour les réécrire — un geste destructeur sur ce qui sert de référence, pour
   un gain nul : une génération ne disparaît jamais du dossier source, elle
   s'y ajoute. Une écriture qui tronque suffit, et elle ne peut pas laisser le
   miroir dans un état intermédiaire où un témoin aurait disparu. */
const recopier = (de, vers) => {
  fs.mkdirSync(vers, { recursive: true })
  for (const e of fs.readdirSync(de, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue
    const source = path.join(de, e.name)
    const cible = path.join(vers, e.name)
    if (e.isDirectory()) recopier(source, cible)
    else fs.writeFileSync(cible, fs.readFileSync(source))
  }
}
if (fs.existsSync(DOSSIER)) recopier(DOSSIER, MIROIR)

/* Si le juge n'est pas entier, les témoins ne se montrent pas davantage que
   le verdict : l'état produit porte le refus jusqu'au bout. Montrer une
   famille lisible sous un refus de statuer laisserait croire qu'on peut juger
   pendant que le juge est amputé. */
if (integrite.manques.length === 0) {
  etat['/temoins'] = { donnees: familles, chargement: false, erreur: null }
  etat['/faceAFace'] = { donnees: faceAFace, chargement: false, erreur: null }
  /* Aucun verdict n'a encore été déposé, et Fili ne l'invente pas. */
  etat['/verdicts'] = { donnees: [], chargement: false, erreur: null }

  /* La carte et le journal viennent de leurs documents, par un lecteur qui
     REFUSE DE STATUER plutôt que de deviner. Un analyseur tolérant montrerait
     une carte vide au premier titre reformulé, et personne ne saurait que
     l'écran ment. L'erreur remonte donc telle quelle jusqu'à l'écran. */
  const carte = produireCarte()
  etat['/carte'] = carte.erreur
    ? { donnees: null, chargement: false, erreur: carte.erreur }
    : { donnees: carte.donnees, chargement: false, erreur: null }

  const journal = produireJournal()
  etat['/journal'] = journal.erreur
    ? { donnees: null, chargement: false, erreur: journal.erreur }
    : { donnees: journal.donnees, chargement: false, erreur: null }

  /* É7 déposera ses brouillons ici. Aucun n'existe, et Fili ne l'invente pas. */
  etat['/brouillons'] = { donnees: [], chargement: false, erreur: null }

  /* ── L'acte : ce que É7 a besoin de savoir pour composer une entrée ────── */
  /* Le numéro se CALCULE depuis le journal. Le saisir à la main est la façon
     la plus simple d'écrire deux fois le même, et un journal à numéros
     dupliqués ne se relit plus. */
  const dernier = journal.erreur ? null : journal.donnees[0]
  const numero = dernier
    ? `#${String(Number(dernier.numero.slice(1)) + 1).padStart(3, '0')}`
    : null

  /* Le garde-fou de K2 §10.3, rendu mécanique : le passage au 🟢 est refusé
     tant que la batterie et le contrôle d'intégrité ne sont pas au vert. Un
     verrou ne se déclare pas, il se mérite — et c'est l'état lu en P1 qui le
     dit, pas une case à cocher. */
  const ecarts = etat['/batterie'].donnees?.ecarts ?? null
  const verrouVert = integrite.manques.length === 0 && ecarts === 0
  const motifVerrou = verrouVert
    ? null
    : integrite.manques.length > 0
      ? `le contrôle d'intégrité refuse de statuer : ${integrite.manques.join(' · ')}`
      : `la batterie porte ${String(ecarts ?? 0)} écart(s)`

  /* Les cibles déplaçables sont les lignes de la carte, telles qu'elle les
     déclare. On ne déplace pas le statut d'une ligne qui n'existe pas. */
  const SECTIONS = [
    ['jalons', 'Les jalons'], ['contrats', 'Les contrats'], ['gabarits', 'Les gabarits'],
    ['instrument', "L'instrument"], ['dettes', 'Les dettes'],
  ]
  const cibles = carte.erreur ? [] : SECTIONS.flatMap(([cle, groupe]) =>
    (carte.donnees[cle] ?? []).map((l) => ({
      id: `${cle}/${l.nom}`, groupe, nom: l.nom, statut: l.statut,
    })))

  etat['/acte'] = (numero === null || carte.erreur)
    ? { donnees: null, chargement: false, erreur: "la composition est impossible : le journal ou la carte est illisible, et un numéro déduit d'une lecture partielle serait un faux" }
    : { donnees: { numero, date: DATE_JOUR, verrouVert, motifVerrou, cibles }, chargement: false, erreur: null }

}

fs.mkdirSync(path.dirname(SORTIE), { recursive: true })
fs.writeFileSync(SORTIE, JSON.stringify(etat, null, 2))
console.log('état produit →', path.relative(RACINE, SORTIE))
console.log('  intégrité :', integrite.manques.length === 0 ? `${integrite.total}/${integrite.total}` : 'REFUS DE STATUER')
