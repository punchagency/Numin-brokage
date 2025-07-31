import jwt from "jsonwebtoken";
import getEnv from "./env";

const secret = getEnv("JWT_SECRET_KEY");

// Function to generate a JWT
export function generateToken(payload: Record<string, any>): string {
  try {
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "1y", // ⏳ 1 year
    });
  } catch {
    throw new Error("Failed to generate token");
  }
}

// Function to verify a JWT
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw "Failed to verify token";
  }
}
