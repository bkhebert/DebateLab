import { DataTypes } from 'sequelize';
import database from '../db.js';
const UserPhilosophy = database.define('UserPhilosophy', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('Philosophy', 'Psychology', 'Economics', 'PoliticalTheory', 'Morals', 'God', 'Love'),
        allowNull: false,
    },
    school: {
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
}, {
    tableName: 'UserPhilosophy',
    timestamps: true,
});
export default UserPhilosophy;
