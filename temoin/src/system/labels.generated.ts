/* GÉNÉRÉ depuis fili/libelles.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-libelles.mjs
   Le catalogue est la source ; ce fichier n'en est que la traduction. */

export const LABELS = {
  "product": {
    "name": "Fili",
    "baseline": "Le poste depuis lequel l'état du système se lit et se tranche."
  },
  "common": {
    "actions": {
      "recordTheRun": "Consigner ce run",
      "recordInCourse": "Consignation en cours…",
      "retry": "Relancer la lecture",
      "openTheFinding": "Ouvrir le constat",
      "gobackAtVerdict": "Revenir au verdict",
      "judgeTheWitness": "Juger ce témoin",
      "gobackAThereFamily": "Revenir à la famille"
    },
    "statuses": {
      "lock": "Verrouillé",
      "waiting": "En cours",
      "idea": "Idée",
      "refusal": "Refus de statuer",
      "accepted": "Accepté",
      "refused": "Refusé",
      "aJudge": "À juger"
    },
    "measures": {
      "integrity": "Intégrité du juge",
      "fixturesTrapped": "Pièges bloqués",
      "fixturesCompliant": "Conformes passants",
      "mutations": "Sabotages détectés",
      "assertions": "Assertions portées",
      "missing": "non mesuré dans ce run"
    }
  },
  "screens": {
    "verdict": {
      "kicker": "Fili · le verdict du dépôt",
      "heading": "Le juge est-il entier, et le dépôt tient-il ?",
      "lede": "L'intégrité d'abord : tant que les assertions déclarées ne sont pas toutes portées et actives, aucun verdict n'est prononçable. La batterie ne vient qu'ensuite.",
      "integrityHeading": "Intégrité du juge",
      "integrityHelp": "Le résultat ne vaut que ce que vaut le juge. Ce compte dit combien de règles il applique vraiment.",
      "integrityWhole": "Les {n} assertions déclarées sont portées et actives.",
      "integrityBroken": "{n} assertion(s) déclarée(s) ne sont pas portées ou sont éteintes.",
      "batteryHeading": "La batterie",
      "batteryGreen": "Aucun écart. Les cinq Sujets tiennent.",
      "batteryRed": "{n} écart(s). Le dépôt ne passe pas.",
      "findingsHeading": "Ce qui rougit",
      "findingsHelp": "Une assertion qui rougit désigne une décision de doctrine, pas un fichier. Le fichier n'arrive qu'en troisième.",
      "lastRunsHeading": "Le dernier run consigné",
      "instructionHeading": "Consigner",
      "instructionHelp": "Un run consigné devient une pièce du dépôt. Il ne se réécrit pas.",
      "states": {
        "loading": "Batterie en cours — {faites} épreuves sur {total}.",
        "loadingHelp": "La durée réelle s'affiche parce qu'un compte qui avance dit quelque chose qu'un rond qui tourne ne dit pas.",
        "errorHeading": "Refus de statuer",
        "errorBody": "Le juge n'est pas entier : {raison}. La batterie ne rend pas de verdict sur un juge incomplet, et la consignation reste fermée.",
        "errorHelp": "Ceci n'est pas une panne technique. C'est un verdict à part entière — le seul que le système accepte de prononcer dans cet état.",
        "emptyHeading": "Aucun run consigné à ce jour",
        "emptyBody": "Le premier run consigné ouvrira la lignée. Lancez la batterie pour en produire un.",
        "successHeading": "Run consigné",
        "successBody": "Daté du {date}. Il est désormais une pièce du dépôt.",
        "suspendedHeading": "Suspendu",
        "batterySuspended": "La batterie n'a pas été jouée : le juge n'est pas entier. Ce qui manque ici n'est pas un résultat, c'est le droit d'en produire un.",
        "findingsSuspended": "Aucun constat n'est lisible tant qu'aucun verdict n'a été rendu. Le détail viendra après le droit de statuer, jamais avant.",
        "instructionClosed": "La consignation est fermée. On ne consigne pas un verdict qu'on n'a pas mérité."
      }
    },
    "finding": {
      "kicker": "Fili · le constat",
      "heading": "{assertion} — ce qu'elle interdit, et pourquoi",
      "contractHeading": "D'où elle vient",
      "reasonHeading": "Ce qu'elle protège",
      "occurrencesHeading": "Où elle rougit",
      "occurrencesCount": "{n} occurrence(s), dans {f} fichier(s).",
      "ruptureHeading": "Ce qu'une rupture déclarée ne lève jamais",
      "states": {
        "loading": "Lecture du détail de {assertion}…",
        "errorHeading": "Le constat est illisible",
        "errorBody": "La source du constat ne répond pas : {raison}. L'assertion reste rouge ; ce qui manque, c'est le détail, pas le verdict.",
        "emptyHeading": "Aucune occurrence",
        "emptyBody": "{assertion} est au vert. Rien à corriger — et rien à célébrer : c'est l'état attendu.",
        "suspendedHeading": "Suspendu",
        "occurrencesSuspended": "La liste des occurrences est illisible. L'assertion, elle, reste lisible — et c'est elle qui compte d'abord."
      },
      "reasonHelp": "Une assertion n'existe pas pour être satisfaite : elle existe pour empêcher une classe de défaut de revenir. C'est cela qu'on lit d'abord.",
      "ruptureBody": "La rupture déclarée porte sur la forme et les valeurs. Elle ne lève jamais le clavier, la hiérarchie de titres, le sens du flux, l'annonce d'un état, le contraste ni le mouvement.",
      "occurrenceFile": "{fichier} — ligne {ligne}",
      "occurrencesHelp": "Le fichier n'arrive qu'en troisième. Ce qui précède dit pourquoi la règle existe ; ce qui suit dit seulement où elle a été rencontrée."
    },
    "family": {
      "kicker": "Fili · les témoins",
      "heading": "Ce que le produit donne à voir, gabarit par gabarit",
      "lede": "Chaque gabarit porte un témoin courant, rendu depuis la source que le Gardien a vérifiée. C'est lui qui se juge ; les précédents restent consultables.",
      "currentHeading": "Le témoin courant",
      "historyHeading": "Les générations précédentes",
      "historyHelp": "Une génération par date. Le passage à la suivante ne s'obtient pas en effaçant la précédente.",
      "statesCount": "{n} état(s) rendu(s)",
      "unreadable": "Ce témoin ne s'ouvre pas. Il est signalé ici plutôt que masqué : un gabarit sans témoin lisible est un gabarit qu'on ne peut pas juger.",
      "openTheFaceAFace": "Juger ce témoin",
      "states": {
        "loadingHelp": "Lecture de la famille des témoins…",
        "errorHeading": "La famille des témoins est illisible",
        "errorBody": "Le dossier des témoins ne répond pas : {raison}. Aucun jugement n'est possible tant qu'on ne sait pas ce qu'on juge.",
        "errorHelp": "Rejouez le rendu des témoins au dépôt, puis relisez.",
        "emptyHeading": "Aucun témoin pour ce gabarit",
        "emptyBody": "Ce gabarit n'a encore rien rendu. Il en portera un dès que la chaîne de rendu aura tourné sur sa source.",
        "suspendedHeading": "Suspendu",
        "historySuspended": "L'historique est illisible. Le témoin courant, lui, reste lisible — et c'est lui qui se juge."
      }
    },
    "faceAFace": {
      "kicker": "Fili · le jugement",
      "heading": "Le témoin en jugement",
      "lede": "Le témoin est rendu depuis la source vérifiée. La bascule met le précédent à la même place, pour que l'œil compare de mémoire et non de gauche à droite.",
      "toggle": {
        "toPrevious": "Voir la génération précédente",
        "toCurrent": "Revenir au témoin jugé",
        "brandCurrent": "Génération jugée — {date}",
        "brandPrevious": "Génération précédente — {date}"
      },
      "metaHeading": "Ce que porte ce témoin",
      "metaTemplate": "Template",
      "metaDate": "Génération",
      "metaStates": "États rendus",
      "metaBattery": "État de la batterie au rendu",
      "actHeading": "Le verdict",
      "actHelp": "Le verdict est binaire. Une signature qui demande une hésitation n'est pas perceptible : l'hésitation se lit comme un refus.",
      "accept": "Accepter — ce témoin devient la référence",
      "refuse": "Refuser",
      "refuseInCourse": "Enregistrement du refus…",
      "acceptInCourse": "Enregistrement de l'acceptation…",
      "reasonLabel": "Ce qui a motivé le refus",
      "reasonHelp": "Un refus sans motif écrit ne se relit pas. Nommez ce qui n'allait pas, pas ce qu'il faudrait faire.",
      "reasonEmpty": "Un motif est nécessaire pour refuser.",
      "states": {
        "loadingHelp": "Rendu du témoin depuis la source vérifiée…",
        "errorHeading": "Le rendu a échoué",
        "errorBody": "Le témoin n'a pas pu être rendu depuis sa source : {raison}. Aucune image de secours n'est affichée à la place — juger une capture au lieu du rendu vérifié annulerait le sens du témoin.",
        "errorHelp": "Rejouez le rendu au dépôt, puis rouvrez ce face-à-face.",
        "emptyHeading": "Premier témoin de ce gabarit",
        "emptyBody": "Il n'existe pas de génération précédente. Le témoin se juge seul, sans comparaison — et c'est le cas le plus exigeant.",
        "successHeading": "Verdict enregistré",
        "successBody": "Verdict déposé le {date}, à côté du témoin qu'il juge. Il ne se réécrit pas.",
        "suspendedHeading": "Suspendu",
        "actClosed": "Le verdict ne peut pas être déposé : la pièce qui le reçoit est illisible."
      },
      "frameHeading": "{gabarit} — génération {date}"
    },
    "card": {
      "kicker": "Fili · la carte",
      "heading": "Où en est le système, et ce qui bloque la suite",
      "lede": "Cette carte décrit le présent. Elle ne raconte pas comment on y est arrivé — c'est le journal qui le fait.",
      "nextHeading": "Le prochain jalon",
      "nextBlocked": "Ce qui le bloque",
      "nextFree": "Rien ne le bloque : il est ouvrable.",
      "milestonesHeading": "Le chapitre",
      "contractsHeading": "Les contrats du corpus",
      "templatesHeading": "Les sept gabarits",
      "instrumentHeading": "L'instrument de la Voie B",
      "debtsHeading": "Les dettes",
      "debtsHelp": "Une dette fermée reste écrite : ce qui a coûté quelque chose ne s'efface pas de la carte.",
      "columnStatus": "Statut",
      "states": {
        "loadingHelp": "Lecture de la carte…",
        "errorHeading": "La carte n'a pas la forme déclarée",
        "errorBody": "Elle est lisible par un humain, pas par le producteur : {raison}. Rien n'est affiché plutôt qu'une carte partielle — une carte incomplète se lit comme un système incomplet.",
        "errorHelp": "Rétablissez la forme des tableaux au dépôt, puis relisez.",
        "emptyHeading": "Aucune carte",
        "emptyBody": "Le document de carte n'existe pas encore. Il en portera un dès qu'un jalon sera déclaré.",
        "suspendedHeading": "Suspendu",
        "debtSuspended": "La liste des dettes est illisible. Le reste de la carte, lui, se lit — et c'est le prochain jalon qui compte d'abord."
      }
    },
    "journal": {
      "kicker": "Fili · le journal",
      "heading": "Pourquoi le système en est là",
      "lede": "Une entrée par décision. La plus récente en haut, et jamais une entrée passée réécrite.",
      "lastOneHeading": "La dernière décision",
      "previousHeading": "Les décisions précédentes",
      "previousHelp": "Repliées. Chacune s'ouvre à la demande — elles ne se résument pas, elles se lisent en entier ou pas du tout.",
      "unfold": "Lire l'entrée",
      "fold": "Replier",
      "count": "{n} décision(s) au journal",
      "hole": "Les quarante-deux premières entrées du journal sont déclarées perdues. Le trou est la trace, et il vaut mieux qu'un journal sans trou qui donnerait à croire qu'il n'a rien perdu.",
      "states": {
        "loadingHelp": "Lecture du journal…",
        "errorHeading": "Le journal est illisible",
        "errorBody": "La mémoire du projet ne se lit pas : {raison}. Aucune entrée n'est reconstituée — une entrée déduite serait un faux indétectable.",
        "errorHelp": "Rétablissez la forme des entrées au dépôt, puis relisez.",
        "emptyHeading": "Aucune décision",
        "emptyBody": "Le journal ne porte encore aucune entrée. La première viendra avec la première décision tracée.",
        "suspendedHeading": "Suspendu",
        "previousSuspended": "L'historique est illisible. La dernière décision, elle, reste lisible — et c'est elle qui compte d'abord."
      }
    },
    "act": {
      "kicker": "Fili · l'acte",
      "heading": "Qu'est-ce que cette décision ferme ?",
      "lede": "Une décision se juge à ce qu'elle rend impossible, pas à ce qu'elle promet. C'est la première chose qu'on écrit ici, et c'est délibéré.",
      "numberHeading": "Numéro attribué",
      "numberHelp": "Calculé depuis le journal. Il ne se saisit pas : deux entrées du même numéro rendent un journal illisible.",
      "consequencesLabel": "Ce que la décision ferme",
      "consequencesHelp": "Ce qu'elle engage, ce qu'elle rend impossible, la dette qu'elle laisse. Pas ce qu'elle apporte.",
      "restHeading": "Le reste de l'entrée",
      "restHelp": "Dans l'ordre du journal. Il se remplit après, parce qu'il raconte — et qu'un récit écrit avant son coût le justifie toujours.",
      "contextLabel": "Contexte — ce qui a rendu la décision nécessaire",
      "decisionLabel": "Décision — ce qui est acté, en une phrase affirmative",
      "directionLabel": "Sens produit et UX — ce que l'utilisateur y gagne",
      "alternativesLabel": "Alternatives écartées, avec le motif du rejet",
      "alternativesHelp": "Une décision sans alternative écartée est une décision non instruite.",
      "statusHeading": "Le déplacement de statut",
      "statusHelp": "Une décision qui ne déplace rien sur la carte n'a pas eu lieu. Le brouillon porte la ligne à remplacer, ancienne et nouvelle version.",
      "targetLabel": "La ligne de la carte à déplacer",
      "targetHelp": "Seules les lignes que la carte déclare sont proposées : on ne déplace pas ce qui n'existe pas.",
      "toLabel": "Vers quel statut",
      "lockHeading": "Le verrou ne se déclare pas, il se mérite",
      "lockClosed": "Le passage à « Verrouillé » est refusé : {motif}. Ce n'est pas un avis, c'est l'état lu sur le dépôt.",
      "lockOpen": "La batterie et le contrôle d'intégrité sont au vert. Le passage à « Verrouillé » est ouvert.",
      "drop": "Déposer le brouillon",
      "dropInCourse": "Dépôt en cours…",
      "fieldsMissing": "Une entrée incomplète ne se dépose pas. Il manque : {champs}.",
      "draftsHeading": "Les brouillons déposés",
      "draftsHelp": "Fili compose, vous intégrez au dépôt. Il n'écrit pas lui-même dans le journal : c'est ce qui garantit qu'une entrée passée reste hors de sa portée.",
      "immutable": "Aucun geste d'édition n'existe sur cet écran, et c'est la règle rendue mécanique : une entrée passée ne se retouche pas parce que le bouton n'existe pas.",
      "states": {
        "loadingHelp": "Écriture du brouillon…",
        "errorHeading": "L'écriture est refusée",
        "errorBody": "Le brouillon n'a pas pu être déposé : {raison}. Le journal et la carte restent intacts — rien n'a été écrit à moitié.",
        "errorHelp": "Rien n'est perdu de ce que vous avez saisi. Réessayez, ou reprenez au dépôt.",
        "emptyHeading": "Aucun brouillon",
        "emptyBody": "Rien n'a encore été composé. Le premier brouillon apparaîtra ici, daté, avec son numéro.",
        "successHeading": "Brouillon déposé",
        "successBody": "Entrée {numero} composée le {date}, avec le déplacement de statut qui l'accompagne. Elle attend votre validation au dépôt.",
        "suspendedHeading": "Suspendu",
        "actClosed": "La composition est impossible : le journal ou la carte est illisible, et un numéro déduit d'une lecture partielle serait un faux."
      }
    }
  }
} as const

/* Un libellé porteur d'une valeur la reçoit ici, jamais par concaténation sur
   place : une phrase coupée en morceaux ne se relit plus d'un bloc. */
export function phrase(model: string, values: Record<string, string | number>): string {
  return model.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole
  )
}
