import React from 'react';
import { Lock, Check, Clock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { GhostwriterInputs, Language, WorkspaceSection } from '../../types';
import { BureauSealIcon } from '../desktop/BureauIcons';

interface CompactLockedDraftStateProps {
  knownInputs: GhostwriterInputs;
  onNavigateToRequirement: (section: WorkspaceSection, targetField?: keyof GhostwriterInputs) => void;
  language: Language;
}

export const CompactLockedDraftState: React.FC<CompactLockedDraftStateProps> = ({
  knownInputs,
  onNavigateToRequirement,
  language,
}) => {
  const requirements: {
    key: keyof GhostwriterInputs;
    labelEn: string;
    labelZh: string;
    isFilled: boolean;
  }[] = [
    {
      key: 'whyResigning',
      labelEn: '1. Reason for Resigning',
      labelZh: '1. 离职原因',
      isFilled: Boolean(knownInputs.whyResigning && knownInputs.whyResigning.trim()),
    },
    {
      key: 'badExperiences',
      labelEn: '2. Workplace Context',
      labelZh: '2. 职场背景',
      isFilled: Boolean(knownInputs.badExperiences && knownInputs.badExperiences.trim()),
    },
    {
      key: 'noticePeriodOrDate',
      labelEn: '3. Final Working Date and Handover',
      labelZh: '3. 最后在岗日与交接',
      isFilled: Boolean(
        (knownInputs.noticePeriodOrDate && knownInputs.noticePeriodOrDate.trim()) ||
        (knownInputs.whatToSay && knownInputs.whatToSay.trim())
      ),
    },
    {
      key: 'whatNotToSay',
      labelEn: '4. Privacy Boundaries',
      labelZh: '4. 隐私边界',
      isFilled: Boolean(knownInputs.whatNotToSay && knownInputs.whatNotToSay.trim()),
    },
  ];

  const completedCount = requirements.filter((r) => r.isFilled).length;
  const firstMissing = requirements.find((r) => !r.isFilled);

  const missingName = firstMissing
    ? language === 'zh'
      ? firstMissing.labelZh.replace(/^\d+\.\s*/, '')
      : firstMissing.labelEn.replace(/^\d+\.\s*/, '')
    : '';

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 flex flex-col items-center justify-center text-center font-sans-clean my-auto animate-in fade-in duration-200">
      {/* Illustrated Icon / Seal Badge */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-2xl bg-[#262433] border-2 border-[#e6a54f]/60 flex items-center justify-center shadow-xl text-[#e6a54f]">
          <Lock className="w-9 h-9" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#e6a54f] text-[#1e1b29] flex items-center justify-center font-mono-system font-bold text-xs shadow-md">
          {completedCount}/4
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-serif-classic font-bold text-[#262433] tracking-wide mb-1.5">
        {language === 'zh' ? '公文纸静候・Draft Locked' : 'Draft Locked'}
      </h2>

      {/* Completion Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ece1] border border-[#6f6587]/30 text-xs font-mono-system font-bold text-[#655e75] mb-4">
        <span>{language === 'zh' ? `案卷要素：${completedCount} / 4 已探明` : `Case Dossier: ${completedCount} / 4 Captured`}</span>
      </div>

      {/* One-sentence explanation */}
      <p className="text-xs sm:text-sm text-[#655e75] leading-relaxed max-w-md mb-6">
        {language === 'zh'
          ? '需在摄入对话或案卷中补全全部 4 项核心要素，正式辞呈公文纸方可舒展铺开。'
          : 'Complete all 4 case requirements in Intake or Case Dossier before the formal letter paper unfolds.'}
      </p>

      {/* Four Requirement Indicators */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-left">
        {requirements.map((req, idx) => (
          <div
            key={req.key}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
              req.isFilled
                ? 'bg-[#ebf7f1] border-[#bfe2d3] text-[#29252d]'
                : 'bg-white/80 border-[#6f6587]/20 text-[#655e75]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  req.isFilled
                    ? 'bg-[#3b8c68] text-white'
                    : 'bg-[#6f6587]/20 text-[#655e75]'
                }`}
              >
                {req.isFilled ? <Check className="w-3 h-3" /> : idx + 1}
              </span>
              <span className="font-medium">
                {language === 'zh' ? req.labelZh : req.labelEn}
              </span>
            </div>

            <span className="text-[10px] font-mono-system font-semibold px-1.5 py-0.5 rounded">
              {req.isFilled
                ? language === 'zh' ? '已确证' : 'Ready'
                : language === 'zh' ? '待补全' : 'Missing'}
            </span>
          </div>
        ))}
      </div>

      {/* Button Linking to the first missing requirement */}
      {firstMissing && (
        <button
          type="button"
          onClick={() => onNavigateToRequirement('intake', firstMissing.key)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#262433] hover:bg-[#353043] text-[#fbf8f4] text-xs sm:text-sm font-mono-system font-bold transition-all shadow-md hover:shadow-lg cursor-pointer group"
        >
          <span>
            {language === 'zh'
              ? `前往补全：${missingName}`
              : `Go to ${missingName}`}
          </span>
          <ArrowRight className="w-4 h-4 text-[#e6a54f] group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
