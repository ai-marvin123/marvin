import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSimulation } from './controllers/initSimulation.js';
import OpenAI from 'openai';
import mongoose from 'mongoose';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mongoUri = process.env.MONGODB_URI;
try {
  await mongoose.connect(mongoUri as string);
} catch (error) {
  console.error('❌ MongoDB Connection Error:', error);
}

const app = express();
const PORT = process.env.PORT || 8080;

// In-memory session store
export const globalSessionStore: Record<
  string,
  { systemPrompt: string; history: any[] }
> = {};

app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Server is running successfully!');
});

// SIM CHAT POST ENDPOINT
app.post(
  '/api/chat/simulation',
  initializeSimulation,
  async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const session = res.locals.session;

      console.log('message ', message);
      console.log('session ', session);

      // Add user message to history
      session.history.push({
        role: 'user',
        content: message,
      });

      // Send to OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: session.systemPrompt },
          ...session.history,
        ],
      });

      const reply = completion.choices[0].message.content;

      console.log('reply ', reply);
      // Save AI reply to history
      session.history.push({
        role: 'assistant',
        content: reply,
      });

      // Return reply
      return res.status(200).json({ reply });
    } catch (err) {
      console.error('❌ Simulation error:', err);
      return res.status(500).json({ error: 'Simulation failed' });
    }
  }
);

// DELETE ENDPOINT
app.delete('/api/chat/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session Id' });
  }

  // Deletes the sessionId
  delete globalSessionStore[sessionId];

  return res.status(200).json({ message: 'Session reset successfully' });
});

// TEST ENDPOINT
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    message: 'Server is running successfully!',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
