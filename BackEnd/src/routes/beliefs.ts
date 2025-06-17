import { Router } from "express";
import { isAuthenticated } from "../jwtAuth/isAuthenticated.js";
import { UserPhilosophy } from "../database/models/index.js";
const beliefsRouter = Router();

beliefsRouter.post('/updateBelief', isAuthenticated as any, async (req: any, res: any) => {
  const { text, selectedSub, category, user } = req.body;

  if (!user?.id || !selectedSub || !category) {
    return res.status(400).json({ error: 'Missing user, subtopic, or category' });
  }

  try {
    const existing = await UserPhilosophy.findOne({
      where: {
        userId: user.id,
        subtopic: selectedSub
      }
    });

    if (existing) {
      await existing.update({ description: text });
      return res.status(200).json({ message: 'Philosophy updated', updated: true, data: existing });
    } else {
      const newEntry = await UserPhilosophy.create({
        userId: user.id,
        category,
        subtopic: selectedSub,
        description: text
      });
      return res.status(201).json({ message: 'Philosophy created', created: true, data: newEntry });
    }
  } catch (err) {
    console.error('Error updating/creating UserPhilosophy:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

beliefsRouter.get('/getBeliefs', isAuthenticated as any, (req:any,res:any) => {
  UserPhilosophy.findAll({where: {userId: req.user.id}})
    .then((val) => {
      console.log('found all beliefs');
      console.log(val)
      console.log('above me is all the beliefs found');
      res.send(val).status(200);
    }).catch((err) => {
      console.error('failed to get all beliefs', err);
      res.sendStatus(500);
    })
} )

export default beliefsRouter;

/*


axios.post(`${baseURL}/api/beliefs/updateBelief`, {
      text,
      selectedSub,
      user
    }, 
*/