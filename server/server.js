const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

/* ===============================
   IMPORT ROUTES
=============================== */
const checklistRoutes = require("./routes/checklistRoutes");
const examRoutes = require("./routes/examRoutes");
const authRoutes = require("./routes/authRoutes");
const goalsRoutes = require("./routes/goals");
const subjectRoutes = require("./routes/subjectRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const fileRoutes = require("./routes/fileRoutes");
const authMiddleware = require("./middleware/authMiddleware");

/* ===============================
   INITIALIZE APP
=============================== */

const app = express();

/* ===============================
   MIDDLEWARE
=============================== */

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

/* ===============================
   DATABASE CONNECTION
=============================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

/* ===============================
   API ROUTES
=============================== */

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/goals", goalsRoutes);
/* ===============================
   PROTECTED TEST ROUTE
=============================== */

app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Protected dashboard data 🔥",
    userId: req.user.id
  });
});

/* ===============================
   ROOT ROUTE
=============================== */

app.get("/", (req, res) => {
  res.send("Student Dashboard API Running 🚀");
});

/* ===============================
   START SERVER
=============================== */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});