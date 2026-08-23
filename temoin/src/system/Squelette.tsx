/* Zone système. Un squelette juste annonce la page qui vient ; un squelette
   faux la dément — c'est ce que juge B-6, et c'est pourquoi il prend la forme
   de ce qu'il remplace plutôt qu'une forme générique.
   Il ne remplace pas une durée réelle : É1 doit montrer un compte qui avance,
   pas un rond qui tourne (K2 §6).
   La forme « titre » est née de R2.7 : une section qui attend attend en entier,
   son titre compris. Sans elle, un titre et une phrase auraient exactement la
   même allure en gris, et le squelette n'annoncerait plus la hiérarchie. */

type Forme = 'lignes' | 'bloc' | 'jetons' | 'titre'

export function Squelette({ forme = 'lignes', lignes = 3 }: { forme?: Forme; lignes?: number }) {
  const barres = Array.from({ length: lignes }, (_, i) => i)
  if (forme === 'titre')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-y-block-coque">
        <div className="h-titre w-1/2 animate-pulse rounded-detail bg-trait" />
      </div>
    )
  if (forme === 'jetons')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-wrap gap-x-inline-carte gap-y-block-carte">
        {barres.map((i) => (
          <div key={i} className="h-jeton w-jeton-large animate-pulse rounded-detail bg-trait" />
        ))}
      </div>
    )
  if (forme === 'bloc')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-y-block-coque">
        <div className="h-bloc w-full animate-pulse rounded-detail bg-trait" />
      </div>
    )
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-y-block-coque">
      {barres.map((i) => (
        <div key={i} className="h-ligne w-full animate-pulse rounded-detail bg-trait last:w-2/3" />
      ))}
    </div>
  )
}
