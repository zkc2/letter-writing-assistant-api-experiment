import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
  Minimize2,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { CaseDesktopStatus, ConfirmedFactItem, Language, WorkspaceSection } from '../../types';
import { InkMothCompanionSVG } from './InkMothCompanionSVG';

interface CompanionPanelProps {
  status: CaseDesktopStatus;
  confirmedFacts: ConfirmedFactItem[];
  hasConflict?: boolean;
  language: Language;
  onNavigateSection?: (section: WorkspaceSection) => void;
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  status,
  confirmedFacts,
  hasConflict,
  language,
  onNavigateSection,
}) => {
  // Start compact to never block letter text, input fields, or buttons
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Determine current guidance and chapter state
  const missingPillars = confirmedFacts.filter(
    (f) => !f.value || f.value.trim() === ''
  );

  let companionMood: 'welcome' | 'conflict' | 'missing' | 'ready' | 'approved' = 'welcome';
  let companionTitle = language === 'zh' ? '墨蛾・Bureau Ink Moth' : 'The Ink Moth';
  let companionSubtitle = language === 'zh' ? '暮色信局的引路灵' : 'Quiet Exit Guide';
  let messageText = '';

  if (status === 'approved') {
    companionMood = 'approved';
    companionTitle = language === 'zh' ? '墨蛾・终章安澜' : 'The Ink Moth・Sealed';
    companionSubtitle = language === 'zh' ? '文书已封印并获核准' : 'Safe Passage Granted';
    messageText =
      language === 'zh'
        ? '琥珀火漆已凝固，辞呈信兼备体面与防线。你可以安心走出这段职场暮色，开启清白明朗的下一站。'
        : 'The amber wax is set. Your resignation stands firm, constructive, and dignified. Fly onward into your next chapter.';
  } else if (hasConflict) {
    companionMood = 'conflict';
    companionTitle = language === 'zh' ? '墨蛾・敏锐警觉' : 'The Ink Moth・Alert';
    companionSubtitle = language === 'zh' ? '触角感知到分歧' : 'Contradiction Sensed';
    messageText =
      language === 'zh'
        ? '触角察觉到了日期或原因的表述分歧。请在案卷中裁定一项真实表述，避免公文留下瑕疵。'
        : 'My antennae sensed conflicting dates or statements. Clarify the record in your Case Dossier so your letter remains untarnished.';
  } else if (missingPillars.length > 0 && status !== 'ready_to_draft') {
    companionMood = 'missing';
    companionTitle = language === 'zh' ? '墨蛾・集字寻音' : 'The Ink Moth・Gathering';
    companionSubtitle = language === 'zh' ? `尚缺 ${missingPillars.length} 处要素` : `${missingPillars.length} Pillars Unresolved`;
    const names = missingPillars
      .map((m) =>
        m.id === 'whyResigning'
          ? language === 'zh' ? '离职原因' : 'Reason for Resigning'
          : m.id === 'badExperiences'
          ? language === 'zh' ? '职场背景' : 'Workplace Context'
          : m.id === 'noticePeriodOrDate'
          ? language === 'zh' ? '最后在岗日与交接' : 'Final Working Date and Handover'
          : language === 'zh' ? '隐私边界' : 'Privacy Boundaries'
      )
      .join('、');
    messageText =
      language === 'zh'
        ? `我正在为你收集这些光阴要素：${names}。在对话或时间线补全它们，公文纸便会舒展铺开。`
        : `Still piecing together your memories for: ${names}. Provide these in Intake or Timeline to unlock the full letter draft.`;
  } else if (status === 'ready_to_draft') {
    companionMood = 'ready';
    companionTitle = language === 'zh' ? '墨蛾・信笺铺就' : 'The Ink Moth・Paper Ready';
    companionSubtitle = language === 'zh' ? '四柱已立，公文已就' : '4/4 Pillars Complete';
    messageText =
      language === 'zh'
        ? '四项要素已全部核准入卷！所有的艰难遭遇已转化为体面的公文化表达，隐私已被锁闭。请轻触文稿检视与定稿。'
        : 'All 4 dossier pillars are sealed. Your unfiltered realities have been translated into professional prose. Review your draft now.';
  } else {
    companionMood = 'welcome';
    companionTitle = language === 'zh' ? '墨蛾・暮色初见' : 'The Ink Moth・Greetings';
    companionSubtitle = language === 'zh' ? '静候你的第一缕思绪' : 'Twilight Bureau Desk';
    messageText =
      language === 'zh'
        ? '深呼吸。暮色信局专为将疲惫、委屈与不公，温和地熔铸成不卑不亢的公文字句。私密内容绝不会越界。'
        : 'Take a quiet breath. The Quiet Exit Bureau transforms workplace strain into clear, dignified closure. Your privacy remains sealed.';
  }

  // Auto-collapse non-critical notifications after 6 seconds when expanded
  useEffect(() => {
    if (isExpanded && companionMood !== 'conflict') {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, companionMood]);

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Companion Assistant"
      className="fixed bottom-14 right-3 sm:right-6 z-40 flex flex-col items-end pointer-events-auto no-print"
    >
      {/* Toast bubble when expanded - positioned safely above the dock and clear of letter margins */}
      {isExpanded && (
        <div className="mb-2 max-w-xs sm:max-w-sm w-full animate-in slide-in-from-bottom-2 duration-150">
          <div className="bg-[#1e1b29]/95 backdrop-blur-md rounded-xl border border-[#6f6587]/40 shadow-2xl overflow-hidden text-[#fbf8f4]">
            {/* Header */}
            <div className="px-3 py-1.5 bg-[#2a2539] border-b border-[#6f6587]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    companionMood === 'conflict'
                      ? 'bg-[#b35858] animate-ping'
                      : companionMood === 'ready' || companionMood === 'approved'
                      ? 'bg-[#4e8b72]'
                      : 'bg-[#e6a54f]'
                  }`}
                />
                <span className="font-mono-system text-[11px] font-bold text-[#fbf8f4] tracking-wide">
                  {companionTitle}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded hover:bg-white/10 text-[#d8cce4] cursor-pointer"
                  title="Collapse"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setIsDismissed(true);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-[#d8cce4] cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 flex gap-2.5 items-start">
              <div className="shrink-0 mt-0.5">
                <InkMothCompanionSVG mood={companionMood} size={36} />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="text-[10px] font-mono-system text-[#b8a9c9] tracking-wider uppercase">
                  {companionSubtitle}
                </div>
                <p className="text-xs text-[#f7f1e5] font-sans-clean leading-relaxed font-normal">
                  {messageText}
                </p>

                {/* Quick action buttons */}
                {status === 'ready_to_draft' && onNavigateSection && (
                  <button
                    onClick={() => {
                      onNavigateSection('draft');
                      setIsExpanded(false);
                    }}
                    className="mt-1.5 text-[11px] font-mono-system font-bold px-2 py-0.5 rounded bg-[#4e8b72]/30 text-[#85d0ad] border border-[#4e8b72]/50 hover:bg-[#4e8b72]/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'zh' ? '前往审阅文稿' : 'Review Draft'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                {companionMood === 'conflict' && onNavigateSection && (
                  <button
                    onClick={() => {
                      onNavigateSection('facts');
                      setIsExpanded(false);
                    }}
                    className="mt-1.5 text-[11px] font-mono-system font-bold px-2 py-0.5 rounded bg-[#b35858]/30 text-[#e9a1a1] border border-[#b35858]/50 hover:bg-[#b35858]/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'zh' ? '前往案卷解决分歧' : 'Resolve in Dossier'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Pill Badge - Always sleek, unobtrusive, never covering text */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1e1b29]/90 backdrop-blur-md border border-[#e6a54f]/50 hover:border-[#e6a54f] cursor-pointer text-xs font-mono-system font-bold text-[#fbf8f4] shadow-lg hover:shadow-[#e6a54f]/20 transition-all group"
        title={isExpanded ? 'Collapse' : 'Open Ink Moth Guidance'}
      >
        <InkMothCompanionSVG mood={companionMood} size={20} />
        <span className="text-[11px] text-[#fbf8f4]">
          {language === 'zh' ? '墨蛾' : 'Ink Moth'}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            companionMood === 'conflict'
              ? 'bg-[#b35858] animate-ping'
              : companionMood === 'ready' || companionMood === 'approved'
              ? 'bg-[#4e8b72]'
              : 'bg-[#e6a54f]'
          }`}
        />
        <span className="text-[10px] text-[#d8cce4]/70 font-mono-system">
          {4 - missingPillars.length}/4
        </span>
      </button>
    </aside>
  );
};
