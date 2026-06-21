import { describe, expect, it } from "vitest";
import { GLOBAL_BENCHMARKS, MAX_CHART_TONS } from "../constants/benchmarks";

describe("Benchmarks data constants", () => {
  it("has the correct constant values matching clinical and environmental goals", () => {
    expect(GLOBAL_BENCHMARKS.PARIS_ACCORD.value).toBe(2.0);
    expect(GLOBAL_BENCHMARKS.INDIA_AVG.value).toBe(1.9);
    expect(GLOBAL_BENCHMARKS.GLOBAL_AVG.value).toBe(4.7);
    expect(GLOBAL_BENCHMARKS.USA_AVG.value).toBe(14.5);
    expect(MAX_CHART_TONS).toBe(14.5);
  });

  it("contains valid labels and descriptions for all keys", () => {
    Object.values(GLOBAL_BENCHMARKS).forEach((benchmark) => {
      expect(typeof benchmark.label).toBe("string");
      expect(benchmark.label.length).toBeGreaterThan(0);
      expect(typeof benchmark.desc).toBe("string");
      expect(benchmark.desc.length).toBeGreaterThan(0);
    });
  });
});
