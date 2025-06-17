import { Router } from 'express';
import { isAuthenticated } from '../jwtAuth/isAuthenticated.js';
import { User, PoliticalView, UserPhilosophy } from '../database/models/index.js';

const profileRouter = Router();

profileRouter.get('/me/data', isAuthenticated as any, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    console.log(req.user)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: PoliticalView,
          attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
        },
        {
          model: UserPhilosophy,
          as: 'philosophies',
          attributes: ['subtopic', 'description'],
        },
      ],
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: user.username,
      politicalViews: user.PoliticalView,
      philosophies: user.philosophies,
    });
  } catch (err) {
    console.error('Failed to fetch user profile data:', err);
    res.sendStatus(500);
  }
});

export default profileRouter;
