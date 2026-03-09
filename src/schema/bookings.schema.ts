import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users.schema';
import { lessons } from './lessons.schema';

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  // studentId references a user row with role="student"
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id),
  lessonId: uuid('lesson_id')
    .notNull()
    .references(() => lessons.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);

export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;
