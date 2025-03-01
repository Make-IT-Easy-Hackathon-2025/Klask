import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from './utils/logger';
import userRoutes from './routes/userRoutes'
import groupRoutes from './routes/groupRoutes'
import challengeRoutes from './routes/challengeRoutes';
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

app.use((req, res, next) => {
  logger(`${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin:'*', // Your React app's URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Klask!');
  });

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});


app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/challenges", challengeRoutes);

export default app;
