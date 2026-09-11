import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Smile, 
  Activity,
  Zap,
  Info,
  ChevronDown,
  History
} from 'lucide-react';
import { FirebaseChild, FirebaseDailyPulse } from '../types';
import { firebaseService } from '../services/firebaseService';
import { geminiClientService } from '../services/geminiClientService';

interface DailyPulseWidgetProps {
  child: FirebaseChild;
  parentId: string;
  userEmail: string | null;
  onPulseLogged?: (pulse: FirebaseDailyPulse) => void;
}

interface SentimentOption {
  value: 'thriving' | 'calm' | 'balanced' | 'sensitive' | 'overwhelmed';
  label: string;
  score: number;
  emoji: string;
  tagline: string;
  badgeColor: string;
  activeColor: string;
}

const SENTIMENT_OPTIONS: SentimentOption[] = [
  {
    value: 'thriving',
    label: 'Thriving & Joyful',
    score: 5,
    emoji: '🌟',
    tagline: 'High engagement, joyful flow, calm focus',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    activeColor: 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
  },
  {
    value: 'calm',
    label: 'Calm & Steady',
    score: 4,
    emoji: '🌿',
    tagline: 'Balanced nervous system, smooth transitions',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    activeColor: 'bg-teal-600 text-white border-teal-700 shadow-sm'
  },
  {
    value: 'balanced',
    label: 'Mixed / Minor Bumps',
    score: 3,
    emoji: '⚖️',
    tagline: 'Needed extra co-regulation & quiet breaks',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    activeColor: 'bg-amber-500 text-white border-amber-600 shadow-sm'
  },
  {
    value: 'sensitive',
    label: 'Sensory Overloaded',
    score: 2,
    emoji: '🌊',
    tagline: 'Sensitive to noise/stimuli, high vigilance',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
    activeColor: 'bg-orange-500 text-white border-orange-600 shadow-sm'
  },
  {
    value: 'overwhelmed',
    label: 'Meltdown / Crisis',
    score: 1,
    emoji: '⚡',
    tagline: 'Intense sensory overload, needed full reset',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    activeColor: 'bg-rose-600 text-white border-rose-700 shadow-sm'
  }
];

const COMMON_TRIGGERS = [
  'Loud Noise / Cafeteria',
  'School Transition',
  'Poor Sleep / Fatigue',
  'Texture / Food Resistance',
  'Unexpected Routine Shift',
  'Deep Pressure Heavy Work Win',
  'Special Interest Focus',
  'Dental / Doctor Visit',
];

