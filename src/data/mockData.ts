import { ChildProfile, LearningGame, ParentResource, VisualScheduleItem } from '../types';

export const initialProfiles: ChildProfile[] = [
  {
    id: 'child-1',
    name: 'Leo',
    age: 6,
    avatarColor: 'bg-teal-500',
    communicationStyle: 'Emerging Verbal',
    sensoryPreference: 'Sensory Sensitive',
    favoriteSpecialInterest: 'Trains & Mechanical Gear Systems',
    overallMilestonesCompleted: 14,
    totalMilestones: 20,
    milestones: [
      {
        id: 'm-1',
        domain: 'Communication & Speech',
        title: 'Requests "Break" Using Visual PECS Card',
        description: 'Initiates a request for sensory retreat before reaching emotional overload by tapping or handing the quiet-zone symbol card.',
        targetAge: 'Age 5-7',
        status: 'achieved',
        progressPercent: 100,
        lastUpdated: 'Yesterday',
        notes: 'Successfully used break card 4 times today during noisy art class without tears.',
        therapistTip: 'Keep the card within reach at all transition points.'
      },
      {
        id: 'm-2',
        domain: 'Communication & Speech',
        title: '2-to-3 Word Functional Phrase Generation',
        description: 'Combines words spontaneously (e.g. "Want blue cup", "Go outside please") to convey immediate physical needs.',
        targetAge: 'Age 5-7',
        status: 'in_progress',
        progressPercent: 70,
        lastUpdated: '3 days ago',
        notes: 'Spontaneously said "Open door please" when heading into the sensory garden.',
        therapistTip: 'Pause for 5-8 seconds before prompting to allow natural processing time.'
      },
      {
        id: 'm-3',
        domain: 'Sensory & Self-Regulation',
        title: 'Recognizes Overstimulation Signals',
        description: 'Identifies bodily cues (clenched fists, covering ears) and reaches for weighted lap pad or noise-dampening headphones.',
        targetAge: 'Age 5-7',
        status: 'achieved',
        progressPercent: 100,
        lastUpdated: '1 week ago',
        notes: 'Reaches for headphones independently when blender or vacuum turns on.',
        therapistTip: 'Praise self-advocacy warmly without making it feel like an intervention.'
      },
      {
        id: 'm-4',
        domain: 'Sensory & Self-Regulation',
        title: 'Independent 4-Count Calming Breathing',
        description: 'Follows visual breathing bubble to engage diaphragm when feeling frustrated during puzzle activities.',
        targetAge: 'Age 6-8',
        status: 'in_progress',
        progressPercent: 55,
        lastUpdated: '2 days ago',
        notes: 'Enjoys the interactive bubble game and synced breathing for 3 consecutive cycles.',
        therapistTip: 'Pair visual rhythm with tactile vibration or soft counting.'
      },
      {
        id: 'm-5',
        domain: 'Social & Play Skills',
        title: 'Reciprocal Turn-Taking (3+ Rounds)',
        description: 'Shares turns rolling a toy vehicle or placing building blocks with an adult or peer without distress.',
        targetAge: 'Age 5-7',
        status: 'in_progress',
        progressPercent: 65,
        lastUpdated: '4 days ago',
        notes: 'Shared train track assembly with sister for 12 minutes before needing solo time.',
        therapistTip: 'Use a visual token or timer so turn duration is predictable.'
      },
      {
        id: 'm-6',
        domain: 'Social & Play Skills',
        title: 'Labeling Peer Emotional Expressions',
        description: 'Matches face illustrations (happy, sad, surprised, calm) to story situations with 80% accuracy.',
        targetAge: 'Age 6-8',
        status: 'in_progress',
        progressPercent: 80,
        lastUpdated: 'Today',
        notes: 'Scored 5 out of 5 in the Emotion Explorer mini-game!',
        therapistTip: 'Focus on contextual clues (body posture, surroundings) rather than isolated micro-expressions.'
      },
      {
        id: 'm-7',
        domain: 'Daily Living & Motor',
        title: 'Independently Fastens Zipper & Coat',
        description: 'Engages zipper pin and pulls jacket up to navigate cold weather transitions independently.',
        targetAge: 'Age 6-7',
        status: 'upcoming',
        progressPercent: 30,
        lastUpdated: 'Last week',
        notes: 'Needs help locking the zipper base pin, but pulls upward with ease.',
        therapistTip: 'Add a tactile ribbon loop to the zipper pull for easier grip.'
      },
      {
        id: 'm-8',
        domain: 'Daily Living & Motor',
        title: 'Follows 4-Step Morning Visual Checklist',
        description: 'Completes: 1. Toilet, 2. Wash Hands, 3. Clothes On, 4. Breakfast with visual schedule guidance.',
        targetAge: 'Age 5-7',
        status: 'achieved',
        progressPercent: 100,
        lastUpdated: 'Yesterday',
        notes: 'Loves sliding the magnetic card to "Done" column.',
        therapistTip: 'Keep morning routines in the exact same physical order.'
      }
    ],
    logs: [
      {
        id: 'log-1',
        date: 'Today',
        activityTitle: 'Emotion Matcher Game + Sensory Sand Play',
        category: 'Social & Play Skills',
        mood: 'Focused',
        durationMinutes: 25,
        notes: 'Very engaged with the expression cards. Smiled when the gentle chime played.'
      },
      {
        id: 'log-2',
        date: 'Yesterday',
        activityTitle: 'Visual Schedule Morning Sequence',
        category: 'Daily Living & Motor',
        mood: 'Calm',
        durationMinutes: 18,
        notes: 'Transitioned from breakfast to shoes with zero meltdowns using the 5-minute visual timer.'
      },
      {
        id: 'log-3',
        date: '3 days ago',
        activityTitle: 'Sound & Musical Pattern Game',
        category: 'Sensory & Self-Regulation',
        mood: 'Happy',
        durationMinutes: 20,
        notes: 'Enjoyed finding matching harp tones. Asked to replay the soft chime sequence.'
      },
      {
        id: 'log-4',
        date: '5 days ago',
        activityTitle: 'Speech Therapy PECS Practice',
        category: 'Communication & Speech',
        mood: 'Calm',
        durationMinutes: 30,
        notes: 'Integrated new symbol for "Warm bath". Strong intentional pointing.'
      }
    ]
  },
  {
    id: 'child-2',
    name: 'Maya',
    age: 8,
    avatarColor: 'bg-indigo-500',
    communicationStyle: 'AAC / PECS',
    sensoryPreference: 'Sensory Seeker',
    favoriteSpecialInterest: 'Astronomy & Planetary Distances',
    overallMilestonesCompleted: 17,
    totalMilestones: 24,
    milestones: [
      {
        id: 'm-m1',
        domain: 'Communication & Speech',
        title: 'Spontaneous Multi-Icon AAC Sentence Formulation',
        description: 'Constructs "I want + play + space game" on iPad AAC device across novel environments.',
        targetAge: 'Age 7-9',
        status: 'achieved',
        progressPercent: 100,
        lastUpdated: '2 days ago',
        notes: 'Navigates between category folders with high confidence and minimal prompting.',
        therapistTip: 'Keep AAC vocabulary expanded to include emotional state words.'
      },
      {
        id: 'm-m2',
        domain: 'Sensory & Self-Regulation',
        title: 'Self-Directed Heavy Work for Proprioceptive Input',
        description: 'Initiates wall-pushups or trampoline jumps when feeling restless before sit-down school tasks.',
        targetAge: 'Age 7-9',
        status: 'achieved',
        progressPercent: 100,
        lastUpdated: 'Yesterday',
        notes: 'Did 10 trampoline jumps before homework without reminder.',
        therapistTip: 'Schedule proprioceptive movement breaks every 35 minutes.'
      },
      {
        id: 'm-m3',
        domain: 'Social & Play Skills',
        title: 'Collaborative Building with Peer (Shared Goal)',
        description: 'Works alongside another student to construct a solar system model adhering to shared guidelines.',
        targetAge: 'Age 8-10',
        status: 'in_progress',
        progressPercent: 75,
        lastUpdated: '3 days ago',
        notes: 'Explaining Saturn rings using visual diagrams to peer.',
        therapistTip: 'Structure peer interactions around Maya’s passionate interests.'
      }
    ],
    logs: [
      {
        id: 'log-m1',
        date: 'Today',
        activityTitle: 'Planet Distance Logic Game',
        category: 'Social & Play Skills',
        mood: 'Happy',
        durationMinutes: 35,
        notes: 'Deeply focused on the cosmic matching sequences. High motivation.'
      }
    ]
  }
];

