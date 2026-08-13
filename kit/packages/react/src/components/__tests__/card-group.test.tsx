/**
 * Tests CardGroup — le pattern COLLECTION après le rétablissement des frontières
 * (2026-07-30) : une seule anatomie de carte (`Card`), la collection assemble et
 * orchestre sans jamais redessiner l'intérieur de ses items.
 * Verrouillent : l'absence de seconde anatomie (l'ex-`CardGroup.Card`), les enfants
 * = vraies Card, la transmission mode/densité par contexte, le balisage liste/cellule,
 * la sélection clavier (portée par la CARTE), les cartes sans cible, le chargement,
 * les régimes joint/séparé, et la composition Media/Actions/TitleLink/TitleCommand.
 */
import * as React from "react";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Card } from "../card/card";
import { CardGroup } from "../card-group/card-group";

/**
 * Erreur VOLONTAIRE de rendu : l'assertion porte sur le THROW, jamais sur la trace.
 * Deux sources de bruit sont à éteindre, et seulement pendant l'appel :
 *   • React journalise l'erreur avec `console.error` avant de la propager ;
 *   • jsdom republie l'exception non capturée en « Uncaught [Error: …] » par l'événement
 *     `error` de la fenêtre — que `console.error` ne couvre pas (c'est cette trace-là qui
 *     doublait chaque garde de frontière dans la sortie).
 * Rien n'est masqué globalement : hors de ce helper, une panne reste immédiatement lisible.
 */
const enSilence = (fn: () => void) => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  const avale = (e: ErrorEvent) => e.preventDefault();
  window.addEventListener("error", avale);
  try {
    fn();
  } finally {
    window.removeEventListener("error", avale);
    spy.mockRestore();
  }
};

const uneCarte = (titre: string, props: React.ComponentProps<typeof Card.Root> = {}) => (
  <Card.Root key={titre} {...props}>
    <Card.Body>
      <Card.Header>
        <Card.Title>{titre}</Card.Title>
      </Card.Header>
      <Card.Description>Description de {titre}.</Card.Description>
    </Card.Body>
  </Card.Root>
);

describe("CardGroup / une seule anatomie de carte", () => {
  it("n'expose plus l'API CardGroup.Card (seconde anatomie supprimée)", () => {
    expect((CardGroup as unknown as Record<string, unknown>).Card).toBeUndefined();
    expect(CardGroup.Root).toBe(CardGroup); // seule sous-entrée : Root (alias de la racine)
    const sousApis = Object.keys(CardGroup).filter((k) => /^[A-Z]/.test(k));
    expect(sousApis).toEqual(["Root"]);
  });

  it("ne rend AUCUNE surface de carte de son cru : autant de .ds-card que d'enfants Card", () => {
    const { container } = render(
      <CardGroup label="Deux cartes">{[uneCarte("Une"), uneCarte("Deux")]}</CardGroup>,
    );
    expect(container.querySelectorAll(".ds-card").length).toBe(2);
    // et rien qui ressemble à l'ancienne anatomie interne du pattern
    expect(container.querySelector(".cg-chip")).toBeNull();
    expect(container.querySelector(".cg-cmd")).toBeNull();
  });

  it("ses enfants sont les VÉRITABLES Card : chaque cellule héberge un Card.Root", () => {
    const { container } = render(
      <CardGroup label="Vraies cartes">{[uneCarte("Une"), uneCarte("Deux")]}</CardGroup>,
    );
    const cellules = container.querySelectorAll(".cg-cell");
    expect(cellules.length).toBe(2);
    for (const c of cellules) expect(c.querySelector(".ds-card")).not.toBeNull();
  });
});

