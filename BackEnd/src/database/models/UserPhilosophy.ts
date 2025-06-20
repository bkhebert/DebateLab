import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface UserPhilosophyAttributes {
  id?: number;
  userId?: number;
  category: 'Philosophy' | 'Psychology' | 'Economics' | 'PoliticalTheory';
  subtopic: string;
  description?: string | null; // Optional elaboration
  keyThinkers?: string[] | null; // Array of names
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserPhilosophyCreationAttributes extends Optional<
  UserPhilosophyAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'description' | 'keyThinkers'
> {}

interface UserPhilosophyInstance extends Model<UserPhilosophyAttributes, UserPhilosophyCreationAttributes>, UserPhilosophyAttributes {}

const UserPhilosophy = database.define<UserPhilosophyInstance>(
  'UserPhilosophy',
  {
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
    category: {
      type: DataTypes.ENUM('Philosophy', 'Psychology', 'Religion & Spirituality', 'Science & Technology', 
        'Politics (US)', 'Politics (World)'
      ),
      
      allowNull: false,
    },
    subtopic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keyThinkers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    tableName: 'UserPhilosophy',
    timestamps: true,
  }
);

export default UserPhilosophy;
