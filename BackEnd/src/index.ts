import express from "express";
import dotenv from "dotenv";
import sequelize from "./database/db.js";
import database from "./database/db.js";
import apiRouter from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from DebateLab backend");
});

app.use('/api', apiRouter);

app.listen(PORT, async () => {
  if (process.env.SKIP_DB === 'true') {
    console.log('⚠️ Skipping database sync due to SKIP_DB=true');
  } else {
    try {
      await database.sync({force: true}); // set to alter true
      console.log('Successfully connected to the database');

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