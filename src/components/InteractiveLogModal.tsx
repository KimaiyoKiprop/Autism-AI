import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Mic, 
  Camera, 
  Smile, 
  X, 
  Sparkles, 
  Flame, 
  Check, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { playSoftChime, playSuccessChord, playBubblePop } from '../utils/soundEffects';

interface InteractiveLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveLogModal: React.FC<InteractiveLogModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'done' | 'partial' | 'skipped'>('done');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState(
    "Leo maintained eye contact for 5 seconds and initiated 'hello' without prompting!"
  );
  const [rating, setRating] = useState(5);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleStatusSelect = (s: 'done' | 'partial' | 'skipped') => {
    setStatus(s);
    playSoftChime(true);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    playBubblePop(true);
    setTimeout(() => {
      setIsRecording(false);
      setTranscribedText(
        "Leo used his AAC device unassisted to select the dinosaur toy! No sensory overload observed."
      );
      playSoftChime(true);
    }, 1600);
  };

  const handleSave = () => {
    setIsSaved(true);
    playSuccessChord(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center absolute top-5 right-5 text-sm font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Interactive 10-Second Log Demo</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Log Morning Greeting Game
          </h3>
          <p className="text-xs text-slate-500">
            5-minute speech & joint attention exercise with Leo (Age 6)
          </p>
        </div>

        {/* Step 1: One-Tap Selection */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            1. Tap Status:
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleStatusSelect('done')}
              className={`py-3 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                status === 'done'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done</span>
            </button>

            <button
              onClick={() => handleStatusSelect('partial')}
              className={`py-3 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                status === 'partial'
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-amber-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Partial</span>
            </button>

            <button
              onClick={() => handleStatusSelect('skipped')}
              className={`py-3 px-2 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                status === 'skipped'
                  ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-300'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Skip Today</span>
            </button>
          </div>
          {status === 'skipped' && (
            <p className="text-[11px] text-teal-700 font-semibold mt-1.5">
              Streak preserved! Skips are logged as therapeutic recovery time.
            </p>
          )}
        </div>

        {/* Step 2: Hands-Free Voice Note */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800">
              2. Voice Note (Hands-Free):
            </label>
            <span className="text-[10px] text-slate-700 font-semibold">Auto-transcribed</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSimulateVoice}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Listening & transcribing...' : 'Simulate Mic Voice Note'}</span>
              </button>

              <button
                onClick={() => {
                  setPhotoAttached(!photoAttached);
                  playBubblePop(true);
                }}
                className={`p-1.5 rounded-xl border text-xs cursor-pointer flex items-center gap-1 ${
                  photoAttached ? 'bg-teal-100 border-teal-300 text-teal-800' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="text-[10px]">{photoAttached ? 'Photo attached' : '+ Photo'}</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              className="w-full bg-white p-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>

        {/* Step 3: Child Regulation Score */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label className="font-bold text-slate-800">
              3. Regulation & Emotional State:
            </label>
            <span className="text-[11px] font-bold text-teal-700">
              {rating === 5 ? 'Very Regulated & Joyful' : rating >= 3 ? 'Calm / Steady' : 'Overstimulated'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setRating(lvl);
                  playSoftChime(true);
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  rating === lvl
                    ? 'bg-teal-700 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 5 ? '😊' : lvl === 4 ? '🙂' : lvl === 3 ? '😐' : lvl === 2 ? '😕' : '😫'}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          {isSaved ? (
            <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-bounce">
              <Check className="w-4 h-4" />
              <span>Saved in 8 seconds! Streak: 6 Days 🔥</span>
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save Exercise Log</span>
              <span className="text-[10px] text-teal-300 font-normal">(&lt; 10 seconds)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
