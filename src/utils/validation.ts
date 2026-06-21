import { CarbonAuditInput, CarbonProfile } from "../types/index.js";

const VALID_TRANSPORT = ["bike", "bus", "metro", "car"] as const;
const VALID_FOOD_HABITS = ["vegetarian", "mixed", "non-vegetarian"] as const;
const VALID_SHOPPING_FREQUENCY = ["rarely", "medium", "high"] as const;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Validates that an unknown value matches the CarbonAuditInput interface.
 * Check includes correct transit type, food habit, and shopping frequency, along with finite numbers.
 *
 * @param data - The unknown data to validate
 * @returns Type guard boolean indicating matches CarbonAuditInput
 */
export function isValidCarbonAuditInput(
  data: unknown
): data is CarbonAuditInput {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate.transport === "string" &&
    VALID_TRANSPORT.includes(
      candidate.transport as (typeof VALID_TRANSPORT)[number]
    ) &&
    isFiniteNumber(candidate.commute_distance) &&
    isFiniteNumber(candidate.electricity_bill) &&
    isFiniteNumber(candidate.ac_usage) &&
    typeof candidate.food_habits === "string" &&
    VALID_FOOD_HABITS.includes(
      candidate.food_habits as (typeof VALID_FOOD_HABITS)[number]
    ) &&
    typeof candidate.shopping_frequency === "string" &&
    VALID_SHOPPING_FREQUENCY.includes(
      candidate.shopping_frequency as (typeof VALID_SHOPPING_FREQUENCY)[number]
    ) &&
    isFiniteNumber(candidate.flights_per_year)
  );
}

/**
 * Validates that an unknown value is a string array, typically representing committed action IDs.
 *
 * @param data - The unknown data to validate
 * @returns Type guard boolean indicating matches string[]
 */
export function isValidCommittedIds(data: unknown): data is string[] {
  return Array.isArray(data) && data.every((item) => typeof item === "string");
}

/**
 * Validates that an unknown value is a finite number array, representing completed challenge days.
 *
 * @param data - The unknown data to validate
 * @returns Type guard boolean indicating matches number[]
 */
export function isValidCompletedDays(data: unknown): data is number[] {
  return Array.isArray(data) && data.every(isFiniteNumber);
}

/**
 * Validates that an unknown value conforms to the CarbonProfile interface structure.
 *
 * @param data - The unknown data to validate
 * @returns Type guard boolean indicating matches CarbonProfile
 */
export function isValidCarbonProfile(data: unknown): data is CarbonProfile {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  const candidate = data as Record<string, unknown>;
  const breakdown = candidate.breakdown as Record<string, unknown> | undefined;
  const breakdownPercentages = candidate.breakdownPercentages as
    | Record<string, unknown>
    | undefined;

  return (
    isFiniteNumber(candidate.carbonScore) &&
    isFiniteNumber(candidate.annualEmissions) &&
    !!breakdown &&
    isFiniteNumber(breakdown.transport) &&
    isFiniteNumber(breakdown.energy) &&
    isFiniteNumber(breakdown.food) &&
    isFiniteNumber(breakdown.shopping) &&
    isFiniteNumber(breakdown.flights) &&
    !!breakdownPercentages &&
    isFiniteNumber(breakdownPercentages.transport) &&
    isFiniteNumber(breakdownPercentages.energy) &&
    isFiniteNumber(breakdownPercentages.food) &&
    isFiniteNumber(breakdownPercentages.shopping) &&
    isFiniteNumber(breakdownPercentages.flights)
  );
}

/**
 * Validates that an unknown value is a valid list of chat messages.
 *
 * @param data - The unknown data to validate
 * @returns Type guard boolean indicating matches ChatMessage[]
 */
export function isValidChatMessages(
  data: unknown
): data is Array<{ role: string; content: string }> {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        !!item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        typeof (item as Record<string, unknown>).role === "string" &&
        typeof (item as Record<string, unknown>).content === "string"
    )
  );
}
