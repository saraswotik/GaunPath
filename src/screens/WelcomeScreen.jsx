import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

/*
 * WelcomeScreen.jsx — Screen 1: App landing / login page
 *
 * This is the first screen users see. It displays:
 *   - App name "GaunPath"
 *   - Tagline about the app's purpose
 *   - "Get Started" → navigates to Sign Up (new users)
 *   - "I Have an Account" → navigates to Login (returning users)
 *
 * PROP FLOW:
 *   This screen does not receive props — it's a top-level route.
 *   It PASSES props TO PrimaryButton:
 *     - variant → "filled" for primary action, "outline" for secondary
 *     - label   → the button text string
 *     - onClick → the navigation function
 */
function WelcomeScreen() {
  /*
   * useNavigate() is a React Router hook that returns a function
   * we can call to programmatically navigate to a different route.
   * Here, both buttons navigate to "/region".
   */
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 text-center">
      {/* ── App branding ── */}
      <div className="space-y-3">
        {/* Decorative icon — mountain/road emoji as visual anchor */}
        <div className="text-5xl">🏔️</div>

        {/* App name — large and bold */}
        <h1 className="text-4xl font-bold text-gaun-teal">GaunPath</h1>

        {/* Tagline — muted color for visual hierarchy */}
        <p className="text-gaun-muted text-base max-w-[280px]">
          Navigate rural Nepal with community-verified road conditions
        </p>
      </div>

      {/* ── Action buttons ── */}
      <div className="w-full space-y-3">
        {/*
         * PRIMARY BUTTON — "Get Started" (filled variant)
         * Takes new users to the Sign Up screen.
         */}
        <PrimaryButton
          variant="filled"
          label="Get Started"
          onClick={() => navigate("/signup")}
        />

        {/*
         * SECONDARY BUTTON — "I Have an Account" (outline variant)
         * Takes returning users directly to Login (skips signup).
         */}
        <PrimaryButton
          variant="outline"
          label="I Have an Account"
          onClick={() => navigate("/login")}
        />
      </div>

      {/* ── Footer note ── */}
      <p className="text-xs text-gaun-muted">
        Community-powered road reports for rural Nepal
      </p>
    </div>
  );
}

export default WelcomeScreen;
