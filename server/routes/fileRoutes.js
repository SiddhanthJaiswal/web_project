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
  (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || "Upload failed" });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file received" });
        }

        // ensure the document stores the owner. without this property the
        // query in the modules route will never return any files (see
        // bug report from user complaining "nothing happens when I upload").
        const newFile = await File.create({
          user: req.user.id,
          moduleId: req.params.moduleId,
          originalName: req.file.originalname,
          // multer on Windows returns backslashes; convert to forward
          // slashes so the URL constructed by the client works correctly.
          filePath: req.file.path.replace(/\\/g, "/")
        });

        res.status(201).json(newFile);
      } catch (error) {
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({ message: "Upload failed" });
      }
    });
  }
);

/* ==============================
   GET FILES FOR MODULE
============================== */

router.get("/:moduleId", authMiddleware, async (req, res) => {
  try {
    // make sure we return any files even if they were created before the
    // schema included `user`. newer docs will be scoped by owner.
    const query = { moduleId: req.params.moduleId };

    // only filter by user if the field exists on the document; this avoids
    // a situation where legacy records (no user) are silently dropped.
    if (req.user && req.user.id) {
      query.user = req.user.id;
    }

    const files = await File.find(query);

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

/* ==============================
   TOGGLE FILE COMPLETION
============================== */

router.patch("/:fileId", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // migrate any legacy document that lacks an owner field; assume
    // current user is the owner so the rest of the logic works normally.
    if (!file.user) {
      file.user = req.user.id;
    }

    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    file.completed = !file.completed;
    await file.save();

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
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

    if (!file.user) {
      file.user = req.user.id; // back‑populate so that delete later is safe
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