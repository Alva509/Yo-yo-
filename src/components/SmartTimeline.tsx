import React, { useState } from "react";
import { Play, Star, Target, BookOpen, Clock, AlertCircle, ChevronRight, Bookmark } from "lucide-react";
import { Chapter, AudioMarker } from "../types";

interface SmartTimelineProps {
  durationSeconds: number;
  chapters: Chapter[];
  markers: AudioMarker[];
  onSeek?: (seconds: number) => void;
  activeTime?: number;
}

export const SmartTimeline: React.FC<SmartTimelineProps> = ({
  durationSeconds,
  chapters,
  markers,
  onSeek,
  activeTime = 0,
}) => {
  const [hoveredItem, setHoveredItem] = useState<{ title: string; type: string; time: number } | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <Target className="w-4 h-4 text-rose-400" />;
      case "important":
        return <Star className="w-4 h-4 text-amber-400" />;
      case "definition":
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getMarkerBadgeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      case "important":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "definition":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
    }
  };

  return (
    <div className="space-y-6 bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Interactive Lecture Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-mapped key moments, exam probability markers, and structural chapters.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center space-x-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>Important</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-400">
            <Target className="w-3.5 h-3.5 text-rose-400" />
            <span>Exam Focus</span>
          </span>
          <span className="flex items-center space-x-1 text-cyan-400">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Definition</span>
          </span>
        </div>
      </div>

      {/* Visual Timeline Bar with Pins */}
      <div className="relative pt-6 pb-2">
        {/* Hover Tooltip */}
        {hoveredItem && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white shadow-xl z-20 whitespace-nowrap flex items-center space-x-2 pointer-events-none">
            <span className="font-mono text-indigo-300">[{formatTime(hoveredItem.time)}]</span>
            <span>{hoveredItem.title}</span>
          </div>
        )}

        {/* Track Bar */}
        <div className="h-3 bg-slate-950 border border-slate-800 rounded-full relative overflow-hidden flex">
          {chapters.length > 0 ? (
            chapters.map((chap, idx) => {
              const widthPct = ((chap.endTime - chap.startTime) / (durationSeconds || 1)) * 100;
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={chap.id}
                  onClick={() => onSeek?.(chap.startTime)}
                  onMouseEnter={() =>
                    setHoveredItem({ title: chap.title, type: "chapter", time: chap.startTime })
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ width: `${Math.max(widthPct, 5)}%` }}
                  className={`h-full border-r border-slate-900 transition-all cursor-pointer hover:brightness-125 relative ${
                    isEven ? "bg-indigo-600/40" : "bg-violet-600/40"
                  }`}
                  title={`Chapter ${idx + 1}: ${chap.title}`}
                />
              );
            })
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-600/30 to-purple-600/30" />
          )}

          {/* Active Playhead Progress */}
          {durationSeconds > 0 && (
            <div
              style={{ width: `${(activeTime / durationSeconds) * 100}%` }}
              className="absolute left-0 top-0 bottom-0 bg-indigo-500/60 pointer-events-none"
            />
          )}
        </div>

        {/* Marker Pin overlay */}
        <div className="relative h-6 mt-1">
          {markers.map((m) => {
            const leftPct = (m.timestamp / (durationSeconds || 180)) * 100;
            return (
              <button
                key={m.id}
                onClick={() => onSeek?.(m.timestamp)}
                onMouseEnter={() => setHoveredItem({ title: m.title, type: m.type, time: m.timestamp })}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ left: `${Math.min(Math.max(leftPct, 1), 98)}%` }}
                className="absolute -top-1.5 -translate-x-1/2 p-1 rounded-full bg-slate-900 border border-slate-700 hover:scale-125 transition-transform z-10 shadow-lg"
              >
                {getMarkerIcon(m.type)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapters & Key Moments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Chapter List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Lecture Chapters ({chapters.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {chapters.map((chap, idx) => (
              <div
                key={chap.id}
                onClick={() => onSeek?.(chap.startTime)}
                className="p-3 bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition-all cursor-pointer flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {formatTime(chap.startTime)}
                    </span>
                    <span className="text-xs font-extrabold text-white group-hover:text-indigo-200 transition-colors">
                      {chap.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{chap.summary}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Moments & Exam Probabilities */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            High-Value Moments & Exam Probabilities
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {markers.length === 0 ? (
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/60 text-xs text-slate-500 text-center">
                No custom markers pinned. AI auto-detected high probability moments.
              </div>
            ) : (
              markers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSeek?.(m.timestamp)}
                  className="p-3 bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                      {getMarkerIcon(m.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">
                          {formatTime(m.timestamp)}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
                          {m.title}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getMarkerBadgeColor(
                      m.type
                    )}`}
                  >
                    {m.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
