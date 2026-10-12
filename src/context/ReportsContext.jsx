import { createContext, useContext, useState, useCallback } from "react";
import { getAllReports, createReport } from "../api";

/*
 * ReportsContext.jsx — road reports, now stored in Supabase.
 *   reports      : array of reports (newest first), loaded from the API
 *   loadReports(): fetch the latest reports from the database
 *   addReport()  : save a new report to the database via the Python API
 * Report shape: { id, region, destination, hazardType, severity, description, timestamp }
 */
const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReports(await getAllReports());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Throws on failure so the Report screen can show the message. */
  const addReport = useCallback(async (reportData) => {
    const saved = await createReport(reportData);
    setReports((prev) => [saved, ...prev]);
    return saved;
  }, []);

  return (
    <ReportsContext.Provider value={{ reports, loading, error, loadReports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) throw new Error("useReports must be used within a ReportsProvider");
  return context;
}
