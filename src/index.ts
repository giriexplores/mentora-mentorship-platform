import express, { Request, Response } from 'express';
import { PORT, NODE_ENV } from './config/env';
import errorMiddleware from './middlewares/error.middleware';
import { verifyDbConnection } from './config/db';
import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import lessonRouter from './routes/lesson.routes';
import sessionRouter from './routes/session.routes';
import bookingRouter from './routes/booking.routes';

const app = express();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Mentora API',
  });
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/bookings', bookingRouter);

// Global error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Starting server in ${NODE_ENV} mode`);
  await verifyDbConnection();
  console.log(`Server started at port: ${PORT}`);
});
