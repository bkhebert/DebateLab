import { Router } from "express";
import { Op } from "sequelize";
import { Message, PoliticalView, User, Reply, UserPhilosophy } from "../database/models/index.js";

const messageRouter = Router();

const authorInclude = {
  model: User,
  as: 'author' as const,
  attributes: ['id', 'username', 'school'],
  include: [
    {
      model: PoliticalView,
      attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
      required: false,
    },
    {
      model: UserPhilosophy,
      as: 'philosophies' as const,
      attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
      required: false,
    },
  ],
};

/*
  Fetches every reply belonging to a message as a flat list, then nests it
  into a tree by parentReplyId - unlike a fixed-depth Sequelize `include`,
  this supports replies-to-replies at any depth, not just one level.
*/
async function buildReplyTree(messageId: number) {
  const flatReplies = await Reply.findAll({
    where: { messageId },
    include: [authorInclude],
    order: [['createdAt', 'ASC']],
  });

  const plainReplies = flatReplies.map((reply) => reply.toJSON() as any);
  const byId = new Map<number, any>();
  plainReplies.forEach((reply) => {
    reply.children = [];
    byId.set(reply.id, reply);
  });

  const roots: any[] = [];
  plainReplies.forEach((reply) => {
    if (reply.parentReplyId && byId.has(reply.parentReplyId)) {
      byId.get(reply.parentReplyId).children.push(reply);
    } else {
      roots.push(reply);
    }
  });

  return roots;
}

async function attachReplyTrees(messages: any[]) {
  return Promise.all(
    messages.map(async (message) => {
      const plain = message.toJSON();
      plain.Replies = await buildReplyTree(plain.id);
      return plain;
    })
  );
}

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
    - :topic may be several sub-topics joined with "|" (e.g. picking a whole
      subject in the frontend's RightSideBar aggregates all of its sub-topics)
*/
messageRouter.get('/:topic', async (req, res) => {
  const { topic } = req.params;
  const topics = topic.includes('|') ? topic.split('|') : [topic];

  const posts = await Message.findAll({
    where: { topic: topics.length > 1 ? { [Op.in]: topics } : topics[0] },
    include: [authorInclude],
    order: [['createdAt', 'DESC']],
  });

  res.json(await attachReplyTrees(posts));
});

/*
  GET /api/message/single/:id
    - Fetch one message (with its full reply tree) by id - used to refresh
      a single post's thread after a reply is posted, without refetching
      the whole feed.
*/
messageRouter.get('/single/:id', async (req: any, res: any) => {
  try {
    const message = await Message.findByPk(req.params.id, { include: [authorInclude] });
    if (!message) return res.sendStatus(404);

    const [withReplies] = await attachReplyTrees([message]);
    res.json(withReplies);
  } catch (error) {
    console.error('Failed to GET /api/message/single/:id:', error);
    res.sendStatus(500);
  }
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
/*
  GET /api/message/all/recent
  - Fetch 10 most recent original posts (non-reply messages) across all topics
  - Include their replies and author metadata
*/
messageRouter.get('/all/recent', async (req, res) => {
  try {
    const posts = await Message.findAll({
      include: [authorInclude],
      order: [['createdAt', 'DESC']],
      limit: 10, // Only get 10 most recent
    });
    res.json(await attachReplyTrees(posts));
  } catch (error) {
    console.error('Failed to GET /api/message/all/recent:', error);
    res.sendStatus(500);
  }
});


export default messageRouter;
