/**
 * VALIDATION ET RÉCUPÉRATION — le contrat atomique.
 *
 * Une seule implémentation produit le VERDICT ; tout le reste en dérive. Ce module ne
 * connaît ni React, ni le DOM, ni une couleur : il n'importe rien. C'est la condition
 * pour que la même mécanique serve `Input`, `Select`, `Checkbox`, `Radio` et le
 * formulaire qui les agrège, sans qu'aucun ne recopie la logique de l'autre.
 *
 * Ce qu'il garantit (doctrine `principles/VALIDATION-UX.md`) :
 *   - le verdict existe indépendamment de la couleur — `statusFromVerdict` PROJETTE, il
 *     n'établit rien ;
 *   - `error` = la valeur ne peut pas être acceptée ; `warning` = elle reste acceptable ;
 *   - `validating` = un verdict asynchrone est attendu ; `pristine` ≠ valide ;
 *   - le message affiché et celui du résumé sortent du MÊME objet (`ValidationIssue`) ;
 *   - un verdict caduc cesse de FAIRE AUTORITÉ sans cesser de s'AFFICHER (`stale`) ;
 *   - le serveur fait foi (`reconcile`, FORM-R33) ;
 *   - la soumission se décide sur des verdicts (`submissionGate`), jamais sur une classe.
 *
 * Ce qu'il ne fait PAS, et ne fera pas : CHOISIR quand valider (c'est le formulaire, au cas
 * par cas — FORM-R15/R16 ; le contrat l'OUTILLE avec `shouldValidate`, il n'impose rien),
 * inventer une contrainte métier (c'est le produit), écrire un message (c'est l'appelant —
 * aucune chaîne de langue naturelle n'est codée en dur ici).
 */

/* ── 1. Vocabulaire ─────────────────────────────────────────────────────────── */

/**
 * D'où vient le verdict. L'ordre de cette union n'a aucune valeur : la priorité
 * d'affichage est déclarée séparément (`RANG_SOURCE`), pour qu'elle soit lisible.
 */
export type ValidationSource = "native" | "schema" | "business" | "server";

/**
 * `error` bloque la soumission. `warning` ne la bloque jamais — un avertissement qui
 * empêche d'avancer est une erreur mal nommée.
 */
export type ValidationSeverity = "error" | "warning";

/**
 * Le grief, indépendant de tout rendu. C'est l'unité que le message local ET le résumé
 * d'erreurs citent — jamais deux textes pour un même problème (FORM-R23).
 *
 * `field` est l'identifiant logique du contrôle ou du GROUPE (un groupe de cases porte
 * son propre grief — CHOICE-R17), pas l'`id` DOM : le formulaire fait le lien.
 */
export interface ValidationIssue {
  /** Code STABLE, indépendant du navigateur et de la langue. */
  code: string;
  field: string;
  source: ValidationSource;
  severity: ValidationSeverity;
  /** Texte destiné à l'humain, fourni par l'appelant. Jamais `validationMessage` du navigateur. */
  message: string;
  params?: Record<string, string | number>;
}

/**
 * Le verdict d'UN contrôle (ou d'un groupe).
 *
 * `value` est la SIGNATURE de la valeur sur laquelle le verdict a été rendu. C'est elle
 * qui rend l'obsolescence calculable : un verdict rendu sur « 06 12 34 56 78 » n'a rien à
 * dire de « nom@domaine.fr » (FORM-R51). Un verdict sans signature ne périme jamais — ce
 * qui est le comportement juste pour un verdict d'ensemble.
 */
export type ValidationVerdict =
  | { readonly state: "pristine" }
  | { readonly state: "validating"; readonly value?: string }
  | { readonly state: "valid"; readonly value?: string }
  | { readonly state: "invalid"; readonly issue: ValidationIssue; readonly value?: string; readonly obsolete?: true }
  | { readonly state: "warning"; readonly issue: ValidationIssue; readonly value?: string; readonly obsolete?: true };

/**
 * `obsolete` — le verdict porte sur une valeur qui n'existe plus. Il cesse de FAIRE AUTORITÉ
 * (il ne bloque plus rien : il ne prouve rien de la valeur courante) mais il reste AFFICHÉ
 * jusqu'à sa revalidation.
 *
 * Arbitrage Aurélien du 2026-07-30 : retirer le message au premier caractère retire
 * l'instruction au moment précis où elle sert. Quelqu'un qui arrive d'un lien du résumé doit
 * pouvoir LIRE ce qu'il corrige pendant qu'il le corrige (FORM-R27). Rien ne bouge tant que
 * le champ n'a pas été re-jugé — au blur, ou à la soumission suivante.
 */

