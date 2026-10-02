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

// rateLimitOnePerDay's Redis key is keyed only by IP with a hardcoded limit,
// so it can't be reused as-is without sharing its counter with every other
// route that imports it. This factory makes a route its own key (so e.g.
// training mode usage doesn't eat into the fallacy checker's daily limit or
// vice versa) and keys by the authenticated user id when available, falling
// back to IP for anonymous routes.
//
// Fixed 24-hour window per user: the key's TTL is set once, on the first use,
// and preserved (KEEPTTL) on every subsequent increment. rateLimitOnePerDay's
// own pattern re-sets EX on every increment instead, which means a user who
// acts every few hours can keep their window alive indefinitely - that's not
// replicated here.
export function createDailyRateLimiter(keyPrefix: string, limit: number) {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = req.user?.id ?? req.ip;
      const key = `limit:${keyPrefix}:${identifier}`;
      const alreadyUsed = await redisClient.get(key);
      if (Number(alreadyUsed) >= limit) {
        const ttl = Number(await redisClient.ttl(key));
        res.status(429).json({
          error: "Daily limit reached.",
          retryAfterSeconds: ttl > 0 ? ttl : 86400,
        });
        return;
      } else if (alreadyUsed) {
        await redisClient.set(key, String(Number(alreadyUsed) + 1), { KEEPTTL: true });
      } else {
        await redisClient.set(key, '1', { EX: 86400 });
      }
      await next();
    } catch (error) {
      console.error("Rate limit error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
}
