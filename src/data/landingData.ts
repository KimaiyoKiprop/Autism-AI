import { ExerciseItem, FlowStep, PricingPlan, WeeklyAiSummaryData, FaqItem } from '../types';

export const CORE_FLOW_STEPS: FlowStep[] = [
  {
    stepNumber: 1,
    title: "1. Gentle Child Profile Onboarding",
    subtitle: "Built around your child's unique sensory and communication landscape",
    description: "Start in under 2 minutes. Enter your child's age, optional clinical diagnoses, communication preferences (verbal, emerging, AAC, or PECS), and sensory triggers so exercises feel safe and affirming.",
    bulletPoints: [
      "Sensory triggers & soothing preferences recorded",
      "AAC & non-verbal communication honored as first-class",
      "Private, encrypted, and parent-controlled data"
    ],
    badgeText: "Step 1: Setup Profile"
  },
  {
    stepNumber: 2,
    title: "2. Set Up Goals & Exercises",
    subtitle: "Directly mirror your therapist's recommendations with zero friction",
    description: "Input goals prescribed by your licensed OT, SLP, or PT (e.g., 'Improve joint attention during greetings') and assign realistic exercises (e.g., 'Greeting game, 5 min, 3x/week'). Choose from our built-in library or type your own.",
    bulletPoints: [
      "Built-in library of 40+ evidence-aligned home exercises",
      "Custom durations, target days, and equipment tags",
      "Direct link to therapist's clinical IEP/treatment goals"
    ],
    badgeText: "Step 2: Goals & Exercises"
  },
  {
    stepNumber: 3,
    title: "3. Gentle Smart Reminders",
    subtitle: "Pings that support your family without pressure or guilt",
    description: "At your preferred family times, receive peaceful email or notifications: 'Time for Greeting Game with Leo (5 min).' Having a tough sensory day? Tap 'Skip this week' without breaking your streak or feeling shamed.",
    bulletPoints: [
      "Morning, afternoon, or evening preferred windows",
      "Graceful skip without penalty or negative reinforcement",
      "Supports co-caregiver notifications"
    ],
    badgeText: "Step 3: Smart Reminders"
  },
  {
    stepNumber: 4,
    title: "4. 10-Second Frictionless Logging",
    subtitle: "One-tap Done / Partial / Skipped when your hands are full",
    description: "Parents are busy. When an exercise finishes, tap once to log outcome. Tap the mic button to speak a quick observation (automatically transcribed into clean text), attach a photo or video, and record a 1-to-5 regulation score.",
    bulletPoints: [
      "Single-tap Done, Partial, or Skipped selection",
      "Auto-transcribed voice observations for hands-free logging",
      "Photo and video memory timeline"
    ],
    badgeText: "Step 4: One-Tap Logging"
  },
  {
    stepNumber: 5,
    title: "5. Weekly AI Progress Synthesis",
    subtitle: "Reads your daily observations to surface patterns for your therapist",
    description: "Every Sunday, our clinically bounded AI analyzes your week's logs. It generates a plain-language summary highlighting what worked, what was challenging, hidden sensory patterns, and concrete questions to ask your licensed therapist.",
    bulletPoints: [
      "Clear adherence %, wins, and struggle patterns",
      "Generates insightful questions for your next appointment",
      "Strict safety guardrail: NEVER invents medical advice"
    ],
    badgeText: "Step 5: AI Weekly Synthesis"
  },
  {
    stepNumber: 6,
    title: "6. Clinic-Ready PDF Export",
    subtitle: "Bring 2 to 4 weeks of structured clarity to your therapy appointments",
    description: "Before walking into your OT or Speech clinic, click once to generate an elegant PDF report. Hand it to your therapist so they immediately see real-world home carryover, enabling them to adjust their clinical care with confidence.",
    bulletPoints: [
      "1-click PDF download or email directly to clinic",
      "Organized by therapist goals with visual adherence graphs",
      "Maximizes high-value face time with your provider"
    ],
    badgeText: "Step 6: Shareable Report"
  }
];

