/**
 * JEU DE MESSAGES FRANÇAIS — la charge utile du greffon de validation.
 *
 * Le CONTRAT (`lib/validation`) ne code aucune chaîne de langue naturelle : il en réclame.
 * C'est ce qui le rend traduisible et portable. Ce fichier est l'autre moitié : le wording
 * que Fili recommande, livré à part, sous un point d'entrée à part (`@fili/react/validation`).
 * Un produit l'adopte, l'adapte, ou le remplace entièrement — le noyau du kit ne le charge
 * jamais tout seul.
 *
 * Ce qu'il applique, il ne l'invente pas :
 *   - INPUT-R23 : dire *pourquoi* ET *comment corriger*. « Format incorrect » sans le format
 *     attendu ne fait pas le travail.
 *   - VOICE : s'adresser à la personne, ne pas l'accuser. « Saisissez une adresse au format
 *     nom@domaine.fr », jamais « Vous avez saisi une adresse invalide ».
 *   - INPUT-R31 : la qualification (« Erreur : ») est posée par le COMPOSANT — aucun message
 *     d'ici ne commence par « Erreur ».
 *   - VALIDATION-R11 : chaque texte est écrit pour être lu SEUL, jamais empilé avec un autre.
 *
 * `{accolades}` : interpolées par `Validation.format` depuis `issue.params`.
 * `fallback` : OBLIGATOIRE partout — une erreur muette est pire qu'une erreur mal dite.
 */

/** Un jeu de messages : code stable → texte, avec un repli garanti. */
export type MessagePack = Readonly<Record<string, string>> & { readonly fallback: string };

/* ── SAISIE ────────────────────────────────────────────────────────────────── */

/** Texte libre — aucune forme présumée : un prénom ne reçoit pas de regex. */
const texte: MessagePack = {
  valueMissing: "Saisissez votre nom.",
  tooShort: "Ce nom est trop court : il en faut au moins {min} caractères.",
  tooLong: "Ce nom dépasse {max} caractères : raccourcissez-le.",
  patternMismatch: "Le format attendu est AB-1234.",
  fallback: "Cette valeur ne peut pas être acceptée.",
};

/** E-mail — le navigateur vérifie la SYNTAXE, jamais l'existence de l'adresse. */
const email: MessagePack = {
  valueMissing: "Saisissez votre adresse e-mail.",
  typeMismatch: "Saisissez une adresse au format nom@domaine.fr",
  domainNotAllowed: "Cette messagerie n'est pas acceptée : utilisez votre adresse professionnelle.",
  alreadyUsed: "Cette adresse est déjà utilisée. Connectez-vous, ou saisissez-en une autre.",
  fallback: "Cette adresse ne peut pas être acceptée.",
};

/**
 * Téléphone — `type="tel"` adapte le clavier, il NE VALIDE RIEN. Ces codes sont métier :
 * le format admissible vient du produit ou d'une bibliothèque spécialisée, et ne rejette
 * jamais espaces, tirets, parenthèses ou indicatif.
 */
const tel: MessagePack = {
  valueMissing: "Saisissez un numéro de téléphone.",
  tooFewDigits: "Ce numéro est incomplet : un numéro français compte 10 chiffres, il en manque {manquants}.",
  tooManyDigits: "Ce numéro compte {compte} chiffres : vérifiez, un numéro français en a 10.",
  unknownFormat: "Ce numéro n'est pas reconnu. Exemple attendu : 06 12 34 56 78 ou +33 6 12 34 56 78.",
  notMobile: "Ce numéro ne peut pas recevoir de SMS : indiquez un numéro de mobile.",
  fallback: "Ce numéro ne peut pas être accepté.",
};

const url: MessagePack = {
  valueMissing: "Saisissez l'adresse de votre site.",
  typeMismatch: "Saisissez une adresse de la forme https://exemple.fr/page",
  insecureScheme: "Seules les adresses en https sont acceptées.",
  fallback: "Cette adresse ne peut pas être acceptée.",
};

/** Mot de passe — Fili ne prescrit AUCUNE politique de complexité ; elle appartient au produit. */
const motDePasse: MessagePack = {
  valueMissing: "Saisissez un mot de passe.",
  tooShort: "Il manque {manquants} caractères : douze au minimum.",
  breached: "Ce mot de passe figure dans des fuites connues : choisissez-en un autre.",
  weak: "Ce mot de passe reste faible : un mot de passe plus long protège mieux votre compte.",
  fallback: "Ce mot de passe ne peut pas être accepté.",
};

