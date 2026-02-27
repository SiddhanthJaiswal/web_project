const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subject: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);

