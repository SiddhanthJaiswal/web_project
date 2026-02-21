const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: true
  },
  originalName: String,
  filePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("File", fileSchema);