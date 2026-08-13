"use client";
// Composant interactif : hooks et contexte au niveau module.
import * as React from "react";
import { cn } from "../../lib/cn";
import type { ChoiceSize, ChoiceStatus } from "../../lib/choice";
import { FieldMessage, verdictMessage } from "../../lib/field";
import { choiceStatusFromVerdict, type ValidationVerdict } from "../../lib/validation";
import "../../lib/focus.css";
import "../../lib/choice.css";

export type { ChoiceSize, ChoiceStatus };

type GroupeCtx = {
  valeurs: string[];
  bascule: (valeur: string, coche: boolean, exclusif: boolean) => void;
  /**
   * Recensement des options EXCLUSIVES auprès de leur groupe ; renvoie la radiation.
   * Contrat INTERNE à l'anatomie (aucune prop publique n'apparaît) : l'exclusivité se
   * déclare toujours sur l'option, mais c'est le groupe qui doit pouvoir la reconnaître
   * dans les valeurs déjà cochées.
   */
  recense: (valeur: string, exclusif: boolean) => () => void;
  size: ChoiceSize;
  status: ChoiceStatus;
  disabled: boolean;
};
const CheckboxGroupCtx = React.createContext<GroupeCtx | null>(null);

/**
 * Sélection vide PARTAGÉE — une référence stable, pour ne pas invalider un mémo à chaque
 * rendu du groupe non contrôlé. Jamais mutée : le groupe ne fait que lire et recomposer.
 */
const AUCUNE: string[] = [];

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
  /** Libellé visible et cliquable — le nom accessible de la case (CHOICE-R08/R09). */
  label?: React.ReactNode;
  /** Aide de l'option : une phrase courte, sans lien (CHOICE-R10). */
  helper?: React.ReactNode;
  size?: ChoiceSize;
  /**
   * Statut SUBI par la validation — jamais décoratif. Hérité du groupe s'il existe. Depuis le
   * chantier « Validation et récupération », c'est un mode de PRÉSENTATION : dès qu'un
   * `verdict` existe, c'est lui qui décide.
   */
  status?: ChoiceStatus;
  /**
   * Le VERDICT de cette case. Utile pour une case ISOLÉE qui porte sa propre contrainte —
   * consentement obligatoire, confirmation explicite. Dans un `Checkbox.Group`, le verdict
   * appartient au GROUPE (CHOICE-R17) : ne pas le poser sur chaque option.
   */
  verdict?: ValidationVerdict;
  /** Parent partiellement coché — se CALCULE, ne se sélectionne pas (CHOICE-R11). */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Dans un `Checkbox.Group` : la valeur portée par cette option. */
  value?: string;
  /**
   * Option EXCLUSIVE d'un ensemble cumulable (« aucune de ces réponses ») : la cocher
   * décoche toutes les autres (CHOICE-R18). N'a de sens que dans un `Checkbox.Group`.
   */
  exclusive?: boolean;
}

const Coche = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="ds-choice-glyphe ds-choice-glyphe--coche size-full p-0.5">
    <path d="M3.5 8.5l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Trait = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="ds-choice-glyphe ds-choice-glyphe--trait absolute inset-0 size-full p-0.5">
    <path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Checkbox — une SÉLECTION validée à la soumission, cumulable (CHOICE-UX).
 *
 * Ce n'est pas un `Switch` : le switch agit tout de suite, la case attend l'envoi
 * (CHOICE-R01). Ce n'est pas non plus un choix parmi un : si la question n'admet qu'une
 * réponse, ce sont des `Radio`, même à deux options (CHOICE-R03).
 *
 * Le champ NATIF est conservé, superposé à la marque et transparent (`lib/choice.css`) : il
 * garde son rôle, son état et son clavier — Espace bascule, chaque case est un arrêt de
 * tabulation (CHOICE-R15). Rien n'est réimplémenté en ARIA.
 *
 * `indeterminate` est une PROPRIÉTÉ DOM, pas un attribut : elle se pose par la référence
 * (React ne la sérialise pas). Elle décrit un parent partiellement coché — jamais un état
 * que l'utilisateur choisit, jamais une valeur soumise (CHOICE-R11).
 *
 * Le libellé est embarqué et cliquable, à droite de la marque (CHOICE-R08) — à la différence
 * du champ de saisie, dont le libellé se pose au-dessus via `Input.Field`.
 */
