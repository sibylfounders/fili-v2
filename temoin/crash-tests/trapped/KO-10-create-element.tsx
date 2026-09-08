export function KO10() {
  const inject = () => {
    const b = document.createElement('button')
    b.textContent = 'Envoyer'
    return b
  }
  return <div ref={() => inject()} />
}
