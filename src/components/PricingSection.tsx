import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { PRICING_PLANS } from '../data/landingData';
import { PricingPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
          <CreditCard className="w-3.5 h-3.5 text-teal-600" />
          <span>Simple, Transparent Plans</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Invest in Your Child's Home Therapy Success
        </h2>

        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Start free with no credit card required. Upgrade anytime to unlock AI weekly clinical digests, hands-free voice transcription, and exportable PDF therapist reports.
        </p>

        {/* Monthly vs Yearly Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
              billingCycle === 'yearly' ? 'bg-teal-800 text-teal-100' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Save up to 31%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const displayPrice = plan.id === 'free' 
            ? '$0' 
            : billingCycle === 'yearly' 
              ? `$${plan.yearlyPrice}` 
              : `$${plan.monthlyPrice}`;
          
          const period = plan.id === 'free' 
            ? 'forever' 
            : billingCycle === 'yearly' ? '/year' : '/month';

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 border transition-all flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-white border-2 border-teal-600 shadow-xl shadow-teal-900/10 scale-102 z-10'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-700 text-white text-[11px] font-extrabold rounded-full tracking-wide shadow-xs whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {plan.targetAudience}
                  </span>
                </div>

                <p className="text-xs text-slate-600 min-h-[36px] mb-4">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="py-4 border-y border-slate-100 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      {displayPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{period}</span>
                  </div>
                  <span className="text-[11px] text-teal-700 font-semibold block mt-1">
                    {plan.id === 'free' ? 'No credit card needed' : plan.billedNote}
                  </span>
                </div>

                {/* Features Checkmarks */}
                <div className="space-y-3 text-xs mb-6">
                  <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                    What's Included:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {/* Limitations for free */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Plan Limitations:
                      </span>
                      {plan.limitations.map((lim, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-400">
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <span>{lim}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    plan.popular
                      ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-md shadow-teal-800/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee & Transparency */}
      <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto space-y-2">
        <p className="flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>14-day money-back guarantee on paid plans. Cancel anytime with one click in settings.</span>
        </p>
        <p className="text-[11px] text-slate-400">
          Free accounts enjoy basic text & photo logging for 1 child with email reminders. A gentle, soft upgrade prompt appears after 7 days of active use.
        </p>
      </div>
    </section>
  );
};
