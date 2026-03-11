import 'dotenv/config';
import z from 'zod';

// Validate all required environment variables at startup; crashes with a clear message if any are missing
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string().trim().min(1),
  GEMINI_API_KEY: z.string().trim().min(1),
  LLM_MODEL: z.string().trim().min(1).default('gemini-3-flash-preview'),
  JWT_SECRET: z.string().trim().min(1),
  PORT: z
    .string()
    .default('3000')
    .refine((val) => parseInt(val) > 0 && parseInt(val) < 65536, 'Invalid PORT number'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.log('Invalid environment variables: ');
  console.log(z.prettifyError(parsed.error));
  process.exit(1);
}

export const { NODE_ENV, PORT, DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, LLM_MODEL } = parsed.data;
export type Env = z.infer<typeof envSchema>;
