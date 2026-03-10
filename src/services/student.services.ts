import db from '../config/db';
import { and, eq } from 'drizzle-orm';
import { users, type PublicUser } from '../schema/users.schema';

type CreateStudentInput = {
  name: string;
  email: string;
  password: string;
  parentId: string;
};

const publicColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  parentId: users.parentId,
  createdAt: users.createdAt,
} as const;

export async function createStudent(data: CreateStudentInput): Promise<PublicUser> {
  const [student] = await db
    .insert(users)
    .values({ ...data, role: 'student' as const })
    .returning(publicColumns);
  return student;
}

export async function getStudentsByParent(parentId: string): Promise<PublicUser[]> {
  return db
    .select(publicColumns)
    .from(users)
    .where(and(eq(users.parentId, parentId), eq(users.role, 'student')));
}

export async function findStudentByIdAndParent(
  studentId: string,
  parentId: string,
): Promise<{ id: string } | undefined> {
  const [student] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, studentId), eq(users.parentId, parentId), eq(users.role, 'student')));
  return student;
}
