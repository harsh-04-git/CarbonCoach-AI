var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_express_rate_limit = require("express-rate-limit");
var import_helmet = __toESM(require("helmet"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/utils/financialSavings.ts
function getFinancialSavings(category, co2SavingKg) {
  if (co2SavingKg < 0) return 0;
  switch (category) {
    case "energy":
      return Math.round(co2SavingKg * 15);
    case "transport":
      return Math.round(co2SavingKg * 10);
    case "food":
      return Math.round(co2SavingKg * 8);
    case "shopping":
      return Math.round(co2SavingKg * 12);
    case "flights":
      return Math.round(co2SavingKg * 8);
    default:
      return Math.round(co2SavingKg * 10);
  }
}

// src/services/coachService.ts
function sanitizeInput(text) {
  if (text == null) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
async function generateCoachingResponse({
  ai: ai2,
  profile,
  actions,
  messages,
  committedIds,
  completedDays,
  persona
}) {
  const highestCategory = Object.entries(profile.breakdown || {}).filter(([cat]) => cat !== "total").reduce((max, curr) => curr[1] > max[1] ? curr : max, ["none", 0])[0];
  const challengeStreakCount = completedDays.length;
  const committedActionList = committedIds.map((id) => {
    const action = actions.find((a) => a.id === id);
    return action ? `"${sanitizeInput(action.title)}"` : sanitizeInput(id);
  }).join(", ") || "No actions committed yet in the Impact Simulator";
  const profileSummary = `
USER CARBON PROFILE SUMMARY:
- Selected Persona: ${sanitizeInput(persona)}
- Carbon Score: ${sanitizeInput(profile.carbonScore)}/100 (Where higher is more sustainable, 100 is baseline)
- Annual Emissions: ${sanitizeInput(profile.annualEmissions)} Metric Tons CO\u2082
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
${actions.slice(0, 4).map((a, i) => {
    const rsSaved = getFinancialSavings(a.category, a.customSavingKg);
    return `  ${i + 1}. [${sanitizeInput(a.id)}] ${sanitizeInput(a.title)} - Saves: ${sanitizeInput(a.customSavingKg)}kg/year CO\u2082 | Saves \u20B9${rsSaved}/year (Ease: ${sanitizeInput(a.ease)}/5, Cost: ${sanitizeInput(a.cost)}/3)`;
  }).join("\n")}
`;
  const systemInstruction = `You are CarbonCoach AI, an elite, personalized lifestyle carbon advisor for Indian households or commuters.
Your goal: Help users make quick, high-impact decisions to lower their carbon footprint.
Extreme conciseness is required (under 120 words).

FORMATTING RULES:
- Use STRICT MARKDOWN with Emojis:
- **[CATEGORY]** for headers.
- \u2705 for Action items.
- \u26A1 for Quick wins.
- \u{1F4B0} for Financial savings.
- \u{1F33F} for Carbon savings.
- No flowery words. Direct and impactful.

STRUCTURE:
1. **[THE BIG PROBLEM]**: 1 direct sentence on ${sanitizeInput(highestCategory.toUpperCase())} impact for the ${sanitizeInput(persona)} persona.
2. **[TOP PRIORITY ACTION]**:
   - \u2705 **Recommendation**: 1 bullet point.
   - \u{1F33F} **Impact**: Annual CO\u2082 saving in kg.
   - \u{1F4B0} **Savings**: Annual \u20B9 saving.
3. **[QUICK ZERO-COST WIN]**: 
   - \u26A1 **Tip**: 1 bullet point habit change (e.g. wall socket switches).
4. **[YOUR MONTHLY TARGET]**: 1 line summary of total potential impact.`;
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: sanitizeInput(m.content) }]
  }));
  if (contents.length > 0) {
    const lastIndex = contents.length - 1;
    if (contents[lastIndex].role === "user") {
      contents[lastIndex].parts[0].text = `[USER PROFILE SUMMARY CONTEXT]
${profileSummary}

[USER INQUIRY]
${contents[lastIndex].parts[0].text}`;
    }
  }
  const response = await ai2.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      systemInstruction,
      temperature: 0.7
    }
  });
  return response.text || "I was unable to complete your coaching advice. Let's try focusing on a simple step, like reducing AC duration by 1 hour daily!";
}

// src/utils/validation.ts
var VALID_TRANSPORT = ["bike", "bus", "metro", "car"];
var VALID_FOOD_HABITS = ["vegetarian", "mixed", "non-vegetarian"];
var VALID_SHOPPING_FREQUENCY = ["rarely", "medium", "high"];
var isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
function isValidCarbonAuditInput(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  const candidate = data;
  return typeof candidate.transport === "string" && VALID_TRANSPORT.includes(
    candidate.transport
  ) && isFiniteNumber(candidate.commute_distance) && isFiniteNumber(candidate.electricity_bill) && isFiniteNumber(candidate.ac_usage) && typeof candidate.food_habits === "string" && VALID_FOOD_HABITS.includes(
    candidate.food_habits
  ) && typeof candidate.shopping_frequency === "string" && VALID_SHOPPING_FREQUENCY.includes(
    candidate.shopping_frequency
  ) && isFiniteNumber(candidate.flights_per_year);
}
function isValidCommittedIds(data) {
  return Array.isArray(data) && data.every((item) => typeof item === "string");
}
function isValidCompletedDays(data) {
  return Array.isArray(data) && data.every(isFiniteNumber);
}
function isValidCarbonProfile(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  const candidate = data;
  const breakdown = candidate.breakdown;
  const breakdownPercentages = candidate.breakdownPercentages;
  return isFiniteNumber(candidate.carbonScore) && isFiniteNumber(candidate.annualEmissions) && !!breakdown && isFiniteNumber(breakdown.transport) && isFiniteNumber(breakdown.energy) && isFiniteNumber(breakdown.food) && isFiniteNumber(breakdown.shopping) && isFiniteNumber(breakdown.flights) && !!breakdownPercentages && isFiniteNumber(breakdownPercentages.transport) && isFiniteNumber(breakdownPercentages.energy) && isFiniteNumber(breakdownPercentages.food) && isFiniteNumber(breakdownPercentages.shopping) && isFiniteNumber(breakdownPercentages.flights);
}
function isValidChatMessages(data) {
  return Array.isArray(data) && data.every(
    (item) => !!item && typeof item === "object" && !Array.isArray(item) && typeof item.role === "string" && typeof item.content === "string"
  );
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(
  (0, import_helmet.default)({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"]
      }
    }
  })
);
app.use(import_express.default.json({ limit: "1mb" }));
var apiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (apiKey) {
  ai = new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
var apiLimiter = (0, import_express_rate_limit.rateLimit)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  limit: 20,
  // Limit each IP to 20 requests per window
  standardHeaders: "draft-8",
  // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});
function sanitizeInput2(text) {
  if (text == null) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
app.post("/api/coach", apiLimiter, async (req, res) => {
  try {
    const {
      auditInput,
      profile,
      actions,
      messages,
      committedIds = [],
      completedDays = [1],
      persona = "custom"
    } = req.body;
    if (!isValidCarbonProfile(profile) || !Array.isArray(actions) || !isValidChatMessages(messages)) {
      return res.status(400).json({
        error: "Missing or invalid required profile context or messages"
      });
    }
    if (auditInput && !isValidCarbonAuditInput(auditInput)) {
      return res.status(400).json({ error: "Invalid audit input structure" });
    }
    if (!isValidCommittedIds(committedIds) || !isValidCompletedDays(completedDays)) {
      return res.status(400).json({ error: "Invalid array inputs provided" });
    }
    if (!process.env.GEMINI_API_KEY || !ai) {
      const highestRec = actions[0];
      const rsSaved = highestRec ? getFinancialSavings(highestRec.category, highestRec.customSavingKg) : 1800;
      const safeScore = sanitizeInput2(profile.carbonScore);
      const safeEmissions = sanitizeInput2(profile.annualEmissions);
      const safeTitle = sanitizeInput2(highestRec?.title || "Reduce AC usage");
      const safeSavingKg = sanitizeInput2(highestRec?.customSavingKg || 120);
      return res.status(200).json({
        reply: "Namaste! I am CarbonCoach AI, your personalized advisor. I see that your GEMINI_API_KEY is not configured yet in the Settings panel. Once configured, I will give you full AI insights!\n\nBased on your Carbon Score of " + safeScore + "/100 and annual emissions of " + safeEmissions + ' Tons CO\u2082, your highest ranked recommendation is: "' + safeTitle + '" which saves ' + safeSavingKg + "kg CO\u2082 and \u20B9" + rsSaved + "/year. Try toggling this in the Impact Simulator!"
      });
    }
    const reply = await generateCoachingResponse({
      ai,
      profile,
      actions,
      messages,
      committedIds,
      completedDays,
      persona
    });
    return res.json({ reply });
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({
      error: "Fail-safe: Critical error handling AI reply.",
      details: "An internal error occurred"
    });
  }
});
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = import_path.default.join(distPath, "index.html");
      res.sendFile(indexPath);
    });
    console.log("Production static server served from:", distPath);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `CarbonCoach AI server actively listenting on http://localhost:${PORT}`
    );
  });
}
if (process.env.NODE_ENV !== "test") {
  configureServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
