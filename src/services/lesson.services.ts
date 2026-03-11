import { eq } from 'drizzle-orm';
import db from '../config/db';
import { lessons, type InsertLesson, type SelectLesson } from '../schema/lessons.schema';

/** Persist a new lesson record and return it. */
export async function createLesson(data: InsertLesson): Promise<SelectLesson> {
  const [lesson] = await db.insert(lessons).values(data).returning();
  return lesson;
}

/** Return true if a lesson with the given id exists (used before creating a booking). */
export async function lessonExists(lessonId: string): Promise<boolean> {
  const [lesson] = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.id, lessonId));
  return !!lesson;
}

