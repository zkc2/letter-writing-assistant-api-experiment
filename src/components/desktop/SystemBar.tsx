import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Printer,
  ChevronDown,
  Info,
  Globe,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';
import { CaseDesktopStatus, Language, LetterContent } from '../../types';
import { DraftUnlockState } from '../workspace/DraftUnlockState';
import { InkMothIcon } from './BureauIcons';

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
    <header className="h-11 bg-[#1e1b29] border-b border-[#353043] px-3 sm:px-4 flex items-center justify-between gap-3 text-xs select-none sticky top-0 z-30 font-sans-clean no-print text-[#FCFAF6]">
      {/* Left: Bureau Identity & Active Case Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono-system font-bold text-[#FCFAF6]">
          <div className="w-6 h-6 rounded-lg bg-[#2a2539] border border-[#e6a54f]/50 flex items-center justify-center text-[#e6a54f]">
            <InkMothIcon size={14} />
          </div>
          <span className="tracking-tight hidden sm:inline text-sm font-semibold">
            {language === 'zh' ? '暮色信局・Quiet Exit Bureau' : 'Quiet Exit Bureau'}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#353043] border border-[#6f6587]/30 text-[#d8cce4] hidden md:inline">
            {language === 'zh' ? '离职公文台' : 'Desk v3.5'}
          </span>
        </div>

        <div className="h-4 w-px bg-[#6f6587]/30 hidden sm:block" />

        {/* Case Name & ID */}
        <div className="flex items-center gap-2 max-w-xs truncate">
          <span className="font-mono-system text-[11px] text-[#e6a54f] font-semibold">
            DOSSIER #QEB-26
          </span>
          <span className="text-xs font-semibold text-[#f7f1e5] truncate">
            {currentLetter.title || (language === 'zh' ? '正式辞呈' : 'Active Departure')}
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

      {/* Right: Quick Global Controls & Twilight Clock */}
      <div className="flex items-center gap-2">
        {/* New Case Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#e6a54f]/40 bg-[#2a2539] hover:bg-[#353043] text-xs font-mono-system font-bold text-[#f7f1e5] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#e6a54f]" />
            <span>{language === 'zh' ? '受理新案' : 'New Dossier'}</span>
            <ChevronDown className="w-3 h-3 text-[#b8a9c9]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-[#262433] rounded-xl border border-[#6f6587]/40 retro-dock-shadow py-1.5 z-50 text-xs text-[#FCFAF6]">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNewCase();
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#353043] flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#e6a54f]" />
                <div>
                  <div className="font-semibold">{language === 'zh' ? '开启新案卷' : 'Clean Slate Intake'}</div>
                  <div className="text-[10px] text-[#b8a9c9]">{language === 'zh' ? '重置信局工作台输入' : 'Clean intake workspace'}</div>
                </div>
              </button>

              {onOpenScenarios && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenScenarios();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#353043] flex items-center gap-2 cursor-pointer border-t border-[#353043]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d8cce4]" />
                  <div>
                    <div className="font-semibold">{language === 'zh' ? '导入预置职场场景' : 'Load Experience Scenario'}</div>
                    <div className="text-[10px] text-[#b8a9c9]">{language === 'zh' ? '过载 / 价值观分歧 / 转型' : 'Workload, boundary, growth'}</div>
                  </div>
                </button>
              )}

              {onOpenCaseForm && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCaseForm();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#353043] flex items-center gap-2 cursor-pointer border-t border-[#353043]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#4e8b72]" />
                  <div>
                    <div className="font-semibold">{language === 'zh' ? '案卷四柱结构表' : 'Structured Case Form'}</div>
                    <div className="text-[10px] text-[#b8a9c9]">{language === 'zh' ? '逐栏精确核对要素' : 'Field by field entry'}</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={onPrint}
          className="p-1.5 rounded-lg border border-[#6f6587]/30 bg-[#2a2539] hover:bg-[#353043] text-[#FCFAF6] cursor-pointer"
          title={language === 'zh' ? '打印/导出公文纸' : 'Print / Export Letter'}
        >
          <Printer className="w-3.5 h-3.5" />
        </button>

        {/* Language Switch */}
        <button
          onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
          className="px-2 py-1 rounded-lg border border-[#6f6587]/30 bg-[#2a2539] hover:bg-[#353043] font-mono-system text-[11px] font-bold text-[#f7f1e5] flex items-center gap-1 cursor-pointer"
        >
          <Globe className="w-3 h-3 text-[#9ebdcb]" />
          <span>{language === 'zh' ? 'EN' : '中'}</span>
        </button>

        {/* About / Bureau Blueprint */}
        <button
          onClick={onOpenAbout}
          className="p-1.5 rounded-lg border border-[#6f6587]/30 bg-[#2a2539] hover:bg-[#353043] text-[#d8cce4] cursor-pointer"
          title={language === 'zh' ? '信局机制与理念' : 'Bureau Blueprint'}
        >
          <Info className="w-3.5 h-3.5 text-[#d8cce4]" />
        </button>

        {/* Twilight Bureau Clock */}
        <div className="font-mono-system text-[11px] text-[#e6a54f] font-bold px-2 py-0.5 rounded bg-[#2a2539] border border-[#6f6587]/40 hidden sm:block">
          {timeStr || '18:00'}
        </div>
      </div>
    </header>
  );
};
