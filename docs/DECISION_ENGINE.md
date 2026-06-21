# CarbonCoach AI — Decision Engine Specification

The priority and suitability of carbon-reducing recommendations in CarbonCoach AI is calculated dynamically by the **Decision Engine** (`src/utils/decisionEngine.ts`). This architecture guarantees that users receive recommendations that match their actual lifestyle instead of static checklists.

---

## 1. Recommendation Database & Suitability Filtering

The system maintains a set of core actions in `src/data/research_data.ts`. Before calculating priority, the engine checks user input parameters to **filter out irrelevant actions**:

```typescript
// Example: If a user commuting by car has 0 km commute, remove transit change options.
// Example: If a user is already vegetarian, prioritize food waste actions over switching diets.
```

---

## 2. Priority Scoring Formula

The core scoring algorithm calculates a weighted priority score using dynamic carbon impact potential and ease of lifestyle change:

$$\text{Priority Score} = \left( \frac{\text{Custom Annual Carbon Saving (kg)}}{50} \right) \times \text{Ease Score}$$

Where:
* **Custom Annual Carbon Saving** is calculated dynamically using the user's specific audit parameters (e.g. AC daily usage hours, weekly car kilometers, online shopping frequencies).
* **Ease Score** is a fixed ordinal score (1 to 5) indicating the ease of implementation (1 being very difficult/expensive, 5 being completely free/instant).
* The factor of **50** normalizes carbon weight against the 1–5 ease scale to balance impact with ease.

---

## 3. Explanatory Logic Mapping (Explainability Link)

To maximize Problem Alignment, every action includes a dynamic "Explainability Link" tailored to the user's lifestyle:

* **AC Optimization (`reduce_ac`)**: Triggers an explanation pointing directly to the user's daily AC hours and calculates estimated electrical compressor savings.
* **Public Transit Switch (`public_transit_2x`)**: Dynamically links to the user's vehicle choices, highlighting metro/bus routing to optimize fuel consumption.
* **Dietary Adjustments (`swap_beef`)**: Explains the difference in agricultural carbon output (methane) depending on whether the user has a mixed or vegetarian diet.
* **Package Delivery Consolidation (`combine_delivery`)**: Displays delivery carbon context matching the user's shopping frequency.
