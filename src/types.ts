export interface AudioMarker {
  id: string;
  timestamp: number; // in seconds
  type: 'chapter' | 'important' | 'example' | 'exam' | 'definition' | 'user_note';
  title: string;
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number; // seconds
  endTime: number; // seconds
  summary: string;
  keyConcepts: string[];
}

export interface KeyConcept {
  id: string;
  term: string;
  definition: string;
  category: 'formula' | 'definition' | 'theory' | 'date' | 'person' | 'general';
  timestamp?: number;
}

export interface ImportantMoment {
  id: string;
  timestamp: number;
  phrase: string; // e.g. "Pay attention to this formula"
  reason: string; // e.g. "High probability for midterm exam"
  level: 'medium' | 'high' | 'critical';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  speaker?: string;
  text: string;
  originalLanguage?: string; // 'ht' | 'fr' | 'en' | 'mixed'
  translationEn?: string;
}

export interface LectureNoteSection {
  id: string;
  title: string;
  content: string; // markdown or rich text
  subsections?: { title: string; content: string }[];
}

export interface LectureData {
  id: string;
  title: string;
  subject: string;
  date: string; // ISO string or formatted date
  durationSeconds: number;
  audioUrl?: string; // Blob URL or base64 data
  detectedLanguages: string[]; // e.g. ["French", "Haitian Creole", "English"]
  
  // Transformed outputs
  transcript: TranscriptSegment[];
  rawTranscriptText: string;
  
  summary: {
    shortSummary: string;
    detailedSummary: string;
    mainIdeas: string[];
  };
  
  chapters: Chapter[];
  markers: AudioMarker[];
  keyConcepts: KeyConcept[];
  importantMoments: ImportantMoment[];
  notes: LectureNoteSection[];
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
  
  // Custom user interactive notes
  userSavedNotes?: string[];
}

export interface RecordingSegment {
  id: string;
  startTime: number;
  endTime: number;
  blob: Blob;
  base64?: string;
}
