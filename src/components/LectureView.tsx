import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Bookmark,
  Star,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Sparkles,
  Share2,
  Copy,
  Check,
  Globe,
  Flame,
  Send,
  Brain,
  Award,
  Layers,
  ListOrdered,
  FileText,
  Clock,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { LectureData, AudioMarker, Flashcard, QuizQuestion } from "../types";
import { SmartTimeline } from "./SmartTimeline";

interface LectureViewProps {
  lecture: LectureData;
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export const LectureView: React.FC<LectureViewProps> = ({
  lecture,
  onBack,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<
    "notes" | "chapters" | "exam" | "transcript" | "flashcards" | "quiz" | "chat"
  >("notes");

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [copiedNote, setCopiedNote] = useState(false);
  const [languageView, setLanguageView] = useState<"auto" | "en" | "fr" | "ht">("auto");

  // Flashcards state
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: `Hello! I am your AI Second Brain for "${lecture.title}". Ask me anything about this lecture in Haitian Creole, French, or English!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const duration = lecture.durationSeconds || 180;

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Jump audio playback to exact timestamp
  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCopyNotes = () => {
    const textToCopy = lecture.notes.map((n) => `${n.title}\n${n.content}`).join("\n\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Submit Tutor Chat Message
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureContext: lecture,
          userQuery: userMsg,
          conversationHistory: chatMessages,
          preferredLanguage: languageView,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I analyzed the lecture notes. " + (data.error || "Could not generate answer.") },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble connecting to the AI Tutor server." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Back & Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            id="btn-lecture-back"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all flex items-center space-x-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Knowledge Hub</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {lecture.subject}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">{lecture.date}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lecture.title}
            </h1>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-400 ml-1" />
            <button
              onClick={() => setLanguageView("auto")}
              className={`px-2 py-1 rounded-lg transition-all ${
                languageView === "auto" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setLanguageView("ht")}
              className={`px-2 py-1 rounded-lg transition-all ${
                languageView === "ht" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Creole 🇭🇹
            </button>
            <button
              onClick={() => setLanguageView("fr")}
              className={`px-2 py-1 rounded-lg transition-all ${
                languageView === "fr" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              French 🇫🇷
            </button>
          </div>

          <button
            onClick={handleCopyNotes}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all flex items-center space-x-2 text-xs font-semibold"
          >
            {copiedNote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedNote ? "Copied!" : "Copy Notes"}</span>
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(lecture.id)}
              className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 text-rose-300 transition-all"
              title="Delete Lecture"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SIGNATURE SMART TIMELINE */}
      <SmartTimeline
        durationSeconds={duration}
        chapters={lecture.chapters}
        markers={lecture.markers}
        onSeek={seekTo}
        activeTime={currentTime}
      />

      {/* AUDIO PLAYER CONTROLS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
        {lecture.audioUrl && (
          <audio
            ref={audioRef}
            src={lecture.audioUrl}
            onTimeUpdate={() => {
              if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
            }}
            onEnded={() => setIsPlaying(false)}
          />
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={() => seekTo(Math.max(0, currentTime - 10))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Jump Back 10s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <button
            onClick={() => seekTo(Math.min(duration, currentTime + 10))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Jump Forward 10s"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <span className="font-mono text-slate-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-mono hidden sm:inline">Speed:</span>
          {[1.0, 1.25, 1.5, 2.0].map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setPlaybackSpeed(speed);
                if (audioRef.current) audioRef.current.playbackRate = speed;
              }}
              className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                playbackSpeed === speed
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* NAVIGATION WORKSPACE TABS */}
      <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "notes"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Study Notes</span>
        </button>

        <button
          onClick={() => setActiveTab("chapters")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "chapters"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapters & Summary</span>
        </button>

        <button
          onClick={() => setActiveTab("exam")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "exam"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" />
          <span>Exam Radar</span>
          {lecture.importantMoments.length > 0 && (
            <span className="px-1.5 py-0.2 text-xs rounded-full bg-amber-500/20 text-amber-300 font-bold">
              {lecture.importantMoments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("transcript")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "transcript"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Transcript</span>
        </button>

        <button
          onClick={() => setActiveTab("flashcards")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "flashcards"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Flashcards</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "quiz"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Practice Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "chat"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Brain className="w-4 h-4 text-indigo-300" />
          <span>AI Tutor Chat</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. STUDY NOTES TAB */}
      {activeTab === "notes" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Automatic Organized Study Notes</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Notion-Style Architecture</span>
          </div>

          <div className="space-y-8">
            {lecture.notes.map((section, idx) => (
              <div key={section.id || idx} className="space-y-3">
                <h3 className="text-lg font-bold text-indigo-300 pb-2 border-b border-slate-800/60">
                  {section.title}
                </h3>
                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CHAPTERS & SUMMARY TAB */}
      {activeTab === "chapters" && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Intelligent Summary & Core Thesis</span>
            </h3>

            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 text-indigo-200 text-sm leading-relaxed font-medium">
              "{lecture.summary.shortSummary}"
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {lecture.summary.detailedSummary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Main Key Takeaways
              </h4>
              <ul className="space-y-2">
                {lecture.summary.mainIdeas.map((idea, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-slate-200">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chapters Breakdown Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Lecture Chapters ({lecture.chapters.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lecture.chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => seekTo(ch.startTime)}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg hover:bg-slate-900/80 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {formatTime(ch.startTime)} - {formatTime(ch.endTime)}
                    </span>
                    <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Jump to chapter →
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-base group-hover:text-indigo-200 transition-colors">
                    {ch.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ch.summary}
                  </p>

                  {ch.keyConcepts?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {ch.keyConcepts.map((kc, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                        >
                          #{kc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. EXAM RADAR TAB */}
      {activeTab === "exam" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Exam Radar & Instructor Alerts</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                AI automatically detected moments where the professor emphasized exam material.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {lecture.importantMoments.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No specific exam alerts flagged in this lecture.</p>
            ) : (
              lecture.importantMoments.map((m) => (
                <div
                  key={m.id}
                  onClick={() => seekTo(m.timestamp)}
                  className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-500 text-slate-200 transition-all cursor-pointer group flex items-start space-x-4"
                >
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 font-mono font-bold text-xs">
                    [{formatTime(m.timestamp)}]
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500 text-slate-950">
                        {m.level || "Critical Exam Alert"}
                      </span>
                      <span className="text-xs text-amber-400 group-hover:underline">
                        Jump to Audio →
                      </span>
                    </div>
                    <blockquote className="text-sm font-semibold text-white italic">
                      "{m.phrase}"
                    </blockquote>
                    <p className="text-xs text-slate-300">
                      <span className="font-bold text-amber-300">Why it matters:</span> {m.reason}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. TRANSCRIPT TAB */}
      {activeTab === "transcript" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <ListOrdered className="w-5 h-5 text-indigo-400" />
              <span>Full Formatted Transcript</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Grammar Corrected • Code-Switching Preserved</span>
          </div>

          <div className="space-y-4">
            {lecture.transcript.map((item) => (
              <div
                key={item.id}
                onClick={() => seekTo(item.startTime)}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-indigo-400">{item.speaker || "Professor"}</span>
                    <span className="font-mono text-slate-500">
                      [{formatTime(item.startTime)} - {formatTime(item.endTime)}]
                    </span>
                  </div>
                  {item.originalLanguage && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {item.originalLanguage}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-100 leading-relaxed font-sans">
                  {item.text}
                </p>

                {item.translationEn && languageView === "ht" && (
                  <p className="text-xs text-indigo-300/80 italic pt-1 border-t border-slate-800/50">
                    [Translation]: {item.translationEn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FLASHCARDS TAB */}
      {activeTab === "flashcards" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Active Recall Flashcard Deck</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tap cards to flip and test your memory recall.
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
              Mastered: {Object.values(masteredCards).filter(Boolean).length} / {lecture.flashcards.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lecture.flashcards.map((card, idx) => {
              const isFlipped = flippedCardId === card.id;
              const isMastered = masteredCards[card.id];

              return (
                <div
                  key={card.id || idx}
                  className="perspective-1000 h-64 cursor-pointer"
                  onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                >
                  <div
                    className={`relative w-full h-full rounded-3xl border transition-all duration-500 transform-style-3d p-6 flex flex-col justify-between ${
                      isFlipped
                        ? "bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border-indigo-500 shadow-2xl shadow-indigo-500/20"
                        : "bg-slate-950 border-slate-800 hover:border-cyan-500/50 shadow-xl"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="uppercase font-bold text-cyan-400">
                        {card.category || `Card #${idx + 1}`}
                      </span>
                      <span>{isFlipped ? "ANSWER" : "QUESTION"}</span>
                    </div>

                    <div className="text-center py-4">
                      {isFlipped ? (
                        <p className="text-base font-bold text-indigo-200 animate-fadeIn">
                          {card.answer}
                        </p>
                      ) : (
                        <p className="text-base font-semibold text-white">
                          {card.question}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500">
                        Tap to {isFlipped ? "see question" : "flip answer"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMasteredCards((prev) => ({ ...prev, [card.id]: !isMastered }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isMastered
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {isMastered ? "✓ Mastered" : "Mark Mastered"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PRACTICE QUIZ TAB */}
      {activeTab === "quiz" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Interactive Practice Quiz</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Test your knowledge before exams with instant explanation feedback.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {lecture.quizQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={q.id || qIdx}
                  className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4"
                >
                  <h3 className="text-base font-bold text-white flex items-start space-x-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold shrink-0 mt-0.5">
                      Q{qIdx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h3>

                  <div className="space-y-2 pl-8">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswerIndex;
                      const isSelected = selectedOpt === optIdx;

                      let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800";
                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isCorrect && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200 space-y-1">
                      <span className="font-bold text-indigo-300">Explanation:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. AI TUTOR CHAT TAB */}
      {activeTab === "chat" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[600px]">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                LectureMind AI Second Brain Tutor
              </h2>
              <p className="text-xs text-indigo-300">
                Ask questions in Haitian Creole, French, or English
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-950 border border-slate-800 text-slate-100 rounded-bl-none whitespace-pre-line"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 text-slate-400 p-4 rounded-2xl text-xs flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>AI Tutor is analyzing lecture notes...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g. Explique-moi le rôle des thylakoïdes en kreyòl..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={isChatLoading || !chatInput.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
