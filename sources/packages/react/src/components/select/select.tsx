"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "../../lib/interaction.css";
import { FieldMessage, resolveStatus, useField, useFieldWiring, verdictMessage } from "../../lib/field";
import { type ValidationVerdict } from "../../lib/validation";
import "../../lib/no-scrollbar.css";

/**
 * Select — choix unique parmi des options prédéfinies (DS-MD RULES-select). Motif ARIA APG
 * « select-only combobox » : un déclencheur (role="combobox") ouvre une listbox en popover
 * NON-MODAL (fondation overlay, lot C) — ancrée, sans voile, sans piège, light-dismiss.
 *
 * Le focus reste sur le déclencheur ; l'option active est suivie par `aria-activedescendant`.
 * Clavier : fermé ↓↑/Entrée/Espace ouvrent, une frappe présélectionne (type-ahead) ; ouvert ↑↓
 * déplacent, Début/Fin aux extrêmes, Entrée/Espace valident, Échap ferme, Tab valide l'actif.
 *
 * Contrôlé : `value` + `onValueChange`. Nom accessible requis (`aria-label`/`aria-labelledby`),
 * sauf dans un bloc champ où le libellé visible le fournit. Mono-sélection (multi/recherche
 * différés).
 *
 * VALIDATION (chantier 2026-07-30) — SELECT-R07 déclarait depuis toujours un état d'erreur
 * « bordure et message », et SELECT-R09 renvoyait le requis au formulaire ; le composant
 * n'offrait aucune prise pour l'un ni pour l'autre. Il en a une maintenant, et une seule : le
 * VERDICT. Aucun axe `status` décoratif n'a été ajouté — un select n'est pas « rouge », il est
 * en erreur parce qu'un verdict le dit.
 *
 * Dans un `Input.Field`, le select consomme le MÊME bloc champ que l'input (`lib/field`) :
 * `for`/`id` du libellé (un `<button>` est un élément étiquetable), `aria-describedby` vers le
 * message, `aria-required`, verdict hérité. Aucun second bloc champ n'a été inventé pour lui.
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const triggerVariants = cva(
  [
    "inline-flex items-center gap-sm rounded-md text-text-primary transition-colors duration-fast ease-out",
    "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
    // État indisponible : couple de tokens encadré (ds-inert), plus une opacité en dur.
    "ds-inert",
  ].join(" "),
  {
    variants: {
      size: { sm: "h-8 px-sm text-sm min-w-40", md: "h-10 px-md min-w-48", lg: "h-12 px-lg min-w-48" },
      // `ghost` : sans fond ni bordure (esprit panneau de propriétés Figma), largeur au contenu.
      // `default` : bordure délimitante VISIBLE même sans relief (le relief, quand il est actif,
      // reprend la main sur border-color via [data-relief] — spécificité supérieure).
      variant: {
        default: "w-full justify-between border border-border-strong bg-surface text-text-primary hover:bg-surface-hover",
        ghost: "w-auto min-w-0 justify-end border border-transparent bg-transparent hover:bg-surface",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  },
);

const Chevron = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 text-text-secondary">
    <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 text-primary">
    <path d="M5 10l3.5 3.5L15 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface SelectProps extends VariantProps<typeof triggerVariants> {
  options: SelectOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Rend le déclencheur en squelette de chargement, aux dimensions de sa taille. */
  loading?: boolean;
  /**
   * Le VERDICT de validation. Il porte la bordure d'erreur, `aria-invalid` et le message —
   * il n'y a pas d'autre chemin vers l'état d'erreur d'un select. Hérité du bloc champ quand
   * le select y vit ; la prop l'emporte quand les deux existent (le contrôle surclasse).
   */
  verdict?: ValidationVerdict;
  /** Liste NATIVE du navigateur (<select>) : même déclencheur stylé, menu rendu par l'OS —
   *  clavier/mobile/lecteurs d'écran natifs gratuits ; à préférer quand le menu n'a pas
   *  besoin d'être dessiné par le système. */
  native?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionner…",
  disabled,
  loading = false,
  native = false,
  verdict,
  size = "md",
  variant,
  className,
  ...aria
}: SelectProps) {
  // Bloc champ : le select y consomme le câblage commun (id, describedby, required,
  // aria-invalid). Hors bloc, `cable` est vide et rien ne change.
  const champ = useField();
  const cable = useFieldWiring();
  const msgId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  // Signal de débordement : la liste plafonnée peut cacher des options — des voiles dégradés
  // (haut/bas) le disent à l'œil, recalculés au scroll (rapport utilisateur 2026-07-29).
  const [overflow, setOverflow] = React.useState({ top: false, bottom: false });
  const listId = React.useId();
  const typed = React.useRef({ str: "", t: 0 });

  // ── Verdict : la SEULE voie vers l'état d'erreur d'un select ──────────────────────────
  const verdictEffectif = verdict ?? champ?.verdict;
  const statut = resolveStatus(verdictEffectif, champ?.status);
  const enErreur = statut === "error";
  const message = verdictMessage(verdictEffectif);
  // Hors bloc champ, le select porte lui-même son message : SELECT-R07 exige la bordure ET le
  // message. Dans un bloc, c'est l'emplacement de message du bloc qui l'affiche — un seul.
  const messageAutonome = !champ && message ? msgId : undefined;
  const cableEffectif = {
    ...cable,
    "aria-invalid": enErreur || undefined,
    "aria-describedby": (cable["aria-describedby"] as string | undefined) ?? messageAutonome,
    ...(native && champ?.required ? { required: true } : {}),
  };
  /** La bordure d'erreur s'ajoute à la facture, y compris en `ghost` : un select fautif ne peut
   *  pas rester sans trait, sans quoi l'état ne serait porté que par le message. */
  const bordureStatut = enErreur ? "border-danger" : undefined;
  /** Hors bloc champ, le message accompagne le select ; dans un bloc, le bloc s'en charge. */
  const enveloppe = (noyau: React.ReactNode) =>
    messageAutonome ? (
      <span className="inline-flex flex-col gap-xs">
        {noyau}
        <FieldMessage id={msgId} severity={message!.severity}>{message!.texte}</FieldMessage>
      </span>
    ) : (
      noyau
    );

  const updateOverflow = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setOverflow({
      top: el.scrollTop > 2,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 2,
    });
  }, []);
  React.useEffect(() => {
    if (open) updateOverflow();
  }, [open, options, updateOverflow]);
  // L'option active suit le clavier jusque dans une liste qui défile.
  // `scrollIntoView?.()` : la méthode n'existe que là où il y a une MISE EN PAGE — jsdom ne
  // l'implémente pas. Sans la garde, l'appel lève dans un effet passif et React démonte tout
  // l'arbre : un formulaire entier disparaissait au premier test qui ouvrait la liste. Même
  // convention que `ResizeObserver` dans CardGroup et Tabs (« jsdom / navigateurs anciens ») —
  // le confort de défilement s'efface, la sélection au clavier reste entière.
  React.useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [open, active, listId]);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
  const firstEnabled = () => {
    const i = options.findIndex((o) => !o.disabled);
    return i < 0 ? 0 : i;
  };

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : firstEnabled());
    setOpen(true);
  };
  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };
  const commit = (idx: number) => {
    const opt = options[idx];
    if (opt && !opt.disabled) onValueChange(opt.value);
    close();
  };
  const move = (dir: 1 | -1) => {
    setActive((prev) => {
      let i = prev;
      for (let n = 0; n < options.length; n++) {
        i = (i + dir + options.length) % options.length;
        if (!options[i].disabled) return i;
      }
      return prev;
    });
  };
  const typeahead = (ch: string) => {
    const now = Date.now();
    typed.current.str = now - typed.current.t > 700 ? ch : typed.current.str + ch;
    typed.current.t = now;
    const q = typed.current.str.toLowerCase();
    const i = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(q));
    if (i >= 0) {
      if (open) setActive(i);
      else onValueChange(options[i].value);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const k = e.key;
    if (!open) {
      if (k === "ArrowDown" || k === "ArrowUp" || k === "Enter" || k === " ") {
        e.preventDefault();
        openList();
        return;
      }
    } else {
      if (k === "ArrowDown") return e.preventDefault(), move(1);
      if (k === "ArrowUp") return e.preventDefault(), move(-1);
      if (k === "Home") return e.preventDefault(), setActive(firstEnabled());
      if (k === "End") {
        e.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) if (!options[i].disabled) { setActive(i); break; }
        return;
      }
      if (k === "Enter" || k === " ") return e.preventDefault(), commit(active);
      if (k === "Escape") return e.preventDefault(), close();
      if (k === "Tab") return commit(active);
    }
    if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      typeahead(k);
    }
  };

  // ── Forme native : le déclencheur du système, le menu de l'OS ──────────────────────────
  if (native) {
    return enveloppe(
      <div className={cn("relative inline-block", className)}>
        <select
          value={value ?? ""}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled || loading}
          aria-busy={loading || undefined}
          data-style={variant === "ghost" || loading ? undefined : "lighter"}
          data-tone={variant === "ghost" || loading ? undefined : "neutral"}
          className={cn(
            triggerVariants({ size, variant }),
            "appearance-none",
            variant === "ghost" ? "pr-7" : "pr-9",
            !selected && "text-text-muted",
            loading && "ds-skeleton",
            bordureStatut,
          )}
          {...cableEffectif}
          {...aria}
        >
          {value == null ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <Chevron />
        </span>
      </div>,
    );
  }

  return enveloppe(
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-opt-${active}` : undefined}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        data-style={variant === "ghost" || loading ? undefined : "lighter"}
        data-tone={variant === "ghost" || loading ? undefined : "neutral"}
        className={cn(triggerVariants({ size, variant }), loading && "ds-skeleton", bordureStatut)}
        {...cableEffectif}
        {...aria}
      >
        <span className={cn("truncate", !selected && "text-text-muted")}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron />
      </button>

      {open && (
        <div
          className={cn(
            // au moins la largeur du déclencheur, mais JAMAIS tronqué : la liste s'élargit
            // au mot le plus long (w-max), plafond raisonnable pour rester un popover
            "absolute top-full z-popover mt-1 w-max min-w-full max-w-menu overflow-hidden rounded-lg border border-border bg-background shadow-overlay",
            variant === "ghost" ? "right-0" : "left-0",
          )}
        >
          {/* voiles de débordement — pointer-events-none, purement informatifs */}
          {overflow.top ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex h-7 items-start justify-center bg-gradient-to-b from-background to-transparent pt-0.5">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5 text-text-muted">
                <path d="M6 12l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
          {overflow.bottom ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex h-7 items-end justify-center bg-gradient-to-t from-background to-transparent pb-0.5">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5 text-text-muted">
                <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
          <ul
            role="listbox"
            id={listId}
            ref={listRef}
            tabIndex={-1}
            onScroll={updateOverflow}
            className="ds-no-scrollbar max-h-64 w-full overflow-auto py-1 outline-none"
          >
          {options.map((o, i) => {
            const isSel = o.value === value;
            return (
              <li
                key={o.value}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={isSel}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => !o.disabled && commit(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-sm px-md py-2 text-text-primary",
                  i === active && "bg-surface-hover",
                  o.disabled && "opacity-50 cursor-not-allowed",
                )}
              >
                <span className="truncate">{o.label}</span>
                {isSel && <Check />}
              </li>
            );
          })}
          </ul>
        </div>
      )}
    </div>,
  );
}
Select.displayName = "Select";

export { triggerVariants as selectTriggerVariants };
