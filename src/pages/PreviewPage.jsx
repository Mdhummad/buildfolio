import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { usePortfolio } from "../context/PortfolioContext";
import { getTemplateComponent } from "../portfolio-templates";
import api from "../utils/api";
import {
  Download, FileText, Eye, Smartphone, Monitor, Tablet,
  CheckCircle2, Loader2, Copy, Code2, Gauge, AlertCircle,
  Info, ChevronDown, ChevronUp, Zap, Target, Sparkles, ExternalLink
} from "lucide-react";

const ATS_BASE = [
  { label: "Contact Information", weight: 15 },
  { label: "Professional Summary", weight: 15 },
  { label: "Work Experience", weight: 25 },
  { label: "Skills Section", weight: 20 },
  { label: "Education Section", weight: 10 },
  { label: "Formatting", weight: 10 },
  { label: "Keyword Density", weight: 5 },
];

function computeATS(data) {
  const p = data?.personal || {};
  const scores = {
    "Contact Information": (!!p.name + !!p.email + !!p.phone + !!p.location) / 4 * 100,
    "Professional Summary": p.summary?.length > 50 ? 95 : p.summary?.length > 10 ? 70 : 20,
    "Work Experience": data?.experiences?.length > 0 ? Math.min(100, data.experiences.length * 35) : 0,
    "Skills Section": (Object.values(data?.skills || {}).flat().length > 5) ? 100 : Object.values(data?.skills || {}).flat().length * 15,
    "Education Section": data?.education?.length > 0 ? 90 : 0,
    "Formatting": 100,
    "Keyword Density": Math.min(100, (Object.values(data?.skills || {}).flat().length) * 10),
  };
  const overall = Math.round(ATS_BASE.reduce((acc, c) => acc + (scores[c.label] || 0) * c.weight / 100, 0));
  return { scores, overall };
}

function ATSMeter({ score }) {
  const color = score >= 85 ? "#22d3ee" : score >= 65 ? "#fbbf24" : "#f87171";
  const label = score >= 85 ? "Excellent" : score >= 65 ? "Good" : "Needs Work";
  const circumference = 2 * Math.PI * 54;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg width="144" height="144" className="-rotate-90">
          <circle cx="72" cy="72" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="72" cy="72" r="54" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={circumference - (score / 100) * circumference}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 8px ${color}80)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-semibold" style={{ color }}>{score}</span>
          <span className="text-xs text-ink-muted">/100</span>
        </div>
      </div>
      <p className="font-semibold text-ink mt-2">{label}</p>
      <p className="text-xs text-ink-muted">ATS Compatibility</p>
    </div>
  );
}

