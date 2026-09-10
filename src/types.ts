export type StationeryStyle = 'classic' | 'modern' | 'executive' | 'parchment' | 'minimal';

export type LetterFont = 'serif-reading' | 'serif-classic' | 'display-serif' | 'sans-clean';

export type LetterFontSize = 'sm' | 'base' | 'lg';

export interface SenderInfo {
  name: string;
  title: string;
  organization: string;
  address: string;
  contact: string;
}

export interface RecipientInfo {
  name: string;
  title: string;
  organization: string;
  address: string;
}

export interface LetterContent {
  id: string;
  title: string;
  date: string;
  letterType: string;
  sender: SenderInfo;
  recipient: RecipientInfo;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  signoffName: string;
  postscript: string;
  stationery: StationeryStyle;
  fontFamily: LetterFont;
  fontSize: LetterFontSize;
  advice?: string[];
  isApproved?: boolean;
  coreReflection?: string;
  updatedAt: number;
}

export interface GhostwriterInputs {
  whyResigning: string;
  badExperiences: string;
  whatToSay: string;
  whatNotToSay: string;
  noticePeriodOrDate: string;
  supervisorName?: string;
  senderName?: string;
  senderTitle?: string;
}

export interface GhostwriterMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  clarifyingQuestions?: string[];
  coreReflection?: string;
  suggestedQuickReplies?: string[];
  timestamp: number;
  isApproved?: boolean;
}

export type InteractionStep = 1 | 2 | 3 | 4 | 5;

export interface LetterTemplate {
  id: string;
  title: string;
  category: 'Toxic Workplace & Protection' | 'Burnout & Well-being' | 'Broken Promises & Stagnation' | 'Immediate & Urgent' | 'Strictly Neutral & Minimalist' | 'Diplomatic & Gracious';
  description: string;
  letterType: string;
  tone: string;
  suggestedPoints: string;
  sample: Partial<LetterContent>;
  ghostwriterPointers: string[];
}

export interface CritiqueResult {
  overallVerdict: string;
  toneAnalysis: string;
  strengths: string[];
  recommendations: string[];
  etiquetteCheck?: string;
}
