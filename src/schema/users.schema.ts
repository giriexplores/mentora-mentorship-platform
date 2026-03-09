import { pgTable, text, timestamp, uuid, varchar, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { userRole } from './enums.schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: text('password').notNull(),
  role: userRole('role').notNull(),
  // Only populated for students — references the parent user
  parentId: uuid('parent_id').references((): AnyPgColumn => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type PublicUser = Omit<SelectUser, 'password'>;

// student
export type SelectStudent = SelectUser & { role: 'student' };
export type InsertStudent = Omit<InsertUser, 'role'> & { role: 'student' };
