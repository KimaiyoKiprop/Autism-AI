import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  Check, 
  Lightbulb, 
  FilePlus, 
  RotateCcw, 
  ShieldCheck, 
  Heart,
  Baby,
  ArrowRight,
  Lock
} from 'lucide-react';
import { FirebaseChild, FirebaseGoal } from '../types';
import { geminiClientService, AskAiResponse } from '../services/geminiClientService';
import { playSoftChime } from '../utils/soundEffects';

interface DashboardAiAssistantProps {
  selectedChild: FirebaseChild | null;
  goals: FirebaseGoal[];
  onAddTherapistQuestion?: (question: string) => void;
  isPaid?: boolean;
  onOpenUpgrade?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedNextQuestions?: string[];
}

export const DashboardAiAssistant: React.FC<DashboardAiAssistantProps> = ({
  selectedChild,
  goals,
  onAddTherapistQuestion,
  isPaid = false,
  onOpenUpgrade,
}) => {
  const childName = selectedChild?.name || 'your child';
  const [questionsAskedCount, setQuestionsAskedCount] = useState<number>(0);
  const FREE_QUERY_LIMIT = 2;

  const defaultChildPrompts = [
    `How can we support ${childName} during grocery store or busy restaurant sensory overload?`,
    `What heavy-work proprioceptive exercises help ${childName} settle down before bedtime?`,
    `How can we encourage speech or AAC communication during play without demanding performance?`,
    `What questions should I ask ${childName}'s occupational therapist at our next clinic visit?`,
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your AutismChildBridge AI assistant. I have ${childName}'s sensory profile in mind (${selectedChild?.sensoryPreference || 'sensory sensitive'}, communication: ${selectedChild?.communicationStyle || 'emerging verbal'}).\n\nAsk me anything: how to handle a tough transition, modify a home therapy exercise, or craft questions for your child's OT or SLP.`,
      timestamp: 'Just now',
      suggestedNextQuestions: [
        `De-escalating a sensory meltdown for ${childName}`,
        `Bedtime proprioceptive calming routine`,
        `Food texture exploration without gagging`,
      ],
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedQuestionId, setAddedQuestionId] = useState<string | null>(null);

  const handleAsk = async (customPrompt?: string) => {
    const textToAsk = (customPrompt || inputQuestion).trim();
    if (!textToAsk || loading) return;

    if (!isPaid && questionsAskedCount >= FREE_QUERY_LIMIT) {
      if (onOpenUpgrade) {
        onOpenUpgrade();
      } else {
        alert('Free query limit reached. Upgrade to Plus for unlimited AutismChildBridge AI.');
      }
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToAsk,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);
    setQuestionsAskedCount(prev => prev + 1);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res: AskAiResponse = await geminiClientService.askQuestion({
        question: textToAsk,
        childProfile: selectedChild ? {
          name: selectedChild.name,
          age: selectedChild.age,
          communicationStyle: selectedChild.communicationStyle,
          sensoryPreference: selectedChild.sensoryPreference,
          sensoryTriggers: selectedChild.sensoryTriggers,
          calmingTools: selectedChild.calmingTools,
        } : undefined,
        conversationHistory: history,
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedNextQuestions: res.suggestedNextQuestions,
      };

      setMessages((prev) => [...prev, modelMsg]);
      playSoftChime(659.25);
    } catch (err: any) {
      console.error('AI Ask error in dashboard:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'I ran into a temporary hiccup communicating with AutismChildBridge AI. Please try asking again in a few moments.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSoftChime(523.25);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: `Chat reset. Ask any question about ${childName}'s routines or therapy goals!`,
        timestamp: 'Just now',
        suggestedNextQuestions: defaultChildPrompts.slice(0, 3),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Child Context Pill Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <Bot className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Ask AutismChildBridge AI</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                Clinical Intelligence
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Personalized for <span className="font-semibold text-white">{childName}</span> ({selectedChild?.age || 6}y, {selectedChild?.communicationStyle || 'Verbal/AAC'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-black/20 px-3 py-2 rounded-xl border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Neurodiversity-affirming guidance for daily home carryover</span>
        </div>
      </div>

      {/* Suggested Child-Specific Questions */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Recommended Questions for {childName}:</span>
          </span>
          <button
            onClick={handleResetChat}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Chat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {defaultChildPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuestion(prompt);
                handleAsk(prompt);
              }}
              className="p-3 text-left bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-300 rounded-2xl text-xs text-slate-700 hover:text-teal-900 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="line-clamp-2">{prompt}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col min-h-[480px]">
        {/* Messages list */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[600px] bg-slate-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                {msg.role === 'user' ? (
                  <>
                    <span className="font-semibold text-slate-600">You (Parent)</span>
                    <User className="w-3 h-3 text-slate-400" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-bold text-teal-800">Bridge Clinical AI</span>
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs relative group ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}

                {msg.role === 'model' && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-xs flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Follow up chips */}
              {msg.suggestedNextQuestions && msg.suggestedNextQuestions.length > 0 && (
                <div className="pt-2 space-y-1.5 max-w-[88%]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Follow-Up Ideas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedNextQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputQuestion(q);
                          handleAsk(q);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-900 text-xs font-medium rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 p-3 bg-white rounded-2xl border border-slate-200/80 w-fit">
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Generating response with AutismChildBridge AI...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5">
          {!isPaid && questionsAskedCount >= FREE_QUERY_LIMIT ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Free AI Trial Limit Reached ({FREE_QUERY_LIMIT}/{FREE_QUERY_LIMIT})
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Upgrade to Plus ($9/mo) to unlock unlimited 24/7 clinical AI support and custom therapy exercises.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenUpgrade}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Upgrade to Plus ($9/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder={`Ask any question about ${childName}'s sensory regulation, therapy carryover, or routines...`}
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
              />
              <button
                type="submit"
                disabled={loading || !inputQuestion.trim()}
                className="px-5 py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-slate-600 px-1">
            <span className="flex items-center gap-1">
              <Baby className="w-3 h-3 text-teal-600" />
              <span>Context loaded: {childName} ({selectedChild?.sensoryPreference || 'Sensory sensitive'})</span>
              {!isPaid && (
                <span className="ml-1.5 px-2 py-0.2 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                  Free: {questionsAskedCount}/{FREE_QUERY_LIMIT} Used
                </span>
              )}
            </span>
            <span>Does not replace medical or licensed therapeutic diagnosis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
