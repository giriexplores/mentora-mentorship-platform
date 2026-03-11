import db from '../config/db';
import { eq } from 'drizzle-orm';
import { users, type InsertUser, type SelectUser, type PublicUser } from '../schema/users.schema';

// Columns returned for public-facing responses (password is excluded)
const publicColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  parentId: users.parentId,
  createdAt: users.createdAt,
} as const;

/** Find a user by email, including the hashed password (used for login comparison). */
export async function findUserByEmail(email: string): Promise<SelectUser | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

/** Look up a user by ID, returning only public fields (password excluded). */
export async function findUserById(id: string): Promise<PublicUser | undefined> {
  const [user] = await db.select(publicColumns).from(users).where(eq(users.id, id));
  return user;
}

/** Insert a new user row and return the public representation. */
export async function createUser(data: InsertUser): Promise<PublicUser> {
  const [user] = await db.insert(users).values(data).returning(publicColumns);
  return user;
}

/** Return true if a user with the given email already exists (used for duplicate checks). */
export async function emailExists(email: string): Promise<boolean> {
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  return !!row;
}
