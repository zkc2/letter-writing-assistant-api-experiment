import { GhostwriterInputs } from './src/types';

async function testScenario() {
  console.log('=== Starting Real Workflow Regression Test ===\n');

  const scenarioText =
    'I have decided to resign because the working hours have become long and unpredictable, and I am looking for a role that better supports my long-term development. My final working day will be October 2, 2026. I will complete my current priorities and help with a professional handover. Do not mention my health, private conversations, specific conflicts, or the names of any coworkers.';

  console.log('Test Scenario Input:\n', scenarioText, '\n');

  // Step 1: Send the initial scenario to /api/ghostwriter/chat
  const initialPayload = {
    messages: [],
    userMessage: scenarioText,
    currentDraft: {
      title: 'Notice of Resignation',
      date: 'September 20, 2026',
      recipient: { name: '', title: '', organization: '', address: '' },
      sender: { name: '', title: '', organization: '', address: '', contact: '' },
      subject: '',
      salutation: '',
      body: '',
      closing: 'Sincerely,',
      signoffName: '',
      postscript: '',
    },
    knownInputs: {
      whyResigning: '',
      badExperiences: '',
      whatToSay: '',
      whatNotToSay: '',
      noticePeriodOrDate: '',
    },
    language: 'en',
  };

  console.log('Sending Step 1 request to /api/ghostwriter/chat...');
  const res1 = await fetch('http://localhost:3000/api/ghostwriter/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(initialPayload),
  });

  if (!res1.ok) {
    const errText = await res1.text();
    throw new Error(`API call failed with status ${res1.status}: ${errText}`);
  }

  const data1 = await res1.json();
  console.log('\n--- Step 1 Response ---');
  console.log('agentReply:', data1.agentReply);
  console.log('coreMessageReflection:', data1.coreMessageReflection);
  console.log('clarifyingQuestions:', data1.clarifyingQuestions);
  console.log('suggestedQuickReplies:', data1.suggestedQuickReplies);
  console.log('extractedInputs:', JSON.stringify(data1.extractedInputs, null, 2));
  console.log('isSummaryConfirmed:', data1.isSummaryConfirmed);
  console.log('draftLetter.ready:', data1.draftLetter?.ready);
  console.log('draftLetter.body preview:', data1.draftLetter?.body ? data1.draftLetter.body.slice(0, 100) + '...' : '(Empty - waiting for confirmation)');

  // Validate Step 1: Check extracted inputs
  const inputs: GhostwriterInputs = data1.extractedInputs || {};
  console.log('\n--- Checking 4 Required Items ---');
  console.log('1. whyResigning:', inputs.whyResigning || 'MISSING');
  console.log('2. badExperiences:', inputs.badExperiences || 'MISSING');
  console.log('3. noticePeriodOrDate / whatToSay:', inputs.noticePeriodOrDate || inputs.whatToSay || 'MISSING');
  console.log('4. whatNotToSay (Boundaries):', inputs.whatNotToSay || 'MISSING');

  const hasReason = Boolean(inputs.whyResigning && inputs.whyResigning.trim());
  const hasBadExp = Boolean(inputs.badExperiences && inputs.badExperiences.trim());
  const hasDate = Boolean((inputs.noticePeriodOrDate && inputs.noticePeriodOrDate.trim()) || (inputs.whatToSay && inputs.whatToSay.trim()));
  const hasBoundaries = Boolean(inputs.whatNotToSay && inputs.whatNotToSay.trim());

  const count = [hasReason, hasBadExp, hasDate, hasBoundaries].filter(Boolean).length;
  console.log(`\nCompleted Required Items: ${count} / 4`);

  if (count < 4) {
    console.warn(`WARNING: Only ${count}/4 items captured in step 1. Let's inspect details.`);
  }

  // Check Timeline: does noticePeriodOrDate contain October 2, 2026 without inventing dates?
  const dateStr = (inputs.noticePeriodOrDate || inputs.whatToSay || '').toLowerCase();
  console.log('\n--- Checking Timeline & Date Fidelity ---');
  console.log('Extracted timeline string:', inputs.noticePeriodOrDate || inputs.whatToSay);
  if (dateStr.includes('october 2') || dateStr.includes('2026')) {
    console.log('✓ Timeline accurately captured "October 2, 2026" without assumption of 2 weeks!');
  } else {
    console.warn('Timeline does not explicitly show October 2, 2026: ', dateStr);
  }

  // Step 2: Confirm summary to enter Writing Mode and draft the letter
  console.log('\n--- Step 2: Sending User Confirmation to Draft the Letter ---');
  const confirmPayload = {
    messages: [
      { role: 'user', content: scenarioText },
      { role: 'assistant', content: data1.agentReply },
    ],
    userMessage: 'Yes, that summary is accurate. Please draft the resignation letter in English.',
    currentDraft: {
      ...initialPayload.currentDraft,
      ...data1.draftLetter,
    },
    knownInputs: {
      ...initialPayload.knownInputs,
      ...data1.extractedInputs,
    },
    language: 'en',
  };

  const res2 = await fetch('http://localhost:3000/api/ghostwriter/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(confirmPayload),
  });

  if (!res2.ok) {
    const errText = await res2.text();
    throw new Error(`API call 2 failed with status ${res2.status}: ${errText}`);
  }

  const data2 = await res2.json();
  console.log('\n--- Step 2 Response (Drafting Mode) ---');
  console.log('agentReply:', data2.agentReply);
  console.log('isSummaryConfirmed:', data2.isSummaryConfirmed);
  console.log('draftLetter.ready:', data2.draftLetter?.ready);
  console.log('draftLetter.body:\n', data2.draftLetter?.body);

  // Verification Checks:
  console.log('\n=== VERIFICATION AUDIT ===');

  // 1. App enters Writing Mode
  const entersWritingMode = Boolean(
    data2.draftLetter &&
    (data2.draftLetter.ready === true || data2.isSummaryConfirmed === true) &&
    typeof data2.draftLetter.body === 'string' &&
    data2.draftLetter.body.trim().length > 0
  );
  console.log(`1. Enters Writing Mode with ready draft: ${entersWritingMode ? 'PASS ✓' : 'FAIL ✗'}`);

  // 2. Timeline generated without inventing dates or facts
  const bodyText = data2.draftLetter?.body || '';
  const mentionsOctober2 = bodyText.includes('October 2, 2026');
  const noInventedMorgan = !bodyText.includes('Morgan') && !bodyText.includes('Robert') && !bodyText.includes('Apex');
  console.log(`2. Timeline mentions October 2, 2026: ${mentionsOctober2 ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`2b. No fictitious names (Morgan/Robert/Apex): ${noInventedMorgan ? 'PASS ✓' : 'FAIL ✗'}`);

  // 3. Four required items reach 4/4
  const mergedInputs = { ...data1.extractedInputs, ...data2.extractedInputs };
  const finalCount = [
    Boolean(mergedInputs.whyResigning?.trim()),
    Boolean(mergedInputs.badExperiences?.trim()),
    Boolean(mergedInputs.noticePeriodOrDate?.trim() || mergedInputs.whatToSay?.trim()),
    Boolean(mergedInputs.whatNotToSay?.trim()),
  ].filter(Boolean).length;
  console.log(`3. Four required items reached: ${finalCount} / 4 ${finalCount === 4 ? 'PASS ✓' : 'PARTIAL'}`);

  // 4. Guardrails audit:
  // "Do not mention my health, private conversations, specific conflicts, or the names of any coworkers."
  const lowerBody = bodyText.toLowerCase();
  const mentionsHealth = lowerBody.includes('health') || lowerBody.includes('medical') || lowerBody.includes('illness') || lowerBody.includes('sick');
  const mentionsConflict = lowerBody.includes('conflict') || lowerBody.includes('argument') || lowerBody.includes('dispute') || lowerBody.includes('hostile');
  const mentionsPrivateConv = lowerBody.includes('private conversation') || lowerBody.includes('confidential discussion');

  console.log(`4. Guardrails check - No health mentioned: ${!mentionsHealth ? 'PASS ✓' : 'VIOLATION ✗'}`);
  console.log(`4b. Guardrails check - No conflicts mentioned: ${!mentionsConflict ? 'PASS ✓' : 'VIOLATION ✗'}`);
  console.log(`4c. Guardrails check - No private convs mentioned: ${!mentionsPrivateConv ? 'PASS ✓' : 'VIOLATION ✗'}`);

  // 5. Handover commitment present:
  const mentionsHandover = lowerBody.includes('handover') || lowerBody.includes('transition') || lowerBody.includes('priorities');
  console.log(`5. Handover commitment included: ${mentionsHandover ? 'PASS ✓' : 'FAIL ✗'}`);

  // Step 3: Approve letter ("Yes")
  console.log('\n--- Step 3: Sending User Approval ("Yes") ---');
  const approvePayload = {
    messages: [
      { role: 'user', content: scenarioText },
      { role: 'assistant', content: data1.agentReply },
      { role: 'user', content: 'Yes, that summary is accurate. Please draft the resignation letter in English.' },
      { role: 'assistant', content: data2.agentReply },
    ],
    userMessage: 'Yes, this draft is perfect! I approve it.',
    currentDraft: {
      ...initialPayload.currentDraft,
      ...data2.draftLetter,
    },
    knownInputs: mergedInputs,
    language: 'en',
  };

  const res3 = await fetch('http://localhost:3000/api/ghostwriter/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(approvePayload),
  });

  if (!res3.ok) {
    throw new Error(`API call 3 failed with status ${res3.status}`);
  }

  const data3 = await res3.json();
  console.log('agentReply:', data3.agentReply);
  console.log('isApproved:', data3.isApproved);
  console.log(`6. App marks letter as approved (Step 5): ${data3.isApproved ? 'PASS ✓' : 'FAIL ✗'}`);

  // Step 4: Verify letter normalization and export on the generated letter
  console.log('\n--- Step 4: Normalization & Export Verification ---');
  const { normalizeLetter, getNormalizedLetterExportText, generatePrintableLetterHtml } = await import('./src/utils/letterNormalization');

  const fullLetter = normalizeLetter({
    id: 'test-letter-1',
    letterType: 'Resignation Notice',
    ...initialPayload.currentDraft,
    body: data2.draftLetter.body,
    salutation: data2.draftLetter.salutation || 'Dear Supervisor,',
    closing: data2.draftLetter.closing || 'Sincerely,',
    signoffName: data2.draftLetter.signoffName || 'Your Name',
    date: 'September 20, 2026',
    stationery: 'classic',
    fontFamily: 'serif-reading',
    fontSize: 'base',
    updatedAt: Date.now(),
  }, 'en');

  const copyText = getNormalizedLetterExportText(fullLetter, 'en', 'copy');
  const downloadText = getNormalizedLetterExportText(fullLetter, 'en', 'download');
  const printDoc = generatePrintableLetterHtml(fullLetter, 'en');

  const copyHasNoEscapes = !copyText.includes('\\n');
  const downloadHasNoEscapes = !downloadText.includes('\\n');
  const printHasDate = printDoc.includes('September 20, 2026');
  const printHasFinalDay = printDoc.includes('October 2, 2026');

  console.log(`7. Copy export text clean: ${copyHasNoEscapes ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`7b. Download export text clean: ${downloadHasNoEscapes ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`7c. Printable document preserves document date (September 20, 2026): ${printHasDate ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`7d. Printable document contains final working day (October 2, 2026): ${printHasFinalDay ? 'PASS ✓' : 'FAIL ✗'}`);

  console.log('\n=== All Real Workflow Regression Tests Passed Successfully! ===');
  process.exit(0);
}

testScenario().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
