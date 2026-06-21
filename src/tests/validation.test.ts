import { describe, expect, it } from "vitest";
import {
  isValidCarbonAuditInput,
  isValidCarbonProfile,
  isValidChatMessages,
  isValidCommittedIds,
  isValidCompletedDays,
} from "../utils/validation";
import { calculateEmissions } from "../utils/calculator";
import { CarbonAuditInput } from "../types";

describe("Validation logic", () => {
  it("accepts valid carbon inputs, profiles, and stored arrays", () => {
    const input: CarbonAuditInput = {
      transport: "metro",
      commute_distance: 18,
      electricity_bill: 50,
      ac_usage: 1,
      food_habits: "mixed",
      shopping_frequency: "rarely",
      flights_per_year: 2,
    };
    const profile = calculateEmissions(input);

    expect(isValidCarbonAuditInput(input)).toBe(true);
    expect(isValidCarbonProfile(profile)).toBe(true);
    expect(isValidCommittedIds(["reduce_ac", "swap_beef"])).toBe(true);
    expect(isValidCompletedDays([1, 3, 7])).toBe(true);
    expect(
      isValidChatMessages([
        { role: "user", content: "What should I change first?" },
        { role: "assistant", content: "Start with transport." },
      ])
    ).toBe(true);
  });

  it("rejects malformed values instead of coercing them", () => {
    expect(
      isValidCarbonAuditInput({
        transport: "train",
        commute_distance: "12",
        electricity_bill: 50,
        ac_usage: 1,
        food_habits: "mixed",
        shopping_frequency: "rarely",
        flights_per_year: 2,
      })
    ).toBe(false);
    expect(
      isValidCarbonProfile({
        carbonScore: 72,
        annualEmissions: 4.2,
        breakdown: {
          transport: 1,
          energy: 1,
          food: 1,
          shopping: 1,
          flights: "oops",
        },
        breakdownPercentages: {
          transport: 20,
          energy: 20,
          food: 20,
          shopping: 20,
          flights: 20,
        },
      })
    ).toBe(false);
    expect(isValidCommittedIds(["ok", 2])).toBe(false);
    expect(isValidCompletedDays([1, Number.NaN])).toBe(false);
    expect(isValidChatMessages([{ role: "user", content: 1 }])).toBe(false);
  });

  it("handles empty arrays, null values, and Infinity values correctly", () => {
    expect(isValidChatMessages([])).toBe(true);
    expect(isValidChatMessages(null)).toBe(false);
    expect(isValidCommittedIds([])).toBe(true);
    expect(isValidCompletedDays([])).toBe(true);
    expect(
      isValidCarbonAuditInput({
        transport: "car",
        commute_distance: Number.POSITIVE_INFINITY,
        electricity_bill: 100,
        ac_usage: 2,
        food_habits: "mixed",
        shopping_frequency: "medium",
        flights_per_year: 0,
      })
    ).toBe(false);
  });
});
