import React from 'react';
import { Lock, Unlock, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { CaseDesktopStatus, Language } from '../../types';

interface DraftUnlockStateProps {
  status: CaseDesktopStatus;
  confirmedCount: number;
  totalRequired?: number;
  language: Language;
  onProceedToDraft?: () => void;
  compact?: boolean;
}

export const DraftUnlockState: React.FC<DraftUnlockStateProps> = ({
  status,
  confirmedCount,
  totalRequired = 4,
  language,
  onProceedToDraft,
  compact = false,
}) => {
  const isComplete = confirmedCount >= totalRequired;

  const statusConfigs = {
    locked: {
      label: language === 'zh' ? '草稿锁定中' : 'Draft Locked',
      badgeClass: 'bg-[#F2EDF3] text-[#68616D] border-[#403A45]/30',
      icon: Lock,
      desc:
        language === 'zh'
          ? `需确证 4 项关键要素 (${confirmedCount}/${totalRequired}) 即可解锁草稿`
          : `Requires 4 confirmed pillars (${confirmedCount}/${totalRequired}) to unlock formal draft`,
    },
    needs_confirmation: {
      label: language === 'zh' ? '需确认事实' : 'Needs Confirmation',
      badgeClass: 'bg-[#FFF3D6] text-[#B36D14] border-[#F2B35D]',
      icon: AlertCircle,
      desc:
        language === 'zh'
          ? `已发现关键信息，请逐项核准 (${confirmedCount}/${totalRequired})`
          : `Information discovered, waiting for review (${confirmedCount}/${totalRequired})`,
    },
    ready_to_draft: {
      label: language === 'zh' ? '可生成草稿' : 'Ready to Draft',
      badgeClass: 'bg-[#EBF7F1] text-[#3B8C68] border-[#3B8C68]',
      icon: Unlock,
      desc:
        language === 'zh'
          ? '4 项关键案卷要素已就绪，辞职信草稿已解锁'
          : 'All 4 case slots verified! Formal resignation letter unlocked.',
    },
    approved: {
      label: language === 'zh' ? '终稿已确认' : 'Approved',
      badgeClass: 'bg-[#EBF7F1] text-[#3B8C68] border-[#3B8C68]',
      icon: ShieldCheck,
      desc:
        language === 'zh'
          ? '文书已通过终审核准，随时可打印与投递'
          : 'Document approved with full professional standing.',
    },
  };

  const current = statusConfigs[status];
  const IconComponent = current.icon;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-system font-semibold border ${current.badgeClass}`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        <span>{current.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        isComplete
          ? 'bg-[#EBF7F1]/60 border-[#BFE2D3]'
          : 'bg-[#FFFDFC] border-[#403A45]/20 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isComplete
                ? 'bg-[#BFE2D3] text-[#3B8C68] border-[#3B8C68]/40'
                : 'bg-[#DCD4EA]/40 text-[#403A45] border-[#403A45]/20'
            }`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-[#29252D]">
                {current.label}
              </span>
              <span className="text-[11px] font-mono-system px-2 py-0.5 rounded-full bg-[#F6F0E7] text-[#68616D] border border-[#E2D8C9]">
                {confirmedCount} / {totalRequired}
              </span>
            </div>
            <p className="text-[11px] text-[#68616D] mt-0.5">{current.desc}</p>
          </div>
        </div>

        {isComplete && onProceedToDraft && (
          <button
            onClick={onProceedToDraft}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F2B35D] hover:bg-[#e2a249] text-[#29252D] border border-[#403A45]/30 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span>{language === 'zh' ? '查看辞职信草稿' : 'Open Draft Letter'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
