const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeworkSchema = new Schema(
  {
    title: { type: String, required: true },
    words: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        text: { type: String, required: true }, // e.g., "CAT"
        definition: { type: String }, // Optional
      },
    ],
    mode: {
      type: String,
      enum: ["parent-guided", "student-only"],
      required: true,
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homework", HomeworkSchema);
