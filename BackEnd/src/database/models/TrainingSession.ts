import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface TrainingSessionAttributes {
  id?: number;
  userId: number;
  topic: string;
  stance: 'for' | 'against';
  strength: number;
  overallScore: number;
  categories: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  fallacies: { name: string; quote: string; explanation: string }[];
  bestMoment: { quote: string; explanation: string } | null;
  weakestMoment: { quote: string; explanation: string; betterApproach: string } | null;
  summary: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TrainingSessionCreationAttributes extends Optional<
  TrainingSessionAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'bestMoment' | 'weakestMoment'
> {}

interface TrainingSessionInstance extends Model<TrainingSessionAttributes, TrainingSessionCreationAttributes>, TrainingSessionAttributes {}

// One row per graded practice debate - a lightweight history so a user's
// training progress is visible over time instead of vanishing once they
// leave the page. Holds the grade only, not the full transcript (the live
// transcript lives in Redis for the duration of the debate - see
// utils/trainingSessions.ts).
const TrainingSession = database.define<TrainingSessionInstance>(
  'TrainingSession',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stance: {
      type: DataTypes.ENUM('for', 'against'),
      allowNull: false,
    },
    strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    overallScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categories: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    strengths: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    weaknesses: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    improvements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    fallacies: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    bestMoment: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    weakestMoment: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'TrainingSession',
    timestamps: true,
  }
);

export default TrainingSession;
