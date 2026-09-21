import React, { useState } from 'react';
import {
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ConfirmedFactItem, CaseFactStatus, FactPrivacySetting, Language } from '../../types';
import { PrivacyStatus } from './PrivacyStatus';
import { ConfirmationStamp } from './ConfirmationStamp';

interface CaseFileSlotProps {
  fact: ConfirmedFactItem;
  slotNumber: number;
  onUpdateFact: (fact: ConfirmedFactItem) => void;
  language: Language;
}

export const CaseFileSlot: React.FC<CaseFileSlotProps> = ({
  fact,
  slotNumber,
  onUpdateFact,
  language,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(fact.value);

  // Compute visual state: empty | discovered | needs_confirmation | confirmed | protected
  let visualState: 'empty' | 'discovered' | 'needs_confirmation' | 'confirmed' | 'protected' = 'empty';

  if (!fact.value || fact.value.trim() === '') {
    visualState = 'empty';
  } else if (fact.privacy === 'private' || fact.id === 'whatNotToSay') {
    visualState = 'protected';
  } else if (fact.status === 'confirmed') {
    visualState = 'confirmed';
  } else if (fact.status === 'needs_confirmation') {
    visualState = 'needs_confirmation';
  } else {
    visualState = 'discovered';
  }

  const slotLabels: Record<
    ConfirmedFactItem['id'],
    { title: string; titleEn: string; icon: string; promptDesc: string; promptDescEn: string }
  > = {
    whyResigning: {
      title: '离职主旨与规划',
      titleEn: 'Reason & Career Trajectory',
      icon: '🎯',
      promptDesc: '确立理性、追求发展的核心离职动因',
      promptDescEn: 'Clear, forward-looking primary resignation reason',
    },
    badExperiences: {
      title: '职场经历与事实',
      titleEn: 'Workplace Realities',
      icon: '📋',
      promptDesc: '记录负荷或沟通事实，公文化提炼为长远平衡诉求',
      promptDescEn: 'Objective workload/schedule realities refined constructively',
    },
    noticePeriodOrDate: {
      title: '最后工作日与交接',
      titleEn: 'Final Working Date & Notice',
      icon: '📅',
      promptDesc: '明确最后在岗日期与交接承诺，确保履约',
      promptDescEn: 'Definitive departure date and structured transition commitment',
    },
    whatNotToSay: {
      title: '私密安全界限',
      titleEn: 'Privacy Boundaries',
      icon: '🛡️',
      promptDesc: '健康隐私、私下矛盾、同事姓名严格设防',
      promptDescEn: 'Strictly excludes health, personal disputes, and coworker names',
    },
  };

  const currentMeta = slotLabels[fact.id];

  const handleSave = () => {
    onUpdateFact({
      ...fact,
      value: editValue.trim(),
      status: editValue.trim() ? 'confirmed' : 'missing',
    });
    setIsEditing(false);
  };

  const handleQuickConfirm = () => {
    onUpdateFact({
      ...fact,
      status: 'confirmed',
    });
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all relative ${
        visualState === 'protected'
          ? 'bg-[#F9F6FB] border-[#D9CBE4]'
          : visualState === 'confirmed'
          ? 'bg-[#EBF7F1]/50 border-[#BFE2D3]'
          : visualState === 'needs_confirmation'
          ? 'bg-[#FFF9EE] border-[#F2B35D]'
          : visualState === 'discovered'
          ? 'bg-[#FFFDFC] border-[#403A45]/30'
          : 'bg-[#F6F0E7]/40 border-dashed border-[#403A45]/20'
      }`}
    >
      {/* Slot header */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono-system text-[11px] font-bold px-2 py-0.5 rounded bg-[#F2EDF3] border border-[#403A45]/15 text-[#68616D]">
            SLOT-0{slotNumber}
          </span>
          <span className="text-sm font-semibold text-[#29252D] font-sans-clean">
            {language === 'zh' ? currentMeta.title : currentMeta.titleEn}
          </span>
        </div>

        <div>
          {visualState === 'protected' && (
            <ConfirmationStamp type="protected" language={language} animate={false} />
          )}
          {visualState === 'confirmed' && (
            <ConfirmationStamp type="confirmed" language={language} animate={true} />
          )}
          {visualState === 'needs_confirmation' && (
            <span className="font-mono-system text-[11px] px-2 py-0.5 rounded bg-[#FFF3D6] text-[#B36D14] border border-[#F2B35D] font-medium">
              {language === 'zh' ? '待确证' : 'Needs Confirmation'}
            </span>
          )}
          {visualState === 'discovered' && (
            <span className="font-mono-system text-[11px] px-2 py-0.5 rounded bg-[#B9DDE3]/30 text-[#215E6D] border border-[#B9DDE3] font-medium">
              {language === 'zh' ? '已探明' : 'Discovered'}
            </span>
          )}
          {visualState === 'empty' && (
            <span className="font-mono-system text-[11px] px-2 py-0.5 rounded bg-[#F2EDF3] text-[#68616D] border border-[#403A45]/15">
              {language === 'zh' ? '待采集' : 'Empty'}
            </span>
          )}
        </div>
      </div>

      {/* Subtitle / Prompt description */}
      <p className="text-[11px] text-[#68616D] mb-3">
        {language === 'zh' ? currentMeta.promptDesc : currentMeta.promptDescEn}
      </p>

      {/* Content area */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-[#403A45]/30 bg-white resize-none font-sans-clean"
            placeholder={
              language === 'zh'
                ? '输入或修改此案卷槽位的确证事实...'
                : 'Enter verified fact for this case slot...'
            }
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs text-[#68616D] hover:bg-[#F2EDF3] rounded"
            >
              {language === 'zh' ? '取消' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-[#F2B35D] text-[#29252D] font-semibold rounded hover:bg-[#e4a44d]"
            >
              {language === 'zh' ? '确认保存' : 'Save'}
            </button>
          </div>
        </div>
      ) : fact.value ? (
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-white/80 border border-[#403A45]/15 text-xs text-[#29252D] font-sans-clean leading-relaxed font-medium">
            {fact.value}
          </div>

          <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
            <PrivacyStatus privacy={fact.privacy} language={language} compact />

            <div className="flex items-center gap-2">
              {visualState !== 'confirmed' && visualState !== 'protected' && (
                <button
                  onClick={handleQuickConfirm}
                  className="px-2.5 py-1 text-xs font-mono-system font-medium rounded bg-[#BFE2D3] hover:bg-[#aee0cd] text-[#1B5E3F] border border-[#3B8C68]/40 flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>{language === 'zh' ? '直接确证' : 'Confirm'}</span>
                </button>
              )}
              <button
                onClick={() => {
                  setEditValue(fact.value);
                  setIsEditing(true);
                }}
                className="p-1 rounded text-[#68616D] hover:text-[#29252D] hover:bg-[#F2EDF3] cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">{language === 'zh' ? '调整' : 'Edit'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center border border-dashed border-[#403A45]/20 rounded-lg bg-white/40">
          <p className="text-xs text-[#68616D]">
            {language === 'zh'
              ? '可通过左侧对话或点击手动录入'
              : 'Discovered via intake dialogue or manual input'}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 px-3 py-1 text-xs font-mono-system text-[#B36D14] bg-[#FFF3D6] border border-[#F2B35D] rounded-md hover:bg-[#feeac2] cursor-pointer"
          >
            {language === 'zh' ? '+ 录入此要素' : '+ Record Slot'}
          </button>
        </div>
      )}
    </div>
  );
};
