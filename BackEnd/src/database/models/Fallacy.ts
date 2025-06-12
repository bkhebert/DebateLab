import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface FallacyAttributes {
  id?: number; // Auto-incremented by Sequelize
  AppealToAuthority: number;
  AppealtoIgnorance: number;
  AppealtoPity: number;
  AppealtoEmotion: number;
  StrawManFallacy: number;
  SlipperySlopeFallacy: number;
  GeneticFallacy: number;
  FalseDilemma: number;
  CausationFallacy: number;
  Equivocation: number;
  HastyGeneralizations: number;
}

interface FallacyInstance extends Model<FallacyAttributes>, FallacyAttributes {}

const Fallacy = database.define<FallacyInstance>(
  'Fallacy',
  {
    AppealToAuthority: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    AppealtoIgnorance: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    AppealtoPity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AppealtoEmotion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    StrawManFallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    SlipperySlopeFallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    GeneticFallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    FalseDilemma: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    CausationFallacy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    Equivocation: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
    HastyGeneralizations: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
  },
  {
    tableName: 'Fallacy', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

export default Fallacy;