import React, { useState } from 'react';
import { X, Target, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { TherapyCategory, FirebaseGoal } from '../types';
import { playSoftChime } from '../utils/soundEffects';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  parentId: string;
  onGoalAdded: (goal: FirebaseGoal) => void;
}

const CATEGORIES: TherapyCategory[] = [
  'Speech & Language',
  'Occupational Therapy',
  'Sensory Regulation',
  'Social & Play',
  'Daily Living'
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  childId,
  parentId,
  onGoalAdded
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TherapyCategory>('Occupational Therapy');
  const [frequency, setFrequency] = useState('Daily (Morning)');
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [therapistTips, setTherapistTips] = useState('');
  const [equipmentNeeded, setEquipmentNeeded] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      // Dynamic import to keep component lean
      const { firebaseService } = await import('../services/firebaseService');
      const newGoal = await firebaseService.addGoal({
        childId,
        parentId,
        title: title.trim(),
        category,
        frequency,
        durationMinutes: Number(durationMinutes),
        therapistTips: therapistTips.trim() || 'Focus on calm engagement and positive reinforcement.',
        equipmentNeeded: equipmentNeeded.trim() || 'Household items / none needed',
        isActive: true
      });
      playSoftChime(659.25);
      onGoalAdded(newGoal);
      onClose();
    } catch (err) {
      console.error('Failed to add goal:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-teal-200">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add New Home Therapy Goal</h3>
              <p className="text-xs text-teal-100">Translate clinical assignments into daily home routines</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Goal or Exercise Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Proprioceptive Wall Push-ups, AAC Symbol Requesting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Domain / Discipline
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TherapyCategory)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="Daily (Morning)">Daily (Morning)</option>
                <option value="Daily (After school)">Daily (After school)</option>
                <option value="Daily (Bedtime)">Daily (Bedtime)</option>
                <option value="3x / week">3x / week</option>
                <option value="2x / week">2x / week</option>
                <option value="As needed (Sensory reset)">As needed (Sensory reset)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Equipment Needed
              </label>
              <input
                type="text"
                placeholder="e.g. Cushions, visual timer, none"
                value={equipmentNeeded}
                onChange={(e) => setEquipmentNeeded(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Therapist Coaching Tips / Home Guidance
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Allow 5 seconds pause. Do not force hand-over-hand; use gentle modeling."
              value={therapistTips}
              onChange={(e) => setTherapistTips(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white placeholder:text-slate-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving to Firebase...' : 'Save Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
