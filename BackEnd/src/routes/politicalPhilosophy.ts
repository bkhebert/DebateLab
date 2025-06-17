import { Router } from "express";
import { User } from "../database/models/index.js";
import { PoliticalView } from "../database/models/index.js";
import { isAuthenticated } from "../jwtAuth/isAuthenticated.js";
const politicalPhilosophyRouter = Router();

politicalPhilosophyRouter.get('/getTopics', isAuthenticated as any, (req: any, res: any) => {
  console.log(req.user.dataValues.email, 'on the req')
  PoliticalView.findOrCreate(
    {
      where: {
        email: req.user.dataValues.email,
      },
    }
  ).then((value) => {
    console.log(value)
    console.log('success getting poliview')
    res.status(200).send(value);
  }).catch((err) => {
    console.error('failed getting poliview', err)
    res.sendStatus(404);
  })
})

politicalPhilosophyRouter.post('/UpdateView', isAuthenticated as any, (req: any, res: any) => {
  const { body } = req.body;
  const { topic, views } = body;
  console.log(topic)
  console.log(views)
  const stringViews = JSON.stringify(views);
  PoliticalView.findOrCreate(
    {
      where: {
        email: req.user.dataValues.email,
      }
    },
  ).then((value) => {
    console.log(topic);
    value[0].update({ [topic]: stringViews})
    .then((updated) => {
      console.log(updated, 'Successfully updated politicalView Table from PhilosophyRouter UpdateView Route')
      res.sendStatus(201)
    }).catch((error) => {
      console.error('FAIL PoliticalPhilosophyRouter, UpdateView Route')
      res.sendStatus(500);
    }).catch((error) => {
      console.error('FAIL to findOrCreate Political View w/ matching email')
      res.sendStatus(500);
    })
  })
})

  politicalPhilosophyRouter.get('/flairs', (req, res) => {
    console.log(req.query, 'the query is received')
    PoliticalView.findOrCreate(
      {
        where: {
          email: req.query.email,
        },
      }
    ).then((value) => {
      console.log(value)
      console.log('success getting their views for the message flairs')
      res.status(200).send(value);
    }).catch((err) => {
      console.error('failed getting their views for the message flairs', err)
      res.sendStatus(404);
    })
  })

export default politicalPhilosophyRouter;