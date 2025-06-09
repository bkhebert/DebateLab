// src/routes/arguments.ts
import express from 'express';
import { rateLimitOnePerDay } from '../middleware/rateLimit';

const rateLimitRouter = express.Router();

rateLimitRouter.post('/check-argument', rateLimitOnePerDay, async (req, res) => {
  const { argument } = req.body;

  // process the argument with your AI logic here...
  console.log('Received argument:', argument);

  res.json({ success: true, result: "AI's response here" });
});

export default rateLimitRouter;
