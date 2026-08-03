import React, { useState } from "react";
import { BookOpen, Search, Clock, Calendar, Sparkles, ChevronRight, Trash2, Globe, Layers, Award } from "lucide-react";
import { LectureData } from "../types";

interface LibraryProps {
  lectures: LectureData[];
  onSelectLecture: (lecture: LectureData) => void;
  onDeleteLecture: (id: string) => void;
  onStartNewClass: () => void;
}

export const Library: React.FC<LibraryProps> = ({
  lectures,
  onSelectLecture,
  onDeleteLecture,
  onStartNewClass,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const subjects = ["All", ...Array.from(new Set(lectures.map((l) => l.subject).filter(Boolean)))];

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.summary?.shortSummary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All" || l.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${mins} min`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            <span>Classroom Knowledge Hub</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            All your lectures automatically transcribed, translated, and structured into active study decks.
          </p>
        </div>

        <button
          onClick={onStartNewClass}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all self-start md:self-auto"
        >
          + START NEW CLASS
        </button>
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search lectures, topics, concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === subj
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Lectures Found</h3>
          <p className="text-sm text-slate-400 mb-6">
            Start a new class or select a demo lecture to populate your library.
          </p>
          <button
            onClick={onStartNewClass}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Start Class Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture.id}
              onClick={() => onSelectLecture(lecture)}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Subject & Date Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                    {lecture.subject}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatTime(lecture.durationSeconds || 180)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                  {lecture.title}
                </h3>

                {/* Short Summary */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {lecture.summary?.shortSummary}
                </p>

                {/* Languages Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
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

              {/* Stats Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-3 font-mono">
                  <span className="flex items-center space-x-1" title="Chapters">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lecture.chapters?.length || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Flashcards">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lecture.flashcards?.length || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Quiz Questions">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lecture.quizQuestions?.length || 0}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLecture(lecture.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
