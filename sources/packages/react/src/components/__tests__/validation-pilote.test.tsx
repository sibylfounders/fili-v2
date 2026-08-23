/**
 * INTÉGRATION — la tranche verticale, jouée en entier.
 *
 * Le formulaire testé est celui de l'Atelier (`apps/site/app/ui/formulaire-pilote`), pas une
 * reconstitution : ce qui est vérifié ici est exactement ce qu'un humain manipule là-bas.
 *
 * Le scénario du cadrage, dans l'ordre :
 *   vierge → soumission → required · téléphone dans l'e-mail → typeMismatch · adresse valide
 *   → l'erreur obsolète disparaît · soumission → « adresse déjà utilisée » → remappée sur le
 *   champ · correction → soumission réussie.
 *
 * NOTE DE LECTURE — pourquoi `getAllByText` et pas `getByText` : après un échec, chaque
 * message existe DEUX fois, et c'est le contrat (FORM-R24 — le résumé est un point d'entrée,
 * pas un substitut ; les deux coexistent). Un `getByText` lèverait « found multiple elements »
 * sur ce que la doctrine EXIGE. On compte donc les occurrences au lieu de les interdire.
 */
import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";

import { FormulairePilote } from "../../../../../apps/site/app/ui/formulaire-pilote";

const remplisTout = async (user: ReturnType<typeof userEvent.setup>, courriel: string) => {
  await user.clear(screen.getByLabelText(/Adresse e-mail/));
  await user.type(screen.getByLabelText(/Adresse e-mail/), courriel);
  await user.click(screen.getByLabelText("Annuel"));
  await user.click(screen.getByLabelText("Design"));
  await user.click(screen.getByRole("combobox"));
  await user.click(screen.getByRole("option", { name: "Français" }));
};

const soumets = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: /Créer mon compte/ }));

/** Le message vit à DEUX endroits après un échec : le résumé et le champ. */
const deuxFois = (motif: RegExp) => expect(screen.getAllByText(motif)).toHaveLength(2);

/**
 * Attendre que le focus post-échec se POSE avant de corriger.
 *
 * Après un échec MULTIPLE, `focalise` envoie le focus au résumé dans un
 * `requestAnimationFrame` (FORM-R26). Si ce déplacement atterrit PENDANT la frappe, il fait
 * sortir du champ e-mail — donc il le REVALIDE (VALIDATION-R18) et remplace le message
 * qu'on est précisément en train d'observer. Un humain ne tape jamais avant que le
 * navigateur ait fini de réagir à sa soumission ; le test non plus. Sans cette attente,
 * l'issue dépend de l'ordonnancement : le test est vert ou rouge selon la charge machine.
 */
const focusPose = async () =>
  waitFor(() => expect(document.activeElement).toBe(screen.getByRole("alert")));

