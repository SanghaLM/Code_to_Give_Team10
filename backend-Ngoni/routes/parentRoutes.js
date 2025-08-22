const express = require("express");
const router = express.Router(); // Use Express's Router
const parentController = require("../controllers/parentController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

console.log("Setting up parent routes");

// Authentication / Profile
router.post("/signup", parentController.signupParent);
router.post("/login", parentController.loginParent);
router.get("/profile", authMiddleware, parentController.getParentProfile);
router.put("/profile", authMiddleware, parentController.updateParentProfile);

// Child Management
router.get("/children", authMiddleware, parentController.getChildren);
router.get("/children/:childId", authMiddleware, parentController.getChild);

// Homework Submissions
router.get(
  "/children/:childId/submissions",
  authMiddleware,
  parentController.getSubmissionsByChild
);
router.get(
  "/homework/:homeworkId/submission",
  authMiddleware,
  parentController.getSubmissionByHomework
);
router.post(
  "/homework/:homeworkId/submit",
  authMiddleware,
  uploadMiddleware.single("file"),
  parentController.submitHomework
);
router.get(
  "/homework/:homeworkId/metrics",
  authMiddleware,
  parentController.getHomeworkMetrics
);

module.exports = router;
