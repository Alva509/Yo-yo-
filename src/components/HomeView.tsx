import React from "react";
import { Sparkles, BookOpen, Brain, Zap, Clock, ShieldCheck, Flame, ArrowRight, Layers, Award } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { OrbButton } from "./OrbButton";
import { LectureData } from "../types";

interface HomeViewProps {
  lectures: LectureData[];
  onStartCapture: () => void;
  onSelectLecture: (lecture: LectureData) => void;
  onOpenIntelligence: () => void;
  onOpenLibrary: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lectures,
  onStartCapture,
  onSelectLecture,
  onOpenIntelligence,
  onOpenLibrary,
}) => {
  const totalDurationMinutes = Math.round(
    lectures.reduce((acc, l) => acc + (l.durationSeconds || 180), 0) / 60
  );
  const totalConcepts = lectures.reduce((acc, l) => acc + (l.keyConcepts?.length || 0), 0);
  const totalFlashcards = lectures.reduce((acc, l) => acc + (l.flashcards?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Cinematic Command Center Header */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        {/* Background ambient light effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personal AI Learning System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200">Alex</span>.
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-300">
              Your knowledge is growing.
            </p>

            {/* Dynamic Intelligence Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-bold">{lectures.length}</span>
                <span>lectures transformed into knowledge</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold">5 Day Streak</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 font-bold">{totalConcepts} Concepts Pinned</span>
              </div>
            </div>
          </div>

          {/* Quick AI Action Card */}
          <GlassCard
            glow="violet"
            onClick={onOpenIntelligence}
            className="w-full md:w-80 shrink-0 border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900/60"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                <span>AI Second Brain</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                Active
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Cross-Lecture Query</h3>
            <p className="text-xs text-slate-400 mb-4">
              Ask questions across all recorded courses or generate multi-subject exams instantly.
            </p>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 group-hover:text-white transition-colors">
              <span>Launch Intelligence Layer</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Hero Action: Iconic Breathing Orb Interaction */}
      <GlassCard glow="indigo" className="text-center py-10 px-6 border-indigo-500/20 bg-slate-900/50">
        <OrbButton
          onClick={onStartCapture}
          label="CAPTURE LIVE LECTURE NOW"
          sublabel="Real-time Creole, French & English transcription • Auto-segmentation & Key Moments"
        />
      </GlassCard>

      {/* Recent Knowledge Objects Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Recent Knowledge Objects</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Lectures transformed into interactive study decks and timeline markers.
            </p>
          </div>

          <button
            onClick={onOpenLibrary}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View All Knowledge ({lectures.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {lectures.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate-400 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Your Knowledge Library is empty</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Record your first live class or import sample notes to generate your personal study deck.
            </p>
            <button
              onClick={onStartCapture}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
            >
              Start Recording Class
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.slice(0, 3).map((lecture) => (
              <GlassCard
                key={lecture.id}
                glow="indigo"
                onClick={() => onSelectLecture(lecture)}
                className="flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                      {lecture.subject}
                    </span>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{Math.round((lecture.durationSeconds || 180) / 60)} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-white line-clamp-2 hover:text-indigo-300 transition-colors">
                    {lecture.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {lecture.summary?.shortSummary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {lecture.detectedLanguages?.map((lang, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1" title="Concepts">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lecture.keyConcepts?.length || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Flashcards">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lecture.flashcards?.length || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Quiz">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lecture.quizQuestions?.length || 0}</span>
                    </span>
                  </div>

                  <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform flex items-center">
                    Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