describe("CardGroup / frontière exécutable — enfants directs Card.Root uniquement", () => {
  it("refuse un élément natif (div) avec un message explicite", () => {
    enSilence(() => {
      expect(() =>
        render(<CardGroup label="X">{(<div>intrus</div>) as never}</CardGroup>),
      ).toThrow(/enfants DIRECTS[\s\S]*<div>/);
    });
  });

  it("refuse un contrôle (button) — autre anatomie, même interactif", () => {
    enSilence(() => {
      expect(() =>
        render(<CardGroup label="X">{(<button type="button">non</button>) as never}</CardGroup>),
      ).toThrow(/Card\.Root/);
    });
  });

  it("refuse un composant intermédiaire MÊME s'il rend une Card (la frontière doit être lisible dans l'arbre)", () => {
    const EnveloppeDemo = () => uneCarte("Cachée");
    enSilence(() => {
      expect(() =>
        render(<CardGroup label="X">{(<EnveloppeDemo />) as never}</CardGroup>),
      ).toThrow(/composant intermédiaire|EnveloppeDemo/);
    });
  });

  it("refuse un Fragment et du texte nu", () => {
    enSilence(() => {
      expect(() =>
        render(<CardGroup label="X">{(<>{uneCarte("Une")}</>) as never}</CardGroup>),
      ).toThrow(/Fragment/);
      expect(() =>
        render(<CardGroup label="X">{"du texte" as never}</CardGroup>),
      ).toThrow(/texte/);
    });
  });

  it("accepte les conditions et listes de Card.Root (false/null filtrés par React)", () => {
    const { container } = render(
      <CardGroup label="OK">
        {false}
        {null}
        {[uneCarte("Une"), uneCarte("Deux")]}
      </CardGroup>,
    );
    expect(container.querySelectorAll(".ds-card").length).toBe(2);
  });
});

describe("CardGroup / mode et densité de collection", () => {
  it("transmet mode et densité à TOUTES les cartes par contexte", () => {
    const { container } = render(
      <CardGroup mode="clickable" density="compact" label="Collection">
        {[uneCarte("Une"), uneCarte("Deux"), uneCarte("Trois")]}
      </CardGroup>,
    );
    const cartes = [...container.querySelectorAll(".ds-card")];
    expect(cartes.length).toBe(3);
    for (const c of cartes) {
      expect(c).toHaveAttribute("data-mode", "clickable");
      expect(c).toHaveAttribute("data-density", "compact");
    }
  });

  it("hors collection, Card garde ses propres défauts (static / comfortable)", () => {
    const { container } = render(uneCarte("Seule"));
    const carte = container.querySelector(".ds-card");
    expect(carte).toHaveAttribute("data-mode", "static");
    expect(carte).toHaveAttribute("data-density", "comfortable");
  });
});

describe("CardGroup / balisage liste et cellule", () => {
  it("role=list étiqueté + un listitem par carte — la CELLULE appartient à la collection", () => {
    render(<CardGroup label="Guides">{[uneCarte("Une"), uneCarte("Deux")]}</CardGroup>);
    const liste = screen.getByRole("list", { name: "Guides" });
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(2);
    for (const it_ of items) {
      expect(liste.contains(it_)).toBe(true);
      expect(it_.className).toContain("cg-cell");
    }
  });
});

describe("CardGroup / sélection (portée par la CARTE)", () => {
  it("collection selectable : rôle button + aria-pressed sur chaque carte, bascule au clic", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CardGroup mode="selectable" label="Choix">
        <Card.Root selected={false} onSelectedChange={onChange}>
          <Card.Body>
            <Card.Header>
              <Card.Title>Option A</Card.Title>
            </Card.Header>
          </Card.Body>
        </Card.Root>
      </CardGroup>,
    );
    const carte = screen.getByRole("button");
    expect(carte).toHaveAttribute("aria-pressed", "false");
    await user.click(carte);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("sélection au CLAVIER : Espace et Entrée basculent, sur la carte focalisée", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CardGroup mode="selectable" label="Choix">
        <Card.Root selected={false} onSelectedChange={onChange}>
          <Card.Body>
            <Card.Header>
              <Card.Title>Option A</Card.Title>
            </Card.Header>
          </Card.Body>
        </Card.Root>
      </CardGroup>,
    );
    const carte = screen.getByRole("button");
    expect(carte).toHaveAttribute("tabindex", "0");
    carte.focus();
    await user.keyboard(" ");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("l'état sélectionné expose aria-pressed=true et la coche non chromatique", () => {
    const { container } = render(
      <CardGroup mode="selectable" label="Choix">
        <Card.Root selected>
          <Card.Body>
            <Card.Header>
              <Card.Title>Option A</Card.Title>
            </Card.Header>
          </Card.Body>
        </Card.Root>
      </CardGroup>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".ds-card-check")).not.toBeNull();
  });
});

