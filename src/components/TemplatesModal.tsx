import React, { useState } from 'react';
import { BookOpen, X, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { LETTER_TEMPLATES } from '../data/templates';
import { LetterTemplate } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LetterTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTemplate, setActiveTemplate] = useState<LetterTemplate>(LETTER_TEMPLATES[0]);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Toxic Workplace & Protection',
    'Burnout & Well-being',
    'Broken Promises & Stagnation',
    'Strictly Neutral & Minimalist',
    'Immediate & Urgent',
    'Diplomatic & Gracious',
  ];

  const filtered = selectedCategory === 'All'
    ? LETTER_TEMPLATES
    : LETTER_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 font-sans-clean">
        {/* Header */}
        <div className="bg-stone-950 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Resignation Scenarios & Archetypes</h2>
              <p className="text-xs text-stone-400">
                Calm, legally protective frameworks designed for difficult departures.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-stone-200 bg-stone-50 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Template Browser */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* List column */}
          <div className="md:col-span-5 border-r border-stone-200 overflow-y-auto p-4 space-y-2 bg-stone-50/50">
            {filtered.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setActiveTemplate(tmpl)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeTemplate.id === tmpl.id
                    ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-400'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {tmpl.tone}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-stone-900 mb-1">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            ))}
          </div>

          {/* Preview column */}
          <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between space-y-4 bg-white">
            <div className="space-y-3">
              <div className="border-b pb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {activeTemplate.category}
                </span>
                <h3 className="text-base font-semibold text-stone-900 mt-0.5">
                  {activeTemplate.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {activeTemplate.description}
                </p>
              </div>

              {/* Ghostwriter safeguards */}
              {activeTemplate.ghostwriterPointers && activeTemplate.ghostwriterPointers.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Ghostwriter Advice for this Scenario:</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-800 space-y-0.5 pl-1 text-[11px]">
                    {activeTemplate.ghostwriterPointers.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample preview */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 space-y-2.5 leading-relaxed font-serif-reading">
                <p className="font-semibold">{activeTemplate.sample.salutation}</p>
                <div className="space-y-2 whitespace-pre-line text-stone-700">
                  {activeTemplate.sample.body}
                </div>
                <p className="font-semibold pt-1">{activeTemplate.sample.closing}</p>
                <p className="italic text-stone-600">{activeTemplate.sample.signoffName}</p>
              </div>
            </div>

            {/* Select Button */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(activeTemplate);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Load This Archetype</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
