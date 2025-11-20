import { Request, Response, NextFunction } from 'express';
import Scenario from '../models/Scenario.js';
import { globalSessionStore } from '../index.js';

export const initializeSimulation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionId, scenarioId = '691f4bcd93930601bbde6844' } = req.body;

  // console.log('initializeSimulation ', sessionId, scenarioId);

  let session = globalSessionStore[sessionId];

  // console.log('session ', session);
  // console.log('globalSessionStore ', globalSessionStore);

  if (session) {
    res.locals.session = session;
    return next();
  }

  try {
    // console.log('Inside the try/catch!!!! - scenarioId', scenarioId);
    const scenario = await Scenario.findById(scenarioId);

    // console.log("scenario ", scenario);

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    const systemPrompt = `
    # ROLE
    You are a potential home buyer in a real estate roleplay simulation. 
    The User playing with you is the Real Estate Agent (Salesman). 
    You are strictly the CLIENT. Do not act as the agent.

    # YOUR PERSONA & CONTEXT
    ${scenario.context}
    (Internal Instruction: Fully adopt the personality traits described above. If the context says "guarded", be hesitant. If "friendly", be warm.)

    # THE SCENARIO
    You are currently in a consultation meeting with the Agent. The Agent is trying to win your trust and understand your needs.

    # USER'S OBJECTIVES (For your awareness)
    The Agent has a list of goals to achieve in this conversation. 
    **IMPORTANT:** Do NOT perform these tasks yourself. Instead, wait for the Agent to initiate them, and REACT naturally based on your persona:
    ${scenario.tasks.join('\n- ')}

    # INTERACTION GUIDELINES
    1. **Stay in Character:** Never admit you are an AI. Never mention "the script" or "tasks".
    2. **React Naturally:** - If the Agent is polite and consultative, open up and share information.
      - If the Agent is pushy or robotic, become more guarded or short with your answers.
    3. **Conversation Style:** Keep your responses conversational, realistic, and concise (1-3 sentences usually), just like a real person talking.
    4. **Let the User Lead:** Allow the Agent to drive the conversation. Answer their questions, but don't interview them.
    `;

    // Create session
    globalSessionStore[sessionId] = {
      systemPrompt,
      history: [],
    };

    res.locals.session = globalSessionStore[sessionId];

    return next();
  } catch (err) {
    console.error('Init Error:', err);
    return res.status(500).json({ error: 'Failed to initialize simulation' });
  }
};
