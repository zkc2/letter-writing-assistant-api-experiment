import React from 'react';
import {
  BureauFragmentIcon,
  BureauTimelineIcon,
  BureauDossierIcon,
  BureauDraftIcon,
  BureauSealIcon,
} from './BureauIcons';
import { WorkspaceSection, CaseDesktopStatus, Language } from '../../types';

interface BureauChapterProgressProps {
  currentSection: WorkspaceSection;
  onSelectSection: (section: WorkspaceSection) => void;
  status: CaseDesktopStatus;
  confirmedCount: number;
  language: Language;
}

export const BureauChapterProgress: React.FC<BureauChapterProgressProps> = ({
  currentSection,
  onSelectSection,
  status,
  confirmedCount,
  language,
}) => {
  const chapters: {
    id: WorkspaceSection;
    roman: string;
    label: string;
    labelEn: string;
    sub: string;
    subEn: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    isUnlocked: boolean;
    isCompleted: boolean;
    isCurrent: boolean;
  }[] = [
    {
      id: 'intake',
      roman: 'I',
      label: '摄入记忆碎片',
      labelEn: 'Memory Intake',
      sub: '倾诉与初次聆听',
      subEn: 'Listening & Whispers',
      icon: BureauFragmentIcon,
      isUnlocked: true,
      isCompleted: confirmedCount > 0,
      isCurrent: currentSection === 'intake',
    },
    {
      id: 'timeline',
      roman: 'II',
      label: '重构光阴轨迹',
      labelEn: 'Time Thread',
      sub: '按时序排查事实',
      subEn: 'Chronological Trail',
      icon: BureauTimelineIcon,
      isUnlocked: true,
      isCompleted: confirmedCount >= 2,
      isCurrent: currentSection === 'timeline',
    },
    {
      id: 'facts',
      roman: 'III',
      label: '四柱确证案卷',
      labelEn: 'Case Dossier',
      sub: `${confirmedCount}/4 柱确证已封存`,
      subEn: `${confirmedCount}/4 Pillars Sealed`,
      icon: BureauDossierIcon,
      isUnlocked: true,
      isCompleted: confirmedCount === 4,
      isCurrent: currentSection === 'facts',
    },
    {
      id: 'draft',
      roman: 'IV',
      label: '拟写辞呈公文',
      labelEn: 'Formal Draft',
      sub: status === 'approved' ? '文书已核准' : confirmedCount === 4 ? '公文纸已铺就' : '静待案卷确证',
      subEn: status === 'approved' ? 'Sealed & Valid' : confirmedCount === 4 ? 'Paper Ready' : 'Awaiting 4/4',
      icon: status === 'approved' ? BureauSealIcon : BureauDraftIcon,
      isUnlocked: confirmedCount >= 1, // allow browsing anytime
      isCompleted: status === 'approved',
      isCurrent: currentSection === 'draft',
    },
  ];

  return (
    <div
      aria-label="Bureau Chapter Progress"
      className="w-full bg-[#1e1b29]/80 backdrop-blur-md border border-[#6f6587]/30 rounded-2xl p-2.5 sm:p-3 mb-3.5 shadow-sm text-xs font-sans-clean no-print text-[#fbf8f4]"
    >
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e6a54f] animate-pulse" />
          <span className="font-mono-system text-[11px] uppercase tracking-widest text-[#d8cce4] font-semibold">
            {language === 'zh' ? '暮色调查序章・Bureau Chapters' : 'Twilight Bureau Chapters'}
          </span>
        </div>
        <span className="font-mono-system text-[10px] text-[#b8a9c9]">
          {status === 'approved'
            ? language === 'zh' ? '◆ 终章・安全签发' : '◆ Final Chapter・Approved'
            : language === 'zh' ? `案卷确证度 ${confirmedCount}/4` : `Dossier Pillars: ${confirmedCount}/4`}
        </span>
      </div>

      {/* Chapters ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {chapters.map((ch) => {
          const Icon = ch.icon;
          return (
            <button
              key={ch.id}
              onClick={() => onSelectSection(ch.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                ch.isCurrent
                  ? 'bg-[#2f2b3e] border-[#e6a54f] shadow-md ring-1 ring-[#e6a54f]/50'
                  : ch.isCompleted
                  ? 'bg-[#221f2f]/80 border-[#4e8b72]/60 hover:bg-[#2a263a]'
                  : 'bg-[#1a1724]/70 border-[#6f6587]/20 hover:bg-[#232030]'
              }`}
            >
              {/* Subtle chapter roman watermark */}
              <span className="absolute right-2 -bottom-1 font-mono-system text-2xl font-bold opacity-10 pointer-events-none select-none text-[#fbf8f4]">
                {ch.roman}
              </span>

              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono-system text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      ch.isCurrent
                        ? 'bg-[#e6a54f] text-[#262433] border-[#e6a54f]'
                        : ch.isCompleted
                        ? 'bg-[#4e8b72]/30 text-[#85d0ad] border-[#4e8b72]/50'
                        : 'bg-[#6f6587]/20 text-[#b8a9c9] border-[#6f6587]/30'
                    }`}
                  >
                    CH.{ch.roman}
                  </span>
                  <span
                    className={`p-1 rounded-md ${
                      ch.isCurrent ? 'text-[#e6a54f]' : ch.isCompleted ? 'text-[#85d0ad]' : 'text-[#b8a9c9]'
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                </div>

                {ch.isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4e8b72]" title="Completed" />
                )}
              </div>

              <div className="font-semibold text-xs text-[#fbf8f4] truncate">
                {language === 'zh' ? ch.label : ch.labelEn}
              </div>
              <div className="text-[10px] text-[#b8a9c9] truncate mt-0.5 font-mono-system">
                {language === 'zh' ? ch.sub : ch.subEn}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
