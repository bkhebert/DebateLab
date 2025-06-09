import database from '../db.js';
import User from './User.js';
import UserPhilosophy from './UserPhilosophy.js';

// All associations go here:
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
  UserPhilosophy
};