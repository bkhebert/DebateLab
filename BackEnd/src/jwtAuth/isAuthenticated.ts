// jwtAuth/isAuthenticated.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./jwtAuth.js";
import {User} from "../database/models/index.js";

// export interface AuthenticatedRequest extends Request {
//   user?: User;
// }
type DynamicObject = {
  [key: string]: string; // Keys are strings, values are strings
};

// This middleware will be used on any route that requires a valid JWT.
export async function isAuthenticated(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    // Expect header to look like: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid Authorization header" });
    }

    const token = parts[1];

    // 1) Verify signature + expiration
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // 2) Load user from DB
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3) Check tokenVersion
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ error: "Token has been invalidated" });
    }

    // 4) Attach user to request object, so downstream handlers can use it
    req.user = user;
    next();
  } catch (err) {
    console.error("isAuthenticated middleware error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}