import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { FAQ_ITEMS, TESTIMONIALS_DATA } from '../data/landingData';

export const TestimonialsFAQ: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeFaqFilter, setActiveFaqFilter] = useState<string>('All');

  const faqFilters = ['All', 'Therapists & AI', 'Reminders & Logs', 'Plans & Sharing', 'General'];

  const filteredFaqs = FAQ_ITEMS.filter((item) => 
    activeFaqFilter === 'All' || item.category === activeFaqFilter
  );

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 space-y-20">
      {/* Testimonials Section */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-teal-600" />
            <span>Trusted by Parents & Recommended by Clinicians</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Real Stories from the Spectrum Community
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            See how parents and pediatric therapists collaborate using Autism Child Bridge to transform clinic visits into breakthroughs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 bg-teal-50 text-teal-800 text-[10px] font-bold rounded-full border border-teal-200">
                  {t.highlight}
                </span>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-normal">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 mt-6">
                <div className={`w-10 h-10 rounded-2xl ${t.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-2xs`}>
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Frequently Asked Questions
          </h3>

          <p className="text-base text-slate-600 font-normal">
            Everything you need to know about how Autism Child Bridge supports your family and honors your child's clinical therapy team.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
            {faqFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFaqFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFaqFilter === filter
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <span className="font-extrabold text-sm text-slate-900">
                    {faq.question}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
