const Parent = require("../models/Parent");
const Child = require("../models/Child");
const Submission = require("../models/HomeworkSubmission");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher"); // Added

// ------------------------
// Authentication / Profile
// ------------------------
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

// ------------------------
// Child Management
// ------------------------
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

// ------------------------
// Homework Management
// ------------------------
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
    res.json({ words: homework.words, mode: "parent-guided" }); // Default to parent-guided
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

exports.submitHomework = async (req, res) => {
  console.log("submitHomework request:", req.body, req.params);
  try {
    const { homeworkId, studentId, timeTakenSeconds } = req.body;
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
      return res.status(400).json({ message: "No recordings found" });
    }

    submission.status = "completed";
    submission.timeTakenSeconds = timeTakenSeconds;
    submission.completedAt = new Date();
    await submission.save();

    const avgScore =
      submission.recordings.reduce(
        (sum, r) => sum + (r.parentScore || r.childScore || 0),
        0
      ) / submission.recordings.length;
    console.log("Homework submitted:", submission);
    res
      .status(201)
      .json({ message: "Homework submitted", submission, avgScore });
  } catch (err) {
    console.error("Error in submitHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

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
    const parentParticipation = submissions.filter((s) =>
      s.recordings.some((r) => r.parentAudioUrl)
    ).length;
    const avgScore =
      submissions.reduce(
        (sum, s) =>
          sum +
          s.recordings.reduce(
            (s2, r) => s2 + (r.parentScore || r.childScore || 0),
            0
          ) /
            s.recordings.length,
        0
      ) / totalSubmissions || 0;

    const metrics = {
      totalSubmissions,
      completedSubmissions,
      completionRate:
        totalSubmissions > 0
          ? ((completedSubmissions / totalSubmissions) * 100).toFixed(2)
          : "0.00",
      parentParticipationRate:
        totalSubmissions > 0
          ? ((parentParticipation / totalSubmissions) * 100).toFixed(2)
          : "0.00",
      averageScore: avgScore.toFixed(2),
      averageTimeTakenSeconds: (
        submissions.reduce((sum, s) => sum + (s.timeTakenSeconds || 0), 0) /
          totalSubmissions || 0
      ).toFixed(2),
    };

    console.log("Homework metrics:", metrics);
    res.json(metrics);
  } catch (err) {
    console.error("Error in getHomeworkMetrics:", err.message);
    res.status(500).json({ error: err.message });
  }
};

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
    });
    console.log("Submissions retrieved for child:", childId, submissions);
    res.json(submissions);
  } catch (err) {
    console.error("Error in getSubmissionsByChild:", err.message);
    res.status(500).json({ error: err.message });
  }
};

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
    });
    if (!submission) {
      console.log("Submission not found for homework:", homeworkId);
      return res.status(404).json({ message: "Submission not found" });
    }
    console.log("Submission retrieved:", submission);
    res.json(submission);
  } catch (err) {
    console.error("Error in getSubmissionByHomework:", err.message);
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

// exports.createTestHomework = async (req, res) => {
//   console.log("createTestHomework request for parent:", req.user.id);
//   try {
//     const { childId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(childId)) {
//       return res.status(400).json({ message: "Invalid child ID" });
//     }
//     const child = await mongoose
//       .model("Child")
//       .findOne({ _id: childId, parentId: req.user.id });
//     if (!child) {
//       return res
//         .status(404)
//         .json({ message: "Child not found or not linked to parent" });
//     }

//     const homework = new mongoose.model("HomeworkAssignment")({
//       title: "Pronunciation Practice",
//       words: [
//         { word: "CAT", example: "The cat is on the mat." },
//         { word: "DOG", example: "The dog barks loudly." },
//         { word: "SUN", example: "The sun shines brightly." },
//       ],
//       assignedTo: [childId],
//       createdBy: new mongoose.Types.ObjectId("68a89c2ba5105996446eadff"),
//       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
//     });

//     await homework.save();
//     console.log("Test homework created:", homework._id);
//     res.status(201).json({ message: "Test homework created", homework });
//   } catch (err) {
//     console.error("Error in createTestHomework:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };
