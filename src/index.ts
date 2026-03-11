import express, { Request, Response } from 'express';
import { PORT, NODE_ENV } from './config/env';
import errorMiddleware from './middlewares/error.middleware';
import { verifyDbConnection } from './config/db';
import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import lessonRouter from './routes/lesson.routes';
import sessionRouter from './routes/session.routes';
import bookingRouter from './routes/booking.routes';
import llmRouter from './routes/llm.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger';

const app = express();

app.use(express.json());

// Log every inbound request: method, path, response status, and duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

app.get('/', (_: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Mentora API',
    info: "visit /docs to access documentation",
  });
});

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/llm', llmRouter);

// Global error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Starting server in ${NODE_ENV} mode`);
  await verifyDbConnection();
  console.log(`Server started at port: ${PORT}`);
});
