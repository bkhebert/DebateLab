import { Router } from "express";
import { isAuthenticated } from "../jwtAuth/isAuthenticated.js";
import { User } from "../database/models/index.js";
const schoolRouter = Router();

schoolRouter.post('/', isAuthenticated as any, (req:any, res:any) => {
  const { school } = req.body;
  User.findOne({where: { id: req.user.id}})
    .then((val) => {
      if (!val) return res.status(404).json({ error: 'User not found' });
      val.update({school: school})
        .then(() => {
          console.log('successfully updated school for the user', school);
          res.sendStatus(200);
        }).catch((err) => {
          console.error('failed to update the val', err);
          res.sendStatus(500);
        })
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500);
    })
})

export default schoolRouter;
