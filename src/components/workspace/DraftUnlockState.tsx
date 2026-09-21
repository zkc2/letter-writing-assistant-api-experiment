import React from 'react';
import { Lock, Unlock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { CaseDesktopStatus, Language } from '../../types';
import { BureauSealIcon } from '../desktop/BureauIcons';

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
      label: language === 'zh' ? '公文纸静候' : 'Draft Locked',
      badgeClass: 'bg-[#262433] text-[#b8a9c9] border-[#6f6587]/30',
      icon: Lock,
      desc:
        language === 'zh'
          ? `需确证 4 柱关键案卷 (${confirmedCount}/${totalRequired})，以铺开正式辞呈公文纸`
          : `Requires 4 confirmed pillars (${confirmedCount}/${totalRequired}) to seal formal letter`,
    },
    needs_confirmation: {
      label: language === 'zh' ? '察觉关键线索' : 'Review Pillars',
      badgeClass: 'bg-[#2a2539] text-[#e6a54f] border-[#e6a54f]/50',
      icon: AlertCircle,
      desc:
        language === 'zh'
          ? `已提取事实碎片，请逐项裁定入卷 (${confirmedCount}/${totalRequired})`
          : `Memories extracted, awaiting dossier approval (${confirmedCount}/${totalRequired})`,
    },
    ready_to_draft: {
      label: language === 'zh' ? '四柱已成・公文已就' : 'Paper Ready',
      badgeClass: 'bg-[#23352b] text-[#85d0ad] border-[#4e8b72]/60',
      icon: Unlock,
      desc:
        language === 'zh'
          ? '四柱案卷全部封存！粗粝记忆已熔铸为体面措辞，随时可审阅定稿'
          : 'All 4 dossier slots verified! Formal resignation letter unlocked.',
    },
    approved: {
      label: language === 'zh' ? '终章・火漆封印' : 'Amber Sealed',
      badgeClass: 'bg-[#262433] text-[#e6a54f] border-[#e6a54f]/70',
      icon: ShieldCheck,
      desc:
        language === 'zh'
          ? '公文兼具尊严与法律防线，琥珀印章已盖，可安心启程'
          : 'Document approved with dignity and safety. Amber seal stamped.',
    },
  };

  const current = statusConfigs[status];
  const IconComponent = current.icon;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-system font-semibold border ${current.badgeClass}`}
      >
        {status === 'approved' ? (
          <span className="text-[#e6a54f]">
            <BureauSealIcon size={13} />
          </span>
        ) : (
          <IconComponent className="w-3.5 h-3.5" />
        )}
        <span>{current.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        isComplete
          ? 'bg-[#E7F3ED]/70 border-[#4E8B72]/40'
          : 'bg-[#FCFAF6] border-[#6F6587]/20 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isComplete
                ? 'bg-[#B2D8C6] text-[#262433] border-[#4E8B72]/50'
                : 'bg-[#D8CCE4]/40 text-[#262433] border-[#6F6587]/30'
            }`}
          >
            {status === 'approved' ? (
              <BureauSealIcon size={18} />
            ) : (
              <IconComponent className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-[#262433]">
                {current.label}
              </span>
              <span className="text-[11px] font-mono-system px-2 py-0.5 rounded-full bg-[#F2ECE1] text-[#655E75] border border-[#6F6587]/20">
                {confirmedCount} / {totalRequired}
              </span>
            </div>
            <p className="text-[11px] text-[#655E75] mt-0.5">{current.desc}</p>
          </div>
        </div>

        {isComplete && onProceedToDraft && (
          <button
            onClick={onProceedToDraft}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4E8B72] hover:bg-[#3d6f5b] text-[#FCFAF6] text-xs font-mono-system font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>{language === 'zh' ? '铺开公文纸审阅' : 'View Draft Letter'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
