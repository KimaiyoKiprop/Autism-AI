import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  Layers,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_WEEKLY_AI_SUMMARY } from '../data/landingData';

interface AiWeeklySummaryPreviewProps {
  onOpenReportModal: () => void;
}

export const AiWeeklySummaryPreview: React.FC<AiWeeklySummaryPreviewProps> = ({ onOpenReportModal }) => {
  const [viewMode, setViewMode] = useState<'synthesis' | 'raw'>('synthesis');
  const summary = SAMPLE_WEEKLY_AI_SUMMARY;

  const rawLogs = [
    { day: 'Mon 9:15 AM', text: 'Greeting game done with puppet. Leo smiled and waved to sis.', status: 'Done' },
    { day: 'Tue 6:30 PM', text: 'Fine motor sock exercise skipped. Very tired after school clinic.', status: 'Skipped' },
    { day: 'Wed 10:00 AM', text: 'Voice note: "Leo initiated the bubble game without prompting!"', status: 'Done' },
    { day: 'Thu 5:00 PM', text: 'Bear crawl obstacle course went great. Calmed him before dinner.', status: 'Done' },
    { day: 'Fri 9:30 AM', text: 'Greeting game done. Maintained eye contact for 5 seconds.', status: 'Done' },
    { day: 'Sun 7:00 PM', text: 'Dressing sequence partial. Sock seams bothered his toes.', status: 'Partial' }
  ];

  return (
    <section id="ai-summaries" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Weekly AI Clinical Intelligence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Turn Scattered Daily Notes into Actionable Therapist Insights
        </h2>

        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Every week, AI scans your one-tap logs, voice notes, and skip reasons. It generates a clear, plain-language summary—without inventing medical advice—so your therapist gets pure clinical clarity.
        </p>

        {/* View Mode Switcher */}
        <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('synthesis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'synthesis'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Weekly Summary (Synthesized)</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'raw'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Raw Parent Daily Logs (Before AI)</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-lg shadow-emerald-950/5 max-w-4xl mx-auto">
        {viewMode === 'synthesis' ? (
          <div className="space-y-6">
            {/* Report Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900">
                    Weekly Digest: {summary.childName}
                  </span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[11px] font-bold rounded-md border border-teal-200">
                    {summary.dateRange}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generated automatically for parent review & therapist appointments
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-semibold block">Adherence Rate</span>
                  <span className="text-xl font-black text-emerald-700">{summary.adherenceRate}%</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-sm">
                  {summary.completedCount}/{summary.totalScheduled}
                </div>
              </div>
            </div>

            {/* 4 Core Summary Quadrants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Quadrant 1: What Went Well */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>What Went Well (Home Wins)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {summary.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quadrant 2: What Was Missed / Challenges */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Challenges & Missed Sessions</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {summary.challengesAndMisses.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quadrant 3: Observed Patterns */}
              <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-teal-950 font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Patterns Discovered by AI</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {summary.observedPatterns.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quadrant 4: Suggested Questions for Real Therapist */}
              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-sky-950 font-bold text-xs">
                  <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Questions to Ask Your Therapist</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {summary.therapistDiscussionPoints.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-sky-100">
                      <span className="text-sky-600 font-bold">Q{i + 1}:</span>
                      <span className="italic">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Strict Clinical Safety: AI strictly analyzes parent inputs; never prescribes treatments.</span>
              </div>

              <button
                onClick={onOpenReportModal}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>View Full Clinic PDF Format</span>
              </button>
            </div>
          </div>
        ) : (
          /* Raw Log Mode */
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Parent Daily Log Stream (Raw Entries)</h4>
                <p className="text-xs text-slate-500">This is what parents tap or speak in under 10 seconds throughout the week.</p>
              </div>
              <span className="text-xs text-teal-700 font-bold">6 logs recorded</span>
            </div>

            <div className="space-y-2.5">
              {rawLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px]">{log.day}</span>
                    <p className="text-slate-800 font-medium">{log.text}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    log.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                    log.status === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
              <span>Notice how messy scattered notes become clear patterns when processed by AI.</span>
              <button
                onClick={() => setViewMode('synthesis')}
                className="px-3 py-1.5 bg-teal-700 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                Switch to AI Digest
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
