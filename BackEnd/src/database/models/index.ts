import database from '../db.js';
import User from './User.js';
import Message from './Message.js';
import Topic from './Topic.js';
import PoliticalView from './PoliticalView.js';
import Reply from './Reply.js';
import UserPhilosophy from './UserPhilosophy.js';

// All associations go here:

Message.belongsTo(User, { foreignKey: 'userId' }); // UserId
User.hasMany(Message, { foreignKey: 'userId' });

Topic.hasMany(Message, { foreignKey: 'topicId' });
Message.belongsTo(Topic, { foreignKey: 'topicId' }); // TopicId

User.hasOne(PoliticalView, { foreignKey: 'email', sourceKey: 'email'});
PoliticalView.belongsTo(User, { foreignKey: 'email', targetKey: 'email'});

User.hasMany(Reply, { foreignKey: 'userId' });
Reply.belongsTo(User, { foreignKey: 'userId' }); // userId

Message.hasMany(Reply, { foreignKey: 'messageId', as: 'Replies'});
Reply.belongsTo(Message, { foreignKey: 'messageId' }); // messageId

User.hasMany(UserPhilosophy, {
  foreignKey: 'userId',
  as: 'philosophies',
});

UserPhilosophy.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export {
  database,
  User,
  UserPhilosophy,
  Topic,
  Message,
  PoliticalView,
  Reply,
};