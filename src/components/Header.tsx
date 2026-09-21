import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  FolderOpen,
  Info,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';
import { LetterContent, Language } from '../types';
import { getTranslation } from '../i18n';

interface HeaderProps {
  currentLetter: LetterContent;
  onNewLetter: () => void;
  onOpenCaseForm?: () => void;
  onOpenSaved: () => void;
  onOpenAbout: () => void;
  savedCount: number;
  isApproved?: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLetter,
  onNewLetter,
  onOpenCaseForm,
  onOpenSaved,
  onOpenAbout,
  savedCount,
  isApproved,
  language,
  onLanguageChange,
}) => {
  const [isNewCaseMenuOpen, setIsNewCaseMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsNewCaseMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="no-print bg-[#F6F4EF]/95 backdrop-blur-md text-[#171717] border-b border-[#E4DED5] sticky top-0 z-30 font-sans-clean transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
            <Briefcase className="w-5 h-5 text-stone-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#171717]">
                {t.appName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                {t.workspaceBadge || 'Case Workspace'}
              </span>
            </div>
            <p className="text-[11px] text-[#68635D] hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>

          <div className="hidden lg:block h-6 w-px bg-[#E4DED5]" />

          {/* Current Case Status Pill */}
          <div className="hidden lg:flex items-center gap-2 max-w-xs truncate">
            {isApproved || currentLetter.isApproved ? (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DDF5E8] text-[#065F46] border border-emerald-300 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#065F46]" />
                {t.nav.approvedReady}
              </span>
            ) : currentLetter.body ? (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF3D6] text-[#92400E] border border-amber-300 font-medium">
                {language === 'zh' ? '草稿起草中' : 'Draft in progress'}
              </span>
            ) : (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 text-[#68635D] border border-stone-200">
                {language === 'zh' ? '等待要素摄入' : 'Awaiting intake'}
              </span>
            )}
            <span className="text-xs text-[#68635D] truncate font-medium">
              {currentLetter.title || (currentLetter.body ? (language === 'zh' ? '辞职信文稿' : 'Resignation Letter') : (language === 'zh' ? '当前个案' : 'Active Case'))}
            </span>
          </div>
        </div>

        {/* Global Actions Only: New Case, Case History/Drafts, Language, About */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher labeled "EN / 中文" */}
          <div
            id="language-switcher"
            title="Language Switcher / 语言切换 (EN / 中文)"
            className="flex items-center rounded-xl bg-white border border-[#E4DED5] p-0.5 text-xs shadow-2xs"
          >
            <button
              id="lang-switcher-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-500 text-stone-950 shadow-2xs'
                  : 'text-[#68635D] hover:text-[#171717]'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
            <span className="text-stone-300 text-[10px] px-0.5 font-bold select-none">/</span>
            <button
              id="lang-switcher-zh"
              onClick={() => onLanguageChange('zh')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                language === 'zh'
                  ? 'bg-amber-500 text-stone-950 shadow-2xs'
                  : 'text-[#68635D] hover:text-[#171717]'
              }`}
              title="简体中文"
              aria-label="切换至简体中文"
            >
              中文
            </button>
          </div>

          {/* New Case (Dropdown with Start Fresh / Intake Wizard) */}
          <div className="relative" ref={menuRef}>
            <button
              id="btn-new-letter"
              onClick={() => setIsNewCaseMenuOpen(!isNewCaseMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-2xs cursor-pointer min-h-[36px]"
              title={t.nav.newCase}
            >
              <Plus className="w-4 h-4 text-stone-950" />
              <span>{t.nav.newCase}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isNewCaseMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E4DED5] py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setIsNewCaseMenuOpen(false);
                    onNewLetter();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 text-[#171717] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold">{t.nav.startFreshOption || 'Start Clean Case (Reset)'}</div>
                    <div className="text-[10px] text-[#68635D]">{language === 'zh' ? '清空当前输入，开启新档案' : 'Clear current inputs and start fresh'}</div>
                  </div>
                </button>
                {onOpenCaseForm && (
                  <button
                    onClick={() => {
                      setIsNewCaseMenuOpen(false);
                      onOpenCaseForm();
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 text-[#171717] flex items-center gap-2.5 transition-colors cursor-pointer border-t border-stone-100"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold">{t.nav.structuredFormOption || 'Guided Intake Wizard'}</div>
                      <div className="text-[10px] text-[#68635D]">{language === 'zh' ? '通过表单逐项录入要素' : 'Fill structured questionnaire form'}</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Case History or Drafts */}
          <button
            id="btn-saved-letters"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-white hover:bg-stone-50 text-[#171717] border border-[#E4DED5] shadow-2xs transition-colors cursor-pointer min-h-[36px]"
            title={t.nav.savedDrafts}
          >
            <FolderOpen className="w-4 h-4 text-[#68635D]" />
            <span className="hidden sm:inline">{t.nav.savedDrafts}</span>
            {savedCount > 0 && (
              <span className="text-[11px] bg-stone-100 text-[#171717] font-semibold px-1.5 py-0.2 rounded-full border border-stone-200">
                {savedCount}
              </span>
            )}
          </button>

          {/* About / System Diagram */}
          <button
            id="btn-about-diagram"
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-white hover:bg-stone-50 text-[#171717] border border-[#E4DED5] shadow-2xs transition-colors cursor-pointer min-h-[36px]"
            title={t.nav.systemDiagram}
            aria-label="About and Architecture Diagram"
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">{t.nav.systemDiagram}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
