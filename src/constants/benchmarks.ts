import { CarbonProfile } from "../types";

export const GLOBAL_BENCHMARKS = {
  PARIS_ACCORD: { label: "Paris Accord Target", value: 2.0, desc: "Sustainable carbon footprint cap required to prevent global temperature increases exceeding 1.5°C." },
  INDIA_AVG: { label: "India Average Resident", value: 1.9, desc: "Indian average is globally exemplary due to plant-oriented diets and dynamic transit reliance." },
  GLOBAL_AVG: { label: "Global Per-Capita Avg", value: 4.7, desc: "Average emissions across all combining industrial, service, and agricultural territories." },
  USA_AVG: { label: "USA Per-Capita Average", value: 14.5, desc: "Extremely high global footprint standard spurred by heavy vehicle transit patterns and continuous central heating/cooling." },
};

export const MAX_CHART_TONS = 14.5;

export const getCategoryDrivers = (profile: CarbonProfile) => [
  { name: "Daily Transport", tons: profile.breakdown.transport, desc: "commutes via private/public vehicles" },
  { name: "Home & Energy", tons: profile.breakdown.energy, desc: "monthly electric bills & heavy AC cooling schedules" },
  { name: "Food & Diet", tons: profile.breakdown.food, desc: "your preferred dietary profiles" },
  { name: "Online Shopping", tons: profile.breakdown.shopping, desc: "home parcel courier deliveries" },
  { name: "Aviation Flights", tons: profile.breakdown.flights, desc: "annual dynamic flights taken" },
];
