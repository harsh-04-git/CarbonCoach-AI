# 🌱 CarbonCoach AI

CarbonCoach AI is a personalized carbon footprint awareness platform designed to help users **understand, track, and reduce** their environmental impact through practical actions and AI-powered guidance, localized for the Indian context.

Unlike traditional carbon calculators that stop at displaying emission numbers, CarbonCoach AI translates carbon data into actionable recommendations, impact simulations, habit challenges, and personalized coaching that fit realistic Indian lifestyles.

---

# 🎯 Challenge Alignment

**PromptWars Challenge 3: Carbon Footprint Awareness Platform**

Goal:

Help individuals:

* Understand their carbon footprint
* Track their environmental impact
* Reduce emissions through practical actions
* Receive personalized insights based on lifestyle choices

CarbonCoach AI directly addresses all four objectives through a guided decision-making workflow.

---

# 👤 Chosen Vertical & Personas

## Primary Vertical: Student Commuter

### Characteristics

* Travels using bike, local bus, Metro/BRTS, or shared transport
* Budget-conscious
* Environmental awareness in growth phase
* Wants practical and affordable sustainability guidance

### Goals

* Understand environmental impact
* Build sustainable habits
* Reduce footprint through zero-cost adjustments

---

## Secondary Vertical: Working Professional

### Characteristics

* Urban daily commute
* High electricity consumption (frequent residential AC usage)
* Regular online shopping & food delivery (Swiggy/Zomato)
* Limited time for sustainability research

### Goals

* Reduce carbon footprint efficiently
* Save on electricity and delivery expenses
* Receive personalized recommendations for Indian households

---

## Tertiary Vertical: Family Household

### Characteristics

* Shared appliance usage (Multiple fans/TVs)
* Multi-generational household
* Grocery and waste optimization potential
* Higher baseline electricity consumption

### Goals

* Optimize shared utility expenses (₹)
* Reduce household food waste
* Implement bulk-buy sustainability habits

---

# 🧠 Approach & Logic

CarbonCoach AI is built around a structured decision-engine rather than a generic chatbot.

The application combines:

1. Deterministic carbon calculations
2. Personalized user profiling
3. Recommendation ranking logic
4. Interactive impact simulations
5. AI-powered coaching (localized with Indian examples)

The platform prioritizes recommendations using:

Annual Carbon Savings × Ease Score

This ensures users receive realistic, high-impact actions instead of generic westernized sustainability advice.

---

# 📂 Repository Structure

```txt
carboncoach-ai/
├── src/
│   ├── components/       # UI Views (Audit, Profile, Simulator, Coach)
│   ├── data/             # Research indices and persona presets
│   ├── types/            # TypeScript Interface definitions
│   ├── utils/            # Calculation logic and Ranking engine
│   └── tests/            # Logic and Recommendation validation
├── server.ts             # Express Proxy for Gemini API
├── firestore.rules       # Security rules for data persistence
└── metadata.json         # Project capabilities & permissions
```

---

# 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    User([User]) --> OS[Onboarding & Persona Selection (Understand)]
    OS --> CA[Carbon Audit Input (Track)]
    CA --> CP[Carbon Profile Calculation (Understand & Track)]
    
    subgraph Decision_Engine [Decision Engine & Impact Logic]
        CP --> DE[Recommendation Ranking (Personalize & Reduce)]
        DE --> IS[Impact Simulator (Understand & Reduce)]
    end
    
    IS --> WC[Weekly Habit Challenge (Reduce)]
    WC --> AC[AI Carbon Coach - Personalised Insights (Personalize & Reduce)]
    AC --> User
