"use client";
// Composant interactif : hooks et contexte au niveau module.
import * as React from "react";
import { cn } from "../../lib/cn";
import type { ChoiceSize, ChoiceStatus } from "../../lib/choice";
import { FieldMessage, verdictMessage } from "../../lib/field";
import { choiceStatusFromVerdict, type ValidationVerdict } from "../../lib/validation";
import "../../lib/focus.css";
import "../../lib/choice.css";

/**
 * Radio — un choix EXCLUSIF dans un ensemble borné (CHOICE-UX).
 *
 * L'exclusivité appartient au GROUPE, jamais au bouton : un radio hors `Radio.Group` est un
 * défaut de conception, pas une variante (CHOICE-R05). Le groupe porte la question comme nom
 * accessible (CHOICE-R06).
 *
 * Le CLAVIER est celui du navigateur, pas une reconstruction : des `input[type=radio]`
 * partageant le même `name` donnent gratuitement l'arrêt de tabulation unique, la circulation
 * par flèches et la sélection qui suit le focus (CHOICE-R14, ARIA APG). Réimplémenter cela en
 * `role="radiogroup"` + tabindex mobile serait plus de code pour moins de justesse.
 */
type RadioGroupCtx = {
  name: string;
  value?: string;
  onValueChange?: (valeur: string) => void;
  size: ChoiceSize;
  status: ChoiceStatus;
  disabled: boolean;
  msgId?: string;
};
const RadioCtx = React.createContext<RadioGroupCtx | null>(null);

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
  /** La valeur portée par cette option — obligatoire : c'est ce que le groupe transmet. */
  value: string;
  /** Libellé visible et cliquable ; il se comprend hors contexte (CHOICE-R09). */
  label?: React.ReactNode;
  /** Aide de l'option : une phrase courte, sans lien (CHOICE-R10). */
  helper?: React.ReactNode;
  size?: ChoiceSize;
  status?: ChoiceStatus;
}

const RadioBase = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, value, label, helper, size, status, disabled, id, ...props }, ref) => {
    const groupe = React.useContext(RadioCtx);
    const uid = React.useId();
    const aideId = helper ? `${uid}aide` : undefined;
    const resolvedSize = size ?? groupe?.size ?? "md";
    const resolvedStatus = status ?? groupe?.status ?? "default";
    const resolvedDisabled = disabled ?? groupe?.disabled;

    return (
      <span className="inline-flex flex-col">
        <label
          className={cn("ds-choice", className)}
          data-size={resolvedSize}
          data-status={resolvedStatus}
          data-disabled={resolvedDisabled || undefined}
        >
          <input
            ref={ref}
            type="radio"
            id={id}
            className="ds-choice-input"
            name={groupe?.name}
            value={value}
            checked={groupe ? groupe.value === value : undefined}
            disabled={resolvedDisabled}
            aria-invalid={resolvedStatus === "error" || undefined}
            aria-describedby={aideId}
            onChange={(e) => {
              if (e.currentTarget.checked) groupe?.onValueChange?.(value);
            }}
            {...props}
          />
          <span className="ds-choice-mark ds-choice-mark--dot">
            <span aria-hidden="true" className="ds-choice-glyphe ds-choice-glyphe--coche block size-1.5 rounded-pill bg-current" />
          </span>
          {label != null ? <span className="ds-choice-libelle">{label}</span> : null}
        </label>
        {helper ? (
          <span id={aideId} className="ds-choice-aide pl-[calc(var(--icon-md)+var(--space-sm))] text-sm text-text-secondary">
            {helper}
          </span>
        ) : null}
      </span>
    );
  },
);
RadioBase.displayName = "Radio";

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  /** La QUESTION — nom accessible du groupe (CHOICE-R06). */
  label: React.ReactNode;
  value?: string;
  onValueChange?: (valeur: string) => void;
  /** Nom commun des options ; généré si absent — c'est lui qui rend le groupe exclusif. */
  name?: string;
  size?: ChoiceSize;
  status?: ChoiceStatus;
  disabled?: boolean;
  /**
   * Message d'erreur du GROUPE, jamais de la première option (CHOICE-R17). Mode de
   * PRÉSENTATION : dans un formulaire réel, c'est `verdict` qui porte le message.
   */
  error?: React.ReactNode;
  /**
   * Le VERDICT du groupe — « aucune option sélectionnée alors qu'une réponse est
   * obligatoire », valeur devenue indisponible, verdict métier externe. Il l'emporte sur
   * `status` et sur `error`.
   */
  verdict?: ValidationVerdict;
  helper?: React.ReactNode;
}

/**
 * Groupe de radios — il porte la question, le nom commun (donc l'exclusivité) et l'erreur.
 * `fieldset`/`legend` : la question est rattachée techniquement au groupe, pas seulement
 * posée au-dessus.
 */
export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    { className, label, value, onValueChange, name, size = "md", status, error, verdict, helper, disabled = false, children, ...props },
    ref,
  ) => {
    const uid = React.useId();
    const message = verdictMessage(verdict);
    const affiche: React.ReactNode = message?.texte ?? error;
    const msgId = affiche || helper ? `${uid}msg` : undefined;
    const resolvedStatus = verdict
      ? choiceStatusFromVerdict(verdict)
      : status ?? (error ? "error" : "default");
    const nomCommun = name ?? `${uid}choix`;

    const ctx = React.useMemo<RadioGroupCtx>(
      () => ({ name: nomCommun, value, onValueChange, size, status: resolvedStatus, disabled, msgId }),
      [nomCommun, value, onValueChange, size, resolvedStatus, disabled, msgId],
    );

    return (
      <RadioCtx.Provider value={ctx}>
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
      </RadioCtx.Provider>
    );
  },
);
RadioGroup.displayName = "Radio.Group";

/** L'exclusivité appartient au GROUPE : le radio nu reste exportable, mais c'est le groupe qui
 *  porte le `name` commun — donc la cardinalité (CHOICE-R05). */
export const Radio = Object.assign(RadioBase, { Group: RadioGroup });
