import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { signUp } from "../api";

/*
 * SignUpScreen.jsx — creates a real account through the Python backend.
 * The password is sent over HTTPS to the API, which passes it to Supabase Auth
 * (hashed there). It is never kept in React state after submit.
 */
function SignUpScreen() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isFormValid =
    name.trim() !== "" && email.trim() !== "" && password.length >= 6;

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await signUp(name.trim(), email.trim(), password);
      navigate("/login");
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-8">
      {/* ── Screen header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gaun-text">Join GaunPath</h1>
        <p className="text-gaun-muted text-sm mt-1">
          Create an account to start reporting road conditions
        </p>
      </div>

      <FormSection title="Create Account">
        <InputField
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sita Sharma"
        />

        <InputField
          label="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {/* Password field (masked input) */}
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password (6+ characters)"
        />

        {errorMsg && (
          <div className="bg-gaun-error-bg border border-gaun-error/30 rounded-lg p-3">
            <p className="text-gaun-error text-sm font-medium">⚠️ {errorMsg}</p>
          </div>
        )}

        <PrimaryButton
          variant="filled"
          label={submitting ? "Creating account…" : "Sign Up"}
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
        />
      </FormSection>
    </div>
  );
}

export default SignUpScreen;
