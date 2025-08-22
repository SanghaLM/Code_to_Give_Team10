const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChildSchema = new Schema(
  {
    firstName: { type: String, required: true }, // Make sure this matches
    lastName: { type: String, required: true }, // Make sure this matches
    kindergartenLevel: {
      type: String,
      required: true,
      enum: ["K1", "K2", "K3"],
    },
    kindergartenName: { type: String, required: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Child", ChildSchema);