describe("CardGroup / carte sans cible dans une collection interactive", () => {
  it("une Card mode=static explicite reste statique et sa cellule est ignorée du highlight", () => {
    const { container } = render(
      <CardGroup mode="clickable" label="Règles">
        {[uneCarte("Avec détail"), uneCarte("Sans détail", { mode: "static" })]}
      </CardGroup>,
    );
    const cartes = [...container.querySelectorAll(".ds-card")];
    expect(cartes[0]).toHaveAttribute("data-mode", "clickable");
    expect(cartes[1]).toHaveAttribute("data-mode", "static");
    const cellules = [...container.querySelectorAll(".cg-cell")];
    expect(cellules[0].className).not.toContain("cg-cell--inactive");
    expect(cellules[1].className).toContain("cg-cell--inactive");
  });
});

describe("CardGroup / chargement", () => {
  it("aria-busy vit sur la COLLECTION ; les squelettes des cartes sont aria-hidden", () => {
    const { container } = render(
      <CardGroup loading label="Chargement">
        {[uneCarte("Une", { loading: true }), uneCarte("Deux", { loading: true })]}
      </CardGroup>,
    );
    expect(screen.getByRole("list", { name: "Chargement" })).toHaveAttribute("aria-busy", "true");
    const squelettes = container.querySelectorAll('.ds-card[aria-hidden="true"]');
    expect(squelettes.length).toBe(2);
    expect(container.querySelector(".ds-card-title")).toBeNull(); // aucun contenu réel rendu
  });
});

describe("CardGroup / régimes joint et séparé", () => {
  it("joint par défaut : filets internes rendus, classe joined", () => {
    const { container } = render(
      <CardGroup label="Jointes">{[uneCarte("Une"), uneCarte("Deux")]}</CardGroup>,
    );
    const grp = container.querySelector(".cardgrp");
    expect(grp?.className).toContain("joined");
    expect(grp?.className).not.toContain("sep");
    expect(container.querySelectorAll(".cg-hb").length).toBe(2);
  });

  it("separated : gouttières, classe sep", () => {
    const { container } = render(
      <CardGroup separated label="Séparées">{[uneCarte("Une"), uneCarte("Deux")]}</CardGroup>,
    );
    expect(container.querySelector(".cardgrp")?.className).toContain("sep");
  });

  it("solo : une carte isolée, sans highlight de proximité", () => {
    const { container } = render(
      <CardGroup solo mode="clickable" label="Isolée">{uneCarte("Seule")}</CardGroup>,
    );
    expect(container.querySelector(".cardgrp")?.className).toContain("solo");
    expect(container.querySelector(".cg-hl")).toBeNull();
  });
});

