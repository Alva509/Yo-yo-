import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  glow?: "indigo" | "violet" | "cyan" | "amber" | "rose" | "none";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  onClick,
  hoverEffect = true,
  glow = "none",
}) => {
  const glowClasses = {
    none: "",
    indigo: "hover:shadow-indigo-500/10 hover:border-indigo-500/40",
    violet: "hover:shadow-violet-500/10 hover:border-violet-500/40",
    cyan: "hover:shadow-cyan-500/10 hover:border-cyan-500/40",
    amber: "hover:shadow-amber-500/10 hover:border-amber-500/40",
    rose: "hover:shadow-rose-500/10 hover:border-rose-500/40",
  };

  return (
    <div
      onClick={onClick}
      className={`relative backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
        hoverEffect
          ? "hover:-translate-y-1 hover:bg-slate-900/80 hover:border-slate-700/80 cursor-pointer"
          : ""
      } ${glowClasses[glow]} ${className}`}
    >
      {/* Subtle top shimmer highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent rounded-t-3xl pointer-events-none" />
      {children}
    </div>
  );
};
