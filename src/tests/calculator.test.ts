import { describe, expect, it } from "vitest";
import { calculateEmissions } from "../utils/calculator";
import { CarbonAuditInput } from "../types";

describe("Carbon calculations", () => {
  it("returns the expected footprint and score for the student persona", () => {
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

    expect(profile.annualEmissions).toBe(3.57);
    expect(profile.carbonScore).toBe(73);
    expect(profile.breakdown).toEqual({
      transport: 0.31,
      energy: 0.91,
      food: 1.5,
      shopping: 0.35,
      flights: 0.5,
    });
  });

  it("keeps deterministic defaults for a zero-usage input", () => {
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

    expect(profile.annualEmissions).toBe(1.6);
    expect(profile.carbonScore).toBe(88);
    expect(profile.breakdownPercentages).toEqual({
      transport: 0,
      energy: 0,
      food: 94,
      shopping: 6,
      flights: 0,
    });
  });

  it("clamps score to 10 for extreme high-usage inputs", () => {
    const extremeInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 1000,
      electricity_bill: 1000,
      ac_usage: 24,
      food_habits: "non-vegetarian",
      shopping_frequency: "high",
      flights_per_year: 50,
    };
    const profile = calculateEmissions(extremeInput);
    expect(profile.carbonScore).toBe(10);
  });

  it("calculates correct emissions for a heavy car commuter", () => {
    const commuterInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 200,
      electricity_bill: 0,
      ac_usage: 0,
      food_habits: "vegetarian",
      shopping_frequency: "rarely",
      flights_per_year: 0,
    };
    const profile = calculateEmissions(commuterInput);
    // 200 * 52 * 0.35 = 3640 kg = 3.64 tons
    expect(profile.breakdown.transport).toBe(3.64);
  });
});
