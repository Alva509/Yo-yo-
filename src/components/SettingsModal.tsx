import React, { useState } from "react";
import { Settings, Globe, Cpu, CheckCircle2, ShieldCheck, Sparkles, Brain } from "lucide-react";

export const SettingsModal: React.FC = () => {
  const [prefLang, setPrefLang] = useState("auto");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">App & AI Engine Preferences</h2>
            <p className="text-xs text-slate-400">
              Configure multilingual educational settings and AI study parameters.
            </p>
          </div>
        </div>

        {/* Language Preference */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Default Note Language Output</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "auto", label: "Auto Code-Switching (Preserve Original)", desc: "Maintains natural Haitian Creole + French vocabulary" },
              { id: "ht", label: "Haitian Creole (Kreyòl Ayisyen 🇭🇹)", desc: "Generates explanations and summaries in Creole" },
              { id: "fr", label: "French (Français Academic 🇫🇷)", desc: "Generates formal French academic notes" },
              { id: "en", label: "English (US Academic 🇺🇸)", desc: "Translates and structures all notes into English" },
            ].map((lang) => (
              <div
                key={lang.id}
                onClick={() => setPrefLang(lang.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  prefLang === lang.id
                    ? "bg-indigo-950/60 border-indigo-500 text-white shadow-lg"
                    : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{lang.label}</span>
                  {prefLang === lang.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400">{lang.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Engine Status Info */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>AI Model Architecture</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-500">Intelligence Layer:</span>
              <p className="text-slate-200 font-bold mt-0.5">Gemini 3.6 Flash (@google/genai)</p>
            </div>
            <div>
              <span className="text-slate-500">Speech-to-Text:</span>
              <p className="text-slate-200 font-bold mt-0.5">Multilingual Segmented Whisper / Gemini</p>
            </div>
            <div>
              <span className="text-slate-500">Audio Segmentation:</span>
              <p className="text-slate-200 font-bold mt-0.5">Automatic 10-Minute Chunks</p>
            </div>
            <div>
              <span className="text-slate-500">Local Persistence:</span>
              <p className="text-slate-200 font-bold mt-0.5">IndexedDB & Browser Cache</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            {savedSuccess ? "✓ Preferences updated!" : "Changes take effect on your next recorded class."}
          </span>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
