import { RequestHandler } from 'express';
import Scenario from '../models/Scenario.js';

export const retrieveFromMongo: RequestHandler = async (_req, res, next) => {
  const { id = '691f4bcd93930601bbde6844' } = _req.params;

  console.log(id);

  try {
    const scenario = await Scenario.findById(id);
    // console.log(scenario);
    console.log(scenario?._id);

    res.locals.scenario = scenario;
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Failed to retrieve data from database' });
  }
};
