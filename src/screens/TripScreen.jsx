import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormSection from "../components/FormSection";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { getDestinations } from "../api";

/*
 * TripScreen.jsx — Step 2 of 3.
 * Destination suggestions for the chosen region are loaded from the
 * Supabase `destinations` table (through the Python API).
 */
function TripScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  /* Region chosen on the previous screen (empty when opened from Road Alerts) */
  const region = location.state?.region || "";

  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getDestinations(region)
      .then(setSuggestions)
      .catch((e) => setErrorMsg(e.message));
  }, [region]);

  const handleSearch = () => {
    navigate("/report", {
      state: { region: region || "Unknown Region", destination: destination.trim() },
    });
  };

  return (
    <div className="flex flex-col gap-6 pt-8">
      {/* ── Screen header ── */}
      <div>
        <p className="text-gaun-muted text-sm mb-1">Step 2 of 3</p>
        <h1 className="text-2xl font-bold text-gaun-text">Plan Your Trip</h1>
        <p className="text-gaun-muted text-sm mt-1">
          Region: <span className="text-gaun-teal">{region || "Any"}</span>
        </p>
      </div>

      <FormSection title="Where are you going?">
        <InputField
          label="Destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Rara Lake, Jumla Bazaar..."
        />

        {errorMsg && (
          <div className="bg-gaun-error-bg border border-gaun-error/30 rounded-lg p-3">
            <p className="text-gaun-error text-sm font-medium">⚠️ {errorMsg}</p>
          </div>
        )}

        {/* ── Popular destinations (from the database) ── */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gaun-muted">Popular destinations</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setDestination(dest.name)}
                  className={`rounded-xl p-3 text-left text-sm transition-colors duration-200 border ${
                    destination === dest.name
                      ? "border-gaun-teal bg-gaun-teal/10"
                      : "border-gaun-border hover:border-gaun-muted"
                  }`}
                >
                  <span className="mr-1.5">{dest.icon}</span>
                  <span className="text-gaun-text">{dest.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <PrimaryButton
          variant="filled"
          label="Search"
          onClick={handleSearch}
          disabled={!destination.trim()}
        />

        <PrimaryButton
          variant="outline"
          label="Road Alerts"
          onClick={() => navigate("/road-alerts")}
        />
      </FormSection>
    </div>
  );
}

export default TripScreen;
