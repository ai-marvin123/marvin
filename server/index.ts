import express, { Request, Response, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSimulation } from './controllers/initSimulation.js';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import { retrieveFromMongo } from './controllers/mongooseController.ts';

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

type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

// In-memory session store
export const globalSessionStore: Record<
  string,
  { systemPrompt: string; history: any[] }
> = {};

app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.get('/api/scenarios', retrieveFromMongo, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.scenario);
});

app.get(
  '/api/scenarios/:id',
  retrieveFromMongo,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.scenario);
  }
);

// SIM CHAT POST ENDPOINT
app.post(
  '/api/chat/simulation',
  initializeSimulation,
  async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const session = res.locals.session;

      // console.log('message ', message);
      // console.log('session ', session);

      // Add user message to history
      session.history.push({
        role: 'user',
        content: message,
      });

      // Send to OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: session.systemPrompt },
          ...session.history,
        ],
      });

      const reply = completion.choices[0].message.content;

      console.log(session.history);

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

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Server is running successfully!');
});

const errorHandler: ErrorRequestHandler = (
  err: ServerError,
  _req,
  res,
  _next
) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj: ServerError = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
