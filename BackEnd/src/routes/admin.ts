import { Router }  from 'express';
import { User, Download } from '../database/models/index.js';
import dotenv from "dotenv";
dotenv.config();

const adminRouter = Router();

adminRouter.get('/count/:name', async (req: any, res:  any) => {
    const { name } = req.params;
    console.log('getting params for download name', req.params)
  try {
    const download = await Download.findOne({ where: { name } });

    if (!download) {
      console.log('couldnt find matching download');
      return res.status(404).json({ name, count: 0 });
    }
    console.log('found matching download')
    res.json({ name: download.name, count: download.count });
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch ${name} count` });
  }
})

// Route to increment download count
adminRouter.post('/increment/:name', async (req: any, res: any) => {
  const { name } = req.params;
  console.log('incrementing a count ')
  try {
    let download = await Download.findOne({ where: { name } });

    if (!download) {
      download = await Download.create({ name, count: 1 });
    } else {
      download.count += 1;
      await download.save();
    }
  console.log('incrementing a count is complete')
    res.json({ name: download.name, count: download.count });
  } catch (err) {
    res.status(500).json({ error: `Failed to increment ${name} count` });
  }
});

adminRouter.get('/all', async (req, res) => {
  try {
    const all = await Download.findAll();
    res.json(all); // array of { name, count }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all download stats' });
  }
});
// Route to get total user count
adminRouter.get('/users/count', async (req: any, res: any) => {
  console.log('getting user count')
  try {
    const userCount = await User.count();
    res.json({ users: userCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
});

export default adminRouter;
