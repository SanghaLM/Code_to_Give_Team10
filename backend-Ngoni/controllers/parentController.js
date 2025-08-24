const Parent = require("../models/Parent");
const Child = require("../models/Child");
const Submission = require("../models/HomeworkSubmission");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("text/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// File upload endpoint
exports.uploadFile = upload.single("file");

exports.handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filePath: req.file.path,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
};

// Enhanced homework submission with manual submission support
exports.submitHomework = async (req, res) => {
  console.log("submitHomework request:", req.body, req.params);
  try {
    const {
      homeworkId,
      studentId,
      timeTakenSeconds,
      textSubmission,
      imageUrls,
      fileUrls,
      submissionType = "audio", // 'audio' or 'manual'
    } = req.body;
    const parentId = req.user.id;

    if (
      !mongoose.Types.ObjectId.isValid(homeworkId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const child = await Child.findOne({ _id: studentId, parentId });
    if (!child) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const homework = await mongoose
      .model("HomeworkAssignment")
      .findById(homeworkId);
    if (!homework) {
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    let submission = await Submission.findOne({
      homeworkId,
      studentId,
      parentId,
    });

    if (!submission) {
      submission = new Submission({
        homeworkId,
        studentId,
        parentId,
        recordings: [],
        submissionType,
      });
    }

    // Handle manual submissions
    if (submissionType === "manual") {
      submission.manualSubmission = {
        textContent: textSubmission || "",
        imageUrls: imageUrls || [],
        fileUrls: fileUrls || [],
        submittedAt: new Date(),
      };

      // Calculate a score based on submission completeness
      let score = 0;
      if (textSubmission && textSubmission.trim().length > 0) score += 40;
      if (imageUrls && imageUrls.length > 0) score += 30;
      if (fileUrls && fileUrls.length > 0) score += 30;

      submission.manualScore = Math.min(100, score + 50); // Base score of 50 for effort
    } else {
      // Handle existing audio submission logic
      if (submission.recordings.length === 0) {
        return res.status(400).json({ message: "No recordings found" });
      }
    }

    submission.status = "completed";
    submission.timeTakenSeconds = timeTakenSeconds;
    submission.completedAt = new Date();
    await submission.save();

    // Calculate average score
    let avgScore;
    if (submissionType === "manual") {
      avgScore = submission.manualScore || 75; // Default score for manual submissions
    } else {
      avgScore =
        submission.recordings.length > 0
          ? submission.recordings.reduce(
              (sum, r) => sum + (r.parentScore || r.childScore || 0),
              0
            ) / submission.recordings.length
          : 0;
    }

    console.log("Homework submitted:", submission);
    res.status(201).json({
      message: "Homework submitted successfully",
      submission,
      avgScore,
      submissionType,
    });
  } catch (err) {
    console.error("Error in submitHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get submission details including manual submissions
exports.getSubmissionByHomework = async (req, res) => {
  console.log("getSubmissionByHomework request:", req.params);
  try {
    const { homeworkId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    const submission = await Submission.findOne({
      homeworkId,
      parentId: req.user.id,
    }).populate("studentId", "firstName lastName");

    if (!submission) {
      console.log("Submission not found for homework:", homeworkId);
      return res.status(404).json({ message: "Submission not found" });
    }

    // Include manual submission data in response
    const submissionData = {
      ...submission.toObject(),
      hasManualSubmission: !!submission.manualSubmission,
      manualContent: submission.manualSubmission || null,
    };

    console.log("Submission retrieved:", submissionData);
    res.json(submissionData);
  } catch (err) {
    console.error("Error in getSubmissionByHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all submissions by child including manual ones
exports.getSubmissionsByChild = async (req, res) => {
  console.log("getSubmissionsByChild request:", req.params);
  try {
    const { childId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const submissions = await Submission.find({
      studentId: childId,
      parentId: req.user.id,
    }).populate("homeworkId", "title dueDate");

    // Add submission type and score information
    const enhancedSubmissions = submissions.map((submission) => ({
      ...submission.toObject(),
      submissionType: submission.submissionType || "audio",
      finalScore:
        submission.manualScore ||
        (submission.recordings.length > 0
          ? submission.recordings.reduce(
              (sum, r) => sum + (r.parentScore || r.childScore || 0),
              0
            ) / submission.recordings.length
          : 0),
      hasManualContent: !!submission.manualSubmission,
    }));

    console.log(
      "Enhanced submissions retrieved for child:",
      childId,
      enhancedSubmissions.length
    );
    res.json(enhancedSubmissions);
  } catch (err) {
    console.error("Error in getSubmissionsByChild:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Enhanced homework metrics including manual submissions
exports.getHomeworkMetrics = async (req, res) => {
  console.log("getHomeworkMetrics request:", req.params);
  try {
    const { homeworkId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    const homework = await mongoose
      .model("HomeworkAssignment")
      .findById(homeworkId);
    if (!homework) {
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    const submissions = await Submission.find({ homeworkId });
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(
      (s) => s.status === "completed"
    ).length;

    // Separate audio and manual submissions
    const audioSubmissions = submissions.filter(
      (s) => s.submissionType !== "manual"
    );
    const manualSubmissions = submissions.filter(
      (s) => s.submissionType === "manual"
    );

    const parentParticipation = audioSubmissions.filter((s) =>
      s.recordings.some((r) => r.parentAudioUrl)
    ).length;

    // Calculate average scores including manual submissions
    const totalScores = submissions.map((s) => {
      if (s.submissionType === "manual") {
        return s.manualScore || 75; // Default manual score
      } else {
        return s.recordings.length > 0
          ? s.recordings.reduce(
              (sum, r) => sum + (r.parentScore || r.childScore || 0),
              0
            ) / s.recordings.length
          : 0;
      }
    });

    const avgScore =
      totalScores.length > 0
        ? totalScores.reduce((sum, score) => sum + score, 0) /
          totalScores.length
        : 0;

    const metrics = {
      totalSubmissions,
      completedSubmissions,
      completionRate:
        totalSubmissions > 0
          ? ((completedSubmissions / totalSubmissions) * 100).toFixed(2)
          : "0.00",
      parentParticipationRate:
        audioSubmissions.length > 0
          ? ((parentParticipation / audioSubmissions.length) * 100).toFixed(2)
          : "0.00",
      averageScore: avgScore.toFixed(2),
      averageTimeTakenSeconds: (
        submissions.reduce((sum, s) => sum + (s.timeTakenSeconds || 0), 0) /
          totalSubmissions || 0
      ).toFixed(2),
      submissionBreakdown: {
        audioSubmissions: audioSubmissions.length,
        manualSubmissions: manualSubmissions.length,
        totalSubmissions,
      },
    };

    console.log("Enhanced homework metrics:", metrics);
    res.json(metrics);
  } catch (err) {
    console.error("Error in getHomeworkMetrics:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create a test homework assignment for testing
exports.createTestHomework = async (req, res) => {
  console.log("createTestHomework request for parent:", req.user.id);
  try {
    const { childId, title, type = "mixed" } = req.body; // type can be 'audio', 'manual', or 'mixed'

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const child = await Child.findOne({ _id: childId, parentId: req.user.id });
    if (!child) {
      return res
        .status(404)
        .json({ message: "Child not found or not linked to parent" });
    }

    let homeworkData = {
      title: title || "Test Assignment",
      assignedTo: [childId],
      createdBy: new mongoose.Types.ObjectId("68a89c2ba5105996446eadff"), // Replace with actual teacher ID
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      allowManualSubmission: type === "manual" || type === "mixed",
      submissionType: type,
    };

    // Add words for audio assignments
    if (type === "audio" || type === "mixed") {
      homeworkData.words = [
        { word: "CAT", example: "The cat is on the mat." },
        { word: "DOG", example: "The dog barks loudly." },
        { word: "SUN", example: "The sun shines brightly." },
      ];
    }

    // Add manual instructions for manual assignments
    if (type === "manual" || type === "mixed") {
      homeworkData.instructions =
        "Complete the exercises in your workbook and submit photos of your work along with any written explanations.";
    }

    const homework = new mongoose.model("HomeworkAssignment")(homeworkData);

    await homework.save();
    console.log("Test homework created:", homework._id);
    res.status(201).json({ message: "Test homework created", homework });
  } catch (err) {
    console.error("Error in createTestHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get homework details including submission type
exports.getHomeworkDetails = async (req, res) => {
  console.log("getHomeworkDetails request:", req.params);
  try {
    const { homeworkId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    const homework = await mongoose
      .model("HomeworkAssignment")
      .findById(homeworkId)
      .populate("createdBy", "firstName lastName");

    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    // Check if user's child is assigned to this homework
    const assignedChildIds = homework.assignedTo.map((id) => id.toString());
    const userChildren = await Child.find({ parentId: req.user.id }).select(
      "_id"
    );
    const userChildIds = userChildren.map((child) => child._id.toString());

    const hasAccess = assignedChildIds.some((assignedId) =>
      userChildIds.includes(assignedId)
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const homeworkData = {
      ...homework.toObject(),
      canSubmitManually:
        homework.allowManualSubmission ||
        homework.submissionType === "manual" ||
        homework.submissionType === "mixed",
      hasAudioComponent: homework.words && homework.words.length > 0,
    };

    console.log("Homework details retrieved:", homeworkData);
    res.json(homeworkData);
  } catch (err) {
    console.error("Error in getHomeworkDetails:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// All existing functions remain the same...
exports.signupParent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      childId,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      return res.status(400).json({
        message:
          "First name, last name, username, password, and confirm password are required",
      });
    }

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if username already exists
    const existingParent = await Parent.findOne({ username });
    if (existingParent) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Validate childId if provided
    if (childId && mongoose.Types.ObjectId.isValid(childId)) {
      const child = await Child.findById(childId);
      if (!child) {
        return res.status(400).json({ message: "Invalid child ID" });
      }
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const parent = new Parent({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      children:
        childId && mongoose.Types.ObjectId.isValid(childId) ? [childId] : [],
    });

    await parent.save();
    res.status(201).json({ message: "Parent registered successfully", parent });
  } catch (err) {
    console.error("Error in signupParent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { username, password } = req.body;

    const parent = await Parent.findOne({ username });
    if (!parent) {
      return res.status(400).json({ message: "Parent not found" });
    }

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: parent._id, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, parent });
  } catch (err) {
    console.error("Error in loginParent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getParentProfile = async (req, res) => {
  console.log("getParentProfile request for user:", req.user.id);
  try {
    const parent = await Parent.findById(req.user.id).populate("children");
    console.log("Parent profile retrieved:", parent);
    res.json(parent);
  } catch (err) {
    console.error("Error in getParentProfile:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateParentProfile = async (req, res) => {
  console.log(
    "updateParentProfile request:",
    req.body,
    "for user:",
    req.user.id
  );
  try {
    const updates = req.body;

    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const parent = await Parent.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });
    console.log("Parent profile updated:", parent);
    res.json({ message: "Profile updated", parent });
  } catch (err) {
    console.error("Error in updateParentProfile:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Child Management functions remain the same...
exports.addChildProfile = async (req, res) => {
  try {
    const { firstName, lastName, kindergartenLevel, kindergartenName } =
      req.body;
    const parentId = req.user.id;

    if (!firstName || !lastName || !kindergartenLevel || !kindergartenName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validLevels = ["K1", "K2", "K3"];
    if (!validLevels.includes(kindergartenLevel)) {
      return res.status(400).json({ message: "Invalid kindergarten level" });
    }

    const child = new Child({
      firstName,
      lastName,
      kindergartenLevel,
      kindergartenName,
      parentId,
    });

    await child.save();

    await Parent.findByIdAndUpdate(parentId, {
      $addToSet: { children: child._id },
    });

    const children = await Child.find({ parentId });
    res.status(201).json({ message: "Child profile created", child, children });
  } catch (err) {
    console.error("Error in addChildProfile:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getChildren = async (req, res) => {
  console.log("getChildren request for parent:", req.user.id);
  try {
    const children = await Child.find({ parentId: req.user.id });
    console.log("Children retrieved:", children);
    res.json(children);
  } catch (err) {
    console.error("Error in getChildren:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getChild = async (req, res) => {
  console.log("getChild request:", req.params, "for parent:", req.user.id);
  try {
    const { childId } = req.params;
    const child = await Child.findOne({ _id: childId, parentId: req.user.id });
    if (!child) {
      console.log("Child not found:", childId);
      return res.status(404).json({ message: "Child not found" });
    }
    console.log("Child retrieved:", child);
    res.json(child);
  } catch (err) {
    console.error("Error in getChild:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Homework Management functions remain mostly the same...
exports.getAssignedHomeworks = async (req, res) => {
  console.log("getAssignedHomeworks request for child:", req.params.childId);
  try {
    const { childId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid child ID" });
    }
    const child = await Child.findOne({ _id: childId, parentId: req.user.id });
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    const homeworks = await mongoose
      .model("HomeworkAssignment")
      .find({ assignedTo: childId });
    console.log("Assigned homeworks:", homeworks);
    res.json(homeworks);
  } catch (err) {
    console.error("Error in getAssignedHomeworks:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.startHomework = async (req, res) => {
  console.log("startHomework request:", req.params);
  try {
    const { homeworkId } = req.params;
    const homework = await mongoose
      .model("HomeworkAssignment")
      .findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    const response = {
      words: homework.words || [],
      mode: "parent-guided",
      allowManualSubmission:
        homework.allowManualSubmission ||
        homework.submissionType === "manual" ||
        homework.submissionType === "mixed",
      instructions: homework.instructions || null,
      submissionType: homework.submissionType || "audio",
    };

    res.json(response);
  } catch (err) {
    console.error("Error in startHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.uploadWordRecording = async (req, res) => {
  console.log("uploadWordRecording request:", req.params, req.body, req.file);
  try {
    const { homeworkId, wordId } = req.params;
    const { studentId, isParent } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(homeworkId) ||
      !mongoose.Types.ObjectId.isValid(wordId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const homework = await mongoose
      .model("HomeworkAssignment")
      .findById(homeworkId);
    if (!homework) {
      return res.status(400).json({ message: "Invalid homework ID" });
    }
    const word = homework.words.id(wordId);
    if (!word) {
      return res.status(400).json({ message: "Invalid word ID" });
    }
    const child = await Child.findOne({
      _id: studentId,
      parentId: req.user.id,
    });
    if (!child) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const score = Math.floor(Math.random() * 50 + 50); // Mock: 50-100
    const feedback =
      score > 80
        ? "Great job! 😊"
        : score > 50
        ? "Nice try! 😐 Work on clarity."
        : "Keep practicing! 😕";

    let submission = await Submission.findOne({
      homeworkId,
      studentId,
      parentId: req.user.id,
    });
    if (!submission) {
      submission = new Submission({
        homeworkId,
        studentId,
        parentId: req.user.id,
        recordings: [],
        submissionType: "audio",
      });
    }
    const recordingEntry = {
      wordId,
      [isParent ? "parentAudioUrl" : "childAudioUrl"]: req.file?.path,
      [isParent ? "parentScore" : "childScore"]: score,
      feedback,
    };
    submission.recordings.push(recordingEntry);
    await submission.save();

    console.log("Recording uploaded:", recordingEntry);
    res.json({ score, feedback, retriesLeft: 2 });
  } catch (err) {
    console.error("Error in uploadWordRecording:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.requestTeacher = async (req, res) => {
  console.log("requestTeacher request:", req.params, req.body);
  try {
    const { childId } = req.params;
    const { teacherId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(childId) ||
      !mongoose.Types.ObjectId.isValid(teacherId)
    ) {
      return res.status(400).json({ message: "Invalid child or teacher ID" });
    }

    const child = await Child.findOne({ _id: childId, parentId: req.user.id });
    if (!child) {
      return res
        .status(404)
        .json({ message: "Child not found or not linked to parent" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (child.pendingTeachers.includes(teacherId)) {
      return res.status(400).json({ message: "Request already pending" });
    }

    child.pendingTeachers.push(teacherId);
    await child.save();

    console.log("Teacher request sent:", teacherId);
    res.status(201).json({ message: "Teacher request sent", teacher });
  } catch (err) {
    console.error("Error in requestTeacher:", err.message);
    res.status(500).json({ error: err.message });
  }
};
