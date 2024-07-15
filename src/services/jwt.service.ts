import jwt from "jsonwebtoken";
import { Roles } from "../lib/types";

const JWT_SECRET = "betide studio";

interface Token {
  userId: string;
  role: Roles;
}

function generateToken({ userId, role }: Token) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "30d" });
}

function decodeToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export const JwtService = {
  genToken: generateToken,
  decodeToken,
};
