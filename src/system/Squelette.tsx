/* Zone système. Un squelette juste annonce la page qui vient ; un squelette
   faux la dément — c'est ce que juge B-6, et c'est pourquoi il prend la forme
   de ce qu'il remplace plutôt qu'une forme générique.
   Il ne remplace pas une durée réelle : É1 doit montrer un compte qui avance,
   pas un rond qui tourne (K2 §6). */

type Forme = 'lignes' | 'bloc' | 'jetons'

export function Squelette({ forme = 'lignes', lignes = 3 }: { forme?: Forme; lignes?: number }) {
  const barres = Array.from({ length: lignes }, (_, i) => i)
  if (forme === 'jetons')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-wrap gap-2">
        {barres.map((i) => (
          <div key={i} className="h-8 w-32 animate-pulse rounded-doux bg-trait" />
        ))}
      </div>
    )
  if (forme === 'bloc')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-3">
        <div className="h-32 w-full animate-pulse rounded-controle bg-trait" />
      </div>
    )
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-3">
      {barres.map((i) => (
        <div key={i} className="h-4 w-full animate-pulse rounded-doux bg-trait last:w-2/3" />
      ))}
    </div>
  )
}