export const availableGames: LearningGame[] = [
  {
    id: 'game-emotion',
    title: 'Emotion Explorer & Facial Feelings',
    category: 'Emotional Recognition',
    sensoryLevel: 'Ultra Gentle',
    description: 'Helps children identify, understand, and connect facial expressions with real feelings in a pressure-free environment with warm visual feedback.',
    learningOutcome: 'Recognizing happy, calm, overwhelmed, and curious expressions without penalty timers.',
    targetAges: 'Ages 4 - 10',
    duration: '5 - 10 mins',
    badgeColor: 'emerald',
    playable: true
  },
  {
    id: 'game-rhythm',
    title: 'Sensory Melody & Pattern Sequencer',
    category: 'Pattern & Memory',
    sensoryLevel: 'Ultra Gentle',
    description: 'A soothing auditory and visual memory game featuring soft harmonic bell frequencies, gentle color pulses, and unlimited retries.',
    learningOutcome: 'Strengthens working memory, focus retention, and auditory processing in a tranquil atmosphere.',
    targetAges: 'Ages 5 - 12',
    duration: '3 - 8 mins',
    badgeColor: 'teal',
    playable: true
  },
  {
    id: 'game-breathing',
    title: 'Calm Sensory Bubble & Mindful Breath',
    category: 'Sensory Regulation',
    sensoryLevel: 'Ultra Gentle',
    description: 'Interactive breathing companion that gently expands and contracts to guide diaphragmatic regulation, with soft bubble pops.',
    learningOutcome: 'Fosters somatic self-calming routines and helps down-regulate during impending sensory overload.',
    targetAges: 'All Ages (Kids & Parents)',
    duration: '2 - 5 mins',
    badgeColor: 'sky',
    playable: true
  },
  {
    id: 'game-sorting',
    title: 'Visual Category & Story Matcher',
    category: 'Visual Association',
    sensoryLevel: 'Low Stimulation',
    description: 'Group everyday objects, social scenarios, and soothing items into clear visual categories with zero harsh sound buzzers.',
    learningOutcome: 'Builds cognitive flexibility and executive functioning through visual reasoning.',
    targetAges: 'Ages 5 - 11',
    duration: '6 - 12 mins',
    badgeColor: 'amber',
    playable: false
  }
];