const CheckboxBase = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      helper,
      size,
      status,
      verdict,
      indeterminate = false,
      checked,
      defaultChecked,
      onCheckedChange,
      value,
      exclusive = false,
      disabled,
      id,
      ...props
    },
    forwardedRef,
  ) => {
    const groupe = React.useContext(CheckboxGroupCtx);
    const uid = React.useId();
    // Le message de verdict REMPLACE l'aide (INPUT-R26, même règle d'emplacement partagé) —
    // ils ne s'empilent jamais sous l'option.
    const message = verdictMessage(verdict);
    const msgId = message ? `${uid}msg` : undefined;
    const aideId = helper && !message ? `${uid}aide` : undefined;
    const resolvedSize = size ?? groupe?.size ?? "md";
    const resolvedStatus = verdict
      ? choiceStatusFromVerdict(verdict)
      : status ?? groupe?.status ?? "default";
    const resolvedDisabled = disabled ?? groupe?.disabled;

    // Piloté par le groupe dès qu'une valeur y est déclarée ; autonome sinon.
    const parGroupe = !!groupe && value !== undefined;
    const resolvedChecked = parGroupe ? groupe.valeurs.includes(value) : checked;

    // L'option se DÉCLARE exclusive auprès de son groupe. Sans ce recensement, la bascule
    // ne connaît que le caractère exclusif de l'option manipulée : cocher une option
    // ordinaire laissait la valeur exclusive dans le tableau (CHOICE-R18, défaut du
    // 2026-07-30). Le recensement a lieu au montage, donc AVANT toute interaction ; la
    // bascule elle-même reste synchrone et ne rattrape rien après coup.
    const recense = groupe?.recense;
    React.useEffect(() => {
      if (!parGroupe || !recense) return;
      return recense(value!, exclusive);
    }, [parGroupe, recense, value, exclusive]);

    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };
    // `indeterminate` n'existe QUE comme propriété DOM — aucun attribut ne la porte.
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate, resolvedChecked]);

    return (
      <span className="inline-flex flex-col">
        <label
          className={cn("ds-choice", className)}
          data-size={resolvedSize}
          data-status={resolvedStatus}
          data-disabled={resolvedDisabled || undefined}
        >
          <input
            ref={setRefs}
            type="checkbox"
            id={id}
            className="ds-choice-input"
            checked={resolvedChecked}
            defaultChecked={defaultChecked}
            disabled={resolvedDisabled}
            aria-invalid={resolvedStatus === "error" || undefined}
            aria-describedby={msgId ?? aideId}
            value={value}
            onChange={(e) => {
              const coche = e.currentTarget.checked;
              if (parGroupe) groupe!.bascule(value!, coche, exclusive);
              onCheckedChange?.(coche);
            }}
            {...props}
          />
          <span className="ds-choice-mark ds-choice-mark--box">
            <Coche />
            <Trait />
          </span>
          {label != null ? <span className="ds-choice-libelle">{label}</span> : null}
        </label>
        {message ? (
          <FieldMessage
            id={msgId}
            severity={message.severity}
            className="pl-[calc(var(--icon-md)+var(--space-sm))]"
          >
            {message.texte}
          </FieldMessage>
        ) : helper ? (
          <span id={aideId} className="ds-choice-aide pl-[calc(var(--icon-md)+var(--space-sm))] text-sm text-text-secondary">
            {helper}
          </span>
        ) : null}
      </span>
    );
  },
);
CheckboxBase.displayName = "Checkbox";

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  /** La QUESTION — nom accessible du groupe, jamais une simple proximité visuelle (CHOICE-R06). */
  label: React.ReactNode;
  value?: string[];
  onValueChange?: (valeurs: string[]) => void;
  size?: ChoiceSize;
  status?: ChoiceStatus;
  disabled?: boolean;
  /**
   * Message d'erreur du GROUPE — jamais rattaché à la première option (CHOICE-R17). Mode de
   * PRÉSENTATION depuis le chantier « Validation et récupération » : dans un formulaire réel,
   * c'est `verdict` qui porte le message, et le même objet alimente le résumé d'erreurs.
   */
  error?: React.ReactNode;
  /**
   * Le VERDICT du groupe — requis, cardinalité minimale/maximale, combinaison interdite. Il
   * l'emporte sur `status` et sur `error` : une erreur de groupe est la conséquence d'un
   * verdict, jamais un message posé à la main.
   */
  verdict?: ValidationVerdict;
  helper?: React.ReactNode;
}

