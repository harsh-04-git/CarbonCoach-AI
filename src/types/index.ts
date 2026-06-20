export type PersonaKey = "student_commuter" | "working_professional" | "family_household" | "custom";

export type TransitType = "bike" | "bus" | "metro" | "car";

export type FoodHabits = "vegetarian" | "mixed" | "non-vegetarian";

export type ShoppingFrequency = "rarely" | "medium" | "high";

export interface AuditData {
  transport: TransitType;
  commute_distance: number; // miles per week
  electricity_bill: number; // $ per month (average $0.12/kWh -> 3.3 kWh per $, around 0.4kg CO2 per kWh)
  ac_usage: number; // average operating hours per day
  food_habits: FoodHabits;
  shopping_frequency: ShoppingFrequency;
  flights_per_year: number; // flights per year
}

export interface EmissionBreakdown {
  transport: number; // in Tons CO2 / year
  energy: number;    // in Tons CO2 / year
  food: number;      // in Tons CO2 / year
  shopping: number;  // in Tons CO2 / year
  flights: number;   // in Tons CO2 / year
  total: number;     // in Tons CO2 / year
}

export interface CarbonProfile {
  carbonScore: number; // 0 to 100 benchmark (higher is better / lower footprint)
  annualEmissions: number; // total in Tons CO2
  breakdown: {
    transport: number;
    energy: number;
    food: number;
    shopping: number;
    flights: number;
  };
  breakdownPercentages: {
    transport: number;
    energy: number;
    food: number;
    shopping: number;
    flights: number;
  };
}

export interface ReductiveAction {
  id: string;
  title: string;
  category: "transport" | "energy" | "food" | "shopping" | "flights" | string;
  annual_saving_kg: number;
  ease: number; // 1-5 scale (higher is easier)
  cost: number; // 1-3 scale (higher is more expensive, 1 = low/no cost)
  description: string;
  tip: string;
  priorityScore?: number; // ease * impact factor
}

export interface ChallengeDay {
  day: number;
  title: string;
  action: string;
  saving_kg: number;
}
