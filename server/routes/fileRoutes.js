const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const File = require("../models/File");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

/* ==============================
   UPLOAD FILE
============================== */

router.post(
  "/upload/:moduleId",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const newFile = await File.create({
        user: req.user.id, // 🔥 VERY IMPORTANT
        moduleId: req.params.moduleId,
        originalName: req.file.originalname,
        filePath: req.file.path
      });

      res.status(201).json(newFile);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ==============================
   GET FILES FOR MODULE
============================== */

router.get("/:moduleId", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({
      moduleId: req.params.moduleId,
      user: req.user.id // 🔥 secure
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

/* ==============================
   DELETE FILE
============================== */

router.delete("/:fileId", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const fullPath = path.join(__dirname, "..", file.filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await file.deleteOne();

    res.json({ message: "File deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;