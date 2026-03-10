import { eq } from 'drizzle-orm';
import db from '../config/db';
import { lessons, type InsertLesson, type SelectLesson } from '../schema/lessons.schema';

export async function createLesson(data: InsertLesson): Promise<SelectLesson> {
  const [lesson] = await db.insert(lessons).values(data).returning();
  return lesson;
}

export async function lessonExists(lessonId: string): Promise<boolean> {
  const [lesson] = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.id, lessonId));
  return !!lesson;
}
