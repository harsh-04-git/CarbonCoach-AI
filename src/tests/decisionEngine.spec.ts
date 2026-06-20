import { describe, it, expect } from 'vitest';
import { getPrioritizedActions } from "../utils/decisionEngine";
import { AuditData } from "../types";

describe('Decision Ranking Engine', () => {
  it('Filter Inapplicable Actions Correctly', () => {
    // Vegetarian user should have 0 custom saving on beef replacement action
    const vegetarianInput: AuditData = {
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
    expect(beefAction).toBeUndefined(); // Should be filtered out because saving is 0
  });

  it('Action Prioritization Order', () => {
    // For student commuter, "Unplug standby power" and "Reduce AC" are easy & relevant (ease: 5)
    // Check if the highest priority recommendations listed are high ease / high impact for commuter
    const studentInput: AuditData = {
      transport: "bus",
      commute_distance: 20,
      electricity_bill: 30,
      ac_usage: 1,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0
    };

    const actions = getPrioritizedActions(studentInput);
    expect(actions.length).toBeGreaterThan(0);
    const highestRanked = actions[0];
    expect(highestRanked.priorityScore).toBeGreaterThan(1.0);
  });

  it('Handle Zero/Negative Inputs Correctly', () => {
    // Edge case: User inputs 0 or negative values for usage
    // Expected: Actions related to these usages should yield 0 savings and be filtered out.
    const zeroInput: AuditData = {
      transport: "car",
      commute_distance: -5, // Negative commute distance
      electricity_bill: 0,  // Zero electricity bill
      ac_usage: -2,         // Negative AC usage
      food_habits: "vegetarian",
      shopping_frequency: "rarely", // This evaluates to customSavingKg = 0 for combine_delivery
      flights_per_year: 0
    };

    const actions = getPrioritizedActions(zeroInput);
    // reduce_ac, line_dry, public_transit_2x, combine_delivery should all be excluded or 0.
    const reduceAcAction = actions.find(a => a.id === "reduce_ac");
    const lineDryAction = actions.find(a => a.id === "line_dry");
    const publicTransitAction = actions.find(a => a.id === "public_transit_2x");
    const combineDeliveryAction = actions.find(a => a.id === "combine_delivery");

    expect(reduceAcAction).toBeUndefined();
    expect(lineDryAction).toBeUndefined();
    expect(publicTransitAction).toBeUndefined();
    expect(combineDeliveryAction).toBeUndefined();
  });

  it('Handle Maximum/High Usage Inputs Correctly', () => {
    // Edge case: User inputs exceptionally high usage
    // Expected: Actions should recommend the full default potential savings (no partial scaling)
    const highUsageInput: AuditData = {
      transport: "car",
      commute_distance: 200, // Very high commute > 40
      electricity_bill: 200, // Very high electricity > 40
      ac_usage: 12,          // Very high AC usage > 4
      food_habits: "non-vegetarian", // Should give full swap_beef
      shopping_frequency: "high", // Should give full combine_delivery
      flights_per_year: 10
    };

    const actions = getPrioritizedActions(highUsageInput);

    // Test a few specific actions to ensure they maintain their full `annual_saving_kg`
    // and aren't incorrectly scaled or skipped.
    const reduceAcAction = actions.find(a => a.id === "reduce_ac");
    const publicTransitAction = actions.find(a => a.id === "public_transit_2x");

    // In research data, annual_saving_kg is: reduce_ac=120, public_transit_2x=180
    // If usage is >= threshold (e.g. ac_usage >= 4), they get full annual_saving_kg
    expect(reduceAcAction?.customSavingKg).toBe(120);
    expect(publicTransitAction?.customSavingKg).toBe(180);
  });
});
