import { DataTypes } from 'sequelize';
import database from '../db.js';
const Message = database.define('Message', {
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Message', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
});
export default Message;
