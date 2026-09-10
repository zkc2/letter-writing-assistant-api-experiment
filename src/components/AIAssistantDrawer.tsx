import React, { useState } from 'react';
import {
  HeartHandshake,
  X,
  Check,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import { LetterContent, CritiqueResult } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterContent;
  onApplyRevision: (updatedBody: string, summary?: string) => void;
}

const QUICK_GHOSTWRITER_ACTIONS = [
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

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  letter,
  onApplyRevision,
}) => {
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
          targetTone: 'Calm, protective, and supportive. Maintain the user’s point of view and professional dignity.',
          preserveStructure: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine letter.');
      }

      const data = await response.json();
      setProposedText(data.revisedText);
      setChangeSummary(data.summaryOfChanges || 'Ghostwriter optimized your resignation draft.');
    } catch (err: any) {
      setError(err.message || 'Error executing ghostwriter adjustment.');
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
          letterText: fullLetterText,
          intendedPurpose: 'Professional resignation letter that safely channels bad experiences into a dignified departure without retaliation risk.',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to audit letter.');
      }

      const data = await response.json();
      setAudit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to complete exit audit.');
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
                <h3 className="text-sm font-semibold tracking-tight">Ghostwriter Safeguards</h3>
                <p className="text-[11px] text-stone-400">Refine tone & conduct safety audits</p>
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
              <span>Protective Polishing</span>
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
              <span>Tone & Etiquette Review</span>
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
                        Proposed Ghostwriter Adjustment
                      </span>
                    </div>

                    {changeSummary && (
                      <p className="text-[11px] text-amber-800 italic">
                        {changeSummary}
                      </p>
                    )}

                    <div className="p-3 bg-white rounded-xl border border-amber-200 text-stone-800 text-[11px] whitespace-pre-line max-h-52 overflow-y-auto leading-relaxed">
                      {proposedText}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setProposedText(null)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-200/60 rounded-lg text-xs cursor-pointer"
                      >
                        Dismiss
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
                        <span>Apply to Letter</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Safeguard Action Buttons */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    One-Tap Ghostwriter Safeguards:
                  </label>
                  <div className="space-y-2">
                    {QUICK_GHOSTWRITER_ACTIONS.map((item) => (
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
                    Custom Ghostwriter Request:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customInstruction}
                      onChange={(e) => setCustomInstruction(e.target.value)}
                      placeholder="E.g., Ensure I sound appreciative of my peers..."
                      className="flex-1 p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50"
                    />
                    <button
                      onClick={() => handleRefine(customInstruction)}
                      disabled={!customInstruction.trim() || loading}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium disabled:opacity-40 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refine'}
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
                    <span className="text-xs">Reviewing resignation draft for tone, clarity, and boundaries...</span>
                  </div>
                )}

                {!auditLoading && audit && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Verdict */}
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                        Ghostwriter Verdict
                      </span>
                      <p className="text-xs font-semibold text-stone-900 leading-snug">
                        {audit.overallVerdict}
                      </p>
                    </div>

                    {/* Tone Analysis */}
                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                        Tone & Boundary Assessment
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
                          Key Strengths & Safeguards
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
                          Recommended Tweaks
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
                      <span>Re-run Audit</span>
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
