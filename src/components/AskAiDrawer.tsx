import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Lightbulb, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { geminiClientService, AskAiResponse } from '../services/geminiClientService';
import { playSoftChime } from '../utils/soundEffects';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedNextQuestions?: string[];
}

interface AskAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  childProfile?: {
    name?: string;
    age?: number;
    communicationStyle?: string;
    sensoryPreference?: string;
    sensoryTriggers?: string[];
    calmingTools?: string[];
  };
}

export const AskAiDrawer: React.FC<AskAiDrawerProps> = ({ isOpen, onClose, childProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: childProfile?.name 
        ? `Hello! I'm your Autism Child Bridge AI assistant. I'm tailored with ${childProfile.name}'s profile. You can ask me any question about daily sensory regulation, speech & AAC, meltdown recovery, or questions for your next OT/SLP visit. What's on your mind?`
        : `Hello! I'm Autism Child Bridge AI. Ask me any question regarding your child's therapy exercises, sensory diet, home meltdowns, or how to prepare for your next clinic visit.`,
      timestamp: 'Just now',
      suggestedNextQuestions: [
        'How to calm a sensory meltdown fast?',
        'Bedtime sensory calming routine',
        'Questions for our next OT session'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || inputValue).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }));

      const res: AskAiResponse = await geminiClientService.askQuestion({
        question: textToSend,
        childProfile,
        conversationHistory: history
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: res.answer,
        timestamp: 'Just now',
        suggestedNextQuestions: res.suggestedNextQuestions
      };

      setMessages(prev => [...prev, aiMessage]);
      playSoftChime(659.25);
    } catch (err) {
      console.error('AI Drawer error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm temporarily unable to reach AutismChildBridge AI. Please ensure your connection is active or try asking again in a few moments.",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-teal-800 to-emerald-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-tight">Ask AutismChildBridge AI</h3>
                <span className="px-1.5 py-0.2 bg-emerald-400/20 text-emerald-200 text-[10px] font-bold rounded">
                  AI Assistant
                </span>
              </div>
              <span className="text-[11px] text-teal-200">
                {childProfile?.name ? `Tailored for ${childProfile.name}` : 'Immediate Clinical Guidance'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                {msg.role === 'user' ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3 text-slate-400" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-teal-600" />
                    <span className="font-semibold text-teal-800">Bridge AI</span>
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs relative group ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}

                {msg.role === 'model' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Suggested follow up questions */}
              {msg.suggestedNextQuestions && msg.suggestedNextQuestions.length > 0 && (
                <div className="pt-1 space-y-1 max-w-[90%]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suggested Next:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedNextQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 text-[11px] font-medium rounded-lg shadow-2xs transition-colors text-left flex items-center gap-1"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Consulting AutismChildBridge AI clinical knowledge...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything (e.g., 'How to handle hair washing?')"
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="Send question"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <div className="text-[10px] text-slate-600 flex items-center justify-between px-1">
            <span>Evidence-informed home practice support</span>
            <span>Always consult your licensed OT/SLP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
