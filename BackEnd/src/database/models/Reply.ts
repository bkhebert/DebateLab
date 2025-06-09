import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface ReplyAttributes {
  id?: number; // Auto-incremented by Sequelize
  content: string | null;
}

interface ReplyInstance extends Model<ReplyAttributes>, ReplyAttributes {}

const Reply = database.define<ReplyInstance>(
  'Reply',
  {
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Reply', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
    
  }
);

export default Reply;