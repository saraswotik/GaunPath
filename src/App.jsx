import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ReportsProvider } from "./context/ReportsContext";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import RegionScreen from "./screens/RegionScreen";
import TripScreen from "./screens/TripScreen";
import ReportScreen from "./screens/ReportScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import RoadAlertsScreen from "./screens/RoadAlertsScreen";

/*
 * App.jsx — Root component with React Router configuration
 *
 * Public screens:    /  /signup  /login
 * Protected screens: /region /trip /report /confirmation /road-alerts
 *                    (redirect to /login when not logged in)
 *
 *   AuthProvider    → login state (token held by api.js)
 *   ReportsProvider → road reports loaded from / saved to Supabase
 */
function RequireAuth({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" replace />;
}

function Shell() {
  const { loggedIn, userName, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen mx-auto max-w-[390px] px-4 py-6">
      {loggedIn && (
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="text-xs text-gaun-muted hover:text-gaun-teal transition-colors border border-gaun-border rounded-full px-3 py-1"
          >
            Log out{userName ? ` (${userName})` : ""}
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/region" element={<RequireAuth><RegionScreen /></RequireAuth>} />
        <Route path="/trip" element={<RequireAuth><TripScreen /></RequireAuth>} />
        <Route path="/report" element={<RequireAuth><ReportScreen /></RequireAuth>} />
        <Route path="/confirmation" element={<RequireAuth><ConfirmationScreen /></RequireAuth>} />
        <Route path="/road-alerts" element={<RequireAuth><RoadAlertsScreen /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <Shell />
      </ReportsProvider>
    </AuthProvider>
  );
}

export default App;
