import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please configure it in the AI Studio Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const GHOSTWRITER_SYSTEM_INSTRUCTION = `You are the "Resignation Ghostwriter".
ROLE & IDENTITY:
- Role Name: Resignation Ghostwriter
- Purpose: Help users turn their bad experiences and challenges into a professional resignation letter that allows them to leave their jobs professionally. Act as a friend, not as a colleague.
- Engagement Context: Users may have had bad experiences at work and may have strong, hurtful feelings associated with those experiences. They may not know how to express these feelings in professional language that will help them leave their jobs professionally.

BEHAVIORAL RULES:
1. Voice: Calm, protective, and supportive. Curious but respectful. Maintain the user’s point of view and do not give advice.
2. Ask: "What difficult situations have you experienced? Why do you want to leave this job?" When in doubt, ask the user for clarification.
3. No-Invention Rule (STRICT):
   - NEVER invent names, dates, addresses, email addresses, job titles, employers, workplace events, reasons for resigning, or transition commitments.
   - ONLY use information explicitly provided by the user. If information is not provided, do NOT fill it in or invent fictitious entities (e.g., Morgan Rivera, Robert Vance, Apex Logistics). Treat examples only as placeholders.
   - NEVER default the notice timeline to two weeks. Ask the user for their exact intended final working date. Do NOT calculate or assume the date.
   - The boundaries field must begin blank. The user must decide what should not appear in the letter.
4. Accuracy & Truth in Claims:
   - Do NOT use claims such as "Confidential Ally" or "airtight letter" as the app cannot guarantee confidentiality or legal protection.
   - Use accurate language such as "supportive writing assistant" and "professional draft."
5. Question Discipline:
   - Ask for missing information ONE QUESTION AT A TIME. Do not overwhelm the user with multiple questions.
6. Confirmation Requirement:
   - Do NOT generate or display a resignation letter until the required information has been provided and confirmed by the user.
   - The 4 required pieces of information to track are:
     (1) Why you want to resign (whyResigning)
     (2) Your bad experiences & challenges (badExperiences)
     (3) What you want to say in the letter / exact intended final working date (whatToSay / noticePeriodOrDate)
     (4) Boundaries: What you do NOT want said in the letter (whatNotToSay)
   - Once all 4 required pieces of information are gathered, provide a clear, empathetic summary of the core message in 'agentReply' and ask the user to confirm it before drafting.
   - Only set 'draftLetter.ready' to true and generate 'draftLetter.body' AFTER the user explicitly confirms the summary (e.g. "looks good", "yes", "confirm", "go ahead and draft").
7. Interaction Loop (5 Steps):
   1. Get the messy version first: feelings, anecdotes, and challenges.
   2. Ask questions to understand why the user wants to leave and what happened in detail (one question at a time).
   3. Acknowledge the challenges and reflect back the core message with empathy and protective clarity. Ask the user to confirm the summary before drafting.
   4. When confirmed by the user, draft a clean, professional resignation letter that they can directly give to their supervisor. Reconsider and revise when new feedback is given.
   5. Continue revising until the user says, "Yes." Set 'isApproved' to true when the user approves the draft.`;

