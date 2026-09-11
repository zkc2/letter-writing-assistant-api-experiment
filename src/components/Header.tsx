import React, { useState } from 'react';
import {
  HeartHandshake,
  Plus,
  BookOpen,
  FolderOpen,
  Printer,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Sparkles,
  Info,
  Languages,
} from 'lucide-react';
import { LetterContent, Language } from '../types';
import { getTranslation } from '../i18n';

interface HeaderProps {
  currentLetter: LetterContent;
  onNewLetter: () => void;
  onOpenCaseForm?: () => void;
  onOpenTemplates: () => void;
  onOpenSaved: () => void;
  onOpenAssistant: () => void;
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
  onOpenTemplates,
  onOpenSaved,
  onOpenAssistant,
  onOpenAbout,
  savedCount,
  isApproved,
  language,
  onLanguageChange,
}) => {
  const [copied, setCopied] = useState(false);
  const t = getTranslation(language);

  const handleCopy = async () => {
    const fullText = [
      currentLetter.date,
      '',
      currentLetter.recipient.name ? currentLetter.recipient.name : '',
      currentLetter.recipient.title ? currentLetter.recipient.title : '',
      currentLetter.recipient.organization ? currentLetter.recipient.organization : '',
      currentLetter.recipient.address ? currentLetter.recipient.address : '',
      '',
      currentLetter.subject ? `SUBJECT: ${currentLetter.subject}\n` : '',
      currentLetter.salutation,
      '',
      currentLetter.body,
      '',
      currentLetter.closing,
      currentLetter.signoffName,
      currentLetter.sender.title ? currentLetter.sender.title : '',
      currentLetter.postscript ? `\n${currentLetter.postscript}` : '',
    ]
      .filter((line, i, arr) => {
        if (line === '' && arr[i - 1] === '') return false;
        return true;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const fullText = `${currentLetter.title || (language === 'zh' ? '辞职信' : 'Resignation Letter')}\n${'='.repeat(40)}\n\n` +
      `Date: ${currentLetter.date}\n\n` +
      (currentLetter.recipient.name ? `To: ${currentLetter.recipient.name}\n` : '') +
      (currentLetter.recipient.organization ? `${currentLetter.recipient.organization}\n` : '') +
      (currentLetter.recipient.address ? `${currentLetter.recipient.address}\n\n` : '\n') +
      (currentLetter.subject ? `Subject: ${currentLetter.subject}\n\n` : '') +
      `${currentLetter.salutation}\n\n` +
      `${currentLetter.body}\n\n` +
      `${currentLetter.closing}\n` +
      `${currentLetter.signoffName}\n` +
      (currentLetter.sender.title ? `${currentLetter.sender.title}\n` : '') +
      (currentLetter.postscript ? `\n${currentLetter.postscript}\n` : '');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resignation-letter-${(currentLetter.signoffName || 'draft').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="no-print bg-stone-950 text-stone-100 border-b border-stone-800 sticky top-0 z-30 font-sans-clean">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center shadow-sm">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-stone-100">
                {t.appName}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {t.appBadge}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>

          <div className="hidden lg:block h-6 w-px bg-stone-800" />

          <div className="hidden lg:flex items-center gap-2 max-w-xs truncate">
            {isApproved || currentLetter.isApproved ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {t.nav.approvedReady}
              </span>
            ) : currentLetter.body ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                {language === 'zh' ? '草稿起草中' : 'Draft in progress'}
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-800">
                {language === 'zh' ? '等待要素录入' : 'Awaiting inputs'}
              </span>
            )}
            <span className="text-xs text-stone-400 truncate">
              {currentLetter.title || (currentLetter.body ? (language === 'zh' ? '辞职信文稿' : 'Resignation Letter') : (language === 'zh' ? '新会话' : 'New Session'))}
            </span>
          </div>
        </div>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Language Switcher labeled "EN / 中文" */}
          <div
            id="language-switcher"
            title="Language Switcher / 语言切换 (EN / 中文)"
            className="flex items-center rounded-xl bg-stone-900 border border-stone-700 p-0.5 text-xs shadow-inner"
          >
            <button
              id="lang-switcher-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
            <span className="text-stone-600 text-[10px] px-0.5 font-bold select-none">/</span>
            <button
              id="lang-switcher-zh"
              onClick={() => onLanguageChange('zh')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                language === 'zh'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="简体中文"
              aria-label="切换至简体中文"
            >
              中文
            </button>
          </div>

          <button
            id="btn-ai-assistant"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-sm cursor-pointer"
            title={t.nav.polishAudit}
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">{t.nav.polishAudit}</span>
          </button>

          <button
            id="btn-open-templates"
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            title={t.nav.scenarios}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.scenarios}</span>
          </button>

          {onOpenCaseForm && (
            <button
              id="btn-case-form"
              onClick={onOpenCaseForm}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              title={t.nav.newCase}
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.newCase}</span>
            </button>
          )}

          <button
            id="btn-about-diagram"
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            title={t.nav.systemDiagram}
            aria-label="About and System Diagram"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.nav.systemDiagram}</span>
          </button>

          <button
            id="btn-new-letter"
            onClick={onNewLetter}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            title={t.nav.startNew}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.startNew}</span>
          </button>

          <button
            id="btn-saved-letters"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            title={t.nav.savedDrafts}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.savedDrafts}</span>
            {savedCount > 0 && (
              <span className="text-[10px] bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-stone-800 hidden sm:block" />

          {/* Quick Copy & Export */}
          <button
            id="btn-copy-letter"
            onClick={handleCopy}
            className="p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t.letter.copy}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">{copied ? t.letter.copied : t.letter.copy}</span>
          </button>

          <button
            id="btn-print-letter"
            onClick={handlePrint}
            className="p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t.letter.print}
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">{t.letter.print}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

