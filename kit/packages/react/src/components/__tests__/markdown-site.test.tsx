/**
 * Tests du rendu MARKDOWN du site (apps/site/app/components/markdown.tsx) — fermeture du
 * chantier « consommation totale du kit » (2026-07-30) : les éléments interactifs générés
 * depuis le Markdown consomment le kit comme les pages TSX. Verrouillent : les liens
 * Markdown passent par `Link` (@fili/react, facture inline), aucun retour possible à un
 * `<a>` natif stylé localement, et les blocs `<pre>` scrollables portent l'anneau de la
 * fondation Focus/Bordure (tokens `control.focus-*`), jamais celui du navigateur.
 *
 * ROUTAGE — arbitrage du 2026-07-30 (Stabilisation 0.2), journalisé dans DECISIONS.md :
 * le contrat porte sur l'ADRESSE FINALEMENT SERVIE, pas sur la chaîne écrite dans la fiche.
 * Cette adresse est `basePath` + chemin, barre finale comprise, parce que `next.config.mjs`
 * exporte le site en `trailingSlash: true` et que la CI Pages le publie sous `/fili`.
 * Le test qui attendait `/md/` et recevait `/md` ne mesurait pas le composant : il mesurait
 * un harnais qui ignorait la configuration du site. Next lit ces deux réglages dans
 * `process.env.__NEXT_TRAILING_SLASH` et `process.env.__NEXT_ROUTER_BASEPATH`, et
 * `add-base-path` FIGE le préfixe à l'import du module : ils doivent donc être posés avant
 * que `next/link` n'entre dans le graphe — d'où `vi.hoisted`. L'isolation par fichier de
 * vitest garde ce réglage local à ce fichier.
 */
import * as React from "react";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.hoisted(() => {
  process.env.__NEXT_TRAILING_SLASH = "1"; // apps/site/next.config.mjs → trailingSlash: true
  process.env.__NEXT_ROUTER_BASEPATH = "/fili"; // GitHub Pages sert le site sous /fili
});

import { Link } from "../link/link";
import { Markdown } from "../../../../../apps/site/app/components/markdown";

const ici = dirname(fileURLToPath(import.meta.url));
const SITE = join(ici, "../../../../../apps/site/app");
const lien = (nom: string) => screen.getByRole("link", { name: nom });

describe("Markdown / le harnais reproduit la configuration de PUBLICATION", () => {
  it("les deux réglages de routage viennent du site, pas d'une supposition du test", () => {
    // Si next.config.mjs cessait d'exporter avec la barre finale, la garde tomberait ICI
    // — et non dans un test de lien devenu faux sans qu'on sache pourquoi.
    expect(readFileSync(join(SITE, "../next.config.mjs"), "utf8")).toMatch(/trailingSlash:\s*true/);
    expect(process.env.__NEXT_TRAILING_SLASH).toBeTruthy();
    expect(process.env.__NEXT_ROUTER_BASEPATH).toBe("/fili");
  });
});

describe("Markdown / les liens passent par Link", () => {
  it("un lien Markdown rend l'API publique Link (facture inline) — pas un <a> local", () => {
    render(<Markdown>{"Voir la [doctrine](/md/) du système."}</Markdown>);
    const a = lien("doctrine");
    // Même facture que <Link context="inline"> : comparaison au RENDU DE RÉFÉRENCE du kit
    // — le test ne recopie aucune classe, il exige l'égalité avec ce que Link produit.
    const ref = render(<Link href="#ref" context="inline">réf</Link>);
    const refA = ref.getByRole("link", { name: "réf" });
    expect(a.className.length).toBeGreaterThan(0);
    expect(a.className).toBe(refA.className);
  });

  it("préserve le title et les enfants du lien", () => {
    render(<Markdown>{'Un [texte](/x "infobulle") annoté.'}</Markdown>);
    expect(lien("texte")).toHaveAttribute("title", "infobulle");
    expect(lien("texte").textContent).toBe("texte");
  });

  it("le mapping ne peut pas revenir à un lien natif stylé localement", () => {
    const src = readFileSync(join(SITE, "components/markdown.tsx"), "utf8");
    expect(src).toContain("components={{ a: LienMarkdown }}");
    const source = readFileSync(join(SITE, "components/lien-markdown.tsx"), "utf8");
    expect(source).toMatch(/from "@fili\/react"/);
    expect(source).toContain('context="inline"');
    expect(source).not.toMatch(/className/); // aucune classe recopiée, aucune facture locale
  });
});

/**
 * La frontière est celle de l'ADRESSE, pas du composant : seul un chemin de page passe par
 * le routeur. Une ancre, un `mailto:`, un `tel:` ou une URL absolue ne le concernent pas —
 * les y faire passer préfixerait des adresses qui n'ont pas de racine de site.
 *
 * Question distincte, tranchée en amont : la VALIDITÉ de l'adresse. `markdown.tsx` assainit
 * les URI avec l'allowlist de react-markdown, étendue à `tel:` (stabilisation 0.2). Les deux
 * versants sont éprouvés ici — ce qui doit naviguer navigue, ce qui est dangereux est vidé.
 */