describe("CardGroup / composition avec l'anatomie réelle de Card", () => {
  it("Card.Media, Card.Actions et Card.TitleLink composent dans la collection", () => {
    const { container } = render(
      <CardGroup mode="clickable" separated label="Guides">
        <Card.Root>
          <Card.Media>
            <img src="/visuel.webp" alt="" />
          </Card.Media>
          <Card.Body>
            <Card.Header>
              <Card.Title>
                <Card.TitleLink href="/guides/commencer">Commencer</Card.TitleLink>
              </Card.Title>
            </Card.Header>
            <Card.Description>Installer et brancher le kit.</Card.Description>
            <Card.Actions>
              <button type="button">Aperçu</button>
            </Card.Actions>
          </Card.Body>
        </Card.Root>
      </CardGroup>,
    );
    // la cible étendue est un VRAI lien, rendu par Card (pas par la collection)
    const lien = screen.getByRole("link", { name: "Commencer" });
    expect(lien).toHaveAttribute("href", "/guides/commencer");
    expect(lien.className).toContain("ds-card-title-link");
    expect(container.querySelector(".ds-card-media img")).not.toBeNull();
    // La zone d'actions est le PIED de la colonne de CONTENU : elle vit dans Card.Body, et
    // n'est donc jamais un troisième bloc de la surface (sinon l'état rangée en fait une
    // colonne — le défaut corrigé le 2026-07-30 au soir).
    const actions = container.querySelector(".ds-card-actions");
    expect(actions).not.toBeNull();
    expect(actions!.parentElement!.className).toContain("ds-card-body");
    expect(container.querySelector(".ds-card-surface > .ds-card-actions")).toBeNull();
    // …et elle reste un SIBLING du lien étendu, jamais son descendant (CARD-R23).
    expect(actions!.querySelector("a")).toBeNull();
  });


  it("Card.TitleCommand : la cible étendue-commande est un VRAI bouton (jamais un lien factice)", async () => {
    const user = userEvent.setup();
    const ouvrir = vi.fn();
    render(
      <CardGroup mode="clickable" label="Règles">
        <Card.Root>
          <Card.Body>
            <Card.Header>
              <Card.Title>
                <Card.TitleCommand onClick={ouvrir}>Comprendre la règle</Card.TitleCommand>
              </Card.Title>
            </Card.Header>
          </Card.Body>
        </Card.Root>
      </CardGroup>,
    );
    const cmd = screen.getByRole("button", { name: "Comprendre la règle" });
    expect(cmd.tagName).toBe("BUTTON");
    expect(cmd).toHaveAttribute("type", "button");
    await user.click(cmd);
    expect(ouvrir).toHaveBeenCalledTimes(1);
  });
});

