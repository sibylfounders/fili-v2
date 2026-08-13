import { messagesFR, type CleMessagesFR } from "@fili/react/validation";

/**
 * LA TABLE DE RÉFÉRENCE — la pédagogie du greffon de validation.
 *
 * Les TEXTES ne sont pas ici : ils vivent dans `@fili/react/validation` (`messagesFR`), et
 * ce fichier ne fait que les désigner par leur code. Une seule implémentation, plusieurs
 * consommateurs — la loi atomique du dépôt vaut aussi pour des chaînes de caractères. Ce
 * qui est ici, et nulle part ailleurs : QUAND une contrainte se déclenche, D'OÙ vient son
 * verdict, et la NUANCE sans laquelle le message serait mal employé.
 */

export type SourceMessage = "native" | "schema" | "business" | "server";

export interface LigneMessage {
  /** Ce qui est vérifié, dit en français. */
  contrainte: string;
  /** Le code STABLE du verdict — c'est lui qui voyage, jamais le texte. */
  code: string;
  source: SourceMessage;
  /** Le jeu de messages dont ce code vient. */
  pack: CleMessagesFR;
  /** La nuance sans laquelle le message serait un contresens. */
  note?: string;
}

export interface TableMessages {
  titre: string;
  pack: CleMessagesFR;
  /** Ce que le contrôle attend, et ce qu'il ne prétend PAS vérifier. */
  sous: string;
  lignes: LigneMessage[];
}

export type FamilleMessages = "Saisie" | "Choix" | "Serveur";

/** Le texte de référence pour une ligne — lu dans le jeu du kit, jamais recopié. */
export const texteDe = (l: LigneMessage): string =>
  messagesFR[l.pack][l.code] ?? messagesFR[l.pack].fallback;

const l = (
  pack: CleMessagesFR,
  contrainte: string,
  code: string,
  source: SourceMessage,
  note?: string,
): LigneMessage => ({ pack, contrainte, code, source, note });

