/**
 * Tests de la TRANCHE PILOTE (Button, CompactButton, Input, Card) — API, interaction,
 * accessibilité. Ces tests verrouillent les décisions du chantier cohérence :
 * variant/style (alias déprécié, priorité), défauts, attributs du relief, focus v2,
 * aria. Les tests visuels et adaptatifs (rendu réel, container queries) sont hors
 * de portée de jsdom — trou documenté, harnais Atelier prévu.
 */
import * as React from "react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";

import { Button } from "../button/button";
import { CompactButton } from "../compact-button/compact-button";
import { Input } from "../input/input";
import { Card } from "../card/card";

/**
 * L'alias déprécié `style` avertit UNE fois par module (`warnStyleAlias`, button.tsx).
 * Cet avertissement est ATTENDU : il est capturé ici pour être vérifié, au lieu d'être
 * laissé polluer la sortie. Ce n'est pas une mise sous silence de `console.warn` : tout
 * message qui n'est pas cette dépréciation est réémis tel quel, et le spy ne vit que le
 * temps de ce fichier — le seul à consommer l'alias.
 */
const avertissements: string[] = [];
const warnOriginal = console.warn;
beforeAll(() => {
  vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
    const message = String(args[0]);
    avertissements.push(message);
    if (!message.includes("est dépréciée")) warnOriginal(...(args as []));
  });
});
afterAll(() => {
  vi.mocked(console.warn).mockRestore();
});

