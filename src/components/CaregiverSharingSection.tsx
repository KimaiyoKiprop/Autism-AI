import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles,
  MessageSquareHeart,
  Clock
} from 'lucide-react';

export const CaregiverSharingSection: React.FC = () => {
  const caregivers = [
    { name: 'Sarah (Mom)', role: 'Primary Caregiver', badge: 'Admin', avatar: 'bg-teal-600', action: 'Logged Morning Greeting Game (Done)' },
    { name: 'Alex (Dad)', role: 'Co-Parent', badge: 'Full Access', avatar: 'bg-indigo-600', action: 'Recorded Voice Note: "Loves the bear crawl!"' },
    { name: 'Grandma Elena', role: 'Weekend Caregiver', badge: 'Contributor', avatar: 'bg-rose-500', action: 'Checked Saturday visual schedule' },
    { name: 'Brianna (RBT)', role: 'Behavior Technician', badge: 'Therapy Team', avatar: 'bg-emerald-600', action: 'Reviewed 2-week PDF before session' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left 6 Cols: Text & Benefits */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>Family & Caregiver Collaboration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Keep Both Parents, Grandparents, and Nannies on the Exact Same Page
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Predictability is everything for an autistic child. With shared child profiles, co-parents, extended family, and in-home therapists can all view scheduled exercises, log quick updates, and read the therapist’s coaching tips.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-700">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Unified Child Timeline</strong>
                <span className="text-slate-600">No more texting "Did you do the speech cards today?" Logged updates sync instantly across all devices.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Consistent Therapy Carryover</strong>
                <span className="text-slate-600">Grandparents and babysitters can see the exact steps and processing delays recommended by your therapist.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Up to 3 Caregivers on Plus, Unlimited on Family</strong>
                <span className="text-slate-600">Invite anyone with an email link. Set permissions so your child's data remains private and secure.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Live Team Sync Visual Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-sky-900/5 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Noah's Care Circle</h4>
                <p className="text-[11px] text-slate-500">4 Active Team Members Synced</p>
              </div>
              <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-[11px] font-bold rounded-full border border-sky-200">
                Live Sync Active
              </span>
            </div>

            <div className="space-y-3">
              {caregivers.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${c.avatar} text-white font-bold flex items-center justify-center text-xs shadow-2xs`}>
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-slate-900">{c.name}</strong>
                        <span className="text-[10px] text-slate-500 font-medium">({c.role})</span>
                      </div>
                      <span className="text-[11px] text-slate-600 italic block mt-0.5">
                        {c.action}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    {c.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Role-based access control
              </span>
              <span className="text-teal-700 font-bold cursor-pointer hover:underline">
                + Invite New Caregiver
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
