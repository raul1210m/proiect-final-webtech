const express = require("express");
const { Session, User, Request } = require("../models");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/sessions (any logged-in user)
router.get("/", auth(true), async (req, res) => {
  const sessions = await Session.findAll({
    include: [{ model: User, as: "professor", attributes: ["id", "name", "email"] }]
  });
  res.json(sessions);
});

// POST /api/sessions (professor)
router.post("/", auth(true), requireRole("PROFESSOR"), async (req, res) => {
  try {
    const { description, startDate, endDate, maxSlots } = req.body;
    const session = await Session.create({
      description: description || null,
      startDate,
      endDate,
      maxSlots: maxSlots ?? 5,
      professorId: req.user.id
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sessions/mine (professor)
router.get("/mine", auth(true), requireRole("PROFESSOR"), async (req, res) => {
  const sessions = await Session.findAll({
    where: { professorId: req.user.id },
    include: [
      { model: User, as: "professor", attributes: ["id", "name", "email"] },
      { model: Request }
    ]
  });
  res.json(sessions);
});

module.exports = router;
