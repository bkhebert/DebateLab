import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { isAuthenticated } from '../jwtAuth/isAuthenticated.js';
import { createDailyRateLimiter } from '../middleware/rateLimit.js';
import { TrainingSession } from '../database/models/index.js';
import {
  createSession,
  getSession,
  saveSession,
  deleteSession,
  type TrainingSessionState,
  type Stance,
  type Strength,
} from '../utils/trainingSessions.js';
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY });
const trainingRouter = Router();

trainingRouter.use(isAuthenticated as any);

// Both a UX nudge (frontend disables input past this) and a server-side
// guard against someone scripting unlimited turns directly against the API.
const MAX_USER_TURNS = 6;

// Spans from "commits obvious fallacies" to "world-class philosopher" -
// training mode only works if the opponent's realistic range includes
// genuinely weak debaters, not just increasingly verbose strong ones.
const STRENGTH_META: Record<Strength, { label: string; description: string; instruction: string }> = {
  1: {
    label: 'Beginner',
    description: 'Weak reasoning, occasional obvious fallacies, easy to rebut.',
    instruction: "Debate like an inexperienced person: your reasoning is sometimes weak, you occasionally commit obvious logical fallacies (strawmanning, ad hominem, hasty generalizations, false dichotomies), you make unsupported assertions, you sometimes miss the implications of what's been said, you may fail to directly answer the user's strongest point, and you might repeat yourself. Don't make every sentence absurd - it should feel like a real, if weak, debater.",
  },
  2: {
    label: 'Casual',
    description: 'Reasonable arguments but no formal debate training.',
    instruction: "Debate like an average person who argues reasonably well but has no formal debate training: your arguments are understandable and sometimes backed by evidence or reasoning, but you occasionally make logical mistakes and may overlook the user's stronger counterarguments.",
  },
  3: {
    label: 'Competent',
    description: 'Coherent, direct engagement, real debate experience.',
    instruction: "Debate like someone with real debate experience: you make coherent arguments, engage directly with the user's claims, recognize their assumptions, use examples and counterexamples, generally avoid obvious fallacies, can expose weaknesses in their reasoning, and can defend your own previous claims.",
  },
  4: {
    label: 'Advanced',
    description: 'Strong rebuttals, steelmanning, exposes hidden assumptions.',
    instruction: "Debate like an experienced competitive debater: give strong rebuttals, steelman the user's argument before attacking it when appropriate, distinguish empirical claims from normative ones, detect hidden assumptions, use burden-of-proof reasoning, identify contradictions, construct strong counterexamples, anticipate likely responses, and stay consistent across the whole debate.",
  },
  5: {
    label: 'Expert',
    description: 'Elite, Socratic, philosophically rigorous - genuinely difficult.',
    instruction: "Debate like an elite philosopher with years of experience - this should be genuinely difficult, not just longer. Attack premises rather than only conclusions, recognize unstated assumptions, distinguish validity from soundness, identify ambiguity or equivocation, challenge epistemic justification, strategically pick the single strongest point rather than answering everything, use Socratic questioning when it's advantageous, steelman the user's argument before rebutting it, recognize burden-of-proof shifts, remember earlier concessions and use them later, expose contradictions between the user's current and previous statements, construct sophisticated counterexamples, concede minor points without surrendering the larger argument, avoid cheap rhetorical tricks, and force the user to clarify vague claims. You can still be wrong - you are not omniscient.",
  },
};

function buildSystemInstruction(topic: string, userStance: Stance, aiStance: Stance, strength: Strength) {
  return `You are participating in a practice debate on DebateLab as the user's opponent.

Topic: ${topic}
The user is arguing ${userStance} this topic. You must argue ${aiStance} - never the user's side, and never switch sides.
Your skill level for this debate is ${strength}/5 (${STRENGTH_META[strength].label}): ${STRENGTH_META[strength].instruction}

Rules you must always follow:
- Stay fully in character as the opponent. Never break character, never mention you are an AI, never mention this is practice.
- Respond to the user's actual argument - do not ignore it or change the subject.
- Do not coach, grade, or critique the user's argument during the debate (e.g. never say "that's a fallacy" or "good argument" or "you should improve...") unless such a remark would naturally be part of your own rebuttal. All coaching happens separately, after the debate ends.
- Maintain logical continuity: remember what you and the user have each said earlier in this conversation, don't contradict your own earlier claims, and you may concede a specific minor point if it's genuinely correct without abandoning your overall position.
- Never fabricate citations, studies, statistics, quotations, or historical facts. If you don't confidently know a specific source, make your argument without inventing one.
- Keep your response to roughly 1-4 paragraphs - only as long as necessary to properly answer the user's point. A higher skill level should mean better reasoning, not more text.
- Respond with ONLY your spoken reply as plain text - no labels, no markdown, no JSON.`;
}

