/* Les états que K2 §6 déclare, gabarit par gabarit — ni plus, ni moins.
   Un état que K2 marque « — » pour un gabarit n'est pas exigible de son témoin
   (protocole §2.2, condition d'admission 3). Ce fichier est la traduction
   exécutable de ce tableau : il n'invente aucun état et n'en retire aucun. */

const empty = (paths) =>
  Object.fromEntries(paths.map((c) => [c, { data: null, loading: false, error: null }]))
const inCourse = (paths) =>
  Object.fromEntries(paths.map((c) => [c, { data: null, loading: true, error: null }]))
const inError = (paths, reason) =>
  Object.fromEntries(paths.map((c) => [c, { data: null, loading: false, error: reason }]))
const full = (o) =>
  Object.fromEntries(Object.entries(o).map(([c, d]) => [c, { data: d, loading: false, error: null }]))

export function scenariosVerdict(real) {
  const PATHS = ['/integrite', '/batterie', '/progression', '/constats', '/runs']
  return {
    /* Normal — le verdict rendu. */
    nominal: full({
      '/integrite': real.integrity,
      '/batterie': real.battery,
      '/progression': { made: real.battery.trapped + real.battery.compliant, total: real.battery.trapped + real.battery.compliant },
      '/constats': real.findings,
      '/runs': real.runs
    }),
    /* Chargement — batterie en cours, durée réelle et non un rond qui tourne. */
    loading: {
      ...inCourse(PATHS),
      '/progression': { data: { made: 47, total: 80 }, loading: false, error: null }
    },
    /* Erreur — REFUS DE STATUER. Un verdict à part entière, annoncé comme une
       alerte, et qui ferme l'acte : on ne consigne pas ce qu'on n'a pas mérité. */
    error: inError(PATHS, 'R3.7 — ÉTEINTE (ACTIF_R37 = false)'),
    /* Vide — aucun run consigné à ce jour. Les autres sources restent pleines :
       un état vide se regarde à sa place dans la page, pas en annexe (B-7). */
    empty: {
      ...full({
        '/integrite': real.integrity,
        '/batterie': real.battery,
        '/progression': { made: 80, total: 80 },
        '/constats': real.findings
      }),
      ...empty(['/runs'])
    },
    /* Succès — RUN CONSIGNÉ, DATÉ. Cinquième état déclaré par K2 §6 pour É1, et
       le seul que la lignée du 7 août ne rendait pas : c'est ce manque qui a
       rendu le témoin inadmissible et annulé la séance, sans qu'un œil se
       dépense.
       Les cinq sources portent exactement ce que porte le nominal, et c'est
       voulu : le succès de É1 n'est pas un autre écran, c'est le même écran
       juste après le geste. Ce qui change tient dans l'annonce — à l'endroit
       où l'acte a eu lieu, et dite aux lecteurs d'écran. Fabriquer en plus un
       écart de données ferait juger une différence que le produit ne produit
       pas. */
    success: full({
      '/integrite': real.integrity,
      '/batterie': real.battery,
      '/progression': { made: real.battery.trapped + real.battery.compliant, total: real.battery.trapped + real.battery.compliant },
      '/constats': real.findings,
      '/runs': real.runs
    })
  }
}

export function scenariosFinding(real) {
  const PATHS = ['/constat', '/occurrences']
  return {
    nominal: full({ '/constat': real.assertion, '/occurrences': real.occurrences }),
    loading: inCourse(PATHS),
    error: inError(PATHS, 'source du constat illisible'),
    /* K2 §6 : « Assertion au vert : aucune occurrence » — et pas de succès
       déclaré pour ce gabarit. L'assertion reste lisible, seule sa liste est vide. */
    empty: { ...full({ '/constat': real.assertion }), ...empty(['/occurrences']) }
  }
}

