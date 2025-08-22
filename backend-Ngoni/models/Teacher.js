const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],     //optional, might be used? 
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, sparse: true },
        kindergartenName: { type: String },
        role: { type: String, enum: ["teacher", "admin"], default: "teacher" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);