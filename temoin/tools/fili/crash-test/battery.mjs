import { ESLint } from 'eslint'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))

/** Verdict attendu de chaque fixture. C'est ce qui rend la batterie falsifiable. */
export const FIXTURES = [
  { id: 'KO-1',  file: 'crash-tests/trapped/KO-1-bouton-natif.tsx',        expected: 'BLOQUE', what: '<button> natif dans un écran' },
  { id: 'KO-2',  file: 'crash-tests/trapped/KO-2-lien-natif.tsx',          expected: 'BLOQUE', what: '<a href> de navigation' },
  { id: 'KO-3',  file: 'crash-tests/trapped/KO-3-champ-natif.tsx',         expected: 'BLOQUE', what: '<input> de recherche natif' },
  { id: 'KO-3b', file: 'crash-tests/trapped/KO-3b-label-natif.tsx',        expected: 'BLOQUE', what: '<label> natif' },
  { id: 'KO-4',  file: 'crash-tests/trapped/KO-4-div-cliquable.tsx',         expected: 'BLOQUE', what: '<div onClick> en carte cliquable' },
  { id: 'KO-5',  file: 'crash-tests/trapped/KO-5-span-role-button.tsx',       expected: 'BLOQUE', what: '<span role="button" tabIndex>' },
  { id: 'KO-6',  file: 'crash-tests/trapped/KO-6-li-clavier.tsx',             expected: 'BLOQUE', what: '<li onKeyDown> activable' },
  { id: 'KO-7',  file: 'crash-tests/trapped/KO-7-source-non-declaree.tsx',    expected: 'BLOQUE', what: 'composant venu d\'un paquet non déclaré' },
  { id: 'KO-7b', file: 'crash-tests/trapped/KO-7b-nom-registre-source-etrangere.tsx', expected: 'BLOQUE', what: 'nom du registre importé d\'ailleurs' },
  { id: 'KO-8',  file: 'crash-tests/trapped/KO-8-redefinition-locale.tsx',    expected: 'BLOQUE', what: 'Button redéfini localement' },
  { id: 'KO-9',  file: 'crash-tests/trapped/KO-9-inner-html.tsx',             expected: 'BLOQUE', what: 'dangerouslySetInnerHTML' },
  { id: 'KO-10', file: 'crash-tests/trapped/KO-10-create-element.tsx',        expected: 'BLOQUE', what: "createElement('button')" },
  { id: 'KO-11', file: 'crash-tests/trapped/KO-11-rupture-ne-leve-pas-a11y.tsx', expected: 'BLOQUE', what: 'rupture invoquée contre l\'accessibilité' },
  { id: 'KO-12', file: 'crash-tests/trapped/KO-12-rupture-sans-motif.tsx', expected: 'BLOQUE', what: 'rupture déclarée sans motif' },
  { id: 'OK-1',  file: 'crash-tests/compliant/OK-1-ecran-conforme.tsx',    expected: 'PASSE', what: 'écran composé du registre' },
  { id: 'OK-2',  file: 'crash-tests/compliant/OK-2-composition-locale.tsx',  expected: 'PASSE', what: 'composition locale du registre' },
  { id: 'OK-4',  file: 'crash-tests/compliant/OK-4-div-presentational.tsx',expected: 'PASSE', what: '<div> purement présentationnel' },
  { id: 'OK-5',  file: 'crash-tests/compliant/OK-5-rupture-declaree.tsx',  expected: 'PASSE', what: 'rupture déclarée avec motif' },
  { id: 'OK-3',  file: 'crash-tests/design-system/Toggle.tsx',                   expected: 'PASSE', what: '<button> natif en zone système' },
  { id: 'OK-6',  file: 'crash-tests/off-scope/example.test.tsx',      expected: 'PASSE', what: 'fichier de test, hors périmètre' },

  /* ── S2 · Contrat d'État ── */
  { id: 'KO-S2-1', file: 'crash-tests/trapped/KO-S2-1-sans-conteneur.tsx',        expected: 'BLOQUE', subject: 'S2', what: 'donnée distante rendue sans conteneur' },
  { id: 'KO-S2-2', file: 'crash-tests/trapped/KO-S2-2-slot-manquant.tsx',         expected: 'BLOQUE', subject: 'S2', what: "slot « erreur » absent" },
  { id: 'KO-S2-3', file: 'crash-tests/trapped/KO-S2-3-slot-null.tsx',             expected: 'BLOQUE', subject: 'S2', what: 'slot erreur={null}' },
  { id: 'KO-S2-4', file: 'crash-tests/trapped/KO-S2-4-slot-fragment-vide.tsx',    expected: 'BLOQUE', subject: 'S2', what: 'slot vide={<></>}' },
  { id: 'KO-S2-5', file: 'crash-tests/trapped/KO-S2-5-drapeau-hors-conteneur.tsx',expected: 'BLOQUE', subject: 'S2', what: 'if (chargement) return … dans un écran' },
  { id: 'KO-S2-6', file: 'crash-tests/trapped/KO-S2-6-mutation-sans-attente.tsx', expected: 'BLOQUE', subject: 'S2', what: "mutation sans état d'attente" },
  { id: 'KO-S2-7', file: 'crash-tests/trapped/KO-S2-7-mutation-non-rendue.tsx',   expected: 'BLOQUE', subject: 'S2', what: 'attente et issue jamais rendues' },
  { id: 'KO-S2-8', file: 'crash-tests/trapped/KO-S2-8-rupture-sur-chargement.tsx',expected: 'BLOQUE', subject: 'S2', what: 'rupture portée sur le chargement' },
  { id: 'KO-S2-9', file: 'crash-tests/trapped/KO-S2-9-rupture-sans-motif.tsx',    expected: 'BLOQUE', subject: 'S2', what: 'rupture sur « vide » sans motif' },
  { id: 'OK-S2-1', file: 'crash-tests/compliant/OK-S2-1-ecran-nominal.tsx',       expected: 'PASSE', subject: 'S2', what: 'écran nominal, quatre slots pleins' },
  { id: 'OK-S2-2', file: 'crash-tests/compliant/OK-S2-2-rupture-vide-avec-motif.tsx', expected: 'PASSE', subject: 'S2', what: 'rupture sur « vide » avec motif' },
  { id: 'OK-S2-3', file: 'crash-tests/compliant/OK-S2-3-mutation-complete.tsx',   expected: 'PASSE', subject: 'S2', what: 'mutation avec attente et issue rendues' },
  { id: 'OK-S2-4', file: 'crash-tests/design-system/StateAsync.tsx',                              expected: 'PASSE', subject: 'S2', what: 'le conteneur lui-même, en zone système' },
  { id: 'OK-S2-5', file: 'crash-tests/compliant/OK-4-div-presentational.tsx',     expected: 'PASSE', subject: 'S2', what: 'composant sans source asynchrone' },
  { id: 'KO-S2-10', file: 'crash-tests/pages/KO-S2-10-titre-en-dur-pendant-le-chargement.tsx', expected: 'BLOQUE', subject: 'S2', what: "titre et phrase écrits pendant que la section attend" },
  { id: 'KO-S2-11', file: 'crash-tests/pages/KO-S2-11-chargement-qui-parle.tsx',              expected: 'BLOQUE', subject: 'S2', what: 'une pastille écrite dans le chargement' },
  { id: 'OK-S2-6',  file: 'crash-tests/pages/OK-S2-6-squelette-entier.tsx',                   expected: 'PASSE',  subject: 'S2', what: "la section qui attend attend en entier" },

  /* ── S3 · Discipline Spatiale ── */
  { id: 'KO-S3-1',  file: 'crash-tests/trapped/KO-S3-1-valeur-arbitraire.tsx',  expected: 'BLOQUE', subject: 'S3', what: 'p-[13px]' },
  { id: 'KO-S3-2',  file: 'crash-tests/trapped/KO-S3-2-gap-arbitraire.tsx',     expected: 'BLOQUE', subject: 'S3', what: 'gap-[7px]' },
  { id: 'KO-S3-2b', file: 'crash-tests/trapped/KO-S3-2b-pas-hors-echelle.tsx',  expected: 'BLOQUE', subject: 'S3', what: "px-inline-moyen, cran absent de l'Échelle" },
  { id: 'KO-S3-3',  file: 'crash-tests/trapped/KO-S3-3-marge-enfant.tsx',       expected: 'BLOQUE', subject: 'S3', what: 'mt-block-card sur un enfant' },
  { id: 'KO-S3-4',  file: 'crash-tests/trapped/KO-S3-4-marge-section.tsx',      expected: 'BLOQUE', subject: 'S3', what: 'mb-block-page sur une section' },
  { id: 'KO-S3-5',  file: 'crash-tests/trapped/KO-S3-5-marge-negative.tsx',     expected: 'BLOQUE', subject: 'S3', what: '-mt-block-coque de compensation' },
  { id: 'KO-S3-6',  file: 'crash-tests/trapped/KO-S3-6-style-inline.tsx',       expected: 'BLOQUE', subject: 'S3', what: 'style={{ marginTop }}' },
  { id: 'KO-S3-7',  file: 'crash-tests/trapped/KO-S3-7-largeur-magique.tsx',    expected: 'BLOQUE', subject: 'S3', what: 'w-[327px]' },
  { id: 'KO-S3-8',  file: 'crash-tests/trapped/KO-S3-8-position-magique.tsx',   expected: 'BLOQUE', subject: 'S3', what: 'top-[13px]' },
  { id: 'KO-S3-9',  file: 'crash-tests/trapped/KO-S3-9-classe-construite.tsx',  expected: 'BLOQUE', subject: 'S3', what: 'classe p-${…} construite' },
  { id: 'KO-S3-10', file: 'crash-tests/trapped/KO-S3-10-rupture-sur-marge.tsx', expected: 'BLOQUE', subject: 'S3', what: 'rupture invoquée sur une marge' },
  { id: 'KO-S3-11', file: 'crash-tests/trapped/KO-S3-11-rupture-sans-motif.tsx',expected: 'BLOQUE', subject: 'S3', what: 'rupture sans motif' },
  { id: 'OK-S3-1', file: 'crash-tests/compliant/OK-S3-1-conteneur-distribue.tsx', expected: 'PASSE', subject: 'S3', what: "écart de rang « large » porté par le parent" },
  { id: 'OK-S3-2', file: 'crash-tests/compliant/OK-S3-2-pas-de-l-echelle.tsx',    expected: 'PASSE', subject: 'S3', what: "px-inline-page, un cran de l'Échelle" },
  { id: 'OK-S3-3', file: 'crash-tests/compliant/OK-S3-3-centrage.tsx',            expected: 'PASSE', subject: 'S3', what: 'mx-auto, exception déclarée' },
  { id: 'OK-S3-4', file: 'crash-tests/compliant/OK-S3-4-rupture-avec-motif.tsx',  expected: 'PASSE', subject: 'S3', what: 'w-[420px] avec motif' },
  { id: 'OK-S3-5', file: 'crash-tests/design-system/InsetSystem.tsx',                 expected: 'PASSE', subject: 'S3', what: 'marge et valeur libre en zone système' },
  { id: 'KO-S3-12', file: 'crash-tests/trapped/KO-S3-12-proximite-prop.tsx',  expected: 'BLOQUE', subject: 'S3', what: 'deux groupes emboîtés au même rang, par la prop' },
  { id: 'KO-S3-13', file: 'crash-tests/trapped/KO-S3-13-proximite-classe.tsx',expected: 'BLOQUE', subject: 'S3', what: 'deux groupes emboîtés au même rang, par la classe' },
  { id: 'OK-S3-6', file: 'crash-tests/pages/Witness.tsx',                                    expected: 'PASSE', subject: 'S3', what: "l'Écran Témoin lui-même" },
  { id: 'OK-S3-7', file: 'crash-tests/compliant/OK-S3-7-proximite-tenue.tsx',     expected: 'PASSE', subject: 'S3', what: 'groupes au rang large, intérieur au rang détail' },

  /* ── S4 · Rythme de Composition ── */
  { id: 'KO-S4-1',  file: 'crash-tests/pages/KO-S4-1-div-au-premier-niveau.tsx', expected: 'BLOQUE', subject: 'S4', what: 'bloc anonyme au premier niveau' },
  { id: 'KO-S4-2',  file: 'crash-tests/pages/KO-S4-2-densite-absente.tsx',       expected: 'BLOQUE', subject: 'S4', what: 'section sans densité' },
  { id: 'KO-S4-2b', file: 'crash-tests/pages/KO-S4-2b-densite-inconnue.tsx',     expected: 'BLOQUE', subject: 'S4', what: 'densité hors échelle' },
  { id: 'KO-S4-3',  file: 'crash-tests/pages/KO-S4-3-monotonie.tsx',             expected: 'BLOQUE', subject: 'S4', what: 'trois sections identiques à la suite' },
  { id: 'KO-S4-4',  file: 'crash-tests/pages/KO-S4-4-deux-titres-1.tsx',         expected: 'BLOQUE', subject: 'S4', what: 'deux titres de niveau 1' },
  { id: 'KO-S4-5',  file: 'crash-tests/pages/KO-S4-5-saut-de-niveau.tsx',        expected: 'BLOQUE', subject: 'S4', what: 'saut de niveau 1 → 3' },
  { id: 'KO-S4-6',  file: 'crash-tests/pages/KO-S4-6-taille-surchargee.tsx',     expected: 'BLOQUE', subject: 'S4', what: 'titre agrandi à la main' },
  { id: 'KO-S4-7',  file: 'crash-tests/pages/KO-S4-7-rupture-sur-titre.tsx',     expected: 'BLOQUE', subject: 'S4', what: 'rupture invoquée sur la hiérarchie' },
  { id: 'OK-S4-1', file: 'crash-tests/pages/OK-S4-1-page-conforme.tsx',      expected: 'PASSE', subject: 'S4', what: 'page aux densités alternées' },
  { id: 'OK-S4-2', file: 'crash-tests/pages/OK-S4-2-monotonie-declaree.tsx', expected: 'PASSE', subject: 'S4', what: 'monotonie déclarée avec motif' },
  { id: 'OK-S4-3', file: 'crash-tests/pages/OK-S4-3-contraste-declare.tsx',  expected: 'PASSE', subject: 'S4', what: "contraste d'échelle déclaré" },

  /* ── S5 · Arbitrage de Lecture ── */
  { id: 'KO-S5-1', file: 'crash-tests/pages/KO-S5-1-sans-tete.tsx',            expected: 'BLOQUE', subject: 'S5', what: 'sept sections, aucune ne porte la tête' },
  { id: 'KO-S5-2', file: 'crash-tests/pages/KO-S5-2-deux-tetes.tsx',           expected: 'BLOQUE', subject: 'S5', what: 'deux têtes en position 1 et 2' },
  { id: 'KO-S5-3', file: 'crash-tests/pages/KO-S5-3-tete-enterree.tsx',        expected: 'BLOQUE', subject: 'S5', what: 'tête en septième position' },
  { id: 'KO-S5-4', file: 'crash-tests/pages/KO-S5-4-tete-rang-trois.tsx',      expected: 'BLOQUE', subject: 'S5', what: 'tête en troisième position, seuil 1' },
  { id: 'KO-S5-5', file: 'crash-tests/pages/KO-S5-5-rupture-sur-absence.tsx',  expected: 'BLOQUE', subject: 'S5', what: "la rupture ne lève pas l'absence de tête" },
  { id: 'KO-S5-6', file: 'crash-tests/pages/KO-S5-6-deux-tetes-rupture.tsx',   expected: 'BLOQUE', subject: 'S5', what: 'la rupture ne lève pas le dédoublement' },
  { id: 'KO-S5-7', file: 'crash-tests/pages/KO-S5-7-rupture-sans-motif.tsx',   expected: 'BLOQUE', subject: 'S5', what: 'rupture sur la position, sans motif' },
  { id: 'KO-S5-8', file: 'crash-tests/pages/KO-S5-8-tete-imbriquee.tsx',       expected: 'BLOQUE', subject: 'S5', what: 'tête portée par une section imbriquée' },
  { id: 'OK-S5-1', file: 'crash-tests/pages/OK-S5-1-tete-premiere.tsx',        expected: 'PASSE',  subject: 'S5', what: 'tête en première position' },
  { id: 'OK-S5-2', file: 'crash-tests/pages/OK-S5-2-tete-deuxieme.tsx',        expected: 'PASSE',  subject: 'S5', what: 'tête en deuxième position — le dernier rang admis' },
  { id: 'OK-S5-3', file: 'crash-tests/pages/OK-S5-3-tete-declaree.tsx',        expected: 'PASSE',  subject: 'S5', what: 'tête en cinquième position, rupture et motif' },
  { id: 'OK-S5-4', file: 'crash-tests/pages/OK-S5-4-page-courte.tsx',          expected: 'PASSE',  subject: 'S5', what: 'page à deux sections, non sur-bloquée' },
  { id: 'OK-S5-5', file: 'crash-tests/compliant/OK-1-ecran-conforme.tsx',      expected: 'PASSE',  subject: 'S5', what: 'écran hors zone page — S5 ne statue pas' },
  { id: 'OK-S5-6', file: 'crash-tests/off-scope/example.test.tsx',        expected: 'PASSE',  subject: 'S5', what: 'fichier de test, hors périmètre' }
]

export async function runBattery() {
  const eslint = new ESLint({ cwd: ROOT, cache: false,
    overrideConfigFile: path.join(ROOT, 'tools/fili/eslint.crash.js') })
  const results = []
  for (const f of FIXTURES) {
    const [r] = await eslint.lintFiles([path.join(ROOT, f.file)])
    const messages = r?.messages ?? []
    const refusal = messages.some((m) => (m.message || '').includes('REFUS DE STATUER'))
    const obtained = refusal ? 'REFUS' : messages.length > 0 ? 'BLOQUE' : 'PASSE'
    results.push({ ...f, obtained, compliant: obtained === f.expected, messages })
  }
  return results
}
