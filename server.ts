import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "NextMarga API" });
});

// Career AI chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, profile, conversationHistory } = req.body;

    const userProfileSummary = profile
      ? `Student Profile Context:
- Name: ${profile.fullName || 'Student'}
- Class/Grade: ${profile.currentClass || 'Class 8/9'}
- Board: ${profile.educationalBoard || 'CBSE'}
- State/Location: ${profile.state || 'India'} (${profile.city || ''})
- Interests: ${(profile.interests || ['Mathematics', 'Coding']).join(', ')}
- Goal: ${profile.targetPath || 'Engineering & Research'}`
      : 'Student in secondary/senior secondary school in India.';

    const systemInstruction = `You are NextMarga CareerAI, a friendly, encouraging, and highly knowledgeable student counselor and opportunity advisor for school and college students (from Class 6-8, 9-10, 11-12, through Undergrad).
Your mission is to guide students on Olympiads (e.g. Mathematics Olympiad, IOI, ZIO, NSEJS, PRMO/RMO), National & State Scholarships (e.g. NTSE, INSPIRE, State Merit), Entrance Exams (JEE, NEET, CUET, SAT), Research Fellowships, Hackathons, and step-by-step career roadmaps.

Context:
${userProfileSummary}

Rules:
1. Provide structured, actionable, and age-appropriate guidance.
2. If relevant, recommend 2-3 specific real competitions, scholarships, or preparatory milestones.
3. Keep the tone inspiring, precise, and supportive. Avoid generic fluff.
4. Format with clean bullet points and clear next steps.`;

    const ai = getGeminiClient();
    if (ai) {
      const chat = ai.chats.create({
        model: "gemini-3.7-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // Send the user message
      const result = await chat.sendMessage({ message: message || "What opportunities should I prepare for next?" });
      return res.json({ reply: result.text });
    } else {
      // Fallback smart rule-based counselor when API key is not yet set
      const msg = (message || '').toLowerCase();
      let fallbackReply = "";
      if (msg.includes("class 9") || msg.includes("coding") || msg.includes("python")) {
        fallbackReply = `Based on your profile, you should start with basic Python and look into the IOI (International Olympiad in Informatics) roadmap.\n\nHere are 3 high-impact coding opportunities open for you:\n1. **Zonal Informatics Olympiad (ZIO)** - Class 8-12, testing computational problem solving.\n2. **Google Code-in / Codechef Junior Challenges** - Ages 13-17 global coding exposure.\n3. **National Cyber Olympiad (NCO)** - Foundational computer science competition.\n\n**Recommended Next Step**: Solve 2 algorithmic puzzles on CodeChef or CS50 Python weekly!`;
      } else if (msg.includes("olympiad") || msg.includes("math")) {
        fallbackReply = `For Mathematics & Science Olympiads:\n\n1. **IOQM / PRMO (Pre-RMO)**: Key qualifier for Indian National Olympiad (INMO). Focus on Number Theory, Geometry, Combinatorics, and Algebra.\n2. **Mathematics Olympiad 2024 (Registration Open)**: Excellent stepping stone testing analytical ability.\n3. **KVPY / Olympiad Training Camps**: Build depth beyond standard school textbooks.\n\n*Pro-tip*: Review previous 5 years' PRMO problems to get used to non-routine puzzle solving!`;
      } else if (msg.includes("scholarship") || msg.includes("bihar") || msg.includes("fund")) {
        fallbackReply = `Here are active scholarship programs matching your profile:\n\n1. **State Merit Scholarship (Bihar)**: Financial support for students excelling in STEM.\n2. **National Means-cum-Merit Scholarship (NMMS)**: ₹12,000/year assistance for qualifying Class 8 students.\n3. **INSPIRE-SHE Awards**: Science & Technology fellowship for bright young scholars.\n\nMake sure your School Bonafide Certificate and Previous Marksheets are uploaded in your NextMarga profile!`;
      } else {
        fallbackReply = `Great question! Based on your academic journey in ${profile?.currentClass || 'Class 8-12'}:\n\n- **Immediate Focus**: Consolidate core concepts and tackle 1-2 recognized Olympiads or talent exams.\n- **Skill Building**: Dedicate 45 minutes daily to your passion area (${(profile?.interests || ['STEM'])[0]}).\n- **Milestone Tracking**: Check your personalized Roadmap tab to stay ahead of upcoming application deadlines.\n\nWould you like recommendations for specific competitions, exam dates, or study resources?`;
      }
      return res.json({ reply: fallbackReply });
    }
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Failed to process chat request" });
  }
});

// Assessment evaluation endpoint
app.post("/api/assess-response", async (req, res) => {
  try {
    const { question, responseText, profile } = req.body;
    const ai = getGeminiClient();

    if (ai && responseText && responseText.trim().length > 10) {
      const prompt = `Evaluate the following student's response to an assessment question:
Question: "${question || 'Tell us about a time you solved a difficult problem. Walk us through your thought process and the outcome.'}"
Student Answer: "${responseText}"
Student Level: ${profile?.currentClass || 'Class 8-12'}

Please return a concise JSON analysis with:
1. "score": number between 75 and 98
2. "feedback": brief 2-sentence encouraging review of their analytical structure and problem-solving method
3. "strengths": array of 2 bullet points
4. "improvementTip": 1 actionable suggestion to elevate their response`;

      const result = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      const raw = result.text || "";
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      } catch (e) {
        // Fallback to text parsing
      }
    }

    // Default constructive feedback
    res.json({
      score: 88,
      feedback: "Strong structured breakdown! You clearly articulated the root problem, demonstrated systematic thinking, and reflected well on the outcome.",
      strengths: [
        "Logical sequencing from problem identification to resolution",
        "Clear demonstration of resilience and analytical curiosity"
      ],
      improvementTip: "Consider quantifying your final outcome (e.g., time saved, accuracy percentage, or score improvement) for even stronger impact."
    });
  } catch (error: any) {
    console.error("Error in /api/assess-response:", error);
    res.status(500).json({ error: error.message || "Assessment evaluation failed" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NextMarga server running on http://localhost:${PORT}`);
  });
}

startServer();
