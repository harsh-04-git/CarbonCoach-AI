export const getCategoryColor = (category: string) => {
  switch (category) {
    case "energy": return "text-teal-700 bg-teal-50 border-teal-200";
    case "food": return "text-emerald-700 bg-emerald-50 border-emerald-250";
    case "shopping": return "text-purple-700 bg-purple-50 border-purple-200";
    case "flights": return "text-sky-700 bg-sky-50 border-sky-200";
    default: return "text-amber-700 bg-amber-50 border-amber-200";
  }
};
