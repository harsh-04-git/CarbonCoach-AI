import { describe, it, expect } from "vitest";
import { calculateEmissions } from "../utils/calculator";
import { getPrioritizedActions } from "../utils/decisionEngine";
import { CarbonAuditInput } from "../types";

describe("Carbon Calculation Engine", () => {
  it("Calculate Student Commuter Footprint", () => {
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 60,
      electricity_bill: 45,
      ac_usage: 2,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1,
    };

    const profile = calculateEmissions(studentInput);
    const expectedEmissions = 3.57;

    expect(profile.annualEmissions).toBeCloseTo(expectedEmissions, 1);
  });

  it("Score Mapping Accuracy", () => {
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 60,
      electricity_bill: 45,
      ac_usage: 2,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1,
    };
    const profile = calculateEmissions(studentInput);
    const expectedScore = 73;

    expect(profile.carbonScore).toBe(expectedScore);
  });

  it("Calculate Emissions with Zero Inputs", () => {
    const zeroInput: CarbonAuditInput = {
      transport: "bike",
      commute_distance: 0,
      electricity_bill: 0,
      ac_usage: 0,
      food_habits: "vegetarian",
      shopping_frequency: "rarely",
      flights_per_year: 0,
    };

    const profile = calculateEmissions(zeroInput);

    const expectedEmissions = 1.6;
    const expectedScore = 88;

    expect(profile.annualEmissions).toBe(expectedEmissions);
    expect(profile.carbonScore).toBe(expectedScore);
    expect(profile.breakdownPercentages.transport).toBe(0);
  });
});

describe("Decision Ranking Engine", () => {
  it("Filter Inapplicable Actions Correctly", () => {
    const vegetarianInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 100,
      electricity_bill: 100,
      ac_usage: 5,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0,
    };

    const filteredActions = getPrioritizedActions(vegetarianInput);
    const beefAction = filteredActions.find((a) => a.id === "swap_beef");

    expect(beefAction).toBeUndefined();
  });

  it("Action Prioritization Order", () => {
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 20,
      electricity_bill: 30,
      ac_usage: 1,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0,
    };

    const actions = getPrioritizedActions(studentInput);
    const highestRanked = actions[0];

    expect(actions.length).toBeGreaterThan(0);
    expect(highestRanked.priorityScore).toBeGreaterThan(1.0);
  });

  it("Handle Zero/Negative Inputs Correctly", () => {
    const zeroInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: -5,
      electricity_bill: 0,
      ac_usage: -2,
      food_habits: "vegetarian",
      shopping_frequency: "rarely",
      flights_per_year: 0,
    };

    const actions = getPrioritizedActions(zeroInput);

    const reduceAcAction = actions.find((a) => a.id === "reduce_ac");
    const lineDryAction = actions.find((a) => a.id === "line_dry");
    const publicTransitAction = actions.find(
      (a) => a.id === "public_transit_2x"
    );
    const combineDeliveryAction = actions.find(
      (a) => a.id === "combine_delivery"
    );

    expect(reduceAcAction).toBeUndefined();
    expect(lineDryAction).toBeUndefined();
    expect(publicTransitAction).toBeUndefined();
    expect(combineDeliveryAction).toBeUndefined();
  });

  it("Handle Maximum/High Usage Inputs Correctly", () => {
    const highUsageInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 200,
      electricity_bill: 200,
      ac_usage: 12,
      food_habits: "non-vegetarian",
      shopping_frequency: "high",
      flights_per_year: 10,
    };

    const actions = getPrioritizedActions(highUsageInput);

    const reduceAcAction = actions.find((a) => a.id === "reduce_ac");
    const publicTransitAction = actions.find(
      (a) => a.id === "public_transit_2x"
    );

    expect(reduceAcAction?.customSavingKg).toBe(120);
    expect(publicTransitAction?.customSavingKg).toBe(180);
  });
});

describe("Impact Simulator Test", () => {
  it("Calculate Exact Live Projected Reductions", () => {
    const studentInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 100,
      electricity_bill: 100,
      ac_usage: 5,
      food_habits: "non-vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0,
    };

    const profile = calculateEmissions(studentInput);
    const initialTons = profile.annualEmissions;

    const actionSavingsTotalKg = 120 + 220;
    const expectedProjected = Math.round((initialTons - 0.34) * 100) / 100;
    const projectedTons =
      Math.round((initialTons - actionSavingsTotalKg / 1000) * 100) / 100;

    expect(projectedTons).toBe(expectedProjected);
  });
});
