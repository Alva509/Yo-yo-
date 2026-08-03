import React from "react";
import { Sparkles, Mic, BookOpen, Brain, Home, User, Upload } from "lucide-react";

export type TabType = "home" | "library" | "capture" | "intelligence" | "profile" | "import";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  LectureMind
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
                  v2.5 AI Brain
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Personal AI Classroom Companion • HT / FR / EN
              </p>
            </div>
          </div>

          {/* 5 Core Main Navigation Items */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-btn-home"
              onClick={() => setActiveTab("home")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "home"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              id="nav-btn-library"
              onClick={() => setActiveTab("library")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "library"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Library</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-900 text-indigo-300 border border-slate-700 font-mono">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-btn-capture"
              onClick={() => setActiveTab("capture")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === "capture"
                  ? "bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/30 scale-105"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-rose-500/50"
              }`}
            >
              <Mic className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Capture</span>
            </button>

            <button
              id="nav-btn-intelligence"
              onClick={() => setActiveTab("intelligence")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "intelligence"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="hidden md:inline">Intelligence</span>
            </button>

            <button
              id="nav-btn-profile"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Profile</span>
            </button>

            <button
              id="nav-btn-import"
              onClick={() => setActiveTab("import")}
              title="Import File or Text"
              className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all ${
                activeTab === "import" ? "bg-slate-800 text-white" : ""
              }`}
            >
              <Upload className="w-4 h-4 text-slate-400" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
