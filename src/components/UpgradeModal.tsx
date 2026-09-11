import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  HeartHandshake,
  Bot,
  FileText,
  Users,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PRICING_PLANS } from '../data/landingData';
import { playSuccessChord, playSoftChime } from '../utils/soundEffects';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: 'plus' | 'family';
  featureHint?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  defaultPlanId = 'plus',
  featureHint
}) => {
  const { userProfile, updateSubscription } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<'plus' | 'family'>(defaultPlanId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly'); // Defaults to monthly
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Simulated payment inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('321');

  if (!isOpen) return null;

  const currentTier = userProfile?.subscriptionTier || 'free';
  const isPaid = userProfile?.isPaid || false;

  const plan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[1];
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const periodLabel = billingCycle === 'monthly' ? '/month' : '/year';

  const handlePayAndUpgrade = async () => {
    setIsProcessing(true);
    playSoftChime(659.25);

    try {
      // Simulate real-time secure payment processing
      await new Promise(res => setTimeout(res, 1200));

      await updateSubscription(selectedPlanId, billingCycle);

      playSuccessChord(true);
      setSuccessMessage(`Payment confirmed! You have successfully upgraded to AutismChildBridge ${plan.name} (${billingCycle === 'monthly' ? 'Monthly' : 'Annual'}). All premium features are now unlocked!`);
      
      setTimeout(() => {
        setSuccessMessage(null);
        setIsProcessing(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Payment error:', err);
      setIsProcessing(false);
    }
  };

  const handleDowngradeToFreeForTesting = async () => {
    setIsProcessing(true);
    await updateSubscription('free', 'monthly');
    playSoftChime(440);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center absolute top-4 right-4 text-sm font-bold cursor-pointer transition-colors"
            aria-label="Close upgrade modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-amber-400/20 rounded-lg text-amber-300 border border-amber-400/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200">
              Parent Access Upgrade
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Unlock AutismChildBridge AI Full Access
          </h2>

          <p className="text-xs text-teal-100 mt-1 max-w-md font-normal leading-relaxed">
            {featureHint ? (
              <span className="font-semibold text-amber-200">{featureHint}</span>
            ) : (
              'Empower your home therapy with automated AI clinical syntheses, PDF therapist exports, unlimited goals, and 24/7 AI assistance.'
            )}
          </p>

          {/* Current plan status */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] border border-white/15">
            <span className="text-teal-200">Current Status:</span>
            <span className="font-bold text-white uppercase tracking-wide">
              {isPaid ? `${currentTier} Active (Paid)` : 'Free Tier (Limited Access)'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {successMessage ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold max-w-xs mx-auto border border-emerald-200">
                Refreshing your dashboard with unlimited features...
              </div>
            </div>
          ) : (
            <>
              {/* Billing Cycle Switcher - MONTHLY AS DEFAULT */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Choose Billing Frequency</span>
                  <span className="text-[11px] text-slate-500">Monthly billing selected by default. Cancel anytime.</span>
                </div>

                <div className="inline-flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/60 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      billingCycle === 'yearly'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[9px] px-1 py-0.2 bg-emerald-300/30 text-emerald-800 rounded font-black">
                      Save 30%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plan Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Plus Plan Card */}
                <div
                  onClick={() => setSelectedPlanId('plus')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedPlanId === 'plus'
                      ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Plus Plan</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                      Most Popular
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black text-slate-900">
                      ${billingCycle === 'monthly' ? 9 : 89}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{periodLabel}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-3">
                    For 1 child with unlimited goals, weekly AI summaries, and clinic PDF exports.
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Weekly AI Progress Summaries</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>One-click Clinic PDF Export</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Unlimited therapy goals</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>24/7 AutismChildBridge AI</span>
                    </div>
                  </div>
                </div>

                {/* Family Plan Card */}
                <div
                  onClick={() => setSelectedPlanId('family')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedPlanId === 'family'
                      ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Family Plan</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Multi-Child
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black text-slate-900">
                      ${billingCycle === 'monthly' ? 18 : 149}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{periodLabel}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-3">
                    Up to 4 children, unlimited care team logins (grandparents, nanny, therapists).
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>All Plus features included</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Up to 4 child profiles</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Unlimited co-caregivers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Direct therapist share link</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Unlocks Comparison Checklist */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Features Unlocked Upon Payment:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>AutismChildBridge AI weekly syntheses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Clinic-ready PDF reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Unlimited active home goals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Sensory & bedtime calming toolkit</span>
                  </div>
                </div>
              </div>

              {/* Secure Payment Checkout Details */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-teal-700" />
                    <span>Payment Method</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>256-Bit Encrypted</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Expires
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayAndUpgrade}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment (${price}{periodLabel})...</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay & Activate {plan.name} (${price}{periodLabel})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-600">
                  Instant activation • 14-day money-back guarantee • Cancel or change plan anytime from Settings
                </p>
              </div>

              {/* Developer / Testing Switcher */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Testing Controls:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDowngradeToFreeForTesting}
                    className="hover:text-rose-600 underline cursor-pointer"
                  >
                    Reset to Free (Locked)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateSubscription('plus', 'monthly');
                      playSuccessChord(true);
                      onClose();
                    }}
                    className="hover:text-teal-700 underline font-semibold cursor-pointer"
                  >
                    Instant Plus
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
