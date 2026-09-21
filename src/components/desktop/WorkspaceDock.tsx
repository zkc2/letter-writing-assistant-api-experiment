import React, { useState } from 'react';
import {
  MessageSquareCode,
  GitCommit,
  FolderLock,
  FileSignature,
  History,
  Sliders,
  MoreHorizontal,
  Lock,
  CheckCircle2,
  Sparkles,
  Printer,
  Info,
} from 'lucide-react';
import { WorkspaceSection, CaseDesktopStatus, Language } from '../../types';
import { getTranslation } from '../../i18n';

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
  const t = getTranslation(language);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const mainApps: {
    id: WorkspaceSection;
    label: string;
    labelEn: string;
    icon: string;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'intake',
      label: '要素摄入',
      labelEn: 'Intake',
      icon: '💬',
    },
    {
      id: 'timeline',
      label: '经历时间线',
      labelEn: 'Timeline',
      icon: '⏳',
    },
    {
      id: 'facts',
      label: '确证案卷',
      labelEn: 'Case File',
      icon: '🗂️',
      badge: `${confirmedCount}/4`,
      badgeColor: confirmedCount === 4 ? 'bg-[#BFE2D3] text-[#1B5E3F]' : 'bg-[#FFF3D6] text-[#B36D14]',
    },
    {
      id: 'draft',
      label: '辞职文稿',
      labelEn: 'Draft Letter',
      icon: status === 'approved' ? '📜' : confirmedCount === 4 ? '✍️' : '🔒',
      badge: status === 'approved' ? '✓' : confirmedCount === 4 ? 'UNLOCKED' : 'LOCKED',
      badgeColor:
        status === 'approved'
          ? 'bg-[#BFE2D3] text-[#1B5E3F]'
          : confirmedCount === 4
          ? 'bg-[#BFE2D3] text-[#1B5E3F]'
          : 'bg-[#F2EDF3] text-[#68616D]',
    },
    {
      id: 'history',
      label: '案卷历史',
      labelEn: 'Case History',
      icon: '📁',
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'settings',
      label: '排版设置',
      labelEn: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <>
      {/* Desktop Floating Bottom Dock */}
      <nav
        aria-label="Desktop Workspace Dock"
        className="hidden md:flex fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#FFFDFC]/95 backdrop-blur-md border-2 border-[#403A45] rounded-2xl px-2 py-1.5 retro-dock-shadow items-center gap-1 font-sans-clean no-print"
      >
        {mainApps.map((app) => {
          const isActive = activeSection === app.id;
          return (
            <button
              key={app.id}
              onClick={() => onSelectSection(app.id)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#DCD4EA] text-[#29252D] font-bold shadow-xs'
                  : 'text-[#68616D] hover:bg-[#F6F0E7] hover:text-[#29252D]'
              }`}
            >
              <div className="relative text-lg leading-none">
                <span>{app.icon}</span>
                {app.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-mono-system font-bold px-1 rounded-full border border-[#403A45]/20 ${
                      app.badgeColor || 'bg-[#F2EDF3] text-[#29252D]'
                    }`}
                  >
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono-system whitespace-nowrap">
                {language === 'zh' ? app.label : app.labelEn}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B36D14] absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Sticky Bottom Navigation (Max 4 items + More) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDFC] border-t-2 border-[#403A45] px-2 py-1 flex items-center justify-around no-print"
      >
        {mainApps.slice(0, 4).map((app) => {
          const isActive = activeSection === app.id;
          return (
            <button
              key={app.id}
              onClick={() => onSelectSection(app.id)}
              className={`flex-1 flex flex-col items-center py-1 transition-colors min-h-[44px] justify-center ${
                isActive ? 'text-[#B36D14] font-bold' : 'text-[#68616D]'
              }`}
            >
              <div className="relative text-base">
                <span>{app.icon}</span>
                {app.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-mono-system font-bold px-1 rounded-full bg-[#DCD4EA] text-[#29252D]">
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
                ? 'text-[#B36D14] font-bold'
                : 'text-[#68616D]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-mono-system mt-0.5">
              {language === 'zh' ? '更多' : 'More'}
            </span>
          </button>

          {/* More popup */}
          {isMobileMoreOpen && (
            <div className="absolute bottom-12 right-2 w-48 bg-[#FFFDFC] rounded-xl border-2 border-[#403A45] retro-dock-shadow py-1 z-50 text-xs">
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onSelectSection('history');
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#F6F0E7] flex items-center gap-2 text-[#29252D]"
              >
                <span>📁</span>
                <span className="font-mono-system">
                  {language === 'zh' ? '案卷历史' : 'Case History'}
                </span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onSelectSection('settings');
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#F6F0E7] flex items-center gap-2 text-[#29252D]"
              >
                <span>⚙️</span>
                <span className="font-mono-system">
                  {language === 'zh' ? '排版设置' : 'Settings'}
                </span>
              </button>
              {onOpenAbout && (
                <button
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#F6F0E7] flex items-center gap-2 text-[#29252D] border-t border-[#403A45]/10"
                >
                  <Info className="w-4 h-4 text-[#68616D]" />
                  <span className="font-mono-system">
                    {language === 'zh' ? '系统说明' : 'About System'}
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
