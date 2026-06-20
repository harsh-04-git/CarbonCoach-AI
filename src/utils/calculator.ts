import { AuditData, CarbonProfile } from "../types";
import { researchData } from "../data/research_data";

/**
 * Calculates conservative annual cost savings in Indian Rupees (₹)
 * corresponding to a given CO2 saving.
 */
export function getFinancialSavings(category: string, co2SavingKg: number): number {
  switch (category) {
    case "energy": return Math.round(co2SavingKg * 15);
    case "transport": return Math.round(co2SavingKg * 10);
    case "food": return Math.round(co2SavingKg * 8);
    case "shopping": return Math.round(co2SavingKg * 12);
    case "flights": return Math.round(co2SavingKg * 8);
    default: return Math.round(co2SavingKg * 10);
  }
}

/**
 * Calculates deterministic carbon emissions in metric tons of CO2 per year
 * based on verified research data factors.
 */
export function calculateEmissions(input: AuditData): CarbonProfile {
  // 1. Transport CO2: miles/week * 52 weeks * factor_kg/mile
  const transportFactor = researchData.emission_factors.transport[input.transport] || 0;
  const transportKg = input.commute_distance * 52 * transportFactor;

  // 2. Energy CO2 (Electricity + AC)
  // Electricity Monthly Bill (Rs) / 12 average cost/kWh * 12 months * factor_electricity
  const monthlyKwh = input.electricity_bill / 12;
  const annualKwh = monthlyKwh * 12;
  const electricityKg = annualKwh * researchData.emission_factors.energy.electricity_kwh_kg;

  // AC usage: hours/day * 365 days * ac_hour_kg
  const acKg = input.ac_usage * 365 * researchData.emission_factors.energy.ac_hour_kg;
  const energyKg = electricityKg + acKg;

  // 3. Food CO2 (based on diet habits)
  const foodKg = researchData.emission_factors.food[input.food_habits] || 2300;

  // 4. Shopping CO2 (based on online commerce frequency)
  const shoppingKg = researchData.emission_factors.shopping[input.shopping_frequency] || 350;

  // 5. Flights CO2 (flights per year * standard flight emissions)
  const flightsKg = input.flights_per_year * researchData.emission_factors.flights.average_kg;

  // Convert to metric tons (divide by 1000) and round to 2 decimal places
  const transportTons = Math.round((transportKg / 1000) * 100) / 100;
  const energyTons = Math.round((energyKg / 1000) * 100) / 100;
  const foodTons = Math.round((foodKg / 1000) * 100) / 100;
  const shoppingTons = Math.round((shoppingKg / 1000) * 100) / 100;
  const flightsTons = Math.round((flightsKg / 1000) * 100) / 100;

  const totalEmissions = Math.round((transportTons + energyTons + foodTons + shoppingTons + flightsTons) * 100) / 100;

  // Carbon Score: 100 minus weighted scale. Standard US avg (15 tons) gives score ~ 100 - (15*7.5) = -12.5 (clamped to 10)
  // Sustainable goal (3 tons or less) scores above 75. Example 3.8 tons outputs score 72.
  const carbonScore = Math.max(10, Math.min(99, Math.round(100 - (totalEmissions * 7.5))));

  // Percentages mapping with divide-by-zero safeguard
  const safeSum = totalEmissions > 0 ? totalEmissions : 0.1;
  const breakdownPercentages = {
    transport: Math.round((transportTons / safeSum) * 100),
    energy: Math.round((energyTons / safeSum) * 100),
    food: Math.round((foodTons / safeSum) * 100),
    shopping: Math.round((shoppingTons / safeSum) * 100),
    flights: Math.round((flightsTons / safeSum) * 100),
  };

  return {
    carbonScore,
    annualEmissions: totalEmissions,
    breakdown: {
      transport: transportTons,
      energy: energyTons,
      food: foodTons,
      shopping: shoppingTons,
      flights: flightsTons,
    },
    breakdownPercentages
  };
}
