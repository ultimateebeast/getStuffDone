const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  labels: [String],
  recurring: {
    type: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    interval: Number,
    daysOfWeek: [Number],
    endDate: Date,
  },
  kanban: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo",
  },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTask" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }],
  media: {
    name: String,
    url: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
