const Teacher = require("../models/Teacher");
const Homework = require("../models/HomeworkAssignment");
const Submission = require("../models/HomeworkSubmission");
const Feedback = require("../models/SubmissionFeedback");
const Child = require("../models/Child");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ------------------------
// Authentication / Profile
// ------------------------

exports.registerTeacher = async (req, res) => {
  console.log("registerTeacher request:", req.body);
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      console.log("Email already in use:", email);
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const teacher = new Teacher({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await teacher.save();
    console.log("Teacher registered successfully:", teacher);
    res
      .status(201)
      .json({ message: "Teacher registered successfully", teacher });
  } catch (err) {
    console.error("Error in registerTeacher:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.loginTeacher = async (req, res) => {
  console.log("loginTeacher request:", req.body);
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      console.log("Teacher not found:", email);
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      console.log("Invalid password for teacher:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Teacher logged in successfully:", {
      id: teacher._id,
      email: teacher.email,
    });
    res.json({ token, teacher });
  } catch (err) {
    console.error("Error in loginTeacher:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getTeacherProfile = async (req, res) => {
  console.log("getTeacherProfile request:", req.user.id);
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      console.log("Teacher not found:", req.user.id);
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ teacher });
  } catch (err) {
    console.error("Error in getTeacherProfile:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTeacherProfile = async (req, res) => {
  console.log(
    "updateTeacherProfile request: ",
    req.body,
    "for user: ",
    req.user.id
  );

  try {
    const updates = req.body;

    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const teacher = await Teacher.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });

    console.log("Teacher profile updated:", teacher);
    res.json({ message: "Profile updated", teacher });
  } catch (err) {
    console.error("Error in updateTeacherProfile:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ------------------------
// Homework Management
// ------------------------

exports.createHomework = async (req, res) => {
  console.log("createHomework request: ", req.body);
  try {
    const { title, words, assignedTo, createdBy, dueDate } = req.body;

    const homework = new Homework({
      title,
      words,
      assignedTo,
      createdBy,
      dueDate,
    });

    await homework.save();
    console.log("Homework created successfully:", homework);
    res
      .status(201)
      .json({ message: "Homework created successfully", homework });
  } catch (err) {
    console.error("Error in createHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHomeworkList = async (req, res) => {
  console.log("getHomeworkList request for teacher:", req.user.id);
  try {
    const homeworkList = await Homework.find({ createdBy: req.user.id });
    console.log("Homework list retrieved successfully:", homeworkList);
    res.json({ homeworkList });
  } catch (err) {
    console.error("Error in getHomeworkList:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHomeworkDetail = async (req, res) => {
  console.log(
    "getHomeworkDetail request: ",
    req.body,
    "for homework: ",
    req.user.id
  ); // might need to change to req.params.id
  try {
    const { homeworkId } = req.params;

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      console.log("Homework not found:", req.params.id);
      return res.status(404).json({ message: "Homework not found" });
    }

    res.json({ homework });
  } catch (err) {
    console.error("Error in getHomeworkDetail:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// PLEASE CHECK
exports.updateHomework = async (req, res) => {
  console.log(
    "updateHomework request: ",
    req.body,
    "for homework: ",
    req.params.id
  );
  try {
    const { homeworkId } = req.params;
    const updates = req.body;

    const homework = await Homework.findByIdAndUpdate(homeworkId, updates, {
      new: true,
    });
    if (!homework) {
      console.log("Homework not found:", homeworkId);
      return res.status(404).json({ message: "Homework not found" });
    }

    res.json({ message: "Homework updated successfully", homework });
  } catch (err) {
    console.error("Error in updateHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHomework = async (req, res) => {
  console.log("deleteHomework request: ", req.body);
  try {
    const { homeworkId } = req.params;

    const homework = await Homework.findByIdAndDelete(homeworkId);
    if (!homework) {
      console.log("Homework not found:", homeworkId);
      return res.status(404).json({ message: "Homework not found" });
    }

    res.json({ message: "Homework deleted successfully" });
  } catch (err) {
    console.error("Error in deleteHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getSubmissions = async (req, res) => {
  console.log("getSubmissions request: ", req.body);
  try {
    const { homeworkId } = req.params;

    const submissions = await Submission.find({ homeworkId });
    console.log("Submissions retrieved successfully:", submissions);
    res.json({ submissions });
  } catch (err) {
    console.error("Error in getSubmissions:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Teacher: get metrics for a specific homework (wraps parentController logic)
exports.getHomeworkMetrics = async (req, res) => {
  console.log('teacher getHomeworkMetrics request:', req.params);
  try {
    const homeworkId = req.params.homeworkId;
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) return res.status(400).json({ message: 'Invalid homework ID' });
    const submissions = await Submission.find({ homeworkId });
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(s => s.status === 'completed').length;
    const parentParticipation = submissions.filter(s => s.recordings.some(r => r.parentAudioUrl)).length;
    const avgScore = submissions.reduce((sum, s) => sum + (s.recordings.reduce((s2, r) => s2 + (r.parentScore || r.childScore || 0), 0) / (s.recordings.length || 1)), 0) / (totalSubmissions || 1);
    const metrics = {
      totalSubmissions,
      completedSubmissions,
      completionRate: totalSubmissions > 0 ? ((completedSubmissions / totalSubmissions) * 100).toFixed(2) : '0.00',
      parentParticipationRate: totalSubmissions > 0 ? ((parentParticipation / totalSubmissions) * 100).toFixed(2) : '0.00',
      averageScore: (avgScore || 0).toFixed(2)
    };
    res.json(metrics);
  } catch (err) {
    console.error('Error in teacher getHomeworkMetrics', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Teacher: remove a public post (moderation)
exports.deletePublicPost = async (req, res) => {
  console.log('deletePublicPost request:', req.params, req.body);
  try {
    const { postId } = req.params;
    // Our public posts are in-memory POSTS in publicController; for now emit an event to remove
    // For simplicity, call into the public posts array via require cache
    const publicController = require('../controllers/publicController');
    if (!publicController || !publicController.POSTS) {
      return res.status(500).json({ message: 'Public posts not available for deletion' });
    }
    const idx = publicController.POSTS.findIndex(p => String(p.id) === String(postId));
    if (idx === -1) return res.status(404).json({ message: 'Post not found' });
    const removed = publicController.POSTS.splice(idx, 1);
    res.json({ message: 'Post removed', post: removed[0] });
  } catch (err) {
    console.error('Error in deletePublicPost', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.provideFeedback = async (req, res) => {
  console.log(
    "provideFeedback request: ",
    req.body,
    "for submission",
    req.params.id
  );
  try {
    const { feedback, score } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      console.log("Submission not found:", req.params.id);
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.feedback = feedback;
    submission.score = score;
    const submission_feedback = {
      submissionId: submission._id,
      teacherId: req.user.id,
      feedback,
      score,
    };
    await Feedback.create(submission_feedback);

    res.json({ message: "Feedback provided successfully", submission });
  } catch (err) {
    console.error("Error in provideFeedback:", err.message);
    res.status(500).json({ error: err.message });
  }
};

`
getStudents – List all students a teacher is working with

getStudentProgress – Get homework completion metrics
`;

// ------------------------
// Student Management
// ------------------------

exports.getStudents = async (req, res) => {
  console.log("getStudents request: ", req.body);
  try {
    const students = await Teacher.findById(req.user.id).populate("students");
    res.json({ students });
  } catch (err) {
    console.error("Error in getStudents:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentProgress = async (req, res) => {
  console.log(
    "getStudentProgress request: ",
    req.body,
    "for student: ",
    req.params.id
  );
  try {
    const studentId = req.params.id;

    // 1. Find all homework assigned to this student
    const assignedHomework = await Homework.find({ assignedTo: studentId });
    const totalAssigned = assignedHomework.length;

    // 2. Find all submissions by this student
    const submissions = await Submission.find({ studentId });

    // 3. Calculate completed submissions
    const completedSubmissions = submissions.filter(
      (sub) => sub.status === "completed"
    );
    const totalCompleted = completedSubmissions.length;

    // 4. Calculate completion rate
    const completionRate =
      totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

    // 5. Calculate average score and average time taken (for completed submissions)
    let avgScore = null;
    if (completedSubmissions.length > 0) {
      const totalScore = completedSubmissions.reduce(
        (sum, sub) => sum + (sub.score || 0),
        0
      );
      avgScore = totalScore / completedSubmissions.length;
    }

    res.json({
      studentId,
      totalAssigned,
      totalCompleted,
      completionRate,
      avgScore,
    });
  } catch (err) {
    console.error("Error in getStudentProgress:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.addStudent = async (req, res) => {
  console.log("addStudent request:", req.body, "for teacher:", req.user.id);
  try {
    const { childId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      console.log("Invalid child ID:", childId);
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const child = await Child.findById(childId);
    if (!child) {
      console.log("Child not found:", childId);
      return res.status(404).json({ message: "Child not found" });
    }

    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      console.log("Teacher not found:", req.user.id);
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.students.includes(childId)) {
      console.log("Child already assigned to teacher:", childId);
      return res
        .status(400)
        .json({ message: "Child already assigned to teacher" });
    }

    teacher.students.push(childId);
    await teacher.save();

    console.log("Student added successfully:", childId);
    res.status(201).json({ message: "Student added successfully", child });
  } catch (err) {
    console.error("Error in addStudent:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.approveStudent = async (req, res) => {
  console.log("approveStudent request:", req.body, "for teacher:", req.user.id);
  try {
    const { childId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (!child.pendingTeachers.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "No pending request from this child" });
    }

    const teacher = await Teacher.findById(req.user.id);
    if (teacher.students.includes(childId)) {
      return res.status(400).json({ message: "Student already added" });
    }

    teacher.students.push(childId);
    await teacher.save();

    child.pendingTeachers = child.pendingTeachers.filter(
      (id) => id.toString() !== req.user.id.toString()
    );
    await child.save();

    console.log("Student approved:", childId);
    res.status(201).json({ message: "Student approved and added", child });
  } catch (err) {
    console.error("Error in approveStudent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingStudents = async (req, res) => {
  console.log("getPendingStudents request for teacher:", req.user.id);
  try {
    const children = await Child.find({ pendingTeachers: req.user.id }).select(
      "firstName lastName kindergartenName kindergartenLevel"
    );
    res.json({ pendingStudents: children });
  } catch (err) {
    console.error("Error in getPendingStudents:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHomeworkMetrics = async (req, res) => {
  console.log('getHomeworkMetrics (teacher) request:', req.params, 'for user:', req.user.id);
  try {
    const { homeworkId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({ message: 'Invalid homework ID' });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(400).json({ message: 'Invalid homework ID' });
    }

    const submissions = await Submission.find({ homeworkId });
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(s => s.status === 'completed').length;
    const parentParticipation = submissions.filter(s => s.recordings.some(r => r.parentAudioUrl)).length;

    const avgScore = submissions.reduce((sum, s) => sum + (s.recordings.reduce((s2, r) => s2 + (r.parentScore || r.childScore || 0), 0) / (s.recordings.length || 1)), 0) / (totalSubmissions || 1);

    const metrics = {
      totalSubmissions,
      completedSubmissions,
      completionRate: totalSubmissions > 0 ? ((completedSubmissions / totalSubmissions) * 100).toFixed(2) : '0.00',
      parentParticipationRate: totalSubmissions > 0 ? ((parentParticipation / totalSubmissions) * 100).toFixed(2) : '0.00',
      averageScore: (avgScore || 0).toFixed(2),
    };

    console.log('Teacher homework metrics:', metrics);
    res.json(metrics);
  } catch (err) {
    console.error('Error in getHomeworkMetrics (teacher):', err.message);
    res.status(500).json({ error: err.message });
  }
};
