import React from "react";
import { CarbonProfile } from "../types";
import { RankedAction } from "../utils/decisionEngine";
import { Trees, CheckSquare, Square, ShieldCheck, Undo2 } from "lucide-react";
import { getFinancialSavings } from "../utils/calculator";

interface ImpactSimulatorProps {
  initialProfile: CarbonProfile;
  actions: RankedAction[];
  committedIds: string[];
  onCommitToggle: (id: string) => void;
  onClearToggles: () => void;
}

export const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({
  initialProfile,
  actions,
  committedIds,
  onCommitToggle,
  onClearToggles,
}) => {
  // Calculate simulated numbers
  // 1 kg = 0.001 Ton
  const committedActions = actions.filter((a) => committedIds.includes(a.id));
  const totalSavedKg = committedActions.reduce(
    (sum, a) => sum + a.customSavingKg,
    0
  );
  const totalSavedTons = Math.round((totalSavedKg / 1000) * 100) / 100;
  const totalSavedRs = committedActions.reduce(
    (sum, a) => sum + getFinancialSavings(a.category, a.customSavingKg),
    0
  );

  // Calculate projected
  const projectedEmissions = Math.max(
    0,
    Math.round((initialProfile.annualEmissions - totalSavedTons) * 100) / 100
  );
  const reductionPercentage =
    initialProfile.annualEmissions > 0
      ? Math.round((totalSavedTons / initialProfile.annualEmissions) * 100)
      : 0;

  // Trees Equivalency: 1 ton CO2 is roughly equal to the annual offset capacity of 40 mature trees.
  const treesPlantedOffset = Math.round(totalSavedTons * 40);

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-4 animate-fade-in"
      id="impact-simulator-root"
    >
      <div className="grid md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Simulation Output Cards */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Main live metrics card */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm select-none">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-indigo-700 mb-4">
              Live Impact Projection
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wide">
                  Baseline Audit
                </span>
                <span className="text-xl font-bold font-mono text-slate-700">
                  {initialProfile.annualEmissions}{" "}
                  <span className="text-xs">Tons/Yr</span>
                </span>
              </div>

              <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100">
                <span className="text-xs text-indigo-800 block font-extrabold flex items-center gap-1.5">
                  💡 Projected Footprint
                </span>
                <span className="text-3xl font-black font-mono text-indigo-900 tracking-tight">
                  {projectedEmissions}
                </span>
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mt-0.5">
                  Metric Tons CO₂/Yr
                </span>
              </div>

              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-emerald-800">
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-700 block font-black">
                    Reduction Match
                  </span>
                  <span className="text-2xl font-black font-mono">
                    {reductionPercentage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-emerald-700 block font-black">
                    Tons Deducted
                  </span>
                  <span className="text-md font-bold font-mono text-emerald-800">
                    -{totalSavedTons} Tons/yr
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-teal-50 border border-teal-100 rounded-2xl p-3.5 text-teal-850">
                <div>
                  <span className="text-[10px] uppercase font-mono text-teal-700 block font-black">
                    Estimated Wallet savings
                  </span>
                  <span className="text-lg font-black font-mono text-teal-900">
                    ₹{totalSavedRs.toLocaleString("en-IN")}/yr
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-teal-700 block font-black">
                    Finances
                  </span>
                  <span className="text-xs font-semibold font-sans text-teal-800">
                    High-Yield Save
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trees Offset Equivalency Card */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm flex items-center gap-4">
            <span className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <Trees className="w-8 h-8" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-600 block font-extrabold">
                LIFESTYLE EQUIVALENCY
              </span>
              <h4 className="text-base font-black text-slate-900 font-display">
                {treesPlantedOffset > 0
                  ? `+${treesPlantedOffset} mature trees`
                  : "0 trees offset yet"}
              </h4>
              <p className="text-xs text-slate-500 font-sans font-medium mt-1 leading-relaxed">
                Offset potential of committed choices over 1 year of daily
                adherence.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Toggles corresponding to Ranked Lifestyle Reductive Actions */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black font-display text-slate-900">
                Toggle Lifestyle Commitments
              </h3>
              {committedIds.length > 0 && (
                <button
                  onClick={onClearToggles}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 focus:outline-none cursor-pointer font-extrabold"
                  id="reset-simulation-btn"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Clear Toggles
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-6 font-sans font-medium leading-relaxed">
              Check actions below to run carbon scenarios and simulate how minor
              habit tweaks instantly build up metric savings.
            </p>

            <div className="space-y-3 max-h-[22rem] overflow-y-auto pr-1">
              {actions.map((action) => {
                const isChecked = committedIds.includes(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => onCommitToggle(action.id)}
                    className={`w-full text-left p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer gap-2 min-h-[48px] focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isChecked
                        ? "bg-emerald-50 border-emerald-400 text-slate-900 shadow-sm"
                        : "bg-slate-50/60 border-slate-150 text-slate-700 hover:border-emerald-250 hover:bg-emerald-50/20"
                    }`}
                    id={`toggle-action-${action.id}`}
                    aria-pressed={isChecked}
                  >
                    <div className="flex items-center gap-3.5 max-w-[80%]">
                      <span>
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300 flex-shrink-0" />
                        )}
                      </span>
                      <div>
                        <span className="text-xs font-bold font-sans block leading-snug text-slate-900">
                          {action.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans mt-0.5 block font-semibold leading-tight">
                          Category: {action.category} | Ease: {action.ease}/5
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-emerald-700 font-black font-mono block">
                        -{action.customSavingKg}{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          kg/yr
                        </span>
                      </span>
                      <span className="text-[11px] text-teal-650 font-black font-mono block">
                        ₹
                        {getFinancialSavings(
                          action.category,
                          action.customSavingKg
                        ).toLocaleString("en-IN")}
                        /yr
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono block font-bold uppercase tracking-wider">
                        Saving Impact
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-sans font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Grounded
              Calculations Verified
            </div>
            <div className="text-xs text-slate-450 font-bold text-center">
              Select actions to populate your{" "}
              <span className="text-emerald-700 font-bold text-xs">
                7-Day Weekly Carbon Challenge
              </span>
              !
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
