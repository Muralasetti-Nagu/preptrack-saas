const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    status: {
        type: String,
        enum: ["Solved", "Revision"],
        default: "Solved"
    }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);