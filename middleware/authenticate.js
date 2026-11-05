import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config.js";

export function authenticate(req, res, next) {
  const headers = req.headers || {};
  const header = headers.authorization || headers.Authorization || "";
  const [scheme, token] = String(header).split(" ");

  if (!token || !/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    req.user = jwt.verify(token, getJwtSecret());
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
  
  next();
}