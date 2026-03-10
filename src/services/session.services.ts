import db from '../config/db';
import { eq } from 'drizzle-orm';
import { sessions, type InsertSession, type SelectSession } from '../schema/sessions.schema';

export async function createSession(data: InsertSession): Promise<SelectSession> {
  const [session] = await db.insert(sessions).values(data).returning();
  return session;
}

export async function getSessionsByLesson(lessonId: string): Promise<SelectSession[]> {
  return db.select().from(sessions).where(eq(sessions.lessonId, lessonId));
}
