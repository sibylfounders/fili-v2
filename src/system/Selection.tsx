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

export type Option = { valeur: string; libelle: string; groupe?: string; indisponible?: boolean }

export function Selection({
  label,
  valeur,
  options,
  surChoix,
  aide,
  desactive = false,
}: {
  label: string
  valeur: string
  options: Option[]
  surChoix: (v: string) => void
  aide?: string
  desactive?: boolean
}) {
  const id = useId()
  const idAide = `${id}-aide`
  const groupes = [...new Set(options.map((o) => o.groupe ?? ''))]

  return (
    <div className="flex flex-col gap-y-block-carte">
      <label className="text-fin font-moyenne text-encre" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={valeur}
        disabled={desactive}
        aria-describedby={aide === undefined ? undefined : idAide}
        onChange={(e) => {
          surChoix(e.target.value)
        }}
        className="w-full rounded-detail border-systeme border-trait-net bg-papier px-inline-carte py-block-detail text-corps text-encre disabled:cursor-not-allowed disabled:text-encre-eteinte"
      >
        {groupes.map((g) =>
          g === '' ? (
            options
              .filter((o) => (o.groupe ?? '') === '')
              .map((o) => (
                <option disabled={o.indisponible} key={o.valeur} value={o.valeur}>
                  {o.libelle}
                </option>
              ))
          ) : (
            <optgroup key={g} label={g}>
              {options
                .filter((o) => o.groupe === g)
                .map((o) => (
                  <option disabled={o.indisponible} key={o.valeur} value={o.valeur}>
                    {o.libelle}
                  </option>
                ))}
            </optgroup>
          ),
        )}
      </select>
      {aide === undefined ? null : (
        <p className="text-fin text-encre-douce" id={idAide}>
          {aide}
        </p>
      )}
    </div>
  )
}
