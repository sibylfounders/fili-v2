/**
 * Tests de LA FAMILLE DU CHOIX (`Checkbox`, `Radio` et leurs groupes) — tranche verticale
 * du 2026-07-30, fiche de manque « famille-du-choix » (statut : validé).
 *
 * Chaque test verrouille une règle de `CHOICE-UX.md` et la cite. Ce qui est éprouvé ici,
 * ce n'est pas que le composant « marche » : c'est que les décisions doctrinales sont
 * EXÉCUTABLES — l'exclusivité au groupe, le clavier natif non réimplémenté, l'indéterminé
 * calculé, le libellé cliquable, l'erreur portée par le groupe.
 */
import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";

import { Checkbox } from "../checkbox/checkbox";
import { Radio } from "../radio/radio";

/* ───────────────────────────── Checkbox ───────────────────────────── */

describe("Checkbox — rôle natif et libellé embarqué (CHOICE-R08, R15)", () => {
  it("rend un input[type=checkbox] RÉEL, jamais un rôle recomposé", () => {
    const { container } = render(<Checkbox label="J'accepte les conditions" />);
    const input = container.querySelector("input")!;
    expect(input.type).toBe("checkbox");
    expect(input.getAttribute("role")).toBeNull();
    expect(container.querySelector('[role="checkbox"]')).toBeNull();
  });

  it("le libellé embarqué EST le nom accessible — getByLabelText suffit", () => {
    render(<Checkbox label="J'accepte les conditions" />);
    expect(screen.getByLabelText("J'accepte les conditions")).toBeTruthy();
  });

  it("cliquer le LIBELLÉ bascule la case : la cible inclut le texte (CHOICE-R16)", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Recevoir la lettre" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByText("Recevoir la lettre"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("le champ reste focalisable et Espace bascule — clavier natif, rien de réimplémenté (CHOICE-R15)", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Option" onCheckedChange={onCheckedChange} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Option"));
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("l'aide par option est reliée par aria-describedby (CHOICE-R10)", () => {
    render(<Checkbox label="Option" helper="Une phrase courte." />);
    const input = screen.getByLabelText("Option");
    const id = input.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)!.textContent).toBe("Une phrase courte.");
  });
});

describe("Checkbox — l'indéterminé se CALCULE (CHOICE-R11)", () => {
  it("est posé comme PROPRIÉTÉ DOM, pas comme attribut (React ne le sérialise pas)", () => {
    const { container } = render(<Checkbox label="Tout sélectionner" indeterminate />);
    const input = container.querySelector("input")!;
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute("indeterminate")).toBeNull();
  });

  it("n'est pas un troisième état choisissable : il ne survit pas au clic de l'utilisateur", async () => {
    const user = userEvent.setup();
    function Parent() {
      const [coche, setCoche] = React.useState(false);
      return <Checkbox label="Tout sélectionner" indeterminate={!coche} checked={coche} onCheckedChange={setCoche} />;
    }
    const { container } = render(<Parent />);
    const input = container.querySelector("input")!;
    expect(input.indeterminate).toBe(true);
    await user.click(input);
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(false);
  });
});

describe("Checkbox.Group — la question est le nom accessible (CHOICE-R06, R07, R17)", () => {
  const groupe = (props: Partial<React.ComponentProps<typeof Checkbox.Group>> = {}) => (
    <Checkbox.Group label="Centres d'intérêt" value={[]} onValueChange={() => {}} {...props}>
      <Checkbox value="design" label="Design" />
      <Checkbox value="code" label="Développement" />
    </Checkbox.Group>
  );

  it("le groupe est un fieldset dont la legend porte la question", () => {
    const { container } = render(groupe());
    const fs = container.querySelector("fieldset")!;
    expect(fs.querySelector("legend")!.textContent).toBe("Centres d'intérêt");
    expect(within(fs).getAllByRole("checkbox")).toHaveLength(2);
  });

  it("les cases restent INDÉPENDANTES : cocher l'une n'efface pas l'autre (CHOICE-R07)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(groupe({ value: ["design"], onValueChange }));
    await user.click(screen.getByLabelText("Développement"));
    expect(onValueChange).toHaveBeenCalledWith(["design", "code"]);
  });

  it("l'erreur appartient au GROUPE, pas à la première case (CHOICE-R17)", () => {
    const { container } = render(groupe({ error: "Choisissez au moins un sujet." }));
    const fs = container.querySelector("fieldset")!;
    const id = fs.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)!.textContent).toContain("Choisissez au moins un sujet.");
    // aucune case ne porte le message
    for (const c of within(fs).getAllByRole("checkbox"))
      expect(c.getAttribute("aria-describedby")).toBeNull();
  });

  it("le statut d'erreur descend sur chaque case (aria-invalid), sans être retapé à la main", () => {
    render(groupe({ error: "Choisissez au moins un sujet." }));
    for (const c of screen.getAllByRole("checkbox")) expect(c.getAttribute("aria-invalid")).toBe("true");
  });

});

