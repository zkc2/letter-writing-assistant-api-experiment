import React from 'react';
import { LetterContent, StationeryStyle, LetterFont, LetterFontSize } from '../types';
import { Type, Palette, Sliders, Edit3, Check } from 'lucide-react';

interface StationeryBarProps {
  letter: LetterContent;
  onChange: (updated: LetterContent) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const STATIONERY_STYLES: { id: StationeryStyle; label: string; bgClass: string }[] = [
  { id: 'classic', label: 'Classic Linen', bgClass: 'bg-[#fcfaf5] border-amber-900/20' },
  { id: 'modern', label: 'Crisp White', bgClass: 'bg-white border-stone-300' },
  { id: 'executive', label: 'Executive', bgClass: 'bg-white border-t-2 border-slate-900 border-stone-300' },
  { id: 'parchment', label: 'Parchment', bgClass: 'bg-[#f6f1e3] border-[#e2d5bd]' },
  { id: 'minimal', label: 'Minimal', bgClass: 'bg-stone-50 border-stone-200' },
];

const FONTS: { id: LetterFont; label: string; previewClass: string }[] = [
  { id: 'serif-reading', label: 'Newsreader', previewClass: 'font-serif-reading' },
  { id: 'serif-classic', label: 'Lora Classic', previewClass: 'font-serif-classic' },
  { id: 'display-serif', label: 'Cinzel Formal', previewClass: 'font-display-serif' },
  { id: 'sans-clean', label: 'Jakarta Sans', previewClass: 'font-sans-clean' },
];

const SIZES: { id: LetterFontSize; label: string }[] = [
  { id: 'sm', label: 'Compact' },
  { id: 'base', label: 'Normal' },
  { id: 'lg', label: 'Spacious' },
];

export const StationeryBar: React.FC<StationeryBarProps> = ({
  letter,
  onChange,
  isEditing,
  onToggleEdit,
}) => {
  const setStationery = (style: StationeryStyle) => {
    onChange({ ...letter, stationery: style, updatedAt: Date.now() });
  };

  const setFont = (font: LetterFont) => {
    onChange({ ...letter, fontFamily: font, updatedAt: Date.now() });
  };

  const setSize = (size: LetterFontSize) => {
    onChange({ ...letter, fontSize: size, updatedAt: Date.now() });
  };

  return (
    <aside aria-label="Stationery and formatting toolbar" className="no-print w-full max-w-4xl mx-auto mb-6 bg-white/95 backdrop-blur-xs border border-stone-200/90 rounded-2xl shadow-sm p-3 font-sans-clean">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Paper style */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px] flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            Stationery:
          </span>
          <div className="flex items-center gap-1.5">
            {STATIONERY_STYLES.map((st) => (
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
            Font:
          </span>
          <div className="flex items-center gap-1">
            {FONTS.map((fn) => (
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
            Size:
          </span>
          <div className="flex items-center bg-stone-100 p-0.5 rounded-md">
            {SIZES.map((sz) => (
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
