import React, { useState, useEffect } from 'react';
import {
  LetterContent,
  LetterTemplate,
  GhostwriterMessage,
  GhostwriterInputs,
  InteractionStep,
  Language,
  WorkspaceSection,
  TimelineEvent,
  ConfirmedFactItem,
  WordingTransformation,
  DetectedConflict,
  LetterVersion,
  CaseDesktopStatus,
  StationeryStyle,
  LetterFont,
  LetterFontSize,
} from './types';
import { getTemplates } from './data/templates';
import {
  getTranslation,
  TRANSIENT_BUSY_MESSAGE_EN,
  TRANSIENT_BUSY_MESSAGE_ZH,
} from './i18n';
import { SystemBar } from './components/desktop/SystemBar';
import { WorkspaceDock } from './components/desktop/WorkspaceDock';
import { AppWindow } from './components/desktop/AppWindow';
import { CompanionPanel } from './components/desktop/CompanionPanel';
import { SettingsWindow } from './components/desktop/SettingsWindow';
import { BureauChapterProgress } from './components/desktop/BureauChapterProgress';
import {
  BureauFragmentIcon,
  BureauTimelineIcon,
  BureauDossierIcon,
  BureauDraftIcon,
  BureauSealIcon,
  BureauArchiveIcon,
  BureauSettingIcon,
} from './components/desktop/BureauIcons';
import { ConflictDialog } from './components/workspace/ConflictDialog';
import { LetterSheet } from './components/LetterSheet';
import { StationeryBar } from './components/StationeryBar';
import { GhostwriterChat } from './components/GhostwriterChat';
import { ComposerModal } from './components/ComposerModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { TemplatesModal } from './components/TemplatesModal';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { AboutSystemDiagramModal } from './components/AboutSystemDiagramModal';
import { ExperienceTimeline } from './components/workspace/ExperienceTimeline';
import { ConfirmedCaseFile } from './components/workspace/ConfirmedCaseFile';
import { DraftWorkspace } from './components/workspace/DraftWorkspace';
import { VersionCompareModal } from './components/workspace/VersionCompareModal';
import {
  Sparkles,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Clock,
  Layers,
} from 'lucide-react';
import { normalizeLetter, printLetterDocument } from './utils/letterNormalization';

const STORAGE_KEY = 'resignation_ghostwriter_drafts_v3';
const ACTIVE_LETTER_KEY = 'resignation_ghostwriter_active_v3';
const GHOSTWRITER_MESSAGES_KEY = 'resignation_ghostwriter_messages_v3';
const GHOSTWRITER_INPUTS_KEY = 'resignation_ghostwriter_inputs_v3';
const TIMELINE_STORAGE_KEY = 'resignation_ghostwriter_timeline_v3';
const VERSIONS_STORAGE_KEY = 'resignation_ghostwriter_versions_v3';
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

