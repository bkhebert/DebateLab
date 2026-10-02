// Removes everything seedDemoData.ts created - all users whose email starts
// with "demo_", plus their PoliticalView, Message, and Reply rows. Never
// touches real accounts, since those don't use the "demo_" email prefix.
import { Op } from "sequelize";
import { database, User, PoliticalView, Message, Reply } from "../models/index.js";

async function main() {
  try {
    const demoUsers = await User.findAll({ where: { email: { [Op.like]: "demo_%" } } });
    const userIds = demoUsers.map((u: any) => u.id);
    const emails = demoUsers.map((u: any) => u.email);

    if (userIds.length === 0) {
      console.log("No demo users found - nothing to clean.");
      return;
    }

    const messages = await Message.findAll({ where: { userId: { [Op.in]: userIds } } });
    const messageIds = messages.map((m: any) => m.id);

    const repliesDeleted = await Reply.destroy({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: userIds } },
          { messageId: { [Op.in]: messageIds } },
        ],
      },
    });
    const messagesDeleted = await Message.destroy({ where: { userId: { [Op.in]: userIds } } });
    const viewsDeleted = await PoliticalView.destroy({ where: { email: { [Op.in]: emails } } });
    const usersDeleted = await User.destroy({ where: { id: { [Op.in]: userIds } } });

    console.log(`✅ Cleaned up: ${usersDeleted} users, ${viewsDeleted} political views, ${messagesDeleted} posts, ${repliesDeleted} replies.`);
  } catch (error) {
    console.error("❌ Failed to clean demo data:", error);
  } finally {
    await database.close();
  }
}

main();
