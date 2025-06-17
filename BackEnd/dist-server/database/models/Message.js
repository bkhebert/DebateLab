import { DataTypes } from "sequelize";
import database from "../db.js";
const Message = database.define("Message", {
    content: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER || DataTypes.STRING,
        allowNull: true,
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