/**
 * CHOICE-R18 — l'exclusivité se déclare sur l'option et s'ARBITRE dans le groupe.
 *
 * Défaut du 2026-07-30 : la bascule connaissait le caractère exclusif de l'option
 * MANIPULÉE, jamais celui des valeurs déjà cochées. Cocher une option ordinaire après
 * l'option exclusive laissait donc les deux dans le tableau. Ce bloc éprouve les deux sens
 * de la règle, le cumul, l'indépendance de deux groupes et l'aller-retour contrôlé.
 */
describe("Checkbox.Group — l'exclusivité dans les deux sens (CHOICE-R18)", () => {
  const coche = (nom: string) => (screen.getByLabelText(nom) as HTMLInputElement).checked;
  const valeurs = () => screen.getByTestId("valeurs").textContent;

  function Sujets({ initial = [] as string[] }: { initial?: string[] }) {
    const [v, setV] = React.useState<string[]>(initial);
    return (
      <>
        <Checkbox.Group label="Centres d'intérêt" value={v} onValueChange={setV}>
          <Checkbox value="design" label="Design" />
          <Checkbox value="code" label="Développement" />
          <Checkbox value="aucun" label="Aucun de ces sujets" exclusive />
        </Checkbox.Group>
        <output data-testid="valeurs">{v.join(",")}</output>
      </>
    );
  }

  it("ORDINAIRE → EXCLUSIVE : cocher l'exclusive vide toutes les ordinaires", async () => {
    const user = userEvent.setup();
    render(<Sujets initial={["design", "code"]} />);
    await user.click(screen.getByLabelText("Aucun de ces sujets"));
    expect(valeurs()).toBe("aucun");
    expect(coche("Design")).toBe(false);
    expect(coche("Développement")).toBe(false);
    expect(coche("Aucun de ces sujets")).toBe(true);
  });

  it("EXCLUSIVE → ORDINAIRE : cocher une ordinaire retire l'exclusive", async () => {
    const user = userEvent.setup();
    render(<Sujets initial={["aucun"]} />);
    await user.click(screen.getByLabelText("Design"));
    expect(valeurs()).toBe("design");
    expect(coche("Aucun de ces sujets")).toBe(false);
    expect(coche("Design")).toBe(true);
  });

  it("le va-et-vient complet du défaut : ordinaire, puis exclusive, puis ordinaire", async () => {
    const user = userEvent.setup();
    render(<Sujets />);
    await user.click(screen.getByLabelText("Design"));
    await user.click(screen.getByLabelText("Aucun de ces sujets"));
    await user.click(screen.getByLabelText("Développement"));
    expect(valeurs()).toBe("code");
    expect(coche("Aucun de ces sujets")).toBe(false);
  });

  it("PLUSIEURS ORDINAIRES cumulent entre elles ; seule l'exclusive les balaie", async () => {
    const user = userEvent.setup();
    render(<Sujets />);
    await user.click(screen.getByLabelText("Design"));
    await user.click(screen.getByLabelText("Développement"));
    expect(valeurs()).toBe("design,code");
    await user.click(screen.getByLabelText("Aucun de ces sujets"));
    expect(valeurs()).toBe("aucun");
  });

  it("l'exclusive DÉCOCHÉE laisse une sélection vide, pas un résidu", async () => {
    const user = userEvent.setup();
    render(<Sujets initial={["aucun"]} />);
    await user.click(screen.getByLabelText("Aucun de ces sujets"));
    expect(valeurs()).toBe("");
    expect(coche("Aucun de ces sujets")).toBe(false);
  });

  it("DEUX GROUPES sur la même page ne se contaminent pas", async () => {
    const user = userEvent.setup();
    const surB = vi.fn();
    function Deux() {
      const [a, setA] = React.useState<string[]>(["design"]);
      return (
        <>
          <Checkbox.Group label="Sujets A" value={a} onValueChange={setA}>
            <Checkbox value="design" label="Design A" />
            <Checkbox value="rien" label="Aucun A" exclusive />
          </Checkbox.Group>
          <Checkbox.Group label="Sujets B" value={["design"]} onValueChange={surB}>
            <Checkbox value="design" label="Design B" />
            <Checkbox value="autre" label="Autre B" />
          </Checkbox.Group>
        </>
      );
    }
    render(<Deux />);
    await user.click(screen.getByLabelText("Aucun A"));
    expect(coche("Design A")).toBe(false);
    // B n'a rien reçu et garde sa valeur : le registre des options exclusives appartient à
    // l'INSTANCE de groupe, pas au module.
    expect(surB).not.toHaveBeenCalled();
    expect(coche("Design B")).toBe(true);
    // Et « autre », option ordinaire d'un groupe sans exclusive, s'ajoute sans rien retirer.
    await user.click(screen.getByLabelText("Autre B"));
    expect(surB).toHaveBeenCalledWith(["design", "autre"]);
  });

  /**
   * RÉGRESSION — la dépendance du mémo ne peut plus être une sérialisation.
   *
   * `["a|b"]` et `["a", "b"]` donnent la même chaîne une fois jointes par `|`. Avec un
   * `onValueChange` STABLE, aucune autre dépendance ne bougeait : le contexte du groupe
   * restait figé sur la sélection précédente et les cases affichaient un état périmé
   * (constat d'audit du 2026-07-30). Ce test échoue tant que la dépendance est jointe.
   */
  it("COLLISION de sérialisation : ['a|b'] puis ['a','b'] — l'affichage suit la sélection", () => {
    const onValueChange = vi.fn(); // le MÊME callback d'un rendu à l'autre
    const Etiquettes = ({ value }: { value: string[] }) => (
      <Checkbox.Group label="Étiquettes" value={value} onValueChange={onValueChange}>
        <Checkbox value="a|b" label="Étiquette a|b" />
        <Checkbox value="a" label="Étiquette a" />
        <Checkbox value="b" label="Étiquette b" />
      </Checkbox.Group>
    );
    const { rerender } = render(<Etiquettes value={["a|b"]} />);
    expect(coche("Étiquette a|b")).toBe(true);
    expect(coche("Étiquette a")).toBe(false);

    rerender(<Etiquettes value={["a", "b"]} />);
    expect(coche("Étiquette a|b")).toBe(false);
    expect(coche("Étiquette a")).toBe(true);
    expect(coche("Étiquette b")).toBe(true);
  });

  it("l'ÉTAT CONTRÔLÉ vient du parent : le groupe propose un tableau neuf, il ne mute rien", async () => {
    const user = userEvent.setup();
    const recus: string[][] = [];
    const initial = ["aucun"];
    function Pilote() {
      const [v, setV] = React.useState<string[]>(initial);
      return (
        <Checkbox.Group
          label="Centres d'intérêt"
          value={v}
          onValueChange={(suivant) => {
            recus.push(suivant);
            setV(suivant);
          }}
        >
          <Checkbox value="design" label="Design" />
          <Checkbox value="aucun" label="Aucun de ces sujets" exclusive />
        </Checkbox.Group>
      );
    }
    render(<Pilote />);
    await user.click(screen.getByLabelText("Design"));
    expect(recus).toEqual([["design"]]);
    expect(initial).toEqual(["aucun"]); // le tableau reçu n'a pas été muté
    expect(recus[0]).not.toBe(initial);
    // C'est la valeur REPOSÉE par le parent qui pilote le rendu.
    expect(coche("Design")).toBe(true);
    expect(coche("Aucun de ces sujets")).toBe(false);
  });
});

