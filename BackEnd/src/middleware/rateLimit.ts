import { Request, Response, NextFunction } from 'express';
import redisClient from '../utils/redis.js'; // adjust as needed

const rateLimitOnePerDay = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = `limit:${req.ip}`; // Get their IP address
    const alreadyUsed = await redisClient.get(key); // Check and see if we set a key that matches this IP
    console.log('redisclient got this key: ', alreadyUsed);
    if (Number(alreadyUsed) > 5) { // Set this rate limit. It increments. 
      console.log('IP has reached a value larger than 5', alreadyUsed);
      res.status(429).json({ error: "Daily limit reached." });
      return;
    } else if(alreadyUsed){ // If the rate is not at limit, increment it's value
      await redisClient.set(key, String(Number(alreadyUsed) + 1), {
        EX: 86400, // key expires in seconds (1 day)
      });
    } else {
      await redisClient.set(key, '1', {
        EX: 86400, // key expires in seconds (1 day)
        });
    }

    await next();
  } catch (error) {
    console.error("Rate limit error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export default rateLimitOnePerDay
