import { DataTypes } from 'sequelize';
import database from '../db.js';
const User = database.define('User', {
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
    philosophy: {
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
    }
}, {
    tableName: 'User', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
});
export default User;
