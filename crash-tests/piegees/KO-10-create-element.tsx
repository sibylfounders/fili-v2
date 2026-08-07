export function KO10() {
  const injecter = () => {
    const b = document.createElement('button')
    b.textContent = 'Envoyer'
    return b
  }
  return <div ref={() => injecter()} />
}
