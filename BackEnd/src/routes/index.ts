// routes/index.ts
import { Router } from "express";
import rateLimitRouter from "./rateLimitRouter.js";
import messageRouter from "./messageRouter.js";
import aiRouter from "./ai.js";
import politicalPhilosophyRouter from "./politicalPhilosophy.js";
import beliefsRouter from "./beliefs.js";
import schoolRouter from "./school.js";
import profileRouter from "./profile.js";
import adminRouter from "./admin.js";
import coverLetterGeneratorRouter from "./coverlettergenerator.js";
const apiRouter = Router();

apiRouter.use('/admin', adminRouter);
apiRouter.use('/generators', coverLetterGeneratorRouter)
apiRouter.use('/politicalPhilosophy', politicalPhilosophyRouter);
apiRouter.use('/beliefs', beliefsRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/rate-limit', rateLimitRouter);
apiRouter.use('/message', messageRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/schoolsofthought', schoolRouter);

export default apiRouter;