const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  // associate each file with a specific user so we can enforce
  // ownership and also filter when querying modules.
  user: {
    type: String,
    required: true
  },

  moduleId: {
    type: String,
    required: true
  },
  originalName: String,
  filePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("File", fileSchema);