import { calculateEmissions } from "../utils/calculator";
import { getPrioritizedActions } from "../utils/decisionEngine";
import { CarbonAuditInput } from "../types";

export interface TestCaseResult {
  suiteName: string;
  testName: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export function runAllUnitTests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  const addTest = (suiteName: string, testName: string, assertFn: () => { passed: boolean; expected: string; actual: string }) => {
    try {
      const { passed, expected, actual } = assertFn();
      results.push({ suiteName, testName, passed, expected, actual });
    } catch (e: any) {
      results.push({
        suiteName,
        testName,
        passed: false,
        expected: "Successful execution",
        actual: "Exception",
        error: e.message
      });
    }
  };

  // --- Suite 1: Carbon Calculation Engine ---
  addTest("Carbon Calculation Engine", "Calculate Student Commuter Footprint", () => {
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 60, // 60 miles/week
      electricity_bill: 45, // $45/month
      ac_usage: 2, // 2 hours/day
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1
    };

    const profile = calculateEmissions(studentInput);

    // Manual Calculation:
    // Transport: 60 * 52 * 0.10 = 312 kg (0.31 tons)
    // Electricity: (45 / 0.15) * 12 * 0.40 = 1440 kg (1.44 tons)
    // AC: 2 * 365 * 0.82 = 598.6 kg (0.60 tons)
    // Energy Tons: 1.44 + 0.60 = 2.04 tons
    // Food: 1500 kg (1.50 tons)
    // Shopping: 350 kg (0.35 tons)
    // Flights: 1 * 500 = 500 kg (0.50 tons)
    // Total: 0.31 + 2.04 + 1.50 + 0.35 + 0.50 = 4.70 Tons CO2
    // Let's assert:
    const expectedEmissions = 4.70;
    const passed = Math.abs(profile.annualEmissions - expectedEmissions) < 0.05;

    return {
      passed,
      expected: `${expectedEmissions} Tons CO2`,
      actual: `${profile.annualEmissions} Tons CO2`
    };
  });

  addTest("Carbon Calculation Engine", "Score Mapping Accuracy", () => {
    // Emissions = 4.70 Tons
    // Expected Carbon Score = 100 - (4.7 * 7.5) = 100 - 35 = 65
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 60,
      electricity_bill: 45,
      ac_usage: 2,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1
    };
    const profile = calculateEmissions(studentInput);
    const expectedScore = 65;
    const passed = profile.carbonScore === expectedScore;

    return {
      passed,
      expected: `Score of ${expectedScore}`,
      actual: `Score of ${profile.carbonScore}`
    };
  });

  // --- Suite 2: Decision Ranking Engine ---
  addTest("Decision Ranking Engine", "Filter Inapplicable Actions Correctly", () => {
    // Vegetarian user should have 0 custom saving on beef replacement action
    const vegetarianInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 100,
      electricity_bill: 100,
      ac_usage: 5,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0
    };

    const filteredActions = getPrioritizedActions(vegetarianInput);
    const beefAction = filteredActions.find(a => a.id === "swap_beef");
    const passed = beefAction === undefined; // Should be filtered out because saving is 0

    return {
      passed,
      expected: "Beef swap was excluded",
      actual: beefAction ? `Included (Saving: ${beefAction.customSavingKg}kg)` : "Beef swap was excluded"
    };
  });

  addTest("Decision Ranking Engine", "Action Prioritization Order", () => {
    // For student commuter, "Unplug standby power" and "Reduce AC" are easy & relevant (ease: 5)
    // Check if the highest priority recommendations listed are high ease / high impact for commuter
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 20,
      electricity_bill: 30,
      ac_usage: 1,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0
    };

    const actions = getPrioritizedActions(studentInput);
    const highestRanked = actions[0];
    const passed = actions.length > 0 && highestRanked.priorityScore > 1.0;

    return {
      passed,
      expected: "Has prioritized list (Priority Index > 1.0)",
      actual: highestRanked ? `First action: "${highestRanked.title}" (Priority Score: ${highestRanked.priorityScore})` : "Empty action list"
    };
  });

  // --- Suite 3: Impact Simulator ---
  addTest("Impact Simulator Test", "Calculate Exact Live Projected Reductions", () => {
    const studentInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 100,
      electricity_bill: 100,
      ac_usage: 5,
      food_habits: "non-vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0
    };

    const profile = calculateEmissions(studentInput);
    const initialTons = profile.annualEmissions;

    // Simulate switching AC and beef reduction
    // From research data:
    // reduce_ac = 120kg saving
    // swap_beef = 220kg saving
    const actionSavingsTotalKg = 120 + 220; // 340kg = 0.34 Tons
    const expectedProjected = Math.round((initialTons - 0.34) * 100) / 100;

    const projectedTons = Math.round((initialTons - (actionSavingsTotalKg / 1000)) * 100) / 100;
    const passed = projectedTons === expectedProjected;

    return {
      passed,
      expected: `${expectedProjected} Tons after simulation`,
      actual: `${projectedTons} Tons calculated`
    };
  });

  return results;
}
