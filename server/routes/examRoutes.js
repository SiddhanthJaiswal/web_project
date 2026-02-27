const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const authMiddleware = require("../middleware/authMiddleware");

/* ============================
   CREATE EXAM
============================ */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.create({
      user: req.user.id,
      title: req.body.title,
      subject: req.body.subject,
      date: req.body.date,
      notes: req.body.notes
    });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

/* ============================
   GET UPCOMING EXAMS FOR USER
============================ */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      user: req.user.id,
      date: { $gte: now }
    }).sort({ date: 1 });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ============================
   DELETE EXAM
============================ */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;

