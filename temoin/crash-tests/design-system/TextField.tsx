export function TextField({ id, label }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  )
}
