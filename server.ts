import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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

// REST route for Carbon Coach AI
app.post("/api/coach", async (req, res) => {
  try {
    const { auditInput, profile, actions, messages, committedIds = [], completedDays = [1], persona = "custom" } = req.body;

    if (!auditInput || !profile || !actions || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required profile context or messages" });
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
      return res.status(200).json({
        reply: "Namaste! I am CarbonCoach AI, your personalized advisor. I see that your GEMINI_API_KEY is not configured yet in the Settings panel. Once configured, I will give you full AI insights!\n\nBased on your Carbon Score of " + profile.carbonScore + "/100 and annual emissions of " + profile.annualEmissions + " Tons CO₂, your highest ranked recommendation is: \"" + (highestRec?.title || "Reduce AC usage") + "\" which saves " + (highestRec?.customSavingKg || 120) + "kg CO₂ and ₹" + rsSaved + "/year. Try toggling this in the Impact Simulator!"
      });
    }

    const highestCategory = Object.entries(profile.breakdown || {})
      .filter(([cat]) => cat !== "total")
      .reduce((max, curr) => curr[1] > max[1] ? curr : max, ["none", 0])[0];

    const challengeStreakCount = completedDays.length;
    const committedActionList = committedIds
      .map((id: string) => {
        const action = actions.find((a: any) => a.id === id);
        return action ? `"${action.title}"` : id;
      })
      .join(", ") || "No actions committed yet in the Impact Simulator";

    // Build rich prompt metadata
    const profileSummary = `
USER CARBON PROFILE SUMMARY:
- Selected Persona: ${persona}
- Carbon Score: ${profile.carbonScore}/100 (Where higher is more sustainable, 100 is baseline)
- Annual Emissions: ${profile.annualEmissions} Metric Tons CO₂
- Category Breakdown:
  * Transport: ${profile.breakdown.transport} Tons (${profile.breakdownPercentages.transport}%)
  * Energy: ${profile.breakdown.energy} Tons (${profile.breakdownPercentages.energy}%)
  * Food: ${profile.breakdown.food} Tons (${profile.breakdownPercentages.food}%)
  * Shopping: ${profile.breakdown.shopping} Tons (${profile.breakdownPercentages.shopping}%)
  * Flights: ${profile.breakdown.flights} Tons (${profile.breakdownPercentages.flights}%)
- Highest Emission Category: ${highestCategory.toUpperCase()}
- Simulated/Committed Actions: ${committedActionList}
- 7-Day Challenge Progress: Completed ${challengeStreakCount} out of 7 daily challenges.

TOP RECOMMENDED REDUCTION ACTIONS (including custom annual Rupee savings calculated at standard conservative rates):
${actions.slice(0, 4).map((a: any, i: number) => {
  const rsSaved = getFinancialSavings(a.category, a.customSavingKg);
  return `  ${i + 1}. [${a.id}] ${a.title} - Saves: ${a.customSavingKg}kg/year CO₂ | Saves ₹${rsSaved}/year (Ease: ${a.ease}/5, Cost: ${a.cost}/3)`;
}).join("\n")}
`;

    const systemInstruction = `You are CarbonCoach AI, an elite, personalized lifestyle carbon advisor for Indian households or commuters.
Your goal is to help users make real decisions to lower their carbon footprint. Use Indian examples where relevant (ceiling fans instead of AC, Swiggy/Zomato consolidation, local metro/BRTS, auto-rickshaws, scooters, local seasonal sabzi mandi, line-drying clothes on balconies, switching off wall socket boards).

Crucial Instruction: Avoid generic sustainability advice. Your response MUST be structured strictly in these five sections:
1. **Biggest Problem**: Frame the highest footprint category (${highestCategory.toUpperCase()}) based on their selected persona (${persona}), and explain why it impacts their score. Compare their emissions briefly with the Paris Agreement target of 2.0 Tons.
2. **Highest Impact Fix**: Spotlight their single highest carbon-reducing action (e.g., "${actions[0]?.title || 'Reduce AC usage'}"), explaining its annual CO₂ savings (in kg) and the estimated annual Rupee savings (₹).
3. **Easiest Quick Win**: Propose a quick, zero-cost adjustment (such as turning off physical wall socket switch toggles or natural balcony clothes drying) with its corresponding CO₂ and Rupee savings.
4. **Expected Carbon Savings**: Summarize the collective potential CO₂ savings (in kg or Tons) they can achieve if they implement these recommendations.
5. **Expected ₹ Savings**: Summarize the total collective financial savings (in Rupees ₹/year) from these adjustments.

Strict Instructions:
- NEVER hallucinate or invent mathematical emission values. Refer ONLY to the verified data context in the prompt.
- Settle into a highly encouraging, direct, professional, and conversational tone. Keep under 300 words.`;

    // Map message roles cleanly to GenAI parameter structure (role is 'user' or 'model')
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
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
    return res.status(500).json({ error: "Fail-safe: Critical error handling AI reply.", details: error.message });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server served from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarbonCoach AI server actively listenting on http://localhost:${PORT}`);
  });
}

configureServer();
