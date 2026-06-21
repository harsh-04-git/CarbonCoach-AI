import { Zap, Leaf, ShoppingCart, Plane, Car } from "lucide-react";
import { CarbonProfile } from "../../types";

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 border-emerald-100";
  if (score >= 60) return "text-teal-600 border-teal-100";
  if (score >= 40) return "text-amber-600 border-amber-100";
  return "text-rose-600 border-rose-100";
};

export const getScoreRating = (score: number) => {
  if (score >= 80)
    return {
      label: "Excellent Eco Status",
      desc: "Your carbon footprint is remarkably sustainable! Well below international caps.",
    };
  if (score >= 60)
    return {
      label: "Balanced / Moderate",
      desc: "Good baseline! Some easy adjustments will significantly increase your efficiency.",
    };
  if (score >= 40)
    return {
      label: "Needs Improvement",
      desc: "Higher than sustainable standards. Let's target key areas to save energy & costs.",
    };
  return {
    label: "High Impact Footprint",
    desc: "Significant carbon intensity. Large potential to optimize and save with basic commuter/home choices.",
  };
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "energy":
      return Zap;
    case "food":
      return Leaf;
    case "shopping":
      return ShoppingCart;
    case "flights":
      return Plane;
    default:
      return Car;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "energy":
      return "text-teal-700 bg-teal-50 border-teal-200";
    case "food":
      return "text-emerald-700 bg-emerald-50 border-emerald-250";
    case "shopping":
      return "text-purple-700 bg-purple-50 border-purple-200";
    case "flights":
      return "text-sky-700 bg-sky-50 border-sky-200";
    default:
      return "text-amber-700 bg-amber-50 border-amber-200";
  }
};

export const getCostLabel = (cost: number) => {
  switch (cost) {
    case 1:
      return "Free / Saves ₹";
    case 2:
      return "Low cost (₹)";
    case 3:
      return "Investment (₹₹)";
    default:
      return "Free";
  }
};

export const getCategoryDrivers = (profile: CarbonProfile) => [
  {
    name: "Daily Transport",
    tons: profile.breakdown.transport,
    desc: "commutes via private/public vehicles",
  },
  {
    name: "Home & Energy",
    tons: profile.breakdown.energy,
    desc: "monthly electric bills & heavy AC cooling schedules",
  },
  {
    name: "Food & Diet",
    tons: profile.breakdown.food,
    desc: "your preferred dietary profiles",
  },
  {
    name: "Online Shopping",
    tons: profile.breakdown.shopping,
    desc: "home parcel courier deliveries",
  },
  {
    name: "Aviation Flights",
    tons: profile.breakdown.flights,
    desc: "annual dynamic flights taken",
  },
];
