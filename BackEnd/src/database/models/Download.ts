import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface DownloadAttributes {
  id?: number; // Auto-incremented by Sequelize
  name: string | null;
  count: number | null;
}

interface DownloadCreationAttributes extends Optional<DownloadAttributes, 
  'id' | 'count' | 'name'> {}


interface DownloadInstance extends Model<DownloadAttributes>, DownloadAttributes {}

const Download = database.define<DownloadInstance>(
  'Download',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ensures one row per item type
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  
  {
    tableName: 'Download', // Explicitly specify table name
  }
);

export default Download;