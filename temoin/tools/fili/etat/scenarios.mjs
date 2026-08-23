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
    succes: plein({
      '/integrite': reel.integrite,
      '/batterie': reel.batterie,
      '/progression': { faites: reel.batterie.piegees + reel.batterie.conformes, total: reel.batterie.piegees + reel.batterie.conformes },
      '/constats': reel.constats,
      '/runs': reel.runs
    })
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

export function scenariosFamille(reel) {
  const CHEMINS = ['/temoins']
  return {
    /* Normal — chaque gabarit avec son témoin courant rendu. */
    nominal: plein({ '/temoins': reel.familles }),
    /* Chargement — la famille se lit ; aucune vignette n'est devinée. */
    chargement: enCours(CHEMINS),
    /* Erreur — le dossier des témoins ne répond pas. Rien ne se juge tant
       qu'on ne sait pas ce qu'on juge. */
    erreur: enErreur(CHEMINS, 'dossier des témoins illisible'),
    /* Vide — K2 §6 : « Aucun témoin pour ce gabarit ». La famille existe,
       elle est seulement sans génération. */
    vide: plein({
      '/temoins': reel.familles.map((f) => ({ ...f, courant: null, apercu: null, historique: [] }))
    })
  }
}

export function scenariosFaceAFace(reel) {
  const CHEMINS = ['/faceAFace', '/verdicts']
  return {
    /* Normal — les deux générations disponibles, le verdict pas encore rendu. */
    nominal: { ...plein({ '/faceAFace': reel.face }), ...vide(['/verdicts']) },
    /* Chargement — le rendu depuis la source est en cours. */
    chargement: enCours(CHEMINS),
    /* Erreur — le rendu a échoué. AUCUNE image de secours n'est montrée :
       juger une capture au lieu du rendu vérifié annulerait le témoin (#016). */
    erreur: enErreur(CHEMINS, 'le rendu depuis la source a échoué'),
    /* Vide — premier témoin du gabarit : pas de génération précédente, donc
       pas de bascule. Le cas le plus exigeant, et il est déclaré. */
    vide: {
      ...plein({ '/faceAFace': { ...reel.face, precedent: null } }),
      ...vide(['/verdicts'])
    },
    /* Succès — le verdict est déposé, daté, à côté du témoin qu'il juge. */
    succes: plein({ '/faceAFace': reel.face, '/verdicts': reel.verdicts })
  }
}

export function scenariosCarte(reel) {
  const CHEMINS = ['/carte']
  /* K2 §6 marque « — » le vide ET le succès pour É5 : ni l'un ni l'autre n'est
     exigible de son témoin. Trois états, donc — et l'absence des deux autres
     n'annule rien. Le conteneur porte quand même ses quatre slots : c'est le
     contrat d'état qui l'exige, pas le témoin. */
  return {
    nominal: plein({ '/carte': reel.carte }),
    chargement: enCours(CHEMINS),
    erreur: enErreur(CHEMINS, "la carte n'a pas la forme déclarée — en-tête de « 3. Le produit » modifiée")
  }
}

export function scenariosJournal(reel) {
  const CHEMINS = ['/journal']
  return {
    nominal: plein({ '/journal': reel.entrees }),
    chargement: enCours(CHEMINS),
    erreur: enErreur(CHEMINS, "aucune entrée lisible dans journal.md — la forme des entrées a changé"),
    /* K2 §6 : « Aucune décision (état inatteignable en pratique, prévu quand
       même) ». Un état qu'on n'atteindra jamais se conçoit tout de même — c'est
       le seul moyen de ne pas le découvrir le jour où il arrive. */
    vide: vide(CHEMINS)
  }
}

export function scenariosActe(reel) {
  const CHEMINS = ['/acte', '/brouillons']
  return {
    /* Normal — le formulaire, et ce qui a déjà été composé. */
    nominal: plein({ '/acte': reel.acte, '/brouillons': reel.brouillons }),
    /* Chargement — l'écriture est en cours. */
    chargement: enCours(CHEMINS),
    /* Erreur — K2 §6 : « Écriture refusée — LE FICHIER RESTE INTACT ». La
       composition reste donc pleine : ce qui a échoué est le dépôt, pas la
       saisie, et un écran qui viderait le formulaire ferait perdre à l'Auteur
       ce que la panne n'avait pas touché. */
    erreur: {
      ...plein({ '/acte': reel.acte }),
      ...enErreur(['/brouillons'], 'le dossier des brouillons est en lecture seule')
    },
    /* Vide — aucun brouillon composé à ce jour. Le formulaire, lui, est prêt. */
    vide: { ...plein({ '/acte': reel.acte }), ...vide(['/brouillons']) },
    /* Succès — l'entrée est composée, datée, numérotée, avec son déplacement
       de statut. Elle attend la validation au dépôt : Fili n'écrit pas. */
    succes: plein({ '/acte': reel.acte, '/brouillons': reel.brouillons })
  }
}
