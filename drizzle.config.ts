import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './src/config/env';

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  schema: 'src/schema',
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
