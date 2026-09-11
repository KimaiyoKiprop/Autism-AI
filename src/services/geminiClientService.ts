export interface AskAiRequest {
  question: string;
  childProfile?: {
    name?: string;
    age?: number;
    communicationStyle?: string;
    sensoryPreference?: string;
    sensoryTriggers?: string[];
    calmingTools?: string[];
  };
  conversationHistory?: Array<{
    role: 'user' | 'model';
    text: string;
  }>;
}

export interface AskAiResponse {
  answer: string;
  suggestedNextQuestions: string[];
  timestamp: string;
}

export interface SynthesizeWeeklyRequest {
  childName: string;
  logs: Array<{
    goalTitle: string;
    status: string;
    regulationRating: number;
    notes?: string;
    date: string;
  }>;
  goals: Array<{
    title: string;
    discipline?: string;
    frequency?: string;
  }>;
  childProfile?: any;
  dailyPulses?: Array<{
    date: string;
    sentiment: string;
    sentimentLabel?: string;
    score: number;
    triggers?: string[];
    note?: string;
  }>;
}

export interface SynthesizeWeeklyResponse {
  celebrations: string[];
  sensoryPatterns: string[];
  therapistQuestions: string[];
  parentObservations: string;
  adherencePercent: number;
  averageRegulation: number;
  totalSessions: number;
}

export interface DailyPulseEmailRequest {
  email: string;
  childName: string;
  date: string;
  sentiment: string;
  sentimentLabel: string;
  score: number;
  triggers?: string[];
  note?: string;
}

export interface DailyPulseEmailResponse {
  success: boolean;
  messageId: string;
  recipient: string;
  sentAt: string;
  subject: string;
  reflection: string;
  message: string;
}

export const geminiClientService = {
  async askQuestion(params: AskAiRequest): Promise<AskAiResponse> {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }

    return res.json();
  },

  async synthesizeWeekly(params: SynthesizeWeeklyRequest): Promise<SynthesizeWeeklyResponse> {
    const res = await fetch('/api/ai/synthesize-weekly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }

    return res.json();
  },

  async sendDailyPulseEmail(params: DailyPulseEmailRequest): Promise<DailyPulseEmailResponse> {
    const res = await fetch('/api/pulse/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }

    return res.json();
  },
};
