const Parent = require("../models/Parent");
const Child = require("../models/Child");
const Submission = require("../models/HomeworkSubmission");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ------------------------
// Authentication / Profile
// ------------------------

exports.signupParent = async (req, res) => {
  console.log("signupParent request:", req.body);
  try {
    const { firstName, lastName, email, phone, password, childId } = req.body;

    // Check if email already exists
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      console.log("Email already in use:", email);
      return res.status(400).json({ message: "Email already in use" });
    }

    // Validate childId if provided
    if (childId) {
      const child = await Child.findById(childId);
      if (!child) {
        console.log("Invalid child ID:", childId);
        return res.status(400).json({ message: "Invalid child ID" });
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const parent = new Parent({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      children: childId ? [childId] : [],
    });

    await parent.save();
    console.log("Parent registered successfully:", parent);
    res.status(201).json({ message: "Parent registered successfully", parent });
  } catch (err) {
    console.error("Error in signupParent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.loginParent = async (req, res) => {
  console.log("loginParent request:", req.body);
  try {
    const { email, password } = req.body;

    const parent = await Parent.findOne({ email });
    if (!parent) {
      console.log("Parent not found for email:", email);
      return res.status(400).json({ message: "Parent not found" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) {
      console.log("Incorrect password for email:", email);
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: parent._id, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Parent logged in successfully:", { id: parent._id, email });
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

    // If updating password, hash it first
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
// Homework Submissions
// ------------------------

exports.getSubmissionsByChild = async (req, res) => {
  console.log("getSubmissionsByChild request:", req.params);
  try {
    const { childId } = req.params;
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

exports.submitHomework = async (req, res) => {
  console.log(
    "submitHomework request:",
    req.body,
    req.params,
    "file:",
    req.file
  );
  try {
    const { homeworkId, studentId, timeTakenSeconds } = req.body;
    const parentId = req.user.id;

    // Validate studentId belongs to parent
    const child = await Child.findOne({ _id: studentId, parentId });
    if (!child) {
      console.log("Invalid child ID:", studentId);
      return res.status(400).json({ message: "Invalid child ID" });
    }

    // Validate homeworkId
    const homework = await mongoose.model("Homework").findById(homeworkId);
    if (!homework) {
      console.log("Invalid homework ID:", homeworkId);
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    const newSubmission = new Submission({
      homeworkId,
      parentId,
      studentId,
      status: "completed",
      timeTakenSeconds,
      audioUrl: req.file?.mimetype.includes("audio") ? req.file.path : null,
      videoUrl: req.file?.mimetype.includes("video") ? req.file.path : null,
      completedAt: new Date(),
    });

    await newSubmission.save();
    console.log("Homework submission saved:", newSubmission);
    res.status(201).json({
      message: "Homework submitted successfully",
      submission: newSubmission,
    });
  } catch (err) {
    console.error("Error in submitHomework:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHomeworkMetrics = async (req, res) => {
  console.log("getHomeworkMetrics request:", req.params);
  try {
    const { homeworkId } = req.params;

    // Validate homeworkId
    const homework = await mongoose.model("Homework").findById(homeworkId);
    if (!homework) {
      console.log("Invalid homework ID:", homeworkId);
      return res.status(400).json({ message: "Invalid homework ID" });
    }

    // Calculate metrics: completion rate and average time taken
    const submissions = await Submission.find({ homeworkId });
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(
      (sub) => sub.status === "completed"
    ).length;
    const completionRate =
      totalSubmissions > 0
        ? (completedSubmissions / totalSubmissions) * 100
        : 0;
    const avgTimeTaken =
      totalSubmissions > 0
        ? submissions.reduce(
            (sum, sub) => sum + (sub.timeTakenSeconds || 0),
            0
          ) / totalSubmissions
        : 0;

    const metrics = {
      totalSubmissions,
      completedSubmissions,
      completionRate: parseFloat(completionRate.toFixed(2)),
      averageTimeTakenSeconds: parseFloat(avgTimeTaken.toFixed(2)),
    };

    console.log("Homework metrics retrieved:", metrics);
    res.json(metrics);
  } catch (err) {
    console.error("Error in getHomeworkMetrics:", err.message);
    res.status(500).json({ error: err.message });
  }
};
