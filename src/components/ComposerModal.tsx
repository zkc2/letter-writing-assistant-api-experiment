import React, { useState } from 'react';
import { X, ShieldCheck, HeartHandshake, Lock, Info, Globe } from 'lucide-react';
import { GhostwriterInputs, Language, LetterLanguageOption } from '../types';
import { getTranslation } from '../i18n';

interface ComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInputs: (inputs: GhostwriterInputs, detailsMessage: string) => void;
  initialSender?: {
    name?: string;
    title?: string;
  };
  language: Language;
  letterLanguage: LetterLanguageOption;
  onLetterLanguageChange?: (option: LetterLanguageOption) => void;
}

export const ComposerModal: React.FC<ComposerModalProps> = ({
  isOpen,
  onClose,
  onSubmitInputs,
  initialSender,
  language,
  letterLanguage: initialLetterLang,
  onLetterLanguageChange,
}) => {
  const t = getTranslation(language);
  const [whyResigning, setWhyResigning] = useState(t.composer.reasons[0]);
  const [badExperiences, setBadExperiences] = useState('');
  const [tone, setTone] = useState(t.composer.tones[0].id);
  const [noticePeriod, setNoticePeriod] = useState('');
  const [whatNotToSay, setWhatNotToSay] = useState('');
  const [letterLang, setLetterLang] = useState<LetterLanguageOption>(initialLetterLang || 'follow');
  
  // Details
  const [senderName, setSenderName] = useState(initialSender?.name || '');
  const [senderTitle, setSenderTitle] = useState(initialSender?.title || '');
  const [supervisorName, setSupervisorName] = useState('');
  const [companyName, setCompanyName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveReason = whyResigning === t.composer.reasons[0] ? '' : whyResigning;
    const inputs: GhostwriterInputs = {
      whyResigning: effectiveReason,
      badExperiences: badExperiences.trim(),
      whatToSay: noticePeriod.trim() ? `${language === 'zh' ? '正式提出辞职申请，预计最后工作日为：' : 'Formal notice of resignation with final working date: '}${noticePeriod.trim()}` : '',
      whatNotToSay: whatNotToSay.trim(),
      noticePeriodOrDate: noticePeriod.trim(),
      supervisorName: supervisorName.trim(),
      senderName: senderName.trim(),
      senderTitle: senderTitle.trim(),
      letterLanguage: letterLang,
    };

    if (onLetterLanguageChange) {
      onLetterLanguageChange(letterLang);
    }

    const langLabel = letterLang === 'zh' ? 'Simplified Chinese (简体中文)' : letterLang === 'en' ? 'English' : 'Follow interface language (跟随界面语言)';

    const lines = [
      effectiveReason ? `${t.composer.coreReasonLine} ${effectiveReason}` : '',
      badExperiences.trim() ? `${t.composer.experiencesLine} ${badExperiences.trim()}` : '',
      noticePeriod.trim() ? `${t.composer.finalDateLine} ${noticePeriod.trim()}` : '',
      whatNotToSay.trim() ? `${t.composer.guardrailsLine} ${whatNotToSay.trim()}` : '',
      tone ? `${t.composer.toneLine} ${tone}` : '',
      `${t.composer.letterLangLine} ${langLabel}`,
      senderName.trim() ? `${t.composer.myNameLine} ${senderName.trim()}` : '',
      supervisorName.trim() ? `${t.composer.supervisorLine} ${supervisorName.trim()}` : '',
      companyName.trim() ? `${t.composer.companyLine} ${companyName.trim()}` : '',
    ].filter(Boolean);

    const message = lines.length > 0
      ? `${t.composer.initialCaseIntro}\n${lines.join('\n')}`
      : (language === 'zh' ? '我需要协助撰写正式辞职信。' : 'I would like assistance with my resignation letter.');

    onSubmitInputs(inputs, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-sans-clean">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-stone-950 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{t.composer.title}</h3>
              <p className="text-xs text-stone-400">{t.composer.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Reason selection */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              {t.composer.reasonLabel}
            </label>
            <select
              value={whyResigning}
              onChange={(e) => setWhyResigning(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {t.composer.reasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Bad Experiences / Challenges */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              {t.composer.experiencesLabel}
            </label>
            <textarea
              value={badExperiences}
              onChange={(e) => setBadExperiences(e.target.value)}
              rows={3}
              placeholder={t.composer.experiencesPlaceholder}
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Letter Language Setting */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-700" />
                <span>{t.composer.letterLangLabel}</span>
              </label>
              <span className="text-[10px] text-stone-500">{t.composer.letterLangHelp}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {t.composer.letterLangOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setLetterLang(opt.id)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    letterLang === opt.id
                      ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-semibold shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="text-[11px] font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-stone-500 font-normal leading-tight mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">{t.composer.toneLabel}</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {t.composer.tones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t.composer.dateLabel}
              </label>
              <input
                type="text"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                placeholder={t.composer.datePlaceholder}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                {t.composer.dateHelp}
              </p>
            </div>
          </div>

          {/* Privacy Guardrails (What NOT to say) */}
          <div>
            <label className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.composer.guardrailsLabel}</span>
            </label>
            <input
              type="text"
              value={whatNotToSay}
              onChange={(e) => setWhatNotToSay(e.target.value)}
              placeholder={t.composer.guardrailsPlaceholder}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Names and Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
            <div>
              <label className="font-medium text-stone-700 block mb-0.5">{t.composer.senderSectionLabel}</label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={t.composer.senderNamePlaceholder}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
                <input
                  type="text"
                  value={senderTitle}
                  onChange={(e) => setSenderTitle(e.target.value)}
                  placeholder={t.composer.senderTitlePlaceholder}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-0.5">{t.composer.recipientSectionLabel}</label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder={t.composer.supervisorNamePlaceholder}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t.composer.companyNamePlaceholder}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Data Transmission Notice */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>{t.composer.dataNoticeTitle}</strong> {t.composer.dataNoticeText}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              {t.composer.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.composer.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

