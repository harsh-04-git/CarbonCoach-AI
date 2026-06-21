import { describe, expect, it } from "vitest";
import { getSubHeaderMessage } from "../constants/appState";

describe("AppState constants and messages", () => {
  it("returns correct subheader messages for valid application states", () => {
    expect(getSubHeaderMessage(2)).toBe("State 2: Carbon Profile Benchmark");
    expect(getSubHeaderMessage(3)).toBe("State 3: Decision Engine Optimal Recommendations");
    expect(getSubHeaderMessage(4)).toBe("State 4: Live Interactive Impact Simulator");
    expect(getSubHeaderMessage(5)).toBe("State 5: 7-Day Habit Formation Challenges");
    expect(getSubHeaderMessage(6)).toBe("AI personal Carbon reduction Coach");
  });

  it("returns empty string for default onboarding / select persona states", () => {
    expect(getSubHeaderMessage(0)).toBe("");
    expect(getSubHeaderMessage(1)).toBe("");
    expect(getSubHeaderMessage(-1)).toBe("");
    expect(getSubHeaderMessage(7)).toBe("");
  });
});
