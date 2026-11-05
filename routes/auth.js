import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecret, getJwtExpiresIn } from "../config.js";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const user = findByUsername(username);
  if (!user) return res.status(401).json({ error: "Invalid credentials." });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials." });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() },
  );
  res.status(200).json({ token });
});

export default router;