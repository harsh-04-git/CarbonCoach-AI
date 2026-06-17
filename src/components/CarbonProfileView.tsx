import React from "react";
import { CarbonProfile, TransitType } from "../types";
import { ShieldAlert, CheckCircle, Leaf, Zap, ShoppingCart, Car, Plane } from "lucide-react";
import { getScoreColor, getScoreRating } from "../utils/ui/formatters";
import { GLOBAL_BENCHMARKS, MAX_CHART_TONS, getCategoryDrivers } from "../constants/benchmarks";

interface CarbonProfileViewProps {
  profile: CarbonProfile;
  transitMode: TransitType;
  onContinue: () => void;
  onRecalculate: () => void;
}

export const CarbonProfileView: React.FC<CarbonProfileViewProps> = ({ profile, transitMode, onContinue, onRecalculate }) => {

  const rating = getScoreRating(profile.carbonScore);

  // SVG circle calculations for gauge
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profile.carbonScore / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in" id="profile-view-root">
      <div className="grid md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Big Circle Gauge Card */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xs font-mono font-black tracking-widest text-emerald-600 uppercase mb-2">
              Carbon Benchmark
            </h3>
            <p className="text-sm text-slate-500 font-sans font-medium">
              Your overall annualized carbon footprint ranking
            </p>
          </div>

          {/* Animated SVG Ring Gauge */}
          <div className="flex justify-center items-center my-4 relative">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100 fill-none"
                strokeWidth={strokeWidth}
              />
              {/* Foreground circle with dasharray */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block text-4xl font-extrabold font-display text-slate-900">
                {profile.carbonScore}
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold uppercase">
                / 100 index
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-center">
            <div className={`text-sm font-black font-display ${getScoreColor(profile.carbonScore)}`}>
              {rating.label}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 font-sans font-medium leading-relaxed">
              {rating.desc}
            </p>
          </div>

          <div className="text-center mt-6 text-[11px] text-slate-400 font-semibold font-mono">
            Target Climate Accord Cap: <span className="text-emerald-600 font-mono font-bold">Under 2.0 Tons</span>
          </div>
        </div>

        {/* Right Column: Key Metrics & Categories Breakdown */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black font-display text-slate-900">
                Est. Annual Emissions
              </h3>
              <div className="text-center">
                <span className="text-3xl font-black font-mono text-emerald-600 tracking-tight block">
                  {profile.annualEmissions}
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider mt-0.5">
                  Metric Tons CO₂/Yr
                </span>
              </div>
            </div>

            {/* Flat bar breakdowns custom styled */}
            <h4 className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">
              Footprint Category Composition
            </h4>

            <div className="space-y-4">
              {[
                { name: "Daily Transport", tons: profile.breakdown.transport, percent: profile.breakdownPercentages.transport, icon: Car, color: "bg-amber-500" },
                { name: "Home & Energy", tons: profile.breakdown.energy, percent: profile.breakdownPercentages.energy, icon: Zap, color: "bg-teal-500" },
                { name: "Food & Diet", tons: profile.breakdown.food, percent: profile.breakdownPercentages.food, icon: Leaf, color: "bg-emerald-500" },
                { name: "Online Shopping", tons: profile.breakdown.shopping, percent: profile.breakdownPercentages.shopping, icon: ShoppingCart, color: "bg-purple-500" },
                { name: "Aviation Flights", tons: profile.breakdown.flights, percent: profile.breakdownPercentages.flights, icon: Plane, color: "bg-sky-500" },
              ].map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div key={i} className="flex flex-col gap-1.5" id={`category-bar-${cat.name.toLowerCase().replace(/ /g, "-")}`}>
                    <div className="flex justify-between text-xs text-slate-700 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" /> {cat.name}
                      </span>
                      <span className="font-mono text-slate-500 font-semibold">
                        {cat.tons} Tons <span className="text-slate-400 text-[11px]">({cat.percent}%)</span>
                      </span>
                    </div>
                    {/* Progress track */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(1, cat.percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-end items-center mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={onRecalculate}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition duration-200 border border-slate-200 rounded-xl cursor-pointer bg-white"
              id="recalculate-btn"
            >
              Recalculate Audit
            </button>
            <button
              onClick={onContinue}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black font-sans rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-200"
              id="view-prioritized-btn"
            >
              Prioritized Action Plan →
            </button>
          </div>
        </div>
      </div>

      {/* Relative Carbon Benchmarking Context */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-sm mt-6 animate-fade-in" id="carbon-relative-benchmarks">
        <h3 className="text-md font-black font-display text-slate-900 mb-2 flex items-center gap-2">
          <span>🌍</span> Indian & Global Carbon Benchmarks Context
        </h3>
        <p className="text-xs text-slate-500 font-sans font-medium mb-5 leading-relaxed">
          How does your footprint stack up relative to climate thresholds and average citizens around the world? 
          The Paris Agreement targets a sustainable threshold of <strong>under {GLOBAL_BENCHMARKS.PARIS_ACCORD.value.toFixed(1)} Metric Tons CO₂</strong> per capita by 2030.
        </p>

        <div className="relative pt-8 pb-4 px-4 bg-slate-50 rounded-2xl border border-slate-150">
          {/* Timeline axis */}
          <div className="relative w-full h-3 bg-slate-200 rounded-full">
            {/* Range markers */}
            <div className="absolute left-0 right-0 h-full flex justify-between pointer-events-none">
              <div className="w-[1px] h-5 bg-emerald-500/60 relative -top-1">
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-mono font-bold text-emerald-600">0.0T</span>
              </div>
              <div className="w-[1px] h-5 bg-teal-500/60 relative -top-1" style={{ left: `${(GLOBAL_BENCHMARKS.INDIA_AVG.value / MAX_CHART_TONS) * 100}%` }}>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-mono font-bold text-teal-650">{GLOBAL_BENCHMARKS.INDIA_AVG.value}T (India)</span>
              </div>
              <div className="w-[1px] h-5 bg-amber-500/60 relative -top-1" style={{ left: `${(GLOBAL_BENCHMARKS.GLOBAL_AVG.value / MAX_CHART_TONS) * 100}%` }}>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-mono font-bold text-amber-600">{GLOBAL_BENCHMARKS.GLOBAL_AVG.value}T (Global)</span>
              </div>
              <div className="w-[1px] h-5 bg-rose-500/60 relative -top-1" style={{ left: '100%' }}>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-mono font-bold text-rose-600">{GLOBAL_BENCHMARKS.USA_AVG.value}T (USA)</span>
              </div>
            </div>

            {/* Dynamic Slider pin for User's emissions (capped at max for visuals) */}
            {(() => {
              const maxTons = MAX_CHART_TONS;
              const userPct = Math.min(100, Math.max(0, (profile.annualEmissions / maxTons) * 100));
              let badgeBg = "bg-emerald-500";
              let statusLabel = "Paris Compliant";
              if (profile.annualEmissions > 10.0) {
                badgeBg = "bg-rose-600";
                statusLabel = "Excessive Warning";
              } else if (profile.annualEmissions > 4.7) {
                badgeBg = "bg-amber-500";
                statusLabel = "Above Global Avg";
              } else if (profile.annualEmissions > 1.9) {
                badgeBg = "bg-teal-600";
                statusLabel = "Moderate (Above India Avg)";
              }
              
              return (
                <div 
                  className={`absolute h-6 w-6 rounded-full border-2 border-white shadow-md flex items-center justify-center -top-1.5 -ml-3 transition-all duration-1000 ease-out cursor-default ${badgeBg}`}
                  style={{ left: `${userPct}%` }}
                  title={`Your Emission Footprint: ${profile.annualEmissions} Tons`}
                >
                  <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    YOU: {profile.annualEmissions} Tons ({statusLabel})
                  </span>
                </div>
              );
            })()}
          </div>
          <div className="h-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-600 tracking-wider block uppercase mb-1">{GLOBAL_BENCHMARKS.PARIS_ACCORD.label}</span>
            <div className="text-base font-extrabold text-slate-900 font-display">&lt; {GLOBAL_BENCHMARKS.PARIS_ACCORD.value.toFixed(1)} Tons</div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{GLOBAL_BENCHMARKS.PARIS_ACCORD.desc}</p>
          </div>
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-teal-600 tracking-wider block uppercase mb-1">{GLOBAL_BENCHMARKS.INDIA_AVG.label}</span>
            <div className="text-base font-extrabold text-slate-900 font-display">{GLOBAL_BENCHMARKS.INDIA_AVG.value.toFixed(1)} Tons</div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{GLOBAL_BENCHMARKS.INDIA_AVG.desc}</p>
          </div>
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-600 tracking-wider block uppercase mb-1">{GLOBAL_BENCHMARKS.GLOBAL_AVG.label}</span>
            <div className="text-base font-extrabold text-slate-900 font-display">{GLOBAL_BENCHMARKS.GLOBAL_AVG.value.toFixed(1)} Tons</div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{GLOBAL_BENCHMARKS.GLOBAL_AVG.desc}</p>
          </div>
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-rose-600 tracking-wider block uppercase mb-1">{GLOBAL_BENCHMARKS.USA_AVG.label}</span>
            <div className="text-base font-extrabold text-slate-900 font-display">{GLOBAL_BENCHMARKS.USA_AVG.value.toFixed(1)} Tons</div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{GLOBAL_BENCHMARKS.USA_AVG.desc}</p>
          </div>
        </div>
      </div>

      {/* Score Explanation Layer */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-sm mt-6 animate-fade-in" id="score-explanation-card">
        <h3 className="text-md font-black font-display text-slate-900 mb-2 flex items-center gap-2">
          <span>📊</span> Carbon Score Calibration Breakdown
        </h3>
        <p className="text-xs text-slate-500 font-sans font-medium mb-5 leading-relaxed">
          Your score starts at a perfect baseline score of <strong>100 points</strong> and is reduced according to the specific carbon penalties of your category footprints (scaled as <strong>-7.5 score deduction points per metric ton CO₂</strong>). Here is exactly why you scored <strong>{profile.carbonScore}</strong>/100:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { n: "Daily Transport", pts: Math.round(profile.breakdown.transport * 7.5 * 10) / 10, t: profile.breakdown.transport },
            { n: "Home & Energy", pts: Math.round(profile.breakdown.energy * 7.5 * 10) / 10, t: profile.breakdown.energy },
            { n: "Food & Diet", pts: Math.round(profile.breakdown.food * 7.5 * 10) / 10, t: profile.breakdown.food },
            { n: "Online Shopping", pts: Math.round(profile.breakdown.shopping * 7.5 * 10) / 10, t: profile.breakdown.shopping },
            { n: "Aviation Flights", pts: Math.round(profile.breakdown.flights * 7.5 * 10) / 10, t: profile.breakdown.flights },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">{item.n}</span>
              <span className="text-xs font-black font-mono text-rose-600 block">-{item.pts} pt</span>
              <span className="text-[10px] font-sans text-slate-400 block font-medium">({item.t} Tons)</span>
            </div>
          ))}
        </div>

        {/* Dynamic Drivers */}
        {(() => {
          const categories = getCategoryDrivers(profile);
          const sorted = [...categories].sort((a, b) => b.tons - a.tons);
          const biggest = sorted[0];
          const lowest = sorted[sorted.length - 1];

          return (
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-2xl">
                <span className="text-[10px] font-mono font-black uppercase text-rose-700 block mb-1">🔥 Biggest Driver</span>
                <p className="font-sans font-semibold text-slate-800">
                  {biggest.name} ({biggest.tons} Tons / -{Math.round(biggest.tons * 7.5 * 10) / 10} points penalty) is your leading footprint source, coming from {biggest.desc}.
                </p>
              </div>
              <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-mono font-black uppercase text-emerald-700 block mb-1">🌱 Lowest Driver (Best Performing)</span>
                <p className="font-sans font-semibold text-slate-800">
                  {lowest.name} ({lowest.tons} Tons / -{Math.round(lowest.tons * 7.5 * 10) / 10} points penalty) is your lowest-emission Category, coming from {lowest.desc}.
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
