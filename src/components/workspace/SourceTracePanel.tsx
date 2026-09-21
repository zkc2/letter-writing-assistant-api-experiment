import React from 'react';
import { Sparkles, ShieldCheck, Lock, Link2, CheckCircle2 } from 'lucide-react';
import { SourceTraceMapping, Language } from '../../types';

interface SourceTracePanelProps {
  mapping: SourceTraceMapping | null;
  language: Language;
  onJumpToFact?: (factId: string) => void;
}

export const SourceTracePanel: React.FC<SourceTracePanelProps> = ({
  mapping,
  language,
  onJumpToFact,
}) => {
  if (!mapping) {
    return (
      <div className="p-4 rounded-xl border border-[#403A45]/20 bg-[#F6F0E7]/40 text-center">
        <p className="text-xs text-[#68616D] font-mono-system">
          {language === 'zh'
            ? '💡 点击信件任意段落，实时回溯其确证案卷事实与公文化依据'
            : '💡 Click any paragraph in the letter to trace its verified facts and rationale'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-[#B9DDE3] bg-[#F2F8F9] space-y-3 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-2 border-b border-[#B9DDE3]/60 pb-2">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#215E6D]" />
          <span className="font-mono-system text-xs font-bold text-[#215E6D]">
            {language === 'zh'
              ? `案卷事实回溯・第 ${mapping.paragraphIndex + 1} 段`
              : `Source Trace: Paragraph ${mapping.paragraphIndex + 1}`}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono-system font-semibold bg-[#BFE2D3] text-[#1B5E3F] border border-[#3B8C68]/40">
          {language === 'zh' ? '依据已确证' : 'Source Verified'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-[10px] font-mono-system text-[#68616D] uppercase tracking-wider block">
            {language === 'zh' ? '案卷要素归属' : 'Case Pillar'}
          </span>
          <p className="font-semibold text-[#29252D] mt-0.5">{mapping.factLabel}</p>
        </div>

        <div>
          <span className="text-[10px] font-mono-system text-[#68616D] uppercase tracking-wider block">
            {language === 'zh' ? '用户原始事实 / 经历' : 'Original Fact'}
          </span>
          <p className="italic text-[#68616D] bg-white/70 p-2 rounded border border-[#403A45]/15 mt-0.5">
            "{mapping.sourceText}"
          </p>
        </div>

        <div>
          <span className="text-[10px] font-mono-system text-[#3B8C68] uppercase tracking-wider block font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#3B8C68]" />
            {language === 'zh' ? '公文化提炼与法律体面考量' : 'Refinement & Standing Rationale'}
          </span>
          <p className="text-[#29252D] font-medium bg-[#EBF7F1] p-2.5 rounded border border-[#BFE2D3] mt-0.5 leading-relaxed">
            {mapping.reason}
          </p>
        </div>
      </div>
    </div>
  );
};
