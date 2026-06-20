import { useState, useEffect } from "react";
import { CarbonAuditInput, CarbonProfile, PersonaKey } from "../types";
import { calculateEmissions } from "../utils/calculator";
import { STORAGE_KEYS } from "../constants/storage";
import { researchData } from "../data/research_data";

export function useAppState() {
  const [persona, setPersona] = useState<PersonaKey | null>(null);
  const [auditInput, setAuditInput] = useState<CarbonAuditInput | null>(null);
  const [profile, setProfile] = useState<CarbonProfile | null>(null);
  const [committedIds, setCommittedIds] = useState<string[]>([]);
  const [activeState, setActiveState] = useState<number>(0); // 0 = Onboarding, 1 = Audit, 2 = Profile, 3 = Priorities, 4 = Simulator, 5 = Challenges, 6 = AI Coach

  // Load baseline profile on mount if saved in localStorage
  useEffect(() => {
    try {
      const savedInput = localStorage.getItem(STORAGE_KEYS.AUDIT_INPUT);
      const savedCommitted = localStorage.getItem(STORAGE_KEYS.COMMITTED_IDS);
      const savedPersona = localStorage.getItem(STORAGE_KEYS.PERSONA);
      const savedState = localStorage.getItem(STORAGE_KEYS.ACTIVE_STATE);

      if (savedInput) {
        const parsed = JSON.parse(savedInput);
        if (parsed && typeof parsed === 'object') {
          setAuditInput(parsed as CarbonAuditInput);
          setProfile(calculateEmissions(parsed as CarbonAuditInput));
        }
      }
      if (savedCommitted) {
        const parsedCommitted = JSON.parse(savedCommitted);
        setCommittedIds(Array.isArray(parsedCommitted) ? parsedCommitted : []);
      }
      if (savedPersona) {
        const validPersonas = ["student_commuter", "working_professional", "family_household", "custom"];
        if (validPersonas.includes(savedPersona)) {
          setPersona(savedPersona as PersonaKey);
        }
      }
      if (savedState) {
        setActiveState(Math.min(6, Math.max(0, parseInt(savedState) || 0)));
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
    localStorage.setItem(STORAGE_KEYS.AUDIT_INPUT, JSON.stringify(input));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STATE, "2");
    setActiveState(2); // Jump to result profile
  };

  const handleSelectPersona = (key: PersonaKey) => {
    setPersona(key);
    localStorage.setItem(STORAGE_KEYS.PERSONA, key);

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
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STATE, "1");
  };

  const handleCommitToggle = (id: string) => {
    setCommittedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEYS.COMMITTED_IDS, JSON.stringify(next));
      return next;
    });
  };

  const handleClearToggles = () => {
    setCommittedIds([]);
    localStorage.removeItem(STORAGE_KEYS.COMMITTED_IDS);
  };

  const resetAll = () => {
    setPersona(null);
    setAuditInput(null);
    setProfile(null);
    setCommittedIds([]);
    setActiveState(0);
    localStorage.clear();
  };

  return {
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
  };
}