describe("tranche pilote — un verdict, et lui seul, fait apparaître une erreur", () => {
  it("formulaire vierge : la soumission est REFUSÉE et chaque champ dit ce qui manque", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await soumets(user);

    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBe("true");
    // Chacun apparaît exactement deux fois : résumé + message local. Ni une (le résumé ne
    // remplace pas l'inline), ni trois (personne ne répète le message sous chaque option).
    deuxFois(/Saisissez votre adresse e-mail/);
    deuxFois(/Choisissez une formule/);
    deuxFois(/Choisissez au moins un centre/);
    deuxFois(/Choisissez la langue/);
    // rien n'est parti : aucun message de succès
    expect(screen.queryByText(/Compte créé/)).toBeNull();
  });

  it("le RÉSUMÉ apparaît après l'échec, cite le MÊME texte, et ses liens fonctionnent", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await soumets(user);

    const resume = screen.getByRole("alert");
    expect(within(resume).getByText(/4 champs sont à corriger/)).toBeTruthy();
    const liens = within(resume).getAllByRole("link");
    expect(liens).toHaveLength(4);

    // Le texte du lien se retrouve MOT POUR MOT dans le message associé au champ — c'est la
    // preuve qu'il n'y a qu'un objet (FORM-R23). Le message local ajoute sa qualification
    // « Erreur : » pour l'AT (INPUT-R31) ; le lien, lui, n'a pas à la porter.
    const phrase = liens[0].textContent!;
    expect(phrase.length).toBeGreaterThan(10);
    const champ = screen.getByLabelText(/Adresse e-mail/);
    const local = document.getElementById(champ.getAttribute("aria-describedby")!)!;
    expect(local).not.toBeNull();
    expect(local.textContent).toContain(phrase);
    expect(local.textContent!.startsWith("Erreur :")).toBe(true);

    await user.click(liens[0]);
    expect(document.activeElement).toBe(champ);
  });

  it("le résumé n'apparaît JAMAIS avant une soumission (FORM-R22)", () => {
    render(<FormulairePilote />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("après un échec MULTIPLE, le focus va au résumé (FORM-R26)", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await soumets(user);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("alert")));
  });

  it("un numéro de téléphone dans le champ e-mail : typeMismatch, et la soumission reste refusée", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await user.type(screen.getByLabelText(/Adresse e-mail/), "06 12 34 56 78");
    await soumets(user);

    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBe("true");
    deuxFois(/format nom@domaine.fr/);
    expect(screen.queryByText(/Compte créé/)).toBeNull();
  });

  it("pendant la correction, le message RESTE lisible — il ne s'efface pas au premier caractère", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await user.type(screen.getByLabelText(/Adresse e-mail/), "06 12 34 56 78");
    await soumets(user);
    await focusPose();
    deuxFois(/format nom@domaine.fr/);

    await user.clear(screen.getByLabelText(/Adresse e-mail/));
    await user.type(screen.getByLabelText(/Adresse e-mail/), "nouvelle@exemple.fr");

    // VALIDATION-R13 : le verdict est CADUC, pas effacé. Retirer l'instruction au moment où
    // l'utilisateur corrige serait la retirer au moment où elle sert (FORM-R27).
    deuxFois(/format nom@domaine.fr/);
  });

  it("…et c'est la REVALIDATION qui le remplace — ici, au départ du champ (VALIDATION-R18)", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await user.type(screen.getByLabelText(/Adresse e-mail/), "06 12 34 56 78");
    await soumets(user);
    await focusPose();
    await user.clear(screen.getByLabelText(/Adresse e-mail/));
    await user.type(screen.getByLabelText(/Adresse e-mail/), "nouvelle@exemple.fr");

    await user.tab(); // le champ est quitté : l'e-mail est déclaré `timing: "blur"`
    await waitFor(() => expect(screen.queryAllByText(/format nom@domaine.fr/)).toHaveLength(0));
    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBeNull();
  });

  it("un champ en `timing: \"submit\"` ne se juge PAS au départ du champ", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    // La formule est déclarée « submit » : la traverser sans rien choisir n'accuse personne.
    await user.click(screen.getByLabelText("Mensuel"));
    await user.tab();
    expect(screen.queryAllByText(/Choisissez une formule/)).toHaveLength(0);
  });

  it("une valeur invalide n'efface pas les AUTRES saisies (FORM-R32)", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    await user.click(screen.getByLabelText("Annuel"));
    await user.click(screen.getByLabelText("Design"));
    await user.type(screen.getByLabelText(/Adresse e-mail/), "pas-une-adresse");
    await soumets(user);

    expect((screen.getByLabelText("Annuel") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Design") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/Adresse e-mail/) as HTMLInputElement).value).toBe("pas-une-adresse");
  });

  it("erreur SERVEUR attachable : remappée sur le champ, puis corrigée, puis succès", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote reponseServeur="adresse-prise" />);
    await remplisTout(user, "deja@exemple.fr");
    await soumets(user);

    // Le verdict serveur rejoint la MÊME chaîne : inline + résumé, comme un verdict client.
    await waitFor(() => expect(screen.getAllByText(/déjà utilisée/)).toHaveLength(2));
    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText(/Compte créé/)).toBeNull();

    await user.clear(screen.getByLabelText(/Adresse e-mail/));
    await user.type(screen.getByLabelText(/Adresse e-mail/), "libre@exemple.fr");
    // Le verdict SERVEUR devient caduc comme un autre : il ne bloque plus, il reste lisible.
    expect(screen.getAllByText(/déjà utilisée/)).toHaveLength(2);

    await soumets(user);
    await waitFor(() => expect(screen.getByText(/Compte créé/)).toBeTruthy());
  });

  it("erreur serveur GLOBALE : portée par l'alert, jamais accrochée à un champ", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote reponseServeur="panne" />);
    await remplisTout(user, "libre@exemple.fr");
    await soumets(user);

    await waitFor(() => expect(screen.getByText(/momentanément indisponible/)).toBeTruthy());
    // Une erreur globale ne s'accroche à aucun champ, et n'entre pas dans la liste du résumé.
    expect(screen.getByLabelText(/Adresse e-mail/).getAttribute("aria-invalid")).toBeNull();
    expect(within(screen.getByRole("alert")).queryAllByRole("link")).toHaveLength(0);
    expect((screen.getByLabelText(/Adresse e-mail/) as HTMLInputElement).value).toBe("libre@exemple.fr");
  });

  it("un formulaire complet et valide passe : la porte s'ouvre sur des VERDICTS", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote reponseServeur="succes" />);
    await remplisTout(user, "libre@exemple.fr");
    await soumets(user);
    await waitFor(() => expect(screen.getByText(/Compte créé/)).toBeTruthy());
  });

  it("le succès est annoncé UNE seule fois — l'alert de réussite porte déjà role=status", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote reponseServeur="succes" />);
    await remplisTout(user, "libre@exemple.fr");
    await soumets(user);
    await waitFor(() => expect(screen.getAllByRole("status")).toHaveLength(1));
    expect(screen.getAllByText(/Compte créé/)).toHaveLength(1);
  });

  it("le bouton de soumission reste ACTIF tant qu'aucun envoi n'est en cours (FORM-R28)", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote />);
    const bouton = screen.getByRole("button", { name: /Créer mon compte/ }) as HTMLButtonElement;
    expect(bouton.disabled).toBe(false);
    await soumets(user);
    expect(bouton.disabled).toBe(false); // refusé, mais jamais silencieusement inactif
  });

  it("double activation : le bouton se verrouille PENDANT l'envoi, et un seul succès arrive", async () => {
    const user = userEvent.setup();
    render(<FormulairePilote reponseServeur="succes" />);
    await remplisTout(user, "libre@exemple.fr");
    const bouton = screen.getByRole("button", { name: /Créer mon compte/ }) as HTMLButtonElement;

    const premier = soumets(user);
    await waitFor(() => expect(bouton.disabled).toBe(true)); // FORM-R29/R36 : seulement pendant l'envoi
    await premier;

    await waitFor(() => expect(screen.getAllByText(/Compte créé/)).toHaveLength(1));
    expect(bouton.disabled).toBe(false); // l'envoi terminé, le bouton redevient disponible
  });

  it("axe-core : ni au repos, ni couvert d'erreurs, le formulaire ne crée de violation", async () => {
    const user = userEvent.setup();
    const { container } = render(<FormulairePilote />);
    const passe = async () =>
      expect((await axe.run(container, { rules: { "color-contrast": { enabled: false } } })).violations).toHaveLength(0);
    await passe();
    await soumets(user);
    await passe();
  });

  it("aucun identifiant de message ORPHELIN, avant comme après l'échec", async () => {
    const user = userEvent.setup();
    const { container } = render(<FormulairePilote />);
    const verifie = () => {
      for (const el of Array.from(container.querySelectorAll("[aria-describedby]")))
        for (const id of (el.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean))
          expect(document.getElementById(id), `identifiant orphelin : ${id}`).not.toBeNull();
    };
    verifie();
    await soumets(user);
    verifie();
  });
});
