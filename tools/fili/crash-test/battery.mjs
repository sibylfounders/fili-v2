import { ESLint } from 'eslint'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))

/** Verdict attendu de chaque fixture. C'est ce qui rend la batterie falsifiable. */
export const FIXTURES = [
  { id: 'KO-1',  fichier: 'crash-tests/piegees/KO-1-bouton-natif.tsx',        attendu: 'BLOQUE', quoi: '<button> natif dans un écran' },
  { id: 'KO-2',  fichier: 'crash-tests/piegees/KO-2-lien-natif.tsx',          attendu: 'BLOQUE', quoi: '<a href> de navigation' },
  { id: 'KO-3',  fichier: 'crash-tests/piegees/KO-3-champ-natif.tsx',         attendu: 'BLOQUE', quoi: '<input> de recherche natif' },
  { id: 'KO-3b', fichier: 'crash-tests/piegees/KO-3b-label-natif.tsx',        attendu: 'BLOQUE', quoi: '<label> natif' },
  { id: 'KO-4',  fichier: 'crash-tests/piegees/KO-4-div-cliquable.tsx',         attendu: 'BLOQUE', quoi: '<div onClick> en carte cliquable' },
  { id: 'KO-5',  fichier: 'crash-tests/piegees/KO-5-span-role-button.tsx',       attendu: 'BLOQUE', quoi: '<span role="button" tabIndex>' },
  { id: 'KO-6',  fichier: 'crash-tests/piegees/KO-6-li-clavier.tsx',             attendu: 'BLOQUE', quoi: '<li onKeyDown> activable' },
  { id: 'KO-7',  fichier: 'crash-tests/piegees/KO-7-source-non-declaree.tsx',    attendu: 'BLOQUE', quoi: 'composant venu d\'un paquet non déclaré' },
  { id: 'KO-7b', fichier: 'crash-tests/piegees/KO-7b-nom-registre-source-etrangere.tsx', attendu: 'BLOQUE', quoi: 'nom du registre importé d\'ailleurs' },
  { id: 'KO-8',  fichier: 'crash-tests/piegees/KO-8-redefinition-locale.tsx',    attendu: 'BLOQUE', quoi: 'Button redéfini localement' },
  { id: 'KO-9',  fichier: 'crash-tests/piegees/KO-9-inner-html.tsx',             attendu: 'BLOQUE', quoi: 'dangerouslySetInnerHTML' },
  { id: 'KO-10', fichier: 'crash-tests/piegees/KO-10-create-element.tsx',        attendu: 'BLOQUE', quoi: "createElement('button')" },
  { id: 'KO-11', fichier: 'crash-tests/piegees/KO-11-rupture-ne-leve-pas-a11y.tsx', attendu: 'BLOQUE', quoi: 'rupture invoquée contre l\'accessibilité' },
  { id: 'KO-12', fichier: 'crash-tests/piegees/KO-12-rupture-sans-motif.tsx', attendu: 'BLOQUE', quoi: 'rupture déclarée sans motif' },
  { id: 'OK-1',  fichier: 'crash-tests/conformes/OK-1-ecran-conforme.tsx',    attendu: 'PASSE', quoi: 'écran composé du registre' },
  { id: 'OK-2',  fichier: 'crash-tests/conformes/OK-2-composition-locale.tsx',  attendu: 'PASSE', quoi: 'composition locale du registre' },
  { id: 'OK-4',  fichier: 'crash-tests/conformes/OK-4-div-presentational.tsx',attendu: 'PASSE', quoi: '<div> purement présentationnel' },
  { id: 'OK-5',  fichier: 'crash-tests/conformes/OK-5-rupture-declaree.tsx',  attendu: 'PASSE', quoi: 'rupture déclarée avec motif' },
  { id: 'OK-3',  fichier: 'crash-tests/design-system/Toggle.tsx',                   attendu: 'PASSE', quoi: '<button> natif en zone système' },
  { id: 'OK-6',  fichier: 'crash-tests/hors-perimetre/exemple.test.tsx',      attendu: 'PASSE', quoi: 'fichier de test, hors périmètre' },

  /* ── S2 · Contrat d'État ── */
  { id: 'KO-S2-1', fichier: 'crash-tests/piegees/KO-S2-1-sans-conteneur.tsx',        attendu: 'BLOQUE', sujet: 'S2', quoi: 'donnée distante rendue sans conteneur' },
  { id: 'KO-S2-2', fichier: 'crash-tests/piegees/KO-S2-2-slot-manquant.tsx',         attendu: 'BLOQUE', sujet: 'S2', quoi: "slot « erreur » absent" },
  { id: 'KO-S2-3', fichier: 'crash-tests/piegees/KO-S2-3-slot-null.tsx',             attendu: 'BLOQUE', sujet: 'S2', quoi: 'slot erreur={null}' },
  { id: 'KO-S2-4', fichier: 'crash-tests/piegees/KO-S2-4-slot-fragment-vide.tsx',    attendu: 'BLOQUE', sujet: 'S2', quoi: 'slot vide={<></>}' },
  { id: 'KO-S2-5', fichier: 'crash-tests/piegees/KO-S2-5-drapeau-hors-conteneur.tsx',attendu: 'BLOQUE', sujet: 'S2', quoi: 'if (chargement) return … dans un écran' },
  { id: 'KO-S2-6', fichier: 'crash-tests/piegees/KO-S2-6-mutation-sans-attente.tsx', attendu: 'BLOQUE', sujet: 'S2', quoi: "mutation sans état d'attente" },
  { id: 'KO-S2-7', fichier: 'crash-tests/piegees/KO-S2-7-mutation-non-rendue.tsx',   attendu: 'BLOQUE', sujet: 'S2', quoi: 'attente et issue jamais rendues' },
  { id: 'KO-S2-8', fichier: 'crash-tests/piegees/KO-S2-8-rupture-sur-chargement.tsx',attendu: 'BLOQUE', sujet: 'S2', quoi: 'rupture portée sur le chargement' },
  { id: 'KO-S2-9', fichier: 'crash-tests/piegees/KO-S2-9-rupture-sans-motif.tsx',    attendu: 'BLOQUE', sujet: 'S2', quoi: 'rupture sur « vide » sans motif' },
  { id: 'OK-S2-1', fichier: 'crash-tests/conformes/OK-S2-1-ecran-nominal.tsx',       attendu: 'PASSE', sujet: 'S2', quoi: 'écran nominal, quatre slots pleins' },
  { id: 'OK-S2-2', fichier: 'crash-tests/conformes/OK-S2-2-rupture-vide-avec-motif.tsx', attendu: 'PASSE', sujet: 'S2', quoi: 'rupture sur « vide » avec motif' },
  { id: 'OK-S2-3', fichier: 'crash-tests/conformes/OK-S2-3-mutation-complete.tsx',   attendu: 'PASSE', sujet: 'S2', quoi: 'mutation avec attente et issue rendues' },
  { id: 'OK-S2-4', fichier: 'crash-tests/design-system/EtatAsync.tsx',                              attendu: 'PASSE', sujet: 'S2', quoi: 'le conteneur lui-même, en zone système' },
  { id: 'OK-S2-5', fichier: 'crash-tests/conformes/OK-4-div-presentational.tsx',     attendu: 'PASSE', sujet: 'S2', quoi: 'composant sans source asynchrone' },
  { id: 'KO-S2-10', fichier: 'crash-tests/pages/KO-S2-10-titre-en-dur-pendant-le-chargement.tsx', attendu: 'BLOQUE', sujet: 'S2', quoi: "titre et phrase écrits pendant que la section attend" },
  { id: 'KO-S2-11', fichier: 'crash-tests/pages/KO-S2-11-chargement-qui-parle.tsx',              attendu: 'BLOQUE', sujet: 'S2', quoi: 'une pastille écrite dans le chargement' },
  { id: 'OK-S2-6',  fichier: 'crash-tests/pages/OK-S2-6-squelette-entier.tsx',                   attendu: 'PASSE',  sujet: 'S2', quoi: "la section qui attend attend en entier" },

  /* ── S3 · Discipline Spatiale ── */
  { id: 'KO-S3-1',  fichier: 'crash-tests/piegees/KO-S3-1-valeur-arbitraire.tsx',  attendu: 'BLOQUE', sujet: 'S3', quoi: 'p-[13px]' },
  { id: 'KO-S3-2',  fichier: 'crash-tests/piegees/KO-S3-2-gap-arbitraire.tsx',     attendu: 'BLOQUE', sujet: 'S3', quoi: 'gap-[7px]' },
  { id: 'KO-S3-2b', fichier: 'crash-tests/piegees/KO-S3-2b-pas-hors-echelle.tsx',  attendu: 'BLOQUE', sujet: 'S3', quoi: "px-inline-moyen, cran absent de l'Échelle" },
  { id: 'KO-S3-3',  fichier: 'crash-tests/piegees/KO-S3-3-marge-enfant.tsx',       attendu: 'BLOQUE', sujet: 'S3', quoi: 'mt-block-carte sur un enfant' },
  { id: 'KO-S3-4',  fichier: 'crash-tests/piegees/KO-S3-4-marge-section.tsx',      attendu: 'BLOQUE', sujet: 'S3', quoi: 'mb-block-page sur une section' },
  { id: 'KO-S3-5',  fichier: 'crash-tests/piegees/KO-S3-5-marge-negative.tsx',     attendu: 'BLOQUE', sujet: 'S3', quoi: '-mt-block-coque de compensation' },
  { id: 'KO-S3-6',  fichier: 'crash-tests/piegees/KO-S3-6-style-inline.tsx',       attendu: 'BLOQUE', sujet: 'S3', quoi: 'style={{ marginTop }}' },
  { id: 'KO-S3-7',  fichier: 'crash-tests/piegees/KO-S3-7-largeur-magique.tsx',    attendu: 'BLOQUE', sujet: 'S3', quoi: 'w-[327px]' },
  { id: 'KO-S3-8',  fichier: 'crash-tests/piegees/KO-S3-8-position-magique.tsx',   attendu: 'BLOQUE', sujet: 'S3', quoi: 'top-[13px]' },
  { id: 'KO-S3-9',  fichier: 'crash-tests/piegees/KO-S3-9-classe-construite.tsx',  attendu: 'BLOQUE', sujet: 'S3', quoi: 'classe p-${…} construite' },
  { id: 'KO-S3-10', fichier: 'crash-tests/piegees/KO-S3-10-rupture-sur-marge.tsx', attendu: 'BLOQUE', sujet: 'S3', quoi: 'rupture invoquée sur une marge' },
  { id: 'KO-S3-11', fichier: 'crash-tests/piegees/KO-S3-11-rupture-sans-motif.tsx',attendu: 'BLOQUE', sujet: 'S3', quoi: 'rupture sans motif' },
  { id: 'OK-S3-1', fichier: 'crash-tests/conformes/OK-S3-1-conteneur-distribue.tsx', attendu: 'PASSE', sujet: 'S3', quoi: "écart de rang « large » porté par le parent" },
  { id: 'OK-S3-2', fichier: 'crash-tests/conformes/OK-S3-2-pas-de-l-echelle.tsx',    attendu: 'PASSE', sujet: 'S3', quoi: "px-inline-page, un cran de l'Échelle" },
  { id: 'OK-S3-3', fichier: 'crash-tests/conformes/OK-S3-3-centrage.tsx',            attendu: 'PASSE', sujet: 'S3', quoi: 'mx-auto, exception déclarée' },
  { id: 'OK-S3-4', fichier: 'crash-tests/conformes/OK-S3-4-rupture-avec-motif.tsx',  attendu: 'PASSE', sujet: 'S3', quoi: 'w-[420px] avec motif' },
  { id: 'OK-S3-5', fichier: 'crash-tests/design-system/EncartSysteme.tsx',                 attendu: 'PASSE', sujet: 'S3', quoi: 'marge et valeur libre en zone système' },
  { id: 'KO-S3-12', fichier: 'crash-tests/piegees/KO-S3-12-proximite-prop.tsx',  attendu: 'BLOQUE', sujet: 'S3', quoi: 'deux groupes emboîtés au même rang, par la prop' },
  { id: 'KO-S3-13', fichier: 'crash-tests/piegees/KO-S3-13-proximite-classe.tsx',attendu: 'BLOQUE', sujet: 'S3', quoi: 'deux groupes emboîtés au même rang, par la classe' },
  { id: 'OK-S3-6', fichier: 'crash-tests/pages/Temoin.tsx',                                    attendu: 'PASSE', sujet: 'S3', quoi: "l'Écran Témoin lui-même" },
  { id: 'OK-S3-7', fichier: 'crash-tests/conformes/OK-S3-7-proximite-tenue.tsx',     attendu: 'PASSE', sujet: 'S3', quoi: 'groupes au rang large, intérieur au rang détail' },

  /* ── S4 · Rythme de Composition ── */
  { id: 'KO-S4-1',  fichier: 'crash-tests/pages/KO-S4-1-div-au-premier-niveau.tsx', attendu: 'BLOQUE', sujet: 'S4', quoi: 'bloc anonyme au premier niveau' },
  { id: 'KO-S4-2',  fichier: 'crash-tests/pages/KO-S4-2-densite-absente.tsx',       attendu: 'BLOQUE', sujet: 'S4', quoi: 'section sans densité' },
  { id: 'KO-S4-2b', fichier: 'crash-tests/pages/KO-S4-2b-densite-inconnue.tsx',     attendu: 'BLOQUE', sujet: 'S4', quoi: 'densité hors échelle' },
  { id: 'KO-S4-3',  fichier: 'crash-tests/pages/KO-S4-3-monotonie.tsx',             attendu: 'BLOQUE', sujet: 'S4', quoi: 'trois sections identiques à la suite' },
  { id: 'KO-S4-4',  fichier: 'crash-tests/pages/KO-S4-4-deux-titres-1.tsx',         attendu: 'BLOQUE', sujet: 'S4', quoi: 'deux titres de niveau 1' },
  { id: 'KO-S4-5',  fichier: 'crash-tests/pages/KO-S4-5-saut-de-niveau.tsx',        attendu: 'BLOQUE', sujet: 'S4', quoi: 'saut de niveau 1 → 3' },
  { id: 'KO-S4-6',  fichier: 'crash-tests/pages/KO-S4-6-taille-surchargee.tsx',     attendu: 'BLOQUE', sujet: 'S4', quoi: 'titre agrandi à la main' },
  { id: 'KO-S4-7',  fichier: 'crash-tests/pages/KO-S4-7-rupture-sur-titre.tsx',     attendu: 'BLOQUE', sujet: 'S4', quoi: 'rupture invoquée sur la hiérarchie' },
  { id: 'OK-S4-1', fichier: 'crash-tests/pages/OK-S4-1-page-conforme.tsx',      attendu: 'PASSE', sujet: 'S4', quoi: 'page aux densités alternées' },
  { id: 'OK-S4-2', fichier: 'crash-tests/pages/OK-S4-2-monotonie-declaree.tsx', attendu: 'PASSE', sujet: 'S4', quoi: 'monotonie déclarée avec motif' },
  { id: 'OK-S4-3', fichier: 'crash-tests/pages/OK-S4-3-contraste-declare.tsx',  attendu: 'PASSE', sujet: 'S4', quoi: "contraste d'échelle déclaré" },

  /* ── S5 · Arbitrage de Lecture ── */
  { id: 'KO-S5-1', fichier: 'crash-tests/pages/KO-S5-1-sans-tete.tsx',            attendu: 'BLOQUE', sujet: 'S5', quoi: 'sept sections, aucune ne porte la tête' },
  { id: 'KO-S5-2', fichier: 'crash-tests/pages/KO-S5-2-deux-tetes.tsx',           attendu: 'BLOQUE', sujet: 'S5', quoi: 'deux têtes en position 1 et 2' },
  { id: 'KO-S5-3', fichier: 'crash-tests/pages/KO-S5-3-tete-enterree.tsx',        attendu: 'BLOQUE', sujet: 'S5', quoi: 'tête en septième position' },
  { id: 'KO-S5-4', fichier: 'crash-tests/pages/KO-S5-4-tete-rang-trois.tsx',      attendu: 'BLOQUE', sujet: 'S5', quoi: 'tête en troisième position, seuil 1' },
  { id: 'KO-S5-5', fichier: 'crash-tests/pages/KO-S5-5-rupture-sur-absence.tsx',  attendu: 'BLOQUE', sujet: 'S5', quoi: "la rupture ne lève pas l'absence de tête" },
  { id: 'KO-S5-6', fichier: 'crash-tests/pages/KO-S5-6-deux-tetes-rupture.tsx',   attendu: 'BLOQUE', sujet: 'S5', quoi: 'la rupture ne lève pas le dédoublement' },
  { id: 'KO-S5-7', fichier: 'crash-tests/pages/KO-S5-7-rupture-sans-motif.tsx',   attendu: 'BLOQUE', sujet: 'S5', quoi: 'rupture sur la position, sans motif' },
  { id: 'KO-S5-8', fichier: 'crash-tests/pages/KO-S5-8-tete-imbriquee.tsx',       attendu: 'BLOQUE', sujet: 'S5', quoi: 'tête portée par une section imbriquée' },
  { id: 'OK-S5-1', fichier: 'crash-tests/pages/OK-S5-1-tete-premiere.tsx',        attendu: 'PASSE',  sujet: 'S5', quoi: 'tête en première position' },
  { id: 'OK-S5-2', fichier: 'crash-tests/pages/OK-S5-2-tete-deuxieme.tsx',        attendu: 'PASSE',  sujet: 'S5', quoi: 'tête en deuxième position — le dernier rang admis' },
  { id: 'OK-S5-3', fichier: 'crash-tests/pages/OK-S5-3-tete-declaree.tsx',        attendu: 'PASSE',  sujet: 'S5', quoi: 'tête en cinquième position, rupture et motif' },
  { id: 'OK-S5-4', fichier: 'crash-tests/pages/OK-S5-4-page-courte.tsx',          attendu: 'PASSE',  sujet: 'S5', quoi: 'page à deux sections, non sur-bloquée' },
  { id: 'OK-S5-5', fichier: 'crash-tests/conformes/OK-1-ecran-conforme.tsx',      attendu: 'PASSE',  sujet: 'S5', quoi: 'écran hors zone page — S5 ne statue pas' },
  { id: 'OK-S5-6', fichier: 'crash-tests/hors-perimetre/exemple.test.tsx',        attendu: 'PASSE',  sujet: 'S5', quoi: 'fichier de test, hors périmètre' }
]

export async function executerBatterie() {
  const eslint = new ESLint({ cwd: RACINE, cache: false,
    overrideConfigFile: path.join(RACINE, 'tools/fili/eslint.crash.js') })
  const resultats = []
  for (const f of FIXTURES) {
    const [r] = await eslint.lintFiles([path.join(RACINE, f.fichier)])
    const messages = r?.messages ?? []
    const refus = messages.some((m) => (m.message || '').includes('REFUS DE STATUER'))
    const obtenu = refus ? 'REFUS' : messages.length > 0 ? 'BLOQUE' : 'PASSE'
    resultats.push({ ...f, obtenu, conforme: obtenu === f.attendu, messages })
  }
  return resultats
}
