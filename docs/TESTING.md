# CarbonCoach AI — Test Infrastructure Specification

The platform utilizes **Vitest** for unit and integration testing. The test suite is structured to isolate calculations, data validators, formatters, state logic, and integration flows.

---

## 1. Test Architecture

Our tests are organized inside `src/tests/` to align with the core modules:

```
src/tests/
 ├─ calculator.test.ts        # Carbon calculation determinism & edge cases
 ├─ decisionEngine.test.ts    # Prioritization scoring, ranking, & filter guards
 ├─ validation.test.ts        # Data validators, bounds checks, & fallback guards
 ├─ financialSavings.test.ts  # Multipliers for Rupee (₹) conversions
 ├─ formatters.test.ts        # UI score colors, rating bounds, & icons
 ├─ benchmarks.test.ts        # Paris Accord, India, Global, & US benchmarks
 ├─ appState.test.ts          # Page navigation messages and states
 ├─ storage.test.ts           # Verification of storage keys constants
 ├─ personas.test.ts          # Checks for Student, Professional, & Family defaults
 ├─ integration.test.ts       # Validates end-to-end audit -> profiling flow
 ├─ engine.test.ts            # Detailed action filtering bounds
 ├─ simulator.test.tsx        # React tests for toggle simulator calculations
 ├─ App.test.tsx              # Error boundary and fallback renders
 └─ setup.ts                  # Test configuration and vitest setup
```

---

## 2. Key Testing Areas

### Carbon Math Determinism
* Validates that standard inputs yield precise metric tons of carbon annually.
* Tests boundary cases such as extremely high commute values, zero values, and empty structures to ensure calculation safety.

### Decision Engine Filters
* Asserts that recommendations are sorted in descending order of priority scores.
* Verifies that actions like AC tuning are hidden if the user's audit indicates zero AC usage.
* Confirms that meat-swapping actions do not suggest animal carbon savings to vegetarian profiles.

### Hydration & LocalStorage Safety
* Tests fallback behaviors when corrupted or incomplete JSON objects are loaded from browser local storage.
* Validates that page state changes are written back to storage key values correctly.
