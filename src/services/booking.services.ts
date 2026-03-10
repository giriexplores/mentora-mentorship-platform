import db from '../config/db';
import { bookings, type InsertBooking, type SelectBooking } from '../schema/bookings.schema';

export async function createBooking(data: InsertBooking): Promise<SelectBooking> {
  const [booking] = await db.insert(bookings).values(data).returning();
  return booking;
}