// Resignation Ghostwriter conversational endpoint
app.post("/api/ghostwriter/chat", async (req, res) => {
  try {
    const {
      messages = [],
      userMessage = "",
      currentDraft = {},
      knownInputs = {},
    } = req.body;

    if (!userMessage && messages.length === 0) {
      res.status(400).json({ error: "Message content is required." });
      return;
    }

    const ai = getGenAI();

    const formattedHistory = messages
      .slice(-10)
      .map((m: any) => `${m.role === "assistant" ? "Resignation Ghostwriter" : "User"}: ${m.content}`)
      .join("\n\n");

    const prompt = `Current State of Context:
Known User Inputs so far:
- (1) Why they want to resign: ${knownInputs.whyResigning || "(Not provided yet)"}
- (2) Bad experiences / challenges: ${knownInputs.badExperiences || "(Not provided yet)"}
- (3) What they want to say & exact intended final working date: ${knownInputs.whatToSay || knownInputs.noticePeriodOrDate || "(Not provided yet - do NOT assume 2 weeks)"}
- (4) Boundaries (what NOT to say): ${knownInputs.whatNotToSay || "(Not provided yet - begins blank)"}
- Supervisor / Recipient: ${currentDraft.recipientName || knownInputs.supervisorName || "(Not provided)"}
- Sender Name & Title: ${currentDraft.signoffName || knownInputs.senderName || "(Not provided)"}

Current Draft Status:
${currentDraft.body ? `Existing Draft Body:\n${currentDraft.body}` : "(No draft generated yet)"}

Recent Conversation:
${formattedHistory}

Latest User Message:
"""
${userMessage}
"""

Please execute your role as the Resignation Ghostwriter adhering strictly to:
1. Speak in your warm, calm, protective friend voice in 'agentReply'. Maintain the user's point of view; do NOT give life/career advice.
2. Check which of the 4 required pieces of information are still missing:
   - If missing information remains, ask for the next missing piece: ONE QUESTION AT A TIME in 'clarifyingQuestions' (array with exactly 1 question). Do NOT invent or assume answers.
   - If all 4 pieces have just been completed, summarize the core message clearly in 'agentReply' and ask: "Does this accurately reflect what you want to convey, and would you like me to create your professional draft now?" Leave 'draftLetter.ready' as false.
   - If the user has explicitly confirmed the summarized message (or requested a revision of an existing draft), set 'draftLetter.ready' to true and generate 'draftLetter.body' as a clean, dignified, professional resignation letter using ONLY user-provided facts and bracketed placeholders (e.g., [Supervisor Name], [Your Name], [Company Name]) where details were not supplied.
3. In 'extractedInputs', record ONLY what the user actually provided. Never save placeholder text or invent names/dates/reasons.
4. If the draft exists and the user says "Yes" / "I approve" / "This is ready", set 'isApproved' to true.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: GHOSTWRITER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            agentReply: {
              type: Type.STRING,
              description: "Calm, protective, empathetic message from the ghostwriter (as a loyal friend).",
            },
            coreMessageReflection: {
              type: Type.STRING,
              description: "Empathetic reflection of the user's core truth and intent.",
            },
            clarifyingQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Ask for missing information ONE QUESTION AT A TIME (array of 0 or 1 question).",
            },
            isSummaryConfirmed: {
              type: Type.BOOLEAN,
              description: "True if all 4 required inputs have been provided and the user confirmed the summary to proceed with drafting.",
            },
            draftLetter: {
              type: Type.OBJECT,
              description: "Draft letter. 'ready' MUST be false until the user confirms the core message summary.",
              properties: {
                ready: {
                  type: Type.BOOLEAN,
                  description: "True ONLY when user confirmed the summary and the draft should be displayed. False otherwise.",
                },
                title: { type: Type.STRING },
                subject: { type: Type.STRING },
                salutation: { type: Type.STRING },
                body: { type: Type.STRING },
                closing: { type: Type.STRING },
                signoffName: { type: Type.STRING },
                senderTitle: { type: Type.STRING },
                recipientName: { type: Type.STRING },
                recipientTitle: { type: Type.STRING },
                organization: { type: Type.STRING },
                effectiveDate: { type: Type.STRING },
              },
              required: ["ready"],
            },
            extractedInputs: {
              type: Type.OBJECT,
              properties: {
                whyResigning: { type: Type.STRING },
                badExperiences: { type: Type.STRING },
                whatToSay: { type: Type.STRING },
                whatNotToSay: { type: Type.STRING },
                noticePeriodOrDate: { type: Type.STRING },
              },
            },
            isApproved: {
              type: Type.BOOLEAN,
              description: "True if the user said 'Yes' or clearly approved the final draft.",
            },
            suggestedQuickReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "1-3 suggested quick replies relevant to the current question or step.",
            },
          },
          required: [
            "agentReply",
            "coreMessageReflection",
            "clarifyingQuestions",
            "extractedInputs",
            "isApproved",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Ghostwriter error:", error);
    res.status(500).json({
      error: error.message || "Failed to process ghostwriter request.",
    });
  }
});

// Draft a new letter
app.post("/api/letter/generate", async (req, res) => {
  try {
    const {
      letterType = "General Letter",
      recipientName = "",
      recipientTitle = "",
      recipientOrg = "",
      recipientAddress = "",
      senderName = "",
      senderTitle = "",
      senderAddress = "",
      senderContact = "",
      date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      tone = "Polite & Professional",
      length = "standard",
      keyPoints = "",
      language = "English",
    } = req.body;

    if (!keyPoints && !letterType) {
      res.status(400).json({ error: "Please provide either the purpose/key points or the letter type." });
      return;
    }

    const ai = getGenAI();

    const prompt = `You are a world-class epistolary letter-writing expert and communications consultant.
Draft an authentic, beautifully written, and effective letter based on the following specifications:

- Letter Category / Type: ${letterType}
- Target Language: ${language}
- Tone / Atmosphere: ${tone}
- Desired Length: ${length} (concise = ~120-180 words, standard = ~250-350 words, detailed = ~400-600 words)
- Date: ${date}
- Sender Name: ${senderName || "[Sender Name]"}
- Sender Title / Affiliation: ${senderTitle || ""}
- Sender Address / Location: ${senderAddress || ""}
- Sender Contact Info: ${senderContact || ""}
- Recipient Name: ${recipientName || "[Recipient Name]"}
- Recipient Title / Position: ${recipientTitle || ""}
- Recipient Organization: ${recipientOrg || ""}
- Recipient Address: ${recipientAddress || ""}
- Core Subject & Key Points / Intent to Convey:
${keyPoints || "A well-crafted letter suitable for " + letterType}

Guidelines:
1. Adhere to proper letter etiquette, natural cadence, and appropriate vocabulary.
2. Structure the letter logically: a compelling opening paragraph, cohesive body paragraphs developing the message, and a clear, gracious closing paragraph.
3. The body should be ready to send or easily customized, avoiding clunky placeholder brackets unless absolutely necessary.
4. If a formal subject line (e.g., "RE: ...") is customary for this letter type, provide one; otherwise, leave subject blank.
5. Provide 2-3 practical tips for sending, formatting, or following up on this specific letter.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You compose eloquent, situation-appropriate letters following epistolary craftsmanship. Always respond with valid JSON adhering strictly to the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "Formal subject line (e.g. 'RE: Application for Software Engineer') or empty if personal" },
            salutation: { type: Type.STRING, description: "Appropriate salutation, e.g., 'Dear Mr. Reynolds,' or 'Dearest Clara,'" },
            body: { type: Type.STRING, description: "The full letter body paragraphs separated by double line breaks" },
            closing: { type: Type.STRING, description: "Sign-off phrase, e.g., 'Sincerely,', 'Warm regards,', 'With deepest sympathy,'" },
            signoffName: { type: Type.STRING, description: "The sender name to sign off with" },
            postscript: { type: Type.STRING, description: "Optional P.S. note if appropriate, or empty" },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 practical tips on etiquette, delivery, or timing for this letter",
            },
          },
          required: ["salutation", "body", "closing", "signoffName"],
        },
      },
    });

    const rawText = response.text || "{}";
    const parsed = JSON.parse(rawText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Letter generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate letter. Please try again.",
    });
  }
});

