import React, { useState, useEffect } from 'react';
import {
  LetterContent,
  LetterTemplate,
  GhostwriterMessage,
  GhostwriterInputs,
  InteractionStep,
  Language,
} from './types';
import { getTemplates } from './data/templates';
import { getTranslation } from './i18n';
import { Header } from './components/Header';
import { LetterSheet } from './components/LetterSheet';
import { StationeryBar } from './components/StationeryBar';
import { GhostwriterChat } from './components/GhostwriterChat';
import { ComposerModal } from './components/ComposerModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { TemplatesModal } from './components/TemplatesModal';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { AboutSystemDiagramModal } from './components/AboutSystemDiagramModal';
import { Sparkles, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'resignation_ghostwriter_drafts_v3';
const ACTIVE_LETTER_KEY = 'resignation_ghostwriter_active_v3';
const GHOSTWRITER_MESSAGES_KEY = 'resignation_ghostwriter_messages_v3';
const GHOSTWRITER_INPUTS_KEY = 'resignation_ghostwriter_inputs_v3';
const LANGUAGE_STORAGE_KEY = 'resignation_ghostwriter_lang';

export const getBlankInitialLetter = (lang: Language = 'en'): LetterContent => ({
  id: 'letter-resignation-blank',
  title: lang === 'zh' ? '正式辞职通知书' : 'Notice of Resignation',
  date: new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  letterType: lang === 'zh' ? '正式辞职信' : 'Resignation Notice',
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
  closing: lang === 'zh' ? '此致\n敬礼' : 'Sincerely,',
  signoffName: '',
  postscript: '',
  stationery: 'classic',
  fontFamily: 'serif-reading',
  fontSize: 'base',
  advice: [],
  isApproved: false,
  coreReflection: '',
  updatedAt: Date.now(),
});

export const BLANK_INITIAL_LETTER = getBlankInitialLetter('en');

export const INITIAL_GHOSTWRITER_MESSAGES_EN: GhostwriterMessage[] = [
  {
    id: 'gw-intro-1-en',
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

export const INITIAL_GHOSTWRITER_MESSAGES_ZH: GhostwriterMessage[] = [
  {
    id: 'gw-intro-1-zh',
    role: 'assistant',
    content: `你好！我是你的专属辞职信 Ghostwriter（专业幕后撰写助手）。请把我当成站在你这一边的职场盟友——我不是 HR，更不是你的老板。\n\n在经历不公对待、身心俱疲或恶劣的职场环境后选择离开，往往令人身心俱疲。我的职责就是倾听你的经历，将内心的委屈与诉求转化为体面、克制且滴水不漏的正式辞职信，让你体面离开，绝不给对方留下任何把柄。\n\n让我们从第 1 步开始：你在工作中遇到了哪些难以忍受的处境，为什么决定离开？尽管把最真实、未经修饰的想法告诉我。`,
    clarifyingQuestions: [
      '你在工作中经历了哪些困难、委屈或具体的不顺心事件？',
    ],
    suggestedQuickReplies: [
      '长期过度内耗与严重职业倦怠',
      '管理层沟通受阻、缺乏起码的尊重与支持',
      '晋升承诺屡屡落空，发展陷入停滞',
      '已拿到更合适的新机会，希望平稳干净地交接',
    ],
    timestamp: Date.now(),
    isApproved: false,
  },
];

export const INITIAL_GHOSTWRITER_MESSAGES = INITIAL_GHOSTWRITER_MESSAGES_EN;

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
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const t = getTranslation(language);

  const [currentLetter, setCurrentLetter] = useState<LetterContent>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_LETTER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.sender?.name?.includes('Morgan') || parsed?.recipient?.name?.includes('Robert') || parsed?.body?.includes('Apex Logistics')) {
          return getBlankInitialLetter(language);
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return getBlankInitialLetter(language);
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
    return language === 'zh' ? INITIAL_GHOSTWRITER_MESSAGES_ZH : INITIAL_GHOSTWRITER_MESSAGES_EN;
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingGhostwriter, setIsLoadingGhostwriter] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'letter'>('chat');

  // Handle language switch persistence and updates
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }

    // If current letter is totally blank, adjust default title and closing to match language
    if (!currentLetter.body && !currentLetter.sender.name && !currentLetter.recipient.name) {
      setCurrentLetter((prev) => ({
        ...prev,
        title: newLang === 'zh' ? '正式辞职通知书' : 'Notice of Resignation',
        closing: newLang === 'zh' ? '此致\n敬礼' : 'Sincerely,',
        letterType: newLang === 'zh' ? '正式辞职信' : 'Resignation Notice',
        date: new Date().toLocaleDateString(newLang === 'zh' ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
    }

    // If messages are just the initial 1 message, swap to localized greeting
    if (messages.length === 1 && messages[0].id.startsWith('gw-intro')) {
      setMessages(newLang === 'zh' ? [...INITIAL_GHOSTWRITER_MESSAGES_ZH] : [...INITIAL_GHOSTWRITER_MESSAGES_EN]);
    }
  };

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
          language,
        }),
      });

      if (!response.ok) {
        let errorMsg = language === 'zh' ? '撰写助手服务暂时不可用。' : 'Ghostwriter service unavailable.';
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();

      const assistantMsg: GhostwriterMessage = {
        id: 'msg-asst-' + Date.now(),
        role: 'assistant',
        content: data.agentReply || (language === 'zh' ? '我已了解。让我们一起确保这封辞职信能充分保障你的尊严与权益。' : 'I hear you. Let us make sure this letter protects you.'),
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
          title: dl.title || prev.title || (language === 'zh' ? '正式辞职通知书' : 'Notice of Resignation'),
          subject: dl.subject || prev.subject,
          salutation: dl.salutation || prev.salutation,
          body: dl.body,
          closing: dl.closing || prev.closing || (language === 'zh' ? '此致\n敬礼' : 'Sincerely,'),
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
        showToast(language === 'zh' ? '辞职信已确认批准！准备呈交主管。' : 'Resignation letter approved! Ready for your supervisor.');
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || (language === 'zh' ? '服务暂时不可用，请检查连接后重试。' : 'Ghostwriter service is currently unavailable. Please check connection and try again.');
      showToast((language === 'zh' ? '助手提示：' : 'Ghostwriter error: ') + errMsg);

      const errorMsg: GhostwriterMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: language === 'zh'
          ? `提示：${errMsg}\n\n请检查网络连接或 API 服务配置后重试。`
          : `Error: ${errMsg}\n\nPlease check your server connection or configuration and try again.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
    handleSendMessage(language === 'zh' ? '是的！这份草稿完全符合我的要求，我批准并确认。' : 'Yes! This draft is exactly what I need. I approve it.');
    showToast(language === 'zh' ? '辞职信已确认批准！准备呈交主管。' : 'Resignation letter approved! Ready for your supervisor.');
  };

  const handleStartFreshSession = () => {
    const freshLetter = getBlankInitialLetter(language);
    setCurrentLetter(freshLetter);
    setKnownInputs({ ...BLANK_KNOWN_INPUTS });
    setMessages(language === 'zh' ? [...INITIAL_GHOSTWRITER_MESSAGES_ZH] : [...INITIAL_GHOSTWRITER_MESSAGES_EN]);
    try {
      localStorage.removeItem(ACTIVE_LETTER_KEY);
      localStorage.removeItem(GHOSTWRITER_MESSAGES_KEY);
      localStorage.removeItem(GHOSTWRITER_INPUTS_KEY);
    } catch {
      // ignore
    }
    showToast(language === 'zh' ? '已开启新会话：字段已清空，追踪进度归零。' : 'Fresh session started: all fields blank, tracker at 0/4.');
  };

  const handleResetSession = () => {
    handleStartFreshSession();
  };

  const handleSelectTemplate = (template: LetterTemplate) => {
    const newLetter: LetterContent = {
      id: 'letter-' + Date.now(),
      title: template.sample.title || template.title,
      date: new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      letterType: template.letterType,
      sender: {
        name: template.sample.sender?.name || currentLetter.sender.name || (language === 'zh' ? '您的姓名' : 'Your Name'),
        title: template.sample.sender?.title || currentLetter.sender.title || '',
        organization: template.sample.sender?.organization || '',
        address: template.sample.sender?.address || '',
        contact: template.sample.sender?.contact || '',
      },
      recipient: {
        name: template.sample.recipient?.name || (language === 'zh' ? '主管姓名' : 'Supervisor Name'),
        title: template.sample.recipient?.title || (language === 'zh' ? '部门负责人' : 'Director'),
        organization: template.sample.recipient?.organization || '',
        address: template.sample.recipient?.address || '',
      },
      subject: template.sample.subject || (language === 'zh' ? `正式辞职通知 — ${template.sample.signoffName || '您的姓名'}` : `Notice of Resignation — ${template.sample.signoffName || 'Your Name'}`),
      salutation: template.sample.salutation || (language === 'zh' ? '尊敬的领导：' : 'Dear Supervisor,'),
      body: template.sample.body || '',
      closing: template.sample.closing || (language === 'zh' ? '此致\n敬礼' : 'Sincerely,'),
      signoffName: template.sample.signoffName || currentLetter.sender.name || (language === 'zh' ? '您的姓名' : 'Your Name'),
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
    handleSendMessage(
      language === 'zh'
        ? `我载入了“${template.title}”场景范本。请协助根据我个人的具体情况进行针对性调整。`
        : `I loaded the "${template.title}" scenario. Let's adapt this framework to my specific situation.`
    );
    showToast(language === 'zh' ? `已载入“${template.title}”场景。` : `Loaded "${template.title}" scenario.`);
  };

  const handleLoadDraft = (draft: LetterContent) => {
    setCurrentLetter(draft);
    showToast(language === 'zh' ? `已载入草稿：${draft.title || '辞职信'}` : `Loaded draft: ${draft.title || 'Resignation Letter'}`);
  };

  const handleDeleteDraft = (id: string) => {
    const remaining = drafts.filter((d) => d.id !== id);
    setDrafts(remaining);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    if (currentLetter.id === id && remaining.length > 0) {
      setCurrentLetter(remaining[0]);
    }
    showToast(language === 'zh' ? '草稿已删除。' : 'Draft deleted.');
  };

  const handleDuplicateDraft = (draft: LetterContent) => {
    const copy: LetterContent = {
      ...draft,
      id: 'letter-' + Date.now(),
      title: `${draft.title || (language === 'zh' ? '辞职信' : 'Resignation')} (${language === 'zh' ? '副本' : 'Copy'})`,
      updatedAt: Date.now(),
    };
    setCurrentLetter(copy);
    showToast(language === 'zh' ? '草稿已复制。' : 'Draft duplicated.');
  };

  const handleApplyAIRewrite = (updatedBody: string, summary?: string) => {
    setCurrentLetter((prev) => ({
      ...prev,
      body: updatedBody,
      updatedAt: Date.now(),
    }));
    showToast(summary ? `${language === 'zh' ? '已应用优化：' : 'Applied polish: '}${summary}` : (language === 'zh' ? '已将调整应用至信件。' : 'Applied polish to letter.'));
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
        onOpenAbout={() => setIsAboutOpen(true)}
        savedCount={drafts.length}
        isApproved={currentLetter.isApproved}
        language={language}
        onLanguageChange={handleLanguageChange}
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
            <span>{language === 'zh' ? '撰写助手' : 'Ghostwriter'}</span>
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
            <span>{language === 'zh' ? '实时信纸' : 'Live Letter Sheet'}</span>
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
              language={language}
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
              language={language}
            />

            {/* Live Letter Sheet Component */}
            <LetterSheet
              letter={currentLetter}
              onChange={setCurrentLetter}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
              isApproved={currentLetter.isApproved}
              language={language}
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
          showToast(language === 'zh' ? '个案详情已与撰写助手同步。' : 'Case details shared with Ghostwriter.');
        }}
        initialSender={currentLetter.sender}
        language={language}
      />

      {/* AI Assistant Polish & Safety Audit Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        letter={currentLetter}
        onApplyRevision={handleApplyAIRewrite}
        language={language}
      />

      {/* Resignation Scenarios & Archetypes Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        language={language}
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
        language={language}
      />

      {/* About & System Architecture Diagram Modal */}
      <AboutSystemDiagramModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        language={language}
      />
    </div>
  );
}

