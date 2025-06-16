// jwtAuth/jwtAuthRoutes.ts
import dotenv  from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

// 1) Hash a plaintext password before saving to DB:
export async function hashPassword(
  plainTextPassword: string
): Promise<string> {
  // “saltRounds” of 10 is a common default; you can bump to 12 in prod if you like.
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainTextPassword, saltRounds);
  return hashed;
}

// 2) Compare a plaintext password to a hashed password:
export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

// 3) Create a JWT access token
export function createAccessToken(
  userId: number,
  tokenVersion: number
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  // The payload here contains userId and tokenVersion. You can add other claims as needed.
  const payload = { userId, tokenVersion };
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  } as jwt.SignOptions);
}

// 4) Verify a JWT and return its payload (or throw an error if invalid):
export function verifyAccessToken(token: string): {
  userId: number;
  tokenVersion: number;
  iat: number;
  exp: number;
} {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  // jwt.verify returns `any` (or the decoded payload). We know we stored userId & tokenVersion.
  return jwt.verify(token, process.env.JWT_SECRET) as {
    userId: number;
    tokenVersion: number;
    iat: number;
    exp: number;
  };
}