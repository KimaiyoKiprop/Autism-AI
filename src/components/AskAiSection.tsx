import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  Check, 
  Copy, 
  Lightbulb, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  MessageSquareText, 
  Compass, 
  Clock, 
  HeartHandshake,
  Bot
} from 'lucide-react';
import { geminiClientService, AskAiResponse } from '../services/geminiClientService';
import { playSoftChime } from '../utils/soundEffects';

interface AskAiSectionProps {
  onOpenReportModal?: () => void;
  onOpenAuth?: () => void;
}

const PRESET_TOPICS = [
  {
    id: 'meltdown',
    label: 'Sensory Meltdown De-escalation',
    icon: '⚡',
    question: 'How do I calm my 5-year-old child during an unexpected sensory meltdown in public?',
  },
  {
    id: 'bedtime',
    label: 'Bedtime Proprioceptive Routines',
    icon: '🌙',
    question: 'What proprioceptive sensory activities help calm an autistic child before bed?',
  },
  {
    id: 'eating',
    label: 'Picky Eating & Food Textures',
    icon: '🥣',
    question: 'My autistic child refuses all mixed textures and gag reflexes easily. How can we support food exploration without pressure?',
  },
  {
    id: 'aac',
    label: 'AAC Modeling at Home',
    icon: '💬',
    question: 'How can parents model AAC communication at home during daily routines without demanding performance?',
  },
  {
    id: 'therapist',
    label: 'Questions for Child’s OT / SLP',
    icon: '📋',
    question: 'What high-impact questions should I bring to our next pediatric OT session about sensory regulation?',
  },
];

export const AskAiSection: React.FC<AskAiSectionProps> = ({ onOpenReportModal, onOpenAuth }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AskAiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initial default loaded question for instant showcase
  const [activePreset, setActivePreset] = useState<string>('meltdown');

  const handleAsk = async (queryText?: string) => {
    const textToAsk = (queryText || question).trim();
    if (!textToAsk) return;

    setLoading(true);
    setError(null);

    try {
      const res = await geminiClientService.askQuestion({
        question: textToAsk,
      });
      setResponse(res);
      playSoftChime(659.25);
    } catch (err: any) {
      console.error('Failed to get AI answer:', err);
      setError('Unable to fetch response from AutismChildBridge AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.answer);
    setCopied(true);
    playSoftChime(523.25);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setActivePreset(preset.id);
    setQuestion(preset.question);
    handleAsk(preset.question);
  };

  return (
    <section id="ask-ai-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Powered by AutismChildBridge AI</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Ask Any Pediatric Therapy Question — Get Instant Clinical Clarity
        </h2>

        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Whether you're facing a bedtime sensory battle, picky eating texture aversions, or wondering how to interpret your child’s therapy report, ask below. Our AI provides immediate, neurodiversity-affirming home strategies and clinical discussion points.
        </p>
      </div>

      {/* Main Interactive AI Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-lg shadow-teal-950/5 max-w-4xl mx-auto space-y-6">
        {/* Preset quick buttons */}
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Quick Topics to Explore Instantly:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => selectPreset(topic)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === topic.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{topic.icon}</span>
                <span>{topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything (e.g. 'How can I support my non-speaking 4yo with teeth brushing sensory sensitivity?')"
              rows={3}
              className="w-full px-4 py-3.5 pr-28 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400 resize-none shadow-2xs"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask AutismChildBridge AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Grounded in neurodiversity-affirming OT, SLP & sensory integration guidance</span>
            </span>
            <span>Real-time AutismChildBridge AI responses</span>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* AI Response Display */}
        {response && (
          <div className="pt-4 border-t border-slate-100 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4 text-teal-700" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Autism Child Bridge AI Response
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Instant Response
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Answer body */}
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3 font-normal">
              {response.answer}
            </div>

            {/* Suggested Follow-Up Questions */}
            {response.suggestedNextQuestions && response.suggestedNextQuestions.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Explore Related Questions (Click to Ask):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {response.suggestedNextQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuestion(q);
                        handleAsk(q);
                      }}
                      className="p-2.5 text-left bg-white hover:bg-teal-50/50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-teal-900 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <span className="line-clamp-2">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Disclaimer Banner */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
              <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Caregiver Note:</strong> This AI guidance is tailored to support everyday carryover routines at home and should always be discussed with your child's licensed pediatric OT, SLP, or physical therapist.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
