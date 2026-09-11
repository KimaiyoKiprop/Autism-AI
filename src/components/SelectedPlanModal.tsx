import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { PricingPlan } from '../types';
import { playSuccessChord } from '../utils/soundEffects';

interface SelectedPlanModalProps {
  plan: PricingPlan | null;
  onClose: () => void;
}

export const SelectedPlanModal: React.FC<SelectedPlanModalProps> = ({ plan, onClose }) => {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('6');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    playSuccessChord(true);
    setTimeout(() => {
      // Keep open briefly or close
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 relative">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center absolute top-5 right-5 text-sm font-bold cursor-pointer"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase mb-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Selected: {plan.name} Plan</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Start Your Home Bridge
              </h3>
              <p className="text-xs text-slate-500">
                {plan.id === 'free' 
                  ? 'Free forever • 1 child, up to 2 goals, email reminders'
                  : `${plan.name} Tier • 14-day free trial included`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Parent / Caregiver Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Child's First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noah"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Child's Age
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((age) => (
                      <option key={age} value={age}>{age} years old</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Honoring Your Existing Care Team</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  You can enter your external therapist's recommended exercises right away, or pick from our 40+ built-in library exercises.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{plan.id === 'free' ? 'Create Free Account' : 'Activate 14-Day Free Trial'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                No credit card required for Free plan. Cancel anytime.
              </p>
            </form>
          </>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Welcome to Autism Child Bridge!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Profile created for <strong>{childName || 'your child'}</strong>. We've sent your activation link to <strong>{email}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-xs mx-auto">
              Your landing page is configured and ready. When you're ready, connect this to your custom dashboard backend.
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Done & Return to Landing Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
