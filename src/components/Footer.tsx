import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { playSoftChime } from '../utils/soundEffects';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      playSoftChime(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1-5: Brand Overview */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Autism Child <span className="text-teal-400">Bridge</span>
                </span>
                <span className="block text-[11px] text-teal-300 font-medium">
                  autismchildbridge.com
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              A parent app for tracking an autistic child's therapy exercises and progress at home, with AI-generated summaries, smart reminders, and shareable reports designed to support your family's existing therapist relationship.
            </p>

            {/* Neurodiversity affirmation pill */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Proudly neurodiversity-affirming. Designed for genuine sensory comfort and zero-shame parenting.</span>
            </div>
          </div>

          {/* Col 6-8: Quick Links */}
          <div className="lg:col-span-3 space-y-3 text-left text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollTo('how-it-works')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">
                  How It Works (6-Step Flow)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('exercise-library')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">
                  General Exercise Library (40+ Exercises)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ai-summaries')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">
                  Weekly AI Progress Syntheses
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('therapist-reports')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">
                  Therapist PDF Report Previews
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('pricing')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">
                  Plans & Pricing (Free / Plus / Family)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 9-12: Free Monthly Guides Newsletter */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Sensory Play & Therapy Guide
            </h4>
            <p className="text-xs text-slate-400">
              Receive free monthly printable sensory schedules, low-arousal game ideas, and therapist carryover worksheets.
            </p>

            {subscribed ? (
              <div className="p-3 bg-teal-950 border border-teal-800 rounded-xl text-teal-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>You're subscribed! Check your inbox for the welcome kit.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <span className="text-[10px] text-slate-400 block">
              No spam ever. 1-click unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* Clinical Disclaimer & Crisis Info Banner */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-400">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Clinical Partnership Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Autism Child Bridge (autismchildbridge.com) is a parent-reported home tracking tool designed to complement and support licensed clinical care provided by Pediatric Occupational Therapists, Speech-Language Pathologists, Physical Therapists, and Physicians. Autism Child Bridge does not provide medical diagnoses, treatment prescriptions, or clinical therapy. Always consult your licensed healthcare professional before initiating new developmental regimens.
            </p>
          </div>

          <div className="md:col-span-4 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2 text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-xs text-teal-400">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>Contact & Family Support</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Questions, feedback, or need guidance? Reach our dedicated support team directly:
            </p>
            <a 
              href="mailto:support@autismchildbridge.com"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 shrink-0 text-teal-400" />
              <span>support@autismchildbridge.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Autism Child Bridge (autismchildbridge.com). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="mailto:support@autismchildbridge.com"
              className="text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              <span>support@autismchildbridge.com</span>
            </a>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">HIPAA Compliance Notes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