/** Verdict d'un contrôle jamais touché. N'est PAS « valide » : rien n'a été vérifié. */
export const PRISTINE: ValidationVerdict = Object.freeze({ state: "pristine" as const });

export const validating = (value?: string): ValidationVerdict =>
  Object.freeze({ state: "validating" as const, value });
export const valid = (value?: string): ValidationVerdict =>
  Object.freeze({ state: "valid" as const, value });
export const invalid = (issue: ValidationIssue, value?: string): ValidationVerdict =>
  Object.freeze({ state: "invalid" as const, issue: Object.freeze({ ...issue }), value });
export const warning = (issue: ValidationIssue, value?: string): ValidationVerdict =>
  Object.freeze({ state: "warning" as const, issue: Object.freeze({ ...issue, severity: "warning" as const }), value });

/* ── 2. Contraintes natives ─────────────────────────────────────────────────── */

/**
 * Les dix drapeaux de `ValidityState`, dans l'ordre de PRIORITÉ retenu (voir plus bas).
 * On les normalise en codes stables : le `validationMessage` du navigateur, lui, dépend
 * du navigateur ET de sa langue — il ne peut pas être le message canonique du système.
 */
export const NATIVE_CODES = [
  "badInput",
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "tooShort",
  "tooLong",
  "rangeUnderflow",
  "rangeOverflow",
  "stepMismatch",
  "customError",
] as const;
export type NativeCode = (typeof NATIVE_CODES)[number];

/**
 * Forme MINIMALE lue d'un `ValidityState` réel — structurelle, donc un vrai
 * `input.validity` est accepté tel quel, et un test n'a pas besoin d'un DOM.
 */
export type ValidityFlags = Partial<Record<NativeCode, boolean>> & { valid?: boolean };

/**
 * PRIORITÉ NATIVE — déterministe et documentée (§4 du cadrage) :
 *
 *   badInput      le navigateur n'a même pas pu lire la valeur : rien d'autre n'a de sens
 *   valueMissing  il n'y a rien à juger
 *   typeMismatch  la NATURE est fausse — juger sa longueur serait du bruit
 *   patternMismatch
 *   tooShort / tooLong          la forme est bonne, la taille non
 *   rangeUnderflow / rangeOverflow / stepMismatch   le domaine numérique
 *   customError   posé par le produit via setCustomValidity — le moins structurel
 *
 * Renvoie `null` si aucun drapeau n'est levé (c'est-à-dire : rien à reprocher).
 */
export function nativeCode(validity: ValidityFlags): NativeCode | null {
  for (const code of NATIVE_CODES) if (validity[code]) return code;
  return null;
}

/**
 * Messages des verdicts natifs. `fallback` est OBLIGATOIRE : sans lui, un code non
 * traduit produirait un message vide, et une erreur muette est pire qu'une erreur mal
 * dite. Aucune langue n'est décidée ici — tout vient de l'appelant.
 */
export type NativeMessages = Partial<Record<NativeCode, string>> & { fallback: string };

/** `{ min }` → la valeur de `params.min`. Laisse le motif intact si la clé manque. */
export function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (tout, cle: string) =>
    Object.prototype.hasOwnProperty.call(params, cle) ? String(params[cle]) : tout,
  );
}

/**
 * Verdict d'un contrôle natif, à partir de son `validity` et de sa valeur.
 * `value` sert de signature d'obsolescence — c'est ce qui fait disparaître une erreur
 * devenue caduque dès la correction.
 */
export function verdictFromValidity(
  field: string,
  validity: ValidityFlags,
  value: string,
  messages: NativeMessages,
  params?: Record<string, string | number>,
): ValidationVerdict {
  const code = nativeCode(validity);
  if (!code) return valid(value);
  return invalid(
    {
      code,
      field,
      source: "native",
      severity: "error",
      message: format(messages[code] ?? messages.fallback, params),
      ...(params ? { params } : {}),
    },
    value,
  );
}

/* ── 3. Cardinalité d'un groupe ─────────────────────────────────────────────── */

