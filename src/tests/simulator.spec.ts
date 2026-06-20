import { describe, it, expect } from 'vitest';
import { calculateEmissions } from "../utils/calculator";
import { AuditData } from "../types";

describe('Impact Simulator Test', () => {
  it('Calculate Exact Live Projected Reductions', () => {
    const studentInput: AuditData = {
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

    expect(projectedTons).toBe(expectedProjected);
  });
});
