/* Zone système. C'est ici que <select> est légitime, et nulle part ailleurs.
 *
 * Un choix dans une liste fermée est une vraie mécanique de système : c'est
 * elle qui garantit qu'on ne désigne que ce qui existe. É7 est le premier
 * écran à en avoir l'emploi — on ne déplace pas le statut d'une ligne qu'on
 * aurait saisie de mémoire.
 *
 * Une option peut être indisponible sans disparaître. C'est important : un
 * choix retiré de la liste laisse croire qu'il n'a jamais existé, alors qu'un
 * choix montré et désactivé dit qu'il existe et qu'il n'est pas ouvert
 * maintenant. Le motif se lit à côté, jamais dans le contrôle.
 */
import { useId } from 'react'

export type Option = { value: string; label: string; group?: string; unavailable?: boolean }

export function Selection({
  label,
  value,
  options,
  onChoice,
  help,
  disabled = false,
}: {
  label: string
  value: string
  options: Option[]
  onChoice: (v: string) => void
  help?: string
  disabled?: boolean
}) {
  const id = useId()
  const idHelp = `${id}-help`
  const groups = [...new Set(options.map((o) => o.group ?? ''))]

  return (
    <div className="flex flex-col gap-y-block-card">
      <label className="text-end font-mean text-ink" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-describedby={help === undefined ? undefined : idHelp}
        onChange={(e) => {
          onChoice(e.target.value)
        }}
        className="w-full rounded-control border-system border-stroke-net bg-paper px-inline-card py-block-detail text-body text-ink disabled:cursor-not-allowed disabled:text-ink-off"
      >
        {groups.map((g) =>
          g === '' ? (
            options
              .filter((o) => (o.group ?? '') === '')
              .map((o) => (
                <option disabled={o.unavailable} key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
          ) : (
            <optgroup key={g} label={g}>
              {options
                .filter((o) => o.group === g)
                .map((o) => (
                  <option disabled={o.unavailable} key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
          ),
        )}
      </select>
      {help === undefined ? null : (
        <p className="text-end text-ink-soft" id={idHelp}>
          {help}
        </p>
      )}
    </div>
  )
}
