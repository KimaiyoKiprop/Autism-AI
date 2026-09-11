import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  HelpCircle, 
  Layers, 
  Plus, 
  RotateCcw 
} from 'lucide-react';
import { Milestone, MilestoneDomain } from '../types';
import { playSuccessChord, playSoftChime } from '../utils/soundEffects';

interface PersonalizedPlannerProps {
  onAddMilestonesToChild: (milestones: Omit<Milestone, 'id'>[]) => void;
  activeChildName: string;
  soundEnabled: boolean;
}

export const PersonalizedMilestonePlanner: React.FC<PersonalizedPlannerProps> = ({
  onAddMilestonesToChild,
  activeChildName,
  soundEnabled
}) => {
  const [step, setStep] = useState<number>(1);

  // Parent preferences
  const [ageRange, setAgeRange] = useState<'2-4' | '5-7' | '8-11' | '12+'>('5-7');
  const [commStyle, setCommStyle] = useState<'Verbal' | 'Emerging Verbal' | 'AAC / PECS' | 'Gestural'>('Emerging Verbal');
  const [sensoryType, setSensoryType] = useState<'Sensory Sensitive' | 'Sensory Seeker' | 'Balanced / Mixed'>('Sensory Sensitive');
  const [primaryGoal, setPrimaryGoal] = useState<'Transitions & Meltdowns' | 'Functional Communication' | 'Peer Play & Social' | 'Daily Self-Care'>('Transitions & Meltdowns');

  const [generatedMilestones, setGeneratedMilestones] = useState<Omit<Milestone, 'id'>[] | null>(null);
  const [hasAddedToRecord, setHasAddedToRecord] = useState(false);

  const handleGeneratePlan = () => {
    // Generate tailored clinical milestones according to choices
    let milestones: Omit<Milestone, 'id'>[] = [];

    if (primaryGoal === 'Transitions & Meltdowns') {
      milestones = [
        {
          domain: 'Sensory & Self-Regulation',
          title: `Uses 3-Minute Visual Countdown for Activities`,
          description: `Child accepts shifting away from preferred tasks when shown visual sand timer or color bar without severe distress.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 40,
          notes: 'Tailored transition baseline for home routine.',
          therapistTip: 'Always give a 5-minute and a 2-minute visual reminder before the final bell.'
        },
        {
          domain: 'Sensory & Self-Regulation',
          title: `Independently Accesses Sensory Safe Zone`,
          description: `Identifies onset of overwhelm and walks to quiet corner or asks for weighted blanket.`,
          targetAge: `Age ${ageRange}`,
          status: 'upcoming',
          progressPercent: 20,
          notes: 'Self-advocacy development.',
          therapistTip: 'Keep quiet corner free of questions or demands.'
        },
        {
          domain: 'Communication & Speech',
          title: `Communicates "Finished" or "Help Please" via ${commStyle}`,
          description: `Spontaneously initiates the break/help request instead of emotional escalation.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 50,
          notes: 'Functional communication replacement behavior.',
          therapistTip: 'Prompt before frustration peaks.'
        },
        {
          domain: 'Daily Living & Motor',
          title: `Checks Off Next Step on Daily Visual Schedule`,
          description: `Moves physical or digital icon card from "To Do" to "Done" pocket after completion.`,
          targetAge: `Age ${ageRange}`,
          status: 'upcoming',
          progressPercent: 15,
          notes: 'Fostering daily independence.',
          therapistTip: 'Praise autonomy with high-five or special interest sticker.'
        }
      ];
    } else if (primaryGoal === 'Functional Communication') {
      milestones = [
        {
          domain: 'Communication & Speech',
          title: `Spontaneous Multi-Symbol Expression (${commStyle})`,
          description: `Combines Action + Object (e.g. "Want train", "Open snack") across at least 2 distinct settings.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 60,
          notes: 'Language expansion target.',
          therapistTip: 'Model without demanding exact imitation.'
        },
        {
          domain: 'Communication & Speech',
          title: `Expresses Physiological Discomfort (Hungry / Thirsty / Pain)`,
          description: `Taps visual icon or uses core word when bodily comfort requires adult assistance.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 45,
          notes: 'Crucial health & safety communication.',
          therapistTip: 'Keep bodily sensation icons on primary AAC homepage.'
        },
        {
          domain: 'Social & Play Skills',
          title: `Shares Joyful Moment via Eye Gaze, Smile, or Gesture`,
          description: `Looks toward caregiver or points to share amusement at a sensory toy.`,
          targetAge: `Age ${ageRange}`,
          status: 'upcoming',
          progressPercent: 25,
          notes: 'Joint attention foundation.',
          therapistTip: 'Join child in their play focus rather than redirecting.'
        },
        {
          domain: 'Sensory & Self-Regulation',
          title: `Signals "Too Loud" or "Too Bright"`,
          description: `Advocates for sensory environment adjustments before shutdown occurs.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 55,
          notes: 'Sensory awareness communication.',
          therapistTip: 'Provide immediate positive reinforcement when signaled.'
        }
      ];
    } else if (primaryGoal === 'Peer Play & Social') {
      milestones = [
        {
          domain: 'Social & Play Skills',
          title: `Parallel Play Alongside Peer for 10+ Minutes`,
          description: `Engages comfortably with similar toys in proximity to a peer without territorial distress.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 50,
          notes: 'Comfort in shared sensory space.',
          therapistTip: 'Ensure duplicate toys are available to remove scarcity pressure.'
        },
        {
          domain: 'Social & Play Skills',
          title: `Turn-Taking with Structured Visual Token`,
          description: `Passes turn token ("My Turn" / "Your Turn") during building block or track activities.`,
          targetAge: `Age ${ageRange}`,
          status: 'upcoming',
          progressPercent: 30,
          notes: 'Reciprocal social cooperation.',
          therapistTip: 'Keep turns short (under 20 seconds) initially.'
        },
        {
          domain: 'Sensory & Self-Regulation',
          title: `Takes Proactive Quiet Break During Group Play`,
          description: `Steps aside for 2 minutes to recharge nervous system before returning to group.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 40,
          notes: 'Social pacing & energy conservation.',
          therapistTip: 'Normalize breaks as a healthy superpower.'
        },
        {
          domain: 'Communication & Speech',
          title: `Greets Peer via Preferred Communication Mode`,
          description: `Gives wave, high-five, or AAC greeting button press upon arrival.`,
          targetAge: `Age ${ageRange}`,
          status: 'upcoming',
          progressPercent: 20,
          notes: 'Community connection milestone.',
          therapistTip: 'Do not force eye contact; physical presence and gesture are completely valid.'
        }
      ];
    } else {
      // Daily Self-Care
      milestones = [
        {
          domain: 'Daily Living & Motor',
          title: `Tolerates Sensory Tooth Brushing for 60 Seconds`,
          description: `Uses soft silicone brush and mild flavor toothpaste with calm breathing.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 50,
          notes: 'Oral sensory desensitization.',
          therapistTip: 'Use a visual timer and non-foaming unflavored paste if taste is an issue.'
        },
        {
          domain: 'Daily Living & Motor',
          title: `Independently Completes Hand Washing Sequence`,
          description: `Water on -> Soap -> Scrub 15s -> Rinse -> Dry hands on towel.`,
          targetAge: `Age ${ageRange}`,
          status: 'in_progress',
          progressPercent: 70,
          notes: 'Hygiene sequencing mastery.',
          therapistTip: 'Use a foaming pump soap for tactile engagement.'
        },
        {
          domain: 'Daily Living & Motor',
          title: `Puts on Socks & Shoes with Minimal Prompting`,
          description: `Handles seamless socks and velcro strap fastenings independently.`,
          targetAge: `Age ${ageRange}`,
          status: 'upcoming',
          progressPercent: 25,
          notes: 'Morning departure independence.',
          therapistTip: 'Ensure socks are seam-free or worn inside out to avoid sensory friction.'
        },
        {
          domain: 'Sensory & Self-Regulation',
          title: `Self-Selects Comfortable Clothing Textures`,
          description: `Expresses tactile preference for tagless, soft cotton garments.`,
          targetAge: `Age ${ageRange}`,
          status: 'achieved',
          progressPercent: 100,
          notes: 'Sensory body awareness mastered.',
          therapistTip: 'Respect clothing choices that minimize sensory drag.'
        }
      ];
    }

    setGeneratedMilestones(milestones);
    setHasAddedToRecord(false);
    playSuccessChord(soundEnabled);
  };

  const handleCommitToChild = () => {
    if (!generatedMilestones) return;
    onAddMilestonesToChild(generatedMilestones);
    setHasAddedToRecord(true);
    playSuccessChord(soundEnabled);
  };

  return (
    <section id="milestone-planner" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative soft orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/60 border border-teal-700/60 text-teal-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>Personalized Milestone Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Build a Custom Milestone Roadmap for Your Child
          </h2>

          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
            Every neurodivergent child possesses a unique sensory profile, communication style, and growth timeline. Generate individual developmental milestones tailored to your child's reality.
          </p>
        </div>

        {/* Wizard Controls */}
        <div className="relative z-10 max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Age Range */}
            <div>
              <label className="block text-xs font-bold text-teal-200 uppercase tracking-wider mb-2">
                1. Developmental Age
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-teal-700/60 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="2-4">Age 2 - 4 (Early Intervention)</option>
                <option value="5-7">Age 5 - 7 (Primary Foundations)</option>
                <option value="8-11">Age 8 - 11 (Intermediate Autonomy)</option>
                <option value="12+">Age 12+ (Tween & Teen Transitions)</option>
              </select>
            </div>

            {/* Communication Style */}
            <div>
              <label className="block text-xs font-bold text-teal-200 uppercase tracking-wider mb-2">
                2. Communication Mode
              </label>
              <select
                value={commStyle}
                onChange={(e) => setCommStyle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-teal-700/60 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="Verbal">Verbal (Full Sentences)</option>
                <option value="Emerging Verbal">Emerging Verbal (1-3 Words)</option>
                <option value="AAC / PECS">AAC Device / PECS Picture Cards</option>
                <option value="Gestural">Gestural, Sign & Visual Cues</option>
              </select>
            </div>

            {/* Sensory Profile */}
            <div>
              <label className="block text-xs font-bold text-teal-200 uppercase tracking-wider mb-2">
                3. Sensory Profile
              </label>
              <select
                value={sensoryType}
                onChange={(e) => setSensoryType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-teal-700/60 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="Sensory Sensitive">Sensory Sensitive (Easily Overwhelmed)</option>
                <option value="Sensory Seeker">Sensory Seeker (Caves, Jumping, Textures)</option>
                <option value="Balanced / Mixed">Dual / Mixed Sensory Profile</option>
              </select>
            </div>

            {/* Priority Goal */}
            <div>
              <label className="block text-xs font-bold text-teal-200 uppercase tracking-wider mb-2">
                4. Primary Focus Area
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-teal-700/60 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="Transitions & Meltdowns">Transitions & De-escalation</option>
                <option value="Functional Communication">Functional Communication</option>
                <option value="Peer Play & Social">Peer Play & Shared Space</option>
                <option value="Daily Self-Care">Daily Self-Care & Routines</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              id="generate-milestones-btn"
              onClick={handleGeneratePlan}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Personalized Roadmap
            </button>
          </div>

          {/* Generated Roadmap Preview */}
          <AnimatePresence>
            {generatedMilestones && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 pt-8 border-t border-white/15"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-teal-300" />
                      Individualized Milestone Roadmap Generated
                    </h3>
                    <p className="text-xs text-teal-200/80">
                      4 clinical growth steps tailored for {commStyle} communication & {sensoryType} profile
                    </p>
                  </div>

                  <button
                    onClick={handleCommitToChild}
                    disabled={hasAddedToRecord}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      hasAddedToRecord
                        ? 'bg-emerald-500 text-white cursor-default'
                        : 'bg-white hover:bg-slate-100 text-slate-900 cursor-pointer shadow-sm'
                    }`}
                  >
                    {hasAddedToRecord ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Added to {activeChildName}’s Progress Record!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-teal-700" />
                        <span>Add All 4 to {activeChildName}’s Tracker</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedMilestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-md border border-teal-700/60">
                            {m.domain}
                          </span>
                          <span className="text-[11px] text-teal-200">
                            Step {idx + 1}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white mb-1">
                          {m.title}
                        </h4>

                        <p className="text-xs text-slate-200/80 leading-relaxed mb-3">
                          {m.description}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-teal-800/40 text-[11px] text-teal-200 flex items-start gap-1.5">
                        <span className="font-bold text-teal-400 shrink-0">💡 Tip:</span>
                        <span>{m.therapistTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
