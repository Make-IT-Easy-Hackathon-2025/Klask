import express, { Request, Response, NextFunction } from 'express';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use((req, res, next) => {
  logger(`${req.method} ${req.url}`);
  next();
});

// Routes

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Klask!');
  });

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
