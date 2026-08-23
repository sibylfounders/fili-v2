// @fili/react — bibliothèque de composants (React + Radix + Tailwind, tokens @fili/tokens)
export * from "./components/button";
export * from "./components/compact-button";
export * from "./components/input";
export * from "./components/alert";
export * from "./components/toast";
export * from "./components/card";
export * from "./components/card-group";
export * from "./components/link";
// AppShell RETIRÉ du baril (arbitrage 2026-07-29 soir, @fili/react 0.2.0) : primitive
// interne sous AppLayout, zéro consommateur public — le dossier reste, AppLayout s'en sert.
export * from "./components/chip";
export * from "./components/app-layout";
export * from "./components/drawer";
export * from "./components/modal";
export * from "./components/tabs";
export * from "./components/select";
export * from "./components/dropdown";
export * from "./components/accordion";
export * from "./components/nav";
export * from "./components/toc";
export * from "./components/skip-link";
export * from "./components/switch";
// La famille du choix : deux frères, un vocabulaire commun (lib/choice.ts).
export * from "./components/checkbox";
export * from "./components/radio";
export * from "./components/skeleton";
export * from "./components/theme-toggle";
export * from "./components/container";
export * from "./components/brand";
export * from "./components/divider";
export * from "./components/submit-button";
export * from "./components/delete-button";
export * from "./icons";
export { cn } from "./lib/cn";
// VALIDATION ET RÉCUPÉRATION — seuls les TYPES entrent dans le noyau.
//
// La chaîne de validation est un GREFFON : `@fili/react/validation`. Le noyau garde la
// PRISE (la prop `verdict` des contrôles) et les types qui permettent de la déclarer — ils
// s'effacent à la compilation, donc ils ne coûtent rien à qui ne valide pas. Le contrat
// exécutable et le jeu de messages, eux, ne sont chargés que par qui les demande.
//
//   import { Input } from "@fili/react";                        // la prise
//   import { Validation, messagesFR } from "@fili/react/validation"; // le greffon
export type {
  ValidationSource,
  ValidationSeverity,
  ValidationIssue,
  ValidationVerdict,
  ValidityFlags,
  NativeCode,
  NativeMessages,
  CardinalityCode,
  CardinalityMessages,
  CardinalityConstraints,
  FieldStatus,
  SummaryEntry,
  SubmissionGate,
  VerdictMap,
} from "./lib/validation";
