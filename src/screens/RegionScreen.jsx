import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";
import PrimaryButton from "../components/PrimaryButton";
import { getRegions } from "../api";

/*
 * RegionScreen.jsx — Step 1 of 3.
 * The list of regions is loaded from the Supabase `regions` table
 * (through the Python API), not hard-coded.
 */
function RegionScreen() {
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState("");
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getRegions()
      .then(setRegions)
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleContinue = () => {
    navigate("/trip", { state: { region: selectedRegion } });
  };

  return (
    <div className="flex flex-col gap-6 pt-8">
      {/* ── Screen header ── */}
      <div>
        <p className="text-gaun-muted text-sm mb-1">Step 1 of 3</p>
        <h1 className="text-2xl font-bold text-gaun-text">Where are you?</h1>
      </div>

      <FormSection title="Select Your Region">
        {loading && <p className="text-gaun-muted text-sm">Loading regions…</p>}

        {errorMsg && (
          <div className="bg-gaun-error-bg border border-gaun-error/30 rounded-lg p-3">
            <p className="text-gaun-error text-sm font-medium">⚠️ {errorMsg}</p>
          </div>
        )}

        {/* ── Region cards list ── */}
        <div className="space-y-3">
          {regions.map((region) => {
            const isSelected = selectedRegion === region.name;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.name)}
                className={`w-full rounded-xl p-4 text-left transition-colors duration-200 border ${
                  isSelected
                    ? "border-gaun-teal bg-gaun-teal/10"
                    : "border-gaun-border hover:border-gaun-muted"
                }`}
              >
                <p className="font-semibold text-gaun-text">{region.name}</p>
                <p className="text-sm text-gaun-muted">{region.description}</p>
              </button>
            );
          })}
        </div>

        <PrimaryButton
          variant="filled"
          label="Continue"
          onClick={handleContinue}
          disabled={!selectedRegion}
        />

        {/* Road Alerts link — lets travellers check hazards before continuing */}
        <PrimaryButton
          variant="outline"
          label="Road Alerts"
          onClick={() => navigate("/road-alerts")}
        />
      </FormSection>
    </div>
  );
}

export default RegionScreen;
