const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },

    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", ParentSchema);
