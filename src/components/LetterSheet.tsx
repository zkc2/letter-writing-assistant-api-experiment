import React, { useState } from 'react';
import { LetterContent } from '../types';
import {
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Download,
  Sparkles,
  Lock,
} from 'lucide-react';

interface LetterSheetProps {
  letter: LetterContent;
  onChange: (updated: LetterContent) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  isApproved?: boolean;
}

export const LetterSheet: React.FC<LetterSheetProps> = ({
  letter,
  onChange,
  isEditing,
  onToggleEdit,
  isApproved,
}) => {
  const [copied, setCopied] = useState(false);
  const wordCount = letter.body.trim() ? letter.body.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const getStationeryClasses = () => {
    switch (letter.stationery) {
      case 'classic':
        return 'bg-[#fcfaf5] text-[#2c2825] border-amber-900/10 shadow-stone-300/60';
      case 'modern':
        return 'bg-white text-stone-900 border-stone-200 shadow-stone-200';
      case 'executive':
        return 'bg-white text-slate-900 border-slate-300 border-t-8 border-t-slate-800 shadow-slate-200';
      case 'parchment':
        return 'bg-[#f6f1e3] text-[#332a1e] border-[#e2d5bd] shadow-[#e0d4be]';
      case 'minimal':
        return 'bg-white text-stone-800 border-stone-100 shadow-sm';
      default:
        return 'bg-[#fcfaf5] text-[#2c2825] border-amber-900/10 shadow-stone-300/60';
    }
  };

  const getFontFamilyClass = () => {
    switch (letter.fontFamily) {
      case 'serif-reading':
        return 'font-serif-reading';
      case 'serif-classic':
        return 'font-serif-classic';
      case 'display-serif':
        return 'font-display-serif';
      case 'sans-clean':
        return 'font-sans-clean';
      default:
        return 'font-serif-reading';
    }
  };

  const getFontSizeClass = () => {
    switch (letter.fontSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'base':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-lg leading-relaxed';
      default:
        return 'text-base leading-relaxed';
    }
  };

  const updateField = <K extends keyof LetterContent>(field: K, value: LetterContent[K]) => {
    onChange({
      ...letter,
      [field]: value,
      updatedAt: Date.now(),
    });
  };

  const updateSender = (field: string, val: string) => {
    onChange({
      ...letter,
      sender: {
        ...letter.sender,
        [field]: val,
      },
      updatedAt: Date.now(),
    });
  };

  const updateRecipient = (field: string, val: string) => {
    onChange({
      ...letter,
      recipient: {
        ...letter.recipient,
        [field]: val,
      },
      updatedAt: Date.now(),
    });
  };

  const handleCopy = async () => {
    const fullText = [
      letter.date,
      '',
      letter.recipient.name || '',
      letter.recipient.title || '',
      letter.recipient.organization || '',
      letter.recipient.address || '',
      '',
      letter.subject ? `SUBJECT: ${letter.subject}\n` : '',
      letter.salutation,
      '',
      letter.body,
      '',
      letter.closing,
      letter.signoffName,
      letter.sender.title || '',
      letter.postscript ? `\n${letter.postscript}` : '',
    ]
      .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
      .join('\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const fullText = `${letter.title || 'Resignation Letter'}\n${'='.repeat(40)}\n\n` +
      `Date: ${letter.date}\n\n` +
      (letter.recipient.name ? `To: ${letter.recipient.name}\n` : '') +
      (letter.recipient.organization ? `${letter.recipient.organization}\n` : '') +
      (letter.recipient.address ? `${letter.recipient.address}\n\n` : '\n') +
      (letter.subject ? `Subject: ${letter.subject}\n\n` : '') +
      `${letter.salutation}\n\n` +
      `${letter.body}\n\n` +
      `${letter.closing}\n` +
      `${letter.signoffName}\n` +
      (letter.sender.title ? `${letter.sender.title}\n` : '') +
      (letter.postscript ? `\n${letter.postscript}\n` : '');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resignation-letter-${(letter.signoffName || 'notice').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Document Controls Bar */}
      <div className="no-print w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-stone-500 font-sans-clean">
        <div className="flex items-center gap-2">
          {isApproved || letter.isApproved ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Approved by You (Ready to Submit)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Live Ghostwriter Draft</span>
            </span>
          )}
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{wordCount} words</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">~{readingTimeMinutes} min read</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
            title="Copy letter text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
            title="Download text file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            id="toggle-edit-mode"
            onClick={onToggleEdit}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              isEditing
                ? 'bg-amber-600 text-white border border-amber-700 shadow-xs'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Done Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manual Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Physical Letter Sheet */}
      <div
        id="letter-sheet-container"
        className={`print-page w-full min-h-[860px] p-8 sm:p-12 md:p-14 rounded-2xl border shadow-md transition-all duration-200 relative ${getStationeryClasses()} ${getFontFamilyClass()} ${getFontSizeClass()}`}
      >
        {/* Approved Watermark Seal in the corner if approved */}
        {(isApproved || letter.isApproved) && (
          <div className="no-print absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold tracking-tight shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VERIFIED & APPROVED</span>
          </div>
        )}

        {/* Letterhead / Sender Details */}
        <div className="mb-8 pb-6 border-b border-stone-300/40">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1 w-full max-w-md">
              {isEditing ? (
                <div className="space-y-1 w-full">
                  <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Your Information:</label>
                  <input
                    type="text"
                    value={letter.sender.name}
                    onChange={(e) => updateSender('name', e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full font-semibold text-lg text-stone-900 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={letter.sender.title}
                    onChange={(e) => updateSender('title', e.target.value)}
                    placeholder="Your Job Title"
                    className="w-full text-xs text-stone-600 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={letter.sender.contact}
                    onChange={(e) => updateSender('contact', e.target.value)}
                    placeholder="Personal Email • Personal Phone (optional)"
                    className="w-full text-xs text-stone-500 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              ) : (
                <>
                  <h2 className="font-semibold text-xl tracking-tight text-stone-900">
                    {letter.sender.name || letter.signoffName || (letter.body ? 'Your Name' : '')}
                  </h2>
                  {letter.sender.title && (
                    <p className="text-xs text-stone-600 uppercase tracking-wider font-sans-clean">
                      {letter.sender.title}
                    </p>
                  )}
                  {letter.sender.contact && (
                    <p className="text-xs text-stone-500 font-sans-clean">
                      {letter.sender.contact}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Date Display */}
            <div className="self-start sm:text-right">
              {isEditing ? (
                <div>
                  <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Date:</label>
                  <input
                    type="text"
                    value={letter.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    placeholder="Date"
                    className="text-xs text-stone-700 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              ) : (
                <time className="text-xs text-stone-600 font-sans-clean block font-medium">
                  {letter.date}
                </time>
              )}
            </div>
          </div>
        </div>

        {/* Supervisor / Recipient Address Block */}
        <div className="mb-6 text-xs sm:text-sm text-stone-700 font-sans-clean space-y-1">
          {isEditing ? (
            <div className="space-y-1 max-w-sm">
              <label className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                Supervisor / Recipient Details:
              </label>
              <input
                type="text"
                value={letter.recipient.name}
                onChange={(e) => updateRecipient('name', e.target.value)}
                placeholder="Supervisor Name"
                className="w-full text-xs text-stone-800 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={letter.recipient.title}
                onChange={(e) => updateRecipient('title', e.target.value)}
                placeholder="Supervisor Title"
                className="w-full text-xs text-stone-800 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={letter.recipient.organization}
                onChange={(e) => updateRecipient('organization', e.target.value)}
                placeholder="Company Name (e.g. Acme Corporation)"
                className="w-full text-xs text-stone-800 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={letter.recipient.address}
                onChange={(e) => updateRecipient('address', e.target.value)}
                placeholder="Office Address (optional)"
                className="w-full text-xs text-stone-800 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          ) : (
            <>
              {letter.recipient.name && (
                <p className="font-semibold text-stone-900">{letter.recipient.name}</p>
              )}
              {letter.recipient.title && <p>{letter.recipient.title}</p>}
              {letter.recipient.organization && (
                <p className="font-medium text-stone-800">{letter.recipient.organization}</p>
              )}
              {letter.recipient.address && (
                <p className="whitespace-pre-line text-stone-500">{letter.recipient.address}</p>
              )}
            </>
          )}
        </div>

        {/* Subject Line */}
        <div className="mb-6">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase">Subject:</span>
              <input
                type="text"
                value={letter.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Notice of Resignation — [Your Name]"
                className="w-full text-sm font-semibold text-stone-900 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          ) : (
            letter.subject && (
              <p className="font-semibold text-stone-900 tracking-wide text-xs sm:text-sm uppercase font-sans-clean">
                Subject: {letter.subject}
              </p>
            )
          )}
        </div>

        {/* Salutation */}
        <div className="mb-5">
          {isEditing ? (
            <input
              type="text"
              value={letter.salutation}
              onChange={(e) => updateField('salutation', e.target.value)}
              placeholder="Dear [Supervisor Name],"
              className="w-full font-medium text-stone-900 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          ) : (
            letter.body ? (
              <p className="font-medium text-stone-900">{letter.salutation || 'Dear Supervisor,'}</p>
            ) : null
          )}
        </div>

        {/* Letter Body */}
        <div className="mb-8 space-y-4">
          {isEditing ? (
            <div className="space-y-1">
              <textarea
                value={letter.body}
                onChange={(e) => updateField('body', e.target.value)}
                rows={12}
                placeholder="The formal resignation letter paragraphs will appear here. Separate paragraphs with double line breaks."
                className="w-full p-3 bg-amber-50/40 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-inherit leading-relaxed resize-y"
              />
              <p className="text-[11px] text-stone-400 font-sans-clean">
                Tip: The Resignation Ghostwriter automatically formats your feelings into professional language.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-stone-800 leading-relaxed whitespace-pre-line text-left">
              {letter.body ? (
                letter.body.split('\n\n').map((para, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl">
                  <p className="text-stone-400 italic mb-2">
                    Your resignation letter draft is empty right now.
                  </p>
                  <p className="text-xs text-stone-500">
                    Tell the Resignation Ghostwriter on the left about your situation to generate your tailored letter.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Closing & Sign-off Block */}
        <div className="mt-8 space-y-2">
          {isEditing ? (
            <div className="max-w-xs space-y-1.5">
              <input
                type="text"
                value={letter.closing}
                onChange={(e) => updateField('closing', e.target.value)}
                placeholder="Sincerely,"
                className="w-full text-stone-900 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={letter.signoffName}
                onChange={(e) => updateField('signoffName', e.target.value)}
                placeholder="Your Full Name"
                className="w-full font-medium text-stone-900 bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          ) : (
            letter.body ? (
              <>
                <p className="text-stone-800">{letter.closing || 'Sincerely,'}</p>

                {/* Classic signature styling */}
                <div className="py-2">
                  <span className="font-serif-reading italic text-xl text-stone-700 select-none">
                    {letter.signoffName || letter.sender.name || 'Your Signature'}
                  </span>
                </div>

                <p className="font-medium text-stone-900">
                  {letter.signoffName || letter.sender.name || 'Your Name'}
                </p>
                {letter.sender.title && (
                  <p className="text-xs text-stone-500 font-sans-clean">
                    {letter.sender.title}
                  </p>
                )}
              </>
            ) : null
          )}
        </div>

        {/* Postscript (P.S.) if any */}
        {(letter.postscript || isEditing) && (
          <div className="mt-8 pt-4 border-t border-stone-200/50 text-xs text-stone-600">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-500">P.S.</span>
                <input
                  type="text"
                  value={letter.postscript}
                  onChange={(e) => updateField('postscript', e.target.value)}
                  placeholder="Optional note (e.g. personal contact for remaining friends)"
                  className="w-full bg-amber-50/50 border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            ) : (
              letter.postscript && <p className="italic">{letter.postscript}</p>
            )}
          </div>
        )}

        {/* Ghostwriter Protection Highlights Card */}
        {letter.advice && letter.advice.length > 0 && !isEditing && (
          <div className="no-print mt-10 p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 font-sans-clean space-y-1.5">
            <span className="font-semibold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Ghostwriter Professional Safeguards:
            </span>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1">
              {letter.advice.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