function validateSetup(body: any): { topic: string; stance: Stance; strength: Strength; userArgument: string } | null {
  const { topic, stance, strength, userArgument } = body;
  if (typeof topic !== 'string' || !topic.trim()) return null;
  if (stance !== 'for' && stance !== 'against') return null;
  const parsedStrength = Number(strength);
  if (![1, 2, 3, 4, 5].includes(parsedStrength)) return null;
  if (typeof userArgument !== 'string' || !userArgument.trim()) return null;
  return { topic: topic.trim(), stance, strength: parsedStrength as Strength, userArgument: userArgument.trim() };
}

const toGeminiContents = (history: TrainingSessionState['history']) =>
  history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] }));

/*
  POST /api/training/start
    - Begins a new practice debate. The USER speaks first (their opening
      argument is required here) and the AI takes the opposite stance.
      Rate-limited to 3/day per account - this is the "3 debates" limit, not
      a per-message one, so it only applies here, not on every /turn.
*/
trainingRouter.post('/start', createDailyRateLimiter('training-start', 3), async (req: any, res: any) => {
  const setup = validateSetup(req.body);
  if (!setup) return res.sendStatus(400);
  const { topic, stance, strength, userArgument } = setup;

  if (process.env.TEST_AI === 'true') {
    const session = await createSession(req.user.id, topic, stance, strength);
    session.history.push({ role: 'user', text: userArgument });
    session.history.push({ role: 'model', text: `(test) Taking the ${session.aiStance} position at strength ${strength}: your opening argument is noted, but consider the opposing evidence here.` });
    await saveSession(session);
    return res.status(200).send({ debateId: session.id, aiStance: session.aiStance, reply: session.history[1].text });
  }

  try {
    const session = await createSession(req.user.id, topic, stance, strength);
    session.history.push({ role: 'user', text: userArgument });

    const { text } = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: toGeminiContents(session.history),
      config: { systemInstruction: buildSystemInstruction(topic, stance, session.aiStance, strength) },
    });
    if (typeof text !== 'string') {
      console.error('training /start: AI response text is not a string');
      return res.sendStatus(500);
    }

    session.history.push({ role: 'model', text: text.trim() });
    await saveSession(session);
    res.status(200).send({ debateId: session.id, aiStance: session.aiStance, reply: text.trim() });
  } catch (error) {
    console.error('Failed to POST /api/training/start:', error);
    res.sendStatus(500);
  }
});

