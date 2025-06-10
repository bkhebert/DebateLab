import { DataTypes, Optional, Model } from "sequelize";
import database from "../db.js";

interface MessageAttributes {
  id?: number; // Auto-incremented by Sequelize
  content: string | null;
  topicId: number;
  userId: number;
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes {}

const Message = database.define<MessageInstance>(
  "Message",
  {
    content: {
      type: DataTypes.STRING,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User", // or User if you prefer
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Message", // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

export default Message;
