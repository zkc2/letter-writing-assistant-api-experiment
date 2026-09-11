import React from 'react';
import { LetterContent, StationeryStyle, LetterFont, LetterFontSize, Language } from '../types';
import { Type, Palette } from 'lucide-react';
import { getTranslation } from '../i18n';

interface StationeryBarProps {
  letter: LetterContent;
  onChange: (updated: LetterContent) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  language: Language;
}

export const StationeryBar: React.FC<StationeryBarProps> = ({
  letter,
  onChange,
  isEditing,
  onToggleEdit,
  language,
}) => {
  const t = getTranslation(language);

  const setStationery = (style: StationeryStyle) => {
    onChange({ ...letter, stationery: style, updatedAt: Date.now() });
  };

  const setFont = (font: LetterFont) => {
    onChange({ ...letter, fontFamily: font, updatedAt: Date.now() });
  };

  const setSize = (size: LetterFontSize) => {
    onChange({ ...letter, fontSize: size, updatedAt: Date.now() });
  };

  const getStyleLabel = (id: string, fallback: string) =>
    t.stationery.styles.find((s) => s.id === id)?.label || fallback;
  const getFontLabel = (id: string, fallback: string) =>
    t.stationery.fonts.find((f) => f.id === id)?.label || fallback;
  const getSizeLabel = (id: string, fallback: string) =>
    t.stationery.sizes.find((s) => s.id === id)?.label || fallback;

  const stationeryStyles: { id: StationeryStyle; label: string; bgClass: string }[] = [
    { id: 'classic', label: getStyleLabel('classic', 'Classic Ivory'), bgClass: 'bg-[#fcfaf5] border-amber-900/20' },
    { id: 'modern', label: getStyleLabel('modern', 'Modern Crisp'), bgClass: 'bg-white border-stone-300' },
    { id: 'executive', label: getStyleLabel('executive', 'Executive Slate'), bgClass: 'bg-white border-t-2 border-slate-900 border-stone-300' },
    { id: 'parchment', label: getStyleLabel('parchment', 'Fine Laid Parchment'), bgClass: 'bg-[#f6f1e3] border-[#e2d5bd]' },
    { id: 'minimal', label: getStyleLabel('minimal', 'Minimalist Flat'), bgClass: 'bg-stone-50 border-stone-200' },
  ];

  const fontOptions: { id: LetterFont; label: string; previewClass: string }[] = [
    { id: 'serif-reading', label: getFontLabel('reading', 'Serif Reading'), previewClass: 'font-serif-reading' },
    { id: 'serif-classic', label: getFontLabel('classic', 'Classic Serif'), previewClass: 'font-serif-classic' },
    { id: 'display-serif', label: getFontLabel('formal', 'Formal Display'), previewClass: 'font-display-serif' },
    { id: 'sans-clean', label: getFontLabel('clean', 'Clean Sans'), previewClass: 'font-sans-clean' },
  ];

  const sizeOptions: { id: LetterFontSize; label: string }[] = [
    { id: 'sm', label: getSizeLabel('sm', 'Compact') },
    { id: 'base', label: getSizeLabel('base', 'Standard') },
    { id: 'lg', label: getSizeLabel('lg', 'Large') },
  ];

  return (
    <aside aria-label={t.stationery.paperStyle} className="no-print w-full max-w-4xl mx-auto mb-6 bg-white/95 backdrop-blur-xs border border-stone-200/90 rounded-2xl shadow-sm p-3 font-sans-clean">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Paper style */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px] flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            {t.stationery.paperStyle}:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {stationeryStyles.map((st) => (
              <button
                key={st.id}
                onClick={() => setStationery(st.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  letter.stationery === st.id
                    ? 'border-amber-600 bg-amber-50 text-amber-950 ring-1 ring-amber-500/50'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full border ${st.bgClass}`} />
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px] flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-amber-600" />
            {t.stationery.fontStyle}:
          </span>
          <div className="flex items-center gap-1">
            {fontOptions.map((fn) => (
              <button
                key={fn.id}
                onClick={() => setFont(fn.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  letter.fontFamily === fn.id
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                } ${fn.previewClass}`}
              >
                {fn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
            {t.stationery.sizeStyle}:
          </span>
          <div className="flex items-center bg-stone-100 p-0.5 rounded-md">
            {sizeOptions.map((sz) => (
              <button
                key={sz.id}
                onClick={() => setSize(sz.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  letter.fontSize === sz.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

