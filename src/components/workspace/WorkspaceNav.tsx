import React from 'react';
import {
  MessageSquareQuote,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { WorkspaceSection, Language } from '../../types';
import { getTranslation } from '../../i18n';

interface WorkspaceNavProps {
  activeSection: WorkspaceSection;
  onSelectSection: (section: WorkspaceSection) => void;
  intakeCount: number;
  timelineCount: number;
  confirmedFactsCount: number; // 0 to 4
  hasConflicts?: boolean;
  isDraftReady?: boolean;
  isApproved?: boolean;
  language: Language;
}

export const WorkspaceNav: React.FC<WorkspaceNavProps> = ({
  activeSection,
  onSelectSection,
  intakeCount,
  timelineCount,
  confirmedFactsCount,
  hasConflicts,
  isDraftReady,
  isApproved,
  language,
}) => {
  const t = getTranslation(language);

  const sections: {
    id: WorkspaceSection;
    label: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
  }[] = [
    {
      id: 'intake',
      label: t.workspace.sections.intake,
      icon: <MessageSquareQuote className="w-4 h-4" />,
      badge: (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
          {intakeCount > 0 ? intakeCount : 'Step 1'}
        </span>
      ),
    },
    {
      id: 'timeline',
      label: t.workspace.sections.timeline,
      icon: <Clock className="w-4 h-4" />,
      badge: (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            timelineCount > 0
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-stone-100 text-stone-500'
          }`}
        >
          {timelineCount}
        </span>
      ),
    },
    {
      id: 'facts',
      label: t.workspace.sections.facts,
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: hasConflicts ? (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-0.5">
          <AlertTriangle className="w-3 h-3 text-red-700" />
          !
        </span>
      ) : (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            confirmedFactsCount === 4
              ? 'bg-[#DDF5E8] text-[#065F46] border border-emerald-300'
              : confirmedFactsCount > 0
              ? 'bg-[#FFF3D6] text-[#92400E] border border-amber-300'
              : 'bg-stone-100 text-stone-500'
          }`}
        >
          {confirmedFactsCount}/4
        </span>
      ),
    },
    {
      id: 'draft',
      label: t.workspace.sections.draft,
      icon: <FileText className="w-4 h-4" />,
      badge: isApproved ? (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#DDF5E8] text-[#065F46] border border-emerald-300">
          ✓
        </span>
      ) : isDraftReady ? (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          4/4
        </span>
      ) : (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-400">
          —
        </span>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#F6F4EF] border-b border-[#E4DED5] px-3 pt-2 pb-0">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
        {sections.map((section, idx) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              id={`tab-workspace-${section.id}`}
              onClick={() => onSelectSection(section.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer border-t border-x ${
                isActive
                  ? 'bg-white text-[#171717] border-[#E4DED5] shadow-xs relative -mb-px z-10'
                  : 'bg-transparent text-[#68635D] border-transparent hover:text-[#171717] hover:bg-stone-200/50'
              }`}
              role="tab"
              aria-selected={isActive}
            >
              <span className={isActive ? 'text-amber-600' : 'text-[#68635D]'}>
                {section.icon}
              </span>
              <span>{section.label}</span>
              {section.badge}
            </button>
          );
        })}
      </div>
    </div>
  );
};
