import { DataTypes, Optional, Model } from 'sequelize';
import database from '../db.js';

interface UserAttributes {
  id?: number; // Auto-incremented by Sequelize
  username: string | null;
  password: string | null;
  subscription: boolean | string | null;
  philosophy: string | null; // or a more specific type if you know the structure
  googleId: string | null;
  services: object | null; // or a more specific type
  email: string;
  tokenVersion: number;
  email_verified: boolean;
  email_verification_token: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  school: string | null,
  createdAt?: Date; // Added by Sequelize
  updatedAt?: Date; // Added by Sequelize
  philosophies?: any;
  PoliticalView?: any;
}

interface UserCreationAttributes extends Optional<UserAttributes, 
  'id' | 'createdAt' | 'updatedAt' | 'username' | 'password' | 
  'subscription' | 'philosophy' | 'googleId' | 'services' | 'school' |
  'email_verification_token' | 'stripeSubscriptionId' | 'stripeCustomerId'> {}


interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const User = database.define<UserInstance>(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription: {
      type: DataTypes.BOOLEAN || DataTypes.STRING,
      allowNull: true,
    },
    school: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    },
    services: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    tokenVersion: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
      email_verified: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: false, // Set default value to false
    },
    email_verification_token: {
      type: DataTypes.STRING,
      allowNull: true,  
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    philosophy: {
       type: DataTypes.STRING,
    },
  },
  
  {
    tableName: 'User', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
    
  }
);

export default User;