const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { isEmail, requiredString } = require("../utils/validate");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!requiredString(name, 2)) return res.status(400).json({ error: "Invalid name" });
    if (!isEmail(email)) return res.status(400).json({ error: "Invalid email" });
    if (!["STUDENT", "PROFESSOR"].includes(role)) return res.status(400).json({ error: "Invalid role" });
    if (!requiredString(password, 6)) return res.status(400).json({ error: "Password min 6 chars" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, role, passwordHash });

    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) return res.status(400).json({ error: "Invalid email" });
    if (!requiredString(password, 1)) return res.status(400).json({ error: "Missing password" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
