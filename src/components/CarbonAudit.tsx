import React, { useState, useEffect } from "react";
import { CarbonAuditInput, PersonaKey, TransitType, FoodHabits, ShoppingFrequency } from "../types";
import { researchData } from "../data/research_data";
import { Car, Bus, Train, Bike, Zap, ShoppingBag, Plane, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface CarbonAuditProps {
  initialInput?: CarbonAuditInput;
  onSubmit: (input: CarbonAuditInput) => void;
  onBack: () => void;
}

export const CarbonAudit: React.FC<CarbonAuditProps> = ({ initialInput, onSubmit, onBack }) => {
  const [transport, setTransport] = useState<TransitType>(initialInput?.transport || "car");
  const [commuteDistance, setCommuteDistance] = useState<number>(initialInput?.commute_distance ?? 40);
  const [electricityBill, setElectricityBill] = useState<number>(initialInput?.electricity_bill ?? 80);
  const [acUsage, setAcUsage] = useState<number>(initialInput?.ac_usage ?? 4);
  const [foodHabits, setFoodHabits] = useState<FoodHabits>(initialInput?.food_habits || "mixed");
  const [shoppingFrequency, setShoppingFrequency] = useState<ShoppingFrequency>(initialInput?.shopping_frequency || "medium");
  const [flightsPerYear, setFlightsPerYear] = useState<number>(initialInput?.flights_per_year ?? 2);

  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = ["Commute & Travel", "Energy & Home", "Lifestyle Diet"];

  // Pre-load logic if initial input changes from presets
  useEffect(() => {
    if (initialInput) {
      setTransport(initialInput.transport);
      setCommuteDistance(initialInput.commute_distance);
      setElectricityBill(initialInput.electricity_bill);
      setAcUsage(initialInput.ac_usage);
      setFoodHabits(initialInput.food_habits);
      setShoppingFrequency(initialInput.shopping_frequency);
      setFlightsPerYear(initialInput.flights_per_year);
    }
  }, [initialInput]);

  const loadPreset = (presetKey: PersonaKey) => {
    const preset = presetKey === "student_commuter" 
      ? researchData.persona_presets.student_commuter 
      : researchData.persona_presets.working_professional;
    
    setTransport(preset.transport as TransitType);
    setCommuteDistance(preset.commute_distance);
    setElectricityBill(preset.electricity_bill);
    setAcUsage(preset.ac_usage);
    setFoodHabits(preset.food_habits as FoodHabits);
    setShoppingFrequency(preset.shopping_frequency as ShoppingFrequency);
    setFlightsPerYear(preset.flights_per_year);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      transport,
      commute_distance: Math.max(0, commuteDistance),
      electricity_bill: Math.max(0, electricityBill),
      ac_usage: Math.max(0, Math.min(24, acUsage)),
      food_habits: foodHabits,
      shopping_frequency: shoppingFrequency,
      flights_per_year: Math.max(0, flightsPerYear)
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-emerald-100 shadow-lg p-6 md:p-8 animate-fade-in" id="carbon-audit-root">
      {/* Back to selection */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-6 font-semibold cursor-pointer"
        id="audit-back-btn"
      >
        <ArrowLeft className="w-4 h-4" /> Change Persona Profile
      </button>

      {/* Title */}
      <h2 className="text-2xl font-black font-display text-slate-900 mb-2">
        Let's Customize Your Carbon Audit
      </h2>
      <p className="text-sm text-slate-500 mb-6 font-medium">
        Fill out the 3 sections to establish your lifestyle benchmark emissions. You can also quickly toggle presets below.
      </p>

      {/* Preset shortcut buttons */}
      <div className="flex gap-2 mb-8 p-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
        <button
          type="button"
          onClick={() => loadPreset("student_commuter")}
          className="flex-1 text-center py-2.5 text-xs font-bold font-sans rounded-lg transition bg-white text-slate-700 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50"
          id="load-student-preset"
        >
          Load Student Preset
        </button>
        <button
          type="button"
          onClick={() => loadPreset("working_professional")}
          className="flex-1 text-center py-2.5 text-xs font-bold font-sans rounded-lg transition bg-white text-slate-700 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50"
          id="load-pro-preset"
        >
          Load Working Pro Preset
        </button>
      </div>

      {/* Multi-step progress tracker */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((label, idx) => (
          <React.Fragment key={idx}>
            <button
              onClick={() => setActiveStep(idx)}
              className="flex flex-col items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-lg p-1 group cursor-pointer"
              aria-label={`Go to section ${label}`}
              aria-current={idx === activeStep ? "step" : undefined}
              id={`step-indicator-${idx}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition ${
                idx === activeStep 
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200" 
                  : idx < activeStep 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-250" 
                    : "bg-slate-100 text-slate-400 border-slate-200"
              }`}>
                {idx < activeStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-[11px] md:text-xs transition ${
                idx === activeStep ? "text-slate-900 font-extrabold" : "text-slate-400 group-hover:text-slate-600"
              }`}>
                {label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div className={`flex-grow h-0.5 mx-2 md:mx-4 ${idx < activeStep ? "bg-emerald-300" : "bg-slate-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* STEP 1: Commute & Travel */}
        {activeStep === 0 && (
          <div className="space-y-6 animate-fade-in" id="step-1-content">
            {/* Travel Mode Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 font-display mb-3">
                How do you mostly commute?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "bike", label: "Bike / Walk", icon: Bike, color: "hover:border-green-400 hover:text-green-500" },
                  { value: "bus", label: "Bus", icon: Bus, color: "hover:border-emerald-400 hover:text-emerald-500" },
                  { value: "metro", label: "Train/Metro", icon: Train, color: "hover:border-teal-400 hover:text-teal-500" },
                  { value: "car", label: "Personal Car", icon: Car, color: "hover:border-rose-400 hover:text-rose-500" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setTransport(item.value as TransitType)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition cursor-pointer min-h-[48px] ${
                        transport === item.value 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm font-black" 
                          : "bg-slate-50 border-slate-200 text-slate-500 " + item.color
                      }`}
                      aria-pressed={transport === item.value}
                      id={`transport-mode-${item.value}`}
                    >
                      <Icon className="w-6 h-6 mb-1.5" />
                      <span className="text-xs font-semibold font-sans">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commute Distance slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
                  Weekly commuting distance 
                  <span className="text-xs text-slate-400 font-sans font-normal">(km/week)</span>
                </label>
                <div className="text-emerald-700 font-mono font-bold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                  {commuteDistance} km
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={commuteDistance}
                onChange={(e) => setCommuteDistance(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 bg-slate-100 h-1.5 rounded-lg cursor-pointer animate-pulse"
                id="commute-distance-slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                <span>0 km</span>
                <span>150 km</span>
                <span>300 km+</span>
              </div>
            </div>

            {/* Flights per year */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-emerald-500" /> Flights taken annually
                </label>
                <div className="text-emerald-700 font-mono font-bold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                  {flightsPerYear} flights
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={flightsPerYear}
                onChange={(e) => setFlightsPerYear(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 bg-slate-100 h-1.5 rounded-lg cursor-pointer"
                id="flights-slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                <span>0 flights (Excellent)</span>
                <span>7 flights</span>
                <span>15 flights+</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Energy & Home */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-fade-in" id="step-2-content">
            {/* Electricity bill slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-500" /> Monthly electric bill
                </label>
                <div className="text-emerald-700 font-mono font-bold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                  ₹{electricityBill} /mo
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={electricityBill}
                onChange={(e) => setElectricityBill(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 bg-slate-100 h-1.5 rounded-lg cursor-pointer"
                id="electricity-slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                <span>₹0 (Off-grid/Solar)</span>
                <span>₹150</span>
                <span>₹300+</span>
              </div>
            </div>

            {/* AC usage slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-800 font-display">
                  Average Air Conditioning operating hours
                </label>
                <div className="text-emerald-700 font-mono font-bold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                  {acUsage} hours/day
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={acUsage}
                onChange={(e) => setAcUsage(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 bg-slate-100 h-1.5 rounded-lg cursor-pointer"
                id="ac-slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                <span>0 hours</span>
                <span>12 hours</span>
                <span>24 hours (Always On)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> AC uses significant compressor loads. Excellent reduction target.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Lifestyle Diet */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fade-in" id="step-3-content">
            {/* Food Habits Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 font-display mb-3">
                Your typical food/diet habits:
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: "vegetarian", label: "Vegetarian", desc: "No meat, mostly plant-based" },
                  { value: "mixed", label: "Mixed Diet", desc: "Balanced dairy, fish, poultry" },
                  { value: "non-vegetarian", label: "Heavy Meat", desc: "Heavy beef or red meats" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFoodHabits(item.value as FoodHabits)}
                    className={`flex flex-col text-left p-4 rounded-xl border transition cursor-pointer min-h-[48px] ${
                      foodHabits === item.value 
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm font-bold" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-250 hover:bg-emerald-50/20"
                    }`}
                    id={`food-habit-${item.value}`}
                    aria-pressed={foodHabits === item.value}
                  >
                    <span className="text-sm font-bold font-display mb-1">{item.label}</span>
                    <span className="text-[11px] text-slate-500 font-semibold font-sans leading-tight">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Online Shopping Frequency */}
            <div>
              <label className="block text-sm font-bold text-slate-800 font-display mb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-500" /> Online shopping delivery frequency:
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: "rarely", label: "Rarely / Low", desc: "Combine orders once a month" },
                  { value: "medium", label: "Medium", desc: "Weekly single drop deliveries" },
                  { value: "high", label: "High frequency", desc: "Multiple express drops weekly" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setShoppingFrequency(item.value as ShoppingFrequency)}
                    className={`flex flex-col text-left p-4 rounded-xl border transition cursor-pointer min-h-[48px] ${
                      shoppingFrequency === item.value 
                        ? "bg-emerald-50 border-emerald-400 text-emerald-850 shadow-sm font-bold" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-250 hover:bg-emerald-50/20"
                    }`}
                    id={`shopping-${item.value}`}
                    aria-pressed={shoppingFrequency === item.value}
                  >
                    <span className="text-sm font-bold font-display mb-1">{item.label}</span>
                    <span className="text-[11px] text-slate-500 font-semibold font-sans leading-tight">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit footer actions */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-8">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold font-sans transition flex items-center gap-2 border cursor-pointer border-slate-200 bg-white ${
              activeStep === 0 
                ? "opacity-40 cursor-not-allowed text-slate-400 bg-slate-50" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            id="prev-step-btn"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {activeStep < 2 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => prev + 1)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-sans rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-250/20 border-none"
              id="next-step-btn"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold font-sans rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-250/20"
              id="submit-audit-btn"
            >
              Submit Carbon Audit <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
