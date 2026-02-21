const express = require("express");
const router = express.Router();
const Module = require("../models/Module");
const authMiddleware = require("../middleware/authMiddleware");

// Create module
router.post("/", authMiddleware, async (req, res) => {
  try {
    const module = await Module.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

// Get modules for subject
router.get("/:subjectId", authMiddleware, async (req, res) => {
  const modules = await Module.find({
    subject: req.params.subjectId,
    user: req.user.id
  });
  res.json(modules);
});

// Toggle completion
router.patch("/:id", authMiddleware, async (req, res) => {
  const module = await Module.findById(req.params.id);
  module.completed = !module.completed;
  await module.save();
  res.json(module);
});

// Delete module
router.delete("/:id", authMiddleware, async (req, res) => {
  await Module.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;