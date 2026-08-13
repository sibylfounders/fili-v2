/**
 * Le CONTRAT de validation, sans React et sans DOM — c'est tout l'intérêt : si ces tests
 * avaient besoin d'un rendu, c'est que le verdict dépendrait de l'apparence.
 *
 * Chaque test verrouille un invariant du principe `VALIDATION-UX`.
 */
import { describe, it, expect } from "vitest";
import {
  PRISTINE,
  Validation,
  format,
  invalid,
  nativeCode,
  prioritise,
  valid,
  validating,
  warning,
  type ValidationIssue,
  type ValidationVerdict,
  type VerdictMap,
} from "../../lib/validation";

const MSG = {
  valueMissing: "Saisissez votre adresse.",
  typeMismatch: "Saisissez une adresse au format nom@domaine.fr",
  tooShort: "Il en faut au moins {min}.",
  fallback: "Cette valeur ne convient pas.",
};

const issue = (p: Partial<ValidationIssue> = {}): ValidationIssue => ({
  code: "x",
  field: "champ",
  source: "native",
  severity: "error",
  message: "m",
  ...p,
});

describe("normalisation des contraintes natives (VALIDATION-R04, S2)", () => {
  it("chaque drapeau de ValidityState devient un code STABLE", () => {
    for (const code of Validation.NATIVE_CODES) {
      expect(nativeCode({ [code]: true })).toBe(code);
    }
  });

  it("aucun drapeau levé = aucun grief", () => {
    expect(nativeCode({ valid: true })).toBeNull();
    expect(nativeCode({})).toBeNull();
  });

  it("le message vient de l'appelant, JAMAIS du navigateur", () => {
    const v = Validation.fromValidity("courriel", { typeMismatch: true }, "06 12 34 56 78", MSG);
    expect(v.state).toBe("invalid");
    expect(Validation.messageOf(v)).toBe(MSG.typeMismatch);
    // aucune chaîne de langue naturelle n'est codée dans le contrat
    expect(Validation.messageOf(v)).not.toMatch(/Please|Veuillez saisir une adresse/);
  });

  it("un code sans message traduit tombe sur le repli, jamais sur du vide", () => {
    const v = Validation.fromValidity("q", { badInput: true }, "abc", MSG);
    expect(Validation.messageOf(v)).toBe(MSG.fallback);
  });

  it("les paramètres s'interpolent ; une clé absente laisse le motif intact", () => {
    expect(format("Il en faut au moins {min}.", { min: 3 })).toBe("Il en faut au moins 3.");
    expect(format("Il en faut au moins {min}.", { max: 3 })).toBe("Il en faut au moins {min}.");
  });

  it("une valeur sans grief donne un verdict `valid` porteur de sa signature", () => {
    const v = Validation.fromValidity("courriel", { valid: true }, "nom@domaine.fr", MSG);
    expect(v.state).toBe("valid");
    expect(Validation.isStale(v, "nom@domaine.fr")).toBe(false);
  });
});

describe("priorité — UNE erreur locale à la fois (VALIDATION-R11, R12)", () => {
  it("l'erreur passe avant l'avertissement : montrer l'avertissement masquerait le bloquant", () => {
    const retenu = prioritise([
      issue({ code: "weak", severity: "warning", source: "business" }),
      issue({ code: "valueMissing", severity: "error", source: "native" }),
    ]);
    expect(retenu!.code).toBe("valueMissing");
  });

  it("le serveur fait foi : sa source passe avant métier, schéma et natif", () => {
    const retenu = prioritise([
      issue({ code: "typeMismatch", source: "native" }),
      issue({ code: "tooShort", source: "schema" }),
      issue({ code: "alreadyUsed", source: "server" }),
      issue({ code: "quota", source: "business" }),
    ]);
    expect(retenu!.source).toBe("server");
  });

  it("à source native égale, la contrainte la plus STRUCTURELLE d'abord", () => {
    const retenu = prioritise([
      issue({ code: "tooLong" }),
      issue({ code: "valueMissing" }),
      issue({ code: "patternMismatch" }),
    ]);
    expect(retenu!.code).toBe("valueMissing");
  });

  it("le résultat est DÉTERMINISTE : l'ordre d'arrivée ne le change pas", () => {
    const a = issue({ code: "tooShort", source: "schema" });
    const b = issue({ code: "typeMismatch", source: "native" });
    expect(prioritise([a, b])!.code).toBe(prioritise([b, a])!.code);
  });

  it("aucun grief = aucun verdict d'erreur", () => {
    expect(prioritise([])).toBeNull();
    expect(Validation.fromIssues([], "v").state).toBe("valid");
  });

  it("n'altère jamais le tableau reçu (immutabilité des entrées)", () => {
    const entrees = [issue({ code: "tooLong" }), issue({ code: "valueMissing" })];
    const copie = JSON.parse(JSON.stringify(entrees));
    prioritise(entrees);
    expect(entrees).toEqual(copie);
  });
});