/** Codes stables des contraintes de CARDINALITÉ (Checkbox.Group, Radio.Group). */
export type CardinalityCode = "valueMissing" | "tooFew" | "tooMany";
export type CardinalityMessages = Partial<Record<CardinalityCode, string>> & { fallback: string };

export interface CardinalityConstraints {
  /** Une réponse est obligatoire. */
  required?: boolean;
  /** Nombre MINIMAL de sélections exigé (implique `required`). */
  min?: number;
  /** Nombre MAXIMAL de sélections toléré. */
  max?: number;
}

/**
 * Verdict d'un groupe à partir de sa sélection. Le groupe porte le grief, jamais la
 * première option (CHOICE-R17). La signature d'obsolescence est la sélection sérialisée
 * de façon INJECTIVE (`JSON.stringify`) — un `join("|")` ne l'est pas.
 */
export function verdictFromSelection(
  field: string,
  selection: readonly string[],
  constraints: CardinalityConstraints,
  messages: CardinalityMessages,
): ValidationVerdict {
  const value = JSON.stringify(selection);
  const n = selection.length;
  const { required, min, max } = constraints;
  const dit = (code: CardinalityCode, params?: Record<string, string | number>) =>
    invalid(
      {
        code,
        field,
        source: "schema",
        severity: "error",
        message: format(messages[code] ?? messages.fallback, params),
        ...(params ? { params } : {}),
      },
      value,
    );
  if (n === 0 && (required || (min ?? 0) > 0)) return dit("valueMissing");
  if (min != null && n < min) return dit("tooFew", { min, count: n });
  if (max != null && n > max) return dit("tooMany", { max, count: n });
  return valid(value);
}

/* ── 4. Verdicts externes (schéma, métier, serveur) ─────────────────────────── */

/**
 * Verdict venu d'ailleurs — un schéma applicatif, une règle métier, une réponse serveur.
 * Fili NORMALISE et PRÉSENTE ; il n'invente aucune de ces contraintes.
 */
export function verdictFromIssue(issue: ValidationIssue, value?: string): ValidationVerdict {
  return issue.severity === "warning" ? warning(issue, value) : invalid(issue, value);
}

export function serverIssue(
  field: string,
  code: string,
  message: string,
  severity: ValidationSeverity = "error",
): ValidationIssue {
  return { code, field, source: "server", severity, message };
}

/**
 * FORM-R33 — le serveur fait foi : son verdict REMPLACE celui du client, il ne s'empile
 * jamais avec lui. Un verdict serveur porte la valeur qu'il a jugée : si l'utilisateur
 * corrige, `refresh` le rendra caduc comme n'importe quel autre.
 */
export function reconcile(
  client: ValidationVerdict,
  server: ValidationIssue | null | undefined,
  value?: string,
): ValidationVerdict {
  if (!server) return client;
  return verdictFromIssue(server, value ?? valeurJugee(client));
}

/* ── 5. Priorité — une seule erreur locale à la fois ────────────────────────── */

/**
 * Rang d'affichage par SOURCE. Le serveur d'abord : c'est lui qui fait foi (FORM-R33), et
 * son verdict ne coexiste avec un verdict client que le temps d'un rendu. Puis le métier,
 * plus spécifique qu'un schéma, lui-même plus spécifique qu'une contrainte de format.
 */
const RANG_SOURCE: Record<ValidationSource, number> = {
  server: 0,
  business: 1,
  schema: 2,
  native: 3,
};

const RANG_CODE_NATIF = new Map<string, number>(NATIVE_CODES.map((c, i) => [c, i]));

/**
 * Choisit L'UNIQUE grief à montrer sous un champ. Jamais d'empilement
 * « Champ requis / Format incorrect / Valeur inconnue » : une erreur précise et réparable
 * à la fois.
 *
 * Ordre déterministe et total :
 *   1. `error` avant `warning` — montrer l'avertissement masquerait le bloquant ;
 *   2. rang de source (serveur → métier → schéma → natif) ;
 *   3. rang du code natif (badInput → … → customError) ;
 *   4. à égalité, l'ordre d'arrivée (stable) — donc reproductible.
 *
 * N'altère jamais le tableau reçu.
 */
