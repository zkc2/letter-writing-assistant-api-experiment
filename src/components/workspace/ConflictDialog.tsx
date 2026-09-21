import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { DetectedConflict, Language } from '../../types';

interface ConflictDialogProps {
  conflict: DetectedConflict | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (conflictId: string, choice: 'A' | 'B' | 'custom', customValue?: string) => void;
  language: Language;
}

export const ConflictDialog: React.FC<ConflictDialogProps> = ({
  conflict,
  isOpen,
  onClose,
  onResolve,
  language,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  if (!isOpen || !conflict) return null;

  const handleResolve = (choice: 'A' | 'B' | 'custom') => {
    if (choice === 'custom') {
      if (!customInput.trim()) return;
      onResolve(conflict.id, 'custom', customInput.trim());
    } else {
      onResolve(conflict.id, choice);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29252D]/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-[#FFFDFC] rounded-2xl border-2 border-[#A94343] retro-window-shadow overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Title bar */}
        <div className="px-4 py-3 bg-[#A94343] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="font-mono-system text-xs font-bold uppercase tracking-wider">
              {language === 'zh' ? '事实冲突排查' : 'Conflict Detected'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-sans-clean">
          <div>
            <h3 className="text-sm font-bold text-[#29252D] mb-1">{conflict.title}</h3>
            <p className="text-[#68616D] leading-relaxed">{conflict.description}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF3D6] border border-[#F2B35D] text-[#824E0F] font-medium leading-relaxed">
            {conflict.question}
          </div>

          {/* Option A vs Option B */}
          <div className="space-y-2">
            <button
              onClick={() => handleResolve('A')}
              className="w-full p-3 text-left rounded-xl border border-[#403A45]/20 hover:border-[#3B8C68] hover:bg-[#EBF7F1]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-system text-[11px] font-bold text-[#3B8C68]">
                  {language === 'zh' ? '采用方案 A' : 'Select Option A'}
                </span>
              </div>
              <p className="text-[#29252D] font-medium">{conflict.valueA}</p>
            </button>

            <button
              onClick={() => handleResolve('B')}
              className="w-full p-3 text-left rounded-xl border border-[#403A45]/20 hover:border-[#3B8C68] hover:bg-[#EBF7F1]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-system text-[11px] font-bold text-[#3B8C68]">
                  {language === 'zh' ? '采用方案 B' : 'Select Option B'}
                </span>
              </div>
              <p className="text-[#29252D] font-medium">{conflict.valueB}</p>
            </button>
          </div>

          {/* Custom option */}
          <div className="pt-2 border-t border-[#403A45]/10">
            {useCustom ? (
              <div className="space-y-2">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={
                    language === 'zh'
                      ? '输入精准澄清后的事实...'
                      : 'Enter your clarified resolution...'
                  }
                  rows={2}
                  className="w-full p-2 text-xs rounded-lg border border-[#403A45]/30 bg-white"
                />
                <button
                  onClick={() => handleResolve('custom')}
                  disabled={!customInput.trim()}
                  className="w-full py-2 bg-[#F2B35D] text-[#29252D] font-bold rounded-lg disabled:opacity-40"
                >
                  {language === 'zh' ? '确认澄清结果' : 'Save Custom Resolution'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setUseCustom(true)}
                className="text-xs font-mono-system text-[#68616D] hover:text-[#29252D] underline cursor-pointer"
              >
                {language === 'zh' ? '手动输入其他明确信息...' : 'Or enter custom resolution...'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
