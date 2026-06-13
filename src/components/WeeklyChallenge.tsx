import React, { useState } from "react";
import { researchData } from "../constants/researchData";
import { Award, Flame, CheckCircle, Circle, Trophy, ArrowRight, BookOpen } from "lucide-react";

export const WeeklyChallenge: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("carboncoach_weekly_completed_days");
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });
  const [showReward, setShowReward] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("carboncoach_weekly_completed_days");
      return saved ? JSON.parse(saved).length === 7 : false;
    } catch {
      return false;
    }
  });

  const toggleDay = (day: number) => {
    setCompletedDays(prev => {
      let next;
      if (prev.includes(day)) {
        next = prev.filter(d => d !== day);
      } else {
        next = [...prev, day].sort((a, b) => a - b);
      }

      // Check if they completed all 7 days for the reward!
      if (next.length === 7) {
        setShowReward(true);
      } else {
        setShowReward(false);
      }

      try {
        localStorage.setItem("carboncoach_weekly_completed_days", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }

      return next;
    });
  };

  const calculateStreak = () => {
    // A quick linear streak solver
    let count = 0;
    for (let d = 1; d <= 7; d++) {
      if (completedDays.includes(d)) {
        count++;
      } else {
        break; // break immediately for sequential streak
      }
    }
    return count;
  };

  const getChallengeFinancialSaving = (day: number, savingKg: number): number => {
    switch (day) {
      case 1: return Math.round(savingKg * 10); // transport multiplier
      case 2: return Math.round(savingKg * 15); // energy multiplier
      case 3: return Math.round(savingKg * 8);  // food multiplier
      case 4: return Math.round(savingKg * 15); // energy multiplier
      case 5: return Math.round(savingKg * 8);  // food multiplier
      case 6: return Math.round(savingKg * 15); // energy multiplier
      default: return Math.round(savingKg * 15); // energy multiplier (LED audit etc.)
    }
  };

  const streak = calculateStreak();
  const totalSavedKg = completedDays.reduce((sum, d) => {
    const matched = researchData.weekly_challenges.find(c => c.day === d);
    return sum + (matched?.saving_kg || 0);
  }, 0);

  const totalSavedRs = completedDays.reduce((sum, d) => {
    const matched = researchData.weekly_challenges.find(c => c.day === d);
    if (!matched) return sum;
    return sum + getChallengeFinancialSaving(d, matched.saving_kg);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 animate-fade-in" id="weekly-challenge-root">
      {/* Visual Header Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        
        {/* Streak card */}
        <div className="bg-orange-50/60 border border-orange-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-bold font-mono block uppercase">Active streak</span>
            <span className="text-2xl font-black font-display text-orange-600 flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-orange-500 text-orange-500" /> {streak} Day Streak
            </span>
          </div>
          <span className="text-[10px] font-mono bg-orange-100/60 text-orange-700 font-black px-2.5 py-1 rounded-full uppercase">
            🔥 Burning Carbon
          </span>
        </div>

        {/* Progress bar card */}
        <div className="bg-white border border-emerald-100 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold mb-1.5">
            <span>CHALLENGE SCHEDULE</span>
            <span className="font-mono font-black text-emerald-600">{completedDays.length} / 7 Days Done</span>
          </div>
          
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
               className="h-full bg-emerald-500 rounded-full transition-all duration-700"
               style={{ width: `${(completedDays.length / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Total challenge savings card */}
        <div className="bg-white border border-emerald-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-mono block uppercase font-bold">Challenge Savings</span>
            <span className="text-lg font-black font-mono text-teal-600 block">
              -{totalSavedKg.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">kg CO₂</span>
            </span>
            <span className="text-xs font-bold font-mono text-teal-600 block">
              Saves ₹{totalSavedRs.toFixed(1)}
            </span>
          </div>
          <span className="p-2 bg-teal-50 text-teal-600 rounded-xl border border-teal-100">
            <Award className="w-5 h-5" />
          </span>
        </div>
      </div>

      {showReward && (
        <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-sm animate-fade-in" id="reward-banner">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-black text-slate-900 font-display">
            Congratulations! Perfect 7/7 Eco Mastery achieved! 🎉
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1.5 font-sans font-medium leading-relaxed">
            You successfully simulated a complete lifestyle emission reduction week. Take these habits straight into your real carbon reduction journey!
          </p>
        </div>
      )}

      {/* 7 Day Checklist Grid */}
      <h3 className="text-md font-black font-display text-slate-900 mb-4">
        Your 7-Day Carbon Reduction Playbook
      </h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {researchData.weekly_challenges.map((item) => {
          const isDone = completedDays.includes(item.day);
          return (
            <button
              key={item.day}
              onClick={() => toggleDay(item.day)}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[12rem] focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm ${
                isDone
                  ? "bg-emerald-50 border-emerald-300 text-slate-900"
                  : "bg-white border-emerald-100 text-slate-700 hover:border-emerald-250 hover:bg-slate-50/30"
              }`}
              id={`challenge-day-${item.day}`}
              aria-pressed={isDone}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-md ${
                    isDone ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-205"
                  }`}>
                    Day {item.day}
                  </span>
                  <span>
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-200 flex-shrink-0" />
                    )}
                  </span>
                </div>
                <h4 className="text-sm font-bold font-display leading-tight mb-2 text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 font-sans font-medium leading-relaxed flex-grow">
                  {item.action}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">
                    Daily Saving
                  </span>
                  <span className="font-extrabold font-mono text-emerald-600 block text-[11px]">
                    -{item.saving_kg} kg CO₂
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">
                    Cash Saved
                  </span>
                  <span className="font-extrabold font-mono text-teal-600 block text-[11px]">
                    ₹{getChallengeFinancialSaving(item.day, item.saving_kg)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
