import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getFinancialSavings } from "./src/utils/financialSavings";
import { generateCoachingResponse } from "./src/services/coachService";
import {
  isValidCarbonAuditInput,
  isValidCarbonProfile,
  isValidChatMessages,
  isValidCommittedIds,
  isValidCompletedDays,
} from "./src/utils/validation";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      },
    },
  })
);

// Limit payload size to reduce accidental or hostile oversized requests.
app.use(express.json({ limit: "1mb" }));

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

// REST route for Carbon Coach AI
app.post("/api/coach", apiLimiter, async (req, res) => {
  try {
    const {
      auditInput,
      profile,
      actions,
      messages,
      committedIds = [],
      completedDays = [1],
      persona = "custom",
    } = req.body;

    if (
      !isValidCarbonProfile(profile) ||
      !Array.isArray(actions) ||
      !isValidChatMessages(messages)
    ) {
      return res.status(400).json({
        error: "Missing or invalid required profile context or messages",
      });
    }

    if (auditInput && !isValidCarbonAuditInput(auditInput)) {
      return res.status(400).json({ error: "Invalid audit input structure" });
    }

    if (
      !isValidCommittedIds(committedIds) ||
      !isValidCompletedDays(completedDays)
    ) {
      return res.status(400).json({ error: "Invalid array inputs provided" });
    }


    if (!process.env.GEMINI_API_KEY || !ai) {
      const highestRec = actions[0];
      const rsSaved = highestRec
        ? getFinancialSavings(highestRec.category, highestRec.customSavingKg)
        : 1800;
      const safeScore = sanitizeInput(profile.carbonScore);
      const safeEmissions = sanitizeInput(profile.annualEmissions);
      const safeTitle = sanitizeInput(highestRec?.title || "Reduce AC usage");
      const safeSavingKg = sanitizeInput(highestRec?.customSavingKg || 120);
      return res.status(200).json({
        reply:
          "Namaste! I am CarbonCoach AI, your personalized advisor. I see that your GEMINI_API_KEY is not configured yet in the Settings panel. Once configured, I will give you full AI insights!\n\nBased on your Carbon Score of " +
          safeScore +
          "/100 and annual emissions of " +
          safeEmissions +
          ' Tons CO₂, your highest ranked recommendation is: "' +
          safeTitle +
          '" which saves ' +
          safeSavingKg +
          "kg CO₂ and ₹" +
          rsSaved +
          "/year. Try toggling this in the Impact Simulator!",
      });
    }

    const reply = await generateCoachingResponse({
      ai,
      profile,
      actions,
      messages,
      committedIds,
      completedDays,
      persona,
    });
    return res.json({ reply });
  } catch (error: unknown) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({
      error: "Fail-safe: Critical error handling AI reply.",
      details: "An internal error occurred",
    });
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
    console.log(
      `CarbonCoach AI server actively listenting on http://localhost:${PORT}`
    );
  });
}

// Ensure the server configures itself
if (process.env.NODE_ENV !== "test") {
  configureServer();
}

// Export for Vercel
export default app;
