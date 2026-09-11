import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Bell, 
  Sparkles, 
  Edit3, 
  ChevronRight, 
  Check, 
  Save, 
  X,
  Stethoscope
} from 'lucide-react';
import { FirebaseChild } from '../types';

interface TherapyPrepChecklistProps {
  child: FirebaseChild;
  onExportReport: () => void;
  onUpdateChild: (updates: Partial<FirebaseChild>) => Promise<void>;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'report' | 'sensory' | 'communication' | 'routine';
  isReportAction?: boolean;
}

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'pdf-export',
    title: 'Export & Print 1-Click Clinic PDF Report',
    description: 'Generates the clinical adherence summary, regulation index, and discussion points.',
    category: 'report',
    isReportAction: true,
  },
  {
    id: 'ai-questions',
    title: 'Review AutismChildBridge AI Discussion Questions',
    description: 'Check synthesized high-value questions for OT / SLP regarding home routines.',
    category: 'report',
  },
  {
    id: 'sensory-bag',
    title: 'Pack Sensory Support First-Aid Kit',
    description: 'Include noise-dampening headphones, chewable necklace, weighted pad, and favorite train/comfort toy.',
    category: 'sensory',
  },
  {
    id: 'aac-comm',
    title: 'Check AAC Device or Communication Cards',
    description: 'Ensure battery is 100% and core vocabulary for clinic activities is accessible.',
    category: 'communication',
  },
  {
    id: 'daily-pulses',
    title: 'Review This Week\'s Daily Pulse Sentiment Logs',
    description: 'Glance over daily regulation patterns to share any sudden sensory shifts with the therapist.',
    category: 'routine',
  },
  {
    id: 'visual-transition',
    title: 'Prepare Child With 15-Minute Visual Schedule',
    description: 'Show visual schedule card for the clinic transition to prevent rushed departures.',
    category: 'routine',
  },
];

