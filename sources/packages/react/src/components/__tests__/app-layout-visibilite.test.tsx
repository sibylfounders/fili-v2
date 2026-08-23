/**
 * La bascule `visibility` des deux rails du shell — Stabilisation 0.2 (2026-07-30).
 *
 * `app-layout.css` déclare quatre durées nulles. Le vérificateur strict les relevait comme
 * « duree-en-dur ». Arbitrage (DECISIONS.md) : `visibility` est une propriété DISCRÈTE,
 * elle ne s'interpole pas ; le `0s` n'est pas une durée de mouvement mais l'idiome qui rend
 * la bascule instantanée, la durée perçue étant portée par le délai tokenisé
 * `var(--duration-base)`. La valeur est donc classée en exception NOMMÉE et BORNÉE à
 * `visibility`, pas versée à la baseline.
 *
 * Une exception sans preuve n'est qu'un silence : ce fichier verrouille la mécanique à la
 * source, et interdit à l'exception de s'élargir. Le comportement CALCULÉ (rail fermé
 * réellement invisible, contenu hors tabulation, visible dès la première frame à
 * l'ouverture, caché seulement après le glissement, mouvement réduit sans délai résiduel)
 * a été éprouvé dans Chromium ; jsdom n'applique pas les feuilles de style et ne peut pas
 * en témoigner ici.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const ici = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(ici, "../app-layout/app-layout.css"), "utf8");
const exceptions = JSON.parse(
  readFileSync(join(ici, "../../../../../tools/verifie-tokens.exceptions.json"), "utf8"),
) as Array<{ file: string; motif: string; contexte?: string; classe: string; raison: string }>;

const bloc = (entete: string) => {
  const m = css.match(new RegExp(`(^|\\n)${entete.replace(/[.[\]"*+?^${}()|\\/]/g, "\\$&")}\\s*\\{[^}]*\\}`));
  expect(m, `bloc introuvable : ${entete}`).not.toBeNull();
  return m![0];
};

describe.each([".sw-shell-sidebar", ".sw-shell-aside"])("%s — la bascule de visibilité", (rail) => {
  it("FERMÉ : caché, et le passage à `hidden` est RETARDÉ du temps du glissement", () => {
    const ferme = bloc(rail);
    expect(ferme).toMatch(/visibility:\s*hidden/);
    // 0s de durée (bascule discrète) + délai = la durée tokenisée du mouvement.
    expect(ferme).toMatch(/visibility\s+0s\s+linear\s+var\(--duration-base\)/);
  });

  it("OUVERT : visible, et le passage à `visible` est IMMÉDIAT (aucun délai)", () => {
    const ouvert = bloc(`${rail}[data-open="true"]`);
    expect(ouvert).toMatch(/visibility:\s*visible/);
    expect(ouvert).toMatch(/visibility\s+0s\s*[;,]/); // ni `linear`, ni délai
  });

  it("MOUVEMENT RÉDUIT : la transition est coupée, donc aucun délai résiduel", () => {
    expect(css).toMatch(
      new RegExp(`@media\\s*\\(prefers-reduced-motion:\\s*reduce\\)\\s*\\{\\s*\\${rail}\\s*\\{\\s*transition:\\s*none;`),
    );
  });
});

describe("app-layout.css — la durée nulle reste une mécanique, jamais un mouvement", () => {
  it("aucune durée littérale NON NULLE ne pilote `visibility`", () => {
    for (const m of css.matchAll(/visibility\s+(\d*\.?\d+)(ms|s)\b/g)) expect(Number(m[1])).toBe(0);
  });

  it("les durées littérales du fichier ne concernent QUE `visibility`", () => {
    // Le reste du mouvement doit rester tokenisé : toute autre durée en dur est un constat
    // que le vérificateur strict doit continuer à voir (le `contexte` de l'exception le
    // garantit — éprouvé en ajoutant un `transform 0s` temporaire, qui est bien ressorti).
    const sansCommentaires = css.replace(/\/\*[^]*?\*\//g, "");
    for (const m of sansCommentaires.matchAll(/(?<![\w.-])\d*\.?\d+(?:ms|s)(?![\w-])/g)) {
      const avant = sansCommentaires.slice(Math.max(0, m.index! - 24), m.index!);
      expect(avant, `durée en dur hors visibility : « ${m[0]} »`).toMatch(/visibility\s+$/);
    }
  });

  it("l'exception déclarée est nommée, justifiée et BORNÉE à `visibility`", () => {
    const e = exceptions.find((x) => x.file.includes("app-layout") && x.motif === "0s");
    expect(e, "l'exception a disparu du mécanisme existant").toBeTruthy();
    expect(e!.classe).toBe("bascule-discrète");
    expect(e!.contexte).toBe("visibility\\s+0s$"); // pas de wildcard : le périmètre est la propriété
    expect(e!.raison.length).toBeGreaterThan(80);
  });
});
