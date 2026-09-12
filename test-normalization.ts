import {
  normalizeLetterBody,
  normalizeLetter,
  unescapeNewlines,
  getNormalizedLetterExportText,
  generatePrintableLetterHtml,
  getPrintBlockedMessage,
  PRINT_BLOCKED_MESSAGE_EN,
  PRINT_BLOCKED_MESSAGE_ZH,
} from './src/utils/letterNormalization';
import { LetterContent } from './src/types';

function runNormalizationTests() {
  console.log('Running focused newline normalization and printable document tests...\n');

  // Focused requirement test:
  // "First paragraph.\n\nSecond paragraph.\n\nThird paragraph." where \n are literal escaped characters
  const escapedInput = 'First paragraph.\\n\\nSecond paragraph.\\n\\nThird paragraph.';

  console.log('1. Testing unescapeNewlines:');
  const unescaped = unescapeNewlines(escapedInput);
  if (unescaped.includes('\\n')) {
    throw new Error(`unescapeNewlines failed: still contains literal \\n: ${unescaped}`);
  }
  console.log('✓ unescapeNewlines cleanly converted escaped \\n into real newlines.');

  console.log('\n2. Testing normalizeLetterBody with literal escaped input:');
  const result = normalizeLetterBody(escapedInput);
  
  if (result.body.includes('\\n')) {
    throw new Error(`normalizeLetterBody failed: result.body still contains literal \\n: ${result.body}`);
  }
  if (result.body.includes('\\r')) {
    throw new Error(`normalizeLetterBody failed: result.body still contains literal \\r: ${result.body}`);
  }

  const paragraphs = result.body.split('\n\n');
  if (paragraphs.length !== 3) {
    throw new Error(`Expected exactly 3 paragraphs, but got ${paragraphs.length}: ${JSON.stringify(paragraphs)}`);
  }

  if (paragraphs[0] !== 'First paragraph.') {
    throw new Error(`Paragraph 1 mismatch: expected "First paragraph.", got "${paragraphs[0]}"`);
  }
  if (paragraphs[1] !== 'Second paragraph.') {
    throw new Error(`Paragraph 2 mismatch: expected "Second paragraph.", got "${paragraphs[1]}"`);
  }
  if (paragraphs[2] !== 'Third paragraph.') {
    throw new Error(`Paragraph 3 mismatch: expected "Third paragraph.", got "${paragraphs[2]}"`);
  }
  console.log('✓ Verified: No literal "\\n" remains.');
  console.log(`✓ Verified: Produced exactly ${paragraphs.length} paragraphs:`);
  paragraphs.forEach((p, idx) => console.log(`   Paragraph ${idx + 1}: "${p}"`));

  console.log('\n3. Testing normalizeLetter with full letter structure:');
  const mockLetter: LetterContent = {
    id: 'test-letter',
    title: 'Notice of Resignation',
    date: 'September 12, 2026',
    letterType: 'Resignation Notice',
    sender: {
      name: 'Jordan Lee',
      title: 'Senior Product Designer',
      organization: '',
      address: '',
      contact: '',
    },
    recipient: {
      name: 'Maya Chen',
      title: 'Engineering Director',
      organization: 'Acme Corp',
      address: '',
    },
    subject: 'Notice of Resignation',
    salutation: 'Dear Maya Chen,',
    body: 'Dear Maya Chen,\\n\\nPlease accept this letter as formal notification that I am resigning from my position as Senior Product Designer. My last day of employment will be September 30, 2026.\\n\\nI appreciate the opportunities I have had during my time with the team. Prior to my departure, I will focus on completing my pending tasks and assisting in ensuring a smooth and organized transition of my duties.\\n\\nI wish the company continued success.\\n\\nSincerely,\\n\\nJordan Lee\\nSenior Product Designer',
    closing: 'Sincerely,',
    signoffName: 'Jordan Lee',
    postscript: '',
    stationery: 'classic',
    fontFamily: 'serif-reading',
    fontSize: 'base',
    updatedAt: Date.now(),
  };

  const normalized = normalizeLetter(mockLetter, 'en');

  if (normalized.body.includes('\\n')) {
    throw new Error('normalizeLetter failed: normalized.body contains literal \\n');
  }

  const normParagraphs = normalized.body.split('\n\n');
  if (normParagraphs.length !== 3) {
    throw new Error(`Expected 3 body paragraphs, got ${normParagraphs.length}`);
  }

  // Ensure salutation is not duplicated in body
  if (normalized.body.includes('Dear Maya Chen')) {
    throw new Error('Duplicate salutation found inside normalized body');
  }
  // Ensure closing is not duplicated in body
  if (normalized.body.includes('Sincerely')) {
    throw new Error('Duplicate closing found inside normalized body');
  }
  // Ensure signoff name is not duplicated in body
  if (normalized.body.includes('Jordan Lee')) {
    throw new Error('Duplicate signoff name found inside normalized body');
  }
  // Ensure date remains creation date
  if (normalized.date !== 'September 12, 2026') {
    throw new Error(`Expected creation date 'September 12, 2026', got '${normalized.date}'`);
  }
  // Ensure final working date is in the body
  if (!normalized.body.includes('September 30, 2026')) {
    throw new Error('Final working date September 30, 2026 missing from body');
  }

  console.log('✓ Verified: normalizeLetter correctly removed embedded salutation/closing/signoff from escaped input.');
  console.log('✓ Verified: Document date in header remains "September 12, 2026".');
  console.log('✓ Verified: Final working date "September 30, 2026" is preserved in the letter body.');

  console.log('\n4. Testing Copy and Download exports:');
  const copyText = getNormalizedLetterExportText(mockLetter, 'en', 'copy');
  const downloadText = getNormalizedLetterExportText(mockLetter, 'en', 'download');

  if (copyText.includes('\\n') || downloadText.includes('\\n')) {
    throw new Error('Exports still contain literal \\n');
  }
  console.log('✓ Verified: Copy and Download exports contain no literal "\\n".');

  console.log('\n5. Testing generatePrintableLetterHtml requirements:');
  const printHtml = generatePrintableLetterHtml(mockLetter, 'en');

  // Check document creation date
  if (!printHtml.includes('September 12, 2026')) {
    throw new Error('Printable HTML missing document creation date');
  }
  // Check sender name and title
  if (!printHtml.includes('Jordan Lee') || !printHtml.includes('Senior Product Designer')) {
    throw new Error('Printable HTML missing sender name or title');
  }
  // Check recipient block
  if (!printHtml.includes('Maya Chen') || !printHtml.includes('Engineering Director') || !printHtml.includes('Acme Corp')) {
    throw new Error('Printable HTML missing recipient details');
  }
  // Check subject with exactly one colon
  if (!printHtml.includes('Subject: Notice of Resignation')) {
    throw new Error('Printable HTML missing formatted subject line');
  }
  if (printHtml.includes('Subject::') || printHtml.includes('SUBJECT::')) {
    throw new Error('Printable HTML contains duplicate subject colon');
  }
  // Check salutation
  if (!printHtml.includes('Dear Maya Chen,')) {
    throw new Error('Printable HTML missing salutation');
  }
  // Check that salutation occurs only in salutation block, not duplicated in body paragraphs
  const salutationMatches = printHtml.match(/Dear Maya Chen/g);
  if (!salutationMatches || salutationMatches.length !== 1) {
    throw new Error(`Salutation should appear exactly once, found ${salutationMatches ? salutationMatches.length : 0}`);
  }
  // Check body paragraphs
  if (!printHtml.includes('September 30, 2026') || !printHtml.includes('smooth and organized transition')) {
    throw new Error('Printable HTML missing core body paragraphs');
  }
  if (printHtml.includes('\\n') || printHtml.includes('\\r')) {
    throw new Error('Printable HTML contains literal escaped newlines');
  }
  // Check closing and signoff
  const closingMatches = printHtml.match(/Sincerely/g);
  if (!closingMatches || closingMatches.length !== 1) {
    throw new Error(`Closing should appear exactly once, found ${closingMatches ? closingMatches.length : 0}`);
  }
  const signoffMatches = printHtml.match(/Jordan Lee/g);
  // Sender name at top and signoff at bottom = 2 occurrences
  if (!signoffMatches || signoffMatches.length !== 2) {
    throw new Error(`Jordan Lee should appear exactly twice (header + signoff), found ${signoffMatches ? signoffMatches.length : 0}`);
  }
  console.log('✓ Verified: Printable HTML contains creation date, sender header, recipient block, subject with single colon, salutation, body paragraphs, closing, and signoff.');
  console.log('✓ Verified: Printable HTML has no literal escaped newlines or duplicate blocks.');

  console.log('\n6. Testing popup blocked error messages:');
  const enBlockedMsg = getPrintBlockedMessage('en');
  const zhBlockedMsg = getPrintBlockedMessage('zh');

  if (enBlockedMsg !== 'Printing was blocked. Please allow pop-ups and try again.') {
    throw new Error(`English blocked message mismatch: got "${enBlockedMsg}"`);
  }
  if (zhBlockedMsg !== '打印窗口被拦截，请允许弹出窗口后重试。') {
    throw new Error(`Chinese blocked message mismatch: got "${zhBlockedMsg}"`);
  }
  if (enBlockedMsg !== PRINT_BLOCKED_MESSAGE_EN || zhBlockedMsg !== PRINT_BLOCKED_MESSAGE_ZH) {
    throw new Error('Mismatch with exported constants');
  }
  console.log('✓ Verified: English blocked message matches: "Printing was blocked. Please allow pop-ups and try again."');
  console.log('✓ Verified: Chinese blocked message matches: "打印窗口被拦截，请允许弹出窗口后重试。"');

  console.log('\n7. Testing Chinese printable letter generation:');
  const mockZhLetter: LetterContent = {
    ...mockLetter,
    title: '正式辞职通知书',
    date: '2026年9月12日',
    subject: '辞职申请',
    salutation: '尊敬的陈主管：',
    body: '因个人职业发展需要，我特此提出辞呈。我的最后工作日为2026年9月30日。\\n\\n感谢团队在过去给予的指导与支持。我将全力协助做好交接工作。',
    closing: '此致\n敬礼',
    signoffName: '李想',
    sender: {
      name: '李想',
      title: '资深产品设计师',
      organization: '创新事业部',
      address: '',
      contact: 'li.xiang@example.com',
    },
    recipient: {
      name: '陈总监',
      title: '技术副总裁',
      organization: '某某科技有限公司',
      address: '',
    },
  };

  const zhPrintHtml = generatePrintableLetterHtml(mockZhLetter, 'zh');
  if (!zhPrintHtml.includes('2026年9月12日')) {
    throw new Error('Chinese printable HTML missing date');
  }
  if (!zhPrintHtml.includes('李想') || !zhPrintHtml.includes('资深产品设计师')) {
    throw new Error('Chinese printable HTML missing sender info');
  }
  if (!zhPrintHtml.includes('陈总监') || !zhPrintHtml.includes('技术副总裁')) {
    throw new Error('Chinese printable HTML missing recipient info');
  }
  if (!zhPrintHtml.includes('事由：辞职申请')) {
    throw new Error('Chinese printable HTML missing subject with single colon');
  }
  if (zhPrintHtml.includes('事由：：')) {
    throw new Error('Chinese printable HTML contains double colon');
  }
  if (!zhPrintHtml.includes('尊敬的陈主管：')) {
    throw new Error('Chinese printable HTML missing salutation');
  }
  if (!zhPrintHtml.includes('此致') || !zhPrintHtml.includes('敬礼')) {
    throw new Error('Chinese printable HTML missing closing');
  }
  console.log('✓ Verified: Chinese printable letter HTML generated properly with correct subject, salutation, body, and closing.');

  console.log('\nAll normalization and print tests passed successfully!');
}

runNormalizationTests();
