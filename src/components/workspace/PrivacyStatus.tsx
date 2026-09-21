import React from 'react';
import { Lock, ShieldCheck, EyeOff } from 'lucide-react';
import { FactPrivacySetting, Language } from '../../types';

interface PrivacyStatusProps {
  privacy: FactPrivacySetting;
  language: Language;
  compact?: boolean;
}

export const PrivacyStatus: React.FC<PrivacyStatusProps> = ({
  privacy,
  language,
  compact = false,
}) => {
  if (privacy === 'private') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-system font-medium border bg-[#F3ECF8] text-[#73579A] border-[#D9CBE4] ${
          compact ? 'text-[11px] py-0.5 px-2' : ''
        }`}
        title={
          language === 'zh'
            ? '已受保护：作为背景事实记录，绝不写入辞职信'
            : 'Protected boundary: Recorded in case file but strictly excluded from formal letter'
        }
      >
        <Lock className="w-3 h-3 text-[#73579A]" />
        <span>{language === 'zh' ? '已保护（不写入信件）' : 'Protected (Excluded)'}</span>
      </div>
    );
  }

  if (privacy === 'background') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono-system border bg-[#F6F0E7] text-[#68616D] border-[#E2D8C9]`}
      >
        <EyeOff className="w-3 h-3 text-[#68616D]" />
        <span>{language === 'zh' ? '背景推导' : 'Context Only'}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono-system border bg-[#EBF7F1] text-[#3B8C68] border-[#BFE2D3]`}
    >
      <ShieldCheck className="w-3 h-3 text-[#3B8C68]" />
      <span>{language === 'zh' ? '正式可用' : 'Formal Ready'}</span>
    </div>
  );
};
