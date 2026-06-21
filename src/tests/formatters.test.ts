import { describe, expect, it } from "vitest";
import {
  getScoreColor,
  getScoreRating,
  getCategoryIcon,
  getCategoryColor,
  getCostLabel,
  getCategoryDrivers,
} from "../utils/ui/formatters";
import { Zap, Leaf, ShoppingCart, Plane, Car } from "lucide-react";
import { CarbonProfile } from "../types";

describe("UI Formatters", () => {
  describe("getScoreColor", () => {
    it("returns correct color classes based on score thresholds", () => {
      expect(getScoreColor(85)).toBe("text-emerald-600 border-emerald-100");
      expect(getScoreColor(80)).toBe("text-emerald-600 border-emerald-100");
      expect(getScoreColor(70)).toBe("text-teal-600 border-teal-100");
      expect(getScoreColor(60)).toBe("text-teal-600 border-teal-100");
      expect(getScoreColor(50)).toBe("text-amber-600 border-amber-100");
      expect(getScoreColor(40)).toBe("text-amber-600 border-amber-100");
      expect(getScoreColor(30)).toBe("text-rose-600 border-rose-100");
    });
  });

  describe("getScoreRating", () => {
    it("returns correct rating and description based on score thresholds", () => {
      expect(getScoreRating(80).label).toBe("Excellent Eco Status");
      expect(getScoreRating(65).label).toBe("Balanced / Moderate");
      expect(getScoreRating(45).label).toBe("Needs Improvement");
      expect(getScoreRating(20).label).toBe("High Impact Footprint");
    });
  });

  describe("getCategoryIcon", () => {
    it("returns correct lucide icon component", () => {
      expect(getCategoryIcon("energy")).toBe(Zap);
      expect(getCategoryIcon("food")).toBe(Leaf);
      expect(getCategoryIcon("shopping")).toBe(ShoppingCart);
      expect(getCategoryIcon("flights")).toBe(Plane);
      expect(getCategoryIcon("transport")).toBe(Car);
      expect(getCategoryIcon("other")).toBe(Car);
    });
  });

  describe("getCategoryColor", () => {
    it("returns correct classes based on category", () => {
      expect(getCategoryColor("energy")).toBe("text-teal-700 bg-teal-50 border-teal-200");
      expect(getCategoryColor("food")).toBe("text-emerald-700 bg-emerald-50 border-emerald-250");
      expect(getCategoryColor("shopping")).toBe("text-purple-700 bg-purple-50 border-purple-200");
      expect(getCategoryColor("flights")).toBe("text-sky-700 bg-sky-50 border-sky-200");
      expect(getCategoryColor("transport")).toBe("text-amber-700 bg-amber-50 border-amber-200");
    });
  });

  describe("getCostLabel", () => {
    it("returns correct Rupee savings label description", () => {
      expect(getCostLabel(1)).toBe("Free / Saves ₹");
      expect(getCostLabel(2)).toBe("Low cost (₹)");
      expect(getCostLabel(3)).toBe("Investment (₹₹)");
      expect(getCostLabel(0)).toBe("Free");
      expect(getCostLabel(4)).toBe("Free");
    });
  });

  describe("getCategoryDrivers", () => {
    it("extracts and names category components correctly", () => {
      const mockProfile: CarbonProfile = {
        carbonScore: 75,
        annualEmissions: 4.5,
        breakdown: {
          transport: 1.2,
          energy: 1.5,
          food: 0.8,
          shopping: 0.4,
          flights: 0.6,
        },
        breakdownPercentages: {
          transport: 27,
          energy: 33,
          food: 18,
          shopping: 9,
          flights: 13,
        },
      };

      const drivers = getCategoryDrivers(mockProfile);
      expect(drivers).toHaveLength(5);
      expect(drivers[0]).toEqual({
        name: "Daily Transport",
        tons: 1.2,
        desc: "commutes via private/public vehicles",
      });
      expect(drivers[1].tons).toBe(1.5);
      expect(drivers[2].tons).toBe(0.8);
      expect(drivers[3].tons).toBe(0.4);
      expect(drivers[4].tons).toBe(0.6);
    });
  });
});
