import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
  GitCompare,
  Eye,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Info,
  Check,
  Scroll,
} from 'lucide-react';
import {
  LetterContent,
  ConfirmedFactItem,
  SourceTraceMapping,
  LetterVersion,
  Language,
} from '../../types';
import { getTranslation } from '../../i18n';
import { SourceTracePanel } from './SourceTracePanel';
import { ConfirmationStamp } from './ConfirmationStamp';

interface DraftWorkspaceProps {
  currentLetter: LetterContent;
  caseFacts: ConfirmedFactItem[];
  versions: LetterVersion[];
  selectedParagraphIndex: number | null;
  onSelectParagraph: (idx: number | null) => void;
  onRestoreVersion: (version: LetterVersion) => void;
  onOpenCompare: (version: LetterVersion) => void;
  onApproveLetter: () => void;
  onOpenAudit: () => void;
  language: Language;
}

export const DraftWorkspace: React.FC<DraftWorkspaceProps> = ({
  currentLetter,
  caseFacts,
  versions,
  selectedParagraphIndex,
  onSelectParagraph,
  onRestoreVersion,
  onOpenCompare,
  onApproveLetter,
  onOpenAudit,
  language,
}) => {
  const t = getTranslation(language);

  // Split letter body into non-empty paragraphs
  const paragraphs = currentLetter.body
    ? currentLetter.body.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  // Generate source trace mappings for each paragraph
  const getTraceForParagraph = (index: number, text: string): SourceTraceMapping => {
    if (index === 0) {
      const whyFact = caseFacts.find((f) => f.id === 'whyResigning');
      const noticeFact = caseFacts.find((f) => f.id === 'noticePeriodOrDate');
      return {
        paragraphIndex: 0,
        paragraphText: text,
        factId: 'whyResigning',
        factLabel: whyFact?.label || (language === 'zh' ? '辞职动因与日期界定' : 'Reason & Date'),
        sourceText: `${whyFact?.value || ''} | ${noticeFact?.value || ''}`.trim(),
        isRewritten: true,
        reason:
          language === 'zh'
            ? '正式陈述辞职意向并明确最后在岗日期，符合劳动与职业交接规范。'
            : 'Formal declaration of resignation and exact departure date to establish a clear legal notice period.',
      };
    } else if (index === paragraphs.length - 1) {
      return {
        paragraphIndex: index,
        paragraphText: text,
        factId: 'noticePeriodOrDate',
        factLabel: language === 'zh' ? '交接支持与职业祝福' : 'Handover & Professional Regards',
        sourceText: caseFacts.find((f) => f.id === 'noticePeriodOrDate')?.value || '',
        isRewritten: true,
        reason:
          language === 'zh'
            ? '表达职业交接意愿并以体面方式结束雇佣关系，保护长远声誉。'
            : 'Offers professional transition assistance and maintains a dignified closure to protect long-term standing.',
      };
    } else {
      const expFact = caseFacts.find((f) => f.id === 'badExperiences');
      const bndFact = caseFacts.find((f) => f.id === 'whatNotToSay');
      return {
        paragraphIndex: index,
        paragraphText: text,
        factId: 'badExperiences',
        factLabel: expFact?.label || (language === 'zh' ? '职场经历公文化表达' : 'Workplace Experience'),
        sourceText: expFact?.value || '',
        isRewritten: true,
        reason:
          language === 'zh'
            ? `将真实职场经历提炼为体面、职业化的陈述，严格遵守隐私边界（严防泄露：${bndFact?.value || '健康/隐私/同事矛盾'}）。`
            : `Turns raw experiences into constructive phrasing while strictly honoring privacy boundaries (omits: ${bndFact?.value || 'health/private matters'}).`,
      };
    }
  };

  const isApproved = !!currentLetter.isApproved;

  const currentMapping =
    selectedParagraphIndex !== null && paragraphs[selectedParagraphIndex]
      ? getTraceForParagraph(selectedParagraphIndex, paragraphs[selectedParagraphIndex])
      : null;

  return (
    <div className="p-4 sm:p-5 space-y-6 max-w-4xl mx-auto font-sans-clean">
      {/* Draft Readiness & Approval Card */}
      <div
        className={`p-4 rounded-xl border-2 transition-all ${
          isApproved
            ? 'border-[#3B8C68] bg-[#EBF7F1] text-[#29252D] retro-window-shadow'
            : currentLetter.body
            ? 'border-[#F2B35D] bg-[#FFF9EE] text-[#29252D] retro-window-shadow'
            : 'border-[#403A45]/20 bg-[#F6F0E7]/40 text-[#68616D]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isApproved ? (
              <ConfirmationStamp type="approved" language={language} animate={false} />
            ) : (
              <ConfirmationStamp type="confirmed" language={language} animate={false} />
            )}
            <div>
              <h3 className="font-bold text-sm text-[#29252D]">
                {isApproved
                  ? t.workspace.draftSection.approvedBadge
                  : t.workspace.draftSection.readinessTitle}
              </h3>
              <p className="text-xs text-[#68616D] mt-0.5">
                {isApproved
                  ? language === 'zh'
                    ? '辞职信已由本人正式核准签发，所有公文格式与安全界限均已锁定。'
                    : 'Approved with "Yes". Ready for supervisor delivery.'
                  : language === 'zh'
                  ? '4/4 项事实已验证完毕，草稿处于可审阅状态。'
                  : 'All 4 facts verified; ready for user review.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isApproved && currentLetter.body && (
              <button
                id="btn-approve-draft-workspace"
                onClick={onApproveLetter}
                className="px-3.5 py-1.5 rounded-xl font-mono-system font-bold text-xs bg-[#3B8C68] hover:bg-[#2f7556] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>{t.workspace.draftSection.approveButton}</span>
              </button>
            )}

            <button
              onClick={onOpenAudit}
              className="px-3.5 py-1.5 rounded-xl font-mono-system font-medium text-xs bg-white text-[#29252D] border border-[#403A45]/30 hover:bg-[#F2EDF3] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B36D14]" />
              <span>{t.workspace.draftSection.openAudit}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paragraphs with Source Traceability */}
      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="font-bold text-sm text-[#29252D] flex items-center gap-1.5">
              <Scroll className="w-4 h-4 text-[#215E6D]" />
              <span>{t.workspace.draftSection.traceabilityTitle}</span>
            </h4>
            <p className="text-xs text-[#68616D] mt-0.5">
              {t.workspace.draftSection.traceabilityDesc}
            </p>
          </div>
        </div>

        {paragraphs.length === 0 ? (
          <div className="p-6 rounded-xl border-2 border-dashed border-[#403A45]/20 bg-white/60 text-center text-xs text-[#68616D]">
            {language === 'zh'
              ? '辞职信正文生成后，在此处可实时查看每个段落对应的事实来源与专业转译逻辑。'
              : 'Once your letter draft is generated, click any paragraph to trace its supporting facts.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Paragraph list */}
            <div className="lg:col-span-7 space-y-2.5">
              {paragraphs.map((pText, idx) => {
                const isSelected = selectedParagraphIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => onSelectParagraph(isSelected ? null : idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#215E6D] bg-[#F2F8F9] shadow-xs'
                        : 'border-[#403A45]/20 bg-white hover:border-[#403A45]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-system text-[11px] font-bold text-[#68616D] bg-[#F6F0E7] px-2 py-0.5 rounded border border-[#403A45]/10">
                          {language === 'zh' ? `第 ${idx + 1} 段` : `Paragraph ${idx + 1}`}
                        </span>
                        <span className="font-mono-system text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF7F1] text-[#1B5E3F] border border-[#BFE2D3]">
                          {t.workspace.draftSection.rewrittenBadge}
                        </span>
                      </div>

                      <span className="font-mono-system text-[11px] text-[#215E6D] font-medium">
                        {isSelected
                          ? language === 'zh' ? '● 正在回溯' : '● Tracing'
                          : language === 'zh' ? '点击回溯 →' : 'Trace →'}
                      </span>
                    </div>

                    <p className="text-xs text-[#29252D] line-clamp-3 leading-relaxed font-serif-classic">
                      "{pText}"
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Source Trace Panel on right */}
            <div className="lg:col-span-5">
              <SourceTracePanel
                mapping={currentMapping}
                language={language}
              />
            </div>
          </div>
        )}
      </section>

      {/* Version History */}
      {versions.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-[#403A45]/15">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#29252D] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#73579A]" />
              <span>{t.workspace.draftSection.versionHistoryTitle}</span>
            </h4>
            <span className="font-mono-system text-xs text-[#68616D]">
              {versions.length} {language === 'zh' ? '个历史版本' : 'versions'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="p-3 rounded-xl border border-[#403A45]/20 bg-white space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-system text-[11px] font-bold text-[#29252D]">
                    {ver.label}
                  </span>
                  <span className="font-mono-system text-[10px] text-[#68616D]">
                    {new Date(ver.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-[#68616D] line-clamp-2 italic text-[11px]">
                  "{ver.body?.slice(0, 100)}..."
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#403A45]/10">
                  <button
                    onClick={() => onOpenCompare(ver)}
                    className="text-[11px] font-mono-system text-[#215E6D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <GitCompare className="w-3 h-3" />
                    <span>{t.workspace.draftSection.compareChanges}</span>
                  </button>
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="text-[11px] font-mono-system text-[#B36D14] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.workspace.draftSection.restoreVersion}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
