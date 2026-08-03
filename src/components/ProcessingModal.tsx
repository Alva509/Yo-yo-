import React, { useEffect, useState } from "react";
import { Sparkles, Brain, CheckCircle2, Loader2, Globe, Cpu } from "lucide-react";

interface ProcessingModalProps {
  isOpen: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCloseError?: () => void;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  error,
  onRetry,
  onCloseError,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Combining Audio Segments", desc: "Optimizing classroom acoustic audio quality..." },
    { title: "Multilingual Intelligence", desc: "Recognizing Haitian Creole, French & English code-switching..." },
    { title: "Chapter & Timeline Detection", desc: "Structuring logical sections & marking exam probability points..." },
    { title: "Generating Study Material", desc: "Writing Notion-style organized notes & flashcard decks..." },
  ];

  useEffect(() => {
    if (!isOpen || error) return;
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {error ? (
          /* Error State */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lecture Transformation Warning</h3>
            <p className="text-sm text-slate-300 mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-left">
              {error}
            </p>
            <div className="flex items-center justify-center space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all"
                >
                  Retry AI Generation
                </button>
              )}
              {onCloseError && (
                <button
                  onClick={onCloseError}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm transition-all"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Processing State */
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Transforming Classroom Lecture
                </h3>
                <p className="text-xs text-indigo-300 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gemini Multilingual Academic Intelligence</span>
                </p>
              </div>
            </div>

            {/* Progress Step List */}
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => {
                const isDone = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isDone
                        ? "bg-slate-950/80 border-slate-800 text-slate-300"
                        : isCurrent
                        ? "bg-indigo-950/40 border-indigo-500/50 text-white shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/30 border-slate-800/40 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent ? "text-indigo-200" : isDone ? "text-slate-200" : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-xs text-slate-400 italic">
              "Relax and breathe. Your complete second brain is forming."
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
