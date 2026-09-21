import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Printer,
  Globe,
  Info,
  Lock,
  Unlock,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { CaseDesktopStatus, Language, LetterContent } from '../../types';
import { getTranslation } from '../../i18n';
import { DraftUnlockState } from '../workspace/DraftUnlockState';

interface SystemBarProps {
  status: CaseDesktopStatus;
  confirmedCount: number;
  currentLetter: LetterContent;
  onNewCase: () => void;
  onOpenCaseForm?: () => void;
  onOpenScenarios?: () => void;
  onOpenAbout: () => void;
  onPrint: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SystemBar: React.FC<SystemBarProps> = ({
  status,
  confirmedCount,
  currentLetter,
  onNewCase,
  onOpenCaseForm,
  onOpenScenarios,
  onOpenAbout,
  onPrint,
  language,
  onLanguageChange,
}) => {
  const t = getTranslation(language);
  const [timeStr, setTimeStr] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-11 bg-[#F6F0E7] border-b-2 border-[#403A45] px-3 sm:px-4 flex items-center justify-between gap-3 text-xs select-none sticky top-0 z-30 font-sans-clean no-print">
      {/* Left: OS Brand & Active Case Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono-system font-bold text-[#29252D]">
          <div className="w-5 h-5 rounded bg-[#F2B35D] border border-[#403A45] flex items-center justify-center text-[10px]">
            💼
          </div>
          <span className="tracking-tight hidden sm:inline">Ghostwriter Case Desktop</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#DCD4EA] border border-[#403A45]/30 text-[#403A45] hidden md:inline">
            v3.2
          </span>
        </div>

        <div className="h-4 w-px bg-[#403A45]/20 hidden sm:block" />

        {/* Case Name & ID */}
        <div className="flex items-center gap-2 max-w-xs truncate">
          <span className="font-mono-system text-[11px] text-[#68616D] font-semibold">
            CASE #GW-26
          </span>
          <span className="text-xs font-semibold text-[#29252D] truncate">
            {currentLetter.title || (language === 'zh' ? '离职案件' : 'Active Departure')}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="hidden lg:block">
          <DraftUnlockState
            status={status}
            confirmedCount={confirmedCount}
            totalRequired={4}
            language={language}
            compact
          />
        </div>
      </div>

      {/* Right: Quick Global Controls & Retro OS Clock */}
      <div className="flex items-center gap-2">
        {/* New Case Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#403A45] bg-[#FFFDFC] hover:bg-[#F2EDF3] text-xs font-mono-system font-bold text-[#29252D] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#B36D14]" />
            <span>{language === 'zh' ? '新建案件' : 'New Case'}</span>
            <ChevronDown className="w-3 h-3 text-[#68616D]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-[#FFFDFC] rounded-xl border-2 border-[#403A45] retro-dock-shadow py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNewCase();
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#F6F0E7] flex items-center gap-2 text-[#29252D] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B36D14]" />
                <div>
                  <div className="font-semibold">{language === 'zh' ? '空白新案件' : 'Start Fresh Case'}</div>
                  <div className="text-[10px] text-[#68616D]">{language === 'zh' ? '清空当前输入' : 'Clean intake state'}</div>
                </div>
              </button>

              {onOpenScenarios && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenScenarios();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#F6F0E7] flex items-center gap-2 text-[#29252D] cursor-pointer border-t border-[#403A45]/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#73579A]" />
                  <div>
                    <div className="font-semibold">{language === 'zh' ? '导入预置场景' : 'Load Scenario Preset'}</div>
                    <div className="text-[10px] text-[#68616D]">{language === 'zh' ? '加班过载 / 职业转型' : 'Workload, toxic, career'}</div>
                  </div>
                </button>
              )}

              {onOpenCaseForm && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCaseForm();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#F6F0E7] flex items-center gap-2 text-[#29252D] cursor-pointer border-t border-[#403A45]/10"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#3B8C68]" />
                  <div>
                    <div className="font-semibold">{language === 'zh' ? '结构化案卷表格' : 'Structured Case Form'}</div>
                    <div className="text-[10px] text-[#68616D]">{language === 'zh' ? '逐栏精确填写' : 'Field by field entry'}</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={onPrint}
          className="p-1.5 rounded-lg border border-[#403A45]/30 bg-[#FFFDFC] hover:bg-[#F2EDF3] text-[#29252D] cursor-pointer"
          title={language === 'zh' ? '打印辞职信' : 'Print Letter'}
        >
          <Printer className="w-3.5 h-3.5" />
        </button>

        {/* Language Switch */}
        <button
          onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
          className="px-2 py-1 rounded-lg border border-[#403A45]/30 bg-[#FFFDFC] hover:bg-[#F2EDF3] font-mono-system text-[11px] font-bold text-[#29252D] flex items-center gap-1 cursor-pointer"
        >
          <Globe className="w-3 h-3 text-[#215E6D]" />
          <span>{language === 'zh' ? 'EN' : '中'}</span>
        </button>

        {/* About / System Guide */}
        <button
          onClick={onOpenAbout}
          className="p-1.5 rounded-lg border border-[#403A45]/30 bg-[#FFFDFC] hover:bg-[#F2EDF3] text-[#29252D] cursor-pointer"
          title={language === 'zh' ? '系统架构与引导' : 'System Guide'}
        >
          <Info className="w-3.5 h-3.5 text-[#68616D]" />
        </button>

        {/* Retro Clock */}
        <div className="font-mono-system text-[11px] text-[#29252D] font-bold px-2 py-0.5 rounded bg-[#DCD4EA]/50 border border-[#403A45]/20 hidden sm:block">
          {timeStr || '12:00'}
        </div>
      </div>
    </header>
  );
};
