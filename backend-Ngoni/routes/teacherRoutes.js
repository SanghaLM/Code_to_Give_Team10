// TODO by me
const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

console.log("Setting up teacher routes");

// Authentication / Profile
router.post("/signup", teacherController.registerTeacher);
router.post("/login", teacherController.loginTeacher);
router.get("/profile", authMiddleware, teacherController.getTeacherProfile);
router.put("/profile", authMiddleware, teacherController.updateTeacherProfile);

// Homework Management
router.post("/homework", authMiddleware, teacherController.createHomework);
router.get("/homework", authMiddleware, teacherController.getHomeworkList);
router.get(
  "/homework/:homeworkId",
  authMiddleware,
  teacherController.getHomeworkDetail
);
router.put(
  "/homework/:homeworkId",
  authMiddleware,
  teacherController.updateHomework
);
router.delete(
  "/homework/:homeworkId",
  authMiddleware,
  teacherController.deleteHomework
);

// Submissions & Feedback
router.get(
  "/pending-students",
  authMiddleware,
  teacherController.getPendingStudents
); // Added
router.get(
  "/homework/:homeworkId/submissions",
  authMiddleware,
  teacherController.getSubmissions
);
router.get(
  "/homework/:homeworkId/metrics",
  authMiddleware,
  teacherController.getHomeworkMetrics
);
router.get(
  "/homework/:homeworkId/metrics",
  authMiddleware,
  teacherController.getHomeworkMetrics
);
router.post(
  "/submission/:id/feedback",
  authMiddleware,
  teacherController.provideFeedback
);

// Student Management
router.post(
  "/students/approve",
  authMiddleware,
  teacherController.approveStudent
);
router.get("/students", authMiddleware, teacherController.getStudents);
router.get(
  "/students/:id/progress",
  authMiddleware,
  teacherController.getStudentProgress
);
router.post("/students", authMiddleware, teacherController.addStudent); // Added
// Moderation
router.delete('/posts/:postId', authMiddleware, teacherController.deletePublicPost);

module.exports = router;
