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
  Smile,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  GhostwriterMessage,
  GhostwriterInputs,
  LetterContent,
  InteractionStep,
} from '../types';

interface GhostwriterChatProps {
  messages: GhostwriterMessage[];
  onSendMessage: (text: string) => Promise<void>;
  currentLetter: LetterContent;
  knownInputs: GhostwriterInputs;
  onUpdateInput: (key: keyof GhostwriterInputs, val: string) => void;
  isLoading: boolean;
  onApproveLetter: () => void;
  isApproved: boolean;
  onResetSession: () => void;
  currentStep: InteractionStep;
}

const MESSY_STARTERS = [
  {
    label: 'Toxic Micromanagement',
    text: 'My manager micromanages every minute of my day, changes requirements last minute, and blames our team when deadlines slip. I cannot endure the constant hostility and second-guessing anymore.',
  },
  {
    label: 'Burnout & Extreme Overwork',
    text: 'I have been putting in 60+ hour weeks for months with no support or relief in sight. My physical and mental health are suffering, and every time I asked for help, it was ignored. I need to leave to recover.',
  },
  {
    label: 'Broken Promises & Stagnation',
    text: 'I was promised a promotion and salary review six months ago after delivering our biggest client project. Now leadership is stalling and dodging meetings. I realize my growth here has hit a dead end.',
  },
  {
    label: 'Disrespectful Culture',
    text: 'The communication on our team has turned disrespectful and dismissive. Feedback is given as personal attacks instead of constructive guidance. I am done putting up with this.',
  },
  {
    label: 'Zero Drama / Clean Exit',
    text: 'I found an opportunity that pays better and aligns with my long-term career goals. I want a calm, professional notice with zero drama, no burned bridges, and minimal fuss.',
  },
];

const GUARDRAIL_OPTIONS = [
  'Do NOT mention my new employer or destination',
  'Keep specific grievances off the written record',
  'Do NOT offer extended transition beyond my planned final working date',
  'Do NOT express false gratitude or exaggerated praise',
  'State my last day firmly without room for debate',
];

