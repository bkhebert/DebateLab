import { randomUUID } from 'crypto';
import redisClient from './redis.js';

export type Stance = 'for' | 'against';
export type Strength = 1 | 2 | 3 | 4 | 5;

export interface TrainingTurn {
  role: 'user' | 'model';
  text: string;
}

export interface TrainingSessionState {
  id: string;
  userId: number;
  topic: string;
  userStance: Stance;
  aiStance: Stance;
  strength: Strength;
  history: TrainingTurn[];
  status: 'active' | 'graded';
  createdAt: number;
}

// Server-controlled, ephemeral debate state. The frontend only ever sees a
// debateId - it never supplies topic/stance/strength/history on /turn or
// /grade, so there's nothing for a malicious client to forge. 1 hour of
// inactivity expires an abandoned debate; a finished (graded) debate's
// lasting record lives in Postgres's TrainingSession table instead.
const SESSION_TTL_SECONDS = 60 * 60;
const keyFor = (id: string) => `training:session:${id}`;

export async function createSession(
  userId: number,
  topic: string,
  userStance: Stance,
  strength: Strength
): Promise<TrainingSessionState> {
  const session: TrainingSessionState = {
    id: randomUUID(),
    userId,
    topic,
    userStance,
    aiStance: userStance === 'for' ? 'against' : 'for',
    strength,
    history: [],
    status: 'active',
    createdAt: Date.now(),
  };
  await redisClient.set(keyFor(session.id), JSON.stringify(session), { EX: SESSION_TTL_SECONDS });
  return session;
}

export async function getSession(id: string): Promise<TrainingSessionState | null> {
  const raw = await redisClient.get(keyFor(id));
  return raw ? (JSON.parse(raw.toString()) as TrainingSessionState) : null;
}

export async function saveSession(session: TrainingSessionState): Promise<void> {
  await redisClient.set(keyFor(session.id), JSON.stringify(session), { EX: SESSION_TTL_SECONDS });
}

export async function deleteSession(id: string): Promise<void> {
  await redisClient.del(keyFor(id));
}