export default function PreviewPage() {
  const [params] = useSearchParams();
  const { portfolioData, selectedTemplate: ctxTemplate } = usePortfolio();
  const templateId = params.get("template") || ctxTemplate || "minimal";
  const [viewport, setViewport] = useState("desktop");
  const [activeTab, setActiveTab] = useState("export");
  const [downloadLoading, setDownloadLoading] = useState({ zip: false, pdf: false });
  const [downloaded, setDownloaded] = useState({ zip: false, pdf: false });
  const [atsExpanded, setAtsExpanded] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [jd, setJd] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(null);
  const [jdError, setJdError] = useState("");
  const previewRef = useRef();

  const TemplateComponent = getTemplateComponent(templateId);
  const { scores, overall } = computeATS(portfolioData);
  const viewportWidths = { mobile: "375px", tablet: "768px", desktop: "100%" };

  // ── Download Portfolio HTML (fully client-side) ───────────────────────
  const handleDownloadZip = () => {
    setDownloadLoading(p => ({ ...p, zip: true }));
    try {
      const previewHtml = previewRef.current?.innerHTML || "<p>Portfolio content</p>";
      const name = portfolioData?.personal?.name || "Portfolio";

      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} — Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
    :root {
      --bg-base: #07080f; --bg-surface: #0d0f1a; --bg-elevated: #111827;
      --bg-border: rgba(255,255,255,0.07); --ink: #f1f5f9; --ink-muted: #94a3b8;
      --ink-faint: #475569; --accent-cyan: #22d3ee;
    }
    body { background: var(--bg-base); color: var(--ink); font-family: 'Inter', sans-serif; margin: 0; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
${previewHtml}
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_")}_portfolio.html`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded(p => ({ ...p, zip: true }));
      setTimeout(() => setDownloaded(p => ({ ...p, zip: false })), 4000);
    } catch (err) {
      alert("Download failed: " + err.message);
    } finally {
      setDownloadLoading(p => ({ ...p, zip: false }));
    }
  };


  // ── Download Resume PDF (print) ───────────────────────────────────────
  const handleDownloadPdf = async () => {
    setDownloadLoading(p => ({ ...p, pdf: true }));
    try {
      const { personal, experiences, education, skills, projects, achievements, links } = portfolioData || {};

      const resumeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${personal?.name || "Resume"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #111; line-height: 1.5; padding: 40px 50px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24pt; font-weight: 700; margin-bottom: 4px; }
  h2 { font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #111; padding-bottom: 3px; margin: 18px 0 8px; }
  h3 { font-size: 11pt; font-weight: 700; margin-bottom: 2px; }
  p { margin-bottom: 4px; }
  ul { padding-left: 18px; }
  li { margin-bottom: 2px; }
  .contact-row { font-size: 10pt; color: #333; margin-bottom: 2px; }
  .role-header { display: flex; justify-content: space-between; align-items: baseline; }
  .date-loc { font-size: 10pt; color: #555; white-space: nowrap; margin-left: 8px; }
  .skills-line { margin-bottom: 4px; }
  a { color: #111; text-decoration: none; }
  @media print { body { padding: 20px 30px; } }
</style>
</head>
<body>
<header>
  <h1>${personal?.name || ""}</h1>
  <p class="contact-row">${[personal?.title, personal?.email, personal?.phone, personal?.location, links?.linkedin].filter(Boolean).join(" | ")}</p>
</header>

${personal?.summary ? `<section><h2>Professional Summary</h2><p>${personal.summary}</p></section>` : ""}

${experiences?.length ? `<section><h2>Work Experience</h2>${experiences.map(exp => `
<article style="margin-bottom:12px">
  <div class="role-header"><h3>${exp.role} — ${exp.company}</h3><span class="date-loc">${exp.start || ""} – ${exp.current ? "Present" : exp.end || ""} | ${exp.location || ""}</span></div>
  <ul>${(exp.description || "").split("\n").filter(l => l.trim()).map(l => `<li>${l.replace(/^[•\-*]\s*/, "")}</li>`).join("")}</ul>
</article>`).join("")}</section>` : ""}

${education?.length ? `<section><h2>Education</h2>${education.map(edu => `
<article style="margin-bottom:8px">
  <div class="role-header"><h3>${edu.degree} in ${edu.field} — ${edu.institution}</h3><span class="date-loc">${edu.start || ""} – ${edu.end || ""}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</span></div>
</article>`).join("")}</section>` : ""}

${Object.values(skills || {}).some(a => a?.length) ? `<section><h2>Skills</h2>
  ${skills?.technical?.length ? `<p class="skills-line"><strong>Technical:</strong> ${skills.technical.join(", ")}</p>` : ""}
  ${skills?.languages?.length ? `<p class="skills-line"><strong>Languages:</strong> ${skills.languages.join(", ")}</p>` : ""}
  ${skills?.tools?.length ? `<p class="skills-line"><strong>Tools &amp; Platforms:</strong> ${skills.tools.join(", ")}</p>` : ""}
  ${skills?.soft?.length ? `<p class="skills-line"><strong>Soft Skills:</strong> ${skills.soft.join(", ")}</p>` : ""}
</section>` : ""}

${projects?.length ? `<section><h2>Projects</h2>${projects.map(proj => `
<article style="margin-bottom:10px">
  <h3>${proj.name}${proj.demo ? ` — <a href="${proj.demo}">${proj.demo}</a>` : ""}${proj.github ? ` | <a href="${proj.github}">GitHub</a>` : ""}</h3>
  <p>${proj.desc || ""}</p>
  ${proj.tech ? `<p><strong>Stack:</strong> ${proj.tech}</p>` : ""}
</article>`).join("")}</section>` : ""}

${achievements ? `<section><h2>Achievements &amp; Certifications</h2>${achievements.split("\n").filter(l => l.trim()).map(l => `<p>${l.replace(/^[•\-*]\s*/, "")}</p>`).join("")}</section>` : ""}

</body>
</html>`;

      const win = window.open("", "_blank");
      if (!win) { alert("Please allow popups for this site to download PDF."); return; }
      win.document.write(resumeHTML);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 500);
      setDownloaded(p => ({ ...p, pdf: true }));
      setTimeout(() => setDownloaded(p => ({ ...p, pdf: false })), 4000);
    } catch (err) {
      alert("PDF generation failed: " + err.message);
    } finally {
      setDownloadLoading(p => ({ ...p, pdf: false }));
    }

  };

  // ── Job Match Optimizer ───────────────────────────────────────────────
  const handleOptimize = async () => {
    if (!jd.trim()) return;
    setOptimizing(true); setJdError(""); setOptimized(null);
    try {
      const res = await api.post("/api/gemini/optimize-resume", { portfolioData, jobDescription: jd });
      setOptimized(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg?.includes("not configured")) setJdError("Add your GEMINI_API_KEY to backend/.env to enable AI optimization.");
      else setJdError("Optimization failed: " + msg);
    } finally {
      setOptimizing(false);
    }
  };

  // ── Client-side keyword analysis fallback ────────────────────────────
  const analyzeLocally = () => {
    if (!jd.trim()) return;
    const jdWords = jd.toLowerCase().match(/\b[a-z][a-z+#.]{1,20}\b/g) || [];
    const allSkills = Object.values(portfolioData.skills || {}).flat().map(s => s.toLowerCase());
    const expText = (portfolioData.experiences || []).map(e => `${e.role} ${e.description}`).join(" ").toLowerCase();
    const matched = jdWords.filter(w => allSkills.includes(w) || expText.includes(w));
    const missing = jdWords.filter(w => w.length > 3 && !allSkills.includes(w) && !expText.includes(w));
    const uniqueMissing = [...new Set(missing)].slice(0, 10);
    const score = Math.min(98, Math.round(60 + (matched.length / Math.max(jdWords.length, 1)) * 40));
    setOptimized({
      atsScore: score,
      matchedKeywords: [...new Set(matched)].slice(0, 12),
      missingKeywords: uniqueMissing,
      optimizedSummary: portfolioData.personal?.summary || "",
      suggestions: [
        uniqueMissing.length > 0 ? `Add these skills to your profile: ${uniqueMissing.slice(0,4).join(", ")}` : "Your skills match well!",
        "Quantify achievements with numbers and percentages",
        "Mirror exact phrases from the job description in your summary",
      ],
      scoreBreakdown: { keywordMatch: score, experienceMatch: 80, skillsMatch: score - 5, formattingScore: 100 },
    });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <div className="pt-16 flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

        {/* Left: Live Preview */}
        <div className="flex-1 flex flex-col border-r border-bg-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-bg-border bg-bg-surface flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="tag tag-cyan"><Eye size={11} /> Live Preview</span>
              <span className="text-ink-muted text-xs capitalize">{templateId} template</span>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-elevated border border-bg-border">
              {[{ id: "desktop", icon: <Monitor size={14} /> }, { id: "tablet", icon: <Tablet size={14} /> }, { id: "mobile", icon: <Smartphone size={14} /> }].map(v => (
                <button key={v.id} onClick={() => setViewport(v.id)}
                  className={`p-1.5 rounded-md transition-all ${viewport === v.id ? "bg-accent-cyan/20 text-accent-cyan" : "text-ink-faint hover:text-ink-muted"}`}>
                  {v.icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-bg-base p-4 overflow-auto flex justify-center">
            <div style={{ width: viewportWidths[viewport], maxWidth: "100%", transition: "width 0.3s ease" }} className="h-full">
              <div ref={previewRef} className="bg-white rounded-xl overflow-auto shadow-2xl" style={{ minHeight: "600px", height: "100%" }}>
                <TemplateComponent data={portfolioData} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Control Panel */}
        <div className="w-full lg:w-[400px] bg-bg-surface flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-bg-border flex-shrink-0">
            {[{ id: "export", label: "Export", icon: <Download size={14} /> }, { id: "jobmatch", label: "Job Match", icon: <Target size={14} /> }, { id: "ats", label: "ATS Score", icon: <Gauge size={14} /> }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab.id ? "border-accent-cyan text-accent-cyan" : "border-transparent text-ink-muted hover:text-ink"}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* ── EXPORT TAB ─────────────────────────────── */}
            {activeTab === "export" && (
              <>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink mb-1">Export & Download</h2>
                  <p className="text-ink-muted text-sm">Your portfolio is ready. Download and deploy anywhere.</p>
                </div>

                {/* ZIP */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center flex-shrink-0"><Code2 size={18} className="text-accent-cyan" /></div>
                    <div>
                      <h3 className="font-semibold text-ink mb-0.5">Portfolio Source</h3>
                      <p className="text-ink-muted text-xs">Complete HTML/CSS — deploy to GitHub Pages, Netlify, or Vercel.</p>
                    </div>
                  </div>
                  <button onClick={handleDownloadZip} disabled={downloadLoading.zip}
                    className={`w-full btn-primary py-3 ${downloaded.zip ? "bg-green-500 hover:bg-green-400" : ""}`}>
                    {downloadLoading.zip ? <><Loader2 size={16} className="animate-spin" /> Packaging…</> : downloaded.zip ? <><CheckCircle2 size={16} /> Downloaded!</> : <><Download size={16} /> Download Portfolio ZIP</>}
                  </button>
                </div>

                {/* PDF */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center flex-shrink-0"><FileText size={18} className="text-accent-orange" /></div>
                    <div>
                      <h3 className="font-semibold text-ink mb-0.5">ATS Resume PDF</h3>
                      <p className="text-ink-muted text-xs">Optimized single-column resume — print-ready PDF.</p>
                    </div>
                  </div>
                  <button onClick={() => handleDownloadPdf()} disabled={downloadLoading.pdf}
                    className={`w-full py-3 btn-secondary ${downloaded.pdf ? "border-green-500/40 text-green-400" : "hover:border-accent-orange/40 hover:text-accent-orange"}`}>
                    {downloadLoading.pdf ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : downloaded.pdf ? <><CheckCircle2 size={16} /> Downloaded!</> : <><Download size={16} /> Download Resume PDF</>}
                  </button>
                </div>

                {/* Share link */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-ink text-sm mb-3">Share Preview Link</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 field-input text-xs text-ink-faint truncate py-2.5">portfoliobuilder.app/preview/{templateId}</div>
                    <button onClick={() => { navigator.clipboard?.writeText(`portfoliobuilder.app/preview/${templateId}`); setCopyDone(true); setTimeout(() => setCopyDone(false), 2000); }}
                      className={`btn-secondary text-sm py-2 px-3 ${copyDone ? "border-green-500/40 text-green-400" : ""}`}>
                      {copyDone ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Deploy guide */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3"><Zap size={15} className="text-accent-gold" /><h3 className="font-semibold text-ink text-sm">Quick Deploy</h3></div>
                  {[{ name: "Netlify", steps: "Drag & drop ZIP → Auto-deploy → Live URL", url: "https://netlify.com" }, { name: "GitHub Pages", steps: "Push to repo → Settings → Pages → Deploy", url: "https://pages.github.com" }, { name: "Vercel", steps: "vercel --prod → Done in 30 seconds", url: "https://vercel.com" }].map(opt => (
                    <a key={opt.name} href={opt.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated hover:bg-bg-border/50 transition-colors cursor-pointer group mb-2 no-underline">
                      <div className="flex-1"><p className="text-ink text-xs font-semibold">{opt.name}</p><p className="text-ink-faint text-[11px]">{opt.steps}</p></div>
                      <ExternalLink size={12} className="text-ink-faint" />
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* ── JOB MATCH TAB ───────────────────────────── */}
            {activeTab === "jobmatch" && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1"><Target size={16} className="text-accent-orange" /><h2 className="font-display text-xl font-semibold text-ink">Job Match Optimizer</h2></div>
                  <p className="text-ink-muted text-sm">Paste a job description to get a tailored, high-ATS resume.</p>
                </div>

                <div className="glass-card rounded-2xl p-5">
                  <label className="block text-sm font-medium text-ink-muted mb-2">Job Description</label>
                  <textarea value={jd} onChange={e => setJd(e.target.value)}
                    placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
                    className="field-input resize-none h-40 text-sm mb-3" />
                  <div className="flex gap-2">
                    <button onClick={handleOptimize} disabled={!jd.trim() || optimizing}
                      className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: optimizing ? undefined : "linear-gradient(135deg,#fb923c,#fbbf24)" }}>
                      {optimizing ? <><Loader2 size={15} className="animate-spin" /> Analyzing with AI…</> : <><Sparkles size={15} /> AI Optimize Resume</>}
                    </button>
                    <button onClick={analyzeLocally} disabled={!jd.trim() || optimizing} title="Quick local analysis (no API key needed)"
                      className="btn-secondary py-2.5 px-3 text-xs disabled:opacity-50">
                      Quick
                    </button>
                  </div>
                  <p className="text-ink-faint text-[11px] mt-2">💡 "AI Optimize" uses Gemini API. "Quick" uses local keyword analysis — no API key needed.</p>
                </div>

                {jdError && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{jdError}</div>}

                {optimized && (
                  <>
                    {/* Before / After Score */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="font-semibold text-ink text-sm mb-4 text-center">ATS Score Impact</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold" style={{ color: "#94a3b8" }}>{overall}</p>
                          <p className="text-xs text-ink-faint mt-1">Before</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-accent-cyan">{optimized.atsScore}</p>
                          <p className="text-xs text-ink-faint mt-1">After ↑</p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-bg-border overflow-hidden">
                        <div className="h-full rounded-full bg-accent-cyan transition-all" style={{ width: `${optimized.atsScore}%` }} />
                      </div>
                    </div>

                    {/* Matched keywords */}
                    {optimized.matchedKeywords?.length > 0 && (
                      <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-ink text-sm mb-3">✅ Matched Keywords ({optimized.matchedKeywords.length})</h3>
                        <div className="flex flex-wrap gap-2">
                          {optimized.matchedKeywords.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing keywords */}
                    {optimized.missingKeywords?.length > 0 && (
                      <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-ink text-sm mb-3">⚠️ Missing Keywords ({optimized.missingKeywords.length})</h3>
                        <p className="text-ink-faint text-xs mb-3">Add these to your profile to improve your match:</p>
                        <div className="flex flex-wrap gap-2">
                          {optimized.missingKeywords.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-medium">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Suggestions */}
                    {optimized.suggestions?.length > 0 && (
                      <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-semibold text-ink text-sm mb-3">💡 AI Suggestions</h3>
                        <div className="space-y-2">
                          {optimized.suggestions.map((s, i) => (
                            <div key={i} className="flex gap-2 text-sm text-ink-muted">
                              <span className="text-accent-cyan flex-shrink-0">→</span>{s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optimized Summary */}
                    {optimized.optimizedSummary && optimized.optimizedSummary !== portfolioData.personal?.summary && (
                      <div className="glass-card rounded-2xl p-5 border border-accent-orange/20">
                        <h3 className="font-semibold text-ink text-sm mb-3">✨ AI-Optimized Summary</h3>
                        <p className="text-sm text-ink-muted leading-relaxed italic">"{optimized.optimizedSummary}"</p>
                      </div>
                    )}

                    {/* Download tailored resume */}
                    <button onClick={() => handleDownloadPdf(optimized)}
                      className="w-full btn-primary py-3" style={{ background: "linear-gradient(135deg,#fb923c,#fbbf24)" }}>
                      <Download size={16} /> Download Job-Tailored Resume PDF
                    </button>
                  </>
                )}
              </>
            )}

            {/* ── ATS SCORE TAB ───────────────────────────── */}
            {activeTab === "ats" && (
              <>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink mb-1">ATS Score Analysis</h2>
                  <p className="text-ink-muted text-sm">Based on your current profile data.</p>
                </div>
                <div className="flex justify-center py-4"><ATSMeter score={overall} /></div>
                <div className="space-y-3">
                  {ATS_BASE.map(check => {
                    const s = Math.round(scores[check.label] || 0);
                    const pass = s >= 70;
                    return (
                      <div key={check.label} className="flex items-start gap-3">
                        {pass ? <CheckCircle2 size={15} className="text-accent-cyan flex-shrink-0 mt-0.5" /> : <AlertCircle size={15} className="text-accent-gold flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-ink text-xs font-medium">{check.label}</span>
                            <span className={`text-xs font-bold ${pass ? "text-accent-cyan" : "text-accent-gold"}`}>{s}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-bg-border overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${s}%`, background: pass ? "#22d3ee" : "#fbbf24" }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 rounded-xl bg-accent-gold/5 border border-accent-gold/20 flex gap-2">
                  <Info size={14} className="text-accent-gold flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-muted">Use the <strong className="text-accent-orange">Job Match</strong> tab to paste a job description and get an AI-optimized resume with a higher ATS score.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
