import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { TEMPLATES } from "../portfolio-templates";
import { usePortfolio } from "../context/PortfolioContext";
import api from "../utils/api";
import {
  Sparkles, Check, ChevronRight, Bot, Wand2, RefreshCcw, Eye,
  Cpu, Palette, Terminal, BookOpen, Box, ArrowRight
} from "lucide-react";

function TemplateThumbnail({ type, accentColor }) {
  const acc = accentColor;
  if (type === "minimal") return (
    <div className="w-full h-full bg-[#07080f] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2"><div className="w-6 h-6 rounded" style={{ background: acc }} /><div className="h-2 w-20 bg-white/20 rounded" /></div>
      <div className="h-px bg-white/10" />
      <div className="h-3 bg-white/30 rounded w-3/4" />
      <div className="h-2 bg-white/15 rounded w-full" />
      <div className="flex gap-2 mt-2">{[1,2,3].map(i => <div key={i} className="flex-1 h-12 rounded-lg border" style={{ borderColor: acc+"40", background: acc+"08" }} />)}</div>
    </div>
  );
  if (type === "creative") return (
    <div className="w-full h-full bg-[#0f0318] p-0 overflow-hidden">
      <div className="h-16 w-full" style={{ background: `linear-gradient(135deg, ${acc}30, #0f031840)` }} />
      <div className="p-3">
        <div className="h-3 rounded mb-2" style={{ background: acc, width: "60%" }} />
        <div className="h-2 bg-white/20 rounded mb-1 w-full" />
        <div className="h-2 bg-white/10 rounded w-4/5" />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="h-14 rounded-xl" style={{ background: acc+"20", border: `1px solid ${acc}40` }} />
          <div className="h-14 rounded-xl bg-white/5 border border-white/10" />
        </div>
      </div>
    </div>
  );
  if (type === "terminal") return (
    <div className="w-full h-full bg-[#0d1117] p-4 font-mono">
      <div className="flex gap-1.5 mb-3"><div className="w-2.5 h-2.5 rounded-full bg-red-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/70" /></div>
      <div className="space-y-1">
        <div className="text-[9px] flex gap-1.5" style={{ color: acc }}><span>$</span><div className="h-1.5 bg-current/60 rounded w-24 mt-0.5" /></div>
        <div className="h-1.5 bg-white/30 rounded w-4/5" />
        <div className="h-1.5 bg-white/20 rounded w-full" />
        <div style={{ color: acc }} className="text-[9px] mt-2">{'> Portfolio loaded ✓'}</div>
      </div>
    </div>
  );
  if (type === "magazine") return (
    <div className="w-full h-full bg-white p-4 flex flex-col">
      <div className="h-1 w-full mb-3" style={{ background: acc }} />
      <div className="h-5 bg-gray-900 rounded w-2/3 mb-2" />
      <div className="h-2 bg-gray-300 rounded w-full mb-1" />
      <div className="flex gap-2 flex-1">
        <div className="h-full bg-gray-100 rounded" style={{ flex: 2 }} />
        <div className="flex flex-col gap-1.5" style={{ flex: 1 }}>
          <div className="flex-1 bg-gray-100 rounded" /><div className="flex-1 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
  if (type === "glassmorphic") return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0030 0%, #000520 100%)" }}>
      <div className="absolute top-0 left-0 w-24 h-24 rounded-full blur-xl opacity-60" style={{ background: acc }} />
      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full blur-xl opacity-40" style={{ background: "#60a5fa" }} />
      <div className="absolute inset-4 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/20 p-3">
        <div className="h-2.5 rounded w-1/2 mb-2" style={{ background: acc }} />
        <div className="h-1.5 bg-white/40 rounded mb-1 w-full" />
        <div className="h-1.5 bg-white/30 rounded w-3/4" />
      </div>
    </div>
  );
  return <div className="w-full h-full bg-bg-elevated" />;
}

