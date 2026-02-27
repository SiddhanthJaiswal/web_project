const express = require("express");
const router = express.Router();
const Module = require("../models/Module");
const File = require("../models/File");
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

// Get modules for subject, including files
router.get("/:subjectId", authMiddleware, async (req, res) => {
  try {
    const modules = await Module.find({
      subject: req.params.subjectId,
      user: req.user.id
    });

    const moduleIds = modules.map((m) => String(m._id));

    // query for files belonging to these modules; do **not** require the
    // `user` field because older documents created before the schema
    // change will not have that property. the parent module query already
    // ensures the user only sees their own modules, so leaking an
    // accidentally unowned file is unlikely in this simple app.
    const files = await File.find({
      moduleId: { $in: moduleIds }
      // we deliberately skip `user` filter here
    });

    const modulesWithFiles = modules.map((m) => {
      const mObj = m.toObject();
      return {
        ...mObj,
        files: files.filter((f) => f.moduleId === String(m._id))
      };
    });

    res.json(modulesWithFiles);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
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