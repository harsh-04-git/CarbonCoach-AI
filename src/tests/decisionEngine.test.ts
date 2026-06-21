import { describe, expect, it } from "vitest";
import { getPrioritizedActions } from "../utils/decisionEngine";
import { CarbonAuditInput } from "../types";

describe("Recommendation ranking", () => {
  it("orders the strongest actions first for a high-impact user", () => {
    const input: CarbonAuditInput = {
      transport: "car",
      commute_distance: 150,
      electricity_bill: 140,
      ac_usage: 8,
      food_habits: "non-vegetarian",
      shopping_frequency: "high",
      flights_per_year: 4,
    };

    const actions = getPrioritizedActions(input);

    expect(actions.map((action) => action.id).slice(0, 3)).toEqual([
      "public_transit_2x",
      "swap_beef",
      "reduce_ac",
    ]);
    expect(actions[0].priorityScore).toBe(14.4);
    expect(actions[1].customSavingKg).toBe(220);
    expect(actions[2].customSavingKg).toBe(120);
  });

  it("drops irrelevant actions and scales savings for lighter usage", () => {
    const input: CarbonAuditInput = {
      transport: "bike",
      commute_distance: 12,
      electricity_bill: 30,
      ac_usage: 2,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0,
    };

    const actions = getPrioritizedActions(input);
    const ids = actions.map((action) => action.id);

    expect(ids).toContain("reduce_ac");
    expect(ids).toContain("combine_delivery");
    expect(ids).not.toContain("swap_beef");
    expect(ids).not.toContain("public_transit_2x");
    expect(actions.find((action) => action.id === "reduce_ac")?.customSavingKg).toBe(60);
    expect(
      actions.find((action) => action.id === "combine_delivery")?.customSavingKg
    ).toBe(45);
  });

  it("filters out public_transit_2x for bike user with zero commute", () => {
    const input: CarbonAuditInput = {
      transport: "bike",
      commute_distance: 0,
      electricity_bill: 50,
      ac_usage: 1,
      food_habits: "vegetarian",
      shopping_frequency: "rarely",
      flights_per_year: 0,
    };
    const actions = getPrioritizedActions(input);
    const hasTransitAction = actions.some((a) => a.id === "public_transit_2x");
    expect(hasTransitAction).toBe(false);
  });

  it("produces deterministic top 3 actions for family user", () => {
    const familyInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 90,
      electricity_bill: 260,
      ac_usage: 10,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1,
    };
    const actions = getPrioritizedActions(familyInput);
    expect(actions.map((a) => a.id).slice(0, 3)).toEqual([
      "public_transit_2x",
      "reduce_ac",
      "line_dry",
    ]);
  });

  it("produces non-empty action list for all persona presets", () => {
    const studentInput: CarbonAuditInput = {
      transport: "bus",
      commute_distance: 60,
      electricity_bill: 45,
      ac_usage: 2,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1,
    };
    const professionalInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 150,
      electricity_bill: 140,
      ac_usage: 8,
      food_habits: "non-vegetarian",
      shopping_frequency: "high",
      flights_per_year: 4,
    };
    const familyInput: CarbonAuditInput = {
      transport: "car",
      commute_distance: 90,
      electricity_bill: 260,
      ac_usage: 10,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1,
    };

    expect(getPrioritizedActions(studentInput).length).toBeGreaterThan(0);
    expect(getPrioritizedActions(professionalInput).length).toBeGreaterThan(0);
    expect(getPrioritizedActions(familyInput).length).toBeGreaterThan(0);
  });
});
