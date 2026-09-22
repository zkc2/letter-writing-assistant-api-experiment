# Resignation Ghostwriter

Resignation Ghostwriter is a bilingual, AI-assisted prototype that helps people turn difficult workplace experiences into a clear, professional resignation letter. The interface presents the process as a **Quiet Exit Bureau** case workspace: users organize what happened, decide what belongs in the letter, confirm the core message, and review the final draft before using it.

**Live prototype:** [letter-writing-assistant-api-experi.vercel.app](https://letter-writing-assistant-api-experi.vercel.app)

## Who It Is For

This prototype is for people who know they want to leave a job but need help separating raw feelings and workplace history from the concise, professional message they will send to a supervisor. It is designed to support reflection and writing, not to make the decision for the user.

The interface and letter output support both English and Simplified Chinese.

## How to Use It

1. Choose English or Simplified Chinese.
2. Describe the workplace experiences and reasons behind the decision to resign.
3. Work through four case details:
   - the reason for resigning;
   - relevant workplace context;
   - the exact final working date and handover intent;
   - privacy boundaries—what should not appear in the letter.
4. Review the assistant's summary and correct anything inaccurate.
5. Confirm the summary before allowing the assistant to create a draft.
6. Edit or refine the letter, review earlier versions, and approve the final wording.
7. Copy the finished letter, print or export it as a PDF, or save the case in the current browser.

## What the AI Does

The assistant uses Google's Gemini model through a server-side API. It receives the conversation, the facts the user has confirmed, the requested letter language, and any stated boundaries. It is instructed to:

- ask for missing information one question at a time;
- avoid inventing names, dates, employers, or reasons;
- separate private background from wording intended for the letter;
- summarize the core message before drafting;
- wait for explicit confirmation before generating the resignation letter;
- produce a structured English business letter or a formal Chinese resignation letter.

The application also provides tools for revising wording, comparing versions, organizing a timeline, and checking the draft before approval.

## Privacy and Important Limitations

This is a prototype, not a legal, human-resources, mental-health, or confidentiality service.

- AI output can be incomplete, inaccurate, or inappropriate. The user must review every draft before sending it.
- Marking information as private controls what should appear in the letter; it is not a guarantee that the information never leaves the browser. Information used in an AI conversation is sent to the configured Gemini service for processing.
- Drafts, case details, language choice, and version history are stored in the browser's local storage. There is currently no user account or cloud synchronization for saved cases.
- Clearing browser data or switching browsers or devices can remove access to locally saved work.
- The prototype does not send a resignation letter, contact an employer, calculate a legally required notice period, or replace professional advice.
- AI features depend on the Gemini service and a correctly configured API key.

## Current Capabilities

- English and Simplified Chinese interface and letter output
- Guided, one-question-at-a-time intake
- Four-part fact and privacy-boundary checklist
- Timeline and case-file organization
- Confirmation before drafting
- Editable letter sheet and AI-assisted refinement
- Saved local cases and letter-version history
- Copy, print, and PDF-export workflow
- Responsive desktop and mobile layouts

## Technology

- React 19 and TypeScript
- Vite
- Express
- Google GenAI SDK and Gemini
- Tailwind CSS
- Motion and Lucide icons
- Vercel for hosting and serverless API routes

## Run the Project Locally

You will need Node.js and a Gemini API key.

1. Clone the repository and open its folder in VS Code.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and add your own key:

   ```env
   GEMINI_API_KEY=your_key_here
   ```

   Never commit `.env.local` or share the real key in screenshots or chat messages.

4. Start the local development server:

   ```bash
   npm run dev
   ```

5. Open the local address shown in the terminal.

Useful checks:

```bash
npm run lint
npm test
npm run build
```

## Project Status

This project is an exploratory prototype. Its interaction model, accessibility, responsive behavior, AI reliability, privacy communication, and difficult edge cases still need continued testing with real users. The current version demonstrates the full path from an unstructured workplace story to a user-reviewed resignation-letter draft.
