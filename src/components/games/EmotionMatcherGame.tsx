import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, ShieldAlert, Sparkles, Heart, RefreshCw, Star, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { playSoftChime, playSuccessChord } from '../../utils/soundEffects';

interface EmotionMatcherGameProps {
  soundEnabled: boolean;
  onClose?: () => void;
}

interface Question {
  id: number;
  scenario: string;
  contextHint: string;
  correctEmotion: string;
  options: {
    emotion: string;
    label: string;
    icon: string;
    bg: string;
    border: string;
    text: string;
    explanation: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    scenario: "Leo puts on his soft noise-canceling headphones in the loud grocery store.",
    contextHint: "The loud beeping sounds disappear and his head feels peaceful.",
    correctEmotion: "Calm",
    options: [
      {
        emotion: "Calm",
        label: "Peaceful & Calm",
        icon: "😌",
        bg: "bg-teal-50 hover:bg-teal-100",
        border: "border-teal-200",
        text: "text-teal-900",
        explanation: "Yes! The quiet headphones helped his sensory system feel relaxed and safe."
      },
      {
        emotion: "Overwhelmed",
        label: "Overwhelmed",
        icon: "🤯",
        bg: "bg-amber-50 hover:bg-amber-100",
        border: "border-amber-200",
        text: "text-amber-900",
        explanation: "He was overwhelmed before, but the headphones brought calm!"
      },
      {
        emotion: "Angry",
        label: "Angry",
        icon: "😠",
        bg: "bg-rose-50 hover:bg-rose-100",
        border: "border-rose-200",
        text: "text-rose-900",
        explanation: "Not quite angry—headphones help him feel protected and rested."
      }
    ]
  },
  {
    id: 2,
    scenario: "Maya connects the last piece to her wooden train railway system.",
    contextHint: "The train rolls all the way around the track smoothly.",
    correctEmotion: "Proud & Happy",
    options: [
      {
        emotion: "Tired",
        label: "Sleepy / Tired",
        icon: "🥱",
        bg: "bg-slate-50 hover:bg-slate-100",
        border: "border-slate-200",
        text: "text-slate-900",
        explanation: "Building trains took focus, but seeing it work feels wonderful!"
      },
      {
        emotion: "Proud & Happy",
        label: "Happy & Proud",
        icon: "🌟",
        bg: "bg-amber-50 hover:bg-amber-100",
        border: "border-amber-200",
        text: "text-amber-900",
        explanation: "Wonderful! Finishing a project gives a warm feeling of accomplishment."
      },
      {
        emotion: "Scared",
        label: "Scared",
        icon: "😨",
        bg: "bg-indigo-50 hover:bg-indigo-100",
        border: "border-indigo-200",
        text: "text-indigo-900",
        explanation: "The train tracks are safe and fun, bringing big joyful smiles!"
      }
    ]
  },
  {
    id: 3,
    scenario: "The school fire alarm unexpectedly rings with bright flashing red strobe lights.",
    contextHint: "The sound is piercing, high-pitched, and very startling.",
    correctEmotion: "Sensory Overloaded",
    options: [
      {
        emotion: "Sensory Overloaded",
        label: "Sensory Overloaded",
        icon: "😣",
        bg: "bg-orange-50 hover:bg-orange-100",
        border: "border-orange-200",
        text: "text-orange-900",
        explanation: "Spot on! Intense sounds and strobe lights can overwhelm our nervous system."
      },
      {
        emotion: "Calm",
        label: "Completely Calm",
        icon: "😌",
        bg: "bg-emerald-50 hover:bg-emerald-100",
        border: "border-emerald-200",
        text: "text-emerald-900",
        explanation: "Sudden loud alarms are very difficult for sensitive ears."
      },
      {
        emotion: "Bored",
        label: "Bored",
        icon: "😐",
        bg: "bg-slate-50 hover:bg-slate-100",
        border: "border-slate-200",
        text: "text-slate-900",
        explanation: "Fire alarms are intense, making us want to cover our ears immediately."
      }
    ]
  }
];

export const EmotionMatcherGame: React.FC<EmotionMatcherGameProps> = ({
  soundEnabled,
  onClose
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (emotion: string) => {
    if (isAnswered) return;
    setSelectedOption(emotion);
    setIsAnswered(true);

    if (emotion === currentQ.correctEmotion) {
      setStars((prev) => prev + 1);
      playSuccessChord(soundEnabled);
    } else {
      playSoftChime(soundEnabled);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed all
      setCurrentIdx(0);
    }
  };

  const isCorrect = selectedOption === currentQ.correctEmotion;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto border border-emerald-100 shadow-xl shadow-teal-900/5">
      {/* Game Header */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg sm:text-xl">
              Emotion & Feelings Explorer
            </h3>
            <p className="text-xs text-slate-700">
              Gentle social-emotional learning • Question {currentIdx + 1} of {questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-bold text-xs text-amber-800">{stars} Stars Earned</span>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-gradient-to-br from-teal-50/70 to-emerald-50/50 rounded-2xl p-5 border border-teal-100/80 mb-6">
        <span className="inline-block text-[11px] uppercase tracking-wider font-bold text-teal-800 bg-teal-100/90 px-2.5 py-0.5 rounded-full mb-2">
          Story Scenario
        </span>
        <p className="text-base sm:text-lg font-semibold text-slate-800 mb-1.5">
          "{currentQ.scenario}"
        </p>
        <p className="text-xs sm:text-sm text-slate-700 italic">
          💡 Clue: {currentQ.contextHint}
        </p>
      </div>

      <p className="text-sm font-medium text-slate-800 mb-3 text-center">
        How does the child feel right now?
      </p>

      {/* Option Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt.emotion;
          const isThisCorrect = opt.emotion === currentQ.correctEmotion;
          
          let cardStyle = `${opt.bg} ${opt.border} ${opt.text}`;
          if (isAnswered) {
            if (isThisCorrect) {
              cardStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300';
            } else if (isSelected && !isThisCorrect) {
              cardStyle = 'bg-slate-100 border-slate-300 text-slate-600 opacity-70';
            }
          }

          return (
            <motion.button
              key={opt.emotion}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(opt.emotion)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] ${cardStyle}`}
            >
              <span className="text-3xl mb-1.5 filter drop-shadow-sm">{opt.icon}</span>
              <span className="font-bold text-sm">{opt.label}</span>
              {isAnswered && isThisCorrect && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Great Match!
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Action */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <span className="p-2 bg-teal-100 rounded-xl text-teal-700 shrink-0">
                <ThumbsUp className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  {isCorrect ? '✨ Wonderful Observation!' : '💙 Good Practice!'}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                  {currentQ.options.find(o => o.emotion === (selectedOption || currentQ.correctEmotion))?.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-teal-700/20 shrink-0"
            >
              {currentIdx < questions.length - 1 ? 'Next Feeling ➔' : 'Play Again ↺'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gentle Bottom Guidance */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
        <span className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
          No penalties, no ticking timers. Play at child’s natural pace.
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-800 font-medium underline"
          >
            Close Game
          </button>
        )}
      </div>
    </div>
  );
};
