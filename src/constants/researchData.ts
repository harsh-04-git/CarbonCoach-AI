import { ReductiveAction, ChallengeDay } from "../types";

export interface ResearchData {
  emission_factors: {
    transport: {
      bike: number;
      bus: number;
      metro: number;
      car: number;
    };
    energy: {
      electricity_kwh_kg: number;
      ac_hour_kg: number;
    };
    food: {
      vegetarian: number;
      mixed: number;
      non_vegetarian: number;
    };
    shopping: {
      rarely: number;
      medium: number;
      high: number;
    };
    flights: {
      short_haul_kg: number;
      long_haul_kg: number;
      average_kg: number;
    };
  };
  reductive_actions: ReductiveAction[];
  weekly_challenges: ChallengeDay[];
  persona_presets: {
    student_commuter: {
      name: string;
      description: string;
      transport: string;
      commute_distance: number;
      electricity_bill: number;
      ac_usage: number;
      food_habits: string;
      shopping_frequency: string;
      flights_per_year: number;
    };
    working_professional: {
      name: string;
      description: string;
      transport: string;
      commute_distance: number;
      electricity_bill: number;
      ac_usage: number;
      food_habits: string;
      shopping_frequency: string;
      flights_per_year: number;
    };
    family_household: {
      name: string;
      description: string;
      transport: string;
      commute_distance: number;
      electricity_bill: number;
      ac_usage: number;
      food_habits: string;
      shopping_frequency: string;
      flights_per_year: number;
    };
  };
}

