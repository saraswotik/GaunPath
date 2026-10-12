import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FormSection from "../components/FormSection";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { AlertToast } from "../components/AlertToast";
import { useReports } from "../context/ReportsContext";

/*
 * ReportScreen.jsx — Step 3 of 3.
 * Submitting saves the report to Supabase (via the Python API).
 * High severity still shows the AlertToast warning.
 */
function ReportScreen() {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const location = useLocation();
  const { region, destination } = location.state || {};

  const [hazardType, setHazardType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSeverityChange = (e) => {
    const value = e.target.value;
    setSeverity(value);
    setShowAlert(value === "High");
  };

  const isFormValid =
    hazardType.trim() !== "" &&
    severity.trim() !== "" &&
    description.trim() !== "" &&
    !!region &&
    !!destination;

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const saved = await addReport({
        region,
        destination,
        hazardType,
        severity,
        description: description.trim(),
      });
      navigate("/confirmation", { state: saved });
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
        <p className="text-gaun-muted text-sm mb-1">Step 3 of 3</p>
        <h1 className="text-2xl font-bold text-gaun-text">Report Road Condition</h1>
        <p className="text-gaun-muted text-sm mt-1">
          <span className="text-gaun-teal">{destination}</span> in{" "}
          <span className="text-gaun-teal">{region}</span>
        </p>
      </div>

      {/* ── AlertToast — high severity warning ── */}
      <AnimatePresence>
        {showAlert && (
          <AlertToast
            variant="warning"
            styleVariant="filled"
            title="High Severity Hazard"
            description="This report will be flagged as urgent."
            onClose={() => setShowAlert(false)}
          />
        )}
      </AnimatePresence>

      <FormSection title="What did you encounter?">
        <InputField
          label="Hazard Type"
          type="select"
          value={hazardType}
          onChange={(e) => setHazardType(e.target.value)}
          options={["Landslide", "Flooding", "Road Closed", "Other"]}
        />

        <InputField
          label="Severity"
          type="select"
          value={severity}
          onChange={handleSeverityChange}
          options={["Low", "Medium", "High"]}
        />

        <InputField
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe the condition..."
        />

        {errorMsg && (
          <div className="bg-gaun-error-bg border border-gaun-error/30 rounded-lg p-3">
            <p className="text-gaun-error text-sm font-medium">⚠️ {errorMsg}</p>
          </div>
        )}

        <PrimaryButton
          variant="filled"
          label={submitting ? "Submitting…" : "Submit Report"}
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
        />
      </FormSection>
    </div>
  );
}

export default ReportScreen;
