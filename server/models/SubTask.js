const mongoose = require("mongoose");

const SubTaskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SubTask", SubTaskSchema);
