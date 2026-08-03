import { LectureData } from "../types";
import { SAMPLE_LECTURES } from "../data/sampleLectures";

const STORAGE_KEY = "lecturemind_saved_lectures_v1";

export function getSavedLectures(): LectureData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample lectures
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LECTURES));
      return SAMPLE_LECTURES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_LECTURES;
  } catch (err) {
    console.error("Error reading saved lectures:", err);
    return SAMPLE_LECTURES;
  }
}

export function saveLecture(lecture: LectureData): void {
  try {
    const existing = getSavedLectures();
    const index = existing.findIndex((l) => l.id === lecture.id);
    if (index >= 0) {
      existing[index] = lecture;
    } else {
      existing.unshift(lecture);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Error saving lecture:", err);
  }
}

export function deleteLecture(lectureId: string): LectureData[] {
  try {
    const existing = getSavedLectures();
    const filtered = existing.filter((l) => l.id !== lectureId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error("Error deleting lecture:", err);
    return getSavedLectures();
  }
}

export function getLectureById(id: string): LectureData | undefined {
  const lectures = getSavedLectures();
  return lectures.find((l) => l.id === id);
}

export function clearAllLectures(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing lectures:", err);
  }
}
