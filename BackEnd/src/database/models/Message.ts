import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface MessageAttributes {
  id?: number; // Auto-incremented by Sequelize
  content: string | null;
  respondingTo: number | null;
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes {}

const Message = database.define<MessageInstance>(
  'Message',
  {
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respondingTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'Message', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
    
  }
);

export default Message;