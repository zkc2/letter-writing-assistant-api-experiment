import { Language, LetterLanguageOption, EventCategory } from './types';

export interface TranslationSchema {
  // Common & Header
  appName: string;
  appSubtitle: string;
  appBadge: string;
  workspaceBadge: string;
  nav: {
    startNew: string;
    newCase: string;
    scenarios: string;
    savedDrafts: string;
    polishAudit: string;
    systemDiagram: string;
    approvedReady: string;
    readyBadge: string;
    mobileChatTab: string;
    mobileLetterTab: string;
    startFreshOption: string;
    structuredFormOption: string;
    cleanSlateConfirm: string;
  };
  // Case Workspace Tabs & Modules
  workspace: {
    sections: {
      intake: string;
      timeline: string;
      facts: string;
      draft: string;
    };
    intakeSubtitle: string;
    timelineSubtitle: string;
    factsSubtitle: string;
    draftSubtitle: string;
    timeline: {
      title: string;
      badge: string;
      addEvent: string;
      emptyTitle: string;
      emptyDesc: string;
      dateNotProvided: string;
      categories: Record<EventCategory, string>;
      statuses: {
        unconfirmed: string;
        needs_confirmation: string;
        confirmed: string;
      };
      privacy: {
        include: string;
        background: string;
        private: string;
        privateBadge: string;
      };
      actions: {
        confirm: string;
        markNeedsReview: string;
        edit: string;
        delete: string;
        moveUp: string;
        moveDown: string;
      };
      newEventTitle: string;
      summaryPlaceholder: string;
      datePlaceholder: string;
      save: string;
      cancel: string;
    };
    caseFile: {
      title: string;
      badge: string;
      description: string;
      gateSummary: (captured: number, total: number) => string;
      gateReady: string;
      gateWaiting: string;
      privacyNotice: string;
      statusLabels: {
        missing: string;
        needs_confirmation: string;
        confirmed: string;
        private: string;
        conflict: string;
      };
      privacyControls: {
        label: string;
        include: string;
        background: string;
        private: string;
        excludedBadge: string;
      };
      quickConfirm: string;
      editFact: string;
    };
    wording: {
      title: string;
      subtitle: string;
      originalHeader: string;
      professionalHeader: string;
      accept: string;
      accepted: string;
      edit: string;
      keepPrivate: string;
      exclude: string;
      addTransformation: string;
      originalPlaceholder: string;
      professionalPlaceholder: string;
    };
    conflict: {
      bannerTitle: string;
      blockingNotice: string;
      resolveBtn: string;
      chooseA: string;
      chooseB: string;
      resolvedBadge: string;
    };
    draftSection: {
      title: string;
      readinessTitle: string;
      gateStatus: string;
      traceabilityTitle: string;
      traceabilityDesc: string;
      whyIncluded: string;
      rewrittenBadge: string;
      directInputBadge: string;
      sourceFactLabel: string;
      versionHistoryTitle: string;
      checkpoints: {
        created: string;
        user_edited: string;
        ai_refined: string;
        approved: string;
      };
      viewVersion: string;
      restoreVersion: string;
      compareChanges: string;
      approvedBadge: string;
      approveButton: string;
      openAudit: string;
      compareModalTitle: string;
      currentTextLabel: string;
      previousTextLabel: string;
      closeModal: string;
    };
  };
  // Language Switcher
  langSwitcher: {
    label: string;
    en: string;
    zh: string;
    letterLangTitle: string;
    followInterface: string;
    english: string;
    chinese: string;
  };
  // Ghostwriter Chat
  chat: {
    title: string;
    badge: string;
    subtitle: string;
    newSession: string;
    newSessionConfirm: string;
    interactionLoop: string;
    steps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
    };
    tracker: {
      title: string;
      capturedCount: (n: number) => string;
      showChecklist: string;
      hideChecklist: string;
      items: {
        reason: { label: string; placeholder: string };
        experiences: { label: string; placeholder: string };
        whatToSay: { label: string; placeholder: string };
        whatNotToSay: { label: string; placeholder: string };
      };
    };
    guardrails: {
      button: string;
      activeApplied: string;
      tip: string;
      options: string[];
    };
    starters: {
      title: string;
      items: { label: string; text: string }[];
    };
    reflectionTitle: string;
    questionsTitle: string;
    answerThis: string;
    approvedTitle: string;
    approvedDesc: string;
    approvedBannerText: string;
    reopenRevision: string;
    approvalPrompt: string;
    keepTweaking: string;
    approveButton: string;
    inputPlaceholderStep1: string;
    inputPlaceholderDefault: string;
    sendButton: string;
    pressEnter: string;
    apiDisclosure: string;
    loadingGhostwriter: string;
    errorMessagePrefix: string;
    errorTroubleshoot: string;
    retryThisMessage: string;
  };
  // Intake Form / Composer Modal
  composer: {
    title: string;
    subtitle: string;
    reasonLabel: string;
    reasons: string[];
    experiencesLabel: string;
    experiencesPlaceholder: string;
    toneLabel: string;
    tones: { id: string; label: string; desc: string }[];
    dateLabel: string;
    datePlaceholder: string;
    dateHelp: string;
    letterLangLabel: string;
    letterLangHelp: string;
    letterLangOptions: { id: LetterLanguageOption; label: string; desc: string }[];
    guardrailsLabel: string;
    guardrailsPlaceholder: string;
    senderSectionLabel: string;
    senderNamePlaceholder: string;
    senderTitlePlaceholder: string;
    recipientSectionLabel: string;
    supervisorNamePlaceholder: string;
    companyNamePlaceholder: string;
    dataNoticeTitle: string;
    dataNoticeText: string;
    cancel: string;
    submit: string;
    initialCaseIntro: string;
    coreReasonLine: string;
    experiencesLine: string;
    finalDateLine: string;
    guardrailsLine: string;
    toneLine: string;
    letterLangLine: string;
    myNameLine: string;
    supervisorLine: string;
    companyLine: string;
  };
  // Stationery Bar
  stationery: {
    paperStyle: string;
    fontStyle: string;
    sizeStyle: string;
    styles: { id: string; label: string }[];
    fonts: { id: string; label: string }[];
    sizes: { id: string; label: string }[];
  };
  // Letter Sheet
  letter: {
    verifiedBadge: string;
    liveDraftBadge: string;
    wordCount: (n: number) => string;
    readingTime: (n: number) => string;
    copy: string;
    copied: string;
    download: string;
    print: string;
    manualEdit: string;
    doneEditing: string;
    senderInfoLabel: string;
    senderNamePlaceholder: string;
    senderTitlePlaceholder: string;
    senderContactPlaceholder: string;
    defaultSenderName: string;
    dateLabel: string;
    datePlaceholder: string;
    recipientDetailsLabel: string;
    recipientNamePlaceholder: string;
    recipientTitlePlaceholder: string;
    recipientOrgPlaceholder: string;
    recipientAddressPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    salutationPlaceholder: string;
    defaultSalutation: string;
    bodyPlaceholder: string;
    bodyHelp: string;
    emptyDraftTitle: string;
    emptyDraftDesc: string;
    closingPlaceholder: string;
    defaultClosing: string;
    signatureLabel: string;
    defaultSignoffName: string;
    psLabel: string;
    psPlaceholder: string;
    safeguardsTitle: string;
  };
  // AI Assistant Drawer
  drawer: {
    title: string;
    subtitle: string;
    tabRefine: string;
    tabAudit: string;
    quickActionsTitle: string;
    quickActionsDesc: string;
    actions: {
      id: string;
      title: string;
      desc: string;
      actionPrompt: string;
    }[];
    customPromptLabel: string;
    customPromptPlaceholder: string;
    applyCustomButton: string;
    proposedChangesTitle: string;
    applyToLetter: string;
    discard: string;
    auditTitle: string;
    auditDesc: string;
    runAuditButton: string;
    auditRunning: string;
    auditVerdictLabel: string;
    toneAnalysisLabel: string;
    strengthsLabel: string;
    recommendationsLabel: string;
    etiquetteCheckLabel: string;
    processing: string;
  };
  // Templates Modal
  templates: {
    title: string;
    subtitle: string;
    categories: { id: string; label: string }[];
    previewTitle: string;
    suggestedPointsLabel: string;
    safeguardsLabel: string;
    useTemplate: string;
    sampleSubject: string;
  };
  // Saved Drafts Modal
  saved: {
    title: string;
    subtitle: string;
    empty: string;
    currentBadge: string;
    words: (n: number) => string;
    load: string;
    duplicate: string;
    delete: string;
    close: string;
  };
  // System Diagram Modal
  diagram: {
    title: string;
    subtitle: string;
    legendTitle: string;
    legends: {
      user: string;
      ui: string;
      agent: string;
      server: string;
      external: string;
    };
    primaryFlowTitle: string;
    primaryFlowSubtitle: string;
    primaryFlowDesc: string;
    flowSteps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      step7: string;
    };
    bilingualSectionTitle: string;
    bilingualSectionSubtitle: string;
    bilingualItems: {
      switcher: { title: string; desc: string };
      dictionary: { title: string; desc: string };
      interfaceLang: { title: string; desc: (lang: string) => string };
      letterLang: { title: string; desc: (lang: string) => string };
      promptInstruction: { title: string; desc: string };
    };
    loopTitle: string;
    loopSteps: {
      l1: { title: string; desc: string };
      l2: { title: string; desc: string };
      l3: { title: string; desc: string };
      l4: { title: string; desc: string };
      l5: { title: string; desc: string };
    };
    trackerSectionTitle: string;
    trackerSectionDesc: string;
    trackerItems: {
      t1: { title: string; desc: string };
      t2: { title: string; desc: string };
      t3: { title: string; desc: string };
      t4: { title: string; desc: string };
    };
    boundariesTitle: string;
    boundariesDesc: string;
    boundaryItems: {
      client: { title: string; desc: string };
      server: { title: string; desc: string };
      external: { title: string; desc: string };
    };
    close: string;
  };
  // Toasts
  toast: {
    letterApproved: string;
    freshSessionStarted: string;
    caseDetailsShared: string;
    loadedScenario: (name: string) => string;
    loadedDraft: (name: string) => string;
    draftDeleted: string;
    draftDuplicated: string;
    appliedPolish: (summary?: string) => string;
    languageChanged: (langName: string) => string;
  };
  // Default first message
  initialAssistantMessage: string;
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    appName: 'Resignation Ghostwriter',
    appSubtitle: 'Leave Professionally on Your Own Terms',
    appBadge: 'Supportive Writing Assistant',
    workspaceBadge: 'Case Workspace',
    nav: {
      startNew: 'Start Fresh',
      newCase: 'New Case Intake',
      scenarios: 'Scenarios',
      savedDrafts: 'Drafts',
      polishAudit: 'Refine & Audit',
      systemDiagram: 'About & Diagram',
      approvedReady: 'Approved & Ready',
      readyBadge: 'Ready to Submit',
      mobileChatTab: 'Ghostwriter',
      mobileLetterTab: 'Letter Sheet',
      startFreshOption: 'Start Clean Case (Reset)',
      structuredFormOption: 'Guided Intake Wizard',
      cleanSlateConfirm: 'Start fresh case? All current case inputs and drafts will be archived in Drafts.',
    },
    workspace: {
      sections: {
        intake: 'Intake',
        timeline: 'Timeline',
        facts: 'Confirmed Facts',
        draft: 'Draft',
      },
      intakeSubtitle: 'Conversational reflection and initial workplace experience extraction',
      timelineSubtitle: 'Chronological event cards extracted from your workplace experiences',
      factsSubtitle: 'The 4 confirmed facts, privacy boundaries, and wording transformation',
      draftSubtitle: 'Live letter status, source traceability, and version checkpoints',
      timeline: {
        title: 'Experience Timeline',
        badge: 'Structured Events',
        addEvent: 'Add Event',
        emptyTitle: 'No events logged yet',
        emptyDesc: 'Share your workplace experiences in Intake to automatically generate timeline event cards, or click Add Event.',
        dateNotProvided: 'Date not provided',
        categories: {
          workload: 'Workload & Hours',
          communication: 'Communication',
          experience: 'Workplace Experience',
          career: 'Career Development',
          decision: 'Resignation Decision',
          notice: 'Notice & Handover',
          private: 'Private Context',
        },
        statuses: {
          unconfirmed: 'Unconfirmed',
          needs_confirmation: 'Needs Review',
          confirmed: 'Confirmed',
        },
        privacy: {
          include: 'Include in letter',
          background: 'Background context only',
          private: 'Keep private (Excluded)',
          privateBadge: 'Excluded from letter',
        },
        actions: {
          confirm: 'Confirm Event',
          markNeedsReview: 'Mark Needs Review',
          edit: 'Edit',
          delete: 'Delete',
          moveUp: 'Move Up',
          moveDown: 'Move Down',
        },
        newEventTitle: 'New Timeline Event',
        summaryPlaceholder: 'Describe what happened (e.g. Working hours became unpredictable)',
        datePlaceholder: 'Date or period (e.g. October 2, 2026 or leave blank)',
        save: 'Save Event',
        cancel: 'Cancel',
      },
      caseFile: {
        title: 'Confirmed Case File',
        badge: '4/4 Required Gate',
        description: 'All 4 required case facts must be confirmed and conflicts resolved before drafting.',
        gateSummary: (captured, total) => `${captured} / ${total} Gate Complete`,
        gateReady: 'All 4 facts confirmed & ready for drafting',
        gateWaiting: 'Awaiting confirmation of all 4 case facts',
        privacyNotice: 'Sensitive facts marked private are guaranteed never to appear in the letter.',
        statusLabels: {
          missing: 'Missing',
          needs_confirmation: 'Needs Review',
          confirmed: 'Confirmed',
          private: 'Private & Excluded',
          conflict: 'Conflict Detected',
        },
        privacyControls: {
          label: 'Privacy Setting',
          include: 'Include in letter',
          background: 'Use only as background context',
          private: 'Keep private and never include',
          excludedBadge: 'Excluded from letter',
        },
        quickConfirm: 'Confirm Fact',
        editFact: 'Edit',
      },
      wording: {
        title: 'Original Experience → Professional Wording',
        subtitle: 'Transform raw or emotionally charged workplace experiences into dignified, constructive phrasing.',
        originalHeader: 'Original Experience (Raw / Emotional)',
        professionalHeader: 'Professional Wording (Editable Suggestion)',
        accept: 'Accept Wording',
        accepted: 'Wording Accepted',
        edit: 'Edit Wording',
        keepPrivate: 'Keep as Private Context',
        exclude: 'Exclude Completely',
        addTransformation: 'Add Custom Comparison',
        originalPlaceholder: 'Original statement (e.g. My manager was condescending)',
        professionalPlaceholder: 'Suggested professional alternative (e.g. Seeking closer alignment in leadership communication)',
      },
      conflict: {
        bannerTitle: 'Contradiction / Conflict Detected',
        blockingNotice: 'Drafting is paused until this conflict is clarified so your letter remains 100% credible.',
        resolveBtn: 'Resolve Conflict',
        chooseA: 'Use Option A',
        chooseB: 'Use Option B',
        resolvedBadge: 'Conflict Resolved',
      },
      draftSection: {
        title: 'Resignation Draft & Quality Gate',
        readinessTitle: 'Draft Status & Confirmation Gate',
        gateStatus: 'All 4 core facts validated',
        traceabilityTitle: 'Source Traceability',
        traceabilityDesc: 'Click any paragraph in the letter to view its underlying confirmed facts and transformation logic.',
        whyIncluded: 'Why is this included?',
        rewrittenBadge: 'Professionally Rewritten',
        directInputBadge: 'Direct User Input',
        sourceFactLabel: 'Confirmed Source Fact:',
        versionHistoryTitle: 'Draft Version History & Checkpoints',
        checkpoints: {
          created: 'Draft Created',
          user_edited: 'User Edited',
          ai_refined: 'AI Refined',
          approved: 'User Approved',
        },
        viewVersion: 'View',
        restoreVersion: 'Restore Version',
        compareChanges: 'Compare Changes',
        approvedBadge: 'Approved (Step 5)',
        approveButton: 'Approve This Draft',
        openAudit: 'Run Etiquette Audit',
        compareModalTitle: 'Version Comparison',
        currentTextLabel: 'Current Version',
        previousTextLabel: 'Selected Previous Version',
        closeModal: 'Close Comparison',
      },
    },
    langSwitcher: {
      label: 'EN / 中文',
      en: 'English',
      zh: '中文 (Simplified)',
      letterLangTitle: 'Letter Language',
      followInterface: 'Follow interface language',
      english: 'English',
      chinese: 'Simplified Chinese',
    },
    chat: {
      title: 'Resignation Ghostwriter',
      badge: 'Supportive Friend',
      subtitle: 'Transforming difficult workplace challenges into a professional resignation draft',
      newSession: 'New Session',
      newSessionConfirm: 'Start fresh session? This clears the 0/4 tracker and begins a clean intake.',
      interactionLoop: 'Interaction Loop:',
      steps: {
        step1: 'Step 1: Get the Messy Version',
        step2: 'Step 2: Understand & Clarify',
        step3: 'Step 3: Acknowledge & Reflect',
        step4: 'Step 4: Draft & Revise',
        step5: 'Step 5: Approved with "Yes"',
      },
      tracker: {
        title: 'Required Information Tracker',
        capturedCount: (n) => `${n} / 4 Captured`,
        showChecklist: 'Show checklist',
        hideChecklist: 'Hide checklist',
        items: {
          reason: { label: '1. Reason for Resigning', placeholder: 'Not yet captured' },
          experiences: { label: '2. Bad Experiences / Challenges', placeholder: 'Not yet captured' },
          whatToSay: { label: '3. Notice & Final Working Date', placeholder: 'Not yet captured (exact date)' },
          whatNotToSay: { label: '4. Boundaries (What NOT to say)', placeholder: 'Begins blank (user decided)' },
        },
      },
      guardrails: {
        button: 'Set Guardrails ("What NOT to say")',
        activeApplied: 'Active Guardrails Applied',
        tip: 'Click to enforce privacy protections in your resignation letter:',
        options: [
          'Do NOT mention new employer name or compensation',
          'Do NOT put workplace grievances or toxic behavior on written record',
          'Do NOT offer transitional flexibility or extension beyond final date',
          'Do NOT accept counter-offers; make decision completely final',
          'Keep reason strictly personal / health without elaboration',
          'Exclude personal contact info; communicate only via work channels until last day',
        ],
      },
      starters: {
        title: 'Step 1: Vent the raw version (Select or tell me your own story):',
        items: [
          { label: 'Toxic Management & Micromanagement', text: 'My manager micromanages constantly, takes credit for my work, and fosters a toxic hostile environment. I cannot take it anymore.' },
          { label: 'Unbearable Burnout & Overload', text: 'I am experiencing extreme burnout from working 65+ hour weeks with zero staffing support. My health is deteriorating.' },
          { label: 'Broken Promises & Stalled Career', text: 'I was promised a promotion and compensation review over a year ago. It keeps getting pushed back while my workload doubled.' },
          { label: 'Better Offer Elsewhere', text: 'I received a vastly superior offer with better pay and a healthier culture. I want a clean, graceful departure.' },
        ],
      },
      reflectionTitle: 'Reflecting back what matters to you:',
      questionsTitle: 'Question to clarify your letter:',
      answerThis: 'Answer this',
      approvedTitle: 'Letter Approved & Ready',
      approvedDesc: 'You can now copy, print, or download your formal resignation document with confidence.',
      approvedBannerText: 'You approved this resignation letter. It is ready for your supervisor.',
      reopenRevision: 'Re-open revision',
      approvalPrompt: 'Does this draft express what you need with dignity?',
      keepTweaking: 'Keep Tweaking',
      approveButton: 'Yes, this is ready',
      inputPlaceholderStep1: 'Get the messy version out first: What happened? What made you want to leave?',
      inputPlaceholderDefault: 'Reply to the ghostwriter, clarify dates, or say what to adjust...',
      sendButton: 'Send message',
      pressEnter: 'Press Enter to send',
      apiDisclosure: 'Text is sent to Gemini to draft responses. Do not enter passwords or credentials.',
      loadingGhostwriter: 'Resignation Ghostwriter is listening and revising your letter...',
      errorMessagePrefix: 'Ghostwriter service notice:',
      errorTroubleshoot: 'Please check your connection and configuration.',
      retryThisMessage: 'Retry this message',
    },
    composer: {
      title: 'New Resignation Case',
      subtitle: 'Share your details with the Ghostwriter to review and confirm',
      reasonLabel: 'What is your primary reason for resigning?',
      reasons: [
        'Select a reason or describe your own',
        'Toxic management / hostile culture',
        'Severe burnout & unsustainable workload',
        'Broken promises / stalled advancement',
        'Undercompensated & undervalued',
        'Accepted a new employment opportunity',
        'Personal / family health priorities',
        'Other / describe in your own words',
      ],
      experiencesLabel: 'What happened? (Raw experiences, feelings, incidents)',
      experiencesPlaceholder: 'Describe what happened in your own words (e.g., micromanagement, unfair treatment, burnout). The assistant will help keep this professional.',
      toneLabel: 'Tone Archetype',
      tones: [
        { id: 'Calm & Dignified', label: 'Calm & Dignified', desc: 'Restrained, professional, protective of future references' },
        { id: 'Strictly Neutral & Minimalist', label: 'Strictly Neutral', desc: 'Zero emotional exposure, basic notice only' },
        { id: 'Firm & Uncompromising', label: 'Firm & Uncompromising', desc: 'Clear boundaries, no room for counter-offers' },
        { id: 'Diplomatic & Gracious', label: 'Diplomatic & Gracious', desc: 'Preserving peer friendships while exiting cleanly' },
      ],
      dateLabel: 'Exact Intended Final Working Date',
      datePlaceholder: 'Exact date (e.g. November 14, 2026)',
      dateHelp: 'State your exact intended final working date. We do not assume or calculate your date.',
      letterLangLabel: 'Letter Language',
      letterLangHelp: 'Choose the language for the formal resignation letter draft.',
      letterLangOptions: [
        { id: 'follow', label: 'Follow interface language', desc: 'Automatically matches your current interface language' },
        { id: 'en', label: 'English', desc: 'Standard business English letter' },
        { id: 'zh', label: 'Simplified Chinese', desc: 'Standard formal Chinese resignation application (规范中文辞职信)' },
      ],
      guardrailsLabel: 'Boundaries: What do you NOT want said in the letter?',
      guardrailsPlaceholder: 'Leave blank or specify topics to exclude (e.g., do not mention new employer, no grievances on record)',
      senderSectionLabel: 'Your Name & Title (Optional)',
      senderNamePlaceholder: 'Your Full Name',
      senderTitlePlaceholder: 'Your Role / Title',
      recipientSectionLabel: 'Supervisor & Company (Optional)',
      supervisorNamePlaceholder: 'Supervisor Name',
      companyNamePlaceholder: 'Company Name',
      dataNoticeTitle: 'Data Notice:',
      dataNoticeText: 'Details submitted here are sent via the server to Google\'s Gemini API to process and structure your case. Please avoid entering sensitive passwords or proprietary secrets.',
      cancel: 'Cancel',
      submit: 'Submit Details to Ghostwriter',
      initialCaseIntro: 'Here are details regarding my resignation case:',
      coreReasonLine: 'Core reason:',
      experiencesLine: 'What happened / experiences:',
      finalDateLine: 'Exact final working date:',
      guardrailsLine: 'Boundaries (do NOT mention):',
      toneLine: 'Tone preference:',
      letterLangLine: 'Requested letter language:',
      myNameLine: 'My name:',
      supervisorLine: 'Supervisor:',
      companyLine: 'Company:',
    },
    stationery: {
      paperStyle: 'Stationery:',
      fontStyle: 'Font:',
      sizeStyle: 'Size:',
      styles: [
        { id: 'classic', label: 'Classic Linen' },
        { id: 'modern', label: 'Crisp White' },
        { id: 'executive', label: 'Executive' },
        { id: 'parchment', label: 'Parchment' },
        { id: 'minimal', label: 'Minimal' },
      ],
      fonts: [
        { id: 'serif-reading', label: 'Newsreader' },
        { id: 'serif-classic', label: 'Lora Classic' },
        { id: 'display-serif', label: 'Cinzel Formal' },
        { id: 'sans-clean', label: 'Jakarta Sans' },
      ],
      sizes: [
        { id: 'sm', label: 'Compact' },
        { id: 'base', label: 'Normal' },
        { id: 'lg', label: 'Spacious' },
      ],
    },
    letter: {
      verifiedBadge: 'Approved by You (Ready to Submit)',
      liveDraftBadge: 'Live Ghostwriter Draft',
      wordCount: (n) => `${n} words`,
      readingTime: (n) => `~${n} min read`,
      copy: 'Copy',
      copied: 'Copied',
      download: 'Download',
      print: 'Print / PDF',
      manualEdit: 'Manual Edit',
      doneEditing: 'Done Editing',
      senderInfoLabel: 'Your Information:',
      senderNamePlaceholder: 'Your Full Name',
      senderTitlePlaceholder: 'Your Job Title',
      senderContactPlaceholder: 'Personal Email • Personal Phone (optional)',
      defaultSenderName: 'Your Name',
      dateLabel: 'Date:',
      datePlaceholder: 'Date',
      recipientDetailsLabel: 'Supervisor / Recipient Details:',
      recipientNamePlaceholder: 'Supervisor Name',
      recipientTitlePlaceholder: 'Supervisor Title',
      recipientOrgPlaceholder: 'Company Name (e.g. Acme Corporation)',
      recipientAddressPlaceholder: 'Office Address (optional)',
      subjectLabel: 'Subject:',
      subjectPlaceholder: 'Notice of Resignation — [Your Name]',
      salutationPlaceholder: 'Dear [Supervisor Name],',
      defaultSalutation: 'Dear Supervisor,',
      bodyPlaceholder: 'The formal resignation letter paragraphs will appear here. Separate paragraphs with double line breaks.',
      bodyHelp: 'Tip: The Resignation Ghostwriter automatically formats your feelings into professional language.',
      emptyDraftTitle: 'Your resignation letter draft is empty right now.',
      emptyDraftDesc: 'Tell the Resignation Ghostwriter on the left about your situation to generate your tailored letter.',
      closingPlaceholder: 'Sincerely,',
      defaultClosing: 'Sincerely,',
      signatureLabel: 'Your Signature',
      defaultSignoffName: 'Your Name',
      psLabel: 'P.S.',
      psPlaceholder: 'Optional note (e.g. personal contact for remaining friends)',
      safeguardsTitle: 'Ghostwriter Professional Safeguards:',
    },
    drawer: {
      title: 'Ghostwriter Letter Polish & Audit',
      subtitle: 'De-escalate emotional phrasing and verify standard letter conventions',
      tabRefine: 'Quick Tone Refinement',
      tabAudit: 'Etiquette & Composure Review',
      quickActionsTitle: 'Quick Tone Adjustments',
      quickActionsDesc: 'Select an instant refinement rule to rewrite the resignation body:',
      actions: [
        {
          id: 'cool-down',
          title: 'De-Escalate Phrasing',
          desc: 'Strips subtle passive-aggressive phrasing or venting; ensures a respectful, professional tone.',
          actionPrompt: 'Remove any latent hostility, passive-aggressive undertones, or grievance airing. Keep the tone impeccably composed and professional.',
        },
        {
          id: 'concise-focused',
          title: 'Concise & Focused',
          desc: 'Cuts unnecessary justifications, leaving only the essential formal notice and dates.',
          actionPrompt: 'Make the letter clear and concise. Remove personal justifications and keep strictly to: notice of resignation, effective last day, and standard handover commitment.',
        },
        {
          id: 'firm-boundaries',
          title: 'Firm Boundaries (No Counter-offers)',
          desc: 'States unequivocally that your decision is final to prevent awkward retention negotiations.',
          actionPrompt: 'Politely but firmly emphasize that this decision is final and fully considered, closing the door on retention counter-offers without being abrasive.',
        },
        {
          id: 'peer-handover',
          title: 'Warm Peer Handover Focus',
          desc: 'Emphasizes cooperative transition for coworkers while maintaining boundaries with leadership.',
          actionPrompt: 'Expand the transition section to warmly highlight teamwork and offer organized handover documentation for peers, while maintaining clean boundaries with leadership.',
        },
        {
          id: 'urgent-short',
          title: 'Convert to Expedited Notice',
          desc: 'Adjusts timeline politely for unviable workplace environments or personal emergencies.',
          actionPrompt: 'Revise the letter for immediate or shortened notice due to unforeseen personal circumstances, with clear mention of equipment return and asset handover.',
        },
      ],
      customPromptLabel: 'Custom Ghostwriter Direction',
      customPromptPlaceholder: 'e.g., Shorten to 2 concise paragraphs and thank my direct mentor Sarah...',
      applyCustomButton: 'Apply Custom Instruction',
      proposedChangesTitle: 'Proposed Revision by Ghostwriter:',
      applyToLetter: 'Apply Revision to Letter',
      discard: 'Discard Revision',
      auditTitle: 'Composure & Etiquette Evaluation',
      auditDesc: 'Reviews your resignation draft for professional tone, boundary strength, and standard letter conventions. No legal advice is provided.',
      runAuditButton: 'Run Composure & Etiquette Audit',
      auditRunning: 'Analyzing tone and conventions...',
      auditVerdictLabel: 'Overall Verdict:',
      toneAnalysisLabel: 'Tone & Composure Analysis:',
      strengthsLabel: 'Strengths & Protective Qualities:',
      recommendationsLabel: 'Recommended Adjustments:',
      etiquetteCheckLabel: 'Convention & Etiquette Notes:',
      processing: 'Processing...',
    },
    templates: {
      title: 'Resignation Scenarios & Archetypes',
      subtitle: 'Calm, professional frameworks designed for difficult departures.',
      categories: [
        { id: 'All', label: 'All Scenarios' },
        { id: 'Toxic Workplace & Protection', label: 'Toxic Workplace & Protection' },
        { id: 'Burnout & Well-being', label: 'Burnout & Well-being' },
        { id: 'Broken Promises & Stagnation', label: 'Broken Promises & Stagnation' },
        { id: 'Strictly Neutral & Minimalist', label: 'Strictly Neutral & Minimalist' },
        { id: 'Immediate & Urgent', label: 'Immediate & Urgent' },
        { id: 'Diplomatic & Gracious', label: 'Diplomatic & Gracious' },
      ],
      previewTitle: 'Scenario Framework Preview',
      suggestedPointsLabel: 'Key Focus & Strategy:',
      safeguardsLabel: 'Ghostwriter Protective Pointers:',
      useTemplate: 'Use This Scenario Template',
      sampleSubject: 'Notice of Resignation',
    },
    saved: {
      title: 'Saved Letter Drafts',
      subtitle: 'Your draft history saved locally on this device.',
      empty: 'No saved drafts yet. Drafts are automatically stored as you compose.',
      currentBadge: 'Active Draft',
      words: (n) => `${n} words`,
      load: 'Load Draft',
      duplicate: 'Duplicate',
      delete: 'Delete',
      close: 'Close',
    },
    diagram: {
      title: 'About & System Architecture Diagram',
      subtitle: 'End-to-end component flow, Gemini agent execution loop, and runtime boundaries',
      legendTitle: 'Component Type Legend',
      legends: {
        user: 'User Interaction',
        ui: 'Application Interface',
        agent: 'Agent Behavior',
        server: 'Server-side Infrastructure',
        external: 'External Gemini API',
      },
      primaryFlowTitle: 'Primary Flow Pipeline',
      primaryFlowSubtitle: 'User-Guided Linear Cycle',
      primaryFlowDesc: 'User → Intake and Conversation → Input Validation → Resignation Ghostwriter Agent → Letter Draft → User Review → Revision or Final Confirmation',
      flowSteps: {
        step1: '1. User Input & Venting',
        step2: '2. Intake & Conversation',
        step3: '3. 4-Item Input Validation',
        step4: '4. Resignation Ghostwriter Agent',
        step5: '5. Letter Draft Generation',
        step6: '6. User Review & Approval',
        step7: '7. Export (Copy/Download/Print)',
      },
      bilingualSectionTitle: 'Bilingual Architecture & Localization',
      bilingualSectionSubtitle: 'Complete English & Simplified Chinese System Integration',
      bilingualItems: {
        switcher: {
          title: 'Language Switcher (EN / 中文)',
          desc: 'Positioned prominently in header. Toggles between English and Simplified Chinese immediately without resetting conversation, clearing inputs, or triggering AI calls. Persisted via localStorage.',
        },
        dictionary: {
          title: 'Centralized Translation Dictionary (src/i18n.ts)',
          desc: 'Unified dictionary holding all user-facing strings, navigation labels, button text, form inputs, validation messages, and system diagram data. Prevents scattered translations.',
        },
        interfaceLang: {
          title: 'Selected Interface Language',
          desc: (lang) => `Currently active: ${lang === 'zh' ? 'Simplified Chinese (简体中文)' : 'English'}. All interface components adapt dynamically.`,
        },
        letterLang: {
          title: 'Selected Letter Language',
          desc: (lang) => `Currently active letter language mode: ${lang === 'zh' ? 'Simplified Chinese' : lang === 'en' ? 'English' : 'Follow Interface Language'}. Decoupled from interface language.`,
        },
        promptInstruction: {
          title: 'Agent Language Instruction',
          desc: 'The server injects explicit language rules into the system prompt: The Ghostwriter responds in the user\'s chosen interface language, while formatting the resignation letter in the chosen letter language according to standard cultural conventions.',
        },
      },
      loopTitle: '5-Step Ghostwriter Interaction Loop',
      loopSteps: {
        l1: { title: 'Step 1: Get the Messy Version', desc: 'Listen to raw feelings, uncensored experiences, and reasons for leaving.' },
        l2: { title: 'Step 2: Understand & Clarify', desc: 'Ask one question at a time to uncover why you want to leave without inventing facts.' },
        l3: { title: 'Step 3: Acknowledge & Reflect', desc: 'Reflect back the core truth with protective clarity; summarize and ask for confirmation.' },
        l4: { title: 'Step 4: Draft & Revise', desc: 'Draft a dignified letter only after confirmation. Refine iteratively based on feedback.' },
        l5: { title: 'Step 5: Approved with "Yes"', desc: 'Lock and mark verified once you confirm "Yes". Ready for supervisor delivery.' },
      },
      trackerSectionTitle: 'Required Information Tracker (0/4 Gate)',
      trackerSectionDesc: 'The Ghostwriter is strictly forbidden from drafting until all 4 inputs are captured and confirmed:',
      trackerItems: {
        t1: { title: '1. Why Resigning', desc: 'Core motivation for departure' },
        t2: { title: '2. Bad Experiences', desc: 'Unfiltered workplace incidents' },
        t3: { title: '3. What to Say & Date', desc: 'Exact intended final working date (no 2-week default)' },
        t4: { title: '4. Boundaries', desc: 'What must NEVER be said in the letter' },
      },
      boundariesTitle: 'Runtime Boundaries & Security',
      boundariesDesc: 'How data and keys are isolated safely:',
      boundaryItems: {
        client: { title: 'Client Browser (Port 3000)', desc: 'React SPA renders UI, manages state in memory and localStorage. No API keys exist in client code.' },
        server: { title: 'Node/Express Server (Port 3000)', desc: 'Validates inputs, guards GEMINI_API_KEY, enforces system prompts and strict JSON schemas.' },
        external: { title: 'Google Gemini 2.5 Flash', desc: 'Processes text via Google GenAI SDK. Does not receive user credentials or passwords.' },
      },
      close: 'Close Diagram',
    },
    toast: {
      letterApproved: 'Resignation letter approved! Ready for your supervisor.',
      freshSessionStarted: 'Fresh session started: all fields blank, tracker at 0/4.',
      caseDetailsShared: 'Case details shared with Ghostwriter.',
      loadedScenario: (name) => `Loaded "${name}" scenario.`,
      loadedDraft: (name) => `Loaded draft: ${name}`,
      draftDeleted: 'Draft deleted.',
      draftDuplicated: 'Draft duplicated.',
      appliedPolish: (summary) => summary ? `Applied polish: ${summary}` : 'Applied polish to letter.',
      languageChanged: (langName) => `Interface language changed to ${langName}.`,
    },
    initialAssistantMessage: `Hey there. I'm your Resignation Ghostwriter. Think of me as your supportive friend who has your back—not HR, and definitely not your boss.\n\nLeaving a job after enduring unfair treatment, burnout, or difficult workplace experiences is exhausting. My role is to help you turn those challenges into a professional resignation draft so you can leave with complete dignity and your professional standing intact.\n\nTo get started with Step 1: What difficult situations have you experienced at work, and why do you want to leave this job? Give me the messy, unfiltered version.`,
  },
  zh: {
    appName: '辞职信代笔助手',
    appSubtitle: '以体面尊严的方式，按自己的意愿从容告别',
    appBadge: '站在你这边的写作助手',
    workspaceBadge: '个案工作台',
    nav: {
      startNew: '开启新篇',
      newCase: '新个案录入',
      scenarios: '情境范本',
      savedDrafts: '草稿箱',
      polishAudit: '润色与审查',
      systemDiagram: '系统架构图',
      approvedReady: '已确认就绪',
      readyBadge: '可直接提交',
      mobileChatTab: '代笔助手',
      mobileLetterTab: '辞职信文稿',
      startFreshOption: '开启全新个案 (清空并重置)',
      structuredFormOption: '结构化录入向导',
      cleanSlateConfirm: '确定开启全新个案吗？当前个案的所有输入与文稿将归档至草稿箱中。',
    },
    workspace: {
      sections: {
        intake: '摄入与倾诉',
        timeline: '经历时间线',
        facts: '确认事实与边界',
        draft: '信件文稿与核准',
      },
      intakeSubtitle: '对话倾听、共情提炼与原始职场经历摄入',
      timelineSubtitle: '从你的经历中提取的结构化时间线事件卡片',
      factsSubtitle: '4 项已确认核心事实、隐私边界与专业措辞对照',
      draftSubtitle: '辞职信实时状态、来源溯源与版本检查点',
      timeline: {
        title: '职场经历时间线',
        badge: '结构化事件',
        addEvent: '添加事件',
        emptyTitle: '暂无时间线事件',
        emptyDesc: '在摄入对话中分享你的职场经历即可自动提取事件卡片，或点击上方「添加事件」手动建立。',
        dateNotProvided: '未提供具体日期',
        categories: {
          workload: '工作负荷与时长',
          communication: '沟通与管理',
          experience: '职场经历与遭遇',
          career: '职业发展受限',
          decision: '辞职决断',
          notice: '通知期与交接',
          private: '私密背景信息',
        },
        statuses: {
          unconfirmed: '未确认',
          needs_confirmation: '待核对',
          confirmed: '已确认',
        },
        privacy: {
          include: '纳入辞职信',
          background: '仅作背景参考',
          private: '保持私密 (绝不透露)',
          privateBadge: '信件排除项',
        },
        actions: {
          confirm: '确认此事件',
          markNeedsReview: '标记待核对',
          edit: '编辑',
          delete: '删除',
          moveUp: '上移',
          moveDown: '下移',
        },
        newEventTitle: '添加时间线事件',
        summaryPlaceholder: '描述事件经过（如：加班严重无规律、未予晋升）',
        datePlaceholder: '发生时间或阶段（如：2026年10月2日，留空则为未提供）',
        save: '保存事件',
        cancel: '取消',
      },
      caseFile: {
        title: '已确认个案档案',
        badge: '4/4 门槛检验',
        description: '在正式起草前，必须确认全部 4 项核心要素并化解所有潜在冲突。',
        gateSummary: (captured, total) => `${captured} / ${total} 准入检验达成`,
        gateReady: '4 项要素均已确认，具备起草条件',
        gateWaiting: '等待确认全部 4 项个案要素',
        privacyNotice: '标记为私密的敏感信息承诺绝不写入辞职信正文中。',
        statusLabels: {
          missing: '缺失',
          needs_confirmation: '待核对',
          confirmed: '已确认',
          private: '私密排除项',
          conflict: '检测到冲突',
        },
        privacyControls: {
          label: '隐私边界控制',
          include: '纳入辞职信',
          background: '仅作幕后背景参考',
          private: '保持私密绝不透露',
          excludedBadge: '信件排除项',
        },
        quickConfirm: '确认此事实',
        editFact: '编辑',
      },
      wording: {
        title: '原始真实经历 → 专业得体表述',
        subtitle: '将带情绪、易引发冲突的经历，转化为体面克制、无可指摘的职场措辞。',
        originalHeader: '原始倾诉经历（未经修饰/情绪宣泄）',
        professionalHeader: '建议专业措辞（可自由编辑）',
        accept: '采纳此措辞',
        accepted: '已采纳',
        edit: '编辑建议措辞',
        keepPrivate: '保留为私密背景',
        exclude: '完全排除不予提及',
        addTransformation: '新增对照项',
        originalPlaceholder: '原始说法（如：领导天天当众贬低我）',
        professionalPlaceholder: '专业替代表述（如：寻求沟通风格更具支持性与成长性的发展空间）',
      },
      conflict: {
        bannerTitle: '检测到矛盾或冲突项',
        blockingNotice: '在化解此冲突之前起草已暂停，以确保最终辞职信 100% 严谨可信。',
        resolveBtn: '化解冲突',
        chooseA: '采纳选项 A',
        chooseB: '采纳选项 B',
        resolvedBadge: '冲突已化解',
      },
      draftSection: {
        title: '辞职信文稿与质检门槛',
        readinessTitle: '起草就绪状态与确认门槛',
        gateStatus: '4 项核心要素均已验证通过',
        traceabilityTitle: '来源溯源追踪',
        traceabilityDesc: '点击信件中的任一片段，查看其对应的已确认事实依据与措辞转化逻辑。',
        whyIncluded: '为何包含此句？',
        rewrittenBadge: '专业转译提炼',
        directInputBadge: '源自用户直接陈述',
        sourceFactLabel: '对应事实依据：',
        versionHistoryTitle: '版本历史与检查点',
        checkpoints: {
          created: '初稿生成',
          user_edited: '用户手动修改',
          ai_refined: 'AI 深度润色',
          approved: '用户最终确认',
        },
        viewVersion: '查看版本',
        restoreVersion: '恢复此版本',
        compareChanges: '对比版本差异',
        approvedBadge: '已确认就绪 (第5步)',
        approveButton: '确认并批准此稿件',
        openAudit: '运行职场礼仪审查',
        compareModalTitle: '版本变更对比',
        currentTextLabel: '当前版本文稿',
        previousTextLabel: '历史版本文稿',
        closeModal: '关闭对比',
      },
    },
    langSwitcher: {
      label: 'EN / 中文',
      en: 'English',
      zh: '简体中文',
      letterLangTitle: '辞职信语言',
      followInterface: '跟随界面语言',
      english: '英文 (English)',
      chinese: '简体中文 (Chinese)',
    },
    chat: {
      title: '辞职信代笔助手',
      badge: '知心朋友',
      subtitle: '将职场委屈与困境，转化为体面、专业、无可指摘的正式辞职信',
      newSession: '新会话',
      newSessionConfirm: '确定开启新会话吗？这将重置4项信息跟踪进度并开始全新录入。',
      interactionLoop: '互动流程：',
      steps: {
        step1: '步骤 1：倾倒原始想法与委屈',
        step2: '步骤 2：倾听理解与逐项明确',
        step3: '步骤 3：共情确认与要点提炼',
        step4: '步骤 4：生成草稿与迭代修改',
        step5: '步骤 5：最终确认（回复"好"）',
      },
      tracker: {
        title: '必填信息跟踪器',
        capturedCount: (n) => `已记录 ${n} / 4 项`,
        showChecklist: '展开检查项',
        hideChecklist: '收起检查项',
        items: {
          reason: { label: '1. 辞职主要原因', placeholder: '尚未提供' },
          experiences: { label: '2. 困境经历 / 真实感受', placeholder: '尚未提供' },
          whatToSay: { label: '3. 信中陈述与最后工作日', placeholder: '尚未明确（需具体日期）' },
          whatNotToSay: { label: '4. 保护边界（绝不能提的内容）', placeholder: '初始为空（由您自主决定）' },
        },
      },
      guardrails: {
        button: '设置保护边界（信中“绝不能提”的内容）',
        activeApplied: '已应用保护边界',
        tip: '点击设置隐私与职场保护规则，确保信件不留隐患：',
        options: [
          '绝对不要提及下家公司名称或薪酬待遇',
          '绝对不要在正式书面记录中留下任何情绪宣泄或人际控诉',
          '明确离职日期，不接受任何形式的挽留或延期建议',
          '表明辞意已决，关闭任何挽留谈判的空间',
          '原因仅表述为个人健康或家庭发展，不作过多解释',
          '最后工作日之前仅保留工作沟通，不留个人私人联络方式',
        ],
      },
      starters: {
        title: '步骤 1：倾诉真实想法（可点击快速开始或自行输入）：',
        items: [
          { label: '管理层霸道与微观管理', text: '直属领导总是微观管理、抢夺功劳，团队氛围令人窒息，我实在无法继续忍受了。' },
          { label: '严重内卷与过度疲惫', text: '长期无休止加班且缺乏资源支持，身心健康已经严重透支，我需要停下来休整。' },
          { label: '晋升承诺落空与职业停滞', text: '公司一年多前承诺的晋升和调薪一拖再拖，工作量却不断翻倍，我看不到未来。' },
          { label: '获得更好机会准备跳槽', text: '我已经拿到了薪资和环境都更好的录用通知，希望能体面、顺利地完成工作交接。' },
        ],
      },
      reflectionTitle: '为你提炼的核心关切：',
      questionsTitle: '需要进一步明确的细节：',
      answerThis: '回答此问题',
      approvedTitle: '信件已确认就绪',
      approvedDesc: '草稿已达到正式提交标准，你可以放心复制、打印或导出为正式文件。',
      approvedBannerText: '你已确认本辞职信。文稿已就绪，可随时递交主管。',
      reopenRevision: '重新调整修改',
      approvalPrompt: '这份草稿是否体面且精准地表达了你的诉求？',
      keepTweaking: '继续调整细节',
      approveButton: '好，这就够了 / 确认可用',
      inputPlaceholderStep1: '先说出真实想法：发生了什么事？是什么让你决定离开？',
      inputPlaceholderDefault: '回复代笔助手、确认日期，或提出任何修改意见...',
      sendButton: '发送消息',
      pressEnter: '按回车直接发送',
      apiDisclosure: '文字将发送至 Gemini 模型生成回复。请勿输入密码等敏感凭据。',
      loadingGhostwriter: '辞职信代笔助手正在倾听并起草信件...',
      errorMessagePrefix: '代笔服务提示：',
      errorTroubleshoot: '请检查网络连接及 API 配置。',
      retryThisMessage: '重试此消息',
    },
    composer: {
      title: '新辞职个案录入',
      subtitle: '将你的情况详细告知代笔助手，以便进行梳理与确认',
      reasonLabel: '你辞职的主要原因是什么？',
      reasons: [
        '请选择离职原因（或在下方自行描述）',
        '管理不善 / 职场氛围恶劣',
        '长期严重过劳 / 身体难以支撑',
        '晋升承诺落空 / 职业发展受阻',
        '薪资待遇偏低 / 付出未获认可',
        '已接受外部更好的工作录用机会',
        '个人与家庭健康优先考量',
        '其他原因 / 用自己的话描述',
      ],
      experiencesLabel: '具体发生了什么？（真实经历、委屈感受或具体事件）',
      experiencesPlaceholder: '用自己的话描述具体发生的事情（例如：微观管理、不公待遇、过劳等）。助手会协助你将这些转化为专业得体的语言。',
      toneLabel: '信件基调风格',
      tones: [
        { id: 'Calm & Dignified', label: '从容体面 (Calm & Dignified)', desc: '克制专业，既不卑不亢，又保护未来人脉背景调查' },
        { id: 'Strictly Neutral & Minimalist', label: '极简中立 (Strictly Neutral)', desc: '零情绪暴露，仅包含法定的离职通知与交接日期' },
        { id: 'Firm & Uncompromising', label: '坚定明确 (Firm & Uncompromising)', desc: '立场坚决，不留任何挽留谈判与反聘回旋余地' },
        { id: 'Diplomatic & Gracious', label: '礼貌周全 (Diplomatic & Gracious)', desc: '维护同事与前司善意关系，体面优雅地告别' },
      ],
      dateLabel: '预计最后工作日（明确日期）',
      datePlaceholder: '具体日期（例如：2026年11月14日）',
      dateHelp: '请写明你计划的最后工作日。我们绝不擅自假设“两周后”或擅自推算日期。',
      letterLangLabel: '辞职信语言版本',
      letterLangHelp: '可将辞职信输出语言与界面语言独立设置。',
      letterLangOptions: [
        { id: 'follow', label: '跟随界面语言', desc: '根据当前软件界面语言自动输出相应语言的辞职信' },
        { id: 'zh', label: '简体中文 (Simplified Chinese)', desc: '符合中文正式辞职信/辞职报告公文规范（尊敬的领导、此致敬礼等）' },
        { id: 'en', label: '英文 (English)', desc: '符合标准英文商业信函规范（Formal Business Resignation Letter）' },
      ],
      guardrailsLabel: '保护边界：你绝对不想在信中提及什么？',
      guardrailsPlaceholder: '可留空，或注明需排除的话题（例如：不提下家公司名称、不留任何文字控诉等）',
      senderSectionLabel: '你的姓名与职务（选填）',
      senderNamePlaceholder: '你的姓名',
      senderTitlePlaceholder: '你的岗位 / 职称',
      recipientSectionLabel: '主管与公司名称（选填）',
      supervisorNamePlaceholder: '直属主管姓名',
      companyNamePlaceholder: '所属公司 / 部门名称',
      dataNoticeTitle: '数据提示：',
      dataNoticeText: '此处提交的内容将通过服务器发送给 Google Gemini API 用于结构化分析与起草。请勿输入涉密商业秘密或个人密码。',
      cancel: '取消',
      submit: '提交给代笔助手处理',
      initialCaseIntro: '以下是我的辞职个案详细情况：',
      coreReasonLine: '主要原因：',
      experiencesLine: '经历情况与感受：',
      finalDateLine: '明确最后工作日：',
      guardrailsLine: '保护边界（绝不可提及）：',
      toneLine: '基调倾向：',
      letterLangLine: '所选信件语言：',
      myNameLine: '本人姓名：',
      supervisorLine: '直属主管：',
      companyLine: '所在公司：',
    },
    stationery: {
      paperStyle: '信纸质感：',
      fontStyle: '字体样式：',
      sizeStyle: '字号大小：',
      styles: [
        { id: 'classic', label: '典雅米白' },
        { id: 'modern', label: '简约纯白' },
        { id: 'executive', label: '商务深邃' },
        { id: 'parchment', label: '质朴羊皮' },
        { id: 'minimal', label: '素净无界' },
      ],
      fonts: [
        { id: 'serif-reading', label: '宋体/衬线 (Noto Serif SC)' },
        { id: 'serif-classic', label: '经典衬线 (Lora / Serif)' },
        { id: 'display-serif', label: '典雅标题 (Formal Serif)' },
        { id: 'sans-clean', label: '黑体/无衬线 (Noto Sans SC)' },
      ],
      sizes: [
        { id: 'sm', label: '紧凑' },
        { id: 'base', label: '标准' },
        { id: 'lg', label: '宽松' },
      ],
    },
    letter: {
      verifiedBadge: '已由你确认（可直接提交）',
      liveDraftBadge: '实时代笔文稿',
      wordCount: (n) => `${n} 字`,
      readingTime: (n) => `约 ${n} 分钟阅读`,
      copy: '复制全文',
      copied: '已复制',
      download: '下载文稿',
      print: '打印 / 导出PDF',
      manualEdit: '手动微调',
      doneEditing: '完成编辑',
      senderInfoLabel: '发信人信息：',
      senderNamePlaceholder: '你的全名',
      senderTitlePlaceholder: '你的职位 / 部门',
      senderContactPlaceholder: '个人邮箱 • 个人电话（选填）',
      defaultSenderName: '本人姓名',
      dateLabel: '日期：',
      datePlaceholder: '日期',
      recipientDetailsLabel: '接收主管 / 收件人信息：',
      recipientNamePlaceholder: '主管姓名',
      recipientTitlePlaceholder: '主管职务',
      recipientOrgPlaceholder: '公司名称（例如：某某科技有限公司）',
      recipientAddressPlaceholder: '办公地址（选填）',
      subjectLabel: '事由：',
      subjectPlaceholder: '辞职申请 — [你的姓名]',
      salutationPlaceholder: '尊敬的[主管姓名]：',
      defaultSalutation: '尊敬的领导：',
      bodyPlaceholder: '正式辞职信正文将在此显示。段落之间用空行分隔。',
      bodyHelp: '提示：辞职信代笔助手会自动将你的真实感受转化为符合职业规范的得体文字。',
      emptyDraftTitle: '辞职信草稿目前为空。',
      emptyDraftDesc: '在左侧向辞职信代笔助手描述你的情况，即可为你量身生成专属辞职信。',
      closingPlaceholder: '此致 敬礼',
      defaultClosing: '此致 敬礼',
      signatureLabel: '本人署名',
      defaultSignoffName: '申请人：[姓名]',
      psLabel: '附言 (P.S.)',
      psPlaceholder: '选填说明（例如：给私交较好同事的私人联络方式）',
      safeguardsTitle: '代笔助手专业防护建议：',
    },
    drawer: {
      title: '代笔助手文本润色与合规审查',
      subtitle: '过滤潜藏的情绪化言辞，审查信件格式与职业得体度',
      tabRefine: '一键语气调整',
      tabAudit: '礼仪与得体度审查',
      quickActionsTitle: '常用润色指令',
      quickActionsDesc: '选择适用的语气调整规则，重写辞职信正文：',
      actions: [
        {
          id: 'cool-down',
          title: '降温与消除攻击性',
          desc: '剔除潜意识里的被动攻击或隐晦抱怨，确保通篇克制、得体、礼貌。',
          actionPrompt: '去除任何潜藏的对立、被动攻击或抱怨情绪，保持措辞极度克制、优雅且专业。',
        },
        {
          id: 'concise-focused',
          title: '凝练聚焦（删繁就简）',
          desc: '删去非必要的辩解与理由，仅保留正式离职通知、截止日期与交接承诺。',
          actionPrompt: '使信件更加清晰凝练。删去个人解释，严格聚焦于：离职意向陈述、明确最后工作日、标准交接承诺。',
        },
        {
          id: 'firm-boundaries',
          title: '坚定边界（谢绝挽留）',
          desc: '清晰说明此决定经过深思熟虑且不可更改，避免陷入尴尬的挽留拉锯。',
          actionPrompt: '礼貌但坚定地表明此决定系深思熟虑之最终决定，在不失礼貌的前提下关闭挽留协商空间。',
        },
        {
          id: 'peer-handover',
          title: '重视同事交接与情谊',
          desc: '强化对平级同事的协作与顺利交接承诺，同时与管理层保持恰当界限。',
          actionPrompt: '扩充工作交接部分，强调对团队伙伴的负责与协作，梳理交接清单，同时对上层保持得体边界。',
        },
        {
          id: 'urgent-short',
          title: '转为紧急/缩短通知期',
          desc: '因身体原因或突发紧急情况，得体地申请提前离职与资产交接。',
          actionPrompt: '根据不可预见的个人情况，将信件调整为申请提前离职或即刻生效通知，并明确资产归还与交接流程。',
        },
      ],
      customPromptLabel: '自定义修改指示',
      customPromptPlaceholder: '例如：缩短为精简的两段，并真诚感谢我的业务导师张经理...',
      applyCustomButton: '执行自定义指令',
      proposedChangesTitle: '代笔助手建议的修改方案：',
      applyToLetter: '应用此修改至信件',
      discard: '放弃本次修改',
      auditTitle: '信件得体度与规范评估',
      auditDesc: '评估辞职信的语气克制程度、边界清晰度以及标准公文信函规范。本工具不提供法律咨询。',
      runAuditButton: '开始得体度审查',
      auditRunning: '正在审查信件语气与规范...',
      auditVerdictLabel: '总体评价：',
      toneAnalysisLabel: '语气与克制度分析：',
      strengthsLabel: '行文亮点与保护性：',
      recommendationsLabel: '改进建议：',
      etiquetteCheckLabel: '礼仪与格式规范：',
      processing: '处理中...',
    },
    templates: {
      title: '辞职情境范本与基调原型',
      subtitle: '专为艰难离职场景设计的成熟公文框架与自护范式。',
      categories: [
        { id: 'All', label: '全部范本' },
        { id: 'Toxic Workplace & Protection', label: '恶劣环境与自我保护' },
        { id: 'Burnout & Well-being', label: '过劳休整与身心健康' },
        { id: 'Broken Promises & Stagnation', label: '承诺落空与职业受阻' },
        { id: 'Strictly Neutral & Minimalist', label: '极简中立与规避风险' },
        { id: 'Immediate & Urgent', label: '紧急事由与快速离场' },
        { id: 'Diplomatic & Gracious', label: '礼貌周全与友善告别' },
      ],
      previewTitle: '范本框架预览',
      suggestedPointsLabel: '核心策略与重点：',
      safeguardsLabel: '代笔助手保护性指引：',
      useTemplate: '采用此范本架构',
      sampleSubject: '辞职申请',
    },
    saved: {
      title: '本地保存的草稿箱',
      subtitle: '已保存在本设备本地存储中的辞职信历史版本。',
      empty: '暂无保存的历史草稿。输入或生成内容时将自动为您保存。',
      currentBadge: '当前草稿',
      words: (n) => `${n} 字`,
      load: '载入此草稿',
      duplicate: '复制一份',
      delete: '删除',
      close: '关闭',
    },
    diagram: {
      title: '关于应用与系统架构全景图',
      subtitle: '端到端组件数据流、Gemini Agent 交互回路与运行时安全边界',
      legendTitle: '组件类型图例',
      legends: {
        user: '用户输入交互',
        ui: '前端界面组件',
        agent: '智能体行为逻辑',
        server: '服务端基础设施',
        external: '外部 Gemini API',
      },
      primaryFlowTitle: '系统主干运行链路',
      primaryFlowSubtitle: '用户主导的闭环交互周期',
      primaryFlowDesc: '用户 → 诉求录入与倾诉 → 4项完整性验证 → 辞职信代笔智能体 → 辞职信草稿 → 用户审阅 → 逐项调整或最终确认',
      flowSteps: {
        step1: '1. 用户输入与情绪倾倒',
        step2: '2. 诉求录入与对话澄清',
        step3: '3. 4项必填信息验证闸门',
        step4: '4. 辞职信代笔智能体 (Ghostwriter)',
        step5: '5. 正式辞职信草稿生成',
        step6: '6. 用户审阅与意愿确认',
        step7: '7. 成果交付 (复制/下载/打印)',
      },
      bilingualSectionTitle: '双语体系与本地化架构',
      bilingualSectionSubtitle: '完善的中英文无缝支持与独立语言解耦体系',
      bilingualItems: {
        switcher: {
          title: '语言切换器 (EN / 中文)',
          desc: '固定位于顶部导航栏。一键即时切换英文与简体中文，绝不重置对话历史、不清除4项跟踪器、不重置草稿，亦不触发多余的 API 调用。状态持久化于 localStorage。',
        },
        dictionary: {
          title: '集中式本地化词典 (src/i18n.ts)',
          desc: '全系统统一管理所有界面文案、按钮、表单、提示、校验信息与架构图文本，彻底杜绝零散硬编码与混合语言残留。',
        },
        interfaceLang: {
          title: '当前界面语言 (Interface Language)',
          desc: (lang) => `当前激活：${lang === 'zh' ? '简体中文 (Simplified Chinese)' : '英文 (English)'}。所有按钮、表单与状态即时同步。`,
        },
        letterLang: {
          title: '所选辞职信语言 (Letter Language)',
          desc: (lang) => `当前设定：${lang === 'zh' ? '简体中文 (遵循中文正式辞职信格式)' : lang === 'en' ? '英文 (遵循标准商业信函格式)' : '跟随界面语言 (自动与界面语言同步)'}。可与界面语言完全解耦独立选择。`,
        },
        promptInstruction: {
          title: '传递给 Agent 的语言指令',
          desc: '服务端将用户的语言偏好精确注入 Prompt 系统指令：智能体在聊天互动中用所选界面语言自然交流，在撰写辞职信时严格按所选信件语言输出（中文信函严格遵循“尊敬的领导/此致敬礼/交接承诺”等公文规范）。',
        },
      },
      loopTitle: '5步交互循环（Interaction Loop）',
      loopSteps: {
        l1: { title: '步骤 1：倾倒原始想法', desc: '先倾听用户的真实委屈、负面经历与离职痛点，提供情绪支持。' },
        l2: { title: '步骤 2：逐项澄清事实', desc: '一次只问一个问题，理清离职缘由与具体诉求，绝不擅自揣测编造。' },
        l3: { title: '步骤 3：共情反思提炼', desc: '向用户反馈核心诉求摘要，确认理解无误后，征得同意方才起草。' },
        l4: { title: '步骤 4：起草与迭代调整', desc: '生成正式体面的辞职信，根据用户提出的细节与语气偏好随时修订。' },
        l5: { title: '步骤 5：最终确认（回复"好"）', desc: '当用户明确表示满意（如回复"好/可以"）时锁定状态，完成交付。' },
      },
      trackerSectionTitle: '必填信息跟踪器 (0/4 Gate)',
      trackerSectionDesc: '代笔助手受严格规则约束，在4项要素齐全并经用户确认前，绝不擅自出稿：',
      trackerItems: {
        t1: { title: '1. 离职缘由', desc: '离开岗位的核心动因' },
        t2: { title: '2. 负面经历', desc: '真实发生的职场遭遇与阻碍' },
        t3: { title: '3. 陈述意向与日期', desc: '明确打算在信中传达的事项及确切最后工作日（绝不默认两周）' },
        t4: { title: '4. 保护边界', desc: '绝不可在信中提及的事项（防范反扑与口实）' },
      },
      boundariesTitle: '运行安全与隐私隔离边界',
      boundariesDesc: '保障用户数据与安全凭据的架构措施：',
      boundaryItems: {
        client: { title: '浏览器客户端 (3000端口)', desc: 'React 单页应用渲染，数据保存在内存及 localStorage。前端代码完全不接触 API 密钥。' },
        server: { title: 'Node/Express 服务端 (3000端口)', desc: '隔离保管 GEMINI_API_KEY，负责安全校验、提示词封装与严格的 JSON Schema 模式约束。' },
        external: { title: 'Google Gemini 2.5 Flash', desc: '通过 Google GenAI 官方 SDK 执行生成。绝不向外暴露用户密码等绝密数据。' },
      },
      close: '关闭架构图',
    },
    toast: {
      letterApproved: '辞职信已确认就绪！可随时提交给主管。',
      freshSessionStarted: '已开启全新会话：所有字段已清空，跟踪器重置为 0/4。',
      caseDetailsShared: '个案详情已同步给代笔助手。',
      loadedScenario: (name) => `已载入「${name}」情境范本。`,
      loadedDraft: (name) => `已载入草稿：${name}`,
      draftDeleted: '草稿已删除。',
      draftDuplicated: '草稿已成功复制。',
      appliedPolish: (summary) => summary ? `已应用优化：${summary}` : '已完成辞职信润色。',
      languageChanged: (langName) => `界面语言已切换为 ${langName}。`,
    },
    initialAssistantMessage: `你好，我是你的辞职信代笔助手（Resignation Ghostwriter）。你可以把我当成站在你这边的支持性朋友，而不是人力资源（HR），更绝不是你的老板。\n\n在经历了不公待遇、严重内卷或糟糕的职场经历后选择离开，往往让人身心俱疲。我的职责就是协助你将这些真实感受与经历，转化为体面、专业、无可指摘的正式辞职信，让你以完全的尊严从容告别，并保护好你未来的职业信誉。\n\n让我们从第1步开始：你在工作中遇到了哪些难以忍受的情况？是什么让你决定离开这份工作？不妨直接告诉我最真实、未经修饰的想法。`,
  },
};

export function getTranslation(lang: Language): TranslationSchema {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

export const TRANSIENT_BUSY_MESSAGE_EN =
  "Gemini is temporarily busy. Your information has not been lost. Please retry this message in a moment.";

export const TRANSIENT_BUSY_MESSAGE_ZH =
  "Gemini 暂时繁忙。您提供的信息未丢失，请稍后重试此消息。";

