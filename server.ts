import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with increased limit for base64 audio
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Primary Lecture AI Processing Route
app.post("/api/process-lecture", async (req, res) => {
  try {
    const { audioBase64, mimeType, transcriptText, titleHint, subjectHint, liveMarkers } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing on server." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite AI Academic Assistant & Educational Psychologist designed to transform classroom lectures into pristine, structured study material.
You excel at understanding multilingual educational contexts, specifically:
- French
- Haitian Creole
- Mixed French + Haitian Creole (code-switching common in Haitian schools and universities, e.g. "Jodi a nou pral pale de la photosynthèse, se yon processus kote plant yo itilize limyè pou pwodwi enèji.")
- English
- Spanish

Your goal:
1. Transcribe/Understand the entire lecture content accurately without flagging multilingual code-switching as an error.
2. Structure the lecture into readable paragraphs with speaker separation where applicable and timestamp estimates.
3. Generate a short summary, detailed summary, and key main ideas.
4. Auto-detect logical chapters with title, timestamps (in seconds), summary, and key concepts.
5. Create a smart timeline with markers for:
   - Chapter transitions ('chapter')
   - Key concepts ('important')
   - Real-world examples ('example')
   - High-probability exam questions/alerts ('exam' when teacher says "pay attention", "this is important", "remember this", "exam")
   - Definitions ('definition')
6. Extract key terminology, formulas, theories, dates, and people.
7. Generate organized study notes with clear headers, bullet points, and explanations.
8. Create 5-8 active recall flashcards.
9. Create 3-5 multiple-choice practice quiz questions with answer options and explanations.

Ensure all timestamps are relative seconds (e.g. 0, 15, 120, 300, etc.) estimating the progression through the lecture.
If live user markers are provided (${JSON.stringify(liveMarkers || [])}), incorporate those user-pinned moments into the smart timeline as 'user_note'.`;

    let contentParts: any[] = [];

    if (audioBase64) {
      contentParts.push({
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: audioBase64,
        },
      });
      contentParts.push({
        text: `Process this audio lecture recording. Title hint: "${titleHint || "Class Lecture"}". Subject: "${subjectHint || "General Studies"}". Extract full transcript, intelligent summaries, chapters with timestamps, smart timeline markers, key concepts, study notes, flashcards, and quiz questions in JSON.`,
      });
    } else if (transcriptText) {
      contentParts.push({
        text: `Analyze and transform the following raw lecture text/notes into structured study materials.
Title: "${titleHint || "Lecture"}". Subject: "${subjectHint || "General"}".

Raw Text:
${transcriptText}`,
      });
    } else {
      return res.status(400).json({ error: "Either audioBase64 or transcriptText must be provided." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contentParts },
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            detectedLanguages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            rawTranscriptText: { type: Type.STRING },
            transcript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  startTime: { type: Type.NUMBER },
                  endTime: { type: Type.NUMBER },
                  speaker: { type: Type.STRING },
                  text: { type: Type.STRING },
                  originalLanguage: { type: Type.STRING },
                  translationEn: { type: Type.STRING },
                },
                required: ["startTime", "endTime", "text"],
              },
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                shortSummary: { type: Type.STRING },
                detailedSummary: { type: Type.STRING },
                mainIdeas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["shortSummary", "detailedSummary", "mainIdeas"],
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  startTime: { type: Type.NUMBER },
                  endTime: { type: Type.NUMBER },
                  summary: { type: Type.STRING },
                  keyConcepts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["title", "startTime", "endTime", "summary"],
              },
            },
            markers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["timestamp", "type", "title"],
              },
            },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  category: { type: Type.STRING },
                  timestamp: { type: Type.NUMBER },
                },
                required: ["term", "definition"],
              },
            },
            importantMoments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.NUMBER },
                  phrase: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  level: { type: Type.STRING },
                },
                required: ["timestamp", "phrase", "reason"],
              },
            },
            notes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["title", "content"],
              },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
          required: [
            "title",
            "subject",
            "detectedLanguages",
            "summary",
            "chapters",
            "markers",
            "keyConcepts",
            "importantMoments",
            "notes",
            "transcript",
            "flashcards",
            "quizQuestions",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);

    res.json({ success: true, lecture: parsedData });
  } catch (error: any) {
    console.error("Error in /api/process-lecture:", error);
    res.status(500).json({
      error: error?.message || "Failed to process lecture audio/transcript",
    });
  }
});

// Interactive AI Tutor Chat Route
app.post("/api/tutor-chat", async (req, res) => {
  try {
    const { lectureContext, userQuery, conversationHistory, preferredLanguage } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing on server." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are LectureMind AI, a warm, highly encouraging, and brilliant personal AI study tutor for university and high school students.
You are helping the student understand their lecture on "${lectureContext.title}" (${lectureContext.subject}).

Context of the lecture:
- Short Summary: ${lectureContext.summary?.shortSummary || ""}
- Key Concepts: ${JSON.stringify(lectureContext.keyConcepts || [])}
- Transcript Excerpts: ${lectureContext.rawTranscriptText?.substring(0, 3000) || ""}

Instructions:
1. Answer the student's question clearly, concisely, and with educational depth.
2. If the student speaks French or Haitian Creole (e.g. "Eksplike m sa an kreyòl" or "Explique-moi en français"), respond in that language. Preferred user language setting: ${preferredLanguage || "Auto"}.
3. Provide helpful analogies, step-by-step breakdowns, or simple memory devices.
4. Keep the tone inspiring, friendly, and academic.`;

    const chatMessages = (conversationHistory || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    chatMessages.push({
      role: "user",
      parts: [{ text: userQuery }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatMessages,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in /api/tutor-chat:", error);
    res.status(500).json({ error: error?.message || "AI Tutor request failed" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LectureMind Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
