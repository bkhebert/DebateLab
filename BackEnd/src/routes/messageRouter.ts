import { Router } from "express";
import { Message, PoliticalView, User, Reply, UserPhilosophy } from "../database/models/index.js";

const messageRouter = Router();

/*
  POST /api/message
    - Create a new message (with optional anonymous user)
*/
messageRouter.post('/', async (req:any, res:any) => {
  let { content, topic, userId } = req.body;
  let backuptopic = "The Great Conversation"
  if (!content) {
    console.error('Missing content or topic in request body:', req.body);
    return res.sendStatus(400);
  }
  if(!topic){
    topic = backuptopic
  }
  try {
    await Message.create({
      content,
      topic,
      userId: userId || null, // Support anonymous
    });
    console.log('Message created');
    res.sendStatus(201);
  } catch (error) {
    console.error('Failed to POST /api/message:', error);
    res.sendStatus(500);
  }
});

/*
  GET /api/message/:topic
    - Fetch messages for a given topic, including nested replies and author metadata
*/
messageRouter.get('/:topic', async (req, res) => {
  const { topic } = req.params;

  const posts = await Message.findAll({
    where: { topic },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'school'],
        include: [
          {
            model: PoliticalView,
            attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
          },
          {
            model: UserPhilosophy,
            as: 'philosophies',
            attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
            required: false,
          },
        ],
      },
      {
        model: Reply,
        where: { parentReplyId: null },
        required: false,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'school'],
            include: [
              {
                model: PoliticalView,
                attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
                required: false,
              },
              {
                model: UserPhilosophy,
                as: 'philosophies',
                attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
              },
            ],
          },
          {
            model: Reply,
            as: 'children',
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'school'],
                include: [
                  {
                    model: PoliticalView,
                    attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
                  },
                  {
                    model: UserPhilosophy,
                    as: 'philosophies',
                    attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json(posts);
});

/*
  POST /api/message/reply
    - Create a new reply (supports nested replies and anonymous users)
*/
messageRouter.post('/reply', async (req:any, res:any) => {
  const { content, messageId, userId, parentReplyId } = req.body;

  if (!content || !messageId) {
    console.error('Missing content or messageId in reply:', req.body);
    return res.sendStatus(400);
  }

  try {
    const reply = await Reply.create({
      content,
      messageId,
      userId: userId || null, // Anonymous support
      parentReplyId: parentReplyId || null, // Nested support
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Failed to POST /api/message/reply:', error);
    res.sendStatus(500);
  }
});

export default messageRouter;
