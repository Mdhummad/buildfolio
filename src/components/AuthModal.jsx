import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight, GitBranch, Globe } from "lucide-react";
import api, { API_BASE_URL } from "../utils/api";

export default function AuthModal({ mode = "login", onClose, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { loadFromServer } = usePortfolio();
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      login(data.user, data.token);
      // Load existing portfolio data from server after login
      await loadFromServer();
      onClose();
      navigate("/builder");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass-card rounded-2xl p-8 animate-on-load"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-bg-elevated hover:bg-bg-border flex items-center justify-center text-ink-muted hover:text-ink transition-all"
        >
          <X size={16} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="tag tag-cyan">{isLogin ? "Welcome back" : "Create account"}</span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink mb-2">
            {isLogin ? "Sign in to continue" : "Start building today"}
          </h2>
          <p className="text-ink-muted text-sm">
            {isLogin ? "Access your portfolio projects and resume builder." : "Join thousands of professionals showcasing their work."}
          </p>
        </div>

        {/* ── Google OAuth Button ─────────────────────────────── */}
        <button
          type="button"
          onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/google`; }}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-bg-border bg-bg-elevated hover:border-accent-cyan/40 hover:bg-bg-border transition-all text-ink-muted hover:text-ink font-medium text-sm mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-bg-border" />
          <span className="text-xs text-ink-faint">or continue with email</span>
          <div className="flex-1 h-px bg-bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="field-input pl-10" required />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="field-input pl-10" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                name="password" type={showPass ? "text" : "password"} value={form.password}
                onChange={handleChange} placeholder="••••••••" className="field-input pl-10 pr-10" required minLength={6}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                </svg>
                Please wait...
              </span>
            ) : (
              <>{isLogin ? "Sign in" : "Create account"} <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={onSwitch} className="text-accent-cyan hover:underline font-medium">
            {isLogin ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
