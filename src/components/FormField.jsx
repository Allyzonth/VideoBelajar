function FormField({ id, label, ...inputProps }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} />
    </div>
  )
}

export default FormField