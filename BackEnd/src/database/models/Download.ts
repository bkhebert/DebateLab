import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface DownloadAttributes {
  id?: number; // Auto-incremented by Sequelize
  extension: number | null;
}

interface DownloadCreationAttributes extends Optional<DownloadAttributes, 
  'id' | 'extension' > {}


interface DownloadInstance extends Model<DownloadAttributes>, DownloadAttributes {}

const Download = database.define<DownloadInstance>(
  'Download',
  {
    extension: {
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