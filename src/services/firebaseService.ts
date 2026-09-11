import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { FirebaseChild, FirebaseGoal, FirebaseLog, FirebaseWeeklySummary, FirebaseDailyPulse } from '../types';
import { geminiClientService } from './geminiClientService';

// Default starter profile to seed on first login if no children exist
const DEFAULT_CHILD: Omit<FirebaseChild, 'id' | 'parentId' | 'createdAt'> = {
  name: 'Leo',
  age: 6,
  communicationStyle: 'Emerging Verbal & Gestural',
  sensoryPreference: 'Sensory Sensitive (Auditory & Tactile)',
  specialInterest: 'Trains, gears & mechanical clocks',
  calmingTools: [
    'Deep pressure weighted lap blanket (5 lbs)',
    'Noise-dampening ear defenders',
    '3-minute visual oil timer',
    'Heavy-work couch cushion squishes'
  ],
  sensoryTriggers: [
    'Unexpected loud hand dryers or blenders',
    'Tags on shirts and stiff seams',
    'Rapid transitions without a 2-minute visual countdown',
    'Echoey fluorescent supermarket aisles'
  ],
  therapistName: 'Sarah Jenkins, OTR/L',
  clinicName: 'Valley Pediatric Therapy Partners',
  // Set next appointment to ~36 hours from now so the 48-hour Prep checklist alert is immediately active
  nextAppointmentDate: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString().split('T')[0],
  nextAppointmentTime: '10:30',
  nextAppointmentType: 'Occupational Therapy (OT)',
  appointmentNotes: 'Focus on fine motor grasp, heavy-work carryover, and visual schedule transitions.'
};

const DEFAULT_GOALS: Array<Omit<FirebaseGoal, 'id' | 'childId' | 'parentId' | 'createdAt'>> = [
  {
    title: 'Morning Greeting Game (Eye Contact / AAC Wave)',
    category: 'Speech & Language',
    frequency: 'Daily (Morning)',
    durationMinutes: 5,
    therapistTips: 'Hold preferred toy close to your eye level. Wait 5 full seconds before prompting. Accept eye-contact, gesture, or AAC tap.',
    equipmentNeeded: 'Favorite train toy or stuffed animal',
    isActive: true
  },
  {
    title: 'Proprioceptive Animal Walks (Heavy Work)',
    category: 'Occupational Therapy',
    frequency: '4x / week (After school)',
    durationMinutes: 10,
    therapistTips: 'Crab walk and bear crawl across carpet before homework or dinner to reset vestibular and proprioceptive systems.',
    equipmentNeeded: 'Living room rug, soft cushions',
    isActive: true
  },
  {
    title: 'Visual Timer Transition Reset',
    category: 'Sensory Regulation',
    frequency: 'Daily (Transition times)',
    durationMinutes: 5,
    therapistTips: 'Give a 2-minute warning using the sand timer. Pair with deep pressure shoulder squeeze before turning off tablet.',
    equipmentNeeded: 'Visual sand or liquid timer',
    isActive: true
  }
];