/*
  POST /api/training/turn
    - Continues an already-started debate, identified only by debateId - the
      client never supplies topic/stance/strength/history here, so there's
      nothing for it to forge. The server loads the trusted session from
      Redis, verifies the caller owns it, and rejects it if already graded
      or past the turn limit. Not subject to the 3/day limit - that's about
      how many debates you can start, not how long one runs.
*/
trainingRouter.post('/turn', async (req: any, res: any) => {
  const { debateId, userArgument } = req.body;
  if (!debateId || typeof userArgument !== 'string' || !userArgument.trim()) {
    return res.sendStatus(400);
  }

  const session = await getSession(debateId);
  if (!session) return res.status(404).json({ error: 'This debate was not found or has expired.' });
  if (session.userId !== req.user.id) return res.status(403).json({ error: 'You do not have access to this debate.' });
  if (session.status !== 'active') return res.status(400).json({ error: 'This debate has already ended.' });

  const userTurnCount = session.history.filter((turn) => turn.role === 'user').length;
  if (userTurnCount >= MAX_USER_TURNS) {
    return res.status(400).json({ error: `This debate has reached its ${MAX_USER_TURNS}-turn limit - end it and get graded instead.` });
  }

  const trimmedArgument = userArgument.trim();

  if (process.env.TEST_AI === 'true') {
    session.history.push({ role: 'user', text: trimmedArgument });
    const reply = "(test) That's a fair point, but consider the opposing evidence here - this is a canned test response.";
    session.history.push({ role: 'model', text: reply });
    await saveSession(session);
    return res.status(200).send({ reply });
  }

  try {
    session.history.push({ role: 'user', text: trimmedArgument });

    const { text } = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: toGeminiContents(session.history),
      config: { systemInstruction: buildSystemInstruction(session.topic, session.userStance, session.aiStance, session.strength) },
    });
    if (typeof text !== 'string') {
      console.error('training /turn: AI response text is not a string');
      return res.sendStatus(500);
    }

    session.history.push({ role: 'model', text: text.trim() });
    await saveSession(session);
    res.status(200).send({ reply: text.trim() });
  } catch (error) {
    console.error('Failed to POST /api/training/turn:', error);
    res.sendStatus(500);
  }
});

const GRADE_CATEGORY_KEYS = [
  'argumentStructure', 'logicalReasoning', 'evidence', 'rebuttal',
  'responsiveness', 'counterarguments', 'clarity', 'consistency', 'persuasiveness',
] as const;

const GRADE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER },
    categories: {
      type: Type.OBJECT,
      properties: Object.fromEntries(GRADE_CATEGORY_KEYS.map((key) => [key, { type: Type.INTEGER }])),
      required: [...GRADE_CATEGORY_KEYS],
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
    fallacies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quote: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['name', 'quote', 'explanation'],
      },
    },
    bestMoment: {
      type: Type.OBJECT,
      properties: { quote: { type: Type.STRING }, explanation: { type: Type.STRING } },
      required: ['quote', 'explanation'],
    },
    weakestMoment: {
      type: Type.OBJECT,
      properties: { quote: { type: Type.STRING }, explanation: { type: Type.STRING }, betterApproach: { type: Type.STRING } },
      required: ['quote', 'explanation', 'betterApproach'],
    },
    summary: { type: Type.STRING },
  },
  required: ['overallScore', 'categories', 'strengths', 'weaknesses', 'improvements', 'fallacies', 'bestMoment', 'weakestMoment', 'summary'],
};

function isValidGrade(grade: any): boolean {
  if (!grade || typeof grade !== 'object') return false;
  if (typeof grade.overallScore !== 'number') return false;
  if (!grade.categories || GRADE_CATEGORY_KEYS.some((key) => typeof grade.categories[key] !== 'number')) return false;
  if (!Array.isArray(grade.strengths) || !Array.isArray(grade.weaknesses) || !Array.isArray(grade.improvements)) return false;
  if (!Array.isArray(grade.fallacies)) return false;
  if (!grade.bestMoment || !grade.weakestMoment) return false;
  if (typeof grade.summary !== 'string') return false;
  return true;
}

function buildEvaluatorPrompt(session: TrainingSessionState) {
  const transcript = session.history.map((turn) => `${turn.role === 'user' ? 'User' : 'Opponent'}: ${turn.text}`).join('\n');
  return `You are an expert debate coach evaluating a practice debate transcript from DebateLab.

Topic: ${session.topic}
The User argued ${session.userStance}. The Opponent (AI) argued ${session.aiStance} at skill level ${session.strength}/5 (${STRENGTH_META[session.strength].label}).

Transcript:
${transcript}

Evaluate ONLY the User's debating performance - not whether their position on the topic is correct, and not the Opponent's performance. Judge the quality of their debating across these categories (score each 1-10): argument structure, logical reasoning, evidence/support, rebuttal quality, responsiveness, handling of counterarguments, clarity, consistency, and persuasiveness.

Someone who held their own against a higher-skill opponent deserves credit for that, but do not inflate the raw category scores simply because the opponent's difficulty was high - the opponent's difficulty is shown to the user separately in the UI, so keep debate-skill assessment and opponent difficulty conceptually separate.

For fallacies, quote the user's exact words where a fallacy occurred and name/explain it - if none occurred, return an empty array. Identify the user's single best moment and single weakest moment with exact quotes, an explanation, and (for the weakest moment) a better approach they could have taken.

overallScore should be 0-100, a holistic combination of the category scores.`;
}