export const parentResources: ParentResource[] = [
  {
    id: 'res-1',
    title: 'De-Escalating Sensory Overload: Meltdown vs. Shutdown Guide',
    category: 'Sensory Toolkits',
    readingTime: '6 min read',
    summary: 'A clinical yet compassionate guide for recognizing the neurological difference between temper tantrums and sensory overload, with instant de-escalation protocols.',
    author: 'Dr. Sarah Jenkins, OTD, OTR/L',
    authorRole: 'Pediatric Occupational Therapist & Neurodiversity Specialist',
    tags: ['Sensory Processing', 'Crisis Prevention', 'Home Toolkit'],
    keyTakeaways: [
      'Meltdowns are involuntary neurological fight-or-flight reactions, not manipulative behavioral choices.',
      'Sensory shutdowns manifest as withdrawal, loss of speech, or extreme lethargy; they require quiet space, not questioning.',
      'Reduce verbal instructions to zero during peak dysregulation; prioritize physical safety and soothing dim light.'
    ],
    checklistItems: [
      'Dim harsh overhead fluorescent lighting',
      'Provide weighted lap pad or comforting texture',
      'Cease questioning ("What do you want?") and use simple gestures',
      'Allow recovery time of 30-60 minutes before discussing the event'
    ],
    actionSteps: [
      'Step 1: Identify child’s specific early warning signs (ear-covering, pacing, vocal humming).',
      'Step 2: Guide child toward their designated quiet corner before emotional boiling point.',
      'Step 3: Validate their feelings when baseline returns without assigning guilt or punishment.'
    ]
  },
  {
    id: 'res-2',
    title: 'The Visual Schedule Handbook: Transforming Transitions into Calm',
    category: 'Routines & Transitions',
    readingTime: '8 min read',
    summary: 'How to implement TEACCH-aligned visual daily schedules at home to replace morning resistance and bedtime battles with autonomy.',
    author: 'Marcus Vance, M.Ed, BCBA',
    authorRole: 'Autism Educational Consultant & Parent Coach',
    tags: ['Visual Schedules', 'Daily Routines', 'Executive Function'],
    keyTakeaways: [
      'Visual information remains accessible indefinitely, unlike spoken words which vanish the moment they are uttered.',
      'Give children ownership by letting them move completed cards to the "Finished" pocket.',
      'Use first-then boards ("First wash hands, Then train play") for challenging non-preferred tasks.'
    ],
    checklistItems: [
      'Laminate cards with matte finish to avoid reflective glare',
      'Arrange cards in clear top-to-bottom or left-to-right sequence',
      'Include a "Surprise / Change of Plan" placeholder card to build flexibility gently'
    ],
    actionSteps: [
      'Audit your most stressful daily transition (e.g. leaving for school).',
      'Break down the transition into 3 to 5 clear visual icon steps.',
      'Walk child through the sequence at a relaxed time before requiring live execution.'
    ]
  },
  {
    id: 'res-3',
    title: 'Navigating Your Child’s IEP with Confidence & Dignity',
    category: 'IEP & School Advocacy',
    readingTime: '10 min read',
    summary: 'Concrete parent advocacy templates, sensory accommodation requests (noise breaks, seating options), and measuring measurable SMART goals.',
    author: 'Elena Rostova, J.D.',
    authorRole: 'Special Education Advocate & Autism Parent',
    tags: ['IEP Rights', 'School Accommodations', 'Parent Advocacy'],
    keyTakeaways: [
      'You are an equal legal member of the IEP team with full rights to review assessments prior to meetings.',
      'Ensure sensory accommodations (ear defenders, sensory room access) are explicitly written into Section 504 or IEP, not treated as informal favors.',
      'Track data independently at home using SpectrumSteps progress logs to cross-reference school reports.'
    ],
    checklistItems: [
      'Request evaluation reports in writing at least 3 business days before meeting',
      'Bring a printed list of child strengths and special interests to open the discussion',
      'Ensure all goal baselines include specific percentages and environmental conditions'
    ],
    actionSteps: [
      'Compile child’s last 3 months of sensory logs and milestone achievements.',
      'Draft your Parent Concerns Statement prioritizing communication and emotional safety.',
      'Follow up after meetings with an email summarizing agreed-upon action items.'
    ]
  },
  {
    id: 'res-4',
    title: 'AAC at Home: Fostering Robust Communication Without Pressure',
    category: 'Communication & AAC',
    readingTime: '7 min read',
    summary: 'Practical modeling techniques (Aided Language Stimulation) to encourage functional communication using high-tech and low-tech AAC tools.',
    author: 'Amina Al-Mansoor, MS, CCC-SLP',
    authorRole: 'Speech-Language Pathologist & AAC Specialist',
    tags: ['AAC', 'Non-Verbal Communication', 'Speech Development'],
    keyTakeaways: [
      'Research conclusively proves that using AAC does NOT hinder verbal speech development; it often accelerates it.',
      'Model communication on the AAC device yourself without requiring immediate imitation from the child.',
      'Ensure the AAC device is never taken away as a disciplinary consequence; it is your child’s voice.'
    ],
    checklistItems: [
      'Keep AAC device charged and physically accessible 100% of the day',
      'Model core words ("go", "more", "stop", "help") during natural play',
      'Celebrate all communicative attempts (pointing, eye gaze, vocalizations, AAC touch)'
    ],
    actionSteps: [
      'Identify 2 favorite daily activities (snack time, swing time).',
      'Select 3 core vocabulary words associated with those activities.',
      'Model those words 5 times per session with zero demand on the child to repeat.'
    ]
  }
];