export const GhostwriterChat: React.FC<GhostwriterChatProps> = ({
  messages,
  onSendMessage,
  currentLetter,
  knownInputs,
  onUpdateInput,
  isLoading,
  onApproveLetter,
  isApproved,
  onResetSession,
  currentStep,
}) => {
  const [inputText, setInputText] = useState('');
  const [showInputsTracker, setShowInputsTracker] = useState(true);
  const [showGuardrails, setShowGuardrails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // Also notify ghostwriter
    onSendMessage(`Boundary note: Please ensure the letter adheres to this rule: "${guardrailText}"`);
  };

  // Check required inputs completion
  const inputChecklist = [
    {
      id: 'whyResigning',
      label: 'Why you want to resign',
      val: knownInputs.whyResigning,
      placeholder: 'Placeholder example: Burnout, managerial friction, stagnation, or new opportunity',
    },
    {
      id: 'badExperiences',
      label: 'Your bad experiences & challenges',
      val: knownInputs.badExperiences,
      placeholder: 'Placeholder example: Moving goalposts, lack of support, unpaid overtime',
    },
    {
      id: 'whatToSay',
      label: 'What you want to say & final date',
      val: knownInputs.whatToSay || knownInputs.noticePeriodOrDate,
      placeholder: 'Placeholder example: Resignation notice with exact final working date',
    },
    {
      id: 'whatNotToSay',
      label: 'Boundaries: What NOT to say',
      val: knownInputs.whatNotToSay,
      placeholder: 'Placeholder example: Keep grievances off record; do not mention new employer',
    },
  ];

  const completedCount = [
    Boolean(knownInputs.whyResigning && knownInputs.whyResigning.trim()),
    Boolean(knownInputs.badExperiences && knownInputs.badExperiences.trim()),
    Boolean((knownInputs.whatToSay && knownInputs.whatToSay.trim()) || (knownInputs.noticePeriodOrDate && knownInputs.noticePeriodOrDate.trim())),
    Boolean(knownInputs.whatNotToSay && knownInputs.whatNotToSay.trim()),
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden font-sans-clean">
      {/* Ghostwriter Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-stone-900 tracking-tight">Resignation Ghostwriter</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-200">
                Supportive Friend
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Transforming difficult workplace challenges into a professional resignation draft
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetSession}
            title="Start new conversation"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">New Session</span>
          </button>
        </div>
      </div>

      {/* 5-Step Interaction Loop Progress Bar */}
      <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium">
          <span className="text-stone-400">Interaction Loop:</span>
          <span className="font-semibold text-stone-900">
            {currentStep === 1 && 'Step 1: Get the Messy Version'}
            {currentStep === 2 && 'Step 2: Understand & Clarify'}
            {currentStep === 3 && 'Step 3: Acknowledge & Reflect'}
            {currentStep === 4 && 'Step 4: Draft & Revise'}
            {currentStep === 5 && 'Step 5: Approved with "Yes"'}
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
                className={`w-5 h-1.5 rounded-full transition-all ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-amber-600 w-8'
                    : 'bg-stone-300'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Collapsible Required Inputs Tracker */}
      <div className="border-b border-stone-200/70 bg-stone-50/50">
        <button
          onClick={() => setShowInputsTracker(!showInputsTracker)}
          className="w-full px-4 py-2 flex items-center justify-between text-left text-xs font-medium text-stone-700 hover:bg-stone-100/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Required Information Tracker</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-200/80 text-stone-700">
              {completedCount} / 4 Captured
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <span>{showInputsTracker ? 'Hide checklist' : 'Show checklist'}</span>
            {showInputsTracker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showInputsTracker && (
          <div className="px-4 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {inputChecklist.map((item) => {
              const hasVal = Boolean(item.val && item.val.trim());
              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border transition-all ${
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

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-xs ${
                  isUser
                    ? 'bg-stone-900 text-stone-100 rounded-br-xs'
                    : 'bg-stone-100/90 text-stone-900 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200/60 text-[11px] text-amber-800 font-medium">
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                    <span>Resignation Ghostwriter</span>
                  </div>
                )}

                {/* Core Reflection pill if returned by assistant */}
                {!isUser && msg.coreReflection && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-950 text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reflecting back what matters to you:</span>
                    </div>
                    <p className="italic leading-relaxed">{msg.coreReflection}</p>
                  </div>
                )}

                {/* Main Message Content */}
                <div className="whitespace-pre-wrap leading-relaxed text-[12.5px]">
                  {msg.content}
                </div>

                {/* Clarifying Questions Section */}
                {!isUser && msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200/70 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Question to clarify your letter:</span>
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
                            onClick={() => {
                              setInputText(`Regarding question ${idx + 1} ("${q}"): `);
                            }}
                            className="text-[10px] text-amber-800 font-medium hover:underline shrink-0 cursor-pointer"
                          >
                            Answer this
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
                        onClick={() => onSendMessage(reply)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-stone-700 border border-stone-300 hover:border-amber-600 hover:text-amber-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <ArrowRight className="w-2.5 h-2.5 text-amber-600" />
                        <span>{reply}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Approved Badge on Assistant message if user approved */}
                {!isUser && (msg.isApproved || isApproved) && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs">Letter Approved & Ready</span>
                      <p className="text-[10px] text-emerald-800">
                        You can now copy, print, or download your formal resignation document with confidence.
                      </p>
                    </div>
                  </div>
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
            <span>Resignation Ghostwriter is listening and revising your letter...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Approval Banner when a draft exists */}
      {currentLetter.body && !isApproved && (
        <div className="px-4 py-2 bg-amber-50/90 border-t border-amber-200/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-950 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Does this draft express what you need with dignity?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendMessage("I'd like to adjust a few details in the letter")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer"
            >
              Keep Tweaking
            </button>
            <button
              onClick={onApproveLetter}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Yes, this is ready</span>
            </button>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-[11px]">
              You approved this resignation letter. It is ready for your supervisor.
            </span>
          </div>
          <button
            onClick={() => onSendMessage('I actually need to modify one detail before I send it.')}
            className="text-[11px] text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
          >
            Re-open revision
          </button>
        </div>
      )}

      {/* Quick Venting Starters (When first starting or needing inspiration) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Step 1: Vent the raw version (Select or tell me your own story):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MESSY_STARTERS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectStarter(s.text)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-white border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 text-stone-700 transition-colors shadow-2xs text-left cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Boundaries & Guardrails Toggle (What NOT to say) */}
      <div className="px-4 py-1.5 bg-stone-50 border-t border-stone-200/50 flex items-center justify-between text-xs">
        <button
          onClick={() => setShowGuardrails(!showGuardrails)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-stone-500" />
          <span>Set Guardrails ("What NOT to say")</span>
          {showGuardrails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {knownInputs.whatNotToSay && (
          <span className="text-[10px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md font-medium">
            Active Guardrails Applied
          </span>
        )}
      </div>

      {showGuardrails && (
        <div className="px-4 py-2.5 bg-stone-100/70 border-t border-stone-200/60 space-y-1.5 text-xs">
          <p className="text-[11px] text-stone-500">
            Click to enforce privacy protections in your resignation letter:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GUARDRAIL_OPTIONS.map((g, i) => {
              const isActive = knownInputs.whatNotToSay?.includes(g);
              return (
                <button
                  key={i}
                  onClick={() => handleToggleGuardrail(g)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
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

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-stone-200 bg-white">
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
                ? 'Get the messy version out first: What happened? What made you want to leave?'
                : 'Reply to the ghostwriter, clarify dates, or say what to adjust...'
            }
            rows={2}
            className="flex-1 resize-none rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-stone-400 px-1">
          <span>Private browser session • Supportive writing assistant helping you leave with dignity</span>
          <span>Press Enter to send</span>
        </div>
      </form>
    </div>
  );
};
