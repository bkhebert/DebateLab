import { Router }  from 'express';
import { User, Download } from '../database/models/index.js';
import dotenv from "dotenv";
dotenv.config();

const adminRouter = Router();

adminRouter.get('/count', async (req: any, res:  any) => {
  try {
    const download = await Download.findOne();
    if (!download) {
      return res.status(404).json({ extension: 0 });
    }
    res.json({ extension: download.extension });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch download count' });
  }
})

// Route to increment download count
adminRouter.post('/increment', async (req, res) => {
  try {
    let download = await Download.findOne();
    if (!download) {
      download = await Download.create({ extension: 1 });
    } else {
      download.extension = (download.extension || 0) + 1;
      await download.save();
    }
    res.json({ extension: download.extension });
  } catch (err) {
    res.status(500).json({ error: 'Failed to increment download count' });
  }
});

// Route to get total user count
adminRouter.get('/users/count', async (req, res) => {
  try {
    const userCount = await User.count();
    res.json({ users: userCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
});

export default adminRouter;
