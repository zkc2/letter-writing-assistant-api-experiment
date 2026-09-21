import React from 'react';
import { X, GitCompare, RotateCcw } from 'lucide-react';
import { LetterVersion, Language } from '../../types';
import { getTranslation } from '../../i18n';

interface VersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBody: string;
  compareVersion: LetterVersion | null;
  onRestore: (version: LetterVersion) => void;
  language: Language;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({
  isOpen,
  onClose,
  currentBody,
  compareVersion,
  onRestore,
  language,
}) => {
  if (!isOpen || !compareVersion) return null;
  const t = getTranslation(language);

  return (
    <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4DED5] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E4DED5] flex items-center justify-between bg-[#F6F4EF]">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-semibold text-base text-[#171717]">
                {t.workspace.draftSection.compareModalTitle}
              </h3>
              <p className="text-xs text-[#68635D]">
                {compareVersion.label} (
                {new Date(compareVersion.timestamp).toLocaleString()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Historical Version */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                {t.workspace.draftSection.previousTextLabel}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-medium">
                {compareVersion.checkpoint}
              </span>
            </div>
            <div className="text-xs text-stone-800 font-serif whitespace-pre-wrap leading-relaxed">
              {compareVersion.body}
            </div>
          </div>

          {/* Current Version */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <span className="text-xs font-semibold text-amber-950 uppercase tracking-wide">
                {t.workspace.draftSection.currentTextLabel}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-medium">
                Active Draft
              </span>
            </div>
            <div className="text-xs text-stone-900 font-serif whitespace-pre-wrap leading-relaxed">
              {currentBody}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4DED5] bg-[#F6F4EF] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#68635D] hover:text-[#171717] cursor-pointer"
          >
            {t.workspace.draftSection.closeModal}
          </button>

          <button
            onClick={() => {
              onRestore(compareVersion);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.workspace.draftSection.restoreVersion}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
