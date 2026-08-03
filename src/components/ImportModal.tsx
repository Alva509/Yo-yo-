import React, { useState } from "react";
import { Upload, FileText, Music, Sparkles, Check, AlertCircle } from "lucide-react";

interface ImportModalProps {
  onProcessAudio: (
    audioBase64: string,
    mimeType: string,
    title: string,
    subject: string
  ) => void;
  onProcessText: (text: string, title: string, subject: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  onProcessAudio,
  onProcessText,
}) => {
  const [activeMode, setActiveMode] = useState<"file" | "text">("file");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [rawText, setRawText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleImport = () => {
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg("Please enter a class title.");
      return;
    }

    if (activeMode === "file") {
      if (!audioFile) {
        setErrorMsg("Please select an audio file.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(audioFile);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        const mimeType = audioFile.type || "audio/mp3";
        onProcessAudio(base64, mimeType, title, subject || "Academic Studies");
      };
    } else {
      if (!rawText.trim()) {
        setErrorMsg("Please paste or write lecture notes.");
        return;
      }
      onProcessText(rawText, title, subject || "Academic Studies");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Import Lecture Recording or Notes</h2>
          <p className="text-sm text-slate-400">
            Upload audio files (.mp3, .m4a, .wav) or raw transcript notes for full AI transformation.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
          <button
            onClick={() => setActiveMode("file")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
              activeMode === "file"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Upload Audio File</span>
          </button>
          <button
            onClick={() => setActiveMode("text")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
              activeMode === "text"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Transcript Notes</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Class Title
            </label>
            <input
              type="text"
              placeholder="e.g. Chimie Organique - Réactions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Course / Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Chimie"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {activeMode === "file" ? (
          <div className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl p-8 text-center transition-all bg-slate-950/50 cursor-pointer relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Music className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
            {audioFile ? (
              <p className="text-sm font-bold text-emerald-400">
                Selected: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            ) : (
              <div>
                <p className="text-sm font-semibold text-white">
                  Click or drag audio file here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports .mp3, .m4a, .wav, .webm, .ogg
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Paste Lecture Transcript or Notes
            </label>
            <textarea
              rows={8}
              placeholder="Paste raw lecture transcription or rough class notes here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        )}

        <button
          onClick={handleImport}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>PROCESS WITH AI SECOND BRAIN</span>
        </button>
      </div>
    </div>
  );
};
