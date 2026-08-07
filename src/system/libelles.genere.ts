/* GÉNÉRÉ depuis fili.libelles.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-libelles.mjs
   Le catalogue est la source ; ce fichier n'en est que la traduction. */

export const LIBELLES = {
  "produit": {
    "nom": "Fili",
    "baseline": "Le poste depuis lequel l'état du système se lit et se tranche."
  },
  "commun": {
    "actions": {
      "consignerLeRun": "Consigner ce run",
      "consignerEnCours": "Consignation en cours…",
      "reessayer": "Relancer la lecture",
      "ouvrirLeConstat": "Ouvrir le constat",
      "revenirAuVerdict": "Revenir au verdict",
      "jugerLeTemoin": "Juger ce témoin",
      "revenirALaFamille": "Revenir à la famille"
    },
    "statuts": {
      "verrou": "Verrouillé",
      "attente": "En cours",
      "idee": "Idée",
      "refus": "Refus de statuer",
      "accepte": "Accepté",
      "refuse": "Refusé",
      "aJuger": "À juger"
    },
    "mesures": {
      "integrite": "Intégrité du juge",
      "fixturesPiegees": "Pièges bloqués",
      "fixturesConformes": "Conformes passants",
      "mutations": "Sabotages détectés",
      "assertions": "Assertions portées",
      "absente": "non mesuré dans ce run"
    }
  },
  "ecrans": {
    "verdict": {
      "surtitre": "Fili · le verdict du dépôt",
      "titre": "Le juge est-il entier, et le dépôt tient-il ?",
      "chapeau": "L'intégrité d'abord : tant que les assertions déclarées ne sont pas toutes portées et actives, aucun verdict n'est prononçable. La batterie ne vient qu'ensuite.",
      "integriteTitre": "Intégrité du juge",
      "integriteEntier": "Les {n} assertions déclarées sont portées et actives.",
      "integriteRompue": "{n} assertion(s) déclarée(s) ne sont pas portées ou sont éteintes.",
      "batterieTitre": "La batterie",
      "batterieVerte": "Aucun écart. Les cinq Sujets tiennent.",
      "batterieRouge": "{n} écart(s). Le dépôt ne passe pas.",
      "constatsTitre": "Ce qui rougit",
      "constatsAide": "Une assertion qui rougit désigne une décision de doctrine, pas un fichier. Le fichier n'arrive qu'en troisième.",
      "derniersRunsTitre": "Le dernier run consigné",
      "consigneTitre": "Consigner",
      "consigneAide": "Un run consigné devient une pièce du dépôt. Il ne se réécrit pas.",
      "etats": {
        "chargement": "Batterie en cours — {faites} épreuves sur {total}.",
        "chargementAide": "La durée réelle s'affiche parce qu'un compte qui avance dit quelque chose qu'un rond qui tourne ne dit pas.",
        "erreurTitre": "Refus de statuer",
        "erreurCorps": "Le juge n'est pas entier : {raison}. La batterie ne rend pas de verdict sur un juge incomplet, et la consignation reste fermée.",
        "erreurAide": "Ceci n'est pas une panne technique. C'est un verdict à part entière — le seul que le système accepte de prononcer dans cet état.",
        "videTitre": "Aucun run consigné à ce jour",
        "videCorps": "Le premier run consigné ouvrira la lignée. Lancez la batterie pour en produire un.",
        "succesTitre": "Run consigné",
        "succesCorps": "Daté du {date}. Il est désormais une pièce du dépôt.",
        "suspenduTitre": "Suspendu",
        "batterieSuspendue": "La batterie n'a pas été jouée : le juge n'est pas entier. Ce qui manque ici n'est pas un résultat, c'est le droit d'en produire un.",
        "constatsSuspendus": "Aucun constat n'est lisible tant qu'aucun verdict n'a été rendu. Le détail viendra après le droit de statuer, jamais avant.",
        "consigneFermee": "La consignation est fermée. On ne consigne pas un verdict qu'on n'a pas mérité."
      }
    },
    "constat": {
      "surtitre": "Fili · le constat",
      "titre": "{assertion} — ce qu'elle interdit, et pourquoi",
      "contratTitre": "D'où elle vient",
      "raisonTitre": "Ce qu'elle protège",
      "occurrencesTitre": "Où elle rougit",
      "occurrencesCompte": "{n} occurrence(s), dans {f} fichier(s).",
      "ruptureTitre": "Ce qu'une rupture déclarée ne lève jamais",
      "etats": {
        "chargement": "Lecture du détail de {assertion}…",
        "erreurTitre": "Le constat est illisible",
        "erreurCorps": "La source du constat ne répond pas : {raison}. L'assertion reste rouge ; ce qui manque, c'est le détail, pas le verdict.",
        "videTitre": "Aucune occurrence",
        "videCorps": "{assertion} est au vert. Rien à corriger — et rien à célébrer : c'est l'état attendu.",
        "suspenduTitre": "Suspendu",
        "occurrencesSuspendues": "La liste des occurrences est illisible. L'assertion, elle, reste lisible — et c'est elle qui compte d'abord."
      },
      "raisonAide": "Une assertion n'existe pas pour être satisfaite : elle existe pour empêcher une classe de défaut de revenir. C'est cela qu'on lit d'abord.",
      "ruptureCorps": "La rupture déclarée porte sur la forme et les valeurs. Elle ne lève jamais le clavier, la hiérarchie de titres, le sens du flux, l'annonce d'un état, le contraste ni le mouvement.",
      "occurrenceFichier": "{fichier} — ligne {ligne}",
      "occurrencesAide": "Le fichier n'arrive qu'en troisième. Ce qui précède dit pourquoi la règle existe ; ce qui suit dit seulement où elle a été rencontrée."
    },
    "famille": {
      "surtitre": "Fili · les témoins",
      "titre": "Ce que le produit donne à voir, gabarit par gabarit",
      "chapeau": "Chaque gabarit porte un témoin courant, rendu depuis la source que le Gardien a vérifiée. C'est lui qui se juge ; les précédents restent consultables.",
      "courantTitre": "Le témoin courant",
      "historiqueTitre": "Les générations précédentes",
      "historiqueAide": "Une génération par date. Le passage à la suivante ne s'obtient pas en effaçant la précédente.",
      "etatsCompte": "{n} état(s) rendu(s)",
      "illisible": "Ce témoin ne s'ouvre pas. Il est signalé ici plutôt que masqué : un gabarit sans témoin lisible est un gabarit qu'on ne peut pas juger.",
      "ouvrirLeFaceAFace": "Juger ce témoin",
      "etats": {
        "chargementAide": "Lecture de la famille des témoins…",
        "erreurTitre": "La famille des témoins est illisible",
        "erreurCorps": "Le dossier des témoins ne répond pas : {raison}. Aucun jugement n'est possible tant qu'on ne sait pas ce qu'on juge.",
        "erreurAide": "Rejouez le rendu des témoins au dépôt, puis relisez.",
        "videTitre": "Aucun témoin pour ce gabarit",
        "videCorps": "Ce gabarit n'a encore rien rendu. Il en portera un dès que la chaîne de rendu aura tourné sur sa source.",
        "suspenduTitre": "Suspendu",
        "historiqueSuspendu": "L'historique est illisible. Le témoin courant, lui, reste lisible — et c'est lui qui se juge."
      }
    },
    "faceAFace": {
      "surtitre": "Fili · le jugement",
      "titre": "Le témoin en jugement",
      "chapeau": "Le témoin est rendu depuis la source vérifiée. La bascule met le précédent à la même place, pour que l'œil compare de mémoire et non de gauche à droite.",
      "bascule": {
        "versPrecedent": "Voir la génération précédente",
        "versCourant": "Revenir au témoin jugé",
        "marqueCourant": "Génération jugée — {date}",
        "marquePrecedent": "Génération précédente — {date}"
      },
      "metaTitre": "Ce que porte ce témoin",
      "metaGabarit": "Gabarit",
      "metaDate": "Génération",
      "metaEtats": "États rendus",
      "metaBatterie": "État de la batterie au rendu",
      "acteTitre": "Le verdict",
      "acteAide": "Le verdict est binaire. Une signature qui demande une hésitation n'est pas perceptible : l'hésitation se lit comme un refus.",
      "accepter": "Accepter — ce témoin devient la référence",
      "refuser": "Refuser",
      "refuserEnCours": "Enregistrement du refus…",
      "accepterEnCours": "Enregistrement de l'acceptation…",
      "motifLabel": "Ce qui a motivé le refus",
      "motifAide": "Un refus sans motif écrit ne se relit pas. Nommez ce qui n'allait pas, pas ce qu'il faudrait faire.",
      "motifVide": "Un motif est nécessaire pour refuser.",
      "etats": {
        "chargementAide": "Rendu du témoin depuis la source vérifiée…",
        "erreurTitre": "Le rendu a échoué",
        "erreurCorps": "Le témoin n'a pas pu être rendu depuis sa source : {raison}. Aucune image de secours n'est affichée à la place — juger une capture au lieu du rendu vérifié annulerait le sens du témoin.",
        "erreurAide": "Rejouez le rendu au dépôt, puis rouvrez ce face-à-face.",
        "videTitre": "Premier témoin de ce gabarit",
        "videCorps": "Il n'existe pas de génération précédente. Le témoin se juge seul, sans comparaison — et c'est le cas le plus exigeant.",
        "succesTitre": "Verdict enregistré",
        "succesCorps": "Verdict déposé le {date}, à côté du témoin qu'il juge. Il ne se réécrit pas.",
        "suspenduTitre": "Suspendu",
        "acteFerme": "Le verdict ne peut pas être déposé : la pièce qui le reçoit est illisible."
      },
      "cadreTitre": "{gabarit} — génération {date}"
    }
  }
} as const

/* Un libellé porteur d'une valeur la reçoit ici, jamais par concaténation sur
   place : une phrase coupée en morceaux ne se relit plus d'un bloc. */
export function formuler(modele: string, valeurs: Record<string, string | number>): string {
  return modele.replace(/\{(\w+)\}/g, (entier, cle: string) =>
    cle in valeurs ? String(valeurs[cle]) : entier
  )
}
