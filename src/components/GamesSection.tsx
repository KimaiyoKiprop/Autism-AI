import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Sparkles, 
  Smile, 
  Music, 
  Wind, 
  Layers, 
  Play, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldCheck, 
  X,
  Volume2
} from 'lucide-react';
import { availableGames } from '../data/mockData';
import { LearningGame } from '../types';
import { EmotionMatcherGame } from './games/EmotionMatcherGame';
import { SensorySequencerGame } from './games/SensorySequencerGame';
import { CalmBreathingBubbleGame } from './games/CalmBreathingBubbleGame';

interface GamesSectionProps {
  soundEnabled: boolean;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ soundEnabled }) => {
  const [activePlayGameId, setActivePlayGameId] = useState<string | null>(null);

  const getGameIcon = (id: string) => {
    switch (id) {
      case 'game-emotion':
        return <Smile className="w-6 h-6 text-emerald-600" />;
      case 'game-rhythm':
        return <Music className="w-6 h-6 text-teal-600" />;
      case 'game-breathing':
        return <Wind className="w-6 h-6 text-sky-600" />;
      default:
        return <Layers className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <section id="interactive-games" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Gamepad2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Sensory-Safe Interactive Learning</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Games Designed for Neurodivergent Joy, Not Stress
        </h2>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Traditional educational games are packed with flashing banners, buzzer sounds, and high-pressure timers that trigger sensory overload. SpectrumSteps games are clinically calibrated: ultra-gentle stimulation, natural pacing, and positive validation.
        </p>
      </div>

      {/* 4 Clinical Pillars of Our Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
          <span className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Zero Time Pressure</h4>
            <p className="text-xs text-slate-700 mt-0.5">No penalty count-downs or rushing. Children process at their personal tempo.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
          <span className="p-2 rounded-xl bg-sky-50 text-sky-700 shrink-0">
            <Volume2 className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Acoustic Comfort</h4>
            <p className="text-xs text-slate-700 mt-0.5">Synthesized soft sine frequencies replace jarring buzzers and loud alarms.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Errorless Learning</h4>
            <p className="text-xs text-slate-700 mt-0.5">No "Game Over" screens. Gentle guidance nudges children toward mastery.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
          <span className="p-2 rounded-xl bg-purple-50 text-purple-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Special Interest Friendly</h4>
            <p className="text-xs text-slate-700 mt-0.5">Themes incorporate trains, solar systems, and nature patterns children love.</p>
          </div>
        </div>
      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableGames.map((game: LearningGame) => (
          <div
            key={game.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badge & Category */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  {getGameIcon(game.id)}
                </span>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                  {game.sensoryLevel}
                </span>
              </div>

              <span className="text-xs font-semibold text-slate-700 block mb-1">
                {game.category}
              </span>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {game.title}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {game.description}
              </p>

              {/* Target & Duration */}
              <div className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-[11px] text-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Target Age:</span>
                  <span className="font-semibold text-slate-800">{game.targetAges}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Ideal Duration:</span>
                  <span className="font-semibold text-slate-800">{game.duration}</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div>
              {game.playable ? (
                <button
                  id={`play-game-${game.id}`}
                  onClick={() => setActivePlayGameId(game.id)}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Play Live Demo Now
                </button>
              ) : (
                <div className="w-full py-2.5 px-4 bg-slate-100 text-slate-500 font-medium text-xs rounded-xl text-center">
                  Full Suite in Member Portal
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Playable Game Modal Dialog */}
      <AnimatePresence>
        {activePlayGameId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button on Modal */}
              <button
                onClick={() => setActivePlayGameId(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close game modal"
              >
                <X className="w-5 h-5" />
              </button>

              {activePlayGameId === 'game-emotion' && (
                <EmotionMatcherGame
                  soundEnabled={soundEnabled}
                  onClose={() => setActivePlayGameId(null)}
                />
              )}

              {activePlayGameId === 'game-rhythm' && (
                <SensorySequencerGame
                  soundEnabled={soundEnabled}
                  onClose={() => setActivePlayGameId(null)}
                />
              )}

              {activePlayGameId === 'game-breathing' && (
                <CalmBreathingBubbleGame
                  soundEnabled={soundEnabled}
                  onClose={() => setActivePlayGameId(null)}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
