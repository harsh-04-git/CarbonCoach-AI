import { describe, expect, it } from "vitest";
import { getFinancialSavings } from "../utils/financialSavings";

describe("Financial savings calculations", () => {
  it("calculates correct savings for energy category", () => {
    expect(getFinancialSavings("energy", 100)).toBe(1500); // 100 * 15
    expect(getFinancialSavings("energy", 0)).toBe(0);
  });

  it("calculates correct savings for transport category", () => {
    expect(getFinancialSavings("transport", 100)).toBe(1000); // 100 * 10
  });

  it("calculates correct savings for food category", () => {
    expect(getFinancialSavings("food", 100)).toBe(800); // 100 * 8
  });

  it("calculates correct savings for shopping category", () => {
    expect(getFinancialSavings("shopping", 100)).toBe(1200); // 100 * 12
  });

  it("calculates correct savings for flights category", () => {
    expect(getFinancialSavings("flights", 100)).toBe(800); // 100 * 8
  });

  it("falls back to standard transport rates for unknown category", () => {
    expect(getFinancialSavings("unknown_category", 100)).toBe(1000); // 100 * 10
  });

  it("returns zero for negative CO2 savings", () => {
    expect(getFinancialSavings("energy", -50)).toBe(0);
  });
});
