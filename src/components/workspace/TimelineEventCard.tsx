import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { TimelineEvent, EventCategory, Language } from '../../types';
import { PrivacyStatus } from './PrivacyStatus';
import { ConfirmationStamp } from './ConfirmationStamp';

interface TimelineEventCardProps {
  event: TimelineEvent;
  index: number;
  totalEvents: number;
  onUpdate: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
  onMove?: (index: number, direction: 'up' | 'down') => void;
  language: Language;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  event,
  index,
  totalEvents,
  onUpdate,
  onDelete,
  onMove,
  language,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(event.summary);
  const [editDate, setEditDate] = useState(event.date);

  const categoryBadges: Record<
    EventCategory,
    { label: string; labelEn: string; color: string }
  > = {
    workload: { label: '工时负荷', labelEn: 'Workload', color: 'bg-[#B9DDE3]/40 text-[#215E6D] border-[#B9DDE3]' },
    communication: { label: '沟通分歧', labelEn: 'Communication', color: 'bg-[#E8B8C9]/40 text-[#7A3651] border-[#E8B8C9]' },
    experience: { label: '团队经历', labelEn: 'Experience', color: 'bg-[#DCD4EA]/40 text-[#4E396E] border-[#DCD4EA]' },
    career: { label: '职业方向', labelEn: 'Career Goal', color: 'bg-[#BFE2D3]/40 text-[#255C44] border-[#BFE2D3]' },
    decision: { label: '离职决策', labelEn: 'Decision', color: 'bg-[#F2B35D]/30 text-[#824E0F] border-[#F2B35D]' },
    notice: { label: '交接通知', labelEn: 'Handover & Notice', color: 'bg-[#BFE2D3]/50 text-[#1B5E3F] border-[#3B8C68]' },
    private: { label: '私密界限', labelEn: 'Private Boundary', color: 'bg-[#73579A]/20 text-[#73579A] border-[#73579A]' },
  };

  const currentCategory = categoryBadges[event.category] || categoryBadges.experience;

  const handleTogglePrivacy = () => {
    const nextPrivacy = event.privacy === 'private' ? 'include' : 'private';
    onUpdate({ ...event, privacy: nextPrivacy });
  };

  const handleToggleStatus = () => {
    const nextStatus =
      event.status === 'confirmed' ? 'needs_confirmation' : 'confirmed';
    onUpdate({ ...event, status: nextStatus });
  };

