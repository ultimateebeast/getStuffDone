const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attachment", AttachmentSchema);
