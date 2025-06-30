import database from '../db.js';
import User from './User.js';
import Message from './Message.js';
import Topic from './Topic.js';
import PoliticalView from './PoliticalView.js';
import Reply from './Reply.js';
import UserPhilosophy from './UserPhilosophy.js';
import Download from './Download.js';
// All associations go here:
Message.belongsTo(User, { foreignKey: 'userId', as: 'author' }); // UserId
User.hasMany(Message, { foreignKey: 'userId' });
User.hasOne(PoliticalView, { foreignKey: 'email', sourceKey: 'email' });
PoliticalView.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });
User.hasMany(Reply, { foreignKey: 'userId' });
Reply.belongsTo(User, { foreignKey: 'userId', as: 'author' }); // userId
Message.hasMany(Reply, { foreignKey: 'messageId' });
Reply.belongsTo(Message, { foreignKey: 'messageId' }); // messageId
Reply.belongsTo(Reply, { foreignKey: 'parentReplyId', as: 'parent' });
Reply.hasMany(Reply, { foreignKey: 'parentReplyId', as: 'children' });
User.hasMany(UserPhilosophy, {
    foreignKey: 'userId',
    as: 'philosophies',
});
UserPhilosophy.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
export { database, User, UserPhilosophy, Topic, Message, PoliticalView, Reply, Download, };
