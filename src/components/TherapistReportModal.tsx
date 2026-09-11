import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  HelpCircle, 
  Sparkles,
  Shield,
  Share2
} from 'lucide-react';

interface TherapistReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistReportModal: React.FC<TherapistReportModalProps> = ({ isOpen, onClose }) => {
  const [reportRange, setReportRange] = useState<'2weeks' | '4weeks'>('2weeks');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://autismchildbridge.com/reports/sample-leo-oct2026.pdf');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Clinic-Ready PDF Report Preview</h3>
              <p className="text-[11px] text-slate-400">Ready to print or email to your OT, SLP, or PT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Date Range Selector */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setReportRange('2weeks')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  reportRange === '2weeks' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Past 2 Weeks
              </button>
              <button
                onClick={() => setReportRange('4weeks')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  reportRange === '4weeks' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Past 4 Weeks
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF Page Simulation Canvas (Scrollable) */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100/70 space-y-6 text-slate-800 text-xs">
          {/* Simulated White Paper Sheet */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-6 max-w-2xl mx-auto">
            {/* Report Header */}
            <div className="flex items-start justify-between border-b-2 border-teal-700 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-900 tracking-tight">
                    Autism Child <span className="text-teal-700">Bridge</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                    Home Carryover Summary
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Generated on Oct 19, 2026 • For Clinical Evaluation
                </p>
              </div>

              <div className="text-right text-[11px] text-slate-600">
                <p><strong>autismchildbridge.com</strong></p>
                <p className="text-slate-400">Report ID: ACB-8291-LEO</p>
              </div>
            </div>

            {/* Child & Provider Information Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-bold block">Patient</span>
                <strong className="text-slate-900">Leo H.</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-bold block">Age / Profile</span>
                <strong className="text-slate-900">6 yrs • Sensory Seeker</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-bold block">Target Range</span>
                <strong className="text-slate-900">{reportRange === '2weeks' ? 'Past 14 Days' : 'Past 28 Days'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-bold block">Care Team</span>
                <strong className="text-slate-900">OT & SLP Co-Care</strong>
              </div>
            </div>

            {/* High Level Adherence Metric */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-950 block">
                  Overall Home Exercise Compliance
                </span>
                <p className="text-[11px] text-slate-600">
                  12 Completed • 1 Partial • 1 Skipped (Preserved therapeutic break)
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-800">86%</span>
                <span className="text-[10px] text-teal-700 font-semibold block">Consistent Adherence</span>
              </div>
            </div>

            {/* Exercise Breakdown Table */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Progress by Prescribed Goal
              </h4>

              <div className="space-y-2.5">
                {/* Goal 1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">1. Morning Greeting Game (Speech / Joint Attention)</span>
                    <span className="font-extrabold text-emerald-700 text-[11px]">92% Adherence</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full w-[92%]" />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong>Parent Note:</strong> Leo consistently waved and vocalized greetings to his sister when using the plush dino. Processing delay decreased from 10s to ~4s.
                  </p>
                </div>

                {/* Goal 2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">2. Heavy Work Obstacle Bear Crawl (OT / Sensory Reg)</span>
                    <span className="font-extrabold text-emerald-700 text-[11px]">100% Adherence</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full w-[100%]" />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong>Parent Note:</strong> Successfully prevented dinner-time meltdowns 4 nights in a row. Leo actively requests this activity.
                  </p>
                </div>

                {/* Goal 3 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">3. Fine Motor Sock Pull Sequence (OT / Self-Care)</span>
                    <span className="font-extrabold text-amber-700 text-[11px]">60% Adherence (Challenging)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full w-[60%]" />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong>Parent Note:</strong> Skipped on post-clinic Tuesday due to sensory exhaustion. Seams continue to provoke tactile sensitivity.
                  </p>
                </div>
              </div>
            </div>

            {/* AutismChildBridge AI Synthesized Discussion Questions for Clinic Visit */}
            <div className="p-4 bg-sky-50/80 rounded-xl border border-sky-200 space-y-2">
              <div className="flex items-center gap-1.5 text-sky-950 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Recommended Discussion Points (AutismChildBridge AI Synthesized)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-600 font-bold">•</span>
                  <span><strong>For OT (Dr. Vance):</strong> "Seam sensitivity is hindering the sock sequence. Should we trial seamless sensory socks or pair with deep brushing first?"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-600 font-bold">•</span>
                  <span><strong>For SLP (Sarah):</strong> "Greeting game is consistent at 4s response time. Should we begin adding a 2-word phrase or AAC symbol pairing?"</span>
                </li>
              </ul>
            </div>

            {/* Bottom Signature / Clinical Note Area */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-600">
              <span>Parent Signature: _______________________</span>
              <span>Therapist Review Date: _________________</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Encrypted export. HIPAA-aligned data sovereignty for parents.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share Clinic Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
