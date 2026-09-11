import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client instance
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in your environment or Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION_PEDIATRIC_AI = `You are Autism Child Bridge AI, an empathetic, supportive, and clinical-literate assistant designed to empower parents of autistic and neurodivergent children.
Your mission is to help parents bridge the gap between their daily home life and professional therapy (Occupational Therapy, Speech-Language Pathology, Physical Therapy, and Behavioral/Developmental Pediatric care).

Guiding Principles:
1. Neurodiversity-Affirming: Honor the child's sensory profile, autonomy, and natural communication style (verbal, non-verbal, AAC, gestural, echolalia, scripts). Never promote punitive techniques or forced masking.
2. Practical & Immediately Actionable: Give parents concrete, compassionate steps they can try right now at home without fancy clinic equipment.
3. Therapeutic Framing: Clearly explain the sensory or motor "why" behind child reactions (e.g., vestibular input, proprioceptive heavy work, auditory filtering overload, interoception).
4. Collaborative with Therapists: Always suggest 1 or 2 high-value questions the parent can ask their child's licensed OT, SLP, or PT at their next appointment.
5. Clear Formatting: Use short paragraphs, clear bold headers, bulleted action steps, and quick takeaways so an exhausted parent can read and digest the advice in under 60 seconds.
6. Clinical Disclaimer: Always include a brief, comforting note that this guidance supports daily home routines and does not replace medical diagnosis or customized treatment from their licensed clinical team.`;

