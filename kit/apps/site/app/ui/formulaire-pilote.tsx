"use client";
import * as React from "react";
import {
  Alert,
  Button,
  Checkbox,
  Input,
  Link,
  Radio,
  Select,
  type SelectOption,
  type ValidationIssue,
  type ValidationVerdict,
  type VerdictMap,
} from "@fili/react";
import type { ValidationTiming } from "@fili/react/validation";
// La chaîne de validation est un GREFFON : le noyau porte la prise (`verdict`), le greffon
// porte le contrat ET le jeu de messages. Un produit qui ne valide rien ne charge ni l'un ni l'autre.
import { Validation, messagesFR } from "@fili/react/validation";

/**
 * TRANCHE PILOTE — la chaîne de validation, câblée de bout en bout.
 *
 * Ce n'est PAS un moteur de formulaire, et ce n'est pas une API publique du kit : c'est un
 * CONSOMMATEUR, écrit une seule fois, qui prouve que la chaîne tient. Tout ce qui est
 * réutilisable vit déjà dans le contrat (`Validation`, sans React) et dans les composants
 * (la prop `verdict`) ; ce qui reste ici est l'orchestration, dont la promotion en API
 * publique relève d'un arbitrage — pas de ce fichier (MISSING-COMPONENT-PROTOCOL).
 *
 * Ce que le pilote démontre, dans l'ordre du cadrage :
 *   1. formulaire vierge → soumission → erreurs `required` ;
 *   2. un numéro de téléphone dans le champ e-mail → `typeMismatch` ;
 *   3. une adresse syntaxiquement valide → l'erreur devenue obsolète DISPARAÎT seule ;
 *   4. soumission → le serveur répond « adresse déjà utilisée » → verdict remappé sur le champ ;
 *   5. correction → soumission réussie.
 *
 * Aucun `status` n'est posé à la main : chaque état visible descend d'un verdict.
 */

/* ── Les MESSAGES appartiennent au produit, jamais au contrat ────────────────────────────
   Le contrat ne code aucune chaîne de langue naturelle : il exige qu'on lui en fournisse.
   Chacun dit ce qui ne convient PAS et comment corriger (INPUT-R23), et aucun n'accuse. */
// Un jeu se SURCHARGE, il ne se recopie pas : on part de celui du greffon et on ne remplace
// que ce que le contexte précise (« pour créer le compte »). Le repli reste garanti.
const MSG_EMAIL = {
  ...messagesFR.email,
  valueMissing: "Saisissez votre adresse e-mail pour créer le compte.",
};
const MSG_FORMULE = messagesFR.groupeRadios;
const MSG_SUJETS = messagesFR.groupeCases;
const MSG_LANGUE = messagesFR.select;