export const firebaseService = {
  // --- CHILDREN ---
  async getChildren(parentId: string): Promise<FirebaseChild[]> {
    try {
      const q = query(
        collection(db, 'children'),
        where('parentId', '==', parentId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Seed default child for parent so they have immediate rich preview
        const seeded = await this.seedInitialChild(parentId);
        return [seeded];
      }

      const list: FirebaseChild[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() } as FirebaseChild);
      });
      return list;
    } catch (err) {
      console.error('Error getting children:', err);
      // Fallback local child if Firestore rules or connectivity issue
      return [{
        id: 'local-child-demo',
        parentId,
        ...DEFAULT_CHILD,
        createdAt: new Date().toISOString()
      }];
    }
  },

  async seedInitialChild(parentId: string): Promise<FirebaseChild> {
    const childRef = doc(collection(db, 'children'));
    const childData: FirebaseChild = {
      id: childRef.id,
      parentId,
      ...DEFAULT_CHILD,
      createdAt: new Date().toISOString()
    };
    await setDoc(childRef, childData);

    // Seed goals for this child
    for (const g of DEFAULT_GOALS) {
      const goalRef = doc(collection(db, 'goals'));
      const goalData: FirebaseGoal = {
        id: goalRef.id,
        childId: childRef.id,
        parentId,
        ...g,
        createdAt: new Date().toISOString()
      };
      await setDoc(goalRef, goalData);
    }

    // Seed initial progress log
    const logRef = doc(collection(db, 'progressLogs'));
    const initialLog: FirebaseLog = {
      id: logRef.id,
      childId: childRef.id,
      parentId,
      goalTitle: 'Morning Greeting Game (Eye Contact / AAC Wave)',
      status: 'Done',
      regulationRating: 4,
      mood: 'Calm & Focused',
      notes: 'Maintained direct eye contact for 4 seconds when holding the blue steam engine! Smiled and waved his hand.',
      caregiverName: 'Mom',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now()
    };
    await setDoc(logRef, initialLog);

    return childData;
  },

  async createChild(parentId: string, data: Omit<FirebaseChild, 'id' | 'parentId' | 'createdAt'>): Promise<FirebaseChild> {
    const childRef = doc(collection(db, 'children'));
    const newChild: FirebaseChild = {
      id: childRef.id,
      parentId,
      ...data,
      createdAt: new Date().toISOString()
    };
    await setDoc(childRef, newChild);
    return newChild;
  },

  async updateChild(childId: string, updates: Partial<FirebaseChild>): Promise<void> {
    const childRef = doc(db, 'children', childId);
    await updateDoc(childRef, updates);
  },

  // --- GOALS ---
  async getGoals(childId: string, parentId: string): Promise<FirebaseGoal[]> {
    try {
      const q = query(
        collection(db, 'goals'),
        where('childId', '==', childId),
        where('parentId', '==', parentId)
      );
      const snapshot = await getDocs(q);
      const goals: FirebaseGoal[] = [];
      snapshot.forEach(d => {
        goals.push({ id: d.id, ...d.data() } as FirebaseGoal);
      });
      return goals;
    } catch (err) {
      console.error('Error fetching goals:', err);
      return [];
    }
  },

  async addGoal(goal: Omit<FirebaseGoal, 'id' | 'createdAt'>): Promise<FirebaseGoal> {
    const goalRef = doc(collection(db, 'goals'));
    const newGoal: FirebaseGoal = {
      id: goalRef.id,
      ...goal,
      createdAt: new Date().toISOString()
    };
    await setDoc(goalRef, newGoal);
    return newGoal;
  },

  async deleteGoal(goalId: string): Promise<void> {
    await deleteDoc(doc(db, 'goals', goalId));
  },

  // --- PROGRESS LOGS ---
  async getLogs(childId: string, parentId: string): Promise<FirebaseLog[]> {
    try {
      const q = query(
        collection(db, 'progressLogs'),
        where('childId', '==', childId),
        where('parentId', '==', parentId)
      );
      const snapshot = await getDocs(q);
      const logs: FirebaseLog[] = [];
      snapshot.forEach(d => {
        logs.push({ id: d.id, ...d.data() } as FirebaseLog);
      });
      // Sort client-side by timestamp descending
      return logs.sort((a, b) => b.timestamp - a.timestamp);
    } catch (err) {
      console.error('Error fetching logs:', err);
      return [];
    }
  },

  async addLog(logData: Omit<FirebaseLog, 'id'>): Promise<FirebaseLog> {
    const logRef = doc(collection(db, 'progressLogs'));
    const newLog: FirebaseLog = {
      id: logRef.id,
      ...logData
    };
    await setDoc(logRef, newLog);
    return newLog;
  },

  async deleteLog(logId: string): Promise<void> {
    await deleteDoc(doc(db, 'progressLogs', logId));
  },

  // --- WEEKLY SUMMARIES & CLINIC REPORTS ---
  async getWeeklySummaries(childId: string, parentId: string): Promise<FirebaseWeeklySummary[]> {
    try {
      const q = query(
        collection(db, 'weeklySummaries'),
        where('childId', '==', childId),
        where('parentId', '==', parentId)
      );
      const snapshot = await getDocs(q);
      const list: FirebaseWeeklySummary[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() } as FirebaseWeeklySummary);
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.error('Error getting weekly summaries:', err);
      return [];
    }
  },

  async generateAndSaveWeeklySummary(
    childId: string, 
    parentId: string, 
    childName: string, 
    logs: FirebaseLog[],
    goals: FirebaseGoal[]
  ): Promise<FirebaseWeeklySummary> {
    const totalSessions = logs.length;
    const completedCount = logs.filter(l => l.status === 'Done').length;
    const partialCount = logs.filter(l => l.status === 'Partial').length;
    let adherencePercent = totalSessions > 0 
      ? Math.round(((completedCount + (partialCount * 0.5)) / Math.max(totalSessions, 1)) * 100) 
      : 85;

    const ratings = logs.filter(l => l.regulationRating > 0).map(l => l.regulationRating);
    let avgRating = ratings.length > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : 4.1;

    let celebrations = [
      `Completed ${completedCount} full home therapy routines with positive sensory engagement.`,
      `Regulation index remained at a healthy average of ${avgRating} / 5.0 throughout the week.`,
      `Maintained routine consistency across multiple days without reported severe distress.`
    ];

    let sensoryPatterns = [
      'Morning routines (8:00 AM – 10:00 AM) consistently show higher task initiation and emotional calm.',
      'Transition challenges correlate with auditory stimuli or sudden task changes.',
      'Proprioceptive heavy-work (bear walks/cushions) significantly improved calm before table tasks.'
    ];

    let therapistQuestions = [
      `How can we generalize the 4-second eye contact achieved at breakfast to clinic visits?`,
      `Should we introduce a 5-minute visual count-down board for evening transitions?`,
      `Is it time to level-up the animal walk obstacle course with a balance beam or weighted ball?`
    ];

    let parentObservations = `Home practice was steady. The gentle, guilt-free reminder flow kept us on track without mealtime or bedtime battles.`;

    // Attempt real Gemini API synthesis from server
    try {
      // Also fetch recent daily pulses for rich context
      const pulses = await this.getDailyPulses(childId, parentId);

      const geminiRes = await geminiClientService.synthesizeWeekly({
        childName,
        logs: logs.map(l => ({
          goalTitle: l.goalTitle,
          status: l.status,
          regulationRating: l.regulationRating,
          notes: l.notes,
          date: l.date
        })),
        goals: goals.map(g => ({
          title: g.title,
          discipline: g.category,
          frequency: g.frequency
        })),
        dailyPulses: pulses.slice(0, 7).map(p => ({
          date: p.date,
          sentiment: p.sentiment,
          sentimentLabel: p.sentimentLabel,
          score: p.score,
          triggers: p.triggers,
          note: p.note
        }))
      });

      if (geminiRes.celebrations && geminiRes.celebrations.length > 0) {
        celebrations = geminiRes.celebrations;
      }
      if (geminiRes.sensoryPatterns && geminiRes.sensoryPatterns.length > 0) {
        sensoryPatterns = geminiRes.sensoryPatterns;
      }
      if (geminiRes.therapistQuestions && geminiRes.therapistQuestions.length > 0) {
        therapistQuestions = geminiRes.therapistQuestions;
      }
      if (geminiRes.parentObservations) {
        parentObservations = geminiRes.parentObservations;
      }
      if (geminiRes.adherencePercent !== undefined) {
        adherencePercent = geminiRes.adherencePercent;
      }
      if (geminiRes.averageRegulation !== undefined) {
        avgRating = geminiRes.averageRegulation;
      }
    } catch (apiErr) {
      console.warn('Gemini synthesis request fell back to local template calculation:', apiErr);
    }

    const summaryRef = doc(collection(db, 'weeklySummaries'));
    const summaryData: FirebaseWeeklySummary = {
      id: summaryRef.id,
      childId,
      parentId,
      childName,
      weekLabel: `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      totalSessions,
      adherencePercent,
      averageRegulation: avgRating,
      celebrations,
      sensoryPatterns,
      therapistQuestions,
      parentObservations,
      createdAt: new Date().toISOString()
    };

    await setDoc(summaryRef, summaryData);
    return summaryData;
  },

  // --- DAILY PULSES (1-Question Sentiment Check) ---
  async getDailyPulses(childId: string, parentId: string): Promise<FirebaseDailyPulse[]> {
    try {
      const q = query(
        collection(db, 'dailyPulses'),
        where('childId', '==', childId),
        where('parentId', '==', parentId)
      );
      const snapshot = await getDocs(q);
      const list: FirebaseDailyPulse[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() } as FirebaseDailyPulse);
      });
      return list.sort((a, b) => b.timestamp - a.timestamp);
    } catch (err) {
      console.error('Error fetching daily pulses from Firestore:', err);
      return [];
    }
  },

  async saveDailyPulse(data: Omit<FirebaseDailyPulse, 'id' | 'createdAt' | 'timestamp'>): Promise<FirebaseDailyPulse> {
    const pulseRef = doc(collection(db, 'dailyPulses'));
    const newPulse: FirebaseDailyPulse = {
      id: pulseRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };
    await setDoc(pulseRef, newPulse);
    return newPulse;
  }
};
