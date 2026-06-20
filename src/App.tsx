import React from "react";
import { Onboarding } from "./components/Onboarding";
import { CarbonAudit } from "./components/CarbonAudit";
import { CarbonProfileView } from "./components/CarbonProfileView";
import { DecisionEngineView } from "./components/DecisionEngineView";
import { ImpactSimulator } from "./components/ImpactSimulator";
import { WeeklyChallenge } from "./components/WeeklyChallenge";
import { AICoach } from "./components/AICoach";

import { STORAGE_KEYS } from "./constants/storage";
import { getPrioritizedActions, RankedAction } from "./utils/decisionEngine";
import { Sparkles, Trophy, ShieldCheck, HelpCircle, Award, Calculator, Play, Activity, Leaf } from "lucide-react";
import { getSubHeaderMessage } from "./utils/ui/formatters";
import { useAppState } from "./hooks/useAppState";
import { researchData } from "./data/research_data";

export default function App() {
  const {
    persona,
    auditInput,
    profile,
    committedIds,
    activeState,
    setActiveState,
    saveAuditInput,
    handleSelectPersona,
    handleCommitToggle,
    handleClearToggles,
    resetAll
  } = useAppState();

  // Helper selectors
  const prioritizedActions: RankedAction[] = auditInput ? getPrioritizedActions(auditInput) : [];

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
              {getSubHeaderMessage(activeState) || "State 0: Dynamic Profile Selection"}
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
              localStorage.setItem(STORAGE_KEYS.LEGACY_ACTIVE_STATE, "0");
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
                      localStorage.setItem(STORAGE_KEYS.ACTIVE_STATE, tab.state.toString());
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
        </div>
      </footer>
    </div>
  );
}
