import { useNavigate, useLocation } from "react-router-dom";
import FormSection from "../components/FormSection";
import PrimaryButton from "../components/PrimaryButton";

/*
 * ConfirmationScreen.jsx — shows the report exactly as it was saved
 * in the database. Submission errors are now shown on the Report screen,
 * so this screen only shows the success state.
 */
function ConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { region, destination, hazardType, severity, description } =
    location.state || {};

  const sevColor =
    severity === "High"
      ? "text-gaun-error"
      : severity === "Medium"
      ? "text-yellow-400"
      : "text-gaun-teal";

  return (
    <div className="flex flex-col gap-6 pt-8">
      <FormSection title="Report Submitted!">
        <div className="bg-gaun-success-bg border border-gaun-teal/20 rounded-xl p-4 text-center space-y-3">
          <div className="text-4xl">✅</div>
          <p className="text-gaun-teal font-semibold">
            Thank you for helping fellow travellers!
          </p>
        </div>

        {/* Report summary */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gaun-muted">Report Summary</p>
          <div className="bg-gaun-bg rounded-xl p-4 space-y-2 text-sm">
            <SummaryRow label="Region" value={region} />
            <SummaryRow label="Destination" value={destination} />
            <SummaryRow label="Hazard" value={hazardType} />
            <div className="flex justify-between">
              <span className="text-gaun-muted">Severity</span>
              <span className={`font-medium ${sevColor}`}>{severity || "—"}</span>
            </div>
            {description && (
              <div className="pt-2 border-t border-gaun-border">
                <span className="text-gaun-muted">Details: </span>
                <span className="text-gaun-text">{description}</span>
              </div>
            )}
          </div>
        </div>

        <PrimaryButton
          variant="filled"
          label="Back to Home"
          onClick={() => navigate("/region")}
        />
        <PrimaryButton
          variant="outline"
          label="View Road Alerts"
          onClick={() => navigate("/road-alerts")}
        />
      </FormSection>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gaun-muted">{label}</span>
      <span className="text-gaun-text font-medium">{value || "—"}</span>
    </div>
  );
}

export default ConfirmationScreen;
