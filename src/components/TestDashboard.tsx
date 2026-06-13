import React, { useState } from "react";
import { runAllUnitTests, TestCaseResult } from "../tests";
import { ShieldCheck, Play, ArrowRight, Check, X, AlertOctagon, RefreshCw } from "lucide-react";

export const TestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const executeTests = () => {
    setIsRunning(true);
    setTestResults([]);

    setTimeout(() => {
      const results = runAllUnitTests();
      setTestResults(results);
      setIsRunning(false);
    }, 450); // slight smooth delay for delightful UX
  };

  const testsPassedCount = testResults.filter(r => r.passed).length;
  const totalTestsCount = testResults.length;
  const pctPassing = totalTestsCount > 0 ? (testsPassedCount / totalTestsCount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 animate-fade-in" id="unit-testing-root">
      
      {/* Header and trigger */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm mb-6">
        <div className="flex-grow">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-md font-black font-display text-slate-900">
              In-App Unit Verification Dashboard
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans font-medium max-w-xl leading-relaxed">
            Verify emission calculations, decision algorithms, and simulator models. Executes our TypeScript unit tests live in your browser sandbox without requiring CLI packages or terminal access.
          </p>
        </div>

        <button
          onClick={executeTests}
          disabled={isRunning}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-650 disabled:bg-slate-200 text-white font-extrabold font-sans rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed border-none shadow-md shadow-emerald-250 shrink-0 self-stretch md:self-auto text-center"
          id="run-tests-btn"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Executing assertions...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" /> Run 5 Unit Tests <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {totalTestsCount > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Progress summary banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs text-emerald-700 font-mono block uppercase font-black">Verification status metrics</span>
              <h4 className="text-base font-black text-slate-940 font-display">
                {testsPassedCount === totalTestsCount ? "🏆 All Code Assertions Passed Perfectly!" : `${testsPassedCount} of ${totalTestsCount} Tests Cleared`}
              </h4>
            </div>
            
            {/* Minimal Circular / Percent Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-150 shadow-sm">
                {pctPassing.toFixed(0)}% passing
              </span>
            </div>
          </div>

          {/* Test Case Breakdown lists */}
          <div className="space-y-3">
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`bg-white border rounded-2xl p-4 flex items-start gap-3.5 transition shadow-sm ${
                  result.passed ? "border-emerald-150" : "border-rose-150"
                }`}
                id={`test-case-${idx}`}
              >
                <span className={`p-1.5 rounded-xl shrink-0 ${
                  result.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {result.passed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </span>

                <div className="flex-grow">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-1.5">
                    <div>
                      <span className="p-1 font-mono text-[9px] font-bold tracking-widest uppercase text-slate-500 bg-slate-100 border border-slate-200 rounded-md mr-2">
                        {result.suiteName}
                      </span>
                      <h5 className="text-xs md:text-sm font-bold text-slate-900 font-display inline">
                        {result.testName}
                      </h5>
                    </div>
                    <span className={`text-[10px] font-mono font-black ${
                      result.passed ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {result.passed ? "PASSED" : "FAILED"}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5 font-bold">Expected outcome</span>
                      <span className="text-[#334155] text-[11px] font-semibold">{result.expected}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5 font-bold">Actual return</span>
                      <span className="text-emerald-700 text-[11px] font-bold">{result.actual}</span>
                    </div>
                  </div>

                  {result.error && (
                    <div className="mt-2 p-2 bg-rose-50 border border-rose-100 rounded-md text-rose-700 font-mono text-xs flex items-center gap-1.5 leading-snug">
                      <AlertOctagon className="w-4 h-4 flex-shrink-0" /> Error message: {result.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
