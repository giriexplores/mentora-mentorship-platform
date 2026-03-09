import db from '../config/db';
import { eq } from 'drizzle-orm';
import { users, type InsertUser, type SelectUser, type PublicUser } from '../schema/users.schema';

const publicColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  parentId: users.parentId,
  createdAt: users.createdAt,
} as const;

export async function findUserByEmail(email: string): Promise<SelectUser | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function findUserById(id: string): Promise<PublicUser | undefined> {
  const [user] = await db.select(publicColumns).from(users).where(eq(users.id, id));
  return user;
}

export async function createUser(data: InsertUser): Promise<PublicUser> {
  const [user] = await db.insert(users).values(data).returning(publicColumns);
  return user;
}

export async function emailExists(email: string): Promise<boolean> {
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  return !!row;
}
