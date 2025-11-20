import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Server is running successfully!');
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    message: 'Server is running successfully!',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
