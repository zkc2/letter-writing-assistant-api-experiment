import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  HelpCircle,
  ArrowRight,
  Edit2,
  Save,
  X,
  Plus,
  Check,
  MinusCircle,
  FileCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  ConfirmedFactItem,
  CaseFactStatus,
  FactPrivacySetting,
  WordingTransformation,
  DetectedConflict,
  Language,
} from '../../types';
import { getTranslation } from '../../i18n';
import { CaseFileSlot } from './CaseFileSlot';
import { DraftUnlockState } from './DraftUnlockState';

interface ConfirmedCaseFileProps {
  facts: ConfirmedFactItem[];
  onUpdateFact: (fact: ConfirmedFactItem) => void;
  transformations: WordingTransformation[];
  onUpdateTransformation?: (item: WordingTransformation) => void;
  onAddTransformation?: (item: Omit<WordingTransformation, 'id'>) => void;
  conflicts: DetectedConflict[];
  onResolveConflict: (conflictId: string, choice: 'A' | 'B' | 'custom', customValue?: string) => void;
  onProceedToDraft?: () => void;
  language: Language;
}

export const ConfirmedCaseFile: React.FC<ConfirmedCaseFileProps> = ({
  facts,
  onUpdateFact,
  transformations,
  onUpdateTransformation,
  onAddTransformation,
  conflicts,
  onResolveConflict,
  onProceedToDraft,
  language,
}) => {
  const t = getTranslation(language);

  const [editingTransId, setEditingTransId] = useState<string | null>(null);
  const [editingTransProfessional, setEditingTransProfessional] = useState('');

  const [isAddingTrans, setIsAddingTrans] = useState(false);
  const [newTransOriginal, setNewTransOriginal] = useState('');
  const [newTransProfessional, setNewTransProfessional] = useState('');

  // 4/4 Gate calculation
  const confirmedCount = facts.filter(
    (f) => f.status === 'confirmed' || (f.status === 'private' && f.value.trim().length > 0)
  ).length;
  const isGateComplete = confirmedCount === 4 && conflicts.filter((c) => !c.resolved).length === 0;

  const handleStartEditTrans = (item: WordingTransformation) => {
    setEditingTransId(item.id);
    setEditingTransProfessional(item.professional);
  };

  const handleSaveEditTrans = (id: string) => {
    const existing = transformations.find((tr) => tr.id === id);
    if (!existing) return;
    onUpdateTransformation?.({
      ...existing,
      professional: editingTransProfessional.trim() || existing.professional,
      status: 'edited',
    });
    setEditingTransId(null);
  };

  const handleAddCustomTrans = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransOriginal.trim()) return;
    onAddTransformation?.({
      original: newTransOriginal.trim(),
      professional: newTransProfessional.trim() || newTransOriginal.trim(),
      category: 'custom',
      status: 'suggested',
      isCustom: true,
    });
    setNewTransOriginal('');
    setNewTransProfessional('');
    setIsAddingTrans(false);
  };

  const unresolvedConflicts = conflicts.filter((c) => !c.resolved);

  return (
    <div className="p-4 sm:p-5 space-y-6 max-w-4xl mx-auto font-sans-clean">
      {/* 4/4 Gate Progress & Draft Unlock State */}
      <DraftUnlockState
        status={isGateComplete ? 'ready_to_draft' : confirmedCount > 0 ? 'needs_confirmation' : 'locked'}
        confirmedCount={confirmedCount}
        totalRequired={4}
        language={language}
        onProceedToDraft={onProceedToDraft}
      />

      {/* Unresolved Conflict Banner (Only Red for Genuine Conflicts) */}
      {unresolvedConflicts.length > 0 && (
        <div className="space-y-3">
          {unresolvedConflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="p-4 rounded-xl border-2 border-[#A94343] bg-[#A94343]/5 text-[#29252D] retro-window-shadow space-y-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#A94343] shrink-0" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#A94343]">
                    {t.workspace.conflict.bannerTitle}: {conflict.title}
                  </h4>
                  <p className="text-xs text-[#68616D] mt-0.5 font-medium">
                    {conflict.description}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#A94343]/30 text-xs">
                <span className="font-semibold text-[#A94343] block mb-2">
                  {conflict.question}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => onResolveConflict(conflict.id, 'A')}
                    className="p-2.5 rounded-lg border border-[#403A45]/20 hover:border-[#3B8C68] hover:bg-[#EBF7F1] text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-mono-system font-bold text-[#68616D] block mb-0.5">
                      {t.workspace.conflict.chooseA}
                    </span>
                    <span className="font-medium text-xs text-[#29252D]">
                      {conflict.valueA}
                    </span>
                  </button>

                  <button
                    onClick={() => onResolveConflict(conflict.id, 'B')}
                    className="p-2.5 rounded-lg border border-[#403A45]/20 hover:border-[#3B8C68] hover:bg-[#EBF7F1] text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-mono-system font-bold text-[#68616D] block mb-0.5">
                      {t.workspace.conflict.chooseB}
                    </span>
                    <span className="font-medium text-xs text-[#29252D]">
                      {conflict.valueB}
                    </span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#A94343] font-mono-system font-medium">
                {t.workspace.conflict.blockingNotice}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4 Required Case File Slots */}
      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="font-bold text-sm text-[#29252D]">
              {language === 'zh'
                ? '4 项关键案卷要素槽位 (Case File Pillars)'
                : '4 Essential Case File Pillars'}
            </h4>
            <p className="text-xs text-[#68616D]">
              {t.workspace.caseFile.privacyNotice}
            </p>
          </div>
          <span className="font-mono-system text-xs font-semibold px-2 py-0.5 rounded bg-[#F6F0E7] text-[#68616D] border border-[#E2D8C9]">
            {confirmedCount} / 4 {language === 'zh' ? '已核准备案' : 'Confirmed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {facts.map((fact, idx) => (
            <CaseFileSlot
              key={fact.id}
              fact={fact}
              slotNumber={idx + 1}
              onUpdateFact={onUpdateFact}
              language={language}
            />
          ))}
        </div>
      </section>

      {/* Wording Transformations (Original Experience vs Professional Wording) */}
      <section className="space-y-3 pt-4 border-t border-[#403A45]/15">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="font-bold text-sm text-[#29252D] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F2B35D]" />
              <span>{t.workspace.wording.title}</span>
            </h4>
            <p className="text-xs text-[#68616D] mt-0.5">
              {t.workspace.wording.subtitle}
            </p>
          </div>
          {onAddTransformation && (
            <button
              onClick={() => setIsAddingTrans(!isAddingTrans)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono-system font-bold rounded-lg bg-[#F2B35D] hover:bg-[#e2a249] text-[#29252D] border border-[#403A45]/30 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.workspace.wording.addTransformation}</span>
            </button>
          )}
        </div>

        {/* Add Transformation Form */}
        {isAddingTrans && (
          <form
            onSubmit={handleAddCustomTrans}
            className="p-3.5 rounded-xl border border-[#F2B35D] bg-[#FFF9EE] space-y-2.5 text-xs"
          >
            <div>
              <label className="block text-[11px] font-mono-system font-bold text-[#68616D] mb-1">
                {t.workspace.wording.originalHeader}
              </label>
              <textarea
                required
                rows={2}
                value={newTransOriginal}
                onChange={(e) => setNewTransOriginal(e.target.value)}
                placeholder={t.workspace.wording.originalPlaceholder}
                className="w-full text-xs p-2 rounded-lg border border-[#403A45]/20 bg-white text-[#29252D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono-system font-bold text-[#68616D] mb-1">
                {t.workspace.wording.professionalHeader}
              </label>
              <textarea
                rows={2}
                value={newTransProfessional}
                onChange={(e) => setNewTransProfessional(e.target.value)}
                placeholder={t.workspace.wording.professionalPlaceholder}
                className="w-full text-xs p-2 rounded-lg border border-[#403A45]/20 bg-white text-[#29252D]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingTrans(false)}
                className="px-2.5 py-1 text-xs text-[#68616D] hover:bg-stone-200 rounded"
              >
                {t.workspace.timeline.cancel}
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold rounded-lg bg-[#F2B35D] text-[#29252D]"
              >
                {t.workspace.timeline.save}
              </button>
            </div>
          </form>
        )}

        {/* Transformations list */}
        <div className="space-y-3">
          {transformations.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[#403A45]/20 bg-[#FFFDFC] shadow-xs space-y-2.5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Original wording */}
                <div className="p-3 rounded-lg bg-[#F6F0E7]/60 border border-[#403A45]/10 space-y-1">
                  <span className="font-mono-system text-[10px] font-bold text-[#68616D] uppercase tracking-wider block">
                    {language === 'zh' ? '原声经历 / 真实诉求' : 'Raw Expression'}
                  </span>
                  <p className="text-[#68616D] italic font-normal leading-relaxed">
                    "{item.original}"
                  </p>
                </div>

                {/* Professional refined wording */}
                <div className="p-3 rounded-lg bg-[#EBF7F1]/70 border border-[#BFE2D3] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-system text-[10px] font-bold text-[#3B8C68] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#3B8C68]" />
                      {language === 'zh' ? '正式公文化转化' : 'Professional Transformation'}
                    </span>
                    {item.status === 'accepted' && (
                      <span className="font-mono-system text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#BFE2D3] text-[#1B5E3F]">
                        {t.workspace.wording.accepted}
                      </span>
                    )}
                  </div>
                  {editingTransId === item.id ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={2}
                        value={editingTransProfessional}
                        onChange={(e) => setEditingTransProfessional(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-[#403A45]/20 bg-white"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingTransId(null)}
                          className="px-2 py-0.5 text-xs text-[#68616D]"
                        >
                          {t.workspace.timeline.cancel}
                        </button>
                        <button
                          onClick={() => handleSaveEditTrans(item.id)}
                          className="px-2.5 py-0.5 text-xs font-bold rounded bg-[#F2B35D] text-[#29252D]"
                        >
                          {t.workspace.timeline.save}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#29252D] font-medium leading-relaxed">
                      {item.professional}
                    </p>
                  )}
                </div>
              </div>

              {/* Transformation actions */}
              <div className="flex items-center justify-end gap-2 text-xs">
                {editingTransId !== item.id && (
                  <button
                    onClick={() => handleStartEditTrans(item)}
                    className="p-1 rounded text-[#68616D] hover:text-[#29252D] hover:bg-[#F2EDF3] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{t.workspace.wording.edit}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
