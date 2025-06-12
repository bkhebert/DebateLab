import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface FallacyAttributes {
  id?: number; // Auto-incremented by Sequelize
  title: string;
  appealtoauthority: number;
  appealtoignorance: number;
  appealtopity: number;
  appealtoemotion: number;
  strawmanfallacy: number;
  slipperyslopefallacy: number;
  geneticfallacy: number;
  falsedilemma: number;
  causationfallacy: number;
  equivocation: number;
  hastygeneralization: number;
  unknown: number;
  total: number;
}

interface FallacyInstance extends Model<FallacyAttributes>, FallacyAttributes {}

const Fallacy = database.define<FallacyInstance>(
  'Fallacy',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appealtoauthority: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    appealtoignorance: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    appealtopity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    appealtoemotion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    strawmanfallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    slipperyslopefallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    geneticfallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    falsedilemma: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    causationfallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    equivocation: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    hastygeneralization: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    },
    unknown: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    }
  },
  {
    tableName: 'Fallacy', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

export default Fallacy;