/** Quantité — réservé à ce qui se CALCULE (un code postal, un OTP sont du texte). */
const nombre: MessagePack = {
  valueMissing: "Indiquez une quantité.",
  badInput: "Saisissez un nombre.",
  rangeUnderflow: "Le minimum est {min}.",
  rangeOverflow: "Le maximum est {max}.",
  stepMismatch: "Cette quantité se commande par {step} : essayez {proche}.",
  outOfStock: "Il ne reste que {disponible} articles : ajustez la quantité.",
  fallback: "Cette quantité ne peut pas être acceptée.",
};

const texteLong: MessagePack = {
  valueMissing: "Écrivez votre message.",
  tooShort: "Ce message est très court : décrivez votre demande en quelques phrases.",
  tooLong: "Ce message dépasse {max} caractères : il en faut {excedent} de moins.",
  fallback: "Ce message ne peut pas être accepté.",
};

/* ── CHOIX ─────────────────────────────────────────────────────────────────── */

/** Le placeholder n'est jamais une valeur. Le message reprend la QUESTION posée. */
const select: MessagePack = {
  valueMissing: "Choisissez la langue de l'interface.",
  unavailableOption: "Cette option n'est plus proposée : choisissez-en une autre.",
  incompatible: "Cette formule n'est pas disponible pour le pays sélectionné.",
  fallback: "Ce choix ne peut pas être retenu.",
};

/** Case isolée : consentement, confirmation. Jamais pré-cochée (CHOICE-R13). */
const caseSeule: MessagePack = {
  valueMissing: "Vous devez accepter les conditions d'utilisation pour continuer.",
  confirmationMissing: "Confirmez la suppression pour pouvoir la lancer.",
  fallback: "Cette case doit être cochée pour continuer.",
};

/** Groupe de cases : aucune contrainte native n'existe pour un ensemble (CHOICE-R17). */
const groupeCases: MessagePack = {
  valueMissing: "Choisissez au moins un centre d'intérêt.",
  tooFew: "Choisissez au moins {min} centres d'intérêt : il en manque {manquants}.",
  tooMany: "Vous pouvez en retenir {max} au maximum : désélectionnez-en {excedent}.",
  incompatible: "« Aucun de ces sujets » ne se combine avec un autre choix.",
  fallback: "Cette sélection ne peut pas être retenue.",
};

const groupeRadios: MessagePack = {
  valueMissing: "Choisissez une formule pour continuer.",
  unavailableOption: "Cette formule n'est plus proposée : choisissez-en une autre.",
  fallback: "Cette réponse ne peut pas être retenue.",
};

/* ── SERVEUR ───────────────────────────────────────────────────────────────── */

/** Verdicts serveur ATTACHABLES à un champ : ils rejoignent la même chaîne (FORM-R33). */
const serveurChamp: MessagePack = {
  alreadyUsed: "Cette adresse est déjà utilisée. Connectez-vous, ou saisissez-en une autre.",
  rejected: "Ce code promotionnel n'est plus valable : vérifiez la date d'expiration.",
  stale: "Ce créneau vient d'être réservé : choisissez-en un autre.",
  fallback: "Cette valeur a été refusée. Modifiez-la et réessayez.",
};

/** Erreurs GLOBALES : portées par un Alert en tête de formulaire, hors du résumé (FORM-R37). */
const serveurGlobal: MessagePack = {
  unavailable: "Le service est momentanément indisponible. Vos réponses sont conservées : réessayez dans un instant.",
  timeout: "L'envoi a pris trop de temps. Vos réponses sont conservées : réessayez.",
  sessionExpired: "Votre session a expiré. Reconnectez-vous : vos réponses sont conservées.",
  partialSuccess: "{réussis} lignes sur {total} ont été importées. Les {restantes} autres sont à corriger ci-dessous.",
  fallback: "L'envoi n'a pas abouti. Vos réponses sont conservées : réessayez.",
};

/** Attente : ce n'est pas un refus, c'est un délai — et il se dit (FORM-R49/R50). */
const attente: MessagePack = {
  pending: "Vérification de la disponibilité…",
  pendingSubmit: "Vérification en cours, un instant…",
  fallback: "Vérification en cours…",
};

/**
 * Le jeu complet. Chaque entrée se passe telle quelle à `Validation.fromValidity`,
 * `Validation.fromSelection` ou `Validation.format`.
 */
export const messagesFR = {
  texte,
  email,
  tel,
  url,
  motDePasse,
  nombre,
  texteLong,
  select,
  caseSeule,
  groupeCases,
  groupeRadios,
  serveurChamp,
  serveurGlobal,
  attente,
} as const;

export type CleMessagesFR = keyof typeof messagesFR;