/* ─────────────────────────────── Radio ─────────────────────────────── */

describe("Radio.Group — l'exclusivité appartient au groupe (CHOICE-R05, R06)", () => {
  const formule = (props: Partial<React.ComponentProps<typeof Radio.Group>> = {}) => (
    <Radio.Group label="Formule" value="mensuel" onValueChange={() => {}} {...props}>
      <Radio value="mensuel" label="Mensuel" />
      <Radio value="annuel" label="Annuel" />
    </Radio.Group>
  );

  it("rend des input[type=radio] RÉELS partageant un même `name`", () => {
    const { container } = render(formule());
    const radios = [...container.querySelectorAll("input")];
    expect(radios).toHaveLength(2);
    expect(radios.every((r) => r.type === "radio")).toBe(true);
    expect(new Set(radios.map((r) => r.name)).size).toBe(1);
    expect(radios[0].name).toBeTruthy();
  });

  it("deux groupes sur la même page ne se contaminent pas (nom propre à chacun)", () => {
    const { container } = render(
      <>
        {formule()}
        <Radio.Group label="Livraison" value="std" onValueChange={() => {}}>
          <Radio value="std" label="Standard" />
          <Radio value="exp" label="Express" />
        </Radio.Group>
      </>,
    );
    const noms = new Set([...container.querySelectorAll("input")].map((r) => (r as HTMLInputElement).name));
    expect(noms.size).toBe(2);
  });

  it("le groupe est un fieldset dont la legend porte la question", () => {
    const { container } = render(formule());
    expect(container.querySelector("fieldset > legend")!.textContent).toBe("Formule");
    expect(container.querySelector('[role="radiogroup"]')).toBeNull(); // sémantique native, pas ARIA recomposé
  });

  it("un seul est coché à la fois — choisir l'autre libère le premier", async () => {
    const user = userEvent.setup();
    function Choix() {
      const [v, setV] = React.useState("mensuel");
      return formule({ value: v, onValueChange: setV });
    }
    render(<Choix />);
    await user.click(screen.getByLabelText("Annuel"));
    expect((screen.getByLabelText("Annuel") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Mensuel") as HTMLInputElement).checked).toBe(false);
  });

  it("le groupe n'a QU'UN arrêt de tabulation, et les flèches y déplacent le choix (CHOICE-R14)", async () => {
    const user = userEvent.setup();
    function Choix() {
      const [v, setV] = React.useState("mensuel");
      return (
        <>
          <button type="button">avant</button>
          {formule({ value: v, onValueChange: setV })}
          <button type="button">après</button>
        </>
      );
    }
    render(<Choix />);
    await user.tab(); // « avant »
    await user.tab(); // entre dans le groupe, sur l'option COCHÉE
    expect(document.activeElement).toBe(screen.getByLabelText("Mensuel"));
    await user.keyboard("{ArrowDown}"); // la sélection suit le focus
    expect((screen.getByLabelText("Annuel") as HTMLInputElement).checked).toBe(true);
    await user.tab(); // un seul arrêt : on sort du groupe
    expect(document.activeElement).toBe(screen.getByText("après"));
  });

  it("l'erreur est portée par le groupe et le statut descend sur chaque option (CHOICE-R17)", () => {
    const { container } = render(formule({ error: "Choisissez une formule." }));
    const fs = container.querySelector("fieldset")!;
    expect(document.getElementById(fs.getAttribute("aria-describedby")!)!.textContent)
      .toContain("Choisissez une formule.");
    for (const r of within(fs).getAllByRole("radio")) expect(r.getAttribute("aria-invalid")).toBe("true");
  });
});

/* ────────────────────────── Accessibilité outillée ────────────────────────── */

describe("axe-core — la famille du choix ne produit aucune violation", () => {
  it("Checkbox.Group et Radio.Group, y compris en erreur", async () => {
    const { container } = render(
      <>
        <Checkbox.Group label="Centres d'intérêt" value={["design"]} onValueChange={() => {}} error="Choisissez au moins un sujet.">
          <Checkbox value="design" label="Design" helper="Fondations et composants." />
          <Checkbox value="aucun" label="Aucun de ces sujets" exclusive />
        </Checkbox.Group>
        <Radio.Group label="Formule" value="annuel" onValueChange={() => {}} helper="Modifiable à tout moment.">
          <Radio value="mensuel" label="Mensuel" />
          <Radio value="annuel" label="Annuel" helper="Deux mois offerts." />
        </Radio.Group>
      </>,
    );
    const res = await axe.run(container);
    expect(res.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
