import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  Send,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  EyeOff,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  GhostwriterMessage,
  GhostwriterInputs,
  LetterContent,
  InteractionStep,
  Language,
} from '../types';
import { getTranslation } from '../i18n';

interface GhostwriterChatProps {
  messages: GhostwriterMessage[];
  onSendMessage: (text: string, isRetry?: boolean, errorMsgId?: string) => Promise<void>;
  onRetryMessage?: (failedText: string, errorMsgId: string) => Promise<void>;
  currentLetter: LetterContent;
  knownInputs: GhostwriterInputs;
  onUpdateInput: (key: keyof GhostwriterInputs, val: string) => void;
  isLoading: boolean;
  onApproveLetter: () => void;
  isApproved: boolean;
  onResetSession: () => void;
  currentStep: InteractionStep;
  language: Language;
  onOpenTemplates?: () => void;
  onOpenCaseForm?: () => void;
}

export const GhostwriterChat: React.FC<GhostwriterChatProps> = ({
  messages,
  onSendMessage,
  onRetryMessage,
  currentLetter,
  knownInputs,
  onUpdateInput,
  isLoading,
  onApproveLetter,
  isApproved,
  onResetSession,
  currentStep,
  language,
  onOpenTemplates,
  onOpenCaseForm,
}) => {
  const [inputText, setInputText] = useState('');
  const [showCaseFile, setShowCaseFile] = useState(true);
  const [showGuardrails, setShowGuardrails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const handleSelectStarter = (text: string) => {
    setInputText(text);
  };

  const handleToggleGuardrail = (guardrailText: string) => {
    const existing = knownInputs.whatNotToSay ? knownInputs.whatNotToSay.split('; ').filter(Boolean) : [];
    let updated: string[];
    if (existing.includes(guardrailText)) {
      updated = existing.filter((g) => g !== guardrailText);
    } else {
      updated = [...existing, guardrailText];
    }
    const combined = updated.join('; ');
    onUpdateInput('whatNotToSay', combined);

    // Also notify ghostwriter in appropriate language
    const boundaryNotice = language === 'zh'
      ? `隐私边界约束：请确保在正式辞职信中严格隐去此项内容："${guardrailText}"`
      : `Privacy boundary rule: Ensure the letter strictly omits: "${guardrailText}"`;
    onSendMessage(boundaryNotice);
  };

  // 4 Standard Categories mandated everywhere:
  // 1. Reason for Resigning
  // 2. Workplace Context
  // 3. Final Working Date and Handover
  // 4. Privacy Boundaries
  const caseFileItems = [
    {
      id: 'whyResigning',
      label: language === 'zh' ? '1. 离职原因' : '1. Reason for Resigning',
      val: knownInputs.whyResigning,
      placeholder: language === 'zh' ? '尚未探明（核心离职动因）' : 'Not yet captured (core reason)',
    },
    {
      id: 'badExperiences',
      label: language === 'zh' ? '2. 职场背景' : '2. Workplace Context',
      val: knownInputs.badExperiences,
      placeholder: language === 'zh' ? '尚未探明（客观负荷或经历）' : 'Not yet captured (workplace realities)',
    },
    {
      id: 'noticePeriodOrDate',
      label: language === 'zh' ? '3. 最后在岗日与交接' : '3. Final Working Date and Handover',
      val: knownInputs.noticePeriodOrDate || knownInputs.whatToSay,
      placeholder: language === 'zh' ? '尚未明确（需具体离开日期）' : 'Not yet specified (exact departure date)',
    },
    {
      id: 'whatNotToSay',
      label: language === 'zh' ? '4. 隐私边界' : '4. Privacy Boundaries',
      val: knownInputs.whatNotToSay,
      placeholder: language === 'zh' ? '初始为空（由您自主设定防线）' : 'Begins blank (user-defined protections)',
    },
  ];

  const completedCount = [
    Boolean(knownInputs.whyResigning && knownInputs.whyResigning.trim()),
    Boolean(knownInputs.badExperiences && knownInputs.badExperiences.trim()),
    Boolean((knownInputs.noticePeriodOrDate && knownInputs.noticePeriodOrDate.trim()) || (knownInputs.whatToSay && knownInputs.whatToSay.trim())),
    Boolean(knownInputs.whatNotToSay && knownInputs.whatNotToSay.trim()),
  ].filter(Boolean).length;

  const currentStepName =
    currentStep === 1
      ? t.chat.steps.step1
      : currentStep === 2
      ? t.chat.steps.step2
      : currentStep === 3
      ? t.chat.steps.step3
      : currentStep === 4
      ? t.chat.steps.step4
      : t.chat.steps.step5;

  return (
    <div className="flex flex-col h-full min-h-0 bg-white font-sans-clean relative">
      {/* SINGLE UNIFIED SCROLL CONTAINER for the Intake window - NO NESTED SCROLLBARS */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-4"
      >
        {/* Ghostwriter & Bureau Intake Header */}
        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs sm:text-sm font-semibold text-stone-900 tracking-tight truncate">
                  {language === 'zh' ? '暮色信局代笔厅' : 'Bureau Ghostwriter Desk'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                  {t.chat.badge}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                {t.chat.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenTemplates && (
              <button
                type="button"
                onClick={onOpenTemplates}
                className="px-2.5 py-1 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                title={t.nav.scenarios}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline text-[11px] font-medium">{t.nav.scenarios}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onResetSession}
              title={t.chat.newSession}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{t.chat.newSession}</span>
            </button>
          </div>
        </div>

        {/* 5-Step Interaction Loop Progress Bar */}
        <div className="px-3.5 py-2 rounded-xl bg-stone-100/70 border border-stone-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium">
            <span className="text-stone-400">{t.chat.interactionLoop}</span>
            <span className="font-semibold text-stone-900">
              {currentStepName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((stepNum) => {
              const isDone = currentStep > stepNum || (currentStep === 5 && stepNum === 5 && isApproved);
              const isCurrent = currentStep === stepNum;
              return (
                <div
                  key={stepNum}
                  title={`Step ${stepNum}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isDone
                      ? 'bg-emerald-500 w-4'
                      : isCurrent
                      ? 'bg-amber-600 w-7'
                      : 'bg-stone-300 w-4'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Confirmed Case File Overview (Collapsible inside single scroll container) */}
        <div className="rounded-xl border border-stone-200/90 bg-stone-50/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCaseFile(!showCaseFile)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-medium text-stone-700 hover:bg-stone-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-stone-900">
                {language === 'zh' ? '确证案卷' : 'Confirmed Case File'}
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono-system font-bold bg-stone-200/80 text-stone-700">
                {completedCount} / 4 {language === 'zh' ? '已确证' : 'Captured'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <span>{showCaseFile ? (language === 'zh' ? '收起案卷' : 'Hide case file') : (language === 'zh' ? '展开案卷' : 'Show case file')}</span>
              {showCaseFile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showCaseFile && (
            <div className="px-3.5 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {caseFileItems.map((item) => {
                const hasVal = Boolean(item.val && item.val.trim());
                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg border transition-all ${
                      hasVal
                        ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                        : 'bg-white border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[11px] flex items-center gap-1.5">
                        {hasVal ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0" />
                        )}
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[11px] line-clamp-2 leading-relaxed opacity-90">
                      {item.val || <span className="italic text-stone-400">{item.placeholder}</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Venting Starters (Only when conversation is fresh) */}
        {messages.length <= 2 && (
          <div className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                {t.chat.starters.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {t.chat.starters.items.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    if (isLoading) return;
                    handleSelectStarter(s.text);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-white border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 text-stone-700 transition-colors shadow-2xs text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Boundaries & Guardrails */}
        <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 overflow-hidden">
          <div className="px-3.5 py-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowGuardrails(!showGuardrails)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.chat.guardrails.button}</span>
              {showGuardrails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {knownInputs.whatNotToSay && (
              <span className="text-[10px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md font-medium">
                {t.chat.guardrails.activeApplied}
              </span>
            )}
          </div>

          {showGuardrails && (
            <div className="px-3.5 pb-3 pt-1 border-t border-stone-200/60 space-y-1.5 text-xs bg-stone-100/50">
              <p className="text-[11px] text-stone-500">
                {t.chat.guardrails.tip}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {t.chat.guardrails.options.map((g, i) => {
                  const isActive = knownInputs.whatNotToSay?.includes(g);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        if (isLoading) return;
                        handleToggleGuardrail(g);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                        isActive
                          ? 'bg-amber-100 text-amber-950 border-amber-400 font-semibold'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <EyeOff className="w-3 h-3 text-stone-500" />
                      <span>{g}</span>
                      {isActive && <Check className="w-3 h-3 text-amber-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Message Stream */}
        <div className="space-y-3.5 pt-1">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[84%] rounded-2xl p-4 shadow-xs ${
                    isUser
                      ? 'bg-stone-900 text-stone-100 rounded-br-xs'
                      : msg.isError
                      ? 'bg-amber-50/90 text-stone-900 border border-amber-300/80 rounded-bl-xs'
                      : 'bg-stone-100/90 text-stone-900 border border-stone-200/80 rounded-bl-xs'
                  }`}
                >
                  {!isUser && msg.isError ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-amber-200/80 text-[11px] text-amber-900 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{t.chat.errorMessagePrefix}</span>
                      </div>

                      <div className="whitespace-pre-wrap leading-relaxed text-[12.5px] text-stone-800">
                        {msg.content}
                      </div>

                      {msg.failedUserMessage && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isLoading) return;
                              if (onRetryMessage) {
                                onRetryMessage(msg.failedUserMessage!, msg.id);
                              } else {
                                onSendMessage(msg.failedUserMessage!, true, msg.id);
                              }
                            }}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-stone-800 border border-stone-300 hover:border-amber-600 hover:text-amber-900 hover:bg-stone-50 active:scale-95 transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Retry this message / 重试此消息</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {!isUser && (
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200/60 text-[11px] text-amber-800 font-medium">
                          <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                          <span>{language === 'zh' ? '信局代笔助手' : 'Bureau Ghostwriter'}</span>
                        </div>
                      )}

                      {/* Core Reflection pill */}
                      {!isUser && msg.coreReflection && (
                        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-950 text-[11px]">
                          <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-0.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t.chat.reflectionTitle}</span>
                          </div>
                          <p className="italic leading-relaxed">{msg.coreReflection}</p>
                        </div>
                      )}

                      {/* Main Message Content */}
                      <div className="whitespace-pre-wrap leading-relaxed text-[12.5px]">
                        {msg.content}
                      </div>

                      {/* Clarifying Questions */}
                      {!isUser && msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-stone-200/70 space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t.chat.questionsTitle}</span>
                          </div>
                          <div className="space-y-1.5">
                            {msg.clarifyingQuestions.map((q, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-white/80 border border-stone-200/90 text-[11px] text-stone-800 flex items-start gap-2"
                              >
                                <span className="font-semibold text-amber-800">{idx + 1}.</span>
                                <span className="flex-1">{q}</span>
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => {
                                    if (isLoading) return;
                                    const prefix = language === 'zh'
                                      ? `关于问题 ${idx + 1}（"${q}"）：`
                                      : `Regarding question ${idx + 1} ("${q}"): `;
                                    setInputText(prefix);
                                  }}
                                  className="text-[10px] text-amber-800 font-medium hover:underline shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {t.chat.answerThis}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Quick Replies */}
                      {!isUser && msg.suggestedQuickReplies && msg.suggestedQuickReplies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {msg.suggestedQuickReplies.map((reply, i) => (
                            <button
                              key={i}
                              type="button"
                              disabled={isLoading}
                              onClick={() => {
                                if (isLoading) return;
                                onSendMessage(reply);
                              }}
                              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-stone-700 border border-stone-300 hover:border-amber-600 hover:text-amber-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ArrowRight className="w-2.5 h-2.5 text-amber-600" />
                              <span>{reply}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Approved Badge */}
                      {!isUser && (msg.isApproved || isApproved) && (
                        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-xs">{t.chat.approvedTitle}</span>
                            <p className="text-[10px] text-emerald-800">
                              {t.chat.approvedDesc}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-100 text-stone-600 max-w-[70%] text-xs animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>{t.chat.loadingGhostwriter}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Approval Banner when a draft exists */}
        {currentLetter.body && !isApproved && (
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-950 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.chat.approvalPrompt}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (isLoading) return;
                  onSendMessage(language === 'zh' ? '我还想对信中的几个细节进行调整' : "I'd like to adjust a few details in the letter");
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.chat.keepTweaking}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (isLoading) return;
                  onApproveLetter();
                }}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.chat.approveButton}</span>
              </button>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-[11px]">
                {t.chat.approvedBannerText}
              </span>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                if (isLoading) return;
                onSendMessage(language === 'zh' ? '在正式发出之前，我还需要再修改一处细节。' : 'I actually need to modify one detail before I send it.');
              }}
              className="text-[11px] text-emerald-800 underline hover:text-emerald-950 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.chat.reopenRevision}
            </button>
          </div>
        )}
      </div>

      {/* STICKY MESSAGE COMPOSER AT BOTTOM OF INTAKE */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 z-10 p-3 sm:p-3.5 border-t border-stone-200 bg-white/95 backdrop-blur-md shadow-md"
      >
        <div className="relative flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              currentStep === 1
                ? t.chat.inputPlaceholderStep1
                : t.chat.inputPlaceholderDefault
            }
            rows={2}
            className="flex-1 resize-none rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            title={t.chat.sendButton}
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 text-[10px] text-stone-500 px-1 gap-1">
          <span className="flex items-center gap-1 text-stone-600">
            <Info className="w-3 h-3 text-amber-600 shrink-0" />
            {t.chat.apiDisclosure}
          </span>
          <span className="text-stone-400 shrink-0">{t.chat.pressEnter}</span>
        </div>
      </form>
    </div>
  );
};