/**
 * Groupe de cases — il porte la QUESTION, l'étiquetage collectif et le message d'erreur.
 * Les cases restant indépendantes, le groupe est facultatif ; dès que plusieurs cases
 * répondent à une même question, il ne l'est plus (CHOICE-R07).
 *
 * `fieldset`/`legend` : la question est rattachée techniquement, pas seulement posée à côté.
 *
 * EXCLUSIVITÉ (CHOICE-R18) : elle se déclare sur l'option (`exclusive`), mais elle
 * s'ARBITRE ici. Le groupe tient le registre de ses propres options exclusives, parce que
 * la bascule doit répondre à une question que l'option manipulée ne suffit pas à trancher :
 * « parmi les valeurs déjà cochées, lesquelles sont exclusives ? ». L'API publique
 * `value` / `onValueChange` reste entièrement déterministe : chaque bascule calcule le
 * tableau suivant à partir du tableau reçu, sans le muter ni différer la décision.
 */
export const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    { className, label, value, onValueChange, size = "md", status, error, verdict, helper, disabled = false, children, ...props },
    ref,
  ) => {
    const uid = React.useId();
    const message = verdictMessage(verdict);
    const affiche: React.ReactNode = message?.texte ?? error;
    const msgId = affiche || helper ? `${uid}msg` : undefined;
    const resolvedStatus = verdict
      ? choiceStatusFromVerdict(verdict)
      : status ?? (error ? "error" : "default");
    // `AUCUNE` (constante de module) plutôt qu'un `[]` neuf à chaque rendu : la sélection
    // devient une RÉFÉRENCE immuable, utilisable telle quelle comme dépendance de mémo.
    const valeurs = value ?? AUCUNE;

    /**
     * Registre des options EXCLUSIVES de CE groupe. Il est porté par une référence propre
     * à l'instance : deux groupes affichés sur la même page ne partagent rien, et un
     * démontage d'option radie sa valeur. Une référence (et non un état) suffit — la
     * bascule le lit au moment du clic, elle n'a pas à provoquer de rendu.
     */
    const exclusives = React.useRef<Set<string>>(new Set());
    const recense = React.useCallback((valeur: string, exclusif: boolean) => {
      if (!exclusif) return () => {};
      exclusives.current.add(valeur);
      return () => {
        exclusives.current.delete(valeur);
      };
    }, []);

    const ctx = React.useMemo<GroupeCtx>(
      () => ({
        valeurs,
        size,
        status: resolvedStatus,
        disabled,
        recense,
        // CHOICE-R18 — décider à partir du tableau REÇU, sans jamais le muter :
        //   • décocher retire la seule valeur manipulée ;
        //   • cocher une option exclusive ne laisse qu'elle ;
        //   • cocher une option ordinaire retire les valeurs exclusives du groupe, que la
        //     seule option manipulée ne suffit pas à désigner — d'où le registre.
        bascule: (valeur, coche, exclusif) => {
          if (!onValueChange) return;
          const sansElle = valeurs.filter((v) => v !== valeur);
          if (!coche) return onValueChange(sansElle);
          if (exclusif) return onValueChange([valeur]);
          onValueChange([...sansElle.filter((v) => !exclusives.current.has(v)), valeur]);
        },
      }),
      // La dépendance est la SÉLECTION REÇUE elle-même — une référence immuable pilotée par
      // le parent. Elle remplace `valeurs.join("|")` : une sérialisation n'est pas injective,
      // `["a|b"]` et `["a", "b"]` produisent la même chaîne. Avec un `onValueChange` stable,
      // le contexte restait alors figé sur la sélection précédente et les cases affichaient un
      // état périmé (constat d'audit du 2026-07-30). Les autres dépendances sont des valeurs
      // primitives ou des références stables (`recense` est un `useCallback` sans dépendance).
      [valeurs, size, resolvedStatus, disabled, onValueChange, recense],
    );

    return (
      <CheckboxGroupCtx.Provider value={ctx}>
        <fieldset
          ref={ref}
          className={cn("m-0 flex min-w-0 flex-col gap-sm border-0 p-0", className)}
          data-status={resolvedStatus}
          aria-describedby={msgId}
          {...props}
        >
          <legend className="mb-xs p-0 font-medium text-text-primary">{label}</legend>
          {children}
          {affiche ? (
            <FieldMessage id={msgId} severity={message?.severity ?? "error"}>{affiche}</FieldMessage>
          ) : helper ? (
            <p id={msgId} className="m-0 text-sm text-text-secondary">{helper}</p>
          ) : null}
        </fieldset>
      </CheckboxGroupCtx.Provider>
    );
  },
);
CheckboxGroup.displayName = "Checkbox.Group";

/** L'exclusivité d'un ensemble cumulable est déclarée sur l'option, pas sur le groupe. */
export const Checkbox = Object.assign(CheckboxBase, { Group: CheckboxGroup });
