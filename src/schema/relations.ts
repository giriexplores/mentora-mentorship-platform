import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { lessons } from './lessons.schema';
import { sessions } from './sessions.schema';
import { bookings } from './bookings.schema';

export const usersRelations = relations(users, ({ one, many }) => ({
  // Self-referential: a student's parent user
  parent: one(users, {
    fields: [users.parentId],
    references: [users.id],
    relationName: 'parentChildren',
  }),
  // Inverse: children (students) whose parentId points to this user
  children: many(users, {
    relationName: 'parentChildren',
  }),
  // Lessons created by this user (as a mentor)
  lessons: many(lessons),
  // Bookings made by this user (as a student)
  bookings: many(bookings),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  // The mentor who owns this lesson
  mentor: one(users, {
    fields: [lessons.mentorId],
    references: [users.id],
  }),
  // Sessions that belong to this lesson
  sessions: many(sessions),
  // Bookings for this lesson
  bookings: many(bookings),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // The lesson this session belongs to
  lesson: one(lessons, {
    fields: [sessions.lessonId],
    references: [lessons.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  // The student who made the booking
  student: one(users, {
    fields: [bookings.studentId],
    references: [users.id],
  }),
  // The lesson being booked
  lesson: one(lessons, {
    fields: [bookings.lessonId],
    references: [lessons.id],
  }),
}));
