/* GÉNÉRÉ depuis fili/libelles.json — ne pas éditer à la main.
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
      "integriteAide": "Le résultat ne vaut que ce que vaut le juge. Ce compte dit combien de règles il applique vraiment.",
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
    },
    "carte": {
      "surtitre": "Fili · la carte",
      "titre": "Où en est le système, et ce qui bloque la suite",
      "chapeau": "Cette carte décrit le présent. Elle ne raconte pas comment on y est arrivé — c'est le journal qui le fait.",
      "prochainTitre": "Le prochain jalon",
      "prochainBloque": "Ce qui le bloque",
      "prochainLibre": "Rien ne le bloque : il est ouvrable.",
      "jalonsTitre": "Le chapitre",
      "contratsTitre": "Les contrats du corpus",
      "gabaritsTitre": "Les sept gabarits",
      "instrumentTitre": "L'instrument de la Voie B",
      "dettesTitre": "Les dettes",
      "dettesAide": "Une dette fermée reste écrite : ce qui a coûté quelque chose ne s'efface pas de la carte.",
      "colonneStatut": "Statut",
      "etats": {
        "chargementAide": "Lecture de la carte…",
        "erreurTitre": "La carte n'a pas la forme déclarée",
        "erreurCorps": "Elle est lisible par un humain, pas par le producteur : {raison}. Rien n'est affiché plutôt qu'une carte partielle — une carte incomplète se lit comme un système incomplet.",
        "erreurAide": "Rétablissez la forme des tableaux au dépôt, puis relisez.",
        "videTitre": "Aucune carte",
        "videCorps": "Le document de carte n'existe pas encore. Il en portera un dès qu'un jalon sera déclaré.",
        "suspenduTitre": "Suspendu",
        "detteSuspendue": "La liste des dettes est illisible. Le reste de la carte, lui, se lit — et c'est le prochain jalon qui compte d'abord."
      }
    },
    "journal": {
      "surtitre": "Fili · le journal",
      "titre": "Pourquoi le système en est là",
      "chapeau": "Une entrée par décision. La plus récente en haut, et jamais une entrée passée réécrite.",
      "derniereTitre": "La dernière décision",
      "precedentesTitre": "Les décisions précédentes",
      "precedentesAide": "Repliées. Chacune s'ouvre à la demande — elles ne se résument pas, elles se lisent en entier ou pas du tout.",
      "deplier": "Lire l'entrée",
      "replier": "Replier",
      "compte": "{n} décision(s) au journal",
      "trou": "Les quarante-deux premières entrées du journal sont déclarées perdues. Le trou est la trace, et il vaut mieux qu'un journal sans trou qui donnerait à croire qu'il n'a rien perdu.",
      "etats": {
        "chargementAide": "Lecture du journal…",
        "erreurTitre": "Le journal est illisible",
        "erreurCorps": "La mémoire du projet ne se lit pas : {raison}. Aucune entrée n'est reconstituée — une entrée déduite serait un faux indétectable.",
        "erreurAide": "Rétablissez la forme des entrées au dépôt, puis relisez.",
        "videTitre": "Aucune décision",
        "videCorps": "Le journal ne porte encore aucune entrée. La première viendra avec la première décision tracée.",
        "suspenduTitre": "Suspendu",
        "precedentesSuspendues": "L'historique est illisible. La dernière décision, elle, reste lisible — et c'est elle qui compte d'abord."
      }
    },
    "acte": {
      "surtitre": "Fili · l'acte",
      "titre": "Qu'est-ce que cette décision ferme ?",
      "chapeau": "Une décision se juge à ce qu'elle rend impossible, pas à ce qu'elle promet. C'est la première chose qu'on écrit ici, et c'est délibéré.",
      "numeroTitre": "Numéro attribué",
      "numeroAide": "Calculé depuis le journal. Il ne se saisit pas : deux entrées du même numéro rendent un journal illisible.",
      "consequencesLabel": "Ce que la décision ferme",
      "consequencesAide": "Ce qu'elle engage, ce qu'elle rend impossible, la dette qu'elle laisse. Pas ce qu'elle apporte.",
      "resteTitre": "Le reste de l'entrée",
      "resteAide": "Dans l'ordre du journal. Il se remplit après, parce qu'il raconte — et qu'un récit écrit avant son coût le justifie toujours.",
      "contexteLabel": "Contexte — ce qui a rendu la décision nécessaire",
      "decisionLabel": "Décision — ce qui est acté, en une phrase affirmative",
      "sensLabel": "Sens produit et UX — ce que l'utilisateur y gagne",
      "alternativesLabel": "Alternatives écartées, avec le motif du rejet",
      "alternativesAide": "Une décision sans alternative écartée est une décision non instruite.",
      "statutTitre": "Le déplacement de statut",
      "statutAide": "Une décision qui ne déplace rien sur la carte n'a pas eu lieu. Le brouillon porte la ligne à remplacer, ancienne et nouvelle version.",
      "cibleLabel": "La ligne de la carte à déplacer",
      "cibleAide": "Seules les lignes que la carte déclare sont proposées : on ne déplace pas ce qui n'existe pas.",
      "versLabel": "Vers quel statut",
      "verrouTitre": "Le verrou ne se déclare pas, il se mérite",
      "verrouFerme": "Le passage à « Verrouillé » est refusé : {motif}. Ce n'est pas un avis, c'est l'état lu sur le dépôt.",
      "verrouOuvert": "La batterie et le contrôle d'intégrité sont au vert. Le passage à « Verrouillé » est ouvert.",
      "deposer": "Déposer le brouillon",
      "deposerEnCours": "Dépôt en cours…",
      "champsManquants": "Une entrée incomplète ne se dépose pas. Il manque : {champs}.",
      "brouillonsTitre": "Les brouillons déposés",
      "brouillonsAide": "Fili compose, vous intégrez au dépôt. Il n'écrit pas lui-même dans le journal : c'est ce qui garantit qu'une entrée passée reste hors de sa portée.",
      "immuable": "Aucun geste d'édition n'existe sur cet écran, et c'est la règle rendue mécanique : une entrée passée ne se retouche pas parce que le bouton n'existe pas.",
      "etats": {
        "chargementAide": "Écriture du brouillon…",
        "erreurTitre": "L'écriture est refusée",
        "erreurCorps": "Le brouillon n'a pas pu être déposé : {raison}. Le journal et la carte restent intacts — rien n'a été écrit à moitié.",
        "erreurAide": "Rien n'est perdu de ce que vous avez saisi. Réessayez, ou reprenez au dépôt.",
        "videTitre": "Aucun brouillon",
        "videCorps": "Rien n'a encore été composé. Le premier brouillon apparaîtra ici, daté, avec son numéro.",
        "succesTitre": "Brouillon déposé",
        "succesCorps": "Entrée {numero} composée le {date}, avec le déplacement de statut qui l'accompagne. Elle attend votre validation au dépôt.",
        "suspenduTitre": "Suspendu",
        "acteFerme": "La composition est impossible : le journal ou la carte est illisible, et un numéro déduit d'une lecture partielle serait un faux."
      }
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
