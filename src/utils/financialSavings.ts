/**
 * Calculates conservative annual cost savings in Indian Rupees (₹)
 * corresponding to a given CO2 saving for a category.
 *
 * @param category - The emission category (energy, transport, food, shopping, flights)
 * @param co2SavingKg - The amount of CO2 saved in kilograms
 * @returns The estimated annual financial savings in INR
 */
export function getFinancialSavings(category: string, co2SavingKg: number): number {
  if (co2SavingKg < 0) return 0; // Defensive check for negative input
  
  switch (category) {
    case "energy":
      return Math.round(co2SavingKg * 15);
    case "transport":
      return Math.round(co2SavingKg * 10);
    case "food":
      return Math.round(co2SavingKg * 8);
    case "shopping":
      return Math.round(co2SavingKg * 12);
    case "flights":
      return Math.round(co2SavingKg * 8);
    default:
      return Math.round(co2SavingKg * 10);
  }
}