export const SAMPLE_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex-1',
    title: 'Morning Greeting Game',
    category: 'Speech & Language',
    therapistGoal: 'Improve joint attention & verbal greeting during morning routines',
    defaultDuration: '5 mins',
    frequency: '3x / week',
    description: 'Use a stuffed animal or favorite puppet to initiate "Hello [Name]" followed by eye contact or AAC icon selection before breakfast.',
    therapistTips: [
      'Wait 5-10 seconds before prompting to allow processing time.',
      'Accept any affirmative communicative attempt (smile, wave, AAC button).'
    ],
    equipmentNeeded: 'Favorite plush toy or AAC device'
  },
  {
    id: 'ex-2',
    title: 'Heavy Work Bear Crawl Obstacle',
    category: 'Sensory Regulation',
    therapistGoal: 'Provide proprioceptive input to reduce sensory seeking before homework',
    defaultDuration: '7 mins',
    frequency: 'Daily (before transitions)',
    description: 'Guide child to bear crawl across couch cushions and push a weighted laundry basket to the hallway to organize their vestibular system.',
    therapistTips: [
      'Encourage firm palm and foot contact with cushions.',
      'Check for calm breathing; stop if over-arousal occurs.'
    ],
    equipmentNeeded: 'Couch cushions or pillows'
  },
  {
    id: 'ex-3',
    title: 'First / Then Visual Card Exchange',
    category: 'Occupational Therapy',
    therapistGoal: 'Increase independent task transitions between preferred & non-preferred activities',
    defaultDuration: '4 mins',
    frequency: '4x / week',
    description: 'Show visual card for "First shoes on, Then 5 minutes iPad". Have the child place the token onto the finished board.',
    therapistTips: [
      'Keep verbal directives under 4 words.',
      'Immediately provide the "Then" reinforcement when completed.'
    ],
    equipmentNeeded: 'Printed Visual Schedule Board'
  },
  {
    id: 'ex-4',
    title: 'Bubble Pop Turn-Taking',
    category: 'Social & Play',
    therapistGoal: 'Practice reciprocal back-and-forth social engagement',
    defaultDuration: '8 mins',
    frequency: '3x / week',
    description: 'Blow bubbles; take turns popping with index finger while modeling "My turn / Your turn" or signing "More".',
    therapistTips: [
      'Hold wand near your eyes to naturally encourage gaze shift.',
      'Praise waiting behavior with a warm smile.'
    ],
    equipmentNeeded: 'Sensory-safe bubble wand'
  },
  {
    id: 'ex-5',
    title: 'Sensory Brush & Deep Pressure Sandwich',
    category: 'Sensory Regulation',
    therapistGoal: 'Desensitize tactile defensiveness prior to bedtime',
    defaultDuration: '6 mins',
    frequency: 'Every evening',
    description: 'Gently roll a therapy ball or press soft pillows over arms and legs with firm, steady downward strokes.',
    therapistTips: [
      'Never apply pressure to stomach or head.',
      'Ask "More pressure or less pressure?" to build body self-advocacy.'
    ],
    equipmentNeeded: 'Therapy peanut ball or weighted blanket'
  },
  {
    id: 'ex-6',
    title: '2-Step Dressing Sequence',
    category: 'Daily Living',
    therapistGoal: 'Foster fine motor autonomy with sock and shoe pulling',
    defaultDuration: '5 mins',
    frequency: '5x / week',
    description: 'Break sock donning into backward chaining: parent pulls sock past heel, child completes pulling over toes and ankle.',
    therapistTips: [
      'Celebrate the final pull so child feels 100% completion.',
      'Use socks with colorful heel indicators for visual contrast.'
    ],
    equipmentNeeded: 'High-contrast socks with heel tabs'
  }
];

