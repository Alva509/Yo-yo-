import { LectureData } from "../types";

export const SAMPLE_LECTURES: LectureData[] = [
  {
    id: "lecture-photosynthesis-ht-fr",
    title: "La Photosynthèse ak Enerji Végétale",
    subject: "Biologie / Sciences Naturelles",
    date: "2026-08-01",
    durationSeconds: 180,
    detectedLanguages: ["Haitian Creole", "French", "Scientific Vocabulary"],
    rawTranscriptText: `[00:00 - Professor]: Bonjou tout moun, jodi a nou pral pale de la photosynthèse. Se yon processus biochimique fondamentat nan la nature kote plant yo itilize limyè pou pwodwi enèji.
[00:25 - Professor]: Attendez, notez bien ceci car c'est très important pour l'examen! Les chloroplastes absorbent les photons grâce à la chlorophylle. La réaction globale s'écrit: 6CO2 + 6H2O + limyè -> C6H12O6 + 6O2.
[00:55 - Professor]: Li enpòtan pou nou konprann gen de phases principales: la phase lumineuse (ki rive nan thylakoïdes yo) epi la phase sombre ou le cycle de Calvin (ki rive nan stroma a).
[01:30 - Professor]: Par exemple, si nous couvrons une plante pendant 3 jours sans lumière, la synthèse de glucose s'arrête net. C'est un exemple classique d'expérience de laboratoire.
[02:15 - Professor]: Rappelez-vous: la chlorophylle absorbe principalement le bleu et le rouge, mais elle réfléchit la lumière verte. C'est pour cette raison exacte que les feuilles nous apparaissent vertes!`,
    summary: {
      shortSummary: "Lecture explaining photosynthesis in mixed Haitian Creole and French, covering light-dependent reactions, the Calvin cycle, chloroplast structure, and chlorophyll light absorption.",
      detailedSummary: "The professor introduces photosynthesis as a fundamental biochemical process enabling plants to convert solar energy into chemical energy stored in glucose. The lecture details the chemical reaction equation, the structural role of chloroplasts (thylakoids and stroma), and the distinct mechanisms of the light-dependent phase vs. the light-independent Calvin cycle. Key exam points include why leaves reflect green light and the inputs/outputs of the photosynthetic reaction.",
      mainIdeas: [
        "Photosynthesis converts CO2 and H2O into Glucose (C6H12O6) and Oxygen (6O2) using solar photons.",
        "Divided into two distinct phases: Phase Lumineuse (Thylakoids) and Phase Sombre / Cycle de Calvin (Stroma).",
        "Chlorophyll reflects green wavelength light while absorbing blue and red spectra."
      ]
    },
    chapters: [
      {
        id: "c1",
        title: "1. Introduction à la Photosynthèse",
        startTime: 0,
        endTime: 55,
        summary: "Definition of photosynthesis as a fundamental biochemical process in plants.",
        keyConcepts: ["Biochimie", "Photosynthèse", "Énergie Solaire"]
      },
      {
        id: "c2",
        title: "2. Équation Chimique & Chloroplastes",
        startTime: 55,
        endTime: 130,
        summary: "Chloroplast structures, chlorophyll pigments, and the fundamental chemical reaction equation.",
        keyConcepts: ["6CO2 + 6H2O -> C6H12O6 + 6O2", "Chloroplastes", "Chlorophylle"]
      },
      {
        id: "c3",
        title: "3. Phase Lumineuse vs Cycle de Calvin",
        startTime: 130,
        endTime: 180,
        summary: "Detailed breakdown of light-dependent phase in thylakoids and dark phase in stroma.",
        keyConcepts: ["Phase Lumineuse (Thylakoïdes)", "Cycle de Calvin (Stroma)"]
      }
    ],
    markers: [
      {
        id: "m1",
        timestamp: 0,
        type: "chapter",
        title: "📘 Class Intro: Photosynthèse",
        description: "Definition and biological significance"
      },
      {
        id: "m2",
        timestamp: 25,
        type: "exam",
        title: "🎯 EXAM ALERT: Reaction Equation",
        description: "6CO2 + 6H2O + Light -> C6H12O6 + 6O2"
      },
      {
        id: "m3",
        timestamp: 55,
        type: "definition",
        title: "📖 Definition: Phase Lumineuse & Sombre",
        description: "Thylakoids vs Stroma functions"
      },
      {
        id: "m4",
        timestamp: 90,
        type: "example",
        title: "🧪 Experiment Example",
        description: "Depriving plant of light for 3 days stops glucose production"
      },
      {
        id: "m5",
        timestamp: 135,
        type: "important",
        title: "⭐ Key Concept: Green Reflection",
        description: "Why leaves appear green to the human eye"
      }
    ],
    keyConcepts: [
      {
        id: "kc1",
        term: "La Photosynthèse",
        definition: "Processus biochimique permettant aux plantes et autotrophes de convertir la lumière solaire en énergie chimique (glucose).",
        category: "definition",
        timestamp: 0
      },
      {
        id: "kc2",
        term: "Équation Bilan",
        definition: "6 CO2 + 6 H2O + Limyè / Photons → C6H12O6 (Glucose) + 6 O2 (Oxygène)",
        category: "formula",
        timestamp: 25
      },
      {
        id: "kc3",
        term: "Thylakoïdes vs Stroma",
        definition: "Thylakoïdes: lieu de la phase lumineuse. Stroma: fluide intérieur du chloroplaste où se déroule le cycle de Calvin.",
        category: "theory",
        timestamp: 55
      }
    ],
    importantMoments: [
      {
        id: "im1",
        timestamp: 25,
        phrase: "Attendez, notez bien ceci car c'est très important pour l'examen!",
        reason: "The professor explicitly stated this chemical equation will be tested on the exam.",
        level: "critical"
      },
      {
        id: "im2",
        timestamp: 135,
        phrase: "Rappelez-vous: la chlorophylle absorbe le bleu/rouge et réfléchit le vert.",
        reason: "Frequent multiple-choice question concept in introductory biology.",
        level: "high"
      }
    ],
    notes: [
      {
        id: "n1",
        title: "1. Présentation Générale de la Photosynthèse",
        content: `### Qu'est-ce que la Photosynthèse?
La **photosynthèse** (nan kreyòl: *fotochoazi / fotosentèz*) est le mécanisme fondamental permettant aux organismes autotrophes (plantes vertes, algues) d'utiliser l'énergie lumineuse pour fabriquer de la matière organique à partir de dioxyde de carbone et d'eau.

#### Équation Bilan à Mémoriser:
$$\\text{6 CO}_2 + \\text{6 H}_2\\text{O} + \\text{Lumière} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6 O}_2$$

- **Réactifs:** Dioxyde de carbone + Eau + Énergie Solaire
- **Produits:** Glucose + Dioxygène`
      },
      {
        id: "n2",
        title: "2. Structure du Chloroplaste & Pigments",
        content: `### Le Chloroplaste
L'organite cellulaire spécialisé dans la photosynthèse.

- **Chlorophylle:** Le pigment vert situé dans la membrane des thylakoïdes.
- **Spectre d'absorption:** Absorbe la lumière rouge et bleue; **réfléchit le vert**, ce qui donne leur couleur aux feuilles.`
      },
      {
        id: "n3",
        title: "3. Les Deux Phases de la Photosynthèse",
        content: `1. **Phase Lumineuse (Dépendante de la lumière):**
   - Se déroule dans les **Thylakoïdes**.
   - Photolyse de l'eau et production d'ATP et NADPH.
2. **Phase Sombre (Cycle de Calvin / Indépendante de la lumière):**
   - Se déroule dans le **Stroma**.
   - Fixation du CO2 pour produire le Glucose.`
      }
    ],
    transcript: [
      {
        id: "t1",
        startTime: 0,
        endTime: 25,
        speaker: "Prof. Joseph",
        text: "Bonjou tout moun, jodi a nou pral pale de la photosynthèse. Se yon processus biochimique fondamental nan la nature kote plant yo itilize limyè pou pwodwi enèji.",
        originalLanguage: "mixed",
        translationEn: "Good morning everyone, today we are going to talk about photosynthesis. It is a fundamental biochemical process in nature where plants use light to produce energy."
      },
      {
        id: "t2",
        startTime: 25,
        endTime: 55,
        speaker: "Prof. Joseph",
        text: "Attendez, notez bien ceci car c'est très important pour l'examen! Les chloroplastes absorbent les photons grâce à la chlorophylle. La réaction globale s'écrit: 6CO2 + 6H2O + limyè -> C6H12O6 + 6O2.",
        originalLanguage: "fr",
        translationEn: "Wait, write this down carefully as it's very important for the exam! Chloroplasts absorb photons thanks to chlorophyll. The overall reaction is: 6CO2 + 6H2O + light -> C6H12O6 + 6O2."
      },
      {
        id: "t3",
        startTime: 55,
        endTime: 130,
        speaker: "Prof. Joseph",
        text: "Li enpòtan pou nou konprann gen de phases principales: la phase lumineuse (ki rive nan thylakoïdes yo) epi la phase sombre ou le cycle de Calvin (ki rive nan stroma a).",
        originalLanguage: "mixed",
        translationEn: "It is important for us to understand there are two main phases: the light phase (which happens in the thylakoids) and the dark phase or Calvin cycle (which happens in the stroma)."
      },
      {
        id: "t4",
        startTime: 130,
        endTime: 180,
        speaker: "Prof. Joseph",
        text: "Par exemple, si nous couvrons une plante pendant 3 jours sans lumière, la synthèse de glucose s'arrête net. Rappelez-vous: la chlorophylle absorbe le bleu et le rouge, mais elle réfléchit la lumière verte.",
        originalLanguage: "fr",
        translationEn: "For example, if we cover a plant for 3 days without light, glucose synthesis stops completely. Remember: chlorophyll absorbs blue and red, but reflects green light."
      }
    ],
    flashcards: [
      {
        id: "fc1",
        question: "Kisa equation chimik fotosentèz la ye? (Chemical equation of photosynthesis?)",
        answer: "6CO2 + 6H2O + Lumière → C6H12O6 (Glucose) + 6O2 (Oxygène)",
        category: "Formules"
      },
      {
        id: "fc2",
        question: "Ki kote phase lumineuse la dewoule nan chloroplaste la?",
        answer: "Nan Thylakoïdes yo (Membrane des thylakoïdes).",
        category: "Anatomie Végétale"
      },
      {
        id: "fc3",
        question: "Poukisa fèy yo parèt vèt pou je nou?",
        answer: "Paske chlorophylle la eklare epi absobe limyè wouj ak ble, men li réfléchit (pouse tounen) limyè vèt la.",
        category: "Optique & Biologie"
      },
      {
        id: "fc4",
        question: "Ki kote le Cycle de Calvin (phase sombre) fèt?",
        answer: "Nan Stroma du chloroplaste.",
        category: "Biochemie"
      }
    ],
    quizQuestions: [
      {
        id: "qq1",
        question: "Quelle est la formule bilan correcte de la photosynthèse?",
        options: [
          "6CO2 + 6H2O + Lumière → C6H12O6 + 6O2",
          "C6H12O6 + 6O2 → 6CO2 + 6H2O + Énergie",
          "6CO2 + C6H12O6 → 6H2O + 6O2",
          "6H2O + 6O2 → C6H12O6 + Lumière"
        ],
        correctAnswerIndex: 0,
        explanation: "La photosynthèse consomme le dioxyde de carbone et l'eau grâce à l'énergie solaire pour fabriquer du glucose et libérer de l'oxygène."
      },
      {
        id: "qq2",
        question: "Ki kote phase lumineuse la dewoule nan yon chloroplaste?",
        options: [
          "Dans le stroma",
          "Dans les thylakoïdes",
          "Dans la mitochondrie",
          "Dans le noyau"
        ],
        correctAnswerIndex: 1,
        explanation: "La phase lumineuse se déroule spécifiquement dans la membrane des thylakoïdes où réside la chlorophylle."
      }
    ]
  },
  {
    id: "lecture-physics-newton",
    title: "Newton's Laws of Motion & Momentum",
    subject: "Physics 101",
    date: "2026-07-28",
    durationSeconds: 210,
    detectedLanguages: ["English"],
    rawTranscriptText: `[00:00 - Prof. Miller]: Welcome physics students. Today we are unpacking Sir Isaac Newton's three fundamental laws of classical mechanics.
[00:30 - Prof. Miller]: First Law: An object at rest stays at rest, and an object in motion continues in motion with constant velocity, unless acted upon by a net external force. This is also known as the Law of Inertia.
[01:10 - Prof. Miller]: Pay close attention to Second Law because 40% of mid-term calculation problems use it: Force equals mass times acceleration, F = m * a.
[01:45 - Prof. Miller]: Third Law: For every action, there is an equal and opposite reaction. When object A exerts a force on object B, object B exerts an equal magnitude force in the opposite direction on object A.`,
    summary: {
      shortSummary: "Introduction to Newton's Three Laws of Motion, force vector addition, and momentum conservation.",
      detailedSummary: "This lecture introduces classical mechanics through Sir Isaac Newton's three foundational principles. It covers inertia (First Law), force calculations (F=ma) (Second Law), and action-reaction pairs (Third Law).",
      mainIdeas: [
        "Inertia keeps velocity constant without net force.",
        "Force equals mass multiplied by acceleration (F = m * a).",
        "Forces always occur in equal and opposite interaction pairs."
      ]
    },
    chapters: [
      {
        id: "pc1",
        title: "1. First Law of Inertia",
        startTime: 0,
        endTime: 60,
        summary: "Objects maintain uniform motion unless acted upon by external force.",
        keyConcepts: ["Inertia", "Velocity", "Net Force"]
      },
      {
        id: "pc2",
        title: "2. Second Law: F = m * a",
        startTime: 60,
        endTime: 140,
        summary: "Mathematical relationship between force, mass, and acceleration.",
        keyConcepts: ["Force", "Mass", "Acceleration", "F=ma"]
      },
      {
        id: "pc3",
        title: "3. Third Law: Action & Reaction",
        startTime: 140,
        endTime: 210,
        summary: "Pairwise interaction forces.",
        keyConcepts: ["Action-Reaction", "Force Pairs"]
      }
    ],
    markers: [
      { id: "pm1", timestamp: 0, type: "chapter", title: "📘 Introduction: Physics Laws" },
      { id: "pm2", timestamp: 30, type: "definition", title: "📖 Law of Inertia (First Law)" },
      { id: "pm3", timestamp: 70, type: "exam", title: "🎯 EXAM ALERT: F = m * a Formula" },
      { id: "pm4", timestamp: 110, type: "important", title: "⭐ Action-Reaction Pairs" }
    ],
    keyConcepts: [
      { id: "pk1", term: "Law of Inertia", definition: "Resistance of any physical object to any change in its velocity.", category: "theory", timestamp: 30 },
      { id: "pk2", term: "Second Law Equation", definition: "F = m * a (Force in Newtons = Mass in kg * Acceleration in m/s²)", category: "formula", timestamp: 70 }
    ],
    importantMoments: [
      { id: "pim1", timestamp: 70, phrase: "Pay close attention to Second Law because 40% of midterm calculation problems use it", reason: "Direct exam content warning from instructor.", level: "critical" }
    ],
    notes: [
      {
        id: "pn1",
        title: "1. Newton's 1st Law (Inertia)",
        content: `An object at rest stays at rest, and an object in motion continues with constant velocity unless acted upon by a net external force.`
      },
      {
        id: "pn2",
        title: "2. Newton's 2nd Law (F = m * a)",
        content: `Force ($F$) = Mass ($m$) $\\times$ Acceleration ($a$).\n- Units: Newtons ($N = \\text{kg} \\cdot \\text{m/s}^2$).`
      }
    ],
    transcript: [
      { id: "pt1", startTime: 0, endTime: 30, text: "Welcome physics students. Today we are unpacking Sir Isaac Newton's three fundamental laws of classical mechanics." },
      { id: "pt2", startTime: 30, endTime: 70, text: "First Law: An object at rest stays at rest, and an object in motion continues in motion with constant velocity, unless acted upon by a net external force. Law of Inertia." },
      { id: "pt3", startTime: 70, endTime: 120, text: "Pay close attention to Second Law because 40% of mid-term calculation problems use it: Force equals mass times acceleration, F = m * a." }
    ],
    flashcards: [
      { id: "pfc1", question: "What is Newton's Second Law equation?", answer: "F = m * a (Force = Mass x Acceleration)", category: "Formulas" },
      { id: "pfc2", question: "What is the SI unit of Force?", answer: "Newton (N), equivalent to 1 kg·m/s².", category: "Units" }
    ],
    quizQuestions: [
      {
        id: "pqq1",
        question: "If mass is doubled while keeping force constant, what happens to acceleration?",
        options: ["It doubles", "It halves", "It quadruples", "It stays the same"],
        correctAnswerIndex: 1,
        explanation: "Since a = F / m, doubling mass cuts acceleration in half."
      }
    ]
  }
];
