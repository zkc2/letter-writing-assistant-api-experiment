import React, { useState } from 'react';
import {
  HeartHandshake,
  X,
  Check,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { LetterContent, CritiqueResult, Language } from '../types';
import { getTranslation } from '../i18n';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterContent;
  onApplyRevision: (updatedBody: string, summary?: string) => void;
  language: Language;
}

const QUICK_GHOSTWRITER_ACTIONS_EN = [
  {
    id: 'cool-down',
    title: 'De-Escalate Phrasing',
    desc: 'Strips subtle passive-aggressive phrasing or venting; ensures a respectful, professional tone.',
    actionPrompt: 'Remove any latent hostility, passive-aggressive undertones, or grievance airing. Keep the tone impeccably composed and professional.',
  },
  {
    id: 'concise-focused',
    title: 'Concise & Focused',
    desc: 'Cuts unnecessary justifications, leaving only the essential formal notice and dates.',
    actionPrompt: 'Make the letter clear and concise. Remove personal justifications and keep strictly to: notice of resignation, effective last day, and standard handover commitment.',
  },
  {
    id: 'firm-boundaries',
    title: 'Firm Boundaries (No Counter-offers)',
    desc: 'States unequivocally that your decision is final to prevent awkward retention negotiations.',
    actionPrompt: 'Politely but firmly emphasize that this decision is final and fully considered, closing the door on retention counter-offers without being abrasive.',
  },
  {
    id: 'peer-handover',
    title: 'Warm Peer Handover Focus',
    desc: 'Emphasizes cooperative transition for coworkers while maintaining boundaries with leadership.',
    actionPrompt: 'Expand the transition section to warmly highlight teamwork and offer organized handover documentation for peers, while maintaining clean boundaries with leadership.',
  },
  {
    id: 'urgent-short',
    title: 'Convert to Expedited Notice',
    desc: 'Adjusts timeline politely for unviable workplace environments or personal emergencies.',
    actionPrompt: 'Revise the letter for immediate or shortened notice due to unforeseen personal circumstances, with clear mention of equipment return and asset handover.',
  },
];

