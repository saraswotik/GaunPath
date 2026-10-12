/*
 * InputField.jsx — Reusable labeled input component
 *
 * PROPS (passed from parent → child):
 *   - label       : string    — text label shown above the input
 *   - type        : "text" | "select" | "password" — input type to render
 *   - value       : string    — current value (controlled component)
 *   - onChange     : function  — called when user types or selects a new value
 *   - placeholder : string (optional) — placeholder text for text inputs
 *   - options     : array of strings (optional) — dropdown options for "select" type
 *
 * PARENT-TO-CHILD PROP FLOW (Controlled Component Pattern):
 *   The parent screen HOLDS the state (useState) and passes
 *   the current `value` DOWN to this component, plus an `onChange`
 *   handler. When the user types/selects, this component calls
 *   onChange, which updates the parent's state, which re-renders
 *   this component with the new value. This is React's
 *   "lifting state up" pattern — the parent is the single source
 *   of truth for the input's value.
 *
 *   Parent:  const [name, setName] = useState("");
 *            <InputField value={name} onChange={(e) => setName(e.target.value)} />
 *
 *   Child:   <input value={props.value} onChange={props.onChange} />
 */
function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  options = [],
}) {
  /*
   * Shared styling for both input types:
   *   w-full        → fill parent width
   *   bg-gaun-bg    → match page background (darker than card)
   *   border        → subtle border
   *   rounded-lg    → slightly rounded corners
   *   p-3           → comfortable tap target
   *   text-gaun-text → light text color
   *   focus:border-gaun-teal → teal highlight on focus
   */
  const inputStyles =
    "w-full bg-gaun-bg border border-gaun-border rounded-lg p-3 text-gaun-text " +
    "placeholder:text-gaun-muted focus:border-gaun-teal focus:outline-none " +
    "transition-colors duration-200";

  return (
    <div className="space-y-1.5">
      {/* Label — describes what this input is for */}
      <label className="block text-sm font-medium text-gaun-muted">
        {label}
      </label>

      {/* Conditionally render text input or select dropdown
          based on the `type` prop passed from the parent */}
      {type === "select" ? (
        /*
         * SELECT dropdown — renders options from the `options` array.
         * The parent passes: options={["Landslide", "Flooding", ...]}
         * We map over them to create <option> elements.
         */
        <select value={value} onChange={onChange} className={inputStyles}>
          {/* Default empty option to prompt selection */}
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        /*
         * TEXT / PASSWORD input — standard text field.
         * When type="password", the browser masks the characters.
         * value and onChange come from parent's useState.
         */
        <input
          type={type === "password" ? "password" : "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputStyles}
        />
      )}
    </div>
  );
}

export default InputField;
