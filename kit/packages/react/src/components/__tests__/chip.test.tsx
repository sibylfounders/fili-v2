/**
 * Tests Chip — premier composant entré par la tranche verticale du
 * MISSING-COMPONENT-PROTOCOL (fiche chip-renvoi, 2026-07-29). Verrouillent :
 * la sémantique native (CHIP-R06), les deux factures (CHIP-U01), le mono
 * des identifiants (CHIP-R05), le focus système (CHIP-U03), asChild.
 */
import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";

import { Chip } from "../chip/chip";

describe("Chip / API", () => {
  it("défauts : <button type=button>, facture outline, focus système", () => {
    render(<Chip>BUTTON-R12</Chip>);
    const c = screen.getByRole("button", { name: "BUTTON-R12" });
    expect(c.tagName).toBe("BUTTON");
    expect(c).toHaveAttribute("type", "button"); // jamais submit implicite dans un form
    expect(c.className).toContain("border-border"); // facture outline par défaut
    expect(c.className).toContain("ds-focus-ring"); // CHIP-U03 : géométrie unique
    expect(c.className).not.toContain("font-mono");
  });

  it("variant=subtle : fond surface, filet transparent", () => {
    render(<Chip variant="subtle">Cas d'usage</Chip>);
    const c = screen.getByRole("button");
    expect(c.className).toContain("bg-surface");
    expect(c.className).toContain("border-transparent");
  });

  it("mono : chasse fixe pour les identifiants (CHIP-R05)", () => {
    render(<Chip mono>CARD-R03</Chip>);
    expect(screen.getByRole("button").className).toContain("font-mono");
  });

  it("asChild : porte un <a> quand la chip NAVIGUE (CHIP-R06), sans type=button", () => {
    render(
      <Chip asChild>
        <a href="/md/doctrine">Doctrine →</a>
      </Chip>,
    );
    const a = screen.getByRole("link", { name: "Doctrine →" });
    expect(a.tagName).toBe("A");
    expect(a).toHaveAttribute("href", "/md/doctrine");
    expect(a).not.toHaveAttribute("type");
    expect(a.className).toContain("ds-focus-ring");
  });
});

describe("Chip / interaction", () => {
  it("clic et clavier (Enter) déclenchent le renvoi", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Situations qui l'éprouvent</Chip>);
    const c = screen.getByRole("button");
    await user.click(c);
    c.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe("Chip / accessibilité", () => {
  it("nuée de chips : aucune violation axe", async () => {
    const { container } = render(
      <div className="flex flex-wrap gap-2">
        <Chip>Situations qui l'éprouvent →</Chip>
        <Chip mono>BUTTON-R12</Chip>
        <Chip asChild>
          <a href="/md/cas">Cas d'usage →</a>
        </Chip>
      </div>,
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