const QUICK_GHOSTWRITER_ACTIONS_ZH = [
  {
    id: 'cool-down',
    title: '降温缓和情绪',
    desc: '去除潜意识的消极攻击或宣泄辞藻，确保措辞冷静、得体、无瑕疵。',
    actionPrompt: '移除任何潜在的敌意、讽刺或情绪宣泄。保持语气高度冷静、理性且专业。',
  },
  {
    id: 'concise-focused',
    title: '精简聚焦核心',
    desc: '删减冗余解释与个人借口，仅保留正式离职声明、最后工作日及标准交接承诺。',
    actionPrompt: '精简信函内容，去除多余的个人理由与长篇大论，仅保留：辞职通知、最后工作日及工作交接意愿。',
  },
  {
    id: 'firm-boundaries',
    title: '明确坚定边界（杜绝挽留）',
    desc: '清晰表明决定已经深思熟虑、不可撤销，委婉拒绝不必要的挽留拉扯。',
    actionPrompt: '礼貌但非常明确地强调该决定为最终决定，关闭任何可能的挽留谈判空间，同时保持职业素养。',
  },
  {
    id: 'peer-handover',
    title: '温和同事交接',
    desc: '向共事的同侪团队表达真诚感谢，并承诺提供清晰详尽的文档交接。',
    actionPrompt: '扩充交接部分，温和表达对基层同事协作的谢意，承诺交付条理清晰的文档交接，同时对管理层保持合适边界。',
  },
  {
    id: 'urgent-short',
    title: '紧急即时离职',
    desc: '针对不可抗力或健康紧急情况，礼貌提出即时或极短通知期，明确资产归还。',
    actionPrompt: '针对突发个人不可抗力情况，将信件调整为即刻或极短通知期，并清晰说明办公设备与资产的归还安排。',
  },
];

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  letter,
  onApplyRevision,
  language,
}) => {
  const t = getTranslation(language);
  const quickActions = language === 'zh' ? QUICK_GHOSTWRITER_ACTIONS_ZH : QUICK_GHOSTWRITER_ACTIONS_EN;

  const [activeTab, setActiveTab] = useState<'refine' | 'audit'>('refine');
  const [customInstruction, setCustomInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Proposed revision state
  const [proposedText, setProposedText] = useState<string | null>(null);
  const [changeSummary, setChangeSummary] = useState<string | null>(null);

  // Audit state
  const [audit, setAudit] = useState<CritiqueResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  if (!isOpen) return null;

  const handleRefine = async (actionDesc: string, instructionText?: string) => {
    setLoading(true);
    setError(null);
    setProposedText(null);
    setChangeSummary(null);

    try {
      const response = await fetch('/api/letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLetter: letter.body,
          action: 'rewrite',
          customPrompt: `${actionDesc}. ${instructionText || ''}`,
          targetTone: language === 'zh'
            ? '冷静、克制、得体且保护职场边界。保持作者人称与职业尊严。'
            : 'Calm, protective, and supportive. Maintain the user’s point of view and professional dignity.',
          preserveStructure: true,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(language === 'zh' ? '优化信函失败，请重试。' : 'Failed to refine draft. Please try again.');
      }

      const data = await response.json();
      setProposedText(data.revisedText);
      setChangeSummary(data.summaryOfChanges || (language === 'zh' ? '已应用优化调整' : 'Draft polished'));
    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '优化信函失败，请重试。' : 'Failed to refine draft. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    setAuditLoading(true);
    setError(null);

    const fullLetterText = `Salutation: ${letter.salutation}\n\n${letter.body}\n\nClosing: ${letter.closing}\n${letter.signoffName}`;

    try {
      const response = await fetch('/api/letter/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letter: fullLetterText,
          context: language === 'zh'
            ? '这是一封中文正式离职信。请以专业的 Ghostwriter 角度评估其沉着度、清晰度、礼仪合规性与边界保护（非法律意见）。'
            : 'Professional resignation letter. Evaluate composure, clarity, professional tone, and standard letter conventions without legal advice.',
          language,
        }),
      });

      if (!response.ok) {
        let errText = language === 'zh' ? '审核失败，请重试。' : 'Failed to audit draft. Please try again.';
        try {
          const errJson = await response.json();
          if (errJson.error) errText = errJson.error;
        } catch (_) {}
        throw new Error(errText);
      }

      const data = await response.json();
      setAudit(data);
    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '审核失败，请重试。' : 'Failed to audit draft. Please try again.'));
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans-clean">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col">
          {/* Drawer Header */}
          <div className="bg-stone-950 text-stone-100 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-600 text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{t.drawer.title}</h3>
                <p className="text-[11px] text-stone-400">{t.drawer.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-stone-200 bg-stone-50 text-xs">
            <button
              onClick={() => setActiveTab('refine')}
              className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'refine'
                  ? 'border-b-2 border-amber-600 text-amber-900 bg-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{t.drawer.tabRefine}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('audit');
                if (!audit) handleAudit();
              }}
              className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'border-b-2 border-amber-600 text-amber-900 bg-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>{t.drawer.tabAudit}</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: REFINE */}
            {activeTab === 'refine' && (
              <div className="space-y-4">
                {/* Proposed Revision Preview Card */}
                {proposedText && (
                  <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-amber-700" />
                        {t.drawer.proposedChangesTitle}
                      </span>
                    </div>

                    {changeSummary && (
                      <p className="text-[11px] text-amber-800 italic">
                        {changeSummary}
                      </p>
                    )}

                    <div className="p-3 bg-white rounded-xl border border-amber-200 text-stone-800 text-[11px] whitespace-pre-line max-h-52 overflow-y-auto leading-relaxed font-serif-reading">
                      {proposedText}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setProposedText(null)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-200/60 rounded-lg text-xs cursor-pointer"
                      >
                        {t.drawer.discard}
                      </button>
                      <button
                        onClick={() => {
                          onApplyRevision(proposedText, changeSummary || undefined);
                          setProposedText(null);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.drawer.applyToLetter}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Safeguard Action Buttons */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    {t.drawer.quickActionsTitle}
                  </label>
                  <div className="space-y-2">
                    {quickActions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleRefine(item.actionPrompt)}
                        disabled={loading}
                        className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 transition-all cursor-pointer shadow-2xs group"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-stone-900 group-hover:text-amber-900 text-xs">
                            {item.title}
                          </span>
                          <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-amber-700" />
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-2">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Instruction */}
                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    {t.drawer.customPromptLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customInstruction}
                      onChange={(e) => setCustomInstruction(e.target.value)}
                      placeholder={t.drawer.customPromptPlaceholder}
                      className="flex-1 p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50"
                    />
                    <button
                      onClick={() => handleRefine(customInstruction)}
                      disabled={!customInstruction.trim() || loading}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium disabled:opacity-40 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.drawer.applyCustomButton}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AUDIT */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                {auditLoading && (
                  <div className="flex flex-col items-center justify-center p-8 space-y-2 text-stone-500">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                    <span className="text-xs">{t.drawer.auditRunning}</span>
                  </div>
                )}

                {!auditLoading && audit && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Verdict */}
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                        {t.drawer.auditVerdictLabel}
                      </span>
                      <p className="text-xs font-semibold text-stone-900 leading-snug">
                        {audit.overallVerdict}
                      </p>
                    </div>

                    {/* Tone Analysis */}
                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                        {t.drawer.toneAnalysisLabel}
                      </span>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {audit.toneAnalysis}
                      </p>
                    </div>

                    {/* Strengths */}
                    {audit.strengths && audit.strengths.length > 0 && (
                      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          {t.drawer.strengthsLabel}
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-emerald-900 text-[11px] pl-1">
                          {audit.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {audit.recommendations && audit.recommendations.length > 0 && (
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          {t.drawer.recommendationsLabel}
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-amber-900 text-[11px] pl-1">
                          {audit.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={handleAudit}
                      className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.drawer.runAuditButton}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

