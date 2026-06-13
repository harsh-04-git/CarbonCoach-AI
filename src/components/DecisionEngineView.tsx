import React, { useState } from "react";
import { RankedAction } from "../utils/decisionEngine";
import { ChevronDown, ChevronUp, Star, Circle, CheckCircle, Flame, ArrowRight, Zap, Leaf, ShoppingCart, Plane, Car } from "lucide-react";
import { getFinancialSavings } from "../utils/calculator";

import { CarbonAuditInput } from "../types";

interface DecisionEngineViewProps {
  actions: RankedAction[];
  onCommitToggle: (id: string) => void;
  committedIds: string[];
  onGoToSimulator: () => void;
  persona?: string | null;
  auditInput?: CarbonAuditInput | null;
}

export const DecisionEngineView: React.FC<DecisionEngineViewProps> = ({
  actions,
  onCommitToggle,
  committedIds,
  onGoToSimulator,
  persona,
  auditInput,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "energy": return Zap;
      case "food": return Leaf;
      case "shopping": return ShoppingCart;
      case "flights": return Plane;
      default: return Car;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "energy": return "text-teal-700 bg-teal-50 border-teal-200";
      case "food": return "text-emerald-700 bg-emerald-50 border-emerald-250";
      case "shopping": return "text-purple-700 bg-purple-50 border-purple-200";
      case "flights": return "text-sky-700 bg-sky-50 border-sky-200";
      default: return "text-amber-700 bg-amber-50 border-amber-200";
    }
  };

  const getCostLabel = (cost: number) => {
    switch (cost) {
      case 1: return "Free / Saves ₹";
      case 2: return "Low cost (₹)";
      case 3: return "Investment (₹₹)";
      default: return "Free";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 animate-fade-in" id="decision-engine-root">
      
      {/* Visual Indicator of Smart Logic */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-sm shadow-emerald-50/50">
        <div>
          <h3 className="text-sm font-bold text-emerald-800 font-display flex items-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-emerald-600" /> Customized Logical Prioritization Algorithm
          </h3>
          <p className="text-xs text-slate-600 font-sans max-w-xl font-medium leading-relaxed">
            This roadmap maps emission savings against ease metrics <span className="text-slate-900 font-bold font-mono">(Saving × Ease Rating)</span>. Swapping red meat when already vegetarian has 0kg impact, so those are dynamically hidden.
          </p>
        </div>
        <button
          onClick={onGoToSimulator}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold font-sans rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto text-center justify-center border-none shadow-md shadow-emerald-200"
          id="go-to-sim-shortcut"
        >
          Open Live Simulator <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {actions.map((action, idx) => {
          const CatIcon = getCategoryIcon(action.category);
          const isCommitted = committedIds.includes(action.id);
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm ${
                isCommitted 
                  ? "border-emerald-300 bg-emerald-50/15" 
                  : "border-emerald-100 hover:border-emerald-300 hover:shadow-md hover:bg-slate-50/30"
              }`}
              id={`action-item-${action.id}`}
            >
              {/* Row Header */}
              <div
                onClick={() => toggleExpand(action.id)}
                className="flex items-center justify-between p-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 flex-grow pr-4">
                  {/* Committal Click target */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent expandable toggle
                      onCommitToggle(action.id);
                    }}
                    className="p-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md cursor-pointer"
                    aria-label={`Commit to action: ${action.title}`}
                    id={`commit-checkbox-${action.id}`}
                  >
                    {isCommitted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>

                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${getCategoryColor(action.category)}`}>
                        <CatIcon className="w-2.5 h-2.5" /> {action.category}
                      </span>
                      {idx === 0 && (
                        <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 font-mono font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                          ⭐ Optimal Step
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm md:text-md font-bold font-display leading-tight ${isCommitted ? "text-emerald-700" : "text-slate-950"}`}>
                      {action.title}
                    </h4>
                  </div>
                </div>

                {/* Right columns: Savings & Controls */}
                <div className="flex items-center gap-4 text-right flex-shrink-0">
                  <div className="hidden sm:block">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">ANNUAL SAVINGS</div>
                    <div className="text-sm font-black font-mono text-emerald-600">
                      -{action.customSavingKg} <span className="text-[10px] text-slate-400 font-semibold font-sans">kg CO₂</span>
                    </div>
                    <div className="text-xs font-bold font-mono text-teal-600">
                      ₹{getFinancialSavings(action.category, action.customSavingKg).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
              </div>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs md:text-sm text-slate-600 space-y-3 animate-fade-in" id={`expanded-body-${action.id}`}>
                  {/* For small screen duplicated metrics */}
                  <div className="sm:hidden flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono font-extrabold">CO₂ Saved</span>
                      <span className="text-xs font-bold font-mono text-emerald-600">-{action.customSavingKg} kg/yr</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono font-extrabold font-black">Rupee Saved</span>
                      <span className="text-xs font-extrabold font-mono text-teal-650">₹{getFinancialSavings(action.category, action.customSavingKg).toLocaleString("en-IN")}/yr</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono font-extrabold">Priority</span>
                      <span className="text-xs font-bold font-mono text-amber-600">{action.priorityScore}</span>
                    </div>
                  </div>

                  <p className="font-sans leading-relaxed text-slate-600 font-medium">
                    {action.description}
                  </p>

                  {/* Explanatory "Why This Matters For You" Block */}
                  {(() => {
                    let explanation = "This general recommendation fits your category profile to help keep thresholds sustainable.";
                    const selectedPersona = persona || "custom";
                    
                    if (action.id === "reduce_ac") {
                      if (auditInput?.ac_usage && auditInput.ac_usage > 0) {
                        explanation = `Recommended because you indicated running your home AC for ${auditInput.ac_usage} hours daily. Standard Indian room compressors consume heavy energy; raising the thermostat to 24°C saves around ₹150 per thermostat degree monthly!`;
                      } else if (selectedPersona === "family_household") {
                        explanation = `As a Family Household with higher aggregate electricity consumption, raising AC cooling setpoints is the #1 way to slash summer utility bills.`;
                      } else {
                        explanation = `Targeted energy optimization for your Home & Energy footprint category.`;
                      }
                    } else if (action.id === "public_transit_2x") {
                      if (auditInput?.transport === "car") {
                        explanation = `Highly relevant since you commute via car. Swapping long individual highway miles for Metro or public buses directly cuts major tailpipe emissions and high monthly petrol costs.`;
                      } else if (selectedPersona === "student_commuter") {
                        explanation = `As a Student Commuter, choosing bus, metro, or cycles matches a lower carbon profile and stays highly pocket-friendly.`;
                      }
                    } else if (action.id === "walk_short_trips") {
                      explanation = `Because short-transit motor trips under 2 km utilize inefficient rich fuel-combustion mixtures. Walking or cycling is completely fuel-free and boosts personal fitness.`;
                    } else if (action.id === "swap_beef") {
                      if (auditInput?.food_habits === "mixed" || auditInput?.food_habits === "non-vegetarian") {
                        explanation = `Since your diet is currently mixed/non-vegetarian, swapping even two meals a week for protein-rich lentils, dal, or paneer generates massive agricultural methane savings.`;
                      } else {
                        explanation = `Since you are already Vegetarian, you have already eliminated major heavy-livestock carbon! Focus on minimizing kitchen waste.`;
                      }
                    } else if (action.id === "combine_delivery") {
                      if (auditInput?.shopping_frequency === "high" || auditInput?.shopping_frequency === "medium") {
                        explanation = `Spurred by your ${auditInput.shopping_frequency} online order frequency. Consolidating separate parcels means delivery couriers make fewer individual fossil scooter trips to your address.`;
                      } else {
                        explanation = `Keeps your digital delivery dispatch footprint low.`;
                      }
                    } else if (action.id === "line_dry") {
                      if (auditInput?.electricity_bill && auditInput.electricity_bill > 0) {
                        explanation = `Recommended since you have standard utility electric bills. Ditching automatic hot dryers and utilizing the natural warmth of Indian balcony spaces is a completely cost-free win!`;
                      }
                    } else if (action.id === "reduce_food_waste") {
                      if (selectedPersona === "family_household") {
                        explanation = `Highly recommended for family households to minimize food purchases and optimize kitchen ingredient storage (paneer, milk, veggies), preventing food decay methane.`;
                      } else {
                        explanation = `A quick way to lower municipal organic landfill waste.`;
                      }
                    } else if (action.id === "vampire_power") {
                      explanation = `Indian electrical wall outlets operate with physical on/off toggle switches. Shutting them off completely cuts standby socket vampire loads, lowering baseline utility bills.`;
                    }

                    return (
                      <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs">
                        <span className="text-sm">💡</span>
                        <div>
                          <span className="font-mono font-bold text-emerald-800 uppercase text-[9px] tracking-wider block mb-0.5">Profile Explainability Link</span>
                          <span className="font-sans text-slate-705 leading-relaxed font-semibold">{explanation}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                      <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Coach's Advice & execution
                      </div>
                      <div className="text-xs text-slate-600 font-sans font-medium leading-relaxed">
                        {action.tip}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-450 font-mono font-extrabold text-[10px] uppercase">Ease of changes:</span>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < action.ease ? "fill-amber-400 text-amber-500" : "text-slate-200 fill-slate-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-200/50">
                        <span className="text-slate-450 font-mono font-extrabold text-[10px] uppercase">Finances:</span>
                        <span className="font-bold text-teal-600 text-xs font-sans">
                          {getCostLabel(action.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
