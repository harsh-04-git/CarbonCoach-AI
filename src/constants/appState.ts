export const getSubHeaderMessage = (activeState: number) => {
  switch (activeState) {
    case 2: return "State 2: Carbon Profile Benchmark";
    case 3: return "State 3: Decision Engine Optimal Recommendations";
    case 4: return "State 4: Live Interactive Impact Simulator";
    case 5: return "State 5: 7-Day Habit Formation Challenges";
    case 6: return "AI personal Carbon reduction Coach";
    default: return "";
  }
};
