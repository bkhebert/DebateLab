import { Request, Response, NextFunction } from 'express';
import redisClient from '../utils/redis.js'; // adjust as needed

const rateLimitOnePerDay = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = `limit:${req.ip}`;
    const alreadyUsed = await redisClient.get(key);

    if (alreadyUsed) {
      res.status(429).json({ error: "Daily limit reached." });
      return;
    }

    await redisClient.set(key, '1', {
      EX: 86400, // expires in seconds
      });
    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export default rateLimitOnePerDay
