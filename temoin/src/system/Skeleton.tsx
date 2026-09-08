/* Zone système. Un squelette juste annonce la page qui vient ; un squelette
   faux la dément — c'est ce que juge B-6, et c'est pourquoi il prend la forme
   de ce qu'il remplace plutôt qu'une forme générique.
   Il ne remplace pas une durée réelle : É1 doit montrer un compte qui avance,
   pas un rond qui tourne (K2 §6).
   La forme « titre » est née de R2.7 : une section qui attend attend en entier,
   son titre compris. Sans elle, un titre et une phrase auraient exactement la
   même allure en gris, et le squelette n'annoncerait plus la hiérarchie. */

type Shape = 'lines' | 'block' | 'tokens' | 'heading'

export function Skeleton({ shape = 'lines', lines = 3 }: { shape?: Shape; lines?: number }) {
  const bars = Array.from({ length: lines }, (_, i) => i)
  if (shape === 'heading')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-y-block-container">
        <div className="h-heading w-1/2 animate-pulse rounded-detail bg-stroke" />
      </div>
    )
  if (shape === 'tokens')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-wrap gap-x-inline-card gap-y-block-card">
        {bars.map((i) => (
          <div key={i} className="h-token w-token-wide animate-pulse rounded-detail bg-stroke" />
        ))}
      </div>
    )
  if (shape === 'block')
    return (
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-y-block-container">
        <div className="h-block w-full animate-pulse rounded-detail bg-stroke" />
      </div>
    )
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-y-block-container">
      {bars.map((i) => (
        <div key={i} className="h-line w-full animate-pulse rounded-detail bg-stroke last:w-2/3" />
      ))}
    </div>
  )
}
