export function isValidCarbonAuditInput(data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  const validTransport = ["bike", "bus", "metro", "car"];
  const validFoodHabits = ["vegetarian", "mixed", "non-vegetarian"];
  const validShoppingFrequency = ["rarely", "medium", "high"];

  return (
    typeof data.transport === 'string' && validTransport.includes(data.transport) &&
    typeof data.commute_distance === 'number' && !isNaN(data.commute_distance) &&
    typeof data.electricity_bill === 'number' && !isNaN(data.electricity_bill) &&
    typeof data.ac_usage === 'number' && !isNaN(data.ac_usage) &&
    typeof data.food_habits === 'string' && validFoodHabits.includes(data.food_habits) &&
    typeof data.shopping_frequency === 'string' && validShoppingFrequency.includes(data.shopping_frequency) &&
    typeof data.flights_per_year === 'number' && !isNaN(data.flights_per_year)
  );
}

export function isValidCommittedIds(data: any): boolean {
  return Array.isArray(data) && data.every(item => typeof item === 'string');
}

export function isValidCompletedDays(data: any): boolean {
  return Array.isArray(data) && data.every(item => typeof item === 'number' && !isNaN(item));
}
