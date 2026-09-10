import React, { useState, useEffect } from 'react';
import {
  LetterContent,
  LetterTemplate,
  GhostwriterMessage,
  GhostwriterInputs,
  InteractionStep,
} from './types';
import { LETTER_TEMPLATES } from './data/templates';
import { Header } from './components/Header';
import { LetterSheet } from './components/LetterSheet';
import { StationeryBar } from './components/StationeryBar';
import { GhostwriterChat } from './components/GhostwriterChat';
import { ComposerModal } from './components/ComposerModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { TemplatesModal } from './components/TemplatesModal';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { Sparkles, MessageSquare, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'resignation_ghostwriter_drafts_v3';
const ACTIVE_LETTER_KEY = 'resignation_ghostwriter_active_v3';
const GHOSTWRITER_MESSAGES_KEY = 'resignation_ghostwriter_messages_v3';
const GHOSTWRITER_INPUTS_KEY = 'resignation_ghostwriter_inputs_v3';

export const BLANK_INITIAL_LETTER: LetterContent = {
  id: 'letter-resignation-blank',
  title: 'Notice of Resignation',
  date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  letterType: 'Resignation Notice',
  sender: {
    name: '',
    title: '',
    organization: '',
    address: '',
    contact: '',
  },
  recipient: {
    name: '',
    title: '',
    organization: '',
    address: '',
  },
  subject: '',
  salutation: '',
  body: '',
  closing: 'Sincerely,',
  signoffName: '',
  postscript: '',
  stationery: 'classic',
  fontFamily: 'serif-reading',
  fontSize: 'base',
  advice: [],
  isApproved: false,
  coreReflection: '',
  updatedAt: Date.now(),
};

export const INITIAL_GHOSTWRITER_MESSAGES: GhostwriterMessage[] = [
  {
    id: 'gw-intro-1',
    role: 'assistant',
    content: `Hey there. I'm your Resignation Ghostwriter. Think of me as your supportive friend who has your back—not HR, and definitely not your boss.\n\nLeaving a job after enduring unfair treatment, burnout, or difficult workplace experiences is exhausting. My role is to help you turn those challenges into a professional resignation draft so you can leave with complete dignity and your professional standing intact.\n\nTo get started with Step 1: What difficult situations have you experienced at work, and why do you want to leave this job? Give me the messy, unfiltered version.`,
    clarifyingQuestions: [
      'What difficult situations or challenges have you experienced at work?',
    ],
    suggestedQuickReplies: [
      'Burnout and excessive workload',
      'Managerial friction and lack of support',
      'Stalled advancement and broken promises',
      'Accepted a new opportunity with a clean transition',
    ],
    timestamp: Date.now(),
    isApproved: false,
  },
];

export const BLANK_KNOWN_INPUTS: GhostwriterInputs = {
  whyResigning: '',
  badExperiences: '',
  whatToSay: '',
  whatNotToSay: '',
  noticePeriodOrDate: '',
  supervisorName: '',
  senderName: '',
  senderTitle: '',
};

