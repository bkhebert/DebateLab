import { Router } from "express";
import { isAuthenticated } from "../jwtAuth/isAuthenticated.js";
import { User } from "../database/models/index.js";
const schoolRouter = Router();

schoolRouter.post('/', isAuthenticated as any, (req:any, res:any) => {
  const { school } = req.body;
  User.findOne({where: { id: req.user.id}})
    .then((val) => {
      val.update({school: school})
        .then(() => {
          console.log('successfully updated school for the user', school);
        }).catch((err) => {
          console.error('failed to update the val', err);
        })
    })
    .catch((err) => {
      console.error(err)
    })
})

export default schoolRouter;
