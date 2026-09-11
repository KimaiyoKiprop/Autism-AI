import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Menu, 
  X, 
  Sparkles, 
  FileText, 
  BookOpen, 
  ArrowRight,
  Play,
  LogIn,
  User,
  LayoutDashboard,
  LogOut,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenReportModal: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenDemo, 
  onOpenReportModal,
  onOpenAuth,
  onOpenDashboard 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          {/* Brand Logo with Domain Tag */}
          <div 
            onClick={() => scrollTo('hero-section')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-teal-800/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-tight">
                  Autism Child <span className="text-teal-700">Bridge</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                  autismchildbridge.com
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium block">
                Home Therapy Tracker & AI Clinic Summaries
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>How It Works</span>
            </button>
            <button
              onClick={() => scrollTo('exercise-library')}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Exercise Library</span>
            </button>
            <button
              onClick={() => scrollTo('ask-ai-section')}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200/80"
            >
              <Bot className="w-3.5 h-3.5 text-teal-700" />
              <span>Ask Clinical AI</span>
              <span className="px-1.5 py-0.2 bg-teal-200/60 text-teal-900 text-[9px] font-bold rounded">
                AutismChildBridge AI
              </span>
            </button>
            <button
              onClick={() => scrollTo('ai-summaries')}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Insights</span>
            </button>
            <button
              onClick={() => scrollTo('therapist-reports')}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Clinic Reports</span>
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDashboard}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Open Parent Tracker</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-teal-800 hover:bg-teal-50 text-xs font-bold rounded-xl border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-700" />
                  <span>Parent Log In</span>
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 text-sm font-semibold text-slate-800">
          <div className="px-2 py-1 bg-teal-50/70 rounded-lg text-[11px] text-teal-800 font-bold border border-teal-100 mb-2">
            autismchildbridge.com • Supporting your clinical therapist
          </div>

          {user ? (
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName?.[0] || 'P'}
                </div>
                <span className="text-xs font-bold text-teal-900">{user.displayName || 'Signed In Parent'}</span>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                className="px-2.5 py-1 bg-teal-700 text-white text-xs font-bold rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="flex-1 py-2.5 bg-teal-700 text-white text-xs font-bold rounded-xl text-center"
              >
                Parent Log In / Sign Up
              </button>
            </div>
          )}

          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-teal-700 flex items-center justify-between"
          >
            <span>How It Works (6 Steps)</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => scrollTo('exercise-library')}
            className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-teal-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>General Exercise Library</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => scrollTo('ask-ai-section')}
            className="w-full text-left py-2.5 px-2 rounded-lg bg-teal-50/80 hover:bg-teal-100/70 text-teal-800 flex items-center justify-between font-bold border border-teal-200/80"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-700" />
              <span>Ask AutismChildBridge AI</span>
            </div>
            <span className="px-2 py-0.5 bg-teal-200/60 text-teal-900 text-[10px] rounded-full">Instant</span>
          </button>
          <button
            onClick={() => scrollTo('ai-summaries')}
            className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-teal-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Weekly Digests & Questions</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => scrollTo('therapist-reports')}
            className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-teal-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Therapist PDF Report Export</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => scrollTo('pricing')}
            className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-teal-700 flex items-center justify-between"
          >
            <span>Plans & Pricing</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-teal-700"
          >
            Frequently Asked Questions
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-teal-700 fill-teal-700" />
              <span>Try Interactive 10-Second Log Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
