import { Button, TextField } from '../design-system/index.ts'

export function OK1() {
  return (
    <section className="px-inline-container py-block-container">
      <TextField id="email" label="Adresse e-mail" />
      <Button>Valider</Button>
    </section>
  )
}
