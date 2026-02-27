const express = require("express");
const router = express.Router();
const Checklist = require("../models/Checklist");
const authMiddleware = require("../middleware/authMiddleware");

/* ============================
   CREATE TASK
============================ */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = await Checklist.create({
      user: req.user.id,
      text: req.body.text
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

/* ============================
   GET USER TASKS
============================ */

router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Checklist.find({ user: req.user.id });
  res.json(tasks);
});

/* ============================
   TOGGLE TASK
============================ */

router.patch("/:id", authMiddleware, async (req, res) => {
  const task = await Checklist.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

/* ============================
   DELETE TASK
============================ */

router.delete("/:id", authMiddleware, async (req, res) => {
  await Checklist.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;