export function prioritise(issues: readonly ValidationIssue[]): ValidationIssue | null {
  if (!issues.length) return null;
  const rang = (i: ValidationIssue): number[] => [
    i.severity === "error" ? 0 : 1,
    RANG_SOURCE[i.source] ?? 99,
    RANG_CODE_NATIF.get(i.code) ?? 99,
  ];
  return issues.reduce((meilleur, candidat) => {
    const a = rang(meilleur);
    const b = rang(candidat);
    for (let k = 0; k < a.length; k++) {
      if (b[k] < a[k]) return candidat;
      if (b[k] > a[k]) return meilleur;
    }
    return meilleur; // égalité stricte : le premier arrivé reste
  });
}

/** Verdict d'un champ à partir de TOUS ses griefs — priorité comprise. */
export function verdictFromIssues(
  issues: readonly ValidationIssue[],
  value?: string,
): ValidationVerdict {
  const retenu = prioritise(issues);
  return retenu ? verdictFromIssue(retenu, value) : valid(value);
}

/* ── 6. Lecture d'un verdict ────────────────────────────────────────────────── */

export const issueOf = (v: ValidationVerdict): ValidationIssue | null =>
  v.state === "invalid" || v.state === "warning" ? v.issue : null;

/** Le message unique — celui du champ ET celui du résumé. Aucun second texte n'existe. */
export const messageOf = (v: ValidationVerdict): string | null => issueOf(v)?.message ?? null;

const valeurJugee = (v: ValidationVerdict): string | undefined =>
  v.state === "pristine" ? undefined : v.value;

/**
 * Bloque la soumission ? SEUL un `invalid` qui fait encore AUTORITÉ. `pristine` ne prouve
 * rien mais ne bloque pas ; un verdict caduc s'affiche encore mais n'oppose plus rien — la
 * soumission recalcule de toute façon (FORM-R32).
 */
export const isBlocking = (v: ValidationVerdict): boolean =>
  v.state === "invalid" && v.obsolete !== true;

/** Un verdict asynchrone est attendu (FORM-R49/R50 : le formulaire ne part pas en silence). */
export const isPending = (v: ValidationVerdict): boolean => v.state === "validating";

/**
 * Le verdict porte-t-il encore sur la valeur courante ? Un verdict sans signature
 * (`value` absente) ne périme jamais : il n'a pas prétendu juger une valeur précise.
 */
export const isStale = (v: ValidationVerdict, current: string): boolean =>
  v.state !== "pristine" && v.value !== undefined && v.value !== current;

/**
 * Marque un verdict comme caduc SANS l'effacer.
 *
 * Ce n'est pas de la timidité : un verdict caduc a deux propriétés distinctes, et les
 * confondre coûte cher. Il ne fait plus AUTORITÉ — il ne peut rien affirmer d'une valeur
 * qu'il n'a pas vue, donc il ne bloque plus la soumission (FORM-R51). Mais il reste
 * AFFICHÉ — sinon le message disparaît au premier caractère, c'est-à-dire au moment exact
 * où l'utilisateur en a besoin pour corriger (FORM-R27).
 *
 * Ce qui le remplace, c'est une REVALIDATION : au blur, ou à la soumission suivante.
 */
export const stale = (v: ValidationVerdict): ValidationVerdict =>
  v.state === "invalid" || v.state === "warning"
    ? Object.freeze({ ...v, obsolete: true as const })
    : v;

/** Rejoue l'obsolescence d'un verdict contre la valeur courante. Ne l'efface JAMAIS. */
export const refresh = (v: ValidationVerdict, current: string): ValidationVerdict =>
  isStale(v, current) && !isObsolete(v) ? stale(v) : v;

/** Le verdict a été marqué caduc — il s'affiche encore, il ne prouve plus rien. */
export const isObsolete = (v: ValidationVerdict): boolean =>
  (v.state === "invalid" || v.state === "warning") && v.obsolete === true;

/* ── 6bis. QUAND valider — déclaré par le champ, jamais imposé par le kit ───── */

/**
 * La stratégie de timing d'UN champ. `FORM-R15` en donne l'autorité au formulaire et
 * `FORM-R16` documente une divergence RÉELLE du secteur (GOV.UK valide au submit, Carbon au
 * blur) : il n'y a donc pas de bon défaut universel, et le kit n'en impose aucun. Ce qu'il
 * fait, c'est rendre le choix DÉCLARABLE — champ par champ, cas par cas.
 *
 *   submit    rien ne bouge avant la soumission (le plus sobre)
 *   blur      le champ se juge quand on le quitte
 *   deferred  il se juge aussi pendant la frappe, une fois la première saisie terminée
 */
