import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from './env';

// Singleton Drizzle client backed by the Neon serverless HTTP driver
const db = drizzle(DATABASE_URL);
export default db;

/** Run a trivial query to confirm the database is reachable at startup. */
export async function verifyDbConnection() {
  try {
    await db.execute('select 1');
    console.log('database connected successfully');
  } catch (error) {
    console.error('database connection failed!');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log('Unknown error occured');
    }
    process.exit(1);
  }
}
