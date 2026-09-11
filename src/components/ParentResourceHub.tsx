import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  CheckSquare, 
  Download, 
  Calendar, 
  Sun, 
  Moon, 
  Sparkles, 
  Utensils, 
  Shirt, 
  Bus, 
  Activity, 
  Gamepad2, 
  Plus, 
  Check, 
  Printer, 
  X,
  FileCheck,
  HeartHandshake
} from 'lucide-react';
import { ParentResource, VisualScheduleItem } from '../types';
import { parentResources, initialScheduleItems } from '../data/mockData';
import { playBubblePop, playSuccessChord, playSoftChime } from '../utils/soundEffects';

interface ParentResourceHubProps {
  soundEnabled: boolean;
}

const CATEGORIES = [
  'All',
  'Sensory Toolkits',
  'Routines & Transitions',
  'IEP & School Advocacy',
  'Communication & AAC'
];

export const ParentResourceHub: React.FC<ParentResourceHubProps> = ({ soundEnabled }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingResource, setActiveReadingResource] = useState<ParentResource | null>(null);
  const [checkedTakeaways, setCheckedTakeaways] = useState<Record<string, boolean>>({});

  // Visual Routine Builder State
  const [scheduleItems, setScheduleItems] = useState<VisualScheduleItem[]>(initialScheduleItems);
  const [scheduleFilter, setScheduleFilter] = useState<'All' | 'Morning' | 'Evening'>('All');
  const [newRoutineLabel, setNewRoutineLabel] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('4:30 PM');
  const [newRoutineCategory, setNewRoutineCategory] = useState<'Morning' | 'Evening'>('Evening');

  const filteredResources = parentResources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleScheduleItem = (id: string) => {
    setScheduleItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.completed;
          if (next) playSuccessChord(soundEnabled);
          else playBubblePop(soundEnabled);
          return { ...item, completed: next };
        }
        return item;
      })
    );
  };

  const handleAddRoutineCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineLabel.trim()) return;

    const newItem: VisualScheduleItem = {
      id: `sch-${Date.now()}`,
      label: newRoutineLabel.trim(),
      category: newRoutineCategory,
      iconName: 'Sparkles',
      completed: false,
      timeHint: newRoutineTime
    };

    setScheduleItems((prev) => [...prev, newItem]);
    setNewRoutineLabel('');
    playSoftChime(soundEnabled);
  };

  const resetScheduleChecks = () => {
    setScheduleItems((prev) => prev.map((item) => ({ ...item, completed: false })));
    playSoftChime(soundEnabled);
  };

  const filteredSchedule = scheduleItems.filter((item) => {
    if (scheduleFilter === 'All') return true;
    return item.category === scheduleFilter;
  });

  const getScheduleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-emerald-500" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-teal-500" />;
      case 'Bus': return <Bus className="w-5 h-5 text-sky-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <section id="parent-resources" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 rounded-3xl my-12 border border-slate-200/60">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Evidence-Based Parent Toolkits</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Compassionate Resources for Every Stage of the Journey
        </h2>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Written by pediatric occupational therapists, speech-language pathologists, and autism parents. From meltdown de-escalation to visual routines and school advocacy.
        </p>
      </div>

      {/* Resource Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, AAC, IEP..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Resource Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  {res.category}
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  {res.readingTime}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                {res.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {res.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {res.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">{res.author}</span>
                <span className="text-[11px] text-slate-700 block">{res.authorRole}</span>
              </div>

              <button
                onClick={() => setActiveReadingResource(res)}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read Toolkit</span>
                <FileCheck className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Feature: Visual Routine & Schedule Builder (TEACCH/PECS Aligned) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>Interactive Home Tool</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Interactive Visual Schedule & Routine Board
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Autistic children thrive when daily transitions are predictable. Tap cards to mark them complete or customize your family's flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setScheduleFilter('All')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  scheduleFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Day
              </button>
              <button
                onClick={() => setScheduleFilter('Morning')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  scheduleFilter === 'Morning' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Morning
              </button>
              <button
                onClick={() => setScheduleFilter('Evening')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  scheduleFilter === 'Evening' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Evening
              </button>
            </div>

            <button
              onClick={resetScheduleChecks}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Reset All
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* Schedule Cards Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {filteredSchedule.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleScheduleItem(item.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-36 cursor-pointer ${
                item.completed
                  ? 'bg-emerald-50/60 border-emerald-400 opacity-80'
                  : 'bg-white border-slate-200/90 hover:border-teal-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {getScheduleIcon(item.iconName)}
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'
                }`}>
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-700 block">
                  {item.timeHint || item.category}
                </span>
                <span className={`font-bold text-xs sm:text-sm block line-clamp-2 leading-snug ${
                  item.completed ? 'line-through text-slate-700' : 'text-slate-900'
                }`}>
                  {item.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quick Add Custom Schedule Step */}
        <form onSubmit={handleAddRoutineCard} className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <input
            type="text"
            value={newRoutineLabel}
            onChange={(e) => setNewRoutineLabel(e.target.value)}
            placeholder="Add custom visual routine card (e.g., Sensory Swing, Quiet Reading)..."
            className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />

          <input
            type="text"
            value={newRoutineTime}
            onChange={(e) => setNewRoutineTime(e.target.value)}
            placeholder="Time (e.g. 5:00 PM)"
            className="w-full sm:w-32 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <select
            value={newRoutineCategory}
            onChange={(e) => setNewRoutineCategory(e.target.value as any)}
            className="w-full sm:w-28 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </form>
      </div>

      {/* Reader Modal for Parent Toolkit */}
      <AnimatePresence>
        {activeReadingResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
                  {activeReadingResource.category}
                </span>
                <button
                  onClick={() => setActiveReadingResource(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                {activeReadingResource.title}
              </h3>
              <p className="text-xs text-slate-700 mb-6">
                By {activeReadingResource.author} • {activeReadingResource.authorRole}
              </p>

              {/* Core Clinical Insights */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Principles & Scientific Takeaways
                </h4>
                <div className="space-y-2.5">
                  {activeReadingResource.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700 flex items-start gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Action Checklist */}
              {activeReadingResource.checklistItems && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Home Implementation Checklist
                  </h4>
                  <div className="space-y-2">
                    {activeReadingResource.checklistItems.map((item, idx) => {
                      const isChecked = !!checkedTakeaways[`${activeReadingResource.id}-${idx}`];
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCheckedTakeaways((prev) => ({
                              ...prev,
                              [`${activeReadingResource.id}-${idx}`]: !isChecked
                            }));
                            playBubblePop(soundEnabled);
                          }}
                          className={`p-3 rounded-xl border text-xs flex items-center gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 line-through'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-teal-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Steps */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Action Steps
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {activeReadingResource.actionSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveReadingResource(null)}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
                >
                  Finished Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
