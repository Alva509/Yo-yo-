import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Pause,
  Play,
  Sparkles,
  Bookmark,
  Star,
  Lightbulb,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Globe,
  Flame,
  Zap,
} from "lucide-react";
import { AudioMarker, LectureData } from "../types";
import { SAMPLE_LECTURES } from "../data/sampleLectures";

interface SmartRecorderProps {
  onFinishRecording: (
    audioBase64: string | null,
    transcriptText: string | null,
    title: string,
    subject: string,
    liveMarkers: AudioMarker[]
  ) => void;
  onSelectSample: (sample: LectureData) => void;
}

export const SmartRecorder: React.FC<SmartRecorderProps> = ({
  onFinishRecording,
  onSelectSample,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [classTitle, setClassTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [liveMarkers, setLiveMarkers] = useState<AudioMarker[]>([]);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Format time HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  };

  // Start recording handler
  const startRecording = async () => {
    setAudioError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect chunk every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Set up AudioContext for visualizer
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        drawWaveform();
      } catch (err) {
        console.warn("Visualizer audio context init warning:", err);
      }
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setAudioError("Microphone access was denied or not available. You can still test with a demo lecture!");
    }
  };

  // Pause / Resume recording
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setIsPaused(true);
    }
  };

  // Add Live Pin Marker during class
  const addQuickPin = (
    type: "exam" | "important" | "example" | "definition" | "user_note",
    title: string
  ) => {
    const newMarker: AudioMarker = {
      id: `live-marker-${Date.now()}`,
      timestamp: recordingTime,
      type,
      title,
      description: `Pinned at ${formatTime(recordingTime)} during live lecture`,
    };
    setLiveMarkers((prev) => [...prev, newMarker]);
  };

  // Draw Audio Waveform
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.8)"); // Indigo
        gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.9)"); // Purple
        gradient.addColorStop(1, "rgba(244, 63, 94, 1)"); // Rose

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    render();
  };

  // End Class and convert audio to Base64
  const endClass = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);

    // Combine audio chunks into base64
    setTimeout(() => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result ? (reader.result as string).split(",")[1] : null;
        onFinishRecording(
          base64Audio,
          null,
          classTitle || "Class Lecture",
          subject || "General Academic",
          liveMarkers
        );
      };
    }, 400);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {!isRecording ? (
        /* IDLE / START CLASS VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle ambient light gradient */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Hero Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multilingual AI Academic Assistant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Focus on learning. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400">
                AI captures and organizes everything.
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Press one button when class starts. Our AI listens to Creole, French, or English, segments key moments, and generates complete study notes and flashcards.
            </p>
          </div>

          {/* Error Banner if mic fails */}
          {audioError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">{audioError}</p>
                <p className="text-xs text-rose-300/80 mt-1">
                  You can click any demo lecture below to test the full experience!
                </p>
              </div>
            </div>
          )}

          {/* Class Information Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
            <div>
              <label htmlFor="input-class-title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Title
              </label>
              <input
                id="input-class-title"
                type="text"
                placeholder="e.g. Biologie - Photosynthèse"
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="input-subject" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject / Course
              </label>
              <input
                id="input-subject"
                type="text"
                placeholder="e.g. Sciences Naturelles"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Main Action Button: START CLASS */}
          <div className="text-center mb-10">
            <button
              id="btn-start-class-main"
              onClick={startRecording}
              className="relative group inline-flex items-center justify-center p-0.5 overflow-hidden rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/40"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-500 group-hover:from-indigo-600 group-hover:to-rose-600 animate-pulse" />
              <span className="relative px-8 py-4 bg-slate-950 rounded-full flex items-center space-x-3 transition-all group-hover:bg-opacity-80">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/40 group-hover:bg-rose-500 transition-colors">
                  <Mic className="w-5 h-5 text-rose-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-wide uppercase">
                  START CLASS
                </span>
              </span>
            </button>
          </div>

          {/* Language Intelligence Info Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-3 px-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400 max-w-xl mx-auto mb-8">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Multilingual Engine:</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md">Haitian Creole 🇭🇹</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md">French 🇫🇷</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md">English 🇺🇸</span>
          </div>

          {/* DEMO LECTURES PRESET SECTION */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Or Try a Demo Lecture (Instant AI Analysis)</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_LECTURES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                        {sample.subject}
                      </span>
                      {sample.detectedLanguages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-200 transition-colors">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {sample.summary.shortSummary}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white text-indigo-400 transition-colors ml-3">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE CLASS RECORDING VIEW */
        <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Animated pulsing red border indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 animate-pulse" />

          {/* Recording Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>LIVE RECORDING IN PROGRESS</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {classTitle || "Class Lecture"} • {subject || "General"}
              </span>
            </div>

            <div className="font-mono text-3xl font-extrabold text-white tracking-widest bg-slate-950 px-5 py-2 rounded-2xl border border-slate-800 shadow-inner">
              {formatTime(recordingTime)}
            </div>
          </div>

          {/* Real-time Audio Waveform Canvas */}
          <div className="mb-8 p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={100}
              className="w-full h-24 rounded-lg"
            />
            <div className="flex items-center justify-between w-full mt-2 text-xs text-slate-400 px-2 font-mono">
              <span>00:00</span>
              <span className="text-indigo-400 animate-pulse">
                Segment #{Math.floor(recordingTime / 60) + 1}
              </span>
              <span>{formatTime(recordingTime)}</span>
            </div>
          </div>

          {/* Quick Pin Action Buttons During Class */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Quick Pin Timestamp (Tap when teacher emphasizes)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                id="btn-pin-exam"
                onClick={() => addQuickPin("exam", "Exam Alert")}
                className="flex items-center space-x-2 p-3 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-xl text-amber-300 font-medium text-xs transition-all active:scale-95"
              >
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
                <span>🎯 Exam Alert</span>
              </button>

              <button
                id="btn-pin-important"
                onClick={() => addQuickPin("important", "Key Concept")}
                className="flex items-center space-x-2 p-3 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-xl text-purple-300 font-medium text-xs transition-all active:scale-95"
              >
                <Lightbulb className="w-4 h-4 text-purple-400 shrink-0" />
                <span>⭐ Key Concept</span>
              </button>

              <button
                id="btn-pin-example"
                onClick={() => addQuickPin("example", "Example")}
                className="flex items-center space-x-2 p-3 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-xl text-cyan-300 font-medium text-xs transition-all active:scale-95"
              >
                <Flame className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>🧪 Example</span>
              </button>

              <button
                id="btn-pin-definition"
                onClick={() => addQuickPin("definition", "Definition")}
                className="flex items-center space-x-2 p-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-xl text-emerald-300 font-medium text-xs transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>📖 Definition</span>
              </button>
            </div>
          </div>

          {/* Pinned Markers Feed */}
          {liveMarkers.length > 0 && (
            <div className="mb-8 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <h5 className="text-xs font-semibold text-slate-400 mb-2">
                Pinned Moments ({liveMarkers.length})
              </h5>
              <div className="flex flex-wrap gap-2">
                {liveMarkers.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                  >
                    <span className="text-indigo-400 font-bold">
                      [{formatTime(m.timestamp)}]
                    </span>
                    <span>{m.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Control Bar: Pause/Resume & END CLASS */}
          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-slate-800">
            <button
              id="btn-pause-class"
              onClick={togglePause}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center space-x-2 transition-all"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>Resume Class</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Pause Class</span>
                </>
              )}
            </button>

            <button
              id="btn-end-class"
              onClick={endClass}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-base flex items-center space-x-3 shadow-xl shadow-rose-600/30 transform hover:scale-105 active:scale-95 transition-all"
            >
              <Square className="w-5 h-5 fill-white" />
              <span className="tracking-wide uppercase">END CLASS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
