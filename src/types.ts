export type Language = 'en' | 'zh';
export type LetterLanguageOption = 'follow' | 'en' | 'zh';

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
  letterLanguage?: LetterLanguageOption;
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
  isError?: boolean;
  isTransientError?: boolean;
  failedUserMessage?: string;
}

export type InteractionStep = 1 | 2 | 3 | 4 | 5;

export interface LetterTemplate {
  id: string;
  title: string;
  category: string;
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

export type WorkspaceSection = 'intake' | 'timeline' | 'facts' | 'draft' | 'history' | 'settings';

export type CaseDesktopStatus = 'locked' | 'needs_confirmation' | 'ready_to_draft' | 'approved';

export type EventCategory =
  | 'workload'
  | 'communication'
  | 'experience'
  | 'career'
  | 'decision'
  | 'notice'
  | 'private';

export type EventConfirmationStatus = 'unconfirmed' | 'needs_confirmation' | 'confirmed';

export type FactPrivacySetting = 'include' | 'background' | 'private';

export interface TimelineEvent {
  id: string;
  date: string;
  summary: string;
  category: EventCategory;
  status: EventConfirmationStatus;
  privacy: FactPrivacySetting;
  hasConflict?: boolean;
  conflictDetails?: string;
  order: number;
}

export type CaseFactStatus = 'missing' | 'needs_confirmation' | 'confirmed' | 'private' | 'conflict';

export interface ConfirmedFactItem {
  id: 'whyResigning' | 'badExperiences' | 'noticePeriodOrDate' | 'whatNotToSay';
  label: string;
  value: string;
  status: CaseFactStatus;
  privacy: FactPrivacySetting;
  conflictDetails?: string;
}

export interface WordingTransformation {
  id: string;
  original: string;
  professional: string;
  category: string;
  status: 'suggested' | 'accepted' | 'edited' | 'private_context' | 'excluded';
  isCustom?: boolean;
}

export interface LetterVersion {
  id: string;
  checkpoint: 'created' | 'user_edited' | 'ai_refined' | 'approved';
  timestamp: number;
  label: string;
  body: string;
  subject?: string;
  salutation?: string;
  closing?: string;
  signoffName?: string;
}

export interface DetectedConflict {
  id: string;
  type: 'date' | 'intent' | 'notice' | 'privacy';
  title: string;
  description: string;
  valueA: string;
  valueB: string;
  question: string;
  resolved: boolean;
  resolvedChoice?: 'A' | 'B' | 'custom';
}

export interface SourceTraceMapping {
  paragraphIndex: number;
  paragraphText: string;
  factId: 'whyResigning' | 'badExperiences' | 'noticePeriodOrDate' | 'whatNotToSay';
  factLabel: string;
  sourceText: string;
  isRewritten: boolean;
  reason: string;
}

