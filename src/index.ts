import express from 'express';
import { PORT, NODE_ENV } from './config/env';
import errorMiddleware from './middlewares/error.middleware';
import { verifyDbConnection } from './config/db';

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.json({
    success: true,
    message: 'Welcome to Mentora API',
  });
});

// Global error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Starting server in ${NODE_ENV} mode`);
  await verifyDbConnection();
  console.log(`Server started at port: ${PORT}`);
});
