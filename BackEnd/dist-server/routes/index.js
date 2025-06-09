// routes/index.ts
import { Router } from "express";
import rateLimitRouter from "./rateLimitRouter.js";
import messageRouter from "./messageRouter.js";
const apiRouter = Router();
apiRouter.use('/rate-limit', rateLimitRouter);
apiRouter.use('/message', messageRouter);
export default apiRouter;
