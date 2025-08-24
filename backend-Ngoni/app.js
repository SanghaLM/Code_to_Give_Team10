const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const parentRoutes = require("./routes/parentRoutes");
const teacherRoutes = require("./routes/teacherRoutes"); // Added

const path = require("path");
const fs = require("fs");
const publicRoutes = require("./routes/publicRoutes");

const cors = require("cors");
const { cleanupUploads } = require("./utils/cleanup"); // From earlier
const cron = require("node-cron");
require("./models/Parent");
require("./models/Child");
require("./models/HomeworkSubmission");
require("./models/HomeworkAssignment"); // Changed from Homework
require("./models/Teacher");
require("./models/SubmissionFeedback");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

console.log("Starting Project REACH Backend API");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Middleware
// app.use(express.json());

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // Increased limit for file uploads
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
console.log("Middleware configured: CORS, body-parser, static uploads");

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large. Maximum size allowed is 10MB.",
    });
  }
  if (error.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      message: "Too many files. Maximum 10 files allowed.",
    });
  }
  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "Unexpected file field.",
    });
  }
  if (error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({
      message:
        "Invalid file type. Only images, PDFs, and text files are allowed.",
    });
  }

  console.error("Server error:", error);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Routes
app.use("/api/parents", parentRoutes);
console.log("Parent routes registered");
app.use("/api/teachers", teacherRoutes); // Added
app.use("/api/public", publicRoutes);
console.log("Public routes registered");

app.get("/", (req, res) => {
  console.log("Root endpoint accessed");
  res.send("Project REACH Backend API running!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    uploads_directory: fs.existsSync(uploadsDir) ? "exists" : "missing",
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Uploads directory: ${uploadsDir}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

if (cleanupUploads) {
  cron.schedule("0 2 * * *", () => {
    console.log("Running cleanup of old uploads...");
    cleanupUploads();
  });
}
