import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from './env';

const db = drizzle(DATABASE_URL);
export default db;
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
