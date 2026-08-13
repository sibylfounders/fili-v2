/**
 * Tests du BLOC CHAMP d'Input (`Input.Field` / `Label` / `Helper` / `Error`) — tranche livrée
 * le 2026-07-30. Elle n'invente aucune règle : la doctrine était déjà écrite, elle la rend
 * seulement TENABLE. Chaque test cite la règle qu'il verrouille.
 */
import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";

import { Input } from "../input/input";

const champ = (props: Partial<React.ComponentProps<typeof Input.Field>> = {}, helper = true) => (
  <Input.Field {...props}>
    <Input.Label>Adresse e-mail</Input.Label>
    <Input.Root>
      <Input.Wrapper>
        <Input.Input type="email" placeholder="vous@exemple.fr" />
      </Input.Wrapper>
    </Input.Root>
    {helper ? <Input.Helper>Nous ne la partagerons jamais.</Input.Helper> : null}
    <Input.Error>Le format attendu est nom@domaine.fr</Input.Error>
  </Input.Field>
);

describe("Input.Field / liaison du libellé (INPUT-R38, R33, T1)", () => {
  it("le libellé est VISIBLE et lié au champ par for/id — jamais la seule proximité", () => {
    render(champ());
    // getByLabelText ne passe que si l'association technique existe réellement.
    const input = screen.getByLabelText(/Adresse e-mail/);
    expect(input.tagName).toBe("INPUT");
    const label = screen.getByText("Adresse e-mail").closest("label")!;
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
    expect(input.getAttribute("id")).toBeTruthy();
  });

  it("cliquer le libellé place le focus dans le champ", async () => {
    const user = userEvent.setup();
    render(champ());
    await user.click(screen.getByText("Adresse e-mail"));
    expect(document.activeElement).toBe(screen.getByLabelText(/Adresse e-mail/));
  });

  it("un seul étiquetage : dans un Field, le Wrapper n'est plus un <label>", () => {
    const { container } = render(champ());
    const labels = container.querySelectorAll("label");
    expect(labels.length).toBe(1);
  });

  it("hors d'un Field, le Wrapper reste un <label> — usage autonome inchangé", () => {
    const { container } = render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Input aria-label="Champ autonome" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(container.querySelector("label")).not.toBeNull();
    expect(container.querySelector("input")!.getAttribute("id")).toBeNull();
  });
});

describe("Input.Field / requis (INPUT-R30, FORM-R10)", () => {
  it("required pose l'indicateur visible ET un équivalent textuel, pas un astérisque muet", () => {
    render(champ({ required: true }));
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(/\(obligatoire\)/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresse e-mail/)).toHaveAttribute("aria-required", "true");
  });

  it("sans required, aucun indicateur — la convention appartient au formulaire", () => {
    render(champ());
    expect(screen.queryByText("*")).toBeNull();
    expect(screen.getByLabelText(/Adresse e-mail/)).not.toHaveAttribute("aria-required");
  });
});

describe("Input.Field / helper et erreur (INPUT-R25, R26, R31)", () => {
  it("au repos : le helper est décrit par aria-describedby, aucune erreur rendue", () => {
    render(champ());
    const input = screen.getByLabelText(/Adresse e-mail/);
    const helper = screen.getByText("Nous ne la partagerons jamais.");
    expect(input.getAttribute("aria-describedby")).toBe(helper.getAttribute("id"));
    expect(screen.queryByText(/Le format attendu/)).toBeNull();
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("en erreur : le message REMPLACE le helper (R26), il ne s'empile pas", () => {
    render(champ({ status: "error" }));
    expect(screen.queryByText("Nous ne la partagerons jamais.")).toBeNull();
    const erreur = screen.getByText(/Le format attendu/);
    const input = screen.getByLabelText(/Adresse e-mail/);
    expect(input.getAttribute("aria-describedby")).toBe(erreur.closest("p")!.getAttribute("id"));
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("l'erreur ne se signale jamais par la seule couleur (R31) : icône + « Erreur » pour l'AT", () => {
    const { container } = render(champ({ status: "error" }));
    const p = container.querySelector("p.text-danger")!;
    expect(p.querySelector("svg")).not.toBeNull();
    expect(p.textContent).toMatch(/^Erreur\s*:/);
  });

  it("sans message monté, aria-describedby ne pointe pas dans le vide", () => {
    render(champ({}, false));
    expect(screen.getByLabelText(/Adresse e-mail/)).not.toHaveAttribute("aria-describedby");
  });
});

describe("Input.Field / contexte size et status (contrat Field → Root)", () => {
  it("Root lit size et status du bloc quand il ne les déclare pas", () => {
    const { container } = render(champ({ status: "error", size: "lg" }));
    const cadre = container.querySelector('[data-slot="input"]')!;
    expect(cadre.getAttribute("data-status")).toBe("error");
    expect(cadre.className).toContain("border-danger");
  });

  it("une prop explicite sur Root SURCLASSE le bloc", () => {
    const { container } = render(
      <Input.Field status="error">
        <Input.Label>Champ</Input.Label>
        <Input.Root status="success">
          <Input.Wrapper>
            <Input.Input />
          </Input.Wrapper>
        </Input.Root>
      </Input.Field>,
    );
    expect(container.querySelector('[data-slot="input"]')!.getAttribute("data-status")).toBe("success");
  });
});

describe("Input.Field / accessibilité", () => {
  it("champ complet en erreur : aucune violation axe", async () => {
    const { container } = render(champ({ status: "error", required: true }));
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("champ au repos avec aide : aucune violation axe", async () => {
    const { container } = render(champ());
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
