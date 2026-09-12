import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

const apiRouter = express.Router();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please configure it in your environment variables (or AI Studio Settings).");
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

function extractErrorMessage(error: any, fallback: string = "Service temporarily unavailable."): string {
  if (!error) return fallback;
  const msg = error.message || String(error);
  if (typeof msg === "string") {
    try {
      const parsed = JSON.parse(msg);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    } catch (_) {}
    return msg;
  }
  return fallback;
}

export function isTransientGeminiError(error: any): boolean {
  if (!error) return false;

  // 1. Direct status checks
  const status = Number(
    error.status ||
    error.statusCode ||
    error.response?.status ||
    error.code
  );

  // Authentication errors, invalid requests, missing key, or not found must NOT be retried
  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return false;
  }

  // 2. Parse nested JSON error message if present
  const rawMsg = error.message || String(error) || "";
  let parsedErrorMsg = "";
  let parsedErrorCode = 0;
  let parsedErrorStatus = "";

  try {
    const parsed = typeof rawMsg === "string" ? JSON.parse(rawMsg) : rawMsg;
    if (parsed?.error) {
      parsedErrorCode = Number(parsed.error.code) || 0;
      parsedErrorStatus = String(parsed.error.status || "");
      parsedErrorMsg = String(parsed.error.message || "");
    }
  } catch (_) {}

  // Check parsed JSON error codes for non-retryable conditions
  if (
    parsedErrorCode === 400 ||
    parsedErrorCode === 401 ||
    parsedErrorCode === 403 ||
    parsedErrorCode === 404 ||
    parsedErrorStatus === "INVALID_ARGUMENT" ||
    parsedErrorStatus === "PERMISSION_DENIED" ||
    parsedErrorStatus === "UNAUTHENTICATED" ||
    parsedErrorStatus === "NOT_FOUND"
  ) {
    return false;
  }

  const combined = (rawMsg + " " + parsedErrorMsg + " " + parsedErrorStatus).toLowerCase();

  // Authentication / invalid request / missing key keywords must NOT be retried
  if (
    combined.includes("api key") ||
    combined.includes("gemini_api_key") ||
    combined.includes("unauthenticated") ||
    combined.includes("permission_denied") ||
    combined.includes("permission denied") ||
    combined.includes("unauthorized") ||
    combined.includes("forbidden") ||
    combined.includes("invalid_argument") ||
    combined.includes("invalid argument") ||
    combined.includes("not configured")
  ) {
    return false;
  }

  // Check HTTP transient status codes: 429, 500, 502, 503, 504
  if (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    parsedErrorCode === 429 ||
    parsedErrorCode === 500 ||
    parsedErrorCode === 502 ||
    parsedErrorCode === 503 ||
    parsedErrorCode === 504 ||
    parsedErrorStatus === "RESOURCE_EXHAUSTED" ||
    parsedErrorStatus === "UNAVAILABLE" ||
    parsedErrorStatus === "DEADLINE_EXCEEDED"
  ) {
    return true;
  }

  // Check model capacity, high-demand, rate limits, or transient error strings
  const transientPatterns = [
    "429",
    "500",
    "502",
    "503",
    "504",
    "resource_exhausted",
    "resource has been exhausted",
    "quota",
    "quota-spike",
    "quota spike",
    "rate limit",
    "rate-limit",
    "too many requests",
    "unavailable",
    "deadline_exceeded",
    "overloaded",
    "high demand",
    "high-demand",
    "capacity",
    "model-capacity",
    "model capacity",
    "model is overloaded",
    "temporarily busy",
    "temporarily unavailable",
    "service unavailable",
    "bad gateway",
    "gateway timeout",
    "internal server error",
    "econnreset",
    "etimedout",
    "fetch failed",
  ];

  return transientPatterns.some((pattern) => combined.includes(pattern));
}

export const TRANSIENT_BUSY_MESSAGE_EN =
  "Gemini is temporarily busy. Your information has not been lost. Please retry this message in a moment.";

export const TRANSIENT_BUSY_MESSAGE_ZH =
  "Gemini 暂时繁忙。您提供的信息未丢失，请稍后重试此消息。";

export const TRANSIENT_BUSY_MESSAGE = TRANSIENT_BUSY_MESSAGE_EN;

