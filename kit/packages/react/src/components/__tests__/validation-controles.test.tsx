/**
 * La chaîne DANS les contrôles : ce que chaque composant fait d'un verdict.
 *
 * La règle que ces tests défendent tient en une phrase — un état d'erreur est la
 * conséquence observable d'un verdict, jamais un style choisi. Un test qui vérifierait
 * seulement la présence d'une bordure rouge serait insuffisant : on vérifie l'attribut
 * sémantique, l'association du message, et ce que devient un verdict à la correction :
 * il perd son AUTORITÉ, il ne perd pas son texte (VALIDATION-R13, rectifiée en 1.1.0).
 */
import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";

import { Input } from "../input/input";
import { Select } from "../select/select";
import { Checkbox } from "../checkbox/checkbox";
import { Radio } from "../radio/radio";
import { Validation, type ValidationVerdict } from "../../lib/validation";

const MSG = {
  valueMissing: "Saisissez votre adresse e-mail.",
  typeMismatch: "Saisissez une adresse au format nom@domaine.fr",
  fallback: "Cette adresse ne convient pas.",
};

const champ = (verdict?: ValidationVerdict, helper = true) => (
  <Input.Field controlId="courriel" required verdict={verdict}>
    <Input.Label>Adresse e-mail</Input.Label>
    <Input.Root>
      <Input.Wrapper>
        <Input.Input type="email" defaultValue="06 12 34 56 78" />
      </Input.Wrapper>
    </Input.Root>
    {helper ? <Input.Helper>Nous ne la partagerons jamais.</Input.Helper> : null}
    <Input.Error />
  </Input.Field>
);

const violations = async (n: HTMLElement) =>
  (await axe.run(n, { rules: { "color-contrast": { enabled: false } } })).violations;

/* ══ INPUT ═══════════════════════════════════════════════════════════════════════════ */

