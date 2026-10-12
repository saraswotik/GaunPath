/*
 * PrimaryButton.jsx — Reusable pill-shaped button component
 *
 * PROPS (passed from parent → child):
 *   - variant : "filled" | "outline"  — determines visual style
 *   - label   : string                — button text
 *   - onClick : function              — handler when button is tapped
 *   - disabled: boolean (optional)    — grays out and disables the button
 *
 * PARENT-TO-CHILD PROP FLOW:
 *   The parent screen decides WHAT the button says (label),
 *   HOW it looks (variant), and WHAT happens on tap (onClick).
 *   This component simply renders and delegates — it holds no
 *   state of its own.
 */
function PrimaryButton({ variant = "filled", label, onClick, disabled = false }) {
  /*
   * Base styles shared by both variants:
   *   rounded-full → pill shape
   *   w-full       → full width of parent container
   *   py-3 px-6    → comfortable tap target for mobile
   *   font-semibold → clear readable text
   *   transition   → smooth hover/press feedback
   */
  const baseStyles =
    "w-full rounded-full py-3 px-6 font-semibold text-center transition-colors duration-200";

  /*
   * Variant-specific styles:
   *   "filled"  → teal background, dark text (primary action)
   *   "outline" → transparent background, teal border + text (secondary action)
   *
   * When disabled, both variants get reduced opacity and
   * cursor-not-allowed to signal the button is inactive.
   */
  const variantStyles =
    variant === "filled"
      ? "bg-gaun-teal text-gaun-bg hover:bg-gaun-teal-dark"
      : "border-2 border-gaun-teal text-gaun-teal hover:bg-gaun-teal/10";

  const disabledStyles = disabled
    ? "opacity-40 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${disabledStyles}`}
    >
      {label}
    </button>
  );
}

export default PrimaryButton;
