import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";

/**
 * Handles the redirect from the backend after Google OAuth.
 * Reads ?token=&user= from the URL, stores them, then sends
 * the user to /builder.
 */
export default function GoogleCallback() {
  const { login } = useAuth();
  const { loadFromServer } = usePortfolio();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(user, token);
        loadFromServer().then(() => navigate("/builder", { replace: true }));
      } catch {
        navigate("/?error=google_failed", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      <p className="text-ink-muted text-sm">Signing you in with Google…</p>
    </div>
  );
}
