import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';
import User
 from './User.js';
interface PoliticalViewAttributes {
  id?: number; // Auto-incremented by Sequelize
  email: any;
  prochoice: string | null;
  immigration: string | null;
  environment: string | null;
  wealthinequality: string | null;
  transgender: string | null;
  orientation: string | null;
  religion: string | null;
}

interface PoliticalViewInstance extends Model<PoliticalViewAttributes>, PoliticalViewAttributes {}

const PoliticalView = database.define<PoliticalViewInstance>(
   'PoliticalView',
  {
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'email',
      }
    },
    prochoice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    immigration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    environment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wealthinequality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transgender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orientation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: 'PoliticalView', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

export default PoliticalView;