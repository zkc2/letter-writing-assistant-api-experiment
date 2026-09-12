import { LetterContent, Language } from '../types';

export interface ExtractedLetterParts {
  body: string;
  extractedSalutation?: string;
  extractedClosing?: string;
  extractedSignoffName?: string;
  extractedSenderTitle?: string;
  extractedSubject?: string;
}

export interface NormalizationContext {
  salutation?: string;
  closing?: string;
  signoffName?: string;
  senderName?: string;
  senderTitle?: string;
  recipientName?: string;
  recipientOrg?: string;
  subject?: string;
  date?: string;
}

const COMMON_SALUTATION_PATTERNS = [
  /^dear\s+[^,\n:]+[,\n:]/i,
  /^to\s+(whom\s+it\s+may\s+concern|the\s+management|the\s+team|management)[,\n:]/i,
  /^hello\s+[^,\n:]+[,\n:]/i,
  /^hi\s+[^,\n:]+[,\n:]/i,
  /^尊敬的[^：:\n]+[：:]/i,
  /^致[：:][^：:\n]+[：:]?/i,
  /^(各位领导|公司领导|主管领导|部门领导)[：:]/i,
  /^您好[！!，,：:]?/i,
];

const COMMON_CLOSING_PATTERNS = [
  /^(sincerely|sincerely\s+yours|yours\s+sincerely)[,.]?/i,
  /^(warm\s+regards|best\s+regards|warmest\s+regards|kind\s+regards|regards)[,.]?/i,
  /^(respectfully|respectfully\s+yours|yours\s+respectfully)[,.]?/i,
  /^(yours\s+faithfully|yours\s+truly)[,.]?/i,
  /^(with\s+appreciation|with\s+gratitude|with\s+warm\s+regards|with\s+thanks)[,.]?/i,
  /^(thank\s+you|thanks\s+and\s+regards|many\s+thanks)[,.]?/i,
  /^(cordially)[,.]?/i,
  /^(此致\s*敬礼|此致\s*，?\s*敬礼|此致|敬礼|顺祝商祺|谨致问候|谨此致礼|深表谢意)[!！。.]?/i,
];

const PLACEHOLDER_NAME_PATTERNS = [
  /^\[?(your\s+name|applicant\s+name|employee\s+name|sender\s+name)\]?$/i,
  /^\[?(您的姓名|你的姓名|申请人姓名|员工姓名|本人姓名|申请人|签名|署名)\]?$/i,
  /^(申请人|辞职人|报告人|员工|签名|署名)\s*[:：]\s*.+$/i,
];

const PLACEHOLDER_TITLE_PATTERNS = [
  /^\[?(your\s+title|your\s+job\s+title|job\s+title|position)\]?$/i,
  /^\[?(您的职位|你的职位|职位|职务|岗位)\]?$/i,
];

const HEADER_META_PATTERNS = [
  /^(date|日期)\s*[:：].*$/i,
  /^(subject|事由|re|主题)\s*[:：].*$/i,
  /^(to|收件人|致)\s*[:：].*$/i,
  /^(from|发件人)\s*[:：].*$/i,
];

/**
 * Ensures the subject label has exactly one colon (no double colons like "SUBJECT::").
 * Does not append a colon if the translated label already contains one.
 */
export function formatSubjectLabel(label: string): string {
  const trimmed = (label || '').trim();
  if (!trimmed) return '';
  if (trimmed.endsWith(':') || trimmed.endsWith('：')) {
    return trimmed;
  }
  return `${trimmed}:`;
}

/**
 * Strips any redundant "Subject:" or "事由：" prefixes from the subject text.
 */
export function cleanSubjectText(subject?: string): string {
  if (!subject) return '';
  return subject.trim().replace(/^(subject|事由|re|主题)\s*[:：]\s*/i, '').trim();
}

/**
 * Formats a subject heading with a single colon and cleaned subject text.
 * e.g. "SUBJECT: Notice of Resignation" or "事由：正式辞职通知书"
 */
export function formatSubjectHeading(label: string, subject?: string): string {
  const cleanSubject = cleanSubjectText(subject);
  if (!cleanSubject) return '';
  const formattedLabel = formatSubjectLabel(label);
  const separator = formattedLabel.endsWith('：') ? '' : ' ';
  return `${formattedLabel}${separator}${cleanSubject}`;
}