function TemplateCard({ template, selected, onSelect, onPreview }) {
  const iconMap = { minimal: <Cpu size={14} />, creative: <Palette size={14} />, terminal: <Terminal size={14} />, magazine: <BookOpen size={14} />, glassmorphic: <Box size={14} /> };
  return (
    <div
      className={`template-card glass-card rounded-2xl overflow-hidden cursor-pointer group ${selected ? "border-2" : "border border-bg-border hover:border-white/20"}`}
      style={selected ? { borderColor: template.accentColor, boxShadow: `0 0 30px ${template.accentColor}25` } : {}}
      onClick={() => onSelect(template.id)}
    >
      <div className="h-44 overflow-hidden relative">
        <TemplateThumbnail type={template.thumbnail} accentColor={template.accentColor} />
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: template.accentColor+"15" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: template.accentColor }}>
              <Check size={18} className="text-bg-base" />
            </div>
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onPreview(template.id); }}
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-bg-base/80 backdrop-blur-sm text-ink text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bg-elevated">
          <Eye size={12} /> Preview
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-ink">{template.name}</h3>
          <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: template.accentColor+"20", color: template.accentColor }}>{iconMap[template.thumbnail]}</span>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed mb-3">{template.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: template.accentColor+"12", color: template.accentColor }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TemplatePage() {
  const { selectedTemplate, setSelectedTemplate } = usePortfolio();
  const [selected, setSelectedLocal] = useState(selectedTemplate || null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedLocal(id);
    setSelectedTemplate(id);
  };

  const [aiResult, setAiResult] = useState(null);

  // Local keyword fallback when Gemini API is unavailable
  const localMatchTemplate = (prompt) => {
    const p = prompt.toLowerCase();
    if (/cyber|punk|hack|matrix|terminal|dark code|develo|tech|cli|command/i.test(p))
      return { templateId: "terminal", reasoning: "Terminal theme matches your dark/tech aesthetic (local match)" };
    if (/glass|blur|3d|depth|frosted|luxury|immersive/i.test(p))
      return { templateId: "glassmorphic", reasoning: "Glassmorphic theme matches your 3D/depth aesthetic (local match)" };
    if (/color|neon|vibrant|bold|artist|designer|creative|expressive|bright/i.test(p))
      return { templateId: "creative", reasoning: "Creative theme matches your vibrant aesthetic (local match)" };
    if (/editorial|magazine|journal|formal|white|print|elegant|minimal clean/i.test(p))
      return { templateId: "magazine", reasoning: "Magazine theme matches your editorial aesthetic (local match)" };
    return { templateId: "minimal", reasoning: "Minimal theme selected as best default match (local match)" };
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setAiResult(null);
    try {
      const { data } = await api.post("/api/gemini/generate-template", { prompt: aiPrompt });
      setAiResult(data);
      handleSelect(data.templateId);
    } catch {
      // Gemini API unavailable — use local keyword matching silently
      const local = localMatchTemplate(aiPrompt);
      setAiResult(local);
      handleSelect(local.templateId);
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = (id) => {
    setSelectedTemplate(id);
    navigate(`/preview?template=${id}`);
  };

  const handleContinue = () => {
    if (selected) {
      setSelectedTemplate(selected);
      navigate(`/preview?template=${selected}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <div className="pt-16">
        <div className="border-b border-bg-border bg-bg-surface">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag tag-cyan"><Sparkles size={11} /> Step 3 of 4</span>
                </div>
                <h1 className="font-display text-4xl font-semibold text-ink mb-2">Choose your style</h1>
                <p className="text-ink-muted max-w-lg">Select from our premium templates or let Gemini AI generate a completely custom design.</p>
              </div>
              <button onClick={handleContinue} disabled={!selected} className="btn-primary py-3 px-6 disabled:opacity-30 disabled:cursor-not-allowed hidden md:flex">
                Preview Portfolio <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full bg-accent-cyan" />
              <h2 className="font-semibold text-ink">Pre-built Templates</h2>
              <span className="tag tag-cyan text-[10px] py-0.5">5 designs</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEMPLATES.map(template => (
                <TemplateCard key={template.id} template={template} selected={selected === template.id} onSelect={handleSelect} onPreview={handlePreview} />
              ))}
              {/* AI Card */}
              <div className={`template-card glass-card rounded-2xl overflow-hidden ${selected === "ai" ? "border-2 border-accent-orange" : "border border-bg-border hover:border-white/20"}`}
                style={selected === "ai" ? { boxShadow: "0 0 30px rgba(251,146,60,0.2)" } : {}}>
                <div className="h-44 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(251,191,36,0.1) 100%)" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center mx-auto mb-3"><Bot size={28} className="text-accent-orange" /></div>
                      <p className="text-accent-orange font-semibold text-sm">Gemini AI</p>
                      <p className="text-ink-faint text-xs">Generate unique design</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-ink">AI-Generated Portfolio</h3>
                    <span className="tag tag-orange text-[10px] py-0.5">Beta</span>
                  </div>
                  <p className="text-ink-muted text-sm mb-4">Describe your aesthetic and Gemini AI will craft a completely unique portfolio design.</p>
                  <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} onClick={() => handleSelect("ai")}
                    placeholder="e.g. 'A dark cyberpunk portfolio with neon blue accents and particle animations...'"
                    className="field-input resize-none h-20 text-sm mb-3" />
                  <button onClick={() => { handleSelect("ai"); handleGenerate(); }} disabled={!aiPrompt.trim() || generating}
                    className="w-full btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: generating ? undefined : "linear-gradient(135deg, #fb923c, #fbbf24)" }}>
                    {generating ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg> Generating…</> : <><Wand2 size={15} /> Generate</>}
                  </button>
                  {aiResult && (
                    <div className="mt-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                      <span className="font-semibold">✨ AI picked:</span> <span className="capitalize font-medium text-orange-200">{aiResult.templateId}</span>
                      {aiResult.reasoning && <p className="mt-1 text-orange-300/80">{aiResult.reasoning}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between border-t border-bg-border pt-6 mt-10">
            <p className="text-ink-muted text-sm">
              {selected ? `✓ Template selected: ${TEMPLATES.find(t => t.id === selected)?.name || "AI Generated Design"}` : "Select a template above to continue"}
            </p>
            <button onClick={handleContinue} disabled={!selected} className="btn-primary py-3 px-8 disabled:opacity-30 disabled:cursor-not-allowed">
              Preview & Download <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
