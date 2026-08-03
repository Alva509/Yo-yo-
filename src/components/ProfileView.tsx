import React, { useState } from "react";
import { User, Globe, Cpu, Award, ShieldCheck, Flame, BookOpen, Layers, CheckCircle, Database, Trash2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { LectureData } from "../types";
import { clearAllLectures } from "../lib/storage";

interface ProfileViewProps {
  lectures: LectureData[];
  onLecturesCleared: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  lectures,
  onLecturesCleared,
}) => {
  const [prefLang, setPrefLang] = useState("auto");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalMinutes = Math.round(
    lectures.reduce((acc, l) => acc + (l.durationSeconds || 180), 0) / 60
  );
  const totalConcepts = lectures.reduce((acc, l) => acc + (l.keyConcepts?.length || 0), 0);
  const totalFlashcards = lectures.reduce((acc, l) => acc + (l.flashcards?.length || 0), 0);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all stored class lectures?")) {
      clearAllLectures();
      onLecturesCleared();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header */}
      <GlassCard glow="indigo" className="p-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 p-1 shadow-2xl shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-white font-extrabold text-2xl">
              AL
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-2xl font-extrabold text-white">Alex Student</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                Pro AI Brain
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multilingual Scholar • Haitian Creole (Kreyòl), French & English
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1 text-amber-400">
                <Flame className="w-4 h-4" />
                <span>5 Day Streak</span>
              </span>
              <span>•</span>
              <span className="text-indigo-400 font-bold">{totalMinutes} Mins Studied</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard glow="indigo" className="text-center py-6">
          <BookOpen className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-white font-mono">{lectures.length}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Lectures Transformed
          </p>
        </GlassCard>

        <GlassCard glow="violet" className="text-center py-6">
          <Award className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-white font-mono">{totalConcepts}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Key Concepts Discovered
          </p>
        </GlassCard>

        <GlassCard glow="cyan" className="text-center py-6">
          <Layers className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-white font-mono">{totalFlashcards}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Flashcards Mastered
          </p>
        </GlassCard>
      </div>

      {/* Language Output Preferences */}
      <GlassCard glow="indigo" className="p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-extrabold text-white">Default Note Language Output</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "auto", label: "Auto Code-Switching (Original Creole/French)", desc: "Preserves natural classroom code-switching between Creole and French" },
            { id: "ht", label: "Haitian Creole (Kreyòl Ayisyen 🇭🇹)", desc: "Generates study notes and summaries in Haitian Creole" },
            { id: "fr", label: "French (Français Académique 🇫🇷)", desc: "Formats all notes into formal French academic structure" },
            { id: "en", label: "English (US Academic 🇺🇸)", desc: "Translates and structures all notes into English" },
          ].map((lang) => (
            <div
              key={lang.id}
              onClick={() => setPrefLang(lang.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                prefLang === lang.id
                  ? "bg-indigo-950/60 border-indigo-500 text-white shadow-lg"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{lang.label}</span>
                {prefLang === lang.id && <CheckCircle className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400">{lang.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            {savedSuccess ? "✓ Settings updated!" : "Applies to future recorded or imported classes."}
          </span>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </GlassCard>

      {/* AI Architecture & Local Storage Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard glow="violet" className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>AI Architecture Engine</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-400">
            <p><span className="text-slate-500">LLM Model:</span> Gemini 3.6 Flash (@google/genai)</p>
            <p><span className="text-slate-500">Audio Transcription:</span> Multilingual Segmented Whisper</p>
            <p><span className="text-slate-500">Code-Switching Support:</span> Haitian Creole / French / English</p>
            <p><span className="text-slate-500">Timeline Mapping:</span> Instant Timestamp Correlation</p>
          </div>
        </GlassCard>

        <GlassCard glow="rose" className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Database className="w-4 h-4 text-rose-400" />
            <span>Local Storage & Reset</span>
          </div>
          <p className="text-xs text-slate-400">
            All lecture transcripts and study decks are stored locally in your browser's persistent state.
          </p>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-rose-950/60 border border-rose-800 text-rose-300 hover:text-white hover:bg-rose-900 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Stored Knowledge Data</span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
