// SubmissionFeedback – submissionId, teacherId, feedback, score, timestamp

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubmissionFeedbackSchema = new Schema(
    {
        submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "HomeworkSubmission", required: true },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
        feedback: { type: String, required: true },
        score: { type: Number, min: 0, max: 100, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubmissionFeedback", SubmissionFeedbackSchema);