export async function withTransientRetry<T>(
  operation: (attempt: number) => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 350
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (err: any) {
      lastError = err;
      const isTransient = isTransientGeminiError(err);
      if (attempt < maxAttempts && isTransient) {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        console.warn(
          `[Gemini Retry] Transient failure on attempt ${attempt}/${maxAttempts}. Retrying in ${delay}ms... (Error: ${err?.message || err})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

apiRouter.get("/", (req, res, next) => {
  if (req.baseUrl === "/api" || req.originalUrl === "/api") {
    return res.json({ status: "ok", service: "Resignation Ghostwriter API", timestamp: new Date().toISOString() });
  }
  next();
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
apiRouter.post("/ghostwriter/chat", async (req, res) => {
  try {
    const {
      messages = [],
      userMessage = "",
      currentDraft = {},
      knownInputs = {},
      language = "en",
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

    const isZh = language === "zh";

    const languageInstruction = isZh
      ? `CRITICAL LANGUAGE REQUIREMENT:
The user has active language mode: SIMPLIFIED CHINESE (简体中文).
1. You MUST formulate 'agentReply', 'coreMessageReflection', 'clarifyingQuestions', and 'suggestedQuickReplies' entirely in natural, empathetic Simplified Chinese.
2. Even if the user message is written in English or mixed languages, YOU MUST RESPOND IN SIMPLIFIED CHINESE, unless the user explicitly requests English letter output.
3. If drafting a letter in 'draftLetter.body', write a complete, dignified, professional Chinese resignation letter (使用标准的公文及辞职信礼仪格式：称谓、正文、结语如“此致 敬礼”、署名、日期占位符等).
4. Do NOT mix English and Chinese text except for proper names, company names, or email addresses.`
      : `CRITICAL LANGUAGE REQUIREMENT:
The user has active language mode: ENGLISH.
1. You MUST formulate 'agentReply', 'coreMessageReflection', 'clarifyingQuestions', and 'suggestedQuickReplies' entirely in English.
2. Even if the user writes in another language, respond in English unless explicitly asked otherwise.
3. If drafting a letter in 'draftLetter.body', write a standard professional English resignation letter.`;

    const prompt = `Current State of Context:
${languageInstruction}

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
   - If missing information remains, ask for the next missing piece: ONE QUESTION AT A TIME in 'clarifyingQuestions' (array with exactly 1 question). Do NOT invent or assume answers. Leave 'draftLetter.ready' as false and 'draftLetter.body' as "".
   - If all 4 pieces have just been completed and the summary has NOT yet been confirmed by the user:
     * Summarize the core message clearly in 'agentReply' and ask confirmation before drafting.
     * In 'suggestedQuickReplies', provide options like "Looks good, please draft it." and a revision option.
     * Leave 'draftLetter.ready' as false and 'draftLetter.body' as "".
     * Set 'isSummaryConfirmed' to false.
   - If the user has confirmed the summary (e.g., "Yes, that summary is accurate. Please draft the resignation letter in English.", "Looks good, please draft it.", "Yes, looks good. Please draft it.", "Confirm", "Proceed", or any affirmative confirmation) OR requested a revision of an existing draft:
     * Set 'isSummaryConfirmed' to true.
     * Set 'draftLetter.ready' to true.
     * Generate the dignified, professional resignation letter in 'draftLetter.body'!
     * RENDERING CONTRACT: 'draftLetter.body' must contain ONLY the central body paragraphs (formal notice of resignation with final working date, graceful departure statement, transition commitments, and well wishes) separated by double line breaks.
     * Provide 'salutation' (e.g. "Dear [Supervisor Name]," or "尊敬的主管："), 'closing' (e.g. "Sincerely," or "此致 敬礼"), 'signoffName' (user name or "[Your Name]"), and 'senderTitle' in their respective dedicated fields.
     * DO NOT duplicate the salutation, closing, signoff signature, sender title, or date inside 'draftLetter.body'.
3. In 'extractedInputs', record ONLY what the user actually provided. Never save placeholder text or invent names/dates/reasons. Record the exact final working date in 'noticePeriodOrDate'.
4. If the draft exists and the user approves, set 'isApproved' to true.`;

    const response = await withTransientRetry(() =>
      ai.models.generateContent({
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
                description: "Calm, protective, empathetic message from the ghostwriter (as a loyal friend) in the selected language.",
              },
              coreMessageReflection: {
                type: Type.STRING,
                description: "Empathetic reflection of the user's core truth and intent in the selected language.",
              },
              clarifyingQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Ask for missing information ONE QUESTION AT A TIME (array of 0 or 1 question) in the selected language.",
              },
              isSummaryConfirmed: {
                type: Type.BOOLEAN,
                description: "True if all 4 required inputs have been provided and the user confirmed the summary to proceed with drafting.",
              },
              draftLetter: {
                type: Type.OBJECT,
                description: "Draft letter. 'ready' MUST be false until the user confirms the core message summary. When ready is true, 'body' MUST contain the complete letter text.",
                properties: {
                  ready: {
                    type: Type.BOOLEAN,
                    description: "True ONLY when user confirmed the summary or requested a revision, and the draft should be displayed. False otherwise.",
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
                required: ["ready", "body"],
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
                description: "1-3 suggested quick replies relevant to the current question or step in the selected language.",
              },
            },
            required: [
              "agentReply",
              "coreMessageReflection",
              "clarifyingQuestions",
              "extractedInputs",
              "isApproved",
              "draftLetter",
            ],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || "{}");

    // Normalize and validate draftLetter state
    const normalizedUserMsg = (userMessage || "").trim().toLowerCase();
    const isConfirmationMsg =
      normalizedUserMsg.includes("looks good") ||
      normalizedUserMsg.includes("please draft") ||
      normalizedUserMsg.includes("summary is accurate") ||
      normalizedUserMsg.includes("accurate") ||
      normalizedUserMsg.includes("proceed") ||
      normalizedUserMsg.includes("yes") ||
      normalizedUserMsg.includes("确认") ||
      normalizedUserMsg.includes("生成") ||
      normalizedUserMsg.includes("起草");

    if (parsed.draftLetter) {
      if (typeof parsed.draftLetter.ready === "string") {
        parsed.draftLetter.ready = parsed.draftLetter.ready === "true";
      }
      if (
        (parsed.isSummaryConfirmed || isConfirmationMsg) &&
        typeof parsed.draftLetter.body === "string" &&
        parsed.draftLetter.body.trim().length > 0
      ) {
        parsed.draftLetter.ready = true;
      }

      // Defensive normalization of draftLetter to strictly enforce single-rendering contract
      if (typeof parsed.draftLetter.body === "string" && parsed.draftLetter.body.trim().length > 0) {
        const unescapedBody = parsed.draftLetter.body
          .replace(/\\r\\n/g, "\n")
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\n")
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n");
        const rawLines = unescapedBody.split("\n").map((l: string) => l.trimEnd());
        const lines = [...rawLines];

        // 1. Clean top (Date:, Subject:, To:, Salutations)
        while (lines.length > 0) {
          const line = (lines[0] || "").trim();
          if (line === "") {
            lines.shift();
            continue;
          }
          if (/^(date|日期|subject|事由|re|主题|to|收件人|致)\s*[:：]/i.test(line)) {
            lines.shift();
            continue;
          }
          if (
            /^(dear\b|to\s+whom|hello\b|hi\b|尊敬的|致[：:]|各位领导|您好)/i.test(line) ||
            (parsed.draftLetter.salutation && line.toLowerCase() === parsed.draftLetter.salutation.trim().toLowerCase())
          ) {
            if (!parsed.draftLetter.salutation || parsed.draftLetter.salutation.includes("Supervisor") || parsed.draftLetter.salutation.includes("领导")) {
              parsed.draftLetter.salutation = line;
            }
            lines.shift();
            if (lines.length > 0 && /^您好[！!，,：:]?$/i.test(lines[0].trim())) {
              lines.shift();
            }
            continue;
          }
          break;
        }

        // 2. Clean bottom (Signoff name, Title, Closings)
        while (lines.length > 0) {
          const line = (lines[lines.length - 1] || "").trim();
          if (line === "") {
            lines.pop();
            continue;
          }
          if (
            (parsed.draftLetter.senderTitle && line.toLowerCase() === parsed.draftLetter.senderTitle.trim().toLowerCase()) ||
            /^\[?(your\s+title|your\s+job\s+title|job\s+title|position|您的职位|职位|职务)\]?$/i.test(line)
          ) {
            if (!parsed.draftLetter.senderTitle) parsed.draftLetter.senderTitle = line.replace(/^\[|\]$/g, "").trim();
            lines.pop();
            continue;
          }
          if (
            (parsed.draftLetter.signoffName && line.toLowerCase() === parsed.draftLetter.signoffName.trim().toLowerCase()) ||
            /^\[?(your\s+name|申请人|签名|署名)\]?$/i.test(line) ||
            /^(申请人|辞职人|报告人|员工|签名|署名)\s*[:：]\s*.+$/i.test(line)
          ) {
            if (!parsed.draftLetter.signoffName) parsed.draftLetter.signoffName = line.replace(/^(申请人|辞职人|报告人|员工|签名|署名)\s*[:：]\s*/i, "").replace(/^\[|\]$/g, "").trim();
            lines.pop();
            continue;
          }
          const inlineMatch = line.match(/^(sincerely|warm\s+regards|best\s+regards|regards|respectfully)[,.\s]+([^\n]+)$/i);
          if (inlineMatch) {
            if (!parsed.draftLetter.closing) parsed.draftLetter.closing = `${inlineMatch[1]},`;
            if (!parsed.draftLetter.signoffName && inlineMatch[2]) parsed.draftLetter.signoffName = inlineMatch[2].trim();
            lines.pop();
            continue;
          }
          if (
            /^(sincerely|warm\s+regards|best\s+regards|regards|respectfully|yours\s+truly|with\s+appreciation|此致\s*敬礼|此致|敬礼|顺祝商祺)[!！。.]?$/i.test(line) ||
            (parsed.draftLetter.closing && line.toLowerCase() === parsed.draftLetter.closing.trim().toLowerCase())
          ) {
            if (!parsed.draftLetter.closing) parsed.draftLetter.closing = line;
            lines.pop();
            if (lines.length > 0 && /^此致[，,]?$/i.test(lines[lines.length - 1].trim())) {
              lines.pop();
              parsed.draftLetter.closing = "此致\n敬礼";
            }
            continue;
          }
          break;
        }

        const paragraphs = lines
          .join("\n")
          .trim()
          .split(/\n\s*\n+/)
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);

        parsed.draftLetter.body = paragraphs.join("\n\n");
      }
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Ghostwriter error:", error);
    const isTransient = isTransientGeminiError(error);
    const status = isTransient ? 503 : 500;
    const isZh = req.body?.language === "zh";
    res.status(status).json({
      error: isTransient
        ? (isZh ? TRANSIENT_BUSY_MESSAGE_ZH : TRANSIENT_BUSY_MESSAGE_EN)
        : extractErrorMessage(error, "Failed to process ghostwriter request."),
      isTransient,
    });
  }
});

// Draft a new letter
apiRouter.post("/letter/generate", async (req, res) => {
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

    const response = await withTransientRetry(() =>
      ai.models.generateContent({
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
      })
    );

    const rawText = response.text || "{}";
    const parsed = JSON.parse(rawText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Letter generation error:", error);
    const isTransient = isTransientGeminiError(error);
    const status = isTransient ? 503 : 500;
    const isZh = req.body?.language === "zh";
    res.status(status).json({
      error: isTransient
        ? (isZh ? TRANSIENT_BUSY_MESSAGE_ZH : TRANSIENT_BUSY_MESSAGE_EN)
        : extractErrorMessage(error, "Failed to generate letter. Please try again."),
      isTransient,
    });
  }
});

// Stream letter generation (SSE)
apiRouter.post("/letter/stream", async (req, res) => {
  try {
    const {
      prompt = "",
      letterType = "Resignation Letter",
      keyPoints = "",
      currentDraft = "",
      language = "en",
    } = req.body;

    const userPrompt = prompt || keyPoints || `Draft a professional ${letterType}. Existing context: ${currentDraft || "None"}`;
    if (!userPrompt.trim()) {
      res.status(400).json({ error: "Prompt or key points required for streaming." });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const ai = getGenAI();
    const isZh = language === "zh";

    const systemInstruction = isZh
      ? "你是一名专业而冷静的正式书信写作助手。请根据用户需求生成得体、有尊严的正式离职信内容。"
      : "You are a professional, calm resignation letter ghostwriter. Stream a dignified, well-structured formal resignation letter.";

    const stream = await withTransientRetry(() =>
      ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
        },
      })
    );

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Letter stream error:", error);
    const isTransient = isTransientGeminiError(error);
    const status = isTransient ? 503 : 500;
    const isZh = req.body?.language === "zh";
    const errMsg = isTransient
      ? (isZh ? TRANSIENT_BUSY_MESSAGE_ZH : TRANSIENT_BUSY_MESSAGE_EN)
      : extractErrorMessage(error, "Failed to stream letter.");
    if (!res.headersSent) {
      res.status(status).json({ error: errMsg, isTransient });
    } else {
      res.write(`data: ${JSON.stringify({ error: errMsg, isTransient })}\n\n`);
      res.end();
    }
  }
});

apiRouter.get("/letter/stream", (req, res) => {
  res.json({
    status: "ok",
    endpoint: "/api/letter/stream",
    description: "Accepts POST requests with SSE streaming for letter content generation",
  });
});

// Refine or adjust an existing letter
apiRouter.post("/letter/refine", async (req, res) => {
  try {
    const {
      currentLetter = "",
      action = "polish",
      instruction = "",
      targetTone = "",
      language = "en",
    } = req.body;

    if (!currentLetter.trim()) {
      res.status(400).json({ error: "Letter content is empty." });
      return;
    }

    const ai = getGenAI();
    const isZh = language === "zh";

    const prompt = `You are a master letter editor and writing coach.
Transform the following letter according to the requested improvement:

Action: ${action}
Specific Request / Instruction: ${instruction || "Polish for elegance, clarity, and impact"}
${targetTone ? `Desired Tone: ${targetTone}` : ""}
Language: ${isZh ? "Simplified Chinese (简体中文). Output the revised letter and changes summary strictly in Simplified Chinese." : "English"}

Original Letter:
"""
${currentLetter}
"""

Instructions:
1. Retain the core facts, names, and intent of the original letter while executing the requested improvement.
2. Ensure impeccable grammar, natural flow, and fitting vocabulary in the designated language.
3. Return the modified letter as well as a brief summary of what was enhanced.`;

    const response = await withTransientRetry(() =>
      ai.models.generateContent({
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
      })
    );

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      revisedLetter: parsed.revisedLetter,
      revisedText: parsed.revisedLetter,
      changesSummary: parsed.changesSummary,
      summaryOfChanges: parsed.changesSummary,
    });
  } catch (error: any) {
    console.error("Letter refinement error:", error);
    const isTransient = isTransientGeminiError(error);
    const status = isTransient ? 503 : 500;
    const isZh = req.body?.language === "zh";
    res.status(status).json({
      error: isTransient
        ? (isZh ? TRANSIENT_BUSY_MESSAGE_ZH : TRANSIENT_BUSY_MESSAGE_EN)
        : extractErrorMessage(error, "Failed to refine letter."),
      isTransient,
    });
  }
});

// Critique and provide etiquette review
apiRouter.post("/letter/critique", async (req, res) => {
  try {
    const { letter = "", context = "", language = "en" } = req.body;

    if (!letter.trim()) {
      res.status(400).json({ error: "Letter content is required for critique." });
      return;
    }

    const ai = getGenAI();
    const isZh = language === "zh";

    const prompt = `Analyze this resignation letter as a communications specialist and etiquette reviewer:

Target Language: ${isZh ? "Simplified Chinese (简体中文). All evaluations, verdicts, strengths, and recommendations MUST be written entirely in Simplified Chinese." : "English"}
Letter Context: ${context || "Professional resignation letter"}
Letter:
"""
${letter}
"""

Evaluate the letter strictly across tone, clarity, professional dignity, and standard formatting conventions.
STRICT RESTRICTION: Do NOT provide legal advice, legal-risk analysis, or career advice. Focus purely on writing composure and etiquette.`;

    const response = await withTransientRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallVerdict: { type: Type.STRING, description: "A one sentence high-level appraisal in the target language" },
              toneAnalysis: { type: Type.STRING, description: "Assessment of the emotional and professional tone in the target language" },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2 to 3 strong elements of the letter in the target language",
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2 to 4 actionable suggestions in the target language",
              },
              etiquetteCheck: { type: Type.STRING, description: "Notes on salutation, sign-off, or convention compliance" },
            },
            required: ["overallVerdict", "toneAnalysis", "strengths", "recommendations"],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Letter critique error:", error);
    const isTransient = isTransientGeminiError(error);
    const status = isTransient ? 503 : 500;
    const isZh = req.body?.language === "zh";
    res.status(status).json({
      error: isTransient
        ? (isZh ? TRANSIENT_BUSY_MESSAGE_ZH : TRANSIENT_BUSY_MESSAGE_EN)
        : extractErrorMessage(error, "Failed to critique letter."),
      isTransient,
    });
  }
});

// Mount the API router at /api (standard) and directly at root / (for Vercel rewrites or direct proxying)
app.use("/api", apiRouter);
app.use(apiRouter);

// Vite middleware & Production Serving for standalone runs
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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

export { app };
export default app;

// Only start standalone HTTP server when executed directly, not when imported as a serverless module (e.g. on Vercel)
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}
