/**
 * Gemini AI Routes
 * POST /api/gemini/generate-template  — PUBLIC: picks best template for a prompt
 * POST /api/gemini/optimize-resume    — PROTECTED: ATS resume analysis
 */

const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC — no auth needed
// ────────────────────────────────────────────────────────────────────────────

// POST /api/gemini/generate-template
router.post("/generate-template", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ message: "Prompt is required" });
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ message: "Gemini API key not configured" });

    const systemPrompt = `You are a creative portfolio design advisor.
A user wants a portfolio template that matches this aesthetic: "${prompt}"

Available templates:
- minimal: Clean dark minimalist. Tags: professional, sleek, modern, dark, simple, subtle
- creative: Vibrant gradients, neon accents, expressive. Tags: colorful, bold, designer, artist, vibrant, neon
- terminal: Hacker-style dark terminal with monospace font. Tags: cyberpunk, hacker, developer, terminal, matrix, dark, code, tech
- magazine: Light editorial print-style layout. Tags: editorial, clean, white, professional, journalism, formal
- glassmorphic: Frosted glass with depth and blur effects. Tags: glassmorphic, 3D, modern, blur, depth, luxury, glass

Analyze the user's aesthetic description and pick the best matching template.
Return ONLY valid JSON:
{ "templateId": "terminal", "reasoning": "brief 1-sentence explanation" }`;

    const MODELS = [
      "gemini-2.5-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest",
    ];

    let result = null;
    let lastError = null;

    for (const model of MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 256, responseMimeType: "application/json" },
            }),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          const msg = err?.error?.message || "Gemini API error";
          // If overloaded or model not found, try next model
          if (msg.includes("high demand") || msg.includes("not found") || msg.includes("no longer available")) {
            lastError = msg;
            continue;
          }
          throw new Error(msg);
        }

        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        result = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
        break; // success — stop trying
      } catch (e) {
        lastError = e.message;
        // continue to next model
      }
    }

    if (!result) throw new Error(lastError || "All Gemini models failed");

    const valid = ["minimal", "creative", "terminal", "magazine", "glassmorphic"];
    if (!valid.includes(result.templateId)) result.templateId = "minimal";

    res.json(result);
  } catch (err) {
    console.error("Gemini template error:", err.message);
    res.status(500).json({ message: "AI template generation failed", error: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// PROTECTED — auth required for routes below
// ────────────────────────────────────────────────────────────────────────────
router.use(authMiddleware);

// POST /api/gemini/optimize-resume
router.post("/optimize-resume", async (req, res) => {
  try {
    const { portfolioData, jobDescription } = req.body;

    if (!jobDescription?.trim())
      return res.status(400).json({ message: "Job description is required" });
    if (!process.env.GEMINI_API_KEY)
      return res.status(503).json({ message: "Gemini API key not configured" });

    const prompt = `You are an expert ATS resume optimizer and career coach.

A candidate has the following profile:
${JSON.stringify(portfolioData, null, 2)}

The job description they are applying to is:
"""
${jobDescription}
"""

Return a JSON response with this EXACT structure:
{
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "atsScore": <number 0-100>,
  "optimizedSummary": "<rewritten summary tailored to this job>",
  "optimizedSkills": {
    "technical": [],
    "languages": [],
    "tools": [],
    "soft": []
  },
  "experienceEnhancements": [
    { "company": "company name", "suggestion": "bullet points to add or rewrite" }
  ],
  "suggestions": ["<tip 1>", "<tip 2>"],
  "jobTitle": "<extracted job title>",
  "scoreBreakdown": {
    "keywordMatch": <0-100>,
    "experienceMatch": <0-100>,
    "skillsMatch": <0-100>,
    "formattingScore": <0-100>
  }
}

Rules:
- matchedKeywords: JD keywords that exist in the profile
- missingKeywords: important JD keywords NOT in profile (max 10)
- atsScore: overall match 0-100
- Respond ONLY with valid JSON, no markdown, no explanation`;

    const MODELS = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let raw = "";
    let lastErr = null;

    for (const model of MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, topK: 40, topP: 0.95, maxOutputTokens: 4096, responseMimeType: "application/json" },
            }),
          }
        );
        if (!response.ok) {
          const e = await response.json();
          const msg = e?.error?.message || "Gemini error";
          if (msg.includes("high demand") || msg.includes("not found") || msg.includes("no longer available")) { lastErr = msg; continue; }
          throw new Error(msg);
        }
        const data = await response.json();
        raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        break;
      } catch (e) { lastErr = e.message; }
    }

    if (!raw) throw new Error(lastErr || "All Gemini models failed");

    let result;
    try {
      result = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0].replace(/,\s*([}\]])/g, "$1"));
      else throw new Error("AI returned unparseable response");
    }

    res.json(result);
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ message: "AI optimization failed", error: err.message });
  }
});

module.exports = router;