export const initialScheduleItems: VisualScheduleItem[] = [
  { id: 'sch-1', label: 'Wake Up & Gentle Light', category: 'Morning', iconName: 'Sun', completed: true, timeHint: '7:30 AM' },
  { id: 'sch-2', label: 'Sensory Teeth Brushing', category: 'Morning', iconName: 'Sparkles', completed: true, timeHint: '7:45 AM' },
  { id: 'sch-3', label: 'Favorite Breakfast & Juice', category: 'Morning', iconName: 'Utensils', completed: true, timeHint: '8:00 AM' },
  { id: 'sch-4', label: 'Put on Soft Clothes & Shoes', category: 'Morning', iconName: 'Shirt', completed: false, timeHint: '8:25 AM' },
  { id: 'sch-5', label: 'School Transition & Bus Ride', category: 'Morning', iconName: 'Bus', completed: false, timeHint: '8:45 AM' },
  { id: 'sch-6', label: 'Sensory Trampoline & Heavy Play', category: 'Evening', iconName: 'Activity', completed: false, timeHint: '4:00 PM' },
  { id: 'sch-7', label: 'Interactive Game & Calm Time', category: 'Evening', iconName: 'Gamepad2', completed: false, timeHint: '5:30 PM' },
  { id: 'sch-8', label: 'Warm Bath & Dim Lights', category: 'Evening', iconName: 'Moon', completed: false, timeHint: '7:15 PM' }
];