export type ValidationTiming = "submit" | "blur" | "deferred";

export interface ValidationMoment {
  /** La stratégie déclarée pour CE champ. */
  timing: ValidationTiming;
  /** Ce qui vient de se produire. */
  moment: "input" | "blur" | "submit";
  /** Une erreur est-elle DÉJÀ affichée sur ce champ ? */
  displayed: boolean;
  /**
   * La première saisie est-elle terminée (le champ a été quitté au moins une fois) ?
   * `FORM-R17` interdit de juger avant : un champ traversé au Tab n'a rien fait de mal.
   */
  touched: boolean;
}

/**
 * Faut-il valider MAINTENANT ? Fonction pure — elle ne connaît ni le temps qui passe (le
 * délai d'un `deferred` appartient au consommateur), ni le DOM.
 *
 * Trois règles, toutes déjà écrites ailleurs :
 *   1. une soumission valide TOUJOURS tout (FORM-R32 : recalcul complet) ;
 *   2. un champ DÉJÀ en erreur se re-juge au blur, quelle que soit sa stratégie — c'est ce
 *      qui remplace le message, et rien d'autre ne le remplace (arbitrage 2026-07-30) ;
 *   3. sinon, la stratégie décide, et jamais avant la première saisie terminée (FORM-R17).
 */
export function shouldValidate({ timing, moment, displayed, touched }: ValidationMoment): boolean {
  if (moment === "submit") return true;
  // Une erreur affichée ne s'efface pas à la frappe : elle attend d'être re-jugée.
  if (displayed) return moment === "blur";
  if (!touched) return false;
  if (moment === "blur") return timing !== "submit";
  return timing === "deferred";
}

/* ── 7. Projections vers le rendu ───────────────────────────────────────────── */

/** Le statut visuel d'`Input` — DÉRIVÉ, jamais source de vérité. */
export type FieldStatus = "default" | "error" | "success" | "warning";

/**
 * `pristine` et `validating` restent neutres : un champ en attente n'est ni bon ni mauvais.
 *
 * `valid` ne rend PAS `success` par défaut, et ce n'est pas une timidité : INPUT-R16 range
 * « validé, sans besoin de le signaler » dans le statut par défaut, et INPUT-R20 réserve la
 * confirmation visible aux champs à forte friction perçue. Confirmer un succès est donc une
 * décision de produit — `confirmValid` la rend explicite.
 */
export function statusFromVerdict(
  v: ValidationVerdict,
  options?: { confirmValid?: boolean },
): FieldStatus {
  switch (v.state) {
    case "invalid":
      return "error";
    case "warning":
      return "warning";
    case "valid":
      return options?.confirmValid ? "success" : "default";
    default:
      return "default";
  }
}

/**
 * Projection pour la FAMILLE DU CHOIX, dont l'axe n'a que `default | error` (CHOICE-UI).
 *
 * LIMITE ASSUMÉE, à ne pas masquer : un `warning` sur une case ou un groupe de radios n'a
 * pas de teinte dans le système — il reste `default` et n'est porté QUE par son message.
 * Inventer ici une couleur d'avertissement serait créer un token par commodité
 * d'implémentation. La question appartient à CHOICE-UI, pas à ce module.
 */
export function choiceStatusFromVerdict(v: ValidationVerdict): "default" | "error" {
  return v.state === "invalid" ? "error" : "default";
}

/** `aria-invalid` n'est vrai que pendant une erreur RÉELLE — jamais pour un avertissement. */
export const ariaInvalid = (v: ValidationVerdict): true | undefined =>
  v.state === "invalid" ? true : undefined;

/** `aria-busy` pendant un verdict asynchrone (FORM-R49). */
export const ariaBusy = (v: ValidationVerdict): true | undefined =>
  v.state === "validating" ? true : undefined;

/* ── 8. Agrégation par le formulaire ────────────────────────────────────────── */

/** Une ligne du résumé d'erreurs — le lien du résumé cite le message EXACT (FORM-R23). */
export interface SummaryEntry {
  field: string;
  code: string;
  message: string;
  source: ValidationSource;
}