const LANGUES: SelectOption[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

/**
 * LE MOMENT DE LA VALIDATION, déclaré CHAMP PAR CHAMP (VALIDATION-R18).
 *
 * Il n'y a pas de bon défaut universel : `FORM-R16` documente une divergence réelle du
 * secteur, et le choix dépend du risque d'erreur de FORMAT du champ. L'adresse e-mail est
 * le cas d'école d'un fort risque — on la juge au départ du champ (INPUT-R18). Les trois
 * autres sont des choix : on ne peut pas s'y tromper de format, rien ne justifie
 * d'interrompre avant la soumission.
 */
const TIMING: Record<string, ValidationTiming> = {
  courriel: "blur",
  formule: "submit",
  sujets: "submit",
  langue: "submit",
};

/** L'ordre de LECTURE — c'est lui qui ordonne le résumé et désigne le premier champ fautif. */
const ORDRE = ["courriel", "formule", "sujets", "langue"] as const;
const LIBELLE: Record<string, string> = {
  courriel: "Adresse e-mail",
  formule: "Formule",
  sujets: "Centres d'intérêt",
  langue: "Langue de l'interface",
};

type Valeurs = { courriel: string; formule: string; sujets: string[]; langue: string | null };
type Reponse = "succes" | "adresse-prise" | "panne";

/** Signature d'obsolescence d'un champ : ce sur quoi son verdict a porté. */
const signature = (v: Valeurs, champ: string): string =>
  champ === "courriel" ? v.courriel
  : champ === "formule" ? JSON.stringify(v.formule ? [v.formule] : [])
  : champ === "sujets" ? JSON.stringify(v.sujets)
  : JSON.stringify(v.langue ? [v.langue] : []);

export interface FormulairePiloteProps {
  /** Ce que « le serveur » répondra à la prochaine soumission valide côté client. */
  reponseServeur?: Reponse;
  /** Formulaire LONG : le focus va au résumé plutôt qu'au premier champ (FORM-R26). */
  long?: boolean;
}

export function FormulairePilote({ reponseServeur = "adresse-prise", long = false }: FormulairePiloteProps) {
  const [valeurs, setValeurs] = React.useState<Valeurs>({ courriel: "", formule: "", sujets: [], langue: null });
  const [verdicts, setVerdicts] = React.useState<VerdictMap>({});
  const [global, setGlobal] = React.useState<string | null>(null);
  const [envoye, setEnvoye] = React.useState(false);
  const [enVol, setEnVol] = React.useState(false);

  const [touches, setTouches] = React.useState<Record<string, boolean>>({});

  const champRef = React.useRef<HTMLInputElement>(null);
  const resumeRef = React.useRef<HTMLDivElement>(null);

  /* ── VALIDATION — le validateur, jamais le rendu ────────────────────────────────────── */
  const valide = React.useCallback((v: Valeurs): VerdictMap => {
    // Le champ natif fait foi pour ce qu'il sait juger : on lit son `ValidityState` réel
    // plutôt que de réécrire une regex d'e-mail — l'analyseur du navigateur est meilleur.
    const el = champRef.current;
    const courriel = el
      ? Validation.fromValidity("courriel", el.validity, el.value, MSG_EMAIL)
      : Validation.fromSelection("courriel", v.courriel ? [v.courriel] : [], { required: true }, MSG_EMAIL);
    return {
      courriel,
      formule: Validation.fromSelection("formule", v.formule ? [v.formule] : [], { required: true }, MSG_FORMULE),
      sujets: Validation.fromSelection("sujets", v.sujets, { min: 1, max: 3 }, MSG_SUJETS),
      langue: Validation.fromSelection("langue", v.langue ? [v.langue] : [], { required: true }, MSG_LANGUE),
    };
  }, []);

  /**
   * CORRECTION — le verdict devient CADUC, il ne disparaît pas.
   *
   * Il cesse de bloquer (il ne prouve plus rien de ce qui est tapé) mais son message reste
   * lisible : sans lui, l'instruction s'effacerait au premier caractère, c'est-à-dire au
   * moment où elle sert (VALIDATION-R13, arbitrage 2026-07-30). Le message n'est remplacé
   * qu'à la revalidation — ici, au départ du champ e-mail, ou à la soumission suivante.
   */
  const change = (suivant: Valeurs) => {
    setValeurs(suivant);
    setVerdicts((v) =>
      Validation.refreshAll(
        v,
        Object.fromEntries(ORDRE.map((c) => [c, signature(suivant, c)])),
      ),
    );
    setGlobal(null);
    setEnvoye(false);
  };

  /**
   * REVALIDATION d'un champ — c'est ELLE, et rien d'autre, qui remplace un message affiché.
   * Le contrat dit s'il faut juger maintenant ; le formulaire ne réécrit pas ces branches.
   */
  const juge = (champ: string, moment: "input" | "blur") => {
    const actuel = verdicts[champ];
    const affiche = !!actuel && (actuel.state === "invalid" || actuel.state === "warning");
    const dejaSaisi = moment === "blur" || !!touches[champ]; // un blur CLÔT la première saisie
    if (moment === "blur") setTouches((t) => (t[champ] ? t : { ...t, [champ]: true }));
    if (
      !Validation.shouldValidate({
        timing: TIMING[champ] ?? "submit",
        moment,
        displayed: affiche,
        touched: dejaSaisi,
      })
    )
      return;
    setVerdicts((prev) => ({ ...prev, [champ]: valide(valeurs)[champ] }));
  };

  /* ── SOUMISSION — la porte se décide sur les verdicts ───────────────────────────────── */
  const soumets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enVol) return; // anti double-activation (FORM-R36)

    // Recalcul COMPLET : aucun verdict antérieur n'est conservé (FORM-R32).
    const frais = valide(valeurs);
    setVerdicts(frais);
    const porte = Validation.submissionGate(frais, ORDRE);
    if (!porte.ok) {
      setGlobal(porte.pending ? "Vérification en cours…" : null);
      focalise(porte.blocking.length, porte.first);
      return;
    }

    setEnVol(true);
    try {
      const issue = await envoi(valeurs, reponseServeur);
      if (!issue) {
        setEnvoye(true);
        setGlobal(null);
        return;
      }
      if (issue.field === "*") {
        // Erreur GLOBALE : elle reste portée par l'Alert, pas par un champ (FORM-R37).
        setGlobal(issue.message);
        resumeRef.current?.focus();
        return;
      }
      // Erreur serveur ATTACHABLE : elle rejoint la chaîne et REMPLACE le verdict client.
      const apres: VerdictMap = {
        ...frais,
        [issue.field]: Validation.reconcile(frais[issue.field], issue, signature(valeurs, issue.field)),
      };
      setVerdicts(apres);
      const porteApres = Validation.submissionGate(apres, ORDRE);
      focalise(porteApres.blocking.length, porteApres.first);
    } finally {
      setEnVol(false);
    }
  };

  /** FORM-R26 : une seule erreur sur un formulaire court → le champ ; sinon → le résumé. */
  const focalise = (nb: number, premier: string | null) => {
    if (long || nb > 1) {
      requestAnimationFrame(() => resumeRef.current?.focus());
      return;
    }
    if (premier) requestAnimationFrame(() => document.getElementById(premier)?.focus());
  };

  const resume = Validation.summary(verdicts, ORDRE);
  const v = (champ: string): ValidationVerdict | undefined => verdicts[champ];

  return (
    <form noValidate onSubmit={soumets} className="flex w-full max-w-md flex-col gap-lg">
      {/* Le RÉSUMÉ n'apparaît qu'après un échec de soumission (FORM-R22), et son texte est
          celui des messages locaux — le même objet, jamais un second libellé (FORM-R23). */}
      {resume.length || global ? (
        <Alert.Root tone="danger" live ref={resumeRef} tabIndex={-1}>
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>
              {global ?? `${resume.length} ${resume.length > 1 ? "champs sont à corriger" : "champ est à corriger"}`}
            </Alert.Title>
            {/* La liste n'entre PAS dans Alert.Description : celle-ci rend un <p>, et un <ul>
                dans un <p> est un imbriquement invalide que le navigateur défait en silence.
                Elle reprend seulement ses classes d'espacement. */}
            {resume.length ? (
              <ul className="mt-xs m-0 flex list-disc flex-col gap-xs pl-lg text-sm">
                {resume.map((entree) => (
                  <li key={entree.field}>
                    <Link
                      href={`#${entree.field}`}
                      context="inline"
                      onClick={(ev) => {
                        ev.preventDefault();
                        document.getElementById(entree.field)?.focus();
                      }}
                    >
                      {entree.message}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Alert.Content>
        </Alert.Root>
      ) : null}

      {envoye ? (
        <Alert.Root tone="success" live>
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Compte créé</Alert.Title>
            <Alert.Description>Un message de confirmation part vers {valeurs.courriel}.</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}

      <Input.Field controlId="courriel" required verdict={v("courriel")}>
        <Input.Label>{LIBELLE.courriel}</Input.Label>
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              ref={champRef}
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={valeurs.courriel}
              onChange={(e) => change({ ...valeurs, courriel: e.currentTarget.value })}
              // Champ à fort risque de format : il se juge au départ (INPUT-R18). C'est aussi
              // le seul moment où un message déjà affiché est REMPLACÉ (VALIDATION-R13).
              onBlur={() => juge("courriel", "blur")}
            />
          </Input.Wrapper>
        </Input.Root>
        <Input.Helper>Elle servira à vous connecter. Nous ne la partagerons jamais.</Input.Helper>
        <Input.Error />
      </Input.Field>

      <Radio.Group
        label={LIBELLE.formule}
        value={valeurs.formule}
        onValueChange={(f) => change({ ...valeurs, formule: f })}
        verdict={v("formule")}
        helper="Vous pourrez changer à tout moment."
      >
        {/* Le lien du résumé mène ICI : un <fieldset> n'est pas focalisable (FORM-R23). */}
        <Radio id="formule" value="mensuel" label="Mensuel" helper="Sans engagement." />
        <Radio value="annuel" label="Annuel" helper="Deux mois offerts." />
      </Radio.Group>

      <Checkbox.Group
        label={LIBELLE.sujets}
        value={valeurs.sujets}
        onValueChange={(s) => change({ ...valeurs, sujets: s })}
        verdict={v("sujets")}
        helper="Entre un et trois sujets."
      >
        <Checkbox id="sujets" value="design" label="Design" />
        <Checkbox value="code" label="Développement" />
        <Checkbox value="produit" label="Produit" />
        <Checkbox value="recherche" label="Recherche" />
      </Checkbox.Group>

      <Input.Field controlId="langue" required verdict={v("langue")}>
        <Input.Label>{LIBELLE.langue}</Input.Label>
        <Select
          options={LANGUES}
          value={valeurs.langue}
          onValueChange={(l) => change({ ...valeurs, langue: l })}
        />
        <Input.Helper>Elle s'applique aux e-mails comme à l'interface.</Input.Helper>
        <Input.Error />
      </Input.Field>

      {/* FORM-R28 : le bouton reste ACTIF en permanence — c'est la soumission qui refuse,
          et elle le dit. Il n'est désactivé que pendant l'envoi réel (FORM-R29/R36). */}
      <div className="flex items-center gap-md">
        <Button.Root type="submit" loading={enVol} disabled={enVol}>
          Créer mon compte
        </Button.Root>
        <p className="m-0 text-sm text-text-secondary">
          Les champs marqués <span className="text-danger">*</span> sont obligatoires.
        </p>
      </div>
      {/* Le succès est DÉJÀ annoncé : l'alert de réussite est `live` (role="status"). Le
          répéter ici ferait entendre deux fois la même chose. Cette région ne porte donc que
          l'ATTENTE, qu'aucun autre élément ne dit (FORM-R50). */}
      <span aria-live="polite" className="sr-only">
        {enVol ? "Envoi en cours…" : ""}
      </span>
    </form>
  );
}

/** LE SERVEUR — simulé, mais il se comporte comme un serveur : c'est lui qui tranche. */
async function envoi(valeurs: Valeurs, reponse: Reponse): Promise<ValidationIssue | null> {
  await new Promise((r) => setTimeout(r, 400));
  if (reponse === "succes") return null;
  if (reponse === "panne")
    return {
      code: "unavailable",
      field: "*",
      source: "server",
      severity: "error",
      message: "Le service est momentanément indisponible. Vos réponses sont conservées : réessayez dans un instant.",
    };
  // Contrainte que le client ne PEUT pas connaître — l'unicité d'une adresse. Le pilote en
  // tient une liste : corriger l'adresse fait donc réellement passer la soumission suivante.
  if (!PRISES.has(valeurs.courriel.trim().toLowerCase())) return null;
  return {
    code: "alreadyUsed",
    field: "courriel",
    source: "server",
    severity: "error",
    message: "Cette adresse est déjà utilisée. Connectez-vous, ou saisissez-en une autre.",
  };
}

/** Les adresses que « le serveur » considère déjà enregistrées. */
const PRISES = new Set(["deja@exemple.fr", "aurelien@fili.fr"]);
