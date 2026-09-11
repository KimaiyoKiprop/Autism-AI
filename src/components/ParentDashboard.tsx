import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Baby, 
  Target, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  Plus, 
  FileText, 
  Printer, 
  ShieldCheck, 
  LogOut, 
  Flame, 
  Mic, 
  MicOff, 
  Volume2, 
  AlertCircle, 
  ChevronRight, 
  Smile, 
  Meh, 
  Frown, 
  Check, 
  Trash2, 
  Sliders, 
  BookOpen, 
  UserCheck, 
  ArrowLeft,
  Share2,
  Copy,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Star,
  Bot,
  Lock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { FirebaseChild, FirebaseGoal, FirebaseLog, FirebaseWeeklySummary, FirebaseDailyPulse } from '../types';
import { AddGoalModal } from './AddGoalModal';
import { AddChildModal } from './AddChildModal';
import { TherapistReportModal } from './TherapistReportModal';
import { DashboardAiAssistant } from './DashboardAiAssistant';
import { UpgradeModal } from './UpgradeModal';
import { playSoftChime } from '../utils/soundEffects';
import { ProgressTrendsVisualization } from './ProgressTrendsVisualization';
import { TherapyPrepChecklist } from './TherapyPrepChecklist';
import { DailyPulseWidget } from './DailyPulseWidget';

