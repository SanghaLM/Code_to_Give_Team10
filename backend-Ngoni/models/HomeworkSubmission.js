const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeworkSubmissionSchema = new Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: "HomeworkAssignment",
=======
      ref: "Homework",
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9
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
    recordings: [
      {
        wordId: { type: mongoose.Schema.Types.ObjectId, required: true },
        parentAudioUrl: { type: String },
        childAudioUrl: { type: String },
        parentScore: { type: Number },
        childScore: { type: Number },
        feedback: { type: String }, // e.g., "Nice try! Work on clarity."
      },
    ],
    timeTakenSeconds: { type: Number },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeworkSubmission", HomeworkSubmissionSchema);