/**
 * Unescapes literal escaped line-break sequences (e.g. "\\r\\n", "\\n", "\\r") into real newlines
 * while preserving existing real newline characters.
 */
export function unescapeNewlines(text?: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * Normalizes raw body text to remove duplicate embedded salutations,
 * closings, signoff names, sender titles, dates, or subject headers.
 */
export function normalizeLetterBody(
  rawBody: string,
  context: NormalizationContext = {}
): ExtractedLetterParts {
  if (!rawBody || typeof rawBody !== 'string') {
    return { body: '' };
  }

  // 0. Convert literal escaped newline sequences into real line breaks while preserving existing real newlines
  const sanitized = unescapeNewlines(rawBody);

  // Split into lines preserving text content
  const rawLines = sanitized.split('\n').map((l) => l.trimEnd());
  const lines = [...rawLines];

  let extractedSalutation = context.salutation?.trim();
  let extractedClosing = context.closing?.trim();
  let extractedSignoffName = context.signoffName?.trim();
  let extractedSenderTitle = context.senderTitle?.trim();
  let extractedSubject = context.subject?.trim();

  // 1. Clean from the TOP: dates, recipient headers, subject line, and salutations
  while (lines.length > 0) {
    const line = (lines[0] || '').trim();

    // Empty line at top
    if (line === '') {
      lines.shift();
      continue;
    }

    // Header metadata (e.g., Date: ..., Subject: ..., To: ...)
    if (HEADER_META_PATTERNS.some((pat) => pat.test(line))) {
      if (/^(subject|事由|re|主题)\s*[:：]/i.test(line) && !extractedSubject) {
        extractedSubject = cleanSubjectText(line);
      }
      lines.shift();
      continue;
    }

    // Exact match with known recipient name or organization
    if (
      (context.recipientName && line.toLowerCase() === context.recipientName.trim().toLowerCase()) ||
      (context.recipientOrg && line.toLowerCase() === context.recipientOrg.trim().toLowerCase())
    ) {
      lines.shift();
      continue;
    }

    // Salutation match
    const isSalutation =
      COMMON_SALUTATION_PATTERNS.some((pat) => pat.test(line)) ||
      (context.salutation && line.toLowerCase() === context.salutation.trim().toLowerCase()) ||
      (context.recipientName && new RegExp(`^dear\\s+${escapeRegex(context.recipientName)}[,:\n]?`, 'i').test(line)) ||
      (context.recipientName && new RegExp(`^尊敬的\\s*${escapeRegex(context.recipientName)}[：:]?`, 'i').test(line));

    if (isSalutation) {
      if (!extractedSalutation || extractedSalutation === 'Dear Supervisor,' || extractedSalutation === '尊敬的领导：') {
        extractedSalutation = line;
      }
      lines.shift();

      // In Chinese, "尊敬的主管：" might be followed on next line by "您好！"
      if (lines.length > 0 && /^您好[！!，,：:]?$/i.test(lines[0].trim())) {
        lines.shift();
      }
      continue;
    }

    // If none matched, top headers/salutations are done
    break;
  }

  // 2. Clean from the BOTTOM: trailing signoff names, titles, closings
  while (lines.length > 0) {
    const line = (lines[lines.length - 1] || '').trim();

    // Empty line at bottom
    if (line === '') {
      lines.pop();
      continue;
    }

    // Match sender title (e.g. "Senior Product Designer" or "[Your Title]")
    const isSenderTitle =
      (context.senderTitle && line.toLowerCase() === context.senderTitle.trim().toLowerCase()) ||
      PLACEHOLDER_TITLE_PATTERNS.some((pat) => pat.test(line));

    if (isSenderTitle) {
      if (!extractedSenderTitle) {
        extractedSenderTitle = line.replace(/^\[|\]$/g, '').trim();
      }
      lines.pop();
      continue;
    }

    // Match signoff name (e.g. "Jordan Lee", "[Your Name]", "李华")
    const isSignoffName =
      (context.signoffName && line.toLowerCase() === context.signoffName.trim().toLowerCase()) ||
      (context.senderName && line.toLowerCase() === context.senderName.trim().toLowerCase()) ||
      PLACEHOLDER_NAME_PATTERNS.some((pat) => pat.test(line));

    if (isSignoffName) {
      if (!extractedSignoffName) {
        extractedSignoffName = line.replace(/^(申请人|辞职人|报告人|员工|签名|署名)\s*[:：]\s*/i, '').replace(/^\[|\]$/g, '').trim();
      }
      lines.pop();
      continue;
    }

    // Check for inline closing with name (e.g. "Sincerely, Jordan Lee")
    const inlineMatch = line.match(/^(sincerely|warm\s+regards|best\s+regards|regards|respectfully)[,.\s]+([^\n]+)$/i);
    if (inlineMatch) {
      if (!extractedClosing) extractedClosing = `${inlineMatch[1]},`;
      if (!extractedSignoffName && inlineMatch[2]) extractedSignoffName = inlineMatch[2].trim();
      lines.pop();
      continue;
    }

    // Match closing phrase (e.g. "Sincerely,", "此致", "敬礼", "此致 敬礼")
    const isClosing =
      COMMON_CLOSING_PATTERNS.some((pat) => pat.test(line)) ||
      (context.closing && line.toLowerCase() === context.closing.trim().toLowerCase());

    if (isClosing) {
      if (!extractedClosing || extractedClosing === 'Sincerely,' || extractedClosing === '此致\n敬礼') {
        extractedClosing = line;
      }
      lines.pop();

      // If this was "敬礼", check if preceding line was "此致"
      if (lines.length > 0 && /^此致[，,]?$/i.test(lines[lines.length - 1].trim())) {
        lines.pop();
        extractedClosing = '此致\n敬礼';
      }
      continue;
    }

    // If none matched, bottom closing/signoff is done
    break;
  }

  // Clean and group remaining lines into paragraphs
  const cleanedText = lines.join('\n').trim();
  // Normalize consecutive line breaks into paragraphs
  const paragraphs = cleanedText
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const finalBody = paragraphs.join('\n\n');

  return {
    body: finalBody,
    extractedSalutation,
    extractedClosing,
    extractedSignoffName,
    extractedSenderTitle,
    extractedSubject,
  };
}

/**
 * Normalizes a complete LetterContent object so:
 * 1. body contains only the core body paragraphs
 * 2. salutation, closing, signoffName, senderTitle are correctly assigned
 * 3. subject is cleaned of redundant prefixes
 * 4. duplicate embedded structures are removed
 */
export function normalizeLetter(letter: LetterContent, language: Language = 'en'): LetterContent {
  const context: NormalizationContext = {
    salutation: unescapeNewlines(letter.salutation),
    closing: unescapeNewlines(letter.closing),
    signoffName: letter.signoffName,
    senderName: letter.sender?.name,
    senderTitle: letter.sender?.title,
    recipientName: letter.recipient?.name,
    recipientOrg: letter.recipient?.organization,
    subject: letter.subject,
    date: letter.date,
  };

  const {
    body: cleanBody,
    extractedSalutation,
    extractedClosing,
    extractedSignoffName,
    extractedSenderTitle,
    extractedSubject,
  } = normalizeLetterBody(letter.body, context);

  const cleanSubject = cleanSubjectText(letter.subject || extractedSubject);

  const salutation = unescapeNewlines(
    letter.salutation ||
    extractedSalutation ||
    (language === 'zh' ? '尊敬的领导：' : 'Dear Supervisor,')
  ).trim();

  const closing = unescapeNewlines(
    letter.closing ||
    extractedClosing ||
    (language === 'zh' ? '此致\n敬礼' : 'Sincerely,')
  ).trim();

  const signoffName = (
    letter.signoffName ||
    extractedSignoffName ||
    letter.sender?.name ||
    ''
  ).trim();

  const senderTitle = (
    letter.sender?.title ||
    extractedSenderTitle ||
    ''
  ).trim();

  const postscript = unescapeNewlines(letter.postscript || '').trim();

  return {
    ...letter,
    subject: cleanSubject,
    salutation,
    body: cleanBody,
    closing,
    signoffName,
    postscript,
    sender: {
      ...letter.sender,
      name: letter.sender?.name || signoffName,
      title: senderTitle,
    },
  };
}

/**
 * Generates identical normalized plain text for Copy, Download, and external use.
 * Ensures document date, sender, recipient, subject, salutation, body paragraphs,
 * closing, signoff name, and sender title appear EXACTLY ONCE.
 */
export function getNormalizedLetterExportText(
  letter: LetterContent,
  language: Language,
  format: 'copy' | 'download' = 'copy'
): string {
  const norm = normalizeLetter(letter, language);

  const subjectHeading = norm.subject
    ? formatSubjectHeading(language === 'zh' ? '事由：' : 'SUBJECT:', norm.subject)
    : '';

  const recipientBlock = [
    norm.recipient.name,
    norm.recipient.title,
    norm.recipient.organization,
    norm.recipient.address,
  ]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join('\n');

  const senderBlock = [
    norm.sender.name,
    norm.sender.title,
    norm.sender.organization,
    norm.sender.contact,
  ]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join('\n');

  const closingBlock = [
    norm.closing || (language === 'zh' ? '此致\n敬礼' : 'Sincerely,'),
    norm.signoffName || norm.sender.name || (language === 'zh' ? '您的姓名' : 'Your Name'),
    norm.sender.title || '',
  ]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join('\n');

  if (format === 'download') {
    const title = norm.title || (language === 'zh' ? '正式辞职信' : 'Resignation Letter');
    const headerDateLabel = language === 'zh' ? '日期：' : 'Date: ';
    const toLabel = language === 'zh' ? '收件人：\n' : 'To:\n';

    return [
      `${title}\n${'='.repeat(40)}`,
      `${headerDateLabel}${norm.date}`,
      recipientBlock ? `${toLabel}${recipientBlock}` : '',
      subjectHeading,
      norm.salutation || (language === 'zh' ? '尊敬的领导：' : 'Dear Supervisor,'),
      norm.body,
      closingBlock,
      norm.postscript ? `P.S. ${norm.postscript}` : '',
    ]
      .filter((section) => Boolean(section && section.trim()))
      .join('\n\n');
  }

  // Copy format: clean formal letter text
  return [
    norm.date,
    recipientBlock,
    subjectHeading,
    norm.salutation || (language === 'zh' ? '尊敬的领导：' : 'Dear Supervisor,'),
    norm.body,
    closingBlock,
    norm.postscript ? `P.S. ${norm.postscript}` : '',
  ]
    .filter((section) => Boolean(section && section.trim()))
    .join('\n\n');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escapes characters for HTML injection.
 */
export function escapeHtml(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const PRINT_BLOCKED_MESSAGE_EN = 'Printing was blocked. Please allow pop-ups and try again.';
export const PRINT_BLOCKED_MESSAGE_ZH = '打印窗口被拦截，请允许弹出窗口后重试。';

export function getPrintBlockedMessage(language: Language = 'en'): string {
  return language === 'zh' ? PRINT_BLOCKED_MESSAGE_ZH : PRINT_BLOCKED_MESSAGE_EN;
}

export function getPrintFontFamily(fontFamily?: string): string {
  switch (fontFamily) {
    case 'serif-reading':
      return "'Newsreader', 'Noto Serif SC', 'Lora', Georgia, serif";
    case 'serif-classic':
      return "'Lora', 'Noto Serif SC', Georgia, serif";
    case 'display-serif':
      return "'Cinzel', 'Noto Serif SC', Georgia, serif";
    case 'sans-clean':
      return "'Plus Jakarta Sans', 'Noto Sans SC', system-ui, -apple-system, sans-serif";
    default:
      return "'Newsreader', 'Noto Serif SC', 'Lora', Georgia, serif";
  }
}

export function getPrintFontSize(fontSize?: string): { size: string; lineHeight: string } {
  switch (fontSize) {
    case 'sm':
      return { size: '14px', lineHeight: '1.6' };
    case 'base':
      return { size: '16px', lineHeight: '1.7' };
    case 'lg':
      return { size: '18px', lineHeight: '1.75' };
    default:
      return { size: '16px', lineHeight: '1.7' };
  }
}

/**
 * Generates clean, standalone printable HTML containing only the normalized letter
 * and necessary typographic styling, matching the live LetterSheet.
 */
export function generatePrintableLetterHtml(
  letter: LetterContent,
  language: Language = 'en'
): string {
  const norm = normalizeLetter(letter, language);

  const displaySenderName =
    letter.sender?.name ||
    norm.signoffName ||
    (norm.body ? (language === 'zh' ? '您的姓名' : 'Your Name') : '');

  const displaySenderTitle =
    letter.sender?.title ||
    norm.sender?.title ||
    '';

  const displaySalutation =
    norm.salutation ||
    (language === 'zh' ? '尊敬的主管：' : 'Dear Supervisor,');

  const displayClosing =
    norm.closing ||
    (language === 'zh' ? '此致\n敬礼' : 'Sincerely,');

  const displaySignoffName =
    norm.signoffName ||
    displaySenderName;

  const subjectLabel = language === 'zh' ? '事由：' : 'Subject:';
  const subjectHeading = norm.subject
    ? formatSubjectHeading(subjectLabel, norm.subject)
    : '';

  const paragraphs = norm.body
    ? norm.body.split('\n\n').map((p) => p.trim()).filter(Boolean)
    : [];

  const fontFamily = getPrintFontFamily(norm.fontFamily);
  const fontSize = getPrintFontSize(norm.fontSize);
  const documentTitle = norm.title || (language === 'zh' ? '正式辞职信' : 'Notice of Resignation');

  const printButtonLabel = language === 'zh' ? '打印 / 导出 PDF' : 'Print / Save as PDF';
  const closeButtonLabel = language === 'zh' ? '关闭窗口' : 'Close Window';

  return `<!DOCTYPE html>
<html lang="${language === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(documentTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    @page {
      margin: 20mm;
      size: letter portrait;
    }
    body {
      margin: 0;
      padding: 40px 24px;
      background-color: #f5f5f4;
      color: #1c1917;
      font-family: ${fontFamily};
      font-size: ${fontSize.size};
      line-height: ${fontSize.lineHeight};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .print-wrapper {
      max-width: 720px;
      margin: 0 auto;
      background: #ffffff;
      padding: 56px 48px;
      border-radius: 8px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
      border: 1px solid #e7e5e4;
    }
    .no-print-toolbar {
      max-width: 720px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
    }
    .btn-action {
      background: #1c1917;
      color: #ffffff;
      border: 1px solid #1c1917;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }
    .btn-action:hover {
      background: #292524;
    }
    .btn-secondary {
      background: #ffffff;
      color: #44403c;
      border: 1px solid #d6d3d1;
    }
    .btn-secondary:hover {
      background: #f5f5f4;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0eeee;
    }
    .sender-info {
      flex: 1;
    }
    .sender-name {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #0c0a09;
      margin: 0 0 4px 0;
    }
    .sender-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #57534e;
      margin: 0 0 4px 0;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
    }
    .sender-contact {
      font-size: 12px;
      color: #78716c;
      margin: 0;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
    }
    .doc-date {
      font-size: 13px;
      font-weight: 500;
      color: #44403c;
      text-align: right;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
      white-space: nowrap;
      margin-left: 20px;
    }
    .recipient-block {
      margin-bottom: 24px;
      font-size: 13px;
      line-height: 1.5;
      color: #44403c;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
    }
    .recipient-name {
      font-weight: 600;
      color: #0c0a09;
    }
    .subject-line {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: #0c0a09;
      margin: 0 0 24px 0;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
    }
    .salutation {
      font-weight: 500;
      color: #0c0a09;
      margin: 0 0 20px 0;
    }
    .body-section {
      margin-bottom: 32px;
    }
    .body-section p {
      margin: 0 0 18px 0;
      text-align: left;
    }
    .closing-section {
      margin-top: 32px;
    }
    .closing-phrase {
      margin: 0 0 24px 0;
      white-space: pre-line;
      color: #1c1917;
    }
    .signoff-name {
      font-size: 16px;
      font-weight: 600;
      color: #0c0a09;
      margin: 0 0 2px 0;
    }
    .signoff-title {
      font-size: 12px;
      color: #78716c;
      margin: 0;
      font-family: 'Plus Jakarta Sans', 'Noto Sans SC', system-ui, sans-serif;
    }
    .postscript {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #e7e5e4;
      font-size: 13px;
      font-style: italic;
      color: #57534e;
    }
    @media print {
      body {
        padding: 0 !important;
        background: transparent !important;
      }
      .no-print-toolbar {
        display: none !important;
      }
      .print-wrapper {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-toolbar">
    <button class="btn-action btn-secondary" onclick="window.close()">${escapeHtml(closeButtonLabel)}</button>
    <button class="btn-action" onclick="window.print()">${escapeHtml(printButtonLabel)}</button>
  </div>
  <div class="print-wrapper">
    <div class="header-row">
      <div class="sender-info">
        ${displaySenderName ? `<h1 class="sender-name">${escapeHtml(displaySenderName)}</h1>` : ''}
        ${displaySenderTitle ? `<div class="sender-title">${escapeHtml(displaySenderTitle)}</div>` : ''}
        ${norm.sender?.contact ? `<div class="sender-contact">${escapeHtml(norm.sender.contact)}</div>` : ''}
      </div>
      <div class="doc-date">
        ${escapeHtml(norm.date)}
      </div>
    </div>

    ${(norm.recipient?.name || norm.recipient?.title || norm.recipient?.organization || norm.recipient?.address) ? `
    <div class="recipient-block">
      ${norm.recipient?.name ? `<div class="recipient-name">${escapeHtml(norm.recipient.name)}</div>` : ''}
      ${norm.recipient?.title ? `<div>${escapeHtml(norm.recipient.title)}</div>` : ''}
      ${norm.recipient?.organization ? `<div>${escapeHtml(norm.recipient.organization)}</div>` : ''}
      ${norm.recipient?.address ? `<div>${escapeHtml(norm.recipient.address)}</div>` : ''}
    </div>
    ` : ''}

    ${subjectHeading ? `<div class="subject-line">${escapeHtml(subjectHeading)}</div>` : ''}

    ${norm.body ? `<div class="salutation">${escapeHtml(displaySalutation)}</div>` : ''}

    <div class="body-section">
      ${paragraphs.length > 0
        ? paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n      ')
        : '<p style="color: #a8a29e; font-style: italic;">[Draft empty]</p>'}
    </div>

    ${norm.body ? `
    <div class="closing-section">
      <div class="closing-phrase">${escapeHtml(displayClosing)}</div>
      <div class="signoff-name">${escapeHtml(displaySignoffName)}</div>
      ${displaySenderTitle ? `<div class="signoff-title">${escapeHtml(displaySenderTitle)}</div>` : ''}
    </div>
    ` : ''}

    ${norm.postscript ? `<div class="postscript">P.S. ${escapeHtml(norm.postscript)}</div>` : ''}
  </div>
</body>
</html>`;
}

/**
 * Synchronously opens a dedicated printable window before any asynchronous operations,
 * writes the complete printable letter HTML and CSS into it, waits for readiness,
 * and calls focus() and print().
 *
 * If popup is blocked by the browser, invokes the onBlocked callback with the bilingual error message.
 */
export function printLetterDocument(
  letter: LetterContent,
  language: Language = 'en',
  onBlocked?: (msg: string) => void
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // 1. Synchronously call window.open before ANY await, timeout, or asynchronous dispatch
  let printWindow: Window | null = null;
  try {
    printWindow = window.open('', '_blank');
  } catch (err) {
    console.error('window.open call failed:', err);
    printWindow = null;
  }

  // 2. Fallback check if popup was blocked
  if (!printWindow || printWindow.closed || typeof printWindow.document === 'undefined') {
    const errorMsg = getPrintBlockedMessage(language);
    if (onBlocked) {
      onBlocked(errorMsg);
    }
    return false;
  }

  try {
    // 3. Write complete printable HTML and CSS
    const html = generatePrintableLetterHtml(letter, language);
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // 4. Focus and trigger print once ready
    const triggerPrint = () => {
      try {
        if (!printWindow.closed) {
          printWindow.focus();
          printWindow.print();
        }
      } catch (err) {
        console.error('Error invoking print inside popup:', err);
      }
    };

    if (printWindow.document.readyState === 'complete') {
      setTimeout(triggerPrint, 250);
    } else {
      printWindow.onload = () => {
        setTimeout(triggerPrint, 250);
      };
      // Defensive fallback timer
      setTimeout(triggerPrint, 800);
    }

    return true;
  } catch (err) {
    console.error('Error preparing printable document in popup:', err);
    return false;
  }
}

