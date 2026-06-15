export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 border-emerald-100";
  if (score >= 60) return "text-teal-600 border-teal-100";
  if (score >= 40) return "text-amber-600 border-amber-100";
  return "text-rose-600 border-rose-100";
};

export const getScoreRating = (score: number) => {
  if (score >= 80) return { label: "Excellent Eco Status", desc: "Your carbon footprint is remarkably sustainable! Well below international caps." };
  if (score >= 60) return { label: "Balanced / Moderate", desc: "Good baseline! Some easy adjustments will significantly increase your efficiency." };
  if (score >= 40) return { label: "Needs Improvement", desc: "Higher than sustainable standards. Let's target key areas to save energy & costs." };
  return { label: "High Impact Footprint", desc: "Significant carbon intensity. Large potential to optimize and save with basic commuter/home choices." };
};
