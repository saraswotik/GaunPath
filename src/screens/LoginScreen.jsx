import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

/*
 * LoginScreen.jsx — logs in through the Python backend (Supabase Auth).
 * The same generic error is shown for a wrong email or wrong password,
 * so the app never reveals which accounts exist.
 */
function LoginScreen() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const data = await login(email.trim(), password);
      signIn(data.name);
      navigate("/region");
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
        <h1 className="text-2xl font-bold text-gaun-text">Welcome Back</h1>
        <p className="text-gaun-muted text-sm mt-1">
          Log in to continue to GaunPath
        </p>
      </div>

      <FormSection title="Log In">
        <InputField
          label="Email"
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="you@example.com"
        />

        {/* Password field (masked input) */}
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="Enter your password"
        />

        {errorMsg && (
          <div className="bg-gaun-error-bg border border-gaun-error/30 rounded-lg p-3">
            <p className="text-gaun-error text-sm font-medium">⚠️ {errorMsg}</p>
          </div>
        )}

        <PrimaryButton
          variant="filled"
          label={submitting ? "Logging in…" : "Log In"}
          onClick={handleLogin}
          disabled={!isFormValid || submitting}
        />
      </FormSection>
    </div>
  );
}

export default LoginScreen;
