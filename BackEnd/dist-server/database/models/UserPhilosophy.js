import { DataTypes } from 'sequelize';
import database from '../db.js';
const UserPhilosophy = database.define('UserPhilosophy', {
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
        type: DataTypes.ENUM('Philosophy', 'Psychology', 'Religion & Spirituality', 'Science & Technology', 'Politics (US)', 'Politics (World)'),
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
}, {
    tableName: 'UserPhilosophy',
    timestamps: true,
});
export default UserPhilosophy;
