export default function FormField({ id, label, required = false, hint, error, children }) {
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="form-field__hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="form-field__error">{error}</p>}
    </div>
  )
}