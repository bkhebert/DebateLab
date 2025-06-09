import express from "express";
import dotenv from "dotenv";
import sequelize from "./database/db.js";
import {User, UserPhilosophy } from "./database/models/index.js";
import database from "./database/db.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from DebateLab backend");
});

app.listen(PORT, async () => {
  if (process.env.SKIP_DB === 'true') {
    console.log('⚠️ Skipping database sync due to SKIP_DB=true');
  } else {
    try {
      await database.sync(); // set to alter true
      console.log('Successfully connected to the database');
      const testUserPhilosophy = async () => {
  try {

    // Create a user
    const newUser = await User.create({
      username: 'debate_hero3232', // replace with your actual user schema fields
      email: 'debate3322@example.com',
      password: 'secure12332', // ideally hashed in real use
      tokenVersion: 0, 
      email_verified: false 
    });

    console.log('👤 New user created:', newUser.toJSON());

    // Add a UserPhilosophy entry
    const newPhilosophy = await UserPhilosophy.create({
      userId: newUser.id,
      category: 'Philosophy',
      school: 'Rationalism',
      description: 'Believes reason is the primary source of knowledge.',
      keyThinkers: ['Descartes', 'Leibniz'],
    });

    console.log('📚 New user philosophy added:', newPhilosophy.toJSON());

    // Fetch with association (optional)
    const userWithPhilosophies = await User.findByPk(newUser.id, {
      include:  {
      model: UserPhilosophy,
      as: 'philosophies',
    },
    });

    console.dir(userWithPhilosophies?.toJSON(), { depth: null });

    console.log('✅ Test completed!');
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {

    console.log('aye')
  }
};

testUserPhilosophy();
//       const testDB = async () => {
//   const user = await User.create({ username: 'testuser', email: 'abc@abc.com', tokenVersion: 0, email_verified: false });
//   console.log('Created user:', user.toJSON());

//   const users = await User.findAll();
//   console.log('All users:', users.map(u => u.toJSON()));
// };

// testDB().catch(console.error);
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  console.log(`🚀 Server is running on ${PORT}`);
});