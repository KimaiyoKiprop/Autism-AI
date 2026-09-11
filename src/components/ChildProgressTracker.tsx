import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Plus, 
  FileText, 
  TrendingUp, 
  Smile, 
  Calendar, 
  User, 
  Edit3, 
  Printer, 
  Sparkles, 
  Heart, 
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import { ChildProfile, Milestone, MilestoneDomain, MilestoneStatus, ProgressLog } from '../types';
import { playSoftChime, playSuccessChord } from '../utils/soundEffects';

interface ChildProgressTrackerProps {
  profiles: ChildProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onUpdateMilestoneStatus: (profileId: string, milestoneId: string, newStatus: MilestoneStatus) => void;
  onAddMilestone: (profileId: string, milestone: Omit<Milestone, 'id'>) => void;
  onAddProgressLog: (profileId: string, log: Omit<ProgressLog, 'id'>) => void;
  soundEnabled: boolean;
}

const DOMAINS: MilestoneDomain[] = [
  'Communication & Speech',
  'Sensory & Self-Regulation',
  'Social & Play Skills',
  'Daily Living & Motor'
];

export const ChildProgressTracker: React.FC<ChildProgressTrackerProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onUpdateMilestoneStatus,
  onAddMilestone,
  onAddProgressLog,
  soundEnabled
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMilestoneForDetails, setSelectedMilestoneForDetails] = useState<Milestone | null>(null);

  // New Milestone Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<MilestoneDomain>('Communication & Speech');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetAge, setNewTargetAge] = useState('Age 5-7');
  const [newNotes, setNewNotes] = useState('');

  // New Log Form State
  const [logActivity, setLogActivity] = useState('');
  const [logCategory, setLogCategory] = useState<MilestoneDomain>('Sensory & Self-Regulation');
  const [logMood, setLogMood] = useState<'Calm' | 'Happy' | 'Focused' | 'Sensitive' | 'Overwhelmed'>('Calm');
  const [logDuration, setLogDuration] = useState(20);
  const [logNotes, setLogNotes] = useState('');

  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const filteredMilestones = currentProfile.milestones.filter((m) => {
    if (selectedDomain === 'All') return true;
    return m.domain === selectedDomain;
  });

  // Calculate domain stats
  const getDomainStats = (domain: MilestoneDomain) => {
    const domainItems = currentProfile.milestones.filter((m) => m.domain === domain);
    if (domainItems.length === 0) return { total: 0, achieved: 0, percentage: 0 };
    const achieved = domainItems.filter((m) => m.status === 'achieved').length;
    const inProgress = domainItems.filter((m) => m.status === 'in_progress').length;
    const percentage = Math.round(((achieved + inProgress * 0.5) / domainItems.length) * 100);
    return { total: domainItems.length, achieved, inProgress, percentage };
  };

  const handleStatusChange = (milestoneId: string, currentStatus: MilestoneStatus) => {
    let nextStatus: MilestoneStatus = 'in_progress';
    if (currentStatus === 'upcoming') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'achieved';
    else nextStatus = 'upcoming';

    if (nextStatus === 'achieved') {
      playSuccessChord(soundEnabled);
    } else {
      playSoftChime(soundEnabled);
    }

    onUpdateMilestoneStatus(currentProfile.id, milestoneId, nextStatus);
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddMilestone(currentProfile.id, {
      title: newTitle.trim(),
      domain: newDomain,
      description: newDescription.trim() || 'Custom parent-defined developmental target.',
      targetAge: newTargetAge,
      status: 'in_progress',
      progressPercent: 30,
      notes: newNotes.trim() || 'Initial baseline recorded.',
      therapistTip: 'Reinforce during high-motivation daily play opportunities.'
    });

    setNewTitle('');
    setNewDescription('');
    setNewNotes('');
    setShowAddMilestoneModal(false);
    playSuccessChord(soundEnabled);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logActivity.trim()) return;

    onAddProgressLog(currentProfile.id, {
      date: 'Today',
      activityTitle: logActivity.trim(),
      category: logCategory,
      mood: logMood,
      durationMinutes: Number(logDuration),
      notes: logNotes.trim() || 'Logged via parent dashboard.'
    });

    setLogActivity('');
    setLogNotes('');
    setShowAddLogModal(false);
    playSoftChime(soundEnabled);
  };

  const totalAchieved = currentProfile.milestones.filter((m) => m.status === 'achieved').length;
  const totalInProgress = currentProfile.milestones.filter((m) => m.status === 'in_progress').length;
  const completionRate = Math.round((totalAchieved / (currentProfile.milestones.length || 1)) * 100);

  return (
    <section id="child-record-tracker" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Child Record System</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Personalized Developmental Milestones & Progress Tracking
          </h2>

          <p className="text-base text-slate-600 max-w-2xl">
            Track your child’s growth through sensory-informed, neuro-affirming milestones. Celebrate every step—from using a visual break card to navigating multi-step routines.
          </p>
        </div>

        {/* Profile Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1">
            {profiles.map((prof) => (
              <button
                key={prof.id}
                onClick={() => onSelectProfile(prof.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  prof.id === currentProfile.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${prof.avatarColor}`} />
                <span>{prof.name} ({prof.age}y)</span>
              </button>
            ))}
          </div>

          <button
            id="export-iep-report-btn"
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>View IEP Progress Report</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Child Identity Info */}
          <div className="md:col-span-1 flex items-center gap-4 pr-0 md:pr-4 md:border-r border-slate-100">
            <div className={`w-16 h-16 rounded-2xl ${currentProfile.avatarColor} text-white flex items-center justify-center font-black text-2xl shadow-sm`}>
              {currentProfile.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{currentProfile.name}</h3>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                  Age {currentProfile.age}
                </span>
              </div>
              <p className="text-xs text-teal-700 font-medium mt-0.5">
                {currentProfile.communicationStyle}
              </p>
              <p className="text-[11px] text-slate-700 mt-1">
                Interest: {currentProfile.favoriteSpecialInterest}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
              <span className="text-xs font-semibold text-teal-800 block">Milestones Mastered</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-teal-950">{totalAchieved}</span>
                <span className="text-xs text-teal-700 font-medium">of {currentProfile.milestones.length} logged</span>
              </div>
              <div className="w-full bg-teal-200/70 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }} 
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-xs font-semibold text-amber-800 block">Actively In Progress</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-950">{totalInProgress}</span>
                <span className="text-xs text-amber-700 font-medium">skills being practiced</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Adaptive reinforcement active
              </p>
            </div>

            <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-sky-800 block">Sensory Profile</span>
              <span className="text-sm font-bold text-sky-950 block mt-1">
                {currentProfile.sensoryPreference}
              </span>
              <span className="text-[11px] text-sky-700 block mt-2">
                4-7-8 breathing & visual schedules
              </span>
            </div>
          </div>
        </div>

        {/* 4 Developmental Domains Progress Visualizer */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
            Developmental Domain Competency Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAINS.map((domain) => {
              const stats = getDomainStats(domain);
              return (
                <div key={domain} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate pr-2">{domain}</span>
                    <span className="text-xs font-black text-teal-700">{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span>{stats.achieved} Achieved</span>
                    <span>{stats.inProgress} In Progress</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Milestone Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Milestone List & Filtering */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {['All', ...DOMAINS].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDomain === d
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {d === 'All' ? 'All Milestones' : d.split('&')[0]}
                </button>
              ))}
            </div>

            <button
              id="add-custom-milestone-btn"
              onClick={() => setShowAddMilestoneModal(true)}
              className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Milestone</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredMilestones.map((m) => {
              const isAchieved = m.status === 'achieved';
              const isInProgress = m.status === 'in_progress';

              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all bg-white hover:border-teal-300 ${
                    isAchieved
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isInProgress
                      ? 'border-teal-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Clickable Status Toggle */}
                      <button
                        onClick={() => handleStatusChange(m.id, m.status)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 mt-0.5 ${
                          isAchieved
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status: Upcoming -> In Progress -> Achieved"
                        aria-label={`Status for ${m.title}: ${m.status}. Click to change.`}
                      >
                        {isAchieved ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isInProgress ? (
                          <CircleDashed className="w-4 h-4 animate-spin-slow" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                            {m.domain}
                          </span>
                          <span className="text-[11px] text-slate-700 font-medium">
                            {m.targetAge}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isAchieved
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInProgress
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isAchieved ? 'Mastered' : isInProgress ? 'In Progress' : 'Upcoming Target'}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base mb-1">
                          {m.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {m.description}
                        </p>

                        {/* Therapist Tip & Parent Note Preview */}
                        {m.therapistTip && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2 mb-2">
                            <span className="text-teal-700 font-bold shrink-0">💡 Therapist Cue:</span>
                            <span>{m.therapistTip}</span>
                          </div>
                        )}

                        {m.notes && (
                          <div className="text-[11px] text-slate-700 flex items-center gap-1.5 italic">
                            <Edit3 className="w-3 h-3 text-slate-700" />
                            <span>Parent Observation: "{m.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedMilestoneForDetails(m)}
                      className="text-slate-700 hover:text-teal-700 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                      title="View milestone clinical details"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Daily Progress Logs & Sensory Tracking */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Daily Observation & Mood Logs
                </h3>
              </div>
              <button
                id="open-add-log-btn"
                onClick={() => setShowAddLogModal(true)}
                className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3 h-3" /> Log Today
              </button>
            </div>

            <div className="space-y-3">
              {currentProfile.logs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{log.activityTitle}</span>
                    <span className="text-[10px] text-slate-700 font-medium">{log.date}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.mood === 'Calm' || log.mood === 'Happy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.mood === 'Focused'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Mood: {log.mood}
                    </span>
                    <span className="text-[10px] text-slate-700">
                      ⏱ {log.durationMinutes} mins
                    </span>
                  </div>

                  <p className="text-slate-600 italic">
                    "{log.notes}"
                  </p>
                </div>
              ))}
            </div>

            {/* Down-regulation Reminder */}
            <div className="mt-5 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-[11px] text-teal-900 flex items-start gap-2">
              <Heart className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Consistent tracking reveals sensory patterns and helps occupational therapists tailor school accommodations.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Milestone */}
      <AnimatePresence>
        {showAddMilestoneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Add Personalized Milestone</h3>
                <button
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMilestone} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Uses 5-minute visual timer before leaving playground"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Domain
                    </label>
                    <select
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value as MilestoneDomain)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Age Range
                    </label>
                    <input
                      type="text"
                      value={newTargetAge}
                      onChange={(e) => setNewTargetAge(e.target.value)}
                      placeholder="e.g. Age 5-7"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description & Context
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe how your child demonstrates this skill in everyday situations..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Observation / Notes
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Practicing with OT twice a week"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddMilestoneModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add Progress Log */}
      <AnimatePresence>
        {showAddLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Log Daily Child Observation</h3>
                <button
                  onClick={() => setShowAddLogModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLog} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={logActivity}
                    onChange={(e) => setLogActivity(e.target.value)}
                    placeholder="e.g. Visual PECS Practice, Sensory Swing, Bedtime Routine"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Observed Mood
                    </label>
                    <select
                      value={logMood}
                      onChange={(e) => setLogMood(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Calm">Calm & Regulated</option>
                      <option value="Happy">Happy & Playful</option>
                      <option value="Focused">Deeply Focused</option>
                      <option value="Sensitive">Sensory Sensitive</option>
                      <option value="Overwhelmed">Overwhelmed / Fatigued</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={logDuration}
                      onChange={(e) => setLogDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Parent Journal Note
                  </label>
                  <textarea
                    rows={3}
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="What supported their regulation? How did they respond to sensory inputs?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddLogModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Official IEP & Pediatric Progress Summary Report */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    Confidential Clinical & School Summary
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    IEP & Pediatric Progress Record: {currentProfile.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Report Header Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 text-xs">
                <div>
                  <span className="text-slate-700 block">Child Age / DOB</span>
                  <span className="font-bold text-slate-900">{currentProfile.age} Years Old</span>
                </div>
                <div>
                  <span className="text-slate-700 block">Communication</span>
                  <span className="font-bold text-teal-800">{currentProfile.communicationStyle}</span>
                </div>
                <div>
                  <span className="text-slate-700 block">Sensory Profile</span>
                  <span className="font-bold text-slate-900">{currentProfile.sensoryPreference}</span>
                </div>
                <div>
                  <span className="text-slate-700 block">Progress Baseline</span>
                  <span className="font-bold text-emerald-700">{completionRate}% Mastered</span>
                </div>
              </div>

              {/* Milestones Achieved List for IEP */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Documented Mastered Milestones (Home & Therapy Cross-Validated)
                </h4>
                <div className="space-y-2">
                  {currentProfile.milestones
                    .filter((m) => m.status === 'achieved')
                    .map((m) => (
                      <div key={m.id} className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            100% Mastered
                          </span>
                        </div>
                        <p className="text-slate-600 mb-1">{m.description}</p>
                        {m.notes && <p className="text-slate-700 italic">Parent Observation: "{m.notes}"</p>}
                      </div>
                    ))}
                </div>
              </div>

              {/* Active IEP Growth Targets */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Target Milestones (Recommended IEP Accommodations)
                </h4>
                <div className="space-y-2">
                  {currentProfile.milestones
                    .filter((m) => m.status === 'in_progress')
                    .map((m) => (
                      <div key={m.id} className="p-3 rounded-xl border border-teal-200 bg-teal-50/30 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                            {m.progressPercent}% Target Progress
                          </span>
                        </div>
                        <p className="text-slate-600 mb-1">{m.description}</p>
                        <p className="text-teal-900 font-medium">Therapist Recommendation: {m.therapistTip}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span>Exported via SpectrumSteps Pediatric Progress Engine</span>
                <span className="font-mono">HIPAA Encrypted Client ID: {currentProfile.id}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Milestone Clinical Details */}
      <AnimatePresence>
        {selectedMilestoneForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  {selectedMilestoneForDetails.domain}
                </span>
                <button
                  onClick={() => setSelectedMilestoneForDetails(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {selectedMilestoneForDetails.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {selectedMilestoneForDetails.description}
              </p>

              <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 text-xs mb-4">
                <span className="font-bold text-teal-900 block mb-1">Clinical Therapist Rationale</span>
                <p className="text-teal-800 leading-relaxed">
                  {selectedMilestoneForDetails.therapistTip || 'Focus on gentle, positive reinforcement without high stakes.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleStatusChange(selectedMilestoneForDetails.id, selectedMilestoneForDetails.status);
                    setSelectedMilestoneForDetails(null);
                  }}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
                >
                  Toggle Status ({selectedMilestoneForDetails.status === 'achieved' ? 'Mark in progress' : 'Mark as Achieved'})
                </button>
                <button
                  onClick={() => setSelectedMilestoneForDetails(null)}
                  className="text-xs text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
