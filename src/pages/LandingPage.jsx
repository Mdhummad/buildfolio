import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import {
  Sparkles, Zap, Download, FileText, Layout, Star, ChevronRight,
  CheckCircle2, ArrowRight, Code2, Palette, Bot, Shield
} from "lucide-react";

const features = [
  {
    icon: <Layout size={22} />,
    title: "5 Premium Templates",
    desc: "Professionally crafted portfolio designs spanning minimal, creative, and technical aesthetics.",
    tag: "Design",
    color: "cyan",
  },
  {
    icon: <Bot size={22} />,
    title: "Gemini AI Generator",
    desc: "Describe your vibe — our AI generates a completely unique, bespoke portfolio just for you.",
    tag: "AI-Powered",
    color: "orange",
  },
  {
    icon: <FileText size={22} />,
    title: "ATS-Optimized Resume",
    desc: "Beat applicant tracking systems with structured, keyword-rich resumes that get interviews.",
    tag: "Resume",
    color: "gold",
  },
  {
    icon: <Download size={22} />,
    title: "Download as ZIP",
    desc: "Get your entire portfolio as a ready-to-deploy ZIP — host it anywhere in minutes.",
    tag: "Export",
    color: "cyan",
  },
  {
    icon: <Code2 size={22} />,
    title: "Clean Source Code",
    desc: "Own your code. Every portfolio ships with readable HTML, CSS and JS — no black boxes.",
    tag: "Open",
    color: "orange",
  },
  {
    icon: <Shield size={22} />,
    title: "Secure & Private",
    desc: "Your data stays yours. JWT auth, encrypted storage, zero third-party tracking.",
    tag: "Security",
    color: "gold",
  },
];

const stats = [
  { value: "Free", label: "Forever Free" },
  { value: "5", label: "Premium Templates" },
  { value: "AI", label: "Gemini-Powered" },
  { value: "ZIP", label: "Instant Export" },
];

const techBadges = ["React", "Node.js", "MongoDB", "Gemini AI", "Tailwind", "JWT", "Puppeteer"];

