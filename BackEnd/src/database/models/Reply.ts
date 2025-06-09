import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface ReplyAttributes {
  id?: number; // Auto-incremented by Sequelize
  content: string | null;
  userId: number;
  messageId: number;
}

interface ReplyInstance extends Model<ReplyAttributes>, ReplyAttributes {}

const Reply = database.define<ReplyInstance>(
  'Reply',
  {
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User", // or Topic if you prefer, but string with table name is common
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",      
    },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      references: {
        model: "Message", // or Topic if you prefer, but string with table name is common
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      }
  },
  {
    tableName: 'Reply', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
    
  }
);

export default Reply;