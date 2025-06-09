import { Router } from "express";

import { Message, PoliticalView, User, Reply } from "../database/models/index.js";

const messageRouter = Router();

/*
  POST /api/message
    - Send fact checked and neutralized message in request body with topic ID: { message: { content, topicId } }
    - Store message in database with topic ID and user ID
      - If the message is replying to a specific message, include the id of the message being replied to
    - Send status 201 for successful POST
*/
messageRouter.post('/', async (req: any, res: any) => {
  if (!req.body.message) { // Check for message object on req.body
    res.sendStatus(400);
  } else {
    const { message } = req.body;
    if (!message.content || !message.topicId) { // Check for content & topicId on message object
      res.sendStatus(400);
    } else {
      message.userId = req.user.id; // Add userId to message object using req.user.id
      try {
        await Message.create(message); // Insert message into Messages table
        res.sendStatus(201);
      } catch (error) {
        console.error('Failed to POST /api/message', error);
        res.sendStatus(500);
      }
    }
  }
});

/*
  GET /api/message/:topicId
    - Include the id of the topic in the path parameters
    - Search for messages from the topic
      - Order messages from newest to oldest
    - Set status 200
    - Send back the array of message objects
*/
messageRouter.get('/:topicId', async (req: any, res: any) => {
  const { topicId } = req.params;
  try {
    const messages = await Message.findAll({
      where: { topicId: +(topicId) },
      order: [
        ['createdAt', 'DESC'],
        [Reply, 'createdAt', 'ASC']
      ],
      include: [
        {
          model: User
        },
        {
          model: Reply,
          include:[{ model: User }],
          as: 'Reply'
        }
      ],
    });
    
    res.status(200).send(messages);
  } catch (error) {
    console.error('Failed to GET /api/message/:topicId ', error);
  }
});

/*
  POST /api/message/reply
    - Send fact checked and neutralized reply in request body with topic ID: { reply: { content, messageId } }
    - Store message in database with user ID and user ID
    - Send status 201 for successful POST
*/
messageRouter.post('/reply', async (req: any, res: any) => {
  if (!req.body.reply) {
    res.sendStatus(400);
  } else {
    const { reply } = req.body;
    if (!reply.content || !reply.messageId) {
      res.sendStatus(400);
    } else {
      reply.userId = req.user.id;
      try {
        await Reply.create(reply);
        res.sendStatus(201);
      } catch (error) {
        console.error('Failed POST /api/message/reply ', error);
        res.sendStatus(500);
      }
    }
  }
});

export default messageRouter;