export type VerdictMap = Readonly<Record<string, ValidationVerdict>>;

/**
 * Les entrées du résumé, dans l'ORDRE DE LECTURE donné (`order`) — jamais l'ordre
 * d'insertion d'un objet. Les avertissements n'y entrent pas : le résumé liste ce qui doit
 * être corrigé pour avancer.
 *
 * Un verdict CADUC y reste : le résumé ne bouge pas pendant qu'on corrige, il est reconstruit
 * à la soumission suivante. C'est ce qui s'AFFICHE ; `submissionGate` dit ce qui BLOQUE.
 */
export function summary(verdicts: VerdictMap, order: readonly string[]): SummaryEntry[] {
  const out: SummaryEntry[] = [];
  for (const field of order) {
    const v = verdicts[field];
    if (!v || v.state !== "invalid") continue;
    out.push({ field, code: v.issue.code, message: v.issue.message, source: v.issue.source });
  }
  return out;
}

/**
 * La PORTE de soumission. Elle se décide sur des verdicts — jamais sur une classe CSS,
 * jamais sur l'absence visuelle d'un message.
 *
 * `pending` prime : soumettre pendant une vérification asynchrone n'est pas un refus, c'est
 * une attente à annoncer (FORM-R50). Le premier champ bloquant est donné dans l'ordre de
 * lecture — c'est la cible de focus d'un formulaire court (FORM-R26).
 */
export interface SubmissionGate {
  ok: boolean;
  pending: boolean;
  blocking: SummaryEntry[];
  first: string | null;
}

export function submissionGate(verdicts: VerdictMap, order: readonly string[]): SubmissionGate {
  // Ce qui BLOQUE ⊆ ce qui s'affiche : un verdict devenu caduc reste lisible sans opposer.
  const blocking = summary(verdicts, order).filter((e) => isBlocking(verdicts[e.field]));
  const pending = order.some((f) => verdicts[f] && isPending(verdicts[f]));
  return {
    ok: blocking.length === 0 && !pending,
    pending,
    blocking,
    first: blocking.length ? blocking[0].field : null,
  };
}

/**
 * Rafraîchit TOUTE la carte des verdicts contre les valeurs courantes : ce qui est devenu
 * caduc est MARQUÉ caduc — jamais effacé, jamais ramené à `pristine` (VALIDATION-R13, 1.1.0).
 * Renvoie la carte reçue TELLE QUELLE si rien n'a bougé — un consommateur React peut donc
 * l'utiliser sans provoquer de rendu inutile.
 */
export function refreshAll(verdicts: VerdictMap, values: Readonly<Record<string, string>>): VerdictMap {
  let change = false;
  const out: Record<string, ValidationVerdict> = {};
  for (const [field, v] of Object.entries(verdicts)) {
    const courant = values[field];
    const suivant = courant === undefined ? v : refresh(v, courant);
    if (suivant !== v) change = true;
    out[field] = suivant;
  }
  return change ? out : verdicts;
}

/* ── 9. Surface publique groupée ────────────────────────────────────────────── */

/**
 * Le contrat est exporté SOUS UN NOM, pas éparpillé dans le baril : `valid`, `warning`,
 * `format` ou `summary` posés à plat dans `@fili/react` seraient des noms trop généraux
 * pour un paquet qui exporte surtout des composants.
 *
 *   import { Validation, type ValidationVerdict } from "@fili/react";
 *   const v = Validation.fromValidity("email", el.validity, el.value, MESSAGES);
 *   <Input.Field verdict={v}>…</Input.Field>
 */
export const Validation = {
  PRISTINE,
  validating,
  valid,
  invalid,
  warning,
  NATIVE_CODES,
  nativeCode,
  format,
  fromValidity: verdictFromValidity,
  fromSelection: verdictFromSelection,
  fromIssue: verdictFromIssue,
  fromIssues: verdictFromIssues,
  serverIssue,
  reconcile,
  prioritise,
  issueOf,
  messageOf,
  isBlocking,
  isPending,
  isStale,
  isObsolete,
  stale,
  refresh,
  shouldValidate,
  refreshAll,
  status: statusFromVerdict,
  choiceStatus: choiceStatusFromVerdict,
  ariaInvalid,
  ariaBusy,
  summary,
  submissionGate,
} as const;
