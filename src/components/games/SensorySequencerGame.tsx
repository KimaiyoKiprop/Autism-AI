import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Play, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { playSoftChime, playSuccessChord } from '../../utils/soundEffects';

interface SensorySequencerGameProps {
  soundEnabled: boolean;
  onClose?: () => void;
}

const PAD_CONFIG = [
  { id: 0, name: 'Ocean Mist', color: 'bg-teal-400 hover:bg-teal-300 active:bg-teal-500', activeRing: 'ring-teal-400', freq: 440, label: 'Aqua' },
  { id: 1, name: 'Amber Sun', color: 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500', activeRing: 'ring-amber-400', freq: 554, label: 'Sun' },
  { id: 2, name: 'Lilac Dream', color: 'bg-indigo-400 hover:bg-indigo-300 active:bg-indigo-500', activeRing: 'ring-indigo-400', freq: 659, label: 'Violet' },
  { id: 3, name: 'Rose Petal', color: 'bg-rose-400 hover:bg-rose-300 active:bg-rose-500', activeRing: 'ring-rose-400', freq: 880, label: 'Coral' },
];

export const SensorySequencerGame: React.FC<SensorySequencerGameProps> = ({
  soundEnabled,
  onClose
}) => {
  const [sequence, setSequence] = useState<number[]>([0, 1, 2]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [statusMessage, setStatusMessage] = useState('Press "Play Melody" to listen, then tap the pads!');
  const [successCelebration, setSuccessCelebration] = useState(false);

  // Play a pad tone
  const triggerPadTone = (padId: number) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(PAD_CONFIG[padId].freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio error handled
    }
  };

  const playSequence = (seqToPlay = sequence) => {
    if (isPlayingSeq) return;
    setIsPlayingSeq(true);
    setPlayerStep(0);
    setStatusMessage('Listen closely to the gentle chimes...');

    seqToPlay.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        triggerPadTone(padId);
        setTimeout(() => {
          setActivePad(null);
        }, 350);

        if (index === seqToPlay.length - 1) {
          setTimeout(() => {
            setIsPlayingSeq(false);
            setStatusMessage('Now it’s your turn! Tap the colors in the same order.');
          }, 450);
        }
      }, (index + 1) * 550);
    });
  };

  const handlePadClick = (padId: number) => {
    if (isPlayingSeq) return;

    setActivePad(padId);
    triggerPadTone(padId);
    setTimeout(() => setActivePad(null), 250);

    if (padId === sequence[playerStep]) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        // Completed sequence!
        setSuccessCelebration(true);
        setStatusMessage('✨ Wonderful ear! You completed the melody!');
        playSuccessChord(soundEnabled);

        setTimeout(() => {
          setSuccessCelebration(false);
          const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(nextSeq);
          setLevel(prev => prev + 1);
          setPlayerStep(0);
          setStatusMessage(`Great work! Ready for Level ${level + 1}? Tap Play Melody.`);
        }, 1500);
      }
    } else {
      // Friendly non-punitive guidance
      playSoftChime(soundEnabled);
      setStatusMessage('Almost! Let’s listen one more time. Tap "Listen Again".');
      setPlayerStep(0);
    }
  };

  const handleReset = () => {
    setSequence([0, 1, 2]);
    setLevel(1);
    setPlayerStep(0);
    setStatusMessage('Reset to Level 1. Tap "Play Melody" whenever you are ready.');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto border border-teal-100 shadow-xl shadow-teal-900/5">
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg sm:text-xl">
              Sensory Melody Sequencer
            </h3>
            <p className="text-xs text-slate-700">
              Low-stimulation memory & auditory processing • Level {level}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-full font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Instruction Banner */}
      <div className="text-center py-3 px-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 mb-6">
        <p className="text-sm font-semibold text-emerald-900">
          {statusMessage}
        </p>
      </div>

      {/* Chime Pads Matrix */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto mb-8">
        {PAD_CONFIG.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <motion.button
              key={pad.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => handlePadClick(pad.id)}
              disabled={isPlayingSeq}
              className={`h-28 sm:h-32 rounded-3xl transition-all flex flex-col items-center justify-center text-white font-bold cursor-pointer relative shadow-sm ${pad.color} ${
                isActive ? `ring-8 ${pad.activeRing} scale-105 shadow-lg brightness-110` : 'opacity-90 hover:opacity-100'
              }`}
            >
              <Sparkles className={`w-5 h-5 mb-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`} />
              <span className="text-base tracking-wide">{pad.label}</span>
              <span className="text-[11px] font-normal text-white/80">{pad.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => playSequence()}
          disabled={isPlayingSeq}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            isPlayingSeq
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-teal-700 hover:bg-teal-800 text-white shadow-md shadow-teal-700/20'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          {isPlayingSeq ? 'Playing Chimes...' : playerStep > 0 ? 'Listen Again' : 'Play Melody'}
        </button>

        {successCelebration && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2.5 rounded-2xl animate-pulse">
            <CheckCircle2 className="w-4 h-4" /> Melody Matched! Advancing...
          </div>
        )}
      </div>

      {onClose && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-700 hover:text-slate-800 font-medium underline"
          >
            Close Game
          </button>
        </div>
      )}
    </div>
  );
};
