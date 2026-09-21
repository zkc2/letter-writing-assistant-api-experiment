import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language } from '../../types';

interface ConfirmationStampProps {
  type: 'confirmed' | 'protected' | 'conflict' | 'unlocked';
  language: Language;
  label?: string;
  animate?: boolean;
}

export const ConfirmationStamp: React.FC<ConfirmationStampProps> = ({
  type,
  language,
  label,
  animate = true,
}) => {
  if (type === 'confirmed') {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#3B8C68] text-[#3B8C68] bg-[#BFE2D3]/20 font-mono-system text-[11px] font-bold tracking-wider select-none ${
          animate ? 'animate-in fade-in zoom-in-95 duration-200' : ''
        }`}
        style={{ transform: 'rotate(-2deg)' }}
      >
        <CheckCircle2 className="w-3 h-3 text-[#3B8C68]" />
        <span>{label || (language === 'zh' ? '已确证・VERIFIED' : 'VERIFIED')}</span>
      </div>
    );
  }

  if (type === 'protected') {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#73579A] text-[#73579A] bg-[#73579A]/10 font-mono-system text-[11px] font-bold tracking-wider select-none ${
          animate ? 'animate-in fade-in zoom-in-95 duration-200' : ''
        }`}
        style={{ transform: 'rotate(2deg)' }}
      >
        <span>{label || (language === 'zh' ? '安全保护・PROTECTED' : 'PROTECTED')}</span>
      </div>
    );
  }

  if (type === 'unlocked') {
    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded border-2 border-[#3B8C68] text-[#3B8C68] bg-[#EBF7F1] font-mono-system text-xs font-bold tracking-widest uppercase shadow-xs ${
          animate ? 'animate-in fade-in zoom-in-90 duration-300' : ''
        }`}
        style={{ transform: 'rotate(-1deg)' }}
      >
        <span>{label || (language === 'zh' ? '草稿已解锁・UNLOCKED' : 'DRAFT UNLOCKED')}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#A94343] text-[#A94343] bg-[#A94343]/10 font-mono-system text-[11px] font-bold tracking-wider select-none ${
        animate ? 'animate-in fade-in duration-200' : ''
      }`}
    >
      <ShieldAlert className="w-3 h-3 text-[#A94343]" />
      <span>{label || (language === 'zh' ? '待排查・CONFLICT' : 'CONFLICT')}</span>
    </div>
  );
};
