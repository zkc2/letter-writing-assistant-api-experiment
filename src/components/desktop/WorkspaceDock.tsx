import React, { useState } from 'react';
import {
  MoreHorizontal,
  Info,
} from 'lucide-react';
import { WorkspaceSection, CaseDesktopStatus, Language } from '../../types';
import {
  BureauFragmentIcon,
  BureauTimelineIcon,
  BureauDossierIcon,
  BureauDraftIcon,
  BureauSealIcon,
  BureauArchiveIcon,
  BureauSettingIcon,
} from './BureauIcons';

interface WorkspaceDockProps {
  activeSection: WorkspaceSection;
  onSelectSection: (section: WorkspaceSection) => void;
  status: CaseDesktopStatus;
  confirmedCount: number;
  savedCount: number;
  language: Language;
  onOpenAbout?: () => void;
  onOpenSaved?: () => void;
  onOpenSettings?: () => void;
}

export const WorkspaceDock: React.FC<WorkspaceDockProps> = ({
  activeSection,
  onSelectSection,
  status,
  confirmedCount,
  savedCount,
  language,
  onOpenAbout,
  onOpenSaved,
  onOpenSettings,
}) => {
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const mainApps: {
    id: WorkspaceSection;
    label: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'intake',
      label: '要素摄入',
      labelEn: 'Intake',
      icon: BureauFragmentIcon,
    },
    {
      id: 'timeline',
      label: '经历光阴',
      labelEn: 'Timeline',
      icon: BureauTimelineIcon,
    },
    {
      id: 'facts',
      label: '确证案卷',
      labelEn: 'Dossier',
      icon: BureauDossierIcon,
      badge: `${confirmedCount}/4`,
      badgeColor: confirmedCount === 4 ? 'bg-[#4e8b72]/40 text-[#85d0ad] border-[#4e8b72]' : 'bg-[#e6a54f]/30 text-[#e6a54f] border-[#e6a54f]/60',
    },
    {
      id: 'draft',
      label: '辞呈文稿',
      labelEn: 'Draft Letter',
      icon: status === 'approved' ? BureauSealIcon : BureauDraftIcon,
      badge: status === 'approved' ? 'SEALED' : confirmedCount === 4 ? 'READY' : 'LOCKED',
      badgeColor:
        status === 'approved'
          ? 'bg-[#4e8b72]/40 text-[#85d0ad] border-[#4e8b72]'
          : confirmedCount === 4
          ? 'bg-[#e6a54f]/30 text-[#e6a54f] border-[#e6a54f]/60'
          : 'bg-[#353043] text-[#b8a9c9] border-[#6f6587]/30',
    },
    {
      id: 'history',
      label: '案卷档案',
      labelEn: 'Archives',
      icon: BureauArchiveIcon,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'settings',
      label: '公文设色',
      labelEn: 'Letter Style',
      icon: BureauSettingIcon,
    },
  ];

  return (
    <>
      {/* Desktop Floating Bottom Dock - Twilight Desk Bar */}
      <nav
        aria-label="Desktop Workspace Dock"
        className="hidden md:flex fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#1e1b29]/95 backdrop-blur-md border border-[#6f6587]/40 rounded-2xl px-2.5 py-1.5 retro-dock-shadow items-center gap-1 font-sans-clean no-print text-[#FCFAF6]"
      >
        {mainApps.map((app) => {
          const isActive = activeSection === app.id;
          const IconComponent = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => onSelectSection(app.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#2f2a3e] text-[#fbf8f4] font-bold shadow-sm ring-1 ring-[#e6a54f]/60'
                  : 'text-[#d8cce4] hover:bg-[#282436] hover:text-[#fbf8f4]'
              }`}
            >
              <div className="relative leading-none">
                <span className={`p-1 rounded-md transition-colors ${isActive ? 'text-[#e6a54f]' : 'text-[#b8a9c9]'}`}>
                  <IconComponent size={18} />
                </span>
                {app.badge !== undefined && (
                  <span
                    className={`absolute -top-2 -right-3 text-[9px] font-mono-system font-bold px-1.5 py-0.2 rounded-full border ${
                      app.badgeColor || 'bg-[#353043] text-[#FCFAF6] border-[#6f6587]/40'
                    }`}
                  >
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono-system whitespace-nowrap">
                {language === 'zh' ? app.label : app.labelEn}
              </span>

              {/* Active Indicator Amber Pip */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#e6a54f] absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Sticky Bottom Navigation (Max 4 items + More) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1e1b29] border-t border-[#353043] px-2 py-1 flex items-center justify-around no-print text-[#FCFAF6]"
      >
        {mainApps.slice(0, 4).map((app) => {
          const isActive = activeSection === app.id;
          const IconComponent = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => onSelectSection(app.id)}
              className={`flex-1 flex flex-col items-center py-1 transition-colors min-h-[44px] justify-center ${
                isActive ? 'text-[#e6a54f] font-bold' : 'text-[#b8a9c9]'
              }`}
            >
              <div className="relative">
                <IconComponent size={18} />
                {app.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 text-[8px] font-mono-system font-bold px-1 rounded-full bg-[#2f2a3e] text-[#e6a54f] border border-[#e6a54f]/50">
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono-system mt-0.5 whitespace-nowrap">
                {language === 'zh' ? app.label : app.labelEn}
              </span>
            </button>
          );
        })}

        {/* More Menu Button on Mobile */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[44px]">
          <button
            onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
            className={`flex flex-col items-center py-1 ${
              isMobileMoreOpen || activeSection === 'history' || activeSection === 'settings'
                ? 'text-[#e6a54f] font-bold'
                : 'text-[#b8a9c9]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-mono-system mt-0.5">
              {language === 'zh' ? '更多' : 'More'}
            </span>
          </button>

          {/* More popup */}
          {isMobileMoreOpen && (
            <div className="absolute bottom-12 right-2 w-48 bg-[#262433] rounded-xl border border-[#6f6587]/40 retro-dock-shadow py-1 z-50 text-xs text-[#FCFAF6]">
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onSelectSection('history');
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#353043] flex items-center gap-2 cursor-pointer"
              >
                <BureauArchiveIcon size={16} />
                <span className="font-mono-system">
                  {language === 'zh' ? '案卷历史' : 'Case History'}
                </span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onSelectSection('settings');
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#353043] flex items-center gap-2 cursor-pointer"
              >
                <BureauSettingIcon size={16} />
                <span className="font-mono-system">
                  {language === 'zh' ? '公文设色' : 'Letter Style'}
                </span>
              </button>
              {onOpenAbout && (
                <button
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#353043] flex items-center gap-2 border-t border-[#353043] cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#b8a9c9]" />
                  <span className="font-mono-system">
                    {language === 'zh' ? '信局机制' : 'About Bureau'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