export function scenariosFamily(real) {
  const PATHS = ['/temoins']
  return {
    /* Normal — chaque gabarit avec son témoin courant rendu. */
    nominal: full({ '/temoins': real.families }),
    /* Chargement — la famille se lit ; aucune vignette n'est devinée. */
    loading: inCourse(PATHS),
    /* Erreur — le dossier des témoins ne répond pas. Rien ne se juge tant
       qu'on ne sait pas ce qu'on juge. */
    error: inError(PATHS, 'dossier des témoins illisible'),
    /* Vide — K2 §6 : « Aucun témoin pour ce gabarit ». La famille existe,
       elle est seulement sans génération. */
    empty: full({
      '/temoins': real.families.map((f) => ({ ...f, current: null, preview: null, history: [] }))
    })
  }
}

export function scenariosFaceAFace(real) {
  const PATHS = ['/faceAFace', '/verdicts']
  return {
    /* Normal — les deux générations disponibles, le verdict pas encore rendu. */
    nominal: { ...full({ '/faceAFace': real.face }), ...empty(['/verdicts']) },
    /* Chargement — le rendu depuis la source est en cours. */
    loading: inCourse(PATHS),
    /* Erreur — le rendu a échoué. AUCUNE image de secours n'est montrée :
       juger une capture au lieu du rendu vérifié annulerait le témoin (#016). */
    error: inError(PATHS, 'le rendu depuis la source a échoué'),
    /* Vide — premier témoin du gabarit : pas de génération précédente, donc
       pas de bascule. Le cas le plus exigeant, et il est déclaré. */
    empty: {
      ...full({ '/faceAFace': { ...real.face, previous: null } }),
      ...empty(['/verdicts'])
    },
    /* Succès — le verdict est déposé, daté, à côté du témoin qu'il juge. */
    success: full({ '/faceAFace': real.face, '/verdicts': real.verdicts })
  }
}

export function scenariosCard(real) {
  const PATHS = ['/carte']
  /* K2 §6 marque « — » le vide ET le succès pour É5 : ni l'un ni l'autre n'est
     exigible de son témoin. Trois états, donc — et l'absence des deux autres
     n'annule rien. Le conteneur porte quand même ses quatre slots : c'est le
     contrat d'état qui l'exige, pas le témoin. */
  return {
    nominal: full({ '/carte': real.card }),
    loading: inCourse(PATHS),
    error: inError(PATHS, "la carte n'a pas la forme déclarée — en-tête de « 3. Le produit » modifiée")
  }
}

export function scenariosJournal(real) {
  const PATHS = ['/journal']
  return {
    nominal: full({ '/journal': real.entries }),
    loading: inCourse(PATHS),
    error: inError(PATHS, "aucune entrée lisible dans journal.md — la forme des entrées a changé"),
    /* K2 §6 : « Aucune décision (état inatteignable en pratique, prévu quand
       même) ». Un état qu'on n'atteindra jamais se conçoit tout de même — c'est
       le seul moyen de ne pas le découvrir le jour où il arrive. */
    empty: empty(PATHS)
  }
}

export function scenariosAct(real) {
  const PATHS = ['/acte', '/brouillons']
  return {
    /* Normal — le formulaire, et ce qui a déjà été composé. */
    nominal: full({ '/acte': real.act, '/brouillons': real.drafts }),
    /* Chargement — l'écriture est en cours. */
    loading: inCourse(PATHS),
    /* Erreur — K2 §6 : « Écriture refusée — LE FICHIER RESTE INTACT ». La
       composition reste donc pleine : ce qui a échoué est le dépôt, pas la
       saisie, et un écran qui viderait le formulaire ferait perdre à l'Auteur
       ce que la panne n'avait pas touché. */
    error: {
      ...full({ '/acte': real.act }),
      ...inError(['/brouillons'], 'le dossier des brouillons est en lecture seule')
    },
    /* Vide — aucun brouillon composé à ce jour. Le formulaire, lui, est prêt. */
    empty: { ...full({ '/acte': real.act }), ...empty(['/brouillons']) },
    /* Succès — l'entrée est composée, datée, numérotée, avec son déplacement
       de statut. Elle attend la validation au dépôt : Fili n'écrit pas. */
    success: full({ '/acte': real.act, '/brouillons': real.drafts })
  }
}