describe("Markdown / l'adresse finale, nature de lien par nature de lien", () => {
  it("CHEMIN ABSOLU INTERNE : le basePath est préservé et la barre finale tenue", () => {
    render(<Markdown>{"[doctrine](/md/)"}</Markdown>);
    expect(lien("doctrine")).toHaveAttribute("href", "/fili/md/");
  });

  it("CHEMIN ABSOLU INTERNE sans barre : l'export trailingSlash la pose", () => {
    render(<Markdown>{"[une page](/md/card)"}</Markdown>);
    expect(lien("une page")).toHaveAttribute("href", "/fili/md/card/");
  });

  it("CHEMIN RELATIF INTERNE : laissé relatif — il se résout SOUS le basePath courant", () => {
    render(<Markdown>{"[voisine](./voisine)"}</Markdown>);
    const a = lien("voisine");
    expect(a).toHaveAttribute("href", "./voisine");
    // Le préfixer serait un défaut : l'adresse relative porte déjà le contexte de la page.
    expect(a.getAttribute("href")).not.toContain("/fili");
  });

  it("ANCRE : reste une ancre — ni préfixe, ni barre finale", () => {
    render(<Markdown>{"[section](#regles)"}</Markdown>);
    expect(lien("section")).toHaveAttribute("href", "#regles");
  });

  it("URL EXTERNE : intacte", () => {
    render(<Markdown>{"[source](https://www.w3.org/TR/WCAG22/)"}</Markdown>);
    expect(lien("source")).toHaveAttribute("href", "https://www.w3.org/TR/WCAG22/");
  });

  it("MAILTO : intact — il est dans l'allowlist de react-markdown", () => {
    render(<Markdown>{"[écrire](mailto:contact@example.org)"}</Markdown>);
    expect(lien("écrire")).toHaveAttribute("href", "mailto:contact@example.org");
  });

  /**
   * TEL — un vrai lien, depuis la stabilisation 0.2. `react-markdown` n'accepte que
   * `http(s)`, `irc(s)`, `mailto` et `xmpp` ; `tel:` tombait dans ce trou et son adresse était
   * vidée. Le numéro gardait alors la facture d'un lien sans destination ni rôle accessible —
   * ce que l'Interaction Language refuse : une navigation doit naviguer. `markdown.tsx` étend
   * donc l'allowlist d'UN cas, validé, en réutilisant `defaultUrlTransform` pour tout le reste.
   */
  it("TEL : vrai lien accessible, adresse conservée", () => {
    render(<Markdown>{"[appeler](tel:+33123456789)"}</Markdown>);
    expect(lien("appeler")).toHaveAttribute("href", "tel:+33123456789");
  });

  it("TEL : le routeur n'y touche pas — ni basePath, ni barre finale sur un numéro", () => {
    render(<Markdown>{"[appeler](tel:+33123456789)"}</Markdown>);
    const href = lien("appeler").getAttribute("href")!;
    expect(href).not.toContain("/fili");
    expect(href.endsWith("/")).toBe(false);
  });

  /**
   * L'extension ne perce pas l'assainissement : seules les formes reconnues passent, tout le
   * reste retombe sur `defaultUrlTransform`, qui vide l'adresse. Un protocole dangereux ne
   * devient donc jamais une destination — et, n'ayant plus d'adresse, pas davantage un lien.
   */
  it.each([
    ["javascript:alert(1)", "javascript"],
    ["data:text/html;base64,PHN2Zz4=", "data:"],
    ["tel:javascript:alert(1)", "javascript"],
  ])("PROTOCOLE DANGEREUX neutralisé : %s", (url, interdit) => {
    const { container } = render(<Markdown>{`[piège](${url})`}</Markdown>);
    const a = container.querySelector("a")!;
    expect(a.getAttribute("href")).toBe("");
    expect(a.getAttribute("href")).not.toContain(interdit);
    expect(screen.queryByRole("link", { name: "piège" })).toBeNull();
  });

  it("toutes les natures VALIDES gardent la MÊME facture visuelle du kit", () => {
    const ref = render(<Link href="#ref" context="inline">réf</Link>).getByRole("link", { name: "réf" });
    render(
      <Markdown>
        {"[interne](/md/) [relative](./v) [ancre](#a) [externe](https://example.org) [mail](mailto:a@b.c) [tel](tel:+331)"}
      </Markdown>,
    );
    for (const nom of ["interne", "relative", "ancre", "externe", "mail", "tel"])
      expect(lien(nom).className).toBe(ref.className);
  });
});

describe("Markdown / blocs de code scrollables", () => {
  it("un bloc de code rend un <pre> réel (focalisable au défilement dans Chromium)", () => {
    const { container } = render(<Markdown>{"```\nconst x = 1;\n```"}</Markdown>);
    expect(container.querySelector("pre code")).not.toBeNull();
  });

  it("le focus des <pre> est la fondation Focus/Bordure — tokenisé, :focus-visible, zéro valeur en dur", () => {
    // jsdom n'applique pas les feuilles de style : la règle se vérifie à la SOURCE ; le
    // résultat calculé est couvert par le harnais verifie-rendu (fixtures + balayage réel).
    const css = readFileSync(join(SITE, "globals.css"), "utf8");
    const regle = css.match(/(^|\n)pre:focus-visible\s*\{[^}]*\}/);
    expect(regle).not.toBeNull();
    expect(regle![0]).toContain("var(--control-focus-width)");
    expect(regle![0]).toContain("var(--control-focus-color)");
    expect(regle![0]).toContain("var(--control-focus-offset)");
    expect(regle![0]).not.toMatch(/#[0-9a-fA-F]|\d+px/); // aucune couleur ni largeur en dur
  });
});
