import { describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../constants/storage";

describe("Storage keys constant mapping", () => {
  it("defines all expected storage keys for application hydration", () => {
    expect(STORAGE_KEYS.AUDIT_INPUT).toBe("carboncoach_audit_input");
    expect(STORAGE_KEYS.COMMITTED_IDS).toBe("carboncoach_committed_ids");
    expect(STORAGE_KEYS.PERSONA).toBe("carboncoach_persona");
    expect(STORAGE_KEYS.ACTIVE_STATE).toBe("carboncoach_active_state");
    expect(STORAGE_KEYS.WEEKLY_COMPLETED_DAYS).toBe("carboncoach_weekly_completed_days");
    expect(STORAGE_KEYS.LEGACY_ACTIVE_STATE).toBe("activeState");
  });
});
