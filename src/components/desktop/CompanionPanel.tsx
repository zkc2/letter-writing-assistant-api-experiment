import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  AlertCircle,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { CaseDesktopStatus, ConfirmedFactItem, Language } from '../../types';

interface CompanionPanelProps {
  status: CaseDesktopStatus;
  confirmedFacts: ConfirmedFactItem[];
  hasConflict?: boolean;
  language: Language;
  onNavigateSection?: (section: any) => void;
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  status,
  confirmedFacts,
  hasConflict,
  language,
  onNavigateSection,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Determine current guidance
  const missingPillars = confirmedFacts.filter(
    (f) => !f.value || f.value.trim() === ''
  );

  let companionMood: 'welcome' | 'conflict' | 'missing' | 'privacy' | 'ready' | 'approved' = 'welcome';
  let messageTitle = language === 'zh' ? '侦探备忘伙伴' : 'Origami Companion';
  let messageText = '';

  if (status === 'approved') {
    companionMood = 'approved';
    messageTitle = language === 'zh' ? '终稿已核准！' : 'Case Approved!';
    messageText =
      language === 'zh'
        ? '文书具备完备的法律体面与进取主旨，体面离开，自信开启新篇章。'
        : 'Your resignation letter meets the highest professional standards. Clean, dignified, and boundary-safe.';
  } else if (hasConflict) {
    companionMood = 'conflict';
    messageTitle = language === 'zh' ? '排查到事实冲突' : 'Conflict Detected';
    messageText =
      language === 'zh'
        ? '注意到交接日期或离职主旨存在两份不同的表述。请在案卷中核准一项，避免辞职信出现逻辑漏洞。'
        : 'I noticed conflicting dates or statements. Clarify in the case file to keep your letter bulletproof.';
  } else if (missingPillars.length > 0 && status !== 'ready_to_draft') {
    companionMood = 'missing';
    messageTitle = language === 'zh' ? '需要补充关键要素' : 'Pillars Needed';
    const names = missingPillars
      .map((m) =>
        m.id === 'whyResigning'
          ? language === 'zh' ? '离职主旨' : 'Reason'
          : m.id === 'badExperiences'
          ? language === 'zh' ? '经历事实' : 'Experiences'
          : m.id === 'noticePeriodOrDate'
          ? language === 'zh' ? '最后工作日' : 'Notice Date'
          : language === 'zh' ? '私密界限' : 'Privacy'
      )
      .join('、');
    messageText =
      language === 'zh'
        ? `案卷槽位还需确证：${names}。点击左侧输入或与我对话补充即可解锁草稿。`
        : `Still gathering evidence for: ${names}. Provide details to unlock the formal draft.`;
  } else if (status === 'ready_to_draft') {
    companionMood = 'ready';
    messageTitle = language === 'zh' ? '案卷确证，草稿已解锁' : 'Draft Ready';
    messageText =
      language === 'zh'
        ? '4 项关键事实已全部就绪！信件已依据你的经历完成公文化提炼，可前往右侧审阅与核准。'
        : 'All 4 case slots verified! The formal letter has transformed your facts into a constructive draft.';
  } else {
    companionMood = 'welcome';
    messageTitle = language === 'zh' ? '准备梳理你的经历' : 'Welcome to Case Desktop';
    messageText =
      language === 'zh'
        ? '深呼吸。无论经历了多少不顺，我们都会把杂乱事实转化为体面措辞，并严格锁死私密界限。'
        : 'Take your time. We will turn your raw experiences into polished standing while keeping boundaries strictly protected.';
  }

  // Mini docked badge
  if (isMinimized) {
    return (
      <div className="fixed bottom-16 right-4 z-40 animate-in fade-in duration-150">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDFC] border-2 border-[#403A45] retro-dock-shadow hover:bg-[#F6F0E7] cursor-pointer text-xs font-mono-system font-bold text-[#29252D]"
          title="Open Companion"
        >
          {/* Mini Origami Icon */}
          <span className="text-sm">💌</span>
          <span>{language === 'zh' ? '侦探伴笔' : 'Companion'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              companionMood === 'conflict'
                ? 'bg-[#A94343]'
                : companionMood === 'ready' || companionMood === 'approved'
                ? 'bg-[#3B8C68]'
                : 'bg-[#F2B35D]'
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-18 right-4 z-40 max-w-xs sm:max-w-sm w-full animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-[#FFFDFC] rounded-2xl border-2 border-[#403A45] retro-window-shadow overflow-hidden">
        {/* Title bar */}
        <div className="px-3 py-1.5 bg-[#DCD4EA] border-b border-[#403A45] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">💌</span>
            <span className="font-mono-system text-[11px] font-bold text-[#29252D] tracking-wide">
              {messageTitle}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded hover:bg-black/10 text-[#403A45] cursor-pointer"
              title="Minimize"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-black/10 text-[#403A45] cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Companion Body */}
        <div className="p-3.5 flex gap-3 items-start bg-radial from-[#F6F0E7]/60 to-[#FFFDFC]">
          {/* Custom Original Origami Quill & Heart SVG Character */}
          <div className="shrink-0 relative">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xs"
            >
              {/* Folded paper body */}
              <rect x="4" y="8" width="36" height="28" rx="6" fill="#F6F0E7" stroke="#403A45" strokeWidth="1.5" />
              {/* Envelope flap folds */}
              <path d="M4 10L22 24L40 10" stroke="#403A45" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Origami Heart Seal */}
              <circle cx="22" cy="24" r="6" fill="#E8B8C9" stroke="#403A45" strokeWidth="1.2" />
              <path
                d="M22 22.5C21.5 21.5 20 21.5 19.5 22.5C19 23.5 22 25.5 22 25.5C22 25.5 25 23.5 24.5 22.5C24 21.5 22.5 21.5 22 22.5Z"
                fill="#A94343"
              />
              {/* Friendly eyes */}
              <circle cx="16" cy="19" r="1.2" fill="#29252D" />
              <circle cx="28" cy="19" r="1.2" fill="#29252D" />
              {/* Ink feather quill tuck */}
              <path
                d="M34 6C36 4 39 4 40 5C41 6 41 9 39 11L33 17"
                stroke="#B9DDE3"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Dialogue bubble */}
          <div className="space-y-1.5 flex-1">
            <p className="text-xs text-[#29252D] font-sans-clean leading-relaxed">
              {messageText}
            </p>

            {status === 'ready_to_draft' && onNavigateSection && (
              <button
                onClick={() => onNavigateSection('draft')}
                className="mt-1 text-[11px] font-mono-system font-bold text-[#3B8C68] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'zh' ? '前往审阅文稿 →' : 'Review Draft →'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