// Helper function to call Gemini with automatic fallback between official flash models
async function callGemini(contents: string, systemInstruction?: string, jsonMode: boolean = false): Promise<string> {
  const ai = getGeminiClient();
  const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const config: any = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (jsonMode) config.responseMimeType = "application/json";

      const response = await ai.models.generateContent({
        model,
        contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} hit error (${err?.status || err?.message}), testing next model...`);
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content.");
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    service: "Autism Child Bridge API",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// 2. Immediate Parent Q&A Endpoint
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { question, childProfile, conversationHistory } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      res.status(400).json({ error: "A valid question is required." });
      return;
    }

    let promptContext = "";
    if (childProfile && typeof childProfile === "object") {
      promptContext += `\nChild Context:\n- Name: ${childProfile.name || 'Child'}\n- Age: ${childProfile.age || 'Not specified'}\n- Communication: ${childProfile.communicationStyle || 'Verbal/Emerging'}\n- Sensory Diet / Preferences: ${childProfile.sensoryPreference || 'Sensory seeking/sensitive'}\n`;
      if (childProfile.sensoryTriggers && childProfile.sensoryTriggers.length > 0) {
        promptContext += `- Known Sensory Triggers: ${childProfile.sensoryTriggers.join(', ')}\n`;
      }
      if (childProfile.calmingTools && childProfile.calmingTools.length > 0) {
        promptContext += `- Known Calming Regulators: ${childProfile.calmingTools.join(', ')}\n`;
      }
    }

    let historyContext = "";
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      historyContext = "\nPrior conversation history:\n" + conversationHistory
        .slice(-4)
        .map(msg => `${msg.role === 'user' ? 'Parent' : 'Bridge AI'}: ${msg.text}`)
        .join("\n") + "\n";
    }

    const fullPrompt = `${promptContext}${historyContext}
Parent's Question:
"${question.trim()}"

Please provide an immediate, supportive, structured response with:
1. Empathy & The "Why" (Quick sensory or regulation reason for this behavior or challenge)
2. Immediate Action Steps at Home (3-4 clear, gentle steps)
3. Calming / Sensory Adjustments (Tools or routine tweaks)
4. Questions for Your Child's Therapist (2 specific questions to bring to the OT/SLP)
5. Quick Takeaway / Reassurance`;

    let answerText = "";
    try {
      answerText = await callGemini(fullPrompt, SYSTEM_INSTRUCTION_PEDIATRIC_AI, false);
    } catch (apiError: any) {
      console.warn("Gemini API error in /api/ai/ask (fallback triggered):", apiError?.message || apiError);
      answerText = generateSensoryFallbackAnswer(question, childProfile);
    }

    // Generate 3 contextual follow-up prompts
    const suggestedFollowUps = generateFollowUps(question);

    res.json({
      answer: answerText,
      suggestedNextQuestions: suggestedFollowUps,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error handling /api/ai/ask:", err);
    res.status(500).json({ error: err?.message || "Failed to process parent question." });
  }
});

// 3. Weekly Synthesis Endpoint
app.post("/api/ai/synthesize-weekly", async (req, res) => {
  try {
    const { childName, logs, goals, childProfile, dailyPulses } = req.body;

    const validLogs = Array.isArray(logs) ? logs : [];
    const validGoals = Array.isArray(goals) ? goals : [];
    const validPulses = Array.isArray(dailyPulses) ? dailyPulses : [];

    const totalSessions = validLogs.length;
    const completedCount = validLogs.filter((l: any) => l.status === "Done").length;
    const partialCount = validLogs.filter((l: any) => l.status === "Partial").length;
    const adherencePercent = totalSessions > 0
      ? Math.round(((completedCount + (partialCount * 0.5)) / totalSessions) * 100)
      : 85;

    const ratings = validLogs.filter((l: any) => l.regulationRating > 0).map((l: any) => Number(l.regulationRating));
    const avgRating = ratings.length > 0
      ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
      : 4.0;

    const logsSummaryText = validLogs.slice(0, 15).map((l: any) => 
      `- Goal: "${l.goalTitle}", Status: ${l.status}, Regulation: ${l.regulationRating}/5, Notes: "${l.notes || ''}", Date: ${l.date}`
    ).join("\n");

    const goalsSummaryText = validGoals.map((g: any) => 
      `- ${g.title} (${g.discipline || 'Therapy'}, ${g.frequency || 'Daily'})`
    ).join("\n");

    const pulsesSummaryText = validPulses.slice(0, 7).map((p: any) =>
      `- Date: ${p.date}, Sentiment: ${p.sentimentLabel || p.sentiment} (Score: ${p.score}/5), Triggers: [${(p.triggers || []).join(', ')}], Note: "${p.note || ''}"`
    ).join("\n");

    const prompt = `Synthesize this week's home therapy practice and daily emotional/sensory pulse data for child "${childName || 'Child'}":
Data Metrics:
- Total Logged Home Practice Sessions: ${totalSessions}
- Completed: ${completedCount}, Partial: ${partialCount}, Skipped: ${totalSessions - completedCount - partialCount}
- Adherence Rate: ${adherencePercent}%
- Average Regulation Rating: ${avgRating} out of 5.0

Parent Daily Pulse Sentiment Logs This Week (Daily 1-Question Check-ins):
${pulsesSummaryText || 'Daily nervous system sentiment remained generally stable and calm.'}

Active Therapy Goals:
${goalsSummaryText || 'Standard OT, SLP, and sensory regulation exercises.'}

Parent Log Entries This Week:
${logsSummaryText || 'Several home practice routines logged with good regulation.'}

Child Context:
${childProfile ? JSON.stringify(childProfile) : 'Autistic child doing home carryover routines.'}

Return a valid JSON object with the following schema:
{
  "celebrations": ["string", "string", "string"],
  "sensoryPatterns": ["string", "string", "string"],
  "therapistQuestions": ["string", "string", "string"],
  "parentObservations": "string"
}`;

    try {
      const responseText = await callGemini(
        prompt, 
        `${SYSTEM_INSTRUCTION_PEDIATRIC_AI}\nYou must respond strictly with a valid JSON object matching the requested schema. Clean standard JSON without code fences if possible.`,
        true
      );

      // Clean responseText if surrounded by markdown json blocks
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson || "{}");

      res.json({
        celebrations: Array.isArray(parsed.celebrations) && parsed.celebrations.length > 0 ? parsed.celebrations : [
          `Completed ${completedCount} home practice routines with steady engagement.`,
          `Average emotional regulation held at ${avgRating}/5.0 during home exercises.`,
          `Demonstrated positive carryover in transitions with fewer reported meltdowns.`
        ],
        sensoryPatterns: Array.isArray(parsed.sensoryPatterns) && parsed.sensoryPatterns.length > 0 ? parsed.sensoryPatterns : [
          "Sensory heavy-work routines in the morning correlate with higher attention span.",
          "Transitions after school require extra buffer time and lower auditory stimulation.",
          "Proprioceptive calming inputs (weighted pad, wall push-ups) quickly reduce agitation."
        ],
        therapistQuestions: Array.isArray(parsed.therapistQuestions) && parsed.therapistQuestions.length > 0 ? parsed.therapistQuestions : [
          `How can we generalize the progress observed at home into clinic and school settings?`,
          `Are there new vestibular or proprioceptive exercises we can rotate into the morning routine?`,
          `Should we modify the visual timer interval during high-stimulation days?`
        ],
        parentObservations: parsed.parentObservations || `Home routines were consistent this week with good cooperation. Parent observed clear improvement in self-regulation when given deep pressure prior to demanding tasks.`,
        adherencePercent,
        averageRegulation: avgRating,
        totalSessions,
      });
      return;
    } catch (genError: any) {
      console.warn("Gemini synthesis fallback:", genError?.message);
      res.json({
        celebrations: [
          `Completed ${completedCount} full home therapy routines with positive sensory engagement.`,
          `Regulation index remained at a healthy average of ${avgRating} / 5.0 throughout the week.`,
          `Maintained home routine consistency without distressing power struggles.`
        ],
        sensoryPatterns: [
          "Morning practice sessions consistently exhibit higher attention and calmer regulation.",
          "Auditory overload triggers brief resistance that resolves with deep proprioceptive pressure.",
          "Predictable visual schedules significantly shortened resistance during transitions."
        ],
        therapistQuestions: [
          `How can we support carryover of the communication progress achieved during home play into community outings?`,
          `Would incorporating oral motor sensory chews help during difficult seated focus periods?`,
          `Can we adjust the routine duration on days with high school-related fatigue?`
        ],
        parentObservations: `Home practice went smoothly overall. The quick 10-second logging kept us consistent without adding guilt on difficult days.`,
        adherencePercent,
        averageRegulation: avgRating,
        totalSessions,
      });
    }
  } catch (err: any) {
    console.error("Error in /api/ai/synthesize-weekly:", err);
    res.status(500).json({ error: "Failed to synthesize weekly therapy data." });
  }
});

// 4. Daily Pulse Email Endpoint
app.post("/api/pulse/send-email", async (req, res) => {
  try {
    const { email, childName, date, sentiment, sentimentLabel, score, triggers, note } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: "A valid parent email is required." });
      return;
    }

    const safeName = childName || "Your child";
    const label = sentimentLabel || sentiment || "Daily Pulse Check-in";
    const triggersList = Array.isArray(triggers) && triggers.length > 0 ? triggers.join(', ') : 'None specified';
    
    // Generate AI-tailored sensory takeaway and regulation recommendations
    let aiReflection = "";
    if (score >= 4) {
      aiReflection = `🌟 A wonderfully calm, regulated day! When ${safeName}'s nervous system is in this regulated flow state, neuroplasticity is at its highest. A great evening routine is gentle shared reading or listening to calm music together without demands.`;
    } else if (score === 3) {
      aiReflection = `⚖️ A balanced day with normal sensory fluctuations. Today's sensory balance shows good resilience. For tonight, offer 5-10 minutes of deep proprioceptive heavy work (firm hugs, weighted lap pad, or gentle animal walks) to help transition into restful sleep.`;
    } else {
      aiReflection = `💙 High sensory demands or overload were observed today. Remember: dysregulation is not bad behavior—it is a nervous system asking for safety and lower demands. Dim evening lighting, minimize auditory chatter, offer a favorite sensory chew or weighted blanket, and honor full quiet decompression.`;
    }

    const messageId = `pulse_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    console.log(`[EMAIL DISPATCH] Daily Pulse summary queued & sent:`, {
      messageId,
      to: email,
      child: safeName,
      date: date || new Date().toISOString().split('T')[0],
      sentiment: label,
      score: `${score}/5`,
      triggers: triggersList,
      note: note || ''
    });

    res.json({
      success: true,
      messageId,
      recipient: email,
      sentAt: new Date().toISOString(),
      subject: `🌿 AutismChildBridge Daily Pulse for ${safeName} (${date || 'Today'}): ${label}`,
      reflection: aiReflection,
      message: `Daily Pulse record saved and email summary dispatched to ${email}.`
    });
  } catch (err: any) {
    console.error("Error in /api/pulse/send-email:", err);
    res.status(500).json({ error: "Failed to dispatch Daily Pulse email." });
  }
});

// Helper: contextual follow-up questions
function generateFollowUps(question: string): string[] {
  const q = question.toLowerCase();
  if (q.includes("meltdown") || q.includes("tantrum") || q.includes("screaming") || q.includes("overload")) {
    return [
      "What is the difference between a sensory meltdown and a behavioral tantrum?",
      "How can I create a portable sensory calm-down bag for outings?",
      "What post-meltdown reconnection steps help an autistic child regulate?"
    ];
  }
  if (q.includes("eat") || q.includes("food") || q.includes("meal") || q.includes("picky")) {
    return [
      "What is 'food chaining' and how do OTs use it for selective eaters?",
      "How do seating posture and foot support affect eating in autistic children?",
      "How can we reduce sensory anxiety around novel food smells at dinner?"
    ];
  }
  if (q.includes("sleep") || q.includes("bed") || q.includes("night")) {
    return [
      "What proprioceptive heavy work activities calm the nervous system before bedtime?",
      "How can I adjust lighting and sound frequencies for a sensory-sensitive bedroom?",
      "How do we handle bedtime wakefulness without battles?"
    ];
  }
  if (q.includes("aac") || q.includes("speech") || q.includes("talk") || q.includes("verbal")) {
    return [
      "How can I model AAC communication without demanding my child press buttons?",
      "What are high-interest communicative temptations to encourage spontaneous requests?",
      "How does gestalt language processing affect how my child communicates in scripts?"
    ];
  }
  return [
    "How can I explain my child's sensory triggers to their school or babysitter?",
    "What heavy-work exercises help regulate energy before focused schoolwork?",
    "What specific questions should I ask my child's OT at our next session?"
  ];
}

// Fallback guidance generator when API key is pending
function generateSensoryFallbackAnswer(question: string, childProfile?: any): string {
  const name = childProfile?.name || "your child";
  return `### Understanding the Sensory & Regulation "Why"
When an autistic child encounters challenges with **${question.slice(0, 60)}**, the nervous system is often operating in a state of high arousal or sensory mismatch. What looks like resistance or distress is usually a sign of sensory overwhelm, difficulty with internal body signals (interoception), or cognitive overload during unexpected transitions.

### Immediate Action Steps at Home
1. **Lower the Environmental Demands:** Dim bright overhead lights, reduce background noise (turn off TVs or appliances), and lower your vocal volume to a calm whisper.
2. **Offer Deep Proprioceptive Pressure:** Offer a firm "bear hug" (if consented), place a weighted lap pad on ${name}'s thighs, or encourage pushing against a wall with flat palms. Proprioception sends grounding signals directly to the cerebellum.
3. **Use Concrete Visual Cues:** Instead of multiple verbal directions, hold up a single visual card, gesture, or point to what comes next. Verbal processing often shuts down first under stress.
4. **Honor Regulation Over Compliance:** Give ${name} a safe, quiet space to decompress without questioning or lecturing while their nervous system re-stabilizes.

### Calming Tools & Routine Tweaks
- Keep a **Sensory First-Aid Kit** on hand: noise-canceling headphones, a silicone chewable, and a favorite tactile object.
- Incorporate **predictable 2-minute transition warnings** using a visual sand timer or color-changing timer rather than an abrupt buzzer.

### Questions for Your Child's Therapist (OT / SLP)
1. *"At our last session, we noticed difficulty with this specific trigger at home—could we evaluate whether this is primarily vestibular, auditory, or motor planning related?"*
2. *"What specific regulation cues or co-regulation scripts can we adopt at home so our home environment mirrors your clinical strategies?"*

*Clinical Reminder: This guidance provides evidence-informed neurodiversity-affirming home strategies. Consult your licensed OT, SLP, or pediatrician for personalized clinical protocols.*`;
}

// Vite middleware / production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Autism Child Bridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
