import { DataTypes } from "sequelize";
import database from "../db.js";
const Message = database.define("Message", {
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Topic", // or Topic if you prefer, but string with table name is common
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    userId: {
        type: DataTypes.INTEGER || DataTypes.STRING,
        allowNull: false,
        references: {
            model: "User", // or User if you prefer
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
}, {
    tableName: "Message", // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
});
export default Message;
