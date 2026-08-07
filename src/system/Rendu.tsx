/* Zone système. C'est ici que <iframe> est légitime, et nulle part ailleurs.
 *
 * Un témoin se juge RENDU, jamais en capture : #016 interdit la maquette
 * dessinée à la main, et K2 §6 interdit le repli sur une image de secours.
 * Le cadre charge donc le fichier que la chaîne de rendu a produit depuis la
 * source que le Gardien a vérifiée — s'il ne se charge pas, on ne juge pas.
 *
 * Il est cloisonné. Le témoin est du HTML produit par le dépôt, mais lui
 * donner la page qui le juge reviendrait à lui donner le pouvoir de la
 * maquiller : c'est la ligne rouge de K2 §8 appliquée au rendu.
 */

type Hauteur = 'pleine' | 'vignette'

const HAUTEUR: Record<Hauteur, string> = {
  pleine: 'h-cadre',
  vignette: 'h-vignette',
}

export function Rendu({
  source,
  titre,
  hauteur = 'pleine',
}: {
  source: string
  titre: string
  hauteur?: Hauteur
}) {
  return (
    <iframe
      src={source}
      title={titre}
      sandbox=""
      loading="lazy"
      className={`w-full rounded-controle border-systeme border-trait-net bg-papier ${HAUTEUR[hauteur]}`}
    />
  )
}
