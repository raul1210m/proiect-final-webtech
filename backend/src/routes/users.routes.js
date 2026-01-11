const express = require("express");
const { User } = require("../models");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/users (professor only for demo/admin)
router.get("/", auth(true), requireRole("PROFESSOR"), async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role"]
  });
  res.json(users);
});

module.exports = router;
