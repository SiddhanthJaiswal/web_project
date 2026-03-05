const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// GET all goals
router.get("/", async (req, res) => {
  const goals = await Goal.find();
  res.json(goals);
});

// CREATE goal
router.post("/", async (req, res) => {
  const goal = await Goal.create({
    title: req.body.title,
    completed: false
  });

  res.status(201).json(goal);
});

// UPDATE goal
router.put("/:id", async (req, res) => {
  const goal = await Goal.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );

  res.json(goal);
});

// DELETE goal
router.delete("/:id", async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);
  res.json({ message: "Goal deleted" });
});

module.exports = router;