export const faqItems = [
  {
    question: 'How do the interactive games accommodate sensory sensitivities?',
    answer: 'Every game in SpectrumSteps is built under clinical sensory-friendly guidelines. We avoid flashing animations, sudden jarring sound effects, ticking countdown timers, and penalty buzzers. Sound cues are synthesized using soft harmonic frequencies, colors are balanced in calm pastel palettes, and children can pause or repeat any interaction at their own natural pace.'
  },
  {
    question: 'Can I share my child’s progress records with therapists or IEP teams?',
    answer: 'Yes! SpectrumSteps includes a one-click "IEP Progress Summary Generator". You can export or print a clear, evidence-based developmental milestone report detailing achieved milestones, communication progress, sensory regulation notes, and time-stamped therapist observations for your next pediatric or school meeting.'
  },
  {
    question: 'Does SpectrumSteps support non-verbal children and AAC users?',
    answer: 'Absolutely. Our platform is proudly neurodiversity-affirming and treats AAC (Augmentative and Alternative Communication), PECS (Picture Exchange Communication System), and gestural communication as equal, fully valid modes of language. Milestones and games are customized for AAC users without forcing verbal speech compliance.'
  },
  {
    question: 'How is our child’s developmental and medical data kept private?',
    answer: 'We treat child data with the highest ethical standards. All records are encrypted, never sold or shared with advertisers, and can be wiped or exported by the parent at any moment. Parents maintain 100% control over their child’s profile and records.'
  },
  {
    question: 'What age ranges are the games and resources designed for?',
    answer: 'Our activities and resource toolkits span ages 2 through 14+, segmented into Early Intervention (2-4), Primary Foundations (5-8), and Tween Autonomy (9-13+), with custom milestones adaptable to any developmental age rather than strict chronological age.'
  }
];
