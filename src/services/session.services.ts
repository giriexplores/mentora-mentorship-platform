import db from '../config/db';
import { eq } from 'drizzle-orm';
import { sessions, type InsertSession, type SelectSession } from '../schema/sessions.schema';

/** Persist a new session and return it. */
export async function createSession(data: InsertSession): Promise<SelectSession> {
  const [session] = await db.insert(sessions).values(data).returning();
  return session;
}

/** Return all sessions for a given lesson, ordered by insertion (ascending by default). */
export async function getSessionsByLesson(lessonId: string): Promise<SelectSession[]> {
  return db.select().from(sessions).where(eq(sessions.lessonId, lessonId));
}
