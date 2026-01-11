const express = require("express");
const { Request, Session, User } = require("../models");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Student: create request
router.post("/", auth(true), requireRole("STUDENT"), async (req, res) => {
  try {
    const { sessionId, justification, studentDocUrl } = req.body;

    // rule: student can have only one approved
    const existingApproved = await Request.findOne({
      where: { studentId: req.user.id, status: "APPROVED" }
    });
    if (existingApproved) return res.status(400).json({ error: "Student already has an approved thesis." });

    // avoid duplicates for same session while pending
    const existingSame = await Request.findOne({
      where: { studentId: req.user.id, sessionId, status: "PENDING" }
    });
    if (existingSame) return res.status(400).json({ error: "You already applied to this session." });

    const session = await Session.findByPk(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const request = await Request.create({
      sessionId,
      studentId: req.user.id,
      justification: justification || null,
      studentDocUrl: studentDocUrl || null
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Student: my requests
router.get("/mine", auth(true), requireRole("STUDENT"), async (req, res) => {
  const requests = await Request.findAll({
    where: { studentId: req.user.id },
    include: [
      {
        model: Session,
        include: [{ model: User, as: "professor", attributes: ["id", "name", "email"] }]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
  res.json(requests);
});

// Professor: list requests for my sessions
router.get("/inbox", auth(true), requireRole("PROFESSOR"), async (req, res) => {
  const requests = await Request.findAll({
    include: [
      {
        model: Session,
        where: { professorId: req.user.id }
      },
      { model: User, as: "student", attributes: ["id", "name", "email"] }
    ],
    order: [["createdAt", "DESC"]]
  });
  res.json(requests);
});

// Professor: approve/reject
router.put("/:id", auth(true), requireRole("PROFESSOR"), async (req, res) => {
  try {
    const { status, justification, profDocUrl } = req.body;
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await Request.findByPk(req.params.id, {
      include: [{ model: Session }]
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    // ensure professor owns this session
    if (request.session.professorId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // if approving, ensure student doesn't already have another approved
    if (status === "APPROVED") {
      const otherApproved = await Request.findOne({
        where: { studentId: request.studentId, status: "APPROVED" }
      });
      if (otherApproved && otherApproved.id !== request.id) {
        return res.status(400).json({ error: "Student already has an approved thesis." });
      }
    }

    request.status = status;
    if (typeof justification === "string") request.justification = justification;
    if (typeof profDocUrl === "string") request.profDocUrl = profDocUrl;

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