describe("Atelier / les démos consomment directement Card et la vraie frontière du pattern", () => {
  const ici = dirname(fileURLToPath(import.meta.url));
  const atelier = join(ici, "../../../../../apps/site/app/ui");

  it("la démo Card/CardGroup de l'atelier compose l'API publique (Card.Root), sans API locale ni carte intermédiaire", () => {
    const src = readFileSync(join(atelier, "card-group.tsx"), "utf8");
    expect(src).toMatch(/import .*\bCard\b.* from "@fili\/react"/);
    expect(src).toContain("<Card.Root");
    expect(src).not.toContain("CardGroup.Card");
    expect(src).not.toContain("<DemoCard"); // plus aucun composant entre CardGroup et ses cartes
    // La zone d'actions n'exige plus que l'appelant lui rende son retrait à la main :
    // elle est le pied de la colonne de contenu et vit dans Card.Body (correctif 2026-07-30).
    expect(src).not.toMatch(/<Card\.Actions className="px-md/);
  });

  it("les extraits affichés sont l'API publique copiable (Card.Root / CardGroup), jamais un helper <CardGroup s={{…}} />", () => {
    const src = readFileSync(join(atelier, "card-group.tsx"), "utf8");
    expect(src).not.toMatch(/<CardGroup s=/);
    expect(src).toMatch(/<Card\.Root/); // le générateur d'extraits émet l'anatomie réelle
    const registry = readFileSync(join(atelier, "registry.tsx"), "utf8");
    expect(registry).toContain("CardDemo");
    expect(registry).not.toContain("codeCardSolo");
  });

  it("PREUVE runtime : la démo CardGroup rend des Card.Root directs — la validation du pattern passe", async () => {
    const { CardGroupDemo } = await import("../../../../../apps/site/app/ui/card-group");
    // Si un composant intermédiaire s'était glissé entre CardGroup et ses cartes, le
    // rendu jetterait (frontière exécutable) : le succès EST la preuve.
    const { container } = render(
      <CardGroupDemo s={{ density: "comfortable", cols: "2", separated: true, mode: "clickable", skeleton: false }} />,
    );
    expect(container.querySelectorAll(".ds-card").length).toBe(4);
    expect(container.querySelectorAll('[role="listitem"]').length).toBe(4);
    expect(container.querySelectorAll("a.ds-card-title-link").length).toBe(4);
  });

  it("PREUVE runtime : l'entrée Card reste une vraie Card seule (Card.Root direct, hors collection)", async () => {
    const { CardDemo } = await import("../../../../../apps/site/app/ui/card-group");
    const { container } = render(
      <CardDemo s={{ media: "icône", icone: "au-dessus", adaptive: true, description: true, buttons: false, density: "comfortable", mode: "static", skeleton: false }} />,
    );
    expect(container.querySelectorAll(".ds-card").length).toBe(1);
    expect(container.querySelector('[role="list"]')).toBeNull(); // pas de collection autour
    expect(container.querySelector(".ds-card-icon")).not.toBeNull();
  });
});

/**
 * RÉGIME DE SÉLECTION (CARD-R26) — ajouté le 2026-07-30. La règle « dans un groupe de cartes
 * sélectionnables, toutes partagent le même mode (single ou multi) » était écrite et non
 * tenue : `mode="selectable"` était implicitement cumulable, le choix exclusif impossible.
 */
describe("CardGroup / régime de sélection — la règle collective devient exécutable (CARD-R26)", () => {
  const carte = (v: string, titre: string) => (
    <Card.Root key={v} value={v}>
      <Card.Body>
        <Card.Header><Card.Title>{titre}</Card.Title></Card.Header>
      </Card.Body>
    </Card.Root>
  );

  function Exclusif({ initiale = "annuel" as string | null }) {
    const [v, setV] = React.useState<string | null>(initiale);
    return (
      <CardGroup mode="selectable" selection="single" label="Formule" value={v} onValueChange={setV}>
        {carte("mensuel", "Mensuel")}
        {carte("annuel", "Annuel")}
        {carte("trois-ans", "Trois ans")}
      </CardGroup>
    );
  }

  it("le groupe devient une QUESTION : radiogroup + radios, plus aucune liste", () => {
    const { container } = render(<Exclusif />);
    expect(screen.getByRole("radiogroup", { name: "Formule" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(container.querySelector('[role="list"]')).toBeNull();
    expect(container.querySelector('[role="listitem"]')).toBeNull();
  });

  it("une seule carte est cochée, et en choisir une autre libère la première", async () => {
    const user = userEvent.setup();
    render(<Exclusif />);
    const [mensuel, annuel] = screen.getAllByRole("radio");
    expect(annuel.getAttribute("aria-checked")).toBe("true");
    await user.click(mensuel);
    expect(mensuel.getAttribute("aria-checked")).toBe("true");
    expect(annuel.getAttribute("aria-checked")).toBe("false");
  });

  it("un seul arrêt de tabulation : la tabulation entre sur l'option retenue (APG)", () => {
    render(<Exclusif />);
    const radios = screen.getAllByRole("radio");
    expect(radios.map((r) => r.getAttribute("tabindex"))).toEqual(["-1", "0", "-1"]);
  });

  it("sans option retenue, la tabulation entre sur la PREMIÈRE", () => {
    render(<Exclusif initiale={null} />);
    expect(screen.getAllByRole("radio").map((r) => r.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });

  it("les flèches circulent ET retiennent — la sélection suit le focus", async () => {
    const user = userEvent.setup();
    render(<Exclusif />);
    const radios = screen.getAllByRole("radio");
    radios[1].focus();
    await user.keyboard("{ArrowDown}");
    expect(radios[2].getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(radios[2]);
    await user.keyboard("{ArrowDown}"); // circulaire
    expect(radios[0].getAttribute("aria-checked")).toBe("true");
  });

  it("rechoisir l'option déjà retenue ne la dé-coche pas (comme un radio)", async () => {
    const user = userEvent.setup();
    render(<Exclusif />);
    const annuel = screen.getAllByRole("radio")[1];
    await user.click(annuel);
    expect(annuel.getAttribute("aria-checked")).toBe("true");
  });

  it("régime cumulable : group + cases, chacune un arrêt de tabulation", async () => {
    const user = userEvent.setup();
    function Cumulable() {
      const [v, setV] = React.useState<string[]>(["annuel"]);
      return (
        <CardGroup mode="selectable" selection="multiple" label="Sujets suivis" value={v} onValueChange={setV}>
          {carte("mensuel", "Mensuel")}
          {carte("annuel", "Annuel")}
        </CardGroup>
      );
    }
    const { container } = render(<Cumulable />);
    expect(container.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe("Sujets suivis");
    const cases = screen.getAllByRole("checkbox");
    expect(cases.map((c) => c.getAttribute("tabindex"))).toEqual(["0", "0"]);
    await user.click(cases[0]);
    expect(cases.map((c) => c.getAttribute("aria-checked"))).toEqual(["true", "true"]);
    await user.click(cases[1]);
    expect(cases.map((c) => c.getAttribute("aria-checked"))).toEqual(["true", "false"]);
  });

  /**
   * RÉGRESSION — même défaut que `Checkbox.Group`, même origine : la dépendance du mémo
   * était une sérialisation `join("|")`, et `["a|b"]` ne s'y distingue pas de `["a", "b"]`.
   * Avec un `onValueChange` stable, le contexte de collection restait figé et les cartes
   * gardaient l'état précédent (constat d'audit du 2026-07-30).
   */
  it("COLLISION de sérialisation : ['a|b'] puis ['a','b'] — les cartes suivent la sélection", () => {
    const onValueChange = vi.fn(); // le MÊME callback d'un rendu à l'autre
    const Etiquettes = ({ value }: { value: string[] }) => (
      <CardGroup mode="selectable" selection="multiple" label="Étiquettes" value={value} onValueChange={onValueChange}>
        {carte("a|b", "Alpha")}
        {carte("a", "Bravo")}
        {carte("b", "Charlie")}
      </CardGroup>
    );
    const etats = () => screen.getAllByRole("checkbox").map((c) => c.getAttribute("aria-checked"));

    const { rerender } = render(<Etiquettes value={["a|b"]} />);
    expect(etats()).toEqual(["true", "false", "false"]);

    rerender(<Etiquettes value={["a", "b"]} />);
    expect(etats()).toEqual(["false", "true", "true"]);
  });

  it("sans régime déclaré, rien ne change : liste, aria-pressed, cartes autonomes", () => {
    const { container } = render(
      <CardGroup mode="selectable" label="Choix">
        <Card.Root selected onSelectedChange={() => {}}>
          <Card.Body><Card.Header><Card.Title>A</Card.Title></Card.Header></Card.Body>
        </Card.Root>
      </CardGroup>,
    );
    expect(container.querySelector('[role="list"]')).toBeTruthy();
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("un régime sans mode selectable échoue explicitement", () => {
    enSilence(() => {
      expect(() =>
        render(
          // @ts-expect-error — le type refuse déjà la combinaison ; on vérifie la garde runtime.
          <CardGroup mode="clickable" selection="single" label="Formule">
            {carte("a", "A")}
          </CardGroup>,
        ),
      ).toThrow(/selection="single" n'a de sens qu'avec mode="selectable"/);
    });
  });

  it("une carte sans `value` sous régime échoue explicitement, en nommant son rang", () => {
    enSilence(() => {
      expect(() =>
        render(
          <CardGroup mode="selectable" selection="single" label="Formule">
            {carte("a", "A")}
            <Card.Root>
              <Card.Body><Card.Header><Card.Title>B</Card.Title></Card.Header></Card.Body>
            </Card.Root>
          </CardGroup>,
        ),
      ).toThrow(/la carte n° 2 n'a pas de `value`/);
    });
  });

  it("un groupe à choisir sans nom accessible échoue — la proximité ne rattache rien", () => {
    enSilence(() => {
      expect(() =>
        render(
          <CardGroup mode="selectable" selection="single">
            {carte("a", "A")}
          </CardGroup>,
        ),
      ).toThrow(/doit porter la QUESTION comme nom accessible/);
    });
  });
});

/**
 * `Card.TitleLink asChild` — Stabilisation 0.2 (2026-07-30).
 *
 * La capacité est portée par le CODE et par le consommateur, mais le manifeste ne décrit
 * que les props du Root : rien n'empêchait `asChild` de disparaître sans qu'aucune garde
 * ne bronche. Ce bloc tient les trois bouts — le rendu, le consommateur réel, le contrat
 * publié — en attendant que le schéma du manifeste couvre les sous-composants compound.
 */
describe("Card.TitleLink asChild — la porte du routeur, tenue par une garde", () => {
  const ici2 = dirname(fileURLToPath(import.meta.url));
  const RACINE = join(ici2, "../../../../..");

  it("rend l'enfant fourni — UN seul lien, qui garde la facture de la cible étendue", () => {
    render(
      <Card.Root mode="clickable">
        <Card.Body>
          <Card.Header>
            <Card.Title as="h3">
              <Card.TitleLink asChild>
                <a href="/fili/md/card/">Card</a>
              </Card.TitleLink>
            </Card.Title>
          </Card.Header>
        </Card.Body>
      </Card.Root>,
    );
    const liens = screen.getAllByRole("link");
    expect(liens).toHaveLength(1); // pas de <a> imbriqué dans un <a>
    expect(liens[0]).toHaveAttribute("href", "/fili/md/card/");
    expect(liens[0].className).toContain("ds-card-title-link");
    expect(liens[0].className).toContain("ds-interactive-target");
  });

  it("le consommateur réel compose le routeur, jamais une adresse écrite à la main", () => {
    const src = readFileSync(join(RACINE, "apps/site/app/md/grille-sujets.tsx"), "utf8");
    expect(src).toContain("Card.TitleLink asChild");
    expect(src).toMatch(/from "next\/link"/);
    expect(src).not.toMatch(/<a\s/); // aucun lien natif : c'est ce défaut qui a été corrigé
  });

  it("le contrat PUBLIÉ porte la capacité et avoue ce qu'il ne décrit pas encore", () => {
    const manifeste = JSON.parse(readFileSync(join(RACINE, "packages/react/manifest.json"), "utf8"));
    const card = manifeste.entries.find((e: { name: string }) => e.name === "Card");
    expect(card.anatomy).toContain("Card.TitleLink");
    expect(
      (card.canonicalExamples ?? []).some((x: { code: string }) => x.code.includes("Card.TitleLink asChild")),
    ).toBe(true);
    // Le trou de couverture est NOMMÉ dans le manifeste, pas seulement dans un rapport.
    expect(card.dette).toMatch(/sous-composants compound/);
  });
});

/**
 * Dérivations PURES (2026-07-30, micro-passe de stabilisation). `items`, `cles`, `valeurs` et
 * `retenues` viennent chacune d'un `useMemo` — plus aucune identité tenue dans une ref
 * comparée pendant le rendu. Les effets de disposition (filets, coins) sont gouvernés par
 * `cles` : ce bloc vérifie qu'ils continuent d'être rejoués quand la liste change de taille
 * ou d'ordre, ce qu'une dépendance mal dérivée casserait en silence.
 */
describe("CardGroup / la disposition suit la LISTE", () => {
  const liste = (titres: string[]) => (
    <CardGroup label="Guides" separated>
      {titres.map((t) => uneCarte(t))}
    </CardGroup>
  );

  it("changer le nombre d'enfants, puis leur ordre, recalcule filets et coins", () => {
    const { container, rerender } = render(liste(["Un", "Deux", "Trois"]));
    const cellules = () => [...container.querySelectorAll(".cg-cell")];
    const marque = (classe: string) => cellules().findIndex((c) => c.classList.contains(classe));

    expect(cellules()).toHaveLength(3);
    expect(marque("c-tl")).toBe(0);
    expect(marque("c-br")).toBe(2);

    rerender(liste(["Un", "Deux"]));
    expect(cellules()).toHaveLength(2);
    expect(marque("c-br")).toBe(1); // le coin a suivi la nouvelle dernière cellule

    rerender(liste(["Deux", "Un"]));
    expect(cellules()[0].textContent).toContain("Deux"); // les clés ont changé d'ordre
    expect(marque("c-tl")).toBe(0);
    expect(marque("c-br")).toBe(1);
  });
});
