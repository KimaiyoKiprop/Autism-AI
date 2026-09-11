import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Mic, 
  Flame, 
  ArrowRight, 
  FileText, 
  Bell, 
  ShieldCheck, 
  Share2, 
  Smile, 
  Volume2,
  Play
} from 'lucide-react';
import { playSoftChime, playSuccessChord } from '../utils/soundEffects';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenReportModal: () => void;
  onOpenAuth?: () => void;
  onOpenDashboard?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenDemoModal, 
  onOpenReportModal,
  onOpenAuth,
  onOpenDashboard 
}) => {
  // Interactive mock parent phone screen state
  const [selectedStatus, setSelectedStatus] = useState<'done' | 'partial' | 'skipped' | null>('done');
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [streakCount, setStreakCount] = useState(5);
  const [rating, setRating] = useState<number>(5);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);

  const sampleExercises = [
    {
      title: 'Morning Greeting Game',
      category: 'Speech & OT',
      goal: 'Improve eye contact & reciprocal hello',
      duration: '5 min',
      frequency: '3x / week',
      therapist: 'Sarah L., SLP'
    },
    {
      title: 'Heavy Work Bear Crawl',
      category: 'Sensory Reg',
      goal: 'Vestibular & proprioceptive organizing',
      duration: '7 min',
      frequency: 'Daily before dinner',
      therapist: 'Dr. Vance, OTR/L'
    }
  ];

  const currentExercise = sampleExercises[activeExerciseIdx];

  const handleStatusTap = (status: 'done' | 'partial' | 'skipped') => {
    setSelectedStatus(status);
    if (status === 'done') {
      setStreakCount((prev) => prev + 1);
      playSuccessChord(true);
    } else {
      playSoftChime(true);
    }
  };

  const handlePlayVoice = () => {
    setVoicePlaying(!voicePlaying);
    playSoftChime(true);
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-section" className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left 7 Columns: Hero Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-bold tracking-wide">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
            <span>Strengthening the Parent & Therapist Connection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]">
            Bridge the gap between therapy sessions and{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800">
              daily life at home.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
            A compassionate parent app for tracking your autistic child’s home therapy exercises. Enjoy <strong>10-second one-tap logging</strong>, <strong>smart guilt-free reminders</strong>, and <strong>AI weekly summaries</strong> that generate clinic-ready PDF reports for your actual speech, occupational, and behavioral therapists.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth ? onOpenAuth() : scrollToPricing()}
              className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Free (Parent Portal)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDemoModal}
              className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-teal-300 rounded-2xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-teal-600 fill-teal-600" />
              <span>Try Interactive 10s Log Demo</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free plan includes 1 child, up to 2 goals, email reminders, and photo logging.</span>
          </p>

          {/* Four Pillars */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-0.5">1-Tap Logging</span>
              <span className="text-slate-700 text-[11px]">Done, Partial, or Skip in 5 seconds</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-0.5">Voice Notes</span>
              <span className="text-slate-700 text-[11px]">Auto-transcribed while hands are full</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-0.5">AI Weekly Digest</span>
              <span className="text-slate-700 text-[11px]">Patterns & questions for your therapist</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-0.5">Clinic PDF Export</span>
              <span className="text-slate-700 text-[11px]">Print or email to your OT / SLP visit</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Parent Phone Mockup */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-sm sm:max-w-md">
            {/* Ambient background glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-teal-200/50 via-emerald-200/30 to-sky-200/50 rounded-3xl blur-2xl opacity-70 -z-10" />

            {/* Mobile Device Frame */}
            <div className="bg-slate-900 p-3 rounded-4xl shadow-2xl border-4 border-slate-800">
              {/* Phone Speaker & Camera Notch */}
              <div className="flex justify-center mb-2">
                <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-8 h-1.5 rounded-full bg-slate-700" />
                </div>
              </div>

              {/* Mobile Screen Content */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 text-slate-900 space-y-4">
                {/* Child Header Card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      L
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900">Leo</h3>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">Age 6</span>
                      </div>
                      <p className="text-[11px] text-teal-700 font-medium truncate max-w-[170px]">
                        Sensory seeker • Loves trains
                      </p>
                    </div>
                  </div>

                  {/* Active Streak */}
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-[11px] font-extrabold shadow-2xs">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{streakCount} Day Streak</span>
                  </div>
                </div>

                {/* Reminder Alert Banner */}
                <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200/90 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-teal-700 animate-bounce" />
                    <span className="font-bold text-teal-950 text-[11px]">
                      Smart Reminder Fired (10:00 AM)
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-800 font-bold bg-teal-100/90 px-1.5 py-0.5 rounded">
                    Email sent
                  </span>
                </div>

                {/* Active Exercise Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {currentExercise.category}
                    </span>
                    <span className="text-[11px] text-slate-700 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-700" />
                      {currentExercise.duration} • {currentExercise.frequency}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {currentExercise.title}
                    </h4>
                    <p className="text-[11px] text-slate-700">
                      Goal: {currentExercise.goal}
                    </p>
                    <p className="text-[10px] text-slate-700 italic mt-0.5">
                      Recommended by {currentExercise.therapist}
                    </p>
                  </div>

                  {/* One-Tap Action Buttons (Interactive in Hero!) */}
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                      <span>One-Tap Log Status:</span>
                      <span className="text-teal-700 lowercase font-medium">Tap to test</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleStatusTap('done')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          selectedStatus === 'done'
                            ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>

                      <button
                        onClick={() => handleStatusTap('partial')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          selectedStatus === 'partial'
                            ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Partial</span>
                      </button>

                      <button
                        onClick={() => handleStatusTap('skipped')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          selectedStatus === 'skipped'
                            ? 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-300'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>Skip Week</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Confirmation feedback */}
                  {selectedStatus && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Logged in 2s! Streak safe.
                      </span>
                      <span className="text-[10px] text-emerald-700">Added to AI Digest</span>
                    </div>
                  )}

                  {/* Hands-Free Voice Note Simulator */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handlePlayVoice}
                          className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                            voicePlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          <Mic className="w-3 h-3" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-800">
                          {voicePlaying ? 'Transcribing...' : 'Voice Note (Auto-Transcribed)'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-700">Hands-free</span>
                    </div>

                    <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "Leo practiced greeting his sister at breakfast. Maintained eye contact for ~4 seconds with a huge grin! Did not get overwhelmed."
                    </p>
                  </div>
                </div>

                {/* Quick Child Regulation Rating */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-600">Child Sensory State:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setRating(star);
                          playSoftChime(true);
                        }}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-transform cursor-pointer ${
                          star <= rating ? 'bg-amber-400 text-amber-950 scale-105' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {star === 5 ? '😊' : star === 4 ? '🙂' : star === 3 ? '😐' : star === 2 ? '😕' : '😫'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Action: Clinic PDF Preview */}
                <button
                  onClick={onOpenReportModal}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Preview 2-Week Therapist PDF</span>
                </button>
              </div>
            </div>

            {/* Floating Trust Pill */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Never invents medical advice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
