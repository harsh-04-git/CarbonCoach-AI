import { describe, expect, it } from "vitest";
import { calculateEmissions } from "../utils/calculator";
import { researchData } from "../data/research_data";

describe("Persona presets calculations", () => {
  it("calculates exact deterministic values for student_commuter persona", () => {
    const student = researchData.persona_presets.student_commuter;
    const profile = calculateEmissions(student);

    // Assert exact emissions from audit results
    expect(profile.annualEmissions).toBe(3.57);
    expect(profile.carbonScore).toBe(73);
    expect(profile.carbonScore).toBeGreaterThanOrEqual(10);
    expect(profile.carbonScore).toBeLessThanOrEqual(99);
  });

  it("calculates exact deterministic values for working_professional persona", () => {
    const professional = researchData.persona_presets.working_professional;
    const profile = calculateEmissions(professional);

    expect(profile.annualEmissions).toBe(11.45);
    expect(profile.carbonScore).toBe(14);
    expect(profile.carbonScore).toBeGreaterThanOrEqual(10);
    expect(profile.carbonScore).toBeLessThanOrEqual(99);
  });

  it("calculates exact deterministic values for family_household persona", () => {
    const family = researchData.persona_presets.family_household;
    const profile = calculateEmissions(family);

    expect(profile.annualEmissions).toBe(8.58);
    expect(profile.carbonScore).toBe(36);
    expect(profile.carbonScore).toBeGreaterThanOrEqual(10);
    expect(profile.carbonScore).toBeLessThanOrEqual(99);
  });
});
