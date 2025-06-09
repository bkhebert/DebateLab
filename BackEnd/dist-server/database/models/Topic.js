import { DataTypes } from 'sequelize';
import database from '../db.js';
const Topic = database.define('Topic', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Topic', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
});
export default Topic;