describe("taxonomie — cinq états qui ne se confondent pas (VALIDATION-R06, R07)", () => {
  it("`pristine` n'est PAS `valid` : l'absence de verdict ne prouve rien", () => {
    expect(PRISTINE.state).toBe("pristine");
    expect(PRISTINE.state).not.toBe("valid");
    expect(Validation.status(PRISTINE)).toBe("default");
    expect(Validation.status(valid("x"))).toBe("default"); // sans confirmValid
    expect(Validation.status(valid("x"), { confirmValid: true })).toBe("success");
  });

  it("seul `invalid` bloque la soumission ; `warning` ne bloque jamais", () => {
    expect(Validation.isBlocking(invalid(issue()))).toBe(true);
    expect(Validation.isBlocking(warning(issue({ severity: "warning" })))).toBe(false);
    expect(Validation.isBlocking(PRISTINE)).toBe(false);
    expect(Validation.isBlocking(valid("x"))).toBe(false);
  });

  it("`validating` est une ATTENTE, pas un refus", () => {
    const v = validating("x");
    expect(Validation.isPending(v)).toBe(true);
    expect(Validation.isBlocking(v)).toBe(false);
    expect(Validation.ariaBusy(v)).toBe(true);
    expect(Validation.status(v)).toBe("default");
  });

  it("`warning` conserve sa gravité même construit depuis une issue d'erreur", () => {
    const v = warning(issue({ severity: "error" }));
    expect(Validation.issueOf(v)!.severity).toBe("warning");
    expect(Validation.status(v)).toBe("warning");
    // aria-invalid ne ment pas : un avertissement n'est pas une valeur invalide
    expect(Validation.ariaInvalid(v)).toBeUndefined();
    expect(Validation.ariaInvalid(invalid(issue()))).toBe(true);
  });

  it("la famille du choix n'a pas de teinte d'avertissement — limite ASSUMÉE, pas masquée", () => {
    expect(Validation.choiceStatus(warning(issue({ severity: "warning" })))).toBe("default");
    expect(Validation.choiceStatus(invalid(issue()))).toBe("error");
  });
});

describe("cardinalité d'un groupe (CHOICE-R17)", () => {
  const MSG_G = { valueMissing: "Choisissez au moins un sujet.", tooFew: "Au moins {min}.", tooMany: "Trois maximum.", fallback: "…" };

  it("rien de sélectionné alors qu'une réponse est obligatoire", () => {
    const v = Validation.fromSelection("sujets", [], { required: true }, MSG_G);
    expect(v.state).toBe("invalid");
    expect(Validation.issueOf(v)!.code).toBe("valueMissing");
    expect(Validation.issueOf(v)!.source).toBe("schema");
  });

  it("minimum et maximum, avec leurs paramètres interpolés", () => {
    expect(Validation.messageOf(Validation.fromSelection("s", ["a"], { min: 2 }, MSG_G))).toBe("Au moins 2.");
    expect(Validation.fromSelection("s", ["a", "b", "c", "d"], { max: 3 }, MSG_G).state).toBe("invalid");
    expect(Validation.fromSelection("s", ["a", "b"], { min: 1, max: 3 }, MSG_G).state).toBe("valid");
  });

  it("la signature d'obsolescence est INJECTIVE — [\"a|b\"] ≠ [\"a\",\"b\"]", () => {
    const un = Validation.fromSelection("s", ["a|b"], { min: 1 }, MSG_G);
    expect(Validation.isStale(un, JSON.stringify(["a", "b"]))).toBe(true);
    expect(Validation.isStale(un, JSON.stringify(["a|b"]))).toBe(false);
  });
});

