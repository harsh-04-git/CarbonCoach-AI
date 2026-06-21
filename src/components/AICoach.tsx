import React, { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import { CarbonAuditInput, CarbonProfile } from "../types";
import { RankedAction } from "../utils/decisionEngine";
import { STORAGE_KEYS } from "../constants/storage";
import {
  Send,
  Sparkles,
  MessageSquare,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { isValidCompletedDays } from "../utils/validation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AICoachProps {
  auditInput: CarbonAuditInput;
  profile: CarbonProfile;
  actions: RankedAction[];
  committedIds: string[];
}

export const AICoach: React.FC<AICoachProps> = ({
  auditInput,
  profile,
  actions,
  committedIds,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Namaste! I am CarbonCoach AI, your personalized lifestyle carbon advisor.

Based on your profile, your Carbon Score is **${profile.carbonScore}/100** and your habits release about **${profile.annualEmissions} Tons of CO₂ annually** (the Paris Agreement sustainable target is under **2.0 Tons**).

Your major carbon category is **${Object.entries(profile.breakdown)
        .reduce((max, curr) => (curr[1] > max[1] ? curr : max), ["", 0])[0]
        .toUpperCase()}**.

Ask me any question about reducing utility bills, optimizing commute, drying clothes naturally, or switching ceiling fans dynamically instead of power-hungry ACs! What should we optimize today?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userMsg: Message = { role: "user", content: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditInput,
          profile,
          actions,
          messages: [...messages, userMsg],
          committedIds,
          persona: localStorage.getItem(STORAGE_KEYS.PERSONA) || "custom",
          completedDays: (() => {
            try {
              const saved = localStorage.getItem(
                STORAGE_KEYS.WEEKLY_COMPLETED_DAYS
              );
              if (saved) {
                const parsed = JSON.parse(saved);
                if (isValidCompletedDays(parsed)) {
                  return parsed;
                }
              }
              return [1];
            } catch {
              return [1];
            }
          })(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Failed to contact CarbonCoach on server. Details: ${data.error || "Unknown server issue"}. Feel free to ask again.`,
          },
        ]);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error communicating with carbon coach: ${errorMessage}. Quick estimate: Try toggling 'Reduce AC hours' which saves up to ₹1,800/year!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleQuickQuestion = (qn: string) => {
    handleSendMessage(qn);
  };

  const quickQuestionsByPersona = [
    "What are the 3 lowest-cost ways to increase my score in India?",
    "Explain my category breakdown. Is it good or bad compared to Indian averages?",
    "How can I convince my Indian household to switch off vampire power at socket switches?",
    "How do I cycle short distances safely or use local metro/BRTS?",
  ];

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-4 animate-fade-in"
      id="ai-coach-root"
    >
      <div className="grid md:grid-cols-12 gap-6 items-stretch">
        {/* Left column: Coach Details / Quick triggers */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-md font-black font-display text-slate-900">
                Coaching Guidelines
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-sans font-medium leading-relaxed mb-6">
              AI recommendations are cross-referenced with your custom audit.
              Ask the coach how to dry clothes naturally, substitute flights, or
              find easy, free carbon adjustments.
            </p>

            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Coach Triggers
            </h4>
            <div className="space-y-2">
              {quickQuestionsByPersona.map((qn, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(qn)}
                  className="w-full text-left text-xs bg-slate-50 hover:bg-emerald-50/30 border border-slate-150 hover:border-emerald-300 p-2.5 rounded-xl transition duration-200 text-slate-705 hover:text-slate-950 leading-snug cursor-pointer flex items-center justify-between group font-medium"
                  id={`quick-qn-${i}`}
                >
                  <span className="font-sans pr-2">{qn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center mt-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold font-sans">
              Powered by{" "}
              <span className="font-bold text-emerald-600">
                Gemini 3.5 Flash
              </span>{" "}
              on Server
            </span>
          </div>
        </div>

        {/* Right column: Chat box */}
        <div
          className="md:col-span-8 bg-white rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-[500px] overflow-hidden"
          id="chat-stage"
        >
          {/* Chat header */}
          <div className="p-4 border-b border-slate-100 bg-emerald-50/30 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-black text-slate-900 font-display">
              CarbonCoach AI Interactive Studio
            </span>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-grow overflow-y-auto p-4 space-y-4"
            id="messages-container"
          >
            {messages.map((m, idx) => {
              const isCoach = m.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex ${isCoach ? "justify-start" : "justify-end"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isCoach
                        ? "bg-slate-50 text-slate-800 border border-slate-150 border-l-4 border-l-emerald-500 rounded-tl-none font-sans font-medium shadow-sm transition-all"
                        : "bg-emerald-600 text-white font-bold rounded-tr-none font-sans shadow-md"
                    }`}
                    id={`message-bubble-${idx}`}
                  >
                    {/* Render message with ReactMarkdown for Coach */}
                    <div
                      className={`markdown-content ${isCoach ? "text-slate-800" : "text-white"}`}
                    >
                      <ReactMarkdown>
                        {DOMPurify.sanitize(m.content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2.5 text-xs text-emerald-800 font-mono font-bold uppercase tracking-wider">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />{" "}
                  Coach is analyzing profile...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form Input */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              disabled={loading}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about saving energy bills, diet alternative, etc."
              className="flex-grow bg-white text-slate-900 rounded-xl px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400 disabled:opacity-50 font-sans font-medium"
              id="chat-input"
              aria-label="Ask CarbonCoach AI a question"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-650 disabled:bg-slate-200 text-white font-extrabold rounded-xl transition cursor-disabled flex items-center justify-center flex-shrink-0 cursor-pointer disabled:cursor-not-allowed border-none shadow-sm shadow-emerald-250"
              id="chat-send-btn"
              aria-label="Send message to CarbonCoach AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