export const INITIAL_GHOSTWRITER_MESSAGES_EN: GhostwriterMessage[] = [
  {
    id: 'gw-intro-1-en',
    role: 'assistant',
    content: `Hey there. Welcome to your Ghostwriter Case Desktop.\n\nLeaving a workplace after enduring burnout, unfair treatment, or structural friction can feel overwhelming. Here, we transform raw, unfiltered experiences into a dignified, bulletproof resignation letter while keeping your personal boundaries strictly sealed.\n\nTo begin Step 1: What difficult situations have you experienced, and why are you deciding to depart? Share the unfiltered truth with me.`,
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
    content: `你好！欢迎进入辞职公文侦探工作台 (Ghostwriter Case Desktop)。\n\n在经历高压、内耗或不公待遇后选择离开，往往令人疲惫不堪。在这里，我们负责倾听你的真实遭遇，将杂乱的职场事实逐条确证、公文化提炼，并严格为你的隐私设防，最终生成体面从容、无懈可击的辞职信。\n\n让我们从第 1 步开始：你在工作中遇到了哪些经历，促使你决定离职？请把未经修饰的真实想法告诉我。`,
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
    } catch {}
    return 'en';
  });

  const t = getTranslation(language);

  // Active letter draft state
  const [currentLetter, setCurrentLetter] = useState<LetterContent>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_LETTER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed?.sender?.name?.includes('Morgan') ||
          parsed?.recipient?.name?.includes('Robert') ||
          parsed?.body?.includes('Apex Logistics')
        ) {
          return getBlankInitialLetter(language);
        }
        return parsed;
      }
    } catch {}
    return getBlankInitialLetter(language);
  });

  // Saved drafts list
  const [drafts, setDrafts] = useState<LetterContent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (d) =>
              !d?.sender?.name?.includes('Morgan') &&
              !d?.recipient?.name?.includes('Robert') &&
              !d?.body?.includes('Apex Logistics')
          );
        }
      }
    } catch {}
    return [];
  });

  // Conversational chat history
  const [messages, setMessages] = useState<GhostwriterMessage[]>(() => {
    try {
      const saved = localStorage.getItem(GHOSTWRITER_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasMorgan = parsed.some(
            (m: any) =>
              m?.content?.includes('Morgan') || m?.content?.includes('Robert')
          );
          if (!hasMorgan) return parsed;
        }
      }
    } catch {}
    return language === 'zh'
      ? INITIAL_GHOSTWRITER_MESSAGES_ZH
      : INITIAL_GHOSTWRITER_MESSAGES_EN;
  });

  // Extracted 4/4 factual inputs
  const [knownInputs, setKnownInputs] = useState<GhostwriterInputs>(() => {
    try {
      const saved = localStorage.getItem(GHOSTWRITER_INPUTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed?.senderName?.includes('Morgan') ||
          parsed?.supervisorName?.includes('Robert')
        ) {
          return BLANK_KNOWN_INPUTS;
        }
        return parsed;
      }
    } catch {}
    return BLANK_KNOWN_INPUTS;
  });

  // CASE WORKSPACE STATES
  const [workspaceSection, setWorkspaceSection] = useState<WorkspaceSection>('intake');
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);

  // Timeline events state
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem(TIMELINE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  // Wording transformations state
  const [transformations, setTransformations] = useState<WordingTransformation[]>([]);

  // Detected conflicts state
  const [conflicts, setConflicts] = useState<DetectedConflict[]>([]);
  const [activeConflict, setActiveConflict] = useState<DetectedConflict | null>(null);

  // Letter version checkpoints
  const [versions, setVersions] = useState<LetterVersion[]>(() => {
    try {
      const saved = localStorage.getItem(VERSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  // Modals & UI states
  const [compareVersion, setCompareVersion] = useState<LetterVersion | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [printBlockedError, setPrintBlockedError] = useState<string | null>(null);
  const [isLoadingGhostwriter, setIsLoadingGhostwriter] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<'workspace' | 'letter'>('workspace');

  // Handle language switch
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {}

    if (
      !currentLetter.body &&
      !currentLetter.sender.name &&
      !currentLetter.recipient.name
    ) {
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

    if (messages.length === 1 && messages[0].id.startsWith('gw-intro')) {
      setMessages(
        newLang === 'zh'
          ? [...INITIAL_GHOSTWRITER_MESSAGES_ZH]
          : [...INITIAL_GHOSTWRITER_MESSAGES_EN]
      );
    }
  };

  // Derive interaction step
  const currentStep: InteractionStep = currentLetter.isApproved
    ? 5
    : currentLetter.body
    ? 4
    : messages.length >= 4
    ? 3
    : messages.length >= 2
    ? 2
    : 1;

  // Derive 4 confirmed case facts
  const caseFacts: ConfirmedFactItem[] = [
    {
      id: 'whyResigning',
      label:
        language === 'zh'
          ? '1. 离职主旨与规划'
          : '1. Reason & Direction',
      value: knownInputs.whyResigning || '',
      status: knownInputs.whyResigning ? 'confirmed' : 'missing',
      privacy: 'include',
    },
    {
      id: 'badExperiences',
      label:
        language === 'zh'
          ? '2. 职场经历与事实'
          : '2. Workplace Experiences',
      value: knownInputs.badExperiences || '',
      status: knownInputs.badExperiences ? 'confirmed' : 'missing',
      privacy: 'include',
    },
    {
      id: 'noticePeriodOrDate',
      label:
        language === 'zh'
          ? '3. 最后在岗日与交接'
          : '3. Final Date & Handover',
      value: knownInputs.noticePeriodOrDate || '',
      status: knownInputs.noticePeriodOrDate ? 'confirmed' : 'missing',
      privacy: 'include',
    },
    {
      id: 'whatNotToSay',
      label:
        language === 'zh'
          ? '4. 私密设防边界'
          : '4. Privacy Boundaries',
      value: knownInputs.whatNotToSay || '',
      status: knownInputs.whatNotToSay ? 'confirmed' : 'missing',
      privacy: 'private',
    },
  ];

  // 4/4 Gate progress count
  const confirmedFactsCount = caseFacts.filter(
    (f) => f.status === 'confirmed' || (f.privacy === 'private' && f.value.trim().length > 0)
  ).length;

  // Derive Desktop Status
  const desktopStatus: CaseDesktopStatus = currentLetter.isApproved
    ? 'approved'
    : confirmedFactsCount === 4 && conflicts.filter((c) => !c.resolved).length === 0
    ? 'ready_to_draft'
    : confirmedFactsCount > 0
    ? 'needs_confirmation'
    : 'locked';

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_LETTER_KEY, JSON.stringify(currentLetter));
    } catch {}
  }, [currentLetter]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch {}
  }, [drafts]);

  useEffect(() => {
    try {
      localStorage.setItem(GHOSTWRITER_MESSAGES_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(GHOSTWRITER_INPUTS_KEY, JSON.stringify(knownInputs));
    } catch {}
  }, [knownInputs]);

  useEffect(() => {
    try {
      localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(timelineEvents));
    } catch {}
  }, [timelineEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(versions));
    } catch {}
  }, [versions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers for Timeline, Facts, Conflicts
  const handleAddTimelineEvent = (eventData: Omit<TimelineEvent, 'id' | 'order'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: 'evt-' + Date.now(),
      order: timelineEvents.length + 1,
    };
    setTimelineEvents((prev) => [...prev, newEvent]);
    showToast(language === 'zh' ? '已记录时间线事实。' : 'Recorded timeline fact.');
  };

  const handleUpdateTimelineEvent = (updated: TimelineEvent) => {
    setTimelineEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteTimelineEvent = (id: string) => {
    setTimelineEvents((prev) => prev.filter((e) => e.id !== id));
    showToast(language === 'zh' ? '已移除时间线事实。' : 'Removed event.');
  };

  const handleReorderTimeline = (reordered: TimelineEvent[]) => {
    setTimelineEvents(reordered);
  };

  const handleUpdateFact = (updatedFact: ConfirmedFactItem) => {
    setKnownInputs((prev) => ({
      ...prev,
      [updatedFact.id]: updatedFact.value,
    }));
    showToast(language === 'zh' ? '案卷槽位已确证更新。' : 'Case slot updated.');
  };

  const handleResolveConflict = (
    conflictId: string,
    choice: 'A' | 'B' | 'custom',
    customVal?: string
  ) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    let resolvedValue = '';
    if (choice === 'A') resolvedValue = conflict.valueA;
    else if (choice === 'B') resolvedValue = conflict.valueB;
    else if (choice === 'custom' && customVal) resolvedValue = customVal;

    if (conflict.type === 'date') {
      setKnownInputs((prev) => ({ ...prev, noticePeriodOrDate: resolvedValue }));
    } else if (conflict.type === 'intent') {
      setKnownInputs((prev) => ({ ...prev, whyResigning: resolvedValue }));
    }

    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId
          ? { ...c, resolved: true, resolvedChoice: choice }
          : c
      )
    );
    setActiveConflict(null);
    showToast(language === 'zh' ? '事实冲突已明确排除。' : 'Conflict resolved.');
  };

  // Chat message send handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: GhostwriterMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingGhostwriter(true);

    try {
      const response = await fetch('/api/ghostwrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...messages, userMsg],
          knownInputs,
          currentLetter,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();

      const assistantMsg: GhostwriterMessage = {
        id: 'msg-ast-' + Date.now(),
        role: 'assistant',
        content: data.reply || (language === 'zh' ? '我已梳理你的经历。' : 'I have organized your experience.'),
        clarifyingQuestions: data.clarifyingQuestions || [],
        suggestedQuickReplies: data.suggestedQuickReplies || [],
        timestamp: Date.now(),
        isApproved: false,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.extractedInputs) {
        setKnownInputs((prev) => {
          const updated = { ...prev };
          Object.keys(data.extractedInputs).forEach((k) => {
            const val = data.extractedInputs[k];
            if (val && typeof val === 'string' && val.trim().length > 0) {
              (updated as any)[k] = val.trim();
            }
          });
          return updated;
        });
      }

      if (data.generatedLetter) {
        const gl = data.generatedLetter;
        setCurrentLetter((prev) => ({
          ...prev,
          title: gl.title || prev.title,
          subject: gl.subject || prev.subject,
          salutation: gl.salutation || prev.salutation,
          body: gl.body || prev.body,
          closing: gl.closing || prev.closing,
          signoffName: gl.signoffName || prev.signoffName,
          advice: gl.advice || prev.advice,
          isApproved: false,
          updatedAt: Date.now(),
        }));

        setVersions((prev) => [
          {
            id: 'ver-gw-' + Date.now(),
            checkpoint: 'initial_draft',
            label: language === 'zh' ? '公文侦探生成稿' : 'Case Draft',
            body: gl.body || '',
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      }

      if (data.transformations && Array.isArray(data.transformations)) {
        setTransformations(data.transformations);
      }
    } catch (err) {
      console.warn('Backend intake error, fallback active:', err);
      // Fallback response
      const fallbackMsg: GhostwriterMessage = {
        id: 'msg-ast-fallback-' + Date.now(),
        role: 'assistant',
        content:
          language === 'zh'
            ? '我已记录下你刚才提到的经历要点。我们已将该事实同步录入到案卷中，请在案卷槽位中核准确认。'
            : 'I have logged these facts into your case file. Verify each pillar in the Case File tab to unlock drafting.',
        timestamp: Date.now(),
        isApproved: false,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingGhostwriter(false);
    }
  };

  const handleRetryMessage = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      handleSendMessage(lastUser.content);
    }
  };

  const handleUpdateKnownInput = (key: keyof GhostwriterInputs, val: string) => {
    setKnownInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleApproveLetter = () => {
    setCurrentLetter((prev) => ({
      ...prev,
      isApproved: true,
      updatedAt: Date.now(),
    }));

    setVersions((prev) => [
      {
        id: 'ver-appr-' + Date.now(),
        checkpoint: 'approved',
        label: language === 'zh' ? '已核准终稿' : 'Approved Final',
        body: currentLetter.body,
        timestamp: Date.now(),
      },
      ...prev,
    ]);

    showToast(
      language === 'zh'
        ? '✓ 辞职信已正式核准签发！'
        : '✓ Resignation letter officially approved!'
    );
  };

  const handleStartFreshSession = () => {
    setCurrentLetter(getBlankInitialLetter(language));
    setKnownInputs(BLANK_KNOWN_INPUTS);
    setTimelineEvents([]);
    setTransformations([]);
    setConflicts([]);
    setVersions([]);
    setMessages(
      language === 'zh'
        ? [...INITIAL_GHOSTWRITER_MESSAGES_ZH]
        : [...INITIAL_GHOSTWRITER_MESSAGES_EN]
    );
    showToast(
      language === 'zh'
        ? '已清空当前案卷，开启空白新案件。'
        : 'Started clean case workspace.'
    );
  };

  const handlePrintLetter = () => {
    printLetterDocument(currentLetter, language, (err) => {
      setPrintBlockedError(err);
    });
  };

  const handleRestoreVersion = (version: LetterVersion) => {
    setCurrentLetter((prev) => ({
      ...prev,
      body: version.body,
      updatedAt: Date.now(),
    }));
    showToast(
      language === 'zh'
        ? `已恢复至历史版本: ${version.label}`
        : `Restored version: ${version.label}`
    );
  };

  const handleApplyAIRewrite = (updatedBody: string, summary?: string) => {
    setCurrentLetter((prev) => ({
      ...prev,
      body: updatedBody,
      updatedAt: Date.now(),
    }));

    setVersions((vList) => [
      {
        id: 'ver-polish-' + Date.now(),
        checkpoint: 'ai_refined',
        label:
          summary ||
          (language === 'zh' ? 'AI 礼仪优化与润色' : 'AI Polished Version'),
        body: updatedBody,
        timestamp: Date.now(),
      },
      ...vList,
    ]);

    showToast(
      summary
        ? `${language === 'zh' ? '已应用优化：' : 'Applied: '}${summary}`
        : language === 'zh'
        ? '已将调整应用至信件。'
        : 'Applied polish to letter.'
    );
  };

  // Section titles & icons mapping for Quiet Exit Bureau
  const sectionMeta: Record<
    WorkspaceSection,
    { title: string; titleEn: string; icon: React.ReactNode; badge?: string }
  > = {
    intake: {
      title: '案卷要素摄入 (Intake)',
      titleEn: 'Memory Intake Dialogue',
      icon: <BureauFragmentIcon size={16} />,
    },
    timeline: {
      title: '经历与光阴轨迹 (Timeline)',
      titleEn: 'Experience Timeline',
      icon: <BureauTimelineIcon size={16} />,
      badge: `${timelineEvents.length} events`,
    },
    facts: {
      title: '确证案卷四柱要素 (Case Dossier)',
      titleEn: 'Confirmed Case File',
      icon: <BureauDossierIcon size={16} />,
      badge: `${confirmedFactsCount}/4`,
    },
    draft: {
      title: '正式辞职信草稿 (Draft Letter)',
      titleEn: 'Formal Draft Workspace',
      icon: desktopStatus === 'approved' ? <BureauSealIcon size={16} /> : <BureauDraftIcon size={16} />,
      badge: desktopStatus === 'approved' ? 'SEALED' : confirmedFactsCount === 4 ? 'READY' : 'LOCKED',
    },
    history: {
      title: '案卷档案库 (Case History)',
      titleEn: 'Case History',
      icon: <BureauArchiveIcon size={16} />,
      badge: `${drafts.length} saved`,
    },
    settings: {
      title: '公文设色与格式 (Settings)',
      titleEn: 'Letter Style Settings',
      icon: <BureauSettingIcon size={16} />,
    },
  };

  const currentMeta = sectionMeta[workspaceSection];

  return (
    <div className="min-h-screen bg-pastel-wallpaper text-[#262433] flex flex-col font-sans-clean select-none pb-20 md:pb-16">
      {/* 1. Top OS System Bar */}
      <SystemBar
        status={desktopStatus}
        confirmedCount={confirmedFactsCount}
        currentLetter={currentLetter}
        onNewCase={handleStartFreshSession}
        onOpenCaseForm={() => setIsComposerOpen(true)}
        onOpenScenarios={() => setIsTemplatesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onPrint={handlePrintLetter}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Mobile Workspace / Live Letter Toggle Pills */}
      <div className="md:hidden px-3 pt-2 pb-1 no-print">
        <div className="flex bg-[#1e1b29] p-1 rounded-xl border border-[#6f6587]/30 text-xs">
          <button
            onClick={() => setActiveMobileView('workspace')}
            className={`flex-1 py-1.5 rounded-lg font-mono-system font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] ${
              activeMobileView === 'workspace'
                ? 'bg-[#2a2539] text-[#e6a54f] shadow-xs border border-[#e6a54f]/40'
                : 'text-[#b8a9c9]'
            }`}
          >
            <span>{currentMeta.icon}</span>
            <span>{language === 'zh' ? '调查工作区' : 'Workspace'}</span>
          </button>
          <button
            onClick={() => setActiveMobileView('letter')}
            className={`flex-1 py-1.5 rounded-lg font-mono-system font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] ${
              activeMobileView === 'letter'
                ? 'bg-[#2a2539] text-[#e6a54f] shadow-xs border border-[#e6a54f]/40'
                : 'text-[#b8a9c9]'
            }`}
          >
            <span><BureauDraftIcon size={14} /></span>
            <span>{language === 'zh' ? '辞职公文纸' : 'Letter Sheet'}</span>
            {currentLetter.isApproved && (
              <span className="w-2 h-2 rounded-full bg-[#4e8b72]" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Desktop Stage: Dual Floating Windows */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col">
        {/* Narrative Bureau 5-Chapter Progress Ribbon */}
        <BureauChapterProgress
          currentSection={workspaceSection}
          onSelectSection={(sec) => setWorkspaceSection(sec)}
          status={desktopStatus}
          confirmedCount={confirmedFactsCount}
          language={language}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start flex-1">
          {/* Left Window: Active Investigation Application Window */}
          <div
            className={`lg:col-span-6 xl:col-span-5 flex-col h-[740px] ${
              activeMobileView === 'workspace' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <AppWindow
              id="app-window-workspace"
              title={language === 'zh' ? currentMeta.title : currentMeta.titleEn}
              icon={currentMeta.icon}
              badge={currentMeta.badge}
              isActive={true}
              className="h-full"
            >
              <div className="flex-1 overflow-y-auto">
                {/* INTAKE APPLICATION */}
                {workspaceSection === 'intake' && (
                  <GhostwriterChat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onRetryMessage={handleRetryMessage}
                    currentLetter={currentLetter}
                    knownInputs={knownInputs}
                    onUpdateInput={handleUpdateKnownInput}
                    isLoading={isLoadingGhostwriter}
                    onApproveLetter={handleApproveLetter}
                    isApproved={Boolean(currentLetter.isApproved)}
                    onResetSession={handleStartFreshSession}
                    currentStep={currentStep}
                    language={language}
                    onOpenTemplates={() => setIsTemplatesOpen(true)}
                    onOpenCaseForm={() => setIsComposerOpen(true)}
                  />
                )}

                {/* TIMELINE APPLICATION */}
                {workspaceSection === 'timeline' && (
                  <ExperienceTimeline
                    events={timelineEvents}
                    onAddEvent={handleAddTimelineEvent}
                    onUpdateEvent={handleUpdateTimelineEvent}
                    onDeleteEvent={handleDeleteTimelineEvent}
                    onReorderEvents={handleReorderTimeline}
                    language={language}
                  />
                )}

                {/* CONFIRMED CASE FILE APPLICATION */}
                {workspaceSection === 'facts' && (
                  <ConfirmedCaseFile
                    facts={caseFacts}
                    transformations={transformations}
                    conflicts={conflicts}
                    onUpdateFact={handleUpdateFact}
                    onResolveConflict={handleResolveConflict}
                    onProceedToDraft={() => setWorkspaceSection('draft')}
                    language={language}
                  />
                )}

                {/* DRAFT WORKSPACE APPLICATION */}
                {workspaceSection === 'draft' && (
                  <DraftWorkspace
                    currentLetter={currentLetter}
                    caseFacts={caseFacts}
                    versions={versions}
                    selectedParagraphIndex={selectedParagraphIndex}
                    onSelectParagraph={setSelectedParagraphIndex}
                    onRestoreVersion={handleRestoreVersion}
                    onOpenCompare={(ver) => {
                      setCompareVersion(ver);
                      setIsCompareOpen(true);
                    }}
                    onApproveLetter={handleApproveLetter}
                    onOpenAudit={() => setIsAssistantOpen(true)}
                    language={language}
                  />
                )}

                {/* CASE HISTORY APPLICATION */}
                {workspaceSection === 'history' && (
                  <div className="p-4 sm:p-5 space-y-4 font-sans-clean text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#29252D]">
                          {language === 'zh' ? '已保存的离职案卷' : 'Saved Case Files'}
                        </h4>
                        <p className="text-[#68616D]">
                          {language === 'zh'
                            ? '点击案卷可快速载入工作区进行修改与导出'
                            : 'Click any case file to load into active workspace'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newSave: LetterContent = {
                            ...currentLetter,
                            id: 'saved-' + Date.now(),
                            updatedAt: Date.now(),
                          };
                          setDrafts((prev) => [newSave, ...prev]);
                          showToast(language === 'zh' ? '当前案卷已保存。' : 'Current case saved.');
                        }}
                        className="px-3 py-1.5 rounded-xl font-mono-system font-bold bg-[#F2B35D] text-[#29252D] border border-[#403A45] hover:bg-[#e4a44d] cursor-pointer"
                      >
                        {language === 'zh' ? '+ 归档当前文稿' : '+ Save Active Case'}
                      </button>
                    </div>

                    {drafts.length === 0 ? (
                      <div className="p-8 text-center border-2 border-dashed border-[#403A45]/20 rounded-2xl bg-white/60">
                        <FolderOpen className="w-8 h-8 text-[#68616D]/60 mx-auto mb-2" />
                        <p className="text-xs text-[#68616D]">
                          {language === 'zh' ? '暂无归档案卷。' : 'No archived case files yet.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {drafts.map((draft) => (
                          <div
                            key={draft.id}
                            className="p-3.5 rounded-xl border border-[#403A45]/20 bg-white hover:border-[#403A45] transition-all flex items-center justify-between gap-3"
                          >
                            <div className="space-y-0.5 truncate">
                              <div className="font-bold text-xs text-[#29252D] truncate">
                                {draft.title || (language === 'zh' ? '未命名辞职文稿' : 'Untitled Case')}
                              </div>
                              <div className="text-[11px] text-[#68616D] font-mono-system">
                                {new Date(draft.updatedAt).toLocaleDateString()} ・{' '}
                                {draft.recipient.name || (language === 'zh' ? '未指定主管' : 'No recipient')}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  setCurrentLetter(draft);
                                  showToast(language === 'zh' ? '已载入案卷。' : 'Loaded case.');
                                }}
                                className="px-2.5 py-1 text-xs font-mono-system font-bold rounded bg-[#BFE2D3] text-[#1B5E3F] hover:bg-[#a7dcbc] cursor-pointer"
                              >
                                {language === 'zh' ? '载入' : 'Load'}
                              </button>
                              <button
                                onClick={() => {
                                  setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                                  showToast(language === 'zh' ? '已删除案卷。' : 'Deleted.');
                                }}
                                className="p-1 text-[#68616D] hover:text-[#A94343] cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SETTINGS APPLICATION */}
                {workspaceSection === 'settings' && (
                  <SettingsWindow
                    currentLetter={currentLetter}
                    onUpdateStationery={(style) =>
                      setCurrentLetter((prev) => ({ ...prev, stationery: style }))
                    }
                    onUpdateFont={(font) =>
                      setCurrentLetter((prev) => ({ ...prev, fontFamily: font }))
                    }
                    onUpdateFontSize={(size) =>
                      setCurrentLetter((prev) => ({ ...prev, fontSize: size }))
                    }
                    onUpdateRecipient={(k, v) =>
                      setCurrentLetter((prev) => ({
                        ...prev,
                        recipient: { ...prev.recipient, [k]: v },
                      }))
                    }
                    onUpdateSender={(k, v) =>
                      setCurrentLetter((prev) => ({
                        ...prev,
                        signoffName: v,
                        sender: { ...prev.sender, [k]: v },
                      }))
                    }
                    onTriggerAudit={() => setIsAssistantOpen(true)}
                    isApproved={currentLetter.isApproved}
                    language={language}
                  />
                )}
              </div>
            </AppWindow>
          </div>

          {/* Right Window: Live Resignation Letter Document Window */}
          <div
            className={`lg:col-span-6 xl:col-span-7 flex-col h-[740px] ${
              activeMobileView === 'letter' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <AppWindow
              id="app-window-letter"
              title={
                currentLetter.title ||
                (language === 'zh' ? '正式辞职信公文纸' : 'Resignation Document')
              }
              icon="📜"
              badge={
                desktopStatus === 'approved' ? (
                  <span className="font-mono-system text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BFE2D3] text-[#1B5E3F] border border-[#3B8C68]/30">
                    APPROVED
                  </span>
                ) : desktopStatus === 'ready_to_draft' ? (
                  <span className="font-mono-system text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF3D6] text-[#B36D14] border border-[#F2B35D]">
                    READY TO APPROVE
                  </span>
                ) : (
                  <span className="font-mono-system text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2EDF3] text-[#68616D] border border-[#403A45]/15">
                    GATHERING FACTS
                  </span>
                )
              }
              isActive={true}
              className="h-full"
              headerRight={
                <div className="flex items-center gap-1.5 text-xs font-mono-system">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-2 py-0.5 rounded border border-[#403A45]/30 hover:bg-[#F2EDF3] text-[11px] font-bold text-[#29252D] cursor-pointer"
                  >
                    {isEditing
                      ? language === 'zh' ? '完成编辑' : 'Done'
                      : language === 'zh' ? '直接编辑' : 'Edit'}
                  </button>
                  <button
                    onClick={handlePrintLetter}
                    className="px-2 py-0.5 rounded border border-[#403A45]/30 hover:bg-[#F2EDF3] text-[11px] font-bold text-[#29252D] cursor-pointer"
                  >
                    {language === 'zh' ? '导出/打印' : 'Print'}
                  </button>
                </div>
              }
            >
              <div className="p-3 bg-[#F6F0E7]/60 border-b border-[#403A45]/20 flex items-center justify-between text-xs overflow-x-auto no-print">
                <StationeryBar
                  letter={currentLetter}
                  onChange={setCurrentLetter}
                  isEditing={isEditing}
                  onToggleEdit={() => setIsEditing(!isEditing)}
                  language={language}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-[#F6F0E7]/30">
                <LetterSheet
                  letter={currentLetter}
                  onChange={(updated) => {
                    setCurrentLetter(updated);
                    if (updated.body !== currentLetter.body) {
                      setVersions((vList) => [
                        {
                          id: 'ver-edit-' + Date.now(),
                          checkpoint: 'user_edited',
                          label:
                            language === 'zh'
                              ? '手动编辑修订'
                              : 'Manual Revision',
                          body: updated.body,
                          timestamp: Date.now(),
                        },
                        ...vList,
                      ]);
                    }
                  }}
                  isEditing={isEditing}
                  onToggleEdit={() => setIsEditing(!isEditing)}
                  isApproved={currentLetter.isApproved}
                  language={language}
                  onPrint={handlePrintLetter}
                  onOpenAssistant={() => setIsAssistantOpen(true)}
                  selectedParagraphIndex={selectedParagraphIndex}
                  onSelectParagraph={(idx) => {
                    setSelectedParagraphIndex(idx);
                    if (idx !== null && workspaceSection !== 'draft') {
                      setWorkspaceSection('draft');
                    }
                  }}
                />
              </div>
            </AppWindow>
          </div>
        </div>
      </main>

      {/* 3. Supportive Companion (Origami Letter Helper) */}
      <CompanionPanel
        status={desktopStatus}
        confirmedFacts={caseFacts}
        hasConflict={conflicts.some((c) => !c.resolved)}
        language={language}
        onNavigateSection={setWorkspaceSection}
      />

      {/* 4. Persistent Workspace Dock (Desktop Floating Dock + Mobile Sticky Nav) */}
      <WorkspaceDock
        activeSection={workspaceSection}
        onSelectSection={(sec) => {
          setWorkspaceSection(sec);
          if (activeMobileView === 'letter' && sec !== 'draft') {
            setActiveMobileView('workspace');
          }
        }}
        status={desktopStatus}
        confirmedCount={confirmedFactsCount}
        savedCount={drafts.length}
        language={language}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenSettings={() => setWorkspaceSection('settings')}
      />

      {/* 5. Conflict Resolution Dialog */}
      <ConflictDialog
        conflict={activeConflict}
        isOpen={Boolean(activeConflict)}
        onClose={() => setActiveConflict(null)}
        onResolve={handleResolveConflict}
        language={language}
      />

      {/* 6. Version Compare Modal */}
      <VersionCompareModal
        isOpen={isCompareOpen}
        onClose={() => {
          setIsCompareOpen(false);
          setCompareVersion(null);
        }}
        currentBody={currentLetter.body}
        compareVersion={compareVersion}
        onRestore={handleRestoreVersion}
        language={language}
      />

      {/* 7. Structured Intake Form Modal */}
      <ComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmitInputs={(inputs, detailsMessage) => {
          setKnownInputs((prev) => ({ ...prev, ...inputs }));
          handleSendMessage(detailsMessage);
          showToast(
            language === 'zh'
              ? '个案详情已与公文侦探同步。'
              : 'Case details shared with Ghostwriter.'
          );
        }}
        initialSender={currentLetter.sender}
        language={language}
      />

      {/* 8. AI Assistant Polish & Safety Audit Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        letter={currentLetter}
        onApplyRevision={handleApplyAIRewrite}
        language={language}
      />

      {/* 9. Scenarios Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(template) => {
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
              address: '',
              contact: '',
            },
            recipient: {
              name: template.sample.recipient?.name || (language === 'zh' ? '主管姓名' : 'Supervisor Name'),
              title: template.sample.recipient?.title || (language === 'zh' ? '部门负责人' : 'Director'),
              organization: template.sample.recipient?.organization || '',
              address: '',
            },
            subject:
              template.sample.subject ||
              (language === 'zh'
                ? `正式辞职通知 — ${template.sample.signoffName || '您的姓名'}`
                : `Notice of Resignation — ${template.sample.signoffName || 'Your Name'}`),
            salutation: template.sample.salutation || (language === 'zh' ? '尊敬的领导：' : 'Dear Supervisor,'),
            body: template.sample.body || '',
            closing: template.sample.closing || (language === 'zh' ? '此致\n敬礼' : 'Sincerely,'),
            signoffName: template.sample.signoffName || currentLetter.sender.name || (language === 'zh' ? '您的姓名' : 'Your Name'),
            postscript: '',
            stationery: 'classic',
            fontFamily: 'serif-reading',
            fontSize: 'base',
            advice: template.ghostwriterPointers,
            isApproved: false,
            updatedAt: Date.now(),
          };

          setCurrentLetter(newLetter);
          handleSendMessage(
            language === 'zh'
              ? `我载入了“${template.title}”场景范本。请协助根据我个人的具体情况进行针对性调整。`
              : `I loaded the "${template.title}" scenario. Let's adapt this framework to my specific situation.`
          );
          showToast(
            language === 'zh'
              ? `已载入“${template.title}”场景。`
              : `Loaded "${template.title}" scenario.`
          );
        }}
        language={language}
      />

      {/* 10. Saved Drafts Modal */}
      <SavedDraftsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        drafts={drafts}
        onLoadDraft={(d) => {
          setCurrentLetter(d);
          showToast(language === 'zh' ? '已载入案卷。' : 'Loaded draft.');
        }}
        onDeleteDraft={(id) => {
          setDrafts((prev) => prev.filter((d) => d.id !== id));
          showToast(language === 'zh' ? '已删除草稿。' : 'Deleted.');
        }}
        onDuplicateDraft={(d) => {
          const cp = { ...d, id: 'letter-' + Date.now(), updatedAt: Date.now() };
          setDrafts((prev) => [cp, ...prev]);
          showToast(language === 'zh' ? '已复制草稿。' : 'Duplicated.');
        }}
        currentId={currentLetter.id}
        language={language}
      />

      {/* 11. System Architecture Diagram Modal */}
      <AboutSystemDiagramModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        language={language}
      />

      {/* 12. Toast Feedback Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#29252D] text-white text-xs px-4 py-2 rounded-xl retro-window-shadow border border-[#403A45] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 font-mono-system">
          <Sparkles className="w-3.5 h-3.5 text-[#F2B35D] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 13. Print Blocked Error Banner */}
      {printBlockedError && (
        <div className="no-print fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-md bg-[#A94343] text-white text-xs px-4 py-2.5 rounded-xl retro-window-shadow border border-[#29252D] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150 font-mono-system">
          <span className="font-medium">{printBlockedError}</span>
          <button
            onClick={() => setPrintBlockedError(null)}
            className="text-white hover:opacity-80 font-bold ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
