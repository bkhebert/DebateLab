import { Router }  from 'express';
import { User, Downloads } from '../database/models/index.js';
import dotenv from "dotenv";
dotenv.config();

const adminRouter = Router();

adminRouter.get('/', (req, res) => {
  
})