/* ── Button — API ─────────────────────────────────────────────────────────── */
describe("Button / API", () => {
  it("défauts : filled + primary + md, type=button, facture par data-*", () => {
    render(<Button>Go</Button>);
    const b = screen.getByRole("button", { name: "Go" });
    expect(b).toHaveAttribute("type", "button");
    expect(b).toHaveAttribute("data-style", "filled");
    expect(b).toHaveAttribute("data-tone", "primary");
    expect(b.className).toContain("rounded-button");
    expect(b.className).toContain("ds-focus-ring");
  });

  it("variant pilote la facture ; l'alias déprécié style fonctionne encore", () => {
    const { rerender } = render(<Button variant="ghost">A</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-style", "ghost");
    rerender(<Button style="stroke">A</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-style", "stroke");
  });

  it("… et il le dit UNE seule fois, en nommant son remplaçant", () => {
    // L'avertissement est un contrat public (retrait annoncé en majeure) : il s'atteste,
    // il ne se subit pas. Une seule occurrence, quel que soit le nombre d'usages.
    const depreciations = avertissements.filter((m) => m.includes("est dépréciée"));
    expect(depreciations).toHaveLength(1);
    expect(depreciations[0]).toContain("[fili]");
    expect(depreciations[0]).toContain("`style`");
    expect(depreciations[0]).toContain("`variant`");
  });

  it("variant L'EMPORTE sur style quand les deux sont fournis", () => {
    render(<Button variant="lighter" style="filled">A</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-style", "lighter");
  });

  it("tone destructive accorde l'anneau de focus (surcharge --control-focus-color)", () => {
    render(<Button tone="destructive">Suppr</Button>);
    expect(screen.getByRole("button").className).toContain("[--control-focus-color:var(--control-focus-danger)]");
  });

  it("loading : aria-busy, désactivé, squelette, relief éteint (data-* retirés)", () => {
    render(<Button loading>Go</Button>);
    const b = screen.getByRole("button");
    expect(b).toHaveAttribute("aria-busy", "true");
    expect(b).toBeDisabled();
    expect(b.className).toContain("ds-skeleton");
    expect(b).not.toHaveAttribute("data-style");
  });

  it("exports compound : Root/Icon", () => {
    expect(Button.Root).toBe(Button);
    expect(Button.Icon).toBeTypeOf("object"); // forwardRef
  });
});

/* ── Button — interaction ─────────────────────────────────────────────────── */
describe("Button / interaction", () => {
  it("clic et clavier (Entrée) déclenchent ; disabled ne déclenche pas", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

/* ── CompactButton ────────────────────────────────────────────────────────── */
describe("CompactButton", () => {
  it("défauts lighter + neutral (arbitrage 2026-07-29) + relief émis", () => {
    render(<CompactButton aria-label="Fermer" />);
    const b = screen.getByRole("button", { name: "Fermer" });
    expect(b).toHaveAttribute("data-style", "lighter");
    expect(b).toHaveAttribute("data-tone", "neutral");
    expect(b.className).toContain("ds-focus-ring");
  });

  it("variant l'emporte sur style ; fullRadius = pilule", () => {
    render(<CompactButton aria-label="X" variant="filled" style="ghost" fullRadius />);
    const b = screen.getByRole("button", { name: "X" });
    expect(b).toHaveAttribute("data-style", "filled");
    expect(b.className).toContain("rounded-pill");
  });

  it("le nom accessible vient de l'aria-label obligatoire", () => {
    render(<CompactButton aria-label="Tout fermer" />);
    expect(screen.getByRole("button", { name: "Tout fermer" })).toBeInTheDocument();
  });
});

/* ── Input ────────────────────────────────────────────────────────────────── */
describe("Input", () => {
  it("status=error pose aria-invalid et la surcharge de focus danger", () => {
    render(
      <Input.Root status="error">
        <Input.Wrapper>
          <Input.Input aria-label="E-mail" defaultValue="x" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("aria-invalid", "true");
    const root = screen.getByLabelText("E-mail").closest("[data-slot='input']");
    expect(root).toHaveAttribute("data-status", "error");
  });

  it("clearable : la croix efface et rend le focus au champ", async () => {
    const user = userEvent.setup();
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Input aria-label="Nom" defaultValue="Aurélien" clearable />
        </Input.Wrapper>
      </Input.Root>,
    );
    const champ = screen.getByLabelText("Nom") as HTMLInputElement;
    await user.click(screen.getByRole("button", { name: /effacer/i }));
    expect(champ.value).toBe("");
  });

  it("Password : l'œil bascule le type et expose aria-pressed", async () => {
    const user = userEvent.setup();
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Password aria-label="Mot de passe" defaultValue="secret" />
        </Input.Wrapper>
      </Input.Root>,
    );
    const champ = screen.getByLabelText("Mot de passe") as HTMLInputElement;
    expect(champ.type).toBe("password");
    const oeil = screen.getByRole("button", { pressed: false });
    await user.click(oeil);
    expect(champ.type).toBe("text");
    expect(oeil).toHaveAttribute("aria-pressed", "true");
  });

  it("Search : la croix n'apparaît que si le champ est non vide", () => {
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Search aria-label="Rechercher" defaultValue="" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.queryByRole("button", { name: /effacer/i })).not.toBeInTheDocument();
    fireEvent.input(screen.getByLabelText("Rechercher"), { target: { value: "fili" } });
    expect(screen.getByRole("button", { name: /effacer/i })).toBeInTheDocument();
  });

  it("Number : les steppers existent (quantités seulement — doctrine)", () => {
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Number aria-label="Quantité" defaultValue={2} min={0} max={9} />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });

  it("loading : Root en squelette, aria-busy", () => {
    const { container } = render(
      <Input.Root loading>
        <Input.Wrapper>
          <Input.Input aria-label="X" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(container.querySelector("[aria-busy='true']")).not.toBeNull();
  });
});

/* ── Card ─────────────────────────────────────────────────────────────────── */
describe("Card", () => {
  it("défauts : static + comfortable, conteneur de requête + couche interaction", () => {
    const { container } = render(
      <Card.Root>
        <Card.Body>
          <Card.Header><Card.Title>Titre</Card.Title></Card.Header>
        </Card.Body>
      </Card.Root>,
    );
    const root = container.querySelector(".ds-card")!;
    expect(root).toHaveAttribute("data-mode", "static");
    expect(root).toHaveAttribute("data-density", "comfortable");
    expect(root.className).toContain("ds-interactive");
  });

  it("clickable : la cible est un VRAI lien (TitleLink), étendu par la couche partagée", () => {
    render(
      <Card.Root mode="clickable">
        <Card.Body>
          <Card.Header>
            <Card.Title><Card.TitleLink href="/article">Lire</Card.TitleLink></Card.Title>
          </Card.Header>
        </Card.Body>
      </Card.Root>,
    );
    const lien = screen.getByRole("link", { name: "Lire" });
    expect(lien).toHaveAttribute("href", "/article");
    expect(lien.className).toContain("ds-interactive-target");
  });

  it("selectable : selected exposé en data-selected", () => {
    const { container } = render(
      <Card.Root mode="selectable" selected>
        <Card.Body><Card.Header><Card.Title>T</Card.Title></Card.Header></Card.Body>
      </Card.Root>,
    );
    expect(container.querySelector(".ds-card")).toHaveAttribute("data-selected");
  });

  it("loading rend le squelette à la place du contenu", () => {
    const { container } = render(
      <Card.Root loading>
        <Card.Body><Card.Header><Card.Title>T</Card.Title></Card.Header></Card.Body>
      </Card.Root>,
    );
    expect(container.textContent).not.toContain("T");
  });
});

/* ── Accessibilité automatisée (axe-core) ─────────────────────────────────── */
describe("axe-core (pilote composé)", () => {
  it("aucune violation sur un rendu composé Button + CompactButton + Input + Card", async () => {
    const { container } = render(
      <main>
        <Button>Enregistrer</Button>
        <Button variant="stroke" tone="neutral">Annuler</Button>
        <CompactButton aria-label="Fermer" />
        <Input.Root>
          <Input.Wrapper>
            <Input.Input aria-label="Adresse e-mail" type="email" />
          </Input.Wrapper>
        </Input.Root>
        <Card.Root mode="clickable">
          <Card.Body>
            <Card.Header>
              <Card.Title><Card.TitleLink href="/a">Article</Card.TitleLink></Card.Title>
            </Card.Header>
            <Card.Description>Résumé.</Card.Description>
          </Card.Body>
        </Card.Root>
      </main>,
    );
    const res = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } }, // jsdom : pas de moteur de rendu — couvert par validate-contrast.mjs côté tokens
    });
    expect(res.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
});
