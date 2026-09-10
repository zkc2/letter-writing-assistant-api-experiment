import React, { useState } from 'react';
import { X, ShieldCheck, HeartHandshake, Lock } from 'lucide-react';
import { GhostwriterInputs } from '../types';

interface ComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInputs: (inputs: GhostwriterInputs, detailsMessage: string) => void;
  initialSender?: {
    name?: string;
    title?: string;
  };
}

const RESIGNATION_REASONS = [
  'Select a reason or describe your own',
  'Toxic management / hostile culture',
  'Severe burnout & unsustainable workload',
  'Broken promises / stalled advancement',
  'Undercompensated & undervalued',
  'Accepted a new employment opportunity',
  'Personal / family health priorities',
  'Other / describe in your own words',
];

const RESIGNATION_TONES = [
  { id: 'Calm & Dignified', label: 'Calm & Dignified', desc: 'Restrained, professional, protective of future references' },
  { id: 'Strictly Neutral & Minimalist', label: 'Strictly Neutral', desc: 'Zero emotional exposure, basic notice only' },
  { id: 'Firm & Uncompromising', label: 'Firm & Uncompromising', desc: 'Clear boundaries, no room for counter-offers' },
  { id: 'Diplomatic & Gracious', label: 'Diplomatic & Gracious', desc: 'Preserving peer friendships while exiting cleanly' },
];

export const ComposerModal: React.FC<ComposerModalProps> = ({
  isOpen,
  onClose,
  onSubmitInputs,
  initialSender,
}) => {
  const [whyResigning, setWhyResigning] = useState(RESIGNATION_REASONS[0]);
  const [badExperiences, setBadExperiences] = useState('');
  const [tone, setTone] = useState('Calm & Dignified');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [whatNotToSay, setWhatNotToSay] = useState('');
  
  // Details
  const [senderName, setSenderName] = useState(initialSender?.name || '');
  const [senderTitle, setSenderTitle] = useState(initialSender?.title || '');
  const [supervisorName, setSupervisorName] = useState('');
  const [companyName, setCompanyName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveReason = whyResigning === RESIGNATION_REASONS[0] ? '' : whyResigning;
    const inputs: GhostwriterInputs = {
      whyResigning: effectiveReason,
      badExperiences: badExperiences.trim(),
      whatToSay: noticePeriod.trim() ? `Formal notice of resignation with final working date: ${noticePeriod.trim()}` : '',
      whatNotToSay: whatNotToSay.trim(),
      noticePeriodOrDate: noticePeriod.trim(),
      supervisorName: supervisorName.trim(),
      senderName: senderName.trim(),
      senderTitle: senderTitle.trim(),
    };

    const lines = [
      effectiveReason ? `Core reason: ${effectiveReason}` : '',
      badExperiences.trim() ? `What happened / experiences: ${badExperiences.trim()}` : '',
      noticePeriod.trim() ? `Exact final working date: ${noticePeriod.trim()}` : '',
      whatNotToSay.trim() ? `Boundaries (do NOT mention): ${whatNotToSay.trim()}` : '',
      tone ? `Tone preference: ${tone}` : '',
      senderName.trim() ? `My name: ${senderName.trim()}` : '',
      supervisorName.trim() ? `Supervisor: ${supervisorName.trim()}` : '',
      companyName.trim() ? `Company: ${companyName.trim()}` : '',
    ].filter(Boolean);

    const message = lines.length > 0
      ? `Here are details regarding my resignation case:\n${lines.join('\n')}`
      : 'I would like assistance with my resignation letter.';

    onSubmitInputs(inputs, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-sans-clean">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-stone-950 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">New Resignation Case</h3>
              <p className="text-xs text-stone-400">Share your details with the Ghostwriter to review and confirm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Reason selection */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              What is your primary reason for resigning?
            </label>
            <select
              value={whyResigning}
              onChange={(e) => setWhyResigning(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {RESIGNATION_REASONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Bad Experiences / Challenges */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              What happened? (Raw experiences, feelings, incidents)
            </label>
            <textarea
              value={badExperiences}
              onChange={(e) => setBadExperiences(e.target.value)}
              rows={3}
              placeholder="Describe what happened in your own words (e.g., micromanagement, unfair treatment, burnout). The assistant will help keep this professional."
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Tone & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Tone Archetype</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {RESIGNATION_TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Exact Intended Final Working Date
              </label>
              <input
                type="text"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                placeholder="Exact date (e.g. November 14, 2026)"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                State your exact intended final working date. We do not assume or calculate your date.
              </p>
            </div>
          </div>

          {/* Privacy Guardrails (What NOT to say) */}
          <div>
            <label className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Boundaries: What do you NOT want said in the letter?</span>
            </label>
            <input
              type="text"
              value={whatNotToSay}
              onChange={(e) => setWhatNotToSay(e.target.value)}
              placeholder="Leave blank or specify topics to exclude (e.g., do not mention new employer, no grievances on record)"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Names and Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
            <div>
              <label className="font-medium text-stone-700 block mb-0.5">Your Name & Title (Optional)</label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
                <input
                  type="text"
                  value={senderTitle}
                  onChange={(e) => setSenderTitle(e.target.value)}
                  placeholder="Your Role / Title"
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-0.5">Supervisor & Company (Optional)</label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder="Supervisor Name"
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Details to Ghostwriter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