export const SAMPLE_WEEKLY_AI_SUMMARY: WeeklyAiSummaryData = {
  childName: 'Leo (Age 6)',
  dateRange: 'Oct 12 – Oct 19, 2026',
  adherenceRate: 85,
  totalScheduled: 14,
  completedCount: 12,
  partialCount: 1,
  skippedCount: 1,
  highlights: [
    'Maintained sustained eye contact & waved during 4 out of 4 Morning Greeting sessions.',
    'Consistently chose Heavy Work obstacle course before dinner, leading to zero meltdowns at bedtime on Thursday and Friday.',
    'Voice note from Dad on Wednesday: "Leo initiated the bubble game without prompting!"'
  ],
  challengesAndMisses: [
    'Fine motor sock exercise was skipped on Tuesday due to sensory fatigue after occupational therapy clinic day.',
    'Partial completion on Sunday evening dressing session due to seams causing tactile discomfort.'
  ],
  observedPatterns: [
    'Exercises performed between 9:00 AM – 10:30 AM achieved 100% engagement vs. 60% after 6:00 PM.',
    'Proprioceptive heavy work (bear crawls) right before speech games increased vocalizations by approximately 2x.'
  ],
  therapistDiscussionPoints: [
    'Ask Dr. Vance (OT): "Given Leo’s seam sensitivity during the sock drill, should we transition to seamless socks or introduce tactile brushing first?"',
    'Ask Sarah (SLP): "Since Leo initiated the bubble game unprompted, is he ready to introduce multi-word PECS phrases (\'I want bubbles\') at home?"',
    'Confirm if we can shift post-clinic Tuesday exercises to rest/sensory recharge days without impacting treatment trajectory.'
  ]
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    billedNote: 'Free forever for single families starting out',
    description: 'Essential exercise tracking for parents establishing their home therapy habits.',
    targetAudience: '1 Child • Up to 2 Goals',
    features: [
      '1 Child profile',
      'Up to 2 active therapy goals',
      'Full access to standard exercise library',
      'One-tap Done / Partial / Skipped logging',
      'Basic text & photo logging',
      'Scheduled email reminders',
      'Active adherence & streak tracking',
      'Soft upgrade prompt after 7 days of active use'
    ],
    limitations: [
      'No AI-generated weekly summaries',
      'No one-click PDF therapist reports',
      'Single caregiver login only'
    ],
    ctaText: 'Start Free Forever'
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: 'Most Popular for Families',
    popular: true,
    monthlyPrice: 9,
    yearlyPrice: 89,
    billedNote: '$9/month (or $89/year billed annually, save 18%)',
    description: 'Full AI clinical intelligence and exportable reports for parents committed to maximum therapy carryover.',
    targetAudience: '1 Child • Unlimited Goals • 3 Caregivers',
    features: [
      '1 Child with full history',
      'Unlimited goals & custom exercises',
      'Weekly AI Progress Syntheses & pattern analysis',
      'AI-generated questions for your real therapist',
      'One-click clinic-ready PDF reports (2-4 week export)',
      'Voice note logging with automatic speech transcription',
      'Up to 3 caregivers (Co-parent, Nanny, Grandparents)',
      'Smart email & push notification reminders',
      'Skip-week flexibility with streak preservation'
    ],
    ctaText: 'Start 14-Day Free Trial'
  },
  {
    id: 'family',
    name: 'Family',
    badge: 'Best for Multi-Child & Care Teams',
    monthlyPrice: 18,
    yearlyPrice: 149,
    billedNote: '$18/month (or $149/year billed annually, save 31%)',
    description: 'Unrestricted support for neurodivergent siblings, extended care teams, and unlimited media memories.',
    targetAudience: 'Up to 4 Children • Unlimited Caregivers',
    features: [
      'Up to 4 child profiles',
      'Unlimited caregivers & therapy team members',
      'All Plus features (AI summaries, voice transcription, PDF reports)',
      'Unlimited video and photo media storage',
      'Full searchable memory timeline',
      'Custom date-range historical report exports',
      'Direct clinic team invitation link',
      'Priority caregiver customer support',
      'Early access to new features & calendar sync'
    ],
    ctaText: 'Get Family Plan'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Therapists & AI',
    question: 'Does Autism Child Bridge replace my child\'s speech or occupational therapist?',
    answer: 'Absolutely not. Autism Child Bridge was specifically built to strengthen and honor your existing therapist relationship. Therapists often struggle to know what happens during the 167 hours of the week between appointments. Our platform records what you actually practice at home and uses AI to summarize your observations into clean reports and smart discussion questions for your licensed therapist.'
  },
  {
    category: 'Therapists & AI',
    question: 'How does the AI weekly summary work? Will it invent medical advice?',
    answer: 'Our AI has a strict safety boundary: it NEVER invents new therapeutic interventions or diagnoses. It functions purely as an analytical secretary. It reviews your logged logs (e.g., "completed 4 of 5 sessions", "struggled with eye contact after 6 PM") and synthesizes plain-language patterns (e.g., morning adherence is 40% higher) while suggesting questions you can raise at your next clinic visit.'
  },
  {
    category: 'Reminders & Logs',
    question: 'How fast is daily logging? I already have my hands full.',
    answer: 'Most entries take under 10 seconds. You tap "Done," "Partial," or "Skipped." If you want to add nuance while holding your child, you can tap the voice button and speak naturally—our system automatically transcribes your spoken words into clean written notes. You can also snap a quick photo to document a win.'
  },
  {
    category: 'Reminders & Logs',
    question: 'What happens if we have a sick day or sensory meltdown? Does it break our streak?',
    answer: 'Autism parenting does not conform to rigid streaks. You can tap "Skip this week" or "Sensory recharge day" at any time. Our smart tracking preserves your adherence momentum and marks the day as a therapeutic break rather than a failure.'
  },
  {
    category: 'Plans & Sharing',
    question: 'How does caregiver and family sharing work?',
    answer: 'On our Plus plan (up to 3 caregivers) and Family plan (unlimited caregivers), you can invite your partner, a grandparent, a babysitter, or even your Registered Behavior Technician (RBT). Everyone can view the scheduled exercises and log notes into the same child timeline, ensuring consistency across every adult in your child’s life.'
  },
  {
    category: 'Plans & Sharing',
    question: 'How do I take the reports to my child\'s therapy visit?',
    answer: 'With one click, you can generate a clean, printer-friendly PDF report covering the past 2, 3, or 4 weeks. You can print it to place in your binder, or email it directly to your OT, SLP, PT, or BCBA before your session so they can review your home carryover in 60 seconds.'
  },
  {
    category: 'General',
    question: 'Is my child\'s data safe and private?',
    answer: 'Yes. We treat neurodevelopmental data with the utmost seriousness. All data is encrypted in transit and at rest. We never sell data to third-party advertisers or insurance providers. You have 100% ownership and can export or delete your records at any time.'
  },
  {
    category: 'General',
    question: 'How can I contact your team for questions or support?',
    answer: 'You can reach us anytime directly at support@autismchildbridge.com. Our family support team is dedicated to helping parents, caregivers, and therapists with any questions or assistance.'
  }
];

