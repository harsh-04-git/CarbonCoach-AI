import { describe, expect, it } from "vitest";
import { calculateEmissions } from "../utils/calculator";
import { getPrioritizedActions } from "../utils/decisionEngine";
import { CarbonAuditInput } from "../types";

describe("Integration Workflow Pipeline", () => {
  it("processes lifestyle inputs through calculator and decision ranking engines successfully", () => {
    const userInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 120,
      electricity_bill: 150,
      ac_usage: 6,
      food_habits: "non-vegetarian",
      shopping_frequency: "high",
      flights_per_year: 3,
    };

    // 1. Calculate profile emissions and check scores
    const profile = calculateEmissions(userInput);
    expect(profile.carbonScore).toBeGreaterThanOrEqual(10);
    expect(profile.carbonScore).toBeLessThanOrEqual(99);
    expect(profile.annualEmissions).toBeGreaterThan(0);

    // 2. Recommend optimal actions based on profile
    const actions = getPrioritizedActions(userInput);
    expect(actions.length).toBeGreaterThan(0);

    // Assert descending sorting order of recommended actions
    for (let i = 0; i < actions.length - 1; i++) {
      expect(actions[i].priorityScore).toBeGreaterThanOrEqual(actions[i + 1].priorityScore);
    }

    // Assert that every action has positive relevance/saving value after filtering
    actions.forEach((action) => {
      expect(action.customSavingKg).toBeGreaterThan(0);
      expect(action.priorityScore).toBeGreaterThan(0);
    });
  });
});