describe("le serveur fait foi (VALIDATION-R08, FORM-R33)", () => {
  it("le verdict serveur REMPLACE celui du client — il ne s'empile pas", () => {
    const client = valid("nom@domaine.fr");
    const serveur = Validation.serverIssue("courriel", "alreadyUsed", "Cette adresse est déjà utilisée.");
    const apres = Validation.reconcile(client, serveur, "nom@domaine.fr");
    expect(apres.state).toBe("invalid");
    expect(Validation.issueOf(apres)!.source).toBe("server");
    expect(Validation.messageOf(apres)).toBe("Cette adresse est déjà utilisée.");
  });

  it("sans verdict serveur, le verdict client est rendu tel quel", () => {
    const client = valid("x");
    expect(Validation.reconcile(client, null)).toBe(client);
  });
});

describe("récupération — un verdict caduc cesse de FAIRE AUTORITÉ, pas de s'AFFICHER (VALIDATION-R13)", () => {
  it("un verdict porte sur une valeur et devient caduc quand elle change", () => {
    const v = invalid(issue(), "06 12 34 56 78");
    expect(Validation.isStale(v, "06 12 34 56 78")).toBe(false);
    expect(Validation.isStale(v, "nom@domaine.fr")).toBe(true);
    expect(Validation.refresh(v, "06 12 34 56 78")).toBe(v);
  });

  it("caduc = il ne bloque plus… mais son message reste lisible", () => {
    const v = invalid(issue({ message: "Saisissez une adresse." }), "06 12 34 56 78");
    const apres = Validation.refresh(v, "nom@dom");
    expect(apres).not.toBe(PRISTINE);
    expect(apres.state).toBe("invalid");
    expect(Validation.isObsolete(apres)).toBe(true);
    expect(Validation.isBlocking(apres)).toBe(false); // il ne prouve plus rien
    expect(Validation.messageOf(apres)).toBe("Saisissez une adresse."); // il se lit encore
  });

  it("seule une REVALIDATION remplace le message — pas le temps qui passe", () => {
    const v = Validation.refresh(invalid(issue(), "a"), "b");
    expect(Validation.messageOf(v)).not.toBeNull();
    // le champ est re-jugé : c'est ce nouveau verdict qui remplace l'ancien
    const rejuge = Validation.fromValidity("f", { valid: true }, "b", { fallback: "…" });
    expect(rejuge.state).toBe("valid");
    expect(Validation.messageOf(rejuge)).toBeNull();
  });

  it("marquer caduc deux fois ne change rien (idempotent)", () => {
    const v = Validation.refresh(invalid(issue(), "a"), "b");
    expect(Validation.refresh(v, "c")).toBe(v);
  });

  it("un verdict SANS signature ne périme jamais — il n'a jugé aucune valeur précise", () => {
    const v = invalid(issue());
    expect(Validation.isStale(v, "n'importe quoi")).toBe(false);
  });

  it("refreshAll renvoie la carte REÇUE quand rien n'a bougé (aucun rendu inutile)", () => {
    const carte: VerdictMap = { a: invalid(issue(), "1"), b: valid("2") };
    expect(Validation.refreshAll(carte, { a: "1", b: "2" })).toBe(carte);
    const apres = Validation.refreshAll(carte, { a: "9", b: "2" });
    expect(apres).not.toBe(carte);
    expect(Validation.isObsolete(apres.a)).toBe(true);
    expect(Validation.isBlocking(apres.a)).toBe(false);
    expect(apres.b).toBe(carte.b);
  });
});