function FloatingCard({ children, className = "" }) {
  return (
    <div className={`glass-card rounded-2xl p-5 glow-cyan ${className}`} style={{ animation: "float 7s ease-in-out infinite" }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [authMode, setAuthMode] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = (mode) => setAuthMode(mode);
  const handleCTA = () => {
    if (isAuthenticated) navigate("/builder");
    else setAuthMode("register");
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar onAuthClick={handleAuthClick} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="animate-on-load" style={{ animationDelay: "0ms" }}>
              <span className="tag tag-cyan mb-6 inline-flex">
                <Sparkles size={11} /> Now with Gemini AI
              </span>
            </div>
            <h1
              className="animate-on-load font-display text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.05] mb-6"
              style={{ animationDelay: "100ms" }}
            >
              Your career,{" "}
              <span className="gradient-text italic">beautifully</span>
              <br />
              presented.
            </h1>
            <p
              className="animate-on-load text-ink-muted text-lg leading-relaxed mb-8 max-w-lg"
              style={{ animationDelay: "200ms" }}
            >
              Build a stunning portfolio and ATS-optimized resume in minutes. Choose from premium
              templates or let AI generate something completely unique — then download and deploy
              instantly.
            </p>

            {/* CTA buttons */}
            <div className="animate-on-load flex flex-wrap gap-3 mb-10" style={{ animationDelay: "300ms" }}>
              <button onClick={handleCTA} className="btn-primary text-base px-8 py-3.5 glow-cyan">
                Start Building Free <ArrowRight size={17} />
              </button>
              <button className="btn-secondary text-base px-8 py-3.5">
                View Templates
              </button>
            </div>

            {/* Checks */}
            <div className="animate-on-load flex flex-wrap gap-4" style={{ animationDelay: "400ms" }}>
              {["No design skills needed", "Free to start", "ATS-friendly resume"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-ink-muted">
                  <CheckCircle2 size={14} className="text-accent-cyan flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: floating UI mock */}
          <div className="relative hidden lg:flex items-center justify-center h-[500px]">
            {/* Main card */}
            <div
              className="glass-card rounded-2xl w-72 p-5 absolute z-10"
              style={{ animation: "float 7s ease-in-out infinite", top: "50px", left: "50px" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-orange" />
                <div>
                  <div className="h-3 bg-bg-border rounded w-24 mb-1.5" />
                  <div className="h-2 bg-bg-border/60 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-2 bg-bg-border rounded w-full" />
                <div className="h-2 bg-bg-border/60 rounded w-4/5" />
                <div className="h-2 bg-bg-border/40 rounded w-3/5" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-20 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                  <Palette size={20} className="text-accent-cyan" />
                </div>
                <div className="flex-1 h-20 rounded-xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                  <Bot size={20} className="text-accent-orange" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-bg-border">
                <span className="text-xs text-ink-muted">ATS Score</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-bg-border rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-accent-cyan rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-accent-cyan">92%</span>
                </div>
              </div>
            </div>

            {/* Template preview card */}
            <div
              className="glass-card rounded-2xl w-56 p-4 absolute"
              style={{ animation: "float 9s ease-in-out infinite 1s", bottom: "40px", right: "20px" }}
            >
              <div className="h-28 rounded-xl bg-gradient-to-br from-bg-elevated to-bg-border mb-3 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full p-3">
                  <div className="h-2 bg-accent-cyan/30 rounded mb-1.5 w-3/4" />
                  <div className="h-1.5 bg-bg-border rounded mb-1 w-full" />
                  <div className="h-1.5 bg-bg-border/60 rounded mb-3 w-4/5" />
                  <div className="flex gap-1.5">
                    <div className="flex-1 h-12 rounded-lg bg-accent-cyan/10" />
                    <div className="flex-1 h-12 rounded-lg bg-accent-orange/10" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Minimal Pro</span>
                <span className="tag tag-cyan text-[10px] py-0.5">Free</span>
              </div>
            </div>

            {/* Gemini badge */}
            <div
              className="glass-card rounded-xl px-4 py-2.5 absolute top-8 right-8 flex items-center gap-2"
              style={{ animation: "float 8s ease-in-out infinite 2s" }}
            >
              <div className="w-6 h-6 rounded-lg bg-accent-orange/20 flex items-center justify-center">
                <Bot size={13} className="text-accent-orange" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink leading-none mb-0.5">Gemini AI</p>
                <p className="text-[10px] text-ink-muted">Generating portfolio…</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-bg-border/60">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-semibold gradient-text">{s.value}</p>
                <p className="text-xs text-ink-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag tag-orange mb-4 inline-flex"><Zap size={11} /> Everything you need</span>
          <h2 className="font-display text-5xl font-semibold text-ink mb-4">
            One platform, complete solution
          </h2>
          <p className="text-ink-muted text-lg max-w-xl mx-auto">
            From first input to deployed portfolio — every step crafted with precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-6 group hover:border-accent-cyan/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110 ${
                f.color === "cyan" ? "bg-accent-cyan/10 text-accent-cyan" :
                f.color === "orange" ? "bg-accent-orange/10 text-accent-orange" :
                "bg-accent-gold/10 text-accent-gold"
              }`}>
                {f.icon}
              </div>
              <span className={`tag mb-3 ${
                f.color === "cyan" ? "tag-cyan" : f.color === "orange" ? "tag-orange" : "tag-gold"
              }`}>{f.tag}</span>
              <h3 className="font-semibold text-ink text-lg mb-2">{f.title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-bg-surface border-y border-bg-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-semibold text-ink mb-4">How it works</h2>
            <p className="text-ink-muted">Four simple steps to your dream portfolio.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Enter your info", desc: "Fill in your experience, skills, projects and education with our guided form." },
              { step: "02", title: "Choose a template", desc: "Pick from 5 curated designs or describe your style for an AI-generated layout." },
              { step: "03", title: "Preview live", desc: "See exactly how your portfolio looks before exporting — make changes on the fly." },
              { step: "04", title: "Download & deploy", desc: "Get your portfolio as a ZIP and your resume as PDF. Deploy to GitHub Pages in one click." },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="font-display text-5xl font-semibold gradient-text leading-none block mb-4">{item.step}</span>
                  <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && <ChevronRight size={20} className="absolute -right-3 top-1/2 -translate-y-1/2 text-ink-faint hidden md:block z-10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <p className="text-center text-ink-faint text-sm font-medium mb-6 tracking-widest uppercase">Built with modern technologies</p>
        <div className="flex flex-wrap justify-center gap-3">
          {techBadges.map((b) => (
            <span key={b} className="px-4 py-2 rounded-lg bg-bg-elevated border border-bg-border text-ink-muted text-sm font-medium hover:border-accent-cyan/30 hover:text-accent-cyan transition-all cursor-default">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-12 text-center glow-cyan relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-accent-orange/5" />
          <div className="relative z-10">
            <Star size={32} className="text-accent-gold mx-auto mb-6" style={{ animation: "float 5s ease-in-out infinite" }} />
            <h2 className="font-display text-5xl font-semibold text-ink mb-4">
              Ready to stand out?
            </h2>
            <p className="text-ink-muted text-lg mb-8">
              Build a portfolio that gets you noticed — powered by AI, exported in seconds, deployed anywhere.
            </p>
            <button onClick={handleCTA} className="btn-primary text-base px-10 py-4 glow-cyan">
              Build Your Portfolio <ArrowRight size={18} />
            </button>
            <p className="text-ink-faint text-xs mt-4">Free forever. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl text-ink">Build<span className="text-accent-cyan">folio</span></span>
          <p className="text-ink-faint text-sm">© 2025 Buildfolio. Open source & free forever.</p>
          <div className="flex gap-6 text-sm text-ink-faint">
            <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms</a>
            <a href="#" className="hover:text-ink transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={() => setAuthMode(authMode === "login" ? "register" : "login")}
        />
      )}
    </div>
  );
}
