import express from "express";
import dotenv from "dotenv";
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
    }
    else {
        try {
            await database.sync({ alter: true }); // set to alter true
            console.log('Successfully connected to the database');
        }
        catch (error) {
            console.error('Failed to connect to the database:', error);
        }
    }
    console.log(`🚀 Server is running on ${PORT}`);
});
