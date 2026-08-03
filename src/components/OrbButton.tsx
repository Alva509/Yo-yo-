import React from "react";
import { Mic, Sparkles, Radio } from "lucide-react";

interface OrbButtonProps {
  onClick: () => void;
  label?: string;
  sublabel?: string;
}

export const OrbButton: React.FC<OrbButtonProps> = ({
  onClick,
  label = "START LECTURE CAPTURE",
  sublabel = "Instant AI Transcription & Active Study Deck",
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6 group">
      {/* Outer Breathing Rings */}
      <div className="relative flex items-center justify-center">
        {/* Layer 1: Ambient Outer Pulse Ring */}
        <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 blur-xl animate-pulse group-hover:scale-125 transition-transform duration-700" />
        
        {/* Layer 2: Rotating Particle Ring */}
        <div className="absolute w-40 h-40 rounded-full border border-indigo-500/30 animate-[spin_12s_linear_infinite]" />

        {/* Layer 3: Glass Sphere Core */}
        <button
          onClick={onClick}
          className="relative w-32 h-32 rounded-full backdrop-blur-2xl bg-gradient-to-tr from-indigo-950/80 via-slate-900/90 to-violet-950/80 border border-indigo-400/40 shadow-2xl shadow-indigo-500/30 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group-hover:border-indigo-300 group-hover:shadow-indigo-500/60 overflow-hidden"
        >
          {/* Inner Glowing Core */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/20 to-rose-500/10 opacity-80 animate-pulse" />
          
          {/* Shimmer Light Reflection */}
          <div className="absolute top-2 left-4 w-12 h-6 bg-white/20 rounded-full blur-sm rotate-[-25deg]" />

          <Mic className="w-10 h-10 text-indigo-200 z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(165,180,252,0.8)]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 mt-1 z-10 opacity-90">
            RECORD
          </span>
        </button>
      </div>

      {/* Label & Description */}
      <div className="text-center space-y-1">
        <h3 className="text-base font-extrabold text-white tracking-wide group-hover:text-indigo-300 transition-colors flex items-center justify-center space-x-2">
          <span>{label}</span>
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          {sublabel}
        </p>
      </div>
    </div>
  );
};
