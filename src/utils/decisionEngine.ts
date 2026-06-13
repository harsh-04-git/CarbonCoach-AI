import { CarbonAuditInput, ReductiveAction } from "../types";
import { researchData } from "../data/research_data";

export interface RankedAction extends ReductiveAction {
  customSavingKg: number;
  priorityScore: number; // customSavingKg * ease
}

/**
 * Customizes saving potential based on user's lifestyle inputs,
 * ranks them by (Custom Impact × Ease Score), and returns the prioritized advice.
 */
export function getPrioritizedActions(input: CarbonAuditInput): RankedAction[] {
  return researchData.reductive_actions.map(action => {
    let customSavingKg = action.annual_saving_kg;

    // Apply smart filters to tailor calculations to the user's specific profile:
    switch (action.id) {
      case "reduce_ac":
        if (input.ac_usage === 0) {
          customSavingKg = 0;
        } else if (input.ac_usage < 3) {
          customSavingKg = Math.round(action.annual_saving_kg * (input.ac_usage / 4));
        }
        break;

      case "public_transit_2x":
        if (input.transport !== "car") {
          // No benefit since they are already taking eco transport
          customSavingKg = 0;
        } else if (input.commute_distance < 20) {
          customSavingKg = Math.round(action.annual_saving_kg * (input.commute_distance / 40));
        }
        break;

      case "walk_short_trips":
        if (input.transport === "bike") {
          // Already bike/walking
          customSavingKg = 0;
        } else if (input.commute_distance < 10) {
          customSavingKg = Math.round(action.annual_saving_kg * 0.3);
        }
        break;

      case "swap_beef":
        if (input.food_habits === "vegetarian") {
          // Already vegetarian
          customSavingKg = 0;
        } else if (input.food_habits === "mixed") {
          // Medium savings potential
          customSavingKg = Math.round(action.annual_saving_kg * 0.5);
        }
        break;

      case "combine_delivery":
        if (input.shopping_frequency === "rarely") {
          customSavingKg = 0;
        } else if (input.shopping_frequency === "medium") {
          customSavingKg = Math.round(action.annual_saving_kg * 0.5);
        }
        break;

      case "line_dry":
        if (input.electricity_bill === 0) {
          customSavingKg = 0;
        } else if (input.electricity_bill < 40) {
          customSavingKg = Math.round(action.annual_saving_kg * 0.4);
        }
        break;

      default:
        break;
    }

    // priorityScore = impact (kg saved) * ease rating (1-5)
    // To scale priority score cleanly, we map customSavingKg into a 1-5 impact factor (e.g. customSavingKg / 50) and multiply by ease
    const impactFactor = customSavingKg / 50; 
    const priorityScore = parseFloat((impactFactor * action.ease).toFixed(2));

    return {
      ...action,
      customSavingKg,
      priorityScore
    };
  })
  .filter(action => action.customSavingKg > 0) // filter out actions with zero relevance to student
  .sort((a, b) => b.priorityScore - a.priorityScore); // highest score first
}
