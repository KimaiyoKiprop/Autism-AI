import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ExerciseLibraryPreview } from './components/ExerciseLibraryPreview';
import { AiWeeklySummaryPreview } from './components/AiWeeklySummaryPreview';
import { CaregiverSharingSection } from './components/CaregiverSharingSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsFAQ } from './components/TestimonialsFAQ';
import { Footer } from './components/Footer';
import { TherapistReportModal } from './components/TherapistReportModal';
import { InteractiveLogModal } from './components/InteractiveLogModal';
import { SelectedPlanModal } from './components/SelectedPlanModal';
import { AuthModal } from './components/AuthModal';
import { ParentDashboard } from './components/ParentDashboard';
import { AskAiSection } from './components/AskAiSection';
import { AskAiDrawer } from './components/AskAiDrawer';
import { PricingPlan } from './types';
import { LayoutDashboard, HeartHandshake, ShieldCheck, Sparkles, Bot } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  // If user is viewing the dashboard
  if (currentView === 'dashboard') {
    return (
      <>
        <ParentDashboard onBackToLanding={() => setCurrentView('landing')} />
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* If user is logged in, show floating fast-access bar */}
      {user && (
        <div className="bg-teal-900 text-teal-100 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-teal-800">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Signed in as <strong>{user.displayName || user.email}</strong> (Firebase sync active)</span>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open Parent Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Sticky Header */}
      <Navbar 
        onOpenDemo={() => setDemoModalOpen(true)}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setCurrentView('dashboard')}
      />

      <main id="main-content">
        {/* Hero Section with Interactive Smartphone Simulator */}
        <Hero 
          onOpenDemoModal={() => setDemoModalOpen(true)}
          onOpenReportModal={() => setReportModalOpen(true)}
          onOpenAuth={() => {
            if (user) {
              setCurrentView('dashboard');
            } else {
              setAuthModalOpen(true);
            }
          }}
          onOpenDashboard={() => setCurrentView('dashboard')}
        />

        {/* The 6-Step Core Parent-Therapist Flow */}
        <HowItWorks 
          onOpenLogDemo={() => setDemoModalOpen(true)}
          onOpenReportModal={() => setReportModalOpen(true)}
        />

        {/* Built-in General Exercise Library */}
        <ExerciseLibraryPreview />

        {/* Real-time Interactive Clinical AI Q&A (Powered by AutismChildBridge AI) */}
        <AskAiSection 
          onOpenReportModal={() => setReportModalOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Weekly AI Progress Synthesis & Therapist Question Generator */}
        <AiWeeklySummaryPreview 
          onOpenReportModal={() => setReportModalOpen(true)}
        />

        {/* Multi-Caregiver & Family Sync */}
        <CaregiverSharingSection />

        {/* Pricing Tiers: Free / Plus / Family */}
        <PricingSection 
          onSelectPlan={(plan) => {
            setSelectedPlan(plan);
          }}
        />

        {/* Testimonials and Comprehensive FAQ */}
        <TestimonialsFAQ />
      </main>

      {/* Floating Quick Ask AutismChildBridge AI Button */}
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 font-bold text-xs border border-teal-500/30 group cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Open Ask AutismChildBridge AI Drawer"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
        </div>
        <span>Ask AutismChildBridge AI</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-400/30 text-emerald-100 text-[10px] font-extrabold uppercase">
          AI
        </span>
      </button>

      {/* Slide-out Clinical AI Drawer */}
      <AskAiDrawer 
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      {/* Footer with Clinical Disclaimer and Support Email */}
      <Footer />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setCurrentView('dashboard')}
      />

      <TherapistReportModal 
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      <InteractiveLogModal 
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <SelectedPlanModal 
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
