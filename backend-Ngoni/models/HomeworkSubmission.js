const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeworkSubmissionSchema = new Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    audioUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    score: {
      type: Number,
    },
    completedAt: {
      type: Date,
    },
    timeTakenSeconds: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeworkSubmission", HomeworkSubmissionSchema);