// Refine or adjust an existing letter
app.post("/api/letter/refine", async (req, res) => {
  try {
    const {
      currentLetter = "",
      action = "polish",
      instruction = "",
      targetTone = "",
    } = req.body;

    if (!currentLetter.trim()) {
      res.status(400).json({ error: "Letter content is empty." });
      return;
    }

    const ai = getGenAI();

    const prompt = `You are a master letter editor and writing coach.
Transform the following letter according to the requested improvement:

Action: ${action}
Specific Request / Instruction: ${instruction || "Polish for elegance, clarity, and impact"}
${targetTone ? `Desired Tone: ${targetTone}` : ""}

Original Letter:
"""
${currentLetter}
"""

Instructions:
1. Retain the core facts, names, and intent of the original letter while executing the requested improvement.
2. Ensure impeccable grammar, natural flow, and fitting vocabulary.
3. Return the modified letter as well as a brief summary of what was enhanced.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revisedLetter: {
              type: Type.STRING,
              description: "The complete improved letter",
            },
            changesSummary: {
              type: Type.STRING,
              description: "A concise 1-2 sentence description of the enhancements made",
            },
          },
          required: ["revisedLetter", "changesSummary"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Letter refinement error:", error);
    res.status(500).json({
      error: error.message || "Failed to refine letter.",
    });
  }
});

// Critique and provide etiquette review
app.post("/api/letter/critique", async (req, res) => {
  try {
    const { letter = "", context = "" } = req.body;

    if (!letter.trim()) {
      res.status(400).json({ error: "Letter content is required for critique." });
      return;
    }

    const ai = getGenAI();

    const prompt = `Analyze this letter as an executive communications coach and etiquette specialist:

Letter Context: ${context || "General correspondence"}
Letter:
"""
${letter}
"""

Evaluate the letter across tone, clarity, persuasion/impact, and etiquette.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallVerdict: { type: Type.STRING, description: "A one sentence high-level appraisal" },
            toneAnalysis: { type: Type.STRING, description: "Assessment of the emotional and professional tone" },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 3 strong elements of the letter",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 4 actionable suggestions to enhance clarity, warmth, or impact",
            },
            etiquetteCheck: { type: Type.STRING, description: "Notes on salutation, sign-off, or convention compliance" },
          },
          required: ["overallVerdict", "toneAnalysis", "strengths", "recommendations"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Letter critique error:", error);
    res.status(500).json({
      error: error.message || "Failed to critique letter.",
    });
  }
});

// Vite middleware & Production Serving
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Letter Writing Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
