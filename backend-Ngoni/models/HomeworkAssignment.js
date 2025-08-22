const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeworkAssignmentSchema = new Schema(
    {
        title: { type: String, required: true },
        words: [
            {
                word: { type: String, required: true },
                example: { type: String, required: true }
            }
        ],
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
        dueDate: { type: Date, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomeworkAssignment", HomeworkAssignmentSchema);