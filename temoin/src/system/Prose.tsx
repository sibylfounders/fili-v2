/* Zone système. Un texte long, rendu paragraphe par paragraphe.
 *
 * Il entre au système et non dans l'écran qui l'emploie, parce que le rythme
 * d'un texte suivi — l'écart entre deux paragraphes, la largeur de mesure —
 * est une décision de composition. Laissée à chaque page, elle serait prise
 * autant de fois qu'il y a de pages, et jamais deux fois pareil.
 *
 * Il n'interprète rien. Le texte qu'il reçoit est rendu tel qu'il est écrit :
 * interpréter serait mettre en forme, et mettre en forme une décision passée
 * reviendrait à la retoucher (règle 3 du journal).
 */
import { Stack } from './Stack.tsx'
import { Text } from './Text.tsx'

export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter((b) => b !== '')
  return (
    /* Le niveau vient de la geometrie : c est le seul dont l ecart tient
       entre une et une fois et demie le corps, a toutes les largeurs. */
    <Stack space="page">
      {blocks.map((b, i) => (
        <Text variant="body" key={`${String(i)}-${b.slice(0, 24)}`}>
          {b.replace(/\n/g, ' ')}
        </Text>
      ))}
    </Stack>
  )
}
