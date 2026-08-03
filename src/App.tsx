import React, { useState, useEffect } from "react";
import { Header, TabType } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { SmartRecorder } from "./components/SmartRecorder";
import { LectureView } from "./components/LectureView";
import { Library } from "./components/Library";
import { IntelligenceHub } from "./components/IntelligenceHub";
import { ProfileView } from "./components/ProfileView";
import { ImportModal } from "./components/ImportModal";
import { ProcessingModal } from "./components/ProcessingModal";
import { LectureData, AudioMarker } from "./types";
import { getSavedLectures, saveLecture, deleteLecture } from "./lib/storage";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<LectureData | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Load saved lectures on initial mount
  useEffect(() => {
    const loaded = getSavedLectures();
    setLectures(loaded);
  }, []);

  // Handle processing audio or text payload via Express backend
  const handleProcessLecture = async (
    audioBase64: string | null,
    transcriptText: string | null,
    title: string,
    subject: string,
    liveMarkers: AudioMarker[] = []
  ) => {
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const res = await fetch("/api/process-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          transcriptText,
          titleHint: title,
          subjectHint: subject,
          liveMarkers,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.lecture) {
        throw new Error(data.error || "Failed to process lecture. Please try again.");
      }

      const transformed: LectureData = {
        id: `lecture-${Date.now()}`,
        title: data.lecture.title || title || "Class Lecture",
        subject: data.lecture.subject || subject || "Academic Studies",
        date: new Date().toISOString().split("T")[0],
        durationSeconds: 180,
        detectedLanguages: data.lecture.detectedLanguages || ["Haitian Creole", "French", "English"],
        rawTranscriptText: data.lecture.rawTranscriptText || "",
        summary: data.lecture.summary,
        chapters: data.lecture.chapters || [],
        markers: data.lecture.markers || liveMarkers || [],
        keyConcepts: data.lecture.keyConcepts || [],
        importantMoments: data.lecture.importantMoments || [],
        notes: data.lecture.notes || [],
        transcript: data.lecture.transcript || [],
        flashcards: data.lecture.flashcards || [],
        quizQuestions: data.lecture.quizQuestions || [],
      };

      saveLecture(transformed);
      const updated = getSavedLectures();
      setLectures(updated);
      setSelectedLecture(transformed);
      setIsProcessing(false);
    } catch (err: any) {
      console.error("Lecture processing error:", err);
      setProcessingError(err?.message || "An unexpected error occurred during AI lecture transformation.");
    }
  };

  const handleDeleteLecture = (id: string) => {
    const updated = deleteLecture(id);
    setLectures(updated);
    if (selectedLecture?.id === id) {
      setSelectedLecture(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedLecture(null);
        }}
        savedCount={lectures.length}
      />

      {/* Main Container View */}
      <main className="pb-16">
        {selectedLecture ? (
          /* Detailed Lecture Workspace View */
          <LectureView
            lecture={selectedLecture}
            onBack={() => setSelectedLecture(null)}
            onDelete={handleDeleteLecture}
          />
        ) : activeTab === "home" ? (
          /* Command Center Home View */
          <HomeView
            lectures={lectures}
            onStartCapture={() => setActiveTab("capture")}
            onSelectLecture={(lecture) => setSelectedLecture(lecture)}
            onOpenIntelligence={() => setActiveTab("intelligence")}
            onOpenLibrary={() => setActiveTab("library")}
          />
        ) : activeTab === "capture" ? (
          /* Live Smart Recorder View */
          <SmartRecorder
            onFinishRecording={(audioBase64, transcriptText, title, subject, liveMarkers) => {
              handleProcessLecture(audioBase64, transcriptText, title, subject, liveMarkers);
            }}
            onSelectSample={(sample) => {
              setSelectedLecture(sample);
            }}
          />
        ) : activeTab === "library" ? (
          /* Knowledge Universe Library View */
          <Library
            lectures={lectures}
            onSelectLecture={(lecture) => setSelectedLecture(lecture)}
            onDeleteLecture={handleDeleteLecture}
            onStartNewClass={() => {
              setSelectedLecture(null);
              setActiveTab("capture");
            }}
          />
        ) : activeTab === "intelligence" ? (
          /* Dedicated AI Intelligence Hub */
          <IntelligenceHub
            lectures={lectures}
            onSelectLecture={(lecture) => setSelectedLecture(lecture)}
          />
        ) : activeTab === "profile" ? (
          /* Profile & Settings View */
          <ProfileView
            lectures={lectures}
            onLecturesCleared={() => setLectures([])}
          />
        ) : (
          /* Import Audio or Notes View */
          <ImportModal
            onProcessAudio={(base64, mimeType, title, subject) => {
              handleProcessLecture(base64, null, title, subject);
            }}
            onProcessText={(text, title, subject) => {
              handleProcessLecture(null, text, title, subject);
            }}
          />
        )}
      </main>

      {/* AI Processing Progress Modal */}
      <ProcessingModal
        isOpen={isProcessing}
        error={processingError}
        onCloseError={() => setIsProcessing(false)}
      />
    </div>
  );
}
