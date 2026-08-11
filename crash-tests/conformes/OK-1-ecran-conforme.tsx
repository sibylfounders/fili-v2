import { Button, TextField } from '../design-system/index.ts'

export function OK1() {
  return (
    <section className="px-inline-coque py-block-coque">
      <TextField id="email" label="Adresse e-mail" />
      <Button>Valider</Button>
    </section>
  )
}
