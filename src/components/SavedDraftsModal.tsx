import React from 'react';
import { FolderOpen, X, Clock, Trash2, ArrowRight, Copy } from 'lucide-react';
import { LetterContent, Language } from '../types';
import { getTranslation } from '../i18n';

interface SavedDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: LetterContent[];
  onLoadDraft: (draft: LetterContent) => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (draft: LetterContent) => void;
  currentId: string;
  language: Language;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onDuplicateDraft,
  currentId,
  language,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] font-sans-clean animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">{t.saved.title}</h2>
              <p className="text-xs text-stone-400">{t.saved.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of drafts */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          {drafts.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              {t.saved.empty}
            </div>
          ) : (
            drafts.map((draft) => {
              const isCurrent = draft.id === currentId;
              const dateFormatted = new Date(draft.updatedAt || Date.now()).toLocaleDateString(
                language === 'zh' ? 'zh-CN' : 'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              );

              return (
                <div
                  key={draft.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div
                    onClick={() => {
                      onLoadDraft(draft);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase">
                        {draft.letterType || (language === 'zh' ? '辞职信函' : 'Letter')}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          {t.saved.currentBadge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {draft.title || (language === 'zh' ? '未命名辞职信' : 'Untitled Letter')}
                    </h4>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{dateFormatted}</span>
                      {draft.recipient.name && (
                        <span>• {language === 'zh' ? '致：' : 'To: '}{draft.recipient.name}</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateDraft(draft)}
                      title={t.saved.duplicate}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDraft(draft.id)}
                      title={t.saved.delete}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onLoadDraft(draft);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{t.saved.load}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            {t.saved.close}
          </button>
        </div>
      </div>
    </div>
  );
};

