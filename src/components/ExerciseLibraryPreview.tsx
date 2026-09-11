import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Info,
  Filter,
  Plus
} from 'lucide-react';
import { SAMPLE_EXERCISES } from '../data/landingData';
import { ExerciseItem, TherapyCategory } from '../types';
import { playSoftChime } from '../utils/soundEffects';

export const ExerciseLibraryPreview: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [activeDetailExercise, setActiveDetailExercise] = useState<ExerciseItem | null>(null);

  const categories = [
    'All',
    'Speech & Language',
    'Sensory Regulation',
    'Occupational Therapy',
    'Social & Play',
    'Daily Living'
  ];

  const filteredExercises = SAMPLE_EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch = 
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.therapistGoal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleAdd = (id: string) => {
    playSoftChime(true);
    setAddedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="exercise-library" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Built-in Evidence-Aligned Library</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Pick Common Exercises Instead of Typing from Scratch
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            No need to invent exercises or transcribe messy clinic handouts. Browse 40+ therapist-curated home activities across Speech, OT, Sensory Regulation, and Daily Living.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises or goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => {
          const isAdded = addedIds.includes(exercise.id);
          return (
            <div
              key={exercise.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                    {exercise.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {exercise.defaultDuration} • {exercise.frequency}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 mb-1.5 leading-snug">
                  {exercise.title}
                </h4>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-3">
                  <strong className="text-slate-800 font-semibold block text-[11px] mb-0.5">Therapist Goal:</strong>
                  <span>{exercise.therapistGoal}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {exercise.description}
                </p>

                {exercise.equipmentNeeded && (
                  <div className="text-[11px] text-slate-500 mb-3 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Materials:</span>
                    <span>{exercise.equipmentNeeded}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveDetailExercise(exercise)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Therapist Tips</span>
                </button>

                <button
                  onClick={() => handleToggleAdd(exercise.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Goal</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Use Exercise</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Therapist Tips */}
      {activeDetailExercise && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {activeDetailExercise.category}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  {activeDetailExercise.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailExercise(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
                <span className="font-bold text-teal-950 block mb-0.5">Clinical Goal Context:</span>
                <p className="text-teal-900">{activeDetailExercise.therapistGoal}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-2 text-xs">
                  Therapist Coaching Tips for Parents:
                </span>
                <ul className="space-y-2">
                  {activeDetailExercise.therapistTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  handleToggleAdd(activeDetailExercise.id);
                  setActiveDetailExercise(null);
                }}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Assign to Child's Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
