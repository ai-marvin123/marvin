import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Scenario from "../models/Scenario.js";
import { globalSessionStore } from "../index.js";

export const initializeSimulation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionId, scenarioId } = req.body;

  console.log("initializeSimulation ", sessionId, scenarioId);

  // If session already exists, attach it and continue
  if (!globalSessionStore[sessionId]) {
    // globalSessionStore.
  }
  let session = globalSessionStore[sessionId];

  console.log("session ", session);
  console.log("globalSessionStore ", globalSessionStore);

  if (session) {
    res.locals.session = session;
    return next();
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri as string);

    console.log("Inside the try/catch!!!! - scenarioId", scenarioId);
    const scenario = await Scenario.findById(scenarioId);

    // console.log("scenario ", scenario);
    mongoose.connection.close();

    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    const systemPrompt = `
You are a real estate client in this scenario.

Context:
${scenario.context}

Tasks that user already learned:
${scenario.tasks}

Stay in character. Do NOT break role.
`;

    // Create session
    globalSessionStore[sessionId] = {
      systemPrompt,
      history: [],
    };

    res.locals.session = globalSessionStore[sessionId];

    return next();
  } catch (err) {
    console.error("Init Error:", err);
    return res.status(500).json({ error: "Failed to initialize simulation" });
  }
};
