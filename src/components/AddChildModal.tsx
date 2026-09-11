import React, { useState } from 'react';
import { X, Baby, Heart, Shield, Plus } from 'lucide-react';
import { FirebaseChild } from '../types';
import { playSoftChime } from '../utils/soundEffects';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  onChildAdded: (child: FirebaseChild) => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  parentId,
  onChildAdded
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(5);
  const [communicationStyle, setCommunicationStyle] = useState('Emerging Verbal');
  const [sensoryPreference, setSensoryPreference] = useState('Sensory Sensitive');
  const [specialInterest, setSpecialInterest] = useState('');
  const [calmingTools, setCalmingTools] = useState('Weighted blanket, noise headphones, visual timer');
  const [sensoryTriggers, setSensoryTriggers] = useState('Loud sirens, shirt tags, unexpected schedule changes');
  const [therapistName, setTherapistName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const { firebaseService } = await import('../services/firebaseService');
      const newChild = await firebaseService.createChild(parentId, {
        name: name.trim(),
        age: Number(age),
        communicationStyle,
        sensoryPreference,
        specialInterest: specialInterest.trim() || 'Trains, building blocks & textures',
        calmingTools: calmingTools.split(',').map(s => s.trim()).filter(Boolean),
        sensoryTriggers: sensoryTriggers.split(',').map(s => s.trim()).filter(Boolean),
        therapistName: therapistName.trim(),
        clinicName: clinicName.trim()
      });
      playSoftChime(587.33);
      onChildAdded(newChild);
      onClose();
    } catch (err) {
      console.error('Failed to create child profile:', err);
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
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add Child Profile</h3>
              <p className="text-xs text-teal-100">Setup gentle sensory & communication baselines</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-slate-800 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Child's Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya or Leo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={18}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Communication Style</label>
              <select
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="Verbal">Verbal</option>
                <option value="Emerging Verbal">Emerging Verbal</option>
                <option value="AAC / Tablet Device">AAC / Tablet Device</option>
                <option value="PECS / Visual Cards">PECS / Visual Cards</option>
                <option value="Gestural & Physical">Gestural & Physical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sensory Archetype</label>
              <select
                value={sensoryPreference}
                onChange={(e) => setSensoryPreference(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="Sensory Sensitive">Sensory Sensitive (Low Threshold)</option>
                <option value="Sensory Seeker">Sensory Seeker (High Threshold)</option>
                <option value="Mixed Profile">Mixed Profile (Auditory Avoid, Proprioceptive Seek)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Interests / Passions</label>
            <input
              type="text"
              placeholder="e.g. Space, ocean creatures, spinning wheels, Pokémon"
              value={specialInterest}
              onChange={(e) => setSpecialInterest(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Calming Regulators (comma separated)</label>
            <input
              type="text"
              placeholder="Deep pressure, weighted blanket, swing, visual timer"
              value={calmingTools}
              onChange={(e) => setCalmingTools(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sensory Triggers (comma separated)</label>
            <input
              type="text"
              placeholder="Hand dryers, sudden light changes, unexpected touch"
              value={sensoryTriggers}
              onChange={(e) => setSensoryTriggers(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Therapist Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Emily Hayes, OTR/L"
                value={therapistName}
                onChange={(e) => setTherapistName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Organization</label>
              <input
                type="text"
                placeholder="e.g. Bright Star Pediatric Therapy"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? 'Creating Profile...' : 'Save Child Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
