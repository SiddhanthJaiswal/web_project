const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const isPdf =
    ext === ".pdf" || file.mimetype === "application/pdf";

  if (!isPdf) {
    return cb(new Error("Only PDF files are allowed"));
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;