const mongoose = require("mongoose");

const groupTaskSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GroupTask", groupTaskSchema);
