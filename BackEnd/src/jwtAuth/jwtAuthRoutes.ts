// src/routes/authRoutes.ts

import express, { Request, Response } from "express";
import User from "../database/models/User.js";
import {
  hashPassword,
  comparePasswords,
  createAccessToken,
} from "./jwtAuth.js";
import { isAuthenticated } from "./isAuthenticated.js";

export const jwtAuthRouter = express.Router();

/**
 * ————————————————————————————————————————————
 * 1) POST /api/auth/signup
 * ————————————————————————————————————————————
 *
 * Body: { email: string, password: string }
 * 
 * On success: creates a new user record, hashes password,
 * returns { accessToken, user: { id, email, ... } } so the client
 * can store the token and consider the user "logged in" immediately.
 *
 * Possible errors:
 * - If email is already taken, 400
 * - If password is too short / invalid, 400
 */
jwtAuthRouter.post("/signup", async (req: any, res: any) => {
  try {
    const { email, password, username } = req.body as {
      email: string;
      password: string;
      username: string;
    };

    // 1) Basic validation
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email and password are both required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A user with that email already exists" });
    }

    // 3) Hash the password
    const hashed = await hashPassword(password);

    // 4) Create the new user in DB (tokenVersion defaults to 0)
    const newUser = await User.create({
      email,
      password: hashed,
      username: username,
      tokenVersion: 0,
      email_verified: false,
    });

    // 5) Create a JWT for them right away (they start off “signed in”)
    const accessToken = createAccessToken(newUser.id as number, newUser.tokenVersion);

    // 6) Return token and user info
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        school: newUser.school,
        username: newUser.username
      },
      accessToken,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * ————————————————————————————————————————————
 * 2) POST /api/auth/signin
 * ————————————————————————————————————————————
 *
 * Body: { email: string, password: string }
 * 
 * On success: returns { accessToken, user: { id, email } }.
 * 
 * Possible errors:
 * - 400 if email/password missing or wrong
 * - 404 if user not found
 */
jwtAuthRouter.post("/signin", async (req: any, res: any) => {
  console.log('sign in route reached jwt')
  console.log(req.body);
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      console.log('missing email or pw')
      return res
        .status(400)
        .json({ error: "Email and password are both required" });
    }

    // 1) Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
        console.log('user found');
        console.log(user);
    // 2) Compare passwords
    const valid = await comparePasswords(password, user.password as any);
    if (!valid) {
      console.log('something is not valid')
      return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log('user was found, everything is valid, about to try and create a token')
    // 3) Generate new JWT (sign with user.id & user.tokenVersion)
    const accessToken = createAccessToken(user.id as number, user.tokenVersion);
    console.log(accessToken, 'access token')
    console.log('response.json is being sent...')
    // 4) Return token + user data
    return res.json({
      message: "Signed in successfully",
      user: {
        id: user.id,
        email: user.email,
        school: user.school,
        username: user.username,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * ————————————————————————————————————————————
 * 3) POST /api/auth/logout
 * ————————————————————————————————————————————
 *
 * Body: none (the token is expected in Authorization header).
 * 
 * Effect: increments the user’s tokenVersion in the database,
 * which immediately invalidates all existing tokens carrying
 * the old version. Responds 200 OK if successful.
 *
 * Possible errors:
 * - 401 if no valid token provided
 */
jwtAuthRouter.post(
  "/logout",
  isAuthenticated as any, // must have a valid token to “log out”
  async (req: any, res: any) => {
    try {
      // req.user is set by isAuthenticated middleware
      const user = (req as any).user;
      // 1) Increment their tokenVersion in the DB
      user.tokenVersion += 1;
      await user.save();

      // 2) On client side, they should also discard their local token.
      return res.json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

jwtAuthRouter.get('/verify', isAuthenticated as any,(req: any, res: any) => {
try {
    // req.user is set by isAuthenticated middleware
    const user = req.user;
    console.log('trying to verify this guy:')
    console.log(user)
    // Return a 200 status along with the user data (excluding sensitive info like password)
    res.json({ user: req.user });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})
