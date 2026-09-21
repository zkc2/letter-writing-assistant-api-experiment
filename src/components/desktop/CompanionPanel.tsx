import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
  Minimize2,
  ChevronRight,
  Heart,
  Feather,
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

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
        ? '琥珀火漆已凝固，辞职信兼备体面与防线。轻拍双翅，你可以安心走出这段职场暮色，开启清白明亮的下一站。'
        : 'The amber wax is set. Your resignation stands firm, constructive, and dignified. Fly onward into your next chapter with confidence.';
  } else if (hasConflict) {
    companionMood = 'conflict';
    companionTitle = language === 'zh' ? '墨蛾・敏锐警觉' : 'The Ink Moth・Alert';
    companionSubtitle = language === 'zh' ? '触角感知到两处分歧' : 'Contradiction Sensed';
    messageText =
      language === 'zh'
        ? '扑翅停落：在你的时间线与陈述中，察觉到了日期或原因的自相矛盾。请在案卷中裁定一项真实表述，避免公文留下瑕疵。'
        : 'My antennae sensed conflicting timelines or statements. Clarify the record in your Case Dossier so your letter remains untarnished.';
  } else if (missingPillars.length > 0 && status !== 'ready_to_draft') {
    companionMood = 'missing';
    companionTitle = language === 'zh' ? '墨蛾・集字寻音' : 'The Ink Moth・Gathering';
    companionSubtitle = language === 'zh' ? `尚缺 ${missingPillars.length} 处要素` : `${missingPillars.length} Pillars Unresolved`;
    const names = missingPillars
      .map((m) =>
        m.id === 'whyResigning'
          ? language === 'zh' ? '离职主旨' : 'Reason'
          : m.id === 'badExperiences'
          ? language === 'zh' ? '经历事实' : 'Experiences'
          : m.id === 'noticePeriodOrDate'
          ? language === 'zh' ? '最后在岗日' : 'Notice Date'
          : language === 'zh' ? '私密界限' : 'Privacy Boundary'
      )
      .join('、');
    messageText =
      language === 'zh'
        ? `我正在为你收集这些光阴碎片：${names}。点击对话或时间线补全它们，公文纸便会舒展铺开。`
        : `Still piecing together your memories for: ${names}. Provide these details in Intake or Timeline to unlock the full letter draft.`;
  } else if (status === 'ready_to_draft') {
    companionMood = 'ready';
    companionTitle = language === 'zh' ? '墨蛾・信笺铺就' : 'The Ink Moth・Paper Ready';
    companionSubtitle = language === 'zh' ? '四柱已立，公文已就' : '4/4 Pillars Complete';
    messageText =
      language === 'zh'
        ? '记忆碎片已全部核准入卷！所有的艰难遭遇已转化为体面的公文化表达，隐私已被锁闭。请轻触右侧文稿，亲自检视与定稿。'
        : 'All 4 dossier pillars are sealed. Your unfiltered realities have been translated into professional prose. Review your draft now.';
  } else {
    companionMood = 'welcome';
    companionTitle = language === 'zh' ? '墨蛾・暮色初见' : 'The Ink Moth・Greetings';
    companionSubtitle = language === 'zh' ? '静候你的第一缕思绪' : 'Twilight Bureau Desk';
    messageText =
      language === 'zh'
        ? '深呼吸。暮色信局在黄昏营业，专为将疲惫、委屈与不公，温和地熔铸成不卑不亢的文字。告诉我你的经历，私密内容绝不会越界。'
        : 'Take a quiet breath. The Quiet Exit Bureau exists to transform workplace strain into clear, dignified closure. Share freely; boundaries remain sealed.';
  }

  // Mini docked badge
  if (isMinimized) {
    return (
      <div className="fixed bottom-16 right-4 z-40 animate-in fade-in duration-150 no-print">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1e1b29]/90 backdrop-blur-md border border-[#e6a54f]/60 hover:border-[#e6a54f] cursor-pointer text-xs font-mono-system font-bold text-[#fbf8f4] shadow-lg hover:shadow-[#e6a54f]/20 transition-all"
          title="Awaken Ink Moth"
        >
          <InkMothCompanionSVG mood={companionMood} size={24} />
          <span>{language === 'zh' ? '墨蛾伴笔' : 'Ink Moth'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              companionMood === 'conflict'
                ? 'bg-[#b35858] animate-ping'
                : companionMood === 'ready' || companionMood === 'approved'
                ? 'bg-[#4e8b72]'
                : 'bg-[#e6a54f]'
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-18 right-4 z-40 max-w-xs sm:max-w-sm w-full animate-in slide-in-from-bottom-2 duration-200 no-print">
      <div className="bg-[#1e1b29]/95 backdrop-blur-md rounded-2xl border border-[#6f6587]/40 shadow-2xl overflow-hidden text-[#fbf8f4]">
        {/* Title bar */}
        <div className="px-3 py-1.5 bg-[#2a2539] border-b border-[#6f6587]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e6a54f]" />
            <div className="flex flex-col">
              <span className="font-mono-system text-[11px] font-bold text-[#fbf8f4] tracking-wide">
                {companionTitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded hover:bg-white/10 text-[#d8cce4] cursor-pointer"
              title="Rest into desk"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-white/10 text-[#d8cce4] cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Companion Body */}
        <div className="p-3.5 flex gap-3 items-start bg-radial from-[#2f2a3e]/40 to-transparent">
          {/* Animated Ink Moth character with heart seal */}
          <div className="shrink-0 relative mt-0.5">
            <InkMothCompanionSVG mood={companionMood} size={52} />
          </div>

          {/* Dialogue bubble */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="text-[10px] font-mono-system text-[#b8a9c9] tracking-wider uppercase">
              {companionSubtitle}
            </div>
            <p className="text-xs text-[#f7f1e5] font-sans-clean leading-relaxed font-normal">
              {messageText}
            </p>

            {/* Quick action button based on chapter state */}
            {status === 'ready_to_draft' && onNavigateSection && (
              <button
                onClick={() => onNavigateSection('draft')}
                className="mt-2 text-[11px] font-mono-system font-bold px-2.5 py-1 rounded-lg bg-[#4e8b72]/30 text-[#85d0ad] border border-[#4e8b72]/50 hover:bg-[#4e8b72]/40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'zh' ? '前往审阅辞呈文稿' : 'Review Draft Letter'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {companionMood === 'conflict' && onNavigateSection && (
              <button
                onClick={() => onNavigateSection('facts')}
                className="mt-2 text-[11px] font-mono-system font-bold px-2.5 py-1 rounded-lg bg-[#b35858]/30 text-[#e9a1a1] border border-[#b35858]/50 hover:bg-[#b35858]/40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'zh' ? '前往案卷解决分歧' : 'Resolve in Dossier'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
