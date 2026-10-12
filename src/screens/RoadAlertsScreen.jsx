import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { useReports } from "../context/ReportsContext";

/*
 * RoadAlertsScreen.jsx — Read-only view of all active road hazards
 *
 * Displays every report submitted during this session, sorted
 * newest-first. Users can filter by hazard type using a dropdown.
 *
 * COMPONENTS USED (reusable):
 *   - FormSection:  each report rendered as a card
 *   - InputField:    filter dropdown (type="select")
 *   - PrimaryButton: "Plan a Trip" navigation button
 *
 * CONTEXT:
 *   - useReports().reports — reads the shared reports array
 */
function RoadAlertsScreen() {
  const navigate = useNavigate();

  /* Read all reports from the shared context (newest first) */
  const { reports, loading, error, loadReports } = useReports();

  /* Load the latest reports from Supabase when the screen opens */
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  /*
   * Filter state — which hazard type to show.
   * "" (empty) means "All" — show everything.
   */
  const [filterType, setFilterType] = useState("");

  /*
   * Apply filter: if filterType is empty, show all reports;
   * otherwise only show reports whose hazardType matches.
   */
  const filteredReports =
    filterType === ""
      ? reports
      : reports.filter((r) => r.hazardType === filterType);

  /*
   * formatTime — converts an ISO timestamp to a human-readable
   * relative time string (e.g. "5 min ago", "2 hours ago").
   */
  const formatTime = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  /*
   * Severity colour mapping — reuses the same colour logic
   * from ConfirmationScreen for visual consistency:
   *   High   → red (gaun-error)
   *   Medium → yellow
   *   Low    → teal (gaun-teal)
   */
  const sevStyles = {
    High: "text-gaun-error bg-gaun-error/10 border-gaun-error/30",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    Low: "text-gaun-teal bg-gaun-teal/10 border-gaun-teal/30",
  };

  return (
    <div className="flex flex-col gap-6 pt-8">
      {/* ── Screen header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gaun-text">
          Road Alerts
        </h1>
        <p className="text-gaun-muted text-sm mt-1">
          {reports.length} active report{reports.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Filter control ── */}
      {/*
       * InputField (type="select") — lets users filter alerts
       * by hazard type. Uses the same InputField component as
       * the Report screen's form.
       */}
      <InputField
        label="Filter by hazard"
        type="select"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        options={["Landslide", "Flooding", "Road Closed", "Other"]}
      />

      {/* ── Reports list or empty state ── */}
      {loading ? (
        <p className="text-gaun-muted text-sm">Loading reports…</p>
      ) : error ? (
        <div className="bg-gaun-error-bg border border-gaun-error/30 rounded-lg p-3">
          <p className="text-gaun-error text-sm font-medium">⚠️ {error}</p>
        </div>
      ) : filteredReports.length === 0 ? (
        /*
         * EMPTY STATE — shown when no reports match the filter
         * (or no reports exist at all).
         */
        <div className="bg-gaun-card rounded-2xl p-8 border border-gaun-border text-center space-y-3">
          <div className="text-4xl">🛣️</div>
          <p className="text-gaun-text font-semibold">
            No active alerts right now
          </p>
          <p className="text-gaun-muted text-sm">Safe travels!</p>
        </div>
      ) : (
        /*
         * REPORT CARDS — each report rendered inside a FormSection.
         * FormSection provides the rounded card wrapper with title.
         */
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <FormSection
              key={report.id}
              title={report.hazardType}
            >
              {/* Severity badge — colour-coded pill */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                    sevStyles[report.severity] || sevStyles.Low
                  }`}
                >
                  {report.severity} Severity
                </span>
                {/* Relative timestamp */}
                <span className="text-xs text-gaun-muted">
                  {formatTime(report.timestamp)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gaun-text">
                {report.description}
              </p>

              {/* Location context */}
              <p className="text-xs text-gaun-muted">
                📍 {report.destination} — {report.region}
              </p>
            </FormSection>
          ))}
        </div>
      )}

      {/* ── Navigation button ── */}
      <PrimaryButton
        variant="outline"
        label="Plan a Trip"
        onClick={() => navigate("/trip", { state: { region: "" } })}
      />
    </div>
  );
}

export default RoadAlertsScreen;
