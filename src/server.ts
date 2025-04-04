import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from "@prisma/client";
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import attractionRoutes from './routes/attractionRoutes';
import favouriteRoutes from './routes/favouriteRoutes';
import { authenticateUser } from './middleware/auth';

export const prisma = new PrismaClient();

const app = express();
const port = 3004;

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../../../uploads')));


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors(corsOptions)); 

// Mounting routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api',authenticateUser, attractionRoutes);
app.use('/api', authenticateUser, favouriteRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!!');
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', (err?: Error) => {
    if (err) {
      console.error('Error starting server:', err);
    } else {
      console.log(`Example app listening on port ${port}`);
      console.log('Routes mounted');
    }
  });
} else {
  console.log('Server is not started in test environment');
}
