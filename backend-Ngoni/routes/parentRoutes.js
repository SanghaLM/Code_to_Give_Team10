// const express = require("express");
// const router = express.Router();
// const parentController = require("../controllers/parentController");
// const authMiddleware = require("../middleware/authMiddleware");
// const uploadMiddleware = require("../middleware/uploadMiddleware");

// console.log("Setting up parent routes");

// // Authentication / Profile
// router.post("/signup", parentController.signupParent);
// router.post("/login", parentController.loginParent);
// router.get("/profile", authMiddleware, parentController.getParentProfile);
// router.put("/profile", authMiddleware, parentController.updateParentProfile);

// // Child Management
// router.post("/children", authMiddleware, parentController.addChildProfile);
// router.get("/children", authMiddleware, parentController.getChildren);
// router.get("/children/:childId", authMiddleware, parentController.getChild);
// router.post(
//   "/children/:childId/request-teacher",
//   authMiddleware,
//   parentController.requestTeacher
// );
// // Homework Management
// router.get(
//   "/children/:childId/homeworks",
//   authMiddleware,
//   parentController.getAssignedHomeworks
// );
// router.get(
//   "/homework/:homeworkId/start",
//   authMiddleware,
//   parentController.startHomework
// );
// router.post(
//   "/homework/:homeworkId/word/:wordId/upload",
//   authMiddleware,
//   uploadMiddleware.single("file"),
//   parentController.uploadWordRecording
// );
// router.post(
//   "/homework/:homeworkId/submit",
//   authMiddleware,
//   parentController.submitHomework
// );
// router.get(
//   "/homework/:homeworkId/metrics",
//   authMiddleware,
//   parentController.getHomeworkMetrics
// );
// router.get(
//   "/children/:childId/submissions",
//   authMiddleware,
//   parentController.getSubmissionsByChild
// );
// router.get(
//   "/homework/:homeworkId/submission",
//   authMiddleware,
//   parentController.getSubmissionByHomework
// );

// // // Temporary Test Endpoint
// // router.post(
// //   "/homework/create-test",
// //   authMiddleware,
// //   parentController.createTestHomework
// // );

// module.exports = router;
const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");
const authMiddleware = require("../middleware/authMiddleware"); // Assume this exists

// Authentication routes
router.post("/signup", parentController.signupParent);
router.post("/login", parentController.loginParent);
// Apply auth middleware to all routes
router.use(authMiddleware);

// Profile routes
router.get("/profile", parentController.getParentProfile);
router.put("/profile", parentController.updateParentProfile);

// Child management routes
router.post("/children", parentController.addChildProfile);
router.get("/children", parentController.getChildren);
router.get("/children/:childId", parentController.getChild);
router.post(
  "/children/:childId/request-teacher",
  parentController.requestTeacher
);

// Homework routes
router.get(
  "/children/:childId/homeworks",
  parentController.getAssignedHomeworks
);
router.get("/homeworks/:homeworkId", parentController.getHomeworkDetails);
router.get("/homeworks/:homeworkId/start", parentController.startHomework);
router.get(
  "/homeworks/:homeworkId/metrics",
  parentController.getHomeworkMetrics
);

// File upload routes
router.post(
  "/upload",
  parentController.uploadFile,
  parentController.handleFileUpload
);

// Submission routes
router.post(
  "/homeworks/:homeworkId/words/:wordId/recording",
  parentController.uploadFile, // For audio recordings
  parentController.uploadWordRecording
);

router.post("/submit-homework", parentController.submitHomework);

// Get submission routes
router.get(
  "/children/:childId/submissions",
  parentController.getSubmissionsByChild
);
router.get(
  "/homeworks/:homeworkId/submission",
  parentController.getSubmissionByHomework
);

// Test/development routes (remove in production)
router.post("/create-test-homework", parentController.createTestHomework);

module.exports = router;