/*
  POST /api/training/grade
    - Switches Gemini from opponent to evaluator for this debate, identified
      only by debateId (same ownership checks as /turn). Not subject to the
      3/day limit - grading a debate you already started shouldn't cost you
      one of your 3 debates. Persists the result to Postgres (the lasting
      training-history record) and clears the Redis session.
*/
trainingRouter.post('/grade', async (req: any, res: any) => {
  const { debateId } = req.body;
  if (!debateId) return res.sendStatus(400);

  const session = await getSession(debateId);
  if (!session) return res.status(404).json({ error: 'This debate was not found or has expired.' });
  if (session.userId !== req.user.id) return res.status(403).json({ error: 'You do not have access to this debate.' });
  if (!session.history.some((turn) => turn.role === 'user')) return res.sendStatus(400);

  const persistAndRespond = async (grade: any) => {
    try {
      await TrainingSession.create({
        userId: req.user.id,
        topic: session.topic,
        stance: session.userStance,
        strength: session.strength,
        overallScore: grade.overallScore,
        categories: grade.categories,
        strengths: grade.strengths,
        weaknesses: grade.weaknesses,
        improvements: grade.improvements,
        fallacies: grade.fallacies,
        bestMoment: grade.bestMoment,
        weakestMoment: grade.weakestMoment,
        summary: grade.summary,
      });
    } catch (error) {
      // A failed history write shouldn't block the user from seeing their grade.
      console.error('Failed to save TrainingSession:', error);
    }
    await deleteSession(debateId);
    res.status(200).send(grade);
  };

  if (process.env.TEST_AI === 'true') {
    return persistAndRespond({
      overallScore: 74,
      categories: { argumentStructure: 7, logicalReasoning: 8, evidence: 6, rebuttal: 7, responsiveness: 8, counterarguments: 6, clarity: 8, consistency: 7, persuasiveness: 7 },
      strengths: ['Clear thesis statement', 'Used a concrete example to back up a claim'],
      weaknesses: ['Did not address the strongest counterargument', 'One claim lacked supporting evidence'],
      improvements: ['Try steelmanning your opponent before rebutting them', 'Cite a specific source or statistic next time'],
      fallacies: [{ name: 'Hasty Generalization', quote: '(test) example quote', explanation: '(test) This is a canned test response explaining the fallacy.' }],
      bestMoment: { quote: '(test) your strongest line', explanation: '(test) This directly addressed the opponent\'s core claim.' },
      weakestMoment: { quote: '(test) a weaker line', explanation: '(test) This left an opening unaddressed.', betterApproach: '(test) Address the counterargument directly before moving on.' },
      summary: 'This is a canned test response: a solid first attempt with a clear position, but there is room to engage more directly with counterarguments.',
    });
  }

  try {
    const { text } = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: buildEvaluatorPrompt(session),
      config: { responseMimeType: 'application/json', responseSchema: GRADE_RESPONSE_SCHEMA as any },
    });
    if (typeof text !== 'string') {
      console.error('training /grade: AI response text is not a string');
      return res.sendStatus(500);
    }

    const fenceMatch = text.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    const grade = JSON.parse(fenceMatch ? fenceMatch[1] : text.trim());

    if (!isValidGrade(grade)) {
      console.error('training /grade: AI response failed schema validation', grade);
      return res.sendStatus(500);
    }

    await persistAndRespond(grade);
  } catch (error) {
    console.error('Failed to POST /api/training/grade:', error);
    res.sendStatus(500);
  }
});

/*
  GET /api/training/history
    - A user's past graded practice debates, most recent first, so training
      progress is visible across sessions instead of disappearing on refresh.
*/
trainingRouter.get('/history', async (req: any, res: any) => {
  try {
    const sessions = await TrainingSession.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Failed to GET /api/training/history:', error);
    res.sendStatus(500);
  }
});

export default trainingRouter;
