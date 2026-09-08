/* Zone système. C'est ici que <textarea> et <input> sont légitimes.
 *
 * Le composant est déclaré au registre depuis l'origine et n'avait pas encore
 * d'emploi : É4 lui en donne un, parce qu'un refus sans motif écrit ne se
 * relit pas. Il n'est donc pas construit « en avance sur le besoin » — la
 * règle de K5 tient.
 *
 * Le libellé n'est jamais un texte fantôme dans le champ : un texte fantôme
 * disparaît à la saisie, et l'utilisateur perd la question au moment où il y
 * répond. Le lien libellé/champ et le lien champ/aide sont explicites, pas
 * déduits de la proximité visuelle.
 */
import { useId } from 'react'

export function TextField({
  label,
  value,
  onInput,
  help,
  multiline = false,
  invalid = false,
  disabled = false,
}: {
  label: string
  value: string
  onInput: (v: string) => void
  help?: string
  multiline?: boolean
  invalid?: boolean
  disabled?: boolean
}) {
  const id = useId()
  const idHelp = `${id}-help`
  const look = `w-full rounded-control border-system bg-paper px-inline-card py-block-detail text-body text-ink placeholder:text-ink-off disabled:cursor-not-allowed disabled:text-ink-off ${
    invalid ? 'border-error-full' : 'border-stroke-net'
  }`

  return (
    <div className="flex flex-col gap-y-block-card">
      <label className="text-end font-mean text-ink" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          disabled={disabled}
          aria-describedby={help === undefined ? undefined : idHelp}
          aria-invalid={invalid}
          onChange={(e) => {
            onInput(e.target.value)
          }}
          className={look}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          aria-describedby={help === undefined ? undefined : idHelp}
          aria-invalid={invalid}
          onChange={(e) => {
            onInput(e.target.value)
          }}
          className={look}
        />
      )}
      {help === undefined ? null : (
        <p className="text-end text-ink-soft" id={idHelp}>
          {help}
        </p>
      )}
    </div>
  )
}