export const MESSAGES: Record<FamilleMessages, TableMessages[]> = {
  Saisie: [
    {
      titre: "Texte libre",
      pack: "texte",
      sous: "Un nom, un titre, une référence. Aucune forme n'est présumée : un prénom ne reçoit pas de regex.",
      lignes: [
        l("texte", "Champ obligatoire, laissé vide", "valueMissing", "native",
          "Nommer la DONNÉE attendue, jamais « Ce champ est requis » — l'utilisateur voit déjà quel champ est en cause."),
        l("texte", "Trop court (minLength)", "tooShort", "native"),
        l("texte", "Trop long (maxLength)", "tooLong", "native",
          "Un compteur de caractères n'est JAMAIS à lui seul un message d'erreur (INPUT-R27)."),
        l("texte", "Forme imposée (pattern), quand elle est réellement connue", "patternMismatch", "native",
          "Toujours donner le format ATTENDU. « Format incorrect » seul est interdit."),
      ],
    },
    {
      titre: "Adresse e-mail — type=\"email\"",
      pack: "email",
      sous: "Le navigateur vérifie la SYNTAXE. Il ne dit ni que l'adresse existe, ni qu'elle reçoit du courrier — ne jamais le laisser croire.",
      lignes: [
        l("email", "Obligatoire, laissé vide", "valueMissing", "native"),
        l("email", "Ce n'est pas une adresse (un numéro de téléphone, un mot…)", "typeMismatch", "native",
          "Le message du navigateur (« Veuillez inclure @… ») dépend de sa langue et de sa version : jamais canonique."),
        l("email", "Domaine refusé par le produit (messagerie jetable, domaine interne exigé)", "domainNotAllowed", "business"),
        l("email", "Adresse déjà enregistrée — le client ne peut pas le savoir", "alreadyUsed", "server",
          "Toujours offrir la SORTIE (se connecter), pas seulement le constat."),
      ],
    },
    {
      titre: "Téléphone — type=\"tel\"",
      pack: "tel",
      sous: "`tel` adapte le clavier ; il NE VALIDE RIEN. Toute vérification de forme vient du produit ou d'une bibliothèque spécialisée — et ne rejette jamais espaces, tirets, parenthèses ou indicatif.",
      lignes: [
        l("tel", "Obligatoire, laissé vide", "valueMissing", "native"),
        l("tel", "Pas assez de chiffres", "tooFewDigits", "business",
          "Compter les CHIFFRES, jamais les caractères : « 06 12 34 56 78 » fait 14 caractères et 10 chiffres."),
        l("tel", "Trop de chiffres", "tooManyDigits", "business"),
        l("tel", "Forme non reconnue pour le pays retenu", "unknownFormat", "business",
          "Donner un EXEMPLE, pas une grammaire. Et jamais une forme mondiale : le format dépend du pays."),
        l("tel", "Numéro qui ne peut pas recevoir de SMS alors que le produit en envoie", "notMobile", "business"),
      ],
    },
    {
      titre: "Adresse web — type=\"url\"",
      pack: "url",
      sous: "Le navigateur exige un protocole. Les restrictions de domaine ou de protocole restent des règles produit.",
      lignes: [
        l("url", "Obligatoire, laissé vide", "valueMissing", "native"),
        l("url", "Ce n'est pas une adresse web", "typeMismatch", "native",
          "Si le protocole est déjà posé par un préfixe (Input.InlineAffix « https:// »), dire « commencez au domaine »."),
        l("url", "Protocole refusé (http en clair)", "insecureScheme", "business"),
      ],
    },
    {
      titre: "Mot de passe",
      pack: "motDePasse",
      sous: "Fili ne prescrit AUCUNE politique de complexité : elle appartient au produit. Il n'en présente que le verdict.",
      lignes: [
        l("motDePasse", "Obligatoire, laissé vide", "valueMissing", "native"),
        l("motDePasse", "Trop court", "tooShort", "native",
          "Annoncer la contrainte AVANT la saisie (helper), pas seulement après l'échec (FORM-R18)."),
        l("motDePasse", "Trop courant / déjà compromis (vérification serveur)", "breached", "server"),
        l("motDePasse", "Faible mais acceptable", "weak", "business",
          "C'est un AVERTISSEMENT (severity: warning) : il ne bloque pas la soumission."),
      ],
    },
    {
      titre: "Quantité — Input.Number",
      pack: "nombre",
      sous: "Réservé à ce qui se CALCULE. Un code postal, un OTP, un numéro de carte sont du texte + inputmode : « number » mange les zéros de tête et accepte « e ».",
      lignes: [
        l("nombre", "Obligatoire, laissé vide", "valueMissing", "native"),
        l("nombre", "Le navigateur n'a pas pu lire la valeur", "badInput", "native",
          "C'est la contrainte la PLUS structurelle : elle passe avant toutes les autres (VALIDATION-R12)."),
        l("nombre", "Sous le minimum", "rangeUnderflow", "native"),
        l("nombre", "Au-dessus du maximum", "rangeOverflow", "native"),
        l("nombre", "Hors du pas déclaré", "stepMismatch", "native",
          "Proposer la valeur valide la plus proche fait le travail de correction à la place de l'utilisateur."),
        l("nombre", "Dépasse le stock — le client ne peut pas le savoir", "outOfStock", "server"),
      ],
    },
    {
      titre: "Texte long — Input.Textarea",
      pack: "texteLong",
      sous: "Mêmes contraintes que le texte libre, avec un compteur qui GUIDE avant la limite (INPUT-R27).",
      lignes: [
        l("texteLong", "Obligatoire, laissé vide", "valueMissing", "native"),
        l("texteLong", "Trop court", "tooShort", "native"),
        l("texteLong", "Trop long", "tooLong", "native", "Dire COMBIEN retirer, pas seulement que c'est trop."),
      ],
    },
  ],

  Choix: [
    {
      titre: "Select",
      pack: "select",
      sous: "Le placeholder n'est jamais une valeur. Le verdict est la SEULE voie vers l'état d'erreur d'un select.",
      lignes: [
        l("select", "Aucune option retenue alors qu'une réponse est obligatoire", "valueMissing", "schema",
          "Reprendre la QUESTION posée par le libellé, pas « Sélection requise »."),
        l("select", "La valeur retenue n'est plus proposée (liste rafraîchie)", "unavailableOption", "business"),
        l("select", "Incompatible avec un autre choix du formulaire", "incompatible", "business",
          "Erreur CROISÉE : elle appartient au groupe des champs concernés, pas au dernier modifié (FORM-R19)."),
      ],
    },
    {
      titre: "Case à cocher isolée",
      pack: "caseSeule",
      sous: "Consentement, confirmation. Une case n'est jamais pré-cochée (CHOICE-R13) ; « indeterminate » n'est pas une valeur validée.",
      lignes: [
        l("caseSeule", "Acceptation obligatoire non cochée", "valueMissing", "schema",
          "Dire la CONSÉQUENCE (« pour continuer ») : c'est ce qui rend l'obligation compréhensible."),
        l("caseSeule", "Confirmation d'un acte irréversible non cochée", "confirmationMissing", "schema"),
      ],
    },
    {
      titre: "Groupe de cases — Checkbox.Group",
      pack: "groupeCases",
      sous: "Aucune contrainte native n'existe pour un ensemble : la cardinalité se calcule sur la sélection. L'erreur appartient au GROUPE (CHOICE-R17).",
      lignes: [
        l("groupeCases", "Rien de sélectionné alors qu'une réponse est obligatoire", "valueMissing", "schema"),
        l("groupeCases", "Pas assez de sélections", "tooFew", "schema"),
        l("groupeCases", "Trop de sélections", "tooMany", "schema"),
        l("groupeCases", "Combinaison interdite par le métier", "incompatible", "business"),
      ],
    },
    {
      titre: "Groupe de radios — Radio.Group",
      pack: "groupeRadios",
      sous: "Un choix exclusif. Le message reprend la question, jamais « Champ obligatoire ».",
      lignes: [
        l("groupeRadios", "Aucune option choisie alors qu'une réponse est obligatoire", "valueMissing", "schema"),
        l("groupeRadios", "L'option retenue a disparu de l'offre", "unavailableOption", "business"),
      ],
    },
  ],

  Serveur: [
    {
      titre: "Erreur serveur ATTACHABLE à un champ",
      pack: "serveurChamp",
      sous: "Elle rejoint la même chaîne qu'un verdict client, et le REMPLACE — elle ne s'empile jamais (FORM-R33). Elle apparaît sous le champ ET dans le résumé.",
      lignes: [
        l("serveurChamp", "Valeur déjà prise (unicité)", "alreadyUsed", "server"),
        l("serveurChamp", "Valeur refusée par une règle que le client ignore", "rejected", "server"),
        l("serveurChamp", "Valeur devenue obsolète pendant la saisie", "stale", "server"),
      ],
    },
    {
      titre: "Erreur GLOBALE de soumission",
      pack: "serveurGlobal",
      sous: "Elle n'appartient à aucun champ : elle est portée par un Alert danger en tête de formulaire, et n'entre pas dans la liste du résumé (FORM-R37).",
      lignes: [
        l("serveurGlobal", "Service indisponible", "unavailable", "server",
          "Toujours dire ce qui est PRÉSERVÉ — c'est la première question que se pose l'utilisateur (FORM-R32)."),
        l("serveurGlobal", "Délai dépassé", "timeout", "server",
          "Si l'envoi a PEUT-ÊTRE abouti, le dire — un doublon coûte plus cher qu'un aveu (FORM-R38)."),
        l("serveurGlobal", "Session expirée", "sessionExpired", "server",
          "Si les réponses ne sont PAS conservées, ne pas le prétendre — le dire avant de perdre le travail (FORM-R35)."),
        l("serveurGlobal", "Succès partiel", "partialSuccess", "server",
          "Ni succès ni erreur : c'est un Alert WARNING (FORM-R40). Les parties réussies ne sont pas resoumises."),
      ],
    },
    {
      titre: "Verdict en attente",
      pack: "attente",
      sous: "Une vérification asynchrone n'est pas un refus : c'est une attente, et elle se dit (FORM-R49/R50).",
      lignes: [
        l("attente", "Vérification en cours sur le champ", "pending", "server",
          "État `validating` : aria-busy sur le champ, statut visuel NEUTRE — un champ en attente n'est ni bon ni mauvais."),
        l("attente", "Soumission demandée pendant une vérification", "pendingSubmit", "server",
          "Le formulaire attend le verdict ou revalide — jamais un envoi qui ne répond rien."),
      ],
    },
  ],
};

/** Ce qu'un produit colle chez lui : le greffon fournit déjà le jeu, il n'y a rien à retaper. */
export function extraitCode(famille: FamilleMessages): string {
  const packs = [...new Set(MESSAGES[famille].map((t) => t.pack))];
  return `// Le contrat ne code aucun texte : il en RÉCLAME. Le greffon en fournit un jeu.
import { Validation, messagesFR } from "@fili/react/validation";

// ${packs.map((p) => `messagesFR.${p}`).join(" · ")}
const verdict = Validation.fromValidity("courriel", el.validity, el.value, messagesFR.${packs[0]});
// → { state: "invalid", issue: { code: "typeMismatch", message: "Saisissez une adresse…" } }

// Un jeu se surcharge sans être recopié : on garde le repli, on remplace ce qu'on veut.
const aMoi = { ...messagesFR.${packs[0]}, valueMissing: "Ce champ nous est nécessaire." };`;
}
