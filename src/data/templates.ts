import { LetterTemplate, Language } from '../types';

export const LETTER_TEMPLATES_EN: LetterTemplate[] = [
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
      'You do not need to provide personal reasons or backstories when resigning.',
      'Keeping the letter concise prevents emotional exposure on the formal record.',
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

export const LETTER_TEMPLATES_ZH: LetterTemplate[] = [
  {
    id: 'resignation-toxic-protective',
    title: '体面与自我保护型辞职（针对高压与复杂职场）',
    category: '职场保护与边界',
    description: '坚定、冷静、富有边界感。清晰声明离职，不在书面上宣泄情绪或怨言，全面保护未来的职业声誉与背景调查。',
    letterType: '正式辞职通知',
    tone: '冷静、克制、坚定',
    suggestedPoints: '因职业预期不合或环境难以持续而离职；正式通知最后工作日；系统性交接工作。',
    ghostwriterPointers: [
      '切勿在正式辞职信中列举矛盾或抱怨，书面人事档案应保持纯粹的专业性。',
      '中立的离职陈述让管理层没有任何借口质疑您的职业操守。',
      '明确写明最后工作日期，消除交接周期的任何歧义。'
    ],
    sample: {
      title: '正式辞职信',
      subject: '辞职通知 — [您的姓名]',
      salutation: '尊敬的 [主管姓名]：',
      body: `请接受此信函作为我正式辞去在 [公司名称] 担任的 [您的职位] 职位的通知，我的最后工作日将为 [最后工作日期]。\n\n经过对个人职业发展路径与近期重点的审慎考虑，我认为目前是开启新阶段的合适时机。\n\n在离职之前，我将专注于整理未结项目的交接文档、梳理标准工作流程，并协助团队同事进行过渡交接，确保各项工作平稳有序进行。\n\n感谢在职期间与团队建立的良好合作关系，祝愿团队未来取得更大发展。`,
      closing: '此致，',
      signoffName: '[您的姓名]',
      sender: {
        name: '[您的姓名]',
        title: '[您的职位]',
        organization: '[公司名称]',
        address: '[所在城市]',
        contact: '[个人邮箱]',
      },
      recipient: {
        name: '[主管姓名]',
        title: '[主管职位]',
        organization: '[公司名称]',
        address: '[公司办公地址]',
      },
    },
  },
  {
    id: 'resignation-burnout-wellbeing',
    title: '身心健康与休整优先型',
    category: '休整与身心健康',
    description: '以个人健康和生活可持续性为核心。礼貌婉拒挽留与加薪挽留，同时在交接过渡期内展现无可挑剔的专业态度。',
    letterType: '正式辞职通知',
    tone: '真诚、坦然、坚决',
    suggestedPoints: '退后一步休养身心并关照家庭；无法接受留任挽留方案；全力配合平稳交接。',
    ghostwriterPointers: [
      '将离职原因聚焦于个人健康休整，使管理层无法提出无法根治疲劳过载的表面调整。',
      '提前梳理日常职责清单，让交接同事安心。',
      '语气保持平和坚定；递交此信的时刻即是身心修复的起点。'
    ],
    sample: {
      title: '辞职信 — 聚焦健康休整',
      subject: '辞职申请通知 — [您的姓名]',
      salutation: '尊敬的 [主管姓名]：',
      body: `我在此正式向您提出辞去 [您的职位] 的申请，预计最后工作日为 [最后工作日期]。\n\n做出这一决定经过了长时间的深思熟虑。为了专注调理个人身体健康并调整生活节奏，我需要在此阶段暂时告别全职工作岗位。这是一个最终且慎重的决定。\n\n非常感谢在职期间我们彼此之间的真诚协作与支持。\n\n即日起至最后工作日，我将全力推进关键业务交接、归档未尽事项并协助同事熟悉流程，以保障各项业务不受影响。`,
      closing: '顺祝商祺，',
      signoffName: '[您的姓名]',
      sender: {
        name: '[您的姓名]',
        title: '[您的职位]',
        organization: '[公司名称]',
        address: '[所在城市]',
        contact: '[个人邮箱]',
      },
      recipient: {
        name: '[主管姓名]',
        title: '[主管职位]',
        organization: '[公司名称]',
        address: '[公司办公地址]',
      },
    },
  },
  {
    id: 'resignation-broken-promises',
    title: '职业成长受阻与转型发展型',
    category: '职业转型与成长',
    description: '针对长期口头承诺未兑现、升职加薪一再拖延或角色停滞。清晰干脆、毫不拖泥带水、杜绝职场内耗。',
    letterType: '正式辞职通知',
    tone: '明确、干练、着眼长远',
    suggestedPoints: '转向与长远职业规划高度契合的新发展方向；正式通知交接；维持职业风度。',
    ghostwriterPointers: [
      '切勿在信中写“你们去年答应我升职却食言”。表达为“为了追求与长远职业目标更匹配的机遇”，姿态更为体面有力。',
      '清晰果断展现了自尊自爱，让对方无从借题发挥。',
      '结尾聚焦于职业善意。'
    ],
    sample: {
      title: '辞职通知 — 职业生涯发展调整',
      subject: '辞职信 — [您的姓名]',
      salutation: '尊敬的 [主管姓名]：',
      body: `请接受本信函作为我正式辞去 [您的职位] 的通知，我的最后工作日拟定为 [最后工作日期]。\n\n经过认真考量，我决定接受一份与我的长远职业发展方向更加契合的新机遇。\n\n由衷感谢公司过去两年中给予我参与各项核心业务的平台，我也十分珍视与团队各位同事并肩作战的情谊。\n\n在接下来的交接期内，我将认真梳理交接清单、整理文档资料，并协助做好各项业务承接，确保平稳平稳过渡。`,
      closing: '此致敬礼，',
      signoffName: '[您的姓名]',
      sender: {
        name: '[您的姓名]',
        title: '[您的职位]',
        organization: '[公司名称]',
        address: '[所在城市]',
        contact: '[个人邮箱]',
      },
      recipient: {
        name: '[主管姓名]',
        title: '[主管职位]',
        organization: '[公司名称]',
        address: '[公司办公地址]',
      },
    },
  },
  {
    id: 'resignation-strictly-neutral',
    title: '极简客观中立型（零个人情感暴露）',
    category: '极简与纯客观',
    description: '最经典的精炼辞职通知。适用于信任已被破坏、完全不愿在人事档案中留下任何情感痕迹或私密信息的情境。',
    letterType: '正式辞职通知',
    tone: '言简意赅、客观中立',
    suggestedPoints: '直接陈述离职事实；明确生效日期；配合交接安排；不作多余个人评价。',
    ghostwriterPointers: [
      '辞职是合法行使个人权利，无需向雇主交待私人琐事或情感心路。',
      '文字越精炼，在人事正式档案中留下的漏洞就越少。',
      '三段式结构：离职通知、交接承诺、礼貌致意。'
    ],
    sample: {
      title: '正式辞职通知',
      subject: '辞职信 — [您的姓名]',
      salutation: '尊敬的 [主管姓名]：',
      body: `特此告知，我决定辞去在 [公司名称] 担任的 [您的职位] 一职，最后工作日为 [最后工作日期]。\n\n在交接期内，我将按计划收尾当前负责的各项工作，并积极配合部门做好业务与客户资料的交接安排。\n\n感谢在职期间所获得的宝贵工作经验，祝愿公司未来发展顺利。`,
      closing: '此致，',
      signoffName: '[您的姓名]',
      sender: {
        name: '[您的姓名]',
        title: '[您的职位]',
        organization: '[公司名称]',
        address: '[所在城市]',
        contact: '[个人邮箱]',
      },
      recipient: {
        name: '[主管姓名]',
        title: '[主管职位]',
        organization: '[公司名称]',
        address: '[公司办公地址]',
      },
    },
  },
  {
    id: 'resignation-immediate-short',
    title: '突发特殊情况 / 紧急辞职型',
    category: '紧急与特殊情况',
    description: '因突发家庭变故或不可预见的个人紧急情况，必须缩短通知期快速离职。',
    letterType: '紧急离职通知',
    tone: '果断、紧迫、礼貌',
    suggestedPoints: '因突发紧急个人事务需即刻处理；请求提前最后工作日；交接资产与系统权限。',
    ghostwriterPointers: [
      '礼貌说明时间紧迫，但不必向公司事无巨细地透露私人隐私。',
      '清晰注明办公设备、账号权限及资料备份的存放位置。',
      '妥善保存送达凭据。'
    ],
    sample: {
      title: '紧急离职通知书',
      subject: '紧急离职通知 — [您的姓名]',
      salutation: '尊敬的 [主管姓名]：',
      body: `请接受此信函作为我辞去 [您的职位] 的通知，生效日期为 [最后工作日期]。\n\n由于突发且不可预见的个人紧急事务需要我全力处理，我无法满足常规的提前通知周期。对于因此给部门带来的不便，我深表歉意。\n\n我已经将当前所有工作文档和项目资源上传至共享盘交接文件夹，相关办公设备与系统权限也已整理完毕随时交接。\n\n感谢团队在此期间给予的理解与支持。`,
      closing: '谨致，',
      signoffName: '[您的姓名]',
      sender: {
        name: '[您的姓名]',
        title: '[您的职位]',
        organization: '[公司名称]',
        address: '[所在城市]',
        contact: '[个人邮箱]',
      },
      recipient: {
        name: '[主管姓名]',
        title: '[主管职位]',
        organization: '[公司名称]',
        address: '[公司办公地址]',
      },
    },
  },
  {
    id: 'resignation-diplomatic-gracious',
    title: '温和致谢与维系人脉型',
    category: '温和致谢与维系人脉',
    description: '与团队同事关系融洽，但因个人发展、薪酬或公司战略方向选择离开。珍视人际纽带，得体告别。',
    letterType: '正式辞职通知',
    tone: '温和、真诚、顾全大局',
    suggestedPoints: '正式通知；明确离职时间；对同事致以诚挚感谢；周全协助交接。',
    ghostwriterPointers: [
      '对团队伙伴的由衷肯定，能让您的职场人脉网络在离职后依然牢固。',
      '主动提出培训继任同事或撰写详实交接手册，彰显卓越的职业水准。',
      '以真挚的温度体面收尾。'
    ],
    sample: {
      title: '辞职通知 — [您的职位]',
      subject: '辞职通知与交接计划 — [您的姓名]',
      salutation: '尊敬的 [主管姓名]：',
      body: `请接受此信函作为我正式辞去在 [公司名称] 的 [您的职位] 的通知，我的最后工作日将为 [最后工作日期]。\n\n我衷心感谢在职期间大家给予我的信任、包容与支持。与这支充满活力和专业精神的团队并肩共事，是我职业生涯中一段弥足珍贵的经历。\n\n为了确保团队后续项目平稳推进，我已经拟定了一份详尽的工作交接计划，并将在剩余时间内协助培训同事、交接各项业务。\n\n由衷祝愿您以及团队全体成员在未来的项目中一切顺利、再创佳绩。`,
      closing: '顺颂商祺，',
      signoffName: '[您的姓名]',
      sender: {
        name: '[您的姓名]',
        title: '[您的职位]',
        organization: '[公司名称]',
        address: '[所在城市]',
        contact: '[个人邮箱]',
      },
      recipient: {
        name: '[主管姓名]',
        title: '[主管职位]',
        organization: '[公司名称]',
        address: '[公司办公地址]',
      },
    },
  },
];

export const getTemplates = (language: Language): LetterTemplate[] => {
  return language === 'zh' ? LETTER_TEMPLATES_ZH : LETTER_TEMPLATES_EN;
};

export const LETTER_TEMPLATES: LetterTemplate[] = LETTER_TEMPLATES_EN;

