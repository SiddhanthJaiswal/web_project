const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const authMiddleware = require("../middleware/authMiddleware");

// Create subject
router.post("/", authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

// Get user subjects
router.get("/", authMiddleware, async (req, res) => {
  const subjects = await Subject.find({ user: req.user.id });
  res.json(subjects);
});

// Delete subject
router.delete("/:id", authMiddleware, async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;