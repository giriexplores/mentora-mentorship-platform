import db from '../config/db';
import { bookings, type InsertBooking, type SelectBooking } from '../schema/bookings.schema';

/** Persist a new booking record and return it. */
export async function createBooking(data: InsertBooking): Promise<SelectBooking> {
  const [booking] = await db.insert(bookings).values(data).returning();
  return booking;
}
