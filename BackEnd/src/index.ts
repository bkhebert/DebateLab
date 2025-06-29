import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./database/db.js";
import database from "./database/db.js";
import apiRouter from "./routes/index.js";
import { jwtAuthRouter } from "./jwtAuth/jwtAuthRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.NODE_DEV ? ['http://localhost:5173', "chrome-extension://your-extension-id"] : [ process.env.CLIENT_ORIGIN, process.env.CLIENT_ORIGIN_WWW ], // Explicit origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.set('trust proxy', 1);

app.get("/", (req, res) => {
  res.send("Hello from DebateLab backend");
});

app.use('/api', apiRouter);
app.use('/jwt/auth', jwtAuthRouter);

app.listen(PORT, async () => {
  if (process.env.SKIP_DB === 'true') {
    console.log('⚠️ Skipping database sync due to SKIP_DB=true');
  } else {
    try {
      await database.sync({alter: true}); // set to alter true
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