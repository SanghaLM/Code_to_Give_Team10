const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const parentRoutes = require("./routes/parentRoutes");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

console.log("Starting Project REACH Backend API");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
console.log("Middleware configured: CORS, body-parser, static uploads");

// Routes
app.use("/api/parents", parentRoutes);
console.log("Parent routes registered");

app.get("/", (req, res) => {
  console.log("Root endpoint accessed");
  res.send("Project REACH Backend API running!");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
