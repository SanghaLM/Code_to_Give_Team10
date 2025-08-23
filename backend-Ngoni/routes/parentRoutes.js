const express = require("express");
const router = express.Router();
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
router.post("/children", authMiddleware, parentController.addChildProfile);
router.get("/children", authMiddleware, parentController.getChildren);
router.get("/children/:childId", authMiddleware, parentController.getChild);
router.post(
  "/children/:childId/request-teacher",
  authMiddleware,
  parentController.requestTeacher
);
// Homework Management
router.get(
  "/children/:childId/homeworks",
  authMiddleware,
  parentController.getAssignedHomeworks
);
router.get(
  "/homework/:homeworkId/start",
  authMiddleware,
  parentController.startHomework
);
router.post(
  "/homework/:homeworkId/word/:wordId/upload",
  authMiddleware,
  uploadMiddleware.single("file"),
  parentController.uploadWordRecording
);
router.post(
  "/homework/:homeworkId/submit",
  authMiddleware,
  parentController.submitHomework
);
router.get(
  "/homework/:homeworkId/metrics",
  authMiddleware,
  parentController.getHomeworkMetrics
);
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

// // Temporary Test Endpoint
// router.post(
//   "/homework/create-test",
//   authMiddleware,
//   parentController.createTestHomework
// );

module.exports = router;
