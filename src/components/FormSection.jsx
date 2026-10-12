/*
 * FormSection.jsx — Reusable rounded card wrapper component
 *
 * PROPS (passed from parent → child):
 *   - title    : string       — heading text displayed at the top of the card
 *   - children : React nodes  — any content placed INSIDE this component
 *
 * PARENT-TO-CHILD PROP FLOW:
 *   The parent screen passes a `title` (what the section is called)
 *   and `children` (the form fields, buttons, etc. that go inside).
 *   This demonstrates React's "composition" pattern — the parent
 *   decides the content, this component decides the layout/wrapper.
 *
 *   Usage example in a parent screen:
 *     <FormSection title="Select Your Region">
 *       <p>Choose a district below</p>    ← these are the "children"
 *       <PrimaryButton ... />
 *     </FormSection>
 */
function FormSection({ title, children }) {
  return (
    /*
     * Card styling:
     *   bg-gaun-card    → slightly lighter than page background
     *   rounded-2xl     → large corner radius per design spec
     *   p-6             → comfortable inner padding
     *   space-y-5       → vertical gap between child elements
     *   border          → subtle border for card definition
     */
    <div className="bg-gaun-card rounded-2xl p-6 space-y-5 border border-gaun-border">
      {/* Section title — rendered above the children */}
      <h2 className="text-xl font-bold text-gaun-text">{title}</h2>

      {/* children prop — renders whatever the parent passes inside */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export default FormSection;
