/* Les états que K2 §6 déclare, gabarit par gabarit — ni plus, ni moins.
   Un état que K2 marque « — » pour un gabarit n'est pas exigible de son témoin
   (protocole §2.2, condition d'admission 3). Ce fichier est la traduction
   exécutable de ce tableau : il n'invente aucun état et n'en retire aucun. */

const vide = (chemins) =>
  Object.fromEntries(chemins.map((c) => [c, { donnees: null, chargement: false, erreur: null }]))
const enCours = (chemins) =>
  Object.fromEntries(chemins.map((c) => [c, { donnees: null, chargement: true, erreur: null }]))
const enErreur = (chemins, raison) =>
  Object.fromEntries(chemins.map((c) => [c, { donnees: null, chargement: false, erreur: raison }]))
const plein = (o) =>
  Object.fromEntries(Object.entries(o).map(([c, d]) => [c, { donnees: d, chargement: false, erreur: null }]))

export function scenariosVerdict(reel) {
  const CHEMINS = ['/integrite', '/batterie', '/progression', '/constats', '/runs']
  return {
    /* Normal — le verdict rendu. */
    nominal: plein({
      '/integrite': reel.integrite,
      '/batterie': reel.batterie,
      '/progression': { faites: reel.batterie.piegees + reel.batterie.conformes, total: reel.batterie.piegees + reel.batterie.conformes },
      '/constats': reel.constats,
      '/runs': reel.runs
    }),
    /* Chargement — batterie en cours, durée réelle et non un rond qui tourne. */
    chargement: {
      ...enCours(CHEMINS),
      '/progression': { donnees: { faites: 47, total: 80 }, chargement: false, erreur: null }
    },
    /* Erreur — REFUS DE STATUER. Un verdict à part entière, annoncé comme une
       alerte, et qui ferme l'acte : on ne consigne pas ce qu'on n'a pas mérité. */
    erreur: enErreur(CHEMINS, 'R3.7 — ÉTEINTE (ACTIF_R37 = false)'),
    /* Vide — aucun run consigné à ce jour. Les autres sources restent pleines :
       un état vide se regarde à sa place dans la page, pas en annexe (B-7). */
    vide: {
      ...plein({
        '/integrite': reel.integrite,
        '/batterie': reel.batterie,
        '/progression': { faites: 80, total: 80 },
        '/constats': reel.constats
      }),
      ...vide(['/runs'])
    }
  }
}

export function scenariosConstat(reel) {
  const CHEMINS = ['/constat', '/occurrences']
  return {
    nominal: plein({ '/constat': reel.assertion, '/occurrences': reel.occurrences }),
    chargement: enCours(CHEMINS),
    erreur: enErreur(CHEMINS, 'source du constat illisible'),
    /* K2 §6 : « Assertion au vert : aucune occurrence » — et pas de succès
       déclaré pour ce gabarit. L'assertion reste lisible, seule sa liste est vide. */
    vide: { ...plein({ '/constat': reel.assertion }), ...vide(['/occurrences']) }
  }
}
