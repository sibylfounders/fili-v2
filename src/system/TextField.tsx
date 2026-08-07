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
  valeur,
  surSaisie,
  aide,
  multiligne = false,
  invalide = false,
  desactive = false,
}: {
  label: string
  valeur: string
  surSaisie: (v: string) => void
  aide?: string
  multiligne?: boolean
  invalide?: boolean
  desactive?: boolean
}) {
  const id = useId()
  const idAide = `${id}-aide`
  const allure = `w-full rounded-controle border-systeme bg-papier px-4 py-3 text-corps text-encre placeholder:text-encre-eteinte disabled:cursor-not-allowed disabled:text-encre-eteinte ${
    invalide ? 'border-erreur-plein' : 'border-trait-net'
  }`

  return (
    <div className="flex flex-col gap-2">
      <label className="text-fin font-moyenne text-encre" htmlFor={id}>
        {label}
      </label>
      {multiligne ? (
        <textarea
          id={id}
          rows={4}
          value={valeur}
          disabled={desactive}
          aria-describedby={aide === undefined ? undefined : idAide}
          aria-invalid={invalide}
          onChange={(e) => {
            surSaisie(e.target.value)
          }}
          className={allure}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={valeur}
          disabled={desactive}
          aria-describedby={aide === undefined ? undefined : idAide}
          aria-invalid={invalide}
          onChange={(e) => {
            surSaisie(e.target.value)
          }}
          className={allure}
        />
      )}
      {aide === undefined ? null : (
        <p className="text-fin text-encre-douce" id={idAide}>
          {aide}
        </p>
      )}
    </div>
  )
}
