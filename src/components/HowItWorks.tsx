import React, { useState } from 'react';
import { 
  UserCheck, 
  Target, 
  Bell, 
  CheckSquare, 
  Sparkles, 
  FileDown, 
  ArrowRight, 
  CheckCircle2, 
  Mic, 
  Calendar,
  Share2,
  BrainCircuit,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { CORE_FLOW_STEPS } from '../data/landingData';

interface HowItWorksProps {
  onOpenLogDemo: () => void;
  onOpenReportModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenLogDemo, onOpenReportModal }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const stepIcons = [
    UserCheck,
    Target,
    Bell,
    CheckSquare,
    Sparkles,
    FileDown
  ];

  const currentStep = CORE_FLOW_STEPS[activeStep - 1];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
          <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
          <span>The Core Parent-Therapist Journey</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          How Autism Child Bridge Works
        </h2>

        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Designed specifically for autistic children and exhausted parents. A 6-step flow built to turn clinic goals into gentle home routines, without stress or guesswork.
        </p>
      </div>

      {/* Step Selector Pills (Horizontal on Desktop, Scrollable on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start sm:justify-center">
        {CORE_FLOW_STEPS.map((step, idx) => {
          const Icon = stepIcons[idx];
          const isActive = activeStep === step.stepNumber;
          return (
            <button
              key={step.stepNumber}
              onClick={() => setActiveStep(step.stepNumber)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-800/20 scale-102'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-teal-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {step.stepNumber}
              </span>
              <Icon className="w-3.5 h-3.5" />
              <span>{step.badgeText}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg shadow-teal-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left 6 Cols: Explanatory Content */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold">
              <span>Step {currentStep.stepNumber} of 6</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentStep.title}
            </h3>

            <p className="text-sm font-semibold text-teal-800">
              {currentStep.subtitle}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {currentStep.description}
            </p>

            {/* Bullet Checkpoints */}
            <div className="space-y-2.5 pt-2">
              {currentStep.bulletPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Step Specific Action Button */}
            <div className="pt-4 flex items-center gap-3">
              {activeStep === 4 && (
                <button
                  onClick={onOpenLogDemo}
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Try 10s Log Simulator Now</span>
                </button>
              )}
              {activeStep === 6 && (
                <button
                  onClick={onOpenReportModal}
                  className="px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>View Sample 2-Week Therapist PDF</span>
                </button>
              )}
              {activeStep !== 6 ? (
                <button
                  onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
                  className="px-4 py-2 text-slate-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Choose Your Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right 6 Cols: Interactive Stage Simulation Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-inner">
              {/* Step 1 Mockup: Onboarding Profile */}
              {activeStep === 1 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Child Profile Setup</span>
                    <span className="text-[11px] text-teal-700 font-bold">Done in 2 mins</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Child's Name & Age</label>
                      <div className="flex gap-2">
                        <input readOnly value="Noah" className="w-2/3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium" />
                        <input readOnly value="Age 6" className="w-1/3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Communication Style</label>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-md font-bold text-[11px]">AAC Device / PECS</span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px]">Emerging Verbal</span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px]">Gestural</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Sensory Notes (Optional)</label>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 italic">
                        "Hypersensitive to sudden blender sounds. Calms down with deep pressure weighted blanket and spinning pinwheels."
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Mockup: Goals & Exercises */}
              {activeStep === 2 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Therapist Goal #1</span>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">SLP & OT Goal</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    "Increase reciprocal greeting engagement"
                  </h4>
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-teal-950 text-xs">Assigned Exercise: Morning Puppet Greeting</span>
                      <span className="text-[10px] text-teal-800 font-bold">5 min • 3x/wk</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Picked from built-in library. Modeled with favorite dinosaur plush toy.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span>Library source: Pediatric SLP Protocol</span>
                    <span>•</span>
                    <span className="text-teal-700 font-semibold">+ Add 2nd Goal</span>
                  </div>
                </div>
              )}

              {/* Step 3 Mockup: Smart Reminders */}
              {activeStep === 3 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Smart Reminder Notification</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Scheduled 9:30 AM</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-teal-700" />
                      <span className="font-bold text-teal-950">Time for Morning Greeting Game with Noah</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      "Target: 5 minutes. Remember to wait 10 seconds for his processing pause!"
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button className="px-3 py-1 bg-teal-700 text-white rounded-lg text-[11px] font-bold">Start Now (5 min)</button>
                      <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-medium">Skip Today (No Guilt)</button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Streak preserved! Skips are treated as therapeutic recovery days.
                  </p>
                </div>
              )}

              {/* Step 4 Mockup: 1-Tap Log */}
              {activeStep === 4 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Post-Exercise Log</span>
                    <span className="text-[10px] text-slate-500">Takes 5-10 seconds</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-center text-xs ring-2 ring-emerald-300">
                      ✓ Done
                    </div>
                    <div className="py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-center text-xs">
                      Partial
                    </div>
                    <div className="py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-center text-xs">
                      Skipped
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="text-[11px] text-slate-700 italic">
                      "Noah selected the wave icon on his AAC board unassisted!"
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-md text-center">
                    Saved to weekly memory timeline & syncs with co-caregivers
                  </div>
                </div>
              )}

              {/* Step 5 Mockup: Weekly AI Synthesis */}
              {activeStep === 5 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-slate-900">AI Weekly Progress Digest</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Adherence: 85%</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200">
                      <strong className="text-emerald-950 block">What Went Well:</strong>
                      <span className="text-slate-700">Noah completed 4 of 4 greeting games. Receptive eye contact increased.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200">
                      <strong className="text-amber-950 block">Pattern Discovered:</strong>
                      <span className="text-slate-700">Evening exercises were skipped twice due to post-school sensory exhaustion.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-teal-50/70 border border-teal-200">
                      <strong className="text-teal-950 block">Question for Therapist:</strong>
                      <span className="text-slate-700">"Should we move evening speech drills to Saturday mornings when he is fresh?"</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 Mockup: PDF Report */}
              {activeStep === 6 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Therapist Visit PDF (2-Week Summary)</span>
                    <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded">Ready to Print</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <strong className="text-slate-800">Patient: Noah (Age 6)</strong>
                      <span className="text-slate-500">Provider: Dr. Marcus Vance, OTR/L</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full w-[85%]" />
                    </div>
                    <p className="text-[11px] text-slate-600">
                      12 of 14 home exercises logged. Includes parent voice transcripts, sensory notes, and 3 clinical questions for today's appointment.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button 
                      onClick={onOpenReportModal}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-teal-400" />
                      <span>Preview Printable PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Safety Badge */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Zero clinical invention. Strictly summarizes what you observe to support your therapist.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