describe("agrégation — le résumé et l'inline partagent le MÊME objet (VALIDATION-R10)", () => {
  const carte: VerdictMap = {
    courriel: invalid(issue({ field: "courriel", code: "typeMismatch", message: "Format attendu : nom@domaine.fr" }), "x"),
    formule: valid("annuel"),
    sujets: invalid(issue({ field: "sujets", code: "valueMissing", message: "Choisissez au moins un sujet." }), "[]"),
    remise: warning(issue({ field: "remise", severity: "warning", message: "Cette remise expire demain." })),
  };
  const ORDRE = ["courriel", "formule", "sujets", "remise"];

  it("le résumé suit l'ORDRE DE LECTURE, pas l'ordre d'insertion", () => {
    expect(Validation.summary(carte, ORDRE).map((e) => e.field)).toEqual(["courriel", "sujets"]);
    expect(Validation.summary(carte, ["sujets", "courriel"]).map((e) => e.field)).toEqual(["sujets", "courriel"]);
  });

  it("le texte du résumé est EXACTEMENT le message local", () => {
    const entree = Validation.summary(carte, ORDRE)[0];
    expect(entree.message).toBe(Validation.messageOf(carte.courriel));
  });

  it("un avertissement n'entre pas au résumé : il n'a rien à corriger pour avancer", () => {
    expect(Validation.summary(carte, ORDRE).some((e) => e.field === "remise")).toBe(false);
  });

  it("la porte de soumission se décide sur les verdicts, et désigne le premier fautif", () => {
    const porte = Validation.submissionGate(carte, ORDRE);
    expect(porte.ok).toBe(false);
    expect(porte.first).toBe("courriel");
    expect(porte.blocking).toHaveLength(2);
  });

  it("un verdict CADUC reste au résumé (rien ne bouge avant la resoumission) mais ne bloque plus", () => {
    const caduque = Validation.refresh(carte.courriel, "corrigé");
    const avec: VerdictMap = { ...carte, courriel: caduque };
    expect(Validation.summary(avec, ORDRE).map((e) => e.field)).toEqual(["courriel", "sujets"]);
    const porte = Validation.submissionGate(avec, ORDRE);
    expect(porte.blocking.map((e) => e.field)).toEqual(["sujets"]);
    expect(porte.first).toBe("sujets");
  });

  it("un champ jamais validé ne suffit pas à ouvrir la porte, mais ne la ferme pas non plus", () => {
    const porte = Validation.submissionGate({ a: PRISTINE }, ["a"]);
    expect(porte.ok).toBe(true); // c'est le formulaire qui RECALCULE avant de soumettre
    expect(porte.blocking).toHaveLength(0);
  });

  it("une vérification en cours n'est pas un refus : elle se dit", () => {
    const porte = Validation.submissionGate({ a: validating("x") }, ["a"]);
    expect(porte.ok).toBe(false);
    expect(porte.pending).toBe(true);
    expect(porte.blocking).toHaveLength(0);
  });
});

describe("immutabilité (le contrat ne mute jamais ce qu'on lui donne)", () => {
  it("les verdicts sont gelés", () => {
    const v = invalid(issue(), "x") as ValidationVerdict & { state: string };
    expect(Object.isFrozen(v)).toBe(true);
    expect(Object.isFrozen(Validation.issueOf(v))).toBe(true);
  });

  it("une sélection passée au contrat n'est pas modifiée", () => {
    const selection = ["a", "b"];
    Validation.fromSelection("s", selection, { max: 1 }, { fallback: "…" });
    expect(selection).toEqual(["a", "b"]);
  });
});

describe("QUAND valider — déclaré, jamais imposé (VALIDATION-R18)", () => {
  const q = (o: Partial<Parameters<typeof Validation.shouldValidate>[0]>) =>
    Validation.shouldValidate({ timing: "submit", moment: "input", displayed: false, touched: true, ...o });

  it("une soumission valide TOUJOURS, quelle que soit la stratégie", () => {
    for (const timing of ["submit", "blur", "deferred"] as const)
      expect(q({ timing, moment: "submit", touched: false })).toBe(true);
  });

  it("jamais avant que la première saisie soit terminée (FORM-R17)", () => {
    expect(q({ timing: "blur", moment: "blur", touched: false })).toBe(false);
    expect(q({ timing: "deferred", moment: "input", touched: false })).toBe(false);
  });

  it("« submit » ne juge rien avant la soumission", () => {
    expect(q({ timing: "submit", moment: "blur" })).toBe(false);
    expect(q({ timing: "submit", moment: "input" })).toBe(false);
  });

  it("« blur » juge au départ du champ, jamais pendant la frappe", () => {
    expect(q({ timing: "blur", moment: "blur" })).toBe(true);
    expect(q({ timing: "blur", moment: "input" })).toBe(false);
  });

  it("« deferred » juge aussi pendant la frappe — le DÉLAI appartient au consommateur", () => {
    expect(q({ timing: "deferred", moment: "input" })).toBe(true);
    expect(q({ timing: "deferred", moment: "blur" })).toBe(true);
  });

  it("un champ DÉJÀ en erreur se re-juge au blur, quelle que soit sa stratégie…", () => {
    for (const timing of ["submit", "blur", "deferred"] as const)
      expect(q({ timing, moment: "blur", displayed: true })).toBe(true);
  });

  it("…et JAMAIS à la frappe : le message doit rester lisible pendant la correction", () => {
    for (const timing of ["submit", "blur", "deferred"] as const)
      expect(q({ timing, moment: "input", displayed: true })).toBe(false);
  });
});
