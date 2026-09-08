/* Zone système. Un état non nominal est annoncé. Le refus de statuer de É1 est
   un verdict à part entière, et il s'annonce comme une alerte — K2 §7.2, et la
   perte n°1 du run de K1 que le produit ne reconduit pas.
   Le refus prend le rouge de la convention, le suspendu le jaune — tous deux
   calculés depuis la primaire, et tous deux doublés d'une forme et d'un libellé. Aucune assertion ne vérifie encore le rôle
   d'annonce — il entrera au corpus avec S6, et le défaut serait invisible au
   Gardien. C'est écrit pour que personne ne le découvre.

   Le troisième ton — « verrou » — porte ce qui vient d'être acquis. Il existe
   parce qu'un acte réussi est un état déclaré au contrat (K2 §6) et qu'il ne
   s'annonçait nulle part : l'écran changeait trois mots, et un lecteur d'écran
   n'entendait rien. Il prend le rôle « statut » et jamais « alerte » : un
   succès rend compte, il n'interrompt pas. Son vocabulaire est celui du jeton
   — même nom de ton, même forme, même couple de teintes —, pour qu'un état
   n'ait pas deux noms selon l'endroit où on le lit. */
import type { ReactNode } from 'react'
import { Icon } from './Icon.tsx'
import type { NameIcon } from './expression.generated.ts'

type Announces = 'alert' | 'status'
type Tone = 'refusal' | 'waiting' | 'lock'

/* Le fond teinté porte l'état, et il le porte seul. La barre latérale a été
   retirée le 2026-08-11 : elle disait une troisième fois ce que la teinte et le
   libellé disaient déjà, et elle déséquilibrait le bloc. Le trait devient un
   contour ordinaire, de la même famille que celui du jeton — un état n'a pas
   deux traitements selon l'endroit où on le lit. */
const LOOK: Record<Tone, string> = {
  refusal: 'border-error-stroke bg-error-surface text-error-on',
  waiting: 'border-alert-stroke bg-alert-surface text-alert-on',
  lock: 'border-success-stroke bg-success-surface text-success-on',
}

const SHAPE: Record<Tone, NameIcon> = {
  refusal: 'refusal',
  waiting: 'waiting',
  lock: 'lock',
}

export function Alert({
  heading,
  tone = 'refusal',
  announces = 'alert',
  children,
}: {
  heading: string
  tone?: Tone
  announces?: Announces
  children: ReactNode
}) {
  return (
    <div
      role={announces === 'alert' ? 'alert' : 'status'}
      className={`flex flex-col gap-y-block-container border-system px-inline-card py-block-card ${LOOK[tone]}`}
    >
      <p className="flex items-center gap-x-inline-card text-level3 font-pressed">
        <Icon name={SHAPE[tone]} size="large" />
        {heading}
      </p>
      <div className="text-end">{children}</div>
    </div>
  )
}