export default function App() {
  const [currentLetter, setCurrentLetter] = useState<LetterContent>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_LETTER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.sender?.name?.includes('Morgan') || parsed?.recipient?.name?.includes('Robert') || parsed?.body?.includes('Apex Logistics')) {
          return BLANK_INITIAL_LETTER;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return BLANK_INITIAL_LETTER;
  });

  const [drafts, setDrafts] = useState<LetterContent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (d) => !d?.sender?.name?.includes('Morgan') && !d?.recipient?.name?.includes('Robert') && !d?.body?.includes('Apex Logistics')
          );
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [messages, setMessages] = useState<GhostwriterMessage[]>(() => {
    try {
      const saved = localStorage.getItem(GHOSTWRITER_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasMorgan = parsed.some((m: any) => m?.content?.includes('Morgan') || m?.content?.includes('Robert'));
          if (!hasMorgan) return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_GHOSTWRITER_MESSAGES;
  });

  const [knownInputs, setKnownInputs] = useState<GhostwriterInputs>(() => {
    try {
      const saved = localStorage.getItem(GHOSTWRITER_INPUTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.senderName?.includes('Morgan') || parsed?.supervisorName?.includes('Robert')) {
          return BLANK_KNOWN_INPUTS;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return BLANK_KNOWN_INPUTS;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingGhostwriter, setIsLoadingGhostwriter] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'letter'>('chat');

  // Derive interaction step (1 to 5)
  const currentStep: InteractionStep = currentLetter.isApproved
    ? 5
    : currentLetter.body
    ? 4
    : messages.length >= 4
    ? 3
    : messages.length >= 2
    ? 2
    : 1;

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_LETTER_KEY, JSON.stringify(currentLetter));
      localStorage.setItem(GHOSTWRITER_MESSAGES_KEY, JSON.stringify(messages));
      localStorage.setItem(GHOSTWRITER_INPUTS_KEY, JSON.stringify(knownInputs));
      setDrafts((prev) => {
        const index = prev.findIndex((d) => d.id === currentLetter.id);
        let updated: LetterContent[];
        if (index >= 0) {
          updated = [...prev];
          updated[index] = currentLetter;
        } else {
          updated = [currentLetter, ...prev];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Ignore
    }
  }, [currentLetter, messages, knownInputs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const handleUpdateKnownInput = (key: keyof GhostwriterInputs, val: string) => {
    setKnownInputs((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Conversational Ghostwriter message handler
  const handleSendMessage = async (userText: string) => {
    const userMsg: GhostwriterMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoadingGhostwriter(true);

    try {
      const response = await fetch('/api/ghostwriter/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          currentDraft: {
            subject: currentLetter.subject,
            salutation: currentLetter.salutation,
            body: currentLetter.body,
            closing: currentLetter.closing,
            signoffName: currentLetter.signoffName,
            recipientName: currentLetter.recipient.name,
          },
          knownInputs,
        }),
      });

      if (!response.ok) {
        throw new Error('Ghostwriter service unavailable.');
      }

      const data = await response.json();

      const assistantMsg: GhostwriterMessage = {
        id: 'msg-asst-' + Date.now(),
        role: 'assistant',
        content: data.agentReply || 'I hear you. Let us make sure this letter protects you.',
        coreReflection: data.coreMessageReflection,
        clarifyingQuestions: data.clarifyingQuestions,
        suggestedQuickReplies: data.suggestedQuickReplies,
        isApproved: data.isApproved,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If draft was returned and marked ready, update current letter body
      if (data.draftLetter && data.draftLetter.ready && data.draftLetter.body) {
        const dl = data.draftLetter;
        setCurrentLetter((prev) => ({
          ...prev,
          title: dl.title || prev.title || 'Notice of Resignation',
          subject: dl.subject || prev.subject,
          salutation: dl.salutation || prev.salutation,
          body: dl.body,
          closing: dl.closing || prev.closing || 'Sincerely,',
          signoffName: dl.signoffName || prev.signoffName,
          sender: {
            ...prev.sender,
            name: dl.signoffName || prev.sender.name,
            title: dl.senderTitle || prev.sender.title,
          },
          recipient: {
            ...prev.recipient,
            name: dl.recipientName || prev.recipient.name,
            title: dl.recipientTitle || prev.recipient.title,
            organization: dl.organization || prev.recipient.organization,
          },
          isApproved: data.isApproved ? true : prev.isApproved,
          coreReflection: data.coreMessageReflection || prev.coreReflection,
          updatedAt: Date.now(),
        }));
      } else if (data.draftLetter) {
        // Only update metadata (names/titles if extracted), but keep body untouched until user confirms
        const dl = data.draftLetter;
        setCurrentLetter((prev) => ({
          ...prev,
          sender: {
            ...prev.sender,
            name: dl.signoffName || prev.sender.name,
            title: dl.senderTitle || prev.sender.title,
          },
          recipient: {
            ...prev.recipient,
            name: dl.recipientName || prev.recipient.name,
            title: dl.recipientTitle || prev.recipient.title,
            organization: dl.organization || prev.recipient.organization,
          },
          coreReflection: data.coreMessageReflection || prev.coreReflection,
          updatedAt: Date.now(),
        }));
      }

      // Merge extracted inputs
      if (data.extractedInputs) {
        setKnownInputs((prev) => ({
          ...prev,
          ...data.extractedInputs,
        }));
      }

      if (data.isApproved) {
        showToast('Resignation letter approved! Ready for your supervisor.');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Ghostwriter error: ' + (err.message || 'Please retry.'));
    } finally {
      setIsLoadingGhostwriter(false);
    }
  };

  const handleApproveLetter = () => {
    setCurrentLetter((prev) => ({
      ...prev,
      isApproved: true,
      updatedAt: Date.now(),
    }));
    handleSendMessage('Yes! This draft is exactly what I need. I approve it.');
    showToast('Resignation letter approved! Ready for your supervisor.');
  };

  const handleStartFreshSession = () => {
    const freshLetter: LetterContent = {
      ...BLANK_INITIAL_LETTER,
      id: 'letter-resignation-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      updatedAt: Date.now(),
    };
    setCurrentLetter(freshLetter);
    setKnownInputs({ ...BLANK_KNOWN_INPUTS });
    setMessages([...INITIAL_GHOSTWRITER_MESSAGES]);
    try {
      localStorage.removeItem(ACTIVE_LETTER_KEY);
      localStorage.removeItem(GHOSTWRITER_MESSAGES_KEY);
      localStorage.removeItem(GHOSTWRITER_INPUTS_KEY);
    } catch {
      // ignore
    }
    showToast('Fresh session started: all fields blank, tracker at 0/4.');
  };

  const handleResetSession = () => {
    handleStartFreshSession();
  };

  const handleSelectTemplate = (template: LetterTemplate) => {
    const newLetter: LetterContent = {
      id: 'letter-' + Date.now(),
      title: template.sample.title || template.title,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      letterType: template.letterType,
      sender: {
        name: template.sample.sender?.name || currentLetter.sender.name || 'Your Name',
        title: template.sample.sender?.title || currentLetter.sender.title || '',
        organization: template.sample.sender?.organization || '',
        address: template.sample.sender?.address || '',
        contact: template.sample.sender?.contact || '',
      },
      recipient: {
        name: template.sample.recipient?.name || 'Supervisor Name',
        title: template.sample.recipient?.title || 'Director',
        organization: template.sample.recipient?.organization || '',
        address: template.sample.recipient?.address || '',
      },
      subject: template.sample.subject || `Notice of Resignation — ${template.sample.signoffName || 'Your Name'}`,
      salutation: template.sample.salutation || 'Dear Supervisor,',
      body: template.sample.body || '',
      closing: template.sample.closing || 'Sincerely,',
      signoffName: template.sample.signoffName || currentLetter.sender.name || 'Your Name',
      postscript: template.sample.postscript || '',
      stationery: 'classic',
      fontFamily: 'serif-reading',
      fontSize: 'base',
      advice: template.ghostwriterPointers,
      isApproved: false,
      updatedAt: Date.now(),
    };

    setCurrentLetter(newLetter);
    // Notify ghostwriter in chat
    handleSendMessage(`I loaded the "${template.title}" scenario. Let's adapt this framework to my specific situation.`);
    showToast(`Loaded "${template.title}" scenario.`);
  };

  const handleLoadDraft = (draft: LetterContent) => {
    setCurrentLetter(draft);
    showToast(`Loaded draft: ${draft.title || 'Resignation Letter'}`);
  };

  const handleDeleteDraft = (id: string) => {
    const remaining = drafts.filter((d) => d.id !== id);
    setDrafts(remaining);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    if (currentLetter.id === id && remaining.length > 0) {
      setCurrentLetter(remaining[0]);
    }
    showToast('Draft deleted.');
  };

  const handleDuplicateDraft = (draft: LetterContent) => {
    const copy: LetterContent = {
      ...draft,
      id: 'letter-' + Date.now(),
      title: `${draft.title || 'Resignation'} (Copy)`,
      updatedAt: Date.now(),
    };
    setCurrentLetter(copy);
    showToast('Draft duplicated.');
  };

  const handleApplyAIRewrite = (updatedBody: string, summary?: string) => {
    setCurrentLetter((prev) => ({
      ...prev,
      body: updatedBody,
      updatedAt: Date.now(),
    }));
    showToast(summary ? `Applied polish: ${summary}` : 'Applied polish to letter.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans-clean selection:bg-amber-200">
      {/* Top Header */}
      <Header
        currentLetter={currentLetter}
        onNewLetter={handleStartFreshSession}
        onOpenCaseForm={() => setIsComposerOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        savedCount={drafts.length}
        isApproved={currentLetter.isApproved}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden px-4 pt-3 pb-1 flex items-center justify-center">
        <div className="bg-stone-200/80 p-1 rounded-xl flex items-center gap-1 text-xs w-full max-w-md">
          <button
            onClick={() => setActiveMobileTab('chat')}
            className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'chat'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Ghostwriter</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('letter')}
            className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'letter'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-stone-700" />
            <span>Live Letter Sheet</span>
            {currentLetter.isApproved && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Resignation Ghostwriter Chat Workspace */}
          <div
            className={`lg:col-span-5 xl:col-span-5 h-[760px] flex flex-col ${
              activeMobileTab === 'chat' ? 'block' : 'hidden lg:flex'
            }`}
          >
            <GhostwriterChat
              messages={messages}
              onSendMessage={handleSendMessage}
              currentLetter={currentLetter}
              knownInputs={knownInputs}
              onUpdateInput={handleUpdateKnownInput}
              isLoading={isLoadingGhostwriter}
              onApproveLetter={handleApproveLetter}
              isApproved={Boolean(currentLetter.isApproved)}
              onResetSession={handleResetSession}
              currentStep={currentStep}
            />
          </div>

          {/* Right Column: Stationery Toolbar & Live Letter Sheet */}
          <div
            className={`lg:col-span-7 xl:col-span-7 flex flex-col items-center space-y-4 ${
              activeMobileTab === 'letter' ? 'block' : 'hidden lg:flex'
            }`}
          >
            {/* Stationery / Typography styling bar */}
            <StationeryBar
              letter={currentLetter}
              onChange={setCurrentLetter}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
            />

            {/* Live Letter Sheet Component */}
            <LetterSheet
              letter={currentLetter}
              onChange={setCurrentLetter}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
              isApproved={currentLetter.isApproved}
            />
          </div>
        </div>
      </main>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-100 text-xs px-4 py-2.5 rounded-xl shadow-xl border border-stone-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Structured Resignation Intake Form Modal */}
      <ComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmitInputs={(inputs, detailsMessage) => {
          setKnownInputs((prev) => ({ ...prev, ...inputs }));
          handleSendMessage(detailsMessage);
          showToast('Case details shared with Ghostwriter.');
        }}
        initialSender={currentLetter.sender}
      />

      {/* AI Assistant Polish & Safety Audit Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        letter={currentLetter}
        onApplyRevision={handleApplyAIRewrite}
      />

      {/* Resignation Scenarios & Archetypes Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Saved Drafts Modal */}
      <SavedDraftsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        onDuplicateDraft={handleDuplicateDraft}
        currentId={currentLetter.id}
      />
    </div>
  );
}