export const TherapyPrepChecklist: React.FC<TherapyPrepChecklistProps> = ({
  child,
  onExportReport,
  onUpdateChild,
}) => {
  // Appointment date state
  const [appointmentDate, setAppointmentDate] = useState<string>(
    child.nextAppointmentDate || new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState<string>(
    child.nextAppointmentTime || '10:30'
  );
  const [appointmentType, setAppointmentType] = useState<string>(
    child.nextAppointmentType || 'Occupational Therapy (OT)'
  );
  const [therapistName, setTherapistName] = useState<string>(
    child.therapistName || 'Sarah Jenkins, OTR/L'
  );

  const [isEditingAppointment, setIsEditingAppointment] = useState<boolean>(false);
  const [isSavingAppointment, setIsSavingAppointment] = useState<boolean>(false);

  // Checked state for checklist items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`therapy_prep_${child.id}`);
      return saved ? JSON.parse(saved) : { 'pdf-export': false, 'sensory-bag': true };
    } catch {
      return { 'pdf-export': false, 'sensory-bag': true };
    }
  });

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`therapy_prep_${child.id}`, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  // Calculate hours until appointment
  const { hoursUntil, isWithin48Hours, isToday, isPassed, formattedDateString } = useMemo(() => {
    if (!appointmentDate) {
      return { hoursUntil: 999, isWithin48Hours: false, isToday: false, isPassed: false, formattedDateString: '' };
    }

    const targetDate = new Date(`${appointmentDate}T${appointmentTime || '10:00'}:00`);
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    const isWithin = diffHours <= 48 && diffHours >= -6;
    const isDay = targetDate.toDateString() === now.toDateString();
    const passed = diffHours < -6;

    const formatted = targetDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }) + (appointmentTime ? ` at ${appointmentTime}` : '');

    return {
      hoursUntil: diffHours,
      isWithin48Hours: isWithin,
      isToday: isDay,
      isPassed: passed,
      formattedDateString: formatted,
    };
  }, [appointmentDate, appointmentTime]);

  const handleSaveAppointment = async () => {
    setIsSavingAppointment(true);
    try {
      await onUpdateChild({
        nextAppointmentDate: appointmentDate,
        nextAppointmentTime: appointmentTime,
        nextAppointmentType: appointmentType,
        therapistName,
      });
      setIsEditingAppointment(false);
    } catch (err) {
      console.error('Failed to update appointment:', err);
    } finally {
      setIsSavingAppointment(false);
    }
  };

  const handleQuickPreset = (preset: '48h' | '1week') => {
    const d = new Date();
    if (preset === '48h') {
      d.setHours(d.getHours() + 36);
    } else {
      d.setDate(d.getDate() + 7);
    }
    setAppointmentDate(d.toISOString().split('T')[0]);
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / DEFAULT_CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-4">
      {/* 48-HOUR NOTIFICATION BANNER (TRIGGERS IF WITHIN 48 HOURS) */}
      {isWithin48Hours && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white shadow-md animate-in fade-in slide-in-from-top-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-extrabold uppercase tracking-wider">
                  {isToday ? 'Today\'s Appointment!' : `${hoursUntil}h Remaining`}
                </span>
                <span className="text-xs font-bold text-amber-100">
                  {child.name}'s {appointmentType}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold mt-0.5">
                Therapy Session on {formattedDateString}
              </h3>
              <p className="text-xs text-amber-100/90 leading-relaxed mt-1">
                48-hour alert triggered: Your clinical session with {therapistName} is approaching. Export your PDF report to share home progress and discussion points.
              </p>
            </div>
          </div>

          <button
            onClick={onExportReport}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-amber-50 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-center"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Export Clinic PDF Report</span>
          </button>
        </div>
      )}

      {/* Main Checklist Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* Header with appointment info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Therapy Prep Checklist
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {completedCount} of {DEFAULT_CHECKLIST_ITEMS.length} Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Next scheduled session with <strong className="text-slate-700">{therapistName}</strong> on <strong className="text-teal-700">{formattedDateString}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingAppointment(!isEditingAppointment)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-teal-500 text-slate-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingAppointment ? 'Cancel' : 'Change Date'}</span>
            </button>

            <button
              onClick={onExportReport}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Inline Appointment Editor Modal / Form */}
        {isEditingAppointment && (
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-teal-950">
              <span>Set Next Therapy Appointment Date</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPreset('48h')}
                  className="px-2 py-0.5 rounded-md bg-white text-[10px] font-semibold text-teal-800 border border-teal-200 hover:bg-teal-100"
                >
                  In 36 Hours (Test Alert)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('1week')}
                  className="px-2 py-0.5 rounded-md bg-white text-[10px] font-semibold text-teal-800 border border-teal-200 hover:bg-teal-100"
                >
                  In 1 Week
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Time</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Discipline</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Occupational Therapy (OT)">Occupational Therapy (OT)</option>
                  <option value="Speech-Language (SLP)">Speech-Language (SLP)</option>
                  <option value="Physical Therapy (PT)">Physical Therapy (PT)</option>
                  <option value="Developmental Pediatrician">Developmental Pediatrician</option>
                  <option value="IEP School Conference">IEP School Conference</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Therapist Name</label>
                <input
                  type="text"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, OTR/L"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingAppointment(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAppointment}
                disabled={isSavingAppointment}
                className="px-3.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingAppointment ? 'Saving...' : 'Save Appointment'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Session Preparation</span>
            <span className="font-extrabold text-teal-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist items list */}
        <div className="space-y-2">
          {DEFAULT_CHECKLIST_ITEMS.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-700'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-teal-500'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {item.title}
                    </div>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.isReportAction && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportReport();
                    }}
                    className="px-2.5 py-1 bg-white border border-teal-300 text-teal-800 hover:bg-teal-50 rounded-lg text-[11px] font-bold shrink-0 shadow-xs transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-teal-600" />
                    <span>Open PDF</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
