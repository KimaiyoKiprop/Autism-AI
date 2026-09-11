export type TherapyCategory = 
  | 'Speech & Language'
  | 'Occupational Therapy'
  | 'Sensory Regulation'
  | 'Social & Play'
  | 'Daily Living';

export type LogStatus = 'done' | 'partial' | 'skipped';

export interface ExerciseItem {
  id: string;
  title: string;
  category: TherapyCategory;
  therapistGoal: string;
  defaultDuration: string;
  frequency: string;
  description: string;
  therapistTips: string[];
  equipmentNeeded?: string;
}

export interface ProgressLogEntry {
  id: string;
  date: string;
  exerciseTitle: string;
  status: LogStatus;
  durationMinutes: number;
  rating?: number; // 1-5
  voiceTranscription?: string;
  parentNotes?: string;
  caregiverName: string;
}

export interface WeeklyAiSummaryData {
  childName: string;
  dateRange: string;
  adherenceRate: number;
  totalScheduled: number;
  completedCount: number;
  partialCount: number;
  skippedCount: number;
  highlights: string[];
  challengesAndMisses: string[];
  observedPatterns: string[];
  therapistDiscussionPoints: string[];
}

export interface PricingPlan {
  id: 'free' | 'plus' | 'family';
  name: string;
  badge?: string;
  popular?: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  billedNote: string;
  description: string;
  targetAudience: string;
  features: string[];
  limitations?: string[];
  ctaText: string;
}

export interface FlowStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  badgeText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'General' | 'Therapists & AI' | 'Reminders & Logs' | 'Plans & Sharing';
}

export type SensoryLevel = 'Ultra Gentle' | 'Low Stimulation' | 'Moderate';

export type MilestoneStatus = 'achieved' | 'in_progress' | 'upcoming';

export type MilestoneDomain = 
  | 'Communication & Speech'
  | 'Sensory & Self-Regulation'
  | 'Social & Play Skills'
  | 'Daily Living & Motor';

export interface Milestone {
  id: string;
  domain: MilestoneDomain;
  title: string;
  description: string;
  targetAge: string;
  status: MilestoneStatus;
  progressPercent: number;
  lastUpdated?: string;
  notes?: string;
  therapistTip?: string;
}

export interface ProgressLog {
  id: string;
  date: string;
  activityTitle: string;
  category: MilestoneDomain;
  mood: 'Calm' | 'Happy' | 'Focused' | 'Sensitive' | 'Overwhelmed';
  durationMinutes: number;
  notes: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  communicationStyle: 'Verbal' | 'Emerging Verbal' | 'AAC / PECS' | 'Gestural / Visual';
  sensoryPreference: 'Sensory Seeker' | 'Sensory Sensitive' | 'Mixed Profile';
  favoriteSpecialInterest: string;
  overallMilestonesCompleted: number;
  totalMilestones: number;
  milestones: Milestone[];
  logs: ProgressLog[];
}

export interface LearningGame {
  id: string;
  title: string;
  category: 'Emotional Recognition' | 'Pattern & Memory' | 'Sensory Regulation' | 'Visual Association';
  sensoryLevel: SensoryLevel;
  description: string;
  learningOutcome: string;
  targetAges: string;
  duration: string;
  badgeColor: string;
  playable: boolean;
}

export interface ParentResource {
  id: string;
  title: string;
  category: 'Sensory Toolkits' | 'Communication & AAC' | 'IEP & School Advocacy' | 'Routines & Transitions' | 'Emotional Regulation';
  readingTime: string;
  summary: string;
  author: string;
  authorRole: string;
  tags: string[];
  keyTakeaways: string[];
  checklistItems?: string[];
  actionSteps: string[];
}

export interface VisualScheduleItem {
  id: string;
  label: string;
  category: 'Morning' | 'School' | 'Evening' | 'Break';
  iconName: string;
  completed: boolean;
  timeHint?: string;
}

export interface FirebaseChild {
  id: string;
  parentId: string;
  name: string;
  age: number;
  communicationStyle: string;
  sensoryPreference: string;
  specialInterest?: string;
  calmingTools: string[];
  sensoryTriggers: string[];
  therapistName?: string;
  clinicName?: string;
  nextAppointmentDate?: string; // e.g. "2026-09-12" or ISO
  nextAppointmentTime?: string; // e.g. "14:30"
  nextAppointmentType?: string; // e.g. "Occupational Therapy"
  appointmentNotes?: string;
  createdAt: string;
}

export interface FirebaseDailyPulse {
  id: string;
  childId: string;
  parentId: string;
  childName: string;
  date: string; // YYYY-MM-DD or formatted
  sentiment: 'thriving' | 'calm' | 'balanced' | 'sensitive' | 'overwhelmed';
  sentimentLabel: string;
  score: number; // 1 to 5
  triggers?: string[];
  note?: string;
  emailedTo?: string;
  emailSent?: boolean;
  createdAt: string;
  timestamp: number;
}

export interface FirebaseGoal {
  id: string;
  childId: string;
  parentId: string;
  title: string;
  category: TherapyCategory;
  frequency: string;
  durationMinutes: number;
  therapistTips: string;
  equipmentNeeded?: string;
  isActive: boolean;
  createdAt: string;
}

export interface FirebaseLog {
  id: string;
  childId: string;
  parentId: string;
  goalId?: string;
  goalTitle: string;
  status: 'Done' | 'Partial' | 'Skip';
  regulationRating: number; // 1-5
  mood: string;
  notes: string;
  caregiverName: string;
  date: string;
  timestamp: number;
}

export interface FirebaseWeeklySummary {
  id: string;
  childId: string;
  parentId: string;
  childName: string;
  weekLabel: string;
  totalSessions: number;
  adherencePercent: number;
  averageRegulation: number;
  celebrations: string[];
  sensoryPatterns: string[];
  therapistQuestions: string[];
  parentObservations: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'parent' | 'caregiver' | 'therapist';
  subscriptionTier?: 'free' | 'plus' | 'family';
  isPaid?: boolean;
  billingCycle?: 'monthly' | 'yearly';
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  createdAt: string;
}