  const handleSaveEdit = () => {
    onUpdate({
      ...event,
      summary: editSummary.trim() || event.summary,
      date: editDate.trim() || (language === 'zh' ? '未指定具体日期' : 'Date not provided'),
    });
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      {/* Investigation Post Card */}
      <div
        className={`rounded-xl border transition-all ${
          event.privacy === 'private'
            ? 'bg-[#F9F6FB] border-[#D9CBE4]'
            : 'bg-[#FFFDFC] border-[#403A45]/20 hover:border-[#403A45]/40 shadow-xs'
        }`}
      >
        {/* Card Header: Author / Category & Status */}
        <div className="px-4 py-3 border-b border-[#403A45]/10 flex items-center justify-between gap-2 flex-wrap bg-[#F6F0E7]/40 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono-system text-[11px] font-bold text-[#68616D] px-2 py-0.5 rounded bg-[#F2EDF3] border border-[#403A45]/15">
              EVT-#{index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono-system border ${currentCategory.color}`}
            >
              {language === 'zh' ? currentCategory.label : currentCategory.labelEn}
            </span>
            {event.hasConflict && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-system bg-[#A94343]/10 text-[#A94343] border border-[#A94343] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {language === 'zh' ? '检测到冲突' : 'Conflict'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <PrivacyStatus privacy={event.privacy} language={language} compact />
            {event.status === 'confirmed' && (
              <ConfirmationStamp type="confirmed" language={language} animate={false} />
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Date & Timeline Anchor */}
          <div className="flex items-center justify-between text-xs text-[#68616D]">
            <div className="flex items-center gap-1.5 font-mono-system">
              <Calendar className="w-3.5 h-3.5 text-[#B36D14]" />
              <span className="font-medium">
                {event.date || (language === 'zh' ? '未指定具体日期' : 'Date not provided')}
              </span>
            </div>
            {onMove && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  disabled={index === 0}
                  onClick={() => onMove(index, 'up')}
                  className="p-1 rounded hover:bg-[#F2EDF3] disabled:opacity-30 text-[#68616D] cursor-pointer"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === totalEvents - 1}
                  onClick={() => onMove(index, 'down')}
                  className="p-1 rounded hover:bg-[#F2EDF3] disabled:opacity-30 text-[#68616D] cursor-pointer"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Event Content / Editable Area */}
          {isEditing ? (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                placeholder={language === 'zh' ? '发生时间/阶段' : 'Date or timeframe'}
                className="w-full text-xs font-mono-system p-2 rounded border border-[#403A45]/30 bg-white"
              />
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded border border-[#403A45]/30 bg-white resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs text-[#68616D] hover:bg-[#F2EDF3] rounded"
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs bg-[#F2B35D] text-[#29252D] font-semibold rounded hover:bg-[#e4a44d]"
                >
                  {language === 'zh' ? '保存' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#29252D] leading-relaxed font-sans-clean font-medium">
              {event.summary}
            </p>
          )}

          {/* Expanded Analysis View: Original vs Professional Transform */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#403A45]/10 space-y-2.5 bg-[#F6F0E7]/30 p-3 rounded-lg text-xs">
              <div>
                <span className="font-mono-system text-[10px] text-[#68616D] uppercase tracking-wider block mb-1">
                  {language === 'zh' ? '原始经历 / 用户原声' : 'Original Experience'}
                </span>
                <p className="text-[#68616D] italic pl-2 border-l-2 border-[#DCD4EA]">
                  "{event.summary}"
                </p>
              </div>

              <div>
                <span className="font-mono-system text-[10px] text-[#3B8C68] uppercase tracking-wider block mb-1 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-[#3B8C68]" />
                  {language === 'zh' ? '公文化提炼 / 职场进取表述' : 'Professional Wording in Draft'}
                </span>
                <p className="text-[#29252D] font-medium pl-2 border-l-2 border-[#3B8C68]">
                  {event.privacy === 'private'
                    ? language === 'zh'
                      ? '已列入私密保护，绝不透露给雇主或写入信件。'
                      : 'Protected boundary: strictly omitted from draft.'
                    : event.category === 'notice'
                    ? language === 'zh'
                      ? `最后工作日定于 ${event.date}，将全力协助工作交接与结构化文档梳理。`
                      : `Final working day established as ${event.date}, with full commitment to structured handover.`
                    : language === 'zh'
                    ? '出于个人长期职业规划与工作节奏平衡，探索更能发挥专长的新机遇。'
                    : 'Pursuing new opportunities more aligned with long-term professional development.'}
                </p>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-2 border-t border-[#403A45]/10 flex items-center justify-between text-xs text-[#68616D] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleStatus}
                className={`px-2.5 py-1 rounded text-xs font-mono-system font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                  event.status === 'confirmed'
                    ? 'bg-[#BFE2D3]/40 border-[#3B8C68] text-[#255C44]'
                    : 'bg-white border-[#403A45]/20 text-[#68616D] hover:border-[#403A45]'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {event.status === 'confirmed'
                    ? language === 'zh'
                      ? '已确证'
                      : 'Confirmed'
                    : language === 'zh'
                    ? '确认'
                    : 'Confirm'}
                </span>
              </button>

              <button
                onClick={handleTogglePrivacy}
                className={`px-2.5 py-1 rounded text-xs font-mono-system font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                  event.privacy === 'private'
                    ? 'bg-[#F3ECF8] border-[#73579A] text-[#73579A]'
                    : 'bg-white border-[#403A45]/20 text-[#68616D] hover:border-[#403A45]'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>
                  {event.privacy === 'private'
                    ? language === 'zh'
                      ? '已保护'
                      : 'Protected'
                    : language === 'zh'
                    ? '设为保护'
                    : 'Protect'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-[#68616D] hover:text-[#29252D] flex items-center gap-1 cursor-pointer"
              >
                <span>{isExpanded ? (language === 'zh' ? '收起详情' : 'Less') : (language === 'zh' ? '提炼详情' : 'Inspect')}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 rounded text-[#68616D] hover:text-[#29252D] hover:bg-[#F2EDF3] cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onDelete(event.id)}
                className="p-1 rounded text-[#68616D] hover:text-[#A94343] hover:bg-[#A94343]/10 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
