import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import LandingPage from "./pages/LandingPage";
import BuilderPage from "./pages/BuilderPage";
import TemplatePage from "./pages/TemplatePage";
import PreviewPage from "./pages/PreviewPage";
import GoogleCallback from "./pages/GoogleCallback";

/**
 * Wraps a route to redirect unauthenticated users back to the landing page.
 * Shows a spinner while the auth state is being resolved.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

/** Declares all client-side routes for the application */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><TemplatePage /></ProtectedRoute>} />
      <Route path="/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Root component — wraps the app in Auth → Portfolio context → Router */
export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}