export const researchData: ResearchData = {
  emission_factors: {
    transport: {
      bike: 0.0,
      bus: 0.10, // kg CO2 per mile
      metro: 0.08, // kg CO2 per mile
      car: 0.35 // kg CO2 per mile
    },
    energy: {
      electricity_kwh_kg: 0.82, // 0.82 kg per kWh (Indian Grid Avg)
      ac_hour_kg: 1.2 // 1.2 kg per hour (1.5 Ton AC average)
    },
    food: {
      vegetarian: 1500, // kg CO2/year
      mixed: 2300, // kg CO2/year
      non_vegetarian: 3300 // kg CO2/year
    },
    shopping: {
      rarely: 100, // kg CO2/year
      medium: 350, // kg CO2/year
      high: 800 // kg CO2/year
    },
    flights: {
      short_haul_kg: 250,
      long_haul_kg: 900,
      average_kg: 500 // kg CO2 per flight
    }
  },
  reductive_actions: [
    {
      id: "reduce_ac",
      title: "Set household AC to 24°C & use a ceiling fan",
      category: "energy",
      annual_saving_kg: 120,
      ease: 5,
      cost: 1,
      description: "Increase thermostat or cut AC operating hours. Circulate chilly air with standard high-efficiency ceiling fans to drastically lower compressor runtime.",
      tip: "Set a sleep timer for 1 AM, turn on your energy-efficient ceiling fan on low speed, and keep room doors tightly shut to preserve cooling."
    },
    {
      id: "public_transit_2x",
      title: "Commute via local Metro, BRTS, or shared ride twice a week",
      category: "transport",
      annual_saving_kg: 180,
      ease: 4,
      cost: 1,
      description: "Swap private car trips for Metro lines, BRTS corridor buses, local electric trains, or group office carpools on designated days.",
      tip: "Avoid grueling traffic jams in Indian cities, cut high fuel expenses, and reduce personal carbon output."
    },
    {
      id: "reduce_food_waste",
      title: "Minimize kitchen waste & buy local seasonal sabzi",
      category: "food",
      annual_saving_kg: 50,
      ease: 4,
      cost: 1,
      description: "Buy fresh local produce from the local mandi. Plan meals and store ingredients dynamically to eliminate compostable organic landfill waste.",
      tip: "Utilize traditional batch-cooking methods and organize your refrigerator to consume perishable items like milk, vegetables, and paneer first."
    },
    {
      id: "walk_short_trips",
      title: "Walk or cycle for errands under 2 km",
      category: "transport",
      annual_saving_kg: 80,
      ease: 4,
      cost: 1,
      description: "Power down active combustion engines for short neighborhood errands like picking up groceries, milk, or medicine from local shops.",
      tip: "Grab a reusable canvas jhola bag and cycle or take a brisk walk, completely skipping start-up fuel waste from cars or petrol scooters."
    },
    {
      id: "vampire_power",
      title: "Switch off wall power sockets at night",
      category: "energy",
      annual_saving_kg: 60,
      ease: 5,
      cost: 1,
      description: "Flip the physical switches on Indian wall boards for idle chargers, television setups, Wi-Fi routers, and kitchen appliances before sleeping.",
      tip: "Unlike other countries, standard Indian wall outlets have active toggle switches. Flipping them off cuts vampire load instantly."
    },
    {
      id: "line_dry",
      title: "Line-dry clothes naturally under standard Indian sun",
      category: "energy",
      annual_saving_kg: 150,
      ease: 3,
      cost: 1,
      description: "Ditch power-guzzling dryer cycles entirely. Let the abundant Indian sun and warm breeze dry and sanitize laundry naturally on balcony stands.",
      tip: "Arrange laundry stand lines on sunny balconies or dry areas. Shaking fabrics well before hanging minimizes wrinkling."
    },
    {
      id: "swap_beef",
      title: "Opt for protein-rich dal, paneer, and local lentils",
      category: "food",
      annual_saving_kg: 220,
      ease: 3,
      cost: 1,
      description: "Keep meals heavy in traditional rich plant-based proteins like lentils, pulses, organic beans, and paneer rather than heavy meat choices.",
      tip: "Savor traditional, highly sustainable recipes like dal makhani, rajma chawal, chole bhature, or palak paneer."
    },
    {
      id: "combine_delivery",
      title: "Combine Swiggy, Zomato, and online shopping deliveries",
      category: "shopping",
      annual_saving_kg: 90,
      ease: 4,
      cost: 1,
      description: "Group separate digital commerce purchases or food deliveries into single drops to minimize individual scooter dispatch trips.",
      tip: "Coordinate orders with flatmates or family members. Avoid impulse ordering and set one consolidated green delivery day weekly."
    }
  ],
  weekly_challenges: [
    {
      day: 1,
      title: "Walk, Cycle, or use Metro/BRTS",
      action: "Walk or ride a cycle for short trips today instead of taking a motorized scooter. Try the Metro or bus for longer transits.",
      saving_kg: 1.5
    },
    {
      day: 2,
      title: "Ceiling Fan Only Shift",
      action: "Refrain from operating the AC or set its thermostat to 26°C, run high-efficiency ceiling fans on low-to-medium settings instead.",
      saving_kg: 1.0
    },
    {
      day: 3,
      title: "Home-Style Cooking Focus",
      action: "Skip the Swiggy or Zomato deliveries today. Enjoy delicious, fresh home-cooked meals.",
      saving_kg: 0.8
    },
    {
      day: 4,
      title: "Indian Socket Sweeps",
      action: "Turn off at least 5 physical toggles on your household wall socket boards for idle chargers and TVs before going to bed.",
      saving_kg: 0.2
    },
    {
      day: 5,
      title: "Lentils-and-Veggies Diet",
      action: "Enjoy purely plant-powered meals (traditional dal, rice, local sabzi) for both lunch and dinner today, with zero heavy food imports.",
      saving_kg: 3.0
    },
    {
      day: 6,
      title: "Balcony Clothesline Dry",
      action: "Hang wash loads today on balcony lines or outdoor folding racks to let the Indian sun dry them naturally; bypass automatic dryers.",
      saving_kg: 1.2
    },
    {
      day: 7,
      title: "LED Upgrade Audit",
      action: "Check your household light fixtures to make sure they are energy-saving LEDs, and review your CarbonCoach AI final roadmap.",
      saving_kg: 0.5
    }
  ],
  persona_presets: {
    student_commuter: {
      name: "Student Commuter",
      description: "Indian college/school commuter taking local bus, metro, or auto-rickshaw. Uses simple ceiling fans and has zero flight emissions, great for forming zero-cost eco habits.",
      transport: "bus",
      commute_distance: 60,
      electricity_bill: 45,
      ac_usage: 2,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1
    },
    working_professional: {
      name: "Working Professional",
      description: "Daily urban car driver, high electricity consumption with regular home Air Conditioning, gets food/grocery deliveries on Swiggy and Zomato, takes domestic/international flights.",
      transport: "car",
      commute_distance: 150,
      electricity_bill: 140,
      ac_usage: 8,
      food_habits: "non-vegetarian",
      shopping_frequency: "high",
      flights_per_year: 4
    },
    family_household: {
      name: "Family Household",
      description: "Indian multi-generational home with active multiple ceiling fans, high cooking volume, moderate local commutes, and peak evening energy demands.",
      transport: "car",
      commute_distance: 90,
      electricity_bill: 260,
      ac_usage: 10,
      food_habits: "vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 1
    }
  }
};
