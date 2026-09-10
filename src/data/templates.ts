import { LetterTemplate } from '../types';

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'resignation-toxic-protective',
    title: 'Dignified & Protective Exit (Challenging Environment)',
    category: 'Toxic Workplace & Protection',
    description: 'Firm, calm, and boundary-conscious. Declares departure cleanly without venting resentment on paper, safeguarding your future references.',
    letterType: 'Resignation Notice',
    tone: 'Calm, Firm & Restrained',
    suggestedPoints: 'Leaving due to persistent misaligned expectations or unworkable environment; formal notice; organized handover of active duties.',
    ghostwriterPointers: [
      'Resist the temptation to list grievances in the formal letter; keep the written record strictly professional.',
      'A neutral statement of departure gives management no grounds to dispute your professional conduct.',
      'State your final date unequivocally so there is no ambiguity about notice periods.'
    ],
    sample: {
      title: 'Formal Resignation — Notice of Departure',
      subject: 'Notice of Resignation — [Your Name]',
      salutation: 'Dear [Supervisor Name],',
      body: `Please accept this letter as formal notification that I am resigning from my position as [Your Job Title] at [Company Name], effective [Final Working Date].

After thoughtful consideration of my professional pathway and personal priorities, I have concluded that it is the right time for me to move on to new endeavors.

Prior to my departure, I will focus on completing outstanding project documentation, organizing standard operating procedures, and assisting the team with interim coverage to ensure a smooth, orderly transition.

I appreciate the relationships built during my tenure and wish the team continued progress.`,
      closing: 'Sincerely,',
      signoffName: '[Your Name]',
      sender: {
        name: '[Your Name]',
        title: '[Your Job Title]',
        organization: '[Company Name]',
        address: '[City, State]',
        contact: '[Personal Email]',
      },
      recipient: {
        name: '[Supervisor Name]',
        title: '[Supervisor Title]',
        organization: '[Company Name]',
        address: '[Office Address]',
      },
    },
  },
  {
    id: 'resignation-burnout-wellbeing',
    title: 'Burnout & Well-being Priority',
    category: 'Burnout & Well-being',
    description: 'Prioritizes personal health and sustainability. Rebuffs counteroffers politely while remaining impeccably cooperative during the transition.',
    letterType: 'Resignation Notice',
    tone: 'Empathetic, Honest & Unshakable',
    suggestedPoints: 'Stepping back to prioritize health and family; cannot accept retention counter-offers; dedicated to a supportive transition.',
    ghostwriterPointers: [
      'Framing the exit around personal health prevents management from offering trivial tweaks that do not solve workload burnout.',
      'Reassure your teammates by documenting routine responsibilities before your final day.',
      'Keep the tone level-headed; your recovery begins the moment this letter is delivered.'
    ],
    sample: {
      title: 'Resignation Notice — Prioritizing Health & Well-being',
      subject: 'Resignation Notice — [Your Name]',
      salutation: 'Dear [Supervisor Name],',
      body: `I am writing to formally submit my resignation from my role as [Your Job Title], effective [Final Working Date].

This decision comes after extensive personal reflection. In order to attend to pressing health priorities and personal sustainability, I need to step away from full-time responsibilities at this time. This is a final and considered decision.

I am grateful for the meaningful collaborations we shared during my time with the organization.

Between now and my final day, I will prioritize transferring key account summaries, cataloging open tasks, and training colleague coverage so operations continue smoothly.`,
      closing: 'With warm regards and best wishes,',
      signoffName: '[Your Name]',
      sender: {
        name: '[Your Name]',
        title: '[Your Job Title]',
        organization: '[Company Name]',
        address: '[City, State]',
        contact: '[Personal Email]',
      },
      recipient: {
        name: '[Supervisor Name]',
        title: '[Supervisor Title]',
        organization: '[Company Name]',
        address: '[Office Address]',
      },
    },
  },
  {
    id: 'resignation-broken-promises',
    title: 'Career Stagnation & Professional Transition',
    category: 'Broken Promises & Stagnation',
    description: 'For when promised promotions, role restructuring, or compensation were repeatedly deferred. Clear, decisive, and zero drama.',
    letterType: 'Resignation Notice',
    tone: 'Direct, Composed & Future-Focused',
    suggestedPoints: 'Moving to a position aligned with career trajectory; formal notice; organized handover.',
    ghostwriterPointers: [
      'Do not write "You promised me a title change in June." Writing "pursuing opportunities aligned with my career growth" delivers the exact same message with superior poise.',
      'Clarity is power: leaving decisively shows self-respect and leaves no loose ends.',
      'Focus the closing on professional goodwill.'
    ],
    sample: {
      title: 'Notice of Resignation — Professional Transition',
      subject: 'Resignation Notice — [Your Name]',
      salutation: 'Dear [Supervisor Name],',
      body: `Please accept this letter as formal notification of my resignation from my role as [Your Job Title], with my last day of employment being [Final Working Date].

I have made the decision to accept a new opportunity that aligns closely with my long-term career trajectory and professional development goals. 

Thank you for the opportunities to contribute to our department initiatives over the past two years. I have valued the camaraderie of our peers.

I am committed to ensuring a seamless transition before my departure. I will compile our documentation, wrap up open projects, and walk the team through ongoing operational workflows.`,
      closing: 'Sincerely,',
      signoffName: '[Your Name]',
      sender: {
        name: '[Your Name]',
        title: '[Your Job Title]',
        organization: '[Company Name]',
        address: '[City, State]',
        contact: '[Personal Email]',
      },
      recipient: {
        name: '[Supervisor Name]',
        title: '[Supervisor Title]',
        organization: '[Company Name]',
        address: '[Office Address]',
      },
    },
  },
  {
    id: 'resignation-strictly-neutral',
    title: 'Concise & Focused Notice (Zero Personal Detail)',
    category: 'Strictly Neutral & Minimalist',
    description: 'The classic neutral resignation letter. Ideal when trust is broken and you want zero emotional exposure on file.',
    letterType: 'Resignation Notice',
    tone: 'Concise, Neutral & Objective',
    suggestedPoints: 'Direct notice of resignation; effective date; cooperation on handover; no personal commentary.',
    ghostwriterPointers: [
      'You are never legally required to provide reasons for resigning in an at-will role.',
      'If your manager is volatile or retaliatory, brevity is your best approach.',
      'Three short paragraphs: The notice, the transition commitment, and polite signoff.'
    ],
    sample: {
      title: 'Notice of Resignation — Formal Record',
      subject: 'Formal Resignation — [Your Name]',
      salutation: 'Dear [Supervisor Name],',
      body: `Please accept this letter as formal notification that I am resigning from my position as [Your Job Title] at [Company Name], effective [Final Working Date].

During my remaining time, I will wrap up current deliverables and coordinate with the team to ensure client handovers and ongoing files are thoroughly accounted for.

I appreciate the professional experience gained during my time with the organization and wish the company continued success.`,
      closing: 'Sincerely,',
      signoffName: '[Your Name]',
      sender: {
        name: '[Your Name]',
        title: '[Your Job Title]',
        organization: '[Company Name]',
        address: '[City, State]',
        contact: '[Personal Email]',
      },
      recipient: {
        name: '[Supervisor Name]',
        title: '[Supervisor Title]',
        organization: '[Company Name]',
        address: '[Office Address]',
      },
    },
  },
  {
    id: 'resignation-immediate-short',
    title: 'Short Notice / Urgent Circumstances',
    category: 'Immediate & Urgent',
    description: 'For urgent personal circumstances requiring an expedited exit without traditional notice.',
    letterType: 'Immediate Resignation Notice',
    tone: 'Firm, Urgent & Courteous',
    suggestedPoints: 'Due to unforeseen personal circumstances; expedited last day; immediate handover of credentials and devices.',
    ghostwriterPointers: [
      'Acknowledge the abbreviated timeline politely without over-explaining private emergencies.',
      'Provide clear instructions on how company equipment and accounts can be recovered immediately.',
      'Keep documentation of delivery.'
    ],
    sample: {
      title: 'Notice of Immediate Resignation',
      subject: 'Notice of Immediate Resignation — [Your Name]',
      salutation: 'Dear [Supervisor Name],',
      body: `Please accept this letter as notification that I am resigning from my position as [Your Job Title], effective [Final Working Date].

Due to unforeseen personal circumstances requiring my immediate attention, I am unable to provide standard advance notice. I regret any operational disruption this accelerated timeline may cause the department.

I have uploaded all working project assets and files to our shared drive in the handover folder. I have returned company property and equipment in secure custody.

Thank you for the opportunity to have worked with the team.`,
      closing: 'Respectfully,',
      signoffName: '[Your Name]',
      sender: {
        name: '[Your Name]',
        title: '[Your Job Title]',
        organization: '[Company Name]',
        address: '[City, State]',
        contact: '[Personal Email]',
      },
      recipient: {
        name: '[Supervisor Name]',
        title: '[Supervisor Title]',
        organization: '[Company Name]',
        address: '[Office Address]',
      },
    },
  },
  {
    id: 'resignation-diplomatic-gracious',
    title: 'Diplomatic & Bridge-Preserving Exit',
    category: 'Diplomatic & Gracious',
    description: 'When you loved your teammates but leadership, pay, or strategy forced an exit. Acknowledges valued coworkers while moving on cleanly.',
    letterType: 'Resignation Notice',
    tone: 'Gracious, Professional & Balanced',
    suggestedPoints: 'Formal notice; specific last day; highlighting gratitude for peers; smooth transition.',
    ghostwriterPointers: [
      'Highlighting team appreciation leaves your peer network strong while clearly marking the exit.',
      'Offering to train replacements or prepare thorough documentation demonstrates gold-standard work ethic.',
      'Sign off with authentic warmth.'
    ],
    sample: {
      title: 'Notice of Resignation — [Your Job Title]',
      subject: 'Resignation Notice & Transition Plan — [Your Name]',
      salutation: 'Dear [Supervisor Name],',
      body: `Please accept this letter as formal notice of my resignation from my role as [Your Job Title] at [Company Name]. My final working day will be [Final Working Date].

I want to extend my heartfelt gratitude for the collaborative spirit I experienced while working with the team. Collaborating alongside such dedicated colleagues has been a meaningful chapter of my career.

To ensure our ongoing goals proceed without delay, I have outlined a comprehensive transition plan. I am glad to spend my remaining time training team members and wrapping up active deliverables.

I wish you and the entire team the very best in all upcoming projects.`,
      closing: 'With gratitude and best regards,',
      signoffName: '[Your Name]',
      sender: {
        name: '[Your Name]',
        title: '[Your Job Title]',
        organization: '[Company Name]',
        address: '[City, State]',
        contact: '[Personal Email]',
      },
      recipient: {
        name: '[Supervisor Name]',
        title: '[Supervisor Title]',
        organization: '[Company Name]',
        address: '[Office Address]',
      },
    },
  },
];
