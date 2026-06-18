import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { isValidCarbonAuditInput, isValidCommittedIds, isValidCompletedDays } from "./src/utils/validation";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(helmet());

// Initialize standard express parser
app.use(express.json());

// Initialize Google GenAI on the server to protect keys
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per window
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." },
});

function sanitizeInput(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// REST route for Carbon Coach AI
app.post("/api/coach", apiLimiter, async (req, res) => {
  try {
    const { auditInput, profile, actions, messages, committedIds = [], completedDays = [1], persona = "custom" } = req.body;

    if (!profile || !actions || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required profile context or messages" });
    }

    if (auditInput && !isValidCarbonAuditInput(auditInput)) {
      return res.status(400).json({ error: "Invalid audit input structure" });
    }

    if (!isValidCommittedIds(committedIds)) {
      return res.status(400).json({ error: "Invalid committed IDs structure" });
    }

    if (!isValidCompletedDays(completedDays)) {
      return res.status(400).json({ error: "Invalid completed days structure" });
    }

    if (!Array.isArray(actions)) {
      return res.status(400).json({ error: "Invalid array inputs provided" });
    }

    function sanitizeInput(text: string | number): string {
      if (text === null || text === undefined) return "";
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function getFinancialSavings(category: string, co2SavingKg: number): number {
      switch (category) {
        case "energy": return Math.round(co2SavingKg * 15);
        case "transport": return Math.round(co2SavingKg * 10);
        case "food": return Math.round(co2SavingKg * 8);
        case "shopping": return Math.round(co2SavingKg * 12);
        case "flights": return Math.round(co2SavingKg * 8);
        default: return Math.round(co2SavingKg * 10);
      }
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      const highestRec = actions[0];
      const rsSaved = highestRec ? getFinancialSavings(highestRec.category, highestRec.customSavingKg) : 1800;
      const safeScore = sanitizeInput(profile.carbonScore);
      const safeEmissions = sanitizeInput(profile.annualEmissions);
      const safeTitle = sanitizeInput(highestRec?.title || "Reduce AC usage");
      const safeSavingKg = sanitizeInput(highestRec?.customSavingKg || 120);
      return res.status(200).json({
        reply: "Namaste! I am CarbonCoach AI, your personalized advisor. I see that your GEMINI_API_KEY is not configured yet in the Settings panel. Once configured, I will give you full AI insights!\n\nBased on your Carbon Score of " + safeScore + "/100 and annual emissions of " + safeEmissions + " Tons CO₂, your highest ranked recommendation is: \"" + safeTitle + "\" which saves " + safeSavingKg + "kg CO₂ and ₹" + rsSaved + "/year. Try toggling this in the Impact Simulator!"
      });
    }

    const highestCategory = Object.entries(profile.breakdown || {})
      .filter(([cat]) => cat !== "total")
      .reduce((max, curr) => curr[1] > max[1] ? curr : max, ["none", 0])[0];

    const challengeStreakCount = completedDays.length;
    const committedActionList = committedIds
      .map((id: string) => {
        const action = actions.find((a: any) => a.id === id);
        return action ? `"${sanitizeInput(action.title)}"` : sanitizeInput(id);
      })
      .join(", ") || "No actions committed yet in the Impact Simulator";

    // Build rich prompt metadata
    const profileSummary = `
USER CARBON PROFILE SUMMARY:
- Selected Persona: ${sanitizeInput(persona)}
- Carbon Score: ${sanitizeInput(profile.carbonScore)}/100 (Where higher is more sustainable, 100 is baseline)
- Annual Emissions: ${sanitizeInput(profile.annualEmissions)} Metric Tons CO₂
- Category Breakdown:
  * Transport: ${sanitizeInput(profile.breakdown.transport)} Tons (${sanitizeInput(profile.breakdownPercentages.transport)}%)
  * Energy: ${sanitizeInput(profile.breakdown.energy)} Tons (${sanitizeInput(profile.breakdownPercentages.energy)}%)
  * Food: ${sanitizeInput(profile.breakdown.food)} Tons (${sanitizeInput(profile.breakdownPercentages.food)}%)
  * Shopping: ${sanitizeInput(profile.breakdown.shopping)} Tons (${sanitizeInput(profile.breakdownPercentages.shopping)}%)
  * Flights: ${sanitizeInput(profile.breakdown.flights)} Tons (${sanitizeInput(profile.breakdownPercentages.flights)}%)
- Highest Emission Category: ${sanitizeInput(highestCategory.toUpperCase())}
- Simulated/Committed Actions: ${committedActionList}
- 7-Day Challenge Progress: Completed ${sanitizeInput(challengeStreakCount)} out of 7 daily challenges.

TOP RECOMMENDED REDUCTION ACTIONS (including custom annual Rupee savings calculated at standard conservative rates):
${actions.slice(0, 4).map((a: any, i: number) => {
  const rsSaved = getFinancialSavings(a.category, a.customSavingKg);
  return `  ${i + 1}. [${sanitizeInput(a.id)}] ${sanitizeInput(a.title)} - Saves: ${sanitizeInput(a.customSavingKg)}kg/year CO₂ | Saves ₹${rsSaved}/year (Ease: ${sanitizeInput(a.ease)}/5, Cost: ${sanitizeInput(a.cost)}/3)`;
}).join("\n")}
`;

    const systemInstruction = `You are CarbonCoach AI, an elite, personalized lifestyle carbon advisor for Indian households or commuters.
Your goal: Help users make quick, high-impact decisions to lower their carbon footprint.
Extreme conciseness is required (under 120 words).

FORMATTING RULES:
- Use STRICT MARKDOWN with Emojis:
- **[CATEGORY]** for headers.
- ✅ for Action items.
- ⚡ for Quick wins.
- 💰 for Financial savings.
- 🌿 for Carbon savings.
- No flowery words. Direct and impactful.

STRUCTURE:
1. **[THE BIG PROBLEM]**: 1 direct sentence on ${sanitizeInput(highestCategory.toUpperCase())} impact for the ${sanitizeInput(persona)} persona.
2. **[TOP PRIORITY ACTION]**:
   - ✅ **Recommendation**: 1 bullet point.
   - 🌿 **Impact**: Annual CO₂ saving in kg.
   - 💰 **Savings**: Annual ₹ saving.
3. **[QUICK ZERO-COST WIN]**: 
   - ⚡ **Tip**: 1 bullet point habit change (e.g. wall socket switches).
4. **[YOUR MONTHLY TARGET]**: 1 line summary of total potential impact.`;

    // Map message roles cleanly to GenAI parameter structure (role is 'user' or 'model')
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: sanitizeInput(m.content) }],
    }));

    // Inject the profile context injection at the last user query to keep it prominent
    if (contents.length > 0) {
      const lastIndex = contents.length - 1;
      if (contents[lastIndex].role === "user") {
        contents[lastIndex].parts[0].text = `[USER PROFILE SUMMARY CONTEXT]\n${profileSummary}\n\n[USER INQUIRY]\n${contents[lastIndex].parts[0].text}`;
      }
    }

    // Use gemini-3.5-flash which is standard, fast, and highly capable
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to complete your coaching advice. Let's try focusing on a simple step, like reducing AC duration by 1 hour daily!";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({ error: "Fail-safe: Critical error handling AI reply.", details: "An internal error occurred" });
  }
});

// Configure Vite or Static Assets Server
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite asset development server
    app.use(vite.middlewares);
    console.log("Vite development server mounted");
  } else {
    // In production (Vercel/Cloud Run), serve from dist
    const distPath = path.join(process.cwd(), "dist");
    
    // Fallback check for different serverless environments
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath);
    });
    console.log("Production static server served from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarbonCoach AI server actively listenting on http://localhost:${PORT}`);
  });
}

// Ensure the server configures itself
if (process.env.NODE_ENV !== "test") {
  configureServer();
}

// Export for Vercel
export default app;