export const DailyPulseWidget: React.FC<DailyPulseWidgetProps> = ({
  child,
  parentId,
  userEmail,
  onPulseLogged,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentOption['value']>('calm');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [recipientEmail, setRecipientEmail] = useState<string>(userEmail || 'parent@autismchildbridge.com');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successResponse, setSuccessResponse] = useState<{
    pulse: FirebaseDailyPulse;
    emailSent: boolean;
    reflection?: string;
  } | null>(null);

  const [recentPulses, setRecentPulses] = useState<FirebaseDailyPulse[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Fetch recent daily pulses for child
  useEffect(() => {
    let isMounted = true;
    const loadPulses = async () => {
      try {
        const fetched = await firebaseService.getDailyPulses(child.id, parentId);
        if (!isMounted) return;
        setRecentPulses(fetched);
        
        // Check if logged today
        const todays = fetched.find(p => p.date === todayKey);
        if (todays) {
          setHasLoggedToday(true);
          setSelectedSentiment(todays.sentiment);
          setSuccessResponse({
            pulse: todays,
            emailSent: Boolean(todays.emailSent),
            reflection: todays.note ? `Recorded: "${todays.note}"` : undefined
          });
        }
      } catch (err) {
        console.error('Failed to load daily pulses:', err);
      }
    };

    loadPulses();
    return () => { isMounted = false; };
  }, [child.id, parentId, todayKey]);

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const activeOption = SENTIMENT_OPTIONS.find(o => o.value === selectedSentiment) || SENTIMENT_OPTIONS[1];

      // 1. Save to Firebase
      const savedPulse = await firebaseService.saveDailyPulse({
        childId: child.id,
        parentId,
        childName: child.name,
        date: todayKey,
        sentiment: selectedSentiment,
        sentimentLabel: activeOption.label,
        score: activeOption.score,
        triggers: selectedTriggers,
        note: note.trim() || undefined,
        emailedTo: sendEmail ? recipientEmail : undefined,
        emailSent: sendEmail,
      });

      let reflectionText: string | undefined;

      // 2. Dispatch Email through backend API
      if (sendEmail && recipientEmail) {
        try {
          const emailRes = await geminiClientService.sendDailyPulseEmail({
            email: recipientEmail,
            childName: child.name,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            sentiment: selectedSentiment,
            sentimentLabel: activeOption.label,
            score: activeOption.score,
            triggers: selectedTriggers,
            note: note.trim() || undefined,
          });
          reflectionText = emailRes.reflection;
        } catch (emailErr) {
          console.warn('Daily pulse email failed or skipped:', emailErr);
        }
      }

      setSuccessResponse({
        pulse: savedPulse,
        emailSent: sendEmail,
        reflection: reflectionText,
      });
      setHasLoggedToday(true);
      setRecentPulses(prev => [savedPulse, ...prev.filter(p => p.id !== savedPulse.id)]);
      if (onPulseLogged) onPulseLogged(savedPulse);
    } catch (err) {
      console.error('Failed to save daily pulse:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
            <Heart className="w-5 h-5 fill-teal-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Daily Pulse: 1-Question Check-in
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold border border-teal-200">
                Weekly AI Context
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              How was <strong className="text-slate-700">{child.name}</strong>'s sensory regulation and nervous system today?
            </p>
          </div>
        </div>

        {recentPulses.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 self-start sm:self-center"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide History' : 'View 7-Day Pulse'}</span>
          </button>
        )}
      </div>

      {/* Recent 7-Day Pulse Strip */}
      {showHistory && recentPulses.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Recent Emotional & Sensory Pulses</span>
            <span className="text-[10px] text-slate-500">Last {Math.min(recentPulses.length, 7)} days recorded</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {recentPulses.slice(0, 4).map(p => (
              <div key={p.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{p.date}</span>
                  <span className="font-extrabold text-teal-700">{p.score}/5</span>
                </div>
                <div className="font-bold text-slate-800 truncate">
                  {p.sentimentLabel || p.sentiment}
                </div>
                {p.note && (
                  <div className="text-[10px] text-slate-500 line-clamp-1 italic">
                    "{p.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation State if already logged today */}
      {hasLoggedToday && successResponse ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-3 animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-teal-950">
                    Today's Daily Pulse Saved to Firebase
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-teal-800 border border-teal-200">
                    {successResponse.pulse.sentimentLabel}
                  </span>
                </div>
                <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                  Stored securely to provide context for this week's AutismChildBridge AI clinical summary.
                </p>
                {successResponse.emailSent && (
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold mt-1">
                    <Mail className="w-3 h-3 text-teal-600" />
                    <span>Email summary dispatched to {successResponse.pulse.emailedTo || userEmail || 'parent email'}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setHasLoggedToday(false)}
              className="text-xs font-bold text-teal-800 underline hover:text-teal-950 shrink-0"
            >
              Edit
            </button>
          </div>

          {successResponse.reflection && (
            <div className="p-3 bg-white rounded-xl border border-teal-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-teal-900">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>AutismChildBridge AI Evening Reflection & Tip</span>
              </div>
              <p className="leading-relaxed text-slate-600 text-[11px]">
                {successResponse.reflection}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Form for logging today's pulse */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 5 Sentiment Options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select {child.name}'s Overall State Today:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {SENTIMENT_OPTIONS.map((opt) => {
                const isSelected = selectedSentiment === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedSentiment(opt.value)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? opt.activeColor
                        : 'bg-slate-50/80 border-slate-200 hover:border-teal-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{opt.emoji}</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                      }`}>
                        {opt.score}/5
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {opt.label}
                      </div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                        {opt.tagline}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Sensory Trigger / Highlights Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Any Notable Influences or Triggers Today? (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TRIGGERS.map((tag) => {
                const isChecked = selectedTriggers.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTrigger(tag)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                      isChecked
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Observation Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quick Observation Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Calm morning with leg pushes, but overwhelmed by loud blender after school..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Email Dispatch Checkbox & Input */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>Send me an email summary with tonight's AI regulation takeaway</span>
              </span>
            </label>

            {sendEmail && (
              <div className="flex items-center gap-2 pt-1 pl-6">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full sm:max-w-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-[10px] text-slate-400">
                  Instant parent dispatch
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Save Daily Pulse & Send Email</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
