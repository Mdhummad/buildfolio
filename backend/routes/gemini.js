/**
 * Gemini AI Routes
 * POST /api/gemini/optimize-resume  — analyze JD and tailor resume
 */

const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

// POST /api/gemini/optimize-resume
router.post("/optimize-resume", async (req, res) => {
  try {
    const { portfolioData, jobDescription } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: "Gemini API key not configured" });
    }

    // Build the Gemini prompt
    const prompt = `You are an expert ATS resume optimizer and career coach.

A candidate has the following profile:
${JSON.stringify(portfolioData, null, 2)}

The job description they are applying to is:
"""
${jobDescription}
"""

Your task is to analyze this and return a JSON response with this EXACT structure:
{
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "atsScore": <number 0-100>,
  "optimizedSummary": "<rewritten professional summary tailored to this specific job>",
  "optimizedSkills": {
    "technical": [...reordered/enhanced skills array],
    "languages": [...],
    "tools": [...],
    "soft": [...]
  },
  "experienceEnhancements": [
    {
      "company": "company name",
      "suggestion": "Specific bullet points to add or rewrite to match JD keywords"
    }
  ],
  "suggestions": [
    "<actionable tip 1>",
    "<actionable tip 2>",
    ...
  ],
  "jobTitle": "<extracted job title from JD>",
  "scoreBreakdown": {
    "keywordMatch": <0-100>,
    "experienceMatch": <0-100>,
    "skillsMatch": <0-100>,
    "formattingScore": <0-100>
  }
}

Rules:
- matchedKeywords: keywords from the JD that exist in the candidate's profile
- missingKeywords: important JD keywords NOT in the profile (max 10)
- atsScore: overall match score (0-100)
- optimizedSummary: rewrite the summary to include JD keywords naturally, keep it 3-4 sentences
- Respond ONLY with valid JSON, no markdown, no explanation`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData?.error?.message || "Gemini API error");
    }

    const geminiData = await response.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON response from Gemini
    const cleanedText = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleanedText);

    res.json(result);
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ message: "AI optimization failed", error: err.message });
  }
});

module.exports = router;
