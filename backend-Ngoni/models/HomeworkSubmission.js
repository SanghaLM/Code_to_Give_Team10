const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    parentAudioUrl: {
      type: String,
      default: null,
    },
    childAudioUrl: {
      type: String,
      default: null,
    },
    parentScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    childScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
    attempts: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const manualSubmissionSchema = new mongoose.Schema({
  textContent: {
    type: String,
    default: "",
  },
  imageUrls: [
    {
      type: String,
    },
  ],
  fileUrls: [
    {
      type: String,
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const homeworkSubmissionSchema = new mongoose.Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeworkAssignment",
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
      enum: ["in-progress", "completed", "submitted", "reviewed"],
      default: "in-progress",
    },
    submissionType: {
      type: String,
      enum: ["audio", "manual", "mixed"],
      default: "audio",
    },
    // For audio submissions
    recordings: [recordingSchema],
    // For manual submissions
    manualSubmission: manualSubmissionSchema,
    manualScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    // Common fields
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    teacherFeedback: {
      type: String,
      default: "",
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating final score
homeworkSubmissionSchema.virtual("finalScore").get(function () {
  if (this.overallScore !== null) {
    return this.overallScore;
  }

  if (this.submissionType === "manual" && this.manualScore !== null) {
    return this.manualScore;
  }

  if (this.recordings && this.recordings.length > 0) {
    const totalScore = this.recordings.reduce((sum, recording) => {
      return sum + (recording.parentScore || recording.childScore || 0);
    }, 0);
    return Math.round(totalScore / this.recordings.length);
  }

  return 0;
});

// Virtual for checking if submission has any content
homeworkSubmissionSchema.virtual("hasContent").get(function () {
  const hasRecordings = this.recordings && this.recordings.length > 0;
  const hasManualContent =
    this.manualSubmission &&
    ((this.manualSubmission.textContent &&
      this.manualSubmission.textContent.trim().length > 0) ||
      (this.manualSubmission.imageUrls &&
        this.manualSubmission.imageUrls.length > 0) ||
      (this.manualSubmission.fileUrls &&
        this.manualSubmission.fileUrls.length > 0));

  return hasRecordings || hasManualContent;
});

// Pre-save middleware to automatically set completion status
homeworkSubmissionSchema.pre("save", function (next) {
  // Auto-set submittedAt when status changes to submitted
  if (this.status === "submitted" && !this.submittedAt) {
    this.submittedAt = new Date();
  }

  // Auto-set completedAt when status changes to completed
  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  }

  // Auto-set reviewedAt when status changes to reviewed
  if (this.status === "reviewed" && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }

  next();
});

// Static method to get submission statistics
homeworkSubmissionSchema.statics.getSubmissionStats = async function (
  homeworkId
) {
  const stats = await this.aggregate([
    { $match: { homeworkId: new mongoose.Types.ObjectId(homeworkId) } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        completedSubmissions: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        audioSubmissions: {
          $sum: {
            $cond: [{ $eq: ["$submissionType", "audio"] }, 1, 0],
          },
        },
        manualSubmissions: {
          $sum: {
            $cond: [{ $eq: ["$submissionType", "manual"] }, 1, 0],
          },
        },
        mixedSubmissions: {
          $sum: {
            $cond: [{ $eq: ["$submissionType", "mixed"] }, 1, 0],
          },
        },
        averageScore: {
          $avg: {
            $ifNull: [
              "$overallScore",
              {
                $ifNull: [
                  "$manualScore",
                  {
                    $avg: {
                      $map: {
                        input: "$recordings",
                        as: "recording",
                        in: {
                          $ifNull: [
                            "$$recording.parentScore",
                            "$$recording.childScore",
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
        averageTime: { $avg: "$timeTakenSeconds" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalSubmissions: 0,
      completedSubmissions: 0,
      audioSubmissions: 0,
      manualSubmissions: 0,
      mixedSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
    }
  );
};

// Instance method to calculate completion percentage
homeworkSubmissionSchema.methods.getCompletionPercentage = function () {
  if (this.status === "completed" || this.status === "submitted") {
    return 100;
  }

  if (this.submissionType === "manual") {
    return this.hasContent ? 50 : 0; // 50% if has some content, 100% when submitted
  }

  // For audio submissions, calculate based on recordings vs expected words
  if (this.recordings && this.recordings.length > 0) {
    // This would need the homework document to know total expected recordings
    // For now, return a basic calculation
    return Math.min(100, (this.recordings.length / 3) * 100); // Assuming 3 words per homework
  }

  return 0;
};

// Ensure virtual fields are included in JSON output
homeworkSubmissionSchema.set("toJSON", { virtuals: true });
homeworkSubmissionSchema.set("toObject", { virtuals: true });

// Create indexes for better query performance
homeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1, parentId: 1 });
homeworkSubmissionSchema.index({ studentId: 1, status: 1 });
homeworkSubmissionSchema.index({ homeworkId: 1, status: 1 });
homeworkSubmissionSchema.index({ parentId: 1, createdAt: -1 });

module.exports = mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);
