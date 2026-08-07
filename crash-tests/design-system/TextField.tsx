export function TextField({ id, label }) {
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  )
}
