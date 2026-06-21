import { GoogleGenAI } from "@google/genai";
import { CarbonProfile, ChatMessage, RankedAction } from "../types/index.js";
import { getFinancialSavings } from "../utils/financialSavings.js";

function sanitizeInput(
  text: string | number | boolean | null | undefined
): string {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Constructs the contextual prompt and calls the Gemini AI Model to retrieve coaching insights.
 *
 * @param params - The input parameters containing the Google GenAI instance and application context.
 * @returns The AI coaching response text.
 */
export async function generateCoachingResponse({
  ai,
  profile,
  actions,
  messages,
  committedIds,
  completedDays,
  persona,
}: {
  ai: GoogleGenAI;
  profile: CarbonProfile;
  actions: RankedAction[];
  messages: ChatMessage[];
  committedIds: string[];
  completedDays: number[];
  persona: string;
}): Promise<string> {
  const highestCategory = Object.entries(profile.breakdown || {})
    .filter(([cat]) => cat !== "total")
    .reduce((max, curr) => (curr[1] > max[1] ? curr : max), ["none", 0])[0];

  const challengeStreakCount = completedDays.length;
  const committedActionList =
    committedIds
      .map((id: string) => {
        const action = actions.find((a: RankedAction) => a.id === id);
        return action
          ? `"${sanitizeInput(action.title)}"`
          : sanitizeInput(id);
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
${actions
  .slice(0, 4)
  .map((a: RankedAction, i: number) => {
    const rsSaved = getFinancialSavings(a.category, a.customSavingKg);
    return `  ${i + 1}. [${sanitizeInput(a.id)}] ${sanitizeInput(a.title)} - Saves: ${sanitizeInput(a.customSavingKg)}kg/year CO₂ | Saves ₹${rsSaved}/year (Ease: ${sanitizeInput(a.ease)}/5, Cost: ${sanitizeInput(a.cost)}/3)`;
  })
  .join("\n")}
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
  const contents = messages.map((m: ChatMessage) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: sanitizeInput(m.content) }],
  }));

  // Inject the profile context injection at the last user query to keep it prominent
  if (contents.length > 0) {
    const lastIndex = contents.length - 1;
    if (contents[lastIndex].role === "user") {
      contents[lastIndex].parts[0].text =
        `[USER PROFILE SUMMARY CONTEXT]\n${profileSummary}\n\n[USER INQUIRY]\n${contents[lastIndex].parts[0].text}`;
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

  return (
    response.text ||
    "I was unable to complete your coaching advice. Let's try focusing on a simple step, like reducing AC duration by 1 hour daily!"
  );
}
