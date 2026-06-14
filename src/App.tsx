import React, { useState, useEffect } from "react";
import { Onboarding } from "./components/Onboarding";
import { CarbonAudit } from "./components/CarbonAudit";
import { CarbonProfileView } from "./components/CarbonProfileView";
import { DecisionEngineView } from "./components/DecisionEngineView";
import { ImpactSimulator } from "./components/ImpactSimulator";
import { WeeklyChallenge } from "./components/WeeklyChallenge";
import { AICoach } from "./components/AICoach";
import { TestDashboard } from "./components/TestDashboard";

import { CarbonAuditInput, CarbonProfile, PersonaKey } from "./types";
import { calculateEmissions } from "./utils/calculator";
import { getPrioritizedActions, RankedAction } from "./utils/decisionEngine";
import { researchData } from "./data/research_data";
import { Sparkles, Trophy, ShieldCheck, HelpCircle, Award, Terminal, Calculator, Play, Activity, Leaf } from "lucide-react";

export default function App() {
  const [persona, setPersona] = useState<PersonaKey | null>(null);
  const [auditInput, setAuditInput] = useState<CarbonAuditInput | null>(null);
  const [profile, setProfile] = useState<CarbonProfile | null>(null);
  const [committedIds, setCommittedIds] = useState<string[]>([]);
  const [activeState, setActiveState] = useState<number>(0); // 0 = Onboarding, 1 = Audit, 2 = Profile, 3 = Priorities, 4 = Simulator, 5 = Challenges, 6 = AI Coach, 7 = Tests

  // Load baseline profile on mount if saved in localStorage
  useEffect(() => {
    try {
      const savedInput = localStorage.getItem("carboncoach_audit_input");
      const savedCommitted = localStorage.getItem("carboncoach_committed_ids");
      const savedPersona = localStorage.getItem("carboncoach_persona");
      const savedState = localStorage.getItem("carboncoach_active_state");

      if (savedInput) {
        const parsed = JSON.parse(savedInput) as CarbonAuditInput;
        setAuditInput(parsed);
        setProfile(calculateEmissions(parsed));
      }
      if (savedCommitted) {
        setCommittedIds(JSON.parse(savedCommitted));
      }
      if (savedPersona) {
        setPersona(savedPersona as PersonaKey);
      }
      if (savedState) {
        setActiveState(Math.min(7, Math.max(0, parseInt(savedState) || 0)));
      }
    } catch (e) {
      console.warn("Could not pre-populate from localStorage:", e);
    }
  }, []);

  // Update localStorage when auditInput changes
  const saveAuditInput = (input: CarbonAuditInput) => {
    setAuditInput(input);
    const calculatedProfile = calculateEmissions(input);
    setProfile(calculatedProfile);
    localStorage.setItem("carboncoach_audit_input", JSON.stringify(input));
    localStorage.setItem("carboncoach_active_state", "2");
    setActiveState(2); // Jump to result profile
  };

  const handleSelectPersona = (key: PersonaKey) => {
    setPersona(key);
    localStorage.setItem("carboncoach_persona", key);
    
    // Choose starting presets
    let initialInput: CarbonAuditInput;
    if (key === "student_commuter") {
      initialInput = researchData.persona_presets.student_commuter as CarbonAuditInput;
    } else if (key === "working_professional") {
      initialInput = researchData.persona_presets.working_professional as CarbonAuditInput;
    } else if (key === "family_household") {
      initialInput = researchData.persona_presets.family_household as CarbonAuditInput;
    } else {
      initialInput = {
        transport: "car",
        commute_distance: 0,
        electricity_bill: 0,
        ac_usage: 0,
        food_habits: "mixed",
        shopping_frequency: "medium",
        flights_per_year: 0
      };
    }
    setAuditInput(initialInput);
    setActiveState(1); // Advancing state machine to State 1: Carbon Audit
    localStorage.setItem("carboncoach_active_state", "1");
  };

  const handleCommitToggle = (id: string) => {
    setCommittedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("carboncoach_committed_ids", JSON.stringify(next));
      return next;
    });
  };

  const handleClearToggles = () => {
    setCommittedIds([]);
    localStorage.removeItem("carboncoach_committed_ids");
  };

  const resetAll = () => {
    setPersona(null);
    setAuditInput(null);
    setProfile(null);
    setCommittedIds([]);
    setActiveState(0);
    localStorage.clear();
  };

  // Helper selectors
  const prioritizedActions: RankedAction[] = auditInput ? getPrioritizedActions(auditInput) : [];

  // Map state to human-readable screen sub-titles for visual feedback
  const getSubHeaderMessage = () => {
    switch (activeState) {
      case 2: return "State 2: Carbon Profile Benchmark";
      case 3: return "State 3: Decision Engine Optimal Recommendations";
      case 4: return "State 4: Live Interactive Impact Simulator";
      case 5: return "State 5: 7-Day Habit Formation Challenges";
      case 6: return "AI personal Carbon reduction Coach";
      case 7: return "Unit testing framework assertions runner";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-800 flex flex-col font-sans px-4 py-8" id="application-wrapper">
      
      {/* Visual Brand Navbar */}
      <header className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-emerald-100 mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <span
            className="p-2.5 bg-white text-emerald-600 rounded-xl border border-emerald-100 shadow-lg shadow-emerald-100 text-lg"
            aria-hidden="true"
          >
            🌳
          </span>
          <div>
            <h1 className="text-xl font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-1.5">
              CarbonCoach AI
            </h1>
            <p className="text-[10px] text-emerald-700 font-mono font-extrabold tracking-widest uppercase mt-0.5">
              {getSubHeaderMessage() || "State 0: Dynamic Profile Selection"}
            </p>
          </div>
        </div>

        {/* Global Action items */}
        {profile && (
          <button
            onClick={resetAll}
            className="text-xs bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            id="reset-overall-btn"
          >
            Start Fresh Reset
          </button>
        )}
      </header>

      {/* Main Orchestrator Body cards */}
      <main className="flex-grow w-full">
        {activeState === 0 && <Onboarding onSelectPersona={handleSelectPersona} />}
        
        {activeState === 1 && (
          <CarbonAudit
            initialInput={auditInput || undefined}
            onSubmit={saveAuditInput}
            onBack={() => {
              setActiveState(0);
              localStorage.setItem("activeState", "0");
            }}
          />
        )}

        {/* UNLOCKED FLOATING NAVIGATION RAIL FOR AUDITED PROFILES */}
        {profile && auditInput && activeState >= 2 && (
          <div className="space-y-6">
            
            {/* Nav Switch Tabs */}
            <div className="max-w-4xl mx-auto flex flex-wrap gap-2 p-1.5 bg-white/90 rounded-2xl border border-emerald-100 backdrop-blur shadow-sm" id="floating-navigation-rail">
              {[
                { state: 2, label: "Profile Composition", icon: Calculator },
                { state: 3, label: "Prioritized Actions", icon: Award },
                { state: 4, label: "Impact Simulator", icon: Activity },
                { state: 5, label: "Weekly Challenge", icon: Trophy },
                { state: 6, label: "AI Carbon Coach", icon: Sparkles },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeState === tab.state;
                return (
                  <button
                    key={tab.state}
                    onClick={() => {
                      setActiveState(tab.state);
                      localStorage.setItem("carboncoach_active_state", tab.state.toString());
                    }}
                    className={`flex-1 min-w-[130px] sm:min-w-0 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold font-sans tracking-wide transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
                      isSelected
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                    id={`rail-tab-btn-${tab.state}`}
                  >
                    <TabIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Category Screen Loader */}
            <div className="animate-fade-in">
              {activeState === 2 && (
                <CarbonProfileView
                  profile={profile}
                  transitMode={auditInput.transport}
                  onContinue={() => setActiveState(3)}
                  onRecalculate={() => setActiveState(1)}
                />
              )}

              {activeState === 3 && (
                <DecisionEngineView
                  actions={prioritizedActions}
                  committedIds={committedIds}
                  onCommitToggle={handleCommitToggle}
                  onGoToSimulator={() => setActiveState(4)}
                  persona={persona}
                  auditInput={auditInput}
                />
              )}

              {activeState === 4 && (
                <ImpactSimulator
                  initialProfile={profile}
                  actions={prioritizedActions}
                  committedIds={committedIds}
                  onCommitToggle={handleCommitToggle}
                  onClearToggles={handleClearToggles}
                />
              )}

              {activeState === 5 && <WeeklyChallenge />}

              {activeState === 6 && (
                <AICoach
                  auditInput={auditInput}
                  profile={profile}
                  actions={prioritizedActions}
                  committedIds={committedIds}
                />
              )}

              {activeState === 7 && <TestDashboard />}
            </div>
          </div>
        )}
      </main>

      {/* Ground truth credits footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-8 mt-12 border-t border-slate-100 text-[10px] text-slate-400 font-mono tracking-wider shrink-0 uppercase flex flex-col gap-2">
        <p className="font-bold text-slate-500">
          CarbonCoach AI • Real-time Decision Support Platform
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Privacy Focused</span>
          <span className="flex items-center gap-1.5"><Leaf className="w-3 h-3" /> Net Zero Target</span>
          <button 
            onClick={() => setActiveState(7)}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors p-1"
            title="Inspect Logic Assertions"
          >
            <Terminal className="w-3 h-3" /> Dev Tools
          </button>
        </div>
      </footer>
    </div>
  );
}
