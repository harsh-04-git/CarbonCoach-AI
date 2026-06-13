import React from "react";
import { PersonaKey } from "../types";
import { researchData } from "../data/research_data";
import { Shield, Sparkles, Award, User, ArrowRight, Home } from "lucide-react";

interface OnboardingProps {
  onSelectPersona: (key: PersonaKey) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onSelectPersona }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in" id="onboarding-root">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4 text-emerald-600" /> AI Carbon &amp; Utility Bill Savings Active
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-4">
          🌱 CarbonCoach AI
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Most carbon calculators stop at numbers. CarbonCoach AI helps you make practical, low-cost lifestyle decisions that maximize your carbon reduction with minimal effort.
        </p>
      </div>

      {/* Decision Engine Profile Selection */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 text-center mb-6 font-display">
          First, Choose Your Carbon Persona Profile
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Student Commuter */}
          <button
            onClick={() => onSelectPersona("student_commuter")}
            className="flex flex-col text-left p-6 bg-white rounded-3xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/40 transition-all duration-300 shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[11rem]"
            aria-label="Select Student Commuter Persona Profile"
            id="persona-student-btn"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Award className="w-6 h-6" />
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-150">
                Primary Target
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1 group-hover:text-emerald-600 transition-colors">
              Student Commuter
            </h3>
            <p className="text-xs text-slate-500 flex-grow font-sans mb-4 leading-relaxed">
              {researchData.persona_presets.student_commuter.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 mt-2">
              Quick Select <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Working Professional */}
          <button
            onClick={() => onSelectPersona("working_professional")}
            className="flex flex-col text-left p-6 bg-white rounded-3xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/40 transition-all duration-300 shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[11rem]"
            aria-label="Select Working Professional Persona Profile"
            id="persona-professional-btn"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <span className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <User className="w-6 h-6" />
              </span>
              <span className="text-xs bg-teal-50 text-teal-800 font-mono font-bold px-2.5 py-1 rounded-full border border-teal-150">
                Secondary Target
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1 group-hover:text-teal-600 transition-colors">
              Working Professional
            </h3>
            <p className="text-xs text-slate-500 flex-grow font-sans mb-4 leading-relaxed">
              {researchData.persona_presets.working_professional.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-600 mt-2">
              Quick Select <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Family Household */}
          <button
            onClick={() => onSelectPersona("family_household")}
            className="flex flex-col text-left p-6 bg-white rounded-3xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/40 transition-all duration-300 shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[11rem]"
            aria-label="Select Family Household Persona Profile"
            id="persona-family-btn"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <span className="p-3 bg-amber-50 text-amber-650 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <Home className="w-6 h-6 text-amber-600 group-hover:text-white" />
              </span>
              <span className="text-xs bg-amber-50 text-amber-800 font-mono font-bold px-2.5 py-1 rounded-full border border-amber-150">
                Family Target
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1 group-hover:text-amber-600 transition-colors">
              Family Household
            </h3>
            <p className="text-xs text-slate-500 flex-grow font-sans mb-4 leading-relaxed">
              {researchData.persona_presets.family_household?.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 mt-2">
              Quick Select <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onSelectPersona("custom")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-semibold underline cursor-pointer"
            id="custom-init-btn"
          >
            Or start with a blank custom profile
          </button>
        </div>
      </div>

      {/* Trust & Ground Facts */}
      <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-emerald-100 text-center">
        <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-50/50">
          <div className="flex justify-center mb-2 text-emerald-600 font-mono text-xl font-black">100%</div>
          <div className="text-sm font-bold text-slate-900 font-display">Deterministic Math</div>
          <div className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">All emissions math is grounded on verified data keys instead of LLM reasoning.</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-50/50">
          <div className="flex justify-center mb-2 text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-slate-900 font-display">Safe & Secure</div>
          <div className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">No private data leaves your device. Built with strict input sanitization.</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-50/50">
          <div className="flex justify-center mb-2 text-emerald-600 font-mono text-xl font-black">10x</div>
          <div className="text-sm font-bold text-slate-900 font-display">Lite Footprint</div>
          <div className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">Ultra lightweight under 10MB runtime with CSS layouts.</div>
        </div>
      </div>
    </div>
  );
};
