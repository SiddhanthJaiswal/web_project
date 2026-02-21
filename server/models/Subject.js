const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  credits: Number,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);