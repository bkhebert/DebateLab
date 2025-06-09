import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface TopicAttributes {
  id?: number; // Auto-incremented by Sequelize
  name: string | null;
}

interface TopicInstance extends Model<TopicAttributes>, TopicAttributes {}

const Topic = database.define<TopicInstance>(
  'Topic',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Topic', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
    
  }
);

export default Topic;