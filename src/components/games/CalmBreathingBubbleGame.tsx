import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { playBubblePop, playSoftChime } from '../../utils/soundEffects';

interface CalmBreathingBubbleProps {
  soundEnabled: boolean;
  onClose?: () => void;
}

interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const CalmBreathingBubbleGame: React.FC<CalmBreathingBubbleProps> = ({
  soundEnabled,
  onClose
}) => {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);

  // Breathing cycle timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'Inhale') {
            setPhase('Hold');
            playSoftChime(soundEnabled);
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 4;
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => c + 1);
            playSoftChime(soundEnabled);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, soundEnabled]);

  // Spawn gentle bubbles on demand
  useEffect(() => {
    const initialBubbles: FloatingBubble[] = [
      { id: 1, x: 20, y: 30, size: 44, color: 'bg-teal-200/60' },
      { id: 2, x: 75, y: 25, size: 52, color: 'bg-sky-200/60' },
      { id: 3, x: 15, y: 70, size: 48, color: 'bg-emerald-200/60' },
      { id: 4, x: 80, y: 75, size: 40, color: 'bg-indigo-200/60' },
    ];
    setBubbles(initialBubbles);
  }, []);

  const popBubble = (id: number) => {
    playBubblePop(soundEnabled);
    setBubbles((prev) => prev.filter((b) => b.id !== id));

    // Respawn new bubble after short delay
    setTimeout(() => {
      const newBubble: FloatingBubble = {
        id: Date.now(),
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 70) + 15,
        size: Math.floor(Math.random() * 25) + 40,
        color: ['bg-teal-200/60', 'bg-sky-200/60', 'bg-emerald-200/60', 'bg-indigo-200/60'][
          Math.floor(Math.random() * 4)
        ]
      };
      setBubbles((curr) => [...curr, newBubble]);
    }, 1200);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Gently breathe in cool, calm air through your nose...';
      case 'Hold':
        return 'Hold the peaceful feeling inside your chest...';
      case 'Exhale':
        return 'Slowly let the breath out through your mouth like blowing a feather...';
    }
  };

  const getCircleScale = () => {
    if (phase === 'Inhale') return 1.45;
    if (phase === 'Hold') return 1.45;
    return 0.85;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto border border-teal-100 shadow-xl shadow-teal-900/5 select-none">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg sm:text-xl">
              Calm Breathing Bubble
            </h3>
            <p className="text-xs text-slate-700">
              Vagus nerve regulation & sensory down-regulation • {cyclesCompleted} Cycles Done
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setPhase('Inhale');
            setSeconds(4);
            setCyclesCompleted(0);
          }}
          className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-full font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      {/* Main Breathing Stage with Tactile Popping Bubbles */}
      <div className="relative w-full h-80 rounded-3xl bg-gradient-to-b from-teal-50/50 via-sky-50/30 to-emerald-50/50 flex flex-col items-center justify-center overflow-hidden border border-teal-100/60 mb-6">
        {/* Floating Tactile Bubbles */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.button
              key={b.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 0.8,
                y: [0, -8, 0],
                transition: { y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }
              }}
              exit={{ scale: 1.4, opacity: 0 }}
              onClick={() => popBubble(b.id)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size}px`
              }}
              className={`absolute rounded-full backdrop-blur-xs border border-white/80 cursor-pointer shadow-sm flex items-center justify-center text-xs font-bold text-teal-800 ${b.color}`}
              title="Tap to pop bubble gently"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600/70" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Central Breathing Orb */}
        <motion.div
          animate={{ scale: getCircleScale() }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="w-40 h-40 rounded-full bg-gradient-to-tr from-teal-400 via-sky-300 to-emerald-200 p-1 flex items-center justify-center shadow-xl shadow-teal-500/15"
        >
          <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-3">
            <span className="text-xs uppercase tracking-widest font-bold text-teal-600">
              {phase}
            </span>
            <span className="text-3xl font-extrabold text-slate-800 my-0.5">
              {seconds}s
            </span>
            <span className="text-[10px] text-slate-700">
              {phase === 'Inhale' ? 'Breathe In' : phase === 'Hold' ? 'Rest Peacefully' : 'Slow Exhale'}
            </span>
          </div>
        </motion.div>

        {/* Sensory Tip inside stage */}
        <p className="absolute bottom-3 text-[11px] text-slate-700 bg-white/80 px-3 py-1 rounded-full border border-slate-200/60 shadow-xs">
          Tip: Tap any floating bubble to pop it softly!
        </p>
      </div>

      {/* Gentle Guidance Text */}
      <div className="text-center mb-6">
        <p className="text-base font-semibold text-slate-800">
          {getPhaseInstruction()}
        </p>
      </div>

      {/* Play / Pause Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2 shadow-md shadow-teal-700/20"
        >
          {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isActive ? 'Pause Breathing' : 'Resume Breathing'}
        </button>
      </div>

      {onClose && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-700 hover:text-slate-800 font-medium underline"
          >
            Close Activity
          </button>
        </div>
      )}
    </div>
  );
};
