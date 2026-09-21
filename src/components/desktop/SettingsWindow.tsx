import React from 'react';
import { Sliders, Type, Palette, ShieldCheck, Sparkles, UserCheck, Languages } from 'lucide-react';
import {
  LetterContent,
  StationeryStyle,
  LetterFont,
  LetterFontSize,
  LetterLanguageOption,
  Language,
} from '../../types';

interface SettingsWindowProps {
  currentLetter: LetterContent;
  onUpdateStationery: (style: StationeryStyle) => void;
  onUpdateFont: (font: LetterFont) => void;
  onUpdateFontSize: (size: LetterFontSize) => void;
  onUpdateRecipient: (key: string, value: string) => void;
  onUpdateSender: (key: string, value: string) => void;
  onTriggerAudit: () => void;
  isApproved?: boolean;
  language: Language;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  currentLetter,
  onUpdateStationery,
  onUpdateFont,
  onUpdateFontSize,
  onUpdateRecipient,
  onUpdateSender,
  onTriggerAudit,
  isApproved,
  language,
}) => {
  const stationeryOptions: { id: StationeryStyle; label: string; labelEn: string; desc: string }[] = [
    { id: 'executive', label: '行政公文 (Executive)', labelEn: 'Executive', desc: '金墨沉着，边线规整' },
    { id: 'modern', label: '极简无衬线 (Modern)', labelEn: 'Modern', desc: '现代清爽，清晰明朗' },
    { id: 'classic', label: '经典信笺 (Classic)', labelEn: 'Classic', desc: '传统正式辞职信格式' },
    { id: 'parchment', label: '羊皮纸质感 (Parchment)', labelEn: 'Parchment', desc: '温润复古纸质' },
    { id: 'minimal', label: '纯净便笺 (Minimal)', labelEn: 'Minimal', desc: '无框线纯文本' },
  ];

  const fontOptions: { id: LetterFont; label: string; fontClass: string }[] = [
    { id: 'serif-reading', label: 'Newsreader / 悦读衬线', fontClass: 'font-serif-reading' },
    { id: 'serif-classic', label: 'Lora / 经典公文衬线', fontClass: 'font-serif-classic' },
    { id: 'display-serif', label: 'Cinzel / 典雅衬线', fontClass: 'font-display-serif' },
    { id: 'sans-clean', label: 'Plus Jakarta / 现代非衬线', fontClass: 'font-sans-clean' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto font-sans-clean text-xs">
      {/* Stationery Styles */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#B36D14]" />
          <h3 className="font-bold text-sm text-[#29252D]">
            {language === 'zh' ? '信笺风格 (Stationery Preset)' : 'Stationery Preset'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {stationeryOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onUpdateStationery(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                currentLetter.stationery === opt.id
                  ? 'bg-[#EBF7F1] border-[#3B8C68] shadow-xs'
                  : 'bg-white border-[#403A45]/20 hover:border-[#403A45]/40'
              }`}
            >
              <div className="font-semibold text-[#29252D] mb-0.5">
                {language === 'zh' ? opt.label : opt.labelEn}
              </div>
              <div className="text-[11px] text-[#68616D]">{opt.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[#73579A]" />
          <h3 className="font-bold text-sm text-[#29252D]">
            {language === 'zh' ? '字体与字号 (Letter Typography)' : 'Letter Typography'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              onClick={() => onUpdateFont(font.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${font.fontClass} ${
                currentLetter.fontFamily === font.id
                  ? 'bg-[#F3ECF8] border-[#73579A] shadow-xs'
                  : 'bg-white border-[#403A45]/20 hover:border-[#403A45]/40'
              }`}
            >
              <div className="font-semibold text-sm text-[#29252D]">{font.label}</div>
              <div className="text-[11px] text-[#68616D] mt-1">
                Formal Resignation Letter Sample ABC
              </div>
            </button>
          ))}
        </div>

        {/* Font size pills */}
        <div className="flex items-center gap-2 pt-2">
          <span className="font-mono-system text-[11px] text-[#68616D]">
            {language === 'zh' ? '正文字号：' : 'Font Size:'}
          </span>
          {(['sm', 'base', 'lg'] as LetterFontSize[]).map((size) => (
            <button
              key={size}
              onClick={() => onUpdateFontSize(size)}
              className={`px-3 py-1 rounded-lg border font-mono-system text-xs uppercase cursor-pointer ${
                currentLetter.fontSize === size
                  ? 'bg-[#F2B35D] text-[#29252D] font-bold border-[#403A45]'
                  : 'bg-white text-[#68616D] border-[#403A45]/20 hover:bg-[#F2EDF3]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      {/* Recipient & Sender Quick Edit */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#215E6D]" />
          <h3 className="font-bold text-sm text-[#29252D]">
            {language === 'zh' ? '辞职信收信人与寄信人 (Addresses)' : 'Parties & Addresses'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F6F0E7]/40 p-4 rounded-xl border border-[#403A45]/15">
          <div>
            <label className="block text-[11px] font-mono-system text-[#68616D] mb-1">
              {language === 'zh' ? '主管 / 收信人姓名' : 'Supervisor / Recipient Name'}
            </label>
            <input
              type="text"
              value={currentLetter.recipient.name}
              onChange={(e) => onUpdateRecipient('name', e.target.value)}
              className="w-full p-2 rounded-lg border border-[#403A45]/20 bg-white text-xs"
              placeholder={language === 'zh' ? '例如：张主管 / Sarah Jenkins' : 'e.g., Sarah Jenkins'}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono-system text-[#68616D] mb-1">
              {language === 'zh' ? '主管职衔与部门' : 'Supervisor Title / Dept'}
            </label>
            <input
              type="text"
              value={currentLetter.recipient.title}
              onChange={(e) => onUpdateRecipient('title', e.target.value)}
              className="w-full p-2 rounded-lg border border-[#403A45]/20 bg-white text-xs"
              placeholder={language === 'zh' ? '例如：技术总监 / VP of Engineering' : 'e.g., VP of Engineering'}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono-system text-[#68616D] mb-1">
              {language === 'zh' ? '公司 / 机构全称' : 'Company / Organization'}
            </label>
            <input
              type="text"
              value={currentLetter.recipient.organization}
              onChange={(e) => onUpdateRecipient('organization', e.target.value)}
              className="w-full p-2 rounded-lg border border-[#403A45]/20 bg-white text-xs"
              placeholder={language === 'zh' ? '例如：某科技有限公司' : 'e.g., Acme Corporation'}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono-system text-[#68616D] mb-1">
              {language === 'zh' ? '本人落款姓名' : 'Your Signoff Name'}
            </label>
            <input
              type="text"
              value={currentLetter.signoffName || currentLetter.sender.name}
              onChange={(e) => onUpdateSender('name', e.target.value)}
              className="w-full p-2 rounded-lg border border-[#403A45]/20 bg-white text-xs"
              placeholder={language === 'zh' ? '例如：李明 / Alex Morgan' : 'e.g., Alex Morgan'}
            />
          </div>
        </div>
      </section>

      {/* Etiquette Polish & Audit */}
      <section className="p-4 rounded-xl border border-[#BFE2D3] bg-[#EBF7F1]/60 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-bold text-sm text-[#1B5E3F] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#3B8C68]" />
            <span>{language === 'zh' ? '职场礼仪与安全边界审计' : 'Etiquette & Boundary Audit'}</span>
          </div>
          <p className="text-[11px] text-[#68616D] mt-0.5">
            {language === 'zh'
              ? '运行深度审查，确保辞职信无过激辞令、无泄露隐私，展现最高职场水准。'
              : 'Audit the letter against constructive career etiquette and strict privacy perimeter.'}
          </p>
        </div>
        <button
          onClick={onTriggerAudit}
          className="px-4 py-2 rounded-xl bg-[#3B8C68] hover:bg-[#2e7455] text-white font-mono-system font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          {language === 'zh' ? '立即审计文稿' : 'Run Audit'}
        </button>
      </section>
    </div>
  );
};
