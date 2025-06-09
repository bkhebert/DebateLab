import database from '../db.js';
import User from './User.js';
import UserPhilosophy from './UserPhilosophy.js';
import Message from './Message.js';
import Topic from './Topic.js';
import PoliticalView from './PoliticalView.js';
import Reply from './Reply.js';
// All associations go here:
User.hasMany(UserPhilosophy, {
    foreignKey: 'userId',
    as: 'philosophies',
});
UserPhilosophy.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
Message.belongsTo(User); // UserId
User.hasMany(Message);
Message.belongsTo(Topic, { foreignKey: 'topicId' }); // TopicId
Topic.hasMany(Message, { foreignKey: 'topicId' });
User.hasOne(PoliticalView, { foreignKey: 'email', sourceKey: 'email' });
PoliticalView.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });
Reply.belongsTo(User); // userId
User.hasMany(Reply);
Reply.belongsTo(Message); // messageId
Message.hasMany(Reply, { as: 'Replies' });
export { database, User, UserPhilosophy, Topic, Message, PoliticalView, Reply, };