export const TESTIMONIALS_DATA = [
  {
    name: 'Melissa D.',
    role: 'Mom to 6-year-old Lucas (Autistic, Sensory Sensitive)',
    avatarColor: 'bg-teal-600',
    quote: 'Before Autism Child Bridge, our OT would ask, "How did the heavy work exercises go this week?" and I would completely blank out. Now, I print the 2-week PDF and hand it to her. She immediately saw that Lucas did way better in the mornings, and we adjusted his school routine accordingly. It changed everything.',
    highlight: 'Saved 20 minutes of clinic guesswork'
  },
  {
    name: 'Dr. Marcus Vance, OTR/L',
    role: 'Pediatric Occupational Therapist, Sensory Spectrum Clinic',
    avatarColor: 'bg-emerald-700',
    quote: 'As an OT, home carryover is our biggest blind spot. When parents bring an Autism Child Bridge summary, I can see exact compliance, triggers, and parent voice notes in 45 seconds. The suggested parent questions are always spot on and help us focus on real breakthroughs.',
    highlight: 'Clinically recommended by therapists'
  },
  {
    name: 'Eileen & David K.',
    role: 'Parents to Liam (8, AAC User)',
    avatarColor: 'bg-sky-600',
    quote: 'With Liam\'s nanny, grandma, and both of us logging into the Family plan, we finally have consistency. Voice note transcription is a godsend when Liam is running around. And seeing the weekly AI summary praise our little wins keeps us motivated on hard weeks.',
    highlight: 'Essential for co-caregivers'
  }
];