```

---

# ⚙️ How The Solution Works

---

## Step 1: Carbon Audit

Users answer questions related to:

* Transportation (km/week)
* Energy consumption (₹/month, lifestyle choices)
* Food habits (local diet vs imports)
* Shopping/Delivery behavior
* Travel behavior

---

## Step 2: Carbon Profile

The platform calculates:

* Estimated annual emissions
* Carbon score
* Category breakdown
* Relative impact explanation layer

Users immediately understand where their footprint originates and why they hold their current score.

---

## Step 3: Prioritized Actions

The Decision Engine identifies:

* Highest-carbon-reducing actions
* Essential financial savings (₹/year estimated)
* Practical lifestyle improvements (e.g., ceiling fans vs AC)

Each recommendation includes carbon and financial saving benefits.

---

## Step 4: Impact Simulator

Users can test lifestyle changes before committing to them.

Examples:

* Household AC optimization & ceiling fan usage
* Public transit (Metro/BRTS) usage
* Reducing delivery packaging

The projected footprint updates instantly with financial savings projections.

---

## Step 5: Weekly Challenge

CarbonCoach AI generates a structured 7-day improvement plan to help users build sustainable habits gradually within the Indian lifestyle context.

---

## Step 6: AI Carbon Coach

Gemini-powered coaching provides:

* Personalized insights (analysis of highest emission category)
* Practical "Quick Win" action items
* Context-aware recommendations (mentioning local infrastructure)
* Economic benefit analysis (₹ savings)

The coach uses the user's audit profile, simulator results, and challenge progress to generate relevant responses.

---

# 📊 Ground Truth Calculations

All calculations utilize transparent coefficients declared in the ground truth layer:
- **Daily Commute Mode**: Car (0.22kg CO₂/km), Bus (0.06kg CO₂/km), Metro (0.05kg CO₂/km), Bike (0kg/km) (converted from standard factors).
- **Home Energy Utility**: Electricity average (₹12.0/kWh, 0.82kg/kWh), Air Conditioning (1.2kg/hour of compressor runtime in hot seasons).
- **Global Climate Target**: Compares footprints to the Paris Agreement's sustainable goal of under **2.0 Tons CO₂** annually.
- **Trees Offsetting Equality**: Translated using standard biological indices where **1 Ton of CO₂ saved = ~40 mature trees offset** over their annual lifespan.

---

# 🔒 Security

* API keys protected through backend proxy endpoints
* Input validation on user-facing forms
* Structured request handling
* No sensitive user information permanently stored

---

# ⚡ Efficiency

* Client-side calculations
* LocalStorage persistence
* Minimal API requests
* Lightweight architecture

---

# ♿ Accessibility

* Semantic HTML
* Keyboard-friendly navigation
* ARIA labels
* High-contrast UI
* Mobile-first responsive design

---

# 🧪 Testing

The application includes validation coverage for:

* Carbon calculation logic
* Recommendation ranking engine
* Impact simulation calculations

---

# 📝 Assumptions

The following assumptions were made during development:

1. Users provide reasonably accurate lifestyle information.
2. Emission factors represent general estimates and are intended for awareness purposes.
3. Recommendations prioritize practicality, financial benefit (₹), and behavioral change over scientific precision.
4. Carbon calculations are used for educational guidance rather than official environmental reporting.
5. Internet access is available for AI coaching functionality.

---

# 🚀 Tech Stack

* React
* TypeScript
* Vite
* Gemini API (Server-side)
* Express
* Tailwind CSS

---

# 🚀 1-Click Hosting (Vercel)

CarbonCoach AI is configured for seamless deployment on Vercel:

1. **Push** this repository to GitHub/GitLab.
2. **Import** the project into Vercel.
3. **Configure Environment Variables**:
   - `GEMINI_API_KEY`: Get this from Google AI Studio.
4. **Deploy**: Vercel will automatically detect the settings from `vercel.json` and build the full-stack application.

---

# 📦 Repository Compliance

* Public GitHub Repository
* Single Branch Structure
* Repository Size Below 10 MB
* Complete Source Code Included
* README Includes Vertical, Logic, Workflow, and Assumptions

Built for PromptWars Virtual 2026.
