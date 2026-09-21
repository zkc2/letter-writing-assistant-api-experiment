import React from 'react';
import { Check, Lock } from 'lucide-react';
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
  const steps: {
    id: WorkspaceSection;
    roman: string;
    nameEn: string;
    nameZh: string;
    isCompleted: boolean;
    isCurrent: boolean;
    badge?: string;
  }[] = [
    {
      id: 'intake',
      roman: 'I',
      nameEn: 'Intake',
      nameZh: '记忆摄入',
      isCompleted: confirmedCount > 0,
      isCurrent: currentSection === 'intake',
    },
    {
      id: 'timeline',
      roman: 'II',
      nameEn: 'Timeline',
      nameZh: '经历时线',
      isCompleted: confirmedCount >= 2,
      isCurrent: currentSection === 'timeline',
    },
    {
      id: 'facts',
      roman: 'III',
      nameEn: 'Confirmed Case File',
      nameZh: '确证案卷',
      isCompleted: confirmedCount === 4,
      isCurrent: currentSection === 'facts',
      badge: `${confirmedCount}/4`,
    },
    {
      id: 'draft',
      roman: 'IV',
      nameEn: 'Formal Draft',
      nameZh: '正稿公文',
      isCompleted: status === 'approved',
      isCurrent: currentSection === 'draft',
      badge: status === 'approved' ? (language === 'zh' ? '已核准' : 'Sealed') : undefined,
    },
  ];

  return (
    <div
      aria-label="Chapter Progress Overview"
      className="w-full bg-[#1e1b29]/80 backdrop-blur-md border border-[#6f6587]/30 rounded-xl px-3 py-1.5 mb-3 shadow-xs text-xs font-sans-clean no-print text-[#fbf8f4]"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-0.5">
        {/* Progress label */}
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-[#6f6587]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e6a54f]" />
          <span className="font-mono-system text-[10px] uppercase tracking-wider text-[#d8cce4]/80 font-bold">
            {language === 'zh' ? '章节进度' : 'Case Progress'}
          </span>
        </div>

        {/* Horizontal Stepper Steps */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 justify-between sm:justify-start">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div
                  className={`h-[1px] w-3 sm:w-6 shrink-0 transition-colors ${
                    step.isCompleted || step.isCurrent
                      ? 'bg-[#e6a54f]/60'
                      : 'bg-[#6f6587]/30'
                  }`}
                />
              )}

              <button
                type="button"
                onClick={() => onSelectSection(step.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-left transition-all cursor-pointer shrink-0 ${
                  step.isCurrent
                    ? 'bg-[#2f2b3e] text-[#e6a54f] border border-[#e6a54f]/60 font-semibold'
                    : step.isCompleted
                    ? 'text-[#85d0ad] hover:text-[#fbf8f4] hover:bg-[#252132]'
                    : 'text-[#b8a9c9]/70 hover:text-[#fbf8f4] hover:bg-[#252132]'
                }`}
                title={language === 'zh' ? `点击查看 ${step.nameZh}` : `View ${step.nameEn}`}
              >
                {/* Step indicator dot/icon */}
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center font-mono-system text-[9px] shrink-0 font-bold ${
                    step.isCompleted
                      ? 'bg-[#4e8b72] text-[#fbf8f4]'
                      : step.isCurrent
                      ? 'bg-[#e6a54f] text-[#1e1b29]'
                      : 'bg-[#6f6587]/30 text-[#b8a9c9]'
                  }`}
                >
                  {step.isCompleted ? <Check className="w-2.5 h-2.5" /> : step.roman}
                </span>

                <span className="font-mono-system text-[11px] whitespace-nowrap">
                  <span className="opacity-70 mr-1 text-[10px]">CH.{step.roman}:</span>
                  <span>{language === 'zh' ? step.nameZh : step.nameEn}</span>
                </span>

                {step.badge && (
                  <span
                    className={`ml-1 text-[9px] font-mono-system px-1.5 py-0.2 rounded font-semibold ${
                      step.isCompleted
                        ? 'bg-[#4e8b72]/30 text-[#85d0ad]'
                        : 'bg-[#e6a54f]/20 text-[#e6a54f]'
                    }`}
                  >
                    {step.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
