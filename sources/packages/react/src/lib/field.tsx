"use client";
// Contexte de bloc champ + rendu du message de verdict : primitive INTERNE partagée.
import * as React from "react";
import { cn } from "./cn";
import {
  PRISTINE,
  ariaBusy,
  issueOf,
  statusFromVerdict,
  type FieldStatus,
  type ValidationVerdict,
} from "./validation";

/**
 * LE BLOC CHAMP — mécanique commune à tous les contrôles qui portent un verdict.
 *
 * Elle vivait dans `input.tsx` depuis la livraison du 2026-07-30 ; elle en sort ici sans
 * changer d'API publique (`Input.Field` reste le nom du bloc). La raison est la chaîne de
 * validation : `Select` doit pouvoir recevoir le même câblage — libellé lié, message
 * associé, `aria-invalid` dérivé — sans qu'un second bloc champ soit inventé pour lui.
 * Une responsabilité atomique, une implémentation, plusieurs consommateurs.
 *
 * Le bloc FOURNIT, l'enfant SURCLASSE : miroir exact du contrat `CardGroup` → `Card`.
 */
export type FieldSize = "sm" | "md" | "lg";

export interface FieldContextValue {
  fieldId: string;
  messageId: string;
  /** Un message (helper OU message de verdict) est monté : sans lui, `aria-describedby` pointerait dans le vide. */
  hasMessage: boolean;
  setHasMessage: (present: boolean) => void;
  size: FieldSize;
  /** Statut VISUEL — dérivé du verdict quand il existe, jamais l'inverse. */
  status: FieldStatus;
  required: boolean;
  /** Le verdict qui fait autorité. `PRISTINE` tant qu'aucun n'a été rendu. */
  verdict: ValidationVerdict;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export const useField = (): FieldContextValue | null => React.useContext(FieldContext);

/**
 * Le STATUT d'un bloc champ : le verdict décide dès qu'il existe ; `status` n'est qu'un
 * mode de PRÉSENTATION, réservé aux fixtures qui montrent un état isolé (§9 du cadrage).
 *
 * Un `valid` ne rend pas `success` tout seul : INPUT-R16 range « validé sans besoin de le
 * signaler » dans le statut par défaut, et INPUT-R20 fait de la confirmation visible un
 * choix de produit. `confirmValid` est donc explicite, et il est faux par défaut.
 */
export function resolveStatus(
  verdict: ValidationVerdict | undefined,
  status: FieldStatus | undefined,
  confirmValid = false,
): FieldStatus {
  if (verdict && verdict.state !== "pristine") return statusFromVerdict(verdict, { confirmValid });
  return status ?? "default";
}

/**
 * Câblage du contrôle à son bloc : identifiant (cible du `for` du libellé), lien vers le
 * message, caractère requis, et les deux attributs que le verdict commande directement.
 * Rendu AVANT `{...props}` par ses appelants : un consommateur garde la main.
 *
 * Hors d'un bloc champ, ne pose rien — l'usage autonome reste identique.
 */
export function useFieldWiring(): Record<string, string | boolean | undefined> {
  const champ = useField();
  if (!champ) return {};
  return {
    id: champ.fieldId,
    "aria-describedby": champ.hasMessage ? champ.messageId : undefined,
    "aria-required": champ.required || undefined,
    // `aria-invalid` se lit sur le STATUT du bloc, pas directement sur le verdict : le statut
    // EST déjà la projection du verdict quand il existe, et il couvre le mode présentation
    // (`status="error"` sans verdict). Le lire deux fois ferait diverger les deux chemins —
    // et un `undefined` étalé ici écraserait le repli du contrôle autonome.
    "aria-invalid": champ.status === "error" || undefined,
    "aria-busy": ariaBusy(champ.verdict),
  };
}

/** Enregistre le message auprès du bloc : sans lui, `aria-describedby` pointerait dans le vide. */
export function useMessageRegistered(actif: boolean): FieldContextValue | null {
  const champ = useField();
  const signale = champ?.setHasMessage;
  React.useEffect(() => {
    if (!signale || !actif) return;
    signale(true);
    return () => signale(false);
  }, [signale, actif]);
  return champ;
}

/* ── Le message de verdict, écrit UNE fois ───────────────────────────────────── */

const IconeAlerte = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className="mt-0.5 size-4 shrink-0"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" strokeLinecap="round" />
    <path d="M12 16h.01" strokeLinecap="round" />
  </svg>
);

export interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** `error` (danger) ou `warning` — la gravité vient du verdict, jamais d'un choix de teinte. */
  severity?: "error" | "warning";
}

/**
 * Le message qui accompagne un verdict — icône + qualification textuelle + texte.
 *
 * INPUT-R31 : jamais la couleur seule. Le mot lu par la technologie d'assistance suit la
 * GRAVITÉ : dire « Erreur » sur un avertissement serait un mensonge poli.
 *
 * Ce bloc était écrit TROIS fois (Input.Error, Checkbox.Group, Radio.Group) — même SVG,
 * même structure, trois copies. La chaîne de validation en aurait ajouté une quatrième.
 */
export const FieldMessage = React.forwardRef<HTMLParagraphElement, FieldMessageProps>(
  ({ className, children, severity = "error", ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "m-0 flex items-start gap-1.5 text-sm",
        severity === "warning" ? "text-warning" : "text-danger",
        className,
      )}
      {...props}
    >
      {IconeAlerte}
      <span className="sr-only">{severity === "warning" ? "Avertissement : " : "Erreur : "}</span>
      <span>{children}</span>
    </p>
  ),
);
FieldMessage.displayName = "FieldMessage";

/**
 * Ce qu'un contrôle doit afficher pour un verdict : le texte et sa gravité, ou `null`.
 * Le texte sort de l'`issue` — le MÊME objet que celui du résumé d'erreurs (FORM-R23).
 */
export function verdictMessage(
  verdict: ValidationVerdict | undefined,
): { texte: string; severity: "error" | "warning" } | null {
  const issue = verdict ? issueOf(verdict) : null;
  if (!issue) return null;
  return { texte: issue.message, severity: issue.severity };
}

export { PRISTINE };
