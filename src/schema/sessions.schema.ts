import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { lessons } from './lessons.schema';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id')
    .notNull()
    .references(() => lessons.id),
  date: timestamp('date').notNull(),
  topic: varchar('topic', { length: 256 }).notNull(),
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;