describe("Input — le message DESCEND du verdict", () => {
  it("sans verdict, aucune erreur : `pristine` n'accuse rien", () => {
    const { container } = render(champ());
    const input = screen.getByLabelText(/Adresse e-mail/);
    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(screen.queryByText(MSG.typeMismatch)).toBeNull();
    expect(screen.getByText("Nous ne la partagerons jamais.")).toBeTruthy();
    expect(container.querySelector("[data-status]")!.getAttribute("data-status")).toBe("default");
  });

  it("un numéro de téléphone dans le champ e-mail : typeMismatch, message, aria-invalid", () => {
    const v = Validation.fromValidity("courriel", { typeMismatch: true }, "06 12 34 56 78", MSG);
    const { container } = render(champ(v));
    const input = screen.getByLabelText(/Adresse e-mail/);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText(MSG.typeMismatch)).toBeTruthy();
    expect(container.querySelector("[data-status]")!.getAttribute("data-status")).toBe("error");
  });

  it("le message est RÉELLEMENT référencé par le champ — pas seulement posé à côté", () => {
    const v = Validation.fromValidity("courriel", { typeMismatch: true }, "x", MSG);
    render(champ(v));
    const input = screen.getByLabelText(/Adresse e-mail/);
    const id = input.getAttribute("aria-describedby")!;
    expect(id).toBeTruthy();
    expect(document.getElementById(id)!.textContent).toContain(MSG.typeMismatch);
  });

  it("aucun identifiant ORPHELIN : ce que aria-describedby désigne existe toujours", () => {
    const { rerender } = render(champ(Validation.fromValidity("c", { typeMismatch: true }, "x", MSG)));
    const input = screen.getByLabelText(/Adresse e-mail/);
    for (const v of [undefined, Validation.valid("nom@domaine.fr"), Validation.invalid({ code: "c", field: "courriel", source: "server", severity: "error", message: "Déjà utilisée." })]) {
      rerender(champ(v));
      const id = input.getAttribute("aria-describedby");
      if (id) expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("l'erreur REMPLACE l'aide, elle ne s'empile pas (INPUT-R26)", () => {
    render(champ(Validation.fromValidity("c", { typeMismatch: true }, "x", MSG)));
    expect(screen.queryByText("Nous ne la partagerons jamais.")).toBeNull();
    expect(screen.getByText(MSG.typeMismatch)).toBeTruthy();
  });

  it("jamais la couleur seule : le message porte sa qualification textuelle (INPUT-R31)", () => {
    render(champ(Validation.fromValidity("c", { valueMissing: true }, "", MSG)));
    expect(screen.getByText(/^Erreur :/)).toBeTruthy();
  });

  it("un AVERTISSEMENT se qualifie comme tel, et ne pose pas aria-invalid", () => {
    const v = Validation.warning({ code: "weak", field: "courriel", source: "business", severity: "warning", message: "Cette adresse jetable expire vite." });
    render(champ(v));
    expect(screen.getByText(/^Avertissement :/)).toBeTruthy();
    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBeNull();
    expect(screen.getByText("Cette adresse jetable expire vite.")).toBeTruthy();
  });

  it("une vérification en cours pose aria-busy et laisse le statut neutre", () => {
    render(champ(Validation.validating("nom@domaine.fr")));
    const input = screen.getByLabelText(/Adresse e-mail/);
    expect(input.getAttribute("aria-busy")).toBe("true");
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("une erreur SERVEUR emprunte la même chaîne qu'une erreur cliente", () => {
    const serveur = Validation.serverIssue("courriel", "alreadyUsed", "Cette adresse est déjà utilisée.");
    render(champ(Validation.reconcile(Validation.valid("x"), serveur, "x")));
    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Cette adresse est déjà utilisée.")).toBeTruthy();
  });

  it("la CORRECTION retire l'AUTORITÉ du verdict, jamais son message (VALIDATION-R13)", () => {
    const v = Validation.fromValidity("courriel", { typeMismatch: true }, "06 12 34 56 78", MSG);
    const { rerender } = render(champ(v));
    expect(screen.getByText(MSG.typeMismatch)).toBeTruthy();
    const perime = Validation.refresh(v, "nom@domaine.fr");
    rerender(champ(perime));
    // Il ne décide plus : il n'a pas vu la valeur courante.
    expect(Validation.isObsolete(perime)).toBe(true);
    expect(Validation.isBlocking(perime)).toBe(false);
    // Mais il reste LISIBLE — l'effacer retirerait l'instruction à l'instant où elle sert (FORM-R27).
    expect(screen.getByText(MSG.typeMismatch)).toBeTruthy();
    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBe("true");
  });

  it("un `controlId` rend l'identifiant STABLE — sans lui, le résumé ne peut rien ancrer", () => {
    render(champ(Validation.fromValidity("c", { typeMismatch: true }, "x", MSG)));
    expect(document.getElementById("courriel")).not.toBeNull();
  });

  it("axe-core ne relève rien de neuf, en erreur comme au repos", async () => {
    const { container, rerender } = render(champ());
    expect(await violations(container)).toHaveLength(0);
    rerender(champ(Validation.fromValidity("c", { typeMismatch: true }, "x", MSG)));
    expect(await violations(container)).toHaveLength(0);
  });
});

/* ══ SELECT ══════════════════════════════════════════════════════════════════════════ */

const OPTIONS = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

describe("Select — le verdict est la SEULE voie vers l'erreur", () => {
  const manquant = Validation.invalid({ code: "valueMissing", field: "langue", source: "schema", severity: "error", message: "Choisissez la langue de l'interface." });

  it("le placeholder n'est pas une valeur : sans choix, le verdict est manquant", () => {
    render(<Select options={OPTIONS} value={null} onValueChange={() => {}} aria-label="Langue" verdict={manquant} />);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Choisissez la langue de l'interface.")).toBeTruthy();
  });

  it("hors bloc champ, le select porte son message ET l'associe (SELECT-R07)", () => {
    render(<Select options={OPTIONS} value={null} onValueChange={() => {}} aria-label="Langue" verdict={manquant} />);
    const id = screen.getByRole("combobox").getAttribute("aria-describedby")!;
    expect(id).toBeTruthy();
    expect(document.getElementById(id)!.textContent).toContain("Choisissez la langue");
  });

  it("dans un bloc champ, il consomme le MÊME câblage que l'input — libellé lié compris", () => {
    render(
      <Input.Field controlId="langue" required verdict={manquant}>
        <Input.Label>Langue de l'interface</Input.Label>
        <Select options={OPTIONS} value={null} onValueChange={() => {}} />
        <Input.Error />
      </Input.Field>,
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger.getAttribute("id")).toBe("langue");
    expect(trigger.getAttribute("aria-required")).toBe("true");
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    const id = trigger.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)!.textContent).toContain("Choisissez la langue");
    // un seul message : le bloc l'affiche, le select ne le redouble pas
    expect(screen.getAllByText("Choisissez la langue de l'interface.")).toHaveLength(1);
  });

  it("une option devenue indisponible produit un verdict comme une autre contrainte", () => {
    const perdue = Validation.invalid({ code: "unavailableOption", field: "langue", source: "business", severity: "error", message: "Cette langue n'est plus proposée : choisissez-en une autre." });
    render(<Select options={OPTIONS} value="de" onValueChange={() => {}} aria-label="Langue" verdict={perdue} />);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });

  it("à la sélection, le verdict périmé cesse de bloquer sans cesser de s'afficher", () => {
    const manque = Validation.invalid({ code: "valueMissing", field: "langue", source: "schema", severity: "error", message: "Choisissez la langue." }, JSON.stringify([]));
    const { rerender } = render(<Select options={OPTIONS} value={null} onValueChange={() => {}} aria-label="Langue" verdict={manque} />);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    const perime = Validation.refresh(manque, JSON.stringify(["fr"]));
    rerender(<Select options={OPTIONS} value="fr" onValueChange={() => {}} aria-label="Langue" verdict={perime} />);
    expect(Validation.isBlocking(perime)).toBe(false);
    // La porte de soumission s'ouvre ; l'écran, lui, attend la revalidation.
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });

  it("sans verdict, aucun aria-invalid", () => {
    render(<Select options={OPTIONS} value="fr" onValueChange={() => {}} aria-label="Langue" />);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBeNull();
  });
});

/* ══ CHECKBOX ════════════════════════════════════════════════════════════════════════ */

const MSG_G = { valueMissing: "Choisissez au moins un centre d'intérêt.", tooFew: "Au moins {min}.", tooMany: "Trois au maximum.", fallback: "…" };

describe("Checkbox — le verdict d'une case et celui d'un groupe", () => {
  it("une case obligatoire non cochée produit un verdict structuré et un message local", () => {
    const v = Validation.fromSelection("cgu", [], { required: true }, { valueMissing: "Vous devez accepter les conditions pour continuer.", fallback: "…" });
    render(<Checkbox label="J'accepte les conditions" verdict={v} />);
    const input = screen.getByRole("checkbox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const id = input.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)!.textContent).toContain("Vous devez accepter");
  });

  it("`indeterminate` n'est pas une valeur validée", () => {
    render(<Checkbox label="Tout sélectionner" indeterminate />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
    expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBeNull();
  });

  it("groupe sans sélection : l'erreur appartient au GROUPE (CHOICE-R17)", () => {
    render(
      <Checkbox.Group label="Centres d'intérêt" value={[]} onValueChange={() => {}} verdict={Validation.fromSelection("sujets", [], { min: 1 }, MSG_G)}>
        <Checkbox value="design" label="Design" />
        <Checkbox value="code" label="Développement" />
      </Checkbox.Group>,
    );
    const fieldset = screen.getByRole("group");
    const id = fieldset.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)!.textContent).toContain("Choisissez au moins un");
    // le message n'est PAS répété sous chaque option
    expect(screen.getAllByText(MSG_G.valueMissing)).toHaveLength(1);
    expect(fieldset.querySelector("legend")!.textContent).toBe("Centres d'intérêt");
  });

  it("minimum et maximum de sélections", () => {
    const trop = Validation.fromSelection("sujets", ["a", "b", "c", "d"], { max: 3 }, MSG_G);
    render(
      <Checkbox.Group label="Centres d'intérêt" value={["a", "b", "c", "d"]} onValueChange={() => {}} verdict={trop}>
        <Checkbox value="a" label="A" />
      </Checkbox.Group>,
    );
    expect(screen.getByText("Trois au maximum.")).toBeTruthy();
  });

  it("une combinaison interdite par le métier passe par la même prise", () => {
    const v = Validation.invalid({ code: "incompatible", field: "sujets", source: "business", severity: "error", message: "« Aucun » ne se combine avec rien d'autre." });
    render(
      <Checkbox.Group label="Centres d'intérêt" value={["a", "aucun"]} onValueChange={() => {}} verdict={v}>
        <Checkbox value="a" label="A" />
        <Checkbox value="aucun" label="Aucun" exclusive />
      </Checkbox.Group>,
    );
    expect(screen.getByText(/ne se combine avec rien/)).toBeTruthy();
    expect(screen.getAllByRole("checkbox")[0].getAttribute("aria-invalid")).toBe("true");
  });

  it("à la correction, le verdict périmé du groupe perd son autorité, pas son message", () => {
    const v = Validation.fromSelection("sujets", [], { min: 1 }, MSG_G);
    const groupe = (verdict?: ValidationVerdict, valeurs: string[] = []) => (
      <Checkbox.Group label="Centres d'intérêt" value={valeurs} onValueChange={() => {}} verdict={verdict}>
        <Checkbox value="design" label="Design" />
      </Checkbox.Group>
    );
    const { rerender } = render(groupe(v));
    expect(screen.getByText(MSG_G.valueMissing)).toBeTruthy();
    const perime = Validation.refresh(v, JSON.stringify(["design"]));
    rerender(groupe(perime, ["design"]));
    expect(Validation.isObsolete(perime)).toBe(true);
    expect(Validation.isBlocking(perime)).toBe(false);
    expect(screen.getByText(MSG_G.valueMissing)).toBeTruthy();
    expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("axe-core : un groupe en erreur ne crée aucune violation", async () => {
    const { container } = render(
      <Checkbox.Group label="Centres d'intérêt" value={[]} onValueChange={() => {}} verdict={Validation.fromSelection("sujets", [], { min: 1 }, MSG_G)}>
        <Checkbox value="design" label="Design" />
      </Checkbox.Group>,
    );
    expect(await violations(container)).toHaveLength(0);
  });
});

/* ══ RADIO ═══════════════════════════════════════════════════════════════════════════ */

describe("Radio — le verdict appartient au groupe, jamais à une option", () => {
  const MSG_R = { valueMissing: "Choisissez une formule pour continuer.", fallback: "…" };
  const vide = Validation.fromSelection("formule", [], { required: true }, MSG_R);

  it("groupe obligatoire vide : message rattaché au fieldset, une seule fois", () => {
    render(
      <Radio.Group label="Formule" value={undefined} onValueChange={() => {}} verdict={vide}>
        <Radio value="mensuel" label="Mensuel" />
        <Radio value="annuel" label="Annuel" />
      </Radio.Group>,
    );
    const fieldset = screen.getByRole("group");
    const id = fieldset.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)!.textContent).toContain("Choisissez une formule");
    expect(screen.getAllByText(MSG_R.valueMissing)).toHaveLength(1);
    for (const r of screen.getAllByRole("radio")) expect(r.getAttribute("aria-invalid")).toBe("true");
  });

  it("une sélection valide n'accuse rien", () => {
    render(
      <Radio.Group label="Formule" value="annuel" onValueChange={() => {}} verdict={Validation.fromSelection("formule", ["annuel"], { required: true }, MSG_R)}>
        <Radio value="annuel" label="Annuel" />
      </Radio.Group>,
    );
    expect(screen.getByRole("radio").getAttribute("aria-invalid")).toBeNull();
    expect(screen.queryByText(MSG_R.valueMissing)).toBeNull();
  });

  it("le focus du groupe atteint la première option — un fieldset n'est pas focalisable", async () => {
    const user = userEvent.setup();
    render(
      <Radio.Group label="Formule" value={undefined} onValueChange={() => {}} verdict={vide}>
        <Radio id="formule" value="mensuel" label="Mensuel" />
        <Radio value="annuel" label="Annuel" />
      </Radio.Group>,
    );
    document.getElementById("formule")!.focus();
    expect(document.activeElement).toBe(document.getElementById("formule"));
    await user.tab();
    expect(document.activeElement).not.toBe(document.getElementById("formule"));
  });

  it("axe-core : un groupe de radios en erreur ne crée aucune violation", async () => {
    const { container } = render(
      <Radio.Group label="Formule" value={undefined} onValueChange={() => {}} verdict={vide}>
        <Radio value="mensuel" label="Mensuel" />
      </Radio.Group>,
    );
    expect(await violations(container)).toHaveLength(0);
  });
});