interface ParentDashboardProps {
  onBackToLanding: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onBackToLanding }) => {
  const { user, userProfile, logout } = useAuth();

  const [childrenList, setChildrenList] = useState<FirebaseChild[]>([]);
  const [selectedChild, setSelectedChild] = useState<FirebaseChild | null>(null);
  const [goals, setGoals] = useState<FirebaseGoal[]>([]);
  const [logs, setLogs] = useState<FirebaseLog[]>([]);
  const [summaries, setSummaries] = useState<FirebaseWeeklySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active dashboard view
  const [activeTab, setActiveTab] = useState<'today' | 'goals' | 'profile' | 'reports' | 'toolkit' | 'ask-ai'>('today');

  // Modals
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeHint, setUpgradeHint] = useState<string | undefined>(undefined);

  const isPaidUser = Boolean(userProfile?.isPaid);
  const subscriptionTier = userProfile?.subscriptionTier || 'free';

  const openUpgrade = (hint?: string) => {
    setUpgradeHint(hint);
    setIsUpgradeModalOpen(true);
  };

  // Quick log state
  const [selectedGoalForLog, setSelectedGoalForLog] = useState<string>('');
  const [logStatus, setLogStatus] = useState<'Done' | 'Partial' | 'Skip'>('Done');
  const [regulationRating, setRegulationRating] = useState<number>(4);
  const [logNotes, setLogNotes] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);

  // Toolkit state: De-escalation timer
  const [deEscalationStep, setDeEscalationStep] = useState<number>(1);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Toolkit state: Visual token board
  const [tokenItems, setTokenItems] = useState([
    { id: '1', task: 'Drink warm water / Morning chew', done: true },
    { id: '2', task: 'Proprioceptive wall push-ups', done: true },
    { id: '3', task: 'Greeting waving practice', done: false },
    { id: '4', task: 'Put on soft socks & sensory shoes', done: false },
    { id: '5', task: 'Sensory quiet corner (5 min)', done: false },
  ]);

  // Load parent children and data from Firebase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedChildren = await firebaseService.getChildren(user.uid);
        setChildrenList(fetchedChildren);
        if (fetchedChildren.length > 0) {
          const current = fetchedChildren[0];
          setSelectedChild(current);
          await loadChildDetails(current.id, user.uid);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const loadChildDetails = async (childId: string, parentId: string) => {
    try {
      const [fetchedGoals, fetchedLogs, fetchedSummaries] = await Promise.all([
        firebaseService.getGoals(childId, parentId),
        firebaseService.getLogs(childId, parentId),
        firebaseService.getWeeklySummaries(childId, parentId)
      ]);
      setGoals(fetchedGoals);
      setLogs(fetchedLogs);
      setSummaries(fetchedSummaries);
      if (fetchedGoals.length > 0) {
        setSelectedGoalForLog(fetchedGoals[0].title);
      }
    } catch (err) {
      console.error('Error loading child details:', err);
    }
  };

  const handleChildSelect = async (child: FirebaseChild) => {
    if (!user) return;
    setSelectedChild(child);
    setLoading(true);
    await loadChildDetails(child.id, user.uid);
    setLoading(false);
  };

  const handleUpdateChild = async (updates: Partial<FirebaseChild>) => {
    if (!selectedChild || !user) return;
    try {
      await firebaseService.updateChild(selectedChild.id, updates);
      const updatedChild = { ...selectedChild, ...updates };
      setSelectedChild(updatedChild);
      setChildrenList(prev => prev.map(c => c.id === selectedChild.id ? updatedChild : c));
      setLogSuccessMessage("Therapy appointment and profile updated successfully.");
      setTimeout(() => setLogSuccessMessage(null), 3500);
    } catch (err) {
      console.error("Failed to update child profile:", err);
    }
  };

  const handleDailyPulseLogged = (pulse: FirebaseDailyPulse) => {
    setLogSuccessMessage(`Daily pulse recorded (${pulse.sentimentLabel})! Ready for weekly AutismChildBridge AI synthesis.`);
    setTimeout(() => setLogSuccessMessage(null), 4000);
  };

  // Quick 1-tap logging
  const handleQuickLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChild) return;

    setIsSubmittingLog(true);
    try {
      const newLog = await firebaseService.addLog({
        childId: selectedChild.id,
        parentId: user.uid,
        goalTitle: selectedGoalForLog || 'General Sensory Routine',
        status: logStatus,
        regulationRating,
        mood: regulationRating >= 4 ? 'Calm & Engaged' : regulationRating === 3 ? 'Neutral Baseline' : 'Sensitive / Overwhelmed',
        notes: logNotes.trim() || `${selectedGoalForLog} completed during routine.`,
        caregiverName: userProfile?.displayName || 'Parent',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      });

      setLogs(prev => [newLog, ...prev]);
      playSoftChime(659.25);
      setLogNotes('');
      setLogSuccessMessage('Routine saved to Firebase! Your streak remains protected.');
      setTimeout(() => setLogSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Failed to save log:', err);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await firebaseService.deleteLog(logId);
      setLogs(prev => prev.filter(l => l.id !== logId));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  const handleGenerateSummary = async () => {
    if (!user || !selectedChild) return;
    try {
      const summary = await firebaseService.generateAndSaveWeeklySummary(
        selectedChild.id,
        user.uid,
        selectedChild.name,
        logs,
        goals
      );
      setSummaries(prev => [summary, ...prev]);
      playSoftChime(587.33);
    } catch (err) {
      console.error('Failed to generate summary:', err);
    }
  };

  // Voice note simulation
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      playSoftChime(440);
      setTimeout(() => {
        setLogNotes(prev => (prev ? prev + ' ' : '') + 'Initiated eye contact when playing with trains. Calmed quickly with deep pressure.');
        setIsRecording(false);
        playSoftChime(523.25);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  // De-escalation timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      playSoftChime(587.33);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleTokenItem = (id: string) => {
    setTokenItems(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.done;
        if (next) playSoftChime(659.25);
        return { ...item, done: next };
      }
      return item;
    }));
  };

  // Calculations
  const completedCount = logs.filter(l => l.status === 'Done').length;
  const partialCount = logs.filter(l => l.status === 'Partial').length;
  const adherenceRate = logs.length > 0 
    ? Math.round(((completedCount + (partialCount * 0.5)) / logs.length) * 100) 
    : 85;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {selectedChild?.name?.[0] || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {selectedChild ? `${selectedChild.name} (Age ${selectedChild.age})` : 'Child Profile'}
                  </span>
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-semibold">
                    {selectedChild?.sensoryPreference || 'Sensory Diet Active'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {selectedChild?.communicationStyle || 'Emerging Communication'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak preservation indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-bold text-amber-800">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{Math.max(logs.length, 4)}-Day Safe Streak</span>
            </div>

            {/* Child selector dropdown if multiple children */}
            {childrenList.length > 1 && (
              <select
                value={selectedChild?.id}
                onChange={(e) => {
                  const target = childrenList.find(c => c.id === e.target.value);
                  if (target) handleChildSelect(target);
                }}
                className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                {childrenList.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Age {c.age})</option>
                ))}
              </select>
            )}

            {/* Subscription Tier Status / Upgrade Button */}
            {isPaidUser ? (
              <button
                onClick={() => openUpgrade()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Manage subscription"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{subscriptionTier} Active</span>
              </button>
            ) : (
              <button
                onClick={() => openUpgrade("Upgrade to Plus or Family to unlock full clinical reports, unlimited goals, and AI syntheses.")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Upgrade ($9/mo)</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!isPaidUser && childrenList.length >= 1) {
                  openUpgrade("Free tier supports 1 child profile. Upgrade to Family ($18/mo) for up to 4 children and caregiver sync.");
                  return;
                }
                setIsAddChildOpen(true);
              }}
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1.5 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Child</span>
            </button>

            {/* Log Out */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 py-1.5 px-2.5 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-100 pt-1">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'today'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Today's Home Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'goals'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Therapy Goals ({goals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Child Sensory Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'reports'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Clinic Summaries & PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('toolkit')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'toolkit'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Parent & Sensory Toolkit</span>
          </button>

          <button
            onClick={() => setActiveTab('ask-ai')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'ask-ai'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>Ask AutismChildBridge AI</span>
            <span className="px-1.5 py-0.2 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full border border-teal-200">
              AI
            </span>
          </button>
        </div>
      </header>

      {/* Free Tier Notice Banner */}
      {!isPaidUser && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 border-b border-amber-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <div className="w-5 h-5 rounded-full bg-amber-200/90 flex items-center justify-center shrink-0">
                <Lock className="w-3 h-3 text-amber-800" />
              </div>
              <span className="font-bold">
                Free Plan Active:
              </span>
              <span className="text-amber-800">
                Limited to 2 therapy goals & 1 child. Upgrade to unlock AutismChildBridge AI Weekly Summaries, Clinic PDF Reports, and Unlimited Goals.
              </span>
            </div>
            <button
              onClick={() => openUpgrade("Unlock clinical summaries, unlimited therapy goals, and 24/7 AI assistance.")}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
            >
              <span>Upgrade to Plus ($9/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-500 font-medium">Syncing with Firebase Firestore...</p>
          </div>
        ) : (
          <>
            {/* Success toast notification */}
            {logSuccessMessage && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{logSuccessMessage}</span>
              </div>
            )}

            {/* TAB 1: TODAY'S TRACKER */}
            {activeTab === 'today' && selectedChild && (
              <div className="space-y-6">
                {/* 1. Therapy Prep Checklist & 48-Hour Notification Trigger */}
                <TherapyPrepChecklist
                  child={selectedChild}
                  onExportReport={() => setIsPrintModalOpen(true)}
                  onUpdateChild={handleUpdateChild}
                />

                {/* 2. Main Tracking Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Col: 10-Second Quick Log */}
                  <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <span>Log Today's Home Exercise</span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold">10-Second Log</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quick, guilt-free observation recording with zero pressure.
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <form onSubmit={handleQuickLogSubmit} className="space-y-4">
                      {/* Select Goal */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Select Routine / Exercise
                        </label>
                        <select
                          value={selectedGoalForLog}
                          onChange={(e) => setSelectedGoalForLog(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        >
                          {goals.map(g => (
                            <option key={g.id} value={g.title}>
                              {g.title} ({g.category} • {g.durationMinutes}m)
                            </option>
                          ))}
                          <option value="Sensory Calming Reset">Sensory Calming Reset (Quiet room / Deep squeeze)</option>
                          <option value="Spontaneous Social Milestone">Spontaneous Social Milestone (Eye contact, hug, shared play)</option>
                        </select>
                      </div>

                      {/* Status Selection: Done / Partial / Skip */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          How did it go?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setLogStatus('Done')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                              logStatus === 'Done'
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLogStatus('Partial')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                              logStatus === 'Partial'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Partial</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLogStatus('Skip')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                              logStatus === 'Skip'
                                ? 'bg-slate-600 text-white border-slate-700 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>Skip Today</span>
                          </button>
                        </div>
                        {logStatus === 'Skip' && (
                          <p className="text-[11px] text-teal-800 bg-teal-50 p-2.5 rounded-xl mt-2 border border-teal-200">
                            💙 Skipped guilt-free. Taking a sensory break protects your child's nervous system and keeps your streak safe.
                          </p>
                        )}
                      </div>

                      {/* Regulation Rating Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700">
                            Child Sensory Regulation: <span className="text-teal-700 font-extrabold">{regulationRating} / 5</span>
                          </label>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {regulationRating === 5 && '🌟 Joyful Flow State'}
                            {regulationRating === 4 && '😊 Calm & Ready'}
                            {regulationRating === 3 && '😐 Baseline Neutral'}
                            {regulationRating === 2 && '😟 Overstimulated / Sensitive'}
                            {regulationRating === 1 && '🚨 Meltdown / High Distress'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={regulationRating}
                          onChange={(e) => setRegulationRating(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>

                      {/* Parent Notes & Voice Dictation */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Observations or Therapist Notes
                          </label>
                          <button
                            type="button"
                            onClick={toggleVoiceRecording}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                              isRecording 
                                ? 'bg-rose-100 text-rose-700 animate-pulse' 
                                : 'text-teal-700 hover:bg-teal-50'
                            }`}
                          >
                            {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                            <span>{isRecording ? 'Listening...' : 'Dictate Voice Note'}</span>
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={logNotes}
                          onChange={(e) => setLogNotes(e.target.value)}
                          placeholder="e.g. Leo loved the weighted blanket and initiated a 4-second smile when asking for the train..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLog}
                        className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingLog ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Save Routine Log to Firebase</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Active Goals Checklist Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Today's Prescribed Routines</h3>
                        <p className="text-xs text-slate-500">Therapist home assignments</p>
                      </div>
                      <button
                        onClick={() => setIsAddGoalOpen(true)}
                        className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Goal</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {goals.map(goal => (
                        <div 
                          key={goal.id} 
                          className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-teal-300 transition-all flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{goal.title}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                                {goal.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {goal.therapistTips}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                              <span>⏱ {goal.durationMinutes} min</span>
                              <span>•</span>
                              <span>📅 {goal.frequency}</span>
                              {goal.equipmentNeeded && (
                                <>
                                  <span>•</span>
                                  <span>🎒 {goal.equipmentNeeded}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedGoalForLog(goal.title);
                              window.scrollTo({ top: 120, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
                          >
                            Log
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Live Log Stream & Weekly Snapshot */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Weekly Snapshot Metric */}
                  <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 text-white shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">Weekly Consistency</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-teal-100 text-[10px] font-bold">Safe & Gentle</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold tracking-tight">{adherenceRate}%</span>
                      <span className="text-xs text-teal-100">Home Routine Adherence</span>
                    </div>

                    <div className="w-full bg-teal-900/60 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-300 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${adherenceRate}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                      <div className="bg-white/10 rounded-xl p-2">
                        <div className="font-extrabold text-sm">{completedCount}</div>
                        <div className="text-[10px] text-teal-200">Completed</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-2">
                        <div className="font-extrabold text-sm">{partialCount}</div>
                        <div className="text-[10px] text-teal-200">Partial</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-2">
                        <div className="font-extrabold text-sm">{logs.filter(l => l.status === 'Skip').length}</div>
                        <div className="text-[10px] text-teal-200">Skipped</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPrintModalOpen(true)}
                      className="w-full py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Preview Clinic Summary PDF</span>
                    </button>
                  </div>

                  {/* Live Firestore Logs Stream */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">Recent Home Logs ({logs.length})</h3>
                      <span className="text-[10px] text-slate-400">Firebase synced</span>
                    </div>

                    {logs.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">
                        No logs recorded yet. Tap "Save Routine Log" above to record your first session!
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {logs.map(log => (
                          <div 
                            key={log.id} 
                            className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{log.goalTitle}</span>
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                log.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                                log.status === 'Partial' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-200 text-slate-700'
                              }`}>
                                {log.status}
                              </span>
                            </div>

                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              "{log.notes}"
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <span className="flex items-center gap-1">
                                <span>Regulation: {log.regulationRating}/5</span>
                                <span>•</span>
                                <span>{log.date}</span>
                              </span>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete log entry"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Daily Pulse Sentiment Check Widget */}
              <DailyPulseWidget
                child={selectedChild}
                parentId={user.uid}
                userEmail={user.email}
                onPulseLogged={handleDailyPulseLogged}
              />

              {/* 4. 30-Day Therapy Progress & Goal Completion Trends (Recharts) */}
              <ProgressTrendsVisualization
                goals={goals}
                logs={logs}
                childName={selectedChild.name}
              />
            </div>
          )}

          {/* TAB 2: GOALS & EXERCISES */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Child Therapy Goals & Exercises</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assigned by OT, SLP, PT, and family routines for {selectedChild?.name}.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!isPaidUser && goals.length >= 2) {
                        openUpgrade("Free tier includes up to 2 active therapy goals. Upgrade to Plus ($9/mo) to track unlimited home exercises and therapist goals.");
                        return;
                      }
                      setIsAddGoalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Goal</span>
                  </button>
                </div>

                {/* Free plan goal limit banner */}
                {!isPaidUser && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-900 font-bold text-xs">
                        {goals.length}/2
                      </div>
                      <div>
                        <span className="font-bold text-amber-950 block">
                          Free Plan Goal Capacity ({goals.length} of 2 Active Goals Used)
                        </span>
                        <span className="text-amber-800 text-[11px]">
                          Upgrade to Plus ($9/mo) to track unlimited sensory, OT, SLP, and PT goals simultaneously.
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openUpgrade("Unlock unlimited therapy goals and custom clinic exercises.")}
                      className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Unlock Unlimited Goals ($9/mo)</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {goals.map(goal => (
                    <div key={goal.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                            {goal.category}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            ⏱ {goal.durationMinutes} min
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 leading-snug">{goal.title}</h3>
                        
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                          <span className="font-bold text-[10px] text-slate-500 uppercase">Therapist Home Advice:</span>
                          <p className="text-[11px] leading-relaxed">{goal.therapistTips}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">📅 {goal.frequency}</span>
                        <button
                          onClick={async () => {
                            if (confirm(`Remove goal "${goal.title}"?`)) {
                              await firebaseService.deleteGoal(goal.id);
                              setGoals(prev => prev.filter(g => g.id !== goal.id));
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CHILD PROFILE & SENSORY DIET */}
            {activeTab === 'profile' && selectedChild && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-xl">
                        {selectedChild.name[0]}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">{selectedChild.name} (Age {selectedChild.age})</h2>
                        <p className="text-xs text-slate-500">Clinical Profile & Sensory Compass</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddChildOpen(true)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      + Add Sibling Profile
                    </button>
                  </div>

                  {/* Key Characteristics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Communication Mode</span>
                      <p className="text-xs font-bold text-slate-800">{selectedChild.communicationStyle}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Sensory Archetype</span>
                      <p className="text-xs font-bold text-slate-800">{selectedChild.sensoryPreference}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Special Interests</span>
                      <p className="text-xs font-bold text-slate-800">{selectedChild.specialInterest || 'Trains, gears & mechanical puzzles'}</p>
                    </div>
                  </div>

                  {/* Sensory Diet breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Calming Tools */}
                    <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Known Calming Tools (Sensory Diet)</span>
                      </div>
                      <div className="space-y-2">
                        {selectedChild.calmingTools.map((tool, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded-xl border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Triggers */}
                    <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Sensory Triggers & Overload Cues</span>
                      </div>
                      <div className="space-y-2">
                        {selectedChild.sensoryTriggers.map((trig, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded-xl border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span>{trig}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clinic Team */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700">Treating Clinical Practice:</span>{' '}
                      <span className="text-slate-600">{selectedChild.clinicName || 'Valley Pediatric Therapy Partners'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Primary Clinician:</span>{' '}
                      <span className="text-slate-600">{selectedChild.therapistName || 'Sarah Jenkins, OTR/L'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CLINIC REPORTS & SUMMARIES */}
            {activeTab === 'reports' && selectedChild && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Clinic Summaries & Discussion Points</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Synthesized home practice reports designed for your child's OT, SLP, or PT visits.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!isPaidUser) {
                          openUpgrade("AutismChildBridge AI weekly syntheses are exclusive to Plus and Family plans.");
                          return;
                        }
                        handleGenerateSummary();
                      }}
                      className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl text-xs border border-teal-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {!isPaidUser ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Sparkles className="w-3.5 h-3.5 text-teal-600" />}
                      <span>Synthesize Latest Week</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!isPaidUser) {
                          openUpgrade("1-Click Clinic PDF Reports are exclusive to Plus and Family plans.");
                          return;
                        }
                        setIsPrintModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {!isPaidUser ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Printer className="w-3.5 h-3.5" />}
                      <span>Print / PDF Export</span>
                    </button>
                  </div>
                </div>

                {/* Tab 4 Free User Paywall Showcase */}
                {!isPaidUser && (
                  <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-950 text-white p-6 sm:p-7 rounded-3xl shadow-lg space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
                        <Lock className="w-3.5 h-3.5" />
                        <span>PLUS & FAMILY CLINICAL FEATURE</span>
                      </div>
                      <span className="text-[11px] text-teal-200">
                        Monthly plan default: $9/mo • Cancel anytime
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                        Automated AutismChildBridge AI Clinic Syntheses & 1-Click PDF Export
                      </h3>
                      <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal max-w-2xl">
                        Save hours preparing for your child's OT, SLP, or PT visits. AutismChildBridge AI aggregates your home tracking notes, identifies sensory overload trends, celebrates regulation milestones, and drafts 4 tailored questions for your therapist.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="flex items-center gap-2 text-teal-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>1-Click Clinic PDF export for pediatrician & OT/SLP</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Automatic sensory trigger & regulation pattern detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>4 personalized discussion questions for clinic appointments</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Home exercise adherence & sensory regulation stats</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <button
                        onClick={() => openUpgrade("Unlock weekly clinic reports and PDF export for your child's therapy team.")}
                        className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>Unlock Full Clinical Reports ($9/mo)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Generated summaries cards */}
                <div className="space-y-5">
                  {summaries.map(summary => (
                    <div key={summary.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{summary.weekLabel}</span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold">
                            {summary.adherencePercent}% Adherence
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Average Regulation: <strong className="text-slate-700">{summary.averageRegulation} / 5.0</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Celebrations */}
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Celebrations & Carryover</span>
                          </span>
                          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                            {summary.celebrations.map((c, i) => (
                              <li key={i} className="leading-relaxed">{c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Sensory Insights */}
                        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-amber-600" />
                            <span>Sensory Patterns Noticed</span>
                          </span>
                          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                            {summary.sensoryPatterns.map((s, i) => (
                              <li key={i} className="leading-relaxed">{s}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Therapist Questions */}
                        <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-2">
                          <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                            <span>Suggested Clinic Questions</span>
                          </span>
                          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                            {summary.therapistQuestions.map((q, i) => (
                              <li key={i} className="leading-relaxed">{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PARENT & SENSORY TOOLKIT (New Features!) */}
            {activeTab === 'toolkit' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: De-escalation Protocol */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-teal-600" />
                          <span>3-Step Sensory De-escalation Protocol</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Follow this calming sequence during high sensory overload or dysregulation.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold">
                        Step {deEscalationStep} of 3
                      </span>
                    </div>

                    {/* Step Cards */}
                    <div className="space-y-3">
                      <div 
                        onClick={() => setDeEscalationStep(1)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          deEscalationStep === 1 
                            ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">1. Reduce Stimuli & Lower Demands</span>
                          <span className="text-[10px] text-teal-700 font-bold">0 – 60s</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Dim lights, cease verbal instructions, eliminate background screens or music, and offer noise-canceling headphones without demanding eye contact.
                        </p>
                      </div>

                      <div 
                        onClick={() => setDeEscalationStep(2)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          deEscalationStep === 2 
                            ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">2. Proprioceptive Deep Pressure</span>
                          <span className="text-[10px] text-teal-700 font-bold">1 – 3 min</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Apply firm downward pressure on shoulders or thighs with a weighted lap blanket, or encourage gentle bear hugging and cushion squeezes.
                        </p>
                      </div>

                      <div 
                        onClick={() => setDeEscalationStep(3)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          deEscalationStep === 3 
                            ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">3. Special Interest Re-anchoring</span>
                          <span className="text-[10px] text-teal-700 font-bold">3 – 5 min</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Silently place their preferred passion item ({selectedChild?.specialInterest || 'favorite toy'}) nearby to safely reconnect attention without testing speech.
                        </p>
                      </div>
                    </div>

                    {/* Integrated Visual Timer */}
                    <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Calming Sand Timer</div>
                        <div className="text-2xl font-mono font-bold tracking-wider">
                          {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTimerRunning(!timerRunning)}
                          className="p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                        >
                          {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { setTimerRunning(false); setTimerSeconds(60); }}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Visual Schedule Token Board & Caregiver Cheat Sheet */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Visual Token Board */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Child Visual Routine Board</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tap to celebrate each sensory transition step with gentle sound.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {tokenItems.filter(t => t.done).length} of {tokenItems.length} Done
                      </span>
                    </div>

                    <div className="space-y-2">
                      {tokenItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleTokenItem(item.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            item.done 
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through' 
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-300'
                          }`}
                        >
                          <span className="text-xs font-semibold">{item.task}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                            item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caregiver & Babysitter Cheat Sheet */}
                  <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-teal-400" />
                          <span>Caregiver & Babysitter Cheat Sheet</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Handy summary for grandparents, babysitters, and school aides.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!isPaidUser) {
                              openUpgrade("Custom IEP & Babysitter PDF Summary Cards are a Plus & Family feature.");
                              return;
                            }
                            setIsPrintModalOpen(true);
                          }}
                          className="p-2 bg-teal-800 hover:bg-teal-700 text-teal-100 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Print IEP card"
                        >
                          {!isPaidUser ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Printer className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">Print IEP Card</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Caregiver Guide for ${selectedChild?.name || 'Child'}:\nTriggers: ${selectedChild?.sensoryTriggers.join(', ')}\nCalming Tools: ${selectedChild?.calmingTools.join(', ')}\nSpecial Interest: ${selectedChild?.specialInterest}`
                            );
                            alert('Caregiver cheat sheet copied to clipboard!');
                          }}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy cheat sheet text"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                        <strong className="text-amber-300 block mb-1 text-[11px]">⚠️ Always Avoid:</strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {selectedChild?.sensoryTriggers.join(' • ') || 'Sudden loud sounds, shirt tags, unexpected schedule switches.'}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                        <strong className="text-emerald-300 block mb-1 text-[11px]">✅ Go-To Soothers:</strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {selectedChild?.calmingTools.join(' • ') || 'Weighted lap pad, quiet visual timer, favorite train stories.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ASK CLINICAL AI (AUTISMCHILDBRIDGE AI) */}
            {activeTab === 'ask-ai' && (
              <DashboardAiAssistant
                selectedChild={selectedChild}
                goals={goals}
                isPaid={isPaidUser}
                onOpenUpgrade={() => openUpgrade("Upgrade to Plus ($9/mo) to unlock unlimited 24/7 AutismChildBridge AI clinical consultations.")}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {selectedChild && user && (
        <AddGoalModal
          isOpen={isAddGoalOpen}
          onClose={() => setIsAddGoalOpen(false)}
          childId={selectedChild.id}
          parentId={user.uid}
          onGoalAdded={(newGoal) => setGoals(prev => [newGoal, ...prev])}
        />
      )}

      {user && (
        <AddChildModal
          isOpen={isAddChildOpen}
          onClose={() => setIsAddChildOpen(false)}
          parentId={user.uid}
          onChildAdded={(newChild) => {
            setChildrenList(prev => [...prev, newChild]);
            setSelectedChild(newChild);
          }}
        />
      )}

      <TherapistReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        featureHint={upgradeHint}
      />
    </div>
  );
};
