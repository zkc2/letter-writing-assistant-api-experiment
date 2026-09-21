import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Save,
  X,
  FileCheck,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  TimelineEvent,
  EventCategory,
  EventConfirmationStatus,
  FactPrivacySetting,
  Language,
} from '../../types';
import { getTranslation } from '../../i18n';
import { TimelineEventCard } from './TimelineEventCard';

interface ExperienceTimelineProps {
  events: TimelineEvent[];
  onUpdateEvent: (event: TimelineEvent) => void;
  onAddEvent: (event: Omit<TimelineEvent, 'id' | 'order'>) => void;
  onDeleteEvent: (id: string) => void;
  onReorderEvents: (reordered: TimelineEvent[]) => void;
  language: Language;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  events,
  onUpdateEvent,
  onAddEvent,
  onDeleteEvent,
  onReorderEvents,
  language,
}) => {
  const t = getTranslation(language);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSummary, setNewSummary] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('workload');
  const [newPrivacy, setNewPrivacy] = useState<FactPrivacySetting>('include');

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;
    onAddEvent({
      summary: newSummary.trim(),
      date: newDate.trim() || (language === 'zh' ? '未指定具体日期' : 'Date not provided'),
      category: newCategory,
      status: 'confirmed',
      privacy: newPrivacy,
    });
    setNewSummary('');
    setNewDate('');
    setIsAddingNew(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= events.length) return;
    const copy = [...events];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    copy.forEach((item, idx) => {
      item.order = idx + 1;
    });
    onReorderEvents(copy);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-3xl mx-auto font-sans-clean">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#403A45]/15">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-[#29252D] flex items-center gap-2">
            <span>⏳</span>
            <span>{t.workspace.timeline.title}</span>
            <span className="font-mono-system text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#DCD4EA] text-[#403A45] border border-[#403A45]/20">
              {events.length} {language === 'zh' ? '条事实' : 'events'}
            </span>
          </h3>
          <p className="text-xs text-[#68616D] mt-0.5">
            {language === 'zh'
              ? '按时间次序沉淀职场经历与交接节点，区分公文素材与隐私保护'
              : 'Chronological investigation feed of workplace realities and transition dates'}
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-system font-bold rounded-xl bg-[#F2B35D] hover:bg-[#e2a249] text-[#29252D] border border-[#403A45]/30 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.workspace.timeline.addEvent}</span>
        </button>
      </div>

      {/* Add New Event Form */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateNew}
          className="p-4 rounded-2xl border-2 border-[#403A45] bg-[#FFF9EE] retro-window-shadow space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#403A45]/15 pb-2">
            <span className="font-mono-system text-xs font-bold text-[#29252D]">
              {language === 'zh' ? '+ 录入新时间线事实' : '+ Record New Timeline Fact'}
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-[#68616D] hover:text-[#29252D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono-system font-bold text-[#68616D] mb-1">
                {language === 'zh' ? '发生时间 / 阶段' : 'Timeframe / Date'}
              </label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                placeholder={t.workspace.timeline.datePlaceholder}
                className="w-full text-xs font-mono-system p-2 rounded-lg border border-[#403A45]/30 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-system font-bold text-[#68616D] mb-1">
                {language === 'zh' ? '要素分类' : 'Category'}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                className="w-full text-xs font-mono-system p-2 rounded-lg border border-[#403A45]/30 bg-white"
              >
                <option value="workload">{language === 'zh' ? '工时负荷' : 'Workload'}</option>
                <option value="communication">{language === 'zh' ? '沟通分歧' : 'Communication'}</option>
                <option value="experience">{language === 'zh' ? '团队经历' : 'Experience'}</option>
                <option value="career">{language === 'zh' ? '职业方向' : 'Career'}</option>
                <option value="decision">{language === 'zh' ? '离职决策' : 'Decision'}</option>
                <option value="notice">{language === 'zh' ? '交接通知与最后日期' : 'Notice & Date'}</option>
                <option value="private">{language === 'zh' ? '私密保护界限' : 'Private Boundary'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono-system font-bold text-[#68616D] mb-1">
              {language === 'zh' ? '客观事实或经历描述' : 'Objective Summary'}
            </label>
            <textarea
              required
              rows={2}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder={t.workspace.timeline.summaryPlaceholder}
              className="w-full text-xs p-2.5 rounded-lg border border-[#403A45]/30 bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-mono-system text-[#68616D]">
                {language === 'zh' ? '安全界限：' : 'Security:'}
              </label>
              <button
                type="button"
                onClick={() => setNewPrivacy(newPrivacy === 'private' ? 'include' : 'private')}
                className={`px-2.5 py-1 text-[11px] font-mono-system rounded-md border ${
                  newPrivacy === 'private'
                    ? 'bg-[#F3ECF8] border-[#73579A] text-[#73579A] font-bold'
                    : 'bg-white border-[#403A45]/30 text-[#68616D]'
                }`}
              >
                {newPrivacy === 'private'
                  ? language === 'zh' ? '🔒 严禁写入信件' : '🔒 Exclude from Draft'
                  : language === 'zh' ? '🛡️ 正式可用' : '🛡️ Ready for Draft'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 text-xs text-[#68616D]"
              >
                {t.workspace.timeline.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-mono-system font-bold rounded-lg bg-[#F2B35D] text-[#29252D] border border-[#403A45]/30"
              >
                {t.workspace.timeline.save}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Timeline Feed Container with visual connectors */}
      {events.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-[#403A45]/20 bg-white/60 space-y-2">
          <Clock className="w-8 h-8 text-[#68616D]/60 mx-auto" />
          <h4 className="text-sm font-bold text-[#29252D]">
            {t.workspace.timeline.emptyTitle}
          </h4>
          <p className="text-xs text-[#68616D] max-w-sm mx-auto">
            {t.workspace.timeline.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4">
          {/* Vertical timeline spine */}
          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#403A45]/20" />

          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-6 top-3.5 w-3.5 h-3.5 rounded-full border-2 border-[#403A45] ${
                  event.privacy === 'private'
                    ? 'bg-[#73579A]'
                    : event.status === 'confirmed'
                    ? 'bg-[#3B8C68]'
                    : 'bg-[#F2B35D]'
                }`}
              />

              <TimelineEventCard
                event={event}
                index={index}
                totalEvents={events.length}
                onUpdate={onUpdateEvent}
                onDelete={onDeleteEvent}
                onMove={handleMove}
                